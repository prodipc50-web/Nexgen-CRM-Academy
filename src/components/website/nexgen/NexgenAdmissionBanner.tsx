import React from 'react';
import { Calendar, BookOpen } from 'lucide-react';
import { WebsiteSubPage, AdmissionBannerCmsConfig } from '../../../types';

interface NexgenAdmissionBannerProps {
  onNavigateSubPage: (page: WebsiteSubPage) => void;
  config?: AdmissionBannerCmsConfig;
}

export const NexgenAdmissionBanner: React.FC<NexgenAdmissionBannerProps> = ({
  onNavigateSubPage,
  config
}) => {
  const title = config?.title || 'Admission Is Going On';
  const subtitle =
    config?.subtitle ||
    'Enroll in any online or offline lab course now, and take one step ahead towards a competent career with NexGen Computer Academy.';
  const ctaText = config?.ctaText || 'Browse Course';

  return (
    <section className="py-14 sm:py-16 bg-[#0f3b75] text-white text-center">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 space-y-4">
        {config?.discountBadge && (
          <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
            {config.discountBadge}
          </span>
        )}

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
          {title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-200 font-normal max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={() => onNavigateSubPage('seminars')}
            className="px-6 py-2.5 rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-black shadow-sm transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Join Free Seminar</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSubPage('courses')}
            className="px-6 py-2.5 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-black shadow-sm transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{ctaText}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
