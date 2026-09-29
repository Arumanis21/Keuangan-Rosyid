const CACHE_NAME = 'keuangan-rosyid-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://jsdelivr.net'
];

// Tahap Instalasi Service Worker dan Caching Aset Utama
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Aktivasi dan Pembersihan Cache Lama Jika Ada Pembaruan Versi
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategi Strategis Fetching Data agar Aplikasi Terasa Instan
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Ambil dari cache untuk kecepatan, namun tetap fetch ke jaringan di latar belakang untuk update terbaru
        fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        }).catch(() => { /* Abaikan jika offline */ });
        
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
