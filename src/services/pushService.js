// import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
// import { app } from "../firebase/firebase.js";

// /**
//  * 🛠️ Utility to safely get the Messaging instance
//  * This prevents the "addEventListener" undefined error.
//  */
// const getSafeMessaging = async () => {
//   try {
//     const supported = await isSupported();
//     if (!supported) {
//       console.warn("FCM is not supported in this environment (Check HTTPS or Incognito).");
//       return null;
//     }
//     return getMessaging(app);
//   } catch (err) {
//     return null;
//   }
// };

// /**
//  * 🔔 Foreground Listener
//  * This is now wrapped in a function so it doesn't crash on load.
//  */
// export const initForegroundListener = async () => {
//   const messaging = await getSafeMessaging();
//   if (!messaging) return;

//   onMessage(messaging, async (payload) => {
//     console.log('🔥 Live Foreground Payload:', payload);

//     const registration = await navigator.serviceWorker.getRegistration();
//     if (registration) {
//       const title = payload.data?.title || payload.notification?.title || "Drishtee Alert";
//       const body = payload.data?.body || payload.notification?.body || "New Update Available";
//       const clickUrl = payload.data?.url || "/student/dashboard";

//       const notificationOptions = {
//         body: body,
//         icon: "/images/icon/icon-192.png",
//         badge: "/images/icon/icon-192.png",
//         vibrate: [300, 100, 300, 100, 400],
//         tag: "drishtee-msg",
//         renotify: true,
//         requireInteraction: true,
//         data: { url: clickUrl },
//         actions: [
//           { action: 'open', title: 'View Now' },
//           { action: 'close', title: 'Dismiss' }
//         ]
//       };

//       registration.showNotification(title, notificationOptions);
//     }
//   });
// };

// /**
//  * 📲 User Subscription Function
//  */
// export const subscribeUser = async () => {
//   try {
//     if (typeof window === 'undefined' || !window.navigator) return null;

//     // 1. Check support and get messaging instance
//     const messaging = await getSafeMessaging();
//     if (!messaging) {
//       console.error("🚫 FCM not supported/initialized");
//       return null;
//     }

//     // 2. Service Worker Registration
//     let registration = await navigator.serviceWorker.getRegistration();
    
//     if (!registration) {
//       console.log("Registering new service worker...");
//       registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
//     }

//     await navigator.serviceWorker.ready;

//     // 3. Permission Request
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       console.error("❌ Notification permission denied");
//       return null;
//     }

//     // 4. Get FCM Token
//     const vapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
//     if (!vapidKey) {
//       console.error("❌ VAPID Key missing in .env");
//       return null;
//     }

//     const currentToken = await getToken(messaging, {
//       vapidKey: vapidKey,
//       serviceWorkerRegistration: registration,
//     });

//     if (currentToken) {
//       console.log("✅ Device Token:", currentToken);
//       localStorage.setItem('fcm_token', currentToken);
//       return currentToken;
//     }

//     return null;
//   } catch (err) {
//     console.error("❌ FCM Subscription Error:", err);
//     return null;
//   }
// };

import {
  getMessaging,
  getToken,
  onMessage,
  isSupported
} from "firebase/messaging";

import { app } from "../firebase/firebase";

const VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;

/* =====================================================
   GET TOKEN
===================================================== */
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

/* =====================================================
   FOREGROUND LISTENER
===================================================== */
export const listenForegroundMessages = () => {
  try {
    const messaging = getMessaging(app);

    onMessage(messaging, (payload) => {
      console.log("🔥 Foreground Notification:", payload);

      const title =
        payload?.notification?.title ||
        payload?.data?.title ||
        "Drishtee Alert";

      const body =
        payload?.notification?.body ||
        payload?.data?.body ||
        "New Message";

      const url =
        payload?.data?.url ||
        "https://www.drishteeindia.com";

      /* Browser Notification */
      if (Notification.permission === "granted") {
        const notification = new Notification(title, {
          body,
          icon: "/images/icon/icon-192.png",
        });

        notification.onclick = () => {
          window.open(url, "_blank");
        };
      }

      /* Sound */
      new Audio("/audio/ring.mp3")
        .play()
        .catch(() => {});
    });

  } catch (err) {
    console.error(err);
  }
};