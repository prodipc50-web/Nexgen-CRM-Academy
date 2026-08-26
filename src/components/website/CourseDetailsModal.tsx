import React from 'react';
import { X, BookOpen, Clock, Calendar, CheckCircle2, Award, Briefcase, Users, Layers, GraduationCap, Phone } from 'lucide-react';
import { Course } from '../../types';

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onOpenEnroll: (course: Course) => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  isOpen,
  onClose,
  course,
  onOpenEnroll
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl border border-slate-100 space-y-5 text-slate-800 my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {course.category || 'Professional IT Course'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Course Code: {course.code}
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-tight">
              {course.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-5 text-xs">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="space-y-0.5">
              <span className="text-slate-500 text-[11px] block flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Duration</span>
              </span>
              <span className="font-black text-slate-900 text-sm">{course.duration}</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-500 text-[11px] block flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Total Classes</span>
              </span>
              <span className="font-black text-slate-900 text-sm">{course.totalClasses || 36} Sessions</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-500 text-[11px] block flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Certification</span>
              </span>
              <span className="font-black text-emerald-700 text-sm">Govt. Verified</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-500 text-[11px] block flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-rose-600" />
                <span>Course Fee</span>
              </span>
              <span className="font-black text-indigo-700 text-sm">৳{(course.offerFee || course.regularFee || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="font-black text-slate-900 text-sm">Course Overview & Objectives</h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              {course.description ||
                'This hands-on professional course is tailored to take students from core foundational fundamentals to advanced real-world project development with portfolio creation and client readiness.'}
            </p>
          </div>

          {/* Syllabus Modules */}
          {course.modules && course.modules.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-black text-slate-900 text-sm flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Detailed Syllabus & Practical Curriculum ({course.modules.length} Modules)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {course.modules.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-700 text-[11px]">Module {idx + 1}</span>
                      {m.estimatedClasses && (
                        <span className="text-[10px] text-slate-400 font-mono">{m.estimatedClasses} Classes</span>
                      )}
                    </div>
                    <h5 className="font-black text-slate-800 text-xs">{m.moduleName}</h5>
                    {m.moduleDescription && <p className="text-[11px] text-slate-500">{m.moduleDescription}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights Grid */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-2">
            <h4 className="font-black text-amber-950 text-xs flex items-center space-x-1.5">
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span>Career Opportunities & Placement Support</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-amber-900">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Live Marketplace (Fiverr & Upwork) Account Setup Guidance</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Direct Internship and Corporate Job Interview Referrals</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Free Lab Access with High-Performance PC Stations</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Lifetime Problem Solving & Project Review Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <Phone className="w-3.5 h-3.5 text-indigo-600" />
            <span>Admission Hotline: <strong>01798444444</strong></span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenEnroll(course);
              }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-md transition-all inline-flex items-center space-x-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Enroll / Book Seat (৳{(course.offerFee || course.regularFee || 0).toLocaleString()})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
