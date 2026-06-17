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

## Op de homepage zetten (wanneer klaar)

Nu nog **niet** gekoppeld op `index.html` van de site (om geen lege demo te
publiceren). Voeg dit toe in de `<main class="grid">` zodra het spel klaar is,
plus een title-afbeelding op `assets/art/title.png`:

```html
<a class="card" href="games/ravenholt/index.html" aria-label="Play Whispers of Ravenholt">
  <span class="badge" data-en="MYSTERY" data-nl="MYSTERIE">MYSTERY</span>
  <img class="cover" src="games/ravenholt/assets/art/title.png?v=1"
       alt="Whispers of Ravenholt, a 16-bit point-and-click mystery"
       loading="lazy" onerror="this.style.display='none'">
  <div class="card-body">
    <h3>Whispers of Ravenholt</h3>
    <p class="meta">Point-and-click · 16-bit · mystery</p>
    <p data-en="A fog-shrouded village hides its secrets..."
       data-nl="Een mistig dorp verbergt zijn geheimen...">A fog-shrouded village hides its secrets...</p>
    <span class="play" data-en="▸ Play free" data-nl="▸ Speel gratis">▸ Play free</span>
  </div>
</a>
```

Vergeet niet ook een `itemListElement` toe te voegen aan de structured-data
(JSON-LD) bovenin `index.html`, naar voorbeeld van de andere spellen.
