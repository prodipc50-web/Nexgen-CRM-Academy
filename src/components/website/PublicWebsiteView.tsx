import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { useAcademy } from '../../context/AcademyContext';
import { NexgenLogo } from '../common/NexgenLogo';
import { MobileNavDrawer } from './MobileNavDrawer';
import { TopOfferRibbon } from './TopOfferRibbon';
import { FloatingActionWidget } from './FloatingActionWidget';
import { SocialProofTicker } from './SocialProofTicker';
import { CampusLocationMapBox } from './CampusLocationMapBox';
import { FreeCounselingLeadBanner } from './FreeCounselingLeadBanner';
import { AccreditationTrustStrip } from './AccreditationTrustStrip';

// Lazy-loaded SubPages (Code Splitting: loaded on-demand when user clicks subpage)
const CoursesSubPage = lazy(() => import('./subpages/CoursesSubPage').then(m => ({ default: m.CoursesSubPage })));
const SeminarsSubPage = lazy(() => import('./subpages/SeminarsSubPage').then(m => ({ default: m.SeminarsSubPage })));
const SuccessStorySubPage = lazy(() => import('./subpages/SuccessStorySubPage').then(m => ({ default: m.SuccessStorySubPage })));
const MentorsSubPage = lazy(() => import('./subpages/MentorsSubPage').then(m => ({ default: m.MentorsSubPage })));
const GallerySubPage = lazy(() => import('./subpages/GallerySubPage').then(m => ({ default: m.GallerySubPage })));
const AboutUsSubPage = lazy(() => import('./subpages/AboutUsSubPage').then(m => ({ default: m.AboutUsSubPage })));
const ContactUsSubPage = lazy(() => import('./subpages/ContactUsSubPage').then(m => ({ default: m.ContactUsSubPage })));
const VerifyCertificateSubPage = lazy(() => import('./subpages/VerifyCertificateSubPage').then(m => ({ default: m.VerifyCertificateSubPage })));
const BlogSubPage = lazy(() => import('./subpages/BlogSubPage').then(m => ({ default: m.BlogSubPage })));

