import React from 'react';
import { BookOpen, Laptop } from 'lucide-react';
import { WebsiteSubPage } from '../../../types';

interface UniqueItAboutHeroProps {
  onNavigateSubPage: (page: WebsiteSubPage) => void;
}

export const UniqueItAboutHero: React.FC<UniqueItAboutHeroProps> = ({ onNavigateSubPage }) => {
  const stats = [
    { value: '20000 +', label: 'Successful Students', color: 'purple' },
    { value: '9000 +', label: 'Expert Freelancers', color: 'red' },
    { value: '2000 +', label: 'Skilled Job Holders', color: 'purple' },
    { value: '5000 +', label: 'Industry Expert', color: 'red' },
    { value: '95 %', label: 'Success Ratio', color: 'purple' },
    { value: '100 +', label: 'Companies', color: 'red' }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-xs">
              Trusted for 12 Years
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.18] tracking-tight">
              From Beginner to <span className="text-[#dc143c]">IT Professionals</span> We Close That Gap.
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              For 12 years, Unique IT Institute has had one goal — turn ordinary people into extraordinary IT professionals. Technology is no longer just for engineers and computer scientists. Today every business, every industry, and every career path runs on digital skills. That is why we have spent over a decade making sure that anyone regardless of background or experience can learn the skills that truly matter.
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
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80"
                alt="Unique IT Institute Classroom and Computer Lab"
                className="w-full aspect-[16/11] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-black text-slate-900 shadow-md">
                Modern AC Lab • Banasree Campus
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
                key={idx}
                className="text-center p-4 rounded-2xl bg-[#faf8ff] border border-slate-100 flex flex-col justify-center space-y-1"
              >
                <div
                  className={`text-2xl sm:text-3xl font-black ${
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
