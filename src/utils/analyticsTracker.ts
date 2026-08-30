/**
 * Digital Marketing & Tracking Engine Utility
 * Provides seamless integration for:
 * - Meta Pixel (Browser-side fbq with event_id deduplication)
 * - Meta Conversions API (Server-side CAPI proxy via /api/marketing/capi-event)
 * - Google Analytics 4 (gtag)
 * - Google Tag Manager (GTM)
 * - UTM Parameter Extraction & Storage (utm_source, medium, campaign, content, term, fbclid, gclid)
 * - Device, Geolocation Hints & WhatsApp/Messenger Attribution
 */

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

// Generate unique event ID for Meta Browser/Server Deduplication
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

// Initialize Google Analytics 4 (GA4) dynamically in the browser
export function initGoogleAnalytics(measurementId: string) {
  if (typeof window === 'undefined' || !measurementId) return;
  const w = window as any;
  if (w._ga4Initialized === measurementId) return;

  try {
    w.dataLayer = w.dataLayer || [];
    function gtag(...args: any[]) {
      w.dataLayer.push(args);
    }
    w.gtag = w.gtag || gtag;

    // Set default config
    w.gtag('js', new Date());
    w.gtag('config', measurementId, {
      send_page_view: false, // controlled manually
      anonymize_ip: true
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    w._ga4Initialized = measurementId;
    console.log(`[GA4 Initialized] Measurement ID: ${measurementId}`);
  } catch (err) {
    console.warn('GA4 init failed:', err);
  }
}

/**
 * Strips personally identifiable information (PII) before forwarding to GA4 / Ads
 */
export function sanitizeGa4Params(params: Record<string, any> = {}): Record<string, any> {
  const sanitized: Record<string, any> = {};
  const blockedKeys = new Set([
    'phone',
    'phoneNumber',
    'mobile',
    'email',
    'address',
    'fullAddress',
    'studentName',
    'name',
    'guardianName',
    'guardianPhone',
    'password',
    'secret',
    'token',
    'notes',
    'messageNote',
    'nid',
    'dob'
  ]);

  for (const [key, value] of Object.entries(params)) {
    if (!blockedKeys.has(key.toLowerCase()) && value !== undefined && value !== null) {
      // Ensure strings are truncated if excessive
      if (typeof value === 'string') {
        sanitized[key] = value.substring(0, 100);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
}

/**
 * Dispatches a sanitized event to Google Analytics 4
 */
export function trackGa4Event(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  try {
    const w = window as any;
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

    // 2. Google Analytics 4 (gtag)
    if (typeof w.gtag === 'function') {
      w.gtag('event', eventName, { ...params, event_id: eventId });
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
    recordLocalMarketingEvent(eventName, { ...params, eventId, channel: 'Pixel + CAPI' });
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

  // 1. Map to Meta Event Name
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

  // 2. Dispatch to GA4 if enabled (without PII)
  if (config.googleAnalyticsEnabled !== false) {
    if (config.googleAnalyticsId) {
      initGoogleAnalytics(config.googleAnalyticsId);
    }
    trackGa4Event(eventName, { ...params, event_id: eventId });
  }

  // 3. Dispatch to Google Ads if conversion action and Ads is enabled
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


