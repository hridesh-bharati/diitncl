// src\Components\HomePage\pages\QueryFrom.jsx
import React, { useState } from "react";
import { db } from "../../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function QueryForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    title: "",
    query: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, mobile, email, title, query } = formData;

    if (!fullName || !mobile || !email || !title || !query) {
      return toast.error("All fields are required! ⚠️");
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "studentQueries"), {
        ...formData,
        timestamp: serverTimestamp(),
        status: "pending",
      });
      /* 🔔 SEND PUSH TO ADMIN */
      await fetch("/api/sendPush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      toast.success("Query Sent Successfully! 🚀");
      new Audio("/audio/ring.mp3").play().catch(() => { });
      setFormData({ fullName: "", mobile: "", email: "", title: "", query: "" });
    } catch (error) {
      toast.error("Firebase Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="query-section py-5" style={{ background: "#f3f4f6" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="query-card shadow-lg border-0 overflow-hidden rounded-4 d-flex flex-column flex-md-row">

              {/* Left Panel */}
              <div className="col-md-4 p-5 text-white d-none d-md-flex flex-column justify-content-center" style={{
                background: "linear-gradient(135deg, #6366f1, #3b82f6)"
              }}>
                <h2 className="fw-bold mb-3">Quick Enquiry</h2>
                <p className="opacity-75 mb-4">Fill out the form and our team will get back to you within 24 hours.</p>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-headset fs-3 me-2"></i> Expert Support
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-shield-check fs-3 me-2"></i> Secure Handling
                  </div>
                </div>
              </div>

              {/* Form Panel */}
              <div className="col-md-8 p-4 p-lg-5 bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {["fullName", "mobile", "email", "title"].map((field, idx) => (
                      <div className="col-md-6" key={idx}>
                        <div className="form-floating">
                          <input
                            type={field === "email" ? "email" : field === "mobile" ? "tel" : "text"}
                            className="form-control form-control-lg border-0 shadow-sm rounded-3"
                            name={field}
                            placeholder={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                          />
                          <label className="text-muted">{field === "fullName" ? "Full Name*" : field === "mobile" ? "Mobile*" : field === "email" ? "Email*" : "Subject/Title*"}</label>
                        </div>
                      </div>
                    ))}

                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control form-control-lg border-0 shadow-sm rounded-3"
                          name="query"
                          placeholder="Your message"
                          style={{ height: "120px" }}
                          value={formData.query}
                          onChange={handleChange}
                          required
                        ></textarea>
                        <label className="text-muted">How can we help you?*</label>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mt-4">

                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg shadow-sm"
                      onClick={() =>
                        setFormData({ fullName: "", mobile: "", email: "", title: "", query: "" })
                      }
                    >
                      <i className="bi bi-arrow-counterclockwise"></i>
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg d-flex justify-content-center align-items-center  flex-grow-1 shadow-sm"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : (
                        <i className="bi bi-send-fill me-2"></i>
                      )}
                      Send <span className="d-none d-lg-flex">&nbsp;Message</span>
                    </button>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Styles */}
      <style>{`
        .query-card { transition: all 0.3s ease; }
        .query-card:hover { transform: translateY(-4px); }
        .form-control:focus { box-shadow: 0 0 0 0.25rem rgba(59,130,246,0.25); }
      `}</style>
    </section>
  );
}
