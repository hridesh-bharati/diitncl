import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { printReceipt } from "../../AdminComponents/Students/Fees/FeeServices";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user?.email) return;
    const q = query(collection(db, "admissions"), where("email", "==", user.email.toLowerCase()));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) setData({ id: snap.docs[0].id, ...snap.docs[0].data() });
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!data?.id) return;
    const pq = query(collection(db, "admissions", data.id, "payments"), orderBy("date", "desc"));
    return onSnapshot(pq, (snap) => setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [data]);

  // Next Payment Date Logic
  const getNextDate = () => {
    if (!data?.admissionDate) return "--";
    const adm = new Date(data.admissionDate);
    const count = payments.filter(p => p.note.includes("Monthly")).length;
    adm.setMonth(adm.getMonth() + (count || 1));
    return adm.toLocaleDateString('en-GB');
  };

  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="container py-3" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      {/* Profile Header */}
      <div className="card border-0 rounded-4 text-white p-4 mb-4" style={{ background: "linear-gradient(135deg,#1e3c72,#2a5298)" }}>
        <div className="d-flex align-items-center mb-3">
          <img src={data?.photoUrl || "https://via.placeholder.com/60"} className="rounded-circle border border-2" style={{ width: 60, height: 60 }} />
          <div className="ms-3">
            <h5 className="mb-0">{data?.name}</h5>
            <small>{data?.course} ({data?.courseDuration})</small>
          </div>
        </div>
        <div className="bg-white bg-opacity-10 p-2 rounded-3 text-center">
          <small className="d-block opacity-75">NEXT DUE DATE</small>
          <span className="fw-bold text-warning">{getNextDate()}</span>
        </div>
      </div>

      {/* Fee Summary */}
      <div className="row g-3 mb-4 text-center">
        <div className="col-6"><div className="card p-3 border-0 shadow-sm rounded-4">
          <small className="text-muted">Total Paid</small><h4 className="fw-bold text-success">₹{totalPaid}</h4>
        </div></div>
        <div className="col-6"><div className="card p-3 border-0 shadow-sm rounded-4">
          <small className="text-muted">Monthly Fee</small><h4 className="fw-bold">₹{data?.monthlyFee || 0}</h4>
        </div></div>
      </div>

      {/* Payment Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="p-3 bg-white border-bottom fw-bold">Recent Receipts</div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr style={{ fontSize: '12px' }}><th>Date</th><th>Amt</th><th>Print</th></tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>{p.date}</td>
                  <td className="fw-bold text-success">₹{p.amount}</td>
                  <td><button onClick={() => printReceipt(data, p)} className="btn btn-sm btn-light border"><i className="bi bi-printer"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}