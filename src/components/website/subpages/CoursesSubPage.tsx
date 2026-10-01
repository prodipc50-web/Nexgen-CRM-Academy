import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  X,
  Filter,
  Star,
  Flame,
  Calendar,
  Zap,
  Download,
  CreditCard,
  Sparkles,
  ExternalLink,
  Award,
  Clock,
  Laptop,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Course, Batch } from '../../../types';
import { SubPageBanner } from './SubPageBanner';

interface CoursesSubPageProps {
  courses: Course[];
  categories: string[];
  batches?: Batch[];
  onOpenEnroll: (course: Course) => void;
  onOpenSyllabus: (course: Course) => void;
  onOpenInstallment: (course: Course) => void;
  onOpenCourseLanding: (course: Course) => void;
  onBackToHome: () => void;
}

export const CoursesSubPage: React.FC<CoursesSubPageProps> = ({
  courses,
  categories,
  batches = [],
  onOpenEnroll,
  onOpenSyllabus,
  onOpenInstallment,
  onOpenCourseLanding,
  onBackToHome
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<'All' | 'Offline' | 'Online' | 'Pre Recorded'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'fee-asc' | 'fee-desc' | 'rating'>('default');

  // Counts
  const offlineCount = courses.filter(c => (c.courseType || 'Offline') === 'Offline').length;
  const onlineCount = courses.filter(c => c.courseType === 'Online').length;
  const recordedCount = courses.filter(c => c.courseType === 'Pre Recorded').length;

  // Filtered & Sorted Courses
  const filteredCourses = courses
    .filter(c => {
      if (selectedDeliveryMode !== 'All') {
        const mode = c.courseType || 'Offline';
        if (mode.toLowerCase() !== selectedDeliveryMode.toLowerCase()) return false;
      }
      if (selectedCategory !== 'All') {
        if (c.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.name?.toLowerCase().includes(q);
        const matchCode = (c.code || '').toLowerCase().includes(q) || (c.badgeText || '').toLowerCase().includes(q);
        const matchCat = (c.category || '').toLowerCase().includes(q);
        const matchDesc = (c.description || '').toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchCat && !matchDesc) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const feeA = a.offerFee || a.regularFee || 0;
      const feeB = b.offerFee || b.regularFee || 0;
      if (sortBy === 'fee-asc') return feeA - feeB;
      if (sortBy === 'fee-desc') return feeB - feeA;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0;
    });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SubPageBanner
        title="Our Specialized IT Career Courses (কোর্সসমূহ)"
        subtitle="মার্কেটপ্লেস ও কর্পোরেট জব রেডি স্কিলস ডেভেলপ করুন অভিজ্ঞ ইন্ডাস্ট্রি মেন্টরদের সাথে। ১০০% প্র্যাকটিক্যাল ল্যাব ও লাইফটাইম সাপোর্ট।"
        badge="ইন্ডাস্ট্রি-স্ট্যান্ডার্ড সিলেবাস"
        breadcrumbs={[{ label: 'কোর্সসমূহ (All Courses)', active: true }]}
        onBackToHome={onBackToHome}
        actionButton={
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl bg-white/10 text-white font-mono text-xs font-bold border border-white/10">
              Total Courses: {courses.length}
            </span>
          </div>
        }
      />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 space-y-8">
        {/* Controls: Delivery Tabs, Category Filter & Search Box */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          {/* Top Row: Delivery Mode Switcher & Sort By */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedDeliveryMode('All')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDeliveryMode === 'All'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Courses ({courses.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedDeliveryMode('Offline')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDeliveryMode === 'Offline'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏢 Offline Classroom ({offlineCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedDeliveryMode('Online')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDeliveryMode === 'Online'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌐 Online Live ({onlineCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedDeliveryMode('Pre Recorded')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDeliveryMode === 'Pre Recorded'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎬 Pre Recorded ({recordedCount})
              </button>
            </div>

            {/* Sort & Search Controls */}
            <div className="flex items-center gap-2.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="default">Sort: Default Order</option>
                <option value="fee-asc">Course Fee: Low to High</option>
                <option value="fee-desc">Course Fee: High to Low</option>
                <option value="rating">Top Rated (Highest Rating)</option>
              </select>

              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-auto sm:min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-slate-700 text-xs px-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="pt-2 border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Summary & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'course' : 'courses'}
            {selectedDeliveryMode !== 'All' && ` in ${selectedDeliveryMode} format`}
            {selectedCategory !== 'All' && ` under "${selectedCategory}"`}
          </span>
          {(selectedDeliveryMode !== 'All' || selectedCategory !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedDeliveryMode('All');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-indigo-600 hover:underline font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No courses found matching your criteria.</h3>
            <p className="text-xs text-slate-500">Try changing the category or clearing the search keyword.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedDeliveryMode('All');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              View All Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredCourses.map((c) => {
              const deliveryMode = c.courseType || 'Offline';
              const badge = c.badgeText || c.code || `UITB-VE-${c.id.slice(-3)}`;
              const rating = c.rating || 5.0;
              const reviews = c.reviewsCount || 431;
              const projects = c.projectsCount || 10;
              const students = c.studentsJoined || 450;
              const thumbnail = c.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80';

              const upcomingBatch = (batches || []).find(b => (b.courseId === c.id || b.courseId === c.code) && b.status === 'Upcoming');
              const batchDate = upcomingBatch?.startDate || c.landingConfig?.nextBatchStartDate || 'নতুন ব্যাচে ভর্তি চলছে';
              const remainingSeats = upcomingBatch
                ? Math.max(2, (upcomingBatch.seatCapacity || upcomingBatch.maxStudents || 25) - (upcomingBatch.enrolledStudents || 0))
                : (c.landingConfig?.remainingSeats || 4);

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col overflow-hidden group"
                >
                  {/* Thumbnail Image */}
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={thumbnail}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                    {/* Delivery Mode Badge */}
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md ${
                        deliveryMode === 'Offline'
                          ? 'bg-emerald-600'
                          : deliveryMode === 'Online'
                          ? 'bg-rose-600'
                          : 'bg-purple-600'
                      }`}>
                        {deliveryMode}
                      </span>
                    </div>

                    {/* Dedicated Landing Page Link */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCourseLanding(c);
                      }}
                      className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-white/95 hover:bg-white text-slate-900 hover:text-indigo-600 backdrop-blur-xs border border-slate-200 shadow-md transition-all cursor-pointer z-10"
                      title="View Dedicated Course Page"
                    >
                      <ExternalLink className="w-3 h-3 text-indigo-600" />
                      <span>Course Page</span>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-mono font-bold text-[11px]">
                          {badge}
                        </span>

                        <span className="text-[11px] font-bold text-amber-500 flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{rating} ({reviews} reviews)</span>
                        </span>
                      </div>

                      <div className="min-h-[3.75rem] flex flex-col justify-start">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                          {c.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-1 truncate">
                          {c.category}
                        </p>
                      </div>

                      {/* Course Fee */}
                      <div className="flex items-baseline space-x-2 pt-1">
                        <span className="text-xl font-black text-indigo-700">
                          ৳{(c.offerFee || c.regularFee || 0).toLocaleString()}
                        </span>
                        {c.regularFee && c.regularFee > (c.offerFee || 0) && (
                          <span className="text-xs text-slate-400 line-through">
                            ৳{c.regularFee.toLocaleString()}
                          </span>
                        )}
                        {c.regularFee && c.offerFee && c.regularFee > c.offerFee && (
                          <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
                            SAVE ৳{(c.regularFee - c.offerFee).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* 4 Metrics Box */}
                      <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[10px] text-slate-400 font-semibold block">Class</span>
                          <span className="font-bold text-slate-800 block text-[11px] sm:text-xs leading-snug">
                            {c.totalClasses || 36} Classes
                          </span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[10px] text-slate-400 font-semibold block">Duration</span>
                          <span className="font-bold text-slate-800 block text-[11px] sm:text-xs leading-snug">
                            {c.duration}
                          </span>
                        </div>
                        <div className="space-y-0.5 pt-1.5 border-t border-slate-200/60 min-w-0">
                          <span className="text-[10px] text-slate-400 font-semibold block">Projects</span>
                          <span className="font-bold text-indigo-700 block text-[11px] sm:text-xs leading-snug">
                            {projects} Real Projects
                          </span>
                        </div>
                        <div className="space-y-0.5 pt-1.5 border-t border-slate-200/60 min-w-0">
                          <span className="text-[10px] text-slate-400 font-semibold block">Student Joined</span>
                          <span className="font-bold text-emerald-700 block text-[11px] sm:text-xs leading-snug">
                            {students}+ Students
                          </span>
                        </div>
                      </div>

                      {/* Batch & Urgency */}
                      <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/40 text-[11px] text-amber-900 font-bold">
                        <span className="flex items-center space-x-1 min-w-0">
                          <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span className="text-[10px] sm:text-[11px] leading-tight">ব্যাচ: <strong>{batchDate}</strong></span>
                        </span>
                        <span className="flex items-center space-x-1 text-rose-600 bg-white px-1.5 py-0.5 rounded-md border border-rose-200 shadow-2xs font-black shrink-0 text-[10px]">
                          <Flame className="w-3 h-3 text-rose-500" />
                          <span>{remainingSeats}টি বাকি</span>
                        </span>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => onOpenEnroll(c)}
                        className="w-full min-h-[38px] px-3 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition-all text-center flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span>অনলাইন ভর্তি আবেদন (Enroll)</span>
                      </button>

                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenSyllabus(c)}
                          className="py-1.5 px-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200 transition-colors text-center flex items-center justify-center space-x-1 cursor-pointer active:scale-98"
                          title="Download Syllabus PDF"
                        >
                          <Download className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span>সিলেবাস</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenInstallment(c)}
                          className="py-1.5 px-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] rounded-lg border border-amber-200 transition-colors text-center flex items-center justify-center space-x-1 cursor-pointer active:scale-98"
                          title="Easy Installment Plan"
                        >
                          <CreditCard className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>কিস্তি (EMI)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenCourseLanding(c)}
                          className="py-1.5 px-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg border border-indigo-200/60 transition-colors text-center flex items-center justify-center space-x-1 cursor-pointer active:scale-98"
                          title="View Course Page"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span>বিস্তারিত</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
