// src/AdminComponents/Students/Attendance/AttendanceAnalytics.jsx

import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const getISODate = (date = new Date()) => date.toISOString().split("T")[0];

// Reusable Stat Card Component to keep JSX DRY
const StatCard = ({ title, value, textColor }) => (
  <div className="col-6 col-md-3">
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body text-center">
        <h6 className="text-muted">{title}</h6>
        <h3 className={`fw-bold ${textColor}`}>{value}</h3>
      </div>
    </div>
  </div>
);

export default function AttendanceAnalytics() {
  const [branch, setBranch] = useState("DIIT124");
  const [weeklyData, setWeeklyData] = useState([]);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    half: 0,
    totalStudents: 0,
    avg: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const attendanceQuery = query(collection(db, "attendance"), where("branch", "==", branch));
        const snap = await getDocs(attendanceQuery);

        let present = 0;
        let absent = 0;
        let half = 0;

        // Initialize last 7 days cleanly
        const weeklyMap = Object.fromEntries(
          Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return [getISODate(d), { present: 0, total: 0 }];
          })
        );

        snap.forEach((doc) => {
          const data = doc.data();
          if (data.status === "Holiday") return;

          (data.records || []).forEach((r) => {
            const status = r.status?.toLowerCase();
            const weight = status === "present" ? 1 : status === "half" ? 0.5 : 0;

            if (status === "present") present += 1;
            else if (status === "half") half += 1;
            else absent += 1;

            // Update Weekly Data mapping if date exists
            if (weeklyMap[data.date]) {
              weeklyMap[data.date].total += 1;
              weeklyMap[data.date].present += weight;
            }
          });
        });

        const totalAttendance = present + absent + half;
        const avg = totalAttendance > 0 
          ? (((present + half * 0.5) / totalAttendance) * 100).toFixed(1) 
          : 0;

        // Format weekly data directly sorting by keys to keep chronological order (past to present)
        const weeklyFormatted = Object.keys(weeklyMap)
          .sort()
          .map((date) => ({
            day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
            percentage: weeklyMap[date].total > 0 
              ? Math.round((weeklyMap[date].present / weeklyMap[date].total) * 100) 
              : 0,
          }));

        setWeeklyData(weeklyFormatted);
        setStats({ present, absent, half, totalStudents: totalAttendance, avg });
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    fetchAnalytics();
  }, [branch]);

  // Doughnut Chart Configuration
  const doughnutData = useMemo(() => ({
    labels: ["Present", "Absent", "Half Day"],
    datasets: [{
      data: [stats.present, stats.absent, stats.half],
      backgroundColor: ["#198754", "#dc3545", "#ffc107"],
      borderWidth: 0,
    }],
  }), [stats]);

  // Weekly Bar Chart Configuration
  const barData = useMemo(() => ({
    labels: weeklyData.map((d) => d.day),
    datasets: [{
      label: "Attendance %",
      data: weeklyData.map((d) => d.percentage),
      backgroundColor: "#0d6efd",
      borderRadius: 8,
    }],
  }), [weeklyData]);

  return (
    <div className="container-fluid py-3">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Attendance Analytics</h4>
          <small className="text-muted">Real-time attendance insights</small>
        </div>

        <div className="btn-group btn-group-sm shadow-sm">
          {["DIIT124", "DIIT125"].map((b) => (
            <button
              key={b}
              onClick={() => setBranch(b)}
              className={`btn ${branch === b ? "btn-dark" : "btn-light"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="row g-3 mb-4">
        <StatCard title="Present" value={stats.present} textColor="text-success" />
        <StatCard title="Absent" value={stats.absent} textColor="text-danger" />
        <StatCard title="Half Day" value={stats.half} textColor="text-warning" />
        <StatCard title="Avg Attendance" value={`${stats.avg}%`} textColor="text-primary" />
      </div>

      {/* CHARTS */}
      <div className="row g-4">
        {/* Doughnut Chart */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Attendance Ratio</h5>
              <div style={{ maxWidth: 320, margin: "auto" }}>
                <Doughnut data={doughnutData} />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Weekly Attendance</h5>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, max: 100 } },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}