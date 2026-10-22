#!/usr/bin/env python3
"""Generate the crawlable landing page for each game (EN, primary market).

One page per game at a clean URL (/maanhoef/, /amulet-of-emberfall/, ...).
It is the page Google indexes for the game: story, facts, real screenshots,
a Play button to the game itself (/games/<slug>/, which is noindex) and
spoiler-safe progressive hints. Hints follow the solution routes that the
scripted full playthroughs actually used; change them only after re-testing.

Run:  python3 tools/build-game-pages.py
"""
import json
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.retroadventureworld.com"
UPDATED = "2026-10-22"

GAMES = [
    {
        "slug": "maanhoef", "file": "maanhoef", "title": "Maanhoef",
        "seo_title": "Maanhoef: Free Point-and-Click Horse Adventure Game",
        "desc": "Play Maanhoef free in your browser: a gentle 16-bit point-and-click adventure. Help Loïs rescue her horse Moonhoof. Story, screenshots and spoiler-free hints.",
        "play": "/games/maanhoef/", "shots": "maanhoef",
        "shot_names": [("farm", "Loïs on the farm path, with the barn, the vegetable garden and the owl on its post"),
                       ("grove", "The forest grove with the broken bridge"),
                       ("cave", "The cave with the stone statue and the rune seal"),
                       ("stable", "The old stable where Moonhoof is locked in")],
        "intro": [
            "Moonhoof, Loïs's dearest horse, is locked in the old stable, and the key hangs on the collar of a shy little dog. To get it back you explore a farm, a forest and a cave, trade the right things with the right animals and solve a few small puzzles.",
            "Maanhoef is the gentlest game on RetroAdventureWorld: a short, warm point-and-click adventure in 16-bit pixel art for children from about seven and for anyone who likes cosy puzzle games. You meet a wise owl with riddles, a hissing snake, a hungry mouse and the dog with the key. Nothing happens on a timer, so you can take all the time you need.",
        ],
        "facts": [("Genre", "Point-and-click adventure, cosy puzzle"), ("Play time", "About 20 minutes"),
                  ("Difficulty", "Easy"), ("Age", "7+ (younger with a parent reading along); also for adults"),
                  ("Languages", "English and Dutch"), ("Plays on", "Phone (landscape), tablet and desktop, in the browser"),
                  ("Saving", "Progress is saved automatically on your device"), ("Price", "Free, no ads, no account needed")],
        "how": "Tap or click to walk and to look at things. Pick up items, then select an item in your bag and tap where you want to use it. The banner at the top always shows your current goal, and the eye button highlights everything you can tap.",
        "age": 7, "minutes": 20, "genre": ["Point-and-click adventure", "Puzzle", "Pixel art"],
        "hints": [
            ("Getting started at the farm", [
                "Talk to everyone on the farm, especially the owl on its post.",
                "The owl asks riddles. Answer them and it gives you something musical.",
                "Answer the owl's riddles to get the flute, and pick a carrot from the vegetable garden."]),
            ("The snake in the forest", [
                "Snakes are said to calm down when they hear music.",
                "Use the flute you got from the owl.",
                "In the forest, play the flute for the snake (or choose \"Play the flute\" when she speaks to you). She lets you pass."]),
            ("The broken bridge and the stable", [
                "Something in the stable could fix a gap in a bridge.",
                "Look around the stable for a plank and a bucket, and give Moonhoof the carrot.",
                "Take the plank and the bucket from the stable, feed Moonhoof the carrot, then use the plank on the broken bridge in the forest."]),
            ("Inside the cave", [
                "The statue in the cave is missing something shiny.",
                "Complete the rune seal (a picture puzzle) to win a diamond, and look for a bone.",
                "Take the bone, solve the rune seal puzzle to get the diamond, put the diamond in the statue so water flows, and fill your bucket."]),
            ("Getting the stable key", [
                "Moonhoof is thirsty, and the shy dog likes chewing on things.",
                "Water the horse, then make friends with the dog.",
                "Give Moonhoof the bucket of water, then give the bone to the dog on the farm. It drops the stable key."]),
            ("Freeing Moonhoof", [
                "Once the gate is open, search the straw. Someone small is hungry.",
                "The mouse wants cheese and guards a sliding picture puzzle.",
                "Unlock the gate, find the cheese in the straw, give it to the mouse and solve the sliding puzzle to get the bridle. Put the bridle on Moonhoof and tap him to ride away free."]),
        ],
        "related": ["amulet-of-emberfall", "whispers-of-ravenholt"],
    },
    {
        "slug": "amulet-of-emberfall", "file": "amulet-of-emberfall", "title": "The Amulet of Emberfall",
        "seo_title": "The Amulet of Emberfall: Free Point-and-Click Puzzle Game",
        "desc": "Play The Amulet of Emberfall free in your browser: a 16-bit point-and-click puzzle adventure with a sleeping minotaur. Screenshots and spoiler-free hints.",
        "play": "/games/emberfall/", "shots": "emberfall",
        "shot_names": [("courtyard", "The red-hooded hero and the seer in the courtyard with the old fountain"),
                       ("grove", "The rune grove with the stone tablet and the old chest"),
                       ("temple", "The temple where the minotaur guards the amulet")],
        "intro": [
            "In the land of Emberfall it is always autumn. The amulet that could bring the seasons back has been stolen, and a minotaur guards it in an old temple. Fighting is no use: you need a clever plan.",
            "The Amulet of Emberfall is a short classic-style puzzle adventure in 16-bit pixel art. You answer a seer's riddles, help a shivering puppy, read a rune tablet, brew a sleeping potion from what you find and solve a sliding emblem puzzle and a shard puzzle at the end. It suits children from about seven and grown-up fans of old point-and-click games.",
        ],
        "facts": [("Genre", "Point-and-click puzzle adventure"), ("Play time", "About 15 minutes"),
                  ("Difficulty", "Easy"), ("Age", "7+ (younger with a parent reading along); also for adults"),
                  ("Languages", "English and Dutch"), ("Plays on", "Phone (landscape), tablet and desktop, in the browser"),
                  ("Price", "Free, no ads, no account needed")],
        "how": "Tap or click to walk and look. Collect items, combine two items by selecting one and tapping the other in your bag, and use items on things in the scene. The banner shows your goal and the eye button highlights what you can tap.",
        "age": 7, "minutes": 15, "genre": ["Point-and-click adventure", "Puzzle", "Pixel art"],
        "hints": [
            ("What to collect first", [
                "Look carefully around the courtyard and the grove: several things can be picked up.",
                "You need berries, a recipe note, a flint, wood and a flower.",
                "Pick up the berries, the recipe note and the flint in the courtyard, and the wood and the flower in the grove."]),
            ("The seer and the shivering puppy", [
                "The seer will help if you answer her riddles.",
                "Her reward keeps someone small warm.",
                "Answer the seer's three riddles (leaf, wind, hole) to get a vest, and put the vest on the puppy. It gives you a powder."]),
            ("The rune tablet and the chest", [
                "The powder reveals something on the stone tablet.",
                "The tablet shows an order of three runes, and the chest needs that order.",
                "Use the powder on the tablet, then open the chest with the runes Leaf, Sun, Moon. Inside is an empty vial."]),
            ("The sleeping potion and the torch", [
                "The recipe note tells you what goes into the potion.",
                "Water first, then the ingredients. Two other items make fire.",
                "Fill the vial at the old fountain, combine it with the berries, then add the flower to make the sleeping potion. Combine the flint and the wood to make a torch."]),
            ("Into the temple", [
                "The gate opens with a sliding picture puzzle. Inside it is dark.",
                "Light the temple before you go near the minotaur.",
                "Solve the emblem sliding puzzle to open the gate, light the wall torch inside the temple, then pour the sleeping potion into the bowl so the minotaur falls asleep."]),
            ("Winning the amulet", [
                "The carving on the wall shows dots. They are the order of the floor tiles.",
                "Press the tiles in the order of the dots, then rebuild the broken seal.",
                "Press the floor tiles 3-1-4-2, then drag the shards into the frame to complete the seal and take the amulet."]),
        ],
        "related": ["maanhoef", "whispers-of-ravenholt"],
    },
    {
        "slug": "whispers-of-ravenholt", "file": "whispers-of-ravenholt", "title": "Whispers of Ravenholt — Part 1",
        "seo_title": "Whispers of Ravenholt: Free Point-and-Click Mystery Game",
        "desc": "Play Whispers of Ravenholt free in your browser: a 16-bit point-and-click mystery about a village fountain that runs dry. Screenshots and spoiler-free hints.",
        "play": "/games/ravenholt/", "shots": "ravenholt",
        "shot_names": [("square", "Finn on the village square of Ravenholt with the dry fountain"),
                       ("mill", "Inside the silent water mill"),
                       ("valley", "The misty valley with standing stones and the cauldron"),
                       ("castle", "The castle gate guarded by soldiers")],
        "intro": [
            "The village fountain of Ravenholt is running dry and nobody knows why. Young Finn, with his plain wooden staff, sets out to find the cause: from the village square to the silent water mill, the misty valley and the gate of the castle of Eldoria, where his father is held captive.",
            "Whispers of Ravenholt is the first part of a two-part mystery in 16-bit pixel art. It has more to read and more steps than the other games on RetroAdventureWorld: you trade with a clever raven, write spells into a spellbook, fix the mill with a gear puzzle, play a short chess problem and win a riddle duel. It suits children from about nine and adults who enjoy classic adventure games. The story continues in Part 2.",
        ],
        "facts": [("Genre", "Point-and-click mystery adventure"), ("Play time", "About 15–20 minutes"),
                  ("Difficulty", "A little more challenging"), ("Age", "9+ (younger with a parent); also for adults"),
                  ("Languages", "English and Dutch"), ("Plays on", "Phone (landscape), tablet and desktop, in the browser"),
                  ("Saving", "Automatic, plus an optional free account to continue on another device"),
                  ("Price", "Free, no ads"), ("Series", "Part 1 of 2")],
        "how": "Tap or click to walk, look and talk. Combine items in your bag, and cast the spells you write into your spellbook on people and things. The hint button gives a tip for the step you are on.",
        "age": 9, "minutes": 20, "genre": ["Point-and-click adventure", "Mystery", "Pixel art"],
        "hints": [
            ("On the village square", [
                "The raven on the square likes shiny things.",
                "Look in the fountain.",
                "Take the coin from the fountain and give it to the raven. It gives you a feather."]),
            ("The silent mill and the spellbook", [
                "Inside the mill there is a book puzzle, and you need something to write with.",
                "Berries can become ink, and the feather can become a quill.",
                "Pick berries at the mill, put the books in the right colour order to get a blank spellbook, make ink from the berries in a vial, combine ink and feather, and write in the book at the mill table. You learn the dance spell."]),
            ("Fixing the mill", [
                "The cart at the castle carries something the mill needs.",
                "Make the flowers by the cart dance to distract the merchant.",
                "Cast the dance spell on the flowers, take the mill wheel from the cart, and solve the gear puzzle in the mill. The mill turns and gives grain."]),
            ("The mayor's reward", [
                "Several people in the village want something. Start with the girl.",
                "Grain becomes cheese, and the mouse knows where the juice barrel's tap is.",
                "Get a vial from the mayor, give the grain to the girl for cheese, give the cheese to the mouse so it loosens the tap of the juice barrel, and bring the grape juice to the mayor. You get a gold coin and a map."]),
            ("Gathering the ingredients", [
                "The raven trades again, and the recipe asks for three special ingredients.",
                "One is caught with a spell, one comes from a poem, one from a game of chess.",
                "Give the gold coin to the raven to find the recipe under the stone at the mill, catch fireflies with the dance spell in the valley, read the poem from the mailbox to the girl for a tear, and solve the chess problem (mate in three) for the dragon scale."]),
            ("Into the castle", [
                "Everything goes into the cauldron in the valley.",
                "Win the riddle duel, then use your newest spell on the guard.",
                "Put the three ingredients in the cauldron, win the riddle duel to get the ring, and cast the dragon spell on the guard. The gate opens and Part 1 ends."]),
        ],
        "related": ["whispers-of-ravenholt-part-2", "amulet-of-emberfall"],
    },
    {
        "slug": "whispers-of-ravenholt-part-2", "file": "whispers-of-ravenholt-part-2", "title": "Whispers of Ravenholt — Part 2",
        "seo_title": "Whispers of Ravenholt Part 2: Free Point-and-Click Game",
        "desc": "Play Whispers of Ravenholt Part 2 free in your browser: Finn sneaks into the castle of Eldoria to free his father. Screenshots and spoiler-free hints.",
        "play": "/games/ravenholt-deel2/", "shots": "ravenholt-2",
        "shot_names": [("courtyard", "Finn in the castle courtyard by the old well and the forge"),
                       ("garden", "The castle garden with the statue and the princess"),
                       ("library", "The library with the wizard, the telescope and the spellbook"),
                       ("dungeon", "The dungeon guard in front of the cells")],
        "intro": [
            "Finn has slipped into the castle of Eldoria, where his father is held captive. To reach the dungeon he needs a forged sword, a rope down the old well, the princess's trust, a hidden library and two new spells.",
            "Whispers of Ravenholt Part 2 continues the story of Part 1 in 16-bit pixel art, with a word puzzle at a statue, a timing puzzle at the well, a sliding fountain puzzle, an orrery that darkens the sun, a rune seal and a silent key ring. It is the most challenging game on RetroAdventureWorld and suits children from about nine and adults. Playing Part 1 first is recommended; the title screen also sums up the story so far.",
        ],
        "facts": [("Genre", "Point-and-click mystery adventure"), ("Play time", "About 15–20 minutes"),
                  ("Difficulty", "The most challenging of the four"), ("Age", "9+ (younger with a parent); also for adults"),
                  ("Languages", "English and Dutch"), ("Plays on", "Phone (landscape), tablet and desktop, in the browser"),
                  ("Saving", "Automatic, plus an optional free account to continue on another device"),
                  ("Price", "Free, no ads"), ("Series", "Part 2 of 2")],
        "how": "Tap or click to walk, look and talk. Use items from your bag on people and things, and cast spells from your spellbook. The hint button and the eye button help when you are stuck.",
        "age": 9, "minutes": 20, "genre": ["Point-and-click adventure", "Mystery", "Pixel art"],
        "hints": [
            ("The squire and his broken sword", [
                "The squire needs a new sword, and the forge in the courtyard is cold.",
                "The forge needs fuel and a hammer, and the hammer is with the statue in the garden.",
                "Pick up the peanut and the glow-caps. Give the peanut to the parrot in the garden, tap the smith's saying on the statue (ONLY FIRE FORGES TRUE STEEL) to get the hammer, take the charcoal and the bronze coin, then use the charcoal and the hammer on the forge. Give the sword to the squire for a rope."]),
            ("The well and the princess", [
                "The raven trades, and something glitters down the well.",
                "The bucket swings: lower it at the right moment.",
                "Give the bronze coin to the raven, then tap the well and time the bucket to bring up the necklace. Give the necklace to the princess; she gives you a key."]),
            ("Into the library", [
                "The lion fountain hides a secret gate.",
                "Solve the fountain's sliding puzzle, then look for a lock in the wall beside it.",
                "Solve the fountain slide puzzle and use the princess's key on the lock in the wall beside the lion fountain. The library opens."]),
            ("Darkening the sun", [
                "The wizard is wide awake. Something glowing could make him sleepy.",
                "The orrery's rings turn each other: count the turns.",
                "Put the glow-caps in the candle bowl so the wizard dozes off. Turn the orrery: outer ring 3× right, middle ring 2× left, inner ring 4× right, and cast the eclipse spell."]),
            ("The sealed door", [
                "During the eclipse the telescope and the book show new things.",
                "The three signs in the telescope are the order for the seal.",
                "Look through the telescope (signs Ψ ♃ ♄), read the book to learn the invisibility spell, set the door seal to Ψ, ♃, ♄ and pull the lever."]),
            ("Freeing your father", [
                "In the dungeon you must not be seen, and the guard is easily distracted.",
                "One key on the ring is the right one, and your father has a gift for you.",
                "Cast the invisibility spell, take the golden key from the ring by the number of dots (one, two, three), talk to your father for the wonder-nut, drop the nut in the puddle, cast the dance spell to distract the guard, and give your father the key."]),
        ],
        "related": ["whispers-of-ravenholt", "maanhoef"],
    },
]
BY = {g["slug"]: g for g in GAMES}

