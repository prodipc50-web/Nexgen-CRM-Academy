import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  CheckCircle2,
  Phone,
  MessageSquare,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  User,
  ArrowRight,
  Printer,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Course, CourseLandingPageConfig, SyllabusDownloadConfig } from '../../types';
import { useAcademy } from '../../context/AcademyContext';

interface SyllabusDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  landingConfig?: CourseLandingPageConfig;
  config?: SyllabusDownloadConfig;
}

export const SyllabusDownloadModal: React.FC<SyllabusDownloadModalProps> = ({
  isOpen,
  onClose,
  course,
  landingConfig,
  config
}) => {
  const { addLead, submitPublicLead, academySettings } = useAcademy();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('Student');
  const [preferredSchedule, setPreferredSchedule] = useState('Evening (6:30 PM - 8:30 PM)');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const syllabusConfig = config || landingConfig?.syllabusDownloadConfig;
  const rawFileUrl = syllabusConfig?.fileUrl || '';
  const fileName = syllabusConfig?.fileName || `${course.name.replace(/\s+/g, '_')}_Syllabus.pdf`;

  // Fallback printable syllabus HTML if no file uploaded
  const handleGeneratePrintableSyllabus = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const modules = landingConfig?.editableModules || [];
    const instituteName = academySettings.instituteName || 'Nexgen Computer Academy';
    const officialPhone = academySettings.primarySupportPhone || '01798444444';
    const officialAddress = academySettings.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215, Bangladesh';

    const modulesHtml = modules.length > 0
      ? modules.map((m, i) => `
        <div style="margin-bottom: 18px; padding: 14px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; page-break-inside: avoid;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <strong style="font-size: 15px; color: #0f172a;">মডিউল #${i + 1}: ${m.moduleName}</strong>
            <span style="font-size: 12px; color: #4338ca; font-weight: bold; background: #e0e7ff; padding: 2px 8px; border-radius: 4px;">${m.estimatedClasses || '৪টি ক্লাস'}</span>
          </div>
          ${m.subtitle ? `<p style="font-size: 13px; color: #475569; margin: 0 0 8px 0; font-style: italic;">${m.subtitle}</p>` : ''}
          ${m.description ? `<p style="font-size: 13px; color: #334155; margin: 0 0 8px 0;">${m.description}</p>` : ''}
          ${m.topics && m.topics.length > 0 ? `
            <div style="font-size: 12px; color: #334155; margin-top: 6px;">
              <strong>টপিকসমূহ:</strong>
              <ul style="margin: 4px 0 0 16px; padding: 0;">
                ${m.topics.map(t => `<li style="margin-bottom: 3px;">${t}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `).join('')
      : `
        <div style="padding: 16px; background: #f8fafc; border-radius: 8px;">
          <p style="font-size: 14px; color: #334155;">${course.description || '১০০% প্র্যাকটিক্যাল কম্পিউটার অফিস অ্যাপ্লিকেশন ও আইটি স্কিল ডেভেলপমেন্ট।'}</p>
        </div>
      `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="utf-8">
        <title>${course.name} - Course Curriculum</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hind Siliguri", sans-serif; line-height: 1.5; color: #0f172a; margin: 24px; padding: 0; }
          .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 20px; }
          .inst-name { font-size: 22px; font-weight: 800; color: #4338ca; margin: 0; }
          .sub { font-size: 13px; color: #64748b; margin: 4px 0; }
          .course-title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 12px 0 4px 0; }
          .meta-box { display: flex; justify-content: space-around; background: #f1f5f9; padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 20px; font-weight: 600; }
          .footer { text-align: center; margin-top: 30px; padding-top: 14px; border-top: 1px dashed #cbd5e1; font-size: 12px; color: #64748b; }
          @media print {
            body { margin: 12px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="inst-name">${instituteName}</h1>
          <p class="sub">${officialAddress} • হটলাইন: ${officialPhone}</p>
          <div class="course-title">কোর্স কারিকুলাম ও সিলেবাস: ${course.name}</div>
        </div>

        <div class="meta-box">
          <span>মেয়াদ: ${course.duration || '৩ মাস'}</span>
          <span>কোর্স ফি: ৳${(course.offerFee || course.regularFee || 3500).toLocaleString()}</span>
          <span>ল্যাব সুবিধা: ১০০% ডেডিকেটেড পিসি</span>
        </div>

        <div style="margin-bottom: 14px;">
          <h3 style="font-size: 16px; margin: 0 0 10px 0; color: #1e293b;">কোর্স মডিউল ও প্র্যাকটিক্যাল ল্যাব বিবরণী:</h3>
          ${modulesHtml}
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} ${instituteName}। ভর্তি সংক্রান্ত তথ্যের জন্য যোগাযোগ করুন: ${officialPhone}</p>
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const triggerDownloadAction = () => {
    if (rawFileUrl) {
      try {
        const link = document.createElement('a');
        link.href = rawFileUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        window.open(rawFileUrl, '_blank');
      }
    } else {
      handleGeneratePrintableSyllabus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('দয়া করে আপনার নাম লিখুন।');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg('দয়া করে সঠিক মোবাইল/হোয়াটসঅ্যাপ নম্বর লিখুন।');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('দয়া করে আপনার এলাকা বা বর্তমান ঠিকানা উল্লেখ করুন (যেমন: মিরপুর, ঢাকা)।');
      return;
    }

    setIsSubmitting(true);

    try {
      const commentsText = `[সিলেবাস ডাউনলোড লিড] এলাকা/ঠিকানা: ${address.trim()} | পেশা: ${occupation} | পছন্দের শিডিউল: ${preferredSchedule}${comments.trim() ? ` | নোট: ${comments.trim()}` : ''}`;

      // 1. Submit to server authoritative persistence
      submitPublicLead({
        fullName: name.trim(),
        studentName: name.trim(),
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        occupation: occupation,
        courseId: course.id,
        courseName: course.name,
        interestedCourseId: course.id,
        preferredSchedule: preferredSchedule,
        preferredTime: preferredSchedule,
        leadSource: 'Syllabus Download',
        source: 'Landing Page Curriculum Download',
        status: 'New',
        comments: commentsText,
        landingPageUrl: typeof window !== 'undefined' ? window.location.href : `/courses/${course.slug || course.id}`
      }).catch(err => {
        console.warn('Syllabus lead server sync fallback:', err);
      });

      // 2. Create Lead in CRM with high conversion enrichment
      const newLeadData: any = {
        name: name.trim(),
        studentName: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        locationCity: address.trim(),
        occupation: occupation as any,
        educationLevel: occupation,
        preferredSchedule: preferredSchedule,
        preferredTime: preferredSchedule,
        interestedCourseId: course.id,
        courseId: course.id,
        courseName: course.name,
        leadSource: 'Syllabus Download',
        source: 'Landing Page Curriculum Download',
        landingPage: `/courses/${course.slug || course.id}`,
        status: 'New',
        counselorId: 'st-03',
        counselorName: 'Admissions Desk (Tanvir Ahmed)',
        comments: commentsText,
        visitDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addLead(newLeadData);

      // 2. Track Meta Pixel event if available
      if (typeof window !== 'undefined' && (window as any).fbq) {
        try {
          (window as any).fbq('track', 'Lead', {
            content_name: `${course.name} - Syllabus Download`,
            content_category: 'Curriculum Download',
            value: course.offerFee || 0,
            currency: 'BDT'
          });
        } catch {
          // ignore
        }
      }

      // 3. Immediately trigger the syllabus download
      setTimeout(() => {
        triggerDownloadAction();
      }, 400);

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Error recording syllabus lead:', err);
      setErrorMsg('লিড সংরক্ষণে কিছুটা সমস্যা হয়েছে, তবে আপনি সিলেবাসটি এখনই ডাউনলোড করতে পারেন।');
      triggerDownloadAction();
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  const directWhatsAppUrl = `https://wa.me/${(academySettings.primarySupportPhone || '01798444444').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `হ্যালো নেক্সজেন একাডেমি! আমি "${course.name}" কোর্সের সিলেবাস ডাউনলোড করেছি। আমার নাম: ${name || 'একজন শিক্ষার্থী'} (ঠিকানা: ${address || 'ঢাকা'})। ব্যাচ শিডিউল ও ভর্তি সম্পর্কে জানতে চাই।`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 p-5 sm:p-6 text-white">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{syllabusConfig?.badgeText || 'ফ্রি সিলেবাস ও রোডম্যাপ'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight font-website-heading">
            {syllabusConfig?.headline || 'পূর্ণাঙ্গ কোর্স কারিকুলাম ও সিলেবাস সংগ্রহ করুন'}
          </h3>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1.5 leading-relaxed font-normal">
            {course.name} • ১০০% প্র্যাকটিক্যাল ল্যাব ও রিয়েল প্রজেক্ট গাইডলাইন
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <span className="inline-flex items-center space-x-1 bg-white/15 px-2.5 py-1 rounded-full text-white backdrop-blur-xs">
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>{rawFileUrl ? fileName : 'অফিশিয়াল সিলেবাস ডক'}</span>
            </span>
            <span className="inline-flex items-center space-x-1 bg-emerald-500/30 border border-emerald-400/40 px-2.5 py-1 rounded-full text-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>ফ্রি ডাউনলোড • ইনস্ট্যান্ট এক্সেস</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[78vh] overflow-y-auto">
          {isSubmitted ? (
            /* Success View */
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900 font-website-heading">
                  অভিনন্দন, {name}!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  আপনার সিলেবাস ফাইলটি স্বয়ংক্রিয়ভাবে ডাউনলোড শুরু হয়েছে। যদি ডাউনলোড শুরু না হয়ে থাকে, তবে নিচের বাটনে ক্লিক করুন:
                </p>
              </div>

              {/* Direct Re-Download Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={triggerDownloadAction}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>পুনরায় সিলেবাস ডাউনলোড করুন</span>
                </button>
              </div>

              {/* Admission Counselor Connect Box */}
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-3">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>ব্যাচ সিট বুকিং বা সরাসরি কাউন্সেলিং:</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    সরাসরি মেন্টর সাপোর্ট
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp-এ কথা বলুন</span>
                  </a>

                  <a
                    href={`tel:${academySettings.primarySupportPhone || '01798444444'}`}
                    className="flex items-center justify-center space-x-2 p-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>হটলাইন: {academySettings.primarySupportPhone || '01798444444'}</span>
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  উইন্ডো বন্ধ করুন
                </button>
              </div>
            </div>
          ) : (
            /* Lead Capture Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  আপনার নাম ও মোবাইল নম্বর দিয়ে সাথে সাথে পূর্ণাঙ্গ সিলেবাস PDF/ইমেজ এবং ল্যাব গাইডলাইন ডাউনলোড করুন।
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center space-x-2">
                  <X className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আপনার নাম <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মো: আরিফুল ইসলাম"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    হোয়াটসঅ্যাপ / মোবাইল নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Address / Location Area (User specifically requested this) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বর্তমান ঠিকানা বা এলাকা <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মিরপুর-১০, ঢাকা / ফার্মগেট / সাভার"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  নিকটস্থ ক্যাম্পাস বা অনলাইন/অফলাইন ব্যাচ নির্ধারণে এলাকাটি সাহায্য করবে।
                </p>
              </div>

              {/* Occupation & Preferred Batch Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আপনার বর্তমান পেশা / পরিচয়
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      value={occupation}
                      onChange={e => setOccupation(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden cursor-pointer"
                    >
                      <option value="Student">শিক্ষার্থী (কলেজ / ভার্সিটি)</option>
                      <option value="Job Holder">চাকরিজীবী (সরকারি / প্রাইভেট)</option>
                      <option value="Freelancer">ফ্রিল্যান্সিং শিখতে ইচ্ছুক</option>
                      <option value="Homemaker">গৃহিণী / ক্যারিয়ার গ্যাপ</option>
                      <option value="Business Owner">উদ্যোক্তা / ব্যবসায়ী</option>
                      <option value="Other">অন্যান্য</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পছন্দের ব্যাচ সময়
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      value={preferredSchedule}
                      onChange={e => setPreferredSchedule(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden cursor-pointer"
                    >
                      <option value="Morning (9:00 AM - 11:00 AM)">সকাল ব্যাচ (৯:০০ - ১১:০০)</option>
                      <option value="Afternoon (3:00 PM - 5:00 PM)">বিকাল ব্যাচ (৩:০০ - ৫:০০)</option>
                      <option value="Evening (6:30 PM - 8:30 PM)">সন্ধ্যা ব্যাচ (৬:৩০ - ৮:৩০)</option>
                      <option value="Weekend (Friday & Saturday)">উইকেন্ড স্পেশাল (শুক্র ও শনি)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Comments / Notes (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  কোনো নির্দিষ্ট প্রশ্ন বা মন্তব্য (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ল্যাপটপ ছাড়া ক্লাস করা যাবে কি না / কততম ব্যাচ শুরু হচ্ছে..."
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span>সিলেবাস প্রস্তুত হচ্ছে...</span>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>{syllabusConfig?.buttonText || 'পূর্ণাঙ্গ সিলেবাস ডাউনলোড করুন (PDF)'}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500 text-center">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>আপনার তথ্য সম্পূর্ণ নিরাপদ ও কোনো স্প্যাম পাঠানো হবে না</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
