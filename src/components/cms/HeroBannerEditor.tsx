import React, { useState, useRef } from 'react';
import { HeroBannerSlide } from '../../types';
import { ImageUploadCropModal, ImagePresetItem } from '../common/ImageUploadCropModal';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  Crop,
  Layers,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Calendar,
  Zap,
  Star,
  Award,
  Flame,
  Trophy,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  Palette,
  Sliders
} from 'lucide-react';

interface HeroBannerEditorProps {
  slides: HeroBannerSlide[];
  onChangeSlides: (slides: HeroBannerSlide[]) => void;
  onSuccessToast: (msg: string) => void;
}

const HD_BANNER_PRESETS: ImagePresetItem[] = [
  {
    label: 'Modern Tech Lab & Active Students',
    category: 'Hero Banner',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1280&q=80'
  },
  {
    label: 'Software Engineering & Coding Team',
    category: 'Hero Banner',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1280&q=80'
  },
  {
    label: 'Creative UI/UX & Graphics Workspace',
    category: 'Hero Banner',
    url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1280&q=80'
  },
  {
    label: 'Cyber Security & Network Operations Lab',
    category: 'Hero Banner',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1280&q=80'
  },
  {
    label: 'Data Science, Python & AI Analytics',
    category: 'Hero Banner',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80'
  },
  {
    label: 'Digital Marketing & Content Studio',
    category: 'Hero Banner',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1280&q=80'
  }
];

const TEMPLATES = [
  {
    name: 'Govt. Recognized IT Certification',
    badgeText: 'Govt. Recognized IT Training Institute • Dhaka',
    title: 'Build Your Tech Career with Hands-on Industry Training',
    subtitle: 'Master in-demand IT skills from top industry practitioners. 100% practical lab sessions, live freelance mentorship & verified job placement.',
    ctaText: 'Explore Courses & Fees',
    ctaLink: '#courses',
    secondaryCtaText: 'Free Career Counseling',
    secondaryCtaLink: '#seminars',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1280&q=80'
  },
  {
    name: 'Full-Stack Software Engineering Bootcamp',
    badgeText: 'MERN Stack • Python • Next.js 2026',
    title: 'Become a Full-Stack Software Engineer in 6 Months',
    subtitle: 'Build 10+ real-world commercial web applications, master cloud deployment on AWS, and prepare for international remote software developer jobs.',
    ctaText: 'View Software Syllabus',
    ctaLink: '#courses',
    secondaryCtaText: 'Join Free Live Coding Workshop',
    secondaryCtaLink: '#seminars',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1280&q=80'
  },
  {
    name: 'Freelancing & Outsourcing Masterclass',
    badgeText: 'Upwork • Fiverr • Direct Client Acquisition',
    title: 'Earn in Foreign Currency with Verified Freelancing Skills',
    subtitle: 'Step-by-step marketplace profile setup, winning client bidding proposals, order delivery, and international payment withdrawal directly to your local bank.',
    ctaText: 'Enroll in Freelance Course',
    ctaLink: '#courses',
    secondaryCtaText: 'Free Freelance Seminar',
    secondaryCtaLink: '#seminars',
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1280&q=80'
  },
  {
    name: 'Special Admission Discount Offer',
    badgeText: 'Special 40% Scholarship Discount Offer',
    title: 'Limited Seats Available for Upcoming Academic Batch',
    subtitle: 'Avail up to 40% scholarship on all professional diploma courses. Easy installment payment options available for students and job seekers.',
    ctaText: 'Claim 40% Discount Now',
    ctaLink: '#courses',
    secondaryCtaText: 'Book Free Seat',
    secondaryCtaLink: '#seminars',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80'
  }
];

