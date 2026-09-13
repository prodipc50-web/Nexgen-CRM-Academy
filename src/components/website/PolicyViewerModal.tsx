import React, { useState } from 'react';
import { PoliciesConfig } from '../../types';
import { useAcademy } from '../../context/AcademyContext';
import { X, ShieldCheck, FileCheck2, RefreshCw, Users2, Check, Edit3, Save, RotateCcw, Printer, ExternalLink } from 'lucide-react';
import { STUDENT_TERMS_AND_CONDITIONS, STUDENT_DECLARATION_TEXT } from '../../data/studentTerms';
import { StudentTermsModal } from '../modals/StudentTermsModal';

interface PolicyViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'terms' | 'privacy' | 'refund' | 'conduct' | 'studentTerms';
  policies?: PoliciesConfig;
  instituteName?: string;
}

export const PolicyViewerModal: React.FC<PolicyViewerModalProps> = ({
  isOpen,
  onClose,
  initialType = 'terms',
  policies: propPolicies,
  instituteName = 'Nexgen Computer Academy'
}) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig, currentUser, academySettings } = useAcademy();
  const [activeType, setActiveType] = useState<'terms' | 'privacy' | 'refund' | 'conduct' | 'studentTerms'>(initialType);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [saveToast, setSaveToast] = useState(false);
  const [showDedicatedTermsModal, setShowDedicatedTermsModal] = useState(false);

  const effectivePolicies = websiteCmsConfig.policies || propPolicies;

  const dynamicTerms = (academySettings?.studentTerms || STUDENT_TERMS_AND_CONDITIONS).filter(
    t => t.isActive !== false
  );
  const dynamicDeclaration = academySettings?.studentTermsDeclaration || STUDENT_DECLARATION_TEXT;

  React.useEffect(() => {
    if (initialType) {
      setActiveType(initialType);
      setIsEditing(false);
    }
  }, [initialType, isOpen]);

  const defaultTerms = `1. ACADEMIC INTEGRITY & REGISTRATION\nBy enrolling in any course at ${instituteName}, students agree to participate in all scheduled practical lab sessions, complete project assignments on time, and uphold ethical software development standards.\n\n2. CERTIFICATION REQUIREMENTS\nTo be awarded the Govt. Standard / Academy Certificate, a minimum attendance of 80% and passing grades on the final capstone project and viva examinations are mandatory.\n\n3. INTELLECTUAL PROPERTY\nAll course materials, lectures, source code starter kits, and project blueprints provided are proprietary educational assets of ${instituteName} and cannot be reproduced for commercial distribution without written consent.\n\n4. CAMPUS LAB ACCESS\nEnrolled students receive complimentary lifetime lab practice privileges during designated open lab hours, provided they adhere to the IT Lab Safety and Equipment Policy.`;

  const defaultPrivacy = `${instituteName} values your personal data and privacy.\n\n1. DATA COLLECTION\nWhen you apply for admission, seminar passes, or career counseling, we collect necessary contact information (name, phone number, email address, academic background).\n\n2. PURPOSE OF DATA USAGE\nYour data is solely used for academic tracking, batch allocation, student portal credentials, certificate verification, and job placement recommendations with hiring partners.\n\n3. THIRD-PARTY SHARING\nWe do NOT sell or lease personal student data to external marketing companies. Student details are only shared with corporate recruiters upon direct student consent for job placement interviews.\n\n4. SECURITY\nAll student records, invoices, and exam credentials are encrypted and stored within secure cloud databases with role-based access control.`;

  const defaultRefund = `1. CANCELLATION BEFORE ORIENTATION\nStudents may request a 100% full refund of admission fees if the cancellation request is submitted at least 48 hours prior to the batch orientation class.\n\n2. AFTER BATCH COMMENCEMENT\nOnce the official class modules have commenced, admission fees are non-refundable. However, students may request a batch transfer or batch freeze without additional fees.\n\n3. SPECIAL EXTENUATING CIRCUMSTANCES\nIn cases of medical emergency or verifiable relocation, the Academic Advisory Committee may authorize prorated fee credits for upcoming batches.`;

  const defaultConduct = `1. Respect for Instructors, Mentors, and Peer Students.\n2. Zero tolerance for harassment, software piracy, unauthorized network intrusion, or vandalism of lab workstations.\n3. Active engagement in group projects and timely peer feedback.\n4. Professional attire and adherence to physical and virtual classroom etiquette.`;

  const getPolicyText = (type: 'terms' | 'privacy' | 'refund' | 'conduct') => {
    switch (type) {
      case 'terms':
        return effectivePolicies?.termsAndConditions || defaultTerms;
      case 'privacy':
        return effectivePolicies?.privacyPolicy || defaultPrivacy;
      case 'refund':
        return effectivePolicies?.refundPolicy || defaultRefund;
      case 'conduct':
        return effectivePolicies?.codeOfConduct || defaultConduct;
    }
  };

  const getContent = () => {
    switch (activeType) {
      case 'terms':
        return {
          title: 'Terms & Conditions (শর্তাবলী)',
          icon: FileCheck2,
          text: getPolicyText('terms'),
          key: 'termsAndConditions' as const
        };
      case 'privacy':
        return {
          title: 'Privacy Policy (গোপনীয়তা নীতি)',
          icon: ShieldCheck,
          text: getPolicyText('privacy'),
          key: 'privacyPolicy' as const
        };
      case 'refund':
        return {
          title: 'Refund & Batch Transfer Policy (রিফান্ড নীতি)',
          icon: RefreshCw,
          text: getPolicyText('refund'),
          key: 'refundPolicy' as const
        };
      case 'conduct':
        return {
          title: 'Student Code of Conduct (শৃঙ্খলাবিধি)',
          icon: Users2,
          text: getPolicyText('conduct'),
          key: 'codeOfConduct' as const
        };
      case 'studentTerms':
        return {
          title: 'Student Terms & Conditions (ছাত্র আচরণবিধি ও ১০টি শর্তাবলী)',
          icon: ShieldCheck,
          text: '',
          key: 'studentTerms' as any
        };
    }
  };

  if (!isOpen) return null;

  const current = getContent();
  const Icon = current.icon;

  const handleStartEditing = () => {
    setEditedText(current.text);
    setIsEditing(true);
  };

  const handleSavePolicy = () => {
    const updatedPolicies = {
      ...(effectivePolicies || {}),
      [current.key]: editedText
    };
    updateWebsiteCmsConfig({
      policies: updatedPolicies as any
    });
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetToDefault = () => {
    let defText = '';
    if (activeType === 'terms') defText = defaultTerms;
    if (activeType === 'privacy') defText = defaultPrivacy;
    if (activeType === 'refund') defText = defaultRefund;
    if (activeType === 'conduct') defText = defaultConduct;
    setEditedText(defText);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black">{current.title}</h3>
              <p className="text-xs text-slate-400 font-medium">
                Official Institutional Legal Guidelines • {instituteName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleStartEditing}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
                title="Admin: Edit this policy text"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>এডিট পলিসি</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
              >
                বাতিল
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1.5 p-3 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveType('terms');
              setIsEditing(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 whitespace-nowrap ${
              activeType === 'terms' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Terms & Conditions</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveType('privacy');
              setIsEditing(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 whitespace-nowrap ${
              activeType === 'privacy' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveType('refund');
              setIsEditing(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 whitespace-nowrap ${
              activeType === 'refund' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refund & Transfer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveType('conduct');
              setIsEditing(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 whitespace-nowrap ${
              activeType === 'conduct' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Code of Conduct</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveType('studentTerms');
              setIsEditing(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 whitespace-nowrap ${
              activeType === 'studentTerms' ? 'bg-teal-700 text-white shadow-xs' : 'text-teal-800 bg-teal-50 hover:bg-teal-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Student Terms (১০টি শর্তাবলী)</span>
          </button>
        </div>

        {saveToast && (
          <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold border-b border-emerald-200 flex items-center space-x-2 px-6">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>পলিসি সফলভাবে আপডেট করা হয়েছে এবং ওয়েবসাইটে সংরক্ষিত হয়েছে!</span>
          </div>
        )}

        {/* Legal Text Body OR In-Place Live Editor */}
        {isEditing ? (
          <div className="p-6 space-y-4 bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {current.title} - সরাসরি টেক্সট এডিট করুন:
              </span>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] text-indigo-600 hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ডিফল্ট টেমপ্লেট লোড করুন</span>
              </button>
            </div>
            <textarea
              rows={14}
              value={editedText}
              onChange={e => setEditedText(e.target.value)}
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 font-mono leading-relaxed outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-inner"
              placeholder="এখানে পলিসির সম্পূর্ণ শর্তাবলী ও অনুচ্ছেদ লিখুন..."
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                অক্ষর সংখ্যা: {editedText.length} | লাইন সংখ্যা: {editedText.split('\n').length}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-200 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleSavePolicy}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>সংরক্ষণ করুন (Save Live)</span>
                </button>
              </div>
            </div>
          </div>
        ) : activeType === 'studentTerms' ? (
          <div className="p-6 sm:p-7 max-h-[62vh] overflow-y-auto space-y-4 bg-slate-50/50">
            {/* Header info bar */}
            <div className="bg-teal-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div>
                <h4 className="font-black text-sm tracking-wide flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-teal-300" />
                  <span>{dynamicTerms.length}টি ছাত্র আচরণবিধি ও প্রাতিষ্ঠানিক শর্তাবলী</span>
                </h4>
                <p className="text-xs text-teal-200 mt-0.5">
                  ভর্তির পূর্বে প্রতিটি ধারা মনোযোগ সহকারে পাঠ করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDedicatedTermsModal(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট ভিউ / ফরম দেখুন</span>
              </button>
            </div>

            {/* Dynamic Clauses 2-column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {dynamicTerms.map(clause => (
                <div
                  key={clause.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between"
                >
                  <div className="bg-teal-900 text-white px-3 py-1.5 flex items-center justify-between">
                    <span className="font-bold">
                      {clause.numberBn}. {clause.titleEn}
                    </span>
                    <span className="text-[11px] text-teal-200 font-medium">
                      ({clause.titleBn})
                    </span>
                  </div>
                  <div className="p-3 text-slate-700 leading-relaxed bg-white">
                    <p>{clause.details}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Declaration note */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 text-xs text-teal-950 font-medium flex items-start space-x-2.5">
              <span className="text-teal-700 font-bold text-base leading-none mt-0.5">✓</span>
              <p>{dynamicDeclaration}</p>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line bg-white">
            {current.text}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
            <Check className="w-4 h-4" />
            <span>Last Updated: {new Date().getFullYear()} Active Academic Session</span>
          </div>

          <div className="flex items-center space-x-2">
            {activeType === 'studentTerms' && (
              <button
                type="button"
                onClick={() => setShowDedicatedTermsModal(true)}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট / সম্পূর্ণ ফরম</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
            >
              I Understand & Close
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Terms Modal for clean print & full sheet */}
      <StudentTermsModal
        isOpen={showDedicatedTermsModal}
        onClose={() => setShowDedicatedTermsModal(false)}
        terms={dynamicTerms}
        declarationText={dynamicDeclaration}
      />
    </div>
  );
};
