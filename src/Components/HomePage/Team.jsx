import React, { useEffect, useState } from "react";

const Team = () => {
  const [h, setH] = useState({ n: "Hridesh Rao", i: "https://github.com/hridesh-bharati.png", gh: null });

  useEffect(() => {
    fetch("https://api.github.com/users/hridesh-bharati")
      .then(res => res.json()).then(d => setH({ n: d.name || "Hridesh Rao", i: d.avatar_url, gh: d.public_repos }))
      .catch(() => {});
  }, []);

  const team = [
    { n: "Mr. Ajay Tiwari", r: "Director", b: "Founder & IT Expert.", i: "images/team/team1.avif", g: "linear-gradient(45deg, #6366f1, #a855f7)" },
    { n: "Santosh Chauhan", r: "Center Head", b: "Operations Support.", i: "images/team/team2.avif", g: "linear-gradient(45deg, #10b981, #3b82f6)" },
    { n: "Manjesh Vishwakarma", r: "Accounts", b: "Finance Specialist.", i: "images/team/team3.avif", g: "linear-gradient(45deg, #f59e0b, #ef4444)" },
    { ...h, r: "Instructor", b: "MERN Stack Dev.", g: "linear-gradient(45deg, #ec4899, #8b5cf6)" }
  ];

  return (
    <section className="py-5 bg-light" id="team">
      <div className="container text-center">
        
        {/* Header Animation */}
        <div className="scroll-animate fade-down mb-5">
          <h2 className="fw-bold mb-2">Meet Our <span className="text-primary">Experts</span></h2>
          <p className="text-muted small">The dedicated professionals behind Drishtee's success.</p>
        </div>

        <div className="row g-3">
          {team.map((m, i) => (
            <div 
              className={`col-12 col-md-3 scroll-animate zoom-in delay-${(i % 4) + 1}`} 
              key={i}
            >
              <div className="card h-100 border-0 shadow-sm rounded-4 t-card bg-white overflow-hidden p-3">
                <div className="mx-auto mb-2 rounded-circle p-1" style={{ background: m.g, width: 80, height: 80 }}>
                  <img 
                    src={m.i} 
                    alt={m.n} 
                    className="rounded-circle w-100 h-100 border border-2 border-white object-fit-cover shadow-sm" 
                  />
                </div>
                
                <h6 className="fw-bold mb-0 text-truncate small">{m.n}</h6>
                <small className="text-uppercase fw-bold text-muted extra-small">{m.r}</small>
                <p className="text-muted mt-2 mb-2 extra-small">{m.b}</p>
                
                {m.gh && (
                  <div className="badge bg-dark rounded-pill mb-2 extra-small">
                    <i className="bi bi-github me-1"></i> {m.gh} Repos
                  </div>
                )}

                <div className="d-flex justify-content-center gap-3 border-top pt-2 mt-auto">
                  {['telephone', 'whatsapp', 'linkedin'].map(ic => (
                    <a key={ic} href="#" className="text-secondary social-link" aria-label="Drishtee team">
                      <i className={`bi bi-${ic}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .t-card { transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .t-card:hover { 
          transform: translateY(-8px); 
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
          border: 1px solid #0d6efd20 !important;
        }
        .social-link { transition: 0.2s; font-size: 14px; }
        .social-link:hover { color: #0d6efd !important; transform: scale(1.2); }
        .extra-small { font-size: 10px; }
        .object-fit-cover { object-fit: cover; }
      `}</style>
    </section>
  );
};

export default Team;