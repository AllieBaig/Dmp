const CACHE_NAME = 'dual-music-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  './index.html',
  './offline.html',
  './script.js',
  './playlist.js',
  './badges.js',
  './auth.js',
  './manifest.json',
  // Note: skipping /white_noise.mp3 from install cache; can be cached on-demand
];

// Install event - cache static assets and offline fallback page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch event - respond with cached assets or fetch from network, fallback to offline page
self.addEventListener('fetch', (event) => {
  // Handle only GET requests to avoid interfering with POST, etc.
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset
        return cachedResponse;
      }
      // Attempt network fetch and cache it for future
      return fetch(event.request).then((networkResponse) => {
        // Optionally cache media or dynamic content here (skip for large audio for now)
        if (
          event.request.url.startsWith(self.location.origin) &&
          event.request.destination !== 'audio'
        ) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback handling
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
        // Optionally return fallback for images, audio, etc.
        if (event.request.destination === 'image') {
          // Return a placeholder image from cache or data URI here if available
          return new Response('', { status: 404, statusText: 'Offline' });
        }
        if (event.request.destination === 'audio') {
          // Return a silent short audio or similar fallback if desired
          return new Response('', { status: 404, statusText: 'Offline' });
        }
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' },
        });
      });
    }).catch((error) => {
      console.error('Fetch failed:', error);
      return caches.match('/offline.html');
    })
  );
});
