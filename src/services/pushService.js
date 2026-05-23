// src/services/pushService.js

import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "../firebase/firebase";

const VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;

export const subscribeUser = async () => {
  try {
    const supported = await isSupported();

    if (!supported) {
      console.log("❌ FCM not supported");
      return null;
    }

    let permission = Notification.permission;

    if (permission !== "granted") {
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") {
      console.log("❌ Notification permission denied");
      return null;
    }

    const registration = await navigator.serviceWorker.ready;

    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("✅ FCM TOKEN:", token);

    return token;

  } catch (error) {
    console.error("❌ Token Error:", error);
    return null;
  }
};