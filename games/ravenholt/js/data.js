/* ============================================================
   data.js — ALLE spelinhoud van "Whispers of Ravenholt".
   Tweetalig: elke tekst is {nl, en}; de engine kiest via L().
   Coördinaten zijn scene-pixels (568×320, liggend).

   Hoofdstuk 1 — speelbaar beginpunt: het dorpsplein van Eldoria.
   Finn loopt over de keien, onderzoekt de drooggevallen fontein en de
   watermolen, en raapt voorwerpen op. Bouw verder uit volgens STORYBOARD.md.

   Bij ELKE wijziging: bump ?v= in index.html, assetVer hieronder én CACHE in sw.js.
   ============================================================ */

const GAME = {
  title:      { nl: 'Fluisteringen van Ravenholt', en: 'Whispers of Ravenholt' },
  titleLines: { nl: ['Fluisteringen', 'van Ravenholt'], en: ['Whispers of', 'Ravenholt'] },
  startScene: 'square',
  assetVer: '75',

  /* Finn — vaste figuur: roodharige jongen, blauwe kapmantel, leren tas, houten staf.
     idle = hero, lopen = 4-frame loopsheet (heroWalkSheet), zwaaien = heroWave.
     heroWalk/heroWalk2 blijven als terugval voor de 2-frame cyclus. */
  sprites: {
    hero:          'assets/art/hero.png',
    heroIdle2:     'assets/art/hero-idle2.png',     // 2e stilstaan-frame (zacht gewicht verplaatsen)
    heroBlink:     'assets/art/hero-blink.png',     // knipper-frame 1 (ogen dicht), /lopen 19
    heroBlink2:    'assets/art/hero-blink2.png',    // knipper-frame 2 (ogen weer open), /lopen 20
    heroWalk:      'assets/art/hero-walk.png',
    heroWalk2:     'assets/art/hero-walk2.png',
    heroWave:      'assets/art/hero-wave.png',
    heroWave2:     'assets/art/hero-wave2.png',     // 2e zwaai-frame (hand op/neer)
    heroWalkSheet: 'assets/art/hero-walk-sheet.png',
    mayor:         'assets/art/mayor.png',
    mayorGesture:  'assets/art/mayor-gesture.png',  // bezorgd gebaar (af en toe)
    mayorHappy:    'assets/art/mayor-happy.png',    // opgelucht zodra het water terug is (molen gemaakt) — met de geheime kaart
    mayorMap:      'assets/art/mayor-map.png',       // nadat hij de kaart heeft weggegeven (lege hand)
    ravenPerch:    'assets/art/raven-perch.png',   // raaf op de ton (gevouwen vleugels)
    ravenFly:      'assets/art/raven-fly.png',      // raaf in vlucht (oud, fallback)
    ravenFlyUp:    'assets/art/raven-fly-up.png',   // wiekslag: vleugels hoog
    ravenFlyMid:   'assets/art/raven-fly-mid.png',  // wiekslag: vleugels gespreid
    ravenFlyDown:  'assets/art/raven-fly-down.png', // wiekslag: vleugels omlaag
    mouse:         'assets/art/mouse.png',          // bruine muis in de molen (praten)
    cogBrass:      'assets/art/cog-brass.png',      // radwerk-puzzel: messing tandwiel
    cogIron:       'assets/art/cog-iron.png',       // radwerk-puzzel: ijzeren tandwiel
    guard:         'assets/art/guard.png',          // poortwacht bij het kasteel
    guardGesture:  'assets/art/guard-gesture.png',  // wacht verzet zijn hellebaard (af en toe)
    merchant:      'assets/art/merchant-left.png',   // handelsman (kap op) — kijkt naar de kar (links)
    merchantLeft:  'assets/art/merchant-left.png',   // kijkt naar links (zijn kar)
    merchantFwd:   'assets/art/merchant-fwd.png',    // kijkt vooruit
    merchantRight: 'assets/art/merchant-right.png',  // kijkt naar rechts (de wacht)
    merchantSly:   'assets/art/merchant-sly.png',    // sluwe blik omhoog (4e spied-stand)
    merchantSurprised: 'assets/art/merchant-surprised.png', // verbaasd (1)
    merchantAwe:   'assets/art/merchant-awe.png',    // verbaasd/betoverd starend naar de dansende bloem (2)
    heroWalkDiag:  'assets/art/hero-walk-diag.png',  // schuin lopen (3/4 naar de speler toe)
    flower:        'assets/art/flower.png',          // bloem (oranje accent)
    flowerWhite:   'assets/art/flower-white.png',    // witte bloem (dansende bloem + cluster)
    witch:         'assets/art/npc-witch.png',       // de heks bij de ketel (rust-frame)
    witchBeckon:   'assets/art/npc-witch-beckon.png' // heks wenkt de jongen ('kom hier'-gebaar)
  },
  heroWalkFrames: 16,           // loopanimatie uit /lopen 01-16 (alleen de écht-lopende frames)
  spriteDetail: 2,              // sprites zijn op 2x resolutie opgeslagen; engine tekent ze op halve maat = fijnere details

  /* Finn begint met de staf van zijn vader in zijn tas. */
  startItems: ['staff'],

  winText: {
    nl: 'Wordt vervolgd...',
    en: 'To be continued...'
  },

  strings: {
    noEffect:     { nl: 'Dat werkt hier niet.', en: 'That doesn’t work here.' },
    noCombine:    { nl: 'Die twee laten zich niet combineren.', en: 'Those two don’t combine.' },
    nothingThere: { nl: 'Daar valt niets te ontdekken.', en: 'There’s nothing to find there.' }
  },

  ui: {
    subtitle:   { nl: 'Een point-and-click mysterie', en: 'A point-and-click mystery' },
    intro:      { nl: 'In het koninkrijk Eldoria loopt de fontein op het dorpsplein al weken leeg. De jonge Finn — die droomt van magie en wiens vader gevangen zit in het kasteel — gaat op onderzoek uit.',
                  en: 'In the kingdom of Eldoria the village-square fountain has been running dry for weeks. Young Finn — who dreams of magic and whose father is imprisoned in the castle — sets out to investigate.' },
    credit:     { nl: 'Een RetroAdventureWorld-avontuur', en: 'A RetroAdventureWorld adventure' },
    startBtn:   { nl: 'Begin het mysterie', en: 'Begin the mystery' },
    winTitle:   { nl: 'Wordt vervolgd', en: 'To be continued' },
    replayBtn:  { nl: 'Opnieuw spelen', en: 'Play again' },
    playOther:  { nl: '▸ Speel een ander avontuur', en: '▸ Play another adventure' },
    deathTitle: { nl: 'Verloren in de mist...', en: 'Lost in the fog...' },
    deathText:  { nl: 'Dat liep niet goed af. Probeer het opnieuw.', en: 'That went badly. Try again.' },
    retryBtn:   { nl: 'Probeer opnieuw', en: 'Try again' },
    rotateTitle:{ nl: 'Draai je telefoon', en: 'Rotate your phone' },
    rotateText: { nl: 'Dit avontuur speelt liggend. Draai je scherm een kwartslag.',
                  en: 'This adventure plays in landscape. Turn your screen sideways.' },
    tapContinue:{ nl: 'tik om verder te gaan ▸', en: 'tap to continue ▸' },
    selected:   { nl: 'geselecteerd', en: 'selected' },
    homeConfirm:{ nl: 'Terug naar de homepagina? Je voortgang gaat verloren.', en: 'Back to the homepage? Your progress will be lost.' },

    q_explore:  { nl: 'Verken het dorpsplein van Eldoria', en: 'Explore the village square of Eldoria' },
    q_fountain: { nl: 'Onderzoek waarom de fontein leegloopt', en: 'Investigate why the fountain is running dry' },
    q_mill:     { nl: 'Bekijk de oude molen aan de rand van het plein', en: 'Inspect the old mill at the edge of the square' },
    q_inside:   { nl: 'Zoek binnen in de molen wat het water tegenhoudt', en: 'Search inside the mill for what blocks the water' },
    q_book:     { nl: 'Bevrijd het toverboek in de molen (trek de boeken in de juiste volgorde)', en: 'Free the spellbook in the mill (pull the books in the right order)' },
    q_writespell:{ nl: 'Het toverboek is leeg — pak de ravenveer, maak inkt (zwarte bessen + flesje) en schrijf de spreuk in het boek', en: 'The spellbook is blank — take the raven feather, make ink (black berries + vial) and write the spell into the book' },
    q_flower:   { nl: 'Bij het kasteel: laat met de spreuk de grote bloem dansen', en: 'At the castle: use the spell to make the big flower dance' },
    q_tomayor:  { nl: 'De molen draait weer en de fontein stroomt! Ga terug naar het plein, naar burgemeester Bram', en: 'The mill turns again and the fountain flows! Head back to the square, to Mayor Bram' },
    q_valley:   { nl: 'Verzamel de 3 ingrediënten voor de ketel (zie het recept): het licht van een vuurvliegje (vang er een in de vallei), een traan van een onschuldige (lees het gedicht voor aan het meisje) en een drakenschub (versla de oude schaker) — gooi ze dan in de ketel', en: 'Gather the 3 ingredients for the cauldron (see the recipe): the light of a firefly (catch one in the valley), a tear of an innocent (read the poem to the girl) and a dragon scale (beat the old chess player) — then throw them in the cauldron' },
    q_takewheel:{ nl: 'De handelsman kijkt naar de bloem — pak nu het molenrad uit zijn kar', en: 'The merchant is watching the flower — grab the mill wheel from his cart now' },
    q_fixmill:  { nl: 'Breng het molenrad naar het tandrad in de molen en maak het radwerk', en: 'Take the mill wheel to the gear inside the mill and fix the gearworks' }
  },

  items: {
    staff: { name: { nl: 'Vaders Staf', en: 'Father’s Staff' }, icon: '🪄', img: 'assets/art/item-staff.png',
             look: { nl: 'De houten staf van mijn vader. Bovenin zit een lege vatting — er hoort een magische steen in. Zonder die steen doet de staf nog niets.', en: 'My father’s wooden staff. The top has an empty setting — a magic stone belongs there. Without the stone the staff does nothing yet.' } },
    coin: { name: { nl: 'Oud Muntje', en: 'Old Coin' }, icon: '🪙', img: 'assets/art/item-coin.png',
            look: { nl: 'Een oud, mat muntje — maar in het zonlicht glinstert het nog mooi. Precies het soort glimmend ding waar een ekster of een raaf niet van af kan blijven.', en: 'An old, dull coin — but it still glints prettily in the sunlight. Just the kind of shiny thing a magpie or raven can’t resist.' } },
    note: { name: { nl: 'Verfrommeld Briefje', en: 'Crumpled Note' }, icon: '📜', img: 'assets/art/item-note.png',
            look: { nl: '“...het rad is niet zomaar verdwenen. Volg de lichten in de vallei.”', en: '“...the wheel did not simply vanish. Follow the lights in the valley.”' } },
    vialInk:  { name: { nl: 'Leeg Flesje (voor inkt)', en: 'Empty Vial (for ink)' }, icon: '🧪', img: 'assets/art/item-vial.png',
             look: { nl: 'Een leeg glazen flesje met kurk, uit de kast in de molen. Hier maak je inkt in van de zwarte bessen.', en: 'An empty corked glass vial from the cupboard in the mill. Use it to make ink from the black berries.' } },
    vialTear: { name: { nl: 'Leeg Flesje (voor de traan)', en: 'Empty Vial (for the tear)' }, icon: '🧪', img: 'assets/art/item-vial.png',
             look: { nl: 'Een leeg glazen flesje met kurk, uit de kast in de molen. Hierin kun je straks de traan van het meisje bij de kraam opvangen.', en: 'An empty corked glass vial from the cupboard in the mill. Use it to catch the tear of the girl at the stall later.' } },
    vialWine: { name: { nl: 'Leeg Flesje (voor wijn)', en: 'Empty Vial (for wine)' }, icon: '🧪', img: 'assets/art/item-vial.png',
             look: { nl: 'Een leeg glazen flesje met kurk, uit de kast in de molen. Hier kun je wijn uit de oude wijnton in tappen.', en: 'An empty corked glass vial from the cupboard in the mill. Use it to draw wine from the old wine barrel.' } },
    wine:  { name: { nl: 'Flesje Wijn', en: 'Vial of Wine' }, icon: '🍷', img: 'assets/art/item-vial-wine.png',
             look: { nl: 'Een flesje diep bordeauxrode wijn, getapt uit de oude wijnton in de molen. Misschien lust burgemeester Bram er wel een slokje van...', en: 'A vial of deep Bordeaux-red wine, drawn from the old wine barrel in the mill. Mayor Bram might fancy a sip of this...' } },
    book:  { name: { nl: 'Molenaarsboek', en: 'Miller’s Book' }, icon: '📖', img: 'assets/art/item-book.png',
             look: { nl: 'Het molenaarsboek. Tekeningen van het rad — en een kruisje bij een grot in de vallei, met gekrabbeld: “de blauwe steen drijft het rad weer aan.”', en: 'The miller’s book. Drawings of the wheel — and a cross at a cave in the valley, scrawled: “the blue stone drives the wheel again.”' } },
    grain: { name: { nl: 'Handvol Graan', en: 'Handful of Grain' }, icon: '🌾', img: 'assets/art/item-grain.png',
             look: { nl: 'Een handvol goudgeel graan uit de zak. Misschien lust een hongerig dier het wel.', en: 'A handful of golden grain from the sack. A hungry animal might like it.' } },
    spellbook: { name: { nl: 'Toverboek', en: 'Spellbook' }, icon: '📕', img: 'assets/art/item-spellbook.png', zoomImg: 'assets/art/spell-flower.png', zoomImgFlag: 'spellWritten',
             look: (state) => state.flags.spellWritten
               ? { nl: 'Het toverboek. Op de eerste bladzijde staat nu, in glanzende inkt, de spreuk die je schreef: “Laat wat stil staat vrolijk dansen.” Richt het op iets levends en het begint te bewegen.', en: 'The spellbook. On the first page, in glistening ink, stands the spell you wrote: “Make what stands still dance.” Aim it at something living and it starts to move.' }
               : { nl: 'Het oude toverboek — maar de bladzijden zijn helemaal leeg. Met de juiste pen en inkt zou je er een spreuk in kunnen schrijven... (combineer een inktveer met dit boek)', en: 'The old spellbook — but its pages are completely blank. With the right pen and ink you could write a spell in it... (combine an ink-dipped feather with this book)' } },
    feather: { name: { nl: 'Magische Ravenveer', en: 'Magic Raven Feather' }, icon: '🪶', img: 'assets/art/item-feather.png',
             look: { nl: 'Een glanzende, blauwzwarte veer die de raaf achterliet. Hij gloeit zachtjes van magie. Met inkt zou je er prachtig mee kunnen schrijven.', en: 'A glossy blue-black feather the raven left behind. It glows faintly with magic. With ink you could write beautifully with it.' } },
    berries: { name: { nl: 'Zwarte Bessen', en: 'Black Berries' }, icon: '🫐',
             look: { nl: 'Een handvol diepzwarte bessen, geplukt bij de molen. Geplet geven ze vast een donker, inktachtig sap.', en: 'A handful of deep-black berries, picked by the mill. Crushed, they’d surely give a dark, ink-like juice.' } },
    ink: { name: { nl: 'Flesje Inkt', en: 'Vial of Ink' }, icon: '🖋️', img: 'assets/art/item-ink.png',
             look: { nl: 'Het glazen flesje, nu gevuld met diepzwarte bessen-inkt. Perfect om een veer in te dopen.', en: 'The glass vial, now filled with deep-black berry ink. Perfect for dipping a feather.' } },
    inkFeather: { name: { nl: 'Inktveer', en: 'Ink-dipped Feather' }, icon: '🪄', img: 'assets/art/item-inkfeather.png',
             look: { nl: 'De magische ravenveer, gedoopt in de bessen-inkt — nog steeds een veer, maar met een glanzende zwarte inktpunt. Klaar om een spreuk in het lege toverboek te schrijven.', en: 'The magic raven feather, dipped in berry ink — still a feather, but with a glossy black ink tip. Ready to write a spell in the empty spellbook.' } },
    spell: { name: { nl: 'Dans-spreuk', en: 'Dance Spell' }, icon: '✦', border: 'blue',
             look: { nl: 'De spreuk die je zelf in het toverboek schreef, gloeit zacht blauw na. Hiermee kun je dingen laten dansen — gebruik de spreukknop naast je tas.', en: 'The spell you wrote yourself in the spellbook glows softly blue. With it you can make things dance — use the spell button next to your bag.' } },
    poem: { name: { nl: 'Het Gedicht', en: 'The Poem' }, icon: '📜', img: 'assets/art/item-note.png',
             look: { nl: 'Het gloeiende briefje uit de brievenbus bij de molen, zonder afzender:\n\n“Klein licht in de mist, zo ver van huis,\nde maan huilt zilver op het ruisende water.\nWie een traan om een ander durft te laten,\nopent de poort die niemand anders vond.”\n\nDit zou je eens moeten voorlezen aan iemand met verdriet...', en: 'The glowing note from the mailbox by the mill, with no sender:\n\n“Small light in the mist, so far from home,\nthe moon weeps silver on the whispering water.\nWhoever dares to shed a tear for another,\nopens the gate that no one else could find.”\n\nYou should read this aloud to someone who carries sorrow...' } },
    map: { name: { nl: 'Geheime Kaart', en: 'Secret Map' }, icon: '🗺️', img: 'assets/art/item-note.png', zoomImg: 'assets/art/map-valley.png',
             look: { nl: 'De geheime kaart van burgemeester Bram. Een pad slingert het dorp uit, langs het bos, naar de mistige vallei met de runenstenen — met een rood kruis dat de plek markeert. (wordt vervolgd)', en: 'Mayor Bram’s secret map. A path winds out of the village, past the wood, to the misty valley with the rune-stones — with a red cross marking the spot. (to be continued)' } },
    millwheel: { name: { nl: 'Het Molenrad', en: 'The Mill Wheel' }, icon: '☸️', img: 'assets/art/cog-iron.png',
             look: { nl: 'Het zware ijzeren molenrad, gevonden in de kar van de handelsman. Hiermee kan de molen weer draaien — terug ermee naar de molen!', en: 'The heavy iron mill wheel, taken from the merchant’s cart. With this the mill can turn again — back to the mill with it!' } },
    cheese: { name: { nl: 'Stuk Kaas', en: 'Piece of Cheese' }, icon: '🧀', img: 'assets/art/item-cheese.png',
             look: { nl: 'Een heerlijk geel stuk boerenkaas, geruild voor een handvol graan op het plein.', en: 'A lovely yellow wedge of farmhouse cheese, traded for a handful of grain on the square.' } },
    tear: { name: { nl: 'Traan in een Flesje', en: 'Tear in a Vial' }, icon: '💧', img: 'assets/art/item-vial.png',
             look: { nl: 'Een glazen flesje met één heldere, glinsterende traan erin. Eén van de drie ingrediënten voor de ketel in de runencirkel.', en: 'A glass vial holding a single clear, glistening tear. One of the three ingredients for the cauldron in the rune circle.' } },
    fireflight: { name: { nl: 'Flesje Vuurvliegjes', en: 'Vial of Fireflies' }, icon: '✨', img: 'assets/art/item-fireflight.png',
             look: { nl: 'Een flesje met levende vuurvliegjes erin — groene en blauwe vonkjes die rondzweven en zacht oplichten. Eén van de drie ingrediënten voor de ketel.', en: 'A vial of living fireflies — green and blue sparks drifting and softly glowing inside. One of the three ingredients for the cauldron.' } },
    recipe: { name: { nl: 'Het Recept', en: 'The Recipe' }, icon: '📜', img: 'assets/art/item-note.png', zoomImg: 'assets/art/recipe.png',
             look: { nl: 'Het vergeelde recept dat onder de losse steen bij de molen lag. Drie ingrediënten voor de ketel: een drakenschub, een traan van een onschuldige, en het licht van een vuurvliegje. (tik aan om te bekijken)', en: 'The yellowed recipe that lay under the loose stone by the mill. Three ingredients for the cauldron: a dragon scale, a tear of an innocent, and the light of a firefly. (tap to view)' } },
    dragonscale: { name: { nl: 'Drakenschub', en: 'Dragon Scale' }, icon: '🐲', img: 'assets/art/item-dragonscale.png',
             look: { nl: 'Een harde, glanzende schub, warm als sintels. Wie weet welk wezen hem verloor... Het laatste ingrediënt voor de ketel.', en: 'A hard, gleaming scale, warm as embers. Who knows what creature lost it... The last ingredient for the cauldron.' } }
  },

  /* Combinaties. result = nieuw voorwerp; of setFlag (+ keep) voor een handeling
     die de voorwerpen niet verbruikt (bv. met de inktveer in het boek schrijven). */
  recipes: [
    { a: 'berries', b: 'vialInk', result: 'ink',
      text: { nl: 'Je plet de zwarte bessen in het lege flesje. Het sap kleurt diep gitzwart — echte inkt!', en: 'You crush the black berries into the empty vial. The juice turns deep jet-black — real ink!' } },
    { a: 'feather', b: 'ink', result: 'inkFeather',
      text: { nl: 'Je doopt de magische ravenveer in de inkt. De punt glanst zwart en lijkt bijna te trillen van leven — klaar om te schrijven.', en: 'You dip the magic raven feather into the ink. Its tip glistens black and seems almost to quiver with life — ready to write.' } },
    { a: 'inkFeather', b: 'spellbook', setFlag: 'spellWritten', keep: true, consume: 'inkFeather', doneFlag: 'spellWritten',
      result: 'spell',                                 // de geschreven spreuk komt in je tas (blauwe rand)
      requiresScene: 'millInside',
      cutscene: 'assets/video/spell-cinematic.mp4',   // speelt de eerste-spreuk-video af
      needSceneText: { nl: 'Om met de veer netjes in het boek te schrijven heb je een stevige tafel nodig — die staat bínnen in de molen.', en: 'To write neatly in the book with the feather you need a sturdy table — there’s one inside the mill.' },
      text: { nl: 'Je legt het toverboek open op de molenaarstafel en schrijft met de inktveer. Als bij toverslag glijdt de pen vanzelf over het papier en schrijft een spreuk: “Laat wat stil staat vrolijk dansen.” Het toverboek gloeit warm op — de veer heeft zijn werk gedaan.', en: 'You lay the spellbook open on the miller’s table and write with the ink-feather. As if by magic the pen glides on its own and writes a spell: “Make what stands still dance.” The spellbook glows warm — the feather has done its work.' },
      doneText: { nl: 'De spreuk staat al in het toverboek.', en: 'The spell is already written in the spellbook.' } }
  ],

  questRules: [
    { when: { flag: 'valleyMagic' },        quest: null },         // ketel ontstoken -> wordt vervolgd
    { when: { flag: 'gotMap' },             quest: 'q_valley' },   // kaart ontvangen -> volg het pad naar de vallei
    { when: { flag: 'millFixed' },          quest: 'q_tomayor' },  // molen draait -> terug naar de burgemeester
    { when: { has: 'millwheel' },           quest: 'q_fixmill' },  // rad in handen -> maak het radwerk in de molen
    { when: { flag: 'merchantDistracted' }, quest: 'q_takewheel' },// bloem danst, handelsman afgeleid -> pak het rad
    { when: { flag: 'spellWritten' },       quest: 'q_flower' },   // spreuk geschreven -> laat de bloem dansen bij de poort
    { when: { has: 'spellbook' },           quest: 'q_writespell' },// leeg toverboek -> maak inkt + veer en schrijf de spreuk
    { when: { flag: 'lookedMill' },         quest: 'q_book' },     // rad zit vast -> zoek het toverboek in de molen
    { when: { flag: 'seenFountain' },       quest: 'q_mill' },
    { when: {},                             quest: 'q_explore' }
  ],

  scenes: {
    square: {
      name: { nl: 'Het Dorpsplein', en: 'The Village Square' },
      bg: 'assets/art/scene-square.jpg',
      bgVariants: [
        { img: 'assets/art/scene-square-chess.jpg', flag: 'mayorGone' },         // burgemeester vertrokken: oude man schaakt + fontein klatert
        { img: 'assets/art/scene-square-mill.jpg', flag: 'millFixed' },          // molen gemaakt: fontein klatert weer
        { img: 'assets/art/scene-square.jpg' }                                    // begin: droge fontein
      ],
      charFilter: 'sepia(0.3) saturate(1.2) brightness(1.05)',   // warm-gouden opkomende zon, geeliger
      heroShade: 0.87,                                            // Finn iets donkerder op het plein (meer in de schaduw)
      entryText: {
        nl: 'Het dorpsplein van Eldoria baadt in het ochtendlicht. De fontein klatert nog wat na, maar het water zakt zienderogen. Aan de rand staat de oude molen stil.',
        en: 'The village square of Eldoria bathes in morning light. The fountain still trickles, but the water is dropping fast. At the edge the old mill stands still.'
      },
      playerStart: { x: 300, y: 300 },
      spawnFrom: { mill: { x: 150, y: 300 } },   // terug uit de molen: bij het pad links
      depth: { far: 238, near: 318, sFar: 0.6, sNear: 1.08 },   // perspectief: duidelijk kleiner naar achteren

      /* Beloopbare keien op het plein; de fontein (midden-links) en de gebouwen zijn geblokkeerd. */
      walkable: [
        { x: 40,  y: 282, w: 488, h: 36 },   // voorgrond-strook over het hele plein
        { x: 40,  y: 238, w: 110, h: 80 },   // keien links van de fontein
        { x: 268, y: 238, w: 230, h: 80 }    // keien rechts van de fontein (richting de kraampjes)
      ],
      obstacles: [
        { x: 138, y: 200, w: 142, h: 92 },   // de fontein-bak (ruimer: niet er doorheen of er bovenop lopen)
        { x: 452, y: 250, w: 96, h: 68 }     // het kaaskraampje rechts (niet doorheen lopen)
      ],
      overlays: [],
      worldItems: [
        { item: 'feather', hotspot: 'feather', x: 102, y: 270, scale: 0.6, requiresFlag: 'ravenFed' }   // magische veer die de raaf achterliet (kleiner op de grond)
      ],
      npcs: [
        /* Burgemeester Bram in drie standen: bezorgd (begin) → opgelucht met de kaart
           (molen gemaakt) → met lege hand nadat hij de kaart gaf. Weg na de vallei. */
        { id: 'mayorA', sprite: 'mayor', gestureSprite: 'mayorGesture', x: 372, y: 264, scale: 1.18, hideFlag: 'millFixed' },
        { id: 'mayorB', sprite: 'mayorHappy', x: 372, y: 264, scale: 1.18, appearFlag: 'millFixed', hideFlag: 'gotMap' },
        { id: 'mayorC', sprite: 'mayorMap', x: 372, y: 264, scale: 1.18, appearFlag: 'gotMap', hideFlag: 'mayorGone' },
        { id: 'raven', sprite: 'ravenPerch', x: 36, y: 257, scale: 1.15, hideFlag: 'ravenFed' }   // glanzende raaf op de ton (links), 3px hoger
      ],
      fx: {
        /* klaterende fontein op het plein — pas zodra de molen weer draait (anders droog).
           Twee straaltjes (links + rechts); rimpels/knippering iets lager en linkser. */
        fountain: { requiresFlag: 'millFixed', jets: [{ sx: 234, sy: 198 }, { sx: 254, sy: 198 }], len: 13, wx: 232, wy: 244 },
        /* het meisje bij de kraam huilt zodra je haar het gedicht voorleest (tot de traan opgevangen is) */
        cry: { x: 497, y: 223, flag: 'girlCrying', stopFlag: 'gotTear' },
        /* opstijgende (donkere) rook uit twee schoorstenen van de dorpshuizen */
        smoke: [
          { x: 374, y: 50, rise: 46, spread: 9, drift: 6, speed: 3200, puffs: 8 },
          { x: 480, y: 46, rise: 38, spread: 8, drift: 5, speed: 3600, puffs: 7 }
        ]
      },

      hotspots: [
        {
          id: 'mayor',
          name: { nl: 'Burgemeester Bram', en: 'Mayor Bram' },
          rect: { x: 346, y: 186, w: 54, h: 80 },
          walkTo: { x: 366, y: 300 },
          face: 'assets/art/face-mayor.png',
          hideFlag: 'mayorGone',                       // blijft tot je hem de wijn hebt gegeven én het plein opnieuw betreedt
          givesWhen: {
            flag: 'millFixed', needFlag: 'gotMayorCoin', setFlag: 'gotMap', item: 'map',
            needText: { nl: 'Burgemeester Bram veegt zijn voorhoofd af. “Je hebt het water teruggebracht, Finn — knap werk! Maar pff, wat een dorst... had ik nu maar iets te drinken.” (geef hem eerst de wijn uit de molen)', en: 'Mayor Bram mops his brow. “You’ve brought the water back, Finn — fine work! But phew, what a thirst... if only I had something to drink.” (give him the wine from the mill first)' },
            giveText: { nl: 'Burgemeester Bram zet het flesje wijn aan zijn lippen, zucht voldaan en grijpt je dan bij de schouders: “Je hebt het water teruggebracht én een oude man verkwikt! Maar dit is nog niet voorbij... die vreemde lichten in de vallei. Hier — een geheime kaart die je vader me ooit toevertrouwde. Volg het pad voorbij het bos.” Hij drukt je een vergeelde kaart in handen.', en: 'Mayor Bram lifts the vial of wine to his lips, sighs contentedly, then grips your shoulders: “You’ve brought the water back AND revived an old man! But this isn’t over... those strange lights in the valley. Here — a secret map your father once entrusted to me. Follow the path beyond the wood.” He presses a yellowed map into your hands.' }
          },
          look: (state) => state.flags.gotMap
            ? { nl: 'Burgemeester Bram knikt je bemoedigend toe. “Volg de kaart naar de vallei, Finn — en pas op voor die vreemde lichten.”', en: 'Mayor Bram gives you an encouraging nod. “Follow the map to the valley, Finn — and beware those strange lights.”' }
            : state.flags.gotMayorCoin
            ? { nl: 'Burgemeester Bram glimt na van de wijn. “Bedankt, jongen! En ik heb nog iets belangrijks voor je — tik me eens aan.”', en: 'Mayor Bram is still glowing from the wine. “Thank you, my boy! And I have something important for you — give me a tap.”' }
            : state.flags.millFixed
            ? { nl: 'Burgemeester Bram veegt zijn voorhoofd af, dorstig van al die drukte. “Je hebt het water teruggebracht, Finn — knap werk! Maar wat zou ik nu graag iets te drinken lusten... een lekker glas wijn.” (geef hem de wijn uit de molen)', en: 'Mayor Bram mops his brow, thirsty from all the fuss. “You’ve brought the water back, Finn — fine work! But what I’d give for a drink right now... a nice glass of wine.” (give him the wine from the mill)' }
            : state.flags.metMayor
            ? { nl: 'Burgemeester Bram friemelt zenuwachtig aan zijn ambtsketting. “De molen, Finn — onderzoek toch eens de molen.”', en: 'Mayor Bram fidgets nervously with his chain of office. “The mill, Finn — do go and inspect the mill.”' }
            : { nl: 'Burgemeester Bram strijkt over zijn grijze snor. “Finn, jongen — de fontein loopt leeg en het dorp wordt onrustig. De molen pompt geen water meer. Men fluistert over vreemde lichten in de vallei voorbij het bos... Onderzoek de molen eens.”', en: 'Mayor Bram strokes his grey moustache. “Finn, my boy — the fountain is running dry and the village grows uneasy. The mill pumps no water. They whisper of strange lights in the valley beyond the wood... Go and inspect the mill.”' },
          use: {
            wine: {
              consume: 'wine',
              give: 'coin',
              setFlag: 'gotMayorCoin',
              text: { nl: 'Je biedt burgemeester Bram het flesje wijn aan. Zijn ogen lichten op — hij neemt een diepe slok en zucht tevreden. “Wat een traktatie, Finn! Hier, voor jou — een oud, glimmend muntje. Bewaar het goed; je weet maar nooit wie er dol op glimmende dingen is...” (de raaf in de vallei misschien?)', en: 'You offer Mayor Bram the vial of wine. His eyes light up — he takes a deep sip and sighs contentedly. “What a treat, Finn! Here, for you — an old, shiny coin. Keep it safe; you never know who has a weakness for shiny things...” (the raven in the valley, perhaps?)' }
            }
          },
          setFlag: 'metMayor'
        },
        {
          id: 'raven',
          name: { nl: 'Glanzende Raaf', en: 'Glossy Raven' },
          rect: { x: 12, y: 226, w: 46, h: 44 },
          walkTo: { x: 80, y: 298 },
          face: 'assets/art/face-raven.png',
          hideFlag: 'ravenFed',                        // weg zodra hij is opgevlogen
          look: { nl: 'Een grote, glanzende raaf zit op de oude ton en houdt zijn kop scheef. Zijn kraaloogjes volgen elk glimmend ding dat je bij je hebt. Hij lijkt iets te willen ruilen...', en: 'A big glossy raven sits on the old barrel, cocking its head. Its beady eyes track every shiny thing you carry. It seems to want a trade...' },
          use: {
            coin: {
              consume: 'coin',
              setFlag: 'ravenFed',
              text: { nl: 'De raaf grist het muntje weg en kwettert schor: “Die handelsman bij de kasteelpoort? Geen eerlijke koopman — een díef. Hij heeft iets gestolen wat van het dorp is en verstopt het tussen de vaten op zijn kar. Maar hij houdt zijn waar scherp in de gaten; je moet hem éérst weg zien te lokken. In de molen ligt een oud toverboek dat daarbij kan helpen...” Dan klapwiekt hij weg.', en: 'The raven snatches the coin and rasps: “That merchant by the castle gate? No honest trader — a THIEF. He stole something that belongs to the village and hides it among the barrels on his cart. But he keeps a sharp eye on his wares; you must lure him away first. An old spellbook in the mill might help with that...” Then it flaps off.' }
            }
          }
        },
        {
          id: 'feather',
          name: { nl: 'Glanzende Veer', en: 'Glossy Feather' },
          rect: { x: 80, y: 248, w: 48, h: 46 },
          walkTo: { x: 102, y: 300 },
          appearFlag: 'ravenFed',                        // verschijnt zodra de raaf is weggevlogen
          hideFlag: 'taken_square_feather',
          gives: {
            item: 'feather',
            giveText: { nl: 'Op de keien tussen de ton en de fontein ligt een glanzende blauwzwarte ravenveer zachtjes na te trillen van magie. Je raapt hem voorzichtig op.', en: 'On the cobbles between the barrel and the fountain lies a glossy blue-black raven feather, still quivering faintly with magic. You carefully pick it up.' },
            emptyText: { nl: 'Er ligt verder niets op de ton.', en: 'There’s nothing else on the barrel.' }
          }
        },
        {
          id: 'fountain',
          name: { nl: 'De Fontein', en: 'The Fountain' },
          rect: { x: 150, y: 150, w: 116, h: 130 },
          walkTo: { x: 208, y: 300 },
          look: (state) => state.flags.seenFountain
            ? { nl: 'Het water in de fontein blijft zakken. Zonder de molen komt er geen nieuw water bij.', en: 'The fountain’s water keeps dropping. Without the mill no fresh water comes through.' }
            : { nl: 'Het water in de fontein zakt met de dag. De molen die de bron voedt staat stil — daar moet het misgaan.', en: 'The fountain’s water drops by the day. The mill that feeds the spring stands still — that must be where it goes wrong.' },
          setFlag: 'seenFountain'
        },
        {
          id: 'coin',
          name: { nl: 'Iets Glimmends in de Fontein', en: 'Something Shiny in the Fountain' },
          rect: { x: 158, y: 236, w: 100, h: 44 },
          walkTo: { x: 208, y: 300 },
          hideFlag: 'taken_square_coin',                 // weg zodra opgeraapt (dan werkt de fontein-look weer)
          gives: {
            item: 'coin',
            giveText: { nl: 'Op de bodem van de drooggevallen fontein, tussen de natte stenen, glinstert een oud muntje — ooit door iemand ingegooid als wens. Je raapt het op.', en: 'On the bottom of the dried-up fountain, between the wet stones, an old coin glints — once tossed in as a wish. You pick it up.' },
            emptyText: { nl: 'Verder ligt er niets in het bekken.', en: 'There is nothing else in the basin.' }
          }
        },
        {
          id: 'note',
          name: { nl: 'Briefje bij een Kraampje', en: 'Note by a Stall' },
          rect: { x: 432, y: 244, w: 52, h: 40 },
          walkTo: { x: 442, y: 306 },
          gives: {
            item: 'note',
            giveText: { nl: 'Aan een marktkraampje is een verfrommeld briefje geprikt. Je pakt het en leest het later na (tik het aan in je tas).', en: 'A crumpled note is pinned to a market stall. You take it to read later (tap it in your bag).' },
            emptyText: { nl: 'Er hangt niets meer.', en: 'Nothing hangs there anymore.' }
          }
        },
        {
          id: 'stall',
          name: { nl: 'Het Meisje bij de Kraam', en: 'The Girl at the Stall' },
          rect: { x: 452, y: 226, w: 100, h: 70 },
          walkTo: { x: 436, y: 306 },
          look: (state) => state.flags.gotTear
            ? { nl: 'Het meisje veegt haar ogen droog en glimlacht dapper naar je. “Dank je voor dat mooie gedicht.”', en: 'The girl dries her eyes and smiles bravely at you. “Thank you for that lovely poem.”' }
            : state.flags.girlCrying
            ? { nl: 'Het meisje huilt zachtjes om het gedicht; een traan glinstert op haar wang. Tik haar aan om die traan op te vangen in een leeg flesje.', en: 'The girl is crying softly over the poem; a tear glistens on her cheek. Tap her to catch that tear in an empty vial.' }
            : state.flags.poemRead
            ? { nl: 'Het meisje kijkt weemoedig voor zich uit. Misschien raakt dat gloeiende gedicht uit de molen haar wel... (gebruik het gedicht op haar)', en: 'The girl gazes wistfully ahead. Perhaps that glowing poem from the mill would move her... (use the poem on her)' }
            : state.flags.gotCheese
            ? { nl: 'Het meisje knikt vriendelijk achter haar kraam vol kaas en fruit. “Smakelijk eten met dat ruiltje!”', en: 'The girl nods kindly behind her stall of cheese and fruit. “Enjoy that trade!”' }
            : { nl: 'Een meisje staat achter haar kraam vol gele kazen en fruit. Ze kijkt een beetje weemoedig. “Geld hoef ik niet — maar voor een handvol vers graan ruil ik je graag een stuk kaas.” (gebruik graan op de kraam)', en: 'A girl stands behind her stall of yellow cheeses and fruit. She looks a little wistful. “I don’t need coin — but for a handful of fresh grain I’ll gladly trade you a wedge of cheese.” (use grain on the stall)' },
          givesWhen: {
            flag: 'girlCrying', needItem: 'vialTear', consume: 'vialTear', setFlag: 'gotTear', item: 'tear',
            needText: { nl: 'Het meisje huilt — maar je hebt een leeg flesje nodig om een traan op te vangen. (er staan flesjes in de kast in de molen)', en: 'The girl is crying — but you need an empty vial to catch a tear. (there are vials in the cupboard in the mill)' },
            giveText: { nl: 'Voorzichtig houd je het lege flesje onder haar wang en vangt één glinsterende traan op. Een echte traan van het meisje — een ingrediënt voor de ketel.', en: 'Gently you hold the empty vial to her cheek and catch a single glistening tear. A real tear of the girl — an ingredient for the cauldron.' }
          },
          use: {
            poem: {
              setFlag: 'girlCrying',
              text: { nl: 'Je leest het gloeiende gedicht zachtjes voor aan het meisje. Haar lip trilt, haar ogen lopen vol... en stil begint ze te huilen. Snel — tik haar aan om met een leeg flesje een traan op te vangen!', en: 'You softly read the glowing poem to the girl. Her lip trembles, her eyes brim over... and quietly she begins to cry. Quick — tap her to catch a tear in an empty vial!' }
            },
            grain: {
              consume: 'grain',
              give: 'cheese',
              setFlag: 'gotCheese',
              text: { nl: 'Je legt de handvol graan op de toonbank. Het meisje glimlacht, weegt een fors stuk gele kaas af en drukt het je in handen. “Eerlijke ruil!”', en: 'You set the handful of grain on the counter. The girl smiles, weighs out a hefty wedge of yellow cheese and presses it into your hands. “A fair trade!”' }
            }
          }
        },
        {
          id: 'chessman',
          name: { nl: 'De Oude Schaker', en: 'The Old Chess Player' },
          rect: { x: 312, y: 182, w: 86, h: 92 },
          walkTo: { x: 330, y: 300 },
          appearFlag: 'mayorGone',                      // verschijnt zodra de burgemeester is vertrokken (na de wijn + opnieuw het plein op)
          look: (state) => state.flags.wonChess
            ? { nl: 'De oude man leunt tevreden achterover bij zijn schaakbord. “Goed gespeeld, jongen. Die drakenschub is eerlijk verdiend.”', en: 'The old man leans back contentedly by his chessboard. “Well played, lad. That dragon scale is fairly earned.”' }
            : { nl: 'Op het bankje bij de fontein zit een oude man over een schaakbord gebogen. Hij kijkt op met fonkelende ogen: “De burgemeester? Die is op reis. Maar kom — zet mij mat in drie zetten en ik geef je iets ouds en kostbaars...” (tik hem aan)', en: 'On the bench by the fountain sits an old man hunched over a chessboard. He looks up with twinkling eyes: “The mayor? Off travelling. But come — checkmate me in three moves and I’ll give you something old and precious...” (tap him)' },
          chess: {
            setFlag: 'wonChess',
            give: 'dragonscale',
            doneText: { nl: 'De oude man schuift het schaakbord opzij. “Eén partij per dag, jongen.”', en: 'The old man pushes the board aside. “One game a day, lad.”' },
            winText: { nl: 'Schaakmat! De oude man bulderlacht en klopt je op de schouder. “Briljant! Een belofte is een belofte.” Hij haalt een harde, glanzende DRAKENSCHUB uit zijn jaszak en legt hem in je hand. (een ingrediënt voor de ketel)', en: 'Checkmate! The old man bursts out laughing and pats your shoulder. “Brilliant! A promise is a promise.” He pulls a hard, gleaming DRAGON SCALE from his coat pocket and places it in your hand. (an ingredient for the cauldron)' }
          }
        },
        {
          id: 'toMill',
          name: { nl: 'Pad naar de Molen', en: 'Path to the Mill' },
          rect: { x: 64, y: 158, w: 74, h: 138 },
          walkTo: { x: 118, y: 300 },
          arrow: { x: 96, y: 196, dir: 'up' },
          exit: { to: 'mill', travelText: { nl: 'Je volgt het pad naar de oude molen aan de rand van het dorp...', en: 'You follow the path to the old mill at the edge of the village...' } }
        }
      ]
    },

    mill: {
      name: { nl: 'De Oude Molen', en: 'The Old Mill' },
      bg: 'assets/art/scene-mill.jpg',
      bgVariants: [
        { img: 'assets/art/scene-mill-poem.jpg', flag: 'visited_valley', notFlag: 'poemRead' },   // terug uit de vallei: vlag omhoog; zodra de brief is gepakt weer omlaag
        { img: 'assets/art/scene-mill.jpg' }
      ],
      charFilter: 'sepia(0.3) saturate(1.2) brightness(1.05)',   // warm-gouden opkomende zon, geeliger
      entryText: {
        nl: 'De oude molen op de heuvel. De wieken staan stil en het waterrad aan de zijkant beweegt niet. De deur staat op een kier — hier moet het misgaan met de waterbron.',
        en: 'The old mill on the hill. The sails are still and the water wheel on its side does not turn. The door stands ajar — this must be where the water source fails.'
      },
      playerStart: { x: 300, y: 300 },
      spawnFrom: { millInside: { x: 280, y: 300 }, square: { x: 482, y: 262 }, castle: { x: 92, y: 262 } },   // uit het dorp: rechtsboven; van het kasteel: linksboven
      depth: { far: 250, near: 316, sFar: 0.84, sNear: 1.04 },   // milde diepte: niet te snel kleiner naar de poort   // perspectief: duidelijk kleiner naar achteren
      walkable: [
        { x: 70, y: 250, w: 430, h: 66 }    // het pad / voorgrond vóór de molen
      ],
      obstacles: [],
      overlays: [],
      worldItems: [
        { item: 'berries', hotspot: 'berries', x: 484, y: 296 }   // bessenstruik rechts van het pad (ver naar rechts)
      ],
      npcs: [],
      fx: {},   // geen glitters bij de brievenbus; de omhoog staande vlag in de achtergrond is de hint
      hotspots: [
        {
          id: 'poem',
          name: { nl: 'De Brievenbus', en: 'The Mailbox' },
          rect: { x: 250, y: 232, w: 52, h: 60 },
          walkTo: { x: 276, y: 306 },
          appearFlag: 'visited_valley',                 // de vlag staat omhoog zodra je terug bent uit de vallei
          gives: {
            item: 'poem',
            setFlag: 'poemRead',                        // vlag van de brievenbus weer omlaag (terug naar molen-Image)
            giveText: { nl: 'De vlag van de brievenbus staat omhoog. Er steekt een opgevouwen, zacht gloeiend briefje in. Finn vouwt het open, leest het en stopt het in zijn tas:\n\n“Klein licht in de mist, zo ver van huis,\nde maan huilt zilver op het ruisende water.\nWie een traan om een ander durft te laten,\nopent de poort die niemand anders vond.”\n\nEen gedicht zonder afzender — dit zou je eens moeten voorlezen aan iemand met verdriet...', en: 'The mailbox flag is up. A folded, softly glowing note pokes out. Finn opens it, reads it and tucks it into his bag:\n\n“Small light in the mist, so far from home,\nthe moon weeps silver on the whispering water.\nWhoever dares to shed a tear for another,\nopens the gate that no one else could find.”\n\nA poem with no sender — you should read this aloud to someone who carries sorrow...' },
            emptyText: { nl: 'De brievenbus is leeg; het gedicht zit in je tas.', en: 'The mailbox is empty; the poem is in your bag.' }
          }
        },
        {
          id: 'berries',
          name: { nl: 'Zwarte Bessen', en: 'Black Berries' },
          rect: { x: 462, y: 278, w: 56, h: 38 },
          walkTo: { x: 474, y: 306 },
          hideFlag: 'taken_mill_berries',
          gives: {
            item: 'berries',
            giveText: { nl: 'Rechts van de molen hangt een struik vol diepzwarte bessen. Je plukt er een handvol van — je vingers kleuren meteen donkerpaars. Hier maak je vast inkt van.', en: 'To the right of the mill grows a bush full of deep-black berries. You pick a handful — your fingers stain dark purple at once. These would surely make ink.' },
            emptyText: { nl: 'De struik is nu leeggeplukt.', en: 'The bush is picked clean now.' }
          }
        },
        {
          id: 'wheel',
          name: { nl: 'Het Waterrad', en: 'The Water Wheel' },
          rect: { x: 326, y: 150, w: 96, h: 96 },
          walkTo: { x: 360, y: 300 },
          look: {
            nl: 'Het grote waterrad aan de zijkant zit muurvast — de as is verbogen. Zo komt er geen water naar het dorp. Het mechaniek dat het rad aandrijft zit bínnen in de molen; ga eens kijken achter die deur.',
            en: 'The great water wheel on the side is jammed — the axle is bent. No water reaches the village like this. The mechanism that drives the wheel is inside the mill; take a look behind that door.'
          },
          setFlag: 'lookedMill'
        },
        {
          id: 'recipeStone',
          name: { nl: 'Een Losse Steen', en: 'A Loose Stone' },
          rect: { x: 78, y: 256, w: 52, h: 38 },
          walkTo: { x: 104, y: 306 },
          appearFlag: 'recipeRevealed',                 // verschijnt zodra de raaf de steen heeft aangewezen
          arrow: { x: 100, y: 246, dir: 'down' },
          gives: {
            item: 'recipe',
            giveText: { nl: 'Links bij de molen ligt een losse steen — precies waar de raaf op tikte. Je wipt hem omhoog: eronder ligt een opgevouwen, vergeeld perkament. Het is een récept! Drie ingrediënten voor de ketel. (tik het recept aan in je tas om het te bekijken)', en: 'By the mill, to the left, lies a loose stone — exactly where the raven tapped. You lever it up: beneath it rests a folded, yellowed parchment. It’s a RECIPE! Three ingredients for the cauldron. (tap the recipe in your bag to view it)' },
            emptyText: { nl: 'Onder de steen is verder niets meer; het recept zit in je tas.', en: 'There is nothing else under the stone; the recipe is in your bag.' }
          }
        },
        {
          id: 'toMillInside',
          name: { nl: 'Deur van de Molen', en: 'Mill Door' },
          rect: { x: 248, y: 198, w: 54, h: 74 },
          walkTo: { x: 280, y: 300 },
          arrow: { x: 262, y: 232, dir: 'up' },
          exit: { to: 'millInside', travelText: { nl: 'Je duwt de zware deur open en stapt de molen binnen...', en: 'You push the heavy door open and step inside the mill...' } }
        },
        {
          id: 'toCastle',
          name: { nl: 'Pad naar het Kasteel', en: 'Path to the Castle' },
          rect: { x: 64, y: 168, w: 74, h: 144 },
          walkTo: { x: 96, y: 300 },
          arrow: { x: 96, y: 244, dir: 'up' },
          exit: { to: 'castle', travelText: { nl: 'Je neemt het pad over de heuvel naar de kasteelpoort van Eldoria...', en: 'You take the path over the hill to the castle gate of Eldoria...' } }
        },
        {
          id: 'toSquare',
          name: { nl: 'Pad naar het Dorp', en: 'Path to the Village' },
          rect: { x: 446, y: 168, w: 96, h: 144 },
          walkTo: { x: 470, y: 300 },
          arrow: { x: 492, y: 244, dir: 'up' },   // recht omhoog, hoger op het pad naar het dorp
          exit: { to: 'square', travelText: { nl: 'Je volgt het pad terug omhoog naar het dorp.', en: 'You follow the path back up to the village.' } }
        }
      ]
    },

    millInside: {
      name: { nl: 'In de Molen', en: 'Inside the Mill' },
      bg: 'assets/art/scene-mill-inside.png',
      charFilter: 'sepia(0.3) saturate(1.12) brightness(0.78)',   // Finn staat in de schemerige molen: wat donkerder (schaduw)
      entryText: {
        nl: 'Binnen is het schemerig en stoffig; zonnestralen vallen door de raampjes op de grote maalsteen en het houten tandrad. Het rad staat stokstijf stil — hier wordt het water tegengehouden.',
        en: 'Inside it is dim and dusty; sunbeams fall through the small windows onto the great millstone and the wooden gear. The wheel stands dead still — this is where the water is held back.'
      },
      playerStart: { x: 300, y: 300 },
      depth: { far: 214, near: 314, sFar: 1.45, sNear: 1.45 },   // vaste, grotere schaal: binnen krimp je NIET naar achteren
      walkable: [
        { x: 60, y: 256, w: 470, h: 60 }    // de stenen vloer op de voorgrond
      ],
      obstacles: [],
      overlays: [],
      worldItems: [],
      npcs: [
        { id: 'mouse', sprite: 'mouse', x: 162, y: 306, scale: 0.55, flip: true, filter: 'brightness(0.82)' }   // muisje bij het holletje naast de wijnton (zichtbaar, licht in de schaduw)
      ],
      fx: {},
      hotspots: [
        {
          id: 'millstone',
          name: { nl: 'De Maalsteen', en: 'The Millstone' },
          rect: { x: 196, y: 150, w: 150, h: 110 },
          walkTo: { x: 270, y: 300 },
          look: {
            nl: 'De zware ronde maalsteen en de houten pers erboven. Alles zit onder een laag meel en stof — er is hier al weken niet gemalen. Iets blokkeert het mechaniek.',
            en: 'The heavy round millstone and the wooden press above it. Everything is under a layer of flour and dust — nothing has been milled here for weeks. Something is jamming the mechanism.'
          },
          setFlag: 'sawMillstone'
        },
        {
          id: 'gear',
          name: { nl: 'Het Tandrad', en: 'The Gear Wheel' },
          rect: { x: 348, y: 150, w: 96, h: 110 },
          walkTo: { x: 380, y: 300 },
          gears: {
            needItem: 'millwheel',
            needText: {
              nl: 'Eén rad ontbreekt: het zware molenrad zit niet in de voorraad. Dat is weggesleept naar de kar bij het kasteel — vind het eerst, dan kun je het radwerk maken.',
              en: 'One gear is missing: the heavy mill wheel isn’t in the tray. It was hauled off to the cart by the castle — find it first, then you can fix the gearworks.'
            },
            title: { nl: 'Het Molenradwerk', en: 'The Mill Gearworks' },
            hint: { nl: 'Je hebt het molenrad! Sleep de 5 radjes op maat op hun plek zodat het rad weer aangrijpt.', en: 'You have the mill wheel! Drag the 5 gears into place (by size) so the wheel engages again.' },
            setFlag: 'millFixed',
            solvedText: { nl: 'Je zet het zware molenrad terug en de radjes grijpen aan. Met een diep gekraak komt het waterrad weer in beweging — water klatert door de goot, op weg naar het dorp! (wordt vervolgd)', en: 'You set the heavy mill wheel back and the gears engage. With a deep groan the water wheel turns again — water gushes down the channel, on its way to the village! (to be continued)' }
          },
          look: {
            nl: 'Het grote houten tandrad draait weer soepel; het waterrad buiten klatert. (wordt vervolgd)',
            en: 'The big wooden gear turns smoothly again; the water wheel outside splashes. (to be continued)'
          },
          setFlag: 'foundJam'
        },
        {
          id: 'vial',
          name: { nl: 'Stoffige Flesjes', en: 'Dusty Bottles' },
          rect: { x: 14, y: 58, w: 104, h: 56 },
          walkTo: { x: 96, y: 300 },
          gives: {
            item: 'vialInk',
            also: ['vialWine', 'vialTear'],
            setFlag: 'gotVials',
            giveText: { nl: 'In de kast staan oude flesjes. Je neemt er drie lege glazen flesjes met kurk mee: eentje voor de inkt (van de bessen), eentje voor de wijn (uit de wijnton) en eentje om straks de traan van het meisje in op te vangen.', en: 'Old bottles stand in the cupboard. You take three empty corked glass vials: one for the ink (from the berries), one for the wine (from the barrel) and one to catch the girl’s tear in later.' },
            emptyText: { nl: 'De andere flesjes zijn gebarsten of vol spinrag.', en: 'The other bottles are cracked or full of cobwebs.' }
          }
        },
        {
          id: 'bookTable',
          name: { nl: 'Boek op de Tafel', en: 'Book on the Table' },
          rect: { x: 18, y: 172, w: 120, h: 42 },
          walkTo: { x: 108, y: 300 },
          look: {
            nl: 'Finn buigt zich over het opengeslagen molenaarsboek en leest de gekrabbelde kantlijn hardop voor: “De vastzittende boeken op de plank — trek ze zó los: eerst BLAUW, dan GROEN, dan ROOD, als laatste GEEL. Alleen díe volgorde geeft de plank haar geheim.” “Aha,” mompelt hij, “dát moet ik onthouden.”',
            en: 'Finn leans over the open miller’s book and reads the scrawled margin aloud: “The stuck books on the shelf — pull them loose like so: first BLUE, then GREEN, then RED, lastly YELLOW. Only that order makes the shelf give up its secret.” “Aha,” he mutters, “I’d better remember that.”'
          },
          setFlag: 'readMillBook'
        },
        {
          id: 'books',
          name: { nl: 'Vastzittende Boeken', en: 'Stuck Books' },
          rect: { x: 10, y: 118, w: 112, h: 48 },
          walkTo: { x: 96, y: 300 },
          bookPuzzle: {
            title: { nl: 'De Vastzittende Boeken', en: 'The Stuck Books' },
            hint: { nl: 'Trek de boeken in de juiste volgorde — lees eerst het opengeslagen boek eronder.', en: 'Pull the books in the right order — first read the open book below.' },
            setFlag: 'gotSpellbook',
            gives: 'spellbook',
            sequence: ['blauw', 'groen', 'rood', 'geel'],
            books: [
              { key: 'groen', label: { nl: 'Groen', en: 'Green' }, color: '#84c06f' },
              { key: 'rood',  label: { nl: 'Rood',  en: 'Red' },   color: '#e07a64' },
              { key: 'geel',  label: { nl: 'Geel',  en: 'Yellow' },color: '#e8cc5a' },
              { key: 'blauw', label: { nl: 'Blauw', en: 'Blue' },  color: '#79ace8' }
            ],
            solvedText: { nl: 'Met een klik schiet de laatste band los en een verborgen vakje klapt open — een oud TOVERBOEK glijdt in je handen! Maar als je het opent zijn alle bladzijden léég... Hier hoort een spreuk geschreven te worden, met de juiste pen en inkt.', en: 'With a click the last spine springs loose and a hidden compartment pops open — an old SPELLBOOK slides into your hands! But when you open it every page is blank... A spell needs to be written here, with the right pen and ink.' },
            resetText: { nl: 'Knars! De boeken klemmen weer vast. Begin opnieuw.', en: 'Crunch! The books jam shut again. Start over.' }
          }
        },
        {
          id: 'grain',
          name: { nl: 'Graanzak', en: 'Grain Sack' },
          rect: { x: 296, y: 224, w: 116, h: 80 },
          walkTo: { x: 344, y: 300 },
          gives: {
            item: 'grain',
            repeat: true,                          // je kunt telkens vers graan scheppen (voor de muis én de kaasruil)
            giveText: { nl: 'Een opengevallen zak graan staat bij de maalsteen. Je schept een handvol goudgeel graan in je tas.', en: 'An open sack of grain stands by the millstone. You scoop a handful of golden grain into your bag.' },
            haveText: { nl: 'Je hebt al een handvol graan in je tas.', en: 'You already have a handful of grain in your bag.' }
          }
        },
        {
          id: 'mouse',
          name: { nl: 'Een Bruine Muis', en: 'A Brown Mouse' },
          rect: { x: 134, y: 284, w: 64, h: 38 },
          walkTo: { x: 172, y: 300 },
          face: 'assets/art/face-mouse.png',
          look: (state) => state.flags.mouseFed
            ? { nl: 'Het muisje knabbelt tevreden aan het graan. “Mmm, dank je, vriendelijke reus! De molenaar? Die is naar het kasteel om hulp te vragen — volg het pad maar. Piep!”', en: 'The little mouse nibbles the grain happily. “Mmm, thank you, kind giant! The miller? He went to the castle for help — just follow the path. Squeak!”' }
            : { nl: 'Een klein bruin muisje kijkt je met glanzende kraaloogjes aan. “Piep! Niet schrikken, hoor. Het is hier zo stil sinds het rad stilstaat... heb jij misschien iets te knabbelen voor me?”', en: 'A little brown mouse looks up at you with shiny beady eyes. “Squeak! Don’t be startled. It’s been so quiet since the wheel stopped... do you maybe have something to nibble?”' },
          use: {
            grain: {
              consume: 'grain',
              setFlag: 'mouseFed',
              text: { nl: 'Je strooit wat graan voor het muisje. Het knabbelt blij en piept: “Heerlijk! Zoek je de molenaar? Hij ging het pad op naar het kasteel — daar zoeken ze ook naar de bron.”', en: 'You scatter some grain for the mouse. It nibbles happily and squeaks: “Delicious! Looking for the miller? He took the path to the castle — they’re searching for the spring there too.”' }
            },
            cheese: {
              consume: 'cheese',
              setFlag: 'wineTapLoose',
              text: { nl: 'Je geeft het muisje het stuk kaas. Verrukt klimt het op de wijnton en knaagt net zo lang aan de vastgeroeste tap tot die loslaat. “Piep! Nu kun je wijn aftappen — met een leeg flesje!”', en: 'You give the mouse the wedge of cheese. Delighted, it climbs onto the wine barrel and gnaws at the rusted tap until it comes loose. “Squeak! Now you can draw wine — with an empty vial!”' }
            }
          }
        },
        {
          id: 'winebarrel',
          name: { nl: 'De Wijnton', en: 'The Wine Barrel' },
          rect: { x: 158, y: 116, w: 74, h: 78 },
          walkTo: { x: 178, y: 300 },
          look: (state) => state.flags.gotWine
            ? { nl: 'De oude wijnton met de nu losse tap. Je flesje zit vol diep robijnrode wijn.', en: 'The old wine barrel with its now-loosened tap. Your vial is full of deep ruby-red wine.' }
            : state.flags.wineTapLoose
            ? { nl: 'De tap van de wijnton zit nu los, dankzij de muis. Met een leeg flesje kun je er wijn uittappen. (gebruik een leeg flesje op de ton)', en: 'The wine barrel’s tap is loose now, thanks to the mouse. With an empty vial you can draw wine. (use an empty vial on the barrel)' }
            : { nl: 'Een dikke oude wijnton tegen de muur. De tap zit muurvast en half verstopt achter de duigen — met je grote handen krijg je er met geen mogelijkheid bij. Iets kleins en behendigs zou wél bij die tap kunnen...', en: 'A fat old wine barrel against the wall. The tap is jammed tight and half-hidden behind the staves — with your big hands you can’t reach it at all. Something small and nimble could get to that tap, though...' },
          use: {
            vialWine: {
              requiresFlag: 'wineTapLoose',
              requiresText: { nl: 'De tap zit nog muurvast en je krijgt er niet bij — er moet eerst iets kleins de tap losmaken.', en: 'The tap is still jammed and out of reach — something small must loosen it first.' },
              consume: 'vialWine',
              give: 'wine',
              setFlag: 'gotWine',
              text: { nl: 'Je houdt het lege flesje onder de losgemaakte tap en draait hem open. Diep robijnrode wijn klokt naar binnen tot het flesje vol is. Je kurkt het stevig dicht.', en: 'You hold the empty vial under the loosened tap and turn it open. Deep ruby-red wine glugs in until the vial is full. You cork it tightly.' }
            }
          }
        },
        {
          id: 'outMill',
          name: { nl: 'Naar Buiten', en: 'Back Outside' },
          rect: { x: 60, y: 286, w: 50, h: 30 },
          walkTo: { x: 88, y: 302 },
          arrow: { x: 86, y: 306, dir: 'down' },
          exit: { to: 'mill', travelText: { nl: 'Je stapt de molen weer uit, het ochtendlicht in.', en: 'You step back out of the mill into the morning light.' } }
        }
      ]
    },

    castle: {
      name: { nl: 'De Kasteelpoort', en: 'The Castle Gate' },
      bg: 'assets/art/scene-castle.png',
      charFilter: 'sepia(0.3) saturate(1.2) brightness(1.05)',   // zelfde warme ochtendzon
      heroShade: 0.87,                                            // Finn iets donkerder bij de poort (meer in de schaduw)
      entryText: {
        nl: 'De poort van kasteel Eldoria, aan het einde van de brug. Een handkar vol vaten en kruiken staat verlaten bij de muur. Het poortmechaniek — een radwerk van tandwielen — is uit elkaar gevallen, zodat de poort niet opengaat.',
        en: 'The gate of castle Eldoria, at the end of the bridge. A handcart full of barrels and jugs stands abandoned by the wall. The gate mechanism — a clockwork of gears — has fallen apart, so the gate will not open.'
      },
      playerStart: { x: 300, y: 300 },
      depth: { far: 250, near: 316, sFar: 0.84, sNear: 1.04 },   // milde diepte: niet te snel kleiner naar de poort
      walkable: [
        { x: 120, y: 256, w: 400, h: 60 },   // de geplaveide weg vóór de poort
        { x: 330, y: 214, w: 130, h: 102 }   // pad omhoog naar de poort (zodat je naar de wacht kunt lopen)
      ],
      obstacles: [],
      overlays: [],
      worldItems: [],
      npcs: [
        { id: 'guard', sprite: 'guard', x: 402, y: 218, scale: 1.12, sway: true },   // poortwacht met hellebaard (iets kleiner); wiegt rustig heen en weer
        { id: 'merchant', sprite: 'merchantLeft', x: 286, y: 282, scale: 1.12, filter: 'brightness(0.6)', scanSprites: ['merchantLeft', 'merchantFwd', 'merchantRight', 'merchantSly'], aweSprites: ['merchantSurprised', 'merchantAwe'], aweFlag: 'merchantDistracted', turnFlag: 'merchantDistracted', stopFlag: 'taken_castle_cart' },   // sneaky handelsman: kijkt verbaasd óm naar de dansende bloem zodra die danst — maar zodra je het rad uit de kar hebt, kijkt hij weer normaal (stopFlag)
        { id: 'ravenCart', sprite: 'ravenPerch', x: 80, y: 198, scale: 0.95, appearFlag: 'ravenFed', hideFlag: 'taken_castle_cart', peck: true },   // de raaf landt iets links op de kar en pikt naar de ton waar het molenrad ligt (hint)
        { id: 'flower', sprite: 'flowerWhite', x: 444, y: 264, scale: 0.29, danceFlag: 'flowerDancing', danceStopFlag: 'taken_castle_cart' },   // (dansende) gelig-witte bloem — strak cluster, kleiner
        { id: 'flower2', sprite: 'flowerWhite', x: 431, y: 267, scale: 0.21, danceFlag: 'flowerDancing', danceStopFlag: 'taken_castle_cart' },   // alle bloemen gelig-wit, dicht bij elkaar; dansen mee
        { id: 'flower3', sprite: 'flowerWhite', x: 457, y: 267, scale: 0.2, danceFlag: 'flowerDancing', danceStopFlag: 'taken_castle_cart' },
        { id: 'flower4', sprite: 'flowerWhite', x: 420, y: 263, scale: 0.18, danceFlag: 'flowerDancing', danceStopFlag: 'taken_castle_cart' },
        { id: 'flower5', sprite: 'flowerWhite', x: 468, y: 262, scale: 0.19, danceFlag: 'flowerDancing', danceStopFlag: 'taken_castle_cart' }
      ],
      fx: {},
      hotspots: [
        {
          id: 'guard',
          name: { nl: 'De Poortwacht', en: 'The Gate Guard' },
          rect: { x: 362, y: 140, w: 76, h: 138 },
          walkTo: { x: 388, y: 284 },
          face: 'assets/art/face-guard.png',
          look: (state) => state.flags.gateOpen
            ? { nl: 'De wacht plant zijn hellebaard steviger neer. “Het radwerk draait weer, knul — knap werk. Maar hier kom je niet door. Bevel van de hofmaarschalk: niemand het kasteel in zonder zegel.” (wordt vervolgd)', en: 'The guard plants his halberd firmer. “The gearworks turns again, lad — fine work. But you don’t pass here. Steward’s orders: no one enters the castle without a seal.” (to be continued)' }
            : { nl: 'Een strenge poortwacht in een blauw tabbaard verspert de weg. “Halt. Het kasteel is gesloten zolang de bron droog staat — en die poort krijg je toch niet open: het radwerk ernaast is kapot.” Hij knikt naar het mechaniek naast de poort.', en: 'A stern guard in a blue tabard blocks the way. “Halt. The castle is closed while the spring runs dry — and you won’t open that gate anyway: the gearworks beside it is broken.” He nods at the mechanism beside the gate.' },
          setFlag: 'metGuard'
        },
        {
          id: 'cart',
          name: { nl: 'De Handkar', en: 'The Handcart' },
          rect: { x: 20, y: 168, w: 166, h: 120 },
          walkTo: { x: 150, y: 300 },
          requiresFlag: 'merchantDistracted',
          blockedText: {
            nl: 'De raaf zit boven op de kar en pikt naar één plek tussen de vaten — dáár ligt een zwaar ijzeren MOLENRAD, precies wat de molen nodig heeft! Maar de handelsman houdt zijn kar scherp in de gaten. Je moet hem eerst afleiden.',
            en: 'The raven perches atop the cart, pecking at one spot between the barrels — there lies a heavy iron MILL WHEEL, exactly what the mill needs! But the merchant watches his cart closely. You must distract him first.'
          },
          gives: {
            item: 'millwheel',
            flyNpc: 'ravenCart', flyDir: 'left',         // de raaf wiekt op en vliegt weg naar de vallei
            giveText: { nl: 'De handelsman staart gebiologeerd naar de dansende bloem. Snel grist je het zware ijzeren molenrad tussen de vaten vandaan en stopt het weg. Hebbes! De betovering ebt weg — de bloemen vallen stil — en de raaf wiekt op en vliegt weg, richting de mistige vallei.', en: 'The merchant gawks at the dancing flower. Quickly you snatch the heavy iron mill wheel from between the barrels and stash it. Got it! The enchantment fades — the flowers fall still — and the raven takes wing, flying off toward the misty valley.' },
            emptyText: { nl: 'Verder ligt er niets bruikbaars in de kar.', en: 'Nothing else useful is in the cart.' }
          }
        },
        {
          id: 'flower',
          name: { nl: 'Witte Bloemen', en: 'White Flowers' },
          rect: { x: 404, y: 238, w: 76, h: 60 },
          walkTo: { x: 440, y: 300 },
          look: (state) => state.flags.flowerDancing
            ? { nl: 'De bloemen zwieren uitbundig heen en weer; de handelsman kan zijn ogen er niet vanaf houden.', en: 'The flowers sway wildly to and fro; the merchant can’t take his eyes off them.' }
            : { nl: 'Een groep bloemen naast de poort, met één grote ertussen. Als die eens zouden gaan dansen... (lees je toverboek)', en: 'A cluster of flowers by the gate, one big one among them. If only they would dance... (read your spellbook)' },
          castWith: {
            item: 'spellbook',
            requiresFlag: 'spellWritten',
            setFlag: ['flowerDancing', 'merchantDistracted'],
            needText: { nl: 'Je voelt dat hier magie kan werken, maar je kent de spreuk nog niet. Misschien staat er iets in een toverboek...', en: 'You sense magic could work here, but you don’t know the spell yet. Perhaps a spellbook holds one...' },
            emptyText: { nl: 'Je slaat het toverboek open, maar de bladzijden zijn leeg — je moet de spreuk er eerst nog ín schrijven (met een inktveer).', en: 'You open the spellbook, but the pages are blank — you must write the spell into it first (with an ink-dipped feather).' },
            text: { nl: 'Je slaat het toverboek open en spreekt de spreuk uit. De grote bloem schiet wakker en begint uitbundig te DANSEN! De handelsman draait zich verbaasd om en loopt er gebiologeerd naartoe — zijn kar staat nu onbewaakt.', en: 'You open the spellbook and speak the spell. The big flower springs awake and begins to DANCE wildly! The merchant turns in astonishment and wanders over, transfixed — his cart now stands unguarded.' }
          }
        },
        {
          id: 'merchant',
          name: { nl: 'De Handelsman', en: 'The Merchant' },
          rect: { x: 186, y: 212, w: 64, h: 96 },
          walkTo: { x: 206, y: 300 },
          face: 'assets/art/face-merchant.png',
          look: (state) => state.flags.merchantDistracted
            ? { nl: 'De handelsman staart met open mond naar de dansende bloem. “Wat... een dánsende bloem? Ongelooflijk!” Hij let totaal niet meer op zijn kar.', en: 'The merchant gapes at the dancing flower. “What... a DANCING flower? Incredible!” He pays no attention to his cart at all.' }
            : { nl: 'Een gezette handelsman bewaakt zijn volgeladen kar. “Afblijven, jochie — dit is allemaal koopwaar. Tenzij je goud hebt zeker?”', en: 'A portly merchant guards his loaded cart. “Hands off, lad — this is all merchandise. Unless you’ve got gold?”' },
          setFlag: 'metMerchant'
        },
        {
          id: 'bridgeGears',
          name: { nl: 'Het Poortradwerk', en: 'The Gate Gearworks' },
          rect: { x: 300, y: 96, w: 150, h: 176 },
          walkTo: { x: 372, y: 300 },
          look: {
            nl: 'Het poortradwerk is volledig uit elkaar gevallen en zwaar verroest — hier valt voorlopig niets te repareren. (De molen heeft net zo’n radwerk — dáár, met het molenrad, ligt jouw echte klus.)',
            en: 'The gate gearworks has completely fallen apart and is badly rusted — nothing to repair here for now. (The mill has a gearworks just like this — there, with the mill wheel, lies your real task.)'
          },
          setFlag: 'sawGateGears'
        },
        {
          id: 'toMill',
          name: { nl: 'Terug naar de Molen', en: 'Back to the Mill' },
          rect: { x: 126, y: 262, w: 92, h: 54 },
          walkTo: { x: 156, y: 300 },
          arrow: { x: 150, y: 292, dir: 'down' },
          exit: { to: 'mill', travelText: { nl: 'Je daalt het pad weer af naar de molen.', en: 'You head back down the path to the mill.' } }
        },
        {
          id: 'toValley',
          name: { nl: 'Het Pad naar de Vallei', en: 'The Path to the Valley' },
          rect: { x: 22, y: 112, w: 132, h: 62 },        // achter de handkar (links), wijst weg de vallei in
          walkTo: { x: 150, y: 284 },
          arrow: { x: 74, y: 138, dir: 'up' },
          appearFlag: 'gotMap',                          // verschijnt zodra je de geheime kaart hebt
          exit: { to: 'valley', travelText: { nl: 'Met de geheime kaart in de hand volg je het pad achter de kar langs, voorbij het bos, de mistige vallei in...', en: 'With the secret map in hand you follow the path past the cart, beyond the wood, into the misty valley...' } }
        }
      ]
    },

    valley: {
      name: { nl: 'De Mistige Vallei', en: 'The Misty Valley' },
      bg: 'assets/art/scene-valley.jpg',
      bgVariants: [
        { img: 'assets/art/scene-valley-magic.jpg', flag: 'valleyMagic' },   // ketel ontstoken → alles gloeit blauw
        { img: 'assets/art/scene-valley.jpg' }
      ],
      charFilter: 'sepia(0.12) saturate(1.05) brightness(1.0)',   // koeler, mistig ochtendlicht
      heroShade: 0.87,                                             // Finn iets donkerder in de mistige vallei (meer in de schaduw)
      entryText: {
        nl: 'Voorbij het bos opent zich de vallei uit de geheime kaart: een oude runencirkel van steen, met staande runenstenen en in het hart een grote stenen ketel. Hier, waar je vaders kaart eindigt, begint Finns volgende avontuur...',
        en: 'Beyond the wood the valley from the secret map opens up: an ancient rune circle of stone, with standing rune-stones and a great stone cauldron at its heart. Here, where your father’s map ends, Finn’s next adventure begins...'
      },
      playerStart: { x: 120, y: 288 },
      spawnFrom: { castle: { x: 120, y: 288 } },
      depth: { far: 252, near: 304, sFar: 0.8, sNear: 1.06 },
      walkable: [
        { x: 56, y: 270, w: 452, h: 46 }    // de rand van de runencirkel
      ],
      obstacles: [],
      overlays: [],
      worldItems: [],
      npcs: [
        /* De heks staat in de mist naast de ketel en lokt Finn (wenk-frames) — iets hoger en groter. */
        { id: 'witch', sprite: 'witch', lure: 'witchBeckon', x: 404, y: 224, scale: 1.04 },
        /* De glanzende raaf zit op de linker fakkel/brazier achter in de cirkel (meer naar links); vliegt weg zodra hij het recept heeft 'aangewezen'. */
        { id: 'ravenValley', sprite: 'ravenPerch', x: 38, y: 207, scale: 0.95, hideFlag: 'recipeRevealed' }
      ],
      fx: {
        fireflies: 10,                                       // dwaallichtjes boven de mist
        fireflyCols: ['120,180,255', '150,230,120'],         // afwisselend blauw en groen
        mist: { bands: 4, y: 238, alpha: 0.2, around: { x: 404, y: 246, rx: 175, ry: 44 }, aroundAlpha: 0.5 }   // brede lage grondmist over bijna de hele breedte + dichter rond de heks
      },
      hotspots: [
        {
          id: 'witch',
          name: { nl: 'De Oude Heks', en: 'The Old Witch' },
          rect: { x: 356, y: 150, w: 78, h: 120 },
          walkTo: { x: 344, y: 300 },
          look: {
            nl: 'Een kromme oude heks met een punthoed leunt op haar pollepel-staf naast de ketel. Ze wenkt je met een knokige vinger en grijnst: “Kom dichterbij, jongen... gooi de juiste ingrediënten in mijn ketel, dan laat ik je échte magie zien.” Er loopt een rilling over je rug.',
            en: 'A hunched old witch with a pointed hat leans on her ladle-staff beside the cauldron. She beckons you with a bony finger and grins: “Come closer, boy... throw the right ingredients into my cauldron, and I’ll show you real magic.” A shiver runs down your spine.'
          },
          setFlag: 'metWitch'
        },
        {
          id: 'cauldron',
          name: { nl: 'De Stenen Ketel', en: 'The Stone Cauldron' },
          rect: { x: 248, y: 150, w: 74, h: 90 },
          walkTo: { x: 286, y: 300 },
          look: (state) => state.flags.valleyMagic
            ? { nl: 'De ketel laait met blauw vuur en de runen op alle stenen gloeien. De magie van de vallei is ontwaakt... (wordt vervolgd)', en: 'The cauldron blazes with blue fire and the runes on every stone glow. The valley’s magic has awoken... (to be continued)' }
            : { nl: 'Een oude stenen ketel in het hart van de runencirkel. In de rand staan tekens gekrast: een traan, een vuurvlieg en een draak. Gooi de drie ingrediënten erin om de magie te wekken.', en: 'An ancient stone cauldron at the heart of the rune circle. Symbols are carved into its rim: a tear, a firefly and a dragon. Throw the three ingredients in to wake the magic.' },
          use: {
            tear:        { consume: 'tear',        setFlag: 'cauldron_tear',        text: { nl: 'Je giet de traan uit het flesje in de ketel. Het water rimpelt zilverig.', en: 'You pour the tear from the vial into the cauldron. The water ripples silver.' } },
            fireflight:  { consume: 'fireflight',  setFlag: 'cauldron_fireflight',  text: { nl: 'Je laat het gevangen vuurvlieglicht boven de ketel los. Het zweeft naar binnen en lost op in een gouden gloed.', en: 'You release the cupped firefly light over the cauldron. It drifts in and dissolves into a golden glow.' } },
            dragonscale: { consume: 'dragonscale', setFlag: 'cauldron_dragonscale', text: { nl: 'Je laat de drakenschub in de ketel zakken. Het sist zacht en dampt.', en: 'You lower the dragon scale into the cauldron. It hisses softly and steams.' } }
          },
          combo: {
            needFlags: ['cauldron_tear', 'cauldron_fireflight', 'cauldron_dragonscale'],
            setFlag: 'valleyMagic',
            win: true,
            burst: { x: 286, y: 175 },
            text: {
              nl: 'Zodra het laatste ingrediënt de ketel raakt, laait er blauw vuur op! De runen op de stenen en de hele cirkel beginnen fel te gloeien — de magie van de vallei ontwaakt. (wordt vervolgd)',
              en: 'The moment the last ingredient hits the cauldron, blue fire erupts! The runes on the stones and the whole circle blaze with light — the valley’s magic awakens. (to be continued)'
            }
          }
        },
        {
          id: 'fireflight',
          name: { nl: 'Een Vuurvliegje', en: 'A Firefly' },
          rect: { x: 150, y: 150, w: 64, h: 92 },
          walkTo: { x: 182, y: 300 },
          gives: {
            item: 'fireflight',
            giveText: { nl: 'Boven een platte offersteen danst een enkel vuurvliegje, helder goudgeel oplichtend. Heel voorzichtig vang je het in je holle handen — je houdt zijn warme licht vast. Eén van de ingrediënten voor de ketel.', en: 'Above a flat offering-stone dances a single firefly, glowing bright golden. Very gently you cup it in your hands — you’re holding its warm light. One of the cauldron’s ingredients.' },
            emptyText: { nl: 'Hier dansen geen vuurvliegjes meer — je hebt het licht al gevangen.', en: 'No more fireflies dance here — you’ve already caught the light.' }
          }
        },
        {
          id: 'ravenValley',
          name: { nl: 'De Glanzende Raaf', en: 'The Glossy Raven' },
          rect: { x: 16, y: 182, w: 54, h: 60 },
          walkTo: { x: 86, y: 300 },
          face: 'assets/art/face-raven.png',
          hideFlag: 'recipeRevealed',                  // weg zodra hij het recept heeft aangewezen
          look: { nl: 'Op de oude runensteen zit dezelfde glanzende raaf van het dorpsplein, kop scheef. Zijn kraaloogjes glinsteren zodra je iets glimmends bij je hebt — hij wil duidelijk weer ruilen.', en: 'On the old rune-stone perches the same glossy raven from the village square, head cocked. Its beady eyes glint at anything shiny you carry — it clearly wants to trade again.' },
          givesWhen: {
            flag: 'visited_valley', needItem: 'coin', consume: 'coin', setFlag: 'recipeRevealed', flyNpc: 'ravenValley', flyDir: 'right',
            needText: { nl: 'De raaf tikt ongeduldig met zijn snavel — hij wil iets glimmends. (geef de burgemeester de wijn, dan krijg je een muntje)', en: 'The raven taps impatiently with its beak — it wants something shiny. (give the mayor the wine and he’ll hand you a coin)' },
            giveText: { nl: 'De raaf grist het muntje weg en krast traag, alsof hij een recept opzegt: “Eén drakenschub... één traan van een onschuldige... en het licht van een vuurvliegje.” Dan wijst hij met zijn snavel richting de molen, klapwiekt op en vliegt weg — bij de molen tikt hij op een losse steen links. Daaronder moet iets liggen...', en: 'The raven snatches the coin and rasps slowly, as if reciting a recipe: “One dragon scale... one tear of an innocent... and the light of a firefly.” Then it points its beak toward the mill, takes wing and flies off — by the mill it taps a loose stone on the left. Something must lie beneath it...' }
          }
        },
        {
          id: 'lights',
          name: { nl: 'De Dwaallichten', en: 'The Wandering Lights' },
          rect: { x: 226, y: 92, w: 130, h: 46 },
          walkTo: { x: 296, y: 300 },
          look: {
            nl: 'Zachtblauwe lichtjes zweven boven de mist achter de cirkel, alsof ze je dieper de vallei in willen lokken. Het briefje had gelijk: “volg de lichten in de vallei.”',
            en: 'Soft blue lights hover over the mist behind the circle, as if luring you deeper into the valley. The note was right: “follow the lights in the valley.”'
          },
          setFlag: 'sawValleyLights'
        },
        {
          id: 'toCastle',
          name: { nl: 'Terug naar de Poort', en: 'Back to the Gate' },
          rect: { x: 462, y: 244, w: 92, h: 72 },
          walkTo: { x: 498, y: 300 },
          arrow: { x: 502, y: 258, dir: 'down' },
          exit: { to: 'castle', travelText: { nl: 'Je keert terug langs het pad naar de kasteelpoort.', en: 'You head back up the path to the castle gate.' } }
        }
      ]
    }
  }
};
