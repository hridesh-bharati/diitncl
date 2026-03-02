// src/AdminComponents/Stats/VisitorCount.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, onSnapshot, increment, setDoc } from "firebase/firestore";

export default function VisitorCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "stats", "visitors");

    // 🔥 REAL visitor count badhao
    const trackRealVisitor = async () => {
      const hasVisited = sessionStorage.getItem("drishtee_visitor");
      
      if (!hasVisited) {
        try {
          await setDoc(ref, { 
            count: increment(1),
            lastVisit: new Date().toISOString(),
            page: window.location.pathname
          }, { merge: true });
          
          sessionStorage.setItem("drishtee_visitor", "true");
          console.log("✅ REAL visitor counted for drishteeindia.com");
        } catch (error) {
          console.error("Visitor count error:", error);
        }
      }
    };

    trackRealVisitor();

    // 👁️ Real-time count dekho
    const unsub = onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        setCount(docSnap.data().count || 0);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <div className="container mt-3">
      <div className="card shadow-sm border-0">
        <div className="card-body text-center">
          <h5 className="text-muted mb-2">
            <i className="bi bi-people-fill me-2"></i>
            drishteeindia.com Real Visitors
          </h5>
          {loading ? (
            <div className="spinner-border text-primary" />
          ) : (
            <>
              <h1 className="display-3 fw-bold text-primary">
                {count}
              </h1>
              <p className="text-success mb-0">
                <i className="bi bi-check-circle-fill me-1"></i>
                Real-time • Every visit counts
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}