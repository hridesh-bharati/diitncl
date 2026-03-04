import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";

const AttendanceHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const q = query(
        collection(db, "attendance"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "attendance", id));
    setHistory(history.filter((h) => h.id !== id));
  };

  return (
    <div className="container mt-4">
      <h4>Attendance History</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Branch</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Leave</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h.id}>
              <td>{h.date}</td>
              <td>{h.branch}</td>
              <td>{h.totalPresent}</td>
              <td>{h.totalAbsent}</td>
              <td>{h.totalLeave}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(h.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceHistory;