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
    <section id="career-matrix" className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Career & Course Decision Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-extrabold text-[11px]">ভবিষ্যতমুখী ক্যারিয়ার গাইড</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            কোন কোর্সটি <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-emerald-400">আপনার ক্যারিয়ারের জন্য সেরা?</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            গুগল ও এআই সার্চ মডেলগুলোর মতো আপনিও সরাসরি যাচাই করুন কোন কোর্সের সিলেবাসে কী কী সফটওয়্যার টুলস শেখানো হয়, 
            মার্কেটে চাকরির চাহিদা ও আনুমানিক সেলারি রেঞ্জ কেমন।
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              {cat === 'All' ? 'সকল ক্যারিয়ার ট্র্যাক' : cat}
            </button>
          ))}
        </div>

        {/* 1-on-1 Direct Course Comparison Matrix */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl mb-12">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-700">
            <div>
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>পাশাপাশি দুটি কোর্স তুলনা করুন (Side-by-Side Comparison)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                সফটওয়্যার, প্রজেক্ট, ক্যারিয়ার স্কোপ ও আয়ের সম্ভাবনা সরাসরি দেখুন
              </p>
            </div>

            {/* Selectors */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-bold text-amber-400">কোর্স ১:</span>
                <select
                  value={courseAId}
                  onChange={e => setCourseAId(e.target.value)}
                  className="bg-transparent text-xs text-white font-semibold outline-none cursor-pointer max-w-[180px] truncate"
                >
                  {activeCourses.map(c => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-xs font-black text-indigo-400">VS</span>

              <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-bold text-emerald-400">কোর্স ২:</span>
                <select
                  value={courseBId}
                  onChange={e => setCourseBId(e.target.value)}
                  className="bg-transparent text-xs text-white font-semibold outline-none cursor-pointer max-w-[180px] truncate"
                >
                  {activeCourses.map(c => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
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
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-amber-500/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 uppercase tracking-wider">
                      {courseA.category}
                    </span>
                    <span className="text-xs font-extrabold text-white">
                      ৳{courseA.offerFee || courseA.regularFee}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-white leading-snug mb-1">
                    {courseA.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {courseA.description}
                  </p>

                  <div className="space-y-3 text-xs border-t border-slate-800 pt-3">
                    <div className="flex items-start justify-between">
                      <span className="text-slate-400">মেয়াদ ও মোট ক্লাস:</span>
                      <span className="font-bold text-white text-right">{courseA.duration} ({courseA.totalClasses || 24} Classes)</span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-slate-400">শেখানো সফটওয়্যার / টুলস:</span>
                      <span className="font-bold text-amber-300 text-right max-w-[200px] truncate">
                        {(courseA as any).toolsCovered?.join(', ') || courseA.curriculumHighlights?.slice(0, 3).join(', ') || 'Practical Lab Tools'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-slate-400">যেসব পদে চাকরি / ক্যারিয়ার:</span>
                      <span className="font-bold text-emerald-400 text-right max-w-[200px] truncate">
                        {(courseA as any).careerRoles?.join(', ') || 'Corporate / Freelance Role'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-slate-400">মার্কেট স্যালারি রেঞ্জ:</span>
                      <span className="font-bold text-white text-right">
                        {(courseA as any).estimatedSalaryRange || '৳২৫,০০০ - ৳৬৫,০০০ / মাস'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-slate-400">সনদপত্রের মান:</span>
                      <span className="font-bold text-indigo-300 text-right">
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
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
                    >
                      সিলেবাস দেখুন
                    </button>
                  )}
                  {onSelectCourseForAdmission && (
                    <button
                      type="button"
                      onClick={() => onSelectCourseForAdmission(courseA)}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20"
                    >
                      সিট বুকিং করুন
                    </button>
                  )}
                </div>
              </div>

              {/* Course B Card */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-emerald-500/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 uppercase tracking-wider">
                      {courseB.category}
                    </span>
                    <span className="text-xs font-extrabold text-white">
                      ৳{courseB.offerFee || courseB.regularFee}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-white leading-snug mb-1">
                    {courseB.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {courseB.description}
                  </p>

                  <div className="space-y-3 text-xs border-t border-slate-800 pt-3">
                    <div className="flex items-start justify-between">
                      <span className="text-slate-400">মেয়াদ ও মোট ক্লাস:</span>
                      <span className="font-bold text-white text-right">{courseB.duration} ({courseB.totalClasses || 24} Classes)</span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-slate-400">শেখানো সফটওয়্যার / টুলস:</span>
                      <span className="font-bold text-emerald-300 text-right max-w-[200px] truncate">
                        {(courseB as any).toolsCovered?.join(', ') || courseB.curriculumHighlights?.slice(0, 3).join(', ') || 'Practical Lab Tools'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-slate-400">যেসব পদে চাকরি / ক্যারিয়ার:</span>
                      <span className="font-bold text-amber-400 text-right max-w-[200px] truncate">
                        {(courseB as any).careerRoles?.join(', ') || 'Corporate / Freelance Role'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-slate-400">মার্কেট স্যালারি রেঞ্জ:</span>
                      <span className="font-bold text-white text-right">
                        {(courseB as any).estimatedSalaryRange || '৳২৫,০০০ - ৳৬৫,০০০ / মাস'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-slate-400">সনদপত্রের মান:</span>
                      <span className="font-bold text-indigo-300 text-right">
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
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
                    >
                      সিলেবাস দেখুন
                    </button>
                  )}
                  {onSelectCourseForAdmission && (
                    <button
                      type="button"
                      onClick={() => onSelectCourseForAdmission(courseB)}
                      className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-md shadow-emerald-500/20"
                    >
                      সিট বুকিং করুন
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
