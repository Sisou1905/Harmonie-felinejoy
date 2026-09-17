from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "data" / "editorialArticles.js"
PUBLIC = ROOT / "public"
ARTICLE_PUBLIC = PUBLIC / "article"
SITE_URL = "https://www.harmoniejoy.net"
DEFAULT_DATE = "2026-09-04"


NAVIGATION = [
    ("Accueil", "/"),
    ("Articles", "/blog"),
    ("Bien-être humain", "/bien-etre-humain"),
    ("Bien-être animal", "/bien-etre-animal"),
    ("Relation humain-chat", "/connexion"),
    ("À propos", "/a-propos"),
]


def canonical_url(path: str) -> str:
    return f"{SITE_URL}{path}" if path != "/" else f"{SITE_URL}/"


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


def table_cells(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def render_table(lines: list[str]) -> str:
    headers = table_cells(lines[0])
    body = [table_cells(line) for line in lines[2:] if line.strip()]
    thead = "".join(f"<th>{render_inline(cell)}</th>" for cell in headers)
    rows = "\n".join(
        "<tr>" + "".join(f"<td>{render_inline(cell)}</td>" for cell in row) + "</tr>"
        for row in body
    )
    return f'<div class="table-wrap"><table><thead><tr>{thead}</tr></thead><tbody>{rows}</tbody></table></div>'


def render_markdown(value: str) -> str:
    blocks: list[str] = []
    for block in value.split("\n\n"):
        block = block.strip()
        if not block:
            continue
        lines = block.splitlines()
        if (
            len(lines) >= 2
            and lines[0].lstrip().startswith("|")
            and set(lines[1].replace("|", "").replace(":", "").replace("-", "").strip()) == set()
        ):
            blocks.append(render_table(lines))
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


def article_url(article: dict) -> str:
    return canonical_url(f"/article/{article['slug']}")


def format_date(value: str | None) -> str:
    raw = (value or DEFAULT_DATE).split("T")[0]
    year, month, day = raw.split("-")
    months = ["", "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    return f"{int(day)} {months[int(month)]} {year}"


def nav_html() -> str:
    links = "".join(f'<a href="{path}">{label}</a>' for label, path in NAVIGATION)
    return f'<header><div class="wrap"><nav aria-label="Navigation principale">{links}</nav></div></header>'


def footer_html() -> str:
    return (
        '<footer><div class="wrap">© 2026 Harmonie Joy · '
        '<a href="/a-propos">Méthode éditoriale</a> · '
        '<a href="/privacy">Politique de confidentialité</a> · '
        '<a href="/legal">Mentions légales</a> · '
        '<a href="mailto:contact@felinejoy.com">Contact</a>'
        '<p>Les liens commerciaux, lorsqu’ils existent, sont identifiés et distincts des contenus éditoriaux. '
        'Les contenus sont informatifs et ne remplacent pas un avis médical, vétérinaire ou professionnel individualisé.</p>'
        '</div></footer>'
    )


def page_shell(
    title: str,
    description: str,
    path: str,
    body: str,
    schema: dict | None = None,
    og_type: str = "website",
    extra_css: str = "",
) -> str:
    url = canonical_url(path)
    schema_json = ""
    if schema:
        schema_json = '<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False).replace("</", "<\\/") + "</script>"
    return f'''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)} | Harmonie Joy</title>
  <meta name="description" content="{html.escape(description, quote=True)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="{og_type}">
  <meta property="og:title" content="{html.escape(title, quote=True)}">
  <meta property="og:description" content="{html.escape(description, quote=True)}">
  <meta property="og:url" content="{url}">
  <meta name="twitter:card" content="summary">
  {schema_json}
  <style>
    :root {{ color-scheme: light; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; color: #26332f; background: #f7faf8; font: 18px/1.7 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }}
    header {{ background: #e8f2ec; border-bottom: 1px solid #d2e3d8; }}
    .wrap {{ max-width: 900px; margin: 0 auto; padding: 24px; }}
    nav {{ font-size: .92rem; }}
    nav a {{ color: #276a52; margin: 0 16px 8px 0; text-decoration: none; font-weight: 600; display: inline-block; }}
    main {{ background: #fff; min-height: 60vh; }}
    h1 {{ color: #183d30; font: 600 clamp(2rem, 5vw, 3.2rem)/1.15 Georgia, serif; margin: 14px 0; }}
    h2 {{ color: #205841; font: 600 1.6rem/1.25 Georgia, serif; margin: 36px 0 10px; }}
    h3 {{ color: #205841; margin: 0 0 8px; font: 600 1.2rem/1.3 Georgia, serif; }}
    p {{ margin: 0 0 20px; }}
    a {{ color: #0b6d50; }}
    .eyebrow {{ color: #5c786a; font-size: .9rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; margin: 8px 0; }}
    .intro {{ font-size: 1.1rem; color: #41564c; max-width: 750px; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 18px; margin-top: 30px; }}
    .card {{ border: 1px solid #d6e6dc; border-radius: 16px; padding: 20px; background: #fff; box-shadow: 0 3px 12px rgba(20, 70, 45, .05); }}
    .card p {{ color: #536b60; font-size: .94rem; }}
    .card .meta {{ color: #6f857a; font-size: .8rem; margin-bottom: 9px; }}
    .card a {{ font-weight: 700; text-decoration: none; }}
    aside {{ border-left: 4px solid #72a889; background: #eff7f1; padding: 16px 18px; margin: 28px 0; }}
    .table-wrap {{ overflow-x: auto; margin: 26px 0; }}
    table {{ width: 100%; border-collapse: collapse; font-size: .94rem; }}
    th {{ background: #e8f2ec; color: #205841; text-align: left; }}
    th, td {{ border: 1px solid #d2e3d8; padding: 10px; vertical-align: top; }}
    footer {{ color: #587064; font-size: .9rem; border-top: 1px solid #dbe8e0; background: #f7faf8; }}
    footer p {{ margin: 14px 0 0; font-size: .82rem; }}
    {extra_css}
    @media (max-width: 600px) {{ .wrap {{ padding: 20px; }} body {{ font-size: 17px; }} }}
  </style>
</head>
<body>
  {nav_html()}
  <main><div class="wrap">{body}</div></main>
  {footer_html()}
</body>
</html>
'''


def page_for(article: dict) -> str:
    path = f"/article/{article['slug']}"
    title = article["title"]
    description = article["excerpt"]
    image = article["image_url"]
    metadata_image = f"{SITE_URL}{image}" if image.startswith("/") else image
    published_date = (article.get("created_at") or DEFAULT_DATE).split("T")[0]
    modified_date = (article.get("updated_at") or article.get("created_at") or DEFAULT_DATE).split("T")[0]
    author = article.get("author") or "Rédaction Harmonie Joy"
    word_count = len(re.findall(r"\w+", article["content"], flags=re.UNICODE))
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": [metadata_image],
        "datePublished": published_date,
        "dateModified": modified_date,
        "inLanguage": "fr-FR",
        "author": {"@type": "Organization", "name": author},
        "publisher": {"@type": "Organization", "name": "Harmonie Joy", "url": SITE_URL},
        "mainEntityOfPage": {"@type": "WebPage", "@id": article_url(article)},
        "wordCount": word_count,
    }
    sources = "\n".join(
        f'<li><a href="{html.escape(source["url"], quote=True)}" rel="noopener noreferrer">{html.escape(source["title"])}</a></li>'
        for source in article["sources"]
    )
    content = render_markdown(article["content"])
    tags = ", ".join(html.escape(tag) for tag in article["tags"])
    body = f'''
<p class="eyebrow">Publié le {format_date(published_date)} · {html.escape(author)} · {html.escape(article['category'])}</p>
<h1>{html.escape(title)}</h1>
<p class="intro"><strong>{html.escape(description)}</strong></p>
<img class="hero" src="{html.escape(image, quote=True)}" alt="{html.escape(title, quote=True)}">
{content}
<section class="sources" aria-labelledby="sources"><h2 id="sources">Sources et repères</h2><ul>{sources}</ul><p>Les contenus de Harmonie Joy sont informatifs et ne remplacent pas un avis médical, vétérinaire ou professionnel individualisé.</p></section>
'''
    return page_shell(
        title,
        description,
        path,
        body,
        schema,
        "article",
        ".hero { width: 100%; max-height: 440px; object-fit: cover; border-radius: 16px; margin: 10px 0 28px; } .sources { background: #eff7f1; border-radius: 16px; padding: 20px 26px; margin-top: 40px; }",
    )


def article_card(article: dict) -> str:
    tags = ", ".join(article.get("tags", [])[:3])
    return f'''<article class="card">
  <p class="meta">{html.escape(article.get("category", "guide"))} · {format_date(article.get("created_at"))} · {len(article.get("sources", []))} sources</p>
  <h3><a href="/article/{html.escape(article["slug"], quote=True)}">{html.escape(article["title"])}</a></h3>
  <p>{html.escape(article["excerpt"])}</p>
  <p class="meta">{html.escape(tags)}</p>
  <a href="/article/{html.escape(article["slug"], quote=True)}">Lire le guide →</a>
</article>'''


def listing_page(path: str, title: str, description: str, eyebrow: str, articles: list[dict], intro: str) -> str:
    cards = "\n".join(article_card(article) for article in articles)
    item_list = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "description": description,
        "url": canonical_url(path),
        "inLanguage": "fr-FR",
        "isPartOf": {"@type": "WebSite", "name": "Harmonie Joy", "url": SITE_URL},
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                {"@type": "ListItem", "position": index + 1, "url": article_url(article), "name": article["title"]}
                for index, article in enumerate(articles)
            ],
        },
    }
    body = f'''<p class="eyebrow">{html.escape(eyebrow)}</p>
<h1>{html.escape(title)}</h1>
<p class="intro">{html.escape(intro)}</p>
<aside>Les articles distinguent les gestes du quotidien des situations qui demandent un médecin, un vétérinaire ou un autre professionnel. Les sources sont indiquées lorsqu’elles éclairent un conseil.</aside>
<section aria-label="Liste des articles"><div class="grid">{cards}</div></section>'''
    return page_shell(title, description, path, body, item_list)


