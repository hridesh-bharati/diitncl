// src\StudentComponents\Dashboard\Profile.jsx
import React, { useEffect, useState, useMemo } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// --- UI COMPONENTS ---
const InfoItem = ({ icon, label, value }) => (
  <div className="d-flex align-items-center p-3 mb-2 bg-white rounded-4 border-0 shadow-sm border-start border-primary border-4">
    <div className="icon-box bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px' }}>
      <i className={`bi ${icon} text-primary fs-5`}></i>
    </div>
    <div className="overflow-hidden">
      <p className="text-muted mb-0 fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>{label.toUpperCase()}</p>
      <p className="mb-0 fw-semibold text-dark text-truncate">{value || "—"}</p>
    </div>
  </div>
);

const QuickStat = ({ label, value, icon, color }) => (
  <div className="col-4">
    <div className={`p-3 rounded-4 text-center shadow-sm h-100 bg-white border-bottom border-3 border-${color}`}>
      <div className={`mx-auto mb-2 rounded-circle d-flex align-items-center justify-content-center bg-${color} text-white shadow-sm`}
        style={{ width: '40px', height: '40px' }}>
        <i className={`bi ${icon} fs-5`}></i>
      </div>
      <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.9rem' }}>{value || "0"}</h6>
      <small className="text-muted fw-medium" style={{ fontSize: '0.65rem' }}>{label}</small>
    </div>
  </div>
);

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    // 1. Email check (Auth या LocalStorage से)
    const userEmail = user?.email || localStorage.getItem("user_email");
    
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const emailId = userEmail.trim().toLowerCase();
    const docRef = doc(db, "admissions", emailId);

    // ✅ LIVE LISTENER: No refresh needed for any admin updates
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setStudent(snap.data());
      } else {
        console.warn("Profile not found for:", emailId);
        setStudent(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore error:", err);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [user]);

  const personalData = useMemo(() => [
    { icon: "bi-person-badge", label: "Father's Name", value: student?.fatherName },
    { icon: "bi-person-hearts", label: "Mother's Name", value: student?.motherName },
    { icon: "bi-cake2", label: "Birth Date", value: student?.dob },
    { icon: "bi-phone", label: "Contact", value: student?.mobile },
    { icon: "bi-fingerprint", label: "Aadhar Card", value: student?.aadharNo },
  ], [student]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="spinner-border text-primary" />
    </div>
  );
  
  if (!student) return (
    <div className="container mt-5">
      <div className="alert alert-warning text-center rounded-4 shadow-sm p-4">
        <i className="bi bi-exclamation-triangle fs-1 d-block mb-2"></i>
        <strong>Profile Not Found!</strong><br />
        Contact administrator to sync your record with <b>{user?.email}</b>.
      </div>
    </div>
  );

  const profileImg = student.photoUrl || `https://ui-avatars.com/api/?name=${student.name}&background=0d6efd&color=fff`;

  return (
    <div className="pb-5" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* HEADER SECTION */}
      <div className="position-relative mb-5 shadow-sm" style={{ height: '110px', background: 'linear-gradient(135deg, #013788 0%, #1e40af 100%)', borderRadius: '0 0 35px 35px' }}>
        <h5 className="fw-bold text-white text-center pt-3 small opacity-75">MY DRISHTEE PROFILE</h5>
        <div className="position-absolute start-50 translate-middle-x" style={{ bottom: '-55px' }}>
          <div className="rounded-circle p-1 bg-white shadow-lg" style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)}>
            <img src={profileImg} alt="Profile" className="rounded-circle" style={{ width: 110, height: 110, objectFit: "cover", border: '3px solid #f8fafc' }} />
          </div>
        </div>
      </div>

      <div className="container mt-5 pt-3 text-center animate__animated animate__fadeIn">
        <h3 className="fw-bolder text-dark mt-2 mb-1">{student.name} <i className="bi bi-patch-check-fill text-primary small"></i></h3>
        <p className="text-muted mb-3 small fw-medium">{student.email}</p>

        {/* BADGES */}
        <div className="d-flex justify-content-center gap-2 mb-4">
          <span className="badge rounded-pill px-3 py-2 bg-white text-primary shadow-sm border border-primary-subtle small">{student.course}</span>
          <span className="badge rounded-pill px-3 py-2 bg-dark text-white shadow-sm small">{student.regNo || "PENDING"}</span>
        </div>

        {/* QUICK STATS */}
        <div className="row g-3 mb-4 px-2">
          <QuickStat label="Academic" value={student.percentage ? `${student.percentage}%` : "—"} icon="bi-graph-up-arrow" color="success" />
          <QuickStat label="Joined" value={student.admissionDate?.split('-')[0] || '2026'} icon="bi-calendar-check" color="primary" />
          <QuickStat label="Portal" value={student.certificateDisabled ? "Locked" : "Active"} icon={student.certificateDisabled ? "bi-lock" : "bi-unlock"} color={student.certificateDisabled ? "danger" : "warning"} />
        </div>

        {/* DETAILS SECTION */}
        <div className="text-start px-2 mt-4">
          <h6 className="fw-bold text-dark mb-3 ps-1 text-uppercase opacity-75" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Personal Details</h6>
          <div className="row g-2">
            {personalData.map((item, idx) => (
              <div key={idx} className={item.label === "Aadhar Card" ? "col-12" : "col-md-6"}>
                <InfoItem {...item} />
              </div>
            ))}
          </div>

          <h6 className="fw-bold text-dark mb-3 ps-1 mt-4 text-uppercase opacity-75" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Address & Location</h6>
          <div className="bg-white p-3 rounded-4 shadow-sm mb-5 border-0 border-start border-danger border-4">
            <div className="d-flex align-items-start">
              <i className="bi bi-geo-alt-fill text-danger fs-4 me-3"></i>
              <div>
                <p className="mb-1 fw-bold text-dark">{student.address || "No Address Added"}</p>
                <p className="text-muted mb-0 small">
                  {student.village || "—"}, {student.city || "—"}, {student.state || "—"} - {student.pincode || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULL IMAGE MODAL */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{ zIndex: 9999, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowModal(false)}>
          <img src={profileImg} alt="Profile Full View" className="rounded-4 border border-4 border-white shadow-lg"
            style={{ maxWidth: '90%', maxHeight: '80%', objectFit: 'contain' }} />
        </div>
      )}
    </div>
  );
}