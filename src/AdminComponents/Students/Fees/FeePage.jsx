
// src\AdminComponents\Students\Fees\FeePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
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

    // 1. Fetch Student Doc
    const fetchStudent = async () => {
      try {
        const sDoc = await getDoc(doc(db, "admissions", emailId));
        if (sDoc.exists()) {
          setStudent({ id: sDoc.id, ...sDoc.data() });
        }
      } catch (err) { console.error(err); }
    };

    // 2. Real-time Payments
    // const q = query(
    //   collection(db, "admissions", emailId, "payments"),
    //   orderBy("date", "desc")
    // );
    const q = query(collection(db, "admissions", emailId, "payments"));

    const unsub = onSnapshot(q, (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error("Payment fetch error:", err);
      setLoading(false);
    });

    fetchStudent();
    return () => unsub();
  }, [id]);

  if (loading) return <div className="text-center p-5"><div className="spinner-border"></div></div>;

  const summary = getFeeLogic(student?.course, payments);

  return (
    <div className="win11-bg min-vh-100 py-3">
      <div className="container" style={{ maxWidth: '850px' }}>
        <div className="glass-panel p-3 mb-4 d-flex align-items-center justify-content-between shadow-sm border-0">
          <div className="d-flex align-items-center">
            <button className="btn btn-light rounded-circle me-3" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <h5 className="fw-bold mb-0">Fee Management</h5>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-dark rounded-pill px-3 shadow-sm" onClick={() => printFullStatement(student, payments, summary)}>
              <i className="bi bi-printer me-2"></i> Print Statement
            </button>
            <AddPaymentModal student={student} />
          </div>
        </div>

        <FeeSummaryCard student={student} summary={summary} payments={payments} />

        <div className="card border-0 shadow-sm rounded-4 mt-4 overflow-hidden text-start">
          <div className="card-header bg-white py-3 border-bottom">
            <h6 className="mb-0 fw-bold"><i className="bi bi-clock-history me-2"></i>Payment History</h6>
          </div>
          <PaymentTable payments={payments} student={student} summary={summary} />
        </div>
      </div>
    </div>
  );
}