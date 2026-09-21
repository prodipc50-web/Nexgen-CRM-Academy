import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { CrmLeadTag, CrmCustomFieldDefinition, CrmCustomFieldType } from '../../types';
import {
  X,
  Tag,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Check,
  Layers,
  HelpCircle,
  Hash,
  ListFilter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CrmFieldsAndTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'tags' | 'customFields' | 'sourcesAndReasons';
}

const COLOR_OPTIONS: { name: string; value: string; bgClass: string; textClass: string; borderClass: string }[] = [
  { name: 'Red', value: 'red', bgClass: 'bg-rose-100', textClass: 'text-rose-700', borderClass: 'border-rose-300' },
  { name: 'Amber', value: 'amber', bgClass: 'bg-amber-100', textClass: 'text-amber-800', borderClass: 'border-amber-300' },
  { name: 'Emerald', value: 'emerald', bgClass: 'bg-emerald-100', textClass: 'text-emerald-800', borderClass: 'border-emerald-300' },
  { name: 'Blue', value: 'blue', bgClass: 'bg-blue-100', textClass: 'text-blue-800', borderClass: 'border-blue-300' },
  { name: 'Indigo', value: 'indigo', bgClass: 'bg-indigo-100', textClass: 'text-indigo-800', borderClass: 'border-indigo-300' },
  { name: 'Purple', value: 'purple', bgClass: 'bg-purple-100', textClass: 'text-purple-800', borderClass: 'border-purple-300' },
  { name: 'Rose', value: 'rose', bgClass: 'bg-pink-100', textClass: 'text-pink-800', borderClass: 'border-pink-300' },
  { name: 'Slate', value: 'slate', bgClass: 'bg-slate-100', textClass: 'text-slate-800', borderClass: 'border-slate-300' }
];

