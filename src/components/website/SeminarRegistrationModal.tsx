import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { X, Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle2, Video, Sparkles, Send } from 'lucide-react';
import { SeminarWorkshop } from '../../types';
import {
  trackMetaPixelEvent,
  getCapturedUtmParams,
  getDeviceType
} from '../../utils/analyticsTracker';

interface SeminarRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  seminar: SeminarWorkshop | null;
}

export const SeminarRegistrationModal: React.FC<SeminarRegistrationModalProps> = ({
  isOpen,
  onClose,
  seminar
}) => {
  const { addLead, registerLeadToSeminar } = useAcademy();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('Student');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !seminar) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please enter your full name and contact mobile number.');
      return;
    }

    try {
      const todayDate = new Date().toISOString().split('T')[0];
      const utms = getCapturedUtmParams();
      const device = getDeviceType();

      const newLead = addLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        occupation: occupation as any,
        educationLevel: 'Graduate / Student',
        interestedCourseId: seminar.courseId || '',
        leadSource: utms.utmSource ? `Ad: ${utms.utmSource}` : 'Campus Seminar / Workshop',
        campaignId: utms.utmCampaign,
        utmSource: utms.utmSource,
        utmMedium: utms.utmMedium,
        utmCampaign: utms.utmCampaign,
        utmContent: utms.utmContent,
        utmTerm: utms.utmTerm,
        deviceType: device,
        locationCity: 'Dhaka',
        counselorId: 'counselor-01',
        counselorName: 'Seminar Coordinator',
        visitDate: seminar.date || todayDate,
        firstContactDate: todayDate,
        status: 'Demo Attended',
        comments: `Free Seminar Registration: "${seminar.title}" on ${seminar.date} at ${seminar.time}. Occ: ${occupation}. Campaign: ${utms.utmCampaign || 'organic'}`
      });

      registerLeadToSeminar(seminar.id, newLead.id);

      trackMetaPixelEvent('Lead', {
        content_name: seminar.title,
        content_category: 'Free Workshop / Seminar',
        utm_source: utms.utmSource,
        utm_campaign: utms.utmCampaign
      });

      setIsSuccess(true);
      setError('');
    } catch (err) {
      setError('Failed to complete registration. Please contact hotline 01798444444.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 text-slate-800 my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Free Seminar Registration
              </h3>
              <p className="text-xs text-slate-500">Book your seat & get free entry pass</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Seat Confirmed!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Thank you, <strong>{name}</strong>! Your seat for <strong>{seminar.title}</strong> on <strong>{seminar.date}</strong> is reserved. An SMS confirmation will be sent to <strong>{phone}</strong>.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {error && (
              <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-medium border border-rose-200">
                {error}
              </div>
            )}

            {/* Seminar Preview Banner */}
            <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full inline-block">
                {seminar.type || 'Free Career Seminar'}
              </span>
              <h4 className="font-black text-slate-900 text-sm">{seminar.title}</h4>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pt-1">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{seminar.date}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{seminar.time}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{seminar.roomOrPlatform || 'Farmgate Seminar Hall 1 & Zoom Live'}</span>
                </span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tanvir Ahmed"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Active Mobile Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 01711223344"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Occupation</label>
                <select
                  value={occupation}
                  onChange={e => setOccupation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                >
                  <option value="Student">Student</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Professional">Professional</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Free Seat Reservation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
