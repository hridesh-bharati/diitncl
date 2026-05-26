// src/AdminComponents/Students/StudentList.jsx
import React, { useState, useMemo } from "react";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import StudentCard from "./StudentCard";

const BRANCH_MAP = { Main: "DIIT124", East: "DIIT125" };
const STATUS_OPTIONS = ["all", "pending", "accepted", "done", "canceled"];

const getActualStatus = (s) => {
  if (s.status === "canceled") return "canceled";
  return s.regNo && s.issueDate ? "done" : s.regNo ? "accepted" : "pending";
};

const exportToCSV = (data, status) => {
  if (!data.length) return;
  const headers = ["Reg No", "Name", "Course", "Branch", "Status", "Mobile"];
  const rows = data.map(s => [
    s.regNo || "N/A", s.name, s.course, s.branch || "N/A", getActualStatus(s), s.mobile
  ]);
  const content = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([content], { type: "text/csv" });
  const link = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: `Students_${status}.csv`
  });
  link.click();
};

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  return (
    <AdmissionProvider>
      {({ admissions = [], loading, updateAdmission, deleteAdmission }) => {

        // Core Filter Logic (Only Search & Status - Blazing Fast)
        const filtered = useMemo(() => {
          const term = searchTerm.trim().toLowerCase();
          return admissions.filter(s => {
            const matchesStatus = statusFilter === "all" || getActualStatus(s) === statusFilter;
            const matchesSearch = !term || 
              s.name?.toLowerCase().includes(term) || 
              s.regNo?.toLowerCase().includes(term) || 
              s.mobile?.includes(term);
            return matchesStatus && matchesSearch;
          }).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        }, [admissions, searchTerm, statusFilter]);

        // Pure UI Metric Counts (No useless state attached)
        const mainCount = admissions.filter(s => (s.branch || s.centerCode) === BRANCH_MAP.Main).length;
        const eastCount = admissions.filter(s => (s.branch || s.centerCode) === BRANCH_MAP.East).length;

        return (
          <div className="container-fluid py-3 px-3 mb-5" style={{ backgroundColor: "#fafafa" }}>
            
            {/* Minimal App Title */}
            <div className="mb-3">
              <h5 className="fw-bold text-dark mb-0">Admissions</h5>
              <p className="text-muted small mb-0 opacity-75">Live pipeline updates and student onboarding.</p>
            </div>

            {/* --- PURE UI STAT CARDS (FLAT GRADIENTS, NO BUTTON JUNK) --- */}
            <div className="row g-2 mb-3">
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-3 text-white" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                  <div className="text-uppercase fw-bold opacity-75" style={{ fontSize: '10px' }}>Total Students</div>
                  <div className="fs-3 fw-bold mt-0.5">{admissions.length}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-3 text-white" style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
                  <div className="text-uppercase fw-bold opacity-75" style={{ fontSize: '10px' }}>Main Branch</div>
                  <div className="fs-3 fw-bold mt-0.5">{mainCount}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-3 text-white" style={{ background: "linear-gradient(135deg, #ea580c, #f97316)" }}>
                  <div className="text-uppercase fw-bold opacity-75" style={{ fontSize: '10px' }}>East Branch</div>
                  <div className="fs-3 fw-bold mt-0.5">{eastCount}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-3 text-white" style={{ background: "linear-gradient(135deg, #0284c7, #06b6d4)" }}>
                  <div className="text-uppercase fw-bold opacity-75" style={{ fontSize: '10px' }}>Filtered</div>
                  <div className="fs-3 fw-bold mt-0.5">{filtered.length}</div>
                </div>
              </div>
            </div>

            {/* --- ULTRA CLEAN INLINE CONTROLS (PC + MOBILE INLINE) --- */}
            <div className="bg-white p-2 border-bottom mb-4 rounded-2">
              <div className="d-flex align-items-center gap-2">
                
                {/* Search Box */}
                <div className="position-relative flex-grow-1">
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-2 text-muted small"></i>
                  <input
                    type="text"
                    className="form-control border-0 bg-light ps-4 py-2 rounded-2"
                    style={{ fontSize: "14px" }}
                    placeholder="Search here..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Minimal Status Dropdown */}
                <div>
                  <select 
                    className="form-select border-0 bg-light rounded-2 py-2 fw-bold text-secondary" 
                    style={{ fontSize: "13px", width: "110px", cursor: 'pointer' }}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s === 'all' ? 'All ' : s.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* Native Share Icon for Export */}
                <button 
                  onClick={() => exportToCSV(filtered, statusFilter)} 
                  className="btn btn-light border-0 rounded-2 p-2 d-flex align-items-center justify-content-center text-primary"
                  style={{ width: "38px", height: "38px" }}
                  disabled={!filtered.length}
                >
                  <i className="bi bi-share-fill"></i>
                </button>

              </div>
            </div>

            {/* Grid Area */}
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary"></div></div>
            ) : (
              <div className="row g-2 g-md-3">
                {filtered.length > 0 ? (
                  filtered.map(student => (
                    <div key={student.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                      <StudentCard student={student} onSave={updateAdmission} onDelete={deleteAdmission} />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center text-muted py-5 bg-white rounded-2 border-bottom">
                    <div className="fw-semibold small">No results found</div>
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