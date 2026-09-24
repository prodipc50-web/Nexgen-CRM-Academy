import React, { useState, useRef, useEffect } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import {
  TopOfferRibbonConfig,
  LeadCapturePopupConfig,
  HiringPartnersSectionConfig,
  HiringPartnerItem,
  FloatingActionWidgetConfig,
  SocialProofTickerConfig,
  CampusTourConfig,
  SyllabusDownloadConfig
} from '../../../types';
import {
  Sparkles,
  Gift,
  Building2,
  MessageCircle,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Check,
  CheckCircle2,
  Eye,
  Sliders,
  Phone,
  ArrowRight,
  ExternalLink,
  Radio,
  FileText,
  Calendar,
  Clock,
  Download,
  Compass,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { compressLogoOrAvatar } from '../../../utils/imageCompressor';

interface CmsOffersPopupsTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsOffersPopupsTab: React.FC<CmsOffersPopupsTabProps> = ({ onSuccessToast }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig, academySettings } = useAcademy();
  const hasUserEditedRef = useRef(false);

  const [activeSubTab, setActiveSubTab] = useState<
    'ribbon' | 'popup' | 'partners' | 'floating' | 'social_proof' | 'campus_tour' | 'syllabus_magnet'
  >('ribbon');

  // 1. Top Offer Ribbon State
  const [ribbonConfig, setRibbonConfig] = useState<TopOfferRibbonConfig>(
    websiteCmsConfig.topOfferRibbon || {
      enabled: true,
      badgeText: '🎉 স্পেশাল অফার',
      message: 'পবিত্র ঈদ উপলক্ষে সকল আইটি কোর্সে ৩০% পর্যন্ত স্কলারশিপ ছাড়! সীমিত আসন বাকি।',
      couponCode: 'EID2026',
      buttonText: 'ভর্তি আবেদন করুন',
      actionType: 'open_admission',
      bgColor: 'bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700',
      expiresAt: '2026-10-31',
      dismissible: true
    }
  );

  // 2. Lead Capture Popup State
  const [popupConfig, setPopupConfig] = useState<LeadCapturePopupConfig>(
    websiteCmsConfig.leadCapturePopup || {
      enabled: true,
      title: '🎓 ফ্রি ক্যারিয়ার কাউন্সেলিং ও স্কলারশিপ ভাউচার!',
      subtitle: 'আপনার নাম ও মোবাইল নম্বর দিন, আমাদের অভিজ্ঞ সিনিয়র মেন্টর সরাসরি আপনার সাথে যোগাযোগ করে সর্বোচ্চ স্কলারশিপ কোটা নিশ্চিত করবেন।',
      badgeText: '🔥 সীমিত আসন • Batch 2026',
      discountText: '৳১,৫০০ পর্যন্ত নিশ্চিত স্কলারশিপ ভাউচার',
      submitButtonText: 'আমার স্কলারশিপ ভাউচার বুক করুন',
      successMessage: 'অভিনন্দন! আপনার তথ্য সফলভাবে গৃহীত হয়েছে। আমাদের হেড অব কাউন্সেলিং খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।',
      triggerType: 'delay',
      delaySeconds: 8,
      scrollPercentage: 35,
      showCourseSelect: true,
      showEmailField: false
    }
  );

  // 3. Hiring Partners State
  const [partnersConfig, setPartnersConfig] = useState<HiringPartnersSectionConfig>(
    websiteCmsConfig.hiringPartnersConfig || {
      enabled: true,
      sectionTag: 'TOP RECRUITERS & CORPORATE AFFILIATIONS',
      heading: 'যেসব শীর্ষ প্রতিষ্ঠানে আমাদের শিক্ষার্থীরা কর্মরত',
      subtitle: 'আমাদের দক্ষ গ্র্যাজুয়েটরা দেশ-বিদেশের খ্যাতিমান আইটি কোম্পানি, সফটওয়্যার ফার্ম এবং গ্লোবাল ফ্রিল্যান্স মার্কেটপ্লেসে সুনামের সাথে কাজ করছেন।',
      partners: []
    }
  );

  // 4. Floating Action State
  const [floatingConfig, setFloatingConfig] = useState<FloatingActionWidgetConfig>(
    websiteCmsConfig.floatingActionWidget || {
      enabled: true,
      whatsappNumber: academySettings.primarySupportPhone || '01798444444',
      whatsappMessage: 'হ্যালো! Nexgen Computer Academy এর কোর্স ও ভর্তি সংক্রান্ত তথ্য জানতে চাচ্ছি।',
      callNumber: academySettings.primarySupportPhone || '01798444444',
      showCallButton: true,
      showAdmissionButton: true,
      showScrollToTop: true,
      position: 'bottom_right'
    }
  );

  // 5. Social Proof Activity Ticker State
  const [socialProofConfig, setSocialProofConfig] = useState<SocialProofTickerConfig>(
    websiteCmsConfig.socialProofConfig || {
      enabled: true,
      displayIntervalSeconds: 8,
      position: 'bottom-left',
      items: [
        { id: 'sp-1', studentName: 'তন্ময় আহমেদ', location: 'মিরপুর ১০, ঢাকা', courseName: 'Full Stack Web Development', actionType: 'enrolled', timeAgo: '২ মিনিট আগে' },
        { id: 'sp-2', studentName: 'সুমাইয়া রহমান', location: 'উত্তরা, ঢাকা', courseName: 'UI/UX Design Mastery', actionType: 'inquired', timeAgo: '৫ মিনিট আগে' },
        { id: 'sp-3', studentName: 'রাকিব হাসান', location: 'চট্টগ্রাম', courseName: 'Python & AI Engineering', actionType: 'enrolled', timeAgo: '১২ মিনিট আগে' },
        { id: 'sp-4', studentName: 'মেহজাবিন চৌধুরী', location: 'ধানমন্ডি, ঢাকা', courseName: 'Graphic Design & Freelancing', actionType: 'visited', timeAgo: '১৮ মিনিট আগে' }
      ]
    }
  );

  // 6. Campus Tour & Lab Visit Booking State
  const [campusTourConfig, setCampusTourConfig] = useState<CampusTourConfig>(
    websiteCmsConfig.campusTourConfig || {
      enabled: true,
      modalTitle: '🏛️ Nexgen ক্যাম্পাস ও কম্পিউটার ল্যাব ভিজিট বুকিং',
      modalSubtitle: 'সরাসরি আমাদের আধুনিক কম্পিউটার ল্যাব ও অভিজ্ঞ মেন্টরদের সাথে দেখা করে ১-অন-১ ফ্রি ক্যারিয়ার গাইডলাইন নিন।',
      availableDays: ['শনিবার', 'রবিবার', 'মঙ্গলবার', 'বৃহস্পতিবার', 'শুক্রবার'],
      timeSlots: ['সকাল ১১:০০ টা', 'দুপুর ০২:০০ টা', 'বিকাল ০৪:০০ টা', 'সন্ধ্যা ০৬:৩০ টা'],
      notificationPhone: academySettings.primarySupportPhone || '01798444444',
      badgeText: '১০০% ফ্রি • স্পট এডমিশন স্কলারশিপ'
    }
  );

  // 7. Syllabus Download Lead Magnet State
  const [syllabusConfig, setSyllabusConfig] = useState<SyllabusDownloadConfig>(
    (websiteCmsConfig.syllabusDownloadConfig as SyllabusDownloadConfig) || {
      enabled: true,
      modalTitle: '📥 অফিশিয়াল কোর্স কারিকুলাম ও সিলেবাস ডাউনলোড',
      modalSubtitle: 'আমাদের সম্পূর্ণ কারিকুলাম, ইন্ডাস্ট্রি প্রজেক্ট এবং ক্যারিয়ার রোডম্যাপের বিস্তারিত পিডিএফ সংগ্রহ করুন।',
      submitButtonText: 'পিডিএফ ডাউনলোড করুন',
      instantDownloadFallback: true
    }
  );

  // Sync with Firestore background updates when user is not actively editing
  useEffect(() => {
    if (hasUserEditedRef.current) return;
    if (websiteCmsConfig.topOfferRibbon) setRibbonConfig(websiteCmsConfig.topOfferRibbon);
    if (websiteCmsConfig.leadCapturePopup) setPopupConfig(websiteCmsConfig.leadCapturePopup);
    if (websiteCmsConfig.hiringPartnersConfig) setPartnersConfig(websiteCmsConfig.hiringPartnersConfig);
    if (websiteCmsConfig.floatingActionWidget) setFloatingConfig(websiteCmsConfig.floatingActionWidget);
    if (websiteCmsConfig.socialProofConfig) setSocialProofConfig(websiteCmsConfig.socialProofConfig);
    if (websiteCmsConfig.campusTourConfig) setCampusTourConfig(websiteCmsConfig.campusTourConfig);
    if (websiteCmsConfig.syllabusDownloadConfig) {
      setSyllabusConfig(websiteCmsConfig.syllabusDownloadConfig as SyllabusDownloadConfig);
    }
  }, [
    websiteCmsConfig.topOfferRibbon,
    websiteCmsConfig.leadCapturePopup,
    websiteCmsConfig.hiringPartnersConfig,
    websiteCmsConfig.floatingActionWidget,
    websiteCmsConfig.socialProofConfig,
    websiteCmsConfig.campusTourConfig,
    websiteCmsConfig.syllabusDownloadConfig
  ]);

  // Modal / Form state for partner editing
  const [editingPartner, setEditingPartner] = useState<HiringPartnerItem | null>(null);
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerLogo, setPartnerLogo] = useState('');
  const [partnerCategory, setPartnerCategory] = useState<HiringPartnerItem['category']>('Corporate Recruiter');
  const [partnerHiredCount, setPartnerHiredCount] = useState<number>(20);
  const [partnerWebsite, setPartnerWebsite] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const partnerFileInputRef = useRef<HTMLInputElement>(null);

  const handlePartnerLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      // Compress logo to max 400px square (~25KB)
      const compressed = await compressLogoOrAvatar(file, 400);
      setPartnerLogo(compressed);
      if (!partnerName) {
        setPartnerName(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    } catch (err) {
      console.error('Failed to compress partner logo:', err);
      alert('Could not upload logo. Please try another image.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Preset logo templates
  const PRESET_PARTNERS = [
    { name: 'Brain Station 23', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=60', category: 'Corporate Recruiter', count: 42 },
    { name: 'BJIT Limited', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60', category: 'Corporate Recruiter', count: 28 },
    { name: 'Daraz Bangladesh', logo: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=200&auto=format&fit=crop&q=60', category: 'Corporate Recruiter', count: 35 },
    { name: 'Pathao Tech', logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=60', category: 'Corporate Recruiter', count: 19 },
    { name: 'Walton Hi-Tech', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=60', category: 'Corporate Recruiter', count: 24 },
    { name: 'Brotecs Technologies', logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&auto=format&fit=crop&q=60', category: 'Tech Partner', count: 16 },
    { name: 'BTEB Approved Center', logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=60', category: 'Govt Accreditation', count: 0 }
  ];

  // Save Handlers
  const handleSaveRibbon = () => {
    hasUserEditedRef.current = false;
    updateWebsiteCmsConfig({ topOfferRibbon: ribbonConfig });
    onSuccessToast('টপ অফার রিবন সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSavePopup = () => {
    hasUserEditedRef.current = false;
    updateWebsiteCmsConfig({ leadCapturePopup: popupConfig });
    onSuccessToast('লিড ক্যাপচার অফার পপআপ সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSavePartners = (updatedPartners?: HiringPartnerItem[]) => {
    hasUserEditedRef.current = false;
    const newConfig = {
      ...partnersConfig,
      partners: updatedPartners || partnersConfig.partners
    };
    setPartnersConfig(newConfig);
    updateWebsiteCmsConfig({ hiringPartnersConfig: newConfig });
    onSuccessToast('হায়ারিং পার্টনার্স ও রিক্রুটার তালিকা সংরক্ষিত হয়েছে!');
  };

  const handleSaveFloating = () => {
    hasUserEditedRef.current = false;
    updateWebsiteCmsConfig({ floatingActionWidget: floatingConfig });
    onSuccessToast('ফ্লোটিং অ্যাকশন ও হোয়াটসঅ্যাপ সেটিংস সংরক্ষিত হয়েছে!');
  };

  const handleSaveSocialProof = () => {
    hasUserEditedRef.current = false;
    updateWebsiteCmsConfig({ socialProofConfig });
    onSuccessToast('সোশ্যাল প্রুফ লাইভ অ্যাক্টিভিটি পপআপ সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSaveCampusTour = () => {
    hasUserEditedRef.current = false;
    updateWebsiteCmsConfig({ campusTourConfig });
    onSuccessToast('ক্যাম্পাস ও ল্যাব ভিজিট বুকিং ফর্ম সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSaveSyllabus = () => {
    hasUserEditedRef.current = false;
    updateWebsiteCmsConfig({ syllabusDownloadConfig: syllabusConfig });
    onSuccessToast('সিলেবাস ডাউনলোড লিড ম্যাগনেট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSavePartnerModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !partnerLogo.trim()) return;

    if (editingPartner) {
      const updated = partnersConfig.partners.map(p =>
        p.id === editingPartner.id
          ? {
              ...p,
              name: partnerName.trim(),
              logoUrl: partnerLogo.trim(),
              category: partnerCategory,
              hiredCount: partnerHiredCount,
              websiteUrl: partnerWebsite.trim() || undefined
            }
          : p
      );
      handleSavePartners(updated);
      setEditingPartner(null);
    } else {
      const newPartner: HiringPartnerItem = {
        id: `hp-${Date.now()}`,
        name: partnerName.trim(),
        logoUrl: partnerLogo.trim(),
        category: partnerCategory,
        hiredCount: partnerHiredCount,
        websiteUrl: partnerWebsite.trim() || undefined,
        isActive: true,
        sortOrder: partnersConfig.partners.length + 1
      };
      handleSavePartners([...partnersConfig.partners, newPartner]);
      setIsAddingPartner(false);
    }

    setPartnerName('');
    setPartnerLogo('');
    setPartnerWebsite('');
  };

  const handleDeletePartner = (id: string) => {
    const updated = partnersConfig.partners.filter(p => p.id !== id);
    handleSavePartners(updated);
  };

  const handleTogglePartner = (id: string) => {
    const updated = partnersConfig.partners.map(p =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    handleSavePartners(updated);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Nav */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('ribbon')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'ribbon'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>টপ অফার রিবন (Top Ribbon)</span>
          <span className={`w-2 h-2 rounded-full ${ribbonConfig.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('popup')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'popup'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>লিড জেনারেশন পপআপ (Offer Modal)</span>
          <span className={`w-2 h-2 rounded-full ${popupConfig.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('partners')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'partners'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>হায়ারিং পার্টনার্স ও রিক্রুটার (Recruiters)</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
            {partnersConfig.partners?.length || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('floating')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'floating'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>ফ্লোটিং হোয়াটসঅ্যাপ ও কুইক কল (Floating Widget)</span>
          <span className={`w-2 h-2 rounded-full ${floatingConfig.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('social_proof')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'social_proof'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Radio className="w-4 h-4 text-rose-300" />
          <span>লাইভ সোশ্যাল প্রুফ পপআপ (Social Proof Ticker)</span>
          <span className={`w-2 h-2 rounded-full ${socialProofConfig.enabled ? 'bg-emerald-400' : 'bg-slate-400'}`} />
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('campus_tour')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'campus_tour'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Compass className="w-4 h-4 text-teal-200" />
          <span>ক্যাম্পাস ও ল্যাব ভিজিট বুকিং (Campus Tour)</span>
          <span className={`w-2 h-2 rounded-full ${campusTourConfig.enabled ? 'bg-emerald-400' : 'bg-slate-400'}`} />
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('syllabus_magnet')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'syllabus_magnet'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Download className="w-4 h-4 text-blue-200" />
          <span>সিলেবাস ডাউনলোড লিড ম্যাগনেট (Syllabus PDF)</span>
          <span className={`w-2 h-2 rounded-full ${syllabusConfig.enabled ? 'bg-emerald-400' : 'bg-slate-400'}`} />
        </button>
      </div>

      {/* 1. TOP OFFER RIBBON CONFIG */}
      {activeSubTab === 'ribbon' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>টপ স্টিকি অফার রিবন বার কনফিগারেশন</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ওয়েবসাইটের একদম শীর্ষে বিশেষ স্কলারশিপ, ঈদ অফার বা ক্যাম্পেইন টেক্সট প্রদর্শন করুন
                </p>
              </div>

              {/* Enable / Disable Toggle */}
              <label className="flex items-center space-x-3 cursor-pointer select-none bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800">
                  {ribbonConfig.enabled ? 'রিবন বার সক্রিয় (ON)' : 'রিবন বার বন্ধ (OFF)'}
                </span>
                <input
                  type="checkbox"
                  checked={ribbonConfig.enabled}
                  onChange={e => setRibbonConfig({ ...ribbonConfig, enabled: e.target.checked })}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Live Preview Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">লাইভ প্রিভিউ (Live Ribbon Preview):</label>
              <div className={`p-3 rounded-2xl text-white text-xs flex flex-wrap items-center justify-between gap-2 shadow-inner ${ribbonConfig.bgColor || 'bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700'}`}>
                <div className="flex items-center space-x-2 flex-wrap gap-1">
                  {ribbonConfig.badgeText && (
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-black text-[10px] uppercase">
                      {ribbonConfig.badgeText}
                    </span>
                  )}
                  <span className="font-semibold">{ribbonConfig.message}</span>
                  {ribbonConfig.couponCode && (
                    <span className="px-2 py-0.5 rounded bg-black/30 font-mono text-[11px] text-amber-300 font-bold border border-white/30">
                      {ribbonConfig.couponCode}
                    </span>
                  )}
                  {ribbonConfig.expiresAt && (
                    <span className="text-[10px] text-amber-200 bg-black/20 px-2 py-0.5 rounded-full">
                      ⏳ {ribbonConfig.expiresAt}
                    </span>
                  )}
                </div>
                <button type="button" className="px-3 py-1 bg-white text-slate-900 font-black text-[11px] rounded-lg shadow-sm">
                  {ribbonConfig.buttonText} →
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অফার ব্যাজ টেক্সট</label>
                <input
                  type="text"
                  value={ribbonConfig.badgeText}
                  onChange={e => setRibbonConfig({ ...ribbonConfig, badgeText: e.target.value })}
                  placeholder="যেমন: 🎉 স্পেশাল অফার"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">প্রমো / কুপন কোড (Coupon Code)</label>
                <input
                  type="text"
                  value={ribbonConfig.couponCode || ''}
                  onChange={e => setRibbonConfig({ ...ribbonConfig, couponCode: e.target.value })}
                  placeholder="যেমন: EID2026 বা NEXGEN30"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-700 outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">অফারের মূল বার্তা (Offer Message)</label>
                <input
                  type="text"
                  value={ribbonConfig.message}
                  onChange={e => setRibbonConfig({ ...ribbonConfig, message: e.target.value })}
                  placeholder="পবিত্র ঈদ উপলক্ষে সকল আইটি কোর্সে ৩০% পর্যন্ত স্কলারশিপ ছাড়! সীমিত আসন বাকি।"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বাটন টেক্সট (Button Text)</label>
                <input
                  type="text"
                  value={ribbonConfig.buttonText}
                  onChange={e => setRibbonConfig({ ...ribbonConfig, buttonText: e.target.value })}
                  placeholder="যেমন: ভর্তি আবেদন করুন বা অফারটি নিন"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বাটন অ্যাকশন (Click Action)</label>
                <select
                  value={ribbonConfig.actionType}
                  onChange={e => setRibbonConfig({ ...ribbonConfig, actionType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                >
                  <option value="open_admission">ভর্তি আবেদন ফর্ম ওপেন করুন (Admission Modal)</option>
                  <option value="scroll_courses">কোর্স সেকশনে স্ক্রোল করুন (#courses)</option>
                  <option value="copy_coupon">কুপন কোড কপি করুন (Copy Coupon)</option>
                  <option value="whatsapp">সরাসরি হোয়াটসঅ্যাপে চ্যাট শুরু করুন (WhatsApp Chat)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">মেয়াদ শেষ বা কাউন্টডাউন টেক্সট (Expires At)</label>
                <input
                  type="text"
                  value={ribbonConfig.expiresAt || ''}
                  onChange={e => setRibbonConfig({ ...ribbonConfig, expiresAt: e.target.value })}
                  placeholder="যেমন: আর মাত্র ৩ দিন বাকি বা 2026-10-31"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট থিম</label>
                <select
                  value={ribbonConfig.bgColor || 'bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700'}
                  onChange={e => setRibbonConfig({ ...ribbonConfig, bgColor: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                >
                  <option value="bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700">অ্যাম্বার-রোজ-ইন্ডিগো (Festive Offer)</option>
                  <option value="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700">পান্না-টিয়াল (Tech Green)</option>
                  <option value="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700">রয়্যাল পার্পল (Royal AI)</option>
                  <option value="bg-gradient-to-r from-rose-600 via-pink-600 to-red-700">হট রেড (Urgent Flash Sale)</option>
                  <option value="bg-slate-900">ডিপ স্লেট (Minimal Dark)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveRibbon}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>টপ অফার রিবন সেভ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. LEAD CAPTURE POPUP CONFIG */}
      {activeSubTab === 'popup' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-purple-600" />
                  <span>লিড ক্যাপচার অফার পপআপ (Modal Settings)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ভিজিটর ওয়েবসাইটে প্রবেশ করলে স্বয়ংক্রিয়ভাবে আকর্ষণীয় স্কলারশিপ পপআপ আসবে এবং তথ্য জমা দিলে সাথে সাথে CRM-এ যোগ হবে
                </p>
              </div>

              <label className="flex items-center space-x-3 cursor-pointer select-none bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800">
                  {popupConfig.enabled ? 'পপআপ সক্রিয় (ON)' : 'পপআপ বন্ধ (OFF)'}
                </span>
                <input
                  type="checkbox"
                  checked={popupConfig.enabled}
                  onChange={e => setPopupConfig({ ...popupConfig, enabled: e.target.checked })}
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">পপআপ শিরোনাম (Title)</label>
                <input
                  type="text"
                  value={popupConfig.title}
                  onChange={e => setPopupConfig({ ...popupConfig, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">সাবটাইটেল / বর্ণনা (Subtitle)</label>
                <textarea
                  rows={2}
                  value={popupConfig.subtitle}
                  onChange={e => setPopupConfig({ ...popupConfig, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ব্যাজ টেক্সট (Top Badge)</label>
                <input
                  type="text"
                  value={popupConfig.badgeText || ''}
                  onChange={e => setPopupConfig({ ...popupConfig, badgeText: e.target.value })}
                  placeholder="যেমন: 🔥 সীমিত আসন • Batch 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ইনস্ট্যান্ট ভাউচার অফার টেক্সট</label>
                <input
                  type="text"
                  value={popupConfig.discountText || ''}
                  onChange={e => setPopupConfig({ ...popupConfig, discountText: e.target.value })}
                  placeholder="যেমন: ৳১,৫০০ পর্যন্ত নিশ্চিত স্কলারশিপ"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-purple-700 outline-none focus:bg-white focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ট্রিগার মেথড (Trigger Mode)</label>
                <select
                  value={popupConfig.triggerType}
                  onChange={e => setPopupConfig({ ...popupConfig, triggerType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-purple-600"
                >
                  <option value="delay">নির্দিষ্ট সেকেন্ড পর ওপেন হবে (Time Delay)</option>
                  <option value="scroll">পেজ কিছুটা স্ক্রোল করলে ওপেন হবে (Scroll %)</option>
                  <option value="exit_intent">পেজ ছেড়ে যেতে নিলে ওপেন হবে (Exit Intent)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">দেরি (Delay in Seconds)</label>
                <input
                  type="number"
                  min={3}
                  max={60}
                  value={popupConfig.delaySeconds}
                  onChange={e => setPopupConfig({ ...popupConfig, delaySeconds: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সাবমিট বাটন টেক্সট</label>
                <input
                  type="text"
                  value={popupConfig.submitButtonText}
                  onChange={e => setPopupConfig({ ...popupConfig, submitButtonText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-purple-600"
                />
              </div>

              <div className="flex items-center space-x-6 pt-5">
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={popupConfig.showCourseSelect}
                    onChange={e => setPopupConfig({ ...popupConfig, showCourseSelect: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <span>কোর্স বাছাই অপশন দেখান</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={popupConfig.showEmailField}
                    onChange={e => setPopupConfig({ ...popupConfig, showEmailField: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <span>ইমেইল ফিল্ড দেখান</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSavePopup}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>পপআপ সেটিংস সেভ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. HIRING PARTNERS CONFIG */}
      {activeSubTab === 'partners' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <span>হায়ারিং পার্টনার্স ও রিক্রুটিং কোম্পানি লোগো ম্যানেজার</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  যেসব প্রতিষ্ঠানে শিক্ষার্থীরা চাকরি পেয়েছে বা ইন্টার্ন করছে তাদের লোগো এবং সরকারি অনুমোদন ব্যাজ পরিচালনা করুন
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer select-none bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs font-bold">
                  <span>সেকশন সক্রিয়:</span>
                  <input
                    type="checkbox"
                    checked={partnersConfig.enabled}
                    onChange={e => {
                      const updated = { ...partnersConfig, enabled: e.target.checked };
                      setPartnersConfig(updated);
                      updateWebsiteCmsConfig({ hiringPartnersConfig: updated });
                    }}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setEditingPartner(null);
                    setPartnerName('');
                    setPartnerLogo('');
                    setPartnerWebsite('');
                    setPartnerCategory('Corporate Recruiter');
                    setPartnerHiredCount(20);
                    setIsAddingPartner(true);
                  }}
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন পার্টনার যুক্ত করুন</span>
                </button>
              </div>
            </div>

            {/* Section Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সেকশন হেডিং (Heading)</label>
                <input
                  type="text"
                  value={partnersConfig.heading}
                  onChange={e => setPartnersConfig({ ...partnersConfig, heading: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সেকশন সাবটাইটেল (Subtitle)</label>
                <input
                  type="text"
                  value={partnersConfig.subtitle}
                  onChange={e => setPartnersConfig({ ...partnersConfig, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Quick 1-Click Presets */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-600">১-ক্লিক জনপ্রিয় কোম্পানি প্রিসেট (Quick Add Presets):</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_PARTNERS.map(preset => {
                  const alreadyExists = partnersConfig.partners.some(p => p.name === preset.name);
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      disabled={alreadyExists}
                      onClick={() => {
                        const newP: HiringPartnerItem = {
                          id: `hp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                          name: preset.name,
                          logoUrl: preset.logo,
                          category: preset.category as any,
                          hiredCount: preset.count,
                          isActive: true,
                          sortOrder: partnersConfig.partners.length + 1
                        };
                        handleSavePartners([...partnersConfig.partners, newP]);
                      }}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-all ${
                        alreadyExists
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 cursor-pointer active:scale-95'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>{preset.name}</span>
                      {alreadyExists && <Check className="w-3 h-3 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Partners Table / Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700">বর্তমান পার্টনার তালিকা ({partnersConfig.partners.length}টি):</h4>
              {partnersConfig.partners.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                  কোনো পার্টনার লোগো নেই। উপরে "নতুন পার্টনার যুক্ত করুন" অথবা প্রিসেটে ক্লিক করুন।
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partnersConfig.partners.map(partner => (
                    <div
                      key={partner.id}
                      className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-12 bg-white rounded-xl p-1.5 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={partner.logoUrl}
                            alt={partner.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 truncate">{partner.name}</h5>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 inline-block mt-0.5">
                            {partner.category}
                          </span>
                          {partner.hiredCount ? (
                            <p className="text-[10px] text-slate-500 mt-0.5">{partner.hiredCount}+ Hired</p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        {/* Toggle Active */}
                        <button
                          type="button"
                          onClick={() => handleTogglePartner(partner.id)}
                          className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                            partner.isActive !== false ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-200'
                          }`}
                          title={partner.isActive !== false ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPartner(partner);
                            setPartnerName(partner.name);
                            setPartnerLogo(partner.logoUrl);
                            setPartnerCategory(partner.category);
                            setPartnerHiredCount(partner.hiredCount || 0);
                            setPartnerWebsite(partner.websiteUrl || '');
                            setIsAddingPartner(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="এডিট করুন"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeletePartner(partner.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => handleSavePartners()}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>পার্টনার্স সেটিংস সেভ করুন</span>
              </button>
            </div>
          </div>

          {/* Add / Edit Partner Modal */}
          {isAddingPartner && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-indigo-100 space-y-4 animate-in zoom-in-95 duration-150">
                <h4 className="text-base font-black text-slate-900">
                  {editingPartner ? 'পার্টনার তথ্য পরিবর্তন করুন' : 'নতুন রিক্রুটিং পার্টনার যুক্ত করুন'}
                </h4>

                <form onSubmit={handleSavePartnerModal} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">কোম্পানির নাম *</label>
                    <input
                      type="text"
                      required
                      value={partnerName}
                      onChange={e => setPartnerName(e.target.value)}
                      placeholder="যেমন: Brain Station 23 বা Daraz"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      কোম্পানি লোগো (লোগো ছবি) *
                    </label>

                    {/* Logo Preview */}
                    {partnerLogo && (
                      <div className="flex items-center space-x-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                          <img src={partnerLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-slate-700 truncate">
                            {partnerLogo.startsWith('data:image') ? 'Uploaded Local Logo (Optimized)' : partnerLogo}
                          </p>
                          <span className="text-[10px] text-emerald-600 font-bold">লোগো প্রস্তুত</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPartnerLogo('')}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* File upload input & button */}
                    <input
                      ref={partnerFileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      onChange={handlePartnerLogoUpload}
                      className="hidden"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isUploadingLogo}
                        onClick={() => partnerFileInputRef.current?.click()}
                        className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition"
                      >
                        <Upload className="w-3.5 h-3.5 text-indigo-300" />
                        <span>{isUploadingLogo ? 'প্রসেসিং হচ্ছে...' : 'পিসি থেকে লোগো আপলোড করুন'}</span>
                      </button>
                    </div>

                    {!partnerLogo.startsWith('data:image') && (
                      <input
                        type="text"
                        value={partnerLogo}
                        onChange={e => setPartnerLogo(e.target.value)}
                        placeholder="অথবা লোগো URL দিন: https://..."
                        className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                    <select
                      value={partnerCategory}
                      onChange={e => setPartnerCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                    >
                      <option value="Corporate Recruiter">Corporate Recruiter (কর্পোরেট রিক্রুটার)</option>
                      <option value="Tech Partner">Tech Partner (প্রযুক্তি সহযোগী)</option>
                      <option value="Govt Accreditation">Govt Accreditation (সরকারি স্বীকৃতি)</option>
                      <option value="Industry Affiliate">Industry Affiliate (ইন্ডাস্ট্রি পার্টনার)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">নিয়োগপ্রাপ্ত শিক্ষার্থী সংখ্যা (Hired Count)</label>
                    <input
                      type="number"
                      min={0}
                      value={partnerHiredCount}
                      onChange={e => setPartnerHiredCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingPartner(false);
                        setEditingPartner(null);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                    >
                      {editingPartner ? 'আপডেট করুন' : 'যোগ করুন'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. FLOATING ACTION WIDGET CONFIG */}
      {activeSubTab === 'floating' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <span>ফ্লোটিং হোয়াটসঅ্যাপ ও কুইক অ্যাকশন কন্ট্রোলার</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ওয়েবসাইটের কোণে থাকা ভাসমান হোয়াটসঅ্যাপ ও জরুরি হটলাইন কল বাটনের নম্বর ও প্রি-ফিল্ড মেসেজ পরিচালনা করুন
                </p>
              </div>

              <label className="flex items-center space-x-3 cursor-pointer select-none bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800">
                  {floatingConfig.enabled ? 'ভাসমান বাটন সক্রিয় (ON)' : 'ভাসমান বাটন বন্ধ (OFF)'}
                </span>
                <input
                  type="checkbox"
                  checked={floatingConfig.enabled}
                  onChange={e => setFloatingConfig({ ...floatingConfig, enabled: e.target.checked })}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">হোয়াটসঅ্যাপ ফোন নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={floatingConfig.whatsappNumber}
                  onChange={e => setFloatingConfig({ ...floatingConfig, whatsappNumber: e.target.value })}
                  placeholder="01798444444"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-800 outline-none focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সরাসরি কল হটলাইন নম্বর</label>
                <input
                  type="tel"
                  value={floatingConfig.callNumber || ''}
                  onChange={e => setFloatingConfig({ ...floatingConfig, callNumber: e.target.value })}
                  placeholder="01798444444"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">হোয়াটসঅ্যাপ প্রি-ফিল্ড স্বাগতম মেসেজ</label>
                <textarea
                  rows={2}
                  value={floatingConfig.whatsappMessage}
                  onChange={e => setFloatingConfig({ ...floatingConfig, whatsappMessage: e.target.value })}
                  placeholder="হ্যালো! Nexgen Computer Academy এর কোর্স ও ভর্তি সংক্রান্ত তথ্য জানতে চাচ্ছি।"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পজিশন (Position on Screen)</label>
                <select
                  value={floatingConfig.position}
                  onChange={e => setFloatingConfig({ ...floatingConfig, position: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-600"
                >
                  <option value="bottom_right">নিচে ডানপাশে (Bottom Right) - Standard</option>
                  <option value="bottom_left">নিচে বামপাশে (Bottom Left)</option>
                </select>
              </div>

              <div className="flex flex-col justify-center space-y-2 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={floatingConfig.showCallButton}
                    onChange={e => setFloatingConfig({ ...floatingConfig, showCallButton: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span>সরাসরি ফোন কল হটলাইন বাটন দেখান</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={floatingConfig.showAdmissionButton}
                    onChange={e => setFloatingConfig({ ...floatingConfig, showAdmissionButton: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span>অনলাইন ভর্তি আবেদন বাটন দেখান</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={floatingConfig.showScrollToTop}
                    onChange={e => setFloatingConfig({ ...floatingConfig, showScrollToTop: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span>স্ক্রোল টু টপ (Scroll to Top) বাটন দেখান</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveFloating}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ভাসমান বাটন সেটিংস সেভ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SOCIAL PROOF ACTIVITY TICKER CONFIG */}
      {activeSubTab === 'social_proof' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Radio className="w-5 h-5 text-rose-600" />
                  <span>লাইভ সোশ্যাল প্রুফ পপআপ (Social Proof Activity Ticker)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ওয়েবসাইটে ভিজিটরদের সাম্প্রতিক ভর্তি, ফ্রি সেমিনার ও কাউন্সেলিং আবেদনের নোটিফিকেশন প্রদর্শন করে কনভার্সন ও বিশ্বাসযোগ্যতা বৃদ্ধি করুন।
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`text-xs font-bold ${socialProofConfig.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {socialProofConfig.enabled ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Disabled)'}
                </span>
                <button
                  type="button"
                  onClick={() => setSocialProofConfig({ ...socialProofConfig, enabled: !socialProofConfig.enabled })}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    socialProofConfig.enabled ? 'bg-rose-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      socialProofConfig.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">ডিসপ্লে সময় বিরতি (Display Interval in Seconds)</label>
                <input
                  type="number"
                  min={4}
                  max={60}
                  value={socialProofConfig.displayIntervalSeconds || 8}
                  onChange={e => setSocialProofConfig({ ...socialProofConfig, displayIntervalSeconds: Number(e.target.value) || 8 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-400">প্রতি কত সেকেন্ড পর পর নতুন অ্যাক্টিভিটি পপআপ ভেসে উঠবে (ডিফল্ট: ৮ সেকেন্ড)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">পপআপ পজিশন (Screen Position)</label>
                <select
                  value={socialProofConfig.position || 'bottom-left'}
                  onChange={e => setSocialProofConfig({ ...socialProofConfig, position: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                >
                  <option value="bottom-left">নিচে বাম পাশে (Bottom Left - Recommended)</option>
                  <option value="bottom-right">নিচে ডান পাশে (Bottom Right)</option>
                </select>
              </div>
            </div>

            {/* Notification items preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">রোটেশনাল অ্যাক্টিভিটি আইটেমস ({socialProofConfig.items.length})</h4>
                <button
                  type="button"
                  onClick={() => {
                    const newItem = {
                      id: `sp-${Date.now()}`,
                      studentName: 'নতুন শিক্ষার্থী',
                      location: 'ঢাকা',
                      courseName: 'Full Stack Web Development',
                      actionType: 'enrolled' as const,
                      timeAgo: '১ মিনিট আগে'
                    };
                    setSocialProofConfig({
                      ...socialProofConfig,
                      items: [newItem, ...socialProofConfig.items]
                    });
                  }}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন অ্যাক্টিভিটি যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-2">
                {socialProofConfig.items.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 w-full">
                      <input
                        type="text"
                        placeholder="নাম"
                        value={item.studentName}
                        onChange={e => {
                          const updated = [...socialProofConfig.items];
                          updated[idx] = { ...updated[idx], studentName: e.target.value };
                          setSocialProofConfig({ ...socialProofConfig, items: updated });
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="লোকেশন"
                        value={item.location}
                        onChange={e => {
                          const updated = [...socialProofConfig.items];
                          updated[idx] = { ...updated[idx], location: e.target.value };
                          setSocialProofConfig({ ...socialProofConfig, items: updated });
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="কোর্স নাম"
                        value={item.courseName}
                        onChange={e => {
                          const updated = [...socialProofConfig.items];
                          updated[idx] = { ...updated[idx], courseName: e.target.value };
                          setSocialProofConfig({ ...socialProofConfig, items: updated });
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <select
                        value={item.actionType}
                        onChange={e => {
                          const updated = [...socialProofConfig.items];
                          updated[idx] = { ...updated[idx], actionType: e.target.value as any };
                          setSocialProofConfig({ ...socialProofConfig, items: updated });
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="enrolled">ভর্তি হয়েছেন (Enrolled)</option>
                        <option value="inquired">পরামর্শ চেয়েছেন (Inquired)</option>
                        <option value="downloaded_syllabus">সিলেবাস ডাউনলোড করেছেন</option>
                        <option value="visited">ল্যাব ভিজিট বুক করেছেন</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = socialProofConfig.items.filter((_, i) => i !== idx);
                        setSocialProofConfig({ ...socialProofConfig, items: updated });
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0 cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSocialProof}
                className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>সোশ্যাল প্রুফ সেটিংস সেভ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CAMPUS TOUR & PHYSICAL LAB VISIT BOOKING CONFIG */}
      {activeSubTab === 'campus_tour' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-teal-600" />
                  <span>ক্যাম্পাস ও আধুনিক কম্পিউটার ল্যাব ভিজিট বুকিং ফর্ম</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  হেডারে ও ওয়েবসাইটে "ক্যাম্পাস ভিজিট" বাটনে ক্লিক করলে শিক্ষার্থীদের সরাসরি ১-অন-১ ভিজিট বুক করার সুযোগ দেয়।
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`text-xs font-bold ${campusTourConfig.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {campusTourConfig.enabled ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Disabled)'}
                </span>
                <button
                  type="button"
                  onClick={() => setCampusTourConfig({ ...campusTourConfig, enabled: !campusTourConfig.enabled })}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    campusTourConfig.enabled ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      campusTourConfig.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">বুকিং মডাল শিরোনাম (Modal Title)</label>
                  <input
                    type="text"
                    value={campusTourConfig.modalTitle}
                    onChange={e => setCampusTourConfig({ ...campusTourConfig, modalTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">উপশিরোনাম ব্যাজ (Badge Text)</label>
                  <input
                    type="text"
                    value={campusTourConfig.badgeText || ''}
                    onChange={e => setCampusTourConfig({ ...campusTourConfig, badgeText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">বর্ণনা / সাবটাইটেল (Description Subtitle)</label>
                <textarea
                  rows={2}
                  value={campusTourConfig.modalSubtitle}
                  onChange={e => setCampusTourConfig({ ...campusTourConfig, modalSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">ভিজিটের সম্ভাব্য দিনসমূহ (কমা দিয়ে লিখুন)</label>
                  <input
                    type="text"
                    value={Array.isArray(campusTourConfig.availableDays) ? campusTourConfig.availableDays.join(', ') : (campusTourConfig.availableDays || '')}
                    onChange={e => setCampusTourConfig({
                      ...campusTourConfig,
                      availableDays: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    placeholder="শনিবার, রবিবার, মঙ্গলবার, বৃহস্পতিবার, শুক্রবার"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">উপলব্ধ টাইম স্লটসমূহ (কমা দিয়ে লিখুন)</label>
                  <input
                    type="text"
                    value={(campusTourConfig.timeSlots || []).join(', ')}
                    onChange={e => setCampusTourConfig({
                      ...campusTourConfig,
                      timeSlots: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    placeholder="সকাল ১১:০০ টা, দুপুর ০২:০০ টা, বিকাল ০৪:০০ টা"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveCampusTour}
                className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-teal-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ক্যাম্পাস ট্যুর সেটিংস সেভ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. SYLLABUS DOWNLOAD LEAD MAGNET CONFIG */}
      {activeSubTab === 'syllabus_magnet' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  <span>সিলেবাস ডাউনলোড লিড ম্যাগনেট (Course Syllabus Lead Magnet)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  শিক্ষার্থীরা কোর্সের সিলেবাস ও মডিউল পিডিএফ ডাউনলোড করার সময় তাদের তথ্য CRM-এ অটোমেটিক জমা হবে।
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`text-xs font-bold ${syllabusConfig.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {syllabusConfig.enabled ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Disabled)'}
                </span>
                <button
                  type="button"
                  onClick={() => setSyllabusConfig({ ...syllabusConfig, enabled: !syllabusConfig.enabled })}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    syllabusConfig.enabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      syllabusConfig.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">মডাল শিরোনাম (Modal Title)</label>
                  <input
                    type="text"
                    value={syllabusConfig.modalTitle}
                    onChange={e => setSyllabusConfig({ ...syllabusConfig, modalTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">ডাউনলোড বাটন টেক্সট (Submit Button Text)</label>
                  <input
                    type="text"
                    value={syllabusConfig.submitButtonText}
                    onChange={e => setSyllabusConfig({ ...syllabusConfig, submitButtonText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">উপশিরোনাম / প্ররোচনা টেক্সট (Modal Subtitle)</label>
                <textarea
                  rows={2}
                  value={syllabusConfig.modalSubtitle}
                  onChange={e => setSyllabusConfig({ ...syllabusConfig, modalSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
                <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-bold text-blue-900">
                  <input
                    type="checkbox"
                    checked={syllabusConfig.instantDownloadFallback ?? true}
                    onChange={e => setSyllabusConfig({ ...syllabusConfig, instantDownloadFallback: e.target.checked })}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span>লিড জমা দেওয়ার সাথে সাথে অটোমেটিক ডিজিটাল ব্রোশিওর ডাউনলোড ও ওপেন করা</span>
                </label>
                <p className="text-[11px] text-blue-700 mt-1 pl-6">
                  যদি কোর্সের কোনো নির্দিষ্ট পিডিএফ লিংক দেওয়া না থাকে, তবে শিক্ষার্থীদের জন্য অটোমেটিক প্রফেশনাল ডিজিটাল কোর্স আউটলাইন জেনারেট হয়ে ডাউনলোড শুরু হবে।
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSyllabus}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>সিলেবাস লিড ম্যাগনেট সেটিংস সেভ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
