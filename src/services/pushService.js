import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { app } from "../firebase/firebase.js";

// 1. Initialize Messaging safely
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

/**
 * 🔔 Foreground Message Listener
 * Ise function ke bahar rakha hai taaki ye sirf ek baar register ho
 * Aur humesha "Live" rahe, bilkul WhatsApp ki tarah
 */
if (messaging) {
  onMessage(messaging, async (payload) => {
    console.log('🔥 Live Foreground Payload:', payload);

    // Browser ka registration check karein
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (registration) {
      // Data extract karein (Backend se bheja gaya 'data' prioritze karein)
      const title = payload.data?.title || payload.notification?.title || "Drishtee Alert";
      const body = payload.data?.body || payload.notification?.body || "New Update Available";
      const clickUrl = payload.data?.url || "/student/dashboard";

      const notificationOptions = {
        body: body,
        icon: "/images/icon/icon-192.png",
        badge: "/images/icon/icon-192.png",
        vibrate: [300, 100, 300, 100, 400], // Professional vibration pattern
        tag: "drishtee-msg", // Purane notification ko replace karega (No flooding)
        renotify: true,      // Naye message par phone fir se vibrate karega
        requireInteraction: true, // Jab tak student swipe na kare, screen par rahega
        data: { url: clickUrl },
        actions: [
          { action: 'open', title: 'View Now' },
          { action: 'close', title: 'Dismiss' }
        ]
      };

      registration.showNotification(title, notificationOptions);
    }
  });
}

/**
 * 📲 User Subscription Function
 */
export const subscribeUser = async () => {
  try {
    if (typeof window === 'undefined' || !window.navigator) return null;

    // A. Browser Compatibility Check
    const supported = await isSupported();
    if (!supported) {
      console.warn("🚫 FCM not supported in this browser");
      return null;
    }

    if (!('serviceWorker' in navigator)) {
      console.warn("🚫 Service workers not supported");
      return null;
    }

    // B. Service Worker Registration
    let registration;
    const existingRegistrations = await navigator.serviceWorker.getRegistrations();

    if (existingRegistrations.length > 0) {
      // Pehle se registered SW use karein
      registration = existingRegistrations[0];
    } else {
      // Naya register karein
      const swPath = '/firebase-messaging-sw.js';
      registration = await navigator.serviceWorker.register(swPath);
      console.log("✅ Service Worker Registered");
    }

    // Wait for SW to be active
    await navigator.serviceWorker.ready;

    // C. Permission Request
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("❌ Notification permission denied by user");
      return null;
    }

    // D. Get & Store FCM Token
    const vapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
    if (!vapidKey) {
      console.error("❌ VAPID Key missing in .env file");
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      console.log("✅ Device Token Generated:", currentToken);
      localStorage.setItem('fcm_token', currentToken);
      return currentToken;
    }

    return null;
  } catch (err) {
    console.error("❌ FCM Subscription Error:", err);
    return null;
  }
};