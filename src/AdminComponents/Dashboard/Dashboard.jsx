import React, { useState, useEffect, useMemo } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import {
  PersonCircle,
  PeopleFill,
  EnvelopeFill,
  Images,
  ArrowRight,
  Telephone,
  LightningFill
} from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Badge, Table } from "react-bootstrap";
import "./Dashboard.css";

export default function Dashboard() {

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [queries, setQueries] = useState([]);
  const [galleryCount, setGalleryCount] = useState(0);
  const [loading, setLoading] = useState({ students: true, queries: true, gallery: true });
  const [stats, setStats] = useState({ totalStudents: 0, admittedToday: 0, pendingQueries: 0 });

  useEffect(() => {

    const unsubStudents = onSnapshot(
      query(collection(db, "admissions"), orderBy("createdAt", "desc")),
      (snap) => {
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const today = new Date().toDateString();

        setStudents(data.slice(0, 6));

        setStats(prev => ({
          ...prev,
          totalStudents: snap.size,
          admittedToday: data.filter(
            s => s.createdAt?.toDate?.().toDateString() === today
          ).length
        }));

        setLoading(prev => ({ ...prev, students: false }));
      }
    );

    const unsubQueries = onSnapshot(
      query(collection(db, "studentQueries"), orderBy("timestamp", "desc")),
      (snap) => {
        setQueries(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setStats(prev => ({ ...prev, pendingQueries: snap.size }));
        setLoading(prev => ({ ...prev, queries: false }));
      }
    );

    const unsubGallery = onSnapshot(collection(db, "galleryImages"), (snap) => {
      setGalleryCount(snap.size);
      setLoading(prev => ({ ...prev, gallery: false }));
    });

    return () => {
      unsubStudents();
      unsubQueries();
      unsubGallery();
    };

  }, []);

  const STAT_CARDS = useMemo(() => ([
    { label: "Students", value: stats.totalStudents, icon: <PeopleFill />, bg: "linear-gradient(135deg,#6366f1,#8b5cf6)", link: "/admin/admitted-student-list" },
    { label: "New Today - Adm", value: stats.admittedToday, icon: <LightningFill />, bg: "linear-gradient(135deg,#10b981,#3b82f6)", link: "/admin/students" },
    { label: "Enquiries", value: stats.pendingQueries, icon: <EnvelopeFill />, bg: "linear-gradient(135deg,#f59e0b,#ef4444)", link: "/admin/clients-contacts" },
    { label: "Gallery", value: loading.gallery ? "..." : galleryCount, icon: <Images />, bg: "linear-gradient(135deg,#ec4899,#f43f5e)", link: "/gallery" }
  ]), [stats, galleryCount, loading.gallery]);

  return (
    <Container
      fluid
      className="py-3 py-lg-5 px-3 px-lg-5"
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >

      {/* HEADER */}
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <span className="text-primary fw-bold small text-uppercase">Admin Console</span>
          <h2 className="fw-800 text-dark m-0 d-none d-md-block">Institute Insights</h2>
          <h4 className="fw-800 text-dark m-0 d-md-none">Dashboard</h4>
        </div>
        <div className="glass-card p-2 px-3 rounded-4 shadow-sm border border-white text-end">
          <div className="fw-bold text-dark small">
            {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
          </div>
          <small className="text-muted d-block" style={{ fontSize: '10px' }}>System Active</small>
        </div>
      </header>

      {/* STAT CARDS */}
      <Row className="g-3 g-lg-4 mb-4">
        {STAT_CARDS.map((card, i) => (
          <Col xs={6} lg={3} key={i}>
            <Link to={card.link} className="text-decoration-none">
              <div className="stat-card p-3 p-lg-4 h-100" style={{ background: card.bg }}>
                <div className="watermark-icon">
                  {React.cloneElement(card.icon)}
                </div>
                <div className="content-on-top">
                  <div className="d-flex ms-2">
                    <div className="icon-badge mb-2 mb-lg-3">
                      {React.cloneElement(card.icon, { size: 18 })}
                    </div>
                    <h3 className="fw-800 text-white m-0 ms-4 pt-2 lh-1">{card.value}</h3>
                  </div>
                  <div className="text-white opacity-75 small fw-600 mt-1">
                    {card.label}
                  </div>
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-5 pb-2">

        {/* ADMISSIONS TABLE */}
        <Col lg={8}>
          <Card className="main-card border-0 shadow-sm h-100 overflow-hidden">
            <Card.Header className="bg-white border-0 p-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-800 m-0 text-dark">Recent Admissions</h5>
              <Link to="/admin/admitted-student-list" className="btn-pill-sm">View All</Link>
            </Card.Header>

            <div className="table-responsive px-2 px-lg-4 pb-4">
              <Table hover align="middle" className="m-0 custom-table">
                <thead className="d-none d-md-table-header-group">
                  <tr>
                    <th>Student Details</th>
                    <th>Course</th>
                    <th className="text-end">Registered</th>
                  </tr>
                </thead>

                <tbody>
                  {loading.students ? (
                    <tr>
                      <td colSpan="3" className="text-center py-5">
                        <Spinner animation="border" variant="primary" size="sm" />
                      </td>
                    </tr>
                  ) : students.map(s => (
                    <tr
                      key={s.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/admin/students/${s.id}`)}
                    >
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-box me-3">
                            {s.photoUrl
                              ? <img src={s.photoUrl} alt="" />
                              : <PersonCircle size={30} className="text-secondary opacity-25" />}
                          </div>
                          <div className="d-flex flex-column">
                            <span className="fw-700 text-dark" style={{ fontSize: '14px' }}>
                              {s.name}
                            </span>
                            <span className="d-md-none" style={{ fontSize: '11px' }}>
                              {s.course}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="d-none d-md-table-cell">
                        <Badge pill className="badge-soft-indigo text-white">
                          {s.course}
                        </Badge>
                      </td>

                      <td className="text-end text-muted small fw-500">
                        {s.createdAt?.toDate?.().toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </Table>
            </div>
          </Card>
        </Col>

        {/* LIVE ENQUIRIES */}
        <Col lg={4}>
          <Card className="main-card border-0 shadow-sm bg-white">
            <Card.Header className="bg-transparent border-0 p-4">
              <h5 className="fw-800 m-0 text-dark">Live Enquiries</h5>
            </Card.Header>
            <Card.Body className="p-4 pt-0">
              {loading.queries ? (
                <div className="text-center py-4">
                  <Spinner animation="grow" variant="warning" size="sm" />
                </div>
              ) : queries.slice(0, 4).map(q => (
                <div key={q.id} className="query-card p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="fw-700 text-dark small">{q.fullName}</span>
                    <span className="time-tag">
                      {q.timestamp?.toDate?.().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="text-muted small text-truncate mb-3">
                    {q.title || "Subject not specified"}
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <a href={`tel:${q.mobile}`} className="call-link">
                      <Telephone size={12} className="me-2" />
                      Call Student
                    </a>

                    <Link to="/admin/clients-contacts" className="text-primary">
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}

              <Link to="/admin/clients-contacts" className="btn-dark-modern w-100 mt-2">
                All Enquiries ({stats.pendingQueries})
              </Link>
            </Card.Body>
          </Card>
        </Col>

      </Row>

    </Container>
  );
}
