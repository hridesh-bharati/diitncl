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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext"; // 👈 Import useAuth

export default function LoginForm({ isAdminView, onSuccess }) {
  // 👈 Get admin emails from context
  const { ADMIN_ALLOWED_EMAILS } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupAllowed, setSignupAllowed] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Check if signup button should be visible
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

  // Login
  // In LoginForm.jsx - Update the login function
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

      // Debug logs
      console.log("Login attempt:", {
        email: user.email,
        role,
        isAdminView,
        isAdminEmail: ADMIN_ALLOWED_EMAILS.includes(user.email.toLowerCase().trim())
      });

      // Check if admin
      if (isAdminView) {
        // Check both role and allowed emails
        const isAllowedEmail = ADMIN_ALLOWED_EMAILS.includes(user.email.toLowerCase().trim());

        if (role !== "admin" && !isAllowedEmail) {
          await auth.signOut();
          toast.error("Unauthorized: Not an admin account");
          return;
        }
      } else {
        // Student view
        if (role !== "student") {
          await auth.signOut();
          toast.error("Unauthorized: Not a student account");
          return;
        }
      }

      toast.success("Login successful!");
      onSuccess?.();
      navigate(isAdminView ? "/admin/dashboard" : "/student/dashboard");
    } catch (e) {
      console.error("Login error:", e);
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

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: "",
        role: isAdminView ? "admin" : "student",
        createdAt: new Date()
      });

      toast.success(`${isAdminView ? "Admin" : "Student"} account created successfully!`);

      if (isAdminView) {
        const checks = await Promise.all(
          ADMIN_ALLOWED_EMAILS.map(async (e) => {
            const q = query(collection(db, "users"), where("email", "==", e));
            const snap = await getDocs(q);
            return snap.empty;
          })
        );
        setSignupAllowed(checks.some(Boolean));
      }

      setIsSignup(false);
      onSuccess?.();
      navigate(isAdminView ? "/admin/dashboard" : "/student/dashboard");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Logic
const forgotPassword = async () => {
  if (!email) return toast.error("Please enter your email address");

  const trimmedEmail = email.toLowerCase().trim();
  
  // Admin check: Only allow reset link if email is in the admin list
  if (isAdminView && !ADMIN_ALLOWED_EMAILS.includes(trimmedEmail)) {
    console.log("Admin emails:", ADMIN_ALLOWED_EMAILS);
    console.log("Attempted email:", trimmedEmail);
    return toast.error("This email is not authorized as an Admin.");
  }

  setLoading(true);
  try {
    await sendPasswordResetEmail(auth, trimmedEmail);
    toast.success("Password reset link sent! Check your inbox.");
    setIsForgot(false);
  } catch (err) {
    console.error("Reset error:", err);
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="container d-flex justify-content-center my-3 align-items-center" style={{ minHeight: "50vh" }}>
      <div className="card shadow-lg p-3 rounded-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center">
          {isForgot
            ? "Reset Password"
            : isSignup
              ? `${isAdminView ? "Admin" : "Student"} Signup`
              : `${isAdminView ? "Admin" : "Student"} Login`}
        </h2>

        {/* Email Input */}
        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="example@mail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {/* Password Inputs with Show/Hide */}
        {!isForgot && (
          <>
            {/* Password Field */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ borderColor: '#dee2e6' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field - Only for Signup */}
            {isSignup && (
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ borderColor: '#dee2e6' }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
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

        {/* Toggles */}
        {!isForgot && signupAllowed && (
          <div className="text-center">
            <button className="btn btn-link m-0" onClick={() => setIsSignup(!isSignup)}>
              {isSignup
                ? "Already have an account? Login"
                : `New ${isAdminView ? "admin" : "student"}? Signup`}
            </button>
          </div>
        )}

        {!isForgot && (
          <div className="text-center m-0">
            <button className="btn btn-link text-muted" onClick={() => setIsForgot(true)}>
              Forgot Password?
            </button>
          </div>
        )}

        {isForgot && (
          <div className="text-center m-0 ">
            <button className="btn btn-link" onClick={() => setIsForgot(false)}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}