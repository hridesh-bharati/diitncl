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

  if (loading || !offers.length) return loading ? <p className="text-center small my-3 text-primary">...</p> : null;

  return (
    <section className="container-fluid  my-3">
      <h2 className="h6 fw-bold mb-3 text-dark"><i className="bi bi-megaphone-fill text-primary me-2"></i>OFFERS</h2>
      <div className="row g-2">
        {offers.map(({ id, caption, details, adminPhoto, adminName, createdAt }) => (
          <div className="col-12" key={id}>
            <div className="p-3 bg-white border-0 border-start border-4 border-primary rounded-4 shadow-sm">
              <div className="d-flex justify-content-between mb-1">
                <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10" style={{ fontSize: 9 }}>OFFER</span>
                <i className="bi bi-stars text-primary opacity-50"></i>
              </div>
              <h3 className="h6 fw-bold m-0">{caption}</h3>
              <p className="text-muted mb-2 mt-1" style={{ fontSize: 11, lineHeight: 1.3 }}>{details}</p>
              <div className="d-flex align-items-center justify-content-between pt-2 border-top border-light">
                <div className="d-flex align-items-center gap-2">
                  <img src={adminPhoto?.replace("/upload/", "/upload/w_40,f_auto,q_auto/") || `https://ui-avatars.com/api/?name=${adminName}`} width="20" height="20" className="rounded-circle border" alt="" />
                  <span className="fw-bold text-dark" style={{ fontSize: 9 }}>{adminName || "Drishtee"}</span>
                </div>
                <small className="text-muted" style={{ fontSize: 9 }}>{createdAt?.toDate?.().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}