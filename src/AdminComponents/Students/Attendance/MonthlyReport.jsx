import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

const MonthlyReport = () => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "attendance"));
      const data = snap.docs.map((d) => d.data());

      const map = {};

      data.forEach((day) => {
        day.records.forEach((r) => {
          if (!map[r.id]) {
            map[r.id] = { name: r.name, present: 0, total: 0 };
          }
          map[r.id].total++;
          if (r.status === "present") map[r.id].present++;
        });
      });

      const final = Object.values(map).map((s) => ({
        ...s,
        percentage: ((s.present / s.total) * 100).toFixed(1)
      }));

      setReport(final);
    };
    fetch();
  }, []);

  return (
    <div className="container mt-4">
      <h4>Monthly Report</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Present</th>
            <th>Total</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {report.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.present}</td>
              <td>{r.total}</td>
              <td>{r.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyReport;