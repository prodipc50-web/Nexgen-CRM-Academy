import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import {
  GraduationCap,
  Loader2,
  ShieldAlert,
  LayoutDashboard,
  AlertCircle,
  Users,
  Menu
} from 'lucide-react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { UserRole } from './types';
import { HeaderNavbar } from './components/layout/HeaderNavbar';
import { SidebarNav } from './components/layout/SidebarNav';

// Public & Auth Views (Fast Direct Load)
import { PublicWebsiteView } from './components/website/PublicWebsiteView';
import { MasterCourseLandingPageView } from './components/website/MasterCourseLandingPageView';
import { LoginView } from './components/auth/LoginView';
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt';

// Lazy-loaded CRM / ERP Internal Views
const DashboardView = lazy(() => import('./components/views/DashboardView').then(m => ({ default: m.DashboardView })));
const CRMView = lazy(() => import('./components/views/CRMView').then(m => ({ default: m.CRMView })));
const StudentsView = lazy(() => import('./components/views/StudentsView').then(m => ({ default: m.StudentsView })));
const CoursesView = lazy(() => import('./components/views/CoursesView').then(m => ({ default: m.CoursesView })));
const BatchesView = lazy(() => import('./components/views/BatchesView').then(m => ({ default: m.BatchesView })));
const ClassScheduleView = lazy(() => import('./components/views/ClassScheduleView').then(m => ({ default: m.ClassScheduleView })));
const AssignmentsProjectsView = lazy(() => import('./components/views/AssignmentsProjectsView').then(m => ({ default: m.AssignmentsProjectsView })));
const AttendanceView = lazy(() => import('./components/views/AttendanceView').then(m => ({ default: m.AttendanceView })));
const AccountsPaymentsView = lazy(() => import('./components/views/AccountsPaymentsView').then(m => ({ default: m.AccountsPaymentsView })));
const DueManagementView = lazy(() => import('./components/views/DueManagementView').then(m => ({ default: m.DueManagementView })));
const ExpensesView = lazy(() => import('./components/views/ExpensesView').then(m => ({ default: m.ExpensesView })));
const FinancialReportsView = lazy(() => import('./components/views/FinancialReportsView').then(m => ({ default: m.FinancialReportsView })));
const ExamsCertificatesView = lazy(() => import('./components/views/ExamsCertificatesView').then(m => ({ default: m.ExamsCertificatesView })));
const PlacementsCareerCellView = lazy(() => import('./components/views/PlacementsCareerCellView').then(m => ({ default: m.PlacementsCareerCellView })));
const SeminarsWorkshopsView = lazy(() => import('./components/views/SeminarsWorkshopsView').then(m => ({ default: m.SeminarsWorkshopsView })));
const MarketingView = lazy(() => import('./components/views/MarketingView').then(m => ({ default: m.MarketingView })));
const InventoryStaffView = lazy(() => import('./components/views/InventoryStaffView').then(m => ({ default: m.InventoryStaffView })));
const ReportsCenterView = lazy(() => import('./components/views/ReportsCenterView').then(m => ({ default: m.ReportsCenterView })));
const AIAssistantView = lazy(() => import('./components/views/AIAssistantView').then(m => ({ default: m.AIAssistantView })));
const SettingsView = lazy(() => import('./components/views/SettingsView').then(m => ({ default: m.SettingsView })));
const RecycleBinView = lazy(() => import('./components/views/RecycleBinView').then(m => ({ default: m.RecycleBinView })));
const WebsiteCMSView = lazy(() => import('./components/views/WebsiteCMSView').then(m => ({ default: m.WebsiteCMSView })));
const StudentPortalView = lazy(() => import('./components/portal/StudentPortalView').then(m => ({ default: m.StudentPortalView })));

