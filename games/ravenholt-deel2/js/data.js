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
  title:      { nl: 'Fluisteringen van Ravenholt — Deel 2', en: 'Whispers of Ravenholt — Part 2' },
  titleLines: { nl: ['Fluisteringen', 'van Ravenholt', '· Deel 2 ·'], en: ['Whispers of', 'Ravenholt', '· Part 2 ·'] },
  startScene: 'courtyard',
  assetVer: '68',

  /* Finn — vaste figuur: roodharige jongen, blauwe kapmantel, leren tas, houten staf.
     idle = hero, lopen = 4-frame loopsheet (heroWalkSheet), zwaaien = heroWave.
     heroWalk/heroWalk2 blijven als terugval voor de 2-frame cyclus. */
  sprites: {
    hero:          'assets/art/hero.png',
    heroIdle2:     'assets/art/hero-idle2.png',     // 2e stilstaan-frame (zacht gewicht verplaatsen)
    heroBlink:     'assets/art/hero-blink.png',     // knipper-frame 1 (ogen dicht), /lopen 19
    heroBlink2:    'assets/art/hero-blink2.png',    // knipper-frame 2 (ogen weer open), /lopen 20
    heroWalk:      'assets/art/hero-walk.png',
    heroWalk2:     'assets/art/hero-walk2.png',
    heroWave:      'assets/art/hero-wave.png',
    heroWave2:     'assets/art/hero-wave2.png',     // 2e zwaai-frame (hand op/neer)
    heroWalkSheet: 'assets/art/hero-walk-sheet.png',
    mayor:         'assets/art/mayor.png',
    mayorGesture:  'assets/art/mayor-gesture.png',  // bezorgd gebaar (af en toe)
    mayorHappy:    'assets/art/mayor-happy.png',    // opgelucht zodra het water terug is (molen gemaakt) — met de geheime kaart
    mayorMap:      'assets/art/mayor-map.png',       // nadat hij de kaart heeft weggegeven (lege hand)
    ravenPerch:    'assets/art/raven-perch.png',   // raaf op de ton (gevouwen vleugels)
    ravenFly:      'assets/art/raven-fly.png',      // raaf in vlucht (oud, fallback)
    ravenFlyUp:    'assets/art/raven-fly-up.png',   // wiekslag: vleugels hoog
    ravenFlyMid:   'assets/art/raven-fly-mid.png',  // wiekslag: vleugels gespreid
    ravenFlyDown:  'assets/art/raven-fly-down.png', // wiekslag: vleugels omlaag
    mouse:         'assets/art/mouse.png',          // bruine muis in de molen (praten)
    cogBrass:      'assets/art/cog-brass.png',      // radwerk-puzzel: messing tandwiel
    cogIron:       'assets/art/cog-iron.png',       // radwerk-puzzel: ijzeren tandwiel
    guard:         'assets/art/guard.png',          // poortwacht bij het kasteel
    guardGesture:  'assets/art/guard-gesture.png',  // wacht verzet zijn hellebaard (af en toe)
    merchant:      'assets/art/merchant-left.png',   // handelsman (kap op) — kijkt naar de kar (links)
    merchantLeft:  'assets/art/merchant-left.png',   // kijkt naar links (zijn kar)
    merchantFwd:   'assets/art/merchant-fwd.png',    // kijkt vooruit
    merchantRight: 'assets/art/merchant-right.png',  // kijkt naar rechts (de wacht)
    merchantSly:   'assets/art/merchant-sly.png',    // sluwe blik omhoog (4e spied-stand)
    merchantSurprised: 'assets/art/merchant-surprised.png', // verbaasd (1)
    merchantAwe:   'assets/art/merchant-awe.png',    // verbaasd/betoverd starend naar de dansende bloem (2)
    heroWalkDiag:  'assets/art/hero-walk-diag.png',  // schuin lopen (3/4 naar de speler toe)
    flower:        'assets/art/flower.png',          // bloem (oranje accent)
    flowerWhite:   'assets/art/flower-white.png',    // witte bloem (dansende bloem + cluster)
    flowerLavender:'assets/art/flower-lavender.png', // lichtgevende lavendelbloem (blauw licht) in de vallei
    witch:         'assets/art/npc-witch.png',       // de heks bij de ketel (rust-frame)
    witchBeckon:   'assets/art/npc-witch-beckon.png',// heks wenkt de jongen ('kom hier'-gebaar)
    dragonstone:   'assets/art/item-dragonstone.png',// (oud) blauwe steen
    ring:          'assets/art/item-ring.png',       // drakenring die de heks achterlaat na het gevecht
    dragonShadow:  'assets/art/dragon-shadow.png',   // voorbijvliegende drakenschaduw bij de drakenspreuk op de wachter
    frogFly:       'assets/art/frog-fly.png',        // de heks veranderd in een vliegende kikker MET vleugels (pixel-art sprite-sheet, 4 wiek-frames)
    runeWolf:      'assets/art/runeWolf.png',         // dier-rune-tekens die boven de stenen verschijnen tijdens het heksengevecht
    runeOwl:       'assets/art/runeOwl.png',
    runeSnake:     'assets/art/runeSnake.png',
    runeDragon:    'assets/art/runeDragon.png',
    squire:        'assets/art/squire.png',     // jonge schildknaap op de binnenplaats (Deel 2)
    princess:      'assets/art/princess.png',     // de prinses in de slottuin (Deel 2)
    parrot:        'assets/art/parrot.png'        // kleurrijke papagaai in de slottuin (Deel 2)
  },
  heroWalkFrames: 16,           // loopanimatie uit /lopen 01-16 (alleen de écht-lopende frames)
  spriteDetail: 2,              // sprites zijn op 2x resolutie opgeslagen; engine tekent ze op halve maat = fijnere details

  /* Finn begint met de staf van zijn vader in zijn tas. */
  startItems: ['staff'],

  winText: {
    nl: 'Gefeliciteerd — je hebt DEEL 2 van Whispers of Ravenholt uitgespeeld! Je hebt het wapen van Sir Aldric herenigd, het hart van de prinses gewonnen en de geheime deur achter de fontein geopend. Daarachter wacht de duistere gang naar Finns vader... maar dat verhaal bewaren we voor DEEL 3. Knap gedaan, held — tot snel!',
    en: 'Congratulations — you have completed PART 2 of Whispers of Ravenholt! You reunited Sir Aldric’s arms, won the princess’s heart, and opened the secret door behind the fountain. Beyond it waits the dark passage to Finn’s father... but that tale we save for PART 3. Well done, hero — see you soon!'
  },

  strings: {
    noEffect:     { nl: 'Dat werkt hier niet.', en: 'That doesn’t work here.' },
    noCombine:    { nl: 'Die twee laten zich niet combineren.', en: 'Those two don’t combine.' },
    nothingThere: { nl: 'Daar valt niets te ontdekken.', en: 'There’s nothing to find there.' }
  },

  ui: {
    subtitle:   { nl: 'Deel 2 — Het Kasteel van Eldoria', en: 'Part 2 — The Castle of Eldoria' },
    intro:      { nl: 'Finn is door de poort het kasteel van Eldoria binnengeglipt. Op de binnenplaats houdt een schildknaap de wacht, en achter een begroeide boog ligt een geheime slottuin — waar de prinses op wie hij stiekem verliefd is tussen de rozen wandelt. Maar Finn kwam niet voor de rozen: ergens diep in de burcht wordt zijn vader gevangen gehouden, en de enige weg naar binnen is de grote kasteeldeur, die op een eeuwenoud slot zit.',
                  en: 'Finn has slipped through the gate into the castle of Eldoria. A squire keeps watch in the courtyard, and beyond an ivy-clad arch lies a secret garden — where the princess he secretly loves walks among the roses. But Finn did not come for the roses: somewhere deep in the keep his father is held captive, and the only way in is the great castle door, sealed with an ancient lock.' },
    credit:     { nl: 'Een RetroAdventureWorld-avontuur', en: 'A RetroAdventureWorld adventure' },
    startBtn:   { nl: 'Begin het mysterie', en: 'Begin the mystery' },
    winTitle:   { nl: 'Deel 2 uitgespeeld!', en: 'Part 2 complete!' },
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

    q_explore:  { nl: 'Verken de binnenplaats van het kasteel — en zoek de weg naar de slottuin', en: 'Explore the castle courtyard — and find the way to the garden' },
    q_garden:   { nl: 'Loop de slottuin in en ontdek wie daar tussen de rozen wandelt', en: 'Enter the castle garden and discover who walks among the roses' },
    q_getsword: { nl: 'De schildknaap gaf je het gebroken zwaard van Sir Aldric. Smeed het weer heel bij de smidse: je hebt de hamer en houtskool nodig. De hamer zit in het smidsbeeld in de tuin — dat vraagt de geheime woorden van de smid. Geef de papagaai een noot (ligt op het plein) en hij verklapt ze.', en: 'The squire gave you Sir Aldric’s broken sword. Forge it whole at the smithy: you need the hammer and charcoal. The hammer is in the smith statue in the garden — it asks for the smith’s secret words. Give the parrot a nut (it lies in the courtyard) and he’ll reveal them.' },
    q_gethammer:{ nl: 'Voor de hamer: het smidsbeeld in de tuin vraagt de geheime woorden van de smid. Geef de papagaai een noot van het plein — hij verklapt de woorden — en typ ze daarna bij het beeld in', en: 'For the hammer: the smith statue in the garden asks for the smith’s secret words. Give the parrot a nut from the courtyard — he reveals the words — then type them at the statue' },
    q_giveparrot:{ nl: 'Je hebt een noot — geef hem aan de papagaai in de slottuin; hij kent de geheime woorden van de smid', en: 'You have a nut — give it to the parrot in the garden; he knows the smith’s secret words' },
    q_typephrase:{ nl: 'De papagaai verklapte de geheime woorden van de smid — “vuur en staal”. Typ ze in bij het smidsbeeld in de tuin om de hamer te krijgen', en: 'The parrot revealed the smith’s secret words — “fire and steel”. Type them at the smith statue in the garden to get the hammer' },
    q_getcoal:  { nl: 'Zoek de houtskool tussen de bloemen in de slottuin om het smidsvuur mee aan te wakkeren', en: 'Find the charcoal among the flowers in the garden to kindle the forge fire' },
    q_forge:    { nl: 'Smeed bij de smidse: gooi eerst de houtskool in de oven (het vuur laait fel op), leg dán het gebroken zwaard op het ijzer, en sla het ten slotte met de hamer weer heel', en: 'Forge at the smithy: first throw the charcoal into the oven (the fire flares up), then lay the broken sword on the iron, and finally strike it whole with the hammer' },
    q_userope:  { nl: 'Je hebt een touw — daal er bij de oude put mee af (leid het touw door de schacht omlaag) om de ketting van de prinses op te vissen', en: 'You have a rope — lower it into the old well (guide the rope down the shaft) to fish up the princess’s necklace' },
    q_givenecklace:{ nl: 'Je viste de ketting van de prinses op — breng hem naar de prinses in de slottuin', en: 'You fished up the princess’s necklace — bring it to the princess in the garden' },
    q_fountainpuzzle:{ nl: 'Je kreeg een sleutel van de prinses — los de schuifpuzzel bij de leeuwenfontein op om het slot te onthullen', en: 'The princess gave you a key — solve the sliding puzzle at the lion fountain to reveal the lock' },
    q_usekey:   { nl: 'Gebruik de sleutel op het slot onder de leeuwenkop van de fontein om de geheime poort te openen', en: 'Use the key on the lock beneath the fountain’s lion head to open the secret gate' },
    q_through:  { nl: 'De geheime poort staat open naast de leeuwenfontein — stap erdoorheen, de donkere gang in', en: 'The secret gate stands open beside the lion fountain — step through it, into the dark passage' },
    q_done:     { nl: 'De prinses herkende het wapen van het medaillon... (wordt vervolgd in Deel 2)', en: 'The princess recognised the medallion’s crest... (to be continued in Part 2)' },
    q_fountain: { nl: 'Onderzoek waarom de fontein leegloopt', en: 'Investigate why the fountain is running dry' },
    q_mill:     { nl: 'Bekijk de oude molen aan de rand van het plein', en: 'Inspect the old mill at the edge of the square' },
    q_inside:   { nl: 'Zoek binnen in de molen wat het water tegenhoudt', en: 'Search inside the mill for what blocks the water' },
    q_book:     { nl: 'Bevrijd het toverboek in de molen (trek de boeken in de juiste volgorde)', en: 'Free the spellbook in the mill (pull the books in the right order)' },
    q_writespell:{ nl: 'Het toverboek is leeg — pak de ravenveer, maak inkt (zwarte bessen + flesje) en schrijf de spreuk in het boek', en: 'The spellbook is blank — take the raven feather, make ink (black berries + vial) and write the spell into the book' },
    q_flower:   { nl: 'Bij het kasteel: laat met de spreuk de grote bloem dansen', en: 'At the castle: use the spell to make the big flower dance' },
    q_tomayor:  { nl: 'De molen draait weer en de fontein stroomt! Ga terug naar het plein, naar burgemeester Bram', en: 'The mill turns again and the fountain flows! Head back to the square, to Mayor Bram' },
    q_valley:   { nl: 'Verzamel de 3 ingrediënten voor de ketel (zie het recept): het licht van een vuurvliegje (vang er een in de vallei), een traan van een onschuldige (lees het gedicht voor aan het meisje) en een drakenschub (versla de oude schaker) — gooi ze dan in de ketel', en: 'Gather the 3 ingredients for the cauldron (see the recipe): the light of a firefly (catch one in the valley), a tear of an innocent (read the poem to the girl) and a dragon scale (beat the old chess player) — then throw them in the cauldron' },
    q_takewheel:{ nl: 'De handelsman kijkt naar de bloem — pak nu het molenrad uit zijn kar', en: 'The merchant is watching the flower — grab the mill wheel from his cart now' },
    q_fixmill:  { nl: 'Breng het molenrad naar het tandrad in de molen en maak het radwerk', en: 'Take the mill wheel to the gear inside the mill and fix the gearworks' }
  },

  items: {
    staff: { name: { nl: 'Vaders Staf', en: 'Father’s Staff' }, icon: '🪄', img: 'assets/art/item-staff.png',
             look: { nl: 'De houten staf van mijn vader. Hij voelt vertrouwd in je hand — met de juiste spreuk in je boek kun je hem laten werken.', en: 'My father’s wooden staff. It feels familiar in your hand — with the right spell in your book you can make it work.' } },
    hammer: { name: { nl: 'Smidshamer', en: 'Blacksmith’s Hammer' }, icon: '🔨', img: 'assets/art/item-hammer.png',
             look: { nl: 'Een zware smidshamer uit de sokkel van het ridderbeeld. Hiermee kun je bij de smidse het zwaard van de held smeden.', en: 'A heavy blacksmith’s hammer from the plinth of the knight statue. With it you can forge the hero’s sword at the smithy.' } },
    swordBroken: { name: { nl: 'Gebroken Zwaard', en: 'Broken Sword' }, icon: '🗡️', img: 'assets/art/item-sword-broken.png',
             look: { nl: 'Het zwaard van Sir Aldric, doormidden gebroken — het losse stuk zit er nog bij. Bij een heet smidsvuur en met een hamer zou je het weer heel kunnen smeden.', en: 'Sir Aldric’s sword, snapped in two — the broken-off piece is still with it. At a hot forge fire and with a hammer you could make it whole again.' } },
    flower: { name: { nl: 'Bloem', en: 'Flower' }, icon: '🌸', img: 'assets/art/item-flower.png',
             look: { nl: 'Een mooie bloem uit de slottuin — een lief klein cadeautje voor iemand bijzonders.', en: 'A pretty flower from the castle garden — a sweet little gift for someone special.' } },
    rope: { name: { nl: 'Touw', en: 'Rope' }, icon: '🪢', img: 'assets/art/item-rope.png',
             look: { nl: 'Een stevig opgerold touw van de schildknaap. Lang genoeg om iets uit een diepe put omhoog te vissen.', en: 'A sturdy coil of rope from the squire. Long enough to fish something up from a deep well.' } },
    necklace: { name: { nl: 'Ketting van de Prinses', en: 'The Princess’s Necklace' }, icon: '📿', img: 'assets/art/item-necklace.png', sparkle: true, border: 'gold',
             look: { nl: 'Een fijne gouden ketting met een blauwe edelsteen, opgevist uit de oude put. Hij hoort bij de prinses — het was van haar moeder.', en: 'A fine gold necklace with a blue gem, fished from the old well. It belongs to the princess — it was her mother’s.' } },
    key: { name: { nl: 'Sleutel van de Geheime Poort', en: 'Secret Gate Key' }, icon: '🗝️', img: 'assets/art/item-key.png', sparkle: true,
             look: { nl: 'Een zware, oude sleutel die je van de prinses kreeg. Hij past op het slot onder de leeuwenkop van de fontein — de geheime poort.', en: 'A heavy old key the princess gave you. It fits the lock beneath the fountain’s lion head — the secret gate.' } },
    charcoal: { name: { nl: 'Houtskool', en: 'Charcoal' }, icon: '⬛', img: 'assets/art/item-coal.png',
             look: { nl: 'Een handvol zwarte houtskool die je tussen de bloemen in de slottuin vond. Precies wat een smid nodig heeft om zijn vuur weer aan te wakkeren.', en: 'A handful of black charcoal you found among the flowers in the castle garden. Just what a smith needs to fire up his forge again.' } },
    nut: { name: { nl: 'Noot', en: 'Nut' }, icon: '🌰', img: 'assets/art/item-nut.png',
             look: { nl: 'Een klein, donkerbruin nootje dat bij het aambeeld van de smidse lag. Vogels — papagaaien zeker — zijn er dol op.', en: 'A small, dark-brown nut that lay by the smithy anvil. Birds — parrots especially — love them.' } },
    mushroom: { name: { nl: 'Magische Paddenstoel', en: 'Magic Mushroom' }, icon: '🍄', img: 'assets/art/item-mushroom.png', sparkle: true,
             look: { nl: 'Een trosje warm gloeiende paddenstoelen met bruin-oranje hoedjes, geplukt bij de put. Ze tintelen van de magie — vast ergens goed voor.', en: 'A cluster of warmly glowing mushrooms with brown-orange caps, picked by the well. They tingle with magic — surely useful for something.' } },
    sword: { name: { nl: 'Zwaard van Sir Aldric', en: 'Sir Aldric’s Sword' }, icon: '⚔️', img: 'assets/art/item-sword.png', sparkle: true, border: 'gold',
             look: { nl: 'Het zwaard van Sir Aldric, dat je zelf bij de smidse weer heel hebt gesmeed. Het lemmet glanst als nieuw — een waardig wapen voor een held.', en: 'Sir Aldric’s sword, which you forged whole again yourself at the smithy. The blade gleams like new — a weapon worthy of a hero.' } },
    coin: { name: { nl: 'Zilveren Munt', en: 'Silver Coin' }, icon: '🪙', img: 'assets/art/item-coin.png',
            look: { nl: 'Een oude zilveren munt die je uit de drooggevallen fontein opraapte. Hij blinkt nog mooi — precies het soort glimmend ding waar een ekster of een raaf niet van af kan blijven.', en: 'An old silver coin you picked from the dried-up fountain. It still gleams nicely — just the kind of bright thing a magpie or raven can’t resist.' } },
    coinGold: { name: { nl: 'Gouden Munt', en: 'Gold Coin' }, icon: '🪙', img: 'assets/art/item-coin-gold.png',
            look: { nl: 'Een glanzende gouden munt van burgemeester Bram. Hij blinkt schitterend in het licht — die slimme raaf in de vallei kan er vast geen weerstand aan bieden.', en: 'A shiny gold coin from Mayor Bram. It gleams brilliantly — that clever raven in the valley surely can’t resist it.' } },
    note: { name: { nl: 'Verfrommeld Briefje', en: 'Crumpled Note' }, icon: '📜', img: 'assets/art/item-note.png',
            look: { nl: '“...het rad is niet zomaar verdwenen. Volg de lichten in de vallei.”', en: '“...the wheel did not simply vanish. Follow the lights in the valley.”' } },
    vialInk:  { name: { nl: 'Leeg Flesje (voor inkt)', en: 'Empty Vial (for ink)' }, icon: '🧪', img: 'assets/art/item-vial-ink.png',
             look: { nl: 'Een leeg glazen flesje met kurk, uit de kast in de molen. Hier maak je inkt in van de zwarte bessen.', en: 'An empty corked glass vial from the cupboard in the mill. Use it to make ink from the black berries.' } },
    vialTear: { name: { nl: 'Leeg Flesje (voor de traan)', en: 'Empty Vial (for the tear)' }, icon: '🧪', img: 'assets/art/item-vial-tear.png',
             look: { nl: 'Een leeg glazen flesje met kurk, uit de kast in de molen. Hierin kun je straks de traan van het meisje bij de kraam opvangen.', en: 'An empty corked glass vial from the cupboard in the mill. Use it to catch the tear of the girl at the stall later.' } },
    vialWine: { name: { nl: 'Leeg Flesje (voor wijn)', en: 'Empty Vial (for wine)' }, icon: '🧪', img: 'assets/art/item-vial-wine-empty.png',
             look: { nl: 'Een leeg glazen flesje met kurk, uit de kast in de molen. Hier kun je wijn uit de oude wijnton in tappen.', en: 'An empty corked glass vial from the cupboard in the mill. Use it to draw wine from the old wine barrel.' } },
    vialFly:  { name: { nl: 'Leeg Flesje (voor vuurvliegjes)', en: 'Empty Vial (for fireflies)' }, icon: '🧪', img: 'assets/art/item-vial-fly.png',
             look: { nl: 'Een leeg glazen flesje met kurk, uit de kast in de molen. Hierin kun je vuurvliegjes vangen — gebruik het op de dansende bloemen in de vallei.', en: 'An empty corked glass vial from the cupboard in the mill. Use it to catch fireflies — use it on the dancing flowers in the valley.' } },
    wine:  { name: { nl: 'Flesje Wijn', en: 'Vial of Wine' }, icon: '🍷', img: 'assets/art/item-vial-wine.png',
             look: { nl: 'Een flesje diep bordeauxrode wijn, getapt uit de oude wijnton in de molen. Misschien lust burgemeester Bram er wel een slokje van...', en: 'A vial of deep Bordeaux-red wine, drawn from the old wine barrel in the mill. Mayor Bram might fancy a sip of this...' } },
    book:  { name: { nl: 'Molenaarsboek', en: 'Miller’s Book' }, icon: '📖', img: 'assets/art/item-book.png',
             look: { nl: 'Het molenaarsboek. Tekeningen van het rad — en een kruisje bij een grot in de vallei, met gekrabbeld: “de blauwe steen drijft het rad weer aan.”', en: 'The miller’s book. Drawings of the wheel — and a cross at a cave in the valley, scrawled: “the blue stone drives the wheel again.”' } },
    grain: { name: { nl: 'Handvol Graan', en: 'Handful of Grain' }, icon: '🌾', img: 'assets/art/item-grain.png',
             look: { nl: 'Een handvol goudgeel graan uit de zak. Misschien lust een hongerig dier het wel.', en: 'A handful of golden grain from the sack. A hungry animal might like it.' } },
    spellbook: { name: { nl: 'Toverboek', en: 'Spellbook' }, icon: '📕', sparkle: (state) => { const pages = (state.flags.mapFiled ? 1 : 0) + (state.flags.spellWritten ? 1 : 0) + (state.flags.gotRecipe ? 1 : 0) + (state.flags.dragonSpellLearned ? 1 : 0); return pages > (state.flags.bookSeenCount || 0); }, img: (state) => state.flags.spellWritten ? 'assets/art/item-spellbook.png' : 'assets/art/item-spellbook-plain.png',
             zoomImg: (state) => state.flags.dragonSpellLearned ? 'assets/art/spell-dragon.jpg' : 'assets/art/spell-dance.jpg', zoomImgFlag: 'spellWritten',
             look: (state) => state.flags.spellWritten
               ? { nl: 'Het toverboek. Op de eerste bladzijde staat de dans-spreuk die je schreef. (tik aan om te bekijken)', en: 'The spellbook. On the first page stands the dance-spell you wrote. (tap to view)' }
               : { nl: 'Het oude toverboek — de bladzijden zijn nog helemaal leeg. Je moet de spreuken er nog zelf in schrijven, met een magische veer gedoopt in bessensap. (maak inkt van zwarte bessen, doop de ravenveer erin en combineer die met dit boek)', en: 'The old spellbook — its pages are still completely blank. You must still write the spells in yourself, with a magic feather dipped in berry juice. (make ink from black berries, dip the raven feather in it and combine it with this book)' } },
    feather: { name: { nl: 'Magische Ravenveer', en: 'Magic Raven Feather' }, icon: '🪶', img: 'assets/art/item-feather.png',
             look: { nl: 'Een glanzende, blauwzwarte veer die de raaf achterliet. Hij gloeit zachtjes van magie. Met inkt zou je er prachtig mee kunnen schrijven.', en: 'A glossy blue-black feather the raven left behind. It glows faintly with magic. With ink you could write beautifully with it.' } },
    berries: { name: { nl: 'Zwarte Bessen', en: 'Black Berries' }, icon: '🫐',
             look: { nl: 'Een handvol diepzwarte bessen, geplukt bij de molen. Geplet geven ze vast een donker, inktachtig sap.', en: 'A handful of deep-black berries, picked by the mill. Crushed, they’d surely give a dark, ink-like juice.' } },
    ink: { name: { nl: 'Flesje Inkt', en: 'Vial of Ink' }, icon: '🖋️', img: 'assets/art/item-ink.png',
             look: { nl: 'Het glazen flesje, nu gevuld met diepzwarte bessen-inkt. Perfect om een veer in te dopen.', en: 'The glass vial, now filled with deep-black berry ink. Perfect for dipping a feather.' } },
    inkFeather: { name: { nl: 'Inktveer', en: 'Ink-dipped Feather' }, icon: '🪄', img: 'assets/art/item-inkfeather.png',
             look: { nl: 'De magische ravenveer, gedoopt in de bessen-inkt — nog steeds een veer, maar met een glanzende zwarte inktpunt. Klaar om een spreuk in het lege toverboek te schrijven.', en: 'The magic raven feather, dipped in berry ink — still a feather, but with a glossy black ink tip. Ready to write a spell in the empty spellbook.' } },
    spell: { name: { nl: 'Dans-spreuk', en: 'Dance Spell' }, icon: '✦', img: 'assets/art/item-spell.png', border: 'blue',
             look: { nl: 'De spreuk die je zelf in het toverboek schreef, gloeit zacht blauw na. Hiermee kun je dingen laten dansen — gebruik de spreukknop naast je tas.', en: 'The spell you wrote yourself in the spellbook glows softly blue. With it you can make things dance — use the spell button next to your bag.' } },
    dragonspell: { name: { nl: 'Drakenspreuk', en: 'Dragon Spell' }, icon: '🐉', img: 'assets/art/item-dragonspell.png', border: 'blue',
             look: { nl: 'De drakenspreuk “Draconis Umbra” die zich in je toverboek schreef. Spreek hem uit en er rijst een enorme drakenschaduw op — genoeg om de dapperste wachter te laten vluchten. (wordt vervolgd)', en: 'The dragon spell “Draconis Umbra” that wrote itself into your spellbook. Speak it and a huge dragon shadow rises — enough to make the bravest guard flee. (to be continued)' } },
    ring: { name: { nl: 'Drakenring', en: 'Dragon Ring' }, icon: '💍', img: 'assets/art/item-ring.png', border: 'blue', sparkle: true,
             look: { nl: 'Een prachtige gouden ring met een gloeiende blauwe steen, die de heks achterliet. Sinds je hem omschoof tintelt de drakenmagie door je heen — de drakenspreuk staat nu in je toverboek.', en: 'A beautiful golden ring set with a glowing blue gem, left behind by the witch. Since you slipped it on, dragon magic tingles through you — the dragon spell is now in your spellbook.' } },
    poem: { name: { nl: 'Het Gedicht', en: 'The Poem' }, icon: '📜', img: 'assets/art/item-poem.png', zoomImg: 'assets/art/gedicht-kraammeisje.jpg', viewOnceFlag: 'poemSeen',
             look: { nl: 'Het gloeiende briefje uit de brievenbus bij de molen, zonder afzender:\n\n“Klein licht in de mist, zo ver van huis,\nde maan huilt zilver op het ruisende water.\nWie een traan om een ander durft te laten,\nopent de poort die niemand anders vond.”\n\nDit zou je eens moeten voorlezen aan iemand met verdriet...', en: 'The glowing note from the mailbox by the mill, with no sender:\n\n“Small light in the mist, so far from home,\nthe moon weeps silver on the whispering water.\nWhoever dares to shed a tear for another,\nopens the gate that no one else could find.”\n\nYou should read this aloud to someone who carries sorrow...' } },
    map: { name: { nl: 'Geheime Kaart', en: 'Secret Map' }, icon: '🗺️', img: 'assets/art/item-map.png', zoomImg: 'assets/art/map-valley.png', fileFlag: 'mapFiled',
             look: { nl: 'De geheime kaart van burgemeester Bram. Een pad slingert het dorp uit, langs het bos, naar de mistige vallei met de runenstenen — met een rood kruis dat de plek markeert. (tik aan om te bekijken; daarna gaat hij als eerste bladzijde in je toverboek)', en: 'Mayor Bram’s secret map. A path winds out of the village, past the wood, to the misty valley with the rune-stones — with a red cross marking the spot. (tap to view; then it goes as the first page into your spellbook)' } },
    millwheel: { name: { nl: 'Het Molenrad', en: 'The Mill Wheel' }, icon: '☸️', img: 'assets/art/cog-iron.png',
             look: { nl: 'Het zware ijzeren molenrad, gevonden in de kar van de handelsman. Hiermee kan de molen weer draaien — terug ermee naar de molen!', en: 'The heavy iron mill wheel, taken from the merchant’s cart. With this the mill can turn again — back to the mill with it!' } },
    cheese: { name: { nl: 'Stuk Kaas', en: 'Piece of Cheese' }, icon: '🧀', img: 'assets/art/item-cheese.png',
             look: { nl: 'Een heerlijk geel stuk boerenkaas, geruild voor een handvol graan op het plein.', en: 'A lovely yellow wedge of farmhouse cheese, traded for a handful of grain on the square.' } },
    tear: { name: { nl: 'Traan in een Flesje', en: 'Tear in a Vial' }, icon: '💧', img: 'assets/art/item-tear.png',
             look: { nl: 'Een glazen flesje met één heldere, glinsterende traan erin. Eén van de drie ingrediënten voor de ketel in de runencirkel.', en: 'A glass vial holding a single clear, glistening tear. One of the three ingredients for the cauldron in the rune circle.' } },
    fireflight: { name: { nl: 'Flesje Vuurvliegjes', en: 'Vial of Fireflies' }, icon: '✨', img: 'assets/art/item-fireflight.png',
             look: { nl: 'Een flesje met levende vuurvliegjes erin — groene en blauwe vonkjes die rondzweven en zacht oplichten. Eén van de drie ingrediënten voor de ketel.', en: 'A vial of living fireflies — green and blue sparks drifting and softly glowing inside. One of the three ingredients for the cauldron.' } },
    recipe: { name: { nl: 'Het Recept', en: 'The Recipe' }, icon: '📜', img: 'assets/art/item-recipe.png', zoomImg: 'assets/art/recipe.jpg', fileFlag: 'gotRecipe',
             look: { nl: 'Het vergeelde recept dat onder de losse steen bij de molen lag. Drie ingrediënten voor de ketel: een drakenschub, een traan van een onschuldige, en het licht van een vuurvliegje. (tik aan om te bekijken; daarna gaat het als bladzijde in je toverboek)', en: 'The yellowed recipe that lay under the loose stone by the mill. Three ingredients for the cauldron: a dragon scale, a tear of an innocent, and the light of a firefly. (tap to view; then it goes as a page into your spellbook)' } },
    dragonscale: { name: { nl: 'Drakenschub', en: 'Dragon Scale' }, icon: '🐲', img: 'assets/art/item-dragonscale.png',
             look: { nl: 'Een harde, glanzende schub, warm als sintels. Wie weet welk wezen hem verloor... Het laatste ingrediënt voor de ketel.', en: 'A hard, gleaming scale, warm as embers. Who knows what creature lost it... The last ingredient for the cauldron.' } }
  },

  /* Combinaties. result = nieuw voorwerp; of setFlag (+ keep) voor een handeling
     die de voorwerpen niet verbruikt (bv. met de inktveer in het boek schrijven). */
  recipes: [
    { a: 'berries', b: 'vialInk', result: 'ink',
      text: { nl: 'Je plet de zwarte bessen in het lege flesje. Het sap kleurt diep gitzwart — echte inkt!', en: 'You crush the black berries into the empty vial. The juice turns deep jet-black — real ink!' } },
    { a: 'feather', b: 'ink', result: 'inkFeather',
      text: { nl: 'Je doopt de magische ravenveer in de inkt. De punt glanst zwart en lijkt bijna te trillen van leven — klaar om te schrijven.', en: 'You dip the magic raven feather into the ink. Its tip glistens black and seems almost to quiver with life — ready to write.' } },
    { a: 'ring', b: 'spellbook', setFlag: ['dragonSpellLearned', 'ringWorn'], keep: true, result: 'dragonspell', doneFlag: 'dragonSpellLearned',
      text: { nl: 'Je schuift de drakenring om je vinger. Hij gloeit fel op en de diepblauwe magie stroomt door je hand in je toverboek — razendsnel schrijft de DRAKENSPREUK, “Draconis Umbra”, zich met oplichtende letters op een nieuwe bladzijde. Nu kun je hem uitspreken bij de poortwacht! (de spreuk staat rechts in je tas)', en: 'You slip the dragon ring onto your finger. It flares brightly and the deep-blue magic flows through your hand into your spellbook — in a flash the DRAGON SPELL, “Draconis Umbra”, writes itself in glowing letters on a fresh page. Now you can speak it at the gate guard! (the spell is on the right in your bag)' },
      doneText: { nl: 'De drakenring zit al om je vinger en de drakenspreuk staat in je boek.', en: 'The dragon ring is already on your finger and the dragon spell is in your book.' } },
    { a: 'inkFeather', b: 'spellbook', setFlag: 'spellWritten', keep: true, consume: 'inkFeather', doneFlag: 'spellWritten',
      result: 'spell',                                 // de geschreven spreuk komt in je tas (blauwe rand)
      requiresScene: 'millInside',
      cutscene: 'assets/video/spell-cinematic.mp4',   // speelt de eerste-spreuk-video af
      needSceneText: { nl: 'Om met de veer netjes in het boek te schrijven heb je een stevige tafel nodig — die staat bínnen in de molen.', en: 'To write neatly in the book with the feather you need a sturdy table — there’s one inside the mill.' },
      text: { nl: 'Je legt het toverboek open op de molenaarstafel en schrijft met de inktveer. Als bij toverslag glijdt de pen vanzelf over het papier en schrijft een spreuk: “Laat wat stil staat vrolijk dansen.” Het toverboek gloeit warm op — de veer heeft zijn werk gedaan.', en: 'You lay the spellbook open on the miller’s table and write with the ink-feather. As if by magic the pen glides on its own and writes a spell: “Make what stands still dance.” The spellbook glows warm — the feather has done its work.' },
      doneText: { nl: 'De spreuk staat al in het toverboek.', en: 'The spell is already written in the spellbook.' } }
  ],

  questRules: [
    { when: { flag: 'secretGateOpen' },                                  quest: 'q_through' },       // poort open -> stap erdoorheen (einde Deel 2)
    { when: { has: 'key', flag: 'fountainSolved' },                      quest: 'q_usekey' },        // sleutel + slot zichtbaar -> open de poort
    { when: { has: 'key' },                                              quest: 'q_fountainpuzzle' },// sleutel maar slot nog verborgen -> los de fontein op
    { when: { has: 'necklace' },                                         quest: 'q_givenecklace' },  // ketting -> naar de prinses
    { when: { flag: 'gotSword', has: 'rope' },                           quest: 'q_userope' },       // zwaard gesmeed -> nu de put-doolhof met het touw
    { when: { flag: 'swordInForge', notFlag: 'gotSword' },               quest: 'q_forge' },         // zwaard ligt in de oven -> sla het met de hamer
    { when: { has: ['swordBroken', 'hammer', 'charcoal'], notFlag: 'gotSword' }, quest: 'q_forge' }, // alles aanwezig -> smeed (kool, zwaard, hamer)
    { when: { has: ['swordBroken', 'hammer'], notFlag: 'gotSword' },     quest: 'q_getcoal' },       // mist houtskool
    { when: { flag: 'gotSmithPhrase', notFlag: 'statuePuzzleSolved' },   quest: 'q_typephrase' },    // woorden bekend -> typ ze bij het smidsbeeld
    { when: { has: 'nut', notFlag: 'gotSmithPhrase' },                   quest: 'q_giveparrot' },    // noot -> geef aan de papagaai
    { when: { has: ['swordBroken', 'charcoal'], notFlag: 'gotSword' },   quest: 'q_gethammer' },     // mist hamer (noot->papagaai->woorden->beeld)
    { when: { has: 'swordBroken', notFlag: 'gotSword' },                 quest: 'q_getsword' },      // heeft gebroken zwaard -> haal hamer + kool
    { when: { flag: 'metSquire', notFlag: 'gotSword' },                  quest: 'q_getsword' },      // schildknaap gesproken
    { when: { has: 'rope' },                                             quest: 'q_userope' },       // terugval: touw -> put
    { when: {},                                                          quest: 'q_explore' }
  ],

  scenes: {

    /* ---------------------------------------------------------------
       Deel 2 — Scene 1: de binnenplaats van het kasteel van Eldoria.
       Finn (speler) arriveert op de keien. Een schildknaap houdt de
       wacht; een begroeide boog links leidt naar de slottuin.
       --------------------------------------------------------------- */
    courtyard: {
      name: { nl: 'De Binnenplaats', en: 'The Courtyard' },
      bg: 'assets/art/scene-courtyard.jpg',
      charFilter: 'saturate(1.07) brightness(1.01) sepia(0.17) contrast(1.03)',   // warm gouden ochtendlicht zodat de figuren in de binnenplaats opgaan
      heroShade: 0.95,
      entryText: {
        nl: 'De binnenplaats van het kasteel van Eldoria baadt in het late ochtendlicht. Midden op de keien staat een oude put met een houten dakje. Links gloeit de smidse na en leidt een begroeide boog naar de slottuin; rechts staat een markttent bij de grote kasteeldeur. Op de put zit een glanzende zwarte raaf.',
        en: 'The courtyard of Eldoria castle bathes in late morning light. In the middle of the cobbles stands an old well with a wooden roof. To the left the forge glows and an ivy-clad arch leads to the castle garden; to the right a market tent stands by the great castle door. A glossy black raven perches on the well.'
      },
      playerStart: { x: 300, y: 296 },
      spawnFrom: { garden: { x: 178, y: 252 } },          // terug uit de tuin: bij de boog links
      depth: { far: 205, near: 316, sFar: 0.72, sNear: 1.05 },
      walkable: [
        { x: 24,  y: 252, w: 520, h: 62 },                 // voorgrond-keien over de hele breedte
        { x: 24,  y: 212, w: 184, h: 46 },                 // keien links van het beeld (richting smidse/boog)
        { x: 356, y: 208, w: 188, h: 50 }                  // keien rechts van het beeld (richting deur/tent)
      ],
      obstacles: [
        { x: 224, y: 166, w: 122, h: 84 }                  // het ronde grasperk met het ridderbeeld
      ],
      overlays: [],
      worldItems: [
        { item: 'nut', hotspot: 'nut', x: 96, y: 240, scale: 0.66 },                       // een kleine, donkere noot bij het aambeeld/ijzer van de smidse
        { item: 'mushroom', hotspot: 'mushroom', x: 206, y: 300, glowCol: '255,170,80' }   // bruin/oranje paddenstoelen bij de put (warme gloed)
      ],
      npcs: [
        { id: 'squire', sprite: 'squire', sway: true, filter: 'brightness(0.78) saturate(0.92)', x: 486, y: 284, scale: 1.18, flip: true },   // schildknaap iets groter; beweegt net als de poortwacht uit Deel 1 (rustige doorlopende wieg + lichte ademhaling)
        { id: 'courtyardRaven', sprite: 'ravenPerch', x: 292, y: 92, scale: 0.95, flip: true, peck: true, peckAmt: 0.4 }   // de raaf zit groter en hoger op het dakje van de put (naar links, boven de put) en pikt af en toe
      ],
      fx: {},
      hotspots: [
        {
          id: 'squire',
          name: { nl: 'De Schildknaap', en: 'The Squire' },
          rect: { x: 456, y: 184, w: 70, h: 104 },
          walkTo: { x: 452, y: 300 },
          look: (state) => state.flags.gotSword
            ? { nl: 'De schildknaap knikt naar het zwaard aan je zij. “Je hebt het zwaard van Sir Aldric weer heel gesmeed — knap werk. Met dat touw bereik je wat in de oude put verloren ging.”', en: 'The squire nods at the sword at your side. “You forged Sir Aldric’s sword whole again — fine work. With that rope you can reach what was lost in the old well.”' }
            : state.flags.squireGaveSword
            ? { nl: 'De schildknaap wijst naar de smidse. “Smeed het zwaard van de held: gooi eerst houtskool in de oven zodat het vuur hoog oplaait, leg dán het gebroken zwaard op het ijzer, en sla het met de hamer weer heel. De hamer ligt verborgen in de sokkel van zijn standbeeld, houtskool tussen de bloemen.”', en: 'The squire points at the smithy. “Forge the hero’s sword: first throw charcoal in the oven so the fire roars up, then lay the broken sword on the iron, and strike it whole with the hammer. The hammer lies hidden in the plinth of his statue, charcoal among the flowers.”' }
            : { nl: 'Een jonge schildknaap in een blauw wapenkleed houdt de wacht bij de koude smidse. Hij knikt je vriendelijk toe. “De koning ontvangt niemand meer, niet sinds de oude held viel — Sir Aldric, de Leeuw van Eldoria, de grootvader van de prinses. Zijn zwaard brak in tweeën en het hele kasteel verstomde van rouw.” Hij overhandigt je de twee stukken van het gebroken zwaard én een stevig touw. “Smeed het bij de smidse weer heel — jij bent er klaar voor. En het touw heb je vast nodig bij de oude put.”', en: 'A young squire in a blue tabard keeps watch by the cold smithy. He gives you a friendly nod. “The king sees no one anymore, not since the old hero fell — Sir Aldric, the Lion of Eldoria, the princess’s grandfather. His sword broke in two and the whole castle fell silent with grief.” He hands you the two pieces of the broken sword and a sturdy rope. “Forge it whole at the smithy — you’re ready for it. And you’ll want the rope at the old well.”' },
          givesWhen: {
            flag: 'metSquire',
            setFlag: 'squireGaveSword',
            item: ['swordBroken', 'rope'],
            giveText: { nl: 'De schildknaap legt het gebroken zwaard van Sir Aldric — beide stukken — in je handen, en een stevig opgerold touw erbij. “Smeed het weer heel bij de smidse: houtskool in de oven, het zwaard op het ijzer, en dan de hamer. Veel succes, vriend.”', en: 'The squire places Sir Aldric’s broken sword — both pieces — into your hands, with a sturdy coil of rope. “Forge it whole at the smithy: charcoal in the oven, the sword on the iron, then the hammer. Good luck, friend.”' }
          },
          setFlag: 'metSquire'
        },
        {
          id: 'well',
          name: { nl: 'De Oude Put', en: 'The Old Well' },
          rect: { x: 224, y: 150, w: 120, h: 108 },
          walkTo: { x: 286, y: 300 },
          look: (state) => state.flags.gotNecklace
            ? { nl: 'De oude put. Diep beneden klatert het donkere water. De ketting van de prinses heb je veilig omhoog gevist.', en: 'The old well. Far below, dark water trickles. You’ve safely fished up the princess’s necklace.' }
            : { nl: 'Een oude stenen put met een houten windwerk. Diep beneden, in het donkere water, ligt iets te glinsteren. Zonder een touw kom je er niet bij.', en: 'An old stone well with a wooden winch. Far below, in the dark water, something glints. Without a rope you can’t reach it.' },
          maze: {
            needItem: 'rope',
            needText: { nl: 'Er glinstert iets diep in de put, maar je kunt er met je blote handen niet bij. Je hebt een touw nodig om af te dalen.', en: 'Something glints deep in the well, but you can’t reach it with bare hands. You need a rope to lower down.' },
            cells: 7,                                       // 7×7 doolhof — flink moeilijk
            water: true,                                    // het touw volgt het waterkanaal omlaag
            img: 'assets/art/maze-well.jpg',
            title: { nl: 'Laat het touw in de put zakken', en: 'Lower the Rope into the Well' },
            hint: { nl: 'Leid het touw langs de natte schachten omlaag, om de muren heen, tot bij de glinstering op de bodem. Gebruik de pijltjes.', en: 'Guide the rope down through the wet shafts, around the walls, to the glint at the bottom. Use the arrows.' },
            setFlag: 'gotNecklace',
            consume: 'rope',
            give: 'necklace',
            solvedText: { nl: 'Het touw haakt achter de glinstering en je hijst op. Met een natte plons komt een fijne gouden ketting boven, met een blauwe edelsteen. Zo’n sieraad hoort vast bij iemand van het hof... de prinses misschien?', en: 'The rope snags on the glint and you haul it up. With a wet splash a fine gold necklace surfaces, a blue gem set in it. A jewel like this surely belongs to someone at court... the princess, perhaps?' }
          }
        },
        {
          id: 'castledoor',
          name: { nl: 'De Kasteeldeur', en: 'The Castle Door' },
          rect: { x: 408, y: 40, w: 76, h: 110 },
          walkTo: { x: 436, y: 248 },
          look: { nl: 'De zware eikenhouten kasteeldeur zit op een fors, eeuwenoud slot. Hierachter, ergens diep in de burcht, wordt Finns vader vastgehouden... maar de deur geeft geen krimp. De sleutel ervan is hier nergens te vinden. (wordt vervolgd in een volgend hoofdstuk)', en: 'The heavy oak castle door is held by a big, ancient lock. Beyond it, somewhere deep in the keep, Finn’s father is held captive... but the door will not budge. Its key is nowhere to be found here. (to be continued in a later chapter)' }
        },
        {
          id: 'forge',
          name: { nl: 'De Smidse', en: 'The Forge' },
          rect: { x: 2, y: 118, w: 78, h: 112 },
          walkTo: { x: 76, y: 252 },
          look: (state) => state.flags.gotSword
            ? { nl: 'De smidse van het kasteel. De oven gloeit warm na — hier smeedde je het zwaard van Sir Aldric weer heel.', en: 'The castle smithy. The oven still glows warm — here you forged Sir Aldric’s sword whole again.' }
            : state.flags.swordInForge
            ? { nl: 'Het gebroken zwaard van Sir Aldric ligt roodgloeiend op het ijzer in de wit-hete oven. Sla het met de smidshamer weer heel!', en: 'Sir Aldric’s broken sword lies glowing red on the iron in the white-hot oven. Strike it whole with the blacksmith’s hammer!' }
            : state.flags.ovenStoked
            ? { nl: 'De oven loeit wit-heet van de houtskool. Leg er het gebroken zwaard op het ijzer in om het te kunnen smeden.', en: 'The oven roars white-hot with charcoal. Lay the broken sword on the iron in it so you can forge it.' }
            : { nl: 'Een koude smidse onder een afdakje, met een aambeeld en een dode oven. Gooi er houtskool in om het smidsvuur aan te wakkeren.', en: 'A cold smithy under a lean-to, with an anvil and a dead oven. Throw in charcoal to kindle the forge fire.' },
          use: {
            charcoal: {
              consume: 'charcoal',
              setFlag: 'ovenStoked',
              burst: { x: 40, y: 176, col: '255,150,40', n: 34, up: 26, life: 1.4 },   // het smidsvuur laait fel op: warme vonkenregen
              text: { nl: 'Je gooit de houtskool op de sintels en blaast aan. WHOESH! Het smidsvuur laait fel op, wit-heet, en een regen van oranje vonken spat omhoog. Nu kun je ijzer smeden.', en: 'You throw the charcoal onto the embers and fan it. WHOOSH! The forge fire flares up fierce and white-hot, and a shower of orange sparks bursts upward. Now you can forge iron.' }
            },
            swordBroken: {
              requiresFlag: 'ovenStoked',
              requiresText: { nl: 'De oven is nog koud. Gooi er eerst houtskool in om het vuur hoog op te laten laaien.', en: 'The oven is still cold. First throw in charcoal to make the fire roar up high.' },
              setFlag: 'swordInForge',
              burst: { x: 40, y: 176, col: '255,180,70', n: 16, up: 18, life: 1.1 },
              text: { nl: 'Je legt het gebroken zwaard van Sir Aldric — beide stukken — op het ijzer, midden in het wit-hete vuur. Het staal begint algauw rood te gloeien. Nu de hamer!', en: 'You lay Sir Aldric’s broken sword — both pieces — on the iron, deep in the white-hot fire. The steel soon begins to glow red. Now the hammer!' }
            },
            hammer: {
              keep: true,
              requiresFlag: 'swordInForge',
              requiresText: { nl: 'Er ligt nog geen gloeiend zwaard op het aambeeld. Stook eerst de oven op en leg het gebroken zwaard erin.', en: 'There’s no glowing sword on the anvil yet. First stoke the oven and lay the broken sword in it.' },
              consume: 'swordBroken',
              give: 'sword',
              setFlag: 'gotSword',
              burst: { x: 44, y: 170, col: '255,210,120', n: 26, up: 20, life: 1.2 },
              text: { nl: 'Je grijpt de zware smidshamer en slaat — KLANG! KLANG! — de twee gloeiende stukken op het aambeeld weer aan elkaar. Vonken spatten alle kanten op. Met een sissende plons in de waterton koel je het af, en je houdt het prachtige, weer hele zwaard van Sir Aldric in handen!', en: 'You grab the heavy blacksmith’s hammer and strike — CLANG! CLANG! — the two glowing pieces back together on the anvil. Sparks fly everywhere. With a hissing plunge into the water trough you quench it, and you hold Sir Aldric’s beautiful, whole sword!' }
            }
          }
        },
        {
          id: 'nut',
          name: { nl: 'Een Noot', en: 'A Nut' },
          rect: { x: 74, y: 220, w: 46, h: 42 },
          walkTo: { x: 96, y: 254 },
          hideFlag: 'taken_courtyard_nut',
          gives: {
            item: 'nut',
            giveText: { nl: 'Bij het aambeeld van de smidse, naast het koude ijzer, ligt een klein donkerbruin nootje. Je raapt het op — vast lekker voor een vogel.', en: 'By the smithy anvil, beside the cold iron, lies a small dark-brown nut. You pick it up — surely a treat for a bird.' },
            emptyText: { nl: 'De noot zit al in je tas.', en: 'The nut is already in your bag.' }
          }
        },
        {
          id: 'mushroom',
          name: { nl: 'Magische Paddenstoelen', en: 'Magic Mushrooms' },
          rect: { x: 186, y: 282, w: 48, h: 40 },
          walkTo: { x: 208, y: 300 },
          hideFlag: 'taken_courtyard_mushroom',
          gives: {
            item: 'mushroom',
            giveText: { nl: 'Tegen de voet van de put groeit een trosje warm gloeiende paddenstoelen met bruin-oranje hoedjes. Je plukt ze voorzichtig — ze tintelen van de magie.', en: 'Against the foot of the well grows a cluster of warmly glowing mushrooms with brown-orange caps. You pick them carefully — they tingle with magic.' },
            emptyText: { nl: 'De paddenstoelen bij de put heb je al geplukt.', en: 'You’ve already picked the mushrooms by the well.' }
          }
        },
        {
          id: 'toGarden',
          name: { nl: 'De Slottuin', en: 'The Castle Garden' },
          rect: { x: 112, y: 66, w: 96, h: 98 },
          walkTo: { x: 168, y: 250 },
          arrow: { x: 158, y: 126, dir: 'up' },
          exit: { to: 'garden', travelText: { nl: 'Je loopt onder de begroeide boog door, de bloeiende slottuin in...', en: 'You pass under the ivy-clad arch, into the blooming castle garden...' } }
        }
      ]
    },

    /* ---------------------------------------------------------------
       Deel 2 — Scene 2: de ommuurde slottuin. Hier wandelt de prinses
       op wie Finn stiekem verliefd is, tussen rozen en klimop.
       --------------------------------------------------------------- */
    garden: {
      name: { nl: 'De Slottuin', en: 'The Castle Garden' },
      bg: 'assets/art/scene-garden.jpg',
      bgVariants: [
        { img: 'assets/art/scene-garden-open.jpg', flag: 'secretGateOpen' }   // zodra de geheime poort opengaat: tuin met de open donkere doorgang in de linkermuur
      ],
      charFilter: 'saturate(1.06) brightness(1.05) sepia(0.06) contrast(1.03)',   // helder zonnig tuinlicht; lichte warmte zodat de figuren in de omgeving opgaan
      heroShade: 0.98,
      entryText: {
        nl: 'De ommuurde slottuin staat vol rozen en klimop. In het midden waakt een ridderbeeld; links klatert een leeuwenfontein, rechts staat een bankje onder een rozenboog. En daar — tussen de bloemen — wandelt de prinses.',
        en: 'The walled castle garden is full of roses and ivy. A knight statue watches at its centre; a lion fountain trickles to the left, a bench rests under a rose arbour to the right. And there — among the flowers — walks the princess.'
      },
      playerStart: { x: 176, y: 256 },
      spawnFrom: { courtyard: { x: 176, y: 256 } },
      depth: { far: 206, near: 316, sFar: 0.72, sNear: 1.05 },
      walkable: [
        { x: 30,  y: 252, w: 508, h: 62 },                 // voorgrond-pad over de hele breedte
        { x: 30,  y: 214, w: 180, h: 44 },                 // pad links (richting fontein)
        { x: 360, y: 214, w: 178, h: 44 }                  // pad rechts (richting bankje)
      ],
      obstacles: [
        { x: 198, y: 168, w: 174, h: 92 },                 // de ronde bloemenperk-ring met het ridderbeeld — niet doorheen lopen
        { x: 474, y: 262, w: 64, h: 52 }                   // de stenen bloembak (urn) in de rechterhoek
      ],
      overlays: [
        { img: 'assets/art/keyhole.png', x: 48, y: 166, base: 240, appearFlag: 'fountainSolved', hideFlag: 'secretGateOpen' }   // sleutelgat verschijnt onder de leeuwenkop zodra de fontein-puzzel is opgelost; weg zodra de poort open is
      ],
      worldItems: [
        { item: 'charcoal', hotspot: 'charcoal', x: 132, y: 238, scale: 0.78, glowCol: '255,170,80' }   // houtskool tussen de bloemen (links van Finns startplek, niet eronder) — stilstaand, iets kleiner, zachte warme gloed
      ],
      npcs: [
        { id: 'princess', sprite: 'princess', sway: 0.020, filter: 'brightness(0.78) saturate(0.92)', flip: true, x: 424, y: 250, scale: 1.0 },   // prinses; zelfde afbeelding, iets compacter (kleinere schaal); zelfde wieg als de wachter maar subtieler
        { id: 'gardenParrot', sprite: 'parrot', x: 508, y: 204, scale: 0.42, flip: true, peck: true, peckAmt: 0.35, filter: 'brightness(0.95) saturate(0.95)' }   // gedetailleerde groene pixel-art papagaai op het bankje — kleiner en iets hoger
      ],
      fx: {},
      hotspots: [
        {
          id: 'princess',
          name: { nl: 'De Prinses', en: 'The Princess' },
          rect: { x: 400, y: 170, w: 60, h: 90 },
          walkTo: { x: 398, y: 296 },
          choice: {
            prompt: { nl: 'De prinses kijkt je met een glimlach aan. “Waarover wil je praten, Finn?”', en: 'The princess looks at you with a smile. “What shall we talk about, Finn?”' },
            options: [
              { label: { nl: 'Wie ben je?', en: 'Who are you?' },
                text: { nl: '“Ik ben de kleindochter van Sir Aldric, de Leeuw van Eldoria. Sinds grootvader viel hangt er een stilte over het kasteel — en mijn vader, de koning, ontvangt niemand meer.”', en: '“I am the granddaughter of Sir Aldric, the Lion of Eldoria. Since grandfather fell a hush has lain over the castle — and my father the king sees no one anymore.”' } },
              { label: { nl: 'Je ketting', en: 'Your necklace' },
                text: { nl: '“Die ketting was van mijn moeder. Hij gleed van mijn hals, diep de oude put op de binnenplaats in. Ik zou er alles voor geven om hem terug te zien.”', en: '“That necklace was my mother’s. It slipped from my neck, deep down the old well in the courtyard. I’d give anything to see it again.”' } },
              { label: { nl: 'Mijn vader', en: 'My father' },
                text: { nl: 'Je vertelt zacht dat je vader ergens diep in het kasteel gevangen wordt gehouden. Ze knijpt even in je hand. “Wees voorzichtig, Finn. Achter de leeuwenfontein moet een vergeten poort zijn... maar die is goed verborgen.”', en: 'You tell her softly that your father is held captive somewhere deep in the castle. She squeezes your hand. “Be careful, Finn. Behind the lion fountain there must be a forgotten gate... but it is well hidden.”' } },
              { label: { nl: 'Tot ziens', en: 'Goodbye' },
                text: { nl: '“Blijf niet te lang weg, Finn,” zegt ze zacht, en ze glimlacht.', en: '“Don’t stay away too long, Finn,” she says softly, and smiles.' } }
            ]
          },
          look: (state) => state.flags.gaveNecklace
            ? { nl: 'De prinses draagt de ketting van haar moeder weer en straalt. “Dankzij jou, Finn. Wees voorzichtig achter die deur — en kom alsjeblieft weer terug.” Haar glimlach maakt je sprakeloos.', en: 'The princess wears her mother’s necklace again and beams. “Thanks to you, Finn. Be careful beyond that door — and please, come back to me.” Her smile leaves you speechless.' }
            : state.flags.metPrincess
            ? { nl: 'De prinses zucht. “Die ketting was alles wat ik nog van mijn moeder had — hij viel diep in de oude put op de binnenplaats. Kon iemand hem er maar uithalen...”', en: 'The princess sighs. “That necklace was all I had left of my mother — it fell deep down the old well in the courtyard. If only someone could fish it out...”' }
            : { nl: 'Tussen de rozen wandelt de prinses op wie Finn al sinds zijn jeugd stiekem verliefd is. Zijn hart bonkt. Ze kijkt op, een beetje droevig: “Een nieuw gezicht in mijn tuin... vergeef me dat ik geen vrolijk gezelschap ben — ik ben de ketting van mijn moeder verloren, gevallen in de oude put.”', en: 'Among the roses walks the princess Finn has secretly loved since childhood. His heart pounds. She looks up, a little sad: “A new face in my garden... forgive me for being poor company — I’ve lost my mother’s necklace, dropped down the old well.”' },
          use: {
            necklace: {
              consume: 'necklace',
              give: 'key',
              setFlag: 'gaveNecklace',
              text: { nl: 'Je houdt de prinses de gouden ketting voor. Haar hand vliegt naar haar mond. “Mijn moeders ketting — je hebt hem gevonden!” Met tranen in haar ogen doet ze hem om. “Hoe kan ik je ooit bedanken... Hier.” Ze drukt je een oude sleutel in de hand. “Die past op het slot achter de leeuwenfontein — de geheime poort. Bijna niemand weet ervan. Wees dapper, Finn.”', en: 'You hold out the gold necklace to the princess. Her hand flies to her mouth. “My mother’s necklace — you found it!” Tears in her eyes, she fastens it on. “How can I ever thank you... Here.” She presses an old key into your hand. “It fits the lock behind the lion fountain — the secret gate. Almost no one knows of it. Be brave, Finn.”' }
            },
            sword: {
              keep: true,                                  // het gesmede zwaard blijft van Finn
              setFlag: 'showedSword',
              text: { nl: 'Je toont de prinses het opnieuw gesmede zwaard. “Het zwaard van mijn grootvader — weer heel!” fluistert ze, en haar ogen glanzen. “Met jou als ridder zou Eldoria niets te vrezen hebben, Finn.” Je staat te blozen en weet even niets te zeggen.', en: 'You show the princess the reforged sword. “My grandfather’s blade — whole again!” she whispers, her eyes shining. “With you as its knight, Eldoria would have nothing to fear, Finn.” You blush and, for a moment, find nothing to say.' }
            }
          },
          setFlag: 'metPrincess'
        },
        {
          id: 'fountain',
          name: { nl: 'De Leeuwenfontein', en: 'The Lion Fountain' },
          rect: { x: 22, y: 118, w: 84, h: 100 },
          walkTo: { x: 96, y: 252 },
          hideFlag: 'secretGateOpen',                         // zodra de poort open is, neemt de geheime-poort-hotspot het over
          look: (state) => state.flags.fountainSolved
            ? { nl: 'De leeuwenkop spuwt nog water, maar onder zijn muil is nu een ijzeren sleutelgat in de muur zichtbaar geworden. Het wacht op de juiste sleutel.', en: 'The lion’s head still spouts water, but beneath its jaws an iron keyhole has appeared in the wall. It waits for the right key.' }
            : { nl: 'Een stenen leeuwenkop spuwt water in een schelpvormig bekken. Op de bodem ligt, vertroebeld door het water, een stenen wapen-mozaïek dat in losse stukken is geschoven. Schuif de stukken weer op hun plaats om te zien wat het in beweging zet.', en: 'A stone lion spouts water into a shell-shaped basin. On the floor, blurred by the water, lies a stone crest-mosaic shuffled into loose pieces. Slide them back into place to see what it sets in motion.' },
          slidePuzzle: {
            size: 3,
            img: 'assets/art/puzzle-fountain.jpg',
            title: { nl: 'Het Wapen in de Fontein', en: 'The Crest in the Fountain' },
            setFlag: 'fountainSolved',
            burst: { x: 60, y: 150 },
            solvedText: { nl: 'Het mozaïek klikt compleet op zijn plaats — het wapen van Sir Aldric, de Leeuw van Eldoria. Onder de leeuwenkop schuift met een steenachtig gerommel een paneel opzij, en daar verschijnt een ijzeren sleutelgat, diep in de muur verzonken. Waar zou de sleutel ervan op liggen?', en: 'The mosaic clicks complete — the arms of Sir Aldric, the Lion of Eldoria. Beneath the lion’s head a panel grinds aside, revealing an iron keyhole set deep into the wall. Where might its key be?' }
          },
          use: {
            key: {
              requiresFlag: 'fountainSolved',
              requiresText: { nl: 'Er is hier nog geen slot te zien. Los eerst de schuifpuzzel in de fontein op.', en: 'There’s no lock to be seen here yet. Solve the fountain’s sliding puzzle first.' },
              puzzleFallback: true,                          // sleutel vasthouden vóór het slot er is? -> open dan gewoon de schuifpuzzel
              keep: false,
              consume: 'key',
              setFlag: 'secretGateOpen',
              text: { nl: 'Je steekt de oude sleutel in het slot onder de leeuwenkop en draait. Met een diepe, knarsende dreun schuift een hele muurpartij opzij — de geheime poort gaat open! Een koele, donkere gang gaapt erachter, diep het kasteel in.', en: 'You slide the old key into the lock beneath the lion’s head and turn. With a deep, grinding boom a whole section of wall slides aside — the secret gate opens! A cool, dark passage gapes beyond, deep into the castle.' }
            }
          }
        },
        {
          id: 'secretGate',
          name: { nl: 'De Geheime Poort', en: 'The Secret Gate' },
          rect: { x: 8, y: 96, w: 52, h: 122 },
          walkTo: { x: 60, y: 250 },
          appearFlag: 'secretGateOpen',                      // verschijnt pas nadat de sleutel het slot opent
          arrow: { x: 32, y: 150, dir: 'up' },
          endGame: true,                                     // door de geheime poort stappen → eindkaart (Deel 2)
          enterText: { nl: 'Je stapt door de open geheime poort naast de leeuwenfontein. Een koele, donkere gang loopt diep het hart van het kasteel in — precies de weg die je zoekt naar Finns vader. Met je hart in je keel en het zwaard van Sir Aldric aan je zij zet je de eerste stap de duisternis in... (wordt vervolgd in Deel 3)', en: 'You step through the open secret gate beside the lion fountain. A cool, dark passage runs deep into the heart of the castle — exactly the way you seek to Finn’s father. Heart in your throat and Sir Aldric’s sword at your side, you take the first step into the dark... (to be continued in Part 3)' }
        },
        {
          id: 'gstatue',
          name: { nl: 'Het Beeld van de Smid', en: 'The Statue of the Smith' },
          rect: { x: 232, y: 90, w: 96, h: 150 },
          walkTo: { x: 286, y: 296 },
          look: (state) => state.flags.statuePuzzleSolved
            ? { nl: 'Het vakje onder in de sokkel staat open en leeg — de zware smidshamer van de oude held zit nu in je tas. Tijd om het zwaard te smeden bij de smidse.', en: 'The niche in the base of the plinth stands open and empty — the old hero’s heavy hammer is in your bag now. Time to forge the sword at the smithy.' }
            : state.flags.gotSmithPhrase
            ? { nl: 'Het bronzen beeld van de smid bij zijn aambeeld. In de sokkel staat gegrift: “Spreek de twee geheime woorden van de smid.” Je kent ze nu — typ ze in.', en: 'The bronze statue of the smith at his anvil. Carved in the plinth: “Speak the smith’s two secret words.” You know them now — type them in.' }
            : { nl: 'Een bronzen beeld van een smid bij zijn aambeeld. In de sokkel staat een verweerde inscriptie: “Spreek de twee geheime woorden van de smid.” Maar je kent ze niet... wie zou die woorden kennen?', en: 'A bronze statue of a smith at his anvil. The plinth bears a worn inscription: “Speak the smith’s two secret words.” But you don’t know them... who might know those words?' },
          riddle: {
            requiresFlag: 'gotSmithPhrase',
            title: { nl: 'De Woorden van de Smid', en: 'The Smith’s Words' },
            questions: [
              {
                q: { nl: 'In de sokkel van het smidsbeeld staat gegrift: “Spreek de twee geheime woorden van de smid.” Typ ze in.', en: 'Carved in the plinth of the smith statue: “Speak the smith’s two secret words.” Type them in.' },
                accept: ['vuur en staal', 'vuur staal', 'fire and steel', 'fire steel'],
                placeholder: { nl: 'Typ de twee woorden…', en: 'Type the two words…' },
                submit: { nl: 'Spreek uit', en: 'Speak' }
              }
            ],
            setFlag: 'statuePuzzleSolved',
            reward: 'hammer',
            wrongText: { nl: 'Niets gebeurt. Dat zijn niet de juiste woorden... vraag het de papagaai nog eens.', en: 'Nothing happens. Those aren’t the right words... ask the parrot again.' },
            solvedText: { nl: 'Je spreekt de woorden hardop: “Vuur en staal!” Met een steenachtig gerommel schuift een vakje in de sokkel open — daarin ligt de zware smidshamer van de oude held! Je neemt hem mee. Hiermee kun je bij de smidse zijn zwaard weer smeden.', en: 'You speak the words aloud: “Fire and steel!” With a stony rumble a niche slides open in the plinth — inside lies the old hero’s heavy blacksmith’s hammer! You take it. With this you can forge his sword again at the smithy.' }
          }
        },
        {
          id: 'parrot',
          name: { nl: 'De Papagaai', en: 'The Parrot' },
          rect: { x: 482, y: 172, w: 66, h: 66 },
          walkTo: { x: 486, y: 252 },
          choice: {
            prompt: { nl: 'De papagaai legt zijn kopje scheef. “Krrak! Wil je iets weten?”', en: 'The parrot tilts his head. “Squawk! Want to know something?”' },
            options: [
              { label: { nl: 'Wie ben jij?', en: 'Who are you?' },
                text: { nl: '“Krrak! Ik ben de oudste papagaai van Eldoria. Ik zit hier al langer dan de koning regeert — en ik vergeet níets!”', en: '“Squawk! I’m the oldest parrot in Eldoria. I’ve perched here longer than the king has reigned — and I forget nothing!”' } },
              { label: { nl: 'Ken je een geheim?', en: 'Know a secret?' },
                text: { nl: '“Misschien wel, misschien niet... Krrak! Maar een hongerige vogel praat niet. Heb je een lekkere noot voor me? Die liggen weleens op het plein.”', en: '“Maybe I do, maybe I don’t... Squawk! But a hungry bird won’t talk. Got a tasty nut for me? You sometimes find them in the courtyard.”' } },
              { label: { nl: 'Dag papagaai', en: 'Bye, parrot' },
                text: { nl: '“Krrak! Tot kijk!” Hij schudt vrolijk zijn veren.', en: '“Squawk! See you!” He ruffles his feathers happily.' } }
            ]
          },
          look: (state) => state.flags.gotSmithPhrase
            ? { nl: 'De groene papagaai wipt op en neer en kraakt vrolijk: “Vuur en staal! Vuur en staal!”', en: 'The green parrot bobs up and down and squawks merrily: “Fire and steel! Fire and steel!”' }
            : { nl: 'Een kleurrijke groene papagaai zit op het bankje en bekijkt je nieuwsgierig met scheef kopje. Hij lijkt dol op een lekkernij... had je maar iets om hem te voeren.', en: 'A colourful green parrot perches on the bench, eyeing you with a curious tilt of the head. He seems to love a treat... if only you had something to feed him.' },
          use: {
            nut: {
              consume: 'nut',
              setFlag: 'gotSmithPhrase',
              text: { nl: 'Je geeft de papagaai de noot. Hij kraakt hem behendig open, smult ervan, en kwettert dan een oud rijmpje: “De smid bewaart zijn geheim in twee woorden... VUUR EN STAAL! Vuur en staal!” Je prent de woorden goed in je geheugen — die moet je bij het smidsbeeld intypen.', en: 'You give the parrot the nut. He cracks it open deftly, gobbles it up, and then chatters an old rhyme: “The smith keeps his secret in two words... FIRE AND STEEL! Fire and steel!” You commit the words to memory — you must type them at the smith statue.' }
            }
          }
        },
        {
          id: 'charcoal',
          name: { nl: 'Houtskool', en: 'Charcoal' },
          rect: { x: 110, y: 220, w: 48, h: 42 },
          walkTo: { x: 138, y: 266 },
          hideFlag: 'taken_garden_charcoal',
          gives: {
            item: 'charcoal',
            giveText: { nl: 'Tussen de kleurige bloemen ligt, vreemd genoeg, een hoopje zwarte houtskool te glinsteren — alsof hier ooit een vuur heeft gebrand. Je raapt het op. Hier kan een smid vast iets mee.', en: 'Among the colourful flowers, oddly enough, a little heap of black charcoal glints — as if a fire once burned here. You pick it up. A smith could surely use this.' },
            emptyText: { nl: 'De houtskool zit al in je tas.', en: 'The charcoal is already in your bag.' }
          }
        },
        {
          id: 'bench',
          name: { nl: 'Het Bankje', en: 'The Bench' },
          rect: { x: 470, y: 148, w: 92, h: 82 },
          walkTo: { x: 486, y: 252 },
          look: {
            nl: 'Een verweerd houten bankje onder een boog van klimrozen. Een fijne plek om samen te zitten... als je dapper genoeg bent om het te vragen.',
            en: 'A weathered wooden bench under an arch of climbing roses. A fine place to sit together... if you’re brave enough to ask.'
          }
        },
        {
          id: 'toCourtyard',
          name: { nl: 'Terug naar de Binnenplaats', en: 'Back to the Courtyard' },
          rect: { x: 12, y: 256, w: 100, h: 60 },
          walkTo: { x: 70, y: 300 },
          arrow: { x: 86, y: 268, dir: 'down' },
          exit: { to: 'courtyard', travelText: { nl: 'Je loopt de tuin weer uit, terug naar de binnenplaats.', en: 'You leave the garden, back to the courtyard.' } }
        }
      ]
    }

  }
};
