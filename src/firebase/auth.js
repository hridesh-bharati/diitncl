// src/firebase/auth.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

/* AUTH LISTENER */
export const authListener = (cb) => onAuthStateChanged(auth, cb);

/* SIGNUP */
export const signupWithEmail = async (email, password, role) => {
  // Only allow your email to create admin account
  if (role === "admin" && email !== "hridesh027@gmail.com") {
    throw new Error("Unauthorized: Only your email can create admin account");
  }

  const res = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", res.user.uid), {
    email,
    role,
    createdAt: Date.now(),
  });

  return res.user;
};

/* LOGIN */
export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

/* GET ROLE */
export const getUserRole = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().role : null;
};

/* RESET PASSWORD */
export const resetPassword = async (email) => {
  return sendPasswordResetEmail(auth, email);
};

/* LOGOUT */
export const logoutUser = () => signOut(auth);
