import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  loginWithEmail,
  signupWithEmail,
  resetPassword,
  getUserRole
} from "../../firebase/auth";
import { auth } from "../../firebase/firebase";

export default function LoginForm({ isAdminView, onSuccess, hideSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  const navigate = useNavigate();
  const roleExpected = isAdminView ? "admin" : "student";
  const [canSignup, setCanSignup] = useState(!hideSignup);

  useEffect(() => {
    setCanSignup(!hideSignup);
    setIsSignup(false);
  }, [hideSignup]);

  const login = async () => {
    try {
      await loginWithEmail(email, password);
      const role = await getUserRole(auth.currentUser.uid);

      if (role !== roleExpected) {
        await auth.signOut();
        toast.error(`Unauthorized: This is not a ${roleExpected} account`);
        return;
      }

      toast.success("Login successful");
      onSuccess?.();
      navigate(role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const signup = async () => {
    if (password !== confirm) return toast.error("Passwords do not match");
    try {
      await signupWithEmail(email, password, roleExpected);
      toast.success("Account created successfully");
      setCanSignup(false);
      setIsSignup(false);
      onSuccess?.();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const forgot = async () => {
    try {
      await resetPassword(email);
      toast.success("Reset email sent! Check your inbox.");
      setIsForgot(false);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "40vh" }}>
      {/* Android Style Card */}
      <div className="card border-0 shadow-lg p-4 rounded-4" style={{ maxWidth: "400px", width: "100%" }}>
        
        <div className="text-center mb-4">
          <h2 className="fw-bold">{isForgot ? "Reset" : isSignup ? "Join Us" : "Welcome"}</h2>
          <p className="text-muted small">
            {isForgot ? "Recovery link will be sent to your email" : "Please enter your details"}
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-semibold text-secondary ms-2">Email Address</label>
          <input
            type="email"
            className="form-control form-control-lg rounded-pill border-2"
            placeholder="name@example.com"
            style={{ fontSize: "0.9rem" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {!isForgot && (
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary ms-2">Password</label>
            <input
              type="password"
              className="form-control form-control-lg rounded-pill border-2"
              placeholder="••••••••"
              style={{ fontSize: "0.9rem" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        {isSignup && (
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary ms-2">Confirm Password</label>
            <input
              type="password"
              className="form-control form-control-lg rounded-pill border-2"
              placeholder="••••••••"
              style={{ fontSize: "0.9rem" }}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        )}

        {!isForgot ? (
          <>
            <button
              className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm mb-3 py-2 fw-bold"
              onClick={isSignup ? signup : login}
            >
              {isSignup ? "Create Account" : "Sign In"}
            </button>

            <div className="text-center mt-2">
              {canSignup && (
                <button className="btn btn-link btn-sm text-decoration-none fw-semibold" onClick={() => setIsSignup(!isSignup)}>
                  {isSignup ? "Already have an account? Login" : "New here? Create account"}
                </button>
              )}
              <div className="mt-1">
                <button className="btn btn-link btn-sm text-muted text-decoration-none" onClick={() => setIsForgot(true)}>
                  Forgot Password?
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <button className="btn btn-dark btn-lg w-100 rounded-pill mb-3 py-2 fw-bold" onClick={forgot}>
              Send Reset Link
            </button>
            <button className="btn btn-link btn-sm text-decoration-none" onClick={() => setIsForgot(false)}>
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}