export const HeroBannerEditor: React.FC<HeroBannerEditorProps> = ({
  slides,
  onChangeSlides,
  onSuccessToast
}) => {
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeSlide = slides[selectedSlideIndex] || slides[0] || {
    id: 'default',
    title: 'Build Your Tech Career',
    subtitle: 'Master industry skills',
    badgeText: 'Govt. Recognized IT Institute',
    ctaText: 'Explore Courses',
    ctaLink: '#courses',
    secondaryCtaText: 'Free Counseling',
    secondaryCtaLink: '#seminars',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1280&q=80',
    isActive: true
  };

  const updateActiveSlide = (fields: Partial<HeroBannerSlide>) => {
    const updated = slides.map((s, idx) => (idx === selectedSlideIndex ? { ...s, ...fields } : s));
    onChangeSlides(updated);
  };

  const handleAddSlide = () => {
    const newSlide: HeroBannerSlide = {
      id: `slide-${Date.now()}`,
      title: 'New Professional IT Program 2026',
      subtitle: 'Hands-on practical training with certified mentors and guaranteed internship placement support.',
      badgeText: 'New Batch Starting This Month',
      ctaText: 'Explore Syllabus & Fees',
      ctaLink: '#courses',
      secondaryCtaText: 'Free Career Counseling',
      secondaryCtaLink: '#seminars',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1280&q=80',
      isActive: true
    };
    const updated = [...slides, newSlide];
    onChangeSlides(updated);
    setSelectedSlideIndex(updated.length - 1);
    onSuccessToast('New banner slide added!');
  };

  const handleDuplicateSlide = (index: number) => {
    const target = slides[index];
    if (!target) return;
    const duplicated: HeroBannerSlide = {
      ...target,
      id: `slide-${Date.now()}`,
      title: `${target.title} (Copy)`
    };
    const updated = [...slides.slice(0, index + 1), duplicated, ...slides.slice(index + 1)];
    onChangeSlides(updated);
    setSelectedSlideIndex(index + 1);
    onSuccessToast('Slide duplicated!');
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('You must have at least 1 slide in the hero banner.');
      return;
    }
    const updated = slides.filter((_, idx) => idx !== index);
    onChangeSlides(updated);
    setSelectedSlideIndex(Math.max(0, index - 1));
    onSuccessToast('Slide removed.');
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const newSlides = [...slides];
    const [moved] = newSlides.splice(index, 1);
    newSlides.splice(targetIdx, 0, moved);
    onChangeSlides(newSlides);
    setSelectedSlideIndex(targetIdx);
  };

  const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    updateActiveSlide({
      title: tmpl.title,
      subtitle: tmpl.subtitle,
      badgeText: tmpl.badgeText,
      ctaText: tmpl.ctaText,
      ctaLink: tmpl.ctaLink,
      secondaryCtaText: tmpl.secondaryCtaText,
      secondaryCtaLink: tmpl.secondaryCtaLink,
      imageUrl: tmpl.imageUrl
    });
    onSuccessToast(`Template "${tmpl.name}" applied to current slide!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateActiveSlide({ imageUrl: dataUrl });
      onSuccessToast('Banner background uploaded! You can crop/adjust.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Studio Header & Slide Tabs */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black shadow-lg shadow-indigo-600/30">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-base flex items-center space-x-2">
                <span>Interactive Hero Banner Studio</span>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full text-[10px] uppercase font-bold">
                  16:9 Aspect Ratio
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Design engaging landing banners with real-time responsive preview, instant crop, and quick templates.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleAddSlide}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Slide</span>
            </button>
          </div>
        </div>

        {/* Slide Selector Carousel Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          {slides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              onClick={() => setSelectedSlideIndex(idx)}
              className={`group flex items-center space-x-2 px-3 py-2 rounded-2xl border cursor-pointer transition-all shrink-0 ${
                idx === selectedSlideIndex
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-950 border border-white/20 shrink-0">
                <img
                  src={slide.imageUrl || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&q=80'}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-left">
                <p className="text-xs font-black truncate max-w-[120px]">
                  {idx + 1}. {slide.title || 'Untitled Slide'}
                </p>
                <p className="text-[10px] text-indigo-200 opacity-80">
                  {slide.isActive !== false ? 'Active' : 'Hidden'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-1 pl-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  title="Move Up"
                  disabled={idx === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveSlide(idx, 'up');
                  }}
                  className="p-1 hover:bg-slate-700 rounded disabled:opacity-30"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  title="Move Down"
                  disabled={idx === slides.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveSlide(idx, 'down');
                  }}
                  className="p-1 hover:bg-slate-700 rounded disabled:opacity-30"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. REAL-TIME LIVE 16:9 BANNER CANVAS PREVIEW */}
      <div className="bg-slate-950 p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2 font-bold text-white">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Live Responsive Canvas Preview (Slide #{selectedSlideIndex + 1})</span>
          </div>

          {/* Viewport Width Toggle */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg flex items-center space-x-1 text-xs font-bold transition-all ${
                previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded-lg flex items-center space-x-1 text-xs font-bold transition-all ${
                previewDevice === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg flex items-center space-x-1 text-xs font-bold transition-all ${
                previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>

        {/* The Live Banner Container */}
        <div
          className={`mx-auto transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 relative ${
            previewDevice === 'desktop'
              ? 'w-full max-w-5xl'
              : previewDevice === 'tablet'
              ? 'w-full max-w-2xl'
              : 'w-full max-w-sm'
          }`}
        >
          <div className="relative min-h-[360px] sm:min-h-[440px] flex items-center p-6 sm:p-10 md:p-12 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={activeSlide.imageUrl || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1280&q=80'}
                alt={activeSlide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />
            </div>

            {/* Slide Text Content */}
            <div className="relative z-10 max-w-2xl space-y-4">
              {activeSlide.badgeText && (
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-950/90 border border-indigo-400/40 rounded-full text-indigo-200 text-xs font-black shadow-lg backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">{activeSlide.badgeText}</span>
                </div>
              )}

              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-md">
                {activeSlide.title || 'Enter your slide headline...'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed drop-shadow-xs line-clamp-3">
                {activeSlide.subtitle || 'Enter value proposition and key student highlights...'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {activeSlide.ctaText && (
                  <div className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{activeSlide.ctaText}</span>
                  </div>
                )}

                {activeSlide.secondaryCtaText && (
                  <div className="px-4 py-2.5 bg-slate-900/80 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center space-x-1.5">
                    <span>{activeSlide.secondaryCtaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SLIDE CONFIGURATION CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Headline, Subtitle, Badges, Buttons (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-black text-slate-900 text-sm flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-indigo-600" />
              <span>Editing Slide #{selectedSlideIndex + 1} Content</span>
            </h4>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => updateActiveSlide({ isActive: activeSlide.isActive === false ? true : false })}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-colors ${
                  activeSlide.isActive !== false
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border border-rose-300'
                }`}
              >
                {activeSlide.isActive !== false ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hidden</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDuplicateSlide(selectedSlideIndex)}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                title="Duplicate Slide"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteSlide(selectedSlideIndex)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete Slide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Badge & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge Text / Ribbon</label>
              <input
                type="text"
                value={activeSlide.badgeText || ''}
                onChange={(e) => updateActiveSlide({ badgeText: e.target.value })}
                placeholder="e.g. Govt. Recognized IT Institute"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Banner Image Aspect</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCropModalOpen(true)}
                  className="w-full px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Crop className="w-4 h-4 text-indigo-600" />
                  <span>Crop / Replace Background</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Slide Main Headline</label>
            <input
              type="text"
              value={activeSlide.title}
              onChange={(e) => updateActiveSlide({ title: e.target.value })}
              placeholder="e.g. Build Your Tech Career with Hands-on Industry Training"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle & Value Proposition</label>
            <textarea
              rows={3}
              value={activeSlide.subtitle}
              onChange={(e) => updateActiveSlide({ subtitle: e.target.value })}
              placeholder="Describe core skills, lab sessions, practical projects..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Call-to-Action Buttons Configuration */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Call-To-Action (CTA) Buttons</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary CTA Button Label</label>
                <input
                  type="text"
                  value={activeSlide.ctaText || ''}
                  onChange={(e) => updateActiveSlide({ ctaText: e.target.value })}
                  placeholder="e.g. Explore Courses & Fees"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary Button Link</label>
                <input
                  type="text"
                  value={activeSlide.ctaLink || '#courses'}
                  onChange={(e) => updateActiveSlide({ ctaLink: e.target.value })}
                  placeholder="e.g. #courses or URL"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Secondary CTA Button Label</label>
                <input
                  type="text"
                  value={activeSlide.secondaryCtaText || ''}
                  onChange={(e) => updateActiveSlide({ secondaryCtaText: e.target.value })}
                  placeholder="e.g. Free Career Counseling"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Secondary Button Link</label>
                <input
                  type="text"
                  value={activeSlide.secondaryCtaLink || '#seminars'}
                  onChange={(e) => updateActiveSlide({ secondaryCtaLink: e.target.value })}
                  placeholder="e.g. #seminars"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Form: Preset Templates & HD Background Gallery (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quick-Start Banner Templates */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Quick-Start Slide Templates</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Click any template to auto-populate headlines and background images:
            </p>

            <div className="space-y-2">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all group"
                >
                  <p className="font-black text-xs text-slate-900 group-hover:text-indigo-700">
                    {tmpl.name}
                  </p>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {tmpl.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Curated 16:9 HD Presets */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>Preset HD Banner Library</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {HD_BANNER_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    updateActiveSlide({ imageUrl: preset.url });
                    onSuccessToast('HD preset image applied!');
                  }}
                  className="group relative rounded-xl overflow-hidden cursor-pointer border border-slate-200 hover:border-indigo-500 shadow-2xs hover:shadow-md transition-all aspect-video"
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/10 transition-colors flex items-end p-1.5">
                    <span className="text-[9px] text-white font-bold truncate drop-shadow-md">
                      {preset.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload & Crop Modal for Hero Banner (16:9) */}
      <ImageUploadCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        title="Crop & Resize Hero Banner Background"
        aspectRatio="16:9"
        currentImageUrl={activeSlide.imageUrl}
        presetImages={HD_BANNER_PRESETS}
        onSaveImage={(croppedUrl) => {
          updateActiveSlide({ imageUrl: croppedUrl });
          onSuccessToast('Cropped 16:9 banner background saved successfully!');
        }}
      />
    </div>
  );
};
