// src/AdminComponents/Students/AdmittedList.jsx
import React, { useState, useCallback, useMemo } from "react";
import { Container, Row, Col, Badge, Button, Spinner, Form, InputGroup } from "react-bootstrap";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import StudentCard from "../Students/StudentCard";

export default function AdmittedList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");

  // ✅ UPDATE LOGIC
  const handleSave = useCallback(async (id, data) => {
    try {
      await updateDoc(doc(db, "admissions", id), data);
      toast.success("Updated Successfully", { position: "top-center", autoClose: 1000 });
    } catch (e) { 
      toast.error(e.message); 
    }
  }, []);

  // ❌ DELETE LOGIC
  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Delete this student record? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "admissions", id));
        toast.success("Deleted Successfully");
      } catch (e) {
        toast.error("Error deleting record");
      }
    }
  }, []);

  return (
    <AdmissionProvider>
      {({ admissions, loading }) => {

        // 🧠 MEMOIZED FILTERING LOGIC
        const { filteredList, stats } = useMemo(() => {
          if (!admissions) return { filteredList: [], stats: {} };

          // 1. Define who counts as "Admitted" (Matches your 33 count)
          const admittedBase = admissions.filter(s => {
            const status = s.status || "pending";
            return status === "accepted" || status === "done";
          });

          // 2. Calculate Global Stats (Before search filter for consistent UI)
          const globalStats = {
            total: admittedBase.length,
            withRegNo: admittedBase.filter(s => s.regNo).length,
            withoutRegNo: admittedBase.filter(s => !s.regNo).length,
            mainBranch: admittedBase.filter(s => 
              s.branch === "DIIT124" || s.centerCode === "DIIT124" || s.regNo?.startsWith("DIIT124")
            ).length,
            eastBranch: admittedBase.filter(s => 
              s.branch === "DIIT125" || s.centerCode === "DIIT125" || s.regNo?.startsWith("DIIT125")
            ).length
          };

          // 3. Apply Branch & Search Filters
          const filtered = admittedBase
            .filter(s => {
              if (branchFilter === "all") return true;
              const b = s.branch || s.centerCode;
              if (branchFilter === "Main") return b === "DIIT124" || s.regNo?.startsWith("DIIT124");
              if (branchFilter === "East") return b === "DIIT125" || s.regNo?.startsWith("DIIT125");
              return true;
            })
            .filter(s => {
              const term = searchTerm.toLowerCase().trim();
              if (!term) return true;
              return (
                s.name?.toLowerCase().includes(term) ||
                s.regNo?.toLowerCase().includes(term) ||
                s.course?.toLowerCase().includes(term) ||
                s.mobile?.includes(term)
              );
            })
            .sort((a, b) => {
              // Sort by reg number suffix (highest first)
              const getNum = (str) => {
                if (!str) return 0;
                const parts = str.split('/');
                return parseInt(parts[parts.length - 1]) || 0;
              };
              return getNum(b.regNo) - getNum(a.regNo);
            });

          return { filteredList: filtered, stats: globalStats };
        }, [admissions, searchTerm, branchFilter]);

        return (
          <div className="win11-bg min-vh-100" style={{ backgroundColor: "#f0f2f5" }}>

            {/* 🧊 Glass Header (Sticky) */}
            <div className="glass-panel p-4 mb-4 shadow-sm border-0 sticky-top z-3" 
                 style={{ backdropFilter: "blur(15px)", backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 className="fw-bold mb-0 text-dark">Admitted Students</h4>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <small className="text-primary fw-bold text-uppercase" style={{ fontSize: "11px" }}>
                      {stats.total} Total Enrolled
                    </small>
                    {stats.withoutRegNo > 0 && (
                      <Badge bg="warning" text="dark" className="rounded-pill border-0 shadow-sm">
                        {stats.withoutRegNo} Pending Reg No
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="bg-primary text-white p-3 rounded-circle shadow-sm d-none d-md-block">
                  <i className="bi bi-people-fill"></i>
                </div>
              </div>

              {/* 🚀 Branch Selection */}
              <div className="d-flex gap-2 mb-3 overflow-auto pb-2 scroll-hide">
                {[
                  { key: "all", label: "All Students", icon: "bi-grid-fill", count: stats.total },
                  { key: "Main", label: "Main Branch", icon: "bi-building", count: stats.mainBranch },
                  { key: "East", label: "East Branch", icon: "bi-geo-alt", count: stats.eastBranch }
                ].map(b => (
                  <Button
                    key={b.key}
                    variant={branchFilter === b.key ? "primary" : "white"}
                    onClick={() => setBranchFilter(b.key)}
                    className={`rounded-pill px-4 border-0 shadow-sm fw-bold small d-flex align-items-center gap-2 ${
                      branchFilter !== b.key && 'text-muted'
                    }`}
                  >
                    <i className={b.icon}></i>
                    {b.label}
                    <Badge bg={branchFilter === b.key ? "light" : "secondary"} 
                           text={branchFilter === b.key ? "primary" : "white"} 
                           className="ms-1 rounded-pill">
                      {b.count}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* 🔍 Premium Search Bar */}
              <InputGroup className="bg-white rounded-pill shadow-sm overflow-hidden border border-light">
                <InputGroup.Text className="bg-white border-0 ps-4">
                  <i className="bi bi-search text-primary"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by name, reg number, or mobile..."
                  className="border-0 shadow-none py-2 fw-medium text-secondary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>

            <Container fluid className="px-3">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-2">Syncing database...</p>
                </div>
              ) : (
                <Row className="g-3 pb-5">
                  {filteredList.map(student => (
                    <Col key={student.id} xs={12} md={6} lg={4} xl={3}>
                      <div className="glass-card h-100 transition-all hover-up border-0">
                        {/* If RegNo is missing, add a subtle warning border */}
                        {!student.regNo && <div className="bg-warning text-center small fw-bold py-1">MISSING REG NO</div>}
                        <StudentCard
                          student={student}
                          onSave={handleSave}
                          onDelete={handleDelete}
                        />
                      </div>
                    </Col>
                  ))}

                  {/* Empty State */}
                  {filteredList.length === 0 && (
                    <Col xs={12}>
                      <div className="glass-panel text-center py-5 shadow-sm">
                        <i className="bi bi-person-x display-1 text-muted mb-3 d-block"></i>
                        <h5 className="text-muted fw-bold">No Students Found</h5>
                        <p className="text-muted">No one matches your current filter criteria.</p>
                        <Button variant="link" onClick={() => {setSearchTerm(""); setBranchFilter("all")}}>
                          Reset All Filters
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