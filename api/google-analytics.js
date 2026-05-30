// api\google-analytics.js
import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Initialize client outside the handler to enable instance reuse across warm invokes
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const propertyId = `properties/${process.env.GA_PROPERTY_ID}`;

export default async function handler(req, res) {
  // Handle CORS natively for Serverless environment
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const timeRange = req.query.timeRange || "7daysAgo";
    const days = parseInt(timeRange) || 7;

    // Run multiple GA4 API requests concurrently via Promise.all for maximum speed
    const [
      [overview],
      [previousOverview],
      [chart],
      [countries],
      [topPages],
      [trafficSources]
    ] = await Promise.all([
      analyticsDataClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate: timeRange, endDate: "today" }],
        metrics: [{ name: "activeUsers" }, { name: "newUsers" }, { name: "eventCount" }, { name: "screenPageViews" }]
      }),
      analyticsDataClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate: `${days * 2}daysAgo`, endDate: `${days}daysAgo` }],
        metrics: [{ name: "activeUsers" }, { name: "newUsers" }, { name: "eventCount" }, { name: "screenPageViews" }]
      }),
      analyticsDataClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate: timeRange, endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }]
      }),
      analyticsDataClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate: timeRange, endDate: "today" }],
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }]
      }),
      analyticsDataClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate: timeRange, endDate: "today" }],
        dimensions: [{ name: "pageTitle" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10
      }),
      analyticsDataClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate: timeRange, endDate: "today" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }]
      })
    ]);

    // Use Edge Caching/Browser Caching to minimize GA4 API hit rate limits
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");

    return res.status(200).json({
      overview,
      previousOverview,
      chart,
      countries,
      topPages,
      trafficSources
    });

  } catch (err) {
    console.error("Serverless API Error:", err);
    return res.status(500).json({ error: err.message });
  }
}