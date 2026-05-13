import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

export default function RecentStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  const getOptimizedImg = (url) => {
    if (!url || !url.includes("cloudinary")) return "/images/icon/default-avatar.png";
    return url.replace("/upload/", "/upload/w_400,h_500,c_fill,g_face,f_auto,q_auto/");
  };

  useEffect(() => {
    const q = query(collection(db, "admissions"), orderBy("createdAt", "desc"), limit(8));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <div className="container-fluid py-4" style={{ background: "linear-gradient(135deg, #f8f9ff 0%, #eef2f7 100%)", borderRadius: "20px" }}>
      
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-2">
        <div>
          <h5 className="fw-bold m-0" style={{ color: "#0a2885", letterSpacing: "-0.5px" }}>
            <span style={{ color: "#ff416c" }}>Our</span> New Members
          </h5>
          <small className="text-muted" style={{ fontSize: '11px' }}>Recently joined DIIT family</small>
        </div>
        <Link to="/new-admission" className="btn btn-sm text-white rounded-pill px-3 fw-bold shadow" 
          style={{ background: "linear-gradient(45deg, #0a2885, #1e40af)", border: "none", fontSize: "12px" }}>
          + New Admission
        </Link>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="d-flex gap-4 overflow-auto pb-3 custom-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {students.map((s) => (
          <div key={s.id} className="card border-0 shadow-lsg position-relative" 
            style={{ 
              minWidth: "170px", 
              borderRadius: "20px", 
              overflow: "hidden",
              transition: "transform 0.3s ease",
              background: "#fff"
            }}>
            
            {/* Student Image with Gradient Overlay */}
            <div className="position-relative">
              <img
                src={getOptimizedImg(s.photoUrl)}
                alt={s.name}
                className="w-100"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="position-absolute top-0 end-0 m-2">
                 <span className={`badge rounded-pill ${s.branch === "DIIT124" ? "bg-primary" : "bg-warning text-dark"}`} 
                       style={{ fontSize: "9px", backdropFilter: "blur(4px)", opacity: "0.9" }}>
                  {s.branch === "DIIT124" ? "Main Branch" : "East Branch"}
                </span>
              </div>
              {/* Bottom Fade Overlay */}
              <div className="position-absolute bottom-0 w-100" style={{ height: "40%", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}></div>
            </div>

            {/* Content Area */}
            <div className="p-3 text-center">
              <div className="fw-bold text-dark text-truncate mb-1" style={{ fontSize: "14px" }}>
                <i className="bi bi-patch-check-fill text-primary shadow-" style={{ fontSize: "13px" }}></i> {s.name}
              </div>
              
              <div className="mb-3">
                <span className="badge rounded-pill bg-light text-primary border px-2 py-1" style={{ fontSize: "10px", fontWeight: "600" }}>
                   {s.course || "General Course"}
                </span>
              </div>

              {isAdmin ? (
                <Link
                  to={`/admin/students/${encodeURIComponent(s.email)}`}
                  className="btn btn-sm w-100 rounded-pill fw-bold"
                  style={{ 
                    fontSize: "11px", 
                    background: "#0a2885", 
                    color: "white",
                    boxShadow: "0 4px 12px rgba(10, 40, 133, 0.2)" 
                  }}
                >
                  View Profile
                </Link>
              ) : (
                <div className="py-1 px-2 rounded-pill d-inline-block" 
                     style={{ background: "rgba(25, 135, 84, 0.1)", color: "#198754", fontSize: "10px", fontWeight: "700" }}>
                  <i className="bi bi-shield-check me-1"></i> Verified DIITian
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .card:hover { transform: translateY(-5px); }
      `}</style>
    </div>
  );
}