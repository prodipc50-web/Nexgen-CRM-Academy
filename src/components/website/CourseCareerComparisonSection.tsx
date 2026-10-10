import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Briefcase,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Sparkles,
  BookOpen,
  Filter,
  GraduationCap
} from 'lucide-react';
import { Course } from '../../types';

interface CourseCareerComparisonSectionProps {
  courses: Course[];
  onSelectCourseForAdmission?: (course: Course) => void;
  onExploreCourseDetails?: (course: Course) => void;
}

export const CourseCareerComparisonSection: React.FC<CourseCareerComparisonSectionProps> = ({
  courses,
  onSelectCourseForAdmission,
  onExploreCourseDetails
}) => {
  const activeCourses = useMemo(() => {
    return courses.filter(c => c.status === 'Active');
  }, [courses]);

  // Track / Career Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [courseAId, setCourseAId] = useState<string>('');
  const [courseBId, setCourseBId] = useState<string>('');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    activeCourses.forEach(c => {
      if (c.category) set.add(c.category);
    });
    return ['All', ...Array.from(set)];
  }, [activeCourses]);

  // Default comparison courses
  React.useEffect(() => {
    if (activeCourses.length >= 2 && (!courseAId || !courseBId)) {
      setCourseAId(activeCourses[0].id);
      setCourseBId(activeCourses[1].id);
    }
  }, [activeCourses, courseAId, courseBId]);

  const courseA = activeCourses.find(c => c.id === courseAId) || activeCourses[0];
  const courseB = activeCourses.find(c => c.id === courseBId) || activeCourses[1] || activeCourses[0];

  const filteredCourses = useMemo(() => {
    if (selectedCategory === 'All') return activeCourses;
    return activeCourses.filter(c => c.category === selectedCategory);
  }, [activeCourses, selectedCategory]);

  return (
    <section id="career-matrix" className="py-16 bg-white text-slate-900 relative overflow-hidden border-t border-slate-200">
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center flex-wrap justify-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold tracking-wide mb-3 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-indigo-700">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-bold uppercase tracking-wider text-[11px]">AI Career & Course Decision Engine</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline" />
            <span className="text-slate-600 font-medium text-[11px]">ভবিষ্যতমুখী ক্যারিয়ার গাইড</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight text-slate-950 mb-3 leading-tight">
            কোন কোর্সটি <span className="text-indigo-600">আপনার ক্যারিয়ারের জন্য সেরা?</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            সরাসরি যাচাই করুন কোন কোর্সের সিলেবাসে কী কী সফটওয়্যার টুলস শেখানো হয়, 
            মার্কেটে চাকরির চাহিদা ও আনুমানিক সেলারি রেঞ্জ কেমন।
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat === 'All' ? 'সকল ক্যারিয়ার ট্র্যাক' : cat}
            </button>
          ))}
        </div>

        {/* 1-on-1 Direct Course Comparison Matrix */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>পাশাপাশি দুটি কোর্স তুলনা করুন (Side-by-Side Comparison)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                সফটওয়্যার, প্রজেক্ট, ক্যারিয়ার স্কোপ ও আয়ের সম্ভাবনা সরাসরি দেখুন
              </p>
            </div>

            {/* Selectors */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs flex-1 sm:flex-initial">
                <span className="text-xs font-bold text-indigo-700 shrink-0">কোর্স ১:</span>
                <select
                  value={courseAId}
                  onChange={e => setCourseAId(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 font-semibold outline-none cursor-pointer w-full sm:max-w-[180px] truncate"
                >
                  {activeCourses.map(c => (
                    <option key={c.id} value={c.id} className="bg-white text-slate-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-xs font-black text-slate-400 text-center sm:text-left my-auto">VS</span>

              <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs flex-1 sm:flex-initial">
                <span className="text-xs font-bold text-amber-700 shrink-0">কোর্স ২:</span>
                <select
                  value={courseBId}
                  onChange={e => setCourseBId(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 font-semibold outline-none cursor-pointer w-full sm:max-w-[180px] truncate"
                >
                  {activeCourses.map(c => (
                    <option key={c.id} value={c.id} className="bg-white text-slate-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Comparison Cards Grid */}
          {courseA && courseB && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              
              {/* Course A Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 uppercase tracking-wider border border-indigo-200">
                      {courseA.category}
                    </span>
                    <span className="text-xs font-extrabold text-indigo-700 font-mono">
                      ৳{(courseA.offerFee || courseA.regularFee || 0).toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-950 leading-snug mb-1">
                    {courseA.name}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                    {courseA.description}
                  </p>

                  <div className="space-y-3 text-xs border-t border-slate-100 pt-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 shrink-0">মেয়াদ ও মোট ক্লাস:</span>
                      <span className="font-bold text-slate-900 text-right">{courseA.duration} ({courseA.totalClasses || 24} Classes)</span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 shrink-0">শেখানো সফটওয়্যার / টুলস:</span>
                      <span className="font-bold text-indigo-600 text-right max-w-[65%] leading-tight">
                        {(courseA as any).toolsCovered?.join(', ') || courseA.curriculumHighlights?.slice(0, 3).join(', ') || 'Practical Lab Tools'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 shrink-0">যেসব পদে চাকরি / ক্যারিয়ার:</span>
                      <span className="font-bold text-emerald-700 text-right max-w-[65%] leading-tight">
                        {(courseA as any).careerRoles?.join(', ') || 'Corporate / Freelance Role'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 shrink-0">মার্কেট স্যালারি রেঞ্জ:</span>
                      <span className="font-bold text-slate-900 text-right font-mono">
                        {(courseA as any).estimatedSalaryRange || '৳২৫,০০০ - ৳৬৫,০০০ / মাস'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 shrink-0">সনদপত্রের মান:</span>
                      <span className="font-bold text-slate-800 text-right">
                        {(courseA as any).certificationType || 'Govt Verifiable QR Certificate'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  {onExploreCourseDetails && (
                    <button
                      type="button"
                      onClick={() => onExploreCourseDetails(courseA)}
                      className="flex-1 min-h-[42px] py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs border border-slate-200 transition cursor-pointer"
                    >
                      সিলেবাস দেখুন
                    </button>
                  )}
                  {onSelectCourseForAdmission && (
                    <button
                      type="button"
                      onClick={() => onSelectCourseForAdmission(courseA)}
                      className="flex-1 min-h-[42px] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                    >
                      ভর্তি আবেদন
                    </button>
                  )}
                </div>
              </div>

              {/* Course B Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 uppercase tracking-wider border border-amber-200">
                      {courseB.category}
                    </span>
                    <span className="text-xs font-extrabold text-indigo-700 font-mono">
                      ৳{(courseB.offerFee || courseB.regularFee || 0).toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-950 leading-snug mb-1">
                    {courseB.name}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                    {courseB.description}
                  </p>

                  <div className="space-y-3 text-xs border-t border-slate-100 pt-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 shrink-0">মেয়াদ ও মোট ক্লাস:</span>
                      <span className="font-bold text-slate-900 text-right">{courseB.duration} ({courseB.totalClasses || 24} Classes)</span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 shrink-0">শেখানো সফটওয়্যার / টুলস:</span>
                      <span className="font-bold text-indigo-600 text-right max-w-[65%] leading-tight">
                        {(courseB as any).toolsCovered?.join(', ') || courseB.curriculumHighlights?.slice(0, 3).join(', ') || 'Practical Lab Tools'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 shrink-0">যেসব পদে চাকরি / ক্যারিয়ার:</span>
                      <span className="font-bold text-emerald-700 text-right max-w-[65%] leading-tight">
                        {(courseB as any).careerRoles?.join(', ') || 'Corporate / Freelance Role'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 shrink-0">মার্কেট স্যালারি রেঞ্জ:</span>
                      <span className="font-bold text-slate-900 text-right font-mono">
                        {(courseB as any).estimatedSalaryRange || '৳২৫,০০০ - ৳৬৫,০০০ / মাস'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 shrink-0">সনদপত্রের মান:</span>
                      <span className="font-bold text-slate-800 text-right">
                        {(courseB as any).certificationType || 'Govt Verifiable QR Certificate'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  {onExploreCourseDetails && (
                    <button
                      type="button"
                      onClick={() => onExploreCourseDetails(courseB)}
                      className="flex-1 min-h-[42px] py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs border border-slate-200 transition cursor-pointer"
                    >
                      সিলেবাস দেখুন
                    </button>
                  )}
                  {onSelectCourseForAdmission && (
                    <button
                      type="button"
                      onClick={() => onSelectCourseForAdmission(courseB)}
                      className="flex-1 min-h-[42px] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                    >
                      ভর্তি আবেদন
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
