import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase/firebase";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export const registerPush = async () => {
  try {
    if (!("serviceWorker" in navigator)) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const reg = await navigator.serviceWorker.ready;

    const existingSub = await reg.pushManager.getSubscription();
    if (existingSub) {
      console.log("Already subscribed");
      return;
    }

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY
      )
    });

    console.log("Subscribed:", subscription);

    await setDoc(
      doc(db, "adminSubscriptions", subscription.endpoint),
      {
        subscription,
        createdAt: new Date()
      }
    );

    console.log("Saved to Firestore");
  } catch (err) {
    console.error("Push Error:", err);
  }
};