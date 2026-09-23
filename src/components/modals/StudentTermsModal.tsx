import React from 'react';
import { createPortal } from 'react-dom';
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

  const instituteName = academySettings?.instituteName || 'NexGen Computer Academy';
  const campusName = academySettings?.campusName || 'Farmgate Campus';
  const officialAddress = academySettings?.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215';
  const hotline = academySettings?.primarySupportPhone || academySettings?.helplines?.[0] || '01798444444';
  const website = academySettings?.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : 'nexgenacademy.edu.bd';
  const signatoryName = academySettings?.idCardSignatoryName || 'Authorized Signatory';

  const handlePrint = () => {
    executeCleanPrint({
      documentTitle: `Student_Terms_And_Conditions_${(studentName || 'Student').replace(/\s+/g, '_')}`,
      size: 'a4',
      orientation: 'portrait',
      margin: '4mm'
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto print:static print:p-0 print:m-0 print:bg-white print:overflow-visible"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[95vh] animate-in zoom-in-95 duration-150 print:max-w-none print:w-full print:h-auto print:max-h-none print:shadow-none print:border-none print:rounded-none print:overflow-visible"
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
          className="overflow-y-auto p-4 sm:p-8 bg-white text-slate-900 font-sans print:p-0 print:m-0 print-page-a4"
        >
          {/* Header Section */}
          <div className="border-b-2 border-teal-900 pb-2.5 print:pb-1.5 mb-3 print:mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <NexgenLogo variant="crest" size={44} />
                <div>
                  <h1 className="text-xl sm:text-2xl print:text-lg font-black text-teal-950 uppercase tracking-tight leading-none">
                    {instituteName}
                  </h1>
                  <p className="text-[11px] print:text-[8px] text-slate-600 font-bold tracking-wide mt-0.5">
                    {STUDENT_TERMS_HEADER_SUBTITLE}
                  </p>
                  <p className="text-[9.5px] print:text-[7.5px] text-slate-500 font-medium">
                    {campusName}: {officialAddress} | Hotline: <strong className="font-mono text-slate-900">{hotline}</strong> | {website}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="bg-teal-900 text-white text-[9.5px] print:text-[8px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider inline-block">
                  Official Terms & Conditions
                </div>
                <p className="text-[9px] print:text-[7.5px] text-slate-500 font-semibold mt-0.5">
                  Academic Session 2026
                </p>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="mt-2 pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 print:flex-row print:items-center">
              <h2 className="text-sm sm:text-base print:text-xs font-black text-teal-950 tracking-tight uppercase">
                STUDENT TERMS & CONDITIONS (ছাত্র আচরণবিধি ও নীতিমালা)
              </h2>
              <span className="text-[10px] print:text-[8px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full inline-block self-start sm:self-auto">
                {STUDENT_TERMS_NOTICE}
              </span>
            </div>

            {/* Student Metadata Tag if provided */}
            {(studentName || courseName || studentCode) && (
              <div className="mt-2 bg-slate-50 print:bg-white p-2 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-1.5 text-xs print:text-[8.5px]">
                <div>
                  <span className="text-slate-500 text-[10px] print:text-[7.5px] block">Student Name:</span>
                  <span className="font-bold text-slate-900">{studentName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] print:text-[7.5px] block">Student ID:</span>
                  <span className="font-mono font-bold text-teal-900">{studentCode || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] print:text-[7.5px] block">Course:</span>
                  <span className="font-bold text-slate-800">{courseName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] print:text-[7.5px] block">Batch / Date:</span>
                  <span className="font-semibold text-slate-800">{batchNumber || dateStr}</span>
                </div>
              </div>
            )}
          </div>

          {/* Clauses Grid Layout (2-Column Compact Layout for Print) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2 print:gap-1.5 text-xs print:text-[8px] print:leading-tight">
            {effectiveTerms.map(item => (
              <div
                key={item.id}
                className="border border-slate-200 print:border-slate-300 rounded-xl print:rounded-md overflow-hidden bg-white shadow-2xs print:shadow-none flex flex-col justify-between"
              >
                {/* Clause Header Ribbon */}
                <div className="bg-teal-900 text-white px-2.5 py-1 print:px-1.5 print:py-0.5 flex items-center space-x-1.5 shrink-0">
                  <div className="w-4 h-4 rounded-md bg-teal-800/80 flex items-center justify-center shrink-0">
                    {getClauseIcon(item.iconName)}
                  </div>
                  <div className="flex-1 flex items-baseline justify-between">
                    <span className="font-black text-xs print:text-[8.5px] tracking-tight">
                      {item.numberBn}. {item.titleEn}
                    </span>
                    <span className="text-[10px] print:text-[7.5px] text-teal-200 font-medium">
                      ({item.titleBn})
                    </span>
                  </div>
                </div>

                {/* Clause Content Body */}
                <div className="p-2.5 print:p-1.5 text-[11px] print:text-[8px] leading-relaxed print:leading-snug text-slate-700 flex-1 flex flex-col justify-between bg-slate-50/30 print:bg-white">
                  <p className="font-medium text-slate-800">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Student Declaration Section */}
          <div className="mt-3 print:mt-1.5 border border-teal-900/30 print:border-teal-900/50 bg-teal-50/40 rounded-xl print:rounded-lg p-2.5 print:p-1.5">
            <div className="flex items-start space-x-2.5">
              <input
                type="checkbox"
                id="termsDeclarationCheckbox"
                checked={isAccepted}
                onChange={() => onAccept && onAccept()}
                className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer print:hidden"
              />
              <div className="hidden print:flex w-3.5 h-3.5 border-2 border-teal-900 rounded bg-white items-center justify-center shrink-0 mt-0.5">
                <span className="text-teal-900 text-[9px] font-black leading-none">✓</span>
              </div>
              <label htmlFor="termsDeclarationCheckbox" className="cursor-pointer select-none">
                <span className="font-bold text-xs print:text-[8px] text-teal-950 block leading-snug">
                  {effectiveDeclaration}
                </span>
                <span className="text-[10px] print:text-[7px] text-teal-800 mt-0.5 block">
                  ভর্তি চূড়ান্ত করার মাধ্যমে শিক্ষার্থী এই শর্তাবলী মেনে চলার আনুষ্ঠানিক প্রতিশ্রুতি দিচ্ছেন।
                </span>
              </label>
            </div>
          </div>

          {/* Dual Signatures Section */}
          <div className="pt-4 print:pt-2 mt-3 print:mt-1 border-t border-slate-300 grid grid-cols-2 gap-8 print:gap-4 text-center text-xs print:text-[8.5px]">
            <div>
              <div className="h-6 print:h-5 border-b border-slate-400 w-44 mx-auto mb-1 flex items-end justify-center pb-0.5">
                {studentName && (
                  <span className="text-xs print:text-[9px] font-serif italic text-slate-800">{studentName}</span>
                )}
              </div>
              <span className="text-[10px] print:text-[8px] font-bold text-slate-800 uppercase block">
                Student Signature & Date
              </span>
              <p className="text-[9px] print:text-[7px] text-slate-400">শিক্ষার্থীর স্বাক্ষর ও তারিখ ({dateStr})</p>
            </div>

            <div>
              <div className="h-6 print:h-5 border-b border-teal-900 w-48 mx-auto mb-1 flex items-end justify-center pb-0.5">
                <span className="text-xs print:text-[9px] font-serif italic font-bold text-teal-950">
                  {signatoryName}
                </span>
              </div>
              <span className="text-[10px] print:text-[8px] font-black text-teal-950 uppercase block">
                Authorized Signature — {instituteName}
              </span>
              <p className="text-[9px] print:text-[7px] text-teal-700 font-semibold">কর্তৃপক্ষের স্বাক্ষর ও অফিসিয়াল সিল</p>
            </div>
          </div>

          {/* Printable Footer */}
          <div className="mt-3 print:mt-1 pt-1 border-t border-slate-200 text-center text-[9px] print:text-[7.5px] text-slate-400">
            {instituteName} • {campusName}: {officialAddress} • Hotline: {hotline} • Web: {website}
          </div>
        </div>

        {/* Modal Bottom Action Footer (Hidden when printing) */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 print:hidden">
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
    </div>,
    document.body
  );
};
