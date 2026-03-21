// src\services\pushService.js
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "../firebase/firebase.js";

export const subscribeUser = async () => {
  try {
    const supported = await isSupported();

    if (!supported) {
      console.warn("🚫 FCM not supported in this browser");
      return null;
    }

    const messaging = getMessaging(app); 

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Notification permission denied");
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_PUBLIC_VAPID_KEY,
    });

    if (currentToken) {
      console.log("✅ FCM Token:", currentToken);
      return currentToken;
    } else {
      console.warn("⚠ No token found");
      return null;
    }
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