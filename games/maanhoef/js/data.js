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
  assetVer: '40',

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
    nl: 'Met het hoofdstel om klimt Loïs op Maanhoefs warme rug. Het paard hinnikt blij en draaft de gouden ochtend in. Samen galopperen ze door de vallei, vrij en gelukkig — Loïs heeft haar liefste vriend gered.',
    en: 'With the bridle on, Loïs climbs onto Moonhoof’s warm back. The horse whinnies happily and trots into the golden morning. Together they gallop through the valley, free and happy — Loïs has saved her dearest friend.'
  },

  strings: {
    noEffect:    { nl: 'Dat werkt hier niet.', en: 'That doesn’t work here.' },
    noCombine:   { nl: 'Die twee laten zich niet combineren.', en: 'Those two don’t combine.' },
    nothingThere:{ nl: 'Daar valt niets te ontdekken.', en: 'There’s nothing to find there.' }
  },

  ui: {
    subtitle:   { nl: 'Loïs en haar paard Maanhoef', en: 'Loïs and her horse Moonhoof' },
    intro:      { nl: 'Loïs’ liefste paard, Maanhoef, het mooiste van de vallei, is opgesloten achter een vergrendelde stalpoort. De sleutel hangt aan de halsband van een schichtig hondje. Een wijze uil en een sissende slang kruisen Loïs’ pad. Help Loïs en red Maanhoef!',
                  en: 'Loïs’ dearest horse, Moonhoof, the finest in the valley, is locked behind a bolted stable gate. The key hangs from the collar of a skittish dog. A wise owl and a hissing snake cross Loïs’ path. Help Loïs and save Moonhoof!' },
    credit:     { nl: 'Een RetroAdventureWorld-avontuur', en: 'A RetroAdventureWorld adventure' },
    startBtn:   { nl: 'Begin het avontuur', en: 'Begin the adventure' },
    winTitle:   { nl: 'Maanhoef is Vrij', en: 'Moonhoof is Free' },
    replayBtn:  { nl: 'Opnieuw spelen', en: 'Play again' },
    deathTitle: { nl: 'Oeps...', en: 'Oops...' },
    deathText:  { nl: 'Dat liep niet goed af. Probeer het opnieuw.', en: 'That went badly. Try again.' },
    retryBtn:   { nl: 'Probeer opnieuw', en: 'Try again' },
    rotateTitle:{ nl: 'Draai je telefoon', en: 'Rotate your phone' },
    rotateText: { nl: 'Dit avontuur speelt liggend. Draai je scherm een kwartslag.',
                  en: 'This adventure plays in landscape. Turn your screen sideways.' },
    tapContinue:{ nl: 'tik om verder te gaan ▸', en: 'tap to continue ▸' },
    selected:   { nl: 'geselecteerd', en: 'selected' },
    homeConfirm:{ nl: 'Terug naar de homepagina? Je voortgang gaat verloren.', en: 'Back to the homepage? Your progress will be lost.' },

    q_owl:    { nl: 'Vraag de wijze uil om raad', en: 'Ask the wise owl for advice' },
    q_snake:  { nl: 'Een slang verspert het bospad — betover haar met de fluit', en: 'A snake blocks the forest path — charm it with the flute' },
    q_plank:  { nl: 'De brug naar de grot mist planken — haal een houten plank bij de stal', en: 'The bridge to the cave is missing planks — fetch a wooden plank from the stable' },
    q_bridge: { nl: 'Repareer de kapotte brug met de houten plank', en: 'Repair the broken bridge with the wooden plank' },
    q_cave:   { nl: 'De slang slaapt — steek de brug over, ga de grot in, pak het bot en herstel het runenzegel', en: 'The snake sleeps — cross the bridge, enter the cave, take the bone and restore the rune seal' },
    q_statue: { nl: 'Plaats de diamant in het beeld zodat het water gaat stromen', en: 'Place the diamond in the statue so the water starts to flow' },
    q_dog:    { nl: 'Geef het hongerige hondje het bot om bij de sleutel te komen', en: 'Give the hungry dog the bone to reach the key' },
    q_bucket: { nl: 'Maanhoef heeft dorst — pak de houten emmer bij de stal', en: 'Moonhoof is thirsty — grab the wooden bucket by the stable' },
    q_fill:   { nl: 'Vul de emmer met water bij het beeld in de grot', en: 'Fill the bucket with water at the statue in the cave' },
    q_carrot:   { nl: 'Maanhoef vertrouwt je nog niet — pluk eerst een wortel uit de moestuin op het erf', en: 'Moonhoof doesn’t trust you yet — pick a carrot from the vegetable garden first' },
    q_feedhorse:{ nl: 'Geef Maanhoef de wortel om zijn vertrouwen te winnen', en: 'Give Moonhoof the carrot to earn his trust' },
    q_freehorse:{ nl: 'Geef Maanhoef nu water over de poort — anders werkt de sleutel niet', en: 'Now give Moonhoof water over the gate — otherwise the key won’t work' },
    q_gate:   { nl: 'Maanhoef is gekalmeerd — haal nu het slot van de stalpoort met de sleutel', en: 'Moonhoof is calm now — unlock the stable gate with the key' },
    q_bridle_search: { nl: 'Maanhoef is vrij! Hij heeft een hoofdstel nodig — pak het stuk kaas dat in de stal ligt', en: 'Moonhoof is free! He needs a bridle — grab the wedge of cheese lying in the stable' },
    q_bridle_cheese: { nl: 'Geef het stuk kaas aan het brutale muisje bij het schuurtje op het erf', en: 'Give the wedge of cheese to the cheeky mouse by the barn in the farmyard' },
    q_tackbox:       { nl: 'Open de tuigkist bij het schuurtje op het erf — los het houten slot op', en: 'Open the tack-chest by the barn in the farmyard — solve the wooden lock' },
    q_bridle_on:     { nl: 'Doe Maanhoef het hoofdstel om (gebruik het hoofdstel op hem)', en: 'Put the bridle on Moonhoof (use the bridle on him)' },
    q_ride:          { nl: 'Klik op Maanhoef om op te stijgen en samen weg te rijden!', en: 'Click Moonhoof to mount up and ride off together!' }
  },

  items: {
    flute:   { name: { nl: 'Wilgenfluit', en: 'Willow Flute' }, icon: '🪈', img: 'assets/art/item-flute.png',
               tapAnim: 'flute', tapAnimDur: 6000, tapSound: 'willow-flute' },
    bone:    { name: { nl: 'Kaal Bot', en: 'Bare Bone' }, icon: '🦴', img: 'assets/art/item-bone.png' },
    key:     { name: { nl: 'Stalsleutel', en: 'Stable Key' }, icon: '🗝️', img: 'assets/art/item-key.png' },
    crystal: { name: { nl: 'Kristal', en: 'Crystal' }, icon: '🔷', img: 'assets/art/item-crystal.png' },
    comb:    { name: { nl: 'Kam', en: 'Comb' }, icon: '🪮', img: 'assets/art/item-comb.png' },
    saw:     { name: { nl: 'Zaag', en: 'Saw' }, icon: '🪚', img: 'assets/art/item-saw.png' },
    bucket:      { name: { nl: 'Lege Emmer', en: 'Empty Bucket' }, icon: '🪣', img: 'assets/art/item-bucket.png',
                   noUseText: { nl: 'Daar valt niets te scheppen.', en: 'Nothing to scoop here.' } },
    bucketWater: { name: { nl: 'Emmer Water', en: 'Bucket of Water' }, icon: '🪣', img: 'assets/art/item-bucket-water.png',
                   noUseText: { nl: 'Hier heb ik geen water voor nodig.', en: 'No need for water here.' } },
    diamond: { name: { nl: 'Diamant', en: 'Diamond' }, icon: '💎', img: 'assets/art/item-diamond.png',
               noUseText: { nl: 'Dit hoort hier niet.', en: 'This doesn’t belong here.' } },
    plank:   { name: { nl: 'Houten Plank', en: 'Wooden Plank' }, icon: '🪵', img: 'assets/art/item-plank.png',
               noUseText: { nl: 'Daar heb ik die plank niet voor nodig.', en: 'No need for the plank here.' } },
    cheese:  { name: { nl: 'Stuk Kaas', en: 'Wedge of Cheese' }, icon: '🧀', img: 'assets/art/item-cheese.png',
               noUseText: { nl: 'Ik ga dat lekkere stuk kaas niet zomaar weggeven.', en: 'I won’t just give away that tasty cheese.' } },
    bridle:  { name: { nl: 'Hoofdstel', en: 'Bridle' }, icon: '🐴', img: 'assets/art/item-bridle.png',
               noUseText: { nl: 'Het hoofdstel is voor Maanhoef.', en: 'The bridle is for Moonhoof.' } },
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
    { when: { has: 'carrot', notFlag: 'horseFed' },        quest: 'q_feedhorse' },
    { when: { has: 'bucketWater', flag: 'horseFed' },      quest: 'q_freehorse' },
    { when: { has: 'bucketWater', notFlag: 'horseFed' },   quest: 'q_carrot' },
    { when: { flag: 'waterFlowing', has: 'bucket' },       quest: 'q_fill' },
    { when: { flag: 'waterFlowing', notHas: 'bucket' },    quest: 'q_bucket' },
    { when: { has: 'diamond' },                            quest: 'q_statue' },
    { when: { has: 'bone' },                               quest: 'q_dog' },
    { when: { flag: 'snakeCharmed', notFlag: 'bridgeFixed', has: 'plank' }, quest: 'q_bridge' },
    { when: { flag: 'snakeCharmed', notFlag: 'bridgeFixed' }, quest: 'q_plank' },
    { when: { flag: 'snakeCharmed', notFlag: 'sealSolved' }, quest: 'q_cave' },
    { when: { has: 'flute', notFlag: 'snakeCharmed' },     quest: 'q_snake' },
    { when: {},                                            quest: 'q_owl' }
  ],

  scenes: {

    /* ---------- Gebied 1: Het Boerenerf ---------- */
    farm: {
      name: { nl: 'Het Boerenerf', en: 'The Farmyard' },
      bg: 'assets/art/scene-farm.png',
      entryText: {
        nl: 'Een open boerenerf in het ochtendlicht, met paden die alle kanten op slingeren. Een schichtig hondje dribbelt door het gras en een wijze uil houdt de wacht.',
        en: 'An open farmyard in the morning light, with paths winding off in every direction. A skittish dog trots through the grass and a wise owl keeps watch.'
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
          name: { nl: 'Schichtig Hondje', en: 'Skittish Dog' },
          followNpc: 'dog',
          speaker: true,
          rect: { x: 104, y: 198, w: 58, h: 64 },
          walkTo: { x: 184, y: 268 },
          look: (state) => state.flags.dogFriendly
            ? { nl: 'Het hondje kwispelt blij om je heen, blij met zijn bot.', en: 'The dog wags happily around you, pleased with its bone.' }
            : { nl: 'Het beagle-puppy is veel te speels om mee te praten — zodra je dichterbij komt, rent het kwispelend weg. Aan zijn rode halsband bungelt een sleuteltje. Misschien blijft hij wél staan voor iets lekkers...',
                en: 'The beagle puppy is far too playful to talk to — the moment you get close, it scampers off wagging its tail. A little key dangles from its red collar. Maybe it would stay put for a treat...' },
          use: {
            bone: {
              consume: 'bone',
              setFlag: 'dogFriendly',
              give: 'key',
              text: {
                nl: 'Je legt het kale bot voor het hondje neer. Het schrokt het dankbaar op, kwispelt wild — en laat je de Stalsleutel van zijn halsband halen!',
                en: 'You set the juicy bone before the dog. It gulps it down gratefully, wags wildly — and lets you take the Stable Key from its collar!'
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
              nl: '“Oehoe. Maanhoef? Los eerst mijn raadsels op, dan krijg je iets om de slang te bedaren.”',
              en: '“Hoo. Moonhoof? Solve my riddles first, and I’ll give you something to calm the snake.”'
            },
            questions: [
              {
                q: { nl: 'Raadsel 1: “In de mist sta ik stil, maar toch lijk ik te gaan. Vier benen dragen mij, maar mijn hoofd kijkt nooit om. Wie mij ziet, denkt aan kracht, vrijheid en een geheim in de nacht. Wat ben ik?”',
                     en: 'Riddle 1: “In the mist I stand still, yet I seem to move. Four legs carry me, but my head never looks back. Who sees me thinks of strength, freedom and a secret in the night. What am I?”' },
                answers: [
                  { t: { nl: 'Een paard', en: 'A horse' }, ok: true },
                  { t: { nl: 'Een stoel', en: 'A chair' }, ok: false },
                  { t: { nl: 'Een schaduw', en: 'A shadow' }, ok: false }
                ]
              },
              {
                q: { nl: 'Raadsel 2: “Ik heb geen stem en toch breng ik de slang in slaap, ik heb geen adem en toch zing ik. Wat ben ik?”',
                     en: 'Riddle 2: “I have no voice yet I lull the snake to sleep, I have no breath yet I sing. What am I?”' },
                answers: [
                  { t: { nl: 'Een fluit', en: 'A flute' }, ok: true },
                  { t: { nl: 'De regen', en: 'The rain' }, ok: false },
                  { t: { nl: 'Een klok', en: 'A bell' }, ok: false }
                ]
              }
            ],
            wrongText: { nl: '“Oehoe... nee. Denk nog eens goed na — we beginnen opnieuw.”', en: '“Hoo... no. Think again — we start anew.”' },
            solvedText: {
              nl: '“Wijs geantwoord.” De uil laat een gladde Wilgenfluit in je handen vallen. “Speel ervoor de slang; ze kan geen wijsje weerstaan.”',
              en: '“Wisely answered.” The owl drops a smooth Willow Flute into your hands. “Play it for the snake; she cannot resist a tune.”'
            }
          },
          look: {
            nl: 'De wijze uil tuurt je met grote amberen ogen aan. “Het bos ligt naar het westen, de stal naar het oosten.”',
            en: 'The wise owl studies you with great amber eyes. “The forest lies to the west, the stable to the east.”'
          }
        },
        {
          id: 'well',
          name: { nl: 'Oude Put', en: 'Old Well' },
          rect: { x: 336, y: 190, w: 62, h: 74 },
          walkTo: { x: 362, y: 294 },
          look: {
            nl: 'Je tuurt in de oude put — helemaal droog, geen druppel water te bekennen. En de emmer die eraan hangt is kapot; hier kun je geen water halen.',
            en: 'You peer into the old well — bone dry, not a drop of water in sight. And the bucket on it is broken; you can’t draw any water here.'
          }
        },
        {
          id: 'moestuin',
          name: { nl: 'Moestuin', en: 'Vegetable Garden' },
          rect: { x: 126, y: 86, w: 142, h: 78 },
          walkTo: { x: 214, y: 244 },
          gives: {
            item: 'carrot',
            giveText: { nl: 'In de moestuin groeien rijen groenten. Je trekt een mooie verse wortel uit de grond — een echte lekkernij voor een paard.', en: 'Rows of vegetables grow in the garden. You pull a fine fresh carrot from the soil — a real treat for a horse.' },
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
          look: { nl: 'Een brutaal muisje zit pal vóór de oude kist en piept naar je. Je durft er niet langs zolang het daar zit... het ruikt vast graag iets lekkers.', en: 'A cheeky mouse sits right in front of the old chest, squeaking at you. You don’t dare get past while it sits there... it would surely love a treat.' },
          use: {
            cheese: {
              consume: 'cheese',
              setFlag: 'mouseFed',
              text: {
                nl: 'Je legt het stuk kaas voor het muisje neer. Blij grijpt het de kaas en ritselt ermee weg, de struiken in — de kist is nu vrij. Maar het deksel zit op een vreemd houten slot...',
                en: 'You set the cheese before the mouse. It gleefully grabs the cheese and scurries off into the bushes — the chest is free now. But the lid is held shut by a strange wooden lock...'
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
          blockedText: { nl: 'Het brutale muisje zit pal vóór de kist en je durft er niet langs. Geef het eerst een stuk kaas, dan kun je de kist openmaken.', en: 'The cheeky mouse sits right in front of the chest and you don’t dare pass. Give it a wedge of cheese first, then you can open the chest.' },
          slidePuzzle: {
            img: 'assets/art/tackbox.png',
            size: 3,
            setFlag: 'tackSolved',
            give: 'bridle',
            title: { nl: 'Het Slot van de Tuigkist', en: 'The Tack-Chest Lock' },
            solvedText: {
              nl: 'De houten schijven klikken op hun plaats en het slot springt open. In de kist ligt Maanhoefs leren hoofdstel — je pakt het eruit! Breng het naar Maanhoef in de stal.',
              en: 'The wooden discs click into place and the lock springs open. Inside the chest lies Moonhoof’s leather bridle — you take it out! Bring it to Moonhoof in the stable.'
            },
            burst: { x: 78, y: 220 }
          },
          look: { nl: 'De open tuigkist; het hoofdstel heb je eruit gehaald.', en: 'The open tack-chest; you’ve taken the bridle out.' }
        },
        {
          id: 'toGrove',
          name: { nl: 'Pad naar het Bos', en: 'Path to the Forest' },
          rect: { x: 0, y: 168, w: 46, h: 134 },
          walkTo: { x: 58, y: 252 },
          arrow: { x: 24, y: 196, dir: 'left' },
          exit: { to: 'grove', travelText: { nl: 'Je volgt het pad westwaarts het wilgenbos in...', en: 'You follow the path west into the willow forest...' } }
        },
        {
          id: 'toStable',
          name: { nl: 'Pad naar de Stal', en: 'Path to the Stable' },
          rect: { x: 522, y: 168, w: 46, h: 134 },
          walkTo: { x: 510, y: 252 },
          arrow: { x: 544, y: 196, dir: 'right' },
          exit: { to: 'stable', travelText: { nl: 'Je loopt oostwaarts naar de oude stal...', en: 'You walk east toward the old stable...' } }
        }
      ]
    },

    /* ---------- Gebied 2: Het Wilgenbos ---------- */
    grove: {
      name: { nl: 'Het Wilgenbos', en: 'The Willow Forest' },
      bg: 'assets/art/scene-grove-broken.png',
      bgVariants: [ { img: 'assets/art/scene-grove.png', flag: 'bridgeFixed' } ],
      entryText: {
        nl: 'Een open plek met een ruisende waterval. In de boom kronkelt een grote slang die dreigend naar je sist. Links, bij een stenen boog, gaapt een donkere holte — maar de brug over de beek ernaartoe mist planken.',
        en: 'A clearing with a rushing waterfall. A great snake coils in the tree, hissing at you in warning. To the left, by a stone arch, yawns a dark hollow — but the bridge over the brook to it is missing planks.'
      },
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
            question: { nl: 'Ssss... kom is dichterbij, ik wil je iets vertellen over de geheime grot. De giftanden van de slang glinsteren vlak bij je oor. Wat doe je?',
                        en: 'Ssss... come closer, I want to tell you something about the secret cave. The snake’s fangs glint right by your ear. What do you do?' },
            options: [
              { t: { nl: '👂 Luister naar haar geheim', en: '👂 Listen to her secret' },
                die: true,
                deathText: { nl: 'Je buigt je oor naar de slang om haar geheim te horen. Bliksemsnel schiet ze toe en bijt — het gif verlamt je. Je had haar nooit moeten vertrouwen; speel liever de fluit.',
                             en: 'You lean your ear toward the snake to hear her secret. In a flash she strikes and bites — the venom freezes you. You should never have trusted her; play the flute instead.' } },
              { t: { nl: '🚫 Vertrouw haar niet', en: '🚫 Don’t trust her' },
                text: { nl: 'Je deinst wijs achteruit, weg van haar giftanden. Een slang fluistert geen geheimen voor niets... Beter betover je haar met je wilgenfluit.',
                        en: 'You wisely step back, away from her fangs. A snake whispers no secrets for free... Better to charm her with your willow flute.' } }
            ]
          },
          look: (state) => state.flags.snakeCharmed
            ? { nl: 'De slang wiegt loom heen en weer, betoverd door het wijsje. De weg is vrij.', en: 'The snake sways lazily, charmed by the tune. The way is clear.' }
            : { nl: 'De slang wiegt zacht en wenkt je dichterbij — ze wil je iets in je oor fluisteren. Vertrouw haar niet; speel liever je fluit.',
                en: 'The snake sways softly and beckons you closer — she wants to whisper in your ear. Don’t trust her; play your flute instead.' },
          use: {
            flute: {
              anim: 'flute',
              animDur: 6000,
              sound: 'willow-flute',
              setFlag: 'snakeCharmed',
              text: {
                nl: 'Je zet de Wilgenfluit aan je lippen en speelt een zacht wijsje. De slang wiegt mee, haar ogen vallen dicht — Z z z... ze zakt in slaap en glijdt loom opzij. De weg naar de grot is vrij.',
                en: 'You raise the Willow Flute to your lips and play a soft tune. The snake sways along, her eyes closing — Z z z... she drifts to sleep and slides lazily aside. The way to the cave is clear.'
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
            ? { nl: 'De brug ligt er weer stevig bij; loop omhoog en ga via de stenen boog de grot in.', en: 'The bridge is sturdy again; head up and enter the cave through the stone arch.' }
            : { nl: 'De houten brug over de beek mist een paar planken — zo waag je je er niet overheen. Klik op de brug met een stevige plank in je tas om hem te maken.', en: 'The wooden bridge over the brook is missing a few planks — you won’t risk crossing like this. Click the bridge with a sturdy plank in your bag to fix it.' },
          onTap: {
            needsItem: 'plank',
            consume: 'plank',
            setFlag: 'bridgeFixed',
            text: {
              nl: 'Je legt de houten plank over het gat in de brug en stampt hem vast. De brug is weer heel — loop nu omhoog en klik op de stenen boog om de grot in te gaan.',
              en: 'You lay the wooden plank over the gap in the bridge and stamp it down. The bridge is whole again — now head up and click the stone arch to enter the cave.'
            }
          },
          use: {
            plank: {
              consume: 'plank',
              setFlag: 'bridgeFixed',
              text: {
                nl: 'Je legt de houten plank over het gat in de brug en stampt hem vast. De brug is weer heel — loop nu omhoog en klik op de stenen boog om de grot in te gaan.',
                en: 'You lay the wooden plank over the gap in the bridge and stamp it down. The bridge is whole again — now head up and click the stone arch to enter the cave.'
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
            ? { nl: 'De brug over de beek is kapot — je komt zo niet bij de boog. Repareer hem eerst met een plank.', en: 'The bridge over the brook is broken — you can’t reach the arch like this. Repair it with a plank first.' }
            : { nl: 'De sissende slang verspert de weg naar de boog. Je durft er niet langs — bedaar haar eerst.', en: 'The hissing snake blocks the way to the arch. You don’t dare pass — calm her first.' },
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
      bg: 'assets/art/scene-cave-dry.png',
      bgVariants: [ { img: 'assets/art/scene-cave.png', flag: 'waterFlowing' } ],
      entryText: {
        nl: 'Een koele grot vol gloeiende kristallen. Een stenen beeld torent boven een drooggevallen bekken — het water is opgedroogd. Aan de rand ligt een oud bot. In de wand zit een verschoven runenzegel.',
        en: 'A cool cave full of glowing crystals. A stone statue towers over a dry basin — the water has run dry. An old bone lies at its edge. A scrambled rune seal sits in the wall.'
      },
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
            img: 'assets/art/cave-seal.png',
            cols: 4, rows: 3,
            setFlag: 'sealSolved',
            give: 'diamond',
            title: { nl: 'Het Diamantzegel', en: 'The Diamond Seal' },
            solvedText: {
              nl: 'De scherven klikken in elkaar tot één heel zegel. Het gloeit op en met een diep gerommel schuift een stenen luik opzij — er rolt een fonkelende Diamant in je hand!',
              en: 'The shards click together into one whole seal. It glows and with a deep rumble a stone hatch slides aside — a sparkling Diamond rolls into your hand!'
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
            ? { nl: 'De diamant fonkelt in het voorhoofd van het beeld; helder water klatert weer in het bekken. Hier kun je de emmer vullen.',
                en: 'The diamond sparkles in the statue’s brow; clear water splashes into the basin again. You can fill the bucket here.' }
            : { nl: 'Een sereen stenen beeld van een godin boven een droog bekken. In haar voorhoofd zit een lege, diamantvormige holte — daar hoort iets in.',
                en: 'A serene stone goddess over a dry basin. In her brow is an empty, diamond-shaped socket — something belongs there.' },
          use: {
            diamond: {
              consume: 'diamond',
              setFlag: 'waterFlowing',
              text: {
                nl: 'Je drukt de Diamant in de holte op het voorhoofd van het beeld. De ogen lichten op, er klinkt gerommel — en helder water begint weer in het bekken te klateren!',
                en: 'You press the Diamond into the socket on the statue’s brow. Its eyes light up, a rumble sounds — and clear water begins to splash into the basin again!'
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
            giveText: { nl: 'Weggestopt in een donker hoekje achter het beeld ligt een kaal bot, lang geleden afgekloven. Je raapt het stevige bot op — precies iets voor een speels hondje.', en: 'Tucked away in a dark corner behind the statue lies a bare bone, gnawed clean long ago. You pick up the sturdy bone — just the thing for a playful dog.' },
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
      bg: 'assets/art/scene-stable.png',
      bgVariants: [
        { img: 'assets/art/scene-stable-open.png', flag: 'gateOpen' },
        { img: 'assets/art/scene-stable-water.png', flag: 'horseWatered' }
      ],
      entryText: {
        nl: 'De oude stal in het avondrood. Achter de vergrendelde paddockpoort staat Maanhoef, die je hoopvol aankijkt.',
        en: 'The old stable in the evening glow. Behind the bolted paddock gate stands Moonhoof, looking at you with hope.'
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
            giveText: { nl: 'Tegen de stalmuur leunt een stevige houten plank. Die kun je vast gebruiken om iets te repareren.', en: 'A sturdy wooden plank leans against the stable wall. That could come in handy to repair something.' },
            emptyText: { nl: 'Verder geen planken meer.', en: 'No more planks here.' }
          }
        },
        {
          id: 'horse',
          name: { nl: 'Maanhoef', en: 'Moonhoof' },
          rect: { x: 296, y: 66, w: 132, h: 120 },
          walkTo: { x: 344, y: 268 },
          clickSound: 'horse-whinny',
          clickVoice: 'bucket-empty',
          look: (state) => state.flags.gateOpen
            ? { nl: 'De stal is leeg — Maanhoef staat nu vrij op de binnenplaats.', en: 'The stall is empty — Moonhoof now stands free in the yard.' }
            : state.flags.horseWatered
              ? { nl: 'Maanhoef is gekalmeerd en staat rustig achter de poort. Nu hij je vertrouwt, kun je de poort van het slot halen.', en: 'Moonhoof is calm and stands quietly behind the gate. Now that he trusts you, you can unlock the gate.' }
              : state.flags.horseFed
                ? { nl: 'Maanhoef heeft de wortel smakelijk opgegeten en kijkt al wat vriendelijker. Maar hij heeft dorst — geef hem nu water om zijn vertrouwen helemaal te winnen.', en: 'Moonhoof has happily eaten the carrot and looks a bit friendlier already. But he’s thirsty — give him water now to fully earn his trust.' }
                : { nl: 'Maanhoef, een warm kastanjebruin paard met een lichte bles, deinst angstig achteruit en kijkt je wantrouwend aan. "Ik vertrouw je nog niet," lijkt hij te zeggen. Verwen hem eerst met een lekkere wortel uit de moestuin.', en: 'Moonhoof, a warm chestnut horse with a pale blaze, shies back fearfully and eyes you with mistrust. "I don’t trust you yet," he seems to say. Spoil him first with a tasty carrot from the vegetable garden.' },
          use: {
            carrot: {
              consume: 'carrot',
              setFlag: 'horseFed',
              text: {
                nl: 'Je houdt Maanhoef de verse wortel voor. Voorzichtig snuffelt hij, dan knabbelt hij hem gretig op. Zijn oren komen naar voren — hij begint je te vertrouwen. Geef hem nu wat water.',
                en: 'You hold out the fresh carrot to Moonhoof. He sniffs cautiously, then eagerly munches it down. His ears prick forward — he’s starting to trust you. Now give him some water.'
              }
            },
            bucketWater: {
              requiresFlag: 'horseFed',
              requiresText: { nl: 'Maanhoef is nog te schuw om uit je hand te drinken. Geef hem eerst een wortel uit de moestuin om hem op zijn gemak te stellen.', en: 'Moonhoof is still too shy to drink from your hand. Give him a carrot from the vegetable garden first to put him at ease.' },
              consume: 'bucketWater',
              setFlag: 'horseWatered',
              text: {
                nl: 'Je houdt Maanhoef de emmer over de stalrand voor. Hij drinkt gulzig, zijn oren ontspannen en hij drukt dankbaar zijn neus in je hand. Nu vertrouwt hij je — je kunt het slot van de poort halen.',
                en: 'You offer Moonhoof the bucket over the stall rail. He drinks deeply, his ears relax and he gratefully presses his nose into your hand. Now he trusts you — you can unlock the gate.'
              }
            }
          }
        },
        {
          id: 'horsefree',
          name: { nl: 'Maanhoef', en: 'Moonhoof' },
          rect: { x: 150, y: 120, w: 130, h: 120 },
          walkTo: { x: 210, y: 292 },
          clickSound: 'horse-whinny',
          look: (state) => state.flags.bridleOn
            ? { nl: 'Maanhoef draagt zijn hoofdstel en staat klaar. Klik op hem om op te stijgen en weg te rijden!', en: 'Moonhoof wears his bridle and stands ready. Click him to mount up and ride away!' }
            : state.flags.gateOpen
              ? { nl: 'Maanhoef staat vrij en blij op de binnenplaats, maar zonder hoofdstel kun je niet op hem rijden. Waar zou zijn hoofdstel zijn? Doorzoek de stal.', en: 'Moonhoof stands free and happy in the yard, but without a bridle you can’t ride him. Where could his bridle be? Search the stable.' }
              : { nl: 'De lege binnenplaats van de stal.', en: 'The empty stable yard.' },
          onTap: {
            requiresFlag: 'bridleOn',
            win: true,
            text: {
              nl: 'Je klimt op Maanhoefs warme rug en pakt de teugels. Hij hinnikt blij en draaft de open poort uit. Samen galopperen jullie de gouden ochtend tegemoet — vrij!',
              en: 'You climb onto Moonhoof’s warm back and take the reins. He whinnies happily and trots out the open gate. Together you gallop into the golden morning — free!'
            }
          },
          use: {
            bridle: {
              requiresFlag: 'gateOpen',
              consume: 'bridle',
              setFlag: 'bridleOn',
              text: {
                nl: 'Je doet Maanhoef voorzichtig het hoofdstel om. Het zit precies — nu hoef je hem alleen nog aan te klikken om op te stijgen en weg te rijden!',
                en: 'You gently slip the bridle onto Moonhoof. It fits perfectly — now just click him to mount up and ride away!'
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
            giveText: { nl: 'Je pakt de grote, stevige houten emmer op die naast de stal staat. Deze is nog heel — handig om water mee te halen.', en: 'You pick up the big, sturdy wooden bucket by the stable. This one is still whole — handy for fetching water.' },
            emptyText: { nl: 'Verder geen hele emmers meer.', en: 'No more whole buckets here.' }
          }
        },
        {
          id: 'bucketsBroken',
          name: { nl: 'Kapotte Emmers', en: 'Broken Buckets' },
          rect: { x: 330, y: 226, w: 64, h: 50 },
          walkTo: { x: 360, y: 288 },
          look: { nl: 'Een stapeltje oude emmers, maar ze zijn allemaal kapot — de bodems zijn eruit gerot. Hier kun je geen water mee halen.', en: 'A little pile of old buckets, but they’re all broken — the bottoms have rotted out. No fetching water with these.' }
        },
        {
          id: 'gate',
          name: { nl: 'Vergrendelde Poort', en: 'Bolted Gate' },
          rect: { x: 300, y: 150, w: 60, h: 56 },
          walkTo: { x: 320, y: 272 },
          look: (state) => state.flags.gateOpen
            ? { nl: 'De poort staat wijd open; Maanhoef is vrij.', en: 'The gate stands wide open; Moonhoof is free.' }
            : { nl: 'Een zwaar ijzeren slot op de paddockpoort. Maanhoef wacht erachter — maar zo angstig als hij nu is, krijg je het slot niet rustig open.', en: 'A heavy iron lock on the paddock gate. Moonhoof waits beyond — but as frightened as he is now, you can’t work the lock calmly.' },
          use: {
            key: {
              requiresFlag: 'horseWatered',
              requiresText: { nl: 'Maanhoef is doodsbang en deinst tegen de poort; zo krijg je het slot niet open. Geef hem éérst water om hem te kalmeren.', en: 'Moonhoof is terrified and shoves against the gate; you can’t work the lock like this. Give him water first to calm him.' },
              consume: 'key',
              setFlag: 'gateOpen',
              text: {
                nl: 'Nu Maanhoef rustig is, past de Stalsleutel precies. Met een klik draait het slot om en de poort zwaait open. Maanhoef stapt vrij de binnenplaats op — maar om hem te berijden heb je zijn hoofdstel nodig. Zoek het in de stal!',
                en: 'Now that Moonhoof is calm, the Stable Key fits perfectly. With a click the lock turns and the gate swings open. Moonhoof steps free into the yard — but to ride him you’ll need his bridle. Search the stable for it!'
              }
            }
          }
        },
        {
          id: 'haysearch',
          name: { nl: 'Stuk Kaas', en: 'Wedge of Cheese' },
          rect: { x: 404, y: 140, w: 84, h: 60 },
          walkTo: { x: 432, y: 296 },
          requiresFlag: 'gateOpen',
          blockedText: { nl: 'Er ligt nu niets — bevrijd eerst Maanhoef.', en: 'There’s nothing here yet — free Moonhoof first.' },
          gives: {
            item: 'cheese',
            giveText: { nl: 'Je pakt het stuk kaas op dat in het stro van het hok ligt. Iemand zou daar vast blij mee zijn.', en: 'You pick up the wedge of cheese lying in the straw of the stall. Someone would surely be glad to have it.' },
            emptyText: { nl: 'Het stuk kaas heb je al opgepakt.', en: 'You’ve already picked up the cheese.' }
          }
        },
        {
          id: 'tilesBroken',
          name: { nl: 'Stalvloer', en: 'Stable Floor' },
          rect: { x: 128, y: 280, w: 84, h: 24 },
          walkTo: { x: 162, y: 298 },
          look: { nl: 'De oude vloertegels zijn helemaal gebarsten en kapot. Hier valt niets mee te beginnen.', en: 'The old floor tiles are all cracked and broken. Nothing to be done with these.' }
        },
        {
          id: 'fountain',
          name: { nl: 'Stenen Fontein', en: 'Stone Fountain' },
          rect: { x: 56, y: 128, w: 74, h: 96 },
          walkTo: { x: 98, y: 266 },
          look: { nl: 'Een oude stenen fontein, maar hij doet het niet — er komt geen druppel water uit. Maanhoef moet je dus zelf water brengen.', en: 'An old stone fountain, but it doesn’t work — not a drop of water comes out. You’ll have to bring Moonhoof water yourself.' }
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