CSS = """
    @font-face { font-family: 'Jersey 15'; font-style: normal; font-weight: 400; font-display: swap; src: url(/assets/fonts/jersey-15-latin.woff2) format('woff2'); }
    @font-face { font-family: 'Nunito'; font-style: normal; font-weight: 400 800; font-display: swap; src: url(/assets/fonts/nunito-latin.woff2) format('woff2'); }
    :root { --night: #08101b; --navy: #0b1622; --gold: #f5b241; --gold-hi: #ffd766; --bronze: #8a4b14; --outline: #1a0d05; --ink: #f2f0ea; --leaf: #7fd16a;
      --display: 'Jersey 15', 'Trebuchet MS', sans-serif; --read: 'Nunito', 'Trebuchet MS', system-ui, sans-serif; --ease-out: cubic-bezier(.16, 1, .3, 1); }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { background: var(--night); color-scheme: dark; scrollbar-color: var(--bronze) var(--night); }
    body { background: var(--night); color: var(--ink); font: 400 18px / 1.6 var(--read); -webkit-tap-highlight-color: transparent; }
    ::selection { background: var(--gold); color: var(--outline); }
    :focus-visible { outline: 3px solid var(--gold-hi); outline-offset: 3px; }
    a { color: var(--gold-hi); text-underline-offset: .2em; text-decoration-thickness: 2px; }
    .bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 16px; }
    .logo-board { display: grid; place-items: center; width: min(300px, 58vw); aspect-ratio: 5 / 1; background: url(/assets/plates/logo-board.png) center / 100% 100% no-repeat; image-rendering: pixelated; text-decoration: none; }
    .logo-board span { font: 400 clamp(20px, 4vw, 33px) / 1 var(--display); color: #f6bf3a; text-shadow: 2px 0 0 #3b1a0b, -2px 0 0 #3b1a0b, 0 2px 0 #3b1a0b, 0 -2px 0 #3b1a0b, 0 4px 0 #1b0d09; }
    .sign { display: inline-grid; place-items: center; min-width: 110px; height: 46px; padding: 6px 14px 0; text-decoration: none;
      background: url(/assets/plates/board-games.png) center / 100% 100% no-repeat; image-rendering: pixelated; font: 400 19px / 1 var(--display); color: #fffdf6; text-shadow: 0 1px 2px #2a1206; }
    main { max-width: 980px; margin: 0 auto; padding: 8px clamp(16px, 4vw, 32px) 0; }
    .crumbs { font-size: 15px; color: #93a1ad; margin: 6px 0 12px; }
    .crumbs a { color: #c9d3db; }
    .hero { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: clamp(20px, 4vw, 44px); align-items: center; }
    .hero img { width: 100%; height: auto; display: block; box-shadow: 0 0 0 2px var(--outline), 0 0 0 4px #d9a23c, 0 0 0 6px var(--outline); }
    h1 { font: 400 clamp(40px, 6vw, 64px) / .95 var(--display); color: var(--gold-hi); text-shadow: 0 3px 0 #3b1a0b; text-wrap: balance; }
    .tag { display: flex; flex-wrap: wrap; gap: 6px 14px; margin: 14px 0 18px; font: 400 20px / 1.1 var(--display); color: #dfe4e8; }
    .play { display: inline-grid; place-items: center; min-width: 220px; height: 58px; padding: 2px 26px 0; text-decoration: none; --c: 6px;
      font: 400 30px / 1 var(--display); color: #2b1606; letter-spacing: .03em; background: linear-gradient(180deg, #ffcf55 0 45%, #f6ae33 46% 100%);
      clip-path: polygon(var(--c) 0, calc(100% - var(--c)) 0, 100% var(--c), 100% calc(100% - var(--c)), calc(100% - var(--c)) 100%, var(--c) 100%, 0 calc(100% - var(--c)), 0 var(--c));
      box-shadow: inset 0 0 0 2px #c9771a, inset 0 0 0 3px #7a4210, inset 0 0 0 5px #ffdf86, inset 0 -7px 0 #eba13a; transition: transform .12s var(--ease-out), filter .12s; }
    .play:hover { transform: translateY(-2px); filter: brightness(1.07); }
    .sub { font-size: 15px; color: #93a1ad; margin-top: 10px; }
    h2 { font: 400 clamp(30px, 3.8vw, 42px) / 1.02 var(--display); color: var(--gold-hi); text-shadow: 0 3px 0 #3b1a0b; margin: clamp(48px, 7vw, 72px) 0 14px; text-wrap: balance; }
    p { max-width: 68ch; color: #d3dae0; }
    p + p { margin-top: 12px; }
    .facts { display: grid; grid-template-columns: auto 1fr; gap: 8px 22px; background: var(--navy); padding: 20px 22px; margin-top: 18px;
      box-shadow: inset 0 0 0 2px var(--outline), inset 0 0 0 4px #d9a23c, inset 0 0 0 5px var(--outline); font-size: 17px; }
    .facts dt { font: 400 21px / 1.15 var(--display); color: var(--gold); }
    .facts dd { color: #e7ebee; }
    .shots { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-top: 18px; }
    .shots figure { margin: 0; }
    .shots img { width: 100%; height: auto; display: block; box-shadow: 0 0 0 2px var(--outline), 0 0 0 4px #d9a23c, 0 0 0 6px var(--outline); }
    .shots figcaption { font-size: 15px; color: #93a1ad; margin-top: 10px; }
    .hint { background: var(--navy); margin-top: 12px; box-shadow: inset 0 0 0 2px var(--outline), inset 0 0 0 4px #d9a23c, inset 0 0 0 5px var(--outline); }
    .hint > summary { cursor: pointer; list-style: none; padding: 15px 20px 13px; font: 400 25px / 1.05 var(--display); color: #fff; display: flex; justify-content: space-between; gap: 14px; align-items: center; }
    .hint > summary::-webkit-details-marker { display: none; }
    .hint > summary::after { content: ''; width: 18px; height: 18px; background: var(--gold); flex: none; transition: transform .25s var(--ease-out);
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath d='M3 0h2v3h3v2H5v3H3V5H0V3h3z'/%3E%3C/svg%3E") center / contain no-repeat;
              mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath d='M3 0h2v3h3v2H5v3H3V5H0V3h3z'/%3E%3C/svg%3E") center / contain no-repeat; }
    .hint[open] > summary::after { transform: rotate(45deg); }
    .tiers { padding: 0 20px 16px; display: grid; gap: 8px; }
    .tiers details { border-top: 1px solid #1d2b3a; padding-top: 8px; }
    .tiers summary { cursor: pointer; color: var(--gold-hi); font-weight: 700; font-size: 16px; }
    .tiers details p { margin-top: 6px; font-size: 16.5px; }
    .tiers .sol summary { color: #f0a090; }
    .related { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin-top: 18px; }
    .related a { display: block; text-decoration: none; color: inherit; background: var(--navy); padding: 12px;
      box-shadow: inset 0 0 0 2px var(--outline), inset 0 0 0 4px #d9a23c, inset 0 0 0 5px var(--outline); }
    .related img { width: 100%; height: auto; display: block; margin-bottom: 10px; }
    .related strong { font: 400 24px / 1.05 var(--display); color: #fff; display: block; }
    .related span { font-size: 15px; color: #b9c3cc; }
    .cta { margin-top: 40px; display: flex; flex-wrap: wrap; gap: 14px 24px; align-items: center; }
    footer { max-width: 980px; margin: 80px auto 0; padding: 26px clamp(16px, 4vw, 32px) calc(40px + env(safe-area-inset-bottom, 0px)); border-top: 2px solid #1d2b3a;
      display: flex; flex-wrap: wrap; gap: 10px 26px; font-size: 15px; color: #93a1ad; }
    footer a { color: #dfe4e8; }
    @media (max-width: 760px) { .hero { grid-template-columns: 1fr; } .hero img { order: -1; } }
    @media (prefers-reduced-motion: reduce) { .play, .hint > summary::after { transition: none; } }
"""


