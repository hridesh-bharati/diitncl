// src/AdminComponents/Certificate/StudentCertificate.jsx
import React, { useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner, Image, Card, Badge, Alert } from "react-bootstrap";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import { COURSE_CONFIG, getCourseData } from "./CourseConfig";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './StudentCertificate.css'

// =================== UTILITY FUNCTIONS ===================
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
};

// Fixed center code variable
const CENTER_CODE = "DIIT124";

// Grade calculation function
const getGradeFromPercentage = (percentage) => {
  if (!percentage) return "Not Available";

  const percNum = parseFloat(percentage);
  if (isNaN(percNum)) return "Invalid";

  if (percNum >= 81 && percNum <= 100) {
    return "Excellent";
  } else if (percNum >= 71 && percNum <= 80) {
    return "Very Good";
  } else if (percNum >= 51 && percNum <= 70) {
    return "Good";
  } else if (percNum >= 50 && percNum <= 60) {
    return "Satisfactory";
  } else if (percNum < 50) {
    return "Needs Improvement";
  } else {
    return "Invalid";
  }
};

// =================== REUSABLE COMPONENTS ===================
const HeaderSection = ({ student }) => (
  <div className="certificate-header-grid">
    <div>
      <img src="/images/icon/logo.png" alt="DIIT" className="header-logo-img ms-4" />
    </div>
    <div className="d-flex justify-content-start align-items-start ps-5">
      <div className="ps-3">
        <h1 className="certificate-main-title">DRISHTEE</h1>
        <p className="certificate-sub-title fw-bold cert-center ms-2">
          An ISO 9001:2008 Certified Institute
        </p>
      </div>
      <div>
        <div className="certificate-photo-container ms-4">
          <Image
            src={student.photoUrl || "/avatar.png"}
            alt="Student"
            className="certificate-photo"
            onError={(e) => { e.target.src = "/avatar.png"; }}
          />
        </div>
      </div>
    </div>
    <div className="text-end cert-right fw-bold">
      <p className="m-0 mt-1">Reg under The Indian trust act 1882</p>
      <p className="m-0 mt-1">Reg No - 14/2025</p>
      <p className="m-0 mt-1">Darpan ID : UP/20250878051</p>
    </div>
  </div>
);

const StudentInfoSection = ({ student, courseData, totalHours, grade }) => (
  <div className="certificate-body-grid p-0 m-0 text-center text-black">
    <p className="certificate-awarded-to d-inline pt-2">
      <span className="certificate-body-text">This certificate is awarded to Mr/Miss</span>
      <span className="certificate-name text-uppercase">
        {" "}{student.name} S/O {student.fatherName || "FATHER_NAME"}
      </span>
    </p>
    <p className="p-0 m-0">
      <span className="certificate-body-text">
        On the successfully completion of a <b>{courseData.duration || "COURSE_DURATION"}</b> ({totalHours}) course, titled
      </span>
    </p>
    <h4 className="certificate-course-title py-1 m-0">{courseData.fullName}</h4>
    <p>
      <span className="certificate-body-text">with grade & Percentage </span>
      <span className="certificate-grade-highlight">
        <u>{grade} & {student.percentage}%</u>
      </span>
    </p>
    <p className="certificate-body-text">
      Examination conducted on at all-india basis at <b>Maharajganj / U.P.</b>
    </p>
  </div>
);

