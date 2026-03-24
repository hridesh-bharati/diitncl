// src/hooks/useDashboardData.js
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function useDashboardData() {
  const [data, setData] = useState({
    students: [],
    queries: [],
    counts: { total: 0, today: 0, queries: 0, exams: 0, week: 0 },
    chartData: { weeklyData: Array(7).fill(0), courseDistribution: {} },
    loading: true,
  });

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const unsubscribers = [];

    // 🔹 STUDENTS + ANALYTICS
    unsubscribers.push(
      onSnapshot(query(collection(db, "admissions"), orderBy("createdAt", "desc")), (snap) => {
        const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        let todayCount = 0;
        let weekCount = 0;

        const weeklyCounts = Array(7).fill(0);
        const courses = {};

        all.forEach((s) => {
          const d = s.createdAt?.toDate?.();
          if (!d) return;

          if (d >= today) todayCount++;
          if (d >= weekAgo) {
            weekCount++;
            weeklyCounts[d.getDay()]++;
          }

          if (s.course) {
            courses[s.course] = (courses[s.course] || 0) + 1;
          }
        });

        setData(prev => ({
          ...prev,
          students: all.slice(0, 5),
          counts: {
            ...prev.counts,
            total: snap.size,
            today: todayCount,
            week: weekCount,
          },
          chartData: {
            weeklyData: weeklyCounts,
            courseDistribution: courses,
          },
          loading: false,
        }));
      })
    );

    // 🔹 QUERIES
    unsubscribers.push(
      onSnapshot(collection(db, "studentQueries"), (snap) => {
        setData(prev => ({
          ...prev,
          queries: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 4),
          counts: {
            ...prev.counts,
            queries: snap.size,
          },
        }));
      })
    );

    // 🔹 EXAMS
    unsubscribers.push(
      onSnapshot(collection(db, "studentExams"), (snap) => {
        setData(prev => ({
          ...prev,
          counts: {
            ...prev.counts,
            exams: snap.size,
          },
        }));
      })
    );

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  return data;
}