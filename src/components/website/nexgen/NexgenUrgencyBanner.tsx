import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, ArrowRight, X } from 'lucide-react';

interface NexgenUrgencyBannerProps {
  onOpenAdmission: () => void;
  title?: string;
  badgeText?: string;
  buttonText?: string;
}

export const NexgenUrgencyBanner: React.FC<NexgenUrgencyBannerProps> = ({
  onOpenAdmission,
  title = 'নতুন ব্যাচে ভর্তি চলছে! অফলাইন ল্যাব ও লাইভ অনলাইন ক্লাসে সীমিত সিট বাকি',
  badgeText = 'Special Scholarship',
  buttonText = 'আসন নিশ্চিত করুন'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 35,
    seconds: 40
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return { days: 3, hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs border-b border-indigo-900/40 py-2 px-3 sm:px-4 shadow-xs overflow-x-hidden min-h-[38px] flex items-center">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left Side: Badge + Urgency Message */}
        <div className="flex items-center space-x-2 min-w-0 text-center sm:text-left justify-center sm:justify-start w-full sm:w-auto">
          <span className="hidden md:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-black uppercase tracking-wider shrink-0">
            <Sparkles className="w-3 h-3 text-amber-200" />
            <span>{badgeText}</span>
          </span>
          <span className="font-bold text-[11px] sm:text-xs text-slate-100 leading-snug break-words">
            {title}
          </span>
        </div>

        {/* Right Side: Countdown Timer + CTA */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 justify-center">
          {/* Countdown Boxes */}
          <div className="flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono font-bold text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400 mr-0.5 shrink-0" />
            <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-white/10">
              {String(timeLeft.days).padStart(2, '0')}d
            </span>
            <span>:</span>
            <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-white/10">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-white/10">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-white/10 text-rose-400">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onOpenAdmission}
            className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] sm:text-[11px] flex items-center space-x-1 transition-all active:scale-95 cursor-pointer shadow-xs shrink-0"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Dismiss */}
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer shrink-0"
            title="Hide bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
