import React from 'react';
import { Calendar, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { WebsiteSubPage, AdmissionBannerCmsConfig } from '../../../types';

interface NexgenAdmissionBannerProps {
  onNavigateSubPage: (page: WebsiteSubPage) => void;
  config?: AdmissionBannerCmsConfig;
  onOpenAdmission?: () => void;
}

export const NexgenAdmissionBanner: React.FC<NexgenAdmissionBannerProps> = ({
  onNavigateSubPage,
  config,
  onOpenAdmission
}) => {
  const title = config?.title || 'Admission Is Going On';
  const subtitle =
    config?.subtitle ||
    'Enroll in any online or offline lab course now, and take one step ahead towards a competent career with NexGen Computer Academy.';
  const ctaText = config?.ctaText || 'Apply For Admission';

  const handlePrimaryClick = () => {
    if (onOpenAdmission) {
      onOpenAdmission();
    } else {
      onNavigateSubPage('courses');
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#0f3b75] to-[#0a274e] text-white text-center relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 space-y-4 sm:space-y-5 relative z-10">
        {config?.discountBadge && (
          <div className="inline-block">
            <span className="inline-flex items-center space-x-1 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span>{config.discountBadge}</span>
            </span>
          </div>
        )}

        {/* Headline - fully mobile responsive with break-words to prevent clipping */}
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold sm:font-black tracking-tight text-white leading-tight sm:leading-snug break-words px-2 max-w-3xl mx-auto">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-200/95 font-normal max-w-xl mx-auto leading-relaxed px-2 break-words">
          {subtitle}
        </p>

        {/* CRO Optimized Dual Action Options - Clear Primary vs Secondary Hierarchy */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 pt-2 max-w-md sm:max-w-none mx-auto">
          {/* Primary High-Converting CTA: Direct Admission */}
          <button
            type="button"
            onClick={handlePrimaryClick}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[#e11d48] to-[#dc2626] hover:from-[#be123c] hover:to-[#b91c1c] text-white text-xs sm:text-sm font-black shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            title="অনলাইন ভর্তি ফর্ম"
          >
            <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-80" />
          </button>

          {/* Secondary CTA: Free Seminar Registration */}
          <button
            type="button"
            onClick={() => onNavigateSubPage('seminars')}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            title="ফ্রি সেমিনার বুক করুন"
          >
            <Calendar className="w-3.5 h-3.5 shrink-0 text-cyan-300" />
            <span>Join Free Seminar</span>
          </button>
        </div>
      </div>
    </section>
  );
};
