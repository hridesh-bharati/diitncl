import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const data = [
  { title: "Drishtee Society", img: "images/thumbnails/Certificate3.png", desc: "ISO 9001 : 2008" },
  { title: "NIELIT", img: "images/thumbnails/Certificate2.png", desc: "Govt. of India" },
  { title: "Society Reg.", img: "images/thumbnails/Certificate1.png", desc: "Reg No 72/2013" },
  { title: "Algol Trust", img: "images/thumbnails/Certificate4.png", desc: "KSOU / AUT" },
];

export default function Certificate() {
  const [show, setShow] = useState(false);
  const [img, setImg] = useState("");

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* App Header */}
      <div
        className="sticky-top text-center py-3"
        style={{
          background: "rgba(255,255,255,.8)",
          backdropFilter: "blur(10px)",
          zIndex: 2
        }}
      >
        <b className="text-primary">
          <i className="bi bi-patch-check-fill me-2"></i>Certificates
        </b>
        <small className="text-muted d-block text-center">
          Verified & Government Recognized
        </small>
      </div>

      {/* Grid List */}
      <div className="container p-3">
        <div className="row g-3">
          {data.map((c, i) => (
            <div key={i} className="col-12 col-md-6">
              <div
                className="d-flex align-items-center p-3 rounded-4 shadow-sm bg-white"
                onClick={() => { setImg(c.img); setShow(true); }}
                style={{ cursor: "pointer" }}
              >
                <img src={c.img} alt="" width="60" className="rounded me-3" />
                <div>
                  <div className="fw-semibold">{c.title}</div>
                  <small className="text-muted">{c.desc}</small>
                </div>
                <i className="bi bi-chevron-right ms-auto text-muted"></i>
              </div>
            </div>
          ))}
        </div>

        <h6 className="fw-bold mt-4 mb-2">
          <i className="bi bi-shield-check me-2"></i>
          Why Certifications Matter?
        </h6>
        <p className="small mb-0 opacity-90">
          Certifications ensure trust, authenticity and help students
          pursue education & jobs globally with confidence.
        </p>
      </div>

      {/* Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Body className="p-0">
          <img src={img} alt="" className="w-100 rounded" />
        </Modal.Body>
      </Modal>
    </div>
  );
}
