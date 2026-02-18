// src/AdminComponents/Offers/CreateOffer.jsx
import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext"; 

export default function CreateOffer() {
  const { user, displayName, photoURL } = useAuth(); // 🔑 Logged-in admin info
  const [caption, setCaption] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption || !details) return toast.error("All fields required");
    if (!user) return toast.error("Admin not logged in");

    try {
      setLoading(true);
      await addDoc(collection(db, "offers"), {
        caption,
        details,
        adminName: displayName || "Admin",
        adminPhoto: photoURL || "", 
        createdAt: serverTimestamp(),
      });

      toast.success("Offer Published!");
      setCaption("");
      setDetails("");
    } catch (err) {
      console.error("Offer creation error:", err);
      toast.error("Error creating offer: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 my-2 shadow border-white border-2 bg-light" style={{ maxWidth: 500, margin: "auto" }}>
      <h4 className="mb-3">Create New Offer</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Offer Caption</Form.Label>
          <Form.Control
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter offer title"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Offer Details</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Enter offer details"
          />
        </Form.Group>

        <Button
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : "Publish Offer"}
        </Button>
      </Form>
    </Card>
  );
}
