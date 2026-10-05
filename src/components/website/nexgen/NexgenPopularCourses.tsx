import React, { useState } from 'react';
import { Star, Users, FolderKanban, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Course } from '../../../types';

interface UniqueItPopularCoursesProps {
  courses: Course[];
  onSelectCourseForAdmission: (course: Course) => void;
  onSelectCourseForDetails: (course: Course) => void;
  onViewAllCourses: () => void;
}

export const NexgenPopularCourses: React.FC<UniqueItPopularCoursesProps> = ({
  courses,
  onSelectCourseForAdmission,
  onSelectCourseForDetails,
  onViewAllCourses
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Online' | 'Offline' | 'Pre Recorded'>('All');

  const filteredCourses = courses.filter((c) => {
    if (activeFilter === 'All') return true;
    return (c.courseType || 'Offline') === activeFilter;
  });

  // Display top 9 courses for the 3x3 grid
  const displayCourses = filteredCourses.slice(0, 9);

  return (
    <section className="py-14 sm:py-16 bg-[#faf8ff] border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#dc143c] tracking-tight">
            Popular Courses
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Every course here is designed around what employers and freelance clients are paying for today. Pick a course, work on real projects, build your portfolio, and walk out ready to earn.
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {(['All', 'Online', 'Offline', 'Pre Recorded'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setActiveFilter(mode)}
                className={`min-w-[80px] sm:min-w-[120px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs ${
                  activeFilter === mode
                    ? 'bg-[#dc143c] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* 3x3 Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((c, idx) => {
            const courseCode = c.code || `UITB-${c.category?.slice(0, 2).toUpperCase() || 'IT'}-${c.id.slice(-3)}`;
            const isOnline = c.courseType === 'Online';
            const price = c.offerFee || c.regularFee || 15750;
            const regularPrice = c.regularFee || Math.round(price * 1.4);
            const rating = c.rating || 5.0;
            const reviewsCount = c.reviewsCount || 1221;
            const duration = c.durationMonths ? `${c.durationMonths} Months` : '3 Months';
            const projects = c.projectsCount || 10;
            const students = c.studentsJoined || 820;
            const thumbnail =
              c.thumbnailUrl ||
              'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80';

            return (
              <div
                key={c.id || idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-purple-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Course Banner Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={thumbnail}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                      NexGen Academy
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  {/* Tags Row */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-[#e11d48] border border-rose-200/60 font-mono text-[10px] font-black uppercase">
                      {courseCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        isOnline
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}
                    >
                      {c.courseType || 'Offline'}
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

                  {/* Course Specs Grid */}
                  <div className="grid grid-cols-2 gap-1.5 py-2 border-y border-slate-100 text-[11px] text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Class: {c.totalClasses || 36}</span>
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
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f43f5e] hover:from-[#be123c] hover:to-[#e11d48] text-white text-xs font-black shadow-2xs transition-all cursor-pointer text-center active:scale-95"
                    >
                      Enroll Now
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectCourseForDetails(c)}
                      className="w-full py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer text-center active:scale-95"
                    >
                      View Details
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
            <span>View All Course</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export { NexgenPopularCourses as UniqueItPopularCourses };
