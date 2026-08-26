import React, { useState } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { TrainerProfile } from '../../../types';
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
  Filter
} from 'lucide-react';

export const CmsTrainersTab: React.FC = () => {
  const {
    trainersList,
    addTrainer,
    updateTrainer,
    deleteTrainer,
    courses
  } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('ALL');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainerId, setEditingTrainerId] = useState<string | null>(null);

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
    setFormData({
      name: t.name,
      designation: t.designation,
      avatarUrl: t.avatarUrl,
      phone: t.phone || '',
      email: t.email || '',
      shortBio: t.shortBio,
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter trainer full name.');
      return;
    }

    if (editingTrainerId) {
      updateTrainer(editingTrainerId, formData);
    } else {
      addTrainer(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete trainer profile "${name}"?`)) {
      deleteTrainer(id);
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
      {/* Top Banner & Action */}
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
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Trainer</span>
        </button>
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
                  <p className="text-[11px] text-slate-400">Configure profile, bio, skills and assigned courses</p>
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
                    Avatar Photo URL
                  </label>
                  <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-sm transition-all"
                >
                  {editingTrainerId ? 'Save Profile Changes' : 'Create Trainer Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
