import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export function useStudentData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, "admissions", user.uid));
        if (snap.exists()) setData(snap.data());
      } catch (err) {
        console.error("Error fetching student data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return { data, setData, loading, user };
}