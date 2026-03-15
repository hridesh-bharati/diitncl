import{h as $,d as u,b as i,n as C,f as g,s as v,r as b,q as w,o as F,g as I,j as O,C as y,v as E,w as T,a as A}from"./index-CkSvhk0r.js";const k={"ADCA+":{duration:18,monthly:800,adm:600},ADCA:{duration:15,monthly:700,adm:500},DCA:{duration:12,monthly:700,adm:500},DCAA:{duration:6,monthly:700,adm:500},CCC:{duration:3,monthly:1e3,adm:500}},z=(t,e=[])=>{const d=t?.toUpperCase()||"",a=k[d]||{duration:6,monthly:700,adm:500},o=a.duration*a.monthly+a.adm,c=e.reduce((h,f)=>h+Number(f.amount||0),0);return{...a,netFee:o,totalPaid:c,balance:o-c}},G=async(t,e)=>{await C(g(i,"admissions",t,"payments"),{...e,amount:Number(e.amount),createdAt:v()})},B=async(t,e)=>{window.confirm("Delete this payment permanently?")&&await $(u(i,"admissions",t,"payments",e))},L=t=>{const e=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],d=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],a=o=>o<20?e[o]:o<100?d[Math.floor(o/10)]+(o%10!==0?" "+e[o%10]:""):o<1e3?e[Math.floor(o/100)]+" Hundred"+(o%100!==0?" "+a(o%100):""):o;return t>0?a(t):"Zero"},S=(t,e,d,a=!1)=>{const o=a?"OFFICIAL FEE RECEIPT":"STUDENT FEE LEDGER / STATEMENT";return`
  <html>
  <head>
    <title>${t?.name} - Statement</title>
    <style>
      @page { size: A4; margin: 0; }
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f0f0; margin: 0; padding: 0; }
      
      /* A4 Page Styling */
      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        margin: 10mm auto;
        background: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        box-sizing: border-box;
        position: relative;
        border-top: 8px solid #1a237e; /* Navy Blue Theme */
      }

      /* College Header */
      .header-container { text-align: center; border-bottom: 2px solid #1a237e; padding-bottom: 15px; margin-bottom: 25px; }
      .header-container h1 { margin: 0; font-size: 28px; color: #1a237e; text-transform: uppercase; }
      .header-container p { margin: 2px 0; font-size: 12px; color: #555; letter-spacing: 0.5px; }
      
      .doc-header {
        background: #1a237e; color: white; padding: 8px; font-weight: bold;
        text-align: center; margin-bottom: 30px; font-size: 14px; border-radius: 4px;
      }

      /* Profile Grid */
      .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 14px; }
      .info-row { display: flex; border-bottom: 1px solid #eee; padding: 6px 0; }
      .info-row b { width: 140px; color: #1a237e; }

      /* Academic Table */
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th { background: #1a237e; color: white; border: 1px solid #1a237e; padding: 10px; font-size: 12px; }
      td { border: 1px solid #ccc; padding: 10px; font-size: 13px; color: #333; }
      .text-right { text-align: right; }
      .even { background: #f9f9f9; }

      /* Summary Table Section */
      .summary-container { display: flex; justify-content: flex-end; margin-top: -1px; }
      .summary-table { width: 300px; }
      .summary-table td { font-weight: bold; padding: 12px; border: 1px solid #1a237e; }
      .bg-blue-light { background: #e8eaf6; color: #1a237e; }
      .bg-navy { background: #1a237e; color: white; }

      /* Footer Area */
      .declaration { margin-top: 40px; font-size: 12px; color: #666; font-style: italic; }
      .footer-signs { margin-top: 100px; display: flex; justify-content: space-between; }
      .sign-box { border-top: 2px solid #1a237e; width: 200px; text-align: center; padding-top: 10px; font-weight: bold; color: #1a237e; }

      .watermark {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg);
        font-size: 100px; color: rgba(26, 35, 126, 0.04); font-weight: 900; z-index: 0; pointer-events: none;
      }

      @media print {
        body { background: white; }
        .page { margin: 0; box-shadow: none; border-top: 8px solid #1a237e !important; }
        .no-print { display: none; }
      }
    </style>
  </head>
  <body onload="window.print(); setTimeout(()=>window.close(), 1000);">
    <div class="page">
      <div class="watermark">DRISHTEE CC</div>
      
      <div class="header-container">
        <h1>Drishtee Computer Center</h1>
        <p>Managed by Drishtee Educational & Charitable Trust</p>
        <p>An ISO 9001:2015 Certified IT Training Institute</p>
        <p>Main Road, Varanasi - 221001 | Web: www.drishtee.com | Mob: +91 9918151032</p>
      </div>

      <div class="doc-header">${o}</div>

      <div class="student-info">
        <div class="info-group">
          <div class="info-row"><b>Student Name:</b> <span>${t?.name?.toUpperCase()}</span></div>
          <div class="info-row"><b>Registration No:</b> <span>${t?.regNo||"DCC-"+t?.id?.slice(-5).toUpperCase()}</span></div>
          <div class="info-row"><b>Course Title:</b> <span>${t?.course}</span></div>
        </div>
        <div class="info-group">
          <div class="info-row"><b>Admission Date:</b> <span>${t?.admissionDate||"N/A"}</span></div>
          <div class="info-row"><b>Statement Date:</b> <span>${new Date().toLocaleDateString("en-GB")}</span></div>
          <div class="info-row"><b>Center Code:</b> <span>DCC-UP01</span></div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th width="15%">TRANX DATE</th>
            <th width="45%">PARTICULARS / DESCRIPTION</th>
            <th width="20%">MODE</th>
            <th width="20%" class="text-right">AMOUNT (INR)</th>
          </tr>
        </thead>
        <tbody>
          ${e.map((c,h)=>`
            <tr class="${h%2===0?"":"even"}">
              <td>${c.date}</td>
              <td>${c.note||"Tution Fee Installment"}</td>
              <td>${c.method.toUpperCase()}</td>
              <td class="text-right">₹ ${c.amount}.00</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="summary-container">
        <table class="summary-table">
          <tr>
            <td class="bg-blue-light">GROSS PAYABLE FEE</td>
            <td class="text-right bg-blue-light">₹ ${d.netFee}.00</td>
          </tr>
          <tr>
            <td>TOTAL PAID TO DATE</td>
            <td class="text-right" style="color: #2e7d32;">₹ ${d.totalPaid}.00</td>
          </tr>
          <tr>
            <td class="bg-navy text-white">NET OUTSTANDING DUES</td>
            <td class="text-right bg-navy text-white">₹ ${d.balance}.00</td>
          </tr>
        </table>
      </div>

      <div class="declaration">
        <p><b>Amount in Words:</b> ${L(a?e[0].amount:d.totalPaid)} Rupees Only.</p>
        <p>* This is an official computer-generated fee statement. In case of any discrepancy, please report to the center office within 7 working days.</p>
      </div>

      <div class="footer-signs">
        <div class="sign-box">Accountant / Signatory</div>
        <div class="sign-box">Office Seal & Stamp</div>
      </div>
    </div>
  </body>
  </html>`},Q=(t,e,d)=>{const a=window.open("","_blank");a.document.write(S(t,e,d,!1)),a.document.close()},j=(t,e,d)=>{const a=window.open("","_blank");a.document.write(S(t,[e],d,!0)),a.document.close()},D=b.createContext(),_=()=>b.useContext(D),U=["ADCA","DCA","DFA","DTP","TALLY","BASIC COMPUTER","JAVA","PYTHON","WEB DESIGNING","CCC"],H=({children:t})=>{const[e,d]=b.useState([]),[a,o]=b.useState(!0);b.useEffect(()=>{const n=w(g(i,"exams"),F("createdAt","desc"));return I(n,s=>{d(s.docs.map(r=>({id:r.id,...r.data()}))),o(!1)})},[]);const c=async n=>{try{return(await C(g(i,"exams"),{...n,status:"Draft",isLive:!1,resultsPublished:!1,createdAt:v()})).id}catch{return null}},h=async(n,s)=>{try{const r=y(i);return(await E(w(g(i,"examQuestions"),T("examId","==",n)))).forEach(l=>r.delete(l.ref)),s.forEach(l=>{const m=u(g(i,"examQuestions"));r.set(m,{...l,examId:n})}),r.update(u(i,"exams",n),{status:"Ready",totalQuestions:s.length}),await r.commit(),!0}catch{return!1}},f=async(n,s)=>{try{const r=y(i);return s.forEach(p=>{const l=`${p}_${n}`,m=u(i,"studentExams",l);r.set(m,{studentId:p,examId:n,status:"Pending",score:0,assignedAt:v()})}),await r.commit(),!0}catch{return!1}},N=async(n,s,r,p)=>{try{const l=u(i,"studentExams",`${n}_${s}`);let m=0;return p.forEach(x=>{r[x.id]===x.correctAnswer&&(m+=Number(x.marks||1))}),await A(l,{status:"Completed",answers:r,score:m,completedAt:new Date}),{success:!0,score:m}}catch(l){return{success:!1,error:l.message}}},P=async n=>{if(window.confirm("PERMANENT DELETE: Are you sure? This will delete the exam and all related questions!"))try{const s=y(i);return(await E(w(g(i,"examQuestions"),T("examId","==",n)))).docs.forEach(p=>s.delete(p.ref)),s.delete(u(i,"exams",n)),await s.commit(),!0}catch{return!1}},R=async(n,s)=>await A(u(i,"exams",n),{isLive:!s});return O.jsx(D.Provider,{value:{exams:e,courses:U,loading:a,createExam:c,addQuestions:h,assignToStudents:f,submitExam:N,toggleExamLive:R,deleteExam:P},children:t})};export{k as C,H as E,G as a,Q as b,B as d,z as g,j as p,_ as u};
