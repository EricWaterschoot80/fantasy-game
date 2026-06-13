# RetroAdventureWorld — Bouw- & Stijlgids

> De herbruikbare receptkaart voor point-and-click pixel-avonturen in de stijl van
> **De Amulet van Emberfall**. Bedoeld voor [RetroAdventureWorld.com](https://retroadventureworld.com):
> een verzameling kleine, mobiel-speelbare retro-adventures die allemaal dezelfde engine,
> look en regels delen.
>
> **Hoe te gebruiken:** open een nieuwe lege map in Claude Code en geef de opdracht:
> *"Bouw een nieuw avontuur volgens RETRO-ADVENTURE-SPEC.md, met dit verhaal: …"*
> De engine (`engine.js`, `sprites.js`, `scenes.js`, `css/style.css`) is **generiek en
> herbruikbaar** — kopieer die ongewijzigd. Alleen `data.js` en de art-assets zijn per spel uniek.

---

## 0. Gouden regel

**De engine bevat géén verhaal.** Alle scenes, hotspots, items, puzzels, teksten, coördinaten en
sfeer-effecten leven in `js/data.js` als één groot `GAME`-object. Een nieuw avontuur maken =
een nieuw `data.js` schrijven + nieuwe art tekenen. De engine raak je nooit aan, tenzij je een
fundamenteel nieuw *type* interactie toevoegt (en dan generiek, data-driven).

Dit is wat één gedeelde codebase over meerdere games mogelijk maakt.

---

## 1. Concept & toon

- **Genre:** klassiek point-and-click adventure (King's Quest VI / LucasArts-gevoel), opgelost
  met **list, niet geweld**. De speler verzamelt voorwerpen, combineert ze, en lost
  omgevingspuzzels op.
- **Schaal van v1:** 3 scenes, één complete oplosbare puzzelketen, van titelscherm tot winst
  in 5–15 minuten speeltijd. Klein maar áf.
- **Toon:** warm, sprookjesachtig, licht melancholisch. Korte sfeervolle teksten. Humor mag
  (een kwispelend hondje, een snurkende minotaur), maar nooit cynisch.
- **Geen game-over-doodlopers:** de speler kan niet permanent vastlopen. "Dood" (bv. de minotaur
  te dicht naderen) stuurt je terug naar een veilige plek met behoud van voortgang.

---

## 2. Techkeuzes (bindend)

| Onderwerp | Keuze | Reden |
|---|---|---|
| Taal/runtime | **Vanilla JS + HTML5 Canvas** | Geen build-stap, draait direct |
| Frameworks | **Geen** (geen React/Phaser) | Lichtgewicht, snel op mobiel |
| Build-tooling | **Geen** (geen npm/bundler) | Bestanden direct serveerbaar |
| Distributie | **PWA** (manifest + service worker) | Installeerbaar als app, offline speelbaar |
| Doelapparaat | **Mobile-first, landscape**, touch | Liggend canvas, draai-hint bij portrait |
| Hosting | **Vercel / GitHub Pages** (statisch) | Eén-klik deploy, geen server |

**Harde eisen**
- Eén `index.html` als entrypoint; alle paden **relatief** (geen absolute paden) → werkt lokaal
  én op elke host.
- Werkt **offline** na de eerste load (service worker cachet alles).
- Geen `localStorage`-afhankelijkheid voor de kern-gameplay (optioneel opslaan mag).
- **Tweetalig NL/EN** ingebouwd (zie §7).

---

## 3. Art direction

**Pixel art, jaren-90.** Geen geschilderde HD-art — bewust grof, retro, leesbaar.

- **Scene-canvas is low-res:** `568 × 320` interne pixels, opgeschaald naar het scherm met
  `imageSmoothingEnabled = false` (knisperende pixels, geen blur). CSS: `image-rendering: pixelated`.
- **Achtergronden:** AI-gegenereerde of getekende pixel-art PNG's in `assets/art/scene-*.png`,
  exact `568×320`. Een `paintFallbackScene()` in `scenes.js` tekent een neutraal herfstvlak als
  een art-bestand (nog) ontbreekt — het spel blijft altijd speelbaar.
- **Sprites** (personages, items) zijn óók pixel-art. Personage-sprites kunnen als PNG-spritesheet
  óf als string-grid in `sprites.js` (zie §8).
- **Letterbox** in `--bg-deep` rond het canvas; scene wordt met "contain" geschaald (volledig
  zichtbaar, nooit vervormd).

### Kleurpalet (vast — gebruik in CSS-variabelen)

```css
--bg-deep:    #1a1410;  /* donkere achtergrond / letterbox */
--panel:      #221a2e;  /* navy paneel (UI-balken)         */
--panel-2:    #2c2238;  /* lichter paneel                  */
--gold:       #c9a24b;  /* goud-ornament rand / accent     */
--gold-light: #e7cf86;  /* lichte goud highlight           */
--parchment:  #efe3c8;  /* tekstkleur (perkament)          */
--sand:       #d8b98a;  /* zand-accent                     */
--rust:       #a8432a;  /* terracotta/rood accent          */
```

> Een nieuw avontuur mag een **eigen accentkleur** kiezen (bv. ijsblauw voor een winterspel),
> maar het navy+goud UI-frame blijft de RetroAdventureWorld-huisstijl — zo herkent de speler de
> familie van games.

### Typografie

```css
--font-title: 'Cinzel', 'Trajan Pro', Georgia, serif;   /* titels, ornamenteel */
--font-body:  'Crimson Pro', Georgia, serif;             /* verhaaltekst        */
--font-pixel: 'Pixelify Sans', 'Courier New', monospace; /* knoppen, HUD, retro */
```

### UI-stijl

Panelen met een **dubbele goudrand**: 2px `--gold` buitenrand + donkere `box-shadow`-ring
+ inset goud-highlight boven en donker onder (geeft een ingelegd, ornamenteel reliëf).
`border-radius: 0` — scherpe retro-hoeken. Knoppen in `--font-pixel`.

---

## 4. Bestandsstructuur

```
/index.html              # entrypoint: <canvas> + UI-overlay + alle overlay-schermen
/css/style.css           # navy+goud thema, mobile-first, landscape, safe-area insets
/js/sprites.js           # GENERIEK — pixel-sprite-palet + string-grid sprites
/js/scenes.js            # GENERIEK — scene-afmetingen (568×320) + fallback-painter
/js/data.js              # PER SPEL UNIEK — al de spelinhoud (het GAME-object)
/js/engine.js            # GENERIEK — render, input, state, puzzels, audio, i18n
/manifest.webmanifest    # PWA-manifest (naam/iconen per spel aanpassen)
/sw.js                   # service worker — netwerk-eerst, cache als offline-vangnet
/vercel.json             # { "cleanUrls": true, "trailingSlash": false }
/assets/art/*.png        # scene-achtergronden, sprites, item-iconen, overlays
/assets/icons/*.png      # app-iconen 192 + 512
/README.md               # lokaal draaien + deployen
```

**Cache-busting:** script- en CSS-tags krijgen `?v=N`; verhoog `N` én de SW-cachenaam
(`emberfall-vN`) bij elke release, anders zien spelers oude bestanden.

---

## 5. Het datamodel (`data.js`)

Het hele spel is één `const GAME = { … }`. Hieronder elk veld. **Coördinaten zijn scene-pixels
(0–568 × 0–320)**, niet fracties — de engine schaalt ze mee.

### 5.1 Top-level

```js
const GAME = {
  title:      { nl, en },
  titleLines: { nl: [...], en: [...] },   // titel over 2 regels voor het titelscherm
  startScene: 'courtyard',
  sprites:    { hero: 'assets/art/hero.png', … },  // sprite-register (NPC's verwijzen hiernaar)
  winText:    { nl, en },                 // slottekst op de win-overlay
  strings:    { noEffect, noCombine, nothingThere },  // generieke fallback-teksten
  ui:         { … },                      // ALLE knop-/label-/quest-teksten (zie §7)
  questRules: [ … ],                      // data-driven questhints (zie §7)
  items:      { … },                      // inventaris-items
  recipes:    [ … ],                      // combinaties in de tas
  scenes:     { … }                       // de werelden
};
```

### 5.2 Items

```js
items: {
  berries: { name: { nl, en }, icon: '🍒', img: 'assets/art/item-berries.png' },
  flint:   { name: { nl, en }, icon: '🪨', noUseText: { nl, en } }  // bericht als je 'm verkeerd gebruikt
}
```
`icon` (emoji) is de fallback; `img` is de pixel-sprite. Identifiers altijd Engels, teksten NL+EN.
`noUseText` (optioneel): wat het personage zegt als je dit item gebruikt op een hotspot zónder
passende reactie — bv. "Hier heb ik geen vuur nodig." (anders de generieke `strings.noEffect`).

### 5.3 Recepten (combineren)

```js
recipes: [
  { a: 'berries', b: 'vialWater', result: 'potion', text: { nl, en } }
]
```
Volgorde van `a`/`b` maakt niet uit. Beide ingrediënten worden verbruikt, `result` toegevoegd.

### 5.4 Een scene

```js
courtyard: {
  name:       { nl, en },
  bg:         'assets/art/scene-courtyard.png',       // achtergrond (568×320); valt terug op de painter
  bgVariants: [{ img, flag?, notFlag? }],             // wissel-achtergrond; eerste passende variant wint
  entryText:  { nl, en },                  // sfeertekst bij binnenkomst
  playerStart:{ x, y },
  spawnFrom:  { temple: { x, y }, grove: { x, y } },  // waar je verschijnt per herkomst-scene

  walkPoly:   [[x,y], …],   // beloopbaar gebied als veelhoek (point-in-polygon)
  walkable:   [{x,y,w,h}],  // alternatief: beloopbaar als rechthoeken (temple gebruikt dit)
  obstacles:  [{x,y,w,h}],  // niet-beloopbare props binnen het loopgebied

  overlays:   [{ img, x, y, w, h, base }],  // stukken art die VÓÓR het personage vallen
                                            // (base = y-lijn waaronder ze overlappen)
  worldItems: [{ item, hotspot, x, y, requiresFlag? }],  // items die je ziet liggen tot je ze pakt
  npcs:       [{ id, sprite, x, y, facesLeft?, wander?, wanderRequiresFlag? }],
  fx:         { … },        // sfeer-effecten (zie §6)
  hotspots:   [ … ]         // de interactieve plekken (zie §5.5)
}
```

**Diepte-sortering:** personages, NPC's en overlays worden op hun voet-`y` gesorteerd zodat
voorgrond-props (struiken, puin) correct vóór de speler komen.

### 5.5 Hotspots — de bouwstenen van interactie

Elke hotspot heeft `id`, `name {nl,en}`, `rect {x,y,w,h}` (aanklikgebied) en meestal `walkTo {x,y}`
(waar de speler heen loopt vóór de actie). Daarna één of meer gedrags-velden:

| Veld | Doet |
|---|---|
| `look` | toont beschrijvende tekst. Mag een **functie** zijn: `(state) => state.flags.x ? {…} : {…}` voor toestand-afhankelijke tekst |
| `gives` | `{ item, giveText, emptyText, win? }` — geeft eenmalig een item; `win:true` wint het spel |
| `use` | `{ itemId: { consume?, give?, setFlag?, text, needItem?, needText? } }` — reactie op een geselecteerd item. `consume` mag een array zijn (meerdere items tegelijk verbruiken). `needItem`/`needText`: vereist dat de speler óók dat tweede item bij zich heeft, anders toont `needText` (bv. "vuursteen + hout"-puzzel). |
| `exit` | `{ to, travelText }` — reist naar een andere scene |
| `requiresFlag` / `blockedText` | hotspot werkt pas als de flag gezet is; anders `blockedText` |
| `blockedBy` | `[{ flag, text }]` — meerdere voorwaarden, in volgorde gecheckt |
| `arrow` | `{ x, y, dir }` — tekent een knipperende richtingspijl (exits) |
| `speaker: true` | tekstballon verschijnt boven deze hotspot/NPC |
| `followNpc` | koppelt de hotspot aan een bewegende NPC (volgt `npcRt`-positie) |
| `danger` / `angerTexts` | NPC waarschuwt bij naderen; te dichtbij → `die()` |

**Puzzel-velden** (zie §6 voor de puzzeltypes):
`slidePuzzle`, `riddle`, `puzzleKey` (verwijst naar een `puzzles`-blok in de scene).

### 5.6 Flags & winst

State is `{ currentScene, inventory: [itemId], flags: {}, selectedItem: null }`.
Voortgang = flags (`gateOpen`, `minotaurAsleep`, `dogWarm`, …). Eenmalig-gepakte items worden
intern bewaakt met een `taken_<scene>_<hotspot>`-flag. Een hotspot met `gives.win: true` triggert
de win-overlay.

---

## 6. Sfeer-effecten & puzzeltypes (engine-features om uit te putten)

### 6.1 `fx` — sfeer per scene

De engine kan deze effecten tekenen; activeer ze via het `fx`-blok van een scene:

- `fountain: { sx, sy, wx, wy }` — kabbelende fontein + vallende waterstraal
- `flames: [{x,y,r}]` + `embers: [{x,y}]` — flakkerende toortsen met opstijgende vonken
- `fireflies: 8` — zwevende glimwormen (bos-sfeer)
- `emblemGlow`, `amulet`, `waterGlint`, `zzz` (snurk-z'jes), `chestOpen`, `bowlEmpty` — puntgloei,
  glinstering en object-specifieke animaties
- `darkness: { until, peekR, eyes:[{x,y}], glimmers:[{x,y,r,col,base,speed}], motes, peekAround }` —
  dekt de hele scene tot de `until`-flag gezet is. Laat alleen een zacht kijkveld rond de speler
  (`peekR`), gloeiende ogen (`eyes`), gekleurde glimmers (`glimmers` — `col` als `'r,g,b'`, bv. warm
  vuur of koud maanlicht; `base`/`speed` regelen helderheid en flikkertempo) en zwevende stofdeeltjes
  (`motes`, aantal) zien. `peekAround:false` schakelt het kijkveld rond de speler uit. De 👁-knop
  toont nog steeds de hotspots, dus de scene blijft oplosbaar.
- Wereldwijd: **dwarrelende herfstbladeren** over elk scherm; **scene-fades** bij reizen.

### 6.2 De herbruikbare puzzeltypes

**A. Schuifpuzzel** (`hotspot.slidePuzzle`)
```js
slidePuzzle: { img, size: 3, setFlag, title: {nl,en}, solvedText: {nl,en}, burst: {x,y} }
```
Klassieke n×n tegelpuzzel met één gat. Mobiel-Safari-proof (`touchend` + `preventDefault`).
**Twee-niveau hint:** 1× tik = opgeloste afbeelding flitst even; 2× tik = **strategie-tip** —
legt de laag-voor-laag-methode uit (bovenste rij + linkerkolom eerst, naar de hoek rechtsonder
werken, de laatste 2×2 als geheel), markeert het eerstvolgende doelvak en laat de tegel die daar
hoort pulseren. Buiten de overlay tikken sluit hem; kruisje altijd zichtbaar.

**B. Raadsel-dialoog** (`hotspot.riddle`)
```js
riddle: { setFlag, requiresFlag, reward, title, intro, questions: [{ q, answers: [{t, ok}] }], wrongText, solvedText }
```
Meerkeuze-raadsels op rij; één fout = opnieuw. Beloont optioneel met een item (`reward`) en/of
zet `setFlag`. `requiresFlag` (optioneel) bepaalt wanneer het raadsel opengaat — bv. pas ná een
andere gebeurtenis; zonder `requiresFlag` is het altijd beschikbaar.

**C. Volgorde-puzzel / runenstenen** (`scene.puzzles` + `hotspot.puzzleKey`)
```js
puzzles: { runes: { sequence: ['leaf','sun','moon'], setFlag, requiresFlag, revealFlag,
                    blockedText, stepText, resetText, solvedText, doneText, burst } }
// en per steen:  puzzleKey: { puzzle: 'runes', key: 'leaf' }
```
Tik objecten in de juiste volgorde. Op mobiel opent één tik een **popup met knoppen** (geen
pixel-precieze tik op kleine stenen nodig). De juiste volgorde wordt elders in de wereld onthuld
(een tablet, een hint-NPC).

**D. Doolhof / Waterloop** (`hotspot.maze`)
```js
maze: { setFlag, requiresFlag, cells: 5, title: {nl,en}, hint?: {nl,en}, img?, water?: true, solvedText: {nl,en} }
```
Een willekeurig, **altijd oplosbaar** doolhof (recursive-backtracker, `cells`×`cells` gangen).
Loods met de richtingsknoppen (of pijltjestoetsen) naar de gloeiende uitgang; aankomst zet
`setFlag`. Mobiel-vriendelijk (D-pad, schaalt mee met de schermhoogte). `img` wordt als gedimde
achtergrond-textuur achter het rooster getekend (bv. een Higgsfield stenen-kanaal-labyrint). Met
`water: true` wordt het een **waterloop**: het afgelegde pad vult zich met stromend blauw water en
de uitgang is een bekken — "laat het water stromen" tot het de beloning vrijgeeft. Geschikt als
climax-puzzel (bv. de ward bij het altaar).

> Een nieuw avontuur kan deze types vrij hergebruiken en hercombineren. Een nieuw type toevoegen
> = generieke engine-code + een nieuw datablok, nooit hardcoded verhaal.

---

## 7. Tweetaligheid & teksten

Elke speler-zichtbare tekst is een object `{ nl: '…', en: '…' }`. De engine kiest met de helper
`L(value)` op basis van de actieve taal (`langBtn` wisselt). Strings die nóóit los voorkomen
(identifiers, flags, item-id's, sprite-namen) zijn **altijd Engels en eentalig**.

Alle UI-, knop- en **quest-teksten** staan gebundeld in `GAME.ui` (o.a. `startBtn`, `winTitle`,
`replayBtn`, `tapContinue`, en `q_*`-questregels die de speler subtiel sturen).

De **questhint** is data-driven via `GAME.questRules` — een geordende lijst; de eerste regel
waarvan alle voorwaarden kloppen wint, `quest: null` verbergt de hint:

```js
questRules: [
  { when: { flag: 'minotaurAsleep' },             quest: 'q_amulet' },
  { when: { has: ['vialWater', 'berries'] },       quest: 'q_combine' },
  { when: { has: 'potion', notFlag: 'gateOpen' },  quest: 'q_gate' },
  { when: {},                                      quest: 'q_explore' }  // fallback
]
```
`when` ondersteunt `flag` / `notFlag` / `has` / `notHas`, elk een string of array (flags = AND).

**Schrijfstijl:** kort, beeldend, in de tweede persoon ("Je schept helder regenwater…").
Inscripties en NPC-citaten tussen "…". Geen moderne taal, geen uitleggerige tutorials —
de wereld vertelt zichzelf.

---

## 8. Sprites & audio

**Sprites** (`sprites.js`): pixel-art als **string-grids** — elk teken is een palet-kleur uit
`PAL`, `.` = transparant. Compact, versiebeheer-vriendelijk, geen externe tool nodig. Grotere of
geanimeerde personages mogen ook PNG-spritesheets zijn (`hero-walk.png` etc.). Personages hebben
loop-fasen, bob, squash, en kijkrichting (`flip`).

**Audio** (Web Audio, in de engine): kleine gesynthetiseerde `sfx()`-tonen (tap, bark, chime,
rumble) + optioneel sfeermuziek-akkoorden. Geen audiobestanden nodig — alles via oscillators,
dus niets te downloaden en altijd offline. Geluid-knop schakelt alles uit.

---

## 9. Interactiemodel (touch + muis)

- **Tik op hotspot, geen item geselecteerd:** loop ernaartoe (`walkTo`), voer dan de primaire actie
  uit — item pakken / `look`-tekst / exit / puzzel openen.
- **Tik op inventaris-item:** selecteren (gloeiende goudrand); nogmaals = deselecteren.
- **Item geselecteerd → tik op hotspot:** zoek `hotspot.use[itemId]`; gevonden → uitvoeren, anders
  `strings.noEffect`.
- **Item geselecteerd → tik op ander item:** zoek recept; gevonden → combineren.
- **👁-hintknop:** highlight kort alle hotspots met een subtiele goudrand (cruciaal op mobiel).
- **Beweging:** klik-om-te-lopen binnen het `walkPoly`/`walkable`-gebied, met `clampToWalkable`
  zodat je nooit door muren loopt. Optioneel pijltjes/WASD op desktop.
- **Narratie:** navy+goud tekstpaneel onderaan; tik om door te gaan. Berichten in een wachtrij.

**Mobiel-specifiek (geleerde lessen — niet weglaten):**
- `touchend` + `e.preventDefault()` op tegels/knoppen → omzeilt de 300ms-klikvertraging in Safari.
- Kleine doelen (runenstenen) → open een **popup met grote knoppen** i.p.v. pixel-precieze tik.
- Overlay-kruisjes **binnen** de kaart plaatsen (`top:10px; right:10px`), nooit erbuiten (clipt).
- Buiten een overlay tikken sluit hem.
- Draai-hint tonen bij portrait; het spel speelt liggend.

---

## 10. PWA & deploy

`manifest.webmanifest`: `display: fullscreen`, `orientation: landscape`, navy theme-color,
iconen 192 + 512. `sw.js`: **netwerk-eerst** (verse updates), cache als offline-vangnet —
níét cache-first (anders komen updates niet door). Registreer de SW in `index.html`.

Deploy: statische site naar Vercel (`vercel --prod`) of GitHub Pages (push naar `main`).
Geen framework, geen serverconfig.

---

## 11. Acceptatiechecklist (per nieuw avontuur)

- [ ] Alle scenes laden, vullen het scherm (contain, geen vervorming, juiste letterbox).
- [ ] Hotspots aantikbaar; 👁-knop toont ze; loop-pathing blijft binnen het walkPoly.
- [ ] De volledige oplossingsroute leidt van start tot **WINST**.
- [ ] Eenmalige items niet dubbel pakbaar; verbruikte items verdwijnen.
- [ ] Flag-gated hotspots blijven geblokkeerd tot de juiste flag (nette `blockedText`).
- [ ] Onzin-combinaties/gebruik → nette tekst, geen crash, geen console-errors.
- [ ] Win-overlay met `winText`; "Opnieuw spelen" reset de volledige state.
- [ ] NL én EN compleet; taalwissel werkt overal.
- [ ] Werkt op telefoon (touch, landscape) en offline na eerste load.
- [ ] Elk puzzeltype heeft een werkende hint/uitleg.
- [ ] Cache-versie (`?v=N` + SW-naam) opgehoogd.

---

## 12. Wat is data-driven, en wat zijn de engine-uitbreidpunten

**Data-only (alleen `data.js` + art):** scenes, loopgebieden, hotspots & al hun gedrag, items,
recepten, de puzzeltypes, scene-achtergronden (`scene.bg`) en wissel-achtergronden
(`scene.bgVariants`), het sprite-register (`GAME.sprites`), tweetaligheid, en de questhints
(`GAME.questRules`). Een nieuw avontuur bouw je in de regel zónder de engine aan te raken.

**Engine-uitbreidpunten (zelden nodig, maar eerlijk benoemd):**
- **NPC-gedrag** is gekoppeld aan de spritenaam: `dog` (volgt de speler na redding), `seer`
  (gebaart op zijn plek), `minotaur` (bewaakt; slaapt bij de `…Asleep`-flag). Voor een nieuw spel:
  hergebruik die namen voor vergelijkbaar gedrag, laat `npcs` leeg, of voeg een nieuw gedragstype
  generiek toe in `engine.js`.
- **Geluid** (`sfx`) gebruikt een vaste set gesynthetiseerde tonen; extra tonen voeg je toe in de
  engine.
- Een **compleet nieuw interactietype** = generieke engine-code + een nieuw datablok, nooit
  hardgecodeerd verhaal.

---

## 13. Een nieuw avontuur starten — checklist

1. **Kopieer de starterkit** (`/_starter`): generieke engine + een meteen-speelbare stub-`data.js`
   die zónder art draait (fallback-scene + emoji-iconen).
2. Schrijf je eigen `data.js`: titel, items, recepten, scenes met een sluitende puzzelketen,
   `questRules`. Werk in scene-pixels (568×320). Test de route op papier vóór je bouwt.
3. Teken/genereer de art: `scene-*.png` (568×320), item-iconen, sprites, app-iconen; koppel via
   `scene.bg`, `GAME.sprites`, `item.img`.
4. Pas `manifest.webmanifest` + SW-cachenaam + README aan met de nieuwe spelnaam.
5. Loop de acceptatiechecklist (§11) na. Verifieer de winroute geautomatiseerd via de
   `window.__game`-test-API: `start()`, `tap(hotspotId)`, `select(itemId)`, `dismissAll()`,
   `isWinShown()`, `questKey()`.
6. Plaats het als eigen route onder RetroAdventureWorld.com (zie §14).

---

## 14. RetroAdventureWorld.com — de site-opzet

Eén **portaal** met een raster van avonturen, elk een losse PWA in deze stijl. Aanbevolen opzet:
één repo, één domein, subpaden per spel.

```
/                         portaal-landingspagina (raster van spel-kaarten)
/shared/                  (optioneel) gedeelde engine, zie hieronder
/games/
  emberfall/
    index.html            verwijst naar engine + eigen js/data.js
    js/data.js            uniek per spel
    assets/…              eigen art + iconen
    manifest.webmanifest  start_url + scope = /games/emberfall/
    sw.js                 cachenaam per spel (emberfall-vN)
  <volgend-spel>/
```

**Drie keuzes die je maakt:**

1. **Eén domein met subpaden** (`retroadventureworld.com/games/emberfall/`) — het simpelst:
   één Vercel-/Pages-project, één deploy. Elk spel is een zelfstandige statische PWA in zijn
   eigen map. Omdat `manifest` + `sw.js` per map staan, is **elk spel apart installeerbaar** op
   het beginscherm met een eigen icoon en eigen offline-cache.
   *(Subdomeinen per spel kan ook, maar geeft meer DNS-/deploygedoe — niet nodig voor een collectie.)*

2. **Gedeelde engine vs. kopie-per-spel** — de kerntrade-off:
   - *Kopie-per-spel* (wat de starterkit doet): elk spel heeft zijn eigen `engine.js`. Volledige
     isolatie, geen risico dat een wijziging een ouder spel breekt — maar bugfixes moet je per
     spel herhalen. **Begin hiermee.**
   - *Gedeelde, geversioneerde engine* (`/shared/v1/engine.js`, `/shared/v2/…`): elk spel pint
     zich op een versie. Eén plek om te patchen binnen een versie, zonder oudere spellen te breken.
     **Stap hierop over zodra je 3+ spellen hebt** en ze samen wilt onderhouden.

3. **Portaalpagina** op `/`: een pixel-art raster van spel-kaarten (coverart + titel + "Speel"),
   in hetzelfde navy+goud thema, linkend naar elke `/games/<slug>/`. Statische HTML, geen framework.

**Deploy:** één Vercel-project met de repo-root, of GitHub Pages. `cleanUrls: true`.

Elk spel verschilt in `data.js` + art + accentkleur + sfeer; samen voelen ze als één familie.
**Eerste titel:** *De Amulet van Emberfall* (eeuwige herfst, minotaur, runenbos).
