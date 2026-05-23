import{r as c,j as e,Q as u}from"./vendor-core-CXZ3OVw8.js";import{C as N,m as p,b,p as j,D as g,q as y}from"./vendor-firebase-BEV8JnAV.js";import{a as w,c as S,s as v}from"./emailService-BAAYT9jE.js";const D=()=>{const r={fullName:"",mobile:"",email:"",title:"",query:""},[a,o]=c.useState(r),[i,n]=c.useState(!1),l=t=>{o(s=>({...s,[t.target.name]:t.target.value}))},x=async t=>{t.preventDefault();try{n(!0),await N(p(b,"studentQueries"),{...a,timestamp:j(),status:"pending"});const s=w("hridesh027@gmail.com",`New Inquiry: ${a.title}`,S(a)),h=await g(y(p(b,"publicAdmins"))),m=[];h.forEach(f=>{const d=f.data();d?.fcmToken&&m.push(v({fcmToken:d.fcmToken},"New Support Query 📢",`${a.fullName} sent a support query about ${a.title}`,"/admin/support"))}),await Promise.all([s,...m]),new Audio("/audio/ring.mp3").play().catch(()=>{}),u.success("Query Sent Successfully!"),o(r)}catch(s){u.error(s.message||"System Error")}finally{n(!1)}};return e.jsxs("form",{onSubmit:x,className:"row g-4 p-4",children:[e.jsx("h1",{className:"text-dark text-center fw-bolder",children:"Quick Support"}),e.jsx("hr",{className:"text-primary"}),[{n:"fullName",l:"Full Name",t:"text",i:"person"},{n:"mobile",l:"Mobile Number",t:"tel",i:"phone"},{n:"email",l:"Email Address",t:"email",i:"envelope"},{n:"title",l:"Subject/Course",t:"text",i:"journal-text"}].map(t=>e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"form-floating android-input",children:[e.jsx("input",{type:t.t,name:t.n,className:"form-control border-0 border-bottom rounded-0 px-0 shadow-none bg-transparent",placeholder:t.l,value:a[t.n],onChange:l,required:!0}),e.jsxs("label",{className:"px-0 text-muted small",children:[e.jsx("i",{className:`bi bi-${t.i} me-2`}),t.l]})]})},t.n)),e.jsx("div",{className:"col-12 mt-4",children:e.jsxs("div",{className:"form-floating android-input",children:[e.jsx("textarea",{name:"query",className:"form-control border-0 border-bottom rounded-0 px-0 shadow-none bg-transparent",placeholder:"Message",style:{height:90},value:a.query,onChange:l,required:!0}),e.jsxs("label",{className:"px-0 text-muted small",children:[e.jsx("i",{className:"bi bi-chat-dots me-2"}),"How can we help?"]})]})}),e.jsxs("div",{className:"col-12 d-flex gap-2 mt-5",children:[e.jsx("button",{type:"button",className:"btn btn-light rounded-circle p-3 shadow-sm border",onClick:()=>o(r),children:e.jsx("i",{className:"bi bi-arrow-counterclockwise text-muted"})}),e.jsx("button",{type:"submit",disabled:i,className:"btn btn-primary flex-grow-1 py-3 rounded-pill fw-bold border-0 shadow",children:i?e.jsx("div",{className:"spinner-border spinner-border-sm text-white",role:"status"}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-send-fill me-2"}),"SEND MESSAGE"]})})]}),e.jsx("style",{children:`

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

      `})]})};export{D as default};
