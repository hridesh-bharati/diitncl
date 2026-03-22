import React from "react";
import { deletePayment, printSingleReceipt } from "./FeeServices";

export default function PaymentTable({ payments = [], student, summary }) {
  return (
    <div className="table-responsive border-0 overflow-hidden">
      <table className="table table-hover align-middle mb-0 w-100" style={{ tableLayout: 'fixed' }}>
        <thead className="bg-light">
          <tr className="small text-uppercase text-secondary" style={{ fontSize: '11px' }}>
            <th className="ps-2" style={{ width: '30%' }}>Date</th>
            <th style={{ width: '25%' }}>Amount</th>
            <th style={{ width: '30%' }}>Note</th>
            <th className="text-end pe-2" style={{ width: '15%' }}>Act</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? payments.map((p) => (
            <tr key={p.id} style={{ fontSize: '14px' }}>
              <td className="ps-2 text-nowrap">
                <div className="fw-bold">{p.date}</div>
                <small className="text-muted d-block" style={{ fontSize: '9px' }}>{p.method}</small>
              </td>
              <td>
                <span className="badge bg-primary-subtle text-primary p-1" style={{ fontSize: '11px' }}>₹{p.amount}</span>
              </td>
              <td className="text-truncate small">
                {p.note}
              </td>
              <td className="text-end pe-2">
                <div className="d-flex justify-content-end gap-1">
                  <button className="btn btn-sm p-0 text-dark" onClick={() => printSingleReceipt(student, p, summary)}>
                    <i className="bi bi-printer" style={{ fontSize: '14px' }}></i>
                  </button>
                  <button className="btn btn-sm p-0 ms-2 text-danger" onClick={() => deletePayment(student.email || student.id, p.id)}>
                    <i className="bi bi-trash3" style={{ fontSize: '14px' }}></i>
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="4" className="text-center py-4 text-muted small">No records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}