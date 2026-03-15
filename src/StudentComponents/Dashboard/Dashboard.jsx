// src\StudentComponents\Dashboard\Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { printSingleReceipt, getFeeLogic } from "../../AdminComponents/Students/Fees/FeeServices";

const StatCard = ({ icon, label, value, color }) => (
  <div className="col-6">
    <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
      <div className="d-flex align-items-center mb-2">
        <div className={`bg-${color}-subtle p-2 rounded-3 me-2`}><i className={`bi bi-${icon} text-${color}`}></i></div>
        <small className="text-muted fw-bold">{label}</small>
      </div>
      <h4 className="fw-bold mb-0">₹{value}</h4>
    </div>
  </div>
);

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [payments, setPayments] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user?.email) return;
    const studentQ = query(collection(db, "admissions"), where("email", "==", user.email.toLowerCase()));
    
    return onSnapshot(studentQ, (snap) => {
      if (snap.empty) return;
      const studentDoc = { id: snap.docs[0].id, ...snap.docs[0].data() };
      setData(studentDoc);

      const payQ = query(collection(db, "admissions", studentDoc.id, "payments"), orderBy("date", "desc"));
      onSnapshot(payQ, (pSnap) => setPayments(pSnap.docs.map(d => ({ id: d.id, ...d.data() }))));
    });
  }, [user]);

  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);
  const summary = getFeeLogic(data?.course, payments);

  return (
    <div className="pb-5 min-vh-100 bg-light">
      <div className="p-4 mb-4 text-white shadow" style={{ background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", borderRadius: "0 0 25px 25px" }}>
        <div className="container py-2">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center">
              <div className="position-relative">
                <img src={data?.photoUrl || `https://ui-avatars.com/api/?name=${user?.email}`} className="rounded-circle border border-2 border-white shadow-sm" style={{ width: 60, height: 60, objectFit: "cover" }} alt="profile" />
                <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1"></span>
              </div>
              <div className="ms-3">
                <h5 className="mb-0 fw-bold">{data?.name || "Welcome!"}</h5>
                <small className="opacity-75">{data?.regNo || "Searching..."}</small>
              </div>
            </div>
            <i className="bi bi-bell-fill fs-5 opacity-75"></i>
          </div>
          <div className="bg-white bg-opacity-10 rounded-4 p-3 d-flex align-items-center justify-content-between border border-white border-opacity-10">
            <div>
              <small className="d-block text-uppercase fw-bold opacity-75" style={{ fontSize: '0.6rem' }}>Next Installment</small>
              <h5 className="mb-0 text-warning fw-bold">---</h5>
            </div>
            <button className="btn btn-sm btn-warning fw-bold rounded-pill px-4 shadow-sm">Pay Now</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row g-3 mb-4">
          <StatCard icon="cash-stack" label="Total Paid" value={totalPaid} color="success" />
          <StatCard icon="wallet2" label="Monthly" value={data?.monthlyFee || 0} color="primary" />
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Recent Receipts</h6>
          <button className="btn btn-link btn-sm text-decoration-none fw-bold p-0">View All</button>
        </div>
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="list-group list-group-flush">
            {payments.map((p) => (
              <div key={p.id} className="list-group-item p-3 d-flex align-items-center justify-content-between border-light">
                <div className="d-flex align-items-center">
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }}><i className="bi bi-receipt text-muted"></i></div>
                  <div>
                    <p className="mb-0 fw-bold small text-dark">{p.note || "Fee Payment"}</p>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>{p.date}</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold text-success">₹{p.amount}</span>
                  <button onClick={() => printSingleReceipt(data, p, summary)} className="btn btn-outline-primary btn-sm rounded-circle p-0" style={{ width: 32, height: 32 }}><i className="bi bi-printer small"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}