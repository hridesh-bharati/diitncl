import React, { useState, useCallback } from "react";
import { Container, Row, Col, Spinner, Form, InputGroup, Button } from "react-bootstrap";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import StudentCard from "./StudentCard";

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  const handleSave = useCallback(async (id, data) => {
    try {
      await updateDoc(doc(db, "admissions", id), data);
      toast.success("Saved", { position: "top-center", autoClose: 1000 });
    } catch (e) {
      toast.error(e.message);
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteDoc(doc(db, "admissions", id));
      toast.success("Deleted");
    } catch (e) {
      toast.error("Error deleting");
    }
  }, []);

  return (
    <AdmissionProvider>
      {({ admissions, loading }) => {
        const filtered = admissions
          .filter((s) => {
            const status = s.status || "pending";
            const matchSearch = !searchTerm || s.name?.toLowerCase().includes(searchTerm.toLowerCase());

            let matchStatus = true;
            if (statusFilter === "accepted") {
              const p = s.percentage;
              const hasPercentage = p !== undefined && p !== null && p !== "" && Number(p) > 0;
              matchStatus = status === "accepted" && !hasPercentage;
            } else if (statusFilter !== "all") {
              matchStatus = status === statusFilter;
            }
            return matchSearch && matchStatus;
          })
          .slice().reverse();

        return (
          <div className="win11-bg min-vh-100">
            {/* 🧊 Sticky Glass Header */}
            <div className="glass-panel p-4 mb-4 shadow-sm border-0 sticky-top top-0 z-3">
              <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Admissions Panel</h5>
                  <small className="text-primary fw-bold text-uppercase" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                    {filtered.length} Applications Found
                  </small>
                </div>
                <div className="bg-primary text-white p-2 px-3 rounded-pill shadow-sm fw-bold">
                  {filtered.length}
                </div>
              </div>

              {/* 🔍 Search Bar */}
              <InputGroup className="bg-white rounded-pill shadow-sm overflow-hidden border border-white mb-3">
                <InputGroup.Text className="bg-white border-0 ps-4">
                  <i className="bi bi-search text-primary" style={{ fontSize: "14px" }}></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search student by name..."
                  className="border-0 shadow-none py-2 fw-medium text-secondary"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              {/* 🚀 Filter Chips */}
              <div className="d-flex gap-2 overflow-auto scroll-hide pb-1">
                {['all', 'pending', 'accepted', 'canceled'].map(s => (
                  <Button
                    key={s}
                    variant={statusFilter === s ? "primary" : "white"}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-pill px-4 border-0 shadow-sm fw-bold small text-uppercase ${statusFilter !== s && 'text-muted'}`}
                  >
                    {s === 'accepted' ? 'Regular' : s}
                  </Button>
                ))}
              </div>
            </div>

            {/* 📋 Cards Content */}
            <Container fluid className="px-3 pt-2">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="grow" variant="primary" size="sm" />
                </div>
              ) : (
                <Row className="g-3 pb-5">
                  {filtered.map(student => (
                    <Col key={student.id} xs={12} md={6} lg={4} xl={3}>
                      <div className="glass-card h-100 transition-all hover-up">
                        <StudentCard
                          student={student}
                          onSave={handleSave}
                          onDelete={handleDelete}
                        />
                      </div>
                    </Col>
                  ))}

                  {filtered.length === 0 && (
                    <Col xs={12}>
                      <div className="glass-panel text-center py-5 mt-3">
                        <i className="bi bi-folder2-open display-4 text-muted mb-3 d-block"></i>
                        <h6 className="text-muted fw-bold">No results matching your criteria</h6>
                        <small className="text-muted">Try changing the filter or search term</small>
                      </div>
                    </Col>
                  )}
                </Row>
              )}
            </Container>
          </div>
        );
      }}
    </AdmissionProvider>
  );
}