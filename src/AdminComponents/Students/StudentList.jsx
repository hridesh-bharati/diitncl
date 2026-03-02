// src/AdminComponents/Students/StudentList.jsx

import React, { useState, useMemo } from "react";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import StudentCard from "./StudentCard";

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  return (
    <AdmissionProvider>
      {({ admissions = [], loading }) => {
        // 🔹 Filtered & searched admissions
        const filtered = useMemo(() => {
          const term = searchTerm.trim().toLowerCase();

          return admissions
            .filter((s) => {
              const status = s.status || "pending";
              const matchStatus = statusFilter === "all" || status === statusFilter;

              const matchSearch =
                !term ||
                s.name?.toLowerCase().includes(term) ||
                s.regNo?.toLowerCase().includes(term);

              return matchStatus && matchSearch;
            })
            .slice()
            .reverse();
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

                {/* Left: Title + Export (50%) */}
                <div className="d-flex justify-content-start align-items-center gap-3 w-100 w-lg-50">
                  <h5 className="fw-bold mb-0 text-nowrap">Admissions ({filtered.length})</h5>
                  <button
                    onClick={handleExportCSV}
                    className="btn btn-sm btn-success rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
                  >
                    <i className="bi bi-file-earmark-arrow-up"></i> Export CSV
                  </button>
                </div>

                {/* Right: Status Filters (50%) */}
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
              className="form-control mb-4"
              placeholder="Search by name or Reg No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* 🔹 Content */}
            {loading ? (
              <div className="text-center py-5">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5 text-muted">No students found</div>
            ) : (
              <div className="row g-3">
                {filtered.map((student) => (
                  <div key={student.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                    <StudentCard student={student} />
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