import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, ArrowUp, GraduationCap } from 'lucide-react';
import { FloatingActionWidgetConfig } from '../../types';
import { getWhatsAppDirectUrl } from '../../utils/whatsappHelper';
import { trackMetaPixelEvent } from '../../utils/analyticsTracker';

interface FloatingActionWidgetProps {
  config?: FloatingActionWidgetConfig;
  onOpenAdmission: () => void;
  defaultPhone?: string;
  instituteName?: string;
}

export const FloatingActionWidget: React.FC<FloatingActionWidgetProps> = ({
  config,
  onOpenAdmission,
  defaultPhone,
  instituteName
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (config && config.enabled === false) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappNumber = config?.whatsappNumber || defaultPhone || '01798444444';
  const callNumber = config?.callNumber || defaultPhone || '01798444444';
  const whatsappMsg =
    config?.whatsappMessage ||
    `হ্যালো ${instituteName || 'Academy'}! আমি কোর্স ও ভর্তি সংক্রান্ত তথ্য জানতে চাচ্ছি।`;

  const posClass =
    config?.position === 'bottom_left'
      ? 'left-4 sm:left-6 items-start'
      : 'right-4 sm:right-6 items-end';

  return (
    <>
      {/* Desktop Floating Action Stack (Medium & Large Screens) */}
      <aside
        aria-label="Quick contact and action buttons"
        className={`hidden sm:flex fixed bottom-6 z-40 flex-col space-y-2.5 ${posClass}`}
      >
        {/* Scroll To Top Button */}
        {showScrollTop && config?.showScrollToTop !== false && (
          <button
            type="button"
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-lg border border-slate-700 backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* 1-Click Online Admission Quick Button */}
        {config?.showAdmissionButton !== false && (
          <button
            type="button"
            onClick={() => {
              trackMetaPixelEvent('InitiateCheckout', {
                source: 'floating_action_widget',
                action: 'admission_click'
              });
              onOpenAdmission();
            }}
            className="group flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-full shadow-xl shadow-indigo-600/30 border-2 border-white hover:scale-105 active:scale-95 transition-all text-xs font-black space-x-2 cursor-pointer"
            title="অনলাইন ভর্তি আবেদন"
          >
            <GraduationCap className="w-4 h-4 shrink-0 text-amber-300" />
            <span>অনলাইন ভর্তি আবেদন</span>
          </button>
        )}

        {/* Phone Call Hotline */}
        {config?.showCallButton !== false && callNumber && (
          <a
            href={`tel:${callNumber}`}
            onClick={() => {
              trackMetaPixelEvent('Contact', {
                channel: 'Phone Hotline Direct',
                position: 'floating_action_widget',
                phone: callNumber
              });
            }}
            className="group flex items-center bg-slate-950/90 hover:bg-slate-900 text-white px-3.5 py-2 rounded-full shadow-lg border border-slate-700 hover:scale-105 active:scale-95 transition-all text-xs font-bold space-x-2 cursor-pointer"
            title={`Call Hotline: ${callNumber}`}
          >
            <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-200 group-hover:text-white">
              হটলাইন: {callNumber}
            </span>
          </a>
        )}

        {/* WhatsApp Floating Chat */}
        {whatsappNumber && (
          <a
            href={getWhatsAppDirectUrl(whatsappNumber, whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackMetaPixelEvent('Contact', {
                channel: 'WhatsApp Floating Direct',
                position: 'floating_action_widget',
                phone: whatsappNumber
              });
            }}
            className="group bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 border-2 border-white cursor-pointer"
            title="WhatsApp Support"
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 fill-white text-emerald-500" />
            </div>
            <span className="font-bold text-xs">
              হোয়াটসঅ্যাপ ভর্তি সহায়তা
            </span>
          </a>
        )}
      </aside>

      {/* Mobile Floating Scroll-To-Top (Floats above mobile bottom dock) */}
      {showScrollTop && config?.showScrollToTop !== false && (
        <button
          type="button"
          onClick={scrollToTop}
          className="sm:hidden fixed bottom-18 right-3.5 z-40 p-2.5 rounded-full bg-slate-900/90 text-white shadow-xl border border-slate-700 backdrop-blur-md active:scale-90 transition-all cursor-pointer"
          title="Scroll to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Mobile Ergonomic Bottom Action Bar (Thumb-friendly & Zero Screen Obscurity) */}
      <nav
        aria-label="Mobile quick actions"
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 px-3 py-2 shadow-2xl safe-area-inset-bottom"
      >
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          {/* WhatsApp Direct */}
          {whatsappNumber && (
            <a
              href={getWhatsAppDirectUrl(whatsappNumber, whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackMetaPixelEvent('Contact', {
                  channel: 'WhatsApp Mobile Dock',
                  position: 'mobile_dock',
                  phone: whatsappNumber
                });
              }}
              className="flex-1 min-h-[42px] px-2 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-[11px] font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600 shrink-0" />
              <span>হোয়াটসঅ্যাপ</span>
            </a>
          )}

          {/* Direct Phone Call */}
          {config?.showCallButton !== false && callNumber && (
            <a
              href={`tel:${callNumber}`}
              onClick={() => {
                trackMetaPixelEvent('Contact', {
                  channel: 'Phone Hotline Mobile Dock',
                  position: 'mobile_dock',
                  phone: callNumber
                });
              }}
              className="flex-1 min-h-[42px] px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-100 text-[11px] font-bold flex items-center justify-center space-x-1.5 border border-slate-700 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>কল করুন</span>
            </a>
          )}

          {/* Primary CTA: Online Admission */}
          {config?.showAdmissionButton !== false && (
            <button
              type="button"
              onClick={() => {
                trackMetaPixelEvent('InitiateCheckout', {
                  source: 'mobile_dock_widget',
                  action: 'admission_click'
                });
                onOpenAdmission();
              }}
              className="flex-1 min-h-[42px] px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-98 text-white text-[11px] font-black flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all"
            >
              <GraduationCap className="w-4 h-4 text-amber-300 shrink-0" />
              <span>অনলাইন ভর্তি</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};
