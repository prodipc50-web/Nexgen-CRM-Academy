import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { IdPrefixConfig } from '../../types';
import { DEFAULT_ID_PREFIX_CONFIG } from '../../data/defaultSettingsData';
import {
  Hash,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  FileText,
  CreditCard,
  Award,
  Users,
  Receipt,
  HelpCircle
} from 'lucide-react';

export const IdPrefixSettingsManager: React.FC = () => {
  const { academySettings, updateAcademySettings } = useAcademy();

  const currentConfig: IdPrefixConfig = academySettings.idPrefixConfig || DEFAULT_ID_PREFIX_CONFIG;

  const [formData, setFormData] = useState<IdPrefixConfig>({
    studentPrefix: currentConfig.studentPrefix || 'NCA-{YEAR}-',
    admissionPrefix: currentConfig.admissionPrefix || 'NCA-ADM-',
    receiptPrefix: currentConfig.receiptPrefix || 'MR-26-',
    certificatePrefix: currentConfig.certificatePrefix || 'CERT-NCA-',
    batchPrefix: currentConfig.batchPrefix || 'NCA-B-',
    expensePrefix: currentConfig.expensePrefix || 'NCA-EXP-',
    digitPadding: currentConfig.digitPadding || 3,
    includeYearToken: currentConfig.includeYearToken ?? true
  });

  const [savedToast, setSavedToast] = useState(false);

  const currentYear = new Date().getFullYear().toString();

  const formatSample = (prefix: string, sampleNum: number = 1) => {
    const resolved = prefix.replace('{YEAR}', currentYear).replace('{YY}', currentYear.slice(-2));
    return `${resolved}${String(sampleNum).padStart(formData.digitPadding, '0')}`;
  };

  const handleSave = () => {
    updateAcademySettings({
      idPrefixConfig: formData
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('আপনি কি ডিফল্ট প্রিফিক্স ফরম্যাটে ফিরে যেতে চান?')) {
      setFormData(DEFAULT_ID_PREFIX_CONFIG);
      updateAcademySettings({
        idPrefixConfig: DEFAULT_ID_PREFIX_CONFIG
      });
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Hash className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-black tracking-wide">
              স্টুডেন্ট আইডি ও ভাউচার প্রিফিক্স ফরম্যাট ম্যানেজার
            </h3>
            <span className="text-[11px] bg-indigo-500/30 text-indigo-200 font-bold px-2 py-0.5 rounded-full border border-indigo-400/30">
              ID Sequence Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            স্টুডেন্ট রোল নম্বর, মানি রিসিট, ভর্তি ফরম, সার্টিফিকেট ও ব্যাচের স্বয়ংক্রিয় নম্বর জেনারেশন ফরম্যাট এখান থেকে কাস্টমাইজ করুন।
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>রিসেট ডিফল্ট</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-2xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>আইডি ও ভাউচার প্রিফিক্স সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!</span>
        </div>
      )}

      {/* Live Generator Preview Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-800 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>লাইভ স্যাম্পল প্রিভিউ (পরবর্তী জেনারেটেড আইডি সমূহ)</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">
            Active Year: <strong className="text-slate-700">{currentYear}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
            <div className="flex items-center space-x-1 text-indigo-700 text-[11px] font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Student ID</span>
            </div>
            <p className="text-xs font-mono font-black text-indigo-950 mt-1 truncate">
              {formatSample(formData.studentPrefix, 1)}
            </p>
          </div>

          <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl">
            <div className="flex items-center space-x-1 text-teal-700 text-[11px] font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>Admission No</span>
            </div>
            <p className="text-xs font-mono font-black text-teal-950 mt-1 truncate">
              {formatSample(formData.admissionPrefix, 1)}
            </p>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
            <div className="flex items-center space-x-1 text-emerald-700 text-[11px] font-bold">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Money Receipt</span>
            </div>
            <p className="text-xs font-mono font-black text-emerald-950 mt-1 truncate">
              {formatSample(formData.receiptPrefix, 1)}
            </p>
          </div>

          <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
            <div className="flex items-center space-x-1 text-amber-700 text-[11px] font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Certificate No</span>
            </div>
            <p className="text-xs font-mono font-black text-amber-950 mt-1 truncate">
              {formatSample(formData.certificatePrefix, 1)}
            </p>
          </div>

          <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
            <div className="flex items-center space-x-1 text-purple-700 text-[11px] font-bold">
              <Hash className="w-3.5 h-3.5" />
              <span>Batch Code</span>
            </div>
            <p className="text-xs font-mono font-black text-purple-950 mt-1 truncate">
              {formatSample(formData.batchPrefix, 1)}
            </p>
          </div>

          <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl">
            <div className="flex items-center space-x-1 text-rose-700 text-[11px] font-bold">
              <Receipt className="w-3.5 h-3.5" />
              <span>Expense Voucher</span>
            </div>
            <p className="text-xs font-mono font-black text-rose-950 mt-1 truncate">
              {formatSample(formData.expensePrefix, 1)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Prefix Configuration Fields */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
        <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
          প্রিফিক্স ও ক্রমিক সংখ্যা কনফিগারেশন
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Student ID */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center justify-between">
              <span>স্টুডেন্ট আইডি প্রিফিক্স (Student ID)</span>
              <span className="text-[10px] text-slate-400 font-mono">Token: &#123;YEAR&#125;</span>
            </label>
            <input
              type="text"
              value={formData.studentPrefix}
              onChange={e => setFormData({ ...formData, studentPrefix: e.target.value })}
              placeholder="e.g. NCA-{YEAR}-"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:bg-white focus:border-indigo-500 outline-none"
            />
            <p className="text-[11px] text-slate-500">
              যেমন: <strong className="text-slate-700 font-mono">{formatSample(formData.studentPrefix, 45)}</strong>
            </p>
          </div>

          {/* Admission Form */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">
              ভর্তি ফরম প্রিফিক্স (Admission No)
            </label>
            <input
              type="text"
              value={formData.admissionPrefix}
              onChange={e => setFormData({ ...formData, admissionPrefix: e.target.value })}
              placeholder="e.g. NCA-ADM-"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:bg-white focus:border-indigo-500 outline-none"
            />
            <p className="text-[11px] text-slate-500">
              যেমন: <strong className="text-slate-700 font-mono">{formatSample(formData.admissionPrefix, 12)}</strong>
            </p>
          </div>

          {/* Money Receipt */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">
              মানি রিসিট প্রিফিক্স (Money Receipt No)
            </label>
            <input
              type="text"
              value={formData.receiptPrefix}
              onChange={e => setFormData({ ...formData, receiptPrefix: e.target.value })}
              placeholder="e.g. MR-26-"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:bg-white focus:border-indigo-500 outline-none"
            />
            <p className="text-[11px] text-slate-500">
              যেমন: <strong className="text-slate-700 font-mono">{formatSample(formData.receiptPrefix, 8)}</strong>
            </p>
          </div>

          {/* Certificate No */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">
              সার্টিফিকেট নম্বর প্রিফিক্স (Certificate ID)
            </label>
            <input
              type="text"
              value={formData.certificatePrefix}
              onChange={e => setFormData({ ...formData, certificatePrefix: e.target.value })}
              placeholder="e.g. CERT-NCA-"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:bg-white focus:border-indigo-500 outline-none"
            />
            <p className="text-[11px] text-slate-500">
              যেমন: <strong className="text-slate-700 font-mono">{formatSample(formData.certificatePrefix, 105)}</strong>
            </p>
          </div>

          {/* Batch Code */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">
              ব্যাচ কোড প্রিফিক্স (Batch Code)
            </label>
            <input
              type="text"
              value={formData.batchPrefix}
              onChange={e => setFormData({ ...formData, batchPrefix: e.target.value })}
              placeholder="e.g. NCA-B-"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:bg-white focus:border-indigo-500 outline-none"
            />
            <p className="text-[11px] text-slate-500">
              যেমন: <strong className="text-slate-700 font-mono">{formatSample(formData.batchPrefix, 24)}</strong>
            </p>
          </div>

          {/* Expense Voucher */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">
              অফিস খরচ ভাউচার প্রিফিক্স (Expense Voucher)
            </label>
            <input
              type="text"
              value={formData.expensePrefix}
              onChange={e => setFormData({ ...formData, expensePrefix: e.target.value })}
              placeholder="e.g. NCA-EXP-"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:bg-white focus:border-indigo-500 outline-none"
            />
            <p className="text-[11px] text-slate-500">
              যেমন: <strong className="text-slate-700 font-mono">{formatSample(formData.expensePrefix, 3)}</strong>
            </p>
          </div>
        </div>

        {/* Digit Padding and Year Token Helper */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700">
              সংখ্যা প্যাডিং (Digit Padding)
            </label>
            <div className="flex items-center space-x-3">
              {[3, 4, 5].map(digits => (
                <label
                  key={digits}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center space-x-1.5 ${
                    formData.digitPadding === digits
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="digitPadding"
                    checked={formData.digitPadding === digits}
                    onChange={() => setFormData({ ...formData, digitPadding: digits })}
                    className="hidden"
                  />
                  <span>{digits} Digits ({'0'.repeat(digits - 1)}1)</span>
                </label>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              ৩ ডিজিট হলে 001 থেকে শুরু হবে, ৪ ডিজিট হলে 0001 থেকে শুরু হবে।
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>ডায়নামিক বছর টোকেন টিপস</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              প্রিফিক্সের ভেতরে <code className="bg-white px-1.5 py-0.5 rounded border text-indigo-700 font-mono">&#123;YEAR&#125;</code> লিখলে স্বয়ংক্রিয়ভাবে বর্তমান বছর ({currentYear}) বসে যাবে এবং <code className="bg-white px-1.5 py-0.5 rounded border text-indigo-700 font-mono">&#123;YY&#125;</code> লিখলে দুই সংখ্যার বছর ({currentYear.slice(-2)}) বসবে।
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>প্রিফিক্স সেটিংস সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
