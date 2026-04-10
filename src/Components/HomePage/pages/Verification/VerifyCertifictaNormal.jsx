import React, { useState } from "react";
import AdmissionProvider from "../../../../AdminComponents/Admissions/AdmissionProvider";
import StudentCertificate from "../../../../AdminComponents/Certificate/StudentCertificate";
import Captcha from "./Captcha";

export default function Verification() {
  const [regNo, setRegNo] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSearch = (admissions) => {
    setError("");
    if (!regNo) return setError("Please enter Registration No");

    const match = admissions.find(s =>
      s.regNo?.toUpperCase() === regNo.trim().toUpperCase()
    );
    
    match ? setSelectedStudent(match) : setError("No Record Found!");
  };

  if (selectedStudent) return (
    <div className="vh-100 bg-white">
      <div className="p-2 border-bottom bg-light sticky-top">
        <button className="btn btn-sm btn-dark px-3 rounded-pill" onClick={() => setSelectedStudent(null)}>← Back</button>
      </div>
      <StudentCertificate student={selectedStudent} />
    </div>
  );

  return (
    <div className="d-flex align-items-center justify-content-center p-3" style={{ background: "#F5F3FF" }}>
      <AdmissionProvider>
        {({ admissions }) => (
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: "380px", width: "100%" }}>
            <div style={{ height: "6px", background: "linear-gradient(90deg, #4F46E5, #7C3AED)" }}></div>
            <div className="card-body p-4 text-center">
              <i className="bi bi-patch-check-fill display-5 text-primary mb-2"></i>
              <h5 className="fw-bold mb-4">Student Verify</h5>
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(admissions); }}>
                <input 
                  className="form-control mb-4 py-2 border-2 shadow-none" 
                  placeholder="REGISTRATION NO" 
                  value={regNo} 
                  onChange={e => setRegNo(e.target.value.trim().toUpperCase())} 
                />
                
                <div className="mb-4 border p-2 rounded bg-light">
                  <Captcha onVerify={setCaptchaVerified} />
                </div>

                <button 
                  className="btn btn-primary w-100 py-2 fw-bold shadow-sm" 
                  disabled={!captchaVerified} 
                  style={{ background: "#4F46E5" }}
                >
                  VERIFY NOW
                </button>
              </form>
              {error && <div className="mt-3 text-danger small fw-bold alert alert-danger py-1 border-0">{error}</div>}
            </div>
          </div>
        )}
      </AdmissionProvider>
    </div>
  );
}