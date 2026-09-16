import React, { useState } from 'react';
import {
  Briefcase,
  Award,
  DollarSign,
  Building,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Globe,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { StudentPlacement } from '../../types';
import { useAcademy } from '../../context/AcademyContext';

interface PlacementsShowcaseSectionProps {
  onOpenAdmission?: () => void;
}

export const PlacementsShowcaseSection: React.FC<PlacementsShowcaseSectionProps> = ({
  onOpenAdmission
}) => {
  const { placements, websiteCmsConfig } = useAcademy();

  const [activeFilter, setActiveFilter] = useState<string>('All');

  const config = websiteCmsConfig?.placementsSectionConfig;

  // Filter placements
  const activePlacements = (placements || []).filter((p) => p.status !== 'Inactive');

  const filtered = activePlacements.filter((p) => {
    if (activeFilter === 'All') return true;
    return p.type === activeFilter;
  });

  const filterOptions = [
    'All',
    'Full-time Job',
    'Remote Job',
    'Freelancing Milestone',
    'Internship'
  ];

  if (activePlacements.length === 0) return null;

  return (
    <section id="placements" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{config?.tagText || 'Real Alumni Career Success & Placements'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {config?.heading || 'সফল শিক্ষার্থীদের কর্মসংস্থান ও ফ্রিল্যান্সিং অর্জন'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {config?.subtitle ||
                'কোর্স সম্পন্নের পর আমাদের ক্যারিয়ার সেলের প্রত্যক্ষ নির্দেশনায় দেশি-বিদেশি শীর্ষ সফটওয়্যার কোম্পানি এবং গ্লোবাল ফ্রিল্যান্স মার্কেটপ্লেসে সফলতার সাথে কাজ করছেন আমাদের শিক্ষার্থীরা।'}
            </p>
          </div>

          {/* Metrics summary banner */}
          <div className="flex items-center space-x-3 bg-slate-800/90 border border-slate-700 p-3 rounded-2xl shrink-0">
            <div className="text-center px-3 border-r border-slate-700">
              <span className="block text-lg sm:text-xl font-black text-emerald-400">৮৮%+</span>
              <span className="text-[10px] text-slate-400 font-semibold">প্লেসমেন্ট রেশিও</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-lg sm:text-xl font-black text-amber-400">১০০+</span>
              <span className="text-[10px] text-slate-400 font-semibold">হায়ারিং পার্টনার</span>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setActiveFilter(opt)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === opt
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {opt === 'All' ? `All Placements (${activePlacements.length})` : opt}
            </button>
          ))}
        </div>

        {/* Placements Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((placement, idx) => {
            const isFreelance = placement.type === 'Freelancing Milestone';
            const earningsPrefix = placement.currency === 'USD' ? '$' : '৳';

            return (
              <motion.div
                key={placement.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
                className="bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-slate-700 shadow-xl flex flex-col justify-between space-y-4 hover:border-emerald-400/60 hover:shadow-2xl transition-all"
              >
                <div className="space-y-4">
                  {/* Top Bar: Placement Type & Verified Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isFreelance
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                    }`}>
                      {placement.type}
                    </span>

                    <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Student Avatar, Name and Course */}
                  <div className="flex items-start space-x-3.5">
                    {placement.studentPhoto ? (
                      <img
                        src={placement.studentPhoto}
                        alt={placement.studentName}
                        referrerPolicy="no-referrer"
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-600 shadow-md shrink-0"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black text-base flex items-center justify-center shadow-md shrink-0">
                        {placement.studentName.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h4 className="font-black text-white text-base truncate leading-snug">
                        {placement.studentName}
                      </h4>
                      <p className="text-xs text-indigo-300 font-bold truncate">
                        {placement.courseName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Batch: {placement.batchNumber || 'NexGen Grad'}
                      </p>
                    </div>
                  </div>

                  {/* Company & Role Box */}
                  <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-700/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <div className="flex items-center space-x-1.5 truncate">
                        <Building className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-bold text-white truncate">{placement.companyOrClient}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                        {placement.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                      <span className="text-[11px] text-slate-300 font-medium truncate">
                        {placement.position}
                      </span>
                      {placement.marketplace && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-indigo-300 border border-slate-700 shrink-0">
                          {placement.marketplace}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Monthly Remuneration / Salary Badge */}
                  {placement.monthlySalaryOrEarnings > 0 && (
                    <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
                      <span className="text-[11px] font-semibold text-emerald-200">
                        {isFreelance ? 'গড় মাসিক আয়:' : 'মাসিক স্যালারি প্যাকেজ:'}
                      </span>
                      <span className="font-mono font-black text-sm text-emerald-400">
                        {earningsPrefix}{placement.monthlySalaryOrEarnings.toLocaleString()}
                        {placement.currency === 'USD' ? ' /mo' : ' /মাস'}
                      </span>
                    </div>
                  )}

                  {/* Story Review snippet */}
                  {placement.storyReview && (
                    <p className="text-xs text-slate-300 italic line-clamp-2 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                      "{placement.storyReview}"
                    </p>
                  )}
                </div>

                {/* Footer Link / Details */}
                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">
                    {placement.placementDate || 'Recent Placement'}
                  </span>

                  {placement.portfolioUrl && (
                    <a
                      href={placement.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-300 hover:text-white flex items-center space-x-1 font-bold transition-colors"
                    >
                      <span>পোর্টফোলিও</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Call to Action */}
        <div className="p-6 bg-gradient-to-r from-emerald-900/60 via-indigo-900/60 to-purple-900/60 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-black text-white">
              আপনিও হতে পারেন পরবর্তী সফল আইটি প্রফেশনাল বা ফ্রিল্যান্সার!
            </h4>
            <p className="text-xs text-emerald-200">
              আধুনিক কারিকুলাম, ওয়ান-টু-ওয়ান মেন্টর সাপোর্ট এবং ডেডিকেটেড জব প্লেসমেন্ট সেলের সাথে আপনার ক্যারিয়ার শুরু করুন।
            </p>
          </div>

          {onOpenAdmission && (
            <button
              type="button"
              onClick={onOpenAdmission}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center space-x-2 shrink-0 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>আজই ভর্তি আবেদন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
