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
  assetVer: '6',

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
    ravenPerch:    'assets/art/raven-perch.png',   // raaf op de ton (gevouwen vleugels)
    ravenFly:      'assets/art/raven-fly.png'       // raaf in vlucht (wegvliegen)
  },
  heroWalkFrames: 4,            // aantal frames in hero-walk-sheet.png (vloeiender lopen)

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
    q_raven:    { nl: 'De raaf op de ton is dol op glimmende dingen — geef hem iets', en: 'The raven on the barrel loves shiny things — give it something' },
    q_follow:   { nl: 'Volg de raaf naar de molen', en: 'Follow the raven to the mill' }
  },

  items: {
    staff: { name: { nl: 'Vaders Staf', en: 'Father’s Staff' }, icon: '🪄', img: 'assets/art/item-staff.png',
             look: { nl: 'De houten staf van mijn vader. Bovenin zit een lege vatting — er hoort een magische steen in. Zonder die steen doet de staf nog niets.', en: 'My father’s wooden staff. The top has an empty setting — a magic stone belongs there. Without the stone the staff does nothing yet.' } },
    coin: { name: { nl: 'Oud Muntje', en: 'Old Coin' }, icon: '🪙', img: 'assets/art/item-coin.png',
            look: { nl: 'Een oud, mat muntje — maar in het zonlicht glinstert het nog mooi. Precies het soort glimmend ding waar een ekster of een raaf niet van af kan blijven.', en: 'An old, dull coin — but it still glints prettily in the sunlight. Just the kind of shiny thing a magpie or raven can’t resist.' } },
    note: { name: { nl: 'Verfrommeld Briefje', en: 'Crumpled Note' }, icon: '📜', img: 'assets/art/item-note.png',
            look: { nl: '“...het rad is niet zomaar verdwenen. Volg de lichten in de vallei.”', en: '“...the wheel did not simply vanish. Follow the lights in the valley.”' } }
  },

  recipes: [],

  questRules: [
    { when: { flag: 'ravenSecret' },                        quest: null },       // het geheim is onthuld -> wordt vervolgd
    { when: { flag: 'ravenFed', notFlag: 'ravenSecret' },   quest: 'q_follow' },  // de raaf is naar de molen gevlogen
    { when: { flag: 'lookedMill', notFlag: 'ravenFed' },    quest: 'q_raven' },   // de molen zit muurvast: de raaf kan helpen
    { when: { flag: 'seenFountain' },                       quest: 'q_mill' },
    { when: {},                                             quest: 'q_explore' }
  ],

  scenes: {
    square: {
      name: { nl: 'Het Dorpsplein', en: 'The Village Square' },
      bg: 'assets/art/scene-square.png',
      charFilter: 'sepia(0.22) saturate(1.18) brightness(1.06)',   // warm ochtendlicht over de personages
      entryText: {
        nl: 'Het dorpsplein van Eldoria baadt in het ochtendlicht. De fontein klatert nog wat na, maar het water zakt zienderogen. Aan de rand staat de oude molen stil.',
        en: 'The village square of Eldoria bathes in morning light. The fountain still trickles, but the water is dropping fast. At the edge the old mill stands still.'
      },
      playerStart: { x: 300, y: 300 },
      spawnFrom: { mill: { x: 150, y: 300 } },   // terug uit de molen: bij het pad links
      depth: { far: 238, near: 318, sFar: 0.74, sNear: 1.06 },   // perspectief: kleiner naar achteren

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
        { id: 'mayor', sprite: 'mayor', x: 372, y: 264 },                    // burgemeester Bram, rechts van de fontein
        { id: 'raven', sprite: 'ravenPerch', x: 36, y: 260, scale: 1.15, hideFlag: 'ravenFed' }   // glanzende raaf op de ton (links)
      ],
      fx: {},

      hotspots: [
        {
          id: 'mayor',
          name: { nl: 'Burgemeester Bram', en: 'Mayor Bram' },
          rect: { x: 346, y: 186, w: 54, h: 80 },
          walkTo: { x: 366, y: 300 },
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
          hideFlag: 'ravenFed',                        // weg zodra hij is opgevlogen
          look: { nl: 'Een grote, glanzende raaf zit op de oude ton en houdt zijn kop scheef. Zijn kraaloogjes volgen elk glimmend ding dat je bij je hebt. Hij lijkt iets te willen ruilen...', en: 'A big glossy raven sits on the old barrel, cocking its head. Its beady eyes track every shiny thing you carry. It seems to want a trade...' },
          use: {
            coin: {
              consume: 'coin',
              setFlag: 'ravenFed',
              text: { nl: 'Je houdt het muntje omhoog. De raaf grist het bliksemsnel uit je hand, krast tevreden — en vliegt met klepperende vleugels op, recht naar de oude molen aan de rand van het dorp. Volg hem!', en: 'You hold up the coin. The raven snatches it in a flash, caws with delight — and beats its wings, flying straight to the old mill at the edge of the village. Follow it!' }
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
          name: { nl: 'Iets Glimmends', en: 'Something Shiny' },
          rect: { x: 58, y: 294, w: 64, h: 24 },
          walkTo: { x: 95, y: 306 },
          gives: {
            item: 'coin',
            giveText: { nl: 'Tussen de keien glinstert een oud muntje. Je steekt het in je tas.', en: 'An old coin glints between the cobbles. You pocket it.' },
            emptyText: { nl: 'Niets meer tussen de keien hier.', en: 'Nothing more between the cobbles here.' }
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
          rect: { x: 48, y: 80, w: 124, h: 220 },
          walkTo: { x: 118, y: 300 },
          arrow: { x: 96, y: 232, dir: 'up' },
          exit: { to: 'mill', travelText: { nl: 'Je volgt het pad naar de oude molen aan de rand van het dorp...', en: 'You follow the path to the old mill at the edge of the village...' } }
        }
      ]
    },

    mill: {
      name: { nl: 'De Oude Molen', en: 'The Old Mill' },
      bg: 'assets/art/scene-mill.png',
      charFilter: 'sepia(0.26) saturate(1.18) brightness(1.05)',   // warm gouden molenlicht
      entryText: {
        nl: 'De oude molen op de heuvel. De wieken staan stil en het waterrad aan de zijkant beweegt niet. Hier moet het misgaan met de waterbron.',
        en: 'The old mill on the hill. The sails are still and the water wheel on its side does not turn. This must be where the water source fails.'
      },
      playerStart: { x: 300, y: 300 },
      depth: { far: 250, near: 316, sFar: 0.78, sNear: 1.05 },   // perspectief: kleiner naar achteren
      walkable: [
        { x: 70, y: 250, w: 430, h: 66 }    // het pad / voorgrond vóór de molen
      ],
      obstacles: [],
      overlays: [],
      worldItems: [],
      npcs: [
        { id: 'ravenMill', sprite: 'ravenPerch', x: 132, y: 246, scale: 1.1, appearFlag: 'ravenFed' }   // de raaf is hierheen gevlogen
      ],
      fx: {},
      hotspots: [
        {
          id: 'wheel',
          name: { nl: 'Het Waterrad', en: 'The Water Wheel' },
          rect: { x: 206, y: 150, w: 150, h: 110 },
          walkTo: { x: 284, y: 300 },
          look: {
            nl: 'Het grote waterrad zit muurvast — de as is verbogen en er ontbreekt een stuk. Zo komt het water nooit naar het dorp. Misschien weet iemand in de vallei raad... men sprak van vreemde lichten.',
            en: 'The great water wheel is jammed — the axle is bent and a piece is missing. The water will never reach the village like this. Maybe someone in the valley knows... they spoke of strange lights.'
          },
          setFlag: 'lookedMill'
        },
        {
          id: 'ravenSecret',
          name: { nl: 'De Raaf', en: 'The Raven' },
          rect: { x: 104, y: 214, w: 56, h: 46 },
          walkTo: { x: 150, y: 300 },
          appearFlag: 'ravenFed',                      // pas hier zodra de raaf is gevoerd
          look: (state) => state.flags.ravenSecret
            ? { nl: 'De raaf zit naast de smalle doorgang en wacht. Achter de losgewipte steen gloeit het zwakke blauwe licht — de weg naar de vallei der runen.', en: 'The raven waits beside the narrow passage. Behind the loosened stone the faint blue light glows — the way to the valley of runes.' }
            : { nl: 'De raaf wipt naar de voet van de molen en pikt aan een losse steen tot die wegkantelt. Daarachter: een smalle, donkere doorgang waar een flauw blauw licht uit gloeit — dezelfde lichten waar het briefje en de burgemeester over spraken. De weg naar de vallei der runen ligt open.', en: 'The raven hops to the foot of the mill and pecks at a loose stone until it tips away. Behind it: a narrow, dark passage glowing with faint blue light — the very lights the note and the mayor spoke of. The way to the valley of runes lies open.' },
          setFlag: 'ravenSecret'
        },
        {
          id: 'toSquare',
          name: { nl: 'Terug naar het Dorp', en: 'Back to the Village' },
          rect: { x: 24, y: 268, w: 120, h: 48 },
          walkTo: { x: 86, y: 300 },
          arrow: { x: 64, y: 300, dir: 'down' },
          exit: { to: 'square', travelText: { nl: 'Je loopt terug het dorp in.', en: 'You head back into the village.' } }
        }
      ]
    }
  }
};
