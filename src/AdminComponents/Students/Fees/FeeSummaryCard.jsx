// src\AdminComponents\Students\Fees\FeeSummaryCard.jsx
import React from "react";

export default function FeeSummaryCard({ student, summary, payments = [] }) {
  
  const getNextDue = () => {
    if (!student?.admissionDate || !Array.isArray(payments)) return "N/A";
    const monthlyCount = payments.filter(p => p.note === "Monthly Fee").length;
    const date = new Date(student.admissionDate);
    date.setMonth(date.getMonth() + monthlyCount);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // 🔥 1. Sirf Course se judi payments (Monthly + Admission)
  const coursePaymentsTotal = payments
    .filter(p => p.note === "Monthly Fee" || p.note === "Admission Fee")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // 🔥 2. Sirf Extra payments (Inka balance par koi asar nahi padega)
  const otherPaymentsTotal = payments
    .filter(p => p.note !== "Monthly Fee" && p.note !== "Admission Fee")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // 🔥 3. Pure Course Balance (Net Fee - Only Course Paid)
  // Isse Other Fee jama hone par Course Balance negative nahi hoga
  const actualCourseDue = (summary?.netFee || 0) - coursePaymentsTotal;

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3 animate__animated animate__fadeIn">
      {/* Header Section */}
      <div className="p-3 p-md-4 text-white" style={{ background: 'linear-gradient(45deg, #0f172a, #2563eb)' }}>
        
        {/* Row 1: Profile Info */}
        <div className="d-flex align-items-center gap-3 mb-2 mb-md-3">
          <img 
            src={student?.photoUrl || `https://ui-avatars.com/api/?name=${student?.name || 'User'}`} 
            className="rounded-circle border border-2 border-white shadow-sm" 
            style={{width: 55, height: 55, minWidth: 55, objectFit:'cover'}} 
            alt="student"
          />
          <div className="text-start">
            <h5 className="fw-bold mb-0 text-truncate" style={{maxWidth: '200px'}}>{student?.name || "Loading..."}</h5>
            <span className="badge bg-warning text-dark rounded-pill" style={{fontSize: '0.7rem'}}>{student?.course}</span>
          </div>
        </div>

        {/* Row 2: Registration No */}
        <div className="text-start mb-3">
           <small className="opacity-75 d-block" style={{fontSize: '0.8rem'}}>
             <i className="bi bi-person-badge me-1"></i> Reg: {student?.regNo || 'N/A'}
           </small>
        </div>

        {/* 🔥 Row 3: Fee Boxes (Ab ek dusre se independent hain) */}
        <div className="d-flex gap-2">
          {/* Other Fee Box - Sirf Record ke liye */}
          <div className="flex-fill text-center text-md-start bg-white bg-opacity-10 p-2 rounded-3 border border-white border-opacity-25 shadow-sm">
            <small className="d-block opacity-75 fw-bold" style={{fontSize:9, letterSpacing:1}}>OTHER PAID</small>
            <h5 className="mb-0 fw-bold text-info">₹{otherPaymentsTotal}</h5>
          </div>
          
          {/* Course Due Box - Real Pending Balance */}
          <div className="flex-fill text-center text-md-start bg-white bg-opacity-20 p-2 rounded-3 border border-white border-opacity-50 shadow-sm">
            <small className="d-block opacity-75 fw-bold text-dark" style={{fontSize:9, letterSpacing:1}}>COURSE DUE</small>
            <h4 className={`mb-0 fw-bold ${actualCourseDue > 0 ? 'text-warning' : 'text-success'}`}>
              ₹{actualCourseDue > 0 ? actualCourseDue : 0}
            </h4>
          </div>
        </div>
      </div>

      {/* Stats Grid Section */}
      <div className="row g-0 bg-white text-center border-top">
        <div className="col-6 col-md-3 border-end border-bottom border-md-bottom-0 py-3">
            <small className="text-muted d-block fw-bold mb-1" style={{fontSize:9}}>COURSE PAID</small>
            <span className="text-success fw-bold fs-6">₹{coursePaymentsTotal}</span>
        </div>
        <div className="col-6 col-md-3 border-end-md border-bottom border-md-bottom-0 py-3">
            <small className="text-muted d-block fw-bold mb-1" style={{fontSize:9}}>OTHER PAID</small>
            <span className="text-info fw-bold fs-6">₹{otherPaymentsTotal}</span>
        </div>
        <div className="col-6 col-md-3 border-end py-3">
            <small className="text-muted d-block fw-bold mb-1" style={{fontSize:9}}>NEXT DUE</small>
            <span className="text-dark fw-bold small">{getNextDue()}</span>
        </div>
        <div className="col-6 col-md-3 py-3">
            <small className="text-muted d-block fw-bold mb-1" style={{fontSize:9}}>DURATION</small>
            <span className="text-dark fw-bold small">{summary?.duration || 0} Mo.</span>
        </div>
      </div>
    </div>
  );
}