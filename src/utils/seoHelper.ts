import { AcademySettings, Course, GlobalSeoConfig, CourseSEOConfig, WebsiteCmsConfig, Staff } from '../types';

export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars except hyphen & whitespace
    .replace(/[\s_-]+/g, '-') // collapse whitespace and dashes into single dash
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
}

export interface SeoMetadataPayload {
  title: string;
  metaDescription: string;
  keywords?: string[];
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  jsonLdSchemas?: object[];
  author?: string;
  siteName?: string;
}

/**
 * Builds dynamic metadata for the main website / homepage
 */
export function getHomepageSeoMetadata(
  academySettings: AcademySettings,
  cmsConfig: WebsiteCmsConfig
): SeoMetadataPayload {
  const seo = cmsConfig.seo;
  const baseUrl = seo?.canonicalBaseUrl || 'https://nexgenacademy.edu.bd';
  const instituteName = academySettings.instituteName || 'Nexgen Computer Academy';
  const address = cmsConfig.officeAddress || academySettings.officialAddress || 'Farmgate, Dhaka-1215, Bangladesh';
  const phone = cmsConfig.whatsappSupportNumber || academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444';
  const email = academySettings.officialEmail || 'info@nexgenacademy.edu.bd';

  const title = seo?.metaTitle || `${instituteName} - Best Computer Training Center in Farmgate, Dhaka`;
  const metaDescription =
    seo?.metaDescription ||
    `${instituteName} at Farmgate, Dhaka (close to Panthapath, Tejgaon & Dhanmondi). 100% practical lab training in Computer Office Application, Advanced Excel, Web Dev & Freelancing with verifiable certification.`;

  const defaultKeywords = [
    // English & Commercial Intent Keywords
    'Computer Course in Farmgate',
    'Computer Training Center in Farmgate Dhaka',
    'Computer Training in Tejgaon',
    'Computer Institute near Panthapath',
    'Computer Course in Dhanmondi',
    'Best Computer Training Center in Farmgate Dhaka',
    'Computer Office Application Course',
    'Advanced Excel Course in Farmgate',
    'Corporate MS Excel & Financial Modeling',
    'AutoCAD 2D 3D Course in Dhaka',
    'AutoCAD Training Center Farmgate',
    'Civil & Architectural CAD Drafting',
    'Video Editing Course in Dhaka',
    'Premiere Pro & After Effects Training Farmgate',
    'Motion Graphics & YouTube Video Editing',
    'Digital Marketing Course Dhaka',
    'Facebook Marketing & Meta Ads Training',
    'Social Media Marketing Course Farmgate',
    'SEO Training in Bangladesh',
    'Search Engine Optimization Course Farmgate',
    'French Language Course in Dhaka',
    'French A1 A2 Spoken Course Farmgate',
    'French for Study Visa Preparation',
    'AI Automation Course Dhaka',
    'Prompt Engineering & ChatGPT Productivity',
    'UI UX Design Course in Dhaka',
    'Figma UI UX Training Farmgate',
    'Web Design and Development Course Dhaka',
    'Full Stack MERN Web Development Farmgate',
    'Graphic Design Course Farmgate',
    'Freelancing Course in Farmgate Dhaka',
    'Fiverr & Upwork Marketplace Training',
    'Govt Certified Computer Course Farmgate',
    'Graphic Design Course Fee in Dhaka',
    'AutoCAD Course Fee in Dhaka',
    'Computer Course Fee Farmgate Dhaka',
    
    // Bangladeshi Native Bangla Queries (বাংলা সার্চ কি-ওয়ার্ড)
    'কম্পিউটার কোর্স ঢাকা ফার্মগেট',
    'গ্রাফিক ডিজাইন কোর্স ফি কত',
    'ভিডিও এডিটিং কোর্স ঢাকা',
    'অটোক্যাড টুডি থ্রিডি কোর্স ফার্মগেট',
    'ডিজিটাল মার্কেটিং ও ফেসবুক অ্যাডস কোর্স',
    'ফ্রেঞ্চ ভাষা শিক্ষা কোর্স ঢাকা',
    'অ্যাডভান্সড এক্সেল ট্রেনিং ঢাকা',
    'সরকারি সার্টিফিকেট সহ কম্পিউটার ট্রেনিং',
    'অনলাইন ফ্রিল্যান্সিং কোর্স ফার্মগেট',
    'ফার্মগেট মেট্রো রেল সংলগ্ন কম্পিউটার একাডেমি',

    // Nationwide Online Course Searches (সারাদেশের অনলাইন কোর্স কি-ওয়ার্ড)
    'Online Computer Course in Bangladesh',
    'Best Online IT Training Institute in Bangladesh',
    'Online Graphic Design Course BD',
    'Online Video Editing Course in Bangladesh',
    'Online AutoCAD Course Bangladesh',
    'Online Digital Marketing Course with Certificate BD',
    'Online Web Development Live Batch BD',
    'Online French Language Course in Bangladesh',
    'Online Freelancing Course Bangladesh',
    'Online IT Training with Live Zoom Class',
    'ঘরে বসে অনলাইন কম্পিউটার কোর্স সার্টিফিকেট সহ',
    'অনলাইন গ্রাফিক ডিজাইন লাইভ কোর্স বাংলাদেশ',
    'অনলাইনে ভিডিও এডিটিং শেখার সেরা প্রতিষ্ঠান',
    'অনলাইন অটোক্যাড কোর্স ফি কত',
    'অনলাইনে ফ্রিল্যান্সিং ও ডিজিটাল মার্কেটিং ট্রেনিং',
    'লাইভ জুম ক্লাস ও রেকর্ডেড ক্লাস সুবিধা সহ আইটি কোর্স',
    'অনলাইন আইটি কোর্স সার্টিফিকেট বাংলাদেশ'
  ];

  const keywords = seo?.keywords && seo.keywords.length > 0 ? seo.keywords : defaultKeywords;

  const canonicalUrl = `${baseUrl.replace(/\/+$/, '')}/`;
  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || metaDescription;
  const ogImage = seo?.ogImageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200';

  // Build JSON-LD Schemas
  const schemas: object[] = [];

  if (seo?.enableLocalBusinessSchema !== false) {
    schemas.push(getLocalBusinessSchema(academySettings, cmsConfig));
  }

  const defaultFaqItems = [
    {
      question: 'ফার্মগেটে কম্পিউটার ও আইটি কোর্সের কোর্স ফি কত? (Course Fee in Dhaka)',
      answer: 'আমাদের প্রতিষ্ঠানে প্র্যাকটিক্যাল ল্যাবভিত্তিক কোর্স ফি শুরু হয় মাত্র ৩,৫০০ টাকা থেকে শুরু করে ১৫,০০০ টাকা পর্যন্ত (কোর্স ও মেয়াদ অনুযায়ী)। এছাড়াও রয়েছে বিশেষ ছাড় ও সহজ কিস্তিতে ফি প্রদানের সুবিধা।'
    },
    {
      question: 'কোর্স শেষে কি সরকারি গ্রহণযোগ্য ও ভেরিফায়েবল সার্টিফিকেট পাওয়া যাবে?',
      answer: 'হ্যাঁ! প্রতিটি কোর্স সফলভাবে সম্পন্ন করার পর লাইভ কিউআর কোড ও অনলাইন ভেরিফায়েবল ডিজিটাল সার্টিফিকেট প্রদান করা হয়, যা সরকারি-বেসরকারি চাকরি ও আন্তর্জাতিক মার্কেটপ্লেসে গ্রহণযোগ্য।'
    },
    {
      question: 'ক্লাসের জন্য কি নিজস্ব ল্যাপটপ থাকা বাধ্যতামূলক নাকি ল্যাব সুবিধা আছে?',
      answer: 'না, নিজস্ব ল্যাপটপ থাকা বাধ্যতামূলক নয়। আমাদের সেন্টারে সম্পূর্ণ শীতাতপ নিয়ন্ত্রিত আধুনিক ল্যাবে প্রতিটি শিক্ষার্থীর জন্য ব্যক্তিগত আলাদা হাই-কনফিগারেশন কম্পিউটার বরাদ্দ থাকে।'
    },
    {
      question: 'ফার্মগেট ক্যাম্পাস মেট্রো রেল স্টেশন থেকে কত দূরে অবস্থিত?',
      answer: 'আমাদের ক্যাম্পাস ফার্মগেট মেট্রো রেল স্টেশন (গেট ২) থেকে মাত্র ২ মিনিটের হাঁটা দূরত্বে, গার্ডেন রোডে আনোয়ারা পার্ক ও আনন্দ সিনেমা হলের ঠিক বিপরীতে অবস্থিত।'
    },
    {
      question: 'চাকরিজীবী ও শিক্ষার্থীদের জন্য কি উইকেন্ড (শুক্র-শনি) বা সান্ধ্যকালীন ব্যাচ আছে?',
      answer: 'হ্যাঁ! চাকরিজীবী ও বিশ্ববিদ্যালয় শিক্ষার্থীদের সুবিধার্থে সকাল, দুপুর ও সান্ধ্যকালীন শিডিউলের পাশাপাশি বিশেষ শুক্র ও শনিবারের উইকেন্ড ব্যাচ পরিচালিত হয়।'
    },
    {
      question: 'কোর্স চলাকালীন ও কোর্স শেষে কি ফ্রিল্যান্সিং এবং জব প্লেসমেন্ট সাপোর্ট দেওয়া হয়?',
      answer: 'হ্যাঁ! কোর্স চলাকালীনই ফাইভার ও আপওয়ার্কে অ্যাকাউন্ট সেটআপ, পোর্টফোলিও তৈরি এবং কাজ পাওয়ার গাইডলাইন শেখানো হয় এবং কোর্স শেষে আজীবন মেন্টরশিপ সহায়তা দেওয়া হয়।'
    }
  ];
  const finalFaqItems = (seo?.faqItems && seo.faqItems.length > 0) ? seo.faqItems : defaultFaqItems;
  if (seo?.enableFaqSchema !== false && finalFaqItems.length > 0) {
    schemas.push(getFaqSchema(finalFaqItems));
  }

  return {
    title,
    metaDescription,
    keywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    noIndex: false,
    googleSiteVerification: seo?.googleSiteVerification || undefined,
    bingSiteVerification: seo?.bingSiteVerification || undefined,
    jsonLdSchemas: schemas,
    author: instituteName,
    siteName: instituteName
  };
}

