import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  Course,
  TrainerProfile,
  StudentCourseReview,
  ClassroomGalleryPhoto,
  CourseLandingCurriculumModule,
  CourseLandingPainPoint,
  CourseLandingFeatureCard,
  CourseLandingTargetAudienceItem,
  CourseLandingFaq,
  CourseLandingReview,
  CourseLandingGalleryImage,
  CoursePreferredScheduleOption
} from '../../types';
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
  Edit3,
  Video,
  ExternalLink,
  MapPin,
  Lock,
  RefreshCw,
  AlertTriangle,
  Target,
  Shield,
  Check
} from 'lucide-react';
import { OnlineAdmissionModal } from './OnlineAdmissionModal';
import { CourseLandingPageEditorModal } from '../courses/CourseLandingPageEditorModal';
import {
  trackMetaPixelEvent,
  getCapturedUtmParams
} from '../../utils/analyticsTracker';
import {
  cleanWhatsAppNumber,
  getWhatsAppDirectUrl,
  getMessengerDirectUrl
} from '../../utils/whatsappHelper';
import { evaluateFormSubmission } from '../../utils/fraudProtectionEngine';
import { requestNewOtp, verifyOtpSubmission } from '../../utils/otpVerificationEngine';
import { copyToClipboardSafe } from '../../utils/clipboardHelper';
import { getCourseSeoMetadata, applySeoMetadata } from '../../utils/seoHelper';

interface MasterCourseLandingPageViewProps {
  course: Course;
  onBackToFullWebsite?: () => void;
}

const DEFAULT_PAIN_POINTS: CourseLandingPainPoint[] = [
  {
    problem: 'পুরোনো ধাঁচে ঘণ্টার পর ঘণ্টা কপি-পেস্ট ও ম্যানুয়াল টাইপিং করতে হয়',
    solution: 'ChatGPT ও Copilot দিয়ে কয়েক সেকেন্ডে নির্ভুল প্রফেশনাল ইমেইল, ড্রাফট ও রিপোর্ট তৈরি'
  },
  {
    problem: 'অফিসে বড় ডেটাসেট আসলে হিসাব করতে হিমশিম খাওয়া ও ফর্মুলা ভুলে যাওয়া',
    solution: 'Excel VLOOKUP, XLOOKUP, Pivot Table ও অটোমেটেড ফর্মুলা দিয়ে যেকোনো হিসাব মুহূর্তেই সম্পন্ন'
  },
  {
    problem: 'সাধারণ সাদামাটা স্লাইড দেখে ক্লায়েন্ট বা বসের বিরক্তি প্রকাশ',
    solution: 'PowerPoint ও AI টুলস দিয়ে দৃষ্টিনন্দন কর্পোরেট প্রেজেন্টেশন ও অ্যানিমেশন ডিজাইন'
  },
  {
    problem: 'ফাইলিং ও ডকুমেন্টস হারিয়ে যাওয়া এবং টিমের সাথে কাজ না মেলা',
    solution: 'Google Docs, Sheets, Drive ও ক্লাউড কোলাবোরেশনে স্মার্ট টিমওয়ার্ক'
  }
];

const DEFAULT_FEATURE_CARDS: CourseLandingFeatureCard[] = [
  {
    iconName: 'laptop',
    title: '১০০% হ্যান্ডস-অন ল্যাব প্র্যাকটিস',
    description: 'ক্লাসরুমেই প্রতিটি শিক্ষার্থীর জন্য আলাদা পার্সোনাল কম্পিউটার ও রিয়েল-লাইফ অ্যাসাইনমেন্ট।'
  },
  {
    iconName: 'zap',
    title: 'AI ইন্টিগ্রেশন ও স্মার্ট প্রম্পটিং',
    description: 'অফিসের কাজ ৫ গুণ দ্রুত করতে ChatGPT, Gemini ও Microsoft Copilot-এর বাস্তব ব্যবহার।'
  },
  {
    iconName: 'award',
    title: 'ভেরিফায়েবল সরকারি ও আইটি সার্টিফিকেট',
    description: 'কোর্স শেষে অনলাইন কিউআর কোড ভেরিফিকেশন সহ প্রফেশনাল সার্টিফিকেট প্রদান।'
  },
  {
    iconName: 'briefcase',
    title: 'জব-রেডি রিয়েল অফিস প্রজেক্ট',
    description: 'অফিসিয়াল চিঠি, ক্যাশবুক, ইনভয়েস, স্যালারি শিট ও পে-রোল ম্যানেজমেন্ট প্রজেক্ট।'
  },
  {
    iconName: 'shield',
    title: 'লাইফটাইম মেন্টর ও ল্যাব সাপোর্ট',
    description: 'কোর্স শেষ হলেও যেকোনো সময়ে ল্যাব ব্যবহার ও মেন্টরদের কাছ থেকে ফ্রি সলিউশন সুবিধা।'
  },
  {
    iconName: 'users',
    title: 'ক্যারিয়ার ও সিভি মেকিং গাইডলাইন',
    description: 'স্ট্যান্ডার্ড সিভি ও ইন্টারভিউ প্রিপারেশন এবং করপোরেট কমিউনিকেশন টিপস।'
  }
];

const DEFAULT_AUDIENCE: CourseLandingTargetAudienceItem[] = [
  {
    group: '👨‍🎓 শিক্ষার্থী ও ফ্রেশার (SSC / HSC / অনার্স)',
    benefit: 'চাকরির বাজারে প্রবেশের আগেই নিজেকে স্কিলড ও কম্পিউটার এক্সপার্ট হিসেবে প্রস্তুত করতে।'
  },
  {
    group: '💼 চাকরিপ্রত্যাশী ও তরুণ-তরুণী',
    benefit: 'প্র্যাকটিক্যাল স্কিল ও ভেরিফায়েবল সার্টিফিকেটের মাধ্যমে ভালো জবের ইন্টারভিউতে এগিয়ে থাকতে।'
  },
  {
    group: '👔 কর্মরত চাকুরিজীবী ও এক্সিকিউটিভ',
    benefit: 'অফিসের প্রতিদিনের কাজের গতি বাড়াতে, ভুল কমাতে ও পদোন্নতির জন্য AI টুলস আয়ত্ত করতে।'
  },
  {
    group: '👩‍💼 গৃহিণী ও ফ্রিল্যান্সিং করতে আগ্রহী যে কেউ',
    benefit: 'ডাটা এন্ট্রি, ভার্চুয়াল অ্যাসিস্ট্যান্ট ও ক্লাউড অফিস ম্যানেজমেন্ট শিখে ঘরে বসে ক্যারিয়ার গড়তে।'
  }
];

