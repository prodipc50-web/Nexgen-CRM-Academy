import React, { useState } from 'react';
import { Course } from '../../types';
import {
  X,
  Link,
  Copy,
  CheckCircle2,
  Share2,
  Sparkles,
  ExternalLink,
  Target,
  Smartphone,
  Facebook,
  Globe,
  MessageCircle,
  Sliders,
  Edit3
} from 'lucide-react';

interface AdLinkGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onOpenCustomizer?: () => void;
}

export const AdLinkGeneratorModal: React.FC<AdLinkGeneratorModalProps> = ({
  isOpen,
  onClose,
  course,
  onOpenCustomizer
}) => {
  const [source, setSource] = useState('facebook');
  const [medium, setMedium] = useState('cpc');
  const [campaignName, setCampaignName] = useState(
    course.shortName
      ? course.shortName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_batch'
      : 'office_ai_promo'
  );
  const [urlFormat, setUrlFormat] = useState<'slug' | 'param'>('slug');
  const [ctaParam, setCtaParam] = useState<'default' | 'whatsapp' | 'messenger' | 'admission' | 'both_chats'>('default');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build clean landing page URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const courseSlug =
    (course as any).slug ||
    course.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  let generatedUrl = '';
  if (urlFormat === 'slug') {
    generatedUrl = `${origin}/course/${courseSlug}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaignName.trim() || 'campaign'}`;
  } else {
    generatedUrl = `${origin}/?course=${course.id}&utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaignName.trim() || 'campaign'}`;
  }
  
  if (ctaParam !== 'default') {
    generatedUrl += `&cta=${ctaParam}`;
  }

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 text-slate-900 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                কোর্স ল্যান্ডিং পেজ ও অ্যাড লিংক
              </h3>
              <p className="text-xs text-slate-500 font-medium">{course.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explain Value & Quick Edit button */}
        <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-2 text-xs text-indigo-900">
          <div className="flex items-center justify-between">
            <p className="font-bold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>সিঙ্গেল কোর্স ডেডিকেটেড ল্যান্ডিং পেজ</span>
            </p>
            {onOpenCustomizer && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCustomizer();
                }}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold rounded-lg text-[11px] flex items-center space-x-1 shadow-xs transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>কনটেন্ট ও অফার এডিট</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            ফেসবুক অ্যাডে এই লিংকটি ব্যবহার করলে ভিজিটররা সরাসরি শুধু <strong>"{course.name}"</strong> কোর্সের স্পেশাল ল্যান্ডিং পেজে প্রবেশ করবে এবং সিলেবাস, অফার ও ১-ক্লিকে ভর্তি হতে পারবে।
          </p>
        </div>

        {/* UTM & Target Controls */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Ad Channel (Source)
              </label>
              <select
                value={source}
                onChange={e => setSource(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="facebook">Facebook Ads (ফেসবুক)</option>
                <option value="instagram">Instagram Ads (ইনস্টাগ্রাম)</option>
                <option value="messenger">Messenger Chat (মেসেঞ্জার)</option>
                <option value="whatsapp">WhatsApp Broadcast</option>
                <option value="google">Google Search / Ads</option>
                <option value="tiktok">TikTok Ads</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Medium (ক্যাম্পেইন টাইপ)
              </label>
              <select
                value={medium}
                onChange={e => setMedium(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="cpc">CPC / Paid Ads</option>
                <option value="post">Organic Page Post</option>
                <option value="story">Reels / Story Ad</option>
                <option value="direct">Direct Message / Bio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Campaign Name (ক্যাম্পেইন নাম)
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                placeholder="e.g. office_ai_batch_05"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                ল্যান্ডিং পেজ বাটন মোড (Override CTA)
              </label>
              <select
                value={ctaParam}
                onChange={e => setCtaParam(e.target.value as any)}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="default">ডিফল্ট বাটন সেটিংস</option>
                <option value="whatsapp">শুধু Direct WhatsApp বাটন</option>
                <option value="messenger">শুধু Messenger Chat বাটন</option>
                <option value="both_chats">উভয় WhatsApp + Messenger বাটন</option>
                <option value="admission">শুধু সরাসরি ভর্তি ফর্ম</option>
              </select>
            </div>
          </div>
        </div>

        {/* Generated URL & Copy Box */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold text-slate-700">
              Facebook Ads Manager-এ দেওয়ার লিংক:
            </label>
            <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setUrlFormat('slug')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  urlFormat === 'slug'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                /course/slug (Clean)
              </button>
              <button
                type="button"
                onClick={() => setUrlFormat('param')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  urlFormat === 'param'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ?course=id
              </button>
            </div>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-100 font-mono text-[11px] break-all select-all flex items-center justify-between gap-2">
            <span>{generatedUrl}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>লিংক কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>বিজ্ঞাপন লিংক কপি করুন</span>
              </>
            )}
          </button>

          <a
            href={generatedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
            title="ল্যান্ডিং পেজের প্রিভিউ দেখুন"
          >
            <span>প্রিভিউ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
