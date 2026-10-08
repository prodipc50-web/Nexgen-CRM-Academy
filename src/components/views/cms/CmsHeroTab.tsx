import React, { useState, useEffect, useRef } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { HeroBannerSlide } from '../../../types';
import { optimizeLogoImage } from '../../../utils/logoImageOptimizer';
import {
  Save,
  Sparkles,
  Bell,
  Sliders,
  Crop,
  Image as ImageIcon,
  CheckCircle2,
  Play,
  Upload,
  Video,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  RefreshCw,
  BookOpen,
  Laptop,
  Check,
  X,
  Search,
  FileVideo,
  Trash2,
  AlertCircle,
  Smartphone,
  Monitor
} from 'lucide-react';
import { LogoCropResizeModal } from '../../common/LogoCropResizeModal';
import { ImageUploadCropModal } from '../../common/ImageUploadCropModal';
import { NexgenLogo } from '../../common/NexgenLogo';
import { HeroBannerEditor } from '../../cms/HeroBannerEditor';
import { isDirectVideo, formatMediaEmbedUrl } from '../../../utils/seoHelper';
import { saveVideoBlob, getVideoBlobUrl, deleteVideoBlob, getVideoMeta } from '../../../utils/videoStorage';

interface CmsHeroTabProps {
  onSuccessToast: (msg: string) => void;
}

function formatYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  // Match watch?v=ID or youtu.be/ID or youtube.com/shorts/ID
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return trimmed;
}

