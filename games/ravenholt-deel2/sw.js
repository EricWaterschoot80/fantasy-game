/* Service worker — netwerk-eerst voor verse updates, cache als offline-vangnet.
   Verhoog CACHE ('ravenholt2-vN') bij ELKE release zodat spelers verse bestanden krijgen.
   Voeg je eigen assets/art/*.png en assets/icons/*.png toe aan PRECACHE als je ze
   offline beschikbaar wilt hebben (optioneel — niet-vermelde bestanden worden bij
   eerste gebruik alsnog gecachet). */

const CACHE = 'ravenholt2-v209';

const PRECACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/sprites.min.js',
  './js/scenes.min.js',
  './js/data.min.js',
  './js/engine.min.js',
  './manifest.webmanifest',
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
      .then((keys) => Promise.all(keys.filter((k) => k.indexOf('ravenholt2-') === 0 && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Muziek en video's NIET in de cache: die zijn groot, worden met range-verzoeken gestreamd
   en zouden de opslag van de telefoon vullen. De browser haalt ze gewoon zelf op. */
const NO_CACHE = /\.(mp3|mp4|m4a|webm|ogg)(\?|$)/i;

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== self.location.origin) return;   // analytics & other hosts: leave to the network
  if (NO_CACHE.test(event.request.url) || event.request.headers.has('range')) return;
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
