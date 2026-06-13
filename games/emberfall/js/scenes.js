/* ============================================================
   scenes.js — scene-afmetingen (liggend) + eenvoudige fallback
   De echte achtergronden zijn AI-art in assets/art/ (zie engine).
   Deze fallback toont een neutraal herfstvlak als een art-
   bestand (nog) niet geladen is — het spel blijft speelbaar.
   ============================================================ */

const SCENE_W = 568, SCENE_H = 320;

function paintFallbackScene(ctx, sceneId) {
  // lucht/muur-band
  const grad = ctx.createLinearGradient(0, 0, 0, SCENE_H);
  grad.addColorStop(0, '#3a2a1c');
  grad.addColorStop(0.4, '#7a5a36');
  grad.addColorStop(1, '#c79b62');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);
  // grondvlak
  ctx.fillStyle = '#cfae7e';
  ctx.fillRect(0, SCENE_H * 0.42, SCENE_W, SCENE_H * 0.58);
  ctx.fillStyle = 'rgba(110,80,48,0.5)';
  ctx.fillRect(0, SCENE_H * 0.42, SCENE_W, 3);
}

const SCENE_PAINTERS = new Proxy({}, {
  get: () => paintFallbackScene
});

/* Bewegend decor zit in de engine (paintFx, posities in data.js). */
function paintDecor() { /* fallback: geen extra decor */ }
