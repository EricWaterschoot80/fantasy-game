# Whispers of Ravenholt 🌫️

Een 16-bit point-and-click **mysterie**-avontuur in een mistig dorp. Onderdeel van
RetroAdventureWorld, op dezelfde gedeelde engine als Maanhoef en Emberfall.

> **Status: in opbouw.** Hoofdstuk 1 heeft een **speelbaar beginpunt**: het
> dorpsplein van Eldoria met eigen achtergrond en de held **Finn** (eigen sprites:
> lopen + zwaaien). Je loopt over de keien, raapt voorwerpen op (muntje, briefje) en
> onderzoekt de drooggevallen fontein en de watermolen. Uitleg van de werking staat in
> **[HOE-HET-WERKT.md](HOE-HET-WERKT.md)**; het verhaal + cast in
> **[STORYBOARD.md](STORYBOARD.md)**.

## Hoe dit is opgezet

Gekopieerd van het nieuwste spel (Emberfall), zodat alle engine-features
beschikbaar zijn (loop-animatie, oog-knipper, tegel-popup, legpuzzel, doolhof,
tweetaligheid, fallbacks). Alleen `js/data.js` is vervangen door een schone
Ravenholt-stub.

```
index.html              entrypoint + alle UI-overlays (titel/win/death/puzzels/zoom)
css/style.css           gedeelde navy+goud huisstijl
js/engine.js            GENERIEK — niet aanpassen (tenzij nieuw engine-feature)
js/sprites.js           GENERIEK — fallback-sprites/props
js/scenes.js            GENERIEK — 568×320 buffer + fallback-painter
js/data.js              ← HIER bouw je je spel (nu een speelbare stub)
manifest.webmanifest    PWA-naam = "Whispers of Ravenholt"
sw.js                   service worker (CACHE = 'ravenholt-vN')
assets/art|audio|icons|scenes|raw/   drop hier je bestanden
```

## Lokaal draaien

```bash
# vanuit de repo-root, één server voor de hele site:
python3 -m http.server 8124
# open http://localhost:8124/games/ravenholt/
```

## Je spel bouwen (volgorde)

Bewerk vooral **`js/data.js`** (`GAME`). Zie het volledige datamodel +
voorbeelden in **[../../RETRO-ADVENTURE-SPEC.md](../../RETRO-ADVENTURE-SPEC.md)**.

1. **Teksten/titel** — `title`, `titleLines`, `winText`, `ui`.
2. **Items + recepten** — `items` (start met emoji `icon`, later `img`), `recipes`.
3. **Scenes** — per scene: `entryText`, `playerStart`, `walkPoly` (of `walkable`),
   `hotspots` (`look`/`gives`/`use`/`exit`/`requiresFlag`/`blockedText`), evt.
   `puzzles`, `fx`, `obstacles`, `overlays`, `npcs`.
4. **Questhints** — `questRules` (eerste match wint; `quest:null` verbergt).
5. **Art koppelen** — scenes als `assets/art/scene-*.png` (568×320) via `scene.bg`
   (of wissel-achtergronden via `scene.bgVariants`); sprites via `GAME.sprites`.
   In-game iconen klein (~30–64px) en in **echte 16-bit pixel-art stijl**.
   Bron-PNG's met een vlakke achtergrond? Genereer op fel **magenta `#FF00FF`**
   en key die weg (zie de Emberfall-README voor de workflow).
6. **Iconen/PWA** — vervang `assets/icons/icon-192.png` + `icon-512.png` door eigen
   art; titel staat al goed in `manifest.webmanifest` en `index.html`.

## Cache-busting (bij ELKE wijziging)

1. `index.html` — bump `?v=N` op alle script/stylesheet/img-tags.
2. `js/data.js` — bump `assetVer`.
3. `sw.js` — bump `CACHE` (`ravenholt-vN`).

## Op de homepage + SEO

Ravenholt **staat nu op de homepage** (`index.html`, in de `<main class="grid">`) met een
eigen kaart (cover = `assets/art/scene-square.png`, badge `MYSTERY/MYSTERIE`) en is opgenomen
in de `ItemList`-structured-data. Daarnaast heeft de spelpagina zelf:

- een unieke **`<title>`**, **`meta description`**, **`keywords`** en Open Graph/Twitter-tags;
- een **`VideoGame` JSON-LD**-blok met een uitgebreide, unieke beschrijving (de "uitleg"
  waarmee zoekmachines het spel beter vinden).

Elk spel (Maanhoef, Emberfall, Ravenholt) heeft zo zijn eigen SEO-tekst en structured data.
Een eigen `assets/art/title.png` (voor de social-share-afbeelding via `og:image`) staat nog
op de wensenlijst — tot die er is valt de homepage-cover terug op de dorpsplein-achtergrond.
