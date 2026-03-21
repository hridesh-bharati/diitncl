import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";

export default function HomeOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "offers"), orderBy("createdAt", "desc"), limit(5));

    return onSnapshot(q, (snapshot) => {
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center my-4">Loading...</div>;
  if (!offers.length) return null;

  return (
    <section className="container my-4">
      <div className="d-flex align-items-center mb-3">
        <div className="bg-danger p-1 rounded-circle me-2 pulse-red"></div>
        {/* FIX: Heading Order (h4 -> h2) */}
        <h2 className="fw-bold h4 m-0 text-dark">Special Offers</h2>
      </div>

      <div className="row g-3">
        {offers.map(({ id, caption, details, adminPhoto, adminName, createdAt }) => (
          <div className="col-md-12" key={id}>
            <div className="offer-card-custom h-100 p-3 shadow-sm border rounded-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge rounded-pill bg-danger-subtle text-danger px-3">Limited Time</span>
                <i className="bi bi-megaphone text-warning fs-5"></i>
              </div>

              {/* FIX: Heading Order (h5 -> h3) */}
              <h3 className="fw-bold text-dark h5 mb-2">{caption}</h3>
              <p className="text-muted small mb-3 line-clamp-2">{details}</p>
              <hr className="opacity-10" />

              <div className="d-flex align-items-center justify-content-between">

                <div className="d-flex align-items-center">
                  {adminPhoto && (
                    <img
                      src={adminPhoto.replace("/upload/", "/upload/w_60,h_60,c_thumb,g_face,f_auto,q_auto/")}
                      alt=""
                      width="30"
                      height="30"
                      className="rounded-circle me-2 border"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <span className="fw-bold x-small-text text-secondary">{adminName || "Drishtee"}</span>
                </div>

                <small className="text-muted" style={{ fontSize: '10px' }}>
                  {createdAt?.toDate?.().toLocaleDateString() || ""}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}