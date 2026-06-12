# De Amulet van Emberfall 🍁

Een point-and-click fantasy avontuur in rijke pixel-art stijl, voor mobiel,
gebouwd als PWA in vanilla JavaScript + HTML5 Canvas. Geen build-stap, geen
frameworks. De scene-achtergronden en karakters zijn AI-gegenereerde pixel-art
(via Higgsfield, bronbestanden in `assets/raw/`), gerenderd op een 320×480
low-res buffer die pixel-perfect wordt opgeschaald. Als een art-bestand
ontbreekt valt de engine terug op procedureel getekende pixel-graphics.

## Lokaal draaien

Gebruik een lokale server (de service worker werkt niet via `file://`):

```bash
# optie 1 — Python
python3 -m http.server 8000

# optie 2 — Node
npx serve .
```

Open daarna `http://localhost:8000` op de desktop, of op je telefoon via je
lokale IP (`http://<jouw-ip>:8000`) terwijl beide op hetzelfde wifi zitten.

## Deployen op Vercel

```bash
npm i -g vercel      # eenmalig
vercel               # preview-deploy (framework = "Other")
vercel --prod        # productie-deploy
```

Na deploy: open de URL op je telefoon → browser-menu → **"Toevoegen aan
beginscherm"**. Dankzij de PWA-manifest installeert het als volwaardige app
en speelt het offline na de eerste load.

## Besturing

- **Tik ergens in de scene** en je personage loopt erheen (liggend spelen).
- **Tik op iets interactiefs** (altaar, runen, de minotaur...) en je loopt
  erheen en onderzoekt het. Muren, zuilen en props blokkeren de weg.
- **👁-knop** rechtsboven licht alle interactieve plekken kort op.
- **Tik op een item** in de tas om het te selecteren; tik daarna op iets in de
  scene om het te gebruiken, of op een ander item om te combineren.
- **Tik op het tekstvenster of de tekstballon** om verder te gaan.
- De **gouden banner** bovenin toont je huidige doel.
- **🔊** zet muziek + geluid aan/uit; **EN/NL** wisselt de taal.
- Pas op: wie de minotaur te vaak port, vliegt de tempel uit. 💀

Drie scenes: de binnenplaats, het Runenbos (volgorde-puzzel met de
runenstenen — de hint staat op het kleitablet) en de tempel.

## Structuur

```
index.html             entrypoint: canvas + UI-overlay
css/style.css          navy+goud thema, mobile-first
js/sprites.js          fallback pixel-sprites + props (amulet, vlammen, Zzz)
js/scenes.js           fallback procedurele scenes + bewegend decor
js/data.js             ALLE spelinhoud (scenes, items, recepten, hotspots, fx)
js/engine.js           engine: game-loop, lopen, input, geluid, quests, state
manifest.webmanifest   PWA-manifest
sw.js                  service worker (offline cache)
assets/art/*.png       AI-gegenereerde achtergronden en karaktersprites
assets/raw/*.png       onbewerkte AI-bronbestanden (niet gecachet)
assets/icons/*.png     app-iconen
```

Nieuwe scenes of puzzels toevoegen = alleen `js/data.js` uitbreiden; de engine
hoeft niet aangepast te worden.

> **Let op bij updates:** de service worker cachet alles offline (cache-first).
> Verhoog na elke wijziging het versienummer in `sw.js` (`const CACHE =
> 'herfstamulet-vX'`), anders blijven spelers de oude versie zien.
