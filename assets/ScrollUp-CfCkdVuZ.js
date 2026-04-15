import{d as s,r,j as t}from"./vendor-react-DAKGvOrs.js";function a(){const[o,i]=r.useState(!1);if(r.useEffect(()=>{const e=()=>i(window.scrollY>300);return window.addEventListener("scroll",e,{passive:!0}),()=>window.removeEventListener("scroll",e)},[]),!o)return null;const n={bottom:"90px",right:"20px",zIndex:9999,width:"50px",height:"50px",backgroundColor:"#0a2885",transition:"0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"};return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
                .btn-up:hover { transform: translateY(-5px); background: #1a73e8 !important; }
                .btn-up:active { transform: scale(0.9); }
                .btn-up::after {
                    content: ""; border-radius: 50%; border: 6px solid #00ffcb;
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    animation: ring 2s infinite; z-index: -1;
                }
                @keyframes ring { 0% { width: 40px; height: 40px; opacity: 1; } 100% { width: 80px; height: 80px; opacity: 0; } }
            `}),t.jsx("button",{onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),className:"btn-up btn position-fixed shadow-lg border-0 d-flex align-items-center justify-content-center text-white rounded-circle",style:n,children:t.jsx("i",{className:"bi bi-arrow-up-short fs-2"})})]})}const c=s.memo(a);export{c as S};
