import React, { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import AdmissionProvider from "../../../../AdminComponents/Admissions/AdmissionProvider";
import StudentCertificate from "../../../../AdminComponents/Certificate/StudentCertificate";
import Captcha from "./Captcha"; 

const STYLES = {
  card: {
    border: "none",
    borderRadius: "28px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
  },
  button: {
    borderRadius: "18px",
    padding: "14px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  }
};

export default function Verification() {
  const [regNo, setRegNo] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSearch = (admissions) => {
    setError("");
    if (!regNo) return setError("Please enter registration number");

    // 🔥 FIXED: Case-insensitive search - CAPTCHA nahi, REG NO search!
    const student = admissions.find(s => s.regNo?.toLowerCase() === regNo.toLowerCase());
    if (!student) return setError("No record found with this ID");

    setStudentId(student.id);
  };

  return (
    <AdmissionProvider>
      {({ admissions, loading }) => {
       
        if (!studentId) {
          return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-primary-subtle p-3">
              <Card style={{ ...STYLES.card, maxWidth: "440px" }} className="w-100 m-auto">
                <Card.Body className="p-4 p-md-5">
                  <HeaderSection title="Verify Certificate" subtitle="Secure student record verification" />

                  <Form onSubmit={(e) => { e.preventDefault(); handleSearch(admissions); }} className="d-flex flex-column gap-4">
                    <Form.Group>
                      <Form.Label className="ms-2 small fw-bold text-muted">REGISTRATION NUMBER</Form.Label>
                      <Form.Control
                        style={{ borderRadius: "16px", padding: "14px 20px" }}
                        placeholder="Ex: DIIT124/ADCA/921"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
                      />
                    </Form.Group>

                    {/* ✅ CAPTCHA - Case Sensitive! */}
                    <Captcha onVerify={setCaptchaVerified} />

                    <Button
                      type="submit"
                      variant={captchaVerified ? "primary" : "secondary"}
                      disabled={!captchaVerified}
                      style={STYLES.button}
                      className="shadow-sm border-0"
                    >
                      {captchaVerified ? "Check Status" : "Verify Captcha First"}
                    </Button>
                  </Form>

                  {error && <div className="mt-3 text-danger text-center small fw-medium">{error}</div>}
                </Card.Body>
              </Card>
            </div>
          );
        }

        return <ResultScreen student={admissions.find(s => String(s.id) === String(studentId))} onBack={() => setStudentId(null)} />;
      }}
    </AdmissionProvider>
  );
}

const HeaderSection = ({ title, subtitle }) => (
  <div className="text-center mb-5">
    <div className="bg-primary d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "70px", height: "70px", borderRadius: "22px" }}>
      <i className="bi bi-shield-check text-white fs-2"></i>
    </div>
    <h2 className="fw-bold text-dark">{title}</h2>
    <p className="text-muted small">{subtitle}</p>
  </div>
);

const ResultScreen = ({ student, onBack }) => (
  <div className="bg-light min-vh-100">
    <div className="p-3 border-bottom d-flex align-items-center bg-white shadow-sm">
      <Button variant="link" className="text-dark p-0 me-3" onClick={onBack}>
        <i className="bi bi-chevron-left fs-4"></i>
      </Button>
      <h6 className="m-0 fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>Verification Result</h6>
    </div>
    <div className="w-100">
      <StudentCertificate student={student} />
    </div>
  </div>
);