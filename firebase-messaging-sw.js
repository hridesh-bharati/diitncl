/* firebase-messaging-sw.js */

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDm15ex3UZlOTzhHALn6ukvmRO9jobM4Y8",
  authDomain: "diit-5bff0.firebaseapp.com",
  projectId: "diit-5bff0",
  storageBucket: "diit-5bff0.appspot.com",
  messagingSenderId: "55289745043",
  appId: "1:55289745043:web:7ddcb37bb1a4b4f02a4766",
});

const messaging = firebase.messaging();

/* ======================================
   INSTALL
====================================== */
self.addEventListener("install", () => {
  self.skipWaiting();
});

/* ======================================
   ACTIVATE
====================================== */
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* ======================================
   BACKGROUND MESSAGE
====================================== */
messaging.onBackgroundMessage((payload) => {
  console.log("🔥 Background Message:", payload);

  const title =
    payload?.notification?.title ||
    payload?.data?.title ||
    "Drishtee Alert";

  const body =
    payload?.notification?.body ||
    payload?.data?.body ||
    "New Notification";

  const url =
    payload?.data?.url ||
    "https://www.drishteeindia.com/student/dashboard";

  const options = {
    body,
    icon: "/images/icon/icon-192.png",
    badge: "/images/icon/icon-192.png",

    vibrate: [200, 100, 200, 100, 400],

    requireInteraction: true,

    tag: "drishtee-alert",

    renotify: true,

    data: {
      url,
    },

    actions: [
      {
        action: "open",
        title: "Open App 🚀",
      },
      {
        action: "close",
        title: "Dismiss",
      },
    ],
  };

  self.registration.showNotification(title, options);
});

/* ======================================
   CLICK EVENT
====================================== */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const url =
    event.notification.data?.url ||
    "https://www.drishteeindia.com/";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((windowClients) => {

      for (const client of windowClients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});