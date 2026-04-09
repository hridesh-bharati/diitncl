// src\AdminComponents\Admissions\AdmissionProvider.jsx
import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";

export default function AdmissionProvider({ children }) {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const q = query(
      collection(db, "admissions"),
      orderBy("createdAt", "desc")
    );

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

  const updateAdmission = async (id, updatedData) => {
    try {
      const docRef = doc(db, "admissions", id);
      await updateDoc(docRef, updatedData);
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Database update failed");
      throw err;
    }
  };

  const deleteAdmission = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteDoc(doc(db, "admissions", id));
      toast.success("Student record deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const value = useMemo(() => ({
    admissions,
    loading,
    error,
    updateAdmission,
    deleteAdmission
  }), [admissions, loading, error]);

  return typeof children === "function" ? children(value) : children;
}