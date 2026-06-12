# Bouwspec — "De Amulet van de Herfst"

> Een point-and-click fantasy avontuur in de stijl van **King's Quest VI**, voor mobiel,
> gebouwd als web-game (PWA) en te deployen op **Vercel**.
>
> **Hoe te gebruiken:** open deze map in **Claude Code** met het **Fable**-model en geef de
> opdracht: *"Bouw het spel volgens BOUWSPEC.md."* Alle ontwerpkeuzes, data en assets staan
> hieronder. Bouw exact wat hier beschreven staat; vul kleine gaten met gezond verstand.

---

## 1. Pitch

Het is voor altijd herfst geworden in een oud rijk. De **Amulet van de Herfst** is gestolen en
verborgen in een vervallen zuilentempel, bewaakt door een **minotaur**. De speler is een reiziger
zónder zwaard en moet de amulet terughalen door de wereld te onderzoeken, voorwerpen te verzamelen
en te combineren, en de minotaur met list (niet geweld) uit te schakelen.

Versie 1 = **2 scenes**, een **complete oplosbare puzzelketen**, van begin tot winst speelbaar.

---

## 2. Techkeuzes (bindend)

| Onderwerp        | Keuze | Reden |
|------------------|-------|-------|
| Taal/runtime     | **Vanilla JavaScript + HTML5 Canvas** | Geen build-stap, draait direct lokaal en op Vercel |
| Distributie      | **PWA** (manifest + service worker) | Installeerbaar als app op de telefoon, zonder appstore |
| Doelapparaat     | **Mobile-first**, portrait, touch | Past bij de screenshots |
| Hosting          | **Vercel** (statische site) | Eén klik deploy, geen server nodig |
| Build-tooling    | **Geen** (geen npm/bundler vereist) | Bestanden direct serveerbaar |
| Frameworks       | **Geen** (geen React/Phaser) | Lichtgewicht, snel laden op mobiel |

**Harde eisen**
- Geen `localStorage` afhankelijkheid voor de kern-gameplay (mag wel voor optioneel opslaan).
- Werkt offline na eerste load (service worker cachet assets).
- Eén `index.html` als entrypoint; alle assets relatief gelinkt (geen absolute paden) zodat het
  zowel lokaal (`file://` of lokale server) als op Vercel werkt.

---

## 3. Art direction

Gebaseerd op de twee meegeleverde screenshots: een **isometrische, geschilderde fantasy-stijl** met
warme herfstkleuren — zandsteen-beige, terracotta-rood, herfstblad-oranje, grijs steen — en een
**donkere navy + goud-ornament UI**.

**Kleurpalet (gebruik deze in CSS):**

```
--bg-deep:    #1a1410;  /* donkere achtergrond / letterbox */
--panel:      #221a2e;  /* navy paneel (UI-balken)         */
--panel-2:    #2c2238;  /* lichter paneel                  */
--gold:       #c9a24b;  /* goud-ornament rand / accent     */
--gold-light: #e7cf86;  /* lichte goud highlight           */
--parchment:  #efe3c8;  /* tekstkleur (perkament)          */
--sand:       #d8b98a;  /* zand-accent                     */
--rust:       #a8432a;  /* terracotta/rood accent          */
```

**UI-stijl:** panelen met een dubbele goudrand (buitenrand `--gold`, binnenlijn `--gold-light`),
lichte schaduw, afgeronde hoeken ~6px, serif-titel (bv. *Cinzel* of *Trajan*-achtig; val terug op
`Georgia, serif`). Bodytekst in een leesbare serif of system-serif.

---

## 4. Meegeleverde assets

In deze map staan, klaar voor gebruik:

```
assets/scenes/courtyard.jpg   # Scene 1 — De Verlaten Binnenplaats (1179×1305)
assets/scenes/temple.jpg      # Scene 2 — De Tempel van de Minotaur (1179×1305)
IMG_5324.PNG                  # Originele screenshot (bron, niet gebruiken in game)
IMG_5325.PNG                  # Originele screenshot (bron, niet gebruiken in game)
```

De twee `.jpg`-bestanden zijn al bijgesneden (telefoon-/advertentie-UI verwijderd) en dienen als
**scene-achtergronden**. Teken ze met "contain" (volledig zichtbaar, letterbox in `--bg-deep`).

