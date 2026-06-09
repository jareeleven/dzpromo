// ============================================
//   DZ PROMO — Service Worker (sw.js)
//   Enables offline support + PWA caching
// ============================================

const CACHE_NAME = 'dzpromo-v1.0.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/app.css',
  '/js/data.js',
  '/js/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css'
];

// ---- INSTALL: cache all static assets ----
self.addEventListener('install', (event) => {
  console.log('[SW] Installing DZ Promo Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { mode: 'no-cors' })))
        .catch(err => console.log('[SW] Some assets failed to cache:', err));
    })
  );
  self.skipWaiting();
});

// ---- ACTIVATE: clean old caches ----
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating DZ Promo Service Worker...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// ---- FETCH: cache-first strategy for static, network-first for API ----
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') return;

  // API calls: network-first, fallback to cache
  if (url.hostname.includes('supabase') || url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets: cache-first, fallback to network
  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Return offline page if HTML
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/index.html');
    }
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ error: 'Offline' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503
    });
  }
}

// ---- PUSH NOTIFICATIONS ----
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Nouvelle promotion disponible !',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'view', title: 'Voir l\'offre' },
      { action: 'dismiss', title: 'Ignorer' }
    ]
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'DZ Promo 🏷️', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
  }
});
