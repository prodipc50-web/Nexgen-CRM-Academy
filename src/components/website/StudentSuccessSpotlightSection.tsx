import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Award,
  Sparkles,
  TrendingUp,
  DollarSign,
  Star,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { StudentSuccessStory, StudentSuccessVideoModal } from './StudentSuccessVideoModal';

interface StudentSuccessSpotlightSectionProps {
  onSelectCourseForAdmission?: (courseName: string) => void;
}

export const defaultStudentStories: StudentSuccessStory[] = [
  {
    id: 'story-1',
    studentName: 'তানভীর হাসান',
    courseName: 'MERN Stack Web Development',
    companyOrPlatform: 'Brain Station 23 • Junior Software Engineer',
    monthlyIncomeOrPackage: '৳৫৫,০০০/মাস',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    storySummary: 'নন-সিএসই ব্যাকগ্রাউন্ড থেকে এসে নেক্সজেন কম্পিউটার একাডেমির প্রজেক্ট-ভিত্তিক মেন্টরশিপের মাধ্যমে ৬ মাসে ৫টি ফুল-স্ট্যাক প্রজেক্ট তৈরি করে সরাসরি ব্রেইন স্টেশন ২৩-এ চাকরি পান।',
    quote: 'নেক্সজেনের সরাসরি ল্যাব সাপোর্ট ও শিক্ষকদের আন্তরিক গাইডলাইন ছাড়া এত দ্রুত ইন্ডাস্ট্রিতে ক্যারিয়ার শুরু করা সম্ভব ছিল না।',
    batchNo: 'Batch WEB-2402',
    achievementBadge: '🏆 Full-Time Placement'
  },
  {
    id: 'story-2',
    studentName: 'ফারজানা আক্তার তিশা',
    courseName: 'Graphic Design & Freelancing',
    companyOrPlatform: 'Fiverr Level 2 Seller • Top Rated',
    monthlyIncomeOrPackage: '$১,৪০০+ (৳১,৬৫,০০০+/মাস)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    storySummary: 'গৃহিণী হিসেবে ঘরে বসেই গ্রাফিক ডিজাইন ও লোগো ব্র্যান্ডিং কোর্স সম্পন্ন করে ফাইভার মার্কেটপ্লেসে এখন পর্যন্ত ৩০০+ আন্তর্জাতিক ক্লায়েন্টের কাজ সম্পন্ন করেছেন।',
    quote: 'মহিলাদের জন্য ঘরে বসে সম্মানের সাথে স্বাবলম্বী হওয়ার সবচেয়ে বিশ্বস্ত প্রতিষ্ঠান নেক্সজেন।',
    batchNo: 'Batch GDF-2311',
    achievementBadge: '⭐ Freelance Rockstar'
  },
  {
    id: 'story-3',
    studentName: 'মেহেদী হাসান সাকিব',
    courseName: 'Professional Video Editing & Motion Graphics',
    companyOrPlatform: 'YouTube Content Agency (USA) • Remote Editor',
    monthlyIncomeOrPackage: '$৮৫০+/মাস (৳১,০০,০০০+)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    storySummary: 'প্রিমিয়ার প্রো ও আফটার ইফেক্টসের অ্যাডভান্সড টেকনিক শিখে আমেরিকান ক্রিয়েটর চ্যানেলের ফুল-টাইম রিমোট ভিডিও এডিটর হিসেবে নিযুক্ত হন।',
    quote: 'ফার্মগেটের হাই-কনফিগ পিসি ল্যাব থাকায় প্র্যাকটিস করাটা অনেক সহজ হয়েছিল।',
    batchNo: 'Batch VDM-2401',
    achievementBadge: '🎬 Remote Global Work'
  },
  {
    id: 'story-4',
    studentName: 'আরিফুল ইসলাম',
    courseName: 'Digital Marketing & AI Growth Hacking',
    companyOrPlatform: 'Pathao • Associate Marketing Specialist',
    monthlyIncomeOrPackage: '৳৪৮,০০০/মাস',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    storySummary: 'মেটা অ্যাডস, গুগল ক্যাম্পেইন ও কনভার্সন অপটিমাইজেশন শিখে দেশের শীর্ষ রাইড-শেয়ারিং ও লজিস্টিক প্রতিষ্ঠান পাঠাও-এ ক্যারিয়ার গড়ে তোলেন।',
    quote: 'এখানে শুধু থিওরি না, লাইভ ক্যাম্পেইনে প্র্যাক্টিক্যাল বাজেট দিয়ে কাজ শেখানো হয়।',
    batchNo: 'Batch DM-2403',
    achievementBadge: '💼 Corporate Hire'
  }
];

