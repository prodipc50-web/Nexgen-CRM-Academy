import React, { useState } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { WebsiteNotice } from '../../../types';
import { Bell, Plus, Edit2, Trash2, Save } from 'lucide-react';

interface CmsNoticesTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsNoticesTab: React.FC<CmsNoticesTabProps> = ({ onSuccessToast }) => {
  const { websiteNotices, addWebsiteNotice, updateWebsiteNotice, deleteWebsiteNotice } = useAcademy();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: 'Admission' | 'Exam' | 'Holiday' | 'Seminar' | 'General';
    publishedDate: string;
  }>({
    title: '',
    description: '',
    category: 'Admission',
    publishedDate: new Date().toISOString().split('T')[0]
  });

  const handleStartAdd = () => {
    setEditingId(null);
    setIsAdding(true);
    setFormData({
      title: '',
      description: '',
      category: 'Admission',
      publishedDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleStartEdit = (notice: WebsiteNotice) => {
    setEditingId(notice.id);
    setIsAdding(false);
    setFormData({
      title: notice.title,
      description: notice.description,
      category: notice.category,
      publishedDate: notice.publishedDate
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    if (editingId) {
      updateWebsiteNotice(editingId, formData);
      onSuccessToast('Notice updated!');
    } else {
      addWebsiteNotice({
        ...formData,
        isUrgent: true,
        isActive: true
      });
      onSuccessToast('New notice published on public website!');
    }

    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
              Website Notice Board & Circulars
            </h4>
            <p className="text-[11px] text-indigo-700">
              Publish admission deadline notices, exam schedules, holidays, and campus announcements.
            </p>
          </div>
        </div>
        <button
          onClick={handleStartAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* Editor Modal/Box */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-black text-xs uppercase text-slate-800">
              {isAdding ? 'Publish New Notice' : 'Edit Notice'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Notice Headline *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Admission Deadline Extended for Weekend MERN Batch"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Admission">Admission</option>
                <option value="Exam">Exam</option>
                <option value="Holiday">Holiday</option>
                <option value="Seminar">Seminar</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Notice Description / Instructions *</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details, eligibility criteria, and required student actions..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Publish Notice</span>
            </button>
          </div>
        </form>
      )}

      {/* Notices List */}
      <div className="space-y-3">
        {(websiteNotices || []).map(notice => (
          <div
            key={notice.id}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-md">
                  {notice.category}
                </span>
                <span className="text-[11px] text-slate-400">{notice.publishedDate}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">{notice.title}</h4>
              <p className="text-[11px] text-slate-500">{notice.description}</p>
            </div>

            <div className="flex items-center space-x-1 self-end sm:self-center shrink-0">
              <button
                onClick={() => handleStartEdit(notice)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  deleteWebsiteNotice(notice.id);
                  onSuccessToast('Notice removed.');
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
