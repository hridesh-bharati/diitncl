import React, { useState } from "react";
import { addPayment, COURSE_CONFIG } from "./FeeServices";
import { toast } from "react-toastify";

export default function AddPaymentModal({ student }) {
  const [formData, setFormData] = useState({ 
    amount: 700, method: "Cash", 
    date: new Date().toISOString().split('T')[0], note: "Monthly Fee" 
  });

  const handleTypeChange = (type) => {
    const c = student.course?.toUpperCase() || "";
    const fee = type === "Admission Fee" ? 500 : (COURSE_CONFIG[c]?.monthly || 700);
    setFormData({ ...formData, note: type, amount: fee });
  };

  const closeModal = () => {
    document.getElementById('closeModal').click();
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.style.overflow = 'auto';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPayment(student.id, formData);
    toast.success("Saved Successfully");
    closeModal();
  };

  return (
    <>
      <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#pMod">+ Fee</button>
      <div className="modal fade" id="pMod" tabIndex="-1">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <form className="modal-content border-0 shadow-lg rounded-4 text-start" onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="d-flex justify-content-between mb-3 align-items-center">
                <h6 className="fw-bold mb-0">Collect Fee</h6>
                <button type="button" id="closeModal" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <label className="small fw-bold text-muted">Type</label>
              <select className="form-select mb-2" onChange={e => handleTypeChange(e.target.value)}>
                <option>Monthly Fee</option><option>Admission Fee</option>
              </select>
              <label className="small fw-bold text-muted">Amount</label>
              <input type="number" className="form-control mb-3 fw-bold text-primary" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              <div className="row g-2 mb-3">
                <div className="col-6"><input type="date" className="form-control form-control-sm" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                <div className="col-6"><select className="form-select form-select-sm" onChange={e => setFormData({...formData, method: e.target.value})}><option>Cash</option><option>Online</option></select></div>
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold py-2">Save</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}