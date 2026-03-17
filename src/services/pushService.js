// src/services/pushService.js

// Aapki generated Public Key
// const PUBLIC_VAPID_KEY = "BOE6KlU4S7LB_0byc-bROXewESsYYefkkL97mLAqz_wuvJvIsJiIDmCzp8SXZCwoq2VK7Tg_PbMZ-KPuQQmBrKo";
const PUBLIC_VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;
/**
 * Browser se Push Notification ki permission maangta hai 
 * aur ek unique Subscription object return karta hai.
 */
export const subscribeUser = async () => {
  // 1. Check karein ki browser service workers support karta hai ya nahi
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn("Push notifications are not supported in this browser.");
    return null;
  }

  try {
    // 2. Wait karein jab tak Service Worker ready na ho jaye
    const registration = await navigator.serviceWorker.ready;

    // 3. Pehle se koi subscription hai toh check karein
    let subscription = await registration.pushManager.getSubscription();

    // 4. Agar subscription nahi hai, toh naya banayein
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });
    }

    return subscription; 
  } catch (err) {
    console.error("Failed to subscribe the user: ", err);
    return null;
  }
};

/**
 * Helper Function: VAPID key string ko Uint8Array mein convert karne ke liye
 * (Ye browser requirements ke liye zaroori hai)
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}