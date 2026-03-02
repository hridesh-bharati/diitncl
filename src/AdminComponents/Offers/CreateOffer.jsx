import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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
      <div
        className="rounded-5 p-4 shadow-sm w-100 border border-primary-subtle bg-white"
        style={{ maxWidth: 380 }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 fw-bold small">
            <i className="bi bi-megaphone-fill me-2"></i>CREATE OFFER
          </span>
        </div>

        <form onSubmit={publish}>
          {/* Headline */}
          <input
            type="text"
            placeholder="Headline"
            className="form-control border-0 bg-primary bg-opacity-10 rounded-4 mb-2 shadow-none p-3 fw-bold text-primary"
            value={data.caption}
            onChange={(e) => setData({ ...data, caption: e.target.value })}
          />

          {/* Details */}
          <textarea
            rows={3}
            placeholder="Write offer details..."
            className="form-control border-0 bg-light rounded-4 mb-4 shadow-none p-3 small"
            value={data.details}
            onChange={(e) => setData({ ...data, details: e.target.value })}
          />

          {/* Button */}
          <button
            type="submit"
            className="btn w-100 rounded-pill py-3 fw-bold border-0 shadow-sm"
            style={{ backgroundColor: "#007AFF", color: "#fff" }}
            disabled={loading || !data.caption.trim()}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              "Publish Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}