import React from 'react';
import { Star, Users, FolderKanban, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Course } from '../../../types';
import { OptimizedLazyImage } from '../../common/OptimizedLazyImage';

interface UniqueItOnlineCoursesProps {
  courses: Course[];
  batches?: any[];
  onSelectCourseForAdmission: (course: Course) => void;
  onSelectCourseForDetails: (course: Course) => void;
  onViewAllCourses: () => void;
}

export const NexgenOnlineCourses: React.FC<UniqueItOnlineCoursesProps> = ({
  courses,
  batches = [],
  onSelectCourseForAdmission,
  onSelectCourseForDetails,
  onViewAllCourses
}) => {
  // Filter courses that are online or display popular online courses
  const onlineCourses = courses.filter((c) => c.courseType === 'Online');
  const displayCourses = (onlineCourses.length >= 3 ? onlineCourses : courses).slice(0, 9);

  return (
    <section className="py-14 sm:py-16 bg-[#faf8ff] border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#dc143c] tracking-tight">
            Online Courses
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Every course here is designed around what employers and freelance clients are paying for today. Pick a course, work on real projects, build your portfolio, and walk out ready to earn.
          </p>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((c, idx) => {
            const courseCode = c.code || `UITB-ON-${c.id.slice(-3)}`;
            const price = c.offerFee || c.regularFee || 7499;
            const regularPrice = c.regularFee || Math.round(price * 1.5);
            const rating = c.rating || 5.0;
            const reviewsCount = c.reviewsCount || 430;
            const duration = c.durationMonths ? `${c.durationMonths} Months` : '2.5 Months';
            const projects = c.projectsCount || 10;
            const students = c.studentsJoined || 450;
            const thumbnail =
              c.thumbnailUrl ||
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';

            return (
              <div
                key={c.id || idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-purple-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Banner */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <OptimizedLazyImage
                    src={thumbnail}
                    alt={c.name}
                    width={480}
                    height={300}
                    aspectRatio="16/10"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackSrc="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"
                  />
                  <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                      NexGen Academy
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  {/* Tags */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-[#e11d48] border border-rose-200/60 font-mono text-[10px] font-black uppercase">
                      {courseCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Online</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-[#dc143c] transition-colors">
                    {c.name}
                  </h3>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-base sm:text-lg font-black text-[#dc143c]">
                        ৳ {price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ৳ {regularPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({reviewsCount})</span>
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-1.5 py-2 border-y border-slate-100 text-[11px] text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Class: {c.totalClasses || 32}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Duration: {duration}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <FolderKanban className="w-3 h-3 text-slate-400" />
                      <span>Projects: {projects}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span className="truncate">Student: {students}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectCourseForAdmission(c)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f43f5e] hover:from-[#be123c] hover:to-[#e11d48] text-white text-xs font-black shadow-2xs transition-all cursor-pointer text-center active:scale-95"
                    >
                      ভর্তি আবেদন
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectCourseForDetails(c)}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer text-center active:scale-95"
                    >
                      সিলেবাস দেখুন
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Course Button */}
        <div className="text-center pt-10">
          <button
            type="button"
            onClick={onViewAllCourses}
            className="inline-flex items-center space-x-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-black text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
          >
            <span>সবগুলো অনলাইন কোর্স দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export { NexgenOnlineCourses as UniqueItOnlineCourses };
