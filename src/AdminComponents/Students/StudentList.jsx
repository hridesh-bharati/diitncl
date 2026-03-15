// src\AdminComponents\Students\StudentList.jsx

import React, { useState, useMemo } from "react";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import StudentCard from "./StudentCard";

// 🔹 Helper to determine status (Keep it outside to prevent re-declaration)
const getActualStatus = (s) => {
  if (s.status === "canceled") return "canceled";
  if (s.regNo && s.issueDate) return "done";
  if (s.regNo) return "accepted";
  return "pending";
};

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  return (
    <AdmissionProvider>
      {({ admissions = [], loading, updateAdmission, deleteAdmission }) => {

        // 🔹 Optimized Filter, Search & Sort
        const filtered = useMemo(() => {
          const term = searchTerm.trim().toLowerCase();

          return admissions
            .filter((s) => {
              const actualStatus = getActualStatus(s);

              const matchStatus = statusFilter === "all" || actualStatus === statusFilter;
              const matchSearch = !term ||
                s.name?.toLowerCase().includes(term) ||
                s.regNo?.toLowerCase().includes(term);

              return matchStatus && matchSearch;
            })
            .sort((a, b) => {
              // Get numeric timestamps
              const getTime = (date) => date?.seconds || (date instanceof Date ? date.getTime() / 1000 : 0);
              const diff = getTime(b.createdAt) - getTime(a.createdAt);

              // Sort by date, then by ID as tie-breaker
              return diff !== 0 ? diff : (b.id || "").localeCompare(a.id || "");
            });
        }, [admissions, searchTerm, statusFilter]);

        // 🔹 CSV Export (Maintained all original headers)
        const handleExportCSV = () => {
          if (!filtered.length) return;

          const headers = [
            "Name", "Course", "Reg No", "Branch", "Status", "Percentage", "Admission Date",
            "Issue Date", "Mobile", "Email", "Father Name", "Mother Name", "Aadhar No",
            "Qualification", "DOB", "Gender", "Category", "Village", "Post", "Thana",
            "City", "State", "Pincode", "Address", "Photo URL"
          ];

          const rows = filtered.map((s) => [
            s.name || "", s.course || "", s.regNo || "", s.branch || s.centerCode || "",
            s.status || "", s.percentage || "", s.admissionDate || "", s.issueDate || "",
            s.mobile || "", s.email || "", s.fatherName || "", s.motherName || "",
            s.aadharNo || "", s.qualification || "", s.dob || "", s.gender || "",
            s.category || "", s.village || "", s.post || "", s.thana || "",
            s.city || "", s.state || "", s.pincode || "", s.address || "", s.photoUrl || ""
          ]);

          const csvContent = [headers, ...rows]
            .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
            .join("\n");

          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `students_${statusFilter}_${new Date().toLocaleDateString()}.csv`;
          link.click();
        };

        return (
          <div className="container-fluid py-4 mb-5 mb-lg-0">
            {/* 🔹 Header: Improved Layout Consistency */}
            <div className="mb-4 border-bottom pb-2">

              {/* Row 1 : Title + Export */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold mb-0">
                  Admissions
                  <span className="badge bg-primary ms-2">{filtered.length}</span>
                </h5>

                <button
                  onClick={handleExportCSV}
                  className="btn btn-success btn-sm rounded-pill px-3 d-flex align-items-center gap-1 shadow-sm"
                > <i className="bi bi-file-earmark-arrow-up"></i> Export CSV
                </button>
              </div>

              {/* Row 2 : Filters */}
              <div className="d-flex justify-content-start justify-content-lg-center gap-2 overflow-auto pb-1 scrollbar-hidden">
                {["all", "pending", "accepted", "done", "canceled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`btn btn-sm rounded-pill px-3 fw-medium ${statusFilter === s
                      ? "btn-primary shadow-sm"
                      : "btn-outline-secondary"
                      }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

            </div>
            {/* 🔹 Search Input */}
            <div className="position-relative mb-4">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type="text"
                className="form-control shadow-sm ps-5"
                style={{ borderRadius: "12px", padding: "12px 12px 12px 45px" }}
                placeholder="Search by name or Reg No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* 🔹 Content Display */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <div className="mt-2 text-muted">Fetching Student Records...</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5 text-muted bg-light rounded-4 border border-dashed">
                <i className="bi bi-people fs-1 d-block mb-2"></i>
                No records found in <strong>{statusFilter}</strong>
              </div>
            ) : (
              <div className="row g-3">
                {filtered.map((student) => (
                  <div key={student.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                    <StudentCard
                      student={student}
                      onSave={updateAdmission}
                      onDelete={deleteAdmission}
                    />
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