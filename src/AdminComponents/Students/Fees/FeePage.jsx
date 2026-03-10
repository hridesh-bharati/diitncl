import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/firebase"; // Apna firebase path check kar lena
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
        <div className="d-flex align-items-center mb-3">
          <button 
            className="btn btn-light rounded-circle shadow-sm me-3 border" 
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          
          <div>
            <h4 className="fw-bold mb-0 text-dark">Fee Management</h4>
            <small className="text-muted">Student ID: {id.slice(-6).toUpperCase()}</small>
          </div>

          <div className="ms-auto d-flex gap-2">
            {/* Professional Full Statement Button */}
            <button 
              className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm" 
              onClick={() => printFullStatement(student, payments, summary)}
            >
              <i className="bi bi-printer me-2"></i> Print Statement
            </button>
            
            {/* Add Payment Modal */}
            <AddPaymentModal student={student} />
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