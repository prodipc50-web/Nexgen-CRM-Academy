import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  Users,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Search,
  X
} from 'lucide-react';
import { TrainerProfile } from '../../../types';
import { SubPageBanner } from './SubPageBanner';

interface MentorsSubPageProps {
  trainers: TrainerProfile[];
  onOpenCounseling: () => void;
  onBackToHome: () => void;
}

export const MentorsSubPage: React.FC<MentorsSubPageProps> = ({
  trainers = [],
  onOpenCounseling,
  onBackToHome
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const activeTrainers = trainers.filter(t => t.isActive !== false);

  const filteredTrainers = activeTrainers.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchName = t.name.toLowerCase().includes(q);
    const matchDesig = t.designation.toLowerCase().includes(q);
    const matchCompany = (t.companyOrOrg || '').toLowerCase().includes(q);
    const matchSkills = (t.skills || []).some(s => s.toLowerCase().includes(q));
    return matchName || matchDesig || matchCompany || matchSkills;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SubPageBanner
        title="Meet Our Industry Expert Mentors (মেন্টরস প্যানেল)"
        subtitle="শীর্ষস্থানীয় আইটি কোম্পানি ও আন্তর্জাতিক মার্কেটপ্লেসে সফল সিনিয়র প্র্যাকটিশনারদের সরাসরি তত্ত্বাবধানে শিখুন।"
        badge="টপ ইন্ডাস্ট্রি প্র্যাকটিশনার"
        breadcrumbs={[{ label: 'আমাদের মেন্টরস (Our Mentors)', active: true }]}
        onBackToHome={onBackToHome}
        actionButton={
          <button
            type="button"
            onClick={onOpenCounseling}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            ফ্রি কাউন্সেলিং সেশন নিন
          </button>
        }
      />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 space-y-10">
        {/* Mentor Panel Strengths */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">বাস্তব ইন্ডাস্ট্রি অভিজ্ঞতা</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              মেন্টরদের গড় অভিজ্ঞতা ৫ থেকে ১০+ বছর। তারা সরাসরি মার্কেটপ্লেস ও দেশীয় সফটওয়্যার ফার্মে লিড পদে কর্মরত।
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">১ জন শিক্ষার্থী ১টি পিসি সাপোর্ট</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ল্যাব ক্লাসে প্রতিটি শিক্ষার্থীর স্ক্রিন মনিটরিং এবং যেকোনো বাগ বা কোড এরর তাৎক্ষণিক সলভ করে দেওয়া হয়।
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">পোর্টফোলিও ও জব রেফারেন্স</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              বিহ্যান্স, ড্রিবল, গিটহাব ও সিভি রেডি করে বিভিন্ন সফটওয়্যার এজেন্সিতে সরাসরি ইন্টারভিউয়ের জন্য রেফারেন্স প্রদান।
            </p>
          </div>
        </div>

        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="space-y-0.5">
            <h2 className="text-base font-black text-slate-900">
              মেন্টরস তালিকা ({filteredTrainers.length})
            </h2>
            <p className="text-xs text-slate-500">বিশেষজ্ঞ মেন্টরের প্রোফাইল ও দক্ষতা দেখুন</p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-auto sm:min-w-[260px]">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentor by name, skill..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 text-xs px-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTrainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-5 shadow-2xs hover:shadow-xl hover:border-indigo-200 transition-all group"
            >
              <div className="space-y-4">
                {/* Avatar & Title */}
                <div className="flex items-center space-x-4">
                  <img
                    src={trainer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                    alt={trainer.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-2xs group-hover:scale-105 transition-transform shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {trainer.name}
                    </h3>
                    <p className="text-xs font-bold text-indigo-600 line-clamp-1">
                      {trainer.designation}
                    </p>
                    <span className="inline-flex items-center text-[10px] text-slate-500 font-semibold mt-0.5">
                      <Award className="w-3 h-3 text-amber-500 mr-1 shrink-0" />
                      {trainer.experienceYears}+ Years Experience
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {trainer.shortBio}
                </p>

                {/* Skills Badges */}
                {trainer.skills && trainer.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {trainer.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Organization & Socials */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 truncate max-w-[140px]">
                  {trainer.companyOrOrg || 'Unique IT Institute'}
                </span>
                <div className="flex items-center space-x-1.5">
                  {trainer.socialLinks?.linkedin && (
                    <a
                      href={trainer.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-colors text-xs font-bold"
                      title="LinkedIn"
                    >
                      in
                    </a>
                  )}
                  {trainer.socialLinks?.github && (
                    <a
                      href={trainer.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                      title="GitHub"
                    >
                      gh
                    </a>
                  )}
                  {trainer.socialLinks?.facebook && (
                    <a
                      href={trainer.socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors text-xs font-bold"
                      title="Facebook"
                    >
                      f
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
