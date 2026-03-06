// src\AdminComponents\Students\StudentList.jsx

import React, { useState, useMemo } from "react";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import StudentCard from "./StudentCard";

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  return (
    <AdmissionProvider>
      {({ admissions = [], loading, updateAdmission, deleteAdmission }) => {

        // 🔹 Filtered & searched admissions
        // 🔹 Filtered, Searched & Sorted admissions
        const filtered = useMemo(() => {
          const term = searchTerm.trim().toLowerCase();

          return admissions
            .filter((s) => {
              // 1. Determine Status (Sync with StudentCard logic)
              let actualStatus = "pending";
              if (s.status === "canceled") {
                actualStatus = "canceled";
              } else if (s.regNo && s.issueDate) {
                actualStatus = "done";
              } else if (s.regNo) {
                actualStatus = "accepted";
              } else {
                actualStatus = "pending";
              }

              // 2. Apply Status Filter
              const matchStatus = statusFilter === "all" || actualStatus === statusFilter;

              // 3. Apply Search Filter
              const matchSearch =
                !term ||
                s.name?.toLowerCase().includes(term) ||
                s.regNo?.toLowerCase().includes(term);

              return matchStatus && matchSearch;
            })
            .sort((a, b) => {
              // 4. Sort by creation date (newest first)
              // Firebase Timestamp ya normal date handle karne ke liye fallback use kiya hai
              const dateA = a.createdAt?.seconds || (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
              const dateB = b.createdAt?.seconds || (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);

              // Agar dates same hain toh ID se tie-break karega
              return dateB - dateA || (b.id && a.id ? b.id.localeCompare(a.id) : 0);
            });
        }, [admissions, searchTerm, statusFilter]);
        // 🔹 CSV Export
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
          link.download = `students_${statusFilter}.csv`;
          link.click();
        };

        return (
          <div className="container-fluid py-4">
            {/* 🔹 Header Section */}
            <div className="mb-4">
              <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3">

                {/* Left: Title + Export */}
                <div className="d-flex justify-content-start align-items-center gap-3 w-100 w-lg-50">
                  <h5 className="fw-bold mb-0 text-nowrap">Admissions ({filtered.length})</h5>
                  <button
                    onClick={handleExportCSV}
                    className="btn btn-sm btn-success rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
                  >
                    <i className="bi bi-file-earmark-arrow-up"></i> Export CSV
                  </button>
                </div>

                {/* Right: Status Filters */}
                <div className="d-flex gap-1 overflow-auto pb-1 w-100 w-lg-50 justify-content-lg-end" style={{ whiteSpace: "nowrap" }}>
                  {["all", "pending", "accepted", "done", "canceled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`btn btn-sm rounded-pill px-3 fw-medium ${statusFilter === s ? "btn-primary shadow-sm" : "btn-outline-secondary"
                        }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* 🔹 Search */}
            <input
              type="text"
              className="form-control mb-4 shadow-sm"
              style={{ borderRadius: "12px", padding: "12px" }}
              placeholder="Search by name or Reg No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* 🔹 Content */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <div className="mt-2 text-muted">Loading Students...</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5 text-muted bg-light rounded-4 border border-dashed">
                <i className="bi bi-people fs-1 d-block mb-2"></i>
                No students found in "{statusFilter}" category
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