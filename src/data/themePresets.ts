import { ThemeConfig } from '../types';

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  erpPrimaryColor: '#4f46e5', // Indigo-600
  erpSecondaryColor: '#f59e0b', // Amber-500
  erpFontFamily: 'Plus Jakarta Sans',
  
  websitePrimaryColor: '#4f46e5', // Indigo-600
  websiteSecondaryColor: '#f59e0b', // Amber-500
  websiteHeadingFont: 'Plus Jakarta Sans',
  websiteBodyFont: 'Inter',
  activePreset: 'royal_indigo',
  borderRadius: 'rounded-2xl'
};

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  erpPrimaryColor: string;
  erpSecondaryColor: string;
  erpFontFamily: string;
  websitePrimaryColor: string;
  websiteSecondaryColor: string;
  websiteHeadingFont: string;
  websiteBodyFont: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'royal_indigo',
    name: 'Nexgen Royal Indigo',
    description: 'Signature academy look with deep royal indigo and vibrant warm amber accents.',
    badge: 'Signature Default',
    erpPrimaryColor: '#4f46e5',
    erpSecondaryColor: '#f59e0b',
    erpFontFamily: 'Plus Jakarta Sans',
    websitePrimaryColor: '#4f46e5',
    websiteSecondaryColor: '#f59e0b',
    websiteHeadingFont: 'Plus Jakarta Sans',
    websiteBodyFont: 'Inter'
  },
  {
    id: 'modern_tech',
    name: 'Electric Tech Blue',
    description: 'Clean modern Silicon Valley SaaS aesthetic with crisp electric blue and cyan accents.',
    badge: 'Tech & Coding',
    erpPrimaryColor: '#2563eb',
    erpSecondaryColor: '#06b6d4',
    erpFontFamily: 'Outfit',
    websitePrimaryColor: '#2563eb',
    websiteSecondaryColor: '#06b6d4',
    websiteHeadingFont: 'Outfit',
    websiteBodyFont: 'DM Sans'
  },
  {
    id: 'emerald_academy',
    name: 'Emerald Prestige',
    description: 'Sophisticated botanical green with gold highlights, expressing authority and academic growth.',
    badge: 'Academic & Trust',
    erpPrimaryColor: '#059669',
    erpSecondaryColor: '#eab308',
    erpFontFamily: 'Plus Jakarta Sans',
    websitePrimaryColor: '#059669',
    websiteSecondaryColor: '#eab308',
    websiteHeadingFont: 'Playfair Display',
    websiteBodyFont: 'Plus Jakarta Sans'
  },
  {
    id: 'cyber_violet',
    name: 'Cyber Violet & Magenta',
    description: 'Creative design & multimedia powerhouse vibe with deep purple and electric magenta.',
    badge: 'Creative & UI/UX',
    erpPrimaryColor: '#7c3aed',
    erpSecondaryColor: '#ec4899',
    erpFontFamily: 'Plus Jakarta Sans',
    websitePrimaryColor: '#7c3aed',
    websiteSecondaryColor: '#ec4899',
    websiteHeadingFont: 'Syne',
    websiteBodyFont: 'Inter'
  },
  {
    id: 'executive_crimson',
    name: 'Executive Crimson',
    description: 'High-contrast bold crimson red with corporate slate accents for institutional strength.',
    badge: 'Corporate & Bold',
    erpPrimaryColor: '#dc2626',
    erpSecondaryColor: '#475569',
    erpFontFamily: 'Plus Jakarta Sans',
    websitePrimaryColor: '#dc2626',
    websiteSecondaryColor: '#f97316',
    websiteHeadingFont: 'Montserrat',
    websiteBodyFont: 'Inter'
  },
  {
    id: 'oceanic_teal',
    name: 'Oceanic Teal & Sky',
    description: 'Calm, refreshing teal and azure sky palette promoting focus and pleasant readability.',
    badge: 'Calm & Modern',
    erpPrimaryColor: '#0d9488',
    erpSecondaryColor: '#0284c7',
    erpFontFamily: 'DM Sans',
    websitePrimaryColor: '#0d9488',
    websiteSecondaryColor: '#0ea5e9',
    websiteHeadingFont: 'Space Grotesk',
    websiteBodyFont: 'DM Sans'
  },
  {
    id: 'midnight_obsidian',
    name: 'Obsidian & Indigo',
    description: 'Premium dark-tinted obsidian neutral with luminous indigo accents.',
    badge: 'Pro Minimalist',
    erpPrimaryColor: '#1e293b',
    erpSecondaryColor: '#6366f1',
    erpFontFamily: 'Inter',
    websitePrimaryColor: '#0f172a',
    websiteSecondaryColor: '#6366f1',
    websiteHeadingFont: 'Plus Jakarta Sans',
    websiteBodyFont: 'Inter'
  },
  {
    id: 'bilingual_bengali',
    name: 'Bengali & English Optimized',
    description: 'Custom-tuned with Hind Siliguri for seamless, elegant Bangla and English glyph rendering.',
    badge: 'Bangla Friendly',
    erpPrimaryColor: '#4338ca',
    erpSecondaryColor: '#ea580c',
    erpFontFamily: 'Hind Siliguri',
    websitePrimaryColor: '#4338ca',
    websiteSecondaryColor: '#ea580c',
    websiteHeadingFont: 'Hind Siliguri',
    websiteBodyFont: 'Hind Siliguri'
  }
];

