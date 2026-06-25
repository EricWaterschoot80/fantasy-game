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
| Lopen | `assets/art/hero-walk-sheet.png` | **4-frame loopcyclus** (vloeiend) |
| Lopen (terugval) | `hero-walk.png`, `hero-walk2.png` | 2-frame cyclus als er geen sheet is |
| Zwaaien | `assets/art/hero-wave.png` | af en toe als vrolijk gebaar |

Gegenereerd met nano_banana (clean op magenta `#FF00FF`), daarna magenta weggekeyd en
verkleind naar **~84px hoog** (meer detail). De bron-PNG's staan in `assets/raw/`.

- De **loopsheet** is een horizontale strook van 4 frames (contact-links → passing →
  contact-rechts → passing). Het aantal frames staat in `GAME.heroWalkFrames` (= 4); de
  engine speelt ze af tijdens het lopen en spiegelt voor naar-links lopen.
- (Een 8-frame AutoSprite-cyclus lukte niet betrouwbaar; daarom deze 4-frame strook.)

## De raaf (puzzel: glimmend ruilen)

- Op het plein zit een **glanzende raaf** op de oude ton (`npcs: [{ sprite:'ravenPerch', hideFlag:'ravenFed' }]`).
- Selecteer het **muntje** in de tas en gebruik het op de raaf (`hotspots[].use.coin`): de raaf
  pakt het glimmende muntje, **geeft een tip** (“het water stokt bínnen, niet buiten...”) en
  **vliegt weg** (korte vlucht-animatie met `ravenFly`). De vlag `ravenFed` verbergt de raaf
  daarna van het plein (`hideFlag`).
- Twee engine-haken maken dit data-driven: **`appearFlag`** (alleen tonen zodra gezet) en
  **`hideFlag`** (verbergen zodra gezet) werken op zowel NPC's als hotspots.
- De raaf-tip wijst nu de hele queststap aan: het **molenrad** ligt in de **kar van de
  handelsman** bij het kasteel, maar je moet hem afleiden met een **toverboek**-spreuk.

## De grote queststap (toverboek → dansende bloem → molenrad)

1. **Toverboek-puzzel (molen-binnen).** De boeken op de plank zitten vast. Op het boek op de
   tafel staat de volgorde (ROOD, BLAUW, GEEL, GROEN). Trek de boeken in die volgorde
   (`hotspots[].bookPuzzle`, hergebruikt het runen-scherm) → je krijgt het **toverboek** (`spellbook`).
2. **Dansende bloem (kasteel).** Rechts van de poort staat een grote bloem. Selecteer het
   toverboek en gebruik het op de bloem (`use.spellbook`) → de bloem **danst** (`npc.danceFlag`,
   procedurele wieg-animatie) en de **handelsman is afgeleid** (`merchantDistracted`).
3. **Het molenrad pakken.** De kar (`requiresFlag: 'merchantDistracted'`) geeft nu het
   **molenrad** (`millwheel`) — anders meldt de `blockedText` dat de handelsman oplet.

Verder dit hoofdstuk: uitgang-pijlen worden vóór de personages getekend (dus ze vallen
**achter** het karakter); stilstaande figuren **bouncen niet** meer (subtiele squashY-ademhaling);
de held knippert met een ooglid-balk op de juiste oog-lijn; de loop-sprites zijn opnieuw
gegenereerd en even licht als de idle.

## De molen + het molenbinnen

- Bij de **molen** wijst een opvallende pijl omhoog **naar het dorp** (rechter pad → `square`) en
  een pijl bij de **deur** die je **naar binnen** brengt (`exit: { to: 'millInside' }`).
- **In de molen** (`scene-mill-inside.png`) onderzoek je de maalsteen en het vastgelopen tandrad,
  en je **raapt voorwerpen op**: een leeg **flesje** van de plank, het **molenaarsboek** van de
  tafel en een handvol **graan** uit de zak (`gives`-hotspots). Een pijl omlaag (links, vrij van
  de inventarisbalk) brengt je weer naar buiten. Binnen **krimp je niet** naar achteren en staat
  Finn wat groter (vaste, grotere `depth`-schaal: `sFar === sNear`).

## Het kasteel + het radwerk-puzzel

