import React, { useState } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import {
  LearningDeliveryFormatCard,
  AdmissionRoadmapStep,
  WebsiteSectionVisibility,
  ImpactTrustMetricItem,
  ImpactTrustConfig,
  SectionHeadingConfig
} from '../../../types';
import {
  Sliders,
  Eye,
  CheckCircle2,
  Save,
  Layers,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Laptop,
  Check,
  Footprints,
  FileText,
  RotateCcw,
  TrendingUp,
  BarChart3,
  Users,
  GraduationCap,
  Type
} from 'lucide-react';

interface CmsSectionsTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsSectionsTab: React.FC<CmsSectionsTabProps> = ({ onSuccessToast }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig } = useAcademy();

  // 1. Section Visibility
  const [visibility, setVisibility] = useState<WebsiteSectionVisibility>(
    websiteCmsConfig.sectionVisibility || {
      heroBanner: true,
      deliveryModes: true,
      impactTrust: true,
      courses: true,
      admissionRoadmap: true,
      aboutUs: true,
      mentors: true,
      communityHub: true,
      blog: true,
      seminars: true,
      gallery: true,
      reviews: true,
      verifyCertificate: true,
      noticesAndFaq: true,
      contactAndMap: true,
      footer: true
    }
  );

  // 2. Delivery Modes
  const [deliveryEnabled, setDeliveryEnabled] = useState<boolean>(
    websiteCmsConfig.deliveryModesConfig?.enabled ?? true
  );
  const [deliveryCards, setDeliveryCards] = useState<LearningDeliveryFormatCard[]>(
    websiteCmsConfig.deliveryModesConfig?.cards || [
      {
        id: 'offline',
        title: 'Offline Course',
        badge: 'ল্যাব ব্যাচ',
        description: 'ইন-পার্সন সরাসরি আধুনিক এসি ল্যাবে প্র্যাকটিক্যাল ক্লাস ও সার্বক্ষণিক শিক্ষক সাপোর্ট।',
        footerText: 'Courses Available',
        enabled: true
      },
      {
        id: 'online',
        title: 'Online Live Course',
        badge: 'লাইভ ক্লাস',
        description: 'দেশ-বিদেশের যেকোনো স্থান থেকে লাইভ ক্লাসে অংশ নিন, ইনস্ট্যান্ট প্রশ্ন করুন ও ক্লাস রেকর্ডিং পান।',
        footerText: 'Courses Available',
        enabled: true
      },
      {
        id: 'recorded',
        title: 'Pre Recorded Course',
        badge: 'সেলফ-পেসড',
        description: 'নিজের সুবিধাজনক সময়ে প্রিমিয়াম এইচডি ভিডিও দেখুন, প্রজেক্ট জমা দিন ও লাইফটাইম অ্যাক্সেস উপভোগ করুন।',
        footerText: 'Courses Available',
        enabled: true
      },
      {
        id: 'corporate',
        title: 'Corporate Training',
        badge: 'কর্পোরেট',
        description: 'ব্যাংক, বহুজাতিক প্রতিষ্ঠান ও কর্পোরেট টিমের কর্মীদের আধুনিক সফটওয়্যার ও আইটি স্কিলস ট্রেনিং।',
        footerText: 'Custom Team Upskilling',
        enabled: true
      }
    ]
  );

  // 3. Impact & Trust Metrics
  const [impactEnabled, setImpactEnabled] = useState<boolean>(
    websiteCmsConfig.impactTrustConfig?.enabled ?? true
  );
  const [impactTagText, setImpactTagText] = useState<string>(
    websiteCmsConfig.impactTrustConfig?.tagText || 'CAREER IMPACT & TRUST'
  );
  const [impactHeading, setImpactHeading] = useState<string>(
    websiteCmsConfig.impactTrustConfig?.heading || 'From Beginner to IT Professionals We Close That Gap.'
  );
  const [impactSubtitle, setImpactSubtitle] = useState<string>(
    websiteCmsConfig.impactTrustConfig?.subtitle ||
      'অভিজ্ঞ মেন্টরশিপ ও প্রজেক্ট-ভিত্তিক ট্রেনিং এর মাধ্যমে বাংলাদেশের তরুণদের গ্লোবাল ক্যারিয়ার গঠনে আমরা প্রতিশ্রুতিবদ্ধ।'
  );
  const [impactMetrics, setImpactMetrics] = useState<ImpactTrustMetricItem[]>(
    websiteCmsConfig.impactTrustConfig?.metrics || [
      { id: 'm1', metric: '20,000+', label: 'Successful Students', subtext: 'সফল শিক্ষার্থী', color: 'text-indigo-600' },
      { id: 'm2', metric: '9,000+', label: 'Expert Freelancers', subtext: 'সফল ফ্রিল্যান্সার', color: 'text-emerald-600' },
      { id: 'm3', metric: '2,000+', label: 'Skilled Job Holders', subtext: 'কর্মসংস্থানপ্রাপ্ত গ্র্যাজুয়েট', color: 'text-blue-600' },
      { id: 'm4', metric: '5,000+', label: 'Industry Experts', subtext: 'মেন্টরস নেটওয়ার্ক', color: 'text-amber-500' },
      { id: 'm5', metric: '95%', label: 'Course Success Ratio', subtext: 'সফলতার হার', color: 'text-rose-500' },
      { id: 'm6', metric: '100+', label: 'Hiring Partners', subtext: 'পার্টনার প্রতিষ্ঠান', color: 'text-purple-600' }
    ]
  );

  // 4. Admission Roadmap
  const [roadmapEnabled, setRoadmapEnabled] = useState<boolean>(
    websiteCmsConfig.admissionRoadmap?.enabled ?? true
  );
  const [roadmapTag, setRoadmapTag] = useState<string>(
    websiteCmsConfig.admissionRoadmap?.tagText || 'ভর্তি ও ক্লাস শুরুর প্রক্রিয়া'
  );
  const [roadmapTitle, setRoadmapTitle] = useState<string>(
    websiteCmsConfig.admissionRoadmap?.title || 'সহজ ৪টি ধাপে শুরু করুন আপনার আইটি ক্যারিয়ার'
  );
  const [roadmapDesc, setRoadmapDesc] = useState<string>(
    websiteCmsConfig.admissionRoadmap?.description ||
      'কোনো ঝামেলা ছাড়াই সম্পূর্ণ স্বচ্ছ প্রক্রিয়ায় কোর্স নির্বাচন, সরাসরি ল্যাব ওরিয়েন্টেশন এবং বাস্তব কাজ শেখা শুরু করুন।'
  );
  const [roadmapSteps, setRoadmapSteps] = useState<AdmissionRoadmapStep[]>(
    websiteCmsConfig.admissionRoadmap?.steps || [
      {
        id: 'step-1',
        stepNumber: '০১',
        title: 'কোর্স নির্বাচন ও কাউন্সেলিং',
        description: 'আপনার বর্তমান ক্যারিয়ার লক্ষ্য অনুযায়ী উপযুক্ত কোর্স বেছে নিন বা আমাদের এক্সপার্ট মেন্টরের সাথে কথা বলুন।',
        icon: 'BookOpen'
      },
      {
        id: 'step-2',
        stepNumber: '০২',
        title: 'অনলাইন আবেদন ও সিট বুকিং',
        description: 'পছন্দের ব্যাচ টাইম স্লট (সকাল, বিকাল বা উইকেন্ড) নির্বাচন করে সিট কনফার্ম করুন এবং রেজিস্ট্রেশন কপি বুঝে নিন।',
        icon: 'Calendar'
      },
      {
        id: 'step-3',
        stepNumber: '০৩',
        title: 'ল্যাব ওরিয়েন্টেশন ও সিঙ্গেল পিসি',
        description: 'প্রথম দিন ক্যাম্পাসে পরিচিতি এবং ক্লাসের প্রতিটি সেশনে ব্যক্তিগত হাই-কনফিগ কম্পিউটার বরাদ্দ বুঝে নিন।',
        icon: 'Laptop'
      },
      {
        id: 'step-4',
        stepNumber: '০৪',
        title: 'রিয়েল প্রজেক্ট ও আজীবন সাপোর্ট',
        description: 'বাস্তব প্রজেক্টে দক্ষতা অর্জন, সরকারি/ভেরিফায়েবল সার্টিফিকেট এবং আজীবন মেন্টরশিপ কমিউনিটি সহায়তা।',
        icon: 'Award'
      }
    ]
  );

  // 5. Section Heading Overrides
  const [coursesHeading, setCoursesHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.coursesSectionConfig?.tagText || 'Industry-Standard IT Curriculum',
    heading: websiteCmsConfig.coursesSectionConfig?.heading || 'Our Specialized IT Career Courses (কোর্সসমূহ)',
    subtitle: websiteCmsConfig.coursesSectionConfig?.subtitle || 'মার্কেটপ্লেস ও কর্পোরেট জব রেডি স্কিলস ডেভেলপ করুন অভিজ্ঞ মেন্টরদের সাথে।'
  });

  const [mentorsHeading, setMentorsHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.mentorsSectionConfig?.tagText || 'Industry Experts & Practitioners',
    heading: websiteCmsConfig.mentorsSectionConfig?.heading || 'Meet Our Industry Mentors & Faculty (মেন্টর প্যানেল)',
    subtitle: websiteCmsConfig.mentorsSectionConfig?.subtitle || 'আন্তর্জাতিক রিমোট জব ও টপ-রেটেড ফ্রিল্যান্সিংয়ে প্রতিষ্ঠিত শিক্ষকবৃন্দের সরাসরি তত্ত্বাবধানে নিজেকে তৈরি করুন।'
  });

  const [blogHeading, setBlogHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.blogSectionConfig?.tagText || 'Knowledge Base & Career Guide',
    heading: websiteCmsConfig.blogSectionConfig?.heading || 'Tech Blog & Career Roadmap Articles (ব্লগ ও ক্যারিয়ার গাইড)',
    subtitle: websiteCmsConfig.blogSectionConfig?.subtitle || 'প্রযুক্তি খাতের আপডেট, ফ্রিল্যান্সিং ক্যারিয়ার ট্রিকস ও ইন-ডিমান্ড স্কিলস এর নিয়মিত বিশ্লেষণ।'
  });

  const [seminarsHeading, setSeminarsHeading] = useState<SectionHeadingConfig>({
    tagText: websiteCmsConfig.seminarsSectionConfig?.tagText || 'Free Career Workshops',
    heading: websiteCmsConfig.seminarsSectionConfig?.heading || 'Upcoming Free Seminars & Workshops (ফ্রি ক্যারিয়ার সেমিনার)',
    subtitle: websiteCmsConfig.seminarsSectionConfig?.subtitle || 'ক্যাম্পাসে সরাসরি অথবা অনলাইনে যুক্ত হয়ে ইন্ডাস্ট্রি লিডারদের কাছ থেকে ক্যারিয়ার গাইডলাইন নিন।'
  });

  // 6. Footer Config
  const [footerBio, setFooterBio] = useState<string>(
    websiteCmsConfig.footerConfig?.bio ||
      'Premier professional IT training organization dedicated to creating industry-grade developers, designers, and freelance leaders with 100% practical lab practice.'
  );
  const [copyrightText, setCopyrightText] = useState<string>(
    websiteCmsConfig.footerConfig?.copyrightText || 'All Rights Reserved.'
  );
  const [creditsText, setCreditsText] = useState<string>(
    websiteCmsConfig.footerConfig?.creditsText || 'Empowered by NexGen Multi-Campus ERP & Centralized CMS Engine.'
  );
  const [showSocials, setShowSocials] = useState<boolean>(
    websiteCmsConfig.footerConfig?.showSocials ?? true
  );
  const [showTopCourses, setShowTopCourses] = useState<boolean>(
    websiteCmsConfig.footerConfig?.showTopCourses ?? true
  );
  const [showQuickNav, setShowQuickNav] = useState<boolean>(
    websiteCmsConfig.footerConfig?.showQuickNav ?? true
  );
  const [showLegalLinks, setShowLegalLinks] = useState<boolean>(
    websiteCmsConfig.footerConfig?.showLegalLinks ?? true
  );

  const handleToggleSection = (key: keyof WebsiteSectionVisibility) => {
    setVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleUpdateDeliveryCard = (index: number, field: keyof LearningDeliveryFormatCard, val: any) => {
    setDeliveryCards(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleUpdateRoadmapStep = (index: number, field: keyof AdmissionRoadmapStep, val: any) => {
    setRoadmapSteps(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleUpdateImpactMetric = (index: number, field: keyof ImpactTrustMetricItem, val: string) => {
    setImpactMetrics(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteCmsConfig({
      sectionVisibility: visibility,
      deliveryModesConfig: {
        enabled: deliveryEnabled,
        cards: deliveryCards
      },
      impactTrustConfig: {
        enabled: impactEnabled,
        tagText: impactTagText,
        heading: impactHeading,
        subtitle: impactSubtitle,
        metrics: impactMetrics
      },
      admissionRoadmap: {
        enabled: roadmapEnabled,
        tagText: roadmapTag,
        title: roadmapTitle,
        description: roadmapDesc,
        steps: roadmapSteps
      },
      coursesSectionConfig: coursesHeading,
      mentorsSectionConfig: mentorsHeading,
      blogSectionConfig: blogHeading,
      seminarsSectionConfig: seminarsHeading,
      footerConfig: {
        bio: footerBio,
        copyrightText,
        creditsText,
        showSocials,
        showTopCourses,
        showQuickNav,
        showLegalLinks
      }
    });
    onSuccessToast('সেকশন ভিজিবিলিটি, ইমপ্যাক্ট মেট্রিক্স, ডেলিভারি মোড ও ফুটার সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8">
      {/* SECTION 1: GLOBAL SECTION VISIBILITY TOGGLES */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <span>Website Sections Visibility Controls (১৬টি সেকশন শো/হাইড কন্ট্রোল)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              যেকোনো সেকশন প্রয়োজন অনুযায়ী চালু বা বন্ধ রাখুন। বন্ধ করলে পাবলিক ওয়েবসাইটে তা লুকানো থাকবে।
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setVisibility({
                heroBanner: true,
                deliveryModes: true,
                impactTrust: true,
                courses: true,
                admissionRoadmap: true,
                aboutUs: true,
                mentors: true,
                communityHub: true,
                blog: true,
                seminars: true,
                gallery: true,
                reviews: true,
                verifyCertificate: true,
                noticesAndFaq: true,
                contactAndMap: true,
                footer: true
              })
            }
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Show All 16 Sections</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { key: 'heroBanner', label: '1. Hero & Upcoming Batches', desc: 'মেইন ব্যানার ও স্লাইডার' },
            { key: 'deliveryModes', label: '2. Learning Delivery Modes', desc: '৪টি ফরম্যাট (অফলাইন/অনলাইন)' },
            { key: 'impactTrust', label: '3. Impact & Trust Metrics', desc: '২০,০০০+ স্টুডেন্ট স্ট্যাটস' },
            { key: 'courses', label: '4. Courses & Syllabi Grid', desc: 'কোর্স লিস্ট ও ক্যাটাগরি ফিল্টার' },
            { key: 'admissionRoadmap', label: '5. Admission Roadmap', desc: 'সহজ ৪টি ধাপে ভর্তি প্রক্রিয়া' },
            { key: 'aboutUs', label: '6. About Us & Leadership', desc: 'সংস্থার মিশন, ভিশন ও ডিরেক্টর বার্তা' },
            { key: 'mentors', label: '7. Faculty & Mentors Showcase', desc: 'মেন্টরস ও এক্সপার্ট শিক্ষক প্যানেল' },
            { key: 'communityHub', label: '8. Community & YouTube Hub', desc: 'ফেসবুক গ্রুপ ও ভিডিও ক্র্যাশ কোর্স' },
            { key: 'blog', label: '9. Blog & Tech Roadmap', desc: 'গাইডলাইন ও রিসোর্স আর্টিকেল' },
            { key: 'seminars', label: '10. Free Career Seminars', desc: 'ফ্রি সেমিনার ও অনলাইন ওয়ার্কশপ' },
            { key: 'gallery', label: '11. Campus Life Photo Gallery', desc: 'ল্যাব ও ক্লাসরুমের বাস্তব ছবি' },
            { key: 'reviews', label: '12. Student Reviews & Stories', desc: 'শিক্ষার্থীদের রেটিং ও ক্যারিয়ার সাকসেস' },
            { key: 'verifyCertificate', label: '13. Certificate Verification', desc: 'ডিজিটাল কিউআর/আইডি যাচাইকরণ' },
            { key: 'noticesAndFaq', label: '14. Notices & FAQ Accordion', desc: 'নোটিশ বোর্ড ও সাধারণ প্রশ্নোত্তর' },
            { key: 'contactAndMap', label: '15. Multi-Channel Contact & Map', desc: 'ক্যাম্পাস ঠিকানা ও গুগল ম্যাপ' },
            { key: 'footer', label: '16. Footer & Legal Policies', desc: 'ওয়েবসাইট ফুটার ও পলিসি লিংকস' }
          ].map(sec => {
            const isChecked = visibility[sec.key as keyof WebsiteSectionVisibility] ?? true;
            return (
              <div
                key={sec.key}
                onClick={() => handleToggleSection(sec.key as keyof WebsiteSectionVisibility)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start space-x-3 ${
                  isChecked
                    ? 'bg-indigo-50/50 border-indigo-200 text-slate-900 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h5 className="font-bold text-xs">{sec.label}</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">{sec.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: LEARNING DELIVERY FORMATS (4 CARDS) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <Laptop className="w-5 h-5 text-blue-600" />
              <span>Learning Delivery Format Cards (৪টি শিক্ষা পদ্ধতি কার্ড)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              হিরো সেকশনের ঠিক নিচের ৪টি বিশেষ কার্ডের টাইটেল, ব্যাজ ও বিবরণ পরিবর্তন করুন।
            </p>
          </div>
          <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={deliveryEnabled}
              onChange={e => setDeliveryEnabled(e.target.checked)}
              className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Enable Section</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveryCards.map((card, idx) => (
            <div
              key={card.id}
              className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                card.enabled ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-100/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider">
                  Card #{idx + 1}: {card.id.toUpperCase()}
                </span>
                <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.enabled}
                    onChange={e => handleUpdateDeliveryCard(idx, 'enabled', e.target.checked)}
                    className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>Show Card</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Card Title (শিরোনাম)</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={e => handleUpdateDeliveryCard(idx, 'title', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Text (ছোট ব্যাজ)</label>
                  <input
                    type="text"
                    value={card.badge}
                    onChange={e => handleUpdateDeliveryCard(idx, 'badge', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Description (সংক্ষিপ্ত বিবরণ)</label>
                  <textarea
                    rows={2}
                    value={card.description}
                    onChange={e => handleUpdateDeliveryCard(idx, 'description', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Footer Tag Note (নিচের স্ট্যাটাস ট্যাগ)</label>
                  <input
                    type="text"
                    value={card.footerText || ''}
                    onChange={e => handleUpdateDeliveryCard(idx, 'footerText', e.target.value)}
                    placeholder="e.g. Courses Available / Custom Team Upskilling"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: CAREER IMPACT & TRUST METRICS (6 CARDS) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Career Impact & Trust Metrics (ইমপ্যাক্ট হেডার ও ৬টি স্ট্যাটস কার্ড)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              "From Beginner to IT Professionals We Close That Gap" শিরোনাম এবং ৬টি মেট্রিক কার্ড (শিক্ষার্থী, ফ্রিল্যান্সার, জব হোল্ডার ইত্যাদি) কাস্টমাইজ করুন।
            </p>
          </div>
          <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={impactEnabled}
              onChange={e => setImpactEnabled(e.target.checked)}
              className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Enable Section</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Top Tag / Badge</label>
            <input
              type="text"
              value={impactTagText}
              onChange={e => setImpactTagText(e.target.value)}
              placeholder="e.g. CAREER IMPACT & TRUST"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-700"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Main Heading (প্রধান শিরোনাম)</label>
            <input
              type="text"
              value={impactHeading}
              onChange={e => setImpactHeading(e.target.value)}
              placeholder="e.g. From Beginner to IT Professionals We Close That Gap."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Subtitle Description (উপশিরোনাম)</label>
            <textarea
              rows={2}
              value={impactSubtitle}
              onChange={e => setImpactSubtitle(e.target.value)}
              placeholder="e.g. অভিজ্ঞ মেন্টরশিপ ও প্রজেক্ট-ভিত্তিক ট্রেনিং এর মাধ্যমে বাংলাদেশের তরুণদের গ্লোবাল ক্যারিয়ার গঠনে আমরা প্রতিশ্রুতিবদ্ধ।"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
            />
          </div>
        </div>

        {/* 6 Metric Cards Editor */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-xs text-slate-800 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>৬টি মেট্রিক কার্ডের তথ্য পরিবর্তন করুন:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {impactMetrics.map((met, idx) => (
              <div key={met.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    Card #{idx + 1}
                  </span>
                  <span className={`text-xs font-black ${met.color || 'text-indigo-600'}`}>
                    {met.metric || '0+'}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Metric Value (সংখ্যা / %)</label>
                  <input
                    type="text"
                    value={met.metric}
                    onChange={e => handleUpdateImpactMetric(idx, 'metric', e.target.value)}
                    placeholder="e.g. 20,000+ / 95%"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Label (ইংরেজি নাম)</label>
                  <input
                    type="text"
                    value={met.label}
                    onChange={e => handleUpdateImpactMetric(idx, 'label', e.target.value)}
                    placeholder="e.g. Successful Students"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtext (বাংলা ক্যাপশন)</label>
                  <input
                    type="text"
                    value={met.subtext}
                    onChange={e => handleUpdateImpactMetric(idx, 'subtext', e.target.value)}
                    placeholder="e.g. সফল শিক্ষার্থী"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Color Theme (কালার)</label>
                  <select
                    value={met.color || 'text-indigo-600'}
                    onChange={e => handleUpdateImpactMetric(idx, 'color', e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold"
                  >
                    <option value="text-indigo-600">Indigo (বেগুনী)</option>
                    <option value="text-emerald-600">Emerald (সবুজ)</option>
                    <option value="text-blue-600">Blue (নীল)</option>
                    <option value="text-amber-500">Amber (হলুদ)</option>
                    <option value="text-rose-500">Rose (গোলাপী/লাল)</option>
                    <option value="text-purple-600">Purple (পার্পল)</option>
                    <option value="text-teal-600">Teal (টিয়াল)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: ADMISSION & ONBOARDING ROADMAP (4 STEPS) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <Footprints className="w-5 h-5 text-emerald-600" />
              <span>Admission & Learning Journey (সহজ ৪টি ধাপের রোডম্যাপ)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              শিক্ষার্থী ভর্তির চার ধাপের রোডম্যাপ সেকশনের শিরোনাম ও প্রতিটি ধাপের টেক্সট পরিবর্তন করুন।
            </p>
          </div>
          <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={roadmapEnabled}
              onChange={e => setRoadmapEnabled(e.target.checked)}
              className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Enable Section</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Top Tag Text (টপ ট্যাগ)</label>
            <input
              type="text"
              value={roadmapTag}
              onChange={e => setRoadmapTag(e.target.value)}
              placeholder="e.g. ভর্তি ও ক্লাস শুরুর প্রক্রিয়া"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Main Heading (প্রধান শিরোনাম)</label>
            <input
              type="text"
              value={roadmapTitle}
              onChange={e => setRoadmapTitle(e.target.value)}
              placeholder="e.g. সহজ ৪টি ধাপে শুরু করুন আপনার আইটি ক্যারিয়ার"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Section Description (বিবরণ)</label>
            <input
              type="text"
              value={roadmapDesc}
              onChange={e => setRoadmapDesc(e.target.value)}
              placeholder="বিবরণ লিখুন..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {roadmapSteps.map((step, idx) => (
            <div key={step.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  {step.stepNumber}
                </span>
                <span className="font-bold text-slate-800 text-xs">ধাপ #{idx + 1}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Step Number (নম্বর)</label>
                  <input
                    type="text"
                    value={step.stepNumber}
                    onChange={e => handleUpdateRoadmapStep(idx, 'stepNumber', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-black text-center"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Step Title (ধাপের শিরোনাম)</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={e => handleUpdateRoadmapStep(idx, 'title', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">Step Description (ধাপের বিস্তারিত)</label>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={e => handleUpdateRoadmapStep(idx, 'description', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: CUSTOMIZABLE SECTION HEADINGS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
            <Type className="w-5 h-5 text-purple-600" />
            <span>Section Headings & Subtitles (কোর্স, মেন্টর, ব্লগ ও সেমিনার হেডার কাস্টমাইজেশন)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            হোমপেজের বিভিন্ন সেকশনের প্রধান শিরোনাম ও সাবটাইটেল আপনার প্রতিষ্ঠানের ব্র্যান্ড ভয়েস অনুযায়ী পরিবর্তন করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Courses Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Courses Section Header (কোর্স সেকশন)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Top Badge</label>
              <input
                type="text"
                value={coursesHeading.tagText || ''}
                onChange={e => setCoursesHeading(prev => ({ ...prev, tagText: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-indigo-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={coursesHeading.heading || ''}
                onChange={e => setCoursesHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle</label>
              <input
                type="text"
                value={coursesHeading.subtitle || ''}
                onChange={e => setCoursesHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Mentors Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Mentors Section Header (শিক্ষক ও মেন্টর সেকশন)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Top Badge</label>
              <input
                type="text"
                value={mentorsHeading.tagText || ''}
                onChange={e => setMentorsHeading(prev => ({ ...prev, tagText: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-blue-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={mentorsHeading.heading || ''}
                onChange={e => setMentorsHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle</label>
              <input
                type="text"
                value={mentorsHeading.subtitle || ''}
                onChange={e => setMentorsHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Blog Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Blog & Resource Articles Header (ব্লগ সেকশন)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Top Badge</label>
              <input
                type="text"
                value={blogHeading.tagText || ''}
                onChange={e => setBlogHeading(prev => ({ ...prev, tagText: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-amber-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={blogHeading.heading || ''}
                onChange={e => setBlogHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle</label>
              <input
                type="text"
                value={blogHeading.subtitle || ''}
                onChange={e => setBlogHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>

          {/* Seminars Heading */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>Career Seminars Header (ফ্রি সেমিনার সেকশন)</span>
            </h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Top Badge</label>
              <input
                type="text"
                value={seminarsHeading.tagText || ''}
                onChange={e => setSeminarsHeading(prev => ({ ...prev, tagText: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-rose-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Heading</label>
              <input
                type="text"
                value={seminarsHeading.heading || ''}
                onChange={e => setSeminarsHeading(prev => ({ ...prev, heading: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Subtitle</label>
              <input
                type="text"
                value={seminarsHeading.subtitle || ''}
                onChange={e => setSeminarsHeading(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: DYNAMIC FOOTER CONFIGURATION */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>Website Footer Customization (ফুটার কাস্টমাইজেশন)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            পাবলিক ওয়েবসাইটের নিচের ফুটার টেক্সট, বায়ো, কপিরাইট এবং কলাম অপশন কনফিগার করুন।
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Institute Bio / Tagline in Footer</label>
            <textarea
              rows={2}
              value={footerBio}
              onChange={e => setFooterBio(e.target.value)}
              placeholder="e.g. Premier professional IT training organization dedicated to creating industry-grade developers..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Copyright Statement</label>
              <input
                type="text"
                value={copyrightText}
                onChange={e => setCopyrightText(e.target.value)}
                placeholder="All Rights Reserved."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Credits / System Line</label>
              <input
                type="text"
                value={creditsText}
                onChange={e => setCreditsText(e.target.value)}
                placeholder="Empowered by NexGen Multi-Campus ERP & Centralized CMS Engine."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showSocials}
                onChange={e => setShowSocials(e.target.checked)}
                className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Social Icons</span>
            </label>

            <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showTopCourses}
                onChange={e => setShowTopCourses(e.target.checked)}
                className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Top Courses Column</span>
            </label>

            <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showQuickNav}
                onChange={e => setShowQuickNav(e.target.checked)}
                className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Quick Navigation Column</span>
            </label>

            <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showLegalLinks}
                onChange={e => setShowLegalLinks(e.target.checked)}
                className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Legal Policies Column</span>
            </label>
          </div>
        </div>
      </div>

      {/* Global Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Save className="w-4 h-4" />
          <span>Save Sections, Roadmaps & Footer Settings</span>
        </button>
      </div>
    </form>
  );
};
