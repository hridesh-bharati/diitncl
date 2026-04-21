// src\StudentComponents\Dashboard\StudentFeeCard.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy
} from "firebase/firestore";

export default function StudentFeeCard({ studentId }) {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!studentId) return;

    const q = query(
      collection(db, "payments"),
      where("studentId", "==", studentId),
      orderBy("date", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [studentId]);

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalFee = payments[0]?.totalFee || 0;
  const due = totalFee - totalPaid;

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-muted">FEE SUMMARY</h6>
        <i className="bi bi-credit-card text-primary fs-4"></i>
      </div>

      <div className="row text-center mb-3">
        <div className="col">
          <div className="small text-muted">Total Fee</div>
          <div className="fw-bold">₹{totalFee}</div>
        </div>

        <div className="col">
          <div className="small text-muted">Paid</div>
          <div className="fw-bold text-success">₹{totalPaid}</div>
        </div>

        <div className="col">
          <div className="small text-muted">Due</div>
          <div className="fw-bold text-danger">₹{due}</div>
        </div>
      </div>

      <div style={{ maxHeight: "150px", overflowY: "auto" }}>
        {payments.length > 0 ? (
          payments.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="d-flex justify-content-between border-bottom py-2 small"
            >
              <span>{p.date}</span>
              <span className="fw-bold text-success">₹{p.amount}</span>
            </div>
          ))
        ) : (
          <div className="text-center text-muted small py-3">
            No payments yet
          </div>
        )}
      </div>
    </div>
  );
}