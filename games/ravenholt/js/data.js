/* ============================================================
   data.js — ALLE spelinhoud van "Whispers of Ravenholt".
   Tweetalig: elke tekst is {nl, en}; de engine kiest via L().
   Coördinaten zijn scene-pixels (568×320, liggend).

   Dit is een START-STUB: een compleet speelbaar mini-spel
   (losse straatsteen → sleutel → poortslot → lantaarn → winst) dat
   ALLEEN generieke engine-features gebruikt. Het draait zónder art:
   de engine valt terug op een geschilderde scene + emoji-iconen.

   Bouw het stap voor stap om naar je eigen verhaal:
   1. titel / teksten / winText / ui
   2. items + recepten
   3. scenes: walkPoly (of walkable), hotspots, puzzels
   4. teken art in assets/art/ (568×320 scenes, sprites) en koppel via
      scene.bg / scene.bgVariants / GAME.sprites
   Zie ../../RETRO-ADVENTURE-SPEC.md voor het volledige datamodel en de
   drie herbruikbare puzzeltypes (runen-volgorde, tegel-volgorde, legpuzzel).

   Bij ELKE wijziging: bump de ?v= in index.html, de assetVer hieronder
   én de CACHE in sw.js (zie README.md → Cache-busting).
   ============================================================ */

const GAME = {
  title:      { nl: 'Fluisteringen van Ravenholt', en: 'Whispers of Ravenholt' },
  titleLines: { nl: ['Fluisteringen', 'van Ravenholt'], en: ['Whispers of', 'Ravenholt'] },
  startScene: 'square',
  assetVer: '1',   /* wordt als ?v= achter alle asset-URL's gezet; ophogen bij elke art-wijziging */

  /* Nog geen eigen art nodig om te starten. Vul later met je sprites:
     sprites: { hero: 'assets/art/hero.png', heroWave: 'assets/art/hero-wave.png', ... } */
  sprites: {},

  winText: {
    nl: 'De lantaarn flakkert aan en werpt warm licht over de mist. Ravenholt heeft je gezien — en je eerste avond is volbracht.',
    en: 'The lantern sputters to life, casting warm light through the fog. Ravenholt has seen you — and your first night is done.'
  },

  strings: {
    noEffect:     { nl: 'Dat werkt hier niet.', en: 'That doesn’t work here.' },
    noCombine:    { nl: 'Die twee laten zich niet combineren.', en: 'Those two don’t combine.' },
    nothingThere: { nl: 'Daar valt niets te ontdekken.', en: 'There’s nothing to find there.' }
  },

  ui: {
    subtitle:   { nl: 'Een point-and-click mysterie', en: 'A point-and-click mystery' },
    intro:      { nl: 'Mist hangt over het stille dorp Ravenholt. Achter een vergrendelde poort wacht een gedoofde lantaarn. Vind de weg naar binnen.',
                  en: 'Fog hangs over the silent village of Ravenholt. Beyond a locked gate waits an unlit lantern. Find your way in.' },
    credit:     { nl: 'Een RetroAdventureWorld-avontuur', en: 'A RetroAdventureWorld adventure' },
    startBtn:   { nl: 'Begin het mysterie', en: 'Begin the mystery' },
    winTitle:   { nl: 'De Lantaarn Brandt', en: 'The Lantern Burns' },
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

    /* questhint-teksten — verwezen vanuit questRules hieronder */
    q_explore:  { nl: 'Verken het dorpsplein', en: 'Explore the village square' },
    q_unlock:   { nl: 'Gebruik de sleutel op het poortslot', en: 'Use the key on the gate lock' },
    q_lantern:  { nl: 'Ga door de poort en pak de lantaarn', en: 'Go through the gate and take the lantern' }
  },

  items: {
    key:     { name: { nl: 'Oude Sleutel', en: 'Old Key' }, icon: '🗝️' },
    lantern: { name: { nl: 'Gedoofde Lantaarn', en: 'Unlit Lantern' }, icon: '🏮' }
  },

  /* Recepten combineren twee tas-items tot een derde. Voorbeeld:
     { a: 'flint', b: 'steel', result: 'fire', text: { nl:'...', en:'...' } } */
  recipes: [],

  /* Questhint-regels — eerste match wint; quest:null verbergt de hint. */
  questRules: [
    { when: { flag: 'taken_square_lantern' }, quest: null },
    { when: { flag: 'gateOpen' },             quest: 'q_lantern' },
    { when: { has: 'key' },                   quest: 'q_unlock' },
    { when: {},                               quest: 'q_explore' }
  ],

  scenes: {
    square: {
      name: { nl: 'Het Dorpsplein', en: 'The Village Square' },
      /* bg: 'assets/art/scene-square.png',  ← koppel hier je eigen 568×320 achtergrond */
      entryText: {
        nl: 'Een verlaten plein in de mist. Tussen de keien glinstert iets, en aan de overkant gaapt een vergrendelde smeedijzeren poort.',
        en: 'A deserted square wrapped in fog. Something glints between the cobbles, and across the way looms a locked wrought-iron gate.'
      },
      playerStart: { x: 284, y: 252 },

      /* Beloopbaar gebied (veelhoek in scene-pixels). Of gebruik walkable: [ {x,y,w,h}, ... ]. */
      walkPoly: [[60, 196], [508, 196], [508, 300], [60, 300]],
      obstacles: [],
      overlays: [],
      worldItems: [],
      npcs: [],
      fx: {},

      hotspots: [
        {
          id: 'cobble',
          name: { nl: 'Losse Kei', en: 'Loose Cobble' },
          rect: { x: 70, y: 168, w: 96, h: 84 },
          walkTo: { x: 140, y: 250 },
          gives: {
            item: 'key',
            giveText: { nl: 'Onder de kei ligt een Oude Sleutel, groen uitgeslagen.', en: 'Beneath the cobble lies an Old Key, green with age.' },
            emptyText: { nl: 'Onder de kei is niets meer.', en: 'There’s nothing left under the cobble.' }
          }
        },
        {
          id: 'gateLock',
          name: { nl: 'Poortslot', en: 'Gate Lock' },
          rect: { x: 236, y: 150, w: 96, h: 96 },
          walkTo: { x: 284, y: 250 },
          look: {
            nl: 'Een zwaar, verroest poortslot. Er past vast een sleutel in.',
            en: 'A heavy, rusted gate lock. A key would surely fit.'
          },
          use: {
            key: {
              consume: 'key',
              setFlag: 'gateOpen',
              text: { nl: 'De sleutel knarst om en de poort kreunt open!', en: 'The key grinds round and the gate groans open!' }
            }
          }
        },
        {
          id: 'lantern',
          name: { nl: 'Lantaarn', en: 'Lantern' },
          rect: { x: 392, y: 158, w: 108, h: 92 },
          walkTo: { x: 430, y: 250 },
          requiresFlag: 'gateOpen',
          blockedText: { nl: 'De poort zit op slot. Vind eerst een sleutel.', en: 'The gate is locked. Find a key first.' },
          gives: {
            item: 'lantern',
            win: true,
            giveText: { nl: 'Voorbij de poort hangt een oude lantaarn. Je neemt hem van de haak.', en: 'Beyond the gate hangs an old lantern. You lift it from its hook.' },
            emptyText: { nl: 'Er hangt niets meer.', en: 'Nothing hangs there anymore.' }
          }
        }
      ]
    }
  }
};
