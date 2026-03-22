// src\services\pushService.js
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { app } from "../firebase/firebase.js";

const messaging = getMessaging(app);

// 1. Subscribe User (Token Generation)
export const subscribeUser = async () => {
  try {
    if (typeof window === 'undefined' || !window.navigator) return null;

    if (!('serviceWorker' in navigator)) {
      console.warn("🚫 Service workers not supported");
      return null;
    }

    const supported = await isSupported();
    if (!supported) {
      console.warn("🚫 FCM not supported");
      return null;
    }

    // Service Worker Registration
    let registration;
    const existingRegistrations = await navigator.serviceWorker.getRegistrations();

    if (existingRegistrations.length > 0) {
      registration = existingRegistrations[0];
    } else {
      const swPath = '/firebase-messaging-sw.js';
      registration = await navigator.serviceWorker.register(swPath);
    }

    await navigator.serviceWorker.ready;

    // Permission check
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Notification permission denied");
      return null;
    }

    // Get FCM Token
    const vapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      console.log("✅ FCM Token:", currentToken);
      localStorage.setItem('fcm_token', currentToken);
      return currentToken;
    }
    return null;
  } catch (err) {
    console.error("❌ FCM Error:", err);
    return null;
  }
};

// 2. Foreground Message Handler (Jab website khuli ho tab popup dikhane ke liye)
onMessage(messaging, (payload) => {
  console.log('🔔 Foreground message received:', payload);
  
  const notificationTitle = payload.notification?.title || "Drishtee Alert";
  const notificationOptions = {
    body: payload.notification?.body || "New Update Available",
    icon: '/images/icon/icon-192.png', // Check karein ye image public folder mein hai
    badge: '/images/icon/icon-192.png',
  };

  // Browser popup trigger
  if (Notification.permission === "granted") {
    new Notification(notificationTitle, notificationOptions);
  }
});

/**
 * Helper Function: VAPID key string ko Uint8Array mein convert karne ke liye
 * (Ye browser requirements ke liye zaroori hai)
 */
// function urlBase64ToUint8Array(base64String) {
//   const padding = '='.repeat((4 - base64String.length % 4) % 4);
//   const base64 = (base64String + padding)
//     .replace(/-/g, '+')
//     .replace(/_/g, '/');

//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }