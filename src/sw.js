import { precacheAndRoute } from 'workbox-precaching';

// Vite PWA plugin yahan apne assets inject karega
precacheAndRoute(self.__WB_MANIFEST);

// 🔥 Push Notification Listener
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'DIIT Alert', body: 'New Update!' };
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/images/icon/icon-192.png',
      badge: '/images/icon/icon-192.png',
      vibrate: [200, 100, 200]
    })
  );
});