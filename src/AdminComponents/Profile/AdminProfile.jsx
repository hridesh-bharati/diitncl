import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminProfile() {
  const { user, userProfile, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: userProfile?.name || user?.displayName || "",
    email: user?.email || "",
    phone: userProfile?.phone || "",
    about: userProfile?.about || "",
    photoURL: userProfile?.photoURL || user?.photoURL || ""
  });

  // Check if admin
  if (!user || !isAdmin) {
    return <p className="text-danger text-center py-5">Unauthorized Access</p>;
  }

  /* =======================
     IMAGE UPLOAD - Cloudinary
  ======================= */
  const uploadImg = async (file) => {
    if (!file) return;
    setImgLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "hridesh99!");
      fd.append("cloud_name", "draowpiml");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/draowpiml/image/upload",
        { method: "POST", body: fd }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);

      setForm(p => ({ ...p, photoURL: data.secure_url }));
      toast.success("Profile photo updated");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setImgLoading(false);
    }
  };

  /* =======================
     SAVE PROFILE
  ======================= */
  const saveProfile = async () => {
    if (!form.name) return toast.error("Name cannot be empty");

    setSaving(true);
    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(
        ref,
        {
          name: form.name,
          phone: form.phone,
          about: form.about,
          photoURL: form.photoURL,
          email: user.email,
          role: "admin",
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: form.name,
        photoURL: form.photoURL
      });

      toast.success("Profile updated successfully");
      setEdit(false);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container mt-1">
      <div className="card shadow rounded-4 px-3 pt-0 mb-5 pb-5 mx-auto" style={{ maxWidth: 420 }}>

        {/* PROFILE PHOTO */}
        <div className="text-center position-relative mt-3">
          <img
            src={form.photoURL || "/images/icon/default-avatar.png"}
            className="rounded-circle border"
            width="110"
            height="110"
            style={{ objectFit: "cover" }}
            alt="admin"
          />
          {edit && (
            <label
              style={{
                position: "absolute",
                right: "38%",
                bottom: "0",
                cursor: "pointer",
                background: "#3988ffff",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "50%"
              }}
            >
              {imgLoading ? "..." : "+"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => uploadImg(e.target.files[0])}
              />
            </label>
          )}
        </div>

        {/* DETAILS */}
        <div className="mt-4">
          <ProfileInput
            label="Admin Name"
            value={form.name}
            disabled={!edit}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <ProfileInput
            label="About Me"
            value={form.about}
            disabled={!edit}
            onChange={(v) => setForm({ ...form, about: v })}
            textarea
          />

          <ProfileInput
            label="Email"
            value={form.email}
            disabled={true}
          />

          <ProfileInput
            label="Phone"
            value={form.phone}
            disabled={!edit}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
        </div>

        {/* ACTIONS */}
        <div className="mt-4 d-flex gap-2 flex-column">
          {!edit ? (
            <>
              <button className="btn btn-outline-primary w-100" onClick={() => setEdit(true)}>
                <i className="bi bi-pencil-square me-2"></i>Edit Profile
              </button>
              <button className="btn btn-warning w-100" onClick={resetPassword}>
                <i className="bi bi-key me-2"></i>Reset Password
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-success w-100"
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>Save Changes
                  </>
                )}
              </button>
              <button className="btn btn-secondary w-100" onClick={() => setEdit(false)}>
                <i className="bi bi-x-circle me-2"></i>Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================
   REUSABLE INPUT COMPONENT
======================= */
function ProfileInput({ label, value, disabled, onChange, textarea }) {
  return (
    <div className="mb-3">
      <label className="form-label small text-muted fw-semibold">{label}</label>
      {textarea ? (
        <textarea
          className="form-control"
          value={value || ""}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          rows={2}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <input
          type={label === "Email" ? "email" : "text"}
          className="form-control"
          value={value || ""}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </div>
  );
}