// src/AdminComponents/Admissions/AdmissionProvider.jsx
import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function AdmissionProvider({ children }) {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const q = query(collection(db, "admissions"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, 
      (snap) => {
        if (!isMounted) return;
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAdmissions(data);
        setLoading(false);
      },
      (err) => {
        if (!isMounted) return;
        console.error("Firestore Error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({ admissions, loading, error }), [admissions, loading, error]);

  return typeof children === "function" ? children(value) : children;
}