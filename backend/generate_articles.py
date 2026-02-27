#!/usr/bin/env python3
"""Script to generate AI articles using Claude Sonnet for the wellness blog"""

import asyncio
import os
import sys
import uuid
import json
from datetime import datetime, timezone
from pathlib import Path

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / '.env')

from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Articles to generate
ARTICLES_TO_GENERATE = [
    # Bien-être Humain
    {
        "topic": "Les bienfaits de la respiration consciente pour réduire le stress",
        "category": "human",
        "tone": "pratique"
    },
    {
        "topic": "Comment créer une routine matinale énergisante",
        "category": "human", 
        "tone": "inspirant"
    },
    {
        "topic": "L'importance de la gratitude pour le bien-être mental",
        "category": "human",
        "tone": "informatif"
    },
    # Bien-être Animal
    {
        "topic": "Comprendre le langage corporel de votre chat",
        "category": "animal",
        "tone": "informatif"
    },
    {
        "topic": "Les meilleures plantes non toxiques pour un foyer avec chat",
        "category": "animal",
        "tone": "pratique"
    },
    {
        "topic": "Comment aider un chat à s'adapter à un déménagement",
        "category": "animal",
        "tone": "pratique"
    },
    # La Connexion
    {
        "topic": "Le ronronnement du chat : ses effets thérapeutiques sur l'humain",
        "category": "connection",
        "tone": "informatif"
    },
    {
        "topic": "Créer un rituel de relaxation avec son animal de compagnie",
        "category": "connection",
        "tone": "inspirant"
    },
    {
        "topic": "Comment les animaux nous aident à vivre dans l'instant présent",
        "category": "connection",
        "tone": "inspirant"
    }
]

# Category images
CATEGORY_IMAGES = {
    "human": [
        "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=940",
        "https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=940",
        "https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=940",
    ],
    "animal": [
        "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=940",
        "https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg?auto=compress&cs=tinysrgb&w=940",
        "https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&w=940",
    ],
    "connection": [
        "https://images.pexels.com/photos/1378849/pexels-photo-1378849.jpeg?auto=compress&cs=tinysrgb&w=940",
        "https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=940",
        "https://images.pexels.com/photos/1485637/pexels-photo-1485637.jpeg?auto=compress&cs=tinysrgb&w=940",
    ]
}

# Category sources
CATEGORY_SOURCES = {
    "human": [
        {"title": "Harvard Health Publishing", "url": "https://www.health.harvard.edu/"},
        {"title": "Mayo Clinic", "url": "https://www.mayoclinic.org/"},
        {"title": "National Institutes of Health", "url": "https://www.nih.gov/"}
    ],
    "animal": [
        {"title": "Cornell Feline Health Center", "url": "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center"},
        {"title": "Journal of Feline Medicine and Surgery", "url": "https://journals.sagepub.com/home/jfm"},
        {"title": "ASPCA", "url": "https://www.aspca.org/"}
    ],
    "connection": [
        {"title": "Human-Animal Bond Research Institute", "url": "https://habri.org/"},
        {"title": "Anthrozoös Journal", "url": "https://www.tandfonline.com/toc/rfan20/current"},
        {"title": "NIH - The Power of Pets", "url": "https://newsinhealth.nih.gov/2018/02/power-pets"}
    ]
}

