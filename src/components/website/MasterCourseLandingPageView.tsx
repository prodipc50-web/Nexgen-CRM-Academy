import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Course, TrainerProfile, StudentCourseReview, ClassroomGalleryPhoto } from '../../types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Calendar,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  Phone,
  MessageCircle,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Laptop,
  Briefcase,
  Layers,
  FileText,
  Building,
  GraduationCap,
  X,
  Smartphone,
  Gift,
  Flame,
  HelpCircle,
  Play,
  Edit3,
  Video,
  ExternalLink,
  MapPin,
  Lock,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { OnlineAdmissionModal } from './OnlineAdmissionModal';
import { CourseLandingPageEditorModal } from '../courses/CourseLandingPageEditorModal';
import {
  trackMetaPixelEvent,
  getCapturedUtmParams
} from '../../utils/analyticsTracker';
import {
  cleanWhatsAppNumber,
  getWhatsAppDirectUrl,
  getMessengerDirectUrl
} from '../../utils/whatsappHelper';
import { evaluateFormSubmission } from '../../utils/fraudProtectionEngine';
import { requestNewOtp, verifyOtpSubmission } from '../../utils/otpVerificationEngine';

interface MasterCourseLandingPageViewProps {
  course: Course;
  onBackToFullWebsite?: () => void;
}

