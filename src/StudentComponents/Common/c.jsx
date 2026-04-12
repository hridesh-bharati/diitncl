// src\StudentComponents\Common\Certificate.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";  
import StudentCertificate from "../../AdminComponents/Certificate/StudentCertificate";
import { getFeeLogic } from "../../AdminComponents/Students/Fees/FeeServices"; // ✅ Fee logic import karein

export default function CertificateWrapper() {
  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]); // ✅ Payments state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribeSnap = null;
    let unsubscribePay = null;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
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
      const docRef = doc(db, "admissions", emailId);

      // 1. Student Data Listen
      unsubscribeSnap = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          setStudent({ id: snap.id, ...snap.data() });
          setError(null);
        } else {
          setError("No admission record found.");
        }
      });

      // 2. Payments Data Listen (Fee check karne ke liye)
      const payQ = query(collection(db, "admissions", emailId, "payments"), orderBy("date", "desc"));
      unsubscribePay = onSnapshot(payQ, (pSnap) => {
        const payList = pSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPayments(payList);
        setLoading(false); // Dono data aane ke baad hi loading false karein
      }, (err) => {
        console.error("Payment Error:", err);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
      if (unsubscribePay) unsubscribePay();
    };
  }, []);

  // --- Fee Calculation Logic ---
  const summary = getFeeLogic(student?.course, payments) || { balance: 0 };
  const isFeeDue = summary.balance > 0; // ✅ Agar 1 rupaya bhi baki hai to true hoga

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="spinner-border text-primary"></div>
      <h6 className="mt-3 text-muted fw-bold">Checking Payment Status...</h6>
    </div>
  );

  if (error) return <div className="container py-5 text-center"><div className="alert alert-danger">{error}</div></div>;
  if (!student) return null;

  // 1. Check if Admin manually disabled
  if (student.certificateDisabled) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-lg p-5">
          <i className="bi bi-shield-lock-fill text-danger display-1 mb-3"></i>
          <h4 className="fw-bold">Access Restricted</h4>
          <p className="text-muted">Disabled by Administrator.</p>
        </div>
      </div>
    );
  }

  // 2. 🔥 Fee Due Check (Aapki requirement)
  if (isFeeDue) {
    return (
      <div className="container py-5 text-center animate__animated animate__shakeX">
        <div className="card border-0 shadow-lg p-5 bg-white">
          <div className="bg-danger-subtle rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
             <i className="bi bi-cash-stack text-danger fs-1"></i>
          </div>
          <h4 className="fw-bold text-danger">Fee Due!</h4>
          <p className="text-dark fw-bold">Please pay your pending fee of ₹{summary.balance} to view/download your certificate.</p>
          <div className="mt-3">
             <small className="text-muted">Contact office for payment details.</small>
          </div>
        </div>
      </div>
    );
  }

  // 3. Normal logic (Marks/Date check)
  const isIssued = (student.percentage || student.percentage === 0) && student.issueDate;
  const progress = (student.percentage ? 50 : 0) + (student.issueDate ? 50 : 0);

  return (
    <div className="animate__animated animate__fadeIn">
      {isIssued ? (
        <StudentCertificate student={student} />
      ) : (
        <div className="container py-5 text-center">
           <div className="card border-0 shadow-lg p-5">
              <h4 className="fw-bold mb-3">Generation in Progress</h4>
              <div className="progress rounded-pill mb-3" style={{ height: "20px" }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${progress}%` }}>{progress}%</div>
              </div>
              <p className="text-muted">Marks or Issue Date pending from Admin side.</p>
           </div>
        </div>
      )}
    </div>
  );
}