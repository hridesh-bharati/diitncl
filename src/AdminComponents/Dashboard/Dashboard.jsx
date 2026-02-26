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

  const STAT_CARDS = [
    { label: "Total Students", val: counts.total, icon: "bi-people-fill", bg: "linear-gradient(135deg,#6366f1,#8b5cf6)", link: "/admin/admitted-student-list" },
    { label: "New Today", val: counts.today, icon: "bi-lightning-fill", bg: "linear-gradient(135deg,#10b981,#3b82f6)", link: "/admin/students" },
    { label: "Enquiries", val: counts.queries, icon: "bi-chat-left-dots-fill", bg: "linear-gradient(135deg,#f59e0b,#ef4444)", link: "/admin/clients-contacts" },
    { label: "Gallery", val: "12", icon: "bi-images", bg: "linear-gradient(135deg,#ec4899,#f43f5e)", link: "/gallery" }
  ];

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border" variant="primary" /></div>;

  return (
    <Container fluid className="dashboard-wrapper">
      <header className="mb-3 d-flex justify-content-between align-items-center px-1">
        <h4 className="fw-bolder text-dark m-0">Admin Console</h4>
        <Badge bg="white" text="primary" className="border px-3 py-2 rounded-pill shadow-sm">SYSTEM LIVE</Badge>
      </header>

      <Row className="g-3 mb-4">
        {STAT_CARDS.map((card, i) => (
          <Col xs={6} lg={3} key={i}>
            <div
              className="stat-card p-3 mb-3 rounded-4 shadow-sm position-relative"
              style={{ background: card.bg, cursor: 'pointer' }}
              onClick={() => navigate(card.link)}
            >
              {/* Watermark Icon */}
              <div
                className="position-absolute end-0 bottom-0 opacity-25"
                style={{ fontSize: '3rem', transform: 'translate(10px, 10px) rotate(-15deg)' }}
              >
                <i className={`bi ${card.icon} text-white`}></i>
              </div>

              {/* Content */}
              <div className="position-relative" style={{ zIndex: 2 }}>
                {/* Icon + Value Side by Side */}
                <div className="d-flex align-items-center mb-1">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center me-3"
                    style={{ background: 'rgba(255,255,255,0.2)', width: '40px', height: '40px' }}
                  >
                    <i className={`bi ${card.icon} text-white fs-4`}></i>
                  </div>
                  <h2 className="text-white fw-bold mb-0">{card.val}</h2>
                </div>

                {/* Label Below */}
                <p className="small fw-bold mb-0">{card.label}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <div className="full-width-card border-0 shadow-sm">
        <div className="p-3 d-flex justify-content-between align-items-center bg-white">
          <h6 className="fw-800 m-0 text-dark">Recent Admissions (Top 5)</h6>
          <Link to="/admin/admitted-student-list" className="small fw-bold text-decoration-none">View All</Link>
        </div>

        <div className="scroll-area">
          <Table hover className="table-premium mb-0 border-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 ps-3 small text-muted fw-600">STUDENT</th>
                <th className="border-0 pe-3 text-end small text-muted fw-600">DATE</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                // Derive branch from regNo
                let branch = "Unknown";
                let branchColor = "secondary";
                if (s.regNo?.startsWith("DIIT124")) { branch = "Main"; branchColor = "primary"; }
                else if (s.regNo?.startsWith("DIIT125")) { branch = "East"; branchColor = "success"; }

                return (
                  <tr key={s.id} onClick={() => navigate(`/admin/students/${s.id}`)} style={{ cursor: 'pointer' }} className="border-0">
                    <td className="border-0 ps-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar-circle">
                          {s.photoUrl ? <img src={s.photoUrl} alt="" className="w-100 h-100 rounded-2" style={{ objectFit: 'cover' }} /> : s.name?.charAt(0)}
                        </div>
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center gap-1">
                            <span className="fw-700 text-dark" style={{ fontSize: '13px' }}>{s.name}</span>
                            <Badge bg={branchColor} className="fw-bold py-0 px-1" style={{ fontSize: '9px', borderRadius: '4px' }}>
                              {branch}
                            </Badge>
                          </div>
                          <span className="text-muted" style={{ fontSize: '10px', marginTop: '-2px' }}>{s.course}</span>
                        </div>
                      </div>
                    </td>
                    <td className="border-0 pe-3 text-end text-muted" style={{ fontSize: '11px' }}>
                      {s.createdAt?.toDate?.().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3 px-1">
          <h6 className="fw-800 m-0">Recent Enquiries</h6>
          <Link to="/admin/clients-contacts" className="small fw-bold text-decoration-none">All Enquiries</Link>
        </div>
        <Row className="g-3 pb-5 mb-5 mb-lg-0">
          {queries.map(q => (
            <Col xs={6} md={3} key={q.id}>
              <div className="enquiry-card" onClick={() => navigate("/admin/clients-contacts")}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="fw-800 text-dark small text-truncate" style={{ maxWidth: '75%' }}>{q.fullName || q.name}</div>
                  <Badge bg="info" style={{ fontSize: '8px' }}>NEW</Badge>
                </div>
                <p className="text-muted m-0 text-truncate" style={{ fontSize: '11px' }}>{q.title || "Admission Inquiry"}</p>
                <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
                  <span className="text-primary fw-bold" style={{ fontSize: '10px' }}>View Details</span>
                  <small className="text-muted" style={{ fontSize: '9px' }}>
                    {q.timestamp?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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