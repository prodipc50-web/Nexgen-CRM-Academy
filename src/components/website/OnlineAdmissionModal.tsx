import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { X, CheckCircle2, User, Phone, Mail, BookOpen, GraduationCap, MapPin, Send, HelpCircle, Shield, Sparkles, CreditCard, QrCode } from 'lucide-react';
import { Course } from '../../types';
import {
  trackMetaPixelEvent,
  getCapturedUtmParams,
  getDeviceType
} from '../../utils/analyticsTracker';

interface OnlineAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCourse?: Course | null;
}

export const OnlineAdmissionModal: React.FC<OnlineAdmissionModalProps> = ({
  isOpen,
  onClose,
  preselectedCourse
}) => {
  const { courses, addLead, academySettings } = useAcademy();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    courseId: preselectedCourse?.id || (courses[0]?.id || ''),
    learningMode: 'Offline' as 'Offline' | 'Online Live' | 'Hybrid',
    preferredSchedule: 'Weekend (Friday-Saturday)',
    educationLevel: 'HSC / College',
    address: '',
    trxId: '',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeQrModal, setActiveQrModal] = useState<{ name: string; url: string } | null>(null);

  const activeAccounts = (academySettings.paymentAccounts || []).filter(a => a.isActive);
  const primaryPhone = academySettings.primarySupportPhone || '01798444444';

  if (!isOpen) return null;

  const selectedCourse = courses.find(c => c.id === formData.courseId) || courses[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('Please enter your full name and active mobile number.');
      return;
    }

    try {
      const todayDate = new Date().toISOString().split('T')[0];
      const utms = getCapturedUtmParams();
      const device = getDeviceType();

      // Register lead into CRM directly with full attribution data
      addLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        occupation: 'Student',
        educationLevel: formData.educationLevel,
        address: formData.address || undefined,
        interestedCourseId: formData.courseId,
        leadSource: utms.utmSource ? `Ad: ${utms.utmSource}` : 'Website Online Admission',
        campaignId: utms.utmCampaign,
        utmSource: utms.utmSource,
        utmMedium: utms.utmMedium,
        utmCampaign: utms.utmCampaign,
        utmContent: utms.utmContent,
        utmTerm: utms.utmTerm,
        deviceType: device,
        locationCity: 'Dhaka',
        counselorId: 'counselor-01',
        counselorName: 'Online Admission Cell',
        visitDate: todayDate,
        firstContactDate: todayDate,
        status: 'Admission Pending',
        comments: `Online Admission Application. Mode: ${formData.learningMode}, Schedule: ${formData.preferredSchedule}, Address: ${formData.address || 'N/A'}. bKash/TrxID: ${formData.trxId || 'Pending Desk Verification'}. Note: ${formData.notes || 'None'}. Campaign: ${utms.utmCampaign || 'organic'}`
      });

      // Fire Meta Pixel CompleteRegistration & Lead Events
      trackMetaPixelEvent('Lead', {
        content_name: selectedCourse?.name || 'Online Admission',
        content_category: selectedCourse?.category || 'Tech Course',
        value: selectedCourse?.offerFee || selectedCourse?.regularFee || 0,
        currency: 'BDT',
        utm_source: utms.utmSource,
        utm_campaign: utms.utmCampaign
      });

      trackMetaPixelEvent('CompleteRegistration', {
        content_name: selectedCourse?.name || 'Online Admission',
        status: 'success',
        value: selectedCourse?.offerFee || selectedCourse?.regularFee || 0,
        currency: 'BDT'
      });

      setIsSubmitted(true);
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage('Submission failed. Please call our hotline at 01798444444.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl border border-slate-100 space-y-5 text-slate-800 my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-2xl">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center space-x-2">
                <span>Online Admission & Seat Booking</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  Instant Portal
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Register online to confirm your batch seat with scholarship discount
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {isSubmitted ? (
            <div className="text-center py-8 px-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-slate-900">
                Application Received Successfully!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-slate-900">{formData.name}</span>! Your admission request for <span className="font-bold text-indigo-700">{selectedCourse?.name}</span> has been logged. Our senior admission counselor will call you at <span className="font-bold text-slate-900">{formData.phone}</span> within 2 business hours to verify your seat.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left max-w-md mx-auto text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Course:</span>
                  <span className="font-bold text-slate-800">{selectedCourse?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Learning Mode:</span>
                  <span className="font-bold text-slate-800">{formData.learningMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Campus:</span>
                  <span className="font-bold text-slate-800">Farmgate Campus, Dhaka</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500">Helpline:</span>
                  <span className="font-bold text-indigo-600">{academySettings.primarySupportPhone || '01798444444'}</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Course Selector & Fee Card */}
              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-2">
                <label className="font-bold text-indigo-950 block">Select Desired Course (কোর্স নির্বাচন করুন) *</label>
                <select
                  value={formData.courseId}
                  onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full bg-white border border-indigo-200 rounded-xl p-2.5 text-slate-900 font-bold text-xs outline-none focus:border-indigo-600"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} • ৳{(c.offerFee || c.regularFee || 0).toLocaleString()} ({c.duration})
                    </option>
                  ))}
                </select>

                {selectedCourse && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-indigo-900">
                    <span>Duration: <strong>{selectedCourse.duration}</strong></span>
                    <span>Course Fee: <strong>৳{(selectedCourse.offerFee || selectedCourse.regularFee || 0).toLocaleString()}</strong></span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      ✓ Scholarship Eligible
                    </span>
                  </div>
                )}
              </div>

              {/* Student Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name (আপনার নাম) *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shakib Al Hasan"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Active Mobile Number (মোবাইল নম্বর) *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 01711223344"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address (ইমেইল)</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="e.g. name@gmail.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Learning Mode (ক্লাসের ধরন)</label>
                  <select
                    value={formData.learningMode}
                    onChange={e => setFormData({ ...formData, learningMode: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium outline-none focus:bg-white focus:border-indigo-600"
                  >
                    <option value="Offline">Offline (Farmgate AC Lab Classroom)</option>
                    <option value="Online Live">Online Live (Interactive Zoom + Recording)</option>
                    <option value="Hybrid">Hybrid (Classroom + Online Both)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Batch Time</label>
                  <select
                    value={formData.preferredSchedule}
                    onChange={e => setFormData({ ...formData, preferredSchedule: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium outline-none focus:bg-white focus:border-indigo-600"
                  >
                    <option value="Weekend (Friday-Saturday)">Weekend (Friday & Saturday)</option>
                    <option value="Evening (Sun-Tue-Thu 6-8 PM)">Evening (Sun-Tue-Thu 6:00 PM - 8:00 PM)</option>
                    <option value="Morning (Mon-Wed 10 AM - 12 PM)">Morning (Mon-Wed 10:00 AM - 12:00 PM)</option>
                    <option value="Any Flexible Slot">Any Flexible Slot</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Present Educational Status</label>
                  <select
                    value={formData.educationLevel}
                    onChange={e => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium outline-none focus:bg-white focus:border-indigo-600"
                  >
                    <option value="HSC / College">HSC / College Student</option>
                    <option value="Undergraduate / Bachelor">Undergraduate / Bachelor's</option>
                    <option value="Graduated / Masters">Graduated / Master's</option>
                    <option value="Job Holder / Professional">Job Holder / Professional</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Payment Advance / MFS & Bank Guide */}
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold">
                    <CreditCard className="w-4 h-4 text-amber-700" />
                    <span>Optional: Seat Booking Advance (বিকাশ / নগদ / ব্যাংক)</span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-medium">৳500 - ৳1,000 অগ্রিম</span>
                </div>

                <div className="text-[11px] text-amber-900 space-y-1.5">
                  {activeAccounts.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {activeAccounts.map(acc => (
                        <div
                          key={acc.id}
                          className="bg-white px-2.5 py-1.5 rounded-xl border border-amber-300 text-[11px] flex items-center space-x-1.5 shadow-2xs"
                        >
                          <span className="font-bold text-slate-800">{acc.method} ({acc.accountType}):</span>
                          <span className="font-mono font-bold text-indigo-900">{acc.accountNumber}</span>
                          {acc.qrCodeUrl && (
                            <button
                              type="button"
                              onClick={() => setActiveQrModal({ name: `${acc.method} QR Code`, url: acc.qrCodeUrl! })}
                              className="text-indigo-600 hover:text-indigo-800 underline flex items-center space-x-0.5 ml-1 cursor-pointer"
                              title="QR Code দেখুন"
                            >
                              <QrCode className="w-3 h-3" />
                              <span className="text-[10px] font-bold">QR</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>
                      You can pay ৳500 to ৳1,000 seat booking advance via bKash / Nagad: <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300">{primaryPhone}</strong>
                    </p>
                  )}
                  <p className="text-[10px] text-amber-800">
                    টাকা পাঠিয়ে TrxID প্রদান করুন, অথবা সরাসরি ক্যাম্পাসে এসে অফিসে পেমেন্ট সম্পন্ন করতে পারেন।
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="Enter bKash/Nagad TrxID (if already paid) or leave blank"
                  value={formData.trxId}
                  onChange={e => setFormData({ ...formData, trxId: e.target.value })}
                  className="w-full bg-white border border-amber-300 rounded-xl p-2 text-slate-900 text-xs font-mono outline-none focus:border-amber-600 shadow-2xs"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Data Confidentiality & Direct Verification</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center space-x-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Admission Request (আবেদন জমা দিন)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* QR Code Lightbox Modal */}
      {activeQrModal && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveQrModal(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm">{activeQrModal.name}</h4>
              <button
                type="button"
                onClick={() => setActiveQrModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 inline-block">
              <img
                src={activeQrModal.url}
                alt={activeQrModal.name}
                className="w-48 h-48 object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              বিকাশ বা সংশ্লিষ্ট অ্যাপ থেকে কিউআর কোড স্ক্যান করে পেমেন্ট সম্পন্ন করুন।
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
