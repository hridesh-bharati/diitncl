import React from 'react';
import { Link } from 'react-router-dom';

const notices = [
  { text: "Course certified by Microsoft." },
  { text: "CCC free on ADCA course", imageSrc: "images/icon/gifPic.gif" },
  { text: "Free English Speaking & Personality Development classes", imageSrc: "images/icon/gifPic.gif" },
  { text: "प्रत्येक पाठ्यक्रम के पूरा होने पर नि: शुल्क प्रमाण पत्र।" },
  { text: "GOVT. recognized institute" },
];

export default function NoticeBoard() {
  return (
    <div className="card shadow-sm mb-3 mx-auto" style={{ maxWidth: '500px' }}>
      <div className="card-header bg-success text-white fw-bold">
        <i className="bi bi-bell-fill me-2"></i> Notice Board
      </div>
      <div className="card-body p-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {notices.map((notice, idx) => (
          <div key={idx} className="mb-2 border-bottom pb-1">
            <p className="mb-1 small">
              {notice.text}
              {notice.imageSrc && (
                <img src={notice.imageSrc} width="30" className="ms-2" alt="icon" />
              )}
            </p>
          </div>
        ))}
      </div>
      <div className="card-footer text-center p-1 bg-light">
        <Link to="/Download-Certificate" className="text-decoration-none fw-bold text-primary small">
          अपनी प्रमाणपत्र की स्थिति जानने के लिए क्लिक करें
        </Link>
      </div>
    </div>
  );
}
