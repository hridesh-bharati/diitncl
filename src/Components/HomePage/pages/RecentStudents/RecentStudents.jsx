import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase";

import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function RecentStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✨ Cloudinary Optimization for Cards
  const getOptimizedImg = (url) => {
    if (!url || !url.includes("cloudinary")) return "/images/icon/default-avatar.png";
    return url.replace("/upload/", "/upload/w_400,h_500,c_fill,g_face,f_auto,q_auto/");
  };

  useEffect(() => {
    const q = query(
      collection(db, "admissions"),
      orderBy("createdAt", "desc"),
      limit(8)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <div className="container-fluid px-3 py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold m-0" style={{ color: "#0a2885" }}>
          Our New Students <span className="badge bg-danger-subtle text-danger ms-1 small" style={{ fontSize: '10px' }}>New</span>
        </h5>
        <Link to="/new-admission" className="btn btn-sm btn-primary rounded-pill px-3 border-0 fw-bold">
          Admission
        </Link>
      </div>

      {/* Horizontal Scroll Wrapper */}
      <div className="d-flex gap-3 overflow-auto pb-3 custom-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
        {students.map((s) => (
          <div key={s.id} className="student-card-fb shadow-sm bg-white rounded-4 overflow-hidden border border-light"
            style={{ minWidth: "160px", maxWidth: "160px", scrollSnapAlign: 'start' }}>

            {/* Student Image */}
            <div className="position-relative" style={{ height: "180px" }}>
              <img
                src={getOptimizedImg(s.photoUrl)}
                alt={s.name}
                className="w-100 h-100 object-fit-cover"
                loading="lazy"
              />
              {/* Branch Badge */}
              <div className="position-absolute top-0 start-0 m-2">
                <span className="badge bg-dark bg-opacity-50 blur-filter shadow-sm" style={{ fontSize: '9px' }}>
                  {s.branch === "DIIT124" ? "Main" : "East"}
                </span>
              </div>
            </div>

            {/* Student Details */}
            <div className="p-2 text-start">
              <h6 className="fw-bold text-dark text-truncate mb-0" style={{ fontSize: "13px" }}>
                {s.name}
              </h6>
              <p className="text-muted mb-2 text-truncate" style={{ fontSize: "11px" }}>
                {s.course || "DIIT Student"}
              </p>
              {/*               
              <Link to={`/new-admission`} className="btn btn-primary btn-sm w-100 rounded-3 fw-bold shadow-none" style={{ fontSize: "11px", background: '#0a2885' }}>
                View Profile
              </Link> */}
            </div>
          </div>
        ))}

        {/* See More Card */}
        {/* <div className="d-flex align-items-center justify-content-center rounded-4 border border-dashed border-primary bg-primary-subtle" 
             style={{ minWidth: "140px", height: "auto" }}>
            <Link to="/gallery" className="text-decoration-none text-center p-3">
               <i className="bi bi-arrow-right-circle-fill fs-2 text-primary"></i>
               <p className="fw-bold text-primary small m-0">Explore More</p>
            </Link>
        </div> */}
      </div>

      <style>{`
        .student-card-fb {
          transition: transform 0.3s ease;
        }
        .student-card-fb:hover {
          transform: translateY(-5px);
        }
        .blur-filter {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0a288522;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}