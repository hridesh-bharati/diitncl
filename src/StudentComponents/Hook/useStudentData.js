import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function useStudentData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    // 1. Auth Listener: Ye check karta rahega ki user login hai ya nahi
    const unsubAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      
      if (!currentUser) {
        setData(null);
        setLoading(false);
      }
    });

    // 2. Agar user mil gaya, toh uske email se Firestore listen karo
    if (user?.email) {
      const emailId = user.email.toLowerCase().trim();
      const docRef = doc(db, "admissions", emailId);

      // ✅ LIVE LISTENER: No Skips, Admin changes live dikhenge
      const unsubData = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          // Document ID yahan student ka email hi hai
          setData({ id: snap.id, ...snap.data() });
        } else {
          console.warn("No student record found for:", emailId);
          setData(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Firestore error in useStudentData:", error);
        setLoading(false);
      });

      // Cleanup dono listeners ko band karega
      return () => {
        unsubAuth();
        unsubData();
      };
    }

    return () => unsubAuth();
  }, [user]);

  return { data, loading, user };
}