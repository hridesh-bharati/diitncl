import React from "react";
import { deletePayment, printSingleReceipt } from "./FeeServices";

export default function PaymentTable({ payments = [], student, summary }) { 
  return (
    <div className="table-responsive text-start">
      <table className="table table-hover mb-0">
        <thead className="bg-light text-secondary">
          <tr>
            <th className="ps-4 py-3" style={{fontSize: '12px', letterSpacing: '1px'}}>DATE</th>
            <th className="py-3" style={{fontSize: '12px', letterSpacing: '1px'}}>AMOUNT</th>
            <th className="py-3" style={{fontSize: '12px', letterSpacing: '1px'}}>PARTICULARS</th>
            <th className="text-end pe-4 py-3" style={{fontSize: '12px', letterSpacing: '1px'}}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((p) => (
              <tr key={p.id} className="align-middle border-bottom">
                <td className="ps-4">
                  <div className="fw-medium text-dark">{p.date}</div>
                  <small className="text-muted" style={{fontSize: '10px'}}>{p.method}</small>
                </td>
                <td>
                  <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill">
                    ₹{p.amount}.00
                  </span>
                </td>
                <td>
                  <div className="text-dark small fw-medium">{p.note}</div>
                </td>
                <td className="text-end pe-4">
                  <div className="d-flex justify-content-end gap-2">
                    {/* Action Print Button - Ab ye work karega */}
                    <button 
                      className="btn btn-sm btn-outline-dark border-0 shadow-sm rounded-3" 
                      title="Print Single Receipt"
                      onClick={() => printSingleReceipt(student, p, summary)}
                    >
                      <i className="bi bi-printer-fill"></i>
                    </button>
                    
                    <button 
                      className="btn btn-sm btn-outline-danger border-0 shadow-sm rounded-3"
                      onClick={() => deletePayment(student.id, p.id)}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                No payment records found for this student.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}