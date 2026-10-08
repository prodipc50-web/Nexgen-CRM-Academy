import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, User, BookOpen, Sparkles, ShieldCheck, Award, Phone } from 'lucide-react';
import { WebsiteSubPage } from '../../../types';
import { NexgenLogo } from '../../common/NexgenLogo';

interface NexgenNavbarProps {
  instituteName?: string;
  brandPrimary?: string;
  brandAccent?: string;
  brandSubline?: string;
  customLogoUrl?: string;
  logoSizeMobile?: number;
  logoSizeDesktop?: number;
  logoShape?: 'contain' | 'square' | 'wide';
  activeSubPage: WebsiteSubPage;
  onNavigateSubPage: (page: WebsiteSubPage) => void;
  onOpenAdmission: () => void;
  onOpenStudentLogin: () => void;
  onOpenMobileMenu: () => void;
  onOpenStaffLogin?: () => void;
  isAuthenticated?: boolean;
  onOpenCmsAdmin?: () => void;
}

export const NexgenNavbar: React.FC<NexgenNavbarProps> = ({
  instituteName = 'NexGen Computer Academy',
  brandPrimary = 'NexGen',
  brandAccent = 'Computer Academy',
  brandSubline = 'Computer Training Institute',
  customLogoUrl,
  logoSizeMobile,
  logoSizeDesktop,
  logoShape,
  activeSubPage,
  onNavigateSubPage,
  onOpenAdmission,
  onOpenStudentLogin,
  onOpenMobileMenu,
  onOpenStaffLogin,
  isAuthenticated,
  onOpenCmsAdmin
}) => {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [studentOpen, setStudentOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const coursesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const studentRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (coursesRef.current && !coursesRef.current.contains(e.target as Node)) setCoursesOpen(false);
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
      if (studentRef.current && !studentRef.current.contains(e.target as Node)) setStudentOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigateSubPage('home')}
          className="flex items-center cursor-pointer select-none group shrink-0"
        >
          {/* If customized name is used and no custom logo is uploaded, show crest + custom text */}
          {(brandPrimary !== 'NexGen' || brandAccent !== 'Computer Academy') && (!customLogoUrl || customLogoUrl === '/brand-logo.png') ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <NexgenLogo
                variant="crest"
                size={logoSizeMobile || 38}
                desktopSize={logoSizeDesktop || 46}
                customLogoUrl={customLogoUrl}
                shape={logoShape || 'contain'}
                className="shrink-0 transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-1 leading-tight sm:leading-none">
                  <span className="text-[12px] sm:text-base md:text-xl font-black text-slate-900 tracking-tight leading-tight">
                    {brandPrimary}
                  </span>
                  <span className="text-[11px] sm:text-base md:text-xl font-black text-[#dc143c] tracking-tight leading-tight">
                    {brandAccent}
                  </span>
                </div>
                {brandSubline && (
                  <span className="text-[7.5px] sm:text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5 sm:mt-1 truncate max-w-[150px] sm:max-w-none">
                    {brandSubline}
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Official Unified Brand Logo (matches 02-horizontal.png) */
            <NexgenLogo
              variant="horizontal"
              size={logoSizeMobile || 38}
              desktopSize={logoSizeDesktop || 44}
              customLogoUrl={customLogoUrl}
              shape={logoShape || 'contain'}
              className="shrink-0 transition-transform group-hover:scale-102"
            />
          )}
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-[13px] font-bold text-slate-700">
          <button
            type="button"
            onClick={() => onNavigateSubPage('home')}
            className={`transition-colors cursor-pointer ${
              activeSubPage === 'home' ? 'text-[#e11d48]' : 'hover:text-[#e11d48]'
            }`}
          >
            Home
          </button>

          {/* Courses Dropdown */}
          <div className="relative" ref={coursesRef}>
            <button
              type="button"
              onClick={() => setCoursesOpen(!coursesOpen)}
              className={`flex items-center space-x-1 cursor-pointer transition-colors ${
                activeSubPage === 'courses' ? 'text-[#e11d48]' : 'hover:text-[#e11d48]'
              }`}
            >
              <span>Courses</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${coursesOpen ? 'rotate-180' : ''}`} />
            </button>
            {coursesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setCoursesOpen(false);
                    onNavigateSubPage('courses');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  All Courses (সকল কোর্স)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCoursesOpen(false);
                    onNavigateSubPage('courses');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  Online Courses
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCoursesOpen(false);
                    onNavigateSubPage('courses');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  Offline Classroom Batches
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCoursesOpen(false);
                    onNavigateSubPage('courses');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  Pre-Recorded Courses
                </button>
              </div>
            )}
          </div>

          {/* Services Dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              onClick={() => setServicesOpen(!servicesOpen)}
              className="flex items-center space-x-1 cursor-pointer hover:text-[#e11d48] transition-colors"
            >
              <span>Services</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setServicesOpen(false);
                    onNavigateSubPage('seminars');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium flex items-center justify-between"
                >
                  <span>Free Career Seminar</span>
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded">Free</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setServicesOpen(false);
                    onNavigateSubPage('about');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  Corporate Training
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setServicesOpen(false);
                    onNavigateSubPage('about');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  1-on-1 Freelance Mentorship
                </button>
              </div>
            )}
          </div>

          {/* Student Dropdown */}
          <div className="relative" ref={studentRef}>
            <button
              type="button"
              onClick={() => setStudentOpen(!studentOpen)}
              className="flex items-center space-x-1 cursor-pointer hover:text-[#e11d48] transition-colors"
            >
              <span>Student</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${studentOpen ? 'rotate-180' : ''}`} />
            </button>
            {studentOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStudentOpen(false);
                    onOpenStudentLogin();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  Student Portal Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudentOpen(false);
                    onOpenAdmission();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  New Student Admission
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudentOpen(false);
                    onNavigateSubPage('verify-certificate');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  Verify Certificate
                </button>
              </div>
            )}
          </div>

          {/* More Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center space-x-1 cursor-pointer hover:text-[#e11d48] transition-colors"
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            {moreOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    onNavigateSubPage('success-stories');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  Success Stories (সাকসেস স্টোরি)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    onNavigateSubPage('mentors');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  Our Mentors (মেন্টরস প্যানেল)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    onNavigateSubPage('gallery');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  Our Gallery (ক্যাম্পাস গ্যালারি)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    onNavigateSubPage('about');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  About Us (আমাদের সম্পর্কে)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    onNavigateSubPage('blog');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-[#e11d48] font-medium"
                >
                  Blog & Articles (ব্লগ)
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigateSubPage('contact')}
            className={`transition-colors cursor-pointer ${
              activeSubPage === 'contact' ? 'text-[#e11d48]' : 'hover:text-[#e11d48]'
            }`}
          >
            Contact Us
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateSubPage('courses')}
            className="px-4 py-2 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap hidden sm:inline-flex items-center space-x-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Browse Course</span>
          </button>

          <button
            type="button"
            onClick={onOpenStudentLogin}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white text-[11px] sm:text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center space-x-1 sm:space-x-1.5"
          >
            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Student Login</span>
          </button>

          {onOpenStaffLogin && (
            <button
              type="button"
              onClick={onOpenStaffLogin}
              className="px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap hidden md:inline-flex items-center space-x-1.5"
              title="Admin & Staff CRM Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAuthenticated ? 'ERP Dashboard' : 'Staff Portal'}</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open Navigation Menu"
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export { NexgenNavbar as UniqueItNavbar };
