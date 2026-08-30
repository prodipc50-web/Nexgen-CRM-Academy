import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle2,
  Award,
  Briefcase,
  Users,
  Layers,
  GraduationCap,
  Phone,
  MessageCircle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
  Laptop,
  Check,
  Send,
  Zap,
  ShieldCheck,
  Image as ImageIcon,
  HelpCircle,
  Target,
  Gift
} from 'lucide-react';
import { Course, CoursePreferredScheduleOption, Lead } from '../../types';
import { useAcademy } from '../../context/AcademyContext';
import { getWhatsAppDirectUrl } from '../../utils/whatsappHelper';
import { trackMetaPixelEvent, getCapturedUtmParams } from '../../utils/analyticsTracker';
import { LeadForm } from '../LeadForm';

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onOpenEnroll: (course: Course) => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  isOpen,
  onClose,
  course,
  onOpenEnroll
}) => {
  const { staffList, websiteReviews, websiteGallery, websiteFaqs, websiteCmsConfig, addLead } = useAcademy();

  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'schedules' | 'trainers' | 'reviews' | 'gallery' | 'faqs'>('overview');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [expandedModuleIndex, setExpandedModuleIndex] = useState<number | null>(0);

  // Lead inquiry form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmittedSuccess, setLeadSubmittedSuccess] = useState(false);

  if (!isOpen || !course) return null;

  const landingConfig = course.landingConfig || {};
  const pixelId = websiteCmsConfig?.marketing?.metaPixelId;

  // Schedules (from landing config or sensible defaults)
  const preferredSchedules: CoursePreferredScheduleOption[] =
    landingConfig.preferredSchedules && landingConfig.preferredSchedules.length > 0
      ? landingConfig.preferredSchedules
      : [
          { id: 'sch-1', label: 'শুক্রবার ও শনিবার (সকাল ১০:০০ - ১২:০০)', days: 'Fri & Sat', timeSlot: '10:00 AM - 12:00 PM', mode: 'Offline', availableSeats: 5 },
          { id: 'sch-2', label: 'শুক্রবার ও শনিবার (বিকাল ৩:০০ - ৫:০০)', days: 'Fri & Sat', timeSlot: '3:00 PM - 5:00 PM', mode: 'Offline', availableSeats: 7 },
          { id: 'sch-3', label: 'রবি, মঙ্গল ও বৃহস্পতিবার (সন্ধ্যা ৬:৩০ - ৮:৩০)', days: 'Sun, Tue & Thu', timeSlot: '6:30 PM - 8:30 PM', mode: 'Both', availableSeats: 6 },
          { id: 'sch-4', label: 'অনলাইন লাইভ নাইট ব্যাচ (রাত ৯:০০ - ১০:৩০)', days: 'Sat, Mon & Wed', timeSlot: '9:00 PM - 10:30 PM', mode: 'Online Live', availableSeats: 12 }
        ];

  // Modules (from editableModules or standard course modules)
  const displayModules = landingConfig.editableModules && landingConfig.editableModules.length > 0
    ? landingConfig.editableModules
    : (course.modules || []).map((m, idx) => ({
        id: m.id || `mod-${idx}`,
        moduleNumber: idx + 1,
        moduleName: m.moduleName,
        subtitle: m.moduleDescription,
        description: m.moduleDescription,
        topics: m.topics || [],
        tools: [],
        estimatedClasses: m.estimatedClasses ? `${m.estimatedClasses} Classes` : '4 Classes'
      }));

  // Reviews
  const displayReviews = landingConfig.customReviews && landingConfig.customReviews.length > 0
    ? landingConfig.customReviews
    : websiteReviews.length > 0
    ? websiteReviews.map(r => ({
        name: r.studentName,
        roleOrBatch: `${r.courseName || course.name} • ${(r as any).studentBatch || 'Batch Graduate'}`,
        rating: r.rating || 5,
        text: r.reviewText
      }))
    : [
        {
          name: 'তানভীর আহমেদ',
          roleOrBatch: 'অফিস এক্সিকিউটিভ • ব্যাচ-১২',
          rating: 5,
          text: 'একদম প্র্যাকটিক্যাল ল্যাব ট্রেনিং। বিশেষ করে এক্সেল ও ChatGPT দিয়ে অফিস অটোমেশন শেখার পর আমার অফিসের কাজের স্পিড দ্বিগুণ হয়ে গেছে!'
        },
        {
          name: 'সাদিয়া আক্তার',
          roleOrBatch: 'বিবিএ শিক্ষার্থী • ব্যাচ-১৫',
          rating: 5,
          text: 'আমার টাইপিং স্পিড ১৫ WPM থেকে এখন ৪৮ WPM এ পৌঁছেছে। মেন্টরদের আন্তরিকতা ও ধৈর্য সত্যিই প্রশংসনীয়।'
        }
      ];

  // FAQs
  const displayFaqs = landingConfig.faqs && landingConfig.faqs.length > 0
    ? landingConfig.faqs
    : websiteFaqs.length > 0
    ? websiteFaqs.map(f => ({
        question: f.question,
        answer: f.answer
      }))
    : [
        {
          question: 'এই কোর্সে ভর্তি হতে কি কোনো পূর্ব অভিজ্ঞতার প্রয়োজন আছে?',
          answer: 'না, কোনো পূর্ব অভিজ্ঞতার প্রয়োজন নেই। একদম শুরু থেকে কম্পিউটার অন-অফ, টাইপিং থেকে শুরু করে অ্যাডভান্সড স্কিল ও AI প্রম্পটিং পর্যন্ত শূন্য থেকেই হাতে-কলমে শেখানো হবে।'
        },
        {
          question: 'ল্যাবে কি প্রতিটি শিক্ষার্থীর জন্য আলাদা কম্পিউটার থাকবে?',
          answer: 'হ্যাঁ, আমাদের শীতাতপ নিয়ন্ত্রিত আধুনিক কম্পিউটার ল্যাবে প্রতিটি শিক্ষার্থীর জন্য ডেডিকেটেড পার্সোনাল পিসি বরাদ্দ থাকে।'
        },
        {
          question: 'ক্লাস মিস গেলে কি ব্যাকআপ সাপোর্ট বা রেকর্ডিং পাওয়া যাবে?',
          answer: 'হ্যাঁ, ক্লাস মিস গেলে আমাদের রয়েছে ডেডিকেটেড মেন্টর সাপোর্ট ও স্টুডেন্ট পোর্টাল ব্যাকআপ ক্লাস নোটস।'
        },
        {
          question: 'কোর্স শেষে কি সার্টিফিকেট দেওয়া হবে?',
          answer: 'হ্যাঁ, কোর্স সমাপ্তির পর সফল শিক্ষার্থীদের সরকারি ও বেসরকারি প্রতিষ্ঠানে গ্রহণযোগ্য ভেরিফায়েবল সার্টিফিকেট প্রদান করা হবে।'
        }
      ];

  // Gallery
  const displayGallery = landingConfig.galleryImages && landingConfig.galleryImages.length > 0
    ? landingConfig.galleryImages
    : websiteGallery.map(g => ({
        id: g.id,
        url: g.imageUrl,
        title: g.title,
        category: g.category
      }));

  // Assigned Trainers
  const assignedTrainers = staffList.filter(s =>
    (s.role === 'TRAINER' || s.role === 'COUNSELOR') &&
    (course.trainerIds?.includes(s.id) || course.trainerId === s.id || landingConfig.assignedTrainerIds?.includes(s.id))
  );

  const effectiveTrainers = assignedTrainers.length > 0 ? assignedTrainers : staffList.filter(s => s.role === 'TRAINER').slice(0, 2);

  // Financial calculations
  const regularFee = Number(course.regularFee) || 8000;
  const offerFee = Number(course.offerFee) || regularFee;
  const discountAmount = Math.max(0, regularFee - offerFee);
  const discountPercentage = regularFee > 0 ? Math.round((discountAmount / regularFee) * 100) : 0;

  const handleOpenLandingPageDirect = () => {
    onClose();
    window.dispatchEvent(new CustomEvent('open-course-landing', { detail: { course } }));
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadPhone.trim() || !leadName.trim()) return;

    setIsSubmittingLead(true);
    const utms = getCapturedUtmParams();
    const today = new Date().toISOString().split('T')[0];

    addLead({
      name: leadName.trim(),
      phone: leadPhone.trim(),
      email: leadEmail.trim() || undefined,
      occupation: 'Student',
      educationLevel: 'HSC / Graduate',
      counselorId: 'counselor-online',
      interestedCourseId: course.id,
      leadSource: utms.utmSource ? `Website Modal (${utms.utmSource})` : 'Website Course Details Modal',
      campaignId: utms.utmCampaign,
      utmSource: utms.utmSource,
      utmMedium: utms.utmMedium,
      utmCampaign: utms.utmCampaign,
      status: 'New',
      counselorName: 'Online Admission Desk',
      visitDate: today,
      firstContactDate: today,
      comments: `Course Details Modal Inquiry. Selected Schedule: ${selectedSchedule || 'Any'}. Message: ${leadMessage || 'Interested in admission.'}`
    });

    trackMetaPixelEvent(
      'Lead',
      {
        content_name: course.name,
        value: offerFee,
        currency: 'BDT'
      },
      pixelId
    );

    setIsSubmittingLead(false);
    setLeadSubmittedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 text-slate-800 my-auto max-h-[94vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 1. Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0">
              {course.category || 'Professional Course'}
            </span>
            <h3 className="font-black text-base sm:text-lg text-white truncate">
              {course.name}
            </h3>
            <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
              Code: {course.code}
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenLandingPageDirect}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95"
              title="Open full dedicated landing page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Landing Page</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Key Metrics Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 shrink-0 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Duration</span>
            </span>
            <span className="font-black text-slate-900 text-sm">{course.duration}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Total Classes</span>
            </span>
            <span className="font-black text-slate-900 text-sm">{course.totalClasses || 36} Sessions</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Certificate</span>
            </span>
            <span className="font-black text-emerald-700 text-sm">Govt. Verified</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center space-x-1">
              <Laptop className="w-3.5 h-3.5 text-cyan-600" />
              <span>Learning Mode</span>
            </span>
            <span className="font-black text-cyan-700 text-sm">Offline & Live</span>
          </div>

          <div className="col-span-2 sm:col-span-1 space-y-0.5">
            <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center space-x-1">
              <GraduationCap className="w-3.5 h-3.5 text-rose-600" />
              <span>Course Fee</span>
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-black text-indigo-700 text-base">৳{offerFee.toLocaleString()}</span>
              {discountAmount > 0 && (
                <span className="text-[11px] text-slate-400 line-through">৳{regularFee.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex items-center space-x-1 px-6 border-b border-slate-200 bg-white overflow-x-auto shrink-0 scrollbar-none py-1">
          {[
            { id: 'overview', label: 'Overview & Highlights', icon: BookOpen },
            { id: 'curriculum', label: `Curriculum (${displayModules.length} Modules)`, icon: Layers },
            { id: 'schedules', label: 'Preferred Schedules', icon: Calendar },
            { id: 'trainers', label: `Mentors (${effectiveTrainers.length})`, icon: Users },
            { id: 'reviews', label: `Reviews (${displayReviews.length})`, icon: Star },
            { id: 'gallery', label: 'Lab & Campus Gallery', icon: ImageIcon },
            { id: 'faqs', label: 'FAQs', icon: HelpCircle }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. Modal Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 text-slate-700 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Banner / Headline Hero */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 z-10 max-w-xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-black">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{landingConfig.heroBadge || '🔥 ২০২৬ জব-রেডি প্র্যাকটিক্যাল কোর্স'}</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black leading-tight text-white">
                    {landingConfig.headline || course.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {landingConfig.subheadline || course.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                      ✓ ১০০% প্র্যাকটিক্যাল ল্যাব
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-[11px] font-bold">
                      ✓ ওয়ান-টু-ওয়ান মেন্টরিং
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-[11px] font-bold">
                      ✓ সার্টিফিকেট নিশ্চয়তা
                    </span>
                  </div>
                </div>

                {course.thumbnailUrl && (
                  <div className="w-full md:w-64 aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 shrink-0">
                    <img src={course.thumbnailUrl} alt={course.name} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* What You Will Learn & Career Scope */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
                  <h5 className="font-black text-indigo-950 text-sm flex items-center space-x-2">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span>কোর্সের মূল উদ্দেশ্য ও শিখনফল</span>
                  </h5>
                  <ul className="space-y-2 text-slate-700 text-xs">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>রিয়েল-লাইফ প্রজেক্ট এবং হ্যান্ডস-অন ল্যাব প্র্যাকটিস</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>আধুনিক সফটওয়্যার ও AI প্রোডাক্টিভিটি টুলসের পূর্ণাঙ্গ ব্যবহার</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>প্রফেশনাল পোর্টফোলিও তৈরি এবং ক্লায়েন্ট রেডি প্রেজেন্টেশন</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-3">
                  <h5 className="font-black text-emerald-950 text-sm flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>ক্যারিয়ার সুবিধা ও প্লেসমেন্ট সাপোর্ট</span>
                  </h5>
                  <ul className="space-y-2 text-slate-700 text-xs">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>লাইভ মার্কেটপ্লেস (Fiverr & Upwork) অ্যাকাউন্ট সেটআপ গাইড</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>কর্পোরেট ইন্টার্নশিপ ও জব ইন্টারভিউ রেফারেল সাপোর্ট</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>লাইফটাইম প্রজেক্ট রিভিউ ও সমস্যা সমাধান ব্যাকআপ সাপোর্ট</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bonus Items */}
              {landingConfig.bonusItems && landingConfig.bonusItems.length > 0 && (
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2.5">
                  <h5 className="font-black text-amber-950 text-sm flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-amber-600" />
                    <span>{landingConfig.bonusHeadline || '🎁 এই কোর্সে ভর্তি হলে সম্পূর্ণ ফ্রি পাচ্ছেন:'}</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900">
                    {landingConfig.bonusItems.map((b, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CURRICULUM */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">
                    {landingConfig.curriculumHeadline || 'সম্পূর্ণ কোর্স কারিকুলাম ও মডিউলসমূহ'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {landingConfig.curriculumSubheadline || 'প্রতিটি মডিউল বাস্তবধর্মী ও প্র্যাকটিক্যাল ল্যাব প্রজেক্টের সমন্বয়ে সাজানো'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold text-xs">
                  {displayModules.length} Modules
                </span>
              </div>

              <div className="space-y-3">
                {displayModules.map((mod: any, idx: number) => {
                  const isExpanded = expandedModuleIndex === idx;
                  return (
                    <div
                      key={mod.id || idx}
                      className={`border rounded-2xl transition-all overflow-hidden ${
                        isExpanded ? 'border-indigo-400 bg-indigo-50/20 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedModuleIndex(isExpanded ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <h5 className="font-black text-slate-900 text-xs sm:text-sm truncate">
                              {mod.moduleName}
                            </h5>
                            {mod.subtitle && (
                              <p className="text-[11px] text-slate-500 truncate">{mod.subtitle}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0">
                          {mod.estimatedClasses && (
                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-mono font-bold">
                              {mod.estimatedClasses}
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-indigo-100 space-y-3">
                          {mod.description && (
                            <p className="text-slate-600 text-xs leading-relaxed">{mod.description}</p>
                          )}

                          {mod.topics && mod.topics.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-bold text-slate-700 block">এই মডিউলে অন্তর্ভুক্ত টপিকসমূহ:</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {mod.topics.map((t: string, tidx: number) => (
                                  <div key={tidx} className="flex items-center space-x-2 text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>{t}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {mod.tools && mod.tools.length > 0 && (
                            <div className="flex items-center space-x-2 pt-1">
                              <span className="text-[10px] font-bold text-slate-400">ব্যবহৃত সফটওয়্যার/টুলস:</span>
                              <div className="flex flex-wrap gap-1">
                                {mod.tools.map((tl: string, tlidx: number) => (
                                  <span key={tlidx} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md text-[10px] font-bold">
                                    {tl}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PREFERRED SCHEDULES */}
          {activeTab === 'schedules' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-black text-slate-900 text-sm">
                  {landingConfig.preferredSchedulesTitle || 'পছন্দের ব্যাচ ও ক্লাসের শিডিউল নির্বাচন করুন'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  আপনার সুবিধাজনক দিনের ও সময়ের ব্যাচে আসন বুকিং নিশ্চিত করতে পছন্দসই স্লট বেছে নিন
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {preferredSchedules.map(sch => {
                  const isSelected = selectedSchedule === sch.label;
                  return (
                    <div
                      key={sch.id}
                      onClick={() => setSelectedSchedule(sch.label)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                              {sch.days || 'Flexible Days'}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                              {sch.mode || 'Offline'}
                            </span>
                          </div>
                          <h5 className="font-black text-slate-900 text-xs sm:text-sm">{sch.label}</h5>
                          {sch.timeSlot && (
                            <p className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{sch.timeSlot}</span>
                            </p>
                          )}
                        </div>

                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="text-emerald-700 font-bold">
                          🔥 {sch.availableSeats || 6} Seats Remaining
                        </span>
                        <span className="text-indigo-600 font-bold">
                          {isSelected ? 'Selected' : 'Click to select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Course-Aware Lead Form with Fraud Protection & OTP */}
              <div className="mt-4">
                <LeadForm
                  courseId={course.id}
                  courseName={course.name}
                  preferredSchedule={selectedSchedule}
                  source="Course Details Modal"
                  title="শিডিউল বুকিং ও ফ্রি ক্যারিয়ার কাউন্সেলিং"
                  subtitle="আপনার সুবিধাজনক শিডিউল ও ব্যাচ নিশ্চিত করতে নিচের তথ্য প্রদান করুন।"
                  onSuccess={() => {
                    trackMetaPixelEvent(
                      'Lead',
                      {
                        content_name: course.name,
                        value: offerFee,
                        currency: 'BDT'
                      },
                      pixelId
                    );
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 4: MENTORS & TRAINERS */}
          {activeTab === 'trainers' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-black text-slate-900 text-sm">কোর্সের দায়িত্বপ্রাপ্ত প্রশিক্ষক ও মেন্টরবৃন্দ</h4>
                <p className="text-[11px] text-slate-500">
                  অভিজ্ঞ ইন্ডাস্ট্রি প্রফেশনালদের প্রত্যক্ষ ওয়ান-টু-ওয়ান গাইডেন্স
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {effectiveTrainers.map(tr => (
                  <div
                    key={tr.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all flex items-start space-x-4"
                  >
                    <img
                      src={tr.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt={tr.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shrink-0"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <h5 className="font-black text-slate-900 text-xs sm:text-sm truncate">{tr.name}</h5>
                        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-indigo-700 font-bold">{tr.designation || 'Senior Lead Instructor'}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-2">
                        {(tr as any).shortBio || (tr as any).bio || 'ইন্ডাস্ট্রিতে ৭+ বছরের বাস্তব অভিজ্ঞতা ও শত শত সফল শিক্ষার্থী তৈরির ট্র্যাক রেকর্ড।'}
                      </p>
                      {(tr as any).experienceYears && (
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
                          {(tr as any).experienceYears}+ Years Experience
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">শিক্ষার্থীদের বাস্তব মতামত ও অভিজ্ঞতা</h4>
                  <p className="text-[11px] text-slate-500">সফল শিক্ষার্থীদের ভেরিফায়েড রিভিউ</p>
                </div>
                <div className="flex items-center space-x-1 text-amber-500 font-black text-xs bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.9 / 5.0 Rating</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayReviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-black text-slate-900 text-xs">{rev.name}</h5>
                        <p className="text-[10px] text-slate-400">{rev.roleOrBatch}</p>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating || 5 }).map((_, sidx) => (
                          <Star key={sidx} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed italic">"{rev.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-black text-slate-900 text-sm">ক্যাম্পাস ও আধুনিক কম্পিউটার ল্যাব</h4>
                <p className="text-[11px] text-slate-500">শীতাতপ নিয়ন্ত্রিত আধুনিক ল্যাবে ডেডিকেটেড পিসি ও প্র্যাকটিক্যাল পরিবেশ</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayGallery.map((img, idx) => (
                  <div key={img.id || idx} className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-900">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[10px] font-bold text-white leading-tight truncate">
                        {img.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-3">
              <div>
                <h4 className="font-black text-slate-900 text-sm">সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর</h4>
                <p className="text-[11px] text-slate-500">কোর্স সংক্রান্ত যেকোনো সাধারণ প্রশ্নের সমাধান</p>
              </div>

              <div className="space-y-2">
                {displayFaqs.map((faq, idx) => {
                  const isExpanded = expandedFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-2xl overflow-hidden bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3"
                      >
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 text-slate-600 text-xs border-t border-slate-100 leading-relaxed bg-slate-50/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. Modal Footer Action Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <Phone className="w-4 h-4 text-indigo-600" />
            <span>ভর্তি হেল্পলাইন: <strong>{landingConfig.campusPhone || (websiteCmsConfig as any)?.contactInfo?.phone || (websiteCmsConfig as any)?.contactPhone || '০১৭৯৮-৪৪৪৪৪৪'}</strong></span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <a
              href={getWhatsAppDirectUrl(
                landingConfig.customWhatsAppNumber || websiteCmsConfig?.marketing?.floatingWhatsAppNumber || '01798444444',
                landingConfig.customWhatsAppMessage || `Hello Nexgen Academy! I want to enroll in "${course.name}".`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenEnroll(course);
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>এখনই ভর্তি হোন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
