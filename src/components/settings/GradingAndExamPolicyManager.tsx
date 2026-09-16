import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { ExamPolicyConfig, GradingRule } from '../../types';
import { DEFAULT_EXAM_POLICY_CONFIG } from '../../data/defaultSettingsData';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Save,
  RotateCcw,
  ShieldCheck,
  Percent,
  Check,
  X,
  FileCheck
} from 'lucide-react';

export const GradingAndExamPolicyManager: React.FC = () => {
  const { academySettings, updateAcademySettings } = useAcademy();

  const currentConfig: ExamPolicyConfig = academySettings.examPolicyConfig || DEFAULT_EXAM_POLICY_CONFIG;

  const [gradingRules, setGradingRules] = useState<GradingRule[]>(
    currentConfig.gradingRules || DEFAULT_EXAM_POLICY_CONFIG.gradingRules
  );
  const [minPassMark, setMinPassMark] = useState<number>(currentConfig.minPassMark ?? 50);
  const [minAttendancePercent, setMinAttendancePercent] = useState<number>(
    currentConfig.minAttendancePercentForAdmit ?? 80
  );
  const [controllerName, setControllerName] = useState<string>(
    currentConfig.examControllerName || 'Prodip Chowdhury'
  );
  const [controllerTitle, setControllerTitle] = useState<string>(
    currentConfig.examControllerTitle || 'Controller of Examinations'
  );
  const [coordinatorName, setCoordinatorName] = useState<string>(
    currentConfig.courseCoordinatorName || 'Engr. Tanvir Ahmed'
  );
  const [verificationUrl, setVerificationUrl] = useState<string>(
    currentConfig.verificationBaseUrl || 'https://nexgenacademy.edu.bd/verify/'
  );

  const [savedToast, setSavedToast] = useState(false);

  // New Rule state
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRule, setNewRule] = useState<Omit<GradingRule, 'id'>>({
    grade: 'B+',
    minMarks: 65,
    maxMarks: 69,
    gpa: 3.25,
    evaluation: 'Above Average',
    colorBadge: 'blue'
  });

  // Edit Rule state
  const [editingRule, setEditingRule] = useState<GradingRule | null>(null);

  const handleSave = (updatedRules = gradingRules) => {
    const newPolicyConfig: ExamPolicyConfig = {
      gradingRules: updatedRules,
      minPassMark,
      minAttendancePercentForAdmit: minAttendancePercent,
      examControllerName: controllerName,
      examControllerTitle: controllerTitle,
      courseCoordinatorName: coordinatorName,
      verificationBaseUrl: verificationUrl
    };

    updateAcademySettings({
      examPolicyConfig: newPolicyConfig,
      admitCardControllerName: controllerName,
      certificateVerificationBaseUrl: verificationUrl
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('আপনি কি ডিফল্ট গ্রেডিং স্কেল ও এক্সাম পলিসিতে ফিরে যেতে চান?')) {
      setGradingRules(DEFAULT_EXAM_POLICY_CONFIG.gradingRules);
      setMinPassMark(DEFAULT_EXAM_POLICY_CONFIG.minPassMark);
      setMinAttendancePercent(DEFAULT_EXAM_POLICY_CONFIG.minAttendancePercentForAdmit);
      setControllerName(DEFAULT_EXAM_POLICY_CONFIG.examControllerName);
      setControllerTitle(DEFAULT_EXAM_POLICY_CONFIG.examControllerTitle);
      setCoordinatorName(DEFAULT_EXAM_POLICY_CONFIG.courseCoordinatorName || '');
      setVerificationUrl(DEFAULT_EXAM_POLICY_CONFIG.verificationBaseUrl || '');

      updateAcademySettings({
        examPolicyConfig: DEFAULT_EXAM_POLICY_CONFIG,
        admitCardControllerName: DEFAULT_EXAM_POLICY_CONFIG.examControllerName,
        certificateVerificationBaseUrl: DEFAULT_EXAM_POLICY_CONFIG.verificationBaseUrl
      });

      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    }
  };

  const deleteRule = (id: string) => {
    if (window.confirm('এই গ্রেড রুলটি মুছে ফেলতে চান?')) {
      const updated = gradingRules.filter(r => r.id !== id);
      setGradingRules(updated);
      handleSave(updated);
    }
  };

  const handleAddRule = () => {
    if (!newRule.grade.trim()) return;
    const rule: GradingRule = {
      ...newRule,
      id: `gr-${Date.now()}`
    };
    const updated = [...gradingRules, rule].sort((a, b) => b.minMarks - a.minMarks);
    setGradingRules(updated);
    setIsAddingRule(false);
    handleSave(updated);
  };

  const handleUpdateRule = () => {
    if (!editingRule || !editingRule.grade.trim()) return;
    const updated = gradingRules
      .map(r => (r.id === editingRule.id ? editingRule : r))
      .sort((a, b) => b.minMarks - a.minMarks);
    setGradingRules(updated);
    setEditingRule(null);
    handleSave(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black tracking-wide">
              সার্টিফিকেট গ্রেডিং স্কেল ও এক্সাম পলিসি ম্যানেজার
            </h3>
            <span className="text-[11px] bg-amber-500/30 text-amber-200 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
              Grading & Verification Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            পরীক্ষার মার্কস অনুযায়ী লেটার গ্রেড (A+, A, ইত্যাদি), পাস মার্কের হার, ন্যূনতম উপস্থিতির শতভাগ এবং সনদে প্রদর্শিত স্বাক্ষরকারী কর্তৃপক্ষ কনফিগার করুন।
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
            onClick={() => handleSave()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-2xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>গ্রেডিং স্কেল ও এক্সাম পলিসি সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      {/* SECTION 1: GRADING RULES TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>লেটার গ্রেডিং স্কেল পলিসি ({gradingRules.length} ধাপ)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              পরীক্ষার ফলাফলে প্রাপ্ত নম্বরের উপর ভিত্তি করে স্বয়ংক্রিয় গ্রেড ও মন্তব্য নির্ধারণ করে।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingRule(true)}
            className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন গ্রেড ধাপ যোগ করুন</span>
          </button>
        </div>

        {/* Add Inline Rule */}
        {isAddingRule && (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">নতুন গ্রেড স্কেল যুক্ত করুন</span>
              <button
                type="button"
                onClick={() => setIsAddingRule(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">গ্রেড</label>
                <input
                  type="text"
                  value={newRule.grade}
                  onChange={e => setNewRule({ ...newRule, grade: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                  placeholder="A+"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">নূন্যতম নম্বর (%)</label>
                <input
                  type="number"
                  value={newRule.minMarks}
                  onChange={e => setNewRule({ ...newRule, minMarks: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">সর্বোচ্চ নম্বর (%)</label>
                <input
                  type="number"
                  value={newRule.maxMarks}
                  onChange={e => setNewRule({ ...newRule, maxMarks: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">GPA / পয়েন্ট</label>
                <input
                  type="number"
                  step="0.1"
                  value={newRule.gpa}
                  onChange={e => setNewRule({ ...newRule, gpa: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">মূল্যায়ন মন্তব্য (Remark)</label>
                <input
                  type="text"
                  value={newRule.evaluation}
                  onChange={e => setNewRule({ ...newRule, evaluation: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  placeholder="Outstanding / Distinction"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingRule(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleAddRule}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                যোগ করুন
              </button>
            </div>
          </div>
        )}

        {/* Edit Inline Rule */}
        {editingRule && (
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">গ্রেড স্কেল সংশোধন করুন</span>
              <button
                type="button"
                onClick={() => setEditingRule(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">গ্রেড</label>
                <input
                  type="text"
                  value={editingRule.grade}
                  onChange={e => setEditingRule({ ...editingRule, grade: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">নূন্যতম নম্বর (%)</label>
                <input
                  type="number"
                  value={editingRule.minMarks}
                  onChange={e => setEditingRule({ ...editingRule, minMarks: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">সর্বোচ্চ নম্বর (%)</label>
                <input
                  type="number"
                  value={editingRule.maxMarks}
                  onChange={e => setEditingRule({ ...editingRule, maxMarks: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">GPA / পয়েন্ট</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingRule.gpa}
                  onChange={e => setEditingRule({ ...editingRule, gpa: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">মূল্যায়ন মন্তব্য (Remark)</label>
                <input
                  type="text"
                  value={editingRule.evaluation}
                  onChange={e => setEditingRule({ ...editingRule, evaluation: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setEditingRule(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleUpdateRule}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                আপডেট করুন
              </button>
            </div>
          </div>
        )}

        {/* Table of Grading Rules */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-2.5 px-3">লেটার গ্রেড</th>
                <th className="py-2.5 px-3">নম্বর পরিসীমা (Marks Range)</th>
                <th className="py-2.5 px-3">গ্রেড পয়েন্ট (GPA)</th>
                <th className="py-2.5 px-3">মূল্যায়ন মন্তব্য (Remarks)</th>
                <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gradingRules.map(rule => (
                <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="font-black text-xs px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                      {rule.grade}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                    {rule.minMarks}% - {rule.maxMarks}%
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                    {rule.gpa.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-medium">
                    {rule.evaluation}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        type="button"
                        onClick={() => setEditingRule(rule)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRule(rule.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: EXAM POLICIES & VERIFICATION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
        <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>পরীক্ষার শর্তাবলী ও সনদপত্র ভেরিফিকেশন সেটিংস</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center space-x-1">
              <Percent className="w-3.5 h-3.5 text-indigo-600" />
              <span>পাস মার্কের হার (%)</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={minPassMark}
              onChange={e => setMinPassMark(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-600 outline-none font-bold"
            />
            <p className="text-[11px] text-slate-500">
              এর নিচে নম্বর পেলে শিক্ষার্থীকে Failed / Retake হিসেবে চিহ্নিত করা হবে।
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center space-x-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ন্যূনতম উপস্থিতি যোগ্যতা (%)</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={minAttendancePercent}
              onChange={e => setMinAttendancePercent(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-600 outline-none font-bold"
            />
            <p className="text-[11px] text-slate-500">
              অ্যাডমিট কার্ড ও সনদ পাওয়ার জন্য প্রয়োজনীয় ক্লাসের উপস্থিতি।
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">
              পরীক্ষা নিয়ন্ত্রক (Controller of Examinations)
            </label>
            <input
              type="text"
              value={controllerName}
              onChange={e => setControllerName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-600 outline-none"
              placeholder="e.g. Prodip Chowdhury"
            />
            <input
              type="text"
              value={controllerTitle}
              onChange={e => setControllerTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 focus:bg-white outline-none mt-1"
              placeholder="e.g. Controller of Examinations"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">
              একাডেমিক সমন্বয়কারী (Academic Coordinator)
            </label>
            <input
              type="text"
              value={coordinatorName}
              onChange={e => setCoordinatorName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-600 outline-none"
              placeholder="e.g. Engr. Tanvir Ahmed"
            />
            <p className="text-[11px] text-slate-500">
              সার্টিফিকেটের দ্বিতীয় স্বাক্ষরকারী হিসেবে প্রদর্শিত হবে।
            </p>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="font-bold text-slate-700">
              সনদপত্র অনলাইন যাচাই লিংক (Verification Base URL)
            </label>
            <input
              type="text"
              value={verificationUrl}
              onChange={e => setVerificationUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:bg-white focus:border-amber-600 outline-none"
              placeholder="https://nexgenacademy.edu.bd/verify/"
            />
            <p className="text-[11px] text-slate-500">
              সার্টিফিকেটের QR Code স্ক্যান করলে এই লিংকের সাথে সার্টিফিকেট আইডি যোগ হয়ে ভেরিফিকেশন পেইজ খুলবে।
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => handleSave()}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>গ্রেডিং ও এক্সাম পলিসি সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
