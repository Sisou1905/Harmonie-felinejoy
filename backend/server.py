from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Harmonie Féline & Humaine API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")
    article_id: str = Field(default_factory=lambda: f"art_{uuid.uuid4().hex[:12]}")
    title: str
    slug: str
    excerpt: str
    content: str
    category: str  # human, animal, connection
    image_url: str
    author: str = "Équipe Harmonie"
    sources: List[dict] = []  # [{title, url}]
    tags: List[str] = []
    likes_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ArticleCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    category: str
    image_url: str
    sources: List[dict] = []
    tags: List[str] = []

class Comment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    comment_id: str = Field(default_factory=lambda: f"cmt_{uuid.uuid4().hex[:12]}")
    article_id: str
    user_id: str
    user_name: str
    user_picture: Optional[str] = None
    content: str
    status: str = "pending"  # pending, approved, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CommentCreate(BaseModel):
    article_id: str
    content: str

class Like(BaseModel):
    model_config = ConfigDict(extra="ignore")
    like_id: str = Field(default_factory=lambda: f"like_{uuid.uuid4().hex[:12]}")
    article_id: str
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Bookmark(BaseModel):
    model_config = ConfigDict(extra="ignore")
    bookmark_id: str = Field(default_factory=lambda: f"bm_{uuid.uuid4().hex[:12]}")
    article_id: str
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Newsletter(BaseModel):
    model_config = ConfigDict(extra="ignore")
    newsletter_id: str = Field(default_factory=lambda: f"nl_{uuid.uuid4().hex[:12]}")
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsletterCreate(BaseModel):
    email: EmailStr

# ==================== AUTH HELPERS ====================

async def get_current_user(request: Request) -> Optional[User]:
    """Get current user from session token in cookies or Authorization header"""
    session_token = request.cookies.get("session_token")
    
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        return None
    
    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session_doc:
        return None
    
    # Check expiry with timezone awareness
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}
    )
    
    if not user_doc:
        return None
    
    return User(**user_doc)

