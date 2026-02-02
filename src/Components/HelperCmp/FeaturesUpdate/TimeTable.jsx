import React from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimeTable() {
  return (
    <div className="card shadow-sm mb-3 mx-auto" style={{ maxWidth: '500px' }}>
      <div className="card-header bg-primary text-white fw-bold">
        <i className="bi bi-clock-history me-2"></i> Opening Hours
      </div>
      <div className="card-body p-2">
        <table className="table table-sm mb-0">
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="text-secondary">{day}:</td>
                <td className="text-secondary">{day === 'Sunday' ? 'Closed' : '07am - 07pm'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
