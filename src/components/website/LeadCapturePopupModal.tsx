import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  Phone,
  User,
  BookOpen,
  Gift,
  ShieldCheck,
  Mail,
  MapPin,
  Building2,
  Globe2,
  Check
} from 'lucide-react';
import { LeadCapturePopupConfig, Course } from '../../types';

interface LeadCapturePopupModalProps {
  config?: LeadCapturePopupConfig;
  courses: Course[];
  onSubmitLead: (payload: {
    fullName: string;
    phone: string;
    email?: string;
    courseId?: string;
    source: string;
    notes?: string;
    location?: string;
    learningMode?: 'Offline' | 'Online Live';
  }) => Promise<boolean>;
}

export const LeadCapturePopupModal: React.FC<LeadCapturePopupModalProps> = ({
  config,
  courses,
  onSubmitLead
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [courseId, setCourseId] = useState('');
  const [location, setLocation] = useState('');
  const [learningMode, setLearningMode] = useState<'Offline' | 'Online Live'>('Offline');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const popularLocations = [
    'ফার্মগেট (ক্যাম্পাস সংলগ্ন)',
    'মিরপুর, ঢাকা',
    'ধানমন্ডি, ঢাকা',
    'উত্তরা, ঢাকা',
    'অনলাইন (ঢাকার বাইরে)'
  ];

  // Auto-trigger based on CMS settings (delay, scroll, or exit_intent)
  useEffect(() => {
    if (!config || !config.enabled) return;

    // Check if dismissed in this session
    if (sessionStorage.getItem('nca_lead_popup_dismissed') === 'true') {
      return;
    }

    const trigger = config.triggerType || 'delay';

    if (trigger === 'delay') {
      const delayMs = Math.max(7, config.delaySeconds || 10) * 1000;
      const timer = setTimeout(() => {
        if (!sessionStorage.getItem('nca_lead_popup_dismissed')) {
          setIsOpen(true);
        }
      }, delayMs);
      return () => clearTimeout(timer);
    }

    if (trigger === 'scroll') {
      const targetPercent = config.scrollPercentage || 35;
      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (docHeight > 0) {
          const scrolled = (scrollTop / docHeight) * 100;
          if (scrolled >= targetPercent && !sessionStorage.getItem('nca_lead_popup_dismissed')) {
            setIsOpen(true);
            window.removeEventListener('scroll', handleScroll);
          }
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }

    if (trigger === 'exit_intent') {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 5 && !sessionStorage.getItem('nca_lead_popup_dismissed')) {
          setIsOpen(true);
        }
      };
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [config]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('nca_lead_popup_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setErrorMsg('অনুগ্রহ করে আপনার পুরো নাম লিখুন');
      return;
    }

    const digitsOnly = trimmedPhone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 10) {
      setErrorMsg('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01711223344)');
      return;
    }

    if (!location.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার বর্তমান লোকেশন বা জেলা উল্লেখ করুন');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCourse = courses.find(c => c.id === courseId);
      const success = await onSubmitLead({
        fullName: trimmedName,
        phone: trimmedPhone,
        email: email.trim() || undefined,
        courseId: courseId || undefined,
        location: location.trim(),
        learningMode: learningMode,
        source: 'Website Popup Lead',
        notes: `Popup Lead Offer Voucher: ${config?.discountText || 'Special Scholarship'}. Mode: ${learningMode}. Location: ${location.trim()}. Course: ${selectedCourse?.name || 'General Inquiry'}`
      });

      if (success) {
        setIsSubmitted(true);
        sessionStorage.setItem('nca_lead_popup_dismissed', 'true');
      } else {
        setErrorMsg('দুঃখিত, তথ্য গ্রহণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch {
      setErrorMsg('নেটওয়ার্ক সংযোগ ত্রুটি। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="lead-capture-popup-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-indigo-100 relative text-left flex flex-col my-auto max-h-[92dvh] sm:max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {isSubmitted ? (
          /* SUCCESS CELEBRATION VIEW */
          <div className="p-6 sm:p-8 text-center space-y-4 my-auto overflow-y-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">
                ভাউচার বুকিং সফল হয়েছে!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                {config?.successMessage ||
                  'অভিনন্দন! আপনার অনুরোধ গ্রহণ করা হয়েছে। আমাদের সিনিয়র ক্যারিয়ার কাউন্সেলর শীঘ্রই আপনাকে কল করে কোর্স ডিটেইলস ও স্কলারশিপ নিশ্চিত করবেন।'}
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs font-semibold text-emerald-900 space-y-1 max-w-sm mx-auto">
              <p className="font-bold flex items-center justify-center space-x-1.5 text-emerald-800">
                <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>আপনার স্কলারশিপ কোড সংরক্ষিত হয়েছে</span>
              </p>
              <p className="text-slate-600 text-[11px]">
                ভর্তির সময় <span className="font-bold text-slate-900">{phone}</span> নম্বরটি ব্যবহার করে বিশেষ ছাড় উপভোগ করুন।
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full max-w-xs mx-auto py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
            >
              ওয়েবসাইটে ফিরে যান
            </button>
          </div>
        ) : (
          /* FORM SUBMISSION VIEW */
          <>
            {/* Top Gradient Header - Pinned and Compact */}
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 p-4 sm:p-5 text-white relative shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {config?.badgeText && (
                    <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider mb-1.5 shadow-xs">
                      <Sparkles className="w-3 h-3 text-slate-950" />
                      <span>{config.badgeText}</span>
                    </div>
                  )}

                  <h3 className="text-base sm:text-lg font-black leading-snug text-white">
                    {config?.title || '🎓 ফ্রি ক্যারিয়ার গাইডলাইন ও স্কলারশিপ ভাউচার!'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-indigo-100/90 mt-1 leading-relaxed line-clamp-2">
                    {config?.subtitle ||
                      'আপনার নাম ও মোবাইল নম্বর দিন, আমাদের সিনিয়র মেন্টর সরাসরি আপনার সাথে যোগাযোগ করে সর্বোচ্চ স্কলারশিপ কোটা নিশ্চিত করবেন।'}
                  </p>
                </div>

                {/* Always-Visible Close Button */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer shrink-0 -mr-1 -mt-1 active:scale-90"
                  aria-label="Close modal"
                  title="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Instant Voucher Pill */}
              {config?.discountText && (
                <div className="mt-2.5 inline-flex items-center space-x-1.5 bg-white/15 border border-white/25 px-2.5 py-1 rounded-lg text-amber-300 text-[11px] font-black shadow-inner">
                  <Gift className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{config.discountText}</span>
                </div>
              )}
            </div>

            {/* Form Body - Smoothly Scrollable with Pinned Actions */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 text-xs text-slate-800 overscroll-contain">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                {errorMsg && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-bold">
                    {errorMsg}
                  </div>
                )}

                {/* Student Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আপনার নাম <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="যেমন: সাকিব আল হাসান"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মোবাইল নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="যেমন: 01711223344"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Learning Mode Selection (Offline vs Online) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ক্লাসের মাধ্যম (অফলাইন / অনলাইন) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLearningMode('Offline')}
                      className={`p-2 rounded-xl border-2 cursor-pointer transition-all flex items-center space-x-2 text-left select-none ${
                        learningMode === 'Offline'
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">অফলাইন ল্যাব</div>
                        <div className="text-[10px] text-slate-500 truncate">ফার্মগেট ক্যাম্পাস</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLearningMode('Online Live')}
                      className={`p-2 rounded-xl border-2 cursor-pointer transition-all flex items-center space-x-2 text-left select-none ${
                        learningMode === 'Online Live'
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Globe2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">অনলাইন লাইভ</div>
                        <div className="text-[10px] text-slate-500 truncate">লাইভ জুম ক্লাস</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Location Input with Fast Selection Pills */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      আপনার বর্তমান লোকেশন / জেলা <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-rose-600 font-bold">আবশ্যক</span>
                  </div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="যেমন: ফার্মগেট, মিরপুর, উত্তরা বা আপনার জেলা"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {popularLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setLocation(loc)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                          location === loc
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Course Selector (If enabled in CMS) */}
                {config?.showCourseSelect !== false && courses.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      পছন্দের কোর্স (ঐচ্ছিক)
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={courseId}
                        onChange={e => setCourseId(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                      >
                        <option value="">-- যেকোনো কোর্স / ক্যারিয়ার কাউন্সেলিং --</option>
                        {courses.map(crs => (
                          <option key={crs.id} value={crs.id}>
                            {crs.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Optional Email */}
                {config?.showEmailField && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ইমেইল এড্রেস (ঐচ্ছিক)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:border-indigo-600 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Sticky Submit Button for Seamless Mobile UX */}
                <div className="pt-1.5 sticky bottom-0 bg-white/95 backdrop-blur-xs pb-0.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center space-x-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>পাঠানো হচ্ছে...</span>
                      </span>
                    ) : (
                      <>
                        <span>{config?.submitButtonText || 'আমার স্কলারশিপ ভাউচার বুক করুন'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Privacy / Spam Notice */}
                <p className="text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>আপনার তথ্য সম্পূর্ণ সুরক্ষিত থাকবে • কোনো স্প্যাম কল দেওয়া হবে না</span>
                </p>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
