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
  assetVer: '132',

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
    runeDragon:    'assets/art/runeDragon.png'
  },
  heroWalkFrames: 16,           // loopanimatie uit /lopen 01-16 (alleen de écht-lopende frames)
  spriteDetail: 2,              // sprites zijn op 2x resolutie opgeslagen; engine tekent ze op halve maat = fijnere details

  /* Finn begint met de staf van zijn vader in zijn tas. */
  startItems: ['staff'],

  winText: {
    nl: 'De drakenschaduw vervaagt en de poort van kasteel Eldoria staat eindelijk open. Finn haalt diep adem — híer ergens zit zijn vader gevangen. Maar dat verhaal, en wat er achter de poort schuilt, bewaren we voor DEEL 2. Knap gedaan, held — tot snel!',
    en: 'The dragon-shadow fades and the gate of castle Eldoria finally stands open. Finn draws a deep breath — his father is held captive somewhere inside. But that tale, and whatever lurks beyond the gate, we save for PART 2. Well done, hero — see you soon!'
  },

  strings: {
    noEffect:     { nl: 'Dat werkt hier niet.', en: 'That doesn’t work here.' },
    noCombine:    { nl: 'Die twee laten zich niet combineren.', en: 'Those two don’t combine.' },
    nothingThere: { nl: 'Daar valt niets te ontdekken.', en: 'There’s nothing to find there.' }
  },

  ui: {
    subtitle:   { nl: 'Een point-and-click mysterie', en: 'A point-and-click mystery' },
    intro:      { nl: 'In het koninkrijk Eldoria loopt de fontein op het dorpsplein al weken leeg. De jonge Finn — die droomt van magie en wiens vader gevangen zit in het kasteel — gaat op onderzoek uit.',
                  en: 'In the kingdom of Eldoria the village-square fountain has been running dry for weeks. Young Finn — who dreams of magic and whose father is imprisoned in the castle — sets out to investigate.' },
    credit:     { nl: 'Een RetroAdventureWorld-avontuur', en: 'A RetroAdventureWorld adventure' },
    startBtn:   { nl: 'Begin het mysterie', en: 'Begin the mystery' },
    winTitle:   { nl: 'Wordt vervolgd — Deel 2 komt eraan!', en: 'To be continued — Part 2 is coming!' },
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
    { when: { flag: 'valleyMagic' },        quest: null },         // ketel ontstoken -> wordt vervolgd
    { when: { flag: 'gotMap' },             quest: 'q_valley' },   // kaart ontvangen -> volg het pad naar de vallei
    { when: { flag: 'millFixed' },          quest: 'q_tomayor' },  // molen draait -> terug naar de burgemeester
    { when: { has: 'millwheel' },           quest: 'q_fixmill' },  // rad in handen -> maak het radwerk in de molen
    { when: { flag: 'merchantDistracted' }, quest: 'q_takewheel' },// bloem danst, handelsman afgeleid -> pak het rad
    { when: { flag: 'spellWritten' },       quest: 'q_flower' },   // spreuk geschreven -> laat de bloem dansen bij de poort
    { when: { has: 'spellbook' },           quest: 'q_writespell' },// leeg toverboek -> maak inkt + veer en schrijf de spreuk
    { when: { flag: 'lookedMill' },         quest: 'q_book' },     // rad zit vast -> zoek het toverboek in de molen
    { when: { flag: 'seenFountain' },       quest: 'q_mill' },
    { when: {},                             quest: 'q_explore' }
  ],

  scenes: {
    square: {
      name: { nl: 'Het Dorpsplein', en: 'The Village Square' },
      bg: 'assets/art/scene-square.jpg',
      bgVariants: [
        { img: 'assets/art/scene-square-chess.jpg', flag: 'mayorGone' },         // burgemeester vertrokken: oude man schaakt + fontein klatert
        { img: 'assets/art/scene-square-mill.jpg', flag: 'millFixed' },          // molen gemaakt: fontein klatert weer
        { img: 'assets/art/scene-square.jpg' }                                    // begin: droge fontein
      ],
      charFilter: 'sepia(0.3) saturate(1.2) brightness(1.05)',   // warm-gouden opkomende zon, geeliger
      heroShade: 0.87,                                            // Finn iets donkerder op het plein (meer in de schaduw)
      entryText: {
        nl: 'Het dorpsplein van Eldoria baadt in het ochtendlicht. De fontein klatert nog wat na, maar het water zakt zienderogen. Aan de rand staat de oude molen stil.',
        en: 'The village square of Eldoria bathes in morning light. The fountain still trickles, but the water is dropping fast. At the edge the old mill stands still.'
      },
      playerStart: { x: 300, y: 300 },
      spawnFrom: { mill: { x: 150, y: 300 } },   // terug uit de molen: bij het pad links
      depth: { far: 238, near: 318, sFar: 0.6, sNear: 1.08 },   // perspectief: duidelijk kleiner naar achteren

      /* Beloopbare keien op het plein; de fontein (midden-links) en de gebouwen zijn geblokkeerd. */
      walkable: [
        { x: 40,  y: 282, w: 488, h: 36 },   // voorgrond-strook over het hele plein
        { x: 40,  y: 238, w: 110, h: 80 },   // keien links van de fontein
        { x: 268, y: 238, w: 230, h: 80 }    // keien rechts van de fontein (richting de kraampjes)
      ],
      obstacles: [
        { x: 138, y: 200, w: 142, h: 92 },   // de fontein-bak (ruimer: niet er doorheen of er bovenop lopen)
        { x: 452, y: 250, w: 96, h: 68 }     // het kaaskraampje rechts (niet doorheen lopen)
      ],
      overlays: [],
      worldItems: [
        { item: 'feather', hotspot: 'feather', x: 102, y: 270, scale: 0.6, requiresFlag: 'ravenFed' }   // magische veer die de raaf achterliet (kleiner op de grond)
      ],
      npcs: [
        /* Burgemeester Bram in drie standen: bezorgd (begin) → opgelucht met de kaart
           (molen gemaakt) → met lege hand nadat hij de kaart gaf. Weg na de vallei. */
        { id: 'mayorA', sprite: 'mayor', gestureSprite: 'mayorGesture', x: 372, y: 264, scale: 1.18, hideFlag: 'millFixed' },
        { id: 'mayorB', sprite: 'mayorHappy', x: 372, y: 264, scale: 1.18, appearFlag: 'millFixed', hideFlag: 'gotMap' },
        { id: 'mayorC', sprite: 'mayorMap', x: 372, y: 264, scale: 1.18, appearFlag: 'gotMap', hideFlag: 'mayorGone' },
        { id: 'raven', sprite: 'ravenPerch', x: 36, y: 257, scale: 1.15, hideFlag: 'ravenFed' }   // glanzende raaf op de ton (links), 3px hoger
      ],
      fx: {
        /* klaterende fontein op het plein — pas zodra de molen weer draait (anders droog).
           Twee straaltjes (links + rechts); rimpels/knippering iets lager en linkser. */
        fountain: { requiresFlag: 'millFixed', jets: [{ sx: 234, sy: 198 }, { sx: 254, sy: 198 }], len: 13, wx: 232, wy: 244 },
        /* het meisje bij de kraam huilt zodra je haar het gedicht voorleest (tot de traan opgevangen is) */
        cry: { x: 494, y: 221, flag: 'girlCrying', stopFlag: 'gotTear' },
        /* opstijgende (donkere) rook uit twee schoorstenen van de dorpshuizen */
        smoke: [
          { x: 374, y: 50, rise: 46, spread: 9, drift: 6, speed: 3200, puffs: 8 },
          { x: 480, y: 46, rise: 38, spread: 8, drift: 5, speed: 3600, puffs: 7 }
        ]
      },

      hotspots: [
        {
          id: 'mayor',
          name: { nl: 'Burgemeester Bram', en: 'Mayor Bram' },
          rect: { x: 346, y: 186, w: 54, h: 80 },
          walkTo: { x: 366, y: 300 },
          face: 'assets/art/face-mayor.png',
          hideFlag: 'mayorGone',                       // blijft tot je hem de wijn hebt gegeven én het plein opnieuw betreedt
          givesWhen: {                                 // zodra de molen weer draait geeft hij je een leeg flesje om met wijn te vullen
            flag: 'millFixed', setFlag: 'gotWineVial', item: 'vialWine',
            giveText: { nl: 'Burgemeester Bram veegt zijn voorhoofd af. “Je hebt het water teruggebracht, Finn — knap werk! Maar pff, wat een dorst...” Hij vist een leeg glazen flesje uit zijn zak en drukt het je in handen. “Vul dit eens met wijn uit de oude wijnton in de molen, wil je? Dan ben ik je eeuwig dankbaar.” (tap de wijnton in de molen met dit flesje)', en: 'Mayor Bram mops his brow. “You’ve brought the water back, Finn — fine work! But phew, what a thirst...” He fishes an empty glass vial from his pocket and presses it into your hands. “Fill this with wine from the old barrel in the mill, would you? I’d be forever grateful.” (tap the wine barrel in the mill with this vial)' }
          },
          look: (state) => state.flags.gotMap
            ? { nl: 'Burgemeester Bram knikt je bemoedigend toe. “Volg de kaart naar de vallei, Finn — en pas op voor die vreemde lichten.”', en: 'Mayor Bram gives you an encouraging nod. “Follow the map to the valley, Finn — and beware those strange lights.”' }
            : state.flags.millFixed
            ? { nl: 'Burgemeester Bram likt langs zijn lippen. “En, is dat flesje al gevuld met wijn uit de molen? Ik versmacht van de dorst!” (vul het flesje bij de wijnton in de molen en geef het hem)', en: 'Mayor Bram licks his lips. “So, is that flask filled with wine from the mill yet? I’m parched!” (fill the flask at the wine barrel in the mill and give it to him)' }
            : state.flags.metMayor
            ? { nl: 'Burgemeester Bram friemelt zenuwachtig aan zijn ambtsketting. “De molen, Finn — onderzoek toch eens de molen.”', en: 'Mayor Bram fidgets nervously with his chain of office. “The mill, Finn — do go and inspect the mill.”' }
            : { nl: 'Burgemeester Bram strijkt over zijn grijze snor. “Finn, jongen — de fontein loopt leeg en het dorp wordt onrustig. De molen pompt geen water meer. Men fluistert over vreemde lichten in de vallei voorbij het bos... Onderzoek de molen eens.”', en: 'Mayor Bram strokes his grey moustache. “Finn, my boy — the fountain is running dry and the village grows uneasy. The mill pumps no water. They whisper of strange lights in the valley beyond the wood... Go and inspect the mill.”' },
          use: {
            wine: {
              requiresFlag: 'millFixed',
              requiresText: { nl: 'Burgemeester Bram snuift de wijn waarderend op. “Heerlijk, Finn — maar éérst dat water! Krijg de molen weer aan de praat, dan praten we verder.” (repareer eerst de molen)', en: 'Mayor Bram sniffs the wine appreciatively. “Lovely, Finn — but first that water! Get the mill turning again, then we’ll talk.” (fix the mill first)' },
              consume: 'wine',
              give: 'coinGold',
              also: 'map',
              setFlag: ['gotMayorCoin', 'gotMap'],
              text: { nl: 'Je biedt burgemeester Bram het flesje wijn aan. Hij neemt een diepe slok, zucht voldaan en grijpt je dan bij de schouders: “Wat een traktatie, Finn! Je hebt het water teruggebracht én een oude man verkwikt. Hier — een glanzende gouden munt voor jou, én een geheime kaart die je vader me ooit toevertrouwde. Volg het pad voorbij het bos, naar de vallei.” Hij drukt je een gouden munt en een vergeelde kaart in handen. (geef de munt aan de raaf in de vallei)', en: 'You offer Mayor Bram the vial of wine. He takes a deep sip, sighs contentedly, then grips your shoulders: “What a treat, Finn! You’ve brought the water back AND revived an old man. Here — a shiny gold coin for you, AND a secret map your father once entrusted to me. Follow the path beyond the wood, to the valley.” He presses a gold coin and a yellowed map into your hands. (give the coin to the raven in the valley)' }
            }
          },
          setFlag: 'metMayor'
        },
        {
          id: 'raven',
          name: { nl: 'Glanzende Raaf', en: 'Glossy Raven' },
          rect: { x: 12, y: 226, w: 46, h: 44 },
          walkTo: { x: 80, y: 298 },
          face: 'assets/art/face-raven.png',
          hideFlag: 'ravenFed',                        // weg zodra hij is opgevlogen
          look: { nl: 'Een grote, glanzende raaf zit op de oude ton en houdt zijn kop scheef. Zijn kraaloogjes volgen elk glimmend ding dat je bij je hebt. Hij lijkt iets te willen ruilen...', en: 'A big glossy raven sits on the old barrel, cocking its head. Its beady eyes track every shiny thing you carry. It seems to want a trade...' },
          use: {
            coin: {
              consume: 'coin',
              setFlag: 'ravenFed',
              text: { nl: 'De raaf grist het muntje weg en kwettert schor: “Die handelsman bij de kasteelpoort? Geen eerlijke koopman — een díef. Hij heeft iets gestolen wat van het dorp is en verstopt het tussen de vaten op zijn kar. Maar hij houdt zijn waar scherp in de gaten; je moet hem éérst weg zien te lokken. In de molen ligt een oud toverboek dat daarbij kan helpen...” Dan klapwiekt hij weg.', en: 'The raven snatches the coin and rasps: “That merchant by the castle gate? No honest trader — a THIEF. He stole something that belongs to the village and hides it among the barrels on his cart. But he keeps a sharp eye on his wares; you must lure him away first. An old spellbook in the mill might help with that...” Then it flaps off.' }
            }
          }
        },
        {
          id: 'feather',
          name: { nl: 'Glanzende Veer', en: 'Glossy Feather' },
          rect: { x: 80, y: 248, w: 48, h: 46 },
          walkTo: { x: 102, y: 300 },
          appearFlag: 'ravenFed',                        // verschijnt zodra de raaf is weggevlogen
          hideFlag: 'taken_square_feather',
          gives: {
            item: 'feather',
            giveText: { nl: 'Op de keien tussen de ton en de fontein ligt een glanzende blauwzwarte ravenveer zachtjes na te trillen van magie. Je raapt hem voorzichtig op.', en: 'On the cobbles between the barrel and the fountain lies a glossy blue-black raven feather, still quivering faintly with magic. You carefully pick it up.' },
            emptyText: { nl: 'Er ligt verder niets op de ton.', en: 'There’s nothing else on the barrel.' }
          }
        },
        {
          id: 'fountain',
          name: { nl: 'De Fontein', en: 'The Fountain' },
          rect: { x: 132, y: 176, w: 152, h: 92 },
          walkTo: { x: 208, y: 300 },
          look: (state) => state.flags.seenFountain
            ? { nl: 'Het water in de fontein blijft zakken. Zonder de molen komt er geen nieuw water bij.', en: 'The fountain’s water keeps dropping. Without the mill no fresh water comes through.' }
            : { nl: 'Het water in de fontein zakt met de dag. De molen die de bron voedt staat stil — daar moet het misgaan.', en: 'The fountain’s water drops by the day. The mill that feeds the spring stands still — that must be where it goes wrong.' },
          setFlag: 'seenFountain'
        },
        {
          id: 'coin',
          name: { nl: 'Iets Glimmends in de Fontein', en: 'Something Shiny in the Fountain' },
          rect: { x: 158, y: 236, w: 100, h: 44 },
          walkTo: { x: 208, y: 300 },
          hideFlag: 'taken_square_coin',                 // weg zodra opgeraapt (dan werkt de fontein-look weer)
          gives: {
            item: 'coin',
            giveText: { nl: 'Op de bodem van de drooggevallen fontein, tussen de natte stenen, glinstert een oud muntje — ooit door iemand ingegooid als wens. Je raapt het op.', en: 'On the bottom of the dried-up fountain, between the wet stones, an old coin glints — once tossed in as a wish. You pick it up.' },
            emptyText: { nl: 'Verder ligt er niets in het bekken.', en: 'There is nothing else in the basin.' }
          }
        },
        {
          id: 'stall',
          name: { nl: 'Het Meisje bij de Kraam', en: 'The Girl at the Stall' },
          rect: { x: 448, y: 202, w: 114, h: 92 },
          walkTo: { x: 436, y: 306 },
          face: 'assets/art/face-girl.png',
          look: (state) => state.flags.gotTear
            ? { nl: 'Het meisje veegt haar ogen droog en glimlacht dapper naar je. “Dank je voor dat mooie gedicht.”', en: 'The girl dries her eyes and smiles bravely at you. “Thank you for that lovely poem.”' }
            : state.flags.girlCrying
            ? { nl: 'Het meisje huilt zachtjes om het gedicht; een traan glinstert op haar wang. Tik haar aan om die traan op te vangen in een leeg flesje.', en: 'The girl is crying softly over the poem; a tear glistens on her cheek. Tap her to catch that tear in an empty vial.' }
            : state.flags.poemRead
            ? { nl: 'Het meisje kijkt weemoedig voor zich uit. Misschien raakt dat gloeiende gedicht uit de molen haar wel... (gebruik het gedicht op haar)', en: 'The girl gazes wistfully ahead. Perhaps that glowing poem from the mill would move her... (use the poem on her)' }
            : state.flags.gotCheese
            ? { nl: 'Het meisje knikt vriendelijk achter haar kraam vol kaas en fruit. “Smakelijk eten met dat ruiltje!”', en: 'The girl nods kindly behind her stall of cheese and fruit. “Enjoy that trade!”' }
            : { nl: 'Een meisje staat achter haar kraam vol gele kazen en fruit. Ze zucht. “Ik zou zo graag vers brood bakken, maar daar heb ik graan voor nodig — en de molen ligt al weken stil. Breng je me een handvol vers graan? Dan geef ik je met alle plezier een stuk kaas.” (gebruik graan op de kraam)', en: 'A girl stands behind her stall of yellow cheeses and fruit. She sighs. “I’d love to bake fresh bread, but I need grain for that — and the mill has stood still for weeks. Bring me a handful of fresh grain? Then I’ll gladly give you a wedge of cheese.” (use grain on the stall)' },
          givesWhen: {
            flag: 'girlCrying', needItem: 'vialTear', consume: 'vialTear', setFlag: 'gotTear', item: 'tear',
            needText: { nl: 'Het meisje huilt — maar je hebt een leeg flesje nodig om een traan op te vangen. (er staan flesjes in de kast in de molen)', en: 'The girl is crying — but you need an empty vial to catch a tear. (there are vials in the cupboard in the mill)' },
            giveText: { nl: 'Voorzichtig houd je het lege flesje onder haar wang en vangt één glinsterende traan op. Een echte traan van het meisje — een ingrediënt voor de ketel.', en: 'Gently you hold the empty vial to her cheek and catch a single glistening tear. A real tear of the girl — an ingredient for the cauldron.' }
          },
          use: {
            poem: {
              setFlag: 'girlCrying',
              text: { nl: 'Je leest het gloeiende gedicht zachtjes voor aan het meisje. Haar lip trilt, haar ogen lopen vol... en stil begint ze te huilen. Snel — tik haar aan om met een leeg flesje een traan op te vangen!', en: 'You softly read the glowing poem to the girl. Her lip trembles, her eyes brim over... and quietly she begins to cry. Quick — tap her to catch a tear in an empty vial!' }
            },
            grain: {
              consume: 'grain',
              give: 'cheese',
              setFlag: 'gotCheese',
              text: { nl: 'Je legt de handvol graan op de toonbank. Het meisje glimlacht, weegt een fors stuk gele kaas af en drukt het je in handen. “Eerlijke ruil!”', en: 'You set the handful of grain on the counter. The girl smiles, weighs out a hefty wedge of yellow cheese and presses it into your hands. “A fair trade!”' }
            }
          }
        },
        {
          id: 'chessman',
          name: { nl: 'De Oude Schaker', en: 'The Old Chess Player' },
          rect: { x: 312, y: 182, w: 86, h: 92 },
          walkTo: { x: 330, y: 300 },
          appearFlag: 'mayorGone',                      // verschijnt zodra de burgemeester is vertrokken (na de wijn + opnieuw het plein op)
          look: (state) => state.flags.wonChess
            ? { nl: 'De oude man leunt tevreden achterover bij zijn schaakbord. “Goed gespeeld, jongen. Die drakenschub is eerlijk verdiend.”', en: 'The old man leans back contentedly by his chessboard. “Well played, lad. That dragon scale is fairly earned.”' }
            : { nl: 'Op het bankje bij de fontein zit een oude man over een schaakbord gebogen. Hij kijkt op met fonkelende ogen: “De burgemeester? Die is op reis. Maar kom — zet mij mat in drie zetten en ik geef je iets ouds en kostbaars...” (tik hem aan)', en: 'On the bench by the fountain sits an old man hunched over a chessboard. He looks up with twinkling eyes: “The mayor? Off travelling. But come — checkmate me in three moves and I’ll give you something old and precious...” (tap him)' },
          chess: {
            setFlag: 'wonChess',
            give: 'dragonscale',
            doneText: { nl: 'De oude man schuift het schaakbord opzij. “Eén partij per dag, jongen.”', en: 'The old man pushes the board aside. “One game a day, lad.”' },
            winText: { nl: 'Schaakmat! De oude man bulderlacht en klopt je op de schouder. “Briljant! Een belofte is een belofte.” Hij haalt een harde, glanzende DRAKENSCHUB uit zijn jaszak en legt hem in je hand. (een ingrediënt voor de ketel)', en: 'Checkmate! The old man bursts out laughing and pats your shoulder. “Brilliant! A promise is a promise.” He pulls a hard, gleaming DRAGON SCALE from his coat pocket and places it in your hand. (an ingredient for the cauldron)' }
          }
        },
        {
          id: 'toMill',
          name: { nl: 'Pad naar de Molen', en: 'Path to the Mill' },
          rect: { x: 64, y: 158, w: 74, h: 138 },
          walkTo: { x: 118, y: 300 },
          arrow: { x: 96, y: 196, dir: 'up' },
          exit: { to: 'mill', travelText: { nl: 'Je volgt het pad naar de oude molen aan de rand van het dorp...', en: 'You follow the path to the old mill at the edge of the village...' } }
        }
      ]
    },

    mill: {
      name: { nl: 'De Oude Molen', en: 'The Old Mill' },
      bg: 'assets/art/scene-mill.jpg',
      bgVariants: [
        { img: 'assets/art/scene-mill-poem.jpg', flag: 'visited_valley', notFlag: 'poemRead' },   // terug uit de vallei: vlag omhoog; zodra de brief is gepakt weer omlaag
        { img: 'assets/art/scene-mill.jpg' }
      ],
      charFilter: 'sepia(0.3) saturate(1.2) brightness(1.05)',   // warm-gouden opkomende zon, geeliger
      entryText: {
        nl: 'De oude molen op de heuvel. De wieken staan stil en het waterrad aan de zijkant beweegt niet. De deur staat op een kier — hier moet het misgaan met de waterbron.',
        en: 'The old mill on the hill. The sails are still and the water wheel on its side does not turn. The door stands ajar — this must be where the water source fails.'
      },
      playerStart: { x: 300, y: 300 },
      spawnFrom: { millInside: { x: 280, y: 300 }, square: { x: 482, y: 262 }, castle: { x: 92, y: 262 } },   // uit het dorp: rechtsboven; van het kasteel: linksboven
      depth: { far: 250, near: 316, sFar: 0.84, sNear: 1.04 },   // milde diepte: niet te snel kleiner naar de poort   // perspectief: duidelijk kleiner naar achteren
      walkable: [
        { x: 70, y: 250, w: 430, h: 66 }    // het pad / voorgrond vóór de molen
      ],
      obstacles: [],
      overlays: [],
      worldItems: [
        { item: 'berries', hotspot: 'berries', x: 484, y: 296 }   // bessenstruik rechts van het pad (ver naar rechts)
      ],
      npcs: [
        /* De glanzende raaf is vanuit de vallei meegevlogen en zit nu op de wegwijzer; hij wijst je het recept onder de steen. Vliegt weg zodra je het recept hebt. */
        { id: 'ravenMill', sprite: 'ravenPerch', x: 50, y: 196, scale: 0.82, flip: false, appearFlag: 'recipeRevealed', hideFlag: 'gotRecipe', peck: true, peckAmt: 0.4 }
      ],
      fx: {},   // geen glitters bij de brievenbus; de omhoog staande vlag in de achtergrond is de hint
      hotspots: [
        {
          id: 'ravenMill',
          name: { nl: 'Glanzende Raaf', en: 'Glossy Raven' },
          rect: { x: 26, y: 156, w: 54, h: 50 },
          walkTo: { x: 80, y: 300 },
          face: 'assets/art/face-raven.png',
          appearFlag: 'recipeRevealed',
          hideFlag: 'gotRecipe',
          look: { nl: 'De glanzende raaf zit boven op de wegwijzer en kraait schor, terwijl hij met zijn snavel naar de losse steen onder de paal wijst: “Het recept... ónder de steen, onder de steen! Wip hem maar omhoog.”', en: 'The glossy raven perches atop the signpost and rasps, jabbing its beak at the loose stone below the post: “The recipe... UNDER the stone, under the stone! Lever it up.”' },
          setFlag: 'metMillRaven'
        },
        {
          id: 'poem',
          name: { nl: 'De Brievenbus', en: 'The Mailbox' },
          rect: { x: 250, y: 232, w: 52, h: 60 },
          walkTo: { x: 276, y: 306 },
          appearFlag: 'visited_valley',                 // de vlag staat omhoog zodra je terug bent uit de vallei
          gives: {
            item: 'poem',
            setFlag: 'poemRead',                        // vlag van de brievenbus weer omlaag (terug naar molen-Image)
            giveText: { nl: 'De vlag van de brievenbus staat omhoog. Er steekt een opgevouwen, zacht gloeiend briefje in. Finn vouwt het open, leest het en stopt het in zijn tas:\n\n“Klein licht in de mist, zo ver van huis,\nde maan huilt zilver op het ruisende water.\nWie een traan om een ander durft te laten,\nopent de poort die niemand anders vond.”\n\nEen gedicht zonder afzender — dit zou je eens moeten voorlezen aan iemand met verdriet...', en: 'The mailbox flag is up. A folded, softly glowing note pokes out. Finn opens it, reads it and tucks it into his bag:\n\n“Small light in the mist, so far from home,\nthe moon weeps silver on the whispering water.\nWhoever dares to shed a tear for another,\nopens the gate that no one else could find.”\n\nA poem with no sender — you should read this aloud to someone who carries sorrow...' },
            emptyText: { nl: 'De brievenbus is leeg; het gedicht zit in je tas.', en: 'The mailbox is empty; the poem is in your bag.' }
          }
        },
        {
          id: 'berries',
          name: { nl: 'Zwarte Bessen', en: 'Black Berries' },
          rect: { x: 462, y: 278, w: 56, h: 38 },
          walkTo: { x: 474, y: 306 },
          hideFlag: 'taken_mill_berries',
          gives: {
            item: 'berries',
            giveText: { nl: 'Rechts van de molen hangt een struik vol diepzwarte bessen. Je plukt er een handvol van — je vingers kleuren meteen donkerpaars. Hier maak je vast inkt van.', en: 'To the right of the mill grows a bush full of deep-black berries. You pick a handful — your fingers stain dark purple at once. These would surely make ink.' },
            emptyText: { nl: 'De struik is nu leeggeplukt.', en: 'The bush is picked clean now.' }
          }
        },
        {
          id: 'wheel',
          name: { nl: 'Het Waterrad', en: 'The Water Wheel' },
          rect: { x: 326, y: 150, w: 96, h: 96 },
          walkTo: { x: 360, y: 300 },
          look: {
            nl: 'Het grote waterrad aan de zijkant zit muurvast — de as is verbogen. Zo komt er geen water naar het dorp. Het mechaniek dat het rad aandrijft zit bínnen in de molen; ga eens kijken achter die deur.',
            en: 'The great water wheel on the side is jammed — the axle is bent. No water reaches the village like this. The mechanism that drives the wheel is inside the mill; take a look behind that door.'
          },
          setFlag: 'lookedMill'
        },
        {
          id: 'recipeStone',
          name: { nl: 'Een Losse Steen', en: 'A Loose Stone' },
          rect: { x: 44, y: 254, w: 54, h: 42 },
          walkTo: { x: 92, y: 306 },
          appearFlag: 'recipeRevealed',                 // verschijnt zodra de raaf de steen heeft aangewezen
          arrow: { x: 72, y: 244, dir: 'down' },
          gives: {
            item: 'recipe',                              // je pakt het recept als los blaadje op; bekijk je het, dan gaat het in je boek
            flyNpc: 'ravenMill', flyDir: 'right',        // de raaf wiekt op en vliegt weg zodra je het recept hebt
            giveText: { nl: 'Bij de wegwijzer wip je de losse steen omhoog — precies waar de raaf op tikte. Eronder ligt een opgevouwen, vergeeld blaadje: het récept voor de ketel! Je stopt het in je tas. (tik het recept aan om te bekijken; daarna gaat het als bladzijde in je toverboek)', en: 'By the signpost you lever up the loose stone — exactly where the raven tapped. Beneath it lies a folded, yellowed sheet: the RECIPE for the cauldron! You tuck it into your bag. (tap the recipe to view it; then it goes as a page into your spellbook)' },
            emptyText: { nl: 'Onder de steen is verder niets meer.', en: 'There is nothing else under the stone.' }
          }
        },
        {
          id: 'toMillInside',
          name: { nl: 'Deur van de Molen', en: 'Mill Door' },
          rect: { x: 248, y: 198, w: 54, h: 74 },
          walkTo: { x: 280, y: 300 },
          arrow: { x: 262, y: 232, dir: 'up' },
          exit: { to: 'millInside', travelText: { nl: 'Je duwt de zware deur open en stapt de molen binnen...', en: 'You push the heavy door open and step inside the mill...' } }
        },
        {
          id: 'toCastle',
          name: { nl: 'Pad naar het Kasteel', en: 'Path to the Castle' },
          rect: { x: 64, y: 150, w: 74, h: 96 },        // hoger, geen overlap meer met de losse steen eronder
          walkTo: { x: 96, y: 300 },
          arrow: { x: 96, y: 212, dir: 'up' },
          exit: { to: 'castle', travelText: { nl: 'Je neemt het pad over de heuvel naar de kasteelpoort van Eldoria...', en: 'You take the path over the hill to the castle gate of Eldoria...' } }
        },
        {
          id: 'toSquare',
          name: { nl: 'Pad naar het Dorp', en: 'Path to the Village' },
          rect: { x: 446, y: 168, w: 96, h: 144 },
          walkTo: { x: 470, y: 300 },
          arrow: { x: 492, y: 244, dir: 'up' },   // recht omhoog, hoger op het pad naar het dorp
          exit: { to: 'square', travelText: { nl: 'Je volgt het pad terug omhoog naar het dorp.', en: 'You follow the path back up to the village.' } }
        }
      ]
    },

    millInside: {
      name: { nl: 'In de Molen', en: 'Inside the Mill' },
      bg: 'assets/art/scene-mill-inside.jpg',
      bgVariants: [
        { img: 'assets/art/scene-mill-inside-grain.jpg', flag: 'millFixed' },   // molen draait weer → verse graanzak verschijnt
        { img: 'assets/art/scene-mill-inside.jpg' }                              // begin: geen graan
      ],
      charFilter: 'sepia(0.3) saturate(1.12) brightness(0.78)',   // Finn staat in de schemerige molen: wat donkerder (schaduw)
      entryText: {
        nl: 'Binnen is het schemerig en stoffig; zonnestralen vallen door de raampjes op de grote maalsteen en het houten tandrad. Het rad staat stokstijf stil — hier wordt het water tegengehouden.',
        en: 'Inside it is dim and dusty; sunbeams fall through the small windows onto the great millstone and the wooden gear. The wheel stands dead still — this is where the water is held back.'
      },
      playerStart: { x: 300, y: 300 },
      depth: { far: 214, near: 314, sFar: 1.45, sNear: 1.45 },   // vaste, grotere schaal: binnen krimp je NIET naar achteren
      walkable: [
        { x: 60, y: 256, w: 470, h: 60 }    // de stenen vloer op de voorgrond
      ],
      obstacles: [],
      overlays: [],
      worldItems: [],
      npcs: [
        { id: 'mouse', sprite: 'mouse', x: 179, y: 188, scale: 0.44, flip: false, peck: true, peckAmt: 0.45, filter: 'brightness(0.82)', hideFlag: 'wineTapLoose' }   // muisje hoog naast de wijnton; knabbelt rustig (peck) en verdwijnt zodra je hem kaas geeft (wineTapLoose)
      ],
      fx: {
        glints: [{ x: 374, y: 256, flag: 'millFixed', col: '255,228,150' }]   // de graanzak glinstert zodra de molen weer maalt (hint om op te pakken)
      },
      hotspots: [
        {
          id: 'millstone',
          name: { nl: 'De Maalsteen', en: 'The Millstone' },
          rect: { x: 196, y: 150, w: 150, h: 110 },
          walkTo: { x: 270, y: 300 },
          look: {
            nl: 'De zware ronde maalsteen en de houten pers erboven. Alles zit onder een laag meel en stof — er is hier al weken niet gemalen. Iets blokkeert het mechaniek.',
            en: 'The heavy round millstone and the wooden press above it. Everything is under a layer of flour and dust — nothing has been milled here for weeks. Something is jamming the mechanism.'
          },
          setFlag: 'sawMillstone'
        },
        {
          id: 'gear',
          name: { nl: 'Het Tandrad', en: 'The Gear Wheel' },
          rect: { x: 348, y: 124, w: 96, h: 120 },
          walkTo: { x: 380, y: 300 },
          gears: {
            needItem: 'millwheel',
            needText: {
              nl: 'Eén rad ontbreekt: het zware molenrad zit niet in de voorraad. Dat is weggesleept naar de kar bij het kasteel — vind het eerst, dan kun je het radwerk maken.',
              en: 'One gear is missing: the heavy mill wheel isn’t in the tray. It was hauled off to the cart by the castle — find it first, then you can fix the gearworks.'
            },
            title: { nl: 'Het Molenradwerk', en: 'The Mill Gearworks' },
            hint: { nl: 'Je hebt het molenrad! Sleep de 5 radjes op maat op hun plek zodat het rad weer aangrijpt.', en: 'You have the mill wheel! Drag the 5 gears into place (by size) so the wheel engages again.' },
            setFlag: 'millFixed',
            solvedText: { nl: 'Je zet het zware molenrad terug en de radjes grijpen aan. Met een diep gekraak komt de MOLEN weer in beweging — het waterrad draait, water klatert weer door de goot, en de maalsteen begint te malen: er wordt weer GRAAN gemaakt! Pak een handvol vers graan; daar kun je vast iemand blij mee maken. (kijk rond in de molen)', en: 'You set the heavy mill wheel back and the gears engage. With a deep groan the MILL starts turning again — the water wheel spins, water gushes down the channel once more, and the millstone begins to grind: fresh GRAIN is being made again! Grab a handful of fresh grain; it’s bound to make someone happy. (look around the mill)' }
          },
          look: {
            nl: 'Het grote houten tandrad draait weer soepel; het waterrad buiten klatert. (wordt vervolgd)',
            en: 'The big wooden gear turns smoothly again; the water wheel outside splashes. (to be continued)'
          },
          setFlag: 'foundJam'
        },
        {
          id: 'vial',
          name: { nl: 'Stoffige Flesjes', en: 'Dusty Bottles' },
          rect: { x: 14, y: 58, w: 104, h: 56 },
          walkTo: { x: 96, y: 300 },
          gives: {
            item: 'vialInk',
            also: ['vialTear', 'vialFly'],
            setFlag: 'gotVials',
            giveText: { nl: 'In de kast staan oude flesjes. Je neemt er drie lege glazen flesjes met kurk mee: voor de inkt (van de bessen), voor de traan van het meisje, en eentje om straks vuurvliegjes in te vangen.', en: 'Old bottles stand in the cupboard. You take three empty corked glass vials: for the ink (from the berries), the girl’s tear, and one to catch fireflies in later.' },
            emptyText: { nl: 'De andere flesjes zijn gebarsten of vol spinrag.', en: 'The other bottles are cracked or full of cobwebs.' }
          }
        },
        {
          id: 'bookTable',
          name: { nl: 'Open Molenaarsboek', en: 'Open Miller’s Book' },
          rect: { x: 18, y: 150, w: 120, h: 44 },
          walkTo: { x: 108, y: 300 },
          zoomImg: 'assets/art/book-hint.jpg',   // kleur-volgorde (1→6) + de schrijf-hint (bessen-inkt + ravenveer → boek)
          setFlag: 'readMillBook',
          look: {
            nl: 'Op de tafel ligt een opengeslagen molenaarsboek. In de kantlijn is een rij gekleurde stippen getekend, genummerd van 1 tot 6 — dát moet de volgorde zijn waarin je de boeken lostrekt. (tik het boek aan om het goed te bekijken)',
            en: 'An open miller’s book lies on the table. In the margin a row of coloured dots is drawn, numbered 1 to 6 — that must be the order to pull the books. (tap the book to study it)'
          }
        },
        {
          id: 'books',
          name: { nl: 'Vastzittende Boeken', en: 'Stuck Books' },
          rect: { x: 10, y: 118, w: 112, h: 48 },
          walkTo: { x: 96, y: 300 },
          bookPuzzle: {
            title: { nl: 'De Vastzittende Boeken', en: 'The Stuck Books' },
            hint: { nl: 'Trek de zes boeken in de juiste kleur-volgorde (de stippen in het molenaarsboek helpen).', en: 'Pull the six books in the right colour order (the dots in the miller’s book help).' },
            setFlag: 'gotSpellbook',
            gives: 'spellbook',
            img: 'assets/art/puzzle-books6.png',
            sequence: ['blauw', 'paars', 'rood', 'groen', 'oranje', 'geel'],
            books: [
              { key: 'rood',   label: { nl: 'Rood',   en: 'Red' },    color: '#e07a64' },
              { key: 'blauw',  label: { nl: 'Blauw',  en: 'Blue' },   color: '#79ace8' },
              { key: 'groen',  label: { nl: 'Groen',  en: 'Green' },  color: '#84c06f' },
              { key: 'geel',   label: { nl: 'Geel',   en: 'Yellow' }, color: '#e8cc5a' },
              { key: 'paars',  label: { nl: 'Paars',  en: 'Purple' }, color: '#b07ad0' },
              { key: 'oranje', label: { nl: 'Oranje', en: 'Orange' }, color: '#e8995a' }
            ],
            zones: [
              { key: 'rood',   left: 9,    top: 8, width: 10, height: 76 },
              { key: 'blauw',  left: 22.5, top: 8, width: 10, height: 76 },
              { key: 'groen',  left: 36,   top: 8, width: 10, height: 76 },
              { key: 'geel',   left: 49.5, top: 8, width: 10, height: 76 },
              { key: 'paars',  left: 63,   top: 8, width: 10, height: 76 },
              { key: 'oranje', left: 76.5, top: 8, width: 10, height: 76 }
            ],
            solvedText: { nl: 'Met een klik schiet de laatste band los en een verborgen vakje klapt open — een oud TOVERBOEK glijdt in je handen! Maar als je het opent zijn alle bladzijden léég... Hier hoort een spreuk geschreven te worden, met de juiste pen en inkt.', en: 'With a click the last spine springs loose and a hidden compartment pops open — an old SPELLBOOK slides into your hands! But when you open it every page is blank... A spell needs to be written here, with the right pen and ink.' },
            resetText: { nl: 'Knars! Alle boeken klemmen weer vast. Begin opnieuw — kijk goed naar de stippen.', en: 'Crunch! All the books jam shut again. Start over — study the dots carefully.' }
          }
        },
        {
          id: 'grain',
          name: { nl: 'Graanzak', en: 'Grain Sack' },
          rect: { x: 320, y: 224, w: 116, h: 80 },
          walkTo: { x: 360, y: 300 },
          requiresFlag: 'millFixed',             // pas vers graan zodra de molen weer maalt
          blockedText: { nl: 'De maalsteen staat stil — er is nog geen vers graan. Krijg eerst de molen weer aan de praat.', en: 'The millstone is still — there’s no fresh grain yet. Get the mill running again first.' },
          gives: {
            item: 'grain',
            repeat: true,                          // je kunt telkens vers graan scheppen (voor de muis én de kaasruil)
            giveText: { nl: 'Nu de molen weer maalt, ligt er een opengevallen zak vol vers goudgeel graan bij de maalsteen. Je schept een handvol in je tas.', en: 'Now the mill grinds again, an open sack of fresh golden grain stands by the millstone. You scoop a handful into your bag.' },
            haveText: { nl: 'Je hebt al een handvol graan in je tas.', en: 'You already have a handful of grain in your bag.' }
          }
        },
        {
          id: 'mouse',
          name: { nl: 'Een Bruine Muis', en: 'A Brown Mouse' },
          rect: { x: 150, y: 158, w: 60, h: 44 },   // pal op het muisje naast de wijnton (waar het ook getekend staat)
          walkTo: { x: 178, y: 300 },
          hideFlag: 'wineTapLoose',                 // is weg zodra hij de tap heeft losgeknaagd (net als het muis-sprite)
          face: 'assets/art/face-mouse.png',
          look: (state) => state.flags.mouseFed
            ? { nl: 'Het muisje knabbelt tevreden aan het graan. “Mmm, dank je, vriendelijke reus! De molenaar? Die is naar het kasteel om hulp te vragen — volg het pad maar. Piep!”', en: 'The little mouse nibbles the grain happily. “Mmm, thank you, kind giant! The miller? He went to the castle for help — just follow the path. Squeak!”' }
            : { nl: 'Een klein bruin muisje kijkt je met glanzende kraaloogjes aan. “Piep! Niet schrikken, hoor. Het is hier zo stil sinds het rad stilstaat... heb jij misschien iets te knabbelen voor me?”', en: 'A little brown mouse looks up at you with shiny beady eyes. “Squeak! Don’t be startled. It’s been so quiet since the wheel stopped... do you maybe have something to nibble?”' },
          use: {
            grain: {
              consume: 'grain',
              setFlag: 'mouseFed',
              text: { nl: 'Je strooit wat graan voor het muisje. Het knabbelt blij en piept: “Heerlijk! Zoek je de molenaar? Hij ging het pad op naar het kasteel — daar zoeken ze ook naar de bron.”', en: 'You scatter some grain for the mouse. It nibbles happily and squeaks: “Delicious! Looking for the miller? He took the path to the castle — they’re searching for the spring there too.”' }
            },
            cheese: {
              consume: 'cheese',
              setFlag: 'wineTapLoose',
              text: { nl: 'Je geeft het muisje het stuk kaas. Verrukt klimt het op de wijnton en knaagt net zo lang aan de vastgeroeste tap tot die loslaat. “Piep! Nu kun je wijn aftappen — met een leeg flesje!”', en: 'You give the mouse the wedge of cheese. Delighted, it climbs onto the wine barrel and gnaws at the rusted tap until it comes loose. “Squeak! Now you can draw wine — with an empty vial!”' }
            }
          }
        },
        {
          id: 'winebarrel',
          name: { nl: 'De Wijnton', en: 'The Wine Barrel' },
          rect: { x: 158, y: 116, w: 74, h: 78 },
          walkTo: { x: 178, y: 300 },
          look: (state) => state.flags.gotWine
            ? { nl: 'De oude wijnton met de nu losse tap. Je flesje zit vol diep robijnrode wijn.', en: 'The old wine barrel with its now-loosened tap. Your vial is full of deep ruby-red wine.' }
            : state.flags.wineTapLoose
            ? { nl: 'De tap van de wijnton zit nu los, dankzij de muis. Met een leeg flesje kun je er wijn uittappen. (gebruik een leeg flesje op de ton)', en: 'The wine barrel’s tap is loose now, thanks to the mouse. With an empty vial you can draw wine. (use an empty vial on the barrel)' }
            : { nl: 'Een dikke oude wijnton tegen de muur. De tap zit muurvast en half verstopt achter de duigen — met je grote handen krijg je er met geen mogelijkheid bij. Iets kleins en behendigs zou wél bij die tap kunnen...', en: 'A fat old wine barrel against the wall. The tap is jammed tight and half-hidden behind the staves — with your big hands you can’t reach it at all. Something small and nimble could get to that tap, though...' },
          use: {
            vialWine: {
              requiresFlag: 'wineTapLoose',
              requiresText: { nl: 'De tap zit nog muurvast en je krijgt er niet bij — er moet eerst iets kleins de tap losmaken.', en: 'The tap is still jammed and out of reach — something small must loosen it first.' },
              consume: 'vialWine',
              give: 'wine',
              setFlag: 'gotWine',
              text: { nl: 'Je houdt het lege flesje onder de losgemaakte tap en draait hem open. Diep robijnrode wijn klokt naar binnen tot het flesje vol is. Je kurkt het stevig dicht.', en: 'You hold the empty vial under the loosened tap and turn it open. Deep ruby-red wine glugs in until the vial is full. You cork it tightly.' }
            }
          }
        },
        {
          id: 'outMill',
          name: { nl: 'Naar Buiten', en: 'Back Outside' },
          rect: { x: 60, y: 286, w: 50, h: 30 },
          walkTo: { x: 88, y: 302 },
          arrow: { x: 86, y: 306, dir: 'down' },
          exit: { to: 'mill', travelText: { nl: 'Je stapt de molen weer uit, het ochtendlicht in.', en: 'You step back out of the mill into the morning light.' } }
        }
      ]
    },

    castle: {
      name: { nl: 'De Kasteelpoort', en: 'The Castle Gate' },
      bg: 'assets/art/scene-castle.png',
      charFilter: 'sepia(0.3) saturate(1.2) brightness(1.05)',   // zelfde warme ochtendzon
      heroShade: 0.87,                                            // Finn iets donkerder bij de poort (meer in de schaduw)
      entryText: {
        nl: 'De poort van kasteel Eldoria, aan het einde van de brug. Een handkar vol vaten en kruiken staat verlaten bij de muur. Het poortmechaniek — een radwerk van tandwielen — is uit elkaar gevallen, zodat de poort niet opengaat.',
        en: 'The gate of castle Eldoria, at the end of the bridge. A handcart full of barrels and jugs stands abandoned by the wall. The gate mechanism — a clockwork of gears — has fallen apart, so the gate will not open.'
      },
      playerStart: { x: 300, y: 300 },
      depth: { far: 250, near: 316, sFar: 0.84, sNear: 1.04 },   // milde diepte: niet te snel kleiner naar de poort
      walkable: [
        { x: 120, y: 256, w: 400, h: 60 },   // de geplaveide weg vóór de poort
        { x: 330, y: 214, w: 130, h: 102 }   // pad omhoog naar de poort (zodat je naar de wacht kunt lopen)
      ],
      obstacles: [],
      overlays: [],
      worldItems: [],
      npcs: [
        { id: 'guard', sprite: 'guard', x: 402, y: 222, scale: 1.32, sway: true, hideFlag: 'guardFled' },   // poortwacht met hellebaard (iets groter); verdwijnt zodra de drakenspreuk hem op de vlucht jaagt
        { id: 'merchant', sprite: 'merchantLeft', x: 286, y: 282, scale: 1.12, filter: 'brightness(0.6)', scanSprites: ['merchantLeft', 'merchantFwd', 'merchantRight', 'merchantSly'], aweSprites: ['merchantSurprised', 'merchantAwe'], aweFlag: 'merchantDistracted', turnFlag: 'merchantDistracted', stopFlag: 'taken_castle_cart', scareFlag: 'dragonScare' },   // sneaky handelsman: kijkt verbaasd óm naar de dansende bloem; en kijkt opnieuw stomverbaasd op als de drakenschaduw voorbij komt
        { id: 'ravenCart', sprite: 'ravenPerch', x: 80, y: 198, scale: 0.95, appearFlag: 'ravenFed', hideFlag: 'taken_castle_cart', peck: true },   // de raaf landt iets links op de kar en pikt naar de ton waar het molenrad ligt (hint)
        { id: 'flower', sprite: 'flowerWhite', x: 444, y: 264, scale: 0.29, filter: 'brightness(0.76)', danceFlag: 'flowerDancing', danceStopFlag: 'taken_castle_cart' },   // (dansende) bloem in de schaduw van de poort — donkerder
        { id: 'flower2', sprite: 'flowerWhite', x: 431, y: 267, scale: 0.21, filter: 'brightness(0.76)', danceFlag: 'flowerDancing', danceStopFlag: 'taken_castle_cart' },
        { id: 'flower3', sprite: 'flowerWhite', x: 457, y: 267, scale: 0.2, filter: 'brightness(0.76)', danceFlag: 'flowerDancing', danceStopFlag: 'taken_castle_cart' },
        { id: 'flower4', sprite: 'flowerWhite', x: 420, y: 263, scale: 0.18, filter: 'brightness(0.76)', danceFlag: 'flowerDancing', danceStopFlag: 'taken_castle_cart' },
        { id: 'flower5', sprite: 'flowerWhite', x: 468, y: 262, scale: 0.19, filter: 'brightness(0.76)', danceFlag: 'flowerDancing', danceStopFlag: 'taken_castle_cart' }
      ],
      fx: {},
      hotspots: [
        {
          id: 'guard',
          name: { nl: 'De Poortwacht', en: 'The Gate Guard' },
          rect: { x: 362, y: 140, w: 76, h: 138 },
          walkTo: { x: 388, y: 284 },
          face: 'assets/art/face-guard.png',
          look: (state) => state.flags.gateOpen
            ? { nl: 'De wacht plant grinnikend zijn hellebaard neer en lacht bulderend. “Hahá! Het radwerk draait weer, knap werk hoor, knul — maar híer kom je echt niet langs! Niemand het kasteel in zonder zegel, en al helemáál geen ukkie als jij. Ik sta hier dag en nacht en ik ben voor niemand of níéts bang!” Hij verspert breeduit de poort en knipoogt. (misschien helpt een machtige spreuk...)', en: 'The guard plants his halberd with a smirk and a booming laugh. “Haha! The gearworks turns again, fine work, lad — but you’re NOT getting past HERE! No one enters the castle without a seal, least of all a little squirt like you. I stand here day and night and I’m afraid of no one and NOTHING!” He blocks the gate wide and winks. (perhaps a mighty spell could help...)' }
            : { nl: 'Een brede poortwacht in een blauw tabbaard verspert lachend de weg. “Hahá, jíj? Loop maar door, ventje — het kasteel blijft dicht zolang de bron droog staat, en die poort krijg je tóch niet open: het radwerk ernaast ligt eruit. Ik hou hier de wacht, en ik ben voor niemand bang, voor jou al helemaal niet!” Hij knikt grijnzend naar het mechaniek naast de poort.', en: 'A burly gate guard in a blue tabard blocks the way, laughing. “Haha, YOU? Run along, little man — the castle stays shut while the spring runs dry, and you won’t open that gate anyway: the gearworks beside it is busted. I keep this watch, and I’m afraid of no one — least of all you!” He nods with a grin at the mechanism beside the gate.' },
          castWith: {
            item: 'dragonspell',
            requiresFlag: 'dragonSpellLearned',
            setFlag: 'guardFled',
            dragonSequence: true,        // speelt eerst de drakenschaduw-flyby + verbaasde wacht/handelsman af; daarna verschijnt de pijl naar binnen
            needText: { nl: 'Je voelt dat hier een machtige spreuk nodig is om langs de wacht te komen — maar zo’n spreuk ken je nog niet.', en: 'You sense it would take a mighty spell to get past the guard — but you don’t know one like that yet.' },
            text: { nl: 'Je heft je staf hoog en spreekt met donderende stem de DRAKENSPREUK: “Draconis Umbra!” Boven de poort rijst een kolossale, vuurogige drakenschaduw op die de hele muur verduistert en een loeiend gebrul laat klinken. De poortwacht verbleekt, laat zijn hellebaard kletterend vallen en vlucht gillend door de poort naar binnen. De weg naar kasteel Eldoria ligt open — loop nu de poort binnen! (een pijl wijst naar binnen)', en: 'You raise your staff high and speak the DRAGON SPELL in a thundering voice: “Draconis Umbra!” Above the gate a colossal, fire-eyed dragon shadow rears up, darkening the whole wall with a roaring bellow. The guard turns pale, drops his halberd with a clatter and flees screaming through the gate. The way to castle Eldoria lies open — step through the gate now! (an arrow points inside)' }
          },
          setFlag: 'metGuard'
        },
        {
          id: 'cart',
          name: { nl: 'De Handkar', en: 'The Handcart' },
          rect: { x: 20, y: 168, w: 166, h: 120 },
          walkTo: { x: 150, y: 300 },
          requiresFlag: 'merchantDistracted',
          blockedText: {
            nl: 'De raaf zit boven op de kar en pikt naar één plek tussen de vaten — dáár ligt een zwaar ijzeren MOLENRAD, precies wat de molen nodig heeft! Maar de handelsman houdt zijn kar scherp in de gaten. Je moet hem eerst afleiden.',
            en: 'The raven perches atop the cart, pecking at one spot between the barrels — there lies a heavy iron MILL WHEEL, exactly what the mill needs! But the merchant watches his cart closely. You must distract him first.'
          },
          gives: {
            item: 'millwheel',
            flyNpc: 'ravenCart', flyDir: 'left',         // de raaf wiekt op en vliegt weg naar de vallei
            giveText: { nl: 'De handelsman staart gebiologeerd naar de dansende bloem. Snel grist je het zware ijzeren molenrad tussen de vaten vandaan en stopt het weg. Hebbes! De betovering ebt weg — de bloemen vallen stil — en de raaf wiekt op en vliegt weg, richting de mistige vallei.', en: 'The merchant gawks at the dancing flower. Quickly you snatch the heavy iron mill wheel from between the barrels and stash it. Got it! The enchantment fades — the flowers fall still — and the raven takes wing, flying off toward the misty valley.' },
            emptyText: { nl: 'Verder ligt er niets bruikbaars in de kar.', en: 'Nothing else useful is in the cart.' }
          }
        },
        {
          id: 'flower',
          name: { nl: 'Witte Bloemen', en: 'White Flowers' },
          rect: { x: 404, y: 238, w: 76, h: 60 },
          walkTo: { x: 440, y: 300 },
          look: (state) => state.flags.flowerDancing
            ? { nl: 'De bloemen zwieren uitbundig heen en weer; de handelsman kan zijn ogen er niet vanaf houden.', en: 'The flowers sway wildly to and fro; the merchant can’t take his eyes off them.' }
            : { nl: 'Een groep bloemen naast de poort, met één grote ertussen. Als die eens zouden gaan dansen... (lees je toverboek)', en: 'A cluster of flowers by the gate, one big one among them. If only they would dance... (read your spellbook)' },
          castWith: {
            item: 'spellbook',
            requiresFlag: 'spellWritten',
            setFlag: ['flowerDancing', 'merchantDistracted'],
            needText: { nl: 'Je voelt dat hier magie kan werken, maar je kent de spreuk nog niet. Misschien staat er iets in een toverboek...', en: 'You sense magic could work here, but you don’t know the spell yet. Perhaps a spellbook holds one...' },
            emptyText: { nl: 'Je slaat het toverboek open, maar de bladzijden zijn leeg — je moet de spreuk er eerst nog ín schrijven (met een inktveer).', en: 'You open the spellbook, but the pages are blank — you must write the spell into it first (with an ink-dipped feather).' },
            text: { nl: 'Je slaat het toverboek open en spreekt de spreuk uit. De grote bloem schiet wakker en begint uitbundig te DANSEN! De handelsman draait zich verbaasd om en loopt er gebiologeerd naartoe — zijn kar staat nu onbewaakt.', en: 'You open the spellbook and speak the spell. The big flower springs awake and begins to DANCE wildly! The merchant turns in astonishment and wanders over, transfixed — his cart now stands unguarded.' }
          }
        },
        {
          id: 'merchant',
          name: { nl: 'De Handelsman', en: 'The Merchant' },
          rect: { x: 186, y: 212, w: 64, h: 96 },
          walkTo: { x: 206, y: 300 },
          face: 'assets/art/face-merchant.png',
          look: (state) => state.flags.merchantDistracted
            ? { nl: 'De handelsman staart met open mond naar de dansende bloem. “Wat... een dánsende bloem? Ongelooflijk!” Hij let totaal niet meer op zijn kar.', en: 'The merchant gapes at the dancing flower. “What... a DANCING flower? Incredible!” He pays no attention to his cart at all.' }
            : { nl: 'Een gezette handelsman bewaakt zijn volgeladen kar. “Afblijven, jochie — dit is allemaal koopwaar. Tenzij je goud hebt zeker?”', en: 'A portly merchant guards his loaded cart. “Hands off, lad — this is all merchandise. Unless you’ve got gold?”' },
          setFlag: 'metMerchant'
        },
        {
          id: 'bridgeGears',
          name: { nl: 'Het Poortradwerk', en: 'The Gate Gearworks' },
          rect: { x: 300, y: 96, w: 150, h: 176 },
          walkTo: { x: 372, y: 300 },
          look: {
            nl: 'Het poortradwerk is volledig uit elkaar gevallen en zwaar verroest — hier valt voorlopig niets te repareren. (De molen heeft net zo’n radwerk — dáár, met het molenrad, ligt jouw echte klus.)',
            en: 'The gate gearworks has completely fallen apart and is badly rusted — nothing to repair here for now. (The mill has a gearworks just like this — there, with the mill wheel, lies your real task.)'
          },
          setFlag: 'sawGateGears'
        },
        {
          id: 'gateIn',
          name: { nl: 'De Open Poort', en: 'The Open Gate' },
          rect: { x: 360, y: 120, w: 84, h: 150 },        // de poortopening; verschijnt zodra de wacht is gevlucht
          walkTo: { x: 400, y: 284 },
          arrow: { x: 400, y: 150, dir: 'up' },           // pijl wijst naar binnen (de poort in)
          appearFlag: 'guardFled',
          endGame: true,
          enterText: { nl: 'Je stapt door de wijd open poort, kasteel Eldoria binnen. De drakenschaduw cirkelt nog na in de lucht. Voor je rijst het machtige kasteel op, waar ergens je vader gevangen zit... Een nieuw avontuur begint. (Deel 2)', en: 'You step through the wide-open gate, into castle Eldoria. The dragon-shadow still circles overhead. Before you the mighty castle rises, where your father is held captive somewhere... A new adventure begins. (Part 2)' }
        },
        {
          id: 'toMill',
          name: { nl: 'Terug naar de Molen', en: 'Back to the Mill' },
          rect: { x: 126, y: 262, w: 92, h: 54 },
          walkTo: { x: 156, y: 300 },
          arrow: { x: 150, y: 292, dir: 'down' },
          exit: { to: 'mill', travelText: { nl: 'Je daalt het pad weer af naar de molen.', en: 'You head back down the path to the mill.' } }
        },
        {
          id: 'toValley',
          name: { nl: 'Het Pad naar de Vallei', en: 'The Path to the Valley' },
          rect: { x: 22, y: 112, w: 132, h: 62 },        // achter de handkar (links), wijst weg de vallei in
          walkTo: { x: 150, y: 284 },
          arrow: { x: 74, y: 138, dir: 'up' },
          appearFlag: 'gotMap',                          // verschijnt zodra je de geheime kaart hebt
          exit: { to: 'valley', travelText: { nl: 'Met de geheime kaart in de hand volg je het pad achter de kar langs, voorbij het bos, de mistige vallei in...', en: 'With the secret map in hand you follow the path past the cart, beyond the wood, into the misty valley...' } }
        }
      ]
    },

    valley: {
      name: { nl: 'De Mistige Vallei', en: 'The Misty Valley' },
      bg: 'assets/art/scene-valley.jpg',
      bgVariants: [
        { img: 'assets/art/scene-valley-after.jpg', flag: 'witchDefeated' },  // heks verslagen → de blauwe magie dooft, rustige vallei
        { img: 'assets/art/scene-valley-magic.jpg', flag: 'valleyMagic' },    // ketel ontstoken → alles gloeit blauw
        { img: 'assets/art/scene-valley.jpg' }
      ],
      charFilter: 'sepia(0.12) saturate(1.05) brightness(1.0)',   // koeler, mistig ochtendlicht
      heroShade: 0.87,                                             // Finn iets donkerder in de mistige vallei (meer in de schaduw)
      entryText: {
        nl: 'Voorbij het bos opent zich de vallei uit de geheime kaart: een oude runencirkel van steen, met staande runenstenen en in het hart een grote stenen ketel. Hier, waar je vaders kaart eindigt, begint Finns volgende avontuur...',
        en: 'Beyond the wood the valley from the secret map opens up: an ancient rune circle of stone, with standing rune-stones and a great stone cauldron at its heart. Here, where your father’s map ends, Finn’s next adventure begins...'
      },
      playerStart: { x: 250, y: 300 },                       // meer in het midden bij aankomst
      spawnFrom: { castle: { x: 250, y: 300 } },
      depth: { far: 252, near: 304, sFar: 0.94, sNear: 1.06 },   // veel mildere diepte: je wordt minder snel klein naar achteren
      walkable: [
        { x: 56, y: 248, w: 452, h: 68 }    // de runencirkel — je kunt nu verder omhoog lopen tot bij de ketel
      ],
      obstacles: [],
      overlays: [],
      worldItems: [],
      npcs: [
        /* De heks staat nu LINKS van de ketel; een rust-lus (heks-idle) speelt zodra je in de vallei bent, tijdens de strijd haar battle-animatie. */
        { id: 'witch', sprite: 'witch', lure: 'witchBeckon', idleFrames: 'heks-idle', battleFrames: 'heks-spreuk', x: 198, y: 228, scale: 0.84, hideFlag: 'witchDefeated' },
        /* De glanzende raaf zit op de linker fakkel/brazier achter in de cirkel; vliegt weg zodra hij het recept heeft 'aangewezen'. */
        { id: 'ravenValley', sprite: 'ravenPerch', x: 38, y: 207, scale: 0.95, hideFlag: 'recipeRevealed' },
        /* De blauwe drakensteen die na het gevecht op de grond valt; glinstert blauw tot je hem opraapt. */
        { id: 'stoneGround', sprite: 'ring', x: 202, y: 246, scale: 0.42, glow: '120,200,255', bob: true, appearFlag: 'witchDefeated', hideFlag: 'gotRing' },
        /* Lichtgevende lavendelbloemen rechtsonder (groter, dichter bijeen) met blauw licht; ze dansen + lokken vuurvliegjes na de dans-spreuk. */
        { id: 'vflower1', sprite: 'flowerLavender', x: 452, y: 305, scale: 0.42, glow: '130,190,255', danceFlag: 'valleyFlowersDancing', danceStopFlag: 'gotFireflight' },
        { id: 'vflower2', sprite: 'flowerLavender', x: 470, y: 309, scale: 0.34, glow: '130,190,255', danceFlag: 'valleyFlowersDancing', danceStopFlag: 'gotFireflight' },
        { id: 'vflower3', sprite: 'flowerLavender', x: 487, y: 304, scale: 0.39, glow: '130,190,255', danceFlag: 'valleyFlowersDancing', danceStopFlag: 'gotFireflight' },
        /* Kleine lichtgevende lavendelbloemen (lichtblauw) linksonder — iets kleiner en iets naar rechts; dansen mee tot je de vuurvliegjes hebt gevangen. */
        { id: 'vflowerL1', sprite: 'flowerLavender', x: 94, y: 300, scale: 0.16, glow: '130,190,255', danceFlag: 'valleyFlowersDancing', danceStopFlag: 'gotFireflight' },
        { id: 'vflowerL2', sprite: 'flowerLavender', x: 110, y: 304, scale: 0.13, glow: '130,190,255', danceFlag: 'valleyFlowersDancing', danceStopFlag: 'gotFireflight' },
        { id: 'vflowerL3', sprite: 'flowerLavender', x: 126, y: 300, scale: 0.15, glow: '130,190,255', danceFlag: 'valleyFlowersDancing', danceStopFlag: 'gotFireflight' }
      ],
      fx: {
        fireflies: 18,                                       // meer dwaallichtjes boven de mist
        fireflyCols: ['120,180,255', '150,230,120'],         // afwisselend blauw en groen
        flowerFlies: { x: 470, y: 300, flag: 'valleyFlowersDancing', stopFlag: 'gotFireflight', glow: true },   // dansende, lichtgevende vuurvliegjes bij de rechter bloemen (na de dans-spreuk; weg zodra je ze vangt)
        smoke: [{ x: 286, y: 160, rise: 60, spread: 11, drift: 3, speed: 3400, puffs: 8 }],   // grotere, hogere dampende rook uit de ketel
        mist: { bands: 8, y: 178, alpha: 0.2, around: { x: 240, y: 190, rx: 280, ry: 66 }, aroundAlpha: 0.42 }   // nog hogere, brede grondmist
      },
      /* De tovenaars-strijd: zodra alle drie de ingrediënten in de ketel zitten, wordt de heks
         boos. Uit de ketel klinken raadsels — klik op de gloeiende steen met het juiste dier-symbool.
         De laatste is de draak. Win je, dan verdwijnt de heks en leer je de drakenspreuk. */
      duel: {
        /* De 4 staande stenen (monolieten) in de cirkel; klik de steen met het juiste dier-rune-teken.
           signY = waar het blauwe rune-teken bóven de steen zweeft; fire = blauwe vlam uit die 'fakkel'. */
        stones: [
          { x: 40,  y: 150, signY: 70,  sym: '🐺', rune: 'runeWolf'  },
          { x: 176, y: 138, signY: 84,  sym: '🦉', rune: 'runeOwl'   },
          { x: 392, y: 138, signY: 84,  sym: '🐍', rune: 'runeSnake' },
          { x: 528, y: 150, signY: 70,  sym: '🐉', rune: 'runeDragon'}
        ],
        /* De 4 fakkels (vuurbakens) waaruit blauw vuur slaat — los van de stenen.
           De 2 voorste (links/rechts) staan lager + groter; de 2 achterste blijven hoger. */
        fires: [
          { x: 28,  y: 184, h: 40 },   // voorste links — 2px naar rechts + 2px omlaag
          { x: 540, y: 184, h: 40 },   // voorste rechts — 2px naar links + 2px omlaag
          { x: 120, y: 112, h: 24 },   // achterste links
          { x: 432, y: 120, h: 24 }    // achterste rechts
        ],
        cauldron: { x: 286, y: 144, h: 48 },   // de ketel spuwt blauw vuur — iets meer omhoog
        intro: { nl: 'Zodra het laatste ingrediënt de ketel raakt, laait er BLAUW vuur op! De heks gilt van woede: “Bemoei je niet met mijn magie, jochie!” Uit de borrelende ketel klinken spookachtige stemmen met raadsels. Boven de stenen gloeien dier-tekens — klik telkens op het juiste dier!', en: 'The moment the last ingredient hits the cauldron, BLUE fire erupts! The witch shrieks with rage: “Keep your hands off my magic, boy!” From the bubbling cauldron come ghostly voices with riddles. Animal signs glow above the stones — click the right beast each time!' },
        rounds: [
          { sym: '🐺', riddle: { nl: 'Een stem fluistert: “Ik huil naar de maan en jaag in een roedel door de nacht. Roep mijn beest!”', en: 'A voice whispers: “I howl at the moon and hunt in a pack through the night. Summon my beast!”' } },
          { sym: '🦉', riddle: { nl: 'De ketel sist: “Ik zie alles in het donker en zit zo stil op mijn tak dat niemand mij hoort. Roep mij!”', en: 'The cauldron hisses: “I see all in the dark and sit so still on my branch that none can hear me. Summon me!”' } },
          { sym: '🐍', riddle: { nl: 'Een stem kronkelt: “Ik heb geen poten, glijd door het gras en sis met een gespleten tong. Roep mij!”', en: 'A voice coils: “I have no legs, I glide through the grass and hiss with a forked tongue. Summon me!”' } },
          { sym: '🐉', riddle: { nl: 'De laatste stem dondert: “Nu het machtigste beest! Ik draag schubben, spuw vuur en heers over de hele hemel. Roep het!”', en: 'The final voice thunders: “Now the mightiest beast! I wear scales, breathe fire and rule the whole sky. Summon it!”' } }
        ],
        wrongText: { nl: 'De heks kakelt schril: “MIS! Verkeerd beest, hapje!” Een groene vonk knettert langs je oor. Lees het raadsel nog eens en kies opnieuw.', en: 'The witch cackles shrilly: “WRONG! Wrong beast, morsel!” A green spark crackles past your ear. Read the riddle again and choose anew.' },
        winText: { nl: 'Bij de draak schiet een ENORME vuurdraak uit de stenen omhoog en buldert naar de heks! Ze krijst, verdwijnt in een wolk groene rook — en daaruit fladdert een kwakende KIKKER met twee fladderende vleugeltjes, die klapwiekend de lucht in vlucht! Waar ze stond valt met een heldere tik een gloeiende blauwe RING op de grond. (raap de ring op)', en: 'At the dragon a HUGE fire-drake bursts up from the stones and roars at the witch! She shrieks, vanishes in a cloud of green smoke — and out of it flutters a croaking winged FROG, two little wings flapping, taking off into the sky! Where she stood a glowing blue RING drops to the ground with a clear chime. (pick up the ring)' },
        setFlag: ['witchDefeated']
      },
      hotspots: [
        {
          id: 'dragonStone',
          name: { nl: 'De Drakenring', en: 'The Dragon Ring' },
          rect: { x: 176, y: 224, w: 60, h: 52 },
          walkTo: { x: 204, y: 300 },
          appearFlag: 'witchDefeated',                 // ligt pas op de grond nadat de heks verslagen is
          hideFlag: 'gotRing',
          arrow: { x: 200, y: 216, dir: 'down' },
          gives: {
            item: 'ring', also: 'dragonspell', setFlag: ['gotRing', 'dragonSpellLearned', 'ringWorn'],
            giveText: { nl: 'Je raapt de gloeiende blauwe drakenring op en schuift hem om je vinger. De diepblauwe magie stroomt door je hand recht in je toverboek — razendsnel schrijft de DRAKENSPREUK, “Draconis Umbra”, zich met oplichtende letters op een nieuwe bladzijde! Je kent nu de drakenspreuk. (de spreuk staat rechts in je tas, en op een nieuwe bladzijde in je boek)', en: 'You pick up the glowing blue dragon ring and slip it onto your finger. The deep-blue magic flows through your hand straight into your spellbook — in a flash the DRAGON SPELL, “Draconis Umbra”, writes itself in glowing letters on a fresh page! You now know the dragon spell. (the spell is on the right in your bag, and on a new page in your book)' },
            emptyText: { nl: 'Er ligt verder niets.', en: 'There’s nothing else here.' }
          }
        },
        {
          id: 'witch',
          name: { nl: 'De Oude Heks', en: 'The Old Witch' },
          rect: { x: 128, y: 146, w: 134, h: 158 },
          walkTo: { x: 224, y: 308 },
          hideFlag: 'witchDefeated',
          look: {
            nl: 'Een kromme oude heks met een punthoed leunt op haar pollepel-staf naast de ketel. Ze wenkt je met een knokige vinger.',
            en: 'A hunched old witch with a pointed hat leans on her ladle-staff beside the cauldron. She beckons you with a bony finger.'
          },
          choice: {
            doneFlag: 'metWitch',   // alleen bij de allereerste ontmoeting in de vallei; daarna gewoon de 'look'
            prompt: { nl: 'De heks lonkt met een knokige vinger en haar ogen glinsteren gevaarlijk: “Kom toch dichterbij, lekker hapje... kruip in mijn warme ketel, dan maak ik je groot en machtig, dat beloof ik je...” Wat doe je?', en: 'The witch beckons with a bony finger, her eyes glinting dangerously: “Come closer, you tasty morsel... climb into my warm cauldron and I’ll make you big and mighty, I promise...” What do you do?' },
            options: [
              { label: { nl: 'Luisteren', en: 'Listen' }, text: { nl: 'Als in trance doe je een stap naar de dampende ketel... nog één... maar vlak voor de rand ruk je jezelf met een schok terug! Bijna had ze je gekookt. Deze heks is voor geen cent te vertrouwen — verzamel liever de juiste ingrediënten.', en: 'As if in a trance you step toward the steaming cauldron... one more... but right at the rim you wrench yourself back with a jolt! She nearly cooked you. This witch cannot be trusted one bit — better gather the right ingredients instead.' } },
              { label: { nl: 'Wantrouwen', en: 'Distrust' }, text: { nl: 'Je klemt je staf vast en blijft op veilige afstand. “Ik trap er niet in, heks. Ik vertrouw je voor geen cent.” Ze sist teleurgesteld en roert nors in haar ketel. Verzamel de juiste ingrediënten voor het recept.', en: 'You grip your staff and keep your distance. “I’m not falling for it, witch. I don’t trust you one bit.” She hisses, disappointed, and stirs her cauldron sourly. Gather the right ingredients for the recipe.' } }
            ]
          },
          setFlag: 'metWitch'
        },
        {
          id: 'cauldron',
          name: { nl: 'De Stenen Ketel', en: 'The Stone Cauldron' },
          rect: { x: 238, y: 124, w: 96, h: 116 },        // groter + hoger klikgebied
          walkTo: { x: 286, y: 300 },
          look: (state) => state.flags.valleyMagic
            ? { nl: 'De ketel laait met blauw vuur en de runen op alle stenen gloeien. De magie van de vallei is ontwaakt... (wordt vervolgd)', en: 'The cauldron blazes with blue fire and the runes on every stone glow. The valley’s magic has awoken... (to be continued)' }
            : { nl: 'Een oude stenen ketel in het hart van de runencirkel. In de rand staan tekens gekrast: een traan, een vuurvlieg en een draak. Gooi de drie ingrediënten erin om de magie te wekken.', en: 'An ancient stone cauldron at the heart of the rune circle. Symbols are carved into its rim: a tear, a firefly and a dragon. Throw the three ingredients in to wake the magic.' },
          use: {
            tear:        { consume: 'tear',        setFlag: 'cauldron_tear',        burst: { x: 286, y: 182 }, text: { nl: 'Je giet de traan uit het flesje in de ketel. Het water rimpelt zilverig en er stijgen blauwe lichtjes op.', en: 'You pour the tear from the vial into the cauldron. The water ripples silver and blue sparks rise up.' } },
            fireflight:  { consume: 'fireflight',  setFlag: 'cauldron_fireflight',  burst: { x: 286, y: 182 }, text: { nl: 'Je laat het gevangen vuurvlieglicht boven de ketel los. Het zweeft naar binnen tussen een wolk blauwe lichtjes.', en: 'You release the cupped firefly light over the cauldron. It drifts in amid a cloud of blue sparks.' } },
            dragonscale: { consume: 'dragonscale', setFlag: 'cauldron_dragonscale', burst: { x: 286, y: 182 }, text: { nl: 'Je laat de drakenschub in de ketel zakken. Het sist, dampt en spettert blauwe vonken.', en: 'You lower the dragon scale into the cauldron. It hisses, steams and spatters blue sparks.' } }
          },
          combo: {
            needFlags: ['cauldron_tear', 'cauldron_fireflight', 'cauldron_dragonscale'],
            setFlag: 'valleyMagic',
            startDuel: true,                 // i.p.v. winnen: de heks wordt boos en de stenen-strijd begint
            burst: { x: 286, y: 175 }
          }
        },
        {
          id: 'fireflight',
          name: { nl: 'De Lavendelbloemen', en: 'The Lavender Flowers' },
          rect: { x: 424, y: 250, w: 100, h: 74 },
          walkTo: { x: 470, y: 306 },
          look: (state) => state.flags.gotFireflight
            ? { nl: 'De lavendelbloemen wiegen nog zachtjes na. Je hebt al een flesje vol vuurvliegjes.', en: 'The lavender flowers still sway gently. You’ve already caught a vial of fireflies.' }
            : state.flags.valleyFlowersDancing
            ? { nl: 'De lavendelbloemen dansen en een wolk groen-blauwe vuurvliegjes danst mee. Tik ze aan om er een paar in een flesje te vangen.', en: 'The lavender flowers are dancing and a cloud of green-blue fireflies dances along. Tap them to catch a few in a vial.' }
            : { nl: 'Lichtgevende lavendelbloemen met zacht blauw licht. Ze staan stil... misschien gaan ze dansen als je je dans-spreuk uitspreekt?', en: 'Glowing lavender flowers with a soft blue light. They stand still... perhaps they would dance if you cast your dance-spell?' },
          use: {
            vialFly: {
              requiresFlag: 'valleyFlowersDancing',
              requiresText: { nl: 'De vuurvliegjes slapen nog. Spreek eerst je dans-spreuk uit, dan komen ze tevoorschijn.', en: 'The fireflies are still asleep. Cast your dance-spell first to draw them out.' },
              consume: 'vialFly', give: 'fireflight', setFlag: 'gotFireflight',
              text: { nl: 'Je houdt het lege flesje open tussen de dansende bloemen en vangt een paar dwarrelende vuurvliegjes — groene en blauwe vonkjes die zachtjes ronddwalen. Het flesje gloeit nu zacht. (gooi dit in de ketel)', en: 'You hold the empty vial open among the dancing flowers and catch a few drifting fireflies — green and blue sparks softly wandering inside. The vial now glows softly. (throw this into the cauldron)' }
            }
          }
        },
        {
          id: 'ravenValley',
          name: { nl: 'De Glanzende Raaf', en: 'The Glossy Raven' },
          rect: { x: 16, y: 182, w: 54, h: 60 },
          walkTo: { x: 86, y: 300 },
          face: 'assets/art/face-raven.png',
          hideFlag: 'recipeRevealed',                  // weg zodra hij het recept heeft aangewezen
          look: { nl: 'Op de oude runensteen zit dezelfde glanzende raaf van het dorpsplein, kop scheef. Zijn kraaloogjes glinsteren zodra je iets glimmends bij je hebt — hij wil duidelijk weer ruilen.', en: 'On the old rune-stone perches the same glossy raven from the village square, head cocked. Its beady eyes glint at anything shiny you carry — it clearly wants to trade again.' },
          givesWhen: {
            flag: 'visited_valley', needItem: 'coinGold', consume: 'coinGold', setFlag: 'recipeRevealed', flyNpc: 'ravenValley', flyDir: 'right',
            needText: { nl: 'De raaf tikt ongeduldig met zijn snavel — hij wil iets glimmends. (geef de burgemeester de wijn, dan krijg je een muntje)', en: 'The raven taps impatiently with its beak — it wants something shiny. (give the mayor the wine and he’ll hand you a coin)' },
            giveText: { nl: 'De raaf grist het muntje weg en krast traag, alsof hij een recept opzegt: “Eén drakenschub... één traan van een onschuldige... en het licht van een vuurvliegje.” Dan wijst hij met zijn snavel richting de molen, klapwiekt op en vliegt weg — bij de molen tikt hij op een losse steen links. Daaronder moet iets liggen...', en: 'The raven snatches the coin and rasps slowly, as if reciting a recipe: “One dragon scale... one tear of an innocent... and the light of a firefly.” Then it points its beak toward the mill, takes wing and flies off — by the mill it taps a loose stone on the left. Something must lie beneath it...' }
          }
        },
        {
          id: 'lights',
          name: { nl: 'De Dwaallichten', en: 'The Wandering Lights' },
          rect: { x: 226, y: 92, w: 130, h: 46 },
          walkTo: { x: 296, y: 300 },
          look: {
            nl: 'Zachtblauwe lichtjes zweven boven de mist achter de cirkel, alsof ze je dieper de vallei in willen lokken. Het briefje had gelijk: “volg de lichten in de vallei.”',
            en: 'Soft blue lights hover over the mist behind the circle, as if luring you deeper into the valley. The note was right: “follow the lights in the valley.”'
          },
          setFlag: 'sawValleyLights'
        },
        {
          id: 'toCastle',
          name: { nl: 'Terug naar de Poort', en: 'Back to the Gate' },
          rect: { x: 14, y: 250, w: 86, h: 66 },
          walkTo: { x: 56, y: 300 },
          arrow: { x: 38, y: 260, dir: 'down' },   // pijl wat meer naar links
          exit: { to: 'castle', travelText: { nl: 'Je keert terug langs het pad naar de kasteelpoort.', en: 'You head back up the path to the castle gate.' } }
        }
      ]
    }
  }
};
