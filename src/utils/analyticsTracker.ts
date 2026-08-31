/**
 * Digital Marketing & Tracking Engine Utility
 * Nexgen Computer Academy — Centralized Single Source of Truth
 * 
 * Provides seamless, non-duplicated integration for:
 * - Google Analytics 4 (Real GA4 Measurement ID: G-VYNS03M91Z)
 * - Meta Pixel (Browser-side fbq with event_id deduplication)
 * - Meta Conversions API (Server-side CAPI proxy via /api/marketing/capi-event)
 * - Google Ads Conversion Tracking (Optional AW- tags)
 * - UTM Parameter Extraction & Storage (utm_source, medium, campaign, content, term, fbclid, gclid)
 * - Device & Channel Attribution (WhatsApp, Messenger, Phone, Landing Pages)
 */

export const DEFAULT_GA4_MEASUREMENT_ID = 'G-VYNS03M91Z';

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  gclid?: string;
  referrer?: string;
  landingPage?: string;
  capturedAt?: string;
}

// Generate unique event ID for Meta Browser/Server Deduplication and GA4 correlation
export function generateEventId(eventName: string): string {
  const rand = Math.random().toString(36).substring(2, 9);
  return `evt_${eventName.toLowerCase()}_${Date.now()}_${rand}`;
}

// Extract UTM and Click ID parameters from current URL or stored session
export function getCapturedUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid') || undefined;
    const gclid = urlParams.get('gclid') || undefined;
    const hasUtm = urlParams.has('utm_source') || urlParams.has('utm_campaign') || !!fbclid || !!gclid;

    if (hasUtm) {
      const utmData: UtmParams = {
        utmSource: urlParams.get('utm_source') || (fbclid ? 'facebook_ads' : (gclid ? 'google_ads' : undefined)),
        utmMedium: urlParams.get('utm_medium') || (fbclid ? 'cpc' : undefined),
        utmCampaign: urlParams.get('utm_campaign') || undefined,
        utmContent: urlParams.get('utm_content') || undefined,
        utmTerm: urlParams.get('utm_term') || undefined,
        fbclid: fbclid,
        gclid: gclid,
        referrer: document.referrer || 'direct',
        landingPage: window.location.pathname + window.location.search,
        capturedAt: new Date().toISOString()
      };

      // Persist in sessionStorage so multi-page navigation retains the ad attribution
      sessionStorage.setItem('nca_marketing_utm', JSON.stringify(utmData));
      return utmData;
    }

    // Retrieve from session storage if present
    const saved = sessionStorage.getItem('nca_marketing_utm');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error capturing UTM params:', e);
  }

  return {
    utmSource: 'Website Direct',
    referrer: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct',
    landingPage: typeof window !== 'undefined' ? window.location.pathname : '/',
    capturedAt: new Date().toISOString()
  };
}

// Detect device type
export function getDeviceType(): 'Mobile' | 'Desktop' | 'Tablet' {
  if (typeof window === 'undefined') return 'Desktop';
  const width = window.innerWidth;
  const userAgent = navigator.userAgent || '';
  if (/tablet|ipad/i.test(userAgent) || (width >= 768 && width <= 1024)) return 'Tablet';
  if (/mobile|iphone|android|blackberry/i.test(userAgent) || width < 768) return 'Mobile';
  return 'Desktop';
}

// Initialize real Meta Pixel script dynamically in the browser
export function initMetaPixel(pixelId: string) {
  if (typeof window === 'undefined' || !pixelId) return;
  const w = window as any;
  if (w._metaPixelInitialized === pixelId) return;

  try {
    if (!w.fbq) {
      const n: any = (w.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!w._fbq) w._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];

      const t = document.createElement('script');
      t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const s = document.getElementsByTagName('script')[0];
      s?.parentNode?.insertBefore(t, s);
    }

    w.fbq('init', pixelId);
    w._metaPixelInitialized = pixelId;
    console.log(`[Meta Pixel Initialized] ID: ${pixelId}`);
  } catch (err) {
    console.warn('Meta Pixel script init failed:', err);
  }
}

