/* ============================================================
   data.js — "Maanhoef" — een meisje redt het paard Maanhoef.
   Zelfde generieke engine als Emberfall; alleen deze data + art is uniek.
   Coördinaten zijn scene-pixels (568×320, liggend). Teksten zijn {nl,en}.
   Dieren (hond, uil, slang, paard) staan in de scene-art; hotspots liggen
   eroverheen. Alleen het meisje is een bewegende sprite (hero).
   ============================================================ */

const GAME = {
  title: { nl: 'Maanhoef', en: 'Moonhoof' },
  titleLines: { nl: ['Maanhoef'], en: ['Moonhoof'] },
  startScene: 'farm',
  assetVer: '51',

  sprites: {
    hero:      'assets/art/hero.png',
    heroWalk:  'assets/art/hero-walk.png',
    heroWalk2: 'assets/art/hero-walk2.png',
    heroWalk3: 'assets/art/hero-walk3.png',
    heroWave:  'assets/art/hero-wave.png',
    heroFlute: 'assets/art/hero-flute.png',
    heroFace:  'assets/art/hero-face.png',
    pup:       'assets/art/pup.png',
    pup2:      'assets/art/pup2.png',
    pupNoKey:  'assets/art/pup-nokey.png',
    pupNoKey2: 'assets/art/pup-nokey2.png',
    pupSit:    'assets/art/pup-sit.png',
    pupSitNoKey: 'assets/art/pup-sit-nokey.png',
    owl:       'assets/art/owl.png',
    mouse:     'assets/art/mouse.png',
    mouse2:    'assets/art/mouse2.png'
  },

  winText: {
    nl: 'Loïs klimt op Maanhoefs warme rug. Hij hinnikt blij en samen galopperen ze door de vallei, de gouden ochtend in. Loïs heeft haar liefste vriend gered!',
    en: 'Loïs climbs onto Moonhoof’s warm back. He whinnies happily, and together they gallop through the valley into the golden morning. Loïs has saved her dearest friend!'
  },

  strings: {
    noEffect:    { nl: 'Dat werkt hier niet.', en: 'That doesn’t work here.' },
    noCombine:   { nl: 'Die twee laten zich niet combineren.', en: 'Those two don’t combine.' },
    nothingThere:{ nl: 'Daar valt niets te ontdekken.', en: 'There’s nothing to find there.' }
  },

  ui: {
    subtitle:   { nl: 'Loïs en haar paard Maanhoef', en: 'Loïs and her horse Moonhoof' },
    intro:      { nl: 'Maanhoef, het liefste paard van Loïs, zit opgesloten in de oude stal. De sleutel hangt aan de halsband van een schuw hondje. Onderweg kom je een wijze uil en een sissende slang tegen. Help Loïs om Maanhoef te bevrijden!',
                  en: 'Moonhoof, Loïs’ dearest horse, is locked in the old stable. The key hangs on the collar of a shy little dog. On the way you’ll meet a wise owl and a hissing snake. Help Loïs set Moonhoof free!' },
    credit:     { nl: 'Een RetroAdventureWorld-avontuur', en: 'A RetroAdventureWorld adventure' },
    startBtn:   { nl: 'Begin het avontuur', en: 'Begin the adventure' },
    newGameBtn: { nl: 'Nieuw spel', en: 'New game' },
    continueBtn:{ nl: 'Verder spelen', en: 'Continue' },
    winTitle:   { nl: 'Maanhoef is vrij!', en: 'Moonhoof is free!' },
    replayBtn:  { nl: 'Opnieuw spelen', en: 'Play again' },
    deathTitle: { nl: 'Oeps...', en: 'Oops...' },
    deathText:  { nl: 'Dat liep niet goed af. Probeer het opnieuw.', en: 'That went badly. Try again.' },
    retryBtn:   { nl: 'Probeer opnieuw', en: 'Try again' },
    rotateTitle:{ nl: 'Draai je telefoon', en: 'Rotate your phone' },
    rotateText: { nl: 'Dit avontuur speelt liggend. Draai je scherm een kwartslag.',
                  en: 'This adventure plays in landscape. Turn your screen sideways.' },
    tapContinue:{ nl: 'tik om verder te gaan ▸', en: 'tap to continue ▸' },
    selected:   { nl: 'geselecteerd', en: 'selected' },
    homeConfirm:{ nl: 'Terug naar de homepagina? Je voortgang blijft bewaard op dit apparaat.', en: 'Back to the homepage? Your progress is saved on this device.' },
    hintBtn:    { nl: 'Toon wat je kunt aantikken', en: 'Show what you can tap' },
    soundBtn:   { nl: 'Geluid aan of uit', en: 'Sound on or off' },
    langBtn:    { nl: 'Switch to English', en: 'Wissel naar Nederlands' },
    homeBtn:    { nl: 'Terug naar de homepagina', en: 'Back to the homepage' },
    invLabel:   { nl: 'Rugzak', en: 'Backpack' },
    closeBtn:   { nl: 'Sluiten', en: 'Close' },

    q_owl:    { nl: 'Vraag de wijze uil om raad', en: 'Ask the wise owl for advice' },
    q_snake:  { nl: 'Een slang verspert het bospad — betover haar met de fluit', en: 'A snake blocks the forest path — charm it with the flute' },
    q_plank:  { nl: 'De brug naar de grot mist planken — haal een houten plank bij de stal', en: 'The bridge to the cave is missing planks — fetch a wooden plank from the stable' },
    q_bridge: { nl: 'Repareer de kapotte brug met de houten plank', en: 'Repair the broken bridge with the wooden plank' },
    q_cave:   { nl: 'De slang slaapt — steek de brug over, ga de grot in en herstel het runenzegel', en: 'The snake is asleep — cross the bridge, go into the cave and fix the rune seal' },
    q_seal:   { nl: 'Herstel het runenzegel in de grotwand', en: 'Fix the rune seal in the cave wall' },
    q_bone:   { nl: 'Maanhoef vertrouwt je! Haal nu de sleutel: het hondje is dol op botten — er ligt een oud bot in de grot', en: 'Moonhoof trusts you! Now get the key: the dog loves bones — there’s an old one in the cave' },
    q_statue: { nl: 'Plaats de diamant in het beeld zodat het water gaat stromen', en: 'Place the diamond in the statue so the water starts to flow' },
    q_dog:    { nl: 'Geef het hondje op het erf het bot — dan mag je de sleutel pakken', en: 'Give the dog in the farmyard the bone — then you can take the key' },
    q_bucket: { nl: 'Maanhoef heeft dorst — pak de houten emmer bij de stal', en: 'Moonhoof is thirsty — grab the wooden bucket at the stable' },
    q_fill:   { nl: 'Vul de emmer met water bij het beeld in de grot', en: 'Fill the bucket with water at the statue in the cave' },
    q_carrot:   { nl: 'Maanhoef vertrouwt je nog niet — pluk eerst een wortel uit de moestuin op het erf', en: 'Moonhoof doesn’t trust you yet — pick a carrot from the vegetable garden first' },
    q_feedhorse:{ nl: 'Geef Maanhoef de wortel om zijn vertrouwen te winnen', en: 'Give Moonhoof the carrot to earn his trust' },
    q_freehorse:{ nl: 'Geef Maanhoef de emmer water om hem te kalmeren', en: 'Give Moonhoof the bucket of water to calm him' },
    q_gate:   { nl: 'Maanhoef is gekalmeerd — haal nu het slot van de stalpoort met de sleutel', en: 'Moonhoof is calm now — unlock the stable gate with the key' },
    q_bridle_search: { nl: 'Maanhoef is vrij! Voor zijn hoofdstel heb je eerst het stuk kaas uit de stal nodig', en: 'Moonhoof is free! To get his bridle, first grab the cheese in the stable' },
    q_bridle_cheese: { nl: 'Geef de kaas aan het brutale muisje bij de oude kist op het erf', en: 'Give the cheese to the cheeky mouse by the old chest in the farmyard' },
    q_tackbox:       { nl: 'Open de oude kist op het erf — los het houten slot op', en: 'Open the old chest in the farmyard — solve the wooden lock' },
    q_bridle_on:     { nl: 'Tik op het hoofdstel en dan op Maanhoef om het om te doen', en: 'Tap the bridle, then tap Moonhoof to put it on' },
    q_ride:          { nl: 'Tik op Maanhoef om op te stijgen en samen weg te rijden!', en: 'Tap Moonhoof to climb on and ride off together!' }
  },

  items: {
    flute:   { name: { nl: 'Wilgenfluit', en: 'Willow Flute' }, icon: '🪈', img: 'assets/art/item-flute.png',
               tapAnim: 'flute', tapAnimDur: 6000, tapSound: 'willow-flute',
               noUseText: { nl: 'Een vrolijk wijsje, maar hier gebeurt niets. Misschien vindt de slang het mooi?', en: 'A cheerful tune, but nothing happens here. Maybe the snake would like it?' } },
    bone:    { name: { nl: 'Oud Bot', en: 'Old Bone' }, icon: '🦴', img: 'assets/art/item-bone.png',
               noUseText: { nl: 'Dit bot is niets voor hier. Het hondje op het erf zou er dol op zijn!', en: 'This bone isn’t for here. The dog in the farmyard would love it!' } },
    key:     { name: { nl: 'Stalsleutel', en: 'Stable Key' }, icon: '🗝️', img: 'assets/art/item-key.png',
               noUseText: { nl: 'Deze sleutel past op de poort van de stal.', en: 'This key fits the stable gate.' } },
    bucket:      { name: { nl: 'Lege Emmer', en: 'Empty Bucket' }, icon: '🪣', img: 'assets/art/item-bucket.png',
                   noUseText: { nl: 'Daar valt niets te scheppen.', en: 'Nothing to scoop here.' } },
    bucketWater: { name: { nl: 'Emmer Water', en: 'Bucket of Water' }, icon: '🪣', img: 'assets/art/item-bucket-water.png',
                   noUseText: { nl: 'Hier heb ik geen water voor nodig.', en: 'No need for water here.' } },
    diamond: { name: { nl: 'Diamant', en: 'Diamond' }, icon: '💎', img: 'assets/art/item-diamond.png',
               noUseText: { nl: 'Dit hoort hier niet.', en: 'This doesn’t belong here.' } },
    plank:   { name: { nl: 'Houten Plank', en: 'Wooden Plank' }, icon: '🪵', img: 'assets/art/item-plank.png',
               noUseText: { nl: 'Daar heb ik die plank niet voor nodig.', en: 'No need for the plank here.' } },
    cheese:  { name: { nl: 'Stuk Kaas', en: 'Piece of Cheese' }, icon: '🧀', img: 'assets/art/item-cheese.png',
               noUseText: { nl: 'Deze kaas bewaar ik voor het muisje op het erf.', en: 'I’ll save this cheese for the mouse in the farmyard.' } },
    bridle:  { name: { nl: 'Hoofdstel', en: 'Bridle' }, icon: '🐴', img: 'assets/art/item-bridle.png',
               noUseText: { nl: 'Het hoofdstel is voor Maanhoef — doe het hem om.', en: 'The bridle is for Moonhoof — put it on him.' } },
    carrot:  { name: { nl: 'Wortel', en: 'Carrot' }, icon: '🥕', img: 'assets/art/item-carrot.png',
               noUseText: { nl: 'De wortel is een lekkernij voor Maanhoef.', en: 'The carrot is a treat for Moonhoof.' } }
  },

  recipes: [],

  /* Questhint-regels — eerste match wint; quest:null verbergt de hint. */
  questRules: [
    { when: { flag: 'bridleOn' },                          quest: 'q_ride' },
    { when: { flag: 'gateOpen', has: 'bridle' },           quest: 'q_bridle_on' },
    { when: { flag: 'mouseFed', notHas: 'bridle' },        quest: 'q_tackbox' },
    { when: { flag: 'gateOpen', has: 'cheese' },           quest: 'q_bridle_cheese' },
    { when: { flag: 'gateOpen' },                          quest: 'q_bridle_search' },
    { when: { flag: 'horseWatered', has: 'key' },          quest: 'q_gate' },
    { when: { flag: 'horseWatered', has: 'bone' },         quest: 'q_dog' },
    { when: { flag: 'horseWatered' },                      quest: 'q_bone' },
    { when: { has: 'carrot', notFlag: 'horseFed' },        quest: 'q_feedhorse' },
    { when: { has: 'bucketWater', flag: 'horseFed' },      quest: 'q_freehorse' },
    { when: { has: 'bucketWater', notFlag: 'horseFed' },   quest: 'q_carrot' },
    { when: { flag: 'waterFlowing', has: 'bucket' },       quest: 'q_fill' },
    { when: { flag: 'waterFlowing', notHas: 'bucket' },    quest: 'q_bucket' },
    { when: { has: 'diamond' },                            quest: 'q_statue' },
    { when: { has: 'bone' },                               quest: 'q_dog' },
    { when: { flag: 'snakeCharmed', notFlag: 'bridgeFixed', has: 'plank' }, quest: 'q_bridge' },
    { when: { flag: 'snakeCharmed', notFlag: 'bridgeFixed' }, quest: 'q_plank' },
    { when: { flag: ['snakeCharmed', 'visited_cave'], notFlag: 'sealSolved' }, quest: 'q_seal' },
    { when: { flag: 'snakeCharmed', notFlag: 'sealSolved' }, quest: 'q_cave' },
    { when: { has: 'flute', notFlag: 'snakeCharmed' },     quest: 'q_snake' },
    { when: {},                                            quest: 'q_owl' }
  ],

  scenes: {

    /* ---------- Gebied 1: Het Boerenerf ---------- */
    farm: {
      name: { nl: 'Het Boerenerf', en: 'The Farmyard' },
      bg: 'assets/art/scene-farm.webp',
      entryText: {
        nl: 'Het boerenerf in het ochtendlicht. Een schuw hondje dribbelt door het gras en een wijze uil houdt de wacht. Tik ergens op om erheen te lopen.',
        en: 'The farmyard in the morning light. A shy little dog trots through the grass and a wise owl keeps watch. Tap anywhere to walk there.'
      },
      playerStart: { x: 300, y: 276 },
      spawnFrom: {
        grove: { x: 70, y: 262 },
        stable: { x: 498, y: 262 }
      },
      walkPoly: [ [20, 224], [430, 224], [430, 204], [564, 204], [564, 308], [20, 308] ],
      obstacles: [],
      overlays: [
        { img: 'assets/art/chest-closed.png', x: 54, y: 183, base: 224, notFlag: 'tackSolved' },
        { img: 'assets/art/chest-open.png',   x: 56, y: 180, base: 224, requiresFlag: 'tackSolved' }
      ],
      worldItems: [
        { item: 'carrot', hotspot: 'moestuin', x: 245, y: 150, h: 17 }   // zichtbare wortel in de moestuin
      ],
      npcs: [
        { id: 'dog', sprite: 'pup', sprite2: 'pup2', idleSprite: 'pupSit', scale: 0.66, idleScale: 0.74, x: 188, y: 274,
          altSprite: { flag: 'dogFriendly', sprite: 'pupNoKey', sprite2: 'pupNoKey2', idleSprite: 'pupSitNoKey' },
          fleeBox: { x: 90, y: 256, w: 270, h: 36 },
          fleeFrom: 'player', fleeRadius: 78, fleeSpeed: 86, fleeUnlessHas: 'bone', fleeUntilFlag: 'dogFriendly' },
        { id: 'owl', sprite: 'owl', x: 511, y: 112, blinkEye: { frac: 0.27, halfW: 8 } },
        { id: 'mouse', sprite: 'mouse', sprite2: 'mouse2', scale: 0.62, x: 92, y: 236, hideFlag: 'mouseFed',
          wander: { x: 66, y: 228, w: 64, h: 24, speed: 16, pauseMin: 500, pauseMax: 2200, anywhere: true } }
      ],
      hotspots: [
        {
          id: 'dog',
          name: { nl: 'Schuw Hondje', en: 'Shy Dog' },
          followNpc: 'dog',
          speaker: true,
          rect: { x: 104, y: 198, w: 58, h: 64 },
          walkTo: { x: 184, y: 268 },
          look: (state) => state.flags.dogFriendly
            ? { nl: 'Het hondje kwispelt blij om je heen, blij met zijn bot.', en: 'The dog wags happily around you, pleased with its bone.' }
            : [ { nl: 'Zodra je dichterbij komt, rent het puppy kwispelend weg. Aan zijn rode halsband bungelt een sleuteltje!',
                  en: 'The moment you get close, the puppy runs off, wagging its tail. A little key dangles from its red collar!' },
                { nl: 'Misschien blijft hij wél staan voor iets lekkers...', en: 'Maybe he would stay for a treat...' } ],
          use: {
            bone: {
              consume: 'bone',
              setFlag: 'dogFriendly',
              give: 'key',
              text: {
                nl: 'Je legt het oude bot voor het hondje neer. Hij knaagt er blij op, kwispelt wild — en laat je de Stalsleutel van zijn halsband halen!',
                en: 'You put the old bone down for the dog. He chews it happily, wags wildly — and lets you take the Stable Key from his collar!'
              }
            }
          }
        },
        {
          id: 'owl',
          name: { nl: 'Wijze Uil', en: 'Wise Owl' },
          followNpc: 'owl',
          face: 'assets/art/face-owl.png',
          rect: { x: 488, y: 84, w: 50, h: 58 },
          walkTo: { x: 486, y: 276 },
          speaker: true,
          riddle: {
            setFlag: 'owlSolved',
            reward: 'flute',
            title: { nl: 'Het Raadsel van de Uil', en: 'The Owl’s Riddle' },
            intro: {
              nl: '“Oehoe. Wil je Maanhoef redden? Los eerst mijn twee raadsels op, dan krijg je iets om de slang mee te kalmeren.”',
              en: '“Hoo. You want to save Moonhoof? Solve my two riddles first, and I’ll give you something to calm the snake.”'
            },
            questions: [
              {
                q: { nl: 'Raadsel 1: “Ik heb vier benen en lange manen. Ik hinnik, ik galoppeer en ik ben dol op wortels. Wat ben ik?”',
                     en: 'Riddle 1: “I have four legs and a long mane. I neigh, I gallop and I love carrots. What am I?”' },
                answers: [
                  { t: { nl: 'Een paard', en: 'A horse' }, ok: true },
                  { t: { nl: 'Een stoel', en: 'A chair' }, ok: false },
                  { t: { nl: 'Een schaduw', en: 'A shadow' }, ok: false }
                ]
              },
              {
                q: { nl: 'Raadsel 2: “Ik ben van hout en zit vol gaatjes. Blaas in mij en ik zing een slaapliedje, zelfs voor een slang. Wat ben ik?”',
                     en: 'Riddle 2: “I am made of wood and full of little holes. Blow into me and I sing a sleepy song, even for a snake. What am I?”' },
                answers: [
                  { t: { nl: 'Een fluit', en: 'A flute' }, ok: true },
                  { t: { nl: 'De regen', en: 'The rain' }, ok: false },
                  { t: { nl: 'Een klok', en: 'A bell' }, ok: false }
                ]
              }
            ],
            wrongText: { nl: '“Oehoe... nee, dat is het niet. Probeer het nog eens!”', en: '“Hoo... no, that’s not it. Try again!”' },
            solvedText: {
              nl: '“Goed zo!” De uil laat een gladde Wilgenfluit in je handen vallen. “Speel ervoor de slang in het bos. Van een wijsje wordt ze slaperig.”',
              en: '“Well done!” The owl drops a smooth Willow Flute into your hands. “Play it for the snake in the forest. A tune makes her sleepy.”'
            }
          },
          look: {
            nl: 'De wijze uil kijkt je aan met grote gele ogen. “Het bos ligt links, de stal rechts.”',
            en: 'The wise owl looks at you with big golden eyes. “The forest is to the left, the stable to the right.”'
          }
        },
        {
          id: 'well',
          name: { nl: 'Oude Put', en: 'Old Well' },
          rect: { x: 336, y: 190, w: 62, h: 74 },
          walkTo: { x: 362, y: 294 },
          look: {
            nl: 'Je kijkt in de oude put. Hij is helemaal droog en de emmer is kapot. Hier kun je geen water halen.',
            en: 'You look into the old well. It’s completely dry and the bucket is broken. You can’t get water here.'
          }
        },
        {
          id: 'moestuin',
          name: { nl: 'Moestuin', en: 'Vegetable Garden' },
          rect: { x: 126, y: 86, w: 142, h: 78 },
          walkTo: { x: 214, y: 244 },
          gives: {
            item: 'carrot',
            giveText: { nl: 'Je trekt een mooie verse wortel uit de grond — lekker voor een paard!', en: 'You pull a fine fresh carrot out of the ground — a yummy treat for a horse!' },
            emptyText: { nl: 'Eén verse wortel is genoeg; de rest laat je staan.', en: 'One fresh carrot is enough; you leave the rest.' }
          }
        },
        {
          id: 'mouse',
          name: { nl: 'Brutaal Muisje', en: 'Cheeky Mouse' },
          followNpc: 'mouse',
          speaker: true,
          notFlag: 'mouseFed',                       // muis (en hotspot) verdwijnt zodra hij gevoerd is
          rect: { x: 74, y: 220, w: 36, h: 32 },
          walkTo: { x: 104, y: 282 },
          look: { nl: 'Een brutaal muisje zit pal vóór de oude kist en piept naar je. Zolang het daar zit, kun je niet bij de kist. Het lust vast wel iets lekkers...', en: 'A cheeky mouse sits right in front of the old chest, squeaking at you. While it sits there, you can’t reach the chest. It would surely love a treat...' },
          use: {
            cheese: {
              consume: 'cheese',
              setFlag: 'mouseFed',
              text: {
                nl: 'Je legt de kaas neer. Het muisje grijpt hem blij en rent de struiken in. De kist is vrij — maar er zit een houten slot op...',
                en: 'You put the cheese down. The mouse happily grabs it and scurries into the bushes. The chest is free — but it has a wooden lock...'
              }
            }
          }
        },
        {
          id: 'tackbox',
          name: { nl: 'Oude Kist', en: 'Old Chest' },
          rect: { x: 40, y: 176, w: 78, h: 56 },
          walkTo: { x: 80, y: 284 },
          requiresFlag: 'mouseFed',
          blockedText: { nl: 'Het brutale muisje zit pal vóór de kist. Geef het eerst een stuk kaas, dan kun je de kist openmaken.', en: 'The cheeky mouse sits right in front of the chest. Give it some cheese first, then you can open the chest.' },
          slidePuzzle: {
            img: 'assets/art/tackbox.webp',
            size: 3,
            setFlag: 'tackSolved',
            give: 'bridle',
            title: { nl: 'Het Slot van de Oude Kist', en: 'The Old Chest Lock' },
            solvedText: {
              nl: 'Klik! Het slot springt open. In de kist ligt Maanhoefs leren hoofdstel — je pakt het eruit. Breng het naar Maanhoef bij de stal.',
              en: 'Click! The lock springs open. Inside the chest lies Moonhoof’s leather bridle — you take it out. Bring it to Moonhoof at the stable.'
            },
            burst: { x: 78, y: 220 }
          },
          look: { nl: 'De oude kist staat open; het hoofdstel heb je eruit gehaald.', en: 'The old chest is open; you’ve taken the bridle out.' }
        },
        {
          id: 'toGrove',
          name: { nl: 'Pad naar het Bos', en: 'Path to the Forest' },
          rect: { x: 0, y: 168, w: 46, h: 134 },
          walkTo: { x: 58, y: 252 },
          arrow: { x: 24, y: 196, dir: 'left' },
          exit: { to: 'grove', travelText: { nl: 'Je volgt het pad het wilgenbos in...', en: 'You follow the path into the willow forest...' } }
        },
        {
          id: 'toStable',
          name: { nl: 'Pad naar de Stal', en: 'Path to the Stable' },
          rect: { x: 522, y: 168, w: 46, h: 134 },
          walkTo: { x: 510, y: 252 },
          arrow: { x: 544, y: 196, dir: 'right' },
          exit: { to: 'stable', travelText: { nl: 'Je loopt naar de oude stal...', en: 'You walk to the old stable...' } }
        }
      ]
    },

    /* ---------- Gebied 2: Het Wilgenbos ---------- */
    grove: {
      name: { nl: 'Het Wilgenbos', en: 'The Willow Forest' },
      bg: 'assets/art/scene-grove-broken.webp',
      bgVariants: [ { img: 'assets/art/scene-grove.webp', flag: 'bridgeFixed' } ],
      entryText: [
        { nl: 'Een open plek met een ruisende waterval. In de boom kronkelt een grote slang die naar je sist.',
          en: 'A clearing with a rushing waterfall. A big snake is curled up in the tree, hissing at you.' },
        { nl: 'Links, bij een stenen boog, is een donkere grot. Maar de brug over de beek mist planken.',
          en: 'To the left, by a stone arch, is a dark cave. But the bridge over the stream is missing planks.' }
      ],
      playerStart: { x: 498, y: 286 },
      spawnFrom: { farm: { x: 498, y: 286 }, cave: { x: 178, y: 208 } },   // uit de grot: sta bovenin bij de grot
      walkable: [
        { x: 112, y: 290, w: 452, h: 26 },  // voorgrond-bank, onder de waterpoel (verbindt links↔rechts; meer ruimte tussen brug en slang)
        { x: 396, y: 206, w: 168, h: 108 }, // rechtergras + het trapje (ruimer)
        { x: 44, y: 180, w: 164, h: 130 }   // brug + linkerpad omhoog naar de grot (ruimer, tot bij de boog)
      ],
      fx: {
        waterfall: { x: 282, y: 64, w: 44, h: 82, streaks: 14, slant: 0.16, len: 4 },  // stopt bij de tak/slang (niet er doorheen)
        butterfly: [
          { x: 410, y: 150, rx: 54, ry: 30, col: '255,170,210', phase: 0 },   // roze vlinder bij de boom
          { x: 150, y: 168, rx: 40, ry: 24, col: '250,225,120', phase: 3 }     // gele vlinder bij de boog
        ],
        snakeTongue: { x: 316, y: 210, dx: -0.05, dy: 1, len: 10, hideFlag: 'snakeCharmed' },
        snakeBlink: { x: 307, y: 202, halfW: 3, awakeFlag: 'snakeCharmed' },  // knippert zolang ze wakker is
        zzz: { x: 322, y: 174, flag: 'snakeCharmed' }
      },
      obstacles: [
        { x: 244, y: 274, w: 142, h: 46, notFlag: 'snakeCharmed' },   // wakkere slang blokkeert de HELE strook (geen langsglippen)
        { x: 132, y: 196, w: 106, h: 120, notFlag: 'bridgeFixed' },   // kapotte brug: geen oversteek zonder plank
        { x: 16, y: 250, w: 96, h: 70 },    // beek ONDER/links van de brug — niet op het water lopen
        { x: 184, y: 166, w: 88, h: 100 }   // waterpoel BOVEN/rechts van de brug — niet op het water lopen
      ],
      overlays: [],
      worldItems: [],
      hotspots: [
        {
          id: 'snake',
          name: { nl: 'Sissende Slang', en: 'Hissing Snake' },
          rect: { x: 252, y: 126, w: 148, h: 96 },
          walkTo: { x: 366, y: 302 },
          speaker: true,
          face: 'assets/art/face-snake.png',
          clickSound: 'snake-rattle',
          clickVol: 0.7,
          clickBoost: 1.7,            // ratel zachter
          choice: {
            skipFlag: 'snakeCharmed',
            sound: 'snake-rattle',
            soundBoost: 1.7,          // ratel zachter
            firstSound: 'snake-grot',
            firstSoundBoost: 12,      // slang-stem harder
            image: 'assets/art/face-snake.png',
            title: { nl: 'De Sissende Slang', en: 'The Hissing Snake' },
            question: { nl: '“Ssss... kom eens dichterbij, dan vertel ik je een geheim over de grot...” Haar tanden glinsteren. Wat doe je?',
                        en: '“Ssss... come closer, and I’ll tell you a secret about the cave...” Her sharp teeth glint. What do you do?' },
            options: [
              { t: { nl: '🎶 Speel op de fluit', en: '🎶 Play the flute' },
                has: 'flute',
                useItem: 'flute' },
              { t: { nl: '👂 Luister naar haar geheim', en: '👂 Listen to her secret' },
                text: (state) => state.inventory.includes('flute')
                  ? { nl: 'Je buigt je naar haar toe... SSSSS! Ze sist zo hard dat je geschrokken achteruit springt. Pfoe! Vertrouw haar niet — speel liever op je fluit.',
                      en: 'You lean in closer... SSSSS! She hisses so loudly that you jump back in fright. Phew! Don’t trust her — play your flute instead.' }
                  : { nl: 'Je buigt je naar haar toe... SSSSS! Ze sist zo hard dat je geschrokken achteruit springt. Pfoe! Misschien weet de wijze uil op het erf hoe je haar kalmeert.',
                      en: 'You lean in closer... SSSSS! She hisses so loudly that you jump back in fright. Phew! Maybe the wise owl in the farmyard knows how to calm her.' } },
              { t: { nl: '🚫 Vertrouw haar niet', en: '🚫 Don’t trust her' },
                text: (state) => state.inventory.includes('flute')
                  ? { nl: 'Slim! Je stapt achteruit. Een slang vertelt geen geheimen voor niets... Speel liever op je wilgenfluit.',
                      en: 'Smart! You step back. A snake doesn’t tell secrets for free... Better play your willow flute.' }
                  : { nl: 'Slim! Je stapt achteruit. Misschien weet de wijze uil op het erf hoe je haar kalmeert.',
                      en: 'Smart! You step back. Maybe the wise owl in the farmyard knows how to calm her.' } }
            ]
          },
          look: (state) => state.flags.snakeCharmed
            ? { nl: 'De slang slaapt diep en snurkt zachtjes. De weg is vrij.', en: 'The snake is fast asleep, snoring softly. The way is clear.' }
            : { nl: 'De slang wiegt zacht heen en weer en wil je iets in je oor fluisteren. Vertrouw haar niet!',
                en: 'The snake sways softly and wants to whisper in your ear. Don’t trust her!' },
          use: {
            flute: {
              anim: 'flute',
              animDur: 6000,
              sound: 'willow-flute',
              setFlag: 'snakeCharmed',
              text: {
                nl: 'Je speelt een zacht wijsje op de Wilgenfluit. De slang wiegt mee en haar ogen vallen dicht. Z z z... ze slaapt! De weg is vrij.',
                en: 'You play a soft tune on the Willow Flute. The snake sways along and her eyes close. Z z z... she’s asleep! The way is clear.'
              }
            }
          }
        },
        {
          id: 'bridge',
          name: { nl: 'Houten Brug', en: 'Wooden Bridge' },
          rect: { x: 50, y: 244, w: 120, h: 60 },
          walkTo: { x: 196, y: 300 },
          look: (state) => state.flags.bridgeFixed
            ? { nl: 'De brug is weer stevig. Tik op de stenen boog om de grot in te gaan.', en: 'The bridge is sturdy again. Tap the stone arch to go into the cave.' }
            : { nl: 'De houten brug over de beek mist een paar planken. Zo kun je er niet overheen. Met een stevige plank kun je hem maken.', en: 'The wooden bridge over the stream is missing a few planks. You can’t cross it like this. A sturdy plank would fix it.' },
          onTap: {
            needsItem: 'plank',
            consume: 'plank',
            setFlag: 'bridgeFixed',
            text: {
              nl: 'Je legt de plank over het gat en stampt hem vast. De brug is weer heel! Tik nu op de stenen boog om de grot in te gaan.',
              en: 'You lay the plank over the gap and stamp it down. The bridge is fixed! Now tap the stone arch to go into the cave.'
            }
          },
          use: {
            plank: {
              consume: 'plank',
              setFlag: 'bridgeFixed',
              text: {
                nl: 'Je legt de plank over het gat en stampt hem vast. De brug is weer heel! Tik nu op de stenen boog om de grot in te gaan.',
                en: 'You lay the plank over the gap and stamp it down. The bridge is fixed! Now tap the stone arch to go into the cave.'
              }
            }
          }
        },
        {
          id: 'toCave',
          name: { nl: 'Stenen Boog', en: 'Stone Arch' },
          rect: { x: 184, y: 48, w: 92, h: 100 },
          walkTo: { x: 176, y: 214 },
          arrow: { x: 228, y: 70, dir: 'up' },
          requiresFlag: [ 'snakeCharmed', 'bridgeFixed' ],
          blockedText: (state) => state.flags.snakeCharmed
            ? { nl: 'De brug over de beek is kapot, dus je komt niet bij de boog. Maak hem eerst met een plank.', en: 'The bridge over the stream is broken, so you can’t reach the arch. Fix it with a plank first.' }
            : { nl: 'De sissende slang verspert de weg. Kalmeer haar eerst.', en: 'The hissing snake blocks the way. Calm her down first.' },
          exit: { to: 'cave', travelText: { nl: 'Je steekt de brug over en glipt door de stenen boog de koele grot in...', en: 'You cross the bridge and slip through the stone arch into the cool cave...' } }
        },
        {
          id: 'toFarm',
          name: { nl: 'Pad naar het Erf', en: 'Path to the Farmyard' },
          rect: { x: 522, y: 168, w: 46, h: 134 },
          walkTo: { x: 505, y: 288 },
          arrow: { x: 544, y: 196, dir: 'right' },
          exit: { to: 'farm', travelText: { nl: 'Je keert terug naar het boerenerf.', en: 'You head back to the farmyard.' } }
        }
      ]
    },

    /* ---------- Gebied 4: De Kristalgrot ---------- */
    cave: {
      name: { nl: 'De Kristalgrot', en: 'The Crystal Cave' },
      music: 'assets/audio/velvet-compass.mp3',   // eigen grot-muziek (vervang door aangeleverd bestand)
      bg: 'assets/art/scene-cave-dry.webp',
      bgVariants: [ { img: 'assets/art/scene-cave.webp', flag: 'waterFlowing' } ],
      entryText: [
        { nl: 'Een koele grot vol gloeiende kristallen. Een stenen beeld staat boven een droog waterbekken.',
          en: 'A cool cave full of glowing crystals. A stone statue stands above a dry water basin.' },
        { nl: 'In de wand zit een kapot runenzegel. En in het donkere hoekje bij het beeld ligt een oud bot.',
          en: 'In the wall is a broken rune seal. And in the dark corner by the statue lies an old bone.' }
      ],
      playerStart: { x: 120, y: 286 },
      spawnFrom: { grove: { x: 120, y: 286 } },
      walkable: [ { x: 48, y: 248, w: 264, h: 56 }, { x: 48, y: 276, w: 452, h: 30 } ],
      fx: {
        drips: [
          { x: 198, y: 22, to: 150, period: 2400, phase: 0 },
          { x: 366, y: 18, to: 138, period: 2900, phase: 1300 },
          { x: 96, y: 30, to: 168, period: 3300, phase: 700 }
        ],
        shade: [ { x: 454, y: 262, r: 30, a: 0.55 } ],   // schaduwhoekje waar het bot verstopt ligt
        sparkles: { x: 210, y: 62, w: 116, h: 84, n: 14, speed: 700, hideFlag: 'sealSolved' }   // glinstering in de wand bij het runenzegel
      },
      obstacles: [],
      overlays: [],
      worldItems: [
        { item: 'bone', hotspot: 'bone', x: 454, y: 264 }
      ],
      hotspots: [
        {
          id: 'seal',
          name: { nl: 'Runenzegel', en: 'Rune Seal' },
          rect: { x: 206, y: 58, w: 124, h: 92 },
          walkTo: { x: 256, y: 290 },
          jigsaw: {
            img: 'assets/art/cave-seal.webp',
            cols: 4, rows: 3,
            setFlag: 'sealSolved',
            give: 'diamond',
            title: { nl: 'Het Runenzegel', en: 'The Rune Seal' },
            solvedText: {
              nl: 'De stukjes passen! Het zegel gloeit op en een stenen luikje schuift open. Er rolt een fonkelende Diamant in je hand!',
              en: 'The pieces fit! The seal glows and a little stone door slides open. A sparkling Diamond rolls into your hand!'
            },
            burst: { x: 256, y: 96 }
          },
          look: {
            nl: 'Het herstelde runenzegel gloeit zacht in de wand.',
            en: 'The restored rune seal glows softly in the wall.'
          }
        },
        {
          id: 'statue',
          name: { nl: 'Waterbeeld', en: 'Water Statue' },
          rect: { x: 398, y: 48, w: 164, h: 186 },
          walkTo: { x: 360, y: 292 },
          look: (state) => state.flags.waterFlowing
            ? { nl: 'De diamant fonkelt in het voorhoofd van het beeld en helder water klatert in het bekken. Hier kun je een emmer vullen.',
                en: 'The diamond sparkles in the statue’s forehead and clear water splashes into the basin. You can fill a bucket here.' }
            : { nl: 'Een rustig stenen beeld boven een droog bekken. In haar voorhoofd zit een leeg gaatje in de vorm van een diamant.',
                en: 'A calm stone statue above a dry basin. In her forehead is an empty hole shaped like a diamond.' },
          use: {
            diamond: {
              consume: 'diamond',
              setFlag: 'waterFlowing',
              text: {
                nl: 'Je drukt de Diamant in het voorhoofd van het beeld. De ogen lichten op — en helder water klatert weer in het bekken!',
                en: 'You press the Diamond into the statue’s forehead. Its eyes light up — and clear water splashes into the basin again!'
              }
            },
            bucket: {
              requiresFlag: 'waterFlowing',
              requiresText: { nl: 'Het bekken is droog. Laat eerst het water weer stromen.', en: 'The basin is dry. Get the water flowing again first.' },
              consume: 'bucket',
              give: 'bucketWater',
              text: {
                nl: 'Je houdt de emmer onder de waterstraal van het beeld. Klaterend vult hij zich met helder, koel water.',
                en: 'You hold the bucket under the statue’s stream. It fills with clear, cool water with a splash.'
              }
            }
          }
        },
        {
          id: 'bone',
          name: { nl: 'Oud Bot', en: 'Old Bone' },
          rect: { x: 430, y: 240, w: 52, h: 52 },
          walkTo: { x: 452, y: 296 },
          gives: {
            item: 'bone',
            giveText: { nl: 'In het donkere hoekje bij het beeld ligt een oud bot. Je raapt het op — precies iets voor een speels hondje!', en: 'In the dark corner by the statue lies an old bone. You pick it up — just the thing for a playful dog!' },
            emptyText: { nl: 'Verder geen botten meer.', en: 'No more bones here.' }
          }
        },
        {
          id: 'toGrove',
          name: { nl: 'Terug naar het Bos', en: 'Back to the Forest' },
          rect: { x: 0, y: 88, w: 98, h: 178 },
          walkTo: { x: 116, y: 288 },
          arrow: { x: 30, y: 150, dir: 'left' },
          exit: { to: 'grove', travelText: { nl: 'Je loopt door de boog terug het bos in.', en: 'You walk back out through the arch into the forest.' } }
        }
      ]
    },

    /* ---------- Gebied 3: De Oude Stal ---------- */
    stable: {
      name: { nl: 'De Oude Stal', en: 'The Old Stable' },
      bg: 'assets/art/scene-stable.webp',
      bgVariants: [
        { img: 'assets/art/scene-stable-open.webp', flag: 'gateOpen' },
        { img: 'assets/art/scene-stable-water.webp', flag: 'horseWatered' }
      ],
      entryText: {
        nl: 'De oude stal in de ochtendzon. Achter de gesloten poort staat Maanhoef. Hij kijkt je hoopvol aan.',
        en: 'The old stable in the morning sun. Behind the locked gate stands Moonhoof. He looks at you hopefully.'
      },
      playerStart: { x: 120, y: 266 },
      spawnFrom: { farm: { x: 110, y: 266 } },
      walkPoly: [ [60, 274], [120, 256], [300, 250], [432, 262], [486, 288], [486, 308], [60, 308] ],  // alleen de open binnenplaats (paars), niet in de stal/manger lopen
      obstacles: [],
      overlays: [
        { img: 'assets/art/horse-free.png',    x: 164, y: 120, base: 214, requiresFlag: 'gateOpen', notFlag: 'bridleOn' },
        { img: 'assets/art/horse-bridled.png', x: 164, y: 120, base: 214, requiresFlag: 'bridleOn' }
      ],
      worldItems: [
        { item: 'bucket', hotspot: 'bucket', x: 196, y: 244, h: 28 },
        { item: 'plank', hotspot: 'plank', x: 430, y: 282, h: 44 },             // groter + lager, beter zichtbaar
        { item: 'cheese', hotspot: 'haysearch', x: 417, y: 160, h: 20, requiresFlag: 'gateOpen' }  // kaas in het stro (10px naar links + iets omhoog)
      ],
      npcs: [],
      hotspots: [
        {
          id: 'plank',
          name: { nl: 'Houten Plank', en: 'Wooden Plank' },
          rect: { x: 400, y: 244, w: 66, h: 64 },
          walkTo: { x: 430, y: 296 },
          gives: {
            item: 'plank',
            giveText: { nl: 'Je pakt een stevige houten plank op. Handig om iets mee te repareren!', en: 'You pick up a sturdy wooden plank. Handy for fixing something!' },
            emptyText: { nl: 'Verder geen planken meer.', en: 'No more planks here.' }
          }
        },
        {
          id: 'horse',
          name: { nl: 'Maanhoef', en: 'Moonhoof' },
          notFlag: 'gateOpen',                       // na de bevrijding: zie 'stall' (lege stal)
          rect: { x: 296, y: 66, w: 132, h: 120 },
          walkTo: { x: 344, y: 268 },
          clickSound: 'horse-whinny',
          clickVoice: 'bucket-empty',
          look: (state) => state.flags.gateOpen
            ? { nl: 'De stal is leeg — Maanhoef staat nu vrij op het erf van de stal.', en: 'The stall is empty — Moonhoof now stands free in the yard.' }
            : state.flags.horseWatered
              ? { nl: 'Maanhoef is rustig en vertrouwt je. Nu kun je de poort openmaken.', en: 'Moonhoof is calm and trusts you. Now you can unlock the gate.' }
              : state.flags.horseFed
                ? { nl: 'Maanhoef heeft de wortel opgesmikkeld en kijkt al vriendelijker. Maar hij heeft dorst — geef hem water.', en: 'Moonhoof gobbled up the carrot and looks friendlier already. But he’s thirsty — give him some water.' }
                : [ { nl: 'Maanhoef, een warm bruin paard, stapt bang achteruit. “Ik vertrouw je nog niet,” lijkt hij te zeggen.', en: 'Moonhoof, a warm brown horse, steps back, scared. “I don’t trust you yet,” he seems to say.' },
                    { nl: 'Verwen hem eerst met een lekkere wortel uit de moestuin op het erf.', en: 'Spoil him first with a tasty carrot from the vegetable garden in the farmyard.' } ],
          use: {
            carrot: {
              consume: 'carrot',
              setFlag: 'horseFed',
              text: {
                nl: 'Je houdt Maanhoef de wortel voor. Hij snuffelt voorzichtig en knabbelt hem dan op. Hij begint je te vertrouwen! Geef hem nu wat water.',
                en: 'You hold out the carrot to Moonhoof. He sniffs it carefully, then munches it up. He’s starting to trust you! Now give him some water.'
              }
            },
            bucketWater: {
              requiresFlag: 'horseFed',
              requiresText: { nl: 'Maanhoef is nog te schuw om te drinken. Geef hem eerst een wortel uit de moestuin.', en: 'Moonhoof is still too shy to drink. Give him a carrot from the vegetable garden first.' },
              consume: 'bucketWater',
              setFlag: 'horseWatered',
              text: {
                nl: 'Maanhoef drinkt gulzig uit de emmer en duwt dan blij zijn neus in je hand. Nu vertrouwt hij je! Je kunt de poort openmaken.',
                en: 'Moonhoof drinks thirstily from the bucket, then happily nuzzles your hand. Now he trusts you! You can unlock the gate.'
              }
            }
          }
        },
        {
          id: 'stall',
          name: { nl: 'Lege Stal', en: 'Empty Stall' },
          showFlag: 'gateOpen',
          rect: { x: 296, y: 66, w: 132, h: 120 },
          walkTo: { x: 344, y: 268 },
          look: { nl: 'De stal is leeg — Maanhoef staat nu vrij buiten.', en: 'The stall is empty — Moonhoof is outside now, free.' }
        },
        {
          id: 'horsefree',
          name: { nl: 'Maanhoef', en: 'Moonhoof' },
          showFlag: 'gateOpen',                      // alleen zichtbaar als Maanhoef vrij buiten staat
          rect: { x: 150, y: 120, w: 130, h: 120 },
          walkTo: { x: 210, y: 292 },
          clickSound: 'horse-whinny',
          look: (state) => state.flags.bridleOn
            ? { nl: 'Maanhoef draagt zijn hoofdstel en staat klaar. Tik op hem om op te stijgen!', en: 'Moonhoof wears his bridle and is ready. Tap him to climb on!' }
            : state.flags.gateOpen
              ? { nl: 'Maanhoef staat vrij en blij buiten. Maar zonder hoofdstel kun je niet op hem rijden.', en: 'Moonhoof stands outside, free and happy. But without a bridle you can’t ride him.' }
              : { nl: 'Het lege erf van de stal.', en: 'The empty stable yard.' },
          onTap: {
            requiresFlag: 'bridleOn',
            win: true,
            text: {
              nl: 'Je klimt op Maanhoefs warme rug en pakt de teugels. Hij hinnikt blij en draaft weg. Samen galopperen jullie de gouden ochtend in — vrij!',
              en: 'You climb onto Moonhoof’s warm back and take the reins. He whinnies happily and trots off. Together you gallop into the golden morning — free!'
            }
          },
          use: {
            bridle: {
              requiresFlag: 'gateOpen',
              consume: 'bridle',
              setFlag: 'bridleOn',
              text: {
                nl: 'Je doet Maanhoef voorzichtig het hoofdstel om. Het past precies! Tik nu op hem om op te stijgen.',
                en: 'You gently put the bridle on Moonhoof. It fits perfectly! Now tap him to climb on.'
              }
            }
          }
        },
        {
          id: 'bucket',
          name: { nl: 'Grote Emmer', en: 'Large Bucket' },
          rect: { x: 162, y: 206, w: 80, h: 74 },
          walkTo: { x: 200, y: 286 },
          gives: {
            item: 'bucket',
            giveText: { nl: 'Je pakt de grote houten emmer op. Deze is nog heel — handig om water mee te halen!', en: 'You pick up the big wooden bucket. This one isn’t broken — handy for fetching water!' },
            emptyText: { nl: 'Verder geen hele emmers meer.', en: 'No more good buckets here.' }
          }
        },
        {
          id: 'bucketsBroken',
          name: { nl: 'Kapotte Emmers', en: 'Broken Buckets' },
          rect: { x: 330, y: 226, w: 64, h: 50 },
          walkTo: { x: 360, y: 288 },
          look: { nl: 'Een stapeltje oude emmers, maar de bodems zijn eruit. Hier kun je geen water mee halen.', en: 'A little pile of old buckets, but the bottoms have fallen out. You can’t fetch water with these.' }
        },
        {
          id: 'gate',
          name: { nl: 'Vergrendelde Poort', en: 'Bolted Gate' },
          rect: { x: 300, y: 150, w: 60, h: 56 },
          walkTo: { x: 320, y: 272 },
          look: (state) => state.flags.gateOpen
            ? { nl: 'De poort staat wijd open; Maanhoef is vrij.', en: 'The gate stands wide open; Moonhoof is free.' }
            : { nl: 'Een zwaar ijzeren slot op de poort. Maanhoef wacht erachter, maar hij is nog te bang. Zo krijg je het slot niet open.', en: 'A heavy iron lock on the gate. Moonhoof waits behind it, but he’s still too scared. You can’t open the lock like this.' },
          use: {
            key: {
              requiresFlag: 'horseWatered',
              requiresText: { nl: 'Maanhoef is nog bang en duwt tegen de poort. Zo krijg je het slot niet open. Help hem eerst rustig te worden.', en: 'Moonhoof is still scared and pushes against the gate. You can’t open the lock like this. Help him calm down first.' },
              consume: 'key',
              setFlag: 'gateOpen',
              text: [
                { nl: 'Klik! De poort zwaait open en Maanhoef stapt vrij naar buiten. Hoera!',
                  en: 'Click! The gate swings open and Moonhoof steps outside, free. Hooray!' },
                { nl: 'Maar om op hem te rijden heb je zijn hoofdstel nodig. Kijk eens goed rond in de stal.',
                  en: 'But to ride him, you need his bridle. Take a good look around the stable.' }
              ]
            }
          }
        },
        {
          id: 'haysearch',
          name: { nl: 'Stro', en: 'Straw' },
          rect: { x: 404, y: 140, w: 84, h: 60 },
          walkTo: { x: 432, y: 296 },
          requiresFlag: 'gateOpen',
          blockedText: { nl: 'Gewoon stro uit de stal van Maanhoef.', en: 'Just straw from Moonhoof’s stall.' },
          gives: {
            item: 'cheese',
            giveText: { nl: 'In het stro ligt een stuk kaas. Je pakt het op — het muisje bij de oude kist zou er vast blij mee zijn!', en: 'There’s a piece of cheese in the straw. You pick it up — the mouse by the old chest would surely love it!' },
            emptyText: { nl: 'Alleen nog stro. De kaas heb je al.', en: 'Just straw now. You already have the cheese.' }
          }
        },
        {
          id: 'tilesBroken',
          name: { nl: 'Stalvloer', en: 'Stable Floor' },
          rect: { x: 128, y: 280, w: 84, h: 24 },
          walkTo: { x: 162, y: 298 },
          look: { nl: 'De oude vloertegels zijn helemaal gebarsten. Daar heb je niets aan.', en: 'The old floor tiles are all cracked. They’re no use to you.' }
        },
        {
          id: 'fountain',
          name: { nl: 'Stenen Fontein', en: 'Stone Fountain' },
          rect: { x: 56, y: 128, w: 74, h: 96 },
          walkTo: { x: 98, y: 266 },
          look: { nl: 'Een oude stenen fontein, maar er komt geen druppel water uit. Je moet zelf water voor Maanhoef halen.', en: 'An old stone fountain, but not a drop of water comes out. You’ll have to fetch water for Moonhoof yourself.' }
        },
        {
          id: 'toFarm',
          name: { nl: 'Pad naar het Erf', en: 'Path to the Farmyard' },
          rect: { x: 0, y: 172, w: 56, h: 130 },
          walkTo: { x: 86, y: 270 },
          arrow: { x: 28, y: 206, dir: 'left' },
          exit: { to: 'farm', travelText: { nl: 'Je keert terug naar het boerenerf.', en: 'You head back to the farmyard.' } }
        }
      ]
    }
  }
};
