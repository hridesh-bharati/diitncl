// src\services\pushService.js

// src/services/pushService.js
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "../firebase/firebase.js";

export const subscribeUser = async () => {
  try {
    // Check if we're in browser
    if (typeof window === 'undefined' || !window.navigator) {
      console.warn("🚫 Not in browser");
      return null;
    }

    // Check service worker support
    if (!('serviceWorker' in navigator)) {
      console.warn("🚫 Service workers not supported");
      return null;
    }

    // Check FCM support
    const supported = await isSupported();
    if (!supported) {
      console.warn("🚫 FCM not supported in this browser");
      return null;
    }

    // 1. Check if service worker already exists
    let registration;
    const existingRegistrations = await navigator.serviceWorker.getRegistrations();

    if (existingRegistrations.length > 0) {
      registration = existingRegistrations[0];
      console.log("✅ Using existing service worker");
    } else {
      // Register service worker with proper path
      const swPath = '/firebase-messaging-sw.js';
      console.log("📝 Registering service worker from:", swPath);

      // Check if service worker file exists
      const swResponse = await fetch(swPath);
      if (!swResponse.ok) {
        throw new Error(`Service worker not found at ${swPath} (status: ${swResponse.status})`);
      }

      registration = await navigator.serviceWorker.register(swPath);
      console.log("✅ Service worker registered");
    }

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;

    const messaging = getMessaging(app);

    // 2. Permission check
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Notification permission denied");
      return null;
    }

    // 3. Check VAPID key
    const vapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
    if (!vapidKey) {
      console.error("❌ VAPID key not found in environment variables");
      return null;
    }
    console.log("🔑 VAPID key exists");

    // 4. Generate token
    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      console.log("✅ FCM Token:", currentToken);
      // Store token for debugging
      localStorage.setItem('fcm_token', currentToken);
      return currentToken;
    } else {
      console.warn("⚠ No token found");
      return null;
    }
  } catch (err) {
    console.error("❌ FCM Error:", err);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      code: err.code
    });
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