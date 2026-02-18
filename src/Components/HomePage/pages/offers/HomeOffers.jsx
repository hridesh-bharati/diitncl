// src/Components/HomePage/pages/offers/HomeOffers.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Card, Spinner } from "react-bootstrap";

export default function HomeOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "offers"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOffers(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching offers:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="container my-2">
      <div className="bg-primary-subtle border-start border-primary border-5">
        <marquee behavior="alternate" direction="left" scrollamount="5">
          <h3 className="pt-2 m-0 text-primary">Latest Offers</h3>
        </marquee>
      </div>
      {offers.length === 0 && <p>No offers available.</p>}

      {offers.map((offer) => (
        <Card key={offer.id} className="mb-3 shadow-sm border-0">
          <Card.Body>
            <h5 className="fw-bold text-danger">{offer.caption}</h5>
            <p className="text-muted">{offer.details}</p>

            <div className="d-flex align-items-center mt-3">
              {offer.adminPhoto && (
                <img
                  src={offer.adminPhoto}
                  alt={offer.adminName || "Admin"}
                  width="40"
                  height="40"
                  className="rounded-circle me-2"
                  style={{ objectFit: "cover" }}
                />
              )}
              <div>
                <small className="fw-bold">{offer.adminName || "Admin"}</small>
                <br />
                <small className="text-muted">
                  {offer.createdAt?.toDate
                    ? offer.createdAt.toDate().toLocaleString()
                    : ""}
                </small>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
