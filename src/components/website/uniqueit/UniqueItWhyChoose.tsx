import React from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  Laptop,
  Headphones,
  Sparkles,
  Award,
  Briefcase,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { WhyChooseCmsConfig } from '../../../types';

interface UniqueItWhyChooseProps {
  config?: WhyChooseCmsConfig;
}

export const UniqueItWhyChoose: React.FC<UniqueItWhyChooseProps> = ({ config }) => {
  const defaultPoints = [
    {
      id: '1',
      title: '১ শিক্ষার্থী ১টি কম্পিউটার (ব্যক্তিগত পিসি বরাদ্দ)',
      icon: GraduationCap,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      id: '2',
      title: 'লাইভ এবং স্পেশাল ইন্ডাস্ট্রি বেস্ট মেন্টর প্যানেলের সাথে ওয়ার্কশপ',
      icon: Users,
      color: 'bg-rose-50 text-rose-600 border-rose-200'
    },
    {
      id: '3',
      title: 'ইন্ডাস্ট্রি ফোকাসড আউটলাইন সাজানো প্রতিটি কোর্সের কারিকুলাম',
      icon: BookOpen,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      id: '4',
      title: 'ইন্ডাস্ট্রি স্ট্যান্ডার্ড প্রজেক্ট, সুপ্রিম অ্যাসাইনমেন্ট',
      icon: Laptop,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      id: '5',
      title: 'প্রতিটি কোর্সের সাথে পাবেন লাইফটাইম এক্সক্লুসিভ সাপোর্ট সেশন',
      icon: Headphones,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      id: '6',
      title: 'প্রজেক্ট করার মাধ্যমে স্পেশাল প্রজেক্ট ডে ও পোর্টফোলিও রিভিউ',
      icon: Sparkles,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200'
    },
    {
      id: '7',
      title: 'কোর্স শেষে থাকছে অনলাইন ভেরিফায়েবল সার্টিফিকেট',
      icon: Award,
      color: 'bg-pink-50 text-pink-600 border-pink-200'
    },
    {
      id: '8',
      title: 'মার্কেটপ্লেস আর্নিং গাইডলাইন ও জব প্রিপারেশন সাপোর্ট',
      icon: Briefcase,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      id: '9',
      title: '৫০+ পার্টনার কোম্পানিতে সিভি ফরোয়ার্ডিং ও ইন্টার্নশিপ সুযোগ',
      icon: Building2,
      color: 'bg-teal-50 text-teal-600 border-teal-200'
    }
  ];

  const colorCycle = [
    'bg-amber-50 text-amber-600 border-amber-200',
    'bg-rose-50 text-rose-600 border-rose-200',
    'bg-indigo-50 text-indigo-600 border-indigo-200',
    'bg-emerald-50 text-emerald-600 border-emerald-200',
    'bg-purple-50 text-purple-600 border-purple-200',
    'bg-cyan-50 text-cyan-600 border-cyan-200',
    'bg-pink-50 text-pink-600 border-pink-200',
    'bg-blue-50 text-blue-600 border-blue-200',
    'bg-teal-50 text-teal-600 border-teal-200'
  ];

  const heading = config?.heading || 'Why Choose NexGen Academy?';
  const description =
    config?.description ||
    'NexGen Computer Academy is not your typical training centre and we have never tried to be. We are a complete career-building platform — one that takes you from your very first skill all the way to your first job, your first client, and your first real breakthrough in the IT industry.';

  const points =
    config?.points && config.points.length > 0
      ? config.points.map((pt, i) => ({
          id: pt.id || `pt-${i}`,
          title: pt.title,
          icon: CheckCircle2,
          color: pt.color || colorCycle[i % colorCycle.length]
        }))
      : defaultPoints;

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {heading.includes('NexGen') ? (
              <>
                {heading.split('NexGen')[0]}
                <span className="text-[#6b1cb0]">NexGen</span>
                {heading.split('NexGen')[1]}
              </>
            ) : (
              heading
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* 9 Bangla Pill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {points.map((pt) => {
            const IconComp = pt.icon;
            return (
              <div
                key={pt.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#faf8ff] hover:bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all flex items-center space-x-3.5 group cursor-default"
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${pt.color}`}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug group-hover:text-purple-900 transition-colors">
                  {pt.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
