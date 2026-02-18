// src\AdminComponents\Certificate\StudentCertificate.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner, Image, Alert } from "react-bootstrap";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './StudentCertificate.css';

import { staticCourses } from "../../Components/HomePage/pages/Course/courseData";

// =================== UTILITY FUNCTIONS ===================
const formatDate = (dateString) => {
    if (!dateString) return "---";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const day = date.getDate().toString().padStart(2, "0");
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
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

// =================== DYNAMIC COURSE LOGIC ===================
const getCourseData = (courseName) => {
    if (!courseName) return { fullName: "", duration: "", hours: "", modules: [] };

    const found = staticCourses.find(
        (c) => c.name?.toUpperCase().trim() === courseName.toUpperCase().trim()
    );

    if (!found) {
        return {
            fullName: courseName,
            duration: "",
            hours: "",
            modules: []
        };
    }

    const durationMonths = parseInt(found.duration);
    let fixedHours = "";

    if (durationMonths === 18) {
        fixedHours = "720 Hrs."; 
    } else if (durationMonths === 15) {
        fixedHours = "580 Hrs."; 
    } else if (durationMonths === 12) {
        fixedHours = "480 Hrs."; 
    } else if (durationMonths === 6) {
        fixedHours = "230 Hrs."; 
    } else if (durationMonths === 3) {
        fixedHours = "120 Hrs."; 
    }else {
        // Fallback formula
        fixedHours = `${durationMonths * 40} Hrs.`;
    }

    return {
        fullName: found.description?.split('-')[0]?.trim() || found.name,
        duration: `${found.duration} Months`,
        hours: fixedHours, 
        modules: found.subjects?.map(s => s.name) || []
    };
};


// =================== REUSABLE COMPONENTS ===================
const HeaderSection = ({ student }) => (
    <div className="certificate-header-grid">
        <div>
            <img src="/images/icon/logo.png" alt="DIIT" className="header-logo-img ms-4" crossOrigin="anonymous" />
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
                        src={student.photoUrl}
                        alt="Student"
                        className="certificate-photo"
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
            <span className="certificate-body-text">This certificate is awarded to Mr/Miss</span>
            <span className="certificate-name text-uppercase">
                {" "}{student.name} S/O {student.fatherName || "FATHER_NAME"}
            </span>
        </p>
        <p className="p-0 m-0">
            <span className="certificate-body-text">
                On the successfully completion of a <b>{courseData.duration}</b> ( {courseData.hours}) course, titled
            </span>
        </p>
        <h4 className="certificate-course-title py-1 m-0">{courseData.fullName}</h4>
        <p>
            <span className="certificate-body-text">with grade & Percentage </span>
            <span className="certificate-grade-highlight">
                <u>{grade} & {student.percentage || "N/A"}%</u>
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
                {modules.length > 0 ? (
                    modules.map((module, index) => (
                        <span key={index} className="certificate-module-item p-0 my-0">
                            {index + 1}. {module}
                        </span>
                    ))
                ) : (
                    <span className="certificate-module-item p-0 my-0">No modules available</span>
                )}
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
                <p className="m-0 certificate-footer-text">
                    Date of Issue : <span className="dbluetext">{issueDate}</span>
                </p>
            </div>
        </div>

        <div className="d-flex justify-content-between mt-2 fw-bold certificate-footer-reg px-5 py-1"
            style={{ borderTop: "1px solid darkblue", borderBottom: "1px solid darkblue" }}
        >
            <div>
                <span className="dbluetext">Student Reg No. :</span>
                <span className="text-uppercase">{student.regNo || "N/A"}</span>
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
                <span>Reg Office: Harredeeh, ward No.5, Nichalul, Distt-Maharajganj (273304) </span>
                <span className="small ms-4">https://www.drishteeindia.com</span>
            </p>
        </div>
    </div>
);

// =================== CERTIFICATE CONTENT ===================
const CertificateContent = ({ student }) => {
    const courseData = useMemo(() => getCourseData(student.course), [student.course]);
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

// =================== MAIN COMPONENT - DIRECT FETCH ===================
export default function StudentCertificate({ student: propStudent }) {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [student, setStudent] = useState(propStudent || null);
    const [loading, setLoading] = useState(!propStudent);
    const [error, setError] = useState(null);

    // 🔥 DIRECT DOCUMENT FETCH - AdmissionProvider HATAYA
    useEffect(() => {
        // Agar prop se student mil raha hai toh fetch mat karo
        if (propStudent) {
            setStudent(propStudent);
            setLoading(false);
            return;
        }

        // Direct document fetch by ID
        const fetchStudent = async () => {
            try {
                setLoading(true);
                console.log("🔍 Fetching student with ID:", id);
                
                const docRef = doc(db, "admissions", id);
                const docSnap = await getDoc(docRef);
                
                console.log("📄 Document exists?", docSnap.exists());
                
                if (docSnap.exists()) {
                    const studentData = { id: docSnap.id, ...docSnap.data() };
                    console.log("✅ Student found:", studentData.name);
                    setStudent(studentData);
                    setError(null);
                } else {
                    console.log("❌ No student found with ID:", id);
                    setError("STUDENT_NOT_FOUND");
                    setStudent(null);
                }
            } catch (err) {
                console.error("🔥 Firestore Error:", err);
                setError(err.message);
                setStudent(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id, propStudent]);

    // 📥 PDF Download handler
    const downloadPDF = useCallback(() => {
        const printResult = document.getElementById("printResult");
        if (!printResult) {
            toast.error("Certificate not ready");
            return;
        }

        toast.info("📄 Generating PDF...");

        html2pdf()
            .set({
                margin: 0,
                filename: `certificate_${student?.name || 'student'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    allowTaint: false,
                    logging: false,
                    width: 1123, 
                    height: 794 
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: [297, 210], 
                    orientation: 'landscape' 
                }
            })
            .from(printResult)
            .save()
            .then(() => {
                toast.success("✅ PDF Downloaded Successfully!");
            })
            .catch((error) => {
                console.error("📛 PDF Error:", error);
                toast.error("Failed to generate PDF");
            });
    }, [student]);

    // ⏳ Loading state
    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
                <Spinner animation="border" variant="primary" className="mb-3" style={{ width: "3rem", height: "3rem" }} />
                <p className="text-muted">Loading certificate...</p>
            </div>
        );
    }

    // ❌ Student not found
    if (error === "STUDENT_NOT_FOUND") {
        return (
            <div className="container mt-5">
                <Alert variant="warning" className="text-center p-5">
                    <Alert.Heading className="mb-4">🔍 Student Not Found</Alert.Heading>
                    <p className="mb-3">No record found with ID: <strong>{id}</strong></p>
                    <p className="mb-4 text-muted small">Check if the ID is correct or the student exists in database</p>
                    <div className="d-flex gap-3 justify-content-center">
                        <Button variant="outline-warning" onClick={() => navigate(-1)} size="lg">
                            ← Go Back
                        </Button>
                        <Button variant="warning" onClick={() => window.location.reload()} size="lg">
                            🔄 Try Again
                        </Button>
                    </div>
                </Alert>
            </div>
        );
    }

    // ⚠️ Other errors
    if (error) {
        return (
            <div className="container mt-5">
                <Alert variant="danger" className="text-center p-5">
                    <Alert.Heading className="mb-4">⚠️ Error Loading Certificate</Alert.Heading>
                    <p className="mb-4">{error}</p>
                    <div className="d-flex gap-3 justify-content-center">
                        <Button variant="outline-danger" onClick={() => navigate(-1)} size="lg">
                            ← Go Back
                        </Button>
                        <Button variant="danger" onClick={() => window.location.reload()} size="lg">
                            🔄 Retry
                        </Button>
                    </div>
                </Alert>
            </div>
        );
    }

    // 📄 No student data
    if (!student) {
        return (
            <div className="container mt-5">
                <Alert variant="info" className="text-center p-5">
                    <Alert.Heading className="mb-4">📄 No Data Available</Alert.Heading>
                    <Button variant="outline-info" onClick={() => navigate(-1)} size="lg">
                        ← Go Back
                    </Button>
                </Alert>
            </div>
        );
    }

    // ✅ Success - Show Certificate
    return (
        <div className="bg-white min-vh-100">
            <div className="p-3 d-flex justify-content-between border-bottom bg-white no-print">
                <Button variant="light" onClick={() => navigate(-1)}>
                    ← Back
                </Button>
                <div className="d-flex">
                    <Button variant="primary" onClick={downloadPDF}>
                      Download
                    </Button>
                </div>
            </div>
            <div className="d-flex justify-content-center py-4" style={{ overflowX: "auto" }}>
                <CertificateContent student={student} />
            </div>
        </div>
    );
}
