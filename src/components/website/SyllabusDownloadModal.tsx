import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Course } from '../../types';
import { useAcademy } from '../../context/AcademyContext';
import { trackMetaPixelEvent, getCapturedUtmParams } from '../../utils/analyticsTracker';

interface SyllabusDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onOpenAdmission?: (course: Course) => void;
}

export const SyllabusDownloadModal: React.FC<SyllabusDownloadModalProps> = ({
  isOpen,
  onClose,
  course,
  onOpenAdmission
}) => {
  const { addLead, websiteCmsConfig } = useAcademy();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('Student');
  const [preferredBatch, setPreferredBatch] = useState('Next Available Batch');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !course) return null;

  const config = websiteCmsConfig?.syllabusDownloadConfig;
  const fileUrl = course.curriculumFileUrl || course.syllabusPdfUrl || course.landingConfig?.syllabusDownload?.fileUrl;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot bot protection: if hidden field is filled, silently ignore
    if (honeypot.trim().length > 0) {
      setIsSuccess(true);
      return;
    }

    if (!name.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার নাম লিখুন');
      return;
    }

    // Phone validation
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01711223344)');
      return;
    }

    setIsSubmitting(true);

    try {
      const utmParams = getCapturedUtmParams();
      
      addLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        interestedCourseId: course.id,
        courseName: course.name,
        interestedCourse: course.name,
        occupation: (occupation as any) || 'Student',
        educationLevel: 'Not Specified',
        counselorId: '',
        visitDate: new Date().toISOString().split('T')[0],
        firstContactDate: new Date().toISOString().split('T')[0],
        leadSource: 'Website Syllabus Download',
        source: 'Website Syllabus Download',
        status: 'New',
        priority: 'High',
        notes: `সিলেবাস ডাউনলোড করেছেন। পেশা: ${occupation}। ব্যাচ পছন্দ: ${preferredBatch}.`,
        utmSource: utmParams.utm_source || 'direct_website',
        utmMedium: utmParams.utm_medium,
        utmCampaign: utmParams.utm_campaign,
        tags: ['Syllabus Download', course.category || 'General']
      });

      // Track Meta Pixel Event
      const pixelId = websiteCmsConfig?.marketing?.metaPixelId;
      trackMetaPixelEvent('Lead', {
        content_name: `${course.name} - Syllabus Download`,
        content_category: course.category,
        value: 0,
        currency: 'BDT'
      }, pixelId);

      setIsSuccess(true);

      // If file URL exists, auto trigger download or open
      if (fileUrl) {
        setTimeout(() => {
          window.open(fileUrl, '_blank', 'noopener,noreferrer');
        }, 1200);
      }
    } catch (err) {
      console.error('Error recording syllabus download lead:', err);
      setIsSuccess(true); // Still grant access to visitor
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadDirect = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Generate standard syllabus printable summary or print view
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1.5 pr-8">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3 h-3" />
              <span>{config?.modalTitle || 'অফিসিয়াল কোর্স কারিকুলাম ও মডিউল'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black leading-snug text-white">
              {course.name}
            </h3>
            <p className="text-xs text-indigo-200">
              {config?.modalSubtitle || 'সম্পূর্ণ কারিকুলাম, ক্লাস শিডিউল ও প্রজেক্টের তালিকা ডাউনলোড করতে নিচের ফর্মটি পূরণ করুন'}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg font-black text-slate-900">
                  সিলেবাস প্রস্তুত হয়েছে!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {config?.successMessage ||
                    'ধন্যবাদ! আপনার অনুরোধ সংরক্ষিত হয়েছে। নিচের বোতামে ক্লিক করে সিলেবাসটি দেখুন বা ডাউনলোড করুন।'}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 space-y-2.5 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={handleDownloadDirect}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{fileUrl ? 'সিলেবাস PDF ডাউনলোড করুন' : 'কারিকুলাম ভিউ ও প্রিন্ট করুন'}</span>
                </button>

                {onOpenAdmission && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdmission(course);
                    }}
                    className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>এই কোর্সে সরাসরি ভর্তি আবেদন করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-slate-600 underline pt-1 block mx-auto"
                >
                  উইন্ডো বন্ধ করুন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Course Highlights Micro-Box */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span><strong>{course.duration || '৩ মাস'}</strong> মেয়াদী</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span><strong>{course.totalClasses || 36}</strong> টি প্র্যাকটিক্যাল ক্লাস</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span><strong>{course.courseType || 'Offline'}</strong> ফরম্যাট</span>
                </div>
              </div>

              {/* Honeypot anti-spam field (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_url_field">Do not fill this</label>
                <input
                  id="website_url_field"
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  আপনার নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  সচল মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono font-bold">
                    +88
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01711223344"
                    className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400">সিলেবাস লিঙ্ক ও বিস্তারিত ব্যাচ শিডিউল এই নম্বরে পাঠানো হবে</p>
              </div>

              {/* Email & Occupation in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    বর্তমান পেশা
                  </label>
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  >
                    <option value="Student">শিক্ষার্থী / Student</option>
                    <option value="Job Seeker">চাকরি প্রত্যাশী / Job Seeker</option>
                    <option value="Employed">কর্মজীবী / Service Holder</option>
                    <option value="Freelancer">ফ্রিল্যান্সার / Freelancer</option>
                    <option value="Business Owner">উদ্যোক্তা / Business</option>
                  </select>
                </div>
              </div>

              {/* Preferred Batch Timing */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  কোন ব্যাচে ক্লাস করতে আগ্রহী?
                </label>
                <select
                  value={preferredBatch}
                  onChange={(e) => setPreferredBatch(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  <option value="Next Available Batch">আসন্ন পরবর্তী ব্যাচ (আসন সীমিত)</option>
                  <option value="Friday & Saturday (Morning 10 AM)">শুক্রবার ও শনিবার (সকাল ১০টা)</option>
                  <option value="Friday & Saturday (Afternoon 3 PM)">শুক্রবার ও শনিবার (বিকাল ৩টা)</option>
                  <option value="Sun, Tue, Thu (Evening 6:30 PM)">রবি-মঙ্গল-বৃহস্পতি (সন্ধ্যা ৬:৩০)</option>
                  <option value="Online Live Night (9:00 PM)">অনলাইন লাইভ নাইট ব্যাচ (রাত ৯টা)</option>
                </select>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>প্রসেস হচ্ছে...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>{config?.buttonText || 'ইনস্ট্যান্ট সিলেবাস ডাউনলোড করুন'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>আপনার তথ্য ১০০% সুরক্ষিত এবং স্প্যাম-মুক্ত থাকবে।</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
