/* Service worker — netwerk-eerst voor verse updates, cache als offline-vangnet.
   Alleen de kleine basis wordt vooraf in de cache gezet; scene-art, puzzels en
   muziek komen in de cache zodra het spel ze gebruikt (geen 13 MB bij het openen). */

const CACHE = 'maanhoef-v55';
const V = '?v=54';

const PRECACHE = [
  './',
  './index.html',
  './css/style.css' + V,
  './js/sprites.js' + V,
  './js/scenes.js' + V,
  './js/data.js' + V,
  './js/engine.js' + V,
  './manifest.webmanifest',
  './assets/art/title.webp' + V,
  './assets/art/scene-farm.webp' + V,
  './assets/art/hero.png' + V,
  './assets/art/hero-walk.png' + V,
  './assets/art/hero-walk2.png' + V,
  './assets/art/hero-walk3.png' + V,
  './assets/art/hero-walk-sheet.png' + V,
  './assets/art/hero-wave.png' + V,
  './assets/art/hero-flute.png' + V,
  './assets/art/hero-face.png' + V,
  './assets/icons/ui-eye.png',
  './assets/icons/ui-sound-on.png',
  './assets/icons/ui-sound-off.png',
  './assets/icons/icon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()).catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.indexOf('maanhoef-') === 0 && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;   // analytics & other hosts: leave to the network
  /* Audio streamt met Range-verzoeken (iOS Safari wil echte 206-antwoorden):
     laat de browser dat zelf regelen via zijn gewone HTTP-cache. */
  if (req.headers.has('range') || req.destination === 'audio') return;
  event.respondWith(
    fetch(req)
      .then((response) => {
        /* alleen complete (200) antwoorden bewaren — 206/opaque niet */
        if (response && response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true })
          .then((cached) => cached || (req.mode === 'navigate' ? caches.match('./index.html') : null))
          .then((res) => res || Response.error())
      )
  );
});
