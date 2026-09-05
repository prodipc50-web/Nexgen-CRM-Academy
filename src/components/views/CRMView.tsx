import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Lead, LeadStatus, FollowUpMethod } from '../../types';
import { exportLeadsSpreadsheet } from '../../utils/spreadsheetExport';
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  PhoneCall,
  Calendar,
  Sparkles,
  LayoutGrid,
  List,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  MessageSquare,
  MessageCircle,
  MapPin,
  FileSpreadsheet,
  Download,
  RefreshCw,
  Globe
} from 'lucide-react';

interface CRMViewProps {
  onOpenNewLead: () => void;
  onOpenFollowUp: (leadId: string) => void;
  onOpenAdmissionWithLead: (lead: Lead) => void;
}

export const CRMView: React.FC<CRMViewProps> = ({
  onOpenNewLead,
  onOpenFollowUp,
  onOpenAdmissionWithLead
}) => {
  const {
    leads,
    updateLead,
    deleteLead,
    courses,
    staffList,
    followUps,
    leadSources,
    occupationsList,
    syncIncomingLeadsNow
  } = useAcademy();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [counselorFilter, setCounselorFilter] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const added = await syncIncomingLeadsNow();
      if (added > 0) {
        setSyncFeedback(`সফলভাবে ${added}টি নতুন অনলাইন লিড পাওয়া গেছে!`);
      } else {
        setSyncFeedback('সকল অনলাইন লিড ইতিমধ্যে আপ-টু-ডেট আছে।');
      }
    } catch {
      setSyncFeedback('সিঙ্ক করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 4000);
    }
  };

  // Edit Lead Modal State
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAltPhone, setEditAltPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editOccupation, setEditOccupation] = useState('');
  const [editInstitution, setEditInstitution] = useState('');
  const [editPreferredSchedule, setEditPreferredSchedule] = useState('');
  const [editLearningMode, setEditLearningMode] = useState<'Offline' | 'Online Live' | 'Hybrid'>('Offline');
  const [editCourseId, setEditCourseId] = useState('');
  const [editLeadSource, setEditLeadSource] = useState('');
  const [editCounselorId, setEditCounselorId] = useState('');
  const [editStatus, setEditStatus] = useState<LeadStatus>('New');
  const [editVisitDate, setEditVisitDate] = useState('');
  const [editComments, setEditComments] = useState('');
  const [editNextDate, setEditNextDate] = useState('');
  const [editNextNotes, setEditNextNotes] = useState('');

  // Delete Lead Modal State
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setEditName(lead.name);
    setEditPhone(lead.phone);
    setEditAltPhone(lead.altPhone || '');
    setEditEmail(lead.email || '');
    setEditAddress(lead.address || '');
    setEditOccupation(lead.occupation || 'Student');
    setEditInstitution(lead.institution || '');
    setEditPreferredSchedule(lead.preferredSchedule || '');
    setEditLearningMode(lead.preferredLearningMode || lead.learningMode || 'Offline');
    setEditCourseId(lead.interestedCourseId);
    setEditLeadSource(lead.leadSource);
    setEditCounselorId(lead.counselorId);
    setEditStatus(lead.status);
    setEditVisitDate(lead.visitDate || '');
    setEditComments(lead.comments || '');
    setEditNextDate(lead.nextFollowUpDate || '');
    setEditNextNotes(lead.nextFollowUpNotes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead || !editName.trim() || !editPhone.trim()) return;

    updateLead(editingLead.id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      altPhone: editAltPhone.trim() || undefined,
      email: editEmail.trim() || undefined,
      address: editAddress.trim() || undefined,
      occupation: editOccupation as any,
      institution: editInstitution.trim() || undefined,
      preferredSchedule: editPreferredSchedule.trim() || undefined,
      preferredLearningMode: editLearningMode,
      learningMode: editLearningMode,
      interestedCourseId: editCourseId,
      leadSource: editLeadSource,
      counselorId: editCounselorId,
      status: editStatus,
      visitDate: editVisitDate || undefined,
      comments: editComments || undefined,
      nextFollowUpDate: editNextDate || undefined,
      nextFollowUpNotes: editNextNotes || undefined
    });

    setEditingLead(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingLead) return;
    deleteLead(deletingLead.id);
    setDeletingLead(null);
  };

  // Status Normalizer to ensure every lead maps to a valid pipeline column
  const normalizeLeadStatus = (status?: string): LeadStatus => {
    if (!status) return 'New';
    if (status === 'OTP Verified' || status === 'Pending Verification' || status === 'Suspicious' || status === 'Duplicate') return 'New';
    if (status === 'Demo Attended') return 'Demo Scheduled';
    if (status === 'Enrolled' || status === 'Confirmed' || status === 'Paid') return 'Admitted';
    return (status as LeadStatus) || 'New';
  };

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.leadCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.comments && lead.comments.toLowerCase().includes(searchTerm.toLowerCase()));
    const normStatus = normalizeLeadStatus(lead.status);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter || normStatus === statusFilter;
    const matchesCourse = courseFilter === 'all' || lead.interestedCourseId === courseFilter;
    const matchesCounselor = counselorFilter === 'all' || lead.counselorId === counselorFilter;
    return matchesSearch && matchesStatus && matchesCourse && matchesCounselor;
  });

  const pipelineColumns: { status: LeadStatus; label: string; color: string }[] = [
    { status: 'New', label: 'New Inquiries', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { status: 'Contacted', label: 'Contacted', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { status: 'Interested', label: 'Interested', color: 'bg-teal-50 text-teal-800 border-teal-200' },
    { status: 'Demo Scheduled', label: 'Demo Scheduled', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { status: 'Follow-up', label: 'Active Follow-up', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { status: 'Admission Pending', label: 'Admission Pending', color: 'bg-orange-50 text-orange-800 border-orange-200' },
    { status: 'Admitted', label: 'Enrolled / Admitted', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { status: 'Lost', label: 'Lost / Closed', color: 'bg-slate-100 text-slate-700 border-slate-200' }
  ];

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    if (newStatus === 'Admitted') {
      const lead = leads.find(l => l.id === leadId);
      if (lead) onOpenAdmissionWithLead(lead);
    } else {
      updateLead(leadId, { status: newStatus });
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Admission CRM & Visitor Pipeline
            </h2>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {leads.length} Leads
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Track prospective student inquiries, follow-up calls, demo classes, and conversion to admission
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg flex items-center space-x-1 font-semibold transition-colors ${
                viewMode === 'kanban' ? 'bg-white shadow-2xs text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg flex items-center space-x-1 font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Sync Online Leads Button */}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold px-3 py-2 rounded-xl shadow-2xs transition-colors cursor-pointer"
            title="Website এবং Landing Page থেকে আগত নতুন অনলাইন ফর্ম লিড সিঙ্ক করুন"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'অনলাইন লিড সিঙ্ক'}</span>
          </button>

          {/* Export Leads to Excel / Spreadsheet */}
          <button
            onClick={() => exportLeadsSpreadsheet(filteredLeads, courses, staffList, 'Nexgen_Customer_Leads')}
            className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-2 rounded-xl shadow-2xs transition-colors"
            title={`Export ${filteredLeads.length} Leads to Excel Spreadsheet (CSV)`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel / Spreadsheet ({filteredLeads.length})</span>
          </button>

          <button
            onClick={onOpenNewLead}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Visitor / Lead</span>
          </button>
        </div>
      </div>

      {/* Sync Feedback Toast */}
      {syncFeedback && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
          <button onClick={() => setSyncFeedback(null)} className="text-blue-500 hover:text-blue-800 p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-sm">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filter by name, phone, code..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium text-sm text-slate-900 placeholder:text-slate-500"
          />
        </div>

        <select
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold outline-none text-sm"
        >
          <option value="all">All Courses</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={counselorFilter}
          onChange={e => setCounselorFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold outline-none text-sm"
        >
          <option value="all">All Counselors</option>
          {staffList.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold outline-none text-sm"
        >
          <option value="all">All Pipeline Stages</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Interested">Interested</option>
          <option value="Demo Scheduled">Demo Scheduled</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Admission Pending">Admission Pending</option>
          <option value="Admitted">Admitted</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 min-h-[560px]">
          {pipelineColumns.map(col => {
            const columnLeads = filteredLeads.filter(l => normalizeLeadStatus(l.status) === col.status);

            return (
              <div
                key={col.status}
                className="w-72 shrink-0 bg-slate-100/70 border border-slate-200 rounded-2xl p-3 flex flex-col max-h-[720px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${col.color}`}>
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {columnLeads.map(lead => {
                    const crs = courses.find(c => c.id === lead.interestedCourseId);
                    const counselor = staffList.find(s => s.id === lead.counselorId);
                    const leadFollowUps = followUps.filter(f => f.leadId === lead.id);

                    return (
                      <div
                        key={lead.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all space-y-2.5 relative group"
                      >
                        {/* Top: Name & Code */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {lead.name}
                            </h4>
                            <div className="text-xs font-mono text-blue-700 font-semibold mt-0.5">
                              {lead.leadCode} • {lead.phone}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => openEditModal(lead)}
                              title="Edit Lead Details"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingLead(lead)}
                              title="Delete Lead"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Move stage dropdown */}
                        <div className="flex items-center justify-between text-xs pt-1 gap-1">
                          <span className="text-xs text-slate-600 font-bold shrink-0">Stage:</span>
                          <select
                            value={lead.status}
                            onChange={e => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-slate-800 outline-none max-w-[130px] truncate cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Interested">Interested</option>
                            <option value="Demo Scheduled">Demo</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Admission Pending">Pending</option>
                            <option value="Admitted">Admit Now</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </div>

                        {/* Course & Source */}
                        <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl space-y-1.5 border border-slate-100">
                          <div className="font-bold text-slate-900 truncate">
                            {crs?.name || 'General Inquiry'}
                          </div>
                          <div className="text-xs text-slate-600 flex items-center justify-between gap-1">
                            <span className="flex items-center space-x-1 min-w-0 truncate">
                              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">Visited: <strong className="text-slate-800">{lead.visitDate || lead.createdAt?.split('T')[0] || 'N/A'}</strong></span>
                            </span>
                            <span className="font-semibold text-slate-700 shrink-0 whitespace-nowrap">{counselor?.name?.split(' ')[0]}</span>
                          </div>
                          {lead.utmCampaign && (
                            <div className="pt-0.5">
                              <span className="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-[11px] font-bold border border-indigo-200 truncate max-w-full">
                                🎯 Ad: {lead.utmCampaign} ({lead.deviceType || 'web'})
                              </span>
                            </div>
                          )}

                          {/* Address & Preferred Schedule Tags */}
                          {(lead.address || lead.preferredSchedule || lead.institution) && (
                            <div className="pt-1.5 border-t border-slate-200/70 space-y-1">
                              {lead.address && (
                                <div className="text-[11px] font-semibold text-slate-700 flex items-center space-x-1 truncate" title={lead.address}>
                                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                  <span className="truncate">ঠিকানা: {lead.address}</span>
                                </div>
                              )}
                              {lead.preferredSchedule && (
                                <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center space-x-1 truncate">
                                  <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span className="truncate">শিডিউল: {lead.preferredSchedule}</span>
                                </div>
                              )}
                              {lead.institution && (
                                <div className="text-[10px] text-slate-500 truncate" title={lead.institution}>
                                  🎓 {lead.institution}
                                </div>
                              )}
                            </div>
                          )}

                          {lead.leadSource?.toLowerCase().includes('syllabus') && (
                            <div className="pt-0.5">
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold border border-purple-200">
                                <Download className="w-2.5 h-2.5" />
                                <span>সিলেবাস ডাউনলোড লিড</span>
                              </span>
                            </div>
                          )}

                          {lead.leadSource?.toLowerCase().includes('admission') && (
                            <div className="pt-0.5 flex flex-wrap gap-1">
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-950 text-[10px] font-bold border border-orange-200">
                                <Globe className="w-2.5 h-2.5 text-orange-600" />
                                <span>অনলাইন ভর্তি আবেদন</span>
                              </span>
                              {(lead.comments?.includes('TrxID') || lead.comments?.includes('bKash')) && (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[10px] font-bold border border-emerald-200">
                                  <span>💳 ফি তথ্য সংযোজিত</span>
                                </span>
                              )}
                            </div>
                          )}

                          {lead.isDuplicate && (
                            <div className="pt-0.5">
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                                <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                <span>পুনরায় আবেদন (Re-applied)</span>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Visitor Comments / What Visitor Said */}
                        {lead.comments && (
                          <div className="text-xs text-slate-800 bg-blue-50/80 border border-blue-200 rounded-xl p-2.5 space-y-1">
                            <div className="font-bold text-blue-950 flex items-center space-x-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                              <span className="truncate">Visitor Remarks (মন্তব্য):</span>
                            </div>
                            <p className="line-clamp-2 text-slate-700 italic font-medium leading-relaxed">"{lead.comments}"</p>
                          </div>
                        )}

                        {/* Next Follow Up Date Pill */}
                        {lead.nextFollowUpDate && (
                          <div className="text-xs flex items-center space-x-1.5 text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg font-bold border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="truncate">Follow-up: <strong>{lead.nextFollowUpDate}</strong></span>
                          </div>
                        )}

                        {/* Card Actions */}
                        <div className="pt-1.5 flex items-center justify-between border-t border-slate-100 text-xs">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onOpenFollowUp(lead.id)}
                              className="text-slate-700 hover:text-indigo-600 font-bold flex items-center space-x-1 cursor-pointer whitespace-nowrap"
                            >
                              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                              <span>Log ({leadFollowUps.length})</span>
                            </button>

                            <a
                              href={`https://wa.me/88${lead.phone.replace(/[^0-9]/g, '').slice(-11)}?text=${encodeURIComponent(`আসসালামু আলাইকুম ${lead.name}, ন্যাশনাল প্রফেশনাল অ্যাকাডেমি থেকে আপনার সাথে যোগাযোগ করছি...`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center"
                              title="WhatsApp-এ সরাসরি মেসেজ দিন"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          {lead.status !== 'Admitted' && (
                            <button
                              onClick={() => onOpenAdmissionWithLead(lead)}
                              className="text-emerald-800 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center space-x-1 border border-emerald-200 cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <span>Admit</span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {columnLeads.length === 0 && (
                    <div className="py-12 text-center text-slate-400 text-xs italic">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Lead Code & Name</th>
                  <th className="py-3 px-4">Visit Date & Remarks</th>
                  <th className="py-3 px-4">Phone / Email</th>
                  <th className="py-3 px-4">Interested Course</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Counselor</th>
                  <th className="py-3 px-4">Stage / Status</th>
                  <th className="py-3 px-4">Next Follow-up</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map(lead => {
                  const crs = courses.find(c => c.id === lead.interestedCourseId);
                  const counselor = staffList.find(s => s.id === lead.counselorId);

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="font-mono text-[10px] text-blue-600">{lead.leadCode}</div>
                      </td>
                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="text-[11px] font-bold text-slate-800 flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{lead.visitDate || lead.createdAt?.split('T')[0] || '-'}</span>
                        </div>
                        {lead.comments ? (
                          <div className="text-[10px] text-slate-500 line-clamp-1 italic mt-0.5" title={lead.comments}>
                            "{lead.comments}"
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 italic">No notes</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="font-semibold flex items-center space-x-1.5">
                          <span>{lead.phone}</span>
                          <a
                            href={`https://wa.me/88${lead.phone.replace(/[^0-9]/g, '').slice(-11)}?text=${encodeURIComponent(`আসসালামু আলাইকুম ${lead.name}, ন্যাশনাল প্রফেশনাল অ্যাকাডেমি থেকে আপনার সাথে যোগাযোগ করছি...`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 p-0.5"
                            title="WhatsApp মেসেজ পাঠান"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        {lead.email && <div className="text-[10px] text-slate-400">{lead.email}</div>}
                        {lead.address && (
                          <div className="text-[10px] text-slate-600 flex items-center space-x-1 mt-0.5" title={lead.address}>
                            <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                            <span className="truncate max-w-[150px]">{lead.address}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        <div className="font-bold text-slate-900">{crs?.name || 'General Inquiry'}</div>
                        {lead.preferredSchedule && (
                          <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                            ⏰ {lead.preferredSchedule}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{lead.leadSource}</div>
                        {lead.leadSource?.toLowerCase().includes('syllabus') && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold text-[9px] border border-purple-200">
                            সিলেবাস লিড
                          </span>
                        )}
                        {lead.utmCampaign && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[9px] border border-indigo-200">
                            Ad: {lead.utmCampaign}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{counselor?.name || '-'}</td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.status}
                          onChange={e => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="bg-slate-50 border border-slate-200 font-bold rounded-lg px-2 py-1 text-slate-800 outline-none text-[11px]"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Interested">Interested</option>
                          <option value="Demo Scheduled">Demo Scheduled</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Admission Pending">Admission Pending</option>
                          <option value="Admitted">Admitted</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-amber-800 font-medium">
                        {lead.nextFollowUpDate || '-'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => openEditModal(lead)}
                          title="Edit Lead Information"
                          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded inline-flex items-center"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingLead(lead)}
                          title="Delete Lead"
                          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded inline-flex items-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenFollowUp(lead.id)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded text-[11px]"
                        >
                          Log Call
                        </button>
                        {lead.status !== 'Admitted' && (
                          <button
                            onClick={() => onOpenAdmissionWithLead(lead)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px]"
                          >
                            Admit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT LEAD MODAL */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Edit Lead Information</h3>
                <p className="text-[11px] text-slate-400 font-mono">{editingLead.leadCode}</p>
              </div>
              <button
                onClick={() => setEditingLead(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Alternate Phone</label>
                  <input
                    type="text"
                    value={editAltPhone}
                    onChange={e => setEditAltPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    বর্তমান বা স্থায়ী ঠিকানা (Address / Location)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ফার্মগেট, মিরপুর-১০, ঢাকা"
                    value={editAddress}
                    onChange={e => setEditAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    শিক্ষা প্রতিষ্ঠান বা কর্মস্থল (Institution / Workplace)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ঢাকা কলেজ / সোনালী ব্যাংক / ফ্রিল্যান্সার"
                    value={editInstitution}
                    onChange={e => setEditInstitution(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    পছন্দের ব্যাচ / সময় (Preferred Schedule)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: শুক্রবার ও শনিবার সকাল ১০টা, অথবা সান্ধ্যকালীন ব্যাচ"
                    value={editPreferredSchedule}
                    onChange={e => setEditPreferredSchedule(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    ক্লাসের মোড (Learning Mode)
                  </label>
                  <select
                    value={editLearningMode}
                    onChange={e => setEditLearningMode(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                  >
                    <option value="Offline">অফলাইন ল্যাব ক্লাস (ফার্মগেট ক্যাম্পাস)</option>
                    <option value="Online Live">অনলাইন লাইভ ক্লাস (Zoom/Meet)</option>
                    <option value="Hybrid">হাইব্রিড (ল্যাব + অনলাইন উভয়ই)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Interested Course</label>
                  <select
                    value={editCourseId}
                    onChange={e => setEditCourseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Lead Source</label>
                  <select
                    value={editLeadSource}
                    onChange={e => setEditLeadSource(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                  >
                    {leadSources.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Counselor</label>
                  <select
                    value={editCounselorId}
                    onChange={e => setEditCounselorId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                  >
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pipeline Stage / Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as LeadStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Demo Scheduled">Demo Scheduled</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Admission Pending">Admission Pending</option>
                    <option value="Admitted">Admitted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Occupation</label>
                  <select
                    value={editOccupation}
                    onChange={e => setEditOccupation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none"
                  >
                    {occupationsList.map(occ => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Visit Date (ভিজিট তারিখ)</label>
                  <input
                    type="date"
                    value={editVisitDate}
                    onChange={e => setEditVisitDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={editNextDate}
                    onChange={e => setEditNextDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Next Follow-up Action</label>
                  <input
                    type="text"
                    placeholder="e.g. Call back regarding 20% discount offer"
                    value={editNextNotes}
                    onChange={e => setEditNextNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Visitor Comments & Statement / সে কী বলেছে (Visitor Remarks)
                </label>
                <textarea
                  rows={3}
                  placeholder="ভিজিটর কী বলেছেন, কী কোর্স শিখতে চান, কী প্রশ্ন বা মন্তব্য করেছেন..."
                  value={editComments}
                  onChange={e => setEditComments(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Lead Record</h3>
                <p className="text-[11px] text-slate-500">Move to System Trash</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete lead <strong className="text-slate-900">{deletingLead.name}</strong> ({deletingLead.leadCode})? You can restore it later from Settings &gt; Trash Recovery.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingLead(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
