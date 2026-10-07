import React from 'react';
import { Globe2, CreditCard, Gift, Headphones, MessageCircle, ArrowRight, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { ExpatTrustBannerConfig } from '../../../types';

interface NexgenExpatTrustBannerProps {
  onOpenAdmission: () => void;
  whatsappNumber?: string;
  config?: ExpatTrustBannerConfig;
}

export const NexgenExpatTrustBanner: React.FC<NexgenExpatTrustBannerProps> = ({
  onOpenAdmission,
  whatsappNumber = '8801798444444',
  config
}) => {
  const effectiveWaNumber = config?.whatsappOverride || whatsappNumber;
  const cleanWa = effectiveWaNumber.replace(/[^0-9]/g, '');
  const waFull = cleanWa.startsWith('88') ? cleanWa : `88${cleanWa}`;
  const waUrl = `https://wa.me/${waFull}?text=${encodeURIComponent('আসসালামু আলাইকুম! আমি প্রবাস থেকে অনলাইনে কোর্স ও ভর্তি সংক্রান্ত তথ্য জানতে চাই।')}`;

  const defaultIcons = [Clock, CreditCard, Gift, Headphones];

  const defaultFeatures = [
    {
      title: 'টাইমজোন ফ্রেন্ডলি লাইভ ক্লাস',
      desc: 'মধ্যপ্রাচ্য, ইউরোপ, আমেরিকা ও মালয়েশিয়ার সময় উপযোগী স্পেশাল ইভনিং ও উইকেন্ড ব্যাচ।'
    },
    {
      title: 'আন্তর্জাতিক পেমেন্ট সুবিধা',
      desc: 'Visa, Mastercard, Amex বা এক্সচেঞ্জ রেমিট্যান্সের মাধ্যমে সরাসরি ফি পরিশোধের সুযোগ।'
    },
    {
      title: 'পরিবারের জন্য গিফট এনরোলমেন্ট',
      desc: 'প্রবাসে থেকে দেশে থাকা ভাই-বোন, সন্তান বা প্রিয়জনের জন্য সহজ ১-ক্লিক কোর্স বুকিং।'
    },
    {
      title: 'ডেডিকেটেড ১-অন-১ সাপোর্ট',
      desc: 'লাইভ ক্লাস রেকর্ডিং ও যেকোনো প্রয়োজনে হোয়াটসঅ্যাপে সার্বক্ষণিক মেন্টর সহায়তা।'
    }
  ];

  const features = config?.features && config.features.length > 0 ? config.features : defaultFeatures;
  const tagText = config?.tagText || 'প্রবাসী বাংলাদেশি লার্নার্স হাব • Expat & NRI Hub';
  const title = config?.title || 'প্রবাসে থেকেই শিখুন ইন-ডিমান্ড আইটি ও ফ্রিল্যান্সিং স্কিল';
  const subtitle = config?.subtitle || 'বিশ্বের যেকোনো দেশ থেকে আপনার সুবিধাজনক সময়ে সরাসরি ইন্টারেক্টিভ লাইভ ক্লাসে অংশ নিন অথবা দেশে থাকা পরিবারের প্রিয়জনকে স্বাবলম্বী করতে কোর্স উপহার দিন।';

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{tagText}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((feat, idx) => {
            const Icon = defaultIcons[idx % defaultIcons.length] || Sparkles;
            return (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-indigo-400/50 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-white text-sm leading-snug break-words">{feat.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal break-words">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner Strip */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-amber-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>১০০% আন্তর্জাতিক ভেরিফায়েড সার্টিফিকেট ও সাপোর্ট</span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white leading-snug break-words">
              প্রবাস থেকে কোর্সের বিস্তারিত বা ভর্তি প্রক্রিয়া জানতে চান?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed break-words">
              আমাদের এক্সক্লুসিভ আন্তর্জাতিক সাপোর্ট টিম ২৪/৭ আপনাদের সহায়তায় প্রস্তুত।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={onOpenAdmission}
              className="w-full sm:w-auto min-h-[46px] px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
              <span>অনলাইনে ভর্তি আবেদন</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[46px] px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>হোয়াটসঅ্যাপ সাপোর্ট</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