export interface FontOption {
  id: string;
  name: string;
  category: string;
  description: string;
  sampleText: string;
}

export const ERP_FONT_OPTIONS: FontOption[] = [
  {
    id: 'Plus Jakarta Sans',
    name: 'Plus Jakarta Sans',
    category: 'Geometric Sans',
    description: 'Ultra-clean modern geometry, highly readable in dense data tables and forms.',
    sampleText: 'Nexgen ERP 2026 • ৳5,500 Fee Collected'
  },
  {
    id: 'Inter',
    name: 'Inter',
    category: 'Neo-grotesque Sans',
    description: 'Industry standard for web application interfaces, optimal pixel clarity.',
    sampleText: 'Active Students: 1,420 • Attendance: 94%'
  },
  {
    id: 'Outfit',
    name: 'Outfit',
    category: 'Modern Sans',
    description: 'Friendly, contemporary letterforms with balanced proportions.',
    sampleText: 'Course Fee: ৳12,000 • Batch NCA-WD-02'
  },
  {
    id: 'DM Sans',
    name: 'DM Sans',
    category: 'Geometric Sans',
    description: 'Low-contrast sans-serif designed for clear reading at compact sizes.',
    sampleText: 'Accounts Ledger • Income & Expense Vouchers'
  },
  {
    id: 'Poppins',
    name: 'Poppins',
    category: 'Geometric Sans',
    description: 'Rounded, approachable geometric structure with wide optical appeal.',
    sampleText: 'Lead CRM • 48 New Inquiries Today'
  },
  {
    id: 'Hind Siliguri',
    name: 'Hind Siliguri (Bangla + English)',
    category: 'Multilingual Sans',
    description: 'Flawless rendering for Bengali typography alongside crisp English numerals.',
    sampleText: 'নেক্সজেন কম্পিউটার একাডেমি • Admission Portal'
  },
  {
    id: 'Fira Sans',
    name: 'Fira Sans',
    category: 'Technical Sans',
    description: 'Designed for technical precision and structured data readability.',
    sampleText: 'NCA-CERT-2026-892 • Grade: A+ (92%)'
  }
];

export const WEBSITE_HEADING_FONT_OPTIONS: FontOption[] = [
  {
    id: 'Plus Jakarta Sans',
    name: 'Plus Jakarta Sans',
    category: 'Geometric Sans',
    description: 'Modern, high-energy tech look for striking headlines and hero titles.',
    sampleText: 'Master In-Demand Tech & Creative Skills'
  },
  {
    id: 'Outfit',
    name: 'Outfit',
    category: 'Modern Sans',
    description: 'Dynamic, premium brand typography that commands attention.',
    sampleText: 'Build Your Global Freelancing Career'
  },
  {
    id: 'Syne',
    name: 'Syne',
    category: 'Display Sans',
    description: 'Artistic, avant-garde and bold display typeface for creative institutes.',
    sampleText: 'Design The Future With AI & Code'
  },
  {
    id: 'Montserrat',
    name: 'Montserrat',
    category: 'Classic Display',
    description: 'Authoritative, wide geometric uppercase & title branding.',
    sampleText: 'GOVERNMENT CERTIFIED IT TRAINING'
  },
  {
    id: 'Playfair Display',
    name: 'Playfair Display',
    category: 'Serif Display',
    description: 'Editorial elegance, prestige and university-grade heritage feel.',
    sampleText: 'Excellence in Professional Skills'
  },
  {
    id: 'Space Grotesk',
    name: 'Space Grotesk',
    category: 'Tech Display',
    description: 'Futuristic, engineering-inspired aesthetic for coding and AI programs.',
    sampleText: 'Full-Stack Software & AI Development'
  },
  {
    id: 'Hind Siliguri',
    name: 'Hind Siliguri',
    category: 'Multilingual Title',
    description: 'Magnificent Bengali headline styling with sharp stroke definition.',
    sampleText: 'দক্ষতা অর্জন করুন, স্বাবলম্বী হোন'
  },
  {
    id: 'Inter',
    name: 'Inter',
    category: 'Minimalist Sans',
    description: 'Clean, understated and functional modern headline style.',
    sampleText: 'Professional IT Skills & Job Placement'
  }
];

