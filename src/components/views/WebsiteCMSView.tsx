import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  Globe,
  Layout,
  MessageSquare,
  Image as ImageIcon,
  Bell,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  Sliders,
  BookOpen,
  Info,
  Phone,
  Share2,
  FileText,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Smartphone,
  Layers,
  Users
} from 'lucide-react';
import { CmsHeroTab } from './cms/CmsHeroTab';
import { CmsCoursesTab } from './cms/CmsCoursesTab';
import { CmsAboutTab } from './cms/CmsAboutTab';
import { CmsContactTab } from './cms/CmsContactTab';
import { CmsSocialTab } from './cms/CmsSocialTab';
import { CmsBlogTab } from './cms/CmsBlogTab';
import { CmsPoliciesTab } from './cms/CmsPoliciesTab';
import { CmsReviewsTab } from './cms/CmsReviewsTab';
import { CmsGalleryTab } from './cms/CmsGalleryTab';
import { CmsTrainersTab } from './cms/CmsTrainersTab';
import { CmsNoticesTab } from './cms/CmsNoticesTab';
import { CmsFaqsTab } from './cms/CmsFaqsTab';
import { CmsStudentPortalTab } from './cms/CmsStudentPortalTab';
import { CmsNotificationsTab } from './cms/CmsNotificationsTab';

interface WebsiteCMSViewProps {
  onOpenPublicWebsite?: () => void;
  onViewLiveWebsite?: () => void;
  onOpenStudentPortal?: () => void;
}

export const WebsiteCMSView: React.FC<WebsiteCMSViewProps> = ({
  onOpenPublicWebsite,
  onViewLiveWebsite,
  onOpenStudentPortal
}) => {
  const handleOpenLive = onOpenPublicWebsite || onViewLiveWebsite;
  const { academySettings } = useAcademy();

  const [activeTab, setActiveTab] = useState<
    | 'hero'
    | 'trainers'
    | 'portal_config'
    | 'notifications'
    | 'courses'
    | 'about'
    | 'contact'
    | 'social'
    | 'blog'
    | 'reviews'
    | 'gallery'
    | 'notices'
    | 'faqs'
    | 'policies'
  >('hero');

  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const navTabs = [
    { id: 'hero', label: 'Hero & Banner Slider', icon: Layers, count: null, isHot: true },
    { id: 'trainers', label: 'Faculty & Mentors', icon: Users, count: null, isNew: true },
    { id: 'reviews', label: 'Student Reviews', icon: MessageSquare, count: null, isNew: true },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon, count: null },
    { id: 'portal_config', label: 'Student Portal Settings', icon: UserCheck, count: null },
    { id: 'notifications', label: 'SMS & WhatsApp Templates', icon: Smartphone, count: null },
    { id: 'courses', label: 'Course Details & Syllabus', icon: BookOpen, count: null },
    { id: 'about', label: 'About Us & Leadership', icon: Info, count: null },
    { id: 'contact', label: 'Contact & Multi-Channels', icon: Phone, count: null },
    { id: 'social', label: 'Social & Community Links', icon: Share2, count: null },
    { id: 'blog', label: 'Blog & Articles', icon: FileText, count: null },
    { id: 'notices', label: 'Notice Board', icon: Bell, count: null },
    { id: 'faqs', label: 'FAQ Manager', icon: HelpCircle, count: null },
    { id: 'policies', label: 'Terms & Privacy Policies', icon: ShieldCheck, count: null }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-black animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-[10px] font-black rounded-lg uppercase tracking-wider">
                Full-Stack Live CMS
              </span>
              <span className="flex items-center space-x-1 text-[11px] text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Public Portal & Website Synchronized</span>
              </span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center space-x-2">
              <Globe className="w-6 h-6 text-indigo-400" />
              <span>Website CMS & Public Content Manager</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Centrally manage all public website content, Multi-Slide Hero Banner, Student Self-Service Portal settings, Automated SMS/WhatsApp templates, Course syllabi, Photo Gallery, Legal policies, and Reviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            {onOpenStudentPortal && (
              <button
                onClick={onOpenStudentPortal}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>Student Portal</span>
              </button>
            )}

            {handleOpenLive && (
              <button
                onClick={handleOpenLive}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition-all hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Preview Public Website</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center space-x-1.5 min-w-max">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.isHot && (
                  <span className="px-1.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] rounded-md uppercase">
                    HOT
                  </span>
                )}
                {tab.isNew && (
                  <span className="px-1.5 py-0.5 bg-emerald-500 text-white font-black text-[9px] rounded-md uppercase">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'hero' && <CmsHeroTab onSuccessToast={triggerToast} />}
        {activeTab === 'trainers' && <CmsTrainersTab />}
        {activeTab === 'portal_config' && (
          <CmsStudentPortalTab
            onSuccessToast={triggerToast}
            onOpenStudentPortal={onOpenStudentPortal}
          />
        )}
        {activeTab === 'notifications' && <CmsNotificationsTab onSuccessToast={triggerToast} />}
        {activeTab === 'courses' && <CmsCoursesTab onSuccessToast={triggerToast} />}
        {activeTab === 'about' && <CmsAboutTab onSuccessToast={triggerToast} />}
        {activeTab === 'contact' && <CmsContactTab onSuccessToast={triggerToast} />}
        {activeTab === 'social' && <CmsSocialTab onSuccessToast={triggerToast} />}
        {activeTab === 'blog' && <CmsBlogTab onSuccessToast={triggerToast} />}
        {activeTab === 'reviews' && <CmsReviewsTab />}
        {activeTab === 'gallery' && <CmsGalleryTab />}
        {activeTab === 'notices' && <CmsNoticesTab onSuccessToast={triggerToast} />}
        {activeTab === 'faqs' && <CmsFaqsTab onSuccessToast={triggerToast} />}
        {activeTab === 'policies' && <CmsPoliciesTab onSuccessToast={triggerToast} />}
      </div>
    </div>
  );
};
