// src\services\pushService.js
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "../firebase/firebase.js";
const messaging = getMessaging(app);

export const subscribeUser = async () => {
  try {
    // Permission mangna
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.error("Permission denied for notifications");
      return null;
    }

    // FCM Token generate karna
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_PUBLIC_VAPID_KEY
    });

    if (currentToken) {
      console.log("FCM Token:", currentToken);
      return currentToken; // Ab ye ek simple string return karega
    } else {
      console.warn("No registration token available.");
      return null;
    }
  } catch (err) {
    console.error("FCM Subscription Error:", err);
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