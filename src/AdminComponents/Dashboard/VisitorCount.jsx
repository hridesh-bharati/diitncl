import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function VisitorCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sirf data READ karne ke liye ref
    const ref = doc(db, "stats", "visitors");

    // 👁️ Real-time listener: Jab bhi DB mein count badhega, yahan update ho jayega
    const unsub = onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        setCount(docSnap.data().count || 0);
      }
      setLoading(false);
    }, (error) => {
      console.error("Listen error:", error);
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
            drishteeindia.com Live Visitors
          </h5>
          {loading ? (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <>
              <h1 className="display-3 fw-bold text-primary">
                {count.toLocaleString()}
              </h1>
              <div className="small fs-6">From 03 MARCH 2026</div>
              <p className="text-success mb-0">
                <i className="bi bi-check-circle-fill me-1"></i>
                Real-time Sync Active
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}