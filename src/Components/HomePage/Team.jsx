import React, { useEffect, useState } from "react";

const Team = () => {
  const [hridesh, setH] = useState({ name: "Hridesh Rao", img: "https://github.com/hridesh-bharati.png", repos: null });

  useEffect(() => {
    fetch("https://api.github.com/users/hridesh-bharati")
      .then(res => res.json()).then(d => setH({ name: d.name || "Hridesh Rao", img: d.avatar_url, repos: d.public_repos }))
      .catch(() => {});
  }, []);

  const team = [
    { n: "Mr. Ajay Tiwari", r: "Director", b: "Founder & IT Expert (20+ yrs).", i: "images/team/team1.avif", g: "linear-gradient(45deg, #6366f1, #a855f7)" },
    { n: "Santosh Chauhan", r: "Center Head", b: "Operations & Student Support.", i: "images/team/team2.avif", g: "linear-gradient(45deg, #10b981, #3b82f6)" },
    { n: "Manjesh Vishwakarma", r: "Accounts", b: "Finance & Accounting Specialist.", i: "images/team/team3.avif", g: "linear-gradient(45deg, #f59e0b, #ef4444)" },
    { n: hridesh.name, r: "Instructor", b: "MERN Stack Developer.", i: hridesh.img, g: "linear-gradient(45deg, #ec4899, #8b5cf6)", gh: hridesh.repos }
  ];

  return (
    <section className="py-5 bg-light" id="team">
      <div className="container text-center">
        <h2 className="fw-bold mb-5">Meet Our <span className="text-primary">Experts</span></h2>
        <div className="row g-4">
          {team.map((m, i) => (
            <div className="col-md-3" key={i}>
              <div className="card h-100 border-0 shadow-sm rounded-4 t-card bg-white overflow-hidden">
                <div style={{ height: 5, background: m.g }}></div>
                <div className="p-4">
                  <div className="mx-auto mb-3 rounded-circle p-1" style={{ background: m.g, width: 90, height: 90 }}>
                    <img src={m.i} alt={m.n} className="rounded-circle w-100 h-100 border border-3 border-white" style={{ objectFit: 'cover' }} />
                  </div>
                  <h6 className="fw-bold mb-1">{m.n}</h6>
                  <small className="text-uppercase fw-bold text-muted" style={{ fontSize: 9 }}>{m.r}</small>
                  <p className="text-muted small my-3" style={{ fontSize: 13 }}>{m.b}</p>
                  {m.gh != null && <div className="badge bg-dark rounded-pill mb-3" style={{fontSize: 10}}><i className="bi bi-github"></i> {m.gh} Repos</div>}
                  <div className="d-flex justify-content-center gap-3 border-top pt-3">
                    <a href="#" className="text-secondary small"><i className="bi bi-telephone"></i></a>
                    <a href="#" className="text-success small"><i className="bi bi-whatsapp"></i></a>
                    <a href="#" className="text-primary small"><i className="bi bi-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`.t-card { transition: 0.3s; cursor: pointer; } .t-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1)!important; }`}</style>
    </section>
  );
};

export default Team;