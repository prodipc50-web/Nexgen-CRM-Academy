import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Lock,
  Eye,
  Sliders,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import {
  getSecurityLogs,
  clearSecurityLogs,
  recordSecurityEvent,
  validatePublicSubmission,
  SecurityAuditLog
} from '../../../utils/securityDefense';

interface CmsSecurityShieldTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsSecurityShieldTab: React.FC<CmsSecurityShieldTabProps> = ({ onSuccessToast }) => {
  const [logs, setLogs] = useState<SecurityAuditLog[]>([]);
  const [testPayload, setTestPayload] = useState({
    name: 'Bot Tester <script>alert("hacked")</script>',
    phone: '01798444444',
    honeypotVal: '',
    message: 'Hello system <iframe src="evil.com"></iframe>'
  });
  const [testResult, setTestResult] = useState<{ isSafe: boolean; errorMessage?: string; sanitizedPayload?: any } | null>(null);

  const refreshLogs = () => {
    setLogs(getSecurityLogs());
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  const handleClearLogs = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে সমস্ত সিকিউরিটি অডিট লগ মুছে ফেলতে চান?')) {
      clearSecurityLogs();
      refreshLogs();
      onSuccessToast('সিকিউরিটি অডিট লগ মুছে ফেলা হয়েছে!');
    }
  };

  const handleRunSecurityTest = () => {
    const res = validatePublicSubmission(testPayload, {
      formName: 'Admin_Security_Simulated_Test',
      honeypotValue: testPayload.honeypotVal,
      phoneFieldName: 'phone',
      requirePhone: true
    });
    setTestResult(res);
    refreshLogs();
  };

  const handleSimulateHoneypot = () => {
    setTestPayload(prev => ({ ...prev, honeypotVal: 'automated_crawler_trap_triggered' }));
    const res = validatePublicSubmission(
      { ...testPayload, honeypotVal: 'automated_crawler_trap_triggered' },
      {
        formName: 'Honeypot_Bot_Simulation',
        honeypotValue: 'automated_crawler_trap_triggered',
        phoneFieldName: 'phone'
      }
    );
    setTestResult(res);
    refreshLogs();
    onSuccessToast('বট হানিপট ট্র্যাপ সক্রিয়ভাবে পরীক্ষা ও প্রতিরোধ করা হয়েছে!');
  };

  // Metric counts
  const botCount = logs.filter(l => l.threatType === 'BOT_HONEYPOT_TRIGGERED').length;
  const xssCount = logs.filter(l => l.threatType === 'XSS_INJECTION_DETECTED').length;
  const rateLimitCount = logs.filter(l => l.threatType === 'RATE_LIMIT_EXCEEDED').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Cyber Shield Active • 24/7 Defense Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center space-x-3">
              <ShieldAlert className="w-8 h-8 text-rose-400" />
              <span>সাইবার সিকিউরিটি & অ্যান্টি-হ্যাকার শিল্ড</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              স্বয়ংক্রিয় বট আক্রমণ, ফর্ম স্প্যাম ফ্লাডিং, ম্যালিশাস XSS স্ক্রিপ্ট ইনজেকশন এবং ক্ষতিকারক ডাটা সাবমিশন রিয়েল-টাইমে প্রতিরোধ ও অডিট করার জন্য উন্নত সাইবার ডিফেন্স ফ্রেমওয়ার্ক।
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={refreshLogs}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center space-x-2 backdrop-blur-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>রিফ্রেশ অডিট</span>
            </button>
            <button
              type="button"
              onClick={handleClearLogs}
              className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>লগ মুছুন</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 p-3.5 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">মোট প্রতিহত আক্রমণ</span>
            <span className="text-2xl font-black text-white mt-1 block">{logs.length}</span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 p-3.5 rounded-2xl">
            <span className="text-[11px] font-bold text-rose-400 block uppercase tracking-wider">XSS ইনজেকশন ব্লকড</span>
            <span className="text-2xl font-black text-rose-400 mt-1 block">{xssCount}</span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 p-3.5 rounded-2xl">
            <span className="text-[11px] font-bold text-amber-400 block uppercase tracking-wider">বট হানিপট ফাঁদ</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">{botCount}</span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 p-3.5 rounded-2xl">
            <span className="text-[11px] font-bold text-indigo-400 block uppercase tracking-wider">স্প্যাম ফ্লাড লিমিট</span>
            <span className="text-2xl font-black text-indigo-400 mt-1 block">{rateLimitCount}</span>
          </div>
        </div>
      </div>

      {/* Defense Modules Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-black text-slate-900">১. অটোমেটিক হানিপট ট্র্যাপ (Honeypot Trap)</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            স্বয়ংক্রিয় বট ও স্ক্র্যাপারদের জন্য অদৃশ্য ট্র্যাপ ফিল্ড রাখা হয়েছে। কোনো বট ফর্ম অটো-ফিল করার চেষ্টা করলেই সিস্টেম তাকে শনাক্ত করে তাৎক্ষণিক ব্লক করে দেয়।
          </p>
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active & Armed</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-black text-slate-900">২. ডিনায়াল-অব-সার্ভিস রেট লিমিটিং</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            কোনো একক ব্রাউজার বা ক্ষতিকারক ক্লায়েন্ট থেকে ১০ মিনিটে ৫ বারের বেশি সাবমিশন রিকোয়েস্ট এলে সিস্টেম তাৎক্ষণিক কুলডাউন কার্যকর করে সার্ভার নিরাপদ রাখে।
          </p>
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Rate-Limit Enforced</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-black text-slate-900">৩. ফুল-পেলোড XSS ও ইনজেকশন ক্লিনজার</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            যেকোনো টেক্সট ইনপুট (নাম, মেসেজ, মন্তব্য) থেকে &lt;script&gt;, &lt;iframe&gt;, javascript: ইউআরআই এবং ম্যালিশাস ইভেন্ট হ্যান্ডলার স্থায়ীভাবে নিষ্ক্রিয় করা হয়।
          </p>
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Full Sanitization Active</span>
          </div>
        </div>
      </div>

      {/* Interactive Security Sandbox Tester */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">অ্যাডমিন সাইবার ডিফেন্স সিমুলেটর (Live Attack Testing Sandbox)</h3>
          </div>
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Test Your Shield
          </span>
        </div>

        <p className="text-xs text-slate-600">
          আপনি নিজে ক্ষতিকারক স্ক্রিপ্ট ইনজেকশন বা বট ট্র্যাপ সিমুলেট করে দেখতে পারেন কীভাবে সিস্টেমটি আক্রমণ প্রতিহত করে এবং নিরাপদ আউটপুট প্রদান করে।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">টেস্ট নাম (Script Attack Pattern সহ)</label>
            <input
              type="text"
              value={testPayload.name}
              onChange={e => setTestPayload({ ...testPayload, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">টেস্ট বার্তা (Iframe / Script Attack সহ)</label>
            <input
              type="text"
              value={testPayload.message}
              onChange={e => setTestPayload({ ...testPayload, message: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleRunSecurityTest}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>আক্রমণ টেস্ট ও ডিফেন্স যাচাই করুন</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateHoneypot}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md shadow-rose-600/20 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>বট হানিপট ট্র্যাপ সিমুলেট করুন</span>
          </button>
        </div>

        {/* Test Result Inspection Box */}
        {testResult && (
          <div className={`p-4 rounded-2xl border text-xs space-y-2 mt-4 ${
            testResult.isSafe ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-rose-50/70 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center space-x-2 font-black text-sm">
              {testResult.isSafe ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
              <span>{testResult.isSafe ? 'ডিফেন্স সফল: ডাটা সেনিটাইজ ও সুরক্ষিত করা হয়েছে!' : 'ডিফেন্স সফল: আক্রমণ শনাক্ত ও প্রতিরোধ করা হয়েছে!'}</span>
            </div>

            {testResult.errorMessage && (
              <p className="font-bold text-rose-700">প্রতিরোধের কারণ: {testResult.errorMessage}</p>
            )}

            {testResult.sanitizedPayload && (
              <div className="mt-2 pt-2 border-t border-slate-200/50">
                <span className="font-bold block text-slate-700 mb-1">সেনিটাইজড নিরাপদ আউটপুট:</span>
                <pre className="p-3 bg-white rounded-xl text-[11px] font-mono overflow-x-auto text-slate-800 border border-slate-200">
                  {JSON.stringify(testResult.sanitizedPayload, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Real-time Security Incident Logs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <span>সাইবার সিকিউরিটি ইনসিডেন্ট অডিট লগ ({logs.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ওয়েবসাইট ও ফর্মে প্রতিটি প্রতিরোধকৃত আক্রমণ বা অস্বাভাবিক কার্যকলাপের বিস্তারিত রেকর্ড।
            </p>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-black text-slate-800">কোনো নিরাপত্তা ঝুঁকি শনাক্ত হয়নি</h4>
            <p className="text-xs text-slate-500 mt-1">
              আপনার সিস্টেম সম্পূর্ণ নিরাপদ রয়েছে। নতুন কোনো স্প্যাম বা বট আক্রমণ প্রতিরোধ হলে তা সাথে সাথে এখানে দেখা যাবে।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="pb-3 px-3">সময়</th>
                  <th className="pb-3 px-3">হুমকির ধরণ</th>
                  <th className="pb-3 px-3">তীব্রতা</th>
                  <th className="pb-3 px-3">উৎস ফর্ম</th>
                  <th className="pb-3 px-3">বিস্তারিত বিবরণ</th>
                  <th className="pb-3 px-3">ক্লায়েন্ট ফিঙ্গারপ্রিন্ট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      <span className="block text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleDateString('bn-BD')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider ${
                        log.threatType === 'BOT_HONEYPOT_TRIGGERED' ? 'bg-amber-100 text-amber-800' :
                        log.threatType === 'XSS_INJECTION_DETECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {log.threatType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        log.severity === 'CRITICAL' ? 'bg-rose-600 text-white' :
                        log.severity === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-700">{log.sourceForm}</td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-400">{log.clientFingerprint || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
