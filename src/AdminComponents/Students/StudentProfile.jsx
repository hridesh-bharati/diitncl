// src/AdminComponents/Students/StudentProfile.jsx

import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Badge,
  Spinner,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import {
  ArrowLeft,
  EnvelopeFill,
  TelephoneFill,
  Calendar2EventFill,
  GeoAltFill,
  MortarboardFill,
  PersonFill,
  PersonBadgeFill,
  CardHeading,
  PersonCheckFill,
  AwardFill,
  PencilFill,
  Check2,
  X,
  FileEarmarkPdfFill,
  CameraFill,
} from "react-bootstrap-icons";

import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AdmissionProvider from "../Admissions/AdmissionProvider";

const safe = (val) =>
  val && val !== "undefined" && val !== "" ? val : "—";

export default function StudentProfile() {
  return (
    <AdmissionProvider>
      {(data) => <ProfileContent {...data} />}
    </AdmissionProvider>
  );
}

const ProfileContent = ({ admissions, loading, error }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = useMemo(
    () => admissions?.find((a) => String(a.id) === String(id)),
    [admissions, id]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (student) setFormData(student);
  }, [student]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 300 * 1024) {
      toast.error("Image must be less than 300KB");
      return;
    }

    setSelectedImage(file);

    // instant preview
    setFormData((prev) => ({
      ...prev,
      photoUrl: URL.createObjectURL(file),
    }));
  };

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "hridesh99!");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/draowpiml/image/upload",
      {
        method: "POST",
        body: fd,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      let updatedData = { ...formData };

      if (selectedImage) {
        const imageUrl = await uploadToCloudinary(selectedImage);
        updatedData.photoUrl = imageUrl;
      }

      await updateDoc(doc(db, "admissions", student.id), updatedData);

      toast.success("Profile Updated Successfully");
      setIsEditing(false);
      setSelectedImage(null);
    } catch (err) {
      toast.error("Update Failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadCertificate = () => {
    navigate(`/admin/students/${student.id}/certificate`, {
      state: { studentData: student },
    });
  };

  const handleCancel = () => {
    setFormData(student);
    setSelectedImage(null);
    setIsEditing(false);
  };

  if (loading)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error || !student)
    return (
      <div className="p-5 text-center">
        <h5>Not Found</h5>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    );

  const fields = [
    { label: "Father", field: "fatherName", icon: <PersonFill color="#5C6BC0" /> },
    { label: "Mother", field: "motherName", icon: <PersonCheckFill color="#EC407A" /> },
    { label: "Mobile", field: "mobile", icon: <TelephoneFill color="#66BB6A" /> },
    { label: "Email", field: "email", icon: <EnvelopeFill color="#dc3545" /> },
    { label: "Aadhar", field: "aadharNo", icon: <CardHeading color="#26A69A" /> },
    { label: "Qualification", field: "qualification", icon: <MortarboardFill color="#FF9800" /> },
    { label: "DOB", field: "dob", icon: <Calendar2EventFill color="#EF5350" /> },
    { label: "Gender", field: "gender", icon: <PersonBadgeFill color="#AB47BC" /> },
    { label: "Category", field: "category", icon: <AwardFill color="#7E57C2" /> },
  ];

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: "#F8FAFC" }}>
      
      {/* HEADER */}
      <div
        className="p-3 d-flex align-items-center text-white shadow-sm"
        style={{ background: "#1A237E", borderRadius: "0 0 20px 20px" }}
      >
        <ArrowLeft size={24} onClick={() => navigate(-1)} role="button" />
        <span className="ms-3 fw-bold">Student Profile</span>

        <div className="ms-auto">
          {!isEditing ? (
            <Button size="sm" variant="light" onClick={() => setIsEditing(true)}>
              <PencilFill /> Edit
            </Button>
          ) : (
            <div className="d-flex">
              <Button
                size="sm"
                variant="success"
                className="me-2"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <Check2 />
                )}
              </Button>

              <Button
                size="sm"
                variant="danger"
                disabled={isSaving}
                onClick={handleCancel}
              >
                <X />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Container className="mt-4">

        {/* PROFILE CARD */}
        <Card className="shadow-sm rounded-4 text-center p-4 mb-4">
          <div className="position-relative d-inline-block mx-auto">
            <img
              src={
                formData.photoUrl ||
                `https://ui-avatars.com/api/?name=${formData.name}&background=1A237E&color=fff&bold=true`
              }
              className="rounded-circle border border-4 border-white shadow"
              style={{ width: 110, height: 110, objectFit: "cover" }}
              alt={formData.name}
            />

            {isEditing && (
              <>
                <Form.Control
                  type="file"
                  accept="image/*"
                  className="d-none"
                  id="photoUpload"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="photoUpload"
                  className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2"
                  style={{ cursor: "pointer" }}
                >
                  <CameraFill size={14} />
                </label>
              </>
            )}
          </div>

          <h5 className="fw-bold mt-3 mb-2">
            {safe(formData.name)} ({safe(formData.course)})
          </h5>

          <div className="d-flex justify-content-center gap-2 mt-2">
            <Badge bg="primary">{safe(formData.regNo)}</Badge>
            <Badge bg="success">{safe(formData.status)}</Badge>
          </div>
        </Card>

        <div className="d-flex justify-content-center">
          <Button
            size="sm"
            variant="success"
            className="rounded-pill w-100 px-3 py-2 d-flex align-items-center justify-content-center"
            onClick={handleDownloadCertificate}
          >
            <FileEarmarkPdfFill className="me-1" />
            Certificate
          </Button>
        </div>

        {/* ACADEMIC EDIT */}
        <Row className="mt-3 g-2">
          <Col>
            {isEditing ? (
              <Form.Control
                placeholder="Percentage"
                value={formData.percentage || ""}
                onChange={(e) =>
                  handleChange("percentage", e.target.value)
                }
              />
            ) : (
              <div className="bg-success bg-opacity-10 p-2 rounded-3">
                <small className="text-success">Percentage</small>
                <br />
                <strong>{safe(formData.percentage)}%</strong>
              </div>
            )}
          </Col>

          <Col>
            {isEditing ? (
              <Form.Control
                type="date"
                value={formData.admissionDate || ""}
                onChange={(e) =>
                  handleChange("admissionDate", e.target.value)
                }
              />
            ) : (
              <div className="bg-primary bg-opacity-10 p-2 rounded-3">
                <small className="text-primary">Admission</small>
                <br />
                <strong>{safe(formData.admissionDate)}</strong>
              </div>
            )}
          </Col>

          <Col>
            {isEditing ? (
              <Form.Control
                type="date"
                value={formData.issueDate || ""}
                onChange={(e) =>
                  handleChange("issueDate", e.target.value)
                }
              />
            ) : (
              <div className="bg-warning bg-opacity-10 p-2 rounded-3">
                <small className="text-warning">Issue</small>
                <br />
                <strong>{safe(formData.issueDate)}</strong>
              </div>
            )}
          </Col>
        </Row>

        {/* BASIC DETAILS */}
        <Row className="g-3 mt-4 small ">
          {fields.map((item, i) => (
            <Col xs={6} key={i}>
              <div className="bg-white p-3 rounded-4 shadow-sm">
                <div>{item.icon}</div>
                <div className="text-muted fw-bold small text-uppercase">
                  {item.label}
                </div>

                {isEditing ? (
                  <Form.Control
                    size="sm"
                    value={formData[item.field] || ""}
                    onChange={(e) =>
                      handleChange(item.field, e.target.value)
                    }
                  />
                ) : (
                  <div className="fw-bold text-dark overflow-hidden">
                    {safe(formData[item.field])}
                  </div>
                )}
              </div>
            </Col>
          ))}
        </Row>

        {/* ADDRESS CARD - WITH LEFT BORDER */}
        <Card
          className=" shadow-sm rounded-4 p-4 mb-5 my-4"
          style={{ borderLeft: "4px solid #0d6efd" }}
        >
          <h6 className="fw-bold mb-3">
            <GeoAltFill className="text-danger me-2" />
            Address
          </h6>

          {["village", "post", "thana", "city", "state", "pincode"].map((field) => (
            <div
              key={field}
              className="d-flex justify-content-between align-items-start mb-2 border-bottom pb-1"
            >
              <span className="small text-muted text-uppercase fw-semibold">
                {field} :
              </span>

              {isEditing ? (
                <Form.Control
                  size="sm"
                  className="w-50"
                  value={formData[field] || ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              ) : (
                <span className="fw-bold small text-end">
                  {safe(formData[field])}
                </span>
              )}
            </div>
          ))}

          {/* Full Address */}
          <div className="mt-3">
            <div className="small text-muted text-uppercase fw-semibold mb-1">
              Full Address :
            </div>

            {isEditing ? (
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            ) : (
              <div className="fw-bold small">
                {safe(formData.address)}
              </div>
            )}
          </div>
        </Card>

      </Container>
    </div>
  );
};
