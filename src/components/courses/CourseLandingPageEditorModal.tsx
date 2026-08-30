import React, { useState, useRef } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  Course,
  CourseLandingPageConfig,
  CourseLandingFaq,
  CourseLandingReview,
  CourseLandingPainPoint,
  CourseLandingCurriculumModule,
  CourseLandingFeatureCard,
  CourseLandingTargetAudienceItem,
  CourseLandingGalleryImage,
  CoursePreferredScheduleOption
} from '../../types';
import { cleanWhatsAppNumber } from '../../utils/whatsappHelper';
import { generateSlug } from '../../utils/seoHelper';
import {
  X,
  Sparkles,
  Layout,
  Save,
  MessageCircle,
  Smartphone,
  Eye,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  Layers,
  HelpCircle,
  Award,
  Video,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Palette,
  BookOpen,
  Users,
  Building,
  Target,
  Flame,
  ShieldCheck,
  Laptop,
  Upload,
  Image as ImageIcon,
  Camera,
  RefreshCw,
  Check,
  Search,
  Globe,
  Share2,
  Link2,
  Tag
} from 'lucide-react';

interface CourseLandingPageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

const PRESET_BANNERS = [
  { label: 'Modern AC Lab & PCs', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Practical Class Workshop', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Office Automation & Tech', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Hands-on Student Practice', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Creative Design & Work', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80' },
  { label: 'AI Futuristic Office', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&auto=format&fit=crop&q=80' }
];

const DEFAULT_LAB_PRESETS: CourseLandingGalleryImage[] = [
  { id: 'p-1', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80', title: 'আধুনিক কম্পিউটার ল্যাব ও ডেডিকেটেড পিসি', category: 'কম্পিউটার ল্যাব' },
  { id: 'p-2', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80', title: 'প্র্যাকটিক্যাল অফিস ও এক্সেল ওয়ার্কশপ', category: 'হ্যান্ডস-অন ক্লাস' },
  { id: 'p-3', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80', title: 'টিম কোলাবোরেশন ও প্রজেক্ট প্রেজেন্টেশন', category: 'গ্রুপ স্টাডি' },
  { id: 'p-4', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80', title: 'সিনিয়র মেন্টরদের ওয়ান-টু-ওয়ান গাইডেন্স', category: 'মেন্টরিং সেশন' },
  { id: 'p-5', url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80', title: 'গ্র্যাজুয়েশন ও সার্টিফিকেট প্রদান অনুষ্ঠান', category: 'কনভোকেশন' },
  { id: 'p-6', url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80', title: 'শীতাতপ নিয়ন্ত্রিত স্মার্ট ক্লাসরুম', category: 'ক্যাম্পাস পরিবেশ' },
  { id: 'p-7', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80', title: 'হাতে-কলমে প্রজেক্ট ডিজাইন ও কাজ', category: 'প্রজেক্ট ওয়ার্ক' },
  { id: 'p-8', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80', title: 'কর্পোরেট আইটি প্র্যাকটিস ডেক', category: 'আইটি ল্যাব' }
];

export const CourseLandingPageEditorModal: React.FC<CourseLandingPageEditorModalProps> = ({
  isOpen,
  onClose,
  course
}) => {
  const { updateCourse, websiteCmsConfig } = useAcademy();
  const existingConfig = course.landingConfig || {};
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<
    'hero_cta' | 'pain_points' | 'curriculum' | 'schedules' | 'features_audience' | 'pricing_seats' | 'bonuses_campus' | 'gallery_photos' | 'faqs_reviews' | 'seo'
  >('hero_cta');

  // Tab 1: Hero & Messaging
  const [headline, setHeadline] = useState(existingConfig.headline || course.name);
  const [subheadline, setSubheadline] = useState(existingConfig.subheadline || course.description || '');
  const [heroBadge, setHeroBadge] = useState(existingConfig.heroBadge || '🔥 ২০২৬ জব-রেডি আপডেটেড মডিউল • ১০০% প্র্যাকটিক্যাল ল্যাব');
  const [customBannerUrl, setCustomBannerUrl] = useState(existingConfig.customBannerUrl || course.thumbnailUrl || '');
  const [videoPromoUrl, setVideoPromoUrl] = useState(existingConfig.videoPromoUrl || '');

  // CTAs (WhatsApp, Messenger, Admission)
  const [ctaMode, setCtaMode] = useState<CourseLandingPageConfig['ctaMode']>(existingConfig.ctaMode || 'both');
  const [customWhatsAppNumber, setCustomWhatsAppNumber] = useState(
    existingConfig.customWhatsAppNumber || websiteCmsConfig?.marketing?.floatingWhatsAppNumber || '01798444444'
  );
  const [customWhatsAppMessage, setCustomWhatsAppMessage] = useState(
    existingConfig.customWhatsAppMessage || `Hello Nexgen Academy! আমি "${course.name}" কোর্সে ভর্তি হতে চাই ও অফার জানতে চাই।`
  );
  const [customMessengerUrl, setCustomMessengerUrl] = useState(
    existingConfig.customMessengerUrl || websiteCmsConfig?.socialLinks?.facebookPageUrl || websiteCmsConfig?.facebookPageUrl || 'https://m.me/nexgenacademy'
  );

  // Gallery Photos
  const [galleryImages, setGalleryImages] = useState<CourseLandingGalleryImage[]>(
    existingConfig.galleryImages && existingConfig.galleryImages.length > 0
      ? existingConfig.galleryImages
      : DEFAULT_LAB_PRESETS
  );
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState('কম্পিউটার ল্যাব');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Tab: Preferred Schedules & Batch Timings
  const [preferredSchedulesTitle, setPreferredSchedulesTitle] = useState(
    existingConfig.preferredSchedulesTitle || 'পছন্দের ব্যাচ ও ক্লাসের শিডিউল নির্বাচন করুন'
  );
  const [preferredSchedules, setPreferredSchedules] = useState<CoursePreferredScheduleOption[]>(
    existingConfig.preferredSchedules && existingConfig.preferredSchedules.length > 0
      ? existingConfig.preferredSchedules
      : [
          { id: 'sch-1', label: 'শুক্রবার ও শনিবার (সকাল ১০:০০ - ১২:০০)', days: 'শুক্র ও শনিবার', timeSlot: 'সকাল ১০:০০ - ১২:০০', mode: 'Offline', availableSeats: 5, isActive: true },
          { id: 'sch-2', label: 'শুক্রবার ও শনিবার (বিকাল ৩:০০ - ৫:০০)', days: 'শুক্র ও শনিবার', timeSlot: 'বিকাল ৩:০০ - ৫:০০', mode: 'Offline', availableSeats: 7, isActive: true },
          { id: 'sch-3', label: 'রবি, মঙ্গল ও বৃহস্পতিবার (সন্ধ্যা ৬:৩০ - ৮:৩০)', days: 'রবি, মঙ্গল ও বৃহস্পতি', timeSlot: 'সন্ধ্যা ৬:৩০ - ৮:৩০', mode: 'Both', availableSeats: 6, isActive: true },
          { id: 'sch-4', label: 'অনলাইন লাইভ নাইট ব্যাচ (রাত ৯:০০ - ১০:৩০)', days: 'শনি, সোম ও বুধ', timeSlot: 'রাত ৯:০০ - ১০:৩০', mode: 'Online Live', availableSeats: 12, isActive: true }
        ]
  );
  const [newSchLabel, setNewSchLabel] = useState('');
  const [newSchDays, setNewSchDays] = useState('');
  const [newSchTimeSlot, setNewSchTimeSlot] = useState('');
  const [newSchMode, setNewSchMode] = useState<'Offline' | 'Online Live' | 'Hybrid' | 'Both'>('Offline');
  const [newSchSeats, setNewSchSeats] = useState(8);

  // Tab 2: Pain Points vs Reality (Problem - Solution)
  const [painPointsHeadline, setPainPointsHeadline] = useState(
    existingConfig.painPointsHeadline || 'একসময় Computer Office Application মানে ছিল শুধু Word, Excel, PowerPoint—কিন্তু ২০২৬-এর অফিস বদলে গেছে!'
  );
  const [painPointsSubheadline, setPainPointsSubheadline] = useState(
    existingConfig.painPointsSubheadline || 'আজকের চাকরির বাজারে সাধারণ টাইপিং যথেষ্ট নয়, প্র্যাকটিক্যাল অটোমেশন ও AI স্কিল ছাড়া প্রতিযোগিতা অনেক কঠিন।'
  );
  const [painPointsList, setPainPointsList] = useState<CourseLandingPainPoint[]>(
    existingConfig.painPointsList || [
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
      }
    ]
  );
  const [newProblem, setNewProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');

  // Tab 3: Curriculum Modules
  const [curriculumHeadline, setCurriculumHeadline] = useState(
    existingConfig.curriculumHeadline || 'আমাদের ২০২৬ আপডেটেড সম্পূর্ণ কোর্স কারিকুলাম'
  );
  const [curriculumSubheadline, setCurriculumSubheadline] = useState(
    existingConfig.curriculumSubheadline || 'বেসিক কম্পিউটার থেকে শুরু করে প্রফেশনাল ডেটা অ্যানালাইসিস ও AI অফিস অটোমেশন—সবকিছু একটি কমপ্লিট কোর্সে'
  );
  const [editableModules, setEditableModules] = useState<CourseLandingCurriculumModule[]>(
    existingConfig.editableModules || [
      {
        id: 'emod-1',
        moduleNumber: 1,
        moduleName: 'Computer Fundamentals & Fast Typing Mastery',
        subtitle: 'কম্পিউটার পরিচালনা ও দ্রুতগতির বাংলা-ইংরেজি টাইপিং',
        description: 'কম্পিউটার হার্ডওয়্যার পরিচিতি, উইন্ডোজ অপারেটিং সিস্টেম, ফাইল-ফোল্ডার ম্যানেজমেন্ট ও শর্টকাট কি।',
        topics: [
          'উইন্ডোজ ফাইল সিস্টেম ও সিকিউরিটি ব্যাকআপ',
          'ইংরেজি টাচ টাইপিং (লক্ষ্য: ৩০-৪০ WPM)',
          'বাংলা ইউনিকোড ও অভ্র / বিজয় টাইপিং কৌশল',
          'ইন্টারনেট ব্রাউজিং, সাইবার সিকিউরিটি ও ক্লাউড ড্রাইভ'
        ],
        tools: ['Windows 11', 'Bijoy Bayanno', 'Avro Keyboard', 'Google Drive'],
        estimatedClasses: '৬টি ক্লাস'
      },
      {
        id: 'emod-2',
        moduleNumber: 2,
        moduleName: 'Advanced MS Word & Smart Official Document Drafting',
        subtitle: 'প্রফেশনাল ডকুমেন্ট, অফিশিয়াল চিঠি ও নোটিশ ডিজাইন',
        description: 'করপোরেট চিঠি, লিগ্যাল ডকুমেন্টস, ইনভয়েস, ক্যাটালগ ও AI দিয়ে দ্রুত ড্রাফটিং তৈরির টেকনিক।',
        topics: [
          'করপোরেট লেটারহেড, অ্যাপ্লিকেশন ও মেমো ফরম্যাটিং',
          'টেবিল ডিজাইন, হেডার/ফুটার ও ওয়াটারমার্ক',
          'মেইল মার্জ (Mail Merge) দিয়ে এক ক্লিকে শত শত চিঠি প্রেরণ',
          'ChatGPT দিয়ে অফিশিয়াল ড্রাফট, নোটিশ ও প্রপোজাল রাইটিং'
        ],
        tools: ['MS Word', 'ChatGPT Prompts', 'Grammar AI Tools'],
        estimatedClasses: '১০টি ক্লাস'
      },
      {
        id: 'emod-3',
        moduleNumber: 3,
        moduleName: 'Microsoft Excel, Financial Formulas & Interactive Dashboards',
        subtitle: 'ডেটা অ্যানালাইসিস, হিসাব-নিকাশ ও ড্যাশবোর্ড মাস্টারি',
        description: 'অফিসের যাবতীয় হিসাব, স্যালারি শিট, ইনভেন্টরি ও এক্সেলের অত্যাধুনিক ফর্মুলার হাতে-কলমে প্র্যাকটিস।',
        topics: [
          'বেসিক টু অ্যাডভান্সড ফর্মুলা (SUMIFS, COUNTIFS, IF, AND, OR)',
          'লুকআপ ফাংশন (VLOOKUP, HLOOKUP, XLOOKUP, INDEX-MATCH)',
          'Pivot Table, Pivot Chart ও স্লাইসার দিয়ে ডাইনামিক ডেটা ফিল্টারিং',
          'অটোমেটেড স্যালারি শিট, ইনভয়েস জেনারেটর ও ক্যাশবুক তৈরি'
        ],
        tools: ['MS Excel', 'Formula AI', 'Pivot Dashboards'],
        estimatedClasses: '১২টি ক্লাস'
      },
      {
        id: 'emod-4',
        moduleNumber: 4,
        moduleName: 'MS PowerPoint & AI-Powered Dynamic Presentations',
        subtitle: 'দৃষ্টিনন্দন প্রেজেন্টেশন ও স্লাইড ডেক ডিজাইন',
        description: 'করপোরেট মিটিং, পিচ ডেক ও বিজনেস প্রেজেন্টেশন আকর্ষণীয়ভাবে তৈরির পূর্ণাঙ্গ গাইডলাইন।',
        topics: [
          'স্লাইড লেআউট, কালার থিওরি ও ইনফোগ্রাফিক ডিজাইন',
          'মর্ফ (Morph) ট্রানজিশন ও আধুনিক অ্যানিমেশন ইফেক্টস',
          'AI দিয়ে কনটেন্ট ও প্রেজেন্টেশন জেনারেশন (Gamma, Copilot)'
        ],
        tools: ['PowerPoint', 'Gamma App', 'Canva Pro Tools'],
        estimatedClasses: '৬টি ক্লাস'
      },
      {
        id: 'emod-5',
        moduleNumber: 5,
        moduleName: 'Google Workspace, Cloud Collaboration & Career Workshop',
        subtitle: 'ক্লাউড অফিস ও ক্যারিয়ার প্লেসমেন্ট প্রিপারেশন',
        description: 'যেকোনো স্থান থেকে অনলাইনে টিমওয়ার্ক ও সফলভাবে চাকরি নিশ্চিতকরণের প্রস্তুতি।',
        topics: [
          'Google Docs, Google Sheets ও Google Forms রিয়েল-টাইম কোলাবোরেশন',
          'AI-অপ্টিমাইজড প্রফেশনাল এটিএস (ATS) ফ্রেন্ডলি সিভি তৈরি',
          'মক ইন্টারভিউ ও ফাইনাল প্র্যাকটিক্যাল অ্যাসেসমেন্ট'
        ],
        tools: ['Google Suite', 'LinkedIn', 'Resume AI'],
        estimatedClasses: '২টি ক্লাস'
      }
    ]
  );

  // Tab 4: Features & Target Audience
  const [whyChooseHeadline, setWhyChooseHeadline] = useState(
    existingConfig.whyChooseHeadline || 'আমাদের কোর্সের বিশেষত্ব যা আপনাকে অন্যদের চেয়ে এগিয়ে রাখবে'
  );
  const [featureCards, setFeatureCards] = useState<CourseLandingFeatureCard[]>(
    existingConfig.featureCards || [
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
    ]
  );
  const [audienceHeadline, setAudienceHeadline] = useState(
    existingConfig.audienceHeadline || 'এই কোর্সটি কাদের জন্য বিশেষভাবে তৈরি?'
  );
  const [audienceList, setAudienceList] = useState<CourseLandingTargetAudienceItem[]>(
    existingConfig.audienceList || [
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
    ]
  );

  // Tab 5: Pricing, Seats & Countdowns
  const [offerFee, setOfferFee] = useState<number>(course.offerFee || 6500);
  const [regularFee, setRegularFee] = useState<number>(course.regularFee || 15000);
  const [customDiscountBadge, setCustomDiscountBadge] = useState(existingConfig.customDiscountBadge || '৫০% স্পেশাল মেগা স্কলারশিপ');
  const [showBatchCountdown, setShowBatchCountdown] = useState<boolean>(existingConfig.showBatchCountdown ?? true);
  const [nextBatchStartDate, setNextBatchStartDate] = useState(existingConfig.nextBatchStartDate || '১৫ মে, ২০২৬');
  const [availableSeats, setAvailableSeats] = useState<number>(existingConfig.availableSeats || 8);
  const [guaranteeText, setGuaranteeText] = useState(
    existingConfig.guaranteeText || '১০০% প্র্যাকটিক্যাল ল্যাব ট্রেনিং, ওয়ান-টু-ওয়ান গাইডেন্স ও সরকারি ভেরিফায়েবল সার্টিফিকেট নিশ্চয়তা'
  );

  // Tab 6: Bonuses & Campus Info
  const [bonusHeadline, setBonusHeadline] = useState(
    existingConfig.bonusHeadline || '🎁 এই ব্যাচে ভর্তি হলে সম্পূর্ণ ফ্রি পাচ্ছেন:'
  );
  const [bonusItems, setBonusItems] = useState<string[]>(
    existingConfig.bonusItems || [
      'ChatGPT & AI Office Productivity প্রম্পট গাইড বুক (PDF ফ্রি)',
      '৫০+ রেডিমেড করপোরেট এক্সেল ও ওয়ার্ড টেমপ্লেট লাইব্রেরি',
      'ফুল স্পিড টাইピング সফটওয়্যার ফুল লাইসেন্স',
      'প্রফেশনাল সিভি মেকিং ফরম্যাট ও ইন্টারভিউ প্রশ্ন ব্যাংক',
      'লাইফটাইম ক্লাস রিসোর্স ও ভিডিও ব্যাকআপ সাপোর্ট'
    ]
  );
  const [newBonusInput, setNewBonusInput] = useState('');
  const [campusAddress, setCampusAddress] = useState(
    existingConfig.campusAddress || '১৪/বি, গার্ডেন রোড, কাজী নজরুল ইসলাম সরণি, ফার্মগেট, ঢাকা-১২১৫'
  );
  const [campusPhone, setCampusPhone] = useState(existingConfig.campusPhone || '০১৭৯৮-৪৪৪৪৪৪');
  const [campusHours, setCampusHours] = useState(existingConfig.campusHours || 'সকাল ৯:০০ টা থেকে রাত ৮:০০ টা (প্রতিদিন খোলা)');

  // Tab 7: FAQs & Reviews
  const [faqsHeadline, setFaqsHeadline] = useState(
    existingConfig.faqsHeadline || 'সচরাচর জিজ্ঞাসিত কিছু গুরুত্বপূর্ণ প্রশ্ন ও উত্তর (FAQs)'
  );
  const [faqs, setFaqs] = useState<CourseLandingFaq[]>(
    existingConfig.faqs || [
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
    ]
  );
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  const [customReviews, setCustomReviews] = useState<CourseLandingReview[]>(
    existingConfig.customReviews || [
      {
        name: 'তানভীর আহমেদ',
        roleOrBatch: 'অফিস এক্সিকিউティブ • ব্যাচ-১২',
        rating: 5,
        text: 'একদম প্র্যাকটিক্যাল ল্যাব ট্রেনিং। বিশেষ করে এক্সেল ও ChatGPT দিয়ে অফিস অটোমেশন শেখার পর আমার অফিসের কাজের স্পিড দ্বিগুণ হয়ে গেছে!'
      },
      {
        name: 'সাদিয়া আক্তার',
        roleOrBatch: 'বিবিএ শিক্ষার্থী • ব্যাচ-১৫',
        rating: 5,
        text: 'আমার টাইপিং স্পিড ১৫ WPM থেকে এখন ৪৮ WPM এ পৌঁছেছে। মেন্টরদের আন্তরিকতা ও ধৈর্য সত্যিই প্রশংসনীয়।'
      },
      {
        name: 'মোঃ জাহিদ হাসান',
        roleOrBatch: 'অ্যাকাউন্টিং অফিসার • ব্যাচ-০৮',
        rating: 5,
        text: 'VLOOKUP, XLOOKUP এবং Pivot Table দিয়ে এখন যেকোনো ব্যালান্স শিট ও স্যালারি শিট এক নিমিষে বানিয়ে ফেলতে পারি।'
      }
    ]
  );
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('');
  const [newReviewText, setNewReviewText] = useState('');

  // Tab 10: SEO & AI Search Visibility
  const [slug, setSlug] = useState(
    course.seo?.slug || existingConfig.slug || course.slug || generateSlug(course.name)
  );
  const [seoTitle, setSeoTitle] = useState(
    course.seo?.seoTitle || existingConfig.seoTitle || `${course.name} Course in Farmgate, Dhaka | Practical IT Training`
  );
  const [seoMetaDescription, setSeoMetaDescription] = useState(
    course.seo?.metaDescription ||
    existingConfig.seoMetaDescription ||
    course.description ||
    `${course.name} at Nexgen Computer Academy, Farmgate. ${course.duration} practical hands-on lab training with 1-on-1 mentorship, verifiable certificate & career guidance in Dhaka.`
  );
  const [focusKeyword, setFocusKeyword] = useState(
    course.seo?.focusKeyword || existingConfig.focusKeyword || `${course.name} in Farmgate`
  );
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>(
    course.seo?.secondaryKeywords ||
    existingConfig.secondaryKeywords || [
      `${course.name} course Dhaka`,
      `${course.name} training Farmgate`,
      `best ${course.category} institute Dhaka`,
      'Computer training Farmgate'
    ]
  );
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState(
    course.seo?.canonicalUrl || existingConfig.canonicalUrl || ''
  );
  const [ogTitle, setOgTitle] = useState(
    course.seo?.ogTitle || existingConfig.seoOgTitle || ''
  );
  const [ogDescription, setOgDescription] = useState(
    course.seo?.ogDescription || existingConfig.seoOgDescription || ''
  );
  const [ogImage, setOgImage] = useState(
    course.seo?.ogImage || existingConfig.seoOgImage || course.thumbnailUrl || ''
  );
  const [noIndex, setNoIndex] = useState<boolean>(
    course.seo?.noIndex ?? existingConfig.noIndex ?? false
  );
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const handleAddKeyword = () => {
    if (!newKeywordInput.trim()) return;
    if (!secondaryKeywords.includes(newKeywordInput.trim())) {
      setSecondaryKeywords([...secondaryKeywords, newKeywordInput.trim()]);
    }
    setNewKeywordInput('');
  };

  const handleRemoveKeyword = (index: number) => {
    setSecondaryKeywords(secondaryKeywords.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  // Pain point handlers
  const handleAddPainPoint = () => {
    if (!newProblem.trim() || !newSolution.trim()) return;
    setPainPointsList([...painPointsList, { problem: newProblem.trim(), solution: newSolution.trim() }]);
    setNewProblem('');
    setNewSolution('');
  };

  const handleRemovePainPoint = (index: number) => {
    setPainPointsList(painPointsList.filter((_, i) => i !== index));
  };

  // Module handlers
  const handleUpdateModule = (modIndex: number, field: keyof CourseLandingCurriculumModule, value: any) => {
    const updated = [...editableModules];
    updated[modIndex] = { ...updated[modIndex], [field]: value };
    setEditableModules(updated);
  };

  const handleAddModule = () => {
    const newMod: CourseLandingCurriculumModule = {
      id: `emod-${Date.now()}`,
      moduleNumber: editableModules.length + 1,
      moduleName: 'New Training Module',
      subtitle: 'মডিউলের সারসংক্ষেপ ও উদ্দেশ্য',
      description: 'এই মডিউলে যা শেখানো হবে...',
      topics: ['টপিক ১', 'টপিক ২', 'টপিক ৩'],
      tools: ['Software Name'],
      estimatedClasses: '৪টি ক্লাস'
    };
    setEditableModules([...editableModules, newMod]);
  };

  const handleRemoveModule = (modIndex: number) => {
    setEditableModules(editableModules.filter((_, i) => i !== modIndex));
  };

  // Feature Card handlers
  const handleUpdateFeature = (fIndex: number, field: keyof CourseLandingFeatureCard, value: any) => {
    const updated = [...featureCards];
    updated[fIndex] = { ...updated[fIndex], [field]: value };
    setFeatureCards(updated);
  };

  // Audience Handlers
  const handleUpdateAudience = (aIndex: number, field: keyof CourseLandingTargetAudienceItem, value: any) => {
    const updated = [...audienceList];
    updated[aIndex] = { ...updated[aIndex], [field]: value };
    setAudienceList(updated);
  };

  // Bonus handlers
  const handleAddBonus = () => {
    if (!newBonusInput.trim()) return;
    setBonusItems([...bonusItems, newBonusInput.trim()]);
    setNewBonusInput('');
  };

  const handleRemoveBonus = (idx: number) => {
    setBonusItems(bonusItems.filter((_, i) => i !== idx));
  };

  // FAQ handlers
  const handleAddFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setFaqs([...faqs, { question: newFaqQ.trim(), answer: newFaqA.trim() }]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  // Helper for single file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Helper for multiple gallery files upload
  const handleMultipleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const newImg: CourseLandingGalleryImage = {
            id: `gimg-${Date.now()}-${idx}`,
            url: reader.result,
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'প্র্যাকটিক্যাল ল্যাব সেশন',
            category: 'কম্পিউটার ল্যাব'
          };
          setGalleryImages(prev => [newImg, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Gallery handlers
  const handleAddGalleryPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    setGalleryImages([
      ...galleryImages,
      {
        id: `gimg-${Date.now()}`,
        url: newPhotoUrl.trim(),
        title: newPhotoTitle.trim() || 'প্র্যাকটিক্যাল ল্যাব ক্লাস',
        category: newPhotoCategory.trim() || 'কম্পিউটার ল্যাব'
      }
    ]);
    setNewPhotoUrl('');
    setNewPhotoTitle('');
  };

  const handleUpdateGalleryPhoto = (idx: number, field: keyof CourseLandingGalleryImage, val: string) => {
    const updated = [...galleryImages];
    updated[idx] = { ...updated[idx], [field]: val };
    setGalleryImages(updated);
  };

  const handleRemoveGalleryPhoto = (idx: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  // Review handlers
  const handleAddReview = () => {
    if (!newReviewName.trim() || !newReviewText.trim()) return;
    setCustomReviews([
      ...customReviews,
      {
        name: newReviewName.trim(),
        roleOrBatch: newReviewRole.trim() || 'কোর্স শিক্ষার্থী',
        rating: 5,
        text: newReviewText.trim()
      }
    ]);
    setNewReviewName('');
    setNewReviewRole('');
    setNewReviewText('');
  };

  const handleRemoveReview = (idx: number) => {
    setCustomReviews(customReviews.filter((_, i) => i !== idx));
  };

  const handleAddSchedule = () => {
    if (!newSchLabel.trim()) return;
    const newSch: CoursePreferredScheduleOption = {
      id: `sch-${Date.now()}`,
      label: newSchLabel.trim(),
      days: newSchDays.trim() || 'Flexible Days',
      timeSlot: newSchTimeSlot.trim(),
      mode: newSchMode,
      availableSeats: Number(newSchSeats) || 8,
      isActive: true
    };
    setPreferredSchedules([...preferredSchedules, newSch]);
    setNewSchLabel('');
    setNewSchDays('');
    setNewSchTimeSlot('');
  };

  const handleUpdateSchedule = (idx: number, field: keyof CoursePreferredScheduleOption, val: any) => {
    const updated = [...preferredSchedules];
    updated[idx] = { ...updated[idx], [field]: val };
    setPreferredSchedules(updated);
  };

  const handleRemoveSchedule = (idx: number) => {
    setPreferredSchedules(preferredSchedules.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const updatedLandingConfig: CourseLandingPageConfig = {
      ...existingConfig,
      headline: headline.trim(),
      subheadline: subheadline.trim(),
      heroBadge: heroBadge.trim(),
      customBannerUrl: customBannerUrl.trim(),
      videoPromoUrl: videoPromoUrl.trim() || undefined,
      ctaMode,
      customWhatsAppNumber: customWhatsAppNumber.trim(),
      customWhatsAppMessage: customWhatsAppMessage.trim(),
      customMessengerUrl: customMessengerUrl.trim(),
      painPointsHeadline: painPointsHeadline.trim(),
      painPointsSubheadline: painPointsSubheadline.trim(),
      painPointsList,
      curriculumHeadline: curriculumHeadline.trim(),
      curriculumSubheadline: curriculumSubheadline.trim(),
      editableModules,
      preferredSchedulesTitle: preferredSchedulesTitle.trim(),
      preferredSchedules,
      whyChooseHeadline: whyChooseHeadline.trim(),
      featureCards,
      audienceHeadline: audienceHeadline.trim(),
      audienceList,
      showBatchCountdown,
      nextBatchStartDate: nextBatchStartDate.trim(),
      availableSeats: Number(availableSeats) || 8,
      customDiscountBadge: customDiscountBadge.trim(),
      guaranteeText: guaranteeText.trim(),
      bonusHeadline: bonusHeadline.trim(),
      bonusItems,
      campusAddress: campusAddress.trim(),
      campusPhone: campusPhone.trim(),
      campusHours: campusHours.trim(),
      galleryImages,
      faqsHeadline: faqsHeadline.trim(),
      faqs,
      customReviews,
      slug: slug.trim() || undefined,
      seoTitle: seoTitle.trim() || undefined,
      seoMetaDescription: seoMetaDescription.trim() || undefined,
      seoOgTitle: ogTitle.trim() || undefined,
      seoOgDescription: ogDescription.trim() || undefined,
      seoOgImage: ogImage.trim() || undefined,
      canonicalUrl: canonicalUrl.trim() || undefined,
      focusKeyword: focusKeyword.trim() || undefined,
      secondaryKeywords: secondaryKeywords.length > 0 ? secondaryKeywords : undefined,
      noIndex
    };

    const updatedSeo = {
      slug: slug.trim() || undefined,
      seoTitle: seoTitle.trim() || undefined,
      metaDescription: seoMetaDescription.trim() || undefined,
      ogTitle: ogTitle.trim() || undefined,
      ogDescription: ogDescription.trim() || undefined,
      ogImage: ogImage.trim() || undefined,
      canonicalUrl: canonicalUrl.trim() || undefined,
      focusKeyword: focusKeyword.trim() || undefined,
      secondaryKeywords: secondaryKeywords.length > 0 ? secondaryKeywords : undefined,
      noIndex
    };

    updateCourse(course.id, {
      offerFee: Number(offerFee) || 0,
      regularFee: Number(regularFee) || 0,
      thumbnailUrl: customBannerUrl.trim() || course.thumbnailUrl,
      landingConfig: updatedLandingConfig,
      seo: updatedSeo,
      slug: slug.trim() || course.slug
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-5xl w-full h-[92vh] shadow-2xl border border-indigo-100 text-slate-900 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-base tracking-tight">
                  ল্যান্ডিং পেজ কাস্টমাইজার (High-Converting Landing CMS)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30">
                  {course.code}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium truncate max-w-lg">
                {course.name} — প্রতিটি সেকশন, কারিকুলাম, সমস্যা-সমাধান, ছবি ও অফার পরিবর্তন করুন
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-course-landing', { detail: { course } }));
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>লাইভ প্রিভিউ</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 sm:px-6 border-b border-slate-200 bg-slate-50 gap-1.5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('hero_cta')}
            className={`py-3 px-3 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'hero_cta'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>১. হিরো & ব্যানার ছবি</span>
          </button>

          <button
            onClick={() => setActiveTab('pain_points')}
            className={`py-3 px-3 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'pain_points'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>২. সমস্যা vs সমাধান</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`py-3 px-3 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'curriculum'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>৩. ২০২৬ কারিকুলাম</span>
          </button>

          <button
            onClick={() => setActiveTab('schedules')}
            className={`py-3 px-3 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'schedules'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>৪. পছন্দের শিডিউল ({preferredSchedules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('features_audience')}
            className={`py-3 px-3 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'features_audience'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>৫. বিশেষত্ব & অডিয়েন্স</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing_seats')}
            className={`py-3 px-3 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'pricing_seats'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            <span>৬. ফি & কাউন্টডাউন</span>
          </button>

          <button
            onClick={() => setActiveTab('bonuses_campus')}
            className={`py-3 px-3 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'bonuses_campus'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-purple-600" />
            <span>৭. ফ্রি বোনাস & ক্যাম্পাস</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery_photos')}
            className={`py-3 px-3 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'gallery_photos'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-emerald-600" />
            <span>৮. ল্যাব ও ক্যাম্পাস ছবি ({galleryImages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs_reviews')}
            className={`py-3 px-3 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'faqs_reviews'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>৯. প্রশ্ন & রিভিউ</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`py-3 px-3 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'seo'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>১০. সার্চ ইঞ্জিন (SEO & SERP)</span>
          </button>
        </div>

        {/* Tab Contents - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: HERO, IMAGES & CTA CONTROLS */}
          {activeTab === 'hero_cta' && (
            <div className="space-y-5">
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-start space-x-3 text-xs text-indigo-950">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">ল্যান্ডিং পেজের প্রধান আকর্ষণ ও হিরো সেকশন</p>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    বিজ্ঞাপনে ক্লিক করে শিক্ষার্থী এই অংশটি সবার আগে দেখবে। হেডলাইন, কভার ব্যানার ছবি (ম্যানুয়াল ফাইল আপলোড বা URL) ও সরাসরি মেসেজিং নম্বর সেট করুন।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    টপ অ্যানাউন্সমেন্ট ব্যাজ (Badge Text)
                  </label>
                  <input
                    type="text"
                    value={heroBadge}
                    onChange={e => setHeroBadge(e.target.value)}
                    placeholder="e.g. 🔥 ২০২৬ জব-রেডি আপডেটেড মডিউল • ১০০% প্র্যাকটিক্যাল ল্যাব"
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    প্রধান শিরোনাম (Landing Page Headline)
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    placeholder="e.g. Computer Office Application with AI (2026 Updated Module)"
                    className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সাব-হেডিং / আকর্ষণীয় বিবরণ
                </label>
                <textarea
                  rows={3}
                  value={subheadline}
                  onChange={e => setSubheadline(e.target.value)}
                  placeholder="শুধু MS Word, Excel, PowerPoint জানলেই কি এখন Job-Ready হওয়া যায়?..."
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden leading-relaxed"
                />
              </div>

              {/* Custom Banner URL, File Upload & Presets */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-900">
                    🖼️ ল্যান্ডিং পেজ কভার ব্যানার ছবি (Hero Banner Image)
                  </label>
                  {customBannerUrl && (
                    <button
                      type="button"
                      onClick={() => setCustomBannerUrl('')}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>ছবি রিমুভ</span>
                    </button>
                  )}
                </div>

                {/* Banner Preview & Upload Area */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-1">
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 bg-white group flex flex-col items-center justify-center p-2 text-center">
                      {customBannerUrl ? (
                        <>
                          <img
                            src={customBannerUrl}
                            alt="Cover Banner Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => bannerFileInputRef.current?.click()}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold flex items-center space-x-1 shadow-md"
                            >
                              <Upload className="w-3 h-3" />
                              <span>পরিবর্তন</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div
                          onClick={() => bannerFileInputRef.current?.click()}
                          className="cursor-pointer flex flex-col items-center justify-center p-3 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <Camera className="w-8 h-8 mb-1 text-slate-300" />
                          <span className="text-[11px] font-bold text-slate-600">ছবি আপলোড করুন</span>
                          <span className="text-[9px] text-slate-400">PNG, JPG, WebP</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <input
                      type="file"
                      ref={bannerFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, setCustomBannerUrl)}
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => bannerFileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>ডিভাইস / কম্পিউটার থেকে আপলোড</span>
                      </button>
                      <span className="text-xs text-slate-400 font-medium">অথবা নিচে সরাসরি লিংক দিন</span>
                    </div>

                    <input
                      type="text"
                      value={customBannerUrl}
                      onChange={e => setCustomBannerUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... (Image URL)"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-500">প্রিসেট ল্যাব ব্যানার:</span>
                      {PRESET_BANNERS.map(b => (
                        <button
                          key={b.url}
                          type="button"
                          onClick={() => setCustomBannerUrl(b.url)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                            customBannerUrl === b.url
                              ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Messaging & Social Chat Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-900 mb-1">
                    🎯 কল-টু-অ্যাকশন (CTA Buttons) মোড নির্বাচন করুন
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCtaMode('both')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between space-y-1 transition-all ${
                        ctaMode === 'both'
                          ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>ভর্তি + WhatsApp + Messenger</span>
                      </span>
                      <span className="text-[10px] text-slate-500">সর্বোচ্চ কনভার্সন মোড</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCtaMode('whatsapp_only')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between space-y-1 transition-all ${
                        ctaMode === 'whatsapp_only'
                          ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs flex items-center space-x-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>শুধু Direct WhatsApp</span>
                      </span>
                      <span className="text-[10px] text-slate-500">সরাসরি ১-ক্লিকে WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCtaMode('messenger_only')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between space-y-1 transition-all ${
                        ctaMode === 'messenger_only'
                          ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 text-blue-950'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs flex items-center space-x-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                        <span>শুধু Messenger Chat</span>
                      </span>
                      <span className="text-[10px] text-slate-500">ফেসবুক পেজ মেসেঞ্জারে যাবে</span>
                    </button>
                  </div>
                </div>

                {/* WhatsApp & Messenger Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp নম্বর (যেমন: 01798444444)
                    </label>
                    <input
                      type="text"
                      value={customWhatsAppNumber}
                      onChange={e => setCustomWhatsAppNumber(e.target.value)}
                      placeholder="01798444444"
                      className="w-full text-xs font-mono font-bold px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                      ✓ আন্তর্জাতিক ফরম্যাটে ({cleanWhatsAppNumber(customWhatsAppNumber)}) সরাসরি চ্যাট ওপেন হবে।
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp মেসেজ টেক্সট
                    </label>
                    <input
                      type="text"
                      value={customWhatsAppMessage}
                      onChange={e => setCustomWhatsAppMessage(e.target.value)}
                      placeholder="Hello! I want admission details..."
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Facebook Page / Messenger লিংক (m.me বা পেজ URL)
                    </label>
                    <input
                      type="text"
                      value={customMessengerUrl}
                      onChange={e => setCustomMessengerUrl(e.target.value)}
                      placeholder="https://m.me/nexgenacademy"
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAIN POINTS VS REALITY (Problem - Solution) */}
          {activeTab === 'pain_points' && (
            <div className="space-y-5">
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1 text-xs text-amber-950">
                <p className="font-bold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-600" />
                  <span>সমস্যা ও সমাধান সেকশন (Pain Point Hook)</span>
                </p>
                <p className="text-amber-800">
                  শিক্ষার্থীরা অফিসে যেসব চ্যালেঞ্জের মুখোমুখি হয় এবং কীভাবে আমাদের ২০২৬ AI কোর্স তা দূর করবে তা সাজিয়ে লিখুন।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সেকশন শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={painPointsHeadline}
                    onChange={e => setPainPointsHeadline(e.target.value)}
                    className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সাব-হেডিং
                  </label>
                  <input
                    type="text"
                    value={painPointsSubheadline}
                    onChange={e => setPainPointsSubheadline(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* List of Problem-Solutions */}
              <div className="space-y-3 pt-2">
                <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">
                  সমস্যা ও সমাধান পয়েন্টসমূহ ({painPointsList.length} টি)
                </h4>

                {painPointsList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700">পয়েন্ট #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePainPoint(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-rose-700 mb-1">
                          ❌ সমস্যা (পুরোনো ধাঁচ):
                        </label>
                        <textarea
                          rows={2}
                          value={item.problem}
                          onChange={e => {
                            const updated = [...painPointsList];
                            updated[idx].problem = e.target.value;
                            setPainPointsList(updated);
                          }}
                          className="w-full text-xs p-2.5 bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-emerald-700 mb-1">
                          ✅ বাস্তব সমাধান (২০২৬ AI স্কিল):
                        </label>
                        <textarea
                          rows={2}
                          value={item.solution}
                          onChange={e => {
                            const updated = [...painPointsList];
                            updated[idx].solution = e.target.value;
                            setPainPointsList(updated);
                          }}
                          className="w-full text-xs p-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add New Problem-Solution */}
                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-3">
                  <h5 className="font-bold text-xs text-indigo-900">+ নতুন সমস্যা-সমাধান পয়েন্ট যোগ করুন</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newProblem}
                      onChange={e => setNewProblem(e.target.value)}
                      placeholder="সমস্যা (যেমন: এক্সেলে ফর্মুলা ভুলে যাওয়া...)"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                    />
                    <input
                      type="text"
                      value={newSolution}
                      onChange={e => setNewSolution(e.target.value)}
                      placeholder="সমাধান (যেমন: XLOOKUP ও AI ফর্মুলা দিয়ে মুহূর্তে হিসাব...)"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPainPoint}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>তালিকায় যোগ করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CURRICULUM MODULES */}
          {activeTab === 'curriculum' && (
            <div className="space-y-5">
              <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl flex items-start space-x-3 text-xs text-indigo-950">
                <BookOpen className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">২০২৬ আপডেটেড কোর্স কারিকুলাম ও মডিউল এডিটর</p>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    এখানে আপনি প্রতিটা মডিউলের নাম, টপিক, ক্লাস সংখ্যা ও টুলস স্বাধীনভাবে পরিবর্তন বা নতুন মডিউল যুক্ত করতে পারবেন।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    কারিকুলাম প্রধান শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={curriculumHeadline}
                    onChange={e => setCurriculumHeadline(e.target.value)}
                    className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সাব-হেডিং
                  </label>
                  <input
                    type="text"
                    value={curriculumSubheadline}
                    onChange={e => setCurriculumSubheadline(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Module Cards */}
              <div className="space-y-4 pt-2">
                {editableModules.map((mod, mIdx) => (
                  <div
                    key={mod.id || mIdx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                          {mIdx + 1}
                        </span>
                        <span className="font-black text-xs text-slate-800">মডিউল #{mIdx + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveModule(mIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove Module"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          মডিউলের নাম *
                        </label>
                        <input
                          type="text"
                          value={mod.moduleName}
                          onChange={e => handleUpdateModule(mIdx, 'moduleName', e.target.value)}
                          className="w-full text-xs font-bold p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          ক্লাস সংখ্যা
                        </label>
                        <input
                          type="text"
                          value={mod.estimatedClasses || ''}
                          onChange={e => handleUpdateModule(mIdx, 'estimatedClasses', e.target.value)}
                          placeholder="e.g. ১০টি ক্লাস"
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        সাবটাইটেল / সারসংক্ষেপ
                      </label>
                      <input
                        type="text"
                        value={mod.subtitle || ''}
                        onChange={e => handleUpdateModule(mIdx, 'subtitle', e.target.value)}
                        placeholder="যেমন: প্রফেশনাল ডকুমেন্ট ও অফিসিয়াল চিঠি ফরম্যাটিং"
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        টপিকসমূহ (প্রতি লাইনে ১টি করে লিখুন)
                      </label>
                      <textarea
                        rows={3}
                        value={mod.topics ? mod.topics.join('\n') : ''}
                        onChange={e =>
                          handleUpdateModule(
                            mIdx,
                            'topics',
                            e.target.value.split('\n').filter(t => t.trim().length > 0)
                          )
                        }
                        placeholder="টপিক ১&#10;টপিক ২&#10;টপিক ৩"
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl font-medium outline-hidden leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        ব্যবহৃত সফটওয়্যার ও AI টুলস (কমা দিয়ে লিখুন)
                      </label>
                      <input
                        type="text"
                        value={mod.tools ? mod.tools.join(', ') : ''}
                        onChange={e =>
                          handleUpdateModule(
                            mIdx,
                            'tools',
                            e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                          )
                        }
                        placeholder="e.g. MS Excel, ChatGPT Prompts, Pivot Table"
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddModule}
                  className="w-full py-3 border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-2xl text-xs font-bold text-indigo-600 hover:bg-indigo-50/50 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ নতুন কারিকুলাম মডিউল যোগ করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: PREFERRED SCHEDULES */}
          {activeTab === 'schedules' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  শিডিউল সেকশন শিরোনাম (Section Headline)
                </label>
                <input
                  type="text"
                  value={preferredSchedulesTitle}
                  onChange={e => setPreferredSchedulesTitle(e.target.value)}
                  placeholder="পছন্দের ব্যাচ ও ক্লাসের শিডিউল নির্বাচন করুন"
                  className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              {/* Existing Schedules */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-sm text-slate-900">কনফিগার করা ব্যাচ শিডিউল তালিকা ({preferredSchedules.length})</h4>
                    <p className="text-xs text-slate-500">শিক্ষার্থীরা ল্যান্ডিং পেজ ও কোর্স ডিটেইলস মডালে এই অপশনগুলো থেকে বেছে নিতে পারবে</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {preferredSchedules.map((sch, sIdx) => (
                    <div
                      key={sch.id || sIdx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-600">শিডিউল #{sIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSchedule(sIdx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            শিডিউলের মূল লেবেল *
                          </label>
                          <input
                            type="text"
                            value={sch.label}
                            onChange={e => handleUpdateSchedule(sIdx, 'label', e.target.value)}
                            placeholder="যেমন: শুক্রবার ও শনিবার (সকাল ১০:০০ - ১২:০০)"
                            className="w-full text-xs font-bold p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            ক্লাসের দিনসমূহ (Days)
                          </label>
                          <input
                            type="text"
                            value={sch.days || ''}
                            onChange={e => handleUpdateSchedule(sIdx, 'days', e.target.value)}
                            placeholder="যেমন: Fri & Sat / শুক্র ও শনিবার"
                            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            সময় স্লট (Time Slot)
                          </label>
                          <input
                            type="text"
                            value={sch.timeSlot || ''}
                            onChange={e => handleUpdateSchedule(sIdx, 'timeSlot', e.target.value)}
                            placeholder="যেমন: 10:00 AM - 12:00 PM"
                            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              লার্নিং মোড
                            </label>
                            <select
                              value={sch.mode || 'Offline'}
                              onChange={e => handleUpdateSchedule(sIdx, 'mode', e.target.value)}
                              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                            >
                              <option value="Offline">Offline Lab</option>
                              <option value="Online Live">Online Live</option>
                              <option value="Hybrid">Hybrid</option>
                              <option value="Both">Both (Lab + Live)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              অবশিষ্ট আসন (Seats)
                            </label>
                            <input
                              type="number"
                              value={sch.availableSeats ?? 8}
                              onChange={e => handleUpdateSchedule(sIdx, 'availableSeats', Number(e.target.value))}
                              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Schedule Form */}
                <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-3">
                  <h5 className="font-black text-xs text-indigo-900">+ নতুন শিডিউল যোগ করুন</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newSchLabel}
                        onChange={e => setNewSchLabel(e.target.value)}
                        placeholder="শিডিউল লেবেল (যেমন: রবি, মঙ্গল ও বৃহস্পতিবার বিকাল ৪:০০ - ৬:০০)"
                        className="w-full text-xs font-bold p-2.5 bg-white border border-indigo-200 rounded-xl outline-hidden"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newSchDays}
                        onChange={e => setNewSchDays(e.target.value)}
                        placeholder="দিনসমূহ (যেমন: রবি, মঙ্গল ও বৃহস্পতি)"
                        className="w-full text-xs p-2.5 bg-white border border-indigo-200 rounded-xl outline-hidden"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newSchTimeSlot}
                        onChange={e => setNewSchTimeSlot(e.target.value)}
                        placeholder="সময় (যেমন: 4:00 PM - 6:00 PM)"
                        className="w-full text-xs p-2.5 bg-white border border-indigo-200 rounded-xl outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSchedule}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>শিডিউল তালিকায় যুক্ত করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FEATURES & TARGET AUDIENCE */}
          {activeTab === 'features_audience' && (
            <div className="space-y-6">
              {/* Feature Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-sm text-slate-900">কোর্সের প্রধান বিশেষত্বসমূহ (Feature Cards)</h4>
                    <p className="text-xs text-slate-500">শিক্ষার্থীদের আকর্ষণের জন্য ৬টি প্রধান সুবিধা</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {featureCards.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2"
                    >
                      <span className="text-[11px] font-bold text-indigo-600">কার্ড #{fIdx + 1}</span>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={e => handleUpdateFeature(fIdx, 'title', e.target.value)}
                        placeholder="ফিচারের শিরোনাম"
                        className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl outline-hidden"
                      />
                      <textarea
                        rows={2}
                        value={feat.description}
                        onChange={e => handleUpdateFeature(fIdx, 'description', e.target.value)}
                        placeholder="সংক্ষিপ্ত বর্ণনা..."
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl outline-hidden leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div>
                  <h4 className="font-black text-sm text-slate-900">কাদের জন্য এই কোর্স (Target Audience)</h4>
                  <p className="text-xs text-slate-500">কোন কোন পেশা বা ব্যাকগ্রাউন্ডের জন্য এই কোর্স উপযোগী</p>
                </div>

                <div className="space-y-3">
                  {audienceList.map((aud, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          টার্গেট গ্রুপ / ব্যাকগ্রাউন্ড
                        </label>
                        <input
                          type="text"
                          value={aud.group}
                          onChange={e => handleUpdateAudience(aIdx, 'group', e.target.value)}
                          className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          কীভাবে উপকৃত হবেন
                        </label>
                        <input
                          type="text"
                          value={aud.benefit}
                          onChange={e => handleUpdateAudience(aIdx, 'benefit', e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl outline-hidden"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRICING, SEATS & COUNTDOWN */}
          {activeTab === 'pricing_seats' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ক্যাম্পেইন অফার ফি (৳)
                  </label>
                  <input
                    type="number"
                    value={offerFee}
                    onChange={e => setOfferFee(Number(e.target.value))}
                    className="w-full text-sm font-black px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">ল্যান্ডিং পেজে এই ফি বড় করে প্রদর্শিত হবে</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    রেগুলার ফি (৳) (কাটা দাগ সহ)
                  </label>
                  <input
                    type="number"
                    value={regularFee}
                    onChange={e => setRegularFee(Number(e.target.value))}
                    className="w-full text-sm font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  স্পেশাল অফার রিবন / ডিসকাউন্ট ব্যাজ
                </label>
                <input
                  type="text"
                  value={customDiscountBadge}
                  onChange={e => setCustomDiscountBadge(e.target.value)}
                  placeholder="e.g. ৫০% স্পেশাল মেগা স্কলারশিপ"
                  className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">ব্যাচ শুরু ও সিট কাউন্টডাউন টাইমার</p>
                    <p className="text-[11px] text-slate-500">জরুরি ভাব (Urgency) তৈরিতে সাহায্য করে</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showBatchCountdown}
                      onChange={e => setShowBatchCountdown(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {showBatchCountdown && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        পরবর্তী ব্যাচ শুরুর তারিখ
                      </label>
                      <input
                        type="text"
                        value={nextBatchStartDate}
                        onChange={e => setNextBatchStartDate(e.target.value)}
                        placeholder="e.g. ১৫ মে, ২০২৬"
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        অবশিষ্ট সিট সংখ্যা
                      </label>
                      <input
                        type="number"
                        value={availableSeats}
                        onChange={e => setAvailableSeats(Number(e.target.value))}
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  গ্যারান্টি ও কোয়ালিটি প্রতিশ্রুতি বার্তা
                </label>
                <input
                  type="text"
                  value={guaranteeText}
                  onChange={e => setGuaranteeText(e.target.value)}
                  placeholder="১০০% প্র্যাকটিক্যাল ল্যাব ট্রেনিং ও সরকারি ভেরিফায়েবল সার্টিফিকেট নিশ্চয়তা"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 6: BONUSES & CAMPUS INFO */}
          {activeTab === 'bonuses_campus' && (
            <div className="space-y-6">
              {/* Free Bonuses */}
              <div className="space-y-4">
                <h4 className="font-black text-sm text-slate-900">🎁 ফ্রি বোনাস আইটেম ও গিফট প্যাক</h4>
                <input
                  type="text"
                  value={bonusHeadline}
                  onChange={e => setBonusHeadline(e.target.value)}
                  placeholder="বোনাস সেকশন হেডিং"
                  className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                />

                <div className="space-y-2">
                  {bonusItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-slate-800">{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBonus(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBonusInput}
                    onChange={e => setNewBonusInput(e.target.value)}
                    placeholder="নতুন বোনাস আইটেম লিখুন..."
                    className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddBonus}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                  >
                    + যোগ করুন
                  </button>
                </div>
              </div>

              {/* Campus Info */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <h4 className="font-black text-sm text-slate-900">🏢 ক্যাম্পাস ঠিকানা ও হেল্পলাইন</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      ক্যাম্পাস লোকেশন ও পূর্ণ ঠিকানা
                    </label>
                    <input
                      type="text"
                      value={campusAddress}
                      onChange={e => setCampusAddress(e.target.value)}
                      className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      হটলাইন / হেল্পলাইন নম্বর
                    </label>
                    <input
                      type="text"
                      value={campusPhone}
                      onChange={e => setCampusPhone(e.target.value)}
                      className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      অফিস ও ল্যাব খোলা থাকার সময়
                    </label>
                    <input
                      type="text"
                      value={campusHours}
                      onChange={e => setCampusHours(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: LAB & CAMPUS GALLERY PHOTOS */}
          {activeTab === 'gallery_photos' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start justify-between text-xs text-emerald-950">
                <div className="flex items-start space-x-3">
                  <Laptop className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">ল্যাব ও ক্যাম্পাস এনভায়রনমেন্ট ফটো গ্যালারি</p>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      ল্যান্ডিং পেজের "প্র্যাকটিক্যাল ল্যাব সেশনের কিছু মুহূর্ত" সেকশনে এই ছবিগুলো প্রদর্শিত হবে। আপনি নিজের কম্পিউটার/মোবাইল থেকে সরাসরি রিয়েল ল্যাব ছবি আপলোড করতে পারেন বা যেকোনো ছবি পরিবর্তন করতে পারেন।
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setGalleryImages(DEFAULT_LAB_PRESETS)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold flex items-center space-x-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>ডিফল্ট প্রিসেট রিস্টোর</span>
                  </button>
                </div>
              </div>

              {/* Upload Controls */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-black text-sm text-slate-900">📷 নতুন ল্যাব ছবি যুক্ত করুন</h4>
                    <p className="text-xs text-slate-500">আপনার ডিভাইস থেকে ফাইল সিলেক্ট করুন অথবা ছবির লিংক পেস্ট করুন</p>
                  </div>

                  <div>
                    <input
                      type="file"
                      ref={galleryFileInputRef}
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleMultipleGalleryUpload}
                    />
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>ডিভাইস থেকে ছবি আপলোড (একাধিক সম্ভব)</span>
                    </button>
                  </div>
                </div>

                {/* Direct URL Add Option */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-200/80 items-center">
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      value={newPhotoUrl}
                      onChange={e => setNewPhotoUrl(e.target.value)}
                      placeholder="ছবির লিংক (URL): https://..."
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={newPhotoTitle}
                      onChange={e => setNewPhotoTitle(e.target.value)}
                      placeholder="ছবির ক্যাপশন / নাম"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <select
                      value={newPhotoCategory}
                      onChange={e => setNewPhotoCategory(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-xl outline-hidden font-medium"
                    >
                      <option value="কম্পিউটার ল্যাব">কম্পিউটার ল্যাব</option>
                      <option value="হ্যান্ডস-অন ক্লাস">হ্যান্ডস-অন ক্লাস</option>
                      <option value="গ্রুপ স্টাডি">গ্রুপ স্টাডি</option>
                      <option value="মেন্টরিং সেশন">মেন্টরিং সেশন</option>
                      <option value="কনভোকেশন">কনভোকেশন</option>
                      <option value="ক্যাম্পাস পরিবেশ">ক্যাম্পাস পরিবেশ</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddGalleryPhoto}
                      disabled={!newPhotoUrl.trim()}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      + যুক্ত করুন
                    </button>
                  </div>
                </div>

                {/* Preset Gallery Quick-Add Chips */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">
                    🌟 এক ক্লিকে প্রিসেট ল্যাব ছবি যোগ করুন:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DEFAULT_LAB_PRESETS.map((preset, pidx) => {
                      const isAlreadyAdded = galleryImages.some(img => img.url === preset.url);
                      return (
                        <div
                          key={pidx}
                          onClick={() => {
                            if (!isAlreadyAdded) {
                              setGalleryImages(prev => [
                                ...prev,
                                {
                                  id: `gimg-${Date.now()}-${pidx}`,
                                  url: preset.url,
                                  title: preset.title,
                                  category: preset.category
                                }
                              ]);
                            }
                          }}
                          className={`p-2 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                            isAlreadyAdded
                              ? 'bg-slate-100 border-slate-200 opacity-60'
                              : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-xs'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="overflow-hidden flex-1">
                            <p className="text-[10px] font-bold text-slate-800 truncate">{preset.title}</p>
                            <span className="text-[9px] text-emerald-600 font-semibold block">
                              {isAlreadyAdded ? '✓ যুক্ত আছে' : '+ যুক্ত করুন'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Current Active Gallery Images List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-slate-900 flex items-center space-x-2">
                    <span>বর্তমান গ্যালারি ছবিসমূহ</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      {galleryImages.length} টি ছবি
                    </span>
                  </h4>
                  {galleryImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setGalleryImages([])}
                      className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                    >
                      সব ছবি মুছুন
                    </button>
                  )}
                </div>

                {galleryImages.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
                    <Laptop className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">কোনো ল্যাব ছবি এখনো যুক্ত করা হয়নি</p>
                    <p className="text-[11px] text-slate-400">
                      উপরের বাটন থেকে ফাইল আপলোড করুন অথবা প্রিসেট ছবি থেকে যোগ করুন।
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start space-x-3.5 hover:shadow-md transition-shadow group"
                      >
                        {/* Thumbnail with overlay change button */}
                        <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                          <img
                            src={img.url}
                            alt={img.title || 'Lab Photo'}
                            className="w-full h-full object-cover"
                          />
                          <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                            <Upload className="w-4 h-4 mb-0.5" />
                            <span className="text-[9px] font-bold">পরিবর্তন</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                handleFileUpload(e, base64 => {
                                  handleUpdateGalleryPhoto(idx, 'url', base64);
                                });
                              }}
                            />
                          </label>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400">ছবি #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryPhoto(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={img.title || ''}
                            onChange={e => handleUpdateGalleryPhoto(idx, 'title', e.target.value)}
                            placeholder="ছবির নাম / টাইটেল"
                            className="w-full text-xs font-bold px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                          />

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={img.category || ''}
                              onChange={e => handleUpdateGalleryPhoto(idx, 'category', e.target.value)}
                              placeholder="ক্যাটাগরি (e.g. কম্পিউটার ল্যাব)"
                              className="flex-1 text-[11px] px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                            />
                            <label className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors shrink-0 flex items-center space-x-1">
                              <Camera className="w-3 h-3" />
                              <span>নতুন ছবি</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                  handleFileUpload(e, base64 => {
                                    handleUpdateGalleryPhoto(idx, 'url', base64);
                                  });
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: FAQS & REVIEWS */}
          {activeTab === 'faqs_reviews' && (
            <div className="space-y-6">
              {/* FAQs */}
              <div className="space-y-4">
                <h4 className="font-black text-sm text-slate-900">সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর (FAQs)</h4>
                <input
                  type="text"
                  value={faqsHeadline}
                  onChange={e => setFaqsHeadline(e.target.value)}
                  placeholder="FAQ শিরোনাম"
                  className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                />

                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-indigo-700">প্রশ্ন #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={e => {
                          const updated = [...faqs];
                          updated[idx].question = e.target.value;
                          setFaqs(updated);
                        }}
                        placeholder="প্রশ্ন..."
                        className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl outline-hidden"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={e => {
                          const updated = [...faqs];
                          updated[idx].answer = e.target.value;
                          setFaqs(updated);
                        }}
                        placeholder="উত্তর..."
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl outline-hidden leading-relaxed"
                      />
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2.5">
                  <h5 className="font-bold text-xs text-indigo-900">+ নতুন FAQ যোগ করুন</h5>
                  <input
                    type="text"
                    value={newFaqQ}
                    onChange={e => setNewFaqQ(e.target.value)}
                    placeholder="প্রশ্ন..."
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                  />
                  <textarea
                    rows={2}
                    value={newFaqA}
                    onChange={e => setNewFaqA(e.target.value)}
                    placeholder="উত্তর..."
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>FAQ যুক্ত করুন</span>
                  </button>
                </div>
              </div>

              {/* Reviews */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <h4 className="font-black text-sm text-slate-900">শিক্ষার্থীদের মতামত ও রিভিউ (Social Proof)</h4>
                <div className="space-y-3">
                  {customReviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{rev.name} ({rev.roleOrBatch})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveReview(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 italic">"{rev.text}"</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2.5">
                  <h5 className="font-bold text-xs text-indigo-900">+ নতুন রিভিউ যোগ করুন</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newReviewName}
                      onChange={e => setNewReviewName(e.target.value)}
                      placeholder="শিক্ষার্থীর নাম"
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl outline-hidden"
                    />
                    <input
                      type="text"
                      value={newReviewRole}
                      onChange={e => setNewReviewRole(e.target.value)}
                      placeholder="পদবী / ব্যাচ নং"
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl outline-hidden"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={newReviewText}
                    onChange={e => setNewReviewText(e.target.value)}
                    placeholder="মতামত / ফিডব্যাক..."
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl outline-hidden leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={handleAddReview}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>রিভিউ যুক্ত করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SEO & SERP PREVIEWS */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex items-start space-x-3 text-xs text-slate-800">
                <Search className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">কোর্স সার্চ ইঞ্জিন অপটিমাইজেশন (Dynamic Course SEO & Local AI Signals)</p>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    গুগল ও লোকাল সার্চে "{course.name}" লিখে সার্চ করলে আপনার এই পেজটি কীভাবে প্রদর্শিত হবে তা নির্ধারণ করুন। এখানে দেয়া মেটা ট্যাগ ও JSON-LD স্কিমা সরাসরি অটোমেটিক জেনারেট হবে।
                  </p>
                </div>
              </div>

              {/* SERP & Social Previews */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Google Search Result Preview */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900">Google Search Result Preview</span>
                    </div>
                    <div className="flex items-center bg-slate-200 rounded-lg p-0.5 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('desktop')}
                        className={`px-2 py-0.5 rounded-md transition-colors ${previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                      >
                        Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('mobile')}
                        className={`px-2 py-0.5 rounded-md transition-colors ${previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                      >
                        Mobile
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs font-sans">
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 truncate">
                      <div className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[8px] flex items-center justify-center font-bold">N</div>
                      <span className="font-medium text-slate-800">Nexgen Computer Academy</span>
                      <span className="text-slate-400">›</span>
                      <span className="truncate text-slate-500">courses › {slug || generateSlug(course.name)}</span>
                    </div>

                    <h4 className="text-base text-blue-800 hover:underline font-medium cursor-pointer line-clamp-1 leading-snug">
                      {seoTitle || `${course.name} Course in Farmgate, Dhaka | Practical IT Training`}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {seoMetaDescription || `${course.name} at Nexgen Computer Academy, Farmgate. ${course.duration} practical hands-on lab training with 1-on-1 mentorship, verifiable certificate & career guidance in Dhaka.`}
                    </p>

                    {/* Mini Rich Snippets */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-600 font-medium">
                      <span className="flex items-center text-amber-600 font-bold">
                        ★ 4.9 <span className="text-slate-400 font-normal ml-1">(120+ reviews)</span>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">৳{course.offerFee?.toLocaleString() || '6,500'} BDT</span>
                      <span>•</span>
                      <span className="text-slate-500">{course.duration}</span>
                      <span>•</span>
                      <span className="text-indigo-600 font-semibold">Farmgate Campus</span>
                    </div>
                  </div>
                </div>

                {/* Social Share Preview Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">Facebook & Social Link Preview</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="h-32 w-full bg-slate-800 relative overflow-hidden flex items-center justify-center">
                      <img
                        src={ogImage || customBannerUrl || course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                        alt={seoTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold">
                        {course.code}
                      </span>
                    </div>
                    <div className="p-3 space-y-1 bg-slate-50 border-t border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">nexgenacademy.edu.bd</span>
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{ogTitle || seoTitle || course.name}</h5>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{ogDescription || seoMetaDescription || course.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Controls */}
              <div className="space-y-4 pt-2">
                {/* URL Slug */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                      URL Slug (কোর্স ওয়েব অ্যাড্রেস)
                    </label>
                    <button
                      type="button"
                      onClick={() => setSlug(generateSlug(course.name))}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Auto-generate from Course Name
                    </button>
                  </div>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs text-slate-500 font-mono">
                      /courses/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={e => setSlug(generateSlug(e.target.value))}
                      placeholder="computer-office-application"
                      className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-r-xl text-xs font-mono font-bold text-indigo-900 outline-hidden focus:border-indigo-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ইংরেজি ছোট হাতের অক্ষর এবং হাইফেন (-) ব্যবহার করুন। সার্চ ইঞ্জিনে র‍্যাংক করার জন্য এই স্লাগটি অত্যন্ত গুরুত্বপূর্ণ।
                  </p>
                </div>

                {/* Meta Title */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      SEO Meta Title (ব্রাউজার ট্যাব ও গুগল সার্চ টাইটেল)
                    </label>
                    <span className={`text-[11px] font-bold ${seoTitle.length > 65 ? 'text-rose-600' : 'text-slate-400'}`}>
                      {seoTitle.length} / 60 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={e => setSeoTitle(e.target.value)}
                    placeholder="Computer Office Application Course in Farmgate, Dhaka | Nexgen Academy"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden focus:border-indigo-600"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSeoTitle(`${course.name} Course in Farmgate, Dhaka | Practical Training`)}
                      className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                    >
                      + Standard Title
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeoTitle(`Best ${course.name} Training Center in Dhaka | Nexgen Academy`)}
                      className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                    >
                      + Best Institute Format
                    </button>
                  </div>
                </div>

                {/* Meta Description */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      SEO Meta Description (সার্চ ইঞ্জিনের বিবরণী)
                    </label>
                    <span className={`text-[11px] font-bold ${seoMetaDescription.length > 165 ? 'text-rose-600' : 'text-slate-400'}`}>
                      {seoMetaDescription.length} / 160 characters
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={seoMetaDescription}
                    onChange={e => setSeoMetaDescription(e.target.value)}
                    placeholder="কোর্সের সংক্ষেপ বিবরণ ও অফার..."
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-hidden focus:border-indigo-600 leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500">
                    গুগলে সার্চ রেজাল্টে টাইটেলের নিচে এই ২ লাইনের বিবরণ প্রদর্শিত হয়।
                  </p>
                </div>

                {/* Focus & Secondary Keywords */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-600" />
                      Primary Focus Keyword (প্রধান টার্গেট কি-ওয়ার্ড)
                    </label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={e => setFocusKeyword(e.target.value)}
                      placeholder="e.g. Computer Office Application in Farmgate"
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden focus:border-indigo-600"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-800">
                      Secondary Keywords & Search Phrases ({secondaryKeywords.length})
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {secondaryKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium flex items-center gap-1.5"
                        >
                          <span>{kw}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(i)}
                            className="text-indigo-400 hover:text-indigo-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newKeywordInput}
                        onChange={e => setNewKeywordInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddKeyword();
                          }
                        }}
                        placeholder="নতুন কি-ওয়ার্ড লিখে Enter চাপুন..."
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        যুক্ত করুন
                      </button>
                    </div>
                  </div>
                </div>

                {/* Open Graph & Canonical Controls */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">Advanced Metadata & Indexing Controls</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Open Graph Social Image URL</label>
                      <input
                        type="text"
                        value={ogImage}
                        onChange={e => setOgImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Custom Canonical URL (Optional)</label>
                      <input
                        type="text"
                        value={canonicalUrl}
                        onChange={e => setCanonicalUrl(e.target.value)}
                        placeholder="https://nexgenacademy.edu.bd/courses/..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noIndex}
                        onChange={e => setNoIndex(e.target.checked)}
                        className="rounded-sm border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                      />
                      <span>সার্চ ইঞ্জিনে ইন্ডেক্সিং বন্ধ রাখুন (noindex - Do NOT index in Google)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            বাতিল
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>পরিবর্তন সংরক্ষণ করুন (Save Changes)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