export const StudentSuccessSpotlightSection: React.FC<StudentSuccessSpotlightSectionProps> = ({
  onSelectCourseForAdmission
}) => {
  const [selectedStory, setSelectedStory] = useState<StudentSuccessStory | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Freelance' | 'Job'>('All');

  const filteredStories = defaultStudentStories.filter((s) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Freelance') return s.companyOrPlatform.includes('Fiverr') || s.companyOrPlatform.includes('Upwork') || s.companyOrPlatform.includes('USA');
    if (activeFilter === 'Job') return !s.companyOrPlatform.includes('Fiverr') && !s.companyOrPlatform.includes('Upwork');
    return true;
  });

  return (
    <section id="success-stories" className="py-16 sm:py-20 bg-white text-slate-900 relative overflow-hidden border-t border-slate-200">
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>প্রমাণিত সফলতার প্রমাণ ও স্টুডেন্ট ইন্টারভিউ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              আমাদের সফল গ্র্যাজুয়েটদের রিয়েল ইনকাম ও ক্যারিয়ার স্টোরি
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              দেখুন কীভাবে নেক্সজেনের শূন্য থেকে শুরু করা শিক্ষার্থীরা আজ দেশ-বিদেশের মার্কেটপ্লেস ও টপ কোম্পানিতে সফল ক্যারিয়ার গড়েছেন।
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveFilter('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'All'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              সকল গল্প ({defaultStudentStories.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('Freelance')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'Freelance'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              গ্লোবাল ফ্রিল্যান্সার
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('Job')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'Job'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              কর্পোরেট আইটি জব
            </button>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => setSelectedStory(story)}
              className="bg-slate-50/80 hover:bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1 relative"
            >
              {/* Thumbnail / Video Play Trigger */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={story.avatarUrl}
                  alt={story.studentName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Top Badge */}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 border border-slate-200 text-[10px] font-black uppercase shadow-xs">
                  {story.achievementBadge || 'Verified Story'}
                </span>

                {/* Income Badge */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xs border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                  <span className="text-[10px] text-slate-600 font-medium">মাসিক আয়:</span>
                  <span className="font-black text-emerald-600 font-mono">{story.monthlyIncomeOrPackage}</span>
                </div>
              </div>

              {/* Story Content */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm sm:text-base text-slate-950 group-hover:text-indigo-600 transition-colors">
                    {story.studentName}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">{story.batchNo}</span>
                </div>

                <p className="text-xs font-bold text-indigo-600 line-clamp-1">
                  {story.courseName}
                </p>

                <p className="text-[11px] text-slate-600 font-medium line-clamp-1 flex items-center space-x-1">
                  <Briefcase className="w-3 h-3 text-amber-500 shrink-0 inline mr-1" />
                  <span>{story.companyOrPlatform}</span>
                </p>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1 italic">
                  "{story.quote}"
                </p>
              </div>

              {/* Card Footer CTA */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-indigo-600 font-bold group-hover:underline flex items-center space-x-1">
                  <span>ভিডিও ইন্টারভিউ দেখুন</span>
                  <Play className="w-3 h-3 fill-indigo-600" />
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Nexgen Alumni</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <StudentSuccessVideoModal
        isOpen={Boolean(selectedStory)}
        onClose={() => setSelectedStory(null)}
        story={selectedStory}
        onSelectCourseForAdmission={(cName) => {
          onSelectCourseForAdmission?.(cName);
        }}
      />
    </section>
  );
};