// Track active GA4 measurement ID
let activeGa4MeasurementId: string = DEFAULT_GA4_MEASUREMENT_ID;

/**
 * Initialize Google Analytics 4 (GA4) dynamically in the browser.
 * Ensures the gtag.js script is loaded EXACTLY ONCE with send_page_view: false
 * so that SPA pageviews can be triggered deterministically without duplicates.
 */
export function initGoogleAnalytics(measurementId: string = DEFAULT_GA4_MEASUREMENT_ID) {
  if (typeof window === 'undefined' || !measurementId) return;
  const w = window as any;
  activeGa4MeasurementId = measurementId;

  // If already initialized with this exact measurement ID, nothing to do
  if (w._ga4Initialized === measurementId) return;

  try {
    w.dataLayer = w.dataLayer || [];
    function gtag(...args: any[]) {
      w.dataLayer.push(args);
    }
    w.gtag = w.gtag || gtag;

    // Set default config: manual page_view control + anonymize IP for privacy
    w.gtag('js', new Date());
    w.gtag('config', measurementId, {
      send_page_view: false, // Prevents duplicate automatic pageviews on script load
      anonymize_ip: true
    });

    // Check if script tag already exists in DOM
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id="]`);
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    w._ga4Initialized = measurementId;
    console.log(`[GA4 Initialized] Measurement ID: ${measurementId}`);
  } catch (err) {
    console.warn('GA4 init failed:', err);
  }
}

/**
 * Strips personally identifiable information (PII) before forwarding to GA4 / Ads.
 * Strictly adheres to Google Analytics Terms of Service prohibiting transmission of PII.
 */
