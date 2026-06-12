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
    intro:       { nl: 'Het is voor altijd herfst geworden in het rijk Emberfall. De amulet is gestolen en wordt bewaakt door een minotaur. Geen zwaard velt hem — enkel list.',
                   en: 'Autumn has become eternal in the realm of Emberfall. The amulet was stolen and is guarded by a minotaur. No sword can fell him — only cunning.' },
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
    q_explore:   { nl: 'Verken de binnenplaats', en: 'Explore the courtyard' },
    q_water:     { nl: 'Zoek iets om water mee te scheppen — volg het westpad', en: 'Find something to scoop water — follow the west path' },
    q_runes:     { nl: 'Ontcijfer de runenstenen — lees het tablet', en: 'Decipher the rune stones — read the tablet' },
    q_chest:     { nl: 'Open de stenen kist in het bos', en: 'Open the stone chest in the grove' },
    q_fill:      { nl: 'Vul het flesje bij het altaar', en: 'Fill the vial at the altar' },
    q_berries:   { nl: 'Pluk rode bessen tussen de struiken', en: 'Pick red berries from the bushes' },
    q_combine:   { nl: 'Combineer de bessen met het water in je tas', en: 'Combine the berries with the water in your bag' },
    q_pour:      { nl: 'Giet de slaapdrank in de stenen schaal', en: 'Pour the sleeping draught into the stone bowl' },
    q_gate:      { nl: 'Los het embleem-raadsel op om de poort te openen', en: 'Solve the emblem riddle to open the gate' },
    q_amulet:    { nl: 'Pak de amulet van het altaar', en: 'Take the amulet from the altar' }
  },

  items: {
    berries:   { name: { nl: 'Rode Bessen', en: 'Red Berries' },     icon: '🍒', img: 'assets/art/item-berries.png' },
    vialEmpty: { name: { nl: 'Leeg Flesje', en: 'Empty Vial' },      icon: '🍶', img: 'assets/art/item-vial-empty.png' },
    vialWater: { name: { nl: 'Flesje Water', en: 'Vial of Water' },  icon: '💧', img: 'assets/art/item-vial-water.png' },
    potion:    { name: { nl: 'Slaapdrank', en: 'Sleeping Draught' }, icon: '🧪', img: 'assets/art/item-potion.png' },
    amulet:    { name: { nl: 'Amulet van Emberfall', en: 'Amulet of Emberfall' }, icon: '🍁', img: 'assets/art/item-amulet.png' }
  },

  recipes: [
    {
      a: 'berries', b: 'vialWater', result: 'potion',
      text: {
        nl: 'Je kneust de Rode Bessen in het regenwater. Het brouwsel kleurt diep en geurt zoet — een Slaapdrank.',
        en: 'You crush the Red Berries into the rainwater. The brew turns deep red and smells sweet — a Sleeping Draught.'
      }
    }
  ],

  scenes: {

    /* ---------- Scene 1: De Verlaten Binnenplaats ---------- */
    courtyard: {
      name: { nl: 'De Verlaten Binnenplaats', en: 'The Forsaken Courtyard' },
      entryText: {
        nl: 'Een binnenplaats van zandsteen, overwoekerd door rode herfststruiken.',
        en: 'A sandstone courtyard, overgrown with red autumn bushes.'
      },
      playerStart: { x: 300, y: 260 },
      spawnFrom: {
        temple: { x: 452, y: 182 },
        grove: { x: 48, y: 202 }
      },
      walkable: [
        { x: 10, y: 168, w: 530, h: 50 },
        { x: 125, y: 218, w: 255, h: 88 }
      ],
      obstacles: [
        { x: 160, y: 84, w: 110, h: 84 }    // altaartrog
      ],
      overlays: [
        { img: 'assets/art/ov-courtyard-bushes.png', x: 0, y: 196, w: 128, h: 124, base: 330 },
        { img: 'assets/art/ov-courtyard-rubble.png', x: 384, y: 206, w: 184, h: 114, base: 332 }
      ],
      worldItems: [
        { item: 'berries', hotspot: 'bushes', x: 140, y: 262 }
      ],
      npcs: [
        { id: 'seer', sprite: 'seer', x: 285, y: 205,
          wander: { x: 245, y: 180, w: 85, h: 45, speed: 22, pauseMin: 2500, pauseMax: 7000 } }
      ],
      fx: {
        emblemGlow: { x: 348, y: 71, r: 22 },
        waterGlint: { x: 210, y: 106 },
        gateDoor: { x: 424, y: 76, w: 50, h: 76 }
      },
      hotspots: [
        {
          id: 'altar',
          name: { nl: 'Verweerd Altaar', en: 'Weathered Altar' },
          rect: { x: 162, y: 84, w: 106, h: 76 },
          walkTo: { x: 215, y: 174 },
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
          look: {
            nl: 'De gehulde ziener fluistert: “Voorbij de poort waakt de minotaur. Geen zwaard velt hem — enkel slaap. Hij drinkt uit de stenen schaal in de tempel wanneer niemand kijkt.”',
            en: 'The hooded seer whispers: “Beyond the gate the minotaur keeps watch. No sword can fell him — only sleep. He drinks from the stone bowl in the temple when no one is looking.”'
          }
        },
        {
          id: 'bushes',
          name: { nl: 'Rode Struiken', en: 'Red Bushes' },
          rect: { x: 0, y: 170, w: 118, h: 150 },
          walkTo: { x: 136, y: 248 },
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
          look: {
            nl: 'Verbrokkeld muurwerk. Tussen het puin ligt een gebroken wegwijzer: “De Bron van de Orde — via het westpad.”',
            en: 'Crumbled masonry. Among the rubble lies a broken signpost: “The Well of the Order — by the west path.”'
          }
        },
        {
          id: 'toGrove',
          name: { nl: 'Westpad naar het Bos', en: 'West Path to the Grove' },
          rect: { x: 0, y: 140, w: 34, h: 100 },
          walkTo: { x: 44, y: 200 },
          exit: {
            to: 'grove',
            travelText: { nl: 'Je glipt langs de muur het herfstbos in...', en: 'You slip past the wall into the autumn grove...' }
          }
        },
        {
          id: 'toTemple',
          name: { nl: 'Poort naar de Tempel', en: 'Gate to the Temple' },
          rect: { x: 420, y: 50, w: 66, h: 104 },
          walkTo: { x: 452, y: 174 },
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
      entryText: {
        nl: 'Een verborgen open plek. Drie runenstenen zoemen zacht tussen de herfstbomen.',
        en: 'A hidden clearing. Three rune stones hum softly among the autumn trees.'
      },
      playerStart: { x: 505, y: 205 },
      spawnFrom: { courtyard: { x: 505, y: 205 } },
      walkable: [
        { x: 95, y: 165, w: 440, h: 115 },
        { x: 440, y: 140, w: 122, h: 95 }
      ],
      obstacles: [
        { x: 350, y: 158, w: 88, h: 26 },    // sokkel van de kist
        { x: 66, y: 226, w: 114, h: 74 }     // kleitablet
      ],
      overlays: [
        { img: 'assets/art/ov-grove-left.png', x: 0, y: 248, w: 110, h: 72, base: 330 },
        { img: 'assets/art/ov-grove-right.png', x: 330, y: 262, w: 238, h: 58, base: 332 }
      ],
      worldItems: [
        { item: 'vialEmpty', hotspot: 'chest', x: 393, y: 128, requiresFlag: 'runesSolved' }
      ],
      npcs: [
        { id: 'dog', sprite: 'dog', x: 250, y: 230,
          wander: { x: 150, y: 180, w: 190, h: 55, speed: 48, pauseMin: 1500, pauseMax: 4500 } }
      ],
      puzzles: {
        runes: {
          sequence: ['leaf', 'sun', 'moon'],
          setFlag: 'runesSolved',
          stepText: { nl: 'De runensteen gloeit warm op...', en: 'The rune stone glows warmly...' },
          resetText: { nl: 'De stenen doven met een zucht. Die volgorde klopt niet.', en: 'The stones dim with a sigh. That order isn’t right.' },
          solvedText: { nl: 'De derde steen vlamt op — naast je springt het deksel van de stenen kist open!', en: 'The third stone flares — beside you, the lid of the stone chest springs open!' },
          doneText: { nl: 'De runen gloeien tevreden na.', en: 'The runes glow contentedly.' },
          burst: { x: 393, y: 130 }
        }
      },
      fx: {
        fireflies: 8,
        chestOpen: { x: 394, y: 172 }
      },
      hotspots: [
        {
          id: 'dog',
          name: { nl: 'Vrolijk Hondje', en: 'Cheerful Puppy' },
          rect: { x: 230, y: 190, w: 40, h: 40 },
          followNpc: 'dog',
          speaker: true,
          sendNpcTo: { npc: 'dog', x: 162, y: 182 },
          look: {
            nl: 'Woef woef! Het hondje kwispelt wild, rent naar de steen met het Blad en blaft er enthousiast naar. Zou het iets willen vertellen?',
            en: 'Woof woof! The puppy wags wildly, runs to the Leaf stone and barks at it eagerly. Is it trying to tell you something?'
          }
        },
        {
          id: 'tablet',
          name: { nl: 'Mossig Kleitablet', en: 'Mossy Stone Tablet' },
          rect: { x: 68, y: 220, w: 112, h: 86 },
          walkTo: { x: 196, y: 242 },
          look: {
            nl: 'Onder het mos staan uitgesleten letters: “Eerst valt het Blad, dan zinkt de Zon, dan rijst de Maan.”',
            en: 'Beneath the moss, worn letters read: “First falls the Leaf, then sinks the Sun, then rises the Moon.”'
          }
        },
        {
          id: 'runeLeaf',
          name: { nl: 'Runensteen: Blad', en: 'Rune Stone: Leaf' },
          rect: { x: 131, y: 54, w: 56, h: 86 },
          walkTo: { x: 160, y: 192 },
          puzzleKey: { puzzle: 'runes', key: 'leaf' },
          look: { nl: 'Een runensteen met een gloeiend bladsymbool.', en: 'A rune stone bearing a glowing leaf symbol.' }
        },
        {
          id: 'runeSun',
          name: { nl: 'Runensteen: Zon', en: 'Rune Stone: Sun' },
          rect: { x: 202, y: 50, w: 54, h: 86 },
          walkTo: { x: 230, y: 190 },
          puzzleKey: { puzzle: 'runes', key: 'sun' },
          look: { nl: 'Een runensteen met een gloeiend zonnesymbool.', en: 'A rune stone bearing a glowing sun symbol.' }
        },
        {
          id: 'runeMoon',
          name: { nl: 'Runensteen: Maan', en: 'Rune Stone: Moon' },
          rect: { x: 269, y: 50, w: 56, h: 90 },
          walkTo: { x: 298, y: 192 },
          puzzleKey: { puzzle: 'runes', key: 'moon' },
          look: { nl: 'Een runensteen met een gloeiende maansikkel.', en: 'A rune stone bearing a glowing crescent moon.' }
        },
        {
          id: 'chest',
          name: { nl: 'Stenen Kist', en: 'Stone Chest' },
          rect: { x: 350, y: 90, w: 88, h: 82 },
          walkTo: { x: 393, y: 192 },
          requiresFlag: 'runesSolved',
          blockedText: {
            nl: 'De kist zit muurvast verzegeld. De runenstenen ernaast zoemen verwachtingsvol.',
            en: 'The chest is sealed tight. The rune stones beside it hum expectantly.'
          },
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
          rect: { x: 505, y: 88, w: 63, h: 142 },
          walkTo: { x: 522, y: 198 },
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
        { id: 'minotaur', sprite: 'minotaur', x: 265, y: 255,
          patrol: { amp: 26, period: 5200 } }
      ],
      fx: {
        flames: [
          { x: 307, y: 148, r: 14 },
          { x: 434, y: 155, r: 14 }
        ],
        embers: [
          { x: 307, y: 150 },
          { x: 434, y: 157 }
        ],
        amulet: { x: 354, y: 126 },
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
          rect: { x: 322, y: 102, w: 86, h: 82 },
          walkTo: { x: 365, y: 226 },
          requiresFlag: 'minotaurAsleep',
          blockedText: { nl: 'De minotaur verspert de weg naar het altaar.', en: 'The minotaur blocks the way to the altar.' },
          gives: {
            item: 'amulet',
            win: true,
            giveText: {
              nl: 'Je grijpt de Amulet van Emberfall van het altaar. Warm licht stroomt door je heen.',
              en: 'You seize the Amulet of Emberfall from the altar. Warm light flows through you.'
            },
            emptyText: { nl: 'Het altaar is leeg; de amulet is van jou.', en: 'The altar is empty; the amulet is yours.' }
          }
        },
        {
          id: 'toCourtyard',
          name: { nl: 'Terug naar de Binnenplaats', en: 'Back to the Courtyard' },
          rect: { x: 28, y: 86, w: 68, h: 116 },
          walkTo: { x: 95, y: 216 },
          exit: {
            to: 'courtyard',
            travelText: { nl: 'Je keert terug naar de binnenplaats.', en: 'You return to the courtyard.' }
          }
        }
      ]
    }
  }
};
