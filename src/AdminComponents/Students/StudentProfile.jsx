// src\AdminComponents\Students\StudentProfile.jsx
import React, { useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Badge, Spinner } from "react-bootstrap";
import {
  ArrowLeft, EnvelopeFill, TelephoneFill, Calendar2EventFill, GeoAltFill,
  MortarboardFill, AwardFill, PersonFill, PersonBadgeFill, CalendarCheckFill, 
  ChevronRight, Whatsapp, ShareFill
} from "react-bootstrap-icons";
import AdmissionProvider from "../Admissions/AdmissionProvider";

// --- Sub-Components ---
const ActionBtn = ({ icon: Icon, label, bgColor, iconColor, onClick }) => (
  <div className="text-center flex-fill" role="button" onClick={onClick}>
    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm" 
         style={{ width: 52, height: 52, backgroundColor: bgColor, color: iconColor }}>
      <Icon size={22} />
    </div>
    <small className="fw-bold text-secondary" style={{ fontSize: '0.75rem' }}>{label}</small>
  </div>
);

const ListItem = React.memo(({ icon, label, value, isLast, iconBg, iconColor }) => (
  <div className={`d-flex align-items-center p-3 ${!isLast ? 'border-bottom border-light' : ''}`}>
    <div className="rounded-3 d-flex me-3 shadow-sm" 
         style={{ width: 42, height: 42, backgroundColor: iconBg, color: iconColor, minWidth: 42 }}>
      {React.cloneElement(icon, { size: 20, className: "m-auto" })}
    </div>
    <div className="flex-grow-1 overflow-hidden">
      <div className="text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: "0.65rem", letterSpacing: "0.6px" }}>{label}</div>
      <div className="text-dark fw-bold text-truncate" style={{ fontSize: "1rem" }}>{value || "—"}</div>
    </div>
  </div>
));

const ProfileContent = ({ admissions, loading, error }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = useMemo(() => admissions?.find(a => String(a.id) === String(id)), [admissions, id]);

  const handleAction = useCallback((type, val) => {
    const urls = {
      call: `tel:${val}`,
      mail: `mailto:${val}`,
      wa: `https://wa.me/91${val?.replace(/\D/g, '')}`
    };
    if (urls[type]) window.open(urls[type], '_blank');
  }, []);

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center bg-white"><Spinner animation="border" variant="primary" /></div>;
  if (error || !student) return <div className="p-5 text-center"><h5 className="text-muted">Not Found</h5><Button onClick={() => navigate(-1)} className="rounded-pill mt-2">Back</Button></div>;

  // Icons Color Configuration
  const sections = [
    {
      title: "Academic Information",
      items: [
        { icon: <MortarboardFill />, label: "Registration", value: student.regNo, bg: "#E8EAF6", color: "#3F51B5" },
        { icon: <AwardFill />, label: "Performance", value: student.percentage ? `${student.percentage}% Marks` : "N/A", bg: "#E8F5E9", color: "#4CAF50" },
        { icon: <CalendarCheckFill />, label: "Admission Date", value: student.admissionDate, bg: "#E3F2FD", color: "#2196F3" },
        { icon: <CalendarCheckFill />, label: "Issue Date", value: student.issueDate, bg: "#F3E5F5", color: "#9C27B0" },
      ]
    },
    {
      title: "Personal Details",
      items: [
        { icon: <PersonBadgeFill />, label: "Email", value: student.email, bg: "#FFF3E0", color: "#FF9800" },
        { icon: <PersonBadgeFill />, label: "Mobile ", value: student.mobile, bg: "#FFF3E0", color: "#FF9800" },
        { icon: <PersonBadgeFill />, label: "Father Name", value: student.fatherName, bg: "#FFF3E0", color: "#FF9800" },
        { icon: <PersonBadgeFill />, label: "Father Name", value: student.motherName, bg: "#ffebcbff", color: "#ffa114ff" },
        { icon: <Calendar2EventFill />, label: "Date of Birth", value: student.dob, bg: "#FCE4EC", color: "#E91E63" },
        { icon: <GeoAltFill />, label: "Address", value: student.address, bg: "#F1F8E9", color: "#8BC34A" },
      ]
    }
  ];

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: "#F7F9FC" }}>
      {/* Native App Bar */}
      <div className="p-3 d-flex align-items-center text-white shadow" style={{ backgroundColor: "#004a77", borderRadius: "0 0 20px 20px" }}>
        <ArrowLeft size={26} onClick={() => navigate(-1)} role="button" />
        <div className="ms-3 flex-grow-1">
          <h6 className="mb-0 fw-bold">Student Profile</h6>
          <small className="text-white-50">ID: {student.regNo}</small>
        </div>
        <ShareFill size={20} className="me-2 text-white-50" />
      </div>

      <Container className="mt-n2 pt-3">
        {/* Profile Header Card */}
        <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden pt-4 text-center">
          <div className="position-relative d-inline-block">
            <img src={student.photoUrl || "https://ui-avatars.com/api/?name="+student.name} 
                 className="rounded-circle border border-5 border-white shadow" 
                 style={{ width: 115, height: 115, objectFit: "cover" }} alt="User" />
          </div>
          <h4 className="fw-extrabold text-dark mt-3 mb-1">{student.name}</h4>
          <p className="text-muted small mb-3">{student.course} Specialist</p>
          
          <div className="d-flex px-4 pb-4 mt-2 border-top pt-4">
            <ActionBtn icon={TelephoneFill} label="Call" bgColor="#E3F2FD" iconColor="#2196F3" onClick={() => handleAction('call', student.mobile)} />
            <ActionBtn icon={Whatsapp} label="WhatsApp" bgColor="#E8F5E9" iconColor="#2E7D32" onClick={() => handleAction('wa', student.mobile)} />
            <ActionBtn icon={EnvelopeFill} label="Email" bgColor="#FFF3E0" iconColor="#EF6C00" onClick={() => handleAction('mail', student.email)} />
          </div>
        </Card>

        {/* Info Blocks */}
        {sections.map((sec, idx) => (
          <div key={idx} className="mb-4">
            <h6 className="text-muted fw-bold px-2 small text-uppercase mb-2" style={{ letterSpacing: 1.2 }}>{sec.title}</h6>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              {sec.items.map((item, i) => (
                <ListItem key={i} {...item} iconBg={item.bg} iconColor={item.color} isLast={i === sec.items.length - 1} />
              ))}
            </Card>
          </div>
        ))}

        {/* Premium Action Button */}
        {student.status === "accepted" && (
          <Button variant="primary" className="w-100 py-3 mb-5 fw-bold rounded-4 shadow-lg border-0 d-flex align-items-center justify-content-center mt-2"
                  style={{ background: "linear-gradient(45deg, #004a77, #0072b1)" }}
                  onClick={() => navigate(`/admin/students/${id}/certificate`)}>
            <AwardFill className="me-2" size={22} /> 
            VIEW DIGITAL CERTIFICATE 
            <ChevronRight size={16} className="ms-2" />
          </Button>
        )}
      </Container>
    </div>
  );
};

export default function StudentProfile() {
  return <AdmissionProvider>{(data) => <ProfileContent {...data} />}</AdmissionProvider>;
}