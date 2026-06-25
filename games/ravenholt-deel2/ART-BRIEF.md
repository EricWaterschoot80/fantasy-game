# Ravenholt — Art-briefing voor sprite-generatie (Higgsfield)

Doel: **consistente** sprites in één keer goed, zonder tokens te verspillen. Lees dit
vóór elke nieuwe generatie. Kernregel: **genereer varianten altijd vanaf één vaste
referentie-afbeelding** (anders verschillen outfit/proporties en moet je opnieuw).

## Algemene stijl (geldt voor ALLES)
- 16-bit SNES JRPG pixel-art, schuine 3/4 of zijaanzicht, hele figuur, gecentreerd.
- Chunky leesbare pixels, **scherpe donkere outline**.
- Zacht warm ochtendlicht (de hele game speelt in gouden ochtendzon).
- Achtergrond: **één egale, volvlakke magenta `#FF00FF`** — geen schaduw, geen grond,
  geen tekst, geen UI, geen kader. (De engine keyt magenta weg met `/tmp/detail2x.py`.)
- Sprites worden op 2× opgeslagen en op halve maat getekend (`spriteDetail:2`).

## Finn (de hoofdpersoon) — VASTE beschrijving
**11 jaar oud** (iets ouder/stoerder ogend dan een klein kind), met **sproetjes** over neus
en wangen, **rood SPITS/PIEKERIG, warrig haar** — puntige plukken die omhoog en naar buiten
staan, met een paar scherpe pieken over het voorhoofd (klassiek 16-bit JRPG/shounen-heldenkapsel;
vol en gelaagd, niet te lang, géén zachte ronde krullen) — en **BRUINE ogen** (nooit blauw). ~4 hoofden hoog (chibi-held). **Kap ALTIJD OMLAAG** op de
schouders, rode haren zichtbaar bovenop (nooit een capuchon over zijn hoofd). Blauwe
kapmantel/cape, **crème/wit ondertuniek**, bruin leren **schoudertas**, bruine broek/laarzen,
draagt een **houten staf met een COMPACTE, dicht gekrulde top** (strakke spiraal — niet een
losse/open krul; **géén steen, géén versiering**) in één hand. De staf kán **gloeien** op
magische momenten (warm goud-blauw licht uit de krul en de schacht).
Uitdrukking: een dromer die al lang wil leren toveren — meestal **enthousiast/nieuwsgierig**,
op magische momenten **verbaasd én dolblij**.

### Belichting, sfeer & molen-interieur (VASTE wereldregel)
Het hele spel speelt **overdag, in de vroege ochtend**: warm **gouden ochtendlicht** valt naar
binnen. Zachte, lange schaduwen. De **molen-binnenruimte is GESLOTEN**: massieve steen- en
houtwanden, **géén open doorgangen of gaten naar buiten**, en **géén molen in de verte
zichtbaar** — licht komt **alléén door de kleine boogramen**. Houd `molen-binnen-Jun-17,-2026,-11_08_06-AM.png`
aan als referentie voor die ruimte (maalsteen, groot houten rad, boekenkast, vaten, graanzakken).
- **Referentie-media (Higgsfield):** `4bda7dca-302d-44cd-b02a-646f94ca5421` (hood-down loopframe).
  Gebruik die als `medias:[{role:image,value:...}]` voor ELKE Finn-generatie.
- Idle = staand, voeten bij elkaar. Lopen = zijaanzicht naar rechts (engine spiegelt links).

### Loopcyclus — wat WEL en NIET
- WEL: duidelijke **contact-passen** (één voet ver vóór, andere ver achter, benen breed
  uit elkaar) afgewisseld met een **rustige passing** (voeten dicht bij elkaar onder het
  lichaam, achterste voet net van de grond). Dit leest als lopen.
- NIET: **knie hoog optillen** (wordt marcheren) en geen frames die bijna identiek zijn
  aan de contact-pas ("reach"). Variatie zit in de afwisseling contact ↔ passing.
- Elk frame op **gelijke hoogte**; engine lijnt uit op de **rode kop** zodat de romp stil
  staat en alleen de benen bewegen.

