import React from 'react';
import {
  BookOpen,
  Briefcase,
  Layers,
  Award,
  FolderGit2,
  Users2,
  ShieldCheck,
  Laptop,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface InstituteBenefitsGridProps {
  instituteName?: string;
  title?: string;
  subtitle?: string;
  customBenefits?: {
    id: string;
    title: string;
    bengaliSubtitle: string;
    iconName?: string;
  }[];
}

export const InstituteBenefitsGrid: React.FC<InstituteBenefitsGridProps> = ({
  instituteName = 'NexGen Computer Academy',
  title,
  subtitle,
  customBenefits
}) => {
  const defaultBenefits = [
    {
      id: 'affordable',
      title: 'More Affordable',
      bengaliSubtitle: 'সাশ্রয়ী কোর্স ফি ও ০% কিস্তি',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-2xs group-hover:scale-110 group-hover:bg-amber-100 transition-all">
          <BookOpen className="w-8 h-8 text-amber-600" />
        </div>
      )
    },
    {
      id: 'job',
      title: 'Job Opportunity',
      bengaliSubtitle: '১০০+ কোম্পানিতে ইন্টার্নশিপ ও চাকরি',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-2xs group-hover:scale-110 group-hover:bg-blue-100 transition-all">
          <Briefcase className="w-8 h-8 text-blue-600" />
        </div>
      )
    },
    {
      id: 'flexible',
      title: 'Flexible and Short',
      bengaliSubtitle: 'সুবিধাজনক সময় ও শর্ট টার্ম প্রফেশনাল ব্যাচ',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shadow-2xs group-hover:scale-110 group-hover:bg-rose-100 transition-all">
          <Layers className="w-8 h-8 text-rose-600" />
        </div>
      )
    },
    {
      id: 'certificate',
      title: 'Credible Certificate',
      bengaliSubtitle: 'সরকারি মানসম্মত কিউআর ভেরিফায়েড সনদ',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shadow-2xs group-hover:scale-110 group-hover:bg-indigo-100 transition-all">
          <Award className="w-8 h-8 text-indigo-600" />
        </div>
      )
    },
    {
      id: 'portfolio',
      title: 'Build a portfolio',
      bengaliSubtitle: 'আন্তর্জাতিক স্ট্যান্ডার্ড লাইভ প্রজেক্ট পোর্টফোলিও',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-2xs group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
          <FolderGit2 className="w-8 h-8 text-emerald-600" />
        </div>
      )
    },
    {
      id: 'group_learning',
      title: 'Group Learning',
      bengaliSubtitle: 'সরাসরি প্র্যাকটিক্যাল ল্যাব ও গ্রুপ স্টাডি',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200 shadow-2xs group-hover:scale-110 group-hover:bg-sky-100 transition-all">
          <Users2 className="w-8 h-8 text-sky-600" />
        </div>
      )
    },
    {
      id: 'lifetime_support',
      title: 'Lifetime Support',
      bengaliSubtitle: 'কোর্স শেষ হলেও আনলিমিটেড মেন্টর সাপোর্ট',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200 shadow-2xs group-hover:scale-110 group-hover:bg-teal-100 transition-all">
          <ShieldCheck className="w-8 h-8 text-teal-600" />
        </div>
      )
    },
    {
      id: 'online_monitoring',
      title: 'Online Monitoring',
      bengaliSubtitle: 'স্টুডেন্ট পোর্টাল ও ক্লাস ট্র্যাকিং সিস্টেম',
      icon: (
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shadow-2xs group-hover:scale-110 group-hover:bg-purple-100 transition-all">
          <Laptop className="w-8 h-8 text-purple-600" />
        </div>
      )
    }
  ];

  const displayedBenefits = customBenefits && customBenefits.length > 0
    ? customBenefits.map((cb, idx) => ({
        id: cb.id || `benefit-${idx}`,
        title: cb.title,
        bengaliSubtitle: cb.bengaliSubtitle,
        icon: defaultBenefits[idx]?.icon || defaultBenefits[0].icon
      }))
    : defaultBenefits;

  return (
    <section id="benefits" className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Heading matching Screenshot 2 */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title || `The benefits of taking a course at ${instituteName}`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2">
            {subtitle || 'হাতে-কলমে প্র্যাকটিক্যাল ল্যাব, রিয়েল প্রজেক্ট এবং লাইফটাইম ক্যারিয়ার মেন্টরশিপের নিশ্চয়তা'}
          </p>
        </div>

        {/* 8-Card Grid (4 cols on lg, 2 cols on mobile/tablet) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 lg:gap-12 max-w-6xl mx-auto">
          {displayedBenefits.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center group cursor-pointer p-4 rounded-2xl hover:bg-slate-50/80 transition-colors"
            >
              {item.icon}
              <h3 className="mt-4 text-sm sm:text-base font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
                {item.bengaliSubtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
