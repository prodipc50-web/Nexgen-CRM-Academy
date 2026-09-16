import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { InstallmentFeeRules } from '../../types';
import { DEFAULT_INSTALLMENT_FEE_RULES } from '../../data/defaultSettingsData';
import {
  Coins,
  BellRing,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  CalendarDays
} from 'lucide-react';

export const InstallmentDueRulesManager: React.FC = () => {
  const { academySettings, updateAcademySettings } = useAcademy();

  const currentRules: InstallmentFeeRules =
    academySettings.feeRules || DEFAULT_INSTALLMENT_FEE_RULES;

  const [formData, setFormData] = useState<InstallmentFeeRules>({
    defaultInstallmentCount: currentRules.defaultInstallmentCount || 2,
    reminderNoticeDaysBefore: currentRules.reminderNoticeDaysBefore || 3,
    overdueAlertIntervalDays: currentRules.overdueAlertIntervalDays || [1, 3, 7],
    lateFeePenaltyEnabled: currentRules.lateFeePenaltyEnabled ?? false,
    lateFeeAmount: currentRules.lateFeeAmount || 200,
    gracePeriodDays: currentRules.gracePeriodDays || 5,
    strictAdmissionFreezeAfterDays: currentRules.strictAdmissionFreezeAfterDays || 15
  });

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    updateAcademySettings({
      feeRules: formData
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('আপনি কি ডিফল্ট ফি কিস্তি ও জরিমানা রুলসে ফিরে যেতে চান?')) {
      setFormData(DEFAULT_INSTALLMENT_FEE_RULES);
      updateAcademySettings({
        feeRules: DEFAULT_INSTALLMENT_FEE_RULES
      });
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black tracking-wide">
              ফি আদায়, কিস্তি ও বকেয়া রিমাইন্ডার রুলস
            </h3>
            <span className="text-[11px] bg-emerald-500/30 text-emerald-200 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
              Accounts Policy Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            কোর্স ফি কিস্তির সংখ্যা, বকেয়া পরিশোধের নোটিশের সময়সীমা, বিলম্ব ফি (Late Fee Penalty) এবং গ্রেস পিরিয়ডের নিয়মাবলি কনফিগার করুন।
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>রিসেট ডিফল্ট</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-2xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>কিস্তি ও ফি আদায় সংক্রান্ত পলিসি সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      {/* Live Simulation Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
        <h4 className="text-xs font-black text-slate-800 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>লাইভ কিস্তি পলিসি সিমুলেশন (উদাহরণ: ৳১২,০০০ ফি কোর্স)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1">
            <div className="text-emerald-800 font-bold text-xs flex items-center space-x-1">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>কিস্তির সুপারিশ</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              ডিফল্ট <strong>{formData.defaultInstallmentCount} টি কিস্তি</strong> (প্রতিটি ৳{Math.round(12000 / formData.defaultInstallmentCount).toLocaleString()} টাকা)।
            </p>
          </div>

          <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-xl space-y-1">
            <div className="text-sky-800 font-bold text-xs flex items-center space-x-1">
              <BellRing className="w-3.5 h-3.5" />
              <span>অগ্রিম নোটিশ</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              কিস্তির তারিখের <strong>{formData.reminderNoticeDaysBefore} দিন পূর্বে</strong> স্বয়ংক্রিয় রিমাইন্ডার পাঠানোর সুপারিশ।
            </p>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl space-y-1">
            <div className="text-amber-800 font-bold text-xs flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>বিলম্ব ফি পলিসি</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              {formData.lateFeePenaltyEnabled ? (
                <span>
                  <strong>{formData.gracePeriodDays} দিন</strong> গ্রেস পিরিয়ড পর <strong>৳{formData.lateFeeAmount}</strong> বিলম্ব ফি যুক্ত হবে।
                </span>
              ) : (
                <span className="text-slate-500">
                  বিলম্ব ফি পেনাল্টি বর্তমানে <strong>নিষ্ক্রিয়</strong> (কোন অতিরিক্ত ফি প্রযোজ্য নয়)।
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
        <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
          কিস্তি ও ফি আদায় রুলস কনফিগারেশন
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Default Installment Count */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">
              ডিফল্ট কিস্তির সংখ্যা (Default Installments)
            </label>
            <select
              value={formData.defaultInstallmentCount}
              onChange={e => setFormData({ ...formData, defaultInstallmentCount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:border-emerald-600"
            >
              <option value="1">১ কিস্তি (Full Payment)</option>
              <option value="2">২ কিস্তি (50% + 50%)</option>
              <option value="3">৩ কিস্তি (সমান ৩ ভাগ)</option>
              <option value="4">৪ কিস্তি (ত্রৈমাসিক কিস্তি)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              নতুন ভর্তির সময় কোর্স ফি স্বয়ংক্রিয়ভাবে এতটি কিস্তিতে সাজানো হবে।
            </p>
          </div>

          {/* Reminder Notice Days */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">
              কিস্তির কতদিন পূর্বে নোটিশ পাঠানো হবে?
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="15"
                value={formData.reminderNoticeDaysBefore}
                onChange={e => setFormData({ ...formData, reminderNoticeDaysBefore: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:border-emerald-600"
              />
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">দিন পূর্বে</span>
            </div>
            <p className="text-[11px] text-slate-500">
              বকেয়া তালিকা ও রিমাইন্ডারে এই সময়ের শিক্ষার্থীদের তালিকায় দেখানো হবে।
            </p>
          </div>

          {/* Grace Period */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">
              গ্রেস পিরিয়ড (Grace Period)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="30"
                value={formData.gracePeriodDays}
                onChange={e => setFormData({ ...formData, gracePeriodDays: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:border-emerald-600"
              />
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">দিন</span>
            </div>
            <p className="text-[11px] text-slate-500">
              কিস্তির তারিখ পার হলেও এত দিন পর্যন্ত কোনো পেনাল্টি বা কঠোর পদক্ষেপ কার্যকর হবে না।
            </p>
          </div>

          {/* Late Fee Enabled Toggle */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">
              বিলম্ব ফি পেনাল্টি চালু করবেন?
            </label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, lateFeePenaltyEnabled: !formData.lateFeePenaltyEnabled })}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                formData.lateFeePenaltyEnabled
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                  : 'bg-slate-50 border-slate-300 text-slate-600'
              }`}
            >
              <span>{formData.lateFeePenaltyEnabled ? 'পেনাল্টি সক্রিয় (Active)' : 'পেনাল্টি বন্ধ (Inactive)'}</span>
              {formData.lateFeePenaltyEnabled ? (
                <ToggleRight className="w-5 h-5 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-slate-400" />
              )}
            </button>
            <p className="text-[11px] text-slate-500">
              গ্রেস পিরিয়ড পার হলে বকেয়া রসিদে স্বয়ংক্রিয়ভাবে নির্ধারিত ফি যোগ হবে।
            </p>
          </div>

          {/* Late Fee Amount */}
          {formData.lateFeePenaltyEnabled && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                বিলম্ব ফির পরিমাণ (টাকা)
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500">৳</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={formData.lateFeeAmount}
                  onChange={e => setFormData({ ...formData, lateFeeAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:border-emerald-600"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                নির্ধারিত সময়ের পর এককালীন বিলম্ব জরিমানা।
              </p>
            </div>
          )}

          {/* Strict Suspension Threshold */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>অ্যাডমিশন স্থগিত / কঠোর সতর্কতা সীমা</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="5"
                max="60"
                value={formData.strictAdmissionFreezeAfterDays || 15}
                onChange={e =>
                  setFormData({
                    ...formData,
                    strictAdmissionFreezeAfterDays: Number(e.target.value)
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:border-rose-600"
              />
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">দিন অতিবাহিত</span>
            </div>
            <p className="text-[11px] text-slate-500">
              বকেয়া তারিখের এত দিন অতিবাহিত হলে ড্যাশবোর্ডে ক্রিটিক্যাল লাল অ্যালার্ট উঠবে।
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ফি রুলস সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
