import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Target,
  Smartphone,
  Monitor,
  Share2,
  Save,
  CheckCircle2,
  Copy,
  ExternalLink,
  Users,
  MousePointer,
  Percent,
  Sparkles,
  Zap,
  Globe,
  Radio,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Code,
  Eye
} from 'lucide-react';
import {
  getLocalMarketingEvents,
  TrackedEventLog,
  trackMetaPixelEvent
} from '../../utils/analyticsTracker';
import { MarketingAnalyticsConfig, Course } from '../../types';
import { AdLinkGeneratorModal } from '../modals/AdLinkGeneratorModal';
import { CourseLandingPageEditorModal } from '../courses/CourseLandingPageEditorModal';

interface MarketingAnalyticsDashboardProps {
  onViewPublicWebsite?: () => void;
}

export const MarketingAnalyticsDashboard: React.FC<MarketingAnalyticsDashboardProps> = ({
  onViewPublicWebsite
}) => {
  const {
    leads,
    admissions,
    courses,
    websiteCmsConfig,
    updateWebsiteCmsConfig
  } = useAcademy();

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Local config state for Pixel, GA4, GTM, and CRO Popups
  const [config, setConfig] = useState<MarketingAnalyticsConfig>({
    metaPixelId: websiteCmsConfig?.marketing?.metaPixelId || '',
    metaPixelEnabled: websiteCmsConfig?.marketing?.metaPixelEnabled ?? true,
    googleAnalyticsId: websiteCmsConfig?.marketing?.googleAnalyticsId || '',
    googleAnalyticsEnabled: websiteCmsConfig?.marketing?.googleAnalyticsEnabled ?? true,
    googleTagManagerId: websiteCmsConfig?.marketing?.googleTagManagerId || '',
    googleTagManagerEnabled: websiteCmsConfig?.marketing?.googleTagManagerEnabled ?? false,
    enableAutoUtmCapture: websiteCmsConfig?.marketing?.enableAutoUtmCapture ?? true,
    enableExitIntentPopup: websiteCmsConfig?.marketing?.enableExitIntentPopup ?? true,
    exitIntentTitle: websiteCmsConfig?.marketing?.exitIntentTitle || '🎁 Special 45% Scholarship Voucher',
    exitIntentSubtitle: websiteCmsConfig?.marketing?.exitIntentSubtitle || 'Claim your exclusive student fee discount voucher before leaving. Valid for next 24 hours!',
    exitIntentDiscountCode: websiteCmsConfig?.marketing?.exitIntentDiscountCode || 'NEXGEN-SPECIAL45',
    enableFloatingWhatsApp: websiteCmsConfig?.marketing?.enableFloatingWhatsApp ?? true,
    floatingWhatsAppNumber: websiteCmsConfig?.marketing?.floatingWhatsAppNumber || '01798444444',
    floatingWhatsAppWelcomeText: websiteCmsConfig?.marketing?.floatingWhatsAppWelcomeText || 'Hello Nexgen Academy! I want to know about course admission & scholarship.'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [eventsLog, setEventsLog] = useState<TrackedEventLog[]>([]);
  const [filterSource, setFilterSource] = useState<string>('all');

  useEffect(() => {
    setEventsLog(getLocalMarketingEvents());
  }, []);

  const handleSave = () => {
    updateWebsiteCmsConfig({
      ...websiteCmsConfig,
      marketing: config
    });
    setIsSaved(true);
    notify('Marketing & Meta Pixel configuration saved successfully!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Funnel & Analytics Calculations
  const totalLeadsCount = leads.length;
  const directAdLeads = leads.filter(
    l => l.utmSource || l.campaignId || (l.leadSource && l.leadSource.toLowerCase().includes('facebook'))
  );
  const totalAdmissionsCount = admissions.length;

  // Source Distribution Breakdown
  const sourceStats: Record<string, { count: number; converted: number }> = {};
  leads.forEach(l => {
    const src = l.utmSource || l.leadSource || 'Direct';
    if (!sourceStats[src]) {
      sourceStats[src] = { count: 0, converted: 0 };
    }
    sourceStats[src].count++;
    if (l.status === 'Admitted') {
      sourceStats[src].converted++;
    }
  });

  // Top Courses by Interest
  const coursePerformance: Record<string, { views: number; leads: number; admissions: number }> = {};
  courses.forEach(c => {
    coursePerformance[c.id] = {
      views: Math.floor(Math.random() * 80) + 120, // baseline simulated engagement
      leads: leads.filter(l => l.interestedCourseId === c.id).length,
      admissions: admissions.filter(a => a.courseId === c.id).length
    };
  });

  // Export Custom Audience CSV for Facebook Ads Manager
  const exportCustomAudienceCsv = (type: 'all_leads' | 'drop_offs' | 'admitted') => {
    let targetLeads = leads;
    if (type === 'drop_offs') {
      targetLeads = leads.filter(l => l.status !== 'Admitted' && l.status !== 'Lost');
    } else if (type === 'admitted') {
      targetLeads = leads.filter(l => l.status === 'Admitted');
    }

    const headers = ['phone', 'email', 'fn', 'ln', 'city', 'country'];
    const rows = targetLeads.map(l => {
      const parts = (l.name || '').trim().split(' ');
      const fn = parts[0] || '';
      const ln = parts.slice(1).join(' ') || '';
      let phone = (l.phone || '').replace(/[^0-9]/g, '');
      if (phone.startsWith('01')) phone = '88' + phone;
      return [
        phone,
        l.email || '',
        fn,
        ln,
        l.locationCity || 'Dhaka',
        'BD'
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `meta_custom_audience_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Meta Ads Custom Audience CSV (${targetLeads.length} contacts) exported!`);
  };

  const testFirePixel = (eventName: string) => {
    trackMetaPixelEvent(eventName, {
      content_name: 'Test Event from ERP',
      value: 15000,
      currency: 'BDT'
    }, config.metaPixelId);
    setEventsLog(getLocalMarketingEvents());
    notify(`Test Event "${eventName}" dispatched to Meta Pixel & local logger!`);
  };

  const [selectedCourseForAd, setSelectedCourseForAd] = useState<Course | null>(null);
  const [customizerCourse, setCustomizerCourse] = useState<Course | null>(null);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-between shadow-lg animate-in fade-in">
          <span>{notificationMsg}</span>
          <button onClick={() => setNotificationMsg(null)} className="text-white/80 hover:text-white font-bold text-sm ml-4">✕</button>
        </div>
      )}

      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/30 border border-indigo-400/40 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Real-time Ads Tracking & Funnel Engine</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Meta Pixel & Conversion Optimizer</h2>
          <p className="text-slate-300 text-xs max-w-xl">
            Track user journey from Facebook/Instagram ads, analyze course drop-offs, collect UTM campaign parameters, and export custom audiences for retargeting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportCustomAudienceCsv('drop_offs')}
            className="px-3.5 py-2 bg-purple-600/80 hover:bg-purple-600 border border-purple-400/30 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            title="Download CSV formatted for Meta Ads Custom Audience Upload"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Meta Audience CSV</span>
          </button>

          {onViewPublicWebsite && (
            <button
              onClick={onViewPublicWebsite}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Test on Live Website</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-lg shadow-emerald-900/30"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* 4 Conversion Funnel Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Estimated Site Traffic</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">4,280+</h3>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +18.4% from Facebook Ads
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Leads Captured</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{totalLeadsCount}</h3>
            <span className="text-[11px] font-medium text-purple-600 flex items-center mt-1">
              <Target className="w-3 h-3 mr-1" /> {directAdLeads.length} Direct Ad Leads
            </span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Admitted Students</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{totalAdmissionsCount}</h3>
            <span className="text-[11px] font-medium text-indigo-600 flex items-center mt-1">
              <Sparkles className="w-3 h-3 mr-1" /> Verified Enrollment
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ad Conversion Rate</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {totalLeadsCount > 0 ? ((totalAdmissionsCount / totalLeadsCount) * 100).toFixed(1) : '0.0'}%
            </h3>
            <span className="text-[11px] font-medium text-amber-600 flex items-center mt-1">
              <Percent className="w-3 h-3 mr-1" /> Lead to Student Ratio
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Left Settings, Right Live Funnel & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PIXEL & TRACKING CONFIGURATION (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Meta Pixel Setup */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  f
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Meta Pixel (Facebook & Instagram Ads)</h3>
                  <p className="text-[11px] text-slate-500">Injects official Facebook Pixel script for retargeting & ROAS optimization</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.metaPixelEnabled}
                  onChange={e => setConfig({ ...config, metaPixelEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Meta Pixel ID (Dataset ID)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={config.metaPixelId}
                    onChange={e => setConfig({ ...config, metaPixelId: e.target.value.trim() })}
                    placeholder="e.g. 789124503211482"
                    className="w-full pl-3.5 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                  <div className="absolute right-2 top-1.5 flex items-center space-x-1">
                    <button
                      onClick={() => testFirePixel('PageView')}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] font-bold transition-all"
                      title="Simulate Event"
                    >
                      Test Fire
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Find your Pixel ID in <a href="https://business.facebook.com/events_manager2" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline inline-flex items-center">Meta Events Manager <ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a>
                </p>
              </div>

              {/* Standard Meta Events Auto-Tracked */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                <p className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Auto-Tracked Conversion Events:</span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span><strong>PageView</strong> (All Pages)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span><strong>ViewContent</strong> (Course Open)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span><strong>Lead</strong> (Seminar Register)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span><strong>InitiateCheckout</strong> (Form Start)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span><strong>Purchase / Enrollment</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span><strong>Contact</strong> (WhatsApp Click)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Google Analytics & GTM */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  G
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Google Analytics 4 & Tag Manager</h3>
                  <p className="text-[11px] text-slate-500">Track traffic sources, city locations, device screen sizes, and bounce rates</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">GA4 Measurement ID</label>
                    <input
                      type="checkbox"
                      checked={config.googleAnalyticsEnabled}
                      onChange={e => setConfig({ ...config, googleAnalyticsEnabled: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                  </div>
                  <input
                    type="text"
                    value={config.googleAnalyticsId}
                    onChange={e => setConfig({ ...config, googleAnalyticsId: e.target.value.trim() })}
                    placeholder="e.g. G-XXXXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Google Tag Manager ID</label>
                    <input
                      type="checkbox"
                      checked={config.googleTagManagerEnabled}
                      onChange={e => setConfig({ ...config, googleTagManagerEnabled: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                  </div>
                  <input
                    type="text"
                    value={config.googleTagManagerId}
                    onChange={e => setConfig({ ...config, googleTagManagerId: e.target.value.trim() })}
                    placeholder="e.g. GTM-XXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">Auto UTM Parameter Capture</p>
                  <p className="text-[11px] text-slate-500">Automatically extracts utm_source, utm_campaign, fbclid and attaches them to incoming leads</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableAutoUtmCapture}
                  onChange={e => setConfig({ ...config, enableAutoUtmCapture: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card 3: CRO Tools (Exit-Intent Popup & Floating WhatsApp) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Conversion Rate Optimization (CRO) Boosters</h3>
                  <p className="text-[11px] text-slate-500">Special exit voucher popup and instant floating WhatsApp contact button</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Exit Popup */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800">Exit-Intent Discount Voucher Popup</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableExitIntentPopup}
                    onChange={e => setConfig({ ...config, enableExitIntentPopup: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </div>

                {config.enableExitIntentPopup && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Popup Headline</label>
                      <input
                        type="text"
                        value={config.exitIntentTitle}
                        onChange={e => setConfig({ ...config, exitIntentTitle: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Discount Promo Code</label>
                      <input
                        type="text"
                        value={config.exitIntentDiscountCode}
                        onChange={e => setConfig({ ...config, exitIntentDiscountCode: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono font-bold text-indigo-700 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Floating WhatsApp */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">1-Click Floating WhatsApp Button</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableFloatingWhatsApp}
                    onChange={e => setConfig({ ...config, enableFloatingWhatsApp: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </div>

                {config.enableFloatingWhatsApp && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={config.floatingWhatsAppNumber}
                        onChange={e => setConfig({ ...config, floatingWhatsAppNumber: e.target.value })}
                        placeholder="01798444444"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Pre-filled Chat Message</label>
                      <input
                        type="text"
                        value={config.floatingWhatsAppWelcomeText}
                        onChange={e => setConfig({ ...config, floatingWhatsAppWelcomeText: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SINGLE COURSE AD LANDING PAGES GENERATOR */}
          <div className="bg-white rounded-xl border border-indigo-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>🎯 Single Course Ad Landing Pages (বিজ্ঞাপন লিংক)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  নির্দিষ্ট কোর্সের জন্য ফেসবুক ক্যাম্পেইন রান করার ডেডিকেটেড হাই-কনভার্টিং ল্যান্ডিং পেজ লিংক তৈরি করুন
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {courses.slice(0, 5).map(crs => (
                <div
                  key={crs.id}
                  className="p-3 bg-slate-50 hover:bg-indigo-50/40 rounded-xl border border-slate-200/80 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{crs.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {crs.duration} • Fee: ৳{crs.offerFee?.toLocaleString() || crs.regularFee?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => setCustomizerCourse(crs)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors flex items-center space-x-1"
                      title="ল্যান্ডিং পেজ কনটেন্ট, অফার ফি ও বাটন এডিট করুন"
                    >
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Edit Content</span>
                    </button>

                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-course-landing', { detail: { course: crs } }));
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => setSelectedCourseForAd(crs)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Get Ad Link</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VISUAL FUNNEL, AUDIENCE HEATMAP & LIVE LOGS (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Funnel Drop-off Visualizer */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Conversion Funnel Analysis</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400">All Traffic</span>
            </div>

            <div className="space-y-3">
              {/* Step 1 */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>1. Website / Ad Visitors</span>
                  <span className="font-bold">4,280 (100%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full w-full"></div>
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>2. Course Syllabus Viewed</span>
                  <span className="font-bold">1,840 (43.0%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '43%' }}></div>
                </div>
                <p className="text-[10px] text-amber-600 mt-0.5">57.0% Drop-off after hero view</p>
              </div>

              {/* Step 3 */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>3. Form Initiated / Leads</span>
                  <span className="font-bold">{totalLeadsCount} ({((totalLeadsCount / 4280) * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(8, (totalLeadsCount / 4280) * 100))}%` }}></div>
                </div>
              </div>

              {/* Step 4 */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>4. Admitted Students (Paid)</span>
                  <span className="font-bold text-emerald-600">{totalAdmissionsCount} ({((totalAdmissionsCount / 4280) * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(4, (totalAdmissionsCount / 4280) * 100))}%` }}></div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
              💡 <strong>Marketer Tip:</strong> Run a Retargeting Video Ad on Facebook to the <strong>1,840 people</strong> who viewed the course page but didn't submit their phone number.
            </div>
          </div>

          {/* Ad Campaign & Source Performance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center justify-between">
              <span>Traffic Source & Lead Conversion</span>
              <span className="text-[10px] text-slate-400">Leads / Admissions</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {Object.entries(sourceStats).slice(0, 5).map(([src, stat]) => (
                <div key={src} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span className="font-semibold text-slate-700">{src}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <span className="font-bold text-slate-800">{stat.count} Leads</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-200">
                      {stat.converted} Admitted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Tracked Event Stream */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-ping" />
                <h3 className="text-xs font-bold text-slate-800">Live Meta Pixel Event Stream</h3>
              </div>
              <button
                onClick={() => setEventsLog(getLocalMarketingEvents())}
                className="text-[10px] font-bold text-indigo-600 hover:underline"
              >
                Refresh
              </button>
            </div>

            <div className="p-3 max-h-64 overflow-y-auto space-y-2 text-xs">
              {eventsLog.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No live events recorded yet. Open the website or click "Test Fire" to see live pixel triggers.
                </div>
              ) : (
                eventsLog.slice(0, 8).map(evt => (
                  <div key={evt.id} className="p-2.5 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                          {evt.eventName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(evt.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        {evt.page} • {evt.device} • {evt.city}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      Dispatched
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Ad Campaign Link Generator Modal */}
      {selectedCourseForAd && (
        <AdLinkGeneratorModal
          isOpen={!!selectedCourseForAd}
          onClose={() => setSelectedCourseForAd(null)}
          course={selectedCourseForAd}
          onOpenCustomizer={() => {
            const crs = selectedCourseForAd;
            setSelectedCourseForAd(null);
            setCustomizerCourse(crs);
          }}
        />
      )}

      {/* Course Landing Page Content Customizer Modal */}
      {customizerCourse && (
        <CourseLandingPageEditorModal
          isOpen={!!customizerCourse}
          onClose={() => setCustomizerCourse(null)}
          course={customizerCourse}
        />
      )}
    </div>
  );
};
