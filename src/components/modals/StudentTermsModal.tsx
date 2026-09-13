import React from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileText,
  CreditCard,
  BookOpen,
  RotateCcw,
  Calendar,
  Award,
  Bot,
  Monitor,
  Compass,
  Camera,
  Download
} from 'lucide-react';
import { NexgenLogo } from '../common/NexgenLogo';
import { executeCleanPrint } from '../../utils/printHelper';
import {
  STUDENT_TERMS_AND_CONDITIONS,
  STUDENT_DECLARATION_TEXT,
  STUDENT_TERMS_HEADER_SUBTITLE,
  STUDENT_TERMS_NOTICE,
  StudentTermClause
} from '../../data/studentTerms';

interface StudentTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  studentCode?: string;
  courseName?: string;
  batchNumber?: string;
  dateStr?: string;
  onAccept?: () => void;
  isAccepted?: boolean;
  terms?: StudentTermClause[];
  declarationText?: string;
}

const getClauseIcon = (iconName: StudentTermClause['iconName']) => {
  const iconProps = { className: 'w-4 h-4 text-white shrink-0' };
  switch (iconName) {
    case 'credit-card':
      return <CreditCard {...iconProps} />;
    case 'book-open':
      return <BookOpen {...iconProps} />;
    case 'rotate-ccw':
      return <RotateCcw {...iconProps} />;
    case 'calendar':
      return <Calendar {...iconProps} />;
    case 'award':
      return <Award {...iconProps} />;
    case 'file-text':
      return <FileText {...iconProps} />;
    case 'bot':
      return <Bot {...iconProps} />;
    case 'monitor':
      return <Monitor {...iconProps} />;
    case 'compass':
      return <Compass {...iconProps} />;
    case 'camera':
      return <Camera {...iconProps} />;
    default:
      return <ShieldCheck {...iconProps} />;
  }
};