export const WEBSITE_BODY_FONT_OPTIONS: FontOption[] = [
  {
    id: 'Inter',
    name: 'Inter',
    category: 'Body Sans',
    description: 'Maximum reading comfort across long course curricula and FAQs.',
    sampleText: 'Hands-on practical classes with 100% lab practice and lifetime support.'
  },
  {
    id: 'Plus Jakarta Sans',
    name: 'Plus Jakarta Sans',
    category: 'Body Sans',
    description: 'Smooth, cohesive body pairing that matches tech headline fonts.',
    sampleText: 'Learn modern industry workflows with senior mentors and live client projects.'
  },
  {
    id: 'DM Sans',
    name: 'DM Sans',
    category: 'Body Sans',
    description: 'Clear, spacious rhythm designed for screen reading comfort.',
    sampleText: 'Flexible batch timings with weekday and Friday/Saturday weekend schedules.'
  },
  {
    id: 'Outfit',
    name: 'Outfit',
    category: 'Body Sans',
    description: 'Warm and friendly tone for course descriptions and reviews.',
    sampleText: 'Over 8,500+ successful graduates placed in top software firms.'
  },
  {
    id: 'Hind Siliguri',
    name: 'Hind Siliguri',
    category: 'Multilingual Body',
    description: 'Comfortable reading for Bengali articles, notices, and course details.',
    sampleText: 'অভিজ্ঞ ট্রেইনারদের সরাসরি তত্ত্বাবধানে বাস্তবমুখী প্রজেক্ট ভিত্তিক ট্রেনিং।'
  },
  {
    id: 'Poppins',
    name: 'Poppins',
    category: 'Body Sans',
    description: 'Soft rounded structure creating an approachable, friendly feeling.',
    sampleText: 'Online live classes with recorded backup sessions available 24/7.'
  }
];

export const POPULAR_COLOR_PALETTES = [
  { name: 'Royal Indigo', hex: '#4f46e5', hoverHex: '#4338ca', lightHex: '#eef2ff' },
  { name: 'Electric Blue', hex: '#2563eb', hoverHex: '#1d4ed8', lightHex: '#eff6ff' },
  { name: 'Emerald Green', hex: '#059669', hoverHex: '#047857', lightHex: '#ecfdf5' },
  { name: 'Cyber Violet', hex: '#7c3aed', hoverHex: '#6d28d9', lightHex: '#f5f3ff' },
  { name: 'Crimson Red', hex: '#dc2626', hoverHex: '#b91c1c', lightHex: '#fef2f2' },
  { name: 'Oceanic Teal', hex: '#0d9488', hoverHex: '#0f766e', lightHex: '#f0fdfa' },
  { name: 'Sunset Amber', hex: '#d97706', hoverHex: '#b45309', lightHex: '#fffbeb' },
  { name: 'Rose Pink', hex: '#e11d48', hoverHex: '#be123c', lightHex: '#fff1f2' },
  { name: 'Dark Slate', hex: '#0f172a', hoverHex: '#1e293b', lightHex: '#f8fafc' },
  { name: 'Deep Cyan', hex: '#0891b2', hoverHex: '#0e7490', lightHex: '#ecfeff' }
];

export function hexToRgbString(hex: string): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '79, 70, 229';
}

export function applyThemeToDom(theme?: Partial<ThemeConfig>) {
  if (typeof document === 'undefined') return;

  const currentTheme = {
    ...DEFAULT_THEME_CONFIG,
    ...(theme || {})
  };

  const root = document.documentElement;

  // Set CSS Variables
  root.style.setProperty('--erp-primary', currentTheme.erpPrimaryColor);
  root.style.setProperty('--erp-primary-rgb', hexToRgbString(currentTheme.erpPrimaryColor));
  root.style.setProperty('--erp-secondary', currentTheme.erpSecondaryColor);
  root.style.setProperty('--erp-secondary-rgb', hexToRgbString(currentTheme.erpSecondaryColor));

  root.style.setProperty('--website-primary', currentTheme.websitePrimaryColor);
  root.style.setProperty('--website-primary-rgb', hexToRgbString(currentTheme.websitePrimaryColor));
  root.style.setProperty('--website-secondary', currentTheme.websiteSecondaryColor);
  root.style.setProperty('--website-secondary-rgb', hexToRgbString(currentTheme.websiteSecondaryColor));

  root.style.setProperty('--font-erp', `'${currentTheme.erpFontFamily}', system-ui, -apple-system, sans-serif`);
  root.style.setProperty('--font-website-heading', `'${currentTheme.websiteHeadingFont}', system-ui, -apple-system, sans-serif`);
  root.style.setProperty('--font-website-body', `'${currentTheme.websiteBodyFont}', system-ui, -apple-system, sans-serif`);
}
