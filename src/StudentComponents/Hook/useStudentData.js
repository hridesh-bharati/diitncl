import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export function useStudentData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    
    getDoc(doc(db, "admissions", user.uid))
      .then(snap => {
        if (snap.exists()) setData(snap.data());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  return { data, loading, user };
}