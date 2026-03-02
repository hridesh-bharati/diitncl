import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Row, Col, Form, Button, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AdmissionProvider from "../Admissions/AdmissionProvider";

const safe = (val) => (val && val !== "undefined" && val !== "" ? val : "—");

// --- MINI COMPONENTS ---
const InfoRow = ({ label, value, isEditing, onChange, type = "text", icon, color }) => (
  <Col xs={12} md={6} className="mb-3">
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
          <Form.Control 
            size="sm" 
            type={type} 
            className="border-0 glass-panel bg-white mt-1 shadow-none" 
            value={value || ""} 
            onChange={(e) => onChange(e.target.value)} 
          />
        ) : (
          <span className="fw-bold text-dark">{safe(value)}</span>
        )}
      </div>
    </div>
  </Col>
);

const StatBox = ({ label, value, icon, colorClass, isEditing, onChange, type = "text" }) => (
  <Col xs={4}>
    <div className="glass-panel p-3 text-center border-0 h-100 shadow-sm">
      <i className={`bi ${icon} ${colorClass} fs-4 mb-1 d-block`}></i>
      <small className="text-muted fw-bold d-block" style={{ fontSize: '9px' }}>{label}</small>
      {isEditing ? (
        <Form.Control 
          size="sm" 
          type={type} 
          className="mt-1 border-0 text-center bg-white p-0 shadow-none small" 
          value={value || ""} 
          onChange={(e) => onChange(e.target.value)} 
        />
      ) : (
        <span className="fw-bold text-dark small">{safe(value)}</span>
      )}
    </div>
  </Col>
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

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center win11-bg"><Spinner animation="grow" variant="primary" /></div>;
  if (error || !student) return <div className="win11-bg vh-100 d-flex flex-column align-items-center justify-content-center p-5"><h5 className="glass-panel p-4">Not Found</h5><Button onClick={() => navigate(-1)}>Back</Button></div>;

  // --- FIELDS ARRAY ---
  const fields = [
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

      {/* APP BAR */}
      <div className="glass-panel p-3 d-flex align-items-center justify-content-between mx-2  shadow-sm border-0">
        <div className="d-flex align-items-center">
          <Button variant="light" className="rounded-circle p-2 me-3 border-0 shadow-sm" onClick={() => navigate(-1)}>
            <i className="bi bi-chevron-left fw-bold"></i>
          </Button>
          <h6 className="mb-0 fw-bold text-primary">Student Profile</h6>
        </div>
        <div className="d-flex gap-2">
          {!isEditing ? (
            <Button className="bg-primary text-white border-0 rounded-pill px-4 fw-bold shadow-sm" onClick={() => setIsEditing(true)}>Edit</Button>
          ) : (
            <>
              <Button variant="light" className="rounded-pill px-3 border-0" onClick={() => { setIsEditing(false); setFormData(student); }}>Cancel</Button>
              <Button className="bg-primary text-white border-0 rounded-pill px-4 fw-bold shadow" onClick={handleSave} disabled={isSaving}>{isSaving ? <Spinner size="sm" /> : "Save"}</Button>
            </>
          )}
        </div>
      </div>

      <Container className="mt-4" style={{ maxWidth: '850px' }}>
        {/* HERO CARD */}
        <div className="glass-card p-4 mb-4 border-0 text-center">
          <div className="position-relative d-inline-block mx-auto mb-3">
            <img src={formData.photoUrl || `https://ui-avatars.com/api/?name=${formData.name}&background=000075&color=fff&bold=true`} 
                 className="rounded-circle border border-4 border-white shadow-lg" 
                 style={{ width: 130, height: 130, objectFit: "cover" }} 
                 alt="Avatar" />
            {isEditing && (
              <label htmlFor="pInp" className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 border border-2 border-white shadow" style={{ cursor: "pointer" }}>
                <i className="bi bi-camera-fill"></i>
                <input type="file" id="pInp" hidden onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>
          <h3 className="fw-bold mb-1" style={{ color: "rgb(0, 0, 117)" }}>{safe(formData.name)}</h3>
          <p className="text-secondary fw-medium fs-5 mb-3">{safe(formData.course)}</p>
          <div className="d-flex justify-content-center gap-2">
            <Badge pill className="bg-primary px-3 py-2 shadow-sm">ID: {safe(formData.regNo)}</Badge>
            <Badge pill bg="white" className="text-dark border px-3 py-2 shadow-sm">{safe(formData.status)}</Badge>
          </div>
        </div>

        {/* ACADEMIC STATS */}
        <Row className="g-3 mb-4">
          <StatBox label="PERCENTAGE" value={formData.percentage || ""} icon="bi-graph-up-arrow" colorClass="text-success" isEditing={isEditing} onChange={(val) => handleChange("percentage", val)} />
          <StatBox label="ADMISSION" value={formData.admissionDate || ""} icon="bi-calendar-check" colorClass="text-primary" isEditing={isEditing} onChange={(val) => handleChange("admissionDate", val)} type="date" />
          <StatBox label="ISSUE DATE" value={formData.issueDate || ""} icon="bi-award" colorClass="text-warning" isEditing={isEditing} onChange={(val) => handleChange("issueDate", val)} type="date" />
        </Row>

        {/* PERSONAL INFO */}
        <h6 className="fw-bold text-dark opacity-75 mb-3 ps-2">PERSONAL INFORMATION</h6>
        <div className="glass-card p-3 mb-4 border-0">
          <Row className="g-0">
            {fields.map((f) => (
              <InfoRow key={f.key} {...f} value={formData[f.key]} isEditing={isEditing} onChange={(val) => handleChange(f.key, val)} />
            ))}
          </Row>
        </div>

        {/* ADDRESS */}
        <h6 className="fw-bold text-dark opacity-75 mb-3 ps-2">ADDRESS DETAILS</h6>
        <div className="glass-card p-4 mb-4 border-0 border-start border-4 border-primary shadow-sm">
          <Row className="g-3">
            {["village", "post", "thana", "city", "state", "pincode"].map((key) => (
              <Col xs={6} md={4} key={key}>
                <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '9px' }}>{key}</small>
                {isEditing ? 
                  <Form.Control size="sm" className="border-0 glass-panel bg-white mt-1 p-1 shadow-none" value={formData[key] || ""} onChange={(e) => handleChange(key, e.target.value)} /> 
                  : <span className="fw-bold text-dark small">{safe(formData[key])}</span>
                }
              </Col>
            ))}
            <Col xs={12} className="mt-3 pt-3 border-top">
              <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '9px' }}>Full Address</small>
              {isEditing ? 
                <Form.Control as="textarea" rows={2} className="border-0 glass-panel bg-white mt-1 shadow-none" value={formData.address || ""} onChange={(e) => handleChange("address", e.target.value)} /> 
                : <p className="small text-dark fw-medium mb-0 mt-1">{safe(formData.address)}</p>
              }
            </Col>
          </Row>
        </div>

        {/* PORTAL ACCESS */}
        <div className="glass-card p-3 mb-5 border-0 shadow-sm">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className={`p-3 rounded-circle me-3 ${formData.certificateDisabled ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                <i className={`bi ${formData.certificateDisabled ? 'bi-shield-slash' : 'bi-shield-check'} fs-4`}></i>
              </div>
              <div>
                <h6 className="fw-bold mb-0">Certificate Portal</h6>
                <small className="text-muted">{formData.certificateDisabled ? 'Locked' : 'Active'}</small>
              </div>
            </div>
            <div className="form-check form-switch fs-3">
              <input className="form-check-input shadow-none" type="checkbox" checked={!formData.certificateDisabled} onChange={async () => {
                const ns = !formData.certificateDisabled;
                await updateDoc(doc(db, "admissions", student.id), { certificateDisabled: ns });
                setFormData(p => ({ ...p, certificateDisabled: ns }));
                toast.info("Status Updated");
              }} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default function StudentProfile() {
  return <AdmissionProvider>{(data) => <ProfileContent {...data} />}</AdmissionProvider>;
}