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
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return setLoading(false);
      const q = query(collection(db, "practiceResults"), 
                where("studentEmail", "==", user.email.toLowerCase()), 
                where("status", "==", "Completed"));
      
      return onSnapshot(q, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setResults(data.sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0)));
        setLoading(false);
      });
    });
    return () => unsub();
  }, []);

  const exportPDF = () => {
    const element = document.getElementById("pdf-content");
    const opt = {
      margin: 10,
      filename: `Result_${selectedResult.testTitle}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const filtered = useMemo(() => 
    results.filter(r => r.testTitle?.toLowerCase().includes(searchTerm.toLowerCase())), 
    [results, searchTerm]
  );

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container  py-3">
      {/* Header & Search */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-12 col-md-6">
          <h4 className="fw-bold m-0 text-center text-md-start">My Results</h4>
        </div>
        <div className="col-12 col-md-6">
          <input type="text" className="form-control rounded-pill border-0 shadow-sm px-3" placeholder="Search test..." onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* Grid List */}
      <div className="row g-3">
        {filtered.map((r) => (
          <div key={r.id} className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold text-truncate pe-2">{r.testTitle}</span>
                <span className={`badge rounded-pill ${parseFloat(r.percentage) >= 40 ? 'bg-success' : 'bg-danger'}`}>{r.percentage}%</span>
              </div>
              <div className="small text-muted mb-3">{r.submittedAt?.toDate()?.toLocaleDateString()}</div>
              <div className="d-flex justify-content-between align-items-center mt-auto">
                <div className="fw-bold text-primary small">Score: {r.score}/{r.totalQuestions}</div>
                <button className="btn btn-dark btn-sm rounded-pill px-3 fw-bold" onClick={() => setSelectedResult(r)}>Review</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with Export PDF */}
      {selectedResult && (
        <div className="modal show d-block p-2" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-lg m-0 modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h6 className="fw-bold m-0">Review Result</h6>
                <div className="ms-auto d-flex gap-2">
                  <button className="btn btn-primary btn-sm rounded-pill px-3 fw-bold" onClick={exportPDF}>PDF</button>
                  <button className="btn-close shadow-none" onClick={() => setSelectedResult(null)}></button>
                </div>
              </div>
              
              <div className="modal-body p-3 bg-light" id="pdf-content">
                <div className="bg-white p-3 rounded-3 shadow-sm mb-3 border-start border-4 border-primary">
                    <h5 className="fw-bold mb-1">{selectedResult.testTitle}</h5>
                    <p className="small text-muted m-0">Score: {selectedResult.score}/{selectedResult.totalQuestions} ({selectedResult.percentage}%)</p>
                </div>

                {selectedResult.fullDetails?.map((item, idx) => (
                  <div key={idx} className="card border-0 shadow-sm rounded-3 mb-3 p-3">
                    <div className="small fw-bold mb-2">{idx + 1}. {item.question}</div>
                    {item.options.map((opt, i) => (
                      <div key={i} className={`p-2 rounded-2 small mb-1 border ${i === item.correctOption ? 'bg-success-subtle border-success text-success fw-bold' : i === item.selectedOption ? 'bg-danger-subtle border-danger text-danger' : 'bg-white text-muted'}`}>
                        {opt} {i === item.selectedOption && <span style={{fontSize:'8px'}} className="ms-2 badge bg-dark">YOU</span>}
                      </div>
                    ))}
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