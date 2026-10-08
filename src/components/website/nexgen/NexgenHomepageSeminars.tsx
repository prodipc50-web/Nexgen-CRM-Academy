import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, ArrowRight, Video } from 'lucide-react';
import { SeminarWorkshop } from '../../../types';
import { OptimizedLazyImage } from '../../common/OptimizedLazyImage';

interface NexgenHomepageSeminarsProps {
  seminars: SeminarWorkshop[];
  onOpenSeminarReg: (seminar: SeminarWorkshop) => void;
  onViewAllSeminars: () => void;
}

export const NexgenHomepageSeminars: React.FC<NexgenHomepageSeminarsProps> = ({
  seminars,
  onOpenSeminarReg,
  onViewAllSeminars
}) => {
  // If no seminars are passed, generate high-converting default upcoming seminars matching SeminarWorkshop type
  const defaultSeminars: SeminarWorkshop[] = [
    {
      id: 'sem-1',
      title: 'ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট ও ফ্রিল্যান্সিং ক্যারিয়ার গাইডলাইন',
      description: 'ওয়েব ইন্ডাস্ট্রিতে ফ্রন্টএন্ড থেকে ব্যাকএন্ড ডেভেলপার হিসেবে কীভাবে ক্যারিয়ার গড়বেন এবং আপওয়ার্ক/ফাইভারে বিদেশি ক্লায়েন্ট হ্যান্ডেল করবেন তার পূর্ণাঙ্গ রূপরেখা।',
      date: '২০২৬-১০-১০',
      time: 'বিকাল ০৪:০০ টা - ০৫:৩০ টা',
      venueType: 'Lab / On-Campus',
      roomOrPlatform: 'ফার্মগেট ক্যাম্পাস ল্যাব (অফলাইন)',
      speakerName: 'ইঞ্জিনিয়ার তানভীর হাসান',
      speakerDesignation: 'Senior Full Stack Consultant',
      category: 'Web Development',
      status: 'Upcoming',
      capacity: 40,
      registeredCount: 32,
      attendedCount: 0,
      isFree: true,
      bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'sem-2',
      title: 'UI/UX ডিজাইন ও আন্তর্জাতিক মার্কেটপ্লেস মাস্টারক্লাস',
      description: 'ফিগমা দিয়ে আন্তর্জাতিক মানের ইউআই ডিজাইন ও বিহ্যান্স পোর্টফোলিও তৈরি করে ঘরে বসে ডলার উপার্জনের গোপন ট্রিকস ও প্রজেক্ট গাইডলাইন।',
      date: '২০২৬-১০-১২',
      time: 'রাত ০৮:০০ টা - ০৯:৩০ টা',
      venueType: 'Online Zoom',
      roomOrPlatform: 'অনলাইন জুম লাইভ',
      speakerName: 'আরিফ মাহমুদ',
      speakerDesignation: 'Product Designer & Top Rated Freelancer',
      category: 'UI/UX Design',
      status: 'Upcoming',
      capacity: 100,
      registeredCount: 78,
      attendedCount: 0,
      isFree: true,
      bannerUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'sem-3',
      title: 'ডিজিটাল মার্কেটিং, এসইও ও এআই অটোমেশন সেমিনার',
      description: 'সোশ্যাল মিডিয়া পেইড ক্যাম্পেইন, গুগল এসইও এবং এআই টুলস ব্যবহার করে লোকাল ও গ্লোবাল ক্লায়েন্টের জন্য সেলস জেনারেট করার টেকনিক।',
      date: '২০২৬-১০-১৪',
      time: 'বিকাল ০৫:০০ টা - ০৬:৩০ টা',
      venueType: 'Lab / On-Campus',
      roomOrPlatform: 'ফার্মগেট ক্যাম্পাস ল্যাব',
      speakerName: 'ফারহান আহমেদ',
      speakerDesignation: 'Digital Marketing Strategist',
      category: 'Digital Marketing',
      status: 'Upcoming',
      capacity: 50,
      registeredCount: 41,
      attendedCount: 0,
      isFree: true,
      bannerUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const displaySeminars = (seminars && seminars.length > 0 ? seminars : defaultSeminars).slice(0, 3);

  return (
    <section id="free-seminars" className="py-16 sm:py-20 bg-gradient-to-b from-white via-indigo-50/20 to-white border-b border-slate-100 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>১০০% ফ্রি সেশন • Free Career Seminars</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            আসন্ন ফ্রি সেমিনার ও ক্যারিয়ার গাইডলাইন
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            কোর্সে ভর্তির আগেই সরাসরি অভিজ্ঞ মেন্টরদের সাথে কথা বলুন, ক্যারিয়ার রোডম্যাপ জানুন এবং আপনার জন্য উপযুক্ত স্কিলটি বেছে নিন সম্পূর্ণ বিনামূল্যে।
          </p>
        </div>

        {/* Seminars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySeminars.map((sem, idx) => {
            const seatsLeft = Math.max(1, (sem.capacity || 50) - (sem.registeredCount || 0));
            const isOnline = sem.venueType?.toLowerCase().includes('online') || sem.venueType?.toLowerCase().includes('zoom');

            return (
              <div
                key={sem.id || idx}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Banner */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                  <OptimizedLazyImage
                    src={sem.bannerUrl || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'}
                    alt={sem.title}
                    width={640}
                    height={360}
                    aspectRatio="16/9"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    fallbackSrc="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Mode Badge */}
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shadow-xs ${
                        isOnline
                          ? 'bg-indigo-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isOnline ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      <span>{isOnline ? 'অনলাইন জুম' : 'ফার্মগেট ল্যাব'}</span>
                    </span>
                  </div>

                  {/* Scarcity Seat Counter */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-bold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
                      <span>{seatsLeft}টি আসন বাকি</span>
                    </span>
                  </div>

                  {/* Date Badge on Image Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{sem.date}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{sem.time}</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {sem.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-normal">
                      {sem.description || 'সরাসরি ক্যারিয়ার কাউন্সেলিং ও মেন্টরদের সাথে প্রশ্নোত্তরের ফ্রি সেশনে অংশ নিন।'}
                    </p>
                  </div>

                  {/* Speaker Info */}
                  {sem.speakerName && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {sem.speakerName.slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{sem.speakerName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{sem.speakerDesignation || 'Industry Mentor'}</p>
                      </div>
                    </div>
                  )}

                  {/* CTA Register Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => onOpenSeminarReg(sem)}
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                      <span>ফ্রি সিট বুক করুন (Register Free)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Seminars Button */}
        <div className="text-center pt-8 sm:pt-10">
          <button
            type="button"
            onClick={onViewAllSeminars}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <span>সবগুলো ফ্রি সেমিনার শিডিউল দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
