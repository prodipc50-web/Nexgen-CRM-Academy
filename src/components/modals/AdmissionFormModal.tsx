import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAcademy } from '../../context/AcademyContext';
import { Admission, Student, Course, Batch } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import { executeCleanPrint } from '../../utils/printHelper';
import {
  X,
  Printer,
  ShieldCheck,
  ArrowLeft,
  Edit3,
  RotateCcw,
  Save,
  Check,
  Phone,
  Building,
  MapPin,
  Globe,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  UserCheck,
  Video,
  Monitor,
  Layers,
  CreditCard,
  BookOpen,
  Bot,
  Compass,
  Camera
} from 'lucide-react';
import {
  STUDENT_TERMS_AND_CONDITIONS,
  STUDENT_DECLARATION_TEXT,
  STUDENT_TERMS_HEADER_SUBTITLE,
  STUDENT_TERMS_NOTICE
} from '../../data/studentTerms';

interface AdmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  admissionId?: string;
  studentId?: string;
  student?: Student;
  admission?: Admission;
  course?: Course;
  batch?: Batch;
}

export const AdmissionFormModal: React.FC<AdmissionFormModalProps> = ({
  isOpen,
  onClose,
  admissionId,
  studentId,
  student: propStudent,
  admission: propAdmission,
  course: propCourse,
  batch: propBatch
}) => {
  const {
    admissions,
    students,
    courses,
    batches,
    staffList,
    academySettings,
    updateAcademySettings
  } = useAcademy();

  const [showEditor, setShowEditor] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSheetTab, setActiveSheetTab] = useState<'form' | 'terms' | 'both'>('form');

  const effectiveTerms = (academySettings.studentTerms || STUDENT_TERMS_AND_CONDITIONS).filter(
    c => c.isActive !== false
  );
  const effectiveDeclaration = academySettings.studentTermsDeclaration || STUDENT_DECLARATION_TEXT;

  // Find target admission & student
  const admission = propAdmission || (admissionId
    ? admissions.find(a => a.id === admissionId || a.admissionCode === admissionId)
    : studentId
    ? admissions.find(a => a.studentId === studentId)
    : admissions[0]);

  const student = propStudent || (admission
    ? students.find(s => s.id === admission.studentId)
    : studentId
    ? students.find(s => s.id === studentId)
    : students[0]);

  const course = propCourse || (admission ? courses.find(c => c.id === admission.courseId) : courses[0]);
  const batch = propBatch || (admission ? batches.find(b => b.id === admission.batchId) : batches[0]);
  const counselor = admission ? staffList.find(s => s.id === admission.counselorId) : undefined;

  // Fully customizable form state
  const [formData, setFormData] = useState({
    instituteName: academySettings.instituteName || 'Nexgen Computer Academy',
    tagline: academySettings.tagline || 'Institute of Information Technology & Professional Skills',
    campusName: academySettings.campusName || 'Farmgate Campus',
    address: academySettings.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215',
    hotlinePhone: academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444',
    website: academySettings.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : 'nexgenacademy.edu.bd',
    email: academySettings.officialEmail || 'info@nexgenacademy.edu.bd',
    formNumber: admission?.admissionCode || 'NCA-ADM-2026-001',
    admissionDate: admission?.admissionDate || new Date().toISOString().split('T')[0],
    
    // Student Personal
    name: student?.name || '',
    studentCode: student?.studentCode || 'NCA-STU-001',
    phone: student?.phone || '',
    altPhone: student?.altPhone || '',
    studentEmail: student?.email || '',
    addressText: student?.address || '',
    dateOfBirth: student?.dateOfBirth || '',
    gender: student?.gender || 'Male',
    bloodGroup: student?.bloodGroup || 'A+',
    occupation: student?.occupation || 'Student',
    education: student?.education || 'HSC',
    institution: student?.institution || '',
    photoUrl: student?.photoUrl || '',

    // Guardian
    guardianName: student?.guardianName || '',
    guardianPhone: student?.guardianPhone || student?.emergencyContact || '',
    relation: 'Parent / Guardian',

    // Academic & Learning Mode
    courseName: course?.name || 'Professional IT Course',
    courseCode: course?.code || 'NCA-CRS-01',
    duration: course?.duration || '3 Months (36 Classes)',
    batchNumber: batch?.batchNumber || 'Batch-01',
    classSchedule: batch ? `${batch.classDays} (${batch.classTime})` : 'Sun, Tue, Thu (6:00 PM - 8:00 PM)',
    learningMode: admission?.learningMode || (course?.deliveryMode || 'Offline'), // 'Offline' | 'Online Live' | 'Hybrid'
    admissionType: admission?.admissionType || 'In-Person / Office',
    onlinePlatform: batch?.onlinePlatform || 'Google Meet / Zoom & LMS Portal',
    counselorName: admission?.counselorName || counselor?.name || 'Academic Counselor',
    leadSource: admission?.leadSource || 'Direct Campus Walk-in',

    // Financial Record
    regularFee: admission?.regularFee ?? course?.regularFee ?? course?.offerFee ?? 0,
    discountScholarship: (admission?.discount || 0) + (admission?.scholarship || 0),
    finalFee: admission?.finalFee ?? course?.offerFee ?? course?.regularFee ?? 0,
    paidAmount: admission?.totalPaid || 6000,
    dueBalance: admission?.due ?? 6000,
    nextDueDate: admission?.nextPaymentDate || '',
    paymentMethod: 'Cash / Mobile Banking',

    // Terms & Conditions
    terms: academySettings.admissionFormTerms || 
      '1. Minimum 80% class attendance & timely lab assignment submissions are mandatory for certification.\n' +
      '2. Online students must ensure a stable internet connection and active microphone/webcam when requested.\n' +
      '3. Course fees once paid are non-refundable after the official batch orientation class.\n' +
      '4. Any violation of institute code of conduct or unauthorized sharing of recorded materials will result in immediate suspension.\n' +
      '5. I hereby declare that the information provided above is true and correct to the best of my knowledge.',
    
    // Signatures
    directorName: academySettings.idCardSignatoryName || 'Prodip Chowdhury',
    directorTitle: 'Authorized Officer / Director',
    counselorTitle: 'Counselor / Admission In-Charge'
  });

  // Sync state on prop changes
  useEffect(() => {
    if (admission || student) {
      setFormData(prev => ({
        ...prev,
        instituteName: academySettings.instituteName || prev.instituteName,
        tagline: academySettings.tagline || prev.tagline,
        campusName: academySettings.campusName || prev.campusName || 'Farmgate Campus',
        address: academySettings.officialAddress || prev.address,
        hotlinePhone: academySettings.primarySupportPhone || academySettings.helplines?.[0] || prev.hotlinePhone || '01798444444',
        website: academySettings.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : prev.website,
        email: academySettings.officialEmail || prev.email,
        formNumber: admission?.admissionCode || prev.formNumber,
        admissionDate: admission?.admissionDate || prev.admissionDate,
        name: student?.name || prev.name,
        studentCode: student?.studentCode || prev.studentCode,
        phone: student?.phone || prev.phone,
        altPhone: student?.altPhone || prev.altPhone,
        studentEmail: student?.email || prev.studentEmail,
        addressText: student?.address || prev.addressText,
        dateOfBirth: student?.dateOfBirth || prev.dateOfBirth,
        gender: student?.gender || prev.gender,
        bloodGroup: student?.bloodGroup || prev.bloodGroup,
        occupation: student?.occupation || prev.occupation,
        education: student?.education || prev.education,
        institution: student?.institution || prev.institution,
        photoUrl: student?.photoUrl || prev.photoUrl,
        guardianName: student?.guardianName || prev.guardianName,
        guardianPhone: student?.guardianPhone || student?.emergencyContact || prev.guardianPhone,
        courseName: course?.name || prev.courseName,
        courseCode: course?.code || prev.courseCode,
        duration: course?.duration || prev.duration,
        batchNumber: batch?.batchNumber || prev.batchNumber,
        classSchedule: batch ? `${batch.classDays} (${batch.classTime})` : prev.classSchedule,
        learningMode: admission?.learningMode || prev.learningMode,
        admissionType: admission?.admissionType || prev.admissionType,
        counselorName: admission?.counselorName || counselor?.name || prev.counselorName,
        leadSource: admission?.leadSource || prev.leadSource,
        regularFee: admission?.regularFee || course?.regularFee || prev.regularFee,
        discountScholarship: (admission?.discount || 0) + (admission?.scholarship || 0),
        finalFee: admission?.finalFee || course?.offerFee || prev.finalFee,
        paidAmount: admission?.totalPaid || prev.paidAmount,
        dueBalance: admission?.due ?? prev.dueBalance,
        nextDueDate: admission?.nextPaymentDate || prev.nextDueDate,
        directorName: academySettings.idCardSignatoryName || prev.directorName
      }));
    }
  }, [admission, student, course, batch, counselor, academySettings, isOpen]);

  const handlePrint = () => {
    const docTitle =
      activeSheetTab === 'terms'
        ? `Student_Terms_${formData.formNumber}_${(formData.name || 'Student').replace(/\s+/g, '_')}`
        : activeSheetTab === 'both'
        ? `Admission_Complete_Set_${formData.formNumber}_${(formData.name || 'Student').replace(/\s+/g, '_')}`
        : `Admission_Form_${formData.formNumber}_${(formData.name || 'Student').replace(/\s+/g, '_')}`;

    executeCleanPrint({
      documentTitle: docTitle,
      size: 'a4',
      orientation: 'portrait',
      margin: '4mm'
    });
  };

  // Handle ESC and Ctrl+P key press
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
  }, [isOpen, onClose, formData]);

  if (!isOpen) return null;

  const handleSaveDefaults = () => {
    updateAcademySettings({
      primarySupportPhone: formData.hotlinePhone,
      campusName: formData.campusName,
      officialAddress: formData.address,
      admissionFormTerms: formData.terms,
      idCardSignatoryName: formData.directorName
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:static print:p-0 print:m-0 print:bg-white print:overflow-visible"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[96vh] animate-in zoom-in-95 duration-150 print:max-w-none print:w-full print:h-auto print:max-h-none print:shadow-none print:border-none print:rounded-none print:overflow-visible"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Toolbar (Hidden on print) */}
        <div className="sticky top-0 z-20 p-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold border border-slate-700 hover:border-slate-600 transition-colors shadow-xs"
              title="Go back / ফিরে যান (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <span>← Back</span>
            </button>

            <button
              type="button"
              onClick={() => setShowEditor(!showEditor)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                showEditor
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>{showEditor ? 'Hide Editor' : 'Edit / Customize Form (ম্যানুয়াল এডিট)'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {saveSuccess && (
              <span className="hidden sm:flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700">
                <Check className="w-3.5 h-3.5" />
                <span>Saved Defaults</span>
              </span>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>
                {activeSheetTab === 'form'
                  ? 'Print A4 Form'
                  : activeSheetTab === 'terms'
                  ? 'Print Terms Sheet'
                  : 'Print 2-Page Set'}
              </span>
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

        {/* Sheet Selector Sub-Bar */}
        <div className="bg-slate-800 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 print:hidden text-xs">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => setActiveSheetTab('form')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeSheetTab === 'form'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>১. ভর্তি আবেদন ফরম</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSheetTab('terms')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeSheetTab === 'terms'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>২. আচরণবিধি ও শর্তাবলী (Terms)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSheetTab('both')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeSheetTab === 'both'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>উভয় পেজ একসাথে (Both Pages)</span>
            </button>
          </div>

          <span className="text-[11px] font-semibold text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700 hidden sm:inline">
            {activeSheetTab === 'form'
              ? 'Page 1: Admission Form Sheet'
              : activeSheetTab === 'terms'
              ? 'Page 2: Official Terms & Conditions'
              : 'Complete Set: Page 1 + Page 2'}
          </span>
        </div>

        {/* Customizer Drawer */}
        {showEditor && (
          <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 max-h-80 overflow-y-auto space-y-4 print:hidden animate-in slide-in-from-top-2 duration-150 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Live Admission Form Editor (প্রিন্ট করার আগে যেকোনো ফিল্ড এডিট করুন)</span>
              </span>
              <button
                type="button"
                onClick={handleSaveDefaults}
                className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-xs"
              >
                <Save className="w-3 h-3" />
                <span>Save Terms as Default</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Alternative Phone</label>
                <input
                  type="text"
                  value={formData.altPhone}
                  onChange={e => setFormData({ ...formData, altPhone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.studentEmail}
                  onChange={e => setFormData({ ...formData, studentEmail: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={formData.dateOfBirth}
                  onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  placeholder="YYYY-MM-DD"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Blood Group</label>
                <input
                  type="text"
                  value={formData.bloodGroup}
                  onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Course Name</label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Batch Number</label>
                <input
                  type="text"
                  value={formData.batchNumber}
                  onChange={e => setFormData({ ...formData, batchNumber: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Learning Mode (ক্লাস নেওয়ার ধরন)</label>
                <select
                  value={formData.learningMode}
                  onChange={e => setFormData({ ...formData, learningMode: e.target.value as any })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                >
                  <option value="Offline">Offline / Classroom (ক্যাম্পাস ল্যাব)</option>
                  <option value="Online Live">Online Live Class (অনলাইন লাইভ)</option>
                  <option value="Hybrid">Hybrid (Offline + Online Live)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Total Agreed Fee (৳)</label>
                <input
                  type="number"
                  value={formData.finalFee}
                  onChange={e => setFormData({ ...formData, finalFee: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Paid Amount (৳)</label>
                <input
                  type="number"
                  value={formData.paidAmount}
                  onChange={e => setFormData({ ...formData, paidAmount: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Due Balance (৳)</label>
                <input
                  type="number"
                  value={formData.dueBalance}
                  onChange={e => setFormData({ ...formData, dueBalance: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-600 font-semibold mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.addressText}
                  onChange={e => setFormData({ ...formData, addressText: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-600 font-semibold mb-1">Admission Terms & Declaration</label>
                <textarea
                  rows={3}
                  value={formData.terms}
                  onChange={e => setFormData({ ...formData, terms: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Printable A4 Form Sheet */}
        <div
          className="overflow-y-auto flex-1 p-5 sm:p-8 bg-white text-slate-900 font-sans print:p-0 print:m-0 print-page-a4"
          id="admission-form-printable"
        >
          {/* Page 1: Admission Form Sheet (Strict Guaranteed 1-Page Fit) */}
          {(activeSheetTab === 'form' || activeSheetTab === 'both') && (
            <div className={`admission-page-sheet ${activeSheetTab === 'both' ? 'admission-page-break' : ''} flex flex-col justify-between`}>
              {/* Header Banner with Logo & Passport Photo Box */}
              <div className="flex items-start justify-between border-b-2 border-indigo-950 pb-2.5 print:pb-1">
            <div className="flex items-center space-x-3 flex-1">
              <NexgenLogo variant="crest" size={50} />
              <div>
                <h1 className="text-xl print:text-base font-black text-indigo-950 uppercase tracking-tight leading-none">
                  {formData.instituteName}
                </h1>
                <p className="text-[10px] text-slate-600 font-bold tracking-wide mt-0.5">
                  {formData.tagline}
                </p>
                <p className="text-[9.5px] text-slate-600 font-medium mt-1">
                  <strong className="text-indigo-950">{formData.campusName}</strong>: {formData.address} | Hotline: <strong className="text-slate-950 font-mono">{formData.hotlinePhone}</strong> | <span className="text-indigo-700 font-mono">{formData.website}</span>
                </p>
              </div>
            </div>

            {/* Passport Photo Box */}
            <div className="w-24 h-28 print:w-20 print:h-24 border-2 border-dashed border-slate-400 rounded-lg flex flex-col items-center justify-center p-1 bg-slate-50 text-center shrink-0 ml-3">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt={formData.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="text-[9px] text-slate-400 font-semibold leading-tight">
                  <GraduationCap className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                  Affix Passport Size Photo (35×45mm)
                </div>
              )}
            </div>
          </div>

          {/* Form Title & Reg Meta */}
          <div className="flex items-center justify-between my-2.5 print:my-1 px-3 print:px-2 py-1.5 print:py-0.5 bg-slate-100 rounded-lg border border-slate-300">
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-900 text-white text-[11px] print:text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wide">
                STUDENT ADMISSION & REGISTRATION FORM
              </span>
              <span className="text-[10px] print:text-[9px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Mode: {formData.learningMode === 'Online Live' ? '🟢 Online Live Interactive' : formData.learningMode === 'Hybrid' ? '🟣 Hybrid (Lab + Online)' : '🔵 Offline / Campus Lab'}
              </span>
            </div>
            <div className="text-right text-[10.5px] print:text-[9.5px] text-slate-700 space-x-3">
              <span>Form No: <strong className="font-mono text-indigo-950">{formData.formNumber}</strong></span>
              <span>Date: <strong className="font-mono text-slate-900">{formData.admissionDate}</strong></span>
            </div>
          </div>

          {/* 1. Student Personal Information */}
          <div className="space-y-1 mt-2 print:mt-1">
            <div className="bg-slate-800 text-white px-2.5 print:px-2 py-1 print:py-0.5 text-[10px] print:text-[9px] font-extrabold uppercase tracking-wider rounded-t flex items-center space-x-1.5">
              <span>1. STUDENT PERSONAL INFORMATION (শিক্ষার্থীর ব্যক্তিগত বিবরণ)</span>
            </div>
            <div className="border border-slate-300 rounded-b p-2.5 print:p-1.5 text-[11px] print:text-[10px] grid grid-cols-3 gap-x-4 gap-y-1.5 print:gap-y-0.5 bg-slate-50/50">
              <div className="col-span-2">
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Full Name of Student (শিক্ষার্থীর নাম):</span>
                <span className="font-bold text-slate-950 text-xs print:text-[11px]">{formData.name || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Student ID Code (আইডি):</span>
                <span className="font-mono font-bold text-indigo-900">{formData.studentCode || '—'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Mobile Number (ফোন):</span>
                <span className="font-mono font-bold text-slate-900">{formData.phone || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Alternative Phone (বিকল্প ফোন):</span>
                <span className="font-mono text-slate-800">{formData.altPhone || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Email Address (ইমেইল):</span>
                <span className="font-mono text-slate-800 text-[10px] print:text-[9px] truncate block">{formData.studentEmail || '—'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Date of Birth (জন্ম তারিখ):</span>
                <span className="font-mono text-slate-800">{formData.dateOfBirth || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Gender (লিঙ্গ):</span>
                <span className="font-semibold text-slate-900">{formData.gender || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Blood Group (রক্তের গ্রুপ):</span>
                <span className="font-bold text-rose-700">{formData.bloodGroup || '—'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Occupation (পেশা):</span>
                <span className="font-medium text-slate-800">{formData.occupation || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Education (শিক্ষাগত যোগ্যতা):</span>
                <span className="font-medium text-slate-800">{formData.education || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">School/College/Institute:</span>
                <span className="font-medium text-slate-800 truncate block">{formData.institution || '—'}</span>
              </div>

              <div className="col-span-3">
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Present & Permanent Address (ঠিকানা):</span>
                <span className="font-medium text-slate-900">{formData.addressText || '—'}</span>
              </div>
            </div>
          </div>

          {/* 2. Guardian & Emergency Contact */}
          <div className="space-y-1 mt-2 print:mt-1">
            <div className="bg-slate-800 text-white px-2.5 print:px-2 py-1 print:py-0.5 text-[10px] print:text-[9px] font-extrabold uppercase tracking-wider rounded-t flex items-center space-x-1.5">
              <span>2. GUARDIAN & EMERGENCY CONTACT (অভিভাবক ও জরুরি যোগাযোগ)</span>
            </div>
            <div className="border border-slate-300 rounded-b p-2.5 print:p-1.5 text-[11px] print:text-[10px] grid grid-cols-3 gap-x-4 gap-y-1.5 print:gap-y-0.5 bg-slate-50/50">
              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Guardian Name (অভিভাবকের নাম):</span>
                <span className="font-bold text-slate-900">{formData.guardianName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Relationship (সম্পর্ক):</span>
                <span className="font-medium text-slate-800">{formData.relation || 'Parent'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Guardian Contact Phone:</span>
                <span className="font-mono font-bold text-slate-900">{formData.guardianPhone || '—'}</span>
              </div>
            </div>
          </div>

          {/* 3. Applied Program & Learning Delivery Mode */}
          <div className="space-y-1 mt-2 print:mt-1">
            <div className="bg-indigo-900 text-white px-2.5 print:px-2 py-1 print:py-0.5 text-[10px] print:text-[9px] font-extrabold uppercase tracking-wider rounded-t flex items-center space-x-1.5">
              <span>3. ENROLLED COURSE & LEARNING DELIVERY MODE (কোর্স ও ক্লাসের মাধ্যম)</span>
            </div>
            <div className="border border-slate-300 rounded-b p-2.5 print:p-1.5 text-[11px] print:text-[10px] grid grid-cols-3 gap-x-4 gap-y-2 print:gap-y-1 bg-slate-50/50">
              <div className="col-span-2">
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Enrolled Course (কোর্সের নাম):</span>
                <span className="font-black text-slate-950 text-xs print:text-[11px]">{formData.courseName}</span>
                <span className="text-[10px] print:text-[9px] text-slate-500 font-mono block">Code: {formData.courseCode} • Duration: {formData.duration}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] print:text-[9px] block">Batch & Timings:</span>
                <span className="font-bold text-indigo-950">{formData.batchNumber}</span>
                <span className="text-[10px] print:text-[9px] text-slate-600 block">{formData.classSchedule}</span>
              </div>

              {/* Delivery Mode Selector Box */}
              <div className="col-span-3 bg-white p-2 print:p-1.5 rounded-lg border border-indigo-200">
                <span className="text-indigo-950 font-bold text-[10.5px] print:text-[9.5px] block mb-1">
                  Selected Learning Delivery Method (ক্লাস করার মাধ্যম):
                </span>
                <div className="grid grid-cols-3 gap-2 print:gap-1 text-[10px] print:text-[9px]">
                  <div className={`p-1.5 print:p-1 rounded border flex items-center space-x-1.5 ${
                    formData.learningMode === 'Offline' ? 'bg-indigo-50 border-indigo-600 font-bold text-indigo-950' : 'border-slate-200 text-slate-500'
                  }`}>
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                      formData.learningMode === 'Offline' ? 'bg-indigo-600 text-white border-indigo-600 font-bold' : 'border-slate-400'
                    }`}>
                      {formData.learningMode === 'Offline' ? '✓' : ''}
                    </span>
                    <span>1. Physical / Campus Lab</span>
                  </div>

                  <div className={`p-1.5 print:p-1 rounded border flex items-center space-x-1.5 ${
                    formData.learningMode === 'Online Live' ? 'bg-indigo-50 border-indigo-600 font-bold text-indigo-950' : 'border-slate-200 text-slate-500'
                  }`}>
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                      formData.learningMode === 'Online Live' ? 'bg-indigo-600 text-white border-indigo-600 font-bold' : 'border-slate-400'
                    }`}>
                      {formData.learningMode === 'Online Live' ? '✓' : ''}
                    </span>
                    <span>2. Online Live Classes</span>
                  </div>

                  <div className={`p-1.5 print:p-1 rounded border flex items-center space-x-1.5 ${
                    formData.learningMode === 'Hybrid' ? 'bg-indigo-50 border-indigo-600 font-bold text-indigo-950' : 'border-slate-200 text-slate-500'
                  }`}>
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                      formData.learningMode === 'Hybrid' ? 'bg-indigo-600 text-white border-indigo-600 font-bold' : 'border-slate-400'
                    }`}>
                      {formData.learningMode === 'Hybrid' ? '✓' : ''}
                    </span>
                    <span>3. Hybrid (Lab + Online)</span>
                  </div>
                </div>
                <div className="mt-1 text-[9.5px] print:text-[8.5px] text-slate-500 flex items-center justify-between">
                  <span>Online Platform: <strong className="text-slate-800">{formData.onlinePlatform}</strong></span>
                  <span>Assigned Counselor: <strong className="text-slate-800">{formData.counselorName}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Financial & Payment Summary Table */}
          <div className="space-y-1 mt-2 print:mt-1">
            <div className="bg-slate-800 text-white px-2.5 print:px-2 py-1 print:py-0.5 text-[10px] print:text-[9px] font-extrabold uppercase tracking-wider rounded-t flex items-center space-x-1.5">
              <span>4. COURSE FEE STRUCTURE & PAYMENT RECORD (ফি ও পেমেন্ট বিবরণ)</span>
            </div>
            <div className="border border-slate-300 rounded-b p-2 print:p-1 text-[11px] print:text-[10px] bg-slate-50/50">
              <div className="grid grid-cols-4 gap-2 print:gap-1 text-center">
                <div className="bg-white p-1.5 print:p-1 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] print:text-[8.5px] block">Regular Course Fee:</span>
                  <span className="font-semibold text-slate-800">৳{formData.regularFee.toLocaleString()}</span>
                </div>
                <div className="bg-white p-1.5 print:p-1 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] print:text-[8.5px] block">Discount / Scholarship:</span>
                  <span className="font-bold text-emerald-700">৳{formData.discountScholarship.toLocaleString()}</span>
                </div>
                <div className="bg-white p-1.5 print:p-1 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] print:text-[8.5px] block">Net Agreed Fee:</span>
                  <span className="font-black text-indigo-950">৳{formData.finalFee.toLocaleString()}</span>
                </div>
                <div className="bg-white p-1.5 print:p-1 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] print:text-[8.5px] block">Paid at Admission:</span>
                  <span className="font-black text-emerald-700">৳{formData.paidAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-1.5 print:mt-1 flex items-center justify-between text-[10.5px] print:text-[9.5px] bg-amber-50/80 p-1.5 print:p-1 rounded border border-amber-200 text-amber-950">
                <span>
                  Remaining Due Balance: <strong className="font-black text-rose-700 text-xs print:text-[11px]">৳{formData.dueBalance.toLocaleString()}</strong>
                  {formData.dueBalance === 0 && ' (Full Paid ✓)'}
                </span>
                {formData.dueBalance > 0 && formData.nextDueDate && (
                  <span>Due Commitment Date: <strong className="font-mono text-slate-900">{formData.nextDueDate}</strong></span>
                )}
                <span>Payment Mode: <strong className="text-slate-900">{formData.paymentMethod}</strong></span>
              </div>
            </div>
          </div>

          {/* 5. Terms, Rules & Student Declaration (Guaranteed 1-Page Fit) */}
          <div className="mt-1.5 print:mt-1 border border-slate-300 rounded p-1.5 print:p-1 bg-slate-50/70 text-[9.5px] print:text-[8px] text-slate-700">
            <span className="font-bold text-slate-900 uppercase tracking-wider block mb-0.5">
              Code of Conduct & Student Declaration (শিক্ষার্থীর অঙ্গীকারনামা):
            </span>
            <div className="leading-snug text-slate-600">
              আমি অঙ্গীকার করছি যে নেক্সজেন কম্পিউটার একাডেমির অভ্যন্তরীণ শৃঙ্খলা, ক্লাস উপস্থিতি এবং ফি সংক্রান্ত সকল নিয়ম মেনে চলব। ভর্তিকৃত ফি অফেরতযোগ্য ও অহস্তান্তরযোগ্য। কোর্স চলাকালীন একাডেমি ও ল্যাব সরঞ্জামের নিরাপত্তা বজায় রাখতে দায়বদ্ধ থাকব। (বিস্তারিত আচরণবিধি ও শর্তাবলী পৃষ্ঠা ২-এ বর্ণিত)।
            </div>
          </div>

          {/* 6. Signatures */}
          <div className="pt-3 print:pt-2 mt-2 print:mt-1 border-t border-slate-300 grid grid-cols-3 gap-4 items-end text-center text-xs">
            <div>
              <div className="h-5 print:h-4 border-b border-slate-400 w-32 mx-auto mb-1"></div>
              <span className="text-[9.5px] print:text-[8px] font-bold text-slate-700 uppercase block">Student Signature</span>
              <p className="text-[8.5px] print:text-[7.5px] text-slate-400">Date: {formData.admissionDate}</p>
            </div>

            <div>
              <div className="h-5 print:h-4 border-b border-slate-400 w-32 mx-auto mb-1 flex items-center justify-center">
                <span className="text-[10px] print:text-[8.5px] font-serif italic text-slate-700">{formData.counselorName}</span>
              </div>
              <span className="text-[9.5px] print:text-[8px] font-bold text-slate-700 uppercase block">{formData.counselorTitle}</span>
              <p className="text-[8.5px] print:text-[7.5px] text-slate-400">Nexgen Computer Academy</p>
            </div>

            <div>
              <div className="h-5 print:h-4 border-b border-indigo-900 w-36 mx-auto mb-1 flex items-center justify-center">
                <span className="text-[10px] print:text-[8.5px] font-serif italic font-bold text-indigo-950">{formData.directorName}</span>
              </div>
              <span className="text-[9.5px] print:text-[8px] font-black text-indigo-950 uppercase block">{formData.directorTitle}</span>
              <p className="text-[8.5px] print:text-[7.5px] text-indigo-800 font-semibold">Official Seal & Approval</p>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-1 print:mt-0.5 pt-1 border-t border-slate-200 text-center text-[8.5px] print:text-[7.5px] text-slate-400">
            Generated via {formData.instituteName} Enterprise Management System • Hotline: {formData.hotlinePhone} • {formData.website}
          </div>
            </div>
          )}

          {/* Page Break Separator when both pages are printed/viewed */}
          {activeSheetTab === 'both' && (
            <div className="my-6 border-t-2 border-dashed border-slate-300 relative flex items-center justify-center print:hidden">
              <span className="bg-teal-50 text-teal-900 border border-teal-300 px-3.5 py-1 text-[10.5px] font-black uppercase rounded-full tracking-wider shadow-2xs">
                ↓ Page 2: Student Terms & Conditions (ছাত্র আচরণবিধি ও নিয়মাবলী) ↓
              </span>
            </div>
          )}

          {/* Page 2: Official Student Terms & Conditions Sheet */}
          {(activeSheetTab === 'terms' || activeSheetTab === 'both') && (
            <div className="admission-page-sheet flex flex-col justify-between pt-2 print:pt-0">
              {/* Header Banner */}
              <div className="flex items-start justify-between border-b-2 border-teal-900 pb-2.5">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-teal-900 text-white flex items-center justify-center font-black text-lg tracking-tighter shrink-0">
                    NG
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-teal-950 uppercase tracking-tight leading-none">
                      {formData.instituteName}
                    </h2>
                    <p className="text-[10px] text-slate-600 font-bold tracking-wide mt-0.5">
                      {STUDENT_TERMS_HEADER_SUBTITLE}
                    </p>
                    <p className="text-[9.5px] text-slate-600 font-medium">
                      Hotline: <strong className="text-slate-900 font-mono">{formData.hotlinePhone}</strong> | {formData.website}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="bg-teal-900 text-white text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded tracking-wide inline-block">
                    STUDENT TERMS & CONDITIONS
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium mt-0.5">
                    Form: <strong className="font-mono text-teal-950">{formData.formNumber}</strong>
                  </p>
                </div>
              </div>

              {/* Notice & Student Meta Bar */}
              <div className="my-2 flex flex-wrap items-center justify-between gap-1 px-2.5 py-1 bg-teal-50/70 border border-teal-200 rounded-lg text-[10px]">
                <span className="font-bold text-teal-900">
                  {STUDENT_TERMS_NOTICE}
                </span>
                <div className="flex items-center space-x-3 text-slate-700">
                  <span>Student: <strong className="text-slate-950">{formData.name || '—'}</strong></span>
                  <span>ID: <strong className="font-mono text-teal-900">{formData.studentCode || '—'}</strong></span>
                  <span>Batch: <strong className="text-slate-950">{formData.batchNumber || '—'}</strong></span>
                </div>
              </div>

              {/* Clauses Grid Layout (Matching PDF 2-column aesthetic) */}
              <div className="grid grid-cols-2 gap-2 text-[9.5px] print:text-[8.5px] leading-tight">
                {effectiveTerms.map(clause => (
                  <div
                    key={clause.id}
                    className="border border-slate-300 rounded-lg overflow-hidden bg-white flex flex-col justify-between shadow-2xs"
                  >
                    <div className="bg-teal-900 text-white px-2 py-0.5 flex items-center justify-between">
                      <span className="font-black">
                        {clause.numberBn}. {clause.titleEn}
                      </span>
                      <span className="text-[8.5px] text-teal-200">
                        ({clause.titleBn})
                      </span>
                    </div>
                    <div className="p-2 text-slate-700 bg-slate-50/40">
                      <p>{clause.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Student Declaration Box */}
              <div className="mt-2.5 border border-teal-900/40 bg-teal-50/50 rounded-lg p-2 text-[9.5px] print:text-[8.5px]">
                <div className="flex items-start space-x-2">
                  <div className="w-3.5 h-3.5 border-2 border-teal-900 rounded bg-white flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-teal-900 text-[10px] font-black leading-none">✓</span>
                  </div>
                  <p className="font-bold text-teal-950 leading-snug">
                    {effectiveDeclaration}
                  </p>
                </div>
              </div>

              {/* Dual Signatures */}
              <div className="pt-5 print:pt-3 mt-3 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="h-6 print:h-5 border-b border-slate-400 w-44 mx-auto mb-1 flex items-end justify-center">
                    {formData.name && (
                      <span className="text-[10.5px] font-serif italic text-slate-800">{formData.name}</span>
                    )}
                  </div>
                  <span className="text-[10px] print:text-[9px] font-bold text-slate-800 uppercase block">
                    Student Signature & Date
                  </span>
                  <p className="text-[9px] print:text-[8px] text-slate-400">Date: {formData.admissionDate}</p>
                </div>

                <div>
                  <div className="h-6 print:h-5 border-b border-teal-900 w-48 mx-auto mb-1 flex items-end justify-center">
                    <span className="text-[10.5px] font-serif italic font-bold text-teal-950">{formData.directorName}</span>
                  </div>
                  <span className="text-[10px] print:text-[9px] font-black text-teal-950 uppercase block">
                    Authorized Signature — {formData.instituteName}
                  </span>
                  <p className="text-[9px] print:text-[8px] text-teal-700 font-semibold">Official Seal & Academic Approval</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-2 print:mt-1 pt-1 border-t border-slate-200 text-center text-[9px] print:text-[8px] text-slate-400">
                {formData.instituteName} • {formData.address} • Hotline: {formData.hotlinePhone} • {formData.website}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back (ফিরে যান)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>
              {activeSheetTab === 'form'
                ? 'Print Admission Form (ভর্তি ফরম প্রিন্ট)'
                : activeSheetTab === 'terms'
                ? 'Print Terms Sheet (শর্তাবলী প্রিন্ট)'
                : 'Print Full 2-Page Set (উভয় পেজ প্রিন্ট)'}
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
