import{j as t}from"./index-B2VAr1JR.js";import"./vendor-Darxe_VZ.js";function r(){const o=()=>{window.scrollTo({top:0,behavior:"smooth"})};return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
                #btnBackToTop::after {
                    content: "";
                    border-radius: 50%;
                    border: 6px solid #00ffcb;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: ring 1.5s infinite;
                    pointer-events: none;
                }

                @keyframes ring {
                    0% {
                        width: 30px;
                        height: 30px;
                        opacity: 1;
                    }
                    100% {
                        width: 100px;
                        height: 100px;
                        opacity: 0;
                    }
                }
            `}),t.jsx("button",{onClick:o,className:"btn btn-primary m-0 p-1 px-2 position-fixed",id:"btnBackToTop",title:"Scroll to Top","aria-label":"Scroll to top",style:{bottom:"100px",right:"10px",zIndex:99,borderRadius:"50%",width:"50px",height:"50px",display:"flex",alignItems:"center",justifyContent:"center"},children:t.jsx("i",{className:"bi bi-arrow-up-circle-fill fs-5"})})]})}export{r as default};
