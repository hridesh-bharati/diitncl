// src\AdminComponents\Students\Fees\StudentFees.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

export default function StudentFees() {

  const { id } = useParams();
  const [payments, setPayments] = useState([]);

  useEffect(() => {

    const q = query(
      collection(db, "admissions", id, "payments"),
      orderBy("date", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {

      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPayments(list);

    });

    return () => unsub();

  }, [id]);

  const totalPaid = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  return (

    <div className="container py-4">

      <h4 className="fw-bold mb-3">Student Fee Report</h4>

      <div className="alert alert-success">
        Total Paid : ₹{totalPaid}
      </div>

      <table className="table table-bordered">

        <thead>

          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Mode</th>
          </tr>

        </thead>

        <tbody>

          {payments.map((p) => (

            <tr key={p.id}>

              <td>
                {p.date?.seconds
                  ? new Date(p.date.seconds * 1000).toLocaleDateString()
                  : "-"}
              </td>

              <td>{p.type}</td>

              <td className="fw-bold text-success">
                ₹{p.amount}
              </td>

              <td>{p.mode}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}