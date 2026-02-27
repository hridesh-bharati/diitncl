// src/AdminComponents/Students/StudentList.jsx
import React, { useState, useCallback, useMemo } from "react";
import { Container, Row, Col, Spinner, Form, InputGroup, Button } from "react-bootstrap";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import StudentCard from "./StudentCard";

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  // ✅ SAVE WITH AUTO DONE LOGIC
  const handleSave = useCallback(async (id, data) => {
    try {
      const updatePayload = { ...data };
      await updateDoc(doc(db, "admissions", id), updatePayload);

      toast.success("Saved", {
        position: "top-center",
        autoClose: 1000
      });
    } catch (e) {
      toast.error(e.message);
    }
  }, []);

  // ❌ DELETE STUDENT
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Delete this student permanently?")) return;

    try {
      await deleteDoc(doc(db, "admissions", id));
      toast.success("Deleted Successfully");
    } catch (e) {
      toast.error("Error deleting student");
    }
  }, []);

  return (
    <AdmissionProvider>
      {({ admissions, loading }) => {
        
        // 🔍 OPTIMIZED FILTERING (using useMemo for performance)
        const filtered = useMemo(() => {
          if (!admissions) return [];
          
          return admissions
            .filter((s) => {
              const status = s.status || "pending";
              const hasRegNo = !!s.regNo;
              const normalizedSearch = searchTerm.trim().toLowerCase();
              
              const matchSearch =
                !normalizedSearch ||
                s.name?.toLowerCase().includes(normalizedSearch) ||
                s.regNo?.toLowerCase().includes(normalizedSearch);

              let matchStatus = false;

              if (statusFilter === "all") {
                matchStatus = true;
              } else if (statusFilter === "pending") {
                // ✅ Pending tab mein wo bhi dikhao jo accepted hain par RegNo nahi hai
                matchStatus = (status === "pending") || (status === "accepted" && !hasRegNo);
              } else {
                matchStatus = status === statusFilter;
              }

              return matchSearch && matchStatus;
            })
            .slice()
            .reverse();
        }, [admissions, searchTerm, statusFilter]);

        // 📊 EXPORT TO CSV FUNCTION
        const handleExport = () => {
          if (filtered.length === 0) return toast.info("No data to export");
          
          const headers = ["Name", "RegNo", "Course", "Status", "Mobile"];
          const csvContent = [
            headers.join(","),
            ...filtered.map(s => `"${s.name}","${s.regNo || 'N/A'}","${s.course}","${s.status}","${s.mobile}"`)
          ].join("\n");

          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Students_${statusFilter}_${new Date().toLocaleDateString()}.csv`;
          a.click();
        };

        return (
          <div className="win11-bg min-vh-100">
            {/* 🧊 Sticky Glass Header */}
            <div className="glass-panel p-4 mb-4 shadow-sm border-0 sticky-top z-3">
              <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Admissions Panel</h5>
                  <small className="text-primary fw-bold text-uppercase" style={{ fontSize: "10px", letterSpacing: "1px" }}>
                    {filtered.length} Applications Found
                  </small>
                </div>
                <div className="d-flex gap-2">
                   <Button variant="light" size="sm" className="rounded-pill shadow-sm px-3" onClick={handleExport}>
                      <i className="bi bi-download me-1"></i> Export
                   </Button>
                   <div className="bg-primary text-white p-2 px-3 rounded-pill shadow-sm fw-bold">
                    {filtered.length}
                  </div>
                </div>
              </div>

              {/* 🔍 Search Input */}
              <InputGroup className="bg-white rounded-pill shadow-sm overflow-hidden border border-white mb-3">
                <InputGroup.Text className="bg-white border-0 ps-4">
                  <i className="bi bi-search text-primary" style={{ fontSize: 14 }}></i>
                </InputGroup.Text>
                <Form.Control
                  value={searchTerm}
                  placeholder="Search by name or registration number..."
                  className="border-0 shadow-none py-2 fw-medium text-secondary"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              {/* 🚀 Filter Tabs - REMOVED "done" */}
              <div className="d-flex gap-2 overflow-auto scroll-hide pb-1">
                {["all", "pending", "accepted", "canceled"].map((s) => (
                  <Button
                    key={s}
                    variant={statusFilter === s ? "primary" : "white"}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-pill px-4 border-0 shadow-sm fw-bold small text-uppercase ${
                      statusFilter !== s && "text-muted"
                    }`}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            {/* 📋 Cards Section */}
            <Container fluid className="px-3 pt-2">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="grow" variant="primary" size="sm" />
                </div>
              ) : (
                <Row className="g-3 pb-5">
                  {filtered.map((student) => (
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

                  {/* Empty State */}
                  {filtered.length === 0 && (
                    <Col xs={12}>
                      <div className="glass-panel text-center py-5 mt-3">
                        <i className="bi bi-folder2-open display-4 text-muted mb-3 d-block"></i>
                        <h6 className="text-muted fw-bold">No results matching your criteria</h6>
                        <Button 
                          variant="link" 
                          className="text-decoration-none" 
                          onClick={() => {setSearchTerm(""); setStatusFilter("all");}}
                        >
                          Clear all filters
                        </Button>
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