export const CmsHeroTab: React.FC<CmsHeroTabProps> = ({ onSuccessToast }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig, academySettings, updateAcademySettings } = useAcademy();
  const hasUserEditedRef = useRef(false);

  // Top Header Brand Bar States
  const [headerBrandName, setHeaderBrandName] = useState(academySettings.instituteName || 'NexGen Computer Academy');
  const [brandPrimary, setBrandPrimary] = useState(websiteCmsConfig.brandPrimary || 'NexGen');
  const [brandAccent, setBrandAccent] = useState(websiteCmsConfig.brandAccent || 'Computer Academy');
  const [brandSubline, setBrandSubline] = useState(websiteCmsConfig.brandSubline || websiteCmsConfig.headerSubtitle || 'Computer Training Institute');
  const [headerSubtitle, setHeaderSubtitle] = useState(
    websiteCmsConfig.headerSubtitle || `${academySettings.campusName || 'Farmgate Campus'} • Govt. Standard IT Training & Career Incubator`
  );
  const [headerEstText, setHeaderEstText] = useState(websiteCmsConfig.headerEstText || 'EST. 2018');
  const [brandSavedFeedback, setBrandSavedFeedback] = useState(false);
  const [customLogoUrl, setCustomLogoUrl] = useState(
    websiteCmsConfig.customLogoUrl || websiteCmsConfig.headerLogoUrl || academySettings.customLogoUrl || ''
  );
  const [logoSizeMobile, setLogoSizeMobile] = useState<number>(websiteCmsConfig.logoSizeMobile || 38);
  const [logoSizeDesktop, setLogoSizeDesktop] = useState<number>(websiteCmsConfig.logoSizeDesktop || 46);
  const [footerLogoSizeMobile, setFooterLogoSizeMobile] = useState<number>(websiteCmsConfig.footerLogoSizeMobile || 34);
  const [footerLogoSizeDesktop, setFooterLogoSizeDesktop] = useState<number>(websiteCmsConfig.footerLogoSizeDesktop || 40);
  const [logoShape, setLogoShape] = useState<'contain' | 'square' | 'wide'>(websiteCmsConfig.logoShape || 'contain');
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [isLogoCropModalOpen, setIsLogoCropModalOpen] = useState(false);
  const [isThumbnailCropModalOpen, setIsThumbnailCropModalOpen] = useState(false);
  const [isVideoTestModalOpen, setIsVideoTestModalOpen] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [showLegacySliderStudio, setShowLegacySliderStudio] = useState(false);

  // Video Upload & Direct Media States
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [videoSourceType, setVideoSourceType] = useState<'youtube' | 'upload'>(
    isDirectVideo(websiteCmsConfig.heroVideoUrl || '') || websiteCmsConfig.heroVideoUrl?.startsWith('indexeddb:') ? 'upload' : 'youtube'
  );
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [videoFileMeta, setVideoFileMeta] = useState<{ name: string; sizeMb: string } | null>(null);
  const [localVideoPreviewUrl, setLocalVideoPreviewUrl] = useState<string | null>(null);

  // Resolve stored video blob on mount
  useEffect(() => {
    let active = true;
    const url = websiteCmsConfig.heroVideoUrl || '';
    if (url.startsWith('indexeddb:')) {
      getVideoBlobUrl(url).then(blobUrl => {
        if (active && blobUrl) {
          setLocalVideoPreviewUrl(blobUrl);
          getVideoMeta(url).then(meta => {
            if (active && meta) {
              setVideoFileMeta({ name: meta.name, sizeMb: meta.sizeMb.toFixed(1) });
              setVideoSourceType('upload');
            }
          });
        }
      });
    }
    return () => {
      active = false;
    };
  }, [websiteCmsConfig.heroVideoUrl]);

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoUploadError(null);

    if (!file.type.startsWith('video/')) {
      setVideoUploadError('অনুগ্রহ করে একটি বৈধ ভিডিও ফাইল নির্বাচন করুন (MP4, WebM, Ogg, QuickTime)');
      return;
    }

    const sizeInMb = file.size / (1024 * 1024);
    if (sizeInMb > 50) {
      setVideoUploadError(`ভিডিও ফাইলটির সাইজ (${sizeInMb.toFixed(1)}MB) অনেক বড়। মসৃণ ও দ্রুত পারফরম্যান্সের জন্য ৫০ মেগাবাইটের কম সাইজের ভিডিও আপলোড করুন, অথবা বড় ভিডিওর ক্ষেত্রে YouTube লিংক ব্যবহার করুন।`);
      return;
    }

    setIsProcessingVideo(true);
    try {
      // Revoke previous object url to prevent memory leaks
      if (localVideoPreviewUrl) {
        URL.revokeObjectURL(localVideoPreviewUrl);
      }
      
      const previewUrl = URL.createObjectURL(file);
      hasUserEditedRef.current = true;
      setLocalVideoPreviewUrl(previewUrl);

      // 1. First save to IndexedDB as local instant buffer
      const indexedDbKey = await saveVideoBlob('hero-video', file, file.name);

      // 2. Upload to server disk (/api/upload-media) so video streams smoothly on mobile and cross-device
      let serverVideoUrl = indexedDbKey;
      try {
        const reader = new FileReader();
        const readPromise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read video file'));
        });
        reader.readAsDataURL(file);
        const dataUrl = await readPromise;

        const uploadRes = await fetch('/api/upload-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, dataUrl })
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson.success && uploadJson.url) {
          serverVideoUrl = uploadJson.url;
        }
      } catch (uploadErr) {
        console.warn('Server media upload fallback notice:', uploadErr);
      }

      setFormData(prev => ({
        ...prev,
        heroVideoUrl: serverVideoUrl
      }));
      setVideoFileMeta({
        name: file.name,
        sizeMb: sizeInMb.toFixed(1)
      });
      setVideoSourceType('upload');
      setIsProcessingVideo(false);
      onSuccessToast(`ভিডিও সফলভাবে আপলোড ও সংরক্ষিত হয়েছে: ${file.name} (${sizeInMb.toFixed(1)} MB)। মোবাইল ও পিসি সব জায়গায় মসৃণভাবে চলবে!`);
    } catch (err: any) {
      setIsProcessingVideo(false);
      setVideoUploadError('ভিডিও ফাইলটি সেভ করতে সমস্যা হয়েছে: ' + (err?.message || 'Error'));
    }
  };

  const handleRemoveUploadedVideo = async () => {
    hasUserEditedRef.current = true;
    await deleteVideoBlob('hero-video');
    if (localVideoPreviewUrl) {
      URL.revokeObjectURL(localVideoPreviewUrl);
      setLocalVideoPreviewUrl(null);
    }
    const defaultUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    setFormData(prev => ({
      ...prev,
      heroVideoUrl: defaultUrl
    }));
    setVideoFileMeta(null);
    setVideoSourceType('youtube');
    if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    onSuccessToast('ভিডিও রিসেট হয়ে ডিফল্ট ইউটিউব ভিডিওতে ফিরিয়ে নেওয়া হয়েছে।');
  };

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
    const resolvedFullName = `${brandPrimary.trim()} ${brandAccent.trim()}`.trim();
    if (resolvedFullName) {
      updateAcademySettings({
        instituteName: resolvedFullName,
        customLogoUrl: customLogoUrl.trim()
      });
      setHeaderBrandName(resolvedFullName);
    } else {
      updateAcademySettings({
        customLogoUrl: customLogoUrl.trim()
      });
    }

    if (customLogoUrl.trim()) {
      localStorage.setItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO', customLogoUrl.trim());
    } else {
      localStorage.removeItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO');
    }
    window.dispatchEvent(new Event('nexgen-logo-updated'));

    updateWebsiteCmsConfig({
      brandPrimary: brandPrimary.trim(),
      brandAccent: brandAccent.trim(),
      brandSubline: brandSubline.trim(),
      headerSubtitle: brandSubline.trim() || headerSubtitle.trim(),
      headerEstText: headerEstText.trim(),
      customLogoUrl: customLogoUrl.trim(),
      headerLogoUrl: customLogoUrl.trim(),
      footerLogoUrl: customLogoUrl.trim(),
      logoSizeMobile: Number(logoSizeMobile) || 38,
      logoSizeDesktop: Number(logoSizeDesktop) || 46,
      footerLogoSizeMobile: Number(footerLogoSizeMobile) || 34,
      footerLogoSizeDesktop: Number(footerLogoSizeDesktop) || 40,
      logoShape: logoShape
    });

    try {
      fetch('/api/cms/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandPrimary: brandPrimary.trim(),
          brandAccent: brandAccent.trim(),
          brandSubline: brandSubline.trim(),
          headerSubtitle: brandSubline.trim() || headerSubtitle.trim(),
          headerEstText: headerEstText.trim(),
          customLogoUrl: customLogoUrl.trim(),
          headerLogoUrl: customLogoUrl.trim(),
          footerLogoUrl: customLogoUrl.trim(),
          logoSizeMobile: Number(logoSizeMobile) || 38,
          logoSizeDesktop: Number(logoSizeDesktop) || 46,
          footerLogoSizeMobile: Number(footerLogoSizeMobile) || 34,
          footerLogoSizeDesktop: Number(footerLogoSizeDesktop) || 40,
          logoShape: logoShape
        })
      }).catch(() => {});
    } catch {}

    setBrandSavedFeedback(true);
    setTimeout(() => setBrandSavedFeedback(false), 3000);
    onSuccessToast('লোগো, সাইজ ও ব্র্যান্ডিং সফলভাবে সংরক্ষিত ও লাইভ হয়েছে!');
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('লোগো ইমেজ ফাইলের সাইজ ৫MB এর বেশি হওয়া যাবে না।');
      return;
    }
    const result = await optimizeLogoImage(file, file.name);
    if (!result) return;
    setCustomLogoUrl(result);
    localStorage.setItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO', result);
    window.dispatchEvent(new Event('nexgen-logo-updated'));
    updateAcademySettings({ customLogoUrl: result });
    updateWebsiteCmsConfig({
      customLogoUrl: result,
      headerLogoUrl: result,
      footerLogoUrl: result
    });
    try {
      fetch('/api/cms/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customLogoUrl: result,
          headerLogoUrl: result,
          footerLogoUrl: result
        })
      }).catch(() => {});
    } catch {}
    onSuccessToast('কাস্টম লোগো তাৎক্ষণিকভাবে আপলোড ও লাইভ যুক্ত হয়েছে!');
  };

  const handleResetLogoToEmblem = () => {
    if (confirm('অফিসিয়াল ডিফল্ট NexGen শিল্ড এমব্লেমে রিসেট করতে চান?')) {
      setCustomLogoUrl('');
      localStorage.removeItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO');
      window.dispatchEvent(new Event('nexgen-logo-updated'));
      updateAcademySettings({ customLogoUrl: '' });
      updateWebsiteCmsConfig({
        customLogoUrl: '',
        headerLogoUrl: '',
        footerLogoUrl: ''
      });
      try {
        fetch('/api/cms/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customLogoUrl: '/brand-logo.png',
            headerLogoUrl: '/brand-logo.png',
            footerLogoUrl: '/brand-logo.png'
          })
        }).catch(() => {});
      } catch {}
      onSuccessToast('অফিসিয়াল NexGen শিল্ড এমব্লেম রিস্টোর হয়েছে!');
    }
  };

  const [formData, setFormData] = useState({
    heroHeadline: websiteCmsConfig.heroHeadline || 'Learn IT Skills Today. Lead the Digital World Tomorrow.',
    heroSubtitle:
      websiteCmsConfig.heroSubtitle ||
      "Thousands of people in Bangladesh are stuck - not because they lack talent, but because they never got the right training. At NexGen Computer Academy, we teach you exactly what today's job market needs. Real tools. Real projects. Real mentors. And real results that follow you for life.",
    heroBadgeText: websiteCmsConfig.heroBadgeText || 'Your Future Starts Here',
    heroPrimaryCtaText: websiteCmsConfig.heroPrimaryCtaText || 'Online Course',
    heroSecondaryCtaText: websiteCmsConfig.heroSecondaryCtaText || 'Offline Course',
    heroCtaText: websiteCmsConfig.heroCtaText || 'Admission Now',
    heroVideoUrl: websiteCmsConfig.heroVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    heroVideoBadgeText: websiteCmsConfig.heroVideoBadgeText || 'NexGen Academy Campus',
    heroVideoThumbnailUrl:
      websiteCmsConfig.heroVideoThumbnailUrl ||
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80',
    heroVideoCaption:
      websiteCmsConfig.heroVideoCaption || 'সরাসরি ফার্মগেট ক্যাম্পাসে প্র্যাকটিক্যাল ল্যাব ও অনলাইন ক্লাস',
    topNoticeTicker: websiteCmsConfig.topNoticeTicker || '⚡ নতুন ব্যাচে ভর্তি চলছে! স্পেশাল ৪০% স্কলারশিপ সুবিধা ও ফ্রি ডেমো ক্লাস।'
  });

  const [slides, setSlides] = useState<HeroBannerSlide[]>(
    websiteCmsConfig.heroSlides && websiteCmsConfig.heroSlides.length > 0
      ? websiteCmsConfig.heroSlides
      : [
          {
            id: 'slide-1',
            title: websiteCmsConfig.heroHeadline || 'Learn IT Skills Today. Lead the Digital World Tomorrow.',
            subtitle: websiteCmsConfig.heroSubtitle || 'Master in-demand IT skills from top industry practitioners.',
            badgeText: websiteCmsConfig.heroBadgeText || 'Your Future Starts Here',
            ctaText: websiteCmsConfig.heroCtaText || 'Admission Now',
            ctaLink: '#courses',
            secondaryCtaText: 'Free Career Counseling',
            secondaryCtaLink: '#seminars',
            imageUrl:
              websiteCmsConfig.heroVideoThumbnailUrl ||
              'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1280&q=80',
            isActive: true
          }
        ]
  );

  // Sync state when websiteCmsConfig updates
  useEffect(() => {
    if (hasUserEditedRef.current) return;

    setFormData({
      heroHeadline: websiteCmsConfig.heroHeadline || 'Learn IT Skills Today. Lead the Digital World Tomorrow.',
      heroSubtitle:
        websiteCmsConfig.heroSubtitle ||
        "Thousands of people in Bangladesh are stuck - not because they lack talent, but because they never got the right training. At NexGen Computer Academy, we teach you exactly what today's job market needs. Real tools. Real projects. Real mentors. And real results that follow you for life.",
      heroBadgeText: websiteCmsConfig.heroBadgeText || 'Your Future Starts Here',
      heroPrimaryCtaText: websiteCmsConfig.heroPrimaryCtaText || 'Online Course',
      heroSecondaryCtaText: websiteCmsConfig.heroSecondaryCtaText || 'Offline Course',
      heroCtaText: websiteCmsConfig.heroCtaText || 'Admission Now',
      heroVideoUrl: websiteCmsConfig.heroVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      heroVideoBadgeText: websiteCmsConfig.heroVideoBadgeText || 'NexGen Academy Campus',
      heroVideoThumbnailUrl:
        websiteCmsConfig.heroVideoThumbnailUrl ||
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80',
      heroVideoCaption:
        websiteCmsConfig.heroVideoCaption || 'সরাসরি ফার্মগেট ক্যাম্পাসে প্র্যাকটিক্যাল ল্যাব ও অনলাইন ক্লাস',
      topNoticeTicker: websiteCmsConfig.topNoticeTicker || '⚡ নতুন ব্যাচে ভর্তি চলছে! স্পেশাল ৪০% স্কলারশিপ সুবিধা ও ফ্রি ডেমো ক্লাস।'
    });

    if (websiteCmsConfig.heroSlides && websiteCmsConfig.heroSlides.length > 0) {
      setSlides(websiteCmsConfig.heroSlides);
    }
  }, [websiteCmsConfig]);

  // Unified Save Function
  const handleSaveAllHero = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    hasUserEditedRef.current = false;

    const formattedVideoUrl = isDirectVideo(formData.heroVideoUrl)
      ? formData.heroVideoUrl
      : formatMediaEmbedUrl(formData.heroVideoUrl, false);

    const syncedSlides =
      slides.length > 0
        ? [
            {
              ...slides[0],
              title: formData.heroHeadline || slides[0].title,
              subtitle: formData.heroSubtitle || slides[0].subtitle,
              badgeText: formData.heroBadgeText || slides[0].badgeText,
              ctaText: formData.heroCtaText || slides[0].ctaText
            },
            ...slides.slice(1)
          ]
        : slides;

    const resolvedFullName = `${brandPrimary.trim()} ${brandAccent.trim()}`.trim();
    if (resolvedFullName) {
      updateAcademySettings({ instituteName: resolvedFullName });
      setHeaderBrandName(resolvedFullName);
    }

    updateWebsiteCmsConfig({
      brandPrimary: brandPrimary.trim(),
      brandAccent: brandAccent.trim(),
      brandSubline: brandSubline.trim(),
      headerSubtitle: brandSubline.trim() || headerSubtitle.trim(),
      headerEstText: headerEstText.trim(),
      customLogoUrl: customLogoUrl.trim(),
      headerLogoUrl: customLogoUrl.trim(),
      footerLogoUrl: customLogoUrl.trim(),
      logoSizeMobile: Number(logoSizeMobile) || 38,
      logoSizeDesktop: Number(logoSizeDesktop) || 46,
      footerLogoSizeMobile: Number(footerLogoSizeMobile) || 34,
      footerLogoSizeDesktop: Number(footerLogoSizeDesktop) || 40,
      logoShape: logoShape,
      heroHeadline: formData.heroHeadline,
      heroSubtitle: formData.heroSubtitle,
      heroBadgeText: formData.heroBadgeText,
      heroPrimaryCtaText: formData.heroPrimaryCtaText,
      heroSecondaryCtaText: formData.heroSecondaryCtaText,
      heroCtaText: formData.heroCtaText,
      heroVideoUrl: formattedVideoUrl,
      heroVideoBadgeText: formData.heroVideoBadgeText,
      heroVideoThumbnailUrl: formData.heroVideoThumbnailUrl,
      heroVideoCaption: formData.heroVideoCaption,
      topNoticeTicker: formData.topNoticeTicker,
      heroSlides: syncedSlides
    });

    setFormData(prev => ({ ...prev, heroVideoUrl: formattedVideoUrl }));
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
    onSuccessToast('হোমপেজ হিরো সেকশন, ভিডিও ও থাম্বনেইল সেটিংস সফলভাবে সংরক্ষিত ও লাইভ হয়েছে!');
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
              <span>Homepage Hero & Video Studio (হিরো ও ভিডিও স্টুডিও)</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] uppercase font-bold">
                Live Auto-Sync
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              নতুন স্প্লিট হিরো ডিজাইন, ইউটিউব ভিডিও লিংক, থাম্বনেইল আপলোড, হেডলাইন ও অ্যাকশন বাটন কন্ট্রোল করুন।
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
            <span>{saveFeedback ? 'সব সংরক্ষিত হয়েছে (Saved!)' : 'Save Hero Settings (হিরো সংরক্ষণ করুন)'}</span>
          </button>
        </div>
      </div>

      {/* 1. PREMIER: NEW DESIGN SPLIT HERO & VIDEO STUDIO (নতুন ডিজাইনের মূল হিরো কনফিগ) */}
      <div className="bg-white p-6 rounded-3xl border-2 border-indigo-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">
                Active Homepage Design • Modern Split Hero
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ✓ লাইভ হোমপেজে সক্রিয়
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-xl flex items-center space-x-2 mt-1.5">
              <Video className="w-6 h-6 text-purple-600" />
              <span>Modern Split Hero & Video Studio (হিরো কনটেন্ট ও ভিডিও এডিটর)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              বামের টেক্সট, হেডলাইন, ৩টি অ্যাকশন বাটন এবং ডানের ইউটিউব ভিডিও ও থাম্বনেইল পোস্টার ইমেজ সরাসরি এডিট করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSaveAllHero()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>সেভ করুন</span>
          </button>
        </div>

        {/* Two-Column Editor Layout: Form Left (7 Cols), Live Preview Right (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-5">
            {/* Top Badge Pill */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-slate-800 flex items-center justify-between">
                <span>১. হিরো টপ ব্যাজ পিল (Hero Top Badge Pill)</span>
                <span className="text-[10px] text-purple-600 font-bold">হেডলাইনের ঠিক উপরে প্রদর্শিত</span>
              </label>
              <input
                type="text"
                value={formData.heroBadgeText}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setFormData({ ...formData, heroBadgeText: e.target.value });
                }}
                placeholder="e.g. Your Future Starts Here"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-purple-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* Main Headline */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-slate-800 flex items-center justify-between">
                <span>২. মূল হেডলাইন (Primary Headline)</span>
                <span className="text-[10px] text-slate-500">হোমপেজের প্রধান শিরোনাম</span>
              </label>
              <textarea
                rows={2}
                value={formData.heroHeadline}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setFormData({ ...formData, heroHeadline: e.target.value });
                }}
                placeholder="Learn IT Skills Today. Lead the Digital World Tomorrow."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none leading-relaxed"
              />
              <p className="text-[10px] text-slate-400">
                💡 টিপস: আপনি আপনার পছন্দমতো স্লোগান বা শিরোনাম লিখতে পারেন।
              </p>
            </div>

            {/* Subtitle / Value Proposition */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-slate-800 flex items-center justify-between">
                <span>৩. সাবটাইটেল ও পরিচিতি বিবরণ (Hero Subtitle)</span>
                <span className="text-[10px] text-slate-500">হেডলাইনের নিচের অনুচ্ছেদ</span>
              </label>
              <textarea
                rows={4}
                value={formData.heroSubtitle}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setFormData({ ...formData, heroSubtitle: e.target.value });
                }}
                placeholder="Thousands of people in Bangladesh are stuck - not because they lack talent..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs text-slate-700 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* 3 Action Buttons */}
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/80 space-y-3">
              <label className="font-bold text-xs text-purple-950 block">
                ৪. হিরো অ্যাকশন বাটনসমূহ (Action Buttons Labels):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Button 1 */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-rose-600 block">১ম বাটন (লাল/গোলাপি)</span>
                  <input
                    type="text"
                    value={formData.heroPrimaryCtaText}
                    onChange={e => {
                      hasUserEditedRef.current = true;
                      setFormData({ ...formData, heroPrimaryCtaText: e.target.value });
                    }}
                    placeholder="Online Course"
                    className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl font-bold text-xs text-rose-700"
                  />
                </div>

                {/* Button 2 */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-700 block">২য় বাটন (সাদা/আউটলাইন)</span>
                  <input
                    type="text"
                    value={formData.heroSecondaryCtaText}
                    onChange={e => {
                      hasUserEditedRef.current = true;
                      setFormData({ ...formData, heroSecondaryCtaText: e.target.value });
                    }}
                    placeholder="Offline Course"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-800"
                  />
                </div>

                {/* Button 3 */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-orange-600 block">৩য় বাটন (কমলা গ্র্যাডিয়েন্ট)</span>
                  <input
                    type="text"
                    value={formData.heroCtaText}
                    onChange={e => {
                      hasUserEditedRef.current = true;
                      setFormData({ ...formData, heroCtaText: e.target.value });
                    }}
                    placeholder="Admission Now"
                    className="w-full px-3 py-2 bg-white border border-orange-300 rounded-xl font-bold text-xs text-orange-700"
                  />
                </div>
              </div>
            </div>

            {/* Video Controls Card */}
            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                <span className="font-black text-xs text-slate-900 flex items-center space-x-1.5">
                  <Video className="w-4 h-4 text-rose-600" />
                  <span>৫. হিরো ভিডিও ও মিডিয়া স্টুডিও (Video Upload & Media)</span>
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsVideoTestModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Play className="w-3 h-3 fill-rose-600" />
                    <span>ভিডিও টেস্ট প্লে</span>
                  </button>
                </div>
              </div>

              {/* Video Source Switcher: YouTube Link vs Direct Upload */}
              <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => setVideoSourceType('youtube')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    videoSourceType === 'youtube'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>YouTube ভিডিও লিংক</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVideoSourceType('upload')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    videoSourceType === 'upload'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileVideo className="w-3.5 h-3.5" />
                  <span>সরাসরি ভিডিও ফাইল আপলোড (MP4 / WebM)</span>
                </button>
              </div>

              {/* YouTube Video URL Input */}
              {videoSourceType === 'youtube' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-xs text-slate-800 flex items-center space-x-1">
                      <span>YouTube Video URL (ইউটিউব ভিডিও লিংক)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        hasUserEditedRef.current = true;
                        setFormData({ ...formData, heroVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' });
                        onSuccessToast('ডিফল্ট ক্যাম্পাস ইউটিউব ভিডিও রিসেট হয়েছে');
                      }}
                      className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      রিসেট ডিফল্ট ভিডিও
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.heroVideoUrl.startsWith('data:video') ? '' : formData.heroVideoUrl}
                    onChange={e => {
                      hasUserEditedRef.current = true;
                      setFormData({ ...formData, heroVideoUrl: e.target.value });
                    }}
                    onBlur={() => {
                      const formatted = formatMediaEmbedUrl(formData.heroVideoUrl, false);
                      if (formatted !== formData.heroVideoUrl) {
                        setFormData(prev => ({ ...prev, heroVideoUrl: formatted }));
                      }
                    }}
                    placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ বা embed লিংক"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    💡 যে কোনো সাধারণ ইউটিউব ভিডিও লিংক (watch?v= বা youtu.be/) পেস্ট করলেই সিস্টেম নিজে থেকেই এটিকে সঠিক প্লেয়ার ফরম্যাটে কনভার্ট করে নেবে।
                  </p>
                </div>
              ) : (
                /* Direct Video File Upload Box */
                <div className="space-y-3">
                  <input
                    type="file"
                    ref={videoFileInputRef}
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                  />

                  {formData.heroVideoUrl.startsWith('data:video') || isDirectVideo(formData.heroVideoUrl) || formData.heroVideoUrl.startsWith('indexeddb:') ? (
                    <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                            <FileVideo className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-indigo-950 block">
                              {videoFileMeta?.name || 'আপলোডকৃত লোকাল ভিডিও (.mp4)'}
                            </span>
                            <span className="text-[10px] text-indigo-700 font-medium">
                              {videoFileMeta?.sizeMb ? `সাইজ: ${videoFileMeta.sizeMb} MB • ` : ''}সরাসরি প্লেয়ারে সক্রিয়
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            className="px-2.5 py-1.5 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            পরিবর্তন
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveUploadedVideo}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                            title="রিমুভ করুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Small inline player */}
                      <div className="rounded-xl overflow-hidden border border-indigo-200 bg-black aspect-video max-h-44 flex items-center justify-center">
                        {localVideoPreviewUrl ? (
                          <video
                            src={localVideoPreviewUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-center p-4 text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                            <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                            <span>ভিডিও লোড হচ্ছে...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => videoFileInputRef.current?.click()}
                      className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 p-6 rounded-2xl text-center cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-800 block">
                          কম্পিউটার থেকে ভিডিও ফাইল আপলোড করুন
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          ক্লিক করে MP4 বা WebM ফাইল সিলেক্ট করুন (সর্বোচ্চ ৬০ মেগাবাইট)
                        </p>
                      </div>
                      <span className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-2xs">
                        {isProcessingVideo ? 'ভিডিও আপলোড হচ্ছে...' : 'ভিডিও ফাইল ব্রাউজ করুন'}
                      </span>
                    </div>
                  )}

                  {videoUploadError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{videoUploadError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Video Thumbnail / Poster Image URL with Upload Button */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-slate-800">
                    Video Thumbnail / Poster Image (ভিডিও পোস্টার ছবি)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsThumbnailCropModalOpen(true)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3 h-3" />
                    <span>ছবি আপলোড ও ক্রপ করুন</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.heroVideoThumbnailUrl}
                    onChange={e => {
                      hasUserEditedRef.current = true;
                      setFormData({ ...formData, heroVideoThumbnailUrl: e.target.value });
                    }}
                    placeholder="https://images.unsplash.com/... বা আপলোড বাটনে ক্লিক করুন"
                    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Watermark & Caption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-xs text-slate-800 block">
                    Watermark Tag (ভিডিওর ওপর ছোট ব্যাজ)
                  </label>
                  <input
                    type="text"
                    value={formData.heroVideoBadgeText}
                    onChange={e => {
                      hasUserEditedRef.current = true;
                      setFormData({ ...formData, heroVideoBadgeText: e.target.value });
                    }}
                    placeholder="NexGen Academy Campus"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-xs text-slate-800 block">
                    Video Caption Pill (ভিডিওর নিচের ক্যাপশন)
                  </label>
                  <input
                    type="text"
                    value={formData.heroVideoCaption}
                    onChange={e => {
                      hasUserEditedRef.current = true;
                      setFormData({ ...formData, heroVideoCaption: e.target.value });
                    }}
                    placeholder="সরাসরি ফার্মগেট ক্যাম্পাসে প্র্যাকটিক্যাল ল্যাব ও অনলাইন ক্লাস"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Preview */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-indigo-50/40 p-4 sm:p-5 rounded-2xl border border-indigo-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60">
              <span className="font-black text-xs text-indigo-950 flex items-center space-x-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Live Hero Layout Preview (লাইভ প্রিভিউ)</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                ওয়েবসাইটে যেমন দেখাবে
              </span>
            </div>

            {/* Miniature Video Card Preview */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-slate-900 group">
              <img
                src={formData.heroVideoThumbnailUrl}
                alt="Hero Thumbnail Preview"
                className="w-full aspect-[16/10] object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

              {/* Watermark */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black text-slate-900 flex items-center space-x-1 shadow-sm">
                <span className="text-[#1e1b4b]">{formData.heroVideoBadgeText || 'NexGen Academy Campus'}</span>
              </div>

              {/* Play Button */}
              <button
                type="button"
                onClick={() => setIsVideoTestModalOpen(true)}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/95 text-rose-600 shadow-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                title="Test Video Player"
              >
                <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </button>

              {/* Bottom Caption Pill */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[10px] flex items-center justify-between border border-white/10">
                <span className="font-bold truncate max-w-[200px]">
                  {formData.heroVideoCaption || 'সরাসরি ফার্মগেট ক্যাম্পাসে প্র্যাকটিক্যাল ল্যাব ও অনলাইন ক্লাস'}
                </span>
                <span className="text-[9px] text-amber-300 font-black uppercase tracking-wider shrink-0 ml-1">
                  Watch Video
                </span>
              </div>
            </div>

            {/* Left Content Card Summary */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-2.5 shadow-2xs">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-black border border-purple-200">
                ✓ {formData.heroBadgeText}
              </div>
              <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-2">
                {formData.heroHeadline}
              </h4>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                {formData.heroSubtitle}
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="px-2.5 py-1 bg-rose-600 text-white rounded-full text-[9px] font-bold">
                  {formData.heroPrimaryCtaText}
                </span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-[9px] font-bold border border-slate-200">
                  {formData.heroSecondaryCtaText}
                </span>
                <span className="px-2.5 py-1 bg-orange-500 text-white rounded-full text-[9px] font-bold">
                  {formData.heroCtaText}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSaveAllHero()}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Hero Settings (হিরো সংরক্ষণ করুন)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. WEBSITE HEADER BRANDING, LOGO & CAMPUS TAGLINE EDITOR */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Hidden File Input for Direct Logo Upload */}
        <input
          type="file"
          ref={logoFileInputRef}
          onChange={handleLogoFileUpload}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center space-x-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-black shrink-0">
                🏷️
              </span>
              <span>Header & Footer Branding, Logo & Manual Sizing (লোগো ও ব্র্যান্ডিং কন্ট্রোল)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              ওয়েবসাইটের হেডার ও ফুটারে প্রতিষ্ঠানের নাম, লোগো ইমেজ আপলোড, এবং মোবাইল ও ডেস্কটপে লোগোর সাইজ ম্যানুয়ালি নিখুঁতভাবে নির্ধারণ করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveHeaderBrand}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-2 transition-all shrink-0 self-start sm:self-auto cursor-pointer"
          >
            {brandSavedFeedback ? <CheckCircle2 className="w-4 h-4 text-emerald-100" /> : <Save className="w-4 h-4" />}
            <span>{brandSavedFeedback ? 'সংরক্ষিত হয়েছে (Saved)' : 'Save Logo & Brand Settings'}</span>
          </button>
        </div>

        {/* Logo Management Box */}
        <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="h-14 px-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                <NexgenLogo
                  variant="horizontal"
                  size={32}
                  desktopSize={36}
                  customLogoUrl={customLogoUrl}
                  shape={logoShape}
                  className="shrink-0"
                />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">
                  {customLogoUrl ? 'Active Custom Uploaded Logo (কাস্টম লোগো সক্রিয়)' : 'Official NexGen Brand Logo (অফিসিয়াল নেক্সজেন ব্র্যান্ড লোগো)'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  হেডার, ফুটার, ওয়েবসাইট, আইডি কার্ড ও সার্টিফিকেটে স্বয়ংক্রিয়ভাবে লাইভ হবে।
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => logoFileInputRef.current?.click()}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Logo File (লোগো ফাইল আপলোড)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLogoCropModalOpen(true)}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Crop className="w-3.5 h-3.5 text-indigo-600" />
                <span>Manual Crop / Resize</span>
              </button>

              {customLogoUrl && (
                <button
                  type="button"
                  onClick={handleResetLogoToEmblem}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1 cursor-pointer"
                  title="Restore Official Brand Logo"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Official Logo</span>
                </button>
              )}
            </div>
          </div>

          {/* Logo URL Input & Shape Mode */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-200/80">
            <div className="md:col-span-8 space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>লোগো ইমেজ লিঙ্ক (Direct Image URL - Optional)</span>
                <span className="text-[10px] text-slate-400">অনলাইন ইমেজ লিঙ্ক পেস্ট করতে পারেন</span>
              </label>
              <input
                type="text"
                value={customLogoUrl}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setCustomLogoUrl(e.target.value);
                }}
                placeholder="https://... বা সরাসরি ফাইল আপলোড করুন"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="text-xs font-bold text-slate-700">
                লোগো ফিট ডিসপ্লে মোড (Logo Fit Mode)
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    hasUserEditedRef.current = true;
                    setLogoShape('contain');
                  }}
                  className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    logoShape === 'contain'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  স্বাভাবিক Fit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    hasUserEditedRef.current = true;
                    setLogoShape('square');
                  }}
                  className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    logoShape === 'square'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  বর্গাকার
                </button>
                <button
                  type="button"
                  onClick={() => {
                    hasUserEditedRef.current = true;
                    setLogoShape('wide');
                  }}
                  className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    logoShape === 'wide'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  ওয়াইড
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Logo Sizing Sliders (Mobile & Desktop) */}
        <div className="p-4 sm:p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-black text-indigo-950 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Manual Logo Size Settings (মোবাইল ও ডেস্কটপ সাইজ অ্যাডজাস্টমেন্ট)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Header Logo Mobile */}
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                  <span>হেডার লোগো (মোবাইল)</span>
                </span>
                <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px] font-mono">
                  {logoSizeMobile}px
                </span>
              </div>
              <input
                type="range"
                min="24"
                max="64"
                value={logoSizeMobile}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setLogoSizeMobile(Number(e.target.value));
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>ছোট (24px)</span>
                <span>ডিফল্ট: 38px</span>
                <span>বড় (64px)</span>
              </div>
            </div>

            {/* 2. Header Logo Desktop */}
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <Monitor className="w-3.5 h-3.5 text-indigo-500" />
                  <span>হেডার লোগো (ডেস্কটপ)</span>
                </span>
                <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px] font-mono">
                  {logoSizeDesktop}px
                </span>
              </div>
              <input
                type="range"
                min="28"
                max="80"
                value={logoSizeDesktop}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setLogoSizeDesktop(Number(e.target.value));
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>ছোট (28px)</span>
                <span>ডিফল্ট: 46px</span>
                <span>বড় (80px)</span>
              </div>
            </div>

            {/* 3. Footer Logo Mobile */}
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                  <span>ফুটার লোগো (মোবাইল)</span>
                </span>
                <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px] font-mono">
                  {footerLogoSizeMobile}px
                </span>
              </div>
              <input
                type="range"
                min="24"
                max="60"
                value={footerLogoSizeMobile}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setFooterLogoSizeMobile(Number(e.target.value));
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>ছোট (24px)</span>
                <span>ডিফল্ট: 34px</span>
                <span>বড় (60px)</span>
              </div>
            </div>

            {/* 4. Footer Logo Desktop */}
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <Monitor className="w-3.5 h-3.5 text-indigo-500" />
                  <span>ফুটার লোগো (ডেস্কটপ)</span>
                </span>
                <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px] font-mono">
                  {footerLogoSizeDesktop}px
                </span>
              </div>
              <input
                type="range"
                min="28"
                max="70"
                value={footerLogoSizeDesktop}
                onChange={e => {
                  hasUserEditedRef.current = true;
                  setFooterLogoSizeDesktop(Number(e.target.value));
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>ছোট (28px)</span>
                <span>ডিফল্ট: 40px</span>
                <span>বড় (70px)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Input Fields Grid for Branding Text */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Brand Primary Name */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>১. ব্র্যান্ড মূল নাম (Primary Brand Name)</span>
              <span className="text-[10px] text-slate-500">বোল্ড টেক্সট</span>
            </label>
            <input
              type="text"
              value={brandPrimary}
              onChange={e => {
                hasUserEditedRef.current = true;
                setBrandPrimary(e.target.value);
              }}
              placeholder="e.g. NexGen"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Brand Accent Name */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>২. ব্র্যান্ড হাইলাইট শব্দ (Brand Accent)</span>
              <span className="text-[10px] text-[#dc143c] font-bold">লাল রঙের হাইলাইট</span>
            </label>
            <input
              type="text"
              value={brandAccent}
              onChange={e => {
                hasUserEditedRef.current = true;
                setBrandAccent(e.target.value);
              }}
              placeholder="e.g. Computer Academy"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-rose-200 rounded-xl font-black text-[#dc143c] text-xs focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          {/* Established Badge */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>৩. প্রতিষ্ঠার সাল ব্যাজ</span>
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

          {/* Header & Footer Subline / Slogan */}
          <div className="md:col-span-12 space-y-1">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>৪. হেডার ও ফুটার সাবলাইন স্লোগান (Subline / Tagline)</span>
              <span className="text-[10px] text-indigo-600 font-bold">লোগো নামের ঠিক নিচে প্রদর্শিত হয়</span>
            </label>
            <input
              type="text"
              value={brandSubline}
              onChange={e => {
                hasUserEditedRef.current = true;
                setBrandSubline(e.target.value);
              }}
              placeholder="e.g. COMPUTER TRAINING INSTITUTE"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Live Interactive Header & Footer Preview (Mobile vs Desktop) */}
        <div className="p-4 sm:p-5 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                লাইভ প্রিভিউ (Live Header & Footer Preview)
              </span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewDeviceMode('mobile')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  previewDeviceMode === 'mobile'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>মোবাইল প্রিভিউ (Mobile 360px)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDeviceMode('desktop')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  previewDeviceMode === 'desktop'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>ডেস্কটপ প্রিভিউ (Desktop)</span>
              </button>
            </div>
          </div>

          {previewDeviceMode === 'mobile' ? (
            /* Mobile Simulation Frame */
            <div className="max-w-[360px] mx-auto bg-slate-950 rounded-2xl p-3 border border-slate-700 shadow-xl space-y-3">
              <span className="text-[10px] text-indigo-400 font-bold block text-center uppercase tracking-wider">
                মোবাইল স্ক্রিনে যেমন দেখাবে (Mobile Screen View)
              </span>

              {/* Mobile Header Bar Mock */}
              <div className="bg-white text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                <div className="flex items-center min-w-0">
                  {(brandPrimary !== 'NexGen' || brandAccent !== 'Computer Academy') && !customLogoUrl ? (
                    <div className="flex items-center space-x-2 min-w-0">
                      <NexgenLogo
                        variant="crest"
                        size={logoSizeMobile}
                        desktopSize={logoSizeMobile}
                        customLogoUrl={customLogoUrl}
                        shape={logoShape}
                        className="shrink-0"
                      />
                      <div className="flex flex-col justify-center min-w-0">
                        <div className="flex flex-col leading-tight">
                          <span className="text-[12px] font-black text-slate-900 tracking-tight leading-tight">
                            {brandPrimary || 'NexGen'}
                          </span>
                          <span className="text-[11px] font-black text-[#dc143c] tracking-tight leading-tight">
                            {brandAccent || 'Computer Academy'}
                          </span>
                        </div>
                        <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5 truncate max-w-[130px]">
                          {brandSubline || 'COMPUTER TRAINING INSTITUTE'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <NexgenLogo
                      variant="horizontal"
                      size={logoSizeMobile}
                      desktopSize={logoSizeMobile}
                      customLogoUrl={customLogoUrl}
                      shape={logoShape}
                      className="shrink-0"
                    />
                  )}
                </div>
                <div className="w-7 h-7 bg-slate-100 rounded-lg flex flex-col items-center justify-center space-y-0.5 shrink-0">
                  <div className="w-3.5 h-0.5 bg-slate-700 rounded-full" />
                  <div className="w-3.5 h-0.5 bg-slate-700 rounded-full" />
                  <div className="w-3.5 h-0.5 bg-slate-700 rounded-full" />
                </div>
              </div>

              {/* Mobile Footer Bar Mock (Clean Single Line for brandPrimary & brandAccent) */}
              <div className="bg-[#030d1c] text-white p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center">
                  {(brandPrimary !== 'NexGen' || brandAccent !== 'Computer Academy') && !customLogoUrl ? (
                    <div className="flex items-center space-x-2">
                      <NexgenLogo
                        variant="crest"
                        size={footerLogoSizeMobile}
                        desktopSize={footerLogoSizeMobile}
                        customLogoUrl={customLogoUrl}
                        shape={logoShape}
                        className="shrink-0"
                        isDarkTheme
                      />
                      <div className="flex flex-col justify-center min-w-0">
                        <div className="flex flex-row items-baseline space-x-1 leading-none whitespace-nowrap">
                          <span className="text-xs font-black text-white tracking-tight leading-none whitespace-nowrap">
                            {brandPrimary || 'NexGen'}
                          </span>
                          <span className="text-xs font-black text-[#dc143c] tracking-tight leading-none whitespace-nowrap">
                            {brandAccent || 'Computer Academy'}
                          </span>
                        </div>
                        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1 truncate max-w-[170px]">
                          {brandSubline || 'COMPUTER TRAINING INSTITUTE'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <NexgenLogo
                      variant="horizontal"
                      size={footerLogoSizeMobile}
                      desktopSize={footerLogoSizeMobile}
                      customLogoUrl={customLogoUrl}
                      shape={logoShape}
                      className="shrink-0"
                      isDarkTheme
                    />
                  )}
                </div>
                <p className="text-[9px] text-slate-500 text-center pt-1 border-t border-slate-800/80">
                  Copyright © 2026 {brandPrimary} {brandAccent}. All rights reserved
                </p>
              </div>
            </div>
          ) : (
            /* Desktop Simulation Frame */
            <div className="space-y-3">
              {/* Desktop Header Mock */}
              <div className="bg-white text-slate-900 px-5 py-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center min-w-0">
                  {(brandPrimary !== 'NexGen' || brandAccent !== 'Computer Academy') && !customLogoUrl ? (
                    <div className="flex items-center space-x-3 min-w-0">
                      <NexgenLogo
                        variant="crest"
                        size={logoSizeDesktop}
                        desktopSize={logoSizeDesktop}
                        customLogoUrl={customLogoUrl}
                        shape={logoShape}
                        className="shrink-0"
                      />
                      <div className="flex flex-col justify-center min-w-0">
                        <div className="flex flex-row items-baseline space-x-1.5 leading-none">
                          <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                            {brandPrimary || 'NexGen'}
                          </span>
                          <span className="text-lg font-black text-[#dc143c] tracking-tight leading-none">
                            {brandAccent || 'Computer Academy'}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                          {brandSubline || 'COMPUTER TRAINING INSTITUTE'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <NexgenLogo
                      variant="horizontal"
                      size={logoSizeDesktop}
                      desktopSize={logoSizeDesktop}
                      customLogoUrl={customLogoUrl}
                      shape={logoShape}
                      className="shrink-0"
                    />
                  )}
                </div>

                <div className="flex items-center space-x-4 text-xs font-bold text-slate-600">
                  <span className="text-[#e11d48]">Home</span>
                  <span>Courses</span>
                  <span>Seminars</span>
                  <span>Success Story</span>
                  <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold">ভর্তি হোন</span>
                </div>
              </div>

              {/* Desktop Footer Mock */}
              <div className="bg-[#030d1c] text-white px-5 py-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center">
                  {(brandPrimary !== 'NexGen' || brandAccent !== 'Computer Academy') && !customLogoUrl ? (
                    <div className="flex items-center space-x-3">
                      <NexgenLogo
                        variant="crest"
                        size={footerLogoSizeDesktop}
                        desktopSize={footerLogoSizeDesktop}
                        customLogoUrl={customLogoUrl}
                        shape={logoShape}
                        className="shrink-0"
                        isDarkTheme
                      />
                      <div className="flex flex-col justify-center">
                        <div className="flex flex-row items-baseline space-x-1.5 leading-none">
                          <span className="text-base font-black text-white tracking-tight leading-none">
                            {brandPrimary || 'NexGen'}
                          </span>
                          <span className="text-base font-black text-[#dc143c] tracking-tight leading-none">
                            {brandAccent || 'Computer Academy'}
                          </span>
                        </div>
                        <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                          {brandSubline || 'COMPUTER TRAINING INSTITUTE'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <NexgenLogo
                      variant="horizontal"
                      size={footerLogoSizeDesktop}
                      desktopSize={footerLogoSizeDesktop}
                      customLogoUrl={customLogoUrl}
                      shape={logoShape}
                      className="shrink-0"
                      isDarkTheme
                    />
                  )}
                </div>

                <p className="text-xs text-slate-400">
                  Copyright © 2026 {brandPrimary} {brandAccent}. All rights reserved
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSaveHeaderBrand}
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Apply Live (সেভ ও সক্রিয় করুন)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. TOP NOTICE ANNOUNCEMENT TICKER */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2">
        <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
          <Bell className="w-4 h-4 text-amber-600" />
          <span>Top Header Announcement & Notice Ticker (টপ নোটিশ অ্যানাউন্সমেন্ট)</span>
        </div>
        <input
          type="text"
          value={formData.topNoticeTicker}
          onChange={e => {
            hasUserEditedRef.current = true;
            setFormData({ ...formData, topNoticeTicker: e.target.value });
          }}
          placeholder="e.g. ⚡ Special Admission Open with 40% Scholarship..."
          className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
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

      {/* 4. LEGACY MULTI-SLIDE CAROUSEL STUDIO (ঐচ্ছিক ব্যাকআপ স্লাইডার স্টুডিও) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowLegacySliderStudio(!showLegacySliderStudio)}
          className="w-full p-5 text-left flex items-center justify-between bg-slate-50/70 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Sliders className="w-4 h-4" />
            </span>
            <div>
              <h4 className="font-black text-sm text-slate-900">
                Legacy Multi-Slide Carousel Studio (ঐচ্ছিক ব্যাকআপ স্লাইডার স্টুডিও)
              </h4>
              <p className="text-xs text-slate-500">
                যদি ভবিষ্যতে নতুন স্প্লিট হিরোর বদলে পুরোনো রোটেটিং স্লাইডার ব্যবহার করতে চান।
              </p>
            </div>
          </div>
          {showLegacySliderStudio ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {showLegacySliderStudio && (
          <div className="p-6 border-t border-slate-200 space-y-4">
            <HeroBannerEditor
              slides={slides}
              onChangeSlides={newSlides => {
                hasUserEditedRef.current = true;
                setSlides(newSlides);
                updateWebsiteCmsConfig({ heroSlides: newSlides });
              }}
              onSave={() => handleSaveAllHero()}
              onSuccessToast={onSuccessToast}
            />
          </div>
        )}
      </div>

      {/* MODAL: Logo Crop / Resize */}
      {isLogoCropModalOpen && (
        <LogoCropResizeModal
          isOpen={isLogoCropModalOpen}
          onClose={() => setIsLogoCropModalOpen(false)}
          currentLogoUrl={customLogoUrl || academySettings.customLogoUrl}
          onSaveLogo={newLogoDataUrl => {
            setCustomLogoUrl(newLogoDataUrl);
            updateAcademySettings({ customLogoUrl: newLogoDataUrl });
            updateWebsiteCmsConfig({
              customLogoUrl: newLogoDataUrl,
              headerLogoUrl: newLogoDataUrl,
              footerLogoUrl: newLogoDataUrl
            });
            onSuccessToast('লোগো সফলভাবে আপডেট ও ক্রপ করা হয়েছে!');
          }}
        />
      )}

      {/* MODAL: Video Poster / Thumbnail Upload & Crop Modal */}
      {isThumbnailCropModalOpen && (
        <ImageUploadCropModal
          isOpen={isThumbnailCropModalOpen}
          onClose={() => setIsThumbnailCropModalOpen(false)}
          currentImageUrl={formData.heroVideoThumbnailUrl}
          title="Upload & Crop Video Thumbnail / Poster"
          subtitle="হিরো ভিডিওর কভার বা পোস্টার ইমেজ আপলোড করুন ও নিখুঁত 16:9 ফ্রেম অনুযায়ী ক্রপ করুন।"
          aspectRatio="16:9"
          recommendedSize="1200 × 675px (16:9 HD)"
          presetImages={[
            {
              label: 'Modern Computer Lab & Workstations',
              category: 'Campus',
              url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80'
            },
            {
              label: 'Interactive Coding & Lab Class',
              category: 'Classroom',
              url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80'
            },
            {
              label: 'High-end Studio & Mentor Guidance',
              category: 'Mentorship',
              url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80'
            }
          ]}
          onSaveImage={croppedUrl => {
            hasUserEditedRef.current = true;
            setFormData(prev => ({ ...prev, heroVideoThumbnailUrl: croppedUrl }));
            setIsThumbnailCropModalOpen(false);
            onSuccessToast('ভিডিও থাম্বনেইল সফলভাবে আপলোড ও ক্রপ হয়েছে! সেটিংস সেভ করতে পারেন।');
          }}
        />
      )}

      {/* MODAL: Video Play Test Modal */}
      {isVideoTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl max-w-3xl w-full">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <span className="font-bold text-sm flex items-center space-x-2">
                <Video className="w-4 h-4 text-rose-500" />
                <span>Video Player Test (ইউটিউব ভিডিও প্রিভিউ)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsVideoTestModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              {formData.heroVideoUrl ? (
                isDirectVideo(formData.heroVideoUrl) || formData.heroVideoUrl.startsWith('indexeddb:') || formData.heroVideoUrl.startsWith('blob:') ? (
                  <video
                    src={localVideoPreviewUrl || formData.heroVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    title="Hero Video Test"
                    src={formatMediaEmbedUrl(formData.heroVideoUrl, true)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-sm">
                  <span>কোনো ভিডিও লিংক পাওয়া যায়নি</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-slate-950 text-slate-400 text-xs flex items-center justify-between">
              <span>{formData.heroVideoCaption}</span>
              <button
                type="button"
                onClick={() => setIsVideoTestModalOpen(false)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
