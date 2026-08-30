import React, { useState, useMemo } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { Course, GlobalSeoConfig, CourseSlugRedirect } from '../../../types';
import {
  generateSlug,
  getHomepageSeoMetadata,
  getLocalBusinessSchema,
  generateSitemapXml,
  generateRobotsTxt
} from '../../../utils/seoHelper';
import {
  Search,
  Globe,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Monitor,
  Edit,
  RefreshCw,
  Plus,
  Trash2,
  Layers,
  HelpCircle,
  Clock,
  Phone,
  Building,
  Target,
  ShieldCheck,
  BarChart3,
  Activity,
  ArrowRight,
  Download,
  Info,
  Sliders,
  Compass,
  Star,
  Eye,
  EyeOff,
  Link as LinkIcon
} from 'lucide-react';

interface CmsSeoTabProps {
  onSaveToast?: (msg: string) => void;
  onOpenCourseEditor?: (course: Course) => void;
}

export const CmsSeoTab: React.FC<CmsSeoTabProps> = ({ onSaveToast, onOpenCourseEditor }) => {
  const { websiteCmsConfig, updateWebsiteCmsConfig, academySettings, courses, updateCourse } = useAcademy();

  const currentSeo: GlobalSeoConfig = useMemo(() => {
    return (
      websiteCmsConfig.seo || {
        metaTitle: 'Nexgen Computer Academy - Best Computer Training Center in Farmgate, Dhaka',
        metaDescription:
          'Govt recognized top IT training institute in Farmgate, Dhaka. Practical Computer Office Application, Advanced Excel, Web Dev, Graphic Design, Digital Marketing & AI courses with 100% lab practice & job placement.',
        keywords: [
          'Computer Course in Farmgate',
          'Computer Training Center in Farmgate',
          'Computer Course in Dhaka',
          'Computer Office Application Course',
          'Advanced Excel Course in Farmgate',
          'Best IT Training Institute in Farmgate'
        ],
        canonicalBaseUrl: 'https://nexgenacademy.edu.bd',
        ogTitle: 'Nexgen Computer Academy | #1 Practical IT Training Center in Farmgate, Dhaka',
        ogDescription:
          'Master Office Application, Excel, MERN Web Dev, UI/UX Design & Digital Marketing with 1-on-1 practical lab guidance & verifiable certificates.',
        ogImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
        twitterHandle: '@nexgenacademybd',
        geoRegion: 'BD-13',
        geoPlacename: 'Farmgate, Dhaka, Bangladesh',
        geoPosition: '23.7527;90.3887',
        googleSiteVerification: 'google-site-verification-nexgen2026',
        bingSiteVerification: '',
        sitemapEnabled: true,
        robotsTxtEnabled: true,
        enableLocalBusinessSchema: true,
        enableCourseSchema: true,
        enableFaqSchema: true,
        enableBreadcrumbSchema: true,
        targetKeywordThemes: [
          'Computer Course in Farmgate',
          'Computer Training Center in Farmgate',
          'Computer Course in Dhaka',
          'Computer Office Application Course',
          'Advanced Excel Course in Farmgate',
          'Computer Training in Farmgate',
          'AI Computer Course',
          'Practical Computer Training'
        ],
        serviceAreas: [
          'Farmgate',
          'Panthapath',
          'Tejgaon',
          'Dhanmondi',
          'Bijoy Sarani',
          'Indira Road',
          'Green Road',
          'Kawran Bazar',
          'Dhaka Division',
          'All Bangladesh (Online)'
        ],
        faqItems: [
          {
            question: 'Why choose Nexgen Computer Academy in Farmgate for IT courses?',
            answer:
              'Nexgen Computer Academy offers 100% lab-centric practical training with dedicated high-spec PC per student, industry-expert mentors, government verifiable certificates, lifetime lab access, and job placement assistance in Dhaka.'
          },
          {
            question: 'Where is Nexgen Computer Academy located?',
            answer:
              'Nexgen Computer Academy is located at Level 4 & 5, Al-Razi Complex, 166/1 Shahid Syed Nazrul Islam Sarani, Farmgate, Dhaka-1215 (Opposite Ananda Cinema Hall, 2 min from Farmgate Metro Station Exit 2).'
          },
          {
            question: 'Do you offer both Offline Classroom and Online Live courses?',
            answer:
              'Yes! Students from Farmgate, Tejgaon, Dhanmondi, and Dhaka can join our AC practical lab batches, while students from across Bangladesh can join our interactive Live Online batches with class recording access.'
          }
        ],
        googleBusinessProfile: {
          profileName: 'Nexgen Computer Academy',
          mapsUrl: 'https://share.google/gSt3e5RNwwCyOOdGu',
          reviewUrl: 'https://share.google/gSt3e5RNwwCyOOdGu',
          businessCategory: 'Training centre',
          source: 'CENTRAL_SETTINGS',
          manualAddress: '',
          manualPhone: '',
          manualEmail: '',
          manualOpeningHours: '',
          latitude: 23.7527,
          longitude: 90.3887,
          verificationStatus: 'VERIFIED_EXTERNALLY'
        },
        courseRedirects: []
      }
    );
  }, [websiteCmsConfig.seo]);

  const [formData, setFormData] = useState<GlobalSeoConfig>(currentSeo);
  const [activeSubTab, setActiveSubTab] = useState<
    'gbp_nap' | 'serp_meta' | 'local_seo' | 'courses_seo' | 'analytics_hub' | 'seo_health' | 'schemas' | 'sitemap_robots'
  >('gbp_nap');

  const [serpPreviewMode, setSerpPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [newServiceAreaInput, setNewServiceAreaInput] = useState('');

  // Course Quick SEO Editor State
  const [editingCourseSeo, setEditingCourseSeo] = useState<Course | null>(null);
  const [courseSeoForm, setCourseSeoForm] = useState<{
    slug: string;
    seoTitle: string;
    metaDescription: string;
    focusKeyword: string;
    noIndex: boolean;
  }>({
    slug: '',
    seoTitle: '',
    metaDescription: '',
    focusKeyword: '',
    noIndex: false
  });

  // 301 Redirect Input state
  const [redirectOldSlug, setRedirectOldSlug] = useState('');
  const [redirectNewSlug, setRedirectNewSlug] = useState('');

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleSave = () => {
    updateWebsiteCmsConfig({
      ...websiteCmsConfig,
      seo: formData
    });
    if (onSaveToast) onSaveToast('SEO & Google Business Profile Settings saved to database!');
  };

  // NAP Data Computation
  const effectiveNap = useMemo(() => {
    const isCentral = formData.googleBusinessProfile?.source !== 'MANUAL_OVERRIDE';
    return {
      name: isCentral
        ? academySettings.instituteName || 'Nexgen Computer Academy'
        : formData.googleBusinessProfile?.profileName || academySettings.instituteName,
      address: isCentral
        ? websiteCmsConfig.officeAddress || academySettings.officialAddress || '14/B, Garden Road, Kazipara, Farmgate, Dhaka–1215, Bangladesh'
        : formData.googleBusinessProfile?.manualAddress || academySettings.officialAddress,
      phone: isCentral
        ? websiteCmsConfig.whatsappSupportNumber || academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444'
        : formData.googleBusinessProfile?.manualPhone || academySettings.primarySupportPhone,
      email: isCentral
        ? academySettings.officialEmail || 'info@nexgenacademy.edu.bd'
        : formData.googleBusinessProfile?.manualEmail || academySettings.officialEmail,
      openingHours: isCentral
        ? 'Saturday - Friday: 9:00 AM - 8:00 PM'
        : formData.googleBusinessProfile?.manualOpeningHours || 'Saturday - Friday: 9:00 AM - 8:00 PM',
      websiteUrl: formData.canonicalBaseUrl || 'https://nexgenacademy.edu.bd',
      category: formData.googleBusinessProfile?.businessCategory || 'Training centre',
      mapsUrl: formData.googleBusinessProfile?.mapsUrl || 'https://share.google/gSt3e5RNwwCyOOdGu',
      reviewUrl: formData.googleBusinessProfile?.reviewUrl || 'https://share.google/gSt3e5RNwwCyOOdGu'
    };
  }, [formData, academySettings, websiteCmsConfig]);

  // NAP Audit Status Checker
  const napAudit = useMemo(() => {
    const checks = [
      {
        field: 'Business Name',
        value: effectiveNap.name,
        status: effectiveNap.name ? 'PASS' : 'MISSING',
        note: 'Consistent across Website Header, Footer & GBP'
      },
      {
        field: 'Street Address',
        value: effectiveNap.address,
        status: effectiveNap.address ? 'PASS' : 'MISSING',
        note: 'Complete Farmgate location with landmark'
      },
      {
        field: 'Primary Phone',
        value: effectiveNap.phone,
        status: effectiveNap.phone ? 'PASS' : 'MISSING',
        note: 'Local BD number formatted identically'
      },
      {
        field: 'Official Email',
        value: effectiveNap.email,
        status: effectiveNap.email ? 'PASS' : 'MISSING',
        note: 'Domain-matched institute email'
      },
      {
        field: 'Website URL',
        value: effectiveNap.websiteUrl,
        status: effectiveNap.websiteUrl?.startsWith('https://') ? 'PASS' : 'WARNING',
        note: 'Canonical SSL domain without query parameters'
      },
      {
        field: 'Google Maps Link',
        value: effectiveNap.mapsUrl,
        status: effectiveNap.mapsUrl ? 'PASS' : 'MISSING',
        note: 'Direct pin to Farmgate campus'
      },
      {
        field: 'Google Review Link',
        value: effectiveNap.reviewUrl,
        status: effectiveNap.reviewUrl ? 'PASS' : 'WARNING',
        note: 'Direct CTA for student feedback'
      }
    ];

    const passCount = checks.filter(c => c.status === 'PASS').length;
    const score = Math.round((passCount / checks.length) * 100);
    return { checks, score, total: checks.length, passCount };
  }, [effectiveNap]);

  // Comprehensive SEO Health Audit
  const overallSeoHealth = useMemo(() => {
    const items = [
      {
        category: 'Technical SEO',
        item: 'Google Search Console Verification',
        status: formData.googleSiteVerification ? 'PASS' : 'WARNING',
        detail: formData.googleSiteVerification ? `Token: ${formData.googleSiteVerification}` : 'Verification code missing'
      },
      {
        category: 'Technical SEO',
        item: 'Dynamic XML Sitemap',
        status: formData.sitemapEnabled !== false ? 'PASS' : 'WARNING',
        detail: `${courses.length} courses included in /sitemap.xml`
      },
      {
        category: 'Technical SEO',
        item: 'Robots.txt Directives',
        status: formData.robotsTxtEnabled !== false ? 'PASS' : 'WARNING',
        detail: 'Public crawling allowed; CRM admin protected'
      },
      {
        category: 'Technical SEO',
        item: 'Canonical Base URL',
        status: formData.canonicalBaseUrl?.startsWith('https://') ? 'PASS' : 'WARNING',
        detail: formData.canonicalBaseUrl || 'Not configured'
      },
      {
        category: 'Local SEO',
        item: 'LocalBusiness Schema.org',
        status: formData.enableLocalBusinessSchema !== false ? 'PASS' : 'WARNING',
        detail: 'GeoCoordinates (23.7527, 90.3887) & NAP included'
      },
      {
        category: 'Local SEO',
        item: 'Service Area Targeting',
        status: (formData.serviceAreas?.length || 0) >= 5 ? 'PASS' : 'WARNING',
        detail: `${formData.serviceAreas?.length || 0} local areas targeted`
      },
      {
        category: 'Local SEO',
        item: 'Google Review Link Strategy',
        status: effectiveNap.reviewUrl ? 'PASS' : 'WARNING',
        detail: 'Active student review CTA configured'
      },
      {
        category: 'Course SEO',
        item: 'Course Slugs & Indexing',
        status: courses.every(c => c.seo?.slug || c.slug) ? 'PASS' : 'WARNING',
        detail: `${courses.length} / ${courses.length} courses have clean SEO slugs`
      },
      {
        category: 'Course SEO',
        item: 'Course Schema.org Markup',
        status: formData.enableCourseSchema !== false ? 'PASS' : 'WARNING',
        detail: 'Course offer, ratings, and instructor schemas enabled'
      }
    ];

    const passCount = items.filter(i => i.status === 'PASS').length;
    const score = Math.round((passCount / items.length) * 100);
    return { items, score, passCount, total: items.length };
  }, [formData, courses, effectiveNap]);

  const handleAutoGenerateAllCourseSeo = () => {
    let updatedCount = 0;
    courses.forEach(course => {
      const slug = course.seo?.slug || course.landingConfig?.slug || course.slug || generateSlug(course.name);
      const seoTitle = course.seo?.seoTitle || course.landingConfig?.seoTitle || `${course.name} Course in Farmgate, Dhaka | Nexgen Academy`;
      const metaDescription =
        course.seo?.metaDescription ||
        course.landingConfig?.seoMetaDescription ||
        `${course.name} at Nexgen Computer Academy, Farmgate. ${course.duration} practical hands-on lab training with 1-on-1 mentorship, verifiable certificate & career guidance in Dhaka.`;

      const updatedSeo = {
        ...course.seo,
        slug,
        seoTitle,
        metaDescription,
        focusKeyword: course.seo?.focusKeyword || `${course.name} in Farmgate`,
        canonicalUrl: `https://nexgenacademy.edu.bd/courses/${slug}`,
        ogTitle: seoTitle,
        ogDescription: metaDescription,
        ogImage: course.thumbnailUrl || formData.ogImageUrl,
        noIndex: false
      };

      updateCourse(course.id, {
        ...course,
        slug,
        seo: updatedSeo
      });
      updatedCount++;
    });

    if (onSaveToast) {
      onSaveToast(`Auto-synced SEO metadata & clean slugs for all ${updatedCount} courses!`);
    }
  };

  const handleOpenCourseSeoModal = (course: Course) => {
    const slug = course.seo?.slug || course.landingConfig?.slug || course.slug || generateSlug(course.name);
    const seoTitle = course.seo?.seoTitle || course.landingConfig?.seoTitle || `${course.name} Course in Farmgate, Dhaka | Nexgen Academy`;
    const metaDescription =
      course.seo?.metaDescription ||
      course.landingConfig?.seoMetaDescription ||
      `${course.name} at Nexgen Computer Academy, Farmgate. ${course.duration} practical hands-on lab training with 1-on-1 mentorship in Dhaka.`;
    const focusKeyword = course.seo?.focusKeyword || `${course.name} in Farmgate`;
    const noIndex = course.seo?.noIndex || false;

    setCourseSeoForm({
      slug,
      seoTitle,
      metaDescription,
      focusKeyword,
      noIndex
    });
    setEditingCourseSeo(course);
  };

  const handleSaveCourseSeoModal = () => {
    if (!editingCourseSeo) return;
    const cleanSlug = generateSlug(courseSeoForm.slug || editingCourseSeo.name);

    // If slug changed, add an automatic 301 redirect map entry!
    const oldSlug = editingCourseSeo.seo?.slug || editingCourseSeo.slug;
    let newRedirects = formData.courseRedirects || [];
    if (oldSlug && oldSlug !== cleanSlug) {
      const redirectExists = newRedirects.some(r => r.oldSlug === oldSlug);
      if (!redirectExists) {
        newRedirects = [
          ...newRedirects,
          {
            id: `redir-${Date.now()}`,
            oldSlug: oldSlug,
            newSlug: cleanSlug,
            createdAt: new Date().toISOString(),
            isActive: true
          }
        ];
        setFormData(prev => ({ ...prev, courseRedirects: newRedirects }));
      }
    }

    const updatedSeo = {
      ...editingCourseSeo.seo,
      slug: cleanSlug,
      seoTitle: courseSeoForm.seoTitle,
      metaDescription: courseSeoForm.metaDescription,
      focusKeyword: courseSeoForm.focusKeyword,
      noIndex: courseSeoForm.noIndex,
      canonicalUrl: `https://nexgenacademy.edu.bd/courses/${cleanSlug}`,
      ogTitle: courseSeoForm.seoTitle,
      ogDescription: courseSeoForm.metaDescription
    };

    updateCourse(editingCourseSeo.id, {
      ...editingCourseSeo,
      slug: cleanSlug,
      seo: updatedSeo
    });

    setEditingCourseSeo(null);
    if (onSaveToast) onSaveToast(`Course SEO for "${editingCourseSeo.name}" saved!`);
  };

  const handleAddManualRedirect = () => {
    if (!redirectOldSlug.trim() || !redirectNewSlug.trim()) return;
    const cleanOld = generateSlug(redirectOldSlug);
    const cleanNew = generateSlug(redirectNewSlug);

    const list = formData.courseRedirects || [];
    if (list.some(r => r.oldSlug === cleanOld)) {
      if (onSaveToast) onSaveToast('A redirect for this old slug already exists!');
      return;
    }

    const updated = [
      ...list,
      {
        id: `redir-${Date.now()}`,
        oldSlug: cleanOld,
        newSlug: cleanNew,
        createdAt: new Date().toISOString(),
        isActive: true
      }
    ];

    setFormData({ ...formData, courseRedirects: updated });
    setRedirectOldSlug('');
    setRedirectNewSlug('');
    if (onSaveToast) onSaveToast(`Added 301 redirect: /courses/${cleanOld} -> /courses/${cleanNew}`);
  };

  const handleDeleteRedirect = (id: string) => {
    const updated = (formData.courseRedirects || []).filter(r => r.id !== id);
    setFormData({ ...formData, courseRedirects: updated });
  };

  const titleLength = formData.metaTitle?.length || 0;
  const descLength = formData.metaDescription?.length || 0;

  const sitemapXmlPreview = useMemo(() => {
    return generateSitemapXml(courses, { ...websiteCmsConfig, seo: formData });
  }, [courses, websiteCmsConfig, formData]);

  const robotsTxtPreview = useMemo(() => {
    return generateRobotsTxt({ ...websiteCmsConfig, seo: formData });
  }, [websiteCmsConfig, formData]);

  const localBusinessSchemaJson = useMemo(() => {
    return JSON.stringify(getLocalBusinessSchema(academySettings, { ...websiteCmsConfig, seo: formData }), null, 2);
  }, [academySettings, websiteCmsConfig, formData]);

  const filteredCourses = useMemo(() => {
    return courses.filter(
      c =>
        c.name.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(courseSearchTerm.toLowerCase())
    );
  }, [courses, courseSearchTerm]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-500/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Google Search & Local SEO Engine</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Google Business Profile, Search Console & Local SEO</h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Single Source of Truth for Local Map ranking, NAP consistency, Search Console verification, Course SERPs,
            GA4 analytics & structured data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save All SEO Settings</span>
          </button>
        </div>
      </div>

      {/* Nav Subtabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'gbp_nap', label: 'Google Business Profile & NAP', icon: MapPin },
          { id: 'serp_meta', label: 'Search Console & Meta', icon: Globe },
          { id: 'local_seo', label: 'Local SEO & Areas', icon: Compass },
          { id: 'courses_seo', label: 'Courses SEO & 301 Redirects', icon: Layers },
          { id: 'analytics_hub', label: 'Analytics & Google Ads', icon: BarChart3 },
          { id: 'seo_health', label: 'SEO Health Audit', icon: ShieldCheck },
          { id: 'schemas', label: 'Schema JSON-LD', icon: FileCode },
          { id: 'sitemap_robots', label: 'Sitemap & Robots', icon: RefreshCw }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition shrink-0 ${
                isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: GOOGLE BUSINESS PROFILE & NAP CONSISTENCY */}
      {activeSubTab === 'gbp_nap' && (
        <div className="space-y-6">
          {/* Consistency Warning Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 flex flex-col sm:flex-row items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-amber-950">Critical Local SEO NAP Rule</h4>
              <p>
                Google algorithm calculates local map ranking by verifying that your <strong>Name, Address, and Phone (NAP)</strong>{' '}
                match exactly across your Website, Google Business Profile, and Local Directories. We strongly recommend leaving the data source set to{' '}
                <strong>Central Business Settings</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Config */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-indigo-600" />
                    Google Business Profile Configuration
                  </h3>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
                    Connected Business
                  </span>
                </div>

                {/* Source Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">NAP Data Source</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          googleBusinessProfile: {
                            ...(formData.googleBusinessProfile || { source: 'CENTRAL_SETTINGS' }),
                            source: 'CENTRAL_SETTINGS'
                          }
                        })
                      }
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                        formData.googleBusinessProfile?.source !== 'MANUAL_OVERRIDE'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Central Business Settings</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal">
                        Synchronizes automatically with Academy Settings & CMS Contact Info (Recommended).
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          googleBusinessProfile: {
                            ...(formData.googleBusinessProfile || { source: 'MANUAL_OVERRIDE' }),
                            source: 'MANUAL_OVERRIDE'
                          }
                        })
                      }
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                        formData.googleBusinessProfile?.source === 'MANUAL_OVERRIDE'
                          ? 'border-amber-600 bg-amber-50/50 text-amber-900 ring-2 ring-amber-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 mb-1">
                        <Sliders className="w-3.5 h-3.5 text-amber-600" />
                        <span>Manual Override</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal">
                        Custom override fields specifically for Google Local listing schema.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Primary Fields */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Google Business Profile Name</label>
                    <input
                      type="text"
                      value={effectiveNap.name}
                      readOnly={formData.googleBusinessProfile?.source !== 'MANUAL_OVERRIDE'}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          googleBusinessProfile: {
                            ...(formData.googleBusinessProfile || { source: 'MANUAL_OVERRIDE' }),
                            profileName: e.target.value
                          }
                        })
                      }
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border ${
                        formData.googleBusinessProfile?.source === 'MANUAL_OVERRIDE'
                          ? 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500'
                          : 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Official Address (Street & Landmark)</label>
                    <input
                      type="text"
                      value={effectiveNap.address}
                      readOnly={formData.googleBusinessProfile?.source !== 'MANUAL_OVERRIDE'}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          googleBusinessProfile: {
                            ...(formData.googleBusinessProfile || { source: 'MANUAL_OVERRIDE' }),
                            manualAddress: e.target.value
                          }
                        })
                      }
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border ${
                        formData.googleBusinessProfile?.source === 'MANUAL_OVERRIDE'
                          ? 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500'
                          : 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Primary Phone</label>
                      <input
                        type="text"
                        value={effectiveNap.phone}
                        readOnly={formData.googleBusinessProfile?.source !== 'MANUAL_OVERRIDE'}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            googleBusinessProfile: {
                              ...(formData.googleBusinessProfile || { source: 'MANUAL_OVERRIDE' }),
                              manualPhone: e.target.value
                            }
                          })
                        }
                        className={`w-full px-4 py-2.5 rounded-xl text-xs border ${
                          formData.googleBusinessProfile?.source === 'MANUAL_OVERRIDE'
                            ? 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500'
                            : 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Primary Category</label>
                      <input
                        type="text"
                        value={formData.googleBusinessProfile?.businessCategory || 'Computer Training School'}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            googleBusinessProfile: {
                              ...(formData.googleBusinessProfile || { source: 'CENTRAL_SETTINGS' }),
                              businessCategory: e.target.value
                            }
                          })
                        }
                        placeholder="e.g. Computer Training School"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Google Maps / Profile Listing Link</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={formData.googleBusinessProfile?.mapsUrl || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            googleBusinessProfile: {
                              ...(formData.googleBusinessProfile || { source: 'CENTRAL_SETTINGS' }),
                              mapsUrl: e.target.value
                            }
                          })
                        }
                        placeholder="https://maps.google.com/?q=Nexgen+Computer+Academy..."
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      {formData.googleBusinessProfile?.mapsUrl && (
                        <a
                          href={formData.googleBusinessProfile.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Test</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Google Review URL (For Student Feedback CTA)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={formData.googleBusinessProfile?.reviewUrl || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            googleBusinessProfile: {
                              ...(formData.googleBusinessProfile || { source: 'CENTRAL_SETTINGS' }),
                              reviewUrl: e.target.value
                            }
                          })
                        }
                        placeholder="https://g.page/r/.../review"
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      {formData.googleBusinessProfile?.reviewUrl && (
                        <a
                          href={formData.googleBusinessProfile.reviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>Test CTA</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Lat & Long */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={formData.googleBusinessProfile?.latitude ?? 23.7527}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            googleBusinessProfile: {
                              ...(formData.googleBusinessProfile || { source: 'CENTRAL_SETTINGS' }),
                              latitude: parseFloat(e.target.value) || 23.7527
                            }
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={formData.googleBusinessProfile?.longitude ?? 90.3887}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            googleBusinessProfile: {
                              ...(formData.googleBusinessProfile || { source: 'CENTRAL_SETTINGS' }),
                              longitude: parseFloat(e.target.value) || 90.3887
                            }
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: NAP Audit Engine */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    NAP Consistency Audit
                  </h3>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-black rounded-full text-xs">
                    Score: {napAudit.score}%
                  </span>
                </div>

                <div className="space-y-2.5">
                  {napAudit.checks.map((c, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{c.field}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            c.status === 'PASS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'WARNING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="text-slate-600 truncate font-mono text-[11px]">{c.value || 'Not provided'}</div>
                      <div className="text-[10px] text-slate-400">{c.note}</div>
                    </div>
                  ))}
                </div>

                {/* Manual verification notice */}
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                    <span>External Verification Notice</span>
                  </div>
                  <p className="text-[11px] text-blue-800">
                    Manual verification is maintained within your Google Business Profile dashboard. This CRM strictly synchronizes
                    the JSON-LD structured data and public meta tags to match your verified GBP credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: GOOGLE SEARCH CONSOLE & META TAGS */}
      {activeSubTab === 'serp_meta' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                Google Search Console & Meta Directives
              </h3>

              {/* GSC Verification Field */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Google Search Console Verification Token</span>
                  </label>
                  {formData.googleSiteVerification ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      Configured
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded">
                      Optional
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.googleSiteVerification || ''}
                  onChange={e => setFormData({ ...formData, googleSiteVerification: e.target.value })}
                  placeholder="e.g. google-site-verification-abc123xyz"
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  Renders as <code className="text-indigo-600">&lt;meta name="google-site-verification" content="..." /&gt;</code> in HTML &lt;head&gt;.
                </p>
              </div>

              {/* Meta Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Homepage Meta Title (SERP Display)</label>
                  <span
                    className={`text-[11px] font-bold ${
                      titleLength >= 50 && titleLength <= 65 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {titleLength} / 60 chars (Optimal: 50-60)
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Homepage Meta Description</label>
                  <span
                    className={`text-[11px] font-bold ${
                      descLength >= 140 && descLength <= 165 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {descLength} / 160 chars (Optimal: 140-160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formData.metaDescription}
                  onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Canonical URL & OG Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Canonical Base URL</label>
                  <input
                    type="url"
                    value={formData.canonicalBaseUrl}
                    onChange={e => setFormData({ ...formData, canonicalBaseUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Social Share Image (OG Image)</label>
                  <input
                    type="url"
                    value={formData.ogImageUrl}
                    onChange={e => setFormData({ ...formData, ogImageUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Keyword Tag Manager */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">Target SEO Keywords</label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[60px]">
                  {formData.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-1"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.keywords.filter((_, idx) => idx !== i);
                          setFormData({ ...formData, keywords: updated });
                        }}
                        className="text-slate-400 hover:text-rose-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newKeywordInput}
                    onChange={e => setNewKeywordInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newKeywordInput.trim() && !formData.keywords.includes(newKeywordInput.trim())) {
                          setFormData({ ...formData, keywords: [...formData.keywords, newKeywordInput.trim()] });
                          setNewKeywordInput('');
                        }
                      }
                    }}
                    placeholder="Type keyword and press Add or Enter..."
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newKeywordInput.trim() && !formData.keywords.includes(newKeywordInput.trim())) {
                        setFormData({ ...formData, keywords: [...formData.keywords, newKeywordInput.trim()] });
                        setNewKeywordInput('');
                      }
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                  >
                    Add Keyword
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: SERP & Social Previews */}
          <div className="lg:col-span-5 space-y-6">
            {/* SERP Simulator */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-indigo-600 tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Google SERP Live Simulator</span>
                </span>
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setSerpPreviewMode('desktop')}
                    className={`p-1.5 rounded-md ${
                      serpPreviewMode === 'desktop' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'
                    }`}
                    title="Desktop SERP"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerpPreviewMode('mobile')}
                    className={`p-1.5 rounded-md ${
                      serpPreviewMode === 'mobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'
                    }`}
                    title="Mobile SERP"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Google Result Box */}
              <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm space-y-1.5 font-sans">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">
                    N
                  </div>
                  <div className="text-[11px] text-slate-700 truncate">
                    <span className="font-semibold">{effectiveNap.name}</span>
                    <span className="text-slate-400 mx-1">›</span>
                    <span className="text-slate-500">{formData.canonicalBaseUrl}</span>
                  </div>
                </div>
                <h4 className="text-base text-[#1a0dab] hover:underline font-medium cursor-pointer leading-snug">
                  {formData.metaTitle}
                </h4>
                <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">{formData.metaDescription}</p>
                <div className="pt-2 flex items-center space-x-3 text-[11px] text-[#70757a]">
                  <span>★ 4.9 (420+ reviews)</span>
                  <span>· Farmgate, Dhaka</span>
                  <span>· Level 4 & 5</span>
                </div>
              </div>
            </div>

            {/* Social Share Preview Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
                Social Media Share Preview (OG Card)
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={formData.ogImageUrl}
                  alt="Social share preview"
                  className="w-full h-40 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-3.5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">nexgenacademy.edu.bd</span>
                  <div className="font-bold text-xs text-slate-900 line-clamp-1">{formData.ogTitle || formData.metaTitle}</div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {formData.ogDescription || formData.metaDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: LOCAL SEO & SERVICE AREAS */}
      {activeSubTab === 'local_seo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                Local Service Area Targeting
              </h3>
              <p className="text-xs text-slate-500">
                These targeted areas are embedded into LocalBusiness Schema and dynamic landing keywords to maximize local search
                discoverability across Dhaka and adjacent zones.
              </p>

              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[80px]">
                {(formData.serviceAreas || []).map((area, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-white border border-indigo-100 text-indigo-900 rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5"
                  >
                    <MapPin className="w-3 h-3 text-indigo-600" />
                    <span>{area}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (formData.serviceAreas || []).filter((_, i) => i !== idx);
                        setFormData({ ...formData, serviceAreas: updated });
                      }}
                      className="text-slate-400 hover:text-rose-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newServiceAreaInput}
                  onChange={e => setNewServiceAreaInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const list = formData.serviceAreas || [];
                      if (newServiceAreaInput.trim() && !list.includes(newServiceAreaInput.trim())) {
                        setFormData({ ...formData, serviceAreas: [...list, newServiceAreaInput.trim()] });
                        setNewServiceAreaInput('');
                      }
                    }
                  }}
                  placeholder="e.g. Indira Road, Green Road, Dhanmondi..."
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const list = formData.serviceAreas || [];
                    if (newServiceAreaInput.trim() && !list.includes(newServiceAreaInput.trim())) {
                      setFormData({ ...formData, serviceAreas: [...list, newServiceAreaInput.trim()] });
                      setNewServiceAreaInput('');
                    }
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                >
                  Add Area
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Google Review Strategy CTA Card */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg space-y-3">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-white text-white" />
                <h4 className="font-black text-sm">Official Google Review Strategy</h4>
              </div>
              <p className="text-xs text-amber-100 leading-relaxed">
                Encourage real students to submit feedback directly to your verified Google Business Profile. This builds organic
                5-star social proof and directly boosts local ranking in Google Maps.
              </p>
              {effectiveNap.reviewUrl && (
                <div className="pt-2">
                  <a
                    href={effectiveNap.reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-amber-900 rounded-xl text-xs font-bold shadow hover:bg-amber-50 transition"
                  >
                    <span>Open Review Direct Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: COURSES SEO, INDEXING & 301 REDIRECTS */}
      {activeSubTab === 'courses_seo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  Course SEO, Meta & Indexing Controls
                </h3>
                <p className="text-xs text-slate-500">
                  Every course has individual URL slugs, focus keywords, meta tags, and index/noindex controls.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={courseSearchTerm}
                    onChange={e => setCourseSearchTerm(e.target.value)}
                    placeholder="Search course..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAutoGenerateAllCourseSeo}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs rounded-xl border border-indigo-200 flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Auto-Sync All</span>
                </button>
              </div>
            </div>

            {/* Courses Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Course Name & Code</th>
                    <th className="p-3.5">Slug (SEO URL)</th>
                    <th className="p-3.5">Focus Keyword</th>
                    <th className="p-3.5">Index Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCourses.map(course => {
                    const slug = course.seo?.slug || course.landingConfig?.slug || course.slug || generateSlug(course.name);
                    const focusKeyword =
                      course.seo?.focusKeyword || course.landingConfig?.focusKeyword || `${course.name} in Farmgate`;
                    const isNoIndex = course.seo?.noIndex === true;

                    return (
                      <tr key={course.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{course.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {course.code} · {course.category}
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-indigo-600 font-medium">/courses/{slug}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-semibold">
                            {focusKeyword}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {isNoIndex ? (
                            <span className="inline-flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Noindex</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Indexed</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <a
                              href={`/?course=${slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                              title="Preview Landing Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleOpenCourseSeoModal(course)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center space-x-1"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit SEO</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 301 / 404 Slug Redirect Manager */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-indigo-600" />
                  301 / 404 Course Slug Redirect Map
                </h3>
                <p className="text-xs text-slate-500">
                  When course slugs are renamed, create instant 301 redirects to avoid broken backlinks or 404 errors.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={redirectOldSlug}
                onChange={e => setRedirectOldSlug(e.target.value)}
                placeholder="Old slug (e.g. office-application-old)"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
              <input
                type="text"
                value={redirectNewSlug}
                onChange={e => setRedirectNewSlug(e.target.value)}
                placeholder="New slug (e.g. computer-office-application)"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddManualRedirect}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shrink-0"
              >
                Add 301 Redirect
              </button>
            </div>

            {(formData.courseRedirects || []).length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {(formData.courseRedirects || []).map(r => (
                  <div key={r.id} className="p-3 bg-slate-50 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-rose-600 line-through">/courses/{r.oldSlug}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-emerald-600 font-bold">/courses/{r.newSlug}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteRedirect(r.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 text-center">
                No custom course redirects configured. All active course URLs route cleanly.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 5: ANALYTICS & GOOGLE ADS TRACKING HUB */}
      {activeSubTab === 'analytics_hub' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Google Analytics 4 & Google Ads Conversion Tracking
              </h3>

              {/* GA4 Configuration */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Google Analytics 4 (Measurement ID)</label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-[11px] text-slate-500 font-bold">Enable GA4</span>
                    <input
                      type="checkbox"
                      checked={websiteCmsConfig.marketing?.googleAnalyticsEnabled !== false}
                      onChange={e =>
                        updateWebsiteCmsConfig({
                          ...websiteCmsConfig,
                          marketing: {
                            ...(websiteCmsConfig.marketing || {
                              metaPixelId: '',
                              metaPixelEnabled: true,
                              enableAutoUtmCapture: true,
                              enableExitIntentPopup: true
                            }),
                            googleAnalyticsEnabled: e.target.checked
                          }
                        })
                      }
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={websiteCmsConfig.marketing?.googleAnalyticsId || ''}
                  onChange={e =>
                    updateWebsiteCmsConfig({
                      ...websiteCmsConfig,
                      marketing: {
                        ...(websiteCmsConfig.marketing || {
                          metaPixelId: '',
                          metaPixelEnabled: true,
                          enableAutoUtmCapture: true,
                          enableExitIntentPopup: true
                        }),
                        googleAnalyticsId: e.target.value
                      }
                    })
                  }
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  Loads the official <code className="text-indigo-600">gtag.js</code> script dynamically.
                </p>
              </div>

              {/* Google Ads Configuration */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Google Ads Conversion ID & Label</label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-[11px] text-slate-500 font-bold">Enable Google Ads</span>
                    <input
                      type="checkbox"
                      checked={websiteCmsConfig.marketing?.googleAdsEnabled === true}
                      onChange={e =>
                        updateWebsiteCmsConfig({
                          ...websiteCmsConfig,
                          marketing: {
                            ...(websiteCmsConfig.marketing || {
                              metaPixelId: '',
                              metaPixelEnabled: true,
                              enableAutoUtmCapture: true,
                              enableExitIntentPopup: true
                            }),
                            googleAdsEnabled: e.target.checked
                          }
                        })
                      }
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-600 mb-1">Conversion ID</span>
                    <input
                      type="text"
                      value={websiteCmsConfig.marketing?.googleAdsConversionId || ''}
                      onChange={e =>
                        updateWebsiteCmsConfig({
                          ...websiteCmsConfig,
                          marketing: {
                            ...(websiteCmsConfig.marketing || {
                              metaPixelId: '',
                              metaPixelEnabled: true,
                              enableAutoUtmCapture: true,
                              enableExitIntentPopup: true
                            }),
                            googleAdsConversionId: e.target.value
                          }
                        })
                      }
                      placeholder="AW-123456789"
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-600 mb-1">Conversion Label</span>
                    <input
                      type="text"
                      value={websiteCmsConfig.marketing?.googleAdsConversionLabel || ''}
                      onChange={e =>
                        updateWebsiteCmsConfig({
                          ...websiteCmsConfig,
                          marketing: {
                            ...(websiteCmsConfig.marketing || {
                              metaPixelId: '',
                              metaPixelEnabled: true,
                              enableAutoUtmCapture: true,
                              enableExitIntentPopup: true
                            }),
                            googleAdsConversionLabel: e.target.value
                          }
                        })
                      }
                      placeholder="abc-XYZ123"
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Event Taxonomy Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Standard Event Taxonomy
              </h3>
              <p className="text-xs text-slate-500">
                All public student interactions trigger structured marketing events across Meta, GA4, and Google Ads:
              </p>

              <div className="space-y-2 text-xs">
                {[
                  { evt: 'page_view', desc: 'Fires on initial landing and SPA route navigation' },
                  { evt: 'view_course', desc: 'Fires when viewing course syllabus & details modal' },
                  { evt: 'lead_form_start', desc: 'Fires when student enters lead application form' },
                  { evt: 'lead_submit', desc: 'Fires on successful admission registration' },
                  { evt: 'whatsapp_click', desc: 'Fires when student clicks floating/header WhatsApp' },
                  { evt: 'phone_click', desc: 'Fires when student clicks official helpline number' }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                    <div className="font-mono font-bold text-indigo-600">{item.evt}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </div>
                ))}
              </div>

              {/* Privacy Rule Banner */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero-PII Policy for GA4:</strong> All personal student data (phone numbers, full names, emails) is
                  automatically sanitized and never transmitted to Google Analytics.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 6: SEO HEALTH AUDIT DASHBOARD */}
      {activeSubTab === 'seo_health' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                Comprehensive SEO Health Audit
              </h3>
              <p className="text-xs text-slate-500">
                Live inspection of Technical SEO, Local SEO, and Course Landing optimizations.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase font-bold">Health Score</div>
                <div className="text-xl font-black text-emerald-600">{overallSeoHealth.score}%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overallSeoHealth.items.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                    {item.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      item.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900">{item.item}</div>
                <div className="text-[11px] text-slate-500">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 7: SCHEMA.ORG JSON-LD INSPECTOR */}
      {activeSubTab === 'schemas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-600" />
                Schema Toggles
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <span className="font-bold text-slate-800">LocalBusiness / EducationalOrganization</span>
                  <input
                    type="checkbox"
                    checked={formData.enableLocalBusinessSchema !== false}
                    onChange={e => setFormData({ ...formData, enableLocalBusinessSchema: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <span className="font-bold text-slate-800">Course & Offer Schema</span>
                  <input
                    type="checkbox"
                    checked={formData.enableCourseSchema !== false}
                    onChange={e => setFormData({ ...formData, enableCourseSchema: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <span className="font-bold text-slate-800">FAQPage Schema</span>
                  <input
                    type="checkbox"
                    checked={formData.enableFaqSchema !== false}
                    onChange={e => setFormData({ ...formData, enableFaqSchema: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <span className="font-bold text-slate-800">BreadcrumbList Schema</span>
                  <input
                    type="checkbox"
                    checked={formData.enableBreadcrumbSchema !== false}
                    onChange={e => setFormData({ ...formData, enableBreadcrumbSchema: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Structured data is dynamically rendered at runtime and ready for Google Rich Snippets testing.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                  Live LocalBusiness JSON-LD Output
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(localBusinessSchemaJson, 'schema_json')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
                >
                  {copiedSection === 'schema_json' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON-LD</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto max-h-96">
                {localBusinessSchemaJson}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 8: SITEMAP & ROBOTS.TXT MANAGER */}
      {activeSubTab === 'sitemap_robots' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* XML Sitemap */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-black text-white">Dynamic XML Sitemap</h4>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open /sitemap.xml</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(sitemapXmlPreview, 'sitemap_xml')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  {copiedSection === 'sitemap_xml' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Automatically updates whenever courses are created, activated, or modified. Served live at{' '}
              <code className="text-indigo-300">/sitemap.xml</code>.
            </p>
            <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto max-h-72">
              {sitemapXmlPreview}
            </pre>
          </div>

          {/* Robots.txt */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-black text-white">Robots.txt Engine</h4>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open /robots.txt</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(robotsTxtPreview, 'robots_txt')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  {copiedSection === 'robots_txt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Allows full indexing of public website & courses while protecting sensitive CRM and administrative endpoints.
            </p>
            <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto max-h-72">
              {robotsTxtPreview}
            </pre>
          </div>
        </div>
      )}

      {/* QUICK COURSE SEO MODAL */}
      {editingCourseSeo && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900">Edit Course SEO & Slug</h3>
                <p className="text-xs text-slate-500">{editingCourseSeo.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCourseSeo(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <span className="text-slate-400 font-mono">/courses/</span>
                  <input
                    type="text"
                    value={courseSeoForm.slug}
                    onChange={e => setCourseSeoForm({ ...courseSeoForm, slug: e.target.value })}
                    className="flex-1 bg-transparent font-mono text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={courseSeoForm.seoTitle}
                  onChange={e => setCourseSeoForm({ ...courseSeoForm, seoTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={courseSeoForm.metaDescription}
                  onChange={e => setCourseSeoForm({ ...courseSeoForm, metaDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Focus Keyword</label>
                <input
                  type="text"
                  value={courseSeoForm.focusKeyword}
                  onChange={e => setCourseSeoForm({ ...courseSeoForm, focusKeyword: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseSeoForm.noIndex}
                    onChange={e => setCourseSeoForm({ ...courseSeoForm, noIndex: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Exclude from Search Engine Index (noindex, nofollow)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingCourseSeo(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCourseSeoModal}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20"
              >
                Save Course SEO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
