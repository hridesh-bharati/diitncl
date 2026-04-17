// src/AdminComponents/Students/StudentList.jsx
import React, { useState, useMemo } from "react";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import StudentCard from "./StudentCard";

const getActualStatus = (s) => {
  if (s.status === "canceled") return "canceled";
  return s.regNo && s.issueDate ? "done" : s.regNo ? "accepted" : "pending";
};

// Simplified CSV Export
const exportToCSV = (data, filterName) => {
  if (!data.length) return;
  const headers = ["Reg No", "Name", "Course", "Branch", "Status", "Mobile"];
  const rows = data.map(s => [s.regNo || "N/A", s.name, s.course, s.branch || "N/A", getActualStatus(s), s.mobile]);
  const content = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([content], { type: "text/csv" });
  const link = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: `Students_${filterName}.csv`
  });
  link.click();
};

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [branchFilter, setBranchFilter] = useState("all");

  const BRANCH_MAP = { Main: "DIIT124", East: "DIIT125" };

  return (
    <AdmissionProvider>
      {({ admissions = [], loading, updateAdmission, deleteAdmission }) => {

        const filtered = useMemo(() => {
          const term = searchTerm.trim().toLowerCase();
          return admissions.filter(s => {
            const bCode = s.branch || s.centerCode;
            const matchesStatus = statusFilter === "all" || getActualStatus(s) === statusFilter;
            const matchesBranch = branchFilter === "all" || bCode === BRANCH_MAP[branchFilter];
            const matchesSearch = !term || s.name?.toLowerCase().includes(term) || s.regNo?.toLowerCase().includes(term) || s.mobile?.includes(term);
            return matchesStatus && matchesBranch && matchesSearch;
          }).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        }, [admissions, searchTerm, statusFilter, branchFilter]);

        return (
          <div className="container-fluid py-3 mb-5">
            {/* Header Area */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0 text-uppercase tracking-wider">
                Admissions <span className="badge rounded-pill bg-soft-primary text-primary ms-1" style={{ background: '#e0e7ff' }}>{filtered.length}</span>
              </h6>
              <button onClick={() => exportToCSV(filtered, statusFilter)} className="btn btn-sm btn-success rounded-pill px-3 shadow-sm border-0">
                <i className="bi bi-download me-1"></i> Export
              </button>
            </div>

            {/* App Controls Section */}
            <div className="bg-white sticky-top pt-2 shadow-none" style={{ zIndex: 1020 }}>
              {/* Branch & Total DRY Buttons */}
              <div className="d-flex justify-content-center gap-2 mb-2">
                {['Main', 'East'].map(b => {
                  // Branch wise count nikalne ke liye logic
                  const count = admissions.filter(s => (s.branch || s.centerCode) === BRANCH_MAP[b]).length;

                  return (
                    <button
                      key={b}
                      onClick={() => setBranchFilter(branchFilter === b ? 'all' : b)}
                      className={`btn btn-sm flex-fill rounded-3 border-0 shadow-sm transition-all ${branchFilter === b ? 'btn-primary' : 'bg-light text-dark'}`}
                    >
                      {b} ({count})
                    </button>
                  );
                })}

                {/* Total Button jo click karne par 'all' filter reset kar dega */}
                <button
                  onClick={() => { setBranchFilter('all'); setStatusFilter('all'); }}
                  className={`btn btn-sm rounded-3 border-0 shadow-sm px-3 ${branchFilter === 'all' ? 'btn-dark' : 'bg-light text-dark'}`}
                >
                  Total: {admissions.length}
                </button>
              </div>

              {/* Status Chips (Horizontal Scroll) */}
              <div className="d-flex gap-2 overflow-auto pb-3 scrollbar-hidden">
                {["all", "pending", "accepted", "done", "canceled"].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`btn btn-sm rounded-pill px-3 border-0 whitespace-nowrap ${statusFilter === s ? "btn-primary shadow-sm" : "bg-light text-muted"}`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="position-relative mb-4">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input
                  type="text"
                  className="form-control border-0 bg-light shadow-none ps-5 py-2 rounded-4"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Grid Area */}
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary"></div></div>
            ) : (
              <div className="row g-3">
                {filtered.map(student => (
                  <div key={student.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                    <StudentCard student={student} onSave={updateAdmission} onDelete={deleteAdmission} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }}
    </AdmissionProvider>
  );
}