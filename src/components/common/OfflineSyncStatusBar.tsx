import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Cloud, RefreshCw, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';

export const OfflineSyncStatusBar: React.FC = () => {
  const { cloudSyncStatus, lastCloudSyncTime, syncToCloudNow } = useAcademy();
  const [isOnline, setIsOnline] = useState<boolean>(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [showReconnectedBanner, setShowReconnectedBanner] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsDismissed(false);
      // Auto trigger cloud sync when network returns
      syncToCloudNow(true).catch(console.warn);

      if (wasOffline) {
        setShowReconnectedBanner(true);
        const timer = setTimeout(() => {
          setShowReconnectedBanner(false);
          setWasOffline(false);
        }, 6000);
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setIsDismissed(false);
      setShowReconnectedBanner(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline, syncToCloudNow]);

  const handleManualRetry = async () => {
    setIsRetrying(true);
    try {
      await syncToCloudNow(true);
    } finally {
      setIsRetrying(false);
    }
  };

  // Condition 1: Just reconnected successfully banner
  if (showReconnectedBanner) {
    return (
      <aside 
        aria-label="Reconnected notification"
        className="bg-emerald-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between z-40 relative animate-in slide-in-from-top duration-200 print:hidden"
      >
        <div className="flex items-center space-x-2.5 max-w-7xl mx-auto w-full">
          <div className="p-1 bg-emerald-700/80 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-100 shrink-0" />
          </div>
          <div className="flex-1 text-xs font-semibold">
            <span className="font-bold">ইন্টারনেট সংযোগ ফিরে এসেছে (Online)!</span>{' '}
            <span className="text-emerald-100 hidden sm:inline">
              লোকাল ক্যাশে সংরক্ষিত সকল ডাটা ক্লাউড ফায়ারস্টোরে স্বয়ংক্রিয়ভাবে সিঙ্ক হয়েছে।
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowReconnectedBanner(false)}
            className="p-1 hover:bg-emerald-700 rounded-lg text-emerald-100 hover:text-white transition-colors cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  // Condition 2: Offline banner
  if (!isOnline && !isDismissed) {
    return (
      <aside 
        aria-label="Offline status bar"
        className="bg-amber-600 text-white px-4 py-2.5 shadow-md z-40 relative animate-in slide-in-from-top duration-200 print:hidden border-b border-amber-700"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-amber-700/80 rounded-lg shrink-0">
              <WifiOff className="w-4 h-4 text-amber-100 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center space-x-2">
                <span>অফলাইন মোড সক্রিয় (Offline Mode Active)</span>
                <span className="px-1.5 py-0.5 bg-amber-800/80 text-[10px] font-mono rounded">
                  Local Cache
                </span>
              </div>
              <p className="text-[11px] text-amber-100 font-medium">
                ইন্টারনেট বিচ্ছিন্ন রয়েছে। সব এন্ট্রি ব্রাউজারের সিকিউর মেমরিতে সংরক্ষিত হচ্ছে, নেট পেলেই স্বয়ংক্রিয়ভাবে ক্লাউডে আপলোড হবে।
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleManualRetry}
              disabled={isRetrying}
              className="px-3 py-1 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'চেক হচ্ছে...' : 'পুনরায় চেক করুন'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 hover:bg-amber-700 text-amber-200 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="মিনিমাইজ করুন (Minimize)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Condition 3: Minimized offline pill badge in bottom-right if dismissed
  if (!isOnline && isDismissed) {
    return (
      <button
        type="button"
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-4 right-4 z-40 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-full shadow-lg flex items-center space-x-2 text-xs font-bold border border-amber-500 cursor-pointer animate-in fade-in duration-200 print:hidden"
        title="Offline Mode Active - Click to view details"
      >
        <WifiOff className="w-3.5 h-3.5 animate-pulse" />
        <span>অফলাইন মোড (Local Active)</span>
      </button>
    );
  }

  return null;
};
