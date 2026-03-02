const { onSchedule } = require("firebase-functions/v2/scheduler"); // Zyada modern hai
const admin = require("firebase-admin");
const { google } = require("googleapis");

admin.initializeApp();

const SERVICE_ACCOUNT = require("./service-account-key.json");
const searchconsole = google.searchconsole("v1");

// Ye function automatic har raat ko 12 baje chalega
exports.syncGSCDaily = onSchedule("every 24 hours", async (event) => {
  try {
    const auth = new google.auth.JWT(
      SERVICE_ACCOUNT.client_email,
      null,
      SERVICE_ACCOUNT.private_key,
      ["https://www.googleapis.com/auth/webmasters.readonly"]
    );

    const result = await searchconsole.searchanalytics.query({
      auth,
      siteUrl: "https://www.drishteeindia.com/",
      requestBody: {
        startDate: "2026-02-01", 
        endDate: "2026-03-01", 
        dimensions: ["site"]
      }
    });

    if (result.data.rows && result.data.rows.length > 0) {
      const stats = result.data.rows[0];
      
      // Firestore mein save
      await admin.firestore().collection("stats").doc("google_data").set({
        clicks: stats.clicks,
        impressions: stats.impressions,
        ctr: (stats.ctr * 100).toFixed(2),
        position: stats.position.toFixed(1),
        lastUpdate: new Date().toISOString()
      });
      console.log("Real Data Synced: 65 clicks/179 impressions type stats saved!");
    }
  } catch (error) {
    console.error("GSC Sync Error:", error);
  }
});