#!/usr/bin/env python3
"""Generate the Dutch homepage (nl/index.html) from index.html.

index.html is the single source: every visible text carries data-en / data-nl,
and the map script reads the page language from <html data-page-lang>.
This script swaps in the Dutch text, the Dutch head (title, meta, JSON-LD),
makes asset paths root-absolute (the page lives one folder deeper) and
points the language sign back to /.

Run after every change to index.html:  python3 tools/build-nl.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = (ROOT / 'index.html').read_text(encoding='utf-8')
s = src


def swap(old, new):
    global s
    if old not in s:
        raise SystemExit('build-nl: text not found, update the script: ' + old[:70])
    s = s.replace(old, new, 1)


# ---- language of the page ----
swap('<html lang="en" data-page-lang="en">', '<html lang="nl" data-page-lang="nl">')

# ---- head ----
swap('<title>Retro Adventure Games Online: Free Point-and-Click Pixel Adventures | RetroAdventureWorld</title>',
     '<title>Gratis spelletjes voor kinderen: pixel-avonturen online | RetroAdventureWorld</title>')
swap('content="Play free retro point-and-click adventure games online, no download. 16-bit pixel-art browser games for kids from 7 and for adults, on phone and desktop. Pick a place on the map and play."',
     'content="Speel gratis point-and-click avonturen in 16-bit pixel-art, direct in je browser. Geen download, geen account, geen reclame. Voor kinderen vanaf 7 jaar en volwassenen, op telefoon, tablet en computer."')
swap('<link rel="canonical" href="https://www.retroadventureworld.com/">',
     '<link rel="canonical" href="https://www.retroadventureworld.com/nl/">')
swap('<meta property="og:title" content="Retro Adventure Games Online: Free Point-and-Click Pixel Adventures">',
     '<meta property="og:title" content="Gratis spelletjes voor kinderen: pixel-avonturen online">\n  <meta property="og:locale" content="nl_NL">')
swap('<meta property="og:description" content="A pixel-art world map of free point-and-click adventures. Pick a place, meet its hero and play in your browser. No download.">',
     '<meta property="og:description" content="Een pixel-wereldkaart vol gratis point-and-click avonturen. Kies een plek, ontmoet de held en speel in je browser. Zonder downloaden.">')
swap('<meta property="og:url" content="https://www.retroadventureworld.com/">',
     '<meta property="og:url" content="https://www.retroadventureworld.com/nl/">')
swap('<meta name="twitter:title" content="Retro Adventure Games Online: Free Point-and-Click Pixel Adventures">',
     '<meta name="twitter:title" content="Gratis spelletjes voor kinderen: pixel-avonturen online">')
swap('<meta name="twitter:description" content="A pixel-art world map of free point-and-click adventures, playable in your browser.">',
     '<meta name="twitter:description" content="Een pixel-wereldkaart vol gratis point-and-click avonturen, te spelen in je browser.">')

s = s.replace('https://www.retroadventureworld.com/assets/og-image.jpg', 'https://www.retroadventureworld.com/assets/og-image-nl.jpg')

# ---- structured data ----
swap('"url": "https://www.retroadventureworld.com/",\n    "description": "A world map of free retro point-and-click pixel-art adventure games you can play online in your browser, in English and Dutch.",',
     '"url": "https://www.retroadventureworld.com/nl/",\n    "description": "Een wereldkaart vol gratis retro point-and-click pixel-avonturen die je online in je browser speelt, in het Nederlands en Engels.",')
swap('"name": "Free retro point-and-click adventure games",', '"name": "Gratis retro point-and-click spelletjes",')
swap('"A gentle 16-bit point-and-click adventure: help Loïs rescue her horse Moonhoof."',
     '"Een zacht 16-bit point-and-click avontuur: help Loïs haar paard Maanhoef te redden."')
swap('"name": "The Amulet of Emberfall",', '"name": "De Amulet van Emberfall",')
swap('"A classic 16-bit point-and-click puzzle adventure with an eternal autumn, a stolen amulet and a sleeping minotaur."',
     '"Een klassiek 16-bit point-and-click puzzelavontuur met eeuwige herfst, een gestolen amulet en een slapende minotaur."')
swap('"name": "Whispers of Ravenholt — Part 1",', '"name": "Whispers of Ravenholt — Deel 1",')
swap('"A 16-bit point-and-click mystery: young Finn investigates a dried-up village fountain and a silent water mill in the kingdom of Eldoria."',
     '"Een 16-bit point-and-click mysterie: de jonge Finn onderzoekt een drooggevallen dorpsfontein en een stille watermolen in het koninkrijk Eldoria."')
swap('"name": "Whispers of Ravenholt — Part 2",', '"name": "Whispers of Ravenholt — Deel 2",')
swap('"The sequel: Finn slips into the castle of Eldoria to free his captive father."',
     '"Het vervolg: Finn glipt het kasteel van Eldoria binnen om zijn gevangen vader te bevrijden."')

# FAQ JSON-LD: rebuild from the Dutch visible FAQ (same order, same words)
faq_html = re.findall(r'<summary data-en="[^"]*" data-nl="([^"]*)">.*?</summary>\s*<p data-en="[^"]*" data-nl="([^"]*)">', src, re.S)
if len(faq_html) < 4:
    raise SystemExit('build-nl: FAQ not found')
def jesc(t):
    return t.replace('\\', '\\\\').replace('"', '\\"')
items = ',\n'.join('      { "@type": "Question", "name": "%s",\n        "acceptedAnswer": { "@type": "Answer", "text": "%s" } }' % (jesc(q), jesc(a)) for q, a in faq_html)
s = re.sub(r'("@type": "FAQPage",\n    "mainEntity": \[\n).*?(\n    \])', lambda m: m.group(1) + items + m.group(2), s, count=1, flags=re.S)

# ---- visible text: every element with data-en/data-nl gets its Dutch text ----
pat = re.compile(r'(<(\w+)\b[^>]*?\sdata-en="[^"]*"[^>]*?\sdata-nl="([^"]*)"[^>]*>)(.*?)(</\2>)', re.S)
s, n = pat.subn(lambda m: m.group(1) + m.group(3) + m.group(5), s)
if n < 40:
    raise SystemExit('build-nl: expected many bilingual elements, found %d' % n)

# server-rendered defaults that JS would otherwise fill in
swap('alt="Pixel-art night map of RetroAdventureWorld: a farm with windmills, an autumn forest with a cave, a blue castle on a hill and a village with a fountain, linked by dirt paths and a river."',
     'alt="Pixel-art nachtkaart van RetroAdventureWorld: een boerderij met windmolens, een herfstbos met een grot, een blauw kasteel op een heuvel en een dorp met een fontein, verbonden door zandpaden en een rivier."')
swap('<h2 class="dlg-title" id="dlgTitle">Whispers of Ravenholt — Part 1</h2>', '<h2 class="dlg-title" id="dlgTitle">Whispers of Ravenholt — Deel 1</h2>')
swap('<p class="dlg-sub" id="dlgSub">A mystery in the village of Eldoria.</p>', '<p class="dlg-sub" id="dlgSub">Een mysterie in het dorp Eldoria.</p>')
swap('<span><svg class="ic"><use href="#i-star"/></svg>Mystery</span><span class="dot">·</span>', '<span><svg class="ic"><use href="#i-star"/></svg>Mysterie</span><span class="dot">·</span>')
swap('<a class="play" id="dlgPlay" href="games/ravenholt/">Play free</a>', '<a class="play" id="dlgPlay" href="games/ravenholt/">Speel gratis</a>')
swap('<button class="next" id="dlgNext" type="button">Start here, then Part 2 →</button>', '<button class="next" id="dlgNext" type="button">Begin hier, dan Deel 2 →</button>')
swap('aria-label="Selected adventure"', 'aria-label="Gekozen avontuur"')
swap('aria-label="Places on the map"', 'aria-label="Plekken op de kaart"')

# ---- language sign points back to English ----
swap('<a class="sign lang" id="lang" href="/nl/" hreflang="nl" lang="nl" aria-label="Nederlands"><span>NL / <b>EN</b></span></a>',
     '<a class="sign lang" id="lang" href="/" hreflang="en" lang="en" aria-label="English"><span><b>NL</b> / EN</span></a>')

# ---- paths: the page lives in /nl/, so make project paths root-absolute ----
s = re.sub(r'''(["'(])(assets|games|shared)/''', r'\1/\2/', s)

out = ROOT / 'nl' / 'index.html'
out.parent.mkdir(exist_ok=True)
banner = '<!-- GENERATED from index.html by tools/build-nl.py. Do not edit by hand. -->\n'
out.write_text(s.replace('<!DOCTYPE html>\n', '<!DOCTYPE html>\n' + banner, 1), encoding='utf-8')
print('build-nl: wrote %s (%d bilingual elements)' % (out.relative_to(ROOT), n))
