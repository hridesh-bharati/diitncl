// src\AdminComponents\Students\TestExamByAdminProvider\AdminPracticeResults.jsx
import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";
import BackButton from "../../../Components/HelperCmp/BackButton/BackButton";

export default function AdminPracticeResults({ preSelectedEmail = "", isStudentView = false }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);

  // Naye filter states
  const [filterCourse, setFilterCourse] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "practiceResults"),
          where("status", "==", "Completed")
        );

        const unsubSnap = onSnapshot(q, (snap) => {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          // Latest results at top
          setResults(list.sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0)));
          setLoading(false);
        }, (error) => {
          console.error("Firestore Error:", error);
          setLoading(false);
        });
        return () => unsubSnap();
      } else {
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      try {
        await deleteDoc(doc(db, "practiceResults", id));
        toast.success("Result deleted successfully");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const exportToPDF = () => {
    const element = document.getElementById("admin-pdf-content");
    const opt = {
      margin: 10,
      filename: `${selectedResult.studentName || 'Student'}_Result.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  // Unique Courses list nikalne ke liye
  const courseOptions = useMemo(() => {
    const subjects = results.map(r => r.testTitle);
    return [...new Set(subjects)].filter(Boolean);
  }, [results]);

  // Combined Filter Logic
const filtered = useMemo(() => {
  return results.filter((r) => {
    // Agar profile se aaye hain, to sirf wahi email dikhao
    const matchesEmail = preSelectedEmail ? r.studentEmail?.toLowerCase() === preSelectedEmail : true;
    
    const matchesSearch =
      r.testTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = filterCourse === "" || r.testTitle === filterCourse;

    let matchesDate = true;
    if (filterDate) {
      const docDate = r.submittedAt?.toDate ? r.submittedAt.toDate().toISOString().split('T')[0] : "";
      matchesDate = docDate === filterDate;
    }

    return matchesEmail && matchesSearch && matchesCourse && matchesDate;
  });
}, [results, searchTerm, filterCourse, filterDate, preSelectedEmail]);

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary border-4" /></div>;

  return (
    <div className="container py-3 bg-light min-vh-100">

      {/* FILTER HEADER */}
      <div className="bg-white p-3 rounded-4 shadow-sm mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-lg-3">
            <div className="d-flex align-items-center gap-2">
              <BackButton />
              <h5 className="fw-bold mb-0">Exam Records</h5>
            </div>
          </div>

          <div className="col-12 col-md-4 col-lg-3">
            <input
              type="text"
              className="form-control form-control-sm rounded-pill px-3 border-light bg-light"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="col-6 col-md-4 col-lg-3">
            <select
              className="form-select form-select-sm rounded-pill border-light bg-light"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            >
              <option value="">All Subjects</option>
              {courseOptions.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>

          <div className="col-6 col-md-4 col-lg-3">
            <input
              type="date"
              className="form-control form-control-sm rounded-pill border-light bg-light"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* RESULTS GRID */}
      <div className="row g-3">
        {filtered.length > 0 ? filtered.map((r) => {
          const percent = parseFloat(r.percentage || 0);
          return (
            <div className="col-12 col-md-6" key={r.id}>
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between">
                    <div className="overflow-hidden">
                      <div className="fw-bold text-truncate">{r.testTitle}</div>
                      <div className="text-primary small fw-bold">{r.studentName || "No Name"}</div>
                      <div className="text-muted small" style={{ fontSize: '11px' }}>
                        {r.submittedAt?.toDate().toLocaleDateString()} | {r.studentEmail}
                      </div>
                    </div>
                    <button className="btn text-danger btn-sm border-0" onClick={() => handleDelete(r.id)}>
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                  <div className="d-flex justify-content-between mt-3 small fw-bold">
                    <span>Score: {r.score}/{r.totalQuestions}</span>
                    <span className={percent >= 40 ? 'text-success' : 'text-danger'}>{percent}%</span>
                  </div>
                  <button className="btn btn-dark w-100 rounded-pill mt-2 btn-sm fw-bold shadow-sm" onClick={() => setSelectedResult(r)}>View Full Review</button>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-12 text-center py-5 text-muted">
            No records found.
          </div>
        )}
      </div>

      {/* MODAL (Review) */}
      {selectedResult && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 bg-white pt-4 px-4 pb-2">
                <h6 className="fw-bold mb-0">Review: {selectedResult.studentName}</h6>
                <div className="ms-auto d-flex gap-2">
                  <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={exportToPDF}>Export PDF</button>
                  <button type="button" className="btn-close" onClick={() => setSelectedResult(null)}></button>
                </div>
              </div>
              <div className="modal-body p-2 bg-light" id="admin-pdf-content">
                <div className="p-3 mb-4 bg-white rounded-3 shadow-sm border-start border-4 border-primary">
                  <h5 className="fw-bold mb-1">{selectedResult.testTitle}</h5>
                  <p className="small text-muted mb-0">Student: {selectedResult.studentName} | Email: {selectedResult.studentEmail}</p>
                  <p className="small text-muted mb-0">Score: {selectedResult.score}/{selectedResult.totalQuestions} ({selectedResult.percentage}%)</p>
                  <p className="small text-muted mb-0">Date: {selectedResult.submittedAt?.toDate().toLocaleString()}</p>
                </div>
                {selectedResult.fullDetails?.map((item, idx) => (
                  <div key={idx} className="card border-0 shadow-sm rounded-4 mb-3 p-3">
                    <div className="fw-bold small mb-2 text-dark">Q{idx + 1}. {item.question}</div>
                    {item.options.map((opt, i) => {
                      const isCorrect = i === item.correctOption;
                      const isSelected = i === item.selectedOption;
                      return (
                        <div key={i} className={`p-2 rounded-3 small border mb-1 ${isCorrect ? 'bg-success-subtle border-success text-success fw-bold' : isSelected ? 'bg-danger-subtle border-danger text-danger' : 'bg-white text-muted'}`}>
                          {opt} {isSelected && <span className="float-end badge bg-dark text-white rounded-pill">CHOICE</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}