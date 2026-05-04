import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function VisitorCount() {
  const [stats, setStats] = useState({
    count: 0,
    todayVisits: 0,
    activeUsers: 0,
    pageViews: 0,
    history: [0, 0, 0, 0, 0, 0, 0],
  });

  const [loading, setLoading] = useState(true);

  // Sirf Real-time Data Listen karega (Google Analytics/Search Console backend se link ho toh)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "stats", "visitors"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setStats({
          count: data.count || 0,
          todayVisits: data.todayVisits || 0,
          activeUsers: Math.max(0, data.activeUsers || 0),
          pageViews: data.pageViews || 0,
          history: data.weeklyTraffic || [0, 0, 0, 0, 0, 0, 0],
        });
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"],
    datasets: [
      {
        label: "Real Visitors",
        data: stats.history,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.12)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const doughnutData = {
    labels: ["Active Now", "Today Total"],
    datasets: [
      {
        data: [stats.activeUsers, stats.todayVisits],
        backgroundColor: ["#f472b6", "#e2e8f0"],
        borderWidth: 0,
        cutout: "78%",
      },
    ],
  };

  const cards = [
    { label: "Total Visitors", value: stats.count, icon: "bi-people-fill", bg: "linear-gradient(135deg,#4f46e5,#6366f1)", trend: "All Time" },
    { label: "Today's Visits", value: stats.todayVisits, icon: "bi-lightning-charge-fill", bg: "linear-gradient(135deg,#0ea5e9,#38bdf8)", trend: "Live" },
    { label: "Active Users", value: stats.activeUsers, icon: "bi-broadcast-pin", bg: "linear-gradient(135deg,#f59e0b,#f97316)", trend: "Online" },
    { label: "Page Views", value: stats.pageViews, icon: "bi-bar-chart-fill", bg: "linear-gradient(135deg,#ec4899,#f43f5e)", trend: "Views" },
  ];

  if (loading) return null;

  return (
    <div className="container-fluid p-0 my-4">
      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {cards.map((item, i) => (
          <div className="col-6 col-sm-4 col-lg-3" key={i}>
            <div className="stat-card rounded-3 p-3 shadow-sm" style={{ background: item.bg, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div className="d-flex justify-content-between align-items-start">
                <i className={`bi ${item.icon} fs-4 opacity-50`}></i>
                <span className="badge bg-white text-dark rounded-pill" style={{fontSize: '10px'}}>{item.trend}</span>
              </div>
              <h3 className="fw-bold mt-2 mb-0">{item.value.toLocaleString()}</h3>
              <small className="opacity-75">{item.label}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="bg-white p-4 rounded-4 shadow-sm" style={{ height: "400px" }}>
            <h6 className="fw-bold mb-4">Traffic Insights (via Search Console)</h6>
            <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="bg-white p-4 rounded-4 shadow-sm text-center" style={{ height: "400px" }}>
            <h6 className="fw-bold mb-3">Live Active Users</h6>
            <div style={{ position: "relative", height: "250px" }}>
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
              <div className="position-absolute top-50 start-50 translate-middle">
                <h2 className="fw-bold mb-0">{stats.activeUsers}</h2>
                <small className="text-muted">LIVE</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}