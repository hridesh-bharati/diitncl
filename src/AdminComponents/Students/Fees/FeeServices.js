// src\AdminComponents\Students\Fees\FeeServices.js
import { db } from "../../../firebase/firebase";
import { collection, addDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";

// 1. Course Config
export const COURSE_CONFIG = {
  "ADCA+": { duration: 18, monthly: 800, adm: 600 },
  "ADCA": { duration: 15, monthly: 700, adm: 500 },
  "DCA": { duration: 12, monthly: 700, adm: 500 },
  "DCAA": { duration: 6, monthly: 700, adm: 500 },
  "CCC": { duration: 3, monthly: 1000, adm: 500 },
};

// 2. Center Wise Configuration (Dynamic Address & Mobile)
const CENTER_CONFIG = {
  "DIIT124": {
    mobile: "+91 9918151032",
    address: "Paragpur Road, Near Sunshine School, Nichlaul - 273304",
    centerCode: "DIIT124"
  },
  "DIIT125": {
    mobile: "+91 7398889347",
    address: "Thoothibari, Pakali Mandi ke pass, Thoothibari - 273305",
    centerCode: "DIIT125"
  }
};

export const getFeeLogic = (courseName, payments = []) => {
  const c = courseName?.toUpperCase() || "";
  const conf = COURSE_CONFIG[c] || { duration: 6, monthly: 700, adm: 500 };
  const netFee = (conf.duration * conf.monthly) + conf.adm;
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  return { ...conf, netFee, totalPaid, balance: netFee - totalPaid };
};

export const addPayment = async (studentEmail, data) => {
  if (!studentEmail) throw new Error("Student Email is required");
  const emailId = studentEmail.toLowerCase().trim();
  await addDoc(collection(db, "admissions", emailId, "payments"), {
    ...data, 
    amount: Number(data.amount), 
    createdAt: serverTimestamp()
  });
};

export const deletePayment = async (studentEmail, pid) => {
  if (!studentEmail || !pid) return;
  if (window.confirm("Delete this payment permanently?")) {
    try {
      const emailId = studentEmail.toLowerCase().trim();
      const paymentDocRef = doc(db, "admissions", emailId, "payments", pid);
      await deleteDoc(paymentDocRef);
    } catch (error) {
      alert("Failed to delete payment: " + error.message);
    }
  }
};

const numberToWords = (num) => {
  const first = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const makeWords = (n) => {
    if (n < 20) return first[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + first[n % 10] : '');
    if (n < 1000) return first[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + makeWords(n % 100) : '');
    return n;
  };
  return num > 0 ? makeWords(num) : "Zero";
};

// --- DYNAMIC A4 TEMPLATE ---
const generateA4HTML = (student, paymentsArray, summary, isSingle = false) => {
  const docTitle = isSingle ? "OFFICIAL FEE RECEIPT" : "STUDENT FEE LEDGER / STATEMENT";
  
  // LOGIC: Check Registration No to decide Center Info
  const regNo = student?.regNo || "";
  let activeCenter = CENTER_CONFIG["DIIT124"]; // Default
  if (regNo.includes("DIIT125")) {
    activeCenter = CENTER_CONFIG["DIIT125"];
  }

  return `
  <html>
  <head>
    <title>Receipt_${student?.name}</title>
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
        <p>${activeCenter.address} | Mob: ${activeCenter.mobile}</p>
        <div class="header-line"></div>
      </div>

      <div class="doc-type">${docTitle}</div>

      <div class="info-section">
        <div>
           <div class="info-item"><label>Student Name:</label> <span>${student?.name?.toUpperCase()}</span></div>
           <div class="info-item"><label>Registration No:</label> <span>${student?.regNo || 'DCC-'+student?.course+'/N/A'}</span></div>
           <div class="info-item"><label>Course Title:</label> <span>${student?.course}</span></div>
        </div>
        <div>
           <div class="info-item"><label>Admission Date:</label> <span>${student?.admissionDate || 'N/A'}</span></div>
           <div class="info-item"><label>Statement Date:</label> <span>${new Date().toLocaleDateString('en-GB')}</span></div>
           <div class="info-item"><label>Center Code:</label> <span>${activeCenter.centerCode}</span></div>
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
          ${paymentsArray.map(p => `
            <tr>
              <td class="text-center">${p.date}</td>
              <td>${p.note || 'Monthly Fee'}</td>
              <td class="text-center">${p.method.toUpperCase()}</td>
              <td class="text-right">₹ ${p.amount}.00</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="summary-wrapper">
        <table class="summary-table">
          <tr>
            <td class="label-cell">Gross Payable Fee</td>
            <td class="value-cell" style="color:#1a237e">₹ ${summary.netFee}.00</td>
          </tr>
          <tr>
            <td class="label-cell">Total Paid to Date</td>
            <td class="value-cell paid-text">₹ ${summary.totalPaid}.00</td>
          </tr>
          <tr>
            <td class="label-cell">Net Outstanding Dues</td>
            <td class="value-cell due-text">₹ ${summary.balance}.00</td>
          </tr>
        </table>
      </div>

      <div class="bottom-notes">
        <div class="amount-words"><b>Amount in Words:</b> ${numberToWords(isSingle ? paymentsArray[0].amount : summary.totalPaid)} Rupees Only.</div>
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
  </html>`;
};

// 4. Print Handlers
export const printFullStatement = (student, payments, summary) => {
  const w = window.open("", "_blank");
  w.document.write(generateA4HTML(student, payments, summary, false));
  w.document.close();
};

export const printSingleReceipt = (student, payment, summary) => {
  const w = window.open("", "_blank");
  w.document.write(generateA4HTML(student, [payment], summary, true));
  w.document.close();
};