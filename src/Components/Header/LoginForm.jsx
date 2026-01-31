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
      setCanSignup(false); // hide signup tab after creation
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
    <div className="p-4">
      <h4>{isForgot ? "Reset Password" : isSignup ? "Sign Up" : "Login"}</h4>

      <input
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {!isForgot && (
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      {isSignup && (
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      )}

      {!isForgot ? (
        <>
          <button
            className="btn btn-primary w-100 mb-2"
            onClick={isSignup ? signup : login}
          >
            {isSignup ? "Create Account" : "Login"}
          </button>

          <div className="d-flex justify-content-between mt-2">
            {canSignup && (
              <button className="btn btn-link p-0" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Back to Login" : "Sign Up"}
              </button>
            )}
            <button className="btn btn-link p-0" onClick={() => setIsForgot(true)}>
              Forgot?
            </button>
          </div>
        </>
      ) : (
        <>
          <button className="btn btn-warning w-100" onClick={forgot}>
            Send Reset Email
          </button>
          <button className="btn btn-link w-100" onClick={() => setIsForgot(false)}>
            Back
          </button>
        </>
      )}
    </div>
  );
}
