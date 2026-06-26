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
  assetVer: '49',

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
    nl: 'Gefeliciteerd — je hebt DEEL 1 van Whispers of Ravenholt uitgespeeld! De drakenschaduw vervaagt, de wacht is gevlucht en Finn stapt door de open poort het kasteel van Eldoria binnen. Híer ergens zit zijn vader gevangen... maar dat verhaal, en wat er achter de poort schuilt, bewaren we voor DEEL 2. Knap gedaan, held — tot snel!',
    en: 'Congratulations — you have completed PART 1 of Whispers of Ravenholt! The dragon-shadow fades, the guard has fled, and Finn steps through the open gate into the castle of Eldoria. His father is held captive somewhere inside... but that tale, and whatever lurks beyond the gate, we save for PART 2. Well done, hero — see you soon!'
  },

  strings: {
    noEffect:     { nl: 'Dat werkt hier niet.', en: 'That doesn’t work here.' },
    noCombine:    { nl: 'Die twee laten zich niet combineren.', en: 'Those two don’t combine.' },
    nothingThere: { nl: 'Daar valt niets te ontdekken.', en: 'There’s nothing to find there.' }
  },

  ui: {
    subtitle:   { nl: 'Deel 2 — Het Kasteel van Eldoria', en: 'Part 2 — The Castle of Eldoria' },
    intro:      { nl: 'Finn is door de poort het kasteel van Eldoria binnengeglipt. Op de binnenplaats houdt een schildknaap de wacht, en achter een begroeide boog ligt een geheime slottuin — waar de prinses op wie hij stiekem verliefd is tussen de rozen wandelt.',
                  en: 'Finn has slipped through the gate into the castle of Eldoria. A squire keeps watch in the courtyard, and beyond an ivy-clad arch lies a secret garden — where the princess he secretly loves walks among the roses.' },
    credit:     { nl: 'Een RetroAdventureWorld-avontuur', en: 'A RetroAdventureWorld adventure' },
    startBtn:   { nl: 'Begin het mysterie', en: 'Begin the mystery' },
    winTitle:   { nl: 'Deel 1 uitgespeeld!', en: 'Part 1 complete!' },
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
    q_garden_met:{ nl: 'Onderzoek het ridderbeeld op de binnenplaats — er zit iets achter de barst', en: 'Examine the knight statue in the courtyard — something hides behind the crack' },
    q_findtool: { nl: 'Het ridderbeeld klinkt hol bij de barst — zoek stevig gereedschap om hem open te breken (kijk bij de smidse)', en: 'The knight statue sounds hollow at the crack — find a sturdy tool to break it open (try the forge)' },
    q_usehammer:{ nl: 'Gebruik de smidshamer op de barst in het ridderbeeld op de binnenplaats', en: 'Use the blacksmith’s hammer on the crack in the knight statue in the courtyard' },
    q_medallion:{ nl: 'Je vond een gouden medaillon — laat het eens aan de prinses in de tuin zien', en: 'You found a golden medallion — show it to the princess in the garden' },
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
             look: { nl: 'Een zware smidshamer van de smidse op de binnenplaats. Stevig genoeg om een gebarsten steen open te breken.', en: 'A heavy blacksmith’s hammer from the courtyard forge. Sturdy enough to crack open a split stone.' } },
    swordBroken: { name: { nl: 'Gebroken Zwaard', en: 'Broken Sword' }, icon: '🗡️', img: 'assets/art/item-sword-broken.png',
             look: { nl: 'Een oud zwaard, doormidden gebroken. Het gevest zit nog stevig in elkaar; misschien kan een smid het opnieuw smeden.', en: 'An old sword, snapped clean in two. The hilt is still solid; perhaps a smith could reforge it.' } },
    flower: { name: { nl: 'Bloem', en: 'Flower' }, icon: '🌸', img: 'assets/art/item-flower.png',
             look: { nl: 'Een mooie bloem uit de slottuin — een lief klein cadeautje voor iemand bijzonders.', en: 'A pretty flower from the castle garden — a sweet little gift for someone special.' } },
    rope: { name: { nl: 'Touw', en: 'Rope' }, icon: '🪢', img: 'assets/art/item-rope.png',
             look: { nl: 'Een stevig opgerold touw. Lang genoeg om iets uit een diepe put omhoog te vissen.', en: 'A sturdy coil of rope. Long enough to fish something up from a deep well.' } },
    wellKey: { name: { nl: 'Oude Sleutel', en: 'Old Key' }, icon: '🗝️', img: 'assets/art/item-wellkey.png', sparkle: true,
             look: { nl: 'Een zware, oude sleutel vol roest en mos — je viste hem met het touw uit de put. Waar zou hij op passen?', en: 'A heavy old key, thick with rust and moss — you fished it from the well with the rope. What might it unlock?' } },
    medallion: { name: { nl: 'Gouden Medaillon', en: 'Golden Medallion' }, icon: '🎖️', img: 'assets/art/item-medallion.png', sparkle: true, border: 'gold',
             look: { nl: 'Een glanzend gouden medaillon met hetzelfde ridderwapen als op het standbeeld — een blauwe lelie. Het lag verborgen in de sokkel. Wie zou het daar bewaard hebben?', en: 'A gleaming gold medallion bearing the same knight’s crest as the statue — a blue fleur-de-lis. It lay hidden in the plinth. Who could have kept it there?' } },
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
    { when: { flag: 'showedMedallion' }, quest: 'q_done' },        // medaillon getoond -> wordt vervolgd
    { when: { has: 'medallion' },        quest: 'q_medallion' },   // medaillon in handen -> laat het de prinses zien
    { when: { has: 'hammer' },           quest: 'q_usehammer' },   // hamer in handen -> sla de barst in het beeld open
    { when: { flag: 'statueCracked' },   quest: 'q_findtool' },    // barst ontdekt -> zoek gereedschap
    { when: { flag: 'metPrincess' },     quest: 'q_garden_met' },  // de prinses ontmoet
    { when: { flag: 'visited_garden' },  quest: 'q_garden' },      // tuin betreden
    { when: {},                          quest: 'q_explore' }
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
      worldItems: [],
      npcs: [
        { id: 'squire', sprite: 'squire', sway: true, filter: 'brightness(0.78) saturate(0.92)', x: 486, y: 284, scale: 1.18, flip: true },   // schildknaap iets groter; beweegt net als de poortwacht uit Deel 1 (rustige doorlopende wieg + lichte ademhaling)
        { id: 'courtyardRaven', sprite: 'ravenPerch', x: 360, y: 126, scale: 0.62, flip: true, peck: true, peckAmt: 0.4 }   // de raaf is naar de binnenplaats gekomen; zit op het dakje van de put en pikt af en toe
      ],
      fx: {},
      hotspots: [
        {
          id: 'squire',
          name: { nl: 'De Schildknaap', en: 'The Squire' },
          rect: { x: 456, y: 184, w: 70, h: 104 },
          walkTo: { x: 452, y: 300 },
          look: {
            nl: 'Een jonge schildknaap in een blauw wapenkleed houdt de wacht bij de tent. Hij knikt je vriendelijk toe. “De prins is op jacht en de koning ontvangt niemand. Maar de slottuin links... daar mag je gerust rondkijken, hoor.”',
            en: 'A young squire in a blue tabard keeps watch by the tent. He gives you a friendly nod. “The prince is out hunting and the king sees no one. But the castle garden to your left... you’re welcome to look around there.”'
          },
          setFlag: 'metSquire'
        },
        {
          id: 'well',
          name: { nl: 'De Oude Put', en: 'The Old Well' },
          rect: { x: 224, y: 150, w: 120, h: 108 },
          walkTo: { x: 286, y: 300 },
          symbolPuzzle: {
            img: 'assets/art/puzzle-well.jpg',
            title: { nl: 'De Oude Put', en: 'The Old Well' },
            hint: { nl: 'In de putrand zijn vier tekens uitgehouwen. De oude spreuk luidt: “water, maan, schelp, ster.” Druk de tekens op de stenen in die volgorde.', en: 'Four signs are cut into the well-rim. The old verse reads: “water, moon, shell, star.” Press the carved signs on the stones in that order.' },
            zones: [
              { key: 'maan',   left: 29, top: 65, width: 13, height: 26 },
              { key: 'ster',   left: 41, top: 62, width: 12, height: 28 },
              { key: 'water',  left: 52, top: 65, width: 12, height: 26 },
              { key: 'schelp', left: 62, top: 63, width: 14, height: 28 }
            ],
            symbols: [
              { key: 'water',  emoji: '💧', label: { nl: 'Water',  en: 'Water' } },
              { key: 'schelp', emoji: '🐚', label: { nl: 'Schelp', en: 'Shell' } },
              { key: 'maan',   emoji: '🌙', label: { nl: 'Maan',   en: 'Moon'  } },
              { key: 'ster',   emoji: '⭐', label: { nl: 'Ster',   en: 'Star'  } }
            ],
            sequence: ['water', 'maan', 'schelp', 'ster'],
            setFlag: 'wellUnlocked',
            solvedText: { nl: 'De vier tekens lichten op en diep in de put klikt het oude windwerk los. Nu zou je met een touw iets uit de diepte omhoog kunnen vissen.', en: 'The four signs light up and deep in the well the old winding gear clicks free. Now, with a rope, you could fish something up from below.' },
            resetText: { nl: 'De tekens doven. Begin opnieuw.', en: 'The signs go dark. Start over.' },
            doneText: { nl: 'Het windwerk van de put is los. Laat er een touw in zakken om de glinstering op de bodem omhoog te vissen.', en: 'The well’s winding gear is free. Lower a rope to fish up the glint at the bottom.' }
          },
          use: {
            rope: {
              requiresFlag: 'wellUnlocked',
              requiresText: { nl: 'Het windwerk van de put zit nog op slot — eerst de tekens in de juiste volgorde.', en: 'The well’s winding gear is still locked — solve the carved signs first.' },
              consume: 'rope',
              give: 'wellKey',
              setFlag: 'gotWellKey',
              text: { nl: 'Je laat het touw over het losse windwerk in de put zakken en vist tot het ergens achter haakt. Met een natte plons hijs je een zware, met mos overdekte oude sleutel omhoog! Waar zou hij op passen?', en: 'You lower the rope over the freed gear into the well and fish until it snags. With a wet splash you haul up a heavy, moss-covered old key! What might it unlock?' }
            }
          }
        },
        {
          id: 'castledoor',
          name: { nl: 'De Kasteeldeur', en: 'The Castle Door' },
          rect: { x: 408, y: 40, w: 76, h: 110 },
          walkTo: { x: 436, y: 248 },
          look: (state) => state.flags.castleDoorOpen
            ? { nl: 'De zware kasteeldeur staat op een kier; een koele, donkere gang gaapt erachter. (wordt vervolgd in een volgend hoofdstuk)', en: 'The heavy castle door stands ajar; a cool, dark passage gapes beyond. (to be continued in a later chapter)' }
            : { nl: 'De zware eikenhouten kasteeldeur zit op een fors, oud slot. Hierachter wordt Finns vader vastgehouden... Je hebt een sleutel nodig die op dit oude slot past.', en: 'The heavy oak castle door is held by a big, old lock. Finn’s father is held beyond... You’ll need a key that fits this ancient lock.' },
          use: {
            wellKey: {
              consume: 'wellKey',
              setFlag: 'castleDoorOpen',
              text: { nl: 'De zware, met mos overdekte sleutel past! Met een knarsend gepiep draait het oude slot om en de kasteeldeur kiert open. Een koele, donkere gang gaapt erachter... (wordt vervolgd in een volgend hoofdstuk)', en: 'The heavy, moss-covered key fits! With a grinding squeal the old lock turns and the castle door creaks open. A cool, dark passage gapes beyond... (to be continued in a later chapter)' }
            }
          }
        },
        {
          id: 'forge',
          name: { nl: 'De Smidse', en: 'The Forge' },
          rect: { x: 2, y: 118, w: 72, h: 112 },
          walkTo: { x: 72, y: 252 },
          hideFlag: 'tookRope',                            // verdwijnt als interactie zodra het touw weg is (blijft als sfeer)
          gives: {
            item: 'rope',
            setFlag: 'tookRope',
            giveText: { nl: 'Onder het afdakje gloeit het smidsvuur na. De smid is nergens te bekennen, maar aan een haak naast het aambeeld hangt een stevig opgerold touw. Je neemt het mee.', en: 'Under the lean-to the forge fire still glows. The smith is nowhere to be seen, but a sturdy coil of rope hangs on a hook beside the anvil. You take it.' },
            emptyText: { nl: 'Verder ligt er bij de smidse niets bruikbaars.', en: 'There’s nothing else useful at the forge.' }
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
        { x: 216, y: 178, w: 132, h: 74 }                  // de ronde sokkel met het ridderbeeld
      ],
      overlays: [],
      worldItems: [],
      npcs: [
        { id: 'princess', sprite: 'princess', sway: 0.020, filter: 'brightness(0.78) saturate(0.92)', flip: true, x: 424, y: 250, scale: 1.0 },   // prinses; zelfde afbeelding, iets compacter (kleinere schaal); zelfde wieg als de wachter maar subtieler
        { id: 'gardenParrot', sprite: 'parrot', x: 506, y: 202, scale: 0.82, flip: true, peck: true, peckAmt: 0.35 }   // een kleurrijke papagaai in de slottuin; zit op de rugleuning van het bankje en wiebelt af en toe
      ],
      fx: {},
      hotspots: [
        {
          id: 'princess',
          name: { nl: 'De Prinses', en: 'The Princess' },
          rect: { x: 400, y: 170, w: 60, h: 90 },
          walkTo: { x: 398, y: 296 },
          look: (state) => state.flags.showedMedallion
            ? { nl: 'De prinses houdt het medaillon tegen haar hart. “Bewaar het goed, Finn. Kom je morgen weer?” Haar glimlach maakt je sprakeloos.', en: 'The princess holds the medallion to her heart. “Keep it safe, Finn. Will you come again tomorrow?” Her smile leaves you speechless.' }
            : state.flags.metPrincess
            ? { nl: 'De prinses glimlacht zacht naar je. “Blijf nog even, Finn. Hier in de tuin lijkt de tijd even stil te staan.”', en: 'The princess smiles softly at you. “Stay a while, Finn. Here in the garden time seems to stand still.”' }
            : { nl: 'Tussen de rozen wandelt de prinses op wie Finn al sinds zijn jeugd stiekem verliefd is. Zijn hart bonkt. Ze kijkt op en glimlacht: “Een nieuw gezicht in mijn tuin... hoe heet je?”', en: 'Among the roses walks the princess Finn has secretly loved since childhood. His heart pounds. She looks up and smiles: “A new face in my garden... what is your name?”' },
          use: {
            medallion: {
              keep: true,                                  // het medaillon blijft van Finn
              setFlag: 'showedMedallion',
              text: { nl: 'Je laat de prinses het gouden medaillon zien. Haar ogen worden groot. “Dat wapen... dat is van de oude held van Eldoria — mijn grootvader. Dit was al jaren zoek!” Ze vouwt jouw hand voorzichtig om het medaillon. “Jij hebt het gevonden. Bewaar het — als een belofte.” Finn krijgt een kleur tot achter zijn oren.', en: 'You show the princess the golden medallion. Her eyes go wide. “That crest... it belonged to the old hero of Eldoria — my grandfather. It’s been lost for years!” She gently folds your hand around the medallion. “You found it. Keep it — as a promise.” Finn blushes to the tips of his ears.' }
            }
          },
          setFlag: 'metPrincess'
        },
        {
          id: 'fountain',
          name: { nl: 'De Leeuwenfontein', en: 'The Lion Fountain' },
          rect: { x: 22, y: 118, w: 84, h: 100 },
          walkTo: { x: 96, y: 252 },
          look: {
            nl: 'Een stenen leeuwenkop spuwt helder water in een schelpvormig bekken. Het tikt vrolijk tegen de bemoste randen.',
            en: 'A stone lion’s head spouts clear water into a shell-shaped basin. It patters merrily against the mossy rim.'
          }
        },
        {
          id: 'gstatue',
          name: { nl: 'Het Ridderbeeld', en: 'The Knight Statue' },
          rect: { x: 232, y: 90, w: 96, h: 150 },
          walkTo: { x: 286, y: 296 },
          look: (state) => state.flags.statueOpened
            ? { nl: 'Het opengebroken vakje onder in de sokkel is leeg — het gouden medaillon zit nu veilig in je tas.', en: 'The broken-open niche at the base of the plinth is empty now — the golden medallion is safe in your bag.' }
            : { nl: 'Een stenen ridder met het zwaard fier voor zich. In de sokkel zijn vier wapenschilden gebeiteld, en eronder een fijne barst die hól klinkt — alsof er iets achter verstopt zit.', en: 'A stone knight, his sword proud before him. Four crests are carved into the plinth, and below them a fine crack that sounds hollow — as if something is hidden behind it.' },
          symbolPuzzle: {
            img: 'assets/art/puzzle-crest.jpg',
            title: { nl: 'Het Wapen van de Ridder', en: 'The Knight’s Crest' },
            hint: { nl: 'In de sokkel zijn vier wapenschilden gebeiteld. De spreuk van de orde luidt: “de leeuw, de lelie, het zwaard, de kroon.” Druk de schilden op de steen in die volgorde.', en: 'Four crests are carved into the plinth. The order’s motto reads: “the lion, the lily, the sword, the crown.” Press the carved crests in that order.' },
            zones: [
              { key: 'lelie',  left: 6,  top: 26, width: 19, height: 50 },
              { key: 'kroon',  left: 28, top: 22, width: 19, height: 56 },
              { key: 'leeuw',  left: 51, top: 26, width: 19, height: 52 },
              { key: 'zwaard', left: 74, top: 24, width: 18, height: 54 }
            ],
            symbols: [
              { key: 'leeuw',  emoji: '🦁', label: { nl: 'Leeuw',  en: 'Lion'  } },
              { key: 'zwaard', emoji: '⚔️', label: { nl: 'Zwaard', en: 'Sword' } },
              { key: 'kroon',  emoji: '👑', label: { nl: 'Kroon',  en: 'Crown' } },
              { key: 'lelie',  emoji: '⚜️', label: { nl: 'Lelie',  en: 'Lily'  } }
            ],
            sequence: ['leeuw', 'lelie', 'zwaard', 'kroon'],
            setFlag: 'statuePuzzleSolved',
            give: 'hammer',
            solvedText: { nl: 'De vier wapenschilden klikken één voor één op hun plek. Met een steenachtig gerommel schuift een vakje in de sokkel open — daarin ligt de zware smidshamer van de oude held! Je neemt hem mee. Vlak eronder zit nog die barst die hól klinkt...', en: 'One by one the four crests click into place. With a stony rumble a niche slides open in the plinth — inside lies the old hero’s heavy blacksmith’s hammer! You take it. Just below it runs that crack that sounds hollow...' },
            resetText: { nl: 'De schilden draaien terug. Begin opnieuw.', en: 'The crests turn back. Start over.' },
            doneText: { nl: 'Het vakje is open en leeg. Maar er loopt nóg een barst door de sokkel die hól klinkt — met de hamer kun je die misschien openbreken.', en: 'The niche is open and empty. But another crack runs through the plinth, sounding hollow — with the hammer you might break it open.' }
          },
          use: {
            hammer: {
              consume: 'hammer',
              give: 'medallion',
              setFlag: 'statueOpened',
              text: { nl: 'Je zet de smidshamer tegen de barst en geeft een paar flinke klappen. Met een doffe knál breekt de steen open en onthult een klein, met fluweel bekleed vakje. Daarin glinstert een gouden medaillon — met hetzelfde ridderwapen, een blauwe lelie. Je neemt het mee.', en: 'You set the hammer to the crack and strike hard a few times. With a dull crack the stone breaks open, revealing a small velvet-lined niche. Inside glints a golden medallion — bearing the same knight’s crest, a blue fleur-de-lis. You take it.' }
            }
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