// Lazy-loaded Heavy Modals (loaded on-demand only when opened)
const OnlineAdmissionModal = lazy(() => import('./OnlineAdmissionModal').then(m => ({ default: m.OnlineAdmissionModal })));
const SeminarRegistrationModal = lazy(() => import('./SeminarRegistrationModal').then(m => ({ default: m.SeminarRegistrationModal })));
const CourseDetailsModal = lazy(() => import('./CourseDetailsModal').then(m => ({ default: m.CourseDetailsModal })));
const BlogPostModal = lazy(() => import('./BlogPostModal').then(m => ({ default: m.BlogPostModal })));
const PolicyViewerModal = lazy(() => import('./PolicyViewerModal').then(m => ({ default: m.PolicyViewerModal })));
const LeadCapturePopupModal = lazy(() => import('./LeadCapturePopupModal').then(m => ({ default: m.LeadCapturePopupModal })));
const SyllabusDownloadModal = lazy(() => import('./SyllabusDownloadModal').then(m => ({ default: m.SyllabusDownloadModal })));
const CampusTourModal = lazy(() => import('./CampusTourModal').then(m => ({ default: m.CampusTourModal })));
const CourseFeeInstallmentCalculatorModal = lazy(() => import('./CourseFeeInstallmentCalculatorModal').then(m => ({ default: m.CourseFeeInstallmentCalculatorModal })));
const TopNoticeTickerModal = lazy(() => import('./TopNoticeTickerModal').then(m => ({ default: m.TopNoticeTickerModal })));
import { UniqueItTopBar } from './nexgen/NexgenTopBar';
import { UniqueItNavbar } from './nexgen/NexgenNavbar';
import { UniqueItHero } from './nexgen/NexgenHero';
import { NexgenCategorySlider as UniqueItCategorySlider } from './nexgen/NexgenCategorySlider';
import { UniqueItPopularCourses } from './nexgen/NexgenPopularCourses';
import { NexgenExploreCategories as UniqueItExploreCategories } from './nexgen/NexgenExploreCategories';
import { NexgenAboutHero as UniqueItAboutHero } from './nexgen/NexgenAboutHero';
import { UniqueItOnlineCourses } from './nexgen/NexgenOnlineCourses';
import { UniqueItSuccessStories } from './nexgen/NexgenSuccessStories';
import { UniqueItStudentReviews } from './nexgen/NexgenStudentReviews';
import { UniqueItWhyChoose } from './nexgen/NexgenWhyChoose';
import { UniqueItNewsletter } from './nexgen/NexgenNewsletter';
import { UniqueItPhotoStrip } from './nexgen/NexgenPhotoStrip';
import { NexgenFaq as UniqueItFaq } from './nexgen/NexgenFaq';
import { NexgenExclusiveSolutions as UniqueItExclusiveSolutions } from './nexgen/NexgenExclusiveSolutions';
import { UniqueItSnakeCta } from './nexgen/NexgenSnakeCta';
import { NexgenAdmissionBanner as UniqueItAdmissionBanner } from './nexgen/NexgenAdmissionBanner';
import { UniqueItFooter } from './nexgen/NexgenFooter';
import { UniqueItFloatingDiscount } from './nexgen/NexgenFloatingDiscount';
import { NexgenUrgencyBanner } from './nexgen/NexgenUrgencyBanner';
import { NexgenHomepageSeminars } from './nexgen/NexgenHomepageSeminars';
import { NexgenExpatTrustBanner } from './nexgen/NexgenExpatTrustBanner';
import { getVideoBlobUrl } from '../../utils/videoStorage';
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
  Building2,
  CreditCard,
  Calculator,
  Play
} from 'lucide-react';
import { Course, SeminarWorkshop, WebsiteGalleryItem, WebsiteBlogPost, AppLanguage, WebsiteSectionVisibility, WebsiteSubPage } from '../../types';
import { HeroBannerSlider } from './HeroBannerSlider';
import { getTranslation } from '../../utils/translations';
import {
  trackMetaPixelEvent,
  trackUnifiedMarketingEvent,
  getCapturedUtmParams,
  getDeviceType
} from '../../utils/analyticsTracker';
import { getWhatsAppDirectUrl } from '../../utils/whatsappHelper';
import { getHomepageSeoMetadata, applySeoMetadata, isDirectVideo, formatMediaEmbedUrl } from '../../utils/seoHelper';

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
    placements,
    staffList
  } = useAcademy();

  // Bilingual Language State
  const [language, setLanguage] = useState<AppLanguage>('bn');

  // Active SubPage View (defaults to 'home', or initialized from query param / hash)
  const [activeSubPage, setActiveSubPage] = useState<WebsiteSubPage>(() => {
    if (typeof window === 'undefined') return 'home';
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page') || params.get('subpage');
    if (pageParam && ['courses', 'seminars', 'success-stories', 'mentors', 'gallery', 'about', 'contact', 'verify-certificate', 'blog'].includes(pageParam)) {
      return pageParam as WebsiteSubPage;
    }
    const hash = window.location.hash.toLowerCase();
    if (hash === '#courses' || hash === '#courses-page') return 'courses';
    if (hash === '#seminars' || hash === '#seminar') return 'seminars';
    if (hash === '#success-stories' || hash === '#success') return 'success-stories';
    if (hash === '#mentors' || hash === '#trainers') return 'mentors';
    if (hash === '#gallery') return 'gallery';
    if (hash === '#about' || hash === '#about-us') return 'about';
    if (hash === '#contact' || hash === '#contact-us') return 'contact';
    if (hash === '#verify' || hash === '#verify-certificate') return 'verify-certificate';
    if (hash === '#blog') return 'blog';
    return 'home';
  });

  const navigateSubPage = (page: WebsiteSubPage) => {
    setActiveSubPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const url = new URL(window.location.href);
      if (page === 'home') {
        url.searchParams.delete('page');
        url.searchParams.delete('subpage');
        if (url.hash) url.hash = '';
      } else {
        url.searchParams.set('page', page);
      }
      window.history.pushState({ subpage: page }, '', url.toString());
    } catch {
      // safe fallback
    }
  };

  // Sync subpage on browser Back / Forward navigation
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = (params.get('page') || params.get('subpage')) as WebsiteSubPage;
      if (pageParam && ['courses', 'seminars', 'success-stories', 'mentors', 'gallery', 'about', 'contact', 'verify-certificate', 'blog'].includes(pageParam)) {
        setActiveSubPage(pageParam);
      } else {
        setActiveSubPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Active Filters for Course Section
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<'All' | 'Offline' | 'Online' | 'Pre Recorded'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>('');
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const coursesDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close Courses dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (coursesDropdownRef.current && !coursesDropdownRef.current.contains(event.target as Node)) {
        setIsCoursesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const popularNavCategories = [
    { name: 'Graphic Design', query: 'Graphic Design' },
    { name: 'UI/UX Design', query: 'UI/UX Design' },
    { name: 'Web Development', query: 'Web Development' },
    { name: 'Full Stack Development', query: 'Full Stack Development' },
    { name: 'Python & AI', query: 'Python' },
    { name: 'Digital Marketing', query: 'Digital Marketing' },
    { name: 'Video Editing & Motion', query: 'Video' }
  ];

  const handleNavCategoryClick = (query: string) => {
    const matchedCategory = categories.find(
      c => c.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(c.toLowerCase())
    ) || query;

    setSelectedCategory(matchedCategory);
    setIsCoursesDropdownOpen(false);
    navigateSubPage('courses');
  };

  const handleExploreAllCourses = () => {
    setSelectedCategory('All');
    setIsCoursesDropdownOpen(false);
    navigateSubPage('courses');
  };
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
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const [selectedCourseForInstallment, setSelectedCourseForInstallment] = useState<Course | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [resolvedHeroVideoUrl, setResolvedHeroVideoUrl] = useState<string>(websiteCmsConfig?.heroVideoUrl || '');
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // Brand Name & Subline resolution
  const brandPrimary = websiteCmsConfig?.brandPrimary || 'NexGen';
  const brandAccent = websiteCmsConfig?.brandAccent || 'Computer Academy';
  const brandSubline = websiteCmsConfig?.brandSubline || websiteCmsConfig?.headerSubtitle || 'Computer Training Institute';

  // Resolve IndexedDB video if applicable
  React.useEffect(() => {
    let active = true;
    let createdBlobUrl = '';
    const rawUrl = websiteCmsConfig?.heroVideoUrl || '';
    if (rawUrl.startsWith('indexeddb:')) {
      setIsVideoLoading(true);
      getVideoBlobUrl(rawUrl).then(url => {
        if (active) {
          if (url) {
            createdBlobUrl = url;
            setResolvedHeroVideoUrl(url);
          } else {
            setResolvedHeroVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
          }
          setIsVideoLoading(false);
        }
      }).catch(() => {
        if (active) {
          setResolvedHeroVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
          setIsVideoLoading(false);
        }
      });
    } else {
      setResolvedHeroVideoUrl(rawUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ');
      setIsVideoLoading(false);
    }
    return () => {
      active = false;
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [websiteCmsConfig?.heroVideoUrl]);

  // Auto-apply dynamic Homepage SEO metadata, Canonical URL & JSON-LD Schemas
  React.useEffect(() => {
    const seoMeta = getHomepageSeoMetadata(academySettings, websiteCmsConfig);
    applySeoMetadata(seoMeta);
  }, [academySettings, websiteCmsConfig]);

  // Auto-capture UTM params and fire Unified Marketing PageView (Meta, GA4, GTM, Google Ads)
  React.useEffect(() => {
    const utms = getCapturedUtmParams();
    const marketing = websiteCmsConfig?.marketing;
    const pageTitle = websiteCmsConfig?.seo?.metaTitle || `${academySettings.instituteName || 'Nexgen Computer Academy'} - IT Training Institute`;
    
    trackUnifiedMarketingEvent('page_view', {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: window.location.pathname,
      institute_name: academySettings.instituteName,
      ...utms
    }, {
      pixelId: marketing?.metaPixelId,
      metaPixelEnabled: marketing?.metaPixelEnabled !== false,
      metaCapiEnabled: marketing?.metaCapiEnabled,
      googleAnalyticsId: marketing?.googleAnalyticsId,
      googleAnalyticsEnabled: marketing?.googleAnalyticsEnabled !== false,
      googleAdsConversionId: marketing?.googleAdsConversionId,
      googleAdsConversionLabel: marketing?.googleAdsConversionLabel,
      googleAdsEnabled: marketing?.googleAdsEnabled
    });

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
  }, [websiteCmsConfig?.marketing, websiteCmsConfig?.seo?.metaTitle, academySettings.instituteName]);

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

  const handleSubmitInquiry = async (payload: {
    fullName: string;
    phone: string;
    email?: string;
    courseId?: string;
    courseName?: string;
    message?: string;
  }) => {
    const activeCounselor = staffList.find(s => s.role === 'COUNSELOR' && s.status === 'Active') ||
      staffList.find(s => s.role === 'COUNSELOR') ||
      staffList[0];
    const counselorId = activeCounselor?.id || 'st-desk';
    const counselorName = activeCounselor ? `${activeCounselor.name} (${activeCounselor.designation || 'Counseling Desk'})` : 'Counseling Desk';
    const todayDate = new Date().toISOString().split('T')[0];

    const newLeadData = {
      fullName: payload.fullName,
      studentName: payload.fullName,
      name: payload.fullName,
      phone: payload.phone,
      email: payload.email || '',
      courseId: payload.courseId || (courses[0]?.id || ''),
      courseName: payload.courseName || '',
      interestedCourseId: payload.courseId || (courses[0]?.id || ''),
      source: 'Website Contact Page',
      leadSource: 'Website Contact Page',
      notes: payload.message ? `[Website Inquiry] ${payload.message}` : '[Website Contact] Information requested',
      status: 'New' as const,
      counselorId,
      counselorName,
      occupation: 'Student / Professional',
      educationLevel: 'HSC / Graduate',
      visitDate: todayDate,
      firstContactDate: todayDate,
      comments: payload.message || ''
    };
    addLead(newLeadData);
    if (submitPublicLead) {
      submitPublicLead(newLeadData).catch(err => console.warn('Lead sync notice:', err));
    }
    return true;
  };

  const handleOpenEnroll = (course: Course) => {
    setSelectedCourseForAdmission(course);
    setIsAdmissionOpen(true);
    const m = websiteCmsConfig?.marketing;
    trackUnifiedMarketingEvent('enroll_click', {
      course_id: course.id,
      course_name: course.name,
      course_category: course.category,
      value: course.offerFee || course.regularFee || 0,
      currency: 'BDT'
    }, {
      pixelId: m?.metaPixelId,
      metaPixelEnabled: m?.metaPixelEnabled !== false,
      metaCapiEnabled: m?.metaCapiEnabled,
      googleAnalyticsId: m?.googleAnalyticsId,
      googleAnalyticsEnabled: m?.googleAnalyticsEnabled !== false,
      googleAdsConversionId: m?.googleAdsConversionId,
      googleAdsConversionLabel: m?.googleAdsConversionLabel,
      googleAdsEnabled: m?.googleAdsEnabled
    });
  };

  const handleOpenCourseDetails = (course: Course) => {
    setSelectedCourseForDetails(course);
    const m = websiteCmsConfig?.marketing;
    trackUnifiedMarketingEvent('view_course', {
      course_id: course.id,
      course_name: course.name,
      course_category: course.category,
      value: course.offerFee || course.regularFee || 0,
      currency: 'BDT'
    }, {
      pixelId: m?.metaPixelId,
      metaPixelEnabled: m?.metaPixelEnabled !== false,
      metaCapiEnabled: m?.metaCapiEnabled,
      googleAnalyticsId: m?.googleAnalyticsId,
      googleAnalyticsEnabled: m?.googleAnalyticsEnabled !== false
    });
  };

  const handleOpenSeminar = (seminar: SeminarWorkshop) => {
    setActiveSeminarForReg(seminar);
    const m = websiteCmsConfig?.marketing;
    trackUnifiedMarketingEvent('lead_submit', {
      seminar_id: seminar.id,
      seminar_title: seminar.title,
      content_name: seminar.title,
      content_category: 'Seminar Registration'
    }, {
      pixelId: m?.metaPixelId,
      metaPixelEnabled: m?.metaPixelEnabled !== false,
      metaCapiEnabled: m?.metaCapiEnabled,
      googleAnalyticsId: m?.googleAnalyticsId,
      googleAnalyticsEnabled: m?.googleAnalyticsEnabled !== false
    });
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

      {/* 1. TOP ANNOUNCEMENT BAR */}
      {(websiteCmsConfig?.newSectionVisibility?.topBar ?? true) && (
        <UniqueItTopBar
          phone={multiplePhones[0]?.number || academySettings.primarySupportPhone || '01798444444'}
          email={multipleEmails[0]?.email || academySettings.officialEmail || 'info@nexgenacademy.edu.bd'}
          onOpenDiscount={() => setShowExitIntent(true)}
          isAuthenticated={isAuthenticated}
          onOpenStaffLogin={onOpenStaffLogin}
          onOpenCmsAdmin={onOpenCmsAdmin}
        />
      )}

      {/* CRO URGENCY & SCARCITY COUNTDOWN BANNER */}
      {(websiteCmsConfig?.newSectionVisibility?.urgencyBanner ?? true) && (
        <NexgenUrgencyBanner
          onOpenAdmission={() => {
            setSelectedCourseForAdmission(null);
            setIsAdmissionOpen(true);
          }}
          title={websiteCmsConfig?.topNoticeTicker || 'নতুন অফলাইন ল্যাব ও অনলাইন ব্যাচে ভর্তি চলছে! সীমিত সিট বাকি'}
          badgeText={websiteCmsConfig?.heroBadgeText || 'Special Scholarship'}
          buttonText="আসন বুকিং করুন"
        />
      )}

      {/* 2. MAIN NAVBAR */}
      <UniqueItNavbar
        instituteName={academySettings.instituteName || 'NexGen Computer Academy'}
        brandPrimary={brandPrimary}
        brandAccent={brandAccent}
        brandSubline={brandSubline}
        customLogoUrl={websiteCmsConfig?.customLogoUrl || websiteCmsConfig?.headerLogoUrl || academySettings?.customLogoUrl}
        logoSizeMobile={websiteCmsConfig?.logoSizeMobile || 38}
        logoSizeDesktop={websiteCmsConfig?.logoSizeDesktop || 46}
        logoShape={websiteCmsConfig?.logoShape || 'contain'}
        activeSubPage={activeSubPage}
        onNavigateSubPage={navigateSubPage}
        onOpenAdmission={() => {
          setSelectedCourseForAdmission(null);
          setIsAdmissionOpen(true);
        }}
        onOpenStudentLogin={() => {
          if (onOpenStudentPortal) {
            onOpenStudentPortal();
          } else {
            setIsAdmissionOpen(true);
          }
        }}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenStaffLogin={onOpenStaffLogin}
        isAuthenticated={isAuthenticated}
        onOpenCmsAdmin={onOpenCmsAdmin}
      />

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
        onSelectCategory={(category) => {
          const matchedCategory = categories.find(
            c => c.toLowerCase().includes(category.toLowerCase()) || category.toLowerCase().includes(c.toLowerCase())
          ) || category;
          setSelectedCategory(matchedCategory);
        }}
        onNavigateSubPage={navigateSubPage}
      />

      {/* RENDER DEDICATED SUBPAGES OR FULL HOMEPAGE */}
      {activeSubPage !== 'home' ? (
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex flex-col items-center justify-center py-20 text-slate-500">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-semibold">পেজ লোড হচ্ছে...</p>
            </div>
          }
        >
          {activeSubPage === 'courses' ? (
            <CoursesSubPage
              courses={courses}
              categories={categories}
              batches={batches}
              onOpenEnroll={handleOpenEnroll}
              onOpenSyllabus={(c) => setSelectedCourseForSyllabus(c)}
              onOpenInstallment={(c) => {
                setSelectedCourseForInstallment(c);
                setIsInstallmentModalOpen(true);
              }}
              onOpenCourseLanding={(c) => window.dispatchEvent(new CustomEvent('open-course-landing', { detail: { course: c } }))}
              onBackToHome={() => navigateSubPage('home')}
            />
          ) : activeSubPage === 'seminars' ? (
            <SeminarsSubPage
              seminars={seminars}
              onOpenSeminarReg={handleOpenSeminar}
              onBackToHome={() => navigateSubPage('home')}
            />
          ) : activeSubPage === 'success-stories' ? (
            <SuccessStorySubPage
              stories={websiteCmsConfig.studentSuccessConfig?.stories}
              reviews={websiteReviews}
              onOpenAdmission={() => {
                setSelectedCourseForAdmission(null);
                setIsAdmissionOpen(true);
              }}
              onBackToHome={() => navigateSubPage('home')}
            />
          ) : activeSubPage === 'mentors' ? (
            <MentorsSubPage
              trainers={trainersList}
              onOpenCounseling={() => {
                setSelectedCourseForAdmission(null);
                setIsAdmissionOpen(true);
              }}
              onBackToHome={() => navigateSubPage('home')}
            />
          ) : activeSubPage === 'gallery' ? (
            <GallerySubPage
              galleryItems={websiteGallery}
              instituteName={academySettings.instituteName}
              onBackToHome={() => navigateSubPage('home')}
            />
          ) : activeSubPage === 'about' ? (
            <AboutUsSubPage
              aboutUs={websiteCmsConfig.aboutUs}
              academySettings={academySettings}
              websiteCmsConfig={websiteCmsConfig}
              onOpenAdmission={() => {
                setSelectedCourseForAdmission(null);
                setIsAdmissionOpen(true);
              }}
              onBackToHome={() => navigateSubPage('home')}
            />
          ) : activeSubPage === 'contact' ? (
            <ContactUsSubPage
              academySettings={academySettings}
              websiteCmsConfig={websiteCmsConfig}
              courses={courses}
              onSubmitInquiry={handleSubmitInquiry}
              onBackToHome={() => navigateSubPage('home')}
            />
          ) : activeSubPage === 'verify-certificate' ? (
            <VerifyCertificateSubPage
              onOpenStaffLogin={onOpenStaffLogin}
              onBackToHome={() => navigateSubPage('home')}
            />
          ) : activeSubPage === 'blog' ? (
            <BlogSubPage
              blogs={websiteBlogs || []}
              onSelectBlog={(b) => setSelectedBlogForReading(b)}
              onBackToHome={() => navigateSubPage('home')}
            />
          ) : null}
        </Suspense>
      ) : (
        <>
          {/* 1. HERO SECTION */}
          {(websiteCmsConfig?.newSectionVisibility?.hero ?? true) && (
            <UniqueItHero
              categories={categories}
              headline={websiteCmsConfig?.heroHeadline}
              subtitle={websiteCmsConfig?.heroSubtitle}
              badgeText={websiteCmsConfig?.heroBadgeText}
              primaryCtaText={websiteCmsConfig?.heroPrimaryCtaText}
              secondaryCtaText={websiteCmsConfig?.heroSecondaryCtaText}
              admissionCtaText={websiteCmsConfig?.heroCtaText}
              videoUrl={resolvedHeroVideoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
              videoThumbnailUrl={websiteCmsConfig?.heroVideoThumbnailUrl || "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80"}
              videoBadgeText={websiteCmsConfig?.heroVideoBadgeText || `${academySettings.instituteName || 'NexGen'} Campus`}
              videoCaptionText={websiteCmsConfig?.heroVideoCaption || "সরাসরি ফার্মগেট ক্যাম্পাসে প্র্যাকটিক্যাল ল্যাব ও অনলাইন ক্লাস"}
              onNavigateSubPage={navigateSubPage}
              onOpenAdmission={() => {
                setSelectedCourseForAdmission(null);
                setIsAdmissionOpen(true);
              }}
              onSearchCourse={(query, cat) => {
                setCourseSearchQuery(query);
                if (cat && cat !== "All") {
                  const matched = categories.find(c => c.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(c.toLowerCase()));
                  setSelectedCategory(matched || cat);
                }
                navigateSubPage("courses");
              }}
              onPlayVideo={() => setIsVideoModalOpen(true)}
            />
          )}

          {/* 1.5 ACCREDITATION & GOVT RECOGNITION TRUST STRIP (UY Lab Standard) */}
          {(websiteCmsConfig?.newSectionVisibility?.accreditationTrust ?? true) && (
            <AccreditationTrustStrip
              onOpenCounselingModal={() => {
                setSelectedCourseForAdmission(null);
                setIsAdmissionOpen(true);
              }}
            />
          )}

          {/* 2. CATEGORY SLIDER CHIPS */}
          {(websiteCmsConfig?.newSectionVisibility?.categorySlider ?? true) && (
            <UniqueItCategorySlider
              onSelectCategory={(catName) => {
                const matched = categories.find(c => c.toLowerCase().includes(catName.toLowerCase()) || catName.toLowerCase().includes(c.toLowerCase()));
                setSelectedCategory(matched || catName);
                navigateSubPage("courses");
              }}
            />
          )}

          {/* 3. POPULAR COURSES (3x3 Grid with All, Online, Offline, Pre Recorded filters) */}
          {(websiteCmsConfig?.newSectionVisibility?.popularCourses ?? true) && (
            <UniqueItPopularCourses
              courses={courses}
              batches={batches}
              onSelectCourseForAdmission={(c) => {
                setSelectedCourseForAdmission(c);
                setIsAdmissionOpen(true);
              }}
              onSelectCourseForDetails={(c) => {
                setSelectedCourseForDetails(c);
              }}
              onOpenCourseLanding={(c) => {
                window.dispatchEvent(new CustomEvent('open-course-landing', { detail: { course: c } }));
              }}
              onViewAllCourses={() => navigateSubPage("courses")}
            />
          )}

          {/* 3.5 UPCOMING FREE SEMINARS & WORKSHOPS (High-converting Funnel) */}
          {(websiteCmsConfig?.newSectionVisibility?.homepageSeminars ?? true) && (
            <NexgenHomepageSeminars
              seminars={seminars}
              onOpenSeminarReg={handleOpenSeminar}
              onViewAllSeminars={() => navigateSubPage('seminars')}
            />
          )}

          {/* 3.6 FREE CAREER COUNSELING & CALL REQUEST BANNER */}
          {(websiteCmsConfig?.newSectionVisibility?.freeCounselingBanner ?? true) && (
            <FreeCounselingLeadBanner
              courses={courses}
              title={websiteCmsConfig?.counselingBannerConfig?.title}
              subtitle={websiteCmsConfig?.counselingBannerConfig?.subtitle}
              tagText={websiteCmsConfig?.counselingBannerConfig?.tagText}
              hotlineOverride={websiteCmsConfig?.counselingBannerConfig?.hotlineOverride}
              whatsappOverride={websiteCmsConfig?.counselingBannerConfig?.whatsappOverride}
            />
          )}

          {/* 3.7 EXPAT & OVERSEAS BANGLADESHI LEARNERS HUB (NRI Support) */}
          {(websiteCmsConfig?.newSectionVisibility?.expatTrustBanner ?? true) && (
            <NexgenExpatTrustBanner
              onOpenAdmission={() => {
                setSelectedCourseForAdmission(null);
                setIsAdmissionOpen(true);
              }}
              whatsappNumber={
                websiteCmsConfig?.expatTrustBannerConfig?.whatsappOverride ||
                websiteCmsConfig.floatingActionWidget?.whatsappNumber ||
                academySettings.primarySupportPhone
              }
              config={websiteCmsConfig?.expatTrustBannerConfig}
            />
          )}

          {/* 4. EXPLORE CATEGORIES (4 Delivery Format Cards) */}
          {(websiteCmsConfig?.newSectionVisibility?.exploreCategories ?? true) && (
            <UniqueItExploreCategories
              onNavigateSubPage={navigateSubPage}
              onFilterDeliveryMode={(mode) => {
                setSelectedDeliveryMode(mode);
              }}
            />
          )}

          {/* 5. ABOUT HERO & 6 STATS COUNTERS */}
          {(websiteCmsConfig?.newSectionVisibility?.aboutHero ?? true) && (
            <UniqueItAboutHero
              config={websiteCmsConfig?.aboutHeroConfig}
              onNavigateSubPage={navigateSubPage}
            />
          )}

          {/* 6. ONLINE COURSES SECTION (Streamlined: courses covered in Popular Courses tabs) */}
          {(websiteCmsConfig?.newSectionVisibility?.onlineCourses ?? false) && (
            <UniqueItOnlineCourses
              courses={courses}
              onSelectCourseForAdmission={(c) => {
                setSelectedCourseForAdmission(c);
                setIsAdmissionOpen(true);
              }}
              onSelectCourseForDetails={(c) => {
                setSelectedCourseForDetails(c);
              }}
              onViewAllCourses={() => {
                setSelectedDeliveryMode("Online");
                navigateSubPage("courses");
              }}
            />
          )}

          {/* 7. REAL RESULTS - SUCCESS STORIES */}
          {(websiteCmsConfig?.newSectionVisibility?.successStories ?? true) && (
            <UniqueItSuccessStories
              stories={websiteCmsConfig?.studentSuccessConfig?.stories}
              onViewAllStories={() => navigateSubPage("success-stories")}
            />
          )}

          {/* 8. STUDENT REVIEWS */}
          {(websiteCmsConfig?.newSectionVisibility?.studentReviews ?? true) && (
            <UniqueItStudentReviews
              reviews={websiteReviews}
            />
          )}

          {/* 9. WHY CHOOSE NEXGEN ACADEMY? (Interactive Feature Pillars) */}
          {(websiteCmsConfig?.newSectionVisibility?.whyChoose ?? true) && (
            <UniqueItWhyChoose
              config={websiteCmsConfig?.whyChooseConfig}
            />
          )}

          {/* 10. UPGRADE YOUR LEARNING EXPERIENCE (Newsletter / Workshop CTA) */}
          {(websiteCmsConfig?.newSectionVisibility?.newsletterCta ?? true) && (
            <UniqueItNewsletter
              config={websiteCmsConfig?.newsletterCtaConfig}
            />
          )}

          {/* 11. CAMPUS LIFE PHOTO GALLERY */}
          {(websiteCmsConfig?.newSectionVisibility?.photoStrip ?? true) && (
            <UniqueItPhotoStrip
              galleryItems={websiteGallery}
            />
          )}

          {/* 12. FREQUENTLY ASKED QUESTIONS */}
          {(websiteCmsConfig?.newSectionVisibility?.faqs ?? true) && (
            <UniqueItFaq
              faqs={websiteFaqs}
              supportPhone={multiplePhones[0]?.number || academySettings.primarySupportPhone || '01798444444'}
              whatsappNumber={websiteCmsConfig.floatingActionWidget?.whatsappNumber || academySettings.primarySupportPhone}
              onOpenCounseling={() => {
                setSelectedCourseForAdmission(null);
                setIsAdmissionOpen(true);
              }}
            />
          )}

          {/* 13. EXCLUSIVE SOLUTIONS THAT SET US APART (Streamlined: merged with Why Choose Us) */}
          {(websiteCmsConfig?.newSectionVisibility?.exclusiveSolutions ?? false) && (
            <UniqueItExclusiveSolutions
              config={websiteCmsConfig?.exclusiveSolutionsConfig}
            />
          )}

          {/* 14. GOOGLE LOCATION MAP & FARMGATE CAMPUS SHOWCASE */}
          {(websiteCmsConfig?.newSectionVisibility?.locationMap ?? true) && (
            <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 font-black text-xs uppercase tracking-wider">
                    Physical Campus & Lab Location
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                    Visit Our <span className="text-[#6b1cb0]">Farmgate Campus</span> & IT Lab
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    সরাসরি ক্যাম্পাসে এসে হাই-কনফিগ এসি কম্পিউটার ল্যাব পরিদর্শন করুন, ফ্রি ক্যারিয়ার কাউন্সেলিং নিন এবং মেন্টরদের সাথে সরাসরি কথা বলে কোর্স বাছাই করুন।
                  </p>
                </div>

                {/* Map Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* Left Column: Interactive Map Box */}
                  <div className="lg:col-span-8 h-full min-h-[440px]">
                    <CampusLocationMapBox
                      embedUrl={websiteCmsConfig?.googleMapEmbedUrl}
                      shareUrl={websiteCmsConfig?.googleMapShareUrl}
                      address={academySettings.officialAddress || websiteCmsConfig?.officeAddress || 'Level-4, Farmgate Super Market, Farmgate, Dhaka-1215'}
                      directions={websiteCmsConfig?.campusDirections || 'Located 2 minutes walk from Farmgate Metro Station, opposite to Green Super Market.'}
                      instituteName={academySettings.instituteName || 'NexGen Computer Academy'}
                    />
                  </div>

                  {/* Right Column: Campus Details & Timings Cards */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                    {/* Address Card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center space-x-2 text-indigo-600">
                        <MapPin className="w-5 h-5 shrink-0" />
                        <h4 className="font-black text-sm text-slate-900">হেড অফিস ও মূল ক্যাম্পাস</h4>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {academySettings.officialAddress || websiteCmsConfig?.officeAddress || 'Level-4, Farmgate Super Market, Farmgate, Dhaka-1215'}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center space-x-2 text-[11px] text-slate-500">
                        <Navigation className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>ফার্মগেট মেট্রো স্টেশন (Exit 3) থেকে মাত্র ২ মিনিট হাঁটার পথ</span>
                      </div>
                    </div>

                    {/* Visiting Hours Card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center space-x-2 text-emerald-600">
                        <Clock className="w-5 h-5 shrink-0" />
                        <h4 className="font-black text-sm text-slate-900">ল্যাব ও অফিস সময়সূচি</h4>
                      </div>
                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="font-medium">শনিবার - বৃহস্পতিবার:</span>
                          <span className="font-bold text-slate-900">সকাল ৯:০০ - রাত ৯:০০</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="font-medium">শুক্রবার (জুম্মা বিরতি সহ):</span>
                          <span className="font-bold text-slate-900">বিকাল ২:৩০ - রাত ৯:০০</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200/60 mt-1">
                        ✓ সপ্তাহে ৭ দিনই শিক্ষার্থীদের জন্য ফ্রি ল্যাব প্র্যাকটিস উন্মুক্ত
                      </p>
                    </div>

                    {/* Hotline Direct Action Card */}
                    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-md space-y-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
                          Instant Assistance
                        </span>
                        <h4 className="text-sm font-black text-white mt-0.5">লোকেশন খুঁজে পেতে সমস্যা?</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          আমাদের সাপোর্ট ডেস্কে ফোন করুন, আপনাকে সরাসরি গাইড করা হবে।
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 pt-1">
                        <a
                          href={`tel:${academySettings.primarySupportPhone || '01798444444'}`}
                          className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{academySettings.primarySupportPhone || '01798444444'}</span>
                        </a>
                        <a
                          href={websiteCmsConfig?.googleMapShareUrl || 'https://share.google/9W8K1XZHLbZxFpF8G'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-colors border border-white/20"
                          title="Open Google Maps"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>গুগল ম্যাপ</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 15. SO WHY DELAY? (Streamlined: avoid dual CTA banners right before footer) */}
          {(websiteCmsConfig?.newSectionVisibility?.snakeCta ?? false) && (
            <UniqueItSnakeCta
              config={websiteCmsConfig?.snakeCtaConfig}
              onOpenAdmission={() => {
                setSelectedCourseForAdmission(null);
                setIsAdmissionOpen(true);
              }}
            />
          )}

          {/* 16. ADMISSION IS GOING ON BANNER */}
          {(websiteCmsConfig?.newSectionVisibility?.admissionBanner ?? true) && (
            <UniqueItAdmissionBanner
              config={websiteCmsConfig?.admissionBannerConfig}
              onNavigateSubPage={navigateSubPage}
              onOpenAdmission={() => {
                setSelectedCourseForAdmission(null);
                setIsAdmissionOpen(true);
              }}
            />
          )}
        </>
      )}

      {/* FOOTER */}
      {(websiteCmsConfig?.newSectionVisibility?.footer ?? true) && (
        <UniqueItFooter
          onNavigateSubPage={navigateSubPage}
          onOpenStudentLogin={() => {
            if (onOpenStudentPortal) onOpenStudentPortal();
            else setIsAdmissionOpen(true);
          }}
          onOpenStudentRegister={() => {
            setSelectedCourseForAdmission(null);
            setIsAdmissionOpen(true);
          }}
          onOpenPolicyModal={(policy) => setActivePolicyModal(policy)}
          courses={courses}
          instituteName={academySettings.instituteName || 'NexGen Computer Academy'}
          brandPrimary={brandPrimary}
          brandAccent={brandAccent}
          brandSubline={brandSubline}
          customLogoUrl={websiteCmsConfig?.customLogoUrl || websiteCmsConfig?.footerLogoUrl || websiteCmsConfig?.headerLogoUrl || academySettings?.customLogoUrl}
          footerLogoSizeMobile={websiteCmsConfig?.footerLogoSizeMobile || 34}
          footerLogoSizeDesktop={websiteCmsConfig?.footerLogoSizeDesktop || 40}
          logoShape={websiteCmsConfig?.logoShape || 'contain'}
          officialAddress={academySettings.officialAddress || 'Level-4, Farmgate Super Market, Farmgate, Dhaka-1215'}
          officialEmail={academySettings.officialEmail || 'info@nexgenacademy.edu.bd'}
          primaryPhone={multiplePhones[0]?.number || academySettings.primarySupportPhone || '01798444444'}
          helplines={multiplePhones.length > 0 ? multiplePhones.map(p => p.number) : (academySettings.helplines || ['01798444444', '+880 1711-223344', '+880 1811-556677'])}
          onOpenStaffLogin={onOpenStaffLogin}
          paymentMerchantsConfig={websiteCmsConfig?.paymentMerchantsConfig}
        />
      )}

      {/* FLOATING DISCOUNT BUTTON */}
      <UniqueItFloatingDiscount onClick={() => setShowExitIntent(true)} />

      {/* HERO & SUCCESS STORY VIDEO MODAL */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            {isVideoLoading || resolvedHeroVideoUrl.startsWith('indexeddb:') ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-3 bg-black">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-bold">ভিডিও প্রস্তুত হচ্ছে...</span>
              </div>
            ) : resolvedHeroVideoUrl.startsWith('blob:') || isDirectVideo(resolvedHeroVideoUrl) ? (
              <video
                src={resolvedHeroVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <iframe
                src={formatMediaEmbedUrl(resolvedHeroVideoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ", true)}
                title="NexGen Computer Academy Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}

      {/* POPUP MODALS */}
      <Suspense fallback={null}>
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
      </Suspense>

      {/* Lightbox for Gallery Photo */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative max-h-[70vh] bg-slate-50 flex items-center justify-center p-3">
              <img
                src={selectedGalleryImage.imageUrl}
                alt={selectedGalleryImage.title}
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-md border border-slate-200"
              />
            </div>
            <div className="p-5 flex items-center justify-between text-slate-900 bg-white border-t border-slate-200">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedGalleryImage.category}
                </span>
                <h4 className="font-bold text-base text-slate-900 mt-1">{selectedGalleryImage.title}</h4>
                {selectedGalleryImage.caption && (
                  <p className="text-xs text-slate-500 mt-0.5">{selectedGalleryImage.caption}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedGalleryImage(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
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
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => {
            setShowExitIntent(false);
            sessionStorage.setItem('nca_exit_intent_dismissed', 'true');
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-indigo-100 relative text-center space-y-4 my-auto max-h-[92dvh] overflow-y-auto"
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
      <Suspense fallback={null}>
        <LeadCapturePopupModal
          config={websiteCmsConfig.leadCapturePopup}
          courses={courses}
          onSubmitLead={async (payload) => {
            const leadSourceStr = payload.source || 'Website Popup Voucher';
            const selectedCourseObj = courses.find(c => c.id === payload.courseId);
            const todayDate = new Date().toISOString().split('T')[0];

            // Dynamic counselor resolution
            const activeCounselor = staffList.find(s => s.role === 'COUNSELOR' && s.status === 'Active') ||
              staffList.find(s => s.role === 'COUNSELOR') ||
              staffList.find(s => s.status === 'Active') ||
              staffList[0];
            const counselorId = activeCounselor?.id || 'st-desk';
            const counselorName = activeCounselor ? `${activeCounselor.name} (${activeCounselor.designation || 'Admissions Desk'})` : 'Admissions Desk';

            const newLeadData = {
              fullName: payload.fullName,
              studentName: payload.fullName,
              name: payload.fullName,
              phone: payload.phone,
              email: payload.email || '',
              courseId: payload.courseId || (courses[0]?.id || ''),
              courseName: selectedCourseObj?.name || payload.courseId || '',
              interestedCourseId: payload.courseId || (courses[0]?.id || ''),
              learningMode: payload.learningMode || 'Offline',
              preferredLearningMode: payload.learningMode || 'Offline',
              address: payload.location || '',
              location: payload.location || '',
              locationCity: payload.location || '',
              source: leadSourceStr,
              leadSource: leadSourceStr,
              notes: payload.notes || `[Website Popup] Promo Voucher Claimed`,
              status: 'New' as const,
              counselorId,
              counselorName,
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

        {/* TOP NOTICE & PROMO BANNER CMS EDIT MODAL */}
        <TopNoticeTickerModal
          isOpen={isTopNoticeModalOpen}
          onClose={() => setIsTopNoticeModalOpen(false)}
        />

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

        {/* 0% EASY INSTALLMENT & FEE BREAKDOWN CALCULATOR MODAL */}
        <CourseFeeInstallmentCalculatorModal
          isOpen={isInstallmentModalOpen}
          onClose={() => setIsInstallmentModalOpen(false)}
          courses={courses}
          initialCourse={selectedCourseForInstallment}
          onProceedAdmission={(course, planText) => {
            setSelectedCourseForAdmission(course);
            setIsAdmissionOpen(true);
          }}
        />
      </Suspense>

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

      {/* SOCIAL PROOF REAL-TIME ADMISSIONS & INQUIRY TICKER */}
      <SocialProofTicker />
    </div>
  );
};
