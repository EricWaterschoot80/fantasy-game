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
  assetVer: '21',

  /* Finn — vaste figuur: roodharige jongen, blauwe kapmantel, leren tas, houten staf.
     idle = hero, lopen = 4-frame loopsheet (heroWalkSheet), zwaaien = heroWave.
     heroWalk/heroWalk2 blijven als terugval voor de 2-frame cyclus. */
  sprites: {
    hero:          'assets/art/hero.png',
    heroWalk:      'assets/art/hero-walk.png',
    heroWalk2:     'assets/art/hero-walk2.png',
    heroWave:      'assets/art/hero-wave.png',
    heroWalkSheet: 'assets/art/hero-walk-sheet.png',
    mayor:         'assets/art/mayor.png',
    mayorGesture:  'assets/art/mayor-gesture.png',  // bezorgd gebaar (af en toe)
    ravenPerch:    'assets/art/raven-perch.png',   // raaf op de ton (gevouwen vleugels)
    ravenFly:      'assets/art/raven-fly.png',      // raaf in vlucht (wegvliegen)
    mouse:         'assets/art/mouse.png',          // bruine muis in de molen (praten)
    cogBrass:      'assets/art/cog-brass.png',      // radwerk-puzzel: messing tandwiel
    cogIron:       'assets/art/cog-iron.png',       // radwerk-puzzel: ijzeren tandwiel
    guard:         'assets/art/guard.png',          // poortwacht bij het kasteel
    guardGesture:  'assets/art/guard-gesture.png',  // wacht verzet zijn hellebaard (af en toe)
    merchant:      'assets/art/merchant.png',        // handelsman bij de kar (kasteel)
    flower:        'assets/art/flower.png',          // bloem (oranje accent)
    flowerWhite:   'assets/art/flower-white.png'     // witte bloem (dansende bloem + cluster)
  },
  heroWalkFrames: 8,            // aantal frames in hero-walk-sheet.png (vloeiende 8-frame loopcyclus)
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
    q_flower:   { nl: 'Bij het kasteel: laat met de spreuk de grote bloem dansen', en: 'At the castle: use the spell to make the big flower dance' },
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
    vial:  { name: { nl: 'Leeg Flesje', en: 'Empty Vial' }, icon: '🧪', img: 'assets/art/item-vial.png',
             look: { nl: 'Een leeg glazen flesje met kurk, van de stoffige plank in de molen. Handig om straks iets in te bewaren.', en: 'An empty corked glass vial from the dusty shelf in the mill. Handy for storing something later.' } },
    book:  { name: { nl: 'Molenaarsboek', en: 'Miller’s Book' }, icon: '📖', img: 'assets/art/item-book.png',
             look: { nl: 'Het molenaarsboek. Tekeningen van het rad — en een kruisje bij een grot in de vallei, met gekrabbeld: “de blauwe steen drijft het rad weer aan.”', en: 'The miller’s book. Drawings of the wheel — and a cross at a cave in the valley, scrawled: “the blue stone drives the wheel again.”' } },
    grain: { name: { nl: 'Handvol Graan', en: 'Handful of Grain' }, icon: '🌾', img: 'assets/art/item-grain.png',
             look: { nl: 'Een handvol goudgeel graan uit de zak. Misschien lust een hongerig dier het wel.', en: 'A handful of golden grain from the sack. A hungry animal might like it.' } },
    spellbook: { name: { nl: 'Toverboek', en: 'Spellbook' }, icon: '📕', img: 'assets/art/item-book.png', zoomImg: 'assets/art/spell-flower.png',
             look: { nl: 'Het molenaars-toverboek. Eén spreuk licht warm op: “Laat wat stil staat vrolijk dansen.” Richt het op iets levends en het begint te bewegen.', en: 'The miller’s spellbook. One spell glows warm: “Make what stands still dance.” Aim it at something living and it starts to move.' } },
    millwheel: { name: { nl: 'Het Molenrad', en: 'The Mill Wheel' }, icon: '☸️', img: 'assets/art/cog-iron.png',
             look: { nl: 'Het zware ijzeren molenrad, gevonden in de kar van de handelsman. Hiermee kan de molen weer draaien — terug ermee naar de molen!', en: 'The heavy iron mill wheel, taken from the merchant’s cart. With this the mill can turn again — back to the mill with it!' } },
    cheese: { name: { nl: 'Stuk Kaas', en: 'Piece of Cheese' }, icon: '🧀', img: 'assets/art/item-cheese.png',
             look: { nl: 'Een heerlijk geel stuk boerenkaas, geruild voor een handvol graan op het plein.', en: 'A lovely yellow wedge of farmhouse cheese, traded for a handful of grain on the square.' } }
  },

  recipes: [],

  questRules: [
    { when: { flag: 'millFixed' },          quest: null },         // molen gemaakt -> wordt vervolgd
    { when: { has: 'millwheel' },           quest: 'q_fixmill' },  // rad in handen -> maak het radwerk in de molen
    { when: { flag: 'merchantDistracted' }, quest: 'q_takewheel' },// bloem danst, handelsman afgeleid -> pak het rad
    { when: { has: 'spellbook' },           quest: 'q_flower' },   // toverboek -> laat de bloem dansen bij de poort
    { when: { flag: 'lookedMill' },         quest: 'q_book' },     // rad zit vast -> zoek het toverboek in de molen
    { when: { flag: 'seenFountain' },       quest: 'q_mill' },
    { when: {},                             quest: 'q_explore' }
  ],

  scenes: {
    square: {
      name: { nl: 'Het Dorpsplein', en: 'The Village Square' },
      bg: 'assets/art/scene-square.png',
      charFilter: 'sepia(0.3) saturate(1.2) brightness(1.05)',   // warm-gouden opkomende zon, geeliger
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
      worldItems: [],
      npcs: [
        { id: 'mayor', sprite: 'mayor', gestureSprite: 'mayorGesture', x: 372, y: 264 },   // burgemeester Bram; wringt af en toe wanhopig met zijn handen
        { id: 'raven', sprite: 'ravenPerch', x: 36, y: 257, scale: 1.15, hideFlag: 'ravenFed' }   // glanzende raaf op de ton (links), 3px hoger
      ],
      fx: {},

      hotspots: [
        {
          id: 'mayor',
          name: { nl: 'Burgemeester Bram', en: 'Mayor Bram' },
          rect: { x: 346, y: 186, w: 54, h: 80 },
          walkTo: { x: 366, y: 300 },
          face: 'assets/art/face-mayor.png',
          look: (state) => state.flags.metMayor
            ? { nl: 'Burgemeester Bram friemelt zenuwachtig aan zijn ambtsketting. “Die vallei, Finn... vergeet de lichten niet.”', en: 'Mayor Bram fidgets with his chain of office. “That valley, Finn... don’t forget the lights.”' }
            : { nl: 'Burgemeester Bram strijkt over zijn grijze snor. “Finn, jongen — de fontein loopt leeg en het dorp wordt onrustig. De molen pompt geen water meer. Men fluistert over vreemde lichten in de vallei voorbij het bos... Onderzoek de molen eens.”', en: 'Mayor Bram strokes his grey moustache. “Finn, my boy — the fountain is running dry and the village grows uneasy. The mill pumps no water. They whisper of strange lights in the valley beyond the wood... Go and inspect the mill.”' },
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
              text: { nl: 'De raaf grist het muntje weg en kwettert een tip: “Het mólenrad is weggesleept — het ligt in de kar van de handelsman bij de kasteelpoort. Maar hij bewaakt zijn waren. In de molen ligt een toverboek; daarmee laat je een bloem dansen en leid je hem af...” Dan vliegt hij weg.', en: 'The raven snatches the coin and chatters a tip: “The mill WHEEL was hauled off — it’s in the merchant’s cart by the castle gate. But he guards his wares. In the mill lies a spellbook; with it you can make a flower dance and distract him...” Then it flies off.' }
            }
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
          name: { nl: 'Het Kaaskraampje', en: 'The Cheese Stall' },
          rect: { x: 452, y: 226, w: 100, h: 70 },
          walkTo: { x: 436, y: 306 },
          look: (state) => state.flags.gotCheese
            ? { nl: 'De kaasboer knikt tevreden achter zijn stapels gele kazen. “Smakelijk eten met dat ruiltje, jongen!”', en: 'The cheesemonger nods contentedly behind his stacks of yellow cheese. “Enjoy that trade, lad!”' }
            : { nl: 'Een kraampje vol geurige gele boerenkazen. De kaasboer wenkt: “Geld hoef ik niet, knul — maar voor een handvol vers graan ruil ik je graag een mooi stuk kaas.” (gebruik graan op het kraampje)', en: 'A stall full of fragrant yellow farmhouse cheeses. The cheesemonger beckons: “I don’t need coin, lad — but for a handful of fresh grain I’ll happily trade you a fine wedge of cheese.” (use grain on the stall)' },
          use: {
            grain: {
              consume: 'grain',
              give: 'cheese',
              setFlag: 'gotCheese',
              text: { nl: 'Je legt de handvol graan op de toonbank. De kaasboer lacht breed, weegt een fors stuk gele kaas af en drukt het je in handen. “Eerlijke ruil!”', en: 'You set the handful of grain on the counter. The cheesemonger grins, weighs out a hefty wedge of yellow cheese and presses it into your hands. “A fair trade!”' }
            }
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
      bg: 'assets/art/scene-mill.png',
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
      worldItems: [],
      npcs: [],
      fx: {},
      hotspots: [
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
      charFilter: 'sepia(0.28) saturate(1.2) brightness(1.04)',   // warm gouden binnenlicht met zonnestralen
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
            item: 'vial',
            giveText: { nl: 'Op de bovenste plank staan oude flesjes. Je neemt een leeg glazen flesje met kurk mee.', en: 'Old bottles line the top shelf. You take an empty corked glass vial.' },
            emptyText: { nl: 'De andere flesjes zijn gebarsten of vol spinrag.', en: 'The other bottles are cracked or full of cobwebs.' }
          }
        },
        {
          id: 'bookTable',
          name: { nl: 'Boek op de Tafel', en: 'Book on the Table' },
          rect: { x: 18, y: 172, w: 120, h: 42 },
          walkTo: { x: 108, y: 300 },
          look: {
            nl: 'Het opengeslagen molenaarsboek. In de kantlijn staat gekrabbeld: “De vastzittende boeken op de plank — trek ze zó los: eerst ROOD, dan BLAUW, dan GEEL, als laatste GROEN. Dan geeft de plank haar geheim.”',
            en: 'The open miller’s book. Scrawled in the margin: “The stuck books on the shelf — pull them loose in this order: first RED, then BLUE, then YELLOW, lastly GREEN. Then the shelf gives up its secret.”'
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
            hint: { nl: 'Trek de boeken in de juiste volgorde (zie het boek op de tafel).', en: 'Pull the books in the right order (see the book on the table).' },
            setFlag: 'gotSpellbook',
            gives: 'spellbook',
            sequence: ['rood', 'blauw', 'geel', 'groen'],
            books: [
              { key: 'groen', label: { nl: 'Groen', en: 'Green' }, color: '#84c06f' },
              { key: 'rood',  label: { nl: 'Rood',  en: 'Red' },   color: '#e07a64' },
              { key: 'geel',  label: { nl: 'Geel',  en: 'Yellow' },color: '#e8cc5a' },
              { key: 'blauw', label: { nl: 'Blauw', en: 'Blue' },  color: '#79ace8' }
            ],
            solvedText: { nl: 'Met een klik schiet de laatste band los en een verborgen vakje klapt open — het oude TOVERBOEK glijdt in je handen! Eén spreuk gloeit warm op: “laat wat stil staat dansen.”', en: 'With a click the last spine springs loose and a hidden compartment pops open — the old SPELLBOOK slides into your hands! One spell glows warm: “make what stands still dance.”' },
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
        { id: 'guard', sprite: 'guard', gestureSprite: 'guardGesture', x: 402, y: 218, scale: 1.40, sway: true },   // wacht iets kleiner + verder naar achter; wiegt + verzet hellebaard
        { id: 'merchant', sprite: 'merchant', x: 282, y: 298, scale: 1.18, flip: true, turnFlag: 'merchantDistracted' },   // sneaky handelsman; getemperde sprite past net als de wacht in de scènesfeer (alleen het scènefilter); kijkt standaard naar zijn kar, draait pas naar de bloem als die danst
        { id: 'ravenCart', sprite: 'ravenPerch', x: 98, y: 198, scale: 0.95, appearFlag: 'ravenFed' },   // de raaf landt op de kar en wijst het rad aan
        { id: 'flower', sprite: 'flowerWhite', x: 444, y: 264, scale: 0.42, danceFlag: 'flowerDancing' },   // (dansende) witte bloem — strak cluster, iets naar rechts, kleiner
        { id: 'flower2', sprite: 'flowerWhite', x: 428, y: 267, scale: 0.3 },   // alle bloemen wit, dicht bij elkaar
        { id: 'flower3', sprite: 'flowerWhite', x: 460, y: 267, scale: 0.29 },
        { id: 'flower4', sprite: 'flowerWhite', x: 414, y: 263, scale: 0.26 },
        { id: 'flower5', sprite: 'flowerWhite', x: 474, y: 262, scale: 0.27 }
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
            giveText: { nl: 'De handelsman staart gebiologeerd naar de dansende bloem. Snel grist je het zware ijzeren molenrad tussen de vaten vandaan en stopt het weg. Hebbes!', en: 'The merchant gawks at the dancing flower. Quickly you snatch the heavy iron mill wheel from between the barrels and stash it. Got it!' },
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
            setFlag: ['flowerDancing', 'merchantDistracted'],
            needText: { nl: 'Je voelt dat hier magie kan werken, maar je kent de spreuk nog niet. Misschien staat er iets in een toverboek...', en: 'You sense magic could work here, but you don’t know the spell yet. Perhaps a spellbook holds one...' },
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
        }
      ]
    }
  }
};
