import { useState, useEffect } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { db, auth } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminProfile() {
  const { user, userProfile, isAdmin } = useAuth();
  const [loading, setLoading] = useState({ saving: false, img: false });
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
    photoURL: ""
  });

  // ✅ SYNC FORM WITH LIVE DATA: Mobile se update hote hi yahan dikhega
  useEffect(() => {
    if (user || userProfile) {
      setForm({
        name: userProfile?.name || user?.displayName || "",
        email: user?.email || "",
        phone: userProfile?.phone || "",
        about: userProfile?.about || "",
        photoURL: userProfile?.photoURL || user?.photoURL || ""
      });
    }
  }, [userProfile, user]);

  if (!user || !isAdmin) {
    return <p className="text-danger text-center py-5 fw-bold">Unauthorized Access</p>;
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const uploadImg = async (file) => {
    if (!file) return;
    setLoading(p => ({ ...p, img: true }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "hridesh99!");
      fd.append("cloud_name", "draowpiml");

      const res = await fetch("https://api.cloudinary.com/v1_1/draowpiml/image/upload", {
        method: "POST",
        body: fd
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);

      // Auto-save photo to DB for instant real-time update
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { photoURL: data.secure_url });
      await updateProfile(user, { photoURL: data.secure_url });

      toast.success("Profile photo updated everywhere!");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(p => ({ ...p, img: false }));
    }
  };

  const saveProfile = async () => {
    if (!form.name.trim()) return toast.error("Name cannot be empty");

    setLoading(p => ({ ...p, saving: true }));
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        name: form.name,
        phone: form.phone,
        about: form.about,
        updatedAt: serverTimestamp()
      });

      await updateProfile(user, { displayName: form.name });

      toast.success("Profile updated successfully");
      setEdit(false);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(p => ({ ...p, saving: false }));
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
      <div className="card shadow border-0 rounded-4 px-3 py-4 mb-5 mx-auto" style={{ maxWidth: 420 }}>

        {/* PROFILE PHOTO */}
        <div className="text-center position-relative mt-2">
          <img
            src={form.photoURL || "/images/icon/default-avatar.png"}
            className="rounded-circle border shadow-sm"
            width="120" height="120"
            style={{ objectFit: "cover" }}
            alt="admin"
          />
          {edit && (
            <label
              className="position-absolute shadow"
              style={{
                right: "35%", bottom: "0", cursor: "pointer",
                background: "#0d6efd", color: "#fff",
                padding: "8px 12px", borderRadius: "50%"
              }}
            >
              {loading.img ? "..." : <i className="bi bi-camera-fill"></i>}
              <input type="file" hidden accept="image/*" onChange={(e) => uploadImg(e.target.files[0])} />
            </label>
          )}
        </div>

        {/* DETAILS */}
        <div className="mt-4 vstack gap-1">
          <ProfileInput label="Admin Name" value={form.name} disabled={!edit} onChange={(v) => handleChange("name", v)} />
          <ProfileInput label="About Me" value={form.about} disabled={!edit} textarea onChange={(v) => handleChange("about", v)} />
          <ProfileInput label="Email" value={form.email} disabled />
          <ProfileInput label="Phone" value={form.phone} disabled={!edit} onChange={(v) => handleChange("phone", v)} />
        </div>

        {/* ACTIONS */}
        <div className="mt-4 d-flex gap-2 flex-column">
          {!edit ? (
            <>
              <button className="btn btn-primary py-2" onClick={() => setEdit(true)}>
                <i className="bi bi-pencil-square me-2"></i>Edit Profile
              </button>
              <button className="btn btn-outline-warning py-2" onClick={resetPassword}>
                <i className="bi bi-key me-2"></i>Reset Password
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-success py-2" onClick={saveProfile} disabled={loading.saving}>
                {loading.saving ? "Saving..." : "Save Changes"}
              </button>
              <button className="btn btn-light py-2" onClick={() => setEdit(false)}>Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileInput({ label, value, disabled, onChange, textarea }) {
  const props = {
    className: `form-control ${disabled ? "bg-light border-0" : ""}`,
    value: value || "",
    disabled,
    onChange: (e) => onChange?.(e.target.value),
    placeholder: `Enter ${label.toLowerCase()}`
  };
  return (
    <div className="mb-3 text-start">
      <label className="form-label small text-muted fw-bold mb-1">{label}</label>
      {textarea ? <textarea {...props} rows={2} /> : <input {...props} />}
    </div>
  );
}