export const CrmFieldsAndTagsModal: React.FC<CrmFieldsAndTagsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'tags'
}) => {
  const {
    leads,
    crmSettings,
    updateCrmSettings,
    addLeadTag,
    updateLeadTag,
    deleteLeadTag,
    addCustomField,
    updateCustomField,
    deleteCustomField
  } = useAcademy();

  const [activeTab, setActiveTab] = useState<'tags' | 'customFields' | 'sourcesAndReasons'>(defaultTab);

  // New Tag Form State
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('indigo');
  const [newTagDesc, setNewTagDesc] = useState('');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  // New Custom Field Form State
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldType, setNewFieldType] = useState<CrmCustomFieldType>('text');
  const [newFieldCategory, setNewFieldCategory] = useState<'General' | 'Marketing' | 'Academic' | 'Billing'>('General');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldShowInTable, setNewFieldShowInTable] = useState(true);

  // Sources & Reasons State
  const [newSourceInput, setNewSourceInput] = useState('');
  const [newReasonInput, setNewReasonInput] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper to get lead count per tag
  const getTagLeadCount = (tagName: string) => {
    return leads.filter(l => Array.isArray(l.tags) && l.tags.includes(tagName)).length;
  };

  // Save or Update Tag
  const handleSaveTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    if (editingTagId) {
      updateLeadTag(editingTagId, {
        name: newTagName.trim(),
        color: newTagColor,
        description: newTagDesc.trim()
      });
      showToast(`ট্যাগ "${newTagName}" আপডেট করা হয়েছে!`);
      setEditingTagId(null);
    } else {
      addLeadTag({
        name: newTagName.trim(),
        color: newTagColor,
        description: newTagDesc.trim()
      });
      showToast(`নতুন ট্যাগ "${newTagName}" তৈরি করা হয়েছে!`);
    }

    setNewTagName('');
    setNewTagColor('indigo');
    setNewTagDesc('');
  };

  const handleStartEditTag = (tag: CrmLeadTag) => {
    setEditingTagId(tag.id);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setNewTagDesc(tag.description || '');
  };

  // Save Custom Field
  const handleSaveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;

    const generatedKey = newFieldKey.trim() || newFieldLabel.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const optionsArray = newFieldType === 'select'
      ? newFieldOptions.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    addCustomField({
      label: newFieldLabel.trim(),
      key: generatedKey,
      type: newFieldType,
      category: newFieldCategory,
      placeholder: newFieldPlaceholder.trim() || undefined,
      options: optionsArray,
      required: newFieldRequired,
      showInLeadTable: newFieldShowInTable
    });

    showToast(`কাস্টম ফিল্ড "${newFieldLabel}" তৈরি করা হয়েছে!`);
    setNewFieldLabel('');
    setNewFieldKey('');
    setNewFieldPlaceholder('');
    setNewFieldOptions('');
    setNewFieldRequired(false);
    setNewFieldShowInTable(true);
  };

  // Manage Sources
  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceInput.trim()) return;
    const current = crmSettings.leadSources || [];
    if (current.includes(newSourceInput.trim())) {
      showToast('এই সোর্সটি ইতিমধ্যে তালিকায় রয়েছে!');
      return;
    }
    updateCrmSettings({ leadSources: [...current, newSourceInput.trim()] });
    setNewSourceInput('');
    showToast('নতুন লিড সোর্স যুক্ত হয়েছে!');
  };

  const handleDeleteSource = (src: string) => {
    const current = crmSettings.leadSources || [];
    updateCrmSettings({ leadSources: current.filter(s => s !== src) });
    showToast('লিড সোর্স মুছে ফেলা হয়েছে!');
  };

  // Manage Lost Reasons
  const handleAddReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReasonInput.trim()) return;
    const current = crmSettings.lostReasons || [];
    if (current.includes(newReasonInput.trim())) {
      showToast('এই কারণটি ইতিমধ্যে তালিকায় রয়েছে!');
      return;
    }
    updateCrmSettings({ lostReasons: [...current, newReasonInput.trim()] });
    setNewReasonInput('');
    showToast('নতুন ড্রপ/লস রিজন যুক্ত হয়েছে!');
  };

  const handleDeleteReason = (rsn: string) => {
    const current = crmSettings.lostReasons || [];
    updateCrmSettings({ lostReasons: current.filter(r => r !== rsn) });
    showToast('রিজন মুছে ফেলা হয়েছে!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:hidden">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center space-x-2">
                <span>CRM Custom Fields & Dynamic Tags Manager</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                  100% Dynamic
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                লিড ট্যাগ, কাস্টম ডেটা ফিল্ড, লিড সোর্স ও ড্রপ রিজন সম্পূর্ণ নিজের মতো সাজিয়ে নিন।
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 space-x-2">
          <button
            onClick={() => setActiveTab('tags')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'tags'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Lead Tags ({crmSettings.tags?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('customFields')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'customFields'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Custom Fields ({crmSettings.customFields?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('sourcesAndReasons')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'sourcesAndReasons'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Sources & Lost Reasons</span>
          </button>
        </div>

        {/* Toast Alert */}
        {notification && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-5 py-2 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* TAB 1: LEAD TAGS */}
          {activeTab === 'tags' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Tag Creation Form */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    <span>{editingTagId ? 'ট্যাগ সম্পাদনা করুন' : 'নতুন ট্যাগ যুক্ত করুন'}</span>
                  </h3>
                  {editingTagId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTagId(null);
                        setNewTagName('');
                        setNewTagDesc('');
                      }}
                      className="text-[11px] text-slate-500 hover:text-slate-800 font-bold"
                    >
                      বাতিল
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveTag} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ট্যাগের নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. VIP Candidate, Needs Discount"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">কালার স্কিম</label>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_OPTIONS.map(c => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setNewTagColor(c.value)}
                          className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                            newTagColor === c.value
                              ? `${c.bgClass} ${c.textClass} ${c.borderClass} ring-2 ring-indigo-500`
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${c.bgClass.replace('100', '500')}`} />
                          <span className="text-[10px] truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">বিবরণ (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      placeholder="e.g. Candidates interested in weekend executive batch"
                      value={newTagDesc}
                      onChange={(e) => setNewTagDesc(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                  >
                    {editingTagId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span>{editingTagId ? 'ট্যাগ সংরক্ষণ করুন' : 'ট্যাগ তৈরি করুন'}</span>
                  </button>
                </form>
              </div>

              {/* Tag List */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                    সক্রিয় ট্যাগসমূহ ({crmSettings.tags?.length || 0})
                  </h4>
                  <span className="text-[11px] text-slate-500">লিড কার্ড ও টেবিলে সরাসরি ব্যবহারযোগ্য</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {(crmSettings.tags || []).map(tag => {
                    const count = getTagLeadCount(tag.name);
                    const colorDef = COLOR_OPTIONS.find(c => c.value === tag.color) || COLOR_OPTIONS[0];

                    return (
                      <div
                        key={tag.id}
                        className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-200 transition-all flex flex-col justify-between space-y-2 group"
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${colorDef.bgClass} ${colorDef.textClass} ${colorDef.borderClass} flex items-center space-x-1`}
                          >
                            <Tag className="w-3 h-3" />
                            <span>{tag.name}</span>
                          </span>

                          <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleStartEditTag(tag)}
                              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg"
                              title="সম্পাদনা করুন"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`আপনি কি "${tag.name}" ট্যাগটি মুছে ফেলতে চান?`)) {
                                  deleteLeadTag(tag.id);
                                }
                              }}
                              className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {tag.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2">{tag.description}</p>
                        )}

                        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                          <span>{count} জন লিডে সংযুক্ত</span>
                          <span className="font-mono text-slate-300">ID: {tag.id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM FIELDS */}
          {activeTab === 'customFields' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Field Creation Form */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>নতুন কাস্টম ফিল্ড তৈরি করুন</span>
                </h3>

                <form onSubmit={handleSaveField} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ফিল্ডের লেবেল / নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Expected Joining Date, Laptop Available"
                      value={newFieldLabel}
                      onChange={(e) => {
                        setNewFieldLabel(e.target.value);
                        if (!newFieldKey) {
                          setNewFieldKey(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'));
                        }
                      }}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ফিল্ডের ধরন (Type)</label>
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value as CrmCustomFieldType)}
                        className="w-full text-xs px-2.5 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                      >
                        <option value="text">Text (ছোট লেখা)</option>
                        <option value="number">Number (সংখ্যা)</option>
                        <option value="select">Dropdown Select (তালিকা)</option>
                        <option value="date">Date (তারিখ)</option>
                        <option value="boolean">Yes/No Switch (চেকবক্স)</option>
                        <option value="textarea">Textarea (বড় মন্তব্য)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                      <select
                        value={newFieldCategory}
                        onChange={(e) => setNewFieldCategory(e.target.value as any)}
                        className="w-full text-xs px-2.5 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                      >
                        <option value="General">General</option>
                        <option value="Academic">Academic</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Billing">Billing</option>
                      </select>
                    </div>
                  </div>

                  {newFieldType === 'select' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        অপশনসমূহ (কমা দিয়ে আলাদা করুন) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Morning Shift, Evening Shift, Weekend Batch"
                        value={newFieldOptions}
                        onChange={(e) => setNewFieldOptions(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">প্লেসহোল্ডার টেক্সট (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      placeholder="e.g. Enter candidate reference details..."
                      value={newFieldPlaceholder}
                      onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newFieldShowInTable}
                        onChange={(e) => setNewFieldShowInTable(e.target.checked)}
                        className="w-4 h-4 rounded-md text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span>লিড কার্ড ও টেবিলে সরাসরি প্রদর্শন করুন</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newFieldRequired}
                        onChange={(e) => setNewFieldRequired(e.target.checked)}
                        className="w-4 h-4 rounded-md text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span>আবশ্যকীয় ফিল্ড (Required)</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>কাস্টম ফিল্ড সেভ করুন</span>
                  </button>
                </form>
              </div>

              {/* Field List */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                    সংরক্ষিত কাস্টম ফিল্ডসমূহ ({crmSettings.customFields?.length || 0})
                  </h4>
                  <span className="text-[11px] text-slate-500">লিড এন্ট্রি ও এডিট ফর্মে কার্যকর</span>
                </div>

                <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                  {(crmSettings.customFields || []).map(f => (
                    <div
                      key={f.id}
                      className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-200 transition-all flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900">{f.label}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                            {f.type}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                            {f.category || 'General'}
                          </span>
                          {f.required && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-600 font-bold">
                              Required
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                          <span className="font-mono">key: {f.key}</span>
                          {f.options && (
                            <span>{f.options.length}টি ড্রপডাউন অপশন</span>
                          )}
                          <span>{f.showInLeadTable ? '• টেবিলে দৃশ্যমান' : '• বিস্তারিত ফর্মে সংরক্ষিত'}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            updateCustomField(f.id, { showInLeadTable: !f.showInLeadTable });
                            showToast(`টেবিল ভিজিবিলিটি আপডেট হয়েছে!`);
                          }}
                          className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                            f.showInLeadTable
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          {f.showInLeadTable ? 'Table: ON' : 'Table: OFF'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`আপনি কি "${f.label}" কাস্টম ফিল্ডটি মুছে ফেলতে চান?`)) {
                              deleteCustomField(f.id);
                              showToast(`ফিল্ড মুছে ফেলা হয়েছে!`);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOURCES & LOST REASONS */}
          {activeTab === 'sourcesAndReasons' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dynamic Lead Sources */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                    <ListFilter className="w-4 h-4 text-indigo-600" />
                    <span>ডায়নামিক লিড সোর্স ({crmSettings.leadSources?.length || 0})</span>
                  </h4>
                </div>

                <form onSubmit={handleAddSource} className="flex space-x-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. TikTok Ads, Education Fair"
                    value={newSourceInput}
                    onChange={(e) => setNewSourceInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>যোগ করুন</span>
                  </button>
                </form>

                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {(crmSettings.leadSources || []).map((src, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between hover:border-slate-300"
                    >
                      <span>{src}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSource(src)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Lost Reasons */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>ড্রপ / লস্ট লিড রিজন ({crmSettings.lostReasons?.length || 0})</span>
                  </h4>
                </div>

                <form onSubmit={handleAddReason} className="flex space-x-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Exam Conflict, Financial Issue"
                    value={newReasonInput}
                    onChange={(e) => setNewReasonInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>যোগ করুন</span>
                  </button>
                </form>

                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {(crmSettings.lostReasons || []).map((rsn, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between hover:border-slate-300"
                    >
                      <span>{rsn}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteReason(rsn)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>সকল পরিবর্তন স্বয়ংক্রিয়ভাবে সংরক্ষিত হচ্ছে</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all"
          >
            সম্পন্ন করুন
          </button>
        </div>
      </div>
    </div>
  );
};
