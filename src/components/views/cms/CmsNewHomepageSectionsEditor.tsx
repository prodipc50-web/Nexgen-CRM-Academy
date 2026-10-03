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
  PaymentMerchantsCmsConfig
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
  ChevronUp
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
  onSaveAll,
  saveFeedback = false
}) => {
  const [openSubAccordion, setOpenSubAccordion] = useState<
    'switchboard' | 'aboutHero' | 'whyChoose' | 'exclusive' | 'newsletter' | 'banners' | 'merchants' | 'all'
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
      hero: true,
      categorySlider: true,
      popularCourses: true,
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
      key: 'hero',
      num: 2,
      title: 'Hero Video & Live Search',
      subtitle: 'স্প্লিট ভিডিও থাম্বনেইল, হেডলাইন, সাবটাইটেল ও কোর্স সার্চ',
      badge: 'Core Hero',
      category: 'Hero & Courses'
    },
    {
      key: 'categorySlider',
      num: 3,
      title: 'Category Slider Chips',
      subtitle: 'জনপ্রিয় কোর্স ক্যাটাগরি স্লাইডার চিপস (ডিজাইন, ওয়েব, মার্কেটিং)',
      badge: 'Interactive',
      category: 'Hero & Courses'
    },
    {
      key: 'popularCourses',
      num: 4,
      title: 'Popular Courses Grid (3x3)',
      subtitle: 'সকল কোর্স, অনলাইন, অফলাইন ও প্রি-রেকর্ডেড ফিল্টার সহ গ্রিড',
      badge: 'Courses',
      category: 'Hero & Courses'
    },
    {
      key: 'exploreCategories',
      num: 5,
      title: 'Explore Categories (4 Formats)',
      subtitle: 'অফলাইন ল্যাব, অনলাইন লাইভ, সেলফ-পেসড ও কর্পোরেট ট্রেনিং কার্ডস',
      badge: 'Delivery',
      category: 'Hero & Courses'
    },
    {
      key: 'aboutHero',
      num: 6,
      title: 'About Hero & 6 Stat Counters',
      subtitle: '১২ বছরের অভিজ্ঞতা, ২০,০০০+ শিক্ষার্থী ও ৬টি লাইভ কাউন্টার',
      badge: 'Impact',
      category: 'Branding & Stories'
    },
    {
      key: 'onlineCourses',
      num: 7,
      title: 'Online Interactive Courses',
      subtitle: 'অনলাইন লাইভ ব্যাচ ও ল্যাব ভিত্তিক স্পেশাল কোর্স সেকশন',
      badge: 'Courses',
      category: 'Hero & Courses'
    },
    {
      key: 'successStories',
      num: 8,
      title: 'Real Student Success Stories',
      subtitle: 'সফল ফ্রিল্যান্সার ও গ্র্যাজুয়েটদের রিয়েল ইনকাম ও ভিডিও কার্ডস',
      badge: 'Proof',
      category: 'Branding & Stories'
    },
    {
      key: 'studentReviews',
      num: 9,
      title: 'Student Reviews & Ratings',
      subtitle: 'শিক্ষার্থীদের রেটিং ও অভিজ্ঞতার রিভিউ ক্যারোসেল',
      badge: 'Reviews',
      category: 'Trust & Community'
    },
    {
      key: 'whyChoose',
      num: 10,
      title: 'Why Choose NexGen Academy? (9 Cards)',
      subtitle: '১ শিক্ষার্থী ১টি কম্পিউটার, লাইফটাইম সাপোর্ট সহ ৯টি পিলার',
      badge: 'Value',
      category: 'Trust & Community'
    },
    {
      key: 'newsletterCta',
      num: 11,
      title: 'Career Counseling & Newsletter CTA',
      subtitle: 'ফ্রি মাস্টারক্লাস ও ক্যারিয়ার কাউন্সেলিং জয়েনিং ব্যানার',
      badge: 'Leads',
      category: 'Trust & Community'
    },
    {
      key: 'photoStrip',
      num: 12,
      title: 'Campus Life Photo Strip',
      subtitle: 'আধুনিক এসি কম্পিউটার ল্যাব ও ক্লাসরুমের বাস্তব ছবি গ্যালারি',
      badge: 'Campus',
      category: 'Trust & Community'
    },
    {
      key: 'faqs',
      num: 13,
      title: 'Frequently Asked Questions (FAQ)',
      subtitle: 'সাধারণ প্রশ্নোত্তর ও অ্যাকর্ডিয়ন সেকশন',
      badge: 'FAQ',
      category: 'Trust & Community'
    },
    {
      key: 'exclusiveSolutions',
      num: 14,
      title: 'Exclusive Solutions That Set Us Apart',
      subtitle: 'কমিউনিটি সাপোর্ট, রিয়েল প্রজেক্ট ও লাইফটাইম সাপোর্ট ৪টি পিলার',
      badge: 'Solutions',
      category: 'Banners & Footer'
    },
    {
      key: 'snakeCta',
      num: 15,
      title: 'Snake CTA Banner (So Why Delay?)',
      subtitle: 'The best time to start is today - ওভাল এনরোলমেন্ট ব্যানার',
      badge: 'Action CTA',
      category: 'Banners & Footer'
    },
    {
      key: 'admissionBanner',
      num: 16,
      title: 'Admission Is Going On (40% Scholarship)',
      subtitle: 'স্পেশাল ৪০% স্কলারশিপ ব্যানার ও সেমিনার রেজিস্ট্রেশন বাটন',
      badge: 'Offer Strip',
      category: 'Banners & Footer'
    },
    {
      key: 'footer',
      num: 17,
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

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleEnableAllSections}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>সব সেকশন চালু করুন</span>
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

      {/* 6. PAYMENT MERCHANTS STRIP IN FOOTER */}
      <div id="sec-merchants" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider">
                Footer Strip #17
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2 mt-1">
              <CreditCard className="w-5 h-5 text-teal-600" />
              <span>Payment Merchants Strip in Footer (ফুটার মার্চেন্ট ও পেমেন্ট নম্বর)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ওয়েবসাইটের একদম নিচে প্রদর্শিত বিকাশ, নগদ, রকেট মার্চেন্ট নম্বর ও কার্ড পেমেন্ট নোট এডিট করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={onSaveAll}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>মার্চেন্ট সেভ করুন</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* bKash */}
          <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 space-y-1.5">
            <span className="text-pink-600 font-black text-sm block">bKash Merchant</span>
            <input
              type="text"
              value={paymentMerchants.bkashNumber || ''}
              onChange={e => onChangePaymentMerchants({ ...paymentMerchants, bkashNumber: e.target.value })}
              placeholder="01795077536"
              className="w-full p-2 bg-white border border-pink-300 rounded-xl text-xs font-mono font-bold text-slate-900"
            />
          </div>

          {/* Nagad */}
          <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 space-y-1.5">
            <span className="text-orange-600 font-black text-sm block">নগদ মার্চেন্ট</span>
            <input
              type="text"
              value={paymentMerchants.nagadNumber || ''}
              onChange={e => onChangePaymentMerchants({ ...paymentMerchants, nagadNumber: e.target.value })}
              placeholder="01795077536"
              className="w-full p-2 bg-white border border-orange-300 rounded-xl text-xs font-mono font-bold text-slate-900"
            />
          </div>

          {/* Rocket */}
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5">
            <span className="text-purple-700 font-black text-sm block">Rocket Merchant</span>
            <input
              type="text"
              value={paymentMerchants.rocketNumber || ''}
              onChange={e => onChangePaymentMerchants({ ...paymentMerchants, rocketNumber: e.target.value })}
              placeholder="01795077536"
              className="w-full p-2 bg-white border border-purple-300 rounded-xl text-xs font-mono font-bold text-slate-900"
            />
          </div>

          {/* SSLCommerz */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5">
            <span className="text-blue-700 font-black text-sm block">SSLCommerz / Cards</span>
            <input
              type="text"
              value={paymentMerchants.sslcommerzNote || ''}
              onChange={e => onChangePaymentMerchants({ ...paymentMerchants, sslcommerzNote: e.target.value })}
              placeholder="Cards & Net Banking"
              className="w-full p-2 bg-white border border-blue-300 rounded-xl text-xs font-bold text-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
