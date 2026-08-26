import React, { useState, useRef } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { Save, Info, UserCheck, ShieldCheck, Monitor, Award, Plus, Trash2, Crop, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { ImageUploadCropModal } from '../../common/ImageUploadCropModal';

interface CmsAboutTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsAboutTab: React.FC<CmsAboutTabProps> = ({ onSuccessToast }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig } = useAcademy();

  const about = websiteCmsConfig.aboutUs || {
    storyTitle: 'Pioneering Industry-Aligned IT Education in Bangladesh',
    storyDescription: 'Founded with a vision to bridge the skill gap between academia and global technology demands, NexGen Coding Academy provides rigorous, hands-on training led by senior industry engineers and architects.',
    mission: 'Empowering students and job-seekers with production-grade coding skills, personalized mentorship, and career placement support.',
    vision: 'To be South Asia’s most trusted center of excellence for modern software engineering and creative digital skills.',
    directorMessage: 'Welcome to NexGen Academy. Our commitment is simple: no theoretical fluff, just real-world engineering and practical projects that prepare you for the global job market.',
    directorName: 'Engr. Tanvir Ahmed',
    directorTitle: 'Founder & Managing Director (Ex-Lead Architect)',
    directorPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    establishedYear: '2019',
    affiliations: ['Govt. BTEB Affiliated Partner', 'BASIS Member Academy', 'ISO 9001:2015 Certified'],
    facilityHighlights: [
      { title: 'Gigabit Network', desc: 'High-speed Dedicated Fiber Gigabit Network', icon: 'zap' },
      { title: 'Dual Workstations', desc: 'Individual Dual-Monitor Workstations', icon: 'monitor' },
      { title: 'Cloud Sandbox', desc: '24/7 Smart Lab Access & Cloud Sandbox', icon: 'cloud' },
      { title: 'Multimedia Halls', desc: 'Air Conditioned Multimedia Seminar Halls', icon: 'speaker' }
    ]
  };

  const [formData, setFormData] = useState({
    storyTitle: about.storyTitle || '',
    storyDescription: about.storyDescription || '',
    mission: about.mission || '',
    vision: about.vision || '',
    directorMessage: about.directorMessage || '',
    directorName: about.directorName || '',
    directorTitle: about.directorTitle || '',
    directorPhotoUrl: about.directorPhotoUrl || '',
    establishedYear: about.establishedYear || '2019',
    affiliations: about.affiliations || [],
    facilityHighlights: about.facilityHighlights || []
  });

  const [affiliationInput, setAffiliationInput] = useState('');
  const [facilityTitle, setFacilityTitle] = useState('');
  const [facilityDesc, setFacilityDesc] = useState('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDirectorFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData(prev => ({ ...prev, directorPhotoUrl: dataUrl }));
      onSuccessToast('Director photo uploaded! You can now adjust or crop.');
    };
    reader.readAsDataURL(file);
  };

  const handleAddAffiliation = () => {
    if (!affiliationInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      affiliations: [...prev.affiliations, affiliationInput.trim()]
    }));
    setAffiliationInput('');
  };

  const handleRemoveAffiliation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      affiliations: prev.affiliations.filter((_, i) => i !== index)
    }));
  };

  const handleAddFacility = () => {
    if (!facilityTitle.trim()) return;
    setFormData(prev => ({
      ...prev,
      facilityHighlights: [
        ...prev.facilityHighlights,
        { title: facilityTitle.trim(), desc: facilityDesc.trim() || facilityTitle.trim(), icon: 'monitor' }
      ]
    }));
    setFacilityTitle('');
    setFacilityDesc('');
  };

  const handleRemoveFacility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      facilityHighlights: prev.facilityHighlights.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteCmsConfig({
      aboutUs: formData
    });
    onSuccessToast('About Us & Leadership section updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Academy Story & Founding */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm pb-2 border-b border-slate-100">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Our Story, Mission & Vision</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Story Headline / Title *</label>
            <input
              type="text"
              required
              value={formData.storyTitle}
              onChange={e => setFormData({ ...formData, storyTitle: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Established Year</label>
            <input
              type="text"
              value={formData.establishedYear}
              onChange={e => setFormData({ ...formData, establishedYear: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center font-bold"
            />
          </div>

          <div className="md:col-span-3">
            <label className="font-bold text-slate-700 block mb-1">Our Story & Background Description</label>
            <textarea
              rows={3}
              value={formData.storyDescription}
              onChange={e => setFormData({ ...formData, storyDescription: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
            />
          </div>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mission Statement 🎯</label>
              <textarea
                rows={3}
                value={formData.mission}
                onChange={e => setFormData({ ...formData, mission: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Vision Statement 🔭</label>
              <textarea
                rows={3}
                value={formData.vision}
                onChange={e => setFormData({ ...formData, vision: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Leadership & Director */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm pb-2 border-b border-slate-100">
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span>Director's Desk & Leadership Profile</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Director's Full Name</label>
            <input
              type="text"
              value={formData.directorName}
              onChange={e => setFormData({ ...formData, directorName: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Designation / Title</label>
            <input
              type="text"
              value={formData.directorTitle}
              onChange={e => setFormData({ ...formData, directorTitle: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="font-bold text-slate-700 block mb-1">Director's Photo (ম্যানুয়াল আপলোড ও ক্রপ)</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                {formData.directorPhotoUrl ? (
                  <img src={formData.directorPhotoUrl} alt="Director" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <UserCheck className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={formData.directorPhotoUrl}
                  onChange={e => setFormData({ ...formData, directorPhotoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    onChange={handleDirectorFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Upload Local Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCropModalOpen(true)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl flex items-center space-x-1.5"
                  >
                    <Crop className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Crop & Resize Photo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Director's Message to Students & Parents</label>
            <textarea
              rows={4}
              value={formData.directorMessage}
              onChange={e => setFormData({ ...formData, directorMessage: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed italic"
            />
          </div>
        </div>
      </div>

      {/* Affiliations & Certifications */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm pb-2 border-b border-slate-100">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Accreditations, Affiliations & Partner Badges</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex space-x-2">
            <input
              type="text"
              value={affiliationInput}
              onChange={e => setAffiliationInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddAffiliation(); } }}
              placeholder="e.g. BASIS Member Institute, BTEB Approved, ISO 9001:2015"
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <button
              type="button"
              onClick={handleAddAffiliation}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Badge</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {formData.affiliations.map((aff, idx) => (
              <span
                key={`aff-${idx}-${aff}`}
                className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold rounded-xl flex items-center space-x-2 text-xs"
              >
                <span>{aff}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAffiliation(idx)}
                  className="hover:text-rose-600 ml-1 font-black"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Campus Lab Facilities Highlights */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 text-indigo-950 font-black text-sm pb-2 border-b border-slate-100">
          <Monitor className="w-4 h-4 text-indigo-600" />
          <span>Campus Lab Facilities Highlights</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={facilityTitle}
              onChange={e => setFacilityTitle(e.target.value)}
              placeholder="Facility Title (e.g. Dual-Monitor Workstations)"
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            />
            <div className="flex space-x-2">
              <input
                type="text"
                value={facilityDesc}
                onChange={e => setFacilityDesc(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFacility(); } }}
                placeholder="Description / Spec..."
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <button
                type="button"
                onClick={handleAddFacility}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center space-x-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {formData.facilityHighlights.map((fac, idx) => (
              <div
                key={`facility-${idx}-${fac.title}`}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div>
                  <strong className="block text-slate-900">{fac.title}</strong>
                  <span className="text-[11px] text-slate-500">{fac.desc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFacility(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all hover:scale-[1.02]"
        >
          <Save className="w-4 h-4" />
          <span>Save About Us & Leadership Settings</span>
        </button>
      </div>

      <ImageUploadCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        currentImageUrl={formData.directorPhotoUrl}
        onSaveImage={(croppedDataUrl) => {
          setFormData(prev => ({ ...prev, directorPhotoUrl: croppedDataUrl }));
          onSuccessToast('Director profile picture cropped & updated!');
        }}
        title="Crop & Resize Director / Leadership Photo"
        subtitle="Ensure clear framing for founder and director portrait."
        aspectRatio="1:1"
        recommendedSize="Recommended: 600 × 600px (1:1 Square or Circle)"
      />
    </form>
  );
};
