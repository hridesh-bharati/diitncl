import{r as c,j as e}from"./vendor-core-mhOduRYu.js";const n=[{name:"Rohit Kumar",img:"images/testimonial/testimonial1.avif",text:"Drishtee Computer Center transformed my understanding of technology.",rating:5},{name:"Abhay Gautam",img:"images/testimonial/testimonial2.avif",text:"The expert guidance and practical approach gave me confidence.",rating:5},{name:"The Jugnoo",img:"images/testimonial/testimonial3.avif",text:"I appreciated the personalized coaching. Truly prepares you.",rating:4},{name:"Aditi Verma",img:"images/testimonial/testimonial4.avif",text:"The team helped me grow exponentially from basic to advanced.",rating:5}],x=()=>{const[s,r]=c.useState(0),i=n.length;return c.useEffect(()=>{const a=setInterval(()=>r(t=>(t+1)%i),4e3);return()=>clearInterval(a)},[i]),e.jsxs("section",{className:"py-5 overflow-hidden",children:[e.jsxs("div",{className:"container text-center",children:[e.jsxs("h2",{className:"fw-bold h3 mb-4",children:["What Students ",e.jsx("span",{className:"text-primary",children:"Say"})]}),e.jsx("div",{className:"slider-container position-relative mx-auto",children:n.map((a,t)=>{const o=t===s?"active-card shadow-lg":t===(s+1)%i?"next-card opacity-50":t===(s-1+i)%i?"prev-card opacity-50":"hidden-card";return e.jsxs("div",{className:`testi-card rounded-4 p-4 bg-white border ${o}`,children:[e.jsx("div",{className:"text-warning mb-2 small",children:[...Array(5)].map((d,l)=>e.jsx("i",{className:`bi bi-star${l<a.rating?"-fill":""} mx-1`},l))}),e.jsxs("p",{className:"text-muted small italic mb-4",children:['"',a.text,'"']}),e.jsxs("div",{className:"d-flex align-items-center border-top pt-3",children:[e.jsx("img",{src:a.img,alt:a.name,className:"rounded-circle border",style:{width:45,height:45,objectFit:"cover"}}),e.jsxs("div",{className:"ms-3 text-start",children:[e.jsx("h3",{className:"mb-0 fw-bold h6",children:a.name}),e.jsx("small",{className:"text-primary fw-bold",style:{fontSize:10},children:"Verified Student"})]})]})]},t)})}),e.jsx("div",{className:"d-flex justify-content-center gap-1 mt-4",children:n.map((a,t)=>e.jsx("button",{onClick:()=>r(t),className:`dot-btn ${s===t?"active":""}`,"aria-label":`Go to slide ${t+1}`},t))})]}),e.jsx("style",{children:`
        .slider-container { height: 280px; max-width: 400px; display: flex; align-items: center; justify-content: center; }
        .testi-card { position: absolute; width: 100%; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0; z-index: 1; }
        .active-card { transform: translateX(0) scale(1); opacity: 1; z-index: 3; }
        .next-card { transform: translateX(45%) scale(0.8); z-index: 1; filter: blur(1px); pointer-events: none; }
        .prev-card { transform: translateX(-45%) scale(0.8); z-index: 1; filter: blur(1px); pointer-events: none; }
        .hidden-card { transform: scale(0.5); opacity: 0; }
        
        /* --- Fixed CSS Rules --- */
        .dot-btn { 
          width: 12px;
          height: 6px;
          background: #cbd5e1;
          border: none;
          border-radius: 10px;
          transition: all 0.4s ease;
          cursor: pointer;
          padding: 0;
          margin: 0 4px;
        }

        .dot-btn.active { 
          width: 32px;
          background: #00008b; /* Dark Blue */
        }

        .dot-btn:hover:not(.active) {
          background-color: #94a3b8;
        }

        .italic { font-style: italic; }
        @media (max-width: 768px) { 
          .next-card, .prev-card { display: none; } 
          .slider-container { max-width: 320px; } 
        }
      `})]})};export{x as default};
