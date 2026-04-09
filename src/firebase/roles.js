import { auth } from "./firebase";

export const getQuickRole = () => {
  const user = auth.currentUser;
  const email = user?.email?.toLowerCase(); 

  if (!email) return null;

  if (email.endsWith("@admin.com")) return "admin";
  if (email.endsWith("@student.com")) return "student";
  
  return "guest"; 
};