def page(g):
    url = f"{SITE}/{g['slug']}/"
    shots = [(f"/assets/games/{g['shots']}/{n}.webp", alt) for n, alt in g["shot_names"]]
    rel = [BY[s] for s in g["related"]]
    ld_game = {
        "@context": "https://schema.org", "@type": "VideoGame", "name": g["title"], "url": url,
        "description": g["desc"], "genre": g["genre"], "gamePlatform": ["Web browser"], "applicationCategory": "Game",
        "operatingSystem": "Any (web browser)", "playMode": "SinglePlayer", "inLanguage": ["en", "nl"],
        "image": [SITE + s for s, _ in shots], "timeRequired": f"PT{g['minutes']}M",
        "typicalAgeRange": f"{g['age']}-", "audience": {"@type": "PeopleAudience", "suggestedMinAge": g["age"]},
        "author": {"@type": "Person", "name": "Eric Waterschoot"},
        "publisher": {"@type": "Organization", "name": "RetroAdventureWorld", "url": SITE + "/"},
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR", "availability": "https://schema.org/InStock", "url": SITE + g["play"]},
        "potentialAction": {"@type": "PlayAction", "target": SITE + g["play"]},
    }
    ld_crumb = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "RetroAdventureWorld", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": "Point-and-click adventure games", "item": SITE + "/point-and-click-adventure-games/"},
        {"@type": "ListItem", "position": 3, "name": g["title"], "item": url}]}
    E = escape
    facts = "\n".join(f"        <dt>{E(k)}</dt><dd>{E(v)}</dd>" for k, v in g["facts"])
    figs = "\n".join(
        f'      <figure><img src="{s}" width="1136" height="640" loading="lazy" alt="{E(alt)}"><figcaption>{E(alt)}</figcaption></figure>'
        for s, alt in shots[1:])
    hints = []
    for i, (q, (h1, h2, sol)) in enumerate(g["hints"], 1):
        hints.append(f"""      <details class="hint">
        <summary>{i}. {E(q)}</summary>
        <div class="tiers">
          <details><summary>Hint 1</summary><p>{E(h1)}</p></details>
          <details><summary>Hint 2</summary><p>{E(h2)}</p></details>
          <details class="sol"><summary>Show the solution (spoiler)</summary><p>{E(sol)}</p></details>
        </div>
      </details>""")
    rels = "\n".join(
        f'      <a href="/{r["slug"]}/"><img src="/assets/games/{r["shots"]}/{r["shot_names"][0][0]}.webp" width="1136" height="640" loading="lazy" alt=""><strong>{E(r["title"])}</strong><span>{E(r["facts"][1][1])} · age {r["age"]}+</span></a>'
        for r in rel)
    intro = "\n".join(f"      <p>{E(p)}</p>" for p in g["intro"])
    series = ""
    if g["slug"] == "whispers-of-ravenholt-part-2":
        series = '<p class="sub">New here? Start with <a href="/whispers-of-ravenholt/">Whispers of Ravenholt — Part 1</a>.</p>'
    elif g["slug"] == "whispers-of-ravenholt":
        series = '<p class="sub">Finished? Continue with <a href="/whispers-of-ravenholt-part-2/">Part 2</a>.</p>'
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#08101b">
  <title>{E(g['seo_title'])}</title>
  <meta name="description" content="{E(g['desc'])}">
  <link rel="canonical" href="{url}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="RetroAdventureWorld">
  <meta property="og:title" content="{E(g['title'])} — play free online">
  <meta property="og:description" content="{E(g['desc'])}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE}/assets/games/{g['shots']}/og.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" sizes="192x192" href="/games/emberfall/assets/icons/icon-192.png">
  <link rel="preload" href="/assets/fonts/jersey-15-latin.woff2" as="font" type="font/woff2" crossorigin>
  <script type="application/ld+json">
{json.dumps(ld_game, ensure_ascii=False, indent=2)}
  </script>
  <script type="application/ld+json">
{json.dumps(ld_crumb, ensure_ascii=False, indent=2)}
  </script>
  <script src="/shared/consent.js" defer></script>
  <style>{CSS}  </style>
