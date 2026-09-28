import React from 'react';
import {
  ShieldCheck,
  Award,
  Monitor,
  HeartHandshake,
  Briefcase,
  CreditCard,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface AccreditationTrustStripProps {
  onOpenCounselingModal?: () => void;
}

export const AccreditationTrustStrip: React.FC<AccreditationTrustStripProps> = ({
  onOpenCounselingModal
}) => {
  const trustItems = [
    {
      id: 'bteb',
      icon: <Award className="w-5 h-5 text-amber-500 shrink-0" />,
      title: 'BTEB স্ট্যান্ডার্ড কারিকুলাম',
      subtitle: 'বাংলাদেশ কারিগরি শিক্ষা বোর্ড অনুমোদিত মান',
      badge: 'Govt. Standard'
    },
    {
      id: 'iso',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />,
      title: 'ISO 9001:2015 সার্টিফাইড',
      subtitle: 'আন্তর্জাতিক মানসম্পন্ন আইটি ট্রেনিং ও ম্যানেজমেন্ট',
      badge: 'ISO Quality'
    },
    {
      id: 'pc_lab',
      icon: <Monitor className="w-5 h-5 text-emerald-600 shrink-0" />,
      title: '১০০% সিঙ্গেল পিসি ল্যাব',
      subtitle: 'প্রতিটি শিক্ষার্থীর জন্য ক্লাসে ব্যক্তিগত হাই-স্পিড কম্পিউটার',
      badge: 'Smart Lab'
    },
    {
      id: 'placement',
      icon: <Briefcase className="w-5 h-5 text-blue-600 shrink-0" />,
      title: '১০০+ হায়ার পার্টনার প্লেসমেন্ট',
      subtitle: 'সিভি বিল্ডিং, মক ইন্টারভিউ ও সরাসরি ইন্টার্নশিপ রেফারেল',
      badge: 'Career Cell'
    },
    {
      id: 'support',
      icon: <HeartHandshake className="w-5 h-5 text-rose-500 shrink-0" />,
      title: 'লাইফটাইম মেন্টরশিপ সাপোর্ট',
      subtitle: 'কোর্স শেষ হলেও আনলিমিটেড ক্যাম্পাস ল্যাব ও সলিউশন এক্সেস',
      badge: 'Lifetime 24/7'
    },
    {
      id: 'installment',
      icon: <CreditCard className="w-5 h-5 text-cyan-600 shrink-0" />,
      title: '০% সুদে সহজ কিস্তি সুবিধা',
      subtitle: 'বিকাশ, নগদ ও ব্যাংকে সহজ ২-৩ কিস্তিতে ভর্তির সুযোগ',
      badge: 'Easy EMI'
    }
  ];

  return (
    <div className="bg-slate-900 border-y border-slate-800 py-6 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-0 left-1/3 w-64 h-24 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {trustItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 p-3 sm:p-3.5 rounded-2xl transition-all group flex flex-col justify-between space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                  {item.badge}
                </span>
              </div>

              <div>
                <h4 className="font-black text-xs sm:text-[13px] text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
