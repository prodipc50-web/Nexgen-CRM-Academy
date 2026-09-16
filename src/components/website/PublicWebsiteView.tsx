import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAcademy } from '../../context/AcademyContext';
import { NexgenLogo } from '../common/NexgenLogo';
import { CertificateVerificationSection } from './CertificateVerificationSection';
import { OnlineAdmissionModal } from './OnlineAdmissionModal';
import { SeminarRegistrationModal } from './SeminarRegistrationModal';
import { CourseDetailsModal } from './CourseDetailsModal';
import { BlogPostModal } from './BlogPostModal';
import { PolicyViewerModal } from './PolicyViewerModal';
import { MobileNavDrawer } from './MobileNavDrawer';
import { TopOfferRibbon } from './TopOfferRibbon';
import { LeadCapturePopupModal } from './LeadCapturePopupModal';
import { HiringPartnersSection } from './HiringPartnersSection';
import { FloatingActionWidget } from './FloatingActionWidget';
import { SyllabusDownloadModal } from './SyllabusDownloadModal';
import { CampusTourModal } from './CampusTourModal';
import { SocialProofTicker } from './SocialProofTicker';
import { PlacementsShowcaseSection } from './PlacementsShowcaseSection';
import { CampusLocationMapBox } from './CampusLocationMapBox';
import {
  Home,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Award,
  Users,
  Star,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ExternalLink,
  Lock,
  Layers,
  Monitor,
  Briefcase,
  LifeBuoy,
  Zap,
  Sliders,
  Image as ImageIcon,
  HelpCircle,
  Bell,
  Search,
  LogIn,
  Share2,
  Youtube,
  FileText,
  Building,
  GraduationCap,
  HeartHandshake,
  Check,
  Menu,
  X,
  Video,
  Radio,
  PlaySquare,
  Filter,
  Sparkle,
  Navigation,
  MessageSquare,
  Compass,
  Laptop,
  Edit,
  ChevronRight,
  Download,
  Flame,
  Building2
} from 'lucide-react';
import { Course, SeminarWorkshop, WebsiteGalleryItem, WebsiteBlogPost, AppLanguage, WebsiteSectionVisibility } from '../../types';
import { HeroBannerSlider } from './HeroBannerSlider';
import { TopNoticeTickerModal } from './TopNoticeTickerModal';
import { getTranslation } from '../../utils/translations';
import {
  trackMetaPixelEvent,
  getCapturedUtmParams,
  getDeviceType
} from '../../utils/analyticsTracker';
import { getWhatsAppDirectUrl } from '../../utils/whatsappHelper';
import { getHomepageSeoMetadata, applySeoMetadata } from '../../utils/seoHelper';

interface PublicWebsiteViewProps {
  onOpenStaffLogin: () => void;
  onOpenCmsAdmin?: () => void;
  onOpenStudentPortal?: () => void;
}

