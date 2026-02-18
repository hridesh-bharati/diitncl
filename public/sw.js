/* =========================
   DRISHTEE SERVICE WORKER
   CACHE + FCM SUPPORT
========================= */

const CACHE_NAME = "drishtee-cache-v5";

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
   🔥 FIREBASE FCM SECTION
========================= */

importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDm15ex3UZlOTzhHALn6ukvmRO9jobM4Y8",
  authDomain: "diit-5bff0.firebaseapp.com",
  projectId: "diit-5bff0",
  messagingSenderId: "55289745043",
  appId: "1:55289745043:web:7ddcb37bb1a4b4f02a4766",
});

const messaging = firebase.messaging();

/* Background FCM Notification */
messaging.onBackgroundMessage((payload) => {
  console.log("[FCM] Background message:", payload);

  const notificationTitle = payload.notification?.title || "Drishtee Update";
  const notificationOptions = {
    body: payload.notification?.body || "New update received",
    icon: "/images/icon/icon-192.png",
    badge: "/images/icon/icon-512.png",
    data: {
      url: payload?.fcmOptions?.link || "/admin"
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

/* Click → Open Admin Panel */
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/admin";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
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
   🗂 CACHE SYSTEM (UNCHANGED LOGIC)
========================= */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS)
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
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
        .catch(() => caches.match("/index.html"));
    })
  );
});
