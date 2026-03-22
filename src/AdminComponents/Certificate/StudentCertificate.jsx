// src\AdminComponents\Certificate\StudentCertificate.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore"; 
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './StudentCertificate.css';

import { staticCourses } from "../../Components/HomePage/pages/Course/courseData";

// =================== UTILITY FUNCTIONS ===================
const formatDate = (dateString) => {
    if (!dateString) return "---";
    try {
        let date;
        if (typeof dateString === "string" && dateString.includes("/")) {
            const [day, month, year] = dateString.split("/");
            date = new Date(`${year}-${month}-${day}`);
        } else {
            date = new Date(dateString);
        }
        if (isNaN(date.getTime())) return dateString;
        const day = date.getDate().toString().padStart(2, "0");
        const monthNames = [
            "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
        ];
        return `${day} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
        return dateString;
    }
};

const CENTER_CODE = "DIIT124";

const getGradeFromPercentage = (percentage) => {
    if (!percentage && percentage !== 0) return "Not Available";
    const percNum = parseFloat(percentage);
    if (isNaN(percNum)) return "Invalid";
    if (percNum >= 81) return "Excellent";
    else if (percNum >= 71) return "Very Good";
    else if (percNum >= 51) return "Good";
    else if (percNum >= 50) return "Satisfactory";
    else return "Needs Improvement";
};

const getCourseData = (courseName) => {
    if (!courseName) return { fullName: "", duration: "", hours: "", modules: [] };
    const found = staticCourses.find(
        (c) => c.name?.toUpperCase().trim() === courseName.toUpperCase().trim()
    );
    if (!found) return { fullName: courseName, duration: "", hours: "", modules: [] };
    const durationMonths = parseInt(found.duration);
    let fixedHours = "";
    if (durationMonths === 18) fixedHours = "720 Hrs.";
    else if (durationMonths === 15) fixedHours = "580 Hrs.";
    else if (durationMonths === 12) fixedHours = "480 Hrs.";
    else if (durationMonths === 6) fixedHours = "230 Hrs.";
    else if (durationMonths === 3) fixedHours = "120 Hrs.";
    else fixedHours = `${durationMonths * 40} Hrs.`;

    return {
        fullName: found.description?.split('-')[0]?.trim() || found.name,
        duration: `${found.duration} Months`,
        hours: fixedHours,
        modules: found.subjects?.map(s => s.name) || []
    };
};

const getNameFontSize = (name, fatherName) => {
    const length = (name + " " + fatherName).length;
    if (length > 40) return "16px";
    if (length > 30) return "18px";
    return "22px";
};

// =================== REUSABLE COMPONENTS ===================
const HeaderSection = ({ student }) => (
    <div className="certificate-header-grid">
        <div>
            <img src="/images/icon/logo.png" alt="Drishtee" loading="eager" className="header-logo-img" />
        </div>
        <div className="d-flex justify-content-start align-items-start ps-5">
            <div className="ps-3">
                <h1 className="certificate-main-title">DRISHTEE</h1>
                <p className="certificate-sub-title fw-bold cert-center ms-2">An ISO 9001:2008 Certified Institute</p>
            </div>
            <div>
                <div className="certificate-photo-container ms-4">
                    <img
                        src={student.photoUrl}
                        className="certificate-photo"
                        alt="Student"
                        crossOrigin="anonymous"
                        onError={(e) => { e.target.src = "/images/icon/icon.webp"; }}
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
            <span className="certificate-body-text">This certificate is awarded to Mr/Miss </span>
            <span className="certificate-name text-uppercase" style={{ fontSize: getNameFontSize(student.name, student.fatherName) }}>
                {student.name} {student.gender === "Female" ? "D/O" : "S/O"} {student.fatherName || ""}
            </span>
        </p>
        <p className="p-0 m-0"><span className="certificate-body-text">On the successfully completion of a <b>{courseData.duration}</b> ({courseData.hours}) course, titled</span></p>
        <h4 className="certificate-course-title py-1 m-0">{courseData.fullName}</h4>
        <p><span className="certificate-body-text">with grade & Percentage </span><span className="certificate-grade-highlight"><u>{grade} & {student.percentage || "N/A"}%</u></span></p>
        <p className="certificate-body-text">Examination conducted on at all-india basis at <b>Maharajganj / U.P.</b></p>
    </div>
);

const ModulesSection = ({ modules }) => (
    <div className="modules-container row">
        <div className="col-3"><p className="m-0 text-center certificate-modules-title"><b>Modules Covered:</b></p></div>
        <div className="col-9">
            <div className="d-flex flex-wrap gap-1 justify-content-start p-0 m-0">
                {modules.length > 0 ? (
                    modules.map((module, index) => (
                        <span key={index} className="certificate-module-item p-0 my-0">{index + 1}. {module}</span>
                    ))
                ) : (<span className="certificate-module-item p-0 my-0">No modules available</span>)}
            </div>
        </div>
    </div>
);

const FooterSection = ({ student, issueDate }) => (
    <div className="certificateFooter m-auto">
        <div className="d-flex justify-content-start align-items-end">
            <div className="text-start w-50">
                <img src="/images/vender/signature.png" alt="Sign" style={{ width: "150px" }} crossOrigin="anonymous" />
                <h6 className="dbluetext fw-bold certificate-footer-text">Chief Exam Controller</h6>
            </div>
            <div className="text-start w-50 fw-bolder">
                <p className="m-0 certificate-footer-text">Date of Issue : <span className="dbluetext">{issueDate}</span></p>
            </div>
        </div>
        <div className="d-flex justify-content-between mt-2 fw-bold certificate-footer-reg px-5 py-1" style={{ borderTop: "1px solid darkblue", borderBottom: "1px solid darkblue" }}>
            <div><span className="dbluetext">Student Reg No. :</span> <span className="text-uppercase">{student.regNo || "N/A"}</span></div>
            <div><span className="dbluetext">Center Code :</span> <span>{CENTER_CODE}</span></div>
        </div>
        <div className="text-center">
            <p className="m-0 ftrTExt certificate-footer-text grade border bg-danger-subtle mt-2">Grade Mark : Excellent (81% - 100%), Very Good (71% - 80%), Good(51% - 70%), Satisfactory (50% - 60%)</p>
        </div>
        <div className="mt-2 text-center">
            <h6 className="fw-bold m-0 certificate-institute-title arial">DRISHTEE INSTITUTE OF INFORMATION TECHNOLOGY</h6>
            <p className="m-0 ftrTExt certificate-footer-text arial redText">(An unit of Drishtee Educational & welfare Trust)</p>
            <p className="m-0 ftrTExt certificate-footer-text arial blueColor d-flex justify-content-evenly">
                <span>Reg Office: Harredeeh, ward No.5, Nichalul, Distt-Maharajganj (273304) </span>
                <span className="small ms-4">https://www.drishteeindia.com</span>
            </p>
        </div>
    </div>
);

// =================== MAIN COMPONENT ===================
export default function StudentCertificate({ student: propStudent }) {
    const { id: urlEmail } = useParams(); 
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [student, setStudent] = useState(propStudent || null);
    const [loading, setLoading] = useState(!propStudent);
    const [error, setError] = useState(null);

    useEffect(() => {
        // ✅ Agar propStudent mil gaya (Student Side)
        if (propStudent) {
            setStudent(propStudent);
            setLoading(false);
            return;
        }

        // ✅ Agar URL se data dhoondna hai (Admin Side)
        if (!urlEmail) return;
        const emailId = urlEmail.toLowerCase().trim();
        const docRef = doc(db, "admissions", emailId);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setStudent({ id: docSnap.id, ...docSnap.data() });
                setError(null);
            } else {
                setError("STUDENT_NOT_FOUND");
            }
            setLoading(false);
        }, (err) => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe(); 
    }, [urlEmail, propStudent]);

    const downloadPDF = useCallback(() => {
        const printResult = document.getElementById("printResult");
        if (!printResult) return toast.error("Certificate not ready");
        toast.info("📄 Generating PDF...");
        html2pdf().set({
            margin: 0, filename: `certificate_${student?.name || 'student'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, width: 1123, height: 794 },
            jsPDF: { unit: 'mm', format: [297, 210], orientation: 'landscape' }
        }).from(printResult).save()
            .then(() => toast.success("✅ PDF Downloaded!"))
            .catch(() => toast.error("Failed to generate PDF"));
    }, [student]);

    if (loading) return <div className="d-flex flex-column align-items-center justify-content-center min-vh-100"><div className="spinner-border text-primary"></div><p className="mt-2">Loading certificate...</p></div>;

    if (student?.certificateDisabled && !isAdmin) {
        return (
            <div className="container mt-5">
                <div className="card border-0 shadow-lg rounded-4 p-5 text-center bg-white">
                    <i className="bi bi-lock-fill display-1 text-danger mb-4"></i>
                    <h2 className="fw-bold">Portal Access Locked</h2>
                    <button className="btn btn-primary rounded-pill px-4 mt-3 shadow-sm" onClick={() => navigate("/")}>Go to Home</button>
                </div>
            </div>
        );
    }

    if (error === "STUDENT_NOT_FOUND" || !student) return <div className="container mt-5 text-center"><h4>🔍 Record Not Found</h4><button className="btn btn-dark rounded-pill px-4" onClick={() => navigate(-1)}>Back</button></div>;

    return (
        <div className="bg-white min-vh-100 animate__animated animate__fadeIn">
            <div className="p-3 d-flex justify-content-between border-bottom bg-white no-print shadow-sm sticky-top">
                <button className="btn btn-secondary btn-sm rounded-pill px-3" onClick={() => navigate(-1)}>← Back</button>
                <button className="btn btn-primary btn-sm rounded-pill px-4 fw-bold" onClick={downloadPDF}>Download Certificate</button>
            </div>
            <div className="d-flex justify-content-center py-4" style={{ overflowX: "auto" }}>
                <div id="overflow-card">
                    <div id="certificate-fixed-a4">
                        <div className="certificate-wrapper">
                            <div id="printResult" className="certificate-sheet-landscape m-auto">
                                <div id="watermark">
                                    <HeaderSection student={student} />
                                    <h1 className="certificate-title arial">Certificate of Course Completion</h1>
                                    <StudentInfoSection
                                        student={student}
                                        courseData={getCourseData(student.course)}
                                        grade={getGradeFromPercentage(student.percentage)}
                                    />
                                    <ModulesSection modules={getCourseData(student.course).modules} />
                                    <FooterSection student={student} issueDate={formatDate(student.issueDate)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}