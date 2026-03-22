import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export function useStudentData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    // user.uid ki jagah user.email use karein kyunki email hi ID hai
    if (!user?.email) {
      setLoading(false);
      return;
    }
    
    const emailId = user.email.toLowerCase().trim();
    
    getDoc(doc(db, "admissions", emailId))
      .then(snap => {
        if (snap.exists()) {
          setData({ id: snap.id, ...snap.data() });
        } else {
          console.log("No student record found for:", emailId);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  return { data, loading, user };
}