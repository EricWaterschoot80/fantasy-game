# De Amulet van Emberfall

16-bit point-and-click avontuur (vanilla JS + canvas, PWA). Onderdeel van RetroAdventureWorld.
Inhoud staat in `js/data.js` (de `GAME`-structuur), de engine in `js/engine.js`.

## Afbeeldingen genereren (BELANGRIJK)

Het spel is **16-bit pixel-art** — in-game iconen/sprites (items, tegels, props) moeten daarom
ook **echte 16-bit pixel-art** zijn, niet fotorealistisch. **Alles in dezelfde stijl**: nieuwe
assets moeten matchen met de bestaande pixel-art én met de scène eromheen (bv. de tegel-puzzel
gebruikt zandsteen-tegels die bij de tempelvloer passen). Prompt expliciet:
"16-bit / SNES pixel-art, chunky pixels, harde randen, vlakke kleuren, geen anti-aliasing".
- **`nano_banana` (nano_banana_pro)** geeft de rijkste, consistente beelden — gebruik het vooral
  voor grote/realistische visuals (hero-banner homepage, eind-illustratie). Voor in-game
  pixel-iconen kan het té realistisch zijn; dan `seedream_v5_lite` met een sterke pixel-prompt.
- **Achtergrond = vlak fel magenta `#FF00FF`** (geen schaduw/gradient). Daarna key je magenta
  weg op tint (R&B hoog, G laag) + despill; dat snijdt veel schoner dan grijs (glas/steen
  worden niet "opgegeten" zoals bij een grijze achtergrond).
- Eén consistente set varianten (bv. leeg/water/brouwsel/drank-flesje of de 4 tegels): genereer
  ze in **één rij op één afbeelding** en snijd in gelijke stukken — dan zijn ze identiek.
- In-game iconen klein houden (NEAREST downscalen, ~30-64px) zodat de pixels chunky blijven.
- Higgsfield **AutoSprite** voor geanimeerde sprite-sheets (held-loopcyclus, vogel).

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
