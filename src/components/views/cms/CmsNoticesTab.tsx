import React, { useState, useRef } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { WebsiteNotice } from '../../../types';
import { Bell, Plus, Edit2, Trash2, Save, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface CmsNoticesTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsNoticesTab: React.FC<CmsNoticesTabProps> = ({ onSuccessToast }) => {
  const { websiteNotices, addWebsiteNotice, updateWebsiteNotice, deleteWebsiteNotice } = useAcademy();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const hasUserEditedRef = useRef(false);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: 'Admission' | 'Exam' | 'Holiday' | 'Seminar' | 'General';
    publishedDate: string;
    isUrgent: boolean;
    isActive: boolean;
  }>({
    title: '',
    description: '',
    category: 'Admission',
    publishedDate: new Date().toISOString().split('T')[0],
    isUrgent: false,
    isActive: true
  });

  const updateField = <K extends keyof typeof formData>(field: K, val: (typeof formData)[K]) => {
    hasUserEditedRef.current = true;
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleStartAdd = () => {
    hasUserEditedRef.current = false;
    setEditingId(null);
    setIsAdding(true);
    setFormData({
      title: '',
      description: '',
      category: 'Admission',
      publishedDate: new Date().toISOString().split('T')[0],
      isUrgent: false,
      isActive: true
    });
  };

  const handleStartEdit = (notice: WebsiteNotice) => {
    hasUserEditedRef.current = false;
    setEditingId(notice.id);
    setIsAdding(false);
    setFormData({
      title: notice.title,
      description: notice.description,
      category: notice.category,
      publishedDate: notice.publishedDate,
      isUrgent: notice.isUrgent ?? false,
      isActive: notice.isActive ?? true
    });
  };

  const handleCancel = () => {
    hasUserEditedRef.current = false;
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    if (editingId) {
      updateWebsiteNotice(editingId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        publishedDate: formData.publishedDate,
        isUrgent: formData.isUrgent,
        isActive: formData.isActive
      });
      onSuccessToast('Notice updated successfully!');
    } else {
      addWebsiteNotice({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        publishedDate: formData.publishedDate,
        isUrgent: formData.isUrgent,
        isActive: formData.isActive
      });
      onSuccessToast('New notice published on public website!');
    }

    hasUserEditedRef.current = false;
    setEditingId(null);
    setIsAdding(false);
  };

  const handleToggleActive = (notice: WebsiteNotice) => {
    const newStatus = !notice.isActive;
    updateWebsiteNotice(notice.id, { isActive: newStatus });
    onSuccessToast(newStatus ? 'Notice activated on website' : 'Notice hidden from website');
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
              Publish admission deadline notices, exam schedules, holidays, and campus announcements synced across devices.
            </p>
          </div>
        </div>
        <button
          onClick={handleStartAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
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
              onClick={handleCancel}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
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
                onChange={e => updateField('title', e.target.value)}
                placeholder="e.g. Admission Deadline Extended for Weekend MERN Batch"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => updateField('category', e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Admission">Admission</option>
                <option value="Exam">Exam</option>
                <option value="Holiday">Holiday</option>
                <option value="Seminar">Seminar</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Published Date</label>
              <input
                type="date"
                value={formData.publishedDate}
                onChange={e => updateField('publishedDate', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-4 pt-5">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isUrgent}
                  onChange={e => updateField('isUrgent', e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span className="font-bold text-slate-700 text-xs">Urgent / Important Notice</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => updateField('isActive', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="font-bold text-slate-700 text-xs">Active on Website</span>
              </label>
            </div>

            <div className="md:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Notice Description / Instructions *</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={e => updateField('description', e.target.value)}
                placeholder="Provide details, eligibility criteria, and required student actions..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingId ? 'Save Changes' : 'Publish Notice'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Notices List */}
      <div className="space-y-3">
        {(!websiteNotices || websiteNotices.length === 0) ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No notices published yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click "Publish Notice" above to add the first announcement to your website.</p>
          </div>
        ) : (
          websiteNotices.map(notice => (
            <div
              key={notice.id}
              className={`p-4 bg-white rounded-2xl border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                notice.isActive === false ? 'opacity-60 border-slate-200 bg-slate-50/50' : 'border-slate-200'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-md border border-amber-200/50">
                    {notice.category}
                  </span>
                  {notice.isUrgent && (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold text-[10px] rounded-md border border-rose-200/50 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>URGENT</span>
                    </span>
                  )}
                  {notice.isActive === false ? (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                      Hidden
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md flex items-center space-x-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Live</span>
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">{notice.publishedDate}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">{notice.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{notice.description}</p>
              </div>

              <div className="flex items-center space-x-1 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  title={notice.isActive === false ? 'Show on website' : 'Hide from website'}
                  onClick={() => handleToggleActive(notice)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    notice.isActive === false ? 'text-slate-400 hover:text-emerald-600' : 'text-slate-400 hover:text-amber-600'
                  }`}
                >
                  {notice.isActive === false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleStartEdit(notice)}
                  title="Edit notice"
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteWebsiteNotice(notice.id);
                    onSuccessToast('Notice removed.');
                  }}
                  title="Delete notice"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
