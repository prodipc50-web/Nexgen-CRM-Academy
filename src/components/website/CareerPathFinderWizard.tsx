import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Laptop,
  GraduationCap,
  Briefcase,
  Layers,
  PhoneCall,
  Clock,
  BookOpen
} from 'lucide-react';
import { Course } from '../../types';

interface CareerPathFinderWizardProps {
  courses: Course[];
  onSelectCourseForAdmission?: (course: Course) => void;
  onDownloadSyllabus?: (course: Course) => void;
  onBookCounseling?: (interest: string) => void;
}

interface UserProfileQuestion {
  id: string;
  title: string;
  subtitle: string;
  options: {
    id: string;
    label: string;
    icon: string;
    tag: string;
    categoryWeights: Record<string, number>;
  }[];
}

export const CareerPathFinderWizard: React.FC<CareerPathFinderWizardProps> = ({
  courses,
  onSelectCourseForAdmission,
  onDownloadSyllabus,
  onBookCounseling
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedBackground, setSelectedBackground] = useState<string>('');
  const [selectedInterest, setSelectedInterest] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<string>('');

  const questions: UserProfileQuestion[] = [
    {
      id: 'background',
      title: 'আপনার বর্তমান পর্যায় বা ব্যাকগ্রাউন্ড কোনটি?',
      subtitle: 'সঠিক কোর্স বাছাই করতে আপনার বর্তমান অবস্থা সিলেক্ট করুন',
      options: [
        {
          id: 'college_hsc',
          label: 'HSC / কলেজ শিক্ষার্থী',
          icon: '🎓',
          tag: 'শুরু থেকে আইটি ক্যারিয়ার',
          categoryWeights: { 'Office Applications': 3, 'Graphic Design': 3, 'Web Development': 2 }
        },
        {
          id: 'university',
          label: 'বিশ্ববিদ্যালয় শিক্ষার্থী',
          icon: '💻',
          tag: 'প্রফেশনাল স্কিলস ও পোর্টফোলিও',
          categoryWeights: { 'Web Development': 3, 'Python & AI': 3, 'Data & Cloud': 2, 'Cyber Security': 2 }
        },
        {
          id: 'job_switch',
          label: 'চাকরিজীবী / ক্যারিয়ার সুইচ',
          icon: '💼',
          tag: 'হাই-ডিমান্ড টেক প্রফেশন',
          categoryWeights: { 'Digital Marketing': 3, 'Python & AI': 3, 'Web Development': 2 }
        },
        {
          id: 'freelance_seeker',
          label: 'অনলাইন ফ্রিল্যান্সিং করতে চান',
          icon: '🚀',
          tag: 'আন্তর্জাতিক মার্কেটপ্লেস ইনকাম',
          categoryWeights: { 'Graphic Design': 3, 'Digital Marketing': 3, 'Video Editing': 3, 'Web Development': 2 }
        },
        {
          id: 'remote_work',
          label: 'রিমোট ওয়ার্ক / গৃহিণী ও উদ্যোক্তা',
          icon: '🏠',
          tag: 'বাসায় বসে স্বাবলম্বী ক্যারিয়ার',
          categoryWeights: { 'Graphic Design': 3, 'Digital Marketing': 3, 'Video Editing': 2 }
        }
      ]
    },
    {
      id: 'interest',
      title: 'কোন কাজের প্রতি আপনার আগ্রহ বেশি?',
      subtitle: 'আপনার পছন্দের ফিল্ড অনুযায়ী সেরা কোর্স সাজেস্ট করা হবে',
      options: [
        {
          id: 'design',
          label: 'গ্রাফিক ডিজাইন, লোগো ও ব্র্যান্ডিং',
          icon: '🎨',
          tag: 'ক্রিয়েটিভিটি ও ভিজ্যুয়াল আর্ট',
          categoryWeights: { 'Graphic Design': 5, 'UI/UX Design': 4 }
        },
        {
          id: 'coding',
          label: 'ওয়েবসাইট ও সফটওয়্যার কোডিং',
          icon: '⚙️',
          tag: 'লজিক, প্রোগ্রামিং ও ডেভেলপমেন্ট',
          categoryWeights: { 'Web Development': 5, 'Python & AI': 4, 'Cyber Security': 3 }
        },
        {
          id: 'video',
          label: 'ভিডিও এডিটিং, মোশন ও ইউটিউবিং',
          icon: '🎬',
          tag: 'ইউটিউব, রিলস ও সিনেমাটিক ভিডিও',
          categoryWeights: { 'Video Editing': 5 }
        },
        {
          id: 'marketing',
          label: 'ডিজিটাল মার্কেটিং, এসইও ও সোশ্যাল মিডিয়া',
          icon: '📈',
          tag: 'মার্কেটিং ও বিজনেস গ্রোথ',
          categoryWeights: { 'Digital Marketing': 5 }
        },
        {
          id: 'cad_arch',
          label: 'অটোক্যাড, ২ডি/৩ডি ইঞ্জিনিয়ারিং ড্রয়িং',
          icon: '📐',
          tag: 'সিভিল ও আর্কিটেকচার ড্রাফটিং',
          categoryWeights: { 'AutoCAD': 5 }
        },
        {
          id: 'office_bteb',
          label: 'অফিস অ্যাপ্লিকেশন ও সরকারি BTEB ডিপ্লোমা',
          icon: '📄',
          tag: 'সরকারি চাকরি ও অফিস প্রশাসন',
          categoryWeights: { 'Office Applications': 5 }
        }
      ]
    },
    {
      id: 'goal',
      title: 'কোর্স শেষে আপনার প্রধান লক্ষ্য কী?',
      subtitle: 'আপনার ক্যারিয়ার লক্ষ্যের সাথে মানানসই কোর্স নিশ্চিত করুন',
      options: [
        {
          id: 'freelance_income',
          label: 'Upwork/Fiverr-এ বৈদেশিক আয় (ডলারে)',
          icon: '💵',
          tag: 'গ্লোবাল ফ্রিল্যান্সার হওয়া',
          categoryWeights: { 'Graphic Design': 4, 'Video Editing': 4, 'Digital Marketing': 3, 'Web Development': 3 }
        },
        {
          id: 'local_job',
          label: 'দেশীয় সফটওয়্যার বা কর্পোরেট কোম্পানিতে চাকরি',
          icon: '🏢',
          tag: 'ফুল-টাইম টেক চাকরি',
          categoryWeights: { 'Web Development': 4, 'Python & AI': 4, 'Cyber Security': 3 }
        },
        {
          id: 'govt_job',
          label: 'সরকারি চাকরিতে কম্পিউটার সার্টিফিকেট সুবিধা',
          icon: '🏛️',
          tag: 'Govt. Recognized Certification',
          categoryWeights: { 'Office Applications': 5 }
        },
        {
          id: 'business',
          label: 'নিজের ব্যবসা বা এজেন্সির কাজ নিজেই করা',
          icon: '⚡',
          tag: 'ডিজিটাল উদ্যোক্তা হওয়া',
          categoryWeights: { 'Digital Marketing': 4, 'Graphic Design': 3 }
        }
      ]
    }
  ];

  // Calculate top matched courses based on weights
  const recommendedCourses = useMemo(() => {
    if (!courses || courses.length === 0) return [];

    const weights: Record<string, number> = {};

    // Helper to add weights
    const applyWeights = (weightMap?: Record<string, number>) => {
      if (!weightMap) return;
      Object.entries(weightMap).forEach(([cat, val]) => {
        weights[cat.toLowerCase()] = (weights[cat.toLowerCase()] || 0) + val;
      });
    };

    // Find selected options
    const bgOpt = questions[0].options.find(o => o.id === selectedBackground);
    const intOpt = questions[1].options.find(o => o.id === selectedInterest);
    const goalOpt = questions[2].options.find(o => o.id === selectedGoal);

    applyWeights(bgOpt?.categoryWeights);
    applyWeights(intOpt?.categoryWeights);
    applyWeights(goalOpt?.categoryWeights);

    // Score courses
    const scored = courses.map(course => {
      let score = 0;
      const catLower = (course.category || '').toLowerCase();
      const nameLower = (course.name || '').toLowerCase();

      Object.entries(weights).forEach(([key, weight]) => {
        if (catLower.includes(key) || nameLower.includes(key)) {
          score += weight * 2;
        }
      });

      // Default baseline score for popular courses
      if (course.badgeText) score += 1;
      if ((course.rating || 0) >= 4.8) score += 1;

      return { course, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Return top 3 unique courses
    const top = scored.slice(0, 3).map(s => s.course);
    // If not enough scored courses, fallback to first 3 courses
    if (top.length === 0) {
      return courses.slice(0, 3);
    }
    return top;
  }, [courses, selectedBackground, selectedInterest, selectedGoal]);

  const handleSelectOption = (optId: string) => {
    if (currentStep === 0) {
      setSelectedBackground(optId);
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setSelectedInterest(optId);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setSelectedGoal(optId);
      setCurrentStep(3); // Result view
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedBackground('');
    setSelectedInterest('');
    setSelectedGoal('');
  };

  return (
    <section id="career-wizard" className="py-14 sm:py-16 bg-slate-50 border-b border-slate-200 text-slate-900 relative overflow-hidden">
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>স্মার্ট ক্যারিয়ার চয়েস উইজার্ড (AI Course Matcher)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
            কোন কোর্সটি আপনার ভবিষ্যতের জন্য উপযুক্ত?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            মাত্র ১ মিনিটে ৩টি সহজ প্রশ্নের উত্তর দিয়ে জেনে নিন আপনার জন্য সবচেয়ে মানানসই কোর্স, প্রত্যাশিত মার্কেটপ্লেস আয় ও ক্যারিয়ার গাইডলাইন।
          </p>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center justify-center space-x-3 pt-3">
            {[0, 1, 2, 3].map((stepIdx) => (
              <div key={stepIdx} className="flex items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    currentStep === stepIdx
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : currentStep > stepIdx
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  {currentStep > stepIdx ? '✓' : stepIdx + 1}
                </div>
                {stepIdx < 3 && (
                  <div
                    className={`w-8 sm:w-12 h-0.5 mx-1.5 transition-colors ${
                      currentStep > stepIdx ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Interactive Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs">
          <AnimatePresence mode="wait">
            {currentStep < 3 ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1 pb-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    ধাপ ০{currentStep + 1} / ০৩
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-slate-950">
                    {questions[currentStep].title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {questions[currentStep].subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {questions[currentStep].options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className="p-4 rounded-2xl bg-slate-50/80 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-400 text-left transition-all group flex flex-col justify-between space-y-3 cursor-pointer hover:shadow-sm active:scale-98"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl p-2 bg-white rounded-xl border border-slate-200 group-hover:scale-110 transition-transform shadow-2xs">
                          {opt.icon}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">
                          {opt.label}
                        </h4>
                        <span className="inline-block mt-1 text-[11px] font-medium text-slate-500">
                          {opt.tag}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {currentStep > 0 && (
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      ← পূর্ববর্তী প্রশ্ন
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex items-center space-x-1 text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>রিসেট করুন</span>
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Step 3: RESULTS / MATCHED COURSES */
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>আপনার জন্য সাজেস্টেড টপ কোর্সসমূহ</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-black text-slate-950">
                    অভিনন্দন! আপনার প্রোফাইল অনুযায়ী সেরা ম্যাচিং কোর্স
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xl mx-auto">
                    আপনার ব্যাকগ্রাউন্ড ও ক্যারিয়ার লক্ষ্য অনুযায়ী আমাদের সিনিয়র মেন্টরদের পরামর্শকৃত সেরা ৩টি কোর্স নিচে দেওয়া হলো:
                  </p>
                </div>

                {/* Recommended Courses Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {recommendedCourses.map((c, idx) => (
                    <div
                      key={c.id}
                      className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all relative ${
                        idx === 0
                          ? 'bg-indigo-50/40 border-indigo-300 shadow-sm ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                      }`}
                    >
                      {idx === 0 && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white font-black text-[10px] rounded-full uppercase tracking-wider shadow-sm">
                          ⭐ Best Match (#1 Recommendation)
                        </span>
                      )}

                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between gap-1 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                            {c.category || 'IT Professional'}
                          </span>
                          <span className="text-slate-500 font-mono flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>{c.duration}</span>
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-slate-950 hover:text-indigo-600 transition-colors line-clamp-2">
                            {c.name}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {c.description || 'মার্কেটপ্লেস ও লোকাল জবের উপযোগী রিয়েল প্রজেক্ট ভিত্তিক কমপ্লিট কারিকুলাম।'}
                          </p>
                        </div>

                        {/* Marketplace Expectation */}
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-[11px] text-slate-500">সম্ভাব্য মার্কেটপ্লেস আয়:</span>
                            <span className="font-bold text-emerald-700">৳৩৫,০০০ - ৳৮৫,০০০+</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-[11px] text-slate-500">কোর্স ফি:</span>
                            <span className="font-bold text-indigo-700 font-mono">
                              ৳{(c.offerFee || c.regularFee || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => onSelectCourseForAdmission?.(c)}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 active:scale-98 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>সরাসরি অনলাইন ভর্তি</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          {onDownloadSyllabus && (
                            <button
                              type="button"
                              onClick={() => onDownloadSyllabus(c)}
                              className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-center transition-colors truncate cursor-pointer"
                            >
                              সিলেবাস
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onBookCounseling?.(c.name)}
                            className="py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-bold text-center transition-colors truncate cursor-pointer"
                          >
                            ফ্রি কাউন্সেলিং
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 font-bold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>পুনরায় টেস্ট দিন (Start Over)</span>
                  </button>

                  <div className="flex items-center space-x-2 text-slate-700">
                    <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>সরাসরি কাউন্সেলরের পরামর্শ নিতে কল করুন: <strong>01798-444444</strong></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
