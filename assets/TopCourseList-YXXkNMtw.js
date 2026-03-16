import{j as e,L as t}from"./index-O8tDaz_c.js";const r=[{id:1,src:"images/course/oLevel.avif",title:"O-Level",desc:"Digital Literacy & IT",dur:"12 Months",theme:"#4f46e5"},{id:2,src:"images/course/ccc.avif",title:"CCC",desc:"Govt. Literacy Cert.",dur:"3 Months",theme:"#f59e0b"},{id:3,src:"images/course/software.avif",title:"Software",desc:"Full Stack Mastery",dur:"6 Months",theme:"#10b981"},{id:4,src:"images/course/reactJs.avif",title:"React",desc:"Frontend Web Dev",dur:"4 Months",theme:"#06b6d4"},{id:5,src:"images/course/python.avif",title:"Python",desc:"AI & Data Science",dur:"5 Months",theme:"#3b82f6"},{id:6,src:"images/course/tally.avif",title:"Tally",desc:"ERP & Accounting",dur:"3 Months",theme:"#dc2626"}];function a(){return e.jsxs("section",{className:"py-5 bg-light",id:"programs",children:[e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-end mb-4 px-2",children:[e.jsxs("div",{children:[e.jsx("h6",{className:"text-danger fw-bold mb-1",style:{letterSpacing:"1px",fontSize:"12px"},children:"TOP RATED"}),e.jsx("h2",{className:"h4 fw-bold mb-0 text-dark",children:"Explore Programs"})]}),e.jsx(t,{to:"/courses",className:"btn btn-sm btn-white shadow-sm rounded-pill px-3 fw-bold border text-dark",children:"View All"})]}),e.jsx("div",{className:"row g-4",children:r.map(s=>e.jsx("div",{className:"col-12 col-md-6 col-lg-4",children:e.jsx(t,{to:"/courses",className:"text-decoration-none",children:e.jsxs("article",{className:"premium-course-card d-flex align-items-center p-3 bg-white rounded-4 shadow-sm border-0",children:[e.jsx("div",{className:"flex-shrink-0 rounded-3 overflow-hidden d-flex align-items-center justify-content-center",style:{width:"90px",height:"90px",backgroundColor:`${s.theme}10`,border:`1px solid ${s.theme}20`},children:e.jsx("img",{src:s.src,alt:s.title,className:"img-fluid p-2",style:{width:"100%",height:"100%",objectFit:"contain"}})}),e.jsxs("div",{className:"ms-3 flex-grow-1 overflow-hidden",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-1",children:[e.jsx("span",{className:"fw-bold extra-small text-uppercase",style:{color:s.theme},children:s.title}),e.jsxs("span",{className:"text-muted",style:{fontSize:"10px"},children:[e.jsx("i",{className:"bi bi-calendar3 me-1"}),s.dur]})]}),e.jsx("h3",{className:"h6 fw-bold text-dark mb-1 text-truncate",children:s.desc}),e.jsx("p",{className:"text-muted mb-0 extra-small",children:"Certified by Drishtee Institute"}),e.jsxs("div",{className:"mt-2 d-flex align-items-center text-primary fw-bold",style:{fontSize:"11px"},children:["Enroll Now ",e.jsx("i",{className:"bi bi-arrow-right ms-1"})]})]})]})})},s.id))})]}),e.jsx("style",{children:`
        .extra-small { font-size: 11px; }
        .premium-course-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .premium-course-card:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
          background: #fff;
        }
        .premium-course-card:hover img {
          transform: rotate(-5deg) scale(1.1);
        }
        .premium-course-card img {
          transition: 0.3s ease;
        }
      `})]})}export{a as default};
