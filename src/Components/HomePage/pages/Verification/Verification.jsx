import React, { useState, useRef } from "react";
import AdmissionProvider from "../../../../AdminComponents/Admissions/AdmissionProvider";
import StudentCertificate from "../../../../AdminComponents/Certificate/StudentCertificate";
import Captcha from "./Captcha";

export default function Verification() {
  const [regNo, setRegNo] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [dob, setDob] = useState("");
  const hiddenDateRef = useRef(null);

  // Instant Auto-Slash (DD/MM/YYYY)
  const handleDobChange = (e) => {
    let v = e.target.value;
    if (e.nativeEvent.inputType === "deleteContentBackward") { setDob(v); return; }
    
    let clean = v.replace(/\D/g, "");
    let final = clean;

    if (clean.length >= 2) {
      final = clean.slice(0, 2) + "/";
      if (clean.length >= 4) {
        final += clean.slice(2, 4) + "/" + clean.slice(4, 8);
      } else {
        final += clean.slice(2);
      }
    }
    setDob(final.slice(0, 10)); // User pure 10 chars daalega
  };

  const handleSearch = (admissions) => {
    setError("");
    if (!regNo || dob.length < 10) return setError("Please enter full details");

    // Logic: "04/04/2025" ko "04/04/25" banana match ke liye
    const parts = dob.split("/");
    const shortYearDob = `${parts[0]}/${parts[1]}/${parts[2].slice(-2)}`;

    const student = admissions.find(s => 
      s.regNo?.toUpperCase() === regNo.trim().toUpperCase() && 
      s.dob === shortYearDob
    );

    student ? setSelectedStudent(student) : setError("No Record Found!");
  };

  if (selectedStudent) return (
    <div className="vh-100 bg-white">
      <div className="p-3 border-bottom d-flex align-items-center bg-light shadow-sm sticky-top">
        <button className="btn btn-sm btn-dark me-3 rounded-pill px-3" onClick={() => setSelectedStudent(null)}>← Back</button>
        <b className="text-primary small">VERIFIED RESULT</b>
      </div>
      <StudentCertificate student={selectedStudent} />
    </div>
  );

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center p-3" style={{background: "#F5F3FF"}}>
      <AdmissionProvider>
        {({ admissions }) => (
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{maxWidth: "380px", width: "100%"}}>
            <div style={{height: "6px", background: "linear-gradient(90deg, #4F46E5, #7C3AED)"}}></div>
            <div className="card-body p-4 text-center">
              <i className="bi bi-patch-check-fill display-5 text-primary mb-2"></i>
              <h4 className="fw-bold">Student Verify</h4>
              <p className="small text-muted mb-4">Official Verification Portal</p>

              <form onSubmit={(e) => { e.preventDefault(); handleSearch(admissions); }}>
                <div className="text-start mb-3">
                  <label className="small fw-bold text-primary">REGISTRATION NO</label>
                  <input className="form-control border-2 shadow-none py-2" placeholder="DIIT/XXX/XXX" value={regNo} onChange={e => setRegNo(e.target.value.toUpperCase())} />
                </div>

                <div className="text-start mb-4">
                  <label className="small fw-bold text-primary">DATE OF BIRTH</label>
                  <div className="input-group">
                    <input className="form-control border-2 border-end-0 shadow-none py-2" placeholder="DD/MM/YYYY" value={dob} onChange={handleDobChange} maxLength="10" inputMode="numeric" />
                    <span className="input-group-text bg-white border-2 border-start-0 cursor-pointer" onClick={() => hiddenDateRef.current.showPicker()}><i className="bi bi-calendar3 text-primary"></i></span>
                  </div>
                </div>

                <div className="bg-light p-2 rounded border mb-4 text-center">
                  <Captcha onVerify={setCaptchaVerified} />
                </div>

                <button className={`btn w-100 py-3 fw-bold shadow-sm rounded-3 ${captchaVerified ? 'btn-primary' : 'btn-secondary opacity-50'}`} style={{background: captchaVerified ? "#4F46E5" : ""}} disabled={!captchaVerified}>
                  VERIFY NOW
                </button>
              </form>
              {error && <div className="mt-3 small text-danger fw-bold alert alert-danger py-1">{error}</div>}
            </div>
          </div>
        )}
      </AdmissionProvider>
      <input type="date" ref={hiddenDateRef} className="d-none" onChange={e => {
        if(!e.target.value) return;
        const [y, m, d] = e.target.value.split("-");
        setDob(`${d}/${m}/${y}`); 
      }} />
    </div>
  );
}