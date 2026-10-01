import React from 'react';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import { SubPageBanner } from './SubPageBanner';
import { CertificateVerificationSection } from '../CertificateVerificationSection';

interface VerifyCertificateSubPageProps {
  onOpenStaffLogin: () => void;
  onBackToHome: () => void;
}

export const VerifyCertificateSubPage: React.FC<VerifyCertificateSubPageProps> = ({
  onOpenStaffLogin,
  onBackToHome
}) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SubPageBanner
        title="Official Certificate Verification System (সার্টিফিকেট যাচাই)"
        subtitle="অনলাইনে সার্টিফিকেট আইডি অথবা স্টুডেন্ট রোল নম্বর দিয়ে তাৎক্ষণিক ডিজিটাল সার্টিফিকেট যাচাই ও ডাউনলোড করুন।"
        badge="ডিজিটাল ভেরিফিকেশন ইঞ্জিন"
        breadcrumbs={[{ label: 'সার্টিফিকেট যাচাই (Verify Certificate)', active: true }]}
        onBackToHome={onBackToHome}
        actionButton={
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Genuine Certified Credentials</span>
          </div>
        }
      />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 pt-8">
        <CertificateVerificationSection onOpenStaffLogin={onOpenStaffLogin} />
      </div>
    </div>
  );
};
