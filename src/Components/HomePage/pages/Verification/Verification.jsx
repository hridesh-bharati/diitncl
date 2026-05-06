import React, { useState, useEffect } from "react";
import AdmissionProvider from "../../../../AdminComponents/Admissions/AdmissionProvider";
import StudentCertificate from "../../../../AdminComponents/Certificate/StudentCertificate";
import Captcha from "./Captcha";
import { collection, onSnapshot, query, where, orderBy, doc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { getFeeLogic } from "../../../../AdminComponents/Students/Fees/FeeServices";

export default function Verification() {
  const [regNo, setRegNo] = useState("");
  const [searchEmail, setSearchEmail] = useState(null);
  const [liveStudent, setLiveStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [hasCompletedExam, setHasCompletedExam] = useState(false);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

useEffect(() => {
  if (!searchEmail) return;

  let isMounted = true;
  setIsSyncing(true);
  const emailId = searchEmail.toLowerCase().trim();

  const unsubStudent = onSnapshot(doc(db, "admissions", emailId), (snap) => {
    if (snap.exists() && isMounted) {
      setLiveStudent({ id: snap.id, ...snap.data() });
    }
  });

  const unsubPay = onSnapshot(
    query(collection(db, "admissions", emailId, "payments"), orderBy("date", "desc")),
    (snap) => {
      if (isMounted) {
        setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    }
  );

  const unsubExam = onSnapshot(
    query(collection(db, "studentExams"),
      where("studentId", "==", emailId),
      where("status", "==", "Completed")
    ),
    (eSnap) => {
      if (isMounted) {
        setHasCompletedExam(!eSnap.empty);
        setIsSyncing(false);
      }
    }
  );

  return () => {
    isMounted = false;
    unsubStudent();
    unsubPay();
    unsubExam();
  };
}, [searchEmail]);

  const handleSearch = (admissions) => {
    setError(""); setLiveStudent(null); setSearchEmail(null);
    if (!regNo) return setError("Please enter Registration No");
    const match = admissions.find(s => s.regNo?.toUpperCase() === regNo.trim().toUpperCase());
    match ? setSearchEmail(match.email || match.id) : setError("No Record Found!");
  };

  if (liveStudent) {
    if (isSyncing) return (
      <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
        <div className="spinner-border text-primary mb-2"></div>
        <small className="text-muted fw-bold">Verifying Records...</small>
      </div>
    );

    const summary = getFeeLogic(liveStudent.course, payments) || { balance: 0 };
    const actualBalance = Number(summary.balance || 0);

    // 🛑 1. Fee Dues UI (Exactly as you wanted)
    if (actualBalance > 0) return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 p-3 bg-light">
        <div className="card border-0 shadow-lg rounded-4 text-center p-4" style={{ maxWidth: "420px" }}>
          <div className="bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 70, height: 70 }}>
            <i className="bi bi-exclamation-triangle-fill text-danger fs-2"></i>
          </div>
          <h4 className="fw-bold text-danger">FEE DUES PENDING</h4>
          <p className="text-muted small">Access for <b>{liveStudent.name}</b> is locked due to outstanding balance.</p>
          <div className="bg-danger text-white rounded-4 py-3 mb-4">
            <small className="d-block text-uppercase opacity-75" style={{ fontSize: "10px" }}>Pending Amount</small>
            <h2 className="mb-0 fw-bold">₹{actualBalance}</h2>
          </div>
          <button className="btn btn-dark w-100 rounded-pill py-2" onClick={() => { setLiveStudent(null); setSearchEmail(null); }}>← Back to Search</button>
        </div>
      </div>
    );

    // 🛑 2. Exam/Status Check
    if (!hasCompletedExam || liveStudent.status?.toLowerCase() !== 'done') return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 p-3 bg-light">
        <div className="card shadow border-0 p-4 text-center rounded-4" style={{ maxWidth: "420px" }}>
          <div className="bg-warning-subtle rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 70, height: 70 }}>
            <i className="bi bi-clock-history text-warning fs-2"></i>
          </div>
          <h4 className="fw-bold">VERIFICATION PENDING</h4>
          <p className="text-muted small">Final certification for <b>{liveStudent.name}</b> is under review.</p>
          <button className="btn btn-outline-dark w-100 rounded-pill" onClick={() => { setLiveStudent(null); setSearchEmail(null); }}>← Back</button>
        </div>
      </div>
    );

    // ✅ 3. Verified View
    return (
      <div className="vh-100 bg-white">
        <div className="p-2 border-bottom bg-light sticky-top d-flex justify-content-between align-items-center no-print">
          <button className="btn btn-sm btn-dark px-3 rounded-pill" onClick={() => { setLiveStudent(null); setSearchEmail(null); }}>← Back</button>
          <span className="badge bg-success-subtle text-success border border-success px-3 rounded-pill">Status: Verified Official</span>
        </div>
        <StudentCertificate student={liveStudent} />
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center p-3 min-vh-100" style={{ background: "#F5F3FF" }}>
      <AdmissionProvider>
        {({ admissions }) => (
          <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: "380px", width: "100%" }}>
            <div style={{ height: "6px", background: "linear-gradient(90deg, #4F46E5, #7C3AED)", borderRadius: "10px 10px 0 0" }}></div>
            <div className="card-body p-4 text-center">
              <i className="bi bi-patch-check-fill display-6 text-primary mb-2"></i>
              <h5 className="fw-bold mb-4">Public Verification</h5>
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(admissions); }}>
                <input className="form-control form-control-lg mb-3 text-center fw-bold border-2" placeholder="REGISTRATION NO" value={regNo} onChange={(e) => setRegNo(e.target.value.trim().toUpperCase())} />
                <div className="mb-3 border p-2 rounded bg-light"><Captcha onVerify={setCaptchaVerified} /></div>
                <button className="btn btn-primary w-100 py-2 fw-bold rounded-pill shadow-sm" disabled={!captchaVerified} style={{ background: "#4F46E5" }}>VERIFY NOW</button>
              </form>
              {error && <div className="mt-3 text-danger small fw-bold alert alert-danger py-2 border-0">{error}</div>}
            </div>
          </div>
        )}
      </AdmissionProvider>
    </div>
  );
}