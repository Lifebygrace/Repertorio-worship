// service-worker.js
const CACHE_NAME = 'repertorio-cache-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/logo-180.png',
  '/icons/logo-192.png',
  '/icons/logo-512.png'
];

// Instalar el service worker y cachear los archivos principales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Archivos cacheados correctamente');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Permite activar el nuevo SW sin esperar
});

// Activar el service worker y limpiar versiones antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Borrando caché antigua:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // Garantiza que el SW controle las páginas activas
});

// Interceptar peticiones y servir desde caché cuando sea posible
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request)
        .then((networkResponse) => {
          // Cachear nuevas solicitudes dinámicamente (opcional)
          if (
            event.request.url.startsWith('http') &&
            !event.request.url.includes('firebase')
          ) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});