</head>
<body>
  <!-- GENERATED by tools/build-game-pages.py — edit the script, not this file -->
  <header class="bar">
    <a class="logo-board" href="/" aria-label="RetroAdventureWorld, back to the map"><span>RetroAdventureWorld</span></a>
    <a class="sign" href="/">To the map</a>
  </header>
  <main>
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">RetroAdventureWorld</a> › <a href="/point-and-click-adventure-games/">Point-and-click games</a> › {E(g['title'])}</nav>
    <section class="hero">
      <div>
        <h1>{E(g['title'])}</h1>
        <p class="tag"><span>{E(g['facts'][1][1])}</span><span>· {E(g['facts'][2][1])}</span><span>· age {g['age']}+</span><span>· free</span></p>
        <a class="play" href="{g['play']}">Play now</a>
        <p class="sub">Starts right away in your browser. No download, no sign-up.</p>
        {series}
      </div>
      <img src="{shots[0][0]}" width="1136" height="640" fetchpriority="high" alt="{E(shots[0][1])}">
    </section>

    <section aria-labelledby="story">
      <h2 id="story">The story</h2>
{intro}
    </section>

    <section aria-labelledby="facts">
      <h2 id="facts">At a glance</h2>
      <dl class="facts">
{facts}
      </dl>
    </section>

    <section aria-labelledby="how">
      <h2 id="how">How to play</h2>
      <p>{E(g['how'])}</p>
    </section>

    <section aria-labelledby="shots">
      <h2 id="shots">Screenshots</h2>
      <div class="shots">
{figs}
      </div>
    </section>

    <section aria-labelledby="hints">
      <h2 id="hints">Hints and walkthrough</h2>
      <p>Stuck? Open the part you are on. Each step has two gentle hints before the full solution, so you only see as much as you want.</p>
{chr(10).join(hints)}
    </section>

    <section aria-labelledby="more">
      <h2 id="more">More free adventures</h2>
      <div class="related">
{rels}
      </div>
    </section>

    <div class="cta">
      <a class="play" href="{g['play']}">Play {E(g['title'].split(' — ')[0])}</a>
      <a href="/point-and-click-adventure-games/">All free point-and-click adventure games</a>
    </div>
  </main>
  <footer>
    <a href="/">The world map</a>
    <a href="/point-and-click-games-for-kids/">Parents' guide</a>
    <a href="/privacy/">Privacy</a>
    <a href="#" onclick="window.rawConsent&&window.rawConsent.open();return false">Cookie settings</a>
    <span>Made by Eric Waterschoot · updated {UPDATED}</span>
  </footer>
</body>
</html>
"""


for g in GAMES:
    out = ROOT / f"{g['file']}.html"
    out.write_text(page(g), encoding="utf-8")
    words = sum(len(p.split()) for p in g["intro"])
    print(f"wrote {out.name}  (intro {words} words)")
