import React, { useState } from 'react';
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  Database,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  FileText,
  Calendar,
  DollarSign,
  Users,
  Layers,
  X,
  RefreshCw,
  Clock,
  Building
} from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';

export interface BackupPayloadSummary {
  fileName: string;
  fileSizeKb: number;
  rawJson: string;
  parsedData: any;
  exportedAt?: string;
  instituteName?: string;
  version?: string;
  studentCount: number;
  admissionCount: number;
  paymentCount: number;
  totalPaymentAmount: number;
  batchCount: number;
  courseCount: number;
  expenseCount: number;
  totalExpenseAmount: number;
  leadCount: number;
  attendanceCount: number;
  certificateCount: number;
  hasCmsData: boolean;
}

interface DatabaseRestoreVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: BackupPayloadSummary | null;
  onSuccessRestore?: (message: string) => void;
}

export const DatabaseRestoreVerificationModal: React.FC<DatabaseRestoreVerificationModalProps> = ({
  isOpen,
  onClose,
  summary,
  onSuccessRestore
}) => {
  const {
    students,
    admissions,
    payments,
    batches,
    courses,
    expenses,
    leads,
    attendance,
    certificates,
    createSafeSnapshot,
    importDatabaseJson,
    syncToCloudNow
  } = useAcademy();

  const [createPreSnapshot, setCreatePreSnapshot] = useState<boolean>(true);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [restoreCompleted, setRestoreCompleted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !summary) return null;

  const handleConfirmRestore = async () => {
    setIsRestoring(true);
    setErrorMessage(null);

    try {
      // 1. Optionally capture pre-restore rollback safety snapshot
      if (createPreSnapshot) {
        createSafeSnapshot('manual', `Pre-Restore Safety Point (Before loading: ${summary.fileName})`);
      }

      // 2. Import parsed database JSON
      const success = importDatabaseJson(summary.rawJson);
      if (!success) {
        throw new Error('ডেটাবেজ ফরম্যাট পার্স বা ইম্পোর্ট করতে সমস্যা হয়েছে।');
      }

      // 3. Immediately trigger cloud sync so Firestore is updated with restored data
      await syncToCloudNow(true).catch(err => {
        console.warn('Post-restore cloud sync notice:', err);
      });

      setRestoreCompleted(true);
      if (onSuccessRestore) {
        onSuccessRestore(
          `সফলভাবে রিস্টোর সম্পন্ন হয়েছে! ${summary.studentCount} জন স্টুডেন্ট, ${summary.admissionCount}টি ভর্তি এবং ${summary.paymentCount}টি পেমেন্ট রেকর্ড লোড হয়েছে।`
        );
      }

      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'রিস্টোর করতে গিয়ে অপ্রত্যাশিত ত্রুটি ঘটেছে।');
    } finally {
      setIsRestoring(false);
    }
  };

  const comparisonRows = [
    {
      label: 'Students (শিক্ষার্থী)',
      current: students.length,
      incoming: summary.studentCount,
      icon: Users
    },
    {
      label: 'Admissions (ভর্তি রেকর্ড)',
      current: admissions.length,
      incoming: summary.admissionCount,
      icon: FileText
    },
    {
      label: 'Payments (ফি আদায় ট্রানজ্যাকশন)',
      current: payments.length,
      incoming: summary.paymentCount,
      subInfo: `৳${summary.totalPaymentAmount.toLocaleString()}`,
      icon: DollarSign
    },
    {
      label: 'Courses (কোর্সসমূহ)',
      current: courses.length,
      incoming: summary.courseCount,
      icon: Layers
    },
    {
      label: 'Batches (সক্রিয় ব্যাচ)',
      current: batches.length,
      incoming: summary.batchCount,
      icon: Calendar
    },
    {
      label: 'Expenses (প্রতিষ্ঠানিক খরচ)',
      current: expenses.length,
      incoming: summary.expenseCount,
      subInfo: `৳${summary.totalExpenseAmount.toLocaleString()}`,
      icon: DollarSign
    },
    {
      label: 'Leads & Enquiries (CRM লিড)',
      current: leads.length,
      incoming: summary.leadCount,
      icon: Users
    },
    {
      label: 'Certificates (ইস্যুকৃত সার্টিফিকেট)',
      current: certificates.length,
      incoming: summary.certificateCount,
      icon: ShieldCheck
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto print:hidden"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white flex items-center space-x-2">
                <span>Database Restore Verification (রিস্টোর যাচাইকরণ)</span>
              </h3>
              <p className="text-xs text-slate-400">
                ব্যাকআপ ফাইলের ডাটা যাচাই করে নিরাপদে সম্পূর্ণ সিস্টেমে প্রয়োগ করুন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isRestoring}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-800">
          {/* File Metadata Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block">File Name (ফাইলের নাম):</span>
              <span className="font-bold text-slate-900 font-mono break-all text-[11px]">
                {summary.fileName}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">File Size (আকার):</span>
              <span className="font-bold text-slate-900 font-mono">
                {summary.fileSizeKb > 1024
                  ? `${(summary.fileSizeKb / 1024).toFixed(2)} MB`
                  : `${summary.fileSizeKb} KB`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Exported Date (ব্যাকআপ তারিখ):</span>
              <span className="font-bold text-slate-900 font-mono">
                {summary.exportedAt
                  ? new Date(summary.exportedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Institute Name (প্রতিষ্ঠান):</span>
              <span className="font-bold text-slate-900">
                {summary.instituteName || 'Nexgen Academy'}
              </span>
            </div>
          </div>

          {/* Verification Comparison Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>ডাটা তুলনামূলক যাচাই (Comparison Verification)</span>
              <span className="text-slate-500 text-[11px]">Current vs Incoming</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {comparisonRows.map((row, idx) => {
                const Icon = row.icon;
                const diff = row.incoming - row.current;
                return (
                  <div
                    key={idx}
                    className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1 bg-slate-100 text-slate-600 rounded-md">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-slate-800">{row.label}</span>
                    </div>

                    <div className="flex items-center space-x-4 font-mono text-xs">
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block">Current</span>
                        <span className="font-bold text-slate-600">{row.current}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <div className="text-right">
                        <span className="text-indigo-500 text-[10px] block">Incoming</span>
                        <span className="font-bold text-indigo-700">
                          {row.incoming}
                          {row.subInfo && (
                            <span className="text-[10px] text-emerald-600 font-sans ml-1">
                              ({row.subInfo})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="w-14 text-right">
                        {diff > 0 ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            +{diff}
                          </span>
                        ) : diff < 0 ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            {diff}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">
                            Same
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safety Rollback Checkbox */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex items-start space-x-3">
            <input
              type="checkbox"
              id="safetySnapshotToggle"
              checked={createPreSnapshot}
              onChange={e => setCreatePreSnapshot(e.target.checked)}
              disabled={isRestoring}
              className="mt-0.5 w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
            <label htmlFor="safetySnapshotToggle" className="cursor-pointer select-none">
              <span className="font-bold text-xs text-emerald-950 block">
                রিস্টোর করার ঠিক পূর্বে বর্তমান ডাটার একটি সেফ স্ন্যাপশট (Safety Rollback Point) অটো-তৈরি করে রাখুন
              </span>
              <span className="text-[11px] text-emerald-800 font-medium block mt-0.5">
                সুপারিশকৃত: এটি নির্বাচন থাকলে কোনো ভুল ফাইল রিস্টোর হলেও এক ক্লিকে আগের অবস্থায় ফিরে যাওয়া যাবে।
              </span>
            </label>
          </div>

          {/* Warning Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start space-x-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">গুরুত্বপূর্ণ সতর্কতা (Important Note):</span>
              <span className="text-[11px] text-amber-800 leading-relaxed block mt-0.5">
                রিস্টোর সম্পন্ন হলে বর্তমান ডাটাবেজের রেকর্ড ব্যাকআপ ফাইলের ডাটা দিয়ে প্রতিস্থাপিত হবে। একই সাথে ক্লাউড ফায়ারস্টোরেও এই ব্যাকআপটি লাইভ সিঙ্ক হয়ে যাবে।
              </span>
            </div>
          </div>

          {/* Feedback states */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl text-xs font-bold flex items-center space-x-2">
              <X className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {restoreCompleted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs font-bold flex items-center space-x-2.5 animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-black text-sm text-emerald-900">রিস্টোর সফলভাবে সম্পন্ন হয়েছে!</p>
                <p className="text-[11px] text-emerald-800 font-normal">
                  সিস্টেম আপডেট হয়েছে এবং ক্লাউড ফায়ারস্টোর ডেটাবেজে ডাটা সিঙ্ক হচ্ছে।
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isRestoring}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            বাতিল (Cancel)
          </button>

          <button
            type="button"
            onClick={handleConfirmRestore}
            disabled={isRestoring || restoreCompleted}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
          >
            {isRestoring ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>রিস্টোর প্রক্রিয়া চলছে...</span>
              </>
            ) : restoreCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>রিস্টোর সম্পন্ন!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-indigo-200" />
                <span>নিশ্চিত করুন ও সম্পূর্ণ ডেটাবেজ রিস্টোর করুন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
