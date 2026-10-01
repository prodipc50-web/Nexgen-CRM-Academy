import React, { useState } from 'react';
import {
  Play,
  Award,
  Sparkles,
  TrendingUp,
  DollarSign,
  Star,
  ExternalLink,
  Briefcase,
  Users,
  CheckCircle2
} from 'lucide-react';
import { StudentSuccessStory, WebsiteReview } from '../../../types';
import { SubPageBanner } from './SubPageBanner';
import { StudentSuccessVideoModal } from '../StudentSuccessVideoModal';

interface SuccessStorySubPageProps {
  stories?: StudentSuccessStory[];
  reviews?: WebsiteReview[];
  onOpenAdmission: () => void;
  onBackToHome: () => void;
}

export const SuccessStorySubPage: React.FC<SuccessStorySubPageProps> = ({
  stories: propStories,
  reviews = [],
  onOpenAdmission,
  onBackToHome
}) => {
  const [selectedStory, setSelectedStory] = useState<StudentSuccessStory | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Graphic Design' | 'Web Development' | 'Digital Marketing' | 'Video Editing'>('All');

  const defaultStories: StudentSuccessStory[] = [
    {
      id: 'story-1',
      studentName: 'রাকিবুল হাসান (Rakibul Hasan)',
      courseName: 'Full Stack MERN Web Development',
      companyOrPlatform: 'Upwork Top Rated & SoftBD',
      monthlyIncomeOrPackage: '$2,800/month (৳৩,৩০,০০০+)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoThumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      storySummary: 'নন-সিএসই ব্যাকগ্রাউন্ড থেকে ৬ মাসের প্র্যাকটিক্যাল ল্যাব ট্রেনিং শেষে আপওয়ার্কে টপ রেটেড ফ্রিল্যান্সার হয়েছেন এবং রিমোট ইউএস এজেন্সিতে সফটওয়্যার ইঞ্জিনিয়ার হিসেবে কর্মরত।',
      quote: 'নেক্সজেন একাডেমির হ্যান্ডস-অন ল্যাব প্রজেক্ট আর সার্বক্ষণিক মেন্টর সাপোর্ট ছাড়া এত দ্রুত ইন্টারন্যাশনাল ক্লায়েন্ট পাওয়া সম্ভব ছিল না।',
      batchNo: 'Batch 14',
      achievementBadge: '🏆 Top Rated Upwork Freelancer',
      clientCountry: 'United States',
      isActive: true
    },
    {
      id: 'story-2',
      studentName: 'তানজিলা আক্তার (Tanjila Akter)',
      courseName: 'Professional Graphic Design with AI',
      companyOrPlatform: 'Fiverr Level 2 Seller',
      monthlyIncomeOrPackage: '$1,500/month (৳১,৮০,০০০+)',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoThumbnailUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80',
      storySummary: 'গৃহিণী থেকে স্বাবলম্বী ফ্রিল্যান্সার। এডোবি ফটোশপ ও ইলাস্ট্রেটরে ব্র্যান্ড আইডেন্টিটি ডিজাইন ও প্যাকেজিং ডিজাইনে আন্তর্জাতিক ২০০+ প্রজেক্ট ডেলিভারি করেছেন।',
      quote: 'ঘরে বসেই নিজের পড়াশোনা ও সংসারের পাশাপাশি আজ আমি স্বাধীনভাবে উপার্জন করছি। মেন্টরদের প্রতি আমি আজীবন কৃতজ্ঞ।',
      batchNo: 'Batch 21',
      achievementBadge: '⭐ Fiverr Level 2 Seller',
      clientCountry: 'United Kingdom',
      isActive: true
    },
    {
      id: 'story-3',
      studentName: 'মেহরাব হোসেন (Mehrab Hossain)',
      courseName: 'Digital Marketing & Growth Hacking',
      companyOrPlatform: 'Brain Station 23 (Digital Wing)',
      monthlyIncomeOrPackage: '৳৭৫,০০০/মাস (Corporate Full-Time)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoThumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      storySummary: 'মেটা অ্যাডস, গুগল অ্যানালিটিক্স ও এসইও এক্সপার্ট হিসেবে কোর্স সমাপনী প্রেজেন্টেশনে সেরা পারফর্ম করে সরাসরি শীর্ষ সফটওয়্যার কোম্পানিতে চাকরি পেয়েছেন।',
      quote: 'এখানে শুধু থিওরি না, সরাসরি ক্লায়েন্টের লাইভ অ্যাড অ্যাকাউন্ট ম্যানেজ করে শিখানো হয় যা ইন্টারভিউতে অনেক কাজে লেগেছে।',
      batchNo: 'Batch 18',
      achievementBadge: '💼 Corporate IT Placement',
      clientCountry: 'Bangladesh',
      isActive: true
    },
    {
      id: 'story-4',
      studentName: 'ইশতিয়াক আহমেদ (Ishtiaq Ahmed)',
      courseName: 'Professional Video Editing & Motion Graphics',
      companyOrPlatform: 'YouTube Channel Network & Kwork',
      monthlyIncomeOrPackage: '$1,900/month (৳২,২০,০০০+)',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoThumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
      storySummary: 'প্রিমিয়ার প্রো ও আফটার ইফেক্টসে প্রফেশনাল শর্টস, পডকাস্ট এডিটিং ও কালার গ্রেডিং শিখে আন্তর্জাতিক কন্টেন্ট ক্রিয়েটরদের জন্য ভিডিও এডিট করছেন।',
      quote: 'হাই-কনফিগ ল্যাব ও অভিজ্ঞ টিচারের সরাসরি গাইডলাইনের কারণে ২ মাসের মধ্যেই পেইড ক্লায়েন্ট পেয়ে যাই।',
      batchNo: 'Batch 25',
      achievementBadge: '🎬 Top Video Editor',
      clientCountry: 'Canada',
      isActive: true
    }
  ];

  const stories = propStories && propStories.length > 0 ? propStories : defaultStories;

  const filteredStories = stories.filter(s => {
    if (activeFilter === 'All') return true;
    return s.courseName?.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SubPageBanner
        title="Student Success Stories & Freelance Milestones (সফলতার গল্প)"
        subtitle="আমাদের শিক্ষার্থীদের আন্তর্জাতিক মার্কেটপ্লেস ও দেশীয় শীর্ষ প্রতিষ্ঠানে সফল ক্যারিয়ার গড়ার বাস্তব গল্প ও ভিডিও সাক্ষাৎকার।"
        badge="বাস্তব সফলতার প্রমাণ"
        breadcrumbs={[{ label: 'সফলতার গল্প (Success Stories)', active: true }]}
        onBackToHome={onBackToHome}
        actionButton={
          <button
            type="button"
            onClick={onOpenAdmission}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            আপনিও শুরু করুন
          </button>
        }
      />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 space-y-10">
        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 block">$350K+</span>
            <span className="text-xs font-bold text-slate-800 block">Total Alumni Earnings</span>
            <span className="text-[10px] text-slate-500">মার্কেটপ্লেস উপার্জন</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">9,000+</span>
            <span className="text-xs font-bold text-slate-800 block">Successful Freelancers</span>
            <span className="text-[10px] text-slate-500">সফল ফ্রিল্যান্সার</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 block">2,500+</span>
            <span className="text-xs font-bold text-slate-800 block">Corporate Job Holders</span>
            <span className="text-[10px] text-slate-500">চাকরিপ্রাপ্ত গ্র্যাজুয়েট</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-500 block">96.4%</span>
            <span className="text-xs font-bold text-slate-800 block">Course Success Rate</span>
            <span className="text-[10px] text-slate-500">সফলতার অনুপাত</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {(['All', 'Graphic Design', 'Web Development', 'Digital Marketing', 'Video Editing'] as const).map(filter => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredStories.map(story => (
            <div
              key={story.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Video Thumbnail */}
              <div
                className="relative aspect-video bg-slate-950 cursor-pointer overflow-hidden group/video"
                onClick={() => setSelectedStory(story)}
              >
                <img
                  src={story.videoThumbnailUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'}
                  alt={story.studentName}
                  className="w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-300 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Big Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl group-hover/video:scale-110 transition-transform">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Monthly Income Pill */}
                <div className="absolute bottom-3 left-3 bg-emerald-600/95 text-white px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{story.monthlyIncomeOrPackage}</span>
                </div>

                {/* Achievement Badge */}
                {story.achievementBadge && (
                  <div className="absolute top-3 right-3 bg-white/95 text-slate-900 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-md">
                    {story.achievementBadge}
                  </div>
                )}
              </div>

              {/* Story Details */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {story.studentName}
                      </h3>
                      <p className="text-xs font-bold text-indigo-600 mt-0.5">
                        {story.courseName}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                      {story.batchNo || 'Alumni'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {story.storySummary}
                  </p>

                  {story.quote && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs italic text-slate-700">
                      "{story.quote}"
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Platform: <strong className="text-indigo-700">{story.companyOrPlatform}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedStory(story)}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-rose-600" />
                    <span>ইন্টারভিউ ভিডিও দেখুন</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        {selectedStory && (
          <StudentSuccessVideoModal
            isOpen={!!selectedStory}
            onClose={() => setSelectedStory(null)}
            story={selectedStory}
          />
        )}
      </div>
    </div>
  );
};
