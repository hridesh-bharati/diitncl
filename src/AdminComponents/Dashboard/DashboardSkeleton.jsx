import React from "react";

export default function DashboardSkeleton() {
  const Card = () => (
    <div className="col-6 col-lg-3">
      <div className="skel rounded-4 p-3 mb-3 shadow-sm" style={{ height: '100px' }}></div>
    </div>
  );

  return (
    <div className="container-fluid py-3">
      {/* Header */}
      <div className="d-flex justify-content-between mb-3 px-1">
        <div className="skel rounded-2" style={{ width: '150px', height: '28px' }}></div>
        <div className="skel rounded-pill" style={{ width: '90px', height: '28px' }}></div>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4].map(i => <Card key={i} />)}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3 shadow-sm overflow-hidden p-3">
        <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
           <div className="skel" style={{ width: '40%', height: '20px' }}></div>
           <div className="skel" style={{ width: '15%', height: '20px' }}></div>
        </div>
        <div className="vstack gap-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="d-flex justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <div className="skel rounded-circle" style={{ width: '35px', height: '35px' }}></div>
                <div className="vstack gap-1">
                  <div className="skel" style={{ width: '100px', height: '12px' }}></div>
                  <div className="skel" style={{ width: '60px', height: '8px' }}></div>
                </div>
              </div>
              <div className="skel" style={{ width: '40px', height: '15px' }}></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .skel { 
          background: #eee; 
          background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shim 1.5s infinite;
        }
        @keyframes shim { to { background-position: -200% 0; } }
      `}</style>
    </div>
  );
}