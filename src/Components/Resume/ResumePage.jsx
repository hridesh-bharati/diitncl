// src/Components/Resume/ResumePage.jsx

import React from "react";

export default function ResumePage({
  resumeData,
  printRef,
}) {
  return (
    <div
      ref={printRef}
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "auto",
        background: "#fff",
        fontFamily: "'Poppins', sans-serif",
        color: "#1f2937",
        boxShadow: "0 0 15px rgba(0,0,0,0.08)",
      }}
    >

      {/* HEADER */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#0f172a,#1e293b)",
          color: "#fff",
          padding: "22px 35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <div style={{ width: "78%" }}>

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: "700",
              lineHeight: "1.2",
            }}
          >
            {resumeData.name || "YOUR NAME"}
          </h1>

          <h3
            style={{
              marginTop: "4px",
              marginBottom: "10px",
              fontWeight: "400",
              color: "#cbd5e1",
              fontSize: "17px",
            }}
          >
            {resumeData.role || "Frontend Developer"}
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "12px",
              color: "#e2e8f0",
            }}
          >
            <span>
              📞 {resumeData.personal.phone}
            </span>

            <span>
              ✉️ {resumeData.personal.email}
            </span>

            <span>
              📍 {resumeData.personal.address}
            </span>
          </div>

        </div>

        {resumeData.image && (
          <img
            src={resumeData.image}
            alt="profile"
            style={{
              width: "105px",
              height: "105px",
              objectFit: "cover",
              border: "2px solid #475569",
            }}
          />
        )}

      </div>

      {/* BODY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "31% 69%",
        }}
      >

        {/* LEFT */}
        <div
          style={{
            background: "#f8fafc",
            padding: "25px",
            borderRight: "1px solid #e5e7eb",
          }}
        >

          <SectionTitle title="Personal Details" />

          <Info
            label="Father"
            value={resumeData.personal.father}
          />

          <Info
            label="Mother"
            value={resumeData.personal.mother}
          />

          <Info
            label="DOB"
            value={resumeData.personal.dob}
          />

          <Info
            label="Gender"
            value={resumeData.personal.gender}
          />

          <Info
            label="Languages"
            value={resumeData.personal.languages}
          />

          <Info
            label="Nationality"
            value={resumeData.personal.nationality}
          />

          {/* SKILLS */}
          <SectionTitle title="Skills" />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >

            {resumeData.computerSkills.map(
              (skill, i) => (
                <span
                  key={i}
                  style={{
                    background: "#0f172a",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "30px",
                    fontSize: "11px",
                  }}
                >
                  {skill}
                </span>
              )
            )}

          </div>

          {/* STRENGTHS */}
          <SectionTitle title="Strengths" />

          <ul style={ulStyle}>
            {resumeData.strengths.map(
              (item, i) => (
                <li key={i}>{item}</li>
              )
            )}
          </ul>

          {/* HOBBIES */}
          <SectionTitle title="Hobbies" />

          <ul style={ulStyle}>
            {resumeData.hobbies.map(
              (item, i) => (
                <li key={i}>{item}</li>
              )
            )}
          </ul>

        </div>

        {/* RIGHT */}
        <div
          style={{
            padding: "25px 32px",
          }}
        >

          {/* SUMMARY */}
          <SectionTitle title="Career Objective" />

          <p style={paragraphStyle}>
            {resumeData.summary}
          </p>

          {/* EDUCATION */}
          <SectionTitle title="Education Qualification" />

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >

            <thead>

              <tr
                style={{
                  background: "#0f172a",
                  color: "#fff",
                }}
              >

                <th style={tableStyle}>Eligibility</th>

                <th style={tableStyle}>
                  Board / University
                </th>

                <th style={tableStyle}>Year</th>

                <th style={tableStyle}>%</th>

              </tr>

            </thead>

            <tbody>

              {resumeData.education.map(
                (edu, i) => (
                  <tr key={i}>

                    <td style={tableStyle}>
                      {edu.course}
                    </td>

                    <td style={tableStyle}>
                      {edu.board}
                    </td>

                    <td style={tableStyle}>
                      {edu.year}
                    </td>

                    <td style={tableStyle}>
                      {edu.percentage}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

          {/* PROJECTS */}
          {resumeData.projects?.[0]?.title && (
            <>
              <SectionTitle title="Projects" />

              {resumeData.projects.map(
                (pro, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: "14px",
                    }}
                  >

                    <h4
                      style={{
                        fontSize: "15px",
                        marginBottom: "4px",
                      }}
                    >
                      {pro.title}
                    </h4>

                    <p style={paragraphStyle}>
                      {pro.details}
                    </p>

                  </div>
                )
              )}
            </>
          )}

          {/* CERTIFICATIONS */}
          {resumeData.certifications.some(
            (c) => c.trim() !== ""
          ) && (
            <>
              <SectionTitle title="Certifications" />

              <ul style={ulStyle}>
                {resumeData.certifications.map(
                  (item, i) =>
                    item && (
                      <li key={i}>
                        {item}
                      </li>
                    )
                )}
              </ul>
            </>
          )}

          {/* DECLARATION */}
          <div
            style={{
              marginTop: "35px",
              width: "100%",
            }}
          >

            <SectionTitle title="Declaration" />

            <p style={paragraphStyle}>
              {resumeData.declaration}
            </p>

          </div>

          {/* FOOTER */}
          <div
            style={{
              marginTop: "45px",
              width: "100%",
              display: "flex",
              justifyContent:
                "space-between",
            }}
          >

            <div>
              <strong>Date:</strong>
            </div>

            <div>
              <strong>Signature</strong>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

/* SECTION */
const SectionTitle = ({
  title,
}) => (
  <h2
    style={{
      fontSize: "20px",
      marginTop: "18px",
      marginBottom: "14px",
      color: "#0f172a",
      fontWeight: "700",
    }}
  >
    {title}

    <div
      style={{
        width: "50px",
        height: "3px",
        background: "#0f172a",
        marginTop: "5px",
        borderRadius: "10px",
      }}
    />
  </h2>
);

/* INFO */
const Info = ({
  label,
  value,
}) => (
  <p
    style={{
      fontSize: "13px",
      marginBottom: "8px",
      lineHeight: "1.6",
    }}
  >
    <strong>{label}:</strong>{" "}
    {value}
  </p>
);

/* PARAGRAPH */
const paragraphStyle = {
  lineHeight: "1.8",
  fontSize: "13px",
  color: "#374151",
  textAlign: "justify",
};

/* UL */
const ulStyle = {
  paddingLeft: "18px",
  lineHeight: "1.9",
  fontSize: "13px",
};

/* TABLE */
const tableStyle = {
  border: "1px solid #cbd5e1",
  padding: "10px",
  fontSize: "13px",
  textAlign: "left",
};