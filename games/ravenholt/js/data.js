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
  assetVer: '2',

  /* Finn — vaste figuur: roodharige jongen, blauwe kapmantel, leren tas, houten staf.
     idle = hero, loopcyclus = heroWalk/heroWalk2 (2-frame), zwaaien = heroWave. */
  sprites: {
    hero:      'assets/art/hero.png',
    heroWalk:  'assets/art/hero-walk.png',
    heroWalk2: 'assets/art/hero-walk2.png',
    heroWave:  'assets/art/hero-wave.png'
  },

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
    intro:      { nl: 'In het koninkrijk Eldoria is de fontein op het dorpsplein al weken drooggevallen. De jonge Finn — die droomt van magie en wiens vader gevangen zit in het kasteel — gaat op onderzoek uit.',
                  en: 'In the kingdom of Eldoria the village-square fountain has run dry for weeks. Young Finn — who dreams of magic and whose father is imprisoned in the castle — sets out to investigate.' },
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
    q_fountain: { nl: 'Onderzoek waarom de fontein is drooggevallen', en: 'Investigate why the fountain has run dry' },
    q_mill:     { nl: 'Bekijk de oude watermolen aan de rand van het plein', en: 'Inspect the old watermill at the edge of the square' }
  },

  items: {
    coin: { name: { nl: 'Oud Muntje', en: 'Old Coin' }, icon: '🪙' },
    note: { name: { nl: 'Verfrommeld Briefje', en: 'Crumpled Note' }, icon: '📜',
            look: { nl: '“...het rad is niet zomaar verdwenen. Volg de lichten in de vallei.”', en: '“...the wheel did not simply vanish. Follow the lights in the valley.”' } }
  },

  recipes: [],

  questRules: [
    { when: { flag: 'lookedMill', has: ['coin', 'note'] }, quest: null },
    { when: { flag: 'seenFountain' },                      quest: 'q_mill' },
    { when: {},                                            quest: 'q_explore' }
  ],

  scenes: {
    square: {
      name: { nl: 'Het Dorpsplein', en: 'The Village Square' },
      bg: 'assets/art/scene-square.png',
      entryText: {
        nl: 'Het dorpsplein van Eldoria, gehuld in avondmist. In het midden staat de stenen fontein — droog en stil. Aan de rand kraakt de oude watermolen.',
        en: 'The village square of Eldoria, wrapped in evening mist. The stone fountain stands dry and silent in the middle. At the edge the old watermill creaks.'
      },
      playerStart: { x: 120, y: 286 },

      /* Beloopbare keien rondom de fontein (de molen rechts en de fontein zelf zijn geblokkeerd). */
      walkable: [
        { x: 40,  y: 296, w: 488, h: 20 },   // voorgrond-strook vóór de fontein
        { x: 40,  y: 222, w: 150, h: 94 },   // keien links van de fontein
        { x: 366, y: 222, w: 104, h: 94 }    // keien rechts (vóór de molen)
      ],
      obstacles: [
        { x: 190, y: 232, w: 182, h: 68 }    // de fontein-bak (niet doorheen lopen)
      ],
      overlays: [],
      worldItems: [],
      npcs: [],
      fx: {},

      hotspots: [
        {
          id: 'fountain',
          name: { nl: 'Drooggevallen Fontein', en: 'Dry Fountain' },
          rect: { x: 196, y: 150, w: 176, h: 150 },
          walkTo: { x: 284, y: 308 },
          look: (state) => state.flags.seenFountain
            ? { nl: 'De fontein blijft droog. Zonder stromend water komt hier niets op gang.', en: 'The fountain stays dry. Without flowing water nothing will start here.' }
            : { nl: 'De fontein is al weken droog. Geen druppel water. Iemand zei dat de watermolen het water hierheen pompt... maar de molen staat stil.', en: 'The fountain has been dry for weeks. Not a drop. Someone said the watermill pumps the water here... but the mill stands still.' },
          setFlag: 'seenFountain'
        },
        {
          id: 'coin',
          name: { nl: 'Iets Glimmends', en: 'Something Shiny' },
          rect: { x: 56, y: 290, w: 60, h: 24 },
          walkTo: { x: 92, y: 302 },
          gives: {
            item: 'coin',
            giveText: { nl: 'Tussen de keien glinstert een oud muntje. Je steekt het in je tas.', en: 'An old coin glints between the cobbles. You pocket it.' },
            emptyText: { nl: 'Niets meer tussen de keien hier.', en: 'Nothing more between the cobbles here.' }
          }
        },
        {
          id: 'note',
          name: { nl: 'Briefje aan de Muur', en: 'Note on the Wall' },
          rect: { x: 384, y: 232, w: 56, h: 40 },
          walkTo: { x: 408, y: 304 },
          gives: {
            item: 'note',
            giveText: { nl: 'Een verfrommeld briefje is aan een paal geprikt. Je pakt het en leest het later na (tik het aan in je tas).', en: 'A crumpled note is pinned to a post. You take it to read later (tap it in your bag).' },
            emptyText: { nl: 'De paal is nu leeg.', en: 'The post is empty now.' }
          }
        },
        {
          id: 'mill',
          name: { nl: 'Oude Watermolen', en: 'Old Watermill' },
          rect: { x: 470, y: 150, w: 96, h: 150 },
          walkTo: { x: 452, y: 304 },
          look: {
            nl: 'De grote watermolen kraakt zachtjes. Het waterrad ontbreekt — er is alleen een lege as waar het ooit zat. Zonder rad pompt de molen geen water.',
            en: 'The great watermill creaks softly. Its water wheel is missing — only a bare axle remains where it once turned. Without the wheel the mill pumps no water.'
          },
          setFlag: 'lookedMill'
        }
      ]
    }
  }
};
