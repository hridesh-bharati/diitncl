import webpush from "web-push";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";

if (!admin.apps.length) {
  initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_KEY)
    )
  });
}

const db = getFirestore();

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection("adminSubscriptions").get();

    const payload = JSON.stringify({
      title: "New Student Query",
      body: "Someone submitted a new query"
    });

    const promises = snapshot.docs.map((doc) =>
      webpush.sendNotification(doc.data().subscription, payload)
    );

    await Promise.all(promises);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}