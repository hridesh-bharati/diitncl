import React, { useState } from "react";
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "./Form.css";

const COURSES = ["ADCA+", "ADCA", "DCAA", "DCA", "TALLY", "CCC", "CAC", "CCA", "O LEVEL"];

export default function AdmissionForm() {
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", fatherName: "", motherName: "",
    course: "", issueDate: "", photoUrl: "",
    mobile: "", email: "",
  });

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

      setForm(p => ({ ...p, photoUrl: data.secure_url }));
      toast.success("Photo Uploaded!");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setImgLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.photoUrl) return toast.error("Please upload student photo");

    setLoading(true);
    try {
      await addDoc(collection(db, "admissions"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      toast.success("Admission Successful!");
      setForm({
        name: "", fatherName: "", motherName: "",
        course: "", issueDate: "", photoUrl: "",
        mobile: "", email: "",
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-app-bg">
      <div className="container p-0 mt-5">
        <div className="app-card card mx-auto p-2 p-md-4 m-0">

          {/* Avatar Upload */}
          <div className="avatar-container">
            <img
              src={form.photoUrl || "https://www.w3schools.com/howto/img_avatar.png"}
              className="avatar-preview"
              alt=""
            />
            <label className="upload-badge">
              {imgLoading ? "..." : "+"}
              <input type="file" hidden onChange={e => uploadImg(e.target.files[0])} />
            </label>
          </div>

          <h5 className="text-center fw-bold mb-3">Student Registration</h5>

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12 form-floating">
              <input className="form-control" placeholder="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
              <label>Student Name</label>
            </div>

            <div className="col-6 form-floating">
              <input className="form-control" placeholder="Father"
                value={form.fatherName}
                onChange={e => setForm({ ...form, fatherName: e.target.value })} required />
              <label>Father</label>
            </div>

            <div className="col-6 form-floating">
              <input className="form-control" placeholder="Mother"
                value={form.motherName}
                onChange={e => setForm({ ...form, motherName: e.target.value })} required />
              <label>Mother</label>
            </div>

            <div className="col-6 form-floating">
              <select className="form-select"
                value={form.course}
                onChange={e => setForm({ ...form, course: e.target.value })} required>
                <option value="">Select</option>
                {COURSES.map(c => <option key={c}>{c}</option>)}
              </select>
              <label>Course</label>
            </div>

            <div className="col-6 form-floating">
              <input type="date" className="form-control"
                value={form.issueDate}
                onChange={e => setForm({ ...form, issueDate: e.target.value })} required />
              <label>Issue Date</label>
            </div>

            <div className="col-12 col-md-6 form-floating">
              <input className="form-control" placeholder="Mobile"
                value={form.mobile}
                onChange={e => setForm({ ...form, mobile: e.target.value })} required />
              <label>Mobile</label>
            </div>

            <div className="col-12 col-md-6 form-floating">
              <input className="form-control" placeholder="Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
              <label>Email</label>
            </div>

            <div className="col-12">
              <button className="btn btn-primary w-100 submit-btn" disabled={loading}>
                {loading ? "Saving..." : "SUBMIT"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
