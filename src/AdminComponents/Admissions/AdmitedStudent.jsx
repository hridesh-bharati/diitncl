import React, { useState, useMemo, useEffect } from "react";
import { useAdmissions } from "./AdmissionProvider";
import StudentCard, { getActualStatus } from "../Students/StudentCard";

const BRANCH_MAP = { Main: "DIIT124", East: "DIIT125" };
const ITEMS_PER_PAGE = 8;

export default function AdmittedList() {
  const { admissions, loading, updateAdmission, deleteAdmission } = useAdmissions();
  const [branchFilter, setBranchFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, branchFilter]);

  const { filteredList, stats } = useMemo(() => {
    let counts = { all: 0, main: 0, east: 0 };
    const search = searchTerm.toLowerCase().trim();

    // Base filter: Only show accepted or done students
    const admittedStudents = admissions.filter(s => {
      const actStat = getActualStatus(s);
      return actStat === "accepted" || actStat === "done";
    });

    counts.all = admittedStudents.length;

    const list = admittedStudents.filter((s) => {
      const bCode = s.branch || s.centerCode;
      if (bCode === BRANCH_MAP.Main) counts.main++;
      if (bCode === BRANCH_MAP.East) counts.east++;

      return (branchFilter === "all" || bCode === BRANCH_MAP[branchFilter]) &&
        (!search || [s.name, s.regNo, s.phone, s.mobile].some(f => f?.toLowerCase().includes(search)));
    });
    return { filteredList: list, stats: counts };
  }, [admissions, branchFilter, searchTerm]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredList.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredList, currentPage]);

  if (loading) return <div className="text-center py-5 text-muted"><div className="spinner-border spinner-border-sm text-primary me-2"></div>Loading...</div>;

  return (
    <div className="container-fluid py-3 min-vh-100 bg-light-subtle">
      
      {/* --- MINIMAL APP BAR HEADER --- */}
      <div className="bg-white sticky-top shadow-sm rounded-3 p-2 mb-3 border row g-2 align-items-center z-3">
        <div className="col-12 col-md-4 d-flex align-items-center justify-content-between justify-content-md-start gap-2">
          <h6 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-patch-check-fill"></i> Admitted ({filteredList.length})
          </h6>
          <span className="badge bg-light text-dark border d-md-none">Total: {stats.all}</span>
        </div>

        <div className="col-12 col-md-8 d-flex gap-2">
          <div className="position-relative flex-grow-1">
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted small"></i>
            <input type="text" className="form-control form-control-sm border-0 bg-light ps-5 rounded-pill shadow-none" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="d-flex bg-light p-0 m-0 rounded-pill border">
            {["Main", "East"].map((b) => {
              const isSelected = branchFilter === b;
              return (
                <button
                  key={b}
                  className={`btn btn-sm rounded-pill border-0 fw-bold px-3 text-nowrap small ${isSelected ? "bg-white text-primary shadow-sm" : "text-secondary"}`}
                  onClick={() => setBranchFilter(isSelected ? "all" : b)}
                >
                  {b[0]} ({stats[b.toLowerCase()]})
                </button>
              );
            })}
          </div>
          <button className="btn btn-sm btn-warning rounded-pill px-3 fw-bold text-dark d-none d-md-block small" disabled>Total: {stats.all}</button>
        </div>
      </div>

      {/* --- STUDENT LISTING GRID --- */}
      <div className="row g-2 px-1 mb-3">
        {paginatedStudents.map((s) => (
          <div key={s.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <StudentCard student={s} onDelete={deleteAdmission} onSave={updateAdmission} />
          </div>
        ))}
        {!filteredList.length && <div className="col-12 text-center py-5 text-muted bg-white rounded border shadow-sm fw-bold">No records found.</div>}
      </div>

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 my-4 pb-5 pb-lg-0">
          <button className="btn btn-sm btn-light bg-white border shadow-sm px-3 fw-bold rounded-pill" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            <i className="bi bi-chevron-left me-1"></i> Prev
          </button>
          <span className="fw-bold text-secondary small">{currentPage} / {totalPages}</span>
          <button className="btn btn-sm btn-light bg-white border shadow-sm px-3 fw-bold rounded-pill" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            Next <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      )}

    </div>
  );
}