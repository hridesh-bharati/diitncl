/* =========================
   DRISHTEE SERVICE WORKER
   CACHE + WEB PUSH
========================= */

const CACHE_NAME = "drishtee-cache-v7";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/images/icon/favicon.ico",
  "/images/icon/icon-192.png",
  "/images/icon/icon-512.png",
  "/images/icon/apple-touch-icon.png",
  "/css/utilities.css",
  "/images/logo.png"
];

/* =========================
   🔔 WEB PUSH SECTION
========================= */

self.addEventListener("push", function (event) {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: "/images/icon/icon-192.png",
    badge: "/images/icon/icon-512.png",
    data: { url: "/admin/queries" }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/admin/queries";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

/* =========================
   🗂 CACHE SYSTEM
========================= */

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match("/index.html"))
    })
  );
});