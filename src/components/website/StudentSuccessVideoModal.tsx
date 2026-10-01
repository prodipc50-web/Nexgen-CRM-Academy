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
  isActive?: boolean;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl text-slate-900 shadow-2xl overflow-hidden relative my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={story.avatarUrl}
              alt={story.studentName}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-slate-950">{story.studentName}</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[10px] font-bold">
                  {story.achievementBadge || 'সফল শিক্ষার্থী'}
                </span>
              </div>
              <p className="text-xs text-indigo-700 font-bold">{story.courseName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-slate-900">
          {story.videoEmbedUrl ? (
            <iframe
              src={story.videoEmbedUrl}
              title={`${story.studentName} Success Story`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-3 bg-slate-100 p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Play className="w-8 h-8 ml-1" />
              </div>
              <p className="text-xs text-slate-600 max-w-sm">
                "{story.quote}"
              </p>
            </div>
          )}
        </div>

        {/* Details and Story */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-medium">কর্মসংস্থান / প্ল্যাটফর্ম:</span>
              <span className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 block truncate">
                {story.companyOrPlatform}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-medium">মাসিক আয় / স্যালারি:</span>
              <span className="text-xs sm:text-sm font-black text-emerald-700 mt-0.5 block font-mono">
                {story.monthlyIncomeOrPackage}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 block font-medium">ব্যাচ নম্বর:</span>
              <span className="text-xs sm:text-sm font-bold text-indigo-700 mt-0.5 block">
                {story.batchNo || 'Batch 2024-25'}
              </span>
            </div>
          </div>

          {/* Full Story Summary */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">সফলতার গল্প:</h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {story.storySummary}
            </p>
          </div>

          {/* Student Quote */}
          <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200/80 text-xs italic text-indigo-900 leading-relaxed">
            "{story.quote}"
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-600 text-center sm:text-left">
            আপনিও এমন সফল ক্যারিয়ার গড়তে চান?
          </span>

          <button
            type="button"
            onClick={() => {
              onSelectCourseForAdmission?.(story.courseName);
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <span>এই কোর্সে ভর্তি হতে আবেদন করুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
