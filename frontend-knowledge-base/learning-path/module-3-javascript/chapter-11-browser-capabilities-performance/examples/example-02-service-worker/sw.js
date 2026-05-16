/**
 * sw.js — Service Worker script.
 *
 * Demonstrates:
 *  - Install event: pre-cache static assets
 *  - Activate event: delete stale caches
 *  - Fetch event: Cache-First strategy for static assets,
 *                  Network-First strategy for API calls
 *  - Message event: receive commands from the page
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME    = `app-cache-${CACHE_VERSION}`;

// Assets to pre-cache during install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './main.js',
  // A public JSON API response we want to cache for offline use
  'https://jsonplaceholder.typicode.com/todos/1',
];

// ─── INSTALL ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Install event — caching assets');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => {
        // Broadcast to all clients that install completed
        self.clients.matchAll().then((clients) =>
          clients.forEach((client) =>
            client.postMessage({ type: 'SW_INSTALLED', version: CACHE_VERSION })
          )
        );
      })
  );

  // Skip the waiting phase — become active immediately
  self.skipWaiting();
});

// ─── ACTIVATE ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event — cleaning old caches');

  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
        )
      )
      .then(() => {
        // Take control of all open tabs immediately
        self.clients.claim();

        self.clients.matchAll().then((clients) =>
          clients.forEach((client) =>
            client.postMessage({ type: 'SW_ACTIVATED', version: CACHE_VERSION })
          )
        );
      })
  );
});

// ─── FETCH ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strategy 1: Network First — for API calls
  if (url.hostname === 'jsonplaceholder.typicode.com') {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Strategy 2: Cache First — for everything else (static assets)
  event.respondWith(cacheFirst(event.request));
});

// Cache-First strategy
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    console.log('[SW] Cache HIT:', request.url);
    return cached;
  }

  console.log('[SW] Cache MISS — fetching:', request.url);
  try {
    const response = await fetch(request);
    // Cache successful GET responses
    if (request.method === 'GET' && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline — resource not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// Network-First strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (request.method === 'GET' && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      console.log('[SW] Network response cached:', request.url);
    }
    return response;
  } catch {
    console.log('[SW] Network failed — serving from cache:', request.url);
    const cached = await caches.match(request);
    return (
      cached ||
      new Response(JSON.stringify({ error: 'Offline', cached: false }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }
}

// ─── MESSAGE ──────────────────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING — activating new SW');
    self.skipWaiting();
  }

  if (event.data?.type === 'GET_CACHE_KEYS') {
    caches.open(CACHE_NAME).then((cache) =>
      cache.keys().then((requests) => {
        const urls = requests.map((r) => r.url);
        event.source.postMessage({ type: 'CACHE_KEYS', urls });
      })
    );
  }

  if (event.data?.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.source.postMessage({ type: 'CACHE_CLEARED' });
    });
  }
});
