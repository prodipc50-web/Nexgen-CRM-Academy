import React, { useState, useRef } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { WebsiteNotice } from '../../../types';
import { compressImageFile } from '../../../utils/imageCompressor';
import {
  Bell,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  FileText,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  Sparkles,
  Paperclip,
  X
} from 'lucide-react';

interface CmsNoticesTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsNoticesTab: React.FC<CmsNoticesTabProps> = ({ onSuccessToast }) => {
  const {
    websiteNotices,
    addWebsiteNotice,
    updateWebsiteNotice,
    deleteWebsiteNotice,
    cloudSyncStatus,
    lastCloudSyncTime,
    syncToCloudNow
  } = useAcademy();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasUserEditedRef = useRef(false);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: 'Admission' | 'Exam' | 'Holiday' | 'Seminar' | 'General';
    publishedDate: string;
    fileUrl: string;
    isUrgent: boolean;
    isActive: boolean;
  }>({
    title: '',
    description: '',
    category: 'Admission',
    publishedDate: new Date().toISOString().split('T')[0],
    fileUrl: '',
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
      fileUrl: '',
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
      fileUrl: notice.fileUrl || '',
      isUrgent: notice.isUrgent ?? false,
      isActive: notice.isActive ?? true
    });
  };

  const handleCancel = () => {
    hasUserEditedRef.current = false;
    setIsAdding(false);
    setEditingId(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    try {
      if (file.type.startsWith('image/')) {
        // Compress image file
        const compressed = await compressImageFile(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.75
        });
        updateField('fileUrl', compressed);
        onSuccessToast('নোটিশের ছবি কম্প্রেস ও যুক্ত হয়েছে!');
      } else {
        // Reader as data URL for documents/PDF
        const reader = new FileReader();
        reader.onload = (event) => {
          updateField('fileUrl', event.target?.result as string);
          onSuccessToast('ফাইল সফলভাবে সংযুক্ত হয়েছে!');
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('File process error:', err);
      alert('ফাইল প্রসেস করতে ব্যর্থ হয়েছে। অনুগ্রহ করে ছোট সাইজের ফাইল নির্বাচন করুন।');
    } finally {
      setIsUploadingFile(false);
      if (e.target) e.target.value = '';
    }
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
        fileUrl: formData.fileUrl.trim() || undefined,
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
        fileUrl: formData.fileUrl.trim() || undefined,
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

  const handleExplicitSync = async () => {
    setIsSyncing(true);
    try {
      await syncToCloudNow(true);
      onSuccessToast('নোটিশ বোর্ড ডাটা ক্লাউডে সফলভাবে সিঙ্ক হয়েছে!');
    } catch (err) {
      alert('ক্লাউড সিঙ্ক করতে সমস্যা হয়েছে।');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 mb-1">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-black uppercase tracking-wider">Notice Board & Announcements</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">Website Academic Notices & Circulars</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Publish admission deadline notices, exam schedules, holidays, and campus circulars with document attachments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Cloud Sync Status Indicator */}
          <div className="flex items-center space-x-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-semibold text-slate-600">
            <span
              className={`w-2 h-2 rounded-full ${
                cloudSyncStatus === 'synced'
                  ? 'bg-emerald-500 ring-2 ring-emerald-200'
                  : cloudSyncStatus === 'syncing'
                  ? 'bg-amber-500 animate-ping'
                  : 'bg-rose-500'
              }`}
            />
            <span className="capitalize">{cloudSyncStatus}</span>
            {lastCloudSyncTime && (
              <span className="text-[10px] text-slate-400 hidden md:inline">
                ({lastCloudSyncTime})
              </span>
            )}
          </div>

          {/* Explicit Sync Button */}
          <button
            type="button"
            onClick={handleExplicitSync}
            disabled={isSyncing}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white rounded-2xl font-bold text-xs flex items-center space-x-2 shadow-xs transition-all"
            title="Force immediate sync to Firebase Cloud"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Save & Sync'}</span>
          </button>

          <button
            type="button"
            onClick={handleStartAdd}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-xs flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Notice</span>
          </button>
        </div>
      </div>

      {/* Editor Modal/Box */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Bell className="w-4 h-4" />
              </div>
              <span className="font-black text-sm text-slate-900">
                {isAdding ? 'Publish New Academic Notice' : 'Edit Notice Details'}
              </span>
            </div>
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
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => updateField('category', e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
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
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-6 pt-5">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isUrgent}
                  onChange={e => updateField('isUrgent', e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span className="font-bold text-slate-800 text-xs">Urgent / Important Notice Banner</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => updateField('isActive', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="font-bold text-slate-800 text-xs">Active on Public Website</span>
              </label>
            </div>

            {/* Circular Attachment / File Upload */}
            <div className="md:col-span-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 flex items-center space-x-1.5 text-xs">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Circular Attachment / PDF / Image (Optional)</span>
                </label>
                {formData.fileUrl && (
                  <button
                    type="button"
                    onClick={() => updateField('fileUrl', '')}
                    className="text-[11px] text-rose-600 font-bold hover:underline"
                  >
                    Remove File
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingFile}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shrink-0 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingFile ? 'Processing...' : 'Upload File / Image'}</span>
                </button>

                <div className="flex-1 w-full">
                  <input
                    type="text"
                    value={formData.fileUrl}
                    onChange={e => updateField('fileUrl', e.target.value)}
                    placeholder="Or paste external Google Drive / PDF / Image URL (https://...)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              {formData.fileUrl && (
                <div className="flex items-center space-x-2 text-[11px] text-emerald-700 font-bold mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>File attached successfully and ready for public download/preview</span>
                </div>
              )}
            </div>

            <div className="md:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Notice Description / Instructions *</label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={e => updateField('description', e.target.value)}
                placeholder="Provide complete circular details, batch requirements, schedules, and student guidelines..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingId ? 'Save Changes' : 'Publish Notice'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Notices List */}
      <div className="space-y-3">
        {(websiteNotices || []).map(notice => (
          <div
            key={notice.id}
            className={`p-4 sm:p-5 bg-white rounded-3xl border transition-all ${
              notice.isUrgent
                ? 'border-rose-200/90 shadow-rose-100/50 shadow-sm'
                : 'border-slate-200/80 shadow-xs'
            } space-y-2`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
                    {notice.category}
                  </span>
                  {notice.isUrgent && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping mr-1" />
                      <span>URGENT</span>
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    Published: {notice.publishedDate}
                  </span>
                  {!notice.isActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      Hidden from Website
                    </span>
                  )}
                </div>

                <h3 className="font-black text-slate-900 text-sm sm:text-base pt-1">
                  {notice.title}
                </h3>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleActive(notice)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                    notice.isActive
                      ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                  }`}
                  title={notice.isActive ? 'Hide from public site' : 'Show on public site'}
                >
                  {notice.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleStartEdit(notice)}
                  className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 rounded-xl transition-colors"
                  title="Edit Notice"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete notice "${notice.title}"?`)) {
                      deleteWebsiteNotice(notice.id);
                      onSuccessToast('Notice deleted.');
                    }
                  }}
                  className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-xl transition-colors"
                  title="Delete Notice"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {notice.description}
            </p>

            {notice.fileUrl && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={notice.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>View Attached Circular / File</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            )}
          </div>
        ))}

        {(!websiteNotices || websiteNotices.length === 0) && (
          <div className="py-12 text-center bg-white rounded-3xl border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No notices published yet</p>
            <p className="text-xs text-slate-400 mt-1">Click "Publish Notice" to post admission or exam notices.</p>
          </div>
        )}
      </div>
    </div>
  );
};
