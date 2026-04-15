import{F as c,G as e}from"./vendor-core-GXCzUygL.js";import"./vendor-heavy-libs-Cjqce34U.js";const n=[{name:"Rohit Kumar",img:"images/testimonial/testimonial1.avif",text:"Drishtee Computer Center transformed my understanding of technology.",rating:5,role:"Software Engineer"},{name:"Abhay Gautam",img:"images/testimonial/testimonial2.avif",text:"The expert guidance and practical approach gave me confidence.",rating:5,role:"Web Developer"},{name:"The Jugnoo",img:"images/testimonial/testimonial3.avif",text:"I appreciated the personalized coaching. Truly prepares you.",rating:4,role:"UI/UX Designer"},{name:"Aditi Verma",img:"images/testimonial/testimonial4.avif",text:"The team helped me grow exponentially from basic to advanced.",rating:5,role:"Data Analyst"}],p=()=>{const[i,l]=c.useState(0),s=n.length;return c.useEffect(()=>{const t=setInterval(()=>l(a=>(a+1)%s),4e3);return()=>clearInterval(t)},[s]),e.jsxs("section",{className:"py-5 bg-light overflow-hidden",children:[e.jsxs("div",{className:"container text-center",children:[e.jsxs("div",{className:"text-center mb-5",children:[e.jsx("span",{className:"badge rounded-pill bg-primary-light text-primary px-3 py-2 mb-2",children:"Testimonials"}),e.jsxs("h2",{className:"fw-bold display-6",children:["What Students ",e.jsx("span",{className:"text-gradient",children:"Say About Us"})]}),e.jsx("p",{className:"text-muted",children:"Real stories from students who launched their careers with us."})]}),e.jsx("div",{className:"position-relative mx-auto slider-box",children:n.map((t,a)=>{let r="hidden-card";return a===i?r="active-card shadow-lg":a===(i+1)%s?r="next-card shadow-sm":a===(i-1+s)%s&&(r="prev-card shadow-sm"),e.jsxs("div",{className:`card-3d p-4 rounded-4 bg-white ${r}`,children:[e.jsx("div",{className:"text-warning mb-2 small",children:[...Array(5)].map((o,d)=>e.jsx("i",{className:`bi bi-star${d<t.rating?"-fill":""} mx-1`},d))}),e.jsxs("p",{className:"text-muted fst-italic mb-4",children:['"',t.text,'"']}),e.jsxs("div",{className:"d-flex align-items-center border-top pt-3",children:[e.jsx("img",{src:t.img,alt:t.name,className:"rounded-circle border",style:{width:45,height:45,objectFit:"cover"}}),e.jsxs("div",{className:"text-start ms-3",children:[e.jsx("h6",{className:"mb-0 fw-bold",children:t.name}),e.jsx("small",{className:"text-primary",style:{fontSize:"11px"},children:t.role})]})]})]},a)})}),e.jsx("div",{className:"d-flex justify-content-center gap-2 mt-4",children:n.map((t,a)=>e.jsx("span",{onClick:()=>l(a),className:`dot ${i===a?"bg-primary w-25":"bg-secondary opacity-25"}`},a))})]}),e.jsx("style",{children:`
        .slider-box { height: 280px; max-width: 450px; }
        .card-3d { 
          position: absolute; width: 100%; transition: all 0.6s ease-in-out; 
          border: 1px solid #eee; left: 0; top: 0;
        }
        .text-gradient { background: linear-gradient(90deg, #0d6efd, #0dcaf0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        /* Z-Index Logic */
        .active-card { z-index: 10; transform: scale(1); opacity: 1; visibility: visible; }
        .next-card   { z-index: 5;  transform: translateX(40%) scale(0.85); opacity: 0.6; filter: blur(1px); }
        .prev-card   { z-index: 5;  transform: translateX(-40%) scale(0.85); opacity: 0.6; filter: blur(1px); }
        .hidden-card { z-index: 1;  transform: scale(0.7); opacity: 0; visibility: hidden; }

        .dot { height: 6px; width: 10px; border-radius: 10px; cursor: pointer; transition: 0.3s; }
        
        @media (max-width: 768px) {
          .next-card, .prev-card { opacity: 0; transform: scale(0.8); }
        }
      `})]})};export{p as default};
