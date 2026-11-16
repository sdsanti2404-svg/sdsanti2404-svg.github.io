const CACHE = 'finanzas-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './fonts/caveat-500.woff2',
  './fonts/dmsans-400.woff2',
  './fonts/dmsans-500.woff2',
  './fonts/dmsans-600.woff2',
  './fonts/dmsans-700.woff2',
  './fonts/jakarta-400.woff2',
  './fonts/jakarta-500.woff2',
  './fonts/jakarta-600.woff2',
  './fonts/jakarta-700.woff2',
  './fonts/manrope-400.woff2',
  './fonts/manrope-500.woff2',
  './fonts/manrope-600.woff2',
  './fonts/manrope-700.woff2',
  './fonts/manrope-800.woff2',
  './fonts/outfit-400.woff2',
  './fonts/outfit-500.woff2',
  './fonts/outfit-600.woff2',
  './fonts/outfit-700.woff2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-first; si hay red, actualiza la caché en segundo plano.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((cached) => {
      const net = fetch(e.request)
        .then((res) => {
          if (res && res.ok && new URL(e.request.url).origin === location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match('./index.html'));
      return cached || net;
    })
  );
});
