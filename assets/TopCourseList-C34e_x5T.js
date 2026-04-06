import{j as e,L as t}from"./vendor-core-mhOduRYu.js";const i=[{id:1,src:"images/course/oLevel.avif",title:"O-Level",desc:"Digital Literacy & IT",dur:"12 Months",theme:"#4f46e5"},{id:2,src:"images/course/ccc.avif",title:"CCC",desc:"Govt. Literacy Cert.",dur:"3 Months",theme:"#f59e0b"},{id:3,src:"images/course/software.avif",title:"Software",desc:"Full Stack Mastery",dur:"6 Months",theme:"#10b981"},{id:4,src:"images/course/reactJs.avif",title:"React",desc:"Frontend Web Dev",dur:"4 Months",theme:"#06b6d4"},{id:5,src:"images/course/python.avif",title:"Python",desc:"AI & Data Science",dur:"5 Months",theme:"#3b82f6"},{id:6,src:"images/course/tally.avif",title:"Tally",desc:"ERP & Accounting",dur:"3 Months",theme:"#dc2626"}];function l(){return e.jsxs("section",{className:"py-5 bg-light",id:"programs",children:[e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-end mb-5 px-2 scroll-animate fade-down",children:[e.jsxs("div",{children:[e.jsx("span",{className:"badge bg-danger-subtle text-danger mb-2 px-3 py-2 rounded-pill fw-bold",style:{fontSize:"10px"},children:"🔥 MOST POPULAR"}),e.jsxs("h2",{className:"display-6 fw-black mb-0 text-dark",children:["Explore ",e.jsx("span",{className:"text-primary",children:"Programs"})]})]}),e.jsx(t,{to:"/courses",className:"btn btn-outline-dark rounded-pill px-4 fw-bold transition-all shadow-sm",children:"View All Courses"})]}),e.jsx("div",{className:"row g-4",children:i.map((s,r)=>e.jsx("div",{className:`col-12 col-md-6 col-lg-4 scroll-animate zoom-in delay-${r%3+1}`,children:e.jsx(t,{to:"/courses",className:"text-decoration-none",children:e.jsxs("article",{className:"course-card-modern position-relative overflow-hidden bg-white p-3 rounded-4 border border-light-subtle shadow-sm",children:[e.jsx("div",{className:"hover-glow",style:{backgroundColor:s.theme}}),e.jsxs("div",{className:"d-flex align-items-center position-relative",style:{zIndex:2},children:[e.jsx("div",{className:"thumb-container flex-shrink-0 rounded-4 overflow-hidden d-flex align-items-center justify-content-center shadow-sm",style:{width:"85px",height:"85px",background:`linear-gradient(135deg, ${s.theme}15, ${s.theme}05)`,border:`1px solid ${s.theme}20`},children:e.jsx("img",{src:s.src,alt:s.title,width:"85",height:"85",loading:"lazy",className:"img-fluid p-2 object-fit-contain"})}),e.jsxs("div",{className:"ms-3 flex-grow-1",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-1",children:[e.jsx("span",{className:"fw-bolder text-uppercase ls-1",style:{color:s.theme,fontSize:"10px"},children:s.title}),e.jsxs("div",{className:"badge bg-light text-muted fw-normal border",style:{fontSize:"10px"},children:[e.jsx("i",{className:"bi bi-clock me-1 text-primary"}),s.dur]})]}),e.jsx("h3",{className:"h6 fw-bold text-dark mb-1",children:s.desc}),e.jsxs("div",{className:"d-flex align-items-center justify-content-between mt-2",children:[e.jsx("span",{className:"text-muted extra-small",children:"ISO Certified"}),e.jsxs("span",{className:"enroll-link fw-bold text-primary",style:{fontSize:"11px"},children:["Join Now ",e.jsx("i",{className:"bi bi-arrow-right-short ms-1"})]})]})]})]})]})})},s.id))})]}),e.jsx("style",{children:`
        .ls-1 { letter-spacing: 1px; }
        .extra-small { font-size: 11px; }
        
        .course-card-modern {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .hover-glow {
          position: absolute;
          width: 100px;
          height: 100px;
          filter: blur(50px);
          opacity: 0;
          top: -20px;
          right: -20px;
          transition: 0.4s ease;
          border-radius: 50%;
          z-index: 1;
        }

        .course-card-modern:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
          border-color: rgba(0,0,0,0.1) !important;
        }

        .course-card-modern:hover .hover-glow {
          opacity: 0.15;
        }

        .course-card-modern:hover .thumb-container {
          transform: scale(1.1) rotate(-3deg);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }

        .thumb-container {
          transition: all 0.4s ease;
        }

        .enroll-link {
          transition: 0.3s;
          position: relative;
        }

        .course-card-modern:hover .enroll-link {
          padding-right: 5px;
        }

        .fw-black { font-weight: 900; }
      `})]})}export{l as default};
