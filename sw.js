/* Service worker — cache-first zodat het spel offline speelt. */

const CACHE = 'emberfall-v10';

const PRECACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/sprites.js',
  './js/scenes.js',
  './js/data.js',
  './js/engine.js',
  './manifest.webmanifest',
  './assets/art/scene-courtyard.png',
  './assets/art/scene-temple.png',
  './assets/art/scene-grove.png',
  './assets/art/hero.png',
  './assets/art/hero-walk.png',
  './assets/art/hero-wave.png',
  './assets/art/title.png',
  './assets/art/seer.png',
  './assets/art/minotaur.png',
  './assets/art/minotaur-asleep.png',
  './assets/art/item-berries.png',
  './assets/art/item-vial-empty.png',
  './assets/art/item-vial-water.png',
  './assets/art/item-potion.png',
  './assets/art/item-amulet.png',
  './assets/art/dog.png',
  './assets/art/dog-cold.png',
  './assets/art/dog-vest.png',
  './assets/art/chest-open.png',
  './assets/art/gate-door.png',
  './assets/art/item-vest.png',
  './assets/art/emblem-puzzle.png',
  './assets/art/ov-courtyard-bushes.png',
  './assets/art/ov-courtyard-rubble.png',
  './assets/art/ov-grove-left.png',
  './assets/art/ov-grove-right.png',
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
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Runtime-cache voor o.a. webfonts, zodat ook die offline werken.
        if (response.ok && (response.type === 'basic' || response.type === 'cors')) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
