import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { doc, collection, query, where, onSnapshot, orderBy, limit, deleteDoc } from "firebase/firestore";
import StudentSidebar from "./StudentSidebar";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);
  const [userPic, setUserPic] = useState(null);
  const [userName, setUserName] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]); 

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user?.email) {
        const emailId = user.email.trim().toLowerCase();

        // 1. REAL-TIME PROFILE
        const unsubProfile = onSnapshot(doc(db, "admissions", emailId), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserPic(data.photoUrl);
            setUserName(data.name);
          }
        });

        // 2. REAL-TIME NOTIFICATIONS LIST (Top 5 unread)
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", emailId),
          where("isRead", "==", false),
          orderBy("time", "desc"),
          limit(5)
        );

        const unsubNotify = onSnapshot(q, (snapshot) => {
          setUnreadCount(snapshot.size);
          const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setNotifications(list); // Yahan data aa raha hai
        });

        return () => { unsubProfile(); unsubNotify(); };
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
              <h5 className="mb-0 fw-bold text-dark d-none d-md-block">Learning Portal</h5>
            </div>

            <div className="d-flex align-items-center gap-2 gap-md-3">
              {/* --- HOME --- */}
              <Link to="/student/dashboard" className="btn btn-light rounded-circle border-0">
                <i className="bi bi-house-door-fill text-secondary fs-5"></i>
              </Link>

              {/* --- NOTIFICATION DROPDOWN --- */}
              <div className="dropdown">
                <button className="btn btn-light rounded-circle border-0 position-relative" data-bs-toggle="dropdown">
                  <i className="bi bi-bell-fill text-secondary fs-5"></i>
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-0 overflow-hidden" style={{ width: '280px', borderRadius: '15px' }}>
                  <li className="p-3 border-bottom bg-light">
                    <h6 className="mb-0 fw-bold">Notifications</h6>
                  </li>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <li key={n.id} className="p-3 border-bottom bg-white position-relative shadow-sm mx-2 my-1 rounded-3 border-0 transition-all hover-bg-light">
                          <div className="d-flex gap-2 pe-4">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-2 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                              <i className="bi bi-pencil-square text-warning small"></i>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="mb-0 fw-bold text-dark" style={{ fontSize: '13px' }}>{n.title}</p>
                              <p className="mb-0 text-muted mt-1" style={{ fontSize: '11px', whiteSpace: 'pre-wrap' }}>
                                {n.message.split(' | ').map((msg, i) => (
                                  <span key={i} className="d-block border-start border-warning ps-2 mb-1">{msg}</span>
                                ))}
                              </p>
                              <small className="text-muted" style={{ fontSize: '9px' }}>
                                <i className="bi bi-clock me-1"></i>
                                {n.time?.toDate().toLocaleString()}
                              </small>
                            </div>
                          </div>

                          {/* individual Delete Button */}
                          <button
                            className="btn btn-sm position-absolute top-0 end-0 mt-1 me-1 rounded-circle border-0 text-danger opacity-50 hover-opacity-100"
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              try {
                                await deleteDoc(doc(db, "notifications", n.id));
                                toast.success("Notification Deleted", { autoClose: 1000 });
                              } catch (err) {
                                toast.error("Delete Failed");
                              }
                            }}
                          >
                            <i className="bi bi-trash3-fill" style={{ fontSize: '12px' }}></i>
                          </button>
                        </li>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <i className="bi bi-bell-slash text-muted fs-3"></i>
                        <p className="text-muted small mt-2">No new notifications</p>
                      </div>
                    )}
                  </div>
                  <li className="text-center p-2 bg-light">
                    <Link to="/student/notifications" className="text-decoration-none small fw-bold">View All</Link>
                  </li>
                </ul>
              </div>

              {/* --- PROFILE --- */}
              <div className="d-flex align-items-center p-1 pe-md-3 rounded-pill border bg-white shadow-sm" style={{ cursor: 'pointer' }} onClick={() => setOpen(true)}>
                <img
                  src={userPic || `https://ui-avatars.com/api/?name=${userName || 'User'}&background=4361ee&color=fff&bold=true`}
                  alt="profile" className="rounded-circle border border-2 border-white"
                  style={{ width: 35, height: 35, objectFit: "cover" }}
                />
                <span className="ms-2 d-none d-md-inline fw-bold small text-muted">Hi, {userName?.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow-1 overflow-auto bg-light p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}