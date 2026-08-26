import React, { useState, useEffect } from 'react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { HeaderNavbar } from './components/layout/HeaderNavbar';
import { SidebarNav } from './components/layout/SidebarNav';

// Page Views
import { DashboardView } from './components/views/DashboardView';
import { CRMView } from './components/views/CRMView';
import { StudentsView } from './components/views/StudentsView';
import { CoursesView } from './components/views/CoursesView';
import { BatchesView } from './components/views/BatchesView';
import { ClassScheduleView } from './components/views/ClassScheduleView';
import { AssignmentsProjectsView } from './components/views/AssignmentsProjectsView';
import { AttendanceView } from './components/views/AttendanceView';
import { AccountsPaymentsView } from './components/views/AccountsPaymentsView';
import { DueManagementView } from './components/views/DueManagementView';
import { ExpensesView } from './components/views/ExpensesView';
import { FinancialReportsView } from './components/views/FinancialReportsView';
import { ExamsCertificatesView } from './components/views/ExamsCertificatesView';
import { PlacementsCareerCellView } from './components/views/PlacementsCareerCellView';
import { SeminarsWorkshopsView } from './components/views/SeminarsWorkshopsView';
import { MarketingView } from './components/views/MarketingView';
import { InventoryStaffView } from './components/views/InventoryStaffView';
import { ReportsCenterView } from './components/views/ReportsCenterView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { SettingsView } from './components/views/SettingsView';
import { RecycleBinView } from './components/views/RecycleBinView';
import { WebsiteCMSView } from './components/views/WebsiteCMSView';
import { PublicWebsiteView } from './components/website/PublicWebsiteView';
import { CourseLandingPageView } from './components/website/CourseLandingPageView';
import { MasterCourseLandingPageView } from './components/website/MasterCourseLandingPageView';
import { StudentPortalView } from './components/portal/StudentPortalView';

// Modals
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { NewAdmissionModal } from './components/modals/NewAdmissionModal';
import { NewLeadModal } from './components/modals/NewLeadModal';
import { FollowUpModal } from './components/modals/FollowUpModal';
import { CollectPaymentModal } from './components/modals/CollectPaymentModal';
import { MoneyReceiptModal } from './components/modals/MoneyReceiptModal';
import { CertificateModal } from './components/modals/CertificateModal';
import { NewExpenseModal } from './components/modals/NewExpenseModal';
import { StudentProfileModal } from './components/modals/StudentProfileModal';
import { IdCardAdmitCardModal } from './components/modals/IdCardAdmitCardModal';
import { BulkBatchIdCardModal } from './components/modals/BulkBatchIdCardModal';
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt';

// Auth View
import { LoginView } from './components/auth/LoginView';

import { Lead, Course } from './types';

const AcademyAppContent: React.FC = () => {
  const { leads, courses, isAuthenticated } = useAcademy();
  const [viewMode, setViewMode] = useState<'erp' | 'website' | 'student_portal' | 'course_landing'>('erp');
  const [landingCourse, setLandingCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Auto-detect course parameter from URL or path on load
  useEffect(() => {
    if (typeof window !== 'undefined' && courses.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const courseQuery = urlParams.get('course') || urlParams.get('courseId');
      
      // Also check path-based URL: /course/graphic-design-with-ai
      let pathSlug = '';
      const path = window.location.pathname;
      const courseMatch = path.match(/^\/courses?\/([^/?#]+)/i);
      if (courseMatch && courseMatch[1]) {
        pathSlug = decodeURIComponent(courseMatch[1]).trim();
      }

      const target = (courseQuery || pathSlug || '').trim();

      if (target) {
        const targetClean = target.toLowerCase().replace(/[^a-z0-9]/g, '');
        const found = courses.find(c => {
          const courseSlug = (c as any).slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const slugClean = courseSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
          const nameClean = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const idClean = c.id.toLowerCase().replace(/[^a-z0-9]/g, '');
          const codeClean = c.code.toLowerCase().replace(/[^a-z0-9]/g, '');

          return (
            slugClean === targetClean ||
            idClean === targetClean ||
            codeClean === targetClean ||
            nameClean === targetClean ||
            nameClean.includes(targetClean) ||
            targetClean.includes(slugClean)
          );
        });

        if (found) {
          setLandingCourse(found);
          setViewMode('course_landing');
        }
      }
    }
  }, [courses]);

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

  // If user is in Course Landing Page mode, render dedicated Master Course page
  if (viewMode === 'course_landing' && landingCourse) {
    return (
      <MasterCourseLandingPageView
        course={landingCourse}
        onBackToFullWebsite={() => setViewMode('website')}
      />
    );
  }

  // If user is in Student Portal mode, render Student Self-Service Portal
  if (viewMode === 'student_portal') {
    return <StudentPortalView onBackToWebsite={() => setViewMode('website')} />;
  }

  // If user is in Website view mode, render public landing website
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

  // If in ERP mode and not authenticated, present the secure login portal
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
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6 items-start">
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
        </main>
      </div>

      {/* Global Interactive Modals Suite */}
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
