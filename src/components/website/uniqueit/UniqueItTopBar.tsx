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

export const UniqueItTopBar: React.FC<UniqueItTopBarProps> = ({
  phone = '01798444444',
  email = 'info@nexgenacademy.edu.bd',
  onOpenDiscount,
  isAuthenticated,
  onOpenStaffLogin,
  onOpenCmsAdmin
}) => {
  return (
    <div className="bg-[#6b1cb0] text-white text-[12px] py-2 px-4 font-medium tracking-wide border-b border-purple-900/30">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 sm:space-x-6">
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

        <div className="flex items-center space-x-3">
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
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white text-[11px] font-black uppercase px-3 py-0.5 rounded-full shadow-xs transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
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
