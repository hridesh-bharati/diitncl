import React, { useState, useEffect } from "react";
import AdmissionProvider from "../../../../AdminComponents/Admissions/AdmissionProvider";
import StudentCertificate from "../../../../AdminComponents/Certificate/StudentCertificate";
import Captcha from "./Captcha";
import { collection, onSnapshot, query, where, orderBy, doc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { getFeeLogic } from "../../../../AdminComponents/Students/Fees/FeeServices";

export default function Verification() {
  const [regNo, setRegNo] = useState("");
  const [searchEmail, setSearchEmail] = useState(null); // Search se email nikalenge
  const [liveStudent, setLiveStudent] = useState(null); // Real-time Student Data
  const [payments, setPayments] = useState([]);
  const [hasCompletedExam, setHasCompletedExam] = useState(false);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // 🔥 1. Real-time Multi-Sync Listener
  useEffect(() => {
    if (!searchEmail) return;

    setIsSyncing(true);
    const emailId = searchEmail.toLowerCase().trim();

    // --- Part A: Student Doc Listener (Important for Status/Course changes) ---
    const unsubStudent = onSnapshot(doc(db, "admissions", emailId), (snap) => {
      if (snap.exists()) {
        setLiveStudent({ id: snap.id, ...snap.data() });
      }
    });

    // --- Part B: Payments Listener ---
    const payQ = query(
      collection(db, "admissions", emailId, "payments"),
      orderBy("date", "desc")
    );
    const unsubPay = onSnapshot(payQ, (snap) => {
      const payList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPayments(payList);
    });

    // --- Part C: Exam Record Listener ---
    const examQ = query(
      collection(db, "studentExams"),
      where("studentId", "==", emailId),
      where("status", "==", "Completed")
    );
    const unsubExam = onSnapshot(examQ, (eSnap) => {
      setHasCompletedExam(!eSnap.empty);
      setIsSyncing(false); 
    });

    return () => {
      unsubStudent();
      unsubPay();
      unsubExam();
    };
  }, [searchEmail]);

  const handleSearch = (admissions) => {
    setError("");
    setLiveStudent(null);
    setSearchEmail(null);
    
    if (!regNo) return setError("Please enter Registration No");

    const match = admissions.find(
      (s) => s.regNo?.toUpperCase() === regNo.trim().toUpperCase()
    );

    if (match) {
      // Sirf email set karenge, listener baaki data fetch kar lega
      setSearchEmail(match.email || match.id);
    } else {
      setError("No Record Found!");
    }
  };

  // 2. 🔥 Real-time Decision Logic
  if (liveStudent) {
    if (isSyncing) {
      return (
        <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
          <div className="spinner-border text-primary mb-2"></div>
          <small className="text-muted fw-bold">Syncing Real-time Records...</small>
        </div>
      );
    }

    // --- Latest Fee Calculation using Live Data ---
    const totalPaid = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
    const summary = getFeeLogic(liveStudent.course, payments) || { balance: 0, netFee: 0 };
    
    // Yahan summary.balance use karein ya manually calculate karein
    const actualBalance = summary.balance; 
    const isFeeDue = actualBalance > 0;

    // 🛑 Condition 1: Fee Dues
   if (isFeeDue) {
  return (
    <div className="d-flex align-items-center  justify-content-center min-vh-100 p-3">
      
      <div className="card border-light shadow-sm rounded-4 text-center p-4 p-md-5" style={{ maxWidth: "450px", width: "100%" }}>
        
        <div className="bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 80, height: 80 }}>
          <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
        </div>

        <h4 className="fw-bold text-danger">FEE DUES PENDING</h4>

        <p className="text-muted small mb-3">
          Access for <b>{liveStudent.name}</b> is locked.
        </p>

        <div className="bg-danger text-white rounded-4 py-3 mb-4 shadow-sm">
          <small className="d-block text-uppercase fw-bold opacity-75" style={{ fontSize: "10px" }}>
            Pending Balance
          </small>
          <h2 className="mb-0 fw-bold">₹{actualBalance}</h2>
        </div>

        <button
          className="btn btn-dark w-100 rounded-pill py-2"
          onClick={() => {
            setLiveStudent(null);
            setSearchEmail(null);
          }}
        >
          ← Back to Search
        </button>

      </div>
    </div>
  );
}

    // 🛑 Condition 2: Exam / Status Check
    if (!hasCompletedExam || liveStudent.status !== 'done') {
      return (
        <div className="d-flex align-items-center justify-content-center bg-light p-3 py-5 min-vh-100">
          <div className="card shadow-lg border-0 p-4 p-md-5 text-center rounded-4" style={{ maxWidth: "450px" }}>
            <div className="bg-warning-subtle rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
              <i className="bi bi-clock-history text-warning fs-1"></i>
            </div>
            <h4 className="fw-bold text-dark">VERIFICATION PENDING</h4>
            <p className="text-muted small">
              The final certification for <b>{liveStudent.name}</b> is under review.
            </p>
            <hr />
            <button className="btn btn-outline-dark w-100 rounded-pill py-2" onClick={() => {setLiveStudent(null); setSearchEmail(null);}}>← Back to Search</button>
          </div>
        </div>
      );
    }

    // ✅ Condition 3: ALL OK
    return (
      <div className="vh-100 bg-white">
        <div className="p-2 border-bottom bg-light sticky-top d-flex justify-content-between align-items-center no-print">
          <button className="btn btn-sm btn-dark px-3 rounded-pill" onClick={() => {setLiveStudent(null); setSearchEmail(null);}}>← Back</button>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 rounded-pill">Status: Verified Official</span>
        </div>
        <StudentCertificate student={liveStudent} />
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