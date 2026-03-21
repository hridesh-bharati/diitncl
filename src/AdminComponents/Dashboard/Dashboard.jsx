import React, { useState, useEffect, useMemo } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [queries, setQueries] = useState([]);
  const [counts, setCounts] = useState({ total: 0, today: 0, queries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const todayStr = new Date().toDateString();

    const unsubStudents = onSnapshot(query(collection(db, "admissions"), orderBy("createdAt", "desc")), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(data.slice(0, 5));
      setCounts(prev => ({
        ...prev,
        total: snap.size,
        today: data.filter(s => s.createdAt?.toDate?.().toDateString() === todayStr).length
      }));
      setLoading(false);
    });

    const unsubQueries = onSnapshot(query(collection(db, "studentQueries"), orderBy("timestamp", "desc")), (snap) => {
      setQueries(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 4));
      setCounts(prev => ({ ...prev, queries: snap.size }));
    });

    return () => { unsubStudents(); unsubQueries(); };
  }, []);

  // 🔹 DRY: Stats Configuration
  const STAT_CARDS = useMemo(() => [
    { label: "Total Students", val: counts.total, icon: "bi-people-fill", bg: "linear-gradient(135deg,#6366f1,#8b5cf6)", link: "/admin/admitted-student-list" },
    { label: "New Today", val: counts.today, icon: "bi-lightning-fill", bg: "linear-gradient(135deg,#10b981,#3b82f6)", link: "/admin/students" },
    { label: "Enquiries", val: counts.queries, icon: "bi-chat-left-dots-fill", bg: "linear-gradient(135deg,#f59e0b,#ef4444)", link: "/admin/clients-contacts" },
    { label: "Gallery", val: "12", icon: "bi-images", bg: "linear-gradient(135deg,#ec4899,#f43f5e)", link: "/gallery" }
  ], [counts]);

  // 🔹 DRY Component: Student Row
  const renderStudentRow = (s) => {
    const isMain = s.regNo?.startsWith("DIIT124");
    const branchName = isMain ? "Main" : "East";
    const branchClass = isMain ? "bg-primary" : "bg-success";

    return (
      <tr key={s.id} onClick={() => navigate(`/admin/students/${s.id}`)} style={{ cursor: 'pointer' }}>
        <td className="ps-3 align-middle border-0">
          <div className="d-flex align-items-center gap-2">
            <div className="border-0" style={{ width: '35px', height: '35px', flexShrink: 0 }}>
              {s.photoUrl ?
                <img src={s.photoUrl} alt="" className="w-100 h-100 rounded-circle border" style={{ objectFit: 'cover' }} />
                : <div className="w-100 h-100 rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-uppercase">{s.name?.charAt(0)}</div>
              }
            </div>
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center gap-1">
                <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>{s.name}</span>
                <span className={`badge ${branchClass} fw-bold py-1 px-2`} style={{ fontSize: '9px', borderRadius: '4px' }}>{branchName}</span>
              </div>
              <span className="text-muted" style={{ fontSize: '10px' }}>{s.course}</span>
            </div>
          </div>
        </td>
        <td className="pe-3 text-end text-muted align-middle border-0" style={{ fontSize: '11px' }}>
          {s.createdAt?.toDate?.().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
        </td>
      </tr>
    );
  };

  if (loading) return (<p className="text-center text-muted  p-5 m-5">Loading...</p>);

  return (
    <div className="container-fluid dashboard-wrapper">
      <header className="mb-3 d-flex justify-content-between align-items-center px-1">
        <h4 className="fw-bolder text-dark m-0">Admin Console</h4>
        <span className="badge bg-white text-primary border px-3 py-2 rounded-pill shadow-sm">SYSTEM LIVE</span>
      </header>

      {/* Stats Section */}
      <div className="row g-3 mb-4">
        {STAT_CARDS.map((card, i) => (
          <div className="col-6 col-lg-3" key={i}>
            <div className="stat-card p-3 mb-3 rounded-4 shadow-sm position-relative text-white" style={{ background: card.bg, cursor: 'pointer', overflow: 'hidden' }} onClick={() => navigate(card.link)}>
              <div className="position-absolute end-0 bottom-0 opacity-25" style={{ fontSize: '3rem', transform: 'translate(10px, 10px) rotate(-15deg)' }}>
                <i className={`bi ${card.icon}`}></i>
              </div>
              <div className="position-relative" style={{ zIndex: 2 }}>
                <div className="d-flex align-items-center mb-1">
                  <div className="rounded-3 d-flex align-items-center justify-content-center me-3" style={{ background: 'rgba(255,255,255,0.2)', width: '40px', height: '40px' }}>
                    <i className={`bi ${card.icon} fs-4`}></i>
                  </div>
                  <h1 className="fw-bold mb-0">{card.val}</h1>
                </div>
                <p className="small fw-bold mb-0 opacity-75">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admissions Table */}
      <div className="full-width-card border-0 shadow-sm bg-white rounded-3 overflow-hidden">
        <div className="p-3 d-flex justify-content-between align-items-center border-bottom">
          <h6 className="fw-bold m-0 text-dark">Recent Admissions (Top 5)</h6>
          <Link to="/admin/admitted-student-list" className="small fw-bold text-decoration-none">View All</Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 ps-3 small text-muted fw-bold">STUDENT</th>
                <th className="border-0 pe-3 text-end small text-muted fw-bold">DATE</th>
              </tr>
            </thead>
            <tbody>{students.map(renderStudentRow)}</tbody>
          </table>
        </div>
      </div>

      {/* Enquiries Section */}
      <div className="mt-4 pb-5">
        <div className="d-flex justify-content-between align-items-center mb-3 px-1">
          <h6 className="fw-bold m-0">Recent Enquiries</h6>
          <Link to="/admin/clients-contacts" className="small fw-bold text-decoration-none">All Enquiries</Link>
        </div>
        <div className="row g-3 mb-5">
          {queries.map(q => (
            <div className="col-6 col-md-3" key={q.id}>
              <div className="enquiry-card p-3 bg-white border-0 shadow-sm rounded-3 border h-100" onClick={() => navigate("/admin/clients-contacts")} style={{ cursor: 'pointer' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="fw-bold text-dark small text-truncate" style={{ maxWidth: '75%' }}>{q.fullName || q.name}</div>
                  <span className="badge bg-info text-dark" style={{ fontSize: '8px' }}>NEW</span>
                </div>
                <p className="text-muted m-0 text-truncate" style={{ fontSize: '11px' }}>{q.title || "Admission Inquiry"}</p>
                <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
                  <span className="text-primary fw-bold" style={{ fontSize: '10px' }}>Details</span>
                  <small className="text-muted" style={{ fontSize: '9px' }}>
                    {q.timestamp?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}