def information_page(path: str, title: str, description: str, body: str) -> str:
    schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": description,
        "url": canonical_url(path),
        "inLanguage": "fr-FR",
        "isPartOf": {"@type": "WebSite", "name": "Harmonie Joy", "url": SITE_URL},
    }
    return page_shell(title, description, path, body, schema)


def static_information_pages() -> dict[str, str]:
    return {
        "/a-propos": information_page(
            "/a-propos",
            "À propos de Harmonie Joy",
            "La méthode éditoriale, les limites des contenus et la transparence commerciale de Harmonie Joy.",
            '''<p class="eyebrow">Harmonie Joy</p><h1>À propos de Harmonie Joy</h1>
<p class="intro">Harmonie Joy est un média indépendant consacré aux habitudes de bien-être humain, à l’attention et à l’apprentissage, au bien-être félin et à une cohabitation attentive avec les chats.</p>
<h2>Notre méthode éditoriale</h2><p>Chaque publication part d’une question précise. Nous distinguons les faits établis, les gestes simples à tester et les situations qui demandent un professionnel. Lorsque le sujet s’y prête, les références externes sont affichées afin que le lecteur puisse retrouver l’origine d’une affirmation importante.</p>
<p>Les contenus sont informatifs. Ils ne remplacent ni un diagnostic, ni une consultation avec un médecin, un vétérinaire ou un autre professionnel qualifié. Nous ne présentons pas un produit, un complément ou une pratique comme un traitement.</p>
<h2>Indépendance et liens commerciaux</h2><p>Harmonie Joy peut percevoir une commission lorsqu’un lecteur réalise un achat après avoir suivi certains liens commerciaux. Ces liens sont signalés, restent distincts des articles éditoriaux et ne déterminent pas le choix ou le contenu d’un guide.</p>
<h2>Corriger une information</h2><p>Pour signaler une imprécision, une source obsolète ou un lien défaillant, écrivez à <a href="mailto:contact@felinejoy.com">contact@felinejoy.com</a> en indiquant l’URL concernée.</p>''',
        ),
        "/legal": information_page(
            "/legal",
            "Mentions légales",
            "Informations d’édition, d’hébergement et de responsabilité du site Harmonie Joy.",
            '''<p class="eyebrow">Harmonie Joy</p><h1>Mentions légales</h1>
<p><strong>Site :</strong> Harmonie Joy — www.harmoniejoy.net<br><strong>Contact :</strong> <a href="mailto:contact@felinejoy.com">contact@felinejoy.com</a></p>
<h2>Édition et direction de publication</h2><p>Harmonie Joy est édité sous ce nom. Le responsable de publication peut être contacté à l’adresse e-mail ci-dessus. Les coordonnées d’identification complémentaires, lorsqu’elles sont requises selon le statut de l’éditeur, sont communiquées sur demande légitime.</p>
<h2>Hébergement</h2><p>Le site est diffusé via Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
<h2>Contenus et responsabilités</h2><p>Les contenus publiés ont une vocation informative. Ils ne remplacent pas un avis médical, vétérinaire, juridique ou professionnel. En cas de symptôme, de douleur, de changement inquiétant ou de question concernant un animal, consultez un professionnel compétent.</p>
<h2>Liens commerciaux</h2><p>Certains liens externes sont susceptibles de donner lieu à une commission. Cette relation commerciale est distincte du contenu éditorial et ne vaut pas recommandation médicale ou vétérinaire.</p>''',
        ),
        "/privacy": information_page(
            "/privacy",
            "Politique de confidentialité",
            "Politique de confidentialité, données, cookies et publicité de Harmonie Joy.",
            '''<p class="eyebrow">Dernière mise à jour : 4 septembre 2026</p><h1>Politique de confidentialité</h1>
<h2>Responsable et contact</h2><p>Le site Harmonie Joy est joignable à l’adresse <a href="mailto:contact@felinejoy.com">contact@felinejoy.com</a>. Pour les informations d’identification de l’éditeur et de l’hébergeur, consultez les <a href="/legal">mentions légales</a>.</p>
<h2>Données que nous pouvons traiter</h2><p>Lorsque vous vous inscrivez à la newsletter, nous traitons l’adresse e-mail communiquée afin de vous adresser les contenus demandés. Si vous créez un compte, nous pouvons traiter les données nécessaires à l’authentification et aux fonctionnalités associées, telles que les favoris ou les commentaires.</p>
<h2>Cookies, mesure d’audience et publicité</h2><p>Le site peut utiliser des cookies ou technologies similaires nécessaires à son fonctionnement, ainsi que des technologies de mesure d’audience ou de publicité. Avant toute activation de publicités personnalisées, une solution de gestion du consentement appropriée doit être affichée aux visiteurs concernés. Les utilisateurs peuvent gérer la publicité personnalisée dans les <a href="https://www.google.com/settings/ads" rel="noopener noreferrer">paramètres des annonces Google</a>.</p>
<h2>Vos droits</h2><p>Vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou l’opposition au traitement de vos données, ainsi que la portabilité lorsque celle-ci s’applique. Pour exercer un droit, écrivez à l’adresse de contact ci-dessus.</p>''',
        ),
    }


