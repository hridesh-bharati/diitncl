import{C as I,d as u,b as d,D as C,m as h,E as f,q as y,z as P,o as F,G as v,n as E,w as N,u as T}from"./vendor-firebase-CD8sdJEE.js";import{r as b,j as O}from"./vendor-core-DhK4p7pv.js";import{s as k}from"./courseData-CeKRB8nL.js";const L={"ADCA+":{duration:18,monthly:800,adm:600},ADCA:{duration:15,monthly:700,adm:500},DCA:{duration:12,monthly:700,adm:500},DCAA:{duration:6,monthly:700,adm:500},CCC:{duration:3,monthly:1e3,adm:500}},j=(e,t=[])=>{const o=e?.toUpperCase()||"",n=L[o]||{duration:6,monthly:700,adm:500},a=n.duration*n.monthly+n.adm,l=t.reduce((g,x)=>g+Number(x.amount||0),0);return{...n,netFee:a,totalPaid:l,balance:a-l}},_=async(e,t)=>{if(!e)throw new Error("Student Email is required");const o=e.toLowerCase().trim();await C(h(d,"admissions",o,"payments"),{...t,amount:Number(t.amount),createdAt:f()})},q=async(e,t)=>{if(window.confirm("Delete this payment permanently?")){const o=e.toLowerCase().trim();await I(u(d,"admissions",o,"payments",t))}},U=e=>{const t=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],o=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],n=a=>a<20?t[a]:a<100?o[Math.floor(a/10)]+(a%10!==0?" "+t[a%10]:""):a<1e3?t[Math.floor(a/100)]+" Hundred"+(a%100!==0?" "+n(a%100):""):a;return e>0?n(e):"Zero"},A=(e,t,o,n=!1)=>{const a=n?"OFFICIAL FEE RECEIPT":"STUDENT FEE LEDGER / STATEMENT";return`
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
          ${t.map((l,g)=>`
            <tr className="${g%2===0?"":"even"}">
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
            <td className="text-right bg-blue-light">₹ ${o.netFee}.00</td>
          </tr>
          <tr>
            <td>TOTAL PAID TO DATE</td>
            <td className="text-right" style="color: #2e7d32;">₹ ${o.totalPaid}.00</td>
          </tr>
          <tr>
            <td className="bg-navy text-white">NET OUTSTANDING DUES</td>
            <td className="text-right bg-navy text-white">₹ ${o.balance}.00</td>
          </tr>
        </table>
      </div>

      <div className="declaration">
        <p><b>Amount in Words:</b> ${U(n?t[0].amount:o.totalPaid)} Rupees Only.</p>
        <p>* This is an official computer-generated fee statement. In case of any discrepancy, please report to the center office within 7 working days.</p>
      </div>

      <div className="footer-signs">
        <div className="sign-box">Accountant / Signatory</div>
        <div className="sign-box">Office Seal & Stamp</div>
      </div>
    </div>
  </body>
  </html>`},B=(e,t,o)=>{const n=window.open("","_blank");n.document.write(A(e,t,o,!1)),n.document.close()},H=(e,t,o)=>{const n=window.open("","_blank");n.document.write(A(e,[t],o,!0)),n.document.close()},S=b.createContext(),W=()=>b.useContext(S),z=k.map(e=>e.name),X=({children:e})=>{const[t,o]=b.useState([]),[n,a]=b.useState(!0);b.useEffect(()=>{const s=y(h(d,"exams"),P("createdAt","desc"));return F(s,i=>{o(i.docs.map(c=>({id:c.id,...c.data()}))),a(!1)},i=>{a(!1)})},[]);const l=async s=>{try{return(await C(h(d,"exams"),{...s,status:"Draft",isLive:!1,resultsPublished:!1,createdAt:f()})).id}catch{return null}},g=async(s,r)=>{try{const i=v(d);return(await E(y(h(d,"examQuestions"),N("examId","==",s)))).forEach(m=>i.delete(m.ref)),r.forEach(m=>{const p=u(h(d,"examQuestions"));i.set(p,{...m,examId:s})}),i.update(u(d,"exams",s),{status:"Ready",totalQuestions:r.length}),await i.commit(),!0}catch{return!1}},x=async(s,r)=>{try{const i=v(d);return r.forEach(c=>{const m=`${c}_${s}`,p=u(d,"studentExams",m);i.set(p,{studentId:c,examId:s,status:"Pending",score:0,assignedAt:f()})}),await i.commit(),!0}catch{return!1}},D=async(s,r,i,c)=>{try{const m=u(d,"studentExams",`${s}_${r}`);let p=0;return c.forEach(w=>{i[w.id]===w.correctAnswer&&(p+=Number(w.marks||1))}),await T(m,{status:"Completed",answers:i,score:p,completedAt:f()}),{success:!0,score:p}}catch(m){return{success:!1,error:m.message}}},R=async s=>{if(window.confirm("PERMANENT DELETE: Are you sure? This will delete the exam and all related questions!"))try{const r=v(d);return(await E(y(h(d,"examQuestions"),N("examId","==",s)))).docs.forEach(c=>r.delete(c.ref)),r.delete(u(d,"exams",s)),await r.commit(),!0}catch{return!1}},$=async(s,r)=>await T(u(d,"exams",s),{isLive:!r});return O.jsx(S.Provider,{value:{exams:t,courses:z,loading:n,createExam:l,addQuestions:g,assignToStudents:x,submitExam:D,toggleExamLive:$,deleteExam:R},children:e})};export{L as C,X as E,_ as a,B as b,q as d,j as g,H as p,W as u};
