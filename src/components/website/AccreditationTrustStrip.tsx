import React from 'react';
import {
  ShieldCheck,
  Award,
  Monitor,
  HeartHandshake,
  Briefcase,
  CreditCard,
  CheckCircle2,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';
import { AccreditationTrustItem } from '../../types';

interface AccreditationTrustStripProps {
  items?: AccreditationTrustItem[];
  onOpenCounselingModal?: () => void;
}

const renderTrustIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Award':
      return <Award className="w-5 h-5 text-amber-500 shrink-0" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />;
    case 'Monitor':
      return <Monitor className="w-5 h-5 text-emerald-600 shrink-0" />;
    case 'Briefcase':
      return <Briefcase className="w-5 h-5 text-blue-600 shrink-0" />;
    case 'HeartHandshake':
      return <HeartHandshake className="w-5 h-5 text-rose-500 shrink-0" />;
    case 'CreditCard':
      return <CreditCard className="w-5 h-5 text-cyan-600 shrink-0" />;
    case 'GraduationCap':
      return <GraduationCap className="w-5 h-5 text-purple-600 shrink-0" />;
    case 'Sparkles':
    default:
      return <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />;
  }
};

export const AccreditationTrustStrip: React.FC<AccreditationTrustStripProps> = ({
  items: propsItems,
  onOpenCounselingModal
}) => {
  const { websiteCmsConfig } = useAcademy();

  const fallbackItems: AccreditationTrustItem[] = [
    {
      id: 'bteb',
      iconName: 'Award',
      title: 'BTEB স্ট্যান্ডার্ড কারিকুলাম',
      subtitle: 'বাংলাদেশ কারিগরি শিক্ষা বোর্ড অনুমোদিত মান',
      badge: 'Govt. Standard',
      enabled: true
    },
    {
      id: 'iso',
      iconName: 'ShieldCheck',
      title: 'ISO 9001:2015 সার্টিফাইড',
      subtitle: 'আন্তর্জাতিক মানসম্পন্ন আইটি ট্রেনিং ও ম্যানেজমেন্ট',
      badge: 'ISO Quality',
      enabled: true
    },
    {
      id: 'pc_lab',
      iconName: 'Monitor',
      title: '১০০% সিঙ্গেল পিসি ল্যাব',
      subtitle: 'প্রতিটি শিক্ষার্থীর জন্য ক্লাসে ব্যক্তিগত হাই-স্পিড কম্পিউটার',
      badge: 'Smart Lab',
      enabled: true
    },
    {
      id: 'placement',
      iconName: 'Briefcase',
      title: '১০০+ হায়ার পার্টনার প্লেসমেন্ট',
      subtitle: 'সিভি বিল্ডিং, মক ইন্টারভিউ ও সরাসরি ইন্টার্নশিপ রেফারেল',
      badge: 'Career Cell',
      enabled: true
    },
    {
      id: 'support',
      iconName: 'HeartHandshake',
      title: 'লাইফটাইম মেন্টরশিপ সাপোর্ট',
      subtitle: 'কোর্স শেষ হলেও আনলিমিটেড ক্যাম্পাস ল্যাব ও সলিউশন এক্সেস',
      badge: 'Lifetime 24/7',
      enabled: true
    },
    {
      id: 'installment',
      iconName: 'CreditCard',
      title: '০% সুদে সহজ কিস্তি সুবিধা',
      subtitle: 'বিকাশ, নগদ ও ব্যাংকে সহজ ২-৩ কিস্তিতে ভর্তির সুযোগ',
      badge: 'Easy EMI',
      enabled: true
    }
  ];

  const configuredItems = propsItems || websiteCmsConfig?.trustStripConfig?.items || fallbackItems;
  const activeItems = configuredItems.filter(item => item.enabled !== false);

  if (activeItems.length === 0) return null;

  return (
    <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {activeItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-indigo-300 p-3 sm:p-3.5 rounded-2xl transition-all group flex flex-col justify-between space-y-2 shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                  {renderTrustIcon(item.iconName)}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {item.badge}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
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
