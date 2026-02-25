import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Table, Badge } from "react-bootstrap";
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
      setStudents(data);
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

  const STAT_CARDS = [
    { label: "Total Students", val: counts.total, icon: "bi-people-fill", bg: "linear-gradient(135deg,#6366f1,#8b5cf6)", link: "/admin/admitted-student-list" },
    { label: "New Today", val: counts.today, icon: "bi-lightning-fill", bg: "linear-gradient(135deg,#10b981,#3b82f6)", link: "/admin/students" },
    { label: "Enquiries", val: counts.queries, icon: "bi-chat-left-dots-fill", bg: "linear-gradient(135deg,#f59e0b,#ef4444)", link: "/admin/clients-contacts" },
    { label: "Gallery", val: "12", icon: "bi-images", bg: "linear-gradient(135deg,#ec4899,#f43f5e)", link: "/gallery" }
  ];

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border" variant="primary" /></div>;

  return (
    <Container fluid className="dashboard-wrapper">
      {/* HEADER */}
      <header className="mb-3 d-flex justify-content-between align-items-center px-1">
        <h4 className="fw-800 text-dark m-0">Admin Overview</h4>
        <Badge bg="white" text="primary" className="border px-3 py-2 rounded-pill shadow-sm">SYSTEM LIVE</Badge>
      </header>

      {/* TOP CARDS */}
      <Row className="g-3 mb-4">
        {STAT_CARDS.map((card, i) => (
          <Col xs={6} lg={3} key={i}>
            <div className="stat-card" style={{ background: card.bg }} onClick={() => navigate(card.link)}>
              <div className="watermark-icon"><i className={`bi ${card.icon}`}></i></div>
              <div className="content-on-top">
                <div className="icon-badge-glow"><i className={`bi ${card.icon}`}></i></div>
                <div className="stat-info-text">
                  <h3>{card.val}</h3>
                  <p>{card.label}</p>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* RECENT ADMISSIONS TABLE WITH SCROLL */}
      <div className="full-width-card">
        <div className="p-3 d-flex justify-content-between align-items-center border-bottom bg-white">
          <h6 className="fw-800 m-0 text-dark">Recent Admissions</h6>
          <Link to="/admin/admitted-student-list" className="small fw-bold text-decoration-none">Manage All</Link>
        </div>
        <div className="scroll-area">
          <Table hover className="table-premium mb-0">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>COURSE</th>
                <th className="text-end">DATE</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} onClick={() => navigate(`/admin/students/${s.id}`)} style={{cursor:'pointer'}}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar-circle">
                        {s.photoUrl ? <img src={s.photoUrl} alt="" className="w-100 h-100 rounded-2" style={{objectFit:'cover'}} /> : s.name?.charAt(0)}
                      </div>
                      <span className="fw-700 text-dark" style={{fontSize: '13px'}}>{s.name}</span>
                    </div>
                  </td>
                  <td><span className="badge-sky" style={{fontSize: '10px'}}>{s.course || "General"}</span></td>
                  <td className="text-end text-muted small">
                    {s.createdAt?.toDate?.().toLocaleDateString('en-GB', {day:'2-digit', month:'short'})}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* ENQUIRY CARDS SECTION */}
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3 px-1">
          <h6 className="fw-800 m-0">Recent Enquiries</h6>
          <Link to="/admin/clients-contacts" className="small fw-bold text-decoration-none">All Enquiries</Link>
        </div>
        <Row className="g-3 pb-4">
          {queries.map(q => (
            <Col md={6} lg={3} key={q.id}>
              <div className="enquiry-card" onClick={() => navigate("/admin/clients-contacts")}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="enquiry-icon-sm">
                    <i className="bi bi-person-badge"></i>
                  </div>
                  <Badge bg="info" style={{fontSize: '9px'}}>NEW</Badge>
                </div>
                <div className="fw-800 text-dark small mb-1">{q.fullName || q.name}</div>
                <p className="text-muted m-0 text-truncate" style={{fontSize: '11px'}}>{q.course || "Admission Enquiry"}</p>
                <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
                  <span className="text-primary fw-bold" style={{fontSize: '10px'}}>View Details</span>
                  <small className="text-muted" style={{fontSize: '9px'}}>
                    {q.timestamp?.toDate?.().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </small>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}