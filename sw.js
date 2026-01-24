const CACHE_NAME = 'portfolio-cache-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/MMM.html',
  '/Semi.html',
  '/styles.css',
  '/script.js',
  // Critical assets with versioning
  'Assets/Profile raw 4.jpg?v=1.0',
  'Assets/master-logo.png?v=1.0',
  'Projects/MMM/MMM8.png?v=1.0',
  'Projects/MMM/MMM1.png?v=1.0',
  'Projects/Semi/Semi Thumbnail.png?v=1.0'
];

// Install event - cache core assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', function(event) {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a stream
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});