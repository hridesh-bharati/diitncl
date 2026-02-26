import React, { useState, useCallback } from "react";
import { Container, Row, Col, Badge, Button, Spinner, Form, InputGroup } from "react-bootstrap";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import StudentCard from "../Students/StudentCard";
export default function AdmittedList() {
  const [q, setQ] = useState("");
  const [branch, setBranch] = useState("all");

  const handleSave = useCallback(async (id, data) => {
    try {
      await updateDoc(doc(db, "admissions", id), data);
      toast.success("Updated", { position: "top-center", autoClose: 1000 });
    } catch (e) { toast.error(e.message); }
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Delete record?")) {
      await deleteDoc(doc(db, "admissions", id));
      toast.success("Deleted");
    }
  }, []);

  return (
    <AdmissionProvider>
      {({ admissions, loading }) => {

        const admitted = admissions
          .filter(s => s.regNo) // only admitted

          // 🔥 Branch filter using RegNo prefix
          .filter(s => {
            if (branch === "all") return true;
            if (branch === "Main") return s.regNo?.startsWith("DIIT124");
            if (branch === "East") return s.regNo?.startsWith("DIIT125");
            return true;
          })

          // 🔍 Search by name or regNo
          .filter(s =>
            !q ||
            s.name?.toLowerCase().includes(q.toLowerCase()) ||
            s.regNo?.toLowerCase().includes(q.toLowerCase())
          )

          // 🔢 Sort latest reg number first
          .sort((a, b) => {
            const getNum = (str) => {
              const parts = str.split('/');
              return parseInt(parts[parts.length - 1]) || 0;
            };
            return getNum(b.regNo) - getNum(a.regNo);
          });

        return (
          <div className="win11-bg py-4 px-2 min-vh-100">
            <Container fluid="lg">

              {/* 🧊 Header & Search Section (Sticky-Glass) */}
              <div className="glass-panel p-4 mb-4 shadow-sm border-0 sticky-top top-0 z-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 className="fw-bold mb-0 text-dark">Admitted Students</h4>
                    <small className="text-primary fw-bold text-uppercase ls-1">
                      {admitted.length} Students Enrolled
                    </small>
                  </div>
                  <div className="bg-primary text-white p-3 rounded-circle shadow-sm">
                    <i className="bi bi-people-fill"></i>
                  </div>
                </div>

                {/* 🚀 Branch Filter Chips */}
                <div className="d-flex gap-2 mb-3 overflow-auto pb-2 scroll-hide">
                  {["all", "Main", "East"].map(b => (
                    <Button
                      key={b}
                      variant={branch === b ? "primary" : "white"}
                      onClick={() => setBranch(b)}
                      className={`rounded-pill px-4 border-0 shadow-sm fw-bold small text-uppercase ${branch !== b && 'text-muted'}`}
                    >
                      {b} {b !== "all" ? "Branch" : ""}
                    </Button>
                  ))}
                </div>

                {/* 🔍 Premium Search Bar */}
                <InputGroup className="bg-white rounded-pill shadow-sm overflow-hidden border border-white">
                  <InputGroup.Text className="bg-white border-0 ps-4">
                    <i className="bi bi-search text-primary"></i>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by student name or Registration ID..."
                    className="border-0 shadow-none py-2 fw-medium text-secondary"
                    onChange={(e) => setQ(e.target.value)}
                  />
                </InputGroup>
              </div>

              {/* 📋 Students Grid Content */}
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="grow" variant="primary" />
                </div>
              ) : (
                <Row className="g-3">
                  {admitted.map(student => (
                    <Col key={student.id} xs={12} md={6} lg={4} xl={3}>
                      {/* StudentCard component me bhi glass-card class ensure karein */}
                      <div className="glass-card h-100 transition-all hover-up border-0">
                        <StudentCard
                          student={student}
                          onSave={handleSave}
                          onDelete={handleDelete}
                        />
                      </div>
                    </Col>
                  ))}

                  {/* Empty State */}
                  {admitted.length === 0 && (
                    <Col xs={12}>
                      <div className="glass-panel text-center py-5">
                        <i className="bi bi-person-exclamation display-4 text-muted mb-3 d-block"></i>
                        <h6 className="text-muted fw-bold">No students found for this filter</h6>
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