// Lazy-loaded Modals
const GlobalSearchModal = lazy(() => import('./components/modals/GlobalSearchModal').then(m => ({ default: m.GlobalSearchModal })));
const NewAdmissionModal = lazy(() => import('./components/modals/NewAdmissionModal').then(m => ({ default: m.NewAdmissionModal })));
const NewLeadModal = lazy(() => import('./components/modals/NewLeadModal').then(m => ({ default: m.NewLeadModal })));
const FollowUpModal = lazy(() => import('./components/modals/FollowUpModal').then(m => ({ default: m.FollowUpModal })));
const CollectPaymentModal = lazy(() => import('./components/modals/CollectPaymentModal').then(m => ({ default: m.CollectPaymentModal })));
const MoneyReceiptModal = lazy(() => import('./components/modals/MoneyReceiptModal').then(m => ({ default: m.MoneyReceiptModal })));
const CertificateModal = lazy(() => import('./components/modals/CertificateModal').then(m => ({ default: m.CertificateModal })));
const NewExpenseModal = lazy(() => import('./components/modals/NewExpenseModal').then(m => ({ default: m.NewExpenseModal })));
const StudentProfileModal = lazy(() => import('./components/modals/StudentProfileModal').then(m => ({ default: m.StudentProfileModal })));
const BulkBatchIdCardModal = lazy(() => import('./components/modals/BulkBatchIdCardModal').then(m => ({ default: m.BulkBatchIdCardModal })));

import { Lead, Course } from './types';

// Synchronous route resolver to guarantee 0ms flash of login on public visits
const getInitialRouteState = (): {
  mode: 'erp' | 'website' | 'student_portal' | 'course_landing';
  targetSlug: string;
} => {
  if (typeof window === 'undefined') {
    return { mode: 'website', targetSlug: '' };
  }
  const path = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);

  // Student portal route
  if (path.startsWith('/portal') || path.startsWith('/student-portal') || search.includes('portal=true')) {
    return { mode: 'student_portal', targetSlug: '' };
  }

  // Explicit ERP / CRM / Admin / Login route
  if (
    path.startsWith('/erp') ||
    path.startsWith('/admin') ||
    path.startsWith('/crm') ||
    path.startsWith('/login') ||
    path.startsWith('/dashboard') ||
    search.includes('erp=true') ||
    search.includes('admin=true')
  ) {
    return { mode: 'erp', targetSlug: '' };
  }

  // Course landing route
  const courseQuery = urlParams.get('course') || urlParams.get('courseId') || urlParams.get('landing');
  const courseMatch = window.location.pathname.match(/^\/(?:courses?|landing)\/([^/?#]+)/i);
  let pathSlug = '';
  if (courseMatch && courseMatch[1]) {
    pathSlug = decodeURIComponent(courseMatch[1]).trim();
  }
  const target = (courseQuery || pathSlug || '').trim();
  if (target) {
    return { mode: 'course_landing', targetSlug: target };
  }

  // Default to public website for root "/" and all other public visitor paths
  return { mode: 'website', targetSlug: '' };
};

const findCourseBySlugOrQuery = (coursesList: Course[], target: string): Course | null => {
  if (!target || !coursesList.length) return null;
  const targetClean = target.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (
    coursesList.find(c => {
      const courseSlug = c.seo?.slug || c.landingConfig?.slug || (c as any).slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const customSeoSlugClean = (c.seo?.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const landingSlugClean = (c.landingConfig?.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const slugClean = courseSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
      const nameClean = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const idClean = c.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const codeClean = c.code.toLowerCase().replace(/[^a-z0-9]/g, '');

      return (
        slugClean === targetClean ||
        customSeoSlugClean === targetClean ||
        landingSlugClean === targetClean ||
        idClean === targetClean ||
        codeClean === targetClean ||
        nameClean === targetClean ||
        nameClean.includes(targetClean) ||
        targetClean.includes(slugClean)
      );
    }) || null
  );
};

const TAB_ALLOWED_ROLES: Record<string, UserRole[]> = {
  dashboard: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'TRAINER'],
  crm: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR'],
  students: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  courses: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  batches: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  schedule: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  assignments: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TRAINER', 'COUNSELOR'],
  projects: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TRAINER', 'COUNSELOR'],
  attendance: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TRAINER'],
  exams: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TRAINER'],
  certificates: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  exams_certificates: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  placements: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  careers: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  seminars: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR'],
  workshops: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR'],
  payments: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS'],
  due: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'COUNSELOR'],
  expenses: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS'],
  'financial-reports': ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS'],
  financial_reports: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS'],
  marketing: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR'],
  website_cms: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR'],
  cms: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR'],
  website: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR'],
  'inventory-staff': ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
  inventory_staff: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
  reports: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'COUNSELOR'],
  reports_center: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'COUNSELOR'],
  'ai-assistant': ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'TRAINER'],
  ai_copilot: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'TRAINER'],
  settings: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
  'recycle-bin': ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'COUNSELOR', 'TRAINER'],
  trash: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'COUNSELOR', 'TRAINER'],
};

