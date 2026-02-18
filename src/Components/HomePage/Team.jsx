import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Team.css"

const Team = () => {
  const tpath = "images/team/team";

  const [hrideshData, setHrideshData] = useState({
    name: "Hridesh Rao",
    bio: "Frontend & MERN Stack Developer",
    image: "",
    repos: 0,
  });

  useEffect(() => {
    fetch("https://api.github.com/users/hridesh-bharati")
      .then((res) => res.json())
      .then((data) => {
        setHrideshData({
          name: data.name || "Hridesh Rao",
          bio: data.bio || "Frontend & MERN Stack Developer",
          image: data.avatar_url || "",
          repos: data.public_repos || 0,
        });
      })
      .catch((err) => console.error("GitHub fetch error:", err));
  }, []);

  const expertData = [
    {
      name: "Mr. Ajay Tiwari",
      role: "Director",
      bio: "Founder of DIIT with 20+ years of experience in IT and education. Leading with vision.",
      image: `${tpath}1.png`,
      badges: ["🎓 Education Expert", "🥇 Top Mentor"],
      color: "#6366f1", // Indigo
      socialLinks: { phone: "tel:+919918151032", whatsapp: "https://wa.me/919918151032", linkedin: "#" },
    },
    {
      name: "Santosh Chauhan",
      role: "Center Head",
      bio: "Handles administrative operations, student support, and strategic decisions with dedication.",
      image: `${tpath}2.png`,
      badges: ["🎯 Management Pro"],
      color: "#10b981", // Emerald
      socialLinks: { phone: "tel:+917398889347", whatsapp: "https://wa.me/917398889347", linkedin: "#" },
    },
    {
      name: "Manjesh Vishwakarma",
      role: "Senior Accounts Executive",
      bio: "Specialist in digital finance, business accounting, and official documentation compliance.",
      image: `${tpath}3.png`,
      badges: ["📈 Financial Pro"],
      color: "#f59e0b", // Amber
      socialLinks: { phone: "tel:+919621444858", whatsapp: "https://wa.me/919621444858", linkedin: "#" },
    },
    {
      name: hrideshData.name,
      role: "Technical Instructor",
      bio: hrideshData.bio,
      image: hrideshData.image,
      repoCount: hrideshData.repos,
      isGithub: true,
      color: "#ec4899", // Rose
      badges: [
        "🚀 MERN Specialist",
        ...(hrideshData.repos >= 20 ? ["⭐ Star Dev"] : []),
      ],
      socialLinks: {
        phone: "tel:+917267995307",
        whatsapp: "https://wa.me/917267995307",
        linkedin: "https://www.linkedin.com/in/hridesh-bharati-95867425b/",
        github: "https://github.com/hridesh-bharati",
      },
    },
  ];

  return (
    <section className="team-section py-5" id="team">
      <div className="container">
        <div className="text-center mb-5 animate-up">
          <span className="badge-modern mb-2">OUR FACULTY</span>
          <h2 className="display-5 fw-900 text-dark">
            Meet Our <span className="text-gradient-fancy">Expert Team</span>
          </h2>
          <div className="divider-custom mx-auto"></div>
        </div>

        <div className="row g-4">
          {expertData.map((member) => (
            <div className="col-12 col-sm-6 col-lg-3" key={member.name}>
              <div className={`modern-member-card ${member.isGithub ? 'github-glow' : ''}`}>
                <div className="card-top-accent" style={{ background: member.color }}></div>
                
                <div className="avatar-container">
                  <div className="avatar-ring" style={{ borderColor: member.color }}></div>
                  <img src={member.image} alt={member.name} className="member-img" />
                </div>

                <div className="member-info">
                  <h5 className="member-name">{member.name}</h5>
                  <p className="member-role" style={{ color: member.color }}>{member.role}</p>
                  
                  <div className="badge-shelf">
                    {member.badges.map((b, i) => (
                      <span key={i} className="mini-badge">{b}</span>
                    ))}
                  </div>

                  <p className="member-bio">{member.bio}</p>

                  {member.repoCount !== undefined && (
                    <div className="github-stat">
                      <i className="bi bi-github me-1"></i>
                      <span>{member.repoCount} Public Repos</span>
                    </div>
                  )}

                  <div className="social-rack mt-4">
                    {Object.entries(member.socialLinks).map(([key, url]) => (
                      <a key={key} href={url} target="_blank" rel="noreferrer" className={`social-bubble ${key}`}>
                        <i className={`bi bi-${key === 'phone' ? 'telephone' : key}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Team;