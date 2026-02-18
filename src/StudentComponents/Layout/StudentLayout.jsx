import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { List } from "react-bootstrap-icons";
import { auth, db } from "../../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import StudentSidebar from "./StudentSidebar";
import "./StudentLayout.css";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);
  const [userPic, setUserPic] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user?.email) return;

    // Header mein real pic lane ke liye data fetch
    const q = query(collection(db, "admissions"), where("email", "==", user.email.trim().toLowerCase()));
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setUserPic(snap.docs[0].data().photoUrl);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="student-container">
      {/* Sidebar Component */}
      <StudentSidebar open={open} setOpen={setOpen} />

      <div className="student-main-wrapper">
        
        {/* Top Header */}
        <header className="student-header border-bottom shadow-sm">
          <div className="d-flex align-items-center">
            <button className="btn d-lg-none me-2 shadow-none border-0" onClick={() => setOpen(true)}>
              <List size={25} className="text-dark" />
            </button>
            <h5 className="mb-0 fw-bold text-dark d-none d-md-block">Learning Portal</h5>
            <h6 className="mb-0 fw-bold text-dark d-md-none">Drishtee</h6>
          </div>
          
          <div className="user-profile-section d-flex align-items-center gap-2 px-2 py-1 bg-light rounded-pill border">
             <span className="ms-2 d-none d-sm-inline fw-bold text-dark small">My Account</span>
             {/* Yahan 'S' hata kar real image lagayi hai */}
             <img 
                src={userPic || `https://ui-avatars.com/api/?name=${user?.email}&background=4361ee&color=fff`} 
                alt="profile"
                className="rounded-circle shadow-sm border border-2 border-white" 
                style={{ width: 35, height: 35, objectFit: "cover" }}
                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
             />
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="student-content-body">
          <Outlet />
        </main>

      </div>
    </div>
  );
}