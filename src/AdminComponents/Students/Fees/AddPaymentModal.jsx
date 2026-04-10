// src\AdminComponents\Students\Fees\AddPaymentModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { addPayment, COURSE_CONFIG, getFeeLogic } from "./FeeServices"; 
import { toast } from "react-toastify";
import { sendEmailNotification, feePaymentTemplate, sendPushNotification } from "../../../services/emailService"; 

export default function AddPaymentModal({ student, summary }) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    amount: 700,
    method: "Cash",
    date: new Date().toISOString().split("T")[0],
    note: "Monthly Fee",
    otherType: "", // Manual fee description (Re-exam, Project etc.)
  });

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "unset";
    // Modal khulne par default smart amount set karein
    if(show && summary) {
        const courseKey = student?.course?.toUpperCase() || "";
        const monthly = COURSE_CONFIG[courseKey]?.monthly || 700;
        // Agar bacha hua balance monthly se kam hai, toh balance default set karein
        setFormData(prev => ({...prev, amount: Math.min(monthly, summary.balance) || 0, note: "Monthly Fee"}));
    }
  }, [show, summary, student]);

  const updateForm = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

  const handleTypeChange = (type) => {
    const courseKey = student?.course?.toUpperCase() || "";
    let fee = 0;
    
    if (type === "Admission Fee") fee = COURSE_CONFIG[courseKey]?.adm || 500;
    else if (type === "Monthly Fee") fee = COURSE_CONFIG[courseKey]?.monthly || 700;
    else fee = 100; // Default for Other fees

    // Course dues restriction: Only apply for Monthly/Admission
    if (type !== "Other Fee" && fee > (summary?.balance || 0)) {
      fee = Math.max(0, summary?.balance || 0);
    }
    
    setFormData((prev) => ({ ...prev, note: type, amount: fee }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Note decision: Manual entry priority for Other Fee
    const finalNote = formData.note === "Other Fee" ? (formData.otherType || "Other Fee") : formData.note;

    // VALIDATION: Monthly/Admission cannot exceed total dues
    if (formData.note !== "Other Fee" && Number(formData.amount) > (summary?.balance || 0)) {
      toast.error(`Invalid: Amount exceeds course balance (Max: ₹${summary.balance})`);
      return;
    }

    if (Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const targetId = student.email || student.id; 
      const paymentData = { ...formData, note: finalNote, amount: Number(formData.amount) };
      
      await addPayment(targetId, paymentData);
      
      // Instant Notification calculation
      const tempSummary = getFeeLogic(student.course, [paymentData]); 

      if (student.email) {
        sendEmailNotification(
          student.email,
          `Fee Payment Received - ₹${paymentData.amount}`,
          feePaymentTemplate(student, paymentData, tempSummary)
        );
      }

      sendPushNotification(
        student,
        "Fee Paid Successfully ✅",
        `Received ₹${paymentData.amount} for ${paymentData.note}.`
      );
      
      toast.success("Payment Saved & Notifications Sent");
      setShow(false);
      setFormData(prev => ({...prev, otherType: ""})); // Reset manual text
    } catch (err) {
      console.error(err);
      toast.error("Process Failed: " + err.message);
    }
  };

  return (
    <>
      <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => setShow(true)}>
        + Collect Fee
      </button>

      {show && createPortal(
        <>
          <div className="modal-backdrop fade show" onClick={() => setShow(false)} style={{ zIndex: 1050 }} />
          <div className="modal d-block animate__animated animate__zoomIn animate__faster" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-sm modal-dialog-centered">
              <form className="modal-content border-0 shadow-lg rounded-4 overflow-hidden" onSubmit={handleSubmit}>
                <div className="modal-body p-4 text-start">
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0 text-dark">New Transaction</h6>
                    <button type="button" className="btn-close shadow-none" onClick={() => setShow(false)}></button>
                  </div>

                  {/* Fee Category */}
                  <div className="mb-2">
                    <label className="small fw-bold text-muted">Fee Category</label>
                    <select className="form-select shadow-none" value={formData.note} onChange={(e) => handleTypeChange(e.target.value)}>
                      <option value="Monthly Fee">Monthly Fee</option>
                      <option value="Admission Fee">Admission Fee</option>
                      <option value="Other Fee">Other (Exams/Project/Fine)</option>
                    </select>
                  </div>

                  {/* 🔥 Manual Entry for Other Fees */}
                  {formData.note === "Other Fee" && (
                    <div className="mb-2 animate__animated animate__fadeIn">
                      <label className="small fw-bold text-muted">Description</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Re-exam, File Fee, Late Fine" 
                        className="form-control form-control-sm border-primary"
                        value={formData.otherType}
                        onChange={(e) => updateForm("otherType", e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="small fw-bold text-muted">Amount</label>
                    <input 
                       type="number" 
                       className={`form-control fw-bold ${formData.note !== "Other Fee" && Number(formData.amount) > summary.balance ? 'is-invalid text-danger' : 'text-primary'}`} 
                       value={formData.amount} 
                       onChange={(e) => updateForm("amount", e.target.value)} 
                       required 
                    />
                    {formData.note !== "Other Fee" && (
                        <div className="d-flex justify-content-between mt-1" style={{fontSize:'10px'}}>
                            <span className="text-muted">Balance: ₹{summary?.balance}</span>
                            {Number(formData.amount) > summary.balance && <span className="text-danger fw-bold">Exceeds Dues!</span>}
                        </div>
                    )}
                  </div>

                  <div className="row g-2 mb-4">
                    <div className="col-6">
                      <label className="small text-muted">Date</label>
                      <input type="date" className="form-control form-control-sm shadow-none" value={formData.date} onChange={(e) => updateForm("date", e.target.value)} />
                    </div>
                    <div className="col-6">
                      <label className="small text-muted">Method</label>
                      <select className="form-select form-select-sm shadow-none" value={formData.method} onChange={(e) => updateForm("method", e.target.value)}>
                        <option>Cash</option>
                        <option>Online</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 fw-bold py-2 shadow-sm rounded-3"
                    disabled={formData.note !== "Other Fee" && Number(formData.amount) > summary.balance}
                  >
                    Confirm Payment
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