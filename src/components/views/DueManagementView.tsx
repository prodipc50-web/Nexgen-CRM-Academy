import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { exportDuesSpreadsheet } from '../../utils/spreadsheetExport';
import { useDebounce } from '../../hooks/useDebounce';
import { getDueReminderWhatsAppUrl } from '../../utils/whatsappHelper';
import {
  AlertCircle,
  CreditCard,
  Search,
  MessageSquare,
  MessageCircle,
  Copy,
  Check,
  Calendar,
  Phone,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Flame,
  Clock,
  BellRing,
  CheckCircle2,
  FileSpreadsheet,
  Download
} from 'lucide-react';

interface DueManagementViewProps {
  onOpenCollectPayment: (admissionId: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const DueManagementView: React.FC<DueManagementViewProps> = ({
  onOpenCollectPayment,
  onSelectStudent
}) => {
  const { admissions, students, courses, batches, stats, deleteStudent, deleteAdmission, waiveAdmissionDue, addFollowUp } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 250);
  const [filterDueStatus, setFilterDueStatus] = useState<'all' | 'critical' | 'overdue' | 'due_this_week' | 'high_value'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deletingDue, setDeletingDue] = useState<{
    admissionId: string;
    admissionCode: string;
    studentId: string;
    studentName: string;
    studentCode: string;
    dueAmount: number;
    courseName: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const getOverdueDays = (dueDate?: string) => {
    if (!dueDate) return 0;
    const diff = new Date(todayStr).getTime() - new Date(dueDate).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 3600 * 24)));
  };

  // Critical overdue (>7 days)
  const criticalOverdueAdmissions = admissions.filter(adm => {
    if (adm.due <= 0) return false;
    const dueDate = adm.nextPaymentDate || adm.nextDueDate;
    return dueDate && getOverdueDays(dueDate) >= 7;
  });
  const criticalOverdueTotal = criticalOverdueAdmissions.reduce((sum, a) => sum + a.due, 0);

  const dueAdmissions = admissions.filter(adm => {
    if (adm.due <= 0) return false;
    const stu = students.find(s => s.id === adm.studentId);
    const matchesSearch =
      (stu && (stu.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || stu.studentCode.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || stu.phone.includes(debouncedSearchTerm))) ||
      ((adm.admissionCode || adm.admissionNumber || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

    const dueDate = adm.nextPaymentDate || adm.nextDueDate;
    const isOverdue = dueDate && dueDate < todayStr;
    const daysOverdue = getOverdueDays(dueDate);

    const matchesFilter =
      filterDueStatus === 'all' ||
      (filterDueStatus === 'critical' && daysOverdue >= 7) ||
      (filterDueStatus === 'overdue' && isOverdue) ||
      (filterDueStatus === 'due_this_week' && !isOverdue && dueDate && daysOverdue <= 0) ||
      (filterDueStatus === 'high_value' && adm.due >= 5000);

    return matchesSearch && matchesFilter;
  });

  const totalOutstandingDue = dueAdmissions.reduce((sum, a) => sum + a.due, 0);

  const handleScheduleUrgentCall = (stuId: string, stuName: string, courseName: string, dueAmount: number) => {
    try {
      addFollowUp({
        leadId: stuId,
        date: todayStr,
        method: 'Phone Call',
        contactMethod: 'Phone Call',
        conversationSummary: `🚨 Urgent Fee Due Follow-up (${courseName})`,
        notes: `Urgent recovery call scheduled for ${stuName}. Pending due balance: ৳${dueAmount.toLocaleString()}. Follow-up with guardian or candidate for immediate settlement.`,
        result: 'Payment Issue',
        nextAction: 'Recover pending course fee installment',
        nextFollowUpDate: todayStr,
        status: 'Pending',
        staffName: 'Accounts / Recovery Desk'
      });
      showToast(`Urgent follow-up call task added to CRM for ${stuName}`);
    } catch (e) {
      showToast(`Logged call reminder for ${stuName}`);
    }
  };

  const handleCopyReminder = (admId: string, stuName: string, courseName: string, dueAmount: number, dueDate?: string) => {
    const text = `Dear ${stuName}, this is a gentle reminder from Nexgen Computer Academy regarding your course "${courseName}". Your outstanding course fee due balance is ৳${dueAmount.toLocaleString()} (Due Date: ${dueDate || 'Immediate'}). Please clear your dues at the academy office or via bKash/Nagad Merchant to avoid batch deactivation. Help desk: +8801700-000000.`;
    navigator.clipboard.writeText(text);
    setCopiedId(admId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleConfirmDelete = () => {
    if (!deletingDue) return;
    deleteAdmission(deletingDue.admissionId);
    if (deletingDue.studentId) {
      // Check if student has any other admissions
      const otherAdmissions = admissions.filter(a => a.studentId === deletingDue.studentId && a.id !== deletingDue.admissionId);
      if (otherAdmissions.length === 0) {
        deleteStudent(deletingDue.studentId);
      }
    }
    showToast(`Removed record for ${deletingDue.studentName}. Sent to Recycle Bin.`);
    setDeletingDue(null);
  };

  const handleWaiveDue = () => {
    if (!deletingDue) return;
    waiveAdmissionDue(deletingDue.admissionId, 'Special Concession / Scholarship Waiver');
    showToast(`Due of ৳${deletingDue.dueAmount.toLocaleString()} waived for ${deletingDue.studentName}.`);
    setDeletingDue(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 relative">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Due Management & Collection Recovery
            </h2>
            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
              {dueAdmissions.length} Accounts with Dues
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Track student fee balances, overdue deadlines, generate automated payment reminder SMS, and collect installments
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportDuesSpreadsheet(dueAdmissions, students, courses, batches)}
            className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-2xs transition-colors"
            title={`Export ${dueAdmissions.length} Due Accounts to Excel Spreadsheet`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel / Spreadsheet ({dueAdmissions.length})</span>
          </button>
        </div>
      </div>

      {/* Red Alert Overdue Collection Engine Banner */}
      {criticalOverdueAdmissions.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 text-white p-5 rounded-3xl border border-rose-700/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-rose-800/80 text-rose-200 rounded-2xl shrink-0 border border-rose-700 shadow-inner">
              <ShieldAlert className="w-6 h-6 animate-pulse text-rose-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full">
                  Red Alert Collection Engine
                </span>
                <span className="text-xs text-rose-200">
                  {criticalOverdueAdmissions.length} accounts overdue by 7+ days
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
                ৳{criticalOverdueTotal.toLocaleString()} Pending in Critical Overdue Dues
              </h3>
              <p className="text-xs text-rose-200/90 mt-0.5 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Certificate issuance, final exams, and batch credentials auto-flagged on hold until dues settled.</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setFilterDueStatus('critical')}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Review {criticalOverdueAdmissions.length} Critical Accounts</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
          <span className="text-rose-700 font-bold block text-[11px] uppercase tracking-wider">
            Total Outstanding Due
          </span>
          <span className="text-2xl font-black text-rose-950 mt-1 block">
            ৳{stats.totalDue.toLocaleString()}
          </span>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
          <span className="text-amber-800 font-bold block text-[11px] uppercase tracking-wider">
            Critical Overdue Balance
          </span>
          <span className="text-2xl font-black text-amber-950 mt-1 block">
            ৳{stats.overdueDueAmount.toLocaleString()}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">
            Filtered Accounts Total
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            ৳{totalOutstandingDue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student name, phone, ID, admission #..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterDueStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filterDueStatus === 'all' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Dues
          </button>
          <button
            onClick={() => setFilterDueStatus('critical')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center space-x-1 ${
              filterDueStatus === 'critical' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Critical (&gt;7 Days)</span>
          </button>
          <button
            onClick={() => setFilterDueStatus('overdue')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filterDueStatus === 'overdue' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            Overdue Past
          </button>
          <button
            onClick={() => setFilterDueStatus('due_this_week')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filterDueStatus === 'due_this_week' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            Due Soon
          </button>
          <button
            onClick={() => setFilterDueStatus('high_value')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filterDueStatus === 'high_value' ? 'bg-purple-600 text-white shadow-2xs' : 'text-purple-700 hover:bg-purple-50'
            }`}
          >
            ৳5,000+ High Due
          </button>
        </div>
      </div>

      {/* Due Accounts Container: Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Mobile View: Responsive Cards (md:hidden) */}
        <div className="md:hidden divide-y divide-slate-100">
          {dueAdmissions.map(adm => {
            const stu = students.find(s => s.id === adm.studentId);
            const crs = courses.find(c => c.id === adm.courseId);
            const batch = batches.find(b => b.id === adm.batchId);
            const dueDate = adm.nextPaymentDate || adm.nextDueDate;
            const isOverdue = !!(dueDate && dueDate < todayStr);
            const daysOverdue = isOverdue && dueDate ? Math.max(0, Math.floor((new Date(todayStr).getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;
            const waUrl = getDueReminderWhatsAppUrl({
              phone: stu?.phone,
              studentName: stu?.name || 'Student',
              courseName: crs?.name || 'Course',
              dueAmount: adm.due,
              dueDate: dueDate
            });

            return (
              <div key={adm.id} className="p-3.5 space-y-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <button
                      onClick={() => onSelectStudent(adm.studentId)}
                      className="font-bold text-slate-900 hover:text-indigo-600 text-left text-sm"
                    >
                      {stu?.name || 'Student Record'}
                    </button>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {stu?.studentCode || adm.admissionCode} • {stu?.phone || 'No Phone'}
                    </div>
                  </div>

                  <span className="inline-block bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-1 rounded-lg font-black text-xs">
                    ৳{adm.due.toLocaleString()} Due
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                  <div className="font-semibold text-slate-800 truncate">{crs?.name || 'Course Enrollment'}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Batch #{batch?.batchNumber || 'General'}</span>
                    <span>Fee: ৳{adm.finalFee.toLocaleString()} | Paid: ৳{adm.totalPaid.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex flex-col gap-2 pt-1 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                      <span className="text-slate-400 text-[11px]">Deadline:</span>
                      {dueDate ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isOverdue ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {dueDate}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                      {daysOverdue > 0 && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          daysOverdue >= 7 ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {daysOverdue}d Overdue
                        </span>
                      )}
                    </div>

                    <span title="Certificate delivery locked until fee clearance" className="inline-flex items-center space-x-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded shrink-0">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Cert Locked</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-1.5 flex-wrap gap-1">
                    <button
                      onClick={() => handleScheduleUrgentCall(adm.studentId, stu?.name || 'Student', crs?.name || 'Course', adm.due)}
                      className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold inline-flex items-center space-x-1"
                      title="Schedule Urgent Recovery Call in CRM"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-700" />
                      <span className="text-[10px]">CRM Call</span>
                    </button>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold inline-flex items-center space-x-1"
                      title="Send WhatsApp Reminder"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="text-[10px]">WA</span>
                    </a>

                    <button
                      onClick={() =>
                        handleCopyReminder(
                          adm.id,
                          stu?.name || 'Student',
                          crs?.name || 'Course',
                          adm.due,
                          dueDate
                        )
                      }
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center space-x-1"
                      title="Copy SMS text"
                    >
                      {copiedId === adm.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <MessageSquare className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onOpenCollectPayment(adm.id)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs inline-flex items-center space-x-1 shadow-xs"
                    >
                      <CreditCard className="w-3 h-3" />
                      <span>Collect</span>
                    </button>

                    <button
                      onClick={() => {
                        setDeletingDue({
                          admissionId: adm.id,
                          admissionCode: adm.admissionCode || adm.admissionNumber || adm.id,
                          studentId: adm.studentId,
                          studentName: stu?.name || 'Student',
                          studentCode: stu?.studentCode || 'N/A',
                          dueAmount: adm.due,
                          courseName: crs?.name || 'Course'
                        });
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Waive / Remove Due"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {dueAdmissions.length === 0 && (
            <div className="py-10 text-center text-slate-400 px-4">
              <Check className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
              <p className="text-xs font-semibold">Zero pending dues matching the filter criteria!</p>
            </div>
          )}
        </div>

        {/* Desktop View: Full Data Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student Profile</th>
                <th className="py-3 px-4">Course & Batch</th>
                <th className="py-3 px-4">Agreed Fee</th>
                <th className="py-3 px-4">Total Paid</th>
                <th className="py-3 px-4">Outstanding Due</th>
                <th className="py-3 px-4">Due Deadline</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dueAdmissions.map(adm => {
                const stu = students.find(s => s.id === adm.studentId);
                const crs = courses.find(c => c.id === adm.courseId);
                const batch = batches.find(b => b.id === adm.batchId);
                const dueDate = adm.nextPaymentDate || adm.nextDueDate;
                const isOverdue = !!(dueDate && dueDate < todayStr);
                const daysOverdue = isOverdue && dueDate ? Math.max(0, Math.floor((new Date(todayStr).getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;
                const waUrl = getDueReminderWhatsAppUrl({
                  phone: stu?.phone,
                  studentName: stu?.name || 'Student',
                  courseName: crs?.name || 'Course',
                  dueAmount: adm.due,
                  dueDate: dueDate
                });

                return (
                  <tr key={adm.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectStudent(adm.studentId)}
                        className="font-bold text-slate-900 hover:text-indigo-600 text-left block"
                      >
                        {stu?.name || 'Student Record'}
                      </button>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {stu?.studentCode || adm.admissionCode || adm.id} • {stu?.phone || 'No Phone'}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-800">
                      <div className="font-semibold">{crs?.name || 'Course Enrollment'}</div>
                      <div className="text-[10px] text-slate-400">Batch #{batch?.batchNumber || 'General'}</div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800">
                      ৳{adm.finalFee.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-semibold text-emerald-700">
                      ৳{adm.totalPaid.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-black text-sm text-rose-600">
                        ৳{adm.due.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {dueDate ? (
                        <div className="flex flex-col gap-1 items-start">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isOverdue ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {dueDate}
                            </span>
                            {daysOverdue > 0 && (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                  daysOverdue >= 7 ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 text-white'
                                }`}
                              >
                                {daysOverdue}d Late
                              </span>
                            )}
                          </div>
                          <span
                            title="Certificates on hold until fee clearance"
                            className="inline-flex items-center space-x-1 text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1 py-0.2 rounded"
                          >
                            <Lock className="w-2.5 h-2.5" />
                            <span>Cert Locked</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleScheduleUrgentCall(adm.studentId, stu?.name || 'Student', crs?.name || 'Course', adm.due)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded text-xs font-bold transition-all inline-flex items-center space-x-1"
                        title="Schedule Urgent Recovery Call in CRM"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-700" />
                        <span>CRM Call</span>
                      </button>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-xs font-bold transition-all inline-flex items-center space-x-1"
                        title="Send WhatsApp Reminder"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      <button
                        onClick={() =>
                          handleCopyReminder(
                            adm.id,
                            stu?.name || 'Student',
                            crs?.name || 'Course',
                            adm.due,
                            dueDate
                          )
                        }
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-all inline-flex items-center space-x-1 ${
                          copiedId === adm.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title="Copy payment reminder SMS"
                      >
                        {copiedId === adm.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                            <span>SMS</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onOpenCollectPayment(adm.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs inline-flex items-center space-x-1 shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Collect Due</span>
                      </button>

                      <button
                        onClick={() => {
                          setDeletingDue({
                            admissionId: adm.id,
                            admissionCode: adm.admissionCode || adm.admissionNumber || adm.id,
                            studentId: adm.studentId,
                            studentName: stu?.name || 'Student',
                            studentCode: stu?.studentCode || 'N/A',
                            dueAmount: adm.due,
                            courseName: crs?.name || 'Course'
                          });
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                        title="Remove or Waive Due"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {dueAdmissions.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Check className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
                    <p className="text-sm font-semibold">Zero pending dues matching the filter criteria!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete / Waive Due Confirmation Modal */}
      {deletingDue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Manage / Remove Due Entry</h3>
                <p className="text-[11px] text-slate-500">Admission #{deletingDue.admissionCode}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <strong className="text-slate-900 font-bold">{deletingDue.studentName} ({deletingDue.studentCode})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Course:</span>
                <span className="text-slate-800">{deletingDue.courseName}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Outstanding Due:</span>
                <strong className="text-rose-600 font-black text-sm">৳{deletingDue.dueAmount.toLocaleString()}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Choose an action for this pending balance. You can either waive this due amount as an approved concession, or delete the admission entry to the Recycle Bin.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingDue(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors order-3 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleWaiveDue}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors order-2 inline-flex items-center justify-center space-x-1"
                title="Concession / Scholarship waiver: set due to ৳0"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Waive Due (৳0)</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors order-1 sm:order-3 inline-flex items-center justify-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Entry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

