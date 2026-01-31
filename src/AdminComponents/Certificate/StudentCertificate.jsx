// src/AdminComponents/Certificate/StudentCertificate.jsx
import React, { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spinner, Image } from "react-bootstrap";
import AdmissionProvider from "../Admissions/AdmissionProvider";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './StudentCertificate.css'

// =================== UTILITY FUNCTIONS ===================
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")
    }/${date.getFullYear()}`;
};

const getCenterCode = (regNum) => {
  if (!regNum) return "DIIT000";
  const match = regNum.match(/^(DIIT\d{3})\//);
  return match ? match[1] : "DIIT000";
};

// =================== CERTIFICATE CONTENT ===================
const CertificateContent = ({ student }) => {
  if (!student) return <p className="text-danger mt-5 p-4">Student not found</p>;
  const StdCourseHrs = student.duration ? parseInt(student.duration) * 40 : 0;

  return (
    <div id="overflow-card">
      <div id="certificate-fixed-a4">
        <div className="certificate-wrapper">
          <div id="printResult" className="certificate-sheet-landscape m-auto">
            <div id="watermark" style={{ border: "12px solid var(--certificate-primary2)" }}>

              {/* HEADER */}
              <div className="certificate-header-grid">
                <div>
                  <img src="/images/icon/logo.png" alt="DIIT" className="header-logo-img" />
                </div>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="ps-4">
                    <h1 className="certificate-main-title">DRISHTEE</h1>
                    <p className="certificate-sub-title fw-bold cert-center">An ISO 9001:2008 Certified Institute</p>
                  </div>
                  <div>
                    <div className="certificate-photo-container">
                      <Image src={student.photoUrl || "/avatar.png"} alt="Student" className="certificate-photo" />
                    </div>
                  </div>
                </div>
                <div className="text-end cert-right fw-bold">
                  <p>Reg Under Society Act 21, 1860 Govt. of India</p>
                  <p className="e">Reg No : 72/2013-14</p>
                </div>
              </div>

              {/* TITLE */}
              <h1 className="certificate-title">Certificate of Course Completion</h1>

              {/* BODY */}
              <div className="certificate-body-grid p-2 text-center text-black">
                <p className="certificate-awarded-to d-inline">
                  <span className="h5">This Certificate is awarded to Mr./Miss</span>
                  <span className="certificate-name"> {student.name} S/O {student.fatherName}</span>
                </p>
                <p className="my-2">
                  <span className="h5">
                    on the successful Completion of a <b>{student.duration}</b> and <b>({StdCourseHrs} Hrs.)</b> course, titled
                  </span>
                </p>
                <h4 className="certificate-course-title py-1 m-0">{student.course}</h4>
                <p className="mt-1">
                  <span className="h5">with grade & percentage </span>
                  <span className="certificate-grade-highlight">Excellent & {student.percentage || 100}%</span>
                </p>

                {/* MODULES COVERED */}
                {student.subjects?.length > 0 && (
                  <div className="mt-1 row">
                    <div className="col-3 text-center">
                      <p className="m-0"><b>Modules Covered:</b></p>
                    </div>
                    <div className="col-9">
                      <ul className="d-flex flex-wrap gap-2 p-0 m-0 list-group-numbered">
                        {student.subjects.map(sub => (
                          <li key={sub._id} className="certificate-module-item list-group-item">{sub.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* SIGNATURE & FOOTER */}
                <div className="certificateFooter">
                  <table className="w-100">
                    <tbody>
                      <tr>
                        <td className="text-start ps-5">
                          <img src="/images/vender/signature.png" alt="Sign" style={{ width: "200px" }} />
                          <h6 className="dbluetext fw-bold m-2">Chief Exam Controller</h6>
                        </td>
                        <td></td>
                        <td className="text-end pe-5 pt-4 fw-bold ftrTExt">
                          Date of issue: <span className="dbluetext">{formatDate(student.issueDate)}</span>
                        </td>
                      </tr>
                      <tr className="text-center fw-bold ftrTExt" style={{ borderTop: "1px solid darkblue", borderBottom: "1px solid darkblue" }}>
                        <td colSpan={2}><span className="dbluetext">Student Reg No.:</span> <span className="text-uppercase">{student.regNo}</span></td>
                        <td><span className="dbluetext">Center Code:</span> <span className="me-5">{getCenterCode(student.regNo)}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =================== MAIN COMPONENT ===================
export default function StudentCertificate({ student: propStudent }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const downloadPDF = useCallback(() => {
    const printResult = document.getElementById("printResult");
    if (!printResult) return alert("Element not found.");

    html2pdf().from(printResult).set({
      margin: 0,
      filename: "certificate.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 4, useCORS: true, scrollY: 0 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    }).save();
  }, []);

  return (
    <AdmissionProvider>
      {({ admissions, loading }) => {
        if (loading)
          return <div className="vh-100 d-flex justify-content-center align-items-center"><Spinner /></div>;

        // Use propStudent if passed (verification page), else fallback to id route (admin page)
        const student = propStudent || admissions.find(s => String(s.id) === String(id));

        if (!student)
          return (
            <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
              <h6 className="text-danger">Student not found</h6>
              <Button size="sm" onClick={() => navigate(-1)}>Go Back</Button>
            </div>
          );

        return (
          <div className="container-fluid bg-light min-vh-100 p-3 text-center">
            <CertificateContent student={student} />
            <div className="download-row text-center p-4">
              <button className="btn btn-sm hover-btn" onClick={downloadPDF}>
                <img src="/images/icon/download.png" className="img-fluid" alt="Download" />
              </button>
              <h6 className="mt-2">Download your E-Certificate</h6>
            </div>
          </div>
        );
      }}
    </AdmissionProvider>
  );
}
