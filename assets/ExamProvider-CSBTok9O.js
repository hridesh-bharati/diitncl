import{d as u,b as d,C as P,D as A,m as x,E as b,q as v,z,o as L,G as E,n as C,w as T,u as D}from"./vendor-firebase-BF571AF8.js";import{r as g,j as O}from"./vendor-core-Dm5eHxbz.js";import{s as k}from"./courseData-CeKRB8nL.js";const M={"ADCA+":{duration:18,monthly:800,adm:600},ADCA:{duration:15,monthly:700,adm:500},DCA:{duration:12,monthly:700,adm:500},DCAA:{duration:6,monthly:700,adm:500},CCC:{duration:3,monthly:1e3,adm:500}},S={DIIT124:{mobile:"+91 9918151032",address:"Paragpur Road, Near Sunshine School, Nichlaul - 273304",centerCode:"DIIT124"},DIIT125:{mobile:"+91 7398889347",address:"Thoothibari, Pakali Mandi ke pass, Thoothibari - 273305",centerCode:"DIIT125"}},q=(e,t=[])=>{const a=e?.toUpperCase()||"",o=M[a]||{duration:6,monthly:700,adm:500},s=o.duration*o.monthly+o.adm,f=t.reduce((m,p)=>m+Number(p.amount||0),0);return{...o,netFee:s,totalPaid:f,balance:s-f}},B=async(e,t)=>{if(!e)throw new Error("Student Email is required");const a=e.toLowerCase().trim();await A(x(d,"admissions",a,"payments"),{...t,amount:Number(t.amount),createdAt:b()})},H=async(e,t)=>{if(!(!e||!t)&&window.confirm("Delete this payment permanently?"))try{const a=e.toLowerCase().trim(),o=u(d,"admissions",a,"payments",t);await P(o)}catch(a){alert("Failed to delete payment: "+a.message)}},U=e=>{const t=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],a=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],o=s=>s<20?t[s]:s<100?a[Math.floor(s/10)]+(s%10!==0?" "+t[s%10]:""):s<1e3?t[Math.floor(s/100)]+" Hundred"+(s%100!==0?" "+o(s%100):""):s;return e>0?o(e):"Zero"},I=(e,t,a,o=!1)=>{const s=o?"OFFICIAL FEE RECEIPT":"STUDENT FEE LEDGER / STATEMENT",f=e?.regNo||"";let m=S.DIIT124;return f.includes("DIIT125")&&(m=S.DIIT125),`
  <html>
  <head>
    <title>Receipt_${e?.name}</title>
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
        <p>${m.address} | Mob: ${m.mobile}</p>
        <div class="header-line"></div>
      </div>

      <div class="doc-type">${s}</div>

      <div class="info-section">
        <div>
           <div class="info-item"><label>Student Name:</label> <span>${e?.name?.toUpperCase()}</span></div>
           <div class="info-item"><label>Registration No:</label> <span>${e?.regNo||"DCC-"+e?.course+"/N/A"}</span></div>
           <div class="info-item"><label>Course Title:</label> <span>${e?.course}</span></div>
        </div>
        <div>
           <div class="info-item"><label>Admission Date:</label> <span>${e?.admissionDate||"N/A"}</span></div>
           <div class="info-item"><label>Statement Date:</label> <span>${new Date().toLocaleDateString("en-GB")}</span></div>
           <div class="info-item"><label>Center Code:</label> <span>${m.centerCode}</span></div>
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
          ${t.map(p=>`
            <tr>
              <td class="text-center">${p.date}</td>
              <td>${p.note||"Monthly Fee"}</td>
              <td class="text-center">${p.method.toUpperCase()}</td>
              <td class="text-right">₹ ${p.amount}.00</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="summary-wrapper">
        <table class="summary-table">
          <tr>
            <td class="label-cell">Gross Payable Fee</td>
            <td class="value-cell" style="color:#1a237e">₹ ${a.netFee}.00</td>
          </tr>
          <tr>
            <td class="label-cell">Total Paid to Date</td>
            <td class="value-cell paid-text">₹ ${a.totalPaid}.00</td>
          </tr>
          <tr>
            <td class="label-cell">Net Outstanding Dues</td>
            <td class="value-cell due-text">₹ ${a.balance}.00</td>
          </tr>
        </table>
      </div>

      <div class="bottom-notes">
        <div class="amount-words"><b>Amount in Words:</b> ${U(o?t[0].amount:a.totalPaid)} Rupees Only.</div>
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
  </html>`},W=(e,t,a)=>{const o=window.open("","_blank");o.document.write(I(e,t,a,!1)),o.document.close()},X=(e,t,a)=>{const o=window.open("","_blank");o.document.write(I(e,[t],a,!0)),o.document.close()},N=g.createContext(),Z=()=>g.useContext(N),_=k.map(e=>e.name),J=({children:e})=>{const[t,a]=g.useState([]),[o,s]=g.useState(!0);g.useEffect(()=>{const n=v(x(d,"exams"),z("createdAt","desc"));return L(n,r=>{a(r.docs.map(l=>({id:l.id,...l.data()}))),s(!1)},r=>{s(!1)})},[]);const f=async n=>{try{return(await A(x(d,"exams"),{...n,status:"Draft",isLive:!1,resultsPublished:!1,createdAt:b()})).id}catch{return null}},m=async(n,i)=>{try{const r=E(d);return(await C(v(x(d,"examQuestions"),T("examId","==",n)))).forEach(c=>r.delete(c.ref)),i.forEach(c=>{const h=u(x(d,"examQuestions"));r.set(h,{...c,examId:n})}),r.update(u(d,"exams",n),{status:"Ready",totalQuestions:i.length}),await r.commit(),!0}catch{return!1}},p=async(n,i)=>{try{const r=E(d);return i.forEach(l=>{const c=`${l}_${n}`,h=u(d,"studentExams",c);r.set(h,{studentId:l,examId:n,status:"Pending",score:0,assignedAt:b()})}),await r.commit(),!0}catch{return!1}},R=async(n,i,r,l)=>{try{const c=`${n.toLowerCase().trim()}_${i}`,h=u(d,"studentExams",c);let w=0;return l.forEach(y=>{r[y.id]===y.correctAnswer&&(w+=Number(y.marks||1))}),await D(h,{status:"Completed",answers:r,score:w,completedAt:b()}),{success:!0,score:w}}catch(c){return{success:!1,error:c.message}}},$=async n=>{if(window.confirm("PERMANENT DELETE: Are you sure? This will delete the exam and all related questions!"))try{const i=E(d);return(await C(v(x(d,"examQuestions"),T("examId","==",n)))).docs.forEach(l=>i.delete(l.ref)),i.delete(u(d,"exams",n)),await i.commit(),!0}catch{return!1}},F=async(n,i)=>await D(u(d,"exams",n),{isLive:!i});return O.jsx(N.Provider,{value:{exams:t,courses:_,loading:o,createExam:f,addQuestions:m,assignToStudents:p,submitExam:R,toggleExamLive:F,deleteExam:$},children:e})};export{M as C,J as E,B as a,W as b,H as d,q as g,X as p,Z as u};
