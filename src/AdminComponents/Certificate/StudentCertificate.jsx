// src/AdminComponents/Certificate/StudentCertificate.jsx
import React, { useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner, Image } from "react-bootstrap";
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

const getCenterCode = (regNum) => {
  if (!regNum) return "DIIT000";
  const match = regNum.match(/^(DIIT\d{3})\//);
  return match ? match[1] : "DIIT000";
};


const getDefaultStudentData = () => ({
  name: "",
  fatherName: "RAMSEVAK",
  duration: "15 month",
  percentage: "82",
  regNo: "DIIT124/ADCA/1350",
  issueDate: "01 JAN 2026"
});

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

const StudentInfoSection = ({ student, courseData, totalHours }) => (
  <div className="certificate-body-grid p-0 m-0 text-center text-black">
    <p className="certificate-awarded-to d-inline pt-2">
      <span className="certificate-body-text">This certificate is awarded to Mr/Miss</span>
      <span className="certificate-name text-uppercase">
        {" "}{student.name} S/O {student.fatherName}
      </span>
    </p>
    <p className="p-0 m-0">
      <span className="certificate-body-text">
        On the successfully completion of a <b>{student.duration}</b> ({totalHours}) course, titled
      </span>
    </p>
    <h4 className="certificate-course-title py-1 m-0">{courseData.fullName}</h4>
    <p>
      <span className="certificate-body-text">with grade & Percentage </span>
      <span className="certificate-grade-highlight">
        <u>Excellent & {student.percentage}%</u>
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

const FooterSection = ({ student, issueDate }) => (
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
        <span>{getCenterCode(student.regNo)}</span>
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
      <p className="m-0 ftrTExt certificate-footer-text arial blueColor d-flex justify-content-between">
        <span>Reg Office: Harredeeh, ward No. 5, Nichhalu, Dist-Maharajganj (273304) </span>
        <span className="small">https://www.drishteeindia.com</span>
      </p>
    </div>
  </div>
);

// =================== MAIN CERTIFICATE COMPONENT ===================
const CertificateContent = ({ student }) => {
  if (!student) return <p className="text-danger mt-5 p-4">Student not found</p>;

  // Get course data using helper function
  const courseData = useMemo(() => getCourseData(student.course), [student.course]);
  const studentData = useMemo(() => ({
    ...getDefaultStudentData(),
    ...student
  }), [student]);

  const issueDate = useMemo(() => 
    formatDate(studentData.issueDate), [studentData.issueDate]
  );

  return (
    <div id="overflow-card">
      <div id="certificate-fixed-a4">
        <div className="certificate-wrapper">
          <div id="printResult" className="certificate-sheet-landscape m-auto">
            <div id="watermark">
              <HeaderSection student={studentData} />
              
              <h1 className="certificate-title arial">Certificate of Course Completion</h1>

              <StudentInfoSection 
                student={studentData} 
                courseData={courseData}
                totalHours={courseData.hours}
              />

              <ModulesSection modules={courseData.modules} />
              
              <FooterSection student={studentData} issueDate={issueDate} />
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

// =================== MAIN EXPORTED COMPONENT ===================
export default function StudentCertificate({ student: propStudent }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const downloadPDF = useCallback(() => {
    const printResult = document.getElementById("printResult");
    if (!printResult) {
      toast.error("Certificate element not found.");
      return;
    }

    const filename = `certificate_${new Date().getTime()}.pdf`;
    
    html2pdf()
      .set({ ...PDF_OPTIONS, filename })
      .from(printResult)
      .save()
      .then(() => {
        toast.success("Certificate downloaded successfully!");
      })
      .catch((error) => {
        console.error("PDF generation error:", error);
        toast.error("Failed to download certificate. Please try again.");
      });
  }, []);

  const renderContent = ({ admissions, loading }) => {
    if (loading) {
      return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
          <Spinner />
        </div>
      );
    }

    // Find student - propStudent for verification page, or by ID for admin page
    const student = propStudent || admissions.find(s => String(s.id) === String(id));

    if (!student) {
      return (
        <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
          <h6 className="text-danger">Student not found</h6>
          <Button size="sm" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      );
    }

    return (
      <div className="container-fluid bg-light min-vh-100 p-3 text-center">
        <CertificateContent student={student} />
        <div className="download-row text-center p-3">
          <button className="btn btn-sm hover-btn" onClick={downloadPDF}>
            <img src="/images/icon/download.png" className="img-fluid" alt="Download" />
          </button>
          <h6 className="mt-2">Download your E-Certificate</h6>
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