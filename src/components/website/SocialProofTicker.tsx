import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, UserCheck, Download, X } from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';
import { SocialProofTickerItem } from '../../types';

export const SocialProofTicker: React.FC = () => {
  const { websiteCmsConfig, courses } = useAcademy();
  const config = websiteCmsConfig?.socialProofTicker;

  // Defaults if not configured
  const defaultActivities: SocialProofTickerItem[] = [
    {
      id: 'sp-1',
      studentName: 'রাকিব আহমেদ',
      location: 'মিরপুর, ঢাকা',
      actionType: 'enrolled',
      courseName: 'Graphic Design & Freelancing',
      timeAgo: '২ মিনিট আগে'
    },
    {
      id: 'sp-2',
      studentName: 'তানজিলা হক',
      location: 'উত্তরা, ঢাকা',
      actionType: 'downloaded_syllabus',
      courseName: 'MERN Stack Web Development',
      timeAgo: '৪ মিনিট আগে'
    },
    {
      id: 'sp-3',
      studentName: 'মাহমুদুল হাসান',
      location: 'ধানমন্ডি, ঢাকা',
      actionType: 'booked_tour',
      courseName: 'Python, Django & AI Automation',
      timeAgo: '৭ মিনিট আগে'
    },
    {
      id: 'sp-4',
      studentName: 'সাদিয়া আফরিন',
      location: 'চট্টগ্রাম',
      actionType: 'enrolled',
      courseName: 'UI/UX Design & Product Strategy',
      timeAgo: '১১ মিনিট আগে'
    },
    {
      id: 'sp-5',
      studentName: 'আসিফ ইকবাল',
      location: 'সিলেট',
      actionType: 'inquired',
      courseName: 'Digital Marketing & AI Growth Hacking',
      timeAgo: '১৫ মিনিট আগে'
    }
  ];

  const activities = (config?.customActivities && config.customActivities.length > 0)
    ? config.customActivities
    : defaultActivities;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (config?.enabled === false || isDismissed || activities.length === 0) {
      setIsVisible(false);
      return;
    }

    // Initial delay before first popup (5 seconds after page load)
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4500);

    // Loop interval
    const intervalSec = (config?.intervalSeconds || 14) * 1000;
    const displayDuration = (config?.displayDurationSeconds || 5) * 1000;

    const intervalId = setInterval(() => {
      setIsVisible(true);

      // Auto-hide after duration
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setCurrentIndex((prev) => (prev + 1) % activities.length);
      }, displayDuration);

      return () => clearTimeout(hideTimer);
    }, intervalSec + displayDuration);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [config?.enabled, isDismissed, activities.length, config?.intervalSeconds, config?.displayDurationSeconds]);

  if (config?.enabled === false || isDismissed || activities.length === 0 || !isVisible) {
    return null;
  }

  const current = activities[currentIndex] || activities[0];

  const getActionText = (type: string) => {
    switch (type) {
      case 'enrolled':
        return 'এইমাত্র কোর্সে ভর্তি আবেদন করেছেন';
      case 'downloaded_syllabus':
        return 'সিলেবাস ও কারিকুলাম ডাউনলোড করেছেন';
      case 'booked_tour':
        return 'ক্যাম্পাস ল্যাব ভিজিট বুক করেছেন';
      case 'inquired':
      default:
        return 'কোর্সের বিস্তারিত তথ্য জানতে চেয়েছেন';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'enrolled':
        return 'bg-emerald-500 text-white';
      case 'downloaded_syllabus':
        return 'bg-indigo-500 text-white';
      case 'booked_tour':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div
      className={`fixed bottom-5 z-40 max-w-xs sm:max-w-sm transition-all duration-500 ease-out transform ${
        config?.position === 'bottom_right' ? 'right-4 sm:right-6' : 'left-4 sm:left-6'
      } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 pointer-events-none'}`}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3.5 shadow-xl flex items-start space-x-3 text-left">
        {/* Pulsing Green Live Icon */}
        <div className="relative shrink-0 mt-0.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shadow-xs ${getBadgeColor(current.actionType)}`}>
            {current.actionType === 'enrolled' && <CheckCircle2 className="w-5 h-5" />}
            {current.actionType === 'downloaded_syllabus' && <Download className="w-4 h-4" />}
            {current.actionType === 'booked_tour' && <UserCheck className="w-5 h-5" />}
            {current.actionType === 'inquired' && <Sparkles className="w-4 h-4" />}
          </div>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-baseline justify-between gap-1">
            <h5 className="font-bold text-slate-900 text-xs truncate">
              {current.studentName}{' '}
              <span className="text-[10px] font-normal text-slate-500">({current.location})</span>
            </h5>
            <span className="text-[9px] text-slate-400 font-mono shrink-0">{current.timeAgo}</span>
          </div>

          <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
            {getActionText(current.actionType)}
          </p>

          <p className="text-[11px] text-slate-700 font-medium truncate mt-0.5">
            📚 {current.courseName}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
