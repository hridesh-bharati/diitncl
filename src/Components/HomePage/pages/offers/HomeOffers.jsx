import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";

export default function HomeOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // limit(3) add kiya hai taaki sirf latest 3 offers load hon (Performance boost)
    const q = query(collection(db, "offers"), orderBy("createdAt", "desc"), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOffers(data);
      setLoading(false);
    }, (err) => {
      console.error("Error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="text-center my-4"><p>Loading...</p></div>
  );

  if (offers.length === 0) return null; // Agar offer nahi hai to space kyun gherna

  return (
    <section className="container my-4">
      {/* Modern Header */}
      <div className="d-flex align-items-center mb-3">
        <div className="bg-danger p-1 rounded-circle me-2 pulse-red"></div>
        <h4 className="fw-bold m-0 text-dark">Special Offers</h4>
      </div>

      <div className="row g-3">
        {offers.map((offer) => (
          <div className="col-md-12" key={offer.id}>
            <div className="offer-card-custom h-100 p-3 shadow-sm border rounded-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge rounded-pill bg-danger-subtle text-danger px-3">Limited Time</span>
                <i className="bi bi-megaphone text-warning fs-5"></i>
              </div>

              <h5 className="fw-bold text-dark mb-2">{offer.caption}</h5>
              <p className="text-muted small mb-3 line-clamp-2">{offer.details}</p>

              <hr className="opacity-10" />

              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    src={offer.adminPhoto || "/default-avatar.png"}
                    alt="admin"
                    width="30" height="30"
                    className="rounded-circle me-2 border"
                  />
                  <span className="fw-bold x-small-text text-secondary">
                    {offer.adminName || "Drishtee"}
                  </span>
                </div>
                <small className="text-muted" style={{ fontSize: '10px' }}>
                  {offer.createdAt?.toDate ? offer.createdAt.toDate().toLocaleDateString() : ""}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}