/**
 * Digital Marketing & Tracking Engine Utility
 * Provides seamless integration for:
 * - Meta Pixel (fbq)
 * - Google Analytics 4 (gtag)
 * - Google Tag Manager (GTM)
 * - UTM Parameter Extraction & Storage
 * - Device & Geolocation Hints
 */

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  landingPage?: string;
  capturedAt?: string;
}

// Extract UTM parameters from current URL or stored session
export function getCapturedUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const hasUtm = urlParams.has('utm_source') || urlParams.has('utm_campaign') || urlParams.has('fbclid') || urlParams.has('gclid');

    if (hasUtm) {
      const utmData: UtmParams = {
        utmSource: urlParams.get('utm_source') || (urlParams.get('fbclid') ? 'facebook_ads' : (urlParams.get('gclid') ? 'google_ads' : undefined)),
        utmMedium: urlParams.get('utm_medium') || (urlParams.get('fbclid') ? 'cpc' : undefined),
        utmCampaign: urlParams.get('utm_campaign') || undefined,
        utmContent: urlParams.get('utm_content') || undefined,
        utmTerm: urlParams.get('utm_term') || undefined,
        referrer: document.referrer || 'direct',
        landingPage: window.location.pathname,
        capturedAt: new Date().toISOString()
      };

      // Persist in sessionStorage so multi-page navigation retains the ad source
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

// Initialize real Meta Pixel script dynamically
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

// Track Meta Pixel Event
export function trackMetaPixelEvent(eventName: string, params: Record<string, any> = {}, pixelId?: string) {
  if (typeof window === 'undefined') return;

  try {
    if (pixelId) {
      initMetaPixel(pixelId);
    }

    const w = window as any;
    if (typeof w.fbq === 'function') {
      w.fbq('track', eventName, params);
      console.log(`[Meta Pixel Event Tracked] ${eventName}:`, params);
    } else {
      console.log(`[Meta Pixel Simulation] ${eventName} (Pixel ID: ${pixelId || 'Configured'}):`, params);
    }

    // Also track in Google Analytics gtag if present
    if (typeof w.gtag === 'function') {
      w.gtag('event', eventName, params);
    }

    // Save event to local activity session for ERP Live Analytics Dashboard
    recordLocalMarketingEvent(eventName, params);
  } catch (err) {
    console.warn('Analytics event tracking error:', err);
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
      city: 'Dhaka, BD' // Default fallback geo
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
