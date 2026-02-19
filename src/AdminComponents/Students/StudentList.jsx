// src/AdminComponents/Admissions/StudentList.jsx
import React, { useState, useCallback } from "react";
import { Container, Row, Col, Spinner, Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
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

            const matchSearch =
              !searchTerm ||
              s.name?.toLowerCase().includes(searchTerm.toLowerCase());

            let matchStatus = true;

            if (statusFilter === "accepted") {
              const percentage = s.percentage;

              const hasPercentage =
                percentage !== undefined &&
                percentage !== null &&
                percentage !== "" &&
                Number(percentage) > 0;

              // Accepted BUT no percentage only
              matchStatus = status === "accepted" && !hasPercentage;

            } else if (statusFilter !== "all") {
              matchStatus = status === statusFilter;
            }

            return matchSearch && matchStatus;
          })
          .slice()
          .reverse();


        return (
          <div className="app-main-bg">
            <div className="app-sticky-header">
              <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                <h5 className="app-title">All Admissions</h5>
                <span className="app-badge bg-primary text-white">{filtered.length}</span>
              </div>

              <InputGroup className="app-search-bar mb-3">
                <InputGroup.Text className="bg-transparent border-0">
                  <Search size={14} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by name..."
                  className="app-input border-0 shadow-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <div className="d-flex gap-2 overflow-auto no-scrollbar pb-1">
                {['all', 'pending', 'accepted', 'canceled'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`app-chip ${statusFilter === s ? 'active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <Container fluid className="px-3 pt-3">
              {loading ? (
                <div className="app-loader">
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              ) : (
                <Row className="g-3 pb-5">
                  {filtered.map(student => (
                    <Col key={student.id} xs={12} md={6} lg={4} xl={3}>
                      <StudentCard
                        student={student}
                        onSave={handleSave}
                        onDelete={handleDelete}
                      />
                    </Col>
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-center text-muted py-5 w-100">
                      No students found
                    </div>
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