import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SnakeCtaCmsConfig } from '../../../types';

interface UniqueItSnakeCtaProps {
  onOpenAdmission: () => void;
  config?: SnakeCtaCmsConfig;
}

export const NexgenSnakeCta: React.FC<UniqueItSnakeCtaProps> = ({ onOpenAdmission, config }) => {
  const title = config?.title || 'The Best Time to Start is Today.';
  const subtitle =
    config?.subtitle ||
    "Don't let that happen. Enroll today online or offline and take the first real step toward the career you actually want.";
  const ctaText = config?.ctaText || 'Enroll Now';

  return (
    <section className="py-14 sm:py-16 bg-[#faf8ff]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-purple-200/80 shadow-md relative overflow-hidden space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#dc143c]">
            So why delay?
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
            {subtitle}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenAdmission}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer active:scale-95 inline-flex items-center space-x-2"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { NexgenSnakeCta as UniqueItSnakeCta };
