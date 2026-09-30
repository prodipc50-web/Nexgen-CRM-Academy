import React, { useState, useEffect, useRef } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import {
  LearningDeliveryFormatCard,
  AdmissionRoadmapStep,
  WebsiteSectionVisibility,
  ImpactTrustMetricItem,
  ImpactTrustConfig,
  SectionHeadingConfig,
  AccreditationTrustItem,
  StudentSuccessStory
} from '../../../types';
import {
  Sliders,
  Eye,
  CheckCircle2,
  Save,
  Layers,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Laptop,
  Check,
  Footprints,
  FileText,
  RotateCcw,
  TrendingUp,
  BarChart3,
  Users,
  GraduationCap,
  Type,
  Sparkles,
  Image as ImageIcon,
  Star,
  Bell,
  HelpCircle,
  Phone,
  ShieldCheck,
  Search,
  Compass,
  DollarSign,
  Play,
  Plus,
  Trash2,
  Monitor,
  Briefcase,
  HeartHandshake,
  CreditCard
} from 'lucide-react';

interface CmsSectionsTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsSectionsTab: React.FC<CmsSectionsTabProps> = ({ onSuccessToast }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig, academySettings } = useAcademy();
  const [saveFeedback, setSaveFeedback] = useState(false);
  const hasUserEditedRef = useRef(false);

  // 1. Section Visibility
  const [visibility, setVisibility] = useState<WebsiteSectionVisibility>(
    websiteCmsConfig.sectionVisibility || {
      heroBanner: true,
      trustStrip: true,
      deliveryModes: true,
      impactTrust: true,
      careerWizard: true,
      courses: true,
      courseComparison: true,
      counselingBanner: true,
      admissionRoadmap: true,
      aboutUs: true,
      mentors: true,
      communityHub: true,
      blog: true,
      seminars: true,
      gallery: true,
      reviews: true,
      studentSuccess: true,
      placements: true,
      hiringPartners: true,
      verifyCertificate: true,
      noticesAndFaq: true,
      geoLocalGuide: true,
      contactAndMap: true,
      footer: true
    }
  );

  // 2. Delivery Modes
  const [deliveryEnabled, setDeliveryEnabled] = useState<boolean>(
    websiteCmsConfig.deliveryModesConfig?.enabled ?? true
  );
  const [deliveryCards, setDeliveryCards] = useState<LearningDeliveryFormatCard[]>(
    websiteCmsConfig.deliveryModesConfig?.cards || [
      {
        id: 'offline',
        title: 'Offline Course',
        badge: 'ল্যাব ব্যাচ',
        description: 'ইন-পার্সন সরাসরি আধুনিক এসি ল্যাবে প্র্যাকটিক্যাল ক্লাস ও সার্বক্ষণিক শিক্ষক সাপোর্ট।',
        footerText: 'Courses Available',
        enabled: true
      },
      {
        id: 'online',
        title: 'Online Live Course',
        badge: 'লাইভ ক্লাস',
        description: 'দেশ-বিদেশের যেকোনো স্থান থেকে লাইভ ক্লাসে অংশ নিন, ইনস্ট্যান্ট প্রশ্ন করুন ও ক্লাস রেকর্ডিং পান।',
        footerText: 'Courses Available',
        enabled: true
      },
      {
        id: 'recorded',
        title: 'Pre Recorded Course',
        badge: 'সেলফ-পেসড',
        description: 'নিজের সুবিধাজনক সময়ে প্রিমিয়াম এইচডি ভিডিও দেখুন, প্রজেক্ট জমা দিন ও লাইফটাইম অ্যাক্সেস উপভোগ করুন।',
        footerText: 'Courses Available',
        enabled: true
      },
      {
        id: 'corporate',
        title: 'Corporate Training',
        badge: 'কর্পোরেট',
        description: 'ব্যাংক, বহুজাতিক প্রতিষ্ঠান ও কর্পোরেট টিমের কর্মীদের আধুনিক সফটওয়্যার ও আইটি স্কিলস ট্রেনিং।',
        footerText: 'Custom Team Upskilling',
        enabled: true
      }
    ]
  );

  // 3. Impact & Trust Metrics
  const [impactEnabled, setImpactEnabled] = useState<boolean>(
    websiteCmsConfig.impactTrustConfig?.enabled ?? true
  );
  const [impactTagText, setImpactTagText] = useState<string>(
    websiteCmsConfig.impactTrustConfig?.tagText || 'CAREER IMPACT & TRUST'
  );
  const [impactHeading, setImpactHeading] = useState<string>(
    websiteCmsConfig.impactTrustConfig?.heading || 'From Beginner to IT Professionals We Close That Gap.'
  );
  const [impactSubtitle, setImpactSubtitle] = useState<string>(
    websiteCmsConfig.impactTrustConfig?.subtitle ||
      'অভিজ্ঞ মেন্টরশিপ ও প্রজেক্ট-ভিত্তিক ট্রেনিং এর মাধ্যমে বাংলাদেশের তরুণদের গ্লোবাল ক্যারিয়ার গঠনে আমরা প্রতিশ্রুতিবদ্ধ।'
  );
  const [impactMetrics, setImpactMetrics] = useState<ImpactTrustMetricItem[]>(
    websiteCmsConfig.impactTrustConfig?.metrics || [
      { id: 'm1', metric: '20,000+', label: 'Successful Students', subtext: 'সফল শিক্ষার্থী', color: 'text-indigo-600' },
      { id: 'm2', metric: '9,000+', label: 'Expert Freelancers', subtext: 'সফল ফ্রিল্যান্সার', color: 'text-emerald-600' },
      { id: 'm3', metric: '2,000+', label: 'Skilled Job Holders', subtext: 'কর্মসংস্থানপ্রাপ্ত গ্র্যাজুয়েট', color: 'text-blue-600' },
      { id: 'm4', metric: '5,000+', label: 'Industry Experts', subtext: 'মেন্টরস নেটওয়ার্ক', color: 'text-amber-500' },
      { id: 'm5', metric: '95%', label: 'Course Success Ratio', subtext: 'সফলতার হার', color: 'text-rose-500' },
      { id: 'm6', metric: '100+', label: 'Hiring Partners', subtext: 'পার্টনার প্রতিষ্ঠান', color: 'text-purple-600' }
    ]
  );

  // 4. Admission Roadmap
  const [roadmapEnabled, setRoadmapEnabled] = useState<boolean>(
    websiteCmsConfig.admissionRoadmap?.enabled ?? true
  );
  const [roadmapTag, setRoadmapTag] = useState<string>(
    websiteCmsConfig.admissionRoadmap?.tagText || 'ভর্তি ও ক্লাস শুরুর প্রক্রিয়া'
  );
  const [roadmapTitle, setRoadmapTitle] = useState<string>(
    websiteCmsConfig.admissionRoadmap?.title || 'সহজ ৪টি ধাপে শুরু করুন আপনার আইটি ক্যারিয়ার'
  );
  const [roadmapDesc, setRoadmapDesc] = useState<string>(
    websiteCmsConfig.admissionRoadmap?.description ||
      'কোনো ঝামেলা ছাড়াই সম্পূর্ণ স্বচ্ছ প্রক্রিয়ায় কোর্স নির্বাচন, সরাসরি ল্যাব ওরিয়েন্টেশন এবং বাস্তব কাজ শেখা শুরু করুন।'
  );
  const [roadmapSteps, setRoadmapSteps] = useState<AdmissionRoadmapStep[]>(
    websiteCmsConfig.admissionRoadmap?.steps || [
      {
        id: 'step-1',
        stepNumber: '০১',
        title: 'কোর্স নির্বাচন ও কাউন্সেলিং',
        description: 'আপনার বর্তমান ক্যারিয়ার লক্ষ্য অনুযায়ী উপযুক্ত কোর্স বেছে নিন বা আমাদের এক্সপার্ট মেন্টরের সাথে কথা বলুন।',
        icon: 'BookOpen'
      },
      {
        id: 'step-2',
        stepNumber: '০২',
        title: 'অনলাইন আবেদন ও সিট বুকিং',
        description: 'পছন্দের ব্যাচ টাইম স্লট (সকাল, বিকাল বা উইকেন্ড) নির্বাচন করে সিট কনফার্ম করুন এবং রেজিস্ট্রেশন কপি বুঝে নিন।',
        icon: 'Calendar'
      },
      {
        id: 'step-3',
        stepNumber: '০৩',
        title: 'ল্যাব ওরিয়েন্টেশন ও সিঙ্গেল পিসি',
        description: 'প্রথম দিন ক্যাম্পাসে পরিচিতি এবং ক্লাসের প্রতিটি সেশনে ব্যক্তিগত হাই-কনফিগ কম্পিউটার বরাদ্দ বুঝে নিন।',
        icon: 'Laptop'
      },
      {
        id: 'step-4',
        stepNumber: '০৪',
        title: 'রিয়েল প্রজেক্ট ও আজীবন সাপোর্ট',
        description: 'বাস্তব প্রজেক্টে দক্ষতা অর্জন, সরকারি/ভেরিফায়েবল সার্টিফিকেট এবং আজীবন মেন্টরশিপ কমিউনিটি সহায়তা।',
        icon: 'Award'
      }
    ]
  );

  // 4.5 Accreditation & BTEB Trust Strip
  const [trustStripEnabled, setTrustStripEnabled] = useState<boolean>(
    websiteCmsConfig.trustStripConfig?.enabled ?? true
  );
  const [trustStripTag, setTrustStripTag] = useState<string>(
    websiteCmsConfig.trustStripConfig?.tagText || 'Govt. Standard & ISO 9001:2015'
  );
  const [trustStripItems, setTrustStripItems] = useState<AccreditationTrustItem[]>(
    websiteCmsConfig.trustStripConfig?.items || [
      {
        id: 'bteb',
        iconName: 'Award',
        title: 'BTEB স্ট্যান্ডার্ড কারিকুলাম',
        subtitle: 'বাংলাদেশ কারিগরি শিক্ষা বোর্ড অনুমোদিত মান',
        badge: 'Govt. Standard',
        enabled: true
      },
      {
        id: 'iso',
        iconName: 'ShieldCheck',
        title: 'ISO 9001:2015 সার্টিফাইড',
        subtitle: 'আন্তর্জাতিক মানসম্পন্ন আইটি ট্রেনিং ও ম্যানেজমেন্ট',
        badge: 'ISO Quality',
        enabled: true
      },
      {
        id: 'pc_lab',
        iconName: 'Monitor',
        title: '১০০% সিঙ্গেল পিসি ল্যাব',
        subtitle: 'প্রতিটি শিক্ষার্থীর জন্য ক্লাসে ব্যক্তিগত হাই-স্পিড কম্পিউটার',
        badge: 'Smart Lab',
        enabled: true
      },
      {
        id: 'placement',
        iconName: 'Briefcase',
        title: '১০০+ হায়ার পার্টনার প্লেসমেন্ট',
        subtitle: 'সিভি বিল্ডিং, মক ইন্টারভিউ ও সরাসরি ইন্টার্নশিপ রেফারেল',
        badge: 'Career Cell',
        enabled: true
      },
      {
        id: 'support',
        iconName: 'HeartHandshake',
        title: 'লাইফটাইম মেন্টরশিপ সাপোর্ট',
        subtitle: 'কোর্স শেষ হলেও আনলিমিটেড ক্যাম্পাস ল্যাব ও সলিউশন এক্সেস',
        badge: 'Lifetime 24/7',
        enabled: true
      },
      {
        id: 'installment',
        iconName: 'CreditCard',
        title: '০% সুদে সহজ কিস্তি সুবিধা',
        subtitle: 'বিকাশ, নগদ ও ব্যাংকে সহজ ২-৩ কিস্তিতে ভর্তির সুযোগ',
        badge: 'Easy EMI',
        enabled: true
      }
    ]
  );

  // 4.6 Student Success Spotlight & Video Stories
  const [studentSuccessEnabled, setStudentSuccessEnabled] = useState<boolean>(
    websiteCmsConfig.studentSuccessConfig?.enabled ?? true
  );
  const [studentSuccessTag, setStudentSuccessTag] = useState<string>(
    websiteCmsConfig.studentSuccessConfig?.tagText || 'প্রমাণিত সফলতার প্রমাণ ও স্টুডেন্ট ইন্টারভিউ'
  );
  const [studentSuccessHeading, setStudentSuccessHeading] = useState<string>(
    websiteCmsConfig.studentSuccessConfig?.heading || 'আমাদের সফল গ্র্যাজুয়েটদের রিয়েল ইনকাম ও ক্যারিয়ার স্টোরি'
  );
  const [studentSuccessSubtitle, setStudentSuccessSubtitle] = useState<string>(
    websiteCmsConfig.studentSuccessConfig?.subtitle ||
      'নেক্সজেন কম্পিউটার একাডেমির প্রজেক্ট-ভিত্তিক মেন্টরশিপের মাধ্যমে কীভাবে শত শত শিক্ষার্থী নন-আইটি ব্যাকগ্রাউন্ড থেকে সফল ফ্রিল্যান্সার ও ফুল-টাইম সফটওয়্যার ইঞ্জিনিয়ার হয়েছেন তাদের বাস্তব অভিজ্ঞতা শুনুন।'
  );
  const [studentSuccessStories, setStudentSuccessStories] = useState<StudentSuccessStory[]>(
    websiteCmsConfig.studentSuccessConfig?.stories ||
      websiteCmsConfig.studentSuccessStories || [
        {
          id: 'story-1',
          studentName: 'তানভীর হাসান',
          courseName: 'MERN Stack Web Development',
          companyOrPlatform: 'Brain Station 23 • Junior Software Engineer',
          monthlyIncomeOrPackage: '৳৫৫,০০০/মাস',
          avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
          videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          storySummary: 'নন-সিএসই ব্যাকগ্রাউন্ড থেকে এসে নেক্সজেন কম্পিউটার একাডেমির প্রজেক্ট-ভিত্তিক মেন্টরশিপের মাধ্যমে ৬ মাসে ৫টি ফুল-স্ট্যাক প্রজেক্ট তৈরি করে সরাসরি ব্রেইন স্টেশন ২৩-এ চাকরি পান।',
          quote: 'নেক্সজেনের সরাসরি ল্যাব সাপোর্ট ও শিক্ষকদের আন্তরিক গাইডলাইন ছাড়া এত দ্রুত ইন্ডাস্ট্রিতে ক্যারিয়ার শুরু করা সম্ভব ছিল না।',
          batchNo: 'Batch WEB-2402',
          achievementBadge: '🏆 Full-Time Placement',
          isActive: true
        },
        {
          id: 'story-2',
          studentName: 'ফারজানা আক্তার তিশা',
          courseName: 'Graphic Design & Freelancing',
          companyOrPlatform: 'Fiverr Level 2 Seller • Top Rated',
          monthlyIncomeOrPackage: '$১,৪০০+ (৳১,৬৫,০০০+/মাস)',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          storySummary: 'গৃহিণী হিসেবে ঘরে বসেই গ্রাফিক ডিজাইন ও লোগো ব্র্যান্ডিং কোর্স সম্পন্ন করে ফাইভার মার্কেটপ্লেসে এখন পর্যন্ত ৩০০+ আন্তর্জাতিক ক্লায়েন্টের কাজ সম্পন্ন করেছেন।',
          quote: 'মহিলাদের জন্য ঘরে বসে সম্মানের সাথে স্বাবলম্বী হওয়ার সবচেয়ে বিশ্বস্ত প্রতিষ্ঠান নেক্সজেন।',
          batchNo: 'Batch GDF-2311',
          achievementBadge: '⭐ Freelance Rockstar',
          isActive: true
        },
        {
          id: 'story-3',
          studentName: 'মেহেদী হাসান সাকিব',
          courseName: 'Professional Video Editing & Motion Graphics',
          companyOrPlatform: 'YouTube Content Agency (USA) • Remote Editor',
          monthlyIncomeOrPackage: '$৮৫০+/মাস (৳১,০০,০০০+)',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          storySummary: 'প্রিমিয়ার প্রো ও আফটার ইফেক্টসের অ্যাডভান্সড টেকনিক শিখে আমেরিকান ক্রিয়েটর চ্যানেলের ফুল-টাইম রিমোট ভিডিও এডিটর হিসেবে নিযুক্ত হন।',
          quote: 'ফার্মগেটের হাই-কনফিগ পিসি ল্যাব থাকায় প্র্যাকটিস করাটা অনেক সহজ হয়েছিল।',
          batchNo: 'Batch VDM-2401',
          achievementBadge: '🎬 Remote Global Work',
          isActive: true
        },
        {
          id: 'story-4',
          studentName: 'আরিফুল ইসলাম',
          courseName: 'Digital Marketing & AI Growth Hacking',
          companyOrPlatform: 'Pathao • Associate Marketing Specialist',
          monthlyIncomeOrPackage: '৳৪৮,০০০/মাস',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
          videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          storySummary: 'মেটা অ্যাডস, গুগল ক্যাম্পেইন ও কনভার্সন অপটিমাইজেশন শিখে দেশের শীর্ষ রাইড-শেয়ারিং ও লজিস্টিক প্রতিষ্ঠান পাঠাও-এ ক্যারিয়ার গড়ে তোলেন।',
          quote: 'এখানে শুধু থিওরি না, লাইভ ক্যাম্পেইনে প্র্যাক্টিক্যাল বাজেট দিয়ে কাজ শেখানো হয়।',
          batchNo: 'Batch DM-2403',
          achievementBadge: '💼 Corporate Hire',
          isActive: true
        }
      ]
  );

  // 4.7 Interactive Decision Tools (Career Wizard, Comparison, Counseling Banner)
  const [careerWizardTag, setCareerWizardTag] = useState<string>(
    websiteCmsConfig.careerWizardConfig?.tagText || 'AI ক্যারিয়ার ম্যাচিং ও দিকনির্দেশনা'
  );
  const [careerWizardHeading, setCareerWizardHeading] = useState<string>(
    websiteCmsConfig.careerWizardConfig?.heading || 'কোন কোর্সটি আপনার ব্যাকগ্রাউন্ড ও ক্যারিয়ারের জন্য পারফেক্ট?'
  );
  const [careerWizardSubtitle, setCareerWizardSubtitle] = useState<string>(
    websiteCmsConfig.careerWizardConfig?.subtitle ||
      'মাত্র ৪টি সাধারণ প্রশ্নের উত্তর দিন। আপনার আগ্রহ, শিক্ষাগত যোগ্যতা ও আয়ের লক্ষ্যের ভিত্তিতে সিস্টেম উপযুক্ত কোর্স ও রোডম্যাপ সাজেস্ট করবে।'
  );

  const [courseComparisonTag, setCourseComparisonTag] = useState<string>(
    websiteCmsConfig.courseComparisonConfig?.tagText || 'ক্যারিয়ার তুলনা ও সঠিক সিদ্ধান্ত'
  );
  const [courseComparisonHeading, setCourseComparisonHeading] = useState<string>(
    websiteCmsConfig.courseComparisonConfig?.heading || 'কোন কোর্সটি কেমন? এক নজরে কোর্স ও ক্যারিয়ার তুলনা করুন'
  );
  const [courseComparisonSubtitle, setCourseComparisonSubtitle] = useState<string>(
    websiteCmsConfig.courseComparisonConfig?.subtitle ||
      'কোর্স নির্বাচন নিয়ে দ্বিধায় আছেন? পাশাপাশি দুইটি কোর্স রেখে সিলেবাস, মার্কেট চাহিদা ও গড় মাসিক উপার্জনের সম্ভাবনা যাচাই করুন।'
  );

  const [counselingBannerTag, setCounselingBannerTag] = useState<string>(
    websiteCmsConfig.counselingBannerConfig?.tagText || '১-ক্লিক ফ্রি ক্যারিয়ার কাউন্সেলিং'
  );
  const [counselingBannerTitle, setCounselingBannerTitle] = useState<string>(
    websiteCmsConfig.counselingBannerConfig?.title ||
      'আইটি ক্যারিয়ার নিয়ে দ্বিধাগ্রস্ত? আমাদের সিনিয়র ক্যারিয়ার এক্সপার্টের সাথে কথা বলুন'
  );
  const [counselingBannerSubtitle, setCounselingBannerSubtitle] = useState<string>(
    websiteCmsConfig.counselingBannerConfig?.subtitle ||
      'আপনার নাম ও মোবাইল নম্বর দিয়ে রিকোয়েস্ট পাঠান। আমাদের মেন্টর আপনাকে ফোন করে ফ্রি ক্যারিয়ার গাইডলাইন প্রদান করবেন।'
  );

  // 5. Section Heading Overrides
  const [coursesHeading, setCoursesHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.coursesSectionConfig?.tagText || 'Industry-Standard IT Curriculum',
    heading: websiteCmsConfig.coursesSectionConfig?.heading || 'Our Specialized IT Career Courses (কোর্সসমূহ)',
    subtitle: websiteCmsConfig.coursesSectionConfig?.subtitle || 'মার্কেটপ্লেস ও কর্পোরেট জব রেডি স্কিলস ডেভেলপ করুন অভিজ্ঞ মেন্টরদের সাথে।'
  });

  const [mentorsHeading, setMentorsHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.mentorsSectionConfig?.tagText || 'Industry Experts & Practitioners',
    heading: websiteCmsConfig.mentorsSectionConfig?.heading || 'Meet Our Industry Mentors & Faculty (মেন্টর প্যানেল)',
    subtitle: websiteCmsConfig.mentorsSectionConfig?.subtitle || 'আন্তর্জাতিক রিমোট জব ও টপ-রেটেড ফ্রিল্যান্সিংয়ে প্রতিষ্ঠিত শিক্ষকবৃন্দের সরাসরি তত্ত্বাবধানে নিজেকে তৈরি করুন।'
  });

  const [blogHeading, setBlogHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.blogSectionConfig?.tagText || 'Knowledge Base & Career Guide',
    heading: websiteCmsConfig.blogSectionConfig?.heading || 'Tech Blog & Career Roadmap Articles (ব্লগ ও ক্যারিয়ার গাইড)',
    subtitle: websiteCmsConfig.blogSectionConfig?.subtitle || 'প্রযুক্তি খাতের আপডেট, ফ্রিল্যান্সিং ক্যারিয়ার ট্রিকস ও ইন-ডিমান্ড স্কিলস এর নিয়মিত বিশ্লেষণ।'
  });

  const [seminarsHeading, setSeminarsHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.seminarsSectionConfig?.tagText || 'Free Career Workshops',
    heading: websiteCmsConfig.seminarsSectionConfig?.heading || 'Upcoming Free Seminars & Workshops (ফ্রি ক্যারিয়ার সেমিনার)',
    subtitle: websiteCmsConfig.seminarsSectionConfig?.subtitle || 'ক্যাম্পাসে সরাসরি অথবা অনলাইনে যুক্ত হয়ে ইন্ডাস্ট্রি লিডারদের কাছ থেকে ক্যারিয়ার গাইডলাইন নিন।'
  });
  const [galleryHeading, setGalleryHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.gallerySectionConfig?.tagText || 'Life at Smart Campus',
    heading: websiteCmsConfig.gallerySectionConfig?.heading || 'Student Lab & Activity Photo Gallery (গ্যালারি)',
    subtitle: websiteCmsConfig.gallerySectionConfig?.subtitle || 'Glimpses of our vibrant classroom labs, workshop sessions, and graduation ceremonies.'
  });
  const [reviewsHeading, setReviewsHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.reviewsSectionConfig?.tagText || 'Real Student Feedback & Employment Proof',
    heading: websiteCmsConfig.reviewsSectionConfig?.heading || 'Verified Student Reviews & Career Stories (রিভিউ)',
    subtitle: websiteCmsConfig.reviewsSectionConfig?.subtitle || 'Read how our alumni transitioned into freelance marketplaces and leading tech enterprises.'
  });
  const [noticesFaqHeading, setNoticesFaqHeading] = useState({
    noticeTag: websiteCmsConfig.noticesFaqSectionConfig?.noticeTag || 'Official Circulars',
    noticeHeading: websiteCmsConfig.noticesFaqSectionConfig?.noticeHeading || 'Academic Notice Board',
    noticeSubtitle: websiteCmsConfig.noticesFaqSectionConfig?.noticeSubtitle || 'Official notices regarding exams, batch schedules, and scholarship events.',
    faqTag: websiteCmsConfig.noticesFaqSectionConfig?.faqTag || 'Instant Answers',
    faqHeading: websiteCmsConfig.noticesFaqSectionConfig?.faqHeading || 'Frequently Asked Questions',
    faqSubtitle: websiteCmsConfig.noticesFaqSectionConfig?.faqSubtitle || 'Got questions about courses, certifications, or installments? Find instant answers below.'
  });
  const [contactHeading, setContactHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.contactSectionConfig?.tagText || 'Direct Helplines & Location',
    heading: websiteCmsConfig.contactSectionConfig?.heading || 'Visit Our Campus & Direct Helplines',
    subtitle: websiteCmsConfig.contactSectionConfig?.subtitle || 'We are open everyday from 9:00 AM to 8:30 PM for on-desk counseling and lab visits.'
  });
  const [verifyCertificateHeading, setVerifyCertificateHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.verifyCertificateSectionConfig?.tagText || 'Govt. Standard Online Verification Portal & Academic Registry',
    heading: websiteCmsConfig.verifyCertificateSectionConfig?.heading || 'Verify Student Certificate & Credentials',
    subtitle: websiteCmsConfig.verifyCertificateSectionConfig?.subtitle || 'Enter the Certificate Number or Student ID to verify authenticity directly from our official academic registry.'
  });
  const [placementsHeading, setPlacementsHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.placementsSectionConfig?.tagText || 'Real Alumni Career Success & Placements',
    heading: websiteCmsConfig.placementsSectionConfig?.heading || 'সফল শিক্ষার্থীদের কর্মসংস্থান ও ফ্রিল্যান্সিং অর্জন',
    subtitle: websiteCmsConfig.placementsSectionConfig?.subtitle || 'কোর্স সম্পন্নের পর আমাদের ক্যারিয়ার সেলের প্রত্যক্ষ নির্দেশনায় দেশি-বিদেশি শীর্ষ সফটওয়্যার কোম্পানি এবং গ্লোবাল ফ্রিল্যান্স মার্কেটপ্লেসে সফলতার সাথে কাজ করছেন আমাদের শিক্ষার্থীরা।'
  });
  const [popularTagsString, setPopularTagsString] = useState<string>(
    (websiteCmsConfig.popularSearchTags || ['AutoCAD 2D/3D', 'Video Editing', 'Digital Marketing', 'Graphic Design', 'Web Development', 'French Language', 'AI Automation', 'Advanced Excel', 'Freelancing']).join(', ')
  );
  const [headerSubtitle, setHeaderSubtitle] = useState<string>(
    websiteCmsConfig.headerSubtitle || `${academySettings.campusName || "Farmgate Campus"} • Govt. Standard IT Training & Career Incubator`
  );
  const [headerEstText, setHeaderEstText] = useState<string>(
    websiteCmsConfig.headerEstText || "EST. 2018"
  );

  // 6. Footer Config
  const [footerBio, setFooterBio] = useState<string>(
    websiteCmsConfig.footerConfig?.bio ||
      'Premier professional IT training organization dedicated to creating industry-grade developers, designers, and freelance leaders with 100% practical lab practice.'
  );
  const [copyrightText, setCopyrightText] = useState<string>(
    websiteCmsConfig.footerConfig?.copyrightText || 'All Rights Reserved.'
  );
  const [creditsText, setCreditsText] = useState<string>(
    websiteCmsConfig.footerConfig?.creditsText || 'Empowered by NexGen Multi-Campus ERP & Centralized CMS Engine.'
  );
  const [showSocials, setShowSocials] = useState<boolean>(
    websiteCmsConfig.footerConfig?.showSocials ?? true
  );
  const [showTopCourses, setShowTopCourses] = useState<boolean>(
    websiteCmsConfig.footerConfig?.showTopCourses ?? true
  );
  const [showQuickNav, setShowQuickNav] = useState<boolean>(
    websiteCmsConfig.footerConfig?.showQuickNav ?? true
  );
  const [showLegalLinks, setShowLegalLinks] = useState<boolean>(
    websiteCmsConfig.footerConfig?.showLegalLinks ?? true
  );

  // Synchronize state whenever websiteCmsConfig updates (e.g. from cloud or another tab)
  useEffect(() => {
    if (hasUserEditedRef.current) return;

    if (websiteCmsConfig.sectionVisibility) {
      setVisibility(websiteCmsConfig.sectionVisibility);
    }
    if (websiteCmsConfig.deliveryModesConfig) {
      setDeliveryEnabled(websiteCmsConfig.deliveryModesConfig.enabled ?? true);
      if (websiteCmsConfig.deliveryModesConfig.cards) {
        setDeliveryCards(websiteCmsConfig.deliveryModesConfig.cards);
      }
    }
    if (websiteCmsConfig.impactTrustConfig) {
      setImpactEnabled(websiteCmsConfig.impactTrustConfig.enabled ?? true);
      setImpactTagText(websiteCmsConfig.impactTrustConfig.tagText || 'CAREER IMPACT & TRUST');
      setImpactHeading(websiteCmsConfig.impactTrustConfig.heading || 'From Beginner to IT Professionals We Close That Gap.');
      setImpactSubtitle(websiteCmsConfig.impactTrustConfig.subtitle || '');
      if (websiteCmsConfig.impactTrustConfig.metrics) {
        setImpactMetrics(websiteCmsConfig.impactTrustConfig.metrics);
      }
    }
    if (websiteCmsConfig.admissionRoadmap) {
      setRoadmapEnabled(websiteCmsConfig.admissionRoadmap.enabled ?? true);
      setRoadmapTag(websiteCmsConfig.admissionRoadmap.tagText || 'ভর্তি ও ক্লাস শুরুর প্রক্রিয়া');
      setRoadmapTitle(websiteCmsConfig.admissionRoadmap.title || 'সহজ ৪টি ধাপে শুরু করুন আপনার আইটি ক্যারিয়ার');
      setRoadmapDesc(websiteCmsConfig.admissionRoadmap.description || '');
      if (websiteCmsConfig.admissionRoadmap.steps) {
        setRoadmapSteps(websiteCmsConfig.admissionRoadmap.steps);
      }
    }
    if (websiteCmsConfig.coursesSectionConfig) {
      setCoursesHeading(websiteCmsConfig.coursesSectionConfig);
    }
    if (websiteCmsConfig.mentorsSectionConfig) {
      setMentorsHeading(websiteCmsConfig.mentorsSectionConfig);
    }
    if (websiteCmsConfig.blogSectionConfig) {
      setBlogHeading(websiteCmsConfig.blogSectionConfig);
    }
    if (websiteCmsConfig.seminarsSectionConfig) {
      setSeminarsHeading(websiteCmsConfig.seminarsSectionConfig);
    }
    if (websiteCmsConfig.gallerySectionConfig) {
      setGalleryHeading(websiteCmsConfig.gallerySectionConfig);
    }
    if (websiteCmsConfig.reviewsSectionConfig) {
      setReviewsHeading(websiteCmsConfig.reviewsSectionConfig);
    }
    if (websiteCmsConfig.noticesFaqSectionConfig) {
      setNoticesFaqHeading(prev => ({ ...prev, ...(websiteCmsConfig.noticesFaqSectionConfig || {}) }));
    }
    if (websiteCmsConfig.contactSectionConfig) {
      setContactHeading(websiteCmsConfig.contactSectionConfig);
    }
    if (websiteCmsConfig.verifyCertificateSectionConfig) {
      setVerifyCertificateHeading(websiteCmsConfig.verifyCertificateSectionConfig);
    }
    if (websiteCmsConfig.placementsSectionConfig) {
      setPlacementsHeading(websiteCmsConfig.placementsSectionConfig);
    }
    if (Array.isArray(websiteCmsConfig.popularSearchTags)) {
      setPopularTagsString(websiteCmsConfig.popularSearchTags.join(', '));
    }
    if (websiteCmsConfig.headerSubtitle !== undefined) {
      setHeaderSubtitle(websiteCmsConfig.headerSubtitle);
    }
    if (websiteCmsConfig.headerEstText !== undefined) {
      setHeaderEstText(websiteCmsConfig.headerEstText);
    }
    if (websiteCmsConfig.footerConfig) {
      if (websiteCmsConfig.footerConfig.bio !== undefined) setFooterBio(websiteCmsConfig.footerConfig.bio);
      if (websiteCmsConfig.footerConfig.copyrightText !== undefined) setCopyrightText(websiteCmsConfig.footerConfig.copyrightText);
      if (websiteCmsConfig.footerConfig.creditsText !== undefined) setCreditsText(websiteCmsConfig.footerConfig.creditsText);
      if (websiteCmsConfig.footerConfig.showSocials !== undefined) setShowSocials(websiteCmsConfig.footerConfig.showSocials);
      if (websiteCmsConfig.footerConfig.showTopCourses !== undefined) setShowTopCourses(websiteCmsConfig.footerConfig.showTopCourses);
      if (websiteCmsConfig.footerConfig.showQuickNav !== undefined) setShowQuickNav(websiteCmsConfig.footerConfig.showQuickNav);
      if (websiteCmsConfig.footerConfig.showLegalLinks !== undefined) setShowLegalLinks(websiteCmsConfig.footerConfig.showLegalLinks);
    }
  }, [websiteCmsConfig]);

  const handleToggleSection = (key: keyof WebsiteSectionVisibility) => {
    hasUserEditedRef.current = true;
    setVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleUpdateDeliveryCard = (index: number, field: keyof LearningDeliveryFormatCard, val: any) => {
    hasUserEditedRef.current = true;
    setDeliveryCards(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleUpdateRoadmapStep = (index: number, field: keyof AdmissionRoadmapStep, val: any) => {
    hasUserEditedRef.current = true;
    setRoadmapSteps(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleUpdateImpactMetric = (index: number, field: keyof ImpactTrustMetricItem, val: string) => {
    hasUserEditedRef.current = true;
    setImpactMetrics(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleUpdateTrustItem = (index: number, field: keyof AccreditationTrustItem, val: any) => {
    hasUserEditedRef.current = true;
    setTrustStripItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleAddTrustItem = () => {
    hasUserEditedRef.current = true;
    const newItem: AccreditationTrustItem = {
      id: `trust-${Date.now()}`,
      title: 'নতুন কোর্স সুবিধা বা স্বীকৃতি',
      subtitle: 'বিবরণ লিখুন',
      badge: 'New Standard',
      iconName: 'Award',
      enabled: true
    };
    setTrustStripItems(prev => [...prev, newItem]);
  };

  const handleDeleteTrustItem = (index: number) => {
    hasUserEditedRef.current = true;
    setTrustStripItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateStudentStory = (index: number, field: keyof StudentSuccessStory, val: any) => {
    hasUserEditedRef.current = true;
    setStudentSuccessStories(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleAddStudentStory = () => {
    hasUserEditedRef.current = true;
    const newStory: StudentSuccessStory = {
      id: `story-${Date.now()}`,
      studentName: 'নতুন সফল শিক্ষার্থী',
      courseName: 'Web Development / Graphic Design',
      companyOrPlatform: 'Fiverr Level 2 / Software Firm',
      monthlyIncomeOrPackage: '৳৫০,০০০/মাস',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      storySummary: 'কোর্স চলাকালীন সময়ে প্রজেক্ট তৈরি করে মার্কেটপ্লেসে কাজ শুরু করেন।',
      quote: 'নেক্সজেন কম্পিউটার একাডেমির সরাসরি মেন্টরশিপ ও ল্যাব সাপোর্ট আমার ক্যারিয়ারের মোড় ঘুরিয়ে দিয়েছে।',
      batchNo: 'Batch 2026',
      achievementBadge: '🏆 সফল শিক্ষার্থী',
      isActive: true
    };
    setStudentSuccessStories(prev => [newStory, ...prev]);
  };

  const handleDeleteStudentStory = (index: number) => {
    hasUserEditedRef.current = true;
    setStudentSuccessStories(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    hasUserEditedRef.current = false;
    updateWebsiteCmsConfig({
      sectionVisibility: visibility,
      deliveryModesConfig: {
        enabled: deliveryEnabled,
        cards: deliveryCards
      },
      impactTrustConfig: {
        enabled: impactEnabled,
        tagText: impactTagText,
        heading: impactHeading,
        subtitle: impactSubtitle,
        metrics: impactMetrics
      },
      admissionRoadmap: {
        enabled: roadmapEnabled,
        tagText: roadmapTag,
        title: roadmapTitle,
        description: roadmapDesc,
        steps: roadmapSteps
      },
      trustStripConfig: {
        enabled: trustStripEnabled,
        tagText: trustStripTag,
        items: trustStripItems
      },
      studentSuccessConfig: {
        enabled: studentSuccessEnabled,
        tagText: studentSuccessTag,
        heading: studentSuccessHeading,
        subtitle: studentSuccessSubtitle,
        stories: studentSuccessStories
      },
      studentSuccessStories: studentSuccessStories,
      careerWizardConfig: {
        enabled: visibility.careerWizard !== false,
        tagText: careerWizardTag,
        heading: careerWizardHeading,
        subtitle: careerWizardSubtitle
      },
      courseComparisonConfig: {
        enabled: visibility.courseComparison !== false,
        tagText: courseComparisonTag,
        heading: courseComparisonHeading,
        subtitle: courseComparisonSubtitle
      },
      counselingBannerConfig: {
        enabled: visibility.counselingBanner !== false,
        tagText: counselingBannerTag,
        title: counselingBannerTitle,
        subtitle: counselingBannerSubtitle
      },
      coursesSectionConfig: coursesHeading,
      mentorsSectionConfig: mentorsHeading,
      blogSectionConfig: blogHeading,
      seminarsSectionConfig: seminarsHeading,
      gallerySectionConfig: galleryHeading,
      reviewsSectionConfig: reviewsHeading,
      noticesFaqSectionConfig: noticesFaqHeading,
      contactSectionConfig: contactHeading,
      verifyCertificateSectionConfig: verifyCertificateHeading,
      placementsSectionConfig: placementsHeading,
      popularSearchTags: popularTagsString.split(',').map(s => s.trim()).filter(Boolean),
      headerSubtitle,
      headerEstText,
      footerConfig: {
        bio: footerBio,
        copyrightText,
        creditsText,
        showSocials,
        showTopCourses,
        showQuickNav,
        showLegalLinks
      }
    });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
    onSuccessToast('সেকশন ভিজিবিলিটি, ইমপ্যাক্ট মেট্রিক্স, ডেলিভারি মোড ও ফুটার সেটিংস সফলভাবে সংরক্ষিত ও লাইভ হয়েছে!');
  };

  // Keyboard shortcut Ctrl+S or Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    visibility,
    deliveryEnabled,
    deliveryCards,
    impactEnabled,
    impactTagText,
    impactHeading,
    impactSubtitle,
    impactMetrics,
    roadmapEnabled,
    roadmapTag,
    roadmapTitle,
    roadmapDesc,
    roadmapSteps,
    coursesHeading,
    mentorsHeading,
    blogHeading,
    seminarsHeading,
    galleryHeading,
    reviewsHeading,
    noticesFaqHeading,
    contactHeading,
    verifyCertificateHeading,
    placementsHeading,
    popularTagsString,
    headerSubtitle,
    headerEstText,
    footerBio,
    copyrightText,
    creditsText,
    showSocials,
    showTopCourses,
    showQuickNav,
    showLegalLinks
  ]);

  return (
    <form onSubmit={handleSaveAll} className="space-y-8">
      {/* Top Sticky Quick Save Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-indigo-900/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black shadow-lg shadow-indigo-600/40 text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-sm sm:text-base flex items-center space-x-2">
              <span>Website Sections & Page Plan Hub (সেকশন ও প্ল্যান হাব)</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] uppercase font-bold">
                Live Auto-Sync
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              ১৬টি সেকশন, ডেলিভারি ফরম্যাট, ইমপ্যাক্ট মেট্রিক্স, ভর্তি রোডম্যাপ ও ফুটার কাস্টমাইজেশন সেভ করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleSaveAll()}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              saveFeedback
                ? 'bg-emerald-600 text-white shadow-emerald-600/40 scale-105'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/30 active:scale-95'
            }`}
          >
            {saveFeedback ? <CheckCircle2 className="w-4 h-4 text-emerald-100" /> : <Save className="w-4 h-4" />}
            <span>{saveFeedback ? 'সব সংরক্ষিত হয়েছে (Saved!)' : 'Save All Settings (সব সংরক্ষণ করুন)'}</span>
          </button>
        </div>
      </div>

      {/* Quick Jump Section Links */}
      <div className="bg-slate-100/90 p-2.5 rounded-2xl border border-slate-200/90 overflow-x-auto flex items-center space-x-2 text-xs">
        <span className="text-[11px] font-black text-slate-500 uppercase px-2 shrink-0">দ্রুত সেকশনে যান:</span>
        <a href="#sec-visibility" className="px-3 py-1.5 bg-white hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-bold text-slate-700 shadow-2xs shrink-0 transition-colors">
          👁️ সেকশন ভিজিবিলিটি
        </a>
        <a href="#sec-delivery" className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-xl font-bold text-slate-700 shadow-2xs shrink-0 transition-colors">
          🚀 ডেলিভারি ফরম্যাট
        </a>
        <a href="#sec-impact" className="px-3 py-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-bold text-slate-700 shadow-2xs shrink-0 transition-colors">
          📊 ইমপ্যাক্ট মেট্রিক্স
        </a>
        <a href="#sec-roadmap" className="px-3 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200 rounded-xl font-black shadow-2xs shrink-0 transition-colors flex items-center space-x-1">
          <span>🎓</span>
          <span>ভর্তি রোডম্যাপ ও প্ল্যান (Admission Plan)</span>
        </a>
        <a href="#sec-headings" className="px-3 py-1.5 bg-white hover:bg-purple-50 hover:text-purple-600 rounded-xl font-bold text-slate-700 shadow-2xs shrink-0 transition-colors">
          ✏️ পেজ হেডিংস
        </a>
        <a href="#sec-footer" className="px-3 py-1.5 bg-white hover:bg-slate-200 rounded-xl font-bold text-slate-700 shadow-2xs shrink-0 transition-colors">
          🦶 ওয়েবসাইট ফুটার
        </a>
      </div>

      {/* SECTION 1: GLOBAL SECTION VISIBILITY TOGGLES */}
      <div id="sec-visibility" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <span>Website Sections Visibility Controls (১৬টি সেকশন শো/হাইড কন্ট্রোল)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              যেকোনো সেকশন প্রয়োজন অনুযায়ী চালু বা বন্ধ রাখুন। বন্ধ করলে পাবলিক ওয়েবসাইটে তা লুকানো থাকবে।
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setVisibility({
                heroBanner: true,
                trustStrip: true,
                deliveryModes: true,
                impactTrust: true,
                careerWizard: true,
                courses: true,
                courseComparison: true,
                counselingBanner: true,
                admissionRoadmap: true,
                aboutUs: true,
                mentors: true,
                communityHub: true,
                blog: true,
                seminars: true,
                gallery: true,
                reviews: true,
                studentSuccess: true,
                placements: true,
                hiringPartners: true,
                verifyCertificate: true,
                noticesAndFaq: true,
                geoLocalGuide: true,
                contactAndMap: true,
                footer: true
              })
            }
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Show All Sections (সবগুলো চালু করুন)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { key: 'heroBanner', label: '1. Hero & Upcoming Batches', desc: 'মেইন ব্যানার ও স্লাইডার' },
            { key: 'trustStrip', label: '2. Course Benefits & Trust Grid', desc: 'কোর্স করার ৮টি বিশেষ সুবিধা (Affordable, Job, Portfolio ইত্যাদি)' },
            { key: 'deliveryModes', label: '3. Learning Delivery Modes', desc: '৪টি ফরম্যাট (অফলাইন/অনলাইন)' },
            { key: 'impactTrust', label: '4. Impact & Trust Metrics', desc: '২০,০০০+ স্টুডেন্ট স্ট্যাটস' },
            { key: 'careerWizard', label: '5. Career Path Finder', desc: '৪-ধাপের ক্যারিয়ার চয়েস ও কোর্স ম্যাচিং উইজার্ড' },
            { key: 'courses', label: '6. Courses & Syllabi Grid', desc: 'কোর্স লিস্ট ও ক্যাটাগরি ফিল্টার' },
            { key: 'courseComparison', label: '7. Course Career Comparison', desc: 'কোর্স তুলনা ও ক্যারিয়ার তুলনামূলক এনালাইসিস টেবিল' },
            { key: 'counselingBanner', label: '8. Free Counseling Callback', desc: '১-ক্লিক ক্যারিয়ার কাউন্সেলিং ও কলব্যাক ব্যানার' },
            { key: 'admissionRoadmap', label: '9. Admission Roadmap', desc: 'সহজ ৪টি ধাপে ভর্তি প্রক্রিয়া' },
            { key: 'aboutUs', label: '10. About Us & Leadership', desc: 'সংস্থার মিশন, ভিশন ও ডিরেক্টর বার্তা' },
            { key: 'mentors', label: '11. Faculty & Mentors Showcase', desc: 'মেন্টরস ও এক্সপার্ট শিক্ষক প্যানেল' },
            { key: 'communityHub', label: '12. Community & YouTube Hub', desc: 'ফেসবুক গ্রুপ ও ভিডিও ক্র্যাশ কোর্স' },
            { key: 'blog', label: '13. Blog & Tech Roadmap', desc: 'গাইডলাইন ও রিসোর্স আর্টিকেল' },
            { key: 'seminars', label: '14. Free Career Seminars', desc: 'ফ্রি সেমিনার ও অনলাইন ওয়ার্কশপ' },
            { key: 'gallery', label: '15. Campus Life Photo Gallery', desc: 'ল্যাব ও ক্লাসরুমের বাস্তব ছবি' },
            { key: 'reviews', label: '16. Student Reviews & Ratings', desc: 'শিক্ষার্থীদের স্টার রেটিং ও রিভিউ' },
            { key: 'studentSuccess', label: '17. Student Success & Video Spotlight', desc: 'সফল গ্র্যাজুয়েটদের রিয়েল ইনকাম ও ভিডিও ইন্টারভিউ' },
            { key: 'placements', label: '18. Alumni Job Placements', desc: 'সফল শিক্ষার্থীদের জব ও ফ্রিল্যান্সিং মাইলস্টোন' },
            { key: 'hiringPartners', label: '19. Hiring Partners & Recruiters', desc: 'শীর্ষ আইটি কোম্পানি ও সরকারি স্বীকৃতি লোগো' },
            { key: 'verifyCertificate', label: '20. Certificate Verification', desc: 'ডিজিটাল কিউআর/আইডি যাচাইকরণ' },
            { key: 'noticesAndFaq', label: '21. Notices & FAQ Accordion', desc: 'নোটিশ বোর্ড ও সাধারণ প্রশ্নোত্তর' },
            { key: 'geoLocalGuide', label: '22. Local Area Connectivity Guide', desc: 'ফার্মগেট ও সংলগ্ন এলাকার দূরত্ব ও রুট গাইড' },
            { key: 'contactAndMap', label: '23. Multi-Channel Contact & Map', desc: 'ক্যাম্পাস ঠিকানা ও গুগল ম্যাপ' },
            { key: 'footer', label: '24. Footer & Legal Policies', desc: 'ওয়েবসাইট ফুটার ও পলিসি লিংকস' }
          ].map(sec => {
            const isChecked = visibility[sec.key as keyof WebsiteSectionVisibility] ?? true;
            return (
              <div
                key={sec.key}
                onClick={() => handleToggleSection(sec.key as keyof WebsiteSectionVisibility)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start space-x-3 ${
                  isChecked
                    ? 'bg-indigo-50/50 border-indigo-200 text-slate-900 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h5 className="font-bold text-xs">{sec.label}</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">{sec.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 gap-2">
          <span className="text-xs text-slate-500 font-medium">সেকশন ভিজিবিলিটি অন/অফ পরিবর্তনের পর সংরক্ষণ করতে:</span>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Visibility Settings (ভিজিবিলিটি সেভ করুন)</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: LEARNING DELIVERY FORMATS (4 CARDS) */}
      <div id="sec-delivery" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <Laptop className="w-5 h-5 text-blue-600" />
              <span>Learning Delivery Format Cards (৪টি শিক্ষা পদ্ধতি কার্ড)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              হিরো সেকশনের ঠিক নিচের ৪টি বিশেষ কার্ডের টাইটেল, ব্যাজ ও বিবরণ পরিবর্তন করুন।
            </p>
          </div>
          <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={deliveryEnabled}
              onChange={e => setDeliveryEnabled(e.target.checked)}
              className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Enable Section</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveryCards.map((card, idx) => (
            <div
              key={card.id}
              className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                card.enabled ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-100/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider">
                  Card #{idx + 1}: {card.id.toUpperCase()}
                </span>
                <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.enabled}
                    onChange={e => handleUpdateDeliveryCard(idx, 'enabled', e.target.checked)}
                    className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>Show Card</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Card Title (শিরোনাম)</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={e => handleUpdateDeliveryCard(idx, 'title', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Text (ছোট ব্যাজ)</label>
                  <input
                    type="text"
                    value={card.badge}
                    onChange={e => handleUpdateDeliveryCard(idx, 'badge', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Description (সংক্ষিপ্ত বিবরণ)</label>
                  <textarea
                    rows={2}
                    value={card.description}
                    onChange={e => handleUpdateDeliveryCard(idx, 'description', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Footer Tag Note (নিচের স্ট্যাটাস ট্যাগ)</label>
                  <input
                    type="text"
                    value={card.footerText || ''}
                    onChange={e => handleUpdateDeliveryCard(idx, 'footerText', e.target.value)}
                    placeholder="e.g. Courses Available / Custom Team Upskilling"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 gap-2">
          <span className="text-xs text-slate-500 font-medium">ডেলিভারি মোড কার্ডের যেকোনো পরিবর্তন সংরক্ষণ করতে:</span>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Delivery Format Plans (ডেলিভারি প্ল্যান সেভ করুন)</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: CAREER IMPACT & TRUST METRICS (6 CARDS) */}
      <div id="sec-impact" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Career Impact & Trust Metrics (ইমপ্যাক্ট হেডার ও ৬টি স্ট্যাটস কার্ড)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              "From Beginner to IT Professionals We Close That Gap" শিরোনাম এবং ৬টি মেট্রিক কার্ড (শিক্ষার্থী, ফ্রিল্যান্সার, জব হোল্ডার ইত্যাদি) কাস্টমাইজ করুন।
            </p>
          </div>
          <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={impactEnabled}
              onChange={e => setImpactEnabled(e.target.checked)}
              className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Enable Section</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Top Tag / Badge</label>
            <input
              type="text"
              value={impactTagText}
              onChange={e => setImpactTagText(e.target.value)}
              placeholder="e.g. CAREER IMPACT & TRUST"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-700"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Main Heading (প্রধান শিরোনাম)</label>
            <input
              type="text"
              value={impactHeading}
              onChange={e => setImpactHeading(e.target.value)}
              placeholder="e.g. From Beginner to IT Professionals We Close That Gap."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Subtitle Description (উপশিরোনাম)</label>
            <textarea
              rows={2}
              value={impactSubtitle}
              onChange={e => setImpactSubtitle(e.target.value)}
              placeholder="e.g. অভিজ্ঞ মেন্টরশিপ ও প্রজেক্ট-ভিত্তিক ট্রেনিং এর মাধ্যমে বাংলাদেশের তরুণদের গ্লোবাল ক্যারিয়ার গঠনে আমরা প্রতিশ্রুতিবদ্ধ।"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
            />
          </div>
        </div>

        {/* 6 Metric Cards Editor */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-xs text-slate-800 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>৬টি মেট্রিক কার্ডের তথ্য পরিবর্তন করুন:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {impactMetrics.map((met, idx) => (
              <div key={met.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    Card #{idx + 1}
                  </span>
                  <span className={`text-xs font-black ${met.color || 'text-indigo-600'}`}>
                    {met.metric || '0+'}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Metric Value (সংখ্যা / %)</label>
                  <input
                    type="text"
                    value={met.metric}
                    onChange={e => handleUpdateImpactMetric(idx, 'metric', e.target.value)}
                    placeholder="e.g. 20,000+ / 95%"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Label (ইংরেজি নাম)</label>
                  <input
                    type="text"
                    value={met.label}
                    onChange={e => handleUpdateImpactMetric(idx, 'label', e.target.value)}
                    placeholder="e.g. Successful Students"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtext (বাংলা ক্যাপশন)</label>
                  <input
                    type="text"
                    value={met.subtext}
                    onChange={e => handleUpdateImpactMetric(idx, 'subtext', e.target.value)}
                    placeholder="e.g. সফল শিক্ষার্থী"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Color Theme (কালার)</label>
                  <select
                    value={met.color || 'text-indigo-600'}
                    onChange={e => handleUpdateImpactMetric(idx, 'color', e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold"
                  >
                    <option value="text-indigo-600">Indigo (বেগুনী)</option>
                    <option value="text-emerald-600">Emerald (সবুজ)</option>
                    <option value="text-blue-600">Blue (নীল)</option>
                    <option value="text-amber-500">Amber (হলুদ)</option>
                    <option value="text-rose-500">Rose (গোলাপী/লাল)</option>
                    <option value="text-purple-600">Purple (পার্পল)</option>
                    <option value="text-teal-600">Teal (টিয়াল)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 gap-2">
          <span className="text-xs text-slate-500 font-medium">ইমপ্যাক্ট মেট্রিক্স বা হেডলাইন পরিবর্তনের পর সংরক্ষণ করতে:</span>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Impact & Trust Metrics (মেট্রিক্স সেভ করুন)</span>
          </button>
        </div>
      </div>

      {/* SECTION 4: ADMISSION & ONBOARDING ROADMAP (4 STEPS) */}
      <div id="sec-roadmap" className="bg-white p-6 rounded-3xl border-2 border-emerald-300 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase tracking-wider mb-1">
              <span>Homepage Admission Plan & Roadmap (ভর্তি প্ল্যান হাব)</span>
            </div>
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <Footprints className="w-5 h-5 text-emerald-600" />
              <span>Admission Roadmap & Career Plan (সহজ ৪টি ধাপে ভর্তি ও ক্যারিয়ার শুরুর প্ল্যান)</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              হোমপেজের সহজ ৪টি ধাপে ভর্তি ও ক্যারিয়ার শুরুর প্ল্যান/রোডম্যাপ টেক্সট ও ধাপসমূহ এখান থেকে ম্যানুয়ালি এডিট ও সেভ করুন।
            </p>
          </div>
          <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={roadmapEnabled}
              onChange={e => setRoadmapEnabled(e.target.checked)}
              className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Enable Section</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Top Tag Text (টপ ট্যাগ)</label>
            <input
              type="text"
              value={roadmapTag}
              onChange={e => setRoadmapTag(e.target.value)}
              placeholder="e.g. ভর্তি ও ক্লাস শুরুর প্রক্রিয়া"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Main Heading (প্রধান শিরোনাম)</label>
            <input
              type="text"
              value={roadmapTitle}
              onChange={e => setRoadmapTitle(e.target.value)}
              placeholder="e.g. সহজ ৪টি ধাপে শুরু করুন আপনার আইটি ক্যারিয়ার"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Section Description (বিবরণ)</label>
            <input
              type="text"
              value={roadmapDesc}
              onChange={e => setRoadmapDesc(e.target.value)}
              placeholder="বিবরণ লিখুন..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {roadmapSteps.map((step, idx) => (
            <div key={step.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  {step.stepNumber}
                </span>
                <span className="font-bold text-slate-800 text-xs">ধাপ #{idx + 1}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Step Number (নম্বর)</label>
                  <input
                    type="text"
                    value={step.stepNumber}
                    onChange={e => handleUpdateRoadmapStep(idx, 'stepNumber', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-black text-center"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Step Title (ধাপের শিরোনাম)</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={e => handleUpdateRoadmapStep(idx, 'title', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">Step Description (ধাপের বিস্তারিত)</label>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={e => handleUpdateRoadmapStep(idx, 'description', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-2 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80">
          <div>
            <span className="text-xs text-emerald-950 font-black flex items-center space-x-1.5">
              <span>🎓</span>
              <span>ভর্তি ও ক্যারিয়ার রোডম্যাপ প্ল্যান (Admission Roadmap)</span>
            </span>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              ৪টি ধাপের শিরোনাম বা বিবরণ এডিট করার পর তাৎক্ষণিক সেভ করতে বাটনে চাপুন।
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Admission Roadmap & Plan (ভর্তি প্ল্যান সেভ করুন)</span>
          </button>
        </div>
      </div>

      {/* SECTION 4.5: ACCREDITATION & BTEB TRUST STRIP (6 CARDS) */}
      <div id="sec-truststrip" className="bg-white p-6 rounded-3xl border-2 border-indigo-200 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-black text-[10px] uppercase tracking-wider mb-1">
              <span>Govt. Standard & ISO 9001:2015</span>
            </div>
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Accreditation & Institutional Trust Strip (৬টি প্রাতিষ্ঠানিক সুযোগ-সুবিধা ও স্বীকৃতি কার্ড)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              হোমপেজের BTEB স্ট্যান্ডার্ড, ISO 9001:2015, সিঙ্গেল পিসি ল্যাব, ১০০+ প্লেসমেন্ট পার্টনার, লাইফটাইম সাপোর্ট ও ০% কিস্তি সুবিধার কার্ডগুলোর টাইটেল, ব্যাজ ও আইকন পরিবর্তন করুন।
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={trustStripEnabled}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setTrustStripEnabled(e.target.checked);
                }}
                className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Enable Section</span>
            </label>
            <button
              type="button"
              onClick={handleAddTrustItem}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Card</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {trustStripItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                item.enabled !== false ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-100/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-900 uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200">
                  Card #{idx + 1}
                </span>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-1 text-[11px] font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.enabled !== false}
                      onChange={e => handleUpdateTrustItem(idx, 'enabled', e.target.checked)}
                      className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <span>Active</span>
                  </label>
                  {trustStripItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTrustItem(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Card Title (শিরোনাম)</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={e => handleUpdateTrustItem(idx, 'title', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Subtitle (সংক্ষিপ্ত বিবরণ)</label>
                  <textarea
                    rows={2}
                    value={item.subtitle}
                    onChange={e => handleUpdateTrustItem(idx, 'subtitle', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Badge Text (ব্যাজ)</label>
                    <input
                      type="text"
                      value={item.badge}
                      onChange={e => handleUpdateTrustItem(idx, 'badge', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-xl font-bold text-indigo-600 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Icon (আইকন)</label>
                    <select
                      value={item.iconName || 'Award'}
                      onChange={e => handleUpdateTrustItem(idx, 'iconName', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 text-xs"
                    >
                      <option value="Award">Award (স্বীকৃতি)</option>
                      <option value="ShieldCheck">ShieldCheck (আইএসও/নিরাপত্তা)</option>
                      <option value="Monitor">Monitor (ল্যাব পিসি)</option>
                      <option value="Briefcase">Briefcase (ক্যারিয়ার/জব)</option>
                      <option value="HeartHandshake">HeartHandshake (লাইফটাইম সাপোর্ট)</option>
                      <option value="CreditCard">CreditCard (কিস্তি/পেমেন্ট)</option>
                      <option value="GraduationCap">GraduationCap (গ্র্যাজুয়েট)</option>
                      <option value="Sparkles">Sparkles (বিশেষ)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 gap-2">
          <span className="text-xs text-slate-500 font-medium">BTEB ও ট্রাস্ট স্ট্রিপ কার্ডের পরিবর্তন লাইভ করতে:</span>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Trust Strip Cards (ট্রাস্ট কার্ড সেভ করুন)</span>
          </button>
        </div>
      </div>

      {/* SECTION 4.6: REAL STUDENT SUCCESS VIDEO INTERVIEWS & EARNINGS SPOTLIGHT */}
      <div id="sec-studentsuccess" className="bg-white p-6 rounded-3xl border-2 border-amber-300 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] uppercase tracking-wider mb-1">
              <span>Student Success & Video Proof Manager</span>
            </div>
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <Play className="w-5 h-5 text-amber-600 fill-amber-600" />
              <span>Real Student Success Video Spotlight (সফল শিক্ষার্থীদের ইনকাম ও ভিডিও ইন্টারভিউ)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              শিক্ষার্থীদের বাস্তব ইনকাম প্রুফ (যেমন ৳৫৫,০০০/মাস, $১,৪০০+/মাস), ইউটিউব ভিডিও ইন্টারভিউ, ফাইবার/ব্রেইন স্টেশন প্লেসমেন্ট স্টোরি ও উক্তি এডিট করুন।
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={studentSuccessEnabled}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setStudentSuccessEnabled(e.target.checked);
                }}
                className="rounded-md border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>Enable Section</span>
            </label>
            <button
              type="button"
              onClick={handleAddStudentStory}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Success Story</span>
            </button>
          </div>
        </div>

        {/* Section Header Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Section Tag Text</label>
            <input
              type="text"
              value={studentSuccessTag}
              onChange={e => {
                hasUserEditedRef.current = true;
                setStudentSuccessTag(e.target.value);
              }}
              placeholder="e.g. প্রমাণিত সফলতার প্রমাণ ও স্টুডেন্ট ইন্টারভিউ"
              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-amber-800"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Section Heading</label>
            <input
              type="text"
              value={studentSuccessHeading}
              onChange={e => {
                hasUserEditedRef.current = true;
                setStudentSuccessHeading(e.target.value);
              }}
              placeholder="e.g. আমাদের সফল গ্র্যাজুয়েটদের রিয়েল ইনকাম ও ক্যারিয়ার স্টোরি"
              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-black text-slate-900"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="font-bold text-slate-700 block mb-1">Section Subtitle</label>
            <textarea
              rows={2}
              value={studentSuccessSubtitle}
              onChange={e => {
                hasUserEditedRef.current = true;
                setStudentSuccessSubtitle(e.target.value);
              }}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700"
            />
          </div>
        </div>

        {/* Stories List */}
        <div className="space-y-4">
          {studentSuccessStories.map((story, idx) => (
            <div
              key={story.id || idx}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                story.isActive !== false ? 'bg-slate-50 border-slate-200' : 'bg-slate-100 opacity-60 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                <div className="flex items-center space-x-3">
                  <img
                    src={story.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={story.studentName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-300 shadow-2xs"
                  />
                  <div>
                    <h5 className="font-black text-xs text-slate-950 flex items-center space-x-2">
                      <span>{story.studentName || 'New Student'}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {story.monthlyIncomeOrPackage || '৳০/মাস'}
                      </span>
                    </h5>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {story.courseName} • {story.companyOrPlatform}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={story.isActive !== false}
                      onChange={e => handleUpdateStudentStory(idx, 'isActive', e.target.checked)}
                      className="rounded-md border-slate-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                    />
                    <span>Show on Website</span>
                  </label>
                  {studentSuccessStories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteStudentStory(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student Name (শিক্ষার্থীর নাম)</label>
                  <input
                    type="text"
                    value={story.studentName}
                    onChange={e => handleUpdateStudentStory(idx, 'studentName', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Name (কোর্সের নাম)</label>
                  <input
                    type="text"
                    value={story.courseName}
                    onChange={e => handleUpdateStudentStory(idx, 'courseName', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Platform (কোম্পানি/মার্কেটপ্লেস)</label>
                  <input
                    type="text"
                    value={story.companyOrPlatform}
                    onChange={e => handleUpdateStudentStory(idx, 'companyOrPlatform', e.target.value)}
                    placeholder="e.g. Brain Station 23 / Fiverr Level 2"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-indigo-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Income / Package (মাসিক আয়)</label>
                  <input
                    type="text"
                    value={story.monthlyIncomeOrPackage}
                    onChange={e => handleUpdateStudentStory(idx, 'monthlyIncomeOrPackage', e.target.value)}
                    placeholder="e.g. ৳৫৫,০০০/মাস বা $১,৪০০+"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-emerald-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">YouTube Video Embed / Watch URL</label>
                  <input
                    type="url"
                    value={story.videoEmbedUrl || ''}
                    onChange={e => handleUpdateStudentStory(idx, 'videoEmbedUrl', e.target.value)}
                    placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-xs text-rose-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Avatar Image URL (ছবি লিংক)</label>
                  <input
                    type="url"
                    value={story.avatarUrl}
                    onChange={e => handleUpdateStudentStory(idx, 'avatarUrl', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Achievement Badge (অর্জনের ব্যাজ)</label>
                  <input
                    type="text"
                    value={story.achievementBadge || ''}
                    onChange={e => handleUpdateStudentStory(idx, 'achievementBadge', e.target.value)}
                    placeholder="e.g. 🏆 Full-Time Placement"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-amber-700 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Story Summary (সংক্ষিপ্ত গল্প)</label>
                  <textarea
                    rows={2}
                    value={story.storySummary}
                    onChange={e => handleUpdateStudentStory(idx, 'storySummary', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Student Quote (শিক্ষার্থীর উক্তি)</label>
                  <textarea
                    rows={2}
                    value={story.quote}
                    onChange={e => handleUpdateStudentStory(idx, 'quote', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 text-xs italic"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 gap-2">
          <span className="text-xs text-slate-500 font-medium">স্টুডেন্ট সাকসেস ভিডিও ও ইনকাম স্টোরি লাইভ করতে:</span>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Student Success Stories (স্টোরি সেভ করুন)</span>
          </button>
        </div>
      </div>

      {/* SECTION 4.7: INTERACTIVE TOOLS & COUNSELING CALLBACK BANNER */}
      <div id="sec-interactive-tools" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <span>Interactive Decision Tools & Counseling (ক্যারিয়ার উইজার্ড, কোর্স তুলনা ও কাউন্সেলিং ব্যানার)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            হোমপেজের ক্যারিয়ার চয়েস উইজার্ড, দুই কোর্সের তুলনামূলক এনালাইসিস টেবিল এবং ১-ক্লিক ফ্রি কাউন্সেলিং কলব্যাক ব্যানারের শিরোনাম ও মেসেজ পরিবর্তন করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Tool 1: Career Path Finder */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-900 font-black">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Career Path Finder (উইজার্ড)</span>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Top Tag</label>
              <input
                type="text"
                value={careerWizardTag}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setCareerWizardTag(e.target.value);
                }}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-indigo-700"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Heading (শিরোনাম)</label>
              <input
                type="text"
                value={careerWizardHeading}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setCareerWizardHeading(e.target.value);
                }}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-black text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Subtitle (বিবরণ)</label>
              <textarea
                rows={3}
                value={careerWizardSubtitle}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setCareerWizardSubtitle(e.target.value);
                }}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 text-xs"
              />
            </div>
          </div>

          {/* Tool 2: Course Comparison */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-blue-900 font-black">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Course Comparison (তুলনা টেবিল)</span>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Top Tag</label>
              <input
                type="text"
                value={courseComparisonTag}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setCourseComparisonTag(e.target.value);
                }}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-blue-700"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Heading (শিরোনাম)</label>
              <input
                type="text"
                value={courseComparisonHeading}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setCourseComparisonHeading(e.target.value);
                }}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-black text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Subtitle (বিবরণ)</label>
              <textarea
                rows={3}
                value={courseComparisonSubtitle}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setCourseComparisonSubtitle(e.target.value);
                }}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 text-xs"
              />
            </div>
          </div>

          {/* Tool 3: Free Counseling Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-rose-900 font-black">
              <Phone className="w-4 h-4 text-rose-600" />
              <span>Free Counseling Banner (কলব্যাক ব্যানার)</span>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Top Tag</label>
              <input
                type="text"
                value={counselingBannerTag}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setCounselingBannerTag(e.target.value);
                }}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-rose-700"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Title (শিরোনাম)</label>
              <input
                type="text"
                value={counselingBannerTitle}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setCounselingBannerTitle(e.target.value);
                }}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-black text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Subtitle (বিবরণ)</label>
              <textarea
                rows={3}
                value={counselingBannerSubtitle}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setCounselingBannerSubtitle(e.target.value);
                }}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 gap-2">
          <span className="text-xs text-slate-500 font-medium">ইন্টারেক্টিভ টুলস ও কাউন্সেলিং ব্যানার তথ্য সংরক্ষণ করতে:</span>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Interactive Tools (টুলস সেভ করুন)</span>
          </button>
        </div>
      </div>

      {/* SECTION 5: CUSTOMIZABLE SECTION HEADINGS */}
      <div id="sec-headings" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
            <Type className="w-5 h-5 text-purple-600" />
            <span>Section Headings & Subtitles (কোর্স, মেন্টর, ব্লগ ও সেমিনার হেডার কাস্টমাইজেশন)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            হোমপেজের বিভিন্ন সেকশনের প্রধান শিরোনাম ও সাবটাইটেল আপনার প্রতিষ্ঠানের ব্র্যান্ড ভয়েস অনুযায়ী পরিবর্তন করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Website Header Subtitle & Est. Badge */}
          <div className="p-4.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/90 space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                Website Header Subtitle & Tagline (লোগো ও নামের নিচের সাবটাইটেল)
              </h4>
            </div>
            <p className="text-[11px] text-slate-600">
              ওয়েবসাইটের একদম উপরে নেভিগেশন বারে প্রতিষ্ঠানের নামের নিচে প্রদর্শিত ক্যাম্পাস, স্লোগান ও প্রতিষ্ঠার সাল সহজে পরিবর্তন করুন।
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                  Header Subtitle / Tagline (ক্যাম্পাস ও স্লোগান টেক্সট)
                </label>
                <input
                  type="text"
                  value={headerSubtitle}
                  onChange={e => {
                    hasUserEditedRef.current = true;
                    setHeaderSubtitle(e.target.value);
                  }}
                  placeholder="e.g. Farmgate Campus • Govt. Standard IT Training & Career Incubator"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                  Established Badge Text (প্রতিষ্ঠার সাল ব্যাজ)
                </label>
                <input
                  type="text"
                  value={headerEstText}
                  onChange={e => {
                    hasUserEditedRef.current = true;
                    setHeaderEstText(e.target.value);
                  }}
                  placeholder="e.g. EST. 2018"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-indigo-700 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Courses Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Courses Section Header (কোর্স সেকশন)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Top Badge</label>
              <input
                type="text"
                value={coursesHeading.tagText || ''}
                onChange={e => setCoursesHeading(prev => ({ ...prev, tagText: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-indigo-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={coursesHeading.heading || ''}
                onChange={e => setCoursesHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle</label>
              <input
                type="text"
                value={coursesHeading.subtitle || ''}
                onChange={e => setCoursesHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Mentors Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Mentors Section Header (শিক্ষক ও মেন্টর সেকশন)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Top Badge</label>
              <input
                type="text"
                value={mentorsHeading.tagText || ''}
                onChange={e => setMentorsHeading(prev => ({ ...prev, tagText: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-blue-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={mentorsHeading.heading || ''}
                onChange={e => setMentorsHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle</label>
              <input
                type="text"
                value={mentorsHeading.subtitle || ''}
                onChange={e => setMentorsHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Blog Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Blog & Resource Articles Header (ব্লগ সেকশন)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Top Badge</label>
              <input
                type="text"
                value={blogHeading.tagText || ''}
                onChange={e => setBlogHeading(prev => ({ ...prev, tagText: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-amber-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={blogHeading.heading || ''}
                onChange={e => setBlogHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle</label>
              <input
                type="text"
                value={blogHeading.subtitle || ''}
                onChange={e => setBlogHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Seminars Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>Career Seminars Header (ফ্রি সেমিনার সেকশন)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Top Badge</label>
              <input
                type="text"
                value={seminarsHeading.tagText || ''}
                onChange={e => setSeminarsHeading(prev => ({ ...prev, tagText: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-rose-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={seminarsHeading.heading || ''}
                onChange={e => setSeminarsHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle</label>
              <input
                type="text"
                value={seminarsHeading.subtitle || ''}
                onChange={e => setSeminarsHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Gallery Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <span>Gallery Section Header (গ্যালারি সেকশন)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Top Badge</label>
              <input
                type="text"
                value={galleryHeading.tagText || ''}
                onChange={e => setGalleryHeading(prev => ({ ...prev, tagText: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-purple-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={galleryHeading.heading || ''}
                onChange={e => setGalleryHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle</label>
              <input
                type="text"
                value={galleryHeading.subtitle || ''}
                onChange={e => setGalleryHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Reviews Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Reviews Section Header (শিক্ষার্থী প্রশংসাপত্র)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Top Badge</label>
              <input
                type="text"
                value={reviewsHeading.tagText || ''}
                onChange={e => setReviewsHeading(prev => ({ ...prev, tagText: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-amber-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={reviewsHeading.heading || ''}
                onChange={e => setReviewsHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle</label>
              <input
                type="text"
                value={reviewsHeading.subtitle || ''}
                onChange={e => setReviewsHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Placements Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Placements Section Header (ক্যারিয়ার প্লেসমেন্ট)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Top Badge</label>
              <input
                type="text"
                value={placementsHeading.tagText || ''}
                onChange={e => setPlacementsHeading(prev => ({ ...prev, tagText: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-emerald-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={placementsHeading.heading || ''}
                onChange={e => setPlacementsHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle</label>
              <input
                type="text"
                value={placementsHeading.subtitle || ''}
                onChange={e => setPlacementsHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Notice Board Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>Notice Board Header (একাডেমিক নোটিশ বোর্ড)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Notice Heading</label>
              <input
                type="text"
                value={noticesFaqHeading.noticeHeading || ''}
                onChange={e => setNoticesFaqHeading(prev => ({ ...prev, noticeHeading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Notice Subtitle</label>
              <input
                type="text"
                value={noticesFaqHeading.noticeSubtitle || ''}
                onChange={e => setNoticesFaqHeading(prev => ({ ...prev, noticeSubtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* FAQs Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              <span>FAQ Section Header (সচরাচর জিজ্ঞাসা)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">FAQ Heading</label>
              <input
                type="text"
                value={noticesFaqHeading.faqHeading || ''}
                onChange={e => setNoticesFaqHeading(prev => ({ ...prev, faqHeading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">FAQ Subtitle</label>
              <input
                type="text"
                value={noticesFaqHeading.faqSubtitle || ''}
                onChange={e => setNoticesFaqHeading(prev => ({ ...prev, faqSubtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Contact Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Contact & Campus Location Header (যোগাযোগ সেকশন)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={contactHeading.heading || ''}
                onChange={e => setContactHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle / Note</label>
              <input
                type="text"
                value={contactHeading.subtitle || ''}
                onChange={e => setContactHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Verify Certificate Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Certificate Verification Header (সার্টিফিকেট ভেরিফিকেশন)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Top Badge</label>
              <input
                type="text"
                value={verifyCertificateHeading.tagText || ''}
                onChange={e => setVerifyCertificateHeading(prev => ({ ...prev, tagText: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-teal-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={verifyCertificateHeading.heading || ''}
                onChange={e => setVerifyCertificateHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle</label>
              <input
                type="text"
                value={verifyCertificateHeading.subtitle || ''}
                onChange={e => setVerifyCertificateHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Popular Search Tags Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 md:col-span-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <Search className="w-4 h-4 text-amber-500" />
              <span>Hero Search "Popular Tags" (হিরো সার্চের নিচে জনপ্রিয় কি-ওয়ার্ডস)</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              কমা (,) দিয়ে আলাদা করে কি-ওয়ার্ড লিখুন। যেমন: Graphic Design, Web Development, Video Editing, AI & Python
            </p>
            <input
              type="text"
              value={popularTagsString}
              onChange={e => {
                hasUserEditedRef.current = true;
                setPopularTagsString(e.target.value);
              }}
              placeholder="e.g. AutoCAD 2D/3D, Video Editing, Digital Marketing, Graphic Design, Web Development, French Language, AI Automation, Advanced Excel, Freelancing"
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-xs"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 gap-2">
          <span className="text-xs text-slate-500 font-medium">হেডিংস ও সার্চ ট্যাগ পরিবর্তনের পর সংরক্ষণ করতে:</span>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Section Headings & Tags (হেডিংস সেভ করুন)</span>
          </button>
        </div>
      </div>

      {/* SECTION 6: DYNAMIC FOOTER CONFIGURATION */}
      <div id="sec-footer" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>Website Footer Customization (ফুটার কাস্টমাইজেশন)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            পাবলিক ওয়েবসাইটের নিচের ফুটার টেক্সট, বায়ো, কপিরাইট এবং কলাম অপশন কনফিগার করুন।
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Institute Bio / Tagline in Footer</label>
            <textarea
              rows={2}
              value={footerBio}
              onChange={e => {
                hasUserEditedRef.current = true;
                setFooterBio(e.target.value);
              }}
              placeholder="e.g. Premier professional IT training organization dedicated to creating industry-grade developers..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Copyright Statement</label>
              <input
                type="text"
                value={copyrightText}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setCopyrightText(e.target.value);
                }}
                placeholder={`© ${new Date().getFullYear()} Nexgen Computer Academy. All Rights Reserved.`}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Credits / System Line</label>
              <input
                type="text"
                value={creditsText}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setCreditsText(e.target.value);
                }}
                placeholder="Empowered by NexGen Multi-Campus ERP & Centralized CMS Engine."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showSocials}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setShowSocials(e.target.checked);
                }}
                className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Social Icons</span>
            </label>

            <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showTopCourses}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setShowTopCourses(e.target.checked);
                }}
                className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Top Courses Column</span>
            </label>

            <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showQuickNav}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setShowQuickNav(e.target.checked);
                }}
                className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Quick Navigation Column</span>
            </label>

            <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showLegalLinks}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setShowLegalLinks(e.target.checked);
                }}
                className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Legal Policies Column</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 gap-2">
          <span className="text-xs text-slate-500 font-medium">ফুটার টেক্সট ও কলাম অপশন সেভ করতে:</span>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Footer Settings (ফুটার সেভ করুন)</span>
          </button>
        </div>
      </div>

      {/* Global Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Sections, Roadmaps & Footer Settings</span>
        </button>
      </div>

      {/* Floating Persistent Quick Save Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-2xl shadow-2xl border border-indigo-500/40 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="hidden sm:flex flex-col pr-1 text-right">
          <span className="text-[11px] font-black text-indigo-300">দ্রুত সেভ করুন</span>
          <span className="text-[9px] text-slate-400">Ctrl + S অথবা বাটনে চাপুন</span>
        </div>
        <button
          type="button"
          onClick={() => handleSaveAll()}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
        >
          {saveFeedback ? <CheckCircle2 className="w-4 h-4 text-emerald-100" /> : <Save className="w-4 h-4" />}
          <span>{saveFeedback ? 'সব সংরক্ষিত হয়েছে (Saved!)' : 'Save All Changes (সংরক্ষণ করুন)'}</span>
        </button>
      </div>
    </form>
  );
};
