// src/services/foregroundNotification.js

import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import { app } from "../firebase/firebase";

export const initForegroundNotifications = async () => {
  try {
    const supported = await isSupported();

    if (!supported) {
      console.log("❌ FCM not supported");
      return;
    }

    const messaging = getMessaging(app);

    onMessage(messaging, (payload) => {
      console.log("🔥 FOREGROUND MESSAGE:", payload);

      const title =
        payload?.notification?.title ||
        payload?.data?.title ||
        "Drishtee Alert";

      const body =
        payload?.notification?.body ||
        payload?.data?.body ||
        "New Notification";

      const url =
        payload?.data?.url ||
        "https://www.drishteeindia.com/admin";

      /* ======================================
         SYSTEM NOTIFICATION
      ====================================== */
      if (Notification.permission === "granted") {
        const notification = new Notification(title, {
          body,
          icon: "/images/icon/icon-192.png",
          badge: "/images/icon/icon-192.png",
          vibrate: [200, 100, 200],
          requireInteraction: true,
        });

        notification.onclick = () => {
          window.focus();
          window.location.href = url;
        };
      }

      /* ======================================
         SOUND
      ====================================== */
      new Audio("/audio/ring.mp3")
        .play()
        .catch(() => {});
    });

  } catch (err) {
    console.error("❌ Foreground FCM Error:", err);
  }
};