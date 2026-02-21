import React, { useState } from "react";
import { db } from "../../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function QueryFrom() {
  const initialState = {
    fullName: "",
    mobile: "",
    email: "",
    title: "",
    query: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => setFormData(initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, mobile, email, title, query } = formData;

    if (!fullName || !mobile || !email || !title || !query) {
      return toast.error("All fields are required! ⚠️");
    }

    try {
      setLoading(true);

      // ✅ Save to Firestore
      await addDoc(collection(db, "studentQueries"), {
        ...formData,
        timestamp: serverTimestamp(),
        status: "pending",
      });

      // ✅ Play notification sound
      try {
        const audio = new Audio("/audio/ring.mp3");
        audio.play().catch(() => {});
      } catch (err) {}

      toast.success("Query Sent Successfully! 🚀");
      resetForm();

    } catch (error) {
      toast.error("Error: " + error.message);
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
              <div
                className="col-md-4 p-5 text-white d-none d-md-flex flex-column justify-content-center"
                style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
              >
                <h2 className="fw-bold mb-3">Quick Enquiry</h2>
                <p className="opacity-75 mb-4">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
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
                    {[
                      { name: "fullName", label: "Full Name*", type: "text" },
                      { name: "mobile", label: "Mobile*", type: "tel" },
                      { name: "email", label: "Email*", type: "email" },
                      { name: "title", label: "Subject/Title*", type: "text" }
                    ].map((field) => (
                      <div className="col-md-6" key={field.name}>
                        <div className="form-floating">
                          <input
                            type={field.type}
                            className="form-control form-control-lg border-0 shadow-sm rounded-3"
                            name={field.name}
                            placeholder={field.label}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                          />
                          <label className="text-muted">{field.label}</label>
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
                        />
                        <label className="text-muted">
                          How can we help you?*
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg shadow-sm"
                      onClick={resetForm}
                    >
                      <i className="bi bi-arrow-counterclockwise"></i>
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg d-flex justify-content-center align-items-center flex-grow-1 shadow-sm"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill me-2"></i>
                          Send <span className="d-none d-lg-inline">&nbsp;Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .query-card {
          transition: all 0.3s ease;
          border-radius: 1rem !important;
        }
        .query-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1),
                      0 10px 10px -5px rgba(0,0,0,0.04) !important;
        }
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(59,130,246,0.25) !important;
          border-color: #3b82f6 !important;
        }
        .form-floating > .form-control:focus ~ label,
        .form-floating > .form-control:not(:placeholder-shown) ~ label {
          color: #3b82f6;
          opacity: 0.8;
        }
      `}</style>
    </section>
  );
}