export function sanitizeGa4Params(params: Record<string, any> = {}): Record<string, any> {
  const sanitized: Record<string, any> = {};
  const blockedKeys = new Set([
    'phone',
    'phonenumber',
    'mobile',
    'email',
    'emailaddress',
    'address',
    'fulladdress',
    'studentname',
    'name',
    'fullname',
    'guardianname',
    'guardianphone',
    'password',
    'secret',
    'token',
    'notes',
    'messagenote',
    'followupnotes',
    'nid',
    'dob',
    'birthdate'
  ]);

  for (const [key, value] of Object.entries(params)) {
    const lowerKey = key.toLowerCase();
    if (!blockedKeys.has(lowerKey) && value !== undefined && value !== null) {
      // Ensure strings are truncated to prevent accidental blob injection
      if (typeof value === 'string') {
        sanitized[key] = value.substring(0, 150);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
}

/**
 * Dispatches a sanitized event to Google Analytics 4 (GA4)
 */
export function trackGa4Event(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  try {
    const w = window as any;
    // Ensure GA4 is initialized
    if (!w._ga4Initialized) {
      initGoogleAnalytics(activeGa4MeasurementId);
    }

    const cleanParams = sanitizeGa4Params(params);
    if (typeof w.gtag === 'function') {
      w.gtag('event', eventName, cleanParams);
      console.log(`[GA4 Event] ${eventName}:`, cleanParams);
    } else {
      console.log(`[GA4 Simulation] ${eventName}:`, cleanParams);
    }
  } catch (err) {
    console.warn('GA4 event error:', err);
  }
}

// Track last pageview to prevent duplicate events from React re-renders or component remounts
let lastTrackedPageView: {
  path: string;
  timestamp: number;
} | null = null;

/**
 * Dispatches a deduplicated page_view event to GA4
 */
export function trackGa4PageView(pageData?: {
  pageTitle?: string;
  pageLocation?: string;
  pagePath?: string;
  [key: string]: any;
}) {
  if (typeof window === 'undefined') return;
  try {
    const path = pageData?.pagePath || window.location.pathname || '/';
    const now = Date.now();

    // Suppress duplicate page_view within 800ms for identical path (prevents React double-render / mount loops)
    if (lastTrackedPageView && lastTrackedPageView.path === path && (now - lastTrackedPageView.timestamp) < 800) {
      return;
    }
    lastTrackedPageView = { path, timestamp: now };

    const utms = getCapturedUtmParams();
    const title = pageData?.pageTitle || document.title || 'Nexgen Computer Academy';
    const location = pageData?.pageLocation || window.location.href;

    const params: Record<string, any> = {
      page_title: title,
      page_location: location,
      page_path: path,
      utm_source: utms.utmSource,
      utm_medium: utms.utmMedium,
      utm_campaign: utms.utmCampaign,
      utm_content: utms.utmContent,
      utm_term: utms.utmTerm,
      fbclid: utms.fbclid,
      gclid: utms.gclid,
      ...(pageData || {})
    };

    trackGa4Event('page_view', params);
  } catch (err) {
    console.warn('GA4 pageview tracking error:', err);
  }
}

/**
 * Tracks course details / syllabus view in GA4
 */
export function trackGa4CourseView(course: {
  id?: string;
  name: string;
  category?: string;
  regularFee?: number;
  offerFee?: number;
  duration?: string;
  courseType?: string;
}) {
  const fee = course.offerFee || course.regularFee || 0;
  trackGa4Event('view_course', {
    course_id: course.id,
    course_name: course.name,
    course_category: course.category,
    value: fee,
    currency: 'BDT',
    duration: course.duration,
    learning_mode: course.courseType || 'Offline Lab + Online'
  });

  // Also send standard ecommerce view_item
  trackGa4Event('view_item', {
    currency: 'BDT',
    value: fee,
    items: [
      {
        item_id: course.id,
        item_name: course.name,
        item_category: course.category,
        price: fee,
        quantity: 1
      }
    ]
  });
}

/**
 * Tracks dedicated course landing page view in GA4
 */
export function trackGa4LandingPageView(course: {
  id?: string;
  name: string;
  slug?: string;
  category?: string;
  regularFee?: number;
  offerFee?: number;
}) {
  const fee = course.offerFee || course.regularFee || 0;
  trackGa4Event('view_landing_page', {
    course_id: course.id,
    course_name: course.name,
    slug: course.slug,
    course_category: course.category,
    value: fee,
    currency: 'BDT',
    landing_url: typeof window !== 'undefined' ? window.location.href : ''
  });
}

/**
 * Tracks WhatsApp click event in GA4
 */
export function trackGa4WhatsAppClick(context?: {
  courseName?: string;
  courseId?: string;
  position?: string;
}) {
  trackGa4Event('whatsapp_click', {
    channel: 'whatsapp',
    course_name: context?.courseName,
    course_id: context?.courseId,
    position: context?.position || 'floating_button',
    page_location: typeof window !== 'undefined' ? window.location.href : ''
  });
}

/**
 * Tracks Messenger click event in GA4
 */
export function trackGa4MessengerClick(context?: {
  courseName?: string;
  courseId?: string;
  position?: string;
}) {
  trackGa4Event('messenger_click', {
    channel: 'messenger',
    course_name: context?.courseName,
    course_id: context?.courseId,
    position: context?.position || 'direct_cta',
    page_location: typeof window !== 'undefined' ? window.location.href : ''
  });
}

/**
 * Tracks Phone / Hotline click event in GA4
 */
export function trackGa4PhoneClick(context?: {
  phoneLabel?: string;
  position?: string;
}) {
  trackGa4Event('phone_click', {
    channel: 'phone',
    phone_label: context?.phoneLabel || '01798444444',
    position: context?.position || 'header_helpline',
    page_location: typeof window !== 'undefined' ? window.location.href : ''
  });
}

/**
 * Tracks Lead Submission in GA4 (Without PII)
 */
export function trackGa4LeadSubmit(leadData: {
  leadId: string;
  courseId?: string;
  courseName?: string;
  courseType?: string;
  preferredSchedule?: string;
  fee?: number;
  source?: string;
  isDuplicate?: boolean;
}) {
  trackGa4Event('lead_submit', {
    lead_id: leadData.leadId,
    course_id: leadData.courseId,
    course_name: leadData.courseName,
    course_type: leadData.courseType,
    preferred_schedule: leadData.preferredSchedule,
    value: leadData.fee || 0,
    currency: 'BDT',
    lead_source: leadData.source || 'Website Form',
    is_duplicate: leadData.isDuplicate || false
  });

  // Also send standard generate_lead event
  trackGa4Event('generate_lead', {
    value: leadData.fee || 0,
    currency: 'BDT',
    lead_id: leadData.leadId,
    course_name: leadData.courseName
  });
}

/**
 * Tracks Initiate Checkout / Enroll click in GA4
 */
export function trackGa4InitiateCheckout(courseData: {
  courseId?: string;
  courseName?: string;
  fee?: number;
}) {
  trackGa4Event('initiate_checkout', {
    course_id: courseData.courseId,
    course_name: courseData.courseName,
    value: courseData.fee || 0,
    currency: 'BDT'
  });

  trackGa4Event('begin_checkout', {
    currency: 'BDT',
    value: courseData.fee || 0,
    items: [
      {
        item_id: courseData.courseId,
        item_name: courseData.courseName,
        price: courseData.fee || 0,
        quantity: 1
      }
    ]
  });
}

/**
 * Tracks a Google Ads conversion event if enabled
 */
export function trackGoogleAdsConversion(conversionId: string, conversionLabel: string, value?: number, currency = 'BDT') {
  if (typeof window === 'undefined' || !conversionId || !conversionLabel) return;
  try {
    const w = window as any;
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'conversion', {
        send_to: `${conversionId}/${conversionLabel}`,
        value: value || 0,
        currency: currency
      });
      console.log(`[Google Ads Conversion] ${conversionId}/${conversionLabel} (Value: ${value} ${currency})`);
    }
  } catch (err) {
    console.warn('Google Ads conversion error:', err);
  }
}

export interface MetaEventOptions {
  pixelId?: string;
  eventId?: string;
  userData?: {
    phone?: string;
    email?: string;
    name?: string;
    externalId?: string;
  };
  triggerCapi?: boolean;
}

/**
 * Dispatches a dual-channel Meta Event (Browser Pixel + Server CAPI with Deduplication)
 * and automatically mirrors sanitized events to GA4.
 */
export function trackMetaPixelEvent(
  eventName: string,
  params: Record<string, any> = {},
  pixelIdOrOptions?: string | MetaEventOptions
) {
  if (typeof window === 'undefined') return;

  let pixelId: string | undefined;
  let eventId: string | undefined;
  let userData: MetaEventOptions['userData'] | undefined;
  let triggerCapi = true;

  if (typeof pixelIdOrOptions === 'string') {
    pixelId = pixelIdOrOptions;
    eventId = generateEventId(eventName);
  } else if (typeof pixelIdOrOptions === 'object' && pixelIdOrOptions !== null) {
    pixelId = pixelIdOrOptions.pixelId;
    eventId = pixelIdOrOptions.eventId || generateEventId(eventName);
    userData = pixelIdOrOptions.userData;
    if (pixelIdOrOptions.triggerCapi !== undefined) {
      triggerCapi = pixelIdOrOptions.triggerCapi;
    }
  } else {
    eventId = generateEventId(eventName);
  }

  try {
    if (pixelId) {
      initMetaPixel(pixelId);
    }

    const w = window as any;
    // 1. Browser-side Meta Pixel with eventID option for exact deduplication
    if (typeof w.fbq === 'function') {
      w.fbq('track', eventName, params, { eventID: eventId });
      console.log(`[Meta Pixel Event Tracked] ${eventName} (EventID: ${eventId}):`, params);
    } else {
      console.log(`[Meta Pixel Simulation] ${eventName} (Pixel ID: ${pixelId || 'Configured'}, EventID: ${eventId}):`, params);
    }

    // 2. Mirror to Google Analytics 4 (GA4) with standard event mapping & PII sanitization
    if (eventName === 'PageView') {
      trackGa4PageView({
        pageTitle: params.page_title,
        pageLocation: params.url || params.page_location,
        pagePath: params.page_path
      });
    } else if (eventName === 'ViewContent') {
      trackGa4Event('view_course', {
        course_id: params.content_ids?.[0] || params.course_id,
        course_name: params.content_name || params.course_name,
        category: params.content_category,
        value: params.value,
        currency: params.currency || 'BDT',
        event_id: eventId
      });
    } else if (eventName === 'InitiateCheckout') {
      trackGa4Event('initiate_checkout', {
        course_id: params.content_ids?.[0] || params.course_id,
        course_name: params.content_name || params.course_name,
        value: params.value,
        currency: params.currency || 'BDT',
        event_id: eventId
      });
    } else if (eventName === 'Lead') {
      trackGa4Event('lead_submit', {
        lead_id: params.lead_id,
        course_id: params.course_id,
        course_name: params.content_name || params.course_name,
        value: params.value,
        currency: params.currency || 'BDT',
        lead_source: params.source,
        event_id: eventId
      });
    } else if (eventName === 'Contact') {
      if (params.channel === 'WhatsApp Direct' || params.channel?.toLowerCase().includes('whatsapp')) {
        trackGa4Event('whatsapp_click', {
          channel: 'whatsapp',
          course_name: params.course_name,
          position: params.position || 'direct_cta',
          event_id: eventId
        });
      } else if (params.channel === 'Messenger Direct' || params.channel?.toLowerCase().includes('messenger')) {
        trackGa4Event('messenger_click', {
          channel: 'messenger',
          course_name: params.course_name,
          position: params.position || 'direct_cta',
          event_id: eventId
        });
      } else {
        trackGa4Event('phone_click', {
          channel: 'phone',
          position: params.position || 'direct_cta',
          event_id: eventId
        });
      }
    } else {
      trackGa4Event(eventName.toLowerCase(), {
        ...params,
        event_id: eventId
      });
    }

    // 3. Server-side Conversions API (CAPI) Dispatch
    const utms = getCapturedUtmParams();
    if (triggerCapi) {
      dispatchCapiEventToServer({
        eventName,
        eventId: eventId || generateEventId(eventName),
        customData: params,
        userData: {
          phone: userData?.phone || params.phone,
          email: userData?.email || params.email,
          name: userData?.name || params.name,
          externalId: userData?.externalId || params.leadId || params.studentId
        },
        pixelId,
        sourceUrl: window.location.href,
        fbclid: utms.fbclid,
        utmSource: utms.utmSource,
        utmCampaign: utms.utmCampaign
      });
    }

    // 4. Save event to local activity session for ERP Live Analytics Dashboard
    recordLocalMarketingEvent(eventName, { ...params, eventId, channel: 'Pixel + CAPI + GA4' });
  } catch (err) {
    console.warn('Analytics event tracking error:', err);
  }
}

// Background dispatch to Server Conversions API endpoint
async function dispatchCapiEventToServer(payload: {
  eventName: string;
  eventId: string;
  customData: Record<string, any>;
  userData: Record<string, any>;
  pixelId?: string;
  sourceUrl?: string;
  fbclid?: string;
  utmSource?: string;
  utmCampaign?: string;
}) {
  try {
    await fetch('/api/marketing/capi-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    // Non-blocking fire-and-forget
  }
}

// Maintain local marketing event buffer for the ERP's Digital Marketing Dashboard
export interface TrackedEventLog {
  id: string;
  eventName: string;
  params: Record<string, any>;
  timestamp: string;
  page: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  city?: string;
  dedupEventId?: string;
}

export function recordLocalMarketingEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('nca_tracked_events_log');
    let logs: TrackedEventLog[] = raw ? JSON.parse(raw) : [];

    const newLog: TrackedEventLog = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventName,
      params,
      timestamp: new Date().toISOString(),
      page: window.location.pathname || '/',
      device: getDeviceType(),
      city: 'Dhaka, BD', // Default fallback geo
      dedupEventId: params.eventId || params.eventID
    };

    logs.unshift(newLog);
    // Keep last 150 events
    if (logs.length > 150) logs = logs.slice(0, 150);
    localStorage.setItem('nca_tracked_events_log', JSON.stringify(logs));
  } catch (e) {
    // Ignore storage issues
  }
}

