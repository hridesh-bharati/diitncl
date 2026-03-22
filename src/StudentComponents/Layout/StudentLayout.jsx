// src\StudentComponents\Layout\StudentLayout.jsx
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import StudentSidebar from "./StudentSidebar";
import "./StudentLayout.css";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);
  const [userPic, setUserPic] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Auth state listener: यह पक्का करता है कि यूजर लोड होते ही डेटा फेच हो
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user?.email) {
        const emailId = user.email.trim().toLowerCase();
        
        try {
          // ईमेल को ही ID मानकर सीधा डॉक्यूमेंट फेच करना (Sasta और Fast)
          const docRef = doc(db, "admissions", emailId);
          const snap = await getDoc(docRef);

          if (snap.exists()) {
            const data = snap.data();
            setUserPic(data.photoUrl);
            setUserName(data.name);
          }
        } catch (err) {
          console.error("Layout Fetch Error:", err);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="student-container">
      {/* Sidebar - Features kept intact */}
      <StudentSidebar open={open} setOpen={setOpen} />

      <div className="student-main-wrapper">
        <header className="student-header border-bottom shadow-sm bg-white py-2">
          <div className="container-fluid d-flex align-items-center justify-content-between">
            
            <div className="d-flex align-items-center">
              <h5 className="mb-0 fw-bold text-dark d-none d-md-block">Learning Portal</h5>
              <Link to={"/student/dashboard"} className="ms-2">
                <i className="bi bi-house-fill fs-2 text-secondary"></i>
              </Link>
            </div>

            <div className="user-profile-section">
              <button className="btn p-0 m-0 border-0 shadow-none" onClick={() => setOpen(true)}>
                <img
                  src={userPic || `https://ui-avatars.com/api/?name=${userName || 'User'}&background=4361ee&color=fff&bold=true`}
                  alt="profile"
                  className="rounded-circle shadow-sm border border-2 border-white"
                  style={{ width: 40, height: 40, objectFit: "cover" }}
                  onError={(e) => (e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png")}
                />
              </button>
            </div>

          </div>
        </header>

        {/* Content Area */}
        <main className="student-content-body p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}