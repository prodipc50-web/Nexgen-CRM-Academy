import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Database, Sparkles, X, Clock, RefreshCw } from 'lucide-react';
import { CRM_DATA_SAVED_EVENT, CrmSaveEventDetail } from '../../utils/crmFeedbackHelper';

/**
 * Floating Toast notification that pops up whenever CRM data is saved to the database.
 */
export const CrmDataSavedToast: React.FC = () => {
  const [activeToast, setActiveToast] = useState<CrmSaveEventDetail | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleCrmSaved = (event: Event) => {
      const customEvent = event as CustomEvent<CrmSaveEventDetail>;
      if (!customEvent.detail) return;

      if (timerRef.current) clearTimeout(timerRef.current);
      setIsClosing(false);
      setActiveToast(customEvent.detail);

      const duration = customEvent.detail.durationMs || 3200;
      timerRef.current = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          setActiveToast(null);
          setIsClosing(false);
        }, 300);
      }, duration);
    };

    window.addEventListener(CRM_DATA_SAVED_EVENT, handleCrmSaved);
    return () => {
      window.removeEventListener(CRM_DATA_SAVED_EVENT, handleCrmSaved);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!activeToast) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-[100] max-w-sm sm:max-w-md w-full px-3 pointer-events-auto transition-all duration-300 ease-out ${
        isClosing
          ? 'opacity-0 translate-y-3 scale-95'
          : 'opacity-100 translate-y-0 scale-100 animate-in slide-in-from-bottom-4 duration-300'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="bg-slate-900/95 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-emerald-500/40 backdrop-blur-md flex items-start space-x-3 relative overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Pulse Beacon Icon Container */}
        <div className="relative shrink-0 mt-0.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          {/* Animated ping ring */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-slate-900"></span>
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Database className="w-2.5 h-2.5 mr-1" />
              Data Saved
            </span>
            <span className="text-[10px] text-slate-400 font-mono flex items-center">
              <Clock className="w-2.5 h-2.5 mr-0.5" />
              {activeToast.displayTime}
            </span>
          </div>

          <h4 className="text-sm font-bold text-white mt-1 leading-snug tracking-tight">
            {activeToast.title}
          </h4>

          {activeToast.description && (
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed truncate">
              {activeToast.description}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setIsClosing(true);
            setTimeout(() => {
              setActiveToast(null);
              setIsClosing(false);
            }, 200);
          }}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          title="Dismiss notification"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Bottom progress bar timer */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-[shrink_3.2s_linear_forwards]"
            style={{
              animationDuration: `${activeToast.durationMs || 3200}ms`
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface CrmLiveSavePulseBadgeProps {
  lastSyncTime?: string;
  isSyncing?: boolean;
  className?: string;
  onManualSync?: () => void;
}

/**
 * Header status badge showing live database commitment status & pulse animation
 */
export const CrmLiveSavePulseBadge: React.FC<CrmLiveSavePulseBadgeProps> = ({
  lastSyncTime,
  isSyncing = false,
  className = '',
  onManualSync
}) => {
  const [recentlySaved, setRecentlySaved] = useState(false);
  const [lastActionTitle, setLastActionTitle] = useState<string>('সব ডেটাবেস পরিবর্তন সংরক্ষিত');
  const [savedTime, setSavedTime] = useState<string>(
    lastSyncTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const handleCrmSaved = (event: Event) => {
      const customEvent = event as CustomEvent<CrmSaveEventDetail>;
      if (!customEvent.detail) return;

      setRecentlySaved(true);
      setLastActionTitle(customEvent.detail.title);
      setSavedTime(customEvent.detail.displayTime);

      const timeout = setTimeout(() => {
        setRecentlySaved(false);
      }, 4000);

      return () => clearTimeout(timeout);
    };

    window.addEventListener(CRM_DATA_SAVED_EVENT, handleCrmSaved);
    return () => window.removeEventListener(CRM_DATA_SAVED_EVENT, handleCrmSaved);
  }, []);

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-300 shadow-2xs ${
        isSyncing
          ? 'bg-amber-50 text-amber-900 border-amber-300'
          : recentlySaved
          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-2 ring-emerald-400/30'
          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
      } ${className}`}
      title={isSyncing ? 'ডেটাবেসে সংরক্ষণ প্রক্রিয়া চলছে...' : `সর্বশেষ সংরক্ষিত: ${savedTime} (${lastActionTitle})`}
    >
      {/* Live Beacon / Indicator */}
      <div className="relative flex items-center justify-center">
        {isSyncing ? (
          <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
        ) : recentlySaved ? (
          <>
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </>
        ) : (
          <span className="inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-xs"></span>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {isSyncing ? (
          <span className="text-amber-800 font-bold">সিঙ্ক হচ্ছে...</span>
        ) : recentlySaved ? (
          <div className="flex items-center space-x-1">
            <span className="text-emerald-700 font-black">ডেটা সংরক্ষিত ✓</span>
            <span className="hidden md:inline text-[10px] text-emerald-600 font-mono">({savedTime})</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <span className="text-slate-700 font-bold hidden sm:inline">ডেটাবেস:</span>
            <span className="text-slate-600 font-medium">সুরক্ষিত ও সংরক্ষিত</span>
            {savedTime && (
              <span className="hidden lg:inline text-[10px] text-slate-600 font-mono">({savedTime})</span>
            )}
          </div>
        )}
      </div>

      {onManualSync && (
        <button
          type="button"
          onClick={onManualSync}
          disabled={isSyncing}
          className="ml-1 text-slate-600 hover:text-blue-600 p-0.5 rounded transition-colors"
          title="রি-সিঙ্ক করুন"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
};
