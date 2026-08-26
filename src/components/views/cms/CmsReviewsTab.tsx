import React, { useState } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { StudentCourseReview } from '../../../types';
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
  Sparkles
} from 'lucide-react';

export const CmsReviewsTab: React.FC = () => {
  const {
    studentCourseReviews,
    addStudentCourseReview,
    updateStudentCourseReview,
    deleteStudentCourseReview,
    courses
  } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<StudentCourseReview, 'id'>>({
    courseId: courses[0]?.id || 'crs-01',
    studentName: '',
    studentPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    reviewText: '',
    reviewType: 'Text',
    mediaUrl: '',
    location: 'Dhaka, Bangladesh',
    profession: 'Student / Freelancer',
    batchNumber: 'Batch 2026',
    reviewDate: new Date().toISOString().split('T')[0],
    isVerified: true,
    isFeatured: true,
    sortOrder: 1,
    isActive: true
  });

  const openAddModal = () => {
    setEditingId(null);
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
    setFormData({
      courseId: r.courseId || courses[0]?.id || '',
      studentName: r.studentName,
      studentPhoto: r.studentPhoto || '',
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.reviewText.trim()) {
      alert('Please fill in Student Name and Review Text.');
      return;
    }

    if (editingId) {
      updateStudentCourseReview(editingId, formData);
    } else {
      addStudentCourseReview(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete review from "${name}"?`)) {
      deleteStudentCourseReview(id);
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
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Review</span>
        </button>
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
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 font-semibold"
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
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 font-semibold"
          >
            <option value="ALL">All Review Formats</option>
            <option value="Text">Text Review</option>
            <option value="Video">Video Testimonial</option>
            <option value="Screenshot">Screenshot / Marketplace</option>
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
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-100 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">{rev.studentName}</h4>
                        {rev.isVerified && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{rev.profession || 'Student'}</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {rev.batchNumber} • {rev.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-0.5 bg-amber-50 px-2 py-1 rounded-xl">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-amber-800">{rev.rating}.0</span>
                  </div>
                </div>

                {/* Course Badge */}
                {associatedCourse && (
                  <div className="mt-3">
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md truncate max-w-full inline-block">
                      {associatedCourse.name}
                    </span>
                  </div>
                )}

                {/* Review Text */}
                <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-4 italic">
                  "{rev.reviewText}"
                </p>

                {/* Video Indicator */}
                {rev.reviewType === 'Video' && rev.mediaUrl && (
                  <div className="mt-3 flex items-center space-x-1.5 text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-xl text-[11px] font-bold">
                    <Video className="w-3.5 h-3.5" />
                    <span className="truncate">Video Link: {rev.mediaUrl}</span>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rev.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {rev.isActive ? 'Published' : 'Hidden'}
                  </span>
                  {rev.isFeatured && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(rev)}
                    className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rev.id, rev.studentName)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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
            <p className="text-sm font-bold text-slate-700">No student reviews found</p>
            <p className="text-xs text-slate-400 mt-1">Add positive feedback and video testimonials to showcase on landing pages.</p>
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
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1">
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
                    Student Photo URL
                  </label>
                  <input
                    type="text"
                    value={formData.studentPhoto}
                    onChange={e => setFormData({ ...formData, studentPhoto: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
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

              {(formData.reviewType === 'Video' || formData.reviewType === 'Photo') && (
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    {formData.reviewType === 'Video' ? 'YouTube Embed / Video URL' : 'Photo / Screenshot URL'}
                  </label>
                  <input
                    type="text"
                    value={formData.mediaUrl || ''}
                    onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                    placeholder={formData.reviewType === 'Video' ? 'https://www.youtube.com/embed/...' : 'https://...'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Review Text / Feedback *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.reviewText}
                  onChange={e => setFormData({ ...formData, reviewText: e.target.value })}
                  placeholder="Detailed student feedback about teaching quality, projects, and career success..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center space-x-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={e => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="rounded-sm text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Verified Student</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded-sm text-amber-600 focus:ring-amber-500"
                  />
                  <span>Featured on Home</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-semibold">
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-sm transition-all"
                >
                  {editingId ? 'Update Review' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
