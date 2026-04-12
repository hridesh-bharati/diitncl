import React, { useState } from "react";
import { db } from "../../../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { 
  sendEmailNotification, 
  supportTemplate, 
  sendPushNotification 
} from "../../../../services/emailService";

const QuickSupport = () => {
  const init = { fullName: "", mobile: "", email: "", title: "", query: "" };
  const [formData, setFormData] = useState(init);
  const [loading, setLoading] = useState(false);

  // Note: Real scenario mein ADMIN_FCM_TOKEN Firestore se fetch karein
  const ADMIN_FCM_TOKEN = "YOUR_ADMIN_FCM_TOKEN_HERE"; 

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 1. Firebase mein query save karein
      await addDoc(collection(db, "studentQueries"), {
        ...formData,
        timestamp: serverTimestamp(),
        status: "pending"
      });

      // 2. Email notification bhejien
      const emailPromise = sendEmailNotification(
        "hridesh027@gmail.com",
        `New Inquiry: ${formData.title}`,
        supportTemplate(formData)
      );

      // 3. Push Notification call (Admin ko alert dene ke liye)
      const pushPromise = sendPushNotification(
        { fcmToken: ADMIN_FCM_TOKEN },
        "New Support Query 📢",
        `${formData.fullName} has a query about ${formData.title}`,
        "/admin/support"
      );

      // Dono calls ka wait karein
      const [emailSuccess, pushSuccess] = await Promise.all([emailPromise, pushPromise]);

      if (emailSuccess || pushSuccess) {
        new Audio("/audio/ring.mp3").play().catch(() => { });
        toast.success("Query Sent Successfully! We'll contact you soon.");
        setFormData(init);
      } else {
        toast.warning("Query saved, but notification failed.");
      }

    } catch (err) {
      toast.error("System Error: " + err.message);
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
          {loading ? (
            <div className="spinner-border spinner-border-sm text-white" role="status"></div>
          ) : "SEND MESSAGE"}
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