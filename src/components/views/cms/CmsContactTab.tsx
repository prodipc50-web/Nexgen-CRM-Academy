import React, { useState } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { PhoneContactItem, EmailContactItem } from '../../../types';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Navigation,
  Plus,
  Trash2,
  Save,
  MessageSquare,
  Flame,
  Globe
} from 'lucide-react';

interface CmsContactTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsContactTab: React.FC<CmsContactTabProps> = ({ onSuccessToast }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig, academySettings } = useAcademy();

  const [multiplePhones, setMultiplePhones] = useState<PhoneContactItem[]>(() => {
    if (websiteCmsConfig.multiplePhones && websiteCmsConfig.multiplePhones.length > 0) {
      return websiteCmsConfig.multiplePhones.map((p, idx) => ({
        ...p,
        id: p.id || `phone-${idx}-${Date.now()}`
      }));
    }
    return [
      { id: 'ph-1', label: 'Admission Hotline', number: '01798444444', isHotline: true, isWhatsapp: true },
      { id: 'ph-2', label: 'Student Support Desk', number: '+880 1711-223344', isHotline: false, isWhatsapp: true },
      { id: 'ph-3', label: 'Exam & Certificate Cell', number: '+880 1811-556677', isHotline: false, isWhatsapp: false }
    ];
  });

  const [multipleEmails, setMultipleEmails] = useState<EmailContactItem[]>(() => {
    if (websiteCmsConfig.multipleEmails && websiteCmsConfig.multipleEmails.length > 0) {
      return websiteCmsConfig.multipleEmails.map((e, idx) => ({
        ...e,
        id: e.id || `email-${idx}-${Date.now()}`
      }));
    }
    return [
      { id: 'em-1', label: 'Admission & Registration', email: 'admissions@nexgenacademy.edu.bd' },
      { id: 'em-2', label: 'General Inquiry & Support', email: 'info@nexgenacademy.edu.bd' },
      { id: 'em-3', label: 'Corporate Training & Hiring', email: 'corporate@nexgenacademy.edu.bd' }
    ];
  });

  const [address, setAddress] = useState(
    websiteCmsConfig.officeAddress || academySettings.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215, Bangladesh'
  );
  const [directions, setDirections] = useState(
    websiteCmsConfig.campusDirections || 'Located 2 minutes walk from Farmgate Metro Station (Exit 3), opposite to Green Super Market.'
  );
  const [officeHours, setOfficeHours] = useState(
    websiteCmsConfig.officeHours || 'Saturday to Friday: 9:00 AM - 8:30 PM'
  );
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState(
    websiteCmsConfig.googleMapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848881261358!2d90.3887!3d23.7527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ1JzA5LjciTiA5MMKwMjMnMTkuMyJF!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd'
  );

  // New Phone state
  const [newPhone, setNewPhone] = useState({
    label: '',
    number: '',
    isHotline: false,
    isWhatsapp: false
  });

  // New Email state
  const [newEmail, setNewEmail] = useState({
    label: '',
    email: ''
  });

  const handleAddPhone = () => {
    if (!newPhone.number.trim()) return;
    const item: PhoneContactItem = {
      id: `ph-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      label: newPhone.label.trim() || 'General Inquiry',
      number: newPhone.number.trim(),
      isHotline: newPhone.isHotline,
      isWhatsapp: newPhone.isWhatsapp
    };
    setMultiplePhones(prev => [...prev, item]);
    setNewPhone({ label: '', number: '', isHotline: false, isWhatsapp: false });
  };

  const handleRemovePhone = (indexToRemove: number) => {
    setMultiplePhones(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpdatePhone = (indexToUpdate: number, field: keyof PhoneContactItem, value: any) => {
    setMultiplePhones(prev =>
      prev.map((p, idx) => (idx === indexToUpdate ? { ...p, [field]: value } : p))
    );
  };

  const handleAddEmail = () => {
    if (!newEmail.email.trim()) return;
    const item: EmailContactItem = {
      id: `em-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      label: newEmail.label.trim() || 'General Support',
      email: newEmail.email.trim()
    };
    setMultipleEmails(prev => [...prev, item]);
    setNewEmail({ label: '', email: '' });
  };

  const handleRemoveEmail = (indexToRemove: number) => {
    setMultipleEmails(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpdateEmail = (indexToUpdate: number, field: keyof EmailContactItem, value: any) => {
    setMultipleEmails(prev =>
      prev.map((e, idx) => (idx === indexToUpdate ? { ...e, [field]: value } : e))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteCmsConfig({
      officeAddress: address,
      campusDirections: directions,
      officeHours: officeHours,
      googleMapEmbedUrl: mapsEmbedUrl,
      multiplePhones: multiplePhones,
      multipleEmails: multipleEmails
    });
    onSuccessToast('Multiple phone numbers, emails, and address saved to website!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Multiple Phone Numbers Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm">
            <Phone className="w-4 h-4 text-indigo-600" />
            <span>Multiple Phone Numbers & Support Hotlines (মাল্টিপল ফোন নাম্বার)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {multiplePhones.length} Numbers Configured
          </span>
        </div>

        {/* Existing Numbers */}
        <div className="space-y-2.5">
          {multiplePhones.map((phone, idx) => (
            <div
              key={phone.id || `phone-row-${idx}`}
              className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Label / Department</label>
                  <input
                    type="text"
                    value={phone.label}
                    onChange={e => handleUpdatePhone(idx, 'label', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Phone Number</label>
                  <input
                    type="text"
                    value={phone.number}
                    onChange={e => handleUpdatePhone(idx, 'number', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div className="flex items-center space-x-4 pt-4">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={phone.isHotline}
                      onChange={e => handleUpdatePhone(idx, 'isHotline', e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-bold text-rose-600 flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Hotline Badge</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={phone.isWhatsapp}
                      onChange={e => handleUpdatePhone(idx, 'isWhatsapp', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-emerald-600 flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemovePhone(idx)}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl self-end md:self-center"
                title="Remove Number"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Phone */}
        <div className="p-4 bg-indigo-50/50 border border-dashed border-indigo-200 rounded-2xl space-y-3">
          <h4 className="font-bold text-indigo-950 text-xs">Add Another Phone Number</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
            <input
              type="text"
              placeholder="Label (e.g. Admission Desk 2)"
              value={newPhone.label}
              onChange={e => setNewPhone({ ...newPhone, label: e.target.value })}
              className="p-2 bg-white border border-slate-200 rounded-xl"
            />
            <input
              type="text"
              placeholder="Number (e.g. 01798444444)"
              value={newPhone.number}
              onChange={e => setNewPhone({ ...newPhone, number: e.target.value })}
              className="p-2 bg-white border border-slate-200 rounded-xl font-mono"
            />
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPhone.isHotline}
                  onChange={e => setNewPhone({ ...newPhone, isHotline: e.target.checked })}
                  className="rounded text-rose-600"
                />
                <span className="text-[11px] font-bold text-rose-600">Hotline</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPhone.isWhatsapp}
                  onChange={e => setNewPhone({ ...newPhone, isWhatsapp: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span className="text-[11px] font-bold text-emerald-600">WhatsApp</span>
              </label>
            </div>
            <button
              type="button"
              onClick={handleAddPhone}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Number</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multiple Email Inboxes */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm">
            <Mail className="w-4 h-4 text-indigo-600" />
            <span>Multiple Department Email Inboxes (ইমেইল অ্যাড্রেস)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {multipleEmails.length} Inboxes Configured
          </span>
        </div>

        <div className="space-y-2.5">
          {multipleEmails.map((email, idx) => (
            <div
              key={email.id || `email-row-${idx}`}
              className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Department / Purpose</label>
                  <input
                    type="text"
                    value={email.label}
                    onChange={e => handleUpdateEmail(idx, 'label', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Email Address</label>
                  <input
                    type="email"
                    value={email.email}
                    onChange={e => handleUpdateEmail(idx, 'email', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveEmail(idx)}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl"
                title="Remove Email"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Email */}
        <div className="p-4 bg-indigo-50/50 border border-dashed border-indigo-200 rounded-2xl space-y-3">
          <h4 className="font-bold text-indigo-950 text-xs">Add Department Email</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              placeholder="Department (e.g. Student Verification)"
              value={newEmail.label}
              onChange={e => setNewEmail({ ...newEmail, label: e.target.value })}
              className="p-2 bg-white border border-slate-200 rounded-xl"
            />
            <input
              type="email"
              placeholder="email@nexgenacademy.edu.bd"
              value={newEmail.email}
              onChange={e => setNewEmail({ ...newEmail, email: e.target.value })}
              className="p-2 bg-white border border-slate-200 rounded-xl font-mono"
            />
            <button
              type="button"
              onClick={handleAddEmail}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Email Inbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Address & Google Maps Embed */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm pb-2 border-b border-slate-100">
          <MapPin className="w-4 h-4 text-indigo-600" />
          <span>Physical Campus Address & Google Maps Integration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Campus Address *</label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Campus Landmark & Walking Directions</label>
            <textarea
              rows={2}
              value={directions}
              onChange={e => setDirections(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Campus Visiting & Office Hours</label>
            <input
              type="text"
              value={officeHours}
              onChange={e => setOfficeHours(e.target.value)}
              placeholder="e.g. Saturday - Friday: 9:00 AM - 8:30 PM"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Google Maps Iframe Embed URL</label>
            <input
              type="text"
              value={mapsEmbedUrl}
              onChange={e => setMapsEmbedUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all hover:scale-[1.02]"
        >
          <Save className="w-4 h-4" />
          <span>Save Contact, Numbers & Map Settings</span>
        </button>
      </div>
    </form>
  );
};
