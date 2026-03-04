import { useEffect, useState, useCallback } from "react";
import './LanguageTranslator.css';

const LANGUAGES = [
  { code: "device", native: "Device Language", english: "Use device language (Recommended)" },
  { code: "en", native: "English", english: "English" },
  { code: "hi", native: "हिन्दी", english: "Hindi" },
  { code: "bho", native: "भोजपुरी", english: "Bhojpuri" },
  { code: "bn", native: "বাংলা", english: "Bengali" },
  { code: "te", native: "తెలుగు", english: "Telugu" },
  { code: "mr", native: "मराठी", english: "Marathi" },
  { code: "ta", native: "தமிழ்", english: "Tamil" },
  { code: "ur", native: "اردو", english: "Urdu" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada" },
  { code: "ml", native: "മലയാളം", english: "Malayalam" }
];

export default function GoogleTranslateButton() {
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem("appLang") || "device");

  const getTargetCode = (code) => {
    if (code !== "device") return code;
    return (navigator.language || navigator.userLanguage || "en").split("-")[0];
  };

  const updateGoogleCombo = useCallback((langCode) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = getTargetCode(langCode);
      select.dispatchEvent(new Event("change"));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (window.__gtLoaded) return;
    window.__gtLoaded = true;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );
      
      const interval = setInterval(() => {
        if (updateGoogleCombo(selectedLang)) clearInterval(interval);
      }, 400);
    };

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, [selectedLang, updateGoogleCombo]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const changeLanguage = (lang) => {
    if (updateGoogleCombo(lang)) {
      localStorage.setItem("appLang", lang);
      setSelectedLang(lang);
      setOpen(false);
    }
  };

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />

      <button className="notranslate btn border-0 d-flex align-items-center" onClick={() => setOpen(true)}>
        <i className="bi bi-translate fs-2 text-primary"></i>
      </button>

      <div className={`gt-overlay ${open ? "active" : ""}`} onClick={() => setOpen(false)}>
        <div className="gt-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="gt-drag-handle" />
          
          <div className="gt-header notranslate mt-5 ps-4" translate="no">
            <button className="gt-close-btn" onClick={() => setOpen(false)}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <h6 className="m-0 fw-bold">App Language</h6>
          </div>

          <div className="gt-body notranslate" translate="no">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className={`gt-row ${selectedLang === lang.code ? "selected-bg" : ""}`}
                onClick={() => changeLanguage(lang.code)}
              >
                <div className="gt-left">
                  <div className={`gt-radio text-start ${selectedLang === lang.code ? "active" : ""}`}>
                    {selectedLang === lang.code && <div className="gt-radio-inner" />}
                  </div>
                  <div>
                    <div className="native text-start">{lang.native}</div>
                    <div className="english">{lang.english}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}