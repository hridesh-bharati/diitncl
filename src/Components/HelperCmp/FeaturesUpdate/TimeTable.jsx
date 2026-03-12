import React from 'react';

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
    const currentDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">Center Timing</h6>
                <div className="badge bg-success-subtle text-success border-success border rounded-pill px-2">Open Now</div>
            </div>

            <div className="p-2 bg-white">
                {schedule.map((item, idx) => {
                    const isToday = item.day === currentDay;
                    return (
                        <div key={idx} className={`d-flex justify-content-between p-2 px-3 rounded-3 mb-1 ${isToday ? 'bg-primary text-white shadow-sm' : 'bg-light text-dark'}`}>
                            <span className="small fw-bold">{item.day} {isToday && ' (Today)'}</span>
                            <span className={`small fw-bold ${item.isHoliday && !isToday ? 'text-danger' : ''}`}>{item.time}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}