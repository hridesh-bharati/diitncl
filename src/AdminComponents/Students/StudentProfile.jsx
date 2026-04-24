// src\AdminComponents\Students\StudentProfile.jsx
import React, { useMemo, useState, useEffect, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AdmissionProvider from "../Admissions/AdmissionProvider";

const safe = (val) => (val && val !== "undefined" && val !== "" ? val : "—");
const getShortReg = (val) => (val && typeof val === "string" ? val.split("/").pop() : val);

// --- PREMIUM NATIVE ROW ---
const InfoRow = memo(({ label, value, isEditing, onChange, type = "text", icon, color, fieldKey }) => (
  <div className="col-12 col-md-6 mb-2">
    <div className="d-flex align-items-center p-3 rounded-2 bg-white shadow-sm border-0 transition-all">
      <div className="rounded-2 d-flex align-items-center justify-content-center me-3"
        style={{ width: '42px', height: '42px', background: `linear-gradient(135deg, ${color}15, ${color}30)`, border: `1px solid ${color}20` }}>
        <i className={`bi ${icon} fs-5`} style={{ color }}></i>
      </div>
      <div className="flex-grow-1 overflow-hidden">
        <small className="text-muted d-block fw-bold text-uppercase mb-0" style={{ fontSize: '9px', letterSpacing: '0.8px' }}>{label}</small>
        {isEditing ? (
          <input
            type={type}
            className="form-control form-control-sm border-0 border-bottom bg-transparent rounded-0 shadow-none p-0 fw-bold text-dark w-100"
            style={{ borderBottom: `2px solid ${color}50` }}
            value={fieldKey === "regNo" ? getShortReg(value) : (value || "")}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <span className="fw-bold text-dark text-truncate d-block" style={{ fontSize: '0.92rem' }}>
            {fieldKey === "regNo" ? getShortReg(value) : safe(value)}
          </span>
        )}
      </div>
    </div>
  </div>
));

const StatBox = memo(({ label, value, icon, color, isEditing, onChange, type = "text" }) => (
  <div className="col-4 px-1">
    <div className="p-3 text-center h-100 rounded-2 bg-white shadow-sm border-0">
      <i className={`bi ${icon} fs-4 mb-1 d-block`} style={{ color }}></i>
      <small className="text-muted fw-bold d-block mb-1" style={{ fontSize: '9px' }}>{label}</small>
      {isEditing ? (
        <input
          type={type}
          className="form-control form-control-sm border-0 text-center bg-light p-0 shadow-none fw-bold"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span className="fw-bold text-dark small d-block">{safe(value)}</span>
      )}
    </div>
  </div>
));

const ProfileContent = ({ admissions, loading, error }) => {
  const { id: emailParam } = useParams();
  const navigate = useNavigate();

  const student = useMemo(
    () => admissions?.find((a) => a.email?.toLowerCase() === emailParam?.toLowerCase()),
    [admissions, emailParam]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => { if (student) setFormData(student); }, [student]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => {
      let newData = { ...prev };
      const parts = (prev.regNo || "").split("/");

      if (field === "regNo") {
        if (parts.length === 3) newData.regNo = `${parts[0]}/${parts[1]}/${value}`;
        else newData.regNo = value;
      }
      else if (field === "course") {
        newData.course = value;
        if (parts.length === 3) {
          const courseCode = value.replace(/\s+/g, "").toUpperCase().slice(0, 10);
          newData.regNo = `${parts[0]}/${courseCode}/${parts[2]}`;
        }
      }
      else if (field === "branch") {
        newData.branch = value;
        if (parts.length === 3) {
          const branchCode = value.replace(/\s+/g, "").toUpperCase().slice(0, 10);
          newData.regNo = `${branchCode}/${parts[1]}/${parts[2]}`;
        }
      }
      else { newData[field] = value; }
      return newData;
    });
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let updatedData = { ...formData };
      const oldId = student.email.toLowerCase().trim();
      const newId = updatedData.email.toLowerCase().trim();

      if (selectedImage) {
        const fd = new FormData();
        fd.append("file", selectedImage);
        fd.append("upload_preset", "hridesh99!");
        const res = await fetch("https://api.cloudinary.com/v1_1/draowpiml/image/upload", { method: "POST", body: fd });
        const img = await res.json();
        updatedData.photoUrl = img.secure_url;
      }

      if (oldId !== newId) {
        await setDoc(doc(db, "admissions", newId), updatedData);
        await deleteDoc(doc(db, "admissions", oldId));
        navigate(`/admin/students/${newId}`, { replace: true });
      } else {
        await updateDoc(doc(db, "admissions", oldId), updatedData);
      }
      toast.success("Profile Updated!");
      setIsEditing(false);
    } catch (err) { toast.error("Save Failed!"); } finally { setIsSaving(false); }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center bg-light"><div className="spinner-border text-primary"></div></div>;
  if (error || !student) return <div className="vh-100 d-flex justify-content-center align-items-center bg-light"><div className="bg-white p-5 rounded-2 text-center shadow-sm"><h4>Not Found</h4><button className="btn btn-primary rounded-pill mt-3" onClick={() => navigate(-1)}>Back</button></div></div>;

  const fields = [
    { label: "Branch", fKey: "branch", icon: "bi-building-gear", color: "#FF5722" },
    { label: "Course", fKey: "course", icon: "bi-book-half", color: "#673AB7" },
    { label: "Reg No", fKey: "regNo", icon: "bi-card-list", color: "#212121" },
    { label: "Name", fKey: "name", icon: "bi-person-vcard-fill", color: "#009688" },
    { label: "Gender", fKey: "gender", icon: "bi-gender-ambiguous", color: "#2196F3" },
    { label: "Date of Birth", fKey: "dob", icon: "bi-calendar-event", color: "#FF9800", type: "date" },
    { label: "Father's Name", fKey: "fatherName", icon: "bi-person-badge", color: "#3F51B5" },
    { label: "Mother's Name", fKey: "motherName", icon: "bi-person-badge", color: "#E91E63" },
    { label: "Mobile", fKey: "mobile", icon: "bi-telephone-fill", color: "#4CAF50" },
    { label: "Email", fKey: "email", icon: "bi-envelope-at", color: "#F44336" },
    { label: "Aadhar", fKey: "aadharNo", icon: "bi-fingerprint", color: "#607D8B" },
  ];

  return (
    <div className="pb-5 min-vh-100 bg-PRIMARY-SUBTLE">
      {/* --- TOP APP BAR --- */}
      <div className="sticky-top p-3 d-flex align-items-center justify-content-between z-3 shadow-sm bg-white bg-opacity-75" style={{ backdropFilter: 'blur(15px)' }}>
        <div className="d-flex align-items-center">
          <button className="btn btn-light rounded-circle me-3 border-0 shadow-sm" onClick={() => navigate(-1)}><i className="bi bi-chevron-left"></i></button>
          <h6 className="mb-0 fw-bold text-dark">Profile Manager</h6>
        </div>
        {!isEditing ? (
          <button className="btn btn-primary rounded-pill px-4 btn-sm fw-bold shadow-sm" onClick={() => setIsEditing(true)}>Edit</button>
        ) : (
          <div className="d-flex gap-2">
            <button className="btn btn-light rounded-pill btn-sm px-3 border-0 shadow-sm" onClick={() => { setIsEditing(false); setFormData(student); }}>Cancel</button>
            <button className="btn btn-success rounded-pill btn-sm px-4 fw-bold shadow-sm" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
          </div>
        )}
      </div>

      <div className="container mt-2">
        {/* --- HEADER IDENTITY CARD --- */}
        <div className="rounded-2 shadow-lg overflow-hidden position-relative mb-3 border-0" style={{ background: 'linear-gradient(45deg, #0f172a, #2563eb)' }}>
          <div className="p-4 text-center text-white position-relative z-2">
            <div className="position-relative d-inline-block mb-3">
              <img src={formData.photoUrl || "https://placehold.co/150x150?text=No+Image"}
                className="rounded-circle border border-4 border-white shadow-lg" style={{ width: 110, height: 110, objectFit: "cover" }} alt="User" />
              {isEditing && (
                <label htmlFor="pInp" className="position-absolute bottom-0 end-0 bg-white text-primary rounded-circle p-2 shadow-sm" style={{ cursor: "pointer" }}>
                  <i className="bi bi-camera-fill"></i>
                  <input type="file" id="pInp" hidden onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size <= 300 * 1024) { setSelectedImage(file); setFormData(p => ({ ...p, photoUrl: URL.createObjectURL(file) })); }
                    else { toast.error("Too large (Max 300KB)"); }
                  }} />
                </label>
              )}
            </div>
            <h2 className="fw-bold mb-1">{safe(formData.name)}</h2>
            <p className="opacity-75 small mb-3">{safe(formData.course)} | {safe(formData.branch)}</p>
            <div className="d-flex justify-content-center gap-2">
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 shadow-sm small">ID: {safe(formData.regNo)}</span>
              <span className="badge bg-warning text-dark rounded-pill px-3 py-2 shadow-sm small">{safe(formData.status)}</span>
            </div>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="row g-2 mb-3">
          <StatBox label="PERC%" value={formData.percentage} icon="bi-graph-up-arrow" color="#4CAF50" isEditing={isEditing} onChange={(val) => handleChange("percentage", val)} />
          <StatBox label="ADMISSION" value={formData.admissionDate} icon="bi-calendar-check" color="#2196F3" isEditing={isEditing} onChange={(val) => handleChange("admissionDate", val)} type="date" />
          <StatBox label="ISSUE" value={formData.issueDate} icon="bi-award" color="#FF9800" isEditing={isEditing} onChange={(val) => handleChange("issueDate", val)} type="date" />
        </div>

        {/* --- QUICK ACTION BUTTONS --- */}
        <div className="row g-2 mb-4 text-center">
          {[
            { label: 'CERTIFICATE', icon: 'bi-patch-check-fill', color: '#673AB7', link: 'certificate', disabled: formData.certificateDisabled },
            { label: 'FEES REPORT', icon: 'bi-currency-exchange', color: '#00C853', link: 'fees', state: { studentData: formData } },
            { label: 'EXAM DATA', icon: 'bi-file-earmark-medical-fill', color: '#FFD600', link: 'test-records' }
          ].map((action, i) => (
            <div className="col-4" key={i}>
              <button className="btn btn-white w-100 py-3 rounded-2 shadow-sm border-0 bg-white" 
                onClick={() => !action.disabled && navigate(`/admin/students/${formData.email}/${action.link}`, { state: action.state })}>
                <i className={`bi ${action.disabled ? 'bi-lock-fill text-danger' : action.icon} fs-4 d-block`} style={{ color: action.disabled ? '' : action.color }}></i>
                <span className="fw-bold text-dark" style={{ fontSize: '10px' }}>{action.label}</span>
              </button>
            </div>
          ))}
        </div>

        {/* --- DATA SECTIONS --- */}
        <div className="rounded-2 bg-white shadow-sm p-4 mb-3 border-0">
          <p className="fw-bold text-primary mb-3 small"><i className="bi bi-person-circle me-1"></i> PERSONAL DATA</p>
          <div className="row g-1">
            {fields.map((f) => <InfoRow key={f.fKey} {...f} fieldKey={f.fKey} value={formData[f.fKey]} isEditing={isEditing} onChange={(v) => handleChange(f.fKey, v)} />)}
          </div>
        </div>

        <div className="rounded-2 bg-white shadow-sm p-4 mb-3 border-0">
          <p className="fw-bold text-primary mb-3 small"><i className="bi bi-geo-alt-fill me-1"></i> COMMUNICATION ADDRESS</p>
          <div className="row g-3">
            {["village", "post", "thana", "city", "state", "pincode"].map((k) => (
              <div className="col-6 col-md-4" key={k}>
                <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '9px' }}>{k}</small>
                {isEditing ? (
                  <input className="form-control form-control-sm border-0 border-bottom bg-light shadow-none" value={formData[k] || ""} onChange={(e) => handleChange(k, e.target.value)} />
                ) : (
                  <span className="fw-bold text-dark d-block mt-1 small">{safe(formData[k])}</span>
                )}
              </div>
            ))}
            <div className="col-12 mt-2 pt-2 border-top border-light">
              <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '9px' }}>Full Address String</small>
              {isEditing ? (
                <textarea rows={3} className="form-control bg-light border-0 rounded-2 mt-1 fw-bold shadow-none" value={formData.address || ""} onChange={(e) => handleChange("address", e.target.value)} />
              ) : (
                <p className="text-dark fw-bold mb-0 mt-1 small">{safe(formData.address)}</p>
              )}
            </div>
          </div>
        </div>

        {/* --- STATUS TOGGLE --- */}
        <div className="rounded-2 shadow-sm p-3 mb-5 border-0 d-flex align-items-center justify-content-between"
          style={{ background: formData.certificateDisabled ? 'linear-gradient(to right, #FFF5F5, #FFFFFF)' : 'linear-gradient(to right, #F5FFF5, #FFFFFF)' }}>
          <div className="d-flex align-items-center">
            <div className={`p-3 rounded-2 me-3 shadow-sm ${formData.certificateDisabled ? 'bg-danger text-white' : 'bg-success text-white'}`}>
              <i className={`bi ${formData.certificateDisabled ? 'bi-shield-slash-fill' : 'bi-shield-check'} fs-4`}></i>
            </div>
            <div className="overflow-hidden">
              <h6 className="fw-bold mb-0 small">Certificate  Portal</h6>
              <small className={`${formData.certificateDisabled ? 'text-danger' : 'text-success'} fw-bold`} style={{ fontSize: '10px' }}>
                {formData.certificateDisabled ? 'CERTIFICATE IS LOCKED' : 'CERTIFICATE IS ACTIVE'}
              </small>
            </div>
          </div>
          <div className="form-check form-switch fs-3">
            <input className="form-check-input shadow-none" type="checkbox" role="switch" checked={!formData.certificateDisabled}
              onChange={async () => {
                const ns = !formData.certificateDisabled;
                try {
                  await updateDoc(doc(db, "admissions", student.email.toLowerCase()), { certificateDisabled: ns });
                  setFormData(p => ({ ...p, certificateDisabled: ns }));
                  toast.success(`Portal ${ns ? 'Enabled' : 'Disabled'}`);
                } catch (e) { toast.error("Update Failed"); }
              }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StudentProfile() {
  return <AdmissionProvider>{(data) => <ProfileContent {...data} />}</AdmissionProvider>;
}