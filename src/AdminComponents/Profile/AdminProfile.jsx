import { useState, useEffect } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminProfile() {
  const { user, userProfile, isAdmin } = useAuth();
  const [loading, setLoading] = useState({ saving: false, img: false });
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", about: "", photoURL: "" });

  useEffect(() => {
    if (user || userProfile) {
      setForm({
        name: userProfile?.name || user?.displayName || "",
        phone: userProfile?.phone || "",
        about: userProfile?.about || "",
        photoURL: userProfile?.photoURL || user?.photoURL || ""
      });
    }
  }, [userProfile, user]);

  if (!user || !isAdmin) return <p className="text-center p-5 fw-bold text-danger">Unauthorized</p>;

  const getOptimizedUrl = (url) => {
    if (!url || !url.includes("cloudinary")) return url || "/images/icon/default-avatar.png";
    return url.replace("/upload/", "/upload/w_200,h_200,c_thumb,g_face,f_auto,q_auto/");
  };

  const uploadImg = async (file) => {
    if (!file) return;
    setLoading(p => ({ ...p, img: true }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "hridesh99!");
      fd.append("cloud_name", "draowpiml");
      const res = await fetch("https://api.cloudinary.com/v1_1/draowpiml/image/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        await updateDoc(doc(db, "users", user.uid), { photoURL: data.secure_url });
        await updateProfile(user, { photoURL: data.secure_url });
        toast.success("Photo Updated");
      }
    } catch (e) { toast.error("Upload failed"); }
    finally { setLoading(p => ({ ...p, img: false })); }
  };

  const saveProfile = async () => {
    setLoading(p => ({ ...p, saving: true }));
    try {
      await updateDoc(doc(db, "users", user.uid), { ...form, updatedAt: serverTimestamp() });
      await updateProfile(user, { displayName: form.name });
      setEdit(false);
      toast.success("Profile Saved");
    } catch (e) { toast.error(e.message); }
    finally { setLoading(p => ({ ...p, saving: false })); }
  };

  return (
    // ✅ mt-0 aur h-auto fix scroll issues on mobile
    <div className="container-fluid p-2 pt-5 d-flex align-items-center justify-content-center">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden w-100" style={{ maxWidth: 360 }}>

        {/* HEADER */}
        <div className="text-center p-3 bg-light border-bottom">
          <div className="position-relative d-inline-block">
            <img
              src={getOptimizedUrl(form.photoURL)}
              alt="profile"
              className="rounded-circle border border-3 border-white shadow-sm"
              style={{ width: 90, height: 90, objectFit: "cover" }}
            />
            {edit && (
              <label className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{ width: 28, height: 28, cursor: "pointer", border: "2px solid white" }}>
                {loading.img ? <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }}></span> : <i className="bi bi-camera-fill style={{fontSize: 12}}"></i>}
                <input type="file" hidden accept="image/*" onChange={e => uploadImg(e.target.files[0])} />
              </label>
            )}
          </div>
          <h6 className="mt-2 fw-bold mb-0 text-truncate">{form.name}</h6>
          <p className="text-muted small mb-0 text-truncate" style={{ fontSize: '11px' }}>{user.email}</p>
        </div>

        {/* BODY */}
        <div className="card-body px-3 py-2">
          <div className="vstack gap-1">
            <Field label="Name" val={form.name} edit={edit} on={v => setForm({ ...form, name: v })} />
            <Field label="About" val={form.about} edit={edit} on={v => setForm({ ...form, about: v })} textarea />
            <Field label="Phone" val={form.phone} edit={edit} on={v => setForm({ ...form, phone: v })} />
          </div>

          <div className="mt-3 mb-2 d-grid gap-2">
            {!edit ? (
              <button className="btn btn-dark rounded-pill btn-sm fw-bold py-2" onClick={() => setEdit(true)}>Edit Profile</button>
            ) : (
              <div className="d-flex gap-2">
                <button className="btn btn-success flex-grow-1 btn-sm rounded-pill fw-bold" onClick={saveProfile} disabled={loading.saving}>
                  {loading.saving ? "..." : "Save"}
                </button>
                <button className="btn btn-outline-secondary flex-grow-1 btn-sm rounded-pill fw-bold" onClick={() => setEdit(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, val, edit, on, textarea }) => (
  <div className="mb-1">
    <label className="text-uppercase text-muted fw-bold" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>{label}</label>
    {edit ? (
      textarea ? <textarea className="form-control form-control-sm border-0 bg-light rounded-2" value={val} onChange={e => on(e.target.value)} rows={1} style={{ fontSize: '13px' }} />
        : <input className="form-control form-control-sm border-0 bg-light rounded-2" value={val} onChange={e => on(e.target.value)} style={{ fontSize: '13px' }} />
    ) : (
      <div className="pb-1 border-bottom text-dark" style={{ fontSize: '13px', minHeight: '22px' }}>{val || `---`}</div>
    )}
  </div>
);