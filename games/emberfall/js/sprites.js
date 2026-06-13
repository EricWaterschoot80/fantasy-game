/* ============================================================
   sprites.js — pixel-art sprites (jaren-90 stijl)
   Sprites zijn string-grids; elk teken is een palet-kleur,
   '.' = transparant. Getekend op de low-res scene-canvas.
   ============================================================ */

const PAL = {
  '0': '#211611',   // outline
  'r': '#a8432a',   // rust / mantel
  'R': '#7c2e1c',   // mantel schaduw
  'q': '#c75b35',   // mantel licht
  's': '#e8b890',   // huid
  'S': '#c08a60',   // huid schaduw
  'g': '#c9a24b',   // goud
  'G': '#e7cf86',   // goud licht
  'b': '#5a4030',   // leer / laars
  'B': '#3a281c',   // leer donker
  'n': '#4a3e63',   // ziener-gewaad
  'N': '#332a47',   // gewaad schaduw
  'm': '#8a6a4a',   // minotaur-huid
  'M': '#6a4e34',   // minotaur schaduw
  'k': '#3c3a45',   // pantser
  'K': '#26242e',   // pantser donker
  'l': '#787489',   // pantser licht / staal
  'h': '#d8c8a8',   // hoorn
  'H': '#efe8d0',   // hoorn licht
  'w': '#efe3c8',   // perkament-wit
  'c': '#9adbe8',   // waterglinstering
  'y': '#ffd34e',   // vlam geel / oog-gloed
  'o': '#e8862a',   // vlam oranje
  'p': '#b9a3d8'    // magische gloed
};

/* Teken een sprite-grid op (x, y) = linkerbovenhoek, in scene-pixels.
   scale > 1 maakt de sprite chunky (cellen van scale×scale px). */
function drawSprite(ctx, rows, x, y, flip = false, scale = 1) {
  for (let j = 0; j < rows.length; j++) {
    const row = rows[j];
    for (let i = 0; i < row.length; i++) {
      const ch = flip ? row[row.length - 1 - i] : row[i];
      const col = PAL[ch];
      if (col) {
        ctx.fillStyle = col;
        ctx.fillRect(x + i * scale, y + j * scale, scale, scale);
      }
    }
  }
}

/* ---------- De reiziger (speler) — 13 breed, 16 romp + 6 benen ---------- */

const PLAYER_BODY = {
  down: [
    '.....000.....',
    '....0rrr0....',
    '...0rrrrr0...',
    '...0rRrRr0...',
    '...0sssss0...',
    '...0s0s0s0...',
    '...0Sssss0...',
    '....0sss0....',
    '...0rrrrr0...',
    '..0rqrrrqr0..',
    '..0rRrrrRr0..',
    '..0rRrrrRr0..',
    '..0rgGggrr0..',
    '..0rrrrrrr0..',
    '...0rrrrr0...',
    '...0RrrrR0...'
  ],
  up: [
    '.....000.....',
    '....0rrr0....',
    '...0rrrrr0...',
    '...0rRRRr0...',
    '...0rRrRr0...',
    '...0rrrrr0...',
    '...0Rrrrr0...',
    '....0rrr0....',
    '...0rrrrr0...',
    '..0rqrrrqr0..',
    '..0rRrrrRr0..',
    '..0rRrrrRr0..',
    '..0rrrrrrr0..',
    '..0rrrrrrr0..',
    '...0rrrrr0...',
    '...0RrrrR0...'
  ],
  side: [
    '.....000.....',
    '....0rrr0....',
    '...0rrrrr0...',
    '...0rRrrr0...',
    '...0Rrsss0...',
    '...0Rrs0s0...',
    '...0Rrsss0...',
    '....0Rss0....',
    '...0rrrrr0...',
    '..0rrrrrq0...',
    '..0rRrrrr0...',
    '..0rRrrrr0...',
    '..0rgGgrr0...',
    '..0rrrrrr0...',
    '...0rrrrr0...',
    '...0Rrrrr0...'
  ]
};

const PLAYER_LEGS = {
  down: [
    [ // stilstaan
      '....bb.bb....',
      '....bb.bb....',
      '....bb.bb....',
      '....bb.bb....',
      '....BB.BB....',
      '.............'
    ],
    [ // stap links
      '....bb.bb....',
      '....bb.bb....',
      '....BB.bb....',
      '.......bb....',
      '.......BB....',
      '.............'
    ],
    [ // stap rechts
      '....bb.bb....',
      '....bb.bb....',
      '....bb.BB....',
      '....bb.......',
      '....BB.......',
      '.............'
    ]
  ],
  side: [
    [
      '....bb.bb....',
      '....bb.bb....',
      '....bb.bb....',
      '....bb.bb....',
      '....BB.BB....',
      '.............'
    ],
    [
      '....bb.bb....',
      '...bb...bb...',
      '...bb...bb...',
      '..bb.....bb..',
      '..BB.....BB..',
      '.............'
    ],
    [
      '....bb.bb....',
      '....bb.bb....',
      '....bbbb.....',
      '.....bb......',
      '.....BB......',
      '.............'
    ]
  ]
};
PLAYER_LEGS.up = PLAYER_LEGS.down;

/* Geeft het volledige sprite-grid voor richting + loopframe (0..2). */
function playerFrame(dir, frame) {
  const d = dir === 'left' || dir === 'right' ? 'side' : dir;
  return PLAYER_BODY[d].concat(PLAYER_LEGS[d][frame]);
}
const PLAYER_W = 13, PLAYER_H = 22;

/* ---------- De Ziener — 13 breed × 19 hoog, 2 frames (wiegen) ---------- */

