// src\StudentComponents\Dashboard\Dashboard.jsx

import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, query, onSnapshot, orderBy, doc } from "firebase/firestore"; 
import { printSingleReceipt, getFeeLogic } from "../../AdminComponents/Students/Fees/FeeServices";

import { toast } from "react-toastify";

// Updated StatCard for better fit (3 cards in a row possible or stacked)
const StatCard = ({ icon, label, value, color, colSize = "col-4" }) => (
  <div className={colSize}>
    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 text-center">
      <div className={`bg-${color}-subtle rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center`} style={{width: '35px', height: '35px'}}>
        <i className={`bi bi-${icon} text-${color}`}></i>
      </div>
      <small className="text-muted fw-bold d-block mb-1" style={{fontSize: '10px', textTransform: 'uppercase'}}>{label}</small>
      <h6 className="fw-bold mb-0 text-dark">₹{value || 0}</h6>
    </div>
  </div>
);

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubStudent = () => {};
    let unsubPay = () => {};

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      const email = user?.email || localStorage.getItem("user_email");
      
      if (!email) {
        if (!user && loading) { /* waiting */ } 
        else { setLoading(false); }
        return;
      }

      const emailId = email.toLowerCase().trim();
      const studentDocRef = doc(db, "admissions", emailId);

      unsubStudent = onSnapshot(studentDocRef, (snap) => {
        if (snap.exists()) {
          setData({ id: snap.id, ...snap.data() });
        }
        setLoading(false);
      }, (err) => {
        console.error("Student Data Error:", err);
        setLoading(false);
      });

      const payQ = query(
        collection(db, "admissions", emailId, "payments"), 
        orderBy("date", "desc")
      );

      unsubPay = onSnapshot(payQ, (pSnap) => {
        const payList = pSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPayments(payList);
      }, (err) => {
        console.error("Payments Listen Error:", err);
      });
    });

    return () => {
      unsubscribeAuth();
      unsubStudent();
      unsubPay();
    };
  }, []);

  const totalPaid = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const summary = getFeeLogic(data?.course, payments) || { balance: 0, netFee: 0 };

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="spinner-border text-primary mb-2"></div>
      <small className="text-muted fw-bold">Loading Data...</small>
    </div>
  );

  return (
    <div className="pb-5 min-vh-100  bg-light animate__animated animate__fadeIn">
      {/* Blue Header Section */}
      <div className="p-4 mb-4 text-white shadow" style={{ background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", borderRadius: "0 0 25px 25px" }}>
        <div className="container py-2">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center">
              <div className="position-relative">
                <img 
                  src={data?.photoUrl || `https://ui-avatars.com/api/?name=${data?.name || 'User'}&background=fff&color=1e3c72&bold=true`} 
                  className="rounded-circle border border-2 border-white shadow-sm" 
                  style={{ width: 60, height: 60, objectFit: "cover" }} 
                  alt="profile" 
                />
                <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1"></span>
              </div>
              <div className="ms-3 text-start">
                <h5 className="mb-0 fw-bold">{data?.name || "Student"}</h5>
                <small className="opacity-75">{data?.regNo || "Learning Portal"}</small>
              </div>
            </div>
            <i className="bi bi-bell-fill fs-5 opacity-75"></i>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-4 p-3 d-flex align-items-center justify-content-between border border-white border-opacity-10">
            <div className="text-start">
              <small className="d-block text-uppercase fw-bold opacity-75" style={{ fontSize: '0.6rem' }}>Next Installment</small>
              <h5 className="mb-0 text-warning fw-bold">₹{summary?.balance > 0 ? (data?.monthlyFee || 700) : "0"}</h5>
            </div>
            <button className="btn btn-sm btn-warning fw-bold rounded-pill px-4 shadow-sm" onClick={() => toast.info("Online payment coming soon!")}>Pay Now</button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* 🔥 Stats Section - Updated with Total Fee Field */}
        <div className="row g-2 mb-4">
          <StatCard icon="briefcase" label="Total Fee" value={summary?.netFee} color="primary" />
          <StatCard icon="cash-stack" label="Paid" value={totalPaid} color="success" />
          <StatCard icon="exclamation-circle" label="Dues" value={summary?.balance} color="danger" />
        </div>

        {/* Recent Receipts Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0 text-dark ps-1">Recent Transactions</h6>
          <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3">{payments.length} Records</span>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5 mb-lg-0">
          <div className="list-group list-group-flush">
            {payments.length > 0 ? (
              payments.map((p) => (
                <div key={p.id} className="list-group-item p-3 d-flex align-items-center justify-content-between border-light border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 42, height: 42 }}>
                      <i className="bi bi-receipt-cutoff text-primary fs-5"></i>
                    </div>
                    <div className="text-start">
                      <p className="mb-0 fw-bold small text-dark">{p.note || "Tution Fee"}</p>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {p.date} • <span className="text-uppercase">{p.method || 'Cash'}</span>
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-success small">₹{p.amount}</span>
                    <button 
                      onClick={() => printSingleReceipt(data, p, summary)} 
                      className="btn btn-light btn-sm rounded-circle border shadow-sm" 
                      style={{ width: 32, height: 32 }}
                    >
                      <i className="bi bi-printer" style={{fontSize: '12px'}}></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-center text-muted">
                <i className="bi bi-inbox-fill d-block fs-1 mb-2 opacity-25"></i>
                <p className="small mb-0">No payment history found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}