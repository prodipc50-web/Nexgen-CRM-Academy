import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Home,
  BookOpen,
  Calendar,
  Building,
  Users,
  ImageIcon,
  FileText,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Zap,
  Star,
  LogIn,
  Sliders,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Award,
  Video,
  Monitor,
  MessageCircle
} from 'lucide-react';
import { NexgenLogo } from '../common/NexgenLogo';
import { AcademySettings, WebsiteCmsConfig } from '../../types';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  academySettings: AcademySettings;
  websiteCmsConfig?: WebsiteCmsConfig;
  coursesCount: number;
  seminarsCount: number;
  onOpenAdmission: () => void;
  onOpenStaffLogin: () => void;
  onOpenCmsAdmin?: () => void;
  isAuthenticated: boolean;
  onSelectDeliveryMode?: (mode: 'All' | 'Offline' | 'Online' | 'Pre Recorded') => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  academySettings,
  websiteCmsConfig,
  coursesCount,
  seminarsCount,
  onOpenAdmission,
  onOpenStaffLogin,
  onOpenCmsAdmin,
  isAuthenticated,
  onSelectDeliveryMode
}) => {
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavClick = (href: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    onClose();
    if (href === '#' || href === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const primaryPhone =
    websiteCmsConfig?.multiplePhones?.[0]?.number ||
    academySettings.primarySupportPhone ||
    (academySettings.helplines && academySettings.helplines[0]) ||
    '01798444444';

  const rawPhone = primaryPhone.replace(/[^0-9]/g, '');
  const whatsappNumber = rawPhone.startsWith('88') ? rawPhone : `88${rawPhone}`;
  const address = websiteCmsConfig?.officeAddress || academySettings.officialAddress || 'Ananda Tower (3rd Floor), Farmgate, Dhaka-1215';
  const email = websiteCmsConfig?.multipleEmails?.[0]?.email || academySettings.officialEmail || 'info@nexgenacademy.edu.bd';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex justify-end">
          {/* Backdrop with Fade and Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280, mass: 0.9 }}
            className="relative w-full max-w-[340px] xs:max-w-[380px] h-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden border-l border-slate-200"
          >
            {/* 1. Drawer Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="p-1 bg-white/10 rounded-xl border border-white/20 shadow-xs shrink-0">
                  <NexgenLogo variant="crest" size={36} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-white leading-tight truncate">
                    {academySettings.instituteName || 'Nexgen Computer Academy'}
                  </h3>
                  <p className="text-[11px] text-indigo-200 font-medium truncate">
                    {academySettings.campusName || 'Farmgate Campus'}
                  </p>
                </div>
              </div>

              {/* Close Button with generous touch target */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors active:scale-95 shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-5 divide-y divide-slate-100">
              {/* Primary Call to Action Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdmission();
                  }}
                  className="w-full min-h-[48px] py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Online Admission (অনলাইন ভর্তি)</span>
                </button>

                {/* Quick Delivery Mode Filters */}
                {onSelectDeliveryMode && (
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDeliveryMode('Offline');
                        handleNavClick('#courses');
                      }}
                      className="min-h-[44px] p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center flex flex-col items-center justify-center transition-colors active:scale-95"
                    >
                      <Building className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
                      <span className="text-[10px] font-bold text-emerald-800 leading-none">Offline Lab</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDeliveryMode('Online');
                        handleNavClick('#courses');
                      }}
                      className="min-h-[44px] p-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-center flex flex-col items-center justify-center transition-colors active:scale-95"
                    >
                      <Video className="w-3.5 h-3.5 text-rose-600 mb-0.5" />
                      <span className="text-[10px] font-bold text-rose-800 leading-none">Online Live</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDeliveryMode('Pre Recorded');
                        handleNavClick('#courses');
                      }}
                      className="min-h-[44px] p-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-center flex flex-col items-center justify-center transition-colors active:scale-95"
                    >
                      <Monitor className="w-3.5 h-3.5 text-purple-600 mb-0.5" />
                      <span className="text-[10px] font-bold text-purple-800 leading-none">Pre-Recorded</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Main Navigation Links */}
              <div className="pt-4 space-y-1">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block px-2 mb-2">
                  Academic Sections (মূল পাতা)
                </span>

                <a
                  href="#"
                  onClick={(e) => handleNavClick('#', e)}
                  className="min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <Home className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">Home (হোম)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="#courses"
                  onClick={() => handleNavClick('#courses')}
                  className="min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">Courses (কোর্সসমূহ)</span>
                      <span className="text-[10px] text-slate-400 font-medium">All Career Programs</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {coursesCount || 10}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </a>

                <a
                  href="#seminars"
                  onClick={() => handleNavClick('#seminars')}
                  className="min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">Free Seminars (ফ্রি সেমিনার)</span>
                      <span className="text-[10px] text-slate-400 font-medium">Upcoming Workshops</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                      Free
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </a>

                <a
                  href="#verify-certificate"
                  onClick={() => handleNavClick('#verify-certificate')}
                  className="min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100 transition-colors active:scale-[0.98] border border-emerald-200/60"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-black text-sm block text-emerald-950">Verify Certificate</span>
                      <span className="text-[10px] text-emerald-700 font-medium">Govt. Verified QR System</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                </a>

                <a
                  href="#about"
                  onClick={() => handleNavClick('#about')}
                  className="min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                      <Building className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">About Us (আমাদের সম্পর্কে)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="#community"
                  onClick={() => handleNavClick('#community')}
                  className="min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">Student Community</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="#gallery"
                  onClick={() => handleNavClick('#gallery')}
                  className="min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">Campus & Lab Gallery</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="#blog"
                  onClick={() => handleNavClick('#blog')}
                  className="min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">Tech & Career Blog</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="#reviews"
                  onClick={() => handleNavClick('#reviews')}
                  className="min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </div>
                    <span className="font-bold text-sm">Student Reviews</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="#contact"
                  onClick={() => handleNavClick('#contact')}
                  className="min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">Contact Campus (ঠিকানা)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Portal & Staff Management Links */}
              <div className="pt-4 space-y-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block px-2 mb-2">
                  Portal & Admin (প্রশাসনিক এক্সেস)
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenStaffLogin();
                  }}
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between bg-slate-900 hover:bg-indigo-900 text-white font-bold text-sm transition-colors active:scale-[0.98] shadow-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-white/10 text-indigo-300 flex items-center justify-center font-bold">
                      <LogIn className="w-4 h-4" />
                    </div>
                    <span>{isAuthenticated ? 'Open ERP Portal (ড্যাশবোর্ড)' : 'Staff Login (স্টাফ পোর্টাল)'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {isAuthenticated && onOpenCmsAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCmsAdmin();
                    }}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-sm transition-colors active:scale-[0.98]"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <span>Edit Website CMS</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-600" />
                  </button>
                )}
              </div>

              {/* Campus Contact & Hotline Assistance */}
              <div className="pt-4 space-y-3">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block px-2">
                  Direct Assistance (সহায়তা)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${primaryPhone}`}
                    className="min-h-[44px] p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-center space-x-2 font-bold text-xs active:scale-95 transition-all"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Call Hotline</span>
                  </a>

                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] p-2.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 rounded-2xl flex items-center justify-center space-x-2 font-bold text-xs active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Drawer Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-center shrink-0">
              <p className="text-[10px] text-slate-400 font-medium">
                © {new Date().getFullYear()} {academySettings.instituteName || 'Nexgen Computer Academy'}. All rights reserved.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
