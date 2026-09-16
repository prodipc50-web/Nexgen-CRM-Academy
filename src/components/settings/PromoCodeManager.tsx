import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { PromoCoupon } from '../../types';
import { DEFAULT_PROMO_COUPONS } from '../../data/defaultSettingsData';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Save,
  RotateCcw,
  Copy,
  Percent,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const PromoCodeManager: React.FC = () => {
  const { academySettings, updateAcademySettings, courses } = useAcademy();

  const currentCoupons: PromoCoupon[] = academySettings.promoCoupons || DEFAULT_PROMO_COUPONS;

  const [coupons, setCoupons] = useState<PromoCoupon[]>(currentCoupons);
  const [savedToast, setSavedToast] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Add Coupon form state
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Omit<PromoCoupon, 'id' | 'usedCount'>>({
    code: '',
    title: '',
    discountType: 'fixed',
    discountValue: 1000,
    minCourseFee: 4000,
    applicableCourseIds: ['all'],
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 50,
    isActive: true,
    notes: ''
  });

  // Edit Coupon state
  const [editingCoupon, setEditingCoupon] = useState<PromoCoupon | null>(null);

  const handleSaveAll = (updatedCoupons = coupons) => {
    updateAcademySettings({
      promoCoupons: updatedCoupons
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('আপনি কি ডিফল্ট প্রমো কোড ও স্কলারশিপ কুপনে ফিরে যেতে চান?')) {
      setCoupons(DEFAULT_PROMO_COUPONS);
      handleSaveAll(DEFAULT_PROMO_COUPONS);
    }
  };

  const toggleCouponActive = (id: string) => {
    const updated = coupons.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    setCoupons(updated);
    handleSaveAll(updated);
  };

  const deleteCoupon = (id: string) => {
    if (window.confirm('এই কুপনটি মুছে ফেলতে চান?')) {
      const updated = coupons.filter(c => c.id !== id);
      setCoupons(updated);
      handleSaveAll(updated);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = () => {
    if (!newCoupon.code.trim() || !newCoupon.title.trim()) return;
    const cleanCode = newCoupon.code.trim().toUpperCase().replace(/\s+/g, '');
    const coupon: PromoCoupon = {
      ...newCoupon,
      code: cleanCode,
      id: `cup-${Date.now()}`,
      usedCount: 0
    };
    const updated = [coupon, ...coupons];
    setCoupons(updated);
    setIsAdding(false);
    setNewCoupon({
      code: '',
      title: '',
      discountType: 'fixed',
      discountValue: 1000,
      minCourseFee: 4000,
      applicableCourseIds: ['all'],
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 50,
      isActive: true,
      notes: ''
    });
    handleSaveAll(updated);
  };

  const handleUpdateCoupon = () => {
    if (!editingCoupon || !editingCoupon.code.trim() || !editingCoupon.title.trim()) return;
    const cleanCode = editingCoupon.code.trim().toUpperCase().replace(/\s+/g, '');
    const updated = coupons.map(c =>
      c.id === editingCoupon.id ? { ...editingCoupon, code: cleanCode } : c
    );
    setCoupons(updated);
    setEditingCoupon(null);
    handleSaveAll(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-black tracking-wide">
              প্রমো কোড ও স্কলারশিপ কুপন ম্যানেজার
            </h3>
            <span className="text-[11px] bg-purple-500/30 text-purple-200 font-bold px-2 py-0.5 rounded-full border border-purple-400/30">
              Discounts & Campaign Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            কোর্স ফিতে বিশেষ ছাড়, সিজনাল প্রমোশন ও স্কলারশিপ ডিসকাউন্ট কোড তৈরি করুন। ভর্তি ফরম ও রসিদে এই কোডগুলো প্রযোজ্য হবে।
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>রিসেট ডিফল্ট</span>
          </button>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-2xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>প্রমো কোড ও স্কলারশিপ কুপন সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      {/* Main Coupon List Area */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Tag className="w-4 h-4 text-purple-600" />
              <span>সক্রিয় প্রমো কোড ও কুপন তালিকা ({coupons.length})</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              ভর্তির সময় স্টুডেন্টদের ডিসকাউন্ট প্রদান করতে এই কোডগুলো ব্যবহার করা যাবে।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন প্রমো কোড তৈরি করুন</span>
          </button>
        </div>

        {/* Add Coupon Inline Form */}
        {isAdding && (
          <div className="p-5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-950 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>নতুন প্রমো কোডের বিবরণ</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">কুপন কোড (Promo Code)</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. EID2026"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg uppercase font-mono font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">অফারের নাম / শিরোনাম</label>
                <input
                  type="text"
                  value={newCoupon.title}
                  onChange={e => setNewCoupon({ ...newCoupon, title: e.target.value })}
                  placeholder="e.g. পবিত্র ঈদুল ফিতর স্পেশাল স্কলারশিপ অফার"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ডিসকাউন্ট ধরন</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCoupon({ ...newCoupon, discountType: 'fixed' })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      newCoupon.discountType === 'fixed'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    ফিক্সড (৳)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCoupon({ ...newCoupon, discountType: 'percentage' })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      newCoupon.discountType === 'percentage'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    শতকরা (%)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ডিসকাউন্ট পরিমাণ {newCoupon.discountType === 'fixed' ? '(৳)' : '(%)'}
                </label>
                <input
                  type="number"
                  value={newCoupon.discountValue}
                  onChange={e => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">নূন্যতম কোর্স ফি (৳)</label>
                <input
                  type="number"
                  value={newCoupon.minCourseFee || 0}
                  onChange={e => setNewCoupon({ ...newCoupon, minCourseFee: Number(e.target.value) })}
                  placeholder="0 for any fee"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">মেয়াদ শেষ (Valid Until)</label>
                <input
                  type="date"
                  value={newCoupon.validUntil || ''}
                  onChange={e => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">সর্বোচ্চ ব্যবহার সীমা (Usage Limit)</label>
                <input
                  type="number"
                  value={newCoupon.usageLimit || 50}
                  onChange={e => setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleCreateCoupon}
                className="px-5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                কুপন তৈরি করুন
              </button>
            </div>
          </div>
        )}

        {/* Edit Coupon Modal */}
        {editingCoupon && (
          <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 flex items-center space-x-1.5">
                <Edit2 className="w-4 h-4 text-indigo-600" />
                <span>প্রমো কোড সংশোধন করুন</span>
              </span>
              <button
                type="button"
                onClick={() => setEditingCoupon(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">কুপন কোড</label>
                <input
                  type="text"
                  value={editingCoupon.code}
                  onChange={e => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg uppercase font-mono font-bold outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">অফারের নাম</label>
                <input
                  type="text"
                  value={editingCoupon.title}
                  onChange={e => setEditingCoupon({ ...editingCoupon, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ডিসকাউন্ট ধরন</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCoupon({ ...editingCoupon, discountType: 'fixed' })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      editingCoupon.discountType === 'fixed'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    ফিক্সড (৳)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCoupon({ ...editingCoupon, discountType: 'percentage' })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      editingCoupon.discountType === 'percentage'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    শতকরা (%)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ডিসকাউন্ট পরিমাণ {editingCoupon.discountType === 'fixed' ? '(৳)' : '(%)'}
                </label>
                <input
                  type="number"
                  value={editingCoupon.discountValue}
                  onChange={e => setEditingCoupon({ ...editingCoupon, discountValue: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">নূন্যতম কোর্স ফি (৳)</label>
                <input
                  type="number"
                  value={editingCoupon.minCourseFee || 0}
                  onChange={e => setEditingCoupon({ ...editingCoupon, minCourseFee: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">মেয়াদ শেষ</label>
                <input
                  type="date"
                  value={editingCoupon.validUntil || ''}
                  onChange={e => setEditingCoupon({ ...editingCoupon, validUntil: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">সর্বোচ্চ ব্যবহার সীমা</label>
                <input
                  type="number"
                  value={editingCoupon.usageLimit || 50}
                  onChange={e => setEditingCoupon({ ...editingCoupon, usageLimit: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCoupon(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleUpdateCoupon}
                className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                আপডেট সম্পন্ন করুন
              </button>
            </div>
          </div>
        )}

        {/* Coupons Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map(c => {
            const isExpired = c.validUntil && new Date(c.validUntil).getTime() < Date.now();
            const isLimitReached = c.usageLimit ? c.usedCount >= c.usageLimit : false;

            return (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  c.isActive && !isExpired && !isLimitReached
                    ? 'bg-white border-slate-200 shadow-2xs hover:border-purple-300'
                    : 'bg-slate-50 border-dashed border-slate-300 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 font-mono font-black text-xs tracking-wider">
                        {c.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(c.code)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                        title="Copy code"
                      >
                        {copiedCode === c.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.discountType === 'fixed'
                        ? `৳${c.discountValue.toLocaleString()} ছাড়`
                        : `${c.discountValue}% ছাড়`}
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-800 text-xs mt-2.5 line-clamp-1">
                    {c.title}
                  </h5>

                  {c.notes && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {c.notes}
                    </p>
                  )}

                  <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div>
                      <span>ব্যবহৃত: </span>
                      <strong className="text-slate-700">
                        {c.usedCount} / {c.usageLimit || '∞'}
                      </strong>
                    </div>
                    <div className="text-right">
                      <span>মেয়াদ: </span>
                      <strong className={isExpired ? 'text-rose-600' : 'text-slate-700'}>
                        {c.validUntil || 'অনির্দিষ্ট'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleCouponActive(c.id)}
                    className="flex items-center space-x-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    {c.isActive ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">সক্রিয়</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-slate-400" />
                        <span>নিষ্ক্রিয়</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setEditingCoupon(c)}
                      className="p-1 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-md transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCoupon(c.id)}
                      className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
