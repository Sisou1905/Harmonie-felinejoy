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
    """Get all comments for an article"""
    comments = await db.comments.find(
        {"article_id": article_id},
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
