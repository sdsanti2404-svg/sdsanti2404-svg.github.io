const CACHE = 'finanzas-v10';
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

// Página: primero la red (siempre la versión más nueva); sin conexión, la copia guardada.
// Resto de archivos (fuentes, íconos): primero la copia guardada, actualizándola en segundo plano.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  const isPage = e.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html') || url.pathname.endsWith('sw.js') || url.pathname.endsWith('manifest.json');
  if (isPage) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then((res) => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then((k) => k.put(e.request, c)); } return res; })
        .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((cached) => {
      const net = fetch(e.request).then((res) => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then((k) => k.put(e.request, c)); } return res; }).catch(() => cached);
      return cached || net;
    })
  );
});
