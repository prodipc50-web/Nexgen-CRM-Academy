import React from 'react';
import { BookOpen, Laptop } from 'lucide-react';
import { WebsiteSubPage, AboutHeroCmsConfig } from '../../../types';

interface NexgenAboutHeroProps {
  onNavigateSubPage: (page: WebsiteSubPage) => void;
  config?: AboutHeroCmsConfig;
}

export const NexgenAboutHero: React.FC<NexgenAboutHeroProps> = ({ onNavigateSubPage, config }) => {
  const defaultStats = [
    { id: 'st-1', value: '20000 +', label: 'Successful Students', color: 'purple' as const },
    { id: 'st-2', value: '9000 +', label: 'Expert Freelancers', color: 'red' as const },
    { id: 'st-3', value: '2000 +', label: 'Skilled Job Holders', color: 'purple' as const },
    { id: 'st-4', value: '5000 +', label: 'Industry Expert', color: 'red' as const },
    { id: 'st-5', value: '95 %', label: 'Success Ratio', color: 'purple' as const },
    { id: 'st-6', value: '100 +', label: 'Companies', color: 'red' as const }
  ];

  const stats = config?.stats && config.stats.length > 0 ? config.stats : defaultStats;
  const tagline = config?.tagline || 'Trusted for 12 Years';
  const headline = config?.headline || 'From Beginner to IT Professionals We Close That Gap.';
  const description =
    config?.description ||
    'For 12 years, NexGen Computer Academy has had one goal — turn ordinary people into extraordinary IT professionals. Technology is no longer just for engineers and computer scientists. Today every business, every industry, and every career path runs on digital skills. That is why we have spent over a decade making sure that anyone regardless of background or experience can learn the skills that truly matter.';
  const labBadgeText = config?.labBadgeText || 'Modern AC Lab • Farmgate Campus';
  const imageUrl =
    config?.imageUrl ||
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80';

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-xs">
              {tagline}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.18] tracking-tight">
              {headline.includes('IT Professionals') ? (
                <>
                  {headline.split('IT Professionals')[0]}
                  <span className="text-[#dc143c]">IT Professionals</span>
                  {headline.split('IT Professionals')[1]}
                </>
              ) : (
                headline
              )}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigateSubPage('courses')}
                className="px-6 py-2.5 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-black shadow-xs transition-all cursor-pointer active:scale-95"
              >
                Browse Course
              </button>

              <button
                type="button"
                onClick={() => onNavigateSubPage('courses')}
                className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-black shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                Online Course
              </button>
            </div>
          </div>

          {/* Right Image Card */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[16/11] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 group">
              <img
                src={imageUrl}
                alt="NexGen Computer Academy Classroom and Computer Lab"
                width={800}
                height={550}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-black text-slate-900 shadow-md">
                {labBadgeText}
              </div>
            </div>
          </div>
        </div>

        {/* 6 Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
          {stats.map((st, idx) => {
            const isRed = st.color === 'red';
            return (
              <div
                key={st.id || idx}
                className="text-center p-4 rounded-2xl bg-[#faf8ff] border border-slate-100 flex flex-col justify-center space-y-1 hover:border-purple-200 transition-colors"
              >
                <div
                  className={`text-2xl sm:text-3xl font-black tabular-nums ${
                    isRed ? 'text-[#dc143c]' : 'text-[#6b1cb0]'
                  }`}
                >
                  {st.value}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-600">
                  {st.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