/**
 * Builds dynamic metadata for an individual Course Landing Page / Course Details
 */
export function getCourseSeoMetadata(
  course: Course,
  academySettings: AcademySettings,
  cmsConfig: WebsiteCmsConfig,
  assignedTrainers?: Staff[]
): SeoMetadataPayload {
  const seo = cmsConfig.seo;
  const baseUrl = seo?.canonicalBaseUrl || 'https://nexgenacademy.edu.bd';
  const instituteName = academySettings.instituteName || 'Nexgen Computer Academy';
  const slug = course.seo?.slug || course.landingConfig?.slug || course.slug || generateSlug(course.name);

  const fallbackTitle = `${course.name} Course in Farmgate, Dhaka | ${instituteName}`;
  const title = course.seo?.seoTitle || course.landingConfig?.seoTitle || fallbackTitle;

  const fallbackDesc = `${course.name} at ${instituteName}, Farmgate. ${course.duration} practical hands-on lab training with 1-on-1 mentorship, verifiable certificate & career guidance in Dhaka.`;
  const metaDescription = course.seo?.metaDescription || course.landingConfig?.seoMetaDescription || course.description || fallbackDesc;

  const focusKeyword = course.seo?.focusKeyword || course.landingConfig?.focusKeyword || `${course.name} in Farmgate`;
  const secondary = course.seo?.secondaryKeywords || course.landingConfig?.secondaryKeywords || [
    `${course.name} course Dhaka`,
    `${course.name} training Farmgate`,
    `best ${course.category} institute Dhaka`
  ];
  const keywords = [focusKeyword, ...secondary];

  const canonicalUrl = course.seo?.canonicalUrl || `${baseUrl.replace(/\/+$/, '')}/courses/${slug}`;
  const ogTitle = course.seo?.ogTitle || course.landingConfig?.seoOgTitle || title;
  const ogDescription = course.seo?.ogDescription || course.landingConfig?.seoOgDescription || metaDescription;
  const ogImage = course.seo?.ogImage || course.landingConfig?.seoOgImage || course.thumbnailUrl || seo?.ogImageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200';
  const noIndex = course.seo?.noIndex || course.landingConfig?.noIndex || course.status === 'Archived';

  // Build JSON-LD Schemas
  const schemas: object[] = [];

  // Course schema
  if (seo?.enableCourseSchema !== false) {
    schemas.push(getCourseSchema(course, academySettings, cmsConfig, slug, assignedTrainers));
  }

  // Breadcrumb schema
  if (seo?.enableBreadcrumbSchema !== false) {
    schemas.push(getBreadcrumbSchema([
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Courses', url: `${baseUrl}/#courses` },
      { name: course.name, url: canonicalUrl }
    ]));
  }

  // Course FAQs schema if FAQs exist
  if (seo?.enableFaqSchema !== false && course.landingConfig?.faqs && course.landingConfig.faqs.length > 0) {
    schemas.push(getFaqSchema(course.landingConfig.faqs));
  }

  return {
    title,
    metaDescription,
    keywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    noIndex,
    jsonLdSchemas: schemas,
    author: instituteName,
    siteName: instituteName
  };
}

