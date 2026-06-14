/* Service worker — netwerk-eerst voor verse updates, cache als offline-vangnet. */

const CACHE = 'maanhoef-v26';

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
  './assets/art/pup-nokey.png',
  './assets/art/pup-nokey2.png',
  './assets/art/mouse2.png',
  './assets/art/horse-bridled.png',
  './assets/art/tackbox.png',

  './assets/art/item-cheese.png',
  './assets/art/item-bridle.png',
  './assets/art/item-carrot.png',
  './assets/art/win-ride.png',
  './assets/art/scene-stable-water.png',
  './assets/art/pup-sit.png',
  './assets/art/pup-sit-nokey.png',
  './assets/art/face-snake.png',
  './assets/art/face-owl.png',
  './assets/art/chest-closed.png',
  './assets/art/chest-open.png',
  './assets/audio/amber-logic.mp3',
  './assets/audio/snake-rattle.mp3',
  './assets/audio/willow-flute.mp3',
  './assets/audio/horse-whinny.mp3',
  './assets/audio/snake-grot.m4a',
  './assets/audio/bucket-empty.m4a',
  './assets/audio/velvet-compass.mp3',


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
  './assets/art/hero-walk3.png',
  './assets/art/hero-flute.png',
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
