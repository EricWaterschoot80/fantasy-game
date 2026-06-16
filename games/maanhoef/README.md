# Maanhoef 🐴

Een zacht, gezellig 16-bit point-and-click avontuur: het meisje **Loïs** redt haar
paard **Maanhoef**. Onderdeel van RetroAdventureWorld, op de gedeelde engine
(vanilla JS + canvas, PWA). Inhoud staat in `js/data.js`, de engine in `js/engine.js`.

Goed voor beginners en kinderen · ~20 min · tweetalig (NL/EN).

## Verhaal

Loïs' liefste paard Maanhoef zit opgesloten achter een vergrendelde **stalpoort**.
De sleutel hangt aan de halsband van een **schichtig hondje**. Een **wijze uil**
stelt raadsels en een **sissende slang** verspert het bospad.

## Scenes

- **Het Erf** (`farm`) — start: moestuin, schuurtje, de uil op een paal, de stal.
- **Het Wilgenbos** (`grove`) — waterval, de slang in de boom, een kapotte brug naar de grot.
- **De Grot** (`cave`) — runenzegel, het beeld met de waterstroom.
- **De Stal** (`stable`) — Maanhoef achter de poort, de tuigkist.

## Puzzelketen (globaal)

1. Vraag de **uil** om raad → los de raadsels op → krijg de **wilgenfluit**.
2. **Betover de slang** met de fluit (ze valt in slaap en houdt de ogen dicht).
3. Repareer de **brug** met een houten plank uit de stal → steek over naar de grot.
4. In de grot: pak het **bot**, herstel het **runenzegel**, en plaats de **diamant**
   in het beeld zodat het **water** gaat stromen.
5. Vul de **emmer** met water; pluk een **wortel** in de moestuin.
6. Win Maanhoefs vertrouwen (wortel) en geef hem **water** over de poort.
7. Geef het **hondje** het bot → kom bij de **sleutel** → ontgrendel de stalpoort.
8. Maak een **hoofdstel**: kaas → het brutale **muisje** → open de **tuigkist**
   (houten slot) → doe Maanhoef het hoofdstel om → **rijd samen weg** (winst).

## Bijzondere engine-details (Maanhoef)

- De dieren (hond, uil, slang, paard) zitten in de **scene-art**; hotspots liggen
  eroverheen. Alleen Loïs is een bewegende sprite (`hero`).
- **Knipperen**: in Maanhoef knippert alleen de **slang** (de andere figuren niet).
  De slang bemonstert de al getekende canvas-kleur rond haar ogen; slapend houdt ze
  de ogen dicht (`sceneEyeClosed`), wakker knippert ze af en toe (`sceneEyeBlink`).
- De personage-stijlgids staat in **[CHARACTER-BIBLE.md](CHARACTER-BIBLE.md)**.

## Besturing

Tik in de scene om te lopen · tik op iets interactiefs om het te onderzoeken/gebruiken ·
tik een item in de tas aan om te selecteren, dan op de scène of een ander item ·
👁 licht hotspots op · 🔊 geluid · EN/NL taal · gouden banner = huidig doel.

## Cache-busting (bij elke JS/CSS/art-wijziging)

1. `index.html` — bump `?v=N` op alle script/stylesheet/img-tags.
2. `js/data.js` — bump `assetVer`.
3. `sw.js` — bump `CACHE` (`maanhoef-vN`).

Zie de [algemene README](../../README.md) en
**[RETRO-ADVENTURE-SPEC.md](../../RETRO-ADVENTURE-SPEC.md)** voor het datamodel.
