// src\Components\Certificate\StudentCertificateWrapper.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Spinner, Alert } from "react-bootstrap";
import StudentCertificate from "../../AdminComponents/Certificate/StudentCertificate"; // Admin certificate

export default function CertificateWrapper() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};

    const initListener = async () => {
      try {
        const user = auth.currentUser;
        if (!user || !user.email) {
          setError("User not authenticated or email missing.");
          setLoading(false);
          return;
        }

        const userEmail = user.email.trim().toLowerCase();
        const q = query(collection(db, "admissions"), where("email", "==", userEmail));

        unsubscribe = onSnapshot(q, snapshot => {
          if (!snapshot.empty) {
            const docData = snapshot.docs[0].data();
            setStudent({ id: snapshot.docs[0].id, ...docData });
            setError(null);
          } else {
            setError("No admission record found for this email.");
          }
          setLoading(false);
        }, err => {
          console.error(err);
          setError("Failed to fetch data from server.");
          setLoading(false);
        });
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred.");
        setLoading(false);
      }
    };

    initListener();
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation="border" variant="primary" />
        <h6 className="mt-3 text-muted fw-bold">Verifying Credentials...</h6>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  if (!student) return null;

  // ===== Status logic =====
  const hasMarks = student.percentage !== undefined && student.percentage !== "";
  const hasDate = student.issueDate !== undefined && student.issueDate !== "";

  const isIssued = student.certificateUrl || (hasMarks && hasDate);

  // ===== RENDER =====
  return (
    <div>
      {isIssued ? (
        // Issued → Render Admin-style certificate
        <StudentCertificate student={student} />
      ) : (
        // In-process → Show template progress
        <div className="container py-4">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden mx-auto" style={{ maxWidth: "850px" }}>
            <div className="card-body p-4 p-md-5 bg-white text-center">
              <h4 className="fw-bold mb-3">Your Certificate is being processed</h4>
              <p className="text-muted mb-4">Please wait until the admin verifies your marks and releases the certificate.</p>
              <div className="progress rounded-pill mb-3" style={{ height: "14px", background: "#f0f0f0" }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{ width: "60%" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
