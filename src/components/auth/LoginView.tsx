import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Headphones,
  CreditCard,
  GraduationCap,
  Shield,
  Phone
} from 'lucide-react';

interface LoginViewProps {
  onBackToWebsite?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBackToWebsite }) => {
  const { login } = useAcademy();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await login(identifier, password, rememberMe);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg(res.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Login failed. Please check your connection and credentials.');
    }
  };

  const handleReturnToWebsite = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
    if (onBackToWebsite) {
      onBackToWebsite();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Return to Public Website (Top Quick Exit) */}
        {onBackToWebsite && (
          <div className="flex justify-between items-center">
            <button
              onClick={handleReturnToWebsite}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all shadow-xs"
            >
              <span>← Back to Website (মূল ওয়েবসাইট)</span>
            </button>
            <span className="text-[11px] text-indigo-300/80 font-medium">Authorized Personnel Only</span>
          </div>
        )}

        {/* Brand Crest & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
              <NexgenLogo variant="crest" size={54} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Nexgen Computer Academy
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80 font-medium mt-1">
              Enterprise Office & Operations Management Portal
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Staff Secure Login</h2>
              <p className="text-xs text-slate-500">Sign in with your assigned username & password</p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2.5 text-rose-800 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-semibold">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-2.5 text-emerald-800 text-xs animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="font-semibold">{successMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username or Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Username or Official Email / Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="Enter your assigned username"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 font-medium">Remember my session</span>
              </label>

              <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>SSL Encrypted</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-75 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to ERP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Return to Public Website */}
        {onBackToWebsite && (
          <div className="flex justify-center">
            <button
              onClick={handleReturnToWebsite}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all shadow-sm"
            >
              <span>← Back to Public Website (মূল ওয়েবসাইটে ফিরুন)</span>
            </button>
          </div>
        )}

        {/* Security & System Info Footer */}
        <div className="text-center text-xs text-indigo-200/70 space-y-1 font-medium">
          <p>© {new Date().getFullYear()} Nexgen Computer Academy. All Rights Reserved.</p>
          <div className="flex items-center justify-center space-x-2 text-[11px]">
            <span>Enterprise ERP</span>
            <span>•</span>
            <span>Role-Based Access Control (RBAC)</span>
            <span>•</span>
            <span>Protected Gateway</span>
          </div>
        </div>
      </div>

      {/* Forgot Password / Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Account Access & Recovery</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Nexgen Computer Academy ERP portal access is strictly restricted to verified staff members, teachers, counselors, and administrative officers.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Credential Assistance:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  If you have forgotten your password or require staff portal login credentials, please contact the <strong>Managing Director</strong> or <strong>IT Administrator</strong> to receive your authorized access key.
                </p>
              </div>

              <div className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 space-y-1.5">
                <div className="font-bold text-indigo-950 flex items-center space-x-1.5">
                  <Phone className="w-4 h-4 text-indigo-600" />
                  <span>Administrative Helpdesk:</span>
                </div>
                <p className="text-slate-700">Helpline: <strong>+880 1798-444444</strong></p>
                <p className="text-slate-700">Official Email: <strong>prodipc50@gmail.com</strong></p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Close (বন্ধ করুন)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
