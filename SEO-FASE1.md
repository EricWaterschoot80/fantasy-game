# SEO fase 1: wat er is gedaan

Uitgevoerd op 22 oktober 2026, volgens `RetroAdventureWorld_SEO_Claude_Code_Instructies.md`.
Dit bestand en alle andere `.md`-bestanden worden niet gepubliceerd (`.vercelignore`).

## Keuze

De infopagina per spel is de pagina die Google indexeert. De speelpagina's onder `/games/<naam>/` blijven werken zoals altijd, maar staan op `noindex, follow`.

| Spel | Infopagina (geïndexeerd) | Speelpagina (noindex) |
|---|---|---|
| Maanhoef | `/maanhoef/` | `/games/maanhoef/` |
| De Amulet van Emberfall | `/amulet-of-emberfall/` | `/games/emberfall/` |
| Whispers of Ravenholt, Deel 1 | `/whispers-of-ravenholt/` | `/games/ravenholt/` |
| Whispers of Ravenholt, Deel 2 | `/whispers-of-ravenholt-part-2/` | `/games/ravenholt-deel2/` |

## Wat er veranderd is

- **Infopagina's.** Ze worden gegenereerd door `python3 tools/build-game-pages.py`. Pas het script aan, niet de html-bestanden. Elke pagina heeft:
  - een eigen titel, beschrijving en H1;
  - 99–127 woorden verhaal;
  - een feitenblok met speelduur, moeilijkheid, leeftijd, talen, apparaten en prijs;
  - echte screenshots uit `assets/games/<naam>/` en een eigen OG-beeld (`og.jpg`, 1200×630);
  - een Play-knop;
  - hints in drie stappen per onderdeel (hint 1, hint 2, oplossing achter een spoilerknop);
  - verwante spellen;
  - JSON-LD voor VideoGame en BreadcrumbList.

  De hints volgen de route die de geautomatiseerde volledige speeltesten echt gebruiken. Verander je een puzzel, pas dan ook de hints aan.
- **Speelpagina's.** Op elke speelpagina:
  - kwam `<meta name="robots" content="noindex, follow">` erbij, en `vercel.json` stuurt ook een `X-Robots-Tag` mee;
  - zijn de verborgen SEO-header, de canonical, de hreflang-links, de keywords en de JSON-LD weggehaald;
  - wijzen `og:url` en `og:image` naar de infopagina.

  De gameplay is niet veranderd.
- **Sitemap.** De `/games/`-URL's zijn eruit en de vier infopagina's staan erin, met hun screenshots als image-sitemap.
- **Interne links.** Elk spel is via de infopagina bereikbaar vanaf de rest van de site:
  - **Homepage (EN en NL):** de speltitels in de lijst en de voettekst gaan naar de infopagina. "Play free" en de kaart gaan nog steeds direct naar het spel.
  - **Hubpagina:** de titel en de afbeelding gaan naar de infopagina, er staat een extra link "Story, screenshots & hints" bij, en de ItemList in de JSON-LD wijst naar de infopagina's.
  - **Oudergids:** titels en ItemList wijzen naar de infopagina's, en er is per spel een link "Hints & walkthrough" bij gekomen.
  - **Infopagina's onderling:** ze linken naar elkaar en naar de hub.
- **Titels en beschrijvingen.** Ze zijn ingekort tot ongeveer 60 en 160 tekens, zodat Google ze niet afkapt. De homepage houdt "Retro Adventure Games Online" vooraan. Daar rankt hij nu op (gemiddelde positie 7,4 in GSC).
- **Techniek.**
  - **Cache:** fonts en vendor-bestanden krijgen 1 jaar `immutable`, beelden 7 dagen.
  - **`.vercelignore`:** sluit `*.md`, `obfuscate.sh`, `_starter/` en de leesbare Ravenholt-bronbestanden uit. De spellen laden de `.min.js`-versies.
  - **`llms.txt`:** wijst naar de infopagina's.

## Testen

```bash
python3 tools/check-seo.py
```

Dit script controleert de site op het volgende:
- elke sitemap-URL bestaat;
- er staan geen `/games/`-URL's in de sitemap;
- elke pagina heeft één H1, een unieke en niet te lange titel, een beschrijving, een eigen canonical en geldige JSON-LD;
- interne links werken;
- de infopagina's hebben 80–180 woorden, hints en een Play-link;
- de speelpagina's staan op noindex.

Draai het na elke wijziging. Daarnaast lopen de volledige speeltesten (Playwright) van alle vier de spellen.

## Terugdraaien

Alles staat in één commit. Met `git revert <commit>` komt de oude situatie terug, met de speelpagina's weer indexeerbaar. Zet in dat geval de `/games/`-URL's terug in de sitemap. Doe dat niet half: een infopagina én een indexeerbare speelpagina voor hetzelfde spel concurreren met elkaar.

## Bewust niet gedaan

- **Geen hreflang voor de infopagina's.** Er zijn nog geen Nederlandse versies van, dus er is niets om naar te verwijzen.
- **Geen pagina's op "gratis spelletjes" of escape rooms.** Die zoekintentie past niet bij deze site.
- **Geen verzonnen zoekvolumes.** Schattingen staan in het dashboard met bron en datum, los van de gemeten GSC-cijfers.

## Volgende stappen

- Nederlandse infopagina's (`/nl/maanhoef/` en zo verder), met een hreflang-paar per spel.
- Over 2 tot 4 weken in GSC kijken of de infopagina's geïndexeerd zijn en of de `/games/`-URL's uit de index verdwijnen.
- Backlinks: vermeldingen op adventure-game-sites en ouderblogs.
