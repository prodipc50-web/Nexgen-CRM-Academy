import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check, Share2, MoreVertical, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed app)
    const isInStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isInStandalone) {
      setIsStandalone(true);
      return;
    }

    // Check if user is on iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    const handleOpenModal = () => {
      setIsDismissed(false);
      setShowManualGuide(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('open-pwa-install-modal', handleOpenModal);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('open-pwa-install-modal', handleOpenModal);
    };

  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsStandalone(true);
      }
    } else {
      // If the browser hasn't fired beforeinstallprompt or is iOS/Chrome manual
      setShowManualGuide(true);
    }
  };

  // If already installed as app or dismissed by user, don't show floating bar
  if (isStandalone || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom App Installation Bar */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in slide-in-from-bottom-5 duration-300">
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-indigo-500/40 flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-0.5 shadow-md flex items-center justify-center shrink-0 border border-indigo-400/40">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">Install Nexgen Mobile App</h4>
              <p className="text-[11px] text-indigo-200 truncate">Tap to use full-screen on phone</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Step-by-Step Installation Modal (For Chrome / Safari / Edge) */}
      {showManualGuide && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Install Nexgen Mobile App</h3>
                  <p className="text-[11px] text-slate-500">Quick 2-step setup</p>
                </div>
              </div>
              <button
                onClick={() => setShowManualGuide(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              {isIOS ? (
                <>
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-start space-x-3 border border-slate-200/70">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-xl shrink-0 font-bold text-xs">1</div>
                    <div>
                      <p className="font-bold text-slate-900">Safari Share Button</p>
                      <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                        নিচের <Share2 className="w-3.5 h-3.5 text-blue-600 inline" /> <strong>Share</strong> আইকনে চাপ দিন।
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-start space-x-3 border border-slate-200/70">
                    <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl shrink-0 font-bold text-xs">2</div>
                    <div>
                      <p className="font-bold text-slate-900">Add to Home Screen</p>
                      <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                        মেনু থেকে <PlusSquare className="w-3.5 h-3.5 text-indigo-600 inline" /> <strong>"Add to Home Screen"</strong> চাপ দিন।
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-start space-x-3 border border-slate-200/70">
                    <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl shrink-0 font-bold text-xs">1</div>
                    <div>
                      <p className="font-bold text-slate-900">Chrome / Browser Menu</p>
                      <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                        মোবাইলের উপরের ডানপাশে <MoreVertical className="w-3.5 h-3.5 text-slate-700 inline" /> <strong>৩ ডট (⋮)</strong> মেনুতে চাপ দিন।
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-start space-x-3 border border-slate-200/70">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 font-bold text-xs">2</div>
                    <div>
                      <p className="font-bold text-slate-900">Install app / Add to Home screen</p>
                      <p className="text-slate-500 mt-0.5">
                        মেনু থেকে <strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> এ চাপ দিন।
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowManualGuide(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors text-center"
              >
                বুঝেছি (Got it)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
