from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "data" / "editorialArticles.js"
PUBLIC = ROOT / "public" / "article"
SITE_URL = "https://www.harmoniejoy.net"
PUBLICATION_DATE = "2026-09-04"


def render_inline(value: str) -> str:
    safe = html.escape(value)
    safe = re.sub(
        r"\[([^\]]+)\]\((https?://[^\s)]+)\)",
        lambda match: (
            f'<a href="{html.escape(match.group(2), quote=True)}" '
            'rel="noopener noreferrer">'
            f"{match.group(1)}</a>"
        ),
        safe,
    )
    return re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", safe)


def render_markdown(value: str) -> str:
    blocks: list[str] = []
    for block in value.split("\n\n"):
        block = block.strip()
        if not block:
            continue
        if block.startswith("## "):
            blocks.append(f"<h2>{render_inline(block[3:])}</h2>")
        elif block.startswith("### "):
            blocks.append(f"<h3>{render_inline(block[4:])}</h3>")
        elif block.startswith("> "):
            blocks.append(f"<aside>{render_inline(block[2:])}</aside>")
        else:
            blocks.append(f"<p>{render_inline(block).replace(chr(10), '<br>')}</p>")
    return "\n".join(blocks)


def load_articles() -> list[dict]:
    source = SOURCE.read_text(encoding="utf-8")
    start_marker = "export const editorialArticles = "
    end_marker = "\n];\n\nexport const editorialArticleBySlug"
    start = source.index(start_marker) + len(start_marker)
    end = source.index(end_marker, start) + 2
    return json.loads(source[start:end])


def page_for(article: dict) -> str:
    url = f"{SITE_URL}/article/{article['slug']}"
    title = article["title"]
    description = article["excerpt"]
    image = article["image_url"]
    word_count = len(re.findall(r"\w+", article["content"], flags=re.UNICODE))
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": [image],
        "datePublished": PUBLICATION_DATE,
        "dateModified": PUBLICATION_DATE,
        "inLanguage": "fr-FR",
        "author": {"@type": "Organization", "name": "Harmonie Joy"},
        "publisher": {"@type": "Organization", "name": "Harmonie Joy", "url": SITE_URL},
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "wordCount": word_count,
    }
    sources = "\n".join(
        f'<li><a href="{html.escape(source["url"], quote=True)}" rel="noopener noreferrer">{html.escape(source["title"])}</a></li>'
        for source in article["sources"]
    )
    content = render_markdown(article["content"])
    tags = ", ".join(html.escape(tag) for tag in article["tags"])
    schema_json = json.dumps(schema, ensure_ascii=False).replace("</", "<\\/")
    return f'''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)} | Harmonie Joy</title>
  <meta name="description" content="{html.escape(description, quote=True)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="{html.escape(title, quote=True)}">
  <meta property="og:description" content="{html.escape(description, quote=True)}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{html.escape(image, quote=True)}">
  <meta property="article:published_time" content="{PUBLICATION_DATE}">
  <meta name="twitter:card" content="summary_large_image">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2771964189463944" crossorigin="anonymous"></script>
  <script type="application/ld+json">{schema_json}</script>
  <style>
    :root {{ color-scheme: light; }} body {{ margin: 0; color: #26332f; background: #f9fbfa; font: 18px/1.7 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }}
    header {{ background: #e8f2ec; border-bottom: 1px solid #d2e3d8; }} .wrap {{ max-width: 820px; margin: 0 auto; padding: 24px; }} nav {{ font-size: .92rem; }} nav a {{ color: #276a52; margin-right: 16px; text-decoration: none; }} article {{ background: #fff; }} h1 {{ color: #183d30; font: 600 clamp(2rem, 5vw, 3.2rem)/1.15 Georgia, serif; margin: 24px 0 14px; }} h2 {{ color: #205841; font: 600 1.6rem/1.25 Georgia, serif; margin: 42px 0 10px; }} h3 {{ color: #205841; margin: 30px 0 6px; }} p {{ margin: 0 0 20px; }} a {{ color: #0b6d50; }} .meta {{ color: #60746b; font-size: .92rem; }} .hero {{ width: 100%; max-height: 420px; object-fit: cover; border-radius: 16px; margin: 14px 0 28px; }} aside {{ border-left: 4px solid #72a889; background: #eff7f1; padding: 16px 18px; margin: 28px 0; }} .sources {{ background: #eff7f1; border-radius: 16px; padding: 20px 26px; margin-top: 40px; }} footer {{ color: #587064; font-size: .9rem; border-top: 1px solid #dbe8e0; }}
  </style>
</head>
<body>
  <header><div class="wrap"><nav aria-label="Navigation principale"><a href="/">Harmonie Joy</a><a href="/blog">Articles</a><a href="/bien-etre-humain">Bien-être humain</a><a href="/bien-etre-animal">Bien-être animal</a><a href="/connexion">Relation humain-chat</a><a href="/a-propos">À propos</a></nav></div></header>
  <article><div class="wrap">
    <p class="meta">Publié le 4 septembre 2026 · Harmonie Joy · {html.escape(article['category'])} · {tags}</p>
    <h1>{html.escape(title)}</h1>
    <p><strong>{html.escape(description)}</strong></p>
    <img class="hero" src="{html.escape(image, quote=True)}" alt="{html.escape(title, quote=True)}">
    {content}
    <section class="sources" aria-labelledby="sources"><h2 id="sources">Sources et repères</h2><ul>{sources}</ul><p>Les contenus de Harmonie Joy sont informatifs et ne remplacent pas un avis médical, vétérinaire ou professionnel individualisé.</p></section>
  </div></article>
  <footer><div class="wrap">© 2026 Harmonie Joy · <a href="/privacy">Politique de confidentialité</a> · <a href="/legal">Mentions légales</a> · <a href="mailto:contact@felinejoy.com">Contact</a></div></footer>
</body>
</html>
'''


def main() -> None:
    articles = load_articles()
    for article in articles:
        destination = PUBLIC / article["slug"] / "index.html"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(page_for(article), encoding="utf-8")
        print(destination.relative_to(ROOT))


if __name__ == "__main__":
    main()
