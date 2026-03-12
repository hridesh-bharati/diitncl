import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useTypingEffect from "../../hooks/useTypingEffect";

const GlobleSearchBox = ({ routes = [], onSelect }) => {
  const placeholders = useMemo(() => [
    "Search courses...",
    "Search students...",
    "Search certificates...",
    "Search DIIT services..."
  ], []);

  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const dynamicPlaceholder = useTypingEffect(placeholders, 70, 40, 1000);

  /* ================= OPTIMIZED FILTERING (useMemo) ================= */
  const filteredRoutes = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return routes
      .filter((r) => r.searchable !== false && r.label?.toLowerCase().includes(lowerQuery))
      .slice(0, 8); // Limit results for better performance
  }, [query, routes]);

  /* ================= HANDLERS (useCallback) ================= */
  const handleSelect = useCallback((path) => {
    setQuery("");
    navigate(path);
    if (onSelect) onSelect();
  }, [navigate, onSelect]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredRoutes.length > 0) {
      handleSelect(filteredRoutes[0].path);
    }
  };

  return (
    <div className="app-search-wrapper ms-1">
      <div className="app-search-input">
        <i className="bi bi-search"></i>
        <input
          type="search"
          value={query}
          aria-label="Search"
          placeholder={query ? "" : dynamicPlaceholder}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {query && (
        <div className="app-search-list shadow-lg">
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route, idx) => {
              const label = route.label || "";
              const matchIndex = label.toLowerCase().indexOf(query.toLowerCase());
              
              return (
                <div
                  key={route.path || idx}
                  className="app-search-item"
                  onClick={() => handleSelect(route.path)}
                >
                  <div className="app-search-icon">
                    <i className={route.icon || "bi bi-search"}></i>
                  </div>

                  <div className="app-search-text">
                    <div className="title">
                      {label.slice(0, matchIndex)}
                      <span>{label.slice(matchIndex, matchIndex + query.length)}</span>
                      {label.slice(matchIndex + query.length)}
                    </div>
                    {route.desc && <div className="subtitle">{route.desc}</div>}
                  </div>
                  <i className="bi bi-chevron-right arrow ms-auto"></i>
                </div>
              );
            })
          ) : (
            <div className="app-search-empty">
              <i className="bi bi-emoji-frown"></i>
              <span>No results for "{query}"</span>
            </div>
          )}
        </div>
      )}

      {/* Inline styles moved inside useMemo or external CSS is better, 
          but keeping it here for your convenience with a small optimization */}
      <style>{`
        .app-search-wrapper { position: relative; width: 100%; z-index: 3000; }
        .app-search-input input {
          width: 100%; height: 34px; padding: 0 8px 0 32px;
          border-radius: 30px; border: 1px solid #e2e8f0;
          font-size: 12px; background: #f8fafc; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .app-search-input i {
          position: absolute; left: 10px; top: 50%;
          transform: translateY(-50%); color: #94a3b8; font-size: 12px;
        }
        .app-search-input input:focus {
          border-color: #0a2885; background: #fff;
          box-shadow: 0 0 0 3px rgba(10, 40, 133, 0.08);
        }
        .app-search-list {
          position: absolute; top: 100%; left: 0; right: 0;
          margin-top: 6px; background: white; border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-height: 280px;
          overflow-y: auto; border: 1px solid #f1f5f9;
        }
        .app-search-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; cursor: pointer; transition: background 0.2s;
        }
        .app-search-item:hover { background: #f1f5f9; }
        .app-search-icon {
          width: 28px; height: 28px; border-radius: 8px;
          background: #0a2885; display: flex; align-items: center;
          justify-content: center; color: white; font-size: 12px; flex-shrink: 0;
        }
        .app-search-text .title { font-size: 12px; font-weight: 600; color: #1e293b; }
        .app-search-text .title span { color: #0a2885; font-weight: 700; text-decoration: underline; }
        .app-search-text .subtitle { font-size: 10px; color: #64748b; }
        .app-search-empty { padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
        @media (max-width: 768px) {
          .app-search-input input { height: 32px; font-size: 11px; }
          .app-search-icon { width: 24px; height: 24px; }
        }
      `}</style>
    </div>
  );
};

export default React.memo(GlobleSearchBox);