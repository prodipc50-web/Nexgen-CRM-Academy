import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { StudentTermClause } from '../../types';
import { STUDENT_TERMS_AND_CONDITIONS, STUDENT_DECLARATION_TEXT } from '../../data/studentTerms';
import { StudentTermsModal } from '../modals/StudentTermsModal';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Eye,
  Check,
  X,
  Printer,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Search,
  BookOpen,
  CreditCard,
  Calendar,
  Award,
  FileText,
  Monitor,
  Camera,
  Compass,
  AlertTriangle,
  Lock,
  Info
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'shield-check', label: 'Shield / Security', icon: ShieldCheck },
  { name: 'book-open', label: 'Book / Academic', icon: BookOpen },
  { name: 'credit-card', label: 'Payment / Fee', icon: CreditCard },
  { name: 'calendar', label: 'Schedule / Calendar', icon: Calendar },
  { name: 'award', label: 'Award / Certificate', icon: Award },
  { name: 'file-text', label: 'Document / File', icon: FileText },
  { name: 'monitor', label: 'Computer / Lab', icon: Monitor },
  { name: 'camera', label: 'Media / Camera', icon: Camera },
  { name: 'compass', label: 'Conduct / Discipline', icon: Compass },
  { name: 'alert-triangle', label: 'Rules / Warning', icon: AlertTriangle }
];

