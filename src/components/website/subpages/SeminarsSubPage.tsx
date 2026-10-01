import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  MessageSquare,
  Navigation,
  CheckCircle2,
  Gift,
  HelpCircle
} from 'lucide-react';
import { SeminarWorkshop } from '../../../types';
import { SubPageBanner } from './SubPageBanner';

interface SeminarsSubPageProps {
  seminars: SeminarWorkshop[];
  onOpenSeminarReg: (seminar: SeminarWorkshop) => void;
  onBackToHome: () => void;
}

export const SeminarsSubPage: React.FC<SeminarsSubPageProps> = ({
  seminars,
  onOpenSeminarReg,
  onBackToHome
}) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SubPageBanner
        title="Upcoming Free IT Seminars & Workshops (ফ্রি সেমিনার)"
        subtitle="সরাসরি ক্যারিয়ার কাউন্সেলিং, ফ্রিল্যান্সিং গাইডলাইন ও ইন্ডাস্ট্রি মেন্টরদের সাথে প্রশ্নোত্তরের ফ্রি সেশনে অংশ নিন।"
        badge="১০০% ফ্রি ক্যারিয়ার সেশন"
        breadcrumbs={[{ label: 'ফ্রি সেমিনার (Free Seminars)', active: true }]}
        onBackToHome={onBackToHome}
        actionButton={
          <span className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-400/30">
            {seminars.length}টি সেমিনার শিডিউল চালু আছে
          </span>
        }
      />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 space-y-10">
        {/* Why Attend Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">ইন্ডাস্ট্রি মেন্টরদের পরামর্শ</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              মার্কেটপ্লেসে সফল সিনিয়র ফ্রিল্যান্সার ও সফ্টওয়্যার ইঞ্জিনিয়ারদের সাথে সরাসরি কথা বলার ও প্রশ্ন করার সুযোগ।
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">রুটিন ও ক্যারিয়ার রোডম্যাপ</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              কোন কোর্সটি আপনার বর্তমান ব্যাকগ্রাউন্ডের সাথে মানানসই এবং কীভাবে দ্রুত কাজ পাওয়া যায় তার পূর্ণাঙ্গ গাইড।
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">স্পেশাল স্কলারশিপ ডিসকাউন্ট</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              সেমিনারে উপস্থিত সকল শিক্ষার্থীদের জন্য নিয়মিত কোর্স ফিতে বিশেষ ৩০% থেকে ৫০% স্কলারশিপ ভাউচার প্রদান।
            </p>
          </div>
        </div>

        {/* Seminars List Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              আসন্ন ফ্রি সেমিনার শিডিউল
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              অনলাইন জুম লাইভ ও সরাসরি ক্যাম্পাসে
            </span>
          </div>

          {seminars.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">কোনো সেমিনার এই মুহূর্তে শিডিউল করা নেই।</h3>
              <p className="text-xs text-slate-500">শীঘ্রই নতুন সেমিনার ঘোষণা করা হবে। আমাদের সাথেই থাকুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seminars.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 hover:border-indigo-300 hover:shadow-lg transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {s.type || 'Free Career Seminar'}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Seats Left: {Math.max(1, s.capacity - s.registeredCount)}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-950 leading-snug">{s.title}</h3>

                    <div className="space-y-2 text-xs text-slate-600 pt-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{s.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{s.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="truncate">{s.roomOrPlatform || 'Banasree Campus Seminar Hall 1 & Zoom Live'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Speaker: <strong className="text-slate-900">{s.speakerName}</strong></span>
                      </div>

                      {(s.whatsappGroupUrl || s.googleMapsUrl) && (
                        <div className="flex items-center space-x-2 pt-1">
                          {s.whatsappGroupUrl && (
                            <a
                              href={s.whatsappGroupUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp Community</span>
                            </a>
                          )}
                          {s.googleMapsUrl && (
                            <a
                              href={s.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold hover:bg-indigo-100 transition-colors"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Venue Map</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenSeminarReg(s)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Join Free Seminar (সিট বুক করুন)</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
