import React from 'react';
import { Phone, Mail, Tag } from 'lucide-react';

interface UniqueItTopBarProps {
  phone?: string;
  email?: string;
  onOpenDiscount?: () => void;
}

export const UniqueItTopBar: React.FC<UniqueItTopBarProps> = ({
  phone = '+8801722-007005',
  email = 'info@uniqueitinstitute.com',
  onOpenDiscount
}) => {
  return (
    <div className="bg-[#6b1cb0] text-white text-[12px] py-1.5 px-4 font-medium tracking-wide">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="flex items-center space-x-1.5 hover:text-amber-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{phone}</span>
          </a>
          <a
            href={`mailto:${email}`}
            className="hidden sm:flex items-center space-x-1.5 hover:text-amber-200 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{email}</span>
          </a>
        </div>

        <div>
          <button
            type="button"
            onClick={onOpenDiscount}
            className="bg-[#ff5722] hover:bg-[#f4511e] text-white text-[11px] font-black uppercase px-3 py-0.5 rounded-full shadow-xs transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
          >
            <Tag className="w-3 h-3" />
            <span>GET DISCOUNT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
