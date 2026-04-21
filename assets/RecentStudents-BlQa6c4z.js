import{r as s,j as e,L as u}from"./vendor-core-DGkiYJBS.js";import{q as b,y as p,z as x,k as f,b as h,o as g}from"./vendor-firebase-BNrxU5dI.js";function w(){const[r,l]=s.useState([]),[n,i]=s.useState(!0),o=t=>!t||!t.includes("cloudinary")?"/images/icon/default-avatar.png":t.replace("/upload/","/upload/w_400,h_500,c_fill,g_face,f_auto,q_auto/");return s.useEffect(()=>{const t=b(f(h,"admissions"),x("createdAt","desc"),p(8)),d=g(t,c=>{const m=c.docs.map(a=>({id:a.id,...a.data()}));l(m),i(!1)});return()=>d()},[]),n?null:e.jsxs("div",{className:"container-fluid px-3 py-4",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-3",children:[e.jsxs("h5",{className:"fw-bold m-0",style:{color:"#0a2885"},children:["Our New Students ",e.jsx("span",{className:"badge bg-danger-subtle text-danger ms-1 small",style:{fontSize:"10px"},children:"New"})]}),e.jsx(u,{to:"/new-admission",className:"btn btn-sm btn-primary rounded-pill px-3 border-0 fw-bold",children:"Admission"})]}),e.jsx("div",{className:"d-flex gap-3 overflow-auto pb-3 custom-scrollbar",style:{scrollSnapType:"x mandatory"},children:r.map(t=>e.jsxs("div",{className:"student-card-fb shadow-sm bg-white rounded-4 overflow-hidden border border-light",style:{minWidth:"160px",maxWidth:"160px",scrollSnapAlign:"start"},children:[e.jsxs("div",{className:"position-relative",style:{height:"180px"},children:[e.jsx("img",{src:o(t.photoUrl),alt:t.name,className:"w-100 h-100 object-fit-cover",loading:"lazy"}),e.jsx("div",{className:"position-absolute top-0 start-0 m-2",children:e.jsx("span",{className:"badge bg-dark bg-opacity-50 blur-filter shadow-sm",style:{fontSize:"9px"},children:t.branch==="DIIT124"?"Main":"East"})})]}),e.jsxs("div",{className:"p-2 text-start",children:[e.jsx("h6",{className:"fw-bold text-dark text-truncate mb-0",style:{fontSize:"13px"},children:t.name}),e.jsx("p",{className:"text-muted mb-2 text-truncate",style:{fontSize:"11px"},children:t.course||"DIIT Student"})]})]},t.id))}),e.jsx("style",{children:`
        .student-card-fb {
          transition: transform 0.3s ease;
        }
        .student-card-fb:hover {
          transform: translateY(-5px);
        }
        .blur-filter {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0a288522;
          border-radius: 10px;
        }
      `})]})}export{w as default};
