import webpush from "web-push";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

webpush.setVapidDetails(
  "mailto:hridesh027@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const snap = await admin.firestore().collection("adminSubscriptions").get();
    const subs = snap.docs.map(d => d.data().subscription);

    if (!subs.length)
      return res.status(200).json({ success: false, message: "No subscribers" });

    const payload = JSON.stringify({
      title: "📩 New Student Query",
      body: `${req.body.fullName}: ${req.body.title}`,
    });

    await Promise.all(
      subs.map(sub => webpush.sendNotification(sub, payload).catch(() => null))
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Push failed" });
  }
}