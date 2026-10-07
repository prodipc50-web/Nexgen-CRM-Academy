import React, { useState } from 'react';
import { Star, Users, FolderKanban, Clock, Calendar, ArrowRight, Sparkles, BookOpen, Laptop, Video, ShieldCheck } from 'lucide-react';
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
    <section id="courses" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>জনপ্রিয় কোর্সসমূহ • Career Tracks</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            ক্যারিয়ারমুখী প্রফেশনাল আইটি ও ফ্রিল্যান্সিং কোর্সসমূহ
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            মার্কেটপ্লেস ও লোকাল সফটওয়্যার ইন্ডাস্ট্রির চাহিদা অনুযায়ী তৈরি হ্যান্ডস-অন কোর্স কারিকুলাম। সরাসরি অফলাইন কম্পিউটার ল্যাবে অথবা দেশের যেকোনো প্রান্ত থেকে লাইভ অনলাইনে শিখুন।
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-3">
            {[
              { id: 'All', label: 'সকল কোর্স', count: courses.length },
              { id: 'Offline', label: 'অফলাইন ল্যাব', count: courses.filter(c => (c.courseType || 'Offline') === 'Offline').length },
              { id: 'Online', label: 'অনলাইন লাইভ', count: courses.filter(c => c.courseType === 'Online').length },
              { id: 'Pre Recorded', label: 'প্রি-রেকর্ডেড', count: courses.filter(c => c.courseType === 'Pre Recorded').length }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`min-h-[42px] px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  activeFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    activeFilter === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3x3 Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((c, idx) => {
            const courseCode = c.code || `NXC-${c.category?.slice(0, 3).toUpperCase() || 'IT'}-${c.id.slice(-3)}`;
            const isOnline = c.courseType === 'Online';
            const price = c.offerFee || c.regularFee || 7500;
            const regularPrice = c.regularFee || Math.round(price * 1.5);
            const savings = regularPrice - price;
            const rating = c.rating || 4.9;
            const reviewsCount = c.reviewsCount || 1221;
            const duration = c.durationMonths ? `${c.durationMonths} মাস` : '৩ মাস';
            const projects = c.projectsCount || 10;
            const students = c.studentsJoined || 820;
            const thumbnail =
              c.thumbnailUrl ||
              'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80';

            return (
              <div
                key={c.id || idx}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                {/* Course Banner Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={thumbnail}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  {/* Top Left: Live Batch Scarcity Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold flex items-center space-x-1.5 border border-white/10 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span>নতুন ব্যাচ: শুক্রবার</span>
                    </span>
                  </div>

                  {/* Top Right: Delivery Mode Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center space-x-1 ${
                        isOnline
                          ? 'bg-indigo-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isOnline ? <Video className="w-3 h-3" /> : <Laptop className="w-3 h-3" />}
                      <span>{c.courseType || 'Offline'}</span>
                    </span>
                  </div>

                  {/* Bottom Left: Discount Pill on Image */}
                  {savings > 0 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-black text-[10px] tracking-wide uppercase shadow-sm">
                        ৪০% স্কলারশিপ ছাড়
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Category & Rating Row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200/60">
                      {c.category || 'IT Professional'}
                    </span>
                    <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal text-[11px]">({reviewsCount})</span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <h3 className="font-black text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {c.name}
                  </h3>

                  {/* Pricing Block */}
                  <div className="flex items-baseline justify-between pt-1 pb-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xl font-black text-rose-600">
                        ৳ {price.toLocaleString()}
                      </span>
                      {regularPrice > price && (
                        <span className="text-xs text-slate-400 line-through">
                          ৳ {regularPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {savings > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        সেভ ৳ {savings.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Course Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-100 text-[11px] text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>ক্লাস: {c.totalClasses || 36}টি</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>মেয়াদ: {duration}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <FolderKanban className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>প্রজেক্ট: {projects}+ টি</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">শিক্ষার্থী: {students}+</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectCourseForAdmission(c)}
                      className="w-full min-h-[44px] py-2.5 px-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white text-xs font-black shadow-sm transition-all cursor-pointer text-center active:scale-95 flex items-center justify-center space-x-1"
                      title="অনলাইনে ভর্তি আবেদন করুন"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                      <span>ভর্তি আবেদন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectCourseForDetails(c)}
                      className="w-full min-h-[44px] py-2.5 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer text-center active:scale-95 flex items-center justify-center space-x-1"
                      title="কোর্স সিলেবাস ও বিস্তারিত দেখুন"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>সিলেবাস দেখুন</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Course Button */}
        <div className="text-center pt-10 sm:pt-12">
          <button
            type="button"
            onClick={onViewAllCourses}
            className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
          >
            <span>সবগুলো কোর্স ও কারিকুলাম দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export { NexgenPopularCourses as UniqueItPopularCourses };
