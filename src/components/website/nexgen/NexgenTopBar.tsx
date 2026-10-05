import React from 'react';
import { Phone, Mail, Tag } from 'lucide-react';

interface UniqueItTopBarProps {
  phone?: string;
  email?: string;
  onOpenDiscount?: () => void;
  isAuthenticated?: boolean;
  onOpenStaffLogin?: () => void;
  onOpenCmsAdmin?: () => void;
}

export const NexgenTopBar: React.FC<UniqueItTopBarProps> = ({
  phone = '01798444444',
  email = 'info@nexgenacademy.edu.bd',
  onOpenDiscount,
  isAuthenticated,
  onOpenStaffLogin,
  onOpenCmsAdmin
}) => {
  return (
    <div className="bg-[#6b1cb0] text-white text-[11px] sm:text-[12px] py-1.5 sm:py-2 px-3 sm:px-4 font-medium tracking-wide border-b border-purple-900/30 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center space-x-3 sm:space-x-6 shrink-0">
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="flex items-center space-x-1.5 hover:text-amber-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="font-semibold">{phone}</span>
          </a>
          <a
            href={`mailto:${email}`}
            className="hidden md:flex items-center space-x-1.5 hover:text-amber-200 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{email}</span>
          </a>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center space-x-1.5">
              {onOpenCmsAdmin && (
                <button
                  type="button"
                  onClick={onOpenCmsAdmin}
                  className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] uppercase hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  CMS
                </button>
              )}
              {onOpenStaffLogin && (
                <button
                  type="button"
                  onClick={onOpenStaffLogin}
                  className="px-2 py-0.5 rounded-md bg-white/20 text-white font-bold text-[10px] uppercase hover:bg-white/30 transition-colors cursor-pointer"
                >
                  ERP
                </button>
              )}
            </div>
          ) : (
            onOpenStaffLogin && (
              <button
                type="button"
                onClick={onOpenStaffLogin}
                className="text-[11px] font-bold text-purple-200 hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
              >
                <span>Staff Portal</span>
              </button>
            )
          )}

          {onOpenDiscount && (
            <button
              type="button"
              onClick={onOpenDiscount}
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white text-[10px] sm:text-[11px] font-black uppercase px-2.5 sm:px-3 py-0.5 rounded-full shadow-xs transition-all flex items-center space-x-1 cursor-pointer active:scale-95 shrink-0"
            >
              <Tag className="w-3 h-3" />
              <span>GET DISCOUNT</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { NexgenTopBar as UniqueItTopBar };