## De koopman — VASTE beschrijving
Slungelige, sneaky marskramer; smal sluw gezicht, dun snorretje, spottende grijns.
**Kap OP** over het hoofd. Outfit met kleur maar aards (past in de ochtendsfeer):
**teal-groene** capuchonmantel, **pruimpaarse** tuniek, **karmijnrode** sjerp,
goudgerande riem met buideltjes. Rijke maar niet-neon kleuren.
- **Genereer alle koopman-varianten vanaf dezelfde referentie** (bv. de "kijkt-links"-sprite)
  zodat outfit/proporties identiek blijven. Varianten: kijkt-links (naar zijn kar),
  kijkt-vooruit, kijkt-rechts (naar de wacht), en verbaasd/awe (starend naar de bloem).

## Werkwijze (zo verspillen we geen tokens)
1. Bepaal precies welke frames ontbreken/fout zijn; genereer alleen die.
2. Eén vaste referentie-media per personage (zie boven).
3. Houd de prompt identiek op de pose-zin na.
4. Cut + assembleer lokaal (`/tmp/detail2x.py`), check een montage vóór commit.

---

# Cinematische storyboard (Ghibli) — character & scene consistency

Geldt voor de **filmische storyboard-beelden** in `storyboard/battle/` (het heksengevecht),
NIET voor de in-game pixel-sprites hierboven. Model: **`nano_banana_pro`**, 16:9, 2k.
Genereer ELKE shot met deze twee vaste referentie-media zodat held én locatie consistent blijven:

- **Finn (held):** `b3896cfe-5a40-4ab2-bdf6-0b70121c537b` (Ghibli-referentie)
- **Achtergrond (vallei-magie):** `a7cccb63-f48f-42a6-b118-ab0a9500ae93`

(Beide zijn deze sessie geüpload via `media_upload`; her-upload `storyboard/ghibli/g4.png`
en `assets/art/scene-valley-magic.jpg` als de id's verlopen zijn.)

## Stijl (VAST voor alle storyboard-shots)
- **Cinematic film still**, Studio-Ghibli-aquarel met filmische kleurgrading, anamorf breedbeeld,
  scherptediepte, sfeervol/atmosferisch.
- **Vroege OCHTEND, dageraad** — de zon komt net op; gedempt goudlicht breekt door zware mist.
  **Donker maar warm/ochtend** (géén nacht, géén storm).

## Locatie (VAST — altijd consistent)
- De oude **stenen runencirkel** met **blauwgloeiende runen** op de monolieten.
- De **ketel staat ALTIJD midden in de cirkel** en geeft **BLAUWE rook + blauwe magie-effecten
  (NOOIT groen)**.
- Áchter de cirkel: een **meer** en een **hoge waterval**, **veel drijvende mist**, bergen.
- De **stenen tafel** ligt **linksonder** in de cirkel (slotscène: schrijven in het boek).

## Finn (VAST)
Piekerig roodbruin haar, **blauwe mantel/cape**, **bruine tuniek**, gekrulde houten staf (mag
blauw gloeien). Sproeten, grote ogen. In de slotscène schrijft hij in zijn open toverboek
**met een ZWARTE veer (ganzenveer/quill)**.

## De heks (VAST)
Een **oude, lelijke heks zónder hoed**: wilde grijze haren, een **lange kromme/wrattige grote neus**,
een **klein groen kikkertje dat uit haar haar piept**, gebocheld en benig in een **rafelig donker gewaad**.
Ze heeft een **grote houten pollepel als staf waar ze vermoeid op leunt** (steunstaf, geen wapen).
Bij haar nederlaag lost ze op in **blauwgrijze rook** en vliegt het kikkertje uit haar haar weg;
de blauwe **drakenring** valt op de stenen.

## Camerahoeken (gevarieerd, personages consistent)
1. Wijd/uitgezoomd totaalshot (establishing). 2. First-person / over-the-shoulder close-up.
3. Laag dramatisch standpunt (de nederlaag). 4. Intieme close bij de stenen tafel.
