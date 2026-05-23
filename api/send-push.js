import admin from "firebase-admin";

/* =========================================
   🔥 FIREBASE ADMIN INIT
========================================= */
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });

    console.log("✅ Firebase Admin Ready");
  } catch (err) {
    console.error("❌ Firebase Admin Error:", err);
  }
}

/* =========================================
   🚀 API HANDLER
========================================= */
export default async function handler(req, res) {

  /* ---------- CORS ---------- */
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {

    const { token, title, body, url } = req.body;

    /* ---------- VALIDATION ---------- */
    if (!token || !title || !body) {
      return res.status(400).json({
        success: false,
        error: "Missing token/title/body",
      });
    }

    /* =========================================
       🔥 PURE DATA PAYLOAD
       BEST FOR PWA
    ========================================= */
 const message = {
  token,

  notification: {
    title,
    body,
  },

  data: {
    url:
      url ||
      "https://www.drishteeindia.com/student/dashboard",
  },

  android: {
    priority: "high",
    notification: {
      sound: "default",
      channelId: "drishtee_alerts_urgent",
      priority: "max",
      visibility: "public",
    },
  },

  webpush: {
    headers: {
      Urgency: "high",
    },

    fcm_options: {
      link:
        url ||
        "https://www.drishteeindia.com/student/dashboard",
    },
  },
};
    /* ---------- SEND ---------- */
    const response = await admin.messaging().send(message);

    console.log("✅ Push Sent:", response);

    return res.status(200).json({
      success: true,
      messageId: response,
    });

  } catch (error) {

    console.error("❌ FCM ERROR:", error);

    /* ---------- INVALID TOKEN ---------- */
    if (
      error.code === "messaging/registration-token-not-registered" ||
      error.code === "messaging/invalid-registration-token"
    ) {
      return res.status(410).json({
        success: false,
        error: "Invalid or expired token",
        code: error.code,
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}