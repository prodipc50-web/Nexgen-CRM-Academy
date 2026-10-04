import React from 'react';
import { MapPin, Video, FolderGit2, Building2 } from 'lucide-react';
import { WebsiteSubPage } from '../../../types';

interface NexgenExploreCategoriesProps {
  onNavigateSubPage: (page: WebsiteSubPage) => void;
  onFilterDeliveryMode?: (mode: 'Offline' | 'Online' | 'Pre Recorded') => void;
}

export const NexgenExploreCategories: React.FC<NexgenExploreCategoriesProps> = ({
  onNavigateSubPage,
  onFilterDeliveryMode
}) => {
  return (
    <section className="py-14 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Explore Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              We offer training in the most in-demand IT fields today. Whether you want to design, marketing, editing, coding, or freelancing — there is a course here built specifically for your goal.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateSubPage('courses')}
                className="px-6 py-2.5 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-black shadow-xs transition-all cursor-pointer active:scale-95"
              >
                Explore Courses
              </button>
            </div>
          </div>

          {/* Right 4 Category Cards (2x2) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Card 1: Offline Course */}
            <div
              onClick={() => {
                if (onFilterDeliveryMode) onFilterDeliveryMode('Offline');
                onNavigateSubPage('courses');
              }}
              className="p-6 rounded-3xl bg-[#f5f3ff] hover:bg-[#ede9fe] border border-purple-100 transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group hover:-translate-y-0.5 shadow-2xs"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#ede9fe] text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-purple-700 transition-colors">
                Offline Course
              </h4>
            </div>

            {/* Card 2: Online Course */}
            <div
              onClick={() => {
                if (onFilterDeliveryMode) onFilterDeliveryMode('Online');
                onNavigateSubPage('courses');
              }}
              className="p-6 rounded-3xl bg-[#fff1f2] hover:bg-[#ffe4e6] border border-rose-100 transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group hover:-translate-y-0.5 shadow-2xs"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#ffe4e6] text-[#e11d48] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-[#e11d48] transition-colors">
                Online Course
              </h4>
            </div>

            {/* Card 3: Pre Recorded Course */}
            <div
              onClick={() => {
                if (onFilterDeliveryMode) onFilterDeliveryMode('Pre Recorded');
                onNavigateSubPage('courses');
              }}
              className="p-6 rounded-3xl bg-[#f0fdfa] hover:bg-[#ccfbf1] border border-teal-100 transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group hover:-translate-y-0.5 shadow-2xs"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#ccfbf1] text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h4 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-teal-700 transition-colors">
                Pre Recorded Course
              </h4>
            </div>

            {/* Card 4: Corporate Training */}
            <div
              onClick={() => onNavigateSubPage('about')}
              className="p-6 rounded-3xl bg-[#f0fdf4] hover:bg-[#dcfce7] border border-emerald-100 transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group hover:-translate-y-0.5 shadow-2xs"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#dcfce7] text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                Corporate Training
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
