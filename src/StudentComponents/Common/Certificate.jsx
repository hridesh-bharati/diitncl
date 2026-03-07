import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import StudentCertificate from "../../AdminComponents/Certificate/StudentCertificate";

export default function CertificateWrapper() {

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    let unsubscribe;

    const initListener = () => {

      try {

        const user = auth.currentUser;

        if (!user || !user.email) {
          setError("User not authenticated.");
          setLoading(false);
          return;
        }

        const userEmail = user.email?.trim().toLowerCase();

        const q = query(
          collection(db, "admissions"),
          where("email", "==", userEmail)
        );

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {

            if (!snapshot.empty) {

              const docData = snapshot.docs[0].data();

              setStudent({
                id: snapshot.docs[0].id,
                ...docData
              });

              setError(null);

            } else {

              setError("No admission record found.");
              setStudent(null);

            }

            setLoading(false);

          },
          (err) => {

            console.error(err);
            setError("Failed to fetch data.");
            setLoading(false);

          }
        );

      } catch (err) {

        console.error(err);
        setError("Unexpected error.");
        setLoading(false);

      }

    };

    initListener();

    return () => unsubscribe && unsubscribe();

  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary"></div>
        <h6 className="mt-3 text-muted fw-bold">Verifying Credentials...</h6>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!student) return null;

  const hasMarks = student.percentage && student.percentage !== "";
  const hasDate = student.issueDate && student.issueDate !== "";

  if (student.certificateDisabled === true) {

    return (

      <div className="container py-4">

        <div className="card border-0 shadow-lg rounded-4 overflow-hidden mx-auto" style={{ maxWidth: "850px" }}>

          <div className="card-body p-4 p-md-5 bg-white text-center">

            <h4 className="fw-bold mb-3 text-danger">Certificate Disabled</h4>

            <p className="text-muted mb-4">
              The certificate has been disabled by the administrator.
              Please contact the admin.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4">

              <a
                href="tel:+919918151032"
                className="btn btn-primary rounded-pill px-4 py-2"
              >
                Call Now
              </a>

              <a
                href="https://wa.me/919918151032"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success rounded-pill px-4 py-2"
              >
                WhatsApp
              </a>

            </div>

          </div>

        </div>

      </div>

    );

  }

  const isIssued = student.certificateUrl || (hasMarks && hasDate);

  const progress = (hasMarks ? 50 : 0) + (hasDate ? 50 : 0);

  return (

    <div>

      {isIssued ? (

        <StudentCertificate student={student} />

      ) : (

        <div className="container py-4">

          <div className="card border-0 shadow-lg rounded-4 overflow-hidden mx-auto" style={{ maxWidth: "850px" }}>

            <div className="card-body p-4 p-md-5 bg-white text-center">

              <h4 className="fw-bold mb-3">
                Your Certificate is being processed
              </h4>

              <p className="text-muted mb-4">
                Please wait until the admin verifies your marks.
              </p>

              <div className="progress rounded-pill mb-3" style={{ height: "14px" }}>

                <div
                  className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                  style={{ width: `${progress}%` }}
                >
                  {progress}%
                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}