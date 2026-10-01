import React from 'react';
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram, Twitter } from 'lucide-react';
import { WebsiteSubPage, Course } from '../../../types';

interface UniqueItFooterProps {
  onNavigateSubPage: (page: WebsiteSubPage) => void;
  onOpenStudentLogin: () => void;
  onOpenStudentRegister: () => void;
  onOpenPolicyModal?: (policy: 'terms' | 'privacy') => void;
  courses?: Course[];
}

export const UniqueItFooter: React.FC<UniqueItFooterProps> = ({
  onNavigateSubPage,
  onOpenStudentLogin,
  onOpenStudentRegister,
  onOpenPolicyModal,
  courses
}) => {
  const popularCourses = [
    'Graphic Design with AI Online Course',
    'Digital Marketing Online Course',
    'Microsoft Office Application Course Online',
    'Professional UI/UX Design Course Online',
    'Professional Video Editing Course Online | Beginner to Pro',
    'AutoCAD 2D Course Online'
  ];

  return (
    <footer className="bg-[#081a38] text-slate-300 text-xs">
      {/* 4 Main Columns */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Head Office (4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">
              Head Office
            </h4>
            <div className="space-y-3 pt-1 text-slate-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#e11d48] shrink-0 mt-0.5" />
                <span>House # 37(Road # 5, Block # C) Rampura Banasree, Dhaka-1219</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-[#e11d48] shrink-0" />
                  <a href="tel:+8801722007005" className="hover:text-white transition-colors font-medium">
                    +8801722-007005
                  </a>
                </div>
                <div className="flex items-center space-x-2.5 pl-6">
                  <a href="tel:+8801795077536" className="hover:text-white transition-colors font-medium">
                    +8801795-077536
                  </a>
                </div>
                <div className="flex items-center space-x-2.5 pl-6">
                  <a href="tel:+8801795077692" className="hover:text-white transition-colors font-medium">
                    +8801795-077692
                  </a>
                </div>
                <div className="flex items-center space-x-2.5 pl-6">
                  <a href="tel:+8801741998731" className="hover:text-white transition-colors font-medium">
                    +8801741-998731
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 pt-1">
                <Mail className="w-4 h-4 text-[#e11d48] shrink-0" />
                <a href="mailto:info@uniqueitinstitute.com" className="hover:text-white transition-colors">
                  info@uniqueitinstitute.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={onOpenStudentLogin}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Student Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenStudentRegister}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Student Register
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSubPage('success-stories')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Success Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSubPage('gallery')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Our Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSubPage('verify-certificate')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Verify Certificate
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSubPage('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sitemap
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Courses (3.5 cols) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">
              Popular Courses
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              {popularCourses.map((cName, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => onNavigateSubPage('courses')}
                    className="hover:text-white transition-colors cursor-pointer text-left truncate max-w-full block"
                  >
                    {cName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Others (2 cols) */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">
              Others
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSubPage('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSubPage('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSubPage('blog')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyModal && onOpenPolicyModal('terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms & Condition
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyModal && onOpenPolicyModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSubPage('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Corporate Training
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Merchants Strip */}
      <div className="bg-[#051329] border-y border-slate-800/80 py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-4">
          <h4 className="text-center text-white font-black text-xs uppercase tracking-widest">
            Our Payment Merchant
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {/* bKash */}
            <div className="bg-white rounded-xl p-3 text-center border border-slate-700 flex flex-col items-center justify-center space-y-1">
              <span className="text-pink-600 font-black text-sm tracking-wide">bKash</span>
              <span className="text-[10px] text-slate-800 font-mono font-bold">01795077536</span>
            </div>

            {/* Nagad */}
            <div className="bg-white rounded-xl p-3 text-center border border-slate-700 flex flex-col items-center justify-center space-y-1">
              <span className="text-orange-600 font-black text-sm tracking-wide">নগদ</span>
              <span className="text-[10px] text-slate-800 font-mono font-bold">01795077536</span>
            </div>

            {/* Rocket */}
            <div className="bg-white rounded-xl p-3 text-center border border-slate-700 flex flex-col items-center justify-center space-y-1">
              <span className="text-purple-700 font-black text-sm tracking-wide">Rocket</span>
              <span className="text-[10px] text-slate-800 font-mono font-bold">01795077536</span>
            </div>

            {/* SSLCommerz */}
            <div className="bg-white rounded-xl p-3 text-center border border-slate-700 flex flex-col items-center justify-center space-y-1">
              <span className="text-blue-700 font-black text-sm tracking-wide">sslcommerz</span>
              <span className="text-[10px] text-slate-500 font-bold">Cards & Net Banking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Socials */}
      <div className="bg-[#030d1c] py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-black text-white tracking-tight">Unique</span>
            <span className="text-xl font-black text-[#0284c7] ml-1">IT</span>
          </div>

          {/* Copyright */}
          <p className="text-slate-400 text-[11px] text-center">
            Copyright © 2026 Unique IT Institute. All right reserved
          </p>

          {/* Social Icons */}
          <div className="flex items-center space-x-2">
            <a
              href="https://facebook.com/uniqueitinstitute"
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-sky-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Twitter"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="YouTube"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
