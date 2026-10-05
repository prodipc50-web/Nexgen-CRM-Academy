import React, { useState } from 'react';
import { CheckCircle2, BookOpen, Laptop, Sparkles, Search, Play, ChevronDown } from 'lucide-react';
import { WebsiteSubPage } from '../../../types';

interface UniqueItHeroProps {
  categories?: string[];
  headline?: string;
  subtitle?: string;
  badgeText?: string;
  videoUrl?: string;
  videoThumbnailUrl?: string;
  videoBadgeText?: string;
  videoCaptionText?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  admissionCtaText?: string;
  onNavigateSubPage: (page: WebsiteSubPage) => void;
  onOpenAdmission: () => void;
  onSearchCourse: (query: string, category: string) => void;
  onPlayVideo?: () => void;
}

export const NexgenHero: React.FC<UniqueItHeroProps> = ({
  categories = [
    'All',
    'Graphic Design',
    'Freelancing & outsourcing',
    'Artificial intelligence (ai)',
    'Motion Graphics',
    'UI/UX Design',
    'Digital Marketing',
    'Video editing',
    'Excel & Data Analysis',
    'Basic Computer Course',
    'AutoCAD (2D/3D)'
  ],
  headline,
  subtitle,
  badgeText = 'Your Future Starts Here',
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  videoThumbnailUrl = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80',
  videoBadgeText = 'NexGen Academy Campus',
  videoCaptionText = 'সরাসরি ফার্মগেট ক্যাম্পাসে প্র্যাকটিক্যাল ল্যাব ও অনলাইন ক্লাস',
  primaryCtaText = 'Online Course',
  secondaryCtaText = 'Offline Course',
  admissionCtaText = 'Admission Now',
  onNavigateSubPage,
  onOpenAdmission,
  onSearchCourse,
  onPlayVideo
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchCourse(searchQuery, selectedCategory);
    onNavigateSubPage('courses');
  };

  return (
    <section className="bg-gradient-to-b from-[#faf8ff] via-[#fdfcff] to-white py-12 lg:py-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-xs font-black shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>{badgeText}</span>
            </div>

            {/* Headline */}
            {headline ? (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.18] tracking-tight">
                {headline}
              </h1>
            ) : (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.18] tracking-tight">
                Learn IT Skills <span className="text-[#dc143c]">Today.</span>
                <br />
                Lead the <span className="text-[#6b1cb0]">Digital World</span>
                <br />
                Tomorrow.
              </h1>
            )}

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal">
              {subtitle ||
                "Thousands of people in Bangladesh are stuck - not because they lack talent, but because they never got the right training. At NexGen Computer Academy, we teach you exactly what today's job market needs. Real tools. Real projects. Real mentors. And real results that follow you for life."}
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigateSubPage('courses')}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white text-[11px] sm:text-xs font-black shadow-sm transition-all flex items-center space-x-1.5 sm:space-x-2 cursor-pointer active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{primaryCtaText}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateSubPage('courses')}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-[11px] sm:text-xs font-black shadow-2xs transition-all flex items-center space-x-1.5 sm:space-x-2 cursor-pointer active:scale-95"
              >
                <Laptop className="w-3.5 h-3.5 text-slate-600" />
                <span>{secondaryCtaText}</span>
              </button>

              <button
                type="button"
                onClick={onOpenAdmission}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white text-[11px] sm:text-xs font-black shadow-sm transition-all flex items-center space-x-1.5 sm:space-x-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>{admissionCtaText}</span>
              </button>
            </div>

            {/* Search Bar with Category Dropdown */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl">
              <div className="flex items-center bg-white rounded-full p-1 sm:p-1.5 border border-purple-200 shadow-sm focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
                {/* Category Dropdown Button */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#6b1cb0] hover:bg-[#581594] text-white text-[10px] sm:text-xs font-bold flex items-center space-x-1 sm:space-x-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <span className="truncate max-w-[65px] sm:max-w-[90px]">{selectedCategory}</span>
                    <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>

                  {categoryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 max-h-60 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-xs">
                      {categories.map((cat, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-purple-50 font-medium transition-colors ${
                            selectedCategory === cat ? 'text-purple-700 bg-purple-50/70 font-bold' : 'text-slate-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your favorite course"
                  className="flex-1 min-w-0 px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-hidden"
                />

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 flex items-center justify-center transition-colors cursor-pointer mr-1 shrink-0"
                  title="Search Courses"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Video / Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-900 group">
              <img
                src={videoThumbnailUrl}
                alt="NexGen Computer Academy Classroom and Studio"
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent"></div>

              {/* NexGen Watermark in Corner */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-slate-900 flex items-center space-x-1 shadow-md">
                <span className="text-[#1e1b4b]">{videoBadgeText || 'NexGen Academy Campus'}</span>
              </div>

              {/* Big Red/White YouTube Play Button */}
              <button
                type="button"
                onClick={onPlayVideo}
                className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 hover:bg-white text-[#dc2626] shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer group"
                title="Play Video"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#dc2626] group-hover:bg-[#b91c1c] text-white flex items-center justify-center shadow-md">
                  <Play className="w-6 h-6 fill-white ml-1" />
                </div>
              </button>

              {/* Bottom Caption Pill */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl text-white text-xs flex items-center justify-between border border-white/10">
                <span className="font-bold text-[11px] sm:text-xs truncate">
                  {videoCaptionText || 'সরাসরি ফার্মগেট ক্যাম্পাসে প্র্যাকটিক্যাল ল্যাব ও অনলাইন ক্লাস'}
                </span>
                <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider shrink-0 ml-2">
                  Watch Video
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { NexgenHero as UniqueItHero };
