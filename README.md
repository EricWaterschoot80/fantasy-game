# RetroAdventureWorld 🕹️

Een verzameling **16-bit point-and-click avonturen** op één gedeelde engine,
gebouwd als installeerbare **PWA's** in **vanilla JavaScript + HTML5 Canvas** —
geen build-stap, geen frameworks. Mobiel-first (liggend), tweetalig (NL/EN) en
volledig offline speelbaar na de eerste load.

Live: **https://www.retroadventureworld.com**

## De spellen

| Spel | Map | Korte omschrijving | Doc |
|------|-----|--------------------|-----|
| **Maanhoef** | `games/maanhoef/` | Een meisje redt haar paard; uil-raadsel, schichtig hondje, sissende slang. | [README](games/maanhoef/README.md) |
| **The Amulet of Emberfall** | `games/emberfall/` | Eeuwige herfst, een gestolen amulet en een slapende minotaur. | [README](games/emberfall/README.md) |
| **Whispers of Ravenholt** | `games/ravenholt/` | Mistig dorpsmysterie (in opbouw). | [README](games/ravenholt/README.md) |

## Repo-structuur

```
index.html                 homepage (RetroAdventureWorld) — lijst met spellen
README.md                  ← dit bestand (algemeen overzicht)
RETRO-ADVENTURE-SPEC.md    het volledige datamodel + stijlgids + mobiel-lessen
BOUWSPEC.md                de oorspronkelijke bouwspec van het eerste spel
_starter/                  kant-en-klaar, speelbaar skelet voor een NIEUW spel
games/<spel>/              elk spel: een zelfstandige PWA
  ├─ index.html            entrypoint: canvas + alle UI-overlays
  ├─ css/style.css         navy+goud huisstijl (mobile-first)
  ├─ js/sprites.js         GENERIEK — fallback pixel-sprites/props
  ├─ js/scenes.js          GENERIEK — 568×320 scene-buffer + fallback-painter
  ├─ js/data.js            ← ALLE spelinhoud (scenes, items, puzzels, teksten)
  ├─ js/engine.js          GENERIEK — game-loop, lopen, input, geluid, quests, state
  ├─ manifest.webmanifest  PWA-manifest
  ├─ sw.js                 service worker (netwerk-eerst, offline-vangnet)
  └─ assets/{art,audio,icons,scenes,raw}/   PNG's, geluid, iconen
vercel.json                statische host-config (Vercel)
```

## Architectuur in het kort

- **Data-driven.** Een spel = **`js/data.js`** (de `GAME`-structuur) + art-assets.
  `engine.js`, `sprites.js` en `scenes.js` zijn generiek; je raakt ze alleen aan
  voor een écht nieuw engine-feature.
- **Coördinaten**: alles in scene-pixels op een **568×320** buffer (liggend), die
  pixel-perfect wordt opgeschaald naar het scherm.
- **Fallbacks.** Ontbreekt een art-bestand, dan tekent de engine een procedurele
  scene en toont emoji-iconen voor items — zo is een spel meteen speelbaar vóór de
  art klaar is.
- **Tweetalig.** Elke tekst is `{ nl, en }`; de engine kiest met `L()`.
- **Herbruikbare puzzeltypes**: runen-volgorde, tegel-volgorde (met popup) en
  legpuzzel — allemaal data-driven (zie de spec).

Het volledige datamodel staat in **[RETRO-ADVENTURE-SPEC.md](RETRO-ADVENTURE-SPEC.md)**.

## Een nieuw spel maken

Twee startpunten — beide "op dezelfde manier":

1. **Schoon skelet** — kopieer `_starter/` naar `games/<jouwspel>/`. Minimale,
   generieke engine; ideaal om clean te beginnen.
2. **Nieuwste engine** — kopieer een bestaand spel (bv. `games/emberfall/`) met
   alle features (loop-animatie, oog-knipper, tegel-popup, legpuzzel, doolhof) en
   vervang `js/data.js` door je eigen inhoud. Zo is `games/ravenholt/` opgezet.

Daarna:

1. **Teksten & titel** — `title`, `titleLines`, `winText`, `ui` in `data.js`.
2. **Items & recepten** — `items` (emoji `icon`, later `img`) + `recipes`.
3. **Scenes** — per scene `walkPoly`/`walkable`, `hotspots`
   (`look`/`gives`/`use`/`exit`/`requiresFlag`…), evt. `puzzles`, `fx`, `obstacles`.
4. **Questhints** — `questRules` (eerste match wint; `quest:null` verbergt).
5. **Art** — teken `assets/art/scene-*.png` (568×320), koppel via `scene.bg` /
   `scene.bgVariants`; sprites via `GAME.sprites`. Houd in-game iconen klein
   (~30–64px) en in **echte 16-bit pixel-art stijl**.
6. **PWA** — naam in `manifest.webmanifest`, iconen 192+512, `<title>`/og-meta in
   `index.html`.
7. **Homepage** — voeg een `<a class="card">` toe in `index.html` (zie de
   bestaande kaarten) plus een entry in de structured-data (`itemListElement`).

## Cache-busting (BELANGRIJK — bij ELKE wijziging)

De service worker cachet alles offline. Verhoog daarom **alle drie** bij elke
JS/CSS/art-wijziging, anders blijven spelers de oude versie zien:

1. **`index.html`** — bump `?v=N` op álle `<script>`/`<link>`/`<img>`-tags.
2. **`js/data.js`** — bump `assetVer` (wordt als `?v=` achter alle asset-URL's gezet).
3. **`sw.js`** — bump `CACHE` (`<spel>-vN`).

## Lokaal draaien

De service worker werkt niet via `file://` — gebruik een lokale server:

```bash
python3 -m http.server 8124      # of: npx serve .
# open http://localhost:8124  (homepage) of /games/<spel>/
```

## Deployen (Vercel)

Push naar `main` → Vercel deployt automatisch (statische site, geen build).
Handmatig: `vercel` (preview) / `vercel --prod` (productie).
