import React, { useMemo, useState, useEffect, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AdmissionProvider from "../Admissions/AdmissionProvider";

const safe = (val) => (val && val !== "undefined" && val !== "" ? val : "—");
const getShortReg = (val) => (val && typeof val === "string" ? val.split("/").pop() : val);

// --- MEMOIZED COMPONENTS ---
const InfoRow = memo(({ label, value, isEditing, onChange, type = "text", icon, color, fieldKey }) => (
  <div className="col-12 col-md-6 mb-3">
    <div className="d-flex align-items-center p-3 rounded-4 bg-white bg-opacity-25 border border-white border-opacity-25 transition-all">
      {icon && (
        <div className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
          style={{ width: '45px', minWidth: '45px', height: '45px', backgroundColor: `${color}15`, border: `1px solid ${color}35` }}>
          <i className={`bi ${icon} fs-5`} style={{ color }}></i>
        </div>
      )}
      <div className="flex-grow-1 overflow-hidden">
        <small className="text-muted d-block fw-bold text-uppercase mb-1" style={{ fontSize: '10px', letterSpacing: '0.6px' }}>{label}</small>
        {isEditing ? (
          <input
            type={type}
            className="form-control form-control-sm border-0 border-bottom bg-transparent rounded-0 shadow-none p-0 fw-bold"
            style={{ borderColor: color }}
            value={fieldKey === "regNo" ? getShortReg(value) : (value || "")}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <span className="fw-semibold text-dark text-truncate d-block" style={{ fontSize: '0.95rem' }}>
            {fieldKey === "regNo" ? getShortReg(value) : safe(value)}
          </span>
        )}
      </div>
    </div>
  </div>
));

const StatBox = memo(({ label, value, icon, colorClass, isEditing, onChange, type = "text" }) => (
  <div className="col-4">
    <div className="glass-panel p-3 text-center h-100 shadow-sm transition-all border-0">
      <i className={`bi ${icon} ${colorClass} fs-4 mb-1 d-block`}></i>
      <small className="text-muted fw-bold d-block" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>{label}</small>
      {isEditing ? (
        <input
          type={type}
          className="form-control form-control-sm mt-1 border-0 text-center bg-white bg-opacity-50 p-0 shadow-none small fw-bold"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span className="fw-bold text-dark small">{safe(value)}</span>
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
      if (field === "regNo") {
        const parts = (prev.regNo || "").split("/");
        if (parts.length === 3) newData.regNo = `${parts[0]}/${parts[1]}/${value}`;
        else newData.regNo = value;
      } else if (field === "course") {
        newData.course = value;
        const parts = (prev.regNo || "").split("/");
        if (parts.length === 3) {
          const newCourseCode = value.replace(/\s+/g, "").toUpperCase().slice(0, 10);
          newData.regNo = `${parts[0]}/${newCourseCode}/${parts[2]}`;
        }
      } else {
        newData[field] = value;
      }
      return newData;
    });
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let updatedData = { ...formData };
      const oldEmailId = student.email.toLowerCase().trim();
      const newEmailId = updatedData.email.toLowerCase().trim();

      if (selectedImage) {
        const fd = new FormData();
        fd.append("file", selectedImage);
        fd.append("upload_preset", "hridesh99!");
        const res = await fetch("https://api.cloudinary.com/v1_1/draowpiml/image/upload", { method: "POST", body: fd });
        const imgData = await res.json();
        updatedData.photoUrl = imgData.secure_url;
      }

      if (oldEmailId !== newEmailId) {
        await setDoc(doc(db, "admissions", newEmailId), updatedData);
        await deleteDoc(doc(db, "admissions", oldEmailId));
        navigate(`/admin/students/${newEmailId}`, { replace: true });
      } else {
        await updateDoc(doc(db, "admissions", oldEmailId), updatedData);
      }

      toast.success("Profile Updated!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Save Failed!");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="win11-bg d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary"></div></div>;

  if (error || !student) return (
    <div className="win11-bg vh-100 d-flex flex-column align-items-center justify-content-center">
      <div className="glass-card p-5 text-center">
        <h4>Student Not Found</h4>
        <button className="btn btn-primary rounded-pill mt-3 px-4" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );

  const fields = [
    { label: "Reg No", fKey: "regNo", icon: "bi-card-list", color: "#000000" },
    { label: "Name", fKey: "name", icon: "bi-person-fill", color: "#009688" },
    { label: "Date of Birth", fKey: "dob", icon: "bi-calendar-event", color: "#FF9800", type: "date" },
    { label: "Father's Name", fKey: "fatherName", icon: "bi-person-badge", color: "#3F51B5" },
    { label: "Mother's Name", fKey: "motherName", icon: "bi-person-badge", color: "#E91E63" },
    { label: "Mobile", fKey: "mobile", icon: "bi-telephone-fill", color: "#4CAF50" },
    { label: "Email", fKey: "email", icon: "bi-envelope-at", color: "#F44336" },
    { label: "Aadhar", fKey: "aadharNo", icon: "bi-fingerprint", color: "#009688" },
    { label: "Course", fKey: "course", icon: "bi-book-half", color: "#673AB7" },
    { label: "Gender", fKey: "gender", icon: "bi-gender-ambiguous", color: "#2196F3" },
  ];

  return (
    <div className="win11-bg pb-5 overflow-auto">
      <div className="glass-panel sticky-top mx-2 mt-2 p-3 d-flex align-items-center justify-content-between z-3">
        <div className="d-flex align-items-center">
          <button className="btn btn-light rounded-circle me-3 border-0 shadow-sm" onClick={() => navigate(-1)}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <h6 className="mb-0 fw-bold">Student Profile</h6>
        </div>
        <div>
          {!isEditing ? (
            <button className="btn btn-primary rounded-pill px-4 btn-sm fw-bold shadow-sm" onClick={() => setIsEditing(true)}>Edit</button>
          ) : (
            <div className="d-flex gap-2">
              <button className="btn btn-light rounded-pill btn-sm px-3 border-0" onClick={() => { setIsEditing(false); setFormData(student); }}>Cancel</button>
              <button className="btn btn-primary rounded-pill btn-sm px-4 fw-bold shadow" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <span className="spinner-border spinner-border-sm"></span> : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container mt-4" style={{ maxWidth: '850px' }}>
        <div className="glass-card p-4 mb-4 text-center">
          <div className="position-relative d-inline-block mb-3">
            <img
              src={formData.photoUrl || `https://ui-avatars.com/api/?name=${formData.name}&background=000075&color=fff&bold=true`}
              className="rounded-circle border border-4 border-white shadow-lg"
              style={{ width: 120, height: 120, objectFit: "cover" }}
              alt="Avatar"
            />
            {isEditing && (
              <label htmlFor="pInp" className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 border border-2 border-white shadow" style={{ cursor: "pointer", width: '35px', height: '35px' }}>
                <i className="bi bi-camera-fill"></i>
                <input type="file" id="pInp" hidden onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size <= 300 * 1024) {
                    setSelectedImage(file);
                    setFormData(prev => ({ ...prev, photoUrl: URL.createObjectURL(file) }));
                  } else { toast.error("Max 300KB allowed"); }
                }} accept="image/*" />
              </label>
            )}
          </div>
          {isEditing ? (
            <input
              className="form-control text-center fw-bold border-0 border-bottom shadow-none"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          ) : (
            <h4 className="fw-800 mb-1">{safe(formData.name)}</h4>
          )}
          <p className="text-muted small mb-0">{safe(formData.course)}</p>
          <div className="d-flex justify-content-center gap-2 mt-2">
            <span className="badge rounded-pill bg-primary px-3 shadow-sm">ID: {safe(formData.regNo)}</span>
            <span className="badge rounded-pill bg-dark px-3 shadow-sm">{safe(formData.status)}</span>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <button className={`btn w-100 py-3 rounded-4 glass-card border-0 d-flex align-items-center justify-content-center gap-2 ${formData.certificateDisabled ? 'opacity-50' : ''}`}
              onClick={() => !formData.certificateDisabled && navigate(`/admin/students/${formData.email}/certificate`)}>
              <i className={`bi ${formData.certificateDisabled ? 'bi-lock-fill text-danger' : 'bi-patch-check-fill text-primary'} fs-5`}></i>
              <span className="fw-bold">{formData.certificateDisabled ? 'PORTAL LOCKED' : 'CERTIFICATE'}</span>
            </button>
          </div>
          <div className="col-md-6">
            <button className="btn w-100 py-3 rounded-4 glass-card border-0 d-flex align-items-center justify-content-center gap-2"
              onClick={() => navigate(`/admin/students/${formData.email}/fees`, { state: { studentData: formData } })}>
              <i className="bi bi-cash-stack text-success fs-5"></i>
              <span className="fw-bold">FEE REPORT</span>
            </button>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <StatBox label="PERCENTAGE" value={formData.percentage} icon="bi-graph-up-arrow" colorClass="text-success" isEditing={isEditing} onChange={(val) => handleChange("percentage", val)} />
          <StatBox label="ADMISSION" value={formData.admissionDate} icon="bi-calendar-check" colorClass="text-primary" isEditing={isEditing} onChange={(val) => handleChange("admissionDate", val)} type="date" />
          <StatBox label="ISSUE DATE" value={formData.issueDate} icon="bi-award" colorClass="text-warning" isEditing={isEditing} onChange={(val) => handleChange("issueDate", val)} type="date" />
        </div>

        <div className="glass-card p-3 mb-4 border-0">
          <p className="fw-bold text-primary mb-3 ps-2" style={{ fontSize: '12px' }}><i className="bi bi-info-circle me-1"></i> PERSONAL DETAILS</p>
          <div className="row g-1">
            {fields.map((f) => (
              <InfoRow
                key={f.fKey}
                {...f}
                fieldKey={f.fKey}
                value={formData[f.fKey]}
                isEditing={isEditing}
                onChange={(val) => handleChange(f.fKey, val)}
              />
            ))}
          </div>
        </div>

        <div className="glass-card p-4 mb-4 border-0">
          <p className="fw-bold text-primary mb-3" style={{ fontSize: '12px' }}>
            <i className="bi bi-geo-alt-fill me-1"></i> ADDRESS DETAILS
          </p>
          <div className="row g-3">
            {["village", "post", "thana", "city", "state", "pincode"].map((key) => (
              <div className="col-6 col-md-4" key={key}>
                <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>{key}</small>
                {isEditing ? (
                  <input
                    className="form-control form-control-sm border-0 border-bottom bg-transparent rounded-0 shadow-none p-0 fw-bold"
                    value={formData[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                ) : (
                  <span className="fw-semibold text-dark d-block mt-1" style={{ fontSize: '0.9rem' }}>{safe(formData[key])}</span>
                )}
              </div>
            ))}
            <div className="col-12 mt-3 pt-3 border-top border-white border-opacity-25">
              <small className="text-muted d-block fw-bold text-uppercase mb-1" style={{ fontSize: '9px' }}>Full Address</small>
              {isEditing ? (
                <textarea rows={4} className="form-control bg-white bg-opacity-50 border-0 rounded-3 shadow-none fw-medium"
                  value={formData.address || ""} onChange={(e) => handleChange("address", e.target.value)}
                />
              ) : (
                <p className="text-dark fw-medium mb-0 mt-1" style={{ lineHeight: '1.4', fontSize: '0.95rem' }}>{safe(formData.address)}</p>
              )}
            </div>
          </div>
        </div>

        {/* --- STATUS SWITCH (NO NOTIFICATIONS) --- */}
        <div className="glass-panel p-3 mb-5 border-0 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className={`p-3 rounded-circle me-3 ${formData.certificateDisabled ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-success'}`}>
              <i className={`bi ${formData.certificateDisabled ? 'bi-shield-slash' : 'bi-shield-check'} fs-4`}></i>
            </div>
            <div>
              <h6 className="fw-bold mb-0">Portal Status</h6>
              <small className="text-muted">Certificate {formData.certificateDisabled ? 'Locked' : 'Active'}</small>
            </div>
          </div>
          <div className="form-check form-switch fs-3">
            <input className="form-check-input" type="checkbox" role="switch" checked={!formData.certificateDisabled}
              onChange={async () => {
                const newState = !formData.certificateDisabled;
                const cleanEmail = student.email.toLowerCase().trim();
                try {
                  await updateDoc(doc(db, "admissions", cleanEmail), { certificateDisabled: newState });
                  setFormData((prev) => ({ ...prev, certificateDisabled: newState }));
                  toast.success("Status Updated!");
                } catch (err) {
                  toast.error("Error updating status");
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StudentProfile() {
  return <AdmissionProvider>{(data) => <ProfileContent {...data} />}</AdmissionProvider>;
}