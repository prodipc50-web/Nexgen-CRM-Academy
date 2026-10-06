import React from 'react';
import { Phone, MessageCircle, Sparkles } from 'lucide-react';

interface NexgenMobileStickyBarProps {
  onOpenAdmission: () => void;
  phone?: string;
  whatsappNumber?: string;
  instituteName?: string;
}

export const NexgenMobileStickyBar: React.FC<NexgenMobileStickyBarProps> = ({
  onOpenAdmission,
  phone = '01798444444',
  whatsappNumber = '01798444444',
  instituteName = 'NexGen Computer Academy'
}) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
  const waFull = cleanWa.startsWith('88') ? cleanWa : `88${cleanWa}`;
  const prefilledWaMessage = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি ${instituteName}-এর অফলাইন/অনলাইন কোর্স ও ভর্তি সংক্রান্ত তথ্য জানতে চাই।`
  );

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-2 px-3 safe-area-bottom">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {/* Direct Call Button */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-colors active:scale-95"
          title="সরাসরি কল করুন"
        >
          <Phone className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span className="text-[10px] font-bold">কল করুন</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${waFull}?text=${prefilledWaMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition-colors active:scale-95"
          title="WhatsApp-এ চ্যাট করুন"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span className="text-[10px] font-bold">WhatsApp</span>
        </a>

        {/* Quick Admission Button */}
        <button
          type="button"
          onClick={onOpenAdmission}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#dc2626] hover:from-[#be123c] hover:to-[#b91c1c] text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
          title="অনলাইন ভর্তি ফর্ম"
        >
          <Sparkles className="w-4 h-4 text-amber-200 mb-0.5" />
          <span className="text-[10px] font-black uppercase tracking-tight">ভর্তি হন</span>
        </button>
      </div>
    </div>
  );
};
