import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
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

    const q = query(
      collection(db, "admissions"),
      where("email", "==", user.email.trim().toLowerCase())
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setUserPic(snap.docs[0].data().photoUrl);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="student-container">
      <StudentSidebar open={open} setOpen={setOpen} />

      <div className="student-main-wrapper">
        <header className="student-header border-bottom shadow-sm">
          <div className="d-flex align-items-center">

            <h5 className="mb-0 fw-bold text-dark d-none d-md-block">Learning Portal </h5>
            <Link to={"/student/dashboard"}><i className="bi bi-house-fill fs-2 text-secondary"></i></Link>
          </div>

          <div className="user-profile-section">
            <button className="btn p-0 m-0" onClick={() => setOpen(true)}>
              <img
                src={userPic || `https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=4361ee&color=fff`}
                alt="profile"
                className="rounded-circle shadow-sm border border-2 border-white"
                style={{ width: 35, height: 35, objectFit: "cover" }}
                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              />
            </button>
          </div>
        </header>

        <main className="student-content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}