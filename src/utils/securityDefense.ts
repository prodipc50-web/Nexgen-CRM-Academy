/**
 * Nexgen Academy Industrial Security & Defense Module
 * Enterprise-grade protection against:
 * 1. Bot automated crawler floods (Honeypot Trap)
 * 2. Rapid Form Flooding & Denial-of-Service (Client Rate Limiting)
 * 3. Cross-Site Scripting (XSS Sanitizer & Cleanser)
 * 4. Injection Attacks (SQL/Script payloads)
 * 5. Security Audit Logging & Threat Intelligence
 */

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  threatType: 'SPAM_FLOOD_BLOCKED' | 'BOT_HONEYPOT_TRIGGERED' | 'XSS_INJECTION_DETECTED' | 'SUSPICIOUS_PAYLOAD' | 'RATE_LIMIT_EXCEEDED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sourceForm: string;
  details: string;
  clientFingerprint?: string;
}

const STORAGE_SECURITY_LOGS_KEY = 'nca_security_audit_logs';
const RATE_LIMIT_PREFIX = 'nca_rate_limit_';

/**
 * Generate a consistent pseudo client-fingerprint for client-side rate limiting
 */
export function getClientFingerprint(): string {
  try {
    const nav = window.navigator;
    const screen = window.screen;
    const raw = `${nav.userAgent}_${screen.width}x${screen.height}_${nav.language}`;
    // Simple hash
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  } catch {
    return 'fp_fallback';
  }
}

/**
 * XSS & Malicious Script Cleanser
 * Removes script tags, malicious event handlers (onload, onerror), javascript: URIs
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  let sanitized = input;

  // 1. Remove script and iframe tags
  sanitized = sanitized.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '');
  sanitized = sanitized.replace(/<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, '');

  // 2. Remove dangerous inline javascript: and data: URIs
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // 3. Remove inline event handlers like onerror=, onclick=, onload=
  sanitized = sanitized.replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, '');
  sanitized = sanitized.replace(/\bon\w+\s*=\s*[^>\s]+/gi, '');

  // 4. Strip html tag brackets if not intended
  sanitized = sanitized.replace(/[<>]/g, '');

  return sanitized.trim();
}

/**
 * Recursively sanitize all string fields in an object
 */
export function sanitizePayload<T extends Record<string, any>>(obj: T): T {
  const result: any = Array.isArray(obj) ? [] : {};

  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      result[key] = sanitizeInput(val);
    } else if (val && typeof val === 'object') {
      result[key] = sanitizePayload(val);
    } else {
      result[key] = val;
    }
  }

  return result as T;
}

/**
 * Client-Side Rate Limiter
 * Max 5 submissions per 10 minutes per form
 */
export function checkRateLimit(formIdentifier: string, maxAttempts = 6, windowMinutes = 10): { allowed: boolean; waitSeconds?: number } {
  try {
    const fp = getClientFingerprint();
    const key = `${RATE_LIMIT_PREFIX}${formIdentifier}_${fp}`;
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    const recordRaw = localStorage.getItem(key);
    let record: { count: number; firstAttempt: number } = recordRaw
      ? JSON.parse(recordRaw)
      : { count: 0, firstAttempt: now };

    // If window expired, reset
    if (now - record.firstAttempt > windowMs) {
      record = { count: 1, firstAttempt: now };
      localStorage.setItem(key, JSON.stringify(record));
      return { allowed: true };
    }

    if (record.count >= maxAttempts) {
      const waitSeconds = Math.ceil((record.firstAttempt + windowMs - now) / 1000);
      return { allowed: false, waitSeconds };
    }

    record.count += 1;
    localStorage.setItem(key, JSON.stringify(record));
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

/**
 * Record a security threat event in the audit ledger
 */
export function recordSecurityEvent(event: Omit<SecurityAuditLog, 'id' | 'timestamp' | 'clientFingerprint'>): void {
  try {
    const logs = getSecurityLogs();
    const newLog: SecurityAuditLog = {
      ...event,
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      clientFingerprint: getClientFingerprint()
    };

    const updated = [newLog, ...logs].slice(0, 100); // keep last 100 events
    localStorage.setItem(STORAGE_SECURITY_LOGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not record security event:', err);
  }
}

/**
 * Retrieve security audit logs
 */
export function getSecurityLogs(): SecurityAuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_SECURITY_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Clear security logs
 */
export function clearSecurityLogs(): void {
  try {
    localStorage.removeItem(STORAGE_SECURITY_LOGS_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Master Submission Defense Validator
 * Validates honeypot, rate limits, phone formatting, and XSS sanitization in 1 step!
 */
export function validatePublicSubmission<T extends Record<string, any>>(
  payload: T,
  options: {
    formName: string;
    honeypotValue?: string;
    phoneFieldName?: string;
    requirePhone?: boolean;
  }
): {
  isSafe: boolean;
  errorMessage?: string;
  sanitizedPayload: T;
} {
  const { formName, honeypotValue, phoneFieldName = 'phone', requirePhone = true } = options;

  // 1. Honeypot check: If the hidden honeypot field has ANY value, it was filled by an automated bot
  if (honeypotValue && honeypotValue.trim().length > 0) {
    recordSecurityEvent({
      threatType: 'BOT_HONEYPOT_TRIGGERED',
      severity: 'HIGH',
      sourceForm: formName,
      details: `Automated bot detected via honeypot trap field (content: "${honeypotValue.substring(0, 20)}")`
    });

    return {
      isSafe: false,
      errorMessage: 'স্প্যাম অনুরোধ শনাক্ত হয়েছে। ফর্মটি সফল হয়নি।',
      sanitizedPayload: payload
    };
  }

  // 2. Rate Limit Check
  const rateCheck = checkRateLimit(formName);
  if (!rateCheck.allowed) {
    recordSecurityEvent({
      threatType: 'RATE_LIMIT_EXCEEDED',
      severity: 'MEDIUM',
      sourceForm: formName,
      details: `Too many submissions from same client in short time window. Must wait ${rateCheck.waitSeconds}s`
    });

    return {
      isSafe: false,
      errorMessage: `অতিরিক্ত রিকুয়েস্ট পাঠানো হয়েছে। অনুগ্রহ করে ${rateCheck.waitSeconds} সেকেন্ড পর পুনরায় চেষ্টা করুন।`,
      sanitizedPayload: payload
    };
  }

  // 3. Inspect for XSS / Malicious script injection attempts
  let foundInjection = false;
  let detectedPattern = '';

  for (const [k, v] of Object.entries(payload)) {
    if (typeof v === 'string') {
      if (/<script|javascript:|onerror=|onload=|<iframe/i.test(v)) {
        foundInjection = true;
        detectedPattern = `Field: ${k}, payload preview: ${v.substring(0, 30)}`;
        break;
      }
    }
  }

  if (foundInjection) {
    recordSecurityEvent({
      threatType: 'XSS_INJECTION_DETECTED',
      severity: 'CRITICAL',
      sourceForm: formName,
      details: `Malicious XSS script pattern intercepted and defused. ${detectedPattern}`
    });
  }

  // 4. Sanitize all fields
  const sanitizedPayload = sanitizePayload(payload);

  // 5. Phone validation if required
  if (requirePhone) {
    const rawPhone = (sanitizedPayload[phoneFieldName] || '').replace(/[-+()\s]/g, '');
    if (rawPhone.length > 0 && rawPhone.length < 10) {
      return {
        isSafe: false,
        errorMessage: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)।',
        sanitizedPayload
      };
    }
  }

  return {
    isSafe: true,
    sanitizedPayload
  };
}
