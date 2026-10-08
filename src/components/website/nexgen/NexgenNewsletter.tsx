import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { NewsletterCtaCmsConfig } from '../../../types';

interface UniqueItNewsletterProps {
  config?: NewsletterCtaCmsConfig;
}

export const NexgenNewsletter: React.FC<UniqueItNewsletterProps> = ({ config }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const title = config?.title || 'Upgrade Your Learning Experience';
  const description =
    config?.description ||
    'Sign up for our free newsletter and get latest updates on IT scholarships, freelancing trends, and weekly free masterclasses from NexGen Computer Academy.';
  const buttonText = config?.buttonText || 'Subscribe';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="bg-[#111827] text-white rounded-3xl p-8 sm:p-12 lg:p-14 overflow-hidden relative shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
                {title.includes('Learning Experience') ? (
                  <>
                    {title.split('Learning Experience')[0]}
                    <span className="text-[#dc143c]">Learning Experience</span>
                    {title.split('Learning Experience')[1]}
                  </>
                ) : (
                  title
                )}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-lg">
                {description}
              </p>

              {isSubscribed ? (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ধন্যবাদ! আপনি সফলভাবে নিউজলেটারে যুক্ত হয়েছেন।</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md pt-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-black transition-colors cursor-pointer shrink-0 active:scale-95"
                  >
                    {buttonText}
                  </button>
                </form>
              )}
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xs aspect-[4/3] rounded-2xl overflow-hidden border-4 border-slate-800 shadow-xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                  alt="Student smiling with smartphone"
                  width={320}
                  height={240}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { NexgenNewsletter as UniqueItNewsletter };
