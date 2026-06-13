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
  assetVer: '4',

  sprites: {
    hero:      'assets/art/hero.png',
    heroWalk:  'assets/art/hero-walk.png',
    heroWalk2: 'assets/art/hero-walk2.png',
    heroWave:  'assets/art/hero-wave.png',
    pup:       'assets/art/pup.png',
    owl:       'assets/art/owl.png'
  },

  winText: {
    nl: 'De poort zwaait open en Maanhoef stapt vrij de ochtend in. Het paard drukt zijn warme neus tegen je wang en hinnikt zacht. Met de trouwe hond aan je zij en de uil hoog in de lucht breng je Maanhoef naar huis. Je hebt je vriend gered.',
    en: 'The gate swings open and Moonhoof steps free into the morning. The horse presses his warm muzzle to your cheek and softly whinnies. With the loyal dog at your side and the owl high above, you lead Moonhoof home. You have saved your friend.'
  },

  strings: {
    noEffect:    { nl: 'Dat werkt hier niet.', en: 'That doesn’t work here.' },
    noCombine:   { nl: 'Die twee laten zich niet combineren.', en: 'Those two don’t combine.' },
    nothingThere:{ nl: 'Daar valt niets te ontdekken.', en: 'There’s nothing to find there.' }
  },

  ui: {
    subtitle:   { nl: 'Een meisje en haar paard', en: 'A girl and her horse' },
    intro:      { nl: 'Maanhoef, het mooiste paard van de vallei, is opgesloten achter een vergrendelde stalpoort. De sleutel hangt aan de halsband van een schichtige hond. Een wijze uil en een sissende slang kruisen je pad. Red Maanhoef!',
                  en: 'Moonhoof, the finest horse in the valley, is locked behind a bolted stable gate. The key hangs from the collar of a skittish dog. A wise owl and a hissing snake cross your path. Save Moonhoof!' },
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

    q_owl:    { nl: 'Vraag de wijze uil om raad', en: 'Ask the wise owl for advice' },
    q_snake:  { nl: 'Een slang verspert het bospad — betover haar met de fluit', en: 'A snake blocks the forest path — charm it with the flute' },
    q_cave:   { nl: 'De slang slaapt — ga de grot in, pak het bot en herstel het runenzegel', en: 'The snake sleeps — enter the cave, take the bone and restore the rune seal' },
    q_statue: { nl: 'Plaats de diamant in het beeld zodat het water gaat stromen', en: 'Place the diamond in the statue so the water starts to flow' },
    q_dog:    { nl: 'Geef het hongerige hondje het bot om bij de sleutel te komen', en: 'Give the hungry dog the bone to reach the key' },
    q_bucket: { nl: 'Maanhoef heeft dorst — pak de houten emmer bij de stal', en: 'Moonhoof is thirsty — grab the wooden bucket by the stable' },
    q_fill:   { nl: 'Vul de emmer met water bij het beeld in de grot', en: 'Fill the bucket with water at the statue in the cave' },
    q_freehorse:{ nl: 'Geef Maanhoef éérst water over de poort — anders werkt de sleutel niet', en: 'Give Moonhoof water over the gate first — otherwise the key won’t work' },
    q_gate:   { nl: 'Maanhoef is gekalmeerd — open nu de stalpoort met de sleutel', en: 'Moonhoof is calm now — open the stable gate with the key' }
  },

  items: {
    flute:   { name: { nl: 'Wilgenfluit', en: 'Willow Flute' }, icon: '🪈', img: 'assets/art/item-flute.png' },
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
               noUseText: { nl: 'Dit hoort hier niet.', en: 'This doesn’t belong here.' } }
  },

  recipes: [],

  /* Questhint-regels — eerste match wint; quest:null verbergt de hint. */
  questRules: [
    { when: { flag: 'horseWatered', has: 'key' },          quest: 'q_gate' },
    { when: { has: 'bucketWater' },                        quest: 'q_freehorse' },
    { when: { flag: 'waterFlowing', has: 'bucket' },       quest: 'q_fill' },
    { when: { flag: 'waterFlowing', notHas: 'bucket' },    quest: 'q_bucket' },
    { when: { has: 'diamond' },                            quest: 'q_statue' },
    { when: { has: 'bone' },                               quest: 'q_dog' },
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
      playerStart: { x: 284, y: 256 },
      spawnFrom: {
        grove: { x: 70, y: 256 },
        stable: { x: 498, y: 256 }
      },
      walkPoly: [ [28, 226], [540, 226], [540, 298], [28, 298] ],
      obstacles: [],
      overlays: [],
      worldItems: [],
      npcs: [
        { id: 'dog', sprite: 'pup', x: 168, y: 262,
          wander: { x: 96, y: 250, w: 220, h: 36, speed: 26, pauseMin: 1800, pauseMax: 5200 } },
        { id: 'owl', sprite: 'owl', x: 430, y: 232 }
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
            : { nl: 'Een mager hondje met een leren halsband; er bungelt een kleine sleutel aan. Het jankt van de honger en deinst terug zodra je je hand uitsteekt.',
                en: 'A thin dog with a leather collar; a small key dangles from it. It whimpers with hunger and shies back the moment you reach out.' },
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
          rect: { x: 392, y: 150, w: 50, h: 58 },
          walkTo: { x: 424, y: 262 },
          speaker: true,
          riddle: {
            setFlag: 'owlSolved',
            reward: 'flute',
            title: { nl: 'Het Raadsel van de Uil', en: 'The Owl’s Riddle' },
            intro: {
              nl: '“Oehoe. Het paard Maanhoef, zeg je? De hond bewaart de sleutel, maar hij heeft honger. In het bos ligt een bot — bewaakt door een slang. Beantwoord eerst mijn raadsels, dan geef ik je iets om haar te bedaren.”',
              en: '“Hoo. The horse Moonhoof, you say? The dog keeps the key, but it is hungry. In the forest lies a bone — guarded by a snake. Answer my riddles first, and I shall give you something to calm her.”'
            },
            questions: [
              {
                q: { nl: 'Raadsel 1: “Ik draaf zonder moe te worden, ik draag zonder handen, en in de wei ben ik koning. Wat ben ik?”',
                     en: 'Riddle 1: “I gallop without tiring, I carry without hands, and in the meadow I am king. What am I?”' },
                answers: [
                  { t: { nl: 'Een paard', en: 'A horse' }, ok: true },
                  { t: { nl: 'De wind', en: 'The wind' }, ok: false },
                  { t: { nl: 'Een wolk', en: 'A cloud' }, ok: false }
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
      bg: 'assets/art/scene-grove.png',
      entryText: {
        nl: 'Een open plek met een ruisende waterval. In de boom kronkelt een grote slang die dreigend naar je sist. Links, bij een stenen boog, gaapt een donkere holte.',
        en: 'A clearing with a rushing waterfall. A great snake coils in the tree, hissing at you in warning. To the left, by a stone arch, yawns a dark hollow.'
      },
      playerStart: { x: 498, y: 286 },
      spawnFrom: { farm: { x: 498, y: 286 }, cave: { x: 140, y: 286 } },
      walkable: [ { x: 40, y: 236, w: 400, h: 66 }, { x: 40, y: 270, w: 488, h: 32 } ],
      fx: {
        waterfall: { x: 266, y: 28, w: 66, h: 186, streaks: 20 },
        snakeTongue: { x: 309, y: 210, dx: -0.05, dy: 1, len: 10, hideFlag: 'snakeCharmed' },
        zzz: { x: 344, y: 138, flag: 'snakeCharmed' }
      },
      obstacles: [],
      overlays: [],
      worldItems: [],
      hotspots: [
        {
          id: 'snake',
          name: { nl: 'Sissende Slang', en: 'Hissing Snake' },
          rect: { x: 252, y: 126, w: 148, h: 96 },
          walkTo: { x: 312, y: 290 },
          speaker: true,
          danger: true,
          dangerUntil: 'snakeCharmed',
          angerTexts: [
            { nl: 'De slang schiet sissend omhoog en ontbloot haar giftanden. Je durft geen stap dichterbij te zetten.', en: 'The snake rears up hissing, baring her fangs. You don’t dare take a step closer.' },
            { nl: 'Met een venijnige uithaal hapt ze naar je. Nog één keer tergen en het loopt slecht af...', en: 'She lashes out viciously, snapping at you. Provoke her once more and it ends badly...' }
          ],
          look: (state) => state.flags.snakeCharmed
            ? { nl: 'De slang wiegt loom heen en weer, betoverd door het wijsje. De weg naar de kist is vrij.', en: 'The snake sways lazily, charmed by the tune. The way to the chest is clear.' }
            : { nl: 'Een grote groene slang kronkelt over de stam en sist dreigend. Zo kom je er niet langs... had je maar iets om haar te bedaren.',
                en: 'A great green snake coils over the log and hisses in warning. There’s no getting past like this... if only you had something to calm her.' },
          use: {
            flute: {
              consume: 'flute',
              setFlag: 'snakeCharmed',
              text: {
                nl: 'Je zet de Wilgenfluit aan je lippen en speelt een zacht wijsje. De slang wiegt mee, haar ogen vallen dicht — Z z z... ze zakt in slaap en glijdt loom opzij. De weg naar de grot is vrij.',
                en: 'You raise the Willow Flute to your lips and play a soft tune. The snake sways along, her eyes closing — Z z z... she drifts to sleep and slides lazily aside. The way to the cave is clear.'
              }
            }
          }
        },
        {
          id: 'toCave',
          name: { nl: 'Stenen Boog', en: 'Stone Arch' },
          rect: { x: 184, y: 48, w: 92, h: 100 },
          walkTo: { x: 232, y: 288 },
          arrow: { x: 228, y: 70, dir: 'up' },
          requiresFlag: 'snakeCharmed',
          blockedText: { nl: 'De sissende slang verspert de weg naar de boog. Je durft er niet langs — bedaar haar eerst.', en: 'The hissing snake blocks the way to the arch. You don’t dare pass — calm her first.' },
          exit: { to: 'cave', travelText: { nl: 'Je glipt door de stenen boog de koele grot in...', en: 'You slip through the stone arch into the cool cave...' } }
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
      bg: 'assets/art/scene-cave-dry.png',
      bgVariants: [ { img: 'assets/art/scene-cave.png', flag: 'waterFlowing' } ],
      entryText: {
        nl: 'Een koele grot vol gloeiende kristallen. Een stenen beeld torent boven een drooggevallen bekken — het water is opgedroogd. Aan de rand ligt een oud bot. In de wand zit een verschoven runenzegel.',
        en: 'A cool cave full of glowing crystals. A stone statue towers over a dry basin — the water has run dry. An old bone lies at its edge. A scrambled rune seal sits in the wall.'
      },
      playerStart: { x: 120, y: 286 },
      spawnFrom: { grove: { x: 120, y: 286 } },
      walkable: [ { x: 55, y: 254, w: 250, h: 48 }, { x: 55, y: 280, w: 435, h: 22 } ],
      obstacles: [],
      overlays: [],
      worldItems: [
        { item: 'bone', hotspot: 'bone', x: 120, y: 232 }
      ],
      hotspots: [
        {
          id: 'seal',
          name: { nl: 'Runenzegel', en: 'Rune Seal' },
          rect: { x: 206, y: 58, w: 124, h: 92 },
          walkTo: { x: 256, y: 290 },
          slidePuzzle: {
            img: 'assets/art/cave-seal.png',
            size: 3,
            setFlag: 'sealSolved',
            give: 'diamond',
            title: { nl: 'Het Runenzegel', en: 'The Rune Seal' },
            solvedText: {
              nl: 'Het runenzegel klikt op zijn plaats en gloeit op. Met een diep gerommel schuift een stenen luik opzij — er rolt een fonkelende Diamant in je hand!',
              en: 'The rune seal clicks into place and glows. With a deep rumble a stone hatch slides aside — a sparkling Diamond rolls into your hand!'
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
          rect: { x: 62, y: 198, w: 98, h: 82 },
          walkTo: { x: 118, y: 288 },
          gives: {
            item: 'bone',
            giveText: { nl: 'Aan de rand van het droge bekken ligt een kaal bot, lang geleden afgekloven. Je raapt het stevige bot op — precies iets voor een hongerig hondje.', en: 'At the edge of the dry basin lies a bare bone, gnawed clean long ago. You pick up the sturdy bone — just the thing for a hungry dog.' },
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
      entryText: {
        nl: 'De oude stal in het avondrood. Achter de vergrendelde paddockpoort staat Maanhoef, die je hoopvol aankijkt.',
        en: 'The old stable in the evening glow. Behind the bolted paddock gate stands Moonhoof, looking at you with hope.'
      },
      playerStart: { x: 120, y: 266 },
      spawnFrom: { farm: { x: 110, y: 266 } },
      walkPoly: [ [78, 232], [472, 232], [472, 302], [78, 302] ],
      obstacles: [],
      overlays: [],
      worldItems: [
        { item: 'bucket', hotspot: 'bucket', x: 196, y: 244 }
      ],
      hotspots: [
        {
          id: 'horse',
          name: { nl: 'Maanhoef', en: 'Moonhoof' },
          rect: { x: 300, y: 66, w: 130, h: 96 },
          walkTo: { x: 300, y: 268 },
          look: (state) => state.flags.horseWatered
            ? { nl: 'Maanhoef is gekalmeerd en staat rustig achter de poort. Nu hij je vertrouwt, kun je de poort openen.', en: 'Moonhoof is calm and stands quietly behind the gate. Now that he trusts you, you can open the gate.' }
            : { nl: 'Maanhoef, een warm kastanjebruin paard met een lichte bles, drukt zijn neus over de stalrand. Hij trilt van angst en dorst — geef hem eerst water voordat je iets anders probeert.', en: 'Moonhoof, a warm chestnut horse with a pale blaze, leans his nose over the stall rail. He trembles with fear and thirst — give him water first before trying anything else.' },
          use: {
            bucketWater: {
              consume: 'bucketWater',
              setFlag: 'horseWatered',
              text: {
                nl: 'Je houdt Maanhoef de emmer over de stalrand voor. Hij drinkt gulzig, zijn oren ontspannen en hij drukt dankbaar zijn neus in je hand. Nu vertrouwt hij je — je kunt de poort openen.',
                en: 'You offer Moonhoof the bucket over the stall rail. He drinks deeply, his ears relax and he gratefully presses his nose into your hand. Now he trusts you — you can open the gate.'
              }
            }
          }
        },
        {
          id: 'bucket',
          name: { nl: 'Houten Emmer', en: 'Wooden Bucket' },
          rect: { x: 168, y: 214, w: 70, h: 64 },
          walkTo: { x: 200, y: 280 },
          gives: {
            item: 'bucket',
            giveText: { nl: 'Je pakt een stevige houten emmer op die naast de stal staat. Misschien handig om water mee te halen.', en: 'You pick up a sturdy wooden bucket standing by the stable. Handy for fetching water, perhaps.' },
            emptyText: { nl: 'Verder geen emmers meer.', en: 'No more buckets here.' }
          }
        },
        {
          id: 'gate',
          name: { nl: 'Vergrendelde Poort', en: 'Bolted Gate' },
          rect: { x: 236, y: 150, w: 132, h: 84 },
          walkTo: { x: 288, y: 272 },
          look: (state) => state.flags.gateOpen
            ? { nl: 'De poort staat open; de weg naar Maanhoef is vrij.', en: 'The gate stands open; the way to Moonhoof is clear.' }
            : { nl: 'Een zware houten paddockpoort met een ijzeren slot. Maanhoef wacht erachter — maar zo angstig als hij nu is, krijg je het slot niet rustig open.', en: 'A heavy wooden paddock gate with an iron lock. Moonhoof waits beyond — but as frightened as he is now, you can’t work the lock calmly.' },
          use: {
            key: {
              requiresFlag: 'horseWatered',
              requiresText: { nl: 'Maanhoef is doodsbang en deinst tegen de poort; zo krijg je het slot niet open. Geef hem éérst water om hem te kalmeren.', en: 'Moonhoof is terrified and shoves against the gate; you can’t work the lock like this. Give him water first to calm him.' },
              consume: 'key',
              setFlag: 'gateOpen',
              win: true,
              text: {
                nl: 'Nu Maanhoef rustig is, past de Stalsleutel precies. Met een klik draait het slot om en de poort zwaait open. Maanhoef stapt vrij naar je toe — je hebt hem gered!',
                en: 'Now that Moonhoof is calm, the Stable Key fits perfectly. With a click the lock turns and the gate swings open. Moonhoof steps free toward you — you have saved him!'
              }
            }
          }
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
