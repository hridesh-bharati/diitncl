import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore"; // Import onSnapshot
import StudentSidebar from "./StudentSidebar";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);
  const [userPic, setUserPic] = useState(null);
  const [userName, setUserName] = useState("");
  const [unreadCount, setUnreadCount] = useState(0); // Notification count state

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user?.email) {
        const emailId = user.email.trim().toLowerCase();

        // 1. Fetch User Profile (One-time)
        try {
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

        // 2. Real-time Notifications Listener (FB Jaisa)
        // Hum 'notifications' collection check kar rahe hain jaha student ki email match ho aur isRead false ho
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", emailId),
          where("isRead", "==", false)
        );

        const unsubscribeNotifications = onSnapshot(q, (snapshot) => {
          setUnreadCount(snapshot.size); // Jitne documents milenge, wahi count hoga
        });

        return () => unsubscribeNotifications();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light">
      <StudentSidebar open={open} setOpen={setOpen} />

      <div className="d-flex flex-column flex-grow-1 min-vw-0">
        <header className="bg-white border-bottom shadow-sm px-3 py-2" style={{ minHeight: '70px', zIndex: 1000 }}>
          <div className="h-100 d-flex align-items-center justify-content-between">

            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-light d-lg-none rounded-circle border shadow-sm" onClick={() => setOpen(true)}>
                <i className="bi bi-list fs-4"></i>
              </button>
              <div className="ms-1 ms-md-0">
                <h5 className="mb-0 fw-bold text-dark d-none d-md-block">Learning Portal</h5>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 gap-md-3">
              {/* --- DYNAMIC NOTIFICATION BADGE --- */}
              <Link to="/student/dashboard" className="btn btn-light rounded-circle border-0 shadow-none">
                <i className="bi bi-house-door-fill text-secondary fs-5"></i>
              </Link>

              <Link to="/student/notifications" className="btn btn-light rounded-circle border-0 shadow-none position-relative">
                <i className="bi bi-bell-fill text-secondary fs-5"></i>
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                    {unreadCount}
                  </span>
                )}
              </Link>



              <div
                className="d-flex align-items-center p-1 pe-md-3 rounded-pill border bg-white shadow-sm"
                style={{ cursor: 'pointer' }}
                onClick={() => setOpen(true)}
              >
                <img
                  src={userPic || `https://ui-avatars.com/api/?name=${userName || 'User'}&background=4361ee&color=fff&bold=true`}
                  alt="profile"
                  className="rounded-circle shadow-sm border border-2 border-white"
                  style={{ width: 35, height: 35, objectFit: "cover" }}
                />
                <span className="ms-2 d-none d-md-inline fw-bold small text-muted">
                  Hi, {userName?.split(' ')[0] || 'Student'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow-1 overflow-auto bg-light p-md-4">
          <div className="container-fluid p-0 animate__animated animate__fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}