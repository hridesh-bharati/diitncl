// src/AdminComponents/Students/Exams/admin/pages/AdminCompletedExams.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../../../firebase/firebase";
import { collection, query, where, getDocs, getDoc, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function AdminCompletedExams() {
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCompletedData = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "studentExams"), where("status", "==", "Completed"));
      const snap = await getDocs(q);

      const fullDataPromises = snap.docs.map(async (examDoc) => {
        const data = examDoc.data();
        const studentSnap = await getDoc(doc(db, "admissions", data.studentId));
        const examSnap = await getDoc(doc(db, "exams", data.examId));

        return {
          id: examDoc.id,
          ...data,
          student: studentSnap.exists() ? studentSnap.data() : { name: "Deleted Student", regNo: "N/A" },
          examDetails: examSnap.exists() ? examSnap.data() : { title: "Deleted Exam" }
        };
      });

      const results = await Promise.all(fullDataPromises);
      results.sort((a, b) => b.completedAt?.toMillis() - a.completedAt?.toMillis());
      setCompleted(results);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedData();
  }, []);

  // 🔥 RESET EXAM FUNCTION (Allows student to re-take exam)
  const handleResetExam = async (docId, studentName) => {
    if (window.confirm(`Are you sure you want to RESET the exam for ${studentName}? \nThis will delete their marks and allow them to re-take the exam.`)) {
      try {
        await deleteDoc(doc(db, "studentExams", docId));
        toast.success("Exam reset successfully!");
        // Refresh the list locally
        setCompleted(prev => prev.filter(item => item.id !== docId));
      } catch (err) {
        toast.info("Error resetting exam. Try again.");
      }
    }
  };

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-white">
      <div className="spinner-border text-primary border-4" />
    </div>
  );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4 gap-2">
        <div className="d-flex flex-column">
          {/* Title & Badge Row */}
          <div className="d-flex align-items-center gap-2 mb-1">
            <h5 className="fw-bold mb-0 text-dark text-uppercase" style={{ fontSize: '0.95rem', letterSpacing: '0.5px' }}>
              Completed Exams
            </h5>
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill fw-bold" style={{ fontSize: '8px', padding: '3px 8px' }}>
              LIVE REPORTS
            </span>
          </div>

          {/* Subtext */}
          <p className="text-muted mb-0" style={{ fontSize: '10.5px', fontWeight: '500' }}>
            Manage results & re-attempts
          </p>
        </div>

        {/* Sync Button: Icon only on mobile, text on large screens */}
        <button
          className="btn btn-white border shadow-sm rounded-1 fw-bold text-uppercase px-3 py-2 py-sm-1 ms-auto"
          style={{ fontSize: '10px', minWidth: 'fit-content' }}
          onClick={fetchCompletedData}
        >
          <i className="bi bi-arrow-clockwise text-primary me-lg-1"></i>
          <span className="d-none d-lg-inline">Sync Data</span>
        </button>
      </div>
      <div className="card border-0 shadow-sm rounded-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="bg-dark text-white shadow-sm">
              <tr style={{ fontSize: '11px' }}>
                <th className="ps-4 py-3 text-uppercase fw-bold">Student Details</th>
                <th className="py-3 text-uppercase fw-bold text-center">Exam Title</th>
                <th className="py-3 text-uppercase fw-bold text-center">Final Score</th>
                <th className="py-3 text-uppercase fw-bold text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {completed.length > 0 ? completed.map((c) => (
                <tr key={c.id} className="bg-white border-bottom">
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={c.student?.photoUrl || `https://ui-avatars.com/api/?name=${c.student?.name}&background=random`}
                        alt=""
                        className="rounded-0 border shadow-sm"
                        style={{ width: "45px", height: "45px", objectFit: "cover" }}
                      />
                      <div>
                        <div className="fw-bold text-dark mb-0 text-uppercase" style={{ fontSize: '12px' }}>{c.student?.name}</div>
                        <div className="small text-muted fw-bold" style={{ fontSize: '10px' }}>
                          REG: {c.student?.regNo} | <span className="text-primary">{c.student?.course}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="text-center">
                    <span className="fw-bold text-dark small text-uppercase">{c.examDetails?.title}</span>
                  </td>

                  <td className="text-center">
                    <div className="badge bg-success rounded-0 px-3 py-2 fw-bold" style={{ fontSize: '11px' }}>
                      {c.score} / {c.examDetails?.totalMarks || '--'}
                    </div>
                  </td>

                  <td className="text-end pe-4">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-0 fw-bold"
                        onClick={() => navigate(`../result/${c.id}`)}
                        title="View Full Report"
                      >
                        <i className="bi bi-file-earmark-pdf"></i> REPORT
                      </button>

                      {/* 🔥 RESET BUTTON */}
                      <button
                        className="btn btn-sm btn-outline-danger rounded-0 fw-bold"
                        onClick={() => handleResetExam(c.id, c.student?.name)}
                        title="Reset/Delete Record"
                      >
                        <i className="bi bi-trash3-fill"></i> DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted fw-bold opacity-50 uppercase">
                    No completed records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}