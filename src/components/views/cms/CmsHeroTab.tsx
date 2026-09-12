import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { LogoCropResizeModal } from '../../common/LogoCropResizeModal';
import { NexgenLogo } from '../../common/NexgenLogo';
import { HeroBannerEditor } from '../../cms/HeroBannerEditor';

interface CmsHeroTabProps {
  onSuccessToast: (msg: string) => void;
}

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
    promoEnabled: websiteCmsConfig.promoBanner?.enabled ?? true,
    upcomingCardBadge: websiteCmsConfig.upcomingBatchesCard?.badgeText || '40% Offer',
    upcomingCardTitle: websiteCmsConfig.upcomingBatchesCard?.title || 'Upcoming Batches',
    upcomingCardHeading: websiteCmsConfig.upcomingBatchesCard?.heading || 'Apply for Direct Admission',
    upcomingCardDescription: websiteCmsConfig.upcomingBatchesCard?.description || 'Fast-track your IT career with practical project portfolios and certified diplomas.',
    upcomingCardFeatureNote: websiteCmsConfig.upcomingBatchesCard?.featureNote || 'Free Lifetime Lab Access',
    upcomingCardCtaText: websiteCmsConfig.upcomingBatchesCard?.ctaText || 'Free Seminars →',
    upcomingCardCtaLink: websiteCmsConfig.upcomingBatchesCard?.ctaLink || '#seminars'
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
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Two-way sync: When slides update from HeroBannerEditor
  const handleUpdateSlides = (newSlides: HeroBannerSlide[]) => {
    setSlides(newSlides);
    if (newSlides.length > 0 && newSlides[0]) {
      const s0 = newSlides[0];
      setFormData(prev => ({
        ...prev,
        heroHeadline: s0.title || prev.heroHeadline,
        heroSubtitle: s0.subtitle || prev.heroSubtitle,
        heroBadgeText: s0.badgeText || prev.heroBadgeText,
        heroCtaText: s0.ctaText || prev.heroCtaText
      }));
    }
    updateWebsiteCmsConfig({
      heroSlides: newSlides,
      ...(newSlides[0] ? {
        heroHeadline: newSlides[0].title,
        heroSubtitle: newSlides[0].subtitle,
        heroBadgeText: newSlides[0].badgeText,
        heroCtaText: newSlides[0].ctaText
      } : {})
    });
  };

  // Two-way sync: When user types in fallback inputs, reflect to slide[0]
  const handleHeadlineChange = (val: string) => {
    setFormData(prev => ({ ...prev, heroHeadline: val }));
    setSlides(prev => {
      if (!prev || prev.length === 0) return prev;
      const copy = [...prev];
      copy[0] = { ...copy[0], title: val };
      return copy;
    });
  };

  const handleSubtitleChange = (val: string) => {
    setFormData(prev => ({ ...prev, heroSubtitle: val }));
    setSlides(prev => {
      if (!prev || prev.length === 0) return prev;
      const copy = [...prev];
      copy[0] = { ...copy[0], subtitle: val };
      return copy;
    });
  };

  const handleBadgeChange = (val: string) => {
    setFormData(prev => ({ ...prev, heroBadgeText: val }));
    setSlides(prev => {
      if (!prev || prev.length === 0) return prev;
      const copy = [...prev];
      copy[0] = { ...copy[0], badgeText: val };
      return copy;
    });
  };

  const handleCtaChange = (val: string) => {
    setFormData(prev => ({ ...prev, heroCtaText: val }));
    setSlides(prev => {
      if (!prev || prev.length === 0) return prev;
      const copy = [...prev];
      copy[0] = { ...copy[0], ctaText: val };
      return copy;
    });
  };

  // Unified Save Function (triggered by top sticky button, banner studio save button, or bottom submit)
  const handleSaveAllHero = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const syncedSlides = slides.length > 0 ? [
      {
        ...slides[0],
        title: formData.heroHeadline || slides[0].title,
        subtitle: formData.heroSubtitle || slides[0].subtitle,
        badgeText: formData.heroBadgeText || slides[0].badgeText,
        ctaText: formData.heroCtaText || slides[0].ctaText
      },
      ...slides.slice(1)
    ] : slides;

    updateWebsiteCmsConfig({
      heroHeadline: formData.heroHeadline || (syncedSlides[0]?.title || ''),
      heroSubtitle: formData.heroSubtitle || (syncedSlides[0]?.subtitle || ''),
      heroBadgeText: formData.heroBadgeText || (syncedSlides[0]?.badgeText || ''),
      heroCtaText: formData.heroCtaText || (syncedSlides[0]?.ctaText || ''),
      topNoticeTicker: formData.topNoticeTicker,
      heroSlides: syncedSlides,
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
      },
      upcomingBatchesCard: {
        badgeText: formData.upcomingCardBadge,
        title: formData.upcomingCardTitle,
        heading: formData.upcomingCardHeading,
        description: formData.upcomingCardDescription,
        featureNote: formData.upcomingCardFeatureNote,
        ctaText: formData.upcomingCardCtaText,
        ctaLink: formData.upcomingCardCtaLink,
        pinnedCourseIds: websiteCmsConfig.upcomingBatchesCard?.pinnedCourseIds || []
      }
    });

    setSlides(syncedSlides);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
    onSuccessToast('হিরো সেকশন, ব্যানার স্লাইডার ও অ্যানাউন্সমেন্ট সফলভাবে সংরক্ষিত ও লাইভ হয়েছে!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    handleSaveAllHero(e);
  };

  return (
    <div className="space-y-8">
      {/* Top Sticky Quick Save Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-indigo-900/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black shadow-lg shadow-indigo-600/40 text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-sm sm:text-base flex items-center space-x-2">
              <span>Hero & Banner Slider Settings (হিরো ব্যানার হাব)</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] uppercase font-bold">
                Live Auto-Sync
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              ব্যানার স্লাইডার, হেডলাইন ও অ্যানাউন্সমেন্ট এডিট করে যেকোনো বাটন থেকে সেভ করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleSaveAllHero()}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              saveFeedback
                ? 'bg-emerald-600 text-white shadow-emerald-600/40 scale-105'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/30 active:scale-95'
            }`}
          >
            {saveFeedback ? <CheckCircle2 className="w-4 h-4 text-emerald-100" /> : <Save className="w-4 h-4" />}
            <span>{saveFeedback ? 'সব সংরক্ষিত হয়েছে (Saved!)' : 'Save All Changes (সব সংরক্ষণ করুন)'}</span>
          </button>
        </div>
      </div>

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
        onChangeSlides={handleUpdateSlides}
        onSave={() => handleSaveAllHero()}
        onSuccessToast={onSuccessToast}
      />

      {/* 2. Top Notice Ticker */}
      <form onSubmit={handleSaveAllHero} className="space-y-6">
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
            <span>Hero Fallback Headline & Subtitles (স্লাইডারের সাথে সিঙ্ক)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Hero Top Badge Pill</label>
              <input
                type="text"
                value={formData.heroBadgeText}
                onChange={e => handleBadgeChange(e.target.value)}
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
                onChange={e => handleHeadlineChange(e.target.value)}
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
                onChange={e => handleSubtitleChange(e.target.value)}
                placeholder="e.g. Master in-demand IT skills from top industry practitioners..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 leading-relaxed focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Primary CTA Button Label</label>
              <input
                type="text"
                value={formData.heroCtaText}
                onChange={e => handleCtaChange(e.target.value)}
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

        {/* 4. Upcoming Batches / Offer Card Settings in Hero */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-amber-50">
            <div className="flex items-center space-x-2 text-amber-950 font-black text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Upcoming Batches & Admission Offer Card (হিরো সেকশনের ডানপাশের অ্যাডমিশন কার্ড)</span>
            </div>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Hero Side Card
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Offer Badge Pill (অফার ব্যাজ)</label>
              <input
                type="text"
                value={formData.upcomingCardBadge}
                onChange={e => setFormData({ ...formData, upcomingCardBadge: e.target.value })}
                placeholder="e.g. 40% Offer"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-amber-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Card Small Label (লেবেল)</label>
              <input
                type="text"
                value={formData.upcomingCardTitle}
                onChange={e => setFormData({ ...formData, upcomingCardTitle: e.target.value })}
                placeholder="e.g. Upcoming Batches"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Main Heading (প্রধান শিরোনাম)</label>
              <input
                type="text"
                value={formData.upcomingCardHeading}
                onChange={e => setFormData({ ...formData, upcomingCardHeading: e.target.value })}
                placeholder="e.g. Apply for Direct Admission"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Feature Note (নিচের বিশেষ সুবিধা)</label>
              <input
                type="text"
                value={formData.upcomingCardFeatureNote}
                onChange={e => setFormData({ ...formData, upcomingCardFeatureNote: e.target.value })}
                placeholder="e.g. Free Lifetime Lab Access"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Card Description (বিবরণ)</label>
              <input
                type="text"
                value={formData.upcomingCardDescription}
                onChange={e => setFormData({ ...formData, upcomingCardDescription: e.target.value })}
                placeholder="e.g. Fast-track your IT career with practical project portfolios and certified diplomas."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Bottom CTA Button Text (বাটন টেক্সট)</label>
              <input
                type="text"
                value={formData.upcomingCardCtaText}
                onChange={e => setFormData({ ...formData, upcomingCardCtaText: e.target.value })}
                placeholder="e.g. Free Seminars →"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Bottom CTA Button Link (বাটন লিংক)</label>
              <input
                type="text"
                value={formData.upcomingCardCtaLink}
                onChange={e => setFormData({ ...formData, upcomingCardCtaLink: e.target.value })}
                placeholder="e.g. #seminars"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
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
    </div>
  );
};
