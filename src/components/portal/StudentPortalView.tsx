import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAcademy } from '../../context/AcademyContext';
import { Student, Admission, Payment, Batch, Course, ClassSchedule, Certificate } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  User,
  BookOpen,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  ExternalLink,
  ShieldCheck,
  Award,
  Video,
  FileText,
  AlertCircle,
  LogOut,
  QrCode,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Globe,
  Bell,
  ChevronRight,
  ArrowLeft,
  Search,
  Lock,
  RotateCw,
  Layers
} from 'lucide-react';

interface StudentPortalViewProps {
  onBackToWebsite: () => void;
  onOpenReceiptModal?: (receiptNumber: string) => void;
  onOpenCertificateModal?: (certificateNumber: string) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  onBackToWebsite,
  onOpenReceiptModal,
  onOpenCertificateModal
}) => {
  const {
    students,
    admissions,
    payments,
    batches,
    courses,
    schedules,
    certificates,
    attendance,
    academySettings,
    websiteCmsConfig
  } = useAcademy();

  // Authentication State for Portal
  const [identifierInput, setIdentifierInput] = useState('');
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'batches' | 'payments' | 'attendance' | 'materials' | 'certificate'>('overview');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [idCardSide, setIdCardSide] = useState<'front' | 'back'>('front');

  // Handle Login
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const query = identifierInput.trim().toLowerCase();
    if (!query) {
      setLoginError(language === 'bn' ? 'অনুগ্রহ করে আপনার স্টুডেন্ট আইডি বা মোবাইল নম্বর দিন' : 'Please enter your Student ID or phone number');
      return;
    }

    const matched = students.find(
      s =>
        s.studentCode.toLowerCase() === query ||
        s.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '') ||
        s.email?.toLowerCase() === query
    );

    if (matched) {
      setLoggedInStudent(matched);
      setLoginError('');
    } else {
      setLoginError(
        language === 'bn'
          ? 'কোনো শিক্ষার্থী পাওয়া যায়নি! অনুগ্রহ করে সঠিক স্টুডেন্ট আইডি বা মোবাইল নম্বর দিন।'
          : 'No student found with this ID or phone number. Please check with academy help desk.'
      );
    }
  };

  // Demo Login
  const handleDemoLogin = () => {
    if (students.length > 0) {
      setLoggedInStudent(students[0]);
      setLoginError('');
    }
  };

  // Current Student Data Aggregation
  const studentAdmissions = useMemo(() => {
    if (!loggedInStudent) return [];
    return admissions.filter(a => a.studentId === loggedInStudent.id);
  }, [loggedInStudent, admissions]);

  const studentPayments = useMemo(() => {
    if (!loggedInStudent) return [];
    return payments.filter(p => p.studentId === loggedInStudent.id);
  }, [loggedInStudent, payments]);

  const totalCourseFee = studentAdmissions.reduce((acc, curr) => acc + (curr.finalFee || 0), 0);
  const totalPaidAmount = studentPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalDueAmount = Math.max(0, totalCourseFee - totalPaidAmount);

  const studentBatches = useMemo(() => {
    if (!loggedInStudent) return [];
    const batchIds = studentAdmissions.map(a => a.batchId);
    return batches.filter(b => batchIds.includes(b.id));
  }, [loggedInStudent, studentAdmissions, batches]);

  const studentCertificates = useMemo(() => {
    if (!loggedInStudent) return [];
    return certificates.filter(c => c.studentId === loggedInStudent.id);
  }, [loggedInStudent, certificates]);

  const studentAttendanceRecords = useMemo(() => {
    if (!loggedInStudent) return [];
    return attendance.filter(a => a.studentId === loggedInStudent.id);
  }, [loggedInStudent, attendance]);

  const attendanceRate = useMemo(() => {
    if (studentAttendanceRecords.length === 0) return 92; // default high attendance
    const presentCount = studentAttendanceRecords.filter(r => r.status === 'Present').length;
    return Math.round((presentCount / studentAttendanceRecords.length) * 100);
  }, [studentAttendanceRecords]);

  // If not logged in, render Student Login View
  if (!loggedInStudent) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-indigo-600 selection:text-white font-erp">
        {/* Top Navbar */}
        <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <NexgenLogo variant="crest" size={38} />
            <div>
              <h1 className="font-black text-sm text-white tracking-tight leading-none">
                {academySettings.instituteName || 'Nexgen Computer Academy'}
              </h1>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-0.5">
                Student Self-Service Portal
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLanguage(l => (l === 'bn' ? 'en' : 'bn'))}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
            >
              {language === 'bn' ? 'English' : 'বাংলা'}
            </button>
            <button
              onClick={onBackToWebsite}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ওয়েবসাইটে ফিরুন' : 'Back to Website'}</span>
            </button>
          </div>
        </header>

        {/* Center Login Box */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center space-y-2 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <User className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {language === 'bn' ? 'শিক্ষার্থী সেলফ-সার্ভিস পোর্টাল' : 'Student Self-Service Portal'}
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                {language === 'bn'
                  ? 'আপনার স্টুডেন্ট আইডি বা মোবাইল নম্বর দিয়ে লগইন করে ক্লাস শিডিউল, ফি রসিদ ও ডিজিটাল আইডি কার্ড দেখুন।'
                  : 'Enter your Student ID or phone number to view schedules, payment receipts & digital ID.'}
              </p>
            </div>

            {/* Login Notice */}
            {websiteCmsConfig.studentPortal?.portalNotice && (
              <div className="p-3.5 bg-indigo-950/60 border border-indigo-500/30 rounded-2xl flex items-start space-x-2.5 text-xs text-indigo-200">
                <Bell className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{websiteCmsConfig.studentPortal.portalNotice}</p>
              </div>
            )}

            {loginError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center space-x-2 text-xs text-rose-300 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  {language === 'bn' ? 'স্টুডেন্ট আইডি বা মোবাইল নম্বর *' : 'Student ID or Phone Number *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifierInput}
                    onChange={e => setIdentifierInput(e.target.value)}
                    placeholder="e.g. NCA-STU-2026-001 or 017XXXXXXXX"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700 rounded-2xl text-sm font-bold text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>{language === 'bn' ? 'পোর্টালে প্রবেশ করুন' : 'Sign In to Portal'}</span>
              </button>
            </form>

            <div className="pt-3 border-t border-slate-800 flex flex-col items-center space-y-3">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-amber-400 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ডেমো শিক্ষার্থী হিসেবে প্রবেশ (১-ক্লিক)' : 'Quick Demo Student Sign In'}</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                {language === 'bn' ? 'লগইন সংক্রান্ত যেকোনো সহায়তায় সরাসরি যোগাযোগ করুন:' : 'For student portal help desk:'}{' '}
                <a href={`tel:${academySettings.primarySupportPhone || '01798444444'}`} className="text-indigo-400 font-bold hover:underline">
                  {academySettings.primarySupportPhone || '01798444444'}
                </a>
              </p>
            </div>
          </div>
        </main>

        <footer className="py-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {academySettings.instituteName || 'Nexgen Computer Academy'}. All Rights Reserved.
        </footer>
      </div>
    );
  }

  // Active Student Dashboard
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-indigo-600 selection:text-white font-erp">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 px-4 sm:px-8 py-3.5 border-b border-slate-800 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <NexgenLogo variant="crest" size={38} />
          <div>
            <h1 className="font-black text-sm text-white tracking-tight leading-none">
              {academySettings.instituteName || 'Nexgen Computer Academy'}
            </h1>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
              Verified Student Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLanguage(l => (l === 'bn' ? 'en' : 'bn'))}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
          >
            {language === 'bn' ? 'English' : 'বাংলা'}
          </button>

          <button
            onClick={() => setLoggedInStudent(null)}
            className="px-3.5 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
          </button>
        </div>
      </header>

      {/* Main Student Workspace */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Student Welcome Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-400/50 shadow-md bg-slate-800 shrink-0">
              {loggedInStudent.photoUrl ? (
                <img src={loggedInStudent.photoUrl} alt={loggedInStudent.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-700 text-white text-2xl font-black">
                  {loggedInStudent.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  {loggedInStudent.status || 'Active Student'}
                </span>
                <span className="text-xs text-indigo-300 font-mono font-bold">
                  {loggedInStudent.studentCode}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {loggedInStudent.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{loggedInStudent.phone}</span>
                </span>
                {loggedInStudent.email && (
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{loggedInStudent.email}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-3 gap-2.5 w-full md:w-auto shrink-0 relative z-10">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
              <span className="block text-base font-black text-amber-400">
                ৳{totalPaidAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                {language === 'bn' ? 'পরিশোধিত' : 'Paid'}
              </span>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
              <span className={`block text-base font-black ${totalDueAmount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                ৳{totalDueAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                {language === 'bn' ? 'বকেয়া' : 'Due'}
              </span>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
              <span className="block text-base font-black text-indigo-300">
                {attendanceRate}%
              </span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                {language === 'bn' ? 'উপস্থিতি' : 'Attendance'}
              </span>
            </div>
          </div>
        </div>

        {/* Portal Tabs Navigation */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
          <div className="flex items-center space-x-1.5 min-w-max">
            {[
              { id: 'overview', label: language === 'bn' ? 'প্রোফাইল ও ডিজিটাল আইডি' : 'Overview & Digital ID', icon: User },
              { id: 'batches', label: language === 'bn' ? 'আমার কোর্স ও ব্যাচ' : 'My Courses & Batches', icon: BookOpen },
              { id: 'payments', label: language === 'bn' ? 'পেমেন্ট ও মানি রসিদ' : 'Payments & Receipts', icon: CreditCard },
              { id: 'attendance', label: language === 'bn' ? 'উপস্থিতি ও অগ্রগতি' : 'Attendance & Progress', icon: Calendar },
              { id: 'materials', label: language === 'bn' ? 'ক্লাস নোট ও রেকর্ডিং' : 'Materials & Videos', icon: Video },
              { id: 'certificate', label: language === 'bn' ? 'অনলাইন সার্টিফিকেট' : 'Certificates', icon: Award }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center space-x-2 transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: OVERVIEW & DIGITAL PVC ID CARD */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left: Interactive PVC ID Card (Standard 85.6mm x 54mm equivalent ratio) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-black text-slate-900 text-sm">
                      {language === 'bn' ? 'অফিসিয়াল ডিজিটাল স্টুডেন্ট আইডি কার্ড' : 'Official Digital Student ID Card'}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Front / Back Toggle */}
                    <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setIdCardSide('front')}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          idCardSide === 'front' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Front
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdCardSide('back')}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          idCardSide === 'back' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Back
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-indigo-300" />
                      <span className="hidden sm:inline">{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
                    </button>
                  </div>
                </div>

                {/* PVC Card Mockup Frame (Front / Back Side) */}
                <div className="w-full max-w-sm mx-auto transition-all duration-300">
                  {idCardSide === 'front' ? (
                    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-2xl border-2 border-indigo-400/40 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

                      {/* Header Row */}
                      <div className="flex items-center justify-between pb-3 border-b border-indigo-400/30">
                        <div className="flex items-center space-x-2">
                          <NexgenLogo variant="crest" size={32} />
                          <div>
                            <h4 className="font-black text-xs text-white uppercase tracking-tight">
                              {academySettings.instituteName || 'Nexgen Computer Academy'}
                            </h4>
                            <p className="text-[8px] text-indigo-300 font-bold uppercase">Govt. Recognized IT Institute</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] rounded-sm">
                          STUDENT
                        </span>
                      </div>

                      {/* Body Info */}
                      <div className="flex items-center space-x-4 py-4">
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-800 border-2 border-indigo-300/60 shadow-md shrink-0">
                          {loggedInStudent.photoUrl ? (
                            <img src={loggedInStudent.photoUrl} alt={loggedInStudent.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-800 text-white text-2xl font-black">
                              {loggedInStudent.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <h4 className="font-black text-sm text-white truncate">{loggedInStudent.name}</h4>
                          <p className="text-[10px] text-indigo-300 font-mono font-bold">{loggedInStudent.studentCode}</p>
                          <p className="text-[10px] text-slate-300 font-bold truncate">
                            {courses.find(c => c.id === studentAdmissions[0]?.courseId)?.name || 'Professional IT Course'}
                          </p>
                          <div className="flex items-center space-x-2 pt-1 text-[9px] text-slate-400">
                            <span>Blood: <b className="text-white">{loggedInStudent.bloodGroup || 'O+'}</b></span>
                            <span>•</span>
                            <span>Mob: <b className="text-white">{loggedInStudent.phone}</b></span>
                          </div>
                        </div>
                      </div>

                      {/* Footer with QR Code & Barcode */}
                      <div className="pt-3 border-t border-indigo-400/30 flex items-center justify-between text-[8px] text-slate-300">
                        <div className="space-y-0.5">
                          <p className="font-bold text-white">Valid Through: 2026-2027</p>
                          <p className="text-indigo-300">{academySettings.officialAddress || 'Farmgate, Dhaka'}</p>
                        </div>

                        <div className="p-1 bg-white rounded-md shadow-xs">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                              `${academySettings.certificateVerificationBaseUrl || 'https://nexgenacademy.edu.bd/verify/'}?student=${loggedInStudent.studentCode}`
                            )}`}
                            alt="QR Code"
                            className="w-9 h-9 object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Back Side */
                    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-2xl p-5 shadow-2xl border-2 border-indigo-400/30 relative overflow-hidden space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Instructions & Rules</span>
                        <span className="text-[9px] text-slate-400 font-mono">EMERGENCY: {academySettings.primarySupportPhone || '01798444444'}</span>
                      </div>

                      <ul className="text-[9px] text-slate-300 space-y-1.5 list-disc pl-3 leading-relaxed">
                        <li>This card is non-transferable and must be carried inside the campus and practical computer labs.</li>
                        <li>Loss of this card must be reported immediately to the administration office.</li>
                        <li>Scan the QR code on the front to verify active enrollment status and transcript credentials.</li>
                      </ul>

                      {/* Fake Barcode Representation */}
                      <div className="pt-2 border-t border-slate-800 flex flex-col items-center justify-center space-y-1">
                        <div className="h-7 w-48 bg-white/90 flex items-center justify-around px-2 rounded-xs">
                          <div className="w-1 h-full bg-black"></div>
                          <div className="w-0.5 h-full bg-black"></div>
                          <div className="w-1.5 h-full bg-black"></div>
                          <div className="w-0.5 h-full bg-black"></div>
                          <div className="w-2 h-full bg-black"></div>
                          <div className="w-1 h-full bg-black"></div>
                          <div className="w-0.5 h-full bg-black"></div>
                          <div className="w-1.5 h-full bg-black"></div>
                          <div className="w-0.5 h-full bg-black"></div>
                          <div className="w-2 h-full bg-black"></div>
                          <div className="w-1 h-full bg-black"></div>
                          <div className="w-0.5 h-full bg-black"></div>
                        </div>
                        <span className="text-[8px] font-mono text-slate-400 tracking-widest">{loggedInStudent.studentCode}</span>
                      </div>

                      <div className="text-center text-[8px] text-slate-400 pt-1">
                        Principal / Authorised Signatory • {academySettings.instituteName || 'Nexgen Computer Academy'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Academic & Personal Details */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'bn' ? 'শিক্ষার্থীর পূর্ণাঙ্গ তথ্য' : 'Student Profile Details'}</span>
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-bold block">{language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}</span>
                    <span className="font-black text-slate-900 text-sm">{loggedInStudent.name}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-bold block">{language === 'bn' ? 'স্টুডেন্ট কোড' : 'Student ID'}</span>
                    <span className="font-mono font-black text-indigo-600 text-sm">{loggedInStudent.studentCode}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-bold block">{language === 'bn' ? 'মোবাইল নম্বর' : 'Phone'}</span>
                    <span className="font-bold text-slate-900">{loggedInStudent.phone}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-bold block">{language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email'}</span>
                    <span className="font-bold text-slate-900 truncate block">{loggedInStudent.email || 'N/A'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-bold block">{language === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}</span>
                    <span className="font-bold text-slate-900">{loggedInStudent.bloodGroup || 'O+'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-bold block">{language === 'bn' ? 'ভর্তির তারিখ' : 'Admission Date'}</span>
                    <span className="font-bold text-slate-900">{loggedInStudent.admissionDate || '2026-01-15'}</span>
                  </div>

                  <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-bold block">{language === 'bn' ? 'বর্তমান ঠিকানা' : 'Address'}</span>
                    <span className="font-bold text-slate-900">{loggedInStudent.address || 'Farmgate, Dhaka'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: MY COURSES & BATCHES */}
        {activeTab === 'batches' && (
          <motion.div
            key="batches"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>{language === 'bn' ? 'আমার এনরোলকৃত কোর্স ও ব্যাচ শিডিউল' : 'My Enrolled Courses & Batch Schedule'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentAdmissions.map(adm => {
                const batch = batches.find(b => b.id === adm.batchId);
                const course = courses.find(c => c.id === adm.courseId);
                return (
                  <div key={adm.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-mono font-bold">
                          {batch?.batchNumber || 'Batch-01'}
                        </span>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
                          {adm.status || 'Active'}
                        </span>
                      </div>

                      <h4 className="font-black text-slate-900 text-base">{course?.name || 'Course'}</h4>
                      <p className="text-xs text-slate-500">{course?.category || 'Information Technology'}</p>

                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-bold">{language === 'bn' ? 'ক্লাসের দিনসমূহ:' : 'Class Days:'}</span>
                          <span className="font-black text-slate-800">{batch?.classDays || 'Fri, Sat'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-bold">{language === 'bn' ? 'ক্লাস সময়:' : 'Class Time:'}</span>
                          <span className="font-black text-slate-800">{batch?.classTime || '6:00 PM – 8:00 PM'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-bold">{language === 'bn' ? 'ল্যাব রুম:' : 'Lab Room:'}</span>
                          <span className="font-black text-indigo-600">{batch?.room || 'Lab Room 402'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-bold">{language === 'bn' ? 'ট্রেইনার:' : 'Instructor:'}</span>
                          <span className="font-black text-slate-800">{batch?.trainerName || 'Lead Tech Specialist'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      {batch?.liveMeetingUrl ? (
                        <a
                          href={batch.liveMeetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'অনলাইন লাইভ ক্লাসে যুক্ত হন' : 'Join Live Class'}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{language === 'bn' ? 'ইন-পার্সন ল্যাব ব্যাচ' : 'In-Person Lab Batch'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* TAB 3: PAYMENTS & OFFICIAL MONEY RECEIPTS */}
        {activeTab === 'payments' && (
          <motion.div
            key="payments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>{language === 'bn' ? 'পেমেন্ট হিস্ট্রি ও ডিজিটাল মানি রসিদ' : 'Payment History & Official Money Receipts'}</span>
              </h3>
            </div>

            {/* Financial Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-bold block">{language === 'bn' ? 'মোট কোর্স ফি' : 'Total Course Fee'}</span>
                <span className="text-xl font-black text-slate-900 mt-1 block">৳{totalCourseFee.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-bold block">{language === 'bn' ? 'মোট পরিশোধিত' : 'Total Paid'}</span>
                <span className="text-xl font-black text-emerald-600 mt-1 block">৳{totalPaidAmount.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-bold block">{language === 'bn' ? 'অবশিষ্ট বকেয়া' : 'Outstanding Due'}</span>
                <span className={`text-xl font-black mt-1 block ${totalDueAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ৳{totalDueAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Receipts List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 font-black text-xs text-slate-800 uppercase tracking-wider">
                {language === 'bn' ? 'মানি রসিদ তালিকা' : 'Money Receipts Ledger'}
              </div>

              {studentPayments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-bold">
                  {language === 'bn' ? 'কোনো পেমেন্ট রসিদ পাওয়া যায়নি।' : 'No payment records found.'}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {studentPayments.map(p => (
                    <div key={p.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold rounded-md">
                            Receipt: {p.receiptNumber || 'NCA-REC-001'}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {p.date} • {p.paymentMethod || 'bKash'}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">
                          {courses.find(c => c.id === studentAdmissions.find(a => a.id === p.admissionId)?.courseId)?.name || 'Course Installment Payment'}
                        </h4>
                        {p.note && <p className="text-xs text-slate-500">{p.note}</p>}
                      </div>

                      <div className="flex items-center space-x-3 self-end sm:self-center">
                        <span className="text-base font-black text-emerald-600">
                          ৳{p.amount.toLocaleString()}
                        </span>
                        {onOpenReceiptModal && (
                          <button
                            onClick={() => onOpenReceiptModal(p.receiptNumber || '')}
                            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center space-x-1.5 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5 text-indigo-300" />
                            <span>{language === 'bn' ? 'রসিদ প্রিন্ট' : 'Print Receipt'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 4: ATTENDANCE & PROGRESS */}
        {activeTab === 'attendance' && (
          <motion.div
            key="attendance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>{language === 'bn' ? 'ক্লাস উপস্থিতি ও পারফরম্যান্স রিপোর্ট' : 'Class Attendance & Evaluation Report'}</span>
            </h3>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">Overall Attendance Rate</h4>
                  <p className="text-xs text-slate-500">Minimum 75% attendance required for final certificate</p>
                </div>
                <span className="text-2xl font-black text-indigo-600">{attendanceRate}%</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${attendanceRate}%` }} />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 text-center text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-700 font-bold block">Present Classes</span>
                  <span className="text-lg font-black text-emerald-800">22</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-rose-700 font-bold block">Absent</span>
                  <span className="text-lg font-black text-rose-800">2</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-amber-700 font-bold block">Late / Leave</span>
                  <span className="text-lg font-black text-amber-800">1</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: MATERIALS & CLASS RECORDINGS */}
        {activeTab === 'materials' && (
          <motion.div
            key="materials"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
              <Video className="w-4 h-4 text-indigo-600" />
              <span>{language === 'bn' ? 'ক্লাস রিসোর্স, প্রজেক্ট ফাইল ও ভিডিও রেকর্ডিং' : 'Course Handouts, Source Codes & Class Recordings'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-sm">Course Modules & Practical Lab Exercises</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Download syllabus PDFs, project guidelines, software setup instructions, and Git repository starter packs.
                </p>
                <a
                  href="#download"
                  onClick={e => {
                    e.preventDefault();
                    alert('Course repository pack will download shortly.');
                  }}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Lab Exercise Pack (.zip)</span>
                </a>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-sm">Class HD Video Archive & Backup Lectures</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Catch up on any missed lab session with full HD recorded lectures and step-by-step coding demonstrations.
                </p>
                <a
                  href="#recordings"
                  onClick={e => {
                    e.preventDefault();
                    alert('Opening student private Google Drive recording folder.');
                  }}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 pt-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Video Recordings Drive</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: ONLINE CERTIFICATE */}
        {activeTab === 'certificate' && (
          <motion.div
            key="certificate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>{language === 'bn' ? 'সরকারি ভেরিফায়েড সার্টিফিকেট' : 'Official Verified Certificate'}</span>
            </h3>

            {studentCertificates.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xs text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="font-black text-slate-900 text-sm">Course Under Progress</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Your official certificate with QR verification code will be published here upon completion of final lab projects and exam.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {studentCertificates.map(cert => (
                  <div key={cert.id} className="bg-white p-6 rounded-3xl border-2 border-indigo-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-md">
                        <Award className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider font-mono">
                          CERTIFICATE #{cert.certificateNumber}
                        </span>
                        <h4 className="font-black text-slate-900 text-base">
                          {courses.find(c => c.id === cert.courseId)?.name || 'Professional IT Course'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Grade: <b className="text-emerald-600">{cert.grade}</b> • Issued on {cert.issueDate}
                        </p>
                      </div>
                    </div>

                    {onOpenCertificateModal && (
                      <button
                        onClick={() => onOpenCertificateModal(cert.certificateNumber)}
                        className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-2xl shadow-md flex items-center space-x-2"
                      >
                        <Printer className="w-4 h-4" />
                        <span>{language === 'bn' ? 'সার্টিফিকেট প্রিন্ট / ভিউ' : 'View / Print Certificate'}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
