import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { AcademicCalendarConfig, AcademicHoliday } from '../../types';
import { DEFAULT_ACADEMIC_CALENDAR } from '../../data/defaultSettingsData';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Save,
  RotateCcw,
  Sun,
  Coffee,
  Check,
  X,
  Sparkles,
  Info
} from 'lucide-react';

const ALL_WEEKDAYS = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] as const;

export const AcademicCalendarHolidayManager: React.FC = () => {
  const { academySettings, updateAcademySettings } = useAcademy();

  const currentCalendar: AcademicCalendarConfig =
    academySettings.academicCalendar || DEFAULT_ACADEMIC_CALENDAR;

  const [weekendDays, setWeekendDays] = useState<('Friday' | 'Saturday' | 'Sunday')[]>(
    currentCalendar.weekendDays || ['Friday', 'Saturday']
  );
  const [academicYear, setAcademicYear] = useState<string>(currentCalendar.academicYear || '2026');
  const [holidays, setHolidays] = useState<AcademicHoliday[]>(
    currentCalendar.holidays || DEFAULT_ACADEMIC_CALENDAR.holidays
  );
  const [savedToast, setSavedToast] = useState(false);

  // Add holiday form state
  const [isAdding, setIsAdding] = useState(false);
  const [newHoliday, setNewHoliday] = useState<Omit<AcademicHoliday, 'id'>>({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    holidayType: 'Government',
    affectsClasses: true,
    notes: ''
  });

  // Edit holiday state
  const [editingHoliday, setEditingHoliday] = useState<AcademicHoliday | null>(null);

  const handleSaveAll = (updatedHolidays = holidays, updatedWeekends = weekendDays, year = academicYear) => {
    updateAcademySettings({
      academicCalendar: {
        weekendDays: updatedWeekends,
        academicYear: year,
        holidays: updatedHolidays
      }
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('আপনি কি ডিফল্ট অ্যাকাডেমিক ক্যালেন্ডার ও ছুটির তালিকায় ফিরে যেতে চান?')) {
      setWeekendDays(DEFAULT_ACADEMIC_CALENDAR.weekendDays);
      setAcademicYear(DEFAULT_ACADEMIC_CALENDAR.academicYear);
      setHolidays(DEFAULT_ACADEMIC_CALENDAR.holidays);
      handleSaveAll(
        DEFAULT_ACADEMIC_CALENDAR.holidays,
        DEFAULT_ACADEMIC_CALENDAR.weekendDays,
        DEFAULT_ACADEMIC_CALENDAR.academicYear
      );
    }
  };

  const toggleWeekend = (day: 'Friday' | 'Saturday' | 'Sunday') => {
    const updated = weekendDays.includes(day)
      ? weekendDays.filter(d => d !== day)
      : [...weekendDays, day];
    setWeekendDays(updated);
    handleSaveAll(holidays, updated, academicYear);
  };

  const deleteHoliday = (id: string) => {
    if (window.confirm('এই ছুটিটি তালিকা থেকে মুছে ফেলতে চান?')) {
      const updated = holidays.filter(h => h.id !== id);
      setHolidays(updated);
      handleSaveAll(updated, weekendDays, academicYear);
    }
  };

  const handleCreateHoliday = () => {
    if (!newHoliday.name.trim() || !newHoliday.startDate) return;
    const holiday: AcademicHoliday = {
      ...newHoliday,
      endDate: newHoliday.endDate || newHoliday.startDate,
      id: `hol-${Date.now()}`
    };
    const updated = [...holidays, holiday].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    setHolidays(updated);
    setIsAdding(false);
    setNewHoliday({
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      holidayType: 'Government',
      affectsClasses: true,
      notes: ''
    });
    handleSaveAll(updated, weekendDays, academicYear);
  };

  const handleUpdateHoliday = () => {
    if (!editingHoliday || !editingHoliday.name.trim() || !editingHoliday.startDate) return;
    const updated = holidays
      .map(h => (h.id === editingHoliday.id ? editingHoliday : h))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    setHolidays(updated);
    setEditingHoliday(null);
    handleSaveAll(updated, weekendDays, academicYear);
  };

  const getHolidayTypeBadge = (type: AcademicHoliday['holidayType']) => {
    switch (type) {
      case 'Government':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Religious':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Academic Break':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Institutional':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-black tracking-wide">
              অ্যাকাডেমিক ক্যালেন্ডার ও সাপ্তাহিক ছুটি ম্যানেজার
            </h3>
            <span className="text-[11px] bg-sky-500/30 text-sky-200 font-bold px-2 py-0.5 rounded-full border border-sky-400/30">
              Calendar & Holidays
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            জাতীয় সাধারণ ছুটি, ধর্মীয় উৎসব ও অ্যাকাডেমিক ছুটির তালিকা পরিচালনা করুন। ব্যাচের ক্লাস ক্যালেন্ডার ও উপস্থিতি ট্র্যাকিংয়ে এটি কার্যকর হবে।
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
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-2xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>অ্যাকাডেমিক ক্যালেন্ডার ও ছুটির সেটিংস সফলভাবে আপডেট হয়েছে!</span>
        </div>
      )}

      {/* SECTION 1: WEEKEND DAYS & YEAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
          <Coffee className="w-4 h-4 text-sky-600" />
          <span>সাপ্তাহিক নিয়মিত ছুটি ও অ্যাকাডেমিক বর্ষ</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">
              সাপ্তাহিক ছুটির দিনসমূহ (Weekly Weekends):
            </label>
            <div className="flex flex-wrap gap-2.5">
              {(['Friday', 'Saturday', 'Sunday'] as const).map(day => {
                const isSelected = weekendDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleWeekend(day)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{day === 'Friday' ? 'শুক্রবার (Friday)' : day === 'Saturday' ? 'শনিবার (Saturday)' : 'রবিবার (Sunday)'}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500">
              নির্বাচিত দিনগুলো উপস্থিতি ও রুটিনে স্বয়ংক্রিয়ভাবে উইকেন্ড হিসেবে চিহ্নিত থাকবে।
            </p>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">
              বর্তমান অ্যাকাডেমিক শিক্ষাবর্ষ (Academic Year):
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={e => {
                setAcademicYear(e.target.value);
                handleSaveAll(holidays, weekendDays, e.target.value);
              }}
              className="w-48 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs focus:bg-white focus:border-sky-600 outline-none"
              placeholder="2026"
            />
            <p className="text-[11px] text-slate-500">
              সকল রিপোর্ট, ক্যালেন্ডার এবং ভর্তি রেজিস্ট্রেশনের সেশন বর্ষ।
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: HOLIDAYS LIST & ADD FORM */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>বাৎসরিক ছুটির তালিকা ({holidays.length})</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              সরকারি, ধর্মীয় এবং প্রতিষ্ঠানের বিশেষ অবকাশসমূহ।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন ছুটি যোগ করুন</span>
          </button>
        </div>

        {/* Add Holiday Form */}
        {isAdding && (
          <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900">নতুন ছুটির বিবরণ দিন</span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">ছুটির নাম</label>
                <input
                  type="text"
                  value={newHoliday.name}
                  onChange={e => setNewHoliday({ ...newHoliday, name: e.target.value })}
                  placeholder="e.g. বাংলা নববর্ষ (পহেলা বৈশাখ)"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-sky-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ছুটির ধরন</label>
                <select
                  value={newHoliday.holidayType}
                  onChange={e => setNewHoliday({ ...newHoliday, holidayType: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-sky-600"
                >
                  <option value="Government">Government Holiday</option>
                  <option value="Religious">Religious Holiday</option>
                  <option value="Institutional">Institutional Holiday</option>
                  <option value="Academic Break">Academic Break</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newHoliday.affectsClasses}
                    onChange={e => setNewHoliday({ ...newHoliday, affectsClasses: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>ক্লাস বন্ধ থাকবে</span>
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">শুরুর তারিখ</label>
                <input
                  type="date"
                  value={newHoliday.startDate}
                  onChange={e => setNewHoliday({ ...newHoliday, startDate: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">শেষের তারিখ (একই হলে খালি রাখুন)</label>
                <input
                  type="date"
                  value={newHoliday.endDate}
                  onChange={e => setNewHoliday({ ...newHoliday, endDate: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">মন্তব্য / বিবরণ</label>
                <input
                  type="text"
                  value={newHoliday.notes || ''}
                  onChange={e => setNewHoliday({ ...newHoliday, notes: e.target.value })}
                  placeholder="e.g. জাতীয় সাধারণ ছুটি উপলক্ষে প্রতিষ্ঠান বন্ধ থাকবে"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleCreateHoliday}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                যুক্ত করুন
              </button>
            </div>
          </div>
        )}

        {/* Edit Holiday Inline */}
        {editingHoliday && (
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">ছুটির তথ্য পরিবর্তন করুন</span>
              <button
                type="button"
                onClick={() => setEditingHoliday(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">ছুটির নাম</label>
                <input
                  type="text"
                  value={editingHoliday.name}
                  onChange={e => setEditingHoliday({ ...editingHoliday, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ছুটির ধরন</label>
                <select
                  value={editingHoliday.holidayType}
                  onChange={e => setEditingHoliday({ ...editingHoliday, holidayType: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                >
                  <option value="Government">Government Holiday</option>
                  <option value="Religious">Religious Holiday</option>
                  <option value="Institutional">Institutional Holiday</option>
                  <option value="Academic Break">Academic Break</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingHoliday.affectsClasses}
                    onChange={e => setEditingHoliday({ ...editingHoliday, affectsClasses: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>ক্লাস বন্ধ থাকবে</span>
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">শুরুর তারিখ</label>
                <input
                  type="date"
                  value={editingHoliday.startDate}
                  onChange={e => setEditingHoliday({ ...editingHoliday, startDate: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">শেষের তারিখ</label>
                <input
                  type="date"
                  value={editingHoliday.endDate}
                  onChange={e => setEditingHoliday({ ...editingHoliday, endDate: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">মন্তব্য</label>
                <input
                  type="text"
                  value={editingHoliday.notes || ''}
                  onChange={e => setEditingHoliday({ ...editingHoliday, notes: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setEditingHoliday(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleUpdateHoliday}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                আপডেট করুন
              </button>
            </div>
          </div>
        )}

        {/* Holidays Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-2.5 px-3">তারিখ</th>
                <th className="py-2.5 px-3">ছুটির নাম ও বিবরণ</th>
                <th className="py-2.5 px-3">ক্যাটাগরি</th>
                <th className="py-2.5 px-3">ক্লাস প্রভাব</th>
                <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {holidays.map(h => (
                <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                    {h.startDate}
                    {h.endDate && h.endDate !== h.startDate ? ` হতে ${h.endDate}` : ''}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{h.name}</div>
                    {h.notes && <div className="text-[11px] text-slate-500 mt-0.5">{h.notes}</div>}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getHolidayTypeBadge(h.holidayType)}`}>
                      {h.holidayType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {h.affectsClasses ? (
                      <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                        ক্লাস স্থগিত
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-500">
                        ক্লাস চলবে
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        type="button"
                        onClick={() => setEditingHoliday(h)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteHoliday(h.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
