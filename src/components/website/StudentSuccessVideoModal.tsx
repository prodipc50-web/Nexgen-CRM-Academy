import React from 'react';
import { X, Star, DollarSign, Award, Briefcase, ExternalLink, Play } from 'lucide-react';

export interface StudentSuccessStory {
  id: string;
  studentName: string;
  courseName: string;
  companyOrPlatform: string; // e.g. "Upwork Top Rated", "Fiverr Level 2", "Brain Station 23", "Walton IT"
  monthlyIncomeOrPackage: string; // e.g. "৳৭৫,০০০+/মাস", "$১,২০০+/মাস"
  avatarUrl: string;
  videoEmbedUrl?: string; // YouTube video embed or preview
  storySummary: string;
  quote: string;
  batchNo?: string;
  achievementBadge?: string;
}

interface StudentSuccessVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StudentSuccessStory | null;
  onSelectCourseForAdmission?: (courseName: string) => void;
}

export const StudentSuccessVideoModal: React.FC<StudentSuccessVideoModalProps> = ({
  isOpen,
  onClose,
  story,
  onSelectCourseForAdmission
}) => {
  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl text-white shadow-2xl overflow-hidden relative my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={story.avatarUrl}
              alt={story.studentName}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white">{story.studentName}</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black">
                  {story.achievementBadge || 'সফল শিক্ষার্থী'}
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-bold">{story.courseName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black">
          {story.videoEmbedUrl ? (
            <iframe
              src={story.videoEmbedUrl}
              title={`${story.studentName} Success Story`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400">
                <Play className="w-8 h-8 fill-amber-400" />
              </div>
              <p className="text-xs text-slate-300 max-w-sm">
                "{story.quote}"
              </p>
            </div>
          )}
        </div>

        {/* Details and Story */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-medium">কর্মসংস্থান / প্ল্যাটফর্ম:</span>
              <span className="text-xs sm:text-sm font-black text-amber-400 mt-0.5 block truncate">
                {story.companyOrPlatform}
              </span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 block font-medium">মাসিক আয় / স্যালারি:</span>
              <span className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5 block font-mono">
                {story.monthlyIncomeOrPackage}
              </span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block font-medium">ব্যাচ নম্বর:</span>
              <span className="text-xs sm:text-sm font-black text-indigo-300 mt-0.5 block">
                {story.batchNo || 'Batch 2024-25'}
              </span>
            </div>
          </div>

          {/* Full Story Summary */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">সফলতার গল্প:</h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
              {story.storySummary}
            </p>
          </div>

          {/* Student Quote */}
          <div className="p-3.5 bg-indigo-950/60 rounded-xl border border-indigo-500/30 text-xs italic text-indigo-200 leading-relaxed">
            "{story.quote}"
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 text-center sm:text-left">
            আপনিও এমন সফল ক্যারিয়ার গড়তে চান?
          </span>

          <button
            type="button"
            onClick={() => {
              onSelectCourseForAdmission?.(story.courseName);
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <span>এই কোর্সে ভর্তি হতে আবেদন করুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
