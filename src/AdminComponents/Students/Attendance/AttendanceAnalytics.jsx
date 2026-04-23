import React, { useEffect, useState, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

export default function AttendanceAnalytics() {
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "attendance"));
      let p = 0, a = 0;

      snap.forEach(doc => {
        (doc.data().records || []).forEach(r => {
          r.status === "Present" ? p++ : a++;
        });
      });

      setPresent(p);
      setAbsent(a);
    };

    fetch();
  }, []);

  const data = useMemo(() => ({
    labels: ["Present", "Absent"],
    datasets: [{
      data: [present, absent],
      backgroundColor: ["#198754", "#dc3545"],
      borderWidth: 0
    }]
  }), [present, absent]);

  return (
    <div className="container py-3">
      <h5 className="mb-3">Attendance Analytics</h5>

      <div className="border rounded-3 p-3" style={{ maxWidth: 320 }}>
        <Doughnut data={data} />
      </div>
    </div>
  );
}