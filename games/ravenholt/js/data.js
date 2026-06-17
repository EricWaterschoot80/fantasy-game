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
  assetVer: '13',

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
    guardGesture:  'assets/art/guard-gesture.png'   // wacht verzet zijn hellebaard (af en toe)
  },
  heroWalkFrames: 4,            // aantal frames in hero-walk-sheet.png (vloeiender lopen)
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
    q_castle:   { nl: 'Volg het pad naar de kasteelpoort van Eldoria', en: 'Follow the path to the castle gate of Eldoria' },
    q_gate:     { nl: 'Maak het poortradwerk: plaats de 5 radjes juist', en: 'Fix the gate gearworks: place the 5 gears correctly' }
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
             look: { nl: 'Een handvol goudgeel graan uit de zak. Misschien lust een hongerig dier het wel.', en: 'A handful of golden grain from the sack. A hungry animal might like it.' } }
  },

  recipes: [],

  questRules: [
    { when: { flag: 'gateOpen' },           quest: null },         // poortradwerk opgelost -> wordt vervolgd
    { when: { flag: 'visited_castle' },     quest: 'q_gate' },     // bij het kasteel: maak het radwerk
    { when: { flag: 'visited_millInside' }, quest: 'q_castle' },   // binnen geweest -> ga naar het kasteel
    { when: { flag: 'lookedMill' },         quest: 'q_inside' },   // rad zit vast: zoek binnen
    { when: { flag: 'seenFountain' },       quest: 'q_mill' },
    { when: {},                             quest: 'q_explore' }
  ],

  scenes: {
    square: {
      name: { nl: 'Het Dorpsplein', en: 'The Village Square' },
      bg: 'assets/art/scene-square.png',
      charFilter: 'sepia(0.46) saturate(0.95) brightness(1.06)',   // warm-gouden opkomende zon, geeliger
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
        { x: 150, y: 214, w: 116, h: 66 }    // de fontein-bak (niet doorheen lopen)
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
              text: { nl: 'Je houdt het muntje omhoog. De raaf grist het bliksemsnel uit je hand en krast drie keer. Dan tikt hij met zijn snavel een richting uit — naar de oude molen — en kwettert iets wat klinkt als: “Het water stokt bínnen, niet buiten...” Met klepperende vleugels vliegt hij weg over de daken.', en: 'You hold up the coin. The raven snatches it in a flash and caws three times. Then it taps its beak toward the old mill and chatters something that sounds like: “The water stops inside, not outside...” With clattering wings it flies off over the rooftops.' }
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
      charFilter: 'sepia(0.46) saturate(0.95) brightness(1.06)',   // warm-gouden opkomende zon, geeliger
      entryText: {
        nl: 'De oude molen op de heuvel. De wieken staan stil en het waterrad aan de zijkant beweegt niet. De deur staat op een kier — hier moet het misgaan met de waterbron.',
        en: 'The old mill on the hill. The sails are still and the water wheel on its side does not turn. The door stands ajar — this must be where the water source fails.'
      },
      playerStart: { x: 300, y: 300 },
      spawnFrom: { millInside: { x: 280, y: 300 }, castle: { x: 96, y: 300 } },   // terug uit de molen / van het kasteel-pad
      depth: { far: 250, near: 316, sFar: 0.62, sNear: 1.06 },   // perspectief: duidelijk kleiner naar achteren
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
      charFilter: 'sepia(0.42) saturate(0.95) brightness(1.04)',   // warm gouden binnenlicht met zonnestralen
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
          look: {
            nl: 'Het grote houten tandrad dat het waterrad buiten aandrijft. Tussen de tanden zit een afgebroken stuk hout geklemd — dáár loopt het vast. Met het juiste gereedschap zou je het kunnen losmaken... maar dat heb je nog niet.',
            en: 'The big wooden gear that drives the water wheel outside. A broken piece of wood is wedged between the teeth — that is what jams it. With the right tool you could pry it free... but you don’t have one yet.'
          },
          setFlag: 'foundJam'
        },
        {
          id: 'vial',
          name: { nl: 'Stoffige Flesjes', en: 'Dusty Bottles' },
          rect: { x: 14, y: 60, w: 104, h: 96 },
          walkTo: { x: 96, y: 300 },
          gives: {
            item: 'vial',
            giveText: { nl: 'Op de stoffige plank staan oude flesjes. Je neemt een leeg glazen flesje met kurk mee.', en: 'Old bottles line the dusty shelf. You take an empty corked glass vial.' },
            emptyText: { nl: 'De andere flesjes zijn gebarsten of vol spinrag.', en: 'The other bottles are cracked or full of cobwebs.' }
          }
        },
        {
          id: 'book',
          name: { nl: 'Het Molenaarsboek', en: 'The Miller’s Book' },
          rect: { x: 18, y: 166, w: 128, h: 50 },
          walkTo: { x: 108, y: 300 },
          gives: {
            item: 'book',
            giveText: { nl: 'Een opengeslagen molenaarsboek ligt op de tafel. Tekeningen van het rad en een kruisje bij een grot in de vallei: “de blauwe steen drijft het rad weer aan.” Je neemt het boek mee.', en: 'An open miller’s book lies on the table. Drawings of the wheel and a cross at a cave in the valley: “the blue stone drives the wheel again.” You take the book.' },
            emptyText: { nl: 'Verder ligt er niets bruikbaars op de tafel.', en: 'Nothing else useful lies on the table.' }
          },
          setFlag: 'readMillBook'
        },
        {
          id: 'grain',
          name: { nl: 'Graanzak', en: 'Grain Sack' },
          rect: { x: 296, y: 224, w: 116, h: 80 },
          walkTo: { x: 344, y: 300 },
          gives: {
            item: 'grain',
            giveText: { nl: 'Een opengevallen zak graan staat bij de maalsteen. Je schept een handvol goudgeel graan in je tas.', en: 'An open sack of grain stands by the millstone. You scoop a handful of golden grain into your bag.' },
            emptyText: { nl: 'De zak is bijna leeg; de rest laat je liggen.', en: 'The sack is nearly empty; you leave the rest.' }
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
      charFilter: 'sepia(0.46) saturate(0.95) brightness(1.06)',   // zelfde warme ochtendzon
      entryText: {
        nl: 'De poort van kasteel Eldoria, aan het einde van de brug. Een handkar vol vaten en kruiken staat verlaten bij de muur. Het poortmechaniek — een radwerk van tandwielen — is uit elkaar gevallen, zodat de poort niet opengaat.',
        en: 'The gate of castle Eldoria, at the end of the bridge. A handcart full of barrels and jugs stands abandoned by the wall. The gate mechanism — a clockwork of gears — has fallen apart, so the gate will not open.'
      },
      playerStart: { x: 300, y: 300 },
      depth: { far: 250, near: 316, sFar: 0.62, sNear: 1.06 },
      walkable: [
        { x: 120, y: 256, w: 400, h: 60 },   // de geplaveide weg vóór de poort
        { x: 330, y: 214, w: 130, h: 102 }   // pad omhoog naar de poort (zodat je naar de wacht kunt lopen)
      ],
      obstacles: [],
      overlays: [],
      worldItems: [],
      npcs: [
        { id: 'guard', sprite: 'guard', gestureSprite: 'guardGesture', x: 398, y: 244, scale: 1.45 }   // poortwacht verder naar achter ín de poort; verzet af en toe zijn hellebaard
      ],
      fx: {},
      hotspots: [
        {
          id: 'guard',
          name: { nl: 'De Poortwacht', en: 'The Gate Guard' },
          rect: { x: 368, y: 168, w: 68, h: 110 },
          walkTo: { x: 388, y: 286 },
          face: 'assets/art/face-guard.png',
          look: (state) => state.flags.gateOpen
            ? { nl: 'De wacht plant zijn hellebaard steviger neer. “Het radwerk draait weer, knul — knap werk. Maar hier kom je niet door. Bevel van de hofmaarschalk: niemand het kasteel in zonder zegel.” (wordt vervolgd)', en: 'The guard plants his halberd firmer. “The gearworks turns again, lad — fine work. But you don’t pass here. Steward’s orders: no one enters the castle without a seal.” (to be continued)' }
            : { nl: 'Een strenge poortwacht in een blauw tabbaard verspert de weg. “Halt. Het kasteel is gesloten zolang de bron droog staat — en die poort krijg je toch niet open: het radwerk ernaast is kapot.” Hij knikt naar het mechaniek naast de poort.', en: 'A stern guard in a blue tabard blocks the way. “Halt. The castle is closed while the spring runs dry — and you won’t open that gate anyway: the gearworks beside it is broken.” He nods at the mechanism beside the gate.' },
          setFlag: 'metGuard'
        },
        {
          id: 'cart',
          name: { nl: 'De Handkar', en: 'The Handcart' },
          rect: { x: 20, y: 168, w: 184, h: 120 },
          walkTo: { x: 168, y: 300 },
          look: {
            nl: 'Een verlaten handkar vol vaten en kruiken, op een groot houten wiel. Hiermee brachten ze vroeger water en graan naar het kasteel — tot de bron opdroogde.',
            en: 'An abandoned handcart full of barrels and jugs, on a big wooden wheel. They used to haul water and grain to the castle with it — until the spring ran dry.'
          },
          setFlag: 'sawCart'
        },
        {
          id: 'bridgeGears',
          name: { nl: 'Het Poortradwerk', en: 'The Gate Gearworks' },
          rect: { x: 300, y: 96, w: 150, h: 176 },
          walkTo: { x: 372, y: 300 },
          gears: {
            title: { nl: 'Het Poortradwerk', en: 'The Gate Gearworks' },
            hint: { nl: 'Sleep de 5 radjes naar de juiste plek (op maat) zodat ze precies in elkaar grijpen.', en: 'Drag the 5 gears to the right spots (by size) so they mesh perfectly.' },
            setFlag: 'gateOpen',
            solvedText: { nl: 'De radjes grijpen in elkaar en beginnen te draaien — kettingen ratelen en het zware poortmechaniek komt knarsend tot leven. De weg dieper Eldoria in gaat bijna open... (wordt vervolgd)', en: 'The gears mesh and begin to turn — chains rattle and the heavy gate mechanism grinds to life. The way deeper into Eldoria is about to open... (to be continued)' }
          },
          look: {
            nl: 'Het radwerk draait nu soepel; het poortmechaniek zoemt zacht na. (wordt vervolgd)',
            en: 'The gearworks turns smoothly now; the gate mechanism hums. (to be continued)'
          }
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