/**
 * LocalBusiness & EducationalOrganization Schema generator
 */
export function getLocalBusinessSchema(
  academySettings: AcademySettings,
  cmsConfig: WebsiteCmsConfig
): object {
  const baseUrl = cmsConfig.seo?.canonicalBaseUrl || 'https://nexgenacademy.edu.bd';
  const instituteName = academySettings.instituteName || 'Nexgen Computer Academy';
  const address = cmsConfig.officeAddress || academySettings.officialAddress || '14/B, Garden Road, Kazipara, Farmgate, Dhaka–1215, Bangladesh';
  const phone = cmsConfig.whatsappSupportNumber || academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444';
  const email = academySettings.officialEmail || 'info@nexgenacademy.edu.bd';
  const gbpUrl = cmsConfig.seo?.googleBusinessProfile?.mapsUrl || cmsConfig.seo?.googleBusinessProfile?.reviewUrl || 'https://share.google/gSt3e5RNwwCyOOdGu';

  const sameAs: string[] = [gbpUrl];
  if (cmsConfig.socialLinks?.facebookPageUrl) sameAs.push(cmsConfig.socialLinks.facebookPageUrl);
  if (cmsConfig.socialLinks?.youtubeChannelUrl) sameAs.push(cmsConfig.socialLinks.youtubeChannelUrl);
  if (cmsConfig.socialLinks?.linkedinUrl) sameAs.push(cmsConfig.socialLinks.linkedinUrl);
  if (cmsConfig.socialLinks?.instagramUrl) sameAs.push(cmsConfig.socialLinks.instagramUrl);

  const schemaObj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${baseUrl}/#organization`,
    name: instituteName,
    alternateName: 'NCA Farmgate',
    url: baseUrl,
    hasMap: gbpUrl,
    logo: `${baseUrl}/logo.svg`,
    image: cmsConfig.seo?.ogImageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
    description: cmsConfig.seo?.metaDescription || 'Govt recognized premier IT & computer training center in Farmgate, Dhaka with 100% practical lab training.',
    telephone: phone,
    email: email,
    priceRange: '৳৳',
    currenciesAccepted: 'BDT',
    paymentAccepted: 'Cash, Credit Card, bKash, Nagad, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '14/B, Garden Road, Kazipara',
      addressLocality: 'Farmgate',
      addressRegion: 'Dhaka',
      postalCode: '1215',
      addressCountry: 'BD'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.7527,
      longitude: 90.3887
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Saturday',
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday'
        ],
        opens: '09:00',
        closes: '20:00'
      }
    ],
    areaServed: [
      { '@type': 'Country', name: 'Bangladesh' },
      { '@type': 'AdministrativeArea', name: 'All 64 Districts of Bangladesh (Interactive Live Online Batches)' },
      { '@type': 'AdministrativeArea', name: 'Dhaka Division (Onsite Lab & Online)' },
      { '@type': 'AdministrativeArea', name: 'Chittagong Division' },
      { '@type': 'AdministrativeArea', name: 'Sylhet Division' },
      { '@type': 'AdministrativeArea', name: 'Rajshahi Division' },
      { '@type': 'AdministrativeArea', name: 'Khulna Division' },
      { '@type': 'AdministrativeArea', name: 'Barisal Division' },
      { '@type': 'AdministrativeArea', name: 'Rangpur Division' },
      { '@type': 'AdministrativeArea', name: 'Mymensingh Division' },
      { '@type': 'AdministrativeArea', name: 'Comilla' },
      { '@type': 'AdministrativeArea', name: 'Bogra' },
      { '@type': 'AdministrativeArea', name: 'Gazipur' },
      { '@type': 'AdministrativeArea', name: 'Narayanganj' },
      { '@type': 'AdministrativeArea', name: 'Farmgate' },
      { '@type': 'AdministrativeArea', name: 'Tejgaon' },
      { '@type': 'AdministrativeArea', name: 'Panthapath' },
      { '@type': 'AdministrativeArea', name: 'Dhanmondi' }
    ],
    knowsAbout: [
      'Computer Office Application & Digital Literacy',
      'Advanced MS Excel, Formulas, Dashboards & Financial Modeling',
      'AutoCAD 2D and 3D Architectural & Engineering Drafting',
      'Video Editing, Premiere Pro, After Effects & Motion Graphics',
      'Digital Marketing, Meta Ads & Search Engine Optimization (SEO)',
      'Facebook Marketing & Social Media Brand Strategy',
      'French Language Course (A1, A2, Spoken & Visa Preparation)',
      'AI Automation, Workflow Engineering & Prompt Engineering',
      'UI/UX Design, Figma & Product Prototype Architecture',
      'Full Stack Web Design and Development (HTML, CSS, React, Node.js)',
      'Graphic Design, Photoshop, Illustrator & Branding',
      'Freelancing, Fiverr, Upwork Marketplace & Global Remote Work'
    ],
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Dedicated 1-to-1 High Spec PC Workstation',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Farmgate Metro Rail Station Access (2 Mins Walk)',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Direct Access from Dhanmondi, Panthapath & Tejgaon',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Government Verifiable QR Code Certificate',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Lifetime Practical Lab Support',
        value: true
      }
    ],
    sameAs: sameAs.length > 0 ? sameAs : undefined
  };

  // Only include aggregateRating if admin has explicitly verified and set rating/reviews in CRM
  if (
    cmsConfig.seo?.googleBusinessProfile?.verifiedRating &&
    cmsConfig.seo?.googleBusinessProfile?.verifiedRating > 0
  ) {
    schemaObj.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: cmsConfig.seo.googleBusinessProfile.verifiedRating.toFixed(1),
      reviewCount: cmsConfig.seo.googleBusinessProfile.verifiedReviewCount || 1,
      bestRating: '5',
      worstRating: '1'
    };
  }

  return schemaObj;
}

