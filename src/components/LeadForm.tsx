import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Lock,
  RefreshCw,
  PhoneCall,
  KeyRound,
  Sparkles,
  Clock,
  BookOpen,
  MapPin,
  GraduationCap,
  Briefcase,
  Mail,
  User,
  MessageSquare
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { Course, Lead, LeadFormFieldSetting } from '../types';
import { trackMetaPixelEvent, generateEventId } from '../utils/analyticsTracker';

interface LeadFormProps {
  courseId?: string;
  courseName?: string;
  preferredSchedule?: string;
  learningMode?: 'Offline' | 'Online Live' | 'Hybrid';
  landingPageUrl?: string;
  source?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  onSuccess?: (lead: Lead) => void;
  className?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  courseId: initialCourseId,
  courseName: initialCourseName,
  preferredSchedule: initialSchedule,
  learningMode: initialLearningMode,
  landingPageUrl,
  source = 'Website Form',
  title,
  subtitle,
  compact = false,
  onSuccess,
  className = ''
}) => {
  const { courses, websiteCmsConfig, submitPublicLead } = useAcademy();
  const formConfig = websiteCmsConfig.leadFormConfig;
  const fraudConfig = websiteCmsConfig.fraudProtection;
  const otpConfig = websiteCmsConfig.otpConfig;

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    phone: '',
    email: '',
    address: '',
    education: '',
    institution: '',
    profession: 'Student',
    courseId: initialCourseId || '',
    preferredSchedule: initialSchedule || '',
    learningMode: initialLearningMode || formConfig?.defaultLearningMode || 'Offline',
    message: ''
  });

  // Anti-bot & Security State
  const [honeypot, setHoneypot] = useState('');
  const [renderTimestamp] = useState<number>(() => Date.now());
  const [captchaChallenge, setCaptchaChallenge] = useState<{ num1: number; num2: number; expected: number }>({ num1: 5, num2: 3, expected: 8 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(formConfig?.enableCaptcha || fraudConfig?.captchaMode === 'ON');

  // OTP State
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSessionId, setOtpSessionId] = useState('');
  const [otpTimerSeconds, setOtpTimerSeconds] = useState(0);
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(3);
  const [otpSimulatedCode, setOtpSimulatedCode] = useState<string | null>(null);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Status & Feedback State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successLead, setSuccessLead] = useState<Lead | null>(null);
  const [isDuplicateSubmitted, setIsDuplicateSubmitted] = useState(false);

  // Synchronize initial course props
  useEffect(() => {
    if (initialCourseId) {
      setFormData(prev => ({
        ...prev,
        courseId: initialCourseId,
        preferredSchedule: initialSchedule || prev.preferredSchedule,
        learningMode: initialLearningMode || prev.learningMode
      }));
    } else if (courses.length > 0 && !formData.courseId) {
      setFormData(prev => ({ ...prev, courseId: courses[0].id }));
    }
  }, [initialCourseId, initialSchedule, initialLearningMode, courses]);

  // Generate new math captcha
  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 1;
    setCaptchaChallenge({ num1: n1, num2: n2, expected: n1 + n2 });
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (otpTimerSeconds > 0) {
      interval = setInterval(() => {
        setOtpTimerSeconds(sec => sec - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpTimerSeconds]);

  // Parse UTM parameters from browser URL
  const utmParams = useMemo(() => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
      utmContent: params.get('utm_content') || undefined,
      utmTerm: params.get('utm_term') || undefined,
      fbclid: params.get('fbclid') || undefined
    };
  }, []);

  // Selected Course details
  const selectedCourse = useMemo(() => {
    return courses.find(c => c.id === formData.courseId) || courses[0];
  }, [courses, formData.courseId]);

  // Available Schedules for course
  const availableSchedules = useMemo(() => {
    if (!selectedCourse) return [];
    const schedules: string[] = [];
    if (selectedCourse.landingConfig?.preferredSchedules && selectedCourse.landingConfig.preferredSchedules.length > 0) {
      selectedCourse.landingConfig.preferredSchedules.forEach(s => schedules.push(`${s.label}${s.timeSlot ? ` (${s.timeSlot})` : ''}`));
    }
    if (schedules.length === 0) {
      schedules.push('শুক্রবার ও শনিবার (সকাল ১০:০০ - ১২:০০)', 'রবি, মঙ্গল, বৃহস্পতি (সন্ধ্যা ৬:৩০ - ৮:৩০)', 'সোম ও বুধ (বিকাল ৩:০০ - ৫:০০)');
    }
    return Array.from(new Set(schedules));
  }, [selectedCourse]);

  // Sorted and filtered enabled fields
  const fields = useMemo(() => {
    const defaultFields: LeadFormFieldSetting[] = [
      { id: 'f-name', fieldKey: 'studentName', label: 'আপনার নাম (Student Full Name)', placeholder: 'যেমন: মো: সাইফুল ইসলাম', enabled: true, required: true, sortOrder: 1 },
      { id: 'f-phone', fieldKey: 'phone', label: 'মোবাইল নম্বর (Active WhatsApp / Phone)', placeholder: '017XXXXXXXX', enabled: true, required: true, sortOrder: 2 },
      { id: 'f-course', fieldKey: 'courseId', label: 'পছন্দের কোর্স (Selected Course)', placeholder: 'কোর্স নির্বাচন করুন', enabled: true, required: true, sortOrder: 3 },
      { id: 'f-schedule', fieldKey: 'preferredSchedule', label: 'সুবিধাজনক সময় (Preferred Schedule)', placeholder: 'সময় নির্বাচন করুন', enabled: true, required: true, sortOrder: 4 },
      { id: 'f-mode', fieldKey: 'learningMode', label: 'শেখার মাধ্যম (Learning Mode)', placeholder: 'অফলাইন ল্যাব / অনলাইন লাইভ', enabled: true, required: false, sortOrder: 5 },
      { id: 'f-email', fieldKey: 'email', label: 'ইমেইল অ্যাড্রেস (Email Address)', placeholder: 'example@gmail.com', enabled: true, required: false, sortOrder: 6 },
      { id: 'f-education', fieldKey: 'education', label: 'শিক্ষাগত যোগ্যতা (Education)', placeholder: 'যেমন: HSC / Diploma / B.Sc', enabled: true, required: false, sortOrder: 7 },
      { id: 'f-institution', fieldKey: 'institution', label: 'প্রতিষ্ঠান / বিশ্ববিদ্যালয় (Institution)', placeholder: 'যেমন: ঢাকা কলেজ / পলিটেকনিক', enabled: true, required: false, sortOrder: 8 },
      { id: 'f-profession', fieldKey: 'profession', label: 'বর্তমান পেশা (Profession)', placeholder: 'যেমন: Student / Job Holder', enabled: true, required: false, sortOrder: 9 },
      { id: 'f-address', fieldKey: 'address', label: 'বর্তমান ঠিকানা / এলাকা (Address)', placeholder: 'যেমন: ফার্মগেট, ঢাকা', enabled: true, required: false, sortOrder: 10 },
      { id: 'f-message', fieldKey: 'message', label: 'মন্তব্য বা প্রশ্ন (Message / Note)', placeholder: 'কোর্স সম্পর্কে আপনার কোনো প্রশ্ন থাকলে লিখুন...', enabled: true, required: false, sortOrder: 11 }
    ];

    const current = formConfig?.fields && formConfig.fields.length > 0 ? formConfig.fields : defaultFields;
    return [...current].filter(f => f.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [formConfig]);

  // Request OTP from server
  const handleRequestOtp = async () => {
    const cleanPhone = formData.phone.replace(/[\s\-\+\(\)]/g, '').trim();
    if (!cleanPhone || cleanPhone.length < 11) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)।');
      return;
    }

    setIsRequestingOtp(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          provider: otpConfig?.provider || 'SIMULATED'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'OTP পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।');
      } else {
        setOtpSessionId(data.sessionId);
        setOtpTimerSeconds(data.expiresInSeconds || 180);
        setIsOtpRequired(true);
        if (data.simulatedCode) {
          setOtpSimulatedCode(data.simulatedCode);
        }
      }
    } catch (e) {
      setErrorMessage('সার্ভারের সাথে সংযোগ করা যায়নি।');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const cleanPhone = formData.phone.replace(/[\s\-\+\(\)]/g, '').trim();
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('সঠিক OTP কোডটি লিখুন।');
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          code: otpCode
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setOtpAttemptsLeft(data.attemptsLeft ?? 0);
        setErrorMessage(data.error || 'ভুল OTP কোড। আবার চেষ্টা করুন।');
      } else {
        setIsOtpVerified(true);
        setIsOtpRequired(false);
        // Automatically proceed to submit lead with verified status
        submitLeadDirectly(true);
      }
    } catch (e) {
      setErrorMessage('OTP যাচাই করা সম্ভব হয়নি।');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Main Lead Submission
  const submitLeadDirectly = async (otpAlreadyVerified = false) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        fullName: formData.studentName.trim(),
        studentName: formData.studentName.trim(),
        name: formData.studentName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim() || undefined,
        education: formData.education.trim() || undefined,
        institution: formData.institution.trim() || undefined,
        profession: formData.profession.trim() || 'Student',
        courseId: formData.courseId,
        courseName: selectedCourse?.name || initialCourseName,
        preferredSchedule: formData.preferredSchedule || availableSchedules[0] || undefined,
        learningMode: formData.learningMode,
        message: formData.message.trim() || undefined,
        source: source || 'Website Form',
        landingPageUrl: landingPageUrl || (typeof window !== 'undefined' ? window.location.href : undefined),
        ...utmParams,
        honeypotVal: honeypot,
        renderTimestampMs: renderTimestamp,
        captchaAnswer: captchaInput,
        captchaExpected: captchaChallenge.expected.toString(),
        otpVerified: otpAlreadyVerified || isOtpVerified
      };

      const result = await submitPublicLead(payload);

      if (result.requiresOtp) {
        setIsOtpRequired(true);
        if (!otpSessionId) {
          handleRequestOtp();
        }
        return;
      }

      if (result.requiresCaptcha) {
        setShowCaptcha(true);
        generateCaptcha();
        setErrorMessage('নিরাপত্তা যাচাইয়ের জন্য নিচের যোগফলটি পূরণ করুন।');
        return;
      }

      if (result.success && result.lead) {
        setSuccessLead(result.lead);
        setIsDuplicateSubmitted(result.isDuplicate || false);

        // Fire Meta Pixel & Meta Conversions API (CAPI) Dual-Channel Lead Event with Deduplication
        const marketing = websiteCmsConfig?.marketing;
        if (marketing?.metaPixelEnabled || marketing?.metaCapiEnabled) {
          const eventId = result.eventId || generateEventId('Lead');
          trackMetaPixelEvent('Lead', {
            content_name: result.lead.courseName || selectedCourse?.name || 'Course Admission',
            content_category: selectedCourse?.category || 'Course',
            value: selectedCourse?.offerFee || selectedCourse?.regularFee || 0,
            currency: 'BDT',
            lead_id: result.lead.id,
            phone: result.lead.phone,
            student_name: result.lead.studentName || result.lead.name,
            status: result.lead.status,
            source: result.lead.leadSource || result.lead.source || 'Website Form'
          }, {
            pixelId: marketing?.metaPixelId,
            eventId: eventId,
            userData: {
              phone: result.lead.phone,
              email: result.lead.email,
              name: result.lead.studentName || result.lead.name,
              externalId: result.lead.id
            },
            triggerCapi: true
          });
        }

        if (onSuccess) {
          onSuccess(result.lead);
        }
      } else {
        setErrorMessage(result.message || 'আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setErrorMessage('নেটওয়ার্ক সংযোগ ত্রুটি। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic client-side validation
    if (!formData.studentName.trim()) {
      setErrorMessage('দয়া করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }

    const cleanPhone = formData.phone.replace(/[\s\-\+\(\)]/g, '').trim();
    if (!cleanPhone || !/^(?:\+?88)?01[3-9]\d{8}$/.test(cleanPhone)) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }

    // 2. Client CAPTCHA verification if active
    if (showCaptcha) {
      if (parseInt(captchaInput.trim(), 10) !== captchaChallenge.expected) {
        setErrorMessage('ক্যাপচা উত্তর সঠিক নয়। পুনরায় চেষ্টা করুন।');
        generateCaptcha();
        return;
      }
    }

    // 3. OTP verification check if OTP is unconditionally enforced
    const isGlobalOtpOn = formConfig?.otpMode === 'ON' || otpConfig?.mode === 'ON';
    if (isGlobalOtpOn && !isOtpVerified) {
      setIsOtpRequired(true);
      if (!otpSessionId) {
        handleRequestOtp();
      }
      return;
    }

    submitLeadDirectly(isOtpVerified);
  };

  // Render Success Card
  if (successLead) {
    return (
      <div id="lead-form-success" className={`bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-center backdrop-blur-sm ${className}`}>
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 font-display">
          আবেদন সফলভাবে গ্রহণ করা হয়েছে!
        </h3>

        <p className="text-emerald-300/90 text-sm sm:text-base max-w-md mx-auto mb-6">
          {formConfig?.successMessage || 'ধন্যবাদ! আপনার তথ্য আমাদের সিস্টেমে সংরক্ষিত হয়েছে। আমাদের ক্যারিয়ার কাউন্সেলর খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।'}
        </p>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 max-w-md mx-auto text-left mb-6 space-y-2 text-xs sm:text-sm text-slate-300">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400">ট্র্যাকিং রেফারেন্স:</span>
            <span className="font-mono font-bold text-amber-400">{successLead.leadCode}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">শিক্ষার্থীর নাম:</span>
            <span className="font-semibold text-white">{successLead.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">মোবাইল নম্বর:</span>
            <span className="font-mono text-white">{successLead.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">নির্বাচিত কোর্স:</span>
            <span className="font-semibold text-cyan-400">{selectedCourse?.name || successLead.courseName}</span>
          </div>
          {successLead.preferredSchedule && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">সুবিধাজনক সময়:</span>
              <span className="text-slate-200">{successLead.preferredSchedule}</span>
            </div>
          )}
          {isDuplicateSubmitted && (
            <div className="bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs p-2 rounded-lg mt-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>আপনার পূর্বে সংরক্ষিত তথ্যের সাথে নতুন অনুরোধটি যুক্ত করা হয়েছে।</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            href={`tel:${websiteCmsConfig.multiplePhones?.[0]?.number || '01798444444'}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-950/50"
          >
            <PhoneCall className="w-4 h-4" />
            জরুরি প্রয়োজনে হটলাইনে কল করুন
          </a>
          <button
            onClick={() => {
              setSuccessLead(null);
              setFormData({
                studentName: '',
                phone: '',
                email: '',
                address: '',
                education: '',
                institution: '',
                profession: 'Student',
                courseId: initialCourseId || (courses[0]?.id ?? ''),
                preferredSchedule: initialSchedule || '',
                learningMode: initialLearningMode || 'Offline',
                message: ''
              });
              setIsOtpVerified(false);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-colors border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            আরেকটি আবেদন করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="lead-form-container" className={`bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>অনলাইন ভর্তি ও স্কলারশিপ পোর্টাল</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
          {title || formConfig?.formTitle || 'কোর্স ভর্তি ও স্কলারশিপ আবেদন ফরম'}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          {subtitle || formConfig?.formSubtitle || 'নিচের ফরমটি পূরণ করুন। আমাদের এডমিশন টিম আপনার সাথে দ্রুত যোগাযোগ করবে।'}
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 bg-red-950/40 border border-red-500/40 rounded-xl p-3.5 text-xs sm:text-sm text-red-300 flex items-start gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Invisible Honeypot field for trapping spam bots */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="hp_company_title">Leave this field blank</label>
          <input
            type="text"
            id="hp_company_title"
            name="hp_company_title"
            tabIndex={-1}
            value={honeypot}
            onChange={e => setHoneypot(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Dynamic Fields rendered based on CMS configuration */}
        <div className={`grid ${compact ? 'grid-cols-1 gap-3.5' : 'grid-cols-1 sm:grid-cols-2 gap-4'}`}>
          {fields.map(field => {
            if (field.fieldKey === 'studentName') {
              return (
                <div key={field.id} className={compact ? 'col-span-1' : 'sm:col-span-2'}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      {field.label}
                    </span>
                    {field.required && <span className="text-rose-400 text-xs font-mono">*আবশ্যক</span>}
                  </label>
                  <input
                    type="text"
                    required={field.required}
                    value={formData.studentName}
                    onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm transition-all"
                  />
                </div>
              );
            }

            if (field.fieldKey === 'phone') {
              return (
                <div key={field.id} className={compact ? 'col-span-1' : 'sm:col-span-1'}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                      {field.label}
                    </span>
                    {field.required && <span className="text-rose-400 text-xs font-mono">*আবশ্যক</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required={field.required}
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm font-mono transition-all"
                    />
                    {isOtpVerified && (
                      <span className="absolute right-3 top-2.5 text-emerald-400 text-xs flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        যাচাইকৃত
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            if (field.fieldKey === 'courseId') {
              return (
                <div key={field.id} className={compact ? 'col-span-1' : 'sm:col-span-1'}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      {field.label}
                    </span>
                    {field.required && <span className="text-rose-400 text-xs font-mono">*আবশ্যক</span>}
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                    required={field.required}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3.5 py-2.5 text-white text-sm transition-all"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.name} ({c.code || c.category})
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field.fieldKey === 'preferredSchedule') {
              return (
                <div key={field.id} className={compact ? 'col-span-1' : 'sm:col-span-1'}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {field.label}
                    </span>
                    {field.required && <span className="text-rose-400 text-xs font-mono">*আবশ্যক</span>}
                  </label>
                  <select
                    value={formData.preferredSchedule}
                    onChange={e => setFormData({ ...formData, preferredSchedule: e.target.value })}
                    required={field.required}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3.5 py-2.5 text-white text-sm transition-all"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">সময় বেছে নিন...</option>
                    {availableSchedules.map((sch, i) => (
                      <option key={i} value={sch} className="bg-slate-900 text-white">
                        {sch}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field.fieldKey === 'learningMode') {
              return (
                <div key={field.id} className={compact ? 'col-span-1' : 'sm:col-span-1'}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>{field.label}</span>
                    {field.required && <span className="text-rose-400 text-xs font-mono">*আবশ্যক</span>}
                  </label>
                  <select
                    value={formData.learningMode}
                    onChange={e => setFormData({ ...formData, learningMode: e.target.value as any })}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3.5 py-2.5 text-white text-sm transition-all"
                  >
                    <option value="Offline" className="bg-slate-900 text-white">অফলাইন ল্যাব ক্লাস (ফার্মগেট ক্যাম্পাস)</option>
                    <option value="Online Live" className="bg-slate-900 text-white">অনলাইন লাইভ ক্লাস (Zoom / Meet)</option>
                    <option value="Hybrid" className="bg-slate-900 text-white">হাইব্রিড (ল্যাব + অনলাইন)</option>
                  </select>
                </div>
              );
            }

            if (field.fieldKey === 'email') {
              return (
                <div key={field.id} className={compact ? 'col-span-1' : 'sm:col-span-1'}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      {field.label}
                    </span>
                    {field.required && <span className="text-rose-400 text-xs font-mono">*আবশ্যক</span>}
                  </label>
                  <input
                    type="email"
                    required={field.required}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm transition-all"
                  />
                </div>
              );
            }

            if (field.fieldKey === 'education') {
              return (
                <div key={field.id} className={compact ? 'col-span-1' : 'sm:col-span-1'}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                      {field.label}
                    </span>
                    {field.required && <span className="text-rose-400 text-xs font-mono">*আবশ্যক</span>}
                  </label>
                  <input
                    type="text"
                    required={field.required}
                    value={formData.education}
                    onChange={e => setFormData({ ...formData, education: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm transition-all"
                  />
                </div>
              );
            }

            if (field.fieldKey === 'institution') {
              return (
                <div key={field.id} className={compact ? 'col-span-1' : 'sm:col-span-1'}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>{field.label}</span>
                    {field.required && <span className="text-rose-400 text-xs font-mono">*আবশ্যক</span>}
                  </label>
                  <input
                    type="text"
                    required={field.required}
                    value={formData.institution}
                    onChange={e => setFormData({ ...formData, institution: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm transition-all"
                  />
                </div>
              );
            }

            if (field.fieldKey === 'profession') {
              return (
                <div key={field.id} className={compact ? 'col-span-1' : 'sm:col-span-1'}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                      {field.label}
                    </span>
                    {field.required && <span className="text-rose-400 text-xs font-mono">*আবশ্যক</span>}
                  </label>
                  <input
                    type="text"
                    required={field.required}
                    value={formData.profession}
                    onChange={e => setFormData({ ...formData, profession: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm transition-all"
                  />
                </div>
              );
            }

            if (field.fieldKey === 'address') {
              return (
                <div key={field.id} className={compact ? 'col-span-1' : 'sm:col-span-1'}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {field.label}
                    </span>
                    {field.required && <span className="text-rose-400 text-xs font-mono">*আবশ্যক</span>}
                  </label>
                  <input
                    type="text"
                    required={field.required}
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm transition-all"
                  />
                </div>
              );
            }

            if (field.fieldKey === 'message') {
              return (
                <div key={field.id} className={compact ? 'col-span-1' : 'sm:col-span-2'}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      {field.label}
                    </span>
                    {field.required && <span className="text-rose-400 text-xs font-mono">*আবশ্যক</span>}
                  </label>
                  <textarea
                    rows={2}
                    required={field.required}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2 text-white placeholder-slate-500 text-sm resize-none transition-all"
                  />
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Optional Interactive CAPTCHA challenge */}
        {showCaptcha && (
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>রোবট সুরক্ষা:</span>
              <span className="font-mono font-bold text-amber-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                {captchaChallenge.num1} + {captchaChallenge.num2} = ?
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={captchaInput}
                onChange={e => setCaptchaInput(e.target.value)}
                placeholder="উত্তর"
                className="w-20 bg-slate-900 border border-slate-700 text-center font-mono text-sm text-white px-2 py-1.5 rounded-lg focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={generateCaptcha}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="নতুন ক্যাপচা"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* OTP Verification Modal / Drawer when required */}
        {isOtpRequired && (
          <div className="bg-gradient-to-br from-indigo-950/80 to-slate-950 border border-indigo-500/40 p-4 rounded-xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-300">
                <KeyRound className="w-4 h-4 text-indigo-400" />
                <span>মোবাইল নম্বর যাচাইকরণ (OTP)</span>
              </div>
              {otpTimerSeconds > 0 ? (
                <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  {Math.floor(otpTimerSeconds / 60)}:{(otpTimerSeconds % 60).toString().padStart(2, '0')}
                </span>
              ) : (
                <span className="text-xs text-rose-400">কোডের মেয়াদ শেষ</span>
              )}
            </div>

            <p className="text-xs text-slate-300">
              <strong className="text-white font-mono">{formData.phone}</strong> নম্বরে ৬-ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে।
            </p>

            {otpSimulatedCode && (
              <div className="bg-indigo-900/40 border border-indigo-400/30 p-2.5 rounded-lg text-xs text-indigo-200 flex items-center justify-between">
                <span>🧪 প্রিভিউ টেস্টিং OTP কোড:</span>
                <span className="font-mono font-bold text-amber-300 text-sm tracking-widest bg-slate-950 px-2 py-0.5 rounded">
                  {otpSimulatedCode}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="৬-সংখ্যার কোড লিখুন"
                className="flex-1 bg-slate-950 border border-indigo-500/50 text-center font-mono font-bold text-lg tracking-widest text-white px-3 py-2 rounded-xl focus:border-indigo-400"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp || !otpCode}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                {isVerifyingOtp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                যাচাই করুন
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>বাকি চেষ্টা: {otpAttemptsLeft} বার</span>
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={otpTimerSeconds > 0 || isRequestingOtp}
                className="text-cyan-400 hover:underline disabled:opacity-40 disabled:hover:no-underline"
              >
                {isRequestingOtp ? 'পাঠানো হচ্ছে...' : 'পুনরায় কোড পাঠান'}
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isRequestingOtp}
          className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm sm:text-base transition-all shadow-lg shadow-cyan-950/40 hover:shadow-cyan-900/60 flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>আবেদন প্রক্রিয়া সম্পন্ন হচ্ছে...</span>
            </>
          ) : (
            <>
              <span>{formConfig?.submitButtonText || 'আবেদন নিশ্চিত করুন'}</span>
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Trust Badges */}
        <div className="pt-2 flex items-center justify-center gap-4 text-slate-400 text-xs">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            তথ্য সম্পূর্ণ নিরাপদ
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            ফ্রি ক্যারিয়ার কাউন্সেলিং
          </span>
        </div>
      </form>
    </div>
  );
};
