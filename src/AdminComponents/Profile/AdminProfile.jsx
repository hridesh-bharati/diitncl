import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

export default function AdminProfile() {
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
    photoURL: ""
  });

  /* =======================
     FETCH OR CREATE ADMIN DATA
  ======================= */
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          if (data.role !== "admin") {
            toast.error("Unauthorized access");
            setLoading(false);
            return;
          }
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            about: data.about || "",
            photoURL: data.photoURL || ""
          });
        } else {
          const newData = {
            name: user.displayName || "",
            email: user.email,
            phone: "",
            about: "",
            photoURL: user.photoURL || "",
            role: "admin",
            createdAt: serverTimestamp()
          };
          await setDoc(ref, newData);
          setForm(newData);
        }
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  /* =======================
     IMAGE UPLOAD
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
          ...form,
          email: user.email,
          role: "admin",
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

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

  if (!user) return <p className="text-danger">Unauthorized</p>;
  if (loading) return <p>Loading profile...</p>;

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
            disabled
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
                Edit Profile
              </button>
              <button className="btn btn-warning w-100" onClick={resetPassword}>
                Forgot Password?
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-success w-100"
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button className="btn btn-secondary w-100" onClick={() => setEdit(false)}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================
   REUSABLE INPUT
====================== */
function ProfileInput({ label, value, disabled, onChange, textarea }) {
  return (
    <div className="mb-3">
      <label className="form-label small text-muted">{label}</label>
      {textarea ? (
        <textarea
          className="form-control"
          value={value || ""}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          rows={3}
        />
      ) : (
        <input
          className="form-control"
          value={value || ""}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </div>
  );
}
