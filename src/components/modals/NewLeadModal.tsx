import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { OccupationType, LeadStatus } from '../../types';
import { X, UserPlus, Phone, BookOpen, Calendar, CheckCircle2, Tag, Layers } from 'lucide-react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose }) => {
  const {
    leads,
    courses,
    batches,
    staffList,
    campaigns,
    occupationsList,
    educationLevelsList,
    leadSourcesList,
    crmSettings,
    addLead
  } = useAcademy();

  const dynamicSources = (crmSettings?.leadSources && crmSettings.leadSources.length > 0)
    ? crmSettings.leadSources
    : (leadSourcesList || []);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState<OccupationType>(occupationsList[0] || 'Student (School / College / University)');
  const [educationLevel, setEducationLevel] = useState(educationLevelsList[0] || 'HSC / Higher Secondary (Class 12)');
  const [institution, setInstitution] = useState('');
  const [interestedCourseId, setInterestedCourseId] = useState(courses[0]?.id || '');
  const [interestedBatchId, setInterestedBatchId] = useState('');
  const [preferredTime, setPreferredTime] = useState('Evening');
  const [leadSource, setLeadSource] = useState(dynamicSources[0] || 'Facebook Ads');
  const [campaignId, setCampaignId] = useState('');
  const [counselorId, setCounselorId] = useState(staffList.find(s => s.role === 'COUNSELOR')?.id || staffList[0]?.id || '');
  const [counselorName, setCounselorName] = useState(staffList.find(s => s.role === 'COUNSELOR')?.name || staffList[0]?.name || '');
  const [budget, setBudget] = useState<number>(12000);
  const [status, setStatus] = useState<LeadStatus>('New');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [comments, setComments] = useState('');
  const [requirements, setRequirements] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [nextFollowUpNotes, setNextFollowUpNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const [formError, setFormError] = useState('');

  // Reset all fields to clear initial state
  const resetForm = () => {
    setName('');
    setPhone('');
    setAltPhone('');
    setEmail('');
    setAddress('');
    setInstitution('');
    setInterestedBatchId('');
    setPreferredTime('Evening');
    setCampaignId('');
    setBudget(12000);
    setStatus('New');
    setVisitDate(new Date().toISOString().split('T')[0]);
    setComments('');
    setRequirements('');
    setNextFollowUpDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setNextFollowUpNotes('');
    setSelectedTags([]);
    setCustomFieldValues({});
    setFormError('');
    if (courses.length > 0) {
      setInterestedCourseId(courses[0].id);
    }
    const defCounselor = staffList.find(s => s.role === 'COUNSELOR') || staffList[0];
    if (defCounselor) {
      setCounselorId(defCounselor.id);
      setCounselorName(defCounselor.name);
    }
  };

  // Reset form each time the modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Ensure course is populated if loaded asynchronously
  useEffect(() => {
    if (!interestedCourseId && courses.length > 0) {
      setInterestedCourseId(courses[0].id);
    }
  }, [courses, interestedCourseId]);

  // Real-time duplicate phone check (only trigger once full 11 digits are entered)
  const cleanPhoneDigits = phone.replace(/[^0-9]/g, '').slice(-11);
  const duplicateLead = cleanPhoneDigits.length >= 11
    ? leads.find(l => {
        const existingClean = l.phone.replace(/[^0-9]/g, '').slice(-11);
        const existingAltClean = (l.altPhone || '').replace(/[^0-9]/g, '').slice(-11);
        return existingClean === cleanPhoneDigits || existingAltClean === cleanPhoneDigits;
      })
    : null;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError('অনুগ্রহ করে লিডের পূর্ণ নাম লিখুন।');
      return;
    }
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 11) {
      setFormError('অনুগ্রহ করে সঠিক মোবাইল নম্বর প্রদান করুন (কমপক্ষে ১১ ডিজিট, যেমন: 017XXXXXXXX)।');
      return;
    }
    if (!interestedCourseId) {
      setFormError('অনুগ্রহ করে পছন্দের কোর্স নির্বাচন করুন।');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const selectedCourse = courses.find(c => c.id === interestedCourseId);

    addLead({
      name: trimmedName,
      phone: phone.trim(),
      altPhone: altPhone.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      occupation,
      educationLevel,
      institution: institution.trim() || undefined,
      interestedCourseId,
      courseName: selectedCourse?.name,
      interestedBatchId: interestedBatchId || undefined,
      preferredTime,
      leadSource,
      campaignId: campaignId || undefined,
      counselorId,
      counselorName: counselorName.trim() || staffList.find(s => s.id === counselorId)?.name || undefined,
      visitDate: visitDate || todayStr,
      firstContactDate: visitDate || todayStr,
      comments: comments.trim() || undefined,
      requirements: requirements.trim() || undefined,
      budget: budget || undefined,
      status,
      nextFollowUpDate: nextFollowUpDate || undefined,
      nextFollowUpNotes: nextFollowUpNotes.trim() || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      customFieldValues: Object.keys(customFieldValues).length > 0 ? customFieldValues : undefined
    });

    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-6 animate-in zoom-in-95 duration-150 max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Register New Visitor / Lead</h3>
              <p className="text-xs text-blue-200">Log walk-in visitor, phone inquiry, or social media lead</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold flex items-center justify-between text-xs">
              <span>⚠️ {formError}</span>
              <button
                type="button"
                onClick={() => setFormError('')}
                className="text-rose-500 hover:text-rose-700 font-black ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {duplicateLead && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-950 rounded-xl flex items-start space-x-3 text-xs animate-in fade-in">
              <span className="text-lg leading-none shrink-0">⚠️</span>
              <div className="flex-1 space-y-1">
                <div className="font-bold flex items-center justify-between">
                  <span>এই ফোন নম্বরে ইতিমধ্যে একজন লিড সিস্টেমে এন্ট্রি করা আছে!</span>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-mono text-[10px]">
                    {duplicateLead.leadCode}
                  </span>
                </div>
                <p className="text-slate-700 text-[11px]">
                  নাম: <strong className="text-slate-900">{duplicateLead.name}</strong> • স্ট্যাটাস: <span className="font-bold text-indigo-700">{duplicateLead.status}</span> • কোর্স: {courses.find(c => c.id === duplicateLead.interestedCourseId)?.name || 'N/A'} • ফোন: <span className="font-mono font-semibold">{duplicateLead.phone}</span>
                </p>
                <p className="text-[10.5px] text-amber-800 italic">
                  💡 পরামর্শ: পুনরায় নতুন লিড যুক্ত না করে আগের লিডটির হিস্ট্রি বা ফলো-আপ আপডেট করতে পারেন।
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Md. Tariqul Islam"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Primary Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="+880 17..."
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Alt Phone / WhatsApp</label>
              <input
                type="text"
                placeholder="+880 19..."
                value={altPhone}
                onChange={e => setAltPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                placeholder="lead@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Occupation</label>
              <select
                value={occupation}
                onChange={e => setOccupation(e.target.value as OccupationType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {occupationsList.map(occ => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
                {!occupationsList.includes(occupation) && occupation && (
                  <option value={occupation}>{occupation}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={e => setEducationLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {educationLevelsList.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
                {!educationLevelsList.includes(educationLevel) && educationLevel && (
                  <option value={educationLevel}>{educationLevel}</option>
                )}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-semibold mb-1">Institution / College</label>
              <input
                type="text"
                placeholder="e.g. Dhaka Commerce College"
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Residential Address</label>
              <input
                type="text"
                placeholder="e.g. Mirpur-10, Dhaka"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Academic Interest */}
          <div className="pt-3 border-t border-slate-200">
            <div className="font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Interest & Marketing Source
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Interested Course <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={interestedCourseId}
                  onChange={e => setInterestedCourseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (৳{c.offerFee.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Visit / Contact Date (ভিজিট তারিখ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={e => setVisitDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Preferred Batch / Time</label>
                <input
                  type="text"
                  placeholder="e.g. Evening (6 PM - 8 PM) / Sun-Tue"
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Initial Pipeline Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as LeadStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interested">Interested</option>
                  <option value="Demo Scheduled">Demo Scheduled</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Admission Pending">Admission Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Lead Source</label>
                <select
                  value={leadSource}
                  onChange={e => setLeadSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {dynamicSources.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                  {!dynamicSources.includes(leadSource) && leadSource && (
                    <option value={leadSource}>{leadSource}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Assigned Counselor (ম্যানুয়াল নাম লিখুন / সিলেক্ট করুন)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mahfuzur Rahman"
                  value={counselorName}
                  onChange={e => {
                    setCounselorName(e.target.value);
                    const matched = staffList.find(s => s.name.toLowerCase() === e.target.value.toLowerCase());
                    if (matched) setCounselorId(matched.id);
                  }}
                  list="new-lead-counselors-list"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <datalist id="new-lead-counselors-list">
                  {staffList.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.role.replace('_', ' ')})
                    </option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Candidate Budget (৳)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Tags Selector */}
          {crmSettings?.tags && crmSettings.tags.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="font-semibold text-slate-800 text-xs flex items-center space-x-1.5 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span>লিড ট্যাগ নির্বাচন করুন (Tags)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {crmSettings.tags.map(tag => {
                  const isSelected = selectedTags.includes(tag.name);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setSelectedTags(prev =>
                          prev.includes(tag.name)
                            ? prev.filter(t => t !== tag.name)
                            : [...prev, tag.name]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag.name}</span>
                      {isSelected && <CheckCircle2 className="w-3 h-3 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Custom Fields Section */}
          {crmSettings?.customFields && crmSettings.customFields.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
              <div className="font-semibold text-slate-800 text-xs flex items-center space-x-1.5 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>অতিরিক্ত কাস্টম ফিল্ড ডেটা (Custom Fields)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {crmSettings.customFields.map(field => {
                  const val = customFieldValues[field.key] ?? field.defaultValue ?? '';

                  if (field.type === 'boolean') {
                    return (
                      <div key={field.id} className="flex items-center space-x-2 pt-2">
                        <input
                          type="checkbox"
                          id={`cf-${field.id}`}
                          checked={Boolean(val)}
                          onChange={e =>
                            setCustomFieldValues(prev => ({
                              ...prev,
                              [field.key]: e.target.checked
                            }))
                          }
                          className="w-4 h-4 rounded-md text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <label
                          htmlFor={`cf-${field.id}`}
                          className="text-xs font-bold text-slate-700 cursor-pointer"
                        >
                          {field.label} {field.required && <span className="text-rose-500">*</span>}
                        </label>
                      </div>
                    );
                  }

                  if (field.type === 'select') {
                    return (
                      <div key={field.id}>
                        <label className="block text-slate-600 text-xs font-bold mb-1">
                          {field.label} {field.required && <span className="text-rose-500">*</span>}
                        </label>
                        <select
                          required={field.required}
                          value={val}
                          onChange={e =>
                            setCustomFieldValues(prev => ({
                              ...prev,
                              [field.key]: e.target.value
                            }))
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          <option value="">সিলেক্ট করুন...</option>
                          {(field.options || []).map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  if (field.type === 'textarea') {
                    return (
                      <div key={field.id} className="sm:col-span-2">
                        <label className="block text-slate-600 text-xs font-bold mb-1">
                          {field.label} {field.required && <span className="text-rose-500">*</span>}
                        </label>
                        <textarea
                          rows={2}
                          required={field.required}
                          placeholder={field.placeholder || ''}
                          value={val}
                          onChange={e =>
                            setCustomFieldValues(prev => ({
                              ...prev,
                              [field.key]: e.target.value
                            }))
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={field.id}>
                      <label className="block text-slate-600 text-xs font-bold mb-1">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                        required={field.required}
                        placeholder={field.placeholder || ''}
                        value={val}
                        onChange={e =>
                          setCustomFieldValues(prev => ({
                            ...prev,
                            [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value
                          }))
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Follow-up Scheduler */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 space-y-3">
            <div className="font-semibold text-blue-900 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Next Follow-up Task (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Next Follow-up Date</label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={e => setNextFollowUpDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Follow-up Notes / Next Action</label>
                <input
                  type="text"
                  placeholder="e.g. Call back on Tuesday regarding demo seat"
                  value={nextFollowUpNotes}
                  onChange={e => setNextFollowUpNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* Visitor Comments & Statement */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Visitor Comments & Statement / সে কী বলেছে (Visitor Remarks)
            </label>
            <textarea
              rows={3}
              placeholder="ভিজিটর কী বলেছেন, কী কোর্স শিখতে চান, কী প্রশ্ন বা মন্তব্য করেছেন (e.g. Visitor wants morning batch, asked about installments and certificate value)..."
              value={comments}
              onChange={e => setComments(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Lead to CRM</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
