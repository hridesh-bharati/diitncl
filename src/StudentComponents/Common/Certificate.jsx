// src\StudentComponents\Common\Certificate.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import StudentCertificate from "../../AdminComponents/Certificate/StudentCertificate";

export default function CertificateWrapper() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user?.email) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }
    const q = query(collection(db, "admissions"), where("email", "==", user.email.toLowerCase()));
    
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setStudent({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        setError(null);
      } else {
        setError("No admission record found.");
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light"><div className="spinner-border text-primary" /><h6 className="mt-3 text-muted fw-bold">Verifying Credentials...</h6></div>;
  if (error) return <div className="container py-5 text-center"><div className="alert alert-danger">{error}</div></div>;
  if (!student) return null;

  if (student.certificateDisabled) {
    return (
      <div className="container py-4">
        <div className="card border-0 shadow-lg rounded-4 p-5 bg-white text-center">
          <h4 className="fw-bold mb-3 text-danger">Certificate Disabled</h4>
          <p className="text-muted">Contact admin for more details.</p>
        </div>
      </div>
    );
  }

  const isIssued = student.certificateUrl || (student.percentage && student.issueDate);
  const progress = (student.percentage ? 50 : 0) + (student.issueDate ? 50 : 0);

  return (
    <div>
      {isIssued ? <StudentCertificate student={student} /> : (
        <div className="container py-4">
          <div className="card border-0 shadow-lg rounded-4 p-5 bg-white text-center">
            <h4 className="fw-bold mb-3">Certificate Processing...</h4>
            <p className="text-muted small mb-4">Wait until admin verifies your marks.</p>
            <div className="progress rounded-pill" style={{ height: "14px" }}>
              <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{ width: `${progress}%` }}>{progress}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}