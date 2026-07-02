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
  assetVer: '120',

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
    parrot:        'assets/art/parrot.png',        // kleurrijke papagaai in de slottuin (Deel 2)
    librarian:     'assets/art/librarian.png'     // de oude bibliothecaris in de kasteelbibliotheek (Deel 2)
  },
  heroWalkFrames: 16,           // loopanimatie uit /lopen 01-16 (alleen de écht-lopende frames)
  spriteDetail: 2,              // sprites zijn op 2x resolutie opgeslagen; engine tekent ze op halve maat = fijnere details

  /* Finn begint met de staf van zijn vader én — uit Deel 1 — zijn toverboek met de twee spreuken (dansende bloemen + draak). */
  startItems: ['staff', 'spellbook', 'spell', 'dragonspell'],
  /* Alle bladzijdes uit Deel 1 staan al in het boek: de kaart, de spreuk van dansende bloemen, het recept en de drakenspreuk. */
  startFlags: ['mapFiled', 'spellWritten', 'gotRecipe', 'dragonSpellLearned'],

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
    q_gethammer:{ nl: 'Voor de hamer: bij het smidsbeeld in de tuin moet je de geheime woorden van de smid aanklikken. Geef de papagaai een noot (bij het aambeeld op het plein) — hij verklapt welke woorden, en in welke volgorde', en: 'For the hammer: at the smith statue in the garden you must click the smith’s secret words. Give the parrot a nut (by the anvil in the courtyard) — he reveals which words, and in what order' },
    q_giveparrot:{ nl: 'Je hebt een noot — geef hem aan de papagaai in de slottuin; hij verklapt de geheime woorden van de smid', en: 'You have a nut — give it to the parrot in the garden; he reveals the smith’s secret words' },
    q_typephrase:{ nl: 'De papagaai verklapte de spreuk van de smid: ONLY · FIRE · FORGES · TRUE · STEEL. Klik die woorden in díe volgorde aan bij het smidsbeeld in de tuin om de hamer te krijgen', en: 'The parrot revealed the smith’s saying: ONLY · FIRE · FORGES · TRUE · STEEL. Click those words in that order at the smith statue in the garden to get the hammer' },
    q_getcoal:  { nl: 'Zoek de houtskool tussen de bloemen in de slottuin om het smidsvuur mee aan te wakkeren', en: 'Find the charcoal among the flowers in the garden to kindle the forge fire' },
    q_forge:    { nl: 'Smeed bij de smidse: gooi eerst de houtskool in de oven (het vuur laait fel op), leg dán het gebroken zwaard op het ijzer, en sla het ten slotte met de hamer weer heel', en: 'Forge at the smithy: first throw the charcoal into the oven (the fire flares up), then lay the broken sword on the iron, and finally strike it whole with the hammer' },
    q_takesword:{ nl: 'Het zwaard is weer heel! Het ligt te glanzen bij de markttent rechts — pak het op', en: 'The sword is whole again! It gleams by the market tent on the right — go and take it' },
    q_getrope:  { nl: 'Het zwaard is gesmeed! Praat met de schildknaap — nu geeft hij je het touw dat je bij de put nodig hebt', en: 'The sword is forged! Talk to the squire — now he’ll give you the rope you need at the well' },
    q_getcoin:  { nl: 'Voor de put heb je hulp van de raaf nodig. Vis eerst de glinsterende bronzen munt uit de leeuwenfontein in de tuin (klik op het bekken, niet op de leeuwenkop)', en: 'For the well you need the raven’s help. First fish the gleaming bronze coin from the lion fountain in the garden (click the basin, not the lion’s head)' },
    q_giveraven:{ nl: 'Geef de bronzen munt aan de glanzende raaf op de put — hij springt er dan mee de emmer in, de diepte in', en: 'Give the bronze coin to the glossy raven on the well — he’ll hop into the bucket with it and dive down' },
    q_haulwell: { nl: 'De raaf zit met de ketting in de emmer onderin de put. Gebruik het touw (van de schildknaap) op het windwerk om de emmer omhoog te hijsen', en: 'The raven sits with the necklace in the bucket deep in the well. Use the rope (from the squire) on the winch to haul the bucket up' },
    q_givenecklace:{ nl: 'Je viste de ketting van de prinses op — breng hem naar de prinses in de slottuin', en: 'You fished up the princess’s necklace — bring it to the princess in the garden' },
    q_fountainpuzzle:{ nl: 'Je kreeg een sleutel van de prinses — los de schuifpuzzel bij de leeuwenfontein op om het slot te onthullen', en: 'The princess gave you a key — solve the sliding puzzle at the lion fountain to reveal the lock' },
    q_usekey:   { nl: 'Gebruik de sleutel op het slot onder de leeuwenkop van de fontein om de geheime poort te openen', en: 'Use the key on the lock beneath the fountain’s lion head to open the secret gate' },
    q_through:  { nl: 'De geheime poort staat open naast de leeuwenfontein — stap erdoorheen, de donkere gang in', en: 'The secret gate stands open beside the lion fountain — step through it, into the dark passage' },
    q_library:  { nl: 'Door de geheime poort kom je in de kasteelbibliotheek. Een oude tovenaar bewaakt het gloeiende boek — de raaf op de vensterbank weet vast raad (psst: hij fluistert iets over paddenstoelen bij de put)', en: 'Through the secret gate you reach the castle library. An old wizard guards the glowing book — the raven on the windowsill surely knows a trick (psst: he whispers something about mushrooms by the well)' },
    q_takespell:{ nl: 'De tovenaar zweeft in hogere sferen — kijk nu in het gloeiende boek op de lessenaar: daar wacht de Zonsverduistering-spreuk', en: 'The wizard floats among the stars — look in the glowing book on the lectern: the Solar Eclipse spell awaits' },
    q_castEclipse:{ nl: 'Je hebt de Zonsverduistering-spreuk! Tik hem aan in je tas en spreek hem uit bij het grote raam van de bibliotheek', en: 'You have the Solar Eclipse spell! Tap it in your bag and speak it at the great library window' },
    q_telescope:{ nl: 'De zon is verduisterd en de sterren fonkelen — kijk snel door de telescoop bij het raam!', en: 'The sun is darkened and the stars sparkle — quick, look through the telescope by the window!' },
    q_altar:    { nl: 'Je zag drie gloeiende tekens tussen de sterren. Zet ze op het sterren-altaar rechts in de bibliotheek — elk teken in het gouden vakje', en: 'You saw three glowing signs among the stars. Set them on the star altar at the right of the library — each sign in its golden box' },
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
    invisspell: { name: { nl: 'Onzichtbaarheidsspreuk', en: 'Invisibility Spell' }, icon: '👻', img: 'assets/art/item-invisspell.png', sparkle: true, border: 'blue',
             look: { nl: 'De onzichtbaarheidsspreuk uit het sterren-altaar in de kasteelbibliotheek. De letters lijken weg te vagen terwijl je kijkt — wie weet welke deuren dit in Deel 3 opent...', en: 'The invisibility spell from the star altar in the castle library. Its letters seem to fade away as you watch — who knows what doors this opens in Part 3...' } },
    eclipsspell: { name: { nl: 'Zonsverduistering-spreuk', en: 'Solar Eclipse Spell' }, icon: '🌑', img: 'assets/art/item-eclipsspell.png', border: 'blue',
             look: { nl: 'De Spreuk van de Zonsverduistering — “Umbra Solis” — uit het gloeiende boek. Spreek hem uit bij het grote raam van de bibliotheek en de zon dooft, zodat de sterren zich overdag tonen. (Tik de spreuk aan om hem uit te spreken.)', en: 'The Spell of the Solar Eclipse — “Umbra Solis” — from the glowing book. Speak it at the great library window and the sun goes dark, so the stars show themselves by day. (Tap the spell to cast it.)' } },
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
    trinket: { name: { nl: 'Bronzen Munt', en: 'Bronze Coin' }, icon: '🪙', img: 'assets/art/item-trinket.png', sparkle: true,
             look: { nl: 'Een glanzende bronzen munt die je uit de leeuwenfontein opviste. Hij blinkt schitterend in het licht — precies het soort glimmend ding waar een raaf geen weerstand aan kan bieden.', en: 'A gleaming bronze coin you fished from the lion fountain. It shines brilliantly in the light — exactly the kind of bright thing a raven cannot resist.' } },
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
    { when: { flag: 'sawStars', notFlag: 'gotInvisSpell' },              quest: 'q_altar' },         // tekens gezien -> zet ze op het sterren-altaar
    { when: { flag: 'eclipseActive', notFlag: 'sawStars' },              quest: 'q_telescope' },     // eclips actief -> kijk door de telescoop
    { when: { flag: 'gotEclipseSpell', notFlag: 'eclipseActive' },       quest: 'q_castEclipse' },   // spreuk binnen -> spreek hem uit
    { when: { flag: 'wizardTripping', notFlag: 'gotEclipseSpell' },      quest: 'q_takespell' },     // tovenaar in trance -> kijk in het gloeiende boek
    { when: { flag: 'secretGateOpen', notFlag: 'gotInvisSpell' },        quest: 'q_library' },       // poort open -> de bibliotheek in, geef de tovenaar de paddenstoelen
    { when: { has: 'key', flag: 'fountainSolved' },                      quest: 'q_usekey' },        // sleutel + slot zichtbaar -> open de poort
    { when: { has: 'key' },                                              quest: 'q_fountainpuzzle' },// sleutel maar slot nog verborgen -> los de fontein op
    { when: { has: 'necklace' },                                         quest: 'q_givenecklace' },  // ketting -> naar de prinses
    { when: { has: 'rope', flag: 'ravenInBucket', notFlag: 'gotNecklace' }, quest: 'q_haulwell' },   // raaf in de emmer + touw -> hijs de ketting op
    { when: { flag: 'ravenInBucket', notFlag: 'gotNecklace' },           quest: 'q_haulwell' },      // raaf in de emmer, maar nog geen touw
    { when: { has: 'trinket' },                                          quest: 'q_giveraven' },     // bronzen munt -> geef aan de raaf op de put
    { when: { flag: 'gotSword', notFlag: 'squireGaveRope' },             quest: 'q_getrope' },       // zwaard gepakt -> haal het touw bij de schildknaap
    { when: { flag: 'gotSword', notFlag: 'gotNecklace' },                quest: 'q_getcoin' },       // touw binnen -> vis de munt uit de fontein
    { when: { flag: 'swordForged', notFlag: 'gotSword' },                quest: 'q_takesword' },     // gesmeed -> pak het zwaard bij de markttent
    { when: { flag: 'swordInForge', notFlag: 'gotSword' },               quest: 'q_forge' },         // zwaard ligt in de oven -> sla het met de hamer
    { when: { has: ['swordBroken', 'hammer', 'charcoal'], notFlag: 'gotSword' }, quest: 'q_forge' }, // alles aanwezig -> smeed (kool, zwaard, hamer)
    { when: { has: ['swordBroken', 'hammer'], notFlag: 'gotSword' },     quest: 'q_getcoal' },       // mist houtskool
    { when: { flag: 'gotSmithPhrase', notFlag: 'statuePuzzleSolved' },   quest: 'q_typephrase' },    // woorden bekend -> typ ze bij het smidsbeeld
    { when: { has: 'nut', notFlag: 'gotSmithPhrase' },                   quest: 'q_giveparrot' },    // noot -> geef aan de papagaai
    { when: { has: ['swordBroken', 'charcoal'], notFlag: 'gotSword' },   quest: 'q_gethammer' },     // mist hamer (noot->papagaai->woorden->beeld)
    { when: { has: 'swordBroken', notFlag: 'gotSword' },                 quest: 'q_getsword' },      // heeft gebroken zwaard -> haal hamer + kool
    { when: { flag: 'metSquire', notFlag: 'gotSword' },                  quest: 'q_getsword' },      // schildknaap gesproken
    { when: { has: 'rope' },                                             quest: 'q_getcoin' },       // terugval: touw -> munt uit de fontein -> raaf -> ophijsen
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
      bgVariants: [
        // eerste passende wint
        { img: 'assets/art/scene-courtyard-raven-swordgone.jpg', flags: ['ravenInBucket'], notFlags: ['gotNecklace'] },  // raaf in de put -> lege rek
        { img: 'assets/art/scene-courtyard-sword.jpg',           flags: ['squireGaveRope'] },                            // zwaard ingeleverd bij de schildknaap -> tentoongesteld
        { img: 'assets/art/scene-courtyard-swordgone.jpg',       flags: ['squireGaveSword'] }                            // gebroken zwaard gekregen -> rek leeg (smeden verandert dit niet)
      ],
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
        { x: 224, y: 166, w: 122, h: 84 },                 // de ronde put in het midden
        { x: 0,   y: 200, w: 140, h: 50 },                 // links: de smidse — oven + aambeeld/ijzer (niet doorheen lopen; je smeedt van vóór af)
        { x: 0,   y: 250, w: 62,  h: 64 },                 // links-onder: de houten kisten/vaten bij de smidse (niet doorheen lopen)
        { x: 455, y: 208, w: 113, h: 106 }                 // rechts: de markttent + wapenrek + pakken (niet doorheen lopen)
      ],
      overlays: [],
      fx: {
        // smidsvuur laait hoog op zodra de houtskool erin gegooid is (oven wordt zichtbaar hoger)
        forgeFlame: { flag: 'ovenStoked', x: 37, y: 199, h: 9, fade: 0.6 }
      },
      worldItems: [
        { item: 'nut', hotspot: 'nut', x: 116, y: 252, scale: 0.66, filter: 'brightness(0.72)' },        // noot bij het aambeeld/ijzer — op de grond extra donker (het icoon in de tas blijft licht)
        { item: 'mushroom', hotspot: 'mushroom', x: 230, y: 222, scale: 0.82, glowCol: '255,170,80' }   // bruin/oranje paddenstoelen bij de put — nog iets hoger + iets meer naar rechts
      ],
      npcs: [
        { id: 'squire', sprite: 'squire', sway: true, filter: 'brightness(0.78) saturate(0.92)', x: 486, y: 284, scale: 1.18, flip: true },   // schildknaap iets groter; beweegt net als de poortwacht uit Deel 1 (rustige doorlopende wieg + lichte ademhaling)
        { id: 'courtyardRaven', sprite: 'ravenPerch', x: 292, y: 95, scale: 0.95, flip: false, peck: true, peckAmt: 0.4, hideFlag: 'ravenInBucket' }   // de raaf op het dakje van de put — gespiegeld (kijkt naar rechts) + 3px lager; springt de emmer in zodra je de munt geeft
      ],
      hotspots: [
        {
          id: 'squire',
          name: { nl: 'De Schildknaap', en: 'The Squire' },
          rect: { x: 456, y: 184, w: 70, h: 104 },
          walkTo: { x: 452, y: 300 },
          look: (state) => state.flags.squireGaveRope
            ? { nl: 'De schildknaap knikt naar het zwaard aan je zij. “Je hebt het zwaard van Sir Aldric weer heel gesmeed — knap werk. Met dat touw bereik je wat in de oude put verloren ging.”', en: 'The squire nods at the sword at your side. “You forged Sir Aldric’s sword whole again — fine work. With that rope you can reach what was lost in the old well.”' }
            : state.flags.gotSword
            ? { nl: 'De schildknaap glundert om het herstelde zwaard. “Prachtig gesmeed! Hier — een stevig touw. Dat heb je vast nodig bij de oude put.”', en: 'The squire beams at the reforged sword. “Beautifully forged! Here — a sturdy rope. You’ll want it at the old well.”' }
            : state.flags.swordForged
            ? { nl: 'De schildknaap wijst trots naar de markttent. “Het zwaard van Sir Aldric — weer heel! Pak het gerust, het is van jou.”', en: 'The squire points proudly at the market tent. “Sir Aldric’s sword — whole again! Take it, it’s yours.”' }
            : state.flags.squireGaveSword
            ? { nl: 'De schildknaap wijst naar de smidse. “Smeed het zwaard van de held: gooi eerst houtskool in de oven zodat het vuur hoog oplaait, leg dán het gebroken zwaard op het ijzer, en sla het met de hamer weer heel. De hamer ligt verborgen in de sokkel van zijn standbeeld, houtskool tussen de bloemen.”', en: 'The squire points at the smithy. “Forge the hero’s sword: first throw charcoal in the oven so the fire roars up, then lay the broken sword on the iron, and strike it whole with the hammer. The hammer lies hidden in the plinth of his statue, charcoal among the flowers.”' }
            : { nl: 'Een jonge schildknaap in een blauw wapenkleed houdt de wacht bij de koude smidse. Hij knikt je vriendelijk toe. “De koning ontvangt niemand meer, niet sinds de oude held viel — Sir Aldric, de Leeuw van Eldoria, de grootvader van de prinses. Zijn zwaard brak in tweeën en het hele kasteel verstomde van rouw.” Hij overhandigt je de twee stukken van het gebroken zwaard. “Smeed het bij de smidse weer heel — jij bent er klaar voor. Als het zwaard klaar is, krijg je van mij een touw.”', en: 'A young squire in a blue tabard keeps watch by the cold smithy. He gives you a friendly nod. “The king sees no one anymore, not since the old hero fell — Sir Aldric, the Lion of Eldoria, the princess’s grandfather. His sword broke in two and the whole castle fell silent with grief.” He hands you the two pieces of the broken sword. “Forge it whole at the smithy — you’re ready for it. Once the sword is done, I’ll give you a rope.”' },
          givesWhen: [
            { flag: 'metSquire', setFlag: 'squireGaveSword', item: 'swordBroken',
              giveText: { nl: 'De schildknaap legt het gebroken zwaard van Sir Aldric — beide stukken — in je handen. “Smeed het weer heel bij de smidse: houtskool in de oven, het zwaard op het ijzer, en dan de hamer. Als het klaar is, krijg je van mij een touw. Veel succes, vriend.”', en: 'The squire places Sir Aldric’s broken sword — both pieces — into your hands. “Forge it whole at the smithy: charcoal in the oven, the sword on the iron, then the hammer. Once it’s done, I’ll give you a rope. Good luck, friend.”' } },
            { flag: 'gotSword', setFlag: 'squireGaveRope', item: 'rope', consume: 'sword',
              giveText: { nl: 'De schildknaap neemt het herstelde zwaard van Sir Aldric eerbiedig van je aan. “Sir Aldric zou trots zijn — ik bewaar het veilig. Zoals beloofd: hier is het touw. Daarmee bereik je wat in de oude put verloren ging.”', en: 'The squire reverently takes Sir Aldric’s reforged sword from you. “Sir Aldric would be proud — I’ll keep it safe. As promised: here is the rope. With it you can reach what was lost in the old well.”' } }
          ],
          setFlag: 'metSquire'
        },
        {
          id: 'takesword',
          name: { nl: 'Het Gesmede Zwaard', en: 'The Forged Sword' },
          rect: { x: 440, y: 184, w: 50, h: 64 },
          walkTo: { x: 436, y: 300 },
          appearFlag: 'swordForged',
          hideFlag: 'gotSword',
          look: { nl: 'Het weer hele zwaard van Sir Aldric staat te glanzen tegen de markttent. Pak het op!', en: 'Sir Aldric’s reforged sword gleams against the market tent. Take it!' },
          givesWhen: {
            flag: 'swordForged',
            setFlag: 'gotSword',
            item: 'sword',
            giveText: { nl: 'Je pakt het weer hele zwaard van Sir Aldric op. Het lemmet glanst als nieuw en ligt perfect in je hand — een waardig wapen voor een held.', en: 'You take up Sir Aldric’s reforged sword. The blade gleams like new and sits perfectly in your hand — a weapon worthy of a hero.' }
          }
        },
        {
          id: 'well',
          name: { nl: 'De Oude Put', en: 'The Old Well' },
          rect: { x: 224, y: 150, w: 120, h: 108 },
          walkTo: { x: 286, y: 300 },
          look: (state) => state.flags.gotNecklace
            ? { nl: 'De oude put. Diep beneden klatert het donkere water. De ketting van de prinses heb je veilig omhoog gehesen.', en: 'The old well. Far below, dark water trickles. You’ve safely hauled up the princess’s necklace.' }
            : state.flags.ravenInBucket
            ? { nl: 'De raaf zit parmantig in de emmer, klaar voor de afdaling. Diep beneden glinstert iets in het donkere water. Laat de emmer voorzichtig zakken — maar het windwerk heeft eerst een touw nodig.', en: 'The raven perches proudly in the bucket, ready for the descent. Deep below, something glints in the dark water. Lower the bucket carefully — but the winch needs a rope first.' }
            : { nl: 'Een oude stenen put met een houten windwerk, maar zonder touw. Diep beneden, in het donkere water, ligt iets te glinsteren — te diep om er zelf bij te komen. Misschien kan iets (of iemand) kleins het halen?', en: 'An old stone well with a wooden winch, but no rope. Far below, in the dark water, something glints — too deep to reach yourself. Maybe something (or someone) small could fetch it?' },
          dialPuzzle: {
            requiresFlag: 'ravenInBucket',
            blockedText: { nl: 'De put is veel te diep om er zelf bij te komen. Lok eerst de raaf de emmer in met iets glimmends.', en: 'The well is far too deep to reach yourself. First lure the raven into the bucket with something shiny.' },
            needItem: 'rope',
            needText: { nl: 'Het windwerk heeft eerst een touw nodig om de emmer te kunnen laten zakken. Haal het touw bij de schildknaap.', en: 'The winch first needs a rope before it can lower the bucket. Get the rope from the squire.' },
            depth: 8,
            title: { nl: 'Laat de Raaf Zakken', en: 'Lower the Raven' },
            hint: { nl: 'Klik ⟳ Laten zakken precies als de emmer in het midden hangt — alles kleurt dan GROEN. Rood = wachten! Hoe dieper, hoe wilder het slingeren.', en: 'Press ⟳ Lower exactly when the bucket hangs in the middle — everything turns GREEN. Red = wait! The deeper you go, the wilder the swing.' },
            setFlag: 'gotNecklace',
            consume: 'rope',
            give: 'necklace',
            solvedText: { nl: 'PLONS — de emmer raakt zachtjes het water! De raaf duikt met zijn snavel tussen de rimpels en grist de glinsterende ketting van de bodem. Je draait de hendel terug omhoog; krakend komt de emmer boven, met de raaf erin, trots, een fijne gouden ketting met blauwe edelsteen in zijn snavel! Hij laat hem in je hand vallen, kraait tevreden en vliegt met een laatste “kraa!” weg over de kasteelmuur. Zo’n sieraad hoort vast bij iemand van het hof... de prinses misschien?', en: 'SPLASH — the bucket gently touches the water! The raven dips his beak between the ripples and snatches the glittering necklace from the bottom. You crank the handle back up; creaking, the bucket rises, the raven inside, proud, a fine gold necklace with a blue gem in his beak! He drops it into your hand, caws contentedly and, with a last “caw!”, flies off over the castle wall. A jewel like this surely belongs to someone at court... the princess, perhaps?' },
            resetText: { nl: 'ZOEF! Het touw slipt — de emmer schiet weer omhoog. Klik alleen als alles GROEN kleurt.', en: 'WHIZZ! The rope slips — the bucket shoots back up. Only click when everything turns GREEN.' }
          }
        },
        {
          id: 'crow',
          name: { nl: 'De Raaf', en: 'The Raven' },
          rect: { x: 258, y: 56, w: 70, h: 64 },              // de glanzende raaf op het dakje van de put
          walkTo: { x: 286, y: 300 },
          hideFlag: 'ravenInBucket',                          // zodra je de munt geeft, springt de raaf de emmer in (verdwijnt van het dakje)
          look: (state) => state.inventory.includes('trinket')
            ? { nl: 'De grote, glanzende raaf op het put-dakje gluurt hongerig naar de bronzen munt in je tas. Geef hem de munt — misschien helpt hij je dan iets uit de diepte op te halen.', en: 'The big glossy raven on the well roof eyes the bronze coin in your bag hungrily. Give him the coin — perhaps he’ll help fetch something from the deep.' }
            : { nl: 'Een grote, glanzende zwarte raaf zit op het dakje van de put en bekijkt je met glinsterende oogjes. Hij gluurt steeds naar je tas — alsof hij iets glimmends ruikt. Raven zijn dol op glanzende dingen. Had je maar iets blinkends om hem te lokken...', en: 'A big, glossy black raven sits on the well roof, eyeing you with glittering eyes. He keeps peeking at your bag — as if he smells something shiny. Ravens love bright things. If only you had something gleaming to tempt him...' },
          use: {
            trinket: {
              consume: 'trinket',
              setFlag: 'ravenInBucket',
              text: { nl: 'Je houdt de bronzen munt omhoog. De raaf kan zich niet inhouden — hij grist hem uit je hand, kraait “Kraa!” van plezier en springt met munt en al boven op de put-emmer. Met een vrolijk gekras laat hij zich de donkere schacht in zakken... Nu hoef je de emmer alleen nog op te hijsen. Had je maar een touw!', en: 'You hold up the bronze coin. The raven can’t resist — he snatches it from your hand, caws “Caw!” with delight and hops onto the well bucket, coin and all. With a cheerful cackle he lowers himself down the dark shaft... Now you only need to haul the bucket up. If only you had a rope!' }
            }
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
          look: (state) => (state.flags.swordForged || state.flags.gotSword)
            ? { nl: 'De smidse van het kasteel. De oven gloeit warm na — hier smeedde je het zwaard van Sir Aldric weer heel.', en: 'The castle smithy. The oven still glows warm — here you forged Sir Aldric’s sword whole again.' }
            : state.flags.ovenStoked
            ? { nl: 'De oven loeit wit-heet van de houtskool, met het aambeeld en het ijzer ervoor. Klik met de hamer (of met het gebroken zwaard) op het vuur om het zwaard te smeden.', en: 'The oven roars white-hot with charcoal, the anvil and iron before it. Click the fire with the hammer (or the broken sword) to forge the sword.' }
            : { nl: 'Een koude smidse onder een afdakje, met een aambeeld en een dode oven. Gooi er houtskool in om het smidsvuur aan te wakkeren.', en: 'A cold smithy under a lean-to, with an anvil and a dead oven. Throw in charcoal to kindle the forge fire.' },
          use: {
            charcoal: {
              consume: 'charcoal',
              setFlag: 'ovenStoked',
              burst: { x: 40, y: 188, col: '255,150,40', n: 34, up: 26, life: 1.4 },   // het smidsvuur laait fel op: warme vonkenregen
              text: { nl: 'Je gooit de houtskool op de sintels en blaast aan. WHOESH! Het smidsvuur laait fel op, wit-heet, en een regen van oranje vonken spat omhoog. Nu kun je het zwaard smeden — klik met de hamer op het vuur.', en: 'You throw the charcoal onto the embers and fan it. WHOOSH! The forge fire flares up fierce and white-hot, and a shower of orange sparks bursts upward. Now you can forge the sword — click the fire with the hammer.' }
            },
            // Smeden in één klik: hamer óf gebroken zwaard op het ijzer/vuur (oven moet heet zijn én je hebt allebei nodig)
            hammer: {
              needItem: 'swordBroken',
              needText: { nl: 'Je hebt eerst het gebroken zwaard van Sir Aldric nodig — vraag het de schildknaap bij de smidse.', en: 'You first need Sir Aldric’s broken sword — ask the squire by the smithy.' },
              requiresFlag: 'ovenStoked',
              requiresText: { nl: 'De oven is nog koud. Gooi er eerst houtskool in om het vuur wit-heet op te laten laaien.', en: 'The oven is still cold. First throw in charcoal to make the fire roar white-hot.' },
              consume: ['swordBroken', 'hammer'],
              give: 'sword',
              setFlag: 'gotSword',
              burst: { x: 44, y: 184, col: '255,210,120', n: 26, up: 20, life: 1.2 },
              text: { nl: 'Je loopt naar het ijzer, legt het gebroken zwaard in het wit-hete vuur en slaat met de smidshamer — KLANG! KLANG! De twee gloeiende stukken smelten weer samen. Met een sissende plons in de waterton koel je het af. Je legt de hamer terug bij de smidse en houdt het prachtige, weer hele zwaard van Sir Aldric in handen — breng het naar de schildknaap.', en: 'You step to the iron, lay the broken sword in the white-hot fire and strike with the blacksmith’s hammer — CLANG! CLANG! The two glowing pieces fuse back together. With a hissing plunge into the water trough you quench it. You set the hammer back down at the smithy and hold Sir Aldric’s beautiful, whole sword in your hands — bring it to the squire.' }
            },
            swordBroken: {
              needItem: 'hammer',
              needText: { nl: 'Je hebt de smidshamer nodig om te smeden. Die zit verborgen in het smidsbeeld in de tuin.', en: 'You need the blacksmith’s hammer to forge. It’s hidden in the smith statue in the garden.' },
              requiresFlag: 'ovenStoked',
              requiresText: { nl: 'De oven is nog koud. Gooi er eerst houtskool in om het vuur wit-heet op te laten laaien.', en: 'The oven is still cold. First throw in charcoal to make the fire roar white-hot.' },
              consume: ['swordBroken', 'hammer'],
              give: 'sword',
              setFlag: 'gotSword',
              burst: { x: 44, y: 184, col: '255,210,120', n: 26, up: 20, life: 1.2 },
              text: { nl: 'Je legt het gebroken zwaard in het wit-hete vuur en slaat het met de smidshamer — KLANG! KLANG! — weer heel. Met een sissende plons in de waterton koel je het af. Je legt de hamer terug bij de smidse en houdt het prachtige zwaard van Sir Aldric in handen — breng het naar de schildknaap.', en: 'You lay the broken sword in the white-hot fire and strike it whole with the hammer — CLANG! CLANG! With a hissing plunge into the water trough you quench it. You set the hammer back down at the smithy and hold Sir Aldric’s beautiful sword in your hands — bring it to the squire.' }
            }
          }
        },
        {
          id: 'nut',
          name: { nl: 'Een Noot', en: 'A Nut' },
          rect: { x: 96, y: 234, w: 44, h: 40 },
          walkTo: { x: 116, y: 256 },
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
          rect: { x: 210, y: 204, w: 46, h: 40 },
          walkTo: { x: 232, y: 288 },
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
          arrow: { x: 158, y: 142, dir: 'up' },
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
        { img: 'assets/art/scene-garden-open.jpg',   flag: 'secretGateOpen' },      // tuin3: geheime poort open (donkere doorgang in de linkermuur)
        { img: 'assets/art/scene-garden-hammer.jpg', flag: 'statuePuzzleSolved' }    // tuin2: hamer uit het ridderbeeld gehaald
      ],
      charFilter: 'saturate(1.06) brightness(1.05) sepia(0.06) contrast(1.03)',   // helder zonnig tuinlicht; lichte warmte zodat de figuren in de omgeving opgaan
      heroShade: 0.98,
      entryText: {
        nl: 'De ommuurde slottuin staat vol rozen en klimop. In het midden waakt een ridderbeeld; links klatert een leeuwenfontein, rechts staat een bankje onder een rozenboog. En daar — tussen de bloemen — wandelt de prinses.',
        en: 'The walled castle garden is full of roses and ivy. A knight statue watches at its centre; a lion fountain trickles to the left, a bench rests under a rose arbour to the right. And there — among the flowers — walks the princess.'
      },
      playerStart: { x: 284, y: 300 },                       // midden onderin de tuin
      spawnFrom: { courtyard: { x: 284, y: 300 } },
      depth: { far: 206, near: 316, sFar: 0.72, sNear: 1.05 },
      walkable: [
        { x: 30,  y: 252, w: 508, h: 62 },                 // voorgrond-pad over de hele breedte
        { x: 18,  y: 200, w: 198, h: 58 },                 // pad links (richting fontein) — hoger en meer naar links
        { x: 360, y: 200, w: 178, h: 58 }                  // pad rechts (richting bankje) — hoger
      ],
      obstacles: [
        { x: 198, y: 168, w: 174, h: 92 },                 // de ronde bloemenperk-ring met het ridderbeeld — niet doorheen lopen
        { x: 0,   y: 248, w: 150, h: 72 },                 // de stenen bloembak (urn) linkerhoek — tot de linkerrand, nog meer ruimte erboven geblokkeerd
        { x: 418, y: 248, w: 150, h: 72 }                  // de stenen bloembak (urn) rechterhoek — tot de rechterrand, nog meer ruimte erboven geblokkeerd
      ],
      overlays: [
        { img: 'assets/art/keyhole.png', x: 130, y: 168, base: 240, scale: 0.7, appearFlag: 'fountainSolved', hideFlag: 'secretGateOpen' }   // sleutelgat in de muur rechts van de fontein — precies waar de geheime deur opengaat
      ],
      worldItems: [
        { item: 'charcoal', hotspot: 'charcoal', x: 352, y: 216, scale: 1.12, glowCol: '255,140,55', embers: 0.6 },   // houtskool rechts van het standbeeld; kleiner, met zachtere oplichtende sintels
        { item: 'trinket', hotspot: 'trinket', x: 72, y: 182, scale: 0.74, gem: true, glintOnly: true, glintScale: 0.48, glintWide: 1.55, glowCol: '255,210,130' }   // bronzen munt onder water: alleen de glinstering, 2px hoger, iets kleiner maar breder (platter over het water)
      ],
      npcs: [
        { id: 'princess', sprite: 'princess', sway: 0.020, filter: 'brightness(0.78) saturate(0.92)', flip: true, x: 424, y: 250, scale: 1.0 },   // prinses; zelfde afbeelding, iets compacter (kleinere schaal); zelfde wieg als de wachter maar subtieler
        { id: 'gardenParrot', sprite: 'parrot', x: 508, y: 204, scale: 0.42, flip: true, peck: true, peckAmt: 0.35, filter: 'brightness(0.95) saturate(0.95)' }   // gedetailleerde groene pixel-art papagaai op het bankje — kleiner en iets hoger
      ],
      fx: {
        // lopend water: de leeuwenkop spuwt een straaltje in het schelpbekken (stopt zodra de geheime poort open is)
        fountain: { jets: [{ sx: 65, sy: 155 }, { sx: 67, sy: 156 }], len: 25, wx: 66, wy: 182 }   // water blijft altijd stromen (geen hideFlag meer)
      },
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
              { label: { nl: 'Gaat het wel met je?', en: 'Are you alright?' },
                text: { nl: 'Haar glimlach verflauwt. “Eerlijk gezegd... niet helemaal. Ik ben iets dierbaars kwijt — de gouden ketting van mijn moeder. Hij gleed van mijn hals, diep de oude put op de binnenplaats in. Ik zou er álles voor geven om hem terug te zien.”', en: 'Her smile fades. “Honestly... not quite. I’ve lost something dear — my mother’s gold necklace. It slipped from my neck, deep down the old well in the courtyard. I’d give anything to see it again.”' } },
              { label: { nl: 'Mijn vader', en: 'My father' },
                text: { nl: 'Je vertelt zacht dat je vader ergens diep in het kasteel gevangen wordt gehouden. Ze knijpt even in je hand. “Wees voorzichtig, Finn. Ik wou dat ik je kon helpen, maar de burcht zit potdicht — er is geen weg naar binnen die ik ken.”', en: 'You tell her softly that your father is held captive somewhere deep in the castle. She squeezes your hand. “Be careful, Finn. I wish I could help you, but the keep is sealed tight — there’s no way in that I know of.”' } },
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
          name: { nl: 'De Leeuwenkop', en: 'The Lion’s Head' },
          rect: { x: 26, y: 102, w: 66, h: 64 },              // alleen de leeuwen-/drakenkop (+ sleutelgat): hierop klikken opent de puzzel; het bekken eronder is voor de munt — klikveld iets hoger
          walkTo: { x: 96, y: 244 },
          hideFlag: 'secretGateOpen',                         // zodra de poort open is, neemt de geheime-poort-hotspot het over
          look: (state) => state.flags.fountainSolved
            ? { nl: 'De leeuwenkop spuwt nog water — en in de muur rechts van de fontein is nu een ijzeren sleutelgat verschenen. Het wacht op de juiste sleutel.', en: 'The lion’s head still spouts water — and in the wall to the right of the fountain an iron keyhole has appeared. It waits for the right key.' }
            : { nl: 'Een stenen leeuwenkop spuwt water in een schelpvormig bekken. Op de bodem ligt, vertroebeld door het water, een stenen wapen-mozaïek dat in losse stukken is geschoven. Schuif de stukken weer op hun plaats om te zien wat het in beweging zet.', en: 'A stone lion spouts water into a shell-shaped basin. On the floor, blurred by the water, lies a stone crest-mosaic shuffled into loose pieces. Slide them back into place to see what it sets in motion.' },
          slidePuzzle: {
            size: 3,
            img: 'assets/art/puzzle-fountain.jpg',
            title: { nl: 'Het Wapen in de Fontein', en: 'The Crest in the Fountain' },
            setFlag: 'fountainSolved',
            burst: { x: 60, y: 150 },
            solvedText: { nl: 'Het mozaïek klikt compleet op zijn plaats — het wapen van Sir Aldric, de Leeuw van Eldoria. In de muur rechts van de fontein schuift met een steenachtig gerommel een paneel opzij, en daar verschijnt een ijzeren sleutelgat, diep in de steen verzonken. Waar zou de sleutel ervan op liggen?', en: 'The mosaic clicks complete — the arms of Sir Aldric, the Lion of Eldoria. In the wall to the right of the fountain a panel grinds aside, revealing an iron keyhole set deep into the stone. Where might its key be?' }
          },
          use: {
            key: {
              requiresFlag: 'fountainSolved',
              requiresText: { nl: 'Er is hier nog geen slot te zien. Los eerst de schuifpuzzel in de fontein op.', en: 'There’s no lock to be seen here yet. Solve the fountain’s sliding puzzle first.' },
              puzzleFallback: true,                          // sleutel vasthouden vóór het slot er is? -> open dan gewoon de schuifpuzzel
              keep: false,
              consume: 'key',
              setFlag: 'secretGateOpen',
              text: { nl: 'Je steekt de oude sleutel in het slot in de muur en draait. Met een diepe, knarsende dreun schuift een hele muurpartij opzij — de geheime poort gaat open! Een koele, donkere gang gaapt erachter, diep het kasteel in.', en: 'You slide the old key into the lock in the wall and turn. With a deep, grinding boom a whole section of wall slides aside — the secret gate opens! A cool, dark passage gapes beyond, deep into the castle.' }
            }
          }
        },
        {
          id: 'wallLock',
          name: { nl: 'Het Sleutelgat', en: 'The Keyhole' },
          rect: { x: 108, y: 144, w: 46, h: 48 },
          walkTo: { x: 132, y: 244 },
          appearFlag: 'fountainSolved',
          hideFlag: 'secretGateOpen',
          look: { nl: 'Een ijzeren sleutelgat, diep in de muur verzonken. Het wacht op de juiste sleutel.', en: 'An iron keyhole set deep into the wall. It waits for the right key.' },
          use: {
            key: {
              keep: false,
              consume: 'key',
              setFlag: 'secretGateOpen',
              text: { nl: 'Je steekt de oude sleutel in het slot in de muur en draait. Met een diepe, knarsende dreun schuift een hele muurpartij opzij — de geheime poort gaat open! Een koele, donkere gang gaapt erachter, diep het kasteel in.', en: 'You slide the old key into the lock in the wall and turn. With a deep, grinding boom a whole section of wall slides aside — the secret gate opens! A cool, dark passage gapes beyond, deep into the castle.' }
            }
          }
        },
        {
          id: 'secretGate',
          name: { nl: 'De Geheime Poort', en: 'The Secret Gate' },
          rect: { x: 104, y: 116, w: 62, h: 106 },
          walkTo: { x: 132, y: 244 },
          appearFlag: 'secretGateOpen',                      // verschijnt pas nadat de sleutel het slot opent
          arrow: { x: 134, y: 162, dir: 'up' },
          exit: { to: 'library', travelText: { nl: 'Je stapt door de open geheime poort naast de leeuwenfontein. Een koele, donkere gang loopt diep het kasteel in en komt uit in een stille, stoffige bibliotheek vol oude boeken...', en: 'You step through the open secret gate beside the lion fountain. A cool, dark passage runs deep into the castle and opens into a quiet, dusty library full of ancient books...' } }
        },
        {
          id: 'gstatue',
          name: { nl: 'Het Beeld van de Smid', en: 'The Statue of the Smith' },
          rect: { x: 232, y: 90, w: 96, h: 150 },
          walkTo: { x: 286, y: 296 },
          look: (state) => state.flags.statuePuzzleSolved
            ? { nl: 'Het vakje onder in de sokkel staat open en leeg — de zware smidshamer van de oude held zit nu in je tas. Tijd om het zwaard te smeden bij de smidse.', en: 'The niche in the base of the plinth stands open and empty — the old hero’s heavy hammer is in your bag now. Time to forge the sword at the smithy.' }
            : state.flags.gotSmithPhrase
            ? { nl: 'Het bronzen beeld van de smid bij zijn aambeeld. In de sokkel zijn woorden gebeiteld — klik de geheime woorden van de smid aan in de juiste volgorde.', en: 'The bronze statue of the smith at his anvil. Words are carved into the plinth — click the smith’s secret words in the right order.' }
            : { nl: 'Een bronzen beeld van een smid bij zijn aambeeld. In de sokkel zijn allerlei woorden gebeiteld. Je moet de juiste geheime woorden aanklikken — maar welke, en in welke volgorde? Wie zou dat weten?', en: 'A bronze statue of a smith at his anvil. All sorts of words are carved into the plinth. You must click the right secret words — but which ones, and in what order? Who might know?' },
          symbolPuzzle: {
            img: 'assets/art/puzzle-words.jpg',
            title: { nl: 'De Geheime Woorden van de Smid', en: 'The Smith’s Secret Words' },
            hint: { nl: 'Klik de geheime spreuk van de smid woord voor woord aan, in de juiste volgorde. Veel woorden zijn afleiders. Weet je de spreuk niet? Vraag het de papagaai in de tuin.', en: 'Click the smith’s secret saying word by word, in the right order. Many words are decoys. Don’t know the saying? Ask the parrot in the garden.' },
            zones: [
              { key: 'rust',   left: 1,  top: 3,  width: 23, height: 22 },
              { key: 'fire',   left: 26, top: 3,  width: 23, height: 22 },
              { key: 'gold',   left: 51, top: 3,  width: 23, height: 22 },
              { key: 'true',   left: 76, top: 3,  width: 23, height: 22 },
              { key: 'steel',  left: 1,  top: 28, width: 23, height: 22 },
              { key: 'water',  left: 26, top: 28, width: 23, height: 22 },
              { key: 'forges', left: 51, top: 28, width: 23, height: 22 },
              { key: 'moon',   left: 76, top: 28, width: 23, height: 22 },
              { key: 'ice',    left: 1,  top: 53, width: 23, height: 22 },
              { key: 'king',   left: 26, top: 53, width: 23, height: 22 },
              { key: 'only',   left: 51, top: 53, width: 23, height: 22 },
              { key: 'stone',  left: 76, top: 53, width: 23, height: 22 },
              { key: 'wood',   left: 1,  top: 78, width: 23, height: 22 },
              { key: 'silver', left: 26, top: 78, width: 23, height: 22 },
              { key: 'smoke',  left: 51, top: 78, width: 23, height: 22 },
              { key: 'glass',  left: 76, top: 78, width: 23, height: 22 }
            ],
            symbols: [
              { key: 'only',   label: { nl: 'Only',   en: 'Only'   } },
              { key: 'fire',   label: { nl: 'Fire',   en: 'Fire'   } },
              { key: 'forges', label: { nl: 'Forges', en: 'Forges' } },
              { key: 'true',   label: { nl: 'True',   en: 'True'   } },
              { key: 'steel',  label: { nl: 'Steel',  en: 'Steel'  } }
            ],
            sequence: ['only', 'fire', 'forges', 'true', 'steel'],
            setFlag: 'statuePuzzleSolved',
            give: 'hammer',
            solvedText: { nl: 'De woorden lichten één voor één op — ONLY... FIRE... FORGES... TRUE... STEEL! Met een steenachtig gerommel schuift een vakje in de sokkel open. Daarin ligt de zware smidshamer van de oude held! Je neemt hem mee. Hiermee kun je bij de smidse zijn zwaard weer smeden.', en: 'The words light up one by one — ONLY... FIRE... FORGES... TRUE... STEEL! With a stony rumble a niche slides open in the plinth. Inside lies the old hero’s heavy blacksmith’s hammer! You take it. With this you can forge his sword again at the smithy.' },
            resetText: { nl: 'De woorden doven. Verkeerde volgorde — begin opnieuw. (Vraag de papagaai naar de spreuk.)', en: 'The words go dark. Wrong order — start over. (Ask the parrot for the saying.)' },
            doneText: { nl: 'Het vakje is open en leeg; de hamer zit in je tas.', en: 'The niche is open and empty; the hammer is in your bag.' }
          }
        },
        {
          id: 'parrot',
          name: { nl: 'De Papagaai', en: 'The Parrot' },
          rect: { x: 482, y: 172, w: 66, h: 66 },
          walkTo: { x: 486, y: 244 },
          choice: {
            prompt: { nl: 'De papagaai legt zijn kopje scheef. “Krrak! Wil je iets weten?”', en: 'The parrot tilts his head. “Squawk! Want to know something?”' },
            options: [
              { label: { nl: 'Wie ben jij?', en: 'Who are you?' },
                text: { nl: '“Krrak! Ik ben de oudste papagaai van Eldoria. Ik zit hier al langer dan de koning regeert — en ik vergeet níets!”', en: '“Squawk! I’m the oldest parrot in Eldoria. I’ve perched here longer than the king has reigned — and I forget nothing!”' } },
              { label: { nl: 'Heb je nieuws voor me?', en: 'Any news for me?' },
                setFlag: 'parrotToldEntrance',
                text: { nl: '“Krrak! Nieuws? Hihí... Ik klap uit de school: áchter de leeuwenfontein in de tuin zit een geheime ingang, diep het kasteel in! Niemand weet ervan — behalve ik. Maar er zit vast een goed slot op, krrak.”', en: '“Squawk! News? Hehe... Let me spill a secret: behind the lion fountain in the garden there’s a hidden entrance, deep into the castle! No one knows of it — except me. But it surely has a good lock on it, squawk.”' } },
              { label: { nl: 'Het geheim van de smid?', en: 'The smith’s secret?' },
                text: (state) => state.flags.gotSmithPhrase
                  ? { nl: '“Krrak! De spreuk van de smid: ONLY... FIRE... FORGES... TRUE... STEEL! In díe volgorde!”', en: '“Squawk! The smith’s saying: ONLY... FIRE... FORGES... TRUE... STEEL! In that order!”' }
                  : { nl: '“Krrak! Een hongerige vogel praat niet. Geef me een noot — er ligt er een bij het aambeeld op het plein — en ik fluister de geheime spreuk van de smid.”', en: '“Squawk! A hungry bird won’t talk. Give me a nut — there’s one by the anvil in the courtyard — and I’ll whisper the smith’s secret saying.”' } },
              { label: { nl: 'Dag papagaai', en: 'Bye, parrot' },
                text: { nl: '“Krrak! Tot kijk!” Hij schudt vrolijk zijn veren.', en: '“Squawk! See you!” He ruffles his feathers happily.' } }
            ]
          },
          look: { nl: 'Een kleurrijke groene papagaai zit op het bankje en bekijkt je nieuwsgierig met scheef kopje. Hij lijkt graag te kletsen.', en: 'A colourful green parrot perches on the bench, eyeing you with a curious tilt of the head. He seems to love a chat.' },
          use: {
            nut: {
              consume: 'nut',
              setFlag: 'gotSmithPhrase',
              text: { nl: 'Je geeft de papagaai de noot. Hij kraakt hem behendig open, smult ervan, en kwettert dan de geheime spreuk van de smid: “Krrak! ONLY... FIRE... FORGES... TRUE... STEEL! In díe volgorde!” Je prent de vijf woorden in je geheugen — klik ze in díe volgorde aan bij het smidsbeeld. (Klik op de papagaai om de spreuk nog eens te horen.)', en: 'You give the parrot the nut. He cracks it open deftly, gobbles it up, and then chatters the smith’s secret saying: “Squawk! ONLY... FIRE... FORGES... TRUE... STEEL! In that order!” You commit the five words to memory — click them in that order at the smith statue. (Click the parrot to hear the saying again.)' }
            }
          }
        },
        {
          id: 'charcoal',
          name: { nl: 'Houtskool', en: 'Charcoal' },
          rect: { x: 330, y: 196, w: 46, h: 44 },
          walkTo: { x: 352, y: 288 },
          hideFlag: 'taken_garden_charcoal',
          gives: {
            item: 'charcoal',
            giveText: { nl: 'Tussen de kleurige bloemen ligt, vreemd genoeg, een hoopje zwarte houtskool met nog gloeiende sintels te glinsteren — alsof hier ooit een vuur heeft gebrand. Je raapt het op. Hier kan een smid vast iets mee.', en: 'Among the colourful flowers, oddly enough, a little heap of black charcoal with still-glowing embers glints — as if a fire once burned here. You pick it up. A smith could surely use this.' },
            emptyText: { nl: 'De houtskool zit al in je tas.', en: 'The charcoal is already in your bag.' }
          }
        },
        {
          id: 'trinket',
          name: { nl: 'Iets glimmends in de fontein', en: 'Something shiny in the fountain' },
          rect: { x: 50, y: 180, w: 44, h: 28 },
          walkTo: { x: 96, y: 244 },
          hideFlag: 'taken_garden_trinket',
          gives: {
            item: 'trinket',
            giveText: { nl: 'Op de bodem van het schelpbekken ligt iets te glinsteren onder het kabbelende water — een glanzende bronzen munt! Je vist hem eruit. Zoiets glimmends... daar is een raaf vast dol op.', en: 'On the floor of the shell basin something glints beneath the rippling water — a gleaming bronze coin! You fish it out. Something this shiny... a raven would surely love it.' },
            emptyText: { nl: 'De bronzen munt zit al in je tas.', en: 'The bronze coin is already in your bag.' }
          }
        },
        {
          id: 'bench',
          name: { nl: 'Het Bankje', en: 'The Bench' },
          rect: { x: 470, y: 148, w: 92, h: 82 },
          walkTo: { x: 486, y: 244 },
          look: {
            nl: 'Een verweerd houten bankje onder een boog van klimrozen. Een fijne plek om samen te zitten... als je dapper genoeg bent om het te vragen.',
            en: 'A weathered wooden bench under an arch of climbing roses. A fine place to sit together... if you’re brave enough to ask.'
          }
        },
        {
          id: 'toCourtyard',
          name: { nl: 'Terug naar de Binnenplaats', en: 'Back to the Courtyard' },
          rect: { x: 148, y: 260, w: 150, h: 56 },
          walkTo: { x: 200, y: 306 },
          arrow: { x: 200, y: 282, dir: 'down' },
          exit: { to: 'courtyard', travelText: { nl: 'Je loopt de tuin weer uit, terug naar de binnenplaats.', en: 'You leave the garden, back to the courtyard.' } }
        }
      ]
    },

    library: {
      name: { nl: 'De Kasteelbibliotheek', en: 'The Castle Library' },
      bg: 'assets/art/scene-library.jpg',
      bgVariants: [
        { img: 'assets/art/scene-library-night.jpg', flag: 'eclipseActive' }   // de zonsverduistering-spreuk dooft de zon: nacht + eclips door het raam
      ],
      charFilter: 'saturate(1.02) brightness(0.88) sepia(0.14) contrast(1.04)',   // warm kaarslicht, wat donkerder zodat de figuren in de schemerige zaal opgaan
      heroShade: 0.8,
      entryText: {
        nl: 'De geheime gang komt uit in een stille kasteelbibliotheek. Hoge boekenkasten reiken tot het plafond, bij het grote raam staat een koperen telescoop, en midden in de zaal gloeit een boek op een sierlijke lessenaar. Een oude tovenaar tuurt erin, en op de vensterbank zit... de raaf!',
        en: 'The secret passage opens into a quiet castle library. Tall bookcases rise to the ceiling, a brass telescope stands by the great window, and in the middle of the hall a book glows on an ornate lectern. An old wizard peers into it, and on the windowsill sits... the raven!'
      },
      playerStart: { x: 300, y: 298 },
      spawnFrom: { garden: { x: 300, y: 298 } },
      depth: { far: 210, near: 316, sFar: 0.80, sNear: 1.16 },   // Finn wat groter in de zaal
      walkable: [
        { x: 64, y: 250, w: 440, h: 58 },                  // open vloer/tapijt voor de lessenaar
        { x: 150, y: 224, w: 280, h: 30 }                  // smalle strook richting de lessenaar
      ],
      obstacles: [
        { x: 308, y: 206, w: 48, h: 50 },                  // de lessenaar zelf
        { x: 416, y: 244, w: 118, h: 60 }                  // de altaar-sokkel met het zonnestelsel — niet doorheen lopen
      ],
      overlays: [],
      fx: {},
      npcs: [
        { id: 'librarian', sprite: 'librarian', x: 210, y: 252, scale: 1.14, sway: 0.018, flip: true, filter: 'brightness(0.74) saturate(0.9)' },   // de oude tovenaar — iets groter, met meer schaduw
        { id: 'libRaven', sprite: 'ravenPerch', x: 364, y: 156, scale: 0.82, flip: false, peck: true, peckAmt: 0.3 }                               // de raaf op de vensterbank — groter, iets meer rechts en lager
      ],
      worldItems: [],
      hotspots: [
        {
          id: 'toGardenLib',
          name: { nl: 'Terug naar de Tuin', en: 'Back to the Garden' },
          rect: { x: 6, y: 250, w: 92, h: 62 },
          walkTo: { x: 70, y: 300 },
          arrow: { x: 80, y: 268, dir: 'down' },
          exit: { to: 'garden', travelText: { nl: 'Je sluipt de gang weer door, terug naar de slottuin.', en: 'You slip back through the passage, into the castle garden.' } }
        },
        {
          id: 'libRaven',
          name: { nl: 'De Raaf', en: 'The Raven' },
          rect: { x: 338, y: 118, w: 42, h: 58 },
          walkTo: { x: 344, y: 252 },
          look: (state) => state.flags.gotInvisSpell
            ? { nl: '\u201CKrra! Goed gedaan, kleine tovenaar. De sterren vergeten jou niet.\u201D De raaf buigt plechtig zijn kopje.', en: '\u201CCaw! Well done, little wizard. The stars will not forget you.\u201D The raven bows his head solemnly.' }
            : state.flags.sawStars
            ? { nl: '\u201CKrra! Je z\u00E1g ze, h\u00E8 \u2014 de drie tekens tussen de sterren! Zet ze op het sterren-altaar daar rechts, alle drie in het gouden vakje.\u201D', en: '\u201CCaw! You SAW them \u2014 the three signs among the stars! Set them on the star altar to the right, all three in the golden box.\u201D' }
            : state.flags.eclipseActive
            ? { nl: '\u201CKrra! De zon is gedoofd \u2014 kijk N\u00DA door de telescoop, voordat het licht terugkeert!\u201D', en: '\u201CCaw! The sun is dark \u2014 look through the telescope NOW, before the light returns!\u201D' }
            : state.flags.gotEclipseSpell
            ? { nl: '\u201CKrra! Je hebt de spreuk! Tik hem aan in je tas en spreek hem uit \u2014 dan dooft de zon en tonen de sterren zich.\u201D', en: '\u201CCaw! You have the spell! Tap it in your bag and speak it \u2014 the sun will darken and the stars will show themselves.\u201D' }
            : state.flags.wizardTripping
            ? { nl: '\u201CKrra! Moet je hem zien zweven... Sn\u00E9l, kijk nu in het gloeiende boek \u2014 de spreuk van de zonsverduistering wacht op je!\u201D', en: '\u201CCaw! Look at him float... Quick, look in the glowing book now \u2014 the eclipse spell awaits you!\u201D' }
            : { nl: 'De raaf zit parmantig op de vensterbank. \u201CKrra! Die oude tovenaar wijkt geen duimbreed van dat boek... Maar ik weet w\u00E1t hij niet kan weerstaan: paddenstoelen! Van die glimmende, bij de oude put op de binnenplaats.\u201D', en: 'The raven perches proudly on the windowsill. \u201CCaw! That old wizard will not budge an inch from that book... But I know what he cannot resist: mushrooms! The shiny kind, by the old well in the courtyard.\u201D' }
        },
        {
          id: 'shelves',
          name: { nl: 'De Boekenkasten', en: 'The Bookcases' },
          rect: { x: 446, y: 36, w: 84, h: 118 },
          walkTo: { x: 404, y: 282 },
          look: { nl: 'Rijen op rijen eeuwenoude boeken: kronieken van Eldoria, sterrenkaarten, verboden spreukenboeken. Maar \u00E9\u00E9n boek, op de lessenaar, gloeit zachtjes \u2014 d\u00E1\u00E1r moet je zijn.', en: 'Rows upon rows of ancient tomes: chronicles of Eldoria, star charts, forbidden spellbooks. But one book, on the lectern, glows softly \u2014 that is the one you want.' }
        },
        {
          id: 'librarian',
          name: { nl: 'De Tovenaar', en: 'The Wizard' },
          rect: { x: 174, y: 140, w: 54, h: 122 },
          walkTo: { x: 168, y: 256 },
          look: (state) => state.flags.wizardTripping
            ? { nl: 'De oude tovenaar zweeft bijna. Hij staart met grote ogen naar het plafond en giechelt: \u201CDe sterren... de sterren d\u00E1nsen! Ik zie de hemelwielen draaien...\u201D Het gloeiende boek ziet hij allang niet meer.', en: 'The old wizard is practically floating. He stares wide-eyed at the ceiling and giggles: \u201CThe stars... the stars are DANCING! I can see the heavens turning...\u201D He has long forgotten the glowing book.' }
            : { nl: 'Een oude tovenaar met een lange grijze baard tuurt in het gloeiende boek. \u201CNiemand raakt de sterrenspreuken aan!\u201D bromt hij. Maar zijn neus snuffelt dromerig... alsof hij ergens naar hunkert. (De raaf op de vensterbank grinnikt: \u201CKrra... paddenstoelen!\u201D)', en: 'An old wizard with a long grey beard peers into the glowing book. \u201CNo one touches the star spells!\u201D he grumbles. But his nose sniffs dreamily... as if he craves something. (The raven on the sill snickers: \u201CCaw... mushrooms!\u201D)' },
          use: {
            mushroom: {
              consume: 'mushroom',
              setFlag: 'wizardTripping',
              text: { nl: 'Je geeft de tovenaar de glimmende paddenstoelen. Zijn ogen lichten op \u2014 h\u00F3p, in \u00E9\u00E9n keer naar binnen! Even is het stil... dan beginnen zijn pupillen te draaien als sterrenwielen. \u201COoooh... ik zie het hele heelal...\u201D giechelt hij, en hij danst wankelend tussen de boekenkasten. Het gloeiende boek is nu onbewaakt!', en: 'You hand the wizard the shiny mushrooms. His eyes light up \u2014 gulp, down in one! For a moment all is still... then his pupils start spinning like star-wheels. \u201COoooh... I can see the whole universe...\u201D he giggles, tottering off in a dance between the bookcases. The glowing book is unguarded!' }
            }
          }
        },
        {
          id: 'spelltome',
          name: { nl: 'Het Gloeiende Boek', en: 'The Glowing Book' },
          rect: { x: 228, y: 122, w: 92, h: 94 },
          walkTo: { x: 300, y: 256 },
          look: (state) => state.flags.gotEclipseSpell
            ? { nl: 'Het grote boek is uitgedoofd \u2014 de zonsverduistering-spreuk staat nu in jouw toverboek.', en: 'The great book has gone dark \u2014 the eclipse spell is now in your own spellbook.' }
            : state.flags.wizardTripping
            ? { nl: 'Het boek slaat vanzelf open bij een pagina vol sterren: de Spreuk van de Zonsverduistering! Pak hem nu de tovenaar in hogere sferen is.', en: 'The book falls open at a page full of stars: the Spell of the Solar Eclipse! Take it while the wizard is away with the stars.' }
            : { nl: 'Een groot boek op de lessenaar gloeit zacht. De tovenaar houdt het scherp in de gaten \u2014 je durft het niet aan te raken.', en: 'A great book on the lectern glows softly. The wizard watches it sharply \u2014 you dare not touch it.' },
          requiresFlag: 'wizardTripping',
          blockedText: { nl: '\u201CNiemand raakt de sterrenspreuken aan!\u201D snauwt de tovenaar. Zolang hij erbij is, kom je niet bij het boek. (De raaf fluistert: \u201CKrra... paddenstoelen, bij de put!\u201D)', en: '\u201CNo one touches the star spells!\u201D snaps the wizard. While he is watching you cannot reach the book. (The raven whispers: \u201CCaw... mushrooms, by the well!\u201D)' },
          gives: {
            item: 'eclipsspell',
            setFlag: 'gotEclipseSpell',
            giveText: { nl: 'Je legt je toverboek naast het gloeiende boek en de zilveren letters glijden over \u2014 de ZONSVERDUISTERING-SPREUK, \u201CUmbra Solis\u201D, schrijft zich in jouw boek! (Tik de spreuk aan in je tas om hem uit te spreken.)', en: 'You lay your spellbook beside the glowing book and the silver letters glide across \u2014 the SOLAR ECLIPSE SPELL, \u201CUmbra Solis\u201D, writes itself into your book! (Tap the spell in your bag to speak it.)' },
            emptyText: { nl: 'Het boek is uitgedoofd; de spreuk staat al in jouw toverboek.', en: 'The book has gone dark; the spell is already in your spellbook.' }
          }
        },
        {
          id: 'telescope',
          name: { nl: 'De Telescoop', en: 'The Telescope' },
          rect: { x: 382, y: 94, w: 58, h: 74 },
          walkTo: { x: 404, y: 252 },
          zoomImg: 'assets/art/telescope-view.jpg',
          zoomRequiresFlag: 'eclipseActive',
          zoomBlockedText: { nl: 'Je tuurt door de koperen telescoop, maar het felle daglicht verblindt alles \u2014 geen ster te zien. Alleen als de zon zou doven, zouden de sterren zich overdag tonen...', en: 'You peer through the brass telescope, but the bright daylight blinds everything \u2014 not a star in sight. Only if the sun went dark would the stars show themselves by day...' },
          setFlag: 'sawStars',
          look: { nl: 'Een prachtige koperen telescoop, gericht op de hemel boven het grote raam.', en: 'A beautiful brass telescope, aimed at the sky above the great window.' }
        },
        {
          id: 'altar',
          name: { nl: 'Het Sterren-Altaar', en: 'The Star Altar' },
          rect: { x: 418, y: 170, w: 114, h: 106 },
          walkTo: { x: 404, y: 282 },
          look: (state) => state.flags.gotInvisSpell
            ? { nl: 'Het altaar rust weer. De drie sterren-tekens gloeien zachtjes na in het steen.', en: 'The altar rests again. The three star signs glow faintly in the stone.' }
            : { nl: 'Een stenen altaar met drie schuifrijen vol vreemde tekens, en rechts drie gouden vakjes onder elkaar. Welke drie tekens horen daar? De sterren weten het antwoord...', en: 'A stone altar with three sliding rows of strange signs, and three golden boxes on the right. Which three signs belong there? The stars know the answer...' },
          starPuzzle: {
            requiresFlag: 'sawStars',
            blockedText: { nl: 'Drie rijen schuivende tekens en drie gouden vakjes... maar welke tekens horen erin? Je hebt geen idee \u2014 misschien staat het antwoord in de sterren geschreven.', en: 'Three rows of sliding signs and three golden boxes... but which signs belong there? You have no idea \u2014 perhaps the answer is written in the stars.' },
            img: 'assets/art/puzzle-altar.jpg',
            title: { nl: 'Het Sterren-Altaar', en: 'The Star Altar' },
            hint: { nl: 'Schuif elke rij (tik links of rechts van een rij) tot het teken uit de sterrenkaart in het gouden vakje staat.', en: 'Slide each row (tap left or right of a row) until the sign from the star chart sits in the golden box.' },
            rows: [
              { symbols: ['\u03A8', '\u03A9', '\u0394', '\u2644', '\u03A6'], start: 2 },
              { symbols: ['\u2643', '\u03A6', '\u03A8', '\u03A9', '\u0394'], start: 3 },
              { symbols: ['\u2644', '\u0394', '\u03A9', '\u2643', '\u03A8'], start: 1 }
            ],
            targets: ['\u03A8', '\u2643', '\u2644'],
            setFlag: 'gotInvisSpell',
            give: 'invisspell',
            win: true,
            solvedText: { nl: 'De drie sterren-tekens staan op \u00E9\u00E9n lijn en gloeien fel op! Het altaar zoemt, een geheime stenen lade schuift open... daarin ligt een zilveren bladzijde die zich meteen in je toverboek schrijft: de SPREUK VAN ONZICHTBAARHEID! Met de staf van je vader, het herstelde zwaard van Sir Aldric \u00E9n je nieuwe spreuken ben je klaar voor wat er dieper in het kasteel wacht... (wordt vervolgd in Deel 3)', en: 'The three star signs stand in one line and blaze with light! The altar hums, a secret stone drawer slides open... inside lies a silver page that writes itself straight into your spellbook: the SPELL OF INVISIBILITY! With your father\u2019s staff, Sir Aldric\u2019s reforged sword and your new spells, you are ready for whatever waits deeper in the castle... (to be continued in Part 3)' },
            doneText: { nl: 'Het altaar rust; de tekens gloeien zachtjes na.', en: 'The altar rests; the signs glow faintly.' }
          }
        }
      ]
    }

  }
};
