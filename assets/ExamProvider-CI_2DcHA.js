import{C as P,e as u,d as i,D as A,c as g,E as f,q as y,z as F,o as I,G as v,g as E,w as N,u as T}from"./vendor-firebase-Cj3TY1h1.js";import{r as b,j as O}from"./vendor-core-DhK4p7pv.js";import{s as k}from"./courseData-CeKRB8nL.js";const L={"ADCA+":{duration:18,monthly:800,adm:600},ADCA:{duration:15,monthly:700,adm:500},DCA:{duration:12,monthly:700,adm:500},DCAA:{duration:6,monthly:700,adm:500},CCC:{duration:3,monthly:1e3,adm:500}},j=(e,t=[])=>{const d=e?.toUpperCase()||"",o=L[d]||{duration:6,monthly:700,adm:500},a=o.duration*o.monthly+o.adm,l=t.reduce((h,x)=>h+Number(x.amount||0),0);return{...o,netFee:a,totalPaid:l,balance:a-l}},_=async(e,t)=>{await A(g(i,"admissions",e,"payments"),{...t,amount:Number(t.amount),createdAt:f()})},B=async(e,t)=>{window.confirm("Delete this payment permanently?")&&await P(u(i,"admissions",e,"payments",t))},U=e=>{const t=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],d=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],o=a=>a<20?t[a]:a<100?d[Math.floor(a/10)]+(a%10!==0?" "+t[a%10]:""):a<1e3?t[Math.floor(a/100)]+" Hundred"+(a%100!==0?" "+o(a%100):""):a;return e>0?o(e):"Zero"},C=(e,t,d,o=!1)=>{const a=o?"OFFICIAL FEE RECEIPT":"STUDENT FEE LEDGER / STATEMENT";return`
  <html>
  <head>
    <title>${e?.name} - Statement</title>
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
    <div className="page">
      <div className="watermark">DRISHTEE CC</div>
      
      <div className="header-container">
        <h1>Drishtee Computer Center</h1>
        <p>Managed by Drishtee Educational & Charitable Trust</p>
        <p>An ISO 9001:2015 Certified IT Training Institute</p>
        <p>Paragpur Road , Nichlaul - 221001 | Web: www.drishteeindia.com | Mob: +91 9918151032</p>
      </div>

      <div className="doc-header">${a}</div>

      <div className="student-info">
        <div className="info-group">
          <div className="info-row"><b>Student Name:</b> <span>${e?.name?.toUpperCase()}</span></div>
          <div className="info-row"><b>Registration No:</b> <span>${e?.regNo||"DCC-"+e?.id?.slice(-5).toUpperCase()}</span></div>
          <div className="info-row"><b>Course Title:</b> <span>${e?.course}</span></div>
        </div>
        <div className="info-group">
          <div className="info-row"><b>Admission Date:</b> <span>${e?.admissionDate||"N/A"}</span></div>
          <div className="info-row"><b>Statement Date:</b> <span>${new Date().toLocaleDateString("en-GB")}</span></div>
          <div className="info-row"><b>Center Code:</b> <span>DIIT124</span></div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th width="15%">TRANX DATE</th>
            <th width="45%">PARTICULARS / DESCRIPTION</th>
            <th width="20%">MODE</th>
            <th width="20%" className="text-right">AMOUNT (INR)</th>
          </tr>
        </thead>
        <tbody>
          ${t.map((l,h)=>`
            <tr className="${h%2===0?"":"even"}">
              <td>${l.date}</td>
              <td>${l.note||"Tution Fee Installment"}</td>
              <td>${l.method.toUpperCase()}</td>
              <td className="text-right">₹ ${l.amount}.00</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div className="summary-container">
        <table className="summary-table">
          <tr>
            <td className="bg-blue-light">GROSS PAYABLE FEE</td>
            <td className="text-right bg-blue-light">₹ ${d.netFee}.00</td>
          </tr>
          <tr>
            <td>TOTAL PAID TO DATE</td>
            <td className="text-right" style="color: #2e7d32;">₹ ${d.totalPaid}.00</td>
          </tr>
          <tr>
            <td className="bg-navy text-white">NET OUTSTANDING DUES</td>
            <td className="text-right bg-navy text-white">₹ ${d.balance}.00</td>
          </tr>
        </table>
      </div>

      <div className="declaration">
        <p><b>Amount in Words:</b> ${U(o?t[0].amount:d.totalPaid)} Rupees Only.</p>
        <p>* This is an official computer-generated fee statement. In case of any discrepancy, please report to the center office within 7 working days.</p>
      </div>

      <div className="footer-signs">
        <div className="sign-box">Accountant / Signatory</div>
        <div className="sign-box">Office Seal & Stamp</div>
      </div>
    </div>
  </body>
  </html>`},q=(e,t,d)=>{const o=window.open("","_blank");o.document.write(C(e,t,d,!1)),o.document.close()},H=(e,t,d)=>{const o=window.open("","_blank");o.document.write(C(e,[t],d,!0)),o.document.close()},S=b.createContext(),W=()=>b.useContext(S),z=k.map(e=>e.name),X=({children:e})=>{const[t,d]=b.useState([]),[o,a]=b.useState(!0);b.useEffect(()=>{const n=y(g(i,"exams"),F("createdAt","desc"));return I(n,r=>{d(r.docs.map(c=>({id:c.id,...c.data()}))),a(!1)},r=>{a(!1)})},[]);const l=async n=>{try{return(await A(g(i,"exams"),{...n,status:"Draft",isLive:!1,resultsPublished:!1,createdAt:f()})).id}catch{return null}},h=async(n,s)=>{try{const r=v(i);return(await E(y(g(i,"examQuestions"),N("examId","==",n)))).forEach(m=>r.delete(m.ref)),s.forEach(m=>{const p=u(g(i,"examQuestions"));r.set(p,{...m,examId:n})}),r.update(u(i,"exams",n),{status:"Ready",totalQuestions:s.length}),await r.commit(),!0}catch{return!1}},x=async(n,s)=>{try{const r=v(i);return s.forEach(c=>{const m=`${c}_${n}`,p=u(i,"studentExams",m);r.set(p,{studentId:c,examId:n,status:"Pending",score:0,assignedAt:f()})}),await r.commit(),!0}catch{return!1}},D=async(n,s,r,c)=>{try{const m=u(i,"studentExams",`${n}_${s}`);let p=0;return c.forEach(w=>{r[w.id]===w.correctAnswer&&(p+=Number(w.marks||1))}),await T(m,{status:"Completed",answers:r,score:p,completedAt:f()}),{success:!0,score:p}}catch(m){return{success:!1,error:m.message}}},R=async n=>{if(window.confirm("PERMANENT DELETE: Are you sure? This will delete the exam and all related questions!"))try{const s=v(i);return(await E(y(g(i,"examQuestions"),N("examId","==",n)))).docs.forEach(c=>s.delete(c.ref)),s.delete(u(i,"exams",n)),await s.commit(),!0}catch{return!1}},$=async(n,s)=>await T(u(i,"exams",n),{isLive:!s});return O.jsx(S.Provider,{value:{exams:t,courses:z,loading:o,createExam:l,addQuestions:h,assignToStudents:x,submitExam:D,toggleExamLive:$,deleteExam:R},children:e})};export{L as C,X as E,_ as a,q as b,B as d,j as g,H as p,W as u};