/**
 * Course & EducationalOccupationalProgram Schema generator
 */
export function getCourseSchema(
  course: Course,
  academySettings: AcademySettings,
  cmsConfig: WebsiteCmsConfig,
  slug: string,
  assignedTrainers?: Staff[]
): object {
  const baseUrl = cmsConfig.seo?.canonicalBaseUrl || 'https://nexgenacademy.edu.bd';
  const instituteName = academySettings.instituteName || 'Nexgen Computer Academy';
  const courseUrl = `${baseUrl}/courses/${slug}`;

  const instructors = assignedTrainers && assignedTrainers.length > 0
    ? assignedTrainers.map(trainer => ({
        '@type': 'Person',
        name: trainer.name,
        jobTitle: trainer.designation || 'Lead Faculty',
        worksFor: {
          '@type': 'Organization',
          name: instituteName
        }
      }))
    : undefined;

  const teachesList: string[] = [
    ...(course.toolsCovered || []),
    ...(course.curriculumHighlights || []),
    ...(course.learningFeatures || []),
    course.name
  ];

  const careerRolesList: string[] = [
    ...(course.careerRoles || []),
    course.category
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${courseUrl}/#course`,
    name: course.name,
    description: course.description,
    teaches: teachesList.length > 0 ? teachesList : [course.name, 'Practical Computer Skills'],
    occupationalCategory: careerRolesList.join(', '),
    provider: {
      '@type': 'EducationalOrganization',
      name: instituteName,
      sameAs: baseUrl
    },
    url: courseUrl,
    image: course.thumbnailUrl || cmsConfig.seo?.ogImageUrl,
    courseCode: course.code,
    educationalCredentialAwarded: course.certificationType || 'Government Recognized & ISO Verifiable QR Code Certificate',
    timeRequired: course.duration ? `P${course.durationMonths || 3}M` : 'P3M',
    totalHistoricalEnrollment: course.studentsJoined || 450,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (course.rating || 4.9).toFixed(1),
      reviewCount: course.reviewsCount || 120,
      bestRating: '5',
      worstRating: '1'
    },
    offers: [
      {
        '@type': 'Offer',
        category: 'Tuition Fee',
        price: (course.offerFee || course.regularFee || 0).toString(),
        priceCurrency: 'BDT',
        availability: 'https://schema.org/InStock',
        url: courseUrl,
        validFrom: '2026-01-01'
      }
    ],
    courseMode: ['online', 'onsite', 'blended'],
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        name: `${course.name} - Live Online Batch (All Bangladesh 64 Districts)`,
        description: 'Interactive Live Zoom classes, HD screen share, class recordings, and online 1-on-1 mentorship for students across Bangladesh.',
        startDate: course.landingConfig?.nextBatchStartDate || '2026-09-01'
      },
      {
        '@type': 'CourseInstance',
        courseMode: 'Offline In-Person Practical Lab',
        name: `${course.name} - Hands-on AC Lab Batch (Farmgate, Dhaka)`,
        location: {
          '@type': 'Place',
          name: `${instituteName} Farmgate Campus`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: '14/B, Garden Road, Kazipara',
            addressLocality: 'Farmgate, Dhaka',
            postalCode: '1215',
            addressCountry: 'BD'
          }
        },
        startDate: course.landingConfig?.nextBatchStartDate || '2026-09-01'
      }
    ],
    instructor: instructors
  };
}