export function getLocalMarketingEvents(): TrackedEventLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('nca_tracked_events_log');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // return empty
  }
  return [];
}

export type UnifiedMarketingEvent =
  | 'page_view'
  | 'view_course'
  | 'view_course_details'
  | 'view_course_landing'
  | 'select_schedule'
  | 'lead_form_view'
  | 'lead_form_start'
  | 'lead_submit'
  | 'lead_success'
  | 'whatsapp_click'
  | 'messenger_click'
  | 'phone_click'
  | 'enroll_click'
  | 'schedule_select';

export interface UnifiedEventConfig {
  pixelId?: string;
  metaPixelEnabled?: boolean;
  metaCapiEnabled?: boolean;
  googleAnalyticsId?: string;
  googleAnalyticsEnabled?: boolean;
  googleAdsConversionId?: string;
  googleAdsConversionLabel?: string;
  googleAdsEnabled?: boolean;
  userData?: {
    phone?: string;
    email?: string;
    name?: string;
    externalId?: string;
  };
}

/**
 * High-level unified dispatcher that maps an internal event to Meta Pixel, CAPI, GA4, and Google Ads cleanly
 */
export function trackUnifiedMarketingEvent(
  eventName: UnifiedMarketingEvent,
  params: Record<string, any> = {},
  config: UnifiedEventConfig = {}
) {
  if (typeof window === 'undefined') return;

  const eventId = generateEventId(eventName);
  const gaId = config.googleAnalyticsId || activeGa4MeasurementId || DEFAULT_GA4_MEASUREMENT_ID;

  // 1. Initialize GA4 if not already done
  if (config.googleAnalyticsEnabled !== false && gaId) {
    initGoogleAnalytics(gaId);
  }

  // 2. Map to Meta Event Name
  let metaEventName: string | null = null;
  switch (eventName) {
    case 'page_view':
      metaEventName = 'PageView';
      break;
    case 'view_course':
    case 'view_course_details':
    case 'view_course_landing':
      metaEventName = 'ViewContent';
      break;
    case 'enroll_click':
      metaEventName = 'InitiateCheckout';
      break;
    case 'lead_submit':
      metaEventName = 'Lead';
      break;
    case 'whatsapp_click':
    case 'messenger_click':
    case 'phone_click':
      metaEventName = 'Contact';
      break;
    default:
      metaEventName = null;
  }

  // Dispatch to Meta (Pixel + CAPI) if enabled
  if (metaEventName && config.metaPixelEnabled !== false) {
    trackMetaPixelEvent(metaEventName, params, {
      pixelId: config.pixelId,
      eventId: eventId,
      userData: config.userData,
      triggerCapi: config.metaCapiEnabled !== false
    });
  }

  // 3. Dispatch to GA4 if enabled (without PII)
  if (config.googleAnalyticsEnabled !== false) {
    if (eventName === 'page_view') {
      trackGa4PageView(params);
    } else {
      trackGa4Event(eventName, { ...params, event_id: eventId });
    }
  }

  // 4. Dispatch to Google Ads if conversion action and Ads is enabled
  if (
    config.googleAdsEnabled &&
    config.googleAdsConversionId &&
    config.googleAdsConversionLabel &&
    (eventName === 'lead_submit' || eventName === 'whatsapp_click' || eventName === 'enroll_click')
  ) {
    trackGoogleAdsConversion(
      config.googleAdsConversionId,
      config.googleAdsConversionLabel,
      params.value || params.fee || 0,
      'BDT'
    );
  }
}
