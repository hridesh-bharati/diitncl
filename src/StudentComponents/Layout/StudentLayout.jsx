import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import StudentSidebar from "./StudentSidebar";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);
  const [userPic, setUserPic] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user?.email) {
        const emailId = user.email.trim().toLowerCase();

        // Real-time Student Profile Data (for Image & Name)
        const unsubscribeUser = onSnapshot(doc(db, "admissions", emailId), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(data.name || "Student");
            setUserPic(data.photoUrl || null);
          }
        });

        return () => unsubscribeUser();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light">
      {/* SIDEBAR */}
      <StudentSidebar open={open} setOpen={setOpen} />

      <div className="d-flex flex-column flex-grow-1 min-vw-0">
        {/* HEADER */}
        <header className="bg-white border-bottom shadow-sm px-3 py-2" style={{ minHeight: '70px', zIndex: 1000 }}>
          <div className="h-100 d-flex align-items-center justify-content-between">

            {/* LEFT: Menu & Title */}
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-light d-lg-none rounded-circle border shadow-sm" onClick={() => setOpen(true)}>
                <i className="bi bi-list fs-4"></i>
              </button>
              <h5 className="mb-0 fw-bold text-dark d-none d-md-block">Learning Portal</h5>
            </div>

            {/* RIGHT: Home & Profile */}
            <div className="d-flex align-items-center gap-2 gap-md-3">
              
              {/* HOME BUTTON */}
              <Link to="/student/dashboard" className="btn btn-light rounded-circle border-0">
                <i className="bi bi-house-door-fill text-secondary fs-5"></i>
              </Link>

              {/* PROFILE CHIP */}
              <div 
                className="d-flex align-items-center p-1 pe-md-3 rounded-pill border bg-white shadow-sm transition-all" 
                style={{ cursor: 'pointer' }} 
                onClick={() => setOpen(true)}
              >
                <img
                  src={userPic || `https://ui-avatars.com/api/?name=${userName || 'User'}&background=4361ee&color=fff&bold=true`}
                  alt="profile" 
                  className="rounded-circle border border-2 border-white"
                  style={{ width: 35, height: 35, objectFit: "cover" }}
                />
                <span className="ms-2 d-none d-md-inline fw-bold small text-muted">
                  Hi, {userName?.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-grow-1 overflow-auto bg-light">
          <div className="container-fluid p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}