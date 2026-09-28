import React, { useState } from 'react';
import {
  PhoneCall,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Clock,
  User,
  BookOpen
} from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';
import { Course } from '../../types';

interface FreeCounselingLeadBannerProps {
  courses: Course[];
  title?: string;
  subtitle?: string;
}

export const FreeCounselingLeadBanner: React.FC<FreeCounselingLeadBannerProps> = ({
  courses,
  title,
  subtitle
}) => {
  const { submitPublicLead, websiteCmsConfig, academySettings } = useAcademy();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [learningMode, setLearningMode] = useState<'Offline' | 'Online Live'>('Offline');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hotline =
    websiteCmsConfig?.multiplePhones?.[0]?.number ||
    academySettings.primarySupportPhone ||
    (academySettings.helplines && academySettings.helplines[0]) ||
    '01798444444';
  const whatsappNumber =
    websiteCmsConfig?.marketing?.floatingWhatsAppNumber ||
    academySettings.primarySupportPhone?.replace(/[^0-9]/g, '') ||
    '8801798444444';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('আপনার নাম লিখুন');
      return;
    }

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCourseObj = courses.find(c => c.name === interest);
      await submitPublicLead({
        fullName: name.trim(),
        studentName: name.trim(),
        phone: cleanPhone,
        courseId: selectedCourseObj?.id || courses[0]?.id || '',
        courseName: interest || 'General Career Counseling',
        source: 'Free Counseling Call Banner',
        learningMode: learningMode,
        notes: `Interest: ${interest || 'Career Guidance'} | Preferred Mode: ${learningMode}`
      });

      setIsSuccess(true);
      setName('');
      setPhone('');
      setInterest('');
    } catch (err: any) {
      console.error('Lead submit error:', err);
      setErrorMessage('দুঃখিত, অনুরোধ সম্পন্ন করা যায়নি। সরাসরি হটলাইনে কল করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-10 border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading & Value Proposition (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>১০০% ফ্রি ক্যারিয়ার কাউন্সেলিং ও গাইডলাইন</span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 leading-tight">
              {title || 'সঠিক কোর্স নির্বাচনে সিদ্ধান্ত নিতে পারছেন না?'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {subtitle || 'আপনার শিক্ষাগত যোগ্যতা ও আগ্রহ অনুযায়ী কোন আইটি স্কিল দিয়ে সফল ফ্রিল্যান্সিং বা জব ক্যারিয়ার গড়া সম্ভব—আমাদের সিনিয়র ক্যারিয়ার কাউন্সেলরের কাছ থেকে জেনে নিন বিনামূল্যে।'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>ফ্রি সিলেবাস ও রোডম্যাপ</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>১০ মিনিটে কল ব্যাক</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>কোনো ফি ছাড়া পরামর্শ</span>
              </div>
            </div>

            {/* Direct hotline & WhatsApp badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href={`tel:${hotline}`}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs transition-colors shadow-2xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
                <span>হটলাইন: {hotline}</span>
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Nexgen Academy! I would like to get free career counseling regarding courses.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>হোয়াটসঅ্যাপ চ্যাট</span>
              </a>
            </div>
          </div>

          {/* Right Column: Instant Callback Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm">
            {isSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto font-black shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-emerald-900">
                  ধন্যবাদ! আপনার অনুরোধ সফলভাবে গৃহীত হয়েছে
                </h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                  আমাদের সিনিয়র ক্যারিয়ার কাউন্সেলর কিছুক্ষণের মধ্যে আপনার দেওয়া নম্বরে কল দিয়ে বিস্তারিত গাইডলাইন প্রদান করবেন।
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  অন্য কারও জন্য অনুরোধ পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>দ্রুত কল-ব্যাক ফরম (Quick Callback)</span>
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setLearningMode('Offline')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                        learningMode === 'Offline'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ক্যাম্পাস ল্যাব
                    </button>
                    <button
                      type="button"
                      onClick={() => setLearningMode('Online Live')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                        learningMode === 'Online Live'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      অনলাইন লাইভ
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Name Input */}
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="আপনার নাম *"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white font-medium transition-colors"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="relative">
                    <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="মোবাইল নম্বর (017...)*"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white font-medium transition-colors"
                    />
                  </div>

                  {/* Course / Interest Select */}
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white font-medium cursor-pointer transition-colors"
                    >
                      <option value="" className="text-slate-500">আগ্রহের কোর্স নির্বাচন করুন</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.name} className="text-slate-900">
                          {c.name}
                        </option>
                      ))}
                      <option value="General Guidance" className="text-slate-900">অন্যান্য / গাইডেন্স প্রয়োজন</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>আপনার তথ্য সম্পূর্ণ নিরাপদ। কোনো স্প্যাম কল দেওয়া হবে না।</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer active:scale-98"
                  >
                    {isSubmitting ? (
                      <span>অনুরোধ পাঠানো হচ্ছে...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>ফ্রি কাউন্সেলিং কল বুক করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
