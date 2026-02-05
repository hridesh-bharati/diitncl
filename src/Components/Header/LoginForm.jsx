import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc, query, collection, where, getDocs } from "firebase/firestore";

const ADMIN_ALLOWED_EMAILS = ["hridesh027@gmail.com", "aj24@gmail.com"];

export default function LoginForm({ isAdminView, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupAllowed, setSignupAllowed] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  const navigate = useNavigate();

  // Check if signup button should be visible
  useEffect(() => {
    const checkSignupAllowed = async () => {
      if (isAdminView) {
        try {
          let anyAvailable = false;
          for (let e of ADMIN_ALLOWED_EMAILS) {
            const q = query(collection(db, "users"), where("email", "==", e));
            const snap = await getDocs(q);
            if (snap.empty) anyAvailable = true; // at least one admin email is free → show signup
          }
          setSignupAllowed(anyAvailable);
        } catch (err) {
          console.error(err);
        }
      } else {
        // Student → always allow signup
        setSignupAllowed(true);
      }
    };
    checkSignupAllowed();
  }, [isAdminView]);

  // Login
  const login = async () => {
    if (!email || !password) return toast.error("Enter email and password");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists()) {
        await auth.signOut();
        toast.error("No account found for this email");
        return;
      }

      const role = snap.data().role;
      if ((isAdminView && role !== "admin") || (!isAdminView && role !== "student")) {
        await auth.signOut();
        toast.error(`Unauthorized: Not a ${isAdminView ? "admin" : "student"} account`);
        return;
      }

      toast.success("Login successful!");
      onSuccess?.();
      navigate(isAdminView ? "/admin/dashboard" : "/student/dashboard");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Signup
  const signup = async () => {
    if (isAdminView && !ADMIN_ALLOWED_EMAILS.includes(email)) {
      return toast.error("You are not allowed to create an admin account");
    }

    if (password !== confirm) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Save info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: "",
        role: isAdminView ? "admin" : "student",
        createdAt: new Date()
      });

      toast.success(`${isAdminView ? "Admin" : "Student"} account created successfully!`);

      // Admin → hide signup if both emails are used
      if (isAdminView) setSignupAllowed(false);

      setIsSignup(false);
      onSuccess?.();
      navigate(isAdminView ? "/admin/dashboard" : "/student/dashboard");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async () => {
    if (!email) return toast.error("Enter your email for reset");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent! Check your inbox.");
      setIsForgot(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-3">
          {isForgot
            ? "Reset Password"
            : isSignup
            ? `${isAdminView ? "Admin" : "Student"} Signup`
            : `${isAdminView ? "Admin" : "Student"} Login`}
        </h2>

        {!isForgot && (
          <>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {isSignup && (
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" value={confirm} onChange={e => setConfirm(e.target.value)} />
              </div>
            )}
          </>
        )}

        <button
          className="btn btn-primary w-100 mb-2"
          onClick={isForgot ? forgotPassword : isSignup ? signup : login}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : isForgot
            ? "Send Reset Link"
            : isSignup
            ? "Signup"
            : "Login"}
        </button>

        {/* Signup toggle */}
        {!isForgot && signupAllowed && (
          <div className="text-center mt-2">
            <button className="btn btn-link" onClick={() => setIsSignup(!isSignup)}>
              {isSignup
                ? "Already have an account? Login"
                : `New ${isAdminView ? "admin" : "student"}? Signup`}
            </button>
          </div>
        )}

        {/* Forgot password toggle */}
        {!isForgot && (
          <div className="text-center mt-1">
            <button className="btn btn-link text-muted" onClick={() => setIsForgot(true)}>
              Forgot Password?
            </button>
          </div>
        )}

        {isForgot && (
          <div className="text-center mt-2">
            <button className="btn btn-link" onClick={() => setIsForgot(false)}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
