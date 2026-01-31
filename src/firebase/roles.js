// src/firebase/roles.js
import { auth } from "./firebase";

export const getUserRole = () => {
  const user = auth.currentUser;
  if (!user) return null;

  if (user.email.endsWith("@admin.com")) return "admin";
  if (user.email.endsWith("@student.com")) return "student";
  return "student";
};