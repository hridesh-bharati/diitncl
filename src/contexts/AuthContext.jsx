import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  authListener, 
  logoutUser, 
  getUserRole,
  isUserAdmin
} from '../firebase/auth';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const ADMIN_ALLOWED_EMAILS = [
  "hridesh027@gmail.com", 
  "ajaytiwari4@gmail.com",
  "chauhansantosh045@gmail.com"   
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [student, setStudent] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentData = async (email) => {
    try {
      const q = query(collection(db, "admissions"), where("email", "==", email.toLowerCase()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setStudent({ id: snap.docs[0].id, ...snap.docs[0].data() });
      } else {
        setStudent(null);
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      setStudent(null);
    }
  };

  useEffect(() => {
    let unsubscribeProfile = () => {};

    const unsubscribeAuth = authListener(async (currentUser) => {
      try {
        setError(null);
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("user_email", currentUser.email);

          // ✅ REAL-TIME LISTENER: No refresh needed now
          unsubscribeProfile = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
            if (docSnap.exists()) {
              const profileData = docSnap.data();
              setUserProfile(profileData);
              const userRole = profileData.role || 'user';
              setRole(userRole);

              localStorage.setItem("user_role", userRole);
              localStorage.setItem("user_name", profileData.name || currentUser.displayName || '');
              localStorage.setItem("user_photo", profileData.photoURL || currentUser.photoURL || '');

              if (userRole === 'student') fetchStudentData(currentUser.email);
            }
          });
        } else {
          setUser(null);
          setUserProfile(null);
          setRole(null);
          setStudent(null);
          localStorage.clear();
          unsubscribeProfile();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  const logout = async () => {
    await logoutUser();
    localStorage.clear();
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: "Password reset email sent!" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const isAdmin = role === 'admin' || ADMIN_ALLOWED_EMAILS.includes(user?.email);

  const value = {
    user, userProfile, student, role, loading, error, isAdmin,
    isStudent: role === 'student',
    isLoggedIn: !!user,
    displayName: student?.name || userProfile?.name || user?.displayName || "Guest",
    photoURL: student?.photoUrl || userProfile?.photoURL || user?.photoURL || "/images/icon/default-avatar.png",
    userEmail: user?.email || null,
    ADMIN_ALLOWED_EMAILS,
    logout,
    resetPassword,
    fetchStudentData,
    isUserAdmin: async (uid) => await isUserAdmin(uid)
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}