const DEFAULT_LAB_PHOTOS: CourseLandingGalleryImage[] = [
  { id: 'def-p1', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80', title: 'আধুনিক কম্পিউটার ল্যাব ও ডেডিকেটেড পিসি', category: 'কম্পিউটার ল্যাব' },
  { id: 'def-p2', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80', title: 'প্র্যাকটিক্যাল অফিস ও এক্সেল ওয়ার্কশপ', category: 'হ্যান্ডস-অন ক্লাস' },
  { id: 'def-p3', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80', title: 'টিম কোলাবোরেশন ও প্রজেক্ট প্রেজেন্টেশন', category: 'গ্রুপ স্টাডি' },
  { id: 'def-p4', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80', title: 'সিনিয়র মেন্টরদের ওয়ান-টু-ওয়ান গাইডেন্স', category: 'মেন্টরিং সেশন' },
  { id: 'def-p5', url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80', title: 'গ্র্যাজুয়েশন ও সার্টিফিকেট প্রদান অনুষ্ঠান', category: 'কনভোকেশন' },
  { id: 'def-p6', url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80', title: 'শীতাতপ নিয়ন্ত্রিত স্মার্ট ক্লাসরুম', category: 'ক্যাম্পাস পরিবেশ' }
];

const DEFAULT_REVIEWS: CourseLandingReview[] = [
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
    text: 'আমার টাইピング স্পিড ১৫ WPM থেকে এখন ৪৮ WPM এ পৌঁছেছে। মেন্টরদের আন্তরিকতা ও ধৈর্য সত্যিই প্রশংসনীয়।'
  },
  {
    name: 'মোঃ জাহিদ হাসান',
    roleOrBatch: 'অ্যাকাউন্টিং অফিসার • ব্যাচ-০৮',
    rating: 5,
    text: 'VLOOKUP, XLOOKUP এবং Pivot Table দিয়ে এখন যেকোনো ব্যালান্স শিট ও স্যালারি শিট এক নিমিষে বানিয়ে ফেলতে পারি।'
  }
];

const DEFAULT_FAQS: CourseLandingFaq[] = [
  {
    question: 'এই কোর্সে ভর্তি হতে কি কোনো পূর্ব অভিজ্ঞতার প্রয়োজন আছে?',
    answer: 'না, কোনো পূর্ব অভিজ্ঞতার প্রয়োজন নেই। একদম শুরু থেকে কম্পিউটার অন-অফ, টাইপিং থেকে শুরু করে অ্যাডভান্সড এক্সেল ও AI প্রম্পটিং পর্যন্ত শূন্য থেকেই হাতে-কলমে শেখানো হবে।'
  },
  {
    question: 'ল্যাবে কি প্রতিটি শিক্ষার্থীর জন্য আলাদা কম্পিউটার থাকবে?',
    answer: 'হ্যাঁ, আমাদের ফার্মগেট ক্যাম্পাসে হাই-স্পিড ইন্টারনেট ও শীতাতপ নিয়ন্ত্রিত আধুনিক ল্যাবে প্রতিটি শিক্ষার্থীর জন্য ডেডিকেটেড পার্সোনাল পিসি বরাদ্দ থাকে।'
  },
  {
    question: 'ক্লাস মিস গেলে কি ব্যাকআপ সাপোর্ট বা রেকর্ডিং পাওয়া যাবে?',
    answer: 'হ্যাঁ, ক্লাস মিস গেলে আমাদের রয়েছে ডেডিকেটেড মেন্টর সাপোর্ট ও স্টুডেন্ট পোর্টাল ব্যাকআপ ক্লাস নোটস।'
  },
  {
    question: 'কোর্স শেষে কি সার্টিফিকেট দেওয়া হবে?',
    answer: 'হ্যাঁ, কোর্স সমাপ্তির পর সফল শিক্ষার্থীদের সরকারি ও বেসরকারি প্রতিষ্ঠানে গ্রহণযোগ্য ভেরিফায়েবল সার্টিফিকেট প্রদান করা হবে।'
  },
  {
    question: 'ভর্তি ফি কি কিস্তিতে (Installment) পরিশোধ করা যাবে?',
    answer: 'হ্যাঁ, প্রাথমিক মাত্র ৳২,৫০০ দিয়ে সিট বুকিং করে বাকি কোর্স ফি সহজ ২টি কিস্তিতে পরিশোধের সুযোগ রয়েছে।'
  }
];

const DEFAULT_BONUSES: string[] = [
  'ChatGPT & AI Office Productivity প্রম্পট গাইড বুক (PDF ফ্রি)',
  '৫০+ রেডিমেড করপোরেট এক্সেল ও ওয়ার্ড টেমপ্লেট লাইব্রেরি',
  'ফুল স্পিড টাইピング সফটওয়্যার ফুল লাইসেন্স',
  'প্রফেশনাল সিভি মেকিং ফরম্যাট ও ইন্টারভিউ প্রশ্ন ব্যাংক',
  'লাইফটাইম ক্লাস রিসোর্স ও ভিডিও ব্যাকআপ সাপোর্ট'
];

const DEFAULT_TRAINERS: TrainerProfile[] = [
  {
    id: 'tr-def-1',
    name: 'প্রদীপ চৌধুরী',
    designation: 'লিড ট্রেইনার ও আইটি স্পেশালিস্ট',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    experienceYears: 8,
    shortBio: '৮+ বছরের করপোরেট ও প্র্যাকটিক্যাল অফিস ম্যানেজমেন্ট ট্রেনিং অভিজ্ঞতা। শত শত শিক্ষার্থীকে সফল ক্যারিয়ার গড়তে মেন্টরিং করেছেন।',
    skills: ['MS Word Pro', 'Excel Dashboards', 'PowerPoint AI', 'Office Automation'],
    isActive: true
  },
  {
    id: 'tr-def-2',
    name: 'মাহফুজুর রহমান',
    designation: 'অ্যাডভান্সড এক্সেল ও ডেটা স্পেশালিস্ট',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    experienceYears: 6,
    shortBio: 'মাল্টিন্যাশনাল কোম্পানিতে ডেটা অ্যানালাইসিস ও AI প্রম্পট ইঞ্জিনিয়ারিং মেন্টর হিসেবে সফলভাবে দায়িত্ব পালন করছেন।',
    skills: ['XLOOKUP & Pivot', 'Financial Modeling', 'ChatGPT Prompts', 'Google Workspace'],
    isActive: true
  }
];

export const MasterCourseLandingPageView: React.FC<MasterCourseLandingPageViewProps> = ({
  course: propCourse,
  onBackToFullWebsite
}) => {
  const { courses, websiteCmsConfig, staffList, addLead, submitPublicLead, academySettings, isAuthenticated, currentUser } = useAcademy();
  const course = courses.find(c => c.id === propCourse.id || c.code === propCourse.code) || propCourse;

  // Authorization check: Only authenticated admins/managers can edit landing page contents
  const canEdit = Boolean(
    isAuthenticated &&
    currentUser &&
    ['SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER'].includes(currentUser.role)
  );

  // Dynamic Course SEO Metadata & JSON-LD Schemas (Course, BreadcrumbList, FAQPage)
  useEffect(() => {
    const assignedTrainers = staffList.filter(s =>
      course.trainerIds?.includes(s.id) || s.id === course.trainerId
    );
    const seoMeta = getCourseSeoMetadata(course, academySettings, websiteCmsConfig, assignedTrainers);
    applySeoMetadata(seoMeta);
  }, [course, academySettings, websiteCmsConfig, staffList]);

  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<{ url: string; title?: string; category?: string } | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Fast Lead Inline Form States
  const [leadFormMode, setLeadFormMode] = useState<'admission' | 'counseling'>('admission');
  const [formRenderTime] = useState<number>(Date.now());
  const [honeypot, setHoneypot] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSchedule, setLeadSchedule] = useState('Weekend (Fri-Sat)');
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Social Proof Admission Alert Ticker State
  const [isTickerVisible, setIsTickerVisible] = useState(true);
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

  // OTP Verification States
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSimulatedCode, setOtpSimulatedCode] = useState<string | null>(null);
  const [otpError, setOtpError] = useState('');
  const [otpNotice, setOtpNotice] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const landingConfig = course.landingConfig || {};
  const pixelId = websiteCmsConfig?.marketing?.metaPixelId;
  const fraudConfig = websiteCmsConfig?.fraudProtection;
  const otpConfig = websiteCmsConfig?.otpConfig;

  // Available Schedules (from CRM landingConfig or smart defaults)
  const availableSchedules: CoursePreferredScheduleOption[] =
    landingConfig.preferredSchedules && landingConfig.preferredSchedules.length > 0
      ? landingConfig.preferredSchedules
      : [
          { id: 'sch-1', label: 'উইকেন্ড (শুক্র-শনিবার সকাল ১০:০০ - ১২:০০)', days: 'Fri & Sat', timeSlot: '10:00 AM - 12:00 PM', mode: 'Offline', availableSeats: 5 },
          { id: 'sch-2', label: 'উইকেন্ড (শুক্র-শনিবার বিকাল ৩:০০ - ৫:০০)', days: 'Fri & Sat', timeSlot: '3:00 PM - 5:00 PM', mode: 'Offline', availableSeats: 7 },
          { id: 'sch-3', label: 'সান্ধ্যকালীন ব্যাচ (রবি, মঙ্গল ও বৃহস্পতি সন্ধ্যা ৬:৩০ - ৮:৩০)', days: 'Sun, Tue & Thu', timeSlot: '6:30 PM - 8:30 PM', mode: 'Both', availableSeats: 6 },
          { id: 'sch-4', label: 'অনলাইন লাইভ নাইট ব্যাচ (রাত ৯:০০ - ১০:৩০)', days: 'Sat, Mon & Wed', timeSlot: '9:00 PM - 10:30 PM', mode: 'Online Live', availableSeats: 12 }
        ];

  // Social Proof Ticker Items
  const socialTickerItems =
    landingConfig.socialProofTickerConfig?.customItems &&
    landingConfig.socialProofTickerConfig.customItems.length > 0
      ? landingConfig.socialProofTickerConfig.customItems
      : [
          {
            name: 'মোঃ তানভীর হাসান',
            location: 'মিরপুর-১০, ঢাকা',
            timeAgo: '৩ মিনিট আগে',
            actionText: 'অফিস অ্যাপ্লিকেশন স্কলারশিপ ব্যাচে সিট বুক করেছেন'
          },
          {
            name: 'নুসরাত জাহান',
            location: 'ধানমন্ডি, ঢাকা',
            timeAgo: '১২ মিনিট আগে',
            actionText: 'ফ্রি ল্যাব ভিজিট ও ক্যারিয়ার কাউন্সিলিং বুক করেছেন'
          },
          {
            name: 'আরিফুল ইসলাম',
            location: 'ফার্মগেট ক্যাম্পাস',
            timeAgo: '২৪ মিনিট আগে',
            actionText: 'অ্যাডমিশন কনফার্ম করেছেন'
          },
          {
            name: 'সাবরিনা সুলতানা',
            location: 'উত্তরা, ঢাকা',
            timeAgo: '৪৫ মিনিট আগে',
            actionText: 'স্পেশাল স্কলারশিপ অফার গ্রহণ করেছেন'
          }
        ];

  const isTickerEnabled = landingConfig.socialProofTickerConfig?.enabled ?? true;

  // Rotate social proof ticker
  useEffect(() => {
    if (!isTickerEnabled || socialTickerItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTickerIndex(prev => (prev + 1) % socialTickerItems.length);
    }, (landingConfig.socialProofTickerConfig?.intervalSeconds || 6) * 1000);
    return () => clearInterval(interval);
  }, [isTickerEnabled, socialTickerItems.length, landingConfig.socialProofTickerConfig?.intervalSeconds]);

  // Track ViewContent on mount
  useEffect(() => {
    trackMetaPixelEvent(
      'ViewContent',
      {
        content_name: course.name,
        content_category: course.category,
        content_ids: [course.id],
        content_type: 'product',
        value: course.offerFee || course.regularFee,
        currency: 'BDT'
      },
      pixelId
    );
  }, [course.id, course.name, course.category, course.offerFee, course.regularFee, pixelId]);

  // Assigned Faculty/Trainers
  const allTrainers: TrainerProfile[] = websiteCmsConfig?.trainersList || [];
  const assignedTrainers = allTrainers.filter(t => t.coursesAssigned?.includes(course.id) && t.isActive);
  const fallbackTrainers = allTrainers.filter(t => t.isActive).slice(0, 2);
  const displayTrainers = assignedTrainers.length > 0 ? assignedTrainers : (fallbackTrainers.length > 0 ? fallbackTrainers : DEFAULT_TRAINERS);

  // Associated Reviews: Priority 1 - customReviews from landingConfig, Priority 2 - CMS assigned reviews, Priority 3 - DEFAULT_REVIEWS
  const customReviews: CourseLandingReview[] = (landingConfig.customReviews && landingConfig.customReviews.length > 0) ? landingConfig.customReviews : [];
  const cmsReviews: StudentCourseReview[] = websiteCmsConfig?.studentCourseReviews || [];
  const assignedCmsReviews = cmsReviews.filter(r => r.courseId === course.id && r.isActive);
  const fallbackCmsReviews = cmsReviews.filter(r => r.isActive).slice(0, 3);
  const displayCmsReviews = assignedCmsReviews.length > 0 ? assignedCmsReviews : fallbackCmsReviews;

  // Associated Lab Gallery Photos: Priority 1 - galleryImages from landingConfig, Priority 2 - CMS photos, Priority 3 - DEFAULT_LAB_PHOTOS
  const customGallery: CourseLandingGalleryImage[] = (landingConfig.galleryImages && landingConfig.galleryImages.length > 0) ? landingConfig.galleryImages : [];
  const cmsPhotos: ClassroomGalleryPhoto[] = websiteCmsConfig?.classroomGalleryPhotos || [];
  const displayCmsPhotos = cmsPhotos.filter(p => p.isActive).slice(0, 6);

  // Computed Discount
  const discountPercent =
    course.regularFee && course.offerFee && course.regularFee > course.offerFee
      ? Math.round(((course.regularFee - course.offerFee) / course.regularFee) * 100)
      : 40;

  // WhatsApp & Messenger links
  const rawPhone =
    landingConfig.customWhatsAppNumber ||
    websiteCmsConfig?.marketing?.floatingWhatsAppNumber ||
    '01798444444';
  const defaultWhatsAppMsg =
    landingConfig.customWhatsAppMessage ||
    `Hello Nexgen Academy! I want to enroll in "${course.name}" with the special discount.`;
  const whatsAppUrl = getWhatsAppDirectUrl(rawPhone, defaultWhatsAppMsg);

  const rawMessenger =
    landingConfig.customMessengerUrl ||
    websiteCmsConfig?.socialLinks?.facebookPageUrl ||
    'https://m.me/nexgenacademy';
  const messengerUrl = getMessengerDirectUrl(rawMessenger);

  // Dynamic Content Sources from landingConfig with robust fallbacks
  const painPoints: CourseLandingPainPoint[] = (landingConfig.painPointsList && landingConfig.painPointsList.length > 0) ? landingConfig.painPointsList : DEFAULT_PAIN_POINTS;
  const featureCards: CourseLandingFeatureCard[] = (landingConfig.featureCards && landingConfig.featureCards.length > 0) ? landingConfig.featureCards : DEFAULT_FEATURE_CARDS;
  const audienceList: CourseLandingTargetAudienceItem[] = (landingConfig.audienceList && landingConfig.audienceList.length > 0) ? landingConfig.audienceList : DEFAULT_AUDIENCE;
  const editableModules: CourseLandingCurriculumModule[] =
    landingConfig.editableModules && landingConfig.editableModules.length > 0
      ? landingConfig.editableModules
      : course.modules?.map((m, idx) => ({
          id: m.id || `mod-${idx}`,
          moduleNumber: m.moduleNumber || idx + 1,
          moduleName: m.moduleName,
          subtitle: '',
          description: m.moduleDescription,
          estimatedClasses: m.estimatedClasses ? `${m.estimatedClasses} সেশন` : '৪ সেশন',
          topics: m.topics || []
        })) || [];
  const faqs: CourseLandingFaq[] = (landingConfig.faqs && landingConfig.faqs.length > 0) ? landingConfig.faqs : DEFAULT_FAQS;
  const bonusItems: string[] = (landingConfig.bonusItems && landingConfig.bonusItems.length > 0) ? landingConfig.bonusItems : DEFAULT_BONUSES;
  const ctaMode = landingConfig.ctaMode || 'both';

  // Campus Address & Phone
  const campusAddress =
    landingConfig.campusAddress ||
    websiteCmsConfig?.officeAddress ||
    '১৪/বি, গার্ডেন রোড, কাজী নজরুল ইসলাম এভিনিউ (ফার্মগেট ওভারব্রিজ সংলগ্ন), ঢাকা-১২১৫';
  const campusPhone =
    landingConfig.campusPhone ||
    websiteCmsConfig?.multiplePhones?.find(p => p.isHotline)?.number ||
    websiteCmsConfig?.whatsappSupportNumber ||
    '01798-444444';
  const campusHours =
    landingConfig.campusHours ||
    websiteCmsConfig?.officeHours ||
    'সকাল ৯:০০ টা - রাত ৮:০০ টা (প্রতিদিন খোলা)';

  const handleWhatsAppClick = () => {
    trackMetaPixelEvent(
      'Contact',
      {
        channel: 'WhatsApp Direct',
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
        channel: 'Messenger Direct',
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

  // Process Lead Submission
  const processLeadRegistration = () => {
    const utms = getCapturedUtmParams();
    const today = new Date().toISOString().split('T')[0];

    const isCounselingMode = leadFormMode === 'counseling';
    const commentsText = isCounselingMode
      ? `[ফ্রি ল্যাব ভিজিট ও ক্যারিয়ার কাউন্সিলিং রিকোয়েস্ট] Schedule: ${leadSchedule}. Discount/Batch: ${landingConfig.customDiscountBadge || 'NEXGEN2026'}.`
      : `Fast Inquiry on Course Landing Page. Schedule: ${leadSchedule}. Discount Code: ${landingConfig.customDiscountBadge || 'NEXGEN2026'}.`;

    const leadSourceStr = utms.utmSource
      ? `Ad: ${utms.utmSource} (${isCounselingMode ? 'Counseling' : 'Direct'})`
      : isCounselingMode
      ? 'Course Landing Free Counseling'
      : 'Course Landing Fast Form';

    // 1. Send to server-side lead pipeline and disk queue
    submitPublicLead({
      fullName: leadName.trim(),
      studentName: leadName.trim(),
      phone: leadPhone.trim(),
      email: leadEmail.trim() || undefined,
      courseId: course.id,
      courseName: course.name,
      interestedCourseId: course.id,
      preferredSchedule: leadSchedule,
      preferredTime: leadSchedule,
      leadSource: leadSourceStr,
      source: leadSourceStr,
      landingPageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      landingPage: typeof window !== 'undefined' ? window.location.pathname : undefined,
      utmSource: utms.utmSource,
      utmMedium: utms.utmMedium,
      utmCampaign: utms.utmCampaign,
      utmContent: utms.utmContent,
      utmTerm: utms.utmTerm,
      comments: commentsText,
      message: commentsText,
      honeypotVal: honeypot,
      renderTimestampMs: formRenderTime,
      otpVerified: !!otpCode
    }).catch(err => {
      console.warn('Network submission notice, queued locally:', err);
    });

    // 2. Also register in local state for instant client-side feedback
    addLead({
      name: leadName.trim(),
      phone: leadPhone.trim(),
      email: leadEmail.trim() || undefined,
      interestedCourseId: course.id,
      leadSource: leadSourceStr,
      campaignId: utms.utmCampaign,
      utmSource: utms.utmSource,
      utmMedium: utms.utmMedium,
      utmCampaign: utms.utmCampaign,
      utmContent: utms.utmContent,
      utmTerm: utms.utmTerm,
      deviceType: 'Mobile',
      locationCity: 'Dhaka',
      occupation: 'Student',
      educationLevel: 'HSC / Graduate',
      counselorId: 'counselor-01',
      counselorName: 'Online Admission Cell',
      visitDate: today,
      firstContactDate: today,
      status: 'New',
      comments: commentsText
    });

    trackMetaPixelEvent(
      isCounselingMode ? 'Contact' : 'Lead',
      {
        content_name: course.name,
        form_mode: leadFormMode,
        value: isCounselingMode ? 0 : (course.offerFee || 0),
        currency: 'BDT'
      },
      pixelId
    );

    setLeadSuccess(true);
    setIsSubmitting(false);
  };

  const handleFastLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError('');
    setIsSubmitting(true);

    // 1. Evaluate Multi-layer Fraud & Honeypot
    const evaluation = evaluateFormSubmission({
      fullName: leadName,
      phone: leadPhone,
      email: leadEmail,
      honeypotVal: honeypot,
      formRenderTimeMs: formRenderTime,
      config: fraudConfig
    });

    if (evaluation.isBlocked) {
      setLeadError('Your submission could not be processed due to security reasons. Please contact our helpline directly.');
      setIsSubmitting(false);
      return;
    }

    // 2. Check if OTP is Required
    const shouldVerifyOtp =
      otpConfig?.mode === 'ON' ||
      (otpConfig?.mode === 'HIGH_RISK_ONLY' && evaluation.requiresOtpOrCaptcha);

    if (shouldVerifyOtp) {
      const otpResp = requestNewOtp(leadPhone, otpConfig);
      if (!otpResp.success) {
        setLeadError(otpResp.message);
        setIsSubmitting(false);
        return;
      }

      setOtpSimulatedCode(otpResp.simulatedCode || null);
      setOtpNotice(otpResp.message);
      setIsOtpModalOpen(true);
      setIsSubmitting(false);
      return;
    }

    // Otherwise proceed directly
    processLeadRegistration();
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setIsVerifyingOtp(true);

    const verifyResp = verifyOtpSubmission(leadPhone, otpCode);
    if (!verifyResp.success) {
      setOtpError(verifyResp.message);
      setIsVerifyingOtp(false);
      return;
    }

    setIsVerifyingOtp(false);
    setIsOtpModalOpen(false);
    processLeadRegistration();
  };

  // Helper function to render an icon by string name
  const renderFeatureIcon = (iconName?: string) => {
    switch (iconName) {
      case 'laptop':
        return <Laptop className="w-5 h-5 text-indigo-400" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'award':
        return <Award className="w-5 h-5 text-emerald-400" />;
      case 'briefcase':
        return <Briefcase className="w-5 h-5 text-purple-400" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      case 'users':
        return <Users className="w-5 h-5 text-rose-400" />;
      case 'clock':
        return <Clock className="w-5 h-5 text-teal-400" />;
      case 'file-text':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white pb-24 sm:pb-20">
      {/* Top Floating Admin / Navigation Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          {onBackToFullWebsite && (
            <button
              onClick={onBackToFullWebsite}
              className="flex items-center space-x-1.5 text-slate-300 hover:text-white font-bold transition-colors"
            >
              <span>← মূল ওয়েবসাইট (Main Website)</span>
            </button>
          )}
          <span className="hidden sm:inline-block text-slate-500">•</span>
          <span className="hidden sm:inline-flex items-center space-x-1 text-indigo-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>লাইভ ল্যান্ডিং পেজ (Dynamic CMS Enabled)</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShareClick}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center space-x-1 transition-colors"
            title="Copy Ad Landing Link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{copiedUrl ? 'Copied!' : 'Share Link'}</span>
          </button>
          {canEdit && (
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center space-x-1.5 shadow-sm transition-all active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>এডিট ল্যান্ডিং পেজ (Edit CMS)</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: HERO & MAIN CTA */}
      <header className="relative pt-8 pb-14 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline, Subheadline, Guarantee & Badges */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-black tracking-wide">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{landingConfig.heroBadge || '🚀 স্পেশাল স্কলারশিপ ব্যাচ অ্যাডমিশন শুরু'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight sm:leading-none tracking-tight">
              {landingConfig.headline || course.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
              {landingConfig.subheadline ||
                course.description ||
                '১০০% প্র্যাকটিক্যাল কম্পিউটার ল্যাব ট্রেনিং, লাইভ মার্কেটপ্লেস ও প্রজেক্ট সাপোর্ট এবং চাকরি ও ফ্রিল্যান্সিং গাইডলাইন।'}
            </p>

            {/* Micro Highlights Pill */}
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>{course.durationMonths} মাস প্র্যাকটিক্যাল ট্রেনিং</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200">
                <Laptop className="w-4 h-4 text-emerald-400" />
                <span>ডেডিকেটেড হাই-কনফিগ পিসি ল্যাব</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-200">
                <Award className="w-4 h-4 text-amber-400" />
                <span>ভেরিফায়েবল সার্টিফিকেট</span>
              </div>
            </div>

            {/* Pricing Box & Countdown Card */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/30 rounded-3xl space-y-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  ৳{(course.offerFee ?? course.regularFee ?? 0).toLocaleString()}
                </span>
                {course.regularFee && (
                  <span className="text-lg text-slate-400 line-through font-semibold">
                    ৳{course.regularFee.toLocaleString()}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-black">
                  {landingConfig.customDiscountBadge || `${discountPercent}% স্কলারশিপ ছাড়`}
                </span>
              </div>

              {landingConfig.showBatchCountdown && (
                <div className="flex items-center justify-between text-xs text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-2xl">
                  <span>পরবর্তী ব্যাচ শুরু: {landingConfig.nextBatchStartDate || '১৫ মে, ২০২৬'}</span>
                  <span>বাকি সিট: {landingConfig.availableSeats || 8} টি</span>
                </div>
              )}

              {/* Primary Action Buttons based on ctaMode */}
              <div className="space-y-3 pt-1">
                {(ctaMode === 'both' || ctaMode === 'admission_only' || ctaMode === 'whatsapp_and_admission') && (
                  <button
                    onClick={() => setIsAdmissionOpen(true)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>অনলাইনে এখনই ভর্তি আবেদন করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {/* Highlighted Direct Chat Box for Social Contact */}
                {ctaMode !== 'admission_only' && (
                  <div className="p-3 bg-slate-950/90 border border-slate-700/80 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        সরাসরি কথা বলতে চাইলে মেসেজ করুন:
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        Instant Reply
                      </span>
                    </div>

                    <div className={`grid gap-2 ${ctaMode === 'whatsapp_only' || ctaMode === 'messenger_only' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                      {(ctaMode === 'both' || ctaMode === 'whatsapp_only' || ctaMode === 'whatsapp_and_admission') && (
                        <a
                          href={whatsAppUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={handleWhatsAppClick}
                          className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>WhatsApp এ সরাসরি মেসেজ করুন</span>
                        </a>
                      )}

                      {(ctaMode === 'both' || ctaMode === 'messenger_only' || ctaMode === 'whatsapp_and_admission') && (
                        <a
                          href={messengerUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={handleMessengerClick}
                          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>Facebook মেসেঞ্জারে মেসেজ দিন</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Guarantee Note */}
              {landingConfig.guaranteeText && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{landingConfig.guaranteeText}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Fast Registration Card / Banner Picture */}
          <div className="lg:col-span-5 space-y-4">
            {/* Banner Cover Image / Video Preview Card */}
            <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative group aspect-16/10 bg-slate-900">
              <img
                src={landingConfig.customBannerUrl || course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80'}
                alt={landingConfig.headline || course.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Play Video Trigger Overlay */}
              <div
                onClick={() => setIsVideoModalOpen(true)}
                className="absolute inset-0 bg-slate-950/40 hover:bg-slate-950/20 backdrop-blur-[2px] transition-all flex flex-col items-center justify-center cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-indigo-500 transition-all border-4 border-white/20">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white ml-1 text-white" />
                </div>
                <span className="mt-3 px-3.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-white border border-slate-700/80 shadow-lg flex items-center space-x-1.5">
                  <Video className="w-3.5 h-3.5 text-indigo-400" />
                  <span>ল্যাব ও কোর্স ট্রেলার ভিডিও দেখুন</span>
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end justify-between p-4 pointer-events-none">
                <span className="text-xs font-bold text-white bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700">
                  🏢 আধুনিক কম্পিউটার ল্যাব ও এসি ক্লাসরুম
                </span>
                {canEdit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditorOpen(true);
                    }}
                    className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg backdrop-blur-md flex items-center space-x-1.5 shadow-md cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>ছবি পরিবর্তন</span>
                  </button>
                )}
              </div>
            </div>

            {/* Fast Registration Card with Dual Admission / Counseling Tabs */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3.5 text-left">
              {/* Dual Tab Mode Toggle */}
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLeadFormMode('admission')}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    leadFormMode === 'admission'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>সরাসরি সিট বুকিং</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLeadFormMode('counseling')}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    leadFormMode === 'counseling'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>ফ্রি ল্যাব কাউন্সিলিং</span>
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="font-black text-sm sm:text-base text-white">
                    {leadFormMode === 'admission'
                      ? 'অনলাইন ফাস্ট সিট বুকিং ফরম'
                      : 'ফ্রি ২০ মিনিটের ক্যারিয়ার ও ল্যাব ভিজিট কাউন্সিলিং'}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {leadFormMode === 'admission'
                    ? 'আপনার নাম ও মোবাইল নাম্বার দিন, আমাদের টিম কল দিয়ে স্কলারশিপ অফার কনফার্ম করবে।'
                    : 'ফার্মগেট ক্যাম্পাসে সরাসরি এসে ল্যাব ঘুরে দেখুন এবং এক্সপার্ট মেন্টরের সাথে ক্যারিয়ার পরামর্শ নিন (সম্পূর্ণ ফ্রি)।'}
                </p>
              </div>

              {leadSuccess ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-black text-white text-sm">
                    {leadFormMode === 'counseling'
                      ? 'ধন্যবাদ! আপনার ফ্রি কাউন্সিলিং রিকোয়েস্ট গ্রহণ করা হয়েছে।'
                      : 'ধন্যবাদ! আপনার অ্যাডমিশন রিকোয়েস্ট গ্রহণ করা হয়েছে।'}
                  </h4>
                  <p className="text-xs text-slate-300">
                    আমাদের সিনিয়র কাউন্সেলর টিম দ্রুত আপনার দেওয়া নাম্বারে কল দিয়ে সময় ও ব্যাচ কনফার্ম করবে।
                  </p>
                </div>
              ) : (
                <form id="fast-lead-form-box" onSubmit={handleFastLeadSubmit} className="space-y-3">
                  {/* Invisible Honeypot */}
                  <input
                    type="text"
                    name="website_url_trap"
                    value={honeypot}
                    onChange={e => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                  />

                  {leadError && (
                    <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200 font-bold flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{leadError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-black text-slate-300 uppercase mb-1">
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={e => setLeadName(e.target.value)}
                      placeholder="e.g. মোঃ সাকিব হাসান"
                      className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-300 uppercase mb-1">
                      সচল মোবাইল নাম্বার (১১ ডিজিট) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={e => setLeadPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">
                        ইমেইল (ঐচ্ছিক)
                      </label>
                      <input
                        type="email"
                        value={leadEmail}
                        onChange={e => setLeadEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">
                        পছন্দের শিডিউল
                      </label>
                      <select
                        value={leadSchedule}
                        onChange={e => setLeadSchedule(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
                      >
                        {availableSchedules.map(sch => (
                          <option key={sch.id} value={sch.label}>
                            {sch.label} {sch.availableSeats ? `(${sch.availableSeats} সিট বাকি)` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 text-white rounded-xl font-black text-xs shadow-lg flex items-center justify-center space-x-2 transition-all mt-2 disabled:opacity-50 cursor-pointer ${
                      leadFormMode === 'counseling'
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
                    }`}
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : leadFormMode === 'counseling' ? (
                      <>
                        <span>ফ্রি ল্যাব ভিজিট ও ক্যারিয়ার সেশন বুক করুন</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>অনলাইনে স্কলারশিপ সিট বুক করুন</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-500 text-center">
                    🔒 সম্পূর্ণ গোপনীয় ও সুরক্ষিত। স্প্যামমুক্ত নিশ্চয়তা।
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 1.5: QUICK SNAPSHOT INFO BAR */}
      <section className="bg-slate-900/90 border-y border-slate-800/80 py-5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="flex items-center space-x-3 p-3 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">কোর্স মেয়াদ ও সেশন</span>
              <p className="text-xs sm:text-sm font-black text-white">
                {landingConfig.quickSnapshot?.duration || `${course.durationMonths || 3} মাস`} / {landingConfig.quickSnapshot?.totalSessions || '২৪টি প্র্যাকটিক্যাল ল্যাব'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ল্যাব ও কম্পিউটার</span>
              <p className="text-xs sm:text-sm font-black text-white">
                {landingConfig.quickSnapshot?.batchSize || '১ শিক্ষার্থী = ১ ডেডিকেটেড পিসি'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">লাইভ প্রজেক্ট</span>
              <p className="text-xs sm:text-sm font-black text-white">
                {landingConfig.quickSnapshot?.projectsCount || '১০+ রিয়েল কর্পোরেট ফাইল'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">সাপোর্ট ও ব্যাকআপ</span>
              <p className="text-xs sm:text-sm font-black text-white">
                {landingConfig.quickSnapshot?.supportType || 'লাইফটাইম ল্যাব ও গ্রুপ সাপোর্ট'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PROBLEM VS REALITY (PAIN POINTS & MODERN WORKPLACE) */}
      {painPoints.length > 0 && (
        <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm font-bold">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>চ্যালেঞ্জ ও আধুনিক সমাধান</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              {landingConfig.painPointsHeadline || 'পুরোনো পদ্ধতি বনাম ২০২৬-এর স্মার্ট অফিস স্কিল'}
            </h2>
            {landingConfig.painPointsSubheadline && (
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
                {landingConfig.painPointsSubheadline}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {painPoints.map((pt, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 hover:border-slate-700 transition-all text-left shadow-md"
              >
                {/* Problem */}
                <div className="flex items-start space-x-3 text-rose-300">
                  <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-sm font-black">
                    ✕
                  </div>
                  <div>
                    <span className="text-xs font-black text-rose-400 uppercase tracking-wider block">
                      পুরোনো সমস্যা:
                    </span>
                    <p className="text-sm font-semibold text-slate-200 mt-1 leading-relaxed">
                      {pt.problem}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-800" />

                {/* Solution */}
                <div className="flex items-start space-x-3 text-emerald-300">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-sm font-black">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
                      আমাদের ২০২৬ AI সল্যুশন:
                    </span>
                    <p className="text-sm font-bold text-white mt-1 leading-relaxed">
                      {pt.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: KEY FEATURES & WHY CHOOSE US */}
      {featureCards.length > 0 && (
        <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>কোর্সের বিশেষ সুবিধা সমূহ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              {landingConfig.whyChooseHeadline || 'কেন আমাদের এই কোর্সটি আপনার ক্যারিয়ার বদলে দেবে?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 text-left">
            {featureCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-5 sm:p-6 space-y-3 transition-all group shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-800 group-hover:bg-indigo-600/20 border border-slate-700 group-hover:border-indigo-500/40 flex items-center justify-center transition-colors">
                  {renderFeatureIcon(card.iconName)}
                </div>
                <h4 className="font-black text-white text-base sm:text-lg">{card.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: EDITABLE RICH CURRICULUM MODULES */}
      <section className="py-14 px-4 sm:px-6 max-w-5xl mx-auto border-t border-slate-800/60 text-left">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-bold">
            <BookOpen className="w-4 h-4" />
            <span>সিলেবাস ও প্রজেক্ট কারিকুলাম</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            {landingConfig.curriculumHeadline || 'হাতে-কলমে যা যা শেখানো হবে (১০০% প্র্যাকটিক্যাল ল্যাব)'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            {landingConfig.curriculumSubheadline || 'বেসিক থেকে ইন্ডাস্ট্রি লেভেল প্রজেক্ট পর্যন্ত সম্পূর্ণ স্টেপ-বাই-স্টেপ গাইডলাইন'}
          </p>
        </div>

        <div className="space-y-3.5">
          {editableModules.map((mod, idx) => {
            const isOpen = openModuleIndex === idx;
            return (
              <div
                key={mod.id || idx}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden transition-all hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => setOpenModuleIndex(isOpen ? null : idx)}
                  className="w-full p-4.5 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 font-black text-sm flex items-center justify-center shrink-0">
                      {mod.moduleNumber || idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base">{mod.moduleName}</h4>
                      {mod.subtitle && (
                        <p className="text-xs sm:text-sm text-indigo-300 font-medium">{mod.subtitle}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">
                        {mod.estimatedClasses ? `${mod.estimatedClasses}` : '৪টি প্র্যাকটিক্যাল সেশন'}
                      </p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-5 pt-1 border-t border-slate-800/80 bg-slate-950/60 space-y-3.5">
                    {mod.description && (
                      <p className="text-sm text-slate-200 leading-relaxed">{mod.description}</p>
                    )}

                    {mod.topics && mod.topics.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          টপিকসমূহ:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {mod.topics.map((t, tidx) => (
                            <div
                              key={tidx}
                              className="flex items-center space-x-2 text-sm text-slate-200 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="font-medium">{t}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {mod.practicalProject && (
                      <div className="p-3.5 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-sm flex items-center space-x-2.5 text-indigo-200">
                        <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>
                          <strong className="font-bold text-white">রিয়েল প্রজেক্ট:</strong> {mod.practicalProject}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4.5: PREFERRED SCHEDULES & BATCH TIMINGS */}
      {availableSchedules.length > 0 && (
        <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60 text-left">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-bold">
              <Calendar className="w-4 h-4" />
              <span>সুবিধাজনক ক্লাসের সময়সূচী</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              {landingConfig.preferredSchedulesTitle || 'পছন্দের ব্যাচ ও ক্লাসের শিডিউল নির্বাচন করুন'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              আপনার পড়াশোনা বা চাকুরির পাশাপাশি সুবিধাজনক স্লটে ক্লাস করতে পছন্দের দিন ও সময় বেছে নিন
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableSchedules.map((sch, idx) => {
              const isSelected = leadSchedule === sch.label;
              return (
                <div
                  key={sch.id || idx}
                  onClick={() => {
                    setLeadSchedule(sch.label);
                    document.getElementById('fast-lead-form-box')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`bg-slate-900/90 rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:border-emerald-500/50 shadow-lg ${
                    isSelected ? 'border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/30' : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-black rounded-lg border border-emerald-500/30">
                        {sch.days || 'Flexible'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        {sch.mode || 'Offline'}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base leading-snug">{sch.label}</h4>

                    {sch.timeSlot && (
                      <p className="text-xs text-slate-300 flex items-center space-x-1.5 font-mono">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{sch.timeSlot}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold">
                      🔥 {sch.availableSeats || 8} Seats Remaining
                    </span>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        isSelected ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? 'Selected ✓' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 5: TARGET AUDIENCE (WHO IS THIS COURSE FOR) */}
      {audienceList.length > 0 && (
        <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60 text-left">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs sm:text-sm font-bold">
              <Target className="w-4 h-4" />
              <span>কার জন্য এই কোর্সটি</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              {landingConfig.audienceHeadline || 'এই কোর্সটি কাদের জন্য ১০০% উপযুক্ত?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {audienceList.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-md"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 font-black text-sm flex items-center justify-center mb-3">
                    {idx + 1}
                  </div>
                  <h4 className="font-bold text-white text-base leading-snug">{item.group}</h4>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">{item.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 6: FREE BONUSES & PERKS */}
      {bonusItems.length > 0 && (
        <section className="py-14 px-4 sm:px-6 max-w-5xl mx-auto border-t border-slate-800/60 text-left">
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-black border border-amber-500/30">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>স্পেশাল ফ্রি বোনাস প্যাকেজ</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                {landingConfig.bonusHeadline || 'কোর্সে ভর্তির সাথে সাথে যা যা ফ্রি পাবেন'}
              </h3>
              <p className="text-sm text-slate-300">
                এই ব্যাচে ভর্তি হওয়া শিক্ষার্থীদের জন্য সম্পূর্ণ ফ্রিতে লাইফটাইম অ্যাক্সেস সহ প্রদান করা হবে
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {bonusItems.map((bonus, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-900/90 border border-indigo-500/20 rounded-2xl flex items-center space-x-3.5 shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white leading-snug">{bonus}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 7: TRAINERS & FACULTY */}
      <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60 text-left">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-bold">
            <Users className="w-4 h-4" />
            <span>ইন্ডাস্ট্রি এক্সপার্ট ট্রেইনার</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">আপনার মেন্টর ও ফ্যাকাল্টি প্যানেল</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            বাস্তব সফটওয়্যার ফার্ম ও টপ-রেটেড ফ্রিল্যান্সিংয়ে দীর্ঘদিনের অভিজ্ঞ মেন্টরদের সরাসরি গাইডেন্স
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayTrainers.map(trainer => (
            <div
              key={trainer.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 shadow-lg"
            >
              <img
                src={trainer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={trainer.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-indigo-500/30 shrink-0"
              />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-white text-base sm:text-lg">{trainer.name}</h4>
                  <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                    {trainer.experienceYears} Years Exp
                  </span>
                </div>
                <p className="text-sm text-indigo-400 font-bold">{trainer.designation}</p>
                <p className="text-sm text-slate-300 leading-relaxed">{trainer.shortBio}</p>
                {trainer.skills && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {trainer.skills.slice(0, 4).map((s, sidx) => (
                      <span key={sidx} className="text-xs bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-0.5 rounded-lg font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: STUDENT REVIEWS & TESTIMONIALS */}
      <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60 text-left">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-bold">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>শিক্ষার্থীদের মতামত ও সাফল্য</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">আমাদের গ্র্যাজুয়েটরা যা বলছেন</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Custom Reviews from landingConfig if available */}
          {customReviews.length > 0
            ? customReviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 font-black flex items-center justify-center text-base">
                          {rev.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                          <p className="text-xs text-slate-400">{rev.roleOrBatch}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-0.5 text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-xs font-bold">{rev.rating || 5}.0</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed italic">"{rev.text}"</p>
                  </div>

                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-medium">
                    ✓ ভেরিফায়েড শিক্ষার্থী রিভিউ
                  </div>
                </div>
              ))
            : displayCmsReviews.length > 0
            ? displayCmsReviews.map(rev => (
                <div
                  key={rev.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={rev.studentPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={rev.studentName}
                          className="w-11 h-11 rounded-xl object-cover ring-1 ring-amber-400/40"
                        />
                        <div>
                          <h4 className="font-bold text-white text-sm">{rev.studentName}</h4>
                          <p className="text-xs text-slate-400">{rev.profession || 'Student'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-0.5 text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-xs font-bold">{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed italic">"{rev.reviewText}"</p>
                  </div>

                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-medium">
                    {rev.batchNumber} • {rev.location}
                  </div>
                </div>
              ))
            : DEFAULT_REVIEWS.map((rev, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 font-black flex items-center justify-center text-base">
                          {rev.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                          <p className="text-xs text-slate-400">{rev.roleOrBatch}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-0.5 text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-xs font-bold">{rev.rating || 5}.0</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed italic">"{rev.text}"</p>
                  </div>

                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-medium">
                    ✓ ভেরিফায়েড শিক্ষার্থী রিভিউ
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* SECTION 8.5: CERTIFICATE SHOWCASE & VERIFICATION */}
      <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60 text-left">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>প্রফেশনাল ভেরিফায়েড সার্টিফিকেট</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            {landingConfig.certificateConfig?.headline || 'কোর্স শেষে ভেরিফায়েবল প্রফেশনাল সার্টিফিকেট'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            {landingConfig.certificateConfig?.subheadline || 'প্রতিটি সার্টিফিকেটে রয়েছে ইউনিক কিউআর কোড (QR Code) যা স্ক্যান করে দেশ-বিদেশের যেকোনো প্রতিষ্ঠান থেকে অনলাইন ভেরিফাই করা যাবে।'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
          {/* Left Certificate Mockup Preview */}
          <div className="lg:col-span-6 relative group">
            <div className="rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-slate-950 p-2 sm:p-3 relative">
              <div className="border border-amber-500/20 rounded-xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 text-center space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-amber-400" />
                    <span className="font-black text-xs uppercase tracking-widest text-amber-400">Academy Certificate</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded border border-amber-500/20 font-bold">
                    ISO & Govt Reg. Compliant
                  </span>
                </div>

                <div className="space-y-1 py-2">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">This is proudly presented to</p>
                  <h3 className="text-xl sm:text-2xl font-black text-white text-indigo-300">
                    {landingConfig.certificateConfig?.sampleStudentName || 'মোঃ তানভীর হাসান'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    for successfully completing hands-on practical training in
                  </p>
                  <h4 className="text-sm sm:text-base font-black text-amber-300">
                    {course.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                  <div className="text-left">
                    <span className="block font-mono text-slate-300">ID: NXC-2026-{course.id?.slice(0, 5) || '9823'}</span>
                    <span>Issued with Distinction</span>
                  </div>
                  <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>QR Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Certificate Feature Bullet Points */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-3">
              {(landingConfig.certificateConfig?.features || [
                'কোর্স শেষ করার পর লিখিত ও ল্যাব প্র্যাকটিক্যাল পরীক্ষার মাধ্যমে অ্যাসেসমেন্ট',
                'আন্তর্জাতিক মানের স্ট্যান্ডার্ড ও কিউআর কোড স্ক্যান করে অনলাইন ইনস্ট্যান্ট ভেরিফিকেশন',
                'সিভি (CV/Resume) এবং লিঙ্কডইন (LinkedIn) প্রোফাইলে ডিরেক্ট যোগ করার সুবিধা',
                'দেশীয় কর্পোরেট অফিস এবং রিমোট/ফ্রিল্যান্স মার্কেটপ্লেসে সম্পূর্ণ গ্রহণযোগ্য',
                'লাইফটাইম ডিজিটাল ভেরিফিকেশন লিংক ও প্রিন্টযোগ্য হাই-রেজুলেশন হার্ডকপি'
              ]).map((feat, fIdx) => (
                <div key={fIdx} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center space-x-2 text-xs text-amber-300 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{landingConfig.certificateConfig?.verificationNote || 'আমাদের সার্টিফিকেট দেশের শীর্ষস্থানীয় শতাধিক প্রতিষ্ঠানে মূল্যায়নযোগ্য।'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8.6: POST-COURSE LIFETIME SUPPORT & JOB GUIDELINE */}
      <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60 text-left">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-bold">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>লাইফটাইম মেন্টরশিপ ও ক্যারিয়ার সাপোর্ট</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            {landingConfig.lifetimeSupportConfig?.headline || 'কোর্স শেষ হওয়ার পরেও কি আপনি একা? একদমই না!'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            {landingConfig.lifetimeSupportConfig?.subheadline || 'আমাদের সাথে একবার যুক্ত হলে আপনি পাচ্ছেন লাইফটাইম ক্যারিয়ার এবং টেকনিক্যাল ব্যাকআপ সুবিধা।'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {(landingConfig.lifetimeSupportConfig?.features || [
            {
              title: 'ডেডিকেটেড প্রাইভেট সাপোর্ট গ্রুপ',
              desc: 'কোর্স চলাকালীন ও পরে যেকোনো প্রজেক্টের জটিলতায় গ্রুপে পোস্ট করলেই মেন্টরদের কাছ থেকে দ্রুত সলিউশন পাবেন।',
              iconName: 'users'
            },
            {
              title: 'রিভিশন ও এক্সট্রা ল্যাব প্র্যাকটিস',
              desc: 'কোনো ক্লাস মিস হলে বা কোনো টপিক বুঝতে সমস্যা হলে ফ্রি রিভিশন সেশন ও এক্সট্রা ল্যাব সাপোর্ট সুবিধা।',
              iconName: 'laptop'
            },
            {
              title: 'সিভি মেকিং ও ইন্টারভিউ গাইডলাইন',
              desc: 'প্রফেশনাল সিভি তৈরি, পোর্টফোলিও বিল্ডিং এবং কর্পোরেট ইন্টারভিউ মোক সেশনের মাধ্যমে জব-রেডি প্রস্তুতি।',
              iconName: 'briefcase'
            }
          ]).map((supportItem, sIdx) => (
            <div
              key={sIdx}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3 hover:border-indigo-500/40 transition-all shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                {renderFeatureIcon(supportItem.iconName)}
              </div>
              <h3 className="text-base font-black text-white">{supportItem.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{supportItem.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: CLASSROOM & LAB GALLERY */}
      <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60 text-left">
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-bold">
              <Laptop className="w-4 h-4" />
              <span>ল্যাব ও ক্যাম্পাস এনভায়রনমেন্ট</span>
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditorOpen(true)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>ছবি পরিবর্তন / আপলোড</span>
              </button>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">প্র্যাকটিক্যাল ল্যাব সেশনের কিছু মুহূর্ত</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            ফার্মগেট ক্যাম্পাসের শীতাতপ নিয়ন্ত্রিত আধুনিক মাল্টিমিডিয়া ল্যাব ও প্রতিটি শিক্ষার্থীর জন্য আলাদা ডেডিকেটেড কম্পিউটার
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {(customGallery.length > 0
            ? customGallery
            : displayCmsPhotos.length > 0
            ? displayCmsPhotos.map(p => ({ id: p.id, url: p.imageUrl, title: p.title, category: p.category }))
            : DEFAULT_LAB_PHOTOS
          ).map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => setSelectedLightboxImage({ url: photo.url, title: photo.title, category: photo.category })}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 aspect-4/3 cursor-pointer shadow-lg hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all duration-300"
            >
              <img
                src={photo.url}
                alt={photo.title || 'Lab Photo'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white leading-snug drop-shadow-sm">{photo.title}</h4>
                    {photo.category && (
                      <span className="inline-block mt-1 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        {photo.category}
                      </span>
                    )}
                  </div>
                  <span className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-white group-hover:bg-emerald-600 transition-colors shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: FAQS ACCORDION */}
      {faqs.length > 0 && (
        <section className="py-14 px-4 sm:px-6 max-w-4xl mx-auto border-t border-slate-800/60 text-left">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>সাধারণ প্রশ্ন ও উত্তর</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              {landingConfig.faqsHeadline || 'সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQs)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              কোর্স সম্পর্কিত আপনার যেকোনো প্রশ্নের উত্তর নিচে জেনে নিন
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-sm sm:text-base text-white pr-3 leading-snug">
                      {idx + 1}. {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-indigo-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-1 border-t border-slate-800 text-sm text-slate-200 leading-relaxed bg-slate-950/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 11: CAMPUS LOCATION & DIRECT CONTACT FOOTER */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto border-t border-slate-800/60 text-left">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
              <Building className="w-4 h-4" />
              <span>ক্যাম্পাস ভিজিট ও অফলাইন ভর্তি</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">সরাসরি ক্যাম্পাসে এসে কথা বলুন</h3>
            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{campusAddress}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>হটলাইন: <strong className="text-white font-bold">{campusPhone}</strong></span>
              </p>
              <p className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>সময়সূচী: {campusHours}</span>
              </p>
            </div>
          </div>

          <div className="space-y-3 flex flex-col justify-center">
            <button
              type="button"
              onClick={() => setIsAdmissionOpen(true)}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
            >
              <GraduationCap className="w-5 h-5" />
              <span>অনলাইনে সিট বুকিং সম্পন্ন করুন</span>
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              onClick={handleWhatsAppClick}
              className="w-full py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>হোয়াটসঅ্যাপে তাৎক্ষণিক কথা বলুন ({cleanWhatsAppNumber(rawPhone)})</span>
            </a>
          </div>
        </div>
      </section>

      {/* STICKY BOTTOM MOBILE ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 px-3 py-2 sm:hidden backdrop-blur-md shadow-2xl space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-slate-300 font-bold px-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            সরাসরি কথা বলুন:
          </span>
          <span className="text-amber-300 font-black">ফি: ৳{(course.offerFee ?? course.regularFee ?? 0).toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {/* Mobile WhatsApp */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noreferrer"
            onClick={handleWhatsAppClick}
            className="py-2 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl active:scale-95 shadow-md flex items-center justify-center space-x-1 text-[11px] font-bold"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp</span>
          </a>

          {/* Mobile Messenger */}
          <a
            href={messengerUrl}
            target="_blank"
            rel="noreferrer"
            onClick={handleMessengerClick}
            className="py-2 bg-blue-600 active:bg-blue-700 text-white rounded-xl active:scale-95 shadow-md flex items-center justify-center space-x-1 text-[11px] font-bold"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Messenger</span>
          </a>

          {/* Mobile Admission */}
          <button
            onClick={() => setIsAdmissionOpen(true)}
            className="py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-[11px] rounded-xl shadow-lg active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
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

      {/* Landing Page Content Editor Modal */}
      {isEditorOpen && canEdit && (
        <CourseLandingPageEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          course={course}
        />
      )}

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">OTP সিকিউরিটি ভেরিফিকেশন</h3>
              <p className="text-xs text-slate-400 mt-1">{otpNotice || `${leadPhone} নাম্বারে ৬ ডিজিটের কোড পাঠানো হয়েছে`}</p>
              {otpSimulatedCode && (
                <div className="mt-2 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs font-mono text-indigo-300 font-bold">
                  Simulated Code: {otpSimulatedCode}
                </div>
              )}
            </div>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-3">
              {otpError && (
                <div className="p-2 bg-rose-500/20 text-rose-200 text-xs font-bold rounded-xl">{otpError}</div>
              )}
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                placeholder="XXXXXX"
                className="w-full text-center tracking-widest text-lg font-bold font-mono py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black"
                >
                  {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lab Gallery Photo Lightbox Modal */}
      {selectedLightboxImage && (
        <div
          onClick={() => setSelectedLightboxImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-3 p-3 sm:p-4"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-2 pt-1">
              <div>
                <h4 className="text-base font-black text-white">{selectedLightboxImage.title || 'ক্যাম্পাস ও ল্যাব ফটো'}</h4>
                {selectedLightboxImage.category && (
                  <span className="text-xs text-emerald-400 font-semibold">{selectedLightboxImage.category}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedLightboxImage(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res Image */}
            <div className="relative rounded-2xl overflow-hidden bg-black max-h-[70vh] flex items-center justify-center">
              <img
                src={selectedLightboxImage.url}
                alt={selectedLightboxImage.title || 'Lab Photo Zoom'}
                className="w-full h-auto max-h-[70vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {isVideoModalOpen && (
        <div
          onClick={() => setIsVideoModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-3 p-4"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-indigo-400" />
                <h4 className="text-base font-black text-white">{course.name} - ল্যাব ও ক্লাস ওভারভিউ</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center relative">
              {landingConfig.videoPromoUrl ? (
                <iframe
                  src={
                    landingConfig.videoPromoUrl.includes('youtube.com') || landingConfig.videoPromoUrl.includes('youtu.be')
                      ? landingConfig.videoPromoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
                      : landingConfig.videoPromoUrl
                  }
                  title="Course Video Preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                  <h5 className="font-bold text-white text-base">ক্লাস ট্রেলার ও ল্যাব ভিডিও</h5>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {canEdit
                      ? 'অ্যাডমিন প্যানেলের এডিটর থেকে সরাসরি আপনার ইউটিউব বা ভিডিও লিংক যুক্ত করতে পারেন।'
                      : 'খুব শীঘ্রই ভিডিওটি আপডেট করা হবে। আমাদের ক্যাম্পাসে এসে সরাসরি ফ্রি ডেমো ক্লাস দেখতে পারেন।'}
                  </p>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsVideoModalOpen(false);
                        setIsEditorOpen(true);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      ভিডিও লিংক বসান (Edit Video Link)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Social Proof Admission Alert Ticker */}
      {isTickerEnabled && isTickerVisible && socialTickerItems.length > 0 && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 z-40 max-w-xs sm:max-w-sm animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-3 bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3 text-left relative group">
            <button
              type="button"
              onClick={() => setIsTickerVisible(false)}
              className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 text-white font-black flex items-center justify-center shrink-0 shadow-md">
              {socialTickerItems[currentTickerIndex]?.name?.charAt(0) || '✓'}
            </div>

            <div className="space-y-0.5 pr-2 overflow-hidden">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black text-white truncate">
                  {socialTickerItems[currentTickerIndex]?.name}
                </span>
                <span className="text-[10px] text-slate-400">• {socialTickerItems[currentTickerIndex]?.timeAgo}</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold leading-tight line-clamp-1">
                {socialTickerItems[currentTickerIndex]?.actionText || 'স্কলারশিপ ব্যাচে সিট বুক করেছেন'}
              </p>
              <span className="text-[10px] text-slate-400 block truncate">
                📍 {socialTickerItems[currentTickerIndex]?.location}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
