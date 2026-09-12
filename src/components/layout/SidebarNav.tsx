import React, { useState, useMemo } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  AlertCircle,
  FileSpreadsheet,
  Award,
  TrendingUp,
  Megaphone,
  Box,
  UserCheck,
  FileText,
  Sparkles,
  Settings,
  Receipt,
  RotateCcw,
  Trash2,
  Briefcase,
  FolderGit2,
  Presentation,
  Smartphone,
  Globe,
  ExternalLink,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';


interface SidebarNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onViewPublicWebsite?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
  onViewPublicWebsite
}) => {
  const { currentUser, stats, trashItems, isBackupOverdue } = useAcademy();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('erp_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('erp_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Define navigation sections with role permissions
  const navSections = useMemo(() => [
    {
      title: 'CORE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'ACCOUNTS_STAFF', 'TRAINER'] },
        { id: 'crm', label: 'CRM & Leads', icon: Users, badge: stats.todayFollowupsCount > 0 ? `${stats.todayFollowupsCount}` : undefined, badgeColor: 'bg-amber-500', roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR'] },
        { id: 'students', label: 'Students', icon: GraduationCap, badge: stats.activeStudents > 0 ? `${stats.activeStudents}` : undefined, badgeColor: 'bg-indigo-600', roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'] },
      ]
    },
    {
      title: 'ACADEMICS',
      items: [
        { id: 'courses', label: 'Courses', icon: BookOpen, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'] },
        { id: 'batches', label: 'Batches', icon: CalendarCheck, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'] },
        { id: 'schedule', label: 'Class Schedule', icon: CalendarDays, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'] },
        { id: 'assignments', label: 'Assignments & Projects', icon: FolderGit2, roles: ['SUPER_ADMIN', 'MANAGER', 'TRAINER', 'COUNSELOR'] },
        { id: 'attendance', label: 'Attendance', icon: UserCheck, roles: ['SUPER_ADMIN', 'MANAGER', 'TRAINER'] },
        { id: 'exams', label: 'Exams & Results', icon: Award, roles: ['SUPER_ADMIN', 'MANAGER', 'TRAINER'] },
        { id: 'certificates', label: 'Certificates', icon: Award, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'] }
      ]
    },
    {
      title: 'FINANCE & ACCOUNTS',
      items: [
        { id: 'payments', label: 'Payments & Receipts', icon: CreditCard, roles: ['SUPER_ADMIN', 'MANAGER', 'ACCOUNTS_STAFF'] },
        { id: 'due', label: 'Due Management', icon: AlertCircle, badge: stats.overdueDueAmount > 0 ? 'Due' : undefined, badgeColor: 'bg-rose-600 animate-pulse', roles: ['SUPER_ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'COUNSELOR'] },
        { id: 'expenses', label: 'Expenses', icon: Receipt, roles: ['SUPER_ADMIN', 'MANAGER', 'ACCOUNTS_STAFF'] },
        { id: 'financial-reports', label: 'Financial Reports', icon: TrendingUp, roles: ['SUPER_ADMIN', 'MANAGER', 'ACCOUNTS_STAFF'] }
      ]
    },
    {
      title: 'GROWTH & OPERATIONS',
      items: [
        { id: 'placements', label: 'Placement & Careers', icon: Briefcase, badge: 'Jobs', badgeColor: 'bg-emerald-600', roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'] },
        { id: 'seminars', label: 'Seminars & Workshops', icon: Presentation, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR'] },
        { id: 'marketing', label: 'Marketing & ROI', icon: Megaphone, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR'] },
        { id: 'website_cms', label: 'Website CMS & Portal', icon: Globe, badge: 'Live', badgeColor: 'bg-emerald-600', roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR'] },
        { id: 'inventory-staff', label: 'Staff & Assets', icon: Box, roles: ['SUPER_ADMIN', 'MANAGER'] },
        { id: 'reports', label: 'Spreadsheets & Backup', icon: FileSpreadsheet, badge: 'Excel', badgeColor: 'bg-emerald-600', roles: ['SUPER_ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'COUNSELOR'] },
        { id: 'ai-assistant', label: 'AI Operations Assistant', icon: Sparkles, badge: 'AI', badgeColor: 'bg-gradient-to-r from-violet-600 to-indigo-600', roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'ACCOUNTS_STAFF', 'TRAINER'] }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings & Audit', icon: Settings, badge: isBackupOverdue ? 'Backup' : undefined, badgeColor: 'bg-amber-600', roles: ['SUPER_ADMIN', 'MANAGER'] },
        { id: 'recycle-bin', label: 'Recycle Bin', icon: Trash2, badge: trashItems.length > 0 ? `${trashItems.length}` : undefined, badgeColor: 'bg-rose-600', roles: ['SUPER_ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'COUNSELOR', 'TRAINER'] }
      ]
    }
  ], [stats.todayFollowupsCount, stats.activeStudents, stats.overdueDueAmount, isBackupOverdue, trashItems.length]);

  // Filter items by search query if user types
  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return navSections;

    return navSections
      .map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.label.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          (item.badge && item.badge.toLowerCase().includes(q))
        )
      }))
      .filter(section => section.items.length > 0);
  }, [navSections, searchQuery]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container: w-72 (288px) for spacious 1-line readability, or w-20 when collapsed */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            <NexgenLogo variant="crest" size={38} className="bg-white/10 p-1 rounded-xl shrink-0" />
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="text-sm font-black text-white tracking-wide uppercase leading-tight truncate">
                  Nexgen Academy
                </div>
                <div className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider truncate">
                  Internal Portal
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button */}
          <button
            type="button"
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand Sidebar (সাইডবার বড় করুন)' : 'Collapse Sidebar (সাইডবার ছোট করুন)'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Quick Module Search Input (Hidden when collapsed) */}
        {!isCollapsed && (
          <div className="px-3 pt-3 pb-1 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules (মডিউল খুঁজুন)..."
                className="w-full bg-slate-950/60 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-400 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-2.5 px-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredSections.map((section, idx) => {
            const accessibleItems = section.items.filter(item => item.roles.includes(currentUser.role));
            if (accessibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                {/* Section Title (Hidden when collapsed) */}
                {!isCollapsed && (
                  <div className="px-2.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {section.title}
                  </div>
                )}

                {accessibleItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      title={item.label}
                      className={`w-full flex items-center ${
                        isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                      } rounded-xl text-xs sm:text-[13px] font-medium transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                      }`}
                    >
                      {/* Left Icon + Text: Strictly 1 Line (whitespace-nowrap & truncate) */}
                      <div className={`flex items-center space-x-2.5 min-w-0 ${isCollapsed ? '' : 'flex-1 pr-1'}`}>
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="truncate whitespace-nowrap leading-tight text-left">
                            {item.label}
                          </span>
                        )}
                      </div>

                      {/* Right Badge: Strictly 1 Line (shrink-0 & whitespace-nowrap) */}
                      {!isCollapsed && item.badge !== undefined && (
                        <span
                          className={`shrink-0 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-full text-white ml-1.5 shadow-2xs ${
                            item.badgeColor || 'bg-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400">
              <p>কোনো মডিউল পাওয়া যায়নি</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 text-indigo-400 hover:underline font-bold text-[11px]"
              >
                ফিল্টার মুছুন
              </button>
            </div>
          )}
        </div>

        {/* User Info & App Install Footer in Sidebar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 space-y-2 shrink-0">
          {!isCollapsed ? (
            <>
              {onViewPublicWebsite && (
                <button
                  type="button"
                  onClick={() => {
                    onViewPublicWebsite();
                    onCloseMobile();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">View Public Website</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-pwa-install-modal'));
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-xl text-xs font-semibold transition-all active:scale-95"
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span className="whitespace-nowrap">Install Phone App</span>
              </button>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[11px] text-slate-400">Status: Operational</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">v2.6 Live</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              {onViewPublicWebsite && (
                <button
                  type="button"
                  onClick={() => {
                    onViewPublicWebsite();
                    onCloseMobile();
                  }}
                  className="p-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-950 rounded-xl transition-all"
                  title="View Public Website"
                >
                  <Globe className="w-4 h-4" />
                </button>
              )}
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
            </div>
          )}
        </div>

      </aside>
    </>
  );
};
