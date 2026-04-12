// src\StudentComponents\Common\Certificate.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, onSnapshot, collection, query, where, orderBy, getDocs } from "firebase/firestore";  
import StudentCertificate from "../../AdminComponents/Certificate/StudentCertificate";
import { getFeeLogic } from "../../AdminComponents/Students/Fees/FeeServices"; 

export default function CertificateWrapper() {
  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [hasCompletedExam, setHasCompletedExam] = useState(false); // 🔥 New state for exam check
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribeSnap = null;
    let unsubscribePay = null;
    let unsubscribeExam = null; // Listener for real-time exam deletion

    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      const userEmail = user?.email || localStorage.getItem("user_email");

      if (!userEmail) {
        if (!user && loading) { } 
        else {
          setError("User session not found. Please login again.");
          setLoading(false);
        }
        return;
      }

      const emailId = userEmail.toLowerCase().trim();
      
      // 1. Student Admission Data (Real-time)
      const docRef = doc(db, "admissions", emailId);
      unsubscribeSnap = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          setStudent({ id: snap.id, ...snap.data() });
          setError(null);
        } else {
          setError("No admission record found.");
        }
      });

      // 2. Payments Data (Fee check)
      const payQ = query(collection(db, "admissions", emailId, "payments"), orderBy("date", "desc"));
      unsubscribePay = onSnapshot(payQ, (pSnap) => {
        const payList = pSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPayments(payList);
      });

      // 3. 🔥 Exam Record Check (Agar record delete hua to certificate gayab)
      const examQ = query(
        collection(db, "studentExams"), 
        where("studentId", "==", emailId), 
        where("status", "==", "Completed")
      );

      unsubscribeExam = onSnapshot(examQ, (eSnap) => {
        if (!eSnap.empty) {
          setHasCompletedExam(true);
        } else {
          setHasCompletedExam(false);
        }
        setLoading(false); // Sab checks ke baad loading stop
      }, (err) => {
        console.error("Exam Check Error:", err);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
      if (unsubscribePay) unsubscribePay();
      if (unsubscribeExam) unsubscribeExam();
    };
  }, []);

  // --- Calculations ---
  const summary = getFeeLogic(student?.course, payments) || { balance: 0 };
  const isFeeDue = summary.balance > 0;

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="spinner-border text-primary border-4"></div>
      <h6 className="mt-3 text-muted fw-bold">Verifying Academic Records...</h6>
    </div>
  );

  if (error) return <div className="container py-5 text-center"><div className="alert alert-danger shadow-sm">{error}</div></div>;
  if (!student) return null;

  // 1. Admin Block Check
  if (student.certificateDisabled) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-lg p-5 rounded-4">
          <i className="bi bi-shield-lock-fill text-danger display-1 mb-3"></i>
          <h4 className="fw-bold">Access Restricted</h4>
          <p className="text-muted">Your certificate access has been temporarily disabled by the administrator.</p>
        </div>
      </div>
    );
  }

  // 2. 🔥 Fee Due Check
  if (isFeeDue) {
    return (
      <div className="container py-5 text-center animate__animated animate__shakeX">
        <div className="card border-0 shadow-lg p-5 bg-white rounded-4">
          <div className="bg-danger-subtle rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
             <i className="bi bi-cash-stack text-danger fs-1"></i>
          </div>
          <h4 className="fw-bold text-danger">Payment Pending!</h4>
          <p className="text-dark fw-bold">Please clear your pending fee of ₹{summary.balance} to unlock your certificate.</p>
          <hr className="w-25 mx-auto" />
          <small className="text-muted">Contact Drishtee Computer Center office for more info.</small>
        </div>
      </div>
    );
  }

  // 3. 🔥 Exam Record Presence Check
  if (!hasCompletedExam) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-lg p-5 rounded-4 bg-white border-start border-4 border-warning">
          <i className="bi bi-clipboard-x text-warning display-2 mb-3"></i>
          <h4 className="fw-bold">No Exam Record</h4>
          <p className="text-muted mb-0">We couldn't find a completed exam record for your profile.</p>
          <p className="small text-danger fw-bold mt-2">Note: Certificate is only available after passing the online examination.</p>
        </div>
      </div>
    );
  }

  // 4. Normal Issuance Check (Percentage & Date)
  const isIssued = (student.percentage || student.percentage === 0) && student.issueDate;
  const progress = (student.percentage ? 50 : 0) + (student.issueDate ? 50 : 0);

  return (
    <div className="animate__animated animate__fadeIn">
      {isIssued ? (
        <StudentCertificate student={student} />
      ) : (
        <div className="container py-5 text-center">
           <div className="card border-0 shadow-lg p-5 rounded-4">
              <i className="bi bi-gear-wide-connected text-primary display-4 mb-3 spin-slow"></i>
              <h4 className="fw-bold mb-3">Generation in Progress</h4>
              <div className="progress rounded-pill mb-3 mx-auto" style={{ height: "12px", maxWidth: '400px' }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-muted small">Your data is verified. Please wait for the final approval and issue date from the administrator.</p>
              <div className="badge bg-light text-dark border p-2 px-3 mt-2">Verification Stage: {progress}% Completed</div>
           </div>
        </div>
      )}
      
      <style>{`
        .spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}