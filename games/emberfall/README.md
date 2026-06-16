# De Amulet van Emberfall

16-bit point-and-click avontuur (vanilla JS + canvas, PWA). Onderdeel van RetroAdventureWorld.
Inhoud staat in `js/data.js` (de `GAME`-structuur), de engine in `js/engine.js`.

## Afbeeldingen genereren (BELANGRIJK)

**Gebruik standaard `nano_banana` (nano_banana_pro) voor losse afbeeldingen** (items, props,
scene-elementen, visuals): die geeft de mooiste, meest realistische en consistente resultaten.
Zo zijn o.a. de flesjes (rond, realistisch glas) en de tegel-puzzel-visual gemaakt.
- Voor één consistente set varianten (bv. leeg/water/rood/drank-flesje): laat nano_banana ze in
  **één afbeelding op een rij** maken en snijd ze daarna in losse iconen — dan zijn ze identiek.
- Higgsfield **AutoSprite** blijft voor geanimeerde sprite-sheets (held-loopcyclus, vogel).
- Verwijder telkens de neutrale achtergrond (flood-fill vanaf de randen) en bewaar transparant PNG.

## Hoofdpersoon — character consistency (BELANGRIJK)

De held is één vaste figuur: een meisje met een **rode kap en mantel, leren tas/uitrusting**.
De canonieke afbeelding is [`assets/art/hero.png`](assets/art/hero.png). Alle andere held-art
(idle, zwaaien, loopcyclus) moet **exact dezelfde figuur** zijn — geen nieuw personage.

**Nieuwe held-animaties maak je via Higgsfield AutoSprite mét `hero.png` als referentie**
(zo blijft de figuur consistent — niet vanuit een tekstprompt een nieuwe held genereren):

1. Upload de canonieke held: `media_upload` met `hero.png` → PUT naar de upload-URL → `media_confirm` (type `image`). Je krijgt een `media_id`.
2. `generate_image` met `model: "autosprite"`, `medias: [{ role: "image", value: "<media_id>" }]`,
   en de gewenste `kind`:
   - `iso_walk_right` → **3/4 zij-loopcyclus** (huidige loopanimatie; kijkt naar rechts, engine spiegelt voor links)
   - `walk` = vol profiel (te zijwaarts, niet gebruiken), `iso_walk_down` = frontaal (te recht-van-voren)
   - `frame_count: 8`, `frame_size: 128`, `is_humanoid: true`, `remove_bg: "ultra"`.
3. De sheet is 3×3 (8 frames). Snijd elk frame, neem de **gezamenlijke bounding box** van alle
   frames (consistente centrering + voet-lijn), schaal naar ~60px hoog en plak naast elkaar tot
   één horizontale strip → [`assets/art/hero-walk-sheet.png`](assets/art/hero-walk-sheet.png).
4. De strip is geregistreerd als `GAME.sprites.heroWalkSheet` en wordt in `drawPlayerSprite()`
   (engine.js) frame voor frame afgespeeld tijdens het lopen (cadans `player.phase * 0.63`).
   `player.flip` (= naar links lopen) spiegelt de frames horizontaal.

Dezelfde aanpak geldt voor de geanimeerde vogel (`robin-fly.png`, AutoSprite sprite-sheet).

## Cache-busting (bij elke JS/CSS/art-wijziging)

- `index.html`: bump `?v=N` op alle script/stylesheet-/img-tags.
- `js/data.js`: bump `assetVer` (wordt als `?v=` achter alle asset-URL's gezet).
- `sw.js`: bump `CACHE` (`emberfall-vN`) en voeg nieuwe assets toe aan `PRECACHE`.

## Deploy

Pushen naar `main` → Vercel deployt automatisch.
