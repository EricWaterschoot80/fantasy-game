# Starterkit — nieuw RetroAdventureWorld-avontuur

Een kant-en-klaar, **meteen speelbaar** skelet voor een nieuw point-and-click pixel-avontuur
op de gedeelde engine. Kopieer deze map en bouw je eigen spel — je raakt in principe alleen
`js/data.js` en de art-assets aan.

## Wat zit erin

```
index.html              # entrypoint (titel-, win-, death-, puzzel-, raadsel-, rune-overlays)
css/style.css           # navy+goud huisstijl
js/engine.js            # GENERIEK — niet aanpassen
js/sprites.js           # GENERIEK — pixel-sprite-palet (uitbreidbaar)
js/scenes.js            # GENERIEK — 568×320 + fallback-painter
js/data.js              # ← HIER bouw je je spel (nu een mini-stub)
manifest.webmanifest    # PWA-manifest (naam/iconen aanpassen)
sw.js                   # service worker (cachenaam ophogen per release)
vercel.json             # statische host-config
assets/art, assets/icons# leeg — drop hier je PNG's
```

De stub draait **zonder enige art**: de engine valt terug op een geschilderde scene en
toont emoji-iconen voor items. Zo zie je meteen iets werken en bouw je incrementeel verder.

## Snel starten

```bash
cd _starter
python3 -m http.server 8125
# open http://localhost:8125
```

Je speelt nu het mini-spel: **steen → sleutel → slot → kist → winst**.

## Je eigen avontuur bouwen

1. **Teksten & titel** — pas `title`, `titleLines`, `winText`, `ui` aan in `data.js`.
2. **Items & recepten** — vul `items` (emoji `icon` + later `img`) en `recipes`.
3. **Scenes** — definieer per scene: `walkPoly` (beloopbaar gebied), `hotspots`
   (`look` / `gives` / `use` / `exit` / `requiresFlag` …), eventueel `puzzles`.
4. **Questhints** — orden `questRules` (eerste match wint; `quest:null` verbergt).
5. **Art koppelen** — teken `assets/art/scene-*.png` (568×320) en zet het pad in `scene.bg`;
   sprites via `GAME.sprites`; wissel-achtergronden via `scene.bgVariants`.
6. **PWA** — naam in `manifest.webmanifest`, iconen 192+512, cachenaam `adventure-vN` ophogen.

Het volledige datamodel, de drie herbruikbare puzzeltypes en de mobiel-lessen staan in
**`../RETRO-ADVENTURE-SPEC.md`**.

## Engine-uitbreidpunten (zelden nodig)

De engine is data-driven voor scenes, items, hotspots, de drie puzzeltypes, achtergronden,
sprites, tweetaligheid en questhints. Twee dingen leven (nog) in de engine zelf:

- **NPC-gedrag** is gekoppeld aan spritenaam: `dog` (volgt de speler na redding), `seer`
  (staat te gebaren), `minotaur` (bewaakt, slaapt na `…Asleep`-flag). Hergebruik die namen voor
  vergelijkbaar gedrag, of laat `npcs` leeg / gebruik statische sprites voor een nieuw spel.
- **Geluid** (`sfx`) gebruikt een vaste set gesynthetiseerde tonen; nieuwe tonen voeg je toe in
  `engine.js`.

Voor een compleet nieuw interactietype: breid de engine generiek uit (datablok + afhandeling),
nooit met hardgecodeerd verhaal.
