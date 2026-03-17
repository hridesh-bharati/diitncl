// api\send-push.js
import webpush from 'web-push';

export default async function handler(req, res) {
  // 1. CORS Headers (Zaroori hai taaki frontend se call ho sake)
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

  const { subscription, title, body } = req.body;

  // Validation
  if (!subscription || !title || !body) {
    return res.status(400).json({ success: false, error: "Missing data" });
  }

  // 2. VAPID Configuration
  webpush.setVapidDetails(
    'mailto:hridesh027@gmail.com',
    process.env.VAPID_PUBLIC_KEY.trim(),
    process.env.VAPID_PRIVATE_KEY.trim()
  );

  try {
    // 3. Send Notification
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title,
        body,
        url: 'https://www.drishteeindia.com/student/exams'
      },
      )
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Push Error:', error);

    // Agar subscription invalid/expired ho chuka ho (410 ya 404)
    if (error.statusCode === 410 || error.statusCode === 404) {
      return res.status(410).json({ success: false, error: "Subscription expired" });
    }

    return res.status(500).json({ success: false, error: error.message });
  }
}