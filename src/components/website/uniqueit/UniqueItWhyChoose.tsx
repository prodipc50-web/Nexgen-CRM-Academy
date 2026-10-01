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
  Building2
} from 'lucide-react';

export const UniqueItWhyChoose: React.FC = () => {
  const points = [
    {
      id: '1',
      title: 'অ্যাফোর্ডেবল প্রাইসে বেস্ট লার্নিং',
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
      title: 'প্রতিটি কোর্সের সাথে পাবেন এক্সক্লুসিভ সাপোর্ট সেশন',
      icon: Headphones,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      id: '6',
      title: 'প্রজেক্ট করার মাধ্যমে স্পেশাল প্রজেক্ট ডে',
      icon: Sparkles,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200'
    },
    {
      id: '7',
      title: 'কোর্স শেষে থাকছে ভেরিফায়েবল সার্টিফিকেট',
      icon: Award,
      color: 'bg-pink-50 text-pink-600 border-pink-200'
    },
    {
      id: '8',
      title: 'ক্যারিয়ারে দ্রুত গ্রোথ করার জন্য রয়েছে জব প্রিপারেশন সাপোর্ট',
      icon: Briefcase,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      id: '9',
      title: '৫০+ পার্টনার কোম্পানিতে জব প্লেসমেন্ট সুযোগ',
      icon: Building2,
      color: 'bg-teal-50 text-teal-600 border-teal-200'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Why Choose <span className="text-[#6b1cb0]">Unique IT?</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Unique IT Institute is not your typical training centre and we have never tried to be. We are a complete career-building platform — one that takes you from your very first skill all the way to your first job, your first client, and your first real breakthrough in the IT industry.
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
