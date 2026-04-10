// src\AdminComponents\Students\Fees\FeePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { getFeeLogic, printFullStatement } from "./FeeServices";
import FeeSummaryCard from "./FeeSummaryCard";
import PaymentTable from "./PaymentTable";
import AddPaymentModal from "./AddPaymentModal";

export default function FeePage() {
  const { id } = useParams(); // id = student email
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const emailId = id.toLowerCase().trim();

    // 1. Fetch Student Data
    const fetchStudent = async () => {
      try {
        const sDoc = await getDoc(doc(db, "admissions", emailId));
        if (sDoc.exists()) {
          setStudent({ id: sDoc.id, ...sDoc.data() });
        }
      } catch (err) { console.error("Student Fetch Error:", err); }
    };

    // 2. Real-time Payments Listener
    const q = query(collection(db, "admissions", emailId, "payments"));

    const unsub = onSnapshot(q, (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error("Payment Fetch Error:", err);
      setLoading(false);
    });

    fetchStudent();
    return () => unsub();
  }, [id]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  const summary = getFeeLogic(student?.course, payments);

  return (
    <div className="win11-bg min-vh-100 py-3">
      <div className="container" style={{ maxWidth: '850px' }}>

        <div className="w-100 glass-panel p-2 mb-1 animate__animated animate__fadeInDown">
          {/* Header Section */}
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2 p-2">

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-light rounded-circle shadow-sm"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <h5 className="fw-bold mb-0 text-dark"> Fee Management</h5>
            </div>

            {/* Actions Bar */}
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-dark rounded-pill px-3 shadow-sm d-flex align-items-center"
                onClick={() => printFullStatement(student, payments, summary)}
              >
                <i className="bi bi-printer me-2"></i>Ledger
              </button>

              {/* 🔥 Add Payment Modal - Hamesha ON rahega extra fees ke liye */}
              <AddPaymentModal student={student} summary={summary} />
            </div>

          </div>
        </div>

        {/* Summary Dashboard Card */}
        <FeeSummaryCard student={student} summary={summary} payments={payments} />

        {/* Payment History Table */}
        <div className="card border-0 shadow-sm rounded-4 mt-4 overflow-hidden text-start">
          <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold"><i className="bi bi-clock-history me-2"></i>Transaction History</h6>
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3">{payments.length} Records</span>
          </div>
          <PaymentTable payments={payments} student={student} summary={summary} />
        </div>

      </div>
    </div>
  );
}