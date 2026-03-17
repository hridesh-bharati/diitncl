// src\Components\Header\LoginForm.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc, query, collection, where, getDocs, updateDoc } from "firebase/firestore";
import { subscribeUser } from "../../services/pushService";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginForm({ isAdminView, onSuccess }) {
  const { ADMIN_ALLOWED_EMAILS } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupAllowed, setSignupAllowed] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Check if signup allowed
  useEffect(() => {
    const checkSignupAllowed = async () => {
      if (isAdminView) {
        try {
          const checks = await Promise.all(
            ADMIN_ALLOWED_EMAILS.map(async (e) => {
              const q = query(collection(db, "users"), where("email", "==", e));
              const snap = await getDocs(q);
              return snap.empty;
            })
          );
          setSignupAllowed(checks.some(Boolean));
        } catch (err) {
          console.error(err);
        }
      } else {
        setSignupAllowed(true);
      }
    };
    checkSignupAllowed();
  }, [isAdminView, ADMIN_ALLOWED_EMAILS]);

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

      const userData = snap.data();
      const role = userData.role;

      if (isAdminView) {
        const isAllowedEmail = ADMIN_ALLOWED_EMAILS.includes(user.email.toLowerCase().trim());
        if (role !== "admin" && !isAllowedEmail) {
          await auth.signOut();
          toast.error("Unauthorized: Not an admin account");
          return;
        }
      } else {
        if (role !== "student") {
          await auth.signOut();
          toast.error("Unauthorized: Not a student account");
          return;
        }
      }

      toast.success("Login successful!");
      if (!isAdminView) {
        const sub = await subscribeUser();
        if (sub) {
          // Humein student ka document update karna hai. 
          // Note: admissions collection mein student ka ID search karke wahan update karein
          const q = query(collection(db, "admissions"), where("email", "==", email.toLowerCase().trim()));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const studentDoc = snap.docs[0];
            await updateDoc(doc(db, "admissions", studentDoc.id), {
              pushSubscription: JSON.stringify(sub)
            });
          }
        }
      }

      onSuccess?.();
      navigate(isAdminView ? "/admin" : "/student/dashboard");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    if (isAdminView && !ADMIN_ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
      return toast.error("You are not allowed to create an admin account");
    }
    if (password !== confirm) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: "",
        role: isAdminView ? "admin" : "student",
        createdAt: new Date()
      });

      toast.success(`${isAdminView ? "Admin" : "Student"} account created!`);
      setIsSignup(false);
      onSuccess?.();
      navigate(isAdminView ? "/admin/dashboard" : "/student/dashboard");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    if (!email) return toast.error("Please enter your email address");
    const trimmedEmail = email.toLowerCase().trim();

    if (isAdminView && !ADMIN_ALLOWED_EMAILS.includes(trimmedEmail)) {
      return toast.error("This email is not authorized as an Admin.");
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      toast.success("Reset link sent! Check your inbox.");
      setIsForgot(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center my-3 align-items-center" style={{ minHeight: "50vh" }}>
      <div className="card p-4 border-0 rounded-4 w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center fw-bold mb-4">
          {isForgot ? "Reset Password" : isSignup ? `${isAdminView ? "Admin" : "Student"} Signup` : `${isAdminView ? "Admin" : "Student"} Login`}
        </h3>

        <div className="mb-3">
          <label className="form-label small fw-bold">Email Address</label>
          <input
            type="email"
            className="form-control rounded-3"
            placeholder="example@mail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {!isForgot && (
          <>
            <div className="mb-3">
              <label className="form-label small fw-bold">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control rounded-start-3"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary px-3"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="mb-3">
                <label className="form-label small fw-bold">Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control rounded-start-3"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary px-3"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <button
          className="btn btn-primary w-100 py-2 rounded-pill fw-bold mb-3 shadow-sm"
          onClick={isForgot ? forgotPassword : isSignup ? signup : login}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2"></span>
          ) : isForgot ? "Send Reset Link" : isSignup ? "Signup" : "Login"}
        </button>

        <div className="text-center">
          {!isForgot && signupAllowed && (
            <button className="btn btn-link btn-sm text-decoration-none d-block w-100" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Already have an account? Login" : `New ${isAdminView ? "admin" : "student"}? Signup`}
            </button>
          )}

          {!isForgot && (
            <button className="btn btn-link btn-sm text-muted text-decoration-none" onClick={() => setIsForgot(true)}>
              Forgot Password?
            </button>
          )}

          {isForgot && (
            <button className="btn btn-link btn-sm text-decoration-none" onClick={() => setIsForgot(false)}>
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}