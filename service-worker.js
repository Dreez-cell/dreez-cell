const CACHE_NAME = 'testagram-cache-v2';

// Files & routes to cache
const urlsToCache = [
  '/',                           // homepage
  '/favicon.ico',                // favicon
  '/manifest.json',              // manifest
  '/IMG_20250820_144445_(512_x_512_pixel).jpg', // app icon
  'https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate (cleanup old caches)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Fetch: Cache-first with network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        })
      );
    })
  );
});
