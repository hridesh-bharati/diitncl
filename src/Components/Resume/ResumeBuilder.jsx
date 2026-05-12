// src/Components/Resume/ResumeBuilder.jsx

import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import ResumePage from "./ResumePage";

export default function ResumeBuilder() {
  const printRef = useRef();

  const [resumeData, setResumeData] = useState({
    name: "",
    role: "",
    image: "",

    personal: {
      father: "",
      mother: "",
      dob: "",
      gender: "",
      marital: "",
      nationality: "Indian",
      languages: "",
      address: "",
      phone: "",
      email: "",
      linkedin: "",
    },

    summary:
      "A motivated and hardworking student looking for an opportunity to begin a professional career and enhance technical and communication skills.",

    education: [
      {
        course: "High School",
        board: "",
        year: "",
        percentage: "",
      },
    ],

    computerSkills: [
      "MS Office",
      "Internet",
      "Typing",
    ],

    projects: [
      {
        title: "",
        details: "",
      },
    ],

    certifications: [""],

    strengths: [
      "Positive Attitude",
      "Quick Learner",
    ],

    hobbies: ["Reading"],

    declaration:
      "I hereby declare that the above information is true and correct to the best of my knowledge and belief.",
  });

  // INPUT
  const handleInput = (value, section, field) => {
    if (section) {
      setResumeData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setResumeData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // ARRAY
  const handleArray = (
    index,
    value,
    type,
    field = null
  ) => {
    const updated = [...resumeData[type]];

    if (field) {
      updated[index][field] = value;
    } else {
      updated[index] = value;
    }

    setResumeData((prev) => ({
      ...prev,
      [type]: updated,
    }));
  };

  // ADD ITEM
  const addItem = (type, template) => {
    setResumeData((prev) => ({
      ...prev,
      [type]: [...prev[type], template],
    }));
  };

  // REMOVE ITEM
  const removeItem = (type, index) => {
    const updated = [...resumeData[type]];
    updated.splice(index, 1);

    setResumeData((prev) => ({
      ...prev,
      [type]: updated,
    }));
  };

  // IMAGE
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setResumeData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  // PDF DOWNLOAD
  const downloadPDF = () => {
    const element = printRef.current;

    const opt = {
      margin: 0,
      filename: `${resumeData.name || "Resume"}.pdf`,
      image: {
        type: "jpeg",
        quality: 1,
      },

      html2canvas: {
        scale: 3,
        useCORS: true,
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container-fluid py-4 bg-light">

      <div className="row g-4">

        {/* FORM */}
        <div className="col-lg-4 p-0 m-0">

          <div className="card border-0 shadow-lg  sticky-top">

            <div className="card-header bg-dark text-white pt-lg-4 rounded-0">
              <h3 className="fw-bold mb-0">
                Resume Builder
              </h3>
            </div>

            <div
              className="card-body"
              style={{
                maxHeight: "92vh",
                overflowY: "auto",
              }}
            >

              {/* BASIC */}
              <Section title="Basic Details" />

              <input
                className="form-control mb-3"
                placeholder="Full Name"
                value={resumeData.name}
                onChange={(e) =>
                  handleInput(
                    e.target.value,
                    null,
                    "name"
                  )
                }
              />

              <input
                className="form-control mb-3"
                placeholder="Title eg: Fresher/Teacher/Frontend Developr"
                value={resumeData.role}
                onChange={(e) =>
                  handleInput(
                    e.target.value,
                    null,
                    "role"
                  )
                }
              />

              <input
                type="file"
                className="form-control mb-4"
                accept="image/*"
                onChange={handleImage}
              />

              {/* PERSONAL */}
              <Section title="Personal Details" />

              {[
                ["Father Name", "father"],
                ["Mother Name", "mother"],
                ["Phone", "phone"],
                ["Email", "email"],
                ["Address", "address"],
                ["Languages", "languages"],
              ].map(([label, field], i) => (
                <input
                  key={i}
                  className="form-control mb-3"
                  placeholder={label}
                  value={resumeData.personal[field]}
                  onChange={(e) =>
                    handleInput(
                      e.target.value,
                      "personal",
                      field
                    )
                  }
                />
              ))}

              <div className="row">
                <div className="col-6">
                  <input
                    type="date"
                    className="form-control mb-3"
                    onChange={(e) =>
                      handleInput(
                        e.target.value,
                        "personal",
                        "dob"
                      )
                    }
                  />
                </div>

                <div className="col-6">
                  <select
                    className="form-select mb-3"
                    onChange={(e) =>
                      handleInput(
                        e.target.value,
                        "personal",
                        "gender"
                      )
                    }
                  >
                    <option>Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>

              {/* SUMMARY */}
              <Section title="Career Objective" />

              <textarea
                rows="4"
                className="form-control mb-4"
                value={resumeData.summary}
                onChange={(e) =>
                  handleInput(
                    e.target.value,
                    null,
                    "summary"
                  )
                }
              />

              {/* EDUCATION */}
              <Section title="Education Qualification" />

              {resumeData.education.map((edu, i) => (
                <div
                  key={i}
                  className="border rounded-4 p-3 mb-3 bg-light"
                >

                  <input
                    className="form-control mb-2"
                    placeholder="Course"
                    value={edu.course}
                    onChange={(e) =>
                      handleArray(
                        i,
                        e.target.value,
                        "education",
                        "course"
                      )
                    }
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Board / University"
                    value={edu.board}
                    onChange={(e) =>
                      handleArray(
                        i,
                        e.target.value,
                        "education",
                        "board"
                      )
                    }
                  />

                  <div className="row">
                    <div className="col-6">
                      <input
                        className="form-control"
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) =>
                          handleArray(
                            i,
                            e.target.value,
                            "education",
                            "year"
                          )
                        }
                      />
                    </div>

                    <div className="col-6">
                      <input
                        className="form-control"
                        placeholder="Percentage"
                        value={edu.percentage}
                        onChange={(e) =>
                          handleArray(
                            i,
                            e.target.value,
                            "education",
                            "percentage"
                          )
                        }
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-sm btn-danger mt-2"
                    onClick={() =>
                      removeItem("education", i)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                className="btn btn-outline-dark w-100 mb-4"
                onClick={() =>
                  addItem("education", {
                    course: "",
                    board: "",
                    year: "",
                    percentage: "",
                  })
                }
              >
                + Add Education
              </button>

              {/* SKILLS */}
              <Section title="Computer Skills" />

              {resumeData.computerSkills.map((skill, i) => (
                <div
                  key={i}
                  className="d-flex gap-2 mb-2"
                >
                  <input
                    className="form-control"
                    value={skill}
                    onChange={(e) =>
                      handleArray(
                        i,
                        e.target.value,
                        "computerSkills"
                      )
                    }
                  />

                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      removeItem(
                        "computerSkills",
                        i
                      )
                    }
                  >
                    X
                  </button>
                </div>
              ))}

              <button
                className="btn btn-outline-dark w-100 mb-4"
                onClick={() =>
                  addItem(
                    "computerSkills",
                    ""
                  )
                }
              >
                + Add Skill
              </button>

              {/* PROJECTS */}
              <Section title="Projects" />

              {resumeData.projects.map((pro, i) => (
                <div
                  key={i}
                  className="border rounded-4 p-3 mb-3"
                >

                  <input
                    className="form-control mb-2"
                    placeholder="Project Title"
                    value={pro.title}
                    onChange={(e) =>
                      handleArray(
                        i,
                        e.target.value,
                        "projects",
                        "title"
                      )
                    }
                  />

                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Project Details"
                    value={pro.details}
                    onChange={(e) =>
                      handleArray(
                        i,
                        e.target.value,
                        "projects",
                        "details"
                      )
                    }
                  />
                </div>
              ))}

              <button
                className="btn btn-outline-dark w-100 mb-4"
                onClick={() =>
                  addItem(
                    "projects",
                    {
                      title: "",
                      details: "",
                    }
                  )
                }
              >
                + Add Project
              </button>

              {/* CERTIFICATIONS */}
              <Section title="Certifications" />

              {resumeData.certifications.map((item, i) => (
                <div
                  key={i}
                  className="d-flex gap-2 mb-2"
                >
                  <input
                    className="form-control"
                    value={item}
                    placeholder="Certification"
                    onChange={(e) =>
                      handleArray(
                        i,
                        e.target.value,
                        "certifications"
                      )
                    }
                  />

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() =>
                      removeItem(
                        "certifications",
                        i
                      )
                    }
                  >
                    X
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-dark w-100 mb-4"
                onClick={() =>
                  addItem(
                    "certifications",
                    ""
                  )
                }
              >
                + Add Certification
              </button>

              {/* DOWNLOAD */}
              <button
                className="btn btn-dark w-100 py-3 fw-bold rounded-4"
                onClick={downloadPDF}
              >
                Download Resume PDF
              </button>

            </div>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="col-lg-8 p-0 m-0">
          <ResumePage
            resumeData={resumeData}
            printRef={printRef}
          />
        </div>

      </div>
    </div>
  );
}

function Section({ title }) {
  return (
    <h5 className="fw-bold mb-3 mt-4 text-dark">
      {title}
    </h5>
  );
}