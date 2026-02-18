import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GlobleSearchBox = ({ routes = [], onSelect }) => {
  /* ================= PLACEHOLDER TYPING ================= */
  const placeholders = [
    "Search courses...",
    "Search students...",
    "Search certificates...",
    "Search DIIT services..."
  ];

  const [placeholder, setPlaceholder] = useState("");
  const [pIndex, setPIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ================= SEARCH STATE ================= */
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  /* ================= PLACEHOLDER ANIMATION ================= */
  useEffect(() => {
    if (query) return;

    const current = placeholders[pIndex];
    let timer;

    if (!isDeleting && charIndex < current.length) {
      timer = setTimeout(() => {
        setPlaceholder(current.slice(0, charIndex + 1));
        setCharIndex((p) => p + 1);
      }, 70);
    } else if (isDeleting && charIndex > 0) {
      timer = setTimeout(() => {
        setPlaceholder(current.slice(0, charIndex - 1));
        setCharIndex((p) => p - 1);
      }, 40);
    } else if (!isDeleting && charIndex === current.length) {
      timer = setTimeout(() => setIsDeleting(true), 900);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPIndex((p) => (p + 1) % placeholders.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, pIndex, query]);

  /* ================= FILTER ROUTES ================= */
  const filteredRoutes = routes
    .filter((r) => r.searchable !== false)
    .filter((r) =>
      r.label?.toLowerCase().includes(query.toLowerCase())
    );

  /* ================= SELECT HANDLER ================= */
  const handleSelect = (path) => {
    setQuery("");
    navigate(path);

    // ✅ close mobile search overlay
    if (onSelect) onSelect();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredRoutes.length > 0) {
      handleSelect(filteredRoutes[0].path);
    }
  };

  return (
    <div className="app-search-wrapper">
      {/* ===== INPUT ===== */}
      <div className="app-search-input">
        <i className="bi bi-search"></i>
        <input
          type="search"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value) setCharIndex(0);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* ===== APP STYLE LIST ===== */}
      {query && (
        <div className="app-search-list">
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route, idx) => {
              const matchIndex = route.label
                .toLowerCase()
                .indexOf(query.toLowerCase());

              const before = route.label.slice(0, matchIndex);
              const match = route.label.slice(
                matchIndex,
                matchIndex + query.length
              );
              const after = route.label.slice(
                matchIndex + query.length
              );

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

                    {route.desc && (
                      <div className="subtitle">{route.desc}</div>
                    )}
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

      {/* ===== CSS ===== */}
      <style>{`
        .app-search-wrapper {
          position: relative;
          width: 100%;
          z-index: 3000;
        }

        .app-search-input {
          position: relative;
        }

        .app-search-input i {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 14px;
        }

        .app-search-input input {
          width: 100%;
          height: 38px;
          padding: 0 12px 0 36px;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          outline: none;
        }

        /* ===== LIST ===== */
        .app-search-list {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          margin-top: 8px;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(14px);
          border-radius: 18px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
          max-height: 280px;
          overflow-y: auto;
          animation: slideUp 0.25s ease;
        }

        .app-search-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          cursor: pointer;
        }

        .app-search-item:active {
          background: #f1f5ff;
          transform: scale(0.98);
        }

        .app-search-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0a2885, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          flex-shrink: 0;
        }

        .app-search-text {
          flex: 1;
        }

        .app-search-text .title {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

        .app-search-text .title span {
          color: #2563eb;
        }

        .app-search-text .subtitle {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }

        .arrow {
          font-size: 18px;
          color: #94a3b8;
        }

        .app-search-empty {
          padding: 28px;
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
        }

        .app-search-empty i {
          font-size: 26px;
          margin-bottom: 8px;
          display: block;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default GlobleSearchBox;
