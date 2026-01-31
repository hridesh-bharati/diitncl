import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
const CountdownTimer = () => {
    // 1. Initial Data
    const statisticsData = [
        { number: "50K+", text: "Books Collection", target: 50000 },
        { number: "10K+", text: "E-Resources", target: 10000 },
        { number: "24/7", text: "Digital Access", target: 24 },
        { number: "500+", text: "Study Spaces", target: 500 },
    ];

    // 2. State: Har item ki current value track karne ke liye
    const [counts, setCounts] = useState(statisticsData.map(() => 0));

    useEffect(() => {
        const duration = 2000; // Animation 2 seconds tak chalegi
        const frameRate = 1000 / 60; // 60 FPS (smooth animation ke liye)
        const totalFrames = Math.round(duration / frameRate);

        let frame = 0;
        const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;

            setCounts(statisticsData.map(stat => {
                const currentCount = Math.round(stat.target * progress);
                return currentCount > stat.target ? stat.target : currentCount;
            }));

            if (frame === totalFrames) {
                clearInterval(timer);
            }
        }, frameRate);

        return () => clearInterval(timer);
    }, []);

    // 3. UI Component
    return (
        <div className="py-5 bg-light">
            <div className="container">
                <div className="row text-center g-4">
                    {statisticsData.map((stat, index) => (
                        <div key={index} className="col-6 col-md-3">
                            <div className="p-4 shadow-sm rounded bg-white h-100 border-bottom border-primary border-4">
                                <h2 className="display-5 fw-bold text-primary">
                                    {/* Agar counting khatam ho gayi toh original text dikhao (50K+), warna number */}
                                    {counts[index] === stat.target ? stat.number : counts[index]}
                                </h2>
                                <p className="text-muted mb-0 fw-semibold">
                                    {stat.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;