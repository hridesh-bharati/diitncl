import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check for iOS
    const iosCheck = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iosCheck);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsPromptVisible(true);
    };

    const handleAppInstalled = () => {
      setIsPromptVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setIsPromptVisible(false);
      setDeferredPrompt(null);
    }
  };

  if (!isPromptVisible && !isIOS) return null;

  return (
    <div className="fixed-bottom m-3 shadow-lg p-3 bg-white rounded-4 border-0 d-flex flex-column animate__animated animate__slideInUp" style={{ zIndex: 9999 }}>
      {isIOS && !window.navigator.standalone ? (
        <div className="text-center p-2">
          <p className="mb-2 fw-bold">Install Drishtee App</p>
          <small>Tap the <i className="fa-regular fa-square-plus mx-1"></i> Share icon and select <strong>'Add to Home Screen'</strong> for full screen.</small>
        </div>
      ) : (
        isPromptVisible && (
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src="/images/icon/icon-192.png" height="40" className="rounded me-2" alt="logo" />
              <span className="fw-bold text-dark">Drishtee App</span>
            </div>
            <div className="d-flex gap-2">
              <button onClick={() => setIsPromptVisible(false)} className="btn btn-light btn-sm rounded-circle">&times;</button>
              <button onClick={handleInstallClick} className="btn btn-primary btn-sm px-3 rounded-pill">Install</button>
            </div>
          </div>
        )
      )}
    </div>
  );
}