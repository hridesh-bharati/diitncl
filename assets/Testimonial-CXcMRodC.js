import{r as c,j as e}from"./index-C4niN-PF.js";const s=[{name:"Rohit Kumar",img:"images/testimonial/testimonial1.avif",text:"Drishtee Computer Center transformed my understanding of technology.",rating:5},{name:"Abhay Gautam",img:"images/testimonial/testimonial2.avif",text:"The expert guidance and practical approach gave me confidence.",rating:5},{name:"The Jugnoo",img:"images/testimonial/testimonial3.avif",text:"I appreciated the personalized coaching. Truly prepares you.",rating:4},{name:"Aditi Verma",img:"images/testimonial/testimonial4.avif",text:"The team helped me grow exponentially from basic to advanced.",rating:5}],x=()=>{const[n,r]=c.useState(0),i=s.length;return c.useEffect(()=>{const t=setInterval(()=>r(a=>(a+1)%i),4e3);return()=>clearInterval(t)},[i]),e.jsxs("section",{className:"py-5 overflow-hidden",style:{background:"#f8fafc"},children:[e.jsxs("div",{className:"container text-center",children:[e.jsxs("h2",{className:"fw-bold h3 mb-4",children:["What Students ",e.jsx("span",{className:"text-primary",children:"Say"})]}),e.jsx("div",{className:"slider-container position-relative mx-auto",children:s.map((t,a)=>{const l=a===n?"active-card shadow-lg":a===(n+1)%i?"next-card opacity-50":a===(n-1+i)%i?"prev-card opacity-50":"hidden-card";return e.jsxs("div",{className:`testi-card rounded-4 p-4 bg-white border ${l}`,children:[e.jsx("div",{className:"text-warning mb-2 small",children:[...Array(5)].map((o,d)=>e.jsx("i",{className:`bi bi-star${d<t.rating?"-fill":""} mx-1`},d))}),e.jsxs("p",{className:"text-muted small italic mb-4",children:['"',t.text,'"']}),e.jsxs("div",{className:"d-flex align-items-center border-top pt-3",children:[e.jsx("img",{src:t.img,alt:t.name,className:"rounded-circle border",style:{width:45,height:45,objectFit:"cover"}}),e.jsxs("div",{className:"ms-3 text-start",children:[e.jsx("h3",{className:"mb-0 fw-bold h6",children:t.name}),e.jsx("small",{className:"text-primary fw-bold",style:{fontSize:10},children:"Verified Student"})]})]})]},a)})}),e.jsx("div",{className:"d-flex justify-content-center gap-1 mt-4",children:s.map((t,a)=>e.jsx("button",{onClick:()=>r(a),className:`dot-btn ${n===a?"active":""}`,"aria-label":`Go to slide ${a+1}`,title:`Slide ${a+1}`},a))})]}),e.jsx("style",{children:`
        .slider-container { height: 280px; max-width: 400px; display: flex; align-items: center; justify-content: center; }
        .testi-card { position: absolute; width: 100%; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0; z-index: 1; }
        .active-card { transform: translateX(0) scale(1); opacity: 1; z-index: 3; }
        .next-card { transform: translateX(45%) scale(0.8); z-index: 1; filter: blur(1px); pointer-events: none; }
        .prev-card { transform: translateX(-45%) scale(0.8); z-index: 1; filter: blur(1px); pointer-events: none; }
        .hidden-card { transform: scale(0.5); opacity: 0; }
        .dot-btn { 
  width: 8px; 
  height: 8px; 
  background: #cbd5e1; 
  border: none; 
  border-radius: 50%; 
  transition: 0.3s; 
  /* --- Accessibility Fixes --- */
  padding: 18px; /* Tap area ko 44px tak badhane ke liye */
  margin: -10px; /* Padding ki wajah se gap na badhe isliye negative margin */
  background-clip: content-box; /* Rang sirf 8px area mein dikhega */
  cursor: pointer;
  display: inline-block;
}

.dot-btn.active { 
  width: 20px; 
  background: #0d6efd; 
  border-radius: 10px; 
  padding: 18px 12px; /* Active state ka size adjust karne ke liye */
}

/* Hover effect for better UX */
.dot-btn:hover {
  background-color: #94a3b8;
}
        .italic { font-style: italic; }
        @media (max-width: 768px) { .next-card, .prev-card { display: none; } .slider-container { max-width: 320px; } }
      `})]})};export{x as default};
