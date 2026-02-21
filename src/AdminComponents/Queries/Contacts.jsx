// src/AdminComponents/Queries/Contacts.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Container, Row, Col, Card, Badge, Button, Spinner, Modal } from "react-bootstrap";
import { Trash3, Check2Circle, Inbox, Clock, ArrowCounterclockwise } from "react-bootstrap-icons";

export default function AdaptiveAdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState({ show: false, query: null });

  /* ===============================
     🔴 REALTIME QUERY LISTENER
  =============================== */
  useEffect(() => {
    const q = query(collection(db, "studentQueries"), orderBy("timestamp", "desc"));

    const unsub = onSnapshot(q, snapshot => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));

      setQueries(docs);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* ===============================
     STATUS + DELETE
  =============================== */
  const toggleStatus = async (q) => {
    await updateDoc(doc(db, "studentQueries", q.id), {
      status: q.status === "reviewed" ? "pending" : "reviewed"
    });
  };

  const deleteQuery = async () => {
    await deleteDoc(doc(db, "studentQueries", modal.query.id));
    setModal({ show: false, query: null });
  };

  const filtered = queries.filter(q => {
    if (filter === "pending" && q.status === "reviewed") return false;
    if (filter === "reviewed" && q.status !== "reviewed") return false;
    return true;
  });

  return (
    <div className="win11-bg py-4 px-1">
      <Container fluid="lg">

        {/* Header */}
        <div className="glass-panel p-4 mb-4 d-flex justify-content-between align-items-center shadow-sm">
          <div>
            <h3 className="fw-bold mb-0">Query Dashboard</h3>
            <small className="text-muted">{filtered.length} active sessions</small>
          </div>
          <div className="bg-primary text-white p-2 rounded-3 shadow">
            <Inbox size={24} />
          </div>
        </div>

        {/* Filters */}
        <div className="glass-panel p-2 mb-4 d-flex gap-2 overflow-auto">
          {["all", "pending", "reviewed"].map(f => (
            <Button
              key={f}
              variant={filter === f ? "primary" : "light"}
              onClick={() => setFilter(f)}
              className="rounded-pill px-4 flex-grow-1 flex-lg-grow-0"
              style={{ minWidth: '100px' }}
            >
              {f === "all" ? "All" : f === "pending" ? "New" : "Solved"}
            </Button>
          ))}
        </div>

        {/* Queries Grid */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="grow" variant="primary" />
          </div>
        ) : (
          <Row className="g-3 mb-5 pb-5 mb-lg-0 pb-lg-0">
            {filtered.map((q) => (
              <Col xs={12} md={6} lg={3} key={q.id}>
                <Card className="glass-card h-100 shadow-sm border-0">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between mb-2">
                      <Badge bg={q.status === 'reviewed' ? "secondary" : "danger"} pill>
                        {q.status === 'reviewed' ? "Closed" : "Active"}
                      </Badge>
                      <small className="text-muted">
                        <Clock size={12} /> {q.timestamp.getHours()}:{q.timestamp.getMinutes()}
                      </small>
                    </div>

                    <h6 className="fw-bold mb-1 text-truncate">{q.fullName || "Anonymous"}</h6>
                    <p className="small text-primary fw-semibold mb-2">{q.title}</p>
                    <p className="small text-secondary flex-grow-1" style={{ fontSize: '0.85rem' }}>
                      {q.query.length > 80 ? q.query.substring(0, 80) + "..." : q.query}
                    </p>

                    <div className="d-flex gap-2 mt-3">
                      <Button
                        variant="white"
                        className="glass-panel flex-grow-1 btn-sm border-0 shadow-sm d-flex align-items-center justify-content-center"
                        onClick={() => toggleStatus(q)}
                      >
                        {q.status === "reviewed"
                          ? <ArrowCounterclockwise />
                          : <Check2Circle color="green" size={18} />
                        }
                      </Button>

                      <Button
                        variant="white"
                        className="glass-panel btn-sm border-0 text-danger shadow-sm d-flex align-items-center justify-content-center"
                        onClick={() => setModal({ show: true, query: q })}
                      >
                        <Trash3 size={18} />
                      </Button>
                    </div>

                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Delete Modal */}
      <Modal
        show={modal.show}
        onHide={() => setModal({ show: false, query: null })}
        centered
        contentClassName="glass-panel border-0"
      >
        <Modal.Body className="p-4 text-center">
          <h5 className="fw-bold">Remove Query?</h5>
          <p className="text-muted">This will permanently delete the ticket.</p>
          <div className="d-flex gap-2">
            <Button
              variant="light"
              className="w-100 rounded-pill"
              onClick={() => setModal({ show: false, query: null })}
            >
              Keep
            </Button>
            <Button
              variant="danger"
              className="w-100 rounded-pill"
              onClick={deleteQuery}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}