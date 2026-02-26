import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

export default function CreateOffer() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ caption: "", details: "" });

  const publish = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "offers"), { 
        ...data, 
        adminName: user?.displayName || "Admin", 
        createdAt: serverTimestamp() 
      });
      toast.success("Offer Live! 🚀");
      setData({ caption: "", details: "" });
    } catch (err) {
      toast.error("Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 d-flex justify-content-center">
      <div className="rounded-5 p-4 shadow-sm w-100 border border-primary-subtle bg-white" style={{ maxWidth: 380 }}>
        {/* Blue Header Badge */}
        <div className="text-center mb-4">
          <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 fw-bold small">
            <i className="bi bi-megaphone-fill me-2"></i>CREATE OFFER
          </span>
        </div>

        <Form onSubmit={publish}>
          <Form.Control
            placeholder="Headline"
            className="border-0 bg-primary bg-opacity-10 rounded-4 mb-2 shadow-none p-3 fw-bold text-primary placeholder-primary"
            value={data.caption}
            onChange={(e) => setData({ ...data, caption: e.target.value })}
          />

          <Form.Control
            as="textarea" rows={3}
            placeholder="Write offer details..."
            className="border-0 bg-light rounded-4 mb-4 shadow-none p-3 small"
            value={data.details}
            onChange={(e) => setData({ ...data, details: e.target.value })}
          />

          <Button type="submit" className="w-100 rounded-pill py-3 fw-bold border-0 shadow-sm transition-all"
            style={{ backgroundColor: "#007AFF" }} // iOS Blue
            disabled={loading || !data.caption.trim()}>
            {loading ? <Spinner size="sm" /> : "Publish Now"}
          </Button>
        </Form>
      </div>
    </div>
  );
}