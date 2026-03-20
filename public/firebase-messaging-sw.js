// public\firebase-messaging-sw.js
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


/* 🚀 Instant Update */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});


/* 🔥 Background Notification (MAIN) */
messaging.onBackgroundMessage((payload) => {
  console.log("📩 FCM Background:", payload);

  const title = payload.notification?.title || "Drishtee Alert";

  const options = {
    body: payload.notification?.body || "New update",
    icon: "/logo.png",
    badge: "/images/icon/icon-192.png",
    vibrate: [200, 100, 200],

    data: {
      url: payload.data?.url || "/"
    }
  };

  self.registration.showNotification(title, options);
});


/* 🔥 Click Handling */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (let client of clientsArr) {
        if (client.url.includes(urlToOpen) && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(urlToOpen);
    })
  );
});