**Nog te maken assets (door Fable te genereren of als placeholder):**
- App-iconen `assets/icons/icon-192.png` en `icon-512.png` (navy met goud amulet/blad).
- Inventory-iconen: gebruik in v1 de emoji uit het datamodel (§6) als placeholder; later vervangbaar
  door kleine pixel/painted sprites van 64×64.

---

## 5. Architectuur & bestandsstructuur

Houd het simpel en data-driven. Voorgestelde structuur:

```
/index.html                  # entrypoint: canvas + UI-overlay
/css/style.css               # navy+goud thema, mobile-first, responsive
/js/data.js                  # ALLE spelinhoud (scenes, items, recepten) — zie §6
/js/engine.js                # de generieke engine (render, input, state) — zie §7
/manifest.webmanifest        # PWA-manifest
/sw.js                       # service worker (offline cache)
/assets/scenes/*.jpg         # achtergronden (meegeleverd)
/assets/icons/*.png          # app-iconen
/vercel.json                 # (optioneel) statische config
/README.md                   # lokaal draaien + deployen
```

**Belangrijk:** de engine bevat **geen** verhaal/inhoud. Alle scenes, hotspots, items en teksten
leven in `data.js` zodat content uitbreiden geen engine-wijziging vereist.

---

## 6. Datamodel & volledige spelinhoud

Implementeer `data.js` exact met onderstaande inhoud (Nederlandse teksten, Engelse identifiers).
Hotspot-coördinaten zijn **fracties (0..1)** van de achtergrond-afbeelding (`x,y` = linkerbovenhoek,
`w,h` = breedte/hoogte), zodat ze meeschalen op elk scherm.

### 6.1 Items

| id          | naam               | icoon | beschrijving |
|-------------|--------------------|-------|--------------|
| `berries`   | Rode Bessen        | 🍒 | Een handvol dieprode bessen. |
| `vialEmpty` | Leeg Flesje        | 🍶 | Een oud glazen flesje, heel gebleven. |
| `vialWater` | Flesje Water       | 💧 | Gevuld met helder regenwater. |
| `potion`    | Slaapdrank         | 🧪 | Zoetgeurend brouwsel dat slaperig maakt. |
| `amulet`    | Amulet van de Herfst | 🍁 | De gestolen amulet; gloeit warm. |

### 6.2 Recepten (combineren in de tas)

| a | b | resultaat | verbruikt | tekst |
|---|---|-----------|-----------|-------|
| `berries` | `vialWater` | `potion` | beide | "Je kneust de Rode Bessen in het regenwater. Het brouwsel kleurt diep en geurt zoet — een Slaapdrank." |

### 6.3 Scene 1 — `courtyard` (De Verlaten Binnenplaats)

Achtergrond `assets/scenes/courtyard.jpg`. Bij binnenkomst: *"Een binnenplaats van zandsteen,
overwoekerd door rode herfststruiken."*

| hotspot id | naam | rect (x,y,w,h) | gedrag |
|-----------|------|----------------|--------|
| `altar`   | Verweerd Altaar | 0.10, 0.00, 0.27, 0.18 | **look:** "Een verweerd altaar. In een uitgesleten kom heeft zich regenwater verzameld. Inscriptie: “Wat de woede van het beest sust, groeit rood tussen de stenen.”" • **gebruik `vialEmpty`:** geef `vialWater`, verbruik `vialEmpty`, tekst "Je schept helder regenwater in het flesje." • **gebruik `vialWater`:** "Je flesje is al vol." |
| `emblem`  | Gouden Embleem | 0.84, 0.00, 0.16, 0.12 | **look:** "Een gouden embleem van de Herfstorde gloeit zwak. Het wijst naar het oosten — naar het pad." |
| `seer`    | De Ziener | 0.40, 0.60, 0.18, 0.24 | **look/talk:** "De gehulde ziener fluistert: “Voorbij het pad waakt de minotaur. Geen zwaard velt hem — enkel slaap. Hij drinkt uit de stenen schaal in de tempel wanneer niemand kijkt.”" |
| `bushes`  | Rode Struiken | 0.00, 0.70, 0.26, 0.30 | **geeft** `berries` (eenmalig). giveText: "Tussen de rode struiken pluk je een handvol Rode Bessen." emptyText: "De struiken zijn nu kaal geplukt." |
| `rubble`  | Brokstukken | 0.74, 0.52, 0.26, 0.36 | **geeft** `vialEmpty` (eenmalig). giveText: "Onder het puin vind je een Leeg Flesje, ongeschonden." emptyText: "Niets bruikbaars meer." |
| `toTemple`| Pad naar de Tempel | 0.80, 0.18, 0.20, 0.30 | **exit → `temple`.** travelText: "Je volgt het pad naar de tempel..." |

