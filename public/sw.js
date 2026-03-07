// Service Worker Version - इसे हर अपडेट में बदलें
const CACHE_VERSION = 'v7';
const CACHE_NAME = `drishtee-cache-${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `drishtee-static-${CACHE_VERSION}`;
const IMAGES_CACHE_NAME = `drishtee-images-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/images/icon/icon-192.png',
  '/images/icon/icon-512.png'
];

// Install Event
self.addEventListener('install', (event) => {
  console.log(`[Service Worker] Installing version ${CACHE_VERSION}`);
  
  // Force waiting service worker to become active
  self.skipWaiting();
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch(error => {
          console.warn('[Service Worker] Static caching error:', error);
          // Continue even if some assets fail
          return Promise.resolve();
        });
      }),
      // Cache images
      caches.open(IMAGES_CACHE_NAME).then((cache) => {
        console.log('[Service Worker] Setting up images cache');
        return Promise.resolve();
      })
    ])
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log(`[Service Worker] Activating version ${CACHE_VERSION}`);
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== IMAGES_CACHE_NAME &&
              cacheName.startsWith('drishtee-')
            ) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim clients immediately
      self.clients.claim()
    ]).then(() => {
      console.log('[Service Worker] Activated successfully');
      
      // Notify all clients about the update
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION
          });
        });
      });
    })
  );
});

// Fetch Event - Smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and non-GET
  if (!url.origin.startsWith(self.location.origin) || request.method !== 'GET') {
    return;
  }

  // Skip browser extensions
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
    // Images strategy: Cache First
    event.respondWith(handleImageRequest(request));
  } else if (url.pathname.match(/\.(js|css)$/i)) {
    // Static resources: Stale While Revalidate
    event.respondWith(handleStaticRequest(request));
  } else if (request.mode === 'navigate') {
    // HTML pages: Network First with fallback
    event.respondWith(handleNavigationRequest(request));
  } else {
    // Default: Network First
    event.respondWith(handleDefaultRequest(request));
  }
});

// Image request handler
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGES_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Return cached image and update in background
    fetch(request).then(response => {
      if (response && response.ok) {
        cache.put(request, response);
      }
    }).catch(() => {});
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[Service Worker] Image fetch failed:', request.url);
    return new Response('Image offline', { status: 408 });
  }
}

// Static request handler (JS, CSS)
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Return cached and update
    fetch(request).then(response => {
      if (response && response.ok) {
        cache.put(request, response);
      }
    }).catch(() => {});
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[Service Worker] Static fetch failed:', request.url);
    return new Response('Resource offline', { status: 408 });
  }
}

// Navigation request handler
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache the HTML response
    if (response && response.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[Service Worker] Network failed, using cache for:', request.url);
    
    // Try to get from cache
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match('/offline.html');
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Last resort: return offline page from install cache
    return caches.match('/offline.html');
  }
}

// Default request handler
async function handleDefaultRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 408 });
  }
}

// Push Event - Notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  if (!event.data) {
    console.log('[Service Worker] Push received but no data');
    return;
  }

  try {
    const data = event.data.json();
    
    const title = data.title || 'Drishtee Computer Center';
    const options = {
      body: data.body || 'New notification from Drishtee',
      icon: data.icon || '/images/icon/icon-192.png',
      badge: '/images/icon/icon-192.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/',
        timestamp: Date.now(),
        ...data.data
      },
      actions: [
        { action: 'open', title: 'Open App' },
        { action: 'close', title: 'Close' }
      ],
      requireInteraction: true,
      silent: false,
      tag: `drishtee-${Date.now()}`
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error('[Service Worker] Push error:', error);
    
    // Fallback for plain text
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('Drishtee Computer Center', {
        body: text.substring(0, 100),
        icon: '/images/icon/icon-192.png'
      })
    );
  }
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      // Try to focus existing window
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Message Event - Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_UPDATES') {
    event.waitUntil(
      self.registration.update().then(() => {
        event.source.postMessage({
          type: 'UPDATES_CHECKED',
          version: CACHE_VERSION
        });
      })
    );
  }
});

// Sync Event - Background sync
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[Service Worker] Syncing data...');
  // Add your background sync logic here
  return Promise.resolve();
}