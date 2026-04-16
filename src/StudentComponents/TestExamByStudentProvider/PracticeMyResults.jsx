import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import html2pdf from "html2pdf.js";

export default function PracticeMyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email.toLowerCase().trim();
        const q = query(
          collection(db, "practiceResults"), 
          where("studentEmail", "==", email),
          where("status", "==", "Completed")
        );

        const unsubSnap = onSnapshot(q, (snap) => {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setResults(list.sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0)));
          setLoading(false);
        });
        return () => unsubSnap();
      } else {
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  const exportPDF = () => {
    const element = document.getElementById("student-pdf-view");
    const opt = {
      margin: 10,
      filename: `Result_${selectedResult.testTitle}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const filtered = useMemo(() => results.filter((r) => 
    r.testTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [results, searchTerm]);

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary border-4" /></div>;

  return (
    <div className="container py-4 bg-light min-vh-100">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <h5 className="fw-bold mb-0 text-dark">My Results</h5>
            <input type="text" className="form-control form-control-sm rounded-pill px-3 border-0 bg-light w-auto shadow-none" placeholder="Filter..." onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light text-muted small">
                <tr>
                  <th>DATE & PAPER</th>
                  <th className="text-center">SCORE</th>
                  <th className="text-center">RESULT</th>
                  <th className="text-end">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="fw-bold small">{r.testTitle}</div>
                      <div className="text-muted" style={{fontSize: '10px'}}>{r.submittedAt?.toDate()?.toLocaleDateString()}</div>
                    </td>
                    <td className="text-center fw-bold text-primary">{r.score}/{r.totalQuestions}</td>
                    <td className="text-center">
                      <span className={`badge rounded-pill ${parseFloat(r.percentage) >= 40 ? 'bg-success' : 'bg-danger'}`} style={{fontSize:'10px'}}>
                        {parseFloat(r.percentage) >= 40 ? 'PASSED' : 'FAILED'} ({r.percentage}%)
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-dark btn-sm rounded-pill px-3 fw-bold shadow-sm" onClick={() => setSelectedResult(r)}>Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedResult && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 bg-white pt-4 px-4 pb-2">
                <h5 className="fw-bold mb-0">Detailed Review</h5>
                <div className="ms-auto d-flex gap-2">
                    <button className="btn btn-primary btn-sm rounded-pill px-3 fw-bold" onClick={exportPDF}>Export PDF</button>
                    <button type="button" className="btn-close shadow-none" onClick={() => setSelectedResult(null)}></button>
                </div>
              </div>
              <div className="modal-body p-4 bg-light" id="student-pdf-view">
                <div className="p-3 mb-4 bg-white rounded-3 shadow-sm border-start border-4 border-primary">
                    <h5 className="fw-bold mb-1">{selectedResult.testTitle}</h5>
                    <p className="small text-muted mb-0">Score: {selectedResult.score}/{selectedResult.totalQuestions} | Percentage: {selectedResult.percentage}%</p>
                    <p className="small text-muted mb-0">Date: {selectedResult.submittedAt?.toDate()?.toLocaleString()}</p>
                </div>
                {selectedResult.fullDetails?.map((item, idx) => (
                  <div key={idx} className="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden">
                    <div className="card-body p-3">
                      <div className="fw-bold small mb-2 text-dark">Q{idx + 1}. {item.question}</div>
                      <div className="row g-2">
                        {item.options.map((opt, i) => {
                          const isCorrect = i === item.correctOption;
                          const isSelected = i === item.selectedOption;
                          return (
                            <div className="col-12" key={i}>
                              <div className={`p-2 px-3 rounded-3 small border d-flex align-items-center ${isCorrect ? 'bg-success-subtle border-success text-success fw-bold' : isSelected ? 'bg-danger-subtle border-danger text-danger' : 'bg-white text-muted'}`}>
                                {opt} {isSelected && <span className="ms-auto badge bg-dark rounded-pill" style={{fontSize:'8px'}}>YOUR CHOICE</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
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