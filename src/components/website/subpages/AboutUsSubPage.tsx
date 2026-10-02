import React from 'react';
import {
  Building,
  Target,
  Eye,
  CheckCircle2,
  Award,
  Monitor,
  ShieldCheck,
  Users,
  Compass,
  Zap,
  Globe
} from 'lucide-react';
import { WebsiteCmsConfig, AcademySettings } from '../../../types';
import { SubPageBanner } from './SubPageBanner';

interface AboutUsSubPageProps {
  aboutUs?: WebsiteCmsConfig['aboutUs'];
  academySettings: AcademySettings;
  websiteCmsConfig?: WebsiteCmsConfig;
  onOpenAdmission: () => void;
  onBackToHome: () => void;
}

export const AboutUsSubPage: React.FC<AboutUsSubPageProps> = ({
  aboutUs,
  academySettings,
  websiteCmsConfig,
  onOpenAdmission,
  onBackToHome
}) => {
  const defaultAbout = {
    establishedYear: '2014',
    storyTitle: 'Bridging the Gap Between Beginners and IT Professionals for over 12+ Years',
    storyDescription: 'NexGen Computer Academy was established with a singular vision: to empower young minds and non-tech individuals with high-income digital skills and practical industry mentorship. Over the last decade, we have transformed more than 25,000+ students into skilled professionals, top-rated global freelancers, and corporate IT executives across 35+ partner enterprises.',
    mission: 'To deliver affordable, project-centered, high-standard IT and freelancing education that builds sustainable careers and creates self-reliant digital entrepreneurs.',
    vision: 'To become Bangladesh’s premier technology academy and skill empowerment hub, recognized globally for excellence in creative design, software engineering, and digital marketing.',
    directorName: 'Engr. Mohammad Jahangir Alam',
    directorTitle: 'Founder & Managing Director',
    directorPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    directorMessage: 'আমাদের লক্ষ্য শুধুমাত্র সিলেবাস শেষ করা নয়; ক্লাসরুম থেকেই বাস্তব প্রজেক্ট ও ক্লায়েন্ট কমিউনিকেশন শিখিয়ে একজন শিক্ষার্থীকে মার্কেটপ্লেস ও চাকরিবাজারে স্বাবলম্বী করা। সততা, নিষ্ঠা ও আধুনিক প্রযুক্তির সমন্বয়ে আমাদের প্রতিটি ল্যাব সাজানো হয়েছে।',
    affiliations: [
      'Govt. Standard IT Curriculum (BTEB)',
      'ISO 9001:2015 Quality Certified Institution',
      'Member of National Skills Development Authority (NSDA)',
      'Corporate Hiring Partner with 35+ Software & Media Houses'
    ],
    facilityHighlights: [
      { title: '১ শিক্ষার্থী ১টি কম্পিউটার', desc: 'ক্লাসের প্রতিটি সেশনে ব্যক্তিগত হাই-কনফিগ পিসি বরাদ্দ' },
      { title: 'উচ্চগতির ব্রডব্যান্ড ও ব্যাকআপ', desc: 'নিরবচ্ছিন্ন ইন্টারকানেক্টিভিটি ও ফুল পাওয়ার ব্যাকআপ' },
      { title: 'সার্বক্ষণিক শিক্ষক মেন্টরিং', desc: 'ক্লাস চলাকালীন ও ক্লাস শেষে প্র্যাকটিস ল্যাবে হাতে-কলমে সমাধান' },
      { title: 'স্মার্ট মাল্টিমিডিয়া প্রজেক্টর', desc: 'বিশাল স্ক্রিনে লাইভ কোডিং ও ডিজাইন টিউটোরিয়াল প্রদর্শনী' }
    ]
  };

  const about = {
    ...defaultAbout,
    ...(aboutUs || {})
  };

  const instituteName = academySettings.instituteName || 'NexGen Computer Academy';

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SubPageBanner
        title={`About ${instituteName} (আমাদের সম্পর্কে)`}
        subtitle={`এক দশকেরও বেশি সময় ধরে দক্ষ আইটি প্রফেশনাল ও সফল ফ্রিল্যান্সার গড়ার নির্ভরযোগ্য প্রতিষ্ঠান।`}
        badge={`Estd. ${about.establishedYear}`}
        breadcrumbs={[{ label: 'আমাদের সম্পর্কে (About Us)', active: true }]}
        onBackToHome={onBackToHome}
        actionButton={
          <button
            type="button"
            onClick={onOpenAdmission}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            ভর্তি আবেদন করুন
          </button>
        }
      />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 space-y-12">
        {/* Story & Leadership Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Story, Mission & Vision */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                <Building className="w-3.5 h-3.5" />
                <span>Our Heritage • Estd. {about.establishedYear}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                {about.storyTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {about.storyDescription}
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">আমাদের মিশন (Mission)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{about.mission}</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">আমাদের ভিশন (Vision)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{about.vision}</p>
              </div>
            </div>

            {/* Core Values */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>আমাদের মূল মূল্যবোধ ও প্রতিশ্রুতি</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>১০০% প্র্যাকটিক্যাল ল্যাব ও রিয়েল ক্লায়েন্ট কাজ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>কোর্স শেষে আজীবন ফ্রি ল্যাব অ্যাক্সেস ও সাপোর্ট</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>মার্কেটপ্লেস একাউন্ট সেটআপ ও বিডিং গাইডলাইন</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>৩৫+ পার্টনার কোম্পানিতে জব প্লেসমেন্ট সুবিধা</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Managing Director Card & Affiliations */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={about.directorPhotoUrl}
                alt={about.directorName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm shrink-0"
              />
              <div>
                <h4 className="font-black text-slate-950 text-base sm:text-lg">{about.directorName}</h4>
                <p className="text-xs text-indigo-600 font-bold">{about.directorTitle}</p>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{instituteName}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed text-slate-700 italic">
              "{about.directorMessage}"
            </div>

            {/* Affiliations & Certifications */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <span className="text-[11px] font-black uppercase text-indigo-700 tracking-wider block">
                Accreditations & Affiliations (স্বীকৃতি ও পার্টনারশিপ)
              </span>
              <div className="space-y-1.5">
                {(about.affiliations || []).map((acc, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs font-bold text-slate-800 flex items-center space-x-2"
                  >
                    <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{acc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* High-Tech Lab Infrastructure */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                State-of-the-Art Smart Campus Lab Infrastructure
              </h3>
              <p className="text-xs text-slate-500">
                আমাদের প্রতিটি ক্যাম্পাসে রয়েছে আন্তর্জাতিক মানের হাই-কনফিগারেশন কম্পিউটার ল্যাব সুবিধা।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {(about.facilityHighlights || []).map((fac, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 font-bold text-slate-700 flex items-start space-x-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black text-slate-900 text-sm">{fac.title}</span>
                  <span className="text-xs text-slate-500 font-normal mt-0.5 block leading-relaxed">{fac.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
