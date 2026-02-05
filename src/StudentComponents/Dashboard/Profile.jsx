import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function StudentProfile() {
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    course: "",
    issueDate: "",
    photoUrl: "",
    mobile: "",
    email: "",
  });

  /* =======================
     FETCH STUDENT DATA FROM ADMISSIONS
  ======================= */
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        // Admission doc id = user.uid
        const ref = doc(db, "admissions", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setForm(snap.data());
        } else {
          toast.info("No admission record found for you");
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
     IMAGE UPLOAD (Cloudinary)
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

      setForm((p) => ({ ...p, photoUrl: data.secure_url }));
      toast.success("Profile photo updated");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setImgLoading(false);
    }
  };

  /* =======================
     SAVE STUDENT PROFILE
  ======================= */
  const saveProfile = async () => {
    setSaving(true);
    try {
      const ref = doc(db, "admissions", user.uid);

      await updateDoc(ref, {
        ...form
      });

      toast.success("Profile updated successfully");
      setEdit(false);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <p className="text-danger">Not logged in</p>;
  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: 420 }}>

        {/* PROFILE PHOTO */}
        <div className="text-center position-relative">
          <img
            src={form.photoUrl || "/images/icon/default-avatar.png"}
            alt="student"
            className="rounded-circle border"
            width="110"
            height="110"
          />

          {edit && (
            <label
              style={{
                position: "absolute",
                right: "38%",
                bottom: "0",
                cursor: "pointer",
                background: "#0d6efd",
                color: "#fff",
                padding: "6px 10px",
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
            label="Name"
            value={form.name}
            disabled={!edit}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <ProfileInput
            label="Father Name"
            value={form.fatherName}
            disabled={!edit}
            onChange={(v) => setForm({ ...form, fatherName: v })}
          />
          <ProfileInput
            label="Mother Name"
            value={form.motherName}
            disabled={!edit}
            onChange={(v) => setForm({ ...form, motherName: v })}
          />
          <ProfileInput
            label="Course"
            value={form.course}
            disabled={!edit}
            onChange={(v) => setForm({ ...form, course: v })}
          />
          <ProfileInput
            label="Issue Date"
            value={form.issueDate}
            disabled={!edit}
            onChange={(v) => setForm({ ...form, issueDate: v })}
          />
          <ProfileInput
            label="Mobile"
            value={form.mobile}
            disabled={!edit}
            onChange={(v) => setForm({ ...form, mobile: v })}
          />
          <ProfileInput
            label="Email"
            value={form.email}
            disabled
          />
        </div>

        {/* ACTIONS */}
        <div className="mt-4 d-flex gap-2">
          {!edit ? (
            <button className="btn btn-outline-primary w-100" onClick={() => setEdit(true)}>
              Edit Profile
            </button>
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
function ProfileInput({ label, value, disabled, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label small text-muted">{label}</label>
      <input
        className="form-control"
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
