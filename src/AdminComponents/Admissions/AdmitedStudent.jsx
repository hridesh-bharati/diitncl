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
          .filter(s => s.regNo && (
            !q || 
            s.name?.toLowerCase().includes(q.toLowerCase()) || 
            s.regNo?.toLowerCase().includes(q.toLowerCase())
          ))
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
              <InputGroup className="app-search-bar">
                <Search size={14} className="text-muted ms-3 mt-2" />
                <Form.Control 
                  placeholder="Search name or ID..." 
                  className="app-input" 
                  onChange={(e) => setQ(e.target.value)} 
                />
              </InputGroup>
            </div>
            <Container fluid className="px-3 pt-3">
              {loading ? (
                <div className="app-loader"><Spinner size="sm" variant="primary" /></div>
              ) : (
                <Row className="g-3 pb-5">
                  {admitted.map(student => (
                    <Col key={student.id} xs={12} md={6} lg={4} xl={3}>
                      <StudentCard student={student} onSave={handleSave} onDelete={handleDelete} />
                    </Col>
                  ))}
                </Row>
              )}
            </Container>
          </div>
        );
      }}
    </AdmissionProvider>
  );
}