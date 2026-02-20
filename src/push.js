import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase/firebase";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const registerPush = async () => {
  try {
    console.log('🔔 Setting up push notifications...');

    // Check if push is supported
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.log("❌ Push notifications not supported");
      return false;
    }

    // Get VAPID public key from environment
    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      console.error("❌ VAPID public key not found in environment");
      console.log("📝 Make sure VITE_VAPID_PUBLIC_KEY is set in .env");
      return false;
    }

    console.log("✅ VAPID key found:", vapidPublicKey.substring(0, 20) + "...");

    // Wait for service worker
    const registration = await navigator.serviceWorker.ready;
    console.log("✅ Service worker ready");

    // Check permission
    let permission = Notification.permission;

    if (permission === "denied") {
      console.log("❌ Notification permission denied");
      return false;
    }

    if (permission === "default") {
      console.log("🔔 Requesting notification permission...");
      permission = await Notification.requestPermission();

      if (permission !== "granted") {
        console.log("❌ Permission not granted");
        return false;
      }
      console.log("✅ Permission granted");
    }

    // Get or create subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log("📝 Creating new push subscription...");

      // Convert VAPID key
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      console.log("✅ New subscription created");
    } else {
      console.log("✅ Using existing subscription");
    }
    // Save to Firestore
    const subscriptionData = subscription.toJSON();
    const endpointHash = btoa(subscription.endpoint)
      .replace(/[/+=]/g, '_')
      .substring(0, 100);

    await setDoc(doc(db, "pushSubscriptions", endpointHash), {
      subscription: subscriptionData,
      endpoint: subscription.endpoint,
      createdAt: new Date(),
      lastActive: new Date(),
      userAgent: navigator.userAgent,
      active: true
    }, { merge: true });

    console.log("✅ Push setup complete!");
    console.log("📱 Subscription saved to Firestore");

    return true;

  } catch (err) {
    console.error("❌ Push registration error:", err);
    return false;
  }
};