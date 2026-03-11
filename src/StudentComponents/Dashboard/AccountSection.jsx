import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// DRY Component for Settings Rows
const SettingItem = ({ icon, title, subtitle, onClick, variant = "primary", isDanger = false }) => (
  <button
    className="btn btn-white w-100 d-flex align-items-center p-3 mb-2 bg-white rounded-4 shadow-sm border-0 text-start transition-all"
    onClick={onClick}
  >
    <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${isDanger ? 'bg-danger-subtle' : 'bg-light'}`}
      style={{ width: '48px', height: '48px' }}>
      <i className={`bi ${icon} fs-5 ${isDanger ? 'text-danger' : `text-${variant}`}`}></i>
    </div>
    <div className="flex-grow-1">
      <h6 className={`mb-0 fw-bold ${isDanger ? 'text-danger' : 'text-dark'}`}>{title}</h6>
      {subtitle && <small className="text-muted">{subtitle}</small>}
    </div>
    <i className="bi bi-chevron-right text-muted opacity-50"></i>
  </button>
);

export default function AccountSection() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    (async () => {
      try {
        const q = query(collection(db, "admissions"), where("email", "==", user.email.toLowerCase()));
        const snap = await getDocs(q);
        if (!snap.empty) setStudentData(snap.docs[0].data());
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    })();
  }, [user]);

  const handleAction = async (actionType) => {
    try {
      if (actionType === 'reset') {
        await sendPasswordResetEmail(auth, user.email);
        alert("Reset link sent!");
      } else if (actionType === 'logout' && window.confirm("Logout?")) {
        await signOut(auth);
        navigate("/login");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container bg-light">
      {/* Profile Header */}
      {/* <div className="text-center py-5">
        <div className="position-relative d-inline-block mb-3">
          {studentData?.photoUrl ? (
            <img src={studentData.photoUrl} alt="Profile" className="rounded-circle shadow border border-3 border-white" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
          ) : (
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: "100px", height: "100px", fontSize: "2.5rem" }}>
              {user?.email?.[0].toUpperCase()}
            </div>
          )}
          <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-2"></span>
        </div>
        <h4 className="fw-bold mb-0">{studentData?.name || "User"}</h4>
        <p className="text-muted small">{user?.email}</p>
      </div> */}

      {/* Settings Options */}
      <div className="container">
        <p className="text-uppercase small fw-bold text-muted mt-2">Security & Help</p>
        <p className="text-primary small"><b>Email id: </b>{user?.email}</p>

        <SettingItem
          icon="bi-shield-lock" title="Password" subtitle="Send reset link to email"
          onClick={() => handleAction('reset')}
        />
        {/* Support Section */}
        <SettingItem
          icon="bi-headset"
          title="Support"
          subtitle="Get help from our team"
          variant="info"
          onClick={() => navigate('/contact-us')}
        />

        <p className="text-uppercase small fw-bold text-muted mb-3 ms-2 mt-4">Account</p>

        <SettingItem
          icon="bi-box-arrow-right" title="Logout" subtitle="Safe sign out" isDanger
          onClick={() => handleAction('logout')}
        />
      </div>
    </div>
  );
}