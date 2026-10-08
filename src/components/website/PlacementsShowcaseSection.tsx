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
    <section id="placements" className="py-16 sm:py-20 bg-white text-slate-900 relative overflow-hidden border-t border-slate-200">
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>{config?.tagText || 'Real Alumni Career Success & Placements'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
              {config?.heading || 'সফল শিক্ষার্থীদের কর্মসংস্থান ও ফ্রিল্যান্সিং অর্জন'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              {config?.subtitle ||
                'কোর্স সম্পন্নের পর আমাদের ক্যারিয়ার সেলের প্রত্যক্ষ নির্দেশনায় দেশি-বিদেশি শীর্ষ সফটওয়্যার কোম্পানি এবং গ্লোবাল ফ্রিল্যান্স মার্কেটপ্লেসে সফলতার সাথে কাজ করছেন আমাদের শিক্ষার্থীরা।'}
            </p>
          </div>

          {/* Metrics summary banner */}
          <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 p-3 rounded-2xl shrink-0">
            <div className="text-center px-3 border-r border-slate-200">
              <span className="block text-lg sm:text-xl font-black text-emerald-700">৮৮%+</span>
              <span className="text-[10px] text-slate-500 font-semibold">প্লেসমেন্ট রেশিও</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-lg sm:text-xl font-black text-indigo-700">১০০+</span>
              <span className="text-[10px] text-slate-500 font-semibold">হায়ারিং পার্টনার</span>
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
                  ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
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
                className="bg-slate-50/80 hover:bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  {/* Top Bar: Placement Type & Verified Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isFreelance
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {placement.type}
                    </span>

                    <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Student Avatar, Name and Course */}
                  <div className="flex items-start space-x-3.5">
                    {placement.studentPhoto ? (
                      <img
                        src={placement.studentPhoto}
                        alt={placement.studentName}
                        width={52}
                        height={52}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-13 h-13 aspect-square rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-base flex items-center justify-center shadow-2xs shrink-0">
                        {placement.studentName.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h4 className="font-black text-slate-950 text-base truncate leading-snug">
                        {placement.studentName}
                      </h4>
                      <p className="text-xs text-indigo-700 font-bold truncate">
                        {placement.courseName}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Batch: {placement.batchNumber || 'NexGen Grad'}
                      </p>
                    </div>
                  </div>

                  {/* Company & Role Box */}
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <div className="flex items-center space-x-1.5 truncate">
                        <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="font-bold text-slate-900 truncate">{placement.companyOrClient}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium shrink-0 ml-2">
                        {placement.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-[11px] text-slate-600 font-medium truncate">
                        {placement.position}
                      </span>
                      {placement.marketplace && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-[10px] font-mono text-indigo-700 border border-indigo-200/60 shrink-0">
                          {placement.marketplace}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Monthly Remuneration / Salary Badge */}
                  {placement.monthlySalaryOrEarnings > 0 && (
                    <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                      <span className="text-[11px] font-semibold text-emerald-800">
                        {isFreelance ? 'গড় মাসিক আয়:' : 'মাসিক স্যালারি প্যাকেজ:'}
                      </span>
                      <span className="font-mono font-black text-sm text-emerald-700">
                        {earningsPrefix}{placement.monthlySalaryOrEarnings.toLocaleString()}
                        {placement.currency === 'USD' ? ' /mo' : ' /মাস'}
                      </span>
                    </div>
                  )}

                  {/* Story Review snippet */}
                  {placement.storyReview && (
                    <p className="text-xs text-slate-600 italic line-clamp-2 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                      "{placement.storyReview}"
                    </p>
                  )}
                </div>

                {/* Footer Link / Details */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500">
                    {placement.placementDate || 'Recent Placement'}
                  </span>

                  {placement.portfolioUrl && (
                    <a
                      href={placement.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 font-bold transition-colors"
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
        <div className="p-6 bg-indigo-50/70 rounded-3xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-2xs">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-black text-slate-900">
              আপনিও হতে পারেন পরবর্তী সফল আইটি প্রফেশনাল বা ফ্রিল্যান্সার!
            </h4>
            <p className="text-xs text-slate-600">
              আধুনিক কারিকুলাম, ওয়ান-টু-ওয়ান মেন্টর সাপোর্ট এবং ডেডিকেটেড জব প্লেসমেন্ট সেলের সাথে আপনার ক্যারিয়ার শুরু করুন।
            </p>
          </div>

          {onOpenAdmission && (
            <button
              type="button"
              onClick={onOpenAdmission}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xs flex items-center space-x-2 shrink-0 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>আজই ভর্তি আবেদন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
