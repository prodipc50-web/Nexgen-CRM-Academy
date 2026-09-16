import React, { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight, CheckCircle2, Phone, User, BookOpen, Gift, ShieldCheck, Mail } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-trigger based on CMS settings (delay, scroll, or exit_intent)
  useEffect(() => {
    if (!config || !config.enabled) return;

    // Check if dismissed in this session
    if (sessionStorage.getItem('nca_lead_popup_dismissed') === 'true') {
      return;
    }

    const trigger = config.triggerType || 'delay';

    if (trigger === 'delay') {
      const delayMs = Math.max(2, config.delaySeconds || 8) * 1000;
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

    setIsSubmitting(true);
    try {
      const selectedCourse = courses.find(c => c.id === courseId);
      const success = await onSubmitLead({
        fullName: trimmedName,
        phone: trimmedPhone,
        email: email.trim() || undefined,
        courseId: courseId || undefined,
        source: 'Website Popup Lead',
        notes: `Popup Lead Offer Voucher: ${config?.discountText || 'Special Scholarship'}. Course: ${selectedCourse?.name || 'General Inquiry'}`
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
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-indigo-100 relative text-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 text-slate-400 hover:text-slate-800 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* SUCCESS CELEBRATION VIEW */
          <div className="p-8 text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                ভাউচার বুকিং সফল হয়েছে!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {config?.successMessage ||
                  'অভিনন্দন! আপনার অনুরোধ গ্রহণ করা হয়েছে। আমাদের সিনিয়র ক্যারিয়ার কাউন্সেলর শীঘ্রই আপনাকে কল করে কোর্স ডিটেইলস ও স্কলারশিপ নিশ্চিত করবেন।'}
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-semibold text-emerald-900 space-y-1">
              <p className="font-bold flex items-center justify-center space-x-1.5 text-emerald-800">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>আপনার স্কলারশিপ কোড সংরক্ষিত হয়েছে</span>
              </p>
              <p className="text-slate-600 text-[11px]">
                ভর্তির সময় এই মোবাইল নম্বরটি ব্যবহার করে বিশেষ ছাড় উপভোগ করুন।
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              ওয়েবসাইটে ফিরে যান
            </button>
          </div>
        ) : (
          /* FORM SUBMISSION VIEW */
          <div>
            {/* Top Gradient Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 sm:p-7 text-white relative">
              {config?.badgeText && (
                <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider mb-2.5 shadow-xs">
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  <span>{config.badgeText}</span>
                </div>
              )}

              <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">
                {config?.title || '🎓 ফ্রি ক্যারিয়ার গাইডলাইন ও স্কলারশিপ ভাউচার!'}
              </h3>
              <p className="text-xs text-indigo-200/90 mt-1.5 leading-relaxed">
                {config?.subtitle ||
                  'আপনার মোবাইল নম্বর দিন, আমাদের অভিজ্ঞ কাউন্সেলর সরাসরি আপনার সাথে যোগাযোগ করে সর্বোচ্চ স্কলারশিপ কোটা নিশ্চিত করবেন।'}
              </p>

              {/* Instant Voucher Pill */}
              {config?.discountText && (
                <div className="mt-3 inline-flex items-center space-x-1.5 bg-white/15 border border-white/25 px-3 py-1 rounded-xl text-amber-300 text-xs font-black shadow-inner">
                  <Gift className="w-3.5 h-3.5 text-amber-300" />
                  <span>{config.discountText}</span>
                </div>
              )}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-bold">
                  {errorMsg}
                </div>
              )}

              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আপনার নাম <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="যেমন: সাকিব আল হাসান"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="যেমন: 01711223344"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Optional Email */}
              {config?.showEmailField && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ইমেইল এড্রেস (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Course Selector (If enabled in CMS) */}
              {config?.showCourseSelect !== false && courses.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পছন্দের কোর্স (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={courseId}
                      onChange={e => setCourseId(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    >
                      <option value="">-- যেকোনো কোর্স / ক্যারিয়ার কাউন্সেলিং --</option>
                      {courses.map(crs => (
                        <option key={crs.id} value={crs.id}>
                          {crs.name} ({crs.courseType || 'Offline Lab'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>পাঠানো হচ্ছে...</span>
                  </span>
                ) : (
                  <>
                    <span>{config?.submitButtonText || 'আমার স্কলারশিপ ভাউচার বুক করুন'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Privacy / Spam Notice */}
              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>আপনার তথ্য সম্পূর্ণ সুরক্ষিত থাকবে। কোনো স্প্যাম মেসেজ পাঠানো হবে না।</span>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
