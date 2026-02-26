import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Accordion, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function DeleteOffer() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "offers"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setOffers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "offers", id));
      toast.success("Deleted");
    } catch {
      toast.error("Error");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner variant="primary" /></div>;

  return (
    <div className="p-3 mx-auto" style={{ maxWidth: 500 }}>
      <div className="d-flex justify-content-between mb-4 px-2 align-items-center">
        <h6 className="fw-bold m-0 text-primary">MANAGE OFFERS</h6>
        <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary">{offers.length}</span>
      </div>

      <Accordion flush className="rounded-4 overflow-hidden border shadow-sm">
        {offers.map((o, idx) => (
          <Accordion.Item eventKey={idx.toString()} key={o.id} className="border-bottom">
            <Accordion.Header>
              <div className="d-flex align-items-center gap-3 w-100">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 35, height: 35, fontSize: '0.8rem' }}>
                  {idx + 1}
                </div>
                <span className="fw-bold text-dark text-truncate" style={{ maxWidth: '200px' }}>{o.caption}</span>
              </div>
            </Accordion.Header>
            <Accordion.Body className="bg-light bg-opacity-50">
              <p className="small text-muted mb-3" style={{ whiteSpace: 'pre-wrap' }}>{o.details}</p>
              
              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <div className="d-flex align-items-center gap-2">
                  <img src={o.adminPhoto || "https://via.placeholder.com/30"} className="rounded-circle border" width="25" height="25" alt="admin" />
                  <small className="fw-bold text-secondary" style={{ fontSize: '0.75rem' }}>{o.adminName}</small>
                </div>
                
                <Button 
                  variant="danger" 
                  size="sm" 
                  className="rounded-pill px-3"
                  onClick={() => del(o.id)}
                  disabled={deleting === o.id}
                >
                  {deleting === o.id ? <Spinner size="sm" /> : "Delete"}
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {offers.length === 0 && <p className="text-center text-muted mt-5">No offers live.</p>}
    </div>
  );
}