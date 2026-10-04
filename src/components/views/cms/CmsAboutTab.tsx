import React, { useState, useRef, useEffect } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { AboutHeroCmsConfig, AboutHeroCmsStat } from '../../../types';
import { INITIAL_WEBSITE_CMS_CONFIG } from '../../../data/websiteSeedData';
import { Save, Info, UserCheck, ShieldCheck, Monitor, Award, Plus, Trash2, Crop, Upload, Image as ImageIcon, Sparkles, X, BarChart3, Building } from 'lucide-react';
import { ImageUploadCropModal } from '../../common/ImageUploadCropModal';
import { compressLogoOrAvatar } from '../../../utils/imageCompressor';

interface CmsAboutTabProps {
  onSuccessToast: (msg: string) => void;
}

export const CmsAboutTab: React.FC<CmsAboutTabProps> = ({ onSuccessToast }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig } = useAcademy();
  const hasUserEditedRef = useRef(false);

  // Homepage About Hero & Stats Configuration
  const [aboutHero, setAboutHero] = useState<AboutHeroCmsConfig>(
    websiteCmsConfig.aboutHeroConfig || INITIAL_WEBSITE_CMS_CONFIG.aboutHeroConfig || {
      tagline: 'Trusted for 12 Years',
      headline: 'From Beginner to IT Professionals We Close That Gap.',
      description:
        'For 12 years, NexGen Computer Academy has had one goal — turn ordinary people into extraordinary IT professionals. Technology is no longer just for engineers and computer scientists. Today every business, every industry, and every career path runs on digital skills.',
      labBadgeText: 'Modern AC Lab • Farmgate Campus',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
      stats: [
        { id: 'st-1', value: '20000 +', label: 'Successful Students', color: 'purple' },
        { id: 'st-2', value: '9000 +', label: 'Expert Freelancers', color: 'red' },
        { id: 'st-3', value: '2000 +', label: 'Skilled Job Holders', color: 'purple' },
        { id: 'st-4', value: '5000 +', label: 'Industry Expert', color: 'red' },
        { id: 'st-5', value: '95 %', label: 'Success Ratio', color: 'purple' },
        { id: 'st-6', value: '100 +', label: 'Companies', color: 'red' }
      ]
    }
  );

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

  // Background cloud sync when not actively editing
  useEffect(() => {
    if (hasUserEditedRef.current) return;
    if (websiteCmsConfig.aboutUs) {
      setFormData({
        storyTitle: websiteCmsConfig.aboutUs.storyTitle || '',
        storyDescription: websiteCmsConfig.aboutUs.storyDescription || '',
        mission: websiteCmsConfig.aboutUs.mission || '',
        vision: websiteCmsConfig.aboutUs.vision || '',
        directorMessage: websiteCmsConfig.aboutUs.directorMessage || '',
        directorName: websiteCmsConfig.aboutUs.directorName || '',
        directorTitle: websiteCmsConfig.aboutUs.directorTitle || '',
        directorPhotoUrl: websiteCmsConfig.aboutUs.directorPhotoUrl || '',
        establishedYear: websiteCmsConfig.aboutUs.establishedYear || '2019',
        affiliations: websiteCmsConfig.aboutUs.affiliations || [],
        facilityHighlights: websiteCmsConfig.aboutUs.facilityHighlights || []
      });
    }
  }, [websiteCmsConfig.aboutUs]);

  const updateFormField = (fields: Partial<typeof formData>) => {
    hasUserEditedRef.current = true;
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const [affiliationInput, setAffiliationInput] = useState('');
  const [facilityTitle, setFacilityTitle] = useState('');
  const [facilityDesc, setFacilityDesc] = useState('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDirectorFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    hasUserEditedRef.current = true;
    try {
      // Compress to max 600px square, 80% quality (~40KB size)
      const compressed = await compressLogoOrAvatar(file, 600);
      setFormData(prev => ({ ...prev, directorPhotoUrl: compressed }));
      onSuccessToast('Director photo uploaded & optimized! You can now adjust or crop.');
    } catch {
      // Fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFormData(prev => ({ ...prev, directorPhotoUrl: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAffiliation = () => {
    if (!affiliationInput.trim()) return;
    hasUserEditedRef.current = true;
    setFormData(prev => ({
      ...prev,
      affiliations: [...prev.affiliations, affiliationInput.trim()]
    }));
    setAffiliationInput('');
  };

  const handleRemoveAffiliation = (index: number) => {
    hasUserEditedRef.current = true;
    setFormData(prev => ({
      ...prev,
      affiliations: prev.affiliations.filter((_, i) => i !== index)
    }));
  };

  const handleAddFacility = () => {
    if (!facilityTitle.trim()) return;
    hasUserEditedRef.current = true;
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
    hasUserEditedRef.current = true;
    setFormData(prev => ({
      ...prev,
      facilityHighlights: prev.facilityHighlights.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hasUserEditedRef.current = false;
    updateWebsiteCmsConfig({
      aboutUs: formData,
      aboutHeroConfig: aboutHero
    });
    onSuccessToast('About Us, Homepage About Hero & Stats Counters updated successfully!');
  };

  const handleUpdateStat = (index: number, field: keyof AboutHeroCmsStat, val: any) => {
    hasUserEditedRef.current = true;
    setAboutHero(prev => {
      const stats = [...(prev.stats || [])];
      stats[index] = { ...stats[index], [field]: val };
      return { ...prev, stats };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Sticky Quick Save Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-indigo-900/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black shadow-lg shadow-indigo-600/40 text-white shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-sm sm:text-base flex items-center space-x-2">
              <span>About Us, Leadership & Campus Story (পরিচিতি ও মিশন)</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] uppercase font-bold">
                Live Sync
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              হোমপেজ অ্যাবাউট হিরোর ৬টি কাউন্টার, প্রতিষ্ঠানের ইতিহাস, মিশন-ভিশন ও লিডারশিপ বাণী পরিবর্তন করুন।
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save About Us & Stats (সংরক্ষণ করুন)</span>
          </button>
        </div>
      </div>

      {/* 0. HOMEPAGE ABOUT HERO & 6 STATS COUNTERS (হোমপেজ সেকশন #৫) */}
      <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
                Homepage Section #5 • Live Stats & Hero
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2 mt-1">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Homepage About Hero & 6 Stats Counters (হোমপেজ অ্যাবাউট হিরো ও ৬টি কাউন্টার)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              হোমপেজে প্রদর্শিত ১২ বছরের আস্থা, মূল শিরোনাম ও ৬টি সফলতার সংখ্যাসূচক কার্ড কাস্টমাইজ করুন।
            </p>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>কাউন্টার সেভ করুন</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">ট্যাগলাইন (Tagline Badge)</label>
            <input
              type="text"
              value={aboutHero.tagline}
              onChange={e => {
                hasUserEditedRef.current = true;
                setAboutHero({ ...aboutHero, tagline: e.target.value });
              }}
              placeholder="Trusted for 12 Years"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-purple-700"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">ল্যাব ব্যাজ টেক্সট (Lab Badge)</label>
            <input
              type="text"
              value={aboutHero.labBadgeText}
              onChange={e => {
                hasUserEditedRef.current = true;
                setAboutHero({ ...aboutHero, labBadgeText: e.target.value });
              }}
              placeholder="Modern AC Lab • Farmgate Campus"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="font-bold text-slate-800 block">প্রধান শিরোনাম (Headline)</label>
            <input
              type="text"
              value={aboutHero.headline}
              onChange={e => {
                hasUserEditedRef.current = true;
                setAboutHero({ ...aboutHero, headline: e.target.value });
              }}
              placeholder="From Beginner to IT Professionals We Close That Gap."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-sm"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="font-bold text-slate-800 block">বিস্তারিত বিবরণ (Description)</label>
            <textarea
              rows={3}
              value={aboutHero.description}
              onChange={e => {
                hasUserEditedRef.current = true;
                setAboutHero({ ...aboutHero, description: e.target.value });
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-700"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="font-bold text-slate-800 block">ছবি লিংক (Image URL)</label>
            <input
              type="text"
              value={aboutHero.imageUrl}
              onChange={e => {
                hasUserEditedRef.current = true;
                setAboutHero({ ...aboutHero, imageUrl: e.target.value });
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-600"
            />
          </div>
        </div>

        {/* 6 Stats Counters Grid */}
        <div className="space-y-3 pt-2">
          <label className="font-bold text-xs text-slate-900 block">
            ৬টি পরিসংখ্যান কাউন্টার কার্ড (6 Statistics Counter Cards):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {aboutHero.stats.map((st, idx) => (
              <div
                key={st.id || `stat-${idx}`}
                className={`p-3 rounded-2xl border ${
                  st.color === 'red' ? 'bg-rose-50/70 border-rose-200' : 'bg-purple-50/70 border-purple-200'
                } space-y-2`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className={st.color === 'red' ? 'text-rose-700' : 'text-purple-700'}>
                    কাউন্টার #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpdateStat(idx, 'color', st.color === 'red' ? 'purple' : 'red')}
                    className="px-2 py-0.5 rounded-md bg-white border text-[10px] font-bold cursor-pointer"
                  >
                    কালার: {st.color === 'red' ? 'লাল' : 'পার্পল'}
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">সংখ্যা / ভ্যালু</label>
                  <input
                    type="text"
                    value={st.value}
                    onChange={e => handleUpdateStat(idx, 'value', e.target.value)}
                    placeholder="20000 +"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl font-black text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">লেবেল / বর্ণনা</label>
                  <input
                    type="text"
                    value={st.label}
                    onChange={e => handleUpdateStat(idx, 'label', e.target.value)}
                    placeholder="Successful Students"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
              onChange={e => updateFormField({ storyTitle: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Established Year</label>
            <input
              type="text"
              value={formData.establishedYear}
              onChange={e => updateFormField({ establishedYear: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center font-bold"
            />
          </div>

          <div className="md:col-span-3">
            <label className="font-bold text-slate-700 block mb-1">Our Story & Background Description</label>
            <textarea
              rows={3}
              value={formData.storyDescription}
              onChange={e => updateFormField({ storyDescription: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
            />
          </div>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mission Statement 🎯</label>
              <textarea
                rows={3}
                value={formData.mission}
                onChange={e => updateFormField({ mission: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Vision Statement 🔭</label>
              <textarea
                rows={3}
                value={formData.vision}
                onChange={e => updateFormField({ vision: e.target.value })}
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
              onChange={e => updateFormField({ directorName: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Designation / Title</label>
            <input
              type="text"
              value={formData.directorTitle}
              onChange={e => updateFormField({ directorTitle: e.target.value })}
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
                {formData.directorPhotoUrl?.startsWith('data:image') ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <span className="font-bold text-emerald-800 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Local Photo Uploaded & Auto-Compressed (Lightweight)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => updateFormField({ directorPhotoUrl: '' })}
                      className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50"
                      title="Remove Photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.directorPhotoUrl}
                    onChange={e => updateFormField({ directorPhotoUrl: e.target.value })}
                    placeholder="https://... (Web Image URL or Upload below)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleDirectorFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Upload from PC / Mobile</span>
                  </button>

                  {formData.directorPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setIsCropModalOpen(true)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl flex items-center space-x-1.5"
                    >
                      <Crop className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Crop & Adjust</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Director's Message to Students & Parents</label>
            <textarea
              rows={4}
              value={formData.directorMessage}
              onChange={e => updateFormField({ directorMessage: e.target.value })}
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
