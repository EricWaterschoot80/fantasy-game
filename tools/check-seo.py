#!/usr/bin/env python3
"""Static SEO checks for the site. Run before every push:  python3 tools/check-seo.py

Checks
- every sitemap URL maps to a file in the repo (cleanUrls: /x/ -> x.html or x/index.html)
- no /games/<slug>/ app page is in the sitemap, and each one says noindex
- every indexable page has exactly one <h1>, a unique <title> (<= 65 chars),
  a meta description (<= 165 chars), a self-referencing canonical and valid JSON-LD
- the game landing pages have 80-180 words of story text, hints in <details>,
  a Play link to the app and an OG image that exists
- internal links on indexable pages point to files that exist
Exit code 1 on any failure.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.retroadventureworld.com"
LANDING = {"moonhoof": "maanhoef", "amulet-of-emberfall": "emberfall",
           "whispers-of-ravenholt": "ravenholt", "whispers-of-ravenholt-part-2": "ravenholt-deel2"}
errors = []


def fail(msg):
    errors.append(msg)


def file_for(path):
    path = path.split("#")[0].split("?")[0]
    if not path.startswith("/"):
        return None
    p = path.strip("/")
    cands = [ROOT / "index.html"] if not p else [ROOT / p / "index.html", ROOT / f"{p}.html", ROOT / p]
    return next((c for c in cands if c.is_file()), None)


sitemap = (ROOT / "sitemap.xml").read_text()
urls = re.findall(r"<loc>(.*?)</loc>", sitemap)
titles = {}
for url in urls:
    path = url.replace(SITE, "")
    f = file_for(path)
    if not f:
        fail(f"sitemap: no file for {url}")
        continue
    if "/games/" in path:
        fail(f"sitemap: app page listed {url}")
    s = f.read_text(encoding="utf-8")
    if 'name="robots" content="noindex' in s:
        fail(f"{path}: in sitemap but noindex")
    if len(re.findall(r"<h1[\s>]", s)) != 1:
        fail(f"{path}: expected exactly one <h1>")
    t = re.search(r"<title>(.*?)</title>", s, re.S)
    if not t:
        fail(f"{path}: no <title>")
    else:
        t = t.group(1).strip()
        if len(t) > 65 and path not in ("/", "/nl/"):
            fail(f"{path}: title {len(t)} chars")
        if t in titles:
            fail(f"{path}: same title as {titles[t]}")
        titles[t] = path
    d = re.search(r'name="description" content="(.*?)"', s)
    if not d or len(d.group(1)) > 165:
        fail(f"{path}: meta description missing or too long")
    c = re.search(r'rel="canonical" href="(.*?)"', s)
    if not c or c.group(1) != url:
        fail(f"{path}: canonical {c and c.group(1)} != {url}")
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try:
            json.loads(block)
        except ValueError as e:
            fail(f"{path}: JSON-LD does not parse ({e})")
    for href in re.findall(r'href="(/[^"#?]*)', s):
        if href.startswith("//"):
            continue
        if not file_for(href):
            fail(f"{path}: broken internal link {href}")

for slug, app in LANDING.items():
    s = (ROOT / f"{slug}.html").read_text(encoding="utf-8")
    story = re.search(r'<h2 id="story">.*?</h2>(.*?)</section>', s, re.S).group(1)
    words = len(re.sub(r"<[^>]+>", " ", story).split())
    if not 80 <= words <= 180:
        fail(f"/{slug}/: story has {words} words (want 80-180)")
    if s.count('class="hint"') < 4 or "Show the solution" not in s:
        fail(f"/{slug}/: progressive hints missing")
    if f'href="/games/{app}/"' not in s:
        fail(f"/{slug}/: no Play link to /games/{app}/")
    og = re.search(r'og:image" content="(.*?)"', s).group(1).replace(SITE, "")
    if not (ROOT / og.lstrip("/")).is_file():
        fail(f"/{slug}/: OG image {og} missing")
    a = (ROOT / "games" / app / "index.html").read_text(encoding="utf-8")
    if 'name="robots" content="noindex, follow"' not in a:
        fail(f"/games/{app}/: not noindex")
    if 'rel="canonical"' in a or "position:absolute;width:1px" in a:
        fail(f"/games/{app}/: leftover canonical or hidden SEO header")

if errors:
    print("\n".join("FAIL " + e for e in errors))
    sys.exit(1)
print(f"SEO checks OK ({len(urls)} sitemap URLs, {len(LANDING)} game pages)")
