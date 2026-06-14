/* Service worker — netwerk-eerst voor verse updates, cache als offline-vangnet. */

const CACHE = 'maanhoef-v10';

const PRECACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/sprites.js',
  './js/scenes.js',
  './js/data.js',
  './js/engine.js',
  './manifest.webmanifest',
  './assets/art/scene-farm.png',
  './assets/art/scene-grove.png',
  './assets/art/scene-grove-broken.png',
  './assets/art/scene-stable.png',
  './assets/art/scene-cave.png',
  './assets/art/scene-cave-dry.png',
  './assets/art/item-diamond.png',
  './assets/art/item-plank.png',
  './assets/art/scene-stable-open.png',
  './assets/art/horse-free.png',
  './assets/art/mouse.png',
  './assets/art/item-cheese.png',
  './assets/art/item-bridle.png',
  './assets/art/win-ride.png',

  './assets/art/title.png',
  './assets/art/pup.png',
  './assets/art/pup2.png',
  './assets/art/hero-face.png',
  './assets/art/owl.png',
  './assets/art/item-flute.png',
  './assets/art/item-bone.png',
  './assets/art/cave-seal.png',
  './assets/art/item-bucket.png',
  './assets/art/item-bucket-water.png',
  './assets/art/hero.png',
  './assets/art/hero-walk.png',
  './assets/art/hero-wave.png',
  './assets/art/hero-walk2.png',
  './assets/art/item-crystal.png',
  './assets/art/item-key.png',
  './assets/art/item-comb.png',
  './assets/art/item-saw.png',
  './assets/icons/ui-eye.png',
  './assets/icons/ui-sound-on.png',
  './assets/icons/ui-sound-off.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()).catch(() => self.skipWaiting())
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
    fetch(event.request)
      .then((response) => {
        if (response && response.ok && (response.type === 'basic' || response.type === 'cors')) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request, { ignoreSearch: true }).then((cached) => cached || caches.match('./index.html'))
      )
  );
});
