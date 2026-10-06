import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Video,
  Sparkles,
  Send,
  MessageCircle,
  Navigation,
  ExternalLink,
  Building2,
  Globe2
} from 'lucide-react';
import { SeminarWorkshop } from '../../types';
import {
  trackMetaPixelEvent,
  getCapturedUtmParams,
  getDeviceType
} from '../../utils/analyticsTracker';

interface SeminarRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  seminar: SeminarWorkshop | null;
}

export const SeminarRegistrationModal: React.FC<SeminarRegistrationModalProps> = ({
  isOpen,
  onClose,
  seminar
}) => {
  const { addLead, submitPublicLead, syncIncomingLeadsNow, registerLeadToSeminar, websiteCmsConfig, academySettings, staffList } = useAcademy();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [attendanceMode, setAttendanceMode] = useState<'Offline' | 'Online Live'>('Offline');
  const [occupation, setOccupation] = useState('Student');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const popularLocations = [
    'ফার্মগেট (ক্যাম্পাস সংলগ্ন)',
    'মিরপুর, ঢাকা',
    'ধানমন্ডি, ঢাকা',
    'উত্তরা, ঢাকা',
    'অনলাইন (অন্যান্য জেলা)'
  ];

  if (!isOpen || !seminar) return null;

  const whatsappLink = seminar.whatsappGroupUrl || websiteCmsConfig.socialLinks?.whatsappCommunityUrl;
  const mapsLink = seminar.googleMapsUrl;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('অনুগ্রহ করে আপনার পুরো নাম ও মোবাইল নম্বর লিখুন।');
      return;
    }

    if (!location.trim()) {
      setError('অনুগ্রহ করে আপনার বর্তমান লোকেশন বা জেলা উল্লেখ করুন।');
      return;
    }

    try {
      const todayDate = new Date().toISOString().split('T')[0];
      const utms = getCapturedUtmParams();
      const device = getDeviceType();

      const commentsText = `Free Seminar Registration: "${seminar.title}" on ${seminar.date} at ${seminar.time}. Mode: ${attendanceMode}, Location: ${location.trim()}. Occ: ${occupation}. Campaign: ${utms.utmCampaign || 'organic'}`;
      const sourceStr = utms.utmSource ? `Ad: ${utms.utmSource} (Seminar)` : 'Campus Seminar / Workshop';

      // 1. Submit to server authoritative persistence
      submitPublicLead({
        fullName: name.trim(),
        studentName: name.trim(),
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        courseId: seminar.courseId || '',
        courseName: seminar.courseName || seminar.title,
        status: 'Demo Scheduled',
        leadSource: sourceStr,
        source: sourceStr,
        comments: commentsText,
        occupation: occupation,
        learningMode: attendanceMode,
        address: location.trim(),
        location: location.trim(),
        utmSource: utms.utmSource,
        utmMedium: utms.utmMedium,
        utmCampaign: utms.utmCampaign,
        utmContent: utms.utmContent,
        utmTerm: utms.utmTerm,
        landingPageUrl: typeof window !== 'undefined' ? window.location.href : undefined
      }).catch(err => {
        console.warn('Seminar server sync fallback handled:', err);
      });

      // Dynamic Counselor Allocation
      const activeCounselor = staffList.find(s => s.role === 'COUNSELOR' && s.status === 'Active') ||
        staffList.find(s => s.role === 'COUNSELOR') ||
        staffList.find(s => s.status === 'Active') ||
        staffList[0];
      const counselorId = activeCounselor?.id || 'st-desk';
      const counselorName = activeCounselor ? `${activeCounselor.name} (${activeCounselor.designation || 'Admissions Desk'})` : 'Admissions Desk';

      // 2. Client-side registration
      const newLead = addLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        occupation: occupation as any,
        educationLevel: 'Graduate / Student',
        interestedCourseId: seminar.courseId || '',
        learningMode: attendanceMode,
        preferredLearningMode: attendanceMode,
        address: location.trim(),
        locationCity: location.trim(),
        leadSource: sourceStr,
        campaignId: utms.utmCampaign,
        utmSource: utms.utmSource,
        utmMedium: utms.utmMedium,
        utmCampaign: utms.utmCampaign,
        utmContent: utms.utmContent,
        utmTerm: utms.utmTerm,
        deviceType: device,
        counselorId,
        counselorName,
        visitDate: seminar.date || todayDate,
        firstContactDate: todayDate,
        status: 'Demo Scheduled',
        comments: commentsText
      });

      registerLeadToSeminar(seminar.id, newLead.id);

      // Immediately notify and sync CRM across all tabs
      if (typeof window !== 'undefined') {
        try {
          const bc = new BroadcastChannel('nexgen_leads_sync');
          bc.postMessage({ type: 'LEAD_SUBMITTED', timestamp: Date.now() });
          bc.close();
        } catch (e) {}
        window.dispatchEvent(new CustomEvent('incoming-lead-submitted'));
      }

      if (syncIncomingLeadsNow) {
        syncIncomingLeadsNow().catch(() => {});
      }

      trackMetaPixelEvent('Lead', {
        content_name: seminar.title,
        content_category: 'Free Workshop / Seminar',
        utm_source: utms.utmSource,
        utm_campaign: utms.utmCampaign
      });

      setIsSuccess(true);
      setError('');
    } catch (err) {
      setError(`Failed to complete registration. Please contact hotline ${academySettings.primarySupportPhone || academySettings.helplines?.[0] || 'our helpline'}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 text-slate-800 my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Free Seminar Registration
              </h3>
              <p className="text-xs text-slate-500">Book your seat & get free entry pass</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Seat Confirmed! (আসন সংরক্ষিত)</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              ধন্যবাদ, <strong>{name}</strong>! আপনার আসন <strong>{seminar.title}</strong> সেমিনারের জন্য ({seminar.date}, {seminar.time}) সফলভাবে নিশ্চিত করা হয়েছে।
            </p>

            {seminar.confirmationNote && (
              <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl text-xs font-medium text-left">
                <strong>নির্দেশনা:</strong> {seminar.confirmationNote}
              </div>
            )}

            {/* Quick Action Buttons: WhatsApp Group & Google Maps */}
            <div className="flex flex-col gap-2 pt-2">
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপ গ্রুপে যুক্ত হোন (Join WhatsApp Group)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>
              )}

              {mapsLink && (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 border border-indigo-200 transition-colors"
                >
                  <Navigation className="w-4 h-4 text-indigo-600" />
                  <span>ক্যাম্পাস ভেন্যু লোকেশন (Google Maps Pin)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-6 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-md cursor-pointer"
            >
              সম্পন্ন (Done)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {error && (
              <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-medium border border-rose-200">
                {error}
              </div>
            )}

            {/* Seminar Preview Banner */}
            <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full inline-block">
                {seminar.type || 'Free Career Seminar'}
              </span>
              <h4 className="font-black text-slate-900 text-sm">{seminar.title}</h4>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pt-1">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{seminar.date}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{seminar.time}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{seminar.roomOrPlatform || 'Farmgate Seminar Hall 1 & Zoom Live'}</span>
                </span>
              </div>
            </div>

            {/* Attendance Format (Campus Lab vs Online Zoom) */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                সেমিনারে অংশগ্রহণের মাধ্যম (অফলাইন / অনলাইন) *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAttendanceMode('Offline')}
                  className={`p-2 rounded-xl border-2 cursor-pointer transition-all flex items-center space-x-2 text-left ${
                    attendanceMode === 'Offline'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">ক্যাম্পাস সেমিনার</div>
                    <div className="text-[10px] text-slate-500">ফার্মগেট ভেন্যু ল্যাব</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceMode('Online Live')}
                  className={`p-2 rounded-xl border-2 cursor-pointer transition-all flex items-center space-x-2 text-left ${
                    attendanceMode === 'Online Live'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Globe2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">অনলাইন লাইভ</div>
                    <div className="text-[10px] text-slate-500">জুম লাইভ ক্লাস</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tanvir Ahmed"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Active Mobile Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 01711223344"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>

            {/* Location Input with Fast Selection Pills */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 block">
                  আপনার বর্তমান লোকেশন / জেলা *
                </label>
                <span className="text-[10px] text-rose-600 font-bold">আবশ্যক</span>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="যেমন: ফার্মগেট, মিরপুর, উত্তরা বা আপনার জেলা"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
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

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Occupation</label>
                <select
                  value={occupation}
                  onChange={e => setOccupation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                >
                  <option value="Student">Student</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Professional">Professional</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Free Seat Reservation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
