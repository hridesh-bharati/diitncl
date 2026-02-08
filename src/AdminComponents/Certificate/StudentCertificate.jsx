// src\AdminComponents\Certificate\StudentCertificate.jsx
import React, { useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner, Image, Card, Alert } from "react-bootstrap";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './StudentCertificate.css';

import { staticCourses } from "../../Components/HomePage/pages/Course/courseData";

// =================== UTILITY FUNCTIONS ===================
// Isse fix kiya gaya hai taaki real date format (DD/MM/YYYY) mile
const formatDate = (dateString) => {
    if (!dateString) return "---"; // Agar date nahi hai toh blank na dikhe
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Agar string already formatted hai
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
};

const CENTER_CODE = "DIIT124";

const getGradeFromPercentage = (percentage) => {
    if (!percentage) return "Not Available";
    const percNum = parseFloat(percentage);
    if (isNaN(percNum)) return "Invalid";
    if (percNum >= 81) return "Excellent";
    else if (percNum >= 71) return "Very Good";
    else if (percNum >= 51) return "Good";
    else if (percNum >= 50) return "Satisfactory";
    else return "Needs Improvement";
};

// =================== DYNAMIC COURSE LOGIC ===================
const getCourseData = (courseName) => {
    if (!courseName) return { fullName: "", duration: "", hours: "", modules: [] };

    const found = staticCourses.find(
        (c) => c.name.toUpperCase().trim() === courseName.toUpperCase().trim()
    );

    if (!found) return { fullName: courseName, duration: "", hours: "", modules: [] };

    return {
        fullName: found.description.split('-')[0].trim() || found.name,
        duration: `${found.duration} Months`,
        hours: `${found.duration * 40} Hrs.`,  
        modules: found.subjects.map(s => s.name)
    };
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

const StudentInfoSection = ({ student, courseData, grade }) => (
  <div className="certificate-body-grid p-0 m-0 text-center text-black">
    <p className="certificate-awarded-to d-inline pt-2">
      <span className="certificate-body-text">This certificate is awarded to Mr/Miss</span>
      <span className="certificate-name text-uppercase">
        {" "}{student.name} S/O {student.fatherName || "FATHER_NAME"}
      </span>
    </p>
    <p className="p-0 m-0">
      <span className="certificate-body-text">
        On the successfully completion of a <b>{courseData.duration}</b> ({courseData.hours}) course, titled
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

const FooterSection = ({ student, issueDate }) => (
    <div className="certificateFooter m-auto">
      <div className="d-flex justify-content-start align-items-end">
        <div className="text-start w-50">
          <img src="/images/vender/signature.png" alt="Sign" style={{ width: "150px" }} />
          <h6 className="dbluetext fw-bold certificate-footer-text">Chief Exam Controller</h6>
        </div>
        <div className="text-start w-50 fw-bolder">
          <p className="m-0 certificate-footer-text">
            {/* Real Issue Date Yahan Dikh Rahi Hai */}
            Date of Issue : <span className="dbluetext">{issueDate}</span>
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-2 fw-bold certificate-footer-reg px-5 py-1"
        style={{ borderTop: "1px solid darkblue", borderBottom: "1px solid darkblue" }}
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
        <p className="m-0 ftrTExt certificate-footer-text arial blueColor d-flex justify-content-evenly">
          <span>Reg Office: Harredeeh, ward No. 5, Nichhalu, Dist-Maharajganj (273304) </span>
          <span className="small ms-4">https://www.drishteeindia.com</span>
        </p>
      </div>
    </div>
);

// =================== MAIN COMPONENTS ===================
const CertificateContent = ({ student }) => {
    const courseData = useMemo(() => getCourseData(student.course), [student.course]);
    
    // Issue Date Logic: Agar DB mein hai toh wahi, warna default empty
    const issueDate = useMemo(() => formatDate(student.issueDate), [student.issueDate]);
    
    const grade = useMemo(() => getGradeFromPercentage(student.percentage), [student.percentage]);

    return (
        <div id="overflow-card">
            <div id="certificate-fixed-a4">
                <div className="certificate-wrapper">
                    <div id="printResult" className="certificate-sheet-landscape m-auto">
                        <div id="watermark">
                            <HeaderSection student={student} />
                            <h1 className="certificate-title arial">Certificate of Course Completion</h1>
                            <StudentInfoSection student={student} courseData={courseData} grade={grade} />
                            <ModulesSection modules={courseData.modules} />
                            <FooterSection student={student} issueDate={issueDate} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function StudentCertificate({ student: propStudent }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const downloadPDF = useCallback(() => {
        const printResult = document.getElementById("printResult");
        if (!printResult) return;
        
        html2pdf()
            .set({
                margin: 0,
                filename: `cert_${propStudent?.name || 'student'}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 4, useCORS: true, width: 1123, height: 794 },
                jsPDF: { unit: 'mm', format: [294.64, 209.211], orientation: 'landscape' }
            })
            .from(printResult)
            .save();
    }, [propStudent]);

    const renderContent = ({ admissions, loading }) => {
        if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
        const student = propStudent || admissions.find(s => String(s.id) === String(id));
        if (!student) return <Alert variant="danger" className="m-5">Student Not Found or Record Missing</Alert>;

        return (
            <div className="bg-white min-vh-100">
                <div className="p-3 d-flex justify-content-between border-bottom bg-white no-print">
                    <Button variant="light" onClick={() => navigate(-1)}>← Back</Button>
                    <Button variant="primary" onClick={downloadPDF}>Download PDF</Button>
                </div>
                <div className="d-flex justify-content-center py-4" style={{ overflowX: "auto" }}>
                    <CertificateContent student={student} />
                </div>
            </div>
        );
    };

    return <AdmissionProvider>{renderContent}</AdmissionProvider>;
}