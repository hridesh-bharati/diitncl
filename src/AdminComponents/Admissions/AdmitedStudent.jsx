import React, { useState, useCallback } from "react";
import { Container, Row, Col, Spinner, Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
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
          <div className="app-main-bg mb-4">
            <div className="app-sticky-header">

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="app-title">Admitted Students</h5>
                <span className="app-badge">{admitted.length}</span>
              </div>

              {/* 🔥 Branch Filter Buttons */}
              <div className="d-flex gap-2 mb-3">
                {["all", "Main", "East"].map(b => (
                  <button
                    key={b}
                    onClick={() => setBranch(b)}
                    className={`app-chip ${branch === b ? "active" : ""}`}
                  >
                    {b} {b === "Main" && "Branch"}
                    {b === "East" && "Branch"}
                  </button>
                ))}
              </div>

              {/* 🔍 Search */}
              <InputGroup className="app-search-bar">
                <InputGroup.Text className="bg-transparent border-0">
                  <Search size={14} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search by name or Reg ID..."
                  className="app-input border-0 shadow-none"
                  onChange={(e) => setQ(e.target.value)} 
                />
              </InputGroup>

            </div>

            <Container fluid className="px-3 pt-3">
              {loading ? (
                <div className="app-loader">
                  <Spinner size="sm" variant="primary" />
                </div>
              ) : (
                <Row className="g-3 pb-5">
                  {admitted.map(student => (
                    <Col key={student.id} xs={12} md={6} lg={4} xl={3}>
                      <StudentCard 
                        student={student} 
                        onSave={handleSave} 
                        onDelete={handleDelete} 
                      />
                    </Col>
                  ))}

                  {admitted.length === 0 && (
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
