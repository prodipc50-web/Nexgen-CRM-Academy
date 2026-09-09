import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { UserRole } from '../../types';
import { isViewAllowedForRole } from '../../utils/rolePermissions';

interface RoleAccessGuardProps {
  viewId: string;
  userRole: UserRole;
  userName: string;
  onNavigateHome: () => void;
  children: React.ReactNode;
}

export const RoleAccessGuard: React.FC<RoleAccessGuardProps> = ({
  viewId,
  userRole,
  userName,
  onNavigateHome,
  children
}) => {
  const allowed = isViewAllowedForRole(viewId, userRole);

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <div className="flex-1 p-6 md:p-12 flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-2xl border border-rose-200 shadow-xl max-w-lg p-8 text-center space-y-5">
        <div className="w-16 h-16 bg-rose-50 border-2 border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>অ্যাক্সেস সংরক্ষিত (Permission Restricted)</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            এই মডিউলে প্রবেশের অনুমতি নেই
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            হ্যালো <strong className="text-slate-800">{userName}</strong>, আপনার বর্তমান রোল হলো{' '}
            <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {userRole}
            </span>। নিরাপত্তা বিধিমালার কারণে এই সেকশনটি শুধুমাত্র অনুমোদিত স্টাফদের জন্য উন্মুক্ত।
          </p>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
          <div className="font-bold text-slate-800">সহায়তার জন্য:</div>
          <div>যদি আপনার জরুরি কাজে এই মডিউলটি প্রয়োজন হয়, অনুগ্রহ করে আপনার সুপার অ্যাডমিন বা ব্রাঞ্চ ম্যানেজারের সাথে যোগাযোগ করুন।</div>
        </div>

        <button
          onClick={onNavigateHome}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ড্যাশবোর্ডে ফিরে যান (Return to Dashboard)</span>
        </button>
      </div>
    </div>
  );
};
