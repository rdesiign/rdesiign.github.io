// Service Worker for Image Caching and Optimization
const CACHE_NAME = 'portfolio-images-v1';
const CRITICAL_RESOURCES = [
    'mmm/MMM 1.png',
    'Profile raw 4.jpg',
    'gil-cat.gif'
];

// Install Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching critical resources...');
                return cache.addAll(CRITICAL_RESOURCES);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Handler with Image Optimization
self.addEventListener('fetch', event => {
    const request = event.request;
    
    // Only handle image requests
    if (request.destination === 'image') {
        event.respondWith(
            caches.match(request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        console.log('Serving from cache:', request.url);
                        return cachedResponse;
                    }
                    
                    // Fetch and cache the image
                    return fetch(request)
                        .then(response => {
                            // Only cache successful responses
                            if (response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => {
                                        cache.put(request, responseClone);
                                    });
                            }
                            return response;
                        })
                        .catch(error => {
                            console.error('Fetch failed:', error);
                            // Return a placeholder image or empty response
                            return new Response('Image failed to load', { 
                                status: 404,
                                statusText: 'Not Found'
                            });
                        });
                })
        );
    }
    
    // For non-image requests, use network first strategy
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    );
});