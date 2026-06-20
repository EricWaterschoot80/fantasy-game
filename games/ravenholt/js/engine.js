/* ============================================================
   engine.js — pixel-adventure engine van "De Amulet van Emberfall"
   Verhaal in data.js (GAME, tweetalig); graphics: AI-art in
   assets/art/ met procedurele pixel-fallback (sprites/scenes.js).

   Systemen: lopen + botsing (walkable/obstacles), voorgrond-
   occlusie (overlays), zwervende NPC's, volgorde-puzzels,
   doodsmechaniek, generatieve muziek + sfx, NL/EN, partikels.
   ============================================================ */

(() => {
  'use strict';

  /* ---------- DOM ---------- */
  const canvas      = document.getElementById('game');
  const ctx         = canvas.getContext('2d');
  const elLabel     = document.getElementById('hotspot-label');
  const elQuest     = document.getElementById('quest');
  const elHintBtn   = document.getElementById('hintBtn');
  const elSoundBtn  = document.getElementById('soundBtn');
  const elLangBtn   = document.getElementById('langBtn');
  const elInfoBtn   = document.getElementById('infoBtn');
  const elMsg       = document.getElementById('msg');
  const elMsgText   = document.getElementById('msgText');
  const elMsgMore   = document.getElementById('msgMore');
  const elBubble    = document.getElementById('bubble');
  const elBubbleTxt = document.getElementById('bubbleText');
  const elBubbleFace= document.getElementById('bubbleFace');
  const elMsgFace   = document.getElementById('msgFace');
  const elToast     = document.getElementById('toast');
  const elInvbar    = document.getElementById('invbar');
  const elSpellBtn  = document.getElementById('spellBtn');
  const elTitle     = document.getElementById('title-screen');
  const elWin       = document.getElementById('win-screen');
  const elWinText   = document.getElementById('winText');
  const elDeath     = document.getElementById('death-screen');
  const elDeathText = document.getElementById('deathText');
  const elStartBtn  = document.getElementById('startBtn');
  const elPrologue     = document.getElementById('prologue-screen');
  const elPrologueImg  = document.getElementById('prologue-img');
  const elPrologueText = document.getElementById('prologue-text');
  const elPrologueTap  = document.getElementById('prologue-tap');
  const elPrologueSkip = document.getElementById('prologue-skip');
  const elReplayBtn = document.getElementById('replayBtn');
  const elWinNext   = document.getElementById('winNextBtn');
  const elRetryBtn  = document.getElementById('retryBtn');
  const elZoom      = document.getElementById('zoom-screen');
  const elZoomImg   = document.getElementById('zoom-img');
  const elCutscene  = document.getElementById('cutscene-screen');
  const elCutsceneVid = document.getElementById('cutscene-video');
  const elCutsceneSkip = document.getElementById('cutscene-skip');

  const MIN_SLOTS = 6;
  const WALK_SPEED = 80;
  const ARRIVE_DIST = 4;

  /* ---------- Taal ---------- */
  let lang = 'nl';
  try { lang = localStorage.getItem('emberfall_lang') || 'nl'; } catch (e) { /* prima */ }
  const L = (v) => v == null ? '' : (typeof v === 'string' ? v : (v[lang] || v.nl || ''));

  function applyLang() {
    document.documentElement.lang = lang;
    elLangBtn.textContent = lang === 'nl' ? 'EN' : 'NL';
    document.getElementById('title-h1').innerHTML =
      GAME.titleLines[lang].map(s => `<span>${s}</span>`).join('<br>');
    document.getElementById('title-sub').textContent = L(GAME.ui.subtitle);
    document.getElementById('title-intro').textContent = L(GAME.ui.intro);
    elStartBtn.textContent = L(GAME.ui.startBtn);
    const cr = document.getElementById('title-credit');
    if (cr) cr.textContent = L(GAME.ui.credit);
    document.getElementById('win-h1').textContent = L(GAME.ui.winTitle);
    elWinText.textContent = L(GAME.winText);
    elReplayBtn.textContent = L(GAME.ui.replayBtn);
    if (elWinNext && GAME.ui.playOther) elWinNext.textContent = L(GAME.ui.playOther);
    document.getElementById('death-h1').textContent = L(GAME.ui.deathTitle);
    elDeathText.textContent = L(GAME.ui.deathText);
    elRetryBtn.textContent = L(GAME.ui.retryBtn);
    document.getElementById('rotate-h1').textContent = L(GAME.ui.rotateTitle);
    document.getElementById('rotate-text').textContent = L(GAME.ui.rotateText);
    elMsgMore.textContent = L(GAME.ui.tapContinue);
    updateQuest(true);
    renderInventory();
  }

  /* ---------- Art assets (data-driven) ----------
     Scene-achtergrond: scene.bg (PNG 568×320) — valt terug op de fallback-
       painter in scenes.js als het bestand ontbreekt.
     Wissel-achtergronden: scene.bgVariants:[{img, flag?, notFlag?}] — de eerste
       variant waarvan de flag-conditie klopt wint (bv. open vs. dichte poort).
     Sprites: GAME.sprites = { key: 'pad.png' }; een NPC verwijst via zijn
       sprite-naam naar zo'n key. */
  const AV = GAME.assetVer ? ('?v=' + GAME.assetVer) : '';
  const ART = { scenes: {}, sprites: GAME.sprites || {} };
  for (const [id, sc] of Object.entries(GAME.scenes)) {
    if (sc.bg) ART.scenes[id] = sc.bg;
  }
  const art = { scenes: {}, sprites: {}, items: {}, overlays: {}, variants: {} };
  for (const [id, sc] of Object.entries(GAME.scenes)) {
    (sc.bgVariants || []).forEach((v) => {
      if (!v.img || art.variants[v.img]) return;
      const im = new Image();
      im.onload = () => { if (id === state.currentScene) paintBackground(); };
      im.src = v.img + AV;
      art.variants[v.img] = im;
    });
  }
  function overlayImg(src) {
    if (!art.overlays[src]) {
      const img = new Image();
      img.src = src + AV;
      art.overlays[src] = img;
    }
    return art.overlays[src];
  }
  for (const [id, src] of Object.entries(ART.scenes)) {
    const img = new Image();
    img.onload = () => { if (id === state.currentScene) paintBackground(); };
    img.src = src + AV;
    art.scenes[id] = img;
  }
  /* Laadscherm: wacht tot alle scène-achtergronden (incl. wissel-varianten) geladen zijn,
     zodat ze op mobiel niet halverwege ontbreken. Met een progressiebalk en een veiligheids-timeout. */
  (function preloadGate() {
    const elLoad = document.getElementById('loading-screen');
    if (!elLoad) return;
    const bgImgs = [...Object.values(art.scenes), ...Object.values(art.variants)];
    const total = bgImgs.length || 1;
    const elFill = document.getElementById('loading-fill');
    const elPct = document.getElementById('loading-pct');
    const t0 = performance.now();
    let done = false;
    function tick() {
      if (done) return;
      const n = bgImgs.filter((im) => im.complete).length;   // 'complete' = geladen óf mislukt (mislukt valt terug op de painter)
      const pct = Math.min(100, Math.round(n / total * 100));
      if (elFill) elFill.style.width = pct + '%';
      if (elPct) elPct.textContent = 'Laden… ' + pct + '%';
      if (n >= total || performance.now() - t0 > 9000) {
        done = true;
        if (elFill) elFill.style.width = '100%';
        setTimeout(() => { elLoad.hidden = true; }, 220);
        return;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();
  for (const [id, src] of Object.entries(ART.sprites)) {
    const img = new Image();
    img.src = src + AV;
    art.sprites[id] = img;
  }
  /* Frame-reeksen voor geanimeerde npcs (de heks): map -> aantal frames (01..NN.png). */
  art.frames = {};
  const FRAME_SEQS = { 'heks': 17, 'heks-idle': 8, 'heks-spreuk': 17 };
  for (const [name, count] of Object.entries(FRAME_SEQS)) {
    art.frames[name] = [];
    for (let i = 1; i <= count; i++) {
      const img = new Image();
      img.src = 'assets/art/' + name + '/' + String(i).padStart(2, '0') + '.png' + AV;
      art.frames[name].push(img);
    }
  }
  for (const [id, item] of Object.entries(GAME.items)) {
    if (item.img && typeof item.img === 'string') {
      const img = new Image();
      img.src = item.img + AV;
      art.items[id] = img;
    }
  }
  const ready = (img) => img && img.complete && img.naturalWidth > 0;

  /* ---------- State ---------- */
  function newState() {
    return { currentScene: GAME.startScene, inventory: (GAME.startItems || []).slice(), flags: {}, selectedItem: null };
  }
  let state = newState();

  const start0 = GAME.scenes[GAME.startScene].playerStart;
  const player = {
    x: start0.x, y: start0.y,
    target: null, pending: null,
    dir: 'down', flip: false,
    phase: 0, stepAcc: 0
  };

  /* Trouwe hond die je volgt zodra hij gered is (over alle velden) */
  const follower = { active: false, x: 0, y: 0, flip: true, phase: 0, scared: false };

  /* Runtime-posities van NPC's (zwerven / patrouilleren) */
  let npcRt = {};
  function initNpcs() {
    npcRt = {};
    for (const npc of (GAME.scenes[state.currentScene].npcs || [])) {
      npcRt[npc.id] = {
        x: npc.x, y: npc.y, baseX: npc.x, baseY: npc.y,
        target: null, phase: 0, pauseUntil: 0, flip: false
      };
    }
  }

  let started    = false;
  let msgQueue   = [];
  let pendingWin = false;
  let minoWalk = null;        // animatie: minotaur loopt naar de schaal en valt in slaap
  let ravenFly = null;        // animatie: de raaf vliegt weg richting de molen
  let castGlow = null;        // animatie: Finns staf gloeit op wanneer hij de spreuk uitspreekt
  let dragonShadow = null;    // animatie: voorbijvliegende drakenschaduw bij de drakenspreuk op de wachter
  let witchPoof = null;       // animatie: de heks lost op in een wolk groene rook zodra ze verslagen is
  let witchFrog = null;       // animatie: uit de rook springt een vliegende kikker (met hoedje) die wegfladdert
  let amuletRiseT0 = 0;       // moment waarop de amulet omhoog begint te schuiven
  let revive     = null;   // win-viering: bladeren komen tot leven in het bos
  let hintUntil  = 0;
  let labelTimer = null;
  let lastPopItem = null;
  let marker = null;
  /* Standaard geluid AAN, maar in de preview (localhost / 127.0.0.1) UIT — zo speelt er
     geen geluid mee tijdens het testen. Op de echte site blijft geluid gewoon aan. */
  const isPreview = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname);
  let soundOn = !isPreview;
  let infoOpen = false;          // de tip (quest) staat verstopt onder de (i)-knop

  const fade = { mode: null, t0: 0, dur: 280 };
  const dust = [];
  const embers = [];
  let fireflies = [];

  /* ---------- Geluid: synth-sfx + mysterieuze ambient ---------- */
  let actx = null;
  function ac() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) actx = new AC();
    }
    if (actx && actx.state === 'suspended') actx.resume();
    return actx;
  }
  function tone(freq, dur, { type = 'sine', vol = 0.12, delay = 0, slide = 0, dest = null } = {}) {
    const a = ac(); if (!a) return;
    const t0 = a.currentTime + delay;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
    o.connect(g).connect(dest || a.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function sfx(name) {
    if (!soundOn) return;
    try {
      switch (name) {
        case 'tap':     tone(900, 0.05, { vol: 0.05 }); break;
        case 'step':    tone(190, 0.045, { type: 'triangle', vol: 0.03 }); break;
        case 'pickup':  tone(660, 0.12, { vol: 0.1 }); tone(990, 0.2, { delay: 0.09, vol: 0.1 }); break;
        case 'combine': tone(420, 0.25, { type: 'triangle', slide: -240, vol: 0.11 });
                        tone(640, 0.18, { delay: 0.18, vol: 0.08 }); break;
        case 'use':     tone(330, 0.12, { type: 'triangle', vol: 0.09 }); break;
        case 'error':   tone(140, 0.18, { type: 'square', vol: 0.05 }); break;
        case 'travel':  tone(280, 0.4, { type: 'triangle', slide: -160, vol: 0.07 }); break;
        case 'sleep':   tone(120, 0.5, { type: 'sine', slide: -50, vol: 0.1 });
                        tone(90, 0.6, { delay: 0.4, slide: -30, vol: 0.09 }); break;
        case 'growl':   tone(95, 0.35, { type: 'sawtooth', slide: -25, vol: 0.06 }); break;
        case 'bark':    tone(620, 0.07, { type: 'square', vol: 0.05 });
                        tone(540, 0.09, { delay: 0.12, type: 'square', vol: 0.05 }); break;
        case 'gate':    tone(70, 0.8, { type: 'sawtooth', slide: 30, vol: 0.07 });
                        tone(140, 0.5, { delay: 0.5, type: 'triangle', slide: -40, vol: 0.06 }); break;
        case 'death':   tone(220, 0.5, { type: 'sawtooth', slide: -150, vol: 0.09 });
                        tone(60, 0.7, { delay: 0.3, type: 'sine', slide: -20, vol: 0.12 }); break;
        case 'win':     [523, 659, 784, 1047].forEach((f, i) =>
                          tone(f, 0.34, { delay: i * 0.13, vol: 0.11 })); break;
      }
    } catch (e) { /* audio mag nooit het spel breken */ }
  }

  /* Generatieve ambient: lage drone + trage mineurakkoorden + sprankels */
  const music = { started: false, master: null, timer: null };
  const MUSIC_CHORDS = [
    [110, 130.8, 164.8],   // Am
    [87.3, 110, 130.8],    // F
    [82.4, 98, 123.5],     // Em
    [73.4, 87.3, 110]      // Dm
  ];
  let chordIdx = 0;
  function playChord() {
    const a = actx; if (!a || !soundOn) return;
    const t0 = a.currentTime + 0.05;
    const ch = MUSIC_CHORDS[chordIdx++ % MUSIC_CHORDS.length];
    for (const f of ch) {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.018, t0 + 2.8);
      g.gain.linearRampToValueAtTime(0.0001, t0 + 7.8);
      o.connect(g).connect(music.master);
      o.start(t0); o.stop(t0 + 8);
    }
    // sprankel: een verre, echoënde pentatonische noot
    if (Math.random() < 0.85) {
      const PENT = [523.25, 587.33, 659.25, 783.99, 880];
      const n = PENT[(Math.random() * PENT.length) | 0];
      const dt = 1 + Math.random() * 4;
      tone(n, 1.2, { delay: dt, vol: 0.014, dest: music.master });
      tone(n, 1.0, { delay: dt + 0.32, vol: 0.006, dest: music.master });
    }
  }
  /* Achtergrondmuziek: 'Cistern Syntax' in een lus; valt terug op de generatieve
     ambient-synth als het mp3-bestand (nog) ontbreekt. */
  let bgMusic = null;
  const DEFAULT_MUSIC = 'assets/audio/whispers-of-the-forgotten.mp3';
  function startSynthFallback() {
    const a = ac(); if (!a || music.master) return;
    music.master = a.createGain();
    music.master.gain.value = soundOn ? 1 : 0;
    music.master.connect(a.destination);
    for (const f of [55, 55.35, 82.5]) {        // donkere drone, licht ontstemd
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.value = 0.011;
      o.connect(g).connect(music.master);
      o.start();
    }
    playChord();
    music.timer = setInterval(playChord, 8000);
  }
  function startMusic() {
    if (music.started) return;
    music.started = true;
    try {
      bgMusic = new Audio(DEFAULT_MUSIC + AV);
      bgMusic.loop = true;
      bgMusic.volume = soundOn ? 0.18 : 0;
      bgMusic.addEventListener('error', startSynthFallback, { once: true });
      bgMusic.play().catch(() => {});
    } catch (e) { startSynthFallback(); }
  }
  /* Mobiel (iOS/Android) blokkeert audio tot een gebruikersgebaar: start de muziek + ontwaak de
     AudioContext bij de allereerste aanraking/klik/toets, mocht de start-knop het gemist hebben. */
  ['pointerdown', 'touchstart', 'keydown'].forEach((ev) => {
    window.addEventListener(ev, function kick() {
      try { const a = ac(); if (a && a.state === 'suspended') a.resume(); } catch (e) {}
      startMusic();
      ['pointerdown', 'touchstart', 'keydown'].forEach((e2) => window.removeEventListener(e2, kick));
    }, { once: true, passive: true });
  });

  /* Oogje: laat kort zien waar je iets kunt onderzoeken/oppakken/heen kunt (hotspot-omlijningen). */
  const elEyeBtn = document.getElementById('eyeBtn');
  if (elEyeBtn) elEyeBtn.addEventListener('click', () => { hintUntil = performance.now() + 2800; sfx('tap'); });
  /* Dev-knop: spring direct naar de vallei met de spullen voor de ketel/strijd (alles behalve de
     gevangen vuurvliegjes — wél het lege flesje-pad via de bloemen — plus de dans-spreuk). */
  const elDevValley = document.getElementById('devValleyBtn');
  if (elDevValley) elDevValley.addEventListener('click', () => {
    sfx('tap');
    if (!started) { if (elTitle) elTitle.hidden = true; started = true; }
    if (elPrologue) elPrologue.hidden = true;
    Object.assign(state.flags, {
      metMayor: true, millFixed: true, gotMayorCoin: true, gotMap: true, mayorGone: true,
      spellWritten: true, recipeRevealed: true, poemRead: true, wonChess: true,
      visited_square: true, visited_mill: true, visited_castle: true
    });
    for (const it of ['tear', 'dragonscale', 'spell', 'vialFly']) if (!state.inventory.includes(it)) state.inventory.push(it);
    state.selectedItem = null;
    renderInventory();
    updateSpellBtn();
    updateQuest();
    travelTo('valley');
  });

  elSoundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    const icon = document.getElementById('soundIcon');
    if (icon) icon.src = soundOn ? 'assets/icons/ui-sound-on.png' : 'assets/icons/ui-sound-off.png';
    if (music.master) music.master.gain.value = soundOn ? 1 : 0;
    /* iOS negeert audio.volume → ook pauzeren zodat 'uit' echt stil is */
    if (bgMusic) {
      bgMusic.volume = soundOn ? 0.18 : 0;
      if (soundOn) bgMusic.play().catch(() => {}); else { try { bgMusic.pause(); } catch (e) {} }
    }
    if (soundOn) sfx('tap');
  });

  elLangBtn.addEventListener('click', () => {
    lang = lang === 'nl' ? 'en' : 'nl';
    try { localStorage.setItem('emberfall_lang', lang); } catch (e) { /* prima */ }
    applyLang();
  });

  /* ---------- Render-buffers (2× supersampled voor scherpere, gedetailleerde art) ---------- */
  const SS = 3;                       // supersample-factor: interne buffers op 3× detail (scherpere, gedetailleerde art)
  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = SCENE_W * SS; bgCanvas.height = SCENE_H * SS;
  const bgCtx = bgCanvas.getContext('2d');

  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = SCENE_W * SS; frameCanvas.height = SCENE_H * SS;
  const fctx = frameCanvas.getContext('2d');

  /* Sommige (oudere) mobiele browsers ondersteunen ctx.filter op canvas NIET — dan worden de
     schaduw/contrast-filters op de personages (brightness/contrast) genegeerd en zien Finn en de
     koopman er op mobiel te licht uit met harde zwarte lijnen. We detecteren dat en passen de
     verdonkering/lijn-verzachting dan handmatig toe via een tijdelijk canvas (per sprite). */
  const FILTER_OK = (() => {
    if (window.__noFilter || /[?&]nofilter=1/.test(location.search)) return false;   // debug: forceer de mobiele fallback ook op desktop
    try {
      if (!('filter' in fctx)) return false;
      /* Niet alleen kíjken of de property gezet kán worden (dat lukt op iOS Safari óók als
         het filter bij het tekenen wordt genegeerd), maar écht een witte pixel door een
         verdonkerend filter tekenen op DIT canvas en teruglezen of hij donkerder werd. */
      const t = document.createElement('canvas'); t.width = 4; t.height = 4;
      const tx = t.getContext('2d'); tx.fillStyle = '#ffffff'; tx.fillRect(0, 0, 4, 4);
      fctx.save();
      fctx.setTransform(1, 0, 0, 1, 0, 0);
      fctx.clearRect(0, 0, 4, 4);
      fctx.filter = 'brightness(0.35)';
      fctx.drawImage(t, 0, 0);
      fctx.filter = 'none';
      let px = null;
      try { px = fctx.getImageData(1, 1, 1, 1).data; } catch (e) { px = null; }
      fctx.clearRect(0, 0, 4, 4);
      fctx.restore();
      return !!px && px[3] > 200 && px[0] < 200;   // wit (255) écht verdonkerd → ctx.filter rendert
    } catch (e) { return false; }
  })();
  let currentTint = null;                 // gezet door drawPlayer/drawNpc als ctx.filter NIET werkt
  const tintCanvas = document.createElement('canvas');
  const tctx = tintCanvas.getContext('2d');
  function parseTint(str) {
    let b = 1, c = 1, sep = 0;
    const re = /([a-z]+)\(([\d.]+)\)/g; let m;
    while ((m = re.exec(str))) {
      const v = parseFloat(m[2]);
      if (m[1] === 'brightness') b *= v;
      else if (m[1] === 'contrast') c *= v;
      else if (m[1] === 'sepia') sep = Math.max(sep, v);
    }
    return { b, c, sep };
  }
  function applyTintOverlays(ctx, w, h, str) {
    const t = parseTint(str);
    ctx.globalCompositeOperation = 'source-atop';
    if (t.c < 1) { ctx.fillStyle = 'rgba(132,132,132,' + ((1 - t.c) * 0.85).toFixed(3) + ')'; ctx.fillRect(0, 0, w, h); }   // contrast<1: zwart minder hard
    if (t.sep > 0) { ctx.fillStyle = 'rgba(150,110,55,' + (t.sep * 0.22).toFixed(3) + ')'; ctx.fillRect(0, 0, w, h); }      // warme sepia-zweem
    if (t.b < 1) { ctx.fillStyle = 'rgba(0,0,0,' + (1 - t.b).toFixed(3) + ')'; ctx.fillRect(0, 0, w, h); }                  // brightness<1: schaduw
    else if (t.b > 1) { ctx.fillStyle = 'rgba(255,255,255,' + Math.min(0.5, t.b - 1).toFixed(3) + ')'; ctx.fillRect(0, 0, w, h); }
    ctx.globalCompositeOperation = 'source-over';
  }
  /* Tekent (een deel van) een afbeelding; als ctx.filter niet werkt én currentTint gezet is,
     gaat het eerst door een tijdelijk canvas met de handmatige tint. */
  function drawImgTinted(img, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (currentTint && !FILTER_OK && sw > 0 && sh > 0) {
      /* Tint op de NATIEVE bronresolutie (sw×sh), zodat bij het schalen naar de
         supersample-buffer geen detail/scherpte verloren gaat (anders zien sprites er korrelig uit). */
      const tw = Math.ceil(sw), th = Math.ceil(sh);
      if (tintCanvas.width < tw) tintCanvas.width = tw + 8;
      if (tintCanvas.height < th) tintCanvas.height = th + 8;
      tctx.clearRect(0, 0, tw, th);
      tctx.imageSmoothingEnabled = false;
      tctx.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th);
      applyTintOverlays(tctx, tw, th, currentTint);
      fctx.drawImage(tintCanvas, 0, 0, tw, th, dx, dy, dw, dh);
    } else {
      fctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }

  function paintBackground() {
    bgCtx.setTransform(1, 0, 0, 1, 0, 0);
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    let img = art.scenes[state.currentScene];
    /* wissel-achtergrond: eerste variant waarvan de flag-conditie klopt */
    const sc = GAME.scenes[state.currentScene];
    if (sc && sc.bgVariants) {
      for (const v of sc.bgVariants) {
        const okFlag = !v.flag || state.flags[v.flag];
        const okNot  = !v.notFlag || !state.flags[v.notFlag];
        if (okFlag && okNot && ready(art.variants[v.img])) { img = art.variants[v.img]; break; }
      }
    }
    if (ready(img)) {
      bgCtx.imageSmoothingEnabled = true;
      bgCtx.drawImage(img, 0, 0, bgCanvas.width, bgCanvas.height);
    } else {
      bgCtx.save(); bgCtx.scale(SS, SS);
      SCENE_PAINTERS[state.currentScene](bgCtx, state.currentScene);
      bgCtx.restore();
    }
  }

  const view = { scale: 1, ox: 0, oy: 0 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', () => { resize(); initLeaves(); });

  /* ---------- Sfeer-partikels ---------- */
  const LEAF_COLS = ['#a8432a', '#c75b35', '#c9a24b', '#e8862a'];
  const leaves = [];
  function initLeaves() {
    leaves.length = 0;
    for (let i = 0; i < 16; i++) {
      leaves.push({
        x: Math.random() * SCENE_W, y: Math.random() * SCENE_H,
        speed: 8 + Math.random() * 13,
        swayAmp: 6 + Math.random() * 14,
        swayFreq: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() < 0.6 ? 1 : 2,
        col: LEAF_COLS[(Math.random() * LEAF_COLS.length) | 0]
      });
    }
  }
  function initFireflies(n) {
    fireflies = [];
    const sc = GAME.scenes[state.currentScene];
    const cols = (sc && sc.fx && sc.fx.fireflyCols) || ['150,230,120'];   // standaard groen-geel
    for (let i = 0; i < n; i++) {
      fireflies.push({
        x: 100 + Math.random() * (SCENE_W - 200),
        y: 80 + Math.random() * 180,
        ax: Math.random() * Math.PI * 2,
        ay: Math.random() * Math.PI * 2,
        sp: 0.2 + Math.random() * 0.5,
        ph: Math.random() * Math.PI * 2,
        col: cols[i % cols.length]            // afwisselend uit het palet (bv. blauw + groen)
      });
    }
  }

  /* ---------- Botsing: walkable (rects of polygon) min obstacles ---------- */
  function pointInPoly(poly, x, y) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function inObstacle(scene, x, y) {
    return scene.obstacles && scene.obstacles.some(r => {
      if (r.requiresFlag && !state.flags[r.requiresFlag]) return false;
      if (r.notFlag && state.flags[r.notFlag]) return false;
      return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
    });
  }
  function inWalkableScene(scene, x, y) {
    if (inObstacle(scene, x, y)) return false;
    if (scene.walkPoly) return pointInPoly(scene.walkPoly, x, y);
    /* In het donker (scene met darkness-flag nog uit) geldt het beperkte loopgebied. */
    let rects = scene.walkable;
    if (scene.darkWalkable && scene.fx && scene.fx.darkness && !state.flags[scene.fx.darkness.until]) {
      rects = scene.darkWalkable;
    }
    return rects.some(r =>
      x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
  }
  function inWalkable(x, y) {
    return inWalkableScene(GAME.scenes[state.currentScene], x, y);
  }
  /* Punt dat alléén door de duisternis onbeloopbaar is (wél loopbaar zodra er licht is). */
  function darkBlocked(x, y) {
    const scene = GAME.scenes[state.currentScene];
    if (!(scene.darkWalkable && scene.fx && scene.fx.darkness && !state.flags[scene.fx.darkness.until])) return false;
    if (inWalkable(x, y) || inObstacle(scene, x, y)) return false;
    return scene.walkable.some(r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
  }
  function polyCentroid(poly) {
    let sx = 0, sy = 0;
    for (const p of poly) { sx += p[0]; sy += p[1]; }
    return { x: sx / poly.length, y: sy / poly.length };
  }
  function clampToWalkable(x, y) {
    if (inWalkable(x, y)) return { x, y };
    const scene = GAME.scenes[state.currentScene];
    if (scene.walkPoly) {
      /* projecteer op de dichtstbijzijnde rand, schuif dan iets naar binnen */
      const poly = scene.walkPoly;
      let best = null, bestD = Infinity;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const ax = poly[j][0], ay = poly[j][1], bx = poly[i][0], by = poly[i][1];
        const dx = bx - ax, dy = by - ay;
        const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
        const px_ = ax + t * dx, py_ = ay + t * dy;
        const d = (px_ - x) ** 2 + (py_ - y) ** 2;
        if (d < bestD) { bestD = d; best = { x: px_, y: py_ }; }
      }
      const c = polyCentroid(poly);
      for (let k = 1; k <= 6; k++) {
        const nx = best.x + (c.x - best.x) * 0.04 * k;
        const ny = best.y + (c.y - best.y) * 0.04 * k;
        if (inWalkable(nx, ny)) return { x: nx, y: ny };
      }
      return inWalkable(best.x, best.y) ? best : c;
    }
    let best = null, bestD = Infinity;
    for (const r of scene.walkable) {
      const cx = Math.max(r.x + 2, Math.min(r.x + r.w - 2, x));
      const cy = Math.max(r.y + 2, Math.min(r.y + r.h - 2, y));
      const d = (cx - x) ** 2 + (cy - y) ** 2;
      if (d < bestD) { bestD = d; best = { x: cx, y: cy }; }
    }
    return best || { x, y };
  }

  /* ---------- Pathfinding (A* over een raster) zodat de speler netjes om obstakels
       (zuilen, de minotaur) heen loopt in plaats van vast te lopen. ---------- */
  function lineClear(x1, y1, x2, y2) {
    const d = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(1, Math.ceil(d / 4));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      if (!inWalkable(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t)) return false;
    }
    return true;
  }
  function findPath(sx, sy, tx, ty) {
    const scene = GAME.scenes[state.currentScene];
    if (lineClear(sx, sy, tx, ty)) return [{ x: tx, y: ty }];
    const C = 8;
    const cols = Math.ceil(SCENE_W / C), rows = Math.ceil(SCENE_H / C);
    const ok = (cx, cy) => cx >= 0 && cy >= 0 && cx < cols && cy < rows &&
      inWalkableScene(scene, cx * C + C / 2, cy * C + C / 2);
    const nearestOk = (cx, cy) => {
      if (ok(cx, cy)) return { x: cx, y: cy };
      for (let r = 1; r < 30; r++) {
        for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) {
          if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
          if (ok(cx + dx, cy + dy)) return { x: cx + dx, y: cy + dy };
        }
      }
      return null;
    };
    const s = nearestOk(Math.floor(sx / C), Math.floor(sy / C));
    const g = nearestOk(Math.floor(tx / C), Math.floor(ty / C));
    if (!s || !g) return null;
    const key = (x, y) => y * cols + x;
    const open = [s], gScore = {}, came = {};
    gScore[key(s.x, s.y)] = 0;
    const h = (a) => Math.abs(a.x - g.x) + Math.abs(a.y - g.y);
    let guard = 0;
    while (open.length && guard++ < 6000) {
      let bi = 0;
      for (let i = 1; i < open.length; i++)
        if ((gScore[key(open[i].x, open[i].y)] + h(open[i])) < (gScore[key(open[bi].x, open[bi].y)] + h(open[bi]))) bi = i;
      const cur = open.splice(bi, 1)[0];
      if (cur.x === g.x && cur.y === g.y) {
        const cells = [];
        let c = cur;
        while (c) { cells.unshift(c); c = came[key(c.x, c.y)]; }
        let pts = cells.map((c) => ({ x: c.x * C + C / 2, y: c.y * C + C / 2 }));
        pts.push({ x: tx, y: ty });
        const simp = [pts[0]];
        let i = 0;
        while (i < pts.length - 1) {
          let j = pts.length - 1;
          while (j > i + 1 && !lineClear(pts[i].x, pts[i].y, pts[j].x, pts[j].y)) j--;
          simp.push(pts[j]); i = j;
        }
        simp.shift();
        return simp.length ? simp : [{ x: tx, y: ty }];
      }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cur.x + dx, ny = cur.y + dy;
        if (!ok(nx, ny)) continue;
        const t = gScore[key(cur.x, cur.y)] + 1;
        if (gScore[key(nx, ny)] === undefined || t < gScore[key(nx, ny)]) {
          gScore[key(nx, ny)] = t; came[key(nx, ny)] = cur;
          if (!open.some((o) => o.x === nx && o.y === ny)) open.push({ x: nx, y: ny });
        }
      }
    }
    return null;
  }

  /* ---------- Dynamische hotspots (volgen een NPC) ---------- */
  function npcPos(id) {
    if (id === 'dog' && follower.active) return follower;   // volgt nu de speler
    return npcRt[id];
  }
  function hsRect(hs) {
    const rt = hs.followNpc && npcPos(hs.followNpc);
    if (rt) return { x: rt.x - hs.rect.w / 2, y: rt.y - hs.rect.h, w: hs.rect.w, h: hs.rect.h };
    return hs.rect;
  }
  function hsWalkTo(hs) {
    const rt = hs.followNpc && npcPos(hs.followNpc);
    if (rt) return clampToWalkable(rt.x, rt.y + 38);
    return hs.walkTo;
  }
  function hsSpeaker(hs) {
    if (!hs.speaker) return null;
    if (hs.followNpc && npcPos(hs.followNpc)) {
      const r = hsRect(hs);
      return { x: r.x + r.w / 2, y: r.y - 2 };
    }
    return hs.speaker === true
      ? { x: hs.rect.x + hs.rect.w / 2, y: hs.rect.y }
      : hs.speaker;
  }
  const FACE_BY_SPRITE = {
    seer: 'assets/art/face-seer.png',
    minotaur: 'assets/art/face-minotaur.png',
    dog: 'assets/art/face-dog.png'
  };
  function hsFace(hs) {
    if (hs.face) return hs.face;                 // expliciet portret in de tekstwolk
    if (!hs.followNpc) return null;
    const npc = (GAME.scenes[state.currentScene].npcs || []).find(n => n.id === hs.followNpc);
    return npc ? FACE_BY_SPRITE[npc.sprite] || null : null;
  }

  /* ---------- Game-lus ---------- */
  let lastT = performance.now();
  function loop() {
    const now = performance.now();
    const dt = Math.min((now - lastT) / 1000, 0.12);
    lastT = now;
    update(dt, now);
    draw(now);
    if (elMaze && !elMaze.hidden) drawMaze(now);
    if (elGear && !elGear.hidden) drawGears(now);
  }

  /* ---------- Toetsenbord (WASD / pijltjes, fysieke key-codes) ---------- */
  const keys = new Set();
  window.addEventListener('keydown', (e) => {
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.code)) {
      keys.add(e.code);
      e.preventDefault();
      ac();
    }
  });
  window.addEventListener('keyup', (e) => keys.delete(e.code));
  window.addEventListener('blur', () => keys.clear());

  function keyVector() {
    let vx = 0, vy = 0;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) vx -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) vx += 1;
    if (keys.has('KeyW') || keys.has('ArrowUp')) vy -= 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) vy += 1;
    return { vx, vy };
  }

  function movePlayer(dx, dy, dist, dt) {
    /* In de diepte (kleinere schaal) loopt de held iets langzamer — perspectief. */
    const sf = Math.max(0.55, Math.min(1.15, depthScaleAt(player.y)));
    const step = Math.min(WALK_SPEED * sf * dt, dist);
    let nx = player.x + (dx / dist) * step;
    let ny = player.y + (dy / dist) * step;
    if (!inWalkable(nx, ny)) {
      if (inWalkable(nx, player.y)) ny = player.y;
      else if (inWalkable(player.x, ny)) nx = player.x;
      else return false;
    }
    player.x = nx; player.y = ny;
    player.phase += step * 0.14;
    if (Math.abs(dx) > 2) player.flip = dx < 0;
    player.dir = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? 'right' : 'left')
      : (dy > 0 ? 'down' : 'up');
    player.stepAcc += step;
    if (player.stepAcc > 13) {
      player.stepAcc = 0;
      dust.push({ x: player.x + (Math.random() * 8 - 4), y: player.y - 1, life: 0.45 });
      sfx('step');
    }
    return true;
  }

  function update(dt, now) {
    const scene = GAME.scenes[state.currentScene];

    /* Toetsenbord heeft voorrang op tik-doelen */
    player.kbMoving = false;
    if (started && elDeath.hidden && elWin.hidden && elPuzzle.hidden && elRiddle.hidden && elRune.hidden && elMaze.hidden && (!elGear || elGear.hidden) && (!elChess || elChess.hidden)) {
      const { vx, vy } = keyVector();
      if (vx || vy) {
        if (msgOpen()) showNextMsg();    // tekst weg én meteen lopen
        player.target = null;
        player.pending = null;
        player.kbMoving = true;
        const len = Math.hypot(vx, vy);
        movePlayer(vx * 50, vy * 50, len * 50, dt);
      }
    }

    /* Speler */
    if (player.target) {
      if (player._pathFor !== player.target) {
        player._pathFor = player.target;
        player.path = findPath(player.x, player.y, player.target.x, player.target.y) || [player.target];
      }
      const wp = (player.path && player.path[0]) || player.target;
      const dx = wp.x - player.x;
      const dy = wp.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= ARRIVE_DIST) {
        player.x = wp.x;
        player.y = wp.y;
        if (player.path && player.path.length) player.path.shift();
        if (!player.path || player.path.length === 0) { player.path = null; arrive(); }
      } else {
        const sf = Math.max(0.55, Math.min(1.15, depthScaleAt(player.y)));   // langzamer in de diepte
        const step = Math.min(WALK_SPEED * sf * dt, dist);
        let nx = player.x + (dx / dist) * step;
        let ny = player.y + (dy / dist) * step;
        if (!inWalkable(nx, ny)) {
          if (inWalkable(nx, player.y)) ny = player.y;
          else if (inWalkable(player.x, ny)) nx = player.x;
          else { player.target = null; player.path = null; arrive(); return; }
        }
        /* klem tegen een obstakel: probeer het volgende waypoint, anders stop */
        if (Math.abs(nx - player.x) < 0.05 && Math.abs(ny - player.y) < 0.05) {
          if (player.path && player.path.length > 1) { player.path.shift(); }
          else { player.target = null; player.path = null; arrive(); return; }
        }
        player.x = nx; player.y = ny;
        player.phase += step * 0.14;
        if (Math.abs(dx) > 2) player.flip = dx < 0;
        player.dir = Math.abs(dx) > Math.abs(dy)
          ? (dx > 0 ? 'right' : 'left')
          : (dy > 0 ? 'down' : 'up');
        player.stepAcc += step;
        if (player.stepAcc > 13) {
          player.stepAcc = 0;
          dust.push({ x: player.x + (Math.random() * 8 - 4), y: player.y - 1, life: 0.45 });
          sfx('step');
        }
      }
    }

    /* NPC's: zwerven en patrouilleren */
    for (const npc of (scene.npcs || [])) {
      const rt = npcRt[npc.id];
      if (!rt) continue;
      let fleeing = false;
      if (npc.fleeFrom === 'player' && !state.flags[npc.fleeUntilFlag] &&
          !(npc.fleeUnlessHas && state.inventory.includes(npc.fleeUnlessHas))) {
        const dxp = rt.x - player.x, dyp = rt.y - player.y;
        const d = Math.hypot(dxp, dyp);
        if (d < (npc.fleeRadius || 70)) {
          fleeing = true;
          const sp = (npc.fleeSpeed || 78) * dt;
          let nx = rt.x + (dxp / (d || 1)) * sp;
          let ny = rt.y + (dyp / (d || 1)) * sp * 0.45;
          const w = npc.wander;
          if (w) { nx = Math.max(w.x, Math.min(w.x + w.w, nx)); ny = Math.max(w.y, Math.min(w.y + w.h, ny)); }
          if (inWalkable(nx, ny)) {
            if (Math.abs(nx - rt.x) > 0.3) rt.flip = (nx - rt.x) < 0;
            rt.x = nx; rt.y = ny; rt.phase += sp * 0.2;
          }
          rt.target = null;
          rt.pauseUntil = now + 400;
        }
      }
      if (!fleeing && npc.wander && !(npc.wanderRequiresFlag && !state.flags[npc.wanderRequiresFlag])) {
        if (rt.target) {
          const dx = rt.target.x - rt.x, dy = rt.target.y - rt.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 2) {
            rt.target = null;
            rt.phase = 0;
            rt.pauseUntil = now + npc.wander.pauseMin +
              Math.random() * (npc.wander.pauseMax - npc.wander.pauseMin);
          } else {
            const step = Math.min(npc.wander.speed * dt, dist);
            rt.x += (dx / dist) * step;
            rt.y += (dy / dist) * step;
            rt.phase += step * 0.18;
            if (Math.abs(dx) > 1) rt.flip = dx < 0;
          }
        } else if (now > rt.pauseUntil) {
          const w = npc.wander;
          const tx = w.x + Math.random() * w.w;
          const ty = w.y + Math.random() * w.h;
          if (inWalkable(tx, ty)) rt.target = { x: tx, y: ty };
          else rt.pauseUntil = now + 800;
        }
      }
      if (npc.patrol && npc.id === 'minotaur' && !state.flags.minotaurAsleep) {
        const ph = now / npc.patrol.period * Math.PI * 2;
        rt.x = rt.baseX + Math.sin(ph) * npc.patrol.amp;
        rt.flip = Math.cos(ph) < 0;
      }
      /* Minotaur sjokt naar de schaal en valt daar in slaap (korte animatie) */
      if (npc.id === 'minotaur' && minoWalk && !minoWalk.arrived) {
        const dx = minoWalk.tx - rt.x, dy = minoWalk.ty - rt.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 3) { minoWalk.arrived = true; sfx('sleep'); }
        else {
          const step = Math.min(64 * dt, dist);
          rt.x += dx / dist * step; rt.y += dy / dist * step;
          rt.phase += step * 0.2;
          if (Math.abs(dx) > 1) rt.flip = dx < 0;
        }
      }
    }

    /* Trouwe hond: volgt de speler; is bang vlakbij de wakkere minotaur */
    if (follower.active) {
      const mino = (scene.npcs || []).find(n => n.sprite === 'minotaur');
      const minoAwake = mino && !state.flags.minotaurAsleep;
      /* de hond-sprite kijkt van zichzelf naar LINKS → flip=true = naar rechts */
      const stepToward = (tx, ty, speed, stop) => {
        const dx = tx - follower.x, dy = ty - follower.y;
        const d = Math.hypot(dx, dy);
        if (d <= (stop || 0) + 0.5) return false;
        const step = Math.min(speed * dt, d - (stop || 0));
        let nx = follower.x + dx / d * step, ny = follower.y + dy / d * step;
        if (!inWalkable(nx, ny)) { if (inWalkable(nx, follower.y)) ny = follower.y; else if (inWalkable(follower.x, ny)) nx = follower.x; else return false; }
        follower.x = nx; follower.y = ny; follower.phase += step * 0.16;
        if (Math.abs(dx) > 2) follower.flip = dx > 0;
        return true;
      };
      if (minoAwake) {
        /* bang: vlucht naar de ingang en blijf daar rillen */
        follower.scared = true; follower.wTarget = null;
        const safe = clampToWalkable(scene.playerStart.x, scene.playerStart.y);
        stepToward(safe.x, safe.y, 80, 0);
      } else {
        follower.scared = false;
        const dx = player.x - follower.x, dy = player.y - follower.y;
        const d = Math.hypot(dx, dy);
        if (d > 80) {                       // ver weg → inhalen
          follower.wTarget = null;
          stepToward(player.x, player.y, 115, 44);
        } else if (d > 46) {                // op afstand volgen, rustig tempo
          follower.wTarget = null;
          stepToward(player.x, player.y, 72, 40);
        } else {                            // dichtbij → eigen willetje
          if (follower.wTarget) {
            if (!stepToward(follower.wTarget.x, follower.wTarget.y, 46, 0)) {
              follower.wTarget = null;
              follower.idleNext = now + 2500 + Math.random() * 4500;
            }
          } else if (now > (follower.idleNext || 0)) {
            const ang = Math.random() * Math.PI * 2;
            const r = 12 + Math.random() * 26;
            follower.wTarget = clampToWalkable(player.x + Math.cos(ang) * r, player.y + Math.sin(ang) * r);
            follower.idleNext = now + 2500 + Math.random() * 4500;
          } else if (Math.abs(dx) > 4) {
            follower.flip = dx > 0;         // kijkt naar de speler
          }
        }
      }
    }

    /* Partikels */
    /* Uitgangen triggeren door ernaartoe te lopen (eerst even weg zijn) */
    checkExitProximity(scene);

    for (const Lf of leaves) {
      Lf.y += Lf.speed * dt;
      Lf.phase += Lf.swayFreq * dt;
      if (Lf.y > SCENE_H + 4) { Lf.y = -4; Lf.x = Math.random() * SCENE_W; }
    }
    for (let i = dust.length - 1; i >= 0; i--) {
      dust[i].life -= dt;
      dust[i].y -= 6 * dt;
      if (dust[i].life <= 0) dust.splice(i, 1);
    }
    const fxd = scene.fx || {};
    const darkU = !!(fxd.darkness && !state.flags[fxd.darkness.until]);
    if (fxd.embers && !darkU && Math.random() < 0.25) {
      const src = fxd.embers[(Math.random() * fxd.embers.length) | 0];
      embers.push({ x: src.x + Math.random() * 8 - 4, y: src.y, life: 1.4, ph: Math.random() * 6 });
    }
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.life -= dt;
      e.y -= 16 * dt;
      e.ph += dt * 4;
      if (e.life <= 0) embers.splice(i, 1);
    }
    for (const f of fireflies) {
      f.ax += f.sp * dt; f.ay += f.sp * 0.8 * dt;
      f.x += Math.sin(f.ax) * 12 * dt;
      f.y += Math.cos(f.ay) * 8 * dt;
      f.ph += dt * 2.5;
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life -= dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      if (s.grav) s.vy += s.grav * dt;
      s.vx *= 0.96; if (!s.grav) s.vy *= 0.96;
      if (s.life <= 0) sparks.splice(i, 1);
    }
  }

  /* Uitgangen werken nu ALLEEN door op de pijl te tikken (niet automatisch door er
     langs te lopen) — anders stap je per ongeluk naar buiten als je naar een voorwerp
     loopt dat dicht bij een uitgang ligt. */
  let exitArm = {};
  function checkExitProximity(scene) { /* bewust uitgeschakeld: tik op de pijl om te wisselen */ }

  function arrive() {
    player.target = null;
    player.phase = 0;
    const hs = player.pending;
    player.pending = null;
    if (hs) {
      const wt = hsWalkTo(hs);
      const near = Math.hypot(player.x - wt.x, player.y - wt.y) < 48;
      if (near) interactNow(hs);
    }
  }

  /* ---------- Tekenen ---------- */
  function draw(now) {
    fctx.setTransform(1, 0, 0, 1, 0, 0);
    fctx.imageSmoothingEnabled = false;
    fctx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
    fctx.drawImage(bgCanvas, 0, 0);                 // achtergrond 1:1 (scherp)
    fctx.setTransform(SS, 0, 0, SS, 0, 0);          // verder in 568×320-coördinaten

    const scene = GAME.scenes[state.currentScene];
    const _fx = scene.fx || {};
    const dark = !!(_fx.darkness && !state.flags[_fx.darkness.until]);
    const usingArt = ready(art.scenes[state.currentScene]);
    if (usingArt) paintFx(scene, now);
    paintPuzzleGlow(scene, now);
    drawWorldItems(scene, now);

    if (marker && now < marker.until) {
      const blink = ((now / 120) | 0) % 2 === 0;
      fctx.fillStyle = blink ? '#e7cf86' : '#c9a24b';
      fctx.fillRect(marker.x - 3, marker.y, 7, 1);
      fctx.fillRect(marker.x, marker.y - 3, 1, 7);
    }

    for (const d of dust) {
      fctx.fillStyle = `rgba(216,185,138,${(d.life / 0.45) * 0.6})`;
      fctx.fillRect(d.x | 0, d.y | 0, 2, 2);
    }

    /* Entiteiten + voorgrond-overlays op diepte gesorteerd */
    const ents = [];
    for (const npc of (scene.npcs || [])) {
      if (!flagVisible(npc)) continue;
      const rt = npcRt[npc.id] || npc;
      ents.push({ y: rt.y, draw: () => drawNpc(npc, now) });
    }
    ents.push({ y: player.y, draw: () => drawPlayer(now) });
    /* In de donkere tempel draagt de held de fakkel die zij maakte (licht + sfeer) */
    if (state.currentScene === 'temple' && state.inventory.includes('torch')) {
      ents.push({ y: player.y + 0.5, draw: () => drawHeldTorch(now) });
    }
    if (follower.active) ents.push({ y: follower.y, draw: () => drawFollower(now) });
    if (scene.overlays) {
      for (const o of scene.overlays) {
        ents.push({ y: o.base, draw: () => {
          const img = o.img && overlayImg(o.img);
          if (img && ready(img)) fctx.drawImage(img, o.x, o.y);
          else fctx.drawImage(bgCanvas, o.x * SS, o.y * SS, o.w * SS, o.h * SS, o.x, o.y, o.w, o.h);
        } });
      }
    }
    drawExitArrows(now);                 // uitgang-pijlen ACHTER de personages tekenen
    ents.sort((a, b) => a.y - b.y);
    for (const e of ents) e.draw();

    /* Staf-gloed: warme goud-blauwe aura rond Finn wanneer hij de spreuk uitspreekt. */
    if (castGlow) {
      const el = (now - castGlow.t0) / 2600;
      if (el >= 1) { castGlow = null; }
      else {
        const a = Math.sin(el * Math.PI) * 0.7;
        const gx = Math.round(player.x), gy = Math.round(player.y - 30);
        const r = 20 + 6 * Math.sin(now / 110);
        const g = fctx.createRadialGradient(gx, gy, 1, gx, gy, r);
        g.addColorStop(0, `rgba(190,215,255,${a})`);
        g.addColorStop(0.45, `rgba(150,190,255,${a * 0.4})`);
        g.addColorStop(0.8, `rgba(255,225,150,${a * 0.18})`);
        g.addColorStop(1, 'rgba(150,190,255,0)');
        fctx.fillStyle = g;
        fctx.fillRect(gx - r, gy - r, r * 2, r * 2);
        for (let k = 0; k < 3; k++) {
          const ang = now / 280 + k * 2.1;
          twinkle(gx + Math.cos(ang) * 13, gy + Math.sin(ang * 1.3) * 11, a * (0.6 + 0.4 * Math.sin(now / 160 + k)));
        }
      }
    }

    /* Blauwe drakensteen in de staf: een echt klein blauw glinster-steentje bovenin Finns staf.
       Beweegt mee terwijl Finn loopt (volgt player.x/player.y). */
    if (started && state.flags.ringWorn && !dark) {
      const ds = depthScaleAt(player.y);
      const fsign = player.flip ? -1 : 1;
      const extraRight = fsign > 0 ? 2 : 0;                    // 2px extra naar rechts als Finn naar rechts kijkt
      const sx = Math.round(player.x + fsign * 17 * ds + 3 + extraRight);
      const sy = Math.round(player.y - 68 * ds);              // bovenin de staf
      /* Vooral een zachte blauwe gloed, met een héél klein lichtpuntje als steen. */
      const r = 8 + 2 * Math.sin(now / 230);
      const g = fctx.createRadialGradient(sx, sy, 0, sx, sy, r);
      g.addColorStop(0, 'rgba(150,205,255,0.55)');
      g.addColorStop(0.5, 'rgba(125,195,255,0.26)');
      g.addColorStop(1, 'rgba(120,195,255,0)');
      fctx.fillStyle = g;
      fctx.fillRect(sx - r, sy - r, r * 2, r * 2);
      /* het steentje: een heel klein puntje (2px) met een lichte kern */
      fctx.fillStyle = 'rgba(95,165,250,0.95)';
      fctx.fillRect(sx - 1, sy - 1, 2, 2);
      fctx.fillStyle = 'rgba(205,235,255,0.95)';
      fctx.fillRect(sx, sy - 1, 1, 1);
      twinkle(sx, sy, 0.5 + 0.4 * Math.sin(now / 170));
    }

    drawDragonShadow(now);   // voorbijvliegende drakenschaduw (drakenspreuk op de wachter)
    drawWitchPoof(now);      // de heks lost op in groene rook
    drawWitchFrog(now);      // ... en fladdert als kikker weg
    drawDuelFlash(now);      // flits bij een goed antwoord in het heksengevecht

    /* De raaf vliegt weg: zet zich rustig af, klapwiekt en zweeft naar rechts het beeld uit. */
    if (ravenFly) {
      const el = (now - ravenFly.t) / 2300;
      if (el >= 1) { ravenFly = null; }
      else {
        const dir = ravenFly.dir === 'left' ? -1 : 1;                       // vliegrichting
        const ease = el * el * (3 - 2 * el);                                // smoothstep: rustige afzet, dan versnellen
        /* Echte frame-animatie: 4-stappen wiekslag uit losse vleugelstand-sprites. */
        const FLAP = [art.sprites.ravenFlyUp, art.sprites.ravenFlyMid, art.sprites.ravenFlyDown, art.sprites.ravenFlyMid];
        const fi = Math.floor(now / 80) % FLAP.length;                      // ~12 fps wiekslag
        const img = FLAP[fi] || art.sprites.ravenFly || art.sprites.ravenPerch;
        const bob = [-5, -1, 5, -1][fi];                                    // lichaam deint mee met de slag
        const bank = [0.16, 0.04, -0.12, 0.04][fi];
        const fx_ = ravenFly.x + dir * ease * 180;                          // het beeld uit (rechts of links)
        const fy_ = ravenFly.y - el * 120                                   // gestaag opstijgen
                  - Math.sin(el * Math.PI) * 14                             // ruimere, natuurlijke boog omhoog
                  + bob * (1 - el * 0.5);                                   // op-en-neer deinen per wiekslag
        fctx.save();
        fctx.globalAlpha = el < 0.8 ? 1 : Math.max(0, 1 - (el - 0.8) / 0.2);
        if (ready(img)) {
          const D = GAME.spriteDetail || 1;
          const sc = 0.78;                                                  // kleinere wegvliegende raaf
          const w = Math.round(img.naturalWidth / D * sc);
          const h = Math.round(img.naturalHeight / D * sc);
          fctx.translate(Math.round(fx_), Math.round(fy_));
          /* de raaf-frames kijken naar rechts → spiegel alleen bij vlucht naar LINKS (kop vooraan) */
          if (dir < 0) fctx.scale(-1, 1);
          fctx.rotate(bank);
          fctx.imageSmoothingEnabled = false;
          fctx.drawImage(img, Math.round(-w / 2), Math.round(-h / 2), w, h);
        } else {
          fctx.fillStyle = '#15110f';
          fctx.fillRect(Math.round(fx_ - 4), Math.round(fy_ - 2), 8, 4);
        }
        fctx.restore();
      }
    }

    /* Bijtjes en vlinders dansen mee rond de betoverde bloemen (zodra ze dansen). */
    if (state.currentScene === 'castle' && state.flags.flowerDancing && !state.flags.taken_castle_cart) drawCastleDancers(now);
    if (state.flags.duelActive) drawDuel(now);

    /* Lage drijvende mist VÓÓR de personages (zo lijkt het of de heks in de mist staat). */
    if (scene.fx && scene.fx.mist) {
      const m = scene.fx.mist, bands = (m.bands == null) ? 5 : m.bands;
      /* brede drijvende grondmist-banden */
      for (let i = 0; i < bands; i++) {
        const yy = (m.y || 232) + i * 8 + Math.sin(now / 2200 + i) * 2;
        const drift = Math.sin(now / (3000 + i * 400) + i * 1.7) * 32;
        const a = (m.alpha || 0.22) * (0.7 + 0.3 * Math.sin(now / 1800 + i * 2));
        const g = fctx.createLinearGradient(0, yy - 9, 0, yy + 9);
        g.addColorStop(0, 'rgba(210,218,232,0)');
        g.addColorStop(0.5, `rgba(210,218,232,${a})`);
        g.addColorStop(1, 'rgba(210,218,232,0)');
        fctx.fillStyle = g;
        fctx.fillRect(-40 + drift, Math.round(yy - 9), SCENE_W + 80, 18);
      }
      /* dichtere (eventueel ovale) mistwolk rond een punt — bv. lage grondmist rond de heks */
      if (m.around) {
        const rx = m.around.rx || m.around.r || 66;
        const ry = m.around.ry || m.around.r || 66;
        const cx = m.around.x + Math.sin(now / 2600) * 4, cy = m.around.y;
        const aa = (m.aroundAlpha || 0.3) * (0.72 + 0.28 * Math.sin(now / 1600));
        fctx.save();
        fctx.translate(cx, cy);
        fctx.scale(1, ry / rx);                          // pers de cirkel tot een ovaal (brede, lage mist)
        const g = fctx.createRadialGradient(0, 0, 2, 0, 0, rx);
        g.addColorStop(0, `rgba(216,224,236,${aa})`);
        g.addColorStop(0.6, `rgba(216,224,236,${aa * 0.5})`);
        g.addColorStop(1, 'rgba(216,224,236,0)');
        fctx.fillStyle = g;
        fctx.fillRect(-rx, -rx, rx * 2, rx * 2);
        fctx.restore();
      }
    }

    /* gloeiende partikels bovenop */
    for (const e of embers) {
      const a = Math.max(0, e.life / 1.4);
      fctx.fillStyle = `rgba(255,${170 + ((Math.sin(e.ph) * 40) | 0)},60,${a * 0.8})`;
      fctx.fillRect((e.x + Math.sin(e.ph) * 2) | 0, e.y | 0, 1, 1);
    }
    for (const f of fireflies) {
      const a = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(f.ph));
      const fx2 = f.x | 0, fy2 = f.y | 0;
      // zachte gloed eromheen (geeft licht)
      const r = 9 + 3 * Math.sin(f.ph);
      const col = f.col || '150,230,120';
      const g = fctx.createRadialGradient(fx2, fy2, 0, fx2, fy2, r);
      g.addColorStop(0, `rgba(${col},${a * 0.5})`);
      g.addColorStop(0.5, `rgba(${col},${a * 0.18})`);
      g.addColorStop(1, `rgba(${col},0)`);
      fctx.fillStyle = g;
      fctx.fillRect(fx2 - r, fy2 - r, r * 2, r * 2);
      // heldere kern (lichte tint van de eigen kleur)
      fctx.fillStyle = `rgba(${col},${Math.min(1, a + 0.35)})`;
      fctx.fillRect(fx2, fy2, 2, 2);
      fctx.fillStyle = `rgba(255,255,235,${a})`;
      fctx.fillRect(fx2, fy2, 1, 1);
    }
    for (const s of sparks) {
      const al = Math.max(0, Math.min(1, s.life / (s.max || 1)));
      fctx.fillStyle = `rgba(${s.col},${al})`;
      const x = s.x | 0, y = s.y | 0, sz = s.size || 2;
      if (s.heart) {
        fctx.fillRect(x - 1, y, 1, 2); fctx.fillRect(x + 1, y, 1, 2);
        fctx.fillRect(x - 1, y - 1, 1, 1); fctx.fillRect(x + 1, y - 1, 1, 1);
        fctx.fillRect(x, y + 1, 1, 1); fctx.fillRect(x, y + 2, 1, 1);
      } else {
        fctx.fillRect(x, y, sz, sz);
      }
    }
    for (const Lf of leaves) {
      const lx = Lf.x + Math.sin(Lf.phase * Math.PI * 2) * Lf.swayAmp;
      fctx.fillStyle = Lf.col;
      fctx.fillRect(lx | 0, Lf.y | 0, Lf.size, Lf.size);
    }

    /* Duisternis: dekt de hele scene tot de licht-flag gezet is; laat alleen
       een zacht kijkveld rond de speler, gloeiende ogen en glimmers (bv. kolen) zien. */
    if (dark && !_fx.darkness.useArt) {
      const dk = _fx.darkness;
      fctx.save();
      fctx.fillStyle = 'rgba(5,4,12,0.94)';
      fctx.fillRect(0, 0, SCENE_W, SCENE_H);
      fctx.globalCompositeOperation = 'destination-out';
      const hole = (x, y, r) => {
        const g = fctx.createRadialGradient(x, y, 2, x, y, r);
        g.addColorStop(0, 'rgba(0,0,0,0.96)');
        g.addColorStop(0.6, 'rgba(0,0,0,0.5)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        fctx.fillStyle = g;
        fctx.fillRect(x - r, y - r, r * 2, r * 2);
      };
      if (dk.peekAround !== false) hole(player.x, player.y - 12, dk.peekR || 48);
      (dk.glimmers || []).forEach(gm => hole(gm.x, gm.y, gm.r || 16));
      fctx.restore();
      /* gekleurde gloed bij de glimmers (warm vuur of koud maanlicht) */
      (dk.glimmers || []).forEach(gm => {
        const r = gm.r || 16, col = gm.col || '255,150,60';
        const pulse = (gm.base || 0.3) + 0.12 * Math.sin(now / (gm.speed || 240) + gm.x);
        const g = fctx.createRadialGradient(gm.x, gm.y, 1, gm.x, gm.y, r);
        g.addColorStop(0, `rgba(${col},${pulse})`);
        g.addColorStop(1, `rgba(${col},0)`);
        fctx.fillStyle = g;
        fctx.fillRect(gm.x - r, gm.y - r, r * 2, r * 2);
      });
      /* zwevende stofdeeltjes voor sfeer (binnen het kijkveld) */
      const motes = dk.motes || 0;
      for (let i = 0; i < motes; i++) {
        const bx = player.x + Math.sin(now / 1400 + i * 1.7) * (dk.peekR || 48) * 0.7;
        const by = (player.y - 12) + Math.cos(now / 1700 + i * 2.3) * (dk.peekR || 48) * 0.55;
        const a = 0.10 + 0.10 * Math.sin(now / 500 + i * 3);
        fctx.fillStyle = `rgba(225,210,170,${Math.max(0, a)})`;
        fctx.fillRect(bx | 0, by | 0, 1, 1);
      }
      /* gloeiende ogen in het donker */
      (dk.eyes || []).forEach(e => {
        const fl = 0.55 + 0.45 * Math.sin(now / 170 + e.x);
        const g = fctx.createRadialGradient(e.x + 1, e.y + 1, 0, e.x + 1, e.y + 1, 6);
        g.addColorStop(0, `rgba(255,70,45,${fl * 0.6})`);
        g.addColorStop(1, 'rgba(255,70,45,0)');
        fctx.fillStyle = g;
        fctx.fillRect(e.x - 5, e.y - 5, 12, 12);
        fctx.fillStyle = `rgba(255,60,40,${fl})`;
        fctx.fillRect(Math.round(e.x), Math.round(e.y), 2, 2);
      });
    }

    /* Debug: toon het loopgebied (alleen als __game.debugWalk aan staat) */
    if (window.__debugWalk) {
      fctx.save();
      fctx.globalAlpha = 0.45;
      fctx.fillStyle = '#19ff2e';
      for (let yy = 0; yy < SCENE_H; yy += 2)
        for (let xx = 0; xx < SCENE_W; xx += 2)
          if (inWalkableScene(scene, xx, yy)) fctx.fillRect(xx, yy, 2, 2);
      fctx.restore();
    }

    /* Win-viering (Ravenholt): blauwe drakenmagie golft over de vallei, sprankels stijgen op
       en een glanzende drakenschaduw soart de hemel in; daarna het win-scherm. */
    if (revive) {
      const rt = Math.min(1, (now - revive.t0) / 3500);
      const ga = Math.sin(rt * Math.PI);
      fctx.fillStyle = `rgba(90,150,255,${ga * 0.40})`;          // diepblauwe magie-gloed
      fctx.fillRect(0, 0, SCENE_W, SCENE_H);
      for (let k = 0; k < 70; k++) {                             // opstijgende blauwe sprankels/sterretjes
        const tt = (rt * 1.5 + k * 0.103) % 1;
        const a = Math.sin(tt * Math.PI);
        if (a <= 0.05) continue;
        const bx = (k * 71) % SCENE_W + Math.sin(now / 300 + k) * 18;
        const by = SCENE_H + 10 - tt * (SCENE_H + 28);
        fctx.fillStyle = `rgba(${130 + (k % 50)},${190 + (k * 31) % 50},255,${a})`;
        const sz = 2 + (k % 3);
        fctx.fillRect((bx - sz / 2) | 0, by | 0, sz, sz);
      }
      for (let k = 0; k < 24; k++) {                             // witte glinstersterren
        const tt = (rt * 2 + k * 0.17) % 1, a = Math.sin(tt * Math.PI);
        const sxp = (k * 131) % SCENE_W, syp = 24 + (k * 71) % 220 - tt * 30;
        fctx.fillStyle = `rgba(235,245,255,${a})`;
        fctx.fillRect(sxp | 0, syp | 0, 2, 2);
      }
      const dimg = art.sprites.dragonShadow;                    // een glanzende drakenschaduw soart omhoog de hemel in
      if (ready(dimg)) {
        const dw = 120 + rt * 80, dh = dw * dimg.naturalHeight / dimg.naturalWidth;
        const dx = SCENE_W * 0.5 + rt * 120, dy = SCENE_H - rt * (SCENE_H + 40);
        fctx.save(); fctx.globalAlpha = ga * 0.8;
        fctx.drawImage(dimg, (dx - dw / 2) | 0, dy | 0, dw, dh);
        fctx.restore(); fctx.globalAlpha = 1;
      }
      if (now - revive.t0 > 3500) { revive = null; showWin(); }
    }

    const fa = fadeAlpha(now);
    if (fa > 0) {
      fctx.fillStyle = `rgba(16,11,7,${fa})`;
      fctx.fillRect(0, 0, SCENE_W, SCENE_H);
    }

    const w = window.innerWidth, h = window.innerHeight;
    ctx.fillStyle = '#1a1410';
    ctx.fillRect(0, 0, w, h);
    const scale = Math.min(w / SCENE_W, h / SCENE_H);
    view.scale = scale;
    view.ox = (w - SCENE_W * scale) / 2;
    view.oy = (h - SCENE_H * scale) / 2;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(frameCanvas, view.ox, view.oy, SCENE_W * scale, SCENE_H * scale);

    drawHints(now, scale);
  }

  /* Sfeer-effecten bovenop de AI-art */
  /* Klein fonkel-sterretje (plusvorm) met alpha */
  function twinkle(x, y, a, col) {
    if (a <= 0.05) return;
    x = Math.round(x); y = Math.round(y);
    fctx.fillStyle = `rgba(${col || '255,243,200'},${Math.min(1, a)})`;
    fctx.fillRect(x, y - 1, 1, 3);
    fctx.fillRect(x - 1, y, 3, 1);
    if (a > 0.6) { fctx.fillRect(x, y - 2, 1, 1); fctx.fillRect(x, y + 2, 1, 1); }
  }

  function paintFx(scene, now) {
    const fx = scene.fx || {};
    const dark = !!(fx.darkness && !state.flags[fx.darkness.until]);
    /* Altijd brandende muurfakkel bij de deur — geeft ook in het donker een sprankje licht. */
    /* In het donker: enkel een minuscuul flikkerend vlammetje (1px) als subtiele hint. */
    if (fx.doorFlame && dark) {
      const t = fx.doorFlame;
      const blink = 0.5 + 0.5 * Math.sin(now / 170);
      const g = fctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, 3);
      g.addColorStop(0, `rgba(255,180,80,${0.14 * blink})`);
      g.addColorStop(1, 'rgba(255,150,60,0)');
      fctx.fillStyle = g;
      fctx.fillRect(t.x - 3, t.y - 3, 6, 6);
      fctx.fillStyle = `rgba(255,200,90,${0.65 + 0.3 * blink})`;
      fctx.fillRect(t.x | 0, t.y | 0, 1, 1);
    }
    if (fx.waterfall) {
      const wf = fx.waterfall, n = wf.streaks || 16;
      for (let i = 0; i < n; i++) {
        const sx = wf.x + ((i * 53) % wf.w);
        const speed = 0.7 + ((i * 0.13) % 0.5);
        const tt = ((now * speed / 12) + i * 9) % wf.h;
        const al = 0.34 - (tt / wf.h) * 0.27;
        if (al > 0) { fctx.fillStyle = `rgba(232,245,252,${al})`; fctx.fillRect(sx | 0, (wf.y + tt) | 0, 1, 5); }
      }
      const fb = 0.22 + 0.12 * Math.sin(now / 120);
      fctx.fillStyle = `rgba(240,250,253,${fb})`;
      for (let k = 2; k < wf.w - 2; k += 3) fctx.fillRect((wf.x + k) | 0, (wf.y + wf.h - 2 + ((Math.sin(now / 90 + k) * 1) | 0)) | 0, 2, 1);
    }
    if (fx.snakeTongue && !(fx.snakeTongue.hideFlag && state.flags[fx.snakeTongue.hideFlag])) {
      const t = fx.snakeTongue, cyc = (now % 1500) / 1500;
      if (cyc < 0.32) {
        const e = Math.round(Math.sin(cyc / 0.32 * Math.PI) * (t.len || 8));
        const dx = (t.dx == null ? 0 : t.dx), dy = (t.dy == null ? 1 : t.dy);
        fctx.fillStyle = '#d62828';
        for (let i = 1; i <= e; i++) fctx.fillRect((t.x + dx * i) | 0, (t.y + dy * i) | 0, 1, 1);
        if (e > 2) { const tx = t.x + dx * e, ty = t.y + dy * e;
          fctx.fillRect((tx - dy) | 0, (ty + dx) | 0, 1, 1);
          fctx.fillRect((tx + dy) | 0, (ty - dx) | 0, 1, 1); }
      }
    }
    /* Een of twee grotere vogels die af en toe willekeurig overvliegen */
    if (fx.birds && !dark) {
      const bd = fx.birds;
      const n = bd.n || 2;                          // 1 à 2 vogels
      const s = bd.scale || 2;                      // grotere vogel
      const col = bd.col || '36,28,42';
      const frac = bd.frac || 0.32;                 // deel van de cyclus dat hij in beeld is
      const range = SCENE_W + 60;
      for (let i = 0; i < n; i++) {
        const period = (bd.period || 15000) + i * 4300;   // lange, gespreide cyclus
        const tcur = now + i * 6500 + (bd.x0 || 0) * 11;
        const cyc = Math.floor(tcur / period);
        const ph = (tcur % period) / period;
        if (ph > frac) continue;                          // grootste deel: lege lucht
        const p = ph / frac;                              // 0..1 vlucht over het scherm
        const hsh = (cyc * 2654435761 + i * 1013904223) >>> 0;
        const dir = (hsh & 1) ? 1 : -1;                   // willekeurige richting per pass
        const baseY = (bd.y || 40) + (hsh >>> 1) % (bd.yvar || 30);
        const pe = p * p * (3 - 2 * p);                          // smoothstep: rustig in/uit
        const x = dir > 0 ? pe * range - 30 : SCENE_W + 30 - pe * range;
        // Realistische 'bounding' vlucht: duidelijke op/neer-zwiepen i.p.v. een rechte lijn
        const amp = bd.bob || 8;
        const yAt = (pp) => Math.sin(pp * Math.PI) * -9                 // lichte algehele boog
                          + Math.sin(pp * Math.PI * 6.5 + i) * amp * 1.7 // snellere op/neer-zwiepen
                          + Math.sin(pp * Math.PI * 13 + i * 2) * amp * 0.45;
        const y = baseY + yAt(p);
        const edge = Math.min(1, Math.sin(p * Math.PI) * 1.6);   // in/uit-faden aan de randen
        const alpha = (bd.alpha == null ? 0.85 : bd.alpha) * edge;
        if (alpha < 0.04) continue;
        // het lijfje kantelt mee met de baan (neus omhoog bij stijgen, omlaag bij dalen)
        const slope = (yAt(p + 0.014) - yAt(p - 0.014)) / (0.028 * range);
        const pitch = Math.max(-0.5, Math.min(0.5, Math.atan(slope)));
        /* Geanimeerd roodborstje uit de Higgsfield sprite-sheet (4×3 = 12 vlieg-frames) */
        const sheet = art.sprites.robin;
        fctx.save();
        fctx.translate(Math.round(x), Math.round(y));
        fctx.rotate(pitch);
        if (dir < 0) fctx.scale(-1, 1);                         // sheet kijkt naar rechts → spiegel naar links
        fctx.globalAlpha = alpha;
        if (ready(sheet)) {
          const FR = 64, COLS = 4;                              // 256×192 sheet, 64px frames
          const fr = ((now / 80) | 0) % 12;                     // ~12 fps vleugelslag
          const dw = 18 * s, dh = 18 * s;
          const sm = fctx.imageSmoothingEnabled; fctx.imageSmoothingEnabled = true;
          fctx.drawImage(sheet, (fr % COLS) * FR, ((fr / COLS) | 0) * FR, FR, FR, -dw / 2, -dh / 2, dw, dh);
          fctx.imageSmoothingEnabled = sm;
        } else {
          fctx.fillStyle = `rgba(${bd.body || '96,74,56'},1)`;
          fctx.beginPath(); fctx.ellipse(0, 0, 3.2 * s, 2.3 * s, 0, 0, 6.3); fctx.fill();
          fctx.fillStyle = `rgba(${bd.breast || '210,88,44'},1)`;
          fctx.beginPath(); fctx.ellipse(1.6 * s, 0.7 * s, 1.9 * s, 1.6 * s, 0, 0, 6.3); fctx.fill();
        }
        fctx.globalAlpha = 1;
        fctx.restore();
      }
    }
    if (fx.flames && !dark) {
      for (const f of fx.flames) {
        const r = (f.r || 14) + 6;
        const flicker = 0.34 + 0.16 * Math.sin(now / 90 + f.x);
        const g = fctx.createRadialGradient(f.x, f.y, 1, f.x, f.y, r);
        g.addColorStop(0, `rgba(255,205,100,${flicker})`);
        g.addColorStop(0.5, `rgba(255,150,50,${flicker * 0.45})`);
        g.addColorStop(1, 'rgba(255,120,30,0)');
        fctx.fillStyle = g;
        fctx.fillRect(f.x - r, f.y - r, r * 2, r * 2);
        /* duidelijk flikkerend vlammetje in de toorts/brazier */
        const ff = (Math.sin(now / 70 + f.x) * 30) | 0;
        fctx.fillStyle = `rgba(255,${170 + ff},70,0.95)`;
        fctx.fillRect((f.x - 1) | 0, (f.y - 6) | 0, 2, 8);
        fctx.fillStyle = 'rgba(255,242,180,0.95)';
        fctx.fillRect(f.x | 0, (f.y - 4) | 0, 1, 4);
      }
    }
    /* Brandende muurfakkel zodra hij is aangestoken */
    if (fx.wallTorch && state.flags[fx.wallTorch.flag || 'torchLit']) {
      const t = fx.wallTorch, hgt = t.h || 46;
      const img = art.sprites.wallTorch;
      const topY = t.y - hgt;
      if (ready(img)) {
        const wd = Math.round(img.naturalWidth * hgt / img.naturalHeight);
        fctx.drawImage(img, Math.round(t.x - wd / 2), Math.round(topY), wd, hgt);
      }
      const fl = 0.22 + 0.13 * Math.sin(now / 90 + t.x);
      const g = fctx.createRadialGradient(t.x, topY + 4, 2, t.x, topY + 4, 24);
      g.addColorStop(0, `rgba(255,185,85,${fl})`);
      g.addColorStop(1, 'rgba(255,140,40,0)');
      fctx.fillStyle = g;
      fctx.fillRect(t.x - 24, topY - 18, 48, 48);
    }
    if (fx.emblemGlow) {
      const e = fx.emblemGlow;
      const pulse = 0.12 + 0.1 * Math.sin(now / 420);
      const g = fctx.createRadialGradient(e.x, e.y, 2, e.x, e.y, e.r || 18);
      g.addColorStop(0, `rgba(231,207,134,${pulse})`);
      g.addColorStop(1, 'rgba(231,207,134,0)');
      fctx.fillStyle = g;
      fctx.fillRect(e.x - (e.r || 18), e.y - (e.r || 18), (e.r || 18) * 2, (e.r || 18) * 2);
    }
    /* Fontein klatert alléén als de molen weer draait (requiresFlag, bv. millFixed);
       daarvoor staat de bron droog. Meerdere straaltjes mogelijk (links + rechts). */
    if (fx.fountain && (!fx.fountain.requiresFlag || state.flags[fx.fountain.requiresFlag])) {
      const f = fx.fountain;
      const jets = f.jets || [{ sx: f.sx, sy: f.sy }];
      const LEN = f.len || 22;                         // korte straal: blijft binnen het bekken
      /* vallende waterstraaltjes uit de tappen */
      for (const j of jets) {
        for (let i = 0; i < 5; i++) {
          const t = ((now / 42) + i * (LEN / 5)) % LEN;
          const al = 0.45 - t / (LEN * 2.4);
          fctx.fillStyle = `rgba(186,228,242,${al})`;
          fctx.fillRect(Math.round(j.sx + Math.sin(t / 3) * 0.4), Math.round(j.sy + t), 1, 1);
        }
      }
      /* opspattend / knipperend bij het wateroppervlak */
      if (((now / 120) | 0) % 2 === 0) {
        fctx.fillStyle = 'rgba(220,242,250,0.6)';
        fctx.fillRect(f.wx - 1, f.wy, 1, 1);
        fctx.fillRect(f.wx + 2, f.wy + 1, 1, 1);
      }
      /* drijvende rimpels op het oppervlak (klein, binnen de rand) */
      for (let i = 0; i < 2; i++) {
        const yy = f.wy + 4 + i * 6;
        const off = Math.sin(now / 520 + i * 1.7) * 3;
        fctx.fillStyle = `rgba(205,238,248,${0.16 + 0.1 * Math.sin(now / 300 + i)})`;
        fctx.fillRect(Math.round(f.wx + off), yy, 7, 1);
      }
    }
    /* Huilend meisje bij de kraam: twee traanstraaltjes die van haar ogen over de wangen vallen. */
    if (fx.cry && state.flags[fx.cry.flag] && !state.flags[fx.cry.stopFlag]) {
      const c = fx.cry;
      const eyes = [c.x - 2, c.x + 3];                 // linker- en rechteroog
      for (let e = 0; e < eyes.length; e++) {
        const fall = 13;
        const t = ((now / 70) + e * (fall / 2)) % fall; // traan valt van oog naar wang
        const al = Math.max(0, 0.9 - t / fall);
        const ex = eyes[e];
        fctx.fillStyle = `rgba(150,205,235,${al})`;
        fctx.fillRect(ex, Math.round(c.y + t), 2, 3);   // vallende traan (groter/zichtbaarder)
        fctx.fillStyle = `rgba(225,244,252,${al})`;     // glanzende kop op de traan
        fctx.fillRect(ex, Math.round(c.y + t), 2, 1);
      }
      if (((now / 260) | 0) % 2 === 0) {                // vochtige glinstering in beide ogen
        fctx.fillStyle = 'rgba(235,248,255,0.95)';
        fctx.fillRect(eyes[0], c.y - 1, 2, 1);
        fctx.fillRect(eyes[1], c.y - 1, 2, 1);
      }
    }
    /* Dansende vuurvliegjes bij de bloemen (na de dans-spreuk): groen-blauwe vonkjes die rond een punt zwermen. */
    /* Glinster-hint op een voorwerp (bv. de graanzak zodra de molen maalt) — een paar
       ronddraaiende twinkels zodat je ziet dat je het kunt oppakken. */
    if (fx.glints) {
      for (const gl of fx.glints) {
        if (gl.flag && !state.flags[gl.flag]) continue;
        if (gl.notFlag && state.flags[gl.notFlag]) continue;
        for (let i = 0; i < 3; i++) {
          const ang = now / 360 + i * 2.1;
          twinkle(gl.x + Math.cos(ang) * 11, gl.y + Math.sin(ang * 1.2) * 7, 0.5 + 0.45 * Math.sin(now / 200 + i * 2), gl.col || '255,228,150');
        }
      }
    }
    if (fx.flowerFlies && state.flags[fx.flowerFlies.flag] && !(fx.flowerFlies.stopFlag && state.flags[fx.flowerFlies.stopFlag])) {
      const ff = fx.flowerFlies, COLS = ['150,230,120', '120,200,255'];
      for (let i = 0; i < 9; i++) {
        const t = now / 700 + i * 2.1;
        const fx2 = ff.x + Math.cos(t * 1.3 + i) * (16 + (i % 3) * 6) + Math.sin(t * 0.7) * 4;
        const fy2 = ff.y - 14 + Math.sin(t * 1.7 + i * 2) * 12;
        const tw = 0.5 + 0.5 * Math.sin(now / 180 + i * 1.9);     // knipperen
        const col = COLS[i % 2];
        if (ff.glow) {                                            // zachte lichtgloed rond elk vuurvliegje (goedkoop: 2 lagen lage-alpha blokjes, geen gradient per frame)
          fctx.fillStyle = 'rgba(' + col + ',' + (0.10 * (0.5 + tw)).toFixed(2) + ')';
          fctx.fillRect(Math.round(fx2) - 4, Math.round(fy2) - 4, 9, 9);
          fctx.fillStyle = 'rgba(' + col + ',' + (0.16 * (0.5 + tw)).toFixed(2) + ')';
          fctx.fillRect(Math.round(fx2) - 2, Math.round(fy2) - 2, 5, 5);
        }
        fctx.fillStyle = 'rgba(' + col + ',' + (0.4 + 0.55 * tw).toFixed(2) + ')';
        fctx.fillRect(Math.round(fx2), Math.round(fy2), 2, 2);
      }
    }
    /* Opstijgende schoorsteenrook boven de daken — trage, zachte, realistische pluim:
       elk pluimpje dijt uit en wordt ijler terwijl het stijgt, met twee grijstinten en
       een lichte zijwaartse drift (alsof er een zacht briesje staat). */
    if (fx.smoke && !dark) {
      for (const c of fx.smoke) {
        const n = c.puffs || 7;
        const speed = c.speed || 3000;          // trager = realistischer (langere levensduur)
        const rise = c.rise || 40, spread = c.spread || 9, drift = c.drift || 5;
        for (let i = 0; i < n; i++) {
          const t = ((now / speed) + i / n) % 1;            // levensduur 0..1
          const ry = t * rise;
          // langzaam wiegende zijwaartse drift die met de hoogte toeneemt
          const sway = Math.sin(t * 3.0 + i * 1.7 + c.x) * (1 + t * spread) + t * drift;
          const x = c.x + sway;
          const y = c.y - ry;
          const r = (c.r0 || 1.4) + t * (c.r1 || 5.5);      // dijt uit bij het stijgen
          const fade = Math.min(1, t * 6) * (1 - t) * (1 - t);  // zacht in, traag uit
          const al = (c.alpha || 0.3) * fade;
          if (al <= 0.012) continue;
          // donkere kern + iets lichtere, bredere halo = pluizige donkere rook
          fctx.fillStyle = `rgba(74,70,66,${al * 0.6})`;
          fctx.beginPath(); fctx.arc(Math.round(x), Math.round(y), r * 0.7, 0, Math.PI * 2); fctx.fill();
          fctx.fillStyle = `rgba(120,116,110,${al})`;
          fctx.beginPath(); fctx.arc(Math.round(x), Math.round(y), r, 0, Math.PI * 2); fctx.fill();
        }
      }
    }
    /* Gloeiend gedicht op de molenvloer (zodra je in de vallei bent geweest, tot voorgelezen). */
    if (fx.poemGlow && state.flags[fx.poemGlow.flag] && !state.flags[fx.poemGlow.untilFlag]) {
      const p = fx.poemGlow;
      const pulse = 0.5 + 0.5 * Math.sin(now / 520);
      const g = fctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, 30);
      g.addColorStop(0, `rgba(255,225,140,${0.22 + 0.16 * pulse})`);
      g.addColorStop(0.6, `rgba(220,180,90,${0.08 + 0.06 * pulse})`);
      g.addColorStop(1, 'rgba(220,180,90,0)');
      fctx.fillStyle = g;
      fctx.fillRect(p.x - 30, p.y - 18, 60, 36);
      // een paar zwevende gouden lettertekens/vonkjes
      for (let k = 0; k < 5; k++) {
        const ang = now / 700 + k * 1.7;
        const tx = p.x + Math.cos(ang) * (10 + k * 2);
        const ty = p.y - 2 + Math.sin(ang * 1.3) * 5;
        twinkle(tx, ty, 0.3 + 0.5 * Math.sin(now / 200 + k * 2), '255,228,150');
      }
    }
    if (fx.bowlEmpty && state.flags.minotaurAsleep) {
      const b = fx.bowlEmpty;
      fctx.save();
      fctx.globalAlpha = 0.85;
      fctx.fillStyle = '#5e564a';
      fctx.beginPath();
      fctx.ellipse(b.x, b.y, b.rx, b.ry, 0, 0, Math.PI * 2);
      fctx.fill();
      fctx.restore();
    }
    if (fx.waterGlint && !(fx.waterGlintNeedsWater && state.flags.minotaurAsleep)) {
      if ((now / 800) % 2.6 < 0.4) {
        const wgl = fx.waterGlint;
        fctx.fillStyle = '#cdeef8';
        fctx.fillRect(wgl.x + (((now / 800) | 0) % 3) * 5, wgl.y, 2, 1);
      }
    }
    /* Het slaapmiddel blijft fonkelen in het water van de schaal */
    if (fx.waterGlint && state.flags.minotaurAsleep) {
      const wg = fx.waterGlint;
      const gl = 0.10 + 0.06 * Math.sin(now / 360);
      const g = fctx.createRadialGradient(wg.x, wg.y, 1, wg.x, wg.y, 16);
      g.addColorStop(0, `rgba(150,210,255,${gl})`);
      g.addColorStop(1, 'rgba(150,210,255,0)');
      fctx.fillStyle = g;
      fctx.fillRect(wg.x - 16, wg.y - 16, 32, 32);
      for (let k = 0; k < 3; k++) {
        const ang = now / 520 + k * 2.1;
        const tx = wg.x + Math.cos(ang) * 12;
        const ty = wg.y - 2 + Math.sin(ang * 1.3) * 7;
        twinkle(tx, ty, 0.3 + 0.5 * Math.sin(now / 180 + k * 2), '180,225,255');
      }
    }
    /* Gegraveerde aanwijzing op de muur rechts van het altaar: de volgorde 3-1-4-2 in stippen.
       Subtiel ingebeiteld (geen omlijning/paneel) — alleen de stippen, +7px naar rechts. */
    if (fx.tileHint && state.flags.minotaurAsleep && !state.flags.amuletRisen) {
      const t = fx.tileHint, seq = [3, 1, 4, 2];
      const pulse = 0.42 + 0.16 * Math.sin(now / 620);
      let gx = t.x - 11;
      for (const n of seq) {
        for (let i = 0; i < n; i++) {
          const py = Math.round(t.y - (n * 2.5) / 2 + i * 2.5);
          fctx.fillStyle = `rgba(255,222,74,${pulse})`;                // klein, geel, licht gloeiend
          fctx.fillRect(gx, py, 1, 1);
        }
        gx += 7;
      }
    }
    /* (De dichte/open poortdeur zit nu in de achtergrond-afbeelding.) */
    /* Open kist zodra de runenpuzzel is opgelost */
    if (fx.chestOpen && state.flags.runesSolved) {
      const img = art.sprites.chestOpen;
      if (ready(img)) {
        const w = img.naturalWidth, h = img.naturalHeight;
        /* Gespiegeld getekend (horizontaal omgedraaid) */
        fctx.save();
        fctx.translate(Math.round(fx.chestOpen.x), Math.round(fx.chestOpen.y - h));
        fctx.scale(-1, 1);
        fctx.drawImage(img, Math.round(-w / 2), 0, w, h);
        fctx.restore();
        const glow = 0.12 + 0.08 * Math.sin(now / 300);
        const g = fctx.createRadialGradient(fx.chestOpen.x, fx.chestOpen.y - h / 2, 2,
          fx.chestOpen.x, fx.chestOpen.y - h / 2, 26);
        g.addColorStop(0, `rgba(255,220,130,${glow})`);
        g.addColorStop(1, 'rgba(255,220,130,0)');
        fctx.fillStyle = g;
        fctx.fillRect(fx.chestOpen.x - 26, fx.chestOpen.y - h / 2 - 26, 52, 52);
      }
    }
    if (fx.amulet && state.flags.amuletRisen && !state.flags.taken_temple_shrine) {
      const a = fx.amulet;
      /* schuift omhoog uit het altaar zodra de puzzel is opgelost */
      const rise = amuletRiseT0 ? Math.min(1, (now - amuletRiseT0) / 950) : 1;
      const ease = 1 - Math.pow(1 - rise, 3);
      const yo = Math.round((1 - ease) * 24);   // begint 24px lager
      const ax = a.x, ay = a.y + yo;
      const glow = (0.3 + 0.18 * Math.sin(now / 350)) * (0.45 + 0.55 * ease);
      const g = fctx.createRadialGradient(ax + 8, ay + 8, 1, ax + 8, ay + 8, 17);
      g.addColorStop(0, `rgba(231,207,134,${glow})`);
      g.addColorStop(1, 'rgba(231,207,134,0)');
      fctx.fillStyle = g;
      fctx.fillRect(ax - 9, ay - 9, 34, 34);
      const img = art.items.amulet;
      if (ready(img)) {
        const hgt = 17, wd = Math.round(img.naturalWidth * hgt / img.naturalHeight);
        fctx.drawImage(img, ax, ay, wd, hgt);
      } else {
        drawSprite(fctx, AMULET_SPRITE, ax, ay, false, 2);
      }
      /* dansende fonkelingen rond de amulet (extra tijdens het omhoog schuiven) */
      const nTw = rise < 1 ? 5 : 3;
      for (let k = 0; k < nTw; k++) {
        const ang = now / 700 + k * 2.1;
        const tx = ax + 8 + Math.cos(ang) * 14;
        const ty = ay + 8 + Math.sin(ang * 1.3) * 12;
        twinkle(tx, ty, 0.45 + 0.45 * Math.sin(now / 200 + k * 2));
      }
    }
  }

  /* Dobbelsteen-posities van de pips binnen de tegel-rect (genormaliseerd). */
  const TILE_PIPS = {
    1: [[0.5, 0.5]],
    2: [[0.3, 0.32], [0.7, 0.68]],
    3: [[0.27, 0.28], [0.5, 0.5], [0.73, 0.72]],
    4: [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]]
  };
  /* Vloer-tegel vóór het altaar: de tegel zelf heeft DEZELFDE kleur als de vloer (geen
     contrasterende steen) — alleen een heel fijne rand + kleine, zacht gloeiende pips. */
  function drawTile(hs, pressed, now) {
    const r = hs.rect, cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    fctx.save();
    /* nauwelijks zichtbare voeg zodat je voelt dát het een tegel is, in de vloerkleur */
    fctx.lineWidth = 1;
    fctx.strokeStyle = pressed ? 'rgba(255,224,150,0.42)' : 'rgba(18,11,4,0.22)';
    fctx.strokeRect(r.x + 2.5, r.y + 2.5, r.w - 5, r.h - 5);
    const pips = TILE_PIPS[hs.pips || 1] || TILE_PIPS[1];
    const glow = pressed ? 0.95 : (0.42 + 0.26 * Math.sin(now / 430 + r.x));
    const bottomUp = r.y > 250 ? 4 : 0;   // onderste rij tegels: lichtjes iets omhoog
    const extraLeft = (hs.pips === 2 || hs.pips === 4) ? 3 : 0;   // tegel 2 en 4: lichtjes iets meer naar links
    for (const [fx, fy] of pips) {
      const px = r.x + 4 + fx * (r.w - 8) - 10 - extraLeft, py = r.y + 3 + fy * (r.h - 6) - 7 - bottomUp;   // iets meer naar links (+ onderste rij omhoog)
      const g = fctx.createRadialGradient(px, py, 0.3, px, py, 2.1);   // kleinere, zachte gloed
      g.addColorStop(0, `rgba(255,226,150,${glow})`);
      g.addColorStop(1, 'rgba(255,226,150,0)');
      fctx.fillStyle = g; fctx.fillRect(px - 3, py - 3, 6, 6);
      fctx.fillStyle = `rgba(255,232,168,${Math.min(1, glow + 0.3)})`;  // klein gloeiend puntje
      fctx.fillRect(Math.round(px), Math.round(py), 1, 1);
    }
    fctx.restore();
    if (pressed) {
      const g = fctx.createRadialGradient(cx, cy, 2, cx, cy, 26);
      g.addColorStop(0, `rgba(255,226,150,${0.24 + 0.14 * Math.sin(now / 250)})`);
      g.addColorStop(1, 'rgba(255,226,150,0)');
      fctx.fillStyle = g; fctx.fillRect(cx - 26, cy - 26, 52, 52);
    }
  }

  function paintPuzzleGlow(scene, now) {
    if (!scene.puzzles) return;
    for (const hs of scene.hotspots) {
      if (!hs.puzzleKey) continue;
      const pz = scene.puzzles[hs.puzzleKey.puzzle];
      const prog = state.flags['puzzle_' + hs.puzzleKey.puzzle] || 0;
      const idx = pz.sequence.indexOf(hs.puzzleKey.key);
      /* Vloer-tegels: altijd zichtbaar zodra de puzzel actief is (en nog niet opgelost) */
      if (hs.tile) {
        if (pz.requiresFlag && !state.flags[pz.requiresFlag]) continue;
        if (state.flags[pz.setFlag]) continue;
        drawTile(hs, idx < prog, now);
        continue;
      }
      const revealed = pz.revealFlag && state.flags[pz.revealFlag];
      const lit = state.flags[pz.setFlag] || idx < prog || revealed;
      if (!lit) continue;
      const r = hs.rect;
      const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
      /* met verlichte achtergrond geen extra halo, alleen fonkelingen */
      const litBg = state.currentScene === 'grove' && state.flags.runesRevealed && ready(art.groveLit);
      if (!litBg) {
        const pulse = 0.42 + 0.18 * Math.sin(now / 300 + idx);
        const g = fctx.createRadialGradient(cx, cy, 3, cx, cy, 30);
        g.addColorStop(0, `rgba(255,226,150,${pulse})`);
        g.addColorStop(1, 'rgba(255,226,150,0)');
        fctx.fillStyle = g;
        fctx.fillRect(cx - 30, cy - 30, 60, 60);
      }
      /* fonkelende goud-sterretjes op de steen */
      for (let k = 0; k < 3; k++) {
        const ang = now / 600 + idx * 1.7 + k * 2.1;
        const tx = cx + Math.cos(ang) * 13;
        const ty = cy - 8 + Math.sin(ang * 1.4) * 16;
        twinkle(tx, ty, 0.35 + 0.5 * Math.sin(now / 170 + idx * 2 + k * 3), '255,232,150');
      }
    }
  }

  /* Items die je subtiel ziet liggen tot je ze pakt */
  /* Klein procedureel pixelwerk voor wereld-voorwerpen zonder eigen PNG. */
  function paintWorldGlyph(item, x, y, now) {
    fctx.save();
    fctx.imageSmoothingEnabled = false;
    if (item === 'berries') {
      /* trosje gitzwarte bessen + een paar blaadjes */
      fctx.fillStyle = '#3f6a32'; fctx.fillRect(x - 5, y - 6, 3, 2); fctx.fillRect(x + 2, y - 7, 3, 2);
      const berry = (bx, by) => {
        fctx.fillStyle = '#160d20'; fctx.fillRect(bx, by, 4, 4);
        fctx.fillStyle = '#3a2350'; fctx.fillRect(bx, by, 3, 3);
        fctx.fillStyle = '#8a5fb0'; fctx.fillRect(bx + 1, by, 1, 1);
      };
      berry(x - 5, y - 3); berry(x - 1, y - 4); berry(x + 2, y - 2); berry(x - 3, y + 1); berry(x + 1, y + 2);
    } else if (item === 'feather') {
      /* magische blauwzwarte ravenveer: gebogen schacht met taps toelopende baarden,
         iriserende glans. */
      const tw = 0.45 + 0.4 * Math.sin(now / 280);
      fctx.translate(x, y); fctx.rotate(-0.42);
      for (let i = -8; i <= 4; i++) {                                    // baarden: smalle puntjes boven/onder, breed in het midden
        const t = (i + 8) / 12;
        const w = Math.max(1, Math.round(Math.sin(t * Math.PI) * 4));
        fctx.fillStyle = '#1f2746'; fctx.fillRect(-w, i, w, 1);          // linker baard (donker blauwzwart)
        fctx.fillStyle = (i & 1) ? '#2e3b66' : '#3a4a7e'; fctx.fillRect(1, i, w, 1);   // rechter baard, licht gebandeerd
      }
      fctx.fillStyle = '#cdd6ee'; fctx.fillRect(0, -8, 1, 14);           // schacht (rachis)
      fctx.fillStyle = '#eaf0ff'; fctx.fillRect(0, -8, 1, 3);            // lichte punt
      fctx.fillStyle = `rgba(130,160,240,${tw})`; fctx.fillRect(-3, -1, 2, 4);          // blauwe glans
      fctx.fillStyle = `rgba(170,120,225,${tw * 0.7})`; fctx.fillRect(2, -3, 2, 3);     // paarse glans
    }
    fctx.restore();
  }

  function drawWorldItems(scene, now) {
    if (!scene.worldItems) return;
    for (const wi of scene.worldItems) {
      if (state.flags['taken_' + state.currentScene + '_' + wi.hotspot]) continue;
      if (wi.requiresFlag && !state.flags[wi.requiresFlag]) continue;
      const img = art.items[wi.item];
      if (!ready(img)) {
        /* geen PNG: procedureel tekenen met een zachte gloed + fonkeling */
        const r = 13, glow = 0.16 + 0.09 * Math.sin(now / 480 + wi.x);
        const col = wi.item === 'feather' ? '150,180,255' : '150,90,170';
        const g = fctx.createRadialGradient(wi.x, wi.y, 1, wi.x, wi.y, r);
        g.addColorStop(0, `rgba(${col},${glow})`); g.addColorStop(1, `rgba(${col},0)`);
        fctx.fillStyle = g; fctx.fillRect(wi.x - r, wi.y - r, r * 2, r * 2);
        paintWorldGlyph(wi.item, wi.x, wi.y, now);
        if (wi.item === 'feather') {                       // magische glitter rond de veer
          for (let k = 0; k < 3; k++) {
            const a2 = now / 300 + k * 2.1;
            twinkle(wi.x + Math.cos(a2) * 7, wi.y - 4 + Math.sin(a2 * 1.3) * 6, 0.3 + 0.45 * Math.sin(now / 200 + k * 2));
          }
        }
        continue;
      }
      const big = !!wi.highlight;                       // extra opvallend item (bv. de slaapbloem)
      const hgt = Math.round((big ? 26 : 18) * (wi.scale || 1)), wd = Math.round(img.naturalWidth * hgt / img.naturalHeight);
      const bob = big ? Math.round(Math.sin(now / 600) * 1.5) : 0;   // zachte deining trekt de aandacht
      const r = big ? 22 : 13;
      const glow = big ? (0.30 + 0.16 * Math.sin(now / 380 + wi.x)) : (0.14 + 0.08 * Math.sin(now / 500 + wi.x));
      const col = big ? '176,214,255' : '231,207,134';  // koel blauw-wit voor de bloem, valt op in de herfst
      const g = fctx.createRadialGradient(wi.x, wi.y, 1, wi.x, wi.y, r);
      g.addColorStop(0, `rgba(${col},${glow})`);
      g.addColorStop(1, `rgba(${col},0)`);
      fctx.fillStyle = g;
      fctx.fillRect(wi.x - r, wi.y - r, r * 2, r * 2);
      fctx.drawImage(img, Math.round(wi.x - wd / 2), Math.round(wi.y - hgt / 2) + bob, wd, hgt);
      if (big) {                                        // dansende fonkelingen rond de bloem
        for (let k = 0; k < 2; k++) {
          const ang = now / 640 + k * 3.1;
          twinkle(wi.x + Math.cos(ang) * 15, (wi.y - hgt / 2) + bob + Math.sin(ang * 1.3) * 11, 0.4 + 0.4 * Math.sin(now / 220 + k * 2));
        }
      }
      if (wi.item === 'feather') {                      // magische glitter rond de ravenveer
        for (let k = 0; k < 3; k++) {
          const a2 = now / 300 + k * 2.1;
          twinkle(wi.x + Math.cos(a2) * 9, wi.y - 4 + Math.sin(a2 * 1.3) * 6, 0.3 + 0.45 * Math.sin(now / 200 + k * 2));
        }
      }
    }
  }

  const SPRITE_SCALE = 2;

  function shadow(x, y, w) {
    fctx.fillStyle = 'rgba(30,16,8,0.32)';
    fctx.beginPath();
    fctx.ellipse(Math.round(x), Math.round(y) + 1, w / 2, 2.6, 0, 0, Math.PI * 2);
    fctx.fill();
  }

  /* Pixel-vast tekenen: posities en bob worden gerond tegen flikkeren. */
  function drawArtSprite(img, x, y, { flip = false, bob = 0, squashY = 1, rot = 0, scale = 1 } = {}) {
    const D = GAME.spriteDetail || 1;   // sprites op 2x opgeslagen -> op halve maat tekenen = fijnere details
    const w = Math.max(1, Math.round(img.naturalWidth * scale / D));
    const h = Math.max(1, Math.round(img.naturalHeight * scale / D));
    const px = Math.round(x), py = Math.round(y + bob);
    const dh = Math.round(h * squashY);
    shadow(x, y, w * 0.8);
    fctx.save();
    fctx.imageSmoothingEnabled = false;
    fctx.translate(px, py);
    if (rot) fctx.rotate(rot);
    if (flip) fctx.scale(-1, 1);
    drawImgTinted(img, 0, 0, img.naturalWidth, img.naturalHeight, Math.round(-w / 2), -dh, w, dh);
    fctx.restore();
  }

  /* Idle-gebaren: af en toe doet een figuur iets grappigs. */
  const gesture = { hero: { next: 7000, until: 0 }, seer: { next: 7000, until: 0 }, minotaur: { next: 9000, until: 0 } };
  function gestureState(id, now, durMs, minGap, maxGap) {
    let g = gesture[id]; if (!g) g = gesture[id] = { next: 0, until: 0 };
    if (now > g.next && now > g.until) {
      g.until = now + durMs;
      g.next = now + durMs + minGap + Math.random() * (maxGap - minGap);
    }
    return now < g.until ? (g.until - now) / durMs : 0;
  }

  /* Gemeten huid-/kapkleur rond de oog-lijn van een sprite (mediaan negeert de donkere ogen
     zelf), zodat een knipper een ooglid in de EIGEN kleur tekent i.p.v. een zwart blok. */
  const _faceCache = {};
  function faceColor(img, eyeFrac, halfW) {
    const key = img.src;
    if (key in _faceCache) return _faceCache[key];
    const w = img.naturalWidth, h = img.naturalHeight;
    if (!w) return null;
    let data;
    try {
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const cc = c.getContext('2d'); cc.imageSmoothingEnabled = false; cc.drawImage(img, 0, 0);
      data = cc.getImageData(0, 0, w, h).data;
    } catch (e) { _faceCache[key] = null; return null; }
    const eyeRow = Math.round(h * eyeFrac), cx0 = Math.round(w / 2);
    const rs = [], gs = [], bs = [];
    for (let yy = eyeRow - 1; yy <= eyeRow + 1; yy++) {
      if (yy < 0 || yy >= h) continue;
      for (let xx = cx0 - halfW; xx <= cx0 + halfW; xx++) {
        if (xx < 0 || xx >= w) continue;
        const i = (yy * w + xx) * 4;
        if (data[i + 3] < 140) continue;
        rs.push(data[i]); gs.push(data[i + 1]); bs.push(data[i + 2]);
      }
    }
    if (rs.length < 3) { _faceCache[key] = null; return null; }
    const med = a => { a.sort((p, q) => p - q); return a[a.length >> 1]; };
    const col = { r: med(rs), g: med(gs), b: med(bs) };
    _faceCache[key] = col;
    return col;
  }

  /* Af en toe knipperen: een kort, klein ooglid in de eigen huid-/kapkleur over de oog-lijn.
     eyes=2 tekent twee losse oogleden (bv. de held knippert met beide ogen). */
  const blinkT = {};
  /* Knipperen — getekend BINNEN exact dezelfde transform als de sprite (drawArtSprite),
     met oog-posities als FRACTIES van de sprite. Zo wordt diepte (scale), ademhaling
     (squashY), romp-rotatie (rot), zijwaartse wieg (x), sprong (bob) en spiegelen (flip)
     allemaal automatisch in de berekening meegenomen — het ooglid blijft altijd op de
     ogen, ook als Finn klein is of schommelt. */
  function eyeBlink(id, img, x, y, o) {
    if (!ready(img)) return;
    o = o || {}; const now = o.now;
    let b = blinkT[id];
    if (!b) { b = blinkT[id] = { next: now + 1800 + Math.random() * 3000, until: 0 }; }
    if (now >= b.next) { b.until = now + 95; b.next = now + 2600 + Math.random() * 3600 + (Math.random() < 0.25 ? -2200 : 0); }
    if (now >= b.until) return;
    const D = GAME.spriteDetail || 1;
    const scale = o.scale || 1, squashY = o.squashY || 1;
    const eyeFrac = o.eyeFrac != null ? o.eyeFrac : 0.2;     // oog-lijn, fractie vanaf de bovenkant
    const cxFrac  = o.eyeCxFrac != null ? o.eyeCxFrac : 0.5; // oog-midden, fractie vanaf links
    const gapFrac = o.eyeGap != null ? o.eyeGap : 0.09;      // halve oog-afstand, fractie van de breedte
    /* Huidkleur op de wang (net onder de ogen), in natuurlijke pixels bemonsterd. */
    const col = faceColor(img, Math.min(0.95, eyeFrac + 0.07), Math.max(4, Math.round(gapFrac * img.naturalWidth)))
             || faceColor(img, eyeFrac, 8);
    if (!col) return;
    const w = Math.max(1, Math.round(img.naturalWidth * scale / D));
    const h = Math.max(1, Math.round(img.naturalHeight * scale / D));
    const dh = Math.round(h * squashY);
    const eyeY = -dh + Math.round(dh * eyeFrac);            // lokale oog-lijn (voeten = 0)
    const cxL = -w / 2 + cxFrac * w;
    const lw = Math.max(2, Math.round((o.lidWFrac != null ? o.lidWFrac : 0.07) * w));
    const lh = Math.max(1, Math.round(h * 0.02));
    const lid = `rgb(${col.r},${col.g},${col.b})`;
    const lash = `rgba(${(col.r * 0.45) | 0},${(col.g * 0.4) | 0},${(col.b * 0.4) | 0},0.85)`;
    fctx.save(); fctx.imageSmoothingEnabled = false;
    fctx.translate(Math.round(x), Math.round(y + (o.bob || 0)));
    if (o.rot) fctx.rotate(o.rot);
    if (o.flip) fctx.scale(-1, 1);
    const drawLid = (lx) => {
      const x0 = Math.round(lx - lw / 2);
      fctx.fillStyle = lid;  fctx.fillRect(x0, eyeY, lw, lh);
      fctx.fillStyle = lash; fctx.fillRect(x0, eyeY + lh, lw, 1);
    };
    if ((o.eyes || 2) === 2) { drawLid(cxL - gapFrac * w); drawLid(cxL + gapFrac * w); }
    else drawLid(cxL);
    fctx.restore();
  }

  /* Brandende fakkel in de hand van de held (donkere tempel): warme gloed + vlam */
  function drawHeldTorch(now) {
    const hx = player.x + (player.flip ? -9 : 9), hy = player.y - 26;
    const fl = 0.5 + 0.2 * Math.sin(now / 90), r = 38;
    const g = fctx.createRadialGradient(hx, hy, 2, hx, hy, r);
    g.addColorStop(0, `rgba(255,196,96,${0.34 * fl})`);
    g.addColorStop(1, 'rgba(255,150,60,0)');
    fctx.fillStyle = g; fctx.fillRect(hx - r, hy - r, r * 2, r * 2);
    const ix = Math.round(hx), iy = Math.round(hy);
    fctx.fillStyle = '#5a3a22'; fctx.fillRect(ix - 1, iy, 2, 13);          // steel
    const ff = (Math.sin(now / 70) * 40) | 0;
    fctx.fillStyle = `rgba(255,${165 + ff},60,0.95)`; fctx.fillRect(ix - 1, iy - 6, 2, 6);  // vlam
    fctx.fillStyle = 'rgba(255,238,160,0.95)'; fctx.fillRect(ix, iy - 4, 1, 3);             // hart
  }
  /* Sfeerfilter voor personages in de tempel: donker vóór de fakkels, warm gelig-oranje erna
     (zo "zitten" de figuren in dezelfde kleur als de fakkelverlichte ruimte). */
  function sceneFilter() {
    /* Per-scene belichting voor de personages, zodat ze in de sfeer van de locatie passen. */
    const sc = GAME.scenes[state.currentScene];
    if (sc && sc.charFilter) return sc.charFilter;
    if (state.currentScene !== 'temple') return 'none';
    if (!state.flags.torchLit) return 'brightness(0.62)';
    return 'sepia(0.45) saturate(2) brightness(1.07) hue-rotate(-12deg)';   // warm fakkellicht maar met eigen kleur
  }
  /* Perspectief-diepte: personages krimpen naar achteren in de scène (kleinere y = verder weg).
     Per scène optioneel via scene.depth = { far, near, sFar, sNear }: op y=far schaal sFar,
     op y=near schaal sNear, lineair ertussen. Geen depth = schaal 1 (geen effect). */
  function depthScaleAt(y) {
    const d = GAME.scenes[state.currentScene] && GAME.scenes[state.currentScene].depth;
    if (!d) return 1;
    const t = Math.max(0, Math.min(1, (y - d.far) / (d.near - d.far)));
    return d.sFar + (d.sNear - d.sFar) * t;
  }

  /* Zichtbaarheid van een hotspot/NPC op basis van vlaggen:
     appearFlag = pas tonen zodra gezet; hideFlag = verbergen zodra gezet. */
  function flagVisible(o) {
    if (!o) return true;
    if (o.appearFlag && !state.flags[o.appearFlag]) return false;
    if (o.hideFlag && state.flags[o.hideFlag]) return false;
    return true;
  }

  /* Uitgang-pijlen (pulserend); worden vóór de personages getekend zodat ze ACHTER het karakter vallen. */
  function drawExitArrows(now) {
    const scene = GAME.scenes[state.currentScene];
    for (const hs of scene.hotspots) {
      if (!hs.exit || !hs.arrow) continue;
      if (!flagVisible(hs)) continue;
      if (hs.requiresFlag && !state.flags[hs.requiresFlag]) continue;
      const a = hs.arrow;
      const pulse = 0.58 + 0.22 * Math.sin(now / 350);
      const f = Math.sin(now / 350) * 2;
      const s = a.scale || 1.05;
      fctx.save();
      fctx.translate(a.x, a.y + (a.dir === 'up' ? f : a.dir === 'down' ? -f : 0));
      if (typeof a.rot === 'number') fctx.rotate(a.rot);
      else if (a.dir === 'left') { fctx.rotate(-Math.PI / 2); fctx.translate(-f, 0); }
      else if (a.dir === 'right') { fctx.rotate(Math.PI / 2); fctx.translate(f, 0); }
      else if (a.dir === 'down') fctx.rotate(Math.PI);
      fctx.scale(s, s);
      fctx.beginPath();
      fctx.moveTo(0, -10); fctx.lineTo(9, 1); fctx.lineTo(4, 1); fctx.lineTo(4, 9);
      fctx.lineTo(-4, 9); fctx.lineTo(-4, 1); fctx.lineTo(-9, 1);
      fctx.closePath();
      fctx.shadowColor = 'rgba(0,0,0,0.55)'; fctx.shadowBlur = 4;
      fctx.fillStyle = `rgba(247,226,150,${pulse})`;
      fctx.fill();
      fctx.shadowBlur = 0;
      fctx.strokeStyle = `rgba(28,18,14,${Math.min(1, pulse + 0.3)})`;
      fctx.lineWidth = 1.4;
      fctx.stroke();
      fctx.restore();
    }
  }

  function drawPlayer(now) {
    /* De held staat vaak in de schaduw -> iets donkerder dan de scène-belichting.
       Per scène fijn te regelen via scene.heroShade (lager = donkerder; standaard 0.9).
       Met een lichte contrast-demping is het zwart (omlijning/schaduw) wat minder hard. */
    const sf = sceneFilter();
    const sc = GAME.scenes[state.currentScene];
    const sh = (sc && typeof sc.heroShade === 'number') ? sc.heroShade : 0.9;
    const soft = ' brightness(' + sh + ') contrast(0.86)';
    const f = (sf === 'none') ? soft.trim() : (sf + soft);
    if (FILTER_OK) { fctx.filter = f; drawPlayerSprite(now); fctx.filter = 'none'; }
    else { currentTint = f; drawPlayerSprite(now); currentTint = null; }
  }

  function drawPlayerSprite(now) {
    const hero = art.sprites.hero;
    const walking = !!player.target || player.kbMoving;
    if (ready(hero)) {
      if (walking) {
        /* Schuin naar voren lopen (richting de speler): aparte 3/4-sprite met een verende
           stap, i.p.v. de zijaanzicht-loopsheet. Spiegelt mee met de horizontale richting. */
        const diag = art.sprites.heroWalkDiag;
        if (player.dir === 'down' && ready(diag)) {
          const ds = depthScaleAt(player.y);
          const sp = player.phase * 0.9;
          const hop = -Math.round(Math.abs(Math.sin(sp * Math.PI * 0.5)) * 2 * ds);   // verende pas
          const rock = Math.sin(sp * Math.PI * 0.5) * 0.03;
          drawArtSprite(diag, player.x, player.y, { flip: player.flip, bob: hop, rot: rock, scale: ds });
          return;
        }
        /* Volledige 8-frame loopcyclus uit de Higgsfield AutoSprite-sheet. */
        const sheet = art.sprites.heroWalkSheet;
        if (ready(sheet)) {
          const D = GAME.spriteDetail || 1;
          const NF = (GAME.heroWalkFrames || 8), fw = sheet.naturalWidth / NF, fh = sheet.naturalHeight;
          /* Frame-timing op TIJD (niet op afgelegde afstand): zo blijft de loop altijd
             vloeiend doorlopen — ook als Finn langzaam loopt of afremt bij een waypoint
             (geen plots "stilstaan" meer). ~11 fps over de 20 frames. */
          const t = now / 108;                        // iets langzamere beencyclus (lager tempo dan de loopsnelheid)
          const fr = Math.floor(t) % NF;
          /* Teken op dezelfde hoogte als de idle-held (geen groei) en plant de voeten op
             de schaduw (de bron-frames hebben ~2px lucht onder de voeten) -> geen zweven.
             ds = perspectief-diepteschaal (kleiner naar achteren); /D compenseert de 2x sprites. */
          const ds = depthScaleAt(player.y);
          const dh = Math.round((ready(hero) ? hero.naturalHeight : 56) / D * ds);
          const dw = Math.round(fw * dh / fh);
          const foot = Math.round(dh * 2 * D / fh);   // compenseer de lucht onder de voeten
          /* De /lopen-animatie heeft zelf al de natuurlijke beweging (lichaam, benen, arm/staf),
             dus de engine voegt GEEN extra wip/zwaai toe (anders gaat het dubbel wiebelen). */
          shadow(player.x, player.y, dw * 0.8);
          fctx.save();
          fctx.imageSmoothingEnabled = false;
          fctx.translate(Math.round(player.x), Math.round(player.y));
          if (player.flip) fctx.scale(-1, 1);
          drawImgTinted(sheet, fr * fw, 0, fw, fh, Math.round(-dw / 2), -dh + foot, dw, dh);
          fctx.restore();
          return;
        }
        /* Terugval: soepele 2-frame-pas met verende beweging. */
        const w1 = art.sprites.heroWalk, w2 = art.sprites.heroWalk2;
        const sp = player.phase * 0.5;
        const stride = Math.sin(sp);
        let img;
        if (ready(w1) && ready(w2)) img = stride > 0 ? w1 : w2;
        else if (ready(w1)) img = Math.abs(stride) > 0.35 ? w1 : hero;
        else img = hero;
        const step = Math.abs(stride);                  // piekt twee keer per cyclus
        const hop = -Math.round(step * 3);              // verende pas
        const lean = stride * 0.07;                     // lichte zwaai heen/weer
        const sway = Math.round(Math.cos(sp) * 1);      // subtiele zijwaartse wieg
        drawArtSprite(img, player.x + (player.flip ? -sway : sway), player.y, { flip: player.flip, bob: hop, rot: lean, scale: depthScaleAt(player.y) });
        return;
      }
      /* idle: rustig ademen + regelmatig vrolijk zwaaien (2-frame zwaai). */
      const ds = depthScaleAt(player.y);
      /* Af en toe ÉÉN keer zwaaien — pas na ~7s, en daarna met ruime tussenpozen.
         De zwaai-sprite kijkt dezelfde kant op als de idle (flip = player.flip), dus
         Finn draait NIET om om te zwaaien: links blijft links, rechts blijft rechts. */
      const g = gestureState('hero', now, 450, 13000, 22000);   // zwaai: sneller (450ms) en minder vaak (13-22s)
      const wave1 = art.sprites.heroWave, wave2 = art.sprites.heroWave2;
      if (g > 0 && ready(wave1)) {
        const wf = (ready(wave2) && g < 0.5) ? wave2 : wave1;   // hand omhoog -> half (één zwaai)
        const bounce = -Math.round(Math.abs(Math.sin((1 - g) * Math.PI)) * 2);
        drawArtSprite(wf, player.x, player.y, { flip: player.flip, bob: bounce, scale: ds });
        return;
      }
      /* Rustig staan: subtiele ademhaling + zachte wieg; 2-frame sta-pose. */
      const breaths = 1 + 0.012 * Math.sin(now / 1500);
      const idleRot = Math.sin(now / 760) * 0.018;               // iets minder schommelen
      const idleSway = Math.round(Math.sin(now / 760) * 0.5 * ds);
      /* Staan-stand = /lopen 21. Knipperen: om de 4 s twee frames snel achter elkaar
         (19 = ogen dicht, 20 = ogen weer open), elk ~55 ms -> korte, snelle knipper. */
      let bk = blinkT.hero;
      if (!bk) bk = blinkT.hero = { last: now };
      if (now - bk.last >= 4000) bk.last = now;
      const bt = now - bk.last;
      let idleImg = hero;
      if (bt < 55 && ready(art.sprites.heroBlink)) idleImg = art.sprites.heroBlink;
      else if (bt < 110 && ready(art.sprites.heroBlink2)) idleImg = art.sprites.heroBlink2;
      drawArtSprite(idleImg, player.x + idleSway, player.y, { flip: player.flip, scale: ds, squashY: breaths, rot: idleRot });
      return;
    }
    const stride = [0, 1, 0, 2][(player.phase | 0) % 4];
    const grid = playerFrame(player.dir, walking ? stride : 0);
    drawSprite(fctx, grid, (player.x - PLAYER_W * SPRITE_SCALE / 2) | 0,
      (player.y - PLAYER_H * SPRITE_SCALE) | 0, player.dir === 'left', SPRITE_SCALE);
  }

  function drawNpc(npc, now) {
    /* Warme/donkere sfeer toepassen; de minotaur is in het donker extra donker. */
    let f = sceneFilter();
    if (npc.sprite === 'minotaur' && state.currentScene === 'temple' && !state.flags.torchLit) f = 'brightness(0.4)';
    /* Eigen NPC-filter erbij (bv. de muis in de schaduw, donkerder). */
    if (npc.filter) f = (f === 'none') ? npc.filter : (f + ' ' + npc.filter);
    if (f !== 'none') {
      if (FILTER_OK) { fctx.filter = f; drawNpcInner(npc, now); fctx.filter = 'none'; }
      else { currentTint = f; drawNpcInner(npc, now); currentTint = null; }
    } else {
      drawNpcInner(npc, now);
    }
  }
  function drawNpcInner(npc, now) {
    const S = SPRITE_SCALE;
    const rt = npcRt[npc.id] || { x: npc.x, y: npc.y, flip: false, target: null, phase: 0 };
    /* Lichtgevende npc (bv. de gloeiende lavendelbloemen): zachte pulserende gloed aan de voet.
       De gloed staat los van een eventueel npc.filter (anders zou de kleur verschuiven). */
    if (npc.glow) {
      const savedFilter = fctx.filter;
      fctx.filter = 'none';
      const gx = rt.x, gy = rt.y - 8 * (npc.scale || 1);
      const gr = 18 + 22 * (npc.scale || 1);
      const a = 0.22 + 0.1 * Math.sin(now / 560 + (rt.phase || 0) * 3 + rt.x);
      const g = fctx.createRadialGradient(gx, gy, 1, gx, gy, gr);
      g.addColorStop(0, 'rgba(' + npc.glow + ',' + a.toFixed(3) + ')');
      g.addColorStop(1, 'rgba(' + npc.glow + ',0)');
      fctx.fillStyle = g;
      fctx.fillRect(Math.round(gx - gr), Math.round(gy - gr), Math.round(gr * 2), Math.round(gr * 2));
      fctx.filter = savedFilter;
    }
    if (npc.sprite === 'seer') {
      const img = art.sprites.seer;
      if (ready(img)) {
        if (rt.target) {
          /* zwevend schuifelen tijdens het zwerven */
          const hop = -Math.round(Math.abs(Math.sin(rt.phase * 0.7)) * 2);
          drawArtSprite(img, rt.x, rt.y, { flip: rt.flip, bob: hop });
        } else {
          const g = gestureState('seer', now, 900, 6000, 11000);
          const nod = g > 0 ? Math.round(Math.abs(Math.sin((1 - g) * Math.PI * 2)) * 3) : 0;
          const float_ = Math.round(Math.sin(now / 900) * 1.4);
          drawArtSprite(img, rt.x, rt.y, { flip: rt.flip, bob: float_ + nod });
        }
        eyeBlink('seer', img, rt.x, rt.y, { now, flip: rt.flip, eyeFrac: 0.31, eyeCxFrac: 0.5, eyeGap: 0.09, eyes: 1 });   // gloeiende ogen knipperen
        return;
      }
      const f = ((now / 800) | 0) % 2;
      drawSprite(fctx, SEER_FRAMES[f], (rt.x - SEER_W * S / 2) | 0, (rt.y - SEER_H * S) | 0, false, S);
    } else if (npc.sprite === 'dog') {
      if (state.flags.dogWarm && follower.active) return;   // volgt nu als follower
      const warm = state.flags.dogWarm;
      const img = warm
        ? (ready(art.sprites.dogVest) ? art.sprites.dogVest : art.sprites.dog)
        : (ready(art.sprites.dogCold) ? art.sprites.dogCold : art.sprites.dog);
      if (!ready(img)) return;
      /* sprite kijkt van zichzelf naar links → flip omdraaien */
      const fl = npc.facesLeft ? !rt.flip : rt.flip;
      if (!warm) {
        /* koud: zit stil te bibberen */
        const shiver = Math.round(Math.sin(now / 45)) * 1;
        fctx.save();
        fctx.translate(shiver, 0);
        drawArtSprite(img, rt.x, rt.y, { flip: fl });
        fctx.restore();
        /* bibber-streepjes */
        if (((now / 400) | 0) % 2 === 0) {
          fctx.fillStyle = 'rgba(180,210,255,0.7)';
          fctx.fillRect(rt.x + 14, rt.y - 32, 2, 1);
          fctx.fillRect(rt.x + 18, rt.y - 28, 2, 1);
        }
      } else if (rt.target) {
        /* dribbelen */
        const hop = -Math.round(Math.abs(Math.sin(rt.phase * 1.6)) * 3);
        const rock = Math.sin(rt.phase * 1.6) * 0.06;
        drawArtSprite(img, rt.x, rt.y, { flip: fl, bob: hop, rot: rock });
      } else {
        /* kwispelen: vrolijk wiebelen */
        const wag = Math.sin(now / 160) * 0.06;
        drawArtSprite(img, rt.x, rt.y, { flip: fl, rot: wag });
      }
    } else if (npc.sprite === 'minotaur') {
      const dimMino = !state.flags.torchLit;            // donkerder in het donker
      if (dimMino) fctx.filter = 'brightness(0.4)';
      const walkingToBowl = !!(minoWalk && !minoWalk.arrived);
      if (state.flags.minotaurAsleep && !walkingToBowl) {
        const img = art.sprites.minotaurAsleep;
        if (ready(img)) {
          drawArtSprite(img, rt.x, rt.y, { bob: Math.round(Math.sin(now / 800)) });
        } else {
          drawSprite(fctx, MINO_ASLEEP, (rt.x - MINO_SLEEP_W * S / 2) | 0,
            (rt.y - MINO_SLEEP_H * S) | 0, false, S);
        }
        if (dimMino) fctx.filter = 'none';
        /* Zzz stijgt op bij zijn kop */
        const zi = ((now / 700) | 0) % 3;
        for (let z = 0; z <= zi; z++) {
          drawSprite(fctx, Z_GLYPH, Math.round(rt.x + 26 + z * 9),
            Math.round(rt.y - 86 - z * 12), false, z === zi ? 1 : 2);
        }
      } else {
        const img = art.sprites.minotaur;
        if (ready(img)) {
          /* loopt naar de schaal: deinende stap; anders subtiele ademhaling */
          const bob = walkingToBowl ? -Math.round(Math.abs(Math.sin(rt.phase * 0.6)) * 2)
                                    : (Math.sin(now / 1500) > 0.6 ? -1 : 0);
          const lean = walkingToBowl ? Math.sin(rt.phase * 0.6) * 0.04 : 0;
          drawArtSprite(img, rt.x, rt.y, { bob: bob, rot: lean, flip: rt.flip });
        } else {
          const f = ((now / 600) | 0) % 2;
          drawSprite(fctx, MINO_AWAKE[f], (rt.x - MINO_W * S / 2) | 0, (rt.y - MINO_H * S) | 0, false, S);
        }
        if (dimMino) fctx.filter = 'none';
        /* (de minotaur knippert niet) */
      }
    } else {
      /* Generieke NPC: teken de sprite als rustig staande figuur (subtiele ademhaling).
         Diepteschaal van de scène vermenigvuldigt met een eventuele eigen npc.scale.
         Heeft de NPC een gestureSprite, dan toont hij die af en toe (bv. de burgemeester
         die wanhopig met zijn handen wringt omdat er geen water is). */
      let img = art.sprites[npc.sprite];
      /* Blikrichting-sprites: een NPC kan rustig heen en weer 'spieden' (scanSprites,
         bv. de koopman die van zijn kar naar de wacht kijkt) en omschakelen naar een
         verbaasde blik zodra een vlag is gezet (aweSprite, bv. starend naar de dansende bloem). */
      const npcStopped = npc.stopFlag && state.flags[npc.stopFlag];   // bv. koopman weer normaal zodra het rad uit de kar is
      const scared = npc.scareFlag && state.flags[npc.scareFlag];     // verbaasd schrikken (bv. om de drakenschaduw) — overschrijft stopFlag
      if (scared && npc.aweSprites && npc.aweSprites.length) {
        const a = npc.aweSprites, im = art.sprites[a[Math.floor(now / 280) % a.length]];
        if (ready(im)) img = im;                          // snel verbaasd heen en weer
      } else if (!npcStopped && npc.aweFlag && state.flags[npc.aweFlag] && npc.aweSprites && npc.aweSprites.length) {
        const a = npc.aweSprites, im = art.sprites[a[Math.floor(now / 480) % a.length]];
        if (ready(im)) img = im;                          // 2-frame verbaasde reactie
      } else if (!npcStopped && npc.aweSprite && npc.aweFlag && state.flags[npc.aweFlag] && ready(art.sprites[npc.aweSprite])) {
        img = art.sprites[npc.aweSprite];
      } else if (npc.scanSprites && npc.scanSprites.length) {
        const si = Math.floor(now / 1700) % npc.scanSprites.length;
        const ss = art.sprites[npc.scanSprites[si]];
        if (ready(ss)) img = ss;
      } else if (npc.lure && ready(art.sprites[npc.lure])) {
        /* Lokken: meestal rust, af en toe een 'kom hier'-wenk (de heks bij de ketel). */
        const cyc = (now % 2600) / 2600;
        if (cyc > 0.58 && cyc < 0.90) img = art.sprites[npc.lure];
      }
      /* Geanimeerde npc (de heks): speelt een frame-reeks i.p.v. de statische sprite.
         Battle-reeks tijdens de strijd (1-12 eenmalig -> lus 13-17), anders de rust-lus. */
      if (npc.battleFrames && state.flags.duelActive && art.frames[npc.battleFrames]) {
        const fr = art.frames[npc.battleFrames], intro = 13, total = fr.length;   // 1-13 eenmalig, daarna 14-17 in een lus
        const el = now - (window.__duelStart || now);
        const fi = (el < intro * 95) ? Math.min(intro - 1, (el / 95) | 0)
                                     : intro + (((now / 150) | 0) % (total - intro));
        if (ready(fr[fi])) img = fr[fi];
      } else if (npc.idleFrames && art.frames[npc.idleFrames]) {
        /* Rust-gebaar: meestal stil op frame 1; om de ~5 sec één snelle beweging (heen en terug). */
        const fr = art.frames[npc.idleFrames], n = fr.length;
        const phase = (now + (npc.x || 0) * 11) % 5000;       // periode van 5 sec (per npc iets verschoven)
        const stepMs = 70, gestureMs = (n - 1) * 2 * stepMs;  // snelle ping-pong door alle frames
        let fi = 0;
        if (phase < gestureMs) {
          const s = (phase / stepMs) | 0;                     // 0..2(n-1)
          fi = s < n ? s : (2 * (n - 1) - s);                 // heen (0..n-1) en terug (n-1..0)
        }
        if (ready(fr[fi])) img = fr[fi];
      }
      if (ready(img)) {
        const sc2 = depthScaleAt(rt.y) * (npc.scale || 1);
        const breaths = 1 + 0.012 * Math.sin(now / 1500 + (npc.x || 0));
        /* Kijkrichting kan omdraaien zodra een vlag is gezet (bv. de koopman kijkt naar zijn
           kar tot de bloem danst). */
        let fl = !!npc.flip;
        if (npc.turnFlag && state.flags[npc.turnFlag] && !npcStopped) fl = !fl;
        /* Lichte, doorlopende wieg voor wat 'leven' (bv. de wacht). */
        const swayRot = npc.sway ? Math.sin(now / 650 + (npc.x || 0)) * 0.035 : 0;
        const ges = npc.gestureSprite && art.sprites[npc.gestureSprite];
        if (npc.danceFlag && state.flags[npc.danceFlag] && !(npc.danceStopFlag && state.flags[npc.danceStopFlag])) {
          /* Dansende bloemen: vrolijk heen-en-weer wiegen + verende squash + opwippen.
             Elke bloem krijgt via haar x een eigen fase, zodat ze niet als één blok bewegen. */
          const ph = (npc.x || 0) * 0.5;
          const sway = Math.sin(now / 170 + ph);
          const bounce = -Math.abs(Math.sin(now / 150 + ph)) * 2;
          drawArtSprite(img, rt.x + Math.round(sway * 3), rt.y, {
            flip: fl, scale: sc2, rot: sway * 0.17, bob: bounce, squashY: 1 + 0.07 * Math.sin(now / 120 + ph)
          });
        } else if (npc.peck) {
          /* Pikkende kopduik (bv. raaf op de kar, of de knabbelende muis). peckAmt < 1 = rustiger. */
          const amt = npc.peckAmt || 1;
          const cyc = (now % 1900) / 1900;
          const dip = cyc < 0.20 ? Math.sin(cyc / 0.20 * Math.PI) : 0;
          drawArtSprite(img, rt.x, rt.y, { flip: fl, scale: sc2, rot: swayRot + dip * 0.26 * amt, bob: dip * 5 * amt, squashY: breaths });
        } else if (ges && ready(ges) && gestureState(npc.id, now, 1100, 2400, 5200) > 0) {
          const fret = Math.round(Math.sin(now / 110) * 0.8);   // gebaar (bv. wacht verzet hellebaard)
          drawArtSprite(ges, rt.x + fret, rt.y, { flip: fl, scale: sc2, rot: swayRot, squashY: breaths });
        } else {
          drawArtSprite(img, rt.x, rt.y, { flip: fl, scale: sc2, rot: swayRot, squashY: breaths });
        }
      }
    }
  }

  function drawFollower(now) {
    const f = sceneFilter();
    if (f !== 'none') fctx.filter = f;
    drawFollowerSprite(now);
    if (f !== 'none') fctx.filter = 'none';
  }

  function drawFollowerSprite(now) {
    const moving = !follower.scared &&
      (!!follower.wTarget || Math.hypot(player.x - follower.x, player.y - follower.y) > 46);
    if (follower.scared) {
      /* bang: ineengedoken (koude pose) + rillen + uitroepteken */
      const img = ready(art.sprites.dogCold) ? art.sprites.dogCold : art.sprites.dog;
      const jit = Math.round(Math.sin(now / 40)) ;
      if (ready(img)) drawArtSprite(img, follower.x + jit, follower.y, { flip: follower.flip });
      if (((now / 350) | 0) % 2 === 0) {
        fctx.fillStyle = '#e8d24a';
        const hx = Math.round(follower.x), hy = Math.round(follower.y - 34);
        fctx.fillRect(hx, hy, 2, 5); fctx.fillRect(hx, hy + 6, 2, 2);
      }
      return;
    }
    const img = ready(art.sprites.dogVest) ? art.sprites.dogVest : art.sprites.dog;
    const hop = moving ? -Math.round(Math.abs(Math.sin(follower.phase * 1.1)) * 2) : 0;
    const wag = moving ? 0 : Math.sin(now / 160) * 0.06;
    if (ready(img)) drawArtSprite(img, follower.x, follower.y, { flip: follower.flip, bob: hop, rot: wag });
  }

  /* Vrolijke dansende bijtjes en vlinders rond de betoverde bloemen bij de kasteelpoort.
     Klein pixelwerk, deinend op de maat van de dans; volgt de warme scène-belichting. */
  function drawCastleDancers(now) {
    const cx = 444, cy = 244;
    const f = sceneFilter();
    fctx.save();
    fctx.imageSmoothingEnabled = false;
    if (f !== 'none') fctx.filter = f;
    /* --- bijtjes: rustige, kleine figuur-acht --- */
    const BEES = [{ r: 26, ry: 9, sp: 470, ph: 0 }, { r: 20, ry: 12, sp: 430, ph: 2.1 }, { r: 31, ry: 7, sp: 520, ph: 4.0 }];
    for (const b of BEES) {
      const t = now / b.sp + b.ph;
      const bx = Math.round(cx + Math.cos(t) * b.r);
      const by = Math.round(cy + Math.sin(t * 1.5) * b.ry - Math.abs(Math.sin(now / 230 + b.ph)) * 2.5);
      fctx.fillStyle = '#3a2c10'; fctx.fillRect(bx, by, 3, 2);            // klein donker lijfje
      fctx.fillStyle = '#f4c63a'; fctx.fillRect(bx, by, 1, 2); fctx.fillRect(bx + 2, by, 1, 2);   // gele strepen
      if (((now / 70) | 0) % 2 === 0) {                                   // zachte vleugel-flikker
        fctx.fillStyle = 'rgba(255,255,255,0.45)';
        fctx.fillRect(bx, by - 1, 3, 1);
      }
    }
    /* --- vlinders: traag zwierig, klein, zachte vleugelslag --- */
    const FLIES = [{ r: 23, ry: 14, sp: 820, ph: 1.0, w: '#e6824a' }, { r: 16, ry: 17, sp: 920, ph: 3.4, w: '#79ace8' }];
    for (const v of FLIES) {
      const t = now / v.sp + v.ph;
      const vx = Math.round(cx + Math.sin(t) * v.r);
      const vy = Math.round(cy - 6 + Math.cos(t * 1.2) * v.ry - Math.abs(Math.sin(now / 250 + v.ph)) * 3);
      const ww = 1 + Math.round(Math.abs(Math.sin(now / 120 + v.ph)));    // smalle, rustige vleugelslag (1..2)
      fctx.fillStyle = '#2a1c12'; fctx.fillRect(vx, vy, 1, 3);            // lijfje
      fctx.fillStyle = v.w;
      fctx.fillRect(vx - ww, vy, ww, 1); fctx.fillRect(vx - ww, vy + 1, ww, 1);
      fctx.fillRect(vx + 1, vy, ww, 1); fctx.fillRect(vx + 1, vy + 1, ww, 1);
    }
    fctx.restore();
  }

  function drawHints(now, scale) {
    if (now > hintUntil) return;
    const remain = (hintUntil - now) / 1800;
    const pulse = 0.5 + 0.5 * Math.sin(now / 130);
    const alpha = Math.min(1, remain * 2) * (0.55 + 0.35 * pulse);
    for (const hs of GAME.scenes[state.currentScene].hotspots) {
      if (!flagVisible(hs)) continue;
      const r = hsRect(hs);
      const x = view.ox + r.x * scale, y = view.oy + r.y * scale;
      ctx.save();
      ctx.strokeStyle = `rgba(231,207,134,${alpha})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 5]);
      ctx.strokeRect(x + 2, y + 2, r.w * scale - 4, r.h * scale - 4);
      ctx.fillStyle = `rgba(201,162,75,${alpha * 0.12})`;
      ctx.fillRect(x + 2, y + 2, r.w * scale - 4, r.h * scale - 4);
      ctx.restore();
    }
  }

  function fadeAlpha(now) {
    if (!fade.mode) return 0;
    const p = Math.min(1, (now - fade.t0) / fade.dur);
    if (fade.mode === 'out') return p;
    if (p >= 1) { fade.mode = null; return 0; }
    return 1 - p;
  }

  /* ---------- Doel-banner ---------- */
  /* Data-driven questhint: de eerste regel uit GAME.questRules waarvan
     alle voorwaarden kloppen wint. Een regel met quest:null verbergt de hint.
     when: { flag, notFlag, has, notHas } — elk een string of array (flag = AND). */
  function condMet(c) {
    if (!c) return true;
    const f = state.flags, inv = state.inventory;
    const arr = (v) => v == null ? [] : (Array.isArray(v) ? v : [v]);
    if (!arr(c.flag).every((x) => f[x])) return false;
    if (arr(c.notFlag).some((x) => f[x])) return false;
    if (!arr(c.has).every((x) => inv.includes(x))) return false;
    if (arr(c.notHas).some((x) => inv.includes(x))) return false;
    return true;
  }
  function questKey() {
    const rules = GAME.questRules || [];
    for (const r of rules) {
      if (condMet(r.when)) return r.quest;
    }
    return null;
  }
  /* Spreuk-knop: verschijnt naast de inventaris zodra de dans-spreuk in het
     toverboek geschreven is; klikken spreekt de spreuk uit. */
  function updateSpellBtn() {
    if (!elSpellBtn) return;
    elSpellBtn.hidden = !(started && state.flags.spellWritten);
  }
  /* Werkt de gegeven spreuk op de huidige plek? (zelfde doelwit-logica als castSpell,
     maar zonder iets te casten — gebruikt om het spreuk-icoon te laten oplichten.) */
  function spellWorksHere(spellId) {
    const scene = GAME.scenes[state.currentScene];
    if (!scene) return false;
    const isDragon = spellId === 'dragonspell';
    if (isDragon && !state.flags.dragonSpellLearned) return false;
    if (!isDragon && !state.flags.spellWritten) return false;
    if (!isDragon && state.currentScene === 'valley' && !state.flags.valleyFlowersDancing) return true;
    const hs = (scene.hotspots || []).find((h) => h.castWith && (isDragon ? h.castWith.item === 'dragonspell' : h.castWith.item !== 'dragonspell'));
    if (!hs) return false;
    const c = hs.castWith;
    const fls = Array.isArray(c.setFlag) ? c.setFlag : [c.setFlag];
    if (fls.some((f) => state.flags[f])) return false;          // al gedaan
    if (c.requiresFlag && !state.flags[c.requiresFlag]) return false;   // voorwaarde nog niet gehaald
    return true;
  }

  function castSpell(spellId) {
    spellId = spellId || 'spell';
    const isDragon = spellId === 'dragonspell';
    if (!isDragon && !state.flags.spellWritten) return;
    if (isDragon && !state.flags.dragonSpellLearned) return;
    if (msgOpen()) showNextMsg();
    /* niet casten terwijl een popup open is */
    if (!elPuzzle.hidden || !elRiddle.hidden || !elRune.hidden || !elMaze.hidden || (elGear && !elGear.hidden) || (elChess && !elChess.hidden)) return;
    const scene = GAME.scenes[state.currentScene];
    /* Vallei: de dans-spreuk laat de lavendelbloemen rechts dansen en lokt vuurvliegjes. */
    if (!isDragon && state.currentScene === 'valley' && !state.flags.valleyFlowersDancing) {
      state.flags.valleyFlowersDancing = true;
      sfx('combine'); triggerCastFx(); updateQuest();
      if (!state.flags.witchDefeated) {   // de heks lacht je vierkant uit om zo'n 'kinderspreuk'
        say({ nl: 'De heks ziet de bloemetjes vrolijk wiegen en giert het uit van het lachen: “Hahahá! Is dát nou je machtige magie, jochie? Een dáns-spreukje voor wat bloempjes? Wat een kínderspreuk! Kom maar terug als je iets echts kent.”', en: 'The witch sees the little flowers swaying merrily and bursts out laughing: “Hahahá! Is THAT your mighty magic, boy? A little DANCE spell for some flowers? What a CHILD’S spell! Come back when you know something real.”' }, null, 'assets/art/face-witch.png');
      }
      say({ nl: 'Maar de lichtgevende lavendelbloemen wiegen sierlijk heen en weer, en hun blauwe licht lokt een zwerm vuurvliegjes die vrolijk meedansen. Vang er nu een paar in een leeg flesje! (tik de bloemen aan)', en: 'But the glowing lavender flowers sway gracefully, and their blue light draws a swarm of fireflies that dance along. Now catch a few in an empty vial! (tap the flowers)' });
      return;
    }
    /* Kies het juiste doelwit: de drakenspreuk werkt op een castWith met item 'dragonspell'
       (de poortwacht); de dans-spreuk op alle overige castWith-hotspots (bv. de bloem). */
    const hs = (scene.hotspots || []).find(h => h.castWith && (isDragon ? h.castWith.item === 'dragonspell' : h.castWith.item !== 'dragonspell'));
    if (hs) {
      const c = hs.castWith;
      const fls = Array.isArray(c.setFlag) ? c.setFlag : [c.setFlag];
      if (fls.some((f) => state.flags[f])) {            // al gecast
        say(lookText(hs), hsSpeaker(hs), hsFace(hs));
        return;
      }
      if (c.requiresFlag && !state.flags[c.requiresFlag]) { sfx('error'); say(c.needText || lookText(hs), hsSpeaker(hs), hsFace(hs)); return; }
      if (c.dragonSequence) { startDragonSequence(hs, c, fls); return; }   // drakenschaduw-flyby + verbaasde wacht/handelsman → daarna pas weg + win
      fls.forEach((f) => { state.flags[f] = true; });
      sfx('combine'); triggerCastFx(); updateQuest();
      say(c.text, hsSpeaker(hs), hsFace(hs));
      if (c.win) { pendingWin = true; sfx('win'); }
      if (scene.bgVariants && scene.bgVariants.some((v) => fls.includes(v.flag) || fls.includes(v.notFlag))) paintBackground();
      return;
    }
    if (isDragon) { say({ nl: 'De drakenspreuk gonst diep in je staf... maar hier is niemand om de stuipen op het lijf te jagen.', en: 'The dragon spell hums deep in your staff... but there’s no one here to strike with terror.' }); return; }
    say({ nl: 'Je voelt de dans-spreuk tintelen op je vingertoppen... maar hier is niets levends om te laten dansen.', en: 'You feel the dance-spell tingle at your fingertips... but there’s nothing alive here to make dance.' });
  }
  if (elSpellBtn) elSpellBtn.addEventListener('click', () => {
    elSpellBtn.classList.remove('cast'); void elSpellBtn.offsetWidth; elSpellBtn.classList.add('cast');
    setTimeout(() => elSpellBtn.classList.remove('cast'), 660);
    castSpell();
  });

  /* Drakenspreuk op de poortwacht: een kolossale drakenschaduw vliegt voorbij, de wacht en
     de handelsman kijken stomverbaasd op, en na ~2s vlucht de wacht weg → daarna 'wordt vervolgd'. */
  function startDragonSequence(hs, c, fls) {
    if (msgOpen()) showNextMsg();
    triggerCastFx();
    castGlow = { t0: performance.now() };
    dragonShadow = { t0: performance.now() };
    state.flags.dragonScare = true;                // handelsman (en wacht) schrikken op
    sfx('win');
    say(c.text, hsSpeaker(hs), hsFace(hs));         // tekst beschrijft de hele scène (staat bovenin)
    setTimeout(() => {                              // ~2,8s verbaasd → de wacht vlucht door de poort
      const g = npcRt.guard;
      if (g) burstAt(g.x, g.y - 30, { n: 14, col: '210,200,180', up: 8, life: 0.9 });
      fls.forEach((f) => { state.flags[f] = true; });   // guardFled → de wacht is weg
      sfx('use');
    }, 2800);
    setTimeout(() => {                              // schrik voorbij → win (wordt vervolgd)
      state.flags.dragonScare = false;
      dragonShadow = null;
      if (c.win) { pendingWin = true; if (!msgOpen()) showNextMsg(); }
      updateQuest();
    }, 4900);
  }

  function drawDragonShadow(now) {
    if (!dragonShadow) return;
    const img = art.sprites.dragonShadow;
    const el = (now - dragonShadow.t0) / 4200;     // langzamer dan eerst
    if (el >= 1 || !ready(img)) return;
    const arc = Math.sin(el * Math.PI);
    const fade = 0.45 + 0.55 * arc;                // al vanaf het begin zichtbaar-maar-ijl, vol op het hoogtepunt
    /* donkere schaduw-waas over de hele scène op het hoogtepunt van de overvlucht (lichter dan eerst) */
    fctx.fillStyle = 'rgba(14,11,22,' + (0.20 * arc).toFixed(3) + ')';
    fctx.fillRect(0, 0, SCENE_W, SCENE_H);
    /* de schaduw zelf: GROTER, van LINKSONDER naar RECHTSBOVEN; extra vervaagd (lagere dekking, ook al
       in het begin) met een vervagende staart (na-ijlende, steeds ijlere kopieën naar linksonder). */
    const w = 480, h = w * img.naturalHeight / img.naturalWidth;
    const x = -220 + el * (SCENE_W + 560);
    const y = (SCENE_H * 0.86) - el * (SCENE_H * 1.06);
    for (let g = 3; g >= 0; g--) {                 // g=0 = de draak zelf, g=1..3 = vervagende staart-na-ijling
      const ox = -g * 38, oy = g * 24;
      fctx.globalAlpha = fade * (g === 0 ? 0.40 : 0.14 - g * 0.035);
      fctx.drawImage(img, Math.round(x - w / 2 + ox), Math.round(y + oy), w, h);
    }
    fctx.globalAlpha = 1;
  }

  function updateQuest(force) {
    updateSpellBtn();
    const key = started ? questKey() : null;
    if (elInfoBtn) elInfoBtn.hidden = !key;        // (i)-knop alleen tonen als er een tip is
    if (!key) { elQuest.hidden = true; return; }
    const t = L(GAME.ui[key]);
    if (elQuest.textContent !== t || force) {
      elQuest.textContent = t;
      elQuest.style.opacity = '0';
      setTimeout(() => { elQuest.style.opacity = '1'; }, 30);
    }
    elQuest.hidden = !infoOpen;                    // tip alleen zichtbaar als (i) aan staat
  }
  if (elInfoBtn) elInfoBtn.addEventListener('click', () => {
    infoOpen = !infoOpen;
    elInfoBtn.classList.toggle('on', infoOpen);
    if (soundOn) sfx('tap');
    updateQuest(true);
  });

  /* ---------- Narratie: paneel + tekstballonnen ---------- */
  function say(text, anchor, face) {
    if (!text) return;
    msgQueue.push({ text, anchor: anchor || null, face: face || null });
    if (!msgOpen()) showNextMsg();
  }
  function msgOpen() { return !elMsg.hidden || !elBubble.hidden; }

  function showNextMsg() {
    elMsg.hidden = true;
    elBubble.hidden = true;
    if (msgQueue.length === 0) {
      if (pendingWin) { pendingWin = false; revive = { t0: performance.now() }; }
      return;
    }
    const m = msgQueue.shift();
    const mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (m.anchor && view.scale && !mobile) {
      elBubbleTxt.textContent = L(m.text);
      if (m.face) { elBubbleFace.src = m.face; elBubbleFace.hidden = false; }
      else elBubbleFace.hidden = true;
      const bx = view.ox + m.anchor.x * view.scale;
      elBubble.style.left = Math.max(window.innerWidth * 0.15,
        Math.min(window.innerWidth * 0.85, bx)) + 'px';
      elBubble.style.top = (Math.max(0, view.oy) + 10) + 'px';   // tekstwolk bovenin de scène (niet meer over de personages)
      elBubble.hidden = false;
    } else {
      /* paneel (op mobiel ook voor personages — met gezicht) */
      elMsgText.textContent = L(m.text);
      if (m.face) { elMsgFace.src = m.face; elMsgFace.hidden = false; }
      else elMsgFace.hidden = true;
      elMsg.hidden = false;
      elMsg.style.animation = 'none';
      void elMsg.offsetWidth;
      elMsg.style.animation = '';
    }
  }

  /* Keuze-dialoog (bv. de heks die je in haar ketel probeert te lokken: luisteren of wantrouwen). */
  let choiceActive = false;
  const elChoiceOpts = document.getElementById('choice-opts');
  function showChoice(c, anchor, face) {
    msgQueue = [];
    choiceActive = true;
    elBubble.hidden = true;
    elMsgText.textContent = L(c.prompt);
    if (face) { elMsgFace.src = face; elMsgFace.hidden = false; } else elMsgFace.hidden = true;
    if (elMsgMore) elMsgMore.hidden = true;
    elMsg.hidden = false;
    elChoiceOpts.innerHTML = '';
    elChoiceOpts.hidden = false;
    (c.options || []).forEach((opt) => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.textContent = L(opt.label);
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        choiceActive = false;
        elChoiceOpts.hidden = true;
        elChoiceOpts.innerHTML = '';
        if (elMsgMore) elMsgMore.hidden = false;
        elMsg.hidden = true;
        if (opt.setFlag) (Array.isArray(opt.setFlag) ? opt.setFlag : [opt.setFlag]).forEach((f) => { state.flags[f] = true; });
        if (sfx) sfx('tap');
        if (opt.text) say(opt.text, anchor, face);
        updateQuest();
      });
      elChoiceOpts.appendChild(b);
    });
    if (sfx) sfx('tap');
  }
  elMsg.addEventListener('click', () => { if (!choiceActive) showNextMsg(); });
  elBubble.addEventListener('click', showNextMsg);
  /* Tekstwolkje wegklikken met het kruisje (stopPropagation: niet dubbel doorspoelen). */
  const elMsgClose = document.getElementById('msgClose');
  const elBubbleClose = document.getElementById('bubbleClose');
  if (elMsgClose) elMsgClose.addEventListener('click', (e) => { e.stopPropagation(); showNextMsg(); });
  if (elBubbleClose) elBubbleClose.addEventListener('click', (e) => { e.stopPropagation(); showNextMsg(); });

  /* ---------- Hotspot-label ---------- */
  function showLabel(text, sticky) {
    if (labelTimer) { clearTimeout(labelTimer); labelTimer = null; }
    if (!text) { elLabel.hidden = true; return; }
    elLabel.textContent = text;
    elLabel.hidden = false;
    if (!sticky) labelTimer = setTimeout(() => { elLabel.hidden = true; }, 1800);
  }

  /* ---------- Toast ---------- */
  function showToast(text) {
    elToast.textContent = text;
    elToast.hidden = false;
    elToast.style.animation = 'none';
    void elToast.offsetWidth;
    elToast.style.animation = '';
    setTimeout(() => { elToast.hidden = true; }, 1650);
  }

  /* ---------- Inventaris ---------- */
  function renderInventory() {
    elInvbar.innerHTML = '';
    /* De spreuken (dans + draak) staan altijd in de meest rechtse vakjes; de rest links. */
    const spells = ['spell', 'dragonspell'].filter((id) => state.inventory.includes(id));
    const others = state.inventory.filter((id) => id !== 'spell' && id !== 'dragonspell');
    const slots = Math.max(MIN_SLOTS, others.length + spells.length);
    const firstSpell = slots - spells.length;   // index van het eerste spreuk-vakje (rechts)
    for (let i = 0; i < slots; i++) {
      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      const itemId = (i >= firstSpell) ? spells[i - firstSpell] : (i < others.length ? others[i] : undefined);
      if (itemId) {
        const item = GAME.items[itemId];
        slot.classList.add('filled');
        if (typeof item.sparkle === 'function' ? item.sparkle(state) : item.sparkle) slot.classList.add('sparkle');   // glinster-hint (bv. het toverboek)
        if (item.border) slot.classList.add('border-' + item.border);   // bv. de spreuk met een blauwe rand
        if ((itemId === 'spell' || itemId === 'dragonspell') && spellWorksHere(itemId)) slot.classList.add('spell-active');   // licht op zodra de spreuk hier werkt
        const imgSrc = typeof item.img === 'function' ? item.img(state) : item.img;   // img mag een functie zijn (bv. toverboek: vlak → met veer na het schrijven)
        if (imgSrc) {
          const im = document.createElement('img');
          im.src = imgSrc + AV;
          im.alt = L(item.name);
          im.draggable = false;
          im.onerror = () => { im.remove(); slot.textContent = item.icon; };
          slot.appendChild(im);
        } else {
          slot.textContent = item.icon;
        }
        slot.title = L(item.name);
        slot.dataset.item = itemId;
        if (itemId === state.selectedItem) slot.classList.add('selected');
        if (itemId === lastPopItem) slot.classList.add('pop');
        slot.addEventListener('click', () => onInventoryTap(itemId));
      }
      elInvbar.appendChild(slot);
    }
    lastPopItem = null;
    updateSpellBtn();
  }

  function onInventoryTap(itemId) {
    if (msgOpen()) showNextMsg();   // sluit lopende tekst én verwerk de tik meteen
    /* De dans-spreuk werkt rechtstreeks vanuit je tas: tik = uitspreken. */
    if (itemId === 'spell' || itemId === 'dragonspell') {
      state.selectedItem = null;
      const sl = elInvbar.querySelector('.inv-slot[data-item="' + itemId + '"]');
      if (sl) { sl.classList.remove('cast'); void sl.offsetWidth; sl.classList.add('cast'); setTimeout(() => sl.classList.remove('cast'), 660); }
      castSpell(itemId);
      renderInventory();
      return;
    }
    const item = GAME.items[itemId];
    if (itemId === 'spellbook') {
      if (state.selectedItem && state.selectedItem !== 'spellbook') { tryCombine(state.selectedItem, 'spellbook'); return; }   // bv. ring + boek = drakenspreuk schrijven
      if (state.flags.spellWritten) { state.selectedItem = null; openBook(); renderInventory(); return; }   // anders: blader door de pagina's
    }
    if (item && item.zoomImg && (!item.zoomImgFlag || state.flags[item.zoomImgFlag])) {   // leesbaar item; leeg toverboek nog niet (dan combineerbaar)
      state.selectedItem = null;
      sfx('tap');
      openZoom(typeof item.zoomImg === 'function' ? item.zoomImg(state) : item.zoomImg);   // zoomImg mag een functie zijn (bv. toverboek: dans-spreuk → drakenspreuk)
      /* Los blaadje (kaart, recept): zodra je het bekeken hebt, gaat het als bladzijde in je
         toverboek en verdwijnt het uit je tas. */
      if (item.fileFlag && !state.flags[item.fileFlag]) {
        state.flags[item.fileFlag] = true;
        removeItem(itemId);
        showToast(L({ nl: 'In je toverboek gestopt', en: 'Tucked into your spellbook' }));
      }
      renderInventory();
      return;
    }
    const sel = state.selectedItem;
    if (sel === itemId) {
      state.selectedItem = null;
      sfx('tap');
    } else if (sel) {
      tryCombine(sel, itemId);
    } else {
      state.selectedItem = itemId;
      sfx('tap');
      showLabel(L(GAME.items[itemId].name) + ' ' + L(GAME.ui.selected));
      if (item && item.look) say(item.look);   // toon de beschrijving van het voorwerp
    }
    renderInventory();
  }

  function tryCombine(a, b) {
    const recipe = GAME.recipes.find(r =>
      (r.a === a && r.b === b) || (r.a === b && r.b === a));
    state.selectedItem = null;
    if (!recipe) { sfx('error'); say(GAME.strings.noCombine); return; }
    /* Sommige combinaties kunnen alleen op een bepaalde plek (bv. schrijven aan de
       molenaarstafel). De voorwerpen blijven behouden zodat je het elders kunt proberen. */
    if (recipe.requiresScene && state.currentScene !== recipe.requiresScene) {
      sfx('error'); say(recipe.needSceneText || GAME.strings.noEffect); return;
    }
    /* Vlag-zettende combinatie (bv. met de inktveer in het toverboek schrijven):
       zet de vlag i.p.v. een nieuw voorwerp te maken; met keep blijven de voorwerpen. */
    if (recipe.setFlag) {
      const fls = Array.isArray(recipe.setFlag) ? recipe.setFlag : [recipe.setFlag];
      if (recipe.doneFlag && state.flags[recipe.doneFlag]) { say(recipe.doneText || recipe.text); return; }
      fls.forEach((f) => { state.flags[f] = true; });
      if (recipe.consume) (Array.isArray(recipe.consume) ? recipe.consume : [recipe.consume]).forEach(removeItem);
      else if (!recipe.keep) { removeItem(recipe.a); removeItem(recipe.b); }
      if (recipe.result) addItem(recipe.result);
      updateQuest();
      sfx('combine');
      /* Cinematic: speel eerst de spreuk-video af, dáárna de tekst (de vlag is al gezet,
         dus ook bij overslaan heb je je eerste spreuk). */
      if (recipe.cutscene) { playCutscene(recipe.cutscene, () => say(recipe.text)); }
      else say(recipe.text);
      return;
    }
    removeItem(recipe.a);
    removeItem(recipe.b);
    addItem(recipe.result);
    sfx('combine');
    say(recipe.text);
  }

  function addItem(itemId) {
    if (!state.inventory.includes(itemId)) {
      state.inventory.push(itemId);
      lastPopItem = itemId;
      showToast('+ ' + L(GAME.items[itemId].name));
    }
    renderInventory();
    updateQuest();
  }

  function removeItem(itemId) {
    const i = state.inventory.indexOf(itemId);
    if (i >= 0) state.inventory.splice(i, 1);
    if (state.selectedItem === itemId) state.selectedItem = null;
    renderInventory();
    updateQuest();
  }

  /* ---------- Hotspot-interactie ---------- */
  function lookText(hs) {
    const t = typeof hs.look === 'function' ? hs.look(state) : hs.look;
    return t || GAME.strings.nothingThere;
  }

  function takenFlag(hs) { return 'taken_' + state.currentScene + '_' + hs.id; }

  function puzzleTap(hs) {
    const scene = GAME.scenes[state.currentScene];
    const pz = scene.puzzles && scene.puzzles[hs.puzzleKey.puzzle];
    if (!pz) { say(lookText(hs)); return; }
    if (state.flags[pz.setFlag]) { say(pz.doneText || lookText(hs)); return; }
    if (pz.requiresFlag && !state.flags[pz.requiresFlag]) {
      sfx('error');
      say(pz.blockedText || GAME.strings.noEffect);
      return;
    }
    const progKey = 'puzzle_' + hs.puzzleKey.puzzle;
    const prog = state.flags[progKey] || 0;
    const r = hs.rect;
    if (hs.puzzleKey.key === pz.sequence[prog]) {
      state.flags[progKey] = prog + 1;
      /* gouden vonken op de geactiveerde steen */
      burstAt(r.x + r.w / 2, r.y + r.h / 2,
        { n: 16, col: '255,232,150', spMin: 12, spRange: 30, up: 18, life: 0.7 });
      if (prog + 1 >= pz.sequence.length) {
        state.flags[pz.setFlag] = true;
        sfx('combine');
        if (pz.revealAmulet) { amuletRiseT0 = performance.now(); }   // amulet schuift omhoog
        say(pz.solvedText);
        if (pz.burst) burstAt(pz.burst.x, pz.burst.y);
        updateQuest();
      } else {
        sfx('pickup');
        say(pz.stepText);
      }
    } else {
      state.flags[progKey] = 0;
      sfx('error');
      say(pz.resetText);
    }
  }

  /* ---------- Schuifpuzzel-popup (gouden embleem) ---------- */
  const elPuzzle     = document.getElementById('puzzle-screen');
  const elPuzGrid    = document.getElementById('puzzle-grid');
  const elPuzTitle   = document.getElementById('puzzle-title');
  const elPuzClose   = document.getElementById('puzzle-close');
  const elPuzHintBtn = document.getElementById('puzzle-hint-btn');
  const elPuzTip     = document.getElementById('puzzle-tip');
  let slide = null;      // { hs, n, tiles[], empty }
  let hintLevel = 0;     // 0 = geen, 1 = voorbeeld getoond, 2 = schuiftip getoond

  function openSlidePuzzle(hs) {
    const cfg = hs.slidePuzzle;
    { const c = document.getElementById('puzzle-card'); if (c) c.classList.remove('jig-wide'); }
    const n = cfg.size || 3;
    /* husselen vanaf opgelost met geldige zetten → altijd oplosbaar */
    const tiles = Array.from({ length: n * n }, (_, i) => i);
    let empty = n * n - 1;
    let prev = -1;
    for (let i = 0; i < 60; i++) {
      const opts = [];
      const ex = empty % n, ey = (empty / n) | 0;
      if (ex > 0) opts.push(empty - 1);
      if (ex < n - 1) opts.push(empty + 1);
      if (ey > 0) opts.push(empty - n);
      if (ey < n - 1) opts.push(empty + n);
      const pick = opts.filter(o => o !== prev)[(Math.random() * (opts.length - (opts.includes(prev) ? 1 : 0))) | 0] || opts[0];
      tiles[empty] = tiles[pick];
      tiles[pick] = n * n - 1;
      prev = empty;
      empty = pick;
    }
    slide = { hs, n, tiles, empty };
    hintLevel = 0;
    elPuzTitle.textContent = L(cfg.title);
    if (elPuzHintBtn) { elPuzHintBtn.textContent = '💡 Hint'; elPuzHintBtn.style.display = ''; }
    if (elPuzTip) elPuzTip.hidden = true;
    renderSlide();
    elPuzzle.hidden = false;
    sfx('tap');
  }

  function renderSlide() {
    const { hs, n, tiles } = slide;
    const cfg = hs.slidePuzzle;
    const px = 240 / n;
    if (elPuzTip) elPuzTip.hidden = true;   // strategie-tip vervalt na elke zet
    elPuzGrid.className = '';                // reset eventuele legpuzzel-layout
    elPuzGrid.style.width = ''; elPuzGrid.style.height = '';
    elPuzGrid.innerHTML = '';
    tiles.forEach((tile, pos) => {
      if (tile === n * n - 1) return;            // leeg vak
      const d = document.createElement('div');
      d.className = 'puz-tile';
      d.style.width = d.style.height = px + 'px';
      d.style.left = (pos % n) * px + 'px';
      d.style.top = ((pos / n) | 0) * px + 'px';
      d.style.backgroundImage = `url(${cfg.img}${AV})`;
      d.style.backgroundSize = '240px 240px';
      d.style.backgroundPosition = `-${(tile % n) * px}px -${((tile / n) | 0) * px}px`;
      d.dataset.pos = pos;
      /* touchend met preventDefault zodat Safari niet de 300ms click-delay heeft */
      d.addEventListener('touchend', (e) => { e.preventDefault(); slideTile(pos); }, { passive: false });
      d.addEventListener('click', () => slideTile(pos));
      elPuzGrid.appendChild(d);
    });
  }

  function slideTile(pos) {
    const s = slide; if (!s) return;
    const n = s.n;
    const dx = Math.abs((pos % n) - (s.empty % n));
    const dy = Math.abs(((pos / n) | 0) - ((s.empty / n) | 0));
    if (dx + dy !== 1) return;                   // niet naast het lege vak
    s.tiles[s.empty] = s.tiles[pos];
    s.tiles[pos] = n * n - 1;
    s.empty = pos;
    sfx('tap');
    renderSlide();
    if (s.tiles.every((t, i) => t === i)) {
      const cfg = s.hs.slidePuzzle;
      state.flags[cfg.setFlag] = true;
      if (cfg.give) addItem(cfg.give);
      sfx('gate');
      paintBackground();   // poort gaat open → achtergrond met open boog
      setTimeout(() => {
        elPuzzle.hidden = true;
        slide = null;
        say(cfg.solvedText);
        updateQuest();
        burstAt(cfg.burst ? cfg.burst.x : 450, cfg.burst ? cfg.burst.y : 110);
      }, 450);
    }
  }

  function closePuzzle() { elPuzzle.hidden = true; slide = null; jig = null; const c = document.getElementById('puzzle-card'); if (c) c.classList.remove('jig-wide'); }

  /* ---------- Legpuzzel: sleep ~10 onregelmatige scherven naar het kader (bak rechts) ---------- */
  let jig = null;   // { hs, n, frameW, frameH, stageW, stageH, scale, locked[], drag, pieces[] }
  const JIG_FW = 320, JIG_FH = 240;          // kader (4:3), links
  const JIG_GAP = 18, JIG_TRW = 272;         // bak met scherven, rechts
  const JIG_STAGE_W = JIG_FW + JIG_GAP + JIG_TRW;
  const JIG_STAGE_H = 250;
  const JIG_TIP = { nl: 'Sleep elke scherf naar de juiste plek in het kader.', en: 'Drag each shard into its place in the frame.' };
  const JIG_HINT_LABEL = { nl: '💡 Voorbeeld', en: '💡 Preview' };
  const JIG_PERIM = [[0,0],[0.37,0],[0.71,0],[1,0],[1,0.57],[1,1],[0.59,1],[0.25,1],[0,1],[0,0.43]];
  const JIG_CENTER = [0.47,0.49];
  const JIG_SHARDS = JIG_PERIM.map((p, i) => [JIG_CENTER, p, JIG_PERIM[(i + 1) % JIG_PERIM.length]]);
  function jigHint() {
    if (!jig || !jig.frameEl) return;
    sfx('tap');
    jig.frameEl.classList.add('jig-hint');
    clearTimeout(jig._hintT);
    jig._hintT = setTimeout(() => { if (jig && jig.frameEl) jig.frameEl.classList.remove('jig-hint'); }, 3500);
  }
  function fitJigsaw() {
    if (!jig || !jig.innerEl) return;
    /* Reset de breedte vóór het meten, anders meten we de al-geschaalde breedte (krimp-lus). */
    elPuzGrid.style.width = '';
    const availW = elPuzGrid.clientWidth || jig.stageW;
    /* Beschikbare hoogte = viewport minus titel, hint-knop, tip en marges van de kaart. */
    const vh = window.innerHeight || 480;
    const availH = Math.max(120, vh - 172);
    /* Schaal op zowel breedte als hoogte zodat de puzzel altijd past (ook liggend mobiel). */
    const sc = Math.min(1, availW / jig.stageW, availH / jig.stageH);
    jig.scale = sc;
    jig.innerEl.style.transform = 'scale(' + sc + ')';
    jig.innerEl.style.transformOrigin = 'top left';
    elPuzGrid.style.width = (jig.stageW * sc) + 'px';
    elPuzGrid.style.height = (jig.stageH * sc) + 'px';
  }
  function openJigsaw(hs) {
    const cfg = hs.jigsaw;
    const n = JIG_SHARDS.length;
    jig = { hs, n, frameW: JIG_FW, frameH: JIG_FH, stageW: JIG_STAGE_W, stageH: JIG_STAGE_H, scale: 1, locked: new Array(n).fill(false), drag: null };
    elPuzTitle.textContent = L(cfg.title);
    if (elPuzHintBtn) { elPuzHintBtn.style.display = ''; elPuzHintBtn.textContent = L(JIG_HINT_LABEL); }
    if (elPuzTip) { elPuzTip.hidden = false; elPuzTip.textContent = L(JIG_TIP); }
    const card = document.getElementById('puzzle-card'); if (card) card.classList.add('jig-wide');
    buildJigsaw();
    elPuzzle.hidden = false;
    requestAnimationFrame(fitJigsaw);
    sfx('tap');
  }
  function buildJigsaw() {
    const j = jig, cfg = j.hs.jigsaw;
    const img = 'url(' + cfg.img + AV + ')';
    const FW = j.frameW, FH = j.frameH, SW = j.stageW, SH = j.stageH, n = j.n;
    elPuzGrid.className = 'jig-stage';
    elPuzGrid.style.width = '100%';
    elPuzGrid.style.height = SH + 'px';
    elPuzGrid.innerHTML = '';
    const inner = document.createElement('div');
    inner.className = 'jig-inner';
    inner.style.width = SW + 'px'; inner.style.height = SH + 'px';
    elPuzGrid.appendChild(inner);
    j.innerEl = inner;
    // Kader links, met verborgen voorbeeld-laag (alleen bij Hint)
    const frame = document.createElement('div');
    frame.className = 'jig-frame';
    frame.style.width = FW + 'px'; frame.style.height = FH + 'px';
    const ghost = document.createElement('div');
    ghost.className = 'jig-ghost';
    ghost.style.backgroundImage = img; ghost.style.backgroundSize = '100% 100%';
    frame.appendChild(ghost);
    j.frameEl = frame; j.ghostEl = ghost;
    inner.appendChild(frame);
    // Scherven jumbled in de bak rechts van het kader
    const order = Array.from({ length: n }, (_, k) => k);
    for (let k = n - 1; k > 0; k--) { const m = (Math.random() * (k + 1)) | 0; const t = order[k]; order[k] = order[m]; order[m] = t; }
    const cols = 2, rows = Math.ceil(n / cols);
    const trayX = FW + JIG_GAP, trayW = SW - trayX;
    j.pieces = [];
    order.forEach((sh, slot) => {
      const tri = JIG_SHARDS[sh].map(([fx, fy]) => [fx * FW, fy * FH]);
      const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
      const el = document.createElement('div');
      el.className = 'jig-shard';
      el.style.width = FW + 'px'; el.style.height = FH + 'px';
      el.style.backgroundImage = img;
      el.style.backgroundSize = FW + 'px ' + FH + 'px';
      el.style.clipPath = 'polygon(' + tri.map(p => p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px').join(',') + ')';
      el.style.transformOrigin = cx.toFixed(1) + 'px ' + cy.toFixed(1) + 'px';
      const col = slot % cols, row = (slot / cols) | 0;
      const sx = trayX + (col + 0.5) * (trayW / cols), sy = (row + 0.5) * (SH / rows);
      const tx = sx - cx + ((sh * 53) % 18) - 9, ty = sy - cy + ((sh * 31) % 14) - 7;
      const rot = ((sh * 47) % 27) - 13;
      el._tray = { x: tx, y: ty, rot };
      el._shard = sh;
      el.style.left = tx + 'px'; el.style.top = ty + 'px';
      el.style.transform = 'rotate(' + rot + 'deg)';
      el.addEventListener('pointerdown', (e) => jigDown(e, el));
      inner.appendChild(el);
      j.pieces.push(el);
    });
  }
  window.addEventListener('resize', () => { if (jig && jig.innerEl) fitJigsaw(); });
  function jigLocalXY(e) {
    const rect = (jig.innerEl || elPuzGrid).getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width * jig.stageW,
      y: (e.clientY - rect.top) / rect.height * jig.stageH
    };
  }
  function jigDown(e, el) {
    const j = jig; if (!j || j.locked[el._shard]) return;
    e.preventDefault();
    const p = jigLocalXY(e);
    j.drag = { el, grabX: p.x - parseFloat(el.style.left), grabY: p.y - parseFloat(el.style.top) };
    el.classList.add('jig-drag');
    el.style.transform = 'rotate(0deg)';     // recht tijdens slepen
    el.style.zIndex = 60;
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
    el.addEventListener('pointermove', jigMove);
    el.addEventListener('pointerup', jigUp);
    el.addEventListener('pointercancel', jigUp);
  }
  function jigMove(e) {
    const d = jig && jig.drag; if (!d) return;
    const p = jigLocalXY(e);
    d.el.style.left = (p.x - d.grabX) + 'px';
    d.el.style.top = (p.y - d.grabY) + 'px';
  }
  function jigUp(e) {
    const j = jig, d = j && j.drag; if (!d) return;
    const el = d.el;
    el.removeEventListener('pointermove', jigMove);
    el.removeEventListener('pointerup', jigUp);
    el.removeEventListener('pointercancel', jigUp);
    j.drag = null;
    el.classList.remove('jig-drag');
    const lx = parseFloat(el.style.left), ly = parseFloat(el.style.top);
    if (Math.abs(lx) < 30 && Math.abs(ly) < 30) {          // dicht bij thuis (offset 0) -> vastklikken
      el.style.left = '0px'; el.style.top = '0px'; el.style.transform = 'rotate(0deg)'; el.style.zIndex = 1;
      el.classList.add('jig-locked');
      j.locked[el._shard] = true; sfx('tap');
      if (j.locked.every(Boolean)) solveJigsaw();
    } else {
      el.style.left = el._tray.x + 'px'; el.style.top = el._tray.y + 'px';
      el.style.transform = 'rotate(' + el._tray.rot + 'deg)'; el.style.zIndex = '';
    }
  }
  function solveJigsaw() {
    const cfg = jig.hs.jigsaw;
    if (jig.frameEl) jig.frameEl.classList.add('jig-done');
    if (cfg.setFlag) state.flags[cfg.setFlag] = true;
    sfx('gate'); paintBackground();
    setTimeout(() => {
      elPuzzle.hidden = true; jig = null;
      if (cfg.revealAmulet) {                       // amulet schuift omhoog uit het altaar
        state.flags.amuletRisen = true;
        amuletRiseT0 = performance.now();
        const am = (GAME.scenes.temple.fx || {}).amulet;
        if (am) burstAt(am.x + 8, am.y + 6, { n: 18, col: '231,207,134', up: 16, life: 1.0 });
      }
      if (cfg.give) addItem(cfg.give);
      if (cfg.win) { pendingWin = true; sfx('win'); }
      say(cfg.solvedText);
      updateQuest();
      if (cfg.burst) burstAt(cfg.burst.x, cfg.burst.y);
    }, 650);
  }

  elPuzClose.addEventListener('click', closePuzzle);

  /* Klik buiten de kaart sluit de popup */
  elPuzzle.addEventListener('pointerdown', (e) => {
    if (e.target === elPuzzle) closePuzzle();
  });

  /* Hint niveau 1: flash het opgeloste beeld */
  function flashPreview() {
    const cfg = slide.hs.slidePuzzle;
    const flash = document.createElement('div');
    flash.style.cssText =
      'position:absolute;inset:0;z-index:6;' +
      'background-image:url(' + cfg.img + AV + ');background-size:240px 240px;' +
      'image-rendering:pixelated;opacity:0;transition:opacity .2s;pointer-events:none;' +
      'box-shadow:inset 0 0 0 3px rgba(231,207,134,.7)';
    elPuzGrid.appendChild(flash);
    requestAnimationFrame(() => { flash.style.opacity = '0.93'; });
    setTimeout(() => { flash.style.opacity = '0'; }, 1700);
    setTimeout(() => { if (flash.parentNode) flash.parentNode.removeChild(flash); }, 2100);
  }

  /* Eerstvolgende vak dat volgens de laag-voor-laag-strategie aan de beurt is:
     het eerste vak in leesvolgorde waar de verkeerde tegel ligt. */
  function nextTargetCell(tiles) {
    for (let i = 0; i < tiles.length - 1; i++) if (tiles[i] !== i) return i;
    return -1;
  }

  /* Hint niveau 2: legt de schuifstrategie uit (buitenrand eerst, naar de
     hoek toe) en wijst de eerstvolgende tegel + zijn doelvak aan. */
  function showMoveHint() {
    const { tiles, n } = slide;
    const target = nextTargetCell(tiles);
    if (target < 0) return;
    const tilePos = tiles.indexOf(target);          // waar die tegel nu ligt
    const px = 240 / n;
    const row = (target / n | 0) + 1, col = (target % n) + 1;

    elPuzGrid.querySelectorAll('.puz-tile.suggest').forEach(el => el.classList.remove('suggest'));
    elPuzGrid.querySelectorAll('.puz-target').forEach(el => el.remove());

    /* doelvak markeren */
    const mark = document.createElement('div');
    mark.className = 'puz-target';
    mark.style.width = mark.style.height = px + 'px';
    mark.style.left = (target % n) * px + 'px';
    mark.style.top = (target / n | 0) * px + 'px';
    elPuzGrid.appendChild(mark);

    /* de tegel die in dat vak hoort laten pulseren */
    const tEl = elPuzGrid.querySelector('[data-pos="' + tilePos + '"]');
    if (tEl) tEl.classList.add('suggest');

    if (elPuzTip) {
      elPuzTip.textContent = lang === 'nl'
        ? `Strategie: werk van linksboven naar rechtsonder — maak eerst de bovenste rij af, dan de linkerkolom, enzovoort naar de hoek rechtsonder. De oplichtende tegel hoort in het gemarkeerde vak (rij ${row}, kolom ${col}). De laatste 2×2 los je als geheel op.`
        : `Strategy: work top-left to bottom-right — finish the top row first, then the left column, and so on toward the bottom-right corner. The glowing tile belongs in the marked cell (row ${row}, column ${col}). Solve the final 2×2 as one unit.`;
      elPuzTip.hidden = false;
    }
  }

  function showPuzzleHint() {
    if (jig) { jigHint(); return; }
    if (!slide) return;
    sfx('tap');
    hintLevel = (hintLevel % 2) + 1;
    if (hintLevel === 1) {
      flashPreview();
      if (elPuzHintBtn) elPuzHintBtn.textContent = lang === 'nl' ? '▶ Schuiftip' : '▶ Move tip';
    } else {
      showMoveHint();
      if (elPuzHintBtn) elPuzHintBtn.textContent = '💡 Hint';
      hintLevel = 0;
    }
  }

  if (elPuzHintBtn) elPuzHintBtn.addEventListener('click', showPuzzleHint);

  /* ---------- Raadsel-popup (de ziener) ---------- */
  const elRiddle      = document.getElementById('riddle-screen');
  const elRiddleTitle = document.getElementById('riddle-title');
  const elRiddleQ     = document.getElementById('riddle-question');
  const elRiddleAns   = document.getElementById('riddle-answers');
  const elRiddleClose = document.getElementById('riddle-close');

  /* Meertraps-proef: alle raadsels goed; één fout = opnieuw beginnen. */
  function openRiddle(hs) {
    const r = hs.riddle;
    elRiddleTitle.textContent = L(r.title);
    const rf = document.getElementById('riddle-face');
    const face = hsFace(hs);
    if (rf) { if (face) { rf.src = face; rf.hidden = false; } else rf.hidden = true; }
    if (r.intro) say(r.intro, hsSpeaker(hs), hsFace(hs));
    showRiddleQuestion(hs, 0);
    elRiddle.hidden = false;
    sfx('tap');
  }

  function showRiddleQuestion(hs, idx) {
    const r = hs.riddle;
    const item = r.questions[idx];
    elRiddleQ.textContent = L(item.q);
    elRiddleAns.innerHTML = '';
    const shuffled = item.answers.slice().sort(() => Math.random() - 0.5);
    for (const ans of shuffled) {
      const btn = document.createElement('button');
      btn.className = 'gold-btn riddle-ans';
      btn.textContent = L(ans.t);
      btn.addEventListener('click', () => {
        if (ans.ok) {
          if (idx + 1 < r.questions.length) {
            sfx('pickup');
            showRiddleQuestion(hs, idx + 1);
          } else {
            state.flags[r.setFlag] = true;
            elRiddle.hidden = true;
            if (r.reward) { addItem(r.reward); sfx('pickup'); }
            say(r.solvedText, hsSpeaker(hs), hsFace(hs));
            updateQuest();
          }
        } else {
          sfx('error');
          elRiddleQ.textContent = L(r.wrongText);
          elRiddleAns.innerHTML = '';
          setTimeout(() => showRiddleQuestion(hs, 0), 1500);
        }
      });
      elRiddleAns.appendChild(btn);
    }
  }
  elRiddleClose.addEventListener('click', () => { elRiddle.hidden = true; });

  /* ---------- Schaak-uitdaging (mat-in-drie, torenladder) ---------- */
  const elChess      = document.getElementById('chess-screen');
  const elChessBoard = document.getElementById('chess-board');
  const elChessHint  = document.getElementById('chess-hint');
  const elChessClose = document.getElementById('chess-close');
  const CHESS_GLYPH = { wK: '♔', wR: '♖', bK: '♚', bP: '♟' };
  const CHESS_PROMPT = { nl: 'Wit (jij) aan zet — zet de zwarte koning mat in 3 zetten met je twee torens (ladder naar de bovenrand).', en: 'White (you) to move — mate the black king in 3 moves with your two rooks (ladder to the top edge).' };
  let chessHs = null, chessSel = null, chessPos = null, chessLock = false, chessStep = 0, chessLast = null, chessMateSq = null;
  /* Beginstelling (rijen r0=boven..r7=onder, kolommen c0=a..c7=h):
     zwarte koning e6, witte torens a5 (afsnijder) en h3 (geeft schaak), witte koning e1. */
  function chessStart() {
    return [
      { color: 'b', type: 'K', r: 2, c: 4 },
      { color: 'w', type: 'R', r: 3, c: 0 },
      { color: 'w', type: 'R', r: 5, c: 7 },
      { color: 'w', type: 'K', r: 7, c: 4 }
    ];
  }
  /* De drie zetten: telkens [vanR,vanC, naarR,naarC] voor wit + het gescripte
     antwoord van de zwarte koning (b). Laatste zet heeft geen antwoord = mat. */
  const CHESS_LINE = [
    { w: [5, 7, 2, 7], b: [2, 4, 1, 4] },   // 1. Th6+  Ke7
    { w: [3, 0, 1, 0], b: [1, 4, 0, 4] },   // 2. Ta7+  Ke8
    { w: [2, 7, 0, 7], b: null }            // 3. Th8#  (mat)
  ];
  function chessAt(r, c) { return chessPos.find((p) => p.r === r && p.c === c); }
  function chessLegal(pc, r, c) {
    if (pc.r === r && pc.c === c) return false;
    const tgt = chessAt(r, c);
    if (tgt && tgt.color === pc.color) return false;
    if (pc.type === 'R') {
      if (pc.r !== r && pc.c !== c) return false;
      const dr = Math.sign(r - pc.r), dc = Math.sign(c - pc.c);
      let rr = pc.r + dr, cc = pc.c + dc;
      while (rr !== r || cc !== c) { if (chessAt(rr, cc)) return false; rr += dr; cc += dc; }
      return true;
    }
    if (pc.type === 'K') return Math.abs(r - pc.r) <= 1 && Math.abs(c - pc.c) <= 1;
    return false;
  }
  function chessKing() { return chessPos.find((p) => p.color === 'b' && p.type === 'K'); }
  function chessKingInCheck() {
    const k = chessKing();
    return !!k && chessPos.some((p) => p.color === 'w' && p.type === 'R' && chessLegal(p, k.r, k.c));
  }
  function renderChess() {
    elChessBoard.innerHTML = '';
    const inCheck = chessKingInCheck();
    const k = chessKing();
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      const sq = document.createElement('div');
      sq.className = 'chess-sq ' + (((r + c) % 2 === 0) ? 'lt' : 'dk');
      if (chessLast && ((chessLast.f[0] === r && chessLast.f[1] === c) || (chessLast.t[0] === r && chessLast.t[1] === c))) sq.classList.add('last');
      if (chessSel && chessSel.r === r && chessSel.c === c) sq.classList.add('sel');
      if (chessSel && chessLegal(chessSel, r, c)) sq.classList.add('dot');
      const pc = chessAt(r, c);
      if (pc) {
        const g = document.createElement('span');
        g.className = 'chess-pc ' + (pc.color === 'w' ? 'wp' : 'bp');
        g.textContent = CHESS_GLYPH[pc.color + pc.type];
        sq.appendChild(g);
      }
      if (inCheck && k && k.r === r && k.c === c) sq.classList.add('check');
      if (chessMateSq && chessMateSq[0] === r && chessMateSq[1] === c) sq.classList.add('mate');
      sq.addEventListener('click', () => chessClick(r, c));
      elChessBoard.appendChild(sq);
    }
  }
  function openChess(hs) {
    chessHs = hs; chessSel = null; chessLock = false; chessStep = 0; chessPos = chessStart();
    chessLast = null; chessMateSq = null;
    elChessHint.textContent = L(CHESS_PROMPT);
    renderChess();
    elChess.hidden = false;
    sfx('tap');
  }
  function chessReset(msg) {
    sfx('error');
    elChessHint.textContent = L(msg);
    chessSel = null; chessLock = true;
    if (elChessBoard) { elChessBoard.classList.remove('shake'); void elChessBoard.offsetWidth; elChessBoard.classList.add('shake'); }
    setTimeout(() => {
      chessPos = chessStart(); chessStep = 0; chessSel = null; chessLock = false; chessLast = null; chessMateSq = null;
      renderChess();
      elChessHint.textContent = L(CHESS_PROMPT);
    }, 1700);
  }
  function chessClick(r, c) {
    if (chessLock) return;
    const pc = chessAt(r, c);
    if (chessSel) {
      if (pc && pc.color === 'w') { chessSel = pc; renderChess(); sfx('tap'); return; }
      if (!chessLegal(chessSel, r, c)) { chessSel = null; renderChess(); return; }
      const step = CHESS_LINE[chessStep];
      const ok = chessSel.r === step.w[0] && chessSel.c === step.w[1] && r === step.w[2] && c === step.w[3];
      if (!ok) {
        chessReset({ nl: 'De oude man grinnikt: “Dat geeft geen mat, jongen. Denk aan de ladder — drijf de koning met je twee torens naar de bovenrand.” Het bord wordt teruggezet.', en: 'The old man chuckles: “That’s no mate, lad. Think of the ladder — drive the king to the top edge with your two rooks.” The board resets.' });
        return;
      }
      /* juiste witte zet */
      const tgt = chessAt(r, c); if (tgt) chessPos.splice(chessPos.indexOf(tgt), 1);
      chessLast = { f: [step.w[0], step.w[1]], t: [r, c] };
      chessSel.r = r; chessSel.c = c; chessSel = null; chessLock = true; renderChess(); sfx('combine');
      if (!step.b) {                                   // laatste zet = schaakmat
        const k = chessKing(); chessMateSq = k ? [k.r, k.c] : null;
        renderChess();
        elChessHint.textContent = L({ nl: '♚ Schaakmat! De koning kan geen kant meer op.', en: '♚ Checkmate! The king has nowhere left to go.' });
        sfx('win');
        setTimeout(() => {
          elChess.hidden = true;
          state.flags[chessHs.chess.setFlag] = true;
          if (chessHs.chess.give) { addItem(chessHs.chess.give); sfx('pickup'); }
          say(chessHs.chess.winText, hsSpeaker(chessHs), hsFace(chessHs));
          updateQuest();
        }, 1500);
        return;
      }
      /* zwart antwoordt (gescript) en dan is wit weer aan zet */
      setTimeout(() => {
        const bk = chessAt(step.b[0], step.b[1]);
        if (bk) { bk.r = step.b[2]; bk.c = step.b[3]; }
        chessLast = { f: [step.b[0], step.b[1]], t: [step.b[2], step.b[3]] };
        chessStep++; chessLock = false; renderChess();
        sfx('tap');
        elChessHint.textContent = L({ nl: 'Schaak! De koning vlucht omhoog — drijf hem verder met je andere toren...', en: 'Check! The king flees upward — drive it further with your other rook...' });
      }, 480);
      return;
    }
    if (pc && pc.color === 'w') { chessSel = pc; renderChess(); sfx('tap'); }
  }
  elChessClose.addEventListener('click', () => { elChess.hidden = true; });

  /* ---------- Runenstenen-popup (mobiel: klik volgorde in popup) ---------- */
  const elRune       = document.getElementById('rune-screen');
  const elRuneTitle  = document.getElementById('rune-title');
  const elRuneHint   = document.getElementById('rune-hint');
  const elRuneBtns   = document.getElementById('rune-btns');
  const elRuneStatus = document.getElementById('rune-status');
  const elRuneImg    = document.getElementById('rune-img');
  const elRuneImgWrap = document.getElementById('rune-imgwrap');
  const elRuneHotspots = document.getElementById('rune-hotspots');
  const elRuneClose  = document.getElementById('rune-close');

  /* Klikbare boek-zones over de puzzel-afbeelding (puzzle-books.png), gemeten als
     percentages van de afbeelding. Links→rechts: rood, blauw, geel, groen. */
  const BOOK_HOTSPOTS = [
    { key: 'rood',  left: 19.5, top: 9, width: 12,   height: 81 },
    { key: 'blauw', left: 36,   top: 9, width: 11,   height: 81 },
    { key: 'geel',  left: 50.5, top: 9, width: 12,   height: 81 },
    { key: 'groen', left: 65.5, top: 9, width: 12,   height: 81 }
  ];

  const RUNE_DEFS = [
    { key: 'leaf', nl: '🍃\nBlad',  en: '🍃\nLeaf'  },
    { key: 'sun',  nl: '☀\nZon',   en: '☀\nSun'    },
    { key: 'moon', nl: '🌙\nMaan',  en: '🌙\nMoon'  }
  ];

  function openRunePopup() {
    const scene = GAME.scenes[state.currentScene];
    const pz = scene.puzzles && scene.puzzles.runes;
    if (!pz) return;
    if (state.flags[pz.setFlag]) { say(pz.doneText || GAME.strings.nothingThere); return; }
    if (!state.flags[pz.requiresFlag]) { sfx('error'); say(pz.blockedText); return; }
    if (elRuneImgWrap) elRuneImgWrap.hidden = true;
    if (elRuneBtns) elRuneBtns.hidden = false;
    elRuneTitle.textContent = lang === 'nl' ? 'De Runenstenen' : 'The Rune Stones';
    elRuneHint.textContent  = lang === 'nl' ? 'Tik de stenen in de juiste volgorde aan' : 'Tap the stones in the right order';
    renderRunePopup();
    elRune.hidden = false;
    sfx('tap');
  }

  function renderRunePopup() {
    const pz = GAME.scenes[state.currentScene].puzzles.runes;
    const prog = state.flags['puzzle_runes'] || 0;
    elRuneBtns.className = 'rune-btn-row';
    elRuneBtns.innerHTML = '';
    RUNE_DEFS.forEach(({ key, nl, en }) => {
      const idx = pz.sequence.indexOf(key);
      const lit = idx < prog;
      const btn = document.createElement('button');
      btn.className = 'rune-stone-btn' + (lit ? ' lit' : '');
      btn.innerHTML = (lang === 'nl' ? nl : en).replace('\n', '<br>');
      if (!lit) btn.addEventListener('click', () => runePopupTap(key));
      elRuneBtns.appendChild(btn);
    });
    elRuneStatus.textContent = '';
  }

  function runePopupTap(key) {
    const pz = GAME.scenes[state.currentScene].puzzles.runes;
    const progKey = 'puzzle_runes';
    const prog = state.flags[progKey] || 0;
    const STONE_POS = { leaf: { x: 176, y: 130 }, sun: { x: 243, y: 125 }, moon: { x: 315, y: 125 } };
    if (key === pz.sequence[prog]) {
      state.flags[progKey] = prog + 1;
      sfx('pickup');
      const sp = STONE_POS[key] || { x: 250, y: 130 };
      burstAt(sp.x, sp.y, { n: 16, col: '255,232,150', spMin: 12, spRange: 26, up: 18, life: 0.7 });
      if (prog + 1 >= pz.sequence.length) {
        state.flags[pz.setFlag] = true;
        sfx('combine');
        burstAt(412, 128);
        setTimeout(() => { elRune.hidden = true; say(pz.solvedText); updateQuest(); }, 450);
      } else {
        renderRunePopup();
        const rem = pz.sequence.length - (prog + 1);
        elRuneStatus.textContent = lang === 'nl' ? `Goed! Nog ${rem}...` : `Good! ${rem} more...`;
      }
    } else {
      state.flags[progKey] = 0;
      sfx('error');
      elRuneStatus.textContent = L(pz.resetText);
      setTimeout(renderRunePopup, 1100);
    }
  }

  elRuneClose.addEventListener('click', () => { elRune.hidden = true; });

  /* ---------- Boeken-volgorde-puzzel (hergebruikt het runen-scherm) ----------
     Trek de vastzittende boeken in de juiste volgorde; dan komt het toverboek vrij. */
  function openBookPuzzle(hs) {
    const pz = hs.bookPuzzle;
    if (state.flags[pz.setFlag]) { say(pz.doneText || lookText(hs), hsSpeaker(hs)); return; }
    state.flags['puzzle_books'] = 0;
    if (elRuneImg) elRuneImg.src = (pz.img || 'assets/art/puzzle-books.png') + AV;
    if (elRuneImgWrap) elRuneImgWrap.hidden = false;
    if (elRuneBtns) { elRuneBtns.innerHTML = ''; elRuneBtns.hidden = true; }   // niet de knoppen, maar de boeken zelf zijn klikbaar
    elRuneTitle.textContent = L(pz.title);
    if (elRuneHint) elRuneHint.textContent = L(pz.hint);
    renderBookPuzzle(hs);
    elRune.hidden = false;
    sfx('tap');
  }
  function renderBookPuzzle(hs) {
    const pz = hs.bookPuzzle, prog = state.flags['puzzle_books'] || 0;
    /* Je klikt rechtstreeks op de boeken in de afbeelding (niet op knoppen). */
    if (!elRuneHotspots) return;
    elRuneHotspots.innerHTML = '';
    const byKey = {};
    pz.books.forEach((b) => { byKey[b.key] = b; });
    (pz.zones || BOOK_HOTSPOTS).forEach((h) => {
      const b = byKey[h.key];
      const done = pz.sequence.indexOf(h.key) < prog;
      const btn = document.createElement('button');
      btn.className = 'book-hot' + (done ? ' pulled' : '');
      btn.style.left = h.left + '%';
      btn.style.top = h.top + '%';
      btn.style.width = h.width + '%';
      btn.style.height = h.height + '%';
      btn.setAttribute('aria-label', b ? L(b.label) : h.key);
      if (!done) btn.addEventListener('click', () => bookTap(hs, h.key));
      elRuneHotspots.appendChild(btn);
    });
    elRuneStatus.textContent = '';
  }
  function bookTap(hs, key) {
    const pz = hs.bookPuzzle, prog = state.flags['puzzle_books'] || 0;
    if (key === pz.sequence[prog]) {
      state.flags['puzzle_books'] = prog + 1;
      sfx('pickup');
      if (prog + 1 >= pz.sequence.length) {
        state.flags[pz.setFlag] = true;
        if (pz.gives) addItem(pz.gives);
        sfx('combine');
        setTimeout(() => { elRune.hidden = true; if (pz.solvedText) say(pz.solvedText); updateQuest(); }, 500);
      } else {
        renderBookPuzzle(hs);
        const rem = pz.sequence.length - (prog + 1);
        elRuneStatus.textContent = lang === 'nl' ? `Het boek schuift los! Nog ${rem}...` : `The book slides loose! ${rem} more...`;
      }
    } else {
      state.flags['puzzle_books'] = 0;
      sfx('error');
      elRuneStatus.textContent = L(pz.resetText);
      setTimeout(() => { if (!elRune.hidden) renderBookPuzzle(hs); }, 1100);
    }
  }

  /* ---------- Tegel-popup vóór het altaar (juiste volgorde indrukken) ---------- */
  const TILE_DEFS = [{ key: 't1', pips: 1 }, { key: 't2', pips: 2 }, { key: 't3', pips: 3 }, { key: 't4', pips: 4 }];
  function openTilePopup() {
    const pz = (GAME.scenes[state.currentScene].puzzles || {}).altarTiles;
    if (!pz) return;
    if (state.flags[pz.setFlag]) { say(pz.doneText || GAME.strings.nothingThere); return; }
    if (pz.requiresFlag && !state.flags[pz.requiresFlag]) { sfx('error'); say(pz.blockedText); return; }
    if (elRuneImgWrap) elRuneImgWrap.hidden = true;
    if (elRuneBtns) elRuneBtns.hidden = false;
    elRuneTitle.textContent = lang === 'nl' ? 'De Tegels' : 'The Tiles';
    elRuneHint.textContent  = lang === 'nl' ? 'Druk de tegels in de juiste volgorde in (zie de muur)' : 'Press the tiles in the right order (see the wall)';
    renderTilePopup();
    elRune.hidden = false;
    sfx('tap');
  }
  function renderTilePopup() {
    const pz = GAME.scenes[state.currentScene].puzzles.altarTiles;
    const prog = state.flags['puzzle_altarTiles'] || 0;
    elRuneBtns.className = 'rune-btn-row tile-grid';   // altijd 2 rijen × 2 kolommen
    elRuneBtns.innerHTML = '';
    TILE_DEFS.forEach(({ key, pips }) => {
      const idx = pz.sequence.indexOf(key);
      const lit = idx < prog;
      const btn = document.createElement('button');
      btn.className = 'tile-btn' + (lit ? ' lit' : '');
      const im = document.createElement('img'); im.src = 'assets/art/tile-' + pips + '.png' + AV; im.alt = ''; im.draggable = false;
      btn.appendChild(im);
      if (!lit) btn.addEventListener('click', () => tilePopupTap(key, btn));
      elRuneBtns.appendChild(btn);
    });
    elRuneStatus.textContent = '';
  }
  /* Lichte sparkels op een tegel bij een juiste keuze. */
  function spawnTileSparkles(btn) {
    for (let i = 0; i < 6; i++) {
      const sp = document.createElement('span');
      sp.className = 'tile-sparkle';
      sp.style.left = (12 + Math.random() * 76) + '%';
      sp.style.top = (12 + Math.random() * 76) + '%';
      sp.style.animationDelay = (Math.random() * 0.18) + 's';
      btn.appendChild(sp);
      setTimeout(() => sp.remove(), 850);
    }
  }
  function tilePopupTap(key, btn) {
    const pz = GAME.scenes[state.currentScene].puzzles.altarTiles;
    const progKey = 'puzzle_altarTiles';
    const prog = state.flags[progKey] || 0;
    if (key === pz.sequence[prog]) {
      state.flags[progKey] = prog + 1;
      sfx('pickup');
      if (btn) {                                   // juiste keuze -> lichte sparkels
        btn.classList.add('lit', 'spark');
        spawnTileSparkles(btn);
        setTimeout(() => btn.classList.remove('spark'), 700);
      }
      if (prog + 1 >= pz.sequence.length) {
        state.flags[pz.setFlag] = true;
        sfx('combine');
        if (pz.revealAmulet) amuletRiseT0 = performance.now();
        const am = (GAME.scenes.temple.fx || {}).amulet;
        if (am) burstAt(am.x + 8, am.y + 6, { n: 18, col: '231,207,134', up: 16, life: 1.0 });
        setTimeout(() => { elRune.hidden = true; say(pz.solvedText); updateQuest(); }, 560);
      } else {
        const rem = pz.sequence.length - (prog + 1);
        elRuneStatus.textContent = lang === 'nl' ? `Goed! Nog ${rem}...` : `Good! ${rem} more...`;
      }
    } else {
      state.flags[progKey] = 0;
      sfx('error');
      elRuneStatus.textContent = L(pz.resetText);
      setTimeout(renderTilePopup, 1100);
    }
  }

  /* ---------- Doolhof-puzzel (de ward bij het altaar) ----------
     Een willekeurig (altijd oplosbaar) doolhof; stuur de figuur met de
     richtingsknoppen/pijltjes naar de gloeiende amulet om de ward te lichten. */
  const elMaze       = document.getElementById('maze-screen');
  const elMazeTitle  = document.getElementById('maze-title');
  const elMazeHint   = document.getElementById('maze-hint');
  const elMazeCanvas = document.getElementById('maze-canvas');
  const elMazeClose  = document.getElementById('maze-close');
  const mctx = elMazeCanvas ? elMazeCanvas.getContext('2d') : null;
  let maze = null;     // { hs, g, n, cur, exit, cell, trail }
  let mazeImg = null;  // optionele Higgsfield-achtergrond

  function genMazeGrid(cells) {
    const n = cells * 2 + 1;
    const g = Array.from({ length: n }, () => Array(n).fill(1)); // 1 = muur
    (function carve(r, c) {
      g[r][c] = 0;
      const dirs = [[0, 2], [0, -2], [2, 0], [-2, 0]].sort(() => Math.random() - 0.5);
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr > 0 && nr < n - 1 && nc > 0 && nc < n - 1 && g[nr][nc] === 1) {
          g[r + dr / 2][c + dc / 2] = 0;
          carve(nr, nc);
        }
      }
    })(1, 1);
    return { g, n };
  }

  function openMaze(hs) {
    if (!mctx) return;
    const cfg = hs.maze;
    const { g, n } = genMazeGrid(cfg.cells || 5);
    const cell = Math.floor(264 / n);
    elMazeCanvas.width = elMazeCanvas.height = cell * n;
    maze = { hs, g, n, cur: [1, 1], exit: [n - 2, n - 2], cell, trail: new Set(['1,1']), water: !!cfg.water };
    if (cfg.img && (!mazeImg || mazeImg._src !== cfg.img)) {
      mazeImg = new Image(); mazeImg._src = cfg.img; mazeImg.src = cfg.img + AV;
    }
    elMazeTitle.textContent = L(cfg.title);
    if (elMazeHint) elMazeHint.textContent = L(cfg.hint || '');
    elMaze.hidden = false;
    drawMaze(performance.now());
    sfx('tap');
  }

  /* Eén waterkanaal-vakje met stromende glinstering */
  function waterCell(x, y, cell, now, phase) {
    mctx.fillStyle = '#1c4d6b'; mctx.fillRect(x, y, cell, cell);
    for (let i = 0; i < 2; i++) {
      const yy = y + 5 + i * 9 + Math.sin(now / 380 + phase + i) * 1.5;
      mctx.fillStyle = `rgba(150,205,232,${0.22 + 0.16 * Math.sin(now / 280 + phase + i * 2)})`;
      mctx.fillRect(x + 2, Math.round(yy), cell - 4, 1);
    }
  }

  function drawMaze(now) {
    if (!maze || !mctx) return;
    now = now || performance.now();
    const { g, n, cur, exit, cell, trail } = maze;
    const W = cell * n;
    /* achtergrond: Higgsfield-textuur (gedimd) of effen */
    if (mazeImg && mazeImg.complete && mazeImg.naturalWidth > 0) {
      mctx.imageSmoothingEnabled = false;
      mctx.drawImage(mazeImg, 0, 0, W, W);
      mctx.fillStyle = 'rgba(12,10,20,0.35)'; mctx.fillRect(0, 0, W, W);
    } else {
      mctx.fillStyle = '#14100b'; mctx.fillRect(0, 0, W, W);
    }
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const x = c * cell, y = r * cell;
      if (g[r][c] === 1) {                       // muur: nat steen
        mctx.fillStyle = '#241a30'; mctx.fillRect(x, y, cell, cell);
        mctx.fillStyle = '#37294a'; mctx.fillRect(x, y, cell, 2);
        mctx.fillStyle = '#140d1d'; mctx.fillRect(x, y + cell - 2, cell, 2);
      } else if (trail.has(r + ',' + c)) {       // afgelegd pad
        if (maze.water) waterCell(x, y, cell, now, (r * 3 + c) * 0.9);
        else { mctx.fillStyle = 'rgba(216,185,138,0.5)'; mctx.fillRect(x, y, cell, cell); }
      } else {                                   // nog niet betreden
        mctx.fillStyle = 'rgba(20,16,28,0.45)'; mctx.fillRect(x, y, cell, cell);
        mctx.fillStyle = 'rgba(90,80,70,0.25)'; mctx.fillRect(x + 2, y + cell - 3, cell - 4, 1);
      }
    }
    /* uitgang: bekken onder de gloeiende amulet */
    const ex = exit[1] * cell + cell / 2, ey = exit[0] * cell + cell / 2;
    const filled = trail.has(exit[0] + ',' + exit[1]);
    const glow = 0.4 + 0.28 * Math.sin(now / 300);
    const gg = mctx.createRadialGradient(ex, ey, 1, ex, ey, cell);
    gg.addColorStop(0, `rgba(231,207,134,${glow})`); gg.addColorStop(1, 'rgba(231,207,134,0)');
    mctx.fillStyle = gg; mctx.fillRect(ex - cell, ey - cell, cell * 2, cell * 2);
    mctx.strokeStyle = '#e7cf86'; mctx.lineWidth = 2;
    mctx.strokeRect(Math.round(ex - cell / 2 + 2), Math.round(ey - cell / 2 + 2), cell - 4, cell - 4);
    if (filled && maze.water) { waterCell(Math.round(ex - cell / 2 + 3), Math.round(ey - cell / 2 + 3), cell - 6, now, 1.3); }
    mctx.fillStyle = '#e7cf86'; mctx.fillRect(Math.round(ex - 3), Math.round(ey - 4), 6, 8);
    mctx.fillStyle = '#a8432a'; mctx.fillRect(Math.round(ex - 2), Math.round(ey - 1), 4, 4);
    /* token: waterfront (water-modus) of gehulde figuur */
    const px = cur[1] * cell + cell / 2, py = cur[0] * cell + cell / 2;
    if (maze.water) {
      const tg = mctx.createRadialGradient(px, py, 1, px, py, cell * 0.7);
      tg.addColorStop(0, 'rgba(180,235,255,0.8)'); tg.addColorStop(1, 'rgba(120,200,235,0)');
      mctx.fillStyle = tg; mctx.fillRect(px - cell, py - cell, cell * 2, cell * 2);
      mctx.fillStyle = '#bfecff'; mctx.fillRect(Math.round(px - 3), Math.round(py - 3), 6, 6);
    } else {
      mctx.fillStyle = '#3a2a5a'; mctx.fillRect(Math.round(px - 4), Math.round(py - 5), 8, 10);
      mctx.fillStyle = '#e7cf86'; mctx.fillRect(Math.round(px - 3), Math.round(py - 6), 6, 3);
    }
  }

  function mazeMove(dr, dc) {
    if (!maze) return;
    const nr = maze.cur[0] + dr, nc = maze.cur[1] + dc;
    if (nr < 0 || nr >= maze.n || nc < 0 || nc >= maze.n) return;
    if (maze.g[nr][nc] === 1) { sfx('error'); return; }
    maze.cur = [nr, nc];
    maze.trail.add(nr + ',' + nc);   // water stroomt mee langs het pad
    sfx('step');
    drawMaze(performance.now());
    if (nr === maze.exit[0] && nc === maze.exit[1]) {
      const cfg = maze.hs.maze;
      state.flags[cfg.setFlag] = true;
      sfx('combine');
      setTimeout(() => { elMaze.hidden = true; maze = null; say(cfg.solvedText); updateQuest(); }, 600);
    }
  }

  function closeMaze() { elMaze.hidden = true; maze = null; }
  if (elMazeClose) elMazeClose.addEventListener('click', closeMaze);
  if (elMaze) elMaze.addEventListener('pointerdown', (e) => { if (e.target === elMaze) closeMaze(); });

  /* ---------- Radwerk-puzzel: SLEEP 5 radjes naar de juiste plek (op maat). Geen draaien. ---------- */
  const elGear       = document.getElementById('gear-screen');
  const elGearTitle  = document.getElementById('gear-title');
  const elGearHint   = document.getElementById('gear-hint');
  const elGearCanvas = document.getElementById('gear-canvas');
  const elGearClose  = document.getElementById('gear-close');
  const gctx = elGearCanvas ? elGearCanvas.getContext('2d') : null;
  let gears = null;
  const GEAR_RADII   = [23, 29, 35, 41, 47];   // grotere radjes
  const GEAR_IMGKEY  = ['cogBrass', 'cogIron', 'cogBrass', 'cogIron', 'cogBrass'];

  function openGears(hs) {
    if (!gctx) return;
    const cfg = hs.gears;
    const order = [2, 4, 0, 3, 1];          // benodigde maat per socket (vaste oplossing)
    const GW = elGearCanvas.width;          // 440
    const cy = 100, sockets = [];
    /* Plaats de radjes-rij eerst relatief, bepaal de breedte en centreer hem dan in het canvas. */
    const xs = []; let x = GEAR_RADII[order[0]];
    xs.push(x);
    for (let i = 1; i < order.length; i++) { x += GEAR_RADII[order[i - 1]] + GEAR_RADII[order[i]] - 7; xs.push(x); }
    const leftEdge = xs[0] - GEAR_RADII[order[0]];
    const rightEdge = xs[xs.length - 1] + GEAR_RADII[order[order.length - 1]];
    const off = (GW - (rightEdge - leftEdge)) / 2 - leftEdge;   // centreer-offset
    for (let i = 0; i < order.length; i++) {
      sockets.push({ x: Math.round(xs[i] + off), y: cy, r: GEAR_RADII[order[i]], need: order[i], has: null });
    }
    const trayOrder = [3, 1, 4, 0, 2];      // geschudde voorraad onderin
    const tray = trayOrder.map((sz, i) => {
      const hx = 48 + i * 87, hy = 224;     // ruimere tussenruimte voor de grotere radjes
      return { size: sz, r: GEAR_RADII[sz], img: GEAR_IMGKEY[sz], hx, hy, x: hx, y: hy, placedAt: null };
    });
    /* Eén rad ontbreekt tot je het molenrad gevonden hebt: het grootste rad (maat 4)
       is dan niet in de voorraad -> de puzzel is wél te zien maar niet op te lossen. */
    const missingWheel = cfg.needItem && !state.inventory.includes(cfg.needItem);
    if (missingWheel) {
      let big = -1, bigSz = -1;
      for (let i = 0; i < tray.length; i++) if (tray[i].size > bigSz) { bigSz = tray[i].size; big = i; }
      if (big >= 0) tray[big].missing = true;
    }
    gears = { hs, sockets, tray, drag: null, solved: false, spin: false, spinT: 0, jamT: 0 };
    elGearTitle.textContent = L(cfg.title || { nl: 'Het Radwerk', en: 'The Gearworks' });
    if (elGearHint) elGearHint.textContent = missingWheel
      ? L(cfg.needText || { nl: 'Eén rad ontbreekt — het grote molenrad. Dat moet je eerst vinden.', en: 'One gear is missing — the great mill wheel. Find it first.' })
      : L(cfg.hint || { nl: '', en: '' });
    elGear.hidden = false;
    drawGears(performance.now());
    sfx('tap');
  }

  function drawCog(cx, cy, r, imgKey, ang) {
    const img = art.sprites[imgKey];
    const d = Math.round(r * 2.25);
    if (ready(img)) {
      gctx.save(); gctx.imageSmoothingEnabled = false;
      gctx.translate(cx, cy); if (ang) gctx.rotate(ang);
      gctx.drawImage(img, Math.round(-d / 2), Math.round(-d / 2), d, d);
      gctx.restore();
    } else {                                  // terugval: simpele cirkel
      gctx.fillStyle = '#caa45a'; gctx.beginPath(); gctx.arc(cx, cy, r, 0, Math.PI * 2); gctx.fill();
      gctx.fillStyle = 'rgba(0,0,0,0.3)'; gctx.beginPath(); gctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2); gctx.fill();
    }
  }

  function drawGears(now) {
    if (!gears || !gctx) return;
    const W = elGearCanvas.width, H = elGearCanvas.height;
    gctx.fillStyle = '#221830'; gctx.fillRect(0, 0, W, H);
    /* aandrijving links, poort-mechaniek rechts + as-lijn langs de sockets */
    gctx.fillStyle = '#5a4a33'; gctx.fillRect(6, 64, 30, 56);
    gctx.fillStyle = '#6b5a40'; gctx.fillRect(2, 84, 10, 16);
    gctx.fillStyle = '#3a2f22'; gctx.fillRect(W - 30, 44, 26, 100);
    gctx.strokeStyle = 'rgba(231,207,134,0.22)'; gctx.lineWidth = 3;
    gctx.beginPath(); gctx.moveTo(36, 92);
    for (const s of gears.sockets) gctx.lineTo(s.x, s.y);
    gctx.lineTo(W - 28, 92); gctx.stroke();
    /* lege sockets als stippel-omtrek (toont de vereiste maat) */
    for (const s of gears.sockets) {
      if (s.has != null) continue;
      gctx.strokeStyle = 'rgba(231,207,134,0.6)'; gctx.lineWidth = 2; gctx.setLineDash([4, 4]);
      gctx.beginPath(); gctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); gctx.stroke(); gctx.setLineDash([]);
      gctx.fillStyle = 'rgba(231,207,134,0.5)'; gctx.beginPath(); gctx.arc(s.x, s.y, 2, 0, Math.PI * 2); gctx.fill();
    }
    /* het draaien als alles klopt (na de hendel): meshende radjes draaien om-en-om */
    const spinA = gears.spin ? (now - gears.spinT) / 620 : 0;
    /* even 'knarsen' (mislukte test): lichte trilling */
    const jam = (gears.jamT && now - gears.jamT < 420) ? Math.round(Math.sin(now / 35) * 2) : 0;
    /* geplaatste radjes */
    for (let k = 0; k < gears.sockets.length; k++) {
      const s = gears.sockets[k];
      if (s.has == null || (gears.drag && gears.drag.i === s.has)) continue;
      const g = gears.tray[s.has];
      if (gears.spin) {
        const gl = 16, rg = gctx.createRadialGradient(s.x, s.y, 2, s.x, s.y, g.r + gl);
        rg.addColorStop(0, 'rgba(231,207,134,0.5)'); rg.addColorStop(1, 'rgba(231,207,134,0)');
        gctx.fillStyle = rg; gctx.fillRect(s.x - g.r - gl, s.y - g.r - gl, (g.r + gl) * 2, (g.r + gl) * 2);
      }
      drawCog(s.x + jam, s.y, g.r, g.img, spinA * (k % 2 ? -1 : 1));
    }
    /* voorraad-radjes */
    for (let i = 0; i < gears.tray.length; i++) {
      const g = gears.tray[i];
      if (g.placedAt != null || g.missing || (gears.drag && gears.drag.i === i)) continue;
      drawCog(g.hx, g.hy, g.r, g.img, 0);
    }
    /* het gesleepte radje bovenop */
    if (gears.drag) { const g = gears.tray[gears.drag.i]; drawCog(g.x, g.y, g.r, g.img, 0); }
  }

  function allGearsCorrect() {
    return gears && gears.sockets.every((s) => s.has != null && gears.tray[s.has].size === s.need);
  }

  /* Hendel overhalen om te testen: klopt alles -> radjes draaien en de poort gaat open;
     anders knarst het mechaniek even (en blijft de puzzel open). */
  function testGears() {
    if (!gears || gears.spin) return;
    const filled = gears.tray.every((g) => g.placedAt != null);
    if (allGearsCorrect()) {
      gears.spin = true; gears.spinT = performance.now();
      sfx('combine');
      const hs = gears.hs;
      setTimeout(() => {
        elGear.hidden = true;
        const cfg = hs.gears;
        gears = null;
        if (cfg.needItem) removeItem(cfg.needItem);   // het molenrad is nu ingebouwd → uit de tas
        if (cfg.setFlag) { state.flags[cfg.setFlag] = true; updateQuest(); }
        if (cfg.solvedText) say(cfg.solvedText);
      }, 1800);
    } else {
      gears.jamT = performance.now();
      sfx('error');
      if (elGearHint) {
        const prev = elGearHint.textContent;
        elGearHint.textContent = filled
          ? 'Het knarst — niet elk radje zit op de juiste plek.'
          : 'Er ontbreken nog radjes — vul alle plekken.';
        setTimeout(() => { if (gears && elGearHint) elGearHint.textContent = prev; }, 1900);
      }
      drawGears(performance.now());
    }
  }

  function gearEvtPos(e) {
    const rect = elGearCanvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * (elGearCanvas.width / rect.width),
             y: (e.clientY - rect.top) * (elGearCanvas.height / rect.height) };
  }

  function gearDrop() {                        // laat het gesleepte radje los
    if (!gears || !gears.drag) return;
    const i = gears.drag.i, g = gears.tray[i];
    let si = -1, best = 1e9;
    for (let k = 0; k < gears.sockets.length; k++) {
      const s = gears.sockets[k];
      if (s.has != null) continue;
      const d = Math.hypot(g.x - s.x, g.y - s.y);
      if (d < best) { best = d; si = k; }
    }
    if (si >= 0 && best <= gears.sockets[si].r + 18) {
      g.placedAt = si; gears.sockets[si].has = i; g.x = gears.sockets[si].x; g.y = gears.sockets[si].y;
      sfx(g.size === gears.sockets[si].need ? 'pickup' : 'tap');
    } else {
      g.x = g.hx; g.y = g.hy; sfx('tap');     // terug naar de voorraad
    }
    gears.drag = null;
    if (gears) drawGears(performance.now());
  }

  if (elGearCanvas) {
    elGearCanvas.addEventListener('pointerdown', (e) => {
      if (!gears || elGear.hidden || gears.spin) return;
      e.preventDefault();
      const p = gearEvtPos(e);
      let pick = -1, best = 1e9;
      for (let i = 0; i < gears.tray.length; i++) {
        const g = gears.tray[i];
        if (g.missing) continue;                 // ontbrekend rad kun je niet oppakken
        const cx = g.placedAt != null ? gears.sockets[g.placedAt].x : g.hx;
        const cy = g.placedAt != null ? gears.sockets[g.placedAt].y : g.hy;
        const d = Math.hypot(p.x - cx, p.y - cy);
        if (d <= g.r + 6 && d < best) { best = d; pick = i; }
      }
      if (pick < 0) return;
      const g = gears.tray[pick];
      if (g.placedAt != null) { gears.sockets[g.placedAt].has = null; g.placedAt = null; }
      g.x = p.x; g.y = p.y;
      gears.drag = { i: pick };
      sfx('tap');
      if (elGearCanvas.setPointerCapture) { try { elGearCanvas.setPointerCapture(e.pointerId); } catch (_) {} }
      drawGears(performance.now());
    });
    elGearCanvas.addEventListener('pointermove', (e) => {
      if (!gears || !gears.drag) return;
      e.preventDefault();
      const p = gearEvtPos(e);
      const g = gears.tray[gears.drag.i];
      g.x = p.x; g.y = p.y;
      drawGears(performance.now());
    });
    elGearCanvas.addEventListener('pointerup', gearDrop);
    elGearCanvas.addEventListener('pointercancel', gearDrop);
  }

  const elGearLever = document.getElementById('gear-lever');
  if (elGearLever) elGearLever.addEventListener('click', () => { if (gears) testGears(); });

  function closeGears() { elGear.hidden = true; gears = null; }
  if (elGearClose) elGearClose.addEventListener('click', closeGears);
  if (elGear) elGear.addEventListener('pointerdown', (e) => { if (e.target === elGear) closeGears(); });

  /* Test-hook: leg alle radjes goed en haal de hendel over (voor geautomatiseerde verificatie). */
  function gearAuto() {
    if (!gears) return false;
    for (const s of gears.sockets) {
      if (s.has != null) continue;
      const ti = gears.tray.findIndex((g) => g.placedAt == null && g.size === s.need);
      if (ti >= 0) { const idx = gears.sockets.indexOf(s); gears.tray[ti].placedAt = idx; gears.tray[ti].x = s.x; gears.tray[ti].y = s.y; s.has = ti; }
    }
    drawGears(performance.now());
    testGears();
    return true;
  }

  const MAZE_DIRS = { 'maze-up': [-1, 0], 'maze-down': [1, 0], 'maze-left': [0, -1], 'maze-right': [0, 1] };
  for (const id in MAZE_DIRS) {
    const b = document.getElementById(id);
    if (!b) continue;
    const d = MAZE_DIRS[id];
    b.addEventListener('touchend', (e) => { e.preventDefault(); mazeMove(d[0], d[1]); }, { passive: false });
    b.addEventListener('click', () => mazeMove(d[0], d[1]));
  }
  window.addEventListener('keydown', (e) => {
    if (!elMaze || elMaze.hidden) return;
    const m = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
    if (m) { e.preventDefault(); mazeMove(m[0], m[1]); }
  });

  /* ---------- Vonken-burst (kist/poort die opengaat) ---------- */
  const sparks = [];
  function burstAt(x, y, opts) {
    opts = opts || {};
    const n = opts.n || 26;
    const col = opts.col || '231,207,134';
    const spMin = opts.spMin != null ? opts.spMin : 18;
    const spRange = opts.spRange != null ? opts.spRange : 42;
    const grav = opts.grav != null ? opts.grav : 0;
    const up = opts.up != null ? opts.up : 12;
    const lifeBase = opts.life || 0.8;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = spMin + Math.random() * spRange;
      sparks.push({
        x: x + (Math.random() * 6 - 3), y: y + (Math.random() * 6 - 3),
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - up,
        life: lifeBase + Math.random() * 0.5, max: lifeBase + 0.5,
        col, grav, size: opts.size || 2
      });
    }
  }
  /* De staf van Finn gloeit op wanneer hij de dans-spreuk uitspreekt. */
  function triggerCastFx() {
    castGlow = { t0: performance.now() };
    burstAt(player.x, player.y - 24, { n: 16, col: '160,195,255', up: 16, life: 1.0 });
    burstAt(player.x, player.y - 24, { n: 9, col: '255,232,150', up: 13, life: 1.1 });
  }

  /* hartjes/lik-spetters bij het hondje */
  function lickAt(x, y) {
    burstAt(x, y, { n: 14, col: '205,235,255', spMin: 10, spRange: 26, grav: 70, up: 22, life: 0.6, size: 2 });
    for (let i = 0; i < 4; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
      const sp = 14 + Math.random() * 16;
      sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.9, max: 0.9, col: '236,120,150', grav: 8, size: 3, heart: true });
    }
  }

  let lastPet = 0;
  function petDog() {
    const now = performance.now();
    if (now - lastPet < 2000) return;
    lastPet = now;
    sfx('bark');
    lickAt(follower.x, follower.y - 18);
    const msgs = [
      { nl: 'Woef! Het hondje springt blij op en likt je hand!', en: 'Woof! The puppy jumps up happily and licks your hand!' },
      { nl: 'Het hondje draait van blijdschap rond in kringetjes!', en: 'The puppy spins in circles with delight!' },
      { nl: 'Woef woef! De kleine staart gaat als een windmolen.', en: 'Woof woof! The little tail wags like a windmill.' }
    ];
    say(msgs[(Math.random() * msgs.length) | 0], null, 'assets/art/face-dog.png');
  }

  function interactNow(hs) {
    const sel = state.selectedItem;

    /* Aaien: hondje met vest dat je volgt */
    if (!sel && hs.followNpc === 'dog' && follower.active && !follower.scared) {
      petDog();
      return;
    }

    if (sel) {
      state.selectedItem = null;
      renderInventory();
      const action = hs.use && hs.use[sel];
      if (action) {
        if (action.needItem && !state.inventory.includes(action.needItem)) {
          sfx('error');
          say(action.needText || GAME.strings.noEffect, hsSpeaker(hs), hsFace(hs));
        } else if (action.requiresFlag && !state.flags[action.requiresFlag]) {
          sfx('error');
          say(action.requiresText || GAME.strings.noEffect, hsSpeaker(hs), hsFace(hs));
        } else {
          runAction(action, hsSpeaker(hs), hsFace(hs));
          /* Meer-ingrediënten-combo (de ketel): zodra alle nodige vlaggen gezet zijn,
             ontsteekt de ketel en wisselt de achtergrond naar de magische vallei. */
          const cb = hs.combo;
          if (cb && !state.flags[cb.setFlag] && cb.needFlags.every((f) => state.flags[f])) {
            state.flags[cb.setFlag] = true;
            paintBackground();
            if (cb.burst) burstAt(cb.burst.x, cb.burst.y, { n: 24, col: '120,180,255', up: 18, life: 1.2 });
            sfx('combine');
            if (cb.text) say(cb.text, hsSpeaker(hs), hsFace(hs));
            updateQuest();
            if (cb.win) { pendingWin = true; sfx('win'); }
            if (cb.startDuel) startDuel();
          }
        }
      } else {
        sfx('error');
        const it = GAME.items[sel];
        say((it && it.noUseText) || GAME.strings.noEffect);
      }
      return;
    }

    if (hs.choice && !(hs.choice.doneFlag && state.flags[hs.choice.doneFlag]) && !(hs.choice.skipFlag && state.flags[hs.choice.skipFlag])) {
      if (hs.setFlag) state.flags[hs.setFlag] = true;
      if (hs.choice.doneFlag) state.flags[hs.choice.doneFlag] = true;   // keuze maar één keer (bv. de heks bij de eerste ontmoeting)
      showChoice(hs.choice, hsSpeaker(hs), hsFace(hs));
      return;
    }
    if (hs.zoomImg) {
      if (hs.setFlag && !state.flags[hs.setFlag]) { state.flags[hs.setFlag] = true; updateQuest(); }   // bv. het hint-boek inkijken zet readMillBook
      openZoom(typeof hs.zoomImg === 'function' ? hs.zoomImg(state) : hs.zoomImg);
      return;
    }
    if (hs.chess) {
      if (state.flags[hs.chess.setFlag]) { say(hs.chess.doneText || lookText(hs), hsSpeaker(hs)); return; }
      openChess(hs);
      return;
    }
    if (hs.tile && hs.puzzleKey) {
      openTilePopup();
      return;
    }
    if (hs.puzzleKey) {
      puzzleTap(hs);
      return;
    }
    if (hs.slidePuzzle) {
      if (state.flags[hs.slidePuzzle.setFlag]) say(lookText(hs), hsSpeaker(hs));
      else openSlidePuzzle(hs);
      return;
    }
    if (hs.jigsaw) {
      const need = hs.jigsaw.requiresFlag;
      const unmet = need && (Array.isArray(need) ? need.some((f) => !state.flags[f]) : !state.flags[need]);
      if (state.flags[hs.jigsaw.setFlag]) { say(lookText(hs), hsSpeaker(hs)); return; }
      if (unmet) {
        sfx('error');
        const bt = typeof hs.blockedText === 'function' ? hs.blockedText(state) : hs.blockedText;
        say(bt || lookText(hs), hsSpeaker(hs));
        return;
      }
      openJigsaw(hs);
      return;
    }
    if (hs.exit) {
      const need = hs.requiresFlag;
      const unmet = need && (Array.isArray(need) ? need.some((f) => !state.flags[f]) : !state.flags[need]);
      if (unmet) {
        sfx('error');
        const bt = typeof hs.blockedText === 'function' ? hs.blockedText(state) : hs.blockedText;
        say(bt || GAME.strings.noEffect);
        return;
      }
      travelTo(hs.exit.to, hs.exit.travelText);
      return;
    }
    if (hs.sendNpcTo && npcRt[hs.sendNpcTo.npc] &&
        (!hs.sendRequiresFlag || state.flags[hs.sendRequiresFlag])) {
      const rt = npcRt[hs.sendNpcTo.npc];
      rt.target = { x: hs.sendNpcTo.x, y: hs.sendNpcTo.y };
      rt.pauseUntil = performance.now() + 6000;
      sfx('bark');
      say(lookText(hs), hsSpeaker(hs));
      return;
    }
    if (hs.riddle && !state.flags[hs.riddle.setFlag] &&
        (!hs.riddle.requiresFlag || state.flags[hs.riddle.requiresFlag])) {
      openRiddle(hs);
      return;
    }
    if (hs.maze && !state.flags[hs.maze.setFlag] &&
        (!hs.maze.requiresFlag || state.flags[hs.maze.requiresFlag])) {
      openMaze(hs);
      return;
    }
    if (hs.gears && !state.flags[hs.gears.setFlag]) {
      if (!hs.gears.requiresFlag || state.flags[hs.gears.requiresFlag]) {
        openGears(hs);   // opent altijd; zonder molenrad mist één rad (zie openGears)
        return;
      }
    }
    if (hs.bookPuzzle) {
      if (hs.bookPuzzle.requiresFlag && !state.flags[hs.bookPuzzle.requiresFlag]) {
        sfx('error');
        say(hs.bookPuzzle.blockedText || lookText(hs), hsSpeaker(hs));
        return;
      }
      openBookPuzzle(hs);
      return;
    }
    /* Spreuk uitspreken: heb je het juiste voorwerp in je tas, dan werkt het meteen
       (zonder selecteren) — zo kan het toverboek óók een leesbare afbeelding (zoomImg) hebben. */
    if (hs.castWith) {
      const c = hs.castWith;
      const fls = Array.isArray(c.setFlag) ? c.setFlag : [c.setFlag];
      if (fls.some((f) => state.flags[f])) { say(lookText(hs), hsSpeaker(hs), hsFace(hs)); return; }
      if (!state.inventory.includes(c.item)) { sfx('error'); say(c.needText || lookText(hs), hsSpeaker(hs), hsFace(hs)); return; }
      if (c.requiresFlag && !state.flags[c.requiresFlag]) { sfx('error'); say(c.emptyText || c.needText || lookText(hs), hsSpeaker(hs), hsFace(hs)); return; }
      fls.forEach((f) => { state.flags[f] = true; });
      sfx('combine');
      if (c.setFlag && (Array.isArray(c.setFlag) ? c.setFlag : [c.setFlag]).includes('flowerDancing')) triggerCastFx();
      updateQuest();
      say(c.text, hsSpeaker(hs), hsFace(hs));
      return;
    }

    /* gevaarlijk wezen blijven porren = einde verhaal */
    if (hs.danger && !state.flags[hs.dangerUntil || 'minotaurAsleep']) {
      const pokes = (state.flags['pokes_' + hs.id] || 0) + 1;
      state.flags['pokes_' + hs.id] = pokes;
      if (pokes >= (hs.dangerPokes || 4)) { die(hs.deathText); return; }
      if (pokes >= 2 && hs.angerTexts) {
        sfx('growl');
        say(hs.angerTexts[Math.min(pokes - 2, hs.angerTexts.length - 1)], hsSpeaker(hs), hsFace(hs));
        return;
      }
      /* eerste keer: gewone beschrijving */
    }

    /* Voorwerp dat een NPC pas geeft zodra een vlag gezet is (bv. de burgemeester
       overhandigt de geheime kaart zodra de molen weer draait). Eenmalig. */
    if (hs.givesWhen && state.flags[hs.givesWhen.flag] && !state.flags[hs.givesWhen.setFlag]) {
      const g = hs.givesWhen;
      if (g.needFlag && !state.flags[g.needFlag]) {     // tweede voorwaarde (bv. eerst een vlag)
        sfx('error'); say(g.needText || lookText(hs), hsSpeaker(hs), hsFace(hs)); return;
      }
      if (g.needItem && !state.inventory.includes(g.needItem)) {   // bv. eerst een leeg flesje voor de traan
        sfx('error'); say(g.needText || lookText(hs), hsSpeaker(hs), hsFace(hs)); return;
      }
      state.flags[g.setFlag] = true;
      if (g.consume) removeItem(g.consume);             // bv. het lege flesje wordt gevuld met de traan
      if (g.item) addItem(g.item);
      if (g.flyNpc) {                                   // de raaf vliegt weg (bv. nadat hij het recept aanwees)
        const rt = npcRt[g.flyNpc];
        if (rt) ravenFly = { x: rt.x, y: rt.y - 8, t: performance.now(), dir: g.flyDir || 'left' };
      }
      sfx('pickup');
      say(g.giveText, hsSpeaker(hs), hsFace(hs));
      if (g.win) { pendingWin = true; sfx('win'); }
      updateQuest();
      return;
    }

    if (hs.gives) {
      const repeat = hs.gives.repeat;            // herbruikbaar (bv. graan scheppen)
      if (repeat) {
        if (state.inventory.includes(hs.gives.item)) { say(hs.gives.haveText || hs.gives.emptyText || lookText(hs)); return; }
      } else if (state.flags[takenFlag(hs)]) {
        say(hs.gives.emptyText || lookText(hs));
        return;
      }
      if (hs.blockedBy) {
        for (const b of hs.blockedBy) {
          if (!state.flags[b.flag]) {
            sfx('error');
            say(b.text);
            return;
          }
        }
      }
      if (hs.requiresFlag && !state.flags[hs.requiresFlag]) {
        sfx('error');
        say(hs.blockedText || GAME.strings.noEffect);
        return;
      }
      if (!repeat) state.flags[takenFlag(hs)] = true;
      if (hs.gives.setFlag) {
        state.flags[hs.gives.setFlag] = true;           // bv. flesjes pakken zet 'gotVials', brief pakken zet 'poemRead'
        const sc = GAME.scenes[state.currentScene];     // wissel evt. de achtergrond (bv. brievenbus-vlag weer omlaag)
        if (sc && sc.bgVariants && sc.bgVariants.some((v) => v.flag === hs.gives.setFlag || v.notFlag === hs.gives.setFlag)) paintBackground();
      }
      if (hs.gives.item) addItem(hs.gives.item);   // mag ook leeg zijn (bv. het recept gaat rechtstreeks in je boek, niet in je tas)
      if (hs.gives.also) (Array.isArray(hs.gives.also) ? hs.gives.also : [hs.gives.also]).forEach(addItem);   // extra voorwerpen (bv. 3 flesjes tegelijk)
      sfx('pickup');
      say(hs.gives.giveText);
      /* Een NPC kan wegvliegen zodra dit voorwerp gepakt is (bv. de raaf op de
         kar die wegvliegt naar de vallei zodra je het molenrad pakt). */
      if (hs.gives.flyNpc) {
        const rt = npcRt[hs.gives.flyNpc];
        if (rt) ravenFly = { x: rt.x, y: rt.y - 8, t: performance.now(), dir: hs.gives.flyDir || 'left' };
      }
      if (hs.gives.win) { pendingWin = true; sfx('win'); }
      return;
    }
    /* Een puur 'look'-hotspot mag ook een flag zetten (bv. iets onderzocht hebben).
       Bepaal de tekst VÓÓR het zetten van de vlag: zo kan een look(state)-functie
       de eerste-keer-tekst tonen en pas daarna naar de "al gezien"-variant schakelen. */
    const lt = lookText(hs);
    if (hs.setFlag && !state.flags[hs.setFlag]) {
      state.flags[hs.setFlag] = true; updateQuest();
      /* wissel de achtergrond als deze vlag een bg-variant aanstuurt (bv. brief uit de
         brievenbus pakken → vlag omlaag → terug naar de gewone molen-achtergrond). */
      const sc = GAME.scenes[state.currentScene];
      if (sc && sc.bgVariants && sc.bgVariants.some((v) => v.flag === hs.setFlag || v.notFlag === hs.setFlag)) paintBackground();
    }
    say(lt, hsSpeaker(hs), hsFace(hs));
    if (hs.win) { pendingWin = true; sfx('win'); }
  }

  function runAction(a, anchor, face) {
    if (a.consume) (Array.isArray(a.consume) ? a.consume : [a.consume]).forEach(removeItem);
    if (a.give) addItem(a.give);
    if (a.also) (Array.isArray(a.also) ? a.also : [a.also]).forEach(addItem);   // bv. de wijn geeft tegelijk de munt én de kaart
    if (a.burst) burstAt(a.burst.x, a.burst.y, { n: 18, col: '120,180,255', up: 16, life: 1.1 });   // blauwe lichtjes (bv. iets in de ketel gooien)
    if (a.setFlag) {
      (Array.isArray(a.setFlag) ? a.setFlag : [a.setFlag]).forEach((fl) => { state.flags[fl] = true; });
      updateQuest();
      const sc = GAME.scenes[state.currentScene];
      const setList = Array.isArray(a.setFlag) ? a.setFlag : [a.setFlag];
      if (sc && sc.bgVariants && sc.bgVariants.some((v) => setList.includes(v.flag) || setList.includes(v.notFlag))) {
        paintBackground();
      }
    }
    if (a.win) { pendingWin = true; sfx('win'); }
    if (a.setFlag === 'runesRevealed') { paintBackground(); burstAt(170, 100, { n: 10, col: '255,232,150', up: 14 }); }
    if (a.setFlag === 'dogWarm') {
      const d = npcRt.dog || follower;
      lickAt((d.x || player.x), (d.y || player.y) - 18);
      follower.active = true;
      follower.x = (npcRt.dog ? npcRt.dog.x : player.x);
      follower.y = (npcRt.dog ? npcRt.dog.y : player.y);
    }
    if (a.setFlag === 'ravenFed') {
      /* De raaf pakt het glinsterende muntje en vliegt weg richting de molen. */
      sfx('use');
      const sc = GAME.scenes[state.currentScene];
      const r = (sc.npcs || []).find((n) => n.id === 'raven');
      const rx = r ? r.x : player.x, ry = r ? r.y - 16 : player.y - 40;
      ravenFly = { x: rx, y: ry, t: performance.now() };
      burstAt(rx, ry, { n: 8, col: '231,207,134', up: 10, life: 0.8 });   // glinster bij het opvliegen
    }
    if (a.setFlag === 'minotaurAsleep') {
      sfx('sleep');
      /* sparkle-effect in het water van de schaal zodra de drank erin gaat */
      const wg = (GAME.scenes.temple.fx || {}).waterGlint || { x: 88, y: 248 };
      burstAt(wg.x, wg.y, { n: 20, col: '150,210,255', up: 14, life: 1.0 });
      burstAt(wg.x, wg.y, { n: 10, col: '255,242,180', up: 12, life: 1.1 });
      /* minotaur sjokt naar de schaal en valt daar in slaap */
      minoWalk = { arrived: false, tx: 168, ty: 258 };
    }
    else if (a.give) sfx('pickup');
    else if (a.consume) sfx('use');
    if (a.text) say(a.text, anchor, face);
  }

  /* ---------- Dood & herkansing ---------- */
  function die(customText) {
    sfx('death');
    msgQueue = [];
    pendingWin = false;
    elMsg.hidden = true;
    elBubble.hidden = true;
    elDeathText.textContent = customText ? L(customText) : L(GAME.ui.deathText);
    elDeath.hidden = false;
  }

  elRetryBtn.addEventListener('click', () => {
    elDeath.hidden = true;
    Object.keys(state.flags).forEach((k) => { if (k.indexOf('pokes_') === 0) state.flags[k] = 0; });
    const scene = GAME.scenes[state.currentScene];
    player.x = scene.playerStart.x;
    player.y = scene.playerStart.y;
    player.target = null; player.pending = null;
    fade.mode = 'in';
    fade.t0 = performance.now();
    sfx('tap');
  });

  function travelTo(sceneId, travelText) {
    if (travelText) say(travelText);
    sfx('travel');
    fade.mode = 'out';
    fade.t0 = performance.now();
    setTimeout(() => {
      const fromScene = state.currentScene;
      state.currentScene = sceneId;
      state.selectedItem = null;
      const scene = GAME.scenes[sceneId];
      /* "Weggaan en terugkomen": de burgemeester maakt plaats voor de oude schaker — maar
         pas nadat hij de kaart heeft gegeven én de wijn heeft gekregen, en pas zodra je
         het plein opnieuw binnenkomt (dus niet terwijl je er nog staat). */
      if (sceneId === 'square' && state.flags.gotMap && state.flags.gotMayorCoin) {
        state.flags.mayorGone = true;
      }
      const spawn = (scene.spawnFrom && scene.spawnFrom[fromScene]) || scene.playerStart;
      player.x = spawn.x; player.y = spawn.y;
      player.target = null; player.pending = null;
      player.flip = spawn.x >= SCENE_W / 2;
      if (follower.active) {
        const fp = clampToWalkable(spawn.x + (spawn.x >= SCENE_W / 2 ? 22 : -22), spawn.y);
        follower.x = fp.x; follower.y = fp.y; follower.scared = false;
      }
      exitArm = {};
      initNpcs();
      initFireflies((scene.fx && scene.fx.fireflies) || 0);
      embers.length = 0;
      paintBackground();
      renderInventory();
      fade.mode = 'in';
      fade.t0 = performance.now();
      const visited = 'visited_' + sceneId;
      if (!state.flags[visited]) {
        state.flags[visited] = true;
        say(scene.entryText);
      }
      updateQuest();
    }, fade.dur);
  }

  /* ---------- Lopen & tikken ---------- */
  function walkThenInteract(hs) {
    showLabel(L(hs.name));
    const wt = hsWalkTo(hs);
    /* Te donker om er heen te lopen? Loop tot de rand en weiger verder te gaan. */
    if (darkBlocked(wt.x, wt.y)) {
      const dest = clampToWalkable(wt.x, wt.y);
      marker = { x: dest.x, y: dest.y, until: performance.now() + 700 };
      player.pending = null;
      player.target = dest;
      showToast(L(GAME.scenes[state.currentScene].darkWalkText));
      return;
    }
    const dist = Math.hypot(player.x - wt.x, player.y - wt.y);
    if (dist <= ARRIVE_DIST + 2) { interactNow(hs); return; }
    player.pending = hs;
    player.target = { x: wt.x, y: wt.y };
  }

  function hotspotAt(sx, sy) {
    const scene = GAME.scenes[state.currentScene];
    let best = null, bestArea = Infinity;
    for (const hs of scene.hotspots) {
      if (!flagVisible(hs)) continue;
      const r = hsRect(hs);
      if (sx >= r.x && sx <= r.x + r.w && sy >= r.y && sy <= r.y + r.h) {
        const area = r.w * r.h;
        if (area < bestArea) { best = hs; bestArea = area; }
      }
    }
    return best;
  }

  function screenToScene(px_, py_) {
    return { x: (px_ - view.ox) / view.scale, y: (py_ - view.oy) / view.scale };
  }

  /* ---------- De tovenaars-strijd bij de ketel (raadsels → juiste gloeiende steen) ---------- */
  let duel = null;
  let duelFlash = null;     // flits op de juiste steen bij een goed antwoord
  function startDuel() {
    const sc = GAME.scenes[state.currentScene];
    if (!sc || !sc.duel) return;
    /* Schud de vragen elke keer in een andere volgorde — maar houd de DRAAK altijd als laatste. */
    const rounds = sc.duel.rounds.slice();
    const di = rounds.findIndex((r) => r.sym === '🐉');
    const dragon = di >= 0 ? rounds.splice(di, 1)[0] : null;
    for (let i = rounds.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = rounds[i]; rounds[i] = rounds[j]; rounds[j] = t; }
    if (dragon) rounds.push(dragon);
    duel = { cfg: sc.duel, round: 0, rounds: rounds };
    state.flags.duelActive = true;
    window.__duelStart = performance.now();
    say(sc.duel.intro, null, 'assets/art/face-witch.png');
    sayRiddle();
    updateQuest();
  }
  function sayRiddle() {
    if (!duel) return;
    const r = duel.rounds[duel.round];
    if (r) say(r.riddle);
  }
  function tryDuelStone(sx, sy) {
    if (!duel) return false;
    let hit = null, best = 1e9;
    for (const st of duel.cfg.stones) {
      const signYv = st.signY != null ? st.signY : st.y;
      const d = Math.min(Math.hypot(st.x - sx, st.y - sy), Math.hypot(st.x - sx, signYv - sy));   // klik op de steen óf op het zwevende teken telt
      if (d < 56 && d < best) { best = d; hit = st; }
    }
    if (!hit) return false;
    const want = duel.rounds[duel.round].sym;
    if (hit.sym === want) {
      sfx('pickup'); sfx('combine');
      /* Goed antwoord: lichtbundel + ring-flits op de steen + flinke blauwe vonkenfontein. */
      duelFlash = { x: hit.x, y: hit.y, sy: (hit.signY != null ? hit.signY : hit.y - 24), t0: performance.now() };
      burstAt(hit.x, hit.y - 16, { n: 26, col: '130,195,255', up: 24, life: 1.3 });
      burstAt(hit.x, duelFlash.sy, { n: 14, col: '190,230,255', up: 14, life: 1.0 });
      duel.round++;
      if (duel.round >= duel.rounds.length) winDuel();
      else { sayRiddle(); }
    } else {
      sfx('error');
      burstAt(hit.x, hit.y - 18, { n: 8, col: '150,230,120', up: 10, life: 0.7 });
      say(duel.cfg.wrongText, null, 'assets/art/face-witch.png');
    }
    return true;
  }
  function winDuel() {
    if (!duel) return;
    const cfg = duel.cfg; duel = null;
    state.flags.duelActive = false;
    if (cfg.setFlag) (Array.isArray(cfg.setFlag) ? cfg.setFlag : [cfg.setFlag]).forEach((f) => { state.flags[f] = true; });
    if (cfg.give) addItem(cfg.give);
    /* De heks lost op in een wolk groene rook op haar eigen plek. */
    const wsc = GAME.scenes[state.currentScene];
    const wn = wsc && (wsc.npcs || []).find((n) => n.id === 'witch');
    witchPoof = { t0: performance.now(), x: wn ? wn.x : 198, y: wn ? wn.y - 34 : 196 };
    witchFrog = { t0: performance.now(), x: witchPoof.x, y: witchPoof.y, dir: witchPoof.x < SCENE_W / 2 ? 1 : -1 };   // uit de rook fladdert een kikker met hoedje weg
    sfx('win');
    say(cfg.winText);
    if (cfg.win) pendingWin = true;
    updateQuest();
    paintBackground();   // achtergrond wisselt naar de rustige vallei (witchDefeated)
  }

  function drawWitchPoof(now) {
    if (!witchPoof) return;
    const el = (now - witchPoof.t0) / 1700;
    if (el >= 1) { witchPoof = null; return; }
    const a = 1 - el;
    if (el < 0.22) {                                   // korte groene flits bij het oplossen
      fctx.fillStyle = 'rgba(150,255,150,' + (0.42 * (1 - el / 0.22)).toFixed(2) + ')';
      fctx.beginPath(); fctx.arc(witchPoof.x, witchPoof.y, 24, 0, Math.PI * 2); fctx.fill();
    }
    for (let i = 0; i < 14; i++) {                     // opstijgende groen-grijze rookwolkjes
      const ang = i * 0.9;
      const px = witchPoof.x + Math.cos(ang) * (6 + el * 22) + Math.sin(now / 200 + i) * 3;
      const py = witchPoof.y - el * 48 + Math.sin(ang) * 6 - (i % 3) * 4;
      const r = 4 + el * 11 + (i % 3) * 2;
      const al = a * (0.5 - (i % 4) * 0.06);
      if (al <= 0.02) continue;
      fctx.fillStyle = (i % 2) ? 'rgba(120,150,110,' + al.toFixed(2) + ')' : 'rgba(150,160,150,' + al.toFixed(2) + ')';
      fctx.beginPath(); fctx.arc(px, py, r, 0, Math.PI * 2); fctx.fill();
    }
  }

  /* Uit de groene rook springt een kleine vliegende kikker (met het puntige heksenhoedje nog op)
     die klapwiekend de lucht in fladdert en het scherm uit verdwijnt — de heks is in een kikker
     veranderd en vlucht. */
  function drawWitchFrog(now) {
    if (!witchFrog) return;
    const el = (now - witchFrog.t0) / 2600;
    if (el >= 1) { witchFrog = null; return; }
    if (el < 0.14) return;                                  // wacht tot de rook is opgekomen
    const img = art.sprites.frogWitch;
    if (!ready(img)) return;
    const p = (el - 0.14) / 0.86;                           // 0..1 vluchtfase
    const dir = witchFrog.dir;
    const x = witchFrog.x + dir * p * (SCENE_W * 0.62);     // boog naar de zijkant
    const y = witchFrog.y - 6 - p * 138 + Math.sin(p * Math.PI * 5) * 6;   // stijgt op + dobbert spartelend
    const a = p > 0.84 ? Math.max(0, 1 - (p - 0.84) / 0.16) : 1;           // vervaagt vlak voor het einde
    const W = 46, h = W * img.naturalHeight / img.naturalWidth;            // echte kikker-sprite, klein in beeld
    const wob = Math.sin(now / 90) * 0.16 + Math.sin(p * Math.PI * 4) * 0.06;   // spartelende kanteling (alsof hij worstelt om te vliegen)
    const sq = 1 + Math.sin(now / 90) * 0.05;               // lichte op-en-neer 'sprong'
    fctx.save();
    fctx.globalAlpha = a;
    fctx.translate(Math.round(x), Math.round(y));
    fctx.scale(dir, sq);                                    // spiegelt mee met de vliegrichting
    fctx.rotate(wob);
    fctx.drawImage(img, Math.round(-W / 2), Math.round(-h / 2), W, h);
    fctx.restore();
  }

  /* Flits bij een goed antwoord in het gevecht: een lichtbundel van de steen omhoog naar
     het teken + een expanderende blauwe ring. */
  function drawDuelFlash(now) {
    if (!duelFlash) return;
    const el = (now - duelFlash.t0) / 650;
    if (el >= 1) { duelFlash = null; return; }
    const a = 1 - el;
    const x = duelFlash.x, topY = duelFlash.sy - 8, botY = duelFlash.y + 6;
    const bw = 5 + el * 6;
    const grad = fctx.createLinearGradient(x, botY, x, topY - 16);
    grad.addColorStop(0, 'rgba(150,210,255,0)');
    grad.addColorStop(0.5, 'rgba(180,225,255,' + (0.75 * a).toFixed(2) + ')');
    grad.addColorStop(1, 'rgba(210,240,255,0)');
    fctx.fillStyle = grad;
    fctx.fillRect(Math.round(x - bw / 2), topY - 16, Math.round(bw), botY - topY + 22);
    fctx.strokeStyle = 'rgba(180,228,255,' + a.toFixed(2) + ')';
    fctx.lineWidth = 2;
    fctx.beginPath(); fctx.arc(x, duelFlash.sy, 6 + el * 30, 0, Math.PI * 2); fctx.stroke();
  }

  /* Fijnere blauwe vlam (een 'fakkel'): veel kleine, fijne vonkjes (geen grove blokken) met
     een witblauwe kern en een zachte basisgloed. */
  function drawBlueFlame(x, y, now, h) {
    const N = 18;
    for (let i = 0; i < N; i++) {
      const t = ((now / 640) + i / N + x * 0.011) % 1;
      const fy = y - t * h;
      const fx = x + Math.sin(t * 5.5 + i * 1.7 + x) * (1.1 + t * (2.4 + h / 22));
      const r = (1 - t) * (0.8 + (i % 3) * 0.8);                 // kleine, fijne vonkjes
      const a = Math.sin(t * Math.PI) * 0.8;
      if (a <= 0.04) continue;
      const col = (i % 4 === 0) ? '215,240,255' : (t < 0.4 ? '120,190,255' : '80,150,255');   // kern witblauw, top dieper blauw
      fctx.fillStyle = 'rgba(' + col + ',' + a.toFixed(2) + ')';
      const s = Math.max(1, Math.round(r * 1.6));
      fctx.fillRect(Math.round(fx - s / 2), Math.round(fy - s / 2), s, s);
    }
    fctx.fillStyle = 'rgba(120,185,255,0.16)'; fctx.fillRect(x - 7, y - 3, 14, 7);
    fctx.fillStyle = 'rgba(180,220,255,0.24)'; fctx.fillRect(x - 4, y - 2, 8, 5);
  }

  function drawDuel(now) {
    if (!duel) return;
    /* Blauw vuur uit de 4 fakkels (voorste 2 lager + groter) + de ketel (iets hoger). */
    const fires = duel.cfg.fires || duel.cfg.stones.map((s) => ({ x: s.x, y: s.y, h: 26 }));
    for (const f of fires) drawBlueFlame(f.x, f.y, now, f.h || 26);
    if (duel.cfg.cauldron) drawBlueFlame(duel.cfg.cauldron.x, duel.cfg.cauldron.y, now, duel.cfg.cauldron.h || 40);
    /* Dier-rune-tekens die boven elke steen zweven: kleiner, met een blauwe gloed en doorschijnend. */
    fctx.save();
    for (const st of duel.cfg.stones) {
      const pulse = 0.5 + 0.5 * Math.sin(now / 380 + st.x);
      const cy = (st.signY != null ? st.signY : st.y - 24) + Math.sin(now / 520 + st.x) * 2;
      const img = art.sprites[st.rune];
      const gr = 22;
      const g = fctx.createRadialGradient(st.x, cy, 1, st.x, cy, gr);   // blauwe gloed achter het teken
      g.addColorStop(0, 'rgba(120,195,255,' + (0.26 + 0.16 * pulse).toFixed(2) + ')');
      g.addColorStop(1, 'rgba(120,195,255,0)');
      fctx.fillStyle = g; fctx.fillRect(st.x - gr, cy - gr, gr * 2, gr * 2);
      if (ready(img)) {
        const rw = 28, rh = rw * img.naturalHeight / img.naturalWidth;   // iets kleiner
        fctx.globalAlpha = 0.58 + 0.20 * pulse;                          // doorschijnend
        fctx.drawImage(img, Math.round(st.x - rw / 2), Math.round(cy - rh / 2), rw, rh);
        fctx.globalAlpha = 1;
      } else {
        fctx.textAlign = 'center'; fctx.textBaseline = 'middle'; fctx.font = '16px serif';
        fctx.fillStyle = 'rgba(210,235,255,' + (0.70 + 0.20 * pulse).toFixed(2) + ')';
        fctx.fillText(st.sym, st.x, cy);
      }
    }
    fctx.restore();
  }

  let lastTapHs = null, lastTapTime = 0;   // voor dubbel-tik op uitgangen
  canvas.addEventListener('pointerdown', (e) => {
    ac();
    if (!started || fade.mode === 'out' || !elDeath.hidden || revive) return;
    if (msgOpen()) { showNextMsg(); return; }
    const p = screenToScene(e.clientX, e.clientY);
    if (p.x < 0 || p.x > SCENE_W || p.y < 0 || p.y > SCENE_H) return;

    /* Tijdens de stenen-strijd: alleen de gloeiende stenen reageren; een misser herhaalt het raadsel. */
    if (state.flags.duelActive && duel) { if (!tryDuelStone(p.x, p.y)) sayRiddle(); return; }

    const hs = hotspotAt(p.x, p.y);

    /* Vloer-tegels vóór het altaar: open de tegel-popup (juiste volgorde indrukken) */
    if (hs && hs.tile && hs.puzzleKey) { openTilePopup(); return; }

    /* Mobiel: runenstenen openen meteen een popup (geen lopen vereist) */
    if (hs && hs.puzzleKey && window.matchMedia('(pointer: coarse)').matches) {
      openRunePopup();
      return;
    }

    /* Aaien: klik op het volgende hondje in scenes zonder dog-hotspot */
    if (!hs && follower.active && !follower.scared) {
      const fw = 24, fh = 42;
      if (p.x >= follower.x - fw && p.x <= follower.x + fw &&
          p.y >= follower.y - fh && p.y <= follower.y + 6) {
        petDog();
        return;
      }
    }

    if (hs) {
      /* Dubbel-tik op een (bruikbare) uitgang-pijl: meteen naar de volgende ruimte */
      const nowT = performance.now();
      if (hs.exit && (!hs.requiresFlag || state.flags[hs.requiresFlag]) &&
          lastTapHs === hs && nowT - lastTapTime < 450) {
        lastTapHs = null; lastTapTime = 0;
        travelTo(hs.exit.to, hs.exit.travelText);
        return;
      }
      lastTapHs = hs; lastTapTime = nowT;
      const wt = hsWalkTo(hs);
      marker = { x: wt.x, y: wt.y, until: nowT + 700 };
      walkThenInteract(hs);
    } else {
      lastTapHs = null;
      const dest = clampToWalkable(p.x, p.y);
      marker = { x: dest.x, y: dest.y, until: performance.now() + 700 };
      player.pending = null;
      player.target = dest;
      if (darkBlocked(p.x, p.y)) showToast(L(GAME.scenes[state.currentScene].darkWalkText));
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!started || e.pointerType === 'touch') return;
    const p = screenToScene(e.clientX, e.clientY);
    const hs = hotspotAt(p.x, p.y);
    canvas.style.cursor = hs ? 'pointer' : 'default';
    if (hs) showLabel(L(hs.name), true);
    else if (!labelTimer) elLabel.hidden = true;
  });

  if (elHintBtn) elHintBtn.addEventListener('click', () => {
    sfx('tap');
    hintUntil = performance.now() + 1800;
  });

  /* ---------- Uitvergroten (bv. het receptenblaadje) ---------- */
  const elZoomPrev = document.getElementById('zoom-prev');
  const elZoomNext = document.getElementById('zoom-next');
  const elZoomPage = document.getElementById('zoom-page');
  let bookPages = null, bookIdx = 0;
  function setBookNav(on) {
    if (elZoomPrev) elZoomPrev.hidden = !on;
    if (elZoomNext) elZoomNext.hidden = !on;
    if (elZoomPage) elZoomPage.hidden = !on;
  }
  function openZoom(img) {
    if (!elZoom || !elZoomImg) return;
    bookPages = null; setBookNav(false);
    elZoomImg.src = img + AV;
    elZoom.hidden = false;
    sfx('tap');
  }
  /* Met de blauwe steen op de staf en het glinsterende boek: de drakenspreuk schrijft zichzelf. */
  function writeDragonSpell() {
    if (state.flags.dragonSpellLearned) { openBook(); return; }
    state.flags.dragonSpellLearned = true;
    addItem('dragonspell');
    sfx('combine');
    castGlow = { t0: performance.now() };   // de staf flitst blauw op
    say({ nl: 'Je slaat je glinsterende toverboek open. De diepblauwe magie uit de drakensteen op je staf vloeit in de bladzijden, en met sierlijke, oplichtende letters schrijft de DRAKENSPREUK zich vanzelf: “Draconis Umbra”. Nu kun je hem uitspreken bij de poortwacht! (de spreuk staat rechts in je tas)', en: 'You open your glittering spellbook. The deep-blue magic from the dragon-stone on your staff flows into the pages, and in elegant, glowing letters the DRAGON SPELL writes itself: “Draconis Umbra”. Now you can speak it at the gate guard! (the spell is on the right in your bag)' });
    updateQuest();
  }
  /* Toverboek: blader door de spreuken die je al kent. */
  function openBook() {
    if (!elZoom || !elZoomImg) return;
    const pages = [];
    if (state.flags.mapFiled) pages.push({ img: 'assets/art/map-valley.png', label: { nl: 'De Kaart', en: 'The Map' } });          // altijd de eerste bladzijde
    if (state.flags.spellWritten) pages.push({ img: 'assets/art/spell-dance.jpg', label: { nl: 'Dans-spreuk', en: 'Dance Spell' } });
    if (state.flags.gotRecipe) pages.push({ img: 'assets/art/recipe.jpg', label: { nl: 'Het Recept', en: 'The Recipe' } });
    if (state.flags.dragonSpellLearned) pages.push({ img: 'assets/art/spell-dragon.jpg', label: { nl: 'Drakenspreuk', en: 'Dragon Spell' } });
    if (!pages.length) return;
    bookPages = pages; bookIdx = pages.length - 1;   // open op de nieuwste spreuk
    showBookPage();
    elZoom.hidden = false; sfx('tap');
    state.flags.bookSeenCount = pages.length;   // boek gezien → glinster-hint dooft (tot er een nieuwe spreuk bij komt)
    renderInventory();
  }
  function showBookPage() {
    if (!bookPages) return;
    const p = bookPages[bookIdx];
    elZoomImg.src = p.img + AV;
    const multi = bookPages.length > 1;
    setBookNav(multi);
    if (elZoomPrev) elZoomPrev.classList.toggle('dim', bookIdx === 0);
    if (elZoomNext) elZoomNext.classList.toggle('dim', bookIdx === bookPages.length - 1);
    if (elZoomPage) elZoomPage.textContent = L(p.label) + '  ·  ' + (bookIdx + 1) + '/' + bookPages.length;
  }
  function bookFlip(d) {
    if (!bookPages) return;
    const n = Math.max(0, Math.min(bookPages.length - 1, bookIdx + d));
    if (n === bookIdx) return;
    bookIdx = n; showBookPage(); sfx('tap');
  }
  function closeZoom() { if (elZoom) elZoom.hidden = true; bookPages = null; setBookNav(false); }
  if (elZoom) elZoom.addEventListener('pointerdown', closeZoom);
  if (elZoomPrev) elZoomPrev.addEventListener('pointerdown', (e) => { e.stopPropagation(); bookFlip(-1); });
  if (elZoomNext) elZoomNext.addEventListener('pointerdown', (e) => { e.stopPropagation(); bookFlip(1); });

  /* ---------- Cinematic-cutscene (fullscreen video) ----------
     De spelmuziek blijft gewoon doorlopen onder de stille clip. */
  let cutsceneDone = null;
  function endCutscene() {
    if (!cutsceneDone) return;
    const cb = cutsceneDone; cutsceneDone = null;
    try { elCutsceneVid.pause(); } catch (e) {}
    elCutsceneVid.removeAttribute('src');
    try { elCutsceneVid.load(); } catch (e) {}
    elCutscene.hidden = true;
    cb && cb();
  }
  function playCutscene(src, onDone) {
    if (!elCutscene || !elCutsceneVid) { onDone && onDone(); return; }
    cutsceneDone = onDone || (() => {});
    elCutsceneVid.src = src + AV;
    elCutscene.hidden = false;
    elCutsceneVid.currentTime = 0;
    const p = elCutsceneVid.play();
    if (p && p.catch) p.catch(() => {});   // autoplay-blokkade mag het spel niet breken
  }
  if (elCutsceneVid) elCutsceneVid.addEventListener('ended', endCutscene);
  if (elCutsceneSkip) elCutsceneSkip.addEventListener('click', endCutscene);

  /* ---------- Winst & herstart ---------- */
  function showWin() {
    elWinText.textContent = L(GAME.winText);
    elWin.hidden = false;
    elQuest.hidden = true;
  }

  function resetGame() {
    state = newState();
    msgQueue = [];
    pendingWin = false;
    minoWalk = null;
    amuletRiseT0 = 0;
    revive = null;
    elMsg.hidden = true;
    elBubble.hidden = true;
    elWin.hidden = true;
    elDeath.hidden = true;
    const s = GAME.scenes[state.currentScene].playerStart;
    player.x = s.x; player.y = s.y;
    player.target = null; player.pending = null;
    player.dir = 'down'; player.flip = false; player.phase = 0;
    follower.active = false; follower.scared = false;
    exitArm = {};
    initNpcs();
    initFireflies(0);
    embers.length = 0;
    paintBackground();
    renderInventory();
    updateQuest();
    fade.mode = 'in';
    fade.t0 = performance.now();
    state.flags['visited_' + state.currentScene] = true;
    say(GAME.scenes[state.currentScene].entryText);
  }

  /* ---------- Opening / proloog ---------- */
  const PROLOGUE = [
    { img: 'assets/art/prologue-1.jpg', text: {
      nl: 'In het koninkrijk Eldoria, waar de ochtendmist over de heuvels hangt, ligt het dorpje Ravenholt. Eeuwenlang dreef de oude watermolen de bron aan die het dorp van vers water voorzag.',
      en: 'In the kingdom of Eldoria, where the morning mist lies over the hills, sits the little village of Ravenholt. For centuries the old water mill drove the spring that gave the village fresh water.' } },
    { img: 'assets/art/prologue-2.jpg', text: {
      nl: 'Maar op een stille ochtend klatert de fontein niet meer. Het waterrad van de molen staat stokstijf stil en het water zakt met de dag. In de verte gloeien vreemde blauwe lichten boven de vallei...',
      en: 'But one quiet morning the fountain falls silent. The mill’s water wheel stands dead still and the water drops by the day. Far off, strange blue lights glow above the valley...' } },
    { img: 'assets/art/prologue-3.jpg', text: {
      nl: 'Burgemeester Bram roept de jonge Finn erbij. “Onderzoek de molen, jongen — en let op die lichten.” Met zijn vaders staf in de hand zet Finn de eerste stap. Zo begint het avontuur.',
      en: 'Mayor Bram calls for young Finn. “Go and inspect the mill, lad — and mind those lights.” With his father’s staff in hand, Finn takes his first step. And so the adventure begins.' } }
  ];
  let prologueIdx = 0, prologueLock = false;
  function showProloguePanel(i) {
    const p = PROLOGUE[i];
    if (!p) { endPrologue(); return; }
    prologueLock = true;
    elPrologueImg.classList.remove('show');
    elPrologueText.classList.remove('show');
    elPrologueText.textContent = L(p.text);
    const reveal = () => { elPrologueImg.classList.add('show'); setTimeout(() => { elPrologueText.classList.add('show'); prologueLock = false; }, 350); };
    elPrologueImg.onload = reveal;
    elPrologueImg.onerror = reveal;
    elPrologueImg.src = p.img + AV;
    if (elPrologueImg.complete && elPrologueImg.naturalWidth) reveal();
  }
  function advancePrologue() {
    if (prologueLock) { elPrologueImg.classList.add('show'); elPrologueText.classList.add('show'); prologueLock = false; return; }
    prologueIdx++;
    if (prologueIdx >= PROLOGUE.length) endPrologue();
    else { if (soundOn) sfx('tap'); showProloguePanel(prologueIdx); }
  }
  function startPrologue() {
    prologueIdx = 0;
    elPrologue.hidden = false;
    showProloguePanel(0);
  }
  function endPrologue() {
    elPrologue.hidden = true;
    started = true;
    state.flags['visited_' + state.currentScene] = true;
    updateQuest();
    say(GAME.scenes[state.currentScene].entryText);
  }
  if (elPrologue) elPrologue.addEventListener('click', advancePrologue);
  if (elPrologueSkip) elPrologueSkip.addEventListener('click', (e) => { e.stopPropagation(); if (soundOn) sfx('tap'); endPrologue(); });

  elStartBtn.addEventListener('click', () => {
    ac();
    startMusic();
    sfx('tap');
    elTitle.hidden = true;
    /* Geen proloog-panels meer: het titelscherm zelf is de openingsfoto; direct het spel in. */
    started = true;
    state.flags['visited_' + state.currentScene] = true;
    updateQuest();
    say(GAME.scenes[state.currentScene].entryText);
  });

  elReplayBtn.addEventListener('click', resetGame);

  /* Home-knop: tijdens het spel eerst bevestigen (ja/nee) voor je het spel verlaat. */
  const elHomeBtn = document.getElementById('homeBtn');
  if (elHomeBtn) {
    elHomeBtn.addEventListener('click', (e) => {
      if (started && !window.confirm(L(GAME.ui.homeConfirm))) e.preventDefault();
    });
  }

  /* ---------- Test-API ---------- */
  window.__game = {
    getState: () => state,
    getPlayer: () => ({ x: player.x, y: player.y, walking: !!player.target }),
    getNpc: (id) => npcRt[id] ? { x: npcRt[id].x, y: npcRt[id].y } : null,
    start: () => { if (!started) { elStartBtn.click(); if (elPrologue && !elPrologue.hidden) endPrologue(); } },
    tap: (hotspotId) => {
      const scene = GAME.scenes[state.currentScene];
      const hs = scene.hotspots.find(h => h.id === hotspotId);
      if (!hs) throw new Error('Onbekende hotspot: ' + hotspotId);
      interactNow(hs);
    },
    walkTo: (x, y) => { player.pending = null; player.target = clampToWalkable(x, y); },
    setPlayer: (x, y) => { player.x = x; player.y = y; player.target = null; player.pending = null; player.path = null; },
    canWalk: (x, y) => inWalkable(x, y),
    setDebug: (on) => { window.__debugWalk = on; },
    select: (itemId) => onInventoryTap(itemId),
    dismissAll: () => { let n = 0; while (msgOpen() && n++ < 50) showNextMsg(); },
    isWinShown: () => !elWin.hidden,
    isDeathShown: () => !elDeath.hidden,
    setLang: (l) => { lang = l; applyLang(); },
    questKey,
    getMaze: () => maze && { g: maze.g.map(r => r.slice()), n: maze.n, cur: maze.cur.slice(), exit: maze.exit.slice() },
    mazeMove: (dr, dc) => mazeMove(dr, dc),
    isGearShown: () => !!(elGear && !elGear.hidden),
    gearAuto: () => gearAuto(),
    gearState: () => gears && { placed: gears.tray.filter((g) => g.placedAt != null).length, spinning: !!gears.spin,
      correct: allGearsCorrect(), canvas: elGearCanvas ? { w: elGearCanvas.width, h: elGearCanvas.height } : null },
    gearTest: () => { if (gears) testGears(); },
    paint: () => paintBackground(),
    frogTest: () => { witchPoof = { t0: performance.now(), x: 198, y: 196 }; witchFrog = { t0: performance.now(), x: 198, y: 196, dir: 1 }; },   // toon de heks-verdwijnt-als-kikker animatie
    dragonTest: () => { dragonShadow = { t0: performance.now() }; },   // toon alleen de drakenschaduw-flyby
    enterScene: (id) => { if (GAME.scenes[id]) { state.currentScene = id; const sc = GAME.scenes[id]; if (sc.fx && sc.fx.fireflies) initFireflies(sc.fx.fireflies); paintBackground(); } },
    reset: resetGame
  };

  /* ---------- Start ---------- */
  resize();
  initLeaves();
  initNpcs();
  paintBackground();
  renderInventory();
  applyLang();
  /* Geluid-icoon meteen op de juiste stand zetten (in de preview start het uit). */
  { const _si = document.getElementById('soundIcon'); if (_si) _si.src = soundOn ? 'assets/icons/ui-sound-on.png' : 'assets/icons/ui-sound-off.png'; }
  setInterval(loop, 1000 / 30);
})();
