const CACHE_NAME = 'bhajan-sandhya-v1.1';  // Bump version monthly
const BHajan_DB_NAME = 'BhajanDB';
const BHajan_STORE_NAME = 'bhajans';

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/allbhajans.html',
                '/upcomingBhajans.html',
                '/contact.html',
                '/bhajan.html',
                '/styles.css',
                '/script.js',
                '/bhajans.js',
                '/img/logo.png',
                '/img/harmonium.png',
                '/img/google-maps.png'
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
    // Delete old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(handleFetch(event.request));
});

async function handleFetch(request) {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    // Try network, fallback to cache
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch {
        // Offline fallback
        if (request.destination === 'image') {
            return new Response('Offline', { status: 503 });
        }
        return caches.match(request);
    }
}