export const PublicWebsiteView: React.FC<PublicWebsiteViewProps> = ({
  onOpenStaffLogin,
  onOpenCmsAdmin,
  onOpenStudentPortal
}) => {
  const {
    courses,
    categories,
    seminars,
    websiteCmsConfig,
    trainersList,
    websiteReviews,
    websiteGallery,
    websiteNotices,
    websiteFaqs,
    websiteBlogs,
    academySettings,
    isAuthenticated,
    addLead,
    submitPublicLead,
    batches,
    placements
  } = useAcademy();

  // Bilingual Language State
  const [language, setLanguage] = useState<AppLanguage>('bn');

  // Active Filters for Course Section
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<'All' | 'Offline' | 'Online' | 'Pre Recorded'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>('');
  const [activeGalleryCategory, setActiveGalleryCategory] = useState<string>('All');
  const [selectedBlogCategory, setSelectedBlogCategory] = useState<string>('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Delivery Mode Counts
  const offlineCoursesCount = courses.filter(c => (c.courseType || 'Offline') === 'Offline').length;
  const onlineCoursesCount = courses.filter(c => c.courseType === 'Online').length;
  const preRecordedCoursesCount = courses.filter(c => c.courseType === 'Pre Recorded').length;

  // Modals State
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [selectedCourseForAdmission, setSelectedCourseForAdmission] = useState<Course | null>(null);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState<Course | null>(null);
  const [isCampusTourOpen, setIsCampusTourOpen] = useState(false);
  const [activeSeminarForReg, setActiveSeminarForReg] = useState<SeminarWorkshop | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<WebsiteGalleryItem | null>(null);
  const [selectedBlogForReading, setSelectedBlogForReading] = useState<WebsiteBlogPost | null>(null);
  const [activePolicyModal, setActivePolicyModal] = useState<'terms' | 'privacy' | 'refund' | 'conduct' | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [isTopNoticeModalOpen, setIsTopNoticeModalOpen] = useState(false);

  // Auto-apply dynamic Homepage SEO metadata, Canonical URL & JSON-LD Schemas
  React.useEffect(() => {
    const seoMeta = getHomepageSeoMetadata(academySettings, websiteCmsConfig);
    applySeoMetadata(seoMeta);
  }, [academySettings, websiteCmsConfig]);

  // Auto-capture UTM params and fire Meta Pixel PageView
  React.useEffect(() => {
    const utms = getCapturedUtmParams();
    const pixelId = websiteCmsConfig?.marketing?.metaPixelId;
    if (websiteCmsConfig?.marketing?.metaPixelEnabled) {
      trackMetaPixelEvent('PageView', {
        page_title: 'Nexgen Academy - IT Training Institute',
        url: window.location.href,
        ...utms
      }, pixelId);
    }

    // Exit intent handler (mouse leaves top boundary on desktop)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !sessionStorage.getItem('nca_exit_intent_dismissed')) {
        if (websiteCmsConfig?.marketing?.enableExitIntentPopup) {
          setShowExitIntent(true);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [websiteCmsConfig?.marketing?.metaPixelEnabled, websiteCmsConfig?.marketing?.metaPixelId]);

  // Filtered Courses
  const filteredCourses = courses.filter(c => {
    // Delivery mode filter
    if (selectedDeliveryMode !== 'All') {
      const mode = c.courseType || 'Offline';
      if (mode.toLowerCase() !== selectedDeliveryMode.toLowerCase()) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && selectedCategory !== 'Next Upcoming') {
      if (c.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    }

    // Search Query filter
    if (courseSearchQuery.trim()) {
      const q = courseSearchQuery.toLowerCase().trim();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchCode = (c.code || '').toLowerCase().includes(q) || (c.badgeText || '').toLowerCase().includes(q);
      const matchCat = (c.category || '').toLowerCase().includes(q);
      const matchDesc = (c.description || '').toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchCat && !matchDesc) return false;
    }

    return true;
  });

  // Filtered Gallery
  const galleryCategories = ['All', 'Classroom & Labs', 'Certification Ceremony', 'Workshops & Events', 'Success Stories'];
  const filteredGallery = websiteGallery.filter(g => {
    if (activeGalleryCategory === 'All') return true;
    return g.category === activeGalleryCategory;
  });

  // Filtered Blogs
  const blogCategories = ['All', 'Career & Tech', 'Web & Software', 'AI & Machine Learning', 'Cyber Security', 'Student Spotlight'];
  const filteredBlogs = (websiteBlogs || []).filter(b => {
    if (b.isPublished === false) return false;
    if (selectedBlogCategory === 'All') return true;
    return b.category === selectedBlogCategory;
  });

  const handleOpenEnroll = (course: Course) => {
    setSelectedCourseForAdmission(course);
    setIsAdmissionOpen(true);
    trackMetaPixelEvent('InitiateCheckout', {
      content_name: course.name,
      content_category: course.category,
      content_ids: [course.id],
      value: course.offerFee || course.regularFee || 0,
      currency: 'BDT'
    }, websiteCmsConfig?.marketing?.metaPixelId);
  };

  const handleOpenCourseDetails = (course: Course) => {
    setSelectedCourseForDetails(course);
    trackMetaPixelEvent('ViewContent', {
      content_name: course.name,
      content_category: course.category,
      content_ids: [course.id],
      value: course.offerFee || course.regularFee || 0,
      currency: 'BDT'
    }, websiteCmsConfig?.marketing?.metaPixelId);
  };

  const handleOpenSeminar = (seminar: SeminarWorkshop) => {
    setActiveSeminarForReg(seminar);
    trackMetaPixelEvent('Lead', {
      content_name: seminar.title,
      content_category: 'Seminar Registration'
    }, websiteCmsConfig?.marketing?.metaPixelId);
  };

  const socials = websiteCmsConfig.socialLinks || {
    facebookPageUrl: 'https://facebook.com',
    facebookGroupUrl: 'https://facebook.com/groups',
    facebookGroupName: `${academySettings.instituteName || 'IT Training'} Tech Career Community`,
    facebookGroupMembersCount: '18,500+ Members',
    youtubeChannelUrl: 'https://youtube.com',
    youtubeFeaturedVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    youtubeVideoTitle: `${academySettings.instituteName || 'Campus'} Experience & Student Success Stories`,
    whatsappSupportNumber: academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444',
    whatsappCommunityUrl: 'https://chat.whatsapp.com',
    linkedinUrl: 'https://linkedin.com',
    instagramUrl: 'https://instagram.com',
    telegramUrl: 'https://t.me',
    tiktokUrl: ''
  };

  const about = websiteCmsConfig.aboutUs || {
    storyTitle: 'Pioneering Industry-Driven Tech Education',
    storyDescription: `${academySettings.instituteName || 'Our Academy'} was established with a singular mission: bridging the gap between textbook academic theory and real-world software engineering and digital skills in Bangladesh.`,
    mission: 'To empower 50,000+ Bangladeshi youth with market-ready software engineering, cloud computing, and AI skills by 2030.',
    vision: 'To be South Asia\'s premier hands-on tech vocational academy and talent incubator.',
    directorMessage: 'We believe genuine professional competence is forged in the lab through real production projects and relentless debugging, not multiple-choice rote tests.',
    directorName: academySettings.idCardSignatoryName || 'Chief Academic Director',
    directorTitle: academySettings.idCardSignatoryTitle || 'Founder & Academic Director',
    directorPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    establishedYear: '2018',
    affiliations: ['ISO 9001:2015 Certified', 'BASIS Member Institute', 'BTEB Approved Center', 'National Skill Development Partner'],
    facilityHighlights: [
      { title: 'Gigabit Network', desc: 'High-speed Dedicated Fiber Gigabit Network', icon: 'zap' },
      { title: 'Dual Workstations', desc: 'Individual Dual-Monitor Workstations', icon: 'monitor' },
      { title: 'Cloud Sandbox', desc: '24/7 Smart Lab Access & Cloud Sandbox', icon: 'cloud' },
      { title: 'Multimedia Halls', desc: 'Air Conditioned Multimedia Seminar Halls', icon: 'speaker' }
    ]
  };

  const multiplePhones = websiteCmsConfig.multiplePhones?.length > 0
    ? websiteCmsConfig.multiplePhones
    : [
        { id: '1', number: academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444', label: 'Main Admission Hotline', isHotline: true, isWhatsapp: true },
        { id: '2', number: academySettings.helplines?.[1] || '+880 1711-223344', label: 'Career Counseling Desk', isHotline: false, isWhatsapp: true },
        { id: '3', number: academySettings.helplines?.[2] || '+880 1811-556677', label: 'Student Support & Exam Cell', isHotline: false, isWhatsapp: false }
      ];

  const multipleEmails = websiteCmsConfig.multipleEmails?.length > 0
    ? websiteCmsConfig.multipleEmails
    : [
        { id: '1', email: academySettings.officialEmail || 'admissions@academy.edu.bd', label: 'Admission & Registration' },
        { id: '2', email: academySettings.officialEmail || 'info@academy.edu.bd', label: 'General Inquiry & Campus Tour' },
        { id: '3', email: academySettings.officialEmail || 'corporate@academy.edu.bd', label: 'Corporate Training & Hiring Partnerships' }
      ];

  const officeAddress = websiteCmsConfig.officeAddress || academySettings.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215, Bangladesh';
  const campusDirections = websiteCmsConfig.campusDirections || 'Located 2 minutes walk from Farmgate Metro Station (Exit 3), opposite to Green Super Market.';
  const officeHours = websiteCmsConfig.officeHours || 'Saturday to Friday: 9:00 AM - 8:30 PM';
  const googleMapEmbedUrl = websiteCmsConfig.googleMapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848881261358!2d90.3887!3d23.7527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ1JzA5LjciTiA5MMKwMjMnMTkuMyJF!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd';

  const sectionVisibility: Partial<WebsiteSectionVisibility> = websiteCmsConfig.sectionVisibility || {};
  const deliveryConfig = websiteCmsConfig.deliveryModesConfig;
  const deliveryCards = deliveryConfig?.cards || [];
  const offlineCard = deliveryCards.find(c => c.id === 'offline');
  const onlineCard = deliveryCards.find(c => c.id === 'online');
  const recordedCard = deliveryCards.find(c => c.id === 'recorded');
  const corporateCard = deliveryCards.find(c => c.id === 'corporate');
  const roadmapConfig = websiteCmsConfig.admissionRoadmap;
  const communityHubConfig = websiteCmsConfig.communityHub;
  const footerConfig = websiteCmsConfig.footerConfig;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-website-body antialiased selection:bg-indigo-600 selection:text-white flex flex-col">
      {/* TOP STICKY OFFER RIBBON (CMS MANAGED) */}
      <TopOfferRibbon
        config={websiteCmsConfig.topOfferRibbon}
        onOpenAdmission={() => setIsAdmissionOpen(true)}
        onScrollToCourses={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
        whatsappNumber={websiteCmsConfig.floatingActionWidget?.whatsappNumber || academySettings.primarySupportPhone}
      />

      {/* PROMO BANNER (FALLBACK IF TOP RIBBON IS DISABLED) */}
      {!websiteCmsConfig.topOfferRibbon?.enabled && websiteCmsConfig.promoBanner?.enabled && (
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-white text-xs py-2 px-4 text-center font-bold flex items-center justify-center space-x-2 shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{websiteCmsConfig.promoBanner.title || 'Special 40% Scholarship Discount for New Students!'}</span>
          {websiteCmsConfig.promoBanner.discountCode && (
            <span className="bg-white/20 border border-white/40 px-2 py-0.5 rounded-md font-mono text-[11px]">
              Code: {websiteCmsConfig.promoBanner.discountCode}
            </span>
          )}
        </div>
      )}

      {/* 1. TOP ANNOUNCEMENT BAR & MULTI-HOTLINES */}
      <div className="bg-slate-950 text-slate-300 text-xs border-b border-slate-800">
        <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Ticker / Notice */}
          <div className="flex items-center space-x-2 overflow-hidden text-[11px] sm:text-xs">
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Notice
            </span>
            <span className="truncate text-slate-300">
              {websiteCmsConfig.topNoticeTicker || 'Admission open for upcoming weekend & evening batches!'}
            </span>
            <button
              type="button"
              onClick={() => setIsTopNoticeModalOpen(true)}
              className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors shrink-0"
              title="এডিট করুন: টপ নোটিশ ও প্রমো ব্যানার (Edit Notice Ticker & Promo Banner)"
            >
              <Edit className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Contact & Staff Access */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 text-xs">
            <a
              href={`tel:${multiplePhones[0]?.number || academySettings.primarySupportPhone || '01798444444'}`}
              className="flex items-center space-x-1 hover:text-amber-400 font-bold transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden md:inline">Hotline: {multiplePhones[0]?.number || academySettings.primarySupportPhone || '01798444444'}</span>
              <span className="md:hidden">{multiplePhones[0]?.number || academySettings.primarySupportPhone || '01798444444'}</span>
            </a>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Language Switcher (EN / BN) */}
            <button
              type="button"
              onClick={() => setLanguage(l => (l === 'bn' ? 'en' : 'bn'))}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-lg border border-slate-700 transition-colors flex items-center space-x-1 whitespace-nowrap shrink-0 cursor-pointer"
              title="Toggle Language / ভাষা পরিবর্তন"
            >
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Student Self-Service Portal Button */}
            {onOpenStudentPortal && (
              <button
                type="button"
                onClick={onOpenStudentPortal}
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-700/50 rounded-lg transition-colors font-bold whitespace-nowrap shrink-0 cursor-pointer"
                title="Student ID, Ledger & Certificate Portal"
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{language === 'bn' ? 'স্টুডেন্ট পোর্টাল' : 'Student Portal'}</span>
              </button>
            )}

            {/* Staff / Admin Portal Button */}
            <button
              type="button"
              onClick={onOpenStaffLogin}
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-lg transition-colors font-bold whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{isAuthenticated ? 'ERP Portal' : 'Staff Login'}</span>
            </button>

            {/* Quick Admin CMS Edit Button (If logged in) */}
            {isAuthenticated && onOpenCmsAdmin && (
              <button
                type="button"
                onClick={onOpenCmsAdmin}
                className="flex items-center space-x-1 px-2 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 rounded-lg transition-colors font-bold"
                title="Edit website texts, courses & gallery in CMS"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CMS</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Institute Identity */}
          <div
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer min-w-0 flex-1 sm:flex-initial"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="p-1 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs shrink-0">
              <NexgenLogo variant="crest" size={40} />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 leading-tight truncate">
                {academySettings.instituteName || 'Nexgen Computer Academy'}
              </h1>
              <p className="text-xs text-slate-600 font-medium truncate">
                {academySettings.campusName || 'Farmgate Campus'} • Govt. Standard IT Institute
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-3.5 2xl:space-x-4 text-sm font-bold text-slate-700">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-indigo-600 transition-colors flex items-center space-x-1 text-slate-900 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg whitespace-nowrap"
            >
              <Home className="w-4 h-4 text-indigo-600" />
              <span>Home (হোম)</span>
            </a>
            <a href="#courses" className="hover:text-indigo-600 transition-colors whitespace-nowrap">Courses (কোর্স)</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors whitespace-nowrap">About Us</a>
            {sectionVisibility.mentors !== false && (
              <a href="#mentors" className="hover:text-indigo-600 transition-colors whitespace-nowrap">Mentors</a>
            )}
            <a href="#community" className="hover:text-indigo-600 transition-colors flex items-center space-x-1 text-blue-700 whitespace-nowrap">
              <Users className="w-4 h-4" />
              <span>Community</span>
            </a>
            <a href="#seminars" className="hover:text-indigo-600 transition-colors flex items-center space-x-1 whitespace-nowrap">
              <span>Free Seminars</span>
              <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full text-[10px] font-black">Free</span>
            </a>
            <a href="#blog" className="hover:text-indigo-600 transition-colors whitespace-nowrap">Blog</a>
            <a href="#gallery" className="hover:text-indigo-600 transition-colors whitespace-nowrap">Gallery</a>
            <a href="#reviews" className="hover:text-indigo-600 transition-colors whitespace-nowrap">Reviews</a>
            {sectionVisibility.placements !== false && (
              <a href="#placements" className="hover:text-emerald-600 transition-colors flex items-center space-x-1 text-emerald-700 whitespace-nowrap">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Placements</span>
              </a>
            )}
            <a href="#verify-certificate" className="hover:text-indigo-600 transition-colors flex items-center space-x-1 text-emerald-700 whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify</span>
            </a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors whitespace-nowrap">Contact</a>
          </nav>

          {/* Right Action Controls: Campus Tour + Online Admission CTA + Mobile Hamburger */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsCampusTourOpen(true)}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors whitespace-nowrap cursor-pointer"
              title="Book Free 1-on-1 Campus Tour & Lab Visit"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>ক্যাম্পাস ভিজিট</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCourseForAdmission(null);
                setIsAdmissionOpen(true);
              }}
              className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-1.5 active:scale-95 whitespace-nowrap shrink-0"
              title="Online Admission Application Portal"
            >
              <Zap className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-300 shrink-0" />
              <span className="hidden xs:inline">Online Admission</span>
              <span className="xs:hidden">Admission</span>
              <span className="hidden sm:inline"> (ভর্তি)</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              aria-expanded={isMobileMenuOpen}
              className="xl:hidden w-11 h-11 rounded-xl text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 transition-all flex items-center justify-center active:scale-95 shrink-0"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        academySettings={academySettings}
        websiteCmsConfig={websiteCmsConfig}
        coursesCount={courses.length}
        seminarsCount={seminars.length}
        onOpenAdmission={() => {
          setSelectedCourseForAdmission(null);
          setIsAdmissionOpen(true);
        }}
        onOpenStaffLogin={onOpenStaffLogin}
        onOpenCmsAdmin={onOpenCmsAdmin}
        isAuthenticated={isAuthenticated}
        onSelectDeliveryMode={(mode) => {
          setSelectedDeliveryMode(mode);
        }}
      />

      {/* 3. HERO BANNER SECTION WITH DYNAMIC MULTI-SLIDE CAROUSEL */}
      {sectionVisibility.heroBanner !== false && (
        <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-8 sm:py-12 lg:py-14 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-8">
          {/* Dynamic 16:9 Multi-Slide Carousel Banner */}
          <HeroBannerSlider
            slides={websiteCmsConfig.heroSlides || []}
            language={language}
            fallbackHeadline={websiteCmsConfig.heroHeadline}
            fallbackSubtitle={websiteCmsConfig.heroSubtitle}
            onOpenAdmission={() => {
              setSelectedCourseForAdmission(null);
              setIsAdmissionOpen(true);
            }}
          />

          {/* Quick Search, Stats & Featured Batches Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch pt-2">
            {/* Left Box: Quick Course Finder & Live Key Stats (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {language === 'bn' ? 'কোর্স খুঁজুন ও ক্যারিয়ার গাইডেন্স' : 'Search Courses & Career Guidance'}
                  </h3>
                </div>

                {/* Hero Search & Category Quick Filter Bar */}
                <div className="bg-slate-800/90 border border-slate-700 p-2 sm:p-2.5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 shrink-0 min-h-[44px]">
                    <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        const el = document.getElementById('courses');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-transparent text-xs sm:text-sm font-bold text-slate-200 focus:outline-none cursor-pointer w-full sm:w-auto"
                    >
                      <option value="All" className="bg-slate-900 text-white">All Categories (সব বিভাগ)</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 flex items-center space-x-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 min-h-[44px]">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={courseSearchQuery}
                      onChange={(e) => setCourseSearchQuery(e.target.value)}
                      placeholder="Search courses (e.g. Video, Web, AI, Graphic...)"
                      className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none font-medium"
                    />
                    {courseSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setCourseSearchQuery('')}
                        className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <a
                    href="#courses"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 shrink-0 min-h-[44px] active:scale-98"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </a>
                </div>

                {/* Mobile Quick Tags */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  <span className="text-slate-400 font-medium shrink-0">জনপ্রিয়:</span>
                  {['Graphic Design', 'Web Development', 'Video Editing', 'Digital Marketing'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setCourseSearchQuery(tag);
                        const el = document.getElementById('courses');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700/60 font-medium whitespace-nowrap transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3 border-t border-slate-800">
                <div className="p-2.5 sm:p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-center lg:text-left">
                  <span className="block text-xl sm:text-2xl font-black text-amber-400">
                    {websiteCmsConfig.heroStats?.totalTrained || '8,500+'}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Students Trained</span>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-center lg:text-left">
                  <span className="block text-xl sm:text-2xl font-black text-emerald-400">
                    {websiteCmsConfig.heroStats?.successRate || '96.4%'}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Completion Rate</span>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-center lg:text-left">
                  <span className="block text-xl sm:text-2xl font-black text-indigo-400">
                    {websiteCmsConfig.heroStats?.expertTrainers || '28+'}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Industry Mentors</span>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-center lg:text-left">
                  <span className="block text-xl sm:text-2xl font-black text-rose-400">
                    {websiteCmsConfig.heroStats?.jobPlacementRatio || '89.2%'}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Job Placements</span>
                </div>
              </div>
            </div>

            {/* Right Card / Promo Box (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-slate-800 to-slate-850 p-5 sm:p-7 rounded-3xl border-2 border-indigo-500/30 shadow-2xl space-y-4 sm:space-y-5">
                {/* Header Row with Inline Non-overlapping Discount Tag */}
                <div className="flex items-center justify-between gap-2 pb-0.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {websiteCmsConfig.upcomingBatchesCard?.title || 'Upcoming Batches'}
                  </span>
                  <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-[11px] px-3 py-1 rounded-full shadow-sm flex items-center space-x-1 shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                    <span>{websiteCmsConfig.upcomingBatchesCard?.badgeText || '40% Offer'}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-xl font-black text-white leading-snug">
                    {websiteCmsConfig.upcomingBatchesCard?.heading || 'Apply for Direct Admission'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {websiteCmsConfig.upcomingBatchesCard?.description || 'Fast-track your IT career with practical project portfolios and certified diplomas.'}
                  </p>
                </div>

                {/* Top 3 Featured Courses Quick List */}
                <div className="space-y-2.5">
                  {courses.slice(0, 3).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleOpenEnroll(c)}
                      className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 hover:border-indigo-500/60 rounded-2xl flex items-center justify-between cursor-pointer transition-all group gap-2"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors truncate">
                          {c.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {c.duration} • ৳{(c.offerFee || c.regularFee || 0).toLocaleString()}
                        </p>
                      </div>
                      <span className="px-3 py-1.5 bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shrink-0 transition-colors">
                        Enroll
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{websiteCmsConfig.upcomingBatchesCard?.featureNote || 'Free Lifetime Lab Access'}</span>
                  </div>
                  <a
                    href={websiteCmsConfig.upcomingBatchesCard?.ctaLink || '#seminars'}
                    className="text-amber-400 font-bold hover:underline shrink-0"
                  >
                    {websiteCmsConfig.upcomingBatchesCard?.ctaText || 'Free Seminars →'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 4. FOUR LEARNING DELIVERY FORMAT CARDS (CMS DRIVEN) */}
      {sectionVisibility.deliveryModes !== false && deliveryConfig?.enabled !== false && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="py-12 bg-white border-b border-slate-200"
        >
          <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Card 1: Offline Course */}
              {(offlineCard?.enabled !== false) && (
                <div
                  onClick={() => {
                    setSelectedDeliveryMode('Offline');
                    const el = document.getElementById('courses');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200 shrink-0">
                        <Building className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                        {offlineCard?.badge || 'ল্যাব ব্যাচ'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                        {offlineCard?.title || 'Offline Course'}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {offlineCard?.description || 'ইন-পার্সন সরাসরি ফার্মগেট ক্যাম্পাসে আধুনিক এসি ল্যাবে প্র্যাকটিক্যাল ক্লাস ও সার্বক্ষণিক শিক্ষক সাপোর্ট।'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 text-xs font-bold text-emerald-800">
                    <span>{offlineCoursesCount} {offlineCard?.footerText || 'Courses Available'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )}

              {/* Card 2: Online Live Course */}
              {(onlineCard?.enabled !== false) && (
                <div
                  onClick={() => {
                    setSelectedDeliveryMode('Online');
                    const el = document.getElementById('courses');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-5 rounded-3xl bg-rose-50/70 border border-rose-200/80 hover:border-rose-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-200 shrink-0">
                        <Video className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-0.5 bg-rose-200/80 text-rose-900 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                        {onlineCard?.badge || 'লাইভ ক্লাস'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base group-hover:text-rose-700 transition-colors">
                        {onlineCard?.title || 'Online Live Course'}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {onlineCard?.description || 'দেশ-বিদেশের যেকোনো স্থান থেকে লাইভ ক্লাসে অংশ নিন, ইনস্ট্যান্ট প্রশ্ন করুন ও ক্লাস রেকর্ডিং পান।'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-rose-200/60 text-xs font-bold text-rose-800">
                    <span>{onlineCoursesCount} {onlineCard?.footerText || 'Courses Available'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )}

              {/* Card 3: Pre-Recorded Course */}
              {(recordedCard?.enabled !== false) && (
                <div
                  onClick={() => {
                    setSelectedDeliveryMode('Pre Recorded');
                    const el = document.getElementById('courses');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-5 rounded-3xl bg-purple-50/70 border border-purple-200/80 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-200 shrink-0">
                        <PlaySquare className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-0.5 bg-purple-200/80 text-purple-900 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                        {recordedCard?.badge || 'সেলফ-পেসড'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base group-hover:text-purple-700 transition-colors">
                        {recordedCard?.title || 'Pre Recorded Course'}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {recordedCard?.description || 'নিজের সুবিধাজনক সময়ে প্রিমিয়াম এইচডি ভিডিও দেখুন, প্রজেক্ট জমা দিন ও লাইফটাইম অ্যাক্সেস উপভোগ করুন।'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-purple-200/60 text-xs font-bold text-purple-800">
                    <span>{preRecordedCoursesCount} {recordedCard?.footerText || 'Courses Available'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )}

              {/* Card 4: Corporate Training */}
              {(corporateCard?.enabled !== false) && (
                <div
                  onClick={() => {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-5 rounded-3xl bg-cyan-50/70 border border-cyan-200/80 hover:border-cyan-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-200 shrink-0">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-0.5 bg-cyan-200/80 text-cyan-900 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                        {corporateCard?.badge || 'কর্পোরেট'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base group-hover:text-cyan-700 transition-colors">
                        {corporateCard?.title || 'Corporate Training'}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {corporateCard?.description || 'ব্যাংক, বহুজাতিক প্রতিষ্ঠান ও কর্পোরেট টিমের কর্মীদের আধুনিক সফটওয়্যার ও আইটি স্কিলস ট্রেনিং।'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-cyan-200/60 text-xs font-bold text-cyan-800">
                    <span>{corporateCard?.footerText || 'Custom Team Upskilling'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* 5. IMPACT & TRUST SECTION: Dynamic from CMS */}
      {sectionVisibility.impactTrust !== false && websiteCmsConfig?.impactTrustConfig?.enabled !== false && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="py-14 bg-slate-50 border-b border-slate-200"
        >
          <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              {websiteCmsConfig?.impactTrustConfig?.tagText && (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-1">
                  <span>{websiteCmsConfig.impactTrustConfig.tagText}</span>
                </div>
              )}
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {websiteCmsConfig?.impactTrustConfig?.heading || 'From Beginner to IT Professionals We Close That Gap.'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {websiteCmsConfig?.impactTrustConfig?.subtitle ||
                  'অভিজ্ঞ মেন্টরশিপ ও প্রজেক্ট-ভিত্তিক ট্রেনিং এর মাধ্যমে বাংলাদেশের তরুণদের গ্লোবাল ক্যারিয়ার গঠনে আমরা প্রতিশ্রুতিবদ্ধ।'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {(websiteCmsConfig?.impactTrustConfig?.metrics && websiteCmsConfig.impactTrustConfig.metrics.length > 0
                ? websiteCmsConfig.impactTrustConfig.metrics
                : [
                    { id: 'm1', metric: '20,000+', label: 'Successful Students', subtext: 'সফল শিক্ষার্থী', color: 'text-indigo-600' },
                    { id: 'm2', metric: '9,000+', label: 'Expert Freelancers', subtext: 'সফল ফ্রিল্যান্সার', color: 'text-emerald-600' },
                    { id: 'm3', metric: '2,000+', label: 'Skilled Job Holders', subtext: 'কর্মসংস্থানপ্রাপ্ত গ্র্যাজুয়েট', color: 'text-blue-600' },
                    { id: 'm4', metric: '5,000+', label: 'Industry Experts', subtext: 'মেন্টরস নেটওয়ার্ক', color: 'text-amber-500' },
                    { id: 'm5', metric: '95%', label: 'Course Success Ratio', subtext: 'সফলতার হার', color: 'text-rose-500' },
                    { id: 'm6', metric: '100+', label: 'Hiring Partners', subtext: 'পার্টনার প্রতিষ্ঠান', color: 'text-purple-600' }
                  ]
              ).map((mItem, idx) => (
                <div
                  key={mItem.id || idx}
                  className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-2xs space-y-1 hover:shadow-md transition-shadow"
                >
                  <span className={`block text-2xl font-black ${mItem.color || 'text-indigo-600'}`}>
                    {mItem.metric}
                  </span>
                  <h4 className="text-xs font-black text-slate-900">{mItem.label}</h4>
                  <p className="text-[10px] text-slate-500">{mItem.subtext}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* 6. REDESIGNED COURSES SHOWCASE SECTION (MATCHING REFERENCE DESIGN) */}
      {sectionVisibility.courses !== false && (
        <section id="courses" className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{websiteCmsConfig?.coursesSectionConfig?.tagText || 'Industry-Standard IT Curriculum'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {websiteCmsConfig?.coursesSectionConfig?.heading || 'Our Specialized IT Career Courses (কোর্সসমূহ)'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {websiteCmsConfig?.coursesSectionConfig?.subtitle || 'মার্কেটপ্লেস ও কর্পোরেট জব রেডি স্কিলস ডেভেলপ করুন অভিজ্ঞ মেন্টরদের সাথে।'}
              </p>
            </div>

            {/* Delivery Mode Tabs: All, Offline, Online, Pre-Recorded */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedDeliveryMode('All')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedDeliveryMode === 'All'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Courses ({courses.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedDeliveryMode('Offline')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedDeliveryMode === 'Offline'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏢 Offline ({offlineCoursesCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedDeliveryMode('Online')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedDeliveryMode === 'Online'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌐 Online Live ({onlineCoursesCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedDeliveryMode('Pre Recorded')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedDeliveryMode === 'Pre Recorded'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎬 Pre Recorded ({preRecordedCoursesCount})
              </button>
            </div>
          </div>

          {/* Search & Category Filter Carousel */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
            {/* Category Filter Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              {['All', 'Next Upcoming', ...categories].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Course Search Box */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 min-w-[260px]">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={courseSearchQuery}
                onChange={(e) => setCourseSearchQuery(e.target.value)}
                placeholder="Filter courses..."
                className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              {courseSearchQuery && (
                <button
                  type="button"
                  onClick={() => setCourseSearchQuery('')}
                  className="text-slate-400 hover:text-slate-700 text-xs px-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Courses Count Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Showing <strong className="text-slate-900 font-bold">{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'course' : 'courses'}
              {selectedDeliveryMode !== 'All' && ` in ${selectedDeliveryMode} format`}
              {selectedCategory !== 'All' && ` for "${selectedCategory}"`}
            </span>
            {(selectedDeliveryMode !== 'All' || selectedCategory !== 'All' || courseSearchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDeliveryMode('All');
                  setSelectedCategory('All');
                  setCourseSearchQuery('');
                }}
                className="text-indigo-600 hover:underline font-bold"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Courses Grid (Masterpiece Design Matching Reference Image) */}
          {filteredCourses.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">No courses found matching your criteria.</h3>
              <p className="text-xs text-slate-500">Try changing the category or clearing the search keyword.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDeliveryMode('All');
                  setSelectedCategory('All');
                  setCourseSearchQuery('');
                }}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                View All Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredCourses.map((c) => {
                const deliveryMode = c.courseType || 'Offline';
                const badge = c.badgeText || c.code || `UITB-VE-${c.id.slice(-3)}`;
                const rating = c.rating || 4.9;
                const reviews = c.reviewsCount || 431;
                const projects = c.projectsCount || 10;
                const students = c.studentsJoined || 450;
                const thumbnail = c.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80';

                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col overflow-hidden group"
                  >
                    {/* Visual Cover Thumbnail Image with Zoom on Hover */}
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <img
                        src={thumbnail}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                      {/* Floating Badge Tag (Top Right) */}
                      <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md ${
                          deliveryMode === 'Offline'
                            ? 'bg-emerald-600'
                            : deliveryMode === 'Online'
                            ? 'bg-rose-600'
                            : 'bg-purple-600'
                        }`}>
                          {deliveryMode}
                        </span>
                      </div>

                      {/* Course Landing Page Direct Pill (Top Left) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.dispatchEvent(new CustomEvent('open-course-landing', { detail: { course: c } }));
                        }}
                        className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-900/85 hover:bg-indigo-600 text-white backdrop-blur-xs border border-white/20 shadow-md transition-all cursor-pointer z-10"
                        title="সম্পূর্ণ ডেডিকেটেড ল্যান্ডিং পেজ দেখুন"
                      >
                        <ExternalLink className="w-3 h-3 text-amber-300" />
                        <span>Course Page</span>
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      {/* Top Badges Row */}
                      <div className="flex items-center justify-between gap-2">
                        {/* Course ID / Badge in pink/rose badge like reference */}
                        <span className="px-3 py-1 rounded-lg bg-pink-50 border border-pink-200 text-pink-700 font-mono font-bold text-[11px]">
                          {badge}
                        </span>

                        <span className="text-[11px] font-bold text-amber-500 flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{rating} ({reviews} reviews)</span>
                        </span>
                      </div>

                      {/* Course Title with balanced line-wrap and fixed height to align all cards */}
                      <div className="min-h-[3.75rem] flex flex-col justify-start">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2 [text-wrap:balance]">
                          {c.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-1 truncate">
                          {c.category}
                        </p>
                      </div>

                      {/* Course Fee Display */}
                      <div className="flex items-baseline space-x-2 pt-1">
                        <span className="text-xl font-black text-indigo-700">
                          ৳{(c.offerFee || c.regularFee || 0).toLocaleString()}
                        </span>
                        {c.regularFee && c.regularFee > (c.offerFee || 0) && (
                          <span className="text-xs text-slate-400 line-through">
                            ৳{c.regularFee.toLocaleString()}
                          </span>
                        )}
                        {c.regularFee && c.offerFee && c.regularFee > c.offerFee && (
                          <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
                            SAVE ৳{(c.regularFee - c.offerFee).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* 4-Metric Grid Box (Matching Reference Design) */}
                      <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-semibold block">Class</span>
                          <span className="font-bold text-slate-800 block truncate">
                            {c.totalClasses || 36} Classes
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-semibold block">Duration</span>
                          <span className="font-bold text-slate-800 block truncate">
                            {c.duration}
                          </span>
                        </div>

                        <div className="space-y-0.5 pt-1.5 border-t border-slate-200/60">
                          <span className="text-[10px] text-slate-400 font-semibold block">Projects</span>
                          <span className="font-bold text-indigo-700 block truncate">
                            {projects} Real Projects
                          </span>
                        </div>

                        <div className="space-y-0.5 pt-1.5 border-t border-slate-200/60">
                          <span className="text-[10px] text-slate-400 font-semibold block">Student Joined</span>
                          <span className="font-bold text-emerald-700 block truncate">
                            {students}+ Students
                          </span>
                        </div>
                      </div>

                      {/* Live Batch Date & Urgency Pill */}
                      {(() => {
                        const upcomingBatch = (batches || []).find(b => b.courseId === c.id && b.status === 'Upcoming');
                        const batchDate = upcomingBatch?.startDate || c.landingConfig?.nextBatchStartDate || '১৫ অক্টোবর ২০২৬';
                        const remainingSeats = upcomingBatch
                          ? Math.max(2, (upcomingBatch.maxStudents || 25) - (upcomingBatch.enrolledStudents || 21))
                          : (c.landingConfig?.remainingSeats || 4);

                        return (
                          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/40 text-[11px] text-amber-900 font-bold">
                            <span className="flex items-center space-x-1 truncate mr-1">
                              <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span className="truncate">ব্যাচ: <strong>{batchDate}</strong></span>
                            </span>
                            <span className="flex items-center space-x-1 text-rose-600 bg-white px-1.5 py-0.5 rounded-md border border-rose-200 shadow-2xs font-black shrink-0 text-[10px]">
                              <Flame className="w-3 h-3 text-rose-500" />
                              <span>{remainingSeats}টি সিট বাকি</span>
                            </span>
                          </div>
                        );
                      })()}

                      {/* Action Buttons: Syllabus + View Details + Enroll */}
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCourseForSyllabus(c)}
                            className="px-2 py-2.5 min-h-[44px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-xl transition-colors text-center flex items-center justify-center space-x-1 cursor-pointer border border-indigo-100 active:scale-98"
                            title="Download Syllabus PDF"
                          >
                            <Download className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>সিলেবাস</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedCourseForDetails(c)}
                            className="px-2 py-2.5 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] sm:text-xs rounded-xl transition-colors text-center flex items-center justify-center space-x-1 cursor-pointer active:scale-98"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            <span>Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEnroll(c)}
                            className="px-2 py-2.5 min-h-[44px] bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-98 text-white font-black text-[11px] sm:text-xs rounded-xl shadow-md transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                            <span>Enroll</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => window.dispatchEvent(new CustomEvent('open-course-landing', { detail: { course: c } }))}
                          className="w-full min-h-[44px] py-2 px-3 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 text-indigo-900 border border-indigo-200/80 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>ল্যান্ডিং পেজ ও অফার দেখুন</span>
                          <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      )}

      {/* 5.5. ADMISSION & LEARNING JOURNEY ROADMAP (CMS DRIVEN) */}
      {sectionVisibility.admissionRoadmap !== false && roadmapConfig?.enabled !== false && (
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200 text-left">
          <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-full text-xs font-bold">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>{language === 'bn' ? 'ভর্তি ও ক্লাস শুরুর প্রক্রিয়া' : 'Admission & Learning Journey'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-website-heading">
                {roadmapConfig?.heading || (language === 'bn' ? 'সহজ ৪টি ধাপে শুরু করুন আপনার আইটি ক্যারিয়ার' : 'Start Your IT Career in 4 Simple Steps')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {roadmapConfig?.subtitle || (language === 'bn'
                  ? 'কোনো ঝামেলা ছাড়াই সম্পূর্ণ স্বচ্ছ প্রক্রিয়ায় কোর্স নির্বাচন, সরাসরি ল্যাব ওরিয়েন্টেশন এবং বাস্তব কাজ শেখা শুরু করুন।'
                  : 'A seamless, structured roadmap from counseling and seat reservation to hands-on practical labs and lifetime career guidance.')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(roadmapConfig?.steps && roadmapConfig.steps.length > 0 ? roadmapConfig.steps : [
                {
                  id: '1',
                  stepNumber: '০১',
                  title: language === 'bn' ? 'কোর্স নির্বাচন ও কাউন্সেলিং' : 'Course Selection & Guidance',
                  description: language === 'bn'
                    ? 'আপনার বর্তমান ক্যারিয়ার লক্ষ্য অনুযায়ী উপযুক্ত কোর্স বেছে নিন বা আমাদের এক্সপার্ট মেন্টরের সাথে কথা বলুন।'
                    : 'Explore industry-curated curriculums and consult with career advisors to find your ideal learning path.',
                  icon: 'book'
                },
                {
                  id: '2',
                  stepNumber: '০২',
                  title: language === 'bn' ? 'অনলাইন আবেদন ও সিট বুকিং' : 'Online Application & Booking',
                  description: language === 'bn'
                    ? 'পছন্দের ব্যাচ টাইম স্লট (সকাল, বিকাল বা উইকেন্ড) নির্বাচন করে সিট কনফার্ম করুন এবং রেজিস্ট্রেশন কপি বুঝে নিন।'
                    : 'Select your preferred morning, evening, or weekend schedule and confirm your admission registration online.',
                  icon: 'calendar'
                },
                {
                  id: '3',
                  stepNumber: '০৩',
                  title: language === 'bn' ? 'ল্যাব ওরিয়েন্টেশন ও সিঙ্গেল পিসি' : 'Orientation & Dedicated PC',
                  description: language === 'bn'
                    ? 'প্রথম দিন ক্যাম্পাসে পরিচিতি এবং ক্লাসের প্রতিটি সেশনে ব্যক্তিগত হাই-কনফিগ কম্পিউটার বরাদ্দ বুঝে নিন।'
                    : 'Get oriented with institute lab facilities and receive your dedicated personal workstation setup.',
                  icon: 'laptop'
                },
                {
                  id: '4',
                  stepNumber: '০৪',
                  title: language === 'bn' ? 'রিয়েল প্রজেক্ট ও আজীবন সাপোর্ট' : 'Real Projects & Lifetime Support',
                  description: language === 'bn'
                    ? 'বাস্তব প্রজেক্টে দক্ষতা অর্জন, সরকারি/ভেরিফায়েবল সার্টিফিকেট এবং আজীবন মেন্টরশিপ কমিউনিটি সহায়তা।'
                    : 'Build real-world client-grade projects, achieve verifiable certificates, and access lifetime alumni support.',
                  icon: 'award'
                }
              ]).map((stepItem, idx) => {
                const colorVariants = [
                  { text: 'text-indigo-600', bg: 'bg-indigo-100', border: 'hover:border-indigo-500/50' },
                  { text: 'text-emerald-600', bg: 'bg-emerald-100', border: 'hover:border-emerald-500/50' },
                  { text: 'text-amber-600', bg: 'bg-amber-100', border: 'hover:border-amber-500/50' },
                  { text: 'text-purple-600', bg: 'bg-purple-100', border: 'hover:border-purple-500/50' },
                ];
                const theme = colorVariants[idx % colorVariants.length];
                return (
                  <div key={stepItem.id || idx} className={`bg-slate-50 border border-slate-200/80 ${theme.border} p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs hover:shadow-md transition-all group`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-3xl font-black ${theme.text} font-mono`}>{stepItem.stepNumber || `0${idx + 1}`}</span>
                      <div className={`w-11 h-11 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center font-bold`}>
                        {stepItem.icon === 'calendar' ? <Calendar className="w-5 h-5" /> :
                         stepItem.icon === 'laptop' ? <Laptop className="w-5 h-5" /> :
                         stepItem.icon === 'award' ? <Award className="w-5 h-5" /> :
                         <BookOpen className="w-5 h-5" />}
                      </div>
                    </div>
                    <h3 className={`font-black text-slate-900 text-base sm:text-lg group-hover:${theme.text} transition-colors`}>
                      {stepItem.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {stepItem.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. ABOUT US & LEADERSHIP SECTION */}
      {sectionVisibility.aboutUs !== false && (
        <section id="about" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
          {/* Top Story Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                <Building className="w-3.5 h-3.5" />
                <span>About {academySettings.instituteName || 'Nexgen Academy'} • Estd. {about.establishedYear}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {about.storyTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {about.storyDescription}
              </p>

              {/* Mission & Vision Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xs">
                    🎯
                  </div>
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Our Mission</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{about.mission}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-xs">
                    🔭
                  </div>
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Our Vision</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{about.vision}</p>
                </div>
              </div>
            </div>

            {/* Director's Message Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-7 rounded-3xl text-white shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center space-x-4">
                <img
                  src={about.directorPhotoUrl}
                  alt={about.directorName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-md shrink-0"
                />
                <div>
                  <h4 className="font-black text-white text-sm sm:text-base">{about.directorName}</h4>
                  <p className="text-xs text-indigo-300 font-medium">{about.directorTitle}</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs leading-relaxed text-slate-200 italic">
                "{about.directorMessage}"
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Accreditations & Affiliations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(about.affiliations || []).map((acc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-indigo-500/20 text-indigo-200 text-[10px] font-bold rounded-md border border-indigo-400/30"
                    >
                      ✓ {acc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* High-Tech Lab Facilities */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center space-x-2">
              <Monitor className="w-5 h-5 text-indigo-600" />
              <span>State-of-the-Art Smart Campus Lab Infrastructure</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {(about.facilityHighlights || []).map((fac, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-bold text-slate-700 flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block font-black text-slate-900">{fac.title}</span>
                    <span className="text-[11px] text-slate-500 font-normal">{fac.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 6.5. FACULTY & MENTORS SHOWCASE: Dynamic from CMS trainersList */}
      {sectionVisibility.mentors !== false && trainersList && trainersList.length > 0 && (
        <section id="mentors" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 space-y-10">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>
                  {websiteCmsConfig?.mentorsSectionConfig?.tagText || 'Top Industry Practitioners & Mentors'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {websiteCmsConfig?.mentorsSectionConfig?.heading || 'Meet Our Expert Faculty & Instructors (মেন্টরস প্যানেল)'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {websiteCmsConfig?.mentorsSectionConfig?.subtitle ||
                  'মার্কেটপ্লেসে সফল ফ্রিল্যান্সার ও শীর্ষ টেক কোম্পানির সিনিয়র ইঞ্জিনিয়ারদের সরাসরি তত্ত্বাবধানে শিখুন।'}
              </p>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trainersList
                .filter(t => t.isActive !== false)
                .map((trainer) => (
                  <div
                    key={trainer.id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between space-y-5 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group"
                  >
                    <div className="space-y-4">
                      {/* Avatar & Info */}
                      <div className="flex items-center space-x-4">
                        <img
                          src={trainer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                          alt={trainer.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-2xs group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {trainer.name}
                          </h3>
                          <p className="text-xs font-bold text-indigo-600 line-clamp-1">
                            {trainer.designation}
                          </p>
                          <span className="inline-flex items-center text-[10px] text-slate-500 font-semibold mt-0.5">
                            <Award className="w-3 h-3 text-amber-500 mr-1 shrink-0" />
                            {trainer.experienceYears}+ Years Experience
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {trainer.shortBio}
                      </p>

                      {/* Skills Badges */}
                      {trainer.skills && trainer.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {trainer.skills.slice(0, 4).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold"
                            >
                              {skill}
                            </span>
                          ))}
                          {trainer.skills.length > 4 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                              +{trainer.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer with organization and socials */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 truncate max-w-[140px]">
                        {trainer.companyOrOrg || 'Nexgen Academy'}
                      </span>
                      <div className="flex items-center space-x-2">
                        {trainer.socialLinks?.linkedin && (
                          <a
                            href={trainer.socialLinks.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-colors text-xs font-bold"
                            title="LinkedIn Profile"
                          >
                            in
                          </a>
                        )}
                        {trainer.socialLinks?.github && (
                          <a
                            href={trainer.socialLinks.github}
                            target="_blank"
                            rel="noreferrer"
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                            title="GitHub Profile"
                          >
                            gh
                          </a>
                        )}
                        {trainer.socialLinks?.facebook && (
                          <a
                            href={trainer.socialLinks.facebook}
                            target="_blank"
                            rel="noreferrer"
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors text-xs font-bold"
                            title="Facebook Profile"
                          >
                            f
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. SOCIAL MEDIA, FACEBOOK COMMUNITY GROUP & YOUTUBE HUB */}
      {sectionVisibility.communityHub !== false && communityHubConfig?.enabled !== false && (
        <section id="community" className="py-16 bg-white">
          <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>{communityHubConfig?.badge || 'Connect with 18,000+ Bangladeshi Coders'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {communityHubConfig?.title || 'Official Community Groups & YouTube Masterclasses'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {communityHubConfig?.description || 'Join our active developer network, ask code queries, collaborate on projects, and watch free full-length crash courses.'}
              </p>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Facebook Group & Socials Box (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-indigo-950 p-6 sm:p-7 rounded-3xl text-white shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-blue-300 text-xs font-black uppercase tracking-wider">
                  <span className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                    f
                  </span>
                  <span>Facebook Official Network</span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {socials.facebookGroupName || 'NexGen Dev & Tech Career Community'}
                  </h3>
                  <p className="text-xs text-blue-200 mt-1">
                    Free daily problem solving, code reviews, hiring job postings, and peer coding sessions.
                  </p>
                </div>

                <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 font-black text-xs rounded-xl border border-emerald-400/30">
                  ⚡ {socials.facebookGroupMembersCount || '18,500+ Active Members'}
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={socials.facebookGroupUrl || 'https://facebook.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
                >
                  <Users className="w-4 h-4" />
                  <span>Join Facebook Community Group</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {socials.facebookPageUrl && (
                  <a
                    href={socials.facebookPageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-blue-100 font-bold text-xs rounded-xl border border-white/20 flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>Like Official Facebook Page</span>
                  </a>
                )}

                {socials.whatsappCommunityUrl && (
                  <a
                    href={socials.whatsappCommunityUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Join WhatsApp Discussion Group</span>
                  </a>
                )}
              </div>
            </div>

            {/* YouTube Featured Video Player (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between">
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  title="Featured NexGen YouTube Tutorial & Campus Video"
                  src={socials.youtubeFeaturedVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-5 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white border-t border-slate-800">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5 text-red-500 font-black text-xs uppercase tracking-wider">
                    <Youtube className="w-4 h-4" />
                    <span>Featured Video Masterclass</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-100">
                    {socials.youtubeVideoTitle || 'NexGen Campus Experience & Live Coding Guide'}
                  </h4>
                </div>

                <a
                  href={socials.youtubeChannelUrl || 'https://youtube.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-1.5 shrink-0"
                >
                  <Youtube className="w-4 h-4" />
                  <span>Subscribe Channel</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 8. TECH BLOG & CAREER ARTICLES SECTION */}
      {sectionVisibility.blog !== false && (
        <section id="blog" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-2">
                <FileText className="w-3.5 h-3.5" />
                <span>{websiteCmsConfig?.blogSectionConfig?.tagText || 'Industry Insights & Placement Guides'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {websiteCmsConfig?.blogSectionConfig?.heading || 'Tech Blog & Career Roadmap Articles (ব্লগ)'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {websiteCmsConfig?.blogSectionConfig?.subtitle || 'Explore expert tutorials, freelance interview strategies, and high-growth software engineering roadmaps.'}
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5">
              {blogCategories.map((bCat) => (
                <button
                  key={bCat}
                  type="button"
                  onClick={() => setSelectedBlogCategory(bCat)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    selectedBlogCategory === bCat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {bCat}
                </button>
              ))}
            </div>
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => setSelectedBlogForReading(blog)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col cursor-pointer group"
              >
                <div className="h-48 w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={blog.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-indigo-600/90 backdrop-blur-xs text-white text-[10px] font-black rounded-lg uppercase">
                    {blog.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                      <span>{blog.publishedDate}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{blog.readTime || '5 min read'}</span>
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {blog.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">By {blog.authorName}</span>
                    <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 9. UPCOMING FREE SEMINARS & WORKSHOPS */}
      {sectionVisibility.seminars !== false && (
        <section id="seminars" className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{websiteCmsConfig?.seminarsSectionConfig?.tagText || '100% Free Career Masterclasses'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {websiteCmsConfig?.seminarsSectionConfig?.heading || 'Upcoming Free Seminars & Workshops (ফ্রি সেমিনার)'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {websiteCmsConfig?.seminarsSectionConfig?.subtitle || 'Participate in live career counseling, ask industry mentors, and book your verified entry pass.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seminars.map((s) => (
              <div
                key={s.id}
                className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700 shadow-xl flex flex-col justify-between space-y-5 hover:border-amber-400/60 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      {s.type || 'Free Career Seminar'}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Seats Left: {Math.max(1, s.capacity - s.registeredCount)}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white leading-snug">{s.title}</h3>

                  <div className="space-y-2 text-xs text-slate-300 pt-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{s.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{s.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="truncate">{s.roomOrPlatform || 'Farmgate Seminar Hall 1 & Zoom Live'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Speaker: <strong>{s.speakerName}</strong></span>
                    </div>

                    {(s.whatsappGroupUrl || s.googleMapsUrl) && (
                      <div className="flex items-center space-x-2 pt-1">
                        {s.whatsappGroupUrl && (
                          <a
                            href={s.whatsappGroupUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold hover:bg-emerald-900 transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp Community</span>
                          </a>
                        )}
                        {s.googleMapsUrl && (
                          <a
                            href={s.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold hover:bg-indigo-900 transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Venue Map</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSeminarForReg(s)}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Join Free Seminar (সিট বুক করুন)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 10. STUDENT PHOTO & LAB ACTIVITY GALLERY */}
      {sectionVisibility.gallery !== false && (
        <section id="gallery" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-2">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Life at {academySettings.instituteName || 'Our Academy'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Student Lab & Activity Photo Gallery (গ্যালারি)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Glimpses of our vibrant classroom labs, workshop sessions, and graduation ceremonies.
              </p>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-1.5">
              {galleryCategories.map((gCat) => (
                <button
                  key={gCat}
                  type="button"
                  onClick={() => setActiveGalleryCategory(gCat)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    activeGalleryCategory === gCat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {gCat}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid with Animated Scroll */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGallery.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (idx % 3) * 0.1 }}
                onClick={() => setSelectedGalleryImage(item)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
              >
                <div className="h-56 w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold rounded-full border border-white/20">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  {item.caption && <p className="text-xs text-slate-500 line-clamp-2">{item.caption}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 11. VERIFIED STUDENT REVIEWS & SUCCESS STORIES */}
      {sectionVisibility.reviews !== false && (
        <section id="reviews" className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Real Student Feedback & Employment Proof</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Verified Student Reviews & Career Stories (রিভিউ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Read how our alumni transitioned into freelance marketplaces and leading tech enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {websiteReviews.map((rev, idx) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (idx % 4) * 0.1 }}
                className="bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:-translate-y-1"
              >
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 text-amber-500">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{rev.reviewText}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center space-x-3">
                  {rev.studentPhoto ? (
                    <img
                      src={rev.studentPhoto}
                      alt={rev.studentName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs">
                      {rev.studentName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h5 className="font-black text-slate-900 text-xs">{rev.studentName}</h5>
                    <p className="text-[10px] text-indigo-600 font-bold">{rev.courseName}</p>
                    {rev.earningsOrSuccess && (
                      <p className="text-[10px] text-emerald-700 font-semibold">{rev.earningsOrSuccess}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Google Reviews CTA Badge & Link */}
          {(websiteCmsConfig.seo?.googleBusinessProfile?.reviewUrl || websiteCmsConfig.seo?.googleReviewUrl || websiteCmsConfig.seo?.googleBusinessProfile?.mapsUrl) && (
            <div className="mt-10 p-5 bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                  G
                </div>
                <div>
                  <div className="flex items-center space-x-1.5 justify-center sm:justify-start">
                    {websiteCmsConfig.seo?.googleBusinessProfile?.verifiedRating && websiteCmsConfig.seo.googleBusinessProfile.verifiedRating > 0 ? (
                      <>
                        <span className="font-black text-slate-900 text-sm">
                          {websiteCmsConfig.seo.googleBusinessProfile.verifiedRating.toFixed(1)} Star Verified Rating on Google
                        </span>
                        <div className="flex text-amber-500">
                          {[...Array(Math.round(websiteCmsConfig.seo.googleBusinessProfile.verifiedRating))].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </>
                    ) : (
                      <span className="font-black text-slate-900 text-sm">
                        Google Verified Training Centre • Farmgate, Dhaka
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Read verified feedback or share your authentic student learning experience on Google Maps
                  </p>
                </div>
              </div>

              <a
                href={websiteCmsConfig.seo?.googleBusinessProfile?.reviewUrl || websiteCmsConfig.seo?.googleBusinessProfile?.mapsUrl || websiteCmsConfig.seo?.googleReviewUrl || 'https://share.google/gSt3e5RNwwCyOOdGu'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 shrink-0"
              >
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                <span>Review us on Google</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </section>
      )}

      {/* 11.5 ALUMNI CAREER PLACEMENTS & FREELANCING MILESTONES */}
      {sectionVisibility.placements !== false && (
        <PlacementsShowcaseSection
          onOpenAdmission={() => setIsAdmissionOpen(true)}
        />
      )}

      {/* 12. HIRING PARTNERS & CORPORATE RECRUITERS SHOWCASE */}
      {sectionVisibility.hiringPartners !== false && (
        <HiringPartnersSection
          config={websiteCmsConfig.hiringPartnersConfig}
          onOpenAdmission={() => setIsAdmissionOpen(true)}
        />
      )}

      {/* 13. PUBLIC CERTIFICATE VERIFICATION ENGINE */}
      {sectionVisibility.verifyCertificate !== false && (
        <CertificateVerificationSection onOpenStaffLogin={onOpenStaffLogin} />
      )}

      {/* 13. NOTICES & FREQUENTLY ASKED QUESTIONS */}
      {sectionVisibility.noticesAndFaq !== false && (
        <section id="notices" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Notice Board (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-black text-slate-900">Academic Notice Board</h3>
              </div>
              <p className="text-xs text-slate-500">
                Official notices regarding exams, batch schedules, and scholarship events.
              </p>

              <div className="space-y-3">
                {websiteNotices.map((not) => (
                  <div
                    key={not.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {not.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{not.publishedDate}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">{not.title}</h4>
                    <p className="text-[11px] text-slate-600">{not.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: FAQ Accordion (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-black text-slate-900">Frequently Asked Questions</h3>
              </div>
              <p className="text-xs text-slate-500">
                Got questions about courses, certifications, or installments? Find instant answers below.
              </p>

              <div className="space-y-3">
                {websiteFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 14. CONTACT & MULTI-CHANNEL LOCATION SECTION */}
      {sectionVisibility.contactAndMap !== false && (
        <section id="contact" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Visit Our Campus & Direct Helplines
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {officeHours || 'We are open everyday from 9:00 AM to 8:30 PM for on-desk counseling and lab visits.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Campus Info Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white space-y-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <NexgenLogo variant="horizontal" size={44} />

                <div className="space-y-4 text-xs pt-2">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white">Campus Address:</strong>
                      <span className="text-slate-300">{officeAddress}</span>
                      {campusDirections && (
                        <p className="text-[11px] text-amber-300/80 mt-0.5">ℹ️ {campusDirections}</p>
                      )}
                    </div>
                  </div>

                  {/* Multiple Phone Helplines */}
                  <div className="flex items-start space-x-3">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 w-full">
                      <strong className="block text-white">Dedicated Telephone Helplines:</strong>
                      <div className="space-y-1">
                        {multiplePhones.map((ph, idx) => (
                          <div key={idx} className="flex items-center justify-between text-slate-300">
                            <span>{ph.label}: <a href={`tel:${ph.number}`} className="font-bold text-white hover:text-amber-400">{ph.number}</a></span>
                            {ph.isHotline && (
                              <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded uppercase">
                                Hotline
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Multiple Department Emails */}
                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 w-full">
                      <strong className="block text-white">Department Email Inboxes:</strong>
                      <div className="space-y-1 text-[11px] text-slate-300">
                        {multipleEmails.map((em, idx) => (
                          <div key={idx}>
                            <span className="text-slate-400">{em.label}:</span>{' '}
                            <a href={`mailto:${em.email}`} className="text-indigo-300 hover:underline">{em.email}</a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white">Visiting Hours:</strong>
                      <span className="text-slate-300">{officeHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <a
                  href={websiteCmsConfig.googleMapShareUrl || 'https://share.google/9W8K1XZHLbZxFpF8G'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-md transition-all hover:scale-105"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>গুগল ম্যাপে লোকেশন দেখুন</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <a
                  href={getWhatsAppDirectUrl(
                    socials.whatsappSupportNumber || academySettings.primarySupportPhone || '01798444444',
                    `Hello ${academySettings.instituteName || 'Academy'}! I want to know about course admission & scholarship details.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-md transition-all hover:scale-105"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Interactive Google Map & Location Box (7 cols) */}
            <div className="lg:col-span-7">
              <CampusLocationMapBox
                embedUrl={websiteCmsConfig.googleMapEmbedUrl}
                shareUrl={websiteCmsConfig.googleMapShareUrl || 'https://share.google/9W8K1XZHLbZxFpF8G'}
                address={officeAddress}
                directions={campusDirections}
                instituteName={academySettings.instituteName || 'Nexgen Computer Academy'}
              />
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 15. FOOTER & POLICIES */}
      {sectionVisibility.footer !== false && (
        <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8">
          <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-3">
                <NexgenLogo variant="horizontal" size={40} />
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {footerConfig?.bio || `${academySettings.instituteName || 'Nexgen Computer Academy'} is a premier professional IT training organization based in Dhaka, dedicated to creating industry-grade developers, designers, and freelance leaders.`}
                </p>
                {/* Social Icons */}
                {footerConfig?.showSocials !== false && (
                  <div className="flex items-center space-x-2.5 pt-2">
                    {socials.facebookPageUrl && (
                      <a href={socials.facebookPageUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-600 text-white flex items-center justify-center transition-colors">
                        f
                      </a>
                    )}
                    {socials.youtubeChannelUrl && (
                      <a href={socials.youtubeChannelUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-600 text-white flex items-center justify-center transition-colors">
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                    {socials.linkedinUrl && (
                      <a href={socials.linkedinUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-sky-600 text-white flex items-center justify-center transition-colors">
                        in
                      </a>
                    )}
                  </div>
                )}
              </div>

              {footerConfig?.showTopCourses !== false && (
                <div className="space-y-2.5">
                  <h4 className="font-black text-white text-xs uppercase tracking-wider">Top Courses</h4>
                  <ul className="space-y-1.5 text-[11px]">
                    {courses.slice(0, 5).map(c => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => handleOpenEnroll(c)}
                          className="hover:text-amber-400 transition-colors text-left"
                        >
                          {c.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {footerConfig?.showQuickNav !== false && (
                <div className="space-y-2.5">
                  <h4 className="font-black text-white text-xs uppercase tracking-wider">Quick Navigation</h4>
                  <ul className="space-y-1.5 text-[11px]">
                    <li><a href="#courses" className="hover:text-white">All Courses & Fees</a></li>
                    <li><a href="#about" className="hover:text-white">About Us & Campus</a></li>
                    <li><a href="#community" className="hover:text-white">Facebook Community Group</a></li>
                    <li><a href="#blog" className="hover:text-white">Tech Blogs & Career Tips</a></li>
                    <li><a href="#seminars" className="hover:text-white">Free Career Seminars</a></li>
                    <li><a href="#verify-certificate" className="hover:text-white">Verify Student Certificate</a></li>
                    <li>
                      <button type="button" onClick={onOpenStaffLogin} className="hover:text-amber-400 font-bold">
                        ERP Staff Administration
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              {footerConfig?.showLegalLinks !== false && (
                <div className="space-y-2.5">
                  <h4 className="font-black text-white text-xs uppercase tracking-wider">Legal Policies & Standards</h4>
                  <ul className="space-y-1.5 text-[11px]">
                    <li>
                      <button
                        type="button"
                        onClick={() => setActivePolicyModal('terms')}
                        className="hover:text-indigo-400 transition-colors text-left font-bold"
                      >
                        Terms & Conditions (শর্তাবলী)
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setActivePolicyModal('privacy')}
                        className="hover:text-indigo-400 transition-colors text-left font-bold"
                      >
                        Privacy Policy (গোপনীয়তা নীতি)
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setActivePolicyModal('refund')}
                        className="hover:text-indigo-400 transition-colors text-left font-bold"
                      >
                        Refund & Batch Transfer Policy
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setActivePolicyModal('conduct')}
                        className="hover:text-indigo-400 transition-colors text-left font-bold"
                      >
                        Student Code of Conduct
                      </button>
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>100% Genuine Certified Credentials</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
              <p>{footerConfig?.copyrightText || `© ${new Date().getFullYear()} ${academySettings.instituteName || 'Nexgen Computer Academy'}. All Rights Reserved.`}</p>
              <p>{footerConfig?.creditsText || 'Empowered by NexGen Multi-Campus ERP & Centralized CMS Engine.'}</p>
            </div>
          </div>
        </footer>
      )}

      {/* POPUP MODALS */}
      <OnlineAdmissionModal
        isOpen={isAdmissionOpen}
        onClose={() => setIsAdmissionOpen(false)}
        preselectedCourse={selectedCourseForAdmission}
      />

      <SeminarRegistrationModal
        isOpen={!!activeSeminarForReg}
        onClose={() => setActiveSeminarForReg(null)}
        seminar={activeSeminarForReg}
      />

      <CourseDetailsModal
        isOpen={!!selectedCourseForDetails}
        onClose={() => setSelectedCourseForDetails(null)}
        course={selectedCourseForDetails}
        onOpenEnroll={(c) => {
          setSelectedCourseForAdmission(c);
          setIsAdmissionOpen(true);
        }}
      />

      <BlogPostModal
        isOpen={!!selectedBlogForReading}
        onClose={() => setSelectedBlogForReading(null)}
        blog={selectedBlogForReading}
      />

      <PolicyViewerModal
        isOpen={!!activePolicyModal}
        onClose={() => setActivePolicyModal(null)}
        initialType={activePolicyModal || 'terms'}
        policies={websiteCmsConfig.policies}
        instituteName={academySettings.instituteName}
      />

      {/* Lightbox for Gallery Photo */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={selectedGalleryImage.imageUrl}
                alt={selectedGalleryImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-5 flex items-center justify-between text-white bg-slate-900 border-t border-slate-800">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600/50 text-indigo-200">
                  {selectedGalleryImage.category}
                </span>
                <h4 className="font-bold text-base mt-1">{selectedGalleryImage.title}</h4>
                {selectedGalleryImage.caption && (
                  <p className="text-xs text-slate-400 mt-0.5">{selectedGalleryImage.caption}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedGalleryImage(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRO TOOL 1: EXIT-INTENT DISCOUNT VOUCHER MODAL */}
      {showExitIntent && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200"
          onClick={() => {
            setShowExitIntent(false);
            sessionStorage.setItem('nca_exit_intent_dismissed', 'true');
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-indigo-100 relative text-center space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowExitIntent(false);
                sessionStorage.setItem('nca_exit_intent_dismissed', 'true');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-rose-500/30">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {websiteCmsConfig?.marketing?.exitIntentTitle || '🎁 Wait! Special 45% Scholarship Voucher'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {websiteCmsConfig?.marketing?.exitIntentSubtitle || 'Claim your exclusive student fee discount voucher before leaving. Valid for any upcoming tech batch!'}
              </p>
            </div>

            {/* Voucher Box */}
            <div className="p-4 bg-indigo-50/80 border-2 border-dashed border-indigo-300 rounded-2xl space-y-1.5">
              <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Use Promo Code At Admission:</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-mono text-lg sm:text-xl font-black text-indigo-900 tracking-wider">
                  {websiteCmsConfig?.marketing?.exitIntentDiscountCode || 'NEXGEN-SPECIAL45'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Instant BDT 2,000 - 5,000 extra fee waiver on spot enrollment</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setShowExitIntent(false);
                  sessionStorage.setItem('nca_exit_intent_dismissed', 'true');
                  setIsAdmissionOpen(true);
                  trackMetaPixelEvent('InitiateCheckout', {
                    content_name: 'Exit Intent Voucher Claimed',
                    promo_code: websiteCmsConfig?.marketing?.exitIntentDiscountCode || 'NEXGEN-SPECIAL45'
                  }, websiteCmsConfig?.marketing?.metaPixelId);
                }}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>Claim Voucher & Apply Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 100% DYNAMIC LEAD CAPTURE & SCHOLARSHIP POPUP (CMS CONTROLLED) */}
      <LeadCapturePopupModal
        config={websiteCmsConfig.leadCapturePopup}
        courses={courses}
        onSubmitLead={async (payload) => {
          const leadSourceStr = payload.source || 'Website Popup Voucher';
          const selectedCourseObj = courses.find(c => c.id === payload.courseId);
          const todayDate = new Date().toISOString().split('T')[0];
          const newLeadData = {
            fullName: payload.fullName,
            studentName: payload.fullName,
            name: payload.fullName,
            phone: payload.phone,
            email: payload.email || '',
            courseId: payload.courseId || (courses[0]?.id || ''),
            courseName: selectedCourseObj?.name || payload.courseId || '',
            interestedCourseId: payload.courseId || (courses[0]?.id || ''),
            source: leadSourceStr,
            leadSource: leadSourceStr,
            notes: payload.notes || `[Website Popup] Promo Voucher Claimed`,
            status: 'New' as const,
            counselorId: 'st-03',
            counselorName: 'Online Desk (Tanvir Ahmed)',
            occupation: 'Student / Professional',
            educationLevel: 'HSC / Graduate',
            visitDate: todayDate,
            firstContactDate: todayDate,
            comments: `[Popup Voucher] ${payload.notes || ''}`
          };
          addLead(newLeadData);
          if (submitPublicLead) {
            submitPublicLead(newLeadData).catch(err => console.warn('Background lead sync notice:', err));
          }
          return true;
        }}
      />

      {/* FLOATING ACTION & MULTI-CHANNEL QUICK CONNECT WIDGET (CMS CONTROLLED) */}
      <FloatingActionWidget
        config={websiteCmsConfig.floatingActionWidget}
        onOpenAdmission={() => setIsAdmissionOpen(true)}
        defaultPhone={
          websiteCmsConfig.marketing?.floatingWhatsAppNumber ||
          socials.whatsappSupportNumber ||
          academySettings.primarySupportPhone ||
          '01798444444'
        }
        instituteName={academySettings.instituteName}
      />

      {/* TOP NOTICE & PROMO BANNER CMS EDIT MODAL */}
      <TopNoticeTickerModal
        isOpen={isTopNoticeModalOpen}
        onClose={() => setIsTopNoticeModalOpen(false)}
      />

      {/* SOCIAL PROOF REAL-TIME ADMISSIONS & INQUIRY TICKER */}
      <SocialProofTicker />

      {/* DYNAMIC SYLLABUS DOWNLOAD LEAD MAGNET MODAL */}
      <SyllabusDownloadModal
        isOpen={!!selectedCourseForSyllabus}
        onClose={() => setSelectedCourseForSyllabus(null)}
        course={selectedCourseForSyllabus}
        onOpenAdmission={(c) => {
          setSelectedCourseForAdmission(c);
          setIsAdmissionOpen(true);
        }}
      />

      {/* FREE CAMPUS TOUR & PHYSICAL LAB COUNSELING BOOKING MODAL */}
      <CampusTourModal
        isOpen={isCampusTourOpen}
        onClose={() => setIsCampusTourOpen(false)}
        courses={courses}
      />
    </div>
  );
};
