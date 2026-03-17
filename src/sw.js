
import { precacheAndRoute } from 'workbox-precaching';
precacheAndRoute(self.__WB_MANIFEST);


self.addEventListener('push', (event) => {
  let data = { title: 'Drishtee Alert', body: 'Update from Centre' };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.log('Push data is not JSON, using text:', event.data.text());
    data = { title: 'Drishtee Alert', body: event.data.text() };
  }

  const options = {
    body: data.body,
    icon: '/images/icon/icon-192.png',
    badge: '/images/icon/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});



// 🔥 2. Notification CLICK ka Logic (Naya Add kiya hai)
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Notification ko band karo

  // API se jo URL aaya tha use pakdo
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Agar pehle se koi tab khula hai toh wahi le jao
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Warna naya tab kholo
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});