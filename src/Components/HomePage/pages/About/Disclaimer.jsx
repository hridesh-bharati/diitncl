import React from "react";

export default function Disclaimer() {
  return (
    <div className="py-5 text-white" style={{ backgroundColor: "#0f172a", minHeight: "100vh" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h2 className="fw-bold text-warning mb-4 border-bottom pb-2">Disclaimer</h2>
            <p className="text-white-50">Last updated: May 2026</p>
            
            <div className="mt-4 lh-lg text-white-50">
              <p>
                The information contained in this website (<strong className="text-white">DRISHTEE COMPUTER CENTRE / DIIT</strong>) is for general information purposes only. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website.
              </p>
              
              <h5 className="text-white mt-4 fw-bold">1. Certification & Recognition</h5>
              <p>
                Our courses are vocational and skill-development oriented. Certification issued by Drishtee Computer Centre is meant for skill enhancement and employment verification. Students are advised to check eligibility criteria before applying for government sectors based on these certificates.
              </p>

              <h5 className="text-white mt-4 fw-bold">2. Technical & Typing Errors</h5>
              <p>
                There may be typographical errors or omissions in course fees, duration, or exam schedules. The management reserves the right to correct any errors without prior notice.
              </p>

              <h5 className="text-white mt-4 fw-bold">3. External Links</h5>
              <p>
                Through this website, you may be able to link to other websites which are not under the control of DIIT. We have no control over the nature, content, and availability of those sites.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}