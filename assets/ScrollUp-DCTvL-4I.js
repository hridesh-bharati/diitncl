import{R as n,r as o,j as t}from"./index-DRDKazBl.js";function l(){const[s,r]=o.useState(!1),e=o.useCallback(()=>{window.scrollY>300?r(!0):r(!1)},[]);o.useEffect(()=>(window.addEventListener("scroll",e,{passive:!0}),()=>window.removeEventListener("scroll",e)),[e]);const a=i=>{i.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})};return s?t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
                #btnBackToTop {
                    overflow: visible; 
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    animation: fadeIn 0.4s ease-out;
                }

                #btnBackToTop::after {
                    content: "";
                    border-radius: 50%;
                    border: 6px solid #00ffcb;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: ring 2s infinite;
                    pointer-events: none;
                    z-index: -1;
                }

                @keyframes ring {
                    0% { width: 40px; height: 40px; opacity: 1; }
                    100% { width: 80px; height: 80px; opacity: 0; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.5) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                
                #btnBackToTop:hover {
                    background-color: #1a73e8 !important;
                    transform: translateY(-5px);
                }

                #btnBackToTop:active {
                    transform: scale(0.9);
                }
            `}),t.jsx("button",{onClick:a,className:"btn position-fixed shadow-lg border-0",id:"btnBackToTop",title:"Scroll to Top","aria-label":"Scroll to top",style:{bottom:"90px",right:"20px",zIndex:9999,borderRadius:"50%",width:"50px",height:"50px",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#0a2885",color:"white"},children:t.jsx("i",{className:"bi bi-arrow-up-short fs-2"})})]}):null}const p=n.memo(l);export{p as S};
