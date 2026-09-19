import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Payment } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  X,
  Printer,
  CheckCircle,
  ShieldCheck,
  Download,
  ArrowLeft,
  Edit3,
  RotateCcw,
  Save,
  Check,
  Phone,
  Building,
  MapPin,
  Globe,
  MessageCircle,
  FileText
} from 'lucide-react';
import { getWhatsAppDirectUrl } from '../../utils/whatsappHelper';
import { numberToWordsEnglish } from '../../utils/numberToWords';
import { replaceShortcodes } from '../../utils/templateShortcodes';
import { executeCleanPrint } from '../../utils/printHelper';

interface MoneyReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptNumber?: string;
}

export const MoneyReceiptModal: React.FC<MoneyReceiptModalProps> = ({
  isOpen,
  onClose,
  receiptNumber
}) => {
  const { payments, admissions, students, courses, batches, academySettings, updateAcademySettings } = useAcademy();
  const [showEditor, setShowEditor] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [printFormat, setPrintFormat] = useState<'a4' | 'pos80' | 'pos58'>('a4');

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const payment = receiptNumber
    ? payments.find(p => p.receiptNumber === receiptNumber)
    : payments[0];

  const admission = payment ? admissions.find(a => a.id === payment.admissionId) : undefined;
  const student = payment ? students.find(s => s.id === payment.studentId) : undefined;
  const course = admission ? courses.find(c => c.id === admission.courseId) : undefined;
  const batch = admission ? batches.find(b => b.id === admission.batchId) : undefined;

  // Fully customizable receipt state
  const [receiptData, setReceiptData] = useState({
    instituteName: academySettings.instituteName || 'Nexgen Computer Academy',
    tagline: academySettings.tagline || 'Institute of Information Technology & Professional Skills',
    campusName: academySettings.campusName || 'Farmgate Campus',
    address: academySettings.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215',
    hotlinePhone: academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444',
    website: academySettings.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : 'nexgenacademy.edu.bd',
    receiptNumber: payment?.receiptNumber || 'REC-2026-001',
    date: payment?.date || new Date().toISOString().split('T')[0],
    studentName: student?.name || '',
    studentCode: student?.studentCode || '',
    studentPhone: student?.phone || '',
    courseName: course?.name || '',
    batchNumber: batch ? `${batch.batchNumber}${batch.classDays ? ` (${batch.classDays})` : ''}` : '',
    admissionCode: admission?.admissionCode || '',
    paymentDescription: payment ? (payment.installmentNumber === 1 ? 'Admission Fee & 1st Installment' : `Installment #${payment.installmentNumber} Payment`) : 'Course Tuition Fee',
    paymentNote: payment?.note || 'Academic Course Tuition Fee',
    paymentMethod: payment?.paymentMethod || 'Cash',
    transactionId: payment?.transactionId || '',
    paidAmount: payment?.amount || 0,
    totalFee: admission?.finalFee || payment?.amount || 0,
    totalPaid: admission?.totalPaid || payment?.amount || 0,
    dueBalance: admission?.due ?? 0,
    nextDueDate: admission?.nextPaymentDate || '',
    collectedBy: payment?.collectedBy || 'Cashier / Admin',
    signatoryTitle: academySettings.idCardSignatoryTitle || 'Authorized Signature / Seal'
  });

  const handlePrint = () => {
    executeCleanPrint({
      documentTitle: `Official_Receipt_${receiptData.receiptNumber}_${(receiptData.studentName || 'Student').replace(/\s+/g, '_')}`,
      size: printFormat === 'pos58' ? 'pos58' : printFormat === 'pos80' ? 'pos80' : 'a4',
      orientation: 'portrait',
      margin: (printFormat === 'pos80' || printFormat === 'pos58') ? '0mm' : '5mm'
    });
  };

  // Keyboard Shortcuts (Esc to close, Ctrl+P to print)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p' && isOpen) {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, receiptData, printFormat]);

  // Sync state whenever payment, admission or academy settings change
  useEffect(() => {
    if (payment) {
      setReceiptData(prev => ({
        ...prev,
        instituteName: academySettings.instituteName || prev.instituteName,
        tagline: academySettings.tagline || prev.tagline,
        campusName: academySettings.campusName || prev.campusName || 'Farmgate Campus',
        address: academySettings.officialAddress || prev.address,
        hotlinePhone: academySettings.primarySupportPhone || academySettings.helplines?.[0] || prev.hotlinePhone || '01798444444',
        website: academySettings.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : prev.website,
        receiptNumber: payment.receiptNumber,
        date: payment.date,
        studentName: student?.name || prev.studentName,
        studentCode: student?.studentCode || prev.studentCode,
        studentPhone: student?.phone || prev.studentPhone,
        courseName: course?.name || prev.courseName,
        batchNumber: batch ? `${batch.batchNumber}${batch.classDays ? ` (${batch.classDays})` : ''}` : prev.batchNumber,
        admissionCode: admission?.admissionCode || prev.admissionCode,
        paymentDescription: payment.installmentNumber === 1 ? 'Admission Fee & 1st Installment' : `Installment #${payment.installmentNumber} Payment`,
        paymentNote: payment.note || 'Academic Course Tuition Fee',
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId || '',
        paidAmount: payment.amount,
        totalFee: admission?.finalFee || payment.amount,
        totalPaid: admission?.totalPaid || payment.amount,
        dueBalance: admission?.due ?? 0,
        nextDueDate: admission?.nextPaymentDate || '',
        collectedBy: payment.collectedBy || prev.collectedBy
      }));
    }
  }, [payment, admission, student, course, batch, academySettings, isOpen]);

  if (!isOpen) return null;

  if (!payment) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        onClick={onClose}
      >
        <div 
          className="bg-white p-6 rounded-2xl shadow-xl max-w-sm text-center"
          onClick={e => e.stopPropagation()}
        >
          <p className="text-sm font-semibold text-slate-800">Receipt record not found.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg"
          >
            ← Back (ফিরে যান)
          </button>
        </div>
      </div>
    );
  }

  const handleSendWhatsAppReceipt = () => {
    const phone = receiptData.studentPhone;
    let msg = '';
    if (academySettings.messageTemplates?.paymentReceiptTemplate) {
      msg = replaceShortcodes(academySettings.messageTemplates.paymentReceiptTemplate, {
        institute_name: receiptData.instituteName,
        receipt_number: receiptData.receiptNumber,
        student_name: receiptData.studentName,
        student_code: receiptData.studentCode,
        course_name: receiptData.courseName,
        batch_number: receiptData.batchNumber,
        paid_amount: receiptData.paidAmount.toLocaleString(),
        due_amount: receiptData.dueBalance.toLocaleString(),
        due_date: receiptData.nextDueDate || 'নাই',
        helpline: receiptData.hotlinePhone
      });
    } else {
      msg = `🎓 *${receiptData.instituteName}*
🧾 *ফি পরিশোধের মানি রিসিট কনফার্মেশন*
----------------------------------------
রিসিপ্ট নং: ${receiptData.receiptNumber}
তারিখ: ${receiptData.date}

শিক্ষার্থীর নাম: ${receiptData.studentName}
শিক্ষার্থী আইডি: ${receiptData.studentCode}
কোর্স: ${receiptData.courseName}
ব্যাচ: ${receiptData.batchNumber}

পরিশোধিত ফি: ৳${receiptData.paidAmount.toLocaleString()} (${receiptData.paymentMethod}${receiptData.transactionId ? ` - Trx: ${receiptData.transactionId}` : ''})
মোট কোর্স ফি: ৳${receiptData.totalFee.toLocaleString()}
মোট পরিশোধ: ৳${receiptData.totalPaid.toLocaleString()}
বকেয়া ব্যালেন্স: ৳${receiptData.dueBalance.toLocaleString()}${receiptData.dueBalance > 0 && receiptData.nextDueDate ? ` (পরবর্তী তারিখ: ${receiptData.nextDueDate})` : ''}

সাপোর্ট ও ইনফো হটলাইন: ${receiptData.hotlinePhone}
ধন্যবাদ! আমাদের সাথেই থাকুন।`;
    }
    const url = getWhatsAppDirectUrl(phone, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSaveDefaults = () => {
    updateAcademySettings({
      primarySupportPhone: receiptData.hotlinePhone,
      campusName: receiptData.campusName,
      officialAddress: receiptData.address
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setReceiptData({
      instituteName: academySettings.instituteName || 'Nexgen Computer Academy',
      tagline: academySettings.tagline || 'Institute of Information Technology & Professional Skills',
      campusName: academySettings.campusName || 'Farmgate Campus',
      address: academySettings.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215',
      hotlinePhone: academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444',
      website: academySettings.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : 'nexgenacademy.edu.bd',
      receiptNumber: payment.receiptNumber,
      date: payment.date,
      studentName: student?.name || '',
      studentCode: student?.studentCode || '',
      studentPhone: student?.phone || '',
      courseName: course?.name || '',
      batchNumber: batch ? `${batch.batchNumber}${batch.classDays ? ` (${batch.classDays})` : ''}` : '',
      admissionCode: admission?.admissionCode || '',
      paymentDescription: payment.installmentNumber === 1 ? 'Admission Fee & 1st Installment' : `Installment #${payment.installmentNumber} Payment`,
      paymentNote: payment.note || 'Academic Course Tuition Fee',
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId || '',
      paidAmount: payment.amount,
      totalFee: admission?.finalFee || payment.amount,
      totalPaid: admission?.totalPaid || payment.amount,
      dueBalance: admission?.due ?? 0,
      nextDueDate: admission?.nextPaymentDate || '',
      collectedBy: payment.collectedBy || 'Cashier / Admin',
      signatoryTitle: academySettings.idCardSignatoryTitle || 'Authorized Signature / Seal'
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:static print:p-0 print:m-0 print:bg-white print:overflow-visible"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[96vh] animate-in zoom-in-95 duration-150 print:max-w-none print:w-full print:h-auto print:max-h-none print:shadow-none print:border-none print:rounded-none print:overflow-visible"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Actions (Hidden during print) */}
        <div className="sticky top-0 z-20 p-2.5 sm:p-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={onClose}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold border border-slate-700 hover:border-slate-600 transition-colors shadow-xs"
              title="Go back / ফিরে যান (Esc)"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span>Back</span>
            </button>
            
            {/* Format Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setPrintFormat('a4')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center space-x-1 transition-all ${
                  printFormat === 'a4'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="A4 Standard Page Layout"
              >
                <FileText className="w-3 h-3" />
                <span>A4</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('pos80')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center space-x-1 transition-all ${
                  printFormat === 'pos80'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="80mm Thermal Receipt (POS প্রিন্টার)"
              >
                <Printer className="w-3 h-3" />
                <span>POS 80mm</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('pos58')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center space-x-1 transition-all ${
                  printFormat === 'pos58'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="58mm Mini Thermal Receipt (২-ইঞ্চি মিনি POS প্রিন্টার)"
              >
                <Printer className="w-3 h-3" />
                <span>58mm</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowEditor(!showEditor)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                showEditor
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">{showEditor ? 'Hide Editor' : 'Edit Receipt'}</span>
              <span className="sm:hidden">Edit</span>
            </button>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* WhatsApp Receipt Button */}
            <button
              type="button"
              onClick={handleSendWhatsAppReceipt}
              className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
              title="Send Receipt Confirmation to Student via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {saveSuccess && (
              <span className="hidden sm:flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-lg border border-emerald-700">
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </span>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
              title="Official PDF / Print Receipt"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF / Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Manual Field Customizer Drawer */}
        {showEditor && (
          <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 max-h-80 overflow-y-auto space-y-4 print:hidden animate-in slide-in-from-top-2 duration-150 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Customize Receipt Header, Hotline & Student Details</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSaveDefaults}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 text-[11px] transition-colors"
                  title="Save Hotline & Campus as permanent academy defaults"
                >
                  <Save className="w-3 h-3" />
                  <span>Save Hotline Default</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center space-x-1 text-[11px] text-slate-500 hover:text-slate-800 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to DB</span>
                </button>
              </div>
            </div>

            {/* Helpline / Hotline Number Management */}
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-amber-950 font-bold flex items-center space-x-1.5 text-xs">
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Receipt Hotline / Support Phone Number (রিসিপ্টে প্রিন্ট হওয়ার হেল্পলাইন)</span>
                </label>
                <span className="text-[10px] text-amber-800 font-mono">Default: 01798444444</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={receiptData.hotlinePhone}
                    onChange={e => setReceiptData({ ...receiptData, hotlinePhone: e.target.value })}
                    placeholder="e.g. 01798444444"
                    className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono font-bold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs"
                  />
                </div>

                {/* Quick Select Buttons from Academy Helplines */}
                {academySettings.helplines && academySettings.helplines.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-amber-900 font-bold mr-1">Quick Select:</span>
                    {academySettings.helplines.map((hp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReceiptData({ ...receiptData, hotlinePhone: hp })}
                        className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border transition-colors ${
                          receiptData.hotlinePhone === hp
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {hp}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Campus / Branch</label>
                  <input
                    type="text"
                    value={receiptData.campusName}
                    onChange={e => setReceiptData({ ...receiptData, campusName: e.target.value })}
                    placeholder="e.g. Farmgate Campus"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Official Address</label>
                  <input
                    type="text"
                    value={receiptData.address}
                    onChange={e => setReceiptData({ ...receiptData, address: e.target.value })}
                    placeholder="14/B Garden Road, Farmgate, Dhaka-1215"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Website URL</label>
                  <input
                    type="text"
                    value={receiptData.website}
                    onChange={e => setReceiptData({ ...receiptData, website: e.target.value })}
                    placeholder="nexgenacademy.edu.bd"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Student & Invoice Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Student Name</label>
                <input
                  type="text"
                  value={receiptData.studentName}
                  onChange={e => setReceiptData({ ...receiptData, studentName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Student ID / Code</label>
                <input
                  type="text"
                  value={receiptData.studentCode}
                  onChange={e => setReceiptData({ ...receiptData, studentCode: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Student Contact Phone</label>
                <input
                  type="text"
                  value={receiptData.studentPhone}
                  onChange={e => setReceiptData({ ...receiptData, studentPhone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Course Name</label>
                <input
                  type="text"
                  value={receiptData.courseName}
                  onChange={e => setReceiptData({ ...receiptData, courseName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Batch & Schedule</label>
                <input
                  type="text"
                  value={receiptData.batchNumber}
                  onChange={e => setReceiptData({ ...receiptData, batchNumber: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Admission Number</label>
                <input
                  type="text"
                  value={receiptData.admissionCode}
                  onChange={e => setReceiptData({ ...receiptData, admissionCode: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Receipt Number</label>
                <input
                  type="text"
                  value={receiptData.receiptNumber}
                  onChange={e => setReceiptData({ ...receiptData, receiptNumber: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Payment Date</label>
                <input
                  type="date"
                  value={receiptData.date}
                  onChange={e => setReceiptData({ ...receiptData, date: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Paid Amount (৳)</label>
                <input
                  type="number"
                  value={receiptData.paidAmount}
                  onChange={e => setReceiptData({ ...receiptData, paidAmount: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Payment Method</label>
                <input
                  type="text"
                  value={receiptData.paymentMethod}
                  onChange={e => setReceiptData({ ...receiptData, paymentMethod: e.target.value })}
                  placeholder="Cash / bKash / Nagad / Bank"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Trx ID / Ref</label>
                <input
                  type="text"
                  value={receiptData.transactionId}
                  onChange={e => setReceiptData({ ...receiptData, transactionId: e.target.value })}
                  placeholder="Optional Transaction ID"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Cashier / Collected By</label>
                <input
                  type="text"
                  value={receiptData.collectedBy}
                  onChange={e => setReceiptData({ ...receiptData, collectedBy: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Agreed Total Fee (৳)</label>
                <input
                  type="number"
                  value={receiptData.totalFee}
                  onChange={e => setReceiptData({ ...receiptData, totalFee: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Outstanding Due Balance (৳)</label>
                <input
                  type="number"
                  value={receiptData.dueBalance}
                  onChange={e => setReceiptData({ ...receiptData, dueBalance: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Next Payment Due Date</label>
                <input
                  type="text"
                  value={receiptData.nextDueDate}
                  onChange={e => setReceiptData({ ...receiptData, nextDueDate: e.target.value })}
                  placeholder="e.g. 2026-09-15"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Printable Receipt Paper */}
        {(printFormat === 'pos80' || printFormat === 'pos58') ? (
          <div className="overflow-y-auto flex-1 p-2 sm:p-4 bg-slate-100 print:bg-white flex justify-center items-start">
            <div
              className={`w-full ${
                printFormat === 'pos58' ? 'max-w-[260px] p-2.5 text-[9.5px]' : 'max-w-[330px] p-4 text-[11px]'
              } bg-white text-slate-900 border border-slate-300 shadow-md print:shadow-none print:border-none ${
                printFormat === 'pos58' ? 'print-page-pos58' : 'print-page-pos80'
              } leading-snug font-sans space-y-2 rounded-xl print:rounded-none`}
              id="pos-receipt-printable"
            >
              {/* POS Thermal Header */}
              <div className="text-center space-y-0.5">
                <div className="flex justify-center mb-0.5">
                  <NexgenLogo variant="crest" size={printFormat === 'pos58' ? 32 : 40} />
                </div>
                <h3 className={`font-black ${printFormat === 'pos58' ? 'text-xs' : 'text-sm'} uppercase tracking-tight text-slate-950`}>
                  {receiptData.instituteName}
                </h3>
                <p className="text-[9px] text-slate-600 font-semibold">{receiptData.tagline}</p>
                <p className="text-[9px] text-slate-600 leading-tight">{receiptData.campusName}: {receiptData.address}</p>
                <p className="text-[10px] font-bold text-slate-900 font-mono">Hotline: {receiptData.hotlinePhone}</p>
              </div>

              <div className="border-t border-dashed border-slate-400 my-1" />

              {/* Receipt Metadata */}
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="font-bold">REC: {receiptData.receiptNumber}</span>
                <span>{receiptData.date}</span>
              </div>

              <div className="border-t border-dashed border-slate-400 my-1" />

              {/* Student Details */}
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-950 text-right truncate pl-2">{receiptData.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ID / Code:</span>
                  <span className="font-mono font-bold text-slate-900">{receiptData.studentCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono">{receiptData.studentPhone || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-start gap-1">
                  <span className="text-slate-500 shrink-0">Course:</span>
                  <span className="font-bold text-slate-900 text-right leading-tight truncate">{receiptData.courseName}</span>
                </div>
                {receiptData.batchNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch:</span>
                    <span className="text-slate-800 text-right">{receiptData.batchNumber}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-slate-400 my-1" />

              {/* Payment Item */}
              <div className="space-y-1">
                <div className="flex justify-between items-center font-bold text-xs">
                  <span className="truncate pr-2">{receiptData.paymentDescription}</span>
                  <span className="font-mono text-slate-950">৳{receiptData.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[9.5px] text-slate-500">
                  <span>Method: {receiptData.paymentMethod}</span>
                  {receiptData.transactionId && <span className="font-mono truncate">Trx: {receiptData.transactionId}</span>}
                </div>
              </div>

              <div className="border-t border-dashed border-slate-400 my-1" />

              {/* Summary / Dues */}
              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between text-slate-600">
                  <span>Agreed Fee:</span>
                  <span className="font-mono font-semibold">৳{receiptData.totalFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Paid:</span>
                  <span className="font-mono font-bold text-emerald-800">৳{receiptData.totalPaid.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-200 pt-1 flex justify-between font-black text-xs text-slate-950">
                  <span>Due Balance:</span>
                  <span className={`font-mono ${receiptData.dueBalance > 0 ? 'text-rose-700 font-black' : 'text-emerald-700'}`}>
                    ৳{receiptData.dueBalance.toLocaleString()}
                  </span>
                </div>
                {receiptData.dueBalance > 0 && receiptData.nextDueDate && (
                  <div className="text-[9px] font-bold text-center bg-slate-100 py-0.5 rounded border border-slate-200 text-slate-800 mt-1">
                    Next Due: {receiptData.nextDueDate}
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-slate-400 my-1" />

              <div className="text-[9px] text-slate-700 italic text-center leading-tight">
                In Words: {numberToWordsEnglish(receiptData.paidAmount)}
              </div>

              <div className="flex justify-center py-1">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&margin=0&data=${encodeURIComponent(
                    `RECEIPT:${receiptData.receiptNumber}|BDT:${receiptData.paidAmount}|${receiptData.studentCode}|${receiptData.date}`
                  )}`}
                  alt="Receipt POS QR"
                  className={printFormat === 'pos58' ? 'w-11 h-11 mx-auto' : 'w-13 h-13 mx-auto'}
                />
              </div>

              <div className="border-t border-dashed border-slate-400 my-1" />

              {/* Barcode Simulation & Footer */}
              <div className="text-center space-y-0.5 pt-0.5">
                <div className="font-mono text-[8px] tracking-widest text-slate-600 select-none">
                  ||||| | |||| ||| |||||| | ||||| ||
                </div>
                <p className="text-[9.5px] font-bold text-slate-800">
                  নেক্সজেন কম্পিউটার একাডেমিতে স্বাগতম!
                </p>
                <p className="text-[8.5px] text-slate-500">
                  System Generated | Cashier: {receiptData.collectedBy}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 p-4 sm:p-7 bg-white text-slate-900 font-sans space-y-4 print:space-y-2 print:p-0 print:m-0 print-page-a4" id="money-receipt-printable">
            {/* Header Banner */}
            <div className="flex items-start justify-between border-b-2 border-indigo-900 pb-3 print:pb-1.5">
              <div>
                <div className="flex items-center space-x-3">
                  <NexgenLogo variant="crest" size={50} />
                  <div>
                    <h2 className="text-xl font-black text-indigo-950 uppercase tracking-tight print:text-lg">
                      {receiptData.instituteName}
                    </h2>
                    <p className="text-[11px] text-slate-600 font-bold tracking-wide print:text-[10px]">
                      {receiptData.tagline}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 mt-1.5 print:mt-1 font-medium print:text-[9px]">
                  <strong className="text-indigo-950">{receiptData.campusName}</strong>: {receiptData.address} | Hotline: <strong className="text-slate-900 font-mono">{receiptData.hotlinePhone}</strong> | <span className="font-mono text-indigo-700">{receiptData.website}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider print:py-0.5">
                  Money Receipt
                </span>
                <div className="text-[11px] text-slate-600 mt-1.5 print:mt-1 space-y-0.5 print:text-[10px]">
                  <div>
                    <span className="font-semibold text-slate-500">Receipt No: </span>
                    <span className="font-mono font-bold text-slate-900">{receiptData.receiptNumber}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Date: </span>
                    <span className="font-bold text-slate-800">{receiptData.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student & Course Details */}
            <div className="grid grid-cols-2 gap-4 print:gap-2 bg-slate-50/80 p-3.5 print:p-2 rounded-xl print:rounded-lg border border-slate-200 text-xs print:text-[10.5px]">
              <div className="space-y-1">
                <div>
                  <span className="text-slate-500 text-[11px] print:text-[10px]">Student Name:</span>
                  <div className="font-bold text-slate-900 text-sm print:text-xs">{receiptData.studentName || 'Student Name'}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] print:text-[10px]">Student ID / Code:</span>
                  <div className="font-mono font-bold text-indigo-700">{receiptData.studentCode || 'NCA-STU-001'}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] print:text-[10px]">Contact Phone:</span>
                  <div className="font-medium text-slate-800 font-mono">{receiptData.studentPhone || 'N/A'}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div>
                  <span className="text-slate-500 text-[11px] print:text-[10px]">Enrolled Course:</span>
                  <div className="font-bold text-slate-900">{receiptData.courseName || 'Professional Course'}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] print:text-[10px]">Batch & Timing:</span>
                  <div className="font-bold text-slate-800">{receiptData.batchNumber || 'Batch-01'}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] print:text-[10px]">Admission No:</span>
                  <div className="font-mono text-slate-700">{receiptData.admissionCode || 'ADM-001'}</div>
                </div>
              </div>
            </div>

            {/* Payment Item Table */}
            <div className="border border-slate-300 rounded-xl print:rounded-lg overflow-x-auto text-xs print:text-[11px]">
              <table className="w-full min-w-[320px] text-left">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2 print:py-1 px-4 print:px-3">Description</th>
                    <th className="py-2 print:py-1 px-4 print:px-3">Method & Ref</th>
                    <th className="py-2 print:py-1 px-4 print:px-3 text-right">Paid Amount (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2.5 print:py-1.5 px-4 print:px-3">
                      <div className="font-bold text-slate-900">
                        {receiptData.paymentDescription}
                      </div>
                      <div className="text-[11px] print:text-[10px] text-slate-500">{receiptData.paymentNote}</div>
                    </td>
                    <td className="py-2.5 print:py-1.5 px-4 print:px-3 text-slate-700">
                      <div className="font-semibold">{receiptData.paymentMethod}</div>
                      {receiptData.transactionId && (
                        <div className="font-mono text-[10px] text-slate-500">Trx: {receiptData.transactionId}</div>
                      )}
                    </td>
                    <td className="py-2.5 print:py-1.5 px-4 print:px-3 text-right font-black text-sm print:text-xs text-slate-900">
                      ৳{receiptData.paidAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* In Words & Financial Breakdown */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 print:gap-3">
              <div className="space-y-2 print:space-y-1.5 flex-1 w-full">
                <div className="text-xs print:text-[10.5px] bg-slate-50 p-2.5 print:p-2 rounded-xl print:rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700">Amount in Words (কথায়): </span>
                  <span className="font-semibold text-indigo-950 italic">
                    {numberToWordsEnglish(receiptData.paidAmount)}
                  </span>
                </div>

                <div className="flex items-center space-x-3 p-2 print:p-1.5 bg-slate-50/60 rounded-xl print:rounded-lg border border-slate-200/80">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&margin=0&data=${encodeURIComponent(
                      `VERIFIED_OFFICIAL_RECEIPT|${receiptData.receiptNumber}|Student:${receiptData.studentName}|BDT ${receiptData.paidAmount}|Date:${receiptData.date}|${receiptData.instituteName}`
                    )}`}
                    alt="Receipt Verification QR"
                    className="w-12 h-12 print:w-11 print:h-11 rounded-lg border border-slate-300 p-0.5 bg-white shrink-0 shadow-2xs"
                  />
                  <div className="text-[10px] print:text-[9px] text-slate-500 space-y-0.5">
                    <div className="font-bold text-emerald-800 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Official Receipt QR Token</span>
                    </div>
                    <div className="text-slate-600">Scan QR to instantly verify institutional fee record authenticity.</div>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown & Summary */}
              <div className="w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-xl print:rounded-lg p-3 print:p-2 space-y-1 print:space-y-0.5 text-xs print:text-[10.5px] shrink-0">
                <div className="flex justify-between text-slate-600">
                  <span>Total Course Agreed Fee:</span>
                  <span className="font-semibold text-slate-900">৳{receiptData.totalFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Paid (Cumulative):</span>
                  <span className="font-bold text-emerald-700">৳{receiptData.totalPaid.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-300 pt-1 flex justify-between font-bold text-slate-900">
                  <span>Outstanding Due Balance:</span>
                  <span className={`font-black ${receiptData.dueBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ৳{receiptData.dueBalance.toLocaleString()}
                  </span>
                </div>
                {receiptData.dueBalance > 0 && receiptData.nextDueDate && (
                  <div className="text-[9.5px] text-amber-800 bg-amber-50 p-1 rounded border border-amber-200 text-center font-medium mt-0.5">
                    Next Due Date: {receiptData.nextDueDate}
                  </div>
                )}
              </div>
            </div>

            {/* Custom Printable Receipt Terms / Notes */}
            {academySettings.receiptNotes && (
              <div className="bg-slate-50 p-2 print:p-1.5 rounded-lg border border-slate-200 text-[10px] print:text-[9px] text-slate-600 space-y-0.5">
                <div className="font-bold text-slate-800">শর্তাবলী ও নির্দেশিকা (Terms & Instructions):</div>
                <div className="whitespace-pre-line leading-relaxed">
                  {replaceShortcodes(academySettings.receiptNotes, {
                    institute_name: receiptData.instituteName,
                    campus_name: receiptData.campusName,
                    campus_address: receiptData.address,
                    helpline: receiptData.hotlinePhone,
                    student_name: receiptData.studentName,
                    student_code: receiptData.studentCode,
                    course_name: receiptData.courseName,
                    batch_number: receiptData.batchNumber,
                    paid_amount: receiptData.paidAmount,
                    due_amount: receiptData.dueBalance,
                    receipt_number: receiptData.receiptNumber
                  })}
                </div>
              </div>
            )}

            {/* Footer & Signature Stamps */}
            <div className="pt-4 print:pt-2 border-t border-slate-200 grid grid-cols-2 gap-8 items-end text-xs print:text-[10px]">
              <div>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-[11px] print:text-[10px] mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Digitally Verified & System Generated</span>
                </div>
                <p className="text-[9.5px] print:text-[8.5px] text-slate-400">
                  Printed on: {new Date().toLocaleDateString()} | Cashier: {receiptData.collectedBy}
                </p>
                {academySettings.institutionSealUrl && (
                  <div className="mt-1">
                    <img
                      src={academySettings.institutionSealUrl}
                      alt="Official Seal"
                      className="w-12 h-12 print:w-10 print:h-10 object-contain mix-blend-multiply opacity-90"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              <div className="text-right">
                {academySettings.directorSignatureUrl ? (
                  <div className="inline-block w-48 text-center">
                    <img
                      src={academySettings.directorSignatureUrl}
                      alt="Signature"
                      className="h-8 print:h-7 mx-auto object-contain mix-blend-multiply mb-0.5"
                      referrerPolicy="no-referrer"
                    />
                    <div className="border-t border-slate-400 pt-0.5 font-semibold text-slate-700 text-xs print:text-[10px]">
                      {receiptData.signatoryTitle}
                    </div>
                  </div>
                ) : (
                  <div className="inline-block border-b border-slate-400 w-48 text-center pb-0.5 font-semibold text-slate-700 text-xs print:text-[10px]">
                    {receiptData.signatoryTitle}
                  </div>
                )}
                <div className="text-[9.5px] print:text-[8.5px] text-slate-400 mt-0.5">{receiptData.instituteName}</div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back (ফিরে যান)</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSendWhatsAppReceipt}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Receipt</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF / Print {printFormat === 'pos58' ? '(58mm Mini)' : printFormat === 'pos80' ? '(80mm POS)' : '(A4)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

