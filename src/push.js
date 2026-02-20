import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase/firebase";

// Convert base64 string to Uint8Array for VAPID key
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

// Check if push notifications are supported
export const isPushSupported = () => {
  return "serviceWorker" in navigator && "PushManager" in window;
};

// Register push notifications
export const registerPush = async () => {
  try {
    // Check if push is supported
    if (!isPushSupported()) {
      console.log("❌ Push notifications not supported in this browser");
      return false;
    }

    // Check if service worker is registered
    let registration;
    try {
      registration = await navigator.serviceWorker.ready;
    } catch (swError) {
      console.log("⏳ Service worker not ready yet, waiting...");
      // If not ready, wait for it
      registration = await new Promise((resolve) => {
        if (navigator.serviceWorker.controller) {
          resolve(navigator.serviceWorker.ready);
        } else {
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            resolve(navigator.serviceWorker.ready);
          });
        }
      });
    }

    console.log("✅ Service worker ready for push");

    // Check notification permission
    let permission = Notification.permission;
    
    if (permission === "denied") {
      console.log("❌ Notification permission denied");
      return false;
    }
    
    if (permission === "default") {
      console.log("🔔 Requesting notification permission...");
      permission = await Notification.requestPermission();
      
      if (permission !== "granted") {
        console.log("❌ Notification permission not granted");
        return false;
      }
      console.log("✅ Notification permission granted");
    }

    // Get VAPID public key from environment
    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    
    if (!vapidPublicKey) {
      console.error("❌ VAPID public key not found in environment variables");
      return false;
    }

    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();

    // If no subscription exists, create one
    if (!subscription) {
      console.log("🔔 Creating new push subscription...");
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
        console.log("✅ New push subscription created:", subscription);
      } catch (subError) {
        console.error("❌ Failed to subscribe to push:", subError);
        return false;
      }
    } else {
      console.log("✅ Using existing push subscription:", subscription);
    }

    // Convert subscription to JSON for storage
    const subscriptionJSON = subscription.toJSON();
    
    // Create a unique ID for this subscription
    const endpointHash = btoa(subscription.endpoint)
      .replace(/[/+=]/g, '_')
      .substring(0, 100);

    // Save subscription to Firestore
    try {
      await setDoc(doc(db, "adminSubscriptions", endpointHash), {
        subscription: subscriptionJSON,
        endpoint: subscription.endpoint,
        createdAt: new Date(),
        lastActive: new Date(),
        userAgent: navigator.userAgent,
        active: true
      }, { merge: true });
      
      console.log("✅ Push subscription saved to Firestore");
    } catch (firestoreError) {
      console.error("❌ Failed to save subscription to Firestore:", firestoreError);
      return false;
    }

    return true;
    
  } catch (err) {
    console.error("❌ Push registration error:", err);
    return false;
  }
};

// Unsubscribe from push notifications
export const unsubscribePush = async () => {
  try {
    if (!isPushSupported()) {
      console.log("Push not supported");
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Mark as inactive in Firestore
      const endpointHash = btoa(subscription.endpoint)
        .replace(/[/+=]/g, '_')
        .substring(0, 100);
      
      await setDoc(doc(db, "adminSubscriptions", endpointHash), {
        active: false,
        unsubscribedAt: new Date()
      }, { merge: true });
      
      // Unsubscribe from push
      const success = await subscription.unsubscribe();
      if (success) {
        console.log("✅ Successfully unsubscribed from push notifications");
      }
      return success;
    }
    
    console.log("No active subscription found");
    return false;
    
  } catch (err) {
    console.error("❌ Unsubscribe error:", err);
    return false;
  }
};

// Check push subscription status
export const checkPushStatus = async () => {
  try {
    if (!isPushSupported()) {
      return { supported: false, subscribed: false };
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    return {
      supported: true,
      subscribed: !!subscription,
      permission: Notification.permission,
      subscription: subscription?.toJSON()
    };
    
  } catch (err) {
    console.error("Error checking push status:", err);
    return { supported: false, subscribed: false, error: err.message };
  }
};