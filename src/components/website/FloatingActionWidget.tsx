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
        className={`hidden sm:flex fixed bottom-5 z-40 flex-col items-end space-y-1.5 ${posClass}`}
      >
        {/* Scroll To Top Button */}
        {showScrollTop && config?.showScrollToTop !== false && (
          <button
            type="button"
            onClick={scrollToTop}
            className="p-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3 h-3" />
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
            className="group flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-full shadow-sm border border-indigo-500 hover:scale-105 active:scale-95 transition-all text-[11px] font-bold space-x-1 cursor-pointer"
            title="অনলাইন ভর্তি আবেদন"
          >
            <GraduationCap className="w-3 h-3 shrink-0 text-amber-300" />
            <span>ভর্তি আবেদন</span>
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
            className="group flex items-center bg-white hover:bg-slate-50 text-slate-800 px-2.5 py-1 rounded-full shadow-sm border border-slate-200 hover:scale-105 active:scale-95 transition-all text-[11px] font-semibold space-x-1 cursor-pointer"
            title={`Call Hotline: ${callNumber}`}
          >
            <Phone className="w-2.5 h-2.5 text-amber-500 shrink-0" />
            <span className="text-slate-700 group-hover:text-slate-950 font-bold">
              {callNumber}
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
            className="group bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center space-x-1 border border-emerald-500 cursor-pointer"
            title="WhatsApp Support"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600 shrink-0" />
            <span className="font-bold text-[11px]">
              WhatsApp
            </span>
          </a>
        )}
      </aside>

      {/* Mobile Floating Scroll-To-Top (Floats above mobile bottom dock) */}
      {showScrollTop && config?.showScrollToTop !== false && (
        <button
          type="button"
          onClick={scrollToTop}
          className="sm:hidden fixed bottom-14 right-3 z-40 p-1.5 rounded-full bg-white text-slate-700 shadow-sm border border-slate-200 active:scale-90 transition-all cursor-pointer"
          title="Scroll to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-3 h-3" />
        </button>
      )}

      {/* Mobile Ergonomic Bottom Action Bar (Thumb-friendly & Clean White Theme) */}
      <nav
        aria-label="Mobile quick actions"
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2.5 py-1 shadow-md safe-area-inset-bottom"
      >
        <div className="flex items-center justify-between gap-1.5 max-w-md mx-auto">
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
              className="flex-1 min-h-[32px] px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 active:scale-98 text-[10px] font-bold flex items-center justify-center space-x-1 transition-all"
            >
              <MessageCircle className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>WhatsApp</span>
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
              className="flex-1 min-h-[32px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 active:scale-98 text-[10px] font-bold flex items-center justify-center space-x-1 transition-all"
            >
              <Phone className="w-2.5 h-2.5 text-amber-600 shrink-0" />
              <span>হটলাইন</span>
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
              className="flex-1 min-h-[32px] px-2 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-[10px] font-bold flex items-center justify-center space-x-1 shadow-2xs transition-all"
            >
              <GraduationCap className="w-3 h-3 text-amber-300 shrink-0" />
              <span>অনলাইন ভর্তি</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};
