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
Roodharige jongen, ~4 hoofden hoog (chibi-held). **Kap ALTIJD OMLAAG** op de schouders,
volle warrige **rode haren** zichtbaar bovenop (nooit een capuchon over zijn hoofd).
Blauwe kapmantel/cape, **crème/wit ondertuniek**, bruin leren **schoudertas**, bruine
broek/laarzen, draagt een **houten staf** met gekrulde top in één hand.
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
