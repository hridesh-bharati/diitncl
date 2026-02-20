import webpush from "web-push";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

const db = admin.firestore();

// Configure web-push with VAPID details
webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:hridesh027@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all admin subscriptions
    const snapshot = await db.collection("adminSubscriptions").get();
    
    if (snapshot.empty) {
      return res.status(200).json({ success: false, message: "No subscribers" });
    }

    const { fullName, title } = req.body;
    
    const payload = JSON.stringify({
      title: "📩 New Student Query",
      body: `${fullName || 'Someone'}: ${title || 'New query submitted'}`,
      icon: "/images/icon/icon-192.png",
      badge: "/images/icon/icon-512.png",
      data: { url: "/admin/queries" }
    });

    // Send notifications to all subscribers
    const notifications = snapshot.docs.map(async (doc) => {
      const subscriptionData = doc.data().subscription;
      
      // Handle both formats (object or JSON string)
      const subscription = typeof subscriptionData === 'string' 
        ? JSON.parse(subscriptionData) 
        : subscriptionData;
      
      try {
        await webpush.sendNotification(subscription, payload);
        return { success: true, endpoint: subscription.endpoint };
      } catch (error) {
        // If subscription is invalid, remove it from database
        if (error.statusCode === 410 || error.statusCode === 404) {
          await doc.ref.delete();
          console.log('Removed invalid subscription:', subscription.endpoint);
        }
        return { success: false, endpoint: subscription.endpoint, error: error.message };
      }
    });

    const results = await Promise.all(notifications);
    const successful = results.filter(r => r.success).length;

    res.status(200).json({ 
      success: true, 
      sent: successful,
      total: results.length 
    });
    
  } catch (err) {
    console.error('Push notification error:', err);
    res.status(500).json({ error: "Push failed", details: err.message });
  }
}