// src/AdminComponents/Dashboard/VisitorCount.jsx

import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

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

  const sessionKey = "drishtee_active_session";

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const statsRef = doc(db, "stats", "visitors");
        const alreadyVisited = sessionStorage.getItem(sessionKey);

        const snap = await getDoc(statsRef);

        if (!snap.exists()) {
          await setDoc(statsRef, {
            count: 0,
            todayVisits: 0,
            activeUsers: 0,
            pageViews: 0,
            weeklyTraffic: [0, 0, 0, 0, 0, 0, 0],
            lastUpdated: serverTimestamp(),
          });
        }

        if (!alreadyVisited) {
          await updateDoc(statsRef, {
            count: increment(1),
            todayVisits: increment(1),
            activeUsers: increment(1),
            pageViews: increment(1),
          });

          sessionStorage.setItem(sessionKey, "active");
        } else {
          await updateDoc(statsRef, {
            pageViews: increment(1),
          });
        }

        const handleUnload = () => {
          updateDoc(statsRef, {
            activeUsers: increment(-1),
          });
        };

        window.addEventListener("beforeunload", handleUnload);

        return () => {
          window.removeEventListener("beforeunload", handleUnload);
        };
      } catch (error) {
        console.error("Tracking Error:", error);
      }
    };

    trackVisitor();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "stats", "visitors"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        setStats({
          count: data.count || 0,
          todayVisits: data.todayVisits || 0,
          activeUsers: Math.max(0, data.activeUsers || 0),
          pageViews: data.pageViews || 0,
          history:
            data.weeklyTraffic || [0, 0, 0, 0, 0, 0, data.todayVisits],
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
        label: "Visitors",
        data: stats.history,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.12)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutData = {
    labels: ["Active Now", "Other Sessions"],
    datasets: [
      {
        data: [
          stats.activeUsers,
          Math.max(0, stats.todayVisits - stats.activeUsers),
        ],
        backgroundColor: ["#f472b6", "#e2e8f0"],
        borderWidth: 0,
        cutout: "78%",
      },
    ],
  };

  const cards = [
    {
      label: "Total Visitors",
      value: stats.count,
      icon: "bi-people-fill",
      bg: "linear-gradient(135deg,#4f46e5,#6366f1)",
      trend: "+ Live",
    },
    {
      label: "Today's Visits",
      value: stats.todayVisits,
      icon: "bi-lightning-charge-fill",
      bg: "linear-gradient(135deg,#0ea5e9,#38bdf8)",
      trend: "Today",
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      icon: "bi-broadcast-pin",
      bg: "linear-gradient(135deg,#f59e0b,#f97316)",
      trend: "Online",
    },
    {
      label: "Page Views",
      value: stats.pageViews,
      icon: "bi-bar-chart-fill",
      bg: "linear-gradient(135deg,#ec4899,#f43f5e)",
      trend: "Views",
    },
  ];

  if (loading) return null
  // if (loading) {
  //   return (
  //     <div className="bg-white rounded-4 shadow-sm p-5 text-center">
  //       <div className="spinner-border text-primary mb-3"></div>
  //       <h6 className="fw-bold mb-1">Loading Real Visitor Analytics...</h6>
  //       <small className="text-muted">
  //         Fetching live data from Firebase
  //       </small>
  //     </div>
  //   );
  // }

  return (
    <div className="container-fluid p-0 my-4">
      {/* Header */}
      {/* <div
        className="rounded-4 shadow-sm p-4 mb-4 text-white"
        style={{
          background:
            "linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #8b5cf6 100%)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-1 d-flex align-items-center">
              <i className="bi bi-activity me-2"></i>
              Live Visitor Analytics
            </h4>
            <p className="mb-0 opacity-75 small">
              Real-time visitor monitoring dashboard
            </p>
          </div>

          <div
            className="badge bg-white text-dark px-3 py-2 rounded-pill shadow-sm"
            style={{
              fontWeight: "700",
              fontSize: "12px",
            }}
          >
            SYSTEM LIVE
          </div>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {cards.map((item, i) => (
          <div className="col-6 col-sm-4 col-lg-3" key={i}>
            <div
              className="stat-card rounded-3 p-1"
              style={{
                background: item.bg,
              }}
            >
              <div
                className="position-absolute end-0 bottom-0 opacity-25"
                style={{
                  fontSize: "3rem",
                  transform: "translate(10px,10px)",
                }}
              >
                <i className={`bi ${item.icon}`}></i>
              </div>

              <div className="position-relative w-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      background: "rgba(255,255,255,0.18)",
                    }}
                  >
                    <i className={`bi ${item.icon} fs-5`}></i>
                  </div>

                  <span className="badge bg-white text-dark rounded-pill px-2">
                    {item.trend}
                  </span>
                </div>

                <h3 className="fw-bold mb-1">
                  {item.value.toLocaleString()}
                </h3>

                <small className="fw-semibold opacity-75">
                  {item.label}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="row g-4">
        {/* Traffic Chart */}
        <div className="col-12 col-lg-8">
          <div className="full-width-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 d-flex align-items-center">
                <i className="bi bi-graph-up-arrow me-2 text-primary"></i>
                Traffic History
              </h5>

              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
                Weekly Report
              </span>
            </div>

            <div style={{ height: "320px" }}>
              <Line data={lineChartData} options={lineOptions} />
            </div>
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="col-12 col-lg-4">
          <div className="full-width-card p-4 h-100 text-center">
            <h5 className="fw-bold mb-3 d-flex align-items-center justify-content-center">
              <i className="bi bi-broadcast me-2 text-warning"></i>
              Live Status
            </h5>

            <div
              style={{
                height: "250px",
                position: "relative",
              }}
            >
              <Doughnut
                data={doughnutData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />

              <div className="position-absolute top-50 start-50 translate-middle">
                <h2 className="fw-bold mb-0 text-dark">
                  {stats.activeUsers}
                </h2>
                <small className="text-muted fw-semibold">
                  USERS ONLINE
                </small>
              </div>
            </div>

            <div className="mt-3">
              <div className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                Live Connected Sessions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}