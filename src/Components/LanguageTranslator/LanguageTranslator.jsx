import { useEffect, useState } from "react";
import './LanguageTranslator.css'
const getDeviceLanguage = () => {
  const lang = navigator.language || navigator.userLanguage || "en";
  return lang.split("-")[0];
};

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

  useEffect(() => {
    if (window.__gtLoaded) return;
    window.__gtLoaded = true;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );
      applySavedLanguage();
    };

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const applySavedLanguage = () => {
    const saved = localStorage.getItem("appLang") || "device";
    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        let finalLang = saved === "device" ? getDeviceLanguage() : saved;
        select.value = finalLang;
        select.dispatchEvent(new Event("change"));
        clearInterval(interval);
      }
    }, 400);
  };

  const changeLanguage = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (!select) return;

    let finalLang = lang === "device" ? getDeviceLanguage() : lang;
    select.value = finalLang;
    select.dispatchEvent(new Event("change"));

    localStorage.setItem("appLang", lang);
    setSelectedLang(lang);
    setOpen(false);
  };

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* Trigger - Protected from translation */}
      <button
        className="notranslate btn border-0 text-muted d-flex align-items-center gap-2"
        onClick={() => setOpen(true)}
        translate="no"
      >
        <i className="bi bi-translate fs-2 text-primary"></i>
        {/* App Language */}
      </button>

      {/* Overlay */}
      <div className={`gt-overlay ${open ? "active" : ""}`} onClick={() => setOpen(false)}>
        <div className="gt-sheet" onClick={(e) => e.stopPropagation()}>
          
          <div className="gt-drag-handle"></div>

          {/* Header - Protected */}
          <div className="gt-header notranslate mt-5 pt-5 ps-4" translate="no">
            <button className="gt-close-btn" onClick={() => setOpen(false)}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <h6 className="m-0 fw-bold">App Language</h6>
          </div>

          {/* Language List */}
          <div className="gt-body notranslate" translate="no">
            {LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className={`gt-row ${selectedLang === lang.code ? "selected-bg" : ""}`}
                onClick={() => changeLanguage(lang.code)}
              >
                <div className="gt-left">
                  <div className={`gt-radio ${selectedLang === lang.code ? "active" : ""}`}>
                    {selectedLang === lang.code && <div className="gt-radio-inner" />}
                  </div>
                  <div>
                    <div className="native">{lang.native}</div>
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