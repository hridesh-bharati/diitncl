// src\Components\HomePage\pages\Verification\Verification.jsx
import React, { useState, useEffect } from "react";
import AdmissionProvider from "../../../../AdminComponents/Admissions/AdmissionProvider";
import StudentCertificate from "../../../../AdminComponents/Certificate/StudentCertificate";
import Captcha from "./Captcha";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { getFeeLogic } from "../../../../AdminComponents/Students/Fees/FeeServices";

export default function Verification() {
  const [regNo, setRegNo] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. 🔥 Real-time Fee Listener
  useEffect(() => {
    // Document ID student ka email hai (as per dashboard)
    const emailId = (selectedStudent?.email || selectedStudent?.id)?.toLowerCase().trim();
    if (!emailId) return;

    setIsSyncing(true);
    const payQ = query(
      collection(db, "admissions", emailId, "payments"),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(payQ, (snap) => {
      const payList = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setPayments(payList);
      setIsSyncing(false); 
    }, (err) => {
      console.error("Payment Sync Error:", err);
      setIsSyncing(false);
    });

    return () => unsubscribe();
  }, [selectedStudent]);

  const handleSearch = (admissions) => {
    setError("");
    setPayments([]); 
    if (!regNo) return setError("Please enter Registration No");

    const match = admissions.find(
      (s) => s.regNo?.toUpperCase() === regNo.trim().toUpperCase()
    );

    if (match) {
      setSelectedStudent(match);
    } else {
      setError("No Record Found!");
    }
  };

  // 2. 🔥 Decision Logic (Dues vs Certificate)
  if (selectedStudent) {
    
    // Sync hone tak loader (Important: taaki purana data na dikhe)
    if (isSyncing) {
      return (
        <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
          <div className="spinner-border text-primary mb-2"></div>
          <small className="text-muted fw-bold">Verifying Fee Records...</small>
        </div>
      );
    }

    // --- DASHBOARD LOGIC START ---
    const totalPaid = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
    const summary = getFeeLogic(selectedStudent.course, payments) || { balance: 0, netFee: 0 };
    
    // Net Fee mein se paid minus karke actual dues nikalna
    const actualBalance = (summary.netFee || 0) - totalPaid;
    const isFeeDue = actualBalance > 0;
    // --- DASHBOARD LOGIC END ---

    // 🛑 Dues Screen (Agar ₹1 bhi baki hai)
    if (isFeeDue) {
      return (
        <div className="d-flex align-items-center justify-content-center bg-warning-subtle p-3 py-5">
          <div className="card shadow-lg border-0 p-4 p-md-5 text-center rounded-4 animate__animated animate__fadeIn" style={{ maxWidth: "450px" }}>
            <div className="bg-danger-subtle rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
              <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
            </div>
            
            <h4 className="fw-bold text-danger">FEE DUES PENDING</h4>
            <p className="text-muted small">
              Verification for <b>{selectedStudent.name}</b> is locked. Please clear the pending dues to access the certificate.
            </p>

            <div className="bg-danger text-white rounded-4 py-3 mb-4 shadow-sm">
              <small className="d-block opacity-75 text-uppercase fw-bold" style={{fontSize: '10px'}}>Actual Pending Amount</small>
              <h2 className="mb-0 fw-bold">₹{actualBalance}</h2>
            </div>

            <button className="btn btn-dark w-100 rounded-pill py-2 shadow-sm" onClick={() => setSelectedStudent(null)}>
              ← Back to Search
            </button>
          </div>
        </div>
      );
    }

    // ✅ Certificate Screen (Jab actualBalance <= 0 ho)
    return (
      <div className="vh-100 bg-white">
        <div className="p-2 border-bottom bg-light sticky-top d-flex justify-content-between align-items-center">
          <button className="btn btn-sm btn-dark px-3 rounded-pill" onClick={() => setSelectedStudent(null)}>← Back</button>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 rounded-pill">Status: Clear</span>
        </div>
        <StudentCertificate student={selectedStudent} />
      </div>
    );
  }

  // 3. 🔍 Initial Search Screen
  return (
    <div className="d-flex align-items-center justify-content-center p-3" style={{ background: "#F5F3FF", minHeight: "90vh" }}>
      <AdmissionProvider>
        {({ admissions }) => (
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: "380px", width: "100%" }}>
            <div style={{ height: "6px", background: "linear-gradient(90deg, #4F46E5, #7C3AED)" }}></div>

            <div className="card-body p-4 text-center">
              <i className="bi bi-patch-check-fill display-5 text-primary mb-2"></i>
              <h5 className="fw-bold mb-4">Public Verification</h5>

              <form onSubmit={(e) => { e.preventDefault(); handleSearch(admissions); }}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control border-2 shadow-none rounded-3"
                    id="regInput"
                    placeholder="REG NO"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value.trim().toUpperCase())}
                  />
                  <label htmlFor="regInput">REGISTRATION NO</label>
                </div>

                <div className="mb-4 border p-2 rounded bg-light">
                  <Captcha onVerify={setCaptchaVerified} />
                </div>

                <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm rounded-pill" disabled={!captchaVerified} style={{ background: "#4F46E5" }}>
                  VERIFY NOW
                </button>
              </form>

              {error && (
                <div className="mt-3 text-danger small fw-bold alert alert-danger py-2 border-0 animate__animated animate__headShake">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
      </AdmissionProvider>
    </div>
  );
}