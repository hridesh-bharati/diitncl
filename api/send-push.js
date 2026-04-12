// // api\send-push.js
// import webpush from 'web-push';

// export default async function handler(req, res) {
//   // 1. CORS Headers (Zaroori hai taaki frontend se call ho sake)
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
//   res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { subscription, title, body } = req.body;

//   // Validation
//   if (!subscription || !title || !body) {
//     return res.status(400).json({ success: false, error: "Missing data" });
//   }

//   // 2. VAPID Configuration
//   webpush.setVapidDetails(
//     'mailto:hridesh027@gmail.com',
//     process.env.VAPID_PUBLIC_KEY.trim(),
//     process.env.VAPID_PRIVATE_KEY.trim()
//   );

//   try {
//     // 3. Send Notification
//     await webpush.sendNotification(
//       subscription,
//       JSON.stringify({
//         title,
//         body,
//         url: 'https://www.drishteeindia.com/student/exams'
//       },
//       )
//     );

//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error('Push Error:', error);

//     // Agar subscription invalid/expired ho chuka ho (410 ya 404)
//     if (error.statusCode === 410 || error.statusCode === 404) {
//       return res.status(410).json({ success: false, error: "Subscription expired" });
//     }

//     return res.status(500).json({ success: false, error: error.message });
//   }
// }

import admin from 'firebase-admin';

// 1. Firebase Admin Initialization (Safe check ke sath)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Private key mein newline characters (\n) ko handle karne ke liye replace zaroori hai
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log("Firebase Admin Initialized Successfully");
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

export default async function handler(req, res) {
  // 2. CORS Headers (Taaki Drishteeindia.com se access ho sake)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 3. Request Body se Data nikalna
  const { token, title, body, url } = req.body;

  // Validation
  if (!token || !title || !body) {
    return res.status(400).json({ success: false, error: "Missing token, title or body" });
  }

  // 4. 🔥 FCM Message Structure (WhatsApp/Insta Style Priority)
  const message = {
    token: token,
    // Notification block: OS level handling ke liye
    notification: {
      title: title,
      body: body,
    },
    // Data block: Service Worker ko full control dene ke liye (Click URL etc.)
    data: {
      title: title,
      body: body,
      url: url || 'https://www.drishteeindia.com/student/dashboard',
    },
    // Android Specific (High Priority for instant delivery)
    android: {
      priority: "high",
      notification: {
        channelId: "drishtee_alerts", // Android 8+ ke liye channel zaroori hai
        sound: "default",
        defaultSound: true,
        notificationPriority: "PRIORITY_MAX",
        visibility: "PUBLIC"
      }
    },
    // WebPush Specific (PWA ke liye sabse important)
    webpush: {
      headers: {
        Urgency: "high"
      },
      notification: {
        title: title,
        body: body,
        icon: 'https://www.drishteeindia.com/images/icon/icon-192.png', // Always use Absolute URL for reliability
        badge: 'https://www.drishteeindia.com/images/icon/icon-192.png',
        vibrate: [200, 100, 200, 100, 400], // Feel like a real app
        requireInteraction: true, // Notification screen par ruka rahega jab tak student touch na kare
        actions: [
          {
            action: 'open',
            title: 'View Now'
          }
        ]
      },
      fcm_options: {
        link: url || 'https://www.drishteeindia.com/student/dashboard'
      }
    }
  };

  try {
    // 5. Send Notification via FCM
    const response = await admin.messaging().send(message);

    console.log('Successfully sent message:', response);
    return res.status(200).json({
      success: true,
      messageId: response
    });

  } catch (error) {
    console.error('FCM Send Error:', error);

    // Agar token invalid ya expire ho gaya ho
    if (error.code === 'messaging/registration-token-not-registered' || error.code === 'messaging/invalid-registration-token') {
      return res.status(410).json({
        success: false,
        error: "Token expired or invalid. Please re-subscribe.",
        code: error.code
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}