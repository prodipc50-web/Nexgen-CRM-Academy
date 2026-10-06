import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Phone, Sparkles, HelpCircle } from 'lucide-react';
import { WebsiteFaqItem } from '../../../types';

interface NexgenFaqProps {
  faqs?: WebsiteFaqItem[];
  supportPhone?: string;
  whatsappNumber?: string;
  onOpenCounseling?: () => void;
}

export const NexgenFaq: React.FC<NexgenFaqProps> = ({
  faqs,
  supportPhone = '01798444444',
  whatsappNumber,
  onOpenCounseling
}) => {
  const defaultFaqs: WebsiteFaqItem[] = [
    {
      id: 'faq-1',
      question: 'ক্লাস কি অফলাইন ল্যাবে নাকি লাইভ অনলাইনে হবে? (Offline Lab vs Online Live)',
      answer:
        'আমাদের ফার্মগেট ক্যাম্পাসে শীতাতপ নিয়ন্ত্রিত আধুনিক কম্পিউটার ল্যাবে অফলাইন প্র্যাকটিক্যাল ক্লাস এবং দেশের যেকোনো প্রান্ত থেকে ঘরে বসে লাইভ অনলাইন ক্লাস—উভয় মাধ্যমেই শেখার সুবিধা রয়েছে। আপনি আপনার সুবিধা অনুযায়ী ব্যাচ ও মোড বেছে নিতে পারেন।',
      category: 'Admission'
    },
    {
      id: 'faq-2',
      question: 'আমি একদম বিগিনার বা নন-আইটি ব্যাকগ্রাউন্ডের, আমি কি শিখতে পারব? (Beginner Friendly)',
      answer:
        'হ্যাঁ, অবশ্যই! আমাদের প্রতিটি কোর্স একদম বেসিক বা জিরো লেভেল থেকে শুরু করে ধাপে ধাপে অ্যাডভান্সড ইন্ডাস্ট্রি প্রজেক্ট পর্যন্ত শেখানো হয়। পূর্বের কোনো টেকনিক্যাল বা কোডিং ব্যাকগ্রাউন্ড থাকার প্রয়োজন নেই।',
      category: 'Academics'
    },
    {
      id: 'faq-3',
      question: 'কোনো ক্লাস মিস হলে কি ভিডিও রেকর্ডিং ও ব্যাকআপ সাপোর্ট পাব? (Class Recording & Backup)',
      answer:
        'হ্যাঁ! প্রতিটি ক্লাসের পর ফুল এইচডি (1080p) ভিডিও রেকর্ডিং এবং লেকচার রিসোর্স ফাইল স্টুডেন্ট পোর্টালে আজীবন সংরক্ষিত থাকবে। এছাড়াও কোনো টপিক বুঝতে সমস্যা হলে মেন্টরের সাথে এক্সট্রা ১-অন-১ সাপোর্ট ক্লাসের পূর্ণ সুযোগ রয়েছে।',
      category: 'Academics'
    },
    {
      id: 'faq-4',
      question: 'কোর্স শেষে কি ভেরিফায়েড সার্টিফিকেট দেওয়া হবে? (Verified Certificate)',
      answer:
        'হ্যাঁ, সফলভাবে কোর্স ও ফাইনাল প্রজেক্ট সম্পন্ন করার পর একটি আন্তর্জাতিক মানসম্পন্ন প্রফেশনাল সার্টিফিকেট প্রদান করা হবে। এতে একটি ইউনিক আইডি ও কিউআর (QR) কোড থাকবে, যা দেশ-বিদেশের যেকোনো প্রতিষ্ঠান থেকে অনলাইনে লাইভ যাচাই করা যাবে।',
      category: 'Certification'
    },
    {
      id: 'faq-5',
      question: 'কোর্স শেষে ফ্রিল্যান্সিং ও জবের ক্ষেত্রে আপনারা কী ধরণের সহায়তা করেন? (Job & Freelance Support)',
      answer:
        'আমাদের ডেডিকেটেড ক্যারিয়ার সেল থেকে সিভি ও পোর্টফোলিও মেকিং, জব ইন্টারভিউ প্রস্তুতি, ফ্রিল্যান্সিং মার্কেটপ্লেস (Fiverr/Upwork) ক্লায়েন্ট হ্যান্ডলিং এবং আমাদের পার্টনার কোম্পানিতে সরাসরি ইন্টার্নশিপ ও জব রেফারেন্স প্রদান করা হয়।',
      category: 'Career'
    },
    {
      id: 'faq-6',
      question: 'কোর্স ফি কি কিস্তিতে (Installment) পরিশোধ করার সুযোগ আছে? (Course Fee & Installment)',
      answer:
        'হ্যাঁ, শিক্ষার্থীদের সুবিধার জন্য সহজ ২-৩টি কিস্তিতে (ইনস্টলমেন্ট) কোর্স ফি পরিশোধের সুযোগ রয়েছে। এছাড়াও নিয়মিত স্পেশাল স্কলারশিপ ও আর্লি-বার্ড ডিসকাউন্ট অফার চালু থাকে।',
      category: 'Payments'
    }
  ];

  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleSupportClick = () => {
    if (onOpenCounseling) {
      onOpenCounseling();
    } else if (whatsappNumber || supportPhone) {
      const cleanWa = (whatsappNumber || supportPhone).replace(/[^0-9]/g, '');
      const waFull = cleanWa.startsWith('88') ? cleanWa : `88${cleanWa}`;
      const msg = encodeURIComponent('আসসালামু আলাইকুম! আমি কোর্স ও ভর্তি সংক্রান্ত কিছু তথ্য জানতে চাই।');
      window.open(`https://wa.me/${waFull}?text=${msg}`, '_blank');
    }
  };

  return (
    <section id="faqs" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-200/80">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Headline, Subtitle, and Contact CTA Card (matching user screenshot) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>জিজ্ঞাসা • FAQs</span>
            </div>

            <div className="space-y-2.5">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                সাধারণ প্রশ্নসমূহ <br className="hidden sm:inline" />
                <span className="text-purple-600">(FAQ)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                আপনার প্রশ্নের উত্তর পাচ্ছেন না? আমাদের অভিজ্ঞ অ্যাডমিশন ও ক্যারিয়ার কাউন্সেলিং টিমের সাথে সরাসরি কথা বলে সমাধান নিন।
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                type="button"
                onClick={handleSupportClick}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>কাউন্সেলিং টিমের সাথে কথা বলুন</span>
              </button>

              {supportPhone && (
                <a
                  href={`tel:${supportPhone.replace(/[^0-9]/g, '')}`}
                  className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>হটলাইন: {supportPhone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Modern Accordion List */}
          <div className="lg:col-span-7 space-y-3">
            {items.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.id || idx}
                  className={`rounded-2xl transition-all border overflow-hidden ${
                    isOpen
                      ? 'bg-white border-purple-300 shadow-sm ring-1 ring-purple-100'
                      : 'bg-white border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer space-x-3 transition-colors"
                  >
                    <span
                      className={`font-black text-xs sm:text-sm leading-snug ${
                        isOpen ? 'text-purple-700' : 'text-slate-900'
                      }`}
                    >
                      {item.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-purple-50">
                      <p className="pt-2">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
