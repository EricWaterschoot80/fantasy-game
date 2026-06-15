/* ============================================================
   data.js — ALLE spelinhoud van "De Amulet van Emberfall"
   Tweetalig: elke tekst is {nl, en}; de engine kiest via L().
   Coördinaten zijn scene-pixels (568×320, liggend).
   walkTo    = waar de speler heen loopt vóór de actie
   speaker   = ankerpunt tekstballon
   fx        = sfeer-effecten bovenop de scene-art
   puzzles   = volgorde-puzzels (hotspot.puzzleKey)
   obstacles = niet-beloopbare vlakken (muren, zuilen, props)
   overlays  = stukken achtergrond die VOOR het karakter vallen
   worldItems= items die je subtiel ziet liggen tot je ze pakt
   ============================================================ */

const GAME = {
  title: { nl: 'De Amulet van Emberfall', en: 'The Amulet of Emberfall' },
  titleLines: {
    nl: ['De Amulet', 'van Emberfall'],
    en: ['The Amulet', 'of Emberfall']
  },
  startScene: 'courtyard',
  assetVer: '18',

  /* Sprite-register: NPC's verwijzen via hun sprite-naam naar deze paden. */
  sprites: {
    hero:           'assets/art/hero.png',
    heroWalk:       'assets/art/hero-walk.png',
    heroWave:       'assets/art/hero-wave.png',
    seer:           'assets/art/seer.png',
    minotaur:       'assets/art/minotaur.png',
    minotaurAsleep: 'assets/art/minotaur-asleep.png',
    dog:            'assets/art/dog.png',
    dogCold:        'assets/art/dog-cold.png',
    dogVest:        'assets/art/dog-vest.png',
    chestOpen:      'assets/art/chest-open.png',
    gateDoor:       'assets/art/gate-door.png',
    wallTorch:      'assets/art/torch-lit.png'
  },

  winText: {
    nl: 'Met de Amulet van Emberfall veilig om je hals breekt warm gouden licht ' +
        'door het wolkendek. De eeuwige herfst laat haar greep los — het rijk ' +
        'zal weer seizoenen kennen. Jouw naam wordt gefluisterd tussen de bladeren.',
    en: 'With the Amulet of Emberfall safe around your neck, warm golden light ' +
        'breaks through the clouds. The endless autumn loosens its grip — the ' +
        'realm will know seasons again. Your name is whispered among the leaves.'
  },

  strings: {
    noEffect:    { nl: 'Dat werkt hier niet.', en: 'That doesn’t work here.' },
    noCombine:   { nl: 'Die twee laten zich niet combineren.', en: 'Those two don’t combine.' },
    nothingThere:{ nl: 'Daar valt niets te ontdekken.', en: 'There’s nothing to find there.' }
  },

  /* UI-teksten voor de engine */
  ui: {
    subtitle:    { nl: 'Een point-and-click avontuur', en: 'A point-and-click adventure' },
    intro:       { nl: 'Het is voor altijd herfst geworden in het rijk Emberfall. De amulet is gestolen en wordt bewaakt door een minotaur. Geen zwaard velt hem. Enkel list.',
                   en: 'Autumn has become eternal in the realm of Emberfall. The amulet was stolen and is guarded by a minotaur. No sword can fell him. Only cunning.' },
    credit:      { nl: 'Gemaakt voor Sandra', en: 'Made for Sandra' },
    startBtn:    { nl: 'Begin het avontuur', en: 'Begin the adventure' },
    winTitle:    { nl: 'Emberfall is Gered', en: 'Emberfall is Saved' },
    replayBtn:   { nl: 'Opnieuw spelen', en: 'Play again' },
    deathTitle:  { nl: 'Verslagen...', en: 'Defeated...' },
    deathText:   { nl: 'De minotaur verloor zijn geduld. Met één machtige zwaai word je de tempel uit geslingerd. Gelukkig krabbel je buiten weer overeind.',
                   en: 'The minotaur lost his patience. With one mighty swing you are hurled out of the temple. Luckily, you scramble back to your feet outside.' },
    retryBtn:    { nl: 'Probeer opnieuw', en: 'Try again' },
    rotateTitle: { nl: 'Draai je telefoon', en: 'Rotate your phone' },
    rotateText:  { nl: 'Dit avontuur speelt liggend. Draai je scherm een kwartslag.',
                   en: 'This adventure plays in landscape. Turn your screen sideways.' },
    tapContinue: { nl: 'tik om verder te gaan ▸', en: 'tap to continue ▸' },
    selected:    { nl: 'geselecteerd', en: 'selected' },
    homeConfirm: { nl: 'Terug naar de homepagina? Je voortgang gaat verloren.', en: 'Back to the homepage? Your progress will be lost.' },
    q_explore:   { nl: 'Verken de binnenplaats', en: 'Explore the courtyard' },
    q_water:     { nl: 'Zoek iets om water mee te scheppen — volg het westpad', en: 'Find something to scoop water — follow the west path' },
    q_runes:     { nl: 'Tik de runenstenen in de juiste volgorde aan', en: 'Tap the rune stones in the right order' },
    q_chest:     { nl: 'Open de stenen kist in het bos', en: 'Open the stone chest in the grove' },
    q_fill:      { nl: 'Vul het flesje bij het altaar', en: 'Fill the vial at the altar' },
    q_berries:   { nl: 'Pluk rode bessen tussen de struiken', en: 'Pick red berries from the bushes' },
    q_combine:   { nl: 'Combineer de bessen met het water in je tas', en: 'Combine the berries with the water in your bag' },
    q_pour:      { nl: 'Giet de slaapdrank in de stenen schaal', en: 'Pour the sleeping draught into the stone bowl' },
    q_torch:     { nl: 'Het is aardedonker — verzamel een vuursteen (binnenplaats) en droog hout (bos)', en: 'It’s pitch dark — gather a flint (courtyard) and dry wood (grove)' },
    q_makeTorch: { nl: 'Combineer de vuursteen en het hout in je tas tot een fakkel', en: 'Combine the flint and the wood in your bag into a torch' },
    q_lightTorch:{ nl: 'Steek met de fakkel de toortsen bij de minotaur aan', en: 'Light the braziers by the minotaur with your torch' },
    q_ward:      { nl: 'Een laatste ward: laat het water naar de amulet stromen', en: 'A final ward: make the water flow to the amulet' },
    q_gate:      { nl: 'Los het embleem-raadsel op om de poort te openen', en: 'Solve the emblem riddle to open the gate' },
    q_riddle:    { nl: 'Het hondje heeft het koud — de ziener weet vast raad', en: 'The puppy is freezing — the seer may know what to do' },
    q_vest:      { nl: 'Geef het hondje zijn warme vestje', en: 'Give the puppy its warm vest' },
    q_powder:    { nl: 'Strooi het magische poeder op het mossige tablet', en: 'Sprinkle the magic powder on the mossy tablet' },
    q_amulet:    { nl: 'Pak de amulet van het altaar', en: 'Take the amulet from the altar' }
  },

  /* Questhint-regels — eerste match wint; quest:null verbergt de hint.
     De engine leest dit generiek (zie condMet/questKey). */
  questRules: [
    { when: { flag: 'taken_temple_shrine' },                        quest: null },
    { when: { flag: 'minotaurAsleep', notFlag: 'wardLifted' },      quest: 'q_ward' },
    { when: { flag: 'minotaurAsleep' },                             quest: 'q_amulet' },
    { when: { flag: 'visited_temple', notFlag: 'torchLit', has: 'torch' },           quest: 'q_lightTorch' },
    { when: { flag: 'visited_temple', notFlag: 'torchLit', has: ['flint', 'wood'] }, quest: 'q_makeTorch' },
    { when: { flag: 'visited_temple', notFlag: 'torchLit' },                          quest: 'q_torch' },
    { when: { has: 'potion', notFlag: 'gateOpen' },                 quest: 'q_gate' },
    { when: { has: 'potion' },                                      quest: 'q_pour' },
    { when: { has: ['vialWater', 'berries'] },                      quest: 'q_combine' },
    { when: { has: 'vialWater' },                                   quest: 'q_berries' },
    { when: { has: 'vialEmpty' },                                   quest: 'q_fill' },
    { when: { flag: 'runesSolved' },                                quest: 'q_chest' },
    { when: { flag: 'runesRevealed' },                              quest: 'q_runes' },
    { when: { has: 'powder' },                                      quest: 'q_powder' },
    { when: { flag: 'visited_grove', notFlag: 'dogWarm', has: 'vest' }, quest: 'q_vest' },
    { when: { flag: 'visited_grove', notFlag: 'dogWarm' },          quest: 'q_riddle' },
    { when: { flag: 'visited_grove' },                              quest: 'q_runes' },
    { when: { has: 'berries' },                                     quest: 'q_water' },
    { when: {},                                                     quest: 'q_explore' }
  ],

  items: {
    berries:   { name: { nl: 'Rode Bessen', en: 'Red Berries' },     icon: '🍒', img: 'assets/art/item-berries.png' },
    vialEmpty: { name: { nl: 'Leeg Flesje', en: 'Empty Vial' },      icon: '🍶', img: 'assets/art/item-vial-empty.png' },
    vialWater: { name: { nl: 'Flesje Water', en: 'Vial of Water' },  icon: '💧', img: 'assets/art/item-vial-water.png' },
    potion:    { name: { nl: 'Slaapdrank', en: 'Sleeping Draught' }, icon: '🧪', img: 'assets/art/item-potion.png' },
    amulet:    { name: { nl: 'Amulet van Emberfall', en: 'Amulet of Emberfall' }, icon: '🍁', img: 'assets/art/item-amulet.png' },
    vest:      { name: { nl: 'Rood Vestje', en: 'Red Vest' }, icon: '🧥', img: 'assets/art/item-vest.png' },
    powder:    { name: { nl: 'Magisch Poeder', en: 'Magic Powder' }, icon: '✨', img: 'assets/art/item-powder.png' },
    flint:     { name: { nl: 'Vuursteen', en: 'Flint' }, icon: '🪨', img: 'assets/art/item-flint.png',
                 noUseText: { nl: 'Hier heb ik geen vuur nodig.', en: 'I don’t need fire here.' } },
    wood:      { name: { nl: 'Stuk Hout', en: 'Piece of Wood' }, icon: '🪵', img: 'assets/art/item-wood.png',
                 noUseText: { nl: 'Hier heb ik geen vuur nodig.', en: 'I don’t need fire here.' } },
    torch:     { name: { nl: 'Brandende Fakkel', en: 'Lit Torch' }, icon: '🔥', img: 'assets/art/torch-lit.png',
                 noUseText: { nl: 'Hier hoef ik niets aan te steken.', en: 'Nothing to light here.' } }
  },

  recipes: [
    {
      a: 'berries', b: 'vialWater', result: 'potion',
      text: {
        nl: 'Je kneust de Rode Bessen in het regenwater. Het brouwsel kleurt diep en geurt zoet — een Slaapdrank.',
        en: 'You crush the Red Berries into the rainwater. The brew turns deep red and smells sweet — a Sleeping Draught.'
      }
    },
    {
      a: 'flint', b: 'wood', result: 'torch',
      text: {
        nl: 'Je wikkelt droog mos om het hout en slaat vonken met de vuursteen — het hout vat vlam. Je hebt een Brandende Fakkel.',
        en: 'You wrap dry moss around the wood and strike sparks with the flint — the wood catches. You now hold a Lit Torch.'
      }
    }
  ],

  scenes: {

    /* ---------- Scene 1: De Verlaten Binnenplaats ---------- */
    courtyard: {
      name: { nl: 'De Verlaten Binnenplaats', en: 'The Forsaken Courtyard' },
      bg: 'assets/art/scene-courtyard.png',
      bgVariants: [
        { img: 'assets/art/scene-courtyard-closed.png', notFlag: 'gateOpen' }
      ],
      entryText: {
        nl: 'Een binnenplaats van zandsteen, overwoekerd door rode herfststruiken.',
        en: 'A sandstone courtyard, overgrown with red autumn bushes.'
      },
      playerStart: { x: 300, y: 260 },
      spawnFrom: {
        temple: { x: 452, y: 182 },
        grove: { x: 168, y: 230 }
      },
      /* Loopgebied volgt de echte zandvloer (veelhoek, scene-pixels) */
      walkPoly: [
        [122, 206], [150, 192], [180, 188], [292, 186], [330, 162],
        [432, 158], [482, 186], [474, 214], [430, 250], [388, 282],
        [250, 288], [165, 252], [122, 232]
      ],
      obstacles: [
        { x: 172, y: 100, w: 122, h: 86 }   // fontein/altaartrog (basis op ~y186)
      ],
      /* Geen losse voorgrond-overlays meer: de gedetailleerde achtergrond bevat de
         struiken/puin al, en de hoeken zijn niet-beloopbaar (voorkomt naad/dubbeling). */
      overlays: [],
      worldItems: [
        { item: 'berries', hotspot: 'bushes', x: 140, y: 262 }
      ],
      npcs: [
        { id: 'seer', sprite: 'seer', x: 285, y: 205,
          wander: { x: 245, y: 180, w: 85, h: 45, speed: 22, pauseMin: 2500, pauseMax: 7000 } }
      ],
      fx: {
        emblemGlow: { x: 348, y: 71, r: 22 },
        fountain: { sx: 225, sy: 117, wx: 228, wy: 138 },
        birds: { n: 1, scale: 2, y: 46, yvar: 40, period: 16000, frac: 0.4, bob: 9 }
      },
      hotspots: [
        {
          id: 'altar',
          name: { nl: 'Verweerd Altaar', en: 'Weathered Altar' },
          rect: { x: 162, y: 84, w: 106, h: 76 },
          walkTo: { x: 233, y: 202 },
          look: {
            nl: 'Een verweerd altaar. In de uitgesleten trog heeft zich regenwater verzameld. Inscriptie: “Wat de woede van het beest sust, groeit rood tussen de stenen.”',
            en: 'A weathered altar. Rainwater has gathered in its worn trough. An inscription reads: “What soothes the beast’s fury grows red among the stones.”'
          },
          use: {
            vialEmpty: {
              consume: 'vialEmpty',
              give: 'vialWater',
              text: { nl: 'Je schept helder regenwater in het flesje.', en: 'You scoop clear rainwater into the vial.' }
            },
            vialWater: { text: { nl: 'Je flesje is al vol.', en: 'Your vial is already full.' } }
          }
        },
        {
          id: 'emblem',
          name: { nl: 'Gouden Embleem', en: 'Golden Emblem' },
          rect: { x: 318, y: 40, w: 60, h: 60 },
          walkTo: { x: 348, y: 176 },
          slidePuzzle: {
            img: 'assets/art/emblem-puzzle.png',
            size: 3,
            setFlag: 'gateOpen',
            title: { nl: 'Het Embleem van de Orde', en: 'The Emblem of the Order' },
            solvedText: {
              nl: 'Het embleem klikt op zijn plaats en begint fel te stralen. Met een diep gerommel schuift de stenen poortdeur open!',
              en: 'The emblem clicks into place and blazes brightly. With a deep rumble, the stone gate slides open!'
            },
            burst: { x: 449, y: 110 }
          },
          look: {
            nl: 'Het embleem straalt rustig. De poort ernaast staat open.',
            en: 'The emblem shines calmly. The gate beside it stands open.'
          }
        },
        {
          id: 'seer',
          name: { nl: 'De Ziener', en: 'The Seer' },
          rect: { x: 260, y: 146, w: 50, h: 62 },
          followNpc: 'seer',
          speaker: true,
          riddle: {
            setFlag: 'riddleSolved',
            requiresFlag: 'visited_grove',
            reward: 'vest',
            title: { nl: 'De Proef van de Ziener', en: 'The Seer’s Trial' },
            intro: {
              nl: '“Het bibberende hondje, zeg je? Drie raadsels stel ik je. Eén fout, en we beginnen opnieuw...”',
              en: '“The shivering puppy, you say? Three riddles I shall pose. One mistake, and we start anew...”'
            },
            questions: [
              {
                q: {
                  nl: 'Raadsel 1: “Ik val zonder te springen, ik dans zonder benen, en in de herfst ben ik koning. Wat ben ik?”',
                  en: 'Riddle 1: “I fall without jumping, I dance without legs, and in autumn I am king. What am I?”'
                },
                answers: [
                  { t: { nl: 'Een blad', en: 'A leaf' }, ok: true },
                  { t: { nl: 'De regen', en: 'The rain' }, ok: false },
                  { t: { nl: 'De schaduw', en: 'The shadow' }, ok: false }
                ]
              },
              {
                q: {
                  nl: 'Raadsel 2: “Ik heb geen mond en toch fluister ik door de bomen. Ik heb geen handen en toch strooi ik de bladeren. Wie ben ik?”',
                  en: 'Riddle 2: “I have no mouth, yet I whisper through the trees. I have no hands, yet I scatter the leaves. Who am I?”'
                },
                answers: [
                  { t: { nl: 'De wind', en: 'The wind' }, ok: true },
                  { t: { nl: 'Een geest', en: 'A ghost' }, ok: false },
                  { t: { nl: 'De rivier', en: 'The river' }, ok: false }
                ]
              },
              {
                q: {
                  nl: 'Raadsel 3: “Hoe meer je van mij wegneemt, hoe groter ik word. Wat ben ik?”',
                  en: 'Riddle 3: “The more you take away from me, the bigger I become. What am I?”'
                },
                answers: [
                  { t: { nl: 'Een gat', en: 'A hole' }, ok: true },
                  { t: { nl: 'De honger', en: 'Hunger' }, ok: false },
                  { t: { nl: 'De stilte', en: 'The silence' }, ok: false }
                ]
              }
            ],
            wrongText: {
              nl: '“Nee. Eén fout is genoeg — de proef begint opnieuw. Luister beter...”',
              en: '“No. One mistake is enough — the trial begins anew. Listen more closely...”'
            },
            solvedText: {
              nl: '“Drie van drie. Wijs geantwoord.” De ziener haalt een klein rood vestje uit zijn gewaad. “Voor de kleine bibberaar bij de kist.”',
              en: '“Three of three. Wisely answered.” The seer draws a small red vest from his robe. “For the little shiverer by the chest.”'
            }
          },
          look: {
            nl: 'De gehulde ziener fluistert: “Voorbij de poort waakt de minotaur. Geen zwaard velt hem — enkel slaap. Hij drinkt uit de stenen schaal in de tempel wanneer niemand kijkt.”',
            en: 'The hooded seer whispers: “Beyond the gate the minotaur keeps watch. No sword can fell him — only sleep. He drinks from the stone bowl in the temple when no one is looking.”'
          }
        },
        {
          id: 'bushes',
          name: { nl: 'Rode Struiken', en: 'Red Bushes' },
          rect: { x: 0, y: 170, w: 176, h: 150 },
          walkTo: { x: 178, y: 244 },
          gives: {
            item: 'berries',
            giveText: { nl: 'Tussen de rode struiken pluk je een handvol Rode Bessen.', en: 'Among the red bushes you pick a handful of Red Berries.' },
            emptyText: { nl: 'De struiken zijn nu kaal geplukt.', en: 'The bushes have been picked bare.' }
          }
        },
        {
          id: 'rubble',
          name: { nl: 'Brokstukken', en: 'Rubble' },
          rect: { x: 384, y: 208, w: 184, h: 112 },
          walkTo: { x: 370, y: 252 },
          gives: {
            item: 'flint',
            giveText: {
              nl: 'Tussen de stenen vind je een scherpe Vuursteen — daar maak je vonken mee. Een gebroken wegwijzer wijst: “De Bron van de Orde — via het westpad.”',
              en: 'Among the stones you find a sharp Flint — good for striking sparks. A broken signpost points: “The Well of the Order — by the west path.”'
            },
            emptyText: {
              nl: 'Alleen nog puin en de gebroken wegwijzer: “De Bron van de Orde — via het westpad.”',
              en: 'Only rubble now, and the broken signpost: “The Well of the Order — by the west path.”'
            }
          }
        },
        {
          id: 'toGrove',
          name: { nl: 'Doorgang naar het Bos', en: 'Passage to the Grove' },
          rect: { x: 104, y: 100, w: 56, h: 110 },
          walkTo: { x: 142, y: 202 },
          arrow: { x: 132, y: 120, dir: 'up' },
          exit: {
            to: 'grove',
            travelText: { nl: 'Je glipt door de doorgang het herfstbos in...', en: 'You slip through the passage into the autumn grove...' }
          }
        },
        {
          id: 'toTemple',
          name: { nl: 'Poort naar de Tempel', en: 'Gate to the Temple' },
          rect: { x: 416, y: 46, w: 74, h: 112 },
          walkTo: { x: 452, y: 174 },
          arrow: { x: 452, y: 130, dir: 'up' },
          requiresFlag: 'gateOpen',
          blockedText: {
            nl: 'De stenen poortdeur zit muurvast. Het gouden embleem ernaast gloeit veelbetekenend...',
            en: 'The stone gate is sealed shut. The golden emblem beside it glows meaningfully...'
          },
          exit: {
            to: 'temple',
            travelText: { nl: 'Je stapt door de poort, het pad naar de tempel op...', en: 'You step through the gate, onto the temple path...' }
          }
        }
      ]
    },

    /* ---------- Scene 2: Het Runenbos (puzzel) ---------- */
    grove: {
      name: { nl: 'Het Runenbos', en: 'The Rune Grove' },
      bg: 'assets/art/scene-grove.png',
      bgVariants: [
        { img: 'assets/art/scene-grove-lit.png', flag: 'runesRevealed' }
      ],
      entryText: {
        nl: 'Een verborgen open plek. Drie runenstenen zoemen zacht tussen de herfstbomen.',
        en: 'A hidden clearing. Three rune stones hum softly among the autumn trees.'
      },
      playerStart: { x: 505, y: 205 },
      spawnFrom: { courtyard: { x: 505, y: 205 } },
      /* Loopgebied volgt de open plek (veelhoek, scene-pixels) */
      walkPoly: [
        [150, 188], [345, 184], [450, 189], [500, 194], [523, 203], [523, 231],
        [486, 255], [380, 286], [235, 288], [180, 270], [192, 236], [140, 210], [135, 194]
      ],
      obstacles: [
        { x: 366, y: 150, w: 88, h: 32 },    // sokkel van de kist
        { x: 82, y: 224, w: 104, h: 76 }     // kleitablet
      ],
      overlays: [],
      worldItems: [
        { item: 'vialEmpty', hotspot: 'chest', x: 412, y: 120, requiresFlag: 'runesSolved' },
        { item: 'wood', hotspot: 'branch', x: 256, y: 250 }
      ],
      npcs: [
        { id: 'dog', sprite: 'dog', x: 415, y: 198, facesLeft: true, wanderRequiresFlag: 'dogWarm',
          wander: { x: 180, y: 200, w: 200, h: 58, speed: 48, pauseMin: 1500, pauseMax: 4500 } }
      ],
      puzzles: {
        runes: {
          sequence: ['leaf', 'sun', 'moon'],
          setFlag: 'runesSolved',
          requiresFlag: 'runesRevealed',
          revealFlag: 'runesRevealed',
          blockedText: {
            nl: 'De runen blijven dof; je kent de juiste volgorde nog niet. Het mossige tablet hiernaast lijkt een aanwijzing te verbergen.',
            en: 'The runes stay dull; you don’t know the right order yet. The mossy tablet nearby seems to hide a clue.'
          },
          stepText: { nl: 'De runensteen gloeit warm op...', en: 'The rune stone glows warmly...' },
          resetText: { nl: 'De stenen doven met een zucht. Die volgorde klopt niet.', en: 'The stones dim with a sigh. That order isn’t right.' },
          solvedText: { nl: 'De derde steen vlamt op — naast je springt het deksel van de stenen kist open!', en: 'The third stone flares — beside you, the lid of the stone chest springs open!' },
          doneText: { nl: 'De runen gloeien tevreden na.', en: 'The runes glow contentedly.' },
          burst: { x: 412, y: 128 }
        }
      },
      fx: {
        fireflies: 16,
        chestOpen: { x: 412, y: 168 },
        birds: { n: 1, scale: 2, y: 36, yvar: 26, period: 17000, frac: 0.28, bob: 5, x0: 30 }
      },
      hotspots: [
        {
          id: 'dog',
          name: { nl: 'Hondje', en: 'Puppy' },
          rect: { x: 396, y: 168, w: 42, h: 42 },
          followNpc: 'dog',
          speaker: true,
          sendNpcTo: { npc: 'dog', x: 178, y: 200 },
          sendRequiresFlag: 'dogWarm',
          look: (state) => state.flags.dogWarm
            ? {
                nl: 'Woef woef! Het hondje kwispelt wild in zijn rode vestje, rent naar de steen met het Blad en blaft er enthousiast naar. Zou het iets willen vertellen?',
                en: 'Woof woof! The puppy wags wildly in its red vest, runs to the Leaf stone and barks at it eagerly. Is it trying to tell you something?'
              }
            : {
                nl: 'Het hondje zit te rillen tussen de runenstenen en jankt zachtjes. Het heeft het ijskoud... Wie zou het warm kunnen krijgen?',
                en: 'The puppy sits shivering among the rune stones, whimpering softly. It’s freezing cold... Who could warm it up?'
              },
          use: {
            vest: {
              consume: 'vest',
              setFlag: 'dogWarm',
              give: 'powder',
              text: {
                nl: 'Je trekt het hondje het rode vestje aan. Dolblij springt het op, en uit zijn vacht dwarrelt een buideltje Magisch Poeder in je hand — misschien onthult het wat verborgen is.',
                en: 'You slip the red vest onto the puppy. Overjoyed, it leaps up, and from its fur a pouch of Magic Powder tumbles into your hand — perhaps it reveals what is hidden.'
              }
            }
          }
        },
        {
          id: 'tablet',
          name: { nl: 'Mossig Kleitablet', en: 'Mossy Stone Tablet' },
          rect: { x: 80, y: 222, w: 108, h: 82 },
          walkTo: { x: 205, y: 252 },
          look: (state) => state.flags.runesRevealed
            ? { nl: 'De onthulde inscriptie gloeit zacht: “Eerst valt het Blad, dan zinkt de Zon, dan rijst de Maan.”',
                en: 'The revealed inscription glows softly: “First falls the Leaf, then sinks the Sun, then rises the Moon.”' }
            : { nl: 'Een kleitablet, volledig overwoekerd met mos en aanslag. De inscriptie is onleesbaar... was er maar iets om het te onthullen.',
                en: 'A stone tablet, completely overgrown with moss and grime. The inscription is unreadable... if only there were something to reveal it.' },
          use: {
            powder: {
              consume: 'powder',
              setFlag: 'runesRevealed',
              text: {
                nl: 'Je blaast het Magische Poeder over het tablet. Het mos licht goudgeel op en verdampt — de inscriptie verschijnt: “Eerst valt het Blad, dan zinkt de Zon, dan rijst de Maan.” In de verte gloeien de drie runenstenen zacht op.',
                en: 'You blow the Magic Powder over the tablet. The moss flares gold and evaporates — the inscription appears: “First falls the Leaf, then sinks the Sun, then rises the Moon.” In the distance the three rune stones glow softly.'
              }
            }
          }
        },
        {
          id: 'branch',
          name: { nl: 'Afgebroken Tak', en: 'Fallen Branch' },
          rect: { x: 214, y: 234, w: 84, h: 54 },
          walkTo: { x: 256, y: 260 },
          gives: {
            item: 'wood',
            giveText: {
              nl: 'Tussen de herfstbladeren raap je een stevig, droog Stuk Hout op — uitstekend brandhout voor een fakkel.',
              en: 'Among the autumn leaves you pick up a sturdy, dry Piece of Wood — excellent fuel for a torch.'
            },
            emptyText: { nl: 'Verder geen bruikbaar hout meer hier.', en: 'No more usable wood here.' }
          }
        },
        {
          id: 'runeLeaf',
          name: { nl: 'Runensteen: Blad', en: 'Rune Stone: Leaf' },
          rect: { x: 148, y: 52, w: 56, h: 98 },
          walkTo: { x: 175, y: 200 },
          puzzleKey: { puzzle: 'runes', key: 'leaf' },
          look: { nl: 'Een runensteen met een ingekerfd bladsymbool.', en: 'A rune stone carved with a leaf symbol.' }
        },
        {
          id: 'runeSun',
          name: { nl: 'Runensteen: Zon', en: 'Rune Stone: Sun' },
          rect: { x: 212, y: 48, w: 62, h: 102 },
          walkTo: { x: 242, y: 200 },
          puzzleKey: { puzzle: 'runes', key: 'sun' },
          look: { nl: 'Een runensteen met een ingekerfd zonnesymbool.', en: 'A rune stone carved with a sun symbol.' }
        },
        {
          id: 'runeMoon',
          name: { nl: 'Runensteen: Maan', en: 'Rune Stone: Moon' },
          rect: { x: 286, y: 50, w: 58, h: 100 },
          walkTo: { x: 314, y: 200 },
          puzzleKey: { puzzle: 'runes', key: 'moon' },
          look: { nl: 'Een runensteen met een ingekerfde maansikkel.', en: 'A rune stone carved with a crescent moon.' }
        },
        {
          id: 'chest',
          name: { nl: 'Stenen Kist', en: 'Stone Chest' },
          rect: { x: 350, y: 90, w: 88, h: 82 },
          walkTo: { x: 360, y: 198 },
          blockedBy: [
            {
              flag: 'dogWarm',
              text: {
                nl: 'Het bibberende hondje zit pal voor de kist en vertikt het om opzij te gaan. Help het arme dier eerst warm te worden.',
                en: 'The shivering puppy sits right in front of the chest and refuses to budge. Help the poor thing get warm first.'
              }
            },
            {
              flag: 'runesSolved',
              text: {
                nl: 'De kist zit muurvast verzegeld. De runenstenen ernaast zoemen verwachtingsvol.',
                en: 'The chest is sealed tight. The rune stones beside it hum expectantly.'
              }
            }
          ],
          gives: {
            item: 'vialEmpty',
            giveText: {
              nl: 'In de geopende kist ligt een Leeg Flesje van de Orde, gaaf en helder als de dag dat het geslepen werd.',
              en: 'Inside the open chest lies an Empty Vial of the Order, as clear as the day it was cut.'
            },
            emptyText: { nl: 'De kist is leeg.', en: 'The chest is empty.' }
          }
        },
        {
          id: 'toCourtyard',
          name: { nl: 'Pad naar de Binnenplaats', en: 'Path to the Courtyard' },
          rect: { x: 500, y: 110, w: 68, h: 130 },
          walkTo: { x: 508, y: 210 },
          arrow: { x: 533, y: 188, dir: 'right' },
          exit: {
            to: 'courtyard',
            travelText: { nl: 'Je volgt het pad terug naar de binnenplaats.', en: 'You follow the path back to the courtyard.' }
          }
        }
      ]
    },

    /* ---------- Scene 3: De Tempel van de Minotaur ---------- */
    temple: {
      name: { nl: 'De Tempel van de Minotaur', en: 'The Minotaur’s Temple' },
      bg: 'assets/art/scene-temple.png',
      entryText: {
        nl: 'Verweerde zuilen torenen boven je uit. Iets groots beweegt in de schaduw.',
        en: 'Weathered columns tower above you. Something large stirs in the shadows.'
      },
      playerStart: { x: 100, y: 220 },
      spawnFrom: { courtyard: { x: 100, y: 220 } },
      walkable: [
        { x: 28, y: 200, w: 515, h: 72 },
        { x: 28, y: 272, w: 330, h: 44 }
      ],
      obstacles: [
        { x: 216, y: 226, w: 42, h: 94 },    // zuilstomp midden (incl. zone erachter)
        { x: 372, y: 220, w: 44, h: 100 },   // zuilstomp rechts
        { x: 508, y: 188, w: 60, h: 132 },   // grote zuil rechts
        { x: 55, y: 226, w: 82, h: 58 }      // stenen schaal
      ],
      overlays: [],
      worldItems: [],
      npcs: [
        { id: 'minotaur', sprite: 'minotaur', x: 265, y: 255 }
      ],
      fx: {
        /* Tempel begint aardedonker; aansteken van de fakkel (torchLit) verdrijft het.
           Alleen een kijkveld rond de speler, de gloeiende kolen en de ogen
           van de minotaur zijn dan zichtbaar. */
        darkness: {
          until: 'torchLit',
          peekR: 54,
          motes: 16,
          eyes: [ { x: 255, y: 185 }, { x: 270, y: 185 } ],
          /* koud maanlicht dat zwak op de gedoofde toortsen bij het altaar valt */
          glimmers: [ { x: 300, y: 136, r: 28, col: '150,180,225', base: 0.16, speed: 900 } ]
        },
        wallTorch: { x: 135, y: 150, h: 46 },
        flames: [
          { x: 307, y: 148, r: 14 },
          { x: 434, y: 155, r: 14 }
        ],
        embers: [
          { x: 307, y: 150 },
          { x: 434, y: 157 }
        ],
        amulet: { x: 397, y: 133 },
        waterGlint: { x: 88, y: 248 },
        waterGlintNeedsWater: true,
        bowlEmpty: { x: 95, y: 254, rx: 26, ry: 11 },
        zzz: { x: 300, y: 182 }
      },
      hotspots: [
        {
          id: 'frieze',
          name: { nl: 'Fries met Glyphen', en: 'Glyph Frieze' },
          rect: { x: 100, y: 6, w: 460, h: 68 },
          walkTo: { x: 300, y: 212 },
          look: {
            nl: 'Gehouwen glyphen tonen een geknield beest dat uit een schaal drinkt en in slaap valt.',
            en: 'Carved glyphs show a kneeling beast drinking from a bowl and falling asleep.'
          }
        },
        {
          id: 'braziers',
          name: { nl: 'Gedoofde Toortsen', en: 'Cold Braziers' },
          rect: { x: 286, y: 114, w: 50, h: 46 },
          walkTo: { x: 300, y: 214 },
          look: (state) => state.flags.torchLit
            ? { nl: 'De toortsen bij het altaar branden hoog; hun licht vult de hele tempel.', en: 'The braziers by the altar burn high; their light fills the whole temple.' }
            : { nl: 'Twee gedoofde toortsen flankeren het altaar, vlak bij de minotaur. Met een brandende fakkel kun je ze ontsteken.',
                en: 'Two cold braziers flank the altar, right by the minotaur. With a lit torch you could set them ablaze.' },
          use: {
            torch: {
              consume: 'torch',
              setFlag: 'torchLit',
              text: {
                nl: 'Je houdt je fakkel bij de gedoofde toortsen — ze vatten vlam en warm licht overspoelt de tempel. Vlak voor je doemt de minotaur op.',
                en: 'You hold your torch to the cold braziers — they catch fire and warm light floods the temple. Right before you looms the minotaur.'
              }
            }
          }
        },
        {
          id: 'minotaur',
          name: { nl: 'De Minotaur', en: 'The Minotaur' },
          rect: { x: 222, y: 156, w: 88, h: 102 },
          followNpc: 'minotaur',
          speaker: true,
          danger: true,
          look: (state) => state.flags.minotaurAsleep
            ? { nl: 'De minotaur ligt in diepe slaap en snurkt als een onweer.', en: 'The minotaur lies fast asleep, snoring like a thunderstorm.' }
            : { nl: 'De minotaur gromt en heft zijn zwaard. Veel te sterk om te bevechten.', en: 'The minotaur growls and raises his sword. Far too strong to fight.' },
          angerTexts: [
            { nl: 'De minotaur stampt waarschuwend op de grond. Niet dichterbij komen.', en: 'The minotaur stamps the ground in warning. Don’t come closer.' },
            { nl: 'Zijn ogen gloeien rood op. Nóg één stap en het is voorbij...', en: 'His eyes flare red. One more step and it’s over...' }
          ],
          use: {
            potion: {
              text: {
                nl: 'Hij neemt niets uit jouw hand aan. Misschien drinkt hij liever onbespied, uit zijn eigen schaal...',
                en: 'He won’t take anything from your hand. Perhaps he’d rather drink unseen, from his own bowl...'
              }
            }
          }
        },
        {
          id: 'bowl',
          name: { nl: 'Stenen Schaal', en: 'Stone Bowl' },
          rect: { x: 55, y: 226, w: 82, h: 58 },
          walkTo: { x: 152, y: 258 },
          look: (state) => state.flags.minotaurAsleep
            ? { nl: 'De schaal is leeggedronken. Het beest heeft zoet geslurpt.', en: 'The bowl has been drained. The beast slurped it sweetly.' }
            : { nl: 'Een uit de vloer gehouwen drinkschaal, half gevuld met water.', en: 'A drinking bowl carved into the floor, half filled with water.' },
          use: {
            potion: {
              consume: 'potion',
              setFlag: 'minotaurAsleep',
              text: {
                nl: 'Je giet de Slaapdrank ongezien in de schaal. De minotaur drinkt gulzig... en zakt loom in slaap. De weg naar het altaar is vrij.',
                en: 'You pour the Sleeping Draught unseen into the bowl. The minotaur drinks greedily... and sinks into slumber. The way to the altar is clear.'
              }
            }
          }
        },
        {
          id: 'shrine',
          name: { nl: 'Altaar met Amulet', en: 'Altar with Amulet' },
          rect: { x: 352, y: 110, w: 104, h: 80 },
          walkTo: { x: 438, y: 224 },
          requiresFlag: 'minotaurAsleep',
          blockedText: { nl: 'De minotaur verspert de weg naar het altaar.', en: 'The minotaur blocks the way to the altar.' },
          jigsaw: {
            requiresFlag: 'minotaurAsleep',
            setFlag: 'wardLifted',
            give: 'amulet', win: true,
            cols: 4, rows: 3,
            img: 'assets/art/amulet-seal.png',
            title: { nl: 'Het Zegel van de Amulet', en: 'The Amulet Seal' },
            solvedText: {
              nl: 'De scherven klikken samen tot één geheel. Het zegel dooft met een diepe zucht en de Amulet van Emberfall ligt vrij — je grijpt hem. Warm licht stroomt door je heen.',
              en: 'The shards click together into one. The seal fades with a deep sigh and the Amulet of Emberfall lies free — you seize it. Warm light flows through you.'
            }
          },
          look: { nl: 'Het altaar is leeg; de amulet is van jou.', en: 'The altar is empty; the amulet is yours.' }
        },
        {
          id: 'toCourtyard',
          name: { nl: 'Terug naar de Binnenplaats', en: 'Back to the Courtyard' },
          rect: { x: 24, y: 80, w: 84, h: 152 },
          walkTo: { x: 92, y: 212 },
          arrow: { x: 62, y: 160, dir: 'left' },
          exit: {
            to: 'courtyard',
            travelText: { nl: 'Je keert terug naar de binnenplaats.', en: 'You return to the courtyard.' }
          }
        }
      ]
    }
  }
};
