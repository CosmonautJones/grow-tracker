// Service Worker — Grow Tracker offline support
const CACHE_VERSION = 'grow-tracker-v1';

// App shell files to pre-cache
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './js/app.js',
  './js/firebase.js',
  './js/router.js',
  './js/store.js',
  './js/migrate.js',
  './js/utils.js',
  './js/export-import.js',
  './js/views/dashboard.js',
  './js/views/setup-wizard.js',
  './js/views/grow-detail.js',
  './js/views/notes.js',
  './js/views/gallery.js',
  './js/views/guides.js',
  './js/views/environment.js',
  './js/components/header.js',
  './js/components/nutrient-calculator.js',
  './js/components/checklist.js',
  './js/components/photo-upload.js',
  './js/data/nutrient-schedules.js',
  './js/data/cultivation-guides.js',
  './js/data/env-ranges.js',
  './js/data/weekly-checklists.js',
  './js/data/grow-stages.js'
];

// CDN resources to cache on first load
const CDN_URLS = [
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.1.0/dist/chartjs-plugin-annotation.min.js'
];

// Install — pre-cache app shell + CDN scripts
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async (cache) => {
      await cache.addAll(APP_SHELL);
      // Cache CDN separately (cross-origin)
      for (const url of CDN_URLS) {
        try {
          const response = await fetch(url, { mode: 'cors' });
          if (response.ok) await cache.put(url, response);
        } catch (e) {
          console.warn('SW: Failed to cache CDN resource:', url);
        }
      }
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Firebase API calls — network-first
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('firebaseinstallations') ||
      url.hostname.includes('identitytoolkit')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Firebase SDK from gstatic — cache-first with network update
  if (url.hostname.includes('gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // CDN resources — cache-first
  if (url.hostname.includes('cdn.jsdelivr.net')) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        }
        return response;
      }))
    );
    return;
  }

  // App shell — cache-first for same-origin
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => {
          // Navigation fallback — serve cached index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
    return;
  }
});
