import React from "react";
import { auth } from "../../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ShieldLock, BoxArrowRight, Envelope } from "react-bootstrap-icons";

export default function AccountSettings() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleResetPassword = async () => {
    if (user?.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        alert("Password reset link sent to your email: " + user.email);
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white fw-bold">Account Settings</div>
        <div className="card-body">
          {/* Email Display */}
          <div className="d-flex align-items-center mb-4">
            <div className="bg-light p-3 rounded-circle me-3">
              <Envelope size={24} className="text-primary" />
            </div>
            <div>
              <label className="text-muted small d-block">Email Address</label>
              <span className="fw-bold text-dark">{user?.email || "Not Logged In"}</span>
            </div>
          </div>

          <hr />

          {/* Actions */}
          <div className="row g-3">
            <div className="col-md-6">
              <button 
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleResetPassword}
              >
                <ShieldLock /> Reset Password Link
              </button>
            </div>
            <div className="col-md-6">
              <button 
                className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleLogout}
              >
                <BoxArrowRight /> Logout from Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}