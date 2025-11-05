const CACHE_NAME = "repertorio-worship-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./logo.jpeg",
  "./manifest.json"
];

// Instala el Service Worker y guarda archivos en caché
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activa el Service Worker y limpia versiones antiguas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
});

// Intercepta las peticiones: usa caché si no hay conexión
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request).catch(() => caches.match("./index.html"))
    )
  );
});