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
  assetVer: '147',

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
    librarian:     'assets/art/librarian.png',    // de warrige oude tovenaar in de kasteelbibliotheek (Deel 2)
    'librarian-trip1': 'assets/art/librarian-trip1.png',   // tovenaar in trance (paddenstoel-trip), frame 1
    'librarian-trip2': 'assets/art/librarian-trip2.png',   // tovenaar in trance (paddenstoel-trip), frame 2
    dungeonGuard:  'assets/art/dungeon-guard.png',   // de wachter in de kerker (Deel 2)
    father:        'assets/art/father.png'           // Finn's gevangen vader in de kerkercel (Deel 2)
  },
  heroWalkFrames: 16,           // loopanimatie uit /lopen 01-16 (alleen de écht-lopende frames)
  spriteDetail: 2,              // sprites zijn op 2x resolutie opgeslagen; engine tekent ze op halve maat = fijnere details

  /* Finn begint met de staf van zijn vader én — uit Deel 1 — zijn toverboek met de twee spreuken (dansende bloemen + draak). */
  startItems: ['staff', 'spellbook', 'spell', 'dragonspell'],
  /* Alle bladzijdes uit Deel 1 staan al in het boek: de kaart, de spreuk van dansende bloemen, het recept en de drakenspreuk. */
  startFlags: ['mapFiled', 'spellWritten', 'gotRecipe', 'dragonSpellLearned'],

  winText: {
    nl: 'Gefeliciteerd — je hebt DEEL 2 van Whispers of Ravenholt uitgespeeld! Je verzamelde drie spreuken, verduisterde de zon, sloop onzichtbaar langs de wachter én kraakte het kerkerslot — je vader is VRIJ! Samen op weg naar buiten... maar dat verhaal bewaren we voor DEEL 3. Knap gedaan, held — tot snel!',
    en: 'Congratulations — you have completed PART 2 of Whispers of Ravenholt! You gathered three spells, eclipsed the sun, slipped invisibly past the guard AND cracked the dungeon lock — your father is FREE! Together you head for the way out... but that tale we save for PART 3. Well done, hero — see you soon!'
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
    q_getsword: { nl: 'De schildknaap gaf je het gebroken zwaard van Sir Aldric. Smeed het weer heel bij de smidse: je hebt de hamer en houtskool nodig. De hamer zit in het smidsbeeld in de tuin — dat vraagt de geheime woorden van de smid. Geef de papagaai de pindanoot (ligt op het plein) en hij verklapt ze.', en: 'The squire gave you Sir Aldric’s broken sword. Forge it whole at the smithy: you need the hammer and charcoal. The hammer is in the smith statue in the garden — it asks for the smith’s secret words. Give the parrot the peanut (it lies in the courtyard) and he’ll reveal them.' },
    q_gethammer:{ nl: 'Voor de hamer: bij het smidsbeeld in de tuin moet je de geheime woorden van de smid aanklikken. Geef de papagaai de pindanoot (bij het aambeeld op het plein) — hij verklapt welke woorden, en in welke volgorde', en: 'For the hammer: at the smith statue in the garden you must click the smith’s secret words. Give the parrot the peanut (by the anvil in the courtyard) — he reveals which words, and in what order' },
    q_giveparrot:{ nl: 'Je hebt een pindanoot — geef hem aan de papagaai in de slottuin; hij verklapt de geheime woorden van de smid', en: 'You have a peanut — give it to the parrot in the garden; he reveals the smith’s secret words' },
    q_typephrase:{ nl: 'De papagaai verklapte de spreuk van de smid: ONLY · FIRE · FORGES · TRUE · STEEL. Klik die woorden in díe volgorde aan bij het smidsbeeld in de tuin om de hamer te krijgen', en: 'The parrot revealed the smith’s saying: ONLY · FIRE · FORGES · TRUE · STEEL. Click those words in that order at the smith statue in the garden to get the hammer' },
    q_getcoal:  { nl: 'Schep houtskool uit de rechter vuurkorf naast het smidsbeeld in de slottuin om het smidsvuur mee aan te wakkeren', en: 'Scoop charcoal from the right fire basket beside the smith statue in the garden to kindle the forge fire' },
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
    q_takespell:{ nl: 'De tovenaar zweeft in hogere sferen — bekijk het ZONNESTELSEL op de sokkel rechts en draai de hemelschijf: daar wacht de Zonsverduistering-spreuk', en: 'The wizard floats among the stars — examine the SOLAR SYSTEM on the pedestal to the right and turn the celestial disc: the Solar Eclipse spell awaits' },
    q_castEclipse:{ nl: 'Je hebt de Zonsverduistering-spreuk! Tik hem aan in je tas en spreek hem uit bij het grote raam van de bibliotheek', en: 'You have the Solar Eclipse spell! Tap it in your bag and speak it at the great library window' },
    q_telescope:{ nl: 'De zon is verduisterd en de sterren fonkelen — kijk snel door de telescoop bij het raam!', en: 'The sun is darkened and the stars sparkle — quick, look through the telescope by the window!' },
    q_readbook: { nl: 'De zon is verduisterd — boven het gloeiende boek zweeft het HEMELZEGEL! Tik het boek aan en onthoud precies hoe de drie schijven staan', en: 'The sun is eclipsed — the CELESTIAL SEAL hovers above the glowing book! Tap the book and remember exactly how the three discs stand' },
    q_altar:    { nl: 'Je zag het hemelzegel! Draai de drie schijven van het sterren-altaar precies zoals op het zegel (zon ☉ bovenaan) en trek aan de hendel — dan opent de geheime deur én wacht de onzichtbaarheidsspreuk', en: 'You saw the celestial seal! Turn the three discs of the star altar exactly as on the seal (sun ☉ at the top) and pull the lever — the secret door opens and the invisibility spell awaits' },
    q_dungeon:  { nl: 'De geheime deur staat open! Daal de trap af naar de kerker. Een wachter verspert de weg naar de gevangene — tik de onzichtbaarheidsspreuk aan om ongezien langs hem te sluipen', en: 'The secret door is open! Descend the stair to the dungeon. A guard blocks the way to the prisoner — tap the invisibility spell to slip past him unseen' },
    q_freefather:{ nl: 'Je bent onzichtbaar langs de wachter! Praat met de gevangene bij de tralies — hij fluistert de volgorde van het kerkerslot: zon, maan, ster... en het teken van zijn staf', en: 'You slipped past the guard unseen! Talk to the prisoner at the bars — he whispers the order of the dungeon lock: sun, moon, star... and the sign of his staff' },
    q_key:      { nl: 'De grendels zijn open! Pak nu MUISSTIL de sleutel van de wachttafel: trek alleen terwijl de wachter neuriet (♪) — hij kan je nog steeds horen', en: 'The bolts are open! Now take the key from the guard’s table SILENTLY: pull only while the guard hums (♪) — he can still hear you' },
    q_distract: { nl: 'Je hebt de sleutel! Maar de wachter staart recht naar de cel... Tokkel op de KETTINGEN bij de trap zodat hij zich omdraait', en: 'You have the key! But the guard stares straight at the cell... Pluck the CHAINS by the stairs so he turns around' },
    q_cellopen: { nl: 'De wachter kijkt de andere kant op — gebruik de celsleutel NU op de celdeur en bevrijd je vader!', en: 'The guard looks the other way — use the cell key on the cell door NOW and free your father!' },
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
             look: { nl: 'De onzichtbaarheidsspreuk uit het hemelzegel op het sterren-altaar. De letters lijken weg te vagen terwijl je kijkt... Spreek hem uit waar een bewaker je níet mag zien. (Tik de spreuk aan om hem uit te spreken.)', en: 'The invisibility spell from the celestial seal on the star altar. Its letters seem to fade away as you watch... Speak it where a guard must not see you. (Tap the spell to cast it.)' } },
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
    cellkey: { name: { nl: 'IJzeren Celsleutel', en: 'Iron Cell Key' }, icon: '🗝️', img: 'assets/art/item-cellkey.png', sparkle: true,
             look: { nl: 'De zware ijzeren sleutel van de wachter — muisstil van de tafel gegrist. Hij past op het sleutelslot van de celdeur.', en: 'The guard’s heavy iron key — snatched from the table without a sound. It fits the keyhole of the cell door.' } },
    charcoal: { name: { nl: 'Houtskool', en: 'Charcoal' }, icon: '⬛', img: 'assets/art/item-coal.png',
             look: { nl: 'Een handvol zwarte houtskool uit de vuurkorf naast het smidsbeeld in de slottuin. Precies wat een smid nodig heeft om zijn vuur weer aan te wakkeren.', en: 'A handful of black charcoal from the fire basket beside the smith statue in the castle garden. Just what a smith needs to fire up his forge again.' } },
    nut: { name: { nl: 'Pindanoot', en: 'Peanut' }, icon: '🥜', img: 'assets/art/item-nut.png',
             look: { nl: 'Een pindanoot, half uit zijn schil gebroken — hij lag bij het aambeeld van de smidse. Vogels — papagaaien zeker — zijn er dol op.', en: 'A peanut, half broken out of its shell — it lay by the smithy anvil. Birds — parrots especially — love these.' } },
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
    spellbook: { name: { nl: 'Toverboek', en: 'Spellbook' }, icon: '📕', sparkle: (state) => { const newSpells = (state.flags.gotEclipseSpell ? 1 : 0) + (state.flags.gotInvisSpell ? 1 : 0); return newSpells > (state.flags.bookNewSpellsSeen || 0); }, img: (state) => state.flags.spellWritten ? 'assets/art/item-spellbook.png' : 'assets/art/item-spellbook-plain.png',
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
    { when: { has: 'cellkey', flag: 'guardTurned', notFlag: 'fatherFreed' }, quest: 'q_cellopen' },  // wachter afgeleid -> open de celdeur
    { when: { has: 'cellkey', notFlag: 'guardTurned' },                  quest: 'q_distract' },      // sleutel binnen -> leid de wachter af bij de kettingen
    { when: { flag: 'boltsOpen', notFlag: 'gotCellKey' },                quest: 'q_key' },           // grendels open -> pak muisstil de sleutel van de tafel
    { when: { flag: 'guardPassed', notFlag: 'boltsOpen' },               quest: 'q_freefather' },    // onzichtbaar langs de wachter -> open het kerkerslot bij de cel
    { when: { flag: 'altarSolved', notFlag: 'fatherFreed' },             quest: 'q_dungeon' },       // geheime deur open -> daal af in de kerker en word onzichtbaar langs de wachter
    { when: { flag: 'sawSigns', notFlag: 'altarSolved' },                quest: 'q_altar' },         // zegel gezien -> draai de schijven van het altaar + hendel
    { when: { flag: 'eclipseActive', notFlag: 'sawSigns' },              quest: 'q_readbook' },      // eclips actief -> bekijk het hemelzegel boven het boek
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
        // eerste passende wint — het zwaard-op-de-standaard en de raaf-in-de-emmer zijn onafhankelijke toestanden, dus alle combinaties:
        { img: 'assets/art/scene-courtyard-raven-sword.jpg',     flags: ['ravenInBucket', 'squireGaveRope'],  notFlags: ['gotNecklace'] },              // raaf in de emmer + zwaard ingeleverd -> tentoongesteld
        { img: 'assets/art/scene-courtyard-raven-sword.jpg',     flags: ['ravenInBucket', 'swordForged'],     notFlags: ['gotNecklace', 'gotSword'] },   // raaf in de emmer + gesmeed zwaard wacht bij de tent (nog niet gepakt!)
        { img: 'assets/art/scene-courtyard-raven-swordgone.jpg', flags: ['ravenInBucket', 'squireGaveSword'], notFlags: ['gotNecklace'] },              // raaf in de emmer + zwaard in je tas -> lege standaard
        { img: 'assets/art/scene-courtyard-raven.jpg',           flags: ['ravenInBucket'],                    notFlags: ['gotNecklace'] },              // raaf in de emmer, zwaard nog onaangeroerd
        { img: 'assets/art/scene-courtyard-sword.jpg',           flags: ['squireGaveRope'] },                                                           // zwaard ingeleverd bij de schildknaap -> tentoongesteld
        { img: 'assets/art/scene-courtyard-sword.jpg',           flags: ['swordForged'],                      notFlags: ['gotSword'] },                 // net gesmeed: het zwaard glanst bij de tent tot je het pakt
        { img: 'assets/art/scene-courtyard-swordgone.jpg',       flags: ['squireGaveSword'] }                                                           // gebroken zwaard gekregen/onderweg -> standaard leeg
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
        { item: 'nut', hotspot: 'nut', x: 116, y: 252, scale: 0.66, filter: 'brightness(0.5)' },         // pindanoot bij het aambeeld/ijzer — op de grond flink donker (het icoon in de tas blijft licht)
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
            ? { nl: 'De schildknaap wijst naar de smidse. “Smeed het zwaard van de held: gooi eerst houtskool in de oven zodat het vuur hoog oplaait, leg dán het gebroken zwaard op het ijzer, en sla het met de hamer weer heel. De hamer ligt verborgen in de sokkel van zijn standbeeld, houtskool vind je in de vuurkorf ernaast.”', en: 'The squire points at the smithy. “Forge the hero’s sword: first throw charcoal in the oven so the fire roars up, then lay the broken sword on the iron, and strike it whole with the hammer. The hammer lies hidden in the plinth of his statue; you will find charcoal in the fire basket beside it.”' }
            : { nl: 'Een jonge schildknaap in een blauw wapenkleed houdt de wacht bij de koude smidse. Hij knikt je vriendelijk toe. “De koning ontvangt niemand meer, niet sinds de oude held viel — Sir Aldric, de Leeuw van Eldoria, de grootvader van de prinses. Zijn zwaard brak in tweeën en het hele kasteel verstomde van rouw.” Hij overhandigt je de twee stukken van het gebroken zwaard. “Smeed het bij de smidse weer heel — jij bent er klaar voor. Als het zwaard klaar is, krijg je van mij een touw.”', en: 'A young squire in a blue tabard keeps watch by the cold smithy. He gives you a friendly nod. “The king sees no one anymore, not since the old hero fell — Sir Aldric, the Lion of Eldoria, the princess’s grandfather. His sword broke in two and the whole castle fell silent with grief.” He hands you the two pieces of the broken sword. “Forge it whole at the smithy — you’re ready for it. Once the sword is done, I’ll give you a rope.”' },
          givesWhen: [
            { setFlag: ['metSquire', 'squireGaveSword'], item: 'swordBroken',
              giveText: { nl: 'De jonge schildknaap knikt je toe. “De koning ontvangt niemand meer, niet sinds de oude held viel — Sir Aldric, de Leeuw van Eldoria. Zijn zwaard brak in tweeën en het hele kasteel verstomde van rouw.” Hij legt meteen het gebroken zwaard — beide stukken — in je handen. “Smeed het weer heel bij de smidse: houtskool in de oven, het zwaard op het ijzer, en dan de hamer. Als het klaar is, krijg je van mij een touw. Veel succes, vriend.”', en: 'The young squire nods at you. “The king sees no one anymore, not since the old hero fell — Sir Aldric, the Lion of Eldoria. His sword broke in two and the whole castle fell silent with grief.” He places the broken sword — both pieces — into your hands at once. “Forge it whole at the smithy: charcoal in the oven, the sword on the iron, then the hammer. Once it’s done, I’ll give you a rope. Good luck, friend.”' } },
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
          name: { nl: 'Een Pindanoot', en: 'A Peanut' },
          rect: { x: 96, y: 234, w: 44, h: 40 },
          walkTo: { x: 116, y: 256 },
          hideFlag: 'taken_courtyard_nut',
          gives: {
            item: 'nut',
            giveText: { nl: 'Bij het aambeeld van de smidse ligt een pindanoot, half uit zijn schil. Je raapt hem op — vast lekker voor een vogel.', en: 'By the smithy anvil lies a peanut, half out of its shell. You pick it up — surely a treat for a bird.' },
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
        { x: 418, y: 248, w: 150, h: 72 },                 // de stenen bloembak (urn) rechterhoek — tot de rechterrand, nog meer ruimte erboven geblokkeerd
        { x: 192, y: 236, w: 38, h: 18 },                  // linker vuurkorf
        { x: 340, y: 236, w: 38, h: 18 }                   // rechter vuurkorf
      ],
      overlays: [
        { img: 'assets/art/keyhole.png', x: 134, y: 158, base: 240, scale: 0.56, appearFlag: 'fountainSolved', hideFlag: 'secretGateOpen' },  // sleutelgat in de muur rechts van de fontein — iets hoger + kleiner
        { img: 'assets/art/brazier-empty.png', x: 194, y: 216, base: 250, shadow: { a: 0.3, w: 15, h: 3.5 } },   // LEGE vuurkorf links van het smidsbeeld
        { img: 'assets/art/brazier.png', x: 342, y: 216, base: 250, shadow: { a: 0.3, w: 15, h: 3.5 } }    // vuurkorf rechts van het smidsbeeld — hierin ligt de houtskool
      ],
      worldItems: [
        { item: 'charcoal', hotspot: 'charcoal', x: 359, y: 223, scale: 0.72, glowCol: '255,150,60', embers: 0.9 },   // houtskool IN de rechter vuurkorf — duidelijker nagloeiende sintels zodat je 'm kunt pakken
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
                  : { nl: '“Krrak! Een hongerige vogel praat niet. Geef me een pindanoot — er ligt er een bij het aambeeld op het plein — en ik fluister de geheime spreuk van de smid.”', en: '“Squawk! A hungry bird won’t talk. Give me a peanut — there’s one by the anvil in the courtyard — and I’ll whisper the smith’s secret saying.”' } },
              { label: { nl: 'Dag papagaai', en: 'Bye, parrot' },
                text: { nl: '“Krrak! Tot kijk!” Hij schudt vrolijk zijn veren.', en: '“Squawk! See you!” He ruffles his feathers happily.' } }
            ]
          },
          look: { nl: 'Een kleurrijke groene papagaai zit op het bankje en bekijkt je nieuwsgierig met scheef kopje. Hij lijkt graag te kletsen.', en: 'A colourful green parrot perches on the bench, eyeing you with a curious tilt of the head. He seems to love a chat.' },
          use: {
            nut: {
              consume: 'nut',
              setFlag: 'gotSmithPhrase',
              text: { nl: 'Je geeft de papagaai de pindanoot. Hij kraakt de schil behendig open, smult van de pinda, en kwettert dan de geheime spreuk van de smid: “Krrak! ONLY... FIRE... FORGES... TRUE... STEEL! In díe volgorde!” Je prent de vijf woorden in je geheugen — klik ze in díe volgorde aan bij het smidsbeeld. (Klik op de papagaai om de spreuk nog eens te horen.)', en: 'You give the parrot the peanut. He cracks the shell open deftly, gobbles up the nut, and then chatters the smith’s secret saying: “Squawk! ONLY... FIRE... FORGES... TRUE... STEEL! In that order!” You commit the five words to memory — click them in that order at the smith statue. (Click the parrot to hear the saying again.)' }
            }
          }
        },
        {
          id: 'charcoal',
          name: { nl: 'De Rechter Vuurkorf', en: 'The Right Fire Basket' },
          rect: { x: 340, y: 206, w: 26, h: 46 },
          walkTo: { x: 358, y: 276 },
          hideFlag: 'taken_garden_charcoal',
          gives: {
            item: 'charcoal',
            giveText: { nl: 'In de ijzeren vuurkorf rechts van het smidsbeeld ligt een hoopje houtskool, de sintels gloeien nog zachtjes na. Je schept een flinke handvol in je tas — precies wat een smidsvuur nodig heeft.', en: 'In the iron fire basket right of the smith statue lies a heap of charcoal, its embers still faintly aglow. You scoop a good handful into your bag — just what a forge fire needs.' },
            emptyText: { nl: 'De vuurkorf is leeg geschept; de houtskool zit al in je tas.', en: 'You already scooped the basket empty; the charcoal is in your bag.' }
          }
        },
        {
          id: 'brazierL',
          name: { nl: 'De Linker Vuurkorf', en: 'The Left Fire Basket' },
          rect: { x: 202, y: 210, w: 28, h: 42 },
          walkTo: { x: 210, y: 270 },
          look: { nl: 'Een ijzeren vuurkorf op drie poten, links van het smidsbeeld. Deze is helemaal leeg — kaal, koud ijzer, geen kooltje te bekennen.', en: 'An iron fire basket on three legs, left of the smith statue. This one is completely empty — bare, cold iron, not a coal in sight.' }
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
        // de verduistering (tijdelijk, her-castbaar) wint altijd van het daglicht:
        { img: 'assets/art/scene-library-nacht-deur.jpg',  flags: ['altarSolved', 'eclipseActive'] },  // eclips actief + geheime deur open -> nacht met open deur
        { img: 'assets/art/scene-library-night.jpg',       flag: 'eclipseActive' },                    // de zonsverduistering-spreuk dooft de zon: nacht + eclips door het raam
        { img: 'assets/art/scene-library-open.jpg',        flag: 'libRelit' },                         // daglicht teruggekeerd: open geheime deur, overdag
        { img: 'assets/art/scene-library-nacht-deur.jpg',  flag: 'altarSolved' }                       // vangnet: deur net open, daglicht nog niet terug
      ],
      charFilter: 'saturate(1.02) brightness(0.88) sepia(0.14) contrast(1.04)',   // warm kaarslicht, wat donkerder zodat de figuren in de schemerige zaal opgaan
      heroShade: 0.8,
      entryText: {
        nl: 'De geheime gang komt uit in een stille kasteelbibliotheek. Hoge boekenkasten reiken tot het plafond, bij het grote raam staat een koperen telescoop, en midden in de zaal gloeit een boek op een sierlijke lessenaar. Een oude tovenaar tuurt erin, en op de vensterbank zit... de raaf!',
        en: 'The secret passage opens into a quiet castle library. Tall bookcases rise to the ceiling, a brass telescope stands by the great window, and in the middle of the hall a book glows on an ornate lectern. An old wizard peers into it, and on the windowsill sits... the raven!'
      },
      playerStart: { x: 300, y: 298 },
      spawnFrom: { garden: { x: 300, y: 298 } },
      depth: { far: 210, near: 320, sFar: 0.86, sNear: 1.32 },   // Finn duidelijk groter in de zaal
      walkable: [
        { x: 64, y: 250, w: 440, h: 58 },                  // open vloer/tapijt voor de lessenaar
        { x: 150, y: 224, w: 280, h: 30 }                  // smalle strook richting de lessenaar
      ],
      obstacles: [
        { x: 308, y: 206, w: 48, h: 50 },                  // de lessenaar zelf
        { x: 416, y: 244, w: 118, h: 60 },                 // de altaar-sokkel met het zonnestelsel — niet doorheen lopen
        { x: 160, y: 238, w: 56, h: 34 }                   // de tovenaar zelf — je loopt niet dwars door hem heen
      ],
      overlays: [],
      fx: {
        bookSparkle: { x: 278, y: 150, r: 24, doneFlag: 'altarSolved' }   // het boek geeft licht: zachte gloed + sparkles, tot het zegel is opgelost
      },
      npcs: [
        { id: 'librarian', sprite: 'librarian', x: 188, y: 260, scale: 0.86, sway: 0.014, aweSwayMul: 3.0, aweSwayMs: 1250, flip: true, filter: 'brightness(0.64) saturate(0.86)', aweSprites: ['librarian-trip1', 'librarian-trip2'], aweFlag: 'wizardTripping' },   // de pixel-tovenaar — donker; onder hypnose duidelijk waggelen + halo en twinkels (engine)
        { id: 'libRaven', sprite: 'ravenPerch', x: 366, y: 155, scale: 1.02, flip: false, peck: true, peckAmt: 0.3 }                               // de raaf op de vensterbank — flink groter, 5px lager
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
          id: 'toDungeon',
          name: { nl: 'De Geheime Deur', en: 'The Secret Door' },
          rect: { x: 82, y: 104, w: 84, h: 118 },
          walkTo: { x: 150, y: 254 },
          arrow: { x: 122, y: 150, dir: 'up' },
          requiresFlag: 'altarSolved',
          exit: { to: 'dungeon', travelText: { nl: 'Je glipt door de geheime deur achter de boekenkast. Een smalle, klamme wenteltrap voert je diep onder het kasteel, tot je uitkomt in een donkere kerker...', en: 'You slip through the secret door behind the bookcase. A narrow, clammy spiral stair takes you deep beneath the castle, until you emerge in a dark dungeon...' } }
        },
        {
          id: 'libRaven',
          name: { nl: 'De Raaf', en: 'The Raven' },
          rect: { x: 338, y: 118, w: 42, h: 58 },
          walkTo: { x: 344, y: 252 },
          look: (state) => state.flags.altarSolved
            ? { nl: '\u201CKrra! De geheime deur staat open \u2014 de trap af, de kerker in! En onthoud: wat een wachter niet z\u00EDet, kan hij niet tegenhouden...\u201D', en: '\u201CCaw! The secret door stands open \u2014 down the stairs, into the dungeon! And remember: what a guard cannot SEE, he cannot stop...\u201D' }
            : state.flags.sawSigns
            ? { nl: '\u201CKrra! Je z\u00e1g het hemelzegel! Draai de drie schijven van het altaar precies zo \u2014 zon bovenaan! \u2014 en trek aan de hendel: dan zwaait de geheime deur open.\u201D', en: '\u201CCaw! You SAW the celestial seal! Turn the three discs of the altar to match \u2014 sun at the top! \u2014 and pull the lever: the secret door will swing open.\u201D' }
            : state.flags.eclipseActive
            ? { nl: '\u201CKrra! De zon is gedoofd \u2014 kijk, boven het gloeiende boek zweeft het HEMELZEGEL! Bekijk het goed en onthoud hoe de schijven staan \u2014 dan weet je hoe het altaar moet.\u201D', en: '\u201CCaw! The sun is dark \u2014 look, the CELESTIAL SEAL hovers above the glowing book! Study it well and remember how the discs stand \u2014 then you know how to set the altar.\u201D' }
            : state.flags.gotEclipseSpell
            ? { nl: '\u201CKrra! Je hebt de spreuk! Tik hem aan in je tas en spreek hem uit \u2014 dan dooft de zon en verschijnt het hemelzegel boven het boek.\u201D', en: '\u201CCaw! You have the spell! Tap it in your bag and speak it \u2014 the sun will darken and the celestial seal will appear above the book.\u201D' }
            : state.flags.wizardTripping
            ? { nl: '\u201CKrra! Moet je hem zien zweven... Sn\u00E9l \u2014 kijk naar het ZONNESTELSEL op de sokkel rechts! Draai de hemelschijf tot zon, maan en ster op \u00E9\u00E9n lijn staan \u2014 d\u00E1\u00E1r zit de zonsverduistering-spreuk in.\u201D', en: '\u201CCaw! Look at him float... Quick \u2014 look at the SOLAR SYSTEM on the pedestal to the right! Turn the celestial disc until sun, moon and star line up \u2014 that is where the eclipse spell hides.\u201D' }
            : { nl: 'De raaf zit parmantig op de vensterbank. \u201CKrra! Die oude tovenaar wijkt geen duimbreed van zijn instrumenten... Maar ik weet w\u00E1t hij niet kan weerstaan: paddenstoelen! Van die glimmende, bij de oude put op de binnenplaats.\u201D', en: 'The raven perches proudly on the windowsill. \u201CCaw! That old wizard will not budge an inch from his instruments... But I know what he cannot resist: mushrooms! The shiny kind, by the old well in the courtyard.\u201D' }
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
          walkTo: { x: 244, y: 268 },
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
          look: (state) => state.flags.altarSolved
            ? { nl: 'Het grote boek rust; het hemelzegel is verbleekt. De onzichtbaarheidsspreuk staat veilig in jouw toverboek.', en: 'The great book rests; the celestial seal has faded. The invisibility spell sits safely in your spellbook.' }
            : state.flags.sawSigns
            ? { nl: 'Je zag het HEMELZEGEL boven het boek zweven. Draai de drie schijven van het sterren-altaar precies zo \u2014 en trek dan aan de hendel.', en: 'You saw the CELESTIAL SEAL hovering above the book. Turn the three discs of the star altar to match \u2014 then pull the lever.' }
            : (state.flags.gotEclipseSpell && state.flags.eclipseActive)
            ? { nl: 'Nu de zon verduisterd is, zweeft er een gloeiend HEMELZEGEL boven het boek: drie schijven vol tekens. Bekijk het goed \u2014 z\u00f3 moeten de schijven van het altaar staan!', en: 'Now that the sun is darkened, a glowing CELESTIAL SEAL hovers above the book: three discs full of signs. Study it well \u2014 that is how the altar discs must stand!' }
            : state.flags.gotEclipseSpell
            ? { nl: 'Bij daglicht toont het grote boek alleen vage krabbels \u2014 maar bij een zonsverduistering verschijnt er een gloeiend zegel... Spreek de zonsverduistering-spreuk uit bij het raam en lees d\u00e1n het boek.', en: 'In daylight the great book shows only faint scribbles \u2014 but during a solar eclipse a glowing seal appears... Cast the eclipse spell at the window, then read the book.' }
            : state.flags.wizardTripping
            ? { nl: 'Het boek gloeit zacht, maar de bladzijden tonen enkel vreemde krabbels. In de kantlijn staat een kleine tekening: het ZONNESTELSEL op de sokkel, met draaiende ringen eromheen... Bekijk dat zonnestelsel eens!', en: 'The book glows softly, but its pages show only strange scribbles. In the margin sits a small drawing: the SOLAR SYSTEM on the pedestal, with turning rings around it... Take a look at that solar system!' }
            : { nl: 'Een groot boek op de lessenaar gloeit zacht. De tovenaar houdt het scherp in de gaten \u2014 je durft het niet aan te raken.', en: 'A great book on the lectern glows softly. The wizard watches it sharply \u2014 you dare not touch it.' },
          signsBook: {                                     // het boek toont bij verduistering het HEMELZEGEL: de oplossing voor het altaar
            requiresFlag: 'gotEclipseSpell',
            blockedText: (state) => state.flags.wizardTripping
              ? { nl: 'Je bladert door het boek: vreemde krabbels, en \u00e9\u00e9n tekeningetje van het zonnestelsel op de sokkel met draaiende ringen. D\u00e1\u00e1r moet je zijn \u2014 bekijk het zonnestelsel!', en: 'You leaf through the book: strange scribbles, and one little drawing of the solar system on the pedestal with turning rings. That is where to go \u2014 look at the solar system!' }
              : { nl: '\u201cNiemand raakt de sterrenspreuken aan!\u201d snauwt de tovenaar. Zolang hij erbij is, kom je niet bij het boek. (De raaf fluistert: \u201cKrra... paddenstoelen, bij de put!\u201d)', en: '\u201cNo one touches the star spells!\u201d snaps the wizard. While he is watching you cannot reach the book. (The raven whispers: \u201cCaw... mushrooms, by the well!\u201d)' },
            eclipseFlag: 'eclipseActive',
            dayText: { nl: 'Bij daglicht zie je alleen vage krabbels. Toen de zon verduisterd was, zweefde er een gloeiend zegel boven het boek... Spreek de zonsverduistering-spreuk uit bij het raam en lees d\u00e1n het boek.', en: 'In daylight you see only faint scribbles. When the sun was eclipsed, a glowing seal hovered above the book... Cast the eclipse spell at the window, then read the book.' },
            setFlag: 'sawSigns',
            zoomImg: 'assets/art/hemelzegel.jpg'           // het zwevende HEMELZEGEL: precies z\u00f3 moeten de schijven van het altaar staan
          }
        },
        {
          id: 'orrery',
          name: { nl: 'Het Zonnestelsel', en: 'The Solar System' },
          rect: { x: 436, y: 126, w: 100, h: 56 },
          walkTo: { x: 404, y: 282 },
          look: (state) => state.flags.gotEclipseSpell
            ? { nl: 'Het koperen zonnestelsel rust weer; de ringen staan op \u00e9\u00e9n lijn. De zonsverduistering-spreuk staat in je toverboek.', en: 'The brass solar system rests again; its rings stand aligned. The eclipse spell is in your spellbook.' }
            : { nl: 'Een prachtig koperen zonnestelsel draait langzaam op de sokkel: een gloeiende zon met ringen van planeten en sterren eromheen. Er zit een draaimechaniek in...', en: 'A beautiful brass solar system slowly turns on the pedestal: a glowing sun with rings of planets and stars around it. There is a turning mechanism inside...' },
          eclipsePuzzle: {
            requiresFlag: 'wizardTripping',
            blockedText: { nl: '\u201cBlijf van mijn instrumenten af!\u201d snauwt de tovenaar zonder zelfs op te kijken. Zolang hij erbij is, mag je nergens aankomen. (De raaf fluistert: \u201cKrra... paddenstoelen, bij de put!\u201d)', en: '\u201cKeep your hands off my instruments!\u201d snaps the wizard without even looking up. While he is around you may touch nothing. (The raven whispers: \u201cCaw... mushrooms, by the well!\u201d)' },
            positions: 12,
            linked: true,
            title: { nl: 'De Hemelschijf', en: 'The Celestial Disc' },
            hint: { nl: 'Draai de drie ringen \u2014 Zon \u2609, Maan \u263d en Ster \u2726 \u2014 tot alle drie de tekens bovenaan onder de gouden wijzer staan. Maar pas op: de ringen grijpen als TANDWIELEN in elkaar! Draai je de zonnering, dan draait de maanring de \u00e1ndere kant op \u2014 en de maanring drijft zo ook de sterrenring aan. Alleen de binnenste ring draait vrij. (Tik links of rechts van een ring.)', en: 'Turn the three rings \u2014 Sun \u2609, Moon \u263d and Star \u2726 \u2014 until all three marks sit at the top under the golden pointer. But beware: the rings mesh like GEARS! Turn the sun ring and the moon ring turns the other way \u2014 and the moon ring drives the star ring in turn. Only the innermost ring turns free. (Tap left or right of a ring.)' },
            rings: [
              { start: 5 },
              { start: 8 },
              { start: 4 }
            ],
            setFlag: 'gotEclipseSpell',
            give: 'eclipsspell',
            solvedZoom: 'assets/art/spell-eclipse-page.jpg',
            solvedText: { nl: 'De drie ringen klikken op \u00e9\u00e9n lijn \u2014 de maan schuift langzaam v\u00f3\u00f3r de zon en een gloeiende corona vlamt op! Boven het zonnestelsel verschijnen tekens en zilveren letters: \u201cUmbra Solis\u201d \u2014 de ZONSVERDUISTERING-SPREUK schrijft zich in je toverboek! (Tik de spreuk aan in je tas om hem uit te spreken bij het grote raam.)', en: 'The three rings click into one line \u2014 the moon slides slowly across the sun and a glowing corona flares! Above the solar system, signs and silver letters appear: \u201cUmbra Solis\u201d \u2014 the SOLAR ECLIPSE SPELL writes itself into your spellbook! (Tap the spell in your bag to cast it at the great window.)' },
            doneText: { nl: 'Het zonnestelsel rust; de zonsverduistering-spreuk staat al in jouw toverboek.', en: 'The solar system rests; the eclipse spell is already in your spellbook.' }
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
          rect: { x: 418, y: 186, w: 114, h: 90 },
          walkTo: { x: 404, y: 282 },
          look: (state) => state.flags.altarSolved
            ? { nl: 'Het altaar rust weer. De drie sterren-tekens gloeien zachtjes na in het steen.', en: 'The altar rests again. The three star signs glow faintly in the stone.' }
            : { nl: 'Op het altaar ligt een rond ijzeren HEMELZEGEL: drie draaibare schijven vol gegraveerde tekens rond een blauwe steen, met een hendel ernaast. Hoe moeten de schijven staan? Het antwoord verschijnt vast ergens...', en: 'On the altar lies a round iron CELESTIAL SEAL: three turnable discs full of engraved signs around a blue stone, with a lever beside it. How must the discs stand? The answer must appear somewhere...' },
          discPuzzle: {
            requiresFlag: 'sawSigns',
            blockedText: { nl: 'Een rond ijzeren zegel met drie draaibare schijven vol tekens... maar hoe m\u00f3\u00e9ten ze staan? Je hebt geen idee \u2014 bekijk eerst het gloeiende boek tijdens een zonsverduistering: daar verschijnt het voorbeeld.', en: 'A round iron seal with three turnable discs full of signs... but how MUST they stand? You have no idea \u2014 first study the glowing book during a solar eclipse: the example appears there.' },
            imgBase:  'assets/art/seal-base.jpg',
            imgOuter: 'assets/art/seal-ring-outer.png',
            imgMid:   'assets/art/seal-ring-mid.png',
            imgInner: 'assets/art/seal-ring-inner.png',
            title: { nl: 'Het Hemelzegel', en: 'The Celestial Seal' },
            hint: { nl: 'Draai de drie schijven \u2014 tik links of rechts van de buitenste, middelste of binnenste schijf \u2014 tot alle tekens PRECIES zo staan als op het zegel dat boven het boek zweefde (de zon \u2609 bovenaan!). Trek dan aan de HENDEL.', en: 'Turn the three discs \u2014 tap left or right of the outer, middle or inner disc \u2014 until every sign stands EXACTLY as on the seal that hovered above the book (the sun \u2609 at the top!). Then pull the LEVER.' },
            rings: [
              { start: 5 },
              { start: 8 },
              { start: 3 }
            ],
            setFlag: ['altarSolved', 'gotInvisSpell'],
            give: 'invisspell',
            relight: { setFlag: 'libRelit', clearFlag: 'eclipseActive', delay: 2600, text: { nl: 'Achter het raam schuift de zwarte schijf weg van de zon. Het daglicht stroomt terug de zaal in \u2014 en in de muur, waar zojuist een boekenkast stond, gaapt nu een donkere doorgang naar beneden...', en: 'Behind the window the black disc slides off the sun. Daylight floods back into the hall \u2014 and in the wall, where a bookcase stood a moment ago, a dark passage now yawns downward...' } },
            wrongText: { nl: 'Je trekt aan de hendel... maar het zegel blijft dof en de schijven schieten terug. Ze staan nog niet zoals op het zegel in het boek \u2014 draai verder en vergelijk goed (de zon \u2609 hoort bovenaan).', en: 'You pull the lever... but the seal stays dull and the discs snap back. They are not yet as on the seal in the book \u2014 keep turning and compare well (the sun \u2609 belongs at the top).' },
            solvedText: { nl: 'Alle tekens vallen op hun plek \u2014 het HEMELZEGEL vlamt goudkleurig op! Met een diep, knarsend gerommel zwaait achter de boekenkast een GEHEIME DEUR open, en op het altaar schrijft een zilveren bladzijde zich in je toverboek: de SPREUK VAN ONZICHTBAARHEID! Achter de deur voert een trap omlaag, de duisternis in \u2014 naar de kerker...', en: 'Every sign falls into place \u2014 the CELESTIAL SEAL blazes golden! With a deep grinding rumble a SECRET DOOR swings open behind the bookcase, and on the altar a silver page writes itself into your spellbook: the SPELL OF INVISIBILITY! Beyond the door a stair leads down, into the dark \u2014 toward the dungeon...' },
            doneText: { nl: 'Het zegel rust; de tekens gloeien zachtjes na en de geheime deur staat open. Een trap voert omlaag, de kerker in.', en: 'The seal rests; the signs glow faintly and the secret door stands open. A stair leads down, into the dungeon.' }
          }
        }
      ]
    },

    dungeon: {
      name: { nl: 'De Kerker', en: 'The Dungeon' },
      bg: 'assets/art/scene-dungeon.jpg',
      charFilter: 'saturate(1.0) brightness(0.82) sepia(0.12) contrast(1.06)',   // klam fakkellicht in het donker
      heroShade: 0.7,
      entryText: {
        nl: 'De wenteltrap komt uit in een klamme kerker diep onder het kasteel. Fakkels walmen aan de muren, kettingen rammelen zacht. Rechts, achter dikke ijzeren tralies, zit een magere gestalte gevangen — en er tussenin staat een reusachtige wachter, zijn hellebaard in de hand. Hij mag je niet zien.',
        en: 'The spiral stair opens into a clammy dungeon deep beneath the castle. Torches gutter on the walls, chains rattle softly. To the right, behind thick iron bars, a thin figure is imprisoned — and between you and it stands a huge guard, halberd in hand. He must not see you.'
      },
      playerStart: { x: 100, y: 246 },
      spawnFrom: { library: { x: 100, y: 246 } },
      depth: { far: 250, near: 314, sFar: 1.00, sNear: 1.40 },   // Finn wat groter in de kerker
      walkable: [
        { x: 36, y: 246, w: 444, h: 66 }                 // de natte kerkervloer, van de trap links tot vlak voor de cel
      ],
      obstacles: [
        { x: 182, y: 200, w: 94, h: 28 },                // de houten tafel met de fles
        { x: 276, y: 196, w: 70, h: 28 },                // de tonnen naast de tafel
        { x: 288, y: 236, w: 68, h: 76, notFlag: 'guardPassed' }   // de wachter verspert de doorgang — tot je onzichtbaar bent (dan loop je er dwars langs)
      ],
      overlays: [],
      fx: {
        bookSparkle: { x: 230, y: 206, r: 13, doneFlag: 'gotCellKey' }   // de sleutel glinstert op de wachttafel tot je hem hebt
      },
      npcs: [
        { id: 'guard', sprite: 'dungeonGuard', x: 322, y: 246, scale: 1.22, flip: true, turnFlag: 'guardTurned', sway: 0.015, filter: 'brightness(0.82) saturate(0.96)' }   // de wachter vóór de cel, kijkt naar RECHTS; na het kettingen-trucje draait hij zich om (turnFlag)
        // Finn's vader zit ín de achtergrond, écht achter de tralies (gevangenis-ravenholt-1)
      ],
      worldItems: [],
      hotspots: [
        {
          id: 'toLibraryDungeon',
          name: { nl: 'Terug naar boven', en: 'Back Up' },
          rect: { x: 40, y: 40, w: 110, h: 210 },
          walkTo: { x: 105, y: 254 },
          arrow: { x: 95, y: 120, dir: 'up' },
          exit: { to: 'library', travelText: { nl: 'Je klimt de wenteltrap weer op, terug de bibliotheek in.', en: 'You climb back up the spiral stair, into the library.' } }
        },
        {
          id: 'chains',
          name: { nl: 'De Kettingen', en: 'The Chains' },
          rect: { x: 134, y: 36, w: 66, h: 116 },
          walkTo: { x: 162, y: 252 },
          look: (state) => state.flags.guardTurned
            ? { nl: 'De kettingen bungelen nog zachtjes na. De wachter staart er argwanend naar — met zijn rug naar de cel.', en: 'The chains still sway gently. The guard stares at them warily — his back to the cell.' }
            : { nl: 'Zware roestige kettingen hangen aan de muur bij de trap. Als je er zachtjes op tokkelt, galmt het door de hele kerker...', en: 'Heavy rusty chains hang on the wall by the stairs. Pluck them softly and the sound echoes through the whole dungeon...' },
          distract: {
            requiresFlag: 'gotCellKey',
            blockedText: { nl: 'Je zou op de kettingen kunnen tokkelen om de wachter af te leiden... maar nog niet — zorg éérst dat je alles hebt wat je nodig hebt (de sleutel!).', en: 'You could pluck the chains to distract the guard... but not yet — first make sure you have everything you need (the key!).' },
            setFlag: 'guardTurned',
            text: { nl: 'Je tokkelt zachtjes op een ketting — TIN-TIN-TINGGG... De galm rolt door de kerker. De wachter draait zich met een ruk om naar de trap: “Hè?! Wie daar?!” Zijn rug is nu naar de cel gekeerd — DIT is je kans: de sleutel in het slot!', en: 'You pluck a chain softly — TIN-TIN-TINNNG... The echo rolls through the dungeon. The guard spins around toward the stairs: “Eh?! Who goes there?!” His back is to the cell now — THIS is your chance: the key, into the lock!' },
            doneText: { nl: 'De wachter tuurt nog steeds argwanend naar de trap. Snel — de celdeur!', en: 'The guard still peers warily at the stairs. Quick — the cell door!' }
          }
        },
        {
          id: 'guard',
          name: { nl: 'De Wachter', en: 'The Guard' },
          rect: { x: 284, y: 118, w: 88, h: 132 },
          walkTo: { x: 250, y: 262 },
          look: (state) => state.flags.guardTurned
            ? { nl: 'De wachter staart met zijn rug naar de cel argwanend naar de trap. “Wie daar?!” gromt hij nog eens. Snel — nú de celdeur!', en: 'His back to the cell, the guard peers warily at the stairs. “Who goes there?!” he growls again. Quick — the cell door, NOW!' }
            : state.flags.guardPassed
            ? { nl: 'De wachter tuurt met gefronste wenkbrauwen de kerker rond — jou ziet hij niet. Maar pas op: HOREN kan hij je nog wél... Maak geen geluid.', en: 'The guard peers around the dungeon with a frown — he cannot see you. But beware: he can still HEAR you... Make no sound.' }
            : { nl: 'Een kolossale wachter met een hellebaard verspert de weg naar de cel. “Niemand komt bij de gevangene — niemand die ik zíe, tenminste.” Zolang hij je ziet, kom je er nooit langs... Kon je maar onzichtbaar worden. (Tik de onzichtbaarheidsspreuk aan in je tas.)', en: 'A colossal guard with a halberd blocks the way to the cell. “No one reaches the prisoner — no one I can SEE, at least.” While he can see you, you will never get past... If only you could turn invisible. (Tap the invisibility spell in your bag.)' },
          castWith: {
            item: 'invisspell',
            setFlag: 'guardPassed',
            needText: { nl: 'Je hebt iets nodig om ongezien langs die wachter te komen...', en: 'You need some way to get past that guard unseen...' },
            text: { nl: 'Je fluistert de onzichtbaarheidsspreuk — “Nihil Videbis!” — en je lichaam vervaagt tot niet meer dan een rilling in de fakkelgloed. De wachter tuurt dwars door je heen, gromt “...verbeelding” en leunt weer tegen de muur. Nu kun je ongezien langs hem naar de cel sluipen!', en: 'You whisper the invisibility spell — “Nihil Videbis!” — and your body fades to no more than a shimmer in the torchlight. The guard stares straight through you, grunts “...imagining things” and leans back against the wall. Now you can slip past him to the cell, unseen!' }
          }
        },
        {
          id: 'keyTable',
          name: { nl: 'De Sleutel op de Tafel', en: 'The Key on the Table' },
          rect: { x: 178, y: 186, w: 104, h: 48 },
          walkTo: { x: 230, y: 258 },
          look: (state) => state.flags.gotCellKey
            ? { nl: 'De tafel is leeg — de ijzeren celsleutel zit veilig in je tas.', en: 'The table is bare — the iron cell key sits safely in your bag.' }
            : { nl: 'Op de wachttafel, naast de kaars en de fles, glinstert een zware ijzeren sleutel. Dé sleutel van de cel! Maar het hout kraakt bij elk geluidje...', en: 'On the guard’s table, beside the candle and the bottle, gleams a heavy iron key. THE key to the cell! But the wood creaks at every little sound...' },
          keyPuzzle: {
            requiresFlag: 'guardPassed',
            blockedText: { nl: 'De wachter staat er met zijn neus bovenop — zolang hij je kan zien, kun je de sleutelbos onmogelijk ongemerkt pakken. Kon je maar onzichtbaar worden...', en: 'The guard stands right over it — while he can see you, you could never take the key ring unnoticed. If only you could turn invisible...' },
            title: { nl: 'De Sleutelbos — trek de juiste sleutel', en: 'The Key Ring — pull the right key' },
            hint: { nl: 'Aan de bos hangen VIJF sleutels — alleen de DONKERE met DRIE tanden past op de cel! HOUD een sleutel VAST om hem er langzaam uit te trekken; de andere sleutels rammelen mee. Trek alléén terwijl de wachter NEURIET (♪), en trek je de verkeerde er helemaal uit... RINKEL!', en: 'FIVE keys hang on the ring — only the DARK one with THREE teeth fits the cell! HOLD a key to pull it out slowly; the other keys rattle along. Pull only while the guard HUMS (♪), and if you pull out the wrong one... JINGLE!' },
            keys: [
              { col: 'goud',   teeth: 2 },
              { col: 'donker', teeth: 4 },
              { col: 'zilver', teeth: 3 },
              { col: 'donker', teeth: 3 },
              { col: 'brons',  teeth: 2 }
            ],
            target: 3,
            setFlag: 'gotCellKey',
            give: 'cellkey',
            failText: { nl: '“Wat was dat?!” De wachter draait met een ruk zijn hoofd — je verstijft en de sleutel zakt een stuk terug in de bos...', en: '“What was that?!” The guard snaps his head around — you freeze and the key sinks back into the ring...' },
            failWrongText: { nl: 'Verkeerde sleutel! RINKEL-DE-KINKEL — de hele bos danst aan de ring en je duwt alles haastig terug. Kijk beter: de DONKERE sleutel met DRIE tanden!', en: 'Wrong key! JINGLE-JANGLE — the whole ring dances and you hastily push everything back. Look closer: the DARK key with THREE teeth!' },
            solvedText: { nl: 'De donkere sleutel met drie tanden glijdt geluidloos van de ring, recht in je onzichtbare hand. De wachter neuriet vrolijk verder — hij heeft níets gemerkt. Nu de celdeur... maar hij staat er pal naast!', en: 'The dark three-toothed key slides soundlessly off the ring, straight into your invisible hand. The guard hums merrily on — he noticed nothing. Now the cell door... but he stands right beside it!' },
            doneText: { nl: 'De ijzeren celsleutel zit al in je tas.', en: 'The iron cell key is already in your bag.' }
          }
        },
        {
          id: 'father',
          name: { nl: 'De Gevangene', en: 'The Prisoner' },
          rect: { x: 408, y: 110, w: 100, h: 130 },
          walkTo: { x: 408, y: 268 },
          look: (state) => state.flags.fatherFreed
            ? { nl: 'De celdeur staat open. Je vader houdt je hand stevig vast — jullie zijn weer samen.', en: 'The cell door stands open. Your father holds your hand tight — you are together again.' }
            : state.flags.boltsOpen
            ? { nl: 'De grendels staan open, maar het sleutelslot houdt de deur dicht. Vader knikt naar de wachttafel: “De sleutel, jongen — muisstil...”', en: 'The bolts stand open, but the keyhole holds the door shut. Father nods at the guard’s table: “The key, my boy — quiet as a mouse...”' }
            : { nl: 'Onzichtbaar sluip je naar de tralies. De magere man kijkt op — vermoeide ogen, rood-bruin haar net als dat van jou. “...Finn?” fluistert hij. “Mijn jongen! Snel — het slot heeft vier tekens. Luister goed: éérst de ZON... dan de MAAN... dan de STER... en als laatste het teken van mijn oude staf: Ψ.”', en: 'Invisible, you creep to the bars. The thin man looks up — tired eyes, red-brown hair just like yours. “...Finn?” he whispers. “My boy! Quick — the lock has four signs. Listen well: FIRST the SUN... then the MOON... then the STAR... and last the sign of my old staff: Ψ.”' },
          use: {
            cellkey: {
              requiresFlag: ['boltsOpen', 'guardTurned'],
              requiresText: { nl: 'Nog niet! De deur opent pas als: de vier GRENDELS open zijn (vraag vader naar de tekens) én de wachter NIET naar de cel staart — zelfs onzichtbaar zou hij de zwevende sleutel zien. Leid hem af, bij de kettingen...', en: 'Not yet! The door only opens once: the four BOLTS are open (ask father for the signs) and the guard is NOT staring at the cell — even invisible, he would see the floating key. Distract him, at the chains...' },
              consume: 'cellkey',
              setFlag: 'fatherFreed',
              win: true,
              text: { nl: 'De ijzeren sleutel glijdt in het slot... KLIK. De zware celdeur zwaait piepend open en je vader stapt naar buiten. Hij tilt je op in een omhelzing die alles goedmaakt. “Mijn jongen... je hebt me gevonden én bevrijd.” Samen sluipen jullie muisstil langs de neuriënde wachter, de trap op, richting het daglicht... (wordt vervolgd in Deel 3)', en: 'The iron key slides into the lock... CLICK. The heavy cell door creaks open and your father steps out. He lifts you into a hug that makes up for everything. “My boy... you found me AND freed me.” Together you slip silently past the humming guard, up the stairs, toward the daylight... (to be continued in Part 3)' }
            }
          },
          symbolPuzzle: {
            requiresFlag: 'guardPassed',
            blockedText: { nl: 'Je wilt naar de tralies rennen, maar de reusachtige wachter stapt meteen vóór de cel. “Terug jij!” Zolang hij je ziet, kom je hier niet langs... Kon je maar onzichtbaar worden. (Tik de onzichtbaarheidsspreuk aan in je tas.)', en: 'You start toward the bars, but the huge guard instantly steps in front of the cell. “Back, you!” While he can see you, there is no getting past... If only you could turn invisible. (Tap the invisibility spell in your bag.)' },
            img: 'assets/art/puzzle-cellock.jpg',
            title: { nl: 'Het Kerkerslot', en: 'The Dungeon Lock' },
            hint: { nl: 'Vader fluistert de volgorde: eerst de ZON ☉, dan de MAAN ☽, dan de STER ✦, en als laatste het teken van zijn staf Ψ. Tik de vier medaillons in precies die volgorde!', en: 'Father whispers the order: first the SUN ☉, then the MOON ☽, then the STAR ✦, and last the sign of his staff Ψ. Tap the four medallions in exactly that order!' },
            zones: [
              { key: 'star', left: 13,   top: 32, width: 17, height: 36 },
              { key: 'sun',  left: 31,   top: 32, width: 17, height: 36 },
              { key: 'psi',  left: 49,   top: 32, width: 17, height: 36 },
              { key: 'moon', left: 67,   top: 32, width: 17, height: 36 }
            ],
            sequence: ['sun', 'moon', 'star', 'psi'],
            resetText: { nl: 'Het slot klikt boos en de grendels schieten terug. Verkeerde volgorde — luister naar vader: zon, maan, ster, en dan Ψ.', en: 'The lock clicks angrily and the bolts snap back. Wrong order — listen to father: sun, moon, star, then Ψ.' },
            setFlag: 'boltsOpen',
            solvedText: { nl: 'KLIK — KLIK — KLIK — KLIK! De vier grendels schuiven open... maar de deur geeft nog niet mee. Onderaan zit een SLEUTELSLOT. Vader fluistert: “De wachter legt zijn sleutelBOS altijd op de tafel — de DONKERE sleutel met DRIE tanden past op de cel. Maar pas op, jongen: onzichtbaar of niet, hij kan je nog steeds HOREN...”', en: 'CLICK — CLICK — CLICK — CLICK! The four bolts slide open... but the door will not give yet. At the bottom sits a KEYHOLE. Father whispers: “The guard always leaves his key RING on the table — the DARK key with THREE teeth fits the cell. But beware, my boy: invisible or not, he can still HEAR you...”' },
            doneText: { nl: 'De grendels staan open; alleen het sleutelslot houdt de deur nog dicht. De sleutel ligt op de wachttafel.', en: 'The bolts stand open; only the keyhole still holds the door. The key lies on the guard’s table.' }
          }
        }
      ]
    }

  }
};
