import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, X, Clock } from 'lucide-react';
import { TopOfferRibbonConfig } from '../../types';

interface TopOfferRibbonProps {
  config?: TopOfferRibbonConfig;
  onOpenAdmission: () => void;
  onScrollToCourses: () => void;
  whatsappNumber?: string;
}

export const TopOfferRibbon: React.FC<TopOfferRibbonProps> = ({
  config,
  onOpenAdmission,
  onScrollToCourses,
  whatsappNumber
}) => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('nca_top_ribbon_dismissed') === 'true';
  });
  const [copied, setCopied] = useState(false);

  if (!config || !config.enabled || isDismissed) {
    return null;
  }

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAction = () => {
    if (config.actionType === 'open_admission') {
      onOpenAdmission();
    } else if (config.actionType === 'scroll_courses') {
      onScrollToCourses();
    } else if (config.actionType === 'copy_coupon' && config.couponCode) {
      handleCopyCoupon(config.couponCode);
    } else if (config.actionType === 'whatsapp' && whatsappNumber) {
      const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
      const num = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
      const msg = encodeURIComponent(`হ্যালো! আমি শীর্ষ অফারের বিষয়ে জানতে চাচ্ছি। কুপন কোড: ${config.couponCode || 'N/A'}`);
      window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
    } else {
      onOpenAdmission();
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('nca_top_ribbon_dismissed', 'true');
  };

  const bgClasses = config.bgColor || 'bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700';

  return (
    <div
      id="top-sticky-offer-ribbon"
      className={`relative z-40 text-white text-xs py-2 px-3 sm:px-6 shadow-md transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${bgClasses}`}
    >
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left / Center Message & Badge */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-center sm:text-left justify-center sm:justify-start flex-1 min-w-0 w-full sm:w-auto">
          {/* Badge */}
          {config.badgeText && (
            <span className="inline-flex items-center space-x-1 bg-white/20 hover:bg-white/30 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase border border-white/30 shadow-2xs shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{config.badgeText}</span>
            </span>
          )}

          {/* Main Message */}
          <span className="font-semibold text-white/95 text-xs tracking-tight">
            {config.message}
          </span>

          {/* Coupon Code Pill */}
          {config.couponCode && (
            <button
              type="button"
              onClick={() => handleCopyCoupon(config.couponCode!)}
              className="inline-flex items-center space-x-1.5 bg-black/30 hover:bg-black/40 border border-white/40 px-2.5 py-0.5 rounded-md font-mono text-[11px] font-black cursor-pointer transition-all active:scale-95 shadow-inner"
              title="ক্লিক করে কোড কপি করুন"
            >
              <span className="text-amber-300">{config.couponCode}</span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-300" />
              ) : (
                <Copy className="w-3 h-3 text-white/70" />
              )}
              <span className="text-[10px] text-white/80 font-sans hidden sm:inline">
                {copied ? 'কপি হয়েছে!' : 'কপি করুন'}
              </span>
            </button>
          )}

          {/* Expiry Countdown / Date Tag */}
          {config.expiresAt && (
            <span className="hidden md:inline-flex items-center space-x-1 text-[11px] text-amber-200 font-medium bg-black/20 px-2 py-0.5 rounded-full border border-amber-300/30">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>{config.expiresAt}</span>
            </span>
          )}
        </div>

        {/* Right CTA Button & Dismiss */}
        <div className="flex items-center space-x-2 shrink-0 mx-auto sm:mx-0">
          {config.buttonText && (
            <button
              type="button"
              onClick={handleAction}
              className="inline-flex items-center space-x-1.5 bg-white text-slate-900 hover:bg-amber-100 font-black text-xs px-3 py-1 rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>{config.buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-700" />
            </button>
          )}

          {config.dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Hide Announcement"
              aria-label="Hide Announcement"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
