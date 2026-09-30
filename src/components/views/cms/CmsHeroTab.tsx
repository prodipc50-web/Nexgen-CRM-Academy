import React, { useState, useEffect, useRef } from 'react';
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
  const hasUserEditedRef = useRef(false);

  // Top Header Brand Bar States (matching user screenshot)
  const [headerBrandName, setHeaderBrandName] = useState(academySettings.instituteName || "Nexgen Computer Academy");
  const [headerSubtitle, setHeaderSubtitle] = useState(
    websiteCmsConfig.headerSubtitle || `${academySettings.campusName || "Farmgate Campus"} • Govt. Standard IT Training & Career Incubator`
  );
  const [headerEstText, setHeaderEstText] = useState(websiteCmsConfig.headerEstText || "EST. 2018");
  const [brandSavedFeedback, setBrandSavedFeedback] = useState(false);

  useEffect(() => {
    if (!hasUserEditedRef.current && academySettings.instituteName) {
      setHeaderBrandName(academySettings.instituteName);
    }
  }, [academySettings.instituteName]);

  useEffect(() => {
    if (!hasUserEditedRef.current) {
      if (websiteCmsConfig.headerSubtitle !== undefined) {
        setHeaderSubtitle(websiteCmsConfig.headerSubtitle);
      }
      if (websiteCmsConfig.headerEstText !== undefined) {
        setHeaderEstText(websiteCmsConfig.headerEstText);
      }
    }
  }, [websiteCmsConfig.headerSubtitle, websiteCmsConfig.headerEstText]);

  const handleSaveHeaderBrand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (headerBrandName.trim() && headerBrandName !== academySettings.instituteName) {
      updateAcademySettings({ instituteName: headerBrandName.trim() });
    }
    updateWebsiteCmsConfig({
      headerSubtitle: headerSubtitle.trim(),
      headerEstText: headerEstText.trim()
    });
    setBrandSavedFeedback(true);
    setTimeout(() => setBrandSavedFeedback(false), 3000);
    onSuccessToast("ওয়েবসাইটের হেডার ব্র্যান্ড, লোগো, স্লোগান ও প্রতিষ্ঠার সাল সফলভাবে সংরক্ষিত হয়েছে!");
  };

  const [formData, setFormData] = useState({
    heroStyle: websiteCmsConfig.heroStyle || 'split-video',
    heroHeadline: websiteCmsConfig.heroHeadline || '',
    heroSubtitle: websiteCmsConfig.heroSubtitle || '',
    heroVideoUrl: websiteCmsConfig.heroVideoUrl || '',
    heroVideoBadgeText: websiteCmsConfig.heroVideoBadgeText || 'কম্পিউটার বা ফ্রিল্যান্সিং শিখে ক্যারিয়ার গড়ার উপায়',
    heroVideoThumbnailUrl: websiteCmsConfig.heroVideoThumbnailUrl || '',
    heroBadgeText: websiteCmsConfig.heroBadgeText || '',
    heroCtaText: websiteCmsConfig.heroCtaText || '',
    heroPrimaryCtaText: websiteCmsConfig.heroPrimaryCtaText || websiteCmsConfig.heroCtaText || 'Get Admission',
    heroSecondaryCtaText: websiteCmsConfig.heroSecondaryCtaText || 'Learn more',
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

  // Sync state when websiteCmsConfig updates from cloud/other tab
  useEffect(() => {
    if (hasUserEditedRef.current) return;

    setFormData({
      heroStyle: websiteCmsConfig.heroStyle || 'split-video',
      heroHeadline: websiteCmsConfig.heroHeadline || '',
      heroSubtitle: websiteCmsConfig.heroSubtitle || '',
      heroVideoUrl: websiteCmsConfig.heroVideoUrl || '',
      heroVideoBadgeText: websiteCmsConfig.heroVideoBadgeText || 'কম্পিউটার বা ফ্রিল্যান্সিং শিখে ক্যারিয়ার গড়ার উপায়',
      heroVideoThumbnailUrl: websiteCmsConfig.heroVideoThumbnailUrl || '',
      heroBadgeText: websiteCmsConfig.heroBadgeText || '',
      heroCtaText: websiteCmsConfig.heroCtaText || '',
      heroPrimaryCtaText: websiteCmsConfig.heroPrimaryCtaText || websiteCmsConfig.heroCtaText || 'Get Admission',
      heroSecondaryCtaText: websiteCmsConfig.heroSecondaryCtaText || 'Learn more',
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

    if (websiteCmsConfig.heroSlides && websiteCmsConfig.heroSlides.length > 0) {
      setSlides(websiteCmsConfig.heroSlides);
    }
  }, [websiteCmsConfig]);

  const [isLogoCropModalOpen, setIsLogoCropModalOpen] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Two-way sync: When slides update from HeroBannerEditor
  const handleUpdateSlides = (newSlides: HeroBannerSlide[]) => {
    hasUserEditedRef.current = true;
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
    hasUserEditedRef.current = true;
    setFormData(prev => ({ ...prev, heroHeadline: val }));
    setSlides(prev => {
      if (!prev || prev.length === 0) return prev;
      const copy = [...prev];
      copy[0] = { ...copy[0], title: val };
      return copy;
    });
  };

  const handleSubtitleChange = (val: string) => {
    hasUserEditedRef.current = true;
    setFormData(prev => ({ ...prev, heroSubtitle: val }));
    setSlides(prev => {
      if (!prev || prev.length === 0) return prev;
      const copy = [...prev];
      copy[0] = { ...copy[0], subtitle: val };
      return copy;
    });
  };

  const handleBadgeChange = (val: string) => {
    hasUserEditedRef.current = true;
    setFormData(prev => ({ ...prev, heroBadgeText: val }));
    setSlides(prev => {
      if (!prev || prev.length === 0) return prev;
      const copy = [...prev];
      copy[0] = { ...copy[0], badgeText: val };
      return copy;
    });
  };

  const handleCtaChange = (val: string) => {
    hasUserEditedRef.current = true;
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
    hasUserEditedRef.current = false;

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

    if (headerBrandName.trim() && headerBrandName !== academySettings.instituteName) {
      updateAcademySettings({ instituteName: headerBrandName.trim() });
    }
    updateWebsiteCmsConfig({
      headerSubtitle: headerSubtitle.trim(),
      headerEstText: headerEstText.trim(),
      heroStyle: formData.heroStyle as 'split-video' | 'slider',
      heroHeadline: formData.heroHeadline || (syncedSlides[0]?.title || ''),
      heroSubtitle: formData.heroSubtitle || (syncedSlides[0]?.subtitle || ''),
      heroVideoUrl: formData.heroVideoUrl,
      heroVideoBadgeText: formData.heroVideoBadgeText,
      heroVideoThumbnailUrl: formData.heroVideoThumbnailUrl,
      heroBadgeText: formData.heroBadgeText || (syncedSlides[0]?.badgeText || ''),
      heroCtaText: formData.heroCtaText || (syncedSlides[0]?.ctaText || ''),
      heroPrimaryCtaText: formData.heroPrimaryCtaText || formData.heroCtaText || 'Get Admission',
      heroSecondaryCtaText: formData.heroSecondaryCtaText || 'Learn more',
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

  // Keyboard shortcut Ctrl+S or Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveAllHero();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, slides, headerBrandName, headerEstText, headerSubtitle]);

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

      {/* 0. WEBSITE HEADER BRANDING, LOGO & CAMPUS TAGLINE EDITOR (Matches user screenshot) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center space-x-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-black shrink-0">
                🏷️
              </span>
              <span>Website Top Header Branding & Logo (হেডার ব্র্যান্ডিং ও লোগো এডিটর)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              ওয়েবসাইটের একদম উপরে নেভিগেশন বারে প্রদর্শিত লোগো, প্রতিষ্ঠানের নাম, প্রতিষ্ঠার সাল ব্যাজ ও ক্যাম্পাস স্লোগান এখান থেকে সরাসরি পরিবর্তন করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveHeaderBrand}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-transform active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            {brandSavedFeedback ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" /> : <Save className="w-3.5 h-3.5" />}
            <span>{brandSavedFeedback ? "সংরক্ষিত হয়েছে (Saved)" : "Save Header Brand"}</span>
          </button>
        </div>

        {/* Visual Mock of Website Header (Exact replica of user screenshot) */}
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider pb-1">
            <span>Live Header Navigation Preview (ওয়েবসাইটে যেমন দেখাবে)</span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Synchronized</span>
            </span>
          </div>

          <div className="bg-white text-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-1.5 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs shrink-0">
                <NexgenLogo variant="crest" size={44} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm sm:text-base lg:text-lg font-black text-slate-950 tracking-tight leading-none truncate">
                    {headerBrandName || "Nexgen Computer Academy"}
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-wider shrink-0">
                    {headerEstText || "EST. 2018"}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 font-semibold truncate mt-1">
                  {headerSubtitle || `${academySettings.campusName || "Farmgate Campus"} • Govt. Standard IT Training & Career Incubator`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLogoCropModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <Crop className="w-3.5 h-3.5 text-indigo-600" />
              <span>Change / Crop Logo</span>
            </button>
          </div>
        </div>

        {/* Direct Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* 1. Institute Name */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>১. প্রতিষ্ঠানের নাম (Institute Brand Name)</span>
              <span className="text-[10px] text-indigo-600 font-semibold">ওয়েবসাইট ও সার্টিফিকেটে ব্যবহৃত</span>
            </label>
            <input
              type="text"
              value={headerBrandName}
              onChange={e => {
                hasUserEditedRef.current = true;
                setHeaderBrandName(e.target.value);
              }}
              placeholder="যেমন: Nexgen Computer Academy"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* 2. Established Badge */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>২. প্রতিষ্ঠার সাল ব্যাজ</span>
              <span className="text-[10px] text-slate-400 font-mono">EST. 2018</span>
            </label>
            <input
              type="text"
              value={headerEstText}
              onChange={e => {
                hasUserEditedRef.current = true;
                setHeaderEstText(e.target.value);
              }}
              placeholder="e.g. EST. 2018 বা প্রতিষ্ঠিত ২০১৮"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-700 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* 3. Header Subtitle / Campus Tagline */}
          <div className="md:col-span-3 space-y-1">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>৩. ক্যাম্পাস ও স্লোগান সাবটাইটেল (Header Subtitle / Tagline)</span>
              <span className="text-[10px] text-slate-500">নামের ঠিক নিচে ছোট অক্ষরে প্রদর্শিত হয়</span>
            </label>
            <input
              type="text"
              value={headerSubtitle}
              onChange={e => {
                hasUserEditedRef.current = true;
                setHeaderSubtitle(e.target.value);
              }}
              placeholder="e.g. Farmgate Campus • Govt. Standard IT Training & Career Incubator"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <p className="text-[10px] text-slate-500 pt-0.5">
              💡 টিপস: আপনি আপনার ব্রাঞ্চের নাম ও স্লোগান (যেমন: <strong className="text-slate-700">ফার্মগেট ক্যাম্পাস • সরকারি মানের প্র্যাকটিক্যাল আইটি ল্যাব</strong>) লিখে দিতে পারেন।
            </p>
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
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => handleSaveAllHero()}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Notice Ticker (নোটিশ সেভ করুন)</span>
            </button>
          </div>
        </div>

        {/* 3. Main Hero Default Texts & Video Split Hero */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Hero Style & Content Customization (হিরো লেআউট ও ভিডিও কনফিগ)</span>
            </div>
          </div>

          {/* Hero Style Selection: Modern Split Video vs Slider */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
            <label className="font-bold text-xs text-indigo-950 block">Hero Section Presentation Style (হোমপেজ হিরো স্টাইল):</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                  formData.heroStyle === 'split-video'
                    ? 'bg-white border-indigo-600 shadow-xs text-indigo-950 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="heroStyle"
                  value="split-video"
                  checked={formData.heroStyle === 'split-video'}
                  onChange={() => {
                    hasUserEditedRef.current = true;
                    setFormData({ ...formData, heroStyle: 'split-video' });
                  }}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-bold">Modern Split Video Hero (Youthins Style)</div>
                  <div className="text-[10px] text-slate-500 font-normal">বামে টাইটেল, ডেসক্রিপশন ও অ্যাকশন বাটন এবং ডানে 16:9 হাইলাইট ভিডিও প্লেয়ার</div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                  formData.heroStyle === 'slider'
                    ? 'bg-white border-indigo-600 shadow-xs text-indigo-950 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="heroStyle"
                  value="slider"
                  checked={formData.heroStyle === 'slider'}
                  onChange={() => {
                    hasUserEditedRef.current = true;
                    setFormData({ ...formData, heroStyle: 'slider' });
                  }}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-bold">Multi-Slide Banner Studio</div>
                  <div className="text-[10px] text-slate-500 font-normal">পূর্ণাঙ্গ ব্যাকগ্রাউন্ড ইমেজ, অটো-রোটেটিং স্লাইডার ও ব্যানার স্টুডিও</div>
                </div>
              </label>
            </div>
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
                placeholder="e.g. NexGen Computer Academy: Computer & Freelancing Training Center in Farmgate"
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

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900">হিরো ভিডিও ও থাম্বনেইল সেটিংস (Modern Split Video):</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    YouTube Video URL (ইউটিউব ভিডিও লিংক)
                  </label>
                  <input
                    type="url"
                    value={formData.heroVideoUrl}
                    onChange={e => {
                      hasUserEditedRef.current = true;
                      setFormData({ ...formData, heroVideoUrl: e.target.value });
                    }}
                    placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Video Badge Text (ভিডিওর ওপর ছোট ব্যাজ)
                  </label>
                  <input
                    type="text"
                    value={formData.heroVideoBadgeText}
                    onChange={e => {
                      hasUserEditedRef.current = true;
                      setFormData({ ...formData, heroVideoBadgeText: e.target.value });
                    }}
                    placeholder="e.g. কম্পিউটার বা ফ্রিল্যান্সিং শিখে ক্যারিয়ার গড়ার উপায়"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs text-rose-600 font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Video Poster / Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.heroVideoThumbnailUrl}
                    onChange={e => {
                      hasUserEditedRef.current = true;
                      setFormData({ ...formData, heroVideoThumbnailUrl: e.target.value });
                    }}
                    placeholder="e.g. https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs text-slate-600"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Primary CTA Button Label (১ম বাটন)</label>
                <input
                  type="text"
                  value={formData.heroPrimaryCtaText}
                  onChange={e => {
                    hasUserEditedRef.current = true;
                    setFormData({ ...formData, heroPrimaryCtaText: e.target.value, heroCtaText: e.target.value });
                  }}
                  placeholder="e.g. Get Admission / ভর্তি আবেদন"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Secondary CTA Button Label (২য় বাটন)</label>
                <input
                  type="text"
                  value={formData.heroSecondaryCtaText}
                  onChange={e => {
                    hasUserEditedRef.current = true;
                    setFormData({ ...formData, heroSecondaryCtaText: e.target.value });
                  }}
                  placeholder="e.g. Learn more / বিস্তারিত দেখুন"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
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

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleSaveAllHero()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Hero Headlines & Promos (হেডলাইন সেভ করুন)</span>
            </button>
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

          <div className="flex justify-end pt-3 border-t border-amber-100">
            <button
              type="button"
              onClick={() => handleSaveAllHero()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Upcoming Batches Card (অফার কার্ড সেভ করুন)</span>
            </button>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Hero & Announcements</span>
          </button>
        </div>
      </form>

      {/* Floating Persistent Quick Save Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-2xl shadow-2xl border border-indigo-500/40 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="hidden sm:flex flex-col pr-1 text-right">
          <span className="text-[11px] font-black text-indigo-300">হিরো ব্যানার সেভ</span>
          <span className="text-[9px] text-slate-400">Ctrl + S অথবা বাটনে চাপুন</span>
        </div>
        <button
          type="button"
          onClick={() => handleSaveAllHero()}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
        >
          {saveFeedback ? <CheckCircle2 className="w-4 h-4 text-emerald-100" /> : <Save className="w-4 h-4" />}
          <span>{saveFeedback ? 'সব সংরক্ষিত হয়েছে (Saved!)' : 'Save All Hero Changes (সংরক্ষণ করুন)'}</span>
        </button>
      </div>

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