export const StudentTermsManager: React.FC = () => {
  const { academySettings, updateAcademySettings } = useAcademy();

  const currentTerms: StudentTermClause[] =
    academySettings.studentTerms && academySettings.studentTerms.length > 0
      ? academySettings.studentTerms
      : STUDENT_TERMS_AND_CONDITIONS;

  const currentDeclaration =
    academySettings.studentTermsDeclaration || STUDENT_DECLARATION_TEXT;

  const [searchTerm, setSearchTerm] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isEditingDeclaration, setIsEditingDeclaration] = useState(false);
  const [declarationInput, setDeclarationInput] = useState(currentDeclaration);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit or Add Modal state
  const [activeModal, setActiveModal] = useState<'add' | 'edit' | null>(null);
  const [editingClause, setEditingClause] = useState<StudentTermClause | null>(null);

  const [formNumberBn, setFormNumberBn] = useState('');
  const [formNumberEn, setFormNumberEn] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleBn, setFormTitleBn] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [formIconName, setFormIconName] = useState('book-open');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toBengaliNumber = (num: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(d => bnDigits[parseInt(d, 10)] || d).join('');
  };

  const handleOpenAddModal = () => {
    const nextNum = currentTerms.length + 1;
    setFormNumberEn(nextNum.toString());
    setFormNumberBn(toBengaliNumber(nextNum));
    setFormTitleEn('');
    setFormTitleBn('');
    setFormSummary('');
    setFormDetails('');
    setFormIconName('shield-check');
    setEditingClause(null);
    setActiveModal('add');
  };

  const handleOpenEditModal = (clause: StudentTermClause) => {
    setEditingClause(clause);
    setFormNumberEn(clause.numberEn || '');
    setFormNumberBn(clause.numberBn || '');
    setFormTitleEn(clause.titleEn);
    setFormTitleBn(clause.titleBn);
    setFormSummary(clause.summary || '');
    setFormDetails(clause.details);
    setFormIconName(clause.iconName || 'book-open');
    setActiveModal('edit');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitleBn.trim() || !formTitleEn.trim() || !formDetails.trim()) {
      alert('অনুগ্রহ করে শর্তাবলীর বাংলা ও ইংরেজি শিরোনাম এবং বিস্তারিত বিবরণ লিখুন।');
      return;
    }

    let updated: StudentTermClause[];

    if (activeModal === 'add') {
      const newClause: StudentTermClause = {
        id: Date.now().toString(),
        numberBn: formNumberBn.trim() || toBengaliNumber(currentTerms.length + 1),
        numberEn: formNumberEn.trim() || (currentTerms.length + 1).toString(),
        titleEn: formTitleEn.trim(),
        titleBn: formTitleBn.trim(),
        summary: formSummary.trim() || formTitleBn.trim(),
        details: formDetails.trim(),
        iconName: formIconName,
        isActive: true
      };
      updated = [...currentTerms, newClause];
      showToast('নতুন শর্তাবলী সফলভাবে যুক্ত হয়েছে!');
    } else if (editingClause) {
      updated = currentTerms.map(item => {
        if (item.id === editingClause.id) {
          return {
            ...item,
            numberBn: formNumberBn.trim() || item.numberBn,
            numberEn: formNumberEn.trim() || item.numberEn,
            titleEn: formTitleEn.trim(),
            titleBn: formTitleBn.trim(),
            summary: formSummary.trim() || formTitleBn.trim(),
            details: formDetails.trim(),
            iconName: formIconName
          };
        }
        return item;
      });
      showToast('শর্তাবলী সফলভাবে আপডেট হয়েছে!');
    } else {
      return;
    }

    updateAcademySettings({ studentTerms: updated });
    setActiveModal(null);
  };

  const handleToggleActive = (clauseId: number | string) => {
    const updated = currentTerms.map(item => {
      if (item.id === clauseId) {
        return {
          ...item,
          isActive: item.isActive === false ? true : false
        };
      }
      return item;
    });
    updateAcademySettings({ studentTerms: updated });
    showToast('শর্তাবলীর সক্রিয়তা স্ট্যাটাস পরিবর্তিত হয়েছে');
  };

  const handleDeleteClause = (clauseId: number | string, titleBn: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে "${titleBn}" শর্তটি মুছে ফেলতে চান?`)) {
      return;
    }
    const updated = currentTerms.filter(item => item.id !== clauseId);
    updateAcademySettings({ studentTerms: updated });
    showToast('শর্তাবলীটি মুছে ফেলা হয়েছে');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === currentTerms.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...currentTerms];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Auto-update sequence numbers
    const resequenced = newItems.map((item, idx) => ({
      ...item,
      numberEn: (idx + 1).toString(),
      numberBn: toBengaliNumber(idx + 1)
    }));

    updateAcademySettings({ studentTerms: resequenced });
    showToast('শর্তাবলীর ক্রমবিন্যাস পরিবর্তিত হয়েছে');
  };

  const handleResetToDefault = () => {
    if (
      !window.confirm(
        'সতর্কতা: আপনি কি নিশ্চিতভাবে সব পরিবর্তন মুছে ফেলে অফিসিয়াল ডিফল্ট ১০টি শর্তাবলী রিস্টোর করতে চান?'
      )
    ) {
      return;
    }
    updateAcademySettings({
      studentTerms: STUDENT_TERMS_AND_CONDITIONS,
      studentTermsDeclaration: STUDENT_DECLARATION_TEXT
    });
    setDeclarationInput(STUDENT_DECLARATION_TEXT);
    showToast('অফিসিয়াল ডিফল্ট ১০টি শর্তাবলী সফলভাবে রিস্টোর হয়েছে!');
  };

  const handleSaveDeclaration = () => {
    updateAcademySettings({
      studentTermsDeclaration: declarationInput.trim() || STUDENT_DECLARATION_TEXT
    });
    setIsEditingDeclaration(false);
    showToast('ছাত্র অঙ্গীকারনামা (Student Declaration) সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const filteredTerms = currentTerms.filter(item => {
    const q = searchTerm.toLowerCase();
    return (
      item.titleBn.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.details.toLowerCase().includes(q) ||
      item.numberBn.includes(q) ||
      item.numberEn.includes(q)
    );
  });

  const activeCount = currentTerms.filter(t => t.isActive !== false).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-60 bg-teal-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-teal-700 flex items-center space-x-2 text-xs font-bold animate-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-teal-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Controls */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-teal-700/60 rounded-xl text-teal-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-wide">
                Student Terms & Conditions Manager (ছাত্র আচরণবিধি ও শর্তাবলী)
              </h3>
              <p className="text-xs text-teal-200">
                ভর্তি ফরম, পাবলিক ওয়েবসাইট আবেদন এবং প্রিন্ট শিটের শর্তাবলী যেকোনো সময় যোগ, পরিবর্তন বা ডিলিট করুন।
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="px-4 py-2.5 bg-teal-800/80 hover:bg-teal-700 text-teal-100 font-bold text-xs rounded-xl border border-teal-600/60 flex items-center space-x-2 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট ভিউ দেখুন</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
            title="মূল ১০টি শর্তাবলীতে ফিরে যান"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট ১০টি রিস্টোর</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন শর্ত যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Stats & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">মোট শর্ত সংখ্যা</span>
            <p className="text-xl font-black text-slate-900">{currentTerms.length} টি</p>
          </div>
          <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700 font-bold text-xs">
            Total
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">বর্তমানে সক্রিয়</span>
            <p className="text-xl font-black text-emerald-700">{activeCount} টি</p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs">
            Active
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">নিষ্ক্রিয় / লুকানো</span>
            <p className="text-xl font-black text-slate-400">
              {currentTerms.length - activeCount} টি
            </p>
          </div>
          <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs">
            Inactive
          </div>
        </div>

        {/* Live Search Input */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center space-x-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="শর্ত খুঁজুন..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-800 outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Clauses Cards List */}
      <div className="space-y-3">
        {filteredTerms.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-600">কোনো শর্ত খুঁজে পাওয়া যায়নি!</p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-teal-700 text-white font-bold text-xs rounded-xl inline-flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন শর্ত যোগ করুন</span>
            </button>
          </div>
        ) : (
          filteredTerms.map((clause, index) => {
            const isActive = clause.isActive !== false;
            return (
              <div
                key={clause.id}
                className={`bg-white rounded-2xl border transition-all p-4 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isActive
                    ? 'border-slate-200 hover:border-teal-300'
                    : 'border-slate-200/60 bg-slate-50/70 opacity-70'
                }`}
              >
                {/* Left info & serial */}
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center font-black text-sm shrink-0 ${
                      isActive
                        ? 'bg-teal-900 text-white shadow-xs'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    <span>{clause.numberBn}</span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {clause.titleEn}
                      </h4>
                      <span className="text-xs font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {clause.titleBn}
                      </span>
                      {!isActive && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          Inactive (লুকানো)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                      {clause.details}
                    </p>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center space-x-1 self-end md:self-center shrink-0">
                  {/* Reorder Buttons */}
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 space-x-0.5 mr-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-white"
                      title="উপরে নিন"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === currentTerms.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-white"
                      title="নিচে নিন"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Active Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(clause.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(clause)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    title="এডিট করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteClause(clause.id, clause.titleBn)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="ডিলিট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Student Declaration (অঙ্গীকারনামা) Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-900 font-black text-sm">
            <Check className="w-4 h-4 text-teal-600" />
            <span>শিক্ষার্থীর সম্মতি ও অঙ্গীকারনামা (Student Declaration Footer Text)</span>
          </div>

          {!isEditingDeclaration ? (
            <button
              type="button"
              onClick={() => {
                setDeclarationInput(currentDeclaration);
                setIsEditingDeclaration(true);
              }}
              className="text-xs font-bold text-teal-700 hover:underline flex items-center space-x-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>এডিট করুন</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsEditingDeclaration(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveDeclaration}
                className="px-3 py-1 bg-teal-700 text-white font-bold text-xs rounded-lg hover:bg-teal-800 shadow-xs"
              >
                সংরক্ষণ
              </button>
            </div>
          )}
        </div>

        {isEditingDeclaration ? (
          <textarea
            rows={3}
            value={declarationInput}
            onChange={e => setDeclarationInput(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-600 leading-relaxed font-normal"
          />
        ) : (
          <div className="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-4 text-xs text-slate-800 leading-relaxed">
            <p>{currentDeclaration}</p>
          </div>
        )}
      </div>

      {/* Add / Edit Clause Lightbox Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
                  {activeModal === 'add' ? <Plus className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                </div>
                <h4 className="font-black text-slate-900 text-base">
                  {activeModal === 'add' ? 'নতুন শর্তাবলী যুক্ত করুন' : 'শর্তাবলী এডিট করুন'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্রমিক নং (বাংলা)</label>
                  <input
                    type="text"
                    required
                    value={formNumberBn}
                    onChange={e => setFormNumberBn(e.target.value)}
                    placeholder="যেমন: ১১"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Serial (English)</label>
                  <input
                    type="text"
                    required
                    value={formNumberEn}
                    onChange={e => setFormNumberEn(e.target.value)}
                    placeholder="e.g. 11"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    English Title (ইংরেজি শিরোনাম) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitleEn}
                    onChange={e => setFormTitleEn(e.target.value)}
                    placeholder="e.g. Lab Safety & Hygiene"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    বাংলা শিরোনাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitleBn}
                    onChange={e => setFormTitleBn(e.target.value)}
                    placeholder="যেমন: ল্যাব পরিচ্ছন্নতা ও সুরক্ষা"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-600 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  সংক্ষিপ্ত সামারি (Summary)
                </label>
                <input
                  type="text"
                  value={formSummary}
                  onChange={e => setFormSummary(e.target.value)}
                  placeholder="যেমন: ল্যাবে খাদ্য বা পানীয় প্রবেশ নিষিদ্ধ সংক্রান্ত নিয়ম"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  বিস্তারিত নিয়ম / ধারা (Full Details) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formDetails}
                  onChange={e => setFormDetails(e.target.value)}
                  placeholder="শর্তাবলীর পূর্ণাঙ্গ বিবরণ এখানে লিখুন..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-teal-600 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-black rounded-xl shadow-md cursor-pointer transition-all"
                >
                  {activeModal === 'add' ? 'যুক্ত করুন' : 'আপডেট সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      <StudentTermsModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        terms={currentTerms}
        declarationText={currentDeclaration}
      />
    </div>
  );
};
