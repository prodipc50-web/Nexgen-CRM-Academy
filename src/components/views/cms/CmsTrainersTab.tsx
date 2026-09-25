import React, { useState, useRef } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { TrainerProfile } from '../../../types';
import { compressLogoOrAvatar } from '../../../utils/imageCompressor';
import {
  Users,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  ExternalLink,
  BookOpen,
  Award,
  Sparkles,
  Phone,
  Mail,
  Linkedin,
  Github,
  Facebook,
  Globe,
  Star,
  Check,
  Search,
  Filter,
  Upload,
  Camera,
  Save,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

export const CmsTrainersTab: React.FC = () => {
  const {
    trainersList,
    addTrainer,
    updateTrainer,
    deleteTrainer,
    courses,
    cloudSyncStatus,
    lastCloudSyncTime,
    syncToCloudNow
  } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('ALL');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainerId, setEditingTrainerId] = useState<string | null>(null);

  // Avatar upload and input states
  const [avatarInputMode, setAvatarInputMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Sync and feedback state
  const [isExplicitSyncing, setIsExplicitSyncing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<Omit<TrainerProfile, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    designation: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    phone: '',
    email: '',
    shortBio: '',
    detailedBio: '',
    experienceYears: 5,
    industryExperience: '',
    companyOrOrg: '',
    certifications: [],
    skills: [],
    socialLinks: {
      linkedin: '',
      github: '',
      facebook: '',
      website: '',
      youtube: ''
    },
    isActive: true,
    coursesAssigned: []
  });

  const [certInput, setCertInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const openAddModal = () => {
    setEditingTrainerId(null);
    setAvatarInputMode('upload');
    setFormData({
      name: '',
      designation: 'Senior Faculty & Lead Trainer',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      phone: '',
      email: '',
      shortBio: '',
      detailedBio: '',
      experienceYears: 5,
      industryExperience: '5+ Years Real-world Industry & Corporate Training Experience',
      companyOrOrg: 'Nexgen Computer Academy',
      certifications: ['Certified Professional Instructor'],
      skills: ['Classroom Teaching', 'Live Lab Mentoring', 'Project Architecture'],
      socialLinks: {
        linkedin: '',
        github: '',
        facebook: '',
        website: ''
      },
      isActive: true,
      coursesAssigned: courses.length > 0 ? [courses[0].id] : []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: TrainerProfile) => {
    setEditingTrainerId(t.id);
    setAvatarInputMode(t.avatarUrl?.startsWith('data:image') ? 'upload' : 'upload');
    setFormData({
      name: t.name,
      designation: t.designation,
      avatarUrl: t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      phone: t.phone || '',
      email: t.email || '',
      shortBio: t.shortBio || '',
      detailedBio: t.detailedBio || '',
      experienceYears: t.experienceYears || 1,
      industryExperience: t.industryExperience || '',
      companyOrOrg: t.companyOrOrg || '',
      certifications: t.certifications || [],
      skills: t.skills || [],
      socialLinks: t.socialLinks || {},
      isActive: t.isActive,
      coursesAssigned: t.coursesAssigned || []
    });
    setIsModalOpen(true);
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে সঠিক ইমেজ ফাইল (.jpg, .png, .webp) নির্বাচন করুন।');
      return;
    }

    setIsUploading(true);
    try {
      // Auto compress to 400x400 square ratio, quality 0.8, ~30KB
      const compressedDataUrl = await compressLogoOrAvatar(file, 400);
      setFormData(prev => ({
        ...prev,
        avatarUrl: compressedDataUrl
      }));
      setNotification({
        type: 'success',
        message: 'ছবি সফলভাবে আপলোড ও অপ্টিমাইজ করা হয়েছে!'
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
    setIsExplicitSyncing(true);
    try {
      await syncToCloudNow(true);
      setNotification({
        type: 'success',
        message: 'ট্রেনার ও ফ্যাকাল্টি ডাটা ক্লাউডে সফলভাবে সেভ ও সিঙ্ক হয়েছে!'
      });
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'ক্লাউড সিঙ্ক করতে সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট কানেকশন চেক করুন।'
      });
      setTimeout(() => setNotification(null), 3500);
    } finally {
      setIsExplicitSyncing(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter trainer full name.');
      return;
    }

    if (editingTrainerId) {
      updateTrainer(editingTrainerId, formData);
      setNotification({
        type: 'success',
        message: `ট্রেনার "${formData.name}" এর প্রোফাইল সফলভাবে আপডেট করা হয়েছে!`
      });
    } else {
      addTrainer(formData);
      setNotification({
        type: 'success',
        message: `নতুন ট্রেনার "${formData.name}" সফলভাবে তৈরি ও সংরক্ষিত হয়েছে!`
      });
    }
    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete trainer profile "${name}"?`)) {
      deleteTrainer(id);
      setNotification({
        type: 'success',
        message: `ট্রেনার "${name}" সফলভাবে মুছে ফেলা হয়েছে!`
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const toggleCourseAssignment = (courseId: string) => {
    const current = formData.coursesAssigned || [];
    if (current.includes(courseId)) {
      setFormData(prev => ({
        ...prev,
        coursesAssigned: current.filter(c => c !== courseId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        coursesAssigned: [...current, courseId]
      }));
    }
  };

  const addCert = () => {
    if (!certInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), certInput.trim()]
    }));
    setCertInput('');
  };

  const removeCert = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), skillInput.trim()]
    }));
    setSkillInput('');
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index)
    }));
  };

  const filteredTrainers = trainersList.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.shortBio && t.shortBio.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCourse =
      filterCourse === 'ALL' || (t.coursesAssigned && t.coursesAssigned.includes(filterCourse));
    return matchesSearch && matchesCourse;
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

      {/* Top Banner & Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 mb-1">
            <Users className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-wider">Faculty & Mentors</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">Trainer Management & Course Assignment</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Manage comprehensive profiles of faculty members, photos, industry experience, certifications, and dynamically assign multiple trainers to landing pages and batches.
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
            disabled={isExplicitSyncing}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white rounded-2xl font-bold text-xs flex items-center space-x-2 shadow-xs transition-all"
            title="Force immediate sync to Firebase Cloud"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isExplicitSyncing ? 'animate-spin' : ''}`} />
            <span>{isExplicitSyncing ? 'Syncing...' : 'Save & Sync'}</span>
          </button>

          {/* Add Trainer Button */}
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Trainer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search trainers by name, designation, or bio..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <select
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Courses Filter</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trainers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrainers.map(trainer => {
          const assignedCourseObjects = courses.filter(c => trainer.coursesAssigned?.includes(c.id));
          return (
            <div
              key={trainer.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header: Photo + Name + Status */}
                <div className="flex items-start space-x-3.5">
                  <img
                    src={trainer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={trainer.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-slate-900 text-sm truncate">{trainer.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          trainer.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {trainer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-600 font-bold leading-tight mt-0.5">{trainer.designation}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      {trainer.experienceYears} Years Exp • {trainer.companyOrOrg || 'Nexgen Academy'}
                    </p>
                  </div>
                </div>

                {/* Short Bio */}
                <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                  {trainer.shortBio || 'Dedicated faculty mentor at Nexgen Computer Academy.'}
                </p>

                {/* Skills Tags */}
                {trainer.skills && trainer.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {trainer.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                    {trainer.skills.length > 4 && (
                      <span className="text-[10px] font-bold text-indigo-600 px-1 py-0.5">
                        +{trainer.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Assigned Courses Badge List */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Assigned Courses ({assignedCourseObjects.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {assignedCourseObjects.length > 0 ? (
                      assignedCourseObjects.map(c => (
                        <span
                          key={c.id}
                          className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md truncate max-w-[200px]"
                        >
                          {c.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No courses assigned yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-400">
                  {trainer.socialLinks?.linkedin && (
                    <a
                      href={trainer.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-indigo-600"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {trainer.socialLinks?.github && (
                    <a
                      href={trainer.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-slate-900"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {trainer.socialLinks?.facebook && (
                    <a
                      href={trainer.socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blue-600"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => openEditModal(trainer)}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    title="Edit Profile"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(trainer.id, trainer.name)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Trainer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTrainers.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No trainers found matching your search</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search keyword or course filter.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Trainer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl border border-slate-100 space-y-4 my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingTrainerId ? 'Edit Trainer Profile' : 'Add New Faculty Mentor'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Configure profile, photo, bio, skills and assigned courses</p>
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
              {/* Dedicated Trainer Avatar & Photo Upload Section */}
              <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-slate-700 uppercase flex items-center space-x-1.5">
                    <Camera className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Trainer Profile Photo / Avatar *</span>
                  </label>

                  {/* Upload vs URL Mode Switcher */}
                  <div className="flex bg-slate-200/70 p-0.5 rounded-xl text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setAvatarInputMode('upload')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        avatarInputMode === 'upload'
                          ? 'bg-white text-indigo-700 shadow-xs'
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
                          ? 'bg-white text-indigo-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Circular Avatar Preview with Quick Click to Change */}
                  <div className="relative group shrink-0">
                    <img
                      src={formData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                      alt="Trainer Avatar Preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white shadow-md border border-slate-200 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-900/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                      title="Upload New Photo"
                    >
                      <Camera className="w-5 h-5 mb-0.5" />
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
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-xs transition"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploading ? 'Compressing & Processing...' : 'Upload Photo from PC / Device'}</span>
                          </button>
                          {formData.avatarUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData(prev => ({
                                  ...prev,
                                  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                                }))
                              }
                              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          আপনার পিসি বা মোবাইল থেকে ছবি নির্বাচন করুন। স্বয়ংক্রিয়ভাবে অপ্টিমাইজ ও কম্প্রেস (~30KB) হবে।
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={formData.avatarUrl}
                          onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-[11px] text-slate-400">
                          সরাসরি কোনো পাবলিক ইমেজ লিঙ্ক ব্যবহার করতে চাইলে এখানে পেস্ট করুন।
                        </p>
                      </div>
                    )}

                    {formData.avatarUrl?.startsWith('data:image') && (
                      <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>✓ Auto-Compressed & Web-Ready (~30KB)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Trainer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Prodip Chowdhury"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Designation / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Lead Full Stack & Cloud Architect"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experienceYears}
                    onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.companyOrOrg || ''}
                    onChange={e => setFormData({ ...formData, companyOrOrg: e.target.value })}
                    placeholder="e.g. Nexgen Academy / Ex-DevSphere EU"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Phone / Mobile (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +880 1712-345678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. trainer@nexgenacademy.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formData.isActive ? 'Active' : 'Inactive'}
                    onChange={e => setFormData({ ...formData, isActive: e.target.value === 'Active' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Active">Active Faculty</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Short & Detailed Bio */}
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Short Bio (Shows in Cards & Landing Hero)
                </label>
                <textarea
                  rows={2}
                  value={formData.shortBio}
                  onChange={e => setFormData({ ...formData, shortBio: e.target.value })}
                  placeholder="Summary of experience and teaching focus..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Detailed Bio & Industry Experience
                </label>
                <textarea
                  rows={3}
                  value={formData.detailedBio || ''}
                  onChange={e => setFormData({ ...formData, detailedBio: e.target.value })}
                  placeholder="Comprehensive profile background, corporate projects, teaching methodology..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Course Assignment Checkboxes */}
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1.5">
                  Assign to Landing Pages / Courses
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 max-h-40 overflow-y-auto">
                  {courses.map(course => {
                    const isChecked = formData.coursesAssigned?.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        className={`flex items-center space-x-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-indigo-50/80 border-indigo-300 text-indigo-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCourseAssignment(course.id)}
                          className="rounded-sm text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="truncate">{course.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Skills Tags Input */}
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Skills & Technologies
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add skill (e.g. React, Figma, Excel) & press Enter"
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills?.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg flex items-center space-x-1"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(idx)}
                        className="hover:text-rose-600 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications Input */}
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Certifications & Credentials
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={certInput}
                    onChange={e => setCertInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCert();
                      }
                    }}
                    placeholder="Add certification (e.g. AWS Certified, Google Cloud) & press Enter"
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={addCert}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.certifications?.map((c, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg flex items-center space-x-1"
                    >
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={() => removeCert(idx)}
                        className="hover:text-rose-600 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.linkedin || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                      })
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">GitHub / Portfolio</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.github || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, github: e.target.value }
                      })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Facebook</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.facebook || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                      })
                    }
                    placeholder="https://facebook.com/..."
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
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
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTrainerId ? 'Save Profile Changes' : 'Create Trainer Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
