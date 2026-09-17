from __future__ import annotations

import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "data" / "editorialArticles.js"
OUTPUT = ROOT / "public" / "sitemap.xml"
SITE_URL = "https://www.harmoniejoy.net"
START_MARKER = "export const editorialArticles = "
END_MARKER = "\n];\n\nexport const editorialArticleBySlug"

STATIC_PAGES = [
    ("/", "weekly", "1.0"),
    ("/blog", "weekly", "0.9"),
    ("/bien-etre-humain", "weekly", "0.8"),
    ("/bien-etre-animal", "weekly", "0.8"),
    ("/connexion", "monthly", "0.7"),
    ("/a-propos", "monthly", "0.5"),
    ("/privacy", "monthly", "0.3"),
    ("/legal", "monthly", "0.3"),
]


def xml_escape(value: str) -> str:
    return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def articles() -> list[dict]:
    text = SOURCE.read_text(encoding="utf-8")
    start = text.index(START_MARKER) + len(START_MARKER)
    end = text.index(END_MARKER, start) + 2
    return json.loads(text[start:end])


def as_date(value: str | None) -> str:
    if value:
        return value.split("T", 1)[0]
    return date.today().isoformat()


def url_node(loc: str, lastmod: str, changefreq: str, priority: str) -> str:
    return "\n".join(
        [
            "  <url>",
            f"    <loc>{xml_escape(loc)}</loc>",
            f"    <lastmod>{lastmod}</lastmod>",
            f"    <changefreq>{changefreq}</changefreq>",
            f"    <priority>{priority}</priority>",
            "  </url>",
        ]
    )


def main() -> None:
    current = date.today().isoformat()
    nodes = [
        url_node(f"{SITE_URL}{path}", current, frequency, priority)
        for path, frequency, priority in STATIC_PAGES
    ]
    for article in articles():
        nodes.append(
            url_node(
                f"{SITE_URL}/article/{article['slug']}",
                as_date(article.get("updated_at") or article.get("created_at")),
                "monthly",
                "0.8",
            )
        )
    OUTPUT.write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(nodes)
        + "\n</urlset>\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(nodes)} sitemap URLs to {OUTPUT}")


if __name__ == "__main__":
    main()
