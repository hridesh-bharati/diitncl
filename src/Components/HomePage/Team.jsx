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
        <h2 className="fw-bold mb-4">Meet Our <span className="text-primary">Experts</span></h2>
        <div className="row g-3">
          {team.map((m, i) => (
            <div className="col-12 col-md-3" key={i}>
              <div className="card h-100 border-0 shadow-sm rounded-4 t-card bg-white overflow-hidden p-3">
                <div className="mx-auto mb-2 rounded-circle p-1" style={{ background: m.g, width: 80, height: 80 }}>
                  <img src={m.i} alt="" className="rounded-circle w-100 h-100 border border-2 border-white object-fit-cover" />
                </div>
                <h6 className="fw-bold mb-0 text-truncate small">{m.n}</h6>
                <small className="text-uppercase fw-bold text-muted extra-small">{m.r}</small>
                <p className="text-muted mt-2 mb-2 extra-small">{m.b}</p>
                {m.gh && <div className="badge bg-dark rounded-pill mb-2 extra-small"><i className="bi bi-github"></i> {m.gh}</div>}
                <div className="d-flex justify-content-center gap-2 border-top pt-2 mt-auto">
                  {['telephone', 'whatsapp', 'linkedin'].map(ic => <a key={ic} href="#" className="text-secondary" aria-label="Drishtee team"><i className={`bi bi-${ic}`}></i></a>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`.t-card{transition:0.3s}.t-card:hover{transform:translateY(-5px)}.extra-small{font-size:10px}.object-fit-cover{object-fit:cover}`}</style>
    </section>
  );
};

export default Team;