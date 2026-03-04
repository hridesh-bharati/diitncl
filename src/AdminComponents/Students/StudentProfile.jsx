import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"; // Imports added
import { db } from "../../firebase/firebase";
import AdmissionProvider from "../Admissions/AdmissionProvider";

const safe = (val) => (val && val !== "undefined" && val !== "" ? val : "—");

// --- MINI COMPONENTS ---
const InfoRow = ({ label, value, isEditing, onChange, type = "text", icon, color }) => (
  <div className="col-12 col-md-6 mb-3">
    <div className="d-flex align-items-center p-2 rounded-4">
      {icon && (
        <div className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" 
             style={{ width: '45px', height: '45px', backgroundColor: `${color}15`, border: `1px solid ${color}35` }}>
          <i className={`bi ${icon} fs-5`} style={{ color }}></i>
        </div>
      )}
      <div className="flex-grow-1">
        <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '10px' }}>{label}</small>
        {isEditing ? (
          <input 
            type={type} 
            className="form-control form-control-sm border-0 bg-white mt-1 shadow-none" 
            style={{ backgroundColor: 'rgba(255,255,255,0.8)', borderBottom: `2px solid ${color}` }}
            value={value || ""} 
            onChange={(e) => onChange(e.target.value)} 
          />
        ) : (
          <span className="fw-bold text-dark">{safe(value)}</span>
        )}
      </div>
    </div>
  </div>
);

const StatBox = ({ label, value, icon, colorClass, isEditing, onChange, type = "text" }) => (
  <div className="col-4">
    <div className="glass-panel p-3 text-center border-0 h-100 shadow-sm rounded-3 bg-white bg-opacity-50">
      <i className={`bi ${icon} ${colorClass} fs-4 mb-1 d-block`}></i>
      <small className="text-muted fw-bold d-block" style={{ fontSize: '9px' }}>{label}</small>
      {isEditing ? (
        <input 
          type={type} 
          className="form-control form-control-sm mt-1 border-0 text-center bg-white p-0 shadow-none small" 
          value={value || ""} 
          onChange={(e) => onChange(e.target.value)} 
        />
      ) : (
        <span className="fw-bold text-dark small">{safe(value)}</span>
      )}
    </div>
  </div>
);

