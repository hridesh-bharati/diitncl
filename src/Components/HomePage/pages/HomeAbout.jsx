import React from "react";
import { Link } from "react-router-dom";

export default function HomeAbout() {
  return (
    <section className="container-fluid py-3">
      <div className="row p-2 bg-white shadow-sm overflow-hidden align-items-stretch">

        {/* Image Section */}
        <div className="col-lg-6 p-0">
          <img
            src="images/vender/home.webp"
            className="img-fluid"
            width="1200"
            height="800"
            alt="Drishtee Computer Center"
          />
        </div>

        {/* Content Section */}
        <div className="col-lg-6 bg-light d-flex flex-column justify-content-center p-3">

          {/* Tag */}
          <div>
            <span
              className="badge rounded-pill px-3 pb-2 mb-3 bg-maroon-light text-maroon"
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
            className="rounded bg-maroon"
            style={{ width: "70px", height: "4px" }}
          ></div>

          <p className="text-muted lh-lg">
            <strong>Drishtee Computer Center</strong>, established in <strong>2007</strong>, is the pioneer IT skill development ecosystem and top-rated <strong>computer institute in Nichlaul</strong>. For nearly two decades, we have been bridging the digital divide by transforming thousands of local students into career-ready IT professionals.
          </p>

          <p className="text-muted lh-lg">
            Our government-aligned curriculum provides advanced practical training across high-demand industry segments including <strong>Software Engineering, Financial Accounting (Tally Prime), Graphic Designing, and Full-Stack Programming</strong> to build real-world corporate competencies.
          </p>

          

          {/* Button */}
          <div>
            <Link
              to="/about"
              className="btn px-4 py-2 rounded-pill fw-semibold text-white bg-maroon w-100"
            >
              Read More
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}