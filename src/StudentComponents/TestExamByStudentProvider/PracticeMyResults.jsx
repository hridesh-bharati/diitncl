import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";

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

  const filtered = useMemo(() => results.filter((r) => 
    r.testTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [results, searchTerm]);

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary border-4" /></div>;

  return (
    <div className="container py-4 bg-light min-vh-100">
      {/* Result List Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <h5 className="fw-bold mb-0 text-dark">Practice Records</h5>
            <input type="text" className="form-control form-control-sm rounded-pill px-3 border-0 bg-light w-auto shadow-none" placeholder="Filter by name..." onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr className="small text-muted">
                  <th>PAPER NAME</th>
                  <th className="text-center">MARKS</th>
                  <th className="text-center">RESULT</th>
                  <th className="text-end px-3">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const percent = parseFloat(r.percentage || 0);
                  const isPass = percent >= 40;
                  return (
                    <tr key={r.id}>
                      <td className="fw-bold small">{r.testTitle}</td>
                      <td className="text-center fw-bold text-primary">{r.score}/{r.totalQuestions}</td>
                      <td className="text-center">
                        <span className={`badge rounded-pill ${isPass ? 'bg-success' : 'bg-danger'}`} style={{fontSize:'10px'}}>
                          {isPass ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>
                      <td className="text-end px-3">
                        <button className="btn btn-dark btn-sm rounded-pill px-3 fw-bold" style={{fontSize:'11px'}} onClick={() => setSelectedResult(r)}>Check Review</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Detailed Review Modal --- */}
      {selectedResult && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 bg-white pt-4 px-4 pb-2">
                <h5 className="fw-bold mb-0">Question Review</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedResult(null)}></button>
              </div>
              <div className="modal-body p-4 bg-light">
                {selectedResult.fullDetails?.map((item, idx) => (
                  <div key={idx} className="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden">
                    <div className="card-body p-3">
                      <div className="fw-bold small mb-3">
                        <span className="text-primary me-2">Q{idx + 1}.</span> {item.question}
                      </div>
                      <div className="row g-2">
                        {item.options.map((opt, i) => {
                          const isCorrect = i === item.correctOption;
                          const isStudentChoice = i === item.selectedOption;
                          
                          let cardClass = "bg-white border-light-subtle text-muted";
                          let badge = null;

                          if (isCorrect) {
                            cardClass = "bg-success-subtle border-success text-success fw-bold shadow-sm";
                          }
                          if (isStudentChoice && !isCorrect) {
                            cardClass = "bg-danger-subtle border-danger text-danger fw-bold";
                          }

                          if (isStudentChoice) {
                            badge = <span className="ms-auto badge bg-dark text-white rounded-pill" style={{fontSize:'8px'}}>YOUR CHOICE</span>;
                          }

                          return (
                            <div className="col-12" key={i}>
                              <div className={`p-2 px-3 rounded-3 small border d-flex align-items-center ${cardClass}`}>
                                <span className="me-2">{String.fromCharCode(65 + i)}.</span> {opt}
                                {badge}
                                {isCorrect && isStudentChoice && <i className="bi bi-patch-check-fill ms-2"></i>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer border-0 p-3 bg-white">
                <button className="btn btn-secondary w-100 rounded-pill fw-bold" onClick={() => setSelectedResult(null)}>Close Review</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}