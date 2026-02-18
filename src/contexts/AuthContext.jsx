// src\contexts\AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  authListener, 
  logoutUser, 
  getUserRole,
  getCurrentUserProfile,
  isUserAdmin
} from '../firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// ✅ Centralized admin emails
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

  // Fetch student admission data
  const fetchStudentData = async (email) => {
    try {
      const q = query(
        collection(db, "admissions"), 
        where("email", "==", email.toLowerCase())
      );
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

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = authListener(async (currentUser) => {
      try {
        setError(null);
        
        if (currentUser) {
          setUser(currentUser);
          
          // Get user role from Firestore
          const userRole = await getUserRole(currentUser.uid);
          setRole(userRole);
          
          // Get full profile
          const profile = await getCurrentUserProfile();
          setUserProfile(profile);
          
          // Save to localStorage for gallery
          localStorage.setItem("user_email", currentUser.email);
          localStorage.setItem("user_role", userRole || 'user');
          localStorage.setItem("user_name", profile?.name || currentUser.displayName || '');
          localStorage.setItem("user_photo", profile?.photoURL || currentUser.photoURL || '');
          
          // Fetch student data if role is student
          if (userRole === 'student') {
            await fetchStudentData(currentUser.email);
          } else {
            setStudent(null);
          }
        } else {
          // Clear all states
          setUser(null);
          setUserProfile(null);
          setRole(null);
          setStudent(null);
          
          // Clear only auth localStorage
          localStorage.removeItem("user_email");
          localStorage.removeItem("user_role");
          localStorage.removeItem("user_name");
          localStorage.removeItem("user_photo");
        }
      } catch (err) {
        setError(err.message);
        console.error("Auth state error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login success handler
  const handleLoginSuccess = (userData) => {
    localStorage.setItem("user_email", userData.email);
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setUserProfile(null);
      setRole(null);
      setStudent(null);
      
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_photo");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: "Password reset email sent!" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update user profile in context
  const updateUserProfile = (updatedData) => {
    setUserProfile(prev => ({ ...prev, ...updatedData }));
    if (updatedData.name) localStorage.setItem("user_name", updatedData.name);
    if (updatedData.photoURL) localStorage.setItem("user_photo", updatedData.photoURL);
  };

  // ✅ Admin check using centralized ADMIN_ALLOWED_EMAILS
  const isAdmin = role === 'admin' || ADMIN_ALLOWED_EMAILS.includes(user?.email);

  // Student check
  const isStudent = role === 'student';

  // Logged in check
  const isLoggedIn = !!user;

  // Get display name
  const displayName = student?.name || 
    userProfile?.name || 
    user?.displayName || 
    localStorage.getItem("user_name") || 
    "Guest";

  // Get photo URL
  const photoURL = student?.photoUrl || 
    userProfile?.photoURL || 
    user?.photoURL || 
    localStorage.getItem("user_photo") || 
    "/images/icon/default-avatar.png";

  const value = {
    user,
    userProfile,
    student,
    role,
    loading,
    error,
    isAdmin,
    isStudent,
    isLoggedIn,
    displayName,
    photoURL,
    userEmail: user?.email || null,
    ADMIN_ALLOWED_EMAILS, // 👈 Export karo context se bhi
    logout,
    resetPassword,
    handleLoginSuccess,
    updateUserProfile,
    fetchStudentData,
    isUserAdmin: async (uid) => await isUserAdmin(uid)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}