import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../../firebase/firebase";
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
    <div className="container py-3 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 px-2">
        <h5 className="fw-bold mb-0 text-dark">My Progress</h5>
        <input type="text" className="form-control form-control-sm rounded-pill px-3 border-0 shadow-sm w-auto" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="row g-3">
        {filtered.map((r) => {
          const percent = parseFloat(r.percentage || 0);
          const isPass = percent >= 40;
          return (
            <div className="col-12 col-md-6" key={r.id}>
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="overflow-hidden pe-2">
                      <div className="fw-bold text-dark text-truncate">{r.testTitle}</div>
                      <small className="text-muted">{r.submittedAt?.toDate()?.toLocaleDateString()}</small>
                    </div>
                    {/* 🔥 Student Card Par Score aur Percent */}
                    <div className="text-end">
                      <div className={`h5 fw-bold mb-0 ${isPass ? 'text-success' : 'text-danger'}`}>
                        {r.score}/{r.totalQuestions}
                      </div>
                      <div className="fw-bold text-muted" style={{fontSize: '11px'}}>{percent}%</div>
                    </div>
                  </div>

                  <div className="progress mb-3" style={{ height: '5px' }}>
                    <div className={`progress-bar ${isPass ? 'bg-success' : 'bg-danger'}`} style={{ width: `${percent}%` }}></div>
                  </div>

                  <button className="btn btn-dark w-100 rounded-pill py-2 fw-bold btn-sm shadow-sm" onClick={() => setSelectedResult(r)}>
                    Review Mistakes
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-5 text-muted">No completed tests found.</div>}
      </div>

      {/* --- Detailed Review Modal (Wahi rahega) --- */}
      {selectedResult && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 bg-white pt-4 px-4 pb-2">
                <h6 className="fw-bold mb-0">Result Review</h6>
                <button type="button" className="btn-close shadow-none" onClick={() => setSelectedResult(null)}></button>
              </div>
              <div className="modal-body p-4 bg-light">
                {selectedResult.fullDetails?.map((item, idx) => (
                  <div key={idx} className="card border-0 shadow-sm rounded-4 mb-3">
                    <div className="card-body p-3">
                      <div className="fw-bold small mb-3">
                        <span className="text-primary me-2">Q{idx + 1}.</span> {item.question}
                      </div>
                      <div className="row g-2">
                        {item.options.map((opt, i) => {
                          const isCorrect = i === item.correctOption;
                          const isStudentChoice = i === item.selectedOption;
                          let cardClass = "bg-white border-light-subtle text-muted opacity-75";
                          if (isCorrect) cardClass = "bg-success-subtle border-success text-success fw-bold";
                          if (isStudentChoice && !isCorrect) cardClass = "bg-danger-subtle border-danger text-danger fw-bold";
                          
                          return (
                            <div className="col-12" key={i}>
                              <div className={`p-2 px-3 rounded-3 small border d-flex align-items-center ${cardClass}`}>
                                {opt}
                                {isStudentChoice && <span className="ms-auto badge bg-dark rounded-pill" style={{fontSize:'8px'}}>YOU TICKED</span>}
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