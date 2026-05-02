// src\contexts\AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authListener, logoutUser, isUserAdmin } from '../firebase/auth';
// ✅ Fixed: getDoc ko import list mein add kar diya hai
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  onSnapshot, 
  getDoc 
} from 'firebase/firestore';
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

  // --- 1. Student Data fetch (Using Direct Get for Rules Compatibility) ---
  const fetchStudentData = async (email) => {
    if (!email) return null;
    try {
      const emailId = email.toLowerCase().trim();
      // ✅ Direct document access (isase rules ka 'get' permission trigger hoga)
      const docRef = doc(db, "admissions", emailId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const studentData = { id: snap.id, ...snap.data() };
        setStudent(studentData);
        return studentData;
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
    }
    setStudent(null);
    return null;
  };

  useEffect(() => {
    let unsubscribeProfile = () => {};

    const unsubscribeAuth = authListener(async (currentUser) => {
      setLoading(true);
      try {
        setError(null);
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("user_email", currentUser.email);

          // 2. Real-time User Role/Profile Listener
          unsubscribeProfile = onSnapshot(doc(db, "users", currentUser.uid), async (docSnap) => {
            if (docSnap.exists()) {
              const profileData = docSnap.data();
              const userRole = profileData.role || 'user';
              
              setUserProfile(profileData);
              setRole(userRole);

              localStorage.setItem("user_role", userRole);
              localStorage.setItem("user_name", profileData.name || currentUser.displayName || '');

              // 3. Agar student hai toh uska admission data fetch karein
              if (userRole === 'student') {
                await fetchStudentData(currentUser.email);
              }
              setLoading(false);
            } else {
              setLoading(false);
            }
          }, (err) => {
            console.error("Profile Listener Error:", err);
            setLoading(false);
          });
        } else {
          setUser(null);
          setUserProfile(null);
          setRole(null);
          setStudent(null);
          localStorage.clear();
          unsubscribeProfile();
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}