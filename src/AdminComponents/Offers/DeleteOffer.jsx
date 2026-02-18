// src/AdminComponents/Offers/DeleteOffer.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Card, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

export default function DeleteOffer() {
  const { user } = useAuth(); // logged-in admin
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

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
        toast.error("Failed to fetch offers");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;

    try {
      setDeleting(id);
      await deleteDoc(doc(db, "offers", id));
      toast.success("Offer deleted successfully");
    } catch (err) {
      console.error("Error deleting offer:", err);
      toast.error("Failed to delete offer");
    } finally {
      setDeleting(null);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" />
      </div>
    );

  if (offers.length === 0)
    return <p className="text-center my-4">No offers available</p>;

  return (
    <div className="container my-4">
      <h3 className="mb-4">🛠 Admin Offers Management</h3>

      {offers.map((offer) => (
        <Card key={offer.id} className="mb-3 shadow-sm border-0">
          <Card.Body className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="fw-bold text-primary">{offer.caption}</h5>
              <p className="text-muted">{offer.details}</p>

              <div className="d-flex align-items-center mt-2">
                {offer.adminPhoto && (
                  <img
                    src={offer.adminPhoto}
                    alt={offer.adminName || "Admin"}
                    width="35"
                    height="35"
                    className="rounded-circle me-2"
                    style={{ objectFit: "cover" }}
                  />
                )}
                <div>
                  <small className="fw-bold">
                    {offer.adminName || "Admin"}
                  </small>
                  <br />
                  <small className="text-muted">
                    {offer.createdAt?.toDate
                      ? offer.createdAt.toDate().toLocaleString()
                      : ""}
                  </small>
                </div>
              </div>
            </div>

            {/* Delete Button */}
            <Button
              variant="danger"
              size="sm"
              disabled={deleting === offer.id}
              onClick={() => handleDelete(offer.id)}
            >
              {deleting === offer.id ? "Deleting..." : "Delete"}
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
