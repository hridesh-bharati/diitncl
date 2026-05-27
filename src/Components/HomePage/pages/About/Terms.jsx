import React from "react";

export default function TermsConditions() {
  return (
    <div className="py-5 text-white" style={{ backgroundColor: "#0f172a", minHeight: "100vh" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h2 className="fw-bold text-warning mb-4 border-bottom pb-2">Terms & Conditions</h2>
            <p className="text-white-50">Please read these terms carefully before enrolling.</p>

            <div className="mt-4 text-white-50 lh-lg">
              <h5 className="text-white fw-bold">1. Admission & Enrollment</h5>
              <p>
                Admission to any course at Drishtee Computer Centre is provisional until all required documents (ID proof, academic certificates) and admission fees are verified.
              </p>

              <h5 className="text-white mt-4 fw-bold">2. Fee Policy & Refunds</h5>
              <ul>
                <li>Fees once paid (Admission, Tuition, or Exam fee) will <strong>not be refunded</strong> or transferred under any circumstances.</li>
                <li>Monthly installments must be paid by the 10th of every month, failing which a late fine may apply.</li>
              </ul>

              <h5 className="text-white mt-4 fw-bold">3. Attendance & Examination</h5>
              <p>
                A minimum of <strong>75% attendance</strong> is mandatory to appear in the final certification examinations. If a student fails to appear in exams, re-examination charges may apply.
              </p>

              <h5 className="text-white mt-4 fw-bold">4. Code of Conduct</h5>
              <p>
                Students must maintain strict discipline inside the computer lab and premises. Any damage to lab equipment or property will be fined directly to the responsible student.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}