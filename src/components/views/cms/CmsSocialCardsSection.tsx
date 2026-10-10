import React, { useState } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { GlobalSeoConfig } from '../../../types';
import { getHomepageSeoMetadata, applySeoMetadata } from '../../../utils/seoHelper';
import {
  Share2,
  Sparkles,
  CheckCircle2,
  Upload,
  Globe,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Smartphone,
  Save,
  Sliders,
  Image as ImageIcon,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface CmsSocialCardsSectionProps {
  formData: GlobalSeoConfig;
  setFormData: React.Dispatch<React.SetStateAction<GlobalSeoConfig>>;
  onSuccessToast?: (msg: string) => void;
  onSave?: () => void;
}

export const CmsSocialCardsSection: React.FC<CmsSocialCardsSectionProps> = ({
  formData,
  setFormData,
  onSuccessToast,
  onSave
}) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig, academySettings, syncToCloudNow } = useAcademy();

  const [activePlatformPreview, setActivePlatformPreview] = useState<'whatsapp' | 'facebook' | 'twitter' | 'linkedin'>('facebook');
  const [useCustomTwitter, setUseCustomTwitter] = useState<boolean>(
    Boolean(formData.twitterTitle || formData.twitterDescription)
  );
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Active Branding references
  const activeBrandLogo =
    academySettings.customLogoUrl ||
    websiteCmsConfig.customLogoUrl ||
    websiteCmsConfig.headerLogoUrl ||
    '/brand-logo.png';
  const instituteName = academySettings.instituteName || 'Nexgen Computer Academy';
  const tagline = academySettings.tagline || 'Institute of Information Technology & Professional Skills';
  const canonicalUrl = formData.canonicalBaseUrl || 'https://nexgenacademy.edu.bd';

  // Resolved values for previews
  const resolvedOgTitle = formData.ogTitle || formData.metaTitle || `${instituteName} – Professional IT Training & Career Academy`;
  const resolvedOgDesc =
    formData.ogDescription ||
    formData.metaDescription ||
    `${tagline}. 100% practical lab training with verifiable certificate and freelancing support in Farmgate, Dhaka.`;
  const resolvedOgImage = formData.ogImageUrl || activeBrandLogo;
  const resolvedTwitterCard = formData.twitterCard || 'summary_large_image';
  const resolvedTwitterTitle = (useCustomTwitter && formData.twitterTitle) ? formData.twitterTitle : resolvedOgTitle;
  const resolvedTwitterDesc = (useCustomTwitter && formData.twitterDescription) ? formData.twitterDescription : resolvedOgDesc;
  const resolvedTwitterHandle = formData.twitterHandle || '@nexgenacademybd';

  // 1-Click Sync with Active Brand Identity
  const handleSyncWithBranding = () => {
    const updated: GlobalSeoConfig = {
      ...formData,
      ogTitle: `${instituteName} – Professional IT Training & Career Academy`,
      ogDescription: `${tagline}. Practical hands-on training with verifiable certificates in Farmgate, Dhaka.`,
      ogImageUrl: activeBrandLogo,
      ogSiteName: instituteName,
      ogType: formData.ogType || 'website',
      ogLocale: formData.ogLocale || 'bn_BD',
      twitterTitle: `${instituteName} – Professional IT Training & Career Academy`,
      twitterDescription: `${tagline}. Verifiable certification & career support in Bangladesh.`,
      twitterImage: activeBrandLogo,
      twitterCard: 'summary_large_image',
      twitterHandle: formData.twitterHandle || '@nexgenacademybd',
      autoSyncWithBranding: true
    };
    setFormData(updated);

    if (onSuccessToast) {
      onSuccessToast('Social preview cards synced with active branding logo & institute name!');
    }
  };

  // Direct Image File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ইমেজ ফাইল সাইজ সর্বোচ্চ ৫MB হতে পারবে।');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData(prev => ({
          ...prev,
          ogImageUrl: result,
          twitterImage: result,
          autoSyncWithBranding: false
        }));
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('ইমেজ লোড করতে সমস্যা হয়েছে।');
    };
    reader.readAsDataURL(file);
  };

  // Generate HTML Meta tags string for copying
  const generateMetaTagsSnippet = () => {
    return `<!-- Open Graph (Facebook, WhatsApp, LinkedIn, Discord) -->
<meta property="og:type" content="${formData.ogType || 'website'}" />
<meta property="og:site_name" content="${formData.ogSiteName || instituteName}" />
<meta property="og:locale" content="${formData.ogLocale || 'bn_BD'}" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:title" content="${resolvedOgTitle}" />
<meta property="og:description" content="${resolvedOgDesc}" />
<meta property="og:image" content="${resolvedOgImage}" />

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="${resolvedTwitterCard}" />
<meta name="twitter:site" content="${resolvedTwitterHandle}" />
<meta name="twitter:creator" content="${resolvedTwitterHandle}" />
<meta name="twitter:title" content="${resolvedTwitterTitle}" />
<meta name="twitter:description" content="${resolvedTwitterDesc}" />
<meta name="twitter:image" content="${formData.twitterImage || resolvedOgImage}" />`;
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(generateMetaTagsSnippet());
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  // Save changes & apply immediately to current DOM
  const handleSaveAndApply = async () => {
    setIsSaving(true);
    const updatedSeo: GlobalSeoConfig = {
      ...formData,
      ogTitle: formData.ogTitle || resolvedOgTitle,
      ogDescription: formData.ogDescription || resolvedOgDesc,
      ogImageUrl: formData.ogImageUrl || resolvedOgImage,
      ogType: formData.ogType || 'website',
      ogSiteName: formData.ogSiteName || instituteName,
      ogLocale: formData.ogLocale || 'bn_BD',
      twitterCard: resolvedTwitterCard,
      twitterHandle: resolvedTwitterHandle,
      twitterTitle: useCustomTwitter ? formData.twitterTitle : undefined,
      twitterDescription: useCustomTwitter ? formData.twitterDescription : undefined,
      twitterImage: formData.twitterImage || undefined
    };

    updateWebsiteCmsConfig({
      seo: updatedSeo
    });

    // Dynamically apply to active document head right now
    try {
      const payload = getHomepageSeoMetadata(academySettings, {
        ...websiteCmsConfig,
        seo: updatedSeo
      });
      applySeoMetadata(payload);
    } catch (err) {
      console.warn('Failed to apply live metadata:', err);
    }

    if (syncToCloudNow) {
      try {
        await syncToCloudNow(true);
      } catch {}
    }

    if (onSave) {
      onSave();
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    if (onSuccessToast) {
      onSuccessToast('OpenGraph & Twitter Cards updated & applied to live DOM!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Branding Synchronization Engine */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center space-x-1">
                <Share2 className="w-3 h-3" />
                <span>OpenGraph & Twitter Card Engine</span>
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold rounded-lg flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Dynamic Branding Auto-Sync</span>
              </span>
            </div>

            <h2 className="text-xl font-black tracking-tight text-white flex items-center space-x-2">
              <span>সোশ্যাল মিডিয়া শেয়ার কার্ড ও মেটা ট্যাগ ম্যানেজার</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              ফেসবুক, হোয়াটসঅ্যাপ, এক্স/টুইটার এবং লিংকডইনে আপনার ওয়েবসাইটের লিংক শেয়ার করলে কার্ডটি ঠিক কেমন দেখাবে তা নিয়ন্ত্রণ করুন। প্রতিষ্ঠানের ব্র্যান্ড লোগো পরিবর্তন হলেও সোশ্যাল শেয়ার কার্ড যাতে স্বয়ংক্রিয়ভাবে নির্ভুল ও আকর্ষণীয় থাকে তা নিশ্চিত করুন।
            </p>
          </div>

          {/* Quick Branding Sync Action Widget */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center shadow-md overflow-hidden shrink-0">
                <img
                  src={activeBrandLogo}
                  alt="Active Brand Logo"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/brand-logo.png';
                  }}
                />
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-white line-clamp-1">{instituteName}</p>
                <p className="text-[10px] text-indigo-200">Active Brand Identity</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSyncWithBranding}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>১-ক্লিকে লোগোর সাথে সিঙ্ক করুন</span>
            </button>
          </div>
        </div>

        {/* Auto Sync Toggle Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <label className="flex items-center space-x-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.autoSyncWithBranding !== false}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  autoSyncWithBranding: e.target.checked
                }));
              }}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-white/20 bg-white/10"
            />
            <span className="text-slate-200 font-semibold">
              ব্র্যান্ড লোগো আপডেট হলে সোশ্যাল শেয়ার কার্ড স্বয়ংক্রিয়ভাবে নতুন লোগোতে সিঙ্ক রাখুন (Auto-sync cards on brand updates)
            </span>
          </label>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopySnippet}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 transition"
            >
              {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHtml ? 'Copied HTML!' : 'Copy <head> Tags'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Settings Editor, Right Live Platform Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Social Meta Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Social Share Image Studio (OG Image & Twitter Image) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>সোশ্যাল শেয়ার ইমেজ (og:image & twitter:image)</span>
              </h3>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                Recommended: 1200 × 630 px (1.91:1)
              </span>
            </div>

            <p className="text-xs text-slate-500">
              সোশ্যাল মিডিয়ায় লিংক পোস্ট করলে কার্ডের মূল ব্যানার হিসেবে এই ছবিটি প্রদর্শিত হবে।
            </p>

            {/* Thumbnail & Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-full sm:w-44 h-28 bg-slate-900 rounded-xl overflow-hidden border border-slate-300 flex items-center justify-center shrink-0 relative group">
                <img
                  src={resolvedOgImage}
                  alt="Social share preview"
                  className="max-h-full max-w-full object-contain p-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/brand-logo.png';
                  }}
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-mono rounded">
                  Live Image
                </span>
              </div>

              <div className="flex-1 space-y-2.5 w-full">
                <div className="flex flex-wrap gap-2">
                  <label className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-1.5 transition cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'আপলোড হচ্ছে...' : 'ছবি আপলোড করুন (Upload Image)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, ogImageUrl: '/brand-logo.png', twitterImage: '/brand-logo.png' }));
                    }}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition"
                  >
                    Use Brand Logo
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, ogImageUrl: '/brand-icon.png', twitterImage: '/brand-icon.png' }));
                    }}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition"
                  >
                    Use Icon Mark
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">বা সরাসরি ইমেজ URL প্রদান করুন:</label>
                  <input
                    type="url"
                    value={formData.ogImageUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, ogImageUrl: e.target.value }))}
                    placeholder="https://... or /brand-logo.png"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: OpenGraph Meta Tags (Facebook, WhatsApp, LinkedIn) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>OpenGraph প্রটোকল সেটিংস (Facebook & WhatsApp)</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-medium">Standard OpenGraph Tags</span>
            </div>

            {/* og:title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  সোশ্যাল কার্ড টাইটেল (<code className="text-indigo-600 font-mono">og:title</code>)
                </label>
                <span
                  className={`text-[11px] font-mono font-bold ${
                    resolvedOgTitle.length > 70 ? 'text-amber-600' : 'text-slate-400'
                  }`}
                >
                  {resolvedOgTitle.length} chars (Optimal: 40-60)
                </span>
              </div>
              <input
                type="text"
                value={formData.ogTitle || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ogTitle: e.target.value }))}
                placeholder={`${instituteName} – Professional IT Training & Career Academy`}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* og:description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  সোশ্যাল কার্ড বিবরণ (<code className="text-indigo-600 font-mono">og:description</code>)
                </label>
                <span
                  className={`text-[11px] font-mono font-bold ${
                    resolvedOgDesc.length > 200 ? 'text-amber-600' : 'text-slate-400'
                  }`}
                >
                  {resolvedOgDesc.length} chars (Optimal: 120-160)
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.ogDescription || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ogDescription: e.target.value }))}
                placeholder={resolvedOgDesc}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Technical OpenGraph fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">og:type</label>
                <select
                  value={formData.ogType || 'website'}
                  onChange={(e) => setFormData(prev => ({ ...prev, ogType: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="website">website</option>
                  <option value="educational_organization">educational_organization</option>
                  <option value="article">article</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">og:locale</label>
                <select
                  value={formData.ogLocale || 'bn_BD'}
                  onChange={(e) => setFormData(prev => ({ ...prev, ogLocale: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="bn_BD">bn_BD (Bengali)</option>
                  <option value="en_US">en_US (English)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">og:site_name</label>
                <input
                  type="text"
                  value={formData.ogSiteName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, ogSiteName: e.target.value }))}
                  placeholder={instituteName}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Twitter / X Card Meta Tags */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">
                  𝕏
                </span>
                <span>Twitter / X সোশ্যাল কার্ড সেটিংস</span>
              </h3>
              <label className="flex items-center space-x-2 text-xs font-bold text-indigo-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomTwitter}
                  onChange={(e) => setUseCustomTwitter(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-indigo-600"
                />
                <span>কাস্টম টুইটার টেক্সট ব্যবহার করুন</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* twitter:card format */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">কার্ড ফরম্যাট (<code className="text-indigo-600 font-mono">twitter:card</code>)</label>
                <select
                  value={resolvedTwitterCard}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitterCard: e.target.value as any }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="summary_large_image">Large Image Card (summary_large_image) - Recommended</option>
                  <option value="summary">Small Square Card (summary)</option>
                </select>
                <p className="text-[10px] text-slate-400">
                  Large Image কার্ডে বড় থাম্বনেইল ছবি প্রদর্শিত হয় যা অধিক ক্লিক আকর্ষণ করে।
                </p>
              </div>

              {/* twitter:site handle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">টুইটার হ্যান্ডেল (<code className="text-indigo-600 font-mono">twitter:site</code>)</label>
                <input
                  type="text"
                  value={formData.twitterHandle || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitterHandle: e.target.value }))}
                  placeholder="@nexgenacademybd"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {useCustomTwitter && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">টুইটার টাইটেল (<code className="text-indigo-600 font-mono">twitter:title</code>)</label>
                  <input
                    type="text"
                    value={formData.twitterTitle || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitterTitle: e.target.value }))}
                    placeholder={resolvedOgTitle}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">টুইটার বিবরণ (<code className="text-indigo-600 font-mono">twitter:description</code>)</label>
                  <textarea
                    rows={2}
                    value={formData.twitterDescription || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitterDescription: e.target.value }))}
                    placeholder={resolvedOgDesc}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Multi-Platform Live Preview Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5 sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-black uppercase text-indigo-600 tracking-wider flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Social Card Simulator</span>
              </span>

              {/* Platform selector buttons */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActivePlatformPreview('facebook')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                    activePlatformPreview === 'facebook'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={() => setActivePlatformPreview('whatsapp')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                    activePlatformPreview === 'whatsapp'
                      ? 'bg-white text-emerald-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setActivePlatformPreview('twitter')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                    activePlatformPreview === 'twitter'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  𝕏 / Twitter
                </button>
                <button
                  type="button"
                  onClick={() => setActivePlatformPreview('linkedin')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                    activePlatformPreview === 'linkedin'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  LinkedIn
                </button>
              </div>
            </div>

            {/* PREVIEW 1: FACEBOOK FEED CARD */}
            {activePlatformPreview === 'facebook' && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                  <span>Facebook Feed Preview:</span>
                  <span className="text-[10px] text-blue-600 font-semibold">Desktop & Mobile</span>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-xs">
                  {/* Image area */}
                  <div className="w-full h-44 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                    <img
                      src={resolvedOgImage}
                      alt="Facebook Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/brand-logo.png';
                      }}
                    />
                  </div>

                  {/* Facebook content bar */}
                  <div className="p-3.5 bg-slate-100 border-t border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500 truncate">
                      {canonicalUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </div>
                    <div className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                      {resolvedOgTitle}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                      {resolvedOgDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW 2: WHATSAPP CHAT PREVIEW */}
            {activePlatformPreview === 'whatsapp' && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                  <span>WhatsApp Bubble Preview:</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Direct Message / Group Chat</span>
                </div>

                {/* WhatsApp Chat Simulated Bubble */}
                <div className="bg-[#e2f7cb] border border-[#c4e6a0] rounded-2xl p-3.5 text-slate-900 max-w-sm ml-auto shadow-sm space-y-2">
                  <div className="rounded-xl overflow-hidden border border-slate-300 bg-white">
                    <div className="w-full h-36 bg-slate-900 flex items-center justify-center overflow-hidden">
                      <img
                        src={resolvedOgImage}
                        alt="WhatsApp Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/brand-logo.png';
                        }}
                      />
                    </div>
                    <div className="p-2.5 bg-slate-50 space-y-1">
                      <div className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                        {resolvedOgTitle}
                      </div>
                      <p className="text-[10px] text-slate-600 line-clamp-2">
                        {resolvedOgDesc}
                      </p>
                      <div className="text-[9px] text-slate-400 font-mono truncate">
                        {canonicalUrl}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">12:30 PM ✓✓</div>
                </div>
              </div>
            )}

            {/* PREVIEW 3: TWITTER / X CARD SIMULATOR */}
            {activePlatformPreview === 'twitter' && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                  <span>𝕏 / Twitter Post Simulator:</span>
                  <span className="text-[10px] font-mono font-bold text-slate-900">{resolvedTwitterCard}</span>
                </div>

                <div className="bg-slate-950 text-white rounded-2xl p-4 border border-slate-800 space-y-3 font-sans">
                  {/* Account Info */}
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={activeBrandLogo}
                        alt="Avatar"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5 text-xs font-bold">
                        <span>{instituteName}</span>
                        <span className="text-slate-400 font-normal">{resolvedTwitterHandle}</span>
                        <span className="text-slate-500">· 2h</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    Check out our official website and verifiable course curriculum! 🚀
                  </p>

                  {/* Twitter Card */}
                  {resolvedTwitterCard === 'summary_large_image' ? (
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                      <div className="w-full h-40 bg-slate-900 flex items-center justify-center overflow-hidden">
                        <img
                          src={formData.twitterImage || resolvedOgImage}
                          alt="Twitter Large Card"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/brand-logo.png';
                          }}
                        />
                      </div>
                      <div className="p-3 space-y-0.5">
                        <div className="text-[10px] text-slate-400">
                          {canonicalUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </div>
                        <div className="font-bold text-xs text-slate-100 line-clamp-1">
                          {resolvedTwitterTitle}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2">
                          {resolvedTwitterDesc}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center">
                      <div className="w-24 h-24 bg-slate-900 flex items-center justify-center shrink-0">
                        <img
                          src={formData.twitterImage || resolvedOgImage}
                          alt="Twitter Square"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2.5 space-y-0.5">
                        <div className="text-[10px] text-slate-400">
                          {canonicalUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </div>
                        <div className="font-bold text-xs text-slate-100 line-clamp-1">
                          {resolvedTwitterTitle}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2">
                          {resolvedTwitterDesc}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PREVIEW 4: LINKEDIN SHARE CARD */}
            {activePlatformPreview === 'linkedin' && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                  <span>LinkedIn Post Preview:</span>
                  <span className="text-[10px] text-blue-700 font-semibold">Feed Update</span>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs space-y-2 p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 p-0.5 flex items-center justify-center">
                      <img src={activeBrandLogo} alt="Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{instituteName}</div>
                      <div className="text-[10px] text-slate-500">12,500 followers · Promoted</div>
                    </div>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <div className="w-full h-40 bg-slate-900 flex items-center justify-center overflow-hidden">
                      <img
                        src={resolvedOgImage}
                        alt="LinkedIn Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/brand-logo.png';
                        }}
                      />
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-0.5">
                      <div className="font-bold text-xs text-slate-900 line-clamp-1">
                        {resolvedOgTitle}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {canonicalUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Debugging & Validator Links */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">External Testing & Debuggers:</span>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <a
                  href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-semibold flex items-center justify-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3 text-blue-600" />
                  <span>Facebook Debugger</span>
                </a>
                <a
                  href={`https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-semibold flex items-center justify-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3 text-blue-700" />
                  <span>LinkedIn Inspector</span>
                </a>
              </div>
            </div>

            {/* Save & Apply Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveAndApply}
                disabled={isSaving}
                className={`w-full py-3.5 rounded-xl font-black text-xs shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  saveSuccess
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-600/30 active:scale-98'
                }`}
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>সংরক্ষণ ও লাইভ আপডেট সম্পন্ন হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'Save & Apply Social Meta Tags (সংরক্ষণ করুন)'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