const ModulesSection = ({ modules }) => (
  <div className="modules-container row">
    <div className="col-3">
      <p className="m-0 text-center certificate-modules-title"><b>Modules Covered:</b></p>
    </div>
    <div className="col-9">
      <div className="d-flex flex-wrap gap-1 justify-content-start p-0 m-0">
        {modules.map((module, index) => (
          <span key={index} className="certificate-module-item p-0 my-0">
            {index + 1}. {module}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const FooterSection = ({ student, issueDate }) => {
  const percentage = parseFloat(student.percentage);
  const grade = getGradeFromPercentage(student.percentage);

  return (
    <div className="certificateFooter m-auto">
      <div className="d-flex justify-content-start align-items-end">
        <div className="text-start w-50">
          <img src="/images/vender/signature.png" alt="Sign" style={{ width: "150px" }} />
          <h6 className="dbluetext fw-bold certificate-footer-text">Chief Exam Controller</h6>
        </div>
        <div className="text-start w-50 fw-bolder">
          <p className="m-0 certificate-footer-text">
            Date of Issue : <span className="dbluetext">{issueDate}</span>
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-2 fw-bold ftrTExt certificate-footer-reg px-5 py-1"
        style={{
          borderTop: "1px solid darkblue",
          borderBottom: "1px solid darkblue",
        }}
      >
        <div>
          <span className="dbluetext">Student Reg No. :</span>
          <span className="text-uppercase">{student.regNo}</span>
        </div>
        <div>
          <span className="dbluetext">Center Code :</span>
          <span>{CENTER_CODE}</span>
        </div>
      </div>

      <div className="text-center">
        <p className="m-0 ftrTExt certificate-footer-text grade border bg-danger-subtle mt-2">
          Grade Mark : Excellent (81% - 100%), Very Good (71% - 80%), Good(51% - 70%), Satisfactory (50% - 60%)
        </p>
      </div>

      <div className="mt-2 text-center">
        <h6 className="fw-bold m-0 certificate-institute-title arial">
          DRISHTEE INSTITUTE OF INFORMATION TECHNOLOGY
        </h6>
        <p className="m-0 ftrTExt certificate-footer-text arial redText">
          (An unit of Drishtee Educational & welfare Trust)
        </p>
        <p className="m-0 ftrTExt certificate-footer-text arial blueColor d-flex justify-content-center">
          <span>Reg Office: Harredeeh, ward No. 5, Nichhalu, Dist-Maharajganj (273304) </span>
          <span className="small ms-2">https://www.drishteeindia.com</span>
        </p>
      </div>
    </div>
  );
};

// =================== MAIN CERTIFICATE COMPONENT ===================
const CertificateContent = ({ student }) => {
  // Get course data using helper function
  const courseData = useMemo(() => getCourseData(student.course), [student.course]);

  const issueDate = useMemo(() =>
    formatDate(student.issueDate || new Date().toISOString()), [student.issueDate]
  );

  // Calculate grade based on percentage
  const grade = useMemo(() =>
    getGradeFromPercentage(student.percentage), [student.percentage]
  );

  return (
    <div id="overflow-card">
      <div id="certificate-fixed-a4">
        <div className="certificate-wrapper">
          <div id="printResult" className="certificate-sheet-landscape m-auto">
            <div id="watermark">
              <HeaderSection student={student} />

              <h1 className="certificate-title arial">Certificate of Course Completion</h1>

              <StudentInfoSection
                student={student}
                courseData={courseData}
                totalHours={courseData.hours}
                grade={grade}
              />

              <ModulesSection modules={courseData.modules} />

              <FooterSection student={student} issueDate={issueDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =================== PDF DOWNLOAD CONFIGURATION ===================
const PDF_OPTIONS = {
  margin: 0,
  image: { type: 'jpeg', quality: 1 },
  html2canvas: {
    scale: 4,
    useCORS: true,
    scrollY: 0,
    width: 1123,
    height: 794,
    windowWidth: 1123,
    windowHeight: 794
  },
  jsPDF: {
    unit: 'mm',
    format: [294.64, 209.211],
    orientation: 'landscape'
  }
};

// =================== MAIN EXPORTED COMPONENT (Mobile Optimized) ===================
export default function StudentCertificate({ student: propStudent }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const downloadPDF = useCallback(() => {
    const printResult = document.getElementById("printResult");
    if (!printResult) {
      toast.error("Certificate not found.");
      return;
    }

    const filename = `cert_${new Date().getTime()}.pdf`;

    html2pdf()
      .set({ ...PDF_OPTIONS, filename })
      .from(printResult)
      .save()
      .then(() => toast.success("Downloaded!"))
      .catch(() => toast.error("Failed to download."));
  }, []);

  const renderContent = ({ admissions, loading }) => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    const student = propStudent || admissions.find(s => String(s.id) === String(id));

    if (!student) {
      return (
        <div className="p-4 text-center">
          <div className="mb-3 mt-5">🚫</div>
          <h6 className="fw-bold">Student Not Found</h6>
          <button className="btn btn-outline-secondary btn-sm mt-3 w-100" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      );
    }

    const isAccepted = student.status === "accepted";
    const hasRegNo = !!student.regNo;
    const hasPercentage = !!student.percentage;
    const eligible = isAccepted && hasRegNo && hasPercentage;

    if (!eligible) {
      return (
        <div className="bg-light min-vh-100 p-3">
          {/* Mobile Header */}
          <div className="d-flex align-items-center mb-4">
            <button className="border-0 bg-transparent p-0 me-3" onClick={() => navigate(-1)}>
              <span style={{ fontSize: '24px' }}>←</span>
            </button>
            <h5 className="mb-0 fw-bold">Certificate Status</h5>
          </div>

          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="bg-danger p-2 text-center text-white small">
              Action Required
            </div>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem' }}>📜</div>
                <h5 className="fw-bold mt-2">Not Yet Available</h5>
              </div>

              <div className="bg-light rounded-3 p-3 mb-4">
                <h6 className="small fw-bold text-uppercase text-muted mb-3">Checklist:</h6>
                <div className="d-flex flex-column gap-2">
                  <StatusItem label="Admission Status" done={isAccepted} />
                  <StatusItem label="Reg. Number" done={hasRegNo} />
                  <StatusItem label="Final Percentage" done={hasPercentage} />
                </div>
              </div>

              <div className="small border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Student:</span>
                  <span className="fw-bold">{student.name}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Course:</span>
                  <span className="fw-bold text-truncate ms-2">{student.course}</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-100 rounded-pill mt-4 py-2 fw-bold"
                onClick={() => navigate(`/admin/students/${student.id}`)}
              >
                View Profile
              </Button>
            </Card.Body>
          </Card>
        </div>
      );
    }

    return (
      <div className="bg-white min-vh-100 d-flex flex-column">
        {/* Mobile Navbar for Certificate Page */}
        <div className="p-3 d-flex justify-content-between align-items-center border-bottom bg-white sticky-top">
          <button className="btn btn-light rounded-circle" onClick={() => navigate(-1)}>←</button>
          <h6 className="mb-0 fw-bold">E-Certificate</h6>
          <div style={{ width: '40px' }}></div>
        </div>

        <div
          className="d-flex justify-content-center w-100"
          style={{ overflowX: "auto" }}
        >
          <div style={{ width: "1123px", height: "794px" }}>
            <CertificateContent student={student} />
          </div>
        </div>


        {/* Bottom App-like Action Bar */}
        {/* Bottom Minimal Action */}
<div className="p-3 bg-white border-top d-flex justify-content-center">
  <button
    className="btn btn-primary px-4 py-2 rounded-3 d-flex align-items-center gap-2"
    onClick={downloadPDF}
  >
    <span style={{ fontSize: "14px" }}>Download PDF</span>
  </button>
</div>

      </div>
    );
  };

  return (
    <AdmissionProvider>
      {renderContent}
    </AdmissionProvider>
  );
}

// Helper Component for UI consistency
const StatusItem = ({ label, done }) => (
  <div className="d-flex align-items-center gap-2">
    <span>{done ? "✅" : "⭕"}</span>
    <span className={done ? "text-dark" : "text-muted"}>{label}</span>
  </div>
);