async def generate_with_claude(topic: str, category: str, tone: str) -> dict:
    """Generate article content using Claude Sonnet via Emergent LLM"""
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    category_names = {
        "human": "bien-être humain (méditation, nutrition, sommeil, gestion du stress)",
        "animal": "bien-être animal et félin (santé du chat, comportement, alimentation)",
        "connection": "la connexion entre humains et animaux (zoothérapie, lien émotionnel)"
    }
    
    tone_instructions = {
        "informatif": "un ton informatif et éducatif, basé sur des faits scientifiques",
        "inspirant": "un ton inspirant et motivant, qui encourage le lecteur à agir",
        "pratique": "un ton pratique avec des conseils concrets et applicables immédiatement"
    }
    
    prompt = f"""Tu es un expert en bien-être qui écrit pour le blog "Harmonie Féline & Humaine".
    
Écris un article complet en français sur le sujet suivant : "{topic}"
Catégorie : {category_names.get(category, category_names['human'])}
Ton souhaité : {tone_instructions.get(tone, tone_instructions['informatif'])}

L'article doit :
- Avoir un titre accrocheur
- Commencer par une introduction engageante
- Inclure 3-4 sections principales avec des sous-titres (utilise ## pour les titres de section)
- Contenir des conseils pratiques sous forme de listes à puces
- Se terminer par une conclusion encourageante
- Faire environ 800-1000 mots

Réponds UNIQUEMENT avec un JSON valide au format suivant (sans markdown autour) :
{{
    "title": "Le titre de l'article",
    "excerpt": "Un résumé de 2-3 phrases qui donne envie de lire l'article",
    "content": "Le contenu complet de l'article en markdown",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}}"""

    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        chat = LlmChat(
            api_key=api_key,
            session_id=f"article_gen_{uuid.uuid4().hex[:8]}",
            system_message="Tu es un expert en bien-être qui écrit des articles pour un blog."
        ).with_model("anthropic", "claude-sonnet-4-5-20250929").with_params(max_tokens=4000)
        
        response = await chat.send_message(UserMessage(text=prompt))
        
        # Parse the JSON response
        response_text = response.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        response_text = response_text.strip()
        
        result = json.loads(response_text)
        return result
    except Exception as e:
        print(f"  ERROR: Claude generation failed: {e}")
        return None

def generate_slug(title: str) -> str:
    """Generate URL-safe slug from title"""
    import unicodedata
    slug = title.lower()
    slug = unicodedata.normalize('NFD', slug)
    slug = ''.join(c for c in slug if unicodedata.category(c) != 'Mn')
    slug = ''.join(c if c.isalnum() or c == ' ' else '' for c in slug)
    slug = '-'.join(slug.split())[:60]
    return slug

async def create_article(topic: str, category: str, tone: str, image_index: int) -> bool:
    """Generate and save an article"""
    print(f"\n📝 Generating: {topic}")
    print(f"   Category: {category}, Tone: {tone}")
    
    # Generate content with Claude
    ai_content = await generate_with_claude(topic, category, tone)
    
    if not ai_content:
        print("  ❌ Failed to generate content")
        return False
    
    # Generate slug
    slug = generate_slug(ai_content.get("title", topic))
    
    # Check if slug exists
    existing = await db.articles.find_one({"slug": slug})
    if existing:
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"
    
    # Select image
    images = CATEGORY_IMAGES.get(category, CATEGORY_IMAGES["human"])
    image_url = images[image_index % len(images)]
    
    # Create article document
    article = {
        "article_id": f"art_{uuid.uuid4().hex[:12]}",
        "title": ai_content.get("title", topic),
        "slug": slug,
        "excerpt": ai_content.get("excerpt", f"Découvrez tout sur {topic}."),
        "content": ai_content.get("content", ""),
        "category": category,
        "image_url": image_url,
        "author": "Harmonie IA",
        "sources": CATEGORY_SOURCES.get(category, []),
        "tags": ai_content.get("tags", [topic.lower().split()[0], "bien-être"]),
        "likes_count": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "ai_generated": True,
        "ai_model": "claude-sonnet-4.5"
    }
    
    # Save to database
    await db.articles.insert_one(article)
    print(f"  ✅ Created: {article['title']}")
    print(f"     Slug: {article['slug']}")
    
    return True

async def main():
    print("=" * 60)
    print("🚀 Generating AI Articles with Claude Sonnet 4.5")
    print("=" * 60)
    
    success_count = 0
    image_counters = {"human": 0, "animal": 0, "connection": 0}
    
    for article_config in ARTICLES_TO_GENERATE:
        category = article_config["category"]
        success = await create_article(
            article_config["topic"],
            category,
            article_config["tone"],
            image_counters[category]
        )
        if success:
            success_count += 1
            image_counters[category] += 1
        
        # Small delay between requests
        await asyncio.sleep(1)
    
    print("\n" + "=" * 60)
    print(f"✨ Generation Complete: {success_count}/{len(ARTICLES_TO_GENERATE)} articles created")
    print("=" * 60)
    
    # Close connection
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