async def require_auth(request: Request) -> User:
    """Require authentication - raises 401 if not authenticated"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    """Exchange session_id from Emergent Auth for user data and set cookie"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Call Emergent Auth to get session data
    async with httpx.AsyncClient() as client:
        try:
            auth_response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            if auth_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
            
            auth_data = auth_response.json()
        except Exception as e:
            logger.error(f"Auth error: {e}")
            raise HTTPException(status_code=500, detail="Authentication failed")
    
    # Check if user exists
    existing_user = await db.users.find_one(
        {"email": auth_data["email"]},
        {"_id": 0}
    )
    
    if existing_user:
        user_id = existing_user["user_id"]
        # Update user info
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": auth_data["name"],
                "picture": auth_data.get("picture")
            }}
        )
    else:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        new_user = {
            "user_id": user_id,
            "email": auth_data["email"],
            "name": auth_data["name"],
            "picture": auth_data.get("picture"),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(new_user)
    
    # Create session
    session_token = auth_data.get("session_token", f"sess_{uuid.uuid4().hex}")
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Remove old sessions for this user
    await db.user_sessions.delete_many({"user_id": user_id})
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    # Get user data
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return user_doc

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current authenticated user"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user.model_dump()

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user and clear session"""
    session_token = request.cookies.get("session_token")
    
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out"}

# ==================== ARTICLE ROUTES ====================

@api_router.get("/articles", response_model=List[dict])
async def get_articles(category: Optional[str] = None, limit: int = 20):
    """Get all articles, optionally filtered by category"""
    query = {}
    if category:
        query["category"] = category
    
    articles = await db.articles.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return articles

@api_router.get("/articles/{slug}")
async def get_article(slug: str):
    """Get single article by slug"""
    article = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@api_router.post("/articles", response_model=dict)
async def create_article(article: ArticleCreate):
    """Create new article (admin only in production)"""
    article_dict = article.model_dump()
    article_obj = Article(**article_dict)
    doc = article_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.articles.insert_one(doc)
    return doc

# ==================== COMMENT ROUTES ====================

@api_router.get("/articles/{article_id}/comments", response_model=List[dict])
async def get_comments(article_id: str):
    """Get approved comments for an article (public)"""
    comments = await db.comments.find(
        {"article_id": article_id, "status": "approved"},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return comments

@api_router.post("/comments", response_model=dict)
async def create_comment(comment: CommentCreate, request: Request):
    """Create a comment (requires authentication)"""
    user = await require_auth(request)
    
    comment_obj = Comment(
        article_id=comment.article_id,
        user_id=user.user_id,
        user_name=user.name,
        user_picture=user.picture,
        content=comment.content
    )
    
    doc = comment_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.comments.insert_one(doc)
    return doc

@api_router.delete("/comments/{comment_id}")
async def delete_comment(comment_id: str, request: Request):
    """Delete a comment (only by owner)"""
    user = await require_auth(request)
    
    comment = await db.comments.find_one({"comment_id": comment_id}, {"_id": 0})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment["user_id"] != user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.comments.delete_one({"comment_id": comment_id})
    return {"message": "Comment deleted"}

# ==================== LIKE ROUTES ====================

@api_router.post("/articles/{article_id}/like")
async def toggle_like(article_id: str, request: Request):
    """Toggle like on an article"""
    user = await require_auth(request)
    
    existing_like = await db.likes.find_one({
        "article_id": article_id,
        "user_id": user.user_id
    })
    
    if existing_like:
        await db.likes.delete_one({"like_id": existing_like["like_id"]})
        await db.articles.update_one(
            {"article_id": article_id},
            {"$inc": {"likes_count": -1}}
        )
        return {"liked": False}
    else:
        like = Like(article_id=article_id, user_id=user.user_id)
        doc = like.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.likes.insert_one(doc)
        await db.articles.update_one(
            {"article_id": article_id},
            {"$inc": {"likes_count": 1}}
        )
        return {"liked": True}

@api_router.get("/articles/{article_id}/like-status")
async def get_like_status(article_id: str, request: Request):
    """Check if current user has liked an article"""
    user = await get_current_user(request)
    if not user:
        return {"liked": False}
    
    existing_like = await db.likes.find_one({
        "article_id": article_id,
        "user_id": user.user_id
    })
    
    return {"liked": existing_like is not None}

# ==================== BOOKMARK ROUTES ====================

@api_router.post("/articles/{article_id}/bookmark")
async def toggle_bookmark(article_id: str, request: Request):
    """Toggle bookmark on an article"""
    user = await require_auth(request)
    
    existing_bookmark = await db.bookmarks.find_one({
        "article_id": article_id,
        "user_id": user.user_id
    })
    
    if existing_bookmark:
        await db.bookmarks.delete_one({"bookmark_id": existing_bookmark["bookmark_id"]})
        return {"bookmarked": False}
    else:
        bookmark = Bookmark(article_id=article_id, user_id=user.user_id)
        doc = bookmark.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.bookmarks.insert_one(doc)
        return {"bookmarked": True}

@api_router.get("/articles/{article_id}/bookmark-status")
async def get_bookmark_status(article_id: str, request: Request):
    """Check if current user has bookmarked an article"""
    user = await get_current_user(request)
    if not user:
        return {"bookmarked": False}
    
    existing_bookmark = await db.bookmarks.find_one({
        "article_id": article_id,
        "user_id": user.user_id
    })
    
    return {"bookmarked": existing_bookmark is not None}

@api_router.get("/user/bookmarks", response_model=List[dict])
async def get_user_bookmarks(request: Request):
    """Get all bookmarked articles for current user"""
    user = await require_auth(request)
    
    bookmarks = await db.bookmarks.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(100)
    
    article_ids = [b["article_id"] for b in bookmarks]
    articles = await db.articles.find(
        {"article_id": {"$in": article_ids}},
        {"_id": 0}
    ).to_list(100)
    
    return articles

# ==================== NEWSLETTER ROUTES ====================

@api_router.post("/newsletter", response_model=dict)
async def subscribe_newsletter(data: NewsletterCreate):
    """Subscribe to newsletter"""
    existing = await db.newsletter.find_one({"email": data.email})
    if existing:
        return {"message": "Already subscribed", "email": data.email}
    
    newsletter = Newsletter(email=data.email)
    doc = newsletter.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.newsletter.insert_one(doc)
    return {"message": "Subscribed successfully", "email": data.email}

# ==================== HEALTH & UTILS ====================

@api_router.get("/")
async def root():
    return {"message": "Harmonie Féline & Humaine API"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# ==================== SEED DATA ====================

@api_router.post("/seed")
async def seed_data():
    """Seed initial articles data"""
    # Check if already seeded
    existing = await db.articles.count_documents({})
    if existing > 0:
        return {"message": "Data already seeded", "count": existing}
    
    articles = [
        # Human Wellness Articles
        {
            "article_id": f"art_{uuid.uuid4().hex[:12]}",
            "title": "Les Bienfaits de la Méditation sur le Stress",
            "slug": "bienfaits-meditation-stress",
            "excerpt": "Découvrez comment la méditation quotidienne peut transformer votre gestion du stress et améliorer votre bien-être mental.",
            "content": """
## Introduction

La méditation est une pratique millénaire qui a prouvé ses bienfaits sur la santé mentale et physique. Des études scientifiques récentes confirment son efficacité pour réduire le stress et l'anxiété.

## Les Effets sur le Cerveau

La méditation modifie positivement la structure cérébrale, notamment en augmentant la matière grise dans l'hippocampe, zone liée à la mémoire et à la régulation émotionnelle.

## Comment Débuter

Commencez par 5 minutes par jour dans un endroit calme. Concentrez-vous sur votre respiration. Progressivement, augmentez la durée de vos séances.

## Techniques Recommandées

1. **Méditation de pleine conscience** : Observez vos pensées sans jugement
2. **Méditation guidée** : Suivez une voix qui vous accompagne
3. **Méditation par la respiration** : Focalisez-vous sur votre souffle

## Conclusion

La régularité est la clé. Même quelques minutes quotidiennes peuvent apporter des changements significatifs dans votre vie.
            """,
            "category": "human",
            "image_url": "https://images.pexels.com/photos/5357527/pexels-photo-5357527.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "author": "Dr. Marie Laurent",
            "sources": [
                {"title": "NCBI - Effects of Meditation on Stress", "url": "https://www.ncbi.nlm.nih.gov/"},
                {"title": "Harvard Health - Meditation Benefits", "url": "https://www.health.harvard.edu/"}
            ],
            "tags": ["méditation", "stress", "bien-être mental", "relaxation"],
            "likes_count": 42,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "article_id": f"art_{uuid.uuid4().hex[:12]}",
            "title": "L'Importance du Sommeil pour la Santé",
            "slug": "importance-sommeil-sante",
            "excerpt": "Le sommeil est un pilier fondamental de notre santé. Apprenez à optimiser vos nuits pour une meilleure qualité de vie.",
            "content": """
## Pourquoi le Sommeil est Essentiel

Le sommeil n'est pas un luxe mais une nécessité biologique. Durant la nuit, notre corps se régénère, consolide les souvenirs et régule les hormones.

## Les Cycles du Sommeil

Un cycle de sommeil dure environ 90 minutes et comprend plusieurs phases : sommeil léger, sommeil profond et sommeil paradoxal (REM).

## Conseils pour Mieux Dormir

- **Horaires réguliers** : Couchez-vous et levez-vous à heures fixes
- **Environnement optimal** : Chambre fraîche, sombre et silencieuse
- **Évitez les écrans** : Au moins 1h avant le coucher
- **Pas de caféine** : Après 14h pour la plupart des gens

## Les Conséquences du Manque de Sommeil

Le manque chronique de sommeil augmente les risques de maladies cardiovasculaires, d'obésité et de dépression.

## Conclusion

Investir dans votre sommeil, c'est investir dans votre santé globale.
            """,
            "category": "human",
            "image_url": "https://images.unsplash.com/photo-1556383689-b86b57bac7a0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHw0fHxoZWFsdGh5JTIwaGVyYmFsJTIwdGVhJTIwYW5kJTIwYm9va3MlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzcyMTQ3MjMzfDA&ixlib=rb-4.1.0&q=85",
            "author": "Dr. Pierre Dubois",
            "sources": [
                {"title": "Sleep Foundation", "url": "https://www.sleepfoundation.org/"},
                {"title": "WHO Sleep Guidelines", "url": "https://www.who.int/"}
            ],
            "tags": ["sommeil", "santé", "récupération", "bien-être"],
            "likes_count": 38,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        # Animal Wellness Articles
        {
            "article_id": f"art_{uuid.uuid4().hex[:12]}",
            "title": "Comprendre le Langage Corporel de Votre Chat",
            "slug": "langage-corporel-chat",
            "excerpt": "Apprenez à décoder les signaux que votre chat vous envoie pour mieux communiquer avec lui.",
            "content": """
## Introduction

Les chats communiquent principalement par leur corps. Comprendre ces signaux renforce votre lien avec votre compagnon félin.

## La Queue : Un Indicateur Clé

- **Queue haute** : Chat confiant et heureux
- **Queue gonflée** : Peur ou agression
- **Queue qui remue doucement** : Concentration
- **Queue entre les pattes** : Soumission ou anxiété

## Les Oreilles

- **Vers l'avant** : Curiosité et attention
- **Aplaties** : Peur ou irritation
- **Tournées sur le côté** : Détente

## Le Ronronnement

Contrairement aux idées reçues, le ronronnement n'indique pas toujours le bonheur. Les chats ronronnent aussi pour se calmer en situation de stress.

## Les Yeux

- **Pupilles dilatées** : Excitation ou peur
- **Clignement lent** : Affection (le "baiser de chat")

## Conclusion

Observer votre chat vous permettra de mieux répondre à ses besoins et de renforcer votre relation.
            """,
            "category": "animal",
            "image_url": "https://images.pexels.com/photos/675463/pexels-photo-675463.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "author": "Dr. Sophie Martin, vétérinaire",
            "sources": [
                {"title": "Journal of Feline Medicine", "url": "https://journals.sagepub.com/"},
                {"title": "ASPCA Cat Behavior", "url": "https://www.aspca.org/"}
            ],
            "tags": ["chat", "comportement félin", "communication", "bien-être animal"],
            "likes_count": 67,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "article_id": f"art_{uuid.uuid4().hex[:12]}",
            "title": "Nutrition Optimale pour les Chats Seniors",
            "slug": "nutrition-chat-senior",
            "excerpt": "Les besoins nutritionnels de votre chat évoluent avec l'âge. Découvrez comment adapter son alimentation.",
            "content": """
## Quand Mon Chat Devient-il Senior ?

Un chat est généralement considéré comme senior à partir de 7-10 ans. Ses besoins nutritionnels changent progressivement.

## Les Besoins Spécifiques

### Protéines
Les chats seniors ont besoin de protéines de haute qualité pour maintenir leur masse musculaire. Privilégiez les sources animales.

### Acides Gras
Les oméga-3 et oméga-6 soutiennent la santé articulaire, le pelage et les fonctions cognitives.

### Hydratation
Les chats âgés sont plus sujets aux problèmes rénaux. Encouragez la consommation d'eau avec des fontaines ou de la nourriture humide.

## Signes à Surveiller

- Perte ou prise de poids soudaine
- Changement d'appétit
- Problèmes digestifs fréquents

## Compléments Alimentaires

Consultez votre vétérinaire pour des suppléments adaptés comme la glucosamine pour les articulations.

## Conclusion

Une alimentation adaptée peut significativement améliorer la qualité de vie de votre chat senior.
            """,
            "category": "animal",
            "image_url": "https://images.pexels.com/photos/31712398/pexels-photo-31712398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "author": "Dr. Anne Lefèvre, nutritionniste vétérinaire",
            "sources": [
                {"title": "Veterinary Nutrition Society", "url": "https://vetnutrition.tufts.edu/"},
                {"title": "Cornell Feline Health Center", "url": "https://www.vet.cornell.edu/"}
            ],
            "tags": ["chat senior", "nutrition féline", "santé", "alimentation"],
            "likes_count": 45,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        # Connection Articles
        {
            "article_id": f"art_{uuid.uuid4().hex[:12]}",
            "title": "Les Bienfaits Thérapeutiques de la Présence Animale",
            "slug": "bienfaits-therapeutiques-animaux",
            "excerpt": "La science confirme ce que les propriétaires d'animaux savent intuitivement : nos compagnons sont bons pour notre santé.",
            "content": """
## La Zoothérapie : Une Science Reconnue

La présence d'animaux de compagnie a des effets mesurables sur notre santé physique et mentale.

## Effets sur la Santé Physique

### Système Cardiovasculaire
Des études montrent que caresser un animal réduit la pression artérielle et le rythme cardiaque.

### Système Immunitaire
Les enfants grandissant avec des animaux développent un système immunitaire plus robuste.

## Effets sur la Santé Mentale

### Réduction du Stress
L'hormone ocytocine (hormone du bonheur) augmente lors des interactions avec nos animaux.

### Combat contre la Dépression
La présence d'un animal réduit les sentiments de solitude et donne un sentiment de purpose.

## Le Lien Spécial Humain-Félin

Les chats, avec leur ronronnement apaisant et leur présence discrète, sont particulièrement efficaces pour réduire l'anxiété.

## Conclusion

Nos animaux ne sont pas de simples compagnons ; ils sont de véritables partenaires de bien-être.
            """,
            "category": "connection",
            "image_url": "https://images.unsplash.com/photo-1672312123315-8a4808e1027e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHw0fHx3b21hbiUyMGhvbGRpbmclMjBjYXQlMjBhZmZlY3Rpb25hdGUlMjBwYXN0ZWx8ZW58MHx8fHwxNzcyMTQ3MjMyfDA&ixlib=rb-4.1.0&q=85",
            "author": "Dr. Claire Rousseau, psychologue",
            "sources": [
                {"title": "Human-Animal Bond Research Institute", "url": "https://habri.org/"},
                {"title": "NIH - Pet Therapy Studies", "url": "https://www.nih.gov/"}
            ],
            "tags": ["zoothérapie", "bien-être", "lien humain-animal", "santé mentale"],
            "likes_count": 89,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "article_id": f"art_{uuid.uuid4().hex[:12]}",
            "title": "Comment Votre État Émotionnel Affecte Votre Chat",
            "slug": "etat-emotionnel-affecte-chat",
            "excerpt": "Les chats sont des éponges émotionnelles. Découvrez comment votre humeur influence le comportement de votre félin.",
            "content": """
## Une Connexion Émotionnelle Profonde

Les recherches montrent que les chats sont sensibles aux émotions de leurs propriétaires et adaptent leur comportement en conséquence.

## Comment les Chats Perçoivent Nos Émotions

### Les Signaux Verbaux
Les chats réagissent au ton de notre voix. Une voix calme les apaise, tandis qu'une voix stressée peut les rendre anxieux.

### Le Langage Corporel
Nos postures et mouvements communiquent notre état émotionnel aux chats.

### Les Phéromones
Le stress humain produit des changements chimiques que les chats peuvent détecter.

## Impact sur le Comportement Félin

- **Propriétaire stressé** → Chat plus distant ou au contraire plus collant
- **Propriétaire calme** → Chat détendu et joueur
- **Propriétaire triste** → Chat qui cherche le contact physique

## Prendre Soin de Soi pour Prendre Soin d'Eux

En gérant votre propre stress, vous créez un environnement plus serein pour votre chat.

## Conclusion

La relation avec votre chat est un miroir. Votre bien-être et le sien sont intimement liés.
            """,
            "category": "connection",
            "image_url": "https://images.unsplash.com/photo-1704572958353-9e0a476cb687?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHw0fHxjdXRlJTIwY2F0JTIwc2xlZXBpbmclMjBvbiUyMHNvZnQlMjBibGFua2V0fGVufDB8fHx8MTc3MjE0NzIzMXww&ixlib=rb-4.1.0&q=85",
            "author": "Dr. Émilie Blanc, comportementaliste",
            "sources": [
                {"title": "Animal Cognition Journal", "url": "https://link.springer.com/"},
                {"title": "Cat Behavior Associates", "url": "https://catbehaviorassociates.com/"}
            ],
            "tags": ["émotions", "comportement", "lien humain-chat", "bien-être mutuel"],
            "likes_count": 73,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.articles.insert_many(articles)
    return {"message": "Data seeded successfully", "count": len(articles)}

# ==================== ADMIN ROUTES ====================

# Admin emails - add your email here to get admin access
ADMIN_EMAILS = ["admin@harmonie.com"]

async def require_admin(request: Request) -> User:
    """Require admin authentication"""
    user = await require_auth(request)
    # For now, all authenticated users can be admin (you can restrict by email)
    # if user.email not in ADMIN_EMAILS:
    #     raise HTTPException(status_code=403, detail="Admin access required")
    return user

@api_router.get("/admin/stats")
async def get_admin_stats(request: Request):
    """Get admin dashboard statistics"""
    user = await require_admin(request)
    
    articles_count = await db.articles.count_documents({})
    users_count = await db.users.count_documents({})
    comments_count = await db.comments.count_documents({})
    newsletter_count = await db.newsletter.count_documents({})
    
    # Articles by category
    human_count = await db.articles.count_documents({"category": "human"})
    animal_count = await db.articles.count_documents({"category": "animal"})
    connection_count = await db.articles.count_documents({"category": "connection"})
    
    # Recent activity
    recent_comments = await db.comments.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    recent_subscribers = await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    
    return {
        "articles": {
            "total": articles_count,
            "human": human_count,
            "animal": animal_count,
            "connection": connection_count
        },
        "users": users_count,
        "comments": comments_count,
        "newsletter_subscribers": newsletter_count,
        "recent_comments": recent_comments,
        "recent_subscribers": recent_subscribers
    }

@api_router.post("/admin/articles")
async def admin_create_article(article: ArticleCreate, request: Request):
    """Admin: Create a new article"""
    user = await require_admin(request)
    
    # Check if slug already exists
    existing = await db.articles.find_one({"slug": article.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Article with this slug already exists")
    
    article_obj = Article(
        **article.model_dump(),
        author=user.name
    )
    
    doc = article_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.articles.insert_one(doc)
    return doc

@api_router.put("/admin/articles/{article_id}")
async def admin_update_article(article_id: str, article: ArticleCreate, request: Request):
    """Admin: Update an existing article"""
    user = await require_admin(request)
    
    existing = await db.articles.find_one({"article_id": article_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Article not found")
    
    update_data = article.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.articles.update_one(
        {"article_id": article_id},
        {"$set": update_data}
    )
    
    updated = await db.articles.find_one({"article_id": article_id}, {"_id": 0})
    return updated

@api_router.delete("/admin/articles/{article_id}")
async def admin_delete_article(article_id: str, request: Request):
    """Admin: Delete an article"""
    user = await require_admin(request)
    
    existing = await db.articles.find_one({"article_id": article_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Article not found")
    
    await db.articles.delete_one({"article_id": article_id})
    await db.comments.delete_many({"article_id": article_id})
    await db.likes.delete_many({"article_id": article_id})
    await db.bookmarks.delete_many({"article_id": article_id})
    
    return {"message": "Article deleted successfully"}

@api_router.get("/admin/newsletter/subscribers")
async def get_newsletter_subscribers(request: Request):
    """Admin: Get all newsletter subscribers"""
    user = await require_admin(request)
    
    subscribers = await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return subscribers

# ==================== SEARCH ROUTES ====================

@api_router.get("/search")
async def search_articles(q: Optional[str] = None, category: Optional[str] = None, tags: Optional[str] = None):
    """Search articles by query, category, and tags"""
    query = {}
    
    # Text search on title, excerpt, content
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"excerpt": {"$regex": q, "$options": "i"}},
            {"content": {"$regex": q, "$options": "i"}},
            {"tags": {"$regex": q, "$options": "i"}}
        ]
    
    if category:
        query["category"] = category
    
    if tags:
        tag_list = [t.strip() for t in tags.split(",")]
        query["tags"] = {"$in": tag_list}
    
    articles = await db.articles.find(query, {"_id": 0}).sort("created_at", -1).limit(50).to_list(50)
    return articles

@api_router.get("/tags")
async def get_all_tags():
    """Get all unique tags with counts"""
    pipeline = [
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$project": {"tag": "$_id", "count": 1, "_id": 0}}
    ]
    
    tags = await db.articles.aggregate(pipeline).to_list(100)
    return tags

# ==================== LANDING PAGES DATA ====================

LANDING_PAGES = {
    "meditation-debutant": {
        "slug": "meditation-debutant",
        "title": "Méditation pour Débutants | Guide Complet",
        "meta_title": "Méditation Débutant : Guide Complet pour Commencer la Méditation",
        "meta_description": "Découvrez comment débuter la méditation simplement. Techniques faciles, bienfaits prouvés et conseils pratiques pour les débutants en méditation.",
        "keywords": ["méditation débutant", "apprendre méditation", "méditation facile", "techniques méditation", "bienfaits méditation"],
        "hero_title": "Commencez votre voyage vers la sérénité",
        "hero_subtitle": "La méditation pour débutants : techniques simples et efficaces",
        "content_blocks": [
            {
                "type": "intro",
                "title": "Pourquoi commencer la méditation ?",
                "content": "La méditation est une pratique millénaire qui a fait ses preuves pour réduire le stress, améliorer la concentration et favoriser le bien-être mental. Pas besoin d'être un expert pour commencer."
            },
            {
                "type": "steps",
                "title": "5 étapes pour débuter",
                "items": [
                    "Trouvez un endroit calme et confortable",
                    "Commencez par 5 minutes par jour",
                    "Concentrez-vous sur votre respiration",
                    "Acceptez que votre esprit vagabonde",
                    "Soyez régulier plutôt que parfait"
                ]
            },
            {
                "type": "benefits",
                "title": "Les bienfaits scientifiquement prouvés",
                "items": [
                    "Réduction du stress et de l'anxiété",
                    "Amélioration de la qualité du sommeil",
                    "Meilleure gestion des émotions",
                    "Augmentation de la concentration"
                ]
            }
        ],
        "related_category": "human",
        "cta_text": "Découvrez nos articles sur la méditation"
    },
    "sante-chat-senior": {
        "slug": "sante-chat-senior",
        "title": "Santé du Chat Senior | Conseils Vétérinaires",
        "meta_title": "Santé Chat Senior : Guide Complet pour Prendre Soin de Votre Chat Âgé",
        "meta_description": "Tout savoir sur la santé du chat senior. Nutrition adaptée, signes de vieillissement, visites vétérinaires et conseils pour un chat âgé heureux et en bonne santé.",
        "keywords": ["chat senior", "santé chat âgé", "nutrition chat senior", "vieux chat", "soins chat âgé"],
        "hero_title": "Prenez soin de votre compagnon senior",
        "hero_subtitle": "Guide complet pour la santé et le bonheur de votre chat âgé",
        "content_blocks": [
            {
                "type": "intro",
                "title": "Quand mon chat devient-il senior ?",
                "content": "Un chat est généralement considéré comme senior à partir de 7-10 ans. À cet âge, ses besoins nutritionnels et médicaux évoluent. Une attention particulière permet de lui assurer une vieillesse heureuse."
            },
            {
                "type": "checklist",
                "title": "Les signes à surveiller",
                "items": [
                    "Changement d'appétit ou de poids",
                    "Diminution de l'activité physique",
                    "Problèmes de mobilité ou d'articulations",
                    "Changements dans les habitudes de toilettage",
                    "Modifications du comportement"
                ]
            },
            {
                "type": "tips",
                "title": "Conseils pour un chat senior en bonne santé",
                "items": [
                    "Alimentation adaptée riche en protéines de qualité",
                    "Visites vétérinaires régulières (2x par an)",
                    "Environnement confortable et accessible",
                    "Stimulation mentale adaptée à son rythme"
                ]
            }
        ],
        "related_category": "animal",
        "cta_text": "Découvrez nos articles sur le bien-être félin"
    },
    "zootherapie-bienfaits": {
        "slug": "zootherapie-bienfaits",
        "title": "Zoothérapie : Les Bienfaits Prouvés de la Présence Animale",
        "meta_title": "Zoothérapie : Bienfaits Thérapeutiques des Animaux sur la Santé",
        "meta_description": "Découvrez les bienfaits scientifiquement prouvés de la zoothérapie. Comment la présence d'animaux améliore notre santé physique et mentale.",
        "keywords": ["zoothérapie", "thérapie animale", "bienfaits animaux", "santé mentale animaux", "connexion humain-animal"],
        "hero_title": "Le pouvoir thérapeutique de la connexion animale",
        "hero_subtitle": "Découvrez comment nos compagnons améliorent notre santé",
        "content_blocks": [
            {
                "type": "intro",
                "title": "Qu'est-ce que la zoothérapie ?",
                "content": "La zoothérapie utilise la présence d'animaux pour améliorer le bien-être physique et mental des personnes. Cette approche est aujourd'hui reconnue et utilisée dans de nombreux contextes thérapeutiques."
            },
            {
                "type": "science",
                "title": "Ce que dit la science",
                "items": [
                    "Réduction de la pression artérielle",
                    "Augmentation de l'ocytocine (hormone du bonheur)",
                    "Diminution du cortisol (hormone du stress)",
                    "Amélioration de l'humeur et réduction de l'anxiété"
                ]
            },
            {
                "type": "applications",
                "title": "Applications thérapeutiques",
                "items": [
                    "Hôpitaux et maisons de retraite",
                    "Accompagnement des troubles autistiques",
                    "Aide aux personnes souffrant de dépression",
                    "Soutien aux victimes de traumatismes"
                ]
            }
        ],
        "related_category": "connection",
        "cta_text": "Explorez le lien humain-animal"
    }
}

@api_router.get("/landing-pages")
async def get_landing_pages():
    """Get all available landing pages"""
    return list(LANDING_PAGES.values())

@api_router.get("/landing-pages/{slug}")
async def get_landing_page(slug: str):
    """Get a specific landing page by slug"""
    if slug not in LANDING_PAGES:
        raise HTTPException(status_code=404, detail="Landing page not found")
    
    page_data = LANDING_PAGES[slug]
    
    # Get related articles
    related_articles = await db.articles.find(
        {"category": page_data["related_category"]},
        {"_id": 0}
    ).sort("created_at", -1).limit(3).to_list(3)
    
    return {
        **page_data,
        "related_articles": related_articles
    }

# ==================== NEWSLETTER CAMPAIGN ====================

class NewsletterCampaign(BaseModel):
    model_config = ConfigDict(extra="ignore")
    campaign_id: str = Field(default_factory=lambda: f"camp_{uuid.uuid4().hex[:12]}")
    subject: str
    content: str
    articles: List[str] = []  # article_ids
    sent_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

@api_router.get("/admin/newsletter/campaigns")
async def get_newsletter_campaigns(request: Request):
    """Admin: Get all newsletter campaigns"""
    user = await require_admin(request)
    
    campaigns = await db.newsletter_campaigns.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return campaigns

@api_router.post("/admin/newsletter/campaigns")
async def create_newsletter_campaign(request: Request):
    """Admin: Create a newsletter campaign with recent articles"""
    user = await require_admin(request)
    body = await request.json()
    
    subject = body.get("subject", "Nouveautés de la semaine sur Harmonie")
    custom_content = body.get("content", "")
    
    # Get recent articles from the past week
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    recent_articles = await db.articles.find(
        {"created_at": {"$gte": week_ago.isoformat()}},
        {"_id": 0}
    ).sort("created_at", -1).limit(5).to_list(5)
    
    # If no recent articles, get the latest ones
    if not recent_articles:
        recent_articles = await db.articles.find({}, {"_id": 0}).sort("created_at", -1).limit(3).to_list(3)
    
    # Build email content
    articles_html = ""
    for article in recent_articles:
        articles_html += f"""
        <div style="margin-bottom: 20px; padding: 15px; background: #f5f7f6; border-radius: 12px;">
            <h3 style="color: #5FA098; margin: 0 0 10px 0;">{article['title']}</h3>
            <p style="color: #5C6B64; margin: 0;">{article['excerpt']}</p>
        </div>
        """
    
    email_content = f"""
    <div style="font-family: 'Manrope', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #5FA098; font-family: 'Fraunces', serif;">Harmonie Féline & Humaine</h1>
        </div>
        
        {f'<p style="color: #1A2F23; font-size: 16px; line-height: 1.6;">{custom_content}</p>' if custom_content else ''}
        
        <h2 style="color: #1A2F23; font-family: 'Fraunces', serif;">Nos derniers articles</h2>
        
        {articles_html}
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://wellness-hub-693.preview.emergentagent.com" 
               style="background: #5FA098; color: white; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 500;">
                Découvrir plus d'articles
            </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E8E8E6;" />
        
        <p style="color: #8E9E96; font-size: 12px; text-align: center;">
            Vous recevez cet email car vous êtes inscrit à notre newsletter.<br/>
            © Harmonie Féline & Humaine
        </p>
    </div>
    """
    
    campaign = {
        "campaign_id": f"camp_{uuid.uuid4().hex[:12]}",
        "subject": subject,
        "content": email_content,
        "articles": [a["article_id"] for a in recent_articles],
        "sent_at": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.newsletter_campaigns.insert_one(campaign)
    
    # Get subscriber count
    subscriber_count = await db.newsletter.count_documents({})
    
    return {
        "campaign": campaign,
        "subscriber_count": subscriber_count,
        "preview": email_content,
        "message": f"Campaign created. Ready to send to {subscriber_count} subscribers."
    }

@api_router.post("/admin/newsletter/campaigns/{campaign_id}/send")
async def send_newsletter_campaign(campaign_id: str, request: Request):
    """Admin: Mark campaign as sent (actual email sending would require email service integration)"""
    user = await require_admin(request)
    
    campaign = await db.newsletter_campaigns.find_one({"campaign_id": campaign_id})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    if campaign.get("sent_at"):
        raise HTTPException(status_code=400, detail="Campaign already sent")
    
    # Get all subscribers
    subscribers = await db.newsletter.find({}, {"_id": 0}).to_list(10000)
    
    # Mark as sent
    await db.newsletter_campaigns.update_one(
        {"campaign_id": campaign_id},
        {"$set": {"sent_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Note: Actual email sending would require an email service like SendGrid, Resend, etc.
    # This is a placeholder that marks the campaign as sent
    
    return {
        "message": f"Campaign marked as sent to {len(subscribers)} subscribers",
        "note": "Pour envoyer réellement les emails, intégrez un service comme SendGrid ou Resend",
        "subscribers_count": len(subscribers)
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
