// Service Worker for Asset Management with Global Cache-Busting
const CACHE_VERSION = 'v3.0';
const CACHE_NAME = 'portfolio-assets-' + CACHE_VERSION;
const CRITICAL_RESOURCES = [
    'styles.css',
    'script.js',
    'cache-buster.js',
    'mmm/MMM 1.png',
    'Profile raw 4.jpg',
    'gil-cat.gif'
];

// Helper function to add cache-busting to URLs
function addCacheBust(url) {
    const timestamp = Date.now();
    const separator = url.includes('?') ? '&' : '?';
    return url + separator + 'sw_cb=' + timestamp;
}

// Install Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker installing with cache-busting...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching critical resources with cache-busting...');
                // Add cache-busting to critical resources
                const cacheBustedResources = CRITICAL_RESOURCES.map(addCacheBust);
                return cache.addAll(cacheBustedResources).catch(error => {
                    console.log('Some resources failed to cache:', error);
                    // Continue anyway - not all resources may be available
                });
            })
            .then(() => {
                console.log('Service Worker installed successfully');
                self.skipWaiting();
            })
    );
});

// Activate Service Worker with Enhanced Cache Management
self.addEventListener('activate', event => {
    console.log('Service Worker activating with cache-busting...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old cache versions
                    if (cacheName.startsWith('portfolio-') && cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker activated and old caches cleared');
            // Notify all clients to reload for fresh content
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'CACHE_UPDATED',
                        version: CACHE_VERSION
                    });
                });
            });
            return self.clients.claim();
        })
    );
});

// Enhanced Fetch Handler with Cache-Busting
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Cache-busting strategy: Network first with cache fallback
    event.respondWith(
        fetch(request)
            .then(response => {
                // Only cache successful responses
                if (response.status === 200 && request.method === 'GET') {
                    const responseClone = response.clone();
                    
                    // Cache images, CSS, and JS files
                    if (request.destination === 'image' || 
                        request.destination === 'style' || 
                        request.destination === 'script' ||
                        url.pathname.endsWith('.css') ||
                        url.pathname.endsWith('.js') ||
                        url.pathname.endsWith('.png') ||
                        url.pathname.endsWith('.jpg') ||
                        url.pathname.endsWith('.gif')) {
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Remove old cache-busted versions
                                const cleanUrl = url.origin + url.pathname;
                                cache.keys().then(keys => {
                                    keys.forEach(key => {
                                        if (key.url.startsWith(cleanUrl)) {
                                            cache.delete(key);
                                        }
                                    });
                                });
                                
                                // Cache the new version
                                cache.put(request, responseClone);
                                console.log('Cached with cache-bust:', request.url);
                            });
                    }
                }
                return response;
            })
            .catch(error => {
                console.log('Network failed, trying cache:', request.url);
                
                // Try to serve from cache
                return caches.match(request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            console.log('Serving from cache:', request.url);
                            return cachedResponse;
                        }
                        
                        // For images, return a placeholder response
                        if (request.destination === 'image') {
                            return new Response('Image unavailable offline', {
                                status: 404,
                                statusText: 'Not Found',
                                headers: { 'Content-Type': 'text/plain' }
                            });
                        }
                        
                        throw error;
                    });
            })
    );
});