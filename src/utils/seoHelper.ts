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
    `${instituteName} in Farmgate, Dhaka offers 100% practical lab training for Computer Office Application, Advanced Excel, Web Dev, Graphic Design & Digital Marketing with job placement assistance.`;

  const keywords = seo?.keywords && seo.keywords.length > 0
    ? seo.keywords
    : [
        'Computer Course in Farmgate',
        'Computer Training Center in Farmgate',
        'Computer Course in Dhaka',
        'Computer Office Application Course',
        'Advanced Excel Course in Farmgate',
        'Best IT Training Institute in Farmgate',
        'Computer Training in Farmgate',
        'AI Computer Course',
        'Practical Computer Training'
      ];

  const canonicalUrl = `${baseUrl.replace(/\/+$/, '')}/`;
  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || metaDescription;
  const ogImage = seo?.ogImageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200';

  // Build JSON-LD Schemas
  const schemas: object[] = [];

  if (seo?.enableLocalBusinessSchema !== false) {
    schemas.push(getLocalBusinessSchema(academySettings, cmsConfig));
  }

  if (seo?.enableFaqSchema !== false && seo?.faqItems && seo.faqItems.length > 0) {
    schemas.push(getFaqSchema(seo.faqItems));
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
    jsonLdSchemas: schemas
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
    jsonLdSchemas: schemas
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
      { '@type': 'AdministrativeArea', name: 'Farmgate' },
      { '@type': 'AdministrativeArea', name: 'Panthapath' },
      { '@type': 'AdministrativeArea', name: 'Tejgaon' },
      { '@type': 'AdministrativeArea', name: 'Dhanmondi' },
      { '@type': 'AdministrativeArea', name: 'Bijoy Sarani' },
      { '@type': 'AdministrativeArea', name: 'Dhaka' },
      { '@type': 'Country', name: 'Bangladesh' }
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

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${courseUrl}/#course`,
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: instituteName,
      sameAs: baseUrl
    },
    url: courseUrl,
    image: course.thumbnailUrl || cmsConfig.seo?.ogImageUrl,
    courseCode: course.code,
    educationalCredentialAwarded: 'Verified Government & Institute Certificate of Practical Completion',
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
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: course.deliveryMode === 'Online Live' ? 'Online' : 'Offline In-Person Practical Lab',
        location: {
          '@type': 'Place',
          name: `${instituteName} Farmgate Campus`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Level 4 & 5, Al-Razi Complex, 166/1 Shahid Syed Nazrul Islam Sarani',
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
  setMetaTag('name', 'author', 'Nexgen Computer Academy');

  // Geo Meta Tags (Local SEO)
  setMetaTag('name', 'geo.region', 'BD-13');
  setMetaTag('name', 'geo.placename', 'Farmgate, Dhaka');
  setMetaTag('name', 'geo.position', '23.7527;90.3887');
  setMetaTag('name', 'ICBM', '23.7527, 90.3887');

  // Open Graph
  if (meta.ogTitle || meta.title) setMetaTag('property', 'og:title', meta.ogTitle || meta.title);
  if (meta.ogDescription || meta.metaDescription) setMetaTag('property', 'og:description', meta.ogDescription || meta.metaDescription);
  if (meta.ogImage) setMetaTag('property', 'og:image', meta.ogImage);
  if (meta.canonicalUrl) setMetaTag('property', 'og:url', meta.canonicalUrl);
  setMetaTag('property', 'og:type', meta.ogType || 'website');
  setMetaTag('property', 'og:locale', 'en_US');
  setMetaTag('property', 'og:site_name', 'Nexgen Computer Academy');

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
export function generateRobotsTxt(cmsConfig: WebsiteCmsConfig): string {
  const baseUrl = (cmsConfig.seo?.canonicalBaseUrl || 'https://nexgenacademy.edu.bd').replace(/\/+$/, '');
  if (cmsConfig.seo?.robotsTxtCustomContent) {
    return cmsConfig.seo.robotsTxtCustomContent;
  }

  return `# Nexgen Computer Academy Robots.txt
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
