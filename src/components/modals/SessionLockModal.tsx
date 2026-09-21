import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Lock, Unlock, AlertCircle, LogOut, Shield } from 'lucide-react';
import { NexgenLogo } from '../common/NexgenLogo';

export const SessionLockModal: React.FC = () => {
  const { isSessionLocked, currentUser, unlockSession, logout, academySettings } = useAcademy();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isSessionLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('পাসওয়ার্ড বা পিন লিখুন');
      return;
    }

    const success = unlockSession(password);
    if (success) {
      setPassword('');
      setError(null);
    } else {
      setError('ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 print:hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <NexgenLogo variant="crest" size={54} className="bg-white/10 p-1.5 rounded-2xl" />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {academySettings?.instituteName || 'Academy ERP'}
        </h3>
        <p className="text-xs text-amber-400 font-medium mb-5 flex items-center justify-center space-x-1">
          <Shield className="w-3.5 h-3.5" />
          <span>নিরাপত্তার স্বার্থে সেশন সাময়িকভাবে লক করা হয়েছে</span>
        </p>

        {/* User Card */}
        <div className="bg-slate-800/80 rounded-xl p-3.5 mb-5 flex items-center space-x-3 border border-slate-700/60 text-left">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'}
            alt={currentUser.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
            <div className="text-xs text-indigo-300 font-semibold">{currentUser.role}</div>
            <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
          </div>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 text-left mb-1.5">
              আনলক করতে আপনার পাসওয়ার্ড লিখুন
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="পাসওয়ার্ড প্রদান করুন..."
              autoFocus
              className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-lg text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={logout}
              className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>আনলক করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