const SEER_FRAMES = [
  [
    '.....000.....',
    '....0nnn0....',
    '...0nnnnn0...',
    '..0nnNNNnn0..',
    '..0nN0p0Nn0..',
    '..0nNNNNNn0..',
    '..0nnnnnnn0..',
    '..0nnnnnnn0..',
    '.0nnnnnnnnn0.',
    '.0nNnnnnnNn0.',
    '.0nNngggnNn0.',
    '.0nNnnnnnNn0.',
    '.0nnnnnnnnn0.',
    '.0nnnnnnnnn0.',
    '.0nNnnnnnNn0.',
    '.0nnnnnnnnn0.',
    '.0Nnnnnnnnn0.',
    '.0NNnnnnnNN0.',
    '..000000000..'
  ],
  [
    '.....000.....',
    '....0nnn0....',
    '...0nnnnn0...',
    '..0nnNNNnn0..',
    '..0nN0p0Nn0..',
    '..0nNNNNNn0..',
    '..0nnnnnnn0..',
    '..0nnnnnnn0..',
    '.0nnnnnnnnn0.',
    '.0nNnnnnnNn0.',
    '.0nNngGgnNn0.',
    '.0nNnnnnnNn0.',
    '.0nnnnnnnnn0.',
    '.0nnnnnnnnn0.',
    '.0Nnnnnnnnn0.',
    '.0nnnnnnnnn0.',
    '.0nNnnnnnnn0.',
    '.0NNnnnnnNN0.',
    '..000000000..'
  ]
];
const SEER_W = 13, SEER_H = 19;

/* ---------- De Minotaur (wakker) — 27 breed × 32 hoog, 2 frames ---------- */

const MINO_FRAME_0 = [
  '.....Hh..............hH....',
  '.....Hhh............hhH....',
  '......Hh....0000....hH.....',
  '.......h...0mmmm0...h......',
  '.......0h.0mmmmmm0.h0......',
  '........0.0mMmmMm0.0.......',
  '..........0my00ym0.........',
  '..........0mmmmmm0.........',
  '...........0mMMm0..........',
  '............0mm0...........',
  '......000000mm0000.........',
  '....00kkkkkkkkkkkk00.......',
  '...0kkllkkkkkkkkllkk0......',
  '..0kklkkkkkkkkkkkklkk0.....',
  '..0kkkkkKKKKKKkkkkkkk0.....',
  '.0mkkkkkKKKKKKkkkkkkm0.....',
  '.0mm0kkkkkkkkkkkkk0mm0.....',
  '.0mm0kkkkkkkkkkkkk0mm0.....',
  '.0mM0kKKkkkkkkKKk0Mm0.0l0..',
  '..0m0kkkkkkkkkkkk0m0..0l0..',
  '..0M0.0RRRRRRRR0.0M0..0l0..',
  '..00..0RrrrrrrR0..0g0.0l0..',
  '......0RrrrrrrR0...0g0l0...',
  '......0Rrr00rrR0....0gl0...',
  '......0mm0..0mm0....0l0....',
  '......0mm0..0mm0...........',
  '......0mm0..0mm0...........',
  '......0Mm0..0mM0...........',
  '.....0mmm0..0mmm0..........',
  '.....0BB00..00BB0..........',
  '.....0BBB0..0BBB0..........',
  '......000....000...........'
];
/* Frame 2 = alles 1 pixel lager (ademen), benen blijven staan. */
const MINO_AWAKE = [
  MINO_FRAME_0,
  ['.'.repeat(27)].concat(MINO_FRAME_0.slice(0, 23), MINO_FRAME_0.slice(24))
];
const MINO_W = 27, MINO_H = 32;

/* ---------- De Minotaur (slapend) — liggend, 34 breed × 13 hoog ---------- */

const MINO_ASLEEP = [
  '.Hh...............................',
  '.Hhh....000000000000000...........',
  '..Hh...0kkkkkkkkkkkkkkk00.........',
  '..0h..0kkllkkkkkkkkkkkkkk0........',
  '..0000mmmmm0kkkkkkkkkkkkkk0.......',
  '.0mmmmmMmmm0kkKKKKkkkkkkkk0.......',
  '.0mM00mmmm0kkkkkkkkkkkkkkk0.......',
  '.0mmmmmmm0kkkkkkkkkkkk00mm00......',
  '..0mMMmm0RRrrrrrrR00kk0mmmm0......',
  '...0mmm0RrrrrrrrrrR00.0mMmm0......',
  '....000RrrrrrrrrrrrR0..0mm0.......',
  '......00000000000000....00........',
  '..................................'
];
const MINO_SLEEP_W = 34, MINO_SLEEP_H = 13;

/* ---------- Kleine props ---------- */

const AMULET_SPRITE = [
  '..gg..',
  '.g..g.',
  'g0gg0g',
  'g0rr0g',
  'g0rr0g',
  '.0gg0.',
  '..00..'
];

/* Vlam-frames voor de vuurschalen (5×6) */
const FLAME_FRAMES = [
  [
    '..o..',
    '..o..',
    '.oyo.',
    '.oyo.',
    'oyyyo',
    '.ooo.'
  ],
  [
    '.o...',
    '.oo..',
    '.oyo.',
    'oyyo.',
    'oyyyo',
    '.ooo.'
  ],
  [
    '...o.',
    '..oo.',
    '.oyo.',
    '.oyyo',
    'oyyyo',
    '.ooo.'
  ]
];

/* Pixel-letter Z voor het snurken (3×4) */
const Z_GLYPH = [
  'www',
  '..w',
  '.w.',
  'www'
];
