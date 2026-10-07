import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  X,
  CheckCircle2,
  User,
  Phone,
  Mail,
  BookOpen,
  GraduationCap,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Building2,
  Globe2,
  Check
} from 'lucide-react';
import { Course } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  trackMetaPixelEvent,
  getCapturedUtmParams,
  getDeviceType
} from '../../utils/analyticsTracker';

interface OnlineAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCourse?: Course | null;
  defaultCourseId?: string;
}

export const OnlineAdmissionModal: React.FC<OnlineAdmissionModalProps> = ({
  isOpen,
  onClose,
  preselectedCourse,
  defaultCourseId
}) => {
  const { courses, addLead, submitPublicLead, syncIncomingLeadsNow, academySettings, staffList } = useAcademy();
  const initialCourseId = preselectedCourse?.id || defaultCourseId || courses[0]?.id || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '', // MUST HAVE: Location / District / Area
    courseId: initialCourseId,
    learningMode: 'Offline' as 'Offline' | 'Online Live', // MUST HAVE: Offline vs Online
    notes: ''
  });

  React.useEffect(() => {
    if (preselectedCourse?.id) {
      setFormData(prev => ({ ...prev, courseId: preselectedCourse.id }));
    } else if (defaultCourseId) {
      setFormData(prev => ({ ...prev, courseId: defaultCourseId }));
    }
  }, [preselectedCourse?.id, defaultCourseId]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const primaryPhone = academySettings.primarySupportPhone || '01798444444';

  if (!isOpen) return null;

  const selectedCourse = courses.find(
    c => c.id === formData.courseId || c.code === formData.courseId || c.slug === formData.courseId
  ) || preselectedCourse || courses[0];

  const popularLocations = [
    'ফার্মগেট (ক্যাম্পাস সংলগ্ন)',
    'মিরপুর, ঢাকা',
    'ধানমন্ডি, ঢাকা',
    'উত্তরা, ঢাকা',
    'ঢাকার বাইরে (অন্যান্য জেলা)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    const isBdPhone = /^01[3-9]\d{8}$/.test(cleanPhone) || /^8801[3-9]\d{8}$/.test(cleanPhone);
    if (!isBdPhone) {
      setErrorMessage('অনুগ্রহ করে সঠিক ১১ ডিজিটের সচল মোবাইল নম্বর লিখুন (যেমন: 01712345678)।');
      return;
    }

    if (!formData.location.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার বর্তমান লোকেশন বা জেলা উল্লেখ করুন।');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const todayDate = new Date().toISOString().split('T')[0];
      const utms = getCapturedUtmParams();
      const device = getDeviceType();

      const commentsText = `Online Admission Form (Easy CRO). Mode: ${formData.learningMode}, Location: ${formData.location}. Note: ${formData.notes || 'None'}. Campaign: ${utms.utmCampaign || 'organic'}`;
      const leadSourceStr = utms.utmSource ? `Ad: ${utms.utmSource} (Easy Admission)` : 'Website Online Admission';

      // Allocate counselor
      const activeCounselor = staffList.find(s => s.role === 'COUNSELOR' && s.status === 'Active') ||
        staffList.find(s => s.role === 'COUNSELOR') ||
        staffList.find(s => s.status === 'Active') ||
        staffList[0];
      const counselorId = activeCounselor?.id || 'st-desk';
      const counselorName = activeCounselor ? `${activeCounselor.name} (${activeCounselor.designation || 'Admissions Desk'})` : 'Admissions Desk';

      // 1. Immediately register lead into CRM
      addLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        occupation: 'Student',
        educationLevel: 'HSC / Graduate',
        address: formData.location.trim(),
        interestedCourseId: formData.courseId,
        courseId: formData.courseId,
        courseName: selectedCourse?.name || formData.courseId,
        preferredSchedule: 'Upcoming Batch',
        preferredTime: 'Upcoming Batch',
        learningMode: formData.learningMode,
        preferredLearningMode: formData.learningMode,
        leadSource: leadSourceStr,
        source: leadSourceStr,
        campaignId: utms.utmCampaign,
        utmSource: utms.utmSource,
        utmMedium: utms.utmMedium,
        utmCampaign: utms.utmCampaign,
        utmContent: utms.utmContent,
        utmTerm: utms.utmTerm,
        deviceType: device,
        locationCity: formData.location.trim(),
        counselorId,
        counselorName,
        visitDate: todayDate,
        firstContactDate: todayDate,
        status: 'New',
        comments: `[অনলাইন সিট বুকিং] ${commentsText}`
      });

      // 2. Submit to server endpoint in background
      submitPublicLead({
        fullName: formData.name.trim(),
        studentName: formData.name.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        phoneNumber: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        location: formData.location.trim(),
        address: formData.location.trim(),
        courseName: selectedCourse?.name || formData.courseId,
        courseId: formData.courseId,
        learningMode: formData.learningMode,
        leadSource: leadSourceStr,
        comments: commentsText,
        notes: commentsText,
        source: 'Website Online Admission Form',
        utmSource: utms.utmSource,
        utmMedium: utms.utmMedium,
        utmCampaign: utms.utmCampaign,
        utmContent: utms.utmContent,
        deviceType: device,
        submittedAt: new Date().toISOString()
      }).catch(err => console.warn('Background lead push notice:', err));

      syncIncomingLeadsNow();

      // 3. Track conversion event
      trackMetaPixelEvent('Lead', {
        content_name: selectedCourse?.name || 'Course Admission',
        content_category: selectedCourse?.category || 'IT Training',
        value: selectedCourse?.offerFee || selectedCourse?.regularFee || 0,
        currency: 'BDT'
      });

      setIsSubmitted(true);
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(`আবেদন প্রক্রিয়াকরণে সমস্যা হয়েছে। সরাসরি কল করুন: ${primaryPhone}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      location: '',
      courseId: initialCourseId,
      learningMode: 'Offline',
      notes: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 text-slate-800 my-auto max-h-[94vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center space-x-2.5">
            <NexgenLogo variant="crest" size={36} className="shrink-0 drop-shadow-xs" />
            <div>
              <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center space-x-1.5">
                <span>অনলাইন ভর্তি ও সিট বুকিং</span>
                <span className="text-[10px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                  NexGen
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                মাত্র ১ মিনিটে তথ্য দিয়ে আপনার ব্যাচের সিট নিশ্চিত করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-0.5">
          {isSubmitted ? (
            <div className="text-center py-6 px-2 space-y-3.5">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900">
                আপনার আবেদনটি সফলভাবে জমা হয়েছে!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                ধন্যবাদ, <span className="font-bold text-slate-900">{formData.name}</span>! আপনার{' '}
                <span className="font-bold text-rose-600">{selectedCourse?.name}</span> কোর্সে ভর্তির আবেদন আমাদের সিস্টেমে সংরক্ষিত হয়েছে। আমাদের সিনিয়র কাউন্সেলর দ্রুত আপনাকে{' '}
                <span className="font-bold text-slate-900">{formData.phone}</span> নম্বরে কল করে ব্যাচের সময়সূচি ও ভর্তি নিশ্চিত করবেন।
              </p>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left max-w-sm mx-auto text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">কোর্স:</span>
                  <span className="font-bold text-slate-900">{selectedCourse?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">ক্লাসের মাধ্যম:</span>
                  <span className="font-bold text-indigo-700">
                    {formData.learningMode === 'Offline' ? '🏢 অফলাইন (ফার্মগেট ল্যাব)' : '🌐 অনলাইন (লাইভ জুম)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">আপনার লোকেশন:</span>
                  <span className="font-bold text-slate-800">{formData.location}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500 font-medium">জরুরি হটলাইন:</span>
                  <span className="font-bold text-rose-600">{primaryPhone}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                >
                  উইন্ডো বন্ধ করুন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {errorMessage && (
                <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* 1. Course Selection */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                <label className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                  ১. কাঙ্ক্ষিত কোর্স নির্বাচন করুন *
                </label>
                <select
                  value={formData.courseId}
                  onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-900 font-bold text-xs outline-none focus:border-rose-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — ৳{(c.offerFee || c.regularFee || 0).toLocaleString()} ({c.duration})
                    </option>
                  ))}
                </select>
                {selectedCourse && (
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
                    <span>মেয়াদ: <strong>{selectedCourse.duration}</strong></span>
                    <span className="font-bold text-rose-600 text-xs">
                      ফি: ৳{(selectedCourse.offerFee || selectedCourse.regularFee || 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* 2. MUST-HAVE: Learning Format Selection (Offline vs Online) */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                  ২. ক্লাসের মাধ্যম নির্বাচন করুন (অফলাইন / অনলাইন) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Offline Option */}
                  <div
                    onClick={() => setFormData({ ...formData, learningMode: 'Offline' })}
                    className={`p-2.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-2.5 select-none ${
                      formData.learningMode === 'Offline'
                        ? 'border-rose-600 bg-rose-50/70 text-rose-950 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        formData.learningMode === 'Offline' ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {formData.learningMode === 'Offline' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-xs flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>অফলাইন ক্লাস</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">ফার্মগেট ক্যাম্পাস ল্যাব</p>
                    </div>
                  </div>

                  {/* Online Option */}
                  <div
                    onClick={() => setFormData({ ...formData, learningMode: 'Online Live' })}
                    className={`p-2.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-2.5 select-none ${
                      formData.learningMode === 'Online Live'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        formData.learningMode === 'Online Live' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {formData.learningMode === 'Online Live' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-xs flex items-center space-x-1">
                        <Globe2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>অনলাইন ক্লাস</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">লাইভ জুম + রেকর্ডিং</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Student Personal Information */}
              <div className="space-y-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    ৩. আপনার পুরো নাম *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মো: তানভীর আহমেদ"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs outline-none focus:bg-white focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    ৪. সচল মোবাইল নম্বর *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="যেমন: 01712345678"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs outline-none focus:bg-white focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* 5. MUST-HAVE: Location / District / Area */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 block">
                      ৫. আপনার বর্তমান লোকেশন / জেলা / এলাকা *
                    </label>
                    <span className="text-[10px] text-rose-600 font-bold">অবশ্যই লিখুন</span>
                  </div>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ফার্মগেট, মিরপুর, ধানমন্ডি, চট্টগ্রাম বা আপনার জেলা"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs outline-none focus:bg-white focus:border-rose-500"
                    />
                  </div>

                  {/* Quick selection pills for easy 1-click filling */}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {popularLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setFormData({ ...formData, location: loc })}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                          formData.location === loc
                            ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Note / Message */}
                <div>
                  <label className="font-bold text-slate-600 block mb-1 text-[11px]">
                    কোনো বিশেষ প্রশ্ন বা নোট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: কোন ব্যাচে সিট ফাঁকা আছে জানতে চাই"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs outline-none focus:bg-white focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 bg-gradient-to-r from-[#e11d48] to-[#dc2626] hover:from-[#be123c] hover:to-[#b91c1c] text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98 ${
                    isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'সিট বুকিং নিশ্চিত করুন (Book Seat Now)'}</span>
                </button>

                <p className="text-[10px] text-center text-slate-500 flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                  <span>তথ্য সম্পূর্ণ নিরাপদ • কোনো পেমেন্ট ছাড়াই প্রাথমিক আবেদন সম্পন্ন হবে</span>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
