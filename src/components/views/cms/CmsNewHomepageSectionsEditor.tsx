import React, { useState, useEffect } from 'react';
import {
  NewHomepageSectionVisibility,
  AboutHeroCmsConfig,
  AboutHeroCmsStat,
  WhyChooseCmsConfig,
  WhyChooseCmsPoint,
  ExclusiveSolutionsCmsConfig,
  ExclusiveSolutionsCmsItem,
  NewsletterCtaCmsConfig,
  SnakeCtaCmsConfig,
  AdmissionBannerCmsConfig,
  PaymentMerchantsCmsConfig,
  PaymentMerchantItem,
  PaymentMethodType,
  FreeCounselingBannerConfig,
  ExpatTrustBannerConfig
} from '../../../types';
import {
  Sliders,
  Check,
  CheckCircle2,
  RotateCcw,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Award,
  BookOpen,
  Users,
  CreditCard,
  ArrowRight,
  Eye,
  Save,
  MessageSquare,
  HelpCircle,
  Phone,
  Layout,
  Tag,
  Zap,
  ChevronDown,
  ChevronUp,
  MapPin,
  Navigation,
  ExternalLink,
  Clock,
  Building2,
  Compass
} from 'lucide-react';

interface CmsNewHomepageSectionsEditorProps {
  newVisibility: NewHomepageSectionVisibility;
  onChangeNewVisibility: (updated: NewHomepageSectionVisibility) => void;
  aboutHero: AboutHeroCmsConfig;
  onChangeAboutHero: (updated: AboutHeroCmsConfig) => void;
  whyChoose: WhyChooseCmsConfig;
  onChangeWhyChoose: (updated: WhyChooseCmsConfig) => void;
  exclusiveSolutions: ExclusiveSolutionsCmsConfig;
  onChangeExclusiveSolutions: (updated: ExclusiveSolutionsCmsConfig) => void;
  newsletterCta: NewsletterCtaCmsConfig;
  onChangeNewsletterCta: (updated: NewsletterCtaCmsConfig) => void;
  snakeCta: SnakeCtaCmsConfig;
  onChangeSnakeCta: (updated: SnakeCtaCmsConfig) => void;
  admissionBanner: AdmissionBannerCmsConfig;
  onChangeAdmissionBanner: (updated: AdmissionBannerCmsConfig) => void;
  paymentMerchants: PaymentMerchantsCmsConfig;
  onChangePaymentMerchants: (updated: PaymentMerchantsCmsConfig) => void;
  mapEmbedUrl?: string;
  onChangeMapEmbedUrl?: (val: string) => void;
  mapShareUrl?: string;
  onChangeMapShareUrl?: (val: string) => void;
  mapAddress?: string;
  onChangeMapAddress?: (val: string) => void;
  mapDirections?: string;
  onChangeMapDirections?: (val: string) => void;
  mapHours?: string;
  onChangeMapHours?: (val: string) => void;
  counselingBanner?: FreeCounselingBannerConfig;
  onChangeCounselingBanner?: (updated: FreeCounselingBannerConfig) => void;
  expatTrustBanner?: ExpatTrustBannerConfig;
  onChangeExpatTrustBanner?: (updated: ExpatTrustBannerConfig) => void;
  onSaveAll: () => void;
  saveFeedback?: boolean;
}

