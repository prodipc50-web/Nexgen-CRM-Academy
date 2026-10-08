import React, { useState } from 'react';
import { Play, ArrowRight, ArrowUpRight, Zap, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

interface ModernSplitVideoHeroProps {
  instituteName?: string;
  campusName?: string;
  headline?: string;
  subtitle?: string;
  videoUrl?: string;
  videoBadgeText?: string;
  videoThumbnailUrl?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  onOpenAdmission: () => void;
  onLearnMore?: () => void;
}

export const ModernSplitVideoHero: React.FC<ModernSplitVideoHeroProps> = ({
  instituteName = 'NexGen Computer Academy',
  campusName = 'Farmgate',
  headline,
  subtitle,
  videoUrl,
  videoBadgeText,
  videoThumbnailUrl,
  primaryCtaText,
  secondaryCtaText,
  onOpenAdmission,
  onLearnMore
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Normalize YouTube URL so watch, share, and embed links all work automatically
  const getEmbedUrl = (url?: string) => {
    if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
    if (url.includes('youtube.com/embed/')) {
      return url.includes('autoplay') ? url : `${url}${url.includes('?') ? '&' : '?'}autoplay=1`;
    }
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  };

  const effectiveVideoEmbed = getEmbedUrl(videoUrl);

  const handleLearnMoreClick = () => {
    if (onLearnMore) {
      onLearnMore();
    } else {
      const el = document.getElementById('benefits') || document.getElementById('courses');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative bg-white text-slate-900 py-10 sm:py-16 lg:py-20 overflow-hidden border-b border-slate-200">
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Heading, Bio, & Action CTAs matching Screenshot 1 */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-rose-600 tracking-tight leading-[1.18]">
                {headline ? (
                  headline
                ) : (
                  <>
                    <span className="text-rose-600 block sm:inline">{instituteName}: </span>
                    <span className="text-slate-950">Computer & Freelancing Training Center in {campusName}</span>
                  </>
                )}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
              {subtitle ? (
                subtitle
              ) : (
                <>
                  At <strong className="text-slate-900 font-bold">{instituteName}</strong>, the top freelancing & professional IT training center in {campusName}, Dhaka, we teach you how to succeed in career and freelance marketplaces. Our expert mentors guide you step-by-step to build a portfolio you're proud of. Additionally, we'll help you set up your profiles and apply for top tech jobs. Thousands of students have already started earning with us. Now, it's your turn. Start freelancing today.
                </>
              )}
            </p>

            {/* CTAs matching Screenshot 1: Red/Rose Pill + Dashed Red/Rose Pill */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onOpenAdmission}
                className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                {primaryCtaText || 'Get Admission'}
              </button>

              <button
                type="button"
                onClick={handleLearnMoreClick}
                className="px-6 py-3 rounded-full border-2 border-dashed border-rose-500 hover:border-rose-600 text-rose-600 hover:text-rose-700 hover:bg-rose-50/70 font-black text-sm flex items-center space-x-2 transition-all cursor-pointer"
              >
                <span className="w-5 h-5 rounded-full border border-rose-500 flex items-center justify-center text-xs">
                  →
                </span>
                <span>{secondaryCtaText || 'Learn more'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: 16:9 Video Box matching Screenshot 1 */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 bg-slate-900 group">
              {!isPlaying ? (
                <div className="relative w-full h-full">
                  <img
                    src={videoThumbnailUrl || "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80"}
                    alt="Campus & Freelancing Video"
                    width={800}
                    height={450}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(true)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer group-hover:scale-110"
                      aria-label="Play Video"
                    >
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4 bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>{videoBadgeText || 'কম্পিউটার বা ফ্রিল্যান্সিং শিখে ক্যারিয়ার গড়ার উপায়'}</span>
                  </div>
                </div>
              ) : (
                <iframe
                  src={effectiveVideoEmbed}
                  title="Campus Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
