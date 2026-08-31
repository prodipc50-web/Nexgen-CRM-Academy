import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Course } from '../../types';
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
  Edit3
} from 'lucide-react';
import { OnlineAdmissionModal } from './OnlineAdmissionModal';
import { CourseLandingPageEditorModal } from '../courses/CourseLandingPageEditorModal';
import { LeadForm } from '../LeadForm';
import {
  trackMetaPixelEvent,
  getCapturedUtmParams
} from '../../utils/analyticsTracker';
import {
  cleanWhatsAppNumber,
  getWhatsAppDirectUrl,
  getMessengerDirectUrl
} from '../../utils/whatsappHelper';
import { copyToClipboardSafe } from '../../utils/clipboardHelper';
import { getCourseSeoMetadata, applySeoMetadata } from '../../utils/seoHelper';

interface CourseLandingPageViewProps {
  course: Course;
  onBackToFullWebsite?: () => void;
}

export const CourseLandingPageView: React.FC<CourseLandingPageViewProps> = ({
  course,
  onBackToFullWebsite
}) => {
  const { websiteCmsConfig, staffList, academySettings, isAuthenticated, currentUser } = useAcademy();
  const canEdit = Boolean(
    isAuthenticated &&
    currentUser &&
    ['SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER'].includes(currentUser.role)
  );
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Dynamic Course SEO Metadata & JSON-LD Schemas (Course, BreadcrumbList, FAQPage)
  useEffect(() => {
    const assignedTrainers = staffList.filter(s =>
      course.trainerIds?.includes(s.id) || s.id === course.trainerId
    );
    const seoMeta = getCourseSeoMetadata(course, academySettings, websiteCmsConfig, assignedTrainers);
    applySeoMetadata(seoMeta);
  }, [course, academySettings, websiteCmsConfig, staffList]);

  const utms = getCapturedUtmParams();
  const pixelId = websiteCmsConfig?.marketing?.metaPixelId;

  // Read Landing Page Config
  const landingConfig = course.landingConfig || {};

  // URL query parameter CTA override support (?cta=whatsapp, ?cta=messenger, ?cta=both_chats, etc.)
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const ctaParam = urlParams.get('cta');

  // Determine active CTA mode
  let effectiveCtaMode = landingConfig.ctaMode || 'both';
  if (ctaParam === 'whatsapp') effectiveCtaMode = 'whatsapp_only';
  if (ctaParam === 'messenger') effectiveCtaMode = 'messenger_only';
  if (ctaParam === 'admission') effectiveCtaMode = 'admission_only';
  if (ctaParam === 'both_chats') effectiveCtaMode = 'whatsapp_and_admission';

  // Resolved dynamic values
  const heroHeadline = landingConfig.headline || course.name;
  const heroSubheadline =
    landingConfig.subheadline ||
    course.description ||
    'আধুনিক অফিস অটোমেশন, ডেটা অ্যানালাইসিস, প্রেজেন্টেশন ও দ্রুতগতির টাইপিংয়ের সাথে ChatGPT ও AI প্রযুক্তির সমন্বয়ে ক্যারিয়ার উপযোগী প্র্যাকটিক্যাল ট্রেনিং।';
  const heroBadge = landingConfig.heroBadge || '🚀 ২০২৬ স্পেশাল ব্যাচ অ্যাডমিশন ওপেন';
  const coverImage =
    landingConfig.customBannerUrl ||
    course.thumbnailUrl ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80';

  const rawPhone =
    landingConfig.customWhatsAppNumber ||
    websiteCmsConfig?.marketing?.floatingWhatsAppNumber ||
    '01798444444';
  const customMsg =
    landingConfig.customWhatsAppMessage ||
    `Hello Nexgen Academy! I want to know admission details and syllabus for "${course.name}".`;
  
  // WhatsApp & Messenger Direct URL
  const whatsAppDirectUrl = getWhatsAppDirectUrl(rawPhone, customMsg);
  const messengerDirectUrl = getMessengerDirectUrl(
    landingConfig.customMessengerUrl || websiteCmsConfig?.socialLinks?.facebookPageUrl || websiteCmsConfig?.facebookPageUrl || 'nexgenacademy'
  );

  const offerFee = course.offerFee || 6500;
  const regularFee = course.regularFee || 15000;
  const discountPercent =
    regularFee && offerFee && regularFee > offerFee
      ? Math.round(((regularFee - offerFee) / regularFee) * 100)
      : 0;

  // Track Meta Pixel ViewContent for this specific landing page
  useEffect(() => {
    if (websiteCmsConfig?.marketing?.metaPixelEnabled) {
      trackMetaPixelEvent(
        'ViewContent',
        {
          content_name: course.name,
          content_category: course.category || 'Tech Course',
          content_ids: [course.id],
          value: offerFee,
          currency: 'BDT',
          utm_source: utms.utmSource,
          utm_campaign: utms.utmCampaign
        },
        pixelId
      );
    }

    // Exit intent handler (desktop)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !sessionStorage.getItem(`nca_exit_${course.id}`)) {
        if (websiteCmsConfig?.marketing?.enableExitIntentPopup) {
          setShowExitIntent(true);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [course.id, websiteCmsConfig?.marketing?.metaPixelEnabled, pixelId, offerFee]);

  const handleEnrollClick = () => {
    setIsAdmissionOpen(true);
    trackMetaPixelEvent(
      'InitiateCheckout',
      {
        content_name: course.name,
        content_category: course.category,
        content_ids: [course.id],
        value: offerFee,
        currency: 'BDT',
        utm_source: utms.utmSource,
        utm_campaign: utms.utmCampaign
      },
      pixelId
    );
  };

  const handleWhatsAppClick = () => {
    trackMetaPixelEvent(
      'Contact',
      {
        channel: 'WhatsApp Direct Chat',
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
        channel: 'Messenger Direct Chat',
        course_name: course.name
      },
      pixelId
    );
  };

  const handleShareClick = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : '';
      const success = await copyToClipboardSafe(url);
      if (success) {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2500);
      }
    } catch (e) {
      console.warn('Share copy error:', e);
    }
  };

  // Bonus items
  const bonusItems = landingConfig.bonusItems || [
    'ChatGPT & AI প্রম্পটিং মাস্টারবুক (PDF Free)',
    'প্রিমিয়াম টাইপিং সফটওয়্যার ফুল লাইসেন্স',
    'প্রফেশনাল সিভি মেকিং টেমপ্লেট ও ফরম্যাট',
    'লাইফটাইম ক্লাস রিসোর্স ও রেকর্ডিং অ্যাক্সেস'
  ];

  // FAQs
  const resolvedFaqs =
    landingConfig.faqs && landingConfig.faqs.length > 0
      ? landingConfig.faqs
      : [
          {
            question: 'এই কোর্সে ভর্তি হতে কি পূর্ব অভিজ্ঞতার প্রয়োজন আছে?',
            answer:
              'না, এই কোর্সটি একদম জিরো লেভেল থেকে শুরু হবে। কম্পিউটার পরিচালনা, টাইপিং থেকে শুরু করে অ্যাডভান্সড AI টুলস পর্যন্ত হাতে-কলমে শেখানো হবে।'
          },
          {
            question: 'ক্লাস মিস গেলে কি ব্যাকআপ ক্লাস বা ভিডিও রেকর্ডিং পাওয়া যাবে?',
            answer:
              'হ্যাঁ, প্রতিটি ক্লাসের লাইভ প্র্যাকটিসের পাশাপাশি আমাদের স্টুডেন্ট পোর্টালে ক্লাস নোট, রিসোর্স ফাইল এবং ব্যাকআপ সাপোর্ট পাবেন।'
          },
          {
            question: 'কোর্স শেষে কি সার্টিফিকেট দেওয়া হবে?',
            answer:
              'হ্যাঁ, প্রতিটি প্রজেক্ট ও ফাইনাল পরীক্ষা সফলভাবে শেষ করলে ভেরিফায়েবল কিউআর কোডযুক্ত প্রফেশনাল সার্টিফিকেট দেওয়া হবে।'
          },
          {
            question: 'পেমেন্ট কি কিস্তিতে (Installment) দেওয়ার সুবিধা আছে?',
            answer: `হ্যাঁ, প্রাথমিক মাত্র ৳${course.minInstallmentAmount || 2500} দিয়ে সিট কনফার্ম করে বাকি ফি ২-৩টি সহজ কিস্তিতে পরিশোধ করতে পারবেন।`
          }
        ];

  // Reviews
  const resolvedReviews =
    landingConfig.customReviews && landingConfig.customReviews.length > 0
      ? landingConfig.customReviews
      : [
          {
            name: 'তানভীর আহমেদ',
            roleOrBatch: 'ব্যাচ ০১ শিক্ষার্থী',
            rating: 5,
            text: 'একদম প্র্যাকটিক্যাল ল্যাব ট্রেনিং। বিশেষ করে এক্সেল ও ChatGPT দিয়ে অফিস অটোমেশন শেখার পর আমার অফিসের কাজের স্পিড দ্বিগুণ হয়ে গেছে!'
          },
          {
            name: 'সাদিয়া আক্তার',
            roleOrBatch: 'ব্যাচ ০৩ গ্র্যাজুয়েট',
            rating: 5,
            text: 'টাইপিং স্পিড ১৫ WPM থেকে এখন ৪৮ WPM এ পৌঁছেছে। মেন্টরদের সাপোর্ট সত্যিই অসাধারণ।'
          }
        ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white pb-24 sm:pb-20">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-rose-600 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center space-x-2">
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
        <span className="truncate">
          <strong>{landingConfig.customDiscountBadge || 'স্পেশাল অফার'}:</strong> এই ব্যাচে স্পেশাল{' '}
          {discountPercent > 0 ? `${discountPercent}% ছাড়` : 'স্কলারশিপ'} চলছে! মাত্র কয়েকটি সিট বাকি।
        </span>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 shrink-0">
              N
            </div>
            <div>
              <span className="font-black text-lg text-white tracking-tight">Nexgen Academy</span>
              <span className="block text-[10px] text-slate-400 font-medium">Govt. Reg. IT Training Institute</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Quick Edit button for Authenticated Admin/Marketer only */}
            {canEdit && (
              <button
                onClick={() => setIsEditorOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-indigo-500/40"
                title="এই ল্যান্ডিং পেজের কনটেন্ট, অফার ফি, ছবি ও বাটন এডিট করুন"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">কনটেন্ট কাস্টমাইজ</span>
              </button>
            )}

            {onBackToFullWebsite && (
              <button
                onClick={onBackToFullWebsite}
                className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <span>সব কোর্স</span>
              </button>
            )}

            <button
              onClick={handleShareClick}
              className="p-2 text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
              title="কোর্সের লিংক কপি করুন"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {effectiveCtaMode !== 'whatsapp_only' && effectiveCtaMode !== 'messenger_only' && (
              <button
                onClick={handleEnrollClick}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5"
              >
                <span>ভর্তি আবেদন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-20 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Course Pitch */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              {/* Category & Badge */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{course.category || 'Tech Professional'}</span>
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{heroBadge}</span>
                </span>
              </div>

              {/* Course Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.2] tracking-tight">
                {heroHeadline}
              </h1>

              {/* Subtitle / Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {heroSubheadline}
              </p>

              {/* Key Trust Signals */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-300">
                <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{course.rating || '4.9'}</span>
                  <span className="text-slate-400">({course.reviewsCount || '300+'} রিভিউ)</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>{course.duration || '৩ মাস'} • {course.totalClasses || 36} টি ক্লাস</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>{course.studentsJoined || '450+'} জন গ্র্যাজুয়েটেড</span>
                </div>
              </div>

              {/* Pricing & CTA Card */}
              <div className="pt-4 p-5 sm:p-6 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl space-y-4 max-w-xl mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-center sm:text-left">
                    <p className="text-xs text-slate-400 font-medium">কোর্স ফি (ফুল কোর্স):</p>
                    <div className="flex items-baseline space-x-2 justify-center sm:justify-start">
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        ৳{offerFee.toLocaleString()}
                      </span>
                      {regularFee > offerFee && (
                        <span className="text-sm sm:text-base text-slate-400 line-through">
                          ৳{regularFee.toLocaleString()}
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    {landingConfig.showBatchCountdown !== false && (
                      <span className="inline-block px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30 animate-pulse">
                        🔥 বাকি মাত্র {landingConfig.availableSeats || 8} টি সিট ({landingConfig.nextBatchStartDate || '১৫ মে'})
                      </span>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1">কিস্তিতে পরিশোধের সুযোগ রয়েছে</p>
                  </div>
                </div>

                {/* DYNAMIC CTA BUTTONS ACCORDING TO CTA MODE */}
                <div className="pt-1 space-y-3">
                  {/* Mode 1: Default (Online Admission + Highlighted Chat Options) */}
                  {effectiveCtaMode === 'both' && (
                    <div className="space-y-3">
                      <button
                        onClick={handleEnrollClick}
                        className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-sm sm:text-base rounded-xl shadow-lg shadow-indigo-600/40 transition-all flex items-center justify-center space-x-2 group active:scale-95"
                      >
                        <span>অনলাইনে এখনই ভর্তি আবেদন করুন</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>

                      {/* Highlighted Direct Chat Box */}
                      <div className="p-3 bg-slate-900/90 border border-slate-700/90 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            সরাসরি কথা বলতে চাইলে মেসেজ করুন:
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                            Instant Reply
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <a
                            href={whatsAppDirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleWhatsAppClick}
                            className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 active:scale-95"
                          >
                            <MessageCircle className="w-4 h-4 fill-white" />
                            <span>WhatsApp মেসেজ</span>
                          </a>

                          <a
                            href={messengerDirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleMessengerClick}
                            className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 active:scale-95"
                          >
                            <Smartphone className="w-4 h-4" />
                            <span>Facebook মেসেজ</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: WhatsApp Only Ad Mode */}
                  {effectiveCtaMode === 'whatsapp_only' && (
                    <div className="space-y-2.5">
                      <div className="text-center">
                        <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30 mb-2 animate-pulse">
                          💬 সরাসরি কথা বলতে WhatsApp-এ মেসেজ দিন
                        </span>
                      </div>
                      <a
                        href={whatsAppDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleWhatsAppClick}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-600/40 transition-all flex items-center justify-center space-x-3 active:scale-95"
                      >
                        <MessageCircle className="w-6 h-6 fill-white" />
                        <span>WhatsApp-এ সরাসরি কথা বলুন ও অফার নিন</span>
                      </a>
                      <p className="text-[11px] text-center text-slate-400">
                        ক্লিক করলেই সরাসরি আমাদের অফিসিয়াল WhatsApp নাম্বারে চ্যাট ওপেন হবে
                      </p>
                    </div>
                  )}

                  {/* Mode 3: Messenger Only Ad Mode */}
                  {effectiveCtaMode === 'messenger_only' && (
                    <div className="space-y-2.5">
                      <div className="text-center">
                        <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30 mb-2 animate-pulse">
                          💬 সরাসরি কথা বলতে Facebook Messenger-এ মেসেজ দিন
                        </span>
                      </div>
                      <a
                        href={messengerDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleMessengerClick}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-2xl shadow-xl shadow-blue-600/40 transition-all flex items-center justify-center space-x-3 active:scale-95"
                      >
                        <Smartphone className="w-6 h-6" />
                        <span>Facebook Messenger-এ চ্যাট করুন</span>
                      </a>
                      <p className="text-[11px] text-center text-slate-400">
                        সরাসরি আমাদের ফেসবুক পেজ ইনবক্সে তাৎক্ষণিক রিপ্লাই পান
                      </p>
                    </div>
                  )}

                  {/* Mode 4: WhatsApp + Messenger Both Chats */}
                  {effectiveCtaMode === 'whatsapp_and_admission' && (
                    <div className="space-y-2.5">
                      <div className="p-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-center">
                        <p className="text-xs font-bold text-amber-300">
                          💬 সরাসরি কথা বলতে WhatsApp বা Facebook Messenger-এ মেসেজ করুন:
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <a
                          href={whatsAppDirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleWhatsAppClick}
                          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>WhatsApp মেসেজ</span>
                        </a>

                        <a
                          href={messengerDirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleMessengerClick}
                          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 active:scale-95"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>Facebook মেসেজ</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Mode 5: Admission Only */}
                  {effectiveCtaMode === 'admission_only' && (
                    <button
                      onClick={handleEnrollClick}
                      className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-base rounded-2xl shadow-xl shadow-indigo-600/40 transition-all flex items-center justify-center space-x-2 active:scale-95"
                    >
                      <span>অনলাইনে এখনই ভর্তি আবেদন করুন</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Trust Guarantee Note */}
                <p className="text-[11px] text-center text-slate-400 pt-1">
                  ✓ {landingConfig.guaranteeText || '১০০% প্র্যাকটিক্যাল ল্যাব ট্রেনিং ও লাইফটাইম মেন্টরশিপ নিশ্চয়তা'}
                </p>
              </div>
            </div>

            {/* Right Column: Visual Media & Key Highlights */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-800 group">
                <img
                  src={coverImage}
                  alt={course.name}
                  className="w-full h-60 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="px-2.5 py-1 rounded bg-indigo-600/90 text-[10px] font-black uppercase tracking-wider mb-1 inline-block">
                    {course.courseType || 'Offline & Lab Based'}
                  </span>
                  <p className="font-black text-base sm:text-lg">{course.name}</p>
                </div>
              </div>

              {/* What You Will Get Quick Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
                  <Laptop className="w-5 h-5 text-indigo-400" />
                  <p className="font-bold text-xs text-white">১০০% প্র্যাকটিক্যাল ল্যাব</p>
                  <p className="text-[11px] text-slate-400">ব্যক্তিগত পিসি ও প্রজেক্ট সাপোর্ট</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
                  <Award className="w-5 h-5 text-amber-400" />
                  <p className="font-bold text-xs text-white">ভেরিফায়েবল সার্টিফিকেট</p>
                  <p className="text-[11px] text-slate-400">গভর্নমেন্ট ও আইটি ইন্ডাস্ট্রিতে গ্রহণযোগ্য</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <p className="font-bold text-xs text-white">AI টুলস মাস্টারি</p>
                  <p className="text-[11px] text-slate-400">ChatGPT, Gemini ও Copilot প্রম্পটিং</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  <p className="font-bold text-xs text-white">ক্যারিয়ার প্লেসমেন্ট সেল</p>
                  <p className="text-[11px] text-slate-400">সিভি ও ইন্টারভিউ গাইডলাইন</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Bonuses Section (High Converting) */}
      {bonusItems && bonusItems.length > 0 && (
        <section className="py-10 bg-indigo-950/40 border-t border-b border-indigo-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950/80 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      🎁 এই কোর্সে ভর্তির সাথে সম্পূর্ণ ফ্রি পাবেন:
                    </h3>
                    <p className="text-xs text-slate-400">সীমিত সময়ের বিশেষ প্যাকেজ সুবিধা</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full shadow-lg">
                  Free Value ৳৪,৫০০+
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {bonusItems.map((bonus, bIdx) => (
                  <div
                    key={bIdx}
                    className="p-3 bg-slate-850/80 rounded-xl border border-slate-800 flex items-center space-x-2.5 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold">{bonus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Detailed Curriculum Section */}
      <section className="py-12 bg-slate-950/70 border-t border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
              কোর্স কারিকুলাম ও সিলেবাস
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">কী কী শিখবেন এই কোর্সে?</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              প্রতিটি টপিক এমনভাবে সাজানো হয়েছে যেন একজন শিক্ষার্থী খুব সহজে শূন্য থেকে প্রফেশনাল লেভেলে দক্ষ হতে পারে।
            </p>
          </div>

          {/* Modules Accordion */}
          <div className="space-y-3">
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((mod, idx) => {
                const isOpen = openModuleIndex === idx;
                return (
                  <div
                    key={mod.id || idx}
                    className="border border-slate-800 bg-slate-900 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenModuleIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <span className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-black text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-white">
                            {mod.moduleName}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {mod.moduleDescription || 'হাতে-কলমে প্র্যাকটিক্যাল ক্লাস ও রিয়েল প্রজেক্ট'}
                          </p>
                        </div>
                      </div>
                      <div className="text-slate-400">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-4 sm:p-5 pt-0 border-t border-slate-800 bg-slate-900/50 space-y-3">
                        {mod.topics && mod.topics.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                            {mod.topics.map((top, tIdx) => (
                              <div key={tIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                                <span>{top}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {mod.estimatedClasses && (
                          <p className="text-[11px] text-indigo-300 font-medium pt-2">
                            ⏱ আনুমানিক সময়: {mod.estimatedClasses} টি ক্লাস
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-3">
                <p className="text-sm text-slate-300">
                  {course.description || 'সম্পূর্ণ কারিকুলাম জানতে আমাদের কাউন্সেলিং সেন্টারে যোগাযোগ করুন।'}
                </p>
              </div>
            )}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleEnrollClick}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center space-x-2"
            >
              <span>এই কোর্সে ভর্তি হতে চাই</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Target Audience & Prerequisites */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Audience */}
          <div className="p-6 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base">
              <Users className="w-5 h-5" />
              <span>কারা এই কোর্সটি করতে পারবেন?</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {(course.targetAudience && course.targetAudience.length > 0
                ? course.targetAudience
                : [
                    'স্কুল/কলেজ/মাদ্রাসার শিক্ষার্থী ও ফ্রেশার',
                    'চাকরিপ্রত্যাশী ও বেকার তরুণ-তরুণী',
                    'গৃহিণী ও ফ্রিল্যান্সিং করতে ইচ্ছুক যে কেউ',
                    'অফিসে কর্মরত কর্মজীবী যারা কাজের গতি ও পদোন্নতি চান'
                  ]
              ).map((aud, aIdx) => (
                <li key={aIdx} className="flex items-center space-x-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>{aud}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites */}
          <div className="p-6 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
              <Laptop className="w-5 h-5" />
              <span>প্রয়োজনীয় যোগ্যতা ও রিকোয়ারমেন্টস</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>পূর্ব অভিজ্ঞতা:</strong>{' '}
                  {course.requiredSkillLevel || 'কোনো পূর্ব অভিজ্ঞতার প্রয়োজন নেই'}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>নূন্যতম শিক্ষাগত যোগ্যতা:</strong>{' '}
                  {course.minimumEducation || 'SSC / সমমান বা সাধারণ পড়াশোনা'}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>ল্যাব সুবিধা:</strong> আমাদের ক্যাম্পাসে শীতাতপ নিয়ন্ত্রিত আধুনিক ল্যাব রয়েছে।
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Student Reviews & Feedback */}
      {resolvedReviews.length > 0 && (
        <section className="py-12 bg-slate-950/60 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-white">শিক্ষার্থীদের বাস্তব অভিজ্ঞতা</h2>
              <p className="text-xs text-slate-400">আমাদের সফল শিক্ষার্থীদের ফিডব্যাক</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resolvedReviews.map((rev, rIdx) => (
                <div
                  key={rIdx}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                      "{rev.text}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{rev.name}</span>
                    <span className="text-[10px] text-indigo-400">{rev.roleOrBatch}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Application & Admission Inquiry Form */}
      <section className="py-12 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <LeadForm
            courseId={course.id}
            courseName={course.name}
            source="Dedicated Course Landing Page"
            title="কোর্সে ভর্তি ও ফ্রি স্কলারশিপ আবেদন"
            subtitle="কোর্সের ফি, অফার ডিসকাউন্ট এবং আগামী ব্যাচের সময়সূচি জানতে ফর্মটি পূরণ করুন।"
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
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-white">সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)</h2>
            <p className="text-xs text-slate-400">কোর্স সংক্রান্ত সাধারণ প্রশ্নের উত্তর</p>
          </div>

          <div className="space-y-3">
            {resolvedFaqs.map((faq, fIdx) => {
              const isOpen = openFaqIndex === fIdx;
              return (
                <div key={fIdx} className="bg-slate-850 border border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between hover:bg-slate-800"
                  >
                    <span>{faq.question}</span>
                    <span className="text-slate-400">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Sticky Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 sm:hidden shadow-2xl space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-slate-300 font-bold px-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            সরাসরি কথা বলুন:
          </span>
          <span className="text-amber-300 font-black">ফি: ৳{offerFee.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {/* Mobile WhatsApp Button */}
          <a
            href={whatsAppDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="py-2 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl active:scale-95 shadow-md flex items-center justify-center space-x-1 text-[11px] font-bold"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp</span>
          </a>

          {/* Mobile Messenger Button */}
          <a
            href={messengerDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMessengerClick}
            className="py-2 bg-blue-600 active:bg-blue-700 text-white rounded-xl active:scale-95 shadow-md flex items-center justify-center space-x-1 text-[11px] font-bold"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Messenger</span>
          </a>

          {/* Mobile Admission Button */}
          <button
            onClick={handleEnrollClick}
            className="py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-[11px] rounded-xl shadow-lg active:scale-95 flex items-center justify-center space-x-1"
          >
            <span>ভর্তি আবেদন</span>
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

      {/* Course Landing Page Editor Modal */}
      {isEditorOpen && canEdit && (
        <CourseLandingPageEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          course={course}
        />
      )}

      {/* Exit Intent Discount Modal */}
      {showExitIntent && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setShowExitIntent(false);
            sessionStorage.setItem(`nca_exit_${course.id}`, 'true');
          }}
        >
          <div
            className="bg-slate-900 rounded-3xl max-w-md w-full p-6 text-center space-y-4 border border-indigo-500/30 text-white relative shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowExitIntent(false);
                sessionStorage.setItem(`nca_exit_${course.id}`, 'true');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black">🎁 অপেক্ষা করুন! বিশেষ ছাড় ভাউচার</h3>
              <p className="text-xs text-slate-300">
                "{course.name}" কোর্সে আজই ভর্তিতে অতিরিক্ত ৳১,০০০ বিশেষ ফি মওকুফ পেতে ভাউচারটি ব্যবহার করুন।
              </p>
            </div>

            <div className="p-3 bg-indigo-950/60 border border-dashed border-indigo-400 rounded-xl">
              <p className="text-[10px] text-indigo-300 uppercase font-bold">ভাউচার কোড:</p>
              <p className="text-lg font-black font-mono text-indigo-200">NEXGEN-OFFICE1000</p>
            </div>

            <button
              onClick={() => {
                setShowExitIntent(false);
                sessionStorage.setItem(`nca_exit_${course.id}`, 'true');
                setIsAdmissionOpen(true);
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 font-bold text-xs rounded-xl shadow-lg"
            >
              ভাউচার দিয়ে ভর্তি আবেদন করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
