import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { ThemeConfig } from '../../types';
import {
  DEFAULT_THEME_CONFIG,
  THEME_PRESETS,
  ERP_FONT_OPTIONS,
  WEBSITE_HEADING_FONT_OPTIONS,
  WEBSITE_BODY_FONT_OPTIONS,
  POPULAR_COLOR_PALETTES,
  applyThemeToDom
} from '../../data/themePresets';
import {
  Palette,
  Type,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  Eye,
  Laptop,
  Globe,
  Sliders,
  Check,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface ThemeEditorProps {
  onViewPublicWebsite?: () => void;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ onViewPublicWebsite }) => {
  const { academySettings, updateAcademySettings } = useAcademy();

  // Local state for theme form
  const [themeForm, setThemeForm] = useState<ThemeConfig>(() => {
    return academySettings.theme || DEFAULT_THEME_CONFIG;
  });

  const [activeSubTab, setActiveSubTab] = useState<'presets' | 'erp' | 'website' | 'preview'>('presets');
  const [previewMode, setPreviewMode] = useState<'split' | 'erp' | 'website'>('split');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isResetToast, setIsResetToast] = useState(false);

  // Sync with incoming academySettings if it changes remotely
  useEffect(() => {
    if (academySettings.theme) {
      setThemeForm(academySettings.theme);
    }
  }, [academySettings.theme]);

  // Live real-time preview as user tweaks colors and fonts
  const handleThemeChange = (updates: Partial<ThemeConfig>) => {
    setThemeForm(prev => {
      const next = { ...prev, ...updates, activePreset: updates.activePreset ?? 'custom' };
      applyThemeToDom(next);
      return next;
    });
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    const newTheme: ThemeConfig = {
      erpPrimaryColor: preset.erpPrimaryColor,
      erpSecondaryColor: preset.erpSecondaryColor,
      erpFontFamily: preset.erpFontFamily,
      websitePrimaryColor: preset.websitePrimaryColor,
      websiteSecondaryColor: preset.websiteSecondaryColor,
      websiteHeadingFont: preset.websiteHeadingFont,
      websiteBodyFont: preset.websiteBodyFont,
      activePreset: preset.id,
      borderRadius: themeForm.borderRadius || 'rounded-2xl'
    };

    setThemeForm(newTheme);
    applyThemeToDom(newTheme);
  };

  const handleSaveTheme = () => {
    updateAcademySettings({ theme: themeForm });
    applyThemeToDom(themeForm);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3500);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all branding colors and typography to the default Nexgen Royal Indigo theme?')) {
      setThemeForm(DEFAULT_THEME_CONFIG);
      updateAcademySettings({ theme: DEFAULT_THEME_CONFIG });
      applyThemeToDom(DEFAULT_THEME_CONFIG);
      setIsResetToast(true);
      setTimeout(() => setIsResetToast(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert Notification */}
      {isSavedToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">Theme Settings Saved Successfully!</p>
              <p className="text-emerald-700">Brand colors and typography have been published across the ERP portal and public website.</p>
            </div>
          </div>
          <button
            onClick={() => setIsSavedToast(false)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-4 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {isResetToast && (
        <div className="p-4 bg-blue-50 border border-blue-300 rounded-xl text-blue-900 text-xs font-semibold flex items-center space-x-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
          <span>Theme successfully restored to default Royal Indigo & Plus Jakarta Sans typography.</span>
        </div>
      )}

      {/* Header Banner & Save Action Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md transition-colors"
              style={{ backgroundColor: themeForm.erpPrimaryColor }}
            >
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Visual Branding & Theme Engine
                </h3>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-white shadow-xs"
                  style={{ backgroundColor: themeForm.erpPrimaryColor }}
                >
                  {THEME_PRESETS.find(p => p.id === themeForm.activePreset)?.name || 'Custom Theme'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize primary brand colors, typography font families, and visual identity for both the ERP management dashboard and the public student-facing website.
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center space-x-1.5"
              title="Reset to Nexgen default theme"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            {onViewPublicWebsite && (
              <button
                onClick={onViewPublicWebsite}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all flex items-center space-x-1.5 shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>View Website</span>
              </button>
            )}

            <button
              onClick={handleSaveTheme}
              className="px-5 py-2 text-xs font-black text-white rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
              style={{ backgroundColor: themeForm.erpPrimaryColor }}
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Theme</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Navigation Tabs */}
        <div className="flex border-b border-slate-100 mt-6 -mb-1 space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('presets')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeSubTab === 'presets'
                ? 'border-indigo-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Curated Theme Palettes ({THEME_PRESETS.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('erp')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeSubTab === 'erp'
                ? 'border-indigo-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4 text-indigo-600" />
            <span>ERP Portal Branding & Fonts</span>
          </button>

          <button
            onClick={() => setActiveSubTab('website')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeSubTab === 'website'
                ? 'border-indigo-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Public Website Branding & Fonts</span>
          </button>

          <button
            onClick={() => setActiveSubTab('preview')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeSubTab === 'preview'
                ? 'border-indigo-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-4 h-4 text-purple-600" />
            <span>Live Interactive Preview & Testing</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CURATED PALETTES */}
      {activeSubTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-900">Pre-Configured Designer Color & Font Palettes</h4>
              <p className="text-xs text-slate-500">
                Click any palette to immediately apply harmonious brand colors and paired typography across your entire system.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {THEME_PRESETS.map((preset) => {
              const isSelected = themeForm.activePreset === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.id)}
                  className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 relative bg-white hover:shadow-md ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white p-1 rounded-full shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mb-3">
                    <div
                      className="w-7 h-7 rounded-lg shadow-xs border border-white"
                      style={{ backgroundColor: preset.erpPrimaryColor }}
                    />
                    <div
                      className="w-7 h-7 rounded-lg shadow-xs border border-white"
                      style={{ backgroundColor: preset.erpSecondaryColor }}
                    />
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {preset.badge}
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-900 text-sm">{preset.name}</h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                    {preset.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-semibold">ERP Font:</span>
                      <span className="font-mono text-slate-800">{preset.erpFontFamily}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-semibold">Web Heading:</span>
                      <span className="font-mono text-slate-800">{preset.websiteHeadingFont}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`w-full mt-3.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Active Preset</span>
                      </>
                    ) : (
                      <span>Apply Palette</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ERP PORTAL BRANDING & FONTS */}
      {activeSubTab === 'erp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: ERP Brand Color Selection */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Laptop className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="text-sm font-black text-slate-900">ERP Interface Brand Colors</h4>
                <p className="text-xs text-slate-500">Controls navbar highlights, active buttons, badge accents and dashboard cards.</p>
              </div>
            </div>

            {/* Primary Brand Color */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Primary Brand Color (ERP)
              </label>

              {/* Swatches */}
              <div className="grid grid-cols-5 gap-2.5">
                {POPULAR_COLOR_PALETTES.map((color) => {
                  const isSelected = themeForm.erpPrimaryColor.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => handleThemeChange({ erpPrimaryColor: color.hex })}
                      className={`group relative flex flex-col items-center p-2 rounded-xl border transition-all text-center ${
                        isSelected
                          ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-sm bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg shadow-xs transition-transform group-hover:scale-105 flex items-center justify-center text-white"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 mt-1 truncate w-full">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center space-x-3 pt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="relative">
                  <input
                    type="color"
                    id="erpPrimaryColorInput"
                    value={themeForm.erpPrimaryColor}
                    onChange={(e) => handleThemeChange({ erpPrimaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="erpPrimaryHex" className="text-[10px] font-bold text-slate-500 uppercase block">
                    Custom Hex Color Picker
                  </label>
                  <input
                    type="text"
                    id="erpPrimaryHex"
                    value={themeForm.erpPrimaryColor}
                    onChange={(e) => handleThemeChange({ erpPrimaryColor: e.target.value })}
                    className="w-full text-xs font-mono font-bold px-2 py-1 bg-white border border-slate-200 rounded-md uppercase"
                    placeholder="#4F46E5"
                  />
                </div>
                <div
                  className="px-3 py-1.5 rounded-lg text-white text-xs font-black shadow-xs"
                  style={{ backgroundColor: themeForm.erpPrimaryColor }}
                >
                  Preview
                </div>
              </div>
            </div>

            {/* Secondary Accent Color */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Secondary / Accent Highlight Color (ERP)
              </label>

              <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input
                  type="color"
                  id="erpSecondaryColorInput"
                  value={themeForm.erpSecondaryColor}
                  onChange={(e) => handleThemeChange({ erpSecondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                />
                <div className="flex-1">
                  <label htmlFor="erpSecondaryHex" className="text-[10px] font-bold text-slate-500 uppercase block">
                    Secondary Accent Hex
                  </label>
                  <input
                    type="text"
                    id="erpSecondaryHex"
                    value={themeForm.erpSecondaryColor}
                    onChange={(e) => handleThemeChange({ erpSecondaryColor: e.target.value })}
                    className="w-full text-xs font-mono font-bold px-2 py-1 bg-white border border-slate-200 rounded-md uppercase"
                    placeholder="#F59E0B"
                  />
                </div>
                <div
                  className="px-3 py-1.5 rounded-lg text-white text-xs font-black shadow-xs"
                  style={{ backgroundColor: themeForm.erpSecondaryColor }}
                >
                  Accent
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: ERP Font Family Selector */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Type className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="text-sm font-black text-slate-900">ERP Interface Typography</h4>
                <p className="text-xs text-slate-500">Select the font family for data tables, student records, forms and dashboard metrics.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {ERP_FONT_OPTIONS.map((font) => {
                const isSelected = themeForm.erpFontFamily === font.id;
                return (
                  <div
                    key={font.id}
                    onClick={() => handleThemeChange({ erpFontFamily: font.id })}
                    className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all duration-150 flex items-start justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs" style={{ fontFamily: font.id }}>
                          {font.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold">
                          {font.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {font.description}
                      </p>
                      <div
                        className="text-xs font-bold text-slate-800 pt-1 tracking-tight"
                        style={{ fontFamily: font.id }}
                      >
                        {font.sampleText}
                      </div>
                    </div>

                    <div className="shrink-0 ml-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PUBLIC WEBSITE BRANDING & FONTS */}
      {activeSubTab === 'website' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Website Brand Colors */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Globe className="w-5 h-5 text-emerald-600" />
              <div>
                <h4 className="text-sm font-black text-slate-900">Public Website Brand Colors</h4>
                <p className="text-xs text-slate-500">Controls hero call-to-action buttons, promotional badges, icons & footer styling.</p>
              </div>
            </div>

            {/* Website Primary Color */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Primary Brand Color (Website)
              </label>

              <div className="grid grid-cols-5 gap-2">
                {POPULAR_COLOR_PALETTES.map((color) => {
                  const isSelected = themeForm.websitePrimaryColor.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => handleThemeChange({ websitePrimaryColor: color.hex })}
                      className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-sm bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-lg shadow-xs flex items-center justify-center text-white"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 mt-1 truncate w-full text-center">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center space-x-3 pt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input
                  type="color"
                  id="websitePrimaryColorInput"
                  value={themeForm.websitePrimaryColor}
                  onChange={(e) => handleThemeChange({ websitePrimaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                />
                <div className="flex-1">
                  <label htmlFor="websitePrimaryHex" className="text-[10px] font-bold text-slate-500 uppercase block">
                    Custom Hex Color
                  </label>
                  <input
                    type="text"
                    id="websitePrimaryHex"
                    value={themeForm.websitePrimaryColor}
                    onChange={(e) => handleThemeChange({ websitePrimaryColor: e.target.value })}
                    className="w-full text-xs font-mono font-bold px-2 py-1 bg-white border border-slate-200 rounded-md uppercase"
                    placeholder="#4F46E5"
                  />
                </div>
                <div
                  className="px-3 py-1.5 rounded-lg text-white text-xs font-black shadow-xs"
                  style={{ backgroundColor: themeForm.websitePrimaryColor }}
                >
                  Website CTA
                </div>
              </div>
            </div>

            {/* Website Secondary Accent */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Secondary / Discount Offer Color
              </label>

              <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input
                  type="color"
                  id="websiteSecondaryColorInput"
                  value={themeForm.websiteSecondaryColor}
                  onChange={(e) => handleThemeChange({ websiteSecondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                />
                <div className="flex-1">
                  <label htmlFor="websiteSecondaryHex" className="text-[10px] font-bold text-slate-500 uppercase block">
                    Offer Badge Hex
                  </label>
                  <input
                    type="text"
                    id="websiteSecondaryHex"
                    value={themeForm.websiteSecondaryColor}
                    onChange={(e) => handleThemeChange({ websiteSecondaryColor: e.target.value })}
                    className="w-full text-xs font-mono font-bold px-2 py-1 bg-white border border-slate-200 rounded-md uppercase"
                    placeholder="#F59E0B"
                  />
                </div>
                <div
                  className="px-3 py-1.5 rounded-lg text-white text-xs font-black shadow-xs"
                  style={{ backgroundColor: themeForm.websiteSecondaryColor }}
                >
                  30% OFF
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Website Typography Pairings */}
          <div className="lg:col-span-7 space-y-6">
            {/* Heading Font */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Type className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-sm font-black text-slate-900">Website Heading Typography (H1, H2, Hero Titles)</h4>
                  <p className="text-xs text-slate-500">Sets the tone for hero headlines, section headers and course titles.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {WEBSITE_HEADING_FONT_OPTIONS.map((font) => {
                  const isSelected = themeForm.websiteHeadingFont === font.id;
                  return (
                    <div
                      key={font.id}
                      onClick={() => handleThemeChange({ websiteHeadingFont: font.id })}
                      className={`cursor-pointer p-3 rounded-xl border-2 transition-all duration-150 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-xs">{font.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {font.category}
                        </span>
                      </div>
                      <div
                        className="text-sm font-extrabold text-slate-800 leading-snug tracking-tight"
                        style={{ fontFamily: font.id }}
                      >
                        {font.sampleText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Body Font */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Type className="w-5 h-5 text-indigo-600" />
                <div>
                  <h4 className="text-sm font-black text-slate-900">Website Body Typography (Paragraphs & Content)</h4>
                  <p className="text-xs text-slate-500">Applied to course curriculums, mentor bios, FAQ answers and blog posts.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {WEBSITE_BODY_FONT_OPTIONS.map((font) => {
                  const isSelected = themeForm.websiteBodyFont === font.id;
                  return (
                    <div
                      key={font.id}
                      onClick={() => handleThemeChange({ websiteBodyFont: font.id })}
                      className={`cursor-pointer p-3 rounded-xl border-2 transition-all duration-150 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-xs">{font.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {font.category}
                        </span>
                      </div>
                      <div
                        className="text-xs text-slate-600 leading-normal"
                        style={{ fontFamily: font.id }}
                      >
                        {font.sampleText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE INTERACTIVE PREVIEW SANDBOX */}
      {(activeSubTab === 'preview' || activeSubTab === 'erp' || activeSubTab === 'website') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="text-sm font-black text-slate-900">Live Synchronized Component Preview</h4>
                <p className="text-xs text-slate-500">
                  Instant real-time rendering of UI widgets using the active brand palette and selected fonts.
                </p>
              </div>
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl space-x-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setPreviewMode('split')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  previewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Split View
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('erp')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  previewMode === 'erp' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ERP Only
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('website')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  previewMode === 'website' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Website Only
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Left Preview: ERP Dashboard Component Mockup */}
            {(previewMode === 'split' || previewMode === 'erp') && (
              <div
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3.5 shadow-xs"
                style={{ fontFamily: themeForm.erpFontFamily }}
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Laptop className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      ERP Interface Preview ({themeForm.erpFontFamily})
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: themeForm.erpPrimaryColor }}
                  >
                    Primary: {themeForm.erpPrimaryColor}
                  </span>
                </div>

                {/* Mock ERP Mini Header */}
                <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between shadow-xs">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-xs"
                      style={{ backgroundColor: themeForm.erpPrimaryColor }}
                    >
                      N
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900">Nexgen ERP Suite</h5>
                      <p className="text-[10px] text-slate-400">Academic Management</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      className="px-2.5 py-1 text-[11px] font-bold text-white rounded-lg shadow-xs flex items-center space-x-1"
                      style={{ backgroundColor: themeForm.erpPrimaryColor }}
                    >
                      <span>+ New Admission</span>
                    </button>
                  </div>
                </div>

                {/* Mock ERP Metric Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Active Students</span>
                    <h4 className="text-lg font-black text-slate-900 mt-0.5">1,420</h4>
                    <span
                      className="text-[10px] font-extrabold inline-block mt-1"
                      style={{ color: themeForm.erpPrimaryColor }}
                    >
                      +18% from last month
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Collected Revenue</span>
                    <h4 className="text-lg font-black text-slate-900 mt-0.5">৳ 4,85,000</h4>
                    <span
                      className="text-[10px] font-extrabold px-1.5 py-0.5 rounded text-white inline-block mt-1"
                      style={{ backgroundColor: themeForm.erpSecondaryColor }}
                    >
                      96% Realization
                    </span>
                  </div>
                </div>

                {/* Mock Data Row */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900">Rahim Uddin (Full Stack Batch-04)</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                      style={{ backgroundColor: themeForm.erpPrimaryColor }}
                    >
                      Enrolled
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Due Balance: ৳ 0 (Paid in Full)</span>
                    <span className="font-mono">NCA-STU-2026-001</span>
                  </div>
                </div>
              </div>
            )}

            {/* Right Preview: Public Website Mockup */}
            {(previewMode === 'split' || previewMode === 'website') && (
              <div
                className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-4 space-y-3.5 shadow-xs"
                style={{ fontFamily: themeForm.websiteBodyFont }}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                      Public Website Preview
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: themeForm.websitePrimaryColor }}
                  >
                    Heading: {themeForm.websiteHeadingFont}
                  </span>
                </div>

                {/* Mock Hero Section */}
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-3">
                  <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-slate-300">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: themeForm.websiteSecondaryColor }}
                    />
                    <span>ADMISSIONS OPEN FOR NEXT BATCH</span>
                  </div>

                  <h3
                    className="text-base sm:text-lg font-black text-white leading-tight tracking-tight"
                    style={{ fontFamily: themeForm.websiteHeadingFont }}
                  >
                    Build A High-Paying Career in IT & Professional Skills
                  </h3>

                  <p
                    className="text-xs text-slate-300 leading-relaxed"
                    style={{ fontFamily: themeForm.websiteBodyFont }}
                  >
                    100% practical lab classes, expert industry trainers, and guaranteed freelance job placement support.
                  </p>

                  <div className="flex items-center space-x-2.5 pt-1">
                    <button
                      className="px-3.5 py-1.5 text-xs font-black text-white rounded-lg shadow-md hover:brightness-110 transition-all flex items-center space-x-1"
                      style={{ backgroundColor: themeForm.websitePrimaryColor }}
                    >
                      <span>Explore Courses</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-white/10 rounded-lg transition-all"
                      style={{ fontFamily: themeForm.websiteBodyFont }}
                    >
                      <span>Free Seminar</span>
                    </button>
                  </div>
                </div>

                {/* Mock Course Card */}
                <div className="bg-slate-800/60 rounded-xl border border-slate-700/80 p-3 flex items-center justify-between">
                  <div>
                    <h5
                      className="font-bold text-xs text-white"
                      style={{ fontFamily: themeForm.websiteHeadingFont }}
                    >
                      Professional Full-Stack MERN & AI
                    </h5>
                    <p className="text-[10px] text-slate-400">4 Months • 32 Live Sessions</p>
                  </div>

                  <div className="text-right">
                    <span
                      className="text-xs font-black"
                      style={{ color: themeForm.websiteSecondaryColor }}
                    >
                      ৳ 12,000
                    </span>
                    <span className="text-[9px] text-slate-400 block line-through">৳ 18,000</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