export const StudentTermsModal: React.FC<StudentTermsModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentCode,
  courseName,
  batchNumber,
  dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  onAccept,
  isAccepted = false,
  terms,
  declarationText
}) => {
  const { academySettings } = useAcademy();

  if (!isOpen) return null;

  const effectiveTerms = (terms || academySettings?.studentTerms || STUDENT_TERMS_AND_CONDITIONS).filter(
    t => t.isActive !== false
  );
  const effectiveDeclaration = declarationText || academySettings?.studentTermsDeclaration || STUDENT_DECLARATION_TEXT;

  const handlePrint = () => {
    executeCleanPrint({
      documentTitle: `Student_Terms_And_Conditions_${(studentName || 'Student').replace(/\s+/g, '_')}`,
      size: 'a4',
      orientation: 'portrait',
      margin: '5mm'
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[95vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white flex items-center space-x-2">
                <span>Student Terms & Conditions (শিক্ষার্থীদের নিয়মাবলী)</span>
              </h3>
              <p className="text-xs text-slate-400">
                অফিসিয়াল ভর্তি চুক্তি, আচরণবিধি ও একাডেমিক নীতিমালা
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন (Print A4)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable & Interactive Document Container */}
        <div
          id="student-terms-official-sheet"
          className="overflow-y-auto p-4 sm:p-8 bg-white text-slate-900 font-sans print:p-6 print:m-0 print-page-a4"
        >
          {/* Header Section */}
          <div className="border-b-2 border-teal-900 pb-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-teal-900 text-white flex items-center justify-center font-black text-xl tracking-tighter shrink-0">
                  NG
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-teal-950 uppercase tracking-tight leading-none">
                    NexGen Computer Academy
                  </h1>
                  <p className="text-[11px] text-slate-600 font-bold tracking-wide mt-1">
                    {STUDENT_TERMS_HEADER_SUBTITLE}
                  </p>
                </div>
              </div>

              <div className="text-right hidden sm:block print:block">
                <div className="bg-teal-900 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-wider inline-block">
                  Official Terms & Conditions
                </div>
                <p className="text-[10px] text-slate-500 font-semibold mt-1">
                  Document Version 2.6 • Effective 2026
                </p>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="text-base sm:text-lg font-black text-teal-950 tracking-tight uppercase">
                STUDENT TERMS & CONDITIONS
              </h2>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full inline-block self-start sm:self-auto">
                {STUDENT_TERMS_NOTICE}
              </span>
            </div>

            {/* Student Metadata Tag if provided */}
            {(studentName || courseName || studentCode) && (
              <div className="mt-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Student Name:</span>
                  <span className="font-bold text-slate-900">{studentName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Student ID:</span>
                  <span className="font-mono font-bold text-teal-900">{studentCode || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Course:</span>
                  <span className="font-bold text-slate-800">{courseName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Batch / Date:</span>
                  <span className="font-semibold text-slate-800">{batchNumber || dateStr}</span>
                </div>
              </div>
            )}
          </div>

          {/* Clauses Grid Layout (Matching PDF 2-column aesthetic) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            {effectiveTerms.map(item => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:border-teal-300 transition-colors flex flex-col"
              >
                {/* Clause Header Ribbon */}
                <div className="bg-teal-900 text-white px-3 py-1.5 flex items-center space-x-2 shrink-0">
                  <div className="w-5 h-5 rounded-md bg-teal-800/80 flex items-center justify-center shrink-0">
                    {getClauseIcon(item.iconName)}
                  </div>
                  <div className="flex-1 flex items-baseline justify-between">
                    <span className="font-black text-xs tracking-tight">
                      {item.numberBn}. {item.titleEn}
                    </span>
                    <span className="text-[10px] text-teal-200 font-medium">
                      ({item.titleBn})
                    </span>
                  </div>
                </div>

                {/* Clause Content Body */}
                <div className="p-3 text-[11px] leading-relaxed text-slate-700 flex-1 flex flex-col justify-between bg-slate-50/30">
                  <p className="font-medium text-slate-800">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Student Declaration Checkbox Section */}
          <div className="mt-5 border-2 border-teal-900/30 bg-teal-50/40 rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="termsDeclarationCheckbox"
                checked={isAccepted}
                onChange={() => onAccept && onAccept()}
                className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
              />
              <label htmlFor="termsDeclarationCheckbox" className="cursor-pointer select-none">
                <span className="font-bold text-xs sm:text-sm text-teal-950 block leading-snug">
                  {effectiveDeclaration}
                </span>
                <span className="text-[11px] text-teal-800 mt-1 block">
                  ভর্তি চূড়ান্ত করার মাধ্যমে শিক্ষার্থী এই শর্তাবলী মেনে চলার আনুষ্ঠানিক প্রতিশ্রুতি দিচ্ছেন।
                </span>
              </label>
            </div>
          </div>

          {/* Dual Signatures Section */}
          <div className="pt-8 sm:pt-10 mt-6 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="h-8 border-b-2 border-slate-400 w-48 sm:w-60 mx-auto mb-1 flex items-end justify-center pb-0.5">
                {studentName && (
                  <span className="text-xs font-serif italic text-slate-800">{studentName}</span>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-800 uppercase block">
                Student Signature & Date
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">শিক্ষার্থীর স্বাক্ষর ও তারিখ</p>
            </div>

            <div>
              <div className="h-8 border-b-2 border-teal-900 w-48 sm:w-60 mx-auto mb-1 flex items-end justify-center pb-0.5">
                <span className="text-xs font-serif italic font-bold text-teal-950">
                  Authorized Signatory
                </span>
              </div>
              <span className="text-[11px] font-black text-teal-950 uppercase block">
                Authorized Signature — NexGen Computer Academy
              </span>
              <p className="text-[10px] text-teal-700 font-semibold mt-0.5">কর্তৃপক্ষের স্বাক্ষর ও অফিসিয়াল সিল</p>
            </div>
          </div>

          {/* Printable Footer */}
          <div className="mt-6 pt-2 border-t border-slate-200 text-center text-[10px] text-slate-400">
            NexGen Computer Academy • 14/B Garden Road, Farmgate, Dhaka-1215 • Web: nexgenacademy.edu.bd
          </div>
        </div>

        {/* Modal Bottom Action Footer (Hidden when printing) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            বন্ধ করুন (Close)
          </button>

          <div className="flex items-center space-x-2">
            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className={`px-4 py-2 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isAccepted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAccepted ? 'সম্মতি প্রদান করা হয়েছে ✓' : 'শর্তাবলী মেনে সম্মতি দিন'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-teal-300" />
              <span>A4 প্রিন্ট (Print Sheet)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
