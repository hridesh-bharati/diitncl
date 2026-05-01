import{z as y,u as T,r as d,Q as p,I as C,j as e}from"./vendor-core-_o8I9vp1.js";import{d as g,o as D,b as h,D as E,E as I,k as S,v as A}from"./vendor-firebase-D68aZQrF.js";import{u as R}from"./index-D3PvZcAh.js";import{s as F}from"./courseData-C9ZCdk9Y.js";const O=t=>{if(!t)return"---";try{let a;if(typeof t=="string"&&t.includes("/")){const[i,l,n]=t.split("/");a=new Date(`${n}-${l}-${i}`)}else a=new Date(t);return isNaN(a.getTime())?t:`${a.getDate().toString().padStart(2,"0")} ${["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"][a.getMonth()]} ${a.getFullYear()}`}catch{return t}},k=t=>{if(!t&&t!==0)return"Not Available";const a=parseFloat(t);return isNaN(a)?"Invalid":a>=81?"Excellent":a>=71?"Very Good":a>=51?"Good":a>=50?"Satisfactory":"Needs Improvement"},x=t=>{if(!t)return{fullName:"",duration:"",hours:"",modules:[]};const a=F.find(i=>i.name?.toUpperCase().trim()===t.toUpperCase().trim());if(!a)return{fullName:t,duration:"",hours:"",modules:[]};const s=parseInt(a.duration);let r="";return s===18?r="720 Hrs.":s===15?r="580 Hrs.":s===12?r="480 Hrs.":s===6?r="230 Hrs.":s===3?r="120 Hrs.":r=`${s*40} Hrs.`,{fullName:a.description?.split("-")[0]?.trim()||a.name,duration:`${a.duration} Months`,hours:r,modules:a.subjects?.map(i=>i.name)||[]}},$=(t,a)=>{const s=(t+" "+a).length;return s>40?"16px":s>30?"18px":"22px"},M=({student:t})=>e.jsxs("div",{className:"certificate-header-grid",children:[e.jsx("div",{children:e.jsx("img",{src:"/images/icon/logo.png",alt:"Drishtee",loading:"eager",className:"header-logo-img"})}),e.jsxs("div",{className:"d-flex justify-content-start align-items-start ps-5",children:[e.jsxs("div",{className:"ps-3",children:[e.jsx("h1",{className:"certificate-main-title",children:"DRISHTEE"}),e.jsx("p",{className:"certificate-sub-title fw-bold cert-center ms-2",children:"An ISO 9001:2008 Certified Institute"})]}),e.jsx("div",{children:e.jsx("div",{className:"certificate-photo-container ms-4",children:e.jsx("img",{src:t.photoUrl,className:"certificate-photo",alt:"Student",crossOrigin:"anonymous",onError:a=>{a.target.src="/images/icon/icon.webp"}})})})]}),e.jsxs("div",{className:"text-end cert-right fw-bold",children:[e.jsx("p",{className:"m-0 mt-1",children:"Reg under The Indian trust act 1882"}),e.jsx("p",{className:"m-0 mt-1",children:"Reg No - 14/2025"}),e.jsx("p",{className:"m-0 mt-1",children:"Darpan ID : UP/20250878051"})]})]}),P=({student:t,courseData:a,grade:s})=>e.jsxs("div",{className:"certificate-body-grid p-0 m-0 text-center text-black",children:[e.jsxs("p",{className:"certificate-awarded-to d-inline pt-2",children:[e.jsx("span",{className:"certificate-body-text",children:"This certificate is awarded to Mr/Miss "}),e.jsxs("span",{className:"certificate-name text-uppercase",style:{fontSize:$(t.name,t.fatherName)},children:[t.name," ",t.gender==="Female"?"D/O":"S/O"," ",t.fatherName||""]})]}),e.jsx("p",{className:"p-0 m-0",children:e.jsxs("span",{className:"certificate-body-text",children:["On the successfully completion of a ",e.jsx("b",{children:a.duration})," (",a.hours,") course, titled"]})}),e.jsx("h4",{className:"certificate-course-title p-0 m-0",children:a.fullName}),e.jsxs("p",{className:"p-0 m-0",children:[e.jsx("span",{className:"certificate-body-text",children:"with grade & Percentage "}),e.jsx("span",{className:"certificate-grade-highlight",children:e.jsxs("u",{children:[s," & ",t.percentage||"N/A","%"]})})]}),e.jsxs("p",{className:"certificate-body-text",children:["Examination conducted on at all-india basis at ",e.jsx("b",{children:"Maharajganj / U.P."})]})]}),U=({modules:t})=>e.jsxs("div",{className:"modules-container row",children:[e.jsx("div",{className:"col-3",children:e.jsx("p",{className:"m-0 text-center certificate-modules-title",children:e.jsx("b",{children:"Modules Covered:"})})}),e.jsx("div",{className:"col-9",children:e.jsx("div",{className:"d-flex flex-wrap gap-1 justify-content-start p-0 m-0",children:t.length>0?t.map((a,s)=>e.jsxs("span",{className:"certificate-module-item p-0 my-0",children:[s+1,". ",a]},s)):e.jsx("span",{className:"certificate-module-item p-0 my-0",children:"No modules available"})})})]}),z=({student:t,issueDate:a})=>e.jsxs("div",{className:"certificateFooter m-auto",children:[e.jsxs("div",{className:"d-flex justify-content-start align-items-end",children:[e.jsxs("div",{className:"text-start w-50",children:[e.jsx("img",{src:"/images/vender/signature.png",alt:"Sign",style:{width:"150px"},crossOrigin:"anonymous"}),e.jsx("h6",{className:"dbluetext fw-bold certificate-footer-text",children:"Chief Exam Controller"})]}),e.jsx("div",{className:"text-start w-50 fw-bolder",children:e.jsxs("p",{className:"m-0 certificate-footer-text",children:["Date of Issue : ",e.jsx("span",{className:"dbluetext",children:a})]})})]}),e.jsxs("div",{className:"d-flex justify-content-between mt-2 fw-bold certificate-footer-reg px-5 py-1",style:{borderTop:"1px solid darkblue",borderBottom:"1px solid darkblue"},children:[e.jsxs("div",{children:[e.jsx("span",{className:"dbluetext",children:"Student Reg No. :"})," ",e.jsx("span",{className:"text-uppercase",children:t.regNo||"N/A"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"dbluetext",children:"Center Code :"})," ",e.jsx("span",{children:t.branch||"DIIT124"})]})]}),e.jsx("div",{className:"text-center",children:e.jsx("p",{className:"m-0 ftrTExt certificate-footer-text grade border bg-danger-subtle mt-2",children:"Grade Mark : Excellent (81% - 100%), Very Good (71% - 80%), Good(51% - 70%), Satisfactory (50% - 60%)"})}),e.jsxs("div",{className:"mt-2 text-center",children:[e.jsx("h6",{className:"fw-bold m-0 certificate-institute-title arial",children:"DRISHTEE INSTITUTE OF INFORMATION TECHNOLOGY"}),e.jsx("p",{className:"m-0 ftrTExt certificate-footer-text arial redText",children:"(An unit of Drishtee Educational & welfare Trust)"}),e.jsxs("p",{className:"m-0 ftrTExt certificate-footer-text arial blueColor d-flex justify-content-evenly",children:[e.jsx("span",{children:"Reg Office: Harredeeh, ward No.5, Nichalul, Distt-Maharajganj (273304) "}),e.jsx("span",{className:"small ms-4",children:"https://www.drishteeindia.com"})]})]})]});function J({student:t}){const{id:a}=y(),{isAdmin:s}=R(),r=T(),[i,l]=d.useState(t||null),[n,o]=d.useState(!t),[N,f]=d.useState(null);d.useEffect(()=>{if(t){l(t),o(!1);return}if(!a)return;const m=a.toLowerCase().trim(),v=g(h,"admissions",m),w=D(v,c=>{c.exists()?(l({id:c.id,...c.data()}),f(null)):f("STUDENT_NOT_FOUND"),o(!1)},c=>{f(c.message),o(!1)});return()=>w()},[a,t]);const j=d.useCallback(()=>{const m=document.getElementById("printResult");if(!m)return p.error("Certificate not ready");p.info("📄 Generating PDF..."),C().set({margin:0,filename:`certificate_${i?.name||"student"}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,width:1123,height:794},jsPDF:{unit:"mm",format:[297,210],orientation:"landscape"}}).from(m).save().then(()=>p.success("✅ PDF Downloaded!")).catch(()=>p.error("Failed to generate PDF"))},[i]);return n?e.jsxs("div",{className:"d-flex flex-column align-items-center justify-content-center min-vh-100",children:[e.jsx("div",{className:"spinner-border text-primary"}),e.jsx("p",{className:"mt-2",children:"Loading certificate..."})]}):i?.certificateDisabled&&!s?e.jsx("div",{className:"container mt-5",children:e.jsxs("div",{className:"card border-0 shadow-sm rounded-4 p-5 text-center bg-white",children:[e.jsx("i",{className:"bi bi-lock-fill display-1 text-danger mb-4"}),e.jsx("h2",{className:"fw-bold",children:"Portal Access Locked"}),e.jsx("button",{className:"btn btn-primary rounded-pill px-4 mt-3 shadow-sm",onClick:()=>r("/"),children:"Go to Home"})]})}):N==="STUDENT_NOT_FOUND"||!i?e.jsxs("div",{className:"container mt-5 text-center",children:[e.jsx("h4",{children:"🔍 Record Not Found"}),e.jsx("button",{className:"btn btn-dark rounded-pill px-4",onClick:()=>r(-1),children:"Back"})]}):e.jsxs("div",{className:"bg-white min-vh-100 animate__animated animate__fadeIn",children:[e.jsxs("div",{className:"p-3 d-flex justify-content-between border-bottom bg-white no-print shadow-sm sticky-top",children:[e.jsx("button",{className:"btn btn-secondary btn-sm rounded-pill px-3",onClick:()=>r(-1),children:"← Back"}),e.jsx("button",{className:"btn btn-primary btn-sm rounded-pill px-4 fw-bold",onClick:j,children:"Download Certificate"})]}),e.jsx("div",{className:"d-flex justify-content-center py-4",style:{overflowX:"auto"},children:e.jsx("div",{id:"overflow-card",children:e.jsx("div",{id:"certificate-fixed-a4",children:e.jsx("div",{className:"certificate-wrapper",children:e.jsx("div",{id:"printResult",className:"certificate-sheet-landscape m-auto",children:e.jsxs("div",{id:"watermark",children:[e.jsx(M,{student:i}),e.jsx("h1",{className:"certificate-title arial",children:"Certificate of Course Completion"}),e.jsx(P,{student:i,courseData:x(i.course),grade:k(i.percentage)}),e.jsx(U,{modules:x(i.course).modules}),e.jsx(z,{student:i,issueDate:O(i.issueDate)})]})})})})})})]})}const H={"ADCA+":{duration:18,monthly:800,adm:600},ADCA:{duration:15,monthly:700,adm:500},DCA:{duration:12,monthly:700,adm:500},DCAA:{duration:6,monthly:700,adm:500},CCC:{duration:3,monthly:1e3,adm:500}},u={DIIT124:{mobile:"+91 9918151032",address:"Paragpur Road, Near Sunshine School, Nichlaul - 273304",centerCode:"DIIT124"},DIIT125:{mobile:"+91 7398889347",address:"Thoothibari, Pakali Mandi ke pass, Thoothibari - 273305",centerCode:"DIIT125"}},V=(t,a=[])=>{const s=t?.toUpperCase()||"",r=H[s]||{duration:6,monthly:700,adm:500},i=r.duration*r.monthly+r.adm,l=a.reduce((n,o)=>n+Number(o.amount||0),0);return{...r,netFee:i,totalPaid:l,balance:i-l}},W=async(t,a)=>{if(!t)throw new Error("Student Email is required");const s=t.toLowerCase().trim();await I(S(h,"admissions",s,"payments"),{...a,amount:Number(a.amount),createdAt:A()})},q=async(t,a)=>{if(!(!t||!a)&&window.confirm("Delete this payment permanently?"))try{const s=t.toLowerCase().trim(),r=g(h,"admissions",s,"payments",a);await E(r)}catch(s){alert("Failed to delete payment: "+s.message)}},G=t=>{const a=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],s=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],r=i=>i<20?a[i]:i<100?s[Math.floor(i/10)]+(i%10!==0?" "+a[i%10]:""):i<1e3?a[Math.floor(i/100)]+" Hundred"+(i%100!==0?" "+r(i%100):""):i;return t>0?r(t):"Zero"},b=(t,a,s,r=!1)=>{const i=r?"OFFICIAL FEE RECEIPT":"STUDENT FEE LEDGER / STATEMENT",l=t?.regNo||"";let n=u.DIIT124;return l.includes("DIIT125")&&(n=u.DIIT125),`
  <html>
  <head>
    <title>Receipt_${t?.name}</title>
    <style>
      @page { size: A4; margin: 0; }
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f0f0; margin: 0; padding: 0; color: #333; }
      
      .page {
        width: 210mm;
        height: 297mm;
        padding: 20mm;
        margin: 10mm auto;
        background: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: column;
      }

      .header-container { text-align: center; }
      .header-container h1 { margin: 0; font-size: 32px; color: #1a237e; font-weight: 800; text-transform: uppercase; }
      .header-container p { margin: 3px 0; font-size: 13px; color: #444; font-weight: 500; }
      .header-line { border-bottom: 2.5px solid #1a237e; margin: 15px 0 25px 0; }

      .doc-type {
        text-align: center; color: #999; font-size: 14px; font-weight: bold;
        letter-spacing: 2px; margin-bottom: 30px; text-transform: uppercase;
      }

      .info-section { display: grid; grid-template-columns: 1.1fr 0.9fr; column-gap: 50px; row-gap: 12px; margin-bottom: 35px; }
      .info-item { display: flex; align-items: flex-end; border-bottom: 1.5px solid #e0e0e0; padding-bottom: 4px; }
      .info-item label { color: #1a237e; font-weight: 800; font-size: 14px; width: 140px; white-space: nowrap; }
      .info-item span { flex: 1; font-size: 14px; font-weight: 600; color: #000; }

      table { width: 100%; border-collapse: collapse; margin-top: 10px; border: 1.5px solid #1a237e; }
      th { border: 1px solid #1a237e; padding: 10px; font-size: 11px; color: #999; text-transform: uppercase; font-weight: bold; }
      td { border: 1px solid #1a237e; padding: 12px; font-size: 14px; font-weight: 600; }
      .text-right { text-align: right; }
      .text-center { text-align: center; }

      .summary-wrapper { display: flex; justify-content: flex-end; margin-top: -1.5px; }
      .summary-table { width: 340px; border-collapse: collapse; border: 1.5px solid #1a237e; }
      .summary-table td { padding: 10px 15px; font-weight: 800; font-size: 12px; text-transform: uppercase; border: 1px solid #1a237e; }
      .label-cell { color: #1a237e; text-align: left; background: #fff; width: 180px; }
      .value-cell { text-align: right; width: 140px; font-size: 15px; }
      
      .paid-text { color: #2e7d32; } 
      .due-text { color: #888; }   

      .bottom-notes { margin-top: 40px; font-size: 12px; }
      .amount-words { margin-bottom: 15px; color: #444; }
      .disclaimer { color: #666; font-size: 11px; line-height: 1.5; font-style: italic; }

      .signature-section { margin-top: auto; display: flex; justify-content: space-between; padding-bottom: 10px; }
      .sig-box { width: 220px; border-top: 3px solid #1a237e; text-align: center; padding-top: 8px; font-weight: 800; color: #1a237e; font-size: 14px; }

      .watermark {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg);
        font-size: 110px; color: rgba(26, 35, 126, 0.03); font-weight: 900; z-index: -1; white-space: nowrap;
      }

      @media print {
        body { background: white; }
        .page { margin: 0; box-shadow: none; width: 100%; }
        .no-print { display: none; }
      }
    </style>
  </head>
  <body onload="window.print();">
    <div class="page">
      <div class="watermark">DRISHTEE CC</div>

      <div class="header-container">
        <h1>Drishtee Computer Center</h1>
        <p>A Complete I.T. institute</p>
        <p>An ISO 9001:2015 Certified IT Training Institute</p>
        <p>${n.address} | Mob: ${n.mobile}</p>
        <div class="header-line"></div>
      </div>

      <div class="doc-type">${i}</div>

      <div class="info-section">
        <div>
           <div class="info-item"><label>Student Name:</label> <span>${t?.name?.toUpperCase()}</span></div>
           <div class="info-item"><label>Registration No:</label> <span>${t?.regNo||"DCC-"+t?.course+"/N/A"}</span></div>
           <div class="info-item"><label>Course Title:</label> <span>${t?.course}</span></div>
        </div>
        <div>
           <div class="info-item"><label>Admission Date:</label> <span>${t?.admissionDate||"N/A"}</span></div>
           <div class="info-item"><label>Statement Date:</label> <span>${new Date().toLocaleDateString("en-GB")}</span></div>
           <div class="info-item"><label>Center Code:</label> <span>${n.centerCode}</span></div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th width="18%">TRANX DATE</th>
            <th width="42%">PARTICULARS / DESCRIPTION</th>
            <th width="15%">MODE</th>
            <th width="25%" class="text-right">AMOUNT (INR)</th>
          </tr>
        </thead>
        <tbody>
          ${a.map(o=>`
            <tr>
              <td class="text-center">${o.date}</td>
              <td>${o.note||"Monthly Fee"}</td>
              <td class="text-center">${o.method.toUpperCase()}</td>
              <td class="text-right">₹ ${o.amount}.00</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="summary-wrapper">
        <table class="summary-table">
          <tr>
            <td class="label-cell">Gross Payable Fee</td>
            <td class="value-cell" style="color:#1a237e">₹ ${s.netFee}.00</td>
          </tr>
          <tr>
            <td class="label-cell">Total Paid to Date</td>
            <td class="value-cell paid-text">₹ ${s.totalPaid}.00</td>
          </tr>
          <tr>
            <td class="label-cell">Net Outstanding Dues</td>
            <td class="value-cell due-text">₹ ${s.balance}.00</td>
          </tr>
        </table>
      </div>

      <div class="bottom-notes">
        <div class="amount-words"><b>Amount in Words:</b> ${G(r?a[0].amount:s.totalPaid)} Rupees Only.</div>
        <div class="disclaimer">
          * This is an official computer-generated fee statement. In case of any discrepancy, please report to the center office within 7 working days.
        </div>
      </div>

      <div class="signature-section">
        <div class="sig-box">Accountant / Signatory</div>
        <div class="sig-box">Office Seal & Stamp</div>
      </div>
    </div>
  </body>
  </html>`},X=(t,a,s)=>{const r=window.open("","_blank");r.document.write(b(t,a,s,!1)),r.document.close()},Q=(t,a,s)=>{const r=window.open("","_blank");r.document.write(b(t,[a],s,!0)),r.document.close()};export{H as C,J as S,W as a,X as b,q as d,V as g,Q as p};
