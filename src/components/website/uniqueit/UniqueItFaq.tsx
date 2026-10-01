import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { WebsiteFaqItem } from '../../../types';

interface UniqueItFaqProps {
  faqs?: WebsiteFaqItem[];
}

export const UniqueItFaq: React.FC<UniqueItFaqProps> = ({ faqs }) => {
  const defaultFaqs = [
    {
      id: '1',
      question: 'পেমেন্ট কীভাবে করবেন?',
      answer:
        'অনলাইনে বা সরাসরি আমাদের বনশ্রী অফিসে এসে বিকাশ, নগদ, রকেট, ডেবিট/ক্রেডিট কার্ড বা ক্যাশের মাধ্যমে সহজে কোর্স ফি পরিশোধ করতে পারবেন। এছাড়াও রয়েছে সহজ ২-৩টি কিস্তিতে ফি দেওয়ার সুযোগ।'
    },
    {
      id: '2',
      question: 'ক্লাসের সময় কোনটি?',
      answer:
        'শিক্ষার্থী ও চাকরিজীবীদের সুবিধার জন্য সকাল, দুপুর ও সান্ধ্যকালীন নিয়মিত শিডিউল রয়েছে। এছাড়াও শুধু শুক্র ও শনিবারের স্পেশাল উইকেন্ড ব্যাচ পরিচালিত হয়।'
    },
    {
      id: '3',
      question: 'কোর্স শুরুর পূর্বে কি প্রয়োজন?',
      answer:
        'কোর্স শুরুর জন্য পূর্ব অভিজ্ঞতার প্রয়োজন নেই। শেখার আগ্রহ, নিয়মিত ক্লাসে উপস্থিতি এবং হোম অ্যাসাইনমেন্ট সম্পন্ন করার মানসিকতা থাকলেই আপনি সফল হতে পারবেন।'
    },
    {
      id: '4',
      question: 'কম্পিউটার কতদিন পাবেন?',
      answer:
        'অফলাইন কোর্সের শিক্ষার্থীদের জন্য প্রতিদিনের ক্লাসের পাশাপাশি প্র্যাকটিস ল্যাবে ফুল-টাইম হাই-কনফিগারেশন কম্পিউটার সুবিধা সম্পূর্ণ বিনামূল্যে প্রদান করা হয়।'
    },
    {
      id: '5',
      question: 'কোর্স শেষে আয়ের সুযোগ?',
      answer:
        'কোর্সের শেষ মাস থেকেই ফাইভার, আপওয়ার্ক এবং ফ্রিল্যান্সার প্ল্যাটফর্মে অ্যাকাউন্ট সেটআপ ও বিডিং গাইডলাইন দেওয়া হয়। এছাড়াও ৫০+ পার্টনার কোম্পানিতে জব রেফারেন্স ও ইন্টার্নশিপের সুযোগ রয়েছে।'
    },
    {
      id: '6',
      question: 'বিশেষ সুবিধা সমূহ?',
      answer:
        'লাইফটাইম সাপোর্ট, প্রতিটি ক্লাসের এইচডি রেকর্ডেড ভিডিও ব্যাকআপ, প্র্যাকটিক্যাল প্রজেক্ট বেসড কারিকুলাম এবং ভেরিফায়েবল সার্টিফিকেট সুবিধা।'
    },
    {
      id: '7',
      question: '3D Studio Max কী কাজে লাগে?',
      answer:
        '3D Studio Max আর্কিটেকচারাল ভিজ্যুয়ালাইজেশন, ইন্টেরিয়র ডিজাইন, অ্যানিমেশন, প্রোডাক্ট রেন্ডারিং ও গেম অ্যাসেট মডেলিংয়ের জন্য বিশ্বব্যাপী ব্যাপকভাবে ব্যবহৃত হয়।'
    }
  ];

  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Explore detailed answers to the most common questions about our platform.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id || idx}
                className={`rounded-2xl transition-all border overflow-hidden ${
                  isOpen
                    ? 'bg-purple-50/80 border-purple-200 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer space-x-3"
                >
                  <span
                    className={`font-black text-xs sm:text-sm ${
                      isOpen ? 'text-purple-900' : 'text-slate-800'
                    }`}
                  >
                    {item.question}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-purple-200 text-purple-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-purple-100/60">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