/**
 * BreadcrumbList Schema
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * FAQPage Schema
 */
export function getFaqSchema(faqItems: { question: string; answer: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

/**
 * Applies dynamic SEO metadata to document <head>
 */
export function applySeoMetadata(meta: SeoMetadataPayload): void {
  if (typeof document === 'undefined') return;

  // 1. Update Title
  if (meta.title) {
    document.title = meta.title;
  }

  // 2. Helper to set or create meta tag
  const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
    let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 3. Helper to set or create link tag (canonical)
  const setCanonicalLink = (url: string) => {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    // Clean query parameters like fbclid/utm from canonical URL
    try {
      const parsed = new URL(url);
      link.setAttribute('href', `${parsed.origin}${parsed.pathname}`);
    } catch {
      link.setAttribute('href', url.split('?')[0]);
    }
  };

  // Standard Meta Tags
  if (meta.metaDescription) setMetaTag('name', 'description', meta.metaDescription);
  if (meta.keywords && meta.keywords.length > 0) setMetaTag('name', 'keywords', meta.keywords.join(', '));
  setMetaTag('name', 'robots', meta.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  
  // AI Bot specific directives (AEO & GEO indexing)
  setMetaTag('name', 'googlebot', meta.noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large');
  setMetaTag('name', 'gptbot', meta.noIndex ? 'noindex' : 'index, follow');
  setMetaTag('name', 'claudebot', meta.noIndex ? 'noindex' : 'index, follow');
  setMetaTag('name', 'perplexitybot', meta.noIndex ? 'noindex' : 'index, follow');
  setMetaTag('name', 'author', meta.author || 'Academy');

  // Geo Meta Tags (Local SEO & GEO Positioning)
  setMetaTag('name', 'geo.region', 'BD-13');
  setMetaTag('name', 'geo.placename', 'Farmgate, Tejgaon, Panthapath, Dhanmondi, Dhaka, Bangladesh');
  setMetaTag('name', 'geo.position', '23.7570;90.3887');
  setMetaTag('name', 'ICBM', '23.7570, 90.3887');

  // Open Graph
  if (meta.ogTitle || meta.title) setMetaTag('property', 'og:title', meta.ogTitle || meta.title);
  if (meta.ogDescription || meta.metaDescription) setMetaTag('property', 'og:description', meta.ogDescription || meta.metaDescription);
  if (meta.ogImage) setMetaTag('property', 'og:image', meta.ogImage);
  if (meta.canonicalUrl) setMetaTag('property', 'og:url', meta.canonicalUrl);
  setMetaTag('property', 'og:type', meta.ogType || 'website');
  setMetaTag('property', 'og:locale', 'en_US');
  setMetaTag('property', 'og:site_name', meta.siteName || 'Academy');

  // Twitter
  setMetaTag('name', 'twitter:card', meta.twitterCard || 'summary_large_image');
  if (meta.ogTitle || meta.title) setMetaTag('name', 'twitter:title', meta.ogTitle || meta.title);
  if (meta.ogDescription || meta.metaDescription) setMetaTag('name', 'twitter:description', meta.ogDescription || meta.metaDescription);
  if (meta.ogImage) setMetaTag('name', 'twitter:image', meta.ogImage);

  // Canonical
  if (meta.canonicalUrl) {
    setCanonicalLink(meta.canonicalUrl);
  }

  // Google Search Console Site Verification
  if (meta.googleSiteVerification) {
    setMetaTag('name', 'google-site-verification', meta.googleSiteVerification);
  }

  // Bing Webmaster Verification
  if (meta.bingSiteVerification) {
    setMetaTag('name', 'msvalidate.01', meta.bingSiteVerification);
  }

  // 4. Inject JSON-LD Schema
  const existingScripts = document.querySelectorAll('script[data-seo-json-ld="true"]');
  existingScripts.forEach(s => s.remove());

  if (meta.jsonLdSchemas && meta.jsonLdSchemas.length > 0) {
    meta.jsonLdSchemas.forEach((schemaObj, idx) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-json-ld', 'true');
      script.setAttribute('data-schema-index', idx.toString());
      script.text = JSON.stringify(schemaObj, null, 2);
      document.head.appendChild(script);
    });
  }
}

/**
 * Generate Dynamic XML Sitemap
 */
export function generateSitemapXml(
  courses: Course[],
  cmsConfig: WebsiteCmsConfig
): string {
  const baseUrl = (cmsConfig.seo?.canonicalBaseUrl || 'https://nexgenacademy.edu.bd').replace(/\/+$/, '');
  const now = new Date().toISOString().split('T')[0];

  const publicCourses = courses.filter(c => c.status === 'Active');

  const courseUrls = publicCourses.map(course => {
    const slug = course.seo?.slug || course.landingConfig?.slug || course.slug || generateSlug(course.name);
    return `  <url>
    <loc>${baseUrl}/courses/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Course Catalog -->
  <url>
    <loc>${baseUrl}/#courses</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Seminars -->
  <url>
    <loc>${baseUrl}/#seminars</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- Dynamic Public Courses -->
${courseUrls}
</urlset>`;
}

/**
 * Generate Dynamic Robots.txt Content
 */
export function generateRobotsTxt(cmsConfig: WebsiteCmsConfig, instituteName?: string): string {
  const baseUrl = (cmsConfig.seo?.canonicalBaseUrl || 'https://nexgenacademy.edu.bd').replace(/\/+$/, '');
  if (cmsConfig.seo?.robotsTxtCustomContent) {
    return cmsConfig.seo.robotsTxtCustomContent;
  }

  return `# ${instituteName || 'Academy'} Robots.txt
User-agent: *
Allow: /
Allow: /courses/
Allow: /logo.svg

# Disallow internal administrative & CRM routes
Disallow: /admin
Disallow: /login
Disallow: /api/
Disallow: /erp/

# Dynamic Sitemap Reference
Sitemap: ${baseUrl}/sitemap.xml
`;
}
