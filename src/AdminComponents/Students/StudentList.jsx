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
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSave = useCallback(async (id, data) => {
    try {
      await updateDoc(doc(db, "admissions", id), data);
      toast.success("Saved", { position: "top-center", autoClose: 1000 });
    } catch (e) { toast.error(e.message); }
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Delete student?")) return;
    try { await deleteDoc(doc(db, "admissions", id)); toast.success("Deleted"); } catch (e) { toast.error("Error"); }
  }, []);

  return (
    <AdmissionProvider>
      {({ admissions, loading }) => {
        const filtered = admissions
          .filter(s => {
            const matchSearch = !searchTerm || s.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === "all" || (s.status || "pending") === statusFilter;
            return matchSearch && matchStatus;
          })
          .slice().reverse(); // REVERSE LOGIC

        return (
          <div className="app-main-bg">
            <div className="app-sticky-header">
              <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                <h5 className="app-title">All Admissions</h5>
                <span className="app-badge bg-primary text-white">{filtered.length}</span>
              </div>
              <InputGroup className="app-search-bar mb-3">
                <Search size={14} className="text-muted ms-3" /><Form.Control placeholder="Search name..." className="app-input" onChange={(e) => setSearchTerm(e.target.value)} />
              </InputGroup>
              <div className="d-flex gap-2 overflow-auto no-scrollbar">
                {['all', 'pending', 'accepted', 'canceled'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} className={`app-chip ${statusFilter === s ? 'active' : ''}`}>{s}</button>
                ))}
              </div>
            </div>
            <Container fluid className="px-3 pt-3">
              {loading ? <div className="app-loader"><Spinner size="sm" variant="primary" /></div> : (
                <Row className="g-3 pb-5">
                  {filtered.map(student => (
                    <Col key={student.id} xs={12} md={6} lg={4} xl={3}><StudentCard student={student} onSave={handleSave} onDelete={handleDelete} /></Col>
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