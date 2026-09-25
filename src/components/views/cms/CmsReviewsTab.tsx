import React, { useState, useRef } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { StudentCourseReview } from '../../../types';
import { compressLogoOrAvatar } from '../../../utils/imageCompressor';
import {
  Star,
  MessageSquare,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  UserCheck,
  Video,
  FileText,
  Search,
  Filter,
  Sparkles,
  Upload,
  Camera,
  Save,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export const CmsReviewsTab: React.FC = () => {
  const {
    studentCourseReviews,
    addStudentCourseReview,
    updateStudentCourseReview,
    deleteStudentCourseReview,
    courses,
    cloudSyncStatus,
    lastCloudSyncTime,
    syncToCloudNow
  } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Avatar upload and input states
  const [avatarInputMode, setAvatarInputMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Sync and notification states
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<Omit<StudentCourseReview, 'id'>>({
    courseId: courses[0]?.id || 'crs-01',
    studentName: '',
    studentPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    reviewText: '',
    reviewType: 'Text',
    mediaUrl: '',
    location: 'Dhaka, Bangladesh',
    profession: 'Junior Developer / Freelancer',
    batchNumber: 'Batch 2026',
    reviewDate: new Date().toISOString().split('T')[0],
    isVerified: true,
    isFeatured: true,
    sortOrder: 1,
    isActive: true
  });

  const openAddModal = () => {
    setEditingId(null);
    setAvatarInputMode('upload');
    setFormData({
      courseId: courses[0]?.id || 'crs-01',
      studentName: '',
      studentPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      reviewText: '',
      reviewType: 'Text',
      mediaUrl: '',
      location: 'Dhaka, Bangladesh',
      profession: 'Junior Developer / Freelancer',
      batchNumber: 'Batch 2026',
      reviewDate: new Date().toISOString().split('T')[0],
      isVerified: true,
      isFeatured: true,
      sortOrder: 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (r: StudentCourseReview) => {
    setEditingId(r.id);
    setAvatarInputMode(r.studentPhoto?.startsWith('data:image') ? 'upload' : 'upload');
    setFormData({
      courseId: r.courseId || courses[0]?.id || '',
      studentName: r.studentName,
      studentPhoto: r.studentPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      rating: r.rating,
      reviewText: r.reviewText,
      reviewType: r.reviewType || 'Text',
      mediaUrl: r.mediaUrl || '',
      location: r.location || '',
      profession: r.profession || '',
      batchNumber: r.batchNumber || '',
      reviewDate: r.reviewDate || new Date().toISOString().split('T')[0],
      isVerified: r.isVerified,
      isFeatured: r.isFeatured,
      sortOrder: r.sortOrder || 1,
      isActive: r.isActive
    });
    setIsModalOpen(true);
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে একটি ছবি ফাইল (.jpg, .png, .webp) নির্বাচন করুন।');
      return;
    }

    setIsUploading(true);
    try {
      // Auto compress to 300x300 square ratio, quality 0.8 (~25KB)
      const compressedDataUrl = await compressLogoOrAvatar(file, 300);
      setFormData(prev => ({
        ...prev,
        studentPhoto: compressedDataUrl
      }));
      setNotification({
        type: 'success',
        message: 'শিক্ষার্থীর ছবি সফলভাবে আপলোড ও অপ্টিমাইজ করা হয়েছে!'
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Failed to compress avatar:', err);
      alert('ছবি প্রসেস করতে ব্যর্থ হয়েছে। অন্য কোনো ছবি দিয়ে চেষ্টা করুন।');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleExplicitSync = async () => {
    setIsSyncing(true);
    try {
      await syncToCloudNow(true);
      setNotification({
        type: 'success',
        message: 'স্টুডেন্ট রিভিউ ক্লাউডে সফলভাবে সেভ ও সিঙ্ক হয়েছে!'
      });
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'ক্লাউড সিঙ্ক করতে সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট কানেকশন চেক করুন।'
      });
      setTimeout(() => setNotification(null), 3500);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.reviewText.trim()) {
      alert('Please fill in Student Name and Review Text.');
      return;
    }

    if (editingId) {
      updateStudentCourseReview(editingId, formData);
      setNotification({
        type: 'success',
        message: `"${formData.studentName}" এর রিভিউ সফলভাবে আপডেট করা হয়েছে!`
      });
    } else {
      addStudentCourseReview(formData);
      setNotification({
        type: 'success',
        message: `"${formData.studentName}" এর নতুন রিভিউ সফলভাবে প্রকাশিত হয়েছে!`
      });
    }
    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete review from "${name}"?`)) {
      deleteStudentCourseReview(id);
      setNotification({
        type: 'success',
        message: `"${name}" এর রিভিউ মুছে ফেলা হয়েছে!`
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const filteredReviews = studentCourseReviews.filter(r => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.profession && r.profession.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCourse = filterCourse === 'ALL' || r.courseId === filterCourse;
    const matchesType = filterType === 'ALL' || r.reviewType === filterType;
    return matchesSearch && matchesCourse && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Notification Banner */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-black/5 rounded-lg text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 mb-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider">Social Proof & Trust</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">Student Reviews & Video Testimonials</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Curate authentic student testimonials, video case studies, marketplace earning reviews, and associate them with respective landing pages.
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

          {/* Add Review Button */}
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Review</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews by student name or review content..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <select
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 font-semibold"
          >
            <option value="ALL">All Courses Filter</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 font-semibold"
          >
            <option value="ALL">All Formats</option>
            <option value="Text">Text Feedback</option>
            <option value="Video">Video Case Study</option>
            <option value="Photo">Photo/Screenshot</option>
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReviews.map(rev => {
          const associatedCourse = courses.find(c => c.id === rev.courseId);
          return (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header: Student Info + Rating */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.studentPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={rev.studentName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-100 shrink-0 bg-slate-100"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-black text-slate-900 text-sm">{rev.studentName}</h3>
                        {rev.isVerified && (
                          <span title="Verified Enrolled Student"><UserCheck className="w-3.5 h-3.5 text-emerald-600" /></span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{rev.profession || 'Student'}</p>
                      <p className="text-[10px] text-slate-400">{rev.batchNumber || 'Batch 2026'}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                    <span className="text-xs font-black">{rev.rating}.0</span>
                  </div>
                </div>

                {/* Course Pill */}
                {associatedCourse && (
                  <div className="mt-3">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                      {associatedCourse.name}
                    </span>
                  </div>
                )}

                {/* Review Content */}
                <p className="text-xs text-slate-600 line-clamp-3 mt-3 leading-relaxed italic">
                  "{rev.reviewText}"
                </p>

                {/* Media indicators */}
                {rev.reviewType === 'Video' && rev.mediaUrl && (
                  <div className="mt-2 flex items-center space-x-1.5 text-[11px] text-indigo-600 font-bold">
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Case Study Attached</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">{rev.reviewDate || 'Recent'}</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => openEditModal(rev)}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    title="Edit Review"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rev.id, rev.studentName)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredReviews.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No reviews found matching your criteria</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search keyword or course filter.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl border border-slate-100 space-y-4 my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingId ? 'Edit Student Review' : 'Add Student Testimonial'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Configure text or video feedback with course association</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Dedicated Student Photo Upload Section */}
              <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-slate-700 uppercase flex items-center space-x-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-600" />
                    <span>Student Photo / Avatar</span>
                  </label>

                  {/* Upload vs URL Mode Switcher */}
                  <div className="flex bg-slate-200/70 p-0.5 rounded-xl text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setAvatarInputMode('upload')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        avatarInputMode === 'upload'
                          ? 'bg-white text-amber-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarInputMode('url')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        avatarInputMode === 'url'
                          ? 'bg-white text-amber-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Avatar Preview */}
                  <div className="relative group shrink-0">
                    <img
                      src={formData.studentPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                      alt="Student Preview"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white shadow-md border border-slate-200 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-900/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                      title="Upload New Photo"
                    >
                      <Camera className="w-4 h-4 mb-0.5" />
                      <span>Change</span>
                    </button>
                  </div>

                  {/* Upload Controls or URL Input */}
                  <div className="flex-1 w-full space-y-2">
                    {avatarInputMode === 'upload' ? (
                      <div className="space-y-2">
                        <input
                          ref={avatarFileInputRef}
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleAvatarFileUpload}
                          className="hidden"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => avatarFileInputRef.current?.click()}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs transition"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploading ? 'Compressing...' : 'Upload Student Photo'}</span>
                          </button>
                          {formData.studentPhoto && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData(prev => ({
                                  ...prev,
                                  studentPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
                                }))
                              }
                              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          ডিভাইস থেকে ছবি নির্বাচন করুন। স্বয়ংক্রিয়ভাবে অপ্টিমাইজ ও কম্প্রেস (~25KB) হবে।
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={formData.studentPhoto}
                          onChange={e => setFormData({ ...formData, studentPhoto: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
                        />
                        <p className="text-[11px] text-slate-400">
                          সরাসরি কোনো পাবলিক ইমেজ লিঙ্ক ব্যবহার করতে চাইলে এখানে পেস্ট করুন।
                        </p>
                      </div>
                    )}

                    {formData.studentPhoto?.startsWith('data:image') && (
                      <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>✓ Auto-Compressed & Web-Ready (~25KB)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. সাদিয়া আক্তার রিমা"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Associated Course
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Rating (Stars)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold text-amber-700"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5.0 Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4.0 Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3.0 Good)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Profession / Job Outcome
                  </label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={e => setFormData({ ...formData, profession: e.target.value })}
                    placeholder="e.g. Freelance UI Designer ($120/order)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Batch / Location
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={e => setFormData({ ...formData, batchNumber: e.target.value })}
                    placeholder="e.g. ব্যাচ ০২ • ফার্মগেট ক্যাম্পাস"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Review Date
                  </label>
                  <input
                    type="date"
                    value={formData.reviewDate}
                    onChange={e => setFormData({ ...formData, reviewDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Review Type
                </label>
                <div className="flex gap-4">
                  {(['Text', 'Video', 'Photo'] as const).map(type => (
                    <label key={type} className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="reviewType"
                        value={type}
                        checked={formData.reviewType === type}
                        onChange={() => setFormData({ ...formData, reviewType: type })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>{type} Review</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.reviewType === 'Video' && (
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    YouTube / Video Embed URL
                  </label>
                  <input
                    type="text"
                    value={formData.mediaUrl}
                    onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Student Review / Testimonial Text *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.reviewText}
                  onChange={e => setFormData({ ...formData, reviewText: e.target.value })}
                  placeholder="What does the student say about the instructors, lab facilities, and course curriculum?..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={e => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="rounded-sm text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Verified Student</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded-sm text-amber-600 focus:ring-amber-500"
                  />
                  <span>Featured on Home</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded-sm text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Status Active</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingId ? 'Save & Update Review' : 'Save & Publish Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
