import React, { useState } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { NotificationTemplate, NotificationTemplateType } from '../../../types';
import {
  MessageSquare,
  Smartphone,
  Save,
  CheckCircle2,
  Edit2,
  Copy,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Send,
  ExternalLink,
  Code
} from 'lucide-react';

interface CmsNotificationsTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsNotificationsTab: React.FC<CmsNotificationsTabProps> = ({ onSuccessToast }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig, academySettings } = useAcademy();

  const templates: NotificationTemplate[] = websiteCmsConfig.notificationTemplates || [];

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || 'tpl-1');
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(templates[0] || null);

  const handleSelectTemplate = (tpl: NotificationTemplate) => {
    setSelectedTemplateId(tpl.id);
    setEditingTemplate({ ...tpl });
  };

  const handleSaveCurrentTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    const updated = templates.map(t => (t.id === editingTemplate.id ? editingTemplate : t));
    updateWebsiteCmsConfig({ notificationTemplates: updated });
    onSuccessToast('Notification template updated successfully!');
  };

  // Preview formatting with mock variables
  const previewData: Record<string, string> = {
    student_name: 'Tanvir Ahmed',
    lead_name: 'Tanvir Ahmed',
    student_id: 'NCA-STU-2026-042',
    course_name: 'Full Stack Web Development (MERN)',
    batch_number: 'MERN-008',
    paid_amount: '6,000',
    due_amount: '4,000',
    receipt_no: 'NCA-REC-2026-108',
    class_time: 'Friday 6:00 PM – 8:00 PM',
    room_no: 'Lab Room 402',
    meeting_url: 'https://meet.google.com/nca-mern-live',
    seminar_title: 'Free Web Dev & Freelancing Masterclass',
    seminar_date: 'Friday, 4:00 PM',
    institute_name: academySettings.instituteName || 'Nexgen Computer Academy',
    helpline: academySettings.primarySupportPhone || '01798444444',
    portal_url: `${academySettings.websiteUrl || 'https://nexgenacademy.edu.bd'}/portal`
  };

  const replaceTags = (text: string) => {
    let formatted = text || '';
    Object.entries(previewData).forEach(([key, val]) => {
      formatted = formatted.replace(new RegExp(`{${key}}`, 'g'), val);
    });
    return formatted;
  };

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              SMS & WhatsApp Alert Automation & Templates (মেসেজ টেমপ্লেট)
            </h3>
            <p className="text-xs text-slate-500">
              Customize dynamic messages for Admission Welcome, Money Receipts, Due Reminders, Class Schedules, and Seminars.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Template Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="font-black text-xs text-slate-700 uppercase tracking-wider px-1">
            Standard Trigger Templates
          </h4>

          <div className="space-y-2">
            {templates.map(tpl => {
              const isSelected = tpl.id === selectedTemplateId;
              return (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[9px] font-bold rounded-md">
                      {tpl.type}
                    </span>
                    <h5 className="font-bold text-xs text-slate-900 truncate">{tpl.title}</h5>
                  </div>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${tpl.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>
              );
            })}
          </div>

          {/* Variables Reference Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-700 block flex items-center space-x-1">
              <Code className="w-3.5 h-3.5 text-indigo-600" />
              <span>Available Dynamic Placeholders:</span>
            </span>
            <div className="flex flex-wrap gap-1 text-[10px]">
              {Object.keys(previewData).map(k => (
                <span
                  key={k}
                  onClick={() => {
                    if (editingTemplate) {
                      setEditingTemplate({
                        ...editingTemplate,
                        whatsappBody: `${editingTemplate.whatsappBody} {${k}}`
                      });
                    }
                  }}
                  className="px-2 py-1 bg-white border border-slate-200 text-indigo-700 font-mono font-bold rounded-lg cursor-pointer hover:bg-indigo-50"
                  title="Click to append to WhatsApp template"
                >
                  {`{${k}}`}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Template Editor & Live Phone Simulator */}
        {editingTemplate && (
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleSaveCurrentTemplate} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-black text-sm text-slate-900">{editingTemplate.title}</h4>
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTemplate.isActive}
                    onChange={e => setEditingTemplate({ ...editingTemplate, isActive: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded-md"
                  />
                  <span>Active Template</span>
                </label>
              </div>

              {/* WhatsApp Body Editor */}
              <div className="space-y-2">
                <label className="font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-emerald-700">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Formatted Message Template</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Supports *bold*, _italics_, emojis</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={editingTemplate.whatsappBody}
                  onChange={e => setEditingTemplate({ ...editingTemplate, whatsappBody: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-slate-800 leading-relaxed focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* SMS Body Editor */}
              <div className="space-y-2">
                <label className="font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-indigo-700">
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    <span>Standard Mobile SMS Template (Plain Text)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {editingTemplate.smsBody.length} chars (~{Math.ceil(editingTemplate.smsBody.length / 160)} SMS parts)
                  </span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingTemplate.smsBody}
                  onChange={e => setEditingTemplate({ ...editingTemplate, smsBody: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-slate-800 leading-relaxed focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Template Changes</span>
                </button>
              </div>
            </form>

            {/* Live Message Simulator Preview (WhatsApp & SMS) */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold uppercase tracking-wider">Live Simulation Output</span>
                </div>
                <span className="text-slate-400 text-[11px]">Recipient: Tanvir Ahmed (+88017XXXXXXXX)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* WhatsApp Chat Bubble */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase">
                    <span>WhatsApp Chat Simulation</span>
                    <span>10:42 AM</span>
                  </div>
                  <div className="p-3.5 bg-emerald-950/70 border border-emerald-800/60 rounded-2xl text-xs text-emerald-100 whitespace-pre-wrap leading-relaxed">
                    {replaceTags(editingTemplate.whatsappBody)}
                  </div>
                  <div className="pt-1 flex justify-end">
                    <a
                      href={`https://api.whatsapp.com/send?phone=8801700000000&text=${encodeURIComponent(replaceTags(editingTemplate.whatsappBody))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold shadow-md transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Test on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Mobile SMS Bubble */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-indigo-400 font-bold uppercase">
                    <span>Mobile SMS Simulation</span>
                    <span>NEXGEN-IT</span>
                  </div>
                  <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                    {replaceTags(editingTemplate.smsBody)}
                  </div>
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(replaceTags(editingTemplate.smsBody));
                        onSuccessToast('SMS content copied to clipboard for dispatch testing!');
                      }}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold shadow-md transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy SMS Text</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
