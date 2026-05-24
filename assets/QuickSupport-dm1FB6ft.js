import{r as d,j as e,Q as m}from"./vendor-core-TkMK1fGt.js";import{x as u,f as p,b,k as x}from"./vendor-firebase-DugSJznP.js";import{s as h,b as f}from"./emailService-C-4JixY0.js";const y=()=>{const s={fullName:"",mobile:"",email:"",title:"",query:""},[a,r]=d.useState(s),[i,n]=d.useState(!1),l=t=>{r(o=>({...o,[t.target.name]:t.target.value}))},c=async t=>{t.preventDefault();try{n(!0),await u(p(b,"studentQueries"),{...a,timestamp:x(),status:"pending"}),await h("hridesh027@gmail.com",`New Inquiry: ${a.title}`,f(a)),new Audio("/audio/ring.mp3").play().catch(()=>{}),m.success("Query Sent Successfully!"),r(s)}catch(o){m.error(o.message||"System Error")}finally{n(!1)}};return e.jsxs("form",{onSubmit:c,className:"row g-4 p-4",children:[e.jsx("h1",{className:"text-dark text-center fw-bolder",children:"Quick Support"}),e.jsx("hr",{className:"text-primary"}),[{n:"fullName",l:"Full Name",t:"text",i:"person"},{n:"mobile",l:"Mobile Number",t:"tel",i:"phone"},{n:"email",l:"Email Address",t:"email",i:"envelope"},{n:"title",l:"Subject/Course",t:"text",i:"journal-text"}].map(t=>e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"form-floating android-input",children:[e.jsx("input",{type:t.t,name:t.n,className:"form-control border-0 border-bottom rounded-0 px-0 shadow-none bg-transparent",placeholder:t.l,value:a[t.n],onChange:l,required:!0}),e.jsxs("label",{className:"px-0 text-muted small",children:[e.jsx("i",{className:`bi bi-${t.i} me-2`}),t.l]})]})},t.n)),e.jsx("div",{className:"col-12 mt-4",children:e.jsxs("div",{className:"form-floating android-input",children:[e.jsx("textarea",{name:"query",className:"form-control border-0 border-bottom rounded-0 px-0 shadow-none bg-transparent",placeholder:"Message",style:{height:90},value:a.query,onChange:l,required:!0}),e.jsxs("label",{className:"px-0 text-muted small",children:[e.jsx("i",{className:"bi bi-chat-dots me-2"}),"How can we help?"]})]})}),e.jsxs("div",{className:"col-12 d-flex gap-2 mt-5",children:[e.jsx("button",{type:"button",className:"btn btn-light rounded-circle p-3 shadow-sm border",onClick:()=>r(s),children:e.jsx("i",{className:"bi bi-arrow-counterclockwise text-muted"})}),e.jsx("button",{type:"submit",disabled:i,className:"btn btn-primary flex-grow-1 py-3 rounded-pill fw-bold border-0 shadow",children:i?e.jsx("div",{className:"spinner-border spinner-border-sm text-white",role:"status"}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-send-fill me-2"}),"SEND MESSAGE"]})})]}),e.jsx("style",{children:`

        .android-input input,
        .android-input textarea {
          border-bottom: 2px solid #eee !important;
          transition: 0.3s;
        }

        .android-input input:focus,
        .android-input textarea:focus {
          border-bottom-color: #0061ff !important;
          box-shadow: none !important;
        }

        .form-floating > label {
          transition: 0.2s ease-in-out;
        }

        .btn:active {
          transform: scale(0.96);
        }

      `})]})};export{y as default};
