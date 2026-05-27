import React from "react";
import { Link } from "react-router-dom";

export default function HomeAbout() {
  return (
    <section className="container-fluid py-3">
      <div className="row p-2 bg-white shadow-sm overflow-hidden align-items-stretch">

        {/* Image Section */}
        <div className="col-lg-6 p-0">
          {/* <img
            src="images/vender/home1.webp"
            alt="Drishtee Computer Center"
            className="img-fluid w-100 h-100"
            style={{ objectFit: "cover" }}
          /> */}
          <img
            src="about.webp"
            className="img-fluid"
            width="600"
            height="400"
            alt="Drishtee Computer Center"
          />
        </div>

        {/* Content Section */}
        <div className="col-lg-6 bg-light d-flex flex-column justify-content-center p-4 p-lg-5">

          {/* Tag */}
          <div>
            <span
              className="badge rounded-pill px-3 py-2 mb-3 bg-maroon-light text-maroon"
              style={{ fontSize: "0.85rem" }}
            >
              Since 2007 • Nichlaul
            </span>
          </div>

          {/* Title */}
          <h2 className="fw-bold mb-3 text-dark lh-base">
            Welcome to Drishtee Computer Center
          </h2>

          {/* Divider */}
          <div
            className="rounded mb-4 bg-maroon"
            style={{ width: "70px", height: "4px" }}
          ></div>

          {/* Shortened Paragraph 1 */}
          <p
            className="text-secondary lh-lg"
            style={{ textAlign: "justify", fontSize: "1rem" }}
          >
            <strong>Drishtee Computer Center</strong>, established in
            <strong> 2007 </strong> in Nichlaul, has been a trusted
            name in computer education and skill development for
            nearly two decades, successfully guiding thousands of students toward brighter careers.
          </p>

          {/* Shortened Paragraph 2 */}
          <p
            className="text-secondary lh-lg mb-4"
            style={{ textAlign: "justify", fontSize: "1rem" }}
          >
            We focus on providing modern technical knowledge and practical training in Software, Accounting, Designing, and Programming to build real-world expertise.
          </p>

          {/* Button */}
          <div>
            <Link
              to="/about"
              className="btn px-4 py-2 rounded-pill fw-semibold text-white bg-maroon"
            >
              Read More
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}