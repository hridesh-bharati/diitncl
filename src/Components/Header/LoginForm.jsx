
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../firebase/firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";


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
    inputBorder: "#e0e6ed",
  };

  /* =========================================================
     AUTO LOGIN REDIRECT
  ========================================================= */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (!user) return;

        const isAllowedAdmin =
          ADMIN_ALLOWED_EMAILS?.includes(
            user.email?.toLowerCase()
          );

        // Student email verification required
        if (!user.emailVerified && !isAllowedAdmin) {
          return;
        }

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        const userData = userSnap.data();

        const role = userData?.role;

        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/student/dashboard", {
            replace: true,
          });
        }
      } catch (err) {
        console.error(err);
      }
    });

    return () => unsubscribe();
  }, [navigate, ADMIN_ALLOWED_EMAILS]);

  /* =========================================================
     LOGIN
  ========================================================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const userCred =
        await signInWithEmailAndPassword(
          auth,
          email.toLowerCase(),
          password
        );

      const user = userCred.user;

      // Email verification check
      if (!user.emailVerified && !isAdmin) {
        await auth.signOut();

        return toast.error(
          "Please verify your email first."
        );
      }

      const userRef = doc(db, "users", user.uid);

      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await auth.signOut();

        throw new Error("Account data not found.");
      }

      const userData = userSnap.data();

      const role = userData?.role;

      // Unauthorized role protection
      if (
        (isAdmin && role !== "admin") ||
        (!isAdmin && role !== "student")
      ) {
        await auth.signOut();

        throw new Error("Unauthorized access.");
      }





      /* =========================================================
         SINGLE DEVICE LOGIN FOR STUDENTS
      ========================================================= */

      if (role === "student") {
        const sessionId =
          Date.now().toString() +
          Math.random()
            .toString(36)
            .substring(2);

        localStorage.setItem(
          "current_session_id",
          sessionId
        );

        await setDoc(
          doc(db, "users", user.uid),
          {
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      toast.success("Welcome back!");

      navigate(
        role === "admin"
          ? "/admin"
          : "/student/dashboard"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SIGNUP
  ========================================================= */
  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error(
        "Passwords do not match"
      );
    }

    if (
      isAdmin &&
      !ADMIN_ALLOWED_EMAILS.includes(
        email.toLowerCase()
      )
    ) {
      return toast.error(
        "Unauthorized admin email"
      );
    }

    try {
      setLoading(true);

      const userCred =
        await createUserWithEmailAndPassword(
          auth,
          email.toLowerCase(),
          password
        );

      const user = userCred.user;

      /* =========================================================
         SAVE USER DATA
      ========================================================= */

      await setDoc(doc(db, "users", user.uid), {
        email: email.toLowerCase(),
        role: isAdmin ? "admin" : "student",
        createdAt: serverTimestamp(),
      });

      /* =========================================================
         SEND VERIFICATION EMAIL
      ========================================================= */

      await sendEmailVerification(user);

      toast.success(
        "Account created successfully!"
      );

      toast.info(
        "Verification email sent. Please check inbox."
      );

      await auth.signOut();

      setIsSignup(false);

      setEmail("");

      setPassword("");

      setConfirmPassword("");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FORGOT PASSWORD
  ========================================================= */
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error(
        "Please enter your email address"
      );
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(
        auth,
        email.toLowerCase()
      );

      toast.success(
        "Password reset email sent!"
      );

      setForgotPassword(false);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.message || "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center p-2 p-sm-3"
      style={{
        minHeight: "calc(100vh - 65px)",
        background: COLORS.bgSoft,
      }}
    >
      <div
        className="w-100"
        style={{ maxWidth: "420px" }}
      >
        {/* LOGO */}
        <div className="text-center mb-3 mb-sm-4">
          <h2
            className="fw-bolder m-0"
            style={{
              color: COLORS.blue,
              letterSpacing: "0.5px",
              fontSize:
                "calc(1.6rem + 0.6vw)",
            }}
          >
            DRISHTEE
          </h2>

          <small
            className="text-muted text-uppercase fw-bold d-block mt-1"
            style={{
              fontSize: "11px",
              letterSpacing: "1.5px",
            }}
          >
            Verified Education Portal
          </small>
        </div>

        {/* CARD */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          {/* TOP TOGGLE */}
          <div className="d-flex p-2 bg-white border-bottom">
            <button
              type="button"
              onClick={() => {
                setIsAdmin(false);
                setIsSignup(false);
                setForgotPassword(false);
              }}
              className="flex-fill py-2 border-0 rounded-3 fw-bold"
              style={{
                color: !isAdmin
                  ? COLORS.blue
                  : "#6c757d",

                backgroundColor: !isAdmin
                  ? COLORS.blueLight
                  : "transparent",
              }}
            >
              Student
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAdmin(true);
                setIsSignup(false);
                setForgotPassword(false);
              }}
              className="flex-fill py-2 border-0 rounded-3 fw-bold"
              style={{
                color: isAdmin
                  ? COLORS.blue
                  : "#6c757d",

                backgroundColor: isAdmin
                  ? COLORS.blueLight
                  : "transparent",
              }}
            >
              Admin
            </button>
          </div>

          {/* BODY */}
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <h4 className="fw-bold">
                {forgotPassword
                  ? "Recover Account"
                  : isSignup
                    ? "Create Account"
                    : "Login"}
              </h4>
            </div>

            <form
              onSubmit={
                forgotPassword
                  ? handleForgotPassword
                  : isSignup
                    ? handleSignup
                    : handleLogin
              }
            >
              {/* EMAIL */}
              <div className="mb-3">
                <label className="small fw-bold mb-1">
                  EMAIL
                </label>

                <div className="input-group border rounded-3">
                  <span className="input-group-text bg-transparent border-0">
                    <i className="bi bi-envelope"></i>
                  </span>

                  <input
                    type="email"
                    className="form-control border-0 shadow-none"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              {!forgotPassword && (
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <label className="small fw-bold">
                      PASSWORD
                    </label>

                    <small
                      style={{
                        cursor: "pointer",
                        color: COLORS.blue,
                      }}
                      onClick={() =>
                        setForgotPassword(true)
                      }
                    >
                      Forgot?
                    </small>
                  </div>

                  <div className="input-group border rounded-3">
                    <span className="input-group-text bg-transparent border-0">
                      <i className="bi bi-lock"></i>
                    </span>

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      className="form-control border-0 shadow-none"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                    />

                    <span
                      className="input-group-text bg-transparent border-0"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      <i
                        className={`bi ${showPassword
                            ? "bi-eye-slash"
                            : "bi-eye"
                          }`}
                      />
                    </span>
                  </div>
                </div>
              )}

              {/* CONFIRM PASSWORD */}
              {isSignup && !forgotPassword && (
                <div className="mb-3">
                  <label className="small fw-bold mb-1">
                    CONFIRM PASSWORD
                  </label>

                  <div className="input-group border rounded-3">
                    <span className="input-group-text bg-transparent border-0">
                      <i className="bi bi-check-circle"></i>
                    </span>

                    <input
                      type="password"
                      className="form-control border-0 shadow-none"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="btn w-100 text-white fw-bold py-3 border-0 mt-3"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`,
                  borderRadius: "12px",
                }}
              >
                {loading ? (
                  <div className="spinner-border spinner-border-sm text-white"></div>
                ) : forgotPassword ? (
                  "SEND RESET LINK"
                ) : isSignup ? (
                  "CREATE ACCOUNT"
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>

            {/* BOTTOM */}
            <div className="text-center mt-4">
              {forgotPassword ? (
                <button
                  className="btn btn-link text-decoration-none"
                  onClick={() =>
                    setForgotPassword(false)
                  }
                >
                  Back to Login
                </button>
              ) : (
                <>
                  <small className="text-muted">
                    {isSignup
                      ? "Already have account?"
                      : "New here?"}
                  </small>

                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() =>
                      setIsSignup(!isSignup)
                    }
                  >
                    {isSignup
                      ? "Login"
                      : "Create Account"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-light text-center p-3 border-top">
            <small className="text-muted">
              <i className="bi bi-shield-lock-fill me-1"></i>
              Secure Authentication
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}