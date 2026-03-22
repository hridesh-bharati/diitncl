// src\services\pushService.js
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { app } from "../firebase/firebase.js";

// Is function ko hum tabhi call karenge jab browser ready ho
export const subscribeUser = async () => {
  try {
    if (typeof window === 'undefined' || !window.navigator) return null;

    // 1. Sabse pehle support check karein
    const supported = await isSupported();
    if (!supported) {
      console.warn("🚫 FCM not supported in this browser");
      return null;
    }

    // 2. Messaging ko sirf tabhi initialize karein jab support confirm ho
    const messaging = getMessaging(app);

    if (!('serviceWorker' in navigator)) {
      console.warn("🚫 Service workers not supported");
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

    // 3. Foreground Message Handler (Isse function ke andar hi set kar dete hain)
    onMessage(messaging, (payload) => {
      console.log('🔔 Foreground message received:', payload);
      const notificationTitle = payload.notification?.title || "Drishtee Alert";
      const notificationOptions = {
        body: payload.notification?.body || "New Update Available",
        icon: '/images/icon/icon-192.png',
        badge: '/images/icon/icon-192.png',
      };
      new Notification(notificationTitle, notificationOptions);
    });

    // 4. Get FCM Token
    const vapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
    if (!vapidKey) {
        console.error("❌ VAPID Key missing in .env");
        return null;
    }

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