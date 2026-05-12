import React, { useEffect, useState } from "react";

const Team = () => {
  const [hridesh, setHridesh] = useState({ n: "Hridesh Bharati", i: "https://github.com/hridesh-bharati.png", repos: 0 });

  useEffect(() => {
    fetch("https://api.github.com/users/hridesh-bharati")
      .then(res => res.json())
      .then(d => setHridesh(prev => ({ ...prev, i: d.avatar_url, repos: d.public_repos })))
      .catch(() => {});
  }, []);

  const team = [
    { n: "Mr. Ajay Tiwari", r: "Director", b: "Founder & IT Expert with strong leadership & training vision.", i: "images/team/team1.avif", c: "#2b4c8c", ic: "bi-star" },
    { n: "Santosh Chauhan", r: "Center Head", b: "Managing daily operations & student support activities.", i: "images/team/team2.avif", c: "#1d7a72", ic: "bi-building" },
    { n: "Manjesh Vishwakarma", r: "Accounts Manager", b: "Handles finance management & administrative operations.", i: "images/team/team3.avif", c: "#d67d1d", ic: "bi-calculator" },
    { ...hridesh, r: "MERN Instructor", b: "Passionate Full Stack Developer & modern web technology trainer.", c: "#8a3ab9", ic: "bi-code-slash" }
  ];

  const social = [
    { n: "telephone-fill", bg: "#eef2ff", c: "#4361ee" },
    { n: "whatsapp", bg: "#e8fff3", c: "#25d366" },
    { n: "linkedin", bg: "#e9f5ff", c: "#0077b5" },
    { n: "envelope-fill", bg: "#fff0f0", c: "#ea4335" }
  ];

  return (
    <section className="py-5 " style={{ backgroundColor: "#f8f9ff" }}>
      <div className="container text-center">
        {/* Top Badge */}
        <div className="mb-3">
          <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#6343e4" }}>
            <i className="bi bi-people-fill me-2"></i> Our Team
          </span>
        </div>

        {/* Heading */}
        <h1 className="fw-bold mb-2 display-5">
          Meet Our <span style={{ color: "#6343e4" }}>Experts</span>
        </h1>
        <p className="text-muted mb-5">Passionate professionals committed to your success</p>

        <div className="row g-4  justify-content-center">
          {team.map((m, i) => (
            <div className="col-12 col-sm-6 col-lg-3" key={i}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden team-card">
                <div style={{ height: "6px", backgroundColor: m.c }}></div>
                <div className="card-body p-4 d-flex flex-column align-items-center">
                  
                  {/* Image Container */}
                  <div className="rounded-circle border border-4 p-1 mb-3" style={{ borderColor: m.c, width: 115, height: 115 }}>
                    <img src={m.i} alt={m.n} className="rounded-circle w-100 h-100 object-fit-cover" />
                  </div>

                  <h5 className="fw-bold mb-1">{m.n}</h5>
                  
                  <span className="badge px-3 py-2 mb-3" style={{ backgroundColor: m.c, fontSize: "10px" }}>
                    <i className={`bi ${m.ic} me-1`}></i> {m.r}
                  </span>

                  <p className="text-muted small mb-4 flex-grow-1 lh-base">{m.b}</p>

                  {m.repos !== undefined && (
                    <div className="mb-3">
                      <span className="badge bg-dark rounded-pill px-3 py-1 fw-normal">
                        <i className="bi bi-github me-1"></i> {m.repos} repos
                      </span>
                    </div>
                  )}

                  <hr className="w-100 opacity-10 mb-3" />

                  {/* Social Icons */}
                  <div className="d-flex justify-content-center gap-2">
                    {social.map((s, idx) => (
                      <a key={idx} href="#" className="social-btn" style={{ backgroundColor: s.bg, color: s.c }}>
                        <i className={`bi bi-${s.n}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .social-btn { 
          width: 34px; height: 34px; 
          display: flex; align-items: center; justify-content: center; 
          border-radius: 50%; text-decoration: none; font-size: 14px; 
          transition: 0.2s;
        }
        .social-btn:hover { filter: brightness(0.95); transform: scale(1.1); }
        .team-card { transition: transform 0.3s ease; }
        .team-card:hover { transform: translateY(-8px); }
      `}</style>
    </section>
  );
};

export default Team;