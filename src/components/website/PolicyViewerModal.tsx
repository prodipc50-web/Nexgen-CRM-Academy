import React from 'react';
import { PoliciesConfig } from '../../types';
import { X, ShieldCheck, FileCheck2, RefreshCw, Users2, Check } from 'lucide-react';

interface PolicyViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'terms' | 'privacy' | 'refund' | 'conduct';
  policies?: PoliciesConfig;
  instituteName?: string;
}

export const PolicyViewerModal: React.FC<PolicyViewerModalProps> = ({
  isOpen,
  onClose,
  initialType = 'terms',
  policies,
  instituteName = 'Nexgen Computer Academy'
}) => {
  const [activeType, setActiveType] = React.useState<'terms' | 'privacy' | 'refund' | 'conduct'>(initialType);

  React.useEffect(() => {
    if (initialType) {
      setActiveType(initialType);
    }
  }, [initialType, isOpen]);

  if (!isOpen) return null;

  const defaultTerms = `1. ACADEMIC INTEGRITY & REGISTRATION\nBy enrolling in any course at ${instituteName}, students agree to participate in all scheduled practical lab sessions, complete project assignments on time, and uphold ethical software development standards.\n\n2. CERTIFICATION REQUIREMENTS\nTo be awarded the Govt. Standard / Academy Certificate, a minimum attendance of 80% and passing grades on the final capstone project and viva examinations are mandatory.\n\n3. INTELLECTUAL PROPERTY\nAll course materials, lectures, source code starter kits, and project blueprints provided are proprietary educational assets of ${instituteName} and cannot be reproduced for commercial distribution without written consent.\n\n4. CAMPUS LAB ACCESS\nEnrolled students receive complimentary lifetime lab practice privileges during designated open lab hours, provided they adhere to the IT Lab Safety and Equipment Policy.`;

  const defaultPrivacy = `${instituteName} values your personal data and privacy.\n\n1. DATA COLLECTION\nWhen you apply for admission, seminar passes, or career counseling, we collect necessary contact information (name, phone number, email address, academic background).\n\n2. PURPOSE OF DATA USAGE\nYour data is solely used for academic tracking, batch allocation, student portal credentials, certificate verification, and job placement recommendations with hiring partners.\n\n3. THIRD-PARTY SHARING\nWe do NOT sell or lease personal student data to external marketing companies. Student details are only shared with corporate recruiters upon direct student consent for job placement interviews.\n\n4. SECURITY\nAll student records, invoices, and exam credentials are encrypted and stored within secure cloud databases with role-based access control.`;

  const defaultRefund = `1. CANCELLATION BEFORE ORIENTATION\nStudents may request a 100% full refund of admission fees if the cancellation request is submitted at least 48 hours prior to the batch orientation class.\n\n2. AFTER BATCH COMMENCEMENT\nOnce the official class modules have commenced, admission fees are non-refundable. However, students may request a batch transfer or batch freeze without additional fees.\n\n3. SPECIAL EXTENUATING CIRCUMSTANCES\nIn cases of medical emergency or verifiable relocation, the Academic Advisory Committee may authorize prorated fee credits for upcoming batches.`;

  const defaultConduct = `1. Respect for Instructors, Mentors, and Peer Students.\n2. Zero tolerance for harassment, software piracy, unauthorized network intrusion, or vandalism of lab workstations.\n3. Active engagement in group projects and timely peer feedback.\n4. Professional attire and adherence to physical and virtual classroom etiquette.`;

  const getContent = () => {
    switch (activeType) {
      case 'terms':
        return {
          title: 'Terms & Conditions (শর্তাবলী)',
          icon: FileCheck2,
          text: policies?.termsAndConditions || defaultTerms
        };
      case 'privacy':
        return {
          title: 'Privacy Policy (গোপনীয়তা নীতি)',
          icon: ShieldCheck,
          text: policies?.privacyPolicy || defaultPrivacy
        };
      case 'refund':
        return {
          title: 'Refund & Batch Transfer Policy (রিফান্ড নীতি)',
          icon: RefreshCw,
          text: policies?.refundPolicy || defaultRefund
        };
      case 'conduct':
        return {
          title: 'Student Code of Conduct (শৃঙ্খলাবিধি)',
          icon: Users2,
          text: policies?.codeOfConduct || defaultConduct
        };
    }
  };

  const current = getContent();
  const Icon = current.icon;

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

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1.5 p-3 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveType('terms')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 whitespace-nowrap ${
              activeType === 'terms' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Terms & Conditions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('privacy')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 whitespace-nowrap ${
              activeType === 'privacy' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('refund')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 whitespace-nowrap ${
              activeType === 'refund' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refund & Transfer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('conduct')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 whitespace-nowrap ${
              activeType === 'conduct' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Code of Conduct</span>
          </button>
        </div>

        {/* Legal Text Body */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line bg-white">
          {current.text}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
            <Check className="w-4 h-4" />
            <span>Last Updated: {new Date().getFullYear()} Active Academic Session</span>
          </div>

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
  );
};
