import React, { useState, useEffect, useMemo } from "react";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Container, Row, Col, Badge, Button, Spinner, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

export default function AdaptiveAdminQueries() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null);

  // 🔄 Realtime Listener (Optimized Map)
  useEffect(() => {
    const q = query(collection(db, "studentQueries"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snap) => {
      setData(snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(), 
        dt: d.data().timestamp?.toDate() 
      })));
      setLoading(false);
    }, () => toast.error("Sync Error"));
  }, []);

  // 🎯 Logic: Memoized Filter & Formatter
  const filtered = useMemo(() => 
    data.filter(d => filter === "all" || (filter === "pending" ? d.status !== "reviewed" : d.status === "reviewed")),
    [data, filter]
  );

  const fmt = d => d?.toLocaleString("en-IN", { 
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true 
  }) || "Syncing...";

  // ⚡ Actions
  const handleToggle = async (q) => {
    try {
      await updateDoc(doc(db, "studentQueries", q.id), { status: q.status === "reviewed" ? "pending" : "reviewed" });
    } catch { toast.error("Update failed"); }
  };

  const handleRemove = async () => {
    try {
      await deleteDoc(doc(db, "studentQueries", modal.id));
      toast.success("Deleted");
    } catch { toast.error("Delete failed"); }
    setModal(null);
  };

  return (
    <div className="win11-bg py-4 px-2 min-vh-100">
      <Container>
        {/* Header Section */}
        <div className="glass-panel p-4 mb-4 d-flex justify-content-between align-items-center shadow-sm">
          <div>
            <h5 className="fw-bold mb-0 text-dark">Query Inbox</h5>
            <small className="text-primary fw-bold uppercase">{filtered.length} Requests Found</small>
          </div>
          <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
            <i className="bi bi-chat-square-dots-fill fs-4"></i>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="glass-panel p-2 mb-4 d-flex gap-2 overflow-auto scroll-hide">
          {["all", "pending", "reviewed"].map(f => (
            <Button key={f}
              variant={filter === f ? "primary" : "white"}
              onClick={() => setFilter(f)}
              className="rounded-pill px-4 border-0 shadow-sm fw-bold small text-uppercase flex-grow-1 flex-md-grow-0"
            >
              {f === "pending" ? "New" : f === "reviewed" ? "Solved" : "All"}
            </Button>
          ))}
        </div>

        {/* Grid Content */}
        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
        ) : (
          <Row className="g-3">
            {filtered.length === 0 && <p className="text-center text-muted py-5">No queries found for this filter.</p>}
            {filtered.map((q) => (
              <Col xs={12} md={6} lg={4} key={q.id}>
                <div className="glass-card p-4 h-100 d-flex flex-column border-0 shadow-sm transition-all hover-up">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>{fmt(q.dt)}</small>
                    <Badge bg={q.status === "reviewed" ? "success" : "danger"} className="rounded-pill">
                      {q.status === "reviewed" ? "SOLVED" : "NEW"}
                    </Badge>
                  </div>

                  <h6 className="fw-bold text-dark mb-1">{q.fullName || "Anonymous User"}</h6>
                  <p className="text-primary small fw-bold mb-2">{q.title || "Support Request"}</p>
                  <p className="text-muted small flex-grow-1 mb-4 overflow-hidden" style={{ lineHeight: '1.5' }}>
                    {q.query}
                  </p>

                  <div className="d-flex gap-2 mt-auto">
                    <Button variant="light" className="flex-grow-1 rounded-4 border-0 text-primary fw-bold" onClick={() => handleToggle(q)}>
                      {q.status === "reviewed" ? "REOPEN" : "RESOLVE"}
                    </Button>
                    <Button variant="light" className="rounded-4 border-0 text-danger px-3" onClick={() => setModal(q)}>
                      <i className="bi bi-trash3-fill"></i>
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Delete Modal */}
      <Modal show={!!modal} onHide={() => setModal(null)} centered contentClassName="border-0 shadow">
        <Modal.Body className="glass-panel text-center p-4 rounded-4">
          <div className="display-6 text-danger mb-3"><i className="bi bi-exclamation-octagon"></i></div>
          <h6 className="fw-bold">Permanently Delete?</h6>
          <p className="small text-muted mb-4">You cannot undo this action.</p>
          <div className="d-flex gap-2">
            <Button variant="light" className="w-100 rounded-pill border-0" onClick={() => setModal(null)}>KEEP</Button>
            <Button variant="danger" className="w-100 rounded-pill shadow-sm fw-bold" onClick={handleRemove}>DELETE</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}