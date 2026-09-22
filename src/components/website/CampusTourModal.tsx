import React, { useState } from 'react';
import {
  X,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Course } from '../../types';
import { useAcademy } from '../../context/AcademyContext';
import { trackMetaPixelEvent, getCapturedUtmParams } from '../../utils/analyticsTracker';

interface CampusTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  initialCourseId?: string;
}

export const CampusTourModal: React.FC<CampusTourModalProps> = ({
  isOpen,
  onClose,
  courses,
  initialCourseId
}) => {
  const { addLead, submitPublicLead, academySettings, websiteCmsConfig } = useAcademy();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(initialCourseId || courses[0]?.name || 'Graphic Design & Multimedia');
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Tomorrow by default
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 01:00 PM');
  const [visitorType, setVisitorType] = useState('Solo');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const config = websiteCmsConfig?.campusTourConfig;
  const campusAddress = websiteCmsConfig?.officeAddress || academySettings?.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215';
  const hotline = websiteCmsConfig?.multiplePhones?.[0]?.number || academySettings?.primarySupportPhone || '01798444444';

  const availableBranches = (academySettings?.branches && academySettings.branches.length > 0)
    ? academySettings.branches.filter(b => b.isActive !== false)
    : [
        {
          id: 'branch-farmgate',
          name: 'ফার্মগেট মেইন ক্যাম্পাস (Farmgate Main Campus)',
          shortCode: 'FGT',
          address: campusAddress,
          phone: hotline,
          mapUrl: websiteCmsConfig?.googleMapShareUrl || 'https://share.google/9W8K1XZHLbZxFpF8G',
          isMainBranch: true,
          isActive: true
        }
      ];

  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    const main = availableBranches.find(b => b.isMainBranch);
    return main?.id || availableBranches[0]?.id || 'branch-farmgate';
  });

  const activeBranch = availableBranches.find(b => b.id === selectedBranchId) || availableBranches[0];
  const activeCampusAddress = activeBranch?.address || campusAddress;
  const activeHotline = activeBranch?.phone || hotline;
  const activeMapUrl = activeBranch?.mapUrl || websiteCmsConfig?.googleMapShareUrl || 'https://share.google/9W8K1XZHLbZxFpF8G';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot check
    if (honeypot.trim().length > 0) {
      setIsSuccess(true);
      return;
    }

    if (!name.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার নাম দিন');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন');
      return;
    }

    setIsSubmitting(true);

    try {
      const utmParams = getCapturedUtmParams();

      const matchingCourse = courses.find(c => c.name === selectedCourse || c.id === selectedCourse);
      const leadPayload = {
        name: name.trim(),
        studentName: name.trim(),
        fullName: name.trim(),
        phone: phone.trim(),
        branch: activeBranch?.name,
        preferredBranch: activeBranch?.name,
        interestedCourseId: matchingCourse?.id || courses[0]?.id || 'crs-1',
        courseId: matchingCourse?.id || courses[0]?.id || 'crs-1',
        courseName: matchingCourse?.name || selectedCourse,
        interestedCourse: selectedCourse,
        occupation: 'Student' as any,
        educationLevel: 'Not Specified',
        counselorId: '',
        visitDate: new Date().toISOString().split('T')[0],
        firstContactDate: new Date().toISOString().split('T')[0],
        leadSource: 'Campus Tour Request',
        source: 'Campus Tour Request',
        status: 'New' as const,
        priority: 'Urgent' as const,
        notes: `ক্যাম্পাস ট্যুর ও কাউন্সেলিং বুক করেছেন। ব্রাঞ্চ: ${activeBranch?.name}। তারিখ: ${visitDate} (${timeSlot})। সফরকারী: ${visitorType}।`,
        comments: `ক্যাম্পাস ট্যুর বুকিং। ব্রাঞ্চ: ${activeBranch?.name}। তারিখ: ${visitDate} (${timeSlot})। সফরকারী: ${visitorType}।`,
        utmSource: utmParams.utm_source || 'campus_tour_popup',
        utmMedium: utmParams.utm_medium,
        utmCampaign: utmParams.utm_campaign,
        tags: ['Campus Tour', activeBranch?.name ? `Branch: ${activeBranch.name}` : 'Offline Counseling', 'VIP Lead']
      };

      addLead(leadPayload);

      if (submitPublicLead) {
        submitPublicLead(leadPayload).catch(e => console.warn('Campus tour cloud sync notice:', e));
      }

      if (typeof window !== 'undefined') {
        try {
          const bc = new BroadcastChannel('nexgen_leads_sync');
          bc.postMessage({ type: 'LEAD_SUBMITTED', timestamp: Date.now() });
          bc.close();
        } catch (e) {}
        window.dispatchEvent(new CustomEvent('incoming-lead-submitted'));
      }

      // Track Pixel
      const pixelId = websiteCmsConfig?.marketing?.metaPixelId;
      trackMetaPixelEvent('Lead', {
        content_name: 'Campus Tour & Lab Visit Booking',
        content_category: 'Campus Visit',
        value: 0,
        currency: 'BDT'
      }, pixelId);

      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to book campus tour:', err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1.5 pr-8">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
              <Building2 className="w-3 h-3" />
              <span>{config?.badgeText || 'ফ্রি ১-অন-১ ক্যারিয়ার কাউন্সেলিং ও ল্যাব ভিজিট'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black leading-snug text-white">
              {config?.title || 'ক্যাম্পাস ও আধুনিক কম্পিউটার ল্যাব ভিজিট বুক করুন'}
            </h3>
            <p className="text-xs text-emerald-100">
              {config?.subtitle || 'সরাসরি সেন্টারে এসে সিনিয়র মেন্টরদের সাথে কথা বলুন ও প্র্যাকটিক্যাল ল্যাব পরিবেশ ঘুরে দেখুন।'}
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
                  ক্যাম্পাস ভিজিট সফলভাবে বুকিং সম্পন্ন!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  আপনার ভিজিট কনফার্মেশন রেজিস্টার্ড হয়েছে। আমাদের ফ্রন্টডেস্ক অফিসার শীঘ্রই কল করে অ্যাপয়েন্টমেন্ট নিশ্চিত করবেন।
                </p>
              </div>

              {/* Visit Pass Summary Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-2 text-xs text-emerald-950">
                <div className="flex items-center justify-between font-bold border-b border-emerald-200/60 pb-1.5">
                  <span>📅 পরিদর্শনের তারিখ:</span>
                  <span className="font-mono text-emerald-800">{visitDate}</span>
                </div>
                <div className="flex items-center justify-between font-bold border-b border-emerald-200/60 pb-1.5">
                  <span>⏰ সময় স্লট:</span>
                  <span>{timeSlot}</span>
                </div>
                <div className="flex items-center justify-between font-bold border-b border-emerald-200/60 pb-1.5">
                  <span>🎯 পছন্দের কোর্স:</span>
                  <span className="truncate max-w-[200px] text-right">{selectedCourse}</span>
                </div>
                <div className="flex items-center justify-between font-bold border-b border-emerald-200/60 pb-1.5">
                  <span>🏢 নির্বাচিত ক্যাম্পাস / ব্রাঞ্চ:</span>
                  <span className="font-bold text-emerald-900">{activeBranch?.name}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-slate-700">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-[11px]">{activeCampusAddress}</span>
                  </div>
                  {activeMapUrl && (
                    <a
                      href={activeMapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-emerald-700 hover:text-emerald-900 font-bold text-[11px] underline flex items-center space-x-0.5 ml-2"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <a
                  href={`tel:${activeHotline}`}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>জরুরি তথ্য জানতে সরাসরি কল করুন ({activeHotline})</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-slate-600 underline pt-1 block mx-auto cursor-pointer"
                >
                  উইন্ডো বন্ধ করুন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campus Address Preview Banner */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between space-x-2.5 text-xs text-slate-700">
                <div className="flex items-center space-x-2 truncate">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="truncate font-medium">
                    <span className="font-bold text-slate-900">{activeBranch?.name}: </span>
                    {activeCampusAddress}
                  </span>
                </div>
                {activeMapUrl && (
                  <a
                    href={activeMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-blue-600 hover:text-blue-800 font-bold text-[11px] underline flex items-center space-x-0.5 ml-2"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Honeypot field */}
              <div className="hidden" aria-hidden="true">
                <input
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

              {/* Campus / Branch Selection */}
              {availableBranches.length > 1 && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>পছন্দের ক্যাম্পাস বা ব্রাঞ্চ নির্বাচন করুন</span>
                  </label>
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 text-xs font-bold text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  >
                    {availableBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} {b.isMainBranch ? '⭐ (Main Campus)' : ''}
                      </option>
                    ))}
                  </select>
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
                  placeholder="যেমন: সাকিব হাসান"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
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
                    className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Interested Course */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  কোন কোর্স সম্পর্কে জানতে চান?
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.courseType || 'Offline'})
                    </option>
                  ))}
                  <option value="General IT Career Counseling">সাধারণ ক্যারিয়ার কাউন্সেলিং (পরামর্শ)</option>
                </select>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    ভিজিটের সম্ভাব্য তারিখ
                  </label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    পছন্দের সময়
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  >
                    <option value="10:30 AM - 12:00 PM">সকাল ১০:৩০ - ১২:০০ টা</option>
                    <option value="12:00 PM - 02:00 PM">দুপুর ১২:০০ - ০২:০০ টা</option>
                    <option value="03:00 PM - 05:00 PM">বিকাল ০৩:০০ - ০৫:০০ টা</option>
                    <option value="05:30 PM - 07:30 PM">সন্ধ্যা ০৫:৩০ - ০৭:৩০ টা</option>
                  </select>
                </div>
              </div>

              {/* Visitor Type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  কে কে আসবেন?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Solo', label: 'আমি একা আসব' },
                    { id: 'With Guardian', label: 'অভিভাবক সহ' },
                    { id: 'With Friends', label: 'বন্ধুদের সাথে' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setVisitorType(t.id)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                        visitorType === t.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>বুকিং কনফার্ম করা হচ্ছে...</span>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 text-emerald-200" />
                    <span>{config?.ctaButtonText || 'ফ্রি ক্যাম্পাস ভিজিট কনফার্ম করুন'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ভিজিট এবং ক্যারিয়ার কাউন্সেলিং সম্পূর্ণ ফ্রি এবং কোনো বাধ্যবাধকতা নেই।</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
