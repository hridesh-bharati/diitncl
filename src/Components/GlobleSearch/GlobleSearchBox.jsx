import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GlobleSearchBox = ({ routes = [] }) => {
  /* ================= TYPING PLACEHOLDER ================= */
  const placeholders = [
    "Search courses...",
    "Search students...",
    "Search contacts...",
    "Search DIIT services..."
  ];

  const [placeholder, setPlaceholder] = useState("");
  const [pIndex, setPIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ================= SEARCH STATE ================= */
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  /* ================= TYPING EFFECT ================= */
  useEffect(() => {
    if (query) return; // user typing → stop placeholder animation

    const current = placeholders[pIndex];
    let timeout;

    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setPlaceholder(current.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 80);
    } 
    else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setPlaceholder(current.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 50);
    } 
    else if (!isDeleting && charIndex === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 900);
    } 
    else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPIndex((prev) => (prev + 1) % placeholders.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, pIndex, query]);

  /* ================= ROUTE FILTER ================= */
  const filteredRoutes = routes
    .filter((route) => route.searchable !== false)
    .filter((route) =>
      route.label?.toLowerCase().includes(query.toLowerCase())
    );

  const handleSelect = (path) => {
    setQuery("");
    navigate(path);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredRoutes.length > 0) {
      handleSelect(filteredRoutes[0].path);
    }
  };

  return (
    <div className="position-relative m-2" style={{ zIndex: 1050 }}>
      <div className="position-relative">
        <i
          className="fas fa-search position-absolute top-50 start-0 translate-middle-y text-muted ms-2"
          style={{ fontSize: "0.8rem" }}
        />

        <input
          type="search"
          className="form-control form-control-sm ps-4 pe-2 py-1 me-3 rounded-pill"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value) setCharIndex(0); // restart typing
          }}
          onKeyDown={handleKeyDown}
          style={{
            fontSize: "0.78rem",
            height: "30px",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid #dee2e6",
            transition: "all 0.3s"
          }}
        />
      </div>

      {/* ================= SUGGESTIONS ================= */}
      {query && (
        <div
          className="position-absolute top-100 mt-1 start-0 w-100 border rounded-3 shadow"
          style={{
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(12px)",
            maxHeight: "250px",
            overflowY: "auto",
            animation: "fadeIn 0.2s ease-in-out"
          }}
        >
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
              const after = route.label.slice(matchIndex + query.length);

              return (
                <button
                  key={idx}
                  className="dropdown-item text-start py-2 px-3"
                  onClick={() => handleSelect(route.path)}
                >
                  {before}
                  <strong className="text-primary">{match}</strong>
                  {after}
                </button>
              );
            })
          ) : (
            <div className="dropdown-item text-muted small py-2 text-center">
              No match found
            </div>
          )}
        </div>
      )}

      {/* ================= CSS ================= */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default GlobleSearchBox;
