import{r as l,j as e}from"./vendor-core-Dm5eHxbz.js";function m({isLiked:t,count:a,onClick:r,size:n=22}){const[c,s]=l.useState(!1),o=i=>{i.stopPropagation(),s(!0),setTimeout(()=>s(!1),400),r()};return e.jsxs("div",{className:"d-flex align-items-center gap-1 cursor-pointer",onClick:o,style:{transition:"0.2s"},children:[e.jsx("i",{className:`bi ${t?"bi-heart-fill text-danger animate-pop":"bi-heart text-secondary"}`,style:{fontSize:n}}),e.jsx("span",{className:`small fw-bold ${t?"text-danger":"text-secondary"}`,children:a}),e.jsx("style",{children:`
        .animate-pop { animation: pop 0.4s ease-out; }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .cursor-pointer { cursor: pointer; }
      `})]})}export{m as default};