- Vanaf de molen wijst een pijl over het linkerpad **naar de kasteelpoort** (`scene-castle.png`).
- Bij de poort zit het **poortradwerk** vast. Tik erop voor de **radwerk-puzzel** (`hotspots[].gears`):
  **sleep** de 5 radjes (cog-afbeeldingen, op maat) naar de juiste stippel-sockets zodat ze precies
  in elkaar grijpen. Staan alle 5 goed, dan gloeit het radwerk op en gaat de poort open
  (`setFlag`, dan `solvedText`). De radjes **draaien niet** — het gaat puur om de juiste plek.
  Drag-and-drop met pointer-events; `__game.gearAuto()` lost hem in één keer op (testen).

## Hulp & gezelschap

- **Het oogje** (knop rechtsboven, `ui-eye.png`) laat een paar seconden alle hotspot-omtrekken in
  de huidige scène oplichten, zodat je ziet waar je iets kunt onderzoeken/oppakken/heen kunt.
- In de diepte (kleinere `depth`-schaal) loopt de held **iets langzamer** — perspectief.
- Een **bruin muisje** in de molen (`npcs: [{ sprite:'mouse' }]`) is een praat-NPC: klik voor een
  gesprekje; geef hem **graan** (`use.grain`) en hij verklapt waar de molenaar heen ging.

## Bewegende NPC's

- Een NPC met een **`gestureSprite`** wisselt af en toe naar die sprite (met een nerveus wiebeltje).
  Burgemeester Bram gebruikt dit om af en toe **wanhopig met zijn handen te wringen** (geen water).
- De held loopt nu **natuurlijker**: een doorlopende verende pas (2× wippen per cyclus) met een
  zachte gewichtsverschuiving en lichte romp-zwaai i.p.v. een harde 1px-hobbel.

## Diepte (perspectief)

De locaties hebben veel diepte. Per scène kun je dat aanzetten met
`scene.depth = { far, near, sFar, sNear }`: een figuur op de achterste lijn (`y = far`) wordt op
schaal `sFar` getekend, vooraan (`y = near`) op `sNear`, lineair ertussen. Zo **krimpt** de held
(en NPC's) als hij naar achteren loopt. Geen `depth` = geen effect (schaal 1).

## Belichting & detail

- **`scene.charFilter`** legt een CSS-filter over de personages zodat ze in de sfeer van de locatie
  passen — hier een zacht, warm ochtendlicht met iets minder felle kleuren.
- **`GAME.spriteDetail: 2`** — de sprites worden op 2× resolutie opgeslagen en door de engine op
  halve maat getekend, zodat de figuren fijnere details hebben zonder groter te worden.

## NPC's en de staf

- **Burgemeester Bram** staat als NPC op het plein (`npcs: [{ sprite:'mayor', ... }]`).
  De engine tekent elke NPC-sprite generiek als rustig staande figuur; klik erop voor een
  gesprek (look-tekst + `setFlag: 'metMayor'`).
- Finn begint met **de staf van zijn vader** in zijn tas (`GAME.startItems: ['staff']`).
  Tik het voorwerp aan om de beschrijving te lezen — de staf doet nog niets: er hoort een
  **magische steen** in de lege vatting bovenin. (Die steen + spreuken komen in de Vallei der Runen.)
- Voorwerp-iconen (`items[].img`) zijn 16-bit pixel-art in dezelfde stijl (staf, muntje, briefje).

## Verder bouwen

1. Voeg scènes toe (vallei, molen-binnen, kasteelpoort…) — zie **STORYBOARD.md**.
2. Koppel achtergronden (`scene.bg`, 568×320) en nieuwe item-iconen (`items[].img`).
3. Voeg NPC's, puzzels (runen-volgorde, tegel-volgorde, legpuzzel) en recepten toe —
   zie het volledige datamodel in **../../RETRO-ADVENTURE-SPEC.md**.
4. **Cache-busting bij elke wijziging**: bump `?v=` in `index.html`, `assetVer` in
   `data.js` en `CACHE` (`ravenholt-vN`) in `sw.js`.

Zie ook **[README.md](README.md)** (opzet) en **[STORYBOARD.md](STORYBOARD.md)** (verhaal + cast).
