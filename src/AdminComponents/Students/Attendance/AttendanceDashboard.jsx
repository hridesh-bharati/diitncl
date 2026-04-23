import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

export default function AttendanceDashboard() {
  const [branch, setBranch] = useState("DIIT124");
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    avg: 0,
    pending: 0,
  });

  const [weekly, setWeekly] = useState([]);
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    // Students
    const unsubStudents = onSnapshot(collection(db, "students"), (snap) => {
      const list = snap.docs.filter(d => {
        const data = d.data();
        return (data.branch === branch || data.centerCode === branch) &&
          data.status !== "canceled" && data.status !== "pending";
      });

      setStats(prev => ({ ...prev, total: list.length }));
    });

    // Today Attendance
    const q = query(
      collection(db, "attendance"),
      where("date", "==", today),
      where("branch", "==", branch)
    );

    const unsubAttendance = onSnapshot(q, (snap) => {
      let present = 0;
      let marked = 0;

      snap.forEach(doc => {
        const data = doc.data();
        (data.records || []).forEach(r => {
          marked++;
          if (r.status === "Present") present++;
        });
      });

      setStats(prev => ({
        ...prev,
        present,
        pending: Math.max(0, prev.total - marked),
      }));
    });

    // Weekly
    const unsubWeekly = onSnapshot(
      query(collection(db, "attendance"), where("branch", "==", branch)),
      (snap) => {
        const map = {};
        const now = new Date();

        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(now.getDate() - i);
          const key = d.toISOString().split("T")[0];
          map[key] = { total: 0, present: 0 };
        }

        snap.forEach(doc => {
          const data = doc.data();
          if (map[data.date]) {
            (data.records || []).forEach(r => {
              map[data.date].total++;
              if (r.status === "Present") map[data.date].present++;
            });
          }
        });

        const arr = Object.keys(map).reverse().map(date => {
          const { total, present } = map[date];
          return {
            day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
            val: total ? Math.round((present / total) * 100) : 0
          };
        });

        setWeekly(arr);

        const avg = arr.length
          ? arr.reduce((s, d) => s + d.val, 0) / arr.length
          : 0;

        setStats(prev => ({ ...prev, avg: avg.toFixed(1) }));
      }
    );

    return () => {
      unsubStudents();
      unsubAttendance();
      unsubWeekly();
    };
  }, [branch, today]);

  const cards = [
    {
      title: "Mark Attendance",
      icon: "bi-pencil-square",
      link: "/admin/students/attendance/mark",
      value: `${stats.present}/${stats.total}`,
    },
    {
      title: "Summary",
      icon: "bi-bar-chart-line",
      link: "/admin/students/attendance/summary",
      value: `${stats.avg}%`,
    },
    {
      title: "Analytics",
      icon: "bi-pie-chart",
      link: "/admin/students/attendance/analytics",
      value: "View",
    },
  ];

  return (
    <div className="container py-3">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-semibold m-0">Attendance</h5>

        <div className="btn-group btn-group-sm">
          {["DIIT124", "DIIT125"].map(b => (
            <button
              key={b}
              onClick={() => setBranch(b)}
              className={`btn ${branch === b ? "btn-dark" : "btn-outline-dark"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* CARDS */}
      <div className="row g-3 mb-3">
        {cards.map((c, i) => (
          <div className="col-md-4" key={i}>
            <Link to={c.link} className="text-decoration-none">
              <div className="border rounded-3 p-3 h-100 d-flex justify-content-between align-items-center hover-shadow">
                <div>
                  <div className="small text-muted">{c.title}</div>
                  <div className="fw-bold">{c.value}</div>
                </div>
                <i className={`bi ${c.icon} fs-4 text-muted`} />
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="border rounded-3 p-3 mb-3">
        <div className="small text-muted mb-2">Last 7 Days</div>

        <div className="d-flex align-items-end gap-2" style={{ height: 120 }}>
          {weekly.map((d, i) => (
            <div key={i} className="flex-fill text-center">
              <div
                style={{
                  height: `${d.val}%`,
                  background: "#0d6efd",
                  borderRadius: 4,
                  minHeight: 4,
                }}
              />
              <div className="small text-muted mt-1">{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* STATUS */}
      <div className="border rounded-3 p-3 d-flex justify-content-between">
        <div>
          <div className="small text-muted">Pending Marks</div>
          <div className="fw-bold">{stats.pending}</div>
        </div>

        <div className="text-end">
          <div className="small text-muted">Branch</div>
          <div className="fw-bold">{branch}</div>
        </div>
      </div>

      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          transition: 0.2s;
        }
      `}</style>
    </div>
  );
}