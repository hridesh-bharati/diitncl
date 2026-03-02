// FAQ.jsx
import React from "react";

const faqs = [
  { q: "How to enroll in courses?", a: "You can enroll by visiting the 'Courses' page and selecting your desired program." },
  { q: "How to verify my certificate?", a: "Go to 'Verify ID' page and enter your certificate ID for verification." },
  { q: "Support contact?", a: "Call +91 7267995307 or email support@diitcenter.com" },
  { q: "Do you offer online courses?", a: "Yes, select online courses under 'Courses' page." },
];

export default function FAQ() {
  return (
    <div className="container py-5 mt-5">
      <h1 className="text-center text-primary mb-4">Frequently Asked Questions</h1>
      <div className="accordion" id="faqAccordion">
        {faqs.map((faq, i) => (
          <div className="accordion-item mb-2" key={i}>
            <h2 className="accordion-header" id={`heading${i}`}>
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${i}`} aria-expanded="false" aria-controls={`collapse${i}`}>
                {faq.q}
              </button>
            </h2>
            <div id={`collapse${i}`} className="accordion-collapse collapse" aria-labelledby={`heading${i}`} data-bs-parent="#faqAccordion">
              <div className="accordion-body">{faq.a}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}