import React, { useState } from "react";
import { db } from "../../../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";

const QuickSupport = () => {
  const init = { fullName: "", mobile: "", email: "", title: "", query: "" };
  const [formData, setFormData] = useState(init);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 1. Firebase mein data save karein
      await addDoc(collection(db, "studentQueries"), {
        ...formData,
        timestamp: serverTimestamp(),
        status: "pending"
      });

      // 2. EmailJS Notification (Silent & Professional)
      const serviceId = "service_a1jmn6q";
      const templateId = "template_rym4nhl";
      const publicKey = "8VANIXFp8ZzrP5SsZ";

      const templateParams = {
        from_name: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        subject: formData.title,
        message: formData.query,
        time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      // 3. Success Feedback
      new Audio("/audio/ring.mp3").play().catch(() => { });
      toast.success("Query Sent! We will contact you soon.");
      setFormData(init);

    } catch (err) {
      console.error(err);
      toast.error("Message saved, but notification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-4 p-4">
      <h1 className="text-dark text-center fw-bolder">Quick Support</h1>
      <hr className="text-primary" />
      {[
        { n: "fullName", l: "Full Name", t: "text", i: "person" },
        { n: "mobile", l: "Mobile Number", t: "tel", i: "phone" },
        { n: "email", l: "Email Address", t: "email", i: "envelope" },
        { n: "title", l: "Subject/Course", t: "text", i: "journal-text" }
      ].map(f => (
        <div className="col-md-6" key={f.n}>
          <div className="form-floating android-input">
            <input type={f.t} name={f.n} className="form-control border-0 border-bottom rounded-0 px-0 shadow-none bg-transparent"
              placeholder={f.l} value={formData[f.n]} onChange={handleChange} required />
            <label className="px-0 text-muted small"><i className={`bi bi-${f.i} me-2`}></i>{f.l}</label>
          </div>
        </div>
      ))}
      <div className="col-12 mt-4">
        <div className="form-floating android-input">
          <textarea name="query" className="form-control border-0 border-bottom rounded-0 px-0 shadow-none bg-transparent"
            placeholder="Message" style={{ height: 70 }}
            value={formData.query} onChange={handleChange} required />
          <label className="px-0 text-muted small"><i className="bi bi-chat-dots me-2"></i>How can we help?</label>
        </div>
      </div>

      <div className="col-12 d-flex gap-2 mt-5">
        <button type="button" className="btn btn-light rounded-circle p-3 shadow-sm border"
          onClick={() => setFormData(init)} title="Reset">
          <i className="bi bi-arrow-counterclockwise text-muted"></i>
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary flex-grow-1 py-3 rounded-pill fw-bold border-0 shadow">
          {loading ? "SENDING..." : "SEND MESSAGE"}
        </button>
      </div>

      <style>{`
        .android-input input, .android-input textarea { border-bottom: 2px solid #eee !important; transition: 0.3s; }
        .android-input input:focus, .android-input textarea:focus { border-bottom-color: #0061ff !important; }
        .form-floating > label { transition: 0.2s ease-in-out; }
        .btn:active { transform: scale(0.96); }
      `}</style>
    </form>
  );
};

export default QuickSupport;