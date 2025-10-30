// public/sw.js
const CACHE = "miniverbe-v1";

// Take control immediately
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Runtime cache: network-first, fall back to cache (same-origin GETs)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
        return res;
      } catch (_) {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(req);
        if (cached) return cached;

        // Offline fallback: serve shell if index requested
        if (req.mode === "navigate") {
          return cache.match("/miniverbe/index.html") || cache.match("/index.html");
        }
        throw _;
      }
    })()
  );
});
