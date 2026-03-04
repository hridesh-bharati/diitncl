import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AttendanceAnalytics() {
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "attendance"));
      let p = 0;
      let a = 0;

      snap.docs.forEach(doc => {
        doc.data().records.forEach(r => {
          if (r.status === "Present") p++;
          else a++;
        });
      });

      setPresent(p);
      setAbsent(a);
    };

    fetchData();
  }, []);

  const data = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ["#198754", "#dc3545"]
      }
    ]
  };

  return (
    <div className="container py-4">
      <h4> Attendance Analytics </h4>
      <div style={{ maxWidth: "400px" }}>
        <Doughnut data={data} />
      </div>
    </div>
  );
}