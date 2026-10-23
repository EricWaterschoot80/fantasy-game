/* Service worker — netwerk-eerst voor verse updates, cache als offline-vangnet.
   Verhoog V (en dus CACHE) bij ELKE release, gelijk aan de ?v= in index.html en assetVer
   in data.js, zodat spelers verse bestanden krijgen.
   - PRECACHE gebruikt dezelfde ?v= als de pagina, zodat elk bestand maar één keer in de cache staat.
   - Video en muziek (mp4/mp3, vaak range-verzoeken) gaan rechtstreeks naar het netwerk en
     worden NIET gecachet — dat scheelt tientallen MB opslag op de telefoon. */

const V = '208';
const CACHE = 'ravenholt-v' + V;

const PRECACHE = [
  './',
  './index.html',
  './css/style.css?v=' + V,
  './js/sprites.min.js?v=' + V,
  './js/scenes.min.js?v=' + V,
  './js/data.min.js?v=' + V,
  './js/engine.min.js?v=' + V,
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

const isMedia = (url) => /\.(mp4|mp3|m4a|webm|ogg)$/i.test(url.pathname);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.indexOf('ravenholt-') === 0 && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;   // analytics & other hosts: leave to the network
  const url = new URL(req.url);
  if (isMedia(url) || req.headers.has('range')) return;   // video/muziek: gewoon het netwerk, niet cachen
  event.respondWith(
    fetch(req)
      .then((response) => {
        if (response && response.ok && response.status === 200 &&
            (response.type === 'basic' || response.type === 'cors')) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(req)
          .then((hit) => hit || caches.match(req, { ignoreSearch: true }))
          .then((cached) => cached || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
      )
  );
});