const AcademyAppContent: React.FC = () => {
  const { leads, courses, isAuthenticated, currentUser, websiteCmsConfig, stats } = useAcademy();
  const initialRoute = useMemo(() => getInitialRouteState(), []);
  const [viewMode, setViewMode] = useState<'erp' | 'website' | 'student_portal' | 'course_landing'>(initialRoute.mode);
  const [currentCourseSlug, setCurrentCourseSlug] = useState<string>(initialRoute.targetSlug);
  const [landingCourse, setLandingCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Synchronously compute active course from courses list & redirects
  const matchedCourse = useMemo(() => {
    if (landingCourse && !currentCourseSlug) return landingCourse;
    if (!currentCourseSlug || !courses.length) return landingCourse;
    
    let target = currentCourseSlug;
    if (websiteCmsConfig?.seo?.courseRedirects?.length) {
      const matchingRedirect = websiteCmsConfig.seo.courseRedirects.find(
        r => (r.fromSlug || r.oldSlug || '').toLowerCase().replace(/[^a-z0-9]/g, '') === target.toLowerCase().replace(/[^a-z0-9]/g, '')
      );
      const destinationSlug = matchingRedirect?.toSlug || matchingRedirect?.newSlug;
      if (destinationSlug) {
        target = destinationSlug;
      }
    }
    const found = findCourseBySlugOrQuery(courses, target);
    return found || landingCourse;
  }, [courses, currentCourseSlug, landingCourse, websiteCmsConfig?.seo?.courseRedirects]);

  // Auto-detect course parameter from URL or path on load with redirect support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const courseQuery = urlParams.get('course') || urlParams.get('courseId') || urlParams.get('landing');
      
      let pathSlug = '';
      const path = window.location.pathname;
      const courseMatch = path.match(/^\/(?:courses?|landing)\/([^/?#]+)/i);
      if (courseMatch && courseMatch[1]) {
        pathSlug = decodeURIComponent(courseMatch[1]).trim();
      }

      let target = (courseQuery || pathSlug || '').trim();

      if (target && websiteCmsConfig?.seo?.courseRedirects?.length) {
        const matchingRedirect = websiteCmsConfig.seo.courseRedirects.find(
          r => (r.fromSlug || r.oldSlug || '').toLowerCase().replace(/[^a-z0-9]/g, '') === target.toLowerCase().replace(/[^a-z0-9]/g, '')
        );
        const destinationSlug = matchingRedirect?.toSlug || matchingRedirect?.newSlug;
        if (destinationSlug) {
          target = destinationSlug;
          const newUrl = `/courses/${destinationSlug}`;
          window.history.replaceState(null, '', newUrl);
        }
      }

      if (target) {
        setCurrentCourseSlug(target);
        setViewMode('course_landing');
      }
    }
  }, [websiteCmsConfig?.seo?.courseRedirects]);

  // Modal State Controllers (All hooks must be defined before any conditional return)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState<boolean>(false);
  const [prefilledLeadForAdmission, setPrefilledLeadForAdmission] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [followUpLeadId, setFollowUpLeadId] = useState<string | null>(null);
  const [collectPaymentAdmissionId, setCollectPaymentAdmissionId] = useState<string | null>(null);
  const [receiptNumberToPrint, setReceiptNumberToPrint] = useState<string | null>(null);
  const [certificateNumberToPrint, setCertificateNumberToPrint] = useState<string | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);
  const [selectedStudentProfileId, setSelectedStudentProfileId] = useState<string | null>(null);
  const [isBulkIdModalOpen, setIsBulkIdModalOpen] = useState<boolean>(false);

  // Global Keyboard Shortcut: Ctrl/Cmd + K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for global website/ERP view switches
  useEffect(() => {
    const handleSwitchToWebsite = () => setViewMode('website');
    const handleSwitchToErp = () => setViewMode('erp');
    const handleSwitchToStudentPortal = () => setViewMode('student_portal');
    const handleOpenBulkCards = () => setIsBulkIdModalOpen(true);
    const handleOpenCourseLanding = (e: any) => {
      const course = e.detail?.course;
      if (course) {
        setLandingCourse(course);
        setViewMode('course_landing');
      }
    };

    window.addEventListener('open-public-website', handleSwitchToWebsite);
    window.addEventListener('open-erp-portal', handleSwitchToErp);
    window.addEventListener('open-student-portal', handleSwitchToStudentPortal);
    window.addEventListener('open-bulk-id-cards', handleOpenBulkCards);
    window.addEventListener('open-course-landing', handleOpenCourseLanding);
    return () => {
      window.removeEventListener('open-public-website', handleSwitchToWebsite);
      window.removeEventListener('open-erp-portal', handleSwitchToErp);
      window.removeEventListener('open-student-portal', handleSwitchToStudentPortal);
      window.removeEventListener('open-bulk-id-cards', handleOpenBulkCards);
      window.removeEventListener('open-course-landing', handleOpenCourseLanding);
    };
  }, []);

  // 1. If user is in Course Landing Page mode, render dedicated Master Course page
  if (viewMode === 'course_landing') {
    if (matchedCourse) {
      return (
        <MasterCourseLandingPageView
          course={matchedCourse}
          onBackToFullWebsite={() => {
            setViewMode('website');
            setCurrentCourseSlug('');
            setLandingCourse(null);
            if (typeof window !== 'undefined') {
              window.history.pushState(null, '', '/');
            }
          }}
        />
      );
    }
    
    // Clean public loading / not-found state (NEVER flashes CRM login portal to public visitors)
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 animate-pulse">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-100 mb-2">কোর্স পেজ লোড হচ্ছে...</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          অনুগ্রহ করে অপেক্ষা করুন, লেটেস্ট কোর্স কারিকুলাম ও অফার ফি প্রস্তুত করা হচ্ছে।
        </p>
        <button
          onClick={() => {
            setViewMode('website');
            setCurrentCourseSlug('');
            setLandingCourse(null);
            if (typeof window !== 'undefined') {
              window.history.pushState(null, '', '/');
            }
          }}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
        >
          সকল কোর্স ও মূল ওয়েবসাইটে ফিরে যান
        </button>
      </div>
    );
  }

  // 2. If user is in Student Portal mode, render Student Self-Service Portal
  if (viewMode === 'student_portal') {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-4" />
            <p className="text-sm font-semibold">Student Portal লোড হচ্ছে...</p>
          </div>
        }
      >
        <StudentPortalView onBackToWebsite={() => setViewMode('website')} />
      </Suspense>
    );
  }

  // 3. If user is in Website view mode, render public landing website
  if (viewMode === 'website') {
    return (
      <PublicWebsiteView
        onOpenStaffLogin={() => setViewMode('erp')}
        onOpenStudentPortal={() => setViewMode('student_portal')}
        onOpenCmsAdmin={() => {
          setViewMode('erp');
          setActiveTab('website_cms');
        }}
      />
    );
  }

  // 4. ERP / CRM Portal Mode — If in ERP mode and not authenticated, present the secure login portal
  if (!isAuthenticated) {
    return <LoginView onBackToWebsite={() => setViewMode('website')} />;
  }

  const handleOpenAdmissionWithLead = (lead: Lead) => {
    setPrefilledLeadForAdmission(lead);
    setIsAdmissionModalOpen(true);
  };

  const handleOpenDirectAdmission = () => {
    setPrefilledLeadForAdmission(null);
    setIsAdmissionModalOpen(true);
  };

  const activeFollowUpLead = followUpLeadId ? leads.find(l => l.id === followUpLeadId) || null : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col antialiased selection:bg-indigo-600 selection:text-white font-erp">
      {/* Top Universal Navbar */}
      <HeaderNavbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNewAdmission={handleOpenDirectAdmission}
        onOpenNewLead={() => setIsLeadModalOpen(true)}
        onOpenAddPayment={() => setCollectPaymentAdmissionId('')}
        onOpenAddExpense={() => setIsExpenseModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        onViewPublicWebsite={() => setViewMode('website')}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6 items-start pb-20 lg:pb-6">
        {/* Left Navigation Sidebar */}
        <SidebarNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          isOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onViewPublicWebsite={() => setViewMode('website')}
        />

        {/* Center Main Viewport */}
        <main className="flex-1 w-full min-w-0">
          <Suspense
            fallback={
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-12 shadow-xs flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                <p className="text-xs font-bold text-slate-600">মডিউল প্রস্তুত হচ্ছে...</p>
              </div>
            }
          >
            {/* Strict Role-Based View Guard (403 Unauthorized Prevention) */}
            {TAB_ALLOWED_ROLES[activeTab] && !TAB_ALLOWED_ROLES[activeTab].includes(currentUser.role) ? (
              <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 text-[11px] font-extrabold rounded-full mb-3 uppercase tracking-wider">
                  HTTP 403 • ACCESS DENIED
                </span>
                <h2 className="text-xl font-black text-slate-900 mb-2">Unauthorized Module Access</h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Your current role <strong className="text-slate-900 font-bold">({currentUser.role})</strong> does not have permission to access the <strong className="text-slate-900 font-bold">"{activeTab}"</strong> module. This access attempt has been logged for security compliance.
                </p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  Return to Authorized Dashboard
                </button>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <DashboardView
                    onOpenNewAdmission={handleOpenDirectAdmission}
                    onOpenNewLead={() => setIsLeadModalOpen(true)}
                    onOpenAddPayment={() => setCollectPaymentAdmissionId('')}
                    onOpenAddExpense={() => setIsExpenseModalOpen(true)}
                    onSelectStudent={(stuId) => setSelectedStudentProfileId(stuId)}
                    onSelectLead={(leadId) => {
                      setActiveTab('crm');
                    }}
                    onOpenFollowUp={(leadId) => setFollowUpLeadId(leadId)}
                    onOpenCollectPayment={(admId) => setCollectPaymentAdmissionId(admId)}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'crm' && (
                  <CRMView
                    onOpenNewLead={() => setIsLeadModalOpen(true)}
                    onOpenFollowUp={(leadId) => setFollowUpLeadId(leadId)}
                    onOpenAdmissionWithLead={handleOpenAdmissionWithLead}
                  />
                )}

                {activeTab === 'students' && (
                  <StudentsView
                    onOpenNewAdmission={handleOpenDirectAdmission}
                    onSelectStudent={(stuId) => setSelectedStudentProfileId(stuId)}
                    onOpenCollectPayment={(admId) => setCollectPaymentAdmissionId(admId)}
                  />
                )}

                {activeTab === 'courses' && <CoursesView />}

                {activeTab === 'batches' && (
                  <BatchesView onSelectStudent={(stuId) => setSelectedStudentProfileId(stuId)} />
                )}

                {activeTab === 'schedule' && <ClassScheduleView />}

                {(activeTab === 'assignments' || activeTab === 'projects') && <AssignmentsProjectsView />}

                {activeTab === 'attendance' && <AttendanceView />}

                {(activeTab === 'exams' || activeTab === 'certificates' || activeTab === 'exams_certificates') && (
                  <ExamsCertificatesView
                    onOpenCertificateModal={(certNum) => setCertificateNumberToPrint(certNum)}
                  />
                )}

                {(activeTab === 'placements' || activeTab === 'careers') && <PlacementsCareerCellView />}

                {(activeTab === 'seminars' || activeTab === 'workshops') && (
                  <SeminarsWorkshopsView
                    onOpenNewAdmissionWithLead={handleOpenAdmissionWithLead}
                  />
                )}

                {activeTab === 'payments' && (
                  <AccountsPaymentsView
                    onOpenAddPayment={() => setCollectPaymentAdmissionId('')}
                    onOpenReceiptModal={(rNum) => setReceiptNumberToPrint(rNum)}
                    onSelectStudent={(stuId) => setSelectedStudentProfileId(stuId)}
                  />
                )}

                {activeTab === 'due' && (
                  <DueManagementView
                    onOpenCollectPayment={(admId) => setCollectPaymentAdmissionId(admId)}
                    onSelectStudent={(stuId) => setSelectedStudentProfileId(stuId)}
                  />
                )}

                {activeTab === 'expenses' && (
                  <ExpensesView onOpenAddExpense={() => setIsExpenseModalOpen(true)} />
                )}

                {(activeTab === 'financial-reports' || activeTab === 'financial_reports') && <FinancialReportsView />}

                {activeTab === 'marketing' && <MarketingView />}

                {(activeTab === 'website_cms' || activeTab === 'website' || activeTab === 'cms') && (
                  <WebsiteCMSView onViewLiveWebsite={() => setViewMode('website')} />
                )}

                {(activeTab === 'inventory-staff' || activeTab === 'inventory_staff') && <InventoryStaffView />}

                {(activeTab === 'reports' || activeTab === 'reports_center') && <ReportsCenterView />}

                {(activeTab === 'ai-assistant' || activeTab === 'ai_copilot') && <AIAssistantView />}

                {activeTab === 'settings' && (
                  <SettingsView onViewPublicWebsite={() => setViewMode('website')} />
                )}
                {(activeTab === 'recycle-bin' || activeTab === 'trash') && <RecycleBinView />}
              </>
            )}
          </Suspense>
        </main>
      </div>

      {/* Global Interactive Modals Suite */}
      <Suspense fallback={null}>
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectStudent={(stuId) => setSelectedStudentProfileId(stuId)}
          onSelectLead={(leadId) => {
            setActiveTab('crm');
          }}
          onSelectCourse={(courseId) => {
            setActiveTab('courses');
          }}
          onSelectBatch={(batchId) => {
            setActiveTab('batches');
          }}
        />

        <NewAdmissionModal
          isOpen={isAdmissionModalOpen}
          onClose={() => {
            setIsAdmissionModalOpen(false);
            setPrefilledLeadForAdmission(null);
          }}
          initialLead={prefilledLeadForAdmission}
          onSuccessAdmission={(admId, rNum) => {
            if (rNum) {
              setReceiptNumberToPrint(rNum);
            }
          }}
        />

        <NewLeadModal
          isOpen={isLeadModalOpen}
          onClose={() => setIsLeadModalOpen(false)}
        />

        <FollowUpModal
          isOpen={!!followUpLeadId}
          lead={activeFollowUpLead}
          onClose={() => setFollowUpLeadId(null)}
        />

        <CollectPaymentModal
          isOpen={collectPaymentAdmissionId !== null}
          targetAdmissionId={collectPaymentAdmissionId || undefined}
          onClose={() => setCollectPaymentAdmissionId(null)}
          onSuccessPayment={(rNum) => setReceiptNumberToPrint(rNum)}
        />

        <MoneyReceiptModal
          isOpen={!!receiptNumberToPrint}
          receiptNumber={receiptNumberToPrint || undefined}
          onClose={() => setReceiptNumberToPrint(null)}
        />

        <CertificateModal
          isOpen={!!certificateNumberToPrint}
          certificateId={certificateNumberToPrint || undefined}
          onClose={() => setCertificateNumberToPrint(null)}
        />

        <NewExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
        />

        <StudentProfileModal
          studentId={selectedStudentProfileId}
          onClose={() => setSelectedStudentProfileId(null)}
          onOpenCollectPayment={(admId) => setCollectPaymentAdmissionId(admId)}
          onOpenReceiptModal={(rNum) => setReceiptNumberToPrint(rNum)}
          onOpenCertificateModal={(certNum) => setCertificateNumberToPrint(certNum)}
        />

        <BulkBatchIdCardModal
          isOpen={isBulkIdModalOpen}
          onClose={() => setIsBulkIdModalOpen(false)}
        />
      </Suspense>

      {/* Mobile Bottom Navigation Bar (lg:hidden) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors ${
            activeTab === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors ${
            activeTab === 'students' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Students</span>
        </button>

        <button
          onClick={() => setActiveTab('due')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors relative ${
            activeTab === 'due' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Dues</span>
          {stats.overdueDueAmount > 0 && (
            <span className="absolute top-1 right-1/4 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('crm')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors relative ${
            activeTab === 'crm' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Leads</span>
          {stats.todayFollowupsCount > 0 && (
            <span className="absolute top-1 right-1/4 px-1 rounded-full bg-amber-500 text-white text-[9px] font-black leading-tight">
              {stats.todayFollowupsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Menu</span>
        </button>
      </nav>

      {/* Progressive Web App (PWA) Mobile Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default function App() {
  return (
    <AcademyProvider>
      <AcademyAppContent />
    </AcademyProvider>
  );
}
