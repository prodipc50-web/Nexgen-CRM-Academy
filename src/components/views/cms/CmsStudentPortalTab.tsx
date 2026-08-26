import React, { useState } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { StudentPortalConfig } from '../../../types';
import {
  UserCheck,
  Save,
  ShieldCheck,
  Bell,
  Download,
  Video,
  CreditCard,
  ExternalLink,
  Eye,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface CmsStudentPortalTabProps {
  onSuccessToast: (msg: string) => void;
  onOpenStudentPortal?: () => void;
}

export const CmsStudentPortalTab: React.FC<CmsStudentPortalTabProps> = ({
  onSuccessToast,
  onOpenStudentPortal
}) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig, students } = useAcademy();

  const currentConfig: StudentPortalConfig = websiteCmsConfig.studentPortal || {
    isPortalEnabled: true,
    allowSelfRegistration: true,
    allowOnlineFeePayment: true,
    allowIdCardDownload: true,
    allowCertificateDownload: true,
    allowClassRecordingAccess: true,
    portalNotice: 'Welcome to Nexgen Student Portal! Mid-term practical evaluations will start next week.',
    portalNoticeUrgent: false
  };

  const [formData, setFormData] = useState<StudentPortalConfig>({ ...currentConfig });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteCmsConfig({ studentPortal: formData });
    onSuccessToast('Student portal configuration updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              Student Self-Service Portal Management (শিক্ষার্থী পোর্টাল সেটিংস)
            </h3>
            <p className="text-xs text-slate-500">
              Control student self-service features, downloadable digital ID cards, fee receipts, and portal notice board.
            </p>
          </div>
        </div>

        {onOpenStudentPortal && (
          <button
            type="button"
            onClick={onOpenStudentPortal}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 shrink-0 self-start md:self-center"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Launch Student Portal</span>
          </button>
        )}
      </div>

      {/* Main Switch Toggles */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
          Core Feature Access Permissions
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <label className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3 cursor-pointer hover:bg-indigo-50/50 transition-colors">
            <input
              type="checkbox"
              checked={formData.isPortalEnabled}
              onChange={e => setFormData({ ...formData, isPortalEnabled: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded-md mt-0.5"
            />
            <div className="space-y-0.5">
              <span className="font-black text-slate-900 block">Enable Student Self-Service Portal</span>
              <span className="text-slate-500 block">Allow students to log in via Student ID / Mobile Number.</span>
            </div>
          </label>

          <label className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3 cursor-pointer hover:bg-indigo-50/50 transition-colors">
            <input
              type="checkbox"
              checked={formData.allowIdCardDownload}
              onChange={e => setFormData({ ...formData, allowIdCardDownload: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded-md mt-0.5"
            />
            <div className="space-y-0.5">
              <span className="font-black text-slate-900 block">Digital PVC Student ID Card Download</span>
              <span className="text-slate-500 block">Enable students to view, print, and download their official digital ID card with QR code.</span>
            </div>
          </label>

          <label className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3 cursor-pointer hover:bg-indigo-50/50 transition-colors">
            <input
              type="checkbox"
              checked={formData.allowOnlineFeePayment}
              onChange={e => setFormData({ ...formData, allowOnlineFeePayment: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded-md mt-0.5"
            />
            <div className="space-y-0.5">
              <span className="font-black text-slate-900 block">Fee Receipt Printing & Dues Ledger</span>
              <span className="text-slate-500 block">Allow students to view their payment history and print official money receipts.</span>
            </div>
          </label>

          <label className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3 cursor-pointer hover:bg-indigo-50/50 transition-colors">
            <input
              type="checkbox"
              checked={formData.allowClassRecordingAccess}
              onChange={e => setFormData({ ...formData, allowClassRecordingAccess: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded-md mt-0.5"
            />
            <div className="space-y-0.5">
              <span className="font-black text-slate-900 block">Course Handouts & Class Video Recordings</span>
              <span className="text-slate-500 block">Provide access to recorded class backup drives and lab starter codes.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Portal Sticky Notice Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm pb-2 border-b border-slate-100">
          <Bell className="w-4 h-4 text-amber-500" />
          <span>Student Portal Announcement / Notice Board (নোটিশ বার্তা)</span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Notice Message for Students</label>
            <textarea
              rows={3}
              value={formData.portalNotice}
              onChange={e => setFormData({ ...formData, portalNotice: e.target.value })}
              placeholder="e.g. Special lab practice session this Friday from 4:00 PM..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.portalNoticeUrgent}
              onChange={e => setFormData({ ...formData, portalNoticeUrgent: e.target.checked })}
              className="w-4 h-4 text-rose-600 rounded-md"
            />
            <span className="text-rose-600">Mark as Urgent Notice (Highlighted with Red/Amber Alert Box)</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Save className="w-4 h-4" />
          <span>Save Student Portal Configuration</span>
        </button>
      </div>
    </form>
  );
};
