import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const AttendanceView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "attendance"), where("date", "==", selectedDate));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setRecords(snapshot.docs[0].data().records);
      } else {
        setRecords({});
        alert("Is date ki koi record nahi mili.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "20px" }}>
        <h5 className="fw-bold mb-3">Check Attendance History</h5>
        <div className="d-flex gap-2 mb-4">
          <input 
            type="date" 
            className="form-control" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button className="btn btn-dark px-4" onClick={fetchHistory}>View</button>
        </div>

        {loading ? <p>Loading...</p> : records && (
          <div className="list-group">
            {Object.entries(records).map(([id, status]) => (
              <div key={id} className="list-group-item d-flex justify-content-between align-items-center border-0 mb-2 bg-light rounded-3">
                <span>Student ID: <span className="fw-bold">{id}</span></span>
                <span className={`badge rounded-pill ${status === 'present' ? 'bg-success' : 'bg-danger'}`}>
                  {status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceView;