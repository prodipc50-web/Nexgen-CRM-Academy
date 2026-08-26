import React, { useState } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { ShieldCheck, FileCheck2, RefreshCw, Users2, Save } from 'lucide-react';

interface CmsPoliciesTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsPoliciesTab: React.FC<CmsPoliciesTabProps> = ({ onSuccessToast }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig } = useAcademy();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteCmsConfig({
      policies: formData
    });
    onSuccessToast('Legal policies & terms updated for public website!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              onChange={e => setFormData({ ...formData, termsAndConditions: e.target.value })}
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
              onChange={e => setFormData({ ...formData, privacyPolicy: e.target.value })}
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
              onChange={e => setFormData({ ...formData, refundPolicy: e.target.value })}
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
              onChange={e => setFormData({ ...formData, codeOfConduct: e.target.value })}
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
