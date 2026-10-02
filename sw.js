const PREFIX = 'carshare-' + encodeURIComponent(self.registration.scope) + '-';
const CACHE = PREFIX + 'v20';
const urls = ["./stay.js","./controls.js","./map.js","./vendor/leaflet/leaflet.js","./vendor/leaflet/leaflet.css","./assets/cars/t-cx30.jpg","./assets/cars/m-sienta.jpg","./assets/cars/m-yaris.jpg", "./assets/cars/m-raize.jpg", "./assets/cars/m-vezel.jpg", "./assets/cars/m-harrier.jpg", "./assets/cars/m-rav4.jpg", "./assets/cars/m-forester.jpg", "./assets/cars/m-voxy.jpg", "./assets/cars/m-alphard.jpg", "./assets/cars/m-nx.jpg", "./assets/cars/t-yariscross.jpg", "./assets/cars/t-raize.jpg", "./assets/cars/t-chr.jpg", "./assets/cars/t-noah.jpg", "./assets/cars/t-aqua.jpg", "./assets/cars/t-yaris.jpg", "./assets/cars/t-note_e-power.jpg", "./assets/cars/t-solio.jpg", "./assets/cars/t-hustler.jpg", "./assets/cars/t-swift.jpg", "./assets/cars/t-sienta.jpg", "./assets/cars/t-prius.jpg"].concat(['./', './index.html', './carshare.html', './manifest.webmanifest', './pwa.js', './icons/icon-32.png', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png']);
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(urls))));
self.addEventListener('activate', event => event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(async () => {
      const cache = await caches.open(CACHE);
      return (await cache.match(event.request)) || cache.match(new URL('./index.html', self.registration.scope).href);
    }));
  } else {
    event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(event.request)) || fetch(event.request)));
  }
});



