/* Service worker — netwerk-eerst voor verse updates, cache als offline-vangnet.
   (Eerder: cache-first met ignoreSearch, waardoor updates niet doorkwamen.) */

const CACHE = 'emberfall-v89';

const PRECACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/sprites.js',
  './js/scenes.js',
  './js/data.js',
  './js/engine.js',
  './manifest.webmanifest',
  './assets/art/face-seer.png',
  './assets/art/face-minotaur.png',
  './assets/art/face-dog.png',
  './assets/art/hero.png',
  './assets/art/hero-walk.png',
  './assets/art/hero-walk-sheet.png',
  './assets/art/hero-wave.png',
  './assets/art/seer.png',
  './assets/art/minotaur.png',
  './assets/art/minotaur-asleep.png',
  './assets/art/dog.png',
  './assets/art/dog-cold.png',
  './assets/art/dog-vest.png',
  './assets/art/chest-open.png',
  './assets/art/gate-door.png',
  './assets/art/item-berries.png',
  './assets/art/item-flower.png',
  './assets/art/item-recipe.png',
  './assets/art/item-berry-brew.png',
  './assets/art/tile-1.png',
  './assets/art/tile-2.png',
  './assets/art/tile-3.png',
  './assets/art/tile-4.png',
  './assets/art/item-recipe-large.webp',
  './assets/art/win-emberfall.webp',
  './assets/art/title.webp',
  './assets/art/emblem-puzzle.webp',
  './assets/art/amulet-seal.webp',
  './assets/art/robin-fly.png',
  './assets/art/item-vial-empty.png',
  './assets/art/item-vial-water.png',
  './assets/art/item-potion.png',
  './assets/art/item-amulet.png',
  './assets/art/item-vest.png',
  './assets/art/item-powder.png',
  './assets/art/item-flint.png',
  './assets/art/item-wood.png',
  './assets/art/torch-lit.png',
  './assets/icons/ui-eye.png',
  './assets/icons/ui-sound-on.png',
  './assets/icons/ui-sound-off.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.indexOf('emberfall-') === 0 && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== self.location.origin) return;   // analytics & other hosts: leave to the network
  /* Muziek (en andere range-verzoeken) niet via de SW: die streamt de browser zelf.
     Zo wordt de mp3 nooit in de cache gezet (206-antwoorden kunnen dat ook niet). */
  if (event.request.headers.has('range') || /\.mp3(\?|$)/.test(event.request.url)) return;

  /* Netwerk-eerst: altijd de nieuwste versie ophalen, cache bijwerken,
     en alleen bij geen netwerk terugvallen op de cache (offline spelen). */
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok &&
            (response.type === 'basic' || response.type === 'cors')) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request, { ignoreSearch: true })
          .then((cached) => cached ||
            (event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
      )
  );
});
