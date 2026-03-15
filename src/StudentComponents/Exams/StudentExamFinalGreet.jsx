// src/StudentComponents/Exams/StudentExamFinalGreet.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StudentExamFinalGreet() {
  const navigate = useNavigate();
  const { studentExamId } = useParams(); // Result check karne ke liye ID

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="bg-white border shadow-sm p-4 p-md-5 text-center rounded-0" style={{ maxWidth: "550px" }}>
        {/* Success Icon Animation Area */}
        <div className="mb-4">
          <div className="bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', borderRadius: '50%' }}>
            <i className="bi bi-check-all text-success display-4"></i>
          </div>
        </div>

        <h3 className="fw-bold text-dark mb-2">Examination Submitted!</h3>
        <p className="text-muted mb-4 small">
          Well done! Aapka exam successfully submit ho gaya hai. Aapka result process kiya ja raha hai.
        </p>

        <div className="bg-light p-3 border-start border-success border-4 text-start mb-4">
          <div className="small fw-bold text-uppercase text-muted" style={{ fontSize: '10px' }}>What's Next?</div>
          <p className="mb-0 small text-dark">
            Aap dashboard par ja kar apna score aur detailed performance check kar sakte hain.
          </p>
        </div>

        <div className="d-flex flex-column gap-2">
          <button 
            className="btn btn-dark py-3 rounded-0 fw-bold shadow-sm"
            onClick={() => navigate(`/student/exams/result/${studentExamId}`)}
          >
            VIEW MY SCORE CARD
          </button>
          <button 
            className="btn btn-outline-secondary py-2 rounded-0 fw-bold"
            onClick={() => navigate("/student/dashboard")}
          >
            GO TO DASHBOARD
          </button>
        </div>
        
        <p className="mt-4 text-muted small" style={{ fontSize: '11px' }}>
          Drishtee Computer Center • Examination Portal 2026
        </p>
      </div>
    </div>
  );
}