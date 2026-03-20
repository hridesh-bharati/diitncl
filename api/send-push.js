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


// api\send-push.js
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
  // NOTE: Ab hum 'subscription' object ki jagah 'token' (FCM Token string) ka use karenge
  const { token, title, body, url, icon } = req.body;

  // Validation
  if (!token || !title || !body) {
    return res.status(400).json({ success: false, error: "Missing token, title or body" });
  }

  // 4. FCM Message Structure
  const message = {
    notification: {
      title: title,
      body: body,
    },
    // Custom data jo app handle kar sakti hai (jaise redirection)
    data: {
      url: url || 'https://www.drishteeindia.com/student/dashboard',
      click_action: 'FLUTTER_NOTIFICATION_CLICK', // Background handling ke liye
    },
    // Android specific settings
    android: {
      notification: {
        icon: 'stock_ticker_update',
        color: '#001529', // Drishtee Theme Color
      },
    },
    // Web (Browser) specific settings
    webpush: {
      headers: {
        Urgency: 'high',
      },
      notification: {
        icon: icon || 'https://www.drishteeindia.com/logo.png',
        badge: 'https://www.drishteeindia.com/logo.png',
      },
      fcm_options: {
        link: url || 'https://www.drishteeindia.com/student/dashboard',
      },
    },
    token: token, // Receiver ka unique FCM Token
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