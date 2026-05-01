// public\firebase-messaging-sw.js

/* =========================================
   🔥 Drishtee PWA + Firebase SW (FINAL)
========================================= */

/* 🔥 Firebase SDK */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

/* 🔥 Firebase Init */
firebase.initializeApp({
  apiKey: "AIzaSyDm15ex3UZlOTzhHALn6ukvmRO9jobM4Y8",
  authDomain: "diit-5bff0.firebaseapp.com",
  projectId: "diit-5bff0",
  storageBucket: "diit-5bff0.appspot.com",
  messagingSenderId: "55289745043",
  appId: "1:55289745043:web:7ddcb37bb1a4b4f02a4766",
});

const messaging = firebase.messaging();

/* 📦 Cache Config */
const CACHE_NAME = "drishtee-v3";

/* 🧠 Pre-cache essential assets */
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/images/icon/logo.png",
  "/images/icon/icon-192.png"
];

/* =========================================
   🚀 INSTALL (cache + activate fast)
========================================= */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

/* =========================================
   🔄 ACTIVATE (clean old cache)
========================================= */
self.addEventListener("activate", (event) => {
  const whitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!whitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

/* =========================================
   🌐 FETCH (HYBRID SMART STRATEGY)
========================================= */
self.addEventListener("fetch", (event) => {

  const req = event.request;

  // ❌ Skip non-GET requests
  if (req.method !== "GET") return;

  // ❌ Skip external requests (Firebase/CDN)
  if (!req.url.startsWith(self.location.origin)) return;

  // 🔹 1. Navigation (HTML) → Network First
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // 🔹 2. Static files → Cache First + update
  const isStatic = req.url.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff2)$/);

  if (isStatic) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const networkFetch = fetch(req)
          .then((res) => {
            const cloned = res.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, cloned);
            });
            return res;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    );
    return;
  }

  // 🔹 3. JS/CSS → Network First + cache update
  event.respondWith(
    fetch(req)
      .then(networkRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(req, networkRes.clone());
          return networkRes;
        });
      })
      .catch(() => caches.match(req))
  );
});

/* =========================================
   🔔 FCM BACKGROUND NOTIFICATION (FIXED)
========================================= */
/* =========================================
    🔔 FCM BACKGROUND NOTIFICATION (PRO)
========================================= */
messaging.onBackgroundMessage((payload) => {
  console.log('🔥 Background Payload Received:', payload);

  // ✅ App Badge API (Icon par Red Dot/Number dikhane ke liye)
  // Service Worker context mein 'self.registration' use karna best hai
  if ('setAppBadge' in self.registration) {
    self.registration.setAppBadge(1).catch((error) => {
      console.error("❌ Badge Error:", error);
    });
  }

  const title = payload.data?.title || payload.notification?.title || "Drishtee Alert";
  const body = payload.data?.body || payload.notification?.body || "New Update from DIIT";
  const clickUrl = payload.data?.url || payload.fcmOptions?.link || "/student/dashboard";

  const notificationOptions = {
    body: body,
    icon: "/images/icon/icon-192.png",
    badge: "/images/icon/icon-192.png",
    vibrate: [300, 100, 300, 100, 400],
    tag: "drishtee-msg",
    renotify: true,
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'View Now' },
      { action: 'close', title: 'Dismiss' }
    ],
    data: { url: clickUrl }
  };

  return self.registration.showNotification(title, notificationOptions);
});

/* =========================================
    🖱 NOTIFICATION CLICK HANDLING
========================================= */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // ✅ Badge clear karein jab user react kare
  if ('clearAppBadge' in self.registration) {
    self.registration.clearAppBadge().catch(console.error);
  }

  // Agar user 'close' action par click kare toh wahi ruk jaye
  if (event.action === 'close') return;

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsArr) => {
        // 1. Agar window khuli hai toh focus karo
        for (let client of clientsArr) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        // 2. Agar nahi khuli toh naya window open karo
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

