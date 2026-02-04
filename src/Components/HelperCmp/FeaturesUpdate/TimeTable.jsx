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
    const currentDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

    return (
        <div className="app-dashboard-card shadow-sm border-0">
            <div className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                <div>
                    <h6 className="fw-bold mb-0">Center Timing</h6>
                    <p className="text-muted x-small-text mb-0">Visit us during working hours</p>
                </div>
                <div className="d-flex align-items-center bg-light px-2 py-1 rounded-pill" style={{border: '1px solid #eef2ff'}}>
                    <span className="rounded-circle me-2" style={{width: '6px', height: '6px', background: '#22c55e', animation: 'pulse-green 2s infinite'}}></span>
                    <span className="app-badge-tag text-success">Open Now</span>
                </div>
            </div>

            <div className="p-2">
                {schedule.map((item, idx) => {
                    const isToday = item.day === currentDay;
                    return (
                        <div key={idx} className={`d-flex justify-content-between align-items-center p-2 px-3 rounded-4 mb-1 transition-soft ${isToday ? 'bg-primary-subtle shadow-sm border border-primary-subtle' : ''}`}>
                            <div className="d-flex align-items-center">
                                <span className={`small ${isToday ? 'fw-bold text-primary' : 'text-secondary'}`}>{item.day}</span>
                                {isToday && <span className="app-badge-tag bg-primary text-white ms-2">Today</span>}
                            </div>
                            <span className={`small fw-bold ${item.isHoliday ? 'text-danger' : 'text-dark'}`}>
                                {item.time}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}