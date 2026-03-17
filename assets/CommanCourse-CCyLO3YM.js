import{r as l,j as e,L as x,R as f}from"./index-Cugp0svB.js";import{s as u}from"./courseData-CeKRB8nL.js";const g=({data:s,searchQuery:r,setSearchQuery:a})=>e.jsxs("div",{className:"paytm-nav-card p-3 p-md-4 bg-white rounded-4 border-bottom-blue shadow-sm mb-4 container-fluid",children:[e.jsxs("div",{className:"row align-items-center g-3",children:[e.jsxs("div",{className:"col-12 col-md-6",children:[e.jsxs("nav",{className:"d-flex align-items-center gap-1 text-uppercase fw-bold text-muted mb-1 small tracking-wider",children:[e.jsxs(x,{to:"/",className:"text-decoration-none text-paytm-blue d-flex align-items-center gap-1",children:[e.jsx("i",{className:"bi bi-house-door-fill"})," Home"]}),e.jsx("i",{className:"bi bi-chevron-right",style:{fontSize:"12px"}}),e.jsx("span",{children:s})]}),e.jsxs("h2",{className:"fw-800 text-paytm-dark m-0 fs-1-5",children:[s," ",e.jsx("span",{className:"text-paytm-blue",children:"List"})]})]}),e.jsx("div",{className:"col-12 col-md-5 col-lg-4 ms-auto",children:e.jsxs("div",{className:"search-box d-flex align-items-center gap-2 px-3 py-2 rounded-3 border bg-light-soft transition-all",children:[e.jsx("i",{className:"bi bi-search text-secondary",style:{fontSize:"18px"}}),e.jsx("input",{type:"text",className:"form-control border-0 p-0 bg-transparent shadow-none small fw-medium text-paytm-dark",placeholder:"Search courses...",value:r,onChange:i=>a(i.target.value)})]})})]}),e.jsx("style",{children:`
        .text-paytm-blue { color: #00BAF2; }
        .text-paytm-dark { color: #002970; }
        .bg-light-soft { background: #F0F3F8; border-color: #E8EEF3; }
        .border-bottom-blue { border-bottom: 4px solid #00BAF2; }
        .fw-800 { font-weight: 800; }
        .tracking-wider { letter-spacing: 0.5px; font-size: 0.7rem; }
        
        .search-box:focus-within { 
          background: #fff; 
          border-color: #00BAF2; 
          box-shadow: 0 0 0 3px rgba(0, 186, 242, 0.1); 
        }

        @media (min-width: 768px) { .fs-1-5 { font-size: 1.75rem; } }
        @media (max-width: 767px) { 
           .paytm-nav-card { border-radius: 0; margin-left: -12px; margin-right: -12px; }
           .fs-1-5 { font-size: 1.35rem; }
        }
        .transition-all { transition: all 0.2s ease-in-out; }
      `})]}),j=l.memo(g),m={computer:"#1A237E",diploma:"#2E7D32",web:"#1565C0",programming:"#00695C",nielit:"#D84315",design:"#6A1B9A",default:"#4F46E5"},w=f.memo(({course:s,themeColor:r})=>{const[a,i]=l.useState(!1),n=a?s.subjects:s.subjects.slice(0,8);return e.jsx("div",{className:"col-12 col-md-6 mb-4",children:e.jsxs("div",{className:"card h-100 border-0 shadow-sm rounded-4 overflow-hidden shadow-hover",children:[e.jsxs("div",{className:"p-4 text-white",style:{background:`linear-gradient(135deg, ${r} 0%, ${r}dd 100%)`},children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-start",children:[e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:"bg-white bg-opacity-25 rounded-3 p-2 d-flex shadow-sm",children:e.jsx("i",{className:"bi bi-layers",style:{fontSize:"28px"}})}),e.jsx("h4",{className:"ms-3 mb-0 fw-bold fs-pc-name",children:s.name})]}),e.jsxs("div",{className:"bg-white text-dark px-3 py-1 rounded-pill fw-bold small shadow-sm fs-pc-duration",children:[e.jsx("i",{className:"bi bi-clock me-1"})," ",s.duration," Mo"]})]}),e.jsx("p",{className:"mt-3 mb-0 opacity-90 fw-medium fs-pc-desc min-h-3",children:s.description})]}),e.jsxs("div",{className:"card-body p-4 d-flex flex-column",children:[e.jsxs("h6",{className:"text-uppercase text-muted fw-bold mb-3 small tracking-wider",children:["Modules (",s.subjects.length,")"]}),e.jsx("div",{className:"row row-cols-2 g-2 mb-3",children:n.map(t=>e.jsx("div",{className:"col",children:e.jsxs("div",{className:"subject-tag d-flex align-items-center h-100 bg-light rounded-3 p-2 border border-white shadow-sm",children:[e.jsx("i",{className:"bi bi-check-circle-fill text-success me-2 flex-shrink-0",style:{fontSize:"14px"}}),e.jsx("span",{className:"text-dark fw-medium text-truncate small",children:t.name})]})},t.id))}),s.subjects.length>8&&e.jsx("button",{onClick:()=>i(!a),className:"btn btn-sm text-primary fw-bold p-0 mb-4 border-0 bg-transparent d-flex align-items-center",children:a?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-dash me-1"})," Less"]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-plus me-1"})," View All"]})}),e.jsxs(x,{to:"/new-admission",className:"btn w-100 rounded-3 py-3 fw-bold d-flex align-items-center justify-content-between text-white border-0 shadow-sm jio-btn-hover mt-auto",style:{backgroundColor:r},children:[e.jsx("span",{className:"ps-2 fs-pc-btn",children:"Enroll Now"}),e.jsx("div",{className:"bg-black bg-opacity-10 rounded-circle p-1 d-flex",children:e.jsx("i",{className:"bi bi-chevron-right",style:{fontSize:"22px"}})})]})]})]})})});function y({targetCourses:s,CTitle:r}){const[a,i]=l.useState(""),n=l.useMemo(()=>{const t=a.trim().toLowerCase(),h=s.includes("All");return u.filter(c=>{const d=c.name.toLowerCase(),b=h||s.some(o=>o.toLowerCase()===d),p=!t||d.includes(t)||c.subjects.some(o=>o.name.toLowerCase().includes(t));return b&&p})},[a,s]);return e.jsxs("div",{className:"min-vh-100 py-4 bg-light",children:[e.jsxs("div",{className:"container-xxl",children:[e.jsx("div",{className:"bg-white p-3 mb-5 shadow-sm rounded-3 border",style:{top:"1rem",zIndex:1},children:e.jsx(j,{data:r,searchQuery:a,setSearchQuery:i})}),e.jsx("div",{className:"row g-4 justify-content-center",children:n.length>0?n.map(t=>e.jsx(w,{course:t,themeColor:m[t.category?.toLowerCase()]||m.default},t.id)):e.jsx("div",{className:"col-12 text-center py-5",children:e.jsx("h3",{className:"text-muted",children:"No courses found"})})})]}),e.jsx("style",{children:`
        .shadow-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .shadow-hover:hover { transform: translateY(-7px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
        .subject-tag:hover { background: #fff !important; transform: scale(1.02); }
        .jio-btn-hover:hover { filter: brightness(1.1); letter-spacing: 0.5px; }
        .jio-btn-hover:active { transform: scale(0.98); }
        .min-h-3 { min-height: 3.2rem; }
        .tracking-wider { letter-spacing: 1px; }
        @media (min-width: 992px) {
          .fs-pc-name { font-size: 1.6rem !important; }
          .fs-pc-duration { font-size: 0.85rem !important; }
          .fs-pc-desc { font-size: 0.9rem !important; }
          .fs-pc-btn { font-size: 1.05rem !important; }
        }
      `})]})}export{y as C};
