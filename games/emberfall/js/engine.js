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
  const elMsg       = document.getElementById('msg');
  const elMsgText   = document.getElementById('msgText');
  const elMsgMore   = document.getElementById('msgMore');
  const elBubble    = document.getElementById('bubble');
  const elBubbleTxt = document.getElementById('bubbleText');
  const elBubbleFace= document.getElementById('bubbleFace');
  const elMsgFace   = document.getElementById('msgFace');
  const elToast     = document.getElementById('toast');
  const elInvbar    = document.getElementById('invbar');
  const elTitle     = document.getElementById('title-screen');
  const elWin       = document.getElementById('win-screen');
  const elWinText   = document.getElementById('winText');
  const elDeath     = document.getElementById('death-screen');
  const elDeathText = document.getElementById('deathText');
  const elStartBtn  = document.getElementById('startBtn');
  const elReplayBtn = document.getElementById('replayBtn');
  const elRetryBtn  = document.getElementById('retryBtn');

  const MIN_SLOTS = 6;
  const WALK_SPEED = 95;
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
  for (const [id, src] of Object.entries(ART.sprites)) {
    const img = new Image();
    img.src = src + AV;
    art.sprites[id] = img;
  }
  for (const [id, item] of Object.entries(GAME.items)) {
    if (item.img) {
      const img = new Image();
      img.src = item.img + AV;
      art.items[id] = img;
    }
  }
  const ready = (img) => img && img.complete && img.naturalWidth > 0;

  /* ---------- State ---------- */
  function newState() {
    return { currentScene: GAME.startScene, inventory: [], flags: {}, selectedItem: null };
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
  let revive     = null;   // win-viering: bladeren komen tot leven in het bos
  let hintUntil  = 0;
  let labelTimer = null;
  let lastPopItem = null;
  let marker = null;
  let soundOn = true;

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
  const DEFAULT_MUSIC = 'assets/audio/cistern-syntax.mp3';
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
      bgMusic.volume = soundOn ? 0.07 : 0;
      bgMusic.addEventListener('error', startSynthFallback, { once: true });
      bgMusic.play().catch(() => {});
    } catch (e) { startSynthFallback(); }
  }

  elSoundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    const icon = document.getElementById('soundIcon');
    if (icon) icon.src = soundOn ? 'assets/icons/ui-sound-on.png' : 'assets/icons/ui-sound-off.png';
    if (music.master) music.master.gain.value = soundOn ? 1 : 0;
    if (bgMusic) { bgMusic.volume = soundOn ? 0.07 : 0; if (soundOn) bgMusic.play().catch(() => {}); }
    if (soundOn) sfx('tap');
  });

  elLangBtn.addEventListener('click', () => {
    lang = lang === 'nl' ? 'en' : 'nl';
    try { localStorage.setItem('emberfall_lang', lang); } catch (e) { /* prima */ }
    applyLang();
  });

  /* ---------- Render-buffers (2× supersampled voor scherpere, gedetailleerde art) ---------- */
  const SS = 2;                       // supersample-factor: interne buffers op 2× detail
  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = SCENE_W * SS; bgCanvas.height = SCENE_H * SS;
  const bgCtx = bgCanvas.getContext('2d');

  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = SCENE_W * SS; frameCanvas.height = SCENE_H * SS;
  const fctx = frameCanvas.getContext('2d');

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
    for (let i = 0; i < n; i++) {
      fireflies.push({
        x: 100 + Math.random() * (SCENE_W - 200),
        y: 80 + Math.random() * 180,
        ax: Math.random() * Math.PI * 2,
        ay: Math.random() * Math.PI * 2,
        sp: 0.2 + Math.random() * 0.5,
        ph: Math.random() * Math.PI * 2
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
    return scene.walkable.some(r =>
      x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
  }
  function inWalkable(x, y) {
    return inWalkableScene(GAME.scenes[state.currentScene], x, y);
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
    const step = Math.min(WALK_SPEED * dt, dist);
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
    if (started && elDeath.hidden && elWin.hidden && elPuzzle.hidden && elRiddle.hidden && elRune.hidden && elMaze.hidden) {
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
        const step = Math.min(WALK_SPEED * dt, dist);
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

  /* Per scene: een uitgang is pas "gewapend" zodra je er even vandaan
     bent — anders stuiter je direct terug na het binnenkomen. */
  let exitArm = {};
  function checkExitProximity(scene) {
    if (!started || fade.mode || !elDeath.hidden || !elWin.hidden || !elPuzzle.hidden || !elRiddle.hidden || !elRune.hidden || !elMaze.hidden) return;
    for (const hs of scene.hotspots) {
      if (!hs.exit || !hs.walkTo) continue;
      if (hs.requiresFlag && !state.flags[hs.requiresFlag]) continue;
      const d = Math.hypot(player.x - hs.walkTo.x, player.y - hs.walkTo.y);
      if (!exitArm[hs.id]) {
        if (d > 30) exitArm[hs.id] = true;
      } else if (d < 13) {
        player.target = null;
        player.pending = null;
        travelTo(hs.exit.to, hs.exit.travelText);
        return;
      }
    }
  }

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
      const rt = npcRt[npc.id] || npc;
      ents.push({ y: rt.y, draw: () => drawNpc(npc, now) });
    }
    ents.push({ y: player.y, draw: () => drawPlayer(now) });
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
    ents.sort((a, b) => a.y - b.y);
    for (const e of ents) e.draw();

    /* Doorzichtige pulserende pijlen bij uitgangen — bovenop alles */
    for (const hs of scene.hotspots) {
      if (!hs.exit || !hs.arrow) continue;
      if (hs.requiresFlag && !state.flags[hs.requiresFlag]) continue;
      const a = hs.arrow;
      const pulse = 0.34 + 0.2 * Math.sin(now / 350);
      const f = Math.sin(now / 350) * 2;
      fctx.save();
      fctx.translate(a.x, a.y + (a.dir === 'up' ? f : a.dir === 'down' ? -f : 0));
      if (a.dir === 'left') { fctx.rotate(-Math.PI / 2); fctx.translate(-f, 0); }
      else if (a.dir === 'right') { fctx.rotate(Math.PI / 2); fctx.translate(f, 0); }
      else if (a.dir === 'down') fctx.rotate(Math.PI);
      fctx.fillStyle = `rgba(231,207,134,${pulse})`;
      fctx.strokeStyle = `rgba(31,20,16,${pulse + 0.25})`;
      fctx.lineWidth = 1.5;
      fctx.beginPath();
      fctx.moveTo(0, -10); fctx.lineTo(9, 1); fctx.lineTo(4, 1); fctx.lineTo(4, 9);
      fctx.lineTo(-4, 9); fctx.lineTo(-4, 1); fctx.lineTo(-9, 1);
      fctx.closePath();
      fctx.fill(); fctx.stroke();
      fctx.restore();
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
      const g = fctx.createRadialGradient(fx2, fy2, 0, fx2, fy2, r);
      g.addColorStop(0, `rgba(186,255,150,${a * 0.42})`);
      g.addColorStop(0.5, `rgba(150,230,120,${a * 0.16})`);
      g.addColorStop(1, 'rgba(150,230,120,0)');
      fctx.fillStyle = g;
      fctx.fillRect(fx2 - r, fy2 - r, r * 2, r * 2);
      // heldere kern
      fctx.fillStyle = `rgba(236,255,196,${Math.min(1, a + 0.25)})`;
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

    /* Win-viering: de eeuwige herfst wijkt — bladeren komen tot leven, groen licht
       en opstijgende blaadjes/sprankels vullen het bos; daarna het win-scherm. */
    if (revive) {
      const rt = Math.min(1, (now - revive.t0) / 3500);
      const ga = Math.sin(rt * Math.PI);
      fctx.fillStyle = `rgba(120,210,100,${ga * 0.42})`;         // groene levensgloed (sterker)
      fctx.fillRect(0, 0, SCENE_W, SCENE_H);
      for (let k = 0; k < 64; k++) {                             // opstijgende groene blaadjes die tot leven komen
        const tt = (rt * 1.5 + k * 0.111) % 1;
        const a = Math.sin(tt * Math.PI);
        if (a <= 0.05) continue;
        const bx = (k * 71) % SCENE_W + Math.sin(now / 300 + k) * 16;
        const by = SCENE_H + 10 - tt * (SCENE_H + 28);
        fctx.fillStyle = `rgba(${80 + (k % 50)},${165 + (k * 53) % 70},${70 + (k % 30)},${a})`;
        const sz = 3 + (k % 3);
        fctx.fillRect((bx - sz / 2) | 0, by | 0, sz, sz);        // blaadje
        fctx.fillRect((bx + 1) | 0, (by - 2) | 0, 1, 2);         // steeltje
      }
      for (let k = 0; k < 26; k++) {                             // gouden sprankels van leven
        const tt = (rt * 2 + k * 0.16) % 1, a = Math.sin(tt * Math.PI);
        const sxp = (k * 131) % SCENE_W, syp = 24 + (k * 71) % 220 - tt * 30;
        fctx.fillStyle = `rgba(255,250,210,${a})`;
        fctx.fillRect(sxp | 0, syp | 0, 2, 2);
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
        const flicker = 0.18 + 0.1 * Math.sin(now / 90 + f.x);
        const g = fctx.createRadialGradient(f.x, f.y, 1, f.x, f.y, f.r || 14);
        g.addColorStop(0, `rgba(255,190,80,${flicker})`);
        g.addColorStop(1, 'rgba(255,140,40,0)');
        fctx.fillStyle = g;
        fctx.fillRect(f.x - (f.r || 14), f.y - (f.r || 14), (f.r || 14) * 2, (f.r || 14) * 2);
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
    if (fx.fountain) {
      const f = fx.fountain;
      /* vallende waterstraal uit de tap */
      for (let i = 0; i < 5; i++) {
        const t = ((now / 42) + i * 4) % 22;
        const al = 0.45 - t / 52;
        fctx.fillStyle = `rgba(186,228,242,${al})`;
        fctx.fillRect(Math.round(f.sx + Math.sin(t / 3) * 0.4), Math.round(f.sy + t), 1, 1);
      }
      /* opspattend bij het water */
      if (((now / 120) | 0) % 2 === 0) {
        fctx.fillStyle = 'rgba(220,242,250,0.6)';
        fctx.fillRect(f.sx - 1, f.wy, 1, 1);
        fctx.fillRect(f.sx + 2, f.wy + 1, 1, 1);
      }
      /* drijvende rimpels op het oppervlak (klein, binnen de rand) */
      for (let i = 0; i < 2; i++) {
        const yy = f.wy + 4 + i * 6;
        const off = Math.sin(now / 520 + i * 1.7) * 3;
        fctx.fillStyle = `rgba(205,238,248,${0.16 + 0.1 * Math.sin(now / 300 + i)})`;
        fctx.fillRect(Math.round(f.wx + off), yy, 7, 1);
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
    /* (De dichte/open poortdeur zit nu in de achtergrond-afbeelding.) */
    /* Open kist zodra de runenpuzzel is opgelost */
    if (fx.chestOpen && state.flags.runesSolved) {
      const img = art.sprites.chestOpen;
      if (ready(img)) {
        const w = img.naturalWidth, h = img.naturalHeight;
        fctx.drawImage(img, Math.round(fx.chestOpen.x - w / 2), Math.round(fx.chestOpen.y - h), w, h);
        const glow = 0.12 + 0.08 * Math.sin(now / 300);
        const g = fctx.createRadialGradient(fx.chestOpen.x, fx.chestOpen.y - h / 2, 2,
          fx.chestOpen.x, fx.chestOpen.y - h / 2, 26);
        g.addColorStop(0, `rgba(255,220,130,${glow})`);
        g.addColorStop(1, 'rgba(255,220,130,0)');
        fctx.fillStyle = g;
        fctx.fillRect(fx.chestOpen.x - 26, fx.chestOpen.y - h / 2 - 26, 52, 52);
      }
    }
    if (fx.amulet && !dark && !state.flags.taken_temple_shrine) {
      const a = fx.amulet;
      const glow = 0.3 + 0.18 * Math.sin(now / 350);
      const g = fctx.createRadialGradient(a.x + 8, a.y + 8, 1, a.x + 8, a.y + 8, 17);
      g.addColorStop(0, `rgba(231,207,134,${glow})`);
      g.addColorStop(1, 'rgba(231,207,134,0)');
      fctx.fillStyle = g;
      fctx.fillRect(a.x - 9, a.y - 9, 34, 34);
      const img = art.items.amulet;
      if (ready(img)) {
        const hgt = 17, wd = Math.round(img.naturalWidth * hgt / img.naturalHeight);
        fctx.drawImage(img, a.x, a.y, wd, hgt);
      } else {
        drawSprite(fctx, AMULET_SPRITE, a.x, a.y, false, 2);
      }
      /* dansende fonkelingen rond de amulet */
      for (let k = 0; k < 3; k++) {
        const ang = now / 700 + k * 2.1;
        const tx = a.x + 8 + Math.cos(ang) * 14;
        const ty = a.y + 8 + Math.sin(ang * 1.3) * 12;
        twinkle(tx, ty, 0.45 + 0.45 * Math.sin(now / 200 + k * 2));
      }
    }
  }

  function paintPuzzleGlow(scene, now) {
    if (!scene.puzzles) return;
    for (const hs of scene.hotspots) {
      if (!hs.puzzleKey) continue;
      const pz = scene.puzzles[hs.puzzleKey.puzzle];
      const prog = state.flags['puzzle_' + hs.puzzleKey.puzzle] || 0;
      const idx = pz.sequence.indexOf(hs.puzzleKey.key);
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
  function drawWorldItems(scene, now) {
    if (!scene.worldItems) return;
    for (const wi of scene.worldItems) {
      if (state.flags['taken_' + state.currentScene + '_' + wi.hotspot]) continue;
      if (wi.requiresFlag && !state.flags[wi.requiresFlag]) continue;
      const img = art.items[wi.item];
      if (!ready(img)) continue;
      const hgt = 18, wd = Math.round(img.naturalWidth * hgt / img.naturalHeight);
      const bob = 0;                                   // items blijven stil staan (geen beweging)
      const glow = 0.14 + 0.08 * Math.sin(now / 500 + wi.x);
      const g = fctx.createRadialGradient(wi.x, wi.y, 1, wi.x, wi.y, 13);
      g.addColorStop(0, `rgba(231,207,134,${glow})`);
      g.addColorStop(1, 'rgba(231,207,134,0)');
      fctx.fillStyle = g;
      fctx.fillRect(wi.x - 13, wi.y - 13, 26, 26);
      fctx.drawImage(img, Math.round(wi.x - wd / 2), Math.round(wi.y - hgt / 2) + bob, wd, hgt);
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
  function drawArtSprite(img, x, y, { flip = false, bob = 0, squashY = 1, rot = 0 } = {}) {
    const w = img.naturalWidth, h = img.naturalHeight;
    const px = Math.round(x), py = Math.round(y + bob);
    shadow(x, y, w * 0.8);
    fctx.save();
    fctx.imageSmoothingEnabled = false;
    fctx.translate(px, py);
    if (rot) fctx.rotate(rot);
    if (flip) fctx.scale(-1, 1);
    fctx.drawImage(img, Math.round(-w / 2), Math.round(-h * squashY), w, Math.round(h * squashY));
    fctx.restore();
  }

  /* Idle-gebaren: af en toe doet een figuur iets grappigs. */
  const gesture = { hero: { next: 4000, until: 0 }, seer: { next: 7000, until: 0 }, minotaur: { next: 9000, until: 0 } };
  function gestureState(id, now, durMs, minGap, maxGap) {
    let g = gesture[id]; if (!g) g = gesture[id] = { next: 0, until: 0 };
    if (now > g.next && now > g.until) {
      g.until = now + durMs;
      g.next = now + durMs + minGap + Math.random() * (maxGap - minGap);
    }
    return now < g.until ? (g.until - now) / durMs : 0;
  }

  function drawPlayer(now) {
    const hero = art.sprites.hero;
    const walking = !!player.target || player.kbMoving;
    if (ready(hero)) {
      if (walking) {
        /* loopcyclus: met 2 stap-frames (links/rechts) een echte animatie;
           anders terugvallen op de oude sta/stap-wissel. */
        const w1 = art.sprites.heroWalk, w2 = art.sprites.heroWalk2;
        const stride = Math.sin(player.phase * 0.55);
        let img;
        if (ready(w1) && ready(w2)) img = stride > 0 ? w1 : w2;
        else img = (stride > 0 && ready(w1)) ? w1 : hero;
        const hop = -Math.round(Math.abs(stride) * 2.5);
        const lean = stride * 0.05;
        drawArtSprite(img, player.x, player.y, { flip: player.flip, bob: hop, rot: lean });
        return;
      }
      /* idle: rustig ademen + zo nu en dan vrolijk zwaaien */
      const g = gestureState('hero', now, 1300, 5000, 9000);
      const wave = art.sprites.heroWave;
      if (g > 0 && ready(wave)) {
        const bounce = -Math.round(Math.abs(Math.sin((1 - g) * Math.PI * 3)) * 2);
        drawArtSprite(wave, player.x, player.y, { flip: player.flip, bob: bounce });
        return;
      }
      const breathe = Math.round(Math.sin(now / 800));
      drawArtSprite(hero, player.x, player.y, { flip: player.flip, bob: breathe });
      return;
    }
    const stride = [0, 1, 0, 2][(player.phase | 0) % 4];
    const grid = playerFrame(player.dir, walking ? stride : 0);
    drawSprite(fctx, grid, (player.x - PLAYER_W * SPRITE_SCALE / 2) | 0,
      (player.y - PLAYER_H * SPRITE_SCALE) | 0, player.dir === 'left', SPRITE_SCALE);
  }

  function drawNpc(npc, now) {
    const S = SPRITE_SCALE;
    const rt = npcRt[npc.id] || { x: npc.x, y: npc.y, flip: false, target: null, phase: 0 };
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
      if (state.flags.minotaurAsleep) {
        const img = art.sprites.minotaurAsleep;
        if (ready(img)) {
          drawArtSprite(img, rt.x, rt.y, { bob: Math.round(Math.sin(now / 800)) });
        } else {
          drawSprite(fctx, MINO_ASLEEP, (rt.x - MINO_SLEEP_W * S / 2) | 0,
            (rt.y - MINO_SLEEP_H * S) | 0, false, S);
        }
        /* Zzz stijgt op bij zijn kop */
        const zi = ((now / 700) | 0) % 3;
        for (let z = 0; z <= zi; z++) {
          drawSprite(fctx, Z_GLYPH, Math.round(rt.x + 26 + z * 9),
            Math.round(rt.y - 86 - z * 12), false, z === zi ? 1 : 2);
        }
      } else {
        const img = art.sprites.minotaur;
        if (ready(img)) {
          /* hij staat stil — heel subtiele ademhaling (1px, traag) */
          const breathe = Math.sin(now / 1500) > 0.6 ? -1 : 0;
          drawArtSprite(img, rt.x, rt.y, { bob: breathe });
          return;
        }
        const f = ((now / 600) | 0) % 2;
        drawSprite(fctx, MINO_AWAKE[f], (rt.x - MINO_W * S / 2) | 0, (rt.y - MINO_H * S) | 0, false, S);
      }
    }
  }

  function drawFollower(now) {
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

  function drawHints(now, scale) {
    if (now > hintUntil) return;
    const remain = (hintUntil - now) / 1800;
    const pulse = 0.5 + 0.5 * Math.sin(now / 130);
    const alpha = Math.min(1, remain * 2) * (0.55 + 0.35 * pulse);
    for (const hs of GAME.scenes[state.currentScene].hotspots) {
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
  function updateQuest(force) {
    const key = started ? questKey() : null;
    if (!key) { elQuest.hidden = true; return; }
    const t = L(GAME.ui[key]);
    if (elQuest.textContent !== t || force) {
      elQuest.textContent = t;
      elQuest.style.opacity = '0';
      setTimeout(() => { elQuest.style.opacity = '1'; }, 30);
    }
    elQuest.hidden = false;
  }

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
      const by = view.oy + m.anchor.y * view.scale;
      elBubble.style.left = Math.max(window.innerWidth * 0.15,
        Math.min(window.innerWidth * 0.85, bx)) + 'px';
      elBubble.style.top = Math.max(56, by - 6) + 'px';
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

  elMsg.addEventListener('click', showNextMsg);
  elBubble.addEventListener('click', showNextMsg);

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
    const slots = Math.max(MIN_SLOTS, state.inventory.length);
    for (let i = 0; i < slots; i++) {
      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      const itemId = state.inventory[i];
      if (itemId) {
        const item = GAME.items[itemId];
        slot.classList.add('filled');
        if (item.img) {
          const im = document.createElement('img');
          im.src = item.img + AV;
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
  }

  function onInventoryTap(itemId) {
    if (msgOpen()) showNextMsg();   // sluit lopende tekst én verwerk de tik meteen
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
    }
    renderInventory();
  }

  function tryCombine(a, b) {
    const recipe = GAME.recipes.find(r =>
      (r.a === a && r.b === b) || (r.a === b && r.b === a));
    state.selectedItem = null;
    if (!recipe) { sfx('error'); say(GAME.strings.noCombine); return; }
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
    const avail = elPuzGrid.clientWidth || jig.stageW;
    const sc = Math.min(1, avail / jig.stageW);
    jig.scale = sc;
    jig.innerEl.style.transform = 'scale(' + sc + ')';
    jig.innerEl.style.transformOrigin = 'top left';
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
    if (cfg.give) addItem(cfg.give);
    sfx('gate'); paintBackground();
    setTimeout(() => {
      elPuzzle.hidden = true; jig = null;
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

  /* ---------- Runenstenen-popup (mobiel: klik volgorde in popup) ---------- */
  const elRune       = document.getElementById('rune-screen');
  const elRuneTitle  = document.getElementById('rune-title');
  const elRuneHint   = document.getElementById('rune-hint');
  const elRuneBtns   = document.getElementById('rune-btns');
  const elRuneStatus = document.getElementById('rune-status');
  const elRuneClose  = document.getElementById('rune-close');

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
    elRuneTitle.textContent = lang === 'nl' ? 'De Runenstenen' : 'The Rune Stones';
    elRuneHint.textContent  = lang === 'nl' ? 'Tik de stenen in de juiste volgorde aan' : 'Tap the stones in the right order';
    renderRunePopup();
    elRune.hidden = false;
    sfx('tap');
  }

  function renderRunePopup() {
    const pz = GAME.scenes[state.currentScene].puzzles.runes;
    const prog = state.flags['puzzle_runes'] || 0;
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
        }
      } else {
        sfx('error');
        const it = GAME.items[sel];
        say((it && it.noUseText) || GAME.strings.noEffect);
      }
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

    if (hs.gives) {
      if (state.flags[takenFlag(hs)]) {
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
      state.flags[takenFlag(hs)] = true;
      addItem(hs.gives.item);
      sfx('pickup');
      say(hs.gives.giveText);
      if (hs.gives.win) { pendingWin = true; sfx('win'); }
      return;
    }
    say(lookText(hs), hsSpeaker(hs), hsFace(hs));
  }

  function runAction(a, anchor, face) {
    if (a.consume) (Array.isArray(a.consume) ? a.consume : [a.consume]).forEach(removeItem);
    if (a.give) addItem(a.give);
    if (a.setFlag) {
      state.flags[a.setFlag] = true;
      updateQuest();
      const sc = GAME.scenes[state.currentScene];
      if (sc && sc.bgVariants && sc.bgVariants.some((v) => v.flag === a.setFlag || v.notFlag === a.setFlag)) {
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
    if (a.setFlag === 'minotaurAsleep') sfx('sleep');
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
    const dist = Math.hypot(player.x - wt.x, player.y - wt.y);
    if (dist <= ARRIVE_DIST + 2) { interactNow(hs); return; }
    player.pending = hs;
    player.target = { x: wt.x, y: wt.y };
  }

  function hotspotAt(sx, sy) {
    const scene = GAME.scenes[state.currentScene];
    let best = null, bestArea = Infinity;
    for (const hs of scene.hotspots) {
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

  let lastTapHs = null, lastTapTime = 0;   // voor dubbel-tik op uitgangen
  canvas.addEventListener('pointerdown', (e) => {
    ac();
    if (!started || fade.mode === 'out' || !elDeath.hidden || revive) return;
    if (msgOpen()) { showNextMsg(); return; }
    const p = screenToScene(e.clientX, e.clientY);
    if (p.x < 0 || p.x > SCENE_W || p.y < 0 || p.y > SCENE_H) return;

    const hs = hotspotAt(p.x, p.y);

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

  elHintBtn.addEventListener('click', () => {
    sfx('tap');
    hintUntil = performance.now() + 1800;
  });

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

  elStartBtn.addEventListener('click', () => {
    ac();
    startMusic();
    sfx('tap');
    elTitle.hidden = true;
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
    start: () => { if (!started) elStartBtn.click(); },
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
    reset: resetGame
  };

  /* ---------- Start ---------- */
  resize();
  initLeaves();
  initNpcs();
  paintBackground();
  renderInventory();
  applyLang();
  setInterval(loop, 1000 / 30);
})();
