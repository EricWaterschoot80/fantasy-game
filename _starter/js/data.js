/* ============================================================
   data.js — STARTER-STUB voor een nieuw RetroAdventureWorld-avontuur.
   Dit is een compleet speelbaar mini-spel (1 scene, sleutel → slot →
   kist → winst) dat ALLEEN generieke engine-features gebruikt en geen
   art nodig heeft: de engine valt terug op de geschilderde fallback-scene
   en op emoji-iconen voor items.

   Vervang stap voor stap door je eigen verhaal:
   1. titel / teksten / winText
   2. items + recepten
   3. scenes: walkPoly, hotspots, puzzels
   4. teken art in assets/art/ en koppel via scene.bg / GAME.sprites
   Zie RETRO-ADVENTURE-SPEC.md voor het volledige datamodel.

   Coördinaten zijn scene-pixels (568×320, liggend). Teksten zijn {nl,en}.
   ============================================================ */

const GAME = {
  title:      { nl: 'Nieuw Avontuur', en: 'New Adventure' },
  titleLines: { nl: ['Nieuw', 'Avontuur'], en: ['New', 'Adventure'] },
  startScene: 'clearing',

  /* Geen eigen art nodig om te starten. Vul deze later met je sprites:
     sprites: { hero: 'assets/art/hero.png', ... }  */
  sprites: {},

  winText: {
    nl: 'De edelsteen gloeit warm in je hand. Je eerste avontuur is volbracht!',
    en: 'The gem glows warm in your hand. Your first adventure is complete!'
  },

  strings: {
    noEffect:     { nl: 'Dat werkt hier niet.', en: 'That doesn’t work here.' },
    noCombine:    { nl: 'Die twee laten zich niet combineren.', en: 'Those two don’t combine.' },
    nothingThere: { nl: 'Daar valt niets te ontdekken.', en: 'There’s nothing to find there.' }
  },

  ui: {
    subtitle:   { nl: 'Een point-and-click avontuur', en: 'A point-and-click adventure' },
    intro:      { nl: 'Een korte proeftocht. Vind de sleutel, open de kist en pak de schat.',
                  en: 'A short trial. Find the key, open the chest and take the treasure.' },
    credit:     { nl: 'Gemaakt met de RetroAdventureWorld-engine', en: 'Built with the RetroAdventureWorld engine' },
    startBtn:   { nl: 'Begin het avontuur', en: 'Begin the adventure' },
    winTitle:   { nl: 'Volbracht', en: 'Complete' },
    replayBtn:  { nl: 'Opnieuw spelen', en: 'Play again' },
    deathTitle: { nl: 'Verslagen...', en: 'Defeated...' },
    deathText:  { nl: 'Dat liep niet goed af. Probeer het opnieuw.', en: 'That went badly. Try again.' },
    retryBtn:   { nl: 'Probeer opnieuw', en: 'Try again' },
    rotateTitle:{ nl: 'Draai je telefoon', en: 'Rotate your phone' },
    rotateText: { nl: 'Dit avontuur speelt liggend. Draai je scherm een kwartslag.',
                  en: 'This adventure plays in landscape. Turn your screen sideways.' },
    tapContinue:{ nl: 'tik om verder te gaan ▸', en: 'tap to continue ▸' },
    selected:   { nl: 'geselecteerd', en: 'selected' },

    /* questhint-teksten — verwezen vanuit questRules hieronder */
    q_explore:  { nl: 'Verken de open plek', en: 'Explore the clearing' },
    q_use:      { nl: 'Gebruik de sleutel op het slot van de kist', en: 'Use the key on the chest lock' },
    q_take:     { nl: 'Open de kist en pak de schat', en: 'Open the chest and take the treasure' }
  },

  items: {
    key: { name: { nl: 'Roestige Sleutel', en: 'Rusty Key' }, icon: '🗝️' },
    gem: { name: { nl: 'Gloeiende Edelsteen', en: 'Glowing Gem' }, icon: '💎' }
  },

  /* Recepten combineren twee items in de tas tot een derde. Voorbeeld:
     { a: 'flint', b: 'steel', result: 'fire', text: { nl:'...', en:'...' } } */
  recipes: [],

  /* Questhint-regels — eerste match wint; quest:null verbergt de hint. */
  questRules: [
    { when: { flag: 'taken_clearing_chest' }, quest: null },
    { when: { flag: 'opened' },               quest: 'q_take' },
    { when: { has: 'key' },                   quest: 'q_use' },
    { when: {},                               quest: 'q_explore' }
  ],

  scenes: {
    clearing: {
      name: { nl: 'De Open Plek', en: 'The Clearing' },
      /* bg: 'assets/art/scene-clearing.png',  ← koppel hier je eigen achtergrond */
      entryText: {
        nl: 'Een stille open plek. Onder een steen glinstert iets, en verderop staat een verzegelde kist.',
        en: 'A quiet clearing. Something glints under a stone, and a sealed chest stands nearby.'
      },
      playerStart: { x: 284, y: 252 },

      /* Beloopbaar gebied (veelhoek in scene-pixels). */
      walkPoly: [[60, 196], [508, 196], [508, 300], [60, 300]],
      obstacles: [],
      overlays: [],
      worldItems: [],
      npcs: [],
      fx: {},

      hotspots: [
        {
          id: 'stone',
          name: { nl: 'Losse Steen', en: 'Loose Stone' },
          rect: { x: 70, y: 168, w: 96, h: 84 },
          walkTo: { x: 140, y: 250 },
          gives: {
            item: 'key',
            giveText: { nl: 'Onder de steen ligt een Roestige Sleutel.', en: 'Beneath the stone lies a Rusty Key.' },
            emptyText: { nl: 'Onder de steen is niets meer.', en: 'There’s nothing left under the stone.' }
          }
        },
        {
          id: 'lock',
          name: { nl: 'Slot van de Kist', en: 'Chest Lock' },
          rect: { x: 236, y: 150, w: 96, h: 96 },
          walkTo: { x: 284, y: 250 },
          look: {
            nl: 'Een zwaar ijzeren slot. Er past vast een sleutel in.',
            en: 'A heavy iron lock. A key would surely fit.'
          },
          use: {
            key: {
              consume: 'key',
              setFlag: 'opened',
              text: { nl: 'De sleutel knarst om en het slot springt open!', en: 'The key grinds round and the lock springs open!' }
            }
          }
        },
        {
          id: 'chest',
          name: { nl: 'Stenen Kist', en: 'Stone Chest' },
          rect: { x: 392, y: 158, w: 108, h: 92 },
          walkTo: { x: 430, y: 250 },
          requiresFlag: 'opened',
          blockedText: { nl: 'De kist zit op slot. Vind eerst een sleutel.', en: 'The chest is locked. Find a key first.' },
          gives: {
            item: 'gem',
            win: true,
            giveText: { nl: 'In de kist gloeit een Edelsteen. Je grijpt hem vast.', en: 'A Gem glows inside the chest. You grasp it.' },
            emptyText: { nl: 'De kist is leeg.', en: 'The chest is empty.' }
          }
        }
      ]
    }
  }
};
