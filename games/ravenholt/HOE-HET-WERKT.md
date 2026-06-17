# Whispers of Ravenholt — Hoe het spel werkt

Een korte uitleg van hoe dit spel in elkaar zit en hoe je het verder bouwt.
Net als Maanhoef en Emberfall draait alles op de gedeelde engine: jij bewerkt
**`js/data.js`** + de art, de engine doet de rest.

## Wat er nu speelbaar is (Hoofdstuk 1, begin)

Het **dorpsplein van Eldoria**. Finn kan:
- **Rondlopen** over de keien (tik op de grond → hij loopt erheen).
- **Voorwerpen oprapen**: een *oud muntje* en een *verfrommeld briefje* (tik erop → hij
  loopt ernaartoe en pakt het op; het verschijnt in de tas onderin).
- **Dingen onderzoeken**: de drooggevallen **fontein** en de oude **watermolen**
  (tik erop → Finn loopt erheen en bekijkt het; dit zet voortgang-vlaggen).
- De **gouden banner** bovenin toont steeds het volgende doel; die verspringt
  zodra je de fontein/molen hebt bekeken en beide voorwerpen hebt.

## Besturing

| Actie | Hoe |
|------|-----|
| Lopen | Tik op een plek op de grond |
| Onderzoeken / oppakken / gebruiken | Tik op een hotspot (fontein, molen, voorwerp) |
| Item selecteren | Tik op een item in de tas; tik dan op de scène of een ander item |
| Verder met tekst | Tik op het tekstvenster of de tekstballon |
| Taal NL/EN · geluid | Knoppen rechtsboven |

## Hoe een scène is opgebouwd (in `js/data.js`)

Alles staat in de `GAME`-structuur. Het belangrijkste per scène:

```js
square: {
  bg: 'assets/art/scene-square.png',     // 568×320 achtergrond
  playerStart: { x, y },                  // waar Finn begint
  walkable: [ { x, y, w, h }, ... ],      // beloopbare keien (rechthoeken)
  obstacles: [ { x, y, w, h } ],          // niet-beloopbaar (de fontein-bak)
  hotspots: [
    { id, rect, walkTo, look, setFlag },          // iets onderzoeken (+vlag zetten)
    { id, rect, walkTo, gives:{ item, giveText }} // iets oppakken
  ]
}
```

- **`walkable` / `obstacles`** bepalen waar Finn mag lopen; de engine zoekt zelf een
  pad rond obstakels (A*).
- **`look`** toont beschrijvende tekst (mag een functie zijn die op `state.flags` let,
  zodat de tekst verandert nadat je iets ontdekt hebt).
- **`gives`** geeft een item in de tas (eenmalig; daarna `emptyText`).
- **`setFlag`** op een hotspot onthoudt dat je iets gedaan/gezien hebt — gebruikt door
  `questRules` om het doel in de banner bij te werken.

## De held-sprites (Finn)

Finn is één vaste figuur (roodharige jongen, blauwe kapmantel, leren tas, houten staf):

| Sprite | Bestand | Wanneer |
|--------|---------|--------|
| Stilstaand | `assets/art/hero.png` | idle (met af en toe ademen) |
| Lopen (frame 1/2) | `assets/art/hero-walk.png`, `hero-walk2.png` | tijdens lopen (2-frame cyclus) |
| Zwaaien | `assets/art/hero-wave.png` | af en toe als vrolijk gebaar |

Gegenereerd met nano_banana (clean op magenta `#FF00FF`), daarna magenta weggekeyd en
verkleind naar ~62px hoog. De bron-PNG's staan in `assets/raw/`. (Een vloeiende
8-frame loopsheet via AutoSprite kan later; nu gebruiken we de 2-frame cyclus, die de
engine ook ondersteunt.)

## Verder bouwen

1. Voeg scènes toe (vallei, molen-binnen, kasteelpoort…) — zie **STORYBOARD.md**.
2. Koppel achtergronden (`scene.bg`, 568×320) en nieuwe item-iconen (`items[].img`).
3. Voeg NPC's, puzzels (runen-volgorde, tegel-volgorde, legpuzzel) en recepten toe —
   zie het volledige datamodel in **../../RETRO-ADVENTURE-SPEC.md**.
4. **Cache-busting bij elke wijziging**: bump `?v=` in `index.html`, `assetVer` in
   `data.js` en `CACHE` (`ravenholt-vN`) in `sw.js`.

Zie ook **[README.md](README.md)** (opzet) en **[STORYBOARD.md](STORYBOARD.md)** (verhaal + cast).
