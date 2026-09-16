/**
 * Map Helper Utility
 * Handles conversion of Google Maps share links, short URLs, iframe embeds, and addresses
 * into iframe-friendly embed URLs and direct 1-click navigation links.
 */

export interface ResolvedMapConfig {
  embedUrl: string;
  directUrl: string;
  osmEmbedUrl: string;
  isDirectLink: boolean;
}

// Nexgen Computer Academy default coordinates and address
export const DEFAULT_CAMPUS_LAT = 23.7527;
export const DEFAULT_CAMPUS_LNG = 90.3887;
export const DEFAULT_CAMPUS_NAME = 'Nexgen Computer Academy';
export const DEFAULT_CAMPUS_ADDRESS = '14/B Garden Road, Kazipara, Farmgate, Dhaka-1215, Bangladesh';
export const DEFAULT_GOOGLE_SHARE_URL = 'https://share.google/9W8K1XZHLbZxFpF8G';

/**
 * OpenStreetMap interactive embed for Farmgate / Nexgen Computer Academy (100% iframe allowed, no CSP or X-Frame-Options blocking)
 */
export const DEFAULT_OSM_EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=90.3830%2C23.7480%2C90.3950%2C23.7570&layer=mapnik&marker=${DEFAULT_CAMPUS_LAT}%2C${DEFAULT_CAMPUS_LNG}`;

/**
 * Google Maps verified responsive embed URL (works universally in all browser iframes)
 */
export const DEFAULT_GOOGLE_EMBED_URL = `https://maps.google.com/maps?q=Nexgen+Computer+Academy,+14/B+Garden+Road,+Farmgate,+Dhaka&t=&z=16&ie=UTF8&iwloc=&output=embed`;

/**
 * Secondary coordinate-based Google Map embed
 */
export const COORDINATES_GOOGLE_EMBED_URL = `https://maps.google.com/maps?q=${DEFAULT_CAMPUS_LAT},${DEFAULT_CAMPUS_LNG}+(Nexgen+Computer+Academy)&t=&z=16&ie=UTF8&iwloc=B&output=embed`;

/**
 * Resolves any map URL, embed code, or share link into safe iframe embed URL and clickable navigation URL
 */
export function resolveMapUrls(
  rawEmbedUrl?: string,
  rawShareUrl?: string,
  campusAddress?: string
): ResolvedMapConfig {
  const addressQuery = encodeURIComponent(campusAddress || `${DEFAULT_CAMPUS_NAME}, ${DEFAULT_CAMPUS_ADDRESS}`);
  const directFallback = rawShareUrl?.trim() || DEFAULT_GOOGLE_SHARE_URL;

  let cleaned = (rawEmbedUrl || '').trim();

  // If user pasted an entire <iframe> code, extract src="..."
  if (cleaned.includes('<iframe')) {
    const match = cleaned.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      cleaned = match[1].trim();
    }
  }

  // Check if the URL is a share link (e.g., share.google, maps.app.goo.gl, goo.gl)
  const isShareLink =
    cleaned.includes('share.google') ||
    cleaned.includes('maps.app.goo.gl') ||
    cleaned.includes('goo.gl/maps');

  if (isShareLink) {
    // A share link cannot be put directly into an iframe!
    // Set the share link as directUrl, and generate a working embedUrl
    return {
      embedUrl: DEFAULT_GOOGLE_EMBED_URL,
      directUrl: cleaned || directFallback,
      osmEmbedUrl: DEFAULT_OSM_EMBED_URL,
      isDirectLink: true
    };
  }

  // If it's already an embed URL, use it
  if (cleaned.includes('/maps/embed') || cleaned.includes('output=embed')) {
    return {
      embedUrl: cleaned,
      directUrl: rawShareUrl?.trim() || DEFAULT_GOOGLE_SHARE_URL,
      osmEmbedUrl: DEFAULT_OSM_EMBED_URL,
      isDirectLink: false
    };
  }

  // If it's a standard google search or place link, convert to output=embed
  if (cleaned.includes('google.com/maps')) {
    if (cleaned.includes('?')) {
      return {
        embedUrl: `${cleaned}&output=embed`,
        directUrl: rawShareUrl?.trim() || cleaned,
        osmEmbedUrl: DEFAULT_OSM_EMBED_URL,
        isDirectLink: false
      };
    } else {
      return {
        embedUrl: `https://maps.google.com/maps?q=${addressQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
        directUrl: rawShareUrl?.trim() || cleaned,
        osmEmbedUrl: DEFAULT_OSM_EMBED_URL,
        isDirectLink: false
      };
    }
  }

  // If it's empty or invalid, fallback to guaranteed working embed
  return {
    embedUrl: DEFAULT_GOOGLE_EMBED_URL,
    directUrl: directFallback,
    osmEmbedUrl: DEFAULT_OSM_EMBED_URL,
    isDirectLink: false
  };
}
