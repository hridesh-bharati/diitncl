import React, { useState, useEffect } from 'react';

const SCHED = [
    { d: 'Monday', t: '07am - 07pm', o: 7, c: 19 },
    { d: 'Tuesday', t: '07am - 07pm', o: 7, c: 19 },
    { d: 'Wednesday', t: '07am - 07pm', o: 7, c: 19 },
    { d: 'Thursday', t: '07am - 07pm', o: 7, c: 19 },
    { d: 'Friday', t: '07am - 07pm', o: 7, c: 19 },
    { d: 'Saturday', t: '07am - 07pm', o: 7, c: 19 },
    { d: 'Sunday', t: 'Closed', h: true },
];

export default function UpdatesAndTiming() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
    const today = SCHED.find(s => s.d === dayName);
    const isOpen = today && !today.h && now.getHours() >= today.o && now.getHours() < today.c;

    return (
        <div className="card border-0 rounded-4 bg-white shadow-sm overflow-hidden">
            <div className="p-3 maroonGD text-white">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="fw-bold mb-0">Center Timing</h6>
                    <span className={`badge rounded-pill px-2 py-1 ${isOpen ? 'bg-white text-success' : 'bg-light text-muted'}`} style={{fontSize: '11px'}}>
                        {isOpen ? '● OPEN' : '○ CLOSED'}
                    </span>
                </div>
                <small className="opacity-75">Live: <b>{now.toLocaleTimeString()}</b></small>
            </div>

            <div className="p-3">
                {SCHED.map((s) => (
                    <div key={s.d} className={`d-flex justify-content-between p-2 rounded-3 mb-1 ${s.d === dayName ? 'bg-danger bg-opacity-10 border border-danger-subtle' : 'bg-light'}`}>
                        <span className={`small fw-bold ${s.d === dayName ? 'text-danger' : ''}`}>{s.d}</span>
                        <span className={`small ${s.h || s.d === dayName ? 'text-danger fw-bold' : 'text-muted'}`}>{s.t}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}