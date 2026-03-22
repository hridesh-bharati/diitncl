import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";  
import StudentCertificate from "../../AdminComponents/Certificate/StudentCertificate";

export default function CertificateWrapper() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribeSnap = null;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      const userEmail = user?.email || localStorage.getItem("user_email");

      if (!userEmail) {
        if (!user && loading) {
           // Auth load hone ka wait kar raha hai
        } else {
           setError("User session not found. Please login again.");
           setLoading(false);
        }
        return;
      }

      const emailId = userEmail.toLowerCase().trim();
      const docRef = doc(db, "admissions", emailId);

      if (unsubscribeSnap) unsubscribeSnap();

      unsubscribeSnap = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          setStudent({ id: snap.id, ...snap.data() });
          setError(null);
        } else {
          setError("No admission record found for " + emailId);
        }
        setLoading(false);
      }, (err) => {
        console.error("Firestore Error:", err);
        setError("Database access denied. Please contact admin.");
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
    };
  }, []);

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="spinner-border text-primary" role="status"></div>
      <h6 className="mt-3 text-muted fw-bold animate__animated animate__pulse animate__infinite">
        Synchronizing Certificate Data...
      </h6>
    </div>
  );

  if (error) return (
    <div className="container py-5 text-center animate__animated animate__fadeIn">
      <div className="alert alert-danger shadow-sm rounded-4 p-4">
        <i className="bi bi-exclamation-octagon fs-1 d-block mb-2"></i>
        {error}
      </div>
    </div>
  );

  if (!student) return null;

  if (student.certificateDisabled) {
    return (
      <div className="container py-5 animate__animated animate__fadeIn">
        <div className="card border-0 shadow-lg rounded-4 p-5 bg-white text-center">
          <i className="bi bi-shield-lock-fill text-danger display-1 mb-3"></i>
          <h4 className="fw-bold mb-3">Access Restricted</h4>
          <p className="text-muted">Your certificate access has been disabled by the administrator.</p>
        </div>
      </div>
    );
  }

  // ✅ Important Logic: Marks aur Date dono hone par hi Certificate dikhega
  const isIssued = (student.percentage || student.percentage === 0) && student.issueDate;
  const progress = (student.percentage ? 50 : 0) + (student.issueDate ? 50 : 0);

  return (
    <div className="animate__animated animate__fadeIn">
      {isIssued ? (
        <StudentCertificate student={student} />
      ) : (
        <div className="container py-5">
          <div className="card border-0 shadow-lg rounded-4 p-5 bg-white text-center">
            <h4 className="fw-bold mb-3">Generation in Progress</h4>
            <div className="progress rounded-pill mb-3" style={{ height: "20px" }}>
              <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                   style={{ width: `${progress}%`, transition: 'width 0.5s ease' }}>
                {progress}%
              </div>
            </div>
            <p className="text-muted small">Admin is finalizing your marks and issue date.</p>
          </div>
        </div>
      )}
    </div>
  );
}