import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  X,
  Bell,
  Sparkles,
  AlertTriangle,
  Check,
  Megaphone,
  Save,
  Radio,
  Sliders,
  Tag
} from 'lucide-react';

interface TopNoticeTickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopNoticeTickerModal: React.FC<TopNoticeTickerModalProps> = ({
  isOpen,
  onClose
}) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig, currentUser } = useAcademy();

  const [topNoticeTicker, setTopNoticeTicker] = useState(
    websiteCmsConfig.topNoticeTicker || 'Admission open for upcoming weekend & evening batches! 40% scholarship available.'
  );

  const [promoEnabled, setPromoEnabled] = useState(
    websiteCmsConfig.promoBanner?.enabled ?? true
  );
  const [promoTitle, setPromoTitle] = useState(
    websiteCmsConfig.promoBanner?.title || 'Special 40% Scholarship Discount for New Students!'
  );
  const [promoDiscountCode, setPromoDiscountCode] = useState(
    websiteCmsConfig.promoBanner?.discountCode || 'NEXGEN40'
  );
  const [promoLinkUrl, setPromoLinkUrl] = useState(
    (websiteCmsConfig.promoBanner as any)?.linkUrl || '#courses'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    updateWebsiteCmsConfig({
      topNoticeTicker: topNoticeTicker.trim(),
      promoBanner: {
        enabled: promoEnabled,
        title: promoTitle.trim(),
        discountCode: promoDiscountCode.trim(),
        linkUrl: promoLinkUrl.trim()
      } as any
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                টপ নোটিশ ও জরুরি ব্যানার এডিটর
              </h3>
              <p className="text-xs text-slate-400">
                Manage Top Notice Ticker & Promotional Header Banner
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {savedSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ব্যানার ও নোটিশ সফলভাবে আপডেট ও সেভ হয়েছে!</span>
            </div>
          )}

          {/* Section 1: Top Scrolling Notice Ticker */}
          <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span>টপ নোটিশ বার (Notice Ticker Text)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">ওয়েবসাইটের একদম উপরে দৃশ্যমান</span>
            </div>

            <textarea
              rows={2}
              value={topNoticeTicker}
              onChange={e => setTopNoticeTicker(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="উদা: নতুন ব্যাচে ভর্তি চলছে! ২০শে তারিখ পর্যন্ত ৪০% স্কলারশিপ সুবিধা..."
            />

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-bold">কুইক টেমপ্লেট:</span>
              <button
                type="button"
                onClick={() => setTopNoticeTicker('Admission open for upcoming weekend & evening batches! 40% scholarship available.')}
                className="text-[10px] px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-medium transition-colors"
              >
                ভর্তি নোটিশ
              </button>
              <button
                type="button"
                onClick={() => setTopNoticeTicker('📢 শুক্রবার সরকারি ছুটির কারণে ক্যাম্পাসের সকল অফলাইন ক্লাস স্থগিত, অনলাইন ক্লাস যথারীতি চলবে।')}
                className="text-[10px] px-2 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-md font-medium transition-colors"
              >
                ছুটি/জরুরি নোটিশ
              </button>
              <button
                type="button"
                onClick={() => setTopNoticeTicker('🎉 অভিনন্দন! আমাদের ৬০ জন শিক্ষার্থী সফলভাবে সফটওয়্যার কোম্পানিগুলোতে ইন্টার্নশিপ অর্জন করেছে।')}
                className="text-[10px] px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-md font-medium transition-colors"
              >
                সাফল্য/প্লেসমেন্ট
              </button>
            </div>
          </div>

          {/* Section 2: Promo Announcement Bar */}
          <div className="space-y-4 p-4 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border border-indigo-100 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>প্রমোশনাল অফার ব্যানার (Top Promo Bar)</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={promoEnabled}
                  onChange={e => setPromoEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-2 text-xs font-bold text-slate-700">
                  {promoEnabled ? 'সক্রিয় (Enabled)' : 'বন্ধ (Disabled)'}
                </span>
              </label>
            </div>

            {promoEnabled && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    ব্যানার শিরোনাম / অফার বার্তা
                  </label>
                  <input
                    type="text"
                    value={promoTitle}
                    onChange={e => setPromoTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    placeholder="উদা: স্পেশাল ৪০% স্কলারশিপ ডিসকাউন্ট!"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      ডিসকাউন্ট কুপন কোড (ঐচ্ছিক)
                    </label>
                    <div className="relative">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={promoDiscountCode}
                        onChange={e => setPromoDiscountCode(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 uppercase"
                        placeholder="NEXGEN40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      ক্লিক লিংক / বাটন টার্গেট
                    </label>
                    <input
                      type="text"
                      value={promoLinkUrl}
                      onChange={e => setPromoLinkUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      placeholder="#courses বা সরাসরি লিংক"
                    />
                  </div>
                </div>

                {/* Live Banner Preview */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">লাইভ প্রিভিউ:</span>
                  <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-white text-xs py-2 px-4 rounded-xl text-center font-bold flex items-center justify-center space-x-2 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    <span>{promoTitle || 'Your Offer Title Here'}</span>
                    {promoDiscountCode && (
                      <span className="bg-white/20 border border-white/40 px-2 py-0.5 rounded-md font-mono text-[10px]">
                        Code: {promoDiscountCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            বাতিল করুন
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>সংরক্ষণ করুন (Save Banner)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
