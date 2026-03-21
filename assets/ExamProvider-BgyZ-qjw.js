import{C as F,e as u,d as i,D as A,c as g,E as x,q as y,z as P,o as O,G as v,g as E,w as N,u as T}from"./vendor-firebase-D17fb6t0.js";import{r as f,j as k}from"./vendor-core-DhK4p7pv.js";import{s as I}from"./courseData-CeKRB8nL.js";const L={"ADCA+":{duration:18,monthly:800,adm:600},ADCA:{duration:15,monthly:700,adm:500},DCA:{duration:12,monthly:700,adm:500},DCAA:{duration:6,monthly:700,adm:500},CCC:{duration:3,monthly:1e3,adm:500}},j=(e,a=[])=>{const d=e?.toUpperCase()||"",n=L[d]||{duration:6,monthly:700,adm:500},o=n.duration*n.monthly+n.adm,l=a.reduce((h,w)=>h+Number(w.amount||0),0);return{...n,netFee:o,totalPaid:l,balance:o-l}},_=async(e,a)=>{await A(g(i,"admissions",e,"payments"),{...a,amount:Number(a.amount),createdAt:x()})},B=async(e,a)=>{window.confirm("Delete this payment permanently?")&&await F(u(i,"admissions",e,"payments",a))},U=e=>{const a=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],d=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],n=o=>o<20?a[o]:o<100?d[Math.floor(o/10)]+(o%10!==0?" "+a[o%10]:""):o<1e3?a[Math.floor(o/100)]+" Hundred"+(o%100!==0?" "+n(o%100):""):o;return e>0?n(e):"Zero"},C=(e,a,d,n=!1)=>{const o=n?"OFFICIAL FEE RECEIPT":"STUDENT FEE LEDGER / STATEMENT";return`
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

      <div className="doc-header">${o}</div>

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
          ${a.map((l,h)=>`
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
        <p><b>Amount in Words:</b> ${U(n?a[0].amount:d.totalPaid)} Rupees Only.</p>
        <p>* This is an official computer-generated fee statement. In case of any discrepancy, please report to the center office within 7 working days.</p>
      </div>

      <div className="footer-signs">
        <div className="sign-box">Accountant / Signatory</div>
        <div className="sign-box">Office Seal & Stamp</div>
      </div>
    </div>
  </body>
  </html>`},H=(e,a,d)=>{const n=window.open("","_blank");n.document.write(C(e,a,d,!1)),n.document.close()},W=(e,a,d)=>{const n=window.open("","_blank");n.document.write(C(e,[a],d,!0)),n.document.close()},S=f.createContext(),q=()=>f.useContext(S),z=I?.map(e=>e.name)||[],X=({children:e})=>{const[a,d]=f.useState([]),[n,o]=f.useState(!0);f.useEffect(()=>{const s=y(g(i,"exams"),P("createdAt","desc")),t=O(s,r=>{d(r.docs.map(c=>({id:c.id,...c.data()}))),o(!1)},r=>{o(!1)});return()=>t()},[]);const l=async s=>{try{return(await A(g(i,"exams"),{...s,status:"Draft",isLive:!1,resultsPublished:!1,createdAt:x()})).id}catch{return null}},h=async(s,t)=>{if(!t||!t.length)return!1;try{const r=v(i);return(await E(y(g(i,"examQuestions"),N("examId","==",s)))).forEach(m=>r.delete(m.ref)),t.forEach(m=>{const p=u(g(i,"examQuestions"));r.set(p,{...m,examId:s})}),r.update(u(i,"exams",s),{status:"Ready",totalQuestions:t.length}),await r.commit(),!0}catch{return!1}},w=async(s,t)=>{if(!t||!t.length)return!1;try{const r=v(i);return t.forEach(c=>{const m=`${c}_${s}`,p=u(i,"studentExams",m);r.set(p,{studentId:c,examId:s,status:"Pending",score:0,assignedAt:x()})}),await r.commit(),!0}catch{return!1}},D=async(s,t,r,c)=>{try{const m=u(i,"studentExams",`${s}_${t}`);let p=0;return c.forEach(b=>{r[b.id]!=null&&r[b.id]===b.correctAnswer&&(p+=parseFloat(b.marks||1))}),await T(m,{status:"Completed",answers:r,score:p,completedAt:x()}),{success:!0,score:p}}catch(m){return{success:!1,error:m.message}}},R=async s=>{if(!window.confirm("PERMANENT DELETE: Are you sure? This will delete the exam and all related questions!"))return!1;try{const t=v(i);return(await E(y(g(i,"examQuestions"),N("examId","==",s)))).docs.forEach(c=>t.delete(c.ref)),t.delete(u(i,"exams",s)),await t.commit(),!0}catch{return!1}},$=async(s,t)=>{try{return await T(u(i,"exams",s),{isLive:!t}),!0}catch{return!1}};return k.jsx(S.Provider,{value:{exams:a,courses:z,loading:n,createExam:l,addQuestions:h,assignToStudents:w,submitExam:D,toggleExamLive:$,deleteExam:R},children:e})};export{L as C,X as E,_ as a,H as b,B as d,j as g,W as p,q as u};
