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
  assetVer: '50',

  /* Sprite-register: NPC's verwijzen via hun sprite-naam naar deze paden. */
  sprites: {
    hero:           'assets/art/hero.png',
    heroWalk:       'assets/art/hero-walk.png',
    heroWalkSheet:  'assets/art/hero-walk-sheet.png',   /* 8-frame zijwaartse loopcyclus (Higgsfield AutoSprite) */
    heroWave:       'assets/art/hero-wave.png',
    seer:           'assets/art/seer.png',
    minotaur:       'assets/art/minotaur.png',
    minotaurAsleep: 'assets/art/minotaur-asleep.png',
    dog:            'assets/art/dog.png',
    dogCold:        'assets/art/dog-cold.png',
    dogVest:        'assets/art/dog-vest.png',
    chestOpen:      'assets/art/chest-open.png',
    gateDoor:       'assets/art/gate-door.png',
    wallTorch:      'assets/art/torch-lit.png',
    robin:          'assets/art/robin-fly.png',  /* sprite-sheet: 4×3 = 12 vlieg-frames */
    tile1:          'assets/art/tile-1.png',
    tile2:          'assets/art/tile-2.png',
    tile3:          'assets/art/tile-3.png',
    tile4:          'assets/art/tile-4.png'
  },

  winText: {
    nl: 'De Amulet van Emberfall hangt veilig om je hals. Warm gouden licht breekt ' +
        'door de wolken. De eeuwige herfst is voorbij: de seizoenen komen terug. ' +
        'Iedereen in Emberfall zal jouw naam onthouden!',
    en: 'The Amulet of Emberfall hangs safely around your neck. Warm golden light ' +
        'breaks through the clouds. The endless autumn is over: the seasons can return. ' +
        'Everyone in Emberfall will remember your name!'
  },

  strings: {
    noEffect:    { nl: 'Dat werkt hier niet.', en: 'That doesn’t work here.' },
    noCombine:   { nl: 'Die twee laten zich niet combineren.', en: 'Those two don’t combine.' },
    nothingThere:{ nl: 'Daar valt niets te ontdekken.', en: 'There’s nothing to find there.' }
  },

  /* UI-teksten voor de engine */
  ui: {
    subtitle:    { nl: 'Een point-and-click avontuur', en: 'A point-and-click adventure' },
    intro:       { nl: 'In het rijk Emberfall is het altijd herfst. De amulet is gestolen en een minotaur bewaakt hem. Vechten lukt niet. Je hebt een slimme list nodig.',
                   en: 'In the realm of Emberfall it is always autumn. The amulet was stolen, and a minotaur guards it. Fighting won’t work. You need a clever trick.' },
    credit:      { nl: 'Gemaakt voor Sandra', en: 'Made for Sandra' },
    startBtn:    { nl: 'Begin het avontuur', en: 'Begin the adventure' },
    winTitle:    { nl: 'Emberfall is Gered', en: 'Emberfall is Saved' },
    replayBtn:   { nl: 'Opnieuw spelen', en: 'Play again' },
    playOther:   { nl: '▸ Speel nu Maanhoef', en: '▸ Now play Maanhoef' },
    deathTitle:  { nl: 'Oei, te dichtbij!', en: 'Whoa, too close!' },
    deathText:   { nl: 'De minotaur snuift en stampt met zijn hoef. Met bonzend hart krabbel je terug naar de deur. Zoek een slimmere manier!',
                   en: 'The minotaur snorts and stamps his hoof. Heart pounding, you scramble back to the door. Find a sneakier way!' },
    retryBtn:    { nl: 'Verder spelen', en: 'Keep playing' },
    rotateTitle: { nl: 'Draai je telefoon', en: 'Rotate your phone' },
    rotateText:  { nl: 'Dit avontuur speelt liggend. Draai je scherm een kwartslag.',
                   en: 'This adventure plays in landscape. Turn your screen sideways.' },
    tapContinue: { nl: 'tik om verder te gaan ▸', en: 'tap to continue ▸' },
    selected:    { nl: 'geselecteerd', en: 'selected' },
    homeConfirm: { nl: 'Terug naar de homepagina? Je voortgang gaat verloren.', en: 'Back to the homepage? Your progress will be lost.' },
    /* Knop-labels voor schermlezers (applyLang zet ze in de gekozen taal) */
    aSound:      { nl: 'Geluid aan of uit', en: 'Sound on or off' },
    aLang:       { nl: 'Switch to English', en: 'Wissel naar Nederlands' },
    aHome:       { nl: 'Terug naar de homepagina', en: 'Back to the homepage' },
    aInv:        { nl: 'Inventaris', en: 'Inventory' },
    aClose:      { nl: 'Sluiten', en: 'Close' },
    aHint:       { nl: 'Laat zien waar je kunt tikken', en: 'Show what you can tap' },
    aUp:         { nl: 'Omhoog', en: 'Up' },
    aDown:       { nl: 'Omlaag', en: 'Down' },
    aLeft:       { nl: 'Links', en: 'Left' },
    aRight:      { nl: 'Rechts', en: 'Right' },
    q_explore:   { nl: 'Verken de binnenplaats', en: 'Explore the courtyard' },
    q_water:     { nl: 'Zoek iets om water in te doen — volg het westpad naar het bos', en: 'Find something to hold water — follow the west path to the grove' },
    q_runes:     { nl: 'Tik de runenstenen in de juiste volgorde aan', en: 'Tap the rune stones in the right order' },
    q_chest:     { nl: 'Open de stenen kist in het bos', en: 'Open the stone chest in the grove' },
    q_fill:      { nl: 'Vul het flesje bij de oude fontein', en: 'Fill the vial at the old fountain' },
    q_berries:   { nl: 'Pluk rode bessen tussen de struiken', en: 'Pick red berries from the bushes' },
    q_flower:    { nl: 'Pluk de slaapbloem bij de runenstenen in het bos', en: 'Pick the slumber flower by the rune stones in the grove' },
    q_combine:   { nl: 'Combineer de bessen met het water in je tas', en: 'Combine the berries with the water in your bag' },
    q_brew:      { nl: 'Roer de slaapbloem door het bessenbrouwsel', en: 'Stir the slumber flower into the berry brew' },
    q_pour:      { nl: 'Giet de slaapdrank in de stenen schaal', en: 'Pour the sleeping draught into the stone bowl' },
    q_torch:     { nl: 'Het is aardedonker — verzamel een vuursteen (binnenplaats) en droog hout (bos)', en: 'It’s pitch dark — gather a flint (courtyard) and dry wood (grove)' },
    q_makeTorch: { nl: 'Combineer de vuursteen en het hout in je tas tot een fakkel', en: 'Combine the flint and the wood in your bag into a torch' },
    q_lightTorch:{ nl: 'Steek met je fakkel de muurfakkel bij de deur aan — dan ontvlammen alle toortsen', en: 'Light the wall torch by the door with your torch — all the torches will catch' },
    q_ward:      { nl: 'Tik de vloertegels bij het altaar in de goede volgorde aan — de aanwijzing staat op de muur rechts', en: 'Tap the floor tiles by the altar in the right order — the clue is on the wall to the right' },
    q_gate:      { nl: 'Tik op het gouden embleem en schuif de puzzel goed om de poort te openen', en: 'Tap the golden emblem and solve the sliding puzzle to open the gate' },
    q_riddle:    { nl: 'Het hondje heeft het koud — de ziener weet vast raad', en: 'The puppy is freezing — the seer may know what to do' },
    q_vest:      { nl: 'Geef het hondje zijn warme vestje', en: 'Give the puppy its warm vest' },
    q_powder:    { nl: 'Strooi het magische poeder op het mossige stenen tablet in het bos', en: 'Sprinkle the magic powder on the mossy stone tablet in the grove' },
    q_amulet:    { nl: 'Pak de amulet van het altaar', en: 'Take the amulet from the altar' }
  },

  /* Questhint-regels — eerste match wint; quest:null verbergt de hint.
     De engine leest dit generiek (zie condMet/questKey). */
  questRules: [
    { when: { flag: 'taken_temple_shrine' },                        quest: null },
    { when: { flag: 'minotaurAsleep', notFlag: 'amuletRisen' },     quest: 'q_ward' },
    { when: { flag: 'minotaurAsleep' },                             quest: 'q_amulet' },
    { when: { flag: 'visited_temple', notFlag: 'torchLit', has: 'torch' },           quest: 'q_lightTorch' },
    { when: { flag: 'visited_temple', notFlag: 'torchLit', has: ['flint', 'wood'] }, quest: 'q_makeTorch' },
    { when: { flag: 'visited_temple', notFlag: 'torchLit' },                          quest: 'q_torch' },
    { when: { has: 'potion', notFlag: 'gateOpen' },                 quest: 'q_gate' },
    { when: { has: 'potion' },                                      quest: 'q_pour' },
    { when: { has: ['berryBrew', 'flower'] },                       quest: 'q_brew' },
    { when: { has: 'berryBrew' },                                   quest: 'q_flower' },
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
    flower:    { name: { nl: 'Slaapbloem', en: 'Slumber Flower' },   icon: '🌸', img: 'assets/art/item-flower.png' },
    recipeCard:{ name: { nl: 'Oud Receptenblad', en: 'Old Recipe Note' }, icon: '📜', img: 'assets/art/item-recipe.png', zoomImg: 'assets/art/item-recipe-large.webp' },
    vialEmpty: { name: { nl: 'Leeg Flesje', en: 'Empty Vial' },      icon: '🍶', img: 'assets/art/item-vial-empty.png' },
    vialWater: { name: { nl: 'Flesje Water', en: 'Vial of Water' },  icon: '💧', img: 'assets/art/item-vial-water.png' },
    berryBrew: { name: { nl: 'Bessenbrouwsel', en: 'Berry Brew' },   icon: '🥤', img: 'assets/art/item-berry-brew.png' },
    potion:    { name: { nl: 'Slaapdrank', en: 'Sleeping Draught' }, icon: '🧪', img: 'assets/art/item-potion.png', sparkle: true },
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
      a: 'berries', b: 'vialWater', result: 'berryBrew',
      text: {
        nl: 'Je kneust de Rode Bessen in het flesje water. Het water kleurt diep rood.\nMaar er mist nog iets om het beest écht te laten slapen: een Slaapbloem.',
        en: 'You crush the Red Berries into the vial of water. The water turns deep red.\nBut it still needs one more thing to make the beast sleep: a Slumber Flower.'
      }
    },
    {
      a: 'berryBrew', b: 'flower', result: 'potion',
      text: {
        nl: 'Je doet de Slaapbloem in het flesje. Het brouwsel begint magisch te fonkelen en wordt loom en zwaar.\nNu is het een echte Slaapdrank!',
        en: 'You drop the Slumber Flower into the vial. The brew starts to sparkle with magic and grows heavy and drowsy.\nNow it is a real Sleeping Draught!'
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
      bg: 'assets/art/scene-courtyard.webp',
      bgVariants: [
        { img: 'assets/art/scene-courtyard-closed.webp', notFlag: 'gateOpen' }
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
        { item: 'berries', hotspot: 'bushes', x: 140, y: 262 },
        { item: 'recipeCard', hotspot: 'recipe', x: 472, y: 190 }
      ],
      npcs: [
        { id: 'seer', sprite: 'seer', x: 285, y: 205,
          wander: { x: 245, y: 180, w: 85, h: 45, speed: 22, pauseMin: 2500, pauseMax: 7000 } }
      ],
      fx: {
        emblemGlow: { x: 332, y: 80, r: 22 },
        fountain: { sx: 225, sy: 117, wx: 228, wy: 138 },
        birds: { n: 1, scale: 1.4, y: 48, yvar: 42, period: 15000, frac: 0.42, bob: 8 }
      },
      hotspots: [
        {
          id: 'altar',
          name: { nl: 'Oude Fontein', en: 'Old Fountain' },
          rect: { x: 162, y: 84, w: 106, h: 76 },
          walkTo: { x: 233, y: 202 },
          look: {
            nl: 'Een oude fontein vol helder water. Op de rand staan woorden gekrast:\n“Wat het boze beest kalmeert, groeit rood tussen de stenen.”',
            en: 'An old fountain full of clear water. Words are carved on its rim:\n“What calms the angry beast grows red among the stones.”'
          },
          use: {
            vialEmpty: {
              consume: 'vialEmpty',
              give: 'vialWater',
              text: { nl: 'Je vult het flesje met helder water uit de fontein.', en: 'You fill the vial with clear water from the fountain.' }
            },
            vialWater: { text: { nl: 'Je flesje is al vol.', en: 'Your vial is already full.' } }
          }
        },
        {
          id: 'emblem',
          name: { nl: 'Gouden Embleem', en: 'Golden Emblem' },
          rect: { x: 300, y: 48, w: 66, h: 68 },
          walkTo: { x: 332, y: 176 },
          slidePuzzle: {
            img: 'assets/art/emblem-puzzle.webp',
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
              nl: '“Het bibberende hondje, zeg je? Los mijn drie raadsels op, dan help ik je.”',
              en: '“The shivering puppy, you say? Solve my three riddles, and I will help you.”'
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
              nl: '“Hmm, dat is het niet. Denk nog eens goed na en probeer opnieuw.”',
              en: '“Hmm, that’s not it. Think again and have another try.”'
            },
            solvedText: {
              nl: '“Drie van drie. Wijs geantwoord.” De ziener haalt een klein rood vestje uit zijn gewaad. “Voor de kleine bibberaar bij de kist.”',
              en: '“Three of three. Wisely answered.” The seer draws a small red vest from his robe. “For the little shiverer by the chest.”'
            }
          },
          look: {
            nl: 'De ziener in zijn kap fluistert: “Achter de poort waakt de minotaur. Geen zwaard verslaat hem, alleen slaap.”\n“Hij drinkt uit de stenen schaal in de tempel als niemand kijkt.”',
            en: 'The hooded seer whispers: “Beyond the gate, the minotaur keeps watch. No sword can beat him, only sleep.”\n“He drinks from the stone bowl in the temple when no one is looking.”'
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
          id: 'recipe',
          name: { nl: 'Vergeeld Receptenblaadje', en: 'Yellowed Recipe Note' },
          rect: { x: 444, y: 162, w: 62, h: 50 },
          walkTo: { x: 418, y: 250 },
          gives: {
            item: 'recipeCard',
            giveText: {
              nl: 'Tussen de stenen, net boven het puin, vind je een vergeeld receptenblaadje.\nJe stopt het in je tas. Tik er later op om het recept groot te bekijken.',
              en: 'Among the stones, just above the rubble, you find a yellowed recipe note.\nYou tuck it into your bag. Tap it later to see the recipe up close.'
            },
            emptyText: { nl: 'Het receptenblaadje zit al veilig in je tas.', en: 'The recipe note is already safe in your bag.' }
          },
          look: {
            nl: 'Een vergeeld receptenblaadje, tussen de stenen geklemd net boven het puin.',
            en: 'A yellowed recipe note, wedged among the stones just above the rubble.'
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
              nl: 'Tussen de stenen vind je een scherpe Vuursteen. Daar kun je vonken mee slaan.\nEen gebroken wegwijzer wijst naar het westen: “Naar het Runenbos.”',
              en: 'Among the stones you find a sharp Flint. It’s good for striking sparks.\nA broken signpost points west: “To the Rune Grove.”'
            },
            emptyText: {
              nl: 'Alleen nog puin en de gebroken wegwijzer: “Naar het Runenbos” (westpad).',
              en: 'Only rubble now, and the broken signpost: “To the Rune Grove” (west path).'
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
          walkTo: { x: 436, y: 176 },
          arrow: { x: 430, y: 132, dir: 'up' },
          requiresFlag: 'gateOpen',
          blockedText: {
            nl: 'De stenen poortdeur zit muurvast. Het gouden embleem ernaast gloeit, alsof het je iets wil vertellen...',
            en: 'The stone gate is sealed shut. The golden emblem beside it glows, as if it wants your attention...'
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
      bg: 'assets/art/scene-grove.webp',
      bgVariants: [
        { img: 'assets/art/scene-grove-lit.webp', flag: 'runesRevealed' }
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
        { item: 'wood', hotspot: 'branch', x: 292, y: 268 },
        { item: 'flower', hotspot: 'flower', x: 126, y: 178, highlight: true }
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
                nl: 'Woef woef! Het hondje kwispelt wild in zijn rode vestje.\nHet rent naar de steen met het Blad en blaft er blij naar. Zou het iets willen vertellen?',
                en: 'Woof woof! The puppy wags wildly in its red vest.\nIt runs to the Leaf stone and barks at it happily. Is it trying to tell you something?'
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
                nl: 'Je trekt het hondje het rode vestje aan. Dolblij springt het op!\nUit zijn vacht valt een buideltje Magisch Poeder in je hand. Misschien laat het zien wat verborgen is.',
                en: 'You slip the red vest onto the puppy. Overjoyed, it leaps up!\nA pouch of Magic Powder tumbles from its fur into your hand. Maybe it can show what is hidden.'
              }
            }
          }
        },
        {
          id: 'tablet',
          name: { nl: 'Mossig Stenen Tablet', en: 'Mossy Stone Tablet' },
          rect: { x: 80, y: 222, w: 108, h: 82 },
          walkTo: { x: 205, y: 252 },
          look: (state) => state.flags.runesRevealed
            ? { nl: 'De tekst op het tablet gloeit zacht: “Eerst valt het Blad, dan zinkt de Zon, dan rijst de Maan.”',
                en: 'The words on the tablet glow softly: “First falls the Leaf, then sinks the Sun, then rises the Moon.”' }
            : { nl: 'Een stenen tablet, helemaal begroeid met mos. Je kunt de tekst niet lezen... was er maar iets om het mos weg te krijgen.',
                en: 'A stone tablet, completely covered in moss. You can’t read the words... if only there were something to clear the moss away.' },
          use: {
            powder: {
              consume: 'powder',
              setFlag: 'runesRevealed',
              text: {
                nl: 'Je blaast het Magische Poeder over het tablet. Het mos licht goud op en verdwijnt.\nDe tekst wordt zichtbaar: “Eerst valt het Blad, dan zinkt de Zon, dan rijst de Maan.”\nDe drie runenstenen gloeien zacht op.',
                en: 'You blow the Magic Powder over the tablet. The moss glows gold and vanishes.\nWords appear: “First falls the Leaf, then sinks the Sun, then rises the Moon.”\nThe three rune stones begin to glow softly.'
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
          id: 'flower',
          name: { nl: 'Slaapbloem', en: 'Slumber Flower' },
          rect: { x: 104, y: 150, w: 46, h: 46 },
          walkTo: { x: 150, y: 206 },
          gives: {
            item: 'flower',
            giveText: {
              nl: 'Aan de voet van de runenstenen groeit een bleekblauwe Slaapbloem. Je plukt haar voorzichtig — haar zware, zoete geur maakt al loom.',
              en: 'At the foot of the rune stones grows a pale-blue Slumber Flower. You pick it carefully — its heavy, sweet scent already makes you drowsy.'
            },
            emptyText: { nl: 'Hier groeien geen slaapbloemen meer.', en: 'No more slumber flowers grow here.' }
          },
          look: {
            nl: 'Een bleekblauwe bloem die tussen de runenstenen bloeit; haar geur is zwaar en zoet.',
            en: 'A pale-blue flower blooming among the rune stones; its scent is heavy and sweet.'
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
      bg: 'assets/art/scene-temple.webp',
      bgVariants: [
        { img: 'assets/art/scene-temple-lit.webp', flag: 'torchLit' }   // verlichte tempel zodra de toortsen branden
      ],
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
      /* In het donker (vóór torchLit) durft de held niet verder dan de ingang bij de deur. */
      darkWalkable: [
        { x: 28, y: 200, w: 132, h: 72 }
      ],
      darkWalkText: {
        nl: 'Het is veel te donker om verder de tempel in te lopen. Ik kan beter eerst de toortsen ontsteken.',
        en: 'It’s far too dark to walk deeper into the temple. I’d better light the torches first.'
      },
      obstacles: [
        /* De middelste/rechter "zuilstomp"-blokken stonden op OPEN vloer vlak naast de minotaur
           en lieten de held vastlopen als hij erlangs liep — verwijderd zodat de vloer vrij is. */
        { x: 508, y: 188, w: 60, h: 132 },   // grote zuil/muur rechts
        { x: 55, y: 226, w: 82, h: 58 }      // stenen schaal
      ],
      overlays: [],
      worldItems: [],
      npcs: [
        { id: 'minotaur', sprite: 'minotaur', x: 265, y: 255 }
      ],
      fx: {
        /* De donkere tempel-art (scene-temple.png) toont zelf het 'licht uit'; zodra de
           toortsen branden (torchLit) wisselt de achtergrond naar de verlichte variant.
           useArt:true houdt de fx-poort (vuur/amulet pas zichtbaar bij licht) intact
           zonder een zwart overlay te tekenen. */
        darkness: { until: 'torchLit', useArt: true },
        /* In het donker alleen een minuscuul vlammetje (1px) bij de deurfakkel — een subtiele hint. */
        doorFlame: { x: 115, y: 119 },
        /* Vlam-gloed precies op de brandende toortsen in de verlichte tempel-art (alleen bij licht) */
        flames: [
          { x: 284, y: 146, r: 13 },   // linker brazier op het altaar
          { x: 397, y: 146, r: 13 },   // rechter brazier op het altaar
          { x: 115, y: 119, r: 12 },   // muurfakkel links (bij de deur)
          { x: 545, y: 120, r: 12 }    // muurfakkel rechts (op de fakkel, niet op de zuil)
        ],
        embers: [
          { x: 284, y: 147 },
          { x: 397, y: 147 }
        ],
        amulet: { x: 336, y: 122 },
        tileHint: { x: 471, y: 151 },   // gegraveerde aanwijzing op de muur, onder de stierenkop rechts
        waterGlint: { x: 88, y: 248 },
        waterGlintNeedsWater: true,   // glinster verdwijnt zodra de slaapdrank erin gaat (minotaurAsleep)
        zzz: { x: 300, y: 182 }
      },
      /* Tegel-combinatiepuzzel vóór het altaar: druk de tegels in de juiste volgorde (de
         aanwijzing staat op de fries). Oplossen onthult de amulet (schuift omhoog). */
      puzzles: {
        altarTiles: {
          sequence: ['t3', 't1', 't4', 't2'],   // geheime combinatie: 3 → 1 → 4 → 2 stippen
          setFlag: 'amuletRisen',
          revealAmulet: true,
          requiresFlag: 'minotaurAsleep',
          blockedText: { nl: 'De tegels blijven koud en dof zolang het beest waakt.', en: 'The tiles stay cold and dull while the beast is awake.' },
          stepText: { nl: 'De tegel gloeit goud op...', en: 'The tile glows gold...' },
          resetText: { nl: 'Met een diep gerommel doven de tegels weer. Dat was niet de goede volgorde. Kijk nog eens naar de aanwijzing op de muur.', en: 'With a deep rumble the tiles go dark again. That wasn’t the right order. Look again at the clue on the wall.' },
          solvedText: { nl: 'De vier tegels lichten samen goudgeel op! Met een diep gerommel schuift de Amulet van Emberfall omhoog uit het altaar.', en: 'All four tiles blaze gold together! With a deep rumble the Amulet of Emberfall rises up out of the altar.' },
          doneText: { nl: 'De tegels gloeien tevreden na.', en: 'The tiles glow contentedly.' },
          burst: { x: 332, y: 122 }
        }
      },
      hotspots: [
        {
          id: 'frieze',
          name: { nl: 'Muurtekeningen', en: 'Wall Carvings' },
          rect: { x: 100, y: 6, w: 460, h: 68 },
          walkTo: { x: 300, y: 212 },
          look: (state) => state.flags.minotaurAsleep
            ? { nl: 'Tussen de tekeningen lichten vier tekens op. Dat is de volgorde voor de vloertegels bij het altaar:\n●●● · ● · ●●●● · ●● (drie, één, vier, twee stippen).',
                en: 'Among the carvings, four marks light up. They show the order for the floor tiles by the altar:\n●●● · ● · ●●●● · ●● (three, one, four, two dots).' }
            : { nl: 'De tekeningen in de muur tonen een beest dat uit een schaal drinkt en in slaap valt.',
                en: 'The carvings in the wall show a beast drinking from a bowl and falling asleep.' }
        },
        { id: 'tile1', name: { nl: 'Tegel', en: 'Tile' }, rect: { x: 290, y: 238, w: 62, h: 26 }, puzzleKey: { puzzle: 'altarTiles', key: 't1' }, tile: true, pips: 1 },
        { id: 'tile2', name: { nl: 'Tegel', en: 'Tile' }, rect: { x: 360, y: 238, w: 62, h: 26 }, puzzleKey: { puzzle: 'altarTiles', key: 't2' }, tile: true, pips: 2 },
        { id: 'tile3', name: { nl: 'Tegel', en: 'Tile' }, rect: { x: 290, y: 268, w: 62, h: 26 }, puzzleKey: { puzzle: 'altarTiles', key: 't3' }, tile: true, pips: 3 },
        { id: 'tile4', name: { nl: 'Tegel', en: 'Tile' }, rect: { x: 360, y: 268, w: 62, h: 26 }, puzzleKey: { puzzle: 'altarTiles', key: 't4' }, tile: true, pips: 4 },
        {
          id: 'tileHint',
          name: { nl: 'Gegraveerde Aanwijzing', en: 'Carved Clue' },
          rect: { x: 446, y: 146, w: 44, h: 26 },
          walkTo: { x: 430, y: 230 },
          look: (state) => state.flags.amuletRisen
            ? { nl: 'De gekraste tekens gloeien rustig na.', en: 'The carved marks glow softly.' }
            : { nl: 'In de muur rechts van het altaar zijn vier tekens gekrast. Dat is de volgorde voor de tegels:\n●●● · ● · ●●●● · ●● (drie, één, vier, twee stippen).',
                en: 'Four marks are carved into the wall right of the altar. They show the order for the tiles:\n●●● · ● · ●●●● · ●● (three, one, four, two dots).' }
        },
        {
          id: 'doorTorch',
          name: { nl: 'Muurfakkel bij de Deur', en: 'Wall Torch by the Door' },
          rect: { x: 100, y: 86, w: 52, h: 70 },
          walkTo: { x: 128, y: 210 },
          look: (state) => state.flags.torchLit
            ? { nl: 'De muurfakkel naast de deur brandt hoog. Haar vuur heeft de hele tempel verlicht.', en: 'The wall torch beside the door burns high. Its fire lit up the whole temple.' }
            : state.inventory.includes('torch')
              ? { nl: 'De muurfakkel naast de deur is bijna uit. Houd je brandende fakkel erbij, dan springt het vuur over op alle toortsen.\n(Kies je fakkel in je tas en tik dan op de muurfakkel.)',
                  en: 'The wall torch beside the door has almost gone out. Hold your lit torch to it, and the fire will jump to every torch.\n(Pick your torch in your bag, then tap the wall torch.)' }
              : { nl: 'Naast de deur is één muurfakkel bijna uit. Met een eigen brandende fakkel kan ik de hele tempel verlichten.',
                  en: 'Beside the door, one wall torch has almost gone out. With a lit torch of my own, I could light up the whole temple.' },
          use: {
            torch: {
              consume: 'torch',
              setFlag: 'torchLit',
              text: {
                nl: 'Je houdt je brandende fakkel bij de muurfakkel. Het vuur springt over en raast langs de muren!\nDe grote toortsen bij het altaar laaien op. Warm licht vult de hele tempel.',
                en: 'You hold your lit torch to the wall torch. The fire leaps across and races along the walls!\nThe great torches by the altar blaze up. Warm light fills the whole temple.'
              }
            }
          }
        },
        {
          id: 'braziers',
          name: (state) => state.flags.torchLit
            ? { nl: 'Brandende Toortsen', en: 'Burning Torches' }
            : { nl: 'Gedoofde Toortsen', en: 'Unlit Torches' },
          rect: { x: 286, y: 114, w: 50, h: 46 },
          walkTo: { x: 300, y: 214 },
          look: (state) => state.flags.torchLit
            ? { nl: 'De grote toortsen bij het altaar branden hoog. Hun licht vult de hele tempel.', en: 'The great torches by the altar burn high. Their light fills the whole temple.' }
            : { nl: 'Naast het altaar staan twee grote toortsen, nog uit. Ze gaan vanzelf branden als je de muurfakkel bij de deur aansteekt.',
                en: 'Two great torches stand beside the altar, still unlit. They will catch by themselves once you light the wall torch by the door.' }
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
            : { nl: 'De minotaur gromt en zwaait met zijn zwaard. Hij is veel te sterk om mee te vechten.', en: 'The minotaur growls and waves his sword. He is far too strong to fight.' },
          angerTexts: [
            { nl: 'De minotaur stampt waarschuwend op de grond. Kom maar niet dichterbij.', en: 'The minotaur stamps the ground in warning. Better not come closer.' },
            { nl: 'Zijn ogen gloeien rood op en hij snuift luid. Laat hem nu maar met rust...', en: 'His eyes flare red and he snorts loudly. Best leave him alone now...' }
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
          requiresFlag: 'torchLit',
          blockedText: { nl: 'Het is veel te donker om de schaal te vinden. Steek eerst de muurfakkel bij de deur aan, dan gaan alle toortsen branden.',
                         en: 'It’s far too dark to find the bowl. First light the wall torch by the door, and all the torches will catch.' },
          look: (state) => state.flags.minotaurAsleep
            ? { nl: 'De schaal is leeg. Het beest heeft alles opgeslurpt.', en: 'The bowl is empty. The beast drank every last drop.' }
            : { nl: 'Een uit de vloer gehouwen drinkschaal, half gevuld met water.', en: 'A drinking bowl carved into the floor, half filled with water.' },
          use: {
            potion: {
              consume: 'potion',
              setFlag: 'minotaurAsleep',
              text: {
                nl: 'Je giet de Slaapdrank stiekem in de schaal. Het water fonkelt en glinstert.\nDe minotaur sjokt nieuwsgierig naar de schaal, drinkt gulzig... en valt in slaap. De weg naar het altaar is vrij!',
                en: 'You secretly pour the Sleeping Draught into the bowl. The water sparkles and glints.\nThe minotaur shuffles over, drinks greedily... and falls fast asleep. The way to the altar is clear!'
              }
            }
          }
        },
        {
          id: 'shrine',
          name: { nl: 'Altaar met Amulet', en: 'Altar with Amulet' },
          rect: { x: 292, y: 90, w: 80, h: 80 },
          walkTo: { x: 352, y: 232 },
          requiresFlag: 'amuletRisen',
          blockedText: (state) => !state.flags.torchLit
            ? { nl: 'Het is veel te donker bij het altaar. Steek eerst de toortsen aan.', en: 'It’s far too dark at the altar. Light the torches first.' }
            : !state.flags.minotaurAsleep
              ? { nl: 'De minotaur verspert de weg naar het altaar.', en: 'The minotaur blocks the way to the altar.' }
              : { nl: 'De amulet zit nog diep in het altaar. Tik eerst de vloertegels in de goede volgorde aan. De aanwijzing staat op de muur.',
                  en: 'The amulet is still locked inside the altar. First tap the floor tiles in the right order. The clue is on the wall.' },
          jigsaw: {
            requiresFlag: 'amuletRisen',
            setFlag: 'wardLifted',
            give: 'amulet', win: true,
            cols: 4, rows: 3,
            img: 'assets/art/amulet-seal.webp',
            title: { nl: 'Het Zegel van de Amulet', en: 'The Amulet Seal' },
            solvedText: {
              nl: 'De scherven klikken samen tot één geheel. Het laatste zegel breekt!\nDe Amulet van Emberfall is eindelijk van jou. Warm licht stroomt door je heen.',
              en: 'The shards click together into one. The final seal breaks!\nThe Amulet of Emberfall is finally yours. Warm light flows through you.'
            }
          },
          look: { nl: 'Het altaar is leeg; de amulet is van jou.', en: 'The altar is empty; the amulet is yours.' }
        },
        {
          id: 'toCourtyard',
          name: { nl: 'Terug naar de Binnenplaats', en: 'Back to the Courtyard' },
          rect: { x: 22, y: 84, w: 70, h: 148 },
          walkTo: { x: 78, y: 212 },
          arrow: { x: 56, y: 162, dir: 'left' },
          exit: {
            to: 'courtyard',
            travelText: { nl: 'Je keert terug naar de binnenplaats.', en: 'You return to the courtyard.' }
          }
        }
      ]
    }
  }
};
