import React, { useState, useMemo } from "react";
import { useAdmissions } from "../Admissions/AdmissionProvider";
import StudentCard, { getActualStatus } from "./StudentCard";

const BRANCH_MAP = { Main: "DIIT124", East: "DIIT125" };
const STATUSES = [
  { id: "all", label: "All Status", icon: "bi-grid-fill", cls: "text-muted" },
  { id: "pending", label: "Pending", icon: "bi-clock-history", cls: "text-warning" },
  { id: "accepted", label: "Accepted", icon: "bi-check-circle-fill", cls: "text-info" },
  { id: "done", label: "Done", icon: "bi-patch-check-fill", cls: "text-success" },
  { id: "canceled", label: "Canceled", icon: "bi-x-circle-fill", cls: "text-danger" }
];

const exportToCSV = (data, name) => {
  if (!data.length) return;
  const headers = ["Reg No", "Name", "Course", "Branch", "Status", "Mobile"];
  const rows = data.map(s => [s.regNo || "N/A", s.name, s.course || "General", s.branch || "N/A", getActualStatus(s), s.mobile]);
  const content = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([content], { type: "text/csv" });
  const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `Students_${name}.csv` });
  link.click();
};

export default function StudentList() {
  const { admissions, loading, updateAdmission, deleteAdmission } = useAdmissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [branchFilter, setBranchFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return admissions.filter(s => {
      return (statusFilter === "all" || getActualStatus(s) === statusFilter) &&
        (branchFilter === "all" || (s.branch || s.centerCode) === BRANCH_MAP[branchFilter]) &&
        (!term || [s.name, s.regNo, s.mobile].some(f => f?.toLowerCase().includes(term)));
    });
  }, [admissions, searchTerm, statusFilter, branchFilter]);

  const activeStatus = STATUSES.find(s => s.id === statusFilter);

  const renderStatusDropdown = () => STATUSES.map(s => (
    <li key={s.id}>
      <button className={`dropdown-item d-flex align-items-center justify-content-between py-2 small ${statusFilter === s.id ? "fw-bold text-primary bg-light" : ""}`} onClick={() => setStatusFilter(s.id)}>
        <span className="d-flex align-items-center gap-2"><i className={`bi ${s.icon} ${s.cls}`}></i>{s.label}</span>
        {statusFilter === s.id && <i className="bi bi-check2 text-primary"></i>}
      </button>
    </li>
  ));

  if (loading) return <div className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary"></div></div>;

  return (
    <div className="card border overflow-hidden rounded-3" style={{ minHeight: "90vh" }}>
      <div className="bg-white sticky-top shadow-sm px-3 py-2" style={{ zIndex: 1020, top: 0 }}>
        {isSearching ? (
          <div className="d-flex align-items-center w-100 py-1 d-md-none">
            <button onClick={() => { setIsSearching(false); setSearchTerm(""); }} className="btn btn-link text-dark p-0 me-2">
              <i className="bi bi-arrow-left fs-5"></i>
            </button>
            <div className="position-relative flex-grow-1">
              <input type="text" className="form-control border-0 bg-light shadow-none py-2 ps-4 pe-5 rounded-pill" style={{ fontSize: "14px" }} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} autoFocus />
              {searchTerm && <i className="bi bi-x-circle-fill position-absolute end-0 top-50 translate-middle-y me-3 text-muted" onClick={() => setSearchTerm("")}></i>}
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-between align-items-center py-1">
            <h5 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2" style={{ letterSpacing: "-0.5px" }}>
              <i className="bi bi-person-badge-fill"></i> Admissions
              <span className="badge bg-light text-secondary border rounded-pill fw-semibold" style={{ fontSize: "10px" }}>{filtered.length}</span>
            </h5>

            <div className="d-none d-md-block flex-grow-1 mx-4" style={{ maxWidth: "350px" }}>
              <div className="position-relative">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input type="text" className="form-control border-0 shadow-none ps-5 py-2 rounded-pill" style={{ fontSize: "14px", backgroundColor: "#f0f2f5" }} placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="d-flex gap-2 align-items-center">
              <button onClick={() => setIsSearching(true)} className="btn btn-light rounded-circle p-0 border-0 d-md-none d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", background: "#e4e6eb" }}>
                <i className="bi bi-search text-dark" style={{ fontSize: "14px" }}></i>
              </button>
              
              <div className="dropdown d-md-none">
                <button className="btn btn-light rounded-circle p-0 border-0 d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" style={{ width: "36px", height: "36px", background: statusFilter !== "all" ? "#e7f3ff" : "#e4e6eb", color: statusFilter !== "all" ? "#1877f2" : "#000" }}>
                  <i className="bi bi-sliders" style={{ fontSize: "14px" }}></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">{renderStatusDropdown()}</ul>
              </div>

              <button onClick={() => exportToCSV(filtered, statusFilter)} className="btn btn-light rounded-circle p-0 border-0 d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", background: "#e4e6eb" }} disabled={!filtered.length}>
                <i className="bi bi-download" style={{ fontSize: "14px" }}></i>
              </button>
            </div>
          </div>
        )}

        {!isSearching && (
          <div className="d-flex align-items-center justify-content-between pt-2 mt-1 border-top gap-2">
            <div className="d-flex p-1 rounded-pill bg-light flex-grow-1" style={{ backgroundColor: "#f0f2f5" }}>
              {["all", "Main", "East"].map(b => {
                const count = b === "all" ? admissions.length : admissions.filter(s => (s.branch || s.centerCode) === BRANCH_MAP[b]).length;
                const isAct = branchFilter === b;
                return (
                  <button key={b} onClick={() => setBranchFilter(b)} className="btn btn-sm rounded-pill border-0 fw-bold flex-fill py-1" style={{ fontSize: "12px", backgroundColor: isAct ? "#fff" : "transparent", color: isAct ? "#1877f2" : "#65676b", boxShadow: isAct ? "0 1px 2px rgba(0,0,0,0.1)" : "none" }}>
                    {b === "all" ? "All" : b} ({count})
                  </button>
                );
              })}
            </div>

            <div className="dropdown d-none d-md-block">
              <button className="btn btn-sm rounded-pill border-0 fw-bold px-3 py-1.5 d-flex align-items-center gap-1.5" type="button" data-bs-toggle="dropdown" style={{ backgroundColor: statusFilter !== "all" ? "#e7f3ff" : "#e4e6eb", color: statusFilter !== "all" ? "#1877f2" : "#050505" }}>
                <i className="bi bi-sliders"></i> {activeStatus?.label}
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
                {renderStatusDropdown()}
                {statusFilter !== "all" && (
                  <li><button className="dropdown-item text-center text-danger fw-bold pt-2 border-top small" onClick={() => setStatusFilter("all")}>Reset Status</button></li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="px-2 mt-2">
        <div className="row g-2 mb-4 mb-lg-0">
          {filtered.length > 0 ? (
            filtered.map(st => (
              <div key={st.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                <StudentCard student={st} onSave={updateAdmission} onDelete={deleteAdmission} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-muted py-5 bg-white rounded-3 border">
              <i className="bi bi-hourglass-split display-6 opacity-50 d-block mb-2"></i>
              <div className="fw-bold">No Pending Record</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}