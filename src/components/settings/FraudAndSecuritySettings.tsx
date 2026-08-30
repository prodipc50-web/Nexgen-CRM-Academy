import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Save,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
  Bot,
  Activity,
  KeyRound,
  FileCheck,
  LayoutTemplate,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Check,
  Layers,
  FileText
} from 'lucide-react';
import { FraudProtectionConfig, OtpVerificationConfig, LeadFormConfig, LeadFormFieldSetting } from '../../types';

export const FraudAndSecuritySettings: React.FC = () => {
  const { websiteCmsConfig, updateWebsiteCmsConfig } = useAcademy();

  const [fraudForm, setFraudForm] = useState<FraudProtectionConfig>(
    websiteCmsConfig?.fraudProtection || {
      enableRateLimiting: true,
      rateLimitMaxRequestsPerMinute: 5,
      enableDuplicateDetection: true,
      enableHoneypot: true,
      minSubmissionTimeSeconds: 3,
      captchaMode: 'HIGH_RISK_ONLY',
      enableRiskScoring: true,
      highRiskThreshold: 60,
      suspiciousThreshold: 30,
      autoBlockHighRisk: false
    }
  );

  const [otpForm, setOtpForm] = useState<OtpVerificationConfig>(
    websiteCmsConfig?.otpConfig || {
      mode: 'HIGH_RISK_ONLY',
      provider: 'SIMULATED',
      otpExpiryMinutes: 5,
      maxAttempts: 3,
      resendCooldownSeconds: 60,
      maxResendsPerSession: 3,
      lockoutMinutes: 15
    }
  );

  const defaultLeadFields: LeadFormFieldSetting[] = [
    { id: 'f-name', fieldKey: 'studentName', label: 'আপনার নাম (Student Full Name)', placeholder: 'যেমন: মো: সাইফুল ইসলাম', enabled: true, required: true, sortOrder: 1 },
    { id: 'f-phone', fieldKey: 'phone', label: 'মোবাইল নম্বর (Active WhatsApp / Phone)', placeholder: '017XXXXXXXX', enabled: true, required: true, sortOrder: 2 },
    { id: 'f-course', fieldKey: 'courseId', label: 'পছন্দের কোর্স (Selected Course)', placeholder: 'কোর্স নির্বাচন করুন', enabled: true, required: true, sortOrder: 3 },
    { id: 'f-schedule', fieldKey: 'preferredSchedule', label: 'সুবিধাজনক সময় (Preferred Schedule)', placeholder: 'সময় নির্বাচন করুন', enabled: true, required: true, sortOrder: 4 },
    { id: 'f-mode', fieldKey: 'learningMode', label: 'শেখার মাধ্যম (Learning Mode)', placeholder: 'অফলাইন ল্যাব / অনলাইন লাইভ', enabled: true, required: false, sortOrder: 5 },
    { id: 'f-email', fieldKey: 'email', label: 'ইমেইল অ্যাড্রেস (Email Address)', placeholder: 'example@gmail.com', enabled: true, required: false, sortOrder: 6 },
    { id: 'f-education', fieldKey: 'education', label: 'শিক্ষাগত যোগ্যতা (Education)', placeholder: 'যেমন: HSC / Diploma / B.Sc', enabled: true, required: false, sortOrder: 7 },
    { id: 'f-institution', fieldKey: 'institution', label: 'প্রতিষ্ঠান / বিশ্ববিদ্যালয় (Institution)', placeholder: 'যেমন: ঢাকা কলেজ / পলিটেকনিক', enabled: true, required: false, sortOrder: 8 },
    { id: 'f-profession', fieldKey: 'profession', label: 'বর্তমান পেশা (Profession)', placeholder: 'যেমন: Student / Job Holder', enabled: true, required: false, sortOrder: 9 },
    { id: 'f-address', fieldKey: 'address', label: 'বর্তমান ঠিকানা / এলাকা (Address)', placeholder: 'যেমন: ফার্মগেট, ঢাকা', enabled: true, required: false, sortOrder: 10 },
    { id: 'f-message', fieldKey: 'message', label: 'মন্তব্য বা প্রশ্ন (Message / Note)', placeholder: 'কোর্স সম্পর্কে আপনার কোনো প্রশ্ন থাকলে লিখুন...', enabled: true, required: false, sortOrder: 11 }
  ];

  const [leadFormConfig, setLeadFormConfig] = useState<LeadFormConfig>(
    websiteCmsConfig?.leadFormConfig || {
      isEnabled: true,
      formTitle: 'কোর্স ভর্তি ও স্কলারশিপ আবেদন ফরম',
      formSubtitle: 'নিচের ফরমটি পূরণ করুন। আমাদের এডমিশন টিম আপনার সাথে দ্রুত যোগাযোগ করবে।',
      submitButtonText: 'আবেদন নিশ্চিত করুন',
      successMessage: 'ধন্যবাদ! আপনার তথ্য আমাদের সিস্টেমে সংরক্ষিত হয়েছে। আমাদের ক্যারিয়ার কাউন্সেলর খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।',
      enableCaptcha: false,
      captchaMode: 'HIGH_RISK_ONLY',
      enableOtp: true,
      otpMode: 'HIGH_RISK_ONLY',
      duplicateAction: 'CREATE_FOLLOWUP',
      defaultLearningMode: 'Offline',
      fields: defaultLeadFields
    }
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    updateWebsiteCmsConfig({
      ...websiteCmsConfig,
      fraudProtection: fraudForm,
      otpConfig: otpForm,
      leadFormConfig: leadFormConfig
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setFraudForm({
      enableRateLimiting: true,
      rateLimitMaxRequestsPerMinute: 5,
      enableDuplicateDetection: true,
      enableHoneypot: true,
      minSubmissionTimeSeconds: 3,
      captchaMode: 'HIGH_RISK_ONLY',
      enableRiskScoring: true,
      highRiskThreshold: 60,
      suspiciousThreshold: 30,
      autoBlockHighRisk: false
    });
    setOtpForm({
      mode: 'HIGH_RISK_ONLY',
      provider: 'SIMULATED',
      otpExpiryMinutes: 5,
      maxAttempts: 3,
      resendCooldownSeconds: 60,
      maxResendsPerSession: 3,
      lockoutMinutes: 15
    });
    setLeadFormConfig({
      isEnabled: true,
      formTitle: 'কোর্স ভর্তি ও স্কলারশিপ আবেদন ফরম',
      formSubtitle: 'নিচের ফরমটি পূরণ করুন। আমাদের এডমিশন টিম আপনার সাথে দ্রুত যোগাযোগ করবে।',
      submitButtonText: 'আবেদন নিশ্চিত করুন',
      successMessage: 'ধন্যবাদ! আপনার তথ্য আমাদের সিস্টেমে সংরক্ষিত হয়েছে। আমাদের ক্যারিয়ার কাউন্সেলর খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।',
      enableCaptcha: false,
      captchaMode: 'HIGH_RISK_ONLY',
      enableOtp: true,
      otpMode: 'HIGH_RISK_ONLY',
      duplicateAction: 'CREATE_FOLLOWUP',
      defaultLearningMode: 'Offline',
      fields: defaultLeadFields
    });
  };

  // Field manipulation helpers
  const handleToggleFieldEnabled = (fieldKey: string) => {
    setLeadFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.fieldKey === fieldKey ? { ...f, enabled: !f.enabled } : f)
    }));
  };

  const handleToggleFieldRequired = (fieldKey: string) => {
    setLeadFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.fieldKey === fieldKey ? { ...f, required: !f.required } : f)
    }));
  };

  const handleUpdateFieldLabel = (fieldKey: string, label: string) => {
    setLeadFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.fieldKey === fieldKey ? { ...f, label } : f)
    }));
  };

  const handleUpdateFieldPlaceholder = (fieldKey: string, placeholder: string) => {
    setLeadFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.fieldKey === fieldKey ? { ...f, placeholder } : f)
    }));
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const fields = [...leadFormConfig.fields];
    if (direction === 'up' && index > 0) {
      const temp = fields[index];
      fields[index] = fields[index - 1];
      fields[index - 1] = temp;
    } else if (direction === 'down' && index < fields.length - 1) {
      const temp = fields[index];
      fields[index] = fields[index + 1];
      fields[index + 1] = temp;
    }
    const updated = fields.map((f, i) => ({ ...f, sortOrder: i + 1 }));
    setLeadFormConfig(prev => ({ ...prev, fields: updated }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/20 p-5 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-black rounded-lg uppercase tracking-wider border border-rose-500/30">
              Zero-Spam Shield
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Anomaly Detection Online</span>
            </span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Fraud Protection, Bot Honeypots & OTP Gateway</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl">
            Protect ad budgets and admission forms from fake phone numbers, click farms, competitor bot flooding, and rapid-fire spam submissions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center space-x-1.5 transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Recommended</span>
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Security Rules</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-700 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Fraud protection and OTP gateway policies have been updated successfully!</span>
        </div>
      )}

      {/* Grid: Fraud Prevention & OTP Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Multi-Layer Fraud & Bot Trapping */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">Bot Defense & Rate Limiting</h4>
              <p className="text-xs text-slate-500">Heuristic behavior analysis & automatic honeypot fields</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Honeypot toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="font-black text-slate-800 block">Invisible Honeypot Bot Traps</span>
                <span className="text-slate-500 text-[11px]">Injects hidden form fields that only automated scrapers fill</span>
              </div>
              <input
                type="checkbox"
                checked={fraudForm.enableHoneypot}
                onChange={e => setFraudForm({ ...fraudForm, enableHoneypot: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
            </div>

            {/* Human Minimum Speed Threshold */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-800">Minimum Human Submission Time</span>
                <span className="font-mono font-black text-indigo-600">{fraudForm.minSubmissionTimeSeconds} seconds</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Flags submissions that happen faster than a human could physically read & type the form.
              </p>
              <input
                type="range"
                min={1}
                max={10}
                value={fraudForm.minSubmissionTimeSeconds}
                onChange={e => setFraudForm({ ...fraudForm, minSubmissionTimeSeconds: Number(e.target.value) })}
                className="w-full accent-rose-600"
              />
            </div>

            {/* Rate Limiting */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-800">Rate Limiting Threshold</span>
                <input
                  type="checkbox"
                  checked={fraudForm.enableRateLimiting}
                  onChange={e => setFraudForm({ ...fraudForm, enableRateLimiting: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-500">Max requests per device/IP per minute:</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={fraudForm.rateLimitMaxRequestsPerMinute}
                  onChange={e => setFraudForm({ ...fraudForm, rateLimitMaxRequestsPerMinute: Number(e.target.value) })}
                  className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-center font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Duplicate Detection */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="font-black text-slate-800 block">Duplicate Phone Cooldown</span>
                <span className="text-slate-500 text-[11px]">Prevents duplicate registration spam within 5 minutes</span>
              </div>
              <input
                type="checkbox"
                checked={fraudForm.enableDuplicateDetection}
                onChange={e => setFraudForm({ ...fraudForm, enableDuplicateDetection: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
            </div>

            {/* Auto Block High Risk */}
            <div className="flex items-center justify-between p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
              <div>
                <span className="font-black text-rose-900 block">Auto-Block Critical Threat Scores</span>
                <span className="text-rose-700 text-[11px]">Silently drop submissions scoring 95+ without alerting attackers</span>
              </div>
              <input
                type="checkbox"
                checked={fraudForm.autoBlockHighRisk}
                onChange={e => setFraudForm({ ...fraudForm, autoBlockHighRisk: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: OTP Verification Engine */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">OTP Verification Gateway</h4>
              <p className="text-xs text-slate-500">2-Factor validation for genuine student phone numbers</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* OTP Mode */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase mb-1.5">
                OTP Activation Policy
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['OFF', 'HIGH_RISK_ONLY', 'ON'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setOtpForm({ ...otpForm, mode })}
                    className={`py-2 px-2.5 rounded-xl font-black text-[11px] border transition-all ${
                      otpForm.mode === mode
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mode === 'OFF' && 'Disabled'}
                    {mode === 'HIGH_RISK_ONLY' && 'Suspicious Only'}
                    {mode === 'ON' && 'Always Required'}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                "Suspicious Only" keeps low friction for genuine users while challenging bot patterns.
              </p>
            </div>

            {/* Provider */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase mb-1.5">
                Delivery Provider Gateway
              </label>
              <select
                value={otpForm.provider}
                onChange={e => setOtpForm({ ...otpForm, provider: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="SIMULATED">Simulated Demo Gateway (Shows on Screen & Console)</option>
                <option value="BANGLADESH_SMS">Bangladesh Bulk SMS Gateway (Greenweb / SSL)</option>
                <option value="WHATSAPP_OTP">Official WhatsApp Cloud OTP API</option>
                <option value="FIREBASE_AUTH">Firebase Phone Auth</option>
              </select>
            </div>

            {/* Expiry & Attempts */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 block text-[11px]">OTP Validity</span>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={otpForm.otpExpiryMinutes}
                    onChange={e => setOtpForm({ ...otpForm, otpExpiryMinutes: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-center font-bold text-slate-800"
                  />
                  <span className="text-slate-500 font-medium">minutes</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 block text-[11px]">Max Retry Attempts</span>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={otpForm.maxAttempts}
                    onChange={e => setOtpForm({ ...otpForm, maxAttempts: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-center font-bold text-slate-800"
                  />
                  <span className="text-slate-500 font-medium">tries</span>
                </div>
              </div>
            </div>

            {/* Resend Cooldown */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-black text-slate-800 block">Resend Timer Cooldown</span>
                <span className="text-slate-500 text-[11px]">Seconds to wait before student can request new code</span>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min={30}
                  max={180}
                  value={otpForm.resendCooldownSeconds}
                  onChange={e => setOtpForm({ ...otpForm, resendCooldownSeconds: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-center font-bold text-slate-800"
                />
                <span className="text-slate-500">sec</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Lead & Admission Form Customizer */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-2xl">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">Website & Landing Page Lead Form Customizer</h4>
              <p className="text-xs text-slate-500">
                Configure visible fields, required/optional validations, labels, and placeholders across all public forms
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 self-start sm:self-center">
            {leadFormConfig.fields.filter(f => f.enabled).length} of {leadFormConfig.fields.length} Fields Active
          </span>
        </div>

        {/* Top Form Level Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Form Title (Bangla / English)</label>
            <input
              type="text"
              value={leadFormConfig.formTitle}
              onChange={e => setLeadFormConfig({ ...leadFormConfig, formTitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Submit Button Label</label>
            <input
              type="text"
              value={leadFormConfig.submitButtonText}
              onChange={e => setLeadFormConfig({ ...leadFormConfig, submitButtonText: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="font-bold text-slate-700 block">Form Subtitle / Instructions</label>
            <input
              type="text"
              value={leadFormConfig.formSubtitle}
              onChange={e => setLeadFormConfig({ ...leadFormConfig, formSubtitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="font-bold text-slate-700 block">Bangla Success Message (Shown after verification)</label>
            <textarea
              rows={2}
              value={leadFormConfig.successMessage}
              onChange={e => setLeadFormConfig({ ...leadFormConfig, successMessage: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white text-xs resize-none"
            />
          </div>
        </div>

        {/* Dynamic Fields Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-black text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Form Fields Order & Validation Rules</span>
            </h5>
            <span className="text-[11px] text-slate-400">Use arrows to adjust field display position</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-3">Field Key</th>
                  <th className="py-2.5 px-3 min-w-[180px]">Display Label</th>
                  <th className="py-2.5 px-3 min-w-[180px]">Placeholder</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Required</th>
                  <th className="py-2.5 px-3 text-center">Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leadFormConfig.fields.map((field, idx) => (
                  <tr key={field.id || field.fieldKey} className={`hover:bg-slate-50/80 transition-colors ${!field.enabled ? 'opacity-40 bg-slate-50/50' : ''}`}>
                    <td className="py-2.5 px-3 font-mono text-center text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 font-bold">
                      {field.fieldKey}
                      {['studentName', 'phone', 'courseId'].includes(field.fieldKey) && (
                        <span className="ml-1.5 text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-sans">Core</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={field.label}
                        onChange={e => handleUpdateFieldLabel(field.fieldKey, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={e => handleUpdateFieldPlaceholder(field.fieldKey, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFieldEnabled(field.fieldKey)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          field.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                        title={field.enabled ? 'Field Enabled (Click to Hide)' : 'Field Disabled (Click to Show)'}
                      >
                        {field.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={() => handleToggleFieldRequired(field.fieldKey)}
                        disabled={['studentName', 'phone'].includes(field.fieldKey)}
                        className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500 disabled:opacity-50"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="inline-flex items-center space-x-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveField(idx, 'up')}
                          className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-20 rounded hover:bg-slate-100"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === leadFormConfig.fields.length - 1}
                          onClick={() => handleMoveField(idx, 'down')}
                          className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-20 rounded hover:bg-slate-100"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
