import React from 'react';
import './FeatureUpdates.css';

const schedule = [
    { day: 'Monday', time: '07am - 07pm' },
    { day: 'Tuesday', time: '07am - 07pm' },
    { day: 'Wednesday', time: '07am - 07pm' },
    { day: 'Thursday', time: '07am - 07pm' },
    { day: 'Friday', time: '07am - 07pm' },
    { day: 'Saturday', time: '07am - 07pm' },
    { day: 'Sunday', time: 'Closed', isHoliday: true },
];

export default function UpdatesAndTiming() {
    // Current day nikalne ke liye
    const currentDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            {/* Header */}
            <div className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                <div>
                    <h6 className="fw-bold mb-0">Center Timing</h6>
                    <small className="text-muted">Working Hours</small>
                </div>
                <div className="d-flex align-items-center border px-2 py-1 rounded-pill">
                    <span className="bg-success rounded-circle me-2" style={{width: '6px', height: '6px', display: 'inline-block'}}></span>
                    <span className="text-success fw-bold" style={{fontSize: '11px'}}>Open Now</span>
                </div>
            </div>

            {/* List */}
            <div className="p-2 bg-white">
                {schedule.map((item, idx) => {
                    const isToday = item.day === currentDay;
                    return (
                        <div key={idx} 
                             className={`d-flex justify-content-between align-items-center p-2 px-3 rounded-3 mb-1 ${isToday ? 'bg-primary text-white shadow' : 'bg-light'}`}
                             style={{ transition: '0.3s' }}>
                            
                            <div className="d-flex align-items-center">
                                <span className="small fw-bold">{item.day}</span>
                                {isToday && <span className="badge bg-white text-primary ms-2" style={{fontSize: '9px'}}>TODAY</span>}
                            </div>
                            
                            <span className={`small fw-bold ${item.isHoliday && !isToday ? 'text-danger' : ''}`}>
                                {item.time}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}