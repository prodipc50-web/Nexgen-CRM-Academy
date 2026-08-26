import React, { useState, useRef } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { HeroBannerSlide } from '../../../types';
import {
  Save,
  Sparkles,
  Bell,
  Percent,
  Sliders,
  Crop,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Layers,
  Eye,
  EyeOff,
  Upload,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { LogoCropResizeModal } from '../../common/LogoCropResizeModal';
import { ImageUploadCropModal, ImagePresetItem } from '../../common/ImageUploadCropModal';
import { NexgenLogo } from '../../common/NexgenLogo';
import { HeroBannerEditor } from '../../cms/HeroBannerEditor';

interface CmsHeroTabProps {
  onSuccessToast: (msg: string) => void;
}

const HERO_BANNER_PRESETS: ImagePresetItem[] = [
  {
    label: 'Modern Tech Lab & Students',
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
    label: 'Cyber Security & Network Operations',
    category: 'Hero Banner',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1280&q=80'
  },
  {
    label: 'AI & Data Science Analytics',
    category: 'Hero Banner',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80'
  }
];

export const CmsHeroTab: React.FC<CmsHeroTabProps> = ({ onSuccessToast }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig, academySettings, updateAcademySettings } = useAcademy();

  const [formData, setFormData] = useState({
    heroHeadline: websiteCmsConfig.heroHeadline || '',
    heroSubtitle: websiteCmsConfig.heroSubtitle || '',
    heroBadgeText: websiteCmsConfig.heroBadgeText || '',
    heroCtaText: websiteCmsConfig.heroCtaText || '',
    topNoticeTicker: websiteCmsConfig.topNoticeTicker || '',
    totalTrained: websiteCmsConfig.heroStats?.totalTrained || '8,500+',
    successRate: websiteCmsConfig.heroStats?.successRate || '96.4%',
    expertTrainers: websiteCmsConfig.heroStats?.expertTrainers || '28+',
    jobPlacementRatio: websiteCmsConfig.heroStats?.jobPlacementRatio || '89.2%',
    promoTitle: websiteCmsConfig.promoBanner?.title || '',
    promoDescription: websiteCmsConfig.promoBanner?.description || '',
    promoCode: websiteCmsConfig.promoBanner?.discountCode || '',
    promoExpiresAt: websiteCmsConfig.promoBanner?.expiresAt || '',
    promoEnabled: websiteCmsConfig.promoBanner?.enabled ?? true
  });

  const [slides, setSlides] = useState<HeroBannerSlide[]>(
    websiteCmsConfig.heroSlides && websiteCmsConfig.heroSlides.length > 0
      ? websiteCmsConfig.heroSlides
      : [
          {
            id: 'slide-1',
            title: websiteCmsConfig.heroHeadline || 'Build Your Tech Career with Hands-on Industry Training',
            subtitle: websiteCmsConfig.heroSubtitle || 'Master in-demand IT skills from top industry practitioners.',
            badgeText: websiteCmsConfig.heroBadgeText || 'Govt. Recognized IT Training Institute • Dhaka',
            ctaText: websiteCmsConfig.heroCtaText || 'Explore Courses & Get Free Counseling',
            ctaLink: '#courses',
            secondaryCtaText: 'Free Career Counseling',
            secondaryCtaLink: '#seminars',
            imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1280&q=80',
            isActive: true
          }
        ]
  );

  const [isLogoCropModalOpen, setIsLogoCropModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [isAddingSlide, setIsAddingSlide] = useState(false);

  // Slide Crop Modal State
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [activeSlideCropTarget, setActiveSlideCropTarget] = useState<'form' | { id: string }>('form');
  const slideFileInputRef = useRef<HTMLInputElement>(null);

  const [slideFormData, setSlideFormData] = useState<Omit<HeroBannerSlide, 'id'>>({
    title: '',
    subtitle: '',
    badgeText: 'Featured Admission 2026',
    ctaText: 'Enroll Now',
    ctaLink: '#courses',
    secondaryCtaText: 'Free Workshop',
    secondaryCtaLink: '#seminars',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1280&q=80',
    isActive: true
  });

  const handleStartAddSlide = () => {
    setEditingSlideId(null);
    setIsAddingSlide(true);
    setSlideFormData({
      title: 'New Program or Admission Offer',
      subtitle: 'Describe the core learning outcomes, real client projects, and career opportunities.',
      badgeText: 'New 2026 Batch Starting Soon',
      ctaText: 'Apply For Admission',
      ctaLink: '#courses',
      secondaryCtaText: 'Free Counseling',
      secondaryCtaLink: '#seminars',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1280&q=80',
      isActive: true
    });
  };

  const handleStartEditSlide = (slide: HeroBannerSlide) => {
    setEditingSlideId(slide.id);
    setIsAddingSlide(false);
    setSlideFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      badgeText: slide.badgeText || '',
      ctaText: slide.ctaText || 'Enroll Now',
      ctaLink: slide.ctaLink || '#courses',
      secondaryCtaText: slide.secondaryCtaText || '',
      secondaryCtaLink: slide.secondaryCtaLink || '#seminars',
      imageUrl: slide.imageUrl || '',
      isActive: slide.isActive
    });
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideFormData.title) return;

    let updatedList: HeroBannerSlide[];
    if (editingSlideId) {
      updatedList = slides.map(s => (s.id === editingSlideId ? { ...slideFormData, id: s.id } : s));
      onSuccessToast('Hero banner slide updated!');
    } else {
      const newSlide: HeroBannerSlide = {
        ...slideFormData,
        id: `slide-${Date.now()}`
      };
      updatedList = [...slides, newSlide];
      onSuccessToast('New hero banner slide added!');
    }

    setSlides(updatedList);
    updateWebsiteCmsConfig({ heroSlides: updatedList });
    setIsAddingSlide(false);
    setEditingSlideId(null);
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert('You must keep at least 1 hero banner slide.');
      return;
    }
    const updated = slides.filter(s => s.id !== id);
    setSlides(updated);
    updateWebsiteCmsConfig({ heroSlides: updated });
    onSuccessToast('Slide removed.');
  };

  const handleToggleSlideActive = (id: string) => {
    const updated = slides.map(s => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    setSlides(updated);
    updateWebsiteCmsConfig({ heroSlides: updated });
    onSuccessToast('Slide visibility updated.');
  };

  const handleSlideFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSlideFormData(prev => ({ ...prev, imageUrl: dataUrl }));
      onSuccessToast('Slide image uploaded! You can crop/resize now.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteCmsConfig({
      heroHeadline: formData.heroHeadline,
      heroSubtitle: formData.heroSubtitle,
      heroBadgeText: formData.heroBadgeText,
      heroCtaText: formData.heroCtaText,
      topNoticeTicker: formData.topNoticeTicker,
      heroSlides: slides,
      heroStats: {
        totalTrained: formData.totalTrained,
        successRate: formData.successRate,
        expertTrainers: formData.expertTrainers,
        jobPlacementRatio: formData.jobPlacementRatio
      },
      promoBanner: {
        enabled: formData.promoEnabled,
        title: formData.promoTitle,
        description: formData.promoDescription,
        discountCode: formData.promoCode,
        expiresAt: formData.promoExpiresAt
      }
    });
    onSuccessToast('Hero section, banner slider & announcement ticker updated!');
  };

  return (
    <div className="space-y-8">
      {/* 0. Institute Branding & Logo Crop/Resize Management */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span>Institute Public Website Logo & Branding (লোগো ক্রপ ও রিসাইজ)</span>
          </div>
          <button
            type="button"
            onClick={() => setIsLogoCropModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-transform hover:scale-105"
          >
            <Crop className="w-3.5 h-3.5" />
            <span>Manual Crop & Resize Logo</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <NexgenLogo variant="crest" size={48} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">{academySettings.instituteName || 'Nexgen Computer Academy'}</h4>
              <p className="text-xs text-slate-500">Live Website Navigation & Print Header Logo</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">✓ Synchronized with Public Website & ID Cards</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsLogoCropModalOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
            >
              <Crop className="w-3.5 h-3.5 text-indigo-600" />
              <span>Change / Crop Logo</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. HERO BANNER SLIDER STUDIO (ইন্টারেক্টিভ হিরো ব্যানার স্টুডিও) */}
      <HeroBannerEditor
        slides={slides}
        onChangeSlides={(newSlides) => {
          setSlides(newSlides);
          updateWebsiteCmsConfig({ heroSlides: newSlides });
        }}
        onSuccessToast={onSuccessToast}
      />

      {/* 2. Top Notice Ticker */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Top Header Announcement & Notice Ticker</span>
          </div>
          <input
            type="text"
            value={formData.topNoticeTicker}
            onChange={e => setFormData({ ...formData, topNoticeTicker: e.target.value })}
            placeholder="e.g. ⚡ Special Admission Open with 40% Scholarship..."
            className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <p className="text-[11px] text-amber-700">
            This scrolling/fixed ticker appears at the very top of the public website above the navigation bar.
          </p>
        </div>

        {/* 3. Main Hero Default Texts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Hero Fallback Headline & Subtitles</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Hero Top Badge Pill</label>
              <input
                type="text"
                value={formData.heroBadgeText}
                onChange={e => setFormData({ ...formData, heroBadgeText: e.target.value })}
                placeholder="e.g. Govt. Recognized IT Training Institute • Dhaka, Bangladesh"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Primary Hero Headline *</label>
              <input
                type="text"
                required
                value={formData.heroHeadline}
                onChange={e => setFormData({ ...formData, heroHeadline: e.target.value })}
                placeholder="e.g. Build Your Tech Career with Hands-on Industry Training"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Hero Subtitle & Value Proposition *</label>
              <textarea
                rows={3}
                required
                value={formData.heroSubtitle}
                onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
                placeholder="e.g. Master in-demand IT skills from top industry practitioners..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 leading-relaxed focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Primary CTA Button Label</label>
              <input
                type="text"
                value={formData.heroCtaText}
                onChange={e => setFormData({ ...formData, heroCtaText: e.target.value })}
                placeholder="e.g. Explore Courses & Get Free Counseling"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 4. Hero Live Counter Stats */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Live Achievements & Key Statistics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Total Students Trained</label>
              <input
                type="text"
                value={formData.totalTrained}
                onChange={e => setFormData({ ...formData, totalTrained: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-indigo-600 text-center"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Success & Pass Rate</label>
              <input
                type="text"
                value={formData.successRate}
                onChange={e => setFormData({ ...formData, successRate: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-emerald-600 text-center"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Industry Expert Trainers</label>
              <input
                type="text"
                value={formData.expertTrainers}
                onChange={e => setFormData({ ...formData, expertTrainers: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-amber-600 text-center"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Job & Freelance Ratio</label>
              <input
                type="text"
                value={formData.jobPlacementRatio}
                onChange={e => setFormData({ ...formData, jobPlacementRatio: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-indigo-600 text-center"
              />
            </div>
          </div>
        </div>

        {/* 5. Special Offer Promo Banner */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm">
              <Percent className="w-4 h-4 text-emerald-600" />
              <span>Special Promotional Banner & Coupon</span>
            </div>
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.promoEnabled}
                onChange={e => setFormData({ ...formData, promoEnabled: e.target.checked })}
                className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Enable Promo Banner</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Promo Title</label>
              <input
                type="text"
                value={formData.promoTitle}
                onChange={e => setFormData({ ...formData, promoTitle: e.target.value })}
                placeholder="e.g. Up to 45% Early Bird Discount!"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Promo Coupon Code</label>
              <input
                type="text"
                value={formData.promoCode}
                onChange={e => setFormData({ ...formData, promoCode: e.target.value })}
                placeholder="e.g. NEXGEN2026"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase text-indigo-600 font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Offer Expiration Date</label>
              <input
                type="date"
                value={formData.promoExpiresAt}
                onChange={e => setFormData({ ...formData, promoExpiresAt: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Promo Short Description</label>
              <input
                type="text"
                value={formData.promoDescription}
                onChange={e => setFormData({ ...formData, promoDescription: e.target.value })}
                placeholder="e.g. Enroll in upcoming weekend batches and get lifetime lab access."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Save All Hero & Announcements</span>
          </button>
        </div>
      </form>

      {/* Logo Crop & Resize Modal */}
      <LogoCropResizeModal
        isOpen={isLogoCropModalOpen}
        onClose={() => setIsLogoCropModalOpen(false)}
        currentLogoUrl={academySettings.customLogoUrl}
        onSaveLogo={(dataUrl) => {
          updateAcademySettings({ customLogoUrl: dataUrl });
          onSuccessToast('Institute logo updated & saved successfully!');
        }}
        onResetLogo={() => {
          updateAcademySettings({ customLogoUrl: '' });
          onSuccessToast('Logo reset to default brandmark');
        }}
      />

      {/* Slide Image Upload & Crop Modal (16:9 Banner) */}
      <ImageUploadCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        currentImageUrl={
          activeSlideCropTarget === 'form'
            ? slideFormData.imageUrl
            : (slides.find(s => s.id === (activeSlideCropTarget as any).id)?.imageUrl || slideFormData.imageUrl)
        }
        onSaveImage={(croppedUrl) => {
          if (activeSlideCropTarget === 'form') {
            setSlideFormData(prev => ({ ...prev, imageUrl: croppedUrl }));
            onSuccessToast('Slide image cropped & applied!');
          } else {
            const updated = slides.map(s => (s.id === (activeSlideCropTarget as any).id ? { ...s, imageUrl: croppedUrl } : s));
            setSlides(updated);
            updateWebsiteCmsConfig({ heroSlides: updated });
            onSuccessToast('Banner slide image cropped & updated!');
          }
        }}
        title="Crop & Frame Hero Banner Slide"
        subtitle="Crop to 16:9 widescreen format for high-definition website hero slider."
        aspectRatio="16:9"
        recommendedSize="Recommended: 1280 × 720px (16:9 Widescreen)"
        presetImages={HERO_BANNER_PRESETS}
      />
    </div>
  );
};