### 6.4 Scene 2 — `temple` (De Tempel van de Minotaur)

Achtergrond `assets/scenes/temple.jpg`. Bij binnenkomst: *"Verweerde zuilen torenen boven je uit.
Iets groots beweegt in de schaduw."*

| hotspot id | naam | rect (x,y,w,h) | gedrag |
|-----------|------|----------------|--------|
| `frieze`  | Fries met Glyphen | 0.00, 0.04, 0.60, 0.18 | **look:** "Gehouwen glyphen tonen een geknield beest dat uit een schaal drinkt en in slaap valt." |
| `minotaur`| De Minotaur | 0.28, 0.30, 0.46, 0.62 | **look (wakker):** "De minotaur gromt en heft zijn zwaard. Veel te sterk om te bevechten." • **look (slaapt):** "De minotaur ligt in diepe slaap en snurkt als een onweer." • **gebruik `potion`:** "Hij neemt niets uit jouw hand aan. Misschien drinkt hij liever onbespied, uit zijn eigen schaal..." |
| `bowl`    | Stenen Schaal | 0.14, 0.70, 0.24, 0.16 | **look:** "Een uit de vloer gehouwen drinkschaal, half gevuld met water." • **gebruik `potion`:** zet flag `minotaurAsleep`, verbruik `potion`, tekst "Je giet de Slaapdrank ongezien in de schaal. De minotaur drinkt gulzig... en zakt loom in slaap. De weg naar het altaar is vrij." |
| `shrine`  | Altaar met Amulet | 0.55, 0.16, 0.27, 0.26 | **vereist flag `minotaurAsleep`.** Zonder flag look: "De minotaur verspert de weg naar het altaar." Met flag: **geeft** `amulet` en **wint het spel**. giveText: "Je grijpt de Amulet van de Herfst van het altaar. Warm licht stroomt door je heen." |
| `toCourtyard`| Terug naar de Binnenplaats | 0.00, 0.40, 0.12, 0.45 | **exit → `courtyard`.** |

### 6.5 De oplossingsroute (voor verificatie)

1. Onderzoek **Rode Struiken** → krijg `berries`.
2. Onderzoek **Brokstukken** → krijg `vialEmpty`.
3. Gebruik `vialEmpty` op het **Altaar** → krijg `vialWater`.
4. Combineer `berries` + `vialWater` in de tas → `potion` (Slaapdrank).
5. (Hint via **Ziener** + **Fries**: de minotaur drinkt uit de schaal.)
6. Ga oostwaarts naar de **tempel**.
7. Gebruik `potion` op de **Stenen Schaal** → minotaur slaapt (`minotaurAsleep`).
8. Onderzoek het **Altaar met Amulet** → pak `amulet` → **WINST**.

---

## 7. Engine-eisen (`engine.js`)

**State:** `{ currentScene, inventory: [itemId], flags: {}, selectedItem: null }`.

**Rendering**
- Canvas vult het scherm; teken de scene-achtergrond met **contain** (volledig zichtbaar, gecentreerd,
  letterbox in `--bg-deep`). Bereken schaal/offset en gebruik die om hotspot-fracties → schermpixels
  te mappen.
- Hotspots zijn standaard **onzichtbaar**. Toon de naam van de hotspot onder de cursor/vinger boven in beeld.
- **Hints-knop (👁):** highlight kort alle hotspots met een subtiele goudrand — belangrijk voor mobiel.

**Interactiemodel (touch + muis)**
- **Tik op hotspot, geen item geselecteerd:** voer de primaire actie uit — als de hotspot een item
  *geeft* en nog niet gepakt is → pak het; anders → toon `look`-tekst; exit → reis naar doelscene.
- **Tik op inventory-item:** selecteer het (gemarkeerd, "cursor draagt item"). Nogmaals tikken =
  deselecteren.
- **Item geselecteerd → tik op hotspot:** zoek `hotspot.use[itemId]`. Gevonden → voer uit (geef item /
  zet flag / verbruik / toon tekst). Niet gevonden → "Dat werkt hier niet." Daarna deselecteren.