export const MasterCourseLandingPageView: React.FC<MasterCourseLandingPageViewProps> = ({
  course,
  onBackToFullWebsite
}) => {
  const { websiteCmsConfig, staffList, addLead } = useAcademy();
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Fast Lead Inline Form States
  const [formRenderTime] = useState<number>(Date.now());
  const [honeypot, setHoneypot] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSchedule, setLeadSchedule] = useState('Weekend (Fri-Sat)');
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Verification States
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSimulatedCode, setOtpSimulatedCode] = useState<string | null>(null);
  const [otpError, setOtpError] = useState('');
  const [otpNotice, setOtpNotice] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const landingConfig = course.landingConfig || {};
  const pixelId = websiteCmsConfig?.marketing?.metaPixelId;
  const fraudConfig = websiteCmsConfig?.fraudProtection;
  const otpConfig = websiteCmsConfig?.otpConfig;

  // Track ViewContent on mount
  useEffect(() => {
    trackMetaPixelEvent(
      'ViewContent',
      {
        content_name: course.name,
        content_category: course.category,
        content_ids: [course.id],
        content_type: 'product',
        value: course.offerFee || course.regularFee,
        currency: 'BDT'
      },
      pixelId
    );
  }, [course.id, course.name, course.category, course.offerFee, course.regularFee, pixelId]);

  // Assigned Faculty/Trainers
  const allTrainers: TrainerProfile[] = websiteCmsConfig?.trainersList || [];
  const assignedTrainers = allTrainers.filter(t => t.coursesAssigned?.includes(course.id) && t.isActive);
  const fallbackTrainers = allTrainers.filter(t => t.isActive).slice(0, 2);
  const displayTrainers = assignedTrainers.length > 0 ? assignedTrainers : fallbackTrainers;

  // Associated Reviews
  const allReviews: StudentCourseReview[] = websiteCmsConfig?.studentCourseReviews || [];
  const assignedReviews = allReviews.filter(r => r.courseId === course.id && r.isActive);
  const displayReviews = assignedReviews.length > 0 ? assignedReviews : allReviews.filter(r => r.isActive).slice(0, 3);

  // Associated Lab Gallery Photos
  const allPhotos: ClassroomGalleryPhoto[] = websiteCmsConfig?.classroomGalleryPhotos || [];
  const displayPhotos = allPhotos.filter(p => p.isActive).slice(0, 6);

  // Computed Discount
  const discountPercent =
    course.regularFee && course.offerFee && course.regularFee > course.offerFee
      ? Math.round(((course.regularFee - course.offerFee) / course.regularFee) * 100)
      : 40;

  // WhatsApp & Messenger links
  const rawPhone =
    landingConfig.customWhatsAppNumber ||
    websiteCmsConfig?.marketing?.floatingWhatsAppNumber ||
    '01798444444';
  const defaultWhatsAppMsg =
    landingConfig.customWhatsAppMessage ||
    `Hello Nexgen Academy! I want to enroll in "${course.name}" with the special discount.`;
  const whatsAppUrl = getWhatsAppDirectUrl(rawPhone, defaultWhatsAppMsg);

  const rawMessenger =
    landingConfig.customMessengerUrl ||
    websiteCmsConfig?.socialLinks?.facebookPageUrl ||
    'https://m.me/nexgenacademy';
  const messengerUrl = getMessengerDirectUrl(rawMessenger);

  const handleWhatsAppClick = () => {
    trackMetaPixelEvent(
      'Contact',
      {
        channel: 'WhatsApp Direct',
        course_name: course.name,
        phone: rawPhone
      },
      pixelId
    );
  };

  const handleMessengerClick = () => {
    trackMetaPixelEvent(
      'Contact',
      {
        channel: 'Messenger Direct',
        course_name: course.name
      },
      pixelId
    );
  };

  const handleShareClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  // Process Lead Submission
  const processLeadRegistration = () => {
    const utms = getCapturedUtmParams();
    const today = new Date().toISOString().split('T')[0];

    addLead({
      name: leadName.trim(),
      phone: leadPhone.trim(),
      email: leadEmail.trim() || undefined,
      interestedCourseId: course.id,
      leadSource: utms.utmSource ? `Ad: ${utms.utmSource}` : 'Course Landing Fast Form',
      campaignId: utms.utmCampaign,
      utmSource: utms.utmSource,
      utmMedium: utms.utmMedium,
      utmCampaign: utms.utmCampaign,
      utmContent: utms.utmContent,
      utmTerm: utms.utmTerm,
      deviceType: 'Mobile',
      locationCity: 'Dhaka',
      occupation: 'Student',
      educationLevel: 'HSC / Graduate',
      counselorId: 'counselor-01',
      counselorName: 'Online Admission Cell',
      visitDate: today,
      firstContactDate: today,
      status: 'New',
      comments: `Fast Inquiry on Course Landing Page. Schedule: ${leadSchedule}. Discount Code: ${landingConfig.customDiscountBadge || 'NEXGEN2026'}.`
    });

    trackMetaPixelEvent(
      'Lead',
      {
        content_name: course.name,
        value: course.offerFee || 0,
        currency: 'BDT'
      },
      pixelId
    );

    setLeadSuccess(true);
    setIsSubmitting(false);
  };

  const handleFastLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError('');
    setIsSubmitting(true);

    // 1. Evaluate Multi-layer Fraud & Honeypot
    const evaluation = evaluateFormSubmission({
      fullName: leadName,
      phone: leadPhone,
      email: leadEmail,
      honeypotVal: honeypot,
      formRenderTimeMs: formRenderTime,
      config: fraudConfig
    });

    if (evaluation.isBlocked) {
      setLeadError('Your submission could not be processed due to high security risk. Please call helpline directly.');
      setIsSubmitting(false);
      return;
    }

    // 2. Check if OTP is Required (e.g. Mode ON or High Risk trigger)
    const shouldVerifyOtp =
      otpConfig?.mode === 'ON' ||
      (otpConfig?.mode === 'HIGH_RISK_ONLY' && evaluation.requiresOtpOrCaptcha);

    if (shouldVerifyOtp) {
      const otpResp = requestNewOtp(leadPhone, otpConfig);
      if (!otpResp.success) {
        setLeadError(otpResp.message);
        setIsSubmitting(false);
        return;
      }

      setOtpSimulatedCode(otpResp.simulatedCode || null);
      setOtpNotice(otpResp.message);
      setIsOtpModalOpen(true);
      setIsSubmitting(false);
      return;
    }

    // Otherwise proceed directly
    processLeadRegistration();
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setIsVerifyingOtp(true);

    const verifyResp = verifyOtpSubmission(leadPhone, otpCode);
    if (!verifyResp.success) {
      setOtpError(verifyResp.message);
      setIsVerifyingOtp(false);
      return;
    }

    setIsVerifyingOtp(false);
    setIsOtpModalOpen(false);
    processLeadRegistration();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white pb-24 sm:pb-20">
      {/* Top Floating Admin Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          {onBackToFullWebsite && (
            <button
              onClick={onBackToFullWebsite}
              className="flex items-center space-x-1.5 text-slate-300 hover:text-white font-bold transition-colors"
            >
              <span>← Main Academy Website</span>
            </button>
          )}
          <span className="hidden sm:inline-block text-slate-500">•</span>
          <span className="hidden sm:inline-flex items-center space-x-1 text-indigo-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Landing Page & CRM Synchronization Active</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShareClick}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center space-x-1"
            title="Copy Ad Landing Link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{copiedUrl ? 'Copied!' : 'Share Link'}</span>
          </button>
          <button
            onClick={() => setIsEditorOpen(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center space-x-1.5 shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Page Content</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO & MAIN CTA */}
      <header className="relative pt-8 pb-16 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline, Subheadline, Guarantee & Badges */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{landingConfig.heroBadge || '🚀 স্পেশাল স্কলারশিপ ব্যাচ অ্যাডমিশন শুরু'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight sm:leading-none tracking-tight">
              {landingConfig.headline || course.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
              {landingConfig.subheadline ||
                course.description ||
                '১০০% প্র্যাকটিক্যাল কম্পিউটার ল্যাব ট্রেনিং, লাইভ মার্কেটপ্লেস ও প্রজেক্ট সাপোর্ট এবং চাকরি ও ফ্রিল্যান্সিং গাইডলাইন।'}
            </p>

            {/* Micro Highlights Pill */}
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>{course.durationMonths} মাস প্র্যাকটিক্যাল ট্রেনিং</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200">
                <Laptop className="w-4 h-4 text-emerald-400" />
                <span>ডেডিকেটেড হাই-কনফিগ পিসি ল্যাব</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200">
                <Award className="w-4 h-4 text-amber-400" />
                <span>ভেরিফায়েবল সার্টিফিকেট</span>
              </div>
            </div>

            {/* Pricing Box & Countdown Card */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/30 rounded-3xl space-y-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  ৳{(course.offerFee || 6500).toLocaleString()}
                </span>
                {course.regularFee && (
                  <span className="text-lg text-slate-400 line-through font-semibold">
                    ৳{course.regularFee.toLocaleString()}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-black">
                  {discountPercent}% স্কলারশিপ ছাড়
                </span>
              </div>

              {landingConfig.showBatchCountdown && (
                <div className="flex items-center justify-between text-xs text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-2xl">
                  <span>পরবর্তী ব্যাচ শুরু: {landingConfig.nextBatchStartDate || '১৫ মে, ২০২৬'}</span>
                  <span>বাকি সিট: {landingConfig.availableSeats || 8} টি</span>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={() => setIsAdmissionOpen(true)}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-black text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>এখনই অনলাইনে ভর্তি হন</span>
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleWhatsAppClick}
                  className="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp এ কথা বলুন</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Fast Registration Card + Fraud Honeypot */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-left">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-black text-base text-white">ফ্রি ক্যারিয়ার কাউন্সেলিং ও সিট বুকিং</h3>
              </div>
              <p className="text-xs text-slate-400">
                আপনার নাম ও মোবাইল নাম্বার দিন, আমাদের সিনিয়র মেন্টর সরাসরি কল দিয়ে স্কলারশিপ কোড কনফার্ম করবেন।
              </p>

              {leadSuccess ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-black text-white text-sm">ধন্যবাদ! আপনার রিকোয়েস্ট গ্রহণ করা হয়েছে।</h4>
                  <p className="text-xs text-slate-300">
                    আমাদের ক্যারিয়ার কাউন্সেলর টিম দ্রুত আপনার সাথে যোগাযোগ করবে।
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFastLeadSubmit} className="space-y-3">
                  {/* Invisible Honeypot */}
                  <input
                    type="text"
                    name="website_url_trap"
                    value={honeypot}
                    onChange={e => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                  />

                  {leadError && (
                    <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200 font-bold flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{leadError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-black text-slate-300 uppercase mb-1">
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={e => setLeadName(e.target.value)}
                      placeholder="e.g. মোঃ সাকিব হাসান"
                      className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-300 uppercase mb-1">
                      সচল মোবাইল নাম্বার (১১ ডিজিট) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={e => setLeadPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">
                        ইমেইল (ঐচ্ছিক)
                      </label>
                      <input
                        type="email"
                        value={leadEmail}
                        onChange={e => setLeadEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">
                        পছন্দের শিডিউল
                      </label>
                      <select
                        value={leadSchedule}
                        onChange={e => setLeadSchedule(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
                      >
                        <option value="Weekend (Fri-Sat)">উইকেন্ড (শুক্র-শনিবার)</option>
                        <option value="Weekday Evening">সান্ধ্যকালীন ব্যাচ</option>
                        <option value="Morning Batch">সকালকালীন ব্যাচ</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all mt-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>ফ্রি কাউন্সেলিং বুক করুন</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-500 text-center">
                    🔒 সম্পূর্ণ গোপনীয় ও সুরক্ষিত। স্প্যামমুক্ত গ্যারান্টি।
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 2: CURRICULUM MODULES BUILDER */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold">
            <BookOpen className="w-4 h-4" />
            <span>সিলেবাস ও প্রজেক্ট কারিকুলাম</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            হাতে-কলমে যা যা শেখানো হবে (১০০% প্র্যাকটিক্যাল ল্যাব)
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            বেসিক থেকে ইন্ডাস্ট্রি লেভেল প্রজেক্ট পর্যন্ত সম্পূর্ণ স্টেপ-বাই-স্টেপ গাইডলাইন
          </p>
        </div>

        <div className="space-y-3">
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((mod, idx) => {
              const isOpen = openModuleIndex === idx;
              return (
                <div
                  key={mod.id || idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenModuleIndex(isOpen ? null : idx)}
                    className="w-full p-4.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center space-x-3.5">
                      <span className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-sm">{mod.moduleName}</h4>
                        <p className="text-xs text-slate-400">{mod.estimatedClasses ? `${mod.estimatedClasses} Classes` : '৪টি প্র্যাকটিক্যাল সেশন'}</p>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 pt-1 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
                      {mod.moduleDescription && (
                        <p className="text-xs text-slate-300 leading-relaxed">{mod.moduleDescription}</p>
                      )}
                      {mod.topics && mod.topics.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          {mod.topics.map((t, tidx) => (
                            <div
                              key={tidx}
                              className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-xl"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400">এই কোর্সের সিলেবাস অ্যাডমিন প্যানেল থেকে কনফিগার করুন।</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: TRAINERS & FACULTY */}
      <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold">
            <Users className="w-4 h-4" />
            <span>ইন্ডাস্ট্রি এক্সপার্ট ট্রেইনার</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">আপনার মেন্টর ও ফ্যাকাল্টি প্যানেল</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            বাস্তব সফটওয়্যার ফার্ম ও টপ-রেটেড ফ্রিল্যান্সিংয়ে দীর্ঘদিনের অভিজ্ঞ মেন্টরদের সরাসরি গাইডেন্স
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayTrainers.map(trainer => (
            <div
              key={trainer.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5"
            >
              <img
                src={trainer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={trainer.name}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/30 shrink-0"
              />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-white text-base">{trainer.name}</h4>
                  <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                    {trainer.experienceYears} Years Exp
                  </span>
                </div>
                <p className="text-xs text-indigo-400 font-bold">{trainer.designation}</p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{trainer.shortBio}</p>
                {trainer.skills && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {trainer.skills.slice(0, 4).map((s, sidx) => (
                      <span key={sidx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: STUDENT REVIEWS & TESTIMONIALS */}
      <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>শিক্ষার্থীদের মতামত ও সাফল্য</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">আমাদের গ্র্যাজুয়েটরা যা বলছেন</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayReviews.map(rev => (
            <div
              key={rev.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.studentPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={rev.studentName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-400/30"
                    />
                    <div>
                      <h4 className="font-bold text-white text-xs">{rev.studentName}</h4>
                      <p className="text-[10px] text-slate-400">{rev.profession || 'Student'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-0.5 text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="text-xs font-bold">{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.reviewText}"</p>
              </div>

              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                {rev.batchNumber} • {rev.location}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: CLASSROOM & LAB GALLERY */}
      <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
            <Laptop className="w-4 h-4" />
            <span>ল্যাব ও ক্যাম্পাস এনভায়রনমেন্ট</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">প্র্যাকটিক্যাল ল্যাব সেশনের কিছু মুহূর্ত</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {displayPhotos.map(photo => (
            <div
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-4/3"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <span className="text-xs font-bold text-white">{photo.title}</span>
                <span className="text-[10px] text-slate-300">{photo.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STICKY BOTTOM MOBILE ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 p-3 sm:hidden backdrop-blur-md flex items-center justify-between gap-2">
        <div className="pl-1">
          <div className="text-xs text-slate-400 font-bold">কোর্স ফি</div>
          <div className="text-base font-black text-white">৳{(course.offerFee || 6500).toLocaleString()}</div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noreferrer"
            onClick={handleWhatsAppClick}
            className="p-3 rounded-xl bg-emerald-600 text-white shadow-md"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <button
            onClick={() => setIsAdmissionOpen(true)}
            className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-md flex items-center space-x-1.5"
          >
            <span>ভর্তি কনফার্ম করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Online Admission Modal */}
      {isAdmissionOpen && (
        <OnlineAdmissionModal
          isOpen={isAdmissionOpen}
          onClose={() => setIsAdmissionOpen(false)}
          preselectedCourse={course}
        />
      )}

      {/* Landing Page Content Editor Modal */}
      {isEditorOpen && (
        <CourseLandingPageEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          course={course}
        />
      )}

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">OTP সিকিউরিটি ভেরিফিকেশন</h3>
              <p className="text-xs text-slate-400 mt-1">{otpNotice || `${leadPhone} নাম্বারে ৬ ডিজিটের কোড পাঠানো হয়েছে`}</p>
              {otpSimulatedCode && (
                <div className="mt-2 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs font-mono text-indigo-300 font-bold">
                  Simulated Code: {otpSimulatedCode}
                </div>
              )}
            </div>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-3">
              {otpError && (
                <div className="p-2 bg-rose-500/20 text-rose-200 text-xs font-bold rounded-xl">{otpError}</div>
              )}
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                placeholder="XXXXXX"
                className="w-full text-center tracking-widest text-lg font-bold font-mono py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black"
                >
                  {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
