import React from 'react';
import { Building2, Award, Briefcase, ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';
import { HiringPartnersSectionConfig } from '../../types';

interface HiringPartnersSectionProps {
  config?: HiringPartnersSectionConfig;
  onOpenAdmission?: () => void;
}

export const HiringPartnersSection: React.FC<HiringPartnersSectionProps> = ({
  config,
  onOpenAdmission
}) => {
  if (!config || !config.enabled) return null;

  const activePartners = (config.partners || [])
    .filter(p => p.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activePartners.length === 0) return null;

  return (
    <section id="hiring-partners" className="py-16 sm:py-20 bg-slate-50/70 border-y border-slate-200/80">
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-black uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{config.sectionTag || 'TOP RECRUITERS & CORPORATE AFFILIATIONS'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {config.heading || 'যেসব শীর্ষ প্রতিষ্ঠানে আমাদের শিক্ষার্থীরা কর্মরত'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {config.subtitle ||
              'আমাদের প্রশিক্ষণপ্রাপ্ত শিক্ষার্থীরা দেশ-বিদেশের খ্যাতিমান আইটি কোম্পানি, সফটওয়্যার ফার্ম এবং গ্লোবাল ফ্রিল্যান্স মার্কেটপ্লেসে সুনামের সাথে কাজ করছেন।'}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {activePartners.map(partner => {
            const isGovt = partner.category === 'Govt Accreditation';

            return (
              <div
                key={partner.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-lg hover:border-indigo-300 transition-all flex flex-col items-center justify-between text-center group relative overflow-hidden"
              >
                {/* Category Pill */}
                <div className="w-full flex justify-center mb-2">
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                      isGovt
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : partner.category === 'Tech Partner'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    }`}
                  >
                    {partner.category}
                  </span>
                </div>

                {/* Company Logo */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 p-2 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform overflow-hidden">
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                    onError={e => {
                      // Fallback icon if image fails to load
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="font-bold text-xs text-slate-500">${partner.name.slice(0, 2).toUpperCase()}</span>`;
                      }
                    }}
                  />
                </div>

                {/* Company Name */}
                <h4 className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-indigo-700 transition-colors">
                  {partner.name}
                </h4>

                {/* Hired Count Badge */}
                {partner.hiredCount ? (
                  <div className="mt-2 text-[10px] font-semibold text-slate-500 flex items-center space-x-1">
                    <Briefcase className="w-3 h-3 text-slate-400" />
                    <span>{partner.hiredCount}+ Hired</span>
                  </div>
                ) : (
                  <div className="mt-2 text-[10px] font-semibold text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Partner</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              আপনিও কি আপনার পছন্দের প্রতিষ্ঠানে ক্যারিয়ার শুরু করতে চান?
            </h3>
            <p className="text-xs sm:text-sm text-indigo-200">
              আমাদের ১০০% প্র্যাকটিক্যাল ল্যাব ট্রেনিং এবং ক্যারিয়ার প্লেসমেন্ট সেলের সাথে যুক্ত হোন।
            </p>
          </div>

          {onOpenAdmission && (
            <button
              type="button"
              onClick={onOpenAdmission}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <span>ভর্তি ও ক্যারিয়ার সহায়তা নিন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
