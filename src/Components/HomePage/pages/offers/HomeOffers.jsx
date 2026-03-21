import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";

export default function HomeOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "offers"), orderBy("createdAt", "desc"), limit(5));
    return onSnapshot(q, s => {
      setOffers(s.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  if (loading || !offers.length) return loading ? <p className="text-center small my-4">...</p> : null;

  return (
    <section className="container my-3">
      <h2 className="h6 fw-bold mb-3"><i className="bi bi-circle-fill text-danger small me-2"></i>Special Offers</h2>
      <div className="row g-2">
        {offers.map(({ id, caption, details, adminPhoto, adminName, createdAt }) => (
          <div className="col-12" key={id}>
            <div className="p-3 border rounded-4 bg-white shadow-sm">
              <div className="d-flex justify-content-between mb-1">
                <span className="badge rounded-pill bg-danger-subtle text-danger">Offer</span>
                <i className="bi bi-megaphone text-warning"></i>
              </div>
              <h3 className="h6 fw-bold m-0">{caption}</h3>
              <p className="text-muted small m-0">{details}</p>
              <hr className="my-2 opacity-10" />
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <img src={adminPhoto?.replace("/upload/", "/upload/w_40,f_auto,q_auto/") || `https://ui-avatars.com/api/?name=${adminName}`} width="20" height="20" className="rounded-circle border" alt="" />
                  <span className="fw-bold text-secondary" style={{fontSize:9}}>{adminName || "Drishtee"}</span>
                </div>
                <small className="text-muted" style={{fontSize:9}}>{createdAt?.toDate?.().toLocaleDateString()}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}