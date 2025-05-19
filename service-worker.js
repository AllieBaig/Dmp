const CACHE_NAME = 'dual-music-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './script.js',
  './badges.js',
  './icon.png',
  './white_noise.mp3',
  './manifest.json',
];

// Install: Cache essential assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Serve from cache or network fallback
self.addEventListener('fetch', event => {
  const { request } = event;

  // Bypass non-GET requests
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) {
          return cached;
        }

        return fetch(request)
          .then(response => {
            // Optionally cache new requests
            const cloned = response.clone();

            // Only cache if it's a valid response from same-origin
            if (
              response.status === 200 &&
              request.url.startsWith(self.location.origin)
            ) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, cloned);
              });
            }

            return response;
          })
          .catch(() => {
            // Optionally return offline fallback for certain requests
            if (request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

