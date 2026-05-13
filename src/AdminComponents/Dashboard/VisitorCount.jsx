import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function VisitorCount() {
  const [stats, setStats] = useState({
    count: 0, todayVisits: 0, activeUsers: 0, pageViews: 0,
    history: [0, 0, 0, 0, 0, 0, 0],
  });
  const [loading, setLoading] = useState(true);

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

  // Colored Cards Configuration
  const cards = [
    { label: "Total Visitors", value: stats.count, icon: "bi-people-fill", bg: "linear-gradient(135deg, #6366f1, #4338ca)", shadow: "rgba(99, 102, 241, 0.4)" },
    { label: "Today's Visits", value: stats.todayVisits, icon: "bi-lightning-charge-fill", bg: "linear-gradient(135deg, #0ea5e9, #0284c7)", shadow: "rgba(14, 165, 233, 0.4)" },
    { label: "Active Users", value: stats.activeUsers, icon: "bi-broadcast-pin", bg: "linear-gradient(135deg, #f59e0b, #d97706)", shadow: "rgba(245, 158, 11, 0.4)" },
    { label: "Page Views", value: stats.pageViews, icon: "bi-eye-fill", bg: "linear-gradient(135deg, #ec4899, #be185d)", shadow: "rgba(236, 72, 153, 0.4)" },
  ];

  if (loading) return null;

  return (
    <div className="container-fluid py-4 px-3 my-2" style={{ backgroundColor: '#fcfcfd' }}>
      
      {/* 1. Header Section */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold mb-0 text-dark">Live Statistics</h5>
          <small className="text-muted">Updated just now</small>
        </div>
        {/* <button className="btn btn-sm btn-light border shadow-sm rounded-pill px-3">
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button> */}
      </div>

      {/* 2. Full-Colored Stats Cards */}
      <div className="row g-3 mb-4">
        {cards.map((item, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="border-0 rounded-4 p-3 h-100 text-white shadow-lg" 
              style={{ 
                background: item.bg, 
                boxShadow: `0 10px 20px -5px ${item.shadow}`,
                transition: 'all 0.3s ease'
              }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <i className={`bi ${item.icon} fs-5 opacity-75`}></i>
                <div className="px-2 py-1 rounded-pill bg-white bg-opacity-25" style={{fontSize: '9px', fontWeight: 'bold'}}>LIVE</div>
              </div>
              <h3 className="fw-bold mb-1 mt-2">{item.value.toLocaleString()}</h3>
              <p className="small mb-0 opacity-75 fw-medium text-uppercase ls-1" style={{fontSize: '11px'}}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* 3. Main Chart Card */}
        <div className="col-12 col-lg-8">
          <div className="bg-white p-4 rounded-4 shadow-sm border">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold m-0"><i className="bi bi-graph-up-arrow me-2 text-primary"></i>Visitor Analytics</h6>
              <select className="form-select form-select-sm w-auto border-0 bg-light fw-bold">
                <option>Last 7 Days</option>
              </select>
            </div>
            <div style={{ height: "320px" }}>
              <Line 
                data={{
                  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  datasets: [{
                    label: "Real Visitors",
                    data: stats.history,
                    borderColor: "#6366f1",
                    backgroundColor: "rgba(99, 102, 241, 0.08)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 4,
                    pointRadius: 5,
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 2,
                  }],
                }} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { 
                    y: { grid: { borderDash: [5, 5] } },
                    x: { grid: { display: false } }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* 4. Active Users Card */}
        <div className="col-12 col-lg-4">
          <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
            <h6 className="fw-bold mb-4 text-center">Engagement</h6>
            <div style={{ position: "relative", height: "240px" }}>
              <Doughnut 
                data={{
                  labels: ["Active", "Total"],
                  datasets: [{
                    data: [stats.activeUsers, stats.todayVisits],
                    backgroundColor: ["#6366f1", "#f1f5f9"],
                    borderWidth: 0,
                    cutout: "82%",
                  }],
                }} 
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
              />
              <div className="position-absolute top-50 start-50 translate-middle text-center">
                <span className="d-block small text-muted fw-bold">ACTIVE</span>
                <h2 className="fw-bold mb-0" style={{fontSize: '2.5rem', color: '#1e293b'}}>{stats.activeUsers}</h2>
                <div className="d-flex align-items-center justify-content-center text-success small fw-bold">
                  <span className="dot me-1"></span> ONLINE
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-top d-flex justify-content-around text-center">
               <div>
                  <div className="small text-muted mb-1">Today</div>
                  <div className="fw-bold text-dark">{stats.todayVisits}</div>
               </div>
               <div className="vr opacity-10"></div>
               <div>
                  <div className="small text-muted mb-1">Peak</div>
                  <div className="fw-bold text-dark">{(stats.todayVisits * 0.8).toFixed(0)}</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ls-1 { letter-spacing: 0.5px; }
        .dot { height: 8px; width: 8px; background-color: #22c55e; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>
    </div>
  );
}