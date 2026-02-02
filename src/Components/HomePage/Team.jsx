import React, { useEffect, useState } from "react";
import "./Team.css"; // We'll create this file next
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Team = () => {
  const tpath = "images/team/team";
  const [hrideshData, setHrideshData] = useState({
    name: "Hridesh Rao",
    bio: "Frontend & MERN Stack Developer",
    image: "https://via.placeholder.com/150",
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
      bio: "Founder of DIIT with 20+ years of experience in IT and education. Leading with vision and passion.",
      image: `${tpath}1.png`,
      badges: ["🎓 Education Expert", "🥇 Top Mentor"],
      socialLinks: { phone: "tel:+919918151032", whatsapp: "https://wa.me/919918151032", linkedin: "#" },
    },
    {
      name: "Santosh Chauhan",
      role: "Center Head",
      bio: "Handles administrative operations, student support, and strategic decisions with utmost dedication.",
      image: `${tpath}2.png`,
      badges: ["🎯 Management Pro"],
      socialLinks: { phone: "tel:+917398889347", whatsapp: "https://wa.me/917398889347", linkedin: "#" },
    },
    {
      name: "Manjesh Vishwakarma",
      role: "Senior Accounts Executive",
      bio: "Specialist in digital finance, business accounting, and official documentation with accuracy.",
      image: `${tpath}3.png`,
      badges: ["📈 Finance Pro"],
      socialLinks: { phone: "tel:+919621444858", whatsapp: "https://wa.me/919621444858", linkedin: "#" },
    },
    {
      name: hrideshData.name,
      role: "Technical Instructor",
      bio: hrideshData.bio,
      image: hrideshData.image,
      repoCount: hrideshData.repos,
      badges: [
        "🚀 MERN Specialist",
        ...(hrideshData.repos >= 20 ? ["⭐ Star Developer"] : []),
      ],
      socialLinks: {
        whatsapp: "https://wa.me/917267995307",
        linkedin: "https://www.linkedin.com/in/hridesh-bharati-95867425b/",
        github: "https://github.com/hridesh-bharati",
      },
    },
  ];

  return (
    <section className="team-section py-5" id="team">
      <div className="container">
        <div className="text-center mb-5 mt-4">
          <h2 className="section-title">
            Meet Our <span className="text-highlight">Expert Team</span>
          </h2>
          <div className="title-underline"></div>
          <p className="section-subtitle mt-3">
            Passionate educators and professionals shaping the future of tech and business education.
          </p>
        </div>

        <div className="row g-5 ">
          {expertData.map((member, index) => (
            <div className="col-12 col-sm-6 col-lg-3" key={index}>
              <div className="expert-card">
                <div className="card-top-design"></div>
                <div className="expert-image-container">
                  <img src={member.image} alt={member.name} className="expert-img" />
                </div>
                
                <div className="expert-info text-center">
                  <h4 className="expert-name">{member.name}</h4>
                  <p className="expert-role">{member.role}</p>
                  
                  <div className="badge-container">
                    {member.badges.map((badge, bIdx) => (
                      <span key={bIdx} className="custom-badge">{badge}</span>
                    ))}
                  </div>

                  <p className="expert-bio">{member.bio}</p>

                  {member.repoCount !== undefined && (
                    <div className="github-metric">
                      <i className="bi bi-github"></i>
                      <span>{member.repoCount} Projects</span>
                    </div>
                  )}

                  <div className="social-tray">
                    {Object.entries(member.socialLinks).map(([key, url]) => (
                      <a key={key} href={url} target="_blank" rel="noreferrer" className={`social-icon ${key}`}>
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