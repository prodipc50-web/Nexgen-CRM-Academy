import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  MessageCircle,
  ExternalLink,
  Send,
  CheckCircle2,
  Building,
  Sparkles
} from 'lucide-react';
import { WebsiteCmsConfig, AcademySettings, Course } from '../../../types';
import { SubPageBanner } from './SubPageBanner';
import { getWhatsAppDirectUrl } from '../../../utils/whatsappHelper';

interface ContactUsSubPageProps {
  academySettings: AcademySettings;
  websiteCmsConfig?: WebsiteCmsConfig;
  courses?: Course[];
  onSubmitInquiry: (data: {
    fullName: string;
    phone: string;
    email?: string;
    courseId?: string;
    courseName?: string;
    message?: string;
  }) => Promise<boolean>;
  onBackToHome: () => void;
}

export const ContactUsSubPage: React.FC<ContactUsSubPageProps> = ({
  academySettings,
  websiteCmsConfig,
  courses = [],
  onSubmitInquiry,
  onBackToHome
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    courseId: courses[0]?.id || '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedCourse = courses.find(c => c.id === formData.courseId);
      await onSubmitInquiry({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        courseId: formData.courseId,
        courseName: selectedCourse?.name || '',
        message: formData.message
      });
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        courseId: courses[0]?.id || '',
        message: ''
      });
    } catch (err) {
      console.error('Error submitting contact form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultPhones = [
    { label: 'Head Office Hotline 1', number: '+8801722-007005', isHotline: true },
    { label: 'Head Office Helpline 2', number: '+8801795-077536', isHotline: true },
    { label: 'Admission Counseling Desk', number: '+8801795-077692', isHotline: false },
    { label: 'Accounts & Student Verification', number: '+8801741-996731', isHotline: false }
  ];

  const phones = websiteCmsConfig?.multiplePhones && websiteCmsConfig.multiplePhones.length > 0
    ? websiteCmsConfig.multiplePhones
    : defaultPhones;

  const defaultEmails = [
    { label: 'General Inquiries', email: 'info@uniquitinstitute.com' },
    { label: 'Admission Desk', email: 'admission@uniquitinstitute.com' },
    { label: 'Corporate & Placements', email: 'careers@uniquitinstitute.com' }
  ];

  const emails = websiteCmsConfig?.multipleEmails && websiteCmsConfig.multipleEmails.length > 0
    ? websiteCmsConfig.multipleEmails
    : defaultEmails;

  const headOfficeAddress = websiteCmsConfig?.officeAddress || 'House #27, Road #5, Block #C, Rampura Banasree, Dhaka-1219, Bangladesh';
  const branchOfficeAddress = 'Farmgate Campus: Ananda Tower (3rd Floor), Farmgate, Tejgaon, Dhaka-1215';
  const visitingHours = websiteCmsConfig?.officeHours || 'Saturday to Friday: 9:00 AM – 8:30 PM (7 Days Open for Campus Visits & Counseling)';

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SubPageBanner
        title="Contact Us & Campus Locations (যোগাযোগ)"
        subtitle="সরাসরি ক্যাম্পাসে এসে ল্যাব ভিজিট ও ক্যারিয়ার কাউন্সেলিং নিন, অথবা ফোনে যোগাযোগ করুন।"
        badge="সপ্তাহে ৭ দিন খোলা"
        breadcrumbs={[{ label: 'যোগাযোগ (Contact Us)', active: true }]}
        onBackToHome={onBackToHome}
        actionButton={
          <a
            href={getWhatsAppDirectUrl(
              phones[0]?.number || '01722007005',
              'Hello! I want to know about course admission details.'
            )}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপে চ্যাট করুন</span>
          </a>
        }
      />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 space-y-10">
        {/* Main Content: Info Cards & Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Campus Info & Helplines (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Campus Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Head Office Banasree */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Main Campus</span>
                    <h3 className="font-black text-slate-900 text-base">Head Office (Banasree)</h3>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{headOfficeAddress}</span>
                  </div>
                </div>
              </div>

              {/* Branch Campus */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Branch Campus</span>
                    <h3 className="font-black text-slate-900 text-base">Farmgate Campus</h3>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{branchOfficeAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Helplines Box */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Dedicated Telephone Helplines</h3>
                  <p className="text-xs text-slate-500">ভর্তি ও ক্যারিয়ার পরামর্শের জন্য কল করুন</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {phones.map((ph, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">{ph.label}</span>
                      <a href={`tel:${ph.number}`} className="font-black text-slate-900 text-sm hover:text-indigo-600">
                        {ph.number}
                      </a>
                    </div>
                    {ph.isHotline && (
                      <span className="text-[9px] font-black uppercase bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                        Hotline
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Department Emails & Hours */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>Department Emails</span>
                  </span>
                  <div className="space-y-1 text-slate-600">
                    {emails.map((em, idx) => (
                      <div key={idx}>
                        <span className="text-slate-400">{em.label}:</span>{' '}
                        <a href={`mailto:${em.email}`} className="text-indigo-600 font-semibold hover:underline">
                          {em.email}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Visiting Hours (সাক্ষাতের সময়)</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {visitingHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map Box */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <Navigation className="w-4 h-4 text-indigo-600" />
                  <span>Google Maps Campus Location</span>
                </div>

                <a
                  href={websiteCmsConfig?.googleMapShareUrl || 'https://maps.google.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="aspect-video w-full bg-slate-100">
                <iframe
                  title="Campus Location"
                  src={websiteCmsConfig?.googleMapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848881261358!2d90.3887!3d23.7527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ1JzA5LjciTiA5MMKwMjMnMTkuMyJF!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd'}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Direct Lead Inquiry Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                Instant Career Counseling
              </span>
              <h3 className="text-xl font-black text-slate-900">
                কোর্স পরামর্শ বা যেকোনো তথ্য জানতে লিখুন
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                আপনার নাম ও ফোন নম্বর দিয়ে মেসেজ পাঠান। আমাদের সিনিয়র ক্যারিয়ার কাউন্সেলর অতি দ্রুত আপনার সাথে যোগাযোগ করবেন।
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-black text-emerald-900 text-base">আপনার মেসেজ সফলভাবে জমা হয়েছে!</h4>
                <p className="text-xs text-emerald-700">
                  আমাদের একজন এক্সপার্ট কাউন্সেলর শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করবেন। ধন্যবাদ!
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  আরেকটি মেসেজ পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আপনার সম্পূর্ণ নাম (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. মোঃ সাকিব হাসান"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মোবাইল নম্বর (Phone Number) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 01712-345678"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ইমেইল এড্রেস (Email Address - Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. student@gmail.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আগ্রহী কোর্স নির্বাচন করুন (Select Course)
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.courseType || 'Offline'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আপনার প্রশ্ন বা মন্তব্য (Your Message / Query)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="কোর্সের সময়, স্কলারশিপ বা ব্যাচ সম্পর্কে কোনো প্রশ্ন থাকলে লিখুন..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'পাঠানো হচ্ছে...' : 'মেসেজ পাঠান (Send Message)'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
