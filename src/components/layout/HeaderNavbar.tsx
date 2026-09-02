import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { UserRole } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import { UserProfilePasswordModal } from '../modals/UserProfilePasswordModal';
import {
  Search,
  PlusCircle,
  Bell,
  UserCheck,
  Shield,
  Briefcase,
  Headphones,
  CreditCard,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  Clock,
  Menu,
  LogOut,
  KeyRound,
  User,
  Camera,
  Crop,
  Cloud,
  RefreshCw,
  Check,
  Smartphone,
  Download,
  Globe
} from 'lucide-react';


interface HeaderNavbarProps {
  onOpenSearch: () => void;
  onOpenNewAdmission: () => void;
  onOpenNewLead: () => void;
  onOpenAddPayment: () => void;
  onOpenAddExpense: () => void;
  onNavigateTab: (tab: string) => void;
  onToggleMobileSidebar?: () => void;
  onViewPublicWebsite?: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  onOpenSearch,
  onOpenNewAdmission,
  onOpenNewLead,
  onOpenAddPayment,
  onOpenAddExpense,
  onNavigateTab,
  onToggleMobileSidebar,
  onViewPublicWebsite
}) => {
  const {
    currentUser,
    setCurrentUserRole,
    logout,
    stats,
    leads,
    admissions,
    cloudSyncStatus,
    lastCloudSyncTime,
    syncToCloudNow
  } = useAcademy();
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordModalTab, setPasswordModalTab] = useState<'profile' | 'password'>('profile');

  const roles: { role: UserRole; label: string; icon: any; color: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', icon: Shield, color: 'bg-rose-100 text-rose-700' },
    { role: 'MANAGER', label: 'Manager', icon: Briefcase, color: 'bg-purple-100 text-purple-700' },
    { role: 'COUNSELOR', label: 'Counselor', icon: Headphones, color: 'bg-emerald-100 text-emerald-700' },
    { role: 'ACCOUNTS_STAFF', label: 'Accounts Staff', icon: CreditCard, color: 'bg-blue-100 text-blue-700' },
    { role: 'TRAINER', label: 'Trainer', icon: GraduationCap, color: 'bg-amber-100 text-amber-700' }
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const urgentFollowups = leads.filter(l => l.nextFollowUpDate === todayStr || (l.nextFollowUpDate && l.nextFollowUpDate < todayStr && l.status !== 'Admitted' && l.status !== 'Lost'));
  const overdueAdmissions = admissions.filter(a => a.paymentStatus === 'Overdue' || (a.nextPaymentDate && a.nextPaymentDate < todayStr && a.due > 0));

  const totalNotifications = urgentFollowups.length + overdueAdmissions.length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
      {/* Left: Branding & Tagline */}
      <div className="flex items-center space-x-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 -ml-1"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center space-x-2.5">
          <NexgenLogo variant="crest" size={42} />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black text-slate-900 leading-none tracking-tight">Nexgen Computer Academy</h1>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                ERP v2.6
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium hidden sm:block">Office Management, CRM, Admissions & Training Operations</p>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 transition-colors text-sm"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600 font-medium">Search student, lead, phone, batch, invoice...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-md shadow-2xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 shrink-0"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Cloud Firestore Sync Status Badge */}
        <button
          onClick={() => syncToCloudNow()}
          className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap shrink-0 ${
            cloudSyncStatus === 'synced'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100'
              : cloudSyncStatus === 'syncing'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse'
              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
          }`}
          title={`Google Cloud Firestore Database: ${
            cloudSyncStatus === 'synced'
              ? `Safe & Synchronized (Last: ${lastCloudSyncTime || 'Just now'})`
              : cloudSyncStatus === 'syncing'
              ? 'Saving changes to Cloud...'
              : 'Offline Cache Active. Click to sync.'
          }`}
        >
          {cloudSyncStatus === 'synced' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold">Cloud Safe</span>
            </>
          ) : cloudSyncStatus === 'syncing' ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin shrink-0" />
              <span className="text-xs font-bold">Saving...</span>
            </>
          ) : (
            <>
              <Cloud className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-xs font-bold">Sync</span>
            </>
          )}
        </button>

        {/* View Public Website Button */}
        {onViewPublicWebsite && (
          <button
            onClick={onViewPublicWebsite}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-lg text-xs font-black transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            title="View Live Public Website"
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">Website</span>
          </button>
        )}

        {/* Install Mobile App Trigger Button */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-pwa-install-modal'))}
          className="flex items-center space-x-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-lg text-xs font-bold transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
          title="Install Mobile App on your Phone"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="hidden md:inline">Install App</span>
        </button>

        {/* Quick Add Action Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">New Action</span>
          </button>

          {showQuickMenu && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setShowQuickMenu(false)}
            >
              <button
                onClick={onOpenNewAdmission}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2 font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>New Student Admission</span>
              </button>
              <button
                onClick={onOpenNewLead}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2 font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Register Visitor / Lead</span>
              </button>
              <button
                onClick={onOpenAddPayment}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2 font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Collect Due / Payment</span>
              </button>
              <button
                onClick={onOpenAddExpense}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2 font-medium border-t border-slate-100"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Record Office Expense</span>
              </button>
            </div>
          )}
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={() => onNavigateTab('ai-assistant')}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
          title="Open AI Operations Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden lg:inline">Ask AI</span>
        </button>

        {/* Notification Bell */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
            title="Operational Alerts"
          >
            <Bell className="w-5 h-5" />
            {totalNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
                {totalNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alerts & Actions ({totalNotifications})</h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  Close
                </button>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-1">
                {urgentFollowups.slice(0, 4).map(l => (
                  <div
                    key={l.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateTab('crm');
                    }}
                    className="py-2.5 px-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Follow-up Due: {l.name}</span>
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">{l.nextFollowUpNotes || 'Scheduled lead follow-up today'}</p>
                  </div>
                ))}
                {overdueAdmissions.slice(0, 4).map(a => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateTab('due');
                    }}
                    className="py-2.5 px-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-800">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Overdue Due: ৳{a.due.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">Admission #{a.admissionCode || a.admissionNumber}</p>
                  </div>
                ))}
                {totalNotifications === 0 && (
                  <div className="py-6 text-center text-xs text-slate-500 font-medium">
                    No urgent pending follow-ups or overdue alerts today.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher & User Profile Pill */}
        <div className="relative border-l border-slate-200 pl-2.5">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-2.5 p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-left cursor-pointer"
            title="Switch User Role to Test Permissions"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-300"
            />
            <div className="hidden xl:block">
              <div className="text-xs font-bold text-slate-900 leading-tight flex items-center space-x-1">
                <span>{currentUser.name.split(' ')[0]}</span>
                <span className="text-xs font-bold uppercase px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate max-w-[120px] font-medium">{currentUser.role === 'SUPER_ADMIN' ? 'Super Admin' : currentUser.role}</p>
            </div>
          </button>

          {showRoleMenu && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setShowRoleMenu(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">User: {currentUser.username || 'admin'}</div>
              </div>

              {/* Profile & Photo Crop Action */}
              <div className="py-1 border-b border-slate-100 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModalTab('profile');
                    setShowPasswordModal(true);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Edit Picture & Profile (ছবি ক্রপ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPasswordModalTab('password');
                    setShowPasswordModal(true);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  <span>Change Password (পাসওয়ার্ড)</span>
                </button>
              </div>

              {/* Switch Active Role */}
              <div className="pt-2 pb-1">
                <div className="px-3 pb-1 text-[10px] uppercase font-bold tracking-wider text-indigo-600">
                  Switch Active Role (RBAC):
                </div>
                <div className="space-y-0.5">
                  {roles.map(r => {
                    const Icon = r.icon;
                    const isActive = currentUser.role === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => setCurrentUserRole(r.role)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="w-3.5 h-3.5 text-slate-500" />
                          <span>{r.label}</span>
                        </div>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sign Out Action */}
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Profile & Password Modal */}
      <UserProfilePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        defaultTab={passwordModalTab}
      />
    </header>
  );
};
