import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTypingEffect from "../../hooks/useTypingEffect";

const GlobleSearchBox = ({ routes = [], onSelect }) => {
  /* ================= PLACEHOLDER DATA ================= */
  const placeholders = [
    "Search courses...",
    "Search students...",
    "Search certificates...",
    "Search DIIT services..."
  ];

  /* ================= SEARCH STATE ================= */
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  /* ================= DRY TYPING HOOK ================= */
  const dynamicPlaceholder = useTypingEffect(placeholders, 70, 40, 1000);

  /* ================= FILTER ROUTES ================= */
  const filteredRoutes = routes
    .filter((r) => r.searchable !== false)
    .filter((r) =>
      r.label?.toLowerCase().includes(query.toLowerCase())
    );

  /* ================= HANDLERS ================= */
  const handleSelect = (path) => {
    setQuery("");
    navigate(path);
    if (onSelect) onSelect();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredRoutes.length > 0) {
      handleSelect(filteredRoutes[0].path);
    }
  };

  return (
    <div className="app-search-wrapper ms-1">
      {/* ===== INPUT (CHOTA KIA) ===== */}
      <div className="app-search-input">
        <i className="bi bi-search"></i>
        <input
          type="search"
          value={query}
          placeholder={query ? "" : dynamicPlaceholder}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* ===== SEARCH RESULTS LIST ===== */}
      {query && (
        <div className="app-search-list">
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route, idx) => {
              const matchIndex = route.label
                .toLowerCase()
                .indexOf(query.toLowerCase());

              const before = route.label.slice(0, matchIndex);
              const match = route.label.slice(matchIndex, matchIndex + query.length);
              const after = route.label.slice(matchIndex + query.length);

              return (
                <div
                  key={idx}
                  className="app-search-item"
                  onClick={() => handleSelect(route.path)}
                >
                  <div className="app-search-icon">
                    <i className={route.icon || "bi bi-search"}></i>
                  </div>

                  <div className="app-search-text">
                    <div className="title">
                      {before}
                      <span>{match}</span>
                      {after}
                    </div>
                    {route.desc && <div className="subtitle">{route.desc}</div>}
                  </div>

                  <i className="bi bi-chevron-right arrow"></i>
                </div>
              );
            })
          ) : (
            <div className="app-search-empty">
              <i className="bi bi-emoji-frown"></i>
              <span>No result found</span>
            </div>
          )}
        </div>
      )}

      {/* ===== CSS - SAB CHOTA KIA ===== */}
      <style>{`
        .app-search-wrapper {
          position: relative;
          width: 100%;
          z-index: 3000;
        }

        /* INPUT - CHOTA KIA */
        .app-search-input input {
          width: 100%;
          height: 34px; /* Pehle 38 tha */
          padding: 0 8px 0 32px; /* Kam kia */
          border-radius: 30px;
          border: 1px solid #e2e8f0;
          font-size: 12px; /* Chota font */
          background: #f8fafc;
          outline: none;
          transition: all 0.2s ease;
        }

        .app-search-input i {
          position: absolute;
          left: 10px; /* Adjust kia */
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 12px; /* Chota icon */
        }

        .app-search-input input:focus {
          border-color: #0a2885;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(10, 40, 133, 0.08);
        }

        /* RESULTS LIST - CHOTA KIA */
        .app-search-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px; /* Kam kia */
          background: white;
          border-radius: 14px; /* Chota radius */
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          max-height: 250px;
          overflow-y: auto;
          animation: slideUp 0.2s ease;
        }

        .app-search-item {
          display: flex;
          align-items: center;
          gap: 10px; /* Kam kia */
          padding: 8px 12px; /* Bahut chota kia */
          cursor: pointer;
          transition: background 0.2s;
        }

        .app-search-icon {
          width: 28px; /* Pehle 42 tha */
          height: 28px; /* Pehle 42 tha */
          border-radius: 8px; /* Chota radius */
          background: #0a2885;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px; /* Chota icon */
          flex-shrink: 0;
        }

        .app-search-text .title {
          font-size: 12px; /* Pehle 14 tha */
          font-weight: 600;
          color: #1e293b;
          line-height: 1.3;
        }

        .app-search-text .title span {
          color: #0a2885;
          font-weight: 700;
        }

        .app-search-text .subtitle {
          font-size: 10px; /* Pehle 11 tha */
          color: #64748b;
          margin-top: 2px;
        }

        .arrow {
          font-size: 14px; /* Chota */
          color: #94a3b8;
        }

        .app-search-empty {
          padding: 16px; /* Pehle 28 tha */
          text-align: center;
          color: #94a3b8;
          font-size: 12px;
        }

        .app-search-empty i {
          font-size: 20px; /* Pehle 26 tha */
          margin-bottom: 4px;
          display: block;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile me aur chota */
        @media (max-width: 768px) {
          .app-search-input input {
            height: 32px;
            font-size: 11px;
            padding: 0 6px 0 28px;
          }
          
          .app-search-input i {
            left: 8px;
            font-size: 11px;
          }
          
          .app-search-icon {
            width: 24px;
            height: 24px;
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default GlobleSearchBox;