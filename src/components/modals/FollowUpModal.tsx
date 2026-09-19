import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Lead, FollowUpMethod, FollowUpResult, LeadStatus } from '../../types';
import { X, Calendar, PhoneCall, MessageSquare, UserCheck, CheckCircle2, History, Clock, ArrowRight, Tag } from 'lucide-react';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({ isOpen, onClose, lead }) => {
  const { currentUser, addFollowUp, followUps } = useAcademy();

  const [activeTab, setActiveTab] = useState<'log' | 'history'>('log');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<FollowUpMethod>('Phone Call');
  const [result, setResult] = useState<FollowUpResult>('Interested');
  const [targetStatus, setTargetStatus] = useState<string>('auto');
  const [notes, setNotes] = useState('');
  const [nextAction, setNextAction] = useState('Call back regarding batch schedule');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]);

  if (!isOpen || !lead) return null;

  const previousLogs = followUps.filter(f => f.leadId === lead.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFollowUp({
      leadId: lead.id,
      staffName: currentUser?.name || 'Counselor',
      counselorId: currentUser?.id,
      date,
      method,
      contactMethod: method,
      result,
      notes,
      nextAction,
      newLeadStatus: targetStatus !== 'auto' ? (targetStatus as LeadStatus) : undefined,
      nextFollowUpDate: result !== 'Admitted' && result !== 'Not Interested' ? nextFollowUpDate : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-600">
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">কাউন্সেলিং ও ফলো-আপ লগ</h3>
              <p className="text-[11px] text-indigo-200">
                লিড: <span className="font-semibold text-white">{lead.name}</span> ({lead.phone})
                {lead.courseName && <span> • {lead.courseName}</span>}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-indigo-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('log')}
            className={`flex items-center space-x-1.5 px-4 py-2 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              activeTab === 'log'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>নতুন যোগাযোগ এন্ট্রি</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-1.5 px-4 py-2 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>পূর্ববর্তী হিস্ট্রি ({previousLogs.length})</span>
          </button>
        </div>

        {activeTab === 'log' ? (
          /* Log New Follow-up Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">যোগাযোগের তারিখ *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">যোগাযোগের মাধ্যম *</label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value as FollowUpMethod)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Phone Call">📞 ফোন কল (Phone Call)</option>
                  <option value="WhatsApp">💬 WhatsApp মেসেজ</option>
                  <option value="SMS">✉️ সরাসরি SMS</option>
                  <option value="In-Person Visit">🏢 সরাসরি ভিজিট (In-Person / Walk-in)</option>
                  <option value="Email">📧 ইমেইল (Email)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  ফলো-আপ ফলাফল / রেজাল্ট <span className="text-rose-500">*</span>
                </label>
                <select
                  value={result}
                  onChange={e => setResult(e.target.value as FollowUpResult)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Interested">Interested (আগ্রহী / বিবেচনাধীন)</option>
                  <option value="Demo Scheduled">Demo Scheduled (ডেমো ক্লাস শিডিউলড)</option>
                  <option value="Admission Pending">Admission Pending (ভর্তি হতে সম্মত / ডিপোজিট বাকি)</option>
                  <option value="Admitted">Admitted (ভর্তি সম্পন্ন)</option>
                  <option value="Call Later / Reschedule">Call Later (পরে কল করতে বলেছে / ব্যস্ত)</option>
                  <option value="No Answer">No Answer (কল ধরেনি / বন্ধ)</option>
                  <option value="Wants Discount">Wants Discount (ডিসকাউন্ট প্রত্যাশী)</option>
                  <option value="Wants Different Batch">Wants Different Batch (ভিন্ন ব্যাচ সময় চায়)</option>
                  <option value="Family Discussion">Family Discussion (অভিভাবকের সাথে কথা বলবে)</option>
                  <option value="Payment Issue">Payment Issue (আর্থিক সমস্যা)</option>
                  <option value="Not Interested">Not Interested (আগ্রহী নয় / ভর্তি হবে না)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  পাইপলাইন স্টেজ নির্ধারণ
                </label>
                <select
                  value={targetStatus}
                  onChange={e => setTargetStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="auto">ফলাফল অনুযায়ী স্বয়ংক্রিয় (Auto)</option>
                  <option value="Interested">Interested</option>
                  <option value="Demo Scheduled">Demo Scheduled</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Admission Pending">Admission Pending</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Lost">Lost / Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                কথোপকথন ও নোটস <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="স্টুডেন্টের সাথে কী আলোচনা হলো? কী কী বিষয়ে জানতে চেয়েছে? কোনো বিশেষ শর্ত বা মতামত থাকলে লিখুন..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 resize-none font-sans leading-relaxed"
              />
            </div>

            {result !== 'Admitted' && result !== 'Not Interested' && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2.5">
                <div className="text-amber-900 font-bold text-xs flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>পরবর্তী করণীয় ও শিডিউল (Next Action)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">পরবর্তী ফলো-আপের তারিখ</label>
                    <input
                      type="date"
                      value={nextFollowUpDate}
                      onChange={e => setNextFollowUpDate(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-slate-900 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">পরবর্তী পরিকল্পিত টাস্ক</label>
                    <input
                      type="text"
                      value={nextAction}
                      onChange={e => setNextAction(e.target.value)}
                      placeholder="যেমন: ব্যাচ শিডিউল বা ডিসকাউন্ট অফার নিয়ে কথা বলা"
                      className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-slate-900 outline-none font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>লগ সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>
        ) : (
          /* Previous Follow-up History Timeline */
          <div className="p-5 space-y-4 overflow-y-auto max-h-[60vh]">
            {previousLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <History className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="font-semibold text-sm">এই লিডের পূর্ববর্তী কোনো যোগাযোগের রেকর্ড নেই</p>
                <p className="text-xs text-slate-400 mt-1">প্রথম ফলো-আপ রেকর্ড করতে "নতুন যোগাযোগ এন্ট্রি" ট্যাবে যান</p>
              </div>
            ) : (
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {previousLogs.map((log) => (
                  <div key={log.id} className="relative flex items-start space-x-3 pl-8">
                    <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 w-full space-y-1.5">
                      <div className="flex items-center justify-between flex-wrap gap-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{log.staffName || 'Counselor'}</span>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-semibold">
                            {log.contactMethod || log.method || 'Phone'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {log.result}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{log.date}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-sans bg-white p-2.5 rounded-lg border border-slate-100">
                        {log.notes || log.conversationSummary || 'কোনো বিস্তারিত নোট দেওয়া হয়নি।'}
                      </p>

                      {log.nextFollowUpDate && (
                        <div className="flex items-center space-x-1.5 text-[11px] text-amber-700 font-medium pt-1">
                          <Calendar className="w-3 h-3 text-amber-600" />
                          <span>পরবর্তী ফলো-আপ: {log.nextFollowUpDate} {log.nextAction ? `(${log.nextAction})` : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
