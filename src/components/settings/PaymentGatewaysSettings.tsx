import React, { useState, useRef } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { PaymentAccountConfig } from '../../types';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  QrCode,
  Upload,
  Image as ImageIcon,
  Save,
  Building,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Eye,
  Check,
  X,
  Smartphone,
  Landmark
} from 'lucide-react';
import { ImageUploadCropModal } from '../common/ImageUploadCropModal';

export const PaymentGatewaysSettings: React.FC = () => {
  const { academySettings, updateAcademySettings } = useAcademy();

  // Default accounts if none exist
  const defaultAccounts: PaymentAccountConfig[] = [
    {
      id: 'mfs-bkash-1',
      method: 'bKash',
      accountType: 'Merchant',
      accountNumber: academySettings.primarySupportPhone || '01798444444',
      accountName: academySettings.instituteName || 'Nexgen Computer Academy',
      instructions: 'বিকাশ অ্যাপ থেকে "Payment" অপশন বেছে নিয়ে মার্চেন্ট নাম্বারে ফি প্রদান করুন এবং প্রাপ্ত TrxID প্রদান করুন।',
      isActive: true
    },
    {
      id: 'mfs-nagad-1',
      method: 'Nagad',
      accountType: 'Personal',
      accountNumber: academySettings.primarySupportPhone || '01798444444',
      accountName: academySettings.instituteName || 'Nexgen Computer Academy',
      instructions: 'নগদ অ্যাপ বা *167# থেকে "Send Money" করে TrxID সংরক্ষণ করুন।',
      isActive: true
    },
    {
      id: 'bank-1',
      method: 'Bank',
      accountType: 'Personal',
      accountNumber: '2050145020123456',
      accountName: academySettings.instituteName || 'Nexgen Computer Academy',
      bankName: 'Islami Bank Bangladesh PLC',
      branchName: 'Farmgate Branch, Dhaka',
      routingNumber: '125271890',
      instructions: 'অনলাইন ব্যাংক ট্রান্সফার বা ডিপোজিট স্লিপে স্টুডেন্টের নাম ও ফোন নম্বর রেফারেন্সে উল্লেখ করুন।',
      isActive: true
    }
  ];

  const accounts = academySettings.paymentAccounts && academySettings.paymentAccounts.length > 0
    ? academySettings.paymentAccounts
    : defaultAccounts;

  const [accountList, setAccountList] = useState<PaymentAccountConfig[]>(accounts);
  const [editingAccount, setEditingAccount] = useState<PaymentAccountConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Official Stamps & Signatures
  const [sealUrl, setSealUrl] = useState<string>(academySettings.institutionSealUrl || '');
  const [signatureUrl, setSignatureUrl] = useState<string>(academySettings.directorSignatureUrl || '');
  const [signatoryTitle, setSignatoryTitle] = useState<string>(academySettings.idCardSignatoryTitle || 'Authorized Signature & Seal');
  const [receiptNotes, setReceiptNotes] = useState<string>(
    academySettings.receiptNotes || '১. ভর্তি ফি ও কোর্স ফি অপরিশোধিত থাকলে পরবর্তী ক্লাসে অংশগ্রহণ স্থগিত হতে পারে।\n২. মানি রিসিটটি কোর্স সমাপ্তি ও সার্টিফিকেট গ্রহণ পর্যন্ত যত্ন সহকারে সংরক্ষণ করুন।'
  );

  // Success toast
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Image Cropper State
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<'seal' | 'signature' | 'qr'>('seal');

  // New/Edit account form
  const [formData, setFormData] = useState<Partial<PaymentAccountConfig>>({
    method: 'bKash',
    accountType: 'Merchant',
    accountNumber: '',
    accountName: '',
    bankName: '',
    branchName: '',
    routingNumber: '',
    qrCodeUrl: '',
    instructions: '',
    isActive: true
  });

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setFormData({
      method: 'bKash',
      accountType: 'Merchant',
      accountNumber: '',
      accountName: academySettings.instituteName || '',
      bankName: '',
      branchName: '',
      routingNumber: '',
      qrCodeUrl: '',
      instructions: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc: PaymentAccountConfig) => {
    setEditingAccount(acc);
    setFormData({ ...acc });
    setIsModalOpen(true);
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm('Are you sure you want to remove this payment account?')) {
      const updated = accountList.filter(a => a.id !== id);
      setAccountList(updated);
      updateAcademySettings({ paymentAccounts: updated });
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = accountList.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a);
    setAccountList(updated);
    updateAcademySettings({ paymentAccounts: updated });
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountNumber?.trim()) return;

    let updated: PaymentAccountConfig[];
    if (editingAccount) {
      updated = accountList.map(a => a.id === editingAccount.id ? { ...a, ...formData } as PaymentAccountConfig : a);
    } else {
      const newAcc: PaymentAccountConfig = {
        id: `acc-${Date.now()}`,
        method: formData.method || 'bKash',
        accountType: formData.accountType || 'Personal',
        accountNumber: formData.accountNumber || '',
        accountName: formData.accountName || academySettings.instituteName || '',
        bankName: formData.bankName,
        branchName: formData.branchName,
        routingNumber: formData.routingNumber,
        qrCodeUrl: formData.qrCodeUrl,
        instructions: formData.instructions,
        isActive: formData.isActive !== false
      };
      updated = [...accountList, newAcc];
    }

    setAccountList(updated);
    updateAcademySettings({ paymentAccounts: updated });
    setIsModalOpen(false);
    triggerSuccess();
  };

  const handleSaveAllSettings = () => {
    updateAcademySettings({
      paymentAccounts: accountList,
      institutionSealUrl: sealUrl,
      directorSignatureUrl: signatureUrl,
      idCardSignatoryTitle: signatoryTitle,
      receiptNotes: receiptNotes
    });
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>পেমেন্ট একাউন্ট ও অফিসিয়াল রিসিট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              পেমেন্ট গেটওয়ে, বিকাশ/নগদ মার্চেন্ট ও মানি রিসিট কাস্টমাইজেশন
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              অনলাইন ভর্তি ও বকেয়া আদায়ে প্রদর্শিত বিকাশ/নগদ/রকেট নম্বর, কিউআর কোড এবং প্রিন্ট রিসিটের অফিসিয়াল সিল ও স্বাক্ষর কনফিগার করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পেমেন্ট একাউন্ট যোগ করুন</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAllSettings}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>সেটিংস সেভ করুন</span>
          </button>
        </div>
      </div>

      {/* Active Accounts Grid */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-slate-900 text-sm flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span>সক্রিয় পেমেন্ট পদ্ধতি ও মার্চেন্ট একাউন্টসমূহ ({accountList.length})</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">
            এগুলো সরাসরি অনলাইন এডমিশন ও এসএমএস/ইনভয়েসে ব্যবহৃত হবে
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accountList.map((acc) => {
            const isBkash = acc.method === 'bKash';
            const isNagad = acc.method === 'Nagad';
            const isBank = acc.method === 'Bank';

            const badgeBg = isBkash
              ? 'bg-pink-50 border-pink-200 text-pink-700'
              : isNagad
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : isBank
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-indigo-50 border-indigo-200 text-indigo-700';

            return (
              <div
                key={acc.id}
                className={`p-4 rounded-2xl border transition-all relative ${
                  acc.isActive ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-black border ${badgeBg}`}>
                      {acc.method}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                      {acc.accountType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(acc.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        acc.isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                      title="Toggle Active/Inactive"
                    >
                      {acc.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(acc)}
                      className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Account"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAccount(acc.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Delete Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="text-sm font-black font-mono text-slate-900 tracking-wide">
                    {acc.accountNumber}
                  </div>
                  {acc.accountName && (
                    <div className="text-xs text-slate-600 font-medium">{acc.accountName}</div>
                  )}
                  {isBank && acc.bankName && (
                    <div className="text-xs text-slate-500 font-medium">
                      {acc.bankName} {acc.branchName ? `• ${acc.branchName}` : ''}
                    </div>
                  )}
                  {acc.instructions && (
                    <p className="text-[11px] text-slate-500 pt-1 line-clamp-2 italic">
                      "{acc.instructions}"
                    </p>
                  )}
                </div>

                {acc.qrCodeUrl && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center space-x-2 text-[11px] text-indigo-600 font-bold">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>কিউআর কোড যুক্ত আছে</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Voucher, Seal & Signature Configuration */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
        <h4 className="font-black text-slate-900 text-sm flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>মানি রিসিট ও ভাউচারের অফিসিয়াল সিল, স্বাক্ষর ও প্রিন্ট নোট</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Institution Seal */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">অফিসিয়াল সিল / স্ট্যাম্প (Seal)</label>
              {sealUrl && (
                <button
                  type="button"
                  onClick={() => setSealUrl('')}
                  className="text-[10px] text-rose-600 hover:underline"
                >
                  রিমুভ
                </button>
              )}
            </div>

            <div className="h-32 bg-white border border-dashed border-slate-300 rounded-xl flex items-center justify-center p-2 overflow-hidden relative group">
              {sealUrl ? (
                <img
                  src={sealUrl}
                  alt="Institution Seal"
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <Building className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[11px]">সিল আপলোড করা হয়নি</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setCropTarget('seal');
                setIsCropOpen(true);
              }}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{sealUrl ? 'সিল পরিবর্তন করুন' : 'সিল আপলোড ও ক্রপ'}</span>
            </button>
          </div>

          {/* Authorized Signature */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">পরিচালকের স্বাক্ষর (Signature)</label>
              {signatureUrl && (
                <button
                  type="button"
                  onClick={() => setSignatureUrl('')}
                  className="text-[10px] text-rose-600 hover:underline"
                >
                  রিমুভ
                </button>
              )}
            </div>

            <div className="h-32 bg-white border border-dashed border-slate-300 rounded-xl flex items-center justify-center p-2 overflow-hidden relative group">
              {signatureUrl ? (
                <img
                  src={signatureUrl}
                  alt="Signatory"
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <ShieldCheck className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[11px]">স্বাক্ষর আপলোড করা হয়নি</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setCropTarget('signature');
                setIsCropOpen(true);
              }}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{signatureUrl ? 'স্বাক্ষর পরিবর্তন করুন' : 'স্বাক্ষর আপলোড ও ক্রপ'}</span>
            </button>
          </div>

          {/* Receipt Custom Note & Title */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                স্বাক্ষরকারীর পদবী (Signatory Designation)
              </label>
              <input
                type="text"
                value={signatoryTitle}
                onChange={e => setSignatoryTitle(e.target.value)}
                placeholder="Authorized Signatory & Seal"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                মানি রিসিট ফুটারে মুদ্রিত শর্তাবলী (Terms & Notes)
              </label>
              <textarea
                rows={4}
                value={receiptNotes}
                onChange={e => setReceiptNotes(e.target.value)}
                placeholder="শর্তাবলী লিখুন যা প্রিন্ট রিসিটের নিচে প্রদর্শিত হবে..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={handleSaveAllSettings}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>সিল ও রিসিট সেটিংস সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold">
                  {editingAccount ? 'পেমেন্ট একাউন্ট এডিট করুন' : 'নতুন পেমেন্ট একাউন্ট যোগ করুন'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">পেমেন্ট মেথড *</label>
                  <select
                    value={formData.method}
                    onChange={e => setFormData({ ...formData, method: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                    <option value="Rocket">Rocket (রকেট)</option>
                    <option value="Upay">Upay (উপায়)</option>
                    <option value="Bank">Bank Account (ব্যাংক)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">একাউন্টের ধরন</label>
                  <select
                    value={formData.accountType}
                    onChange={e => setFormData({ ...formData, accountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Merchant">Merchant (মার্চেন্ট)</option>
                    <option value="Personal">Personal (ব্যক্তিগত)</option>
                    <option value="Agent">Agent (এজেন্ট)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">একাউন্ট / মোবাইল নম্বর *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 01798444444"
                  value={formData.accountNumber}
                  onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">একাউন্টের নাম / প্রতিষ্ঠান</label>
                <input
                  type="text"
                  placeholder="e.g. Nexgen Computer Academy"
                  value={formData.accountName}
                  onChange={e => setFormData({ ...formData, accountName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              {formData.method === 'Bank' && (
                <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">ব্যাংকের নাম</label>
                      <input
                        type="text"
                        placeholder="e.g. Dutch-Bangla Bank"
                        value={formData.bankName}
                        onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">শাখা (Branch)</label>
                      <input
                        type="text"
                        placeholder="e.g. Farmgate Branch"
                        value={formData.branchName}
                        onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">রাউটিং নম্বর (Routing Number)</label>
                    <input
                      type="text"
                      placeholder="e.g. 125271890"
                      value={formData.routingNumber}
                      onChange={e => setFormData({ ...formData, routingNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">পেমেন্ট নির্দেশনা (Instructions)</label>
                <textarea
                  rows={2}
                  placeholder="কীভাবে টাকা পাঠাবে (যেমন: Payment অপশনে গিয়ে TrxID দিন)..."
                  value={formData.instructions}
                  onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* QR Code Upload / Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold">পেমেন্ট কিউআর কোড (ঐচ্ছিক)</label>
                  {formData.qrCodeUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, qrCodeUrl: '' })}
                      className="text-[10px] text-rose-600 hover:underline"
                    >
                      রিমুভ
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="কিউআর কোড ইমেজ URL অথবা আপলোড করুন..."
                    value={formData.qrCodeUrl || ''}
                    onChange={e => setFormData({ ...formData, qrCodeUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCropTarget('qr');
                      setIsCropOpen(true);
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition-colors whitespace-nowrap"
                  >
                    আপলোড
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="accActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <label htmlFor="accActive" className="text-slate-700 font-bold cursor-pointer">
                  এই একাউন্টটি ওয়েবসাইটে সরাসরি সক্রিয় রাখুন
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Crop Modal for Seal / Signature / QR */}
      <ImageUploadCropModal
        isOpen={isCropOpen}
        onClose={() => setIsCropOpen(false)}
        onSaveImage={(dataUrl) => {
          if (cropTarget === 'seal') {
            setSealUrl(dataUrl);
            updateAcademySettings({ institutionSealUrl: dataUrl });
          } else if (cropTarget === 'signature') {
            setSignatureUrl(dataUrl);
            updateAcademySettings({ directorSignatureUrl: dataUrl });
          } else if (cropTarget === 'qr') {
            setFormData(prev => ({ ...prev, qrCodeUrl: dataUrl }));
          }
          setIsCropOpen(false);
          triggerSuccess();
        }}
        aspectRatio={cropTarget === 'signature' ? 'free' : '1:1'}
        title={
          cropTarget === 'seal'
            ? 'অফিসিয়াল সিল আপলোড ও ক্রপ করুন'
            : cropTarget === 'signature'
            ? 'স্বাক্ষর আপলোড ও ক্রপ করুন'
            : 'পেমেন্ট কিউআর কোড আপলোড করুন'
        }
      />
    </div>
  );
};
