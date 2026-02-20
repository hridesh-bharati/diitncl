const CACHE_NAME = "drishtee-cache-v7";

self.addEventListener("push", function (event) {
  if (!event.data) return;

  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/images/icon/icon-192.png",
    badge: "/images/icon/icon-512.png",
    data: { url: "/admin/queries" }
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/admin/queries";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url.includes(targetUrl)) return client.focus();
      }
      return clients.openWindow(targetUrl);
    })
  );
});