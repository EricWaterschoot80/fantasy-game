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

  sprites: {
    hero:      'assets/art/hero.png',
    heroWalk:  'assets/art/hero-walk.png',
    heroWalk2: 'assets/art/hero-walk2.png',
    heroWave:  'assets/art/hero-wave.png'
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

    q_owl:    { nl: 'Vraag de wijze uil op de paal om raad', en: 'Ask the wise owl on the post for advice' },
    q_snake:  { nl: 'Een slang verspert het bospad — betover haar met de fluit', en: 'A snake blocks the forest path — charm it with the flute' },
    q_cave:   { nl: 'De slang sluimert — ga door de stenen boog de grot in', en: 'The snake is dozing — enter the cave through the stone arch' },
    q_dog:    { nl: 'Geef het hongerige hondje het bot om bij de sleutel te komen', en: 'Give the hungry dog the bone to reach the key' },
    q_gate:   { nl: 'Open met de sleutel de stalpoort naar Maanhoef', en: 'Open the stable gate to Moonhoof with the key' }
  },

  items: {
    flute:   { name: { nl: 'Wilgenfluit', en: 'Willow Flute' }, icon: '🪈' },
    bone:    { name: { nl: 'Sappig Bot', en: 'Juicy Bone' }, icon: '🦴' },
    key:     { name: { nl: 'Stalsleutel', en: 'Stable Key' }, icon: '🗝️', img: 'assets/art/item-key.png' },
    crystal: { name: { nl: 'Kristal', en: 'Crystal' }, icon: '🔷', img: 'assets/art/item-crystal.png' },
    comb:    { name: { nl: 'Kam', en: 'Comb' }, icon: '🪮', img: 'assets/art/item-comb.png' },
    saw:     { name: { nl: 'Zaag', en: 'Saw' }, icon: '🪚', img: 'assets/art/item-saw.png' }
  },

  recipes: [],

  /* Questhint-regels — eerste match wint; quest:null verbergt de hint. */
  questRules: [
    { when: { has: 'key' },                                quest: 'q_gate' },
    { when: { has: 'bone' },                               quest: 'q_dog' },
    { when: { flag: 'snakeCharmed', notFlag: 'taken_cave_bone' }, quest: 'q_cave' },
    { when: { has: 'flute', notFlag: 'snakeCharmed' },     quest: 'q_snake' },
    { when: {},                                            quest: 'q_owl' }
  ],

  scenes: {

    /* ---------- Gebied 1: Het Boerenerf ---------- */
    farm: {
      name: { nl: 'Het Boerenerf', en: 'The Farmyard' },
      bg: 'assets/art/scene-farm.png',
      entryText: {
        nl: 'Een mistig boerenerf in het ochtendlicht. Een schichtig hondje zit in het gras, en op een paal waakt een wijze uil.',
        en: 'A misty farmyard in the morning light. A skittish dog sits in the grass, and a wise owl watches from a post.'
      },
      playerStart: { x: 284, y: 256 },
      spawnFrom: {
        grove: { x: 70, y: 256 },
        stable: { x: 498, y: 256 }
      },
      walkPoly: [ [40, 236], [528, 236], [528, 286], [40, 286] ],
      obstacles: [],
      overlays: [],
      worldItems: [],
      hotspots: [
        {
          id: 'dog',
          name: { nl: 'Schichtig Hondje', en: 'Skittish Dog' },
          rect: { x: 45, y: 205, w: 138, h: 108 },
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
                nl: 'Je legt het sappige bot voor het hondje neer. Het schrokt het dankbaar op, kwispelt wild — en laat je de Stalsleutel van zijn halsband halen!',
                en: 'You set the juicy bone before the dog. It gulps it down gratefully, wags wildly — and lets you take the Stable Key from its collar!'
              }
            }
          }
        },
        {
          id: 'owl',
          name: { nl: 'Wijze Uil', en: 'Wise Owl' },
          rect: { x: 376, y: 120, w: 100, h: 110 },
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
      walkPoly: [ [55, 266], [510, 266], [510, 302], [55, 302] ],
      fx: {
        waterfall: { x: 266, y: 28, w: 66, h: 186, streaks: 20 },
        snakeTongue: { x: 300, y: 193, dx: -0.3, dy: 0.95, len: 11 }
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
              setFlag: 'snakeCharmed',
              text: {
                nl: 'Je zet de Wilgenfluit aan je lippen en speelt een zacht wijsje. De slang wiegt mee, haar ogen vallen half dicht — ze glijdt loom opzij. De kist is bereikbaar.',
                en: 'You raise the Willow Flute to your lips and play a soft tune. The snake sways along, her eyes half closing — she slides lazily aside. The chest is within reach.'
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
      bg: 'assets/art/scene-cave.png',
      entryText: {
        nl: 'Een koele grot vol gloeiende kristallen. Een stenen beeld schenkt eeuwig water in een glinsterend bekken. Aan de rand liggen wat botten.',
        en: 'A cool cave full of glowing crystals. A stone statue pours endless water into a shimmering pool. A few bones lie at its edge.'
      },
      playerStart: { x: 120, y: 286 },
      spawnFrom: { grove: { x: 120, y: 286 } },
      walkable: [ { x: 55, y: 254, w: 250, h: 48 }, { x: 55, y: 280, w: 435, h: 22 } ],
      obstacles: [],
      overlays: [],
      worldItems: [],
      hotspots: [
        {
          id: 'statue',
          name: { nl: 'Stenen Beeld', en: 'Stone Statue' },
          rect: { x: 398, y: 48, w: 164, h: 186 },
          walkTo: { x: 386, y: 292 },
          look: {
            nl: 'Een sereen stenen beeld van een godin schenkt onophoudelijk helder water in het bekken. Het zoemt zacht van oude magie.',
            en: 'A serene stone goddess pours clear water endlessly into the pool. It hums softly with old magic.'
          }
        },
        {
          id: 'bone',
          name: { nl: 'Oude Botten', en: 'Old Bones' },
          rect: { x: 62, y: 198, w: 98, h: 82 },
          walkTo: { x: 118, y: 288 },
          gives: {
            item: 'bone',
            giveText: { nl: 'Aan de rand van het bekken liggen botten, achtergelaten door een dier dat hier kwam drinken. Je raapt een stevig, Sappig Bot op.', en: 'At the pool’s edge lie bones, left by some creature that came to drink. You pick up a sturdy, Juicy Bone.' },
            emptyText: { nl: 'Verder geen bruikbare botten meer.', en: 'No more usable bones here.' }
          }
        },
        {
          id: 'crystal',
          name: { nl: 'Gloeiend Kristal', en: 'Glowing Crystal' },
          rect: { x: 150, y: 196, w: 100, h: 82 },
          walkTo: { x: 196, y: 288 },
          gives: {
            item: 'crystal',
            giveText: { nl: 'Je breekt een helder, blauw Kristal los uit de tros. Het gloeit warm na in je hand.', en: 'You break a clear blue Crystal from the cluster. It glows warmly in your hand.' },
            emptyText: { nl: 'De rest van de kristallen zit muurvast.', en: 'The rest of the crystals are stuck fast.' }
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
      worldItems: [],
      hotspots: [
        {
          id: 'horse',
          name: { nl: 'Maanhoef', en: 'Moonhoof' },
          rect: { x: 300, y: 66, w: 130, h: 96 },
          walkTo: { x: 300, y: 268 },
          look: {
            nl: 'Maanhoef, een warm kastanjebruin paard met een lichte bles, drukt zijn neus over de stalrand. “Bijna, vriend,” fluister je. “Nog heel even.”',
            en: 'Moonhoof, a warm chestnut horse with a pale blaze, leans his nose over the stall rail. “Almost, friend,” you whisper. “Just a little longer.”'
          }
        },
        {
          id: 'gate',
          name: { nl: 'Vergrendelde Poort', en: 'Bolted Gate' },
          rect: { x: 236, y: 150, w: 132, h: 84 },
          walkTo: { x: 288, y: 272 },
          look: (state) => ({ nl: 'Een zware houten paddockpoort met een ijzeren slot. Maanhoef wacht erachter.', en: 'A heavy wooden paddock gate with an iron lock. Moonhoof waits beyond.' }),
          use: {
            key: {
              consume: 'key',
              win: true,
              text: {
                nl: 'De Stalsleutel past precies. Met een klik draait het slot om en de poort zwaait open...',
                en: 'The Stable Key fits perfectly. With a click the lock turns and the gate swings open...'
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