// --- PROFILE CONTENT ---
const ProfileContent = ({ admissions, loading, error }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = useMemo(() => admissions?.find((a) => String(a.id) === String(id)), [admissions, id]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => { if (student) setFormData(student); }, [student]);
  
  useEffect(() => {
    return () => { if (formData.photoUrl?.startsWith('blob:')) URL.revokeObjectURL(formData.photoUrl); };
  }, [formData.photoUrl]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 300 * 1024) {
      setSelectedImage(file);
      setFormData(prev => ({ ...prev, photoUrl: URL.createObjectURL(file) }));
    } else {
      toast.error("Image size must be < 300KB");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let updatedData = { ...formData };

      // 🔥 Duplicate RegNo Check
      if (formData.regNo && formData.regNo !== student.regNo) {
        const q = query(collection(db, "admissions"), where("regNo", "==", formData.regNo.trim()));
        const snap = await getDocs(q);
        if (!snap.empty) {
          toast.error("Registration Number already exists!");
          setIsSaving(false);
          return;
        }
        updatedData.regNo = formData.regNo.trim();
      }

      if (selectedImage) {
        const fd = new FormData();
        fd.append("file", selectedImage);
        fd.append("upload_preset", "hridesh99!");
        const res = await fetch("https://api.cloudinary.com/v1_1/draowpiml/image/upload", { method: "POST", body: fd });
        const data = await res.json();
        updatedData.photoUrl = data.secure_url;
      }

      await updateDoc(doc(db, "admissions", student.id), updatedData);
      toast.success("Profile Updated");
      setIsEditing(false);
      setSelectedImage(null);
    } catch (err) {
      toast.error("Update Failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center win11-bg">
      <div className="spinner-grow text-primary" role="status"></div>
    </div>
  );

  if (error || !student) return (
    <div className="win11-bg vh-100 d-flex flex-column align-items-center justify-content-center p-5">
      <h5 className="glass-panel p-4 mb-3 bg-white rounded shadow-sm">Not Found</h5>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>Back</button>
    </div>
  );

  const fields = [
    { label: "Registration No", key: "regNo", icon: "bi-card-list", color: "#000000" }, // Added here
    { label: "Father Name", key: "fatherName", icon: "bi-person-badge-fill", color: "#3F51B5" },
    { label: "Mother Name", key: "motherName", icon: "bi-person-badge-fill", color: "#E91E63" },
    { label: "Mobile", key: "mobile", icon: "bi-telephone-fill", color: "#4CAF50" },
    { label: "Email", key: "email", icon: "bi-envelope-at-fill", color: "#F44336" },
    { label: "Aadhar No", key: "aadharNo", icon: "bi-fingerprint", color: "#009688" },
    { label: "Qualification", key: "qualification", icon: "bi-mortarboard-fill", color: "#FF9800" },
    { label: "DOB", key: "dob", icon: "bi-calendar-event-fill", color: "#673AB7", type: "date" },
    { label: "Gender", key: "gender", icon: "bi-gender-ambiguous", color: "#2196F3" },
    { label: "Category", key: "category", icon: "bi-tags-fill", color: "#795548" },
  ];

  return (
    <div className="win11-bg min-vh-100 pb-5 p-lg-2">
      <div className="glass-panel p-3 d-flex align-items-center justify-content-between mx-2 shadow-sm border-0 bg-white bg-opacity-75" style={{ backdropFilter: 'blur(10px)', borderRadius: '15px' }}>
        <div className="d-flex align-items-center">
          <button className="btn btn-light rounded-circle p-2 me-3 border-0 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }} onClick={() => navigate(-1)}>
            <i className="bi bi-chevron-left fw-bold"></i>
          </button>
          <h6 className="mb-0 fw-bold text-primary">Student Profile</h6>
        </div>
        <div className="d-flex gap-2">
          {!isEditing ? (
            <button className="btn btn-primary border-0 rounded-pill px-4 fw-bold shadow-sm" onClick={() => setIsEditing(true)}>Edit</button>
          ) : (
            <>
              <button className="btn btn-light rounded-pill px-3 border-0" onClick={() => { setIsEditing(false); setFormData(student); }}>Cancel</button>
              <button className="btn btn-primary border-0 rounded-pill px-4 fw-bold shadow" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <span className="spinner-border spinner-border-sm"></span> : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="container mt-4" style={{ maxWidth: '850px' }}>
        {/* HERO CARD */}
        <div className="glass-card p-4 mb-4 border-0 text-center bg-white bg-opacity-50 rounded-4 shadow-sm">
          <div className="position-relative d-inline-block mx-auto mb-3">
            <img src={formData.photoUrl || `https://ui-avatars.com/api/?name=${formData.name}&background=000075&color=fff&bold=true`} 
                 className="rounded-circle border border-4 border-white shadow-lg" 
                 style={{ width: 130, height: 130, objectFit: "cover" }} 
                 alt="Avatar" />
            {isEditing && (
              <label htmlFor="pInp" className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 border border-2 border-white shadow" style={{ cursor: "pointer", width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-camera-fill"></i>
                <input type="file" id="pInp" hidden onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>
          <h3 className="fw-bold mb-1" style={{ color: "rgb(0, 0, 117)" }}>{safe(formData.name)}</h3>
          <p className="text-secondary fw-medium fs-5 mb-3">{safe(formData.course)}</p>
          <div className="d-flex justify-content-center gap-2">
            {/* Displaying Real-time RegNo update */}
            <span className="badge rounded-pill bg-primary px-3 py-2 shadow-sm">ID: {safe(formData.regNo)}</span>
            <span className="badge rounded-pill bg-white text-dark border px-3 py-2 shadow-sm">{safe(formData.status)}</span>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <StatBox label="PERCENTAGE" value={formData.percentage} icon="bi-graph-up-arrow" colorClass="text-success" isEditing={isEditing} onChange={(val) => handleChange("percentage", val)} />
          <StatBox label="ADMISSION" value={formData.admissionDate} icon="bi-calendar-check" colorClass="text-primary" isEditing={isEditing} onChange={(val) => handleChange("admissionDate", val)} type="date" />
          <StatBox label="ISSUE DATE" value={formData.issueDate} icon="bi-award" colorClass="text-warning" isEditing={isEditing} onChange={(val) => handleChange("issueDate", val)} type="date" />
        </div>

        <h6 className="fw-bold text-dark opacity-75 mb-3 ps-2">PERSONAL INFORMATION</h6>
        <div className="glass-card p-3 mb-4 border-0 bg-white bg-opacity-50 rounded-4 shadow-sm">
          <div className="row g-0">
            {fields.map((f) => (
              <InfoRow key={f.key} {...f} value={formData[f.key]} isEditing={isEditing} onChange={(val) => handleChange(f.key, val)} />
            ))}
          </div>
        </div>

        <h6 className="fw-bold text-dark opacity-75 mb-3 ps-2">ADDRESS DETAILS</h6>
        <div className="glass-card p-4 mb-4 border-0 border-start border-4 border-primary shadow-sm bg-white bg-opacity-50 rounded-4">
          <div className="row g-3">
            {["village", "post", "thana", "city", "state", "pincode"].map((key) => (
              <div className="col-6 col-md-4" key={key}>
                <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '9px' }}>{key}</small>
                {isEditing ? 
                  <input className="form-control form-control-sm border-0 bg-white mt-1 p-1 shadow-none" value={formData[key] || ""} onChange={(e) => handleChange(key, e.target.value)} /> 
                  : <span className="fw-bold text-dark small">{safe(formData[key])}</span>
                }
              </div>
            ))}
            <div className="col-12 mt-3 pt-3 border-top">
              <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '9px' }}>Full Address</small>
              {isEditing ? 
                <textarea rows={2} className="form-control border-0 bg-white mt-1 shadow-none" value={formData.address || ""} onChange={(e) => handleChange("address", e.target.value)} /> 
                : <p className="small text-dark fw-medium mb-0 mt-1">{safe(formData.address)}</p>
              }
            </div>
          </div>
        </div>

        <div className="glass-card p-3 mb-5 border-0 shadow-sm bg-white bg-opacity-50 rounded-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className={`p-3 rounded-circle me-3 ${formData.certificateDisabled ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-danger text-success'}`}>
                <i className={`bi ${formData.certificateDisabled ? 'bi-shield-slash' : 'bi-shield-check'} fs-4`}></i>
              </div>
              <div>
                <h6 className="fw-bold mb-0">Certificate Portal</h6>
                <small className="text-muted">{formData.certificateDisabled ? 'Locked' : 'Active'}</small>
              </div>
            </div>
            <div className="form-check form-switch fs-3">
              <input className="form-check-input shadow-none" type="checkbox" role="switch" checked={!formData.certificateDisabled} onChange={async () => {
                const ns = !formData.certificateDisabled;
                await updateDoc(doc(db, "admissions", student.id), { certificateDisabled: ns });
                setFormData(p => ({ ...p, certificateDisabled: ns }));
                toast.info("Status Updated");
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StudentProfile() {
  return <AdmissionProvider>{(data) => <ProfileContent {...data} />}</AdmissionProvider>;
}