import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Course, CourseLandingPageConfig, CourseLandingFaq, CourseLandingReview } from '../../types';
import { cleanWhatsAppNumber } from '../../utils/whatsappHelper';
import {
  X,
  Sparkles,
  Layout,
  Save,
  MessageCircle,
  Smartphone,
  Eye,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  Layers,
  HelpCircle,
  Award,
  Video,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Palette
} from 'lucide-react';

interface CourseLandingPageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

const PRESET_BANNERS = [
  { label: 'Default Banner', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Tech Lab / Coding', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Creative Studio', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Modern Workspace', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80' },
  { label: 'AI Futuristic', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&auto=format&fit=crop&q=80' }
];

export const CourseLandingPageEditorModal: React.FC<CourseLandingPageEditorModalProps> = ({
  isOpen,
  onClose,
  course
}) => {
  const { updateCourse, websiteCmsConfig } = useAcademy();
  const existingConfig = course.landingConfig || {};

  // Tabs
  const [activeTab, setActiveTab] = useState<'hero_cta' | 'pricing_seats' | 'curriculum_bonus' | 'faqs_reviews' | 'styling'>('hero_cta');

  // Hero & Messaging
  const [headline, setHeadline] = useState(existingConfig.headline || course.name);
  const [subheadline, setSubheadline] = useState(existingConfig.subheadline || course.description || '');
  const [heroBadge, setHeroBadge] = useState(existingConfig.heroBadge || '🚀 ২০২৬ স্পেশাল ব্যাচ অ্যাডমিশন ওপেন');
  const [customBannerUrl, setCustomBannerUrl] = useState(existingConfig.customBannerUrl || course.thumbnailUrl || '');
  const [videoPromoUrl, setVideoPromoUrl] = useState(existingConfig.videoPromoUrl || '');

  // CTAs (WhatsApp, Messenger, Admission)
  const [ctaMode, setCtaMode] = useState<CourseLandingPageConfig['ctaMode']>(existingConfig.ctaMode || 'both');
  const [customWhatsAppNumber, setCustomWhatsAppNumber] = useState(
    existingConfig.customWhatsAppNumber || websiteCmsConfig?.marketing?.floatingWhatsAppNumber || '01798444444'
  );
  const [customWhatsAppMessage, setCustomWhatsAppMessage] = useState(
    existingConfig.customWhatsAppMessage || `Hello Nexgen Academy! I want to know admission details for "${course.name}".`
  );
  const [customMessengerUrl, setCustomMessengerUrl] = useState(
    existingConfig.customMessengerUrl || websiteCmsConfig?.socialLinks?.facebookPageUrl || websiteCmsConfig?.facebookPageUrl || 'https://m.me/nexgenacademy'
  );

  // Pricing, Seats & Countdowns
  const [offerFee, setOfferFee] = useState<number>(course.offerFee || 6500);
  const [regularFee, setRegularFee] = useState<number>(course.regularFee || 15000);
  const [customDiscountBadge, setCustomDiscountBadge] = useState(existingConfig.customDiscountBadge || '৫০% স্পেশাল মেগা স্কলারশিপ');
  const [showBatchCountdown, setShowBatchCountdown] = useState<boolean>(existingConfig.showBatchCountdown ?? true);
  const [nextBatchStartDate, setNextBatchStartDate] = useState(existingConfig.nextBatchStartDate || '১৫ মে, ২০২৬');
  const [availableSeats, setAvailableSeats] = useState<number>(existingConfig.availableSeats || 8);
  const [guaranteeText, setGuaranteeText] = useState(existingConfig.guaranteeText || '১০০% প্র্যাকটিক্যাল ল্যাব সাপোর্ট & লাইফটাইম মেন্টরশিপ নিশ্চয়তা');

  // Bonus items
  const [bonusItems, setBonusItems] = useState<string[]>(
    existingConfig.bonusItems || [
      'ChatGPT & AI প্রম্পটিং মাস্টারবুক (PDF Free)',
      'প্রিমিয়াম টাইপিং সফটওয়্যার ফুল লাইসেন্স',
      'প্রফেশনাল সিভি মেকিং টেমপ্লেট ও ফরম্যাট',
      'লাইফটাইম ক্লাস রিসোর্স ও রেকর্ডিং অ্যাক্সেস'
    ]
  );
  const [newBonusInput, setNewBonusInput] = useState('');

  // FAQs
  const [faqs, setFaqs] = useState<CourseLandingFaq[]>(
    existingConfig.faqs || [
      {
        question: 'এই কোর্সে ভর্তি হতে কি পূর্ব অভিজ্ঞতার প্রয়োজন আছে?',
        answer: 'না, এই কোর্সটি একদম জিরো লেভেল থেকে শুরু হবে। কম্পিউটার পরিচালনা, টাইপিং থেকে শুরু করে অ্যাডভান্সড AI টুলস পর্যন্ত হাতে-কলমে শেখানো হবে।'
      },
      {
        question: 'ক্লাস মিস গেলে কি ব্যাকআপ ক্লাস বা ভিডিও রেকর্ডিং পাওয়া যাবে?',
        answer: 'হ্যাঁ, প্রতিটি ক্লাসের লাইভ প্র্যাকটিসের পাশাপাশি স্টুডেন্ট পোর্টালে রিসোর্স ফাইল, অ্যাসাইনমেন্ট ও ব্যাকআপ সাপোর্ট পাওয়া যাবে।'
      },
      {
        question: 'কোর্স শেষে কি সার্টিফিকেট দেওয়া হবে?',
        answer: 'হ্যাঁ, প্রতিটি প্রজেক্ট ও ফাইনাল পরীক্ষা সফলভাবে শেষ করলে ভেরিফায়েবল কিউআর কোডযুক্ত প্রফেশনাল সার্টিফিকেট দেওয়া হবে।'
      },
      {
        question: 'পেমেন্ট কি কিস্তিতে দেওয়ার সুবিধা আছে?',
        answer: 'হ্যাঁ, প্রাথমিক মাত্র ৳২,৫০০ দিয়ে সিট কনফার্ম করে বাকি ফি ২-৩টি সহজ কিস্তিতে পরিশোধ করতে পারবেন।'
      }
    ]
  );
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Reviews
  const [customReviews, setCustomReviews] = useState<CourseLandingReview[]>(
    existingConfig.customReviews || [
      {
        name: 'তানভীর আহমেদ',
        roleOrBatch: 'ব্যাচ ০১ শিক্ষার্থী',
        rating: 5,
        text: 'একদম প্র্যাকটিক্যাল ল্যাব ট্রেনিং। বিশেষ করে এক্সেল ও ChatGPT দিয়ে অফিস অটোমেশন শেখার পর আমার অফিসের কাজের স্পিড দ্বিগুণ হয়ে গেছে!'
      },
      {
        name: 'সাদিয়া আক্তার',
        roleOrBatch: 'ব্যাচ ০৩ গ্র্যাজুয়েট',
        rating: 5,
        text: 'টাইপিং স্পিড ১৫ WPM থেকে এখন ৪৮ WPM এ পৌঁছেছে। মেন্টরদের সাপোর্ট সত্যিই অসাধারণ।'
      }
    ]
  );
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');

  // Styling & Theme
  const [themeColor, setThemeColor] = useState<CourseLandingPageConfig['themeColor']>(existingConfig.themeColor || 'indigo');

  if (!isOpen) return null;

  const handleAddBonus = () => {
    if (!newBonusInput.trim()) return;
    setBonusItems([...bonusItems, newBonusInput.trim()]);
    setNewBonusInput('');
  };

  const handleRemoveBonus = (idx: number) => {
    setBonusItems(bonusItems.filter((_, i) => i !== idx));
  };

  const handleAddFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setFaqs([...faqs, { question: newFaqQ.trim(), answer: newFaqA.trim() }]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleAddReview = () => {
    if (!newReviewName.trim() || !newReviewText.trim()) return;
    setCustomReviews([
      ...customReviews,
      {
        name: newReviewName.trim(),
        roleOrBatch: 'কোর্স শিক্ষার্থী',
        rating: 5,
        text: newReviewText.trim()
      }
    ]);
    setNewReviewName('');
    setNewReviewText('');
  };

  const handleRemoveReview = (idx: number) => {
    setCustomReviews(customReviews.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const updatedLandingConfig: CourseLandingPageConfig = {
      headline: headline.trim(),
      subheadline: subheadline.trim(),
      heroBadge: heroBadge.trim(),
      customBannerUrl: customBannerUrl.trim(),
      videoPromoUrl: videoPromoUrl.trim() || undefined,
      ctaMode,
      customWhatsAppNumber: customWhatsAppNumber.trim(),
      customWhatsAppMessage: customWhatsAppMessage.trim(),
      customMessengerUrl: customMessengerUrl.trim(),
      showBatchCountdown,
      nextBatchStartDate: nextBatchStartDate.trim(),
      availableSeats: Number(availableSeats) || 10,
      customDiscountBadge: customDiscountBadge.trim(),
      guaranteeText: guaranteeText.trim(),
      bonusItems,
      faqs,
      customReviews,
      themeColor
    };

    updateCourse(course.id, {
      offerFee: Number(offerFee) || 0,
      regularFee: Number(regularFee) || 0,
      thumbnailUrl: customBannerUrl.trim() || course.thumbnailUrl,
      landingConfig: updatedLandingConfig
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] shadow-2xl border border-indigo-100 text-slate-900 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-base tracking-tight">
                  ল্যান্ডিং পেজ কাস্টমাইজার (Ad Variant & Content Editor)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30">
                  {course.code}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium truncate max-w-md">
                {course.name} — প্রতিটি ক্যাম্পেইনের জন্য কাস্টম কনটেন্ট, প্রাইস ও CTA পরিবর্তন করুন
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-course-landing', { detail: { course } }));
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>লাইভ প্রিভিউ</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-slate-50 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('hero_cta')}
            className={`py-3 px-3.5 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'hero_cta'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>১. হেডলাইন, ছবি ও CTA বাটন</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing_seats')}
            className={`py-3 px-3.5 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'pricing_seats'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>২. অফার ফি, সিট ও ব্যাচ কাউন্টডাউন</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum_bonus')}
            className={`py-3 px-3.5 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'curriculum_bonus'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>৩. ফ্রি বোনাস আইটেম & সুবিধা</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs_reviews')}
            className={`py-3 px-3.5 font-bold text-xs border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'faqs_reviews'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>৪. সাধারণ প্রশ্ন (FAQ) & রিভিউ</span>
          </button>
        </div>

        {/* Tab Contents - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: HERO, IMAGES & CTA CONTROLS */}
          {activeTab === 'hero_cta' && (
            <div className="space-y-5">
              {/* Notice Box */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-start space-x-3 text-xs text-indigo-950">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">ক্যাম্পেইন ভিত্তিক অডিয়েন্স ভ্যারিয়েন্ট তৈরি করুন</p>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    বিজ্ঞাপনের অ্যাঙ্গেল বা টার্গেট গ্রুপ (যেমন: শুধু চাকুরিজীবী, বা শুধু ফ্রিল্যান্সার বা স্টুডেন্ট) অনুযায়ী হেডলাইন, ব্যানার ও কল-টু-অ্যাকশন সাজিয়ে নিন।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hero Badge */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    টপ অ্যানাউন্সমেন্ট ব্যাজ (Badge Text)
                  </label>
                  <input
                    type="text"
                    value={heroBadge}
                    onChange={e => setHeroBadge(e.target.value)}
                    placeholder="e.g. 🚀 ২০২৬ স্পেশাল ব্যাচ অ্যাডমিশন ওপেন"
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* Hero Headline */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    প্রধান শিরোনাম (Landing Page Headline)
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    placeholder="e.g. Computer Office Application with AI"
                    className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Subheadline / Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সাব-হেডিং / বিস্তারিত আকর্ষণীয় বিবরণ
                </label>
                <textarea
                  rows={3}
                  value={subheadline}
                  onChange={e => setSubheadline(e.target.value)}
                  placeholder="কোর্সের মূল আকর্ষণ, কি কি শেখানো হবে এবং কীভাবে এটি ক্যারিয়ারে কাজে লাগবে..."
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
                />
              </div>

              {/* Custom Banner URL & Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ল্যান্ডিং পেজ কভার ছবি (Cover Banner URL)
                </label>
                <input
                  type="text"
                  value={customBannerUrl}
                  onChange={e => setCustomBannerUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 outline-none mb-2"
                />

                {/* Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">প্রিসেট ছবি সিলেক্ট করুন:</span>
                  {PRESET_BANNERS.map(b => (
                    <button
                      key={b.url}
                      type="button"
                      onClick={() => setCustomBannerUrl(b.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        customBannerUrl === b.url
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA CONTROLS (Single / Both WhatsApp / Messenger / Admission) */}
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-900 mb-1">
                    🎯 কল-টু-অ্যাকশন (CTA Buttons) মোড নির্বাচন করুন
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2.5">
                    আপনি যখন শুধু WhatsApp, শুধু Messenger অথবা Both বাটনে ক্যাম্পেইন চালাবেন তখন এখান থেকে কন্ট্রোল করতে পারবেন
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCtaMode('both')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between space-y-1 transition-all ${
                        ctaMode === 'both'
                          ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>অনলাইন ভর্তি + WhatsApp</span>
                      </span>
                      <span className="text-[10px] text-slate-500">ডিফল্ট হাই-কনভার্টিং মোড</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCtaMode('whatsapp_only')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between space-y-1 transition-all ${
                        ctaMode === 'whatsapp_only'
                          ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs flex items-center space-x-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>শুধু Direct WhatsApp</span>
                      </span>
                      <span className="text-[10px] text-slate-500">সরাসরি ১-ক্লিকে চ্যাটে আসবে</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCtaMode('messenger_only')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between space-y-1 transition-all ${
                        ctaMode === 'messenger_only'
                          ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 text-blue-950'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs flex items-center space-x-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                        <span>শুধু Messenger Chat</span>
                      </span>
                      <span className="text-[10px] text-slate-500">ফেসবুক পেজ মেসেঞ্জারে যাবে</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCtaMode('whatsapp_and_admission')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between space-y-1 transition-all ${
                        ctaMode === 'whatsapp_and_admission'
                          ? 'bg-purple-50/80 border-purple-600 ring-2 ring-purple-500/20 text-purple-950'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs flex items-center space-x-1.5">
                        <span>💬 WhatsApp + Messenger Both</span>
                      </span>
                      <span className="text-[10px] text-slate-500">উভয় সোশ্যাল চ্যাট অপশন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCtaMode('admission_only')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between space-y-1 transition-all ${
                        ctaMode === 'admission_only'
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs flex items-center space-x-1.5">
                        <span>📝 শুধু ভর্তি ফর্ম (Admission Only)</span>
                      </span>
                      <span className="text-[10px] text-slate-400">কোন চ্যাট বাটন ছাড়া</span>
                    </button>
                  </div>
                </div>

                {/* WhatsApp Number & Auto-Message */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp নম্বর (যেমন: 01798444444 বা +88017...)
                    </label>
                    <input
                      type="text"
                      value={customWhatsAppNumber}
                      onChange={e => setCustomWhatsAppNumber(e.target.value)}
                      placeholder="01798444444"
                      className="w-full text-xs font-mono font-bold px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                      ✓ স্বয়ংক্রিয়ভাবে আন্তর্জাতিক ফরম্যাটে ({cleanWhatsAppNumber(customWhatsAppNumber)}) কনভার্ট হয়ে চ্যাটবক্স সরাসরি খুলবে।
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ক্লিক করলে WhatsApp-এ প্রাক-লিখিত মেসেজ
                    </label>
                    <input
                      type="text"
                      value={customWhatsAppMessage}
                      onChange={e => setCustomWhatsAppMessage(e.target.value)}
                      placeholder="Hello! I want admission details..."
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Facebook Page / Messenger লিংক (m.me বা পেজ লিংক)
                    </label>
                    <input
                      type="text"
                      value={customMessengerUrl}
                      onChange={e => setCustomMessengerUrl(e.target.value)}
                      placeholder="https://m.me/nexgenacademy বা https://facebook.com/nexgenacademy"
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING, SEATS & COUNTDOWN */}
          {activeTab === 'pricing_seats' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ক্যাম্পেইন অফার ফি (৳)
                  </label>
                  <input
                    type="number"
                    value={offerFee}
                    onChange={e => setOfferFee(Number(e.target.value))}
                    className="w-full text-sm font-black px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">ল্যান্ডিং পেজে এই ফি বড় করে প্রদর্শিত হবে</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    রেগুলার ফি (৳) (কাটা দাগ সহ)
                  </label>
                  <input
                    type="number"
                    value={regularFee}
                    onChange={e => setRegularFee(Number(e.target.value))}
                    className="w-full text-sm font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  স্পেশাল অফার রিবন / ডিসকাউন্ট ব্যাজ
                </label>
                <input
                  type="text"
                  value={customDiscountBadge}
                  onChange={e => setCustomDiscountBadge(e.target.value)}
                  placeholder="e.g. ৫০% স্পেশাল মেগা স্কলারশিপ"
                  className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">ব্যাচ শুরু ও সিট কাউন্টডাউন টাইমার</p>
                    <p className="text-[11px] text-slate-500">জরুরি ভাব (Urgency) তৈরিতে সাহায্য করে</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showBatchCountdown}
                      onChange={e => setShowBatchCountdown(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {showBatchCountdown && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        পরবর্তী ব্যাচ শুরুর তারিখ
                      </label>
                      <input
                        type="text"
                        value={nextBatchStartDate}
                        onChange={e => setNextBatchStartDate(e.target.value)}
                        placeholder="e.g. ১৫ মে, ২০২৬"
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        অবশিষ্ট আসন সংখ্যা
                      </label>
                      <input
                        type="number"
                        value={availableSeats}
                        onChange={e => setAvailableSeats(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  গ্যারান্টি ও কোয়ালিটি নিশ্চয়তা বার্তা (Trust Guarantee)
                </label>
                <input
                  type="text"
                  value={guaranteeText}
                  onChange={e => setGuaranteeText(e.target.value)}
                  placeholder="e.g. ১০০% প্র্যাকটিক্যাল ল্যাব ট্রেনিং ও লাইফটাইম মেন্টরশিপ নিশ্চয়তা"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: BONUS ITEMS & CURRICULUM HIGHLIGHTS */}
          {activeTab === 'curriculum_bonus' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      🎁 কোর্সের সাথে ফ্রি স্পেশাল বোনাস সমূহ (Bonus List)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      কনভার্শন রেট বাড়ানোর জন্য এই কোর্সের সাথে শিক্ষার্থী আর কি কি ফ্রি পাবে
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {bonusItems.map((bonus, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center space-x-2 text-xs text-slate-800 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{bonus}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBonus(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add New Bonus */}
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      value={newBonusInput}
                      onChange={e => setNewBonusInput(e.target.value)}
                      placeholder="নতুন বোনাস লিখুন (যেমন: ১০০+ রেডিমেড অফিস টেমপ্লেট)..."
                      className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddBonus();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddBonus}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>যোগ করুন</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FAQS & REVIEWS */}
          {activeTab === 'faqs_reviews' && (
            <div className="space-y-6">
              {/* FAQs Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>কোর্স ভিত্তিক প্রশ্ন ও উত্তর (FAQs)</span>
                </h4>

                <div className="space-y-2">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-800">
                          {idx + 1}. {faq.question}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600">{faq.answer}</p>
                    </div>
                  ))}

                  {/* Add FAQ form */}
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
                    <input
                      type="text"
                      value={newFaqQ}
                      onChange={e => setNewFaqQ(e.target.value)}
                      placeholder="নতুন প্রশ্ন লিখুন..."
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                    />
                    <textarea
                      rows={2}
                      value={newFaqA}
                      onChange={e => setNewFaqA(e.target.value)}
                      placeholder="প্রশ্নের উত্তর লিখুন..."
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>FAQ যোগ করুন</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>শিক্ষার্থী রিভিউ & ফিডব্যাক</span>
                </h4>

                <div className="space-y-2">
                  {customReviews.map((rev, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800">
                          {rev.name} <span className="text-[10px] text-slate-500 font-normal">({rev.roleOrBatch})</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveReview(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600 italic">"{rev.text}"</p>
                    </div>
                  ))}

                  {/* Add Review */}
                  <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100 space-y-2">
                    <input
                      type="text"
                      value={newReviewName}
                      onChange={e => setNewReviewName(e.target.value)}
                      placeholder="শিক্ষার্থীর নাম..."
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                    />
                    <textarea
                      rows={2}
                      value={newReviewText}
                      onChange={e => setNewReviewText(e.target.value)}
                      placeholder="শিক্ষার্থীর রিভিউ বার্তা..."
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddReview}
                      className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>রিভিউ যোগ করুন</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
          >
            বাতিল করুন
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => {
                handleSave();
                window.dispatchEvent(new CustomEvent('open-course-landing', { detail: { course } }));
              }}
              className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>সেভ ও প্রিভিউ দেখুন</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>পরিবর্তন সেভ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
