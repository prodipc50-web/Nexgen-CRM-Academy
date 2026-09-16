import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { ScheduleManagerConfig, ClassShiftSlot, ClassDayPattern } from '../../types';
import { DEFAULT_SCHEDULE_CONFIG } from '../../data/defaultSettingsData';
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Save,
  RotateCcw,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Check,
  X
} from 'lucide-react';

const WEEKDAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const ClassShiftScheduleManager: React.FC = () => {
  const { academySettings, updateAcademySettings } = useAcademy();

  const currentConfig: ScheduleManagerConfig = academySettings.scheduleConfig || DEFAULT_SCHEDULE_CONFIG;

  const [shifts, setShifts] = useState<ClassShiftSlot[]>(currentConfig.shifts || DEFAULT_SCHEDULE_CONFIG.shifts);
  const [dayPatterns, setDayPatterns] = useState<ClassDayPattern[]>(currentConfig.dayPatterns || DEFAULT_SCHEDULE_CONFIG.dayPatterns);
  const [savedToast, setSavedToast] = useState(false);

  // Edit / Add shift modal/form state
  const [editingShift, setEditingShift] = useState<ClassShiftSlot | null>(null);
  const [isAddingShift, setIsAddingShift] = useState(false);
  const [newShiftData, setNewShiftData] = useState<Omit<ClassShiftSlot, 'id'>>({
    name: '',
    shiftType: 'Morning',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    isActive: true
  });

  // Edit / Add Day Pattern state
  const [editingPattern, setEditingPattern] = useState<ClassDayPattern | null>(null);
  const [isAddingPattern, setIsAddingPattern] = useState(false);
  const [newPatternData, setNewPatternData] = useState<Omit<ClassDayPattern, 'id'>>({
    name: '',
    shortCode: '',
    days: ['Sunday', 'Tuesday', 'Thursday'],
    isActive: true
  });

  const handleSaveAll = (updatedShifts = shifts, updatedPatterns = dayPatterns) => {
    updateAcademySettings({
      scheduleConfig: {
        shifts: updatedShifts,
        dayPatterns: updatedPatterns
      }
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('আপনি কি ডিফল্ট ক্লাস শিফট ও ডে প্যাটার্নে ফিরে যেতে চান?')) {
      setShifts(DEFAULT_SCHEDULE_CONFIG.shifts);
      setDayPatterns(DEFAULT_SCHEDULE_CONFIG.dayPatterns);
      handleSaveAll(DEFAULT_SCHEDULE_CONFIG.shifts, DEFAULT_SCHEDULE_CONFIG.dayPatterns);
    }
  };

  // Shift Actions
  const toggleShiftActive = (id: string) => {
    const updated = shifts.map(s => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    setShifts(updated);
    handleSaveAll(updated, dayPatterns);
  };

  const deleteShift = (id: string) => {
    if (window.confirm('এই শিফটটি মুছে ফেলতে চান?')) {
      const updated = shifts.filter(s => s.id !== id);
      setShifts(updated);
      handleSaveAll(updated, dayPatterns);
    }
  };

  const handleCreateShift = () => {
    if (!newShiftData.name.trim()) return;
    const newShift: ClassShiftSlot = {
      ...newShiftData,
      id: `sh-${Date.now()}`
    };
    const updated = [...shifts, newShift];
    setShifts(updated);
    setIsAddingShift(false);
    setNewShiftData({
      name: '',
      shiftType: 'Morning',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      isActive: true
    });
    handleSaveAll(updated, dayPatterns);
  };

  const handleUpdateShift = () => {
    if (!editingShift || !editingShift.name.trim()) return;
    const updated = shifts.map(s => (s.id === editingShift.id ? editingShift : s));
    setShifts(updated);
    setEditingShift(null);
    handleSaveAll(updated, dayPatterns);
  };

  // Day Pattern Actions
  const togglePatternActive = (id: string) => {
    const updated = dayPatterns.map(p => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    setDayPatterns(updated);
    handleSaveAll(shifts, updated);
  };

  const deletePattern = (id: string) => {
    if (window.confirm('এই ডে প্যাটার্নটি মুছে ফেলতে চান?')) {
      const updated = dayPatterns.filter(p => p.id !== id);
      setDayPatterns(updated);
      handleSaveAll(shifts, updated);
    }
  };

  const handleCreatePattern = () => {
    if (!newPatternData.name.trim()) return;
    const newPattern: ClassDayPattern = {
      ...newPatternData,
      id: `dp-${Date.now()}`
    };
    const updated = [...dayPatterns, newPattern];
    setDayPatterns(updated);
    setIsAddingPattern(false);
    setNewPatternData({
      name: '',
      shortCode: '',
      days: ['Sunday', 'Tuesday', 'Thursday'],
      isActive: true
    });
    handleSaveAll(shifts, updated);
  };

  const handleUpdatePattern = () => {
    if (!editingPattern || !editingPattern.name.trim()) return;
    const updated = dayPatterns.map(p => (p.id === editingPattern.id ? editingPattern : p));
    setDayPatterns(updated);
    setEditingPattern(null);
    handleSaveAll(shifts, updated);
  };

  const getShiftIcon = (type: ClassShiftSlot['shiftType']) => {
    switch (type) {
      case 'Morning':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Afternoon':
        return <Sun className="w-4 h-4 text-orange-500" />;
      case 'Evening':
        return <Sunset className="w-4 h-4 text-purple-500" />;
      case 'Night':
        return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'Weekend':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-black tracking-wide">
              ক্লাস শিফট ও শিডিউল স্লট ম্যানেজার
            </h3>
            <span className="text-[11px] bg-teal-500/30 text-teal-200 font-bold px-2 py-0.5 rounded-full border border-teal-400/30">
              Shift Master Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            একাডেমির নিয়মিত ব্যাচ, উইকেন্ড বা সান্ধ্যকালীন শিফট এবং ক্লাস বারের রুটিন স্লট ডায়নামিকভাবে যুক্ত ও পরিচালনা করুন।
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
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-2xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>ক্লাস শিফট ও শিডিউল সেটিংস সফলভাবে আপডেট হয়েছে!</span>
        </div>
      )}

      {/* SECTION 1: SHIFT SLOTS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>নির্ধারিত ক্লাস শিফট স্লট সমূহ ({shifts.length})</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              ব্যাচ তৈরির সময় এই সক্রিয় শিফটগুলো তালিকা আকারে প্রদর্শিত হবে।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingShift(true)}
            className="px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন শিফট যোগ করুন</span>
          </button>
        </div>

        {/* Add Shift Inline Form */}
        {isAddingShift && (
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900">নতুন শিফটের তথ্য পূরণ করুন</span>
              <button
                type="button"
                onClick={() => setIsAddingShift(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">শিফটের নাম</label>
                <input
                  type="text"
                  value={newShiftData.name}
                  onChange={e => setNewShiftData({ ...newShiftData, name: e.target.value })}
                  placeholder="e.g. Morning Regular Batch"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-teal-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">ক্যাটাগরি</label>
                <select
                  value={newShiftData.shiftType}
                  onChange={e => setNewShiftData({ ...newShiftData, shiftType: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-teal-600"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="font-bold text-slate-700 block mb-1">শুরু</label>
                  <input
                    type="text"
                    value={newShiftData.startTime}
                    onChange={e => setNewShiftData({ ...newShiftData, startTime: e.target.value })}
                    placeholder="10:00 AM"
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg outline-none text-xs"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-bold text-slate-700 block mb-1">শেষ</label>
                  <input
                    type="text"
                    value={newShiftData.endTime}
                    onChange={e => setNewShiftData({ ...newShiftData, endTime: e.target.value })}
                    placeholder="12:00 PM"
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg outline-none text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingShift(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleCreateShift}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                যোগ করুন
              </button>
            </div>
          </div>
        )}

        {/* Edit Shift Modal/Inline */}
        {editingShift && (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">শিফটের তথ্য সংশোধন করুন</span>
              <button
                type="button"
                onClick={() => setEditingShift(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">শিফটের নাম</label>
                <input
                  type="text"
                  value={editingShift.name}
                  onChange={e => setEditingShift({ ...editingShift, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-amber-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">ক্যাটাগরি</label>
                <select
                  value={editingShift.shiftType}
                  onChange={e => setEditingShift({ ...editingShift, shiftType: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-amber-600"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="font-bold text-slate-700 block mb-1">শুরু</label>
                  <input
                    type="text"
                    value={editingShift.startTime}
                    onChange={e => setEditingShift({ ...editingShift, startTime: e.target.value })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg outline-none text-xs"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-bold text-slate-700 block mb-1">শেষ</label>
                  <input
                    type="text"
                    value={editingShift.endTime}
                    onChange={e => setEditingShift({ ...editingShift, endTime: e.target.value })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg outline-none text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setEditingShift(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleUpdateShift}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                আপডেট করুন
              </button>
            </div>
          </div>
        )}

        {/* Shifts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {shifts.map(shift => (
            <div
              key={shift.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                shift.isActive
                  ? 'bg-white border-slate-200 shadow-2xs'
                  : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                    {getShiftIcon(shift.shiftType)}
                    <span>{shift.name}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {shift.shiftType}
                  </span>
                </div>
                <div className="mt-2 text-slate-600 font-mono text-[11px] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{shift.startTime} - {shift.endTime}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleShiftActive(shift.id)}
                  className="flex items-center space-x-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {shift.isActive ? (
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
                    onClick={() => setEditingShift(shift)}
                    className="p-1 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-md transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteShift(shift.id)}
                    className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: DAY PATTERNS / SCHEDULE ROUTINES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>ক্লাস রুটিন ও ডে প্যাটার্ন সমূহ ({dayPatterns.length})</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              সপ্তাহের কোন কোন দিন ক্লাস অনুষ্ঠিত হবে তার নির্ধারিত রুটিন ফরম্যাট।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingPattern(true)}
            className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন ডে প্যাটার্ন যোগ করুন</span>
          </button>
        </div>

        {/* Add Pattern Inline Form */}
        {isAddingPattern && (
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">নতুন ডে প্যাটার্ন তথ্য</span>
              <button
                type="button"
                onClick={() => setIsAddingPattern(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">প্যাটার্নের নাম</label>
                <input
                  type="text"
                  value={newPatternData.name}
                  onChange={e => setNewPatternData({ ...newPatternData, name: e.target.value })}
                  placeholder="e.g. সোম-বুধ-শুক্রবার (Mon-Wed-Fri)"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">শর্ট কোড</label>
                <input
                  type="text"
                  value={newPatternData.shortCode}
                  onChange={e => setNewPatternData({ ...newPatternData, shortCode: e.target.value })}
                  placeholder="e.g. MWF"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-600 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 block">সপ্তাহের দিনসমূহ নির্বাচন করুন:</label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map(day => {
                  const isChecked = newPatternData.days.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => {
                        const updatedDays = isChecked
                          ? newPatternData.days.filter(d => d !== day)
                          : [...newPatternData.days, day];
                        setNewPatternData({ ...newPatternData, days: updatedDays });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        isChecked
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingPattern(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleCreatePattern}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                যোগ করুন
              </button>
            </div>
          </div>
        )}

        {/* Day Patterns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {dayPatterns.map(pattern => (
            <div
              key={pattern.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                pattern.isActive
                  ? 'bg-white border-slate-200 shadow-2xs'
                  : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    {pattern.name}
                  </span>
                  {pattern.shortCode && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {pattern.shortCode}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {pattern.days.map(d => (
                    <span
                      key={d}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => togglePatternActive(pattern.id)}
                  className="flex items-center space-x-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {pattern.isActive ? (
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

                <button
                  type="button"
                  onClick={() => deletePattern(pattern.id)}
                  className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
