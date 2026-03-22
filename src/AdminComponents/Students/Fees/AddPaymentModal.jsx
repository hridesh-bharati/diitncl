// src\AdminComponents\Students\Fees\AddPaymentModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
// ✅ getFeeLogic ko yahan import list mein add kar diya hai
import { addPayment, COURSE_CONFIG, getFeeLogic } from "./FeeServices"; 
import { toast } from "react-toastify";
import { sendEmailNotification, feePaymentTemplate, sendPushNotification } from "../../../services/emailService"; 

export default function AddPaymentModal({ student }) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    amount: 700,
    method: "Cash",
    date: new Date().toISOString().split("T")[0],
    note: "Monthly Fee",
  });

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "unset";
  }, [show]);

  const updateForm = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

  const handleTypeChange = (type) => {
    const courseKey = student?.course?.toUpperCase() || "";
    const fee = type === "Admission Fee" ? 500 : COURSE_CONFIG[courseKey]?.monthly || 700;
    setFormData((prev) => ({ ...prev, note: type, amount: fee }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const targetId = student.email || student.id; 
      const paymentData = { ...formData, amount: Number(formData.amount) };
      
      // 1. Save to Database
      await addPayment(targetId, paymentData);
      
      // 2. Notifications Logic
      // Note: Ideal condition mein summary calculate karne ke liye hume pichle payments ki list chahiye hoti hai, 
      // par instant notification ke liye hum current data use kar rahe hain.
      const summary = getFeeLogic(student.course, [paymentData]); 

      // 📧 Send Email
      if (student.email) {
        sendEmailNotification(
          student.email,
          `Fee Payment Received - ₹${paymentData.amount}`,
          feePaymentTemplate(student, paymentData, summary)
        );
      }

      // 📲 Send Push Notification
      sendPushNotification(
        student,
        "Fee Paid Successfully ✅",
        `Received ₹${paymentData.amount} for ${paymentData.note}.`
      );
      
      toast.success("Payment Saved & Notification Sent");
      setShow(false);
    } catch (err) {
      console.error(err);
      toast.error("Process Failed: " + err.message);
    }
  };

  return (
    <>
      <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => setShow(true)}>
        + Fee
      </button>

      {show && createPortal(
        <>
          <div className="modal-backdrop fade show" onClick={() => setShow(false)} style={{ zIndex: 1050 }} />
          <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-sm modal-dialog-centered">
              <form className="modal-content border-0 shadow-lg rounded-4 overflow-hidden" onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0 text-dark">Collect Fee</h6>
                    <button type="button" className="btn-close shadow-none" onClick={() => setShow(false)}></button>
                  </div>

                  <div className="mb-2">
                    <label className="small fw-bold text-muted">Type</label>
                    <select className="form-select" value={formData.note} onChange={(e) => handleTypeChange(e.target.value)}>
                      <option value="Monthly Fee">Monthly Fee</option>
                      <option value="Admission Fee">Admission Fee</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="small fw-bold text-muted">Amount</label>
                    <input type="number" className="form-control fw-bold text-primary" value={formData.amount} onChange={(e) => updateForm("amount", e.target.value)} required />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="small text-muted">Date</label>
                      <input type="date" className="form-control form-control-sm" value={formData.date} onChange={(e) => updateForm("date", e.target.value)} />
                    </div>
                    <div className="col-6">
                      <label className="small text-muted">Method</label>
                      <select className="form-select form-select-sm" value={formData.method} onChange={(e) => updateForm("method", e.target.value)}>
                        <option>Cash</option>
                        <option>Online</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm rounded-3">
                    Save Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}