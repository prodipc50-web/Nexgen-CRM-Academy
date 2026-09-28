import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Calculator,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Smartphone,
  Info
} from 'lucide-react';
import { Course } from '../../types';

interface CourseFeeInstallmentCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  initialCourse?: Course | null;
  onProceedAdmission: (course: Course, installmentPlan: string) => void;
}

export const CourseFeeInstallmentCalculatorModal: React.FC<CourseFeeInstallmentCalculatorModalProps> = ({
  isOpen,
  onClose,
  courses,
  initialCourse,
  onProceedAdmission
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourse?.id || courses[0]?.id || ''
  );
  const [installmentOption, setInstallmentOption] = useState<'full' | '2_parts' | '3_parts'>('2_parts');

  // Update selectedCourseId when initialCourse changes
  React.useEffect(() => {
    if (initialCourse?.id) {
      setSelectedCourseId(initialCourse.id);
    } else if (!selectedCourseId && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [initialCourse, courses, selectedCourseId]);

  const selectedCourse = useMemo(() => {
    return courses.find(c => c.id === selectedCourseId) || courses[0];
  }, [courses, selectedCourseId]);

  if (!isOpen || !selectedCourse) return null;

  const totalFee = selectedCourse.offerFee || selectedCourse.regularFee || 0;
  
  // Calculate breakdown
  // Full payment option gets 5% bonus discount
  const fullPaymentDiscount = Math.round(totalFee * 0.05);
  const fullPaymentTotal = totalFee - fullPaymentDiscount;

  // 2 Parts: 50% at admission, 50% at 30 days
  const twoPartDown = Math.round(totalFee * 0.5);
  const twoPartInst1 = totalFee - twoPartDown;

  // 3 Parts: 40% at admission, 30% at 30 days, 30% at 60 days
  const threePartDown = Math.round(totalFee * 0.4);
  const threePartInst1 = Math.round(totalFee * 0.3);
  const threePartInst2 = totalFee - threePartDown - threePartInst1;

  const handleApply = () => {
    const planText = installmentOption === 'full'
      ? `Full Payment with 5% Discount (৳${fullPaymentTotal.toLocaleString()})`
      : installmentOption === '2_parts'
      ? `2 Installments: Admission ৳${twoPartDown.toLocaleString()} + 30 Days ৳${twoPartInst1.toLocaleString()}`
      : `3 Installments: Admission ৳${threePartDown.toLocaleString()} + ৳${threePartInst1.toLocaleString()} + ৳${threePartInst2.toLocaleString()}`;

    onProceedAdmission(selectedCourse, planText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl text-white shadow-2xl overflow-hidden relative my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                সহজ কিস্তি ও ফি ক্যালকুলেটর (Easy EMI)
              </h3>
              <p className="text-xs text-slate-300">
                বিকাশ, নগদ ও ব্যাংকে ০% সুদে সুবিধাজনক কিস্তিতে ভর্তির হিসাব
              </p>
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Select Course Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              কোর্স নির্বাচন করুন:
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.name} — ৳{(c.offerFee || c.regularFee || 0).toLocaleString()} ({c.duration})
                </option>
              ))}
            </select>
          </div>

          {/* Fee Overview Card */}
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">কোর্সের নির্ধারিত ফি:</span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-2xl font-black text-amber-400 font-mono">
                  ৳{totalFee.toLocaleString()}
                </span>
                {selectedCourse.regularFee && selectedCourse.regularFee > totalFee && (
                  <span className="text-xs text-slate-500 line-through font-mono">
                    ৳{selectedCourse.regularFee.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
              ০% হিডেন চার্জ
            </span>
          </div>

          {/* Payment Plan Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">
              আপনার সুবিধাজনক পেমেন্ট অপশন বেছে নিন:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setInstallmentOption('full')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  installmentOption === 'full'
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-xs'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span className="block font-black text-xs sm:text-sm">এককালীন (Full)</span>
                <span className="block text-[10px] text-amber-400 font-bold mt-0.5">৫% অতিরিক্ত ছাড়</span>
              </button>

              <button
                type="button"
                onClick={() => setInstallmentOption('2_parts')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  installmentOption === '2_parts'
                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-xs'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span className="block font-black text-xs sm:text-sm">২টি সহজ কিস্তি</span>
                <span className="block text-[10px] text-indigo-300 font-bold mt-0.5">৫০% + ৫০%</span>
              </button>

              <button
                type="button"
                onClick={() => setInstallmentOption('3_parts')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  installmentOption === '3_parts'
                    ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-xs'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span className="block font-black text-xs sm:text-sm">৩টি সহজ কিস্তি</span>
                <span className="block text-[10px] text-emerald-300 font-bold mt-0.5">৪০% + ৩০% + ৩০%</span>
              </button>
            </div>
          </div>

          {/* Breakdown Display */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block border-b border-slate-800 pb-2">
              পেমেন্ট শিডিউল ব্রেকডাউন:
            </span>

            {installmentOption === 'full' ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>কোর্স ফি:</span>
                  <span className="font-mono">৳{totalFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>এককালীন পেমেন্ট ছাড় (৫%):</span>
                  <span className="font-mono font-bold">- ৳{fullPaymentDiscount.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-black text-amber-400">
                  <span>ভর্তির সময় প্রদেয় সর্বমোট:</span>
                  <span className="font-mono text-base">৳{fullPaymentTotal.toLocaleString()}</span>
                </div>
              </div>
            ) : installmentOption === '2_parts' ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-200">
                  <span className="font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>ভর্তির দিন (Down Payment):</span>
                  </span>
                  <span className="font-black text-amber-400 font-mono text-sm">
                    ৳{twoPartDown.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>১ম কিস্তি (ক্লাস শুরুর ৩০ দিন পর):</span>
                  <span className="font-mono font-bold text-slate-200">৳{twoPartInst1.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>কোনো অতিরিক্ত ভর্তি ফি বা সার্ভিস চার্জ নেই।</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-200">
                  <span className="font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ভর্তির দিন (Down Payment):</span>
                  </span>
                  <span className="font-black text-amber-400 font-mono text-sm">
                    ৳{threePartDown.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>১ম কিস্তি (৩০ দিন পর):</span>
                  <span className="font-mono font-bold text-slate-200">৳{threePartInst1.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>২য় কিস্তি (৬০ দিন পর):</span>
                  <span className="font-mono font-bold text-slate-200">৳{threePartInst2.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Methods Supported */}
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
            <span className="font-bold text-slate-400">অনুমোদিত পেমেন্ট মাধ্যম:</span>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-pink-900/60 text-pink-300 font-bold border border-pink-700/50">bKash</span>
              <span className="px-2 py-0.5 rounded bg-orange-900/60 text-orange-300 font-bold border border-orange-700/50">Nagad</span>
              <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-bold border border-purple-700/50">Rocket</span>
              <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-bold border border-blue-700/50">Cards / Bank</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            বাতিল করুন
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>এই কিস্তিতে অনলাইন ভর্তি ফরম পূরণ করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
