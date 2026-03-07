import React from "react";
import { auth } from "../../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AccountSection() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleResetPassword = async () => {
    if (user?.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        alert("Reset link sent to " + user.email);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container p-3">
      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">⚙️ Account Settings</h6>
        </div>
        <div className="card-body">
          <p className="mb-3"><strong>Email:</strong> {user?.email}</p>
          <button className="btn btn-primary w-100 mb-2" onClick={handleResetPassword}>
            Reset Password
          </button>
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}