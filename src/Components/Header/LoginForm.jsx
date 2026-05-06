import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { subscribeUser } from "../../services/pushService";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginForm() {
  const { ADMIN_ALLOWED_EMAILS } = useAuth();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const COLORS = {
    blue: "#0087ff",
    blueLight: "#eef7ff",
    blueDark: "#0070d6",
    bgSoft: "#f4f7f9",
    textMain: "#1c1c1c",
    inputBorder: "#e0e6ed"
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.data()?.role;
        if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "student") navigate("/student/dashboard", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCred.user.uid));

      if (!userDoc.exists()) {
        await auth.signOut();
        throw new Error("Account not found");
      }

      const role = userDoc.data().role;
      if ((isAdmin && role !== "admin") || (!isAdmin && role !== "student")) {
        await auth.signOut();
        throw new Error(`Unauthorized: ${isAdmin ? "Admin" : "Student"} access only`);
      }

      toast.success("Welcome back!");
      if (!isAdmin) await subscribeUser();
      navigate(role === "admin" ? "/admin" : "/student/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords don't match");
    if (isAdmin && !ADMIN_ALLOWED_EMAILS.includes(email.toLowerCase())) {
      return toast.error("Unauthorized email for Admin");
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        email: email.toLowerCase(),
        role: isAdmin ? "admin" : "student",
        createdAt: new Date()
      });
      toast.success("Account created!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center p-3"
      style={{ minHeight: "calc(100vh - 65px)", background: COLORS.bgSoft }}>
      <div className="w-100" style={{ maxWidth: "420px" }}>

        {/* Portal Logo/Name */}
        <div className="text-center mb-4">
          <h2 className="fw-bolder m-0" style={{ color: COLORS.blue, letterSpacing: '0.5px' }}>DRISHTEE</h2>
          <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '1.5px' }}>Verified Education Portal</small>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ background: "#ffffff" }}>

          {/* Header Toggle with Blue Accent */}
          <div className="d-flex p-2 bg-white border-bottom">
            <button
              type="button"
              onClick={() => { setIsAdmin(false); setIsSignup(false); }}
              className={`flex-fill py-2 border-0 rounded-3 fw-bold transition-all ${!isAdmin ? 'bg-white shadow-sm' : 'bg-transparent text-muted'}`}
              style={{ color: !isAdmin ? COLORS.blue : 'inherit' }}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => { setIsAdmin(true); setIsSignup(false); }}
              className={`flex-fill py-2 border-0 rounded-3 fw-bold transition-all ${isAdmin ? 'bg-white shadow-sm' : 'bg-transparent text-muted'}`}
              style={{ color: isAdmin ? COLORS.blue : 'inherit' }}
            >
              Admin
            </button>
          </div>

          <div className="card-body p-4 pt-4">
            <div className="text-center mb-4">
              <h4 className="fw-bold mb-1">
                {forgotPassword ? "Recover Access" : isSignup ? "Create Profile" : "Login Now"}
              </h4>
              <div style={{ height: '3px', width: '40px', background: COLORS.blue, margin: '0 auto', borderRadius: '10px' }}></div>
            </div>

            <form onSubmit={forgotPassword ? (e) => e.preventDefault() : (isSignup ? handleSignup : handleLogin)}>

              {/* Email Input */}
              <div className="mb-3">
                <label className="small fw-bold mb-1 opacity-75">EMAIL ADDRESS</label>
                <div className="input-group bg-white rounded-3 border" style={{ borderColor: COLORS.inputBorder }}>
                  <span className="input-group-text bg-transparent border-0 px-3">
                    <i className="bi bi-envelope" style={{ color: COLORS.blue }}></i>
                  </span>
                  <input
                    type="email"
                    className="form-control bg-transparent border-0 py-2 shadow-none"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {!forgotPassword && (
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="small fw-bold mb-1 opacity-75">PASSWORD</label>
                    <small className="mb-1 pointer text-muted" style={{ cursor: 'pointer' }} onClick={() => setForgotPassword(true)}>Forgot?</small>
                  </div>
                  <div className="input-group bg-white rounded-3 border" style={{ borderColor: COLORS.inputBorder }}>
                    <span className="input-group-text bg-transparent border-0 px-3">
                      <i className="bi bi-shield-lock" style={{ color: COLORS.blue }}></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control bg-transparent border-0 py-2 shadow-none"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span className="input-group-text bg-transparent border-0 pe-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(!showPassword)}>
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                    </span>
                  </div>
                </div>
              )}

              {isSignup && !forgotPassword && (
                <div className="mb-3 animate__animated animate__fadeIn">
                  <label className="small fw-bold mb-1 opacity-75">CONFIRM PASSWORD</label>
                  <div className="input-group bg-white rounded-3 border" style={{ borderColor: COLORS.inputBorder }}>
                    <span className="input-group-text bg-transparent border-0 px-3">
                      <i className="bi bi-check-circle" style={{ color: COLORS.blue }}></i>
                    </span>
                    <input
                      type="password"
                      className="form-control bg-transparent border-0 py-2 shadow-none"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Truecaller Blue Button */}
              <button
                type="submit"
                className="btn w-100 py-3 fw-bold text-white mt-3 border-0 active-scale"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`,
                  borderRadius: "12px",
                  boxShadow: '0 4px 15px rgba(0, 135, 255, 0.25)',
                  letterSpacing: '0.5px'
                }}
                disabled={loading}
              >
                {loading ? <span className="spinner-border spinner-border-sm"></span> :
                  forgotPassword ? "SEND RESET LINK" : isSignup ? "CREATE PROFILE" : "SIGN IN"}
              </button>
            </form>

            <div className="text-center mt-4">
              {forgotPassword ? (
                <button onClick={() => setForgotPassword(false)} className="btn btn-link btn-sm text-decoration-none fw-bold shadow-none" style={{ color: COLORS.blue }}>
                  Return to Login
                </button>
              ) : (
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <span className="small text-muted">{isSignup ? "Have an account?" : "New here?"}</span>
                  <button
                    onClick={() => setIsSignup(!isSignup)}
                    className="btn btn-link btn-sm text-decoration-none fw-bold p-0 shadow-none"
                    style={{ color: COLORS.blue }}
                  >
                    {isSignup ? "Sign In" : "Create Account"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-light p-3 text-center border-top">
            <small className="text-muted fw-semibold" style={{ fontSize: '10px' }}>
              <i className="bi bi-lock-fill me-1" style={{ color: COLORS.blue }}></i>
              SECURE AUTHENTICATION SYSTEM
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}