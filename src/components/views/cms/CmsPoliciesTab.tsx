import React, { useState, useRef, useEffect } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { ShieldCheck, FileCheck2, RefreshCw, Users2, Save } from 'lucide-react';

interface CmsPoliciesTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsPoliciesTab: React.FC<CmsPoliciesTabProps> = ({ onSuccessToast }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig } = useAcademy();
  const hasUserEditedRef = useRef(false);

  const pol = websiteCmsConfig.policies || {
    termsAndConditions: 'All students enrolled in NexGen Coding Academy must adhere to academic integrity...',
    privacyPolicy: 'NexGen Academy respects your privacy and handles all personal information with strict confidentiality...',
    refundPolicy: 'Students can claim 100% refund prior to the batch orientation class...',
    codeOfConduct: 'Respect fellow batchmates and mentors. Maintain 80%+ attendance for certificate eligibility...'
  };

  const [activeSubTab, setActiveSubTab] = useState<'terms' | 'privacy' | 'refund' | 'conduct'>('terms');

  const [formData, setFormData] = useState({
    termsAndConditions: pol.termsAndConditions || '',
    privacyPolicy: pol.privacyPolicy || '',
    refundPolicy: pol.refundPolicy || '',
    codeOfConduct: pol.codeOfConduct || ''
  });

  // Background sync from Firestore when user is not actively editing
  useEffect(() => {
    if (hasUserEditedRef.current) return;
    if (websiteCmsConfig.policies) {
      setFormData({
        termsAndConditions: websiteCmsConfig.policies.termsAndConditions || '',
        privacyPolicy: websiteCmsConfig.policies.privacyPolicy || '',
        refundPolicy: websiteCmsConfig.policies.refundPolicy || '',
        codeOfConduct: websiteCmsConfig.policies.codeOfConduct || ''
      });
    }
  }, [websiteCmsConfig.policies]);

  const updateField = (fields: Partial<typeof formData>) => {
    hasUserEditedRef.current = true;
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hasUserEditedRef.current = false;
    updateWebsiteCmsConfig({
      policies: formData
    });
    onSuccessToast('Legal policies & terms updated for public website!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Sticky Quick Save Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-indigo-900/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black shadow-lg shadow-indigo-600/40 text-white shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-sm sm:text-base flex items-center space-x-2">
              <span>Legal Policies & Student Terms (আইনগত পলিসি ও নীতিমালা)</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] uppercase font-bold">
                Live Sync
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              ভর্তি শর্তাবলী, রিফান্ড পলিসি, প্রাইভেসি পলিসি ও আচরণবিধি পরিবর্তন করে সংরক্ষণ করুন।
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Legal Policies (সংরক্ষণ করুন)</span>
          </button>
        </div>
      </div>
      {/* Sub-nav Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('terms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'terms'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Terms & Conditions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'privacy'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy Policy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('refund')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'refund'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refund & Cancellation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('conduct')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeSubTab === 'conduct'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users2 className="w-3.5 h-3.5" />
          <span>Code of Conduct</span>
        </button>
      </div>

      {/* Editor per subtab */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {activeSubTab === 'terms' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-black text-slate-800 text-xs uppercase tracking-wider block">
                Terms & Conditions Legal Text
              </label>
              <span className="text-[11px] text-slate-400">Displayed on public website terms modal</span>
            </div>
            <textarea
              rows={12}
              value={formData.termsAndConditions}
              onChange={e => updateField({ termsAndConditions: e.target.value })}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 leading-relaxed focus:bg-white"
            />
          </div>
        )}

        {activeSubTab === 'privacy' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-black text-slate-800 text-xs uppercase tracking-wider block">
                Privacy Policy Legal Text
              </label>
              <span className="text-[11px] text-slate-400">Displayed on public website privacy modal</span>
            </div>
            <textarea
              rows={12}
              value={formData.privacyPolicy}
              onChange={e => updateField({ privacyPolicy: e.target.value })}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 leading-relaxed focus:bg-white"
            />
          </div>
        )}

        {activeSubTab === 'refund' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-black text-slate-800 text-xs uppercase tracking-wider block">
                Refund & Cancellation Policy
              </label>
              <span className="text-[11px] text-slate-400">Displayed on public website refund modal</span>
            </div>
            <textarea
              rows={12}
              value={formData.refundPolicy}
              onChange={e => updateField({ refundPolicy: e.target.value })}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 leading-relaxed focus:bg-white"
            />
          </div>
        )}

        {activeSubTab === 'conduct' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-black text-slate-800 text-xs uppercase tracking-wider block">
                Student & Member Code of Conduct
              </label>
              <span className="text-[11px] text-slate-400">Displayed in student handbook & website</span>
            </div>
            <textarea
              rows={12}
              value={formData.codeOfConduct}
              onChange={e => updateField({ codeOfConduct: e.target.value })}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 leading-relaxed focus:bg-white"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all hover:scale-[1.02]"
        >
          <Save className="w-4 h-4" />
          <span>Save Legal Policies & Terms</span>
        </button>
      </div>
    </form>
  );
};
