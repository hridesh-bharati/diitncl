import{h as c,d as p,b as d,n as m,f as b,s as g}from"./index-D0gKX-V7.js";const h={"ADCA+":{duration:18,monthly:800,adm:600},ADCA:{duration:15,monthly:700,adm:500},DCA:{duration:12,monthly:700,adm:500},DCAA:{duration:6,monthly:700,adm:500},CCC:{duration:3,monthly:1e3,adm:500}},u=(t,e=[])=>{const i=t?.toUpperCase()||"",o=h[i]||{duration:6,monthly:700,adm:500},a=o.duration*o.monthly+o.adm,n=e.reduce((r,l)=>r+Number(l.amount||0),0);return{...o,netFee:a,totalPaid:n,balance:a-n}},w=async(t,e)=>{await m(b(d,"admissions",t,"payments"),{...e,amount:Number(e.amount),createdAt:g()})},y=async(t,e)=>{window.confirm("Delete this payment permanently?")&&await c(p(d,"admissions",t,"payments",e))},f=t=>{const e=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],i=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],o=a=>a<20?e[a]:a<100?i[Math.floor(a/10)]+(a%10!==0?" "+e[a%10]:""):a<1e3?e[Math.floor(a/100)]+" Hundred"+(a%100!==0?" "+o(a%100):""):a;return t>0?o(t):"Zero"},s=(t,e,i,o=!1)=>{const a=o?"OFFICIAL FEE RECEIPT":"STUDENT FEE LEDGER / STATEMENT";return`
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

      <div class="doc-header">${a}</div>

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
          ${e.map((n,r)=>`
            <tr class="${r%2===0?"":"even"}">
              <td>${n.date}</td>
              <td>${n.note||"Tution Fee Installment"}</td>
              <td>${n.method.toUpperCase()}</td>
              <td class="text-right">₹ ${n.amount}.00</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="summary-container">
        <table class="summary-table">
          <tr>
            <td class="bg-blue-light">GROSS PAYABLE FEE</td>
            <td class="text-right bg-blue-light">₹ ${i.netFee}.00</td>
          </tr>
          <tr>
            <td>TOTAL PAID TO DATE</td>
            <td class="text-right" style="color: #2e7d32;">₹ ${i.totalPaid}.00</td>
          </tr>
          <tr>
            <td class="bg-navy text-white">NET OUTSTANDING DUES</td>
            <td class="text-right bg-navy text-white">₹ ${i.balance}.00</td>
          </tr>
        </table>
      </div>

      <div class="declaration">
        <p><b>Amount in Words:</b> ${f(o?e[0].amount:i.totalPaid)} Rupees Only.</p>
        <p>* This is an official computer-generated fee statement. In case of any discrepancy, please report to the center office within 7 working days.</p>
      </div>

      <div class="footer-signs">
        <div class="sign-box">Accountant / Signatory</div>
        <div class="sign-box">Office Seal & Stamp</div>
      </div>
    </div>
  </body>
  </html>`},v=(t,e,i)=>{const o=window.open("","_blank");o.document.write(s(t,e,i,!1)),o.document.close()},T=(t,e,i)=>{const o=window.open("","_blank");o.document.write(s(t,[e],i,!0)),o.document.close()};export{h as C,w as a,v as b,y as d,u as g,T as p};
