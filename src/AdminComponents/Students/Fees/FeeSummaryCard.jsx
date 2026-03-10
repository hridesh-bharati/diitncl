import React from "react";

export default function FeeSummaryCard({ student, summary, payments = [] }) { // Default array []
  
  const getNextDue = () => {
    // Check if student and payments exist safely
    if (!student?.admissionDate || !Array.isArray(payments)) return "N/A";
    
    // Yahan .filter tabhi chalega jab payments array ho
    const monthlyCount = payments.filter(p => p.note === "Monthly Fee").length;
    
    const date = new Date(student.admissionDate);
    date.setMonth(date.getMonth() + monthlyCount);
    
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="p-4 text-white" style={{ background: 'linear-gradient(45deg, #0f172a, #2563eb)' }}>
        <div className="d-flex align-items-center">
          <img 
            src={student?.photoUrl || `https://ui-avatars.com/api/?name=${student?.name || 'User'}`} 
            className="rounded-circle border border-3 border-white" 
            style={{width:70, height:70, objectFit:'cover'}} 
            alt="student"
          />
          <div className="ms-3">
            <h4 className="fw-bold mb-0">{student?.name || "Loading..."}</h4>
            <small className="opacity-75">{student?.course || "Course"} | Total: ₹{summary?.netFee || 0}</small>
          </div>
          <div className="ms-auto text-end bg-white bg-opacity-10 p-2 rounded-3 border border-white border-opacity-25">
            <small className="d-block opacity-75 fw-bold" style={{fontSize:10}}>BALANCE</small>
            <h4 className={`mb-0 fw-bold ${(summary?.balance || 0) > 0 ? 'text-warning' : 'text-success'}`}>
              ₹{summary?.balance || 0}
            </h4>
          </div>
        </div>
      </div>
      <div className="row g-0 bg-white text-center border-top">
        <div className="col-4 border-end py-3">
            <small className="text-muted d-block">PAID</small>
            <b className="text-success">₹{summary?.totalPaid || 0}</b>
        </div>
        <div className="col-4 border-end py-3">
            <small className="text-muted d-block">NEXT DUE</small>
            <b>{getNextDue()}</b>
        </div>
        <div className="col-4 py-3">
            <small className="text-muted d-block">DURATION</small>
            <b>{summary?.duration || 0} Mo.</b>
        </div>
      </div>
    </div>
  );
}