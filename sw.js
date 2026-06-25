// ============================================================
// sw.js — VictorOS Service Worker
// Handles: offline caching
// ============================================================

const CACHE_NAME = 'victoros-v5';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/notes.js',
  '/github.js',
  '/codeworkspace.js',
  '/data/roadmap.js',
  '/data/week1.js',
  '/data/week2.js',
  '/data/week3.js',
  '/data/week4.js',
  '/data/week5.js',
  '/data/week6.js',
  '/data/week7.js',
  '/data/week8.js',
  '/data/week9.js',
  '/data/week10.js',
  '/data/week11.js',
  '/data/week12.js',
  '/data/week13.js',
  '/data/week14.js',
  '/data/week15.js',
  '/data/week16.js',
  '/data/week17.js',
  '/data/week18.js',
  '/data/week19.js',
  '/data/week20.js',
  '/data/phase2-resources.js',
  '/manifest.json',
];

// ─── INSTALL: cache all static assets ───
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ─── ACTIVATE: clear old caches ───
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ─── FETCH: serve from cache, fallback to network ───
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache new successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback for navigation
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
