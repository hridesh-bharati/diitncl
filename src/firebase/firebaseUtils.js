import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// fetch all students
export async function fetchAllStudents() {
  const q = query(collection(db, "users"), where("role", "==", "student"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// fetch all admins
export async function fetchAllAdmins() {
  const q = query(collection(db, "users"), where("role", "==", "admin"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
