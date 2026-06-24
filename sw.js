// ============================================================
// sw.js — VictorOS Service Worker
// Handles: offline caching + push notifications
// ============================================================

const CACHE_NAME = 'victoros-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/notifications.js',
  '/notes.js',
  '/github.js',
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

// ─── PUSH: receive notification from server ───
self.addEventListener('push', event => {
  let data = {
    title: '📚 VictorOS — Study Time',
    body: "Today's lesson is waiting. Keep the streak alive! 🔥",
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: 'victoros-daily',        // replaces old notification
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: data.url || '/' },
      actions: [
        { action: 'open', title: '📖 Open App' },
        { action: 'dismiss', title: 'Later' }
      ]
    })
  );
});

// ─── NOTIFICATION CLICK: open or focus the app ───
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // If app already open — focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// ─── MESSAGE: triggered from app to schedule local notification ───
// Used as fallback when no push server is available
self.addEventListener('message', event => {
  if (event.data?.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delay } = event.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/icons/icon-192.png',
        tag: 'victoros-daily',
        vibrate: [200, 100, 200],
      });
    }, delay || 0);
  }
});
