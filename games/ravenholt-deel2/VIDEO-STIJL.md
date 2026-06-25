# Ravenholt — Cinematic/Video-stijl (vaste stijl voor video's)

Korte sfeervolle cinematics (~10–12 sec) bij sleutelmomenten (bv. **De Eerste Spreuk**).
Twee looks: **Disney/Pixar 3D** én **Studio Ghibli (aquarel)**. In het spel speelt de video
fullscreen. Lees dit vóór elke nieuwe video-generatie, zodat karakter, setting en stijl
**consistent** blijven. (Zie ook `ART-BRIEF.md` voor de sprite-versie van Finn.)

## Karakter (Finn) — VAST
- **11 jaar**, **sproetjes**, **rood SPITS/PIEKERIG, warrig haar** (puntige plukken die omhoog
  en naar buiten staan, klassiek JRPG/shounen-held), **BRUINE ogen** (nooit blauw).
- **Teal/blauwe kapmantel met de kap OMLAAG**, crème tuniek, bruin leren tasje.
- **Houten staf met een COMPACTE, dicht gekrulde top** (strakke spiraal, **géén steen**); de
  staf **gloeit** op magische momenten (warm goud-blauw uit de krul).
- Uitdrukking: dromer die al lang wil leren toveren — meestal **enthousiast/nieuwsgierig**, op
  magische momenten **verbaasd én dolblij/trots**.

## Setting & licht — VAST
- **Bínnen in de molen**: GESLOTEN steen-en-hout ruimte, massieve wanden, **géén open
  doorgangen**, **géén molen in de verte**; licht **alleen door de kleine boogramen**.
- **Vroege OCHTEND**, warm gouden licht, zachte stralen, stofdeeltjes. Referentie:
  `molen-binnen-Jun-17,-2026,-11_08_06-AM.png`.
- Op tafel: het **open toverboek**, een **flesje inkt** en een **brandende KAARS**. De **staf
  leunt TEGEN de tafel** (niet erop, niet rechtop op tafel).
- **Toverboek: GÉÉN tekst/letters** — alleen een **gloeiend magisch TEKEN/sigil** (rune/embleem).

## Stijl-looks
- **Disney/Pixar 3D**: zachte cinematic 3D, warme magische belichting, soft depth-of-field.
- **Studio Ghibli**: handgeschilderde aquarel/gouache achtergronden, milde cel-shading, warm
  gedempt palet, simpele expressieve ogen, nostalgische sfeer.

## Consistentie-werkwijze (BELANGRIJK — zo bleef alles kloppen)
- Genereer met **`nano_banana_pro`** (image-to-image) en **LOCK** met referenties:
  - **Finn-referentie** (één goed gezichts-frame) **+ staf-referentie** (één goed
    compacte-krul-frame) als `medias:[{role:image,...},{role:image,...}]` → zelfde gezicht én
    staf in elke shot.
  - **Ghibli maken:** re-render de Disney-shot image-to-image met *"Studio Ghibli style; alleen
    de stijl veranderen, scène/compositie/personage exact gelijk."*
  - **Eén ding aanpassen** (bv. haar of het boek): geef de shot **+** een referentie met het
    juiste haar/detail en prompt *"verander ALLEEN X, houd de rest exact gelijk."*
- **Shotlijst (4 beats, ~12 sec):**
  1. Veer in de inkt — Finn doopt de zwarte ravenveer in de inkt (4s).
  2. Close-up van de hand: de inktveer tekent **gloeiende blauwe magische tekens op één
     pagina**, géén gezicht (3s).
  3. Eerste magie — Finn dolblij, boek + staf gloeien, sterretjes (3s).
  4. Klaar om te toveren — trots, met gloeiend boek + gloeiende staf (3s).

## Animatie-pipeline
- **`kling3_0_turbo`**, 1080p, `start_image` = de still. Duur per beat: **4 / 3 / 3 / 3**.
- Prompt = **subtiele** beweging (sparkles, kaarsvlam, lichte camera push-in) + **expliciet**
  *"houd het HAAR en het LICHT exact als het startbeeld — niet veranderen"* (anders driften ze).
- Clips zijn **stil** (geen audio) → de **spelmuziek** speelt eronder.

## Monteren (ffmpeg)
- Per clip: `scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,fps=24`.
- Crossfade tussen beats: `xfade=transition=fade:duration=0.35` op offsets **3.69 / 6.38 / 9.07**
  → ~**12.1 sec** totaal. Master: `-crf 18`.
- **Game-kopie:** 720p, `-crf 24 -an` (~1–2 MB) → `assets/video/spell-cinematic.mp4`.

## In het spel
- De cutscene speelt **fullscreen** zodra `spellWritten` wordt gezet (de inktveer + het
  toverboek aan de molenaarstafel). Overslaan-knop. Recept-veld: `cutscene:` in `data.js`,
  afgehandeld door `playCutscene()` in `engine.js`.
- **Bij vervangen van de video: cache bumpen** (`?v=` in `index.html`, `assetVer` in `data.js`,
  `CACHE` in `sw.js`).

## Bestanden
- Stills: `storyboard/shots/` (Disney), `storyboard/ghibli/` (Ghibli).
- Video's: `storyboard/video/ravenholt-spell-10s.mp4` (Disney),
  `storyboard/video/ravenholt-spell-ghibli.mp4` (Ghibli).
- Referentiepagina's (live, **noindex**): `/storyboard/` (hub) → Disney- en Ghibli-pagina.
