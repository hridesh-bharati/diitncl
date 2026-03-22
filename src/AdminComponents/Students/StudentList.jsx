// src/AdminComponents/Students/StudentList.jsx
import React, { useState, useMemo } from "react";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import StudentCard from "./StudentCard";

// 1. Helper: Status Logic (Retained all your logic)
const getActualStatus = (s) => {
  if (s.status === "canceled") return "canceled";
  return s.regNo && s.issueDate ? "done" : s.regNo ? "accepted" : "pending";
};

// 2. Helper: CSV Export (Simple & Direct)
const exportToCSV = (data, filterName) => {
  if (!data.length) return;
  const headers = ["Name", "Course", "Reg No", "Branch", "Status", "Mobile", "Email"];
  const rows = data.map(s => [
    s.name, 
    s.course, 
    s.regNo, 
    s.branch || s.centerCode, 
    getActualStatus(s), // Using the actual status for CSV
    s.mobile, 
    s.email
  ]);
  
  const content = [headers, ...rows]
    .map(r => r.map(c => `"${String(c || "").replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const link = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([content], { type: "text/csv" })),
    download: `students_${filterName}.csv`
  });
  link.click();
};

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  return (
    <AdmissionProvider>
      {({ admissions = [], loading, updateAdmission, deleteAdmission }) => {
        
        const filtered = useMemo(() => {
          const term = searchTerm.trim().toLowerCase();
          return admissions
            .filter(s => {
              const matchesStatus = statusFilter === "all" || getActualStatus(s) === statusFilter;
              // 🔍 Search ONLY by Name or RegNo (Features kept)
              const matchesSearch = !term || 
                s.name?.toLowerCase().includes(term) || 
                s.regNo?.toLowerCase().includes(term);
              return matchesStatus && matchesSearch;
            })
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        }, [admissions, searchTerm, statusFilter]);

        return (
          <div className="container-fluid py-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold mb-0">Admissions <span className="badge bg-primary ms-1">{filtered.length}</span></h5>
              <button onClick={() => exportToCSV(filtered, statusFilter)} className="btn btn-success btn-sm rounded-pill px-3 shadow-sm">
                <i className="bi bi-file-earmark-arrow-up"></i> Export
              </button>
            </div>

            {/* Status Tabs */}
            <div className="d-flex gap-2 overflow-auto pb-3 scrollbar-hidden justify-content-lg-center">
              {["all", "pending", "accepted", "done", "canceled"].map(s => (
                <button 
                  key={s} 
                  onClick={() => setStatusFilter(s)} 
                  className={`btn btn-sm rounded-pill px-3 fw-medium ${statusFilter === s ? "btn-primary shadow-sm" : "btn-outline-secondary"}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="position-relative mb-4">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input 
                type="text" 
                className="form-control shadow-sm ps-5 py-2 rounded-4" 
                placeholder="Search name or registration number..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>

            {/* Student Grid */}
            {loading ? (
              <div className="text-center py-5 text-muted small">
                <div className="spinner-border spinner-border-sm me-2 text-primary"></div>
                Loading student records...
              </div>
            ) : (
              <div className="row g-3">
                {filtered.map(student => (
                  <div key={student.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                    {/* student.id ab email hi hoga jo Provider se aa raha hai */}
                    <StudentCard 
                      student={student} 
                      onSave={updateAdmission} 
                      onDelete={deleteAdmission} 
                    />
                  </div>
                ))}
                {!filtered.length && (
                  <div className="text-center py-5 text-muted animate__animated animate__fadeIn">
                    <i className="bi bi-person-exclamation fs-1 d-block mb-2 opacity-25"></i>
                    No records found for "{statusFilter}" status.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }}
    </AdmissionProvider>
  );
}