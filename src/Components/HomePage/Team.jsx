import React, { useEffect, useState, useMemo } from "react";

const Team = () => {
  const [githubData, setGithubData] = useState({
    i: "https://github.com/hridesh-bharati.png",
    repos: 0,
  });

  useEffect(() => {
    let isMounted = true;
    fetch("https://api.github.com/users/hridesh-bharati")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((d) => {
        if (isMounted) {
          setGithubData({ i: d.avatar_url, repos: d.public_repos });
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const team = useMemo(() => [
    { n: "Mr. Ajay Tiwari", r: "Director", b: "Founder & IT Expert with strong leadership & training vision.", i: "images/team/team1.avif", c: "var(--bs-primary)", ic: "bi-star" },
    { n: "Santosh Chauhan", r: "Center Head", b: "Managing daily operations & student support activities.", i: "images/team/team2.avif", c: "var(--bs-teal)", ic: "bi-building" },
    { n: "Manjesh Vishwakarma", r: "Accounts Manager", b: "Handles finance management & administrative operations.", i: "images/team/team3.avif", c: "var(--bs-orange)", ic: "bi-calculator" },
    { n: "Hridesh Bharati", r: "MERN Instructor", b: "Passionate Full Stack Developer & modern web technology trainer.", i: githubData.i, repos: githubData.repos, c: "var(--bs-indigo)", ic: "bi-code-slash" }
  ], [githubData]);

  const social = [
    { n: "telephone-fill", bg: "#eef2ff", c: "#4361ee" },
    { n: "whatsapp", bg: "#e8fff3", c: "#25d366" },
    { n: "linkedin", bg: "#e9f5ff", c: "#0077b5" },
    { n: "envelope-fill", bg: "#fff0f0", c: "#ea4335" }
  ];

  return (
    <section className="py-5 bg-light-subtle">
      <div className="container-fluid text-center">
        {/* Top App-style Badge */}
        <div className="mb-3">
          <span className="badge rounded-pill px-3 py-2 text-white bg-primary bg-opacity-75 tracking-wide small">
            <i className="bi bi-people-fill me-2"></i>OUR TEAM
          </span>
        </div>

        {/* Heading */}
        <h2 className="fw-black mb-2 display-6 tracking-tight">
          Meet Our <span className="text-primary">Experts</span>
        </h2>
        <p className="text-muted mb-5 small text-uppercase tracking-wider">Passionate professionals committed to your success</p>

        <div className="row g-4 justify-content-center">
          {team.map((m, i) => (
            <div className="col-12 col-sm-6 col-lg-3" key={i}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden team-card position-relative bg-body">
                {/* Brand Accent Bar */}
                <div className="position-absolute top-0 start-0 end-0" style={{ height: "5px", backgroundColor: m.c }}></div>
                
                <div className="card-body p-4 d-flex flex-column align-items-center pt-5">
                  {/* Avatar Frame */}
                  <div className="rounded-circle p-1 mb-3 bg-light border" style={{ width: 105, height: 105 }}>
                    <img src={m.i} alt={m.n} className="rounded-circle w-100 h-100 object-fit-cover" loading="lazy" />
                  </div>

                  <h5 className="fw-bold text-dark mb-1 h6">{m.n}</h5>
                  
                  {/* Dynamic Custom Badge */}
                  <span className="badge px-2 py-1.5 mb-3 rounded-pill text-white fw-medium shadow-sm" style={{ backgroundColor: m.c, fontSize: "11px" }}>
                    <i className={`bi ${m.ic} me-1`}></i> {m.r}
                  </span>

                  <p className="text-secondary small mb-4 flex-grow-1 lh-sm">{m.b}</p>

                  {/* Clean UI Integration for Github Metrics */}
                  {m.repos !== undefined && m.repos > 0 && (
                    <div className="mb-3">
                      <span className="badge bg-dark-subtle text-dark-emphasis rounded-pill px-2.5 py-1 fw-normal border border-secondary-subtle">
                        <i className="bi bi-github me-1"></i>{m.repos} public repos
                      </span>
                    </div>
                  )}

                  <hr className="w-100 opacity-25 my-3" />

                  {/* Native Feel Actions */}
                  <div className="d-flex justify-content-center gap-2">
                    {social.map((s, idx) => (
                      <a key={idx} href="#" className="social-btn" style={{ backgroundColor: s.bg, color: s.c }} aria-label={s.n}>
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
          width: 36px; height: 36px; 
          display: flex; align-items: center; justify-content: center; 
          border-radius: 10px; text-decoration: none; font-size: 15px; 
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s;
        }
        .social-btn:hover { filter: brightness(0.92); transform: scale(1.12); }
        .team-card { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s; border: 1px solid rgba(0,0,0,0.03) !important; }
        .team-card:hover { transform: translateY(-6px); box-shadow: 0 1rem 3rem rgba(0,0,0,0.08) !important; }
        .fw-black { font-weight: 800; }
        .tracking-wide { letter-spacing: 0.05em; }
        .tracking-wider { letter-spacing: 0.08em; font-size: 0.75rem; }
        .tracking-tight { letter-spacing: -0.02em; }
      `}</style>
    </section>
  );
};

export default Team;