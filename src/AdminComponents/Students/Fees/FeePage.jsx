import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { getFeeLogic, printFullStatement } from "./FeeServices";
import FeeSummaryCard from "./FeeSummaryCard";
import PaymentTable from "./PaymentTable";
import AddPaymentModal from "./AddPaymentModal";

export default function FeePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // 1. Student Data Fetch Karo
    const fetchStudent = async () => {
      try {
        const sDoc = await getDoc(doc(db, "admissions", id));
        if (sDoc.exists()) {
          setStudent({ id: sDoc.id, ...sDoc.data() });
        }
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    // 2. Real-time Payments Fetch Karo
    const q = query(
      collection(db, "admissions", id, "payments"),
      orderBy("date", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setPayments(list);
      setLoading(false);
    });

    fetchStudent();
    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Fee Logic Calculate Karo
  const summary = getFeeLogic(student?.course, payments);

  return (
    <div className="win11-bg min-vh-100 py-3 text-start">
      <div className="container" style={{ maxWidth: '850px' }}>

        {/* Header Section */}
        <div className="glass-panel p-3 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between shadow-sm border-0 gap-3">

          {/* Left Side: Back Button & Title */}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-light rounded-circle shadow-sm me-3 border-0 d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px', minWidth: '40px' }}
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left fs-5"></i>
            </button>

            <h5 className="fw-bold mb-0 text-dark">Fee Management</h5>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="d-flex gap-2 align-items-center justify-content-end m-auto">
            {/* Print Button (Desktop) */}
            <button
              className="btn btn-dark rounded-pill px-3 py-2 fw-bold shadow-sm d-none d-md-flex align-items-center"
              style={{ fontSize: '13px' }}
              onClick={() => printFullStatement(student, payments, summary)}
            >
              <i className="bi bi-printer me-2"></i> Print Statement
            </button>

            {/* Print Button (Mobile - Full Width style or Icon) */}
            <button
              className="btn btn-dark rounded-pill px-4 py-2 fw-bold d-md-none shadow-sm flex-grow-1"
              style={{ fontSize: '12px' }}
              onClick={() => printFullStatement(student, payments, summary)}
            >
              <i className="bi bi-printer me-2"></i> Print
            </button>

            {/* Add Payment Modal Component */}
            <div className="flex-grow-1 flex-md-grow-0">
              <AddPaymentModal student={student} />
            </div>
          </div>
        </div>

        {/* Top Summary Card */}
        <FeeSummaryCard
          student={student}
          summary={summary}
          payments={payments}
        />

        {/* Payments History Table */}
        <div className="card border-0 shadow-sm rounded-4 mt-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom">
            <h6 className="mb-0 fw-bold"><i className="bi bi-clock-history me-2"></i>Payment History</h6>
          </div>
          <PaymentTable
            payments={payments}
            student={student}
            summary={summary}
          />
        </div>

      </div>
    </div>
  );
}