def write_page(path: str, content: str) -> None:
    destination = PUBLIC / path.lstrip("/") / "index.html"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(content, encoding="utf-8")
    print(destination.relative_to(ROOT))


def main() -> None:
    articles = load_articles()
    for article in articles:
        destination = ARTICLE_PUBLIC / article["slug"] / "index.html"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(page_for(article), encoding="utf-8")
        print(destination.relative_to(ROOT))

    by_category = {
        "human": [article for article in articles if article["category"] == "human"],
        "animal": [article for article in articles if article["category"] == "animal"],
        "connection": [article for article in articles if article["category"] == "connection"],
    }
    listing_specs = [
        ("/blog", "Articles Harmonie Joy", "Guides pratiques et sourcés sur l’attention, le sommeil, le chat d’intérieur et la relation humain-animal.", "Guides pratiques", articles, "Retrouvez des articles pratiques, structurés et sourcés sur le bien-être quotidien, l’apprentissage et la vie avec un chat."),
        ("/bien-etre-humain", "Bien-être humain", "Guides pratiques sur le sommeil, l’attention, l’apprentissage et les habitudes du quotidien.", "Bien-être humain", by_category["human"], "Des repères applicables au quotidien autour du sommeil, de l’attention et de l’apprentissage. Chaque conseil doit rester adapté à votre situation."),
        ("/bien-etre-animal", "Bien-être animal", "Guides sur le chat d’intérieur, l’observation de ses besoins et la préparation d’une consultation vétérinaire.", "Bien-être félin", by_category["animal"], "Des repères pour observer les besoins d’un chat, enrichir son environnement et préparer une consultation avec des informations factuelles."),
        ("/connexion", "Relation humain-chat", "Guides pour construire une cohabitation respectueuse et attentive avec son chat.", "Relation humain-chat", by_category["connection"], "Une cohabitation attentive commence par l’observation des habitudes, le respect de l’espace de l’animal et des attentes réalistes."),
    ]
    for spec in listing_specs:
        write_page(spec[0], listing_page(*spec))
    for path, content in static_information_pages().items():
        write_page(path, content)


if __name__ == "__main__":
    main()
