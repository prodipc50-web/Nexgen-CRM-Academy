import React from 'react';
import { Tag } from 'lucide-react';

interface UniqueItFloatingDiscountProps {
  onClick: () => void;
}

export const UniqueItFloatingDiscount: React.FC<UniqueItFloatingDiscountProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-[#ea580c] hover:bg-[#c2410c] text-white py-3 px-1.5 rounded-r-xl shadow-xl flex flex-col items-center space-y-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 group"
      title="Get Discount"
    >
      <Tag className="w-3.5 h-3.5 rotate-90 text-amber-200 group-hover:animate-bounce" />
      <span
        className="text-[10px] font-black uppercase tracking-wider text-white"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        GET DISCOUNT
      </span>
    </button>
  );
};
