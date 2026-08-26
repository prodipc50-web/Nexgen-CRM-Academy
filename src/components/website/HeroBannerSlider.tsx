import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroBannerSlide, AppLanguage } from '../../types';
import { getTranslation } from '../../utils/translations';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Play,
  Pause,
  ExternalLink
} from 'lucide-react';

interface HeroBannerSliderProps {
  slides: HeroBannerSlide[];
  language: AppLanguage;
  onOpenAdmission: () => void;
  onSelectCategory?: (category: string) => void;
}

export const HeroBannerSlider: React.FC<HeroBannerSliderProps> = ({
  slides,
  language,
  onOpenAdmission
}) => {
  const activeSlides = slides.filter(s => s.isActive !== false);
  const effectiveSlides = activeSlides.length > 0 ? activeSlides : [
    {
      id: 'default-slide',
      title: 'Build Your Tech Career with Hands-on Industry Training',
      subtitle: 'Master in-demand IT skills from top industry practitioners. 100% practical lab sessions, live freelance mentorship & verified job placement.',
      badgeText: 'Govt. Recognized IT Training Institute • Dhaka',
      ctaText: 'Explore Courses & Fees',
      ctaLink: '#courses',
      secondaryCtaText: 'Free Career Counseling',
      secondaryCtaLink: '#seminars',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1280&q=80',
      isActive: true
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play slides every 5.5 seconds
  useEffect(() => {
    if (isPlaying && effectiveSlides.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % effectiveSlides.length);
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, effectiveSlides.length, currentIndex]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % effectiveSlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + effectiveSlides.length) % effectiveSlides.length);
  };

  const currentSlide = effectiveSlides[currentIndex] || effectiveSlides[0];

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 group"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative min-h-[460px] sm:min-h-[520px] md:min-h-[560px] flex items-center">
        {/* Background Image Carousel with Ken-Burns and Cross-Fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <img
              src={currentSlide.imageUrl || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1280&q=80'}
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Multi-layer Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
          </motion.div>
        </AnimatePresence>

        {/* Slide Content Layer */}
        <div className="relative z-10 w-full max-w-4xl p-6 sm:p-10 md:p-14 space-y-4 sm:space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentSlide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 sm:space-y-5"
            >
              {/* Badge */}
              {currentSlide.badgeText && (
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-indigo-950/90 border border-indigo-400/40 rounded-full text-indigo-200 text-xs font-black shadow-lg backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
                  <span className="truncate">{currentSlide.badgeText}</span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight md:leading-[1.15] drop-shadow-md">
                {currentSlide.title}
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed max-w-2xl drop-shadow-sm">
                {currentSlide.subtitle}
              </p>

              {/* Call-to-action Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={currentSlide.ctaLink || '#courses'}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-indigo-600/30 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{currentSlide.ctaText || getTranslation(language, 'enrollNow')}</span>
                </a>

                {currentSlide.secondaryCtaText && (
                  <button
                    type="button"
                    onClick={onOpenAdmission}
                    className="px-5 py-3 bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 hover:text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 backdrop-blur-md transition-all flex items-center space-x-2"
                  >
                    <span>{currentSlide.secondaryCtaText}</span>
                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls (Next/Prev Arrows) */}
        {effectiveSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-indigo-600 text-white border border-slate-700/80 flex items-center justify-center backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-indigo-600 text-white border border-slate-700/80 flex items-center justify-center backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Bar: Slide Indicator Dots & Play/Pause */}
        <div className="absolute bottom-4 left-6 right-6 z-20 flex items-center justify-between pointer-events-auto">
          {/* Indicator Dots */}
          <div className="flex items-center space-x-2">
            {effectiveSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-8 h-2 bg-indigo-500 shadow-md shadow-indigo-500/50'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          {effectiveSlides.length > 1 && (
            <button
              type="button"
              onClick={() => setIsPlaying(p => !p)}
              className="p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center space-x-1 backdrop-blur-md"
              title={isPlaying ? 'Pause Auto-slide' : 'Play Auto-slide'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="text-[10px] font-mono pr-1">
                0{currentIndex + 1}/0{effectiveSlides.length}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
