import React, { useEffect, useState } from "react";

const Team = () => {
  const [hridesh, setHridesh] = useState({ name: "Hridesh Rao", bio: "Frontend & MERN Stack Developer", img: "", repos: 0 });

  useEffect(() => {
    fetch("https://api.github.com/users/hridesh-bharati")
      .then(res => res.json())
      .then(d => setHridesh({ name: d.name || "Hridesh Rao", bio: d.bio || "MERN Stack Developer", img: d.avatar_url, repos: d.public_repos }))
      .catch(() => { });
  }, []);

  const expertData = [
    { n: "Mr. Ajay Tiwari", r: "Director", b: "Founder & IT Expert with 20+ years experience.", i: "images/team/team1.avif", c: "#6366f1" },
    { n: "Santosh Chauhan", r: "Center Head", b: "Operations and student support management.", i: "images/team/team2.avif", c: "#10b981" },
    { n: "Manjesh Vishwakarma", r: "Accounts Executive", b: "Specialist in finance and business accounting.", i: "images/team/team3.avif", c: "#f59e0b" },
    { n: hridesh.name, r: "Technical Instructor", b: hridesh.bio, i: hridesh.img, c: "#ec4899", gh: hridesh.repos }
  ];

  return (
    <section className="py-5 bg-light" id="team">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold h1">Meet Our <span className="text-primary">Expert Team</span></h2>
          <p className="text-muted">The pillars of Drishtee's excellence.</p>
        </div>

        <div className="row g-4">
          {expertData.map((m, idx) => (
            <div className="col-12 col-md-6 col-lg-3" key={idx}>
              <div className="card h-100 border-0 shadow-sm text-center p-3 rounded-4" style={{ transition: '0.3s' }}>
                <div className="mx-auto mb-3 position-relative" style={{ width: "110px", height: "110px" }}>
                  <img src={m.i} alt={m.n} className="rounded-circle border" loading="lazy" width="110" height="110" style={{ objectFit: 'cover' }} />
                </div>

                <h5 className="fw-bold mb-0">{m.n}</h5>
                <small className="fw-bold text-uppercase d-block mb-3" style={{ color: m.c, fontSize: '10px', letterSpacing: '1px' }}>{m.r}</small>

                {/* Bio Section with Clamp */}
                <p className="text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {m.b}
                </p>

                {m.gh !== undefined && (
                  <div className="badge bg-dark mb-3 py-2 px-3 rounded-pill" style={{ fontSize: '10px' }}>
                    <i className="bi bi-github me-1"></i> {m.gh} Repos
                  </div>
                )}

                <div className="d-flex justify-content-center gap-3 pt-2 border-top">
                  <a href="#" aria-label="Call" className="text-secondary"><i className="bi bi-telephone"></i></a>
                  <a href="#" aria-label="WhatsApp" className="text-success"><i className="bi bi-whatsapp"></i></a>
                  <a href="#" aria-label="LinkedIn" className="text-primary"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Custom CSS for Hover Effect (Injected) */}
      <style>{`.card:hover { transform: translateY(-8px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }`}</style>
    </section>
  );
};

export default Team;