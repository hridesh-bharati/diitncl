import{j as e,L as l}from"./vendor-core-DGkiYJBS.js";const s={brand:{name:"DRISHTEE COMPUTER CENTRE",logo:"images/icon/icon-192.png",cert:"ISO 9001:2015 Certified Institute",tagline:"An Initiative for Digital Literacy & Vocational Excellence"},links:[{name:"Home",path:"/"},{name:"About Center",path:"/about"},{name:"Our Courses",path:"/courses"},{name:"Verify Certificate",path:"/download-certificate"},{name:"Student Support",path:"/contact-us"},{name:"Privacy Policy",path:"/privacy-policy"}],helpline:[{name:"Administrative Office",num:"9918151032"},{name:"Technical Support",num:"7267995307"}]};function n(){const i=new Date().getFullYear();return e.jsxs("footer",{className:"footer-gov border-top border-4 border-orange",children:[e.jsx("div",{className:"gov-top-strip py-2",children:e.jsxs("div",{className:"container d-flex justify-content-between align-items-center",children:[e.jsxs("div",{className:"d-flex align-items-center gap-2 text-white",children:[e.jsx("i",{className:"bi bi-patch-check-fill text-warning"}),e.jsx("span",{className:"fw-bold small tracking-wider",children:"OFFICIAL PORTAL OF DIIT CENTER"})]}),e.jsxs("div",{className:"social-links d-flex gap-3",children:[e.jsx("a",{href:"https://wa.me/919918151032",className:"text-white hover-scale",children:e.jsx("i",{className:"bi bi-whatsapp"})}),e.jsx("a",{href:"#",className:"text-white hover-scale",children:e.jsx("i",{className:"bi bi-facebook"})}),e.jsx("a",{href:"#",className:"text-white hover-scale",children:e.jsx("i",{className:"bi bi-youtube"})})]})]})}),e.jsx("div",{className:"bg-white py-5",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"row g-4",children:[e.jsxs("div",{className:"col-12 col-lg-5",children:[e.jsxs("div",{className:"d-flex gap-3 mb-3 align-items-center",children:[e.jsx("img",{src:s.brand.logo,alt:"Logo",className:"img-fluid",width:70}),e.jsxs("div",{className:"border-start border-2 ps-3 border-primary",children:[e.jsx("h5",{className:"fw-bold m-0 text-navy",children:s.brand.name}),e.jsx("p",{className:"text-orange small fw-bold mb-0",children:s.brand.cert})]})]}),e.jsxs("p",{className:"text-muted small leading-relaxed",children:[s.brand.tagline,". Dedicated to empowering youth with technical skills since 2007. Recognized for excellence in computer education in Nichlaul."]})]}),e.jsxs("div",{className:"col-12 col-lg-7",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h6",{className:"gov-heading mb-3",children:"USEFUL LINKS"}),e.jsx("div",{className:"row row-cols-2 g-2",children:s.links.map((a,t)=>e.jsx("div",{className:"col",children:e.jsxs(l,{to:a.path,className:"gov-link-item",children:[e.jsx("i",{className:"bi bi-chevron-right me-1"})," ",a.name]})},t))})]}),e.jsxs("div",{className:"pt-3 border-top",children:[e.jsx("h6",{className:"gov-heading-sm mb-3 text-muted",children:"SUPPORT HELPLINE"}),e.jsx("div",{className:"row g-3",children:s.helpline.map((a,t)=>e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"contact-card p-2 rounded",children:[e.jsx("small",{className:"text-uppercase fw-bold text-muted d-block mb-1",style:{fontSize:"9px"},children:a.name}),e.jsxs("a",{href:`tel:${a.num}`,className:"text-decoration-none text-navy fw-bold d-flex align-items-center",children:[e.jsx("div",{className:"icon-circle-sm me-2",children:e.jsx("i",{className:"bi bi-telephone-fill"})}),"+91 ",a.num]})]})},t))})]})]})]})})}),e.jsx("div",{className:"gov-bottom-bar py-3 border-top bg-light",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"row align-items-center text-center text-md-start",children:[e.jsx("div",{className:"col-md-6",children:e.jsxs("p",{className:"mb-0 text-muted small",children:["© ",i," ",e.jsx("strong",{children:"DIIT CENTER"}),". All Rights Reserved.",e.jsxs("span",{className:"d-block d-md-inline ms-md-2 border-md-start ps-md-2",children:["Managed by ",e.jsx("b",{children:"DRISHTEE NICHLAUL "})]})]})}),e.jsx("div",{className:"col-md-6 text-md-end mt-3 mt-md-0",children:e.jsxs("div",{className:"dev-credit d-inline-flex align-items-center px-3 py-1 bg-white border rounded-pill",children:[e.jsx("span",{className:"text-muted extra-small me-2",children:"Designed by:"}),e.jsx("span",{className:"fw-bold text-navy extra-small",children:"HRIDESH BHARATI"})]})})]})})}),e.jsxs("div",{className:"bg-navy text-white text-center pt-1 pb-4 pb-lg-0 extra-small opacity-75",children:["Website Version: ","2.2.111"," • Updated: ",new Date().toLocaleDateString("en-GB")]}),e.jsx("style",{children:`
        :root {
          --navy: #002e5b;
          --orange: #f48120;
          --gov-blue: #0056b3;
        }
        .text-navy { color: var(--navy); }
        .bg-navy { background-color: var(--navy); }
        .text-orange { color: var(--orange); }
        .border-orange { border-color: var(--orange) !important; }
        .gov-top-strip { background: linear-gradient(90deg, #002e5b 0%, #0056b3 100%); }
        
        // .gov-logo-img { width: 55px; height: 55px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
        
        .gov-heading {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--navy);
          position: relative;
          padding-bottom: 8px;
        }
        .gov-heading::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0;
          width: 35px; height: 3px;
          background: var(--orange);
        }

        .gov-heading-sm { font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; }

        .gov-link-item {
          color: #555;
          font-size: 13px;
          text-decoration: none;
          display: block;
          transition: 0.2s;
        }
        .gov-link-item:hover { color: var(--gov-blue); padding-left: 4px; }

        .contact-card {
          background: #f8f9fa;
          border-left: 3px solid var(--gov-blue);
          transition: 0.3s;
        }
        .contact-card:hover { background: #eef2f7; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        
        .icon-circle-sm {
          width: 24px; height: 24px;
          background: var(--gov-blue);
          color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
        }

        .extra-small { font-size: 10px; }
        .tracking-wider { letter-spacing: 1px; }
        .hover-scale:hover { transform: scale(1.15); transition: 0.2s; }

        @media (max-width: 768px) {
          footer { margin-bottom: 60px !important; }
        }
      `})]})}export{n as default};