- **Item geselecteerd → tik op ander inventory-item:** zoek recept; gevonden → maak resultaat, verbruik
  ingrediënten, toon recept-tekst.

**Narratie/tekstvenster:** een navy+goud paneel onderaan over het canvas; toont de laatste tekst.
Tik om door te gaan / te sluiten. Houd berichten in een eenvoudige wachtrij.

**Inventory-balk:** rij ornamentele "slots" onderaan (DOM of canvas), met item-iconen; geselecteerd
slot krijgt een gloeiende goudrand.

**Win-staat:** bij `win`-actie → toon een win-overlay met `GAME.winText` en een "Opnieuw spelen"-knop
die de state reset.

**Robustheid:** eenmalige items mogen niet dubbel gepakt worden (gebruik flags); exits altijd
beschikbaar; onbekende combinaties geven nette feedback i.p.v. een crash.

---

## 8. PWA-eisen

`manifest.webmanifest`:
```json
{
  "name": "De Amulet van de Herfst",
  "short_name": "Herfstamulet",
  "start_url": "./index.html",
  "display": "fullscreen",
  "orientation": "portrait",
  "background_color": "#1a1410",
  "theme_color": "#221a2e",
  "icons": [
    { "src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```
`sw.js`: cache `index.html`, css, js en de twee scene-jpg's bij install; serveer cache-first zodat het
spel **offline** speelt. Registreer de service worker in `index.html`.

Voeg in `<head>` toe: viewport-meta met `viewport-fit=cover`, `theme-color`, en de manifest-link.

---

## 9. Lokaal draaien

Geen build nodig. Vanwege de service worker / asset-fetches een lokale server gebruiken (niet `file://`):

```bash
# optie 1 — Python
python3 -m http.server 8000
# optie 2 — Node
npx serve .
```
Open daarna `http://localhost:8000` op de desktop, of op je telefoon via het lokale IP-adres
(`http://<jouw-ip>:8000`) terwijl beide op hetzelfde wifi zitten.

---

## 10. Deployen op Vercel

Statische site, geen framework:

```bash
npm i -g vercel      # eenmalig
vercel               # preview-deploy (volg de prompts; framework = "Other")
vercel --prod        # productie-deploy
```
Optioneel `vercel.json`:
```json
{ "cleanUrls": true, "trailingSlash": false }
```
Na deploy: open de URL op je telefoon → browser-menu → **"Tovoegen aan beginscherm"** om het als app
te installeren (dankzij de PWA-manifest).

---

## 11. Acceptatiecriteria (testchecklist)

- [ ] Beide scenes laden en vullen het scherm correct (contain, geen vervorming, letterbox-kleur klopt).
- [ ] Hotspots zijn aantikbaar; de 👁-hints-knop toont ze.
- [ ] De volledige route uit §6.5 leidt van start tot **WINST**.
- [ ] Eenmalige items zijn niet dubbel te pakken; gebruikte items verdwijnen uit de tas.
- [ ] `amulet` is niet te pakken vóór `minotaurAsleep` (altaar geblokkeerd door minotaur).
- [ ] Onzinnige combinaties/gebruik geven nette tekst, geen crash.
- [ ] Win-overlay verschijnt met `winText`; "Opnieuw spelen" reset de state.
- [ ] Werkt op een telefoonscherm (touch), portrait; werkt offline na eerste load.
- [ ] Deployt zonder fouten naar Vercel.

---

## 12. Stretch goals (na v1, optioneel)

- Lopend personage (klik-om-te-bewegen pathing) i.p.v. statische scene.
- Eigen geschilderde inventory-sprites i.p.v. emoji.
- Sfeergeluid + UI-klikjes (Web Audio).
- Extra scenes/puzzels (de `data.js`-structuur is hierop voorbereid).
- Opslaan/laden via `localStorage`.
- Eenvoudige dialoogboom voor de Ziener.

---

### Bouwopdracht voor Claude Code / Fable

> Lees `BOUWSPEC.md`. Bouw "De Amulet van de Herfst" exact volgens deze spec: vanilla JS + Canvas,
> mobile-first PWA, de twee meegeleverde scene-achtergronden, de twee scenes en de complete
> puzzelketen uit §6, en het interactiemodel uit §7. Maak het lokaal draaibaar (§9) en klaar voor
> Vercel (§10). Loop daarna de acceptatiechecklist (§11) na en bevestig dat de route uit §6.5 tot
> winst leidt.