export const CmsNewHomepageSectionsEditor: React.FC<CmsNewHomepageSectionsEditorProps> = ({
  newVisibility,
  onChangeNewVisibility,
  aboutHero,
  onChangeAboutHero,
  whyChoose,
  onChangeWhyChoose,
  exclusiveSolutions,
  onChangeExclusiveSolutions,
  newsletterCta,
  onChangeNewsletterCta,
  snakeCta,
  onChangeSnakeCta,
  admissionBanner,
  onChangeAdmissionBanner,
  paymentMerchants,
  onChangePaymentMerchants,
  mapEmbedUrl,
  onChangeMapEmbedUrl,
  mapShareUrl,
  onChangeMapShareUrl,
  mapAddress,
  onChangeMapAddress,
  mapDirections,
  onChangeMapDirections,
  mapHours,
  onChangeMapHours,
  counselingBanner,
  onChangeCounselingBanner,
  expatTrustBanner,
  onChangeExpatTrustBanner,
  onSaveAll,
  saveFeedback = false
}) => {
  const [openSubAccordion, setOpenSubAccordion] = useState<
    'switchboard' | 'aboutHero' | 'whyChoose' | 'exclusive' | 'newsletter' | 'banners' | 'merchants' | 'map' | 'all'
  >('all');

  const toggleSection = (key: keyof NewHomepageSectionVisibility) => {
    onChangeNewVisibility({
      ...newVisibility,
      [key]: !newVisibility[key]
    });
  };

  const handleEnableAllSections = () => {
    onChangeNewVisibility({
      topBar: true,
      urgencyBanner: true,
      hero: true,
      accreditationTrust: true,
      categorySlider: true,
      popularCourses: true,
      homepageSeminars: true,
      freeCounselingBanner: true,
      expatTrustBanner: true,
      exploreCategories: true,
      aboutHero: true,
      onlineCourses: true,
      successStories: true,
      studentReviews: true,
      whyChoose: true,
      newsletterCta: true,
      photoStrip: true,
      faqs: true,
      exclusiveSolutions: true,
      snakeCta: true,
      admissionBanner: true,
      locationMap: true,
      footer: true
    });
  };

  const handleApplyRecommendedLayout = () => {
    onChangeNewVisibility({
      topBar: true,
      urgencyBanner: true,
      hero: true,
      accreditationTrust: true,
      categorySlider: true,
      popularCourses: true,
      homepageSeminars: true,
      freeCounselingBanner: true,
      expatTrustBanner: true,
      exploreCategories: true,
      aboutHero: true,
      onlineCourses: false, // Streamlined: courses covered in popularCourses tabs
      successStories: true,
      studentReviews: true,
      whyChoose: true,
      newsletterCta: false, // Streamlined: free counseling lead banner already captures high-intent leads
      photoStrip: true,
      faqs: true,
      exclusiveSolutions: false, // Streamlined: merged with Why Choose Us
      snakeCta: false, // Streamlined: avoid back-to-back CTA banners
      admissionBanner: true,
      locationMap: true,
      footer: true
    });
  };

  // Section cards definition with icons and descriptions
  const sectionItems: Array<{
    key: keyof NewHomepageSectionVisibility;
    num: number;
    title: string;
    subtitle: string;
    badge: string;
    category: 'Header' | 'Hero & Courses' | 'Branding & Stories' | 'Trust & Community' | 'Banners & Footer';
  }> = [
    {
      key: 'topBar',
      num: 1,
      title: 'Top Announcement Bar',
      subtitle: 'অফিসিয়াল হেল্পলাইন নম্বর, ইমেইল ও ডিসকাউন্ট বাটন',
      badge: 'Header',
      category: 'Header'
    },
    {
      key: 'urgencyBanner',
      num: 2,
      title: 'CRO Urgency Countdown Bar',
      subtitle: 'টপ কাউন্টডাউন টাইমার ও সীমিত আসন বুকিং নোটিশ স্ট্রিপ',
      badge: 'Urgency',
      category: 'Header'
    },
    {
      key: 'hero',
      num: 3,
      title: 'Hero Video & Live Search',
      subtitle: 'স্প্লিট ভিডিও থাম্বনেইল, হেডলাইন, সাবটাইটেল ও কোর্স সার্চ',
      badge: 'Core Hero',
      category: 'Hero & Courses'
    },
    {
      key: 'accreditationTrust',
      num: 4,
      title: 'Accreditation & Govt Trust Strip (BTEB & ISO)',
      subtitle: 'বাংলাদেশ কারিগরি শিক্ষা বোর্ড স্ট্যান্ডার্ড, ISO ও এসি ল্যাব ট্রাস্ট ব্যাজ',
      badge: 'Govt Trust',
      category: 'Hero & Courses'
    },
    {
      key: 'categorySlider',
      num: 5,
      title: 'Category Slider Chips',
      subtitle: 'জনপ্রিয় কোর্স ক্যাটাগরি স্লাইডার চিপস (ডিজাইন, ওয়েব, মার্কেটিং)',
      badge: 'Interactive',
      category: 'Hero & Courses'
    },
    {
      key: 'popularCourses',
      num: 6,
      title: 'Popular Courses Grid (3x3)',
      subtitle: 'সকল কোর্স, অনলাইন, অফলাইন ও প্রি-রেকর্ডেড ফিল্টার সহ গ্রিড',
      badge: 'Courses',
      category: 'Hero & Courses'
    },
    {
      key: 'homepageSeminars',
      num: 7,
      title: 'Upcoming Free Seminars Showcase (Live Masterclasses)',
      subtitle: 'আসন্ন ফ্রি ক্যারিয়ার সেমিনার ও ১-ক্লিক ফ্রি সিট বুকিং কার্ডস',
      badge: 'Seminars',
      category: 'Hero & Courses'
    },
    {
      key: 'freeCounselingBanner',
      num: 8,
      title: 'Free Career Counseling Call Banner',
      subtitle: 'সরাসরি ফোন ও লোকেশন ভিত্তিক ফ্রি কাউন্সেলিং কল রিকোয়েস্ট লিড ফর্ম',
      badge: 'Leads',
      category: 'Hero & Courses'
    },
    {
      key: 'expatTrustBanner',
      num: 9,
      title: 'Expat & Overseas Learners Hub (NRI Support)',
      subtitle: 'প্রবাসীদের জন্য স্পেশাল নাইট ব্যাচ, আন্তর্জাতিক ভিসা/মাস্টারকার্ড পেমেন্ট ও সাপোর্ট',
      badge: 'Global NRI',
      category: 'Trust & Community'
    },
    {
      key: 'exploreCategories',
      num: 10,
      title: 'Explore Categories (4 Formats)',
      subtitle: 'অফলাইন ল্যাব, অনলাইন লাইভ, সেলফ-পেসড ও কর্পোরেট ট্রেনিং কার্ডস',
      badge: 'Delivery',
      category: 'Hero & Courses'
    },
    {
      key: 'aboutHero',
      num: 11,
      title: 'About Hero & 6 Stat Counters',
      subtitle: '১২ বছরের অভিজ্ঞতা, ২০,০০০+ শিক্ষার্থী ও ৬টি লাইভ কাউন্টার',
      badge: 'Impact',
      category: 'Branding & Stories'
    },
    {
      key: 'onlineCourses',
      num: 12,
      title: 'Online Interactive Courses Grid',
      subtitle: 'অনলাইন লাইভ ব্যাচ সেকশন (💡 টিপস: পপুলার কোর্সের অনলাইন ট্যাবে অলরেডি অন্তর্ভুক্ত)',
      badge: 'Optional Duplicate',
      category: 'Hero & Courses'
    },
    {
      key: 'successStories',
      num: 13,
      title: 'Real Student Success Stories',
      subtitle: 'সফল ফ্রিল্যান্সার ও গ্র্যাজুয়েটদের রিয়েল ইনকাম ও ভিডিও কার্ডস',
      badge: 'Proof',
      category: 'Branding & Stories'
    },
    {
      key: 'studentReviews',
      num: 14,
      title: 'Student Reviews & Ratings',
      subtitle: 'শিক্ষার্থীদের রেটিং ও অভিজ্ঞতার রিভিউ ক্যারোসেল',
      badge: 'Reviews',
      category: 'Trust & Community'
    },
    {
      key: 'whyChoose',
      num: 15,
      title: 'Why Choose NexGen Academy? (9 Cards)',
      subtitle: '১ শিক্ষার্থী ১টি কম্পিউটার, লাইফটাইম সাপোর্ট সহ ৯টি পিলার',
      badge: 'Value',
      category: 'Trust & Community'
    },
    {
      key: 'newsletterCta',
      num: 16,
      title: 'Career Counseling & Newsletter CTA',
      subtitle: 'নিউজলেটার ও ক্যারিয়ার জয়েনিং (💡 টিপস: সেকশন #৮ ফ্রি কাউন্সেলিং লিড ফর্ম সক্রিয় থাকলে এটি বন্ধ রাখলে পেজ ক্লিন থাকে)',
      badge: 'Optional Duplicate',
      category: 'Trust & Community'
    },
    {
      key: 'photoStrip',
      num: 17,
      title: 'Campus Life Photo Strip',
      subtitle: 'আধুনিক এসি কম্পিউটার ল্যাব ও ক্লাসরুমের বাস্তব ছবি গ্যালারি',
      badge: 'Campus',
      category: 'Trust & Community'
    },
    {
      key: 'faqs',
      num: 18,
      title: 'Frequently Asked Questions (FAQ)',
      subtitle: 'বাংলা ও ইংরেজি মিক্সড প্রশ্ন ও অ্যাকর্ডিয়ন সেকশন',
      badge: 'FAQ',
      category: 'Trust & Community'
    },
    {
      key: 'exclusiveSolutions',
      num: 19,
      title: 'Exclusive Solutions That Set Us Apart',
      subtitle: 'কমিউনিটি সাপোর্ট ও রিয়েল প্রজেক্ট (💡 টিপস: Why Choose Us-এ অন্তর্ভুক্ত)',
      badge: 'Optional Duplicate',
      category: 'Banners & Footer'
    },
    {
      key: 'snakeCta',
      num: 20,
      title: 'Snake CTA Banner (So Why Delay?)',
      subtitle: 'The best time to start is today (💡 টিপস: সেকশন #২১ অ্যাডমিশন ব্যানারে কভার করা)',
      badge: 'Optional Duplicate',
      category: 'Banners & Footer'
    },
    {
      key: 'admissionBanner',
      num: 21,
      title: 'Admission Is Going On (40% Scholarship)',
      subtitle: 'স্পেশাল ৪০% স্কলারশিপ ব্যানার ও সেমিনার রেজিস্ট্রেশন বাটন',
      badge: 'Offer Strip',
      category: 'Banners & Footer'
    },
    {
      key: 'locationMap',
      num: 22,
      title: 'Google Location Map & Directions',
      subtitle: 'ফার্মগেট ক্যাম্পাস গুগল লোকেশন ম্যাপ, মেট্রো রুট ও ভিজিটিং আওয়ার্স',
      badge: 'Location Map',
      category: 'Banners & Footer'
    },
    {
      key: 'footer',
      num: 23,
      title: 'Footer & Payment Merchants Strip',
      subtitle: 'ফার্মগেট ক্যাম্পাস ঠিকানা, বিকাশ/নগদ/রকেট মার্চেন্ট ও কপিরাইট',
      badge: 'Footer',
      category: 'Banners & Footer'
    }
  ];

  const activeCount = Object.values(newVisibility).filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* 1. MASTER 16-SECTION SWITCHBOARD */}
      <div id="sec-new-visibility" className="bg-white p-6 rounded-3xl border-2 border-indigo-200 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider">
                New Design Live Control
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{activeCount} / {sectionItems.length} সেকশন সক্রিয়</span>
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2 mt-1">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <span>Modern Homepage 16-Section Switchboard (নতুন ডিজাইনের সেকশন কন্ট্রোল)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              হোমপেজের যেকোনো সেকশন ক্লিক করে চালু বা বন্ধ রাখুন। সেভ করলেই ওয়েবসাইটে তাৎক্ষণিক প্রতিফলিত হবে।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleApplyRecommendedLayout}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="অপ্রয়োজনীয় ডুপ্লিকেট সেকশন বন্ধ করে হাই-কনভার্টিং সুপার ক্লিন লেআউট চালু করুন"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>🚀 রিকমেন্ডেড ক্লিন লেআউট</span>
            </button>
            <button
              type="button"
              onClick={handleEnableAllSections}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>সব সেকশন চালু</span>
            </button>
            <button
              type="button"
              onClick={onSaveAll}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              {saveFeedback ? <CheckCircle2 className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
              <span>{saveFeedback ? 'সংরক্ষিত!' : 'সেভ করুন'}</span>
            </button>
          </div>
        </div>

        {/* 16 Section Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sectionItems.map(sec => {
            const isChecked = newVisibility[sec.key] ?? true;
            return (
              <div
                key={sec.key}
                onClick={() => toggleSection(sec.key)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start space-x-3 ${
                  isChecked
                    ? 'bg-indigo-50/70 border-indigo-300 text-slate-900 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60 hover:opacity-80'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isChecked
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'border-2 border-slate-300 bg-white text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-black text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded">
                      #{sec.num}
                    </span>
                    <h5 className="font-bold text-xs truncate text-slate-900">{sec.title}</h5>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-2">{sec.subtitle}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-600">
                      {sec.badge}
                    </span>
                    <span className={`text-[10px] font-bold ${isChecked ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {isChecked ? 'সক্রিয় (Active)' : 'লুকানো (Hidden)'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ABOUT HERO & 6 STATISTICS COUNTERS EDITOR */}
      <div id="sec-abouthero" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
                Homepage Section #6
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2 mt-1">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>About Hero & 6 Stat Counters (অ্যাবাউট হিরো ও ৬টি ইমপ্যাক্ট কাউন্টার)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              হোমপেজের 'From Beginner to IT Professionals' অংশ, বিবরণ ও ৬টি কাউন্টার বক্স সরাসরি কাস্টমাইজ করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={onSaveAll}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>কাউন্টার সেভ করুন</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Texts */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ট্যাগলাইন (Top Pill Tagline)</label>
              <input
                type="text"
                value={aboutHero.tagline || ''}
                onChange={e => onChangeAboutHero({ ...aboutHero, tagline: e.target.value })}
                placeholder="e.g. Trusted for 12 Years"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-purple-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">হেডলাইন (Main Headline)</label>
              <input
                type="text"
                value={aboutHero.headline || ''}
                onChange={e => onChangeAboutHero({ ...aboutHero, headline: e.target.value })}
                placeholder="e.g. From Beginner to IT Professionals We Close That Gap."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-purple-500 outline-none transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                টিপ: 'IT Professionals' শব্দটি স্বয়ংক্রিয়ভাবে লাল রঙে হাইলাইট হবে।
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">বিস্তারিত বিবরণ (Description Paragraph)</label>
              <textarea
                rows={4}
                value={aboutHero.description || ''}
                onChange={e => onChangeAboutHero({ ...aboutHero, description: e.target.value })}
                placeholder="NexGen Computer Academy has had one goal..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed font-normal focus:bg-white focus:border-purple-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ল্যাব ব্যাজ টেক্সট (Lab Badge)</label>
                <input
                  type="text"
                  value={aboutHero.labBadgeText || ''}
                  onChange={e => onChangeAboutHero({ ...aboutHero, labBadgeText: e.target.value })}
                  placeholder="e.g. Modern AC Lab • Farmgate Campus"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-purple-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ছবি ইউআরএল (Image URL)</label>
                <input
                  type="text"
                  value={aboutHero.imageUrl || ''}
                  onChange={e => onChangeAboutHero({ ...aboutHero, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-purple-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Right Column: 6 Stat Counters */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                ৬টি লাইভ স্ট্যাটস কাউন্টার (Stats Counters)
              </span>
              <button
                type="button"
                onClick={() => {
                  const newStat: AboutHeroCmsStat = {
                    id: `st-${Date.now()}`,
                    value: '1000 +',
                    label: 'New Metric',
                    color: 'purple'
                  };
                  onChangeAboutHero({
                    ...aboutHero,
                    stats: [...(aboutHero.stats || []), newStat]
                  });
                }}
                className="px-2.5 py-1 bg-white hover:bg-purple-50 border border-slate-200 text-purple-700 text-[10px] font-bold rounded-lg flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>কাউন্টার যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {(aboutHero.stats || []).map((stat, idx) => (
                <div key={stat.id || idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400">Box #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (aboutHero.stats || []).filter((_, i) => i !== idx);
                        onChangeAboutHero({ ...aboutHero, stats: updated });
                      }}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={e => {
                        const copy = [...(aboutHero.stats || [])];
                        copy[idx] = { ...copy[idx], value: e.target.value };
                        onChangeAboutHero({ ...aboutHero, stats: copy });
                      }}
                      placeholder="e.g. 20000 +"
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-slate-900"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={e => {
                        const copy = [...(aboutHero.stats || [])];
                        copy[idx] = { ...copy[idx], label: e.target.value };
                        onChangeAboutHero({ ...aboutHero, stats: copy });
                      }}
                      placeholder="e.g. Successful Students"
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold">কালার:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...(aboutHero.stats || [])];
                        copy[idx] = { ...copy[idx], color: 'purple' };
                        onChangeAboutHero({ ...aboutHero, stats: copy });
                      }}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        stat.color === 'purple' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700'
                      }`}
                    >
                      Purple
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...(aboutHero.stats || [])];
                        copy[idx] = { ...copy[idx], color: 'red' };
                        onChangeAboutHero({ ...aboutHero, stats: copy });
                      }}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        stat.color === 'red' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      Red
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. WHY CHOOSE NEXGEN ACADEMY (9 FEATURE CARDS) */}
      <div id="sec-whychoose" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                Homepage Section #10
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2 mt-1">
              <Award className="w-5 h-5 text-amber-600" />
              <span>Why Choose NexGen Academy? (৯টি বিশেষ সুবিধা ও ফিচার কার্ড)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              হোমপেজের 'Why Choose NexGen Academy?' এর হেডিং ও ৯টি ফিচার পয়েন্ট এডিট বা নতুন পয়েন্ট যোগ করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={onSaveAll}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>ফিচার সেভ করুন</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">সেকশন হেডিং (Section Heading)</label>
            <input
              type="text"
              value={whyChoose.heading || ''}
              onChange={e => onChangeWhyChoose({ ...whyChoose, heading: e.target.value })}
              placeholder="e.g. Why Choose NexGen Academy?"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">সাবটাইটেল / বিবরণ (Description)</label>
            <input
              type="text"
              value={whyChoose.description || ''}
              onChange={e => onChangeWhyChoose({ ...whyChoose, description: e.target.value })}
              placeholder="NexGen Computer Academy is not your typical training centre..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        {/* Why Choose Points List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              ফিচার কার্ড তালিকা ({(whyChoose.points || []).length} Points)
            </span>
            <button
              type="button"
              onClick={() => {
                const newPoint: WhyChooseCmsPoint = {
                  id: `pt-${Date.now()}`,
                  title: 'নতুন কোর্স সুবিধা বা বিশেষ ফিচার',
                  desc: 'সংক্ষিপ্ত বিবরণ'
                };
                onChangeWhyChoose({
                  ...whyChoose,
                  points: [...(whyChoose.points || []), newPoint]
                });
              }}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন ফিচার পয়েন্ট যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(whyChoose.points || []).map((pt, idx) => (
              <div key={pt.id || idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                    পয়েন্ট #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (whyChoose.points || []).filter((_, i) => i !== idx);
                      onChangeWhyChoose({ ...whyChoose, points: updated });
                    }}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">শিরোনাম (Title)</label>
                  <input
                    type="text"
                    value={pt.title}
                    onChange={e => {
                      const copy = [...(whyChoose.points || [])];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      onChangeWhyChoose({ ...whyChoose, points: copy });
                    }}
                    placeholder="e.g. ১ শিক্ষার্থী ১টি কম্পিউটার"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">বিবরণ (Description)</label>
                  <input
                    type="text"
                    value={pt.desc || ''}
                    onChange={e => {
                      const copy = [...(whyChoose.points || [])];
                      copy[idx] = { ...copy[idx], desc: e.target.value };
                      onChangeWhyChoose({ ...whyChoose, points: copy });
                    }}
                    placeholder="e.g. ক্লাসের প্রতিটি সেশনে ব্যক্তিগত হাই-কনফিগ পিসি"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. EXCLUSIVE SOLUTIONS & NEWSLETTER CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exclusive Solutions */}
        <div id="sec-exclusive" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              Section #14
            </span>
            <h4 className="font-black text-slate-900 text-base mt-1">Exclusive Solutions That Set Us Apart</h4>
            <p className="text-xs text-slate-500">হোমপেজের ৪টি এক্সক্লুসিভ সল্যুশন কার্ডের টেক্সট</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">হেডিং</label>
              <input
                type="text"
                value={exclusiveSolutions.heading || ''}
                onChange={e => onChangeExclusiveSolutions({ ...exclusiveSolutions, heading: e.target.value })}
                placeholder="Exclusive Solutions That Set Us Apart"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">সাবটাইটেল</label>
              <textarea
                rows={2}
                value={exclusiveSolutions.description || ''}
                onChange={e => onChangeExclusiveSolutions({ ...exclusiveSolutions, description: e.target.value })}
                placeholder="Our aim is to make your learning experience..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal"
              />
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-700 block">সল্যুশন পিলার্স (Items)</span>
              {(exclusiveSolutions.items || []).map((item, idx) => (
                <div key={item.id || idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                  <input
                    type="text"
                    value={item.title}
                    onChange={e => {
                      const copy = [...(exclusiveSolutions.items || [])];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      onChangeExclusiveSolutions({ ...exclusiveSolutions, items: copy });
                    }}
                    placeholder="Title"
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                  />
                  <input
                    type="text"
                    value={item.desc}
                    onChange={e => {
                      const copy = [...(exclusiveSolutions.items || [])];
                      copy[idx] = { ...copy[idx], desc: e.target.value };
                      onChangeExclusiveSolutions({ ...exclusiveSolutions, items: copy });
                    }}
                    placeholder="Description"
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter / Career Counseling CTA */}
        <div id="sec-newsletter" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
              Section #11
            </span>
            <h4 className="font-black text-slate-900 text-base mt-1">Career Counseling & Newsletter Banner</h4>
            <p className="text-xs text-slate-500">Upgrade learning experience & free masterclass ব্যানার</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ছোট আইব্রো ট্যাগ (Eyebrow)</label>
              <input
                type="text"
                value={newsletterCta.eyebrow || ''}
                onChange={e => onChangeNewsletterCta({ ...newsletterCta, eyebrow: e.target.value })}
                placeholder="Career Counseling & Masterclass"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-indigo-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মূল শিরোনাম (Title)</label>
              <input
                type="text"
                value={newsletterCta.title || ''}
                onChange={e => onChangeNewsletterCta({ ...newsletterCta, title: e.target.value })}
                placeholder="Upgrade your learning experience & unlock high-demand IT careers."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">বিবরণ (Description)</label>
              <textarea
                rows={2}
                value={newsletterCta.description || ''}
                onChange={e => onChangeNewsletterCta({ ...newsletterCta, description: e.target.value })}
                placeholder="Join our free career counseling session..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বাটন টেক্সট (Button)</label>
                <input
                  type="text"
                  value={newsletterCta.buttonText || ''}
                  onChange={e => onChangeNewsletterCta({ ...newsletterCta, buttonText: e.target.value })}
                  placeholder="Join Free Masterclass"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নোট / গ্যারান্টি ব্যাজ (Note)</label>
                <input
                  type="text"
                  value={newsletterCta.note || ''}
                  onChange={e => onChangeNewsletterCta({ ...newsletterCta, note: e.target.value })}
                  placeholder="⚡ 100% Free Entry • No Prior Experience Required"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SNAKE CTA & ADMISSION 40% SCHOLARSHIP BANNER */}
      <div id="sec-banners" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Snake CTA */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-black uppercase">
              Section #15
            </span>
            <h4 className="font-black text-slate-900 text-base mt-1">Snake CTA Banner (So Why Delay?)</h4>
            <p className="text-xs text-slate-500">হোমপেজের বটম ওভাল এনরোলমেন্ট ব্যানার</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">শিরোনাম (Title)</label>
              <input
                type="text"
                value={snakeCta.title || ''}
                onChange={e => onChangeSnakeCta({ ...snakeCta, title: e.target.value })}
                placeholder="The Best Time to Start is Today."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">সাবটাইটেল (Subtitle)</label>
              <textarea
                rows={2}
                value={snakeCta.subtitle || ''}
                onChange={e => onChangeSnakeCta({ ...snakeCta, subtitle: e.target.value })}
                placeholder="Take the first step towards a financially independent IT career..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">বাটন টেক্সট (CTA Text)</label>
              <input
                type="text"
                value={snakeCta.ctaText || ''}
                onChange={e => onChangeSnakeCta({ ...snakeCta, ctaText: e.target.value })}
                placeholder="Get Started Now"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Admission Banner */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-black uppercase">
              Section #16
            </span>
            <h4 className="font-black text-slate-900 text-base mt-1">Admission Is Going On (40% Scholarship)</h4>
            <p className="text-xs text-slate-500">হোমপেজের ব্লু ব্যাকগ্রাউন্ডের এডমিশন ও সেমিনার স্ট্রিপ</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ডিসকাউন্ট ব্যাজ (Discount Badge)</label>
              <input
                type="text"
                value={admissionBanner.discountBadge || ''}
                onChange={e => onChangeAdmissionBanner({ ...admissionBanner, discountBadge: e.target.value })}
                placeholder="Special 40% Scholarship"
                className="w-full p-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">শিরোনাম (Title)</label>
              <input
                type="text"
                value={admissionBanner.title || ''}
                onChange={e => onChangeAdmissionBanner({ ...admissionBanner, title: e.target.value })}
                placeholder="New Admission is Going On!"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">সাবটাইটেল (Subtitle)</label>
              <textarea
                rows={2}
                value={admissionBanner.subtitle || ''}
                onChange={e => onChangeAdmissionBanner({ ...admissionBanner, subtitle: e.target.value })}
                placeholder="Limited seats per lab batch. Enroll now..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কোর্স বাটন টেক্সট (CTA Text)</label>
              <input
                type="text"
                value={admissionBanner.ctaText || ''}
                onChange={e => onChangeAdmissionBanner({ ...admissionBanner, ctaText: e.target.value })}
                placeholder="Browse Course"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5.5 FREE CAREER COUNSELING LEAD CALL BANNER */}
      <div id="sec-freecounseling" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Homepage Section #8 • High-Converting Lead Magnet
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                newVisibility.freeCounselingBanner ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {newVisibility.freeCounselingBanner ? '✓ বর্তমানে হোমপেজে সক্রিয়' : '✕ লুকানো রয়েছে'}
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2 mt-1">
              <Phone className="w-5 h-5 text-emerald-600" />
              <span>Free Career Counseling Lead Call Banner (ফ্রি ক্যারিয়ার কাউন্সেলিং ও লিড ফর্ম)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              হোমপেজে সেমিনারের নিচে প্রদর্শিত ১-ক্লিক ফ্রি ক্যারিয়ার কাউন্সেলিং কলব্যাক ফর্মের হেডিং, সাবটাইটেল ও নম্বর কাস্টমাইজ করুন।
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => toggleSection('freeCounselingBanner')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                newVisibility.freeCounselingBanner
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span>{newVisibility.freeCounselingBanner ? 'সেকশন বন্ধ করুন' : 'সেকশন চালু করুন'}</span>
            </button>
            <button
              type="button"
              onClick={onSaveAll}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সেভ করুন</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ব্যাজ / ট্যাগ টেক্সট (Tag Badge)</label>
            <input
              type="text"
              value={counselingBanner?.tagText || ''}
              onChange={e => onChangeCounselingBanner && onChangeCounselingBanner({ ...counselingBanner, tagText: e.target.value })}
              placeholder="১০০% ফ্রি ক্যারিয়ার কাউন্সেলিং ও গাইডলাইন"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">হটলাইন নম্বর ওভাররাইড (Optional Hotline Override)</label>
            <input
              type="text"
              value={counselingBanner?.hotlineOverride || ''}
              onChange={e => onChangeCounselingBanner && onChangeCounselingBanner({ ...counselingBanner, hotlineOverride: e.target.value })}
              placeholder="01798444444 (খালি রাখলে মূল হেল্পলাইন ব্যবহৃত হবে)"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">মূল শিরোনাম (Title)</label>
            <input
              type="text"
              value={counselingBanner?.title || ''}
              onChange={e => onChangeCounselingBanner && onChangeCounselingBanner({ ...counselingBanner, title: e.target.value })}
              placeholder="সঠিক কোর্স নির্বাচনে সিদ্ধান্ত নিতে পারছেন না?"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">সাবটাইটেল ও বর্ণনা (Subtitle)</label>
            <textarea
              rows={2}
              value={counselingBanner?.subtitle || ''}
              onChange={e => onChangeCounselingBanner && onChangeCounselingBanner({ ...counselingBanner, subtitle: e.target.value })}
              placeholder="আপনার শিক্ষাগত যোগ্যতা ও আগ্রহ অনুযায়ী কোন আইটি স্কিল দিয়ে সফল ফ্রিল্যান্সিং বা জব ক্যারিয়ার গড়া সম্ভব..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 5.6 EXPAT & OVERSEAS LEARNERS HUB (NRI SUPPORT) */}
      <div id="sec-expattrust" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider">
                Homepage Section #9 • Global & Overseas Outreach
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                newVisibility.expatTrustBanner ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {newVisibility.expatTrustBanner ? '✓ বর্তমানে হোমপেজে সক্রিয়' : '✕ লুকানো রয়েছে'}
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2 mt-1">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Expat & Overseas Learners Hub (প্রবাসী বাংলাদেশি লার্নার্স হাব কাস্টমাইজেশন)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              প্রবাসীদের জন্য স্পেশাল নাইট ব্যাচ, আন্তর্জাতিক ভিসা/মাস্টারকার্ড পেমেন্ট ও ডেডিকেটেড হোয়াটসঅ্যাপ সাপোর্ট ব্যানার এডিট করুন।
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => toggleSection('expatTrustBanner')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                newVisibility.expatTrustBanner
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span>{newVisibility.expatTrustBanner ? 'সেকশন বন্ধ করুন' : 'সেকশন চালু করুন'}</span>
            </button>
            <button
              type="button"
              onClick={onSaveAll}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সেভ করুন</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ব্যাজ টেক্সট (Tag Badge)</label>
              <input
                type="text"
                value={expatTrustBanner?.tagText || ''}
                onChange={e => onChangeExpatTrustBanner && onChangeExpatTrustBanner({ ...expatTrustBanner, tagText: e.target.value })}
                placeholder="প্রবাসী বাংলাদেশি লার্নার্স হাব • Expat & NRI Hub"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ডেডিকেটেড হোয়াটসঅ্যাপ নম্বর (Expat WhatsApp Helpline)</label>
              <input
                type="text"
                value={expatTrustBanner?.whatsappOverride || ''}
                onChange={e => onChangeExpatTrustBanner && onChangeExpatTrustBanner({ ...expatTrustBanner, whatsappOverride: e.target.value })}
                placeholder="8801798444444"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">ব্যানার প্রধান শিরোনাম (Title)</label>
              <input
                type="text"
                value={expatTrustBanner?.title || ''}
                onChange={e => onChangeExpatTrustBanner && onChangeExpatTrustBanner({ ...expatTrustBanner, title: e.target.value })}
                placeholder="প্রবাসে থেকেই শিখুন ইন-ডিমান্ড আইটি ও ফ্রিল্যান্সিং স্কিল"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">সাবটাইটেল ও বিস্তারিত বিবরণ (Subtitle)</label>
              <textarea
                rows={2}
                value={expatTrustBanner?.subtitle || ''}
                onChange={e => onChangeExpatTrustBanner && onChangeExpatTrustBanner({ ...expatTrustBanner, subtitle: e.target.value })}
                placeholder="বিশ্বের যেকোনো দেশ থেকে আপনার সুবিধাজনক সময়ে সরাসরি ইন্টারেক্টিভ লাইভ ক্লাসে অংশ নিন..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed"
              />
            </div>
          </div>

          {/* 4 Feature Points Editor */}
          <div className="pt-2 border-t border-slate-100">
            <h5 className="font-bold text-xs text-slate-800 mb-2">৪টি বিশেষ প্রবাসী ফিচার কার্ড (4 Expat Highlight Pillars)</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(expatTrustBanner?.features || [
                { title: 'টাইমজোন ফ্রেন্ডলি লাইভ ক্লাস', desc: 'মধ্যপ্রাচ্য, ইউরোপ, আমেরিকা ও মালয়েশিয়ার সময় উপযোগী স্পেশাল ইভনিং ও উইকেন্ড ব্যাচ।' },
                { title: 'আন্তর্জাতিক পেমেন্ট সুবিধা', desc: 'Visa, Mastercard, Amex বা এক্সচেঞ্জ রেমিট্যান্সের মাধ্যমে সরাসরি ফি পরিশোধের সুযোগ।' },
                { title: 'পরিবারের জন্য গিফট এনরোলমেন্ট', desc: 'প্রবাসে থেকে দেশে থাকা ভাই-বোন, সন্তান বা প্রিয়জনের জন্য সহজ ১-ক্লিক কোর্স বুকিং।' },
                { title: 'ডেডিকেটেড ১-অন-১ সাপোর্ট', desc: 'লাইভ ক্লাস রেকর্ডিং ও যেকোনো প্রয়োজনে হোয়াটসঅ্যাপে সার্বক্ষণিক মেন্টর সহায়তা।' }
              ]).map((feat, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      ফিচার #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={e => {
                        if (!onChangeExpatTrustBanner) return;
                        const currentFeatures = [...(expatTrustBanner?.features || [
                          { title: 'টাইমজোন ফ্রেন্ডলি লাইভ ক্লাস', desc: 'মধ্যপ্রাচ্য, ইউরোপ, আমেরিকা ও মালয়েশিয়ার সময় উপযোগী স্পেশাল ইভনিং ও উইকেন্ড ব্যাচ।' },
                          { title: 'আন্তর্জাতিক পেমেন্ট সুবিধা', desc: 'Visa, Mastercard, Amex বা এক্সচেঞ্জ রেমিট্যান্সের মাধ্যমে সরাসরি ফি পরিশোধের সুযোগ।' },
                          { title: 'পরিবারের জন্য গিফট এনরোলমেন্ট', desc: 'প্রবাসে থেকে দেশে থাকা ভাই-বোন, সন্তান বা প্রিয়জনের জন্য সহজ ১-ক্লিক কোর্স বুকিং।' },
                          { title: 'ডেডিকেটেড ১-অন-১ সাপোর্ট', desc: 'লাইভ ক্লাস রেকর্ডিং ও যেকোনো প্রয়োজনে হোয়াটসঅ্যাপে সার্বক্ষণিক মেন্টর সহায়তা।' }
                        ])];
                        currentFeatures[idx] = { ...currentFeatures[idx], title: e.target.value };
                        onChangeExpatTrustBanner({ ...expatTrustBanner, features: currentFeatures });
                      }}
                      className="flex-1 font-bold text-xs p-1 bg-white border border-slate-200 rounded-lg text-slate-900"
                      placeholder="ফিচার শিরোনাম"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={feat.desc}
                    onChange={e => {
                      if (!onChangeExpatTrustBanner) return;
                      const currentFeatures = [...(expatTrustBanner?.features || [
                        { title: 'টাইমজোন ফ্রেন্ডলি লাইভ ক্লাস', desc: 'মধ্যপ্রাচ্য, ইউরোপ, আমেরিকা ও মালয়েশিয়ার সময় উপযোগী স্পেশাল ইভনিং ও উইকেন্ড ব্যাচ।' },
                        { title: 'আন্তর্জাতিক পেমেন্ট সুবিধা', desc: 'Visa, Mastercard, Amex বা এক্সচেঞ্জ রেমিট্যান্সের মাধ্যমে সরাসরি ফি পরিশোধের সুযোগ।' },
                        { title: 'পরিবারের জন্য গিফট এনরোলমেন্ট', desc: 'প্রবাসে থেকে দেশে থাকা ভাই-বোন, সন্তান বা প্রিয়জনের জন্য সহজ ১-ক্লিক কোর্স বুকিং।' },
                        { title: 'ডেডিকেটেড ১-অন-১ সাপোর্ট', desc: 'লাইভ ক্লাস রেকর্ডিং ও যেকোনো প্রয়োজনে হোয়াটসঅ্যাপে সার্বক্ষণিক মেন্টর সহায়তা।' }
                      ])];
                      currentFeatures[idx] = { ...currentFeatures[idx], desc: e.target.value };
                      onChangeExpatTrustBanner({ ...expatTrustBanner, features: currentFeatures });
                    }}
                    className="w-full text-[11px] p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 leading-snug"
                    placeholder="ফিচার বিবরণ"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. PAYMENT MERCHANTS STRIP IN FOOTER */}
      <div id="sec-merchants" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider">
                Footer Strip #17 • Payment Gateway & Make Payment
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ✓ লাইভ ফুটারে সক্রিয়
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2 mt-1">
              <CreditCard className="w-5 h-5 text-teal-600" />
              <span>Make Payment & Payment Methods (ফুটার পেমেন্ট ও মার্চেন্ট অপশন)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ওয়েবসাইটের ফুটারে মেক পেমেন্ট, সেন্ড মানি ও মার্চেন্ট নম্বর ডাইনামিকভাবে এডিট, নতুন মেথড যোগ ও ড্রপডাউন পরিবর্তন করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={onSaveAll}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>পেমেন্ট সেটিংস সেভ করুন</span>
          </button>
        </div>

        {/* Section Heading & Subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>পেমেন্ট সেকশন শিরোনাম (Section Title)</span>
              <span className="text-[10px] text-teal-700 font-bold">ডিফল্ট: Make Payment</span>
            </label>
            <input
              type="text"
              value={paymentMerchants.sectionTitle ?? 'Make Payment'}
              onChange={e => onChangePaymentMerchants({ ...paymentMerchants, sectionTitle: e.target.value })}
              placeholder="e.g. Make Payment বা Our Payment Merchant"
              className="w-full p-2 bg-white border border-teal-200 rounded-xl text-xs font-bold text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>সাবটাইটেল / নির্দেশনামূলক টেক্সট</span>
              <span className="text-[10px] text-slate-500">ঐচ্ছিক</span>
            </label>
            <input
              type="text"
              value={paymentMerchants.sectionSubtitle || ''}
              onChange={e => onChangePaymentMerchants({ ...paymentMerchants, sectionSubtitle: e.target.value })}
              placeholder="আমাদের যেকোনো অফিশিয়াল মার্চেন্ট বা পেমেন্ট মাধ্যমে সরাসরি ফি পরিশোধ করুন"
              className="w-full p-2 bg-white border border-teal-200 rounded-xl text-xs font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <span>পেমেন্ট মেথড তালিকা (Payment Methods List)</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                {(paymentMerchants.merchants && paymentMerchants.merchants.length > 0
                  ? paymentMerchants.merchants
                  : [1, 2, 3, 4]
                ).length} টি মেথড
              </span>
            </span>

            <button
              type="button"
              onClick={() => {
                const currentList: PaymentMerchantItem[] =
                  paymentMerchants.merchants && paymentMerchants.merchants.length > 0
                    ? [...paymentMerchants.merchants]
                    : [
                        {
                          id: 'pm-1',
                          provider: 'bKash',
                          type: paymentMerchants.bkashType || 'make_payment',
                          accountNumber: paymentMerchants.bkashNumber || '01795077536',
                          note: 'Select "Make Payment" in bKash App',
                          isActive: true
                        },
                        {
                          id: 'pm-2',
                          provider: 'নগদ (Nagad)',
                          type: paymentMerchants.nagadType || 'make_payment',
                          accountNumber: paymentMerchants.nagadNumber || '01795077536',
                          note: 'Select "Make Payment"',
                          isActive: true
                        },
                        {
                          id: 'pm-3',
                          provider: 'Rocket',
                          type: paymentMerchants.rocketType || 'make_payment',
                          accountNumber: paymentMerchants.rocketNumber || '01795077536',
                          note: 'Select "Make Payment"',
                          isActive: true
                        },
                        {
                          id: 'pm-4',
                          provider: 'sslcommerz',
                          type: 'merchant',
                          accountNumber: 'Cards & Net Banking',
                          note: paymentMerchants.sslcommerzNote || 'Instant Online Gateway',
                          isActive: true
                        }
                      ];

                currentList.push({
                  id: 'pm-' + Date.now(),
                  provider: 'New Payment Method',
                  type: 'make_payment',
                  accountNumber: '017XXXXXXXX',
                  note: 'Make Payment',
                  isActive: true
                });

                onChangePaymentMerchants({
                  ...paymentMerchants,
                  merchants: currentList
                });
              }}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ নতুন পেমেন্ট মেথড যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(paymentMerchants.merchants && paymentMerchants.merchants.length > 0
              ? paymentMerchants.merchants
              : [
                  {
                    id: 'pm-1',
                    provider: 'bKash',
                    type: (paymentMerchants.bkashType || 'make_payment') as PaymentMethodType,
                    accountNumber: paymentMerchants.bkashNumber || '01795077536',
                    note: 'Select "Make Payment" in bKash App',
                    isActive: true
                  },
                  {
                    id: 'pm-2',
                    provider: 'নগদ (Nagad)',
                    type: (paymentMerchants.nagadType || 'make_payment') as PaymentMethodType,
                    accountNumber: paymentMerchants.nagadNumber || '01795077536',
                    note: 'Select "Make Payment"',
                    isActive: true
                  },
                  {
                    id: 'pm-3',
                    provider: 'Rocket',
                    type: (paymentMerchants.rocketType || 'make_payment') as PaymentMethodType,
                    accountNumber: paymentMerchants.rocketNumber || '01795077536',
                    note: 'Select "Make Payment"',
                    isActive: true
                  },
                  {
                    id: 'pm-4',
                    provider: 'sslcommerz',
                    type: 'merchant' as PaymentMethodType,
                    accountNumber: 'Cards & Net Banking',
                    note: paymentMerchants.sslcommerzNote || 'Instant Online Gateway',
                    isActive: true
                  }
                ]
            ).map((item, idx) => {
              const currentList: PaymentMerchantItem[] =
                paymentMerchants.merchants && paymentMerchants.merchants.length > 0
                  ? [...paymentMerchants.merchants]
                  : [
                      {
                        id: 'pm-1',
                        provider: 'bKash',
                        type: (paymentMerchants.bkashType || 'make_payment') as PaymentMethodType,
                        accountNumber: paymentMerchants.bkashNumber || '01795077536',
                        note: 'Select "Make Payment" in bKash App',
                        isActive: true
                      },
                      {
                        id: 'pm-2',
                        provider: 'নগদ (Nagad)',
                        type: (paymentMerchants.nagadType || 'make_payment') as PaymentMethodType,
                        accountNumber: paymentMerchants.nagadNumber || '01795077536',
                        note: 'Select "Make Payment"',
                        isActive: true
                      },
                      {
                        id: 'pm-3',
                        provider: 'Rocket',
                        type: (paymentMerchants.rocketType || 'make_payment') as PaymentMethodType,
                        accountNumber: paymentMerchants.rocketNumber || '01795077536',
                        note: 'Select "Make Payment"',
                        isActive: true
                      },
                      {
                        id: 'pm-4',
                        provider: 'sslcommerz',
                        type: 'merchant' as PaymentMethodType,
                        accountNumber: 'Cards & Net Banking',
                        note: paymentMerchants.sslcommerzNote || 'Instant Online Gateway',
                        isActive: true
                      }
                    ];

              const updateItem = (updates: Partial<PaymentMerchantItem>) => {
                currentList[idx] = { ...currentList[idx], ...updates };
                // Keep backward compatible fields updated
                const bKashObj = currentList.find(m => m.provider.toLowerCase().includes('bkash'));
                const nagadObj = currentList.find(m => m.provider.toLowerCase().includes('nagad') || m.provider.includes('নগদ'));
                const rocketObj = currentList.find(m => m.provider.toLowerCase().includes('rocket') || m.provider.includes('রকেট'));
                const sslObj = currentList.find(m => m.provider.toLowerCase().includes('ssl'));

                onChangePaymentMerchants({
                  ...paymentMerchants,
                  merchants: currentList,
                  bkashNumber: bKashObj?.accountNumber || paymentMerchants.bkashNumber,
                  bkashType: bKashObj?.type || paymentMerchants.bkashType,
                  nagadNumber: nagadObj?.accountNumber || paymentMerchants.nagadNumber,
                  nagadType: nagadObj?.type || paymentMerchants.nagadType,
                  rocketNumber: rocketObj?.accountNumber || paymentMerchants.rocketNumber,
                  rocketType: rocketObj?.type || paymentMerchants.rocketType,
                  sslcommerzNote: sslObj?.accountNumber || paymentMerchants.sslcommerzNote
                });
              };

              const removeItem = () => {
                const filtered = currentList.filter((_, i) => i !== idx);
                onChangePaymentMerchants({
                  ...paymentMerchants,
                  merchants: filtered
                });
              };

              return (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      পেমেন্ট মাধ্যম #{idx + 1}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <label className="text-[10px] font-bold text-slate-500 flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isActive !== false}
                          onChange={e => updateItem({ isActive: e.target.checked })}
                          className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                        />
                        <span>{item.isActive !== false ? 'সক্রিয়' : 'বন্ধ'}</span>
                      </label>
                      <button
                        type="button"
                        onClick={removeItem}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="এই পেমেন্ট মাধ্যমটি ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Provider Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      প্রোভাইডারের নাম (Provider Name)
                    </label>
                    <input
                      type="text"
                      value={item.provider}
                      onChange={e => updateItem({ provider: e.target.value })}
                      placeholder="e.g. bKash / নগদ / Rocket"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>

                  {/* Dropdown for Type: make_payment / send_money / merchant */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      পেমেন্ট টাইপ (Payment Type)
                    </label>
                    <select
                      value={item.type || 'make_payment'}
                      onChange={e => updateItem({ type: e.target.value as PaymentMethodType })}
                      className="w-full p-2 bg-white border border-teal-300 rounded-xl text-xs font-bold text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    >
                      <option value="make_payment">✓ Make Payment (মেক পেমেন্ট)</option>
                      <option value="send_money">💸 Send Money (সেন্ড মানি - পার্সোনাল)</option>
                      <option value="merchant">🏢 Merchant (মার্চেন্ট অ্যাকাউন্ট)</option>
                    </select>
                  </div>

                  {/* Account Number */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      হিসাব / মার্চেন্ট নম্বর (Account Number)
                    </label>
                    <input
                      type="text"
                      value={item.accountNumber}
                      onChange={e => updateItem({ accountNumber: e.target.value })}
                      placeholder="e.g. 01795077536"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                    />
                  </div>

                  {/* Note / Instruction */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">
                      সংক্ষিপ্ত নোট / নির্দেশনা (Note)
                    </label>
                    <input
                      type="text"
                      value={item.note || ''}
                      onChange={e => updateItem({ note: e.target.value })}
                      placeholder="e.g. Select Make Payment in App"
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-medium text-slate-600"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7. GOOGLE LOCATION MAP & PHYSICAL CAMPUS SHOWCASE */}
      <div id="sec-map" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider">
                Homepage Section #14 • Interactive Geo Map
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                newVisibility.locationMap ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {newVisibility.locationMap ? '✓ বর্তমানে হোমপেজে সক্রিয়' : '✕ লুকানো রয়েছে'}
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2 mt-1">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <span>Google Location Map & Physical Campus Showcase (গুগল লোকেশন ম্যাপ ও ক্যাম্পাস তথ্য)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ফার্মগেট ক্যাম্পাস গুগল লোকেশন ম্যাপ এম্বেড লিংক, ডিরেক্ট গুগল ম্যাপ নেভিগেশন লিংক, ঠিকানা ও ভিজিটিং আওয়ার্স কাস্টমাইজ করুন।
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => toggleSection('locationMap')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                newVisibility.locationMap
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span>{newVisibility.locationMap ? 'ম্যাপ সেকশন বন্ধ করুন' : 'ম্যাপ সেকশন চালু করুন'}</span>
            </button>
            <button
              type="button"
              onClick={onSaveAll}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>ম্যাপ তথ্য সেভ করুন</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: 7 Cols */}
          <div className="lg:col-span-7 space-y-4">
            {/* Google Map Embed Iframe URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                  <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Google Map Embed URL (গুগল ম্যাপ এম্বেড আইফ্রেম লিংক)</span>
                </label>
                <button
                  type="button"
                  onClick={() => onChangeMapEmbedUrl && onChangeMapEmbedUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848881261358!2d90.3887!3d23.7527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ1JzA5LjciTiA5MMKwMjMnMTkuMyJF!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd')}
                  className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  রিসেট ডিফল্ট লিংক
                </button>
              </div>
              <input
                type="text"
                value={mapEmbedUrl || ''}
                onChange={e => onChangeMapEmbedUrl && onChangeMapEmbedUrl(e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                গুগল ম্যাপে আপনার লোকেশন খুঁজে &quot;Share&quot; &gt; &quot;Embed a map&quot; অপশনে ক্লিক করে <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">src=&quot;...&quot;</code> এর ভিতরের লিংকটি এখানে পেস্ট করুন।
              </p>
            </div>

            {/* Direct Google Maps Share / Navigation Link */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Map Direct Navigation URL (গুগল ম্যাপ সরাসরি লিংক)</span>
              </label>
              <input
                type="text"
                value={mapShareUrl || ''}
                onChange={e => onChangeMapShareUrl && onChangeMapShareUrl(e.target.value)}
                placeholder="https://maps.app.goo.gl/... অথবা https://share.google/..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                শিক্ষার্থীরা &quot;Google Maps-এ দেখুন&quot; বাটনে ক্লিক করলে এই লিংকটি তাদের গুগল ম্যাপস অ্যাপ বা ব্রাউজারে ওপেন হবে।
              </p>
            </div>

            {/* Physical Campus Address */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Physical Campus Address (ক্যাম্পাসের পূর্ণাঙ্গ ঠিকানা)</span>
              </label>
              <input
                type="text"
                value={mapAddress || ''}
                onChange={e => onChangeMapAddress && onChangeMapAddress(e.target.value)}
                placeholder="Level-4, Farmgate Super Market, Farmgate, Dhaka-1215"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Metro Rail & Landmark Directions */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>Metro Station & Landmark Directions (মেট্রো স্টেশন ও ল্যান্ডমার্ক দিকনির্দেশনা)</span>
              </label>
              <input
                type="text"
                value={mapDirections || ''}
                onChange={e => onChangeMapDirections && onChangeMapDirections(e.target.value)}
                placeholder="ফার্মগেট মেট্রো স্টেশন (Exit 3) থেকে মাত্র ২ মিনিট হাঁটার পথ, আনন্দ সিনেমা হল সংলগ্ন।"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Visiting / Lab Hours */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Campus Lab & Visiting Hours (ল্যাব ও অফিস সময়সূচি)</span>
              </label>
              <input
                type="text"
                value={mapHours || ''}
                onChange={e => onChangeMapHours && onChangeMapHours(e.target.value)}
                placeholder="শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - রাত ৯:০০ | শুক্রবার: বিকাল ২:৩০ - রাত ৯:০০"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Live Preview: 5 Cols */}
          <div className="lg:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-700 flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>Live Interactive Map Preview</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                লাইভ প্রিভিউ
              </span>
            </div>

            <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-300 bg-slate-200 shadow-inner relative">
              {mapEmbedUrl ? (
                <iframe
                  title="Campus Map Preview"
                  src={mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                  <MapPin className="w-8 h-8 text-slate-300 mb-1" />
                  <span>কোনো গুগল ম্যাপ লিংক দেওয়া নেই</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">{mapAddress || 'ফার্মগেট ক্যাম্পাস'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {mapDirections || 'মেট্রো স্টেশন সংলগ্ন'}
              </p>
              <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                <span>ল্যাব সময়সূচি:</span>
                <span className="font-bold text-emerald-700">{mapHours || 'সকাল ৯:০০ - রাত ৯:০০'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
