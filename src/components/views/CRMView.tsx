import React, { useState, useEffect, useMemo } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Lead, LeadStatus, FollowUpMethod } from '../../types';
import { exportLeadsSpreadsheet } from '../../utils/spreadsheetExport';
import { CrmFieldsAndTagsModal } from '../modals/CrmFieldsAndTagsModal';
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
  Globe,
  Zap,
  Tag,
  Sliders,
  Layers,
  Copy,
  CheckSquare,
  Square
} from 'lucide-react';

// Status Normalizer to ensure every lead maps to a valid pipeline column
export const normalizeLeadStatus = (status?: string): LeadStatus => {
  if (!status) return 'New';
  if (status === 'OTP Verified' || status === 'Pending Verification' || status === 'Suspicious' || status === 'Duplicate') return 'New';
  if (status === 'Demo Attended') return 'Demo Scheduled';
  if (status === 'Enrolled' || status === 'Confirmed' || status === 'Paid') return 'Admitted';
  if (status === 'Not Interested' || status === 'Rejected' || status === 'Lost') return 'Lost';
  if (status === 'Qualified') return 'Interested';
  const validStatuses: LeadStatus[] = ['New', 'Contacted', 'Interested', 'Demo Scheduled', 'Follow-up', 'Admission Pending', 'Admitted', 'Lost'];
  if (validStatuses.includes(status as LeadStatus)) {
    return status as LeadStatus;
  }
  return 'New';
};

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
    syncIncomingLeadsNow,
    academySettings,
    crmSettings,
    toggleLeadTag,
    updateLeadCustomFields
  } = useAcademy();

  const [isFieldsTagsModalOpen, setIsFieldsTagsModalOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState('all');

  // Generate safe dynamic WhatsApp chat URL with institute name and course info
  const getLeadWhatsAppUrl = (lead: Lead) => {
    const rawDigits = lead.phone.replace(/[^0-9]/g, '');
    const cleanPhone = rawDigits.startsWith('88') ? rawDigits : `88${rawDigits.slice(-11)}`;
    const instName = academySettings?.instituteName || 'Academy';
    const crs = courses.find(c => c.id === lead.interestedCourseId);
    const text = `আসসালামু আলাইকুম ${lead.name}, ${instName} থেকে আপনার সাথে যোগাযোগ করছি।${crs ? ` আপনার পছন্দের "${crs.name}" কোর্স সম্পর্কে যেকোনো তথ্য জানতে পারেন।` : ' আপনার কোর্স বা ভর্তি সংক্রান্ত কোনো তথ্য বা সহায়তার প্রয়োজন হলে জানাতে পারেন।'}`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Detect Lead Intent (Career counseling vs direct seat booking vs syllabus)
  const getLeadIntentBadge = (lead: Lead) => {
    const cLower = (lead.comments || '').toLowerCase();
    const sLower = (lead.leadSource || '').toLowerCase();
    const pLower = (lead.preferredSchedule || '').toLowerCase();

    if (cLower.includes('counseling') || cLower.includes('কাউন্সেলিং') || cLower.includes('ল্যাব ভিজিট') || pLower.includes('lab') || sLower.includes('counseling')) {
      return {
        label: '🎯 ক্যারিয়ার কাউন্সিলিং ও ল্যাব ভিজিট',
        className: 'bg-teal-50 text-teal-800 border-teal-200'
      };
    }
    if (cLower.includes('সিট বুকিং') || cLower.includes('seat booking') || cLower.includes('ভর্তি আবেদন') || sLower.includes('admission') || sLower.includes('seat booking')) {
      return {
        label: '⚡ সরাসরি সিট বুকিং',
        className: 'bg-orange-50 text-orange-900 border-orange-200'
      };
    }
    if (sLower.includes('syllabus') || cLower.includes('syllabus') || cLower.includes('সিলেবাস')) {
      return {
        label: '📚 সিলেবাস ডাউনলোড',
        className: 'bg-purple-50 text-purple-900 border-purple-200'
      };
    }
    return null;
  };

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [counselorFilter, setCounselorFilter] = useState<string>('all');
  const [filterDuplicatesOnly, setFilterDuplicatesOnly] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [whatsAppModalLead, setWhatsAppModalLead] = useState<Lead | null>(null);
  const [whatsAppCustomText, setWhatsAppCustomText] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Phone duplicates map
  const phoneCountMap = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach(l => {
      const clean = l.phone.replace(/[^0-9]/g, '').slice(-11);
      if (clean.length >= 10) {
        map.set(clean, (map.get(clean) || 0) + 1);
      }
    });
    return map;
  }, [leads]);

  const duplicateLeadsCount = useMemo(() => {
    return leads.filter(l => {
      const clean = l.phone.replace(/[^0-9]/g, '').slice(-11);
      return (phoneCountMap.get(clean) || 0) > 1;
    }).length;
  }, [leads, phoneCountMap]);

  const [followUpFilter, setFollowUpFilter] = useState<'all' | 'today' | 'overdue'>('all');
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const todayFollowUpsCount = useMemo(() => {
    return leads.filter(l => {
      const norm = normalizeLeadStatus(l.status);
      if (norm === 'Admitted' || norm === 'Lost') return false;
      return l.nextFollowUpDate === todayStr;
    }).length;
  }, [leads, todayStr]);

  const overdueFollowUpsCount = useMemo(() => {
    return leads.filter(l => {
      const norm = normalizeLeadStatus(l.status);
      if (norm === 'Admitted' || norm === 'Lost') return false;
      return Boolean(l.nextFollowUpDate && l.nextFollowUpDate < todayStr);
    }).length;
  }, [leads, todayStr]);

  // 4 Pre-built High-Converting WhatsApp Templates for Counselors
  const getWhatsAppTemplates = (lead: Lead) => {
    const instName = academySettings?.instituteName || 'Nexgen Academy';
    const crs = courses.find(c => c.id === lead.interestedCourseId);
    const crsName = crs?.name || lead.courseName || 'আমাদের প্রফেশনাল আইটি কোর্স';

    return [
      {
        id: 't1',
        title: '📋 কোর্স আউটলাইন ও স্কলারশিপ অফার',
        message: `আসসালামু আলাইকুম ${lead.name}!\n${instName} থেকে আপনার সাথে যোগাযোগ করছি।\n\nআপনি "${crsName}" কোর্সে আগ্রহ প্রকাশ করেছিলেন। আমাদের বর্তমান ব্যাচে সীমিত সিটে স্পেশাল স্কলারশিপ ও অফার চলছে।\n\nকোর্সের সম্পূর্ণ সিলেবাস, ক্লাস রুটিন ও ডিসকাউন্ট সম্পর্কে বিস্তারিত জানতে এই মেসেজের উত্তর দিন। ধন্যবাদ!`
      },
      {
        id: 't2',
        title: '🏛️ ১-অন-১ ফ্রি ল্যাব ভিজিট ও ক্যারিয়ার কাউন্সিলিং',
        message: `প্রিয় ${lead.name},\n${instName}-এর পক্ষ থেকে শুভেচ্ছা!\n\nসরাসরি আমাদের আধুনিক কম্পিউটার ল্যাব এবং অভিজ্ঞ ইন্ডাস্ট্রি মেন্টরদের সাথে দেখা করে ১-অন-১ ফ্রি ক্যারিয়ার গাইডলাইন সেশন নেওয়ার জন্য আপনাকে সাদর আমন্ত্রণ।\n\nআপনি কি এই সপ্তাহে আমাদের ক্যাম্পাসে আসার জন্য সুবিধাজনক সময় জানাতে পারেন?`
      },
      {
        id: 't3',
        title: '⚡ স্পেশাল স্কলারশিপ ও ডিসকাউন্ট রিমাইন্ডার',
        message: `আসসালামু আলাইকুম ${lead.name}!\n${instName}-এর "${crsName}" কোর্সের চলতি ব্যাচে আর মাত্র কয়েকটি সিট বাকি রয়েছে।\n\nআজকের মধ্যে যোগাযোগ করলে আপনি বিশেষ স্কলারশিপের আওতায় ভর্তি নিশ্চিত করতে পারবেন। আপনার কোনো প্রশ্ন বা ফি সম্পর্কিত তথ্য জানতে চাইলে এখনই জানান।`
      },
      {
        id: 't4',
        title: '🎓 দ্রুত ভর্তি নিশ্চিতকরণ ও সিট বুকিং',
        message: `প্রিয় ${lead.name}!\n${instName}-এ "${crsName}" কোর্সে আপনার পছন্দের ব্যাচে সিট কনফার্মেশনের জন্য যোগাযোগ করছি।\n\nঅনলাইন বা ক্যাম্পাসে সরাসরি এসে সহজ কিস্তিতে ভর্তি হওয়ার সুযোগ রয়েছে। আপনার পছন্দের শিডিউল (অনলাইন/অফলাইন) কনফার্ম করতে আমাদের জানান।`
      }
    ];
  };

  const handleOpenWhatsAppModal = (lead: Lead) => {
    setWhatsAppModalLead(lead);
    const templates = getWhatsAppTemplates(lead);
    setWhatsAppCustomText(templates[0].message);
  };

  const handleSendWhatsApp = () => {
    if (!whatsAppModalLead) return;
    const rawDigits = whatsAppModalLead.phone.replace(/[^0-9]/g, '');
    const cleanPhone = rawDigits.startsWith('88') ? rawDigits : `88${rawDigits.slice(-11)}`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsAppCustomText)}`;
    window.open(url, '_blank');
    setWhatsAppModalLead(null);
  };

  const handleBulkStatusChange = (newStatus: LeadStatus) => {
    selectedLeadIds.forEach(id => {
      updateLead(id, { status: newStatus });
    });
    setSelectedLeadIds([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`আপনি কি নিশ্চিত যে নির্বাচিত ${selectedLeadIds.length} জন লিড মুছে ফেলতে চান?`)) {
      selectedLeadIds.forEach(id => {
        deleteLead(id);
      });
      setSelectedLeadIds([]);
    }
  };

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

  // Real-time automatic synchronization when leads are submitted anywhere
  useEffect(() => {
    const handleIncoming = () => {
      syncIncomingLeadsNow().catch(() => {});
    };

    window.addEventListener('incoming-lead-submitted', handleIncoming);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('nexgen_leads_sync');
      bc.onmessage = (msg) => {
        if (msg.data?.type === 'LEAD_SUBMITTED') {
          syncIncomingLeadsNow().catch(() => {});
        }
      };
    } catch {}

    return () => {
      window.removeEventListener('incoming-lead-submitted', handleIncoming);
      if (bc) bc.close();
    };
  }, [syncIncomingLeadsNow]);

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
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editCustomFieldValues, setEditCustomFieldValues] = useState<Record<string, any>>({});

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
    setEditTags(Array.isArray(lead.tags) ? [...lead.tags] : []);
    setEditCustomFieldValues(lead.customFieldValues ? { ...lead.customFieldValues } : {});
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
      nextFollowUpNotes: editNextNotes || undefined,
      tags: editTags,
      customFieldValues: editCustomFieldValues
    });

    setEditingLead(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingLead) return;
    deleteLead(deletingLead.id);
    setDeletingLead(null);
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
    const matchesTag = tagFilter === 'all' || (Array.isArray(lead.tags) && lead.tags.includes(tagFilter));
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '').slice(-11);
    const isDuplicate = (phoneCountMap.get(cleanPhone) || 0) > 1;
    const matchesDuplicates = !filterDuplicatesOnly || isDuplicate;
    const matchesFollowUp =
      followUpFilter === 'all'
        ? true
        : followUpFilter === 'today'
        ? (lead.nextFollowUpDate === todayStr && normStatus !== 'Admitted' && normStatus !== 'Lost')
        : Boolean(lead.nextFollowUpDate && lead.nextFollowUpDate < todayStr && normStatus !== 'Admitted' && normStatus !== 'Lost');
    return matchesSearch && matchesStatus && matchesCourse && matchesCounselor && matchesTag && matchesDuplicates && matchesFollowUp;
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

          {/* Duplicate Leads Filter Button */}
          <button
            onClick={() => setFilterDuplicatesOnly(prev => !prev)}
            className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-colors cursor-pointer ${
              filterDuplicatesOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                : duplicateLeadsCount > 0
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="ডুপ্লিকেট ফোন নম্বরের লিডগুলো আলাদা করে দেখুন"
          >
            <AlertTriangle className={`w-4 h-4 ${filterDuplicatesOnly ? 'text-white' : 'text-amber-600'}`} />
            <span>ডুপ্লিকেট লিড ({duplicateLeadsCount})</span>
          </button>

          {/* CRM Tags and Custom Fields Manager */}
          <button
            onClick={() => setIsFieldsTagsModalOpen(true)}
            className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold px-3 py-2 rounded-xl shadow-2xs transition-colors cursor-pointer"
            title="লিড ট্যাগ এবং কাস্টম ফিল্ড পরিচালনা করুন"
          >
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>ট্যাগ ও কাস্টম ফিল্ড</span>
          </button>

          {/* Export Leads to Excel / Spreadsheet */}
          <button
            onClick={() => {
              const prefix = (academySettings?.instituteName || 'Academy').replace(/[^a-zA-Z0-9_-]/g, '_');
              exportLeadsSpreadsheet(filteredLeads, courses, staffList, `${prefix}_Customer_Leads`, academySettings?.instituteName);
            }}
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

        <select
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold outline-none text-sm cursor-pointer"
        >
          <option value="all">All Tags ({crmSettings?.tags?.length || 0})</option>
          {(crmSettings?.tags || []).map(t => (
            <option key={t.id} value={t.name}>
              🏷️ {t.name}
            </option>
          ))}
        </select>

        {/* Quick Follow-up and Deduplication Filter Chips */}
        <div className="w-full flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">Quick Action Filters:</span>

          <button
            type="button"
            onClick={() => setFollowUpFilter(prev => prev === 'today' ? 'all' : 'today')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              followUpFilter === 'today'
                ? 'bg-blue-600 text-white shadow-xs'
                : todayFollowUpsCount > 0
                ? 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="আজকে যাদের সাথে যোগাযোগ বা ফলো-আপ করতে হবে"
          >
            <span>🔔 আজকের ফলো-আপ</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${followUpFilter === 'today' ? 'bg-white/20 text-white' : 'bg-blue-200 text-blue-950'}`}>
              {todayFollowUpsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFollowUpFilter(prev => prev === 'overdue' ? 'all' : 'overdue')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              followUpFilter === 'overdue'
                ? 'bg-rose-600 text-white shadow-xs'
                : overdueFollowUpsCount > 0
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="যেসব লিডের ফলো-আপের তারিখ পার হয়ে গেছে"
          >
            <span>⚠️ ওভারডিউ ফলো-আপ</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${followUpFilter === 'overdue' ? 'bg-white/20 text-white' : 'bg-rose-200 text-rose-950'}`}>
              {overdueFollowUpsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterDuplicatesOnly(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              filterDuplicatesOnly
                ? 'bg-amber-600 text-white shadow-xs'
                : duplicateLeadsCount > 0
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="একই ফোন নম্বরে থাকা ডুপ্লিকেট লিডসমূহ"
          >
            <span>👥 ডুপ্লিকেট লিড</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${filterDuplicatesOnly ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-950'}`}>
              {duplicateLeadsCount}
            </span>
          </button>

          {(followUpFilter !== 'all' || filterDuplicatesOnly || tagFilter !== 'all' || statusFilter !== 'all' || courseFilter !== 'all' || counselorFilter !== 'all' || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setFollowUpFilter('all');
                setFilterDuplicatesOnly(false);
                setTagFilter('all');
                setStatusFilter('all');
                setCourseFilter('all');
                setCounselorFilter('all');
                setSearchTerm('');
              }}
              className="px-2 py-1 text-slate-500 hover:text-rose-600 font-semibold text-xs transition-colors"
            >
              ✕ রিসেট ফিল্টার
            </button>
          )}
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="space-y-3">
          {/* Mobile Stage Quick Switcher Bar */}
          <div className="flex sm:hidden items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-semibold text-[11px] shrink-0">স্টেজ:</span>
            {pipelineColumns.map(col => {
              const count = filteredLeads.filter(l => normalizeLeadStatus(l.status) === col.status).length;
              return (
                <button
                  key={col.status}
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(`kanban-col-${col.status.replace(/\s+/g, '-')}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-blue-50 text-slate-700 font-bold whitespace-nowrap text-[11px] shrink-0 border border-slate-200 transition-colors"
                >
                  {col.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 min-h-[560px]">
            {pipelineColumns.map(col => {
              const columnLeads = filteredLeads.filter(l => normalizeLeadStatus(l.status) === col.status);

              return (
                <div
                  key={col.status}
                  id={`kanban-col-${col.status.replace(/\s+/g, '-')}`}
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
                        className={`bg-white p-3.5 rounded-xl border shadow-2xs hover:shadow-md transition-all space-y-2.5 relative group ${
                          selectedLeadIds.includes(lead.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200/80 hover:border-indigo-300'
                        }`}
                      >
                        {/* Top: Checkbox, Name & Code */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLeadIds(prev =>
                                  prev.includes(lead.id) ? prev.filter(id => id !== lead.id) : [...prev, lead.id]
                                );
                              }}
                              className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                              title="লিড নির্বাচন করুন"
                            >
                              {selectedLeadIds.includes(lead.id) ? (
                                <CheckSquare className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300" />
                              )}
                            </button>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                {lead.name}
                              </h4>
                              <div className="text-xs font-mono text-blue-700 font-semibold mt-0.5">
                                {lead.leadCode} • {lead.phone}
                              </div>
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
                            value={normalizeLeadStatus(lead.status)}
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
                            <option value="Lost">Lost / Closed</option>
                          </select>
                        </div>

                        {/* Course & Source */}
                        <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl space-y-1.5 border border-slate-100">
                          <div className="font-bold text-slate-900 truncate">
                            {crs?.name || 'General Inquiry'}
                          </div>
                          {(() => {
                            const badge = getLeadIntentBadge(lead);
                            if (!badge) return null;
                            return (
                              <div className="pt-0.5">
                                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.className}`}>
                                  <span>{badge.label}</span>
                                </span>
                              </div>
                            );
                          })()}
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

                          {/* Duplicate Detection Badge */}
                          {((phoneCountMap.get(lead.phone.replace(/[^0-9]/g, '').slice(-11)) || 0) > 1 || lead.isDuplicate) && (
                            <div className="pt-0.5">
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300">
                                <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                <span>⚠️ ডুপ্লিকেট লিড ({phoneCountMap.get(lead.phone.replace(/[^0-9]/g, '').slice(-11)) || 2})</span>
                              </span>
                            </div>
                          )}

                          {/* Dynamic Tags on Card */}
                          {lead.tags && lead.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-200/60">
                              {lead.tags.map(tName => {
                                const tagObj = crmSettings?.tags?.find(t => t.name === tName);
                                const colorCls = tagObj?.color === 'red' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                  tagObj?.color === 'amber' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                  tagObj?.color === 'emerald' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                  tagObj?.color === 'blue' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                  tagObj?.color === 'purple' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                                  'bg-indigo-50 text-indigo-700 border-indigo-200';
                                return (
                                  <span
                                    key={tName}
                                    className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${colorCls}`}
                                  >
                                    <Tag className="w-2.5 h-2.5" />
                                    <span>{tName}</span>
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {/* Dynamic Custom Fields configured for Lead Table / Card */}
                          {crmSettings?.customFields?.filter(f => f.showInLeadTable && lead.customFieldValues?.[f.key] !== undefined && lead.customFieldValues?.[f.key] !== '').map(f => {
                            const val = lead.customFieldValues![f.key];
                            const displayVal = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val);
                            return (
                              <div key={f.id} className="text-[10px] text-slate-600 bg-white/90 px-2 py-1 rounded-md border border-slate-200 flex items-center justify-between">
                                <span className="font-semibold text-slate-500">{f.label}:</span>
                                <span className="font-bold text-slate-800 truncate ml-1">{displayVal}</span>
                              </div>
                            );
                          })}
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

                            <button
                              type="button"
                              onClick={() => handleOpenWhatsAppModal(lead)}
                              className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                              title="1-Click WhatsApp মেসেজ ও টেমপ্লেট পাঠান"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {lead.status !== 'Admitted' && (
                            <button
                              type="button"
                              onClick={() => onOpenAdmissionWithLead(lead)}
                              className="text-white font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0 text-xs active:scale-95"
                              title="Express Convert: ভর্তি ফর্মে সরাসরি রূপান্তর করুন"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
                              <span>Express Admit</span>
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
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="space-y-3">
          {/* Desktop Table View (Hidden on mobile < md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedLeadIds.length === filteredLeads.length) {
                          setSelectedLeadIds([]);
                        } else {
                          setSelectedLeadIds(filteredLeads.map(l => l.id));
                        }
                      }}
                      className="text-slate-500 hover:text-slate-800 cursor-pointer"
                      title={selectedLeadIds.length === filteredLeads.length ? 'সকল আনচেক করুন' : 'সবগুলো সিলেক্ট করুন'}
                    >
                      {selectedLeadIds.length > 0 && selectedLeadIds.length === filteredLeads.length ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>
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
                    <tr key={lead.id} className={`hover:bg-slate-50 transition-colors ${selectedLeadIds.includes(lead.id) ? 'bg-blue-50/50' : ''}`}>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLeadIds(prev =>
                              prev.includes(lead.id) ? prev.filter(id => id !== lead.id) : [...prev, lead.id]
                            );
                          }}
                          className="text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          {selectedLeadIds.includes(lead.id) ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="font-mono text-[10px] text-blue-600">{lead.leadCode}</div>
                        {lead.tags && lead.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {lead.tags.map(tName => {
                              const tagObj = crmSettings?.tags?.find(t => t.name === tName);
                              const colorCls = tagObj?.color === 'red' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                tagObj?.color === 'amber' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                tagObj?.color === 'emerald' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                tagObj?.color === 'blue' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                tagObj?.color === 'purple' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                                'bg-indigo-50 text-indigo-700 border-indigo-200';
                              return (
                                <span
                                  key={tName}
                                  className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold border ${colorCls}`}
                                >
                                  {tName}
                                </span>
                              );
                            })}
                          </div>
                        )}
                        {crmSettings?.customFields?.filter(f => f.showInLeadTable && lead.customFieldValues?.[f.key] !== undefined && lead.customFieldValues?.[f.key] !== '').map(f => {
                          const val = lead.customFieldValues![f.key];
                          const displayVal = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val);
                          return (
                            <div key={f.id} className="text-[9px] text-slate-600 mt-0.5 flex items-center space-x-1">
                              <span className="font-semibold text-slate-400">{f.label}:</span>
                              <span className="font-bold text-slate-700">{displayVal}</span>
                            </div>
                          );
                        })}
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
                          <button
                            type="button"
                            onClick={() => handleOpenWhatsAppModal(lead)}
                            className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="1-Click WhatsApp মেসেজ ও টেমপ্লেট পাঠান"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {((phoneCountMap.get(lead.phone.replace(/[^0-9]/g, '').slice(-11)) || 0) > 1 || lead.isDuplicate) && (
                          <div className="mt-0.5">
                            <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                              <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                              <span>ডুপ্লিকেট ({phoneCountMap.get(lead.phone.replace(/[^0-9]/g, '').slice(-11)) || 2})</span>
                            </span>
                          </div>
                        )}
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
                        {(() => {
                          const badge = getLeadIntentBadge(lead);
                          if (!badge) return null;
                          return (
                            <div className="mt-1">
                              <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${badge.className}`}>
                                <span>{badge.label}</span>
                              </span>
                            </div>
                          );
                        })()}
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
                          value={normalizeLeadStatus(lead.status)}
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
                          <option value="Lost">Lost / Closed</option>
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
                          type="button"
                          onClick={() => onOpenFollowUp(lead.id)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded text-[11px]"
                        >
                          Log Call
                        </button>
                        {lead.status !== 'Admitted' && (
                          <button
                            type="button"
                            onClick={() => onOpenAdmissionWithLead(lead)}
                            className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded text-[11px] inline-flex items-center space-x-1 shadow-2xs transition-all active:scale-95"
                            title="Express Convert: ভর্তি ফর্মে সরাসরি রূপান্তর করুন"
                          >
                            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                            <span>Express Admit</span>
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

        {/* Mobile Lead Card List (Optimized for Small Screens - No Horizontal Scroll) */}
        <div className="block md:hidden space-y-3">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
              কোনো লিড পাওয়া যায়নি। ফিল্টার পরিবর্তন করে দেখুন।
            </div>
          ) : (
            filteredLeads.map(lead => {
              const crs = courses.find(c => c.id === lead.interestedCourseId);
              const counselor = staffList.find(s => s.id === lead.counselorId);
              const leadFollowUps = followUps.filter(f => f.leadId === lead.id);
              const intentBadge = getLeadIntentBadge(lead);
              const isSelected = selectedLeadIds.includes(lead.id);

              return (
                <div
                  key={lead.id}
                  className={`bg-white rounded-2xl border p-4 shadow-2xs space-y-3 transition-all ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200/90'
                  }`}
                >
                  {/* Header Row: Checkbox, Name, LeadCode, Status Selector */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLeadIds(prev =>
                            prev.includes(lead.id) ? prev.filter(id => id !== lead.id) : [...prev, lead.id]
                          );
                        }}
                        className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
                          {lead.name}
                        </h4>
                        <span className="font-mono text-[11px] text-blue-600 font-semibold block">
                          {lead.leadCode}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <select
                        value={normalizeLeadStatus(lead.status)}
                        onChange={e => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className="bg-slate-50 border border-slate-200 font-bold rounded-lg px-2 py-1 text-slate-800 outline-none text-[11px] cursor-pointer"
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
                      <button
                        type="button"
                        onClick={() => openEditModal(lead)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Lead"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingLead(lead)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact & Phone row with 1-click Call & WhatsApp */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                    <div className="font-bold text-slate-800 flex items-center space-x-1.5 truncate mr-2">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{lead.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <a
                        href={`tel:${lead.phone}`}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-blue-600 border border-slate-200 rounded-lg font-bold text-[11px] flex items-center space-x-1 shadow-2xs"
                      >
                        <span>কল করুন</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsAppModal(lead)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-2xs cursor-pointer"
                        title="1-Click WhatsApp মেসেজ পাঠান"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Course & Counselor Details */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-700 truncate mr-2">
                        {crs?.name || 'General Inquiry'}
                      </span>
                      {intentBadge && (
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${intentBadge.className}`}>
                          {intentBadge.label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>কাউন্সেলর: <strong className="text-slate-700">{counselor?.name || 'Unassigned'}</strong></span>
                      <span>সোর্স: <strong className="text-slate-700">{lead.leadSource || 'Walk-in'}</strong></span>
                    </div>
                  </div>

                  {/* Visitor Remarks (if any) */}
                  {lead.comments && (
                    <div className="p-2 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-slate-700 italic">
                      "{lead.comments}"
                    </div>
                  )}

                  {/* Follow-up Date Banner (if any) */}
                  {lead.nextFollowUpDate && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg font-bold border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Next Follow-up: <strong>{lead.nextFollowUpDate}</strong></span>
                    </div>
                  )}

                  {/* Mobile Bottom Action Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenFollowUp(lead.id)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-3 h-3 text-amber-700" />
                      <span>Log Call ({leadFollowUps.length})</span>
                    </button>

                    {lead.status !== 'Admitted' && (
                      <button
                        type="button"
                        onClick={() => onOpenAdmissionWithLead(lead)}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 shadow-2xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                        <span>Express Admit</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
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

              {/* Edit Tags */}
              {crmSettings?.tags && crmSettings.tags.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Lead Tags (ট্যাগসমূহ)</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {crmSettings.tags.map(t => {
                      const isSel = editTags.includes(t.name);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setEditTags(prev =>
                              prev.includes(t.name) ? prev.filter(x => x !== t.name) : [...prev, t.name]
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center space-x-1 cursor-pointer ${
                            isSel
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <Tag className="w-3 h-3" />
                          <span>{t.name}</span>
                          {isSel && <CheckCircle2 className="w-3 h-3 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Edit Custom Fields */}
              {crmSettings?.customFields && crmSettings.customFields.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Custom Fields (কাস্টম ফিল্ড)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {crmSettings.customFields.map(cf => {
                      const val = editCustomFieldValues[cf.key] ?? cf.defaultValue ?? '';
                      if (cf.type === 'boolean') {
                        return (
                          <div key={cf.id} className="flex items-center space-x-2 pt-2">
                            <input
                              type="checkbox"
                              id={`edit-cf-${cf.id}`}
                              checked={Boolean(val)}
                              onChange={e =>
                                setEditCustomFieldValues(prev => ({
                                  ...prev,
                                  [cf.key]: e.target.checked
                                }))
                              }
                              className="w-4 h-4 rounded-md text-indigo-600 focus:ring-indigo-500 border-slate-300"
                            />
                            <label htmlFor={`edit-cf-${cf.id}`} className="text-xs font-bold text-slate-700 cursor-pointer">
                              {cf.label} {cf.required && <span className="text-rose-500">*</span>}
                            </label>
                          </div>
                        );
                      }
                      if (cf.type === 'select') {
                        return (
                          <div key={cf.id}>
                            <label className="block text-slate-600 text-xs font-bold mb-1">
                              {cf.label} {cf.required && <span className="text-rose-500">*</span>}
                            </label>
                            <select
                              required={cf.required}
                              value={val}
                              onChange={e =>
                                setEditCustomFieldValues(prev => ({
                                  ...prev,
                                  [cf.key]: e.target.value
                                }))
                              }
                              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                              <option value="">সিলেক্ট করুন...</option>
                              {(cf.options || []).map((opt, idx) => (
                                <option key={idx} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        );
                      }
                      return (
                        <div key={cf.id} className={cf.type === 'textarea' ? 'sm:col-span-2' : ''}>
                          <label className="block text-slate-600 text-xs font-bold mb-1">
                            {cf.label} {cf.required && <span className="text-rose-500">*</span>}
                          </label>
                          {cf.type === 'textarea' ? (
                            <textarea
                              rows={2}
                              required={cf.required}
                              value={val}
                              onChange={e =>
                                setEditCustomFieldValues(prev => ({
                                  ...prev,
                                  [cf.key]: e.target.value
                                }))
                              }
                              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          ) : (
                            <input
                              type={cf.type === 'number' ? 'number' : cf.type === 'date' ? 'date' : 'text'}
                              required={cf.required}
                              value={val}
                              onChange={e =>
                                setEditCustomFieldValues(prev => ({
                                  ...prev,
                                  [cf.key]: cf.type === 'number' ? Number(e.target.value) : e.target.value
                                }))
                              }
                              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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

      {/* Floating Bulk Action Bar */}
      {selectedLeadIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center flex-wrap gap-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center space-x-2 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
              {selectedLeadIds.length}
            </span>
            <span>জন লিড নির্বাচিত</span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Bulk Status Update */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">স্ট্যাটাস পরিবর্তন:</span>
            <select
              onChange={(e) => {
                if (e.target.value) handleBulkStatusChange(e.target.value as LeadStatus);
              }}
              defaultValue=""
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="" disabled>স্ট্যাটাস নির্বাচন করুন</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Demo Scheduled">Demo Scheduled</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Admission Pending">Admission Pending</option>
              <option value="Lost">Lost / Closed</option>
            </select>
          </div>

          {/* Bulk Delete */}
          <button
            type="button"
            onClick={handleBulkDelete}
            className="flex items-center space-x-1 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>মুছে ফেলুন</span>
          </button>

          {/* Deselect */}
          <button
            type="button"
            onClick={() => setSelectedLeadIds([])}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer ml-2"
          >
            বাতিল
          </button>
        </div>
      )}

      {/* 1-Click WhatsApp Personalized Template Modal */}
      {whatsAppModalLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base leading-tight">1-Click WhatsApp মেসেজ পাঠান</h3>
                  <p className="text-emerald-100 text-xs font-medium">প্রাপক: {whatsAppModalLead.name} ({whatsAppModalLead.phone})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWhatsAppModalLead(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  টেমপ্লেট নির্বাচন করুন
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getWhatsAppTemplates(whatsAppModalLead).map(tmpl => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setWhatsAppCustomText(tmpl.message)}
                      className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer group"
                    >
                      <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">
                        {tmpl.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  মেসেজ প্রিভিউ ও এডিট করুন
                </label>
                <textarea
                  rows={6}
                  value={whatsAppCustomText}
                  onChange={(e) => setWhatsAppCustomText(e.target.value)}
                  className="w-full text-xs leading-relaxed text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-emerald-500 outline-none resize-none font-sans"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(whatsAppCustomText);
                    alert('টেক্সট কপি করা হয়েছে!');
                  }}
                  className="inline-flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>টেক্সট কপি করুন</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setWhatsAppModalLead(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp-এ সরাসরি পাঠান</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CRM TAGS & CUSTOM FIELDS MANAGEMENT MODAL */}
      <CrmFieldsAndTagsModal
        isOpen={isFieldsTagsModalOpen}
        onClose={() => setIsFieldsTagsModalOpen(false)}
      />
    </div>
  );
};
