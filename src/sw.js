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