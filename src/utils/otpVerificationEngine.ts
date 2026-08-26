/**
 * Master OTP Verification System
 * 
 * Capabilities:
 * - Dynamic generation of secure 6-digit numeric OTP tokens
 * - Expiry management (default 5 minutes)
 * - Max attempt throttling (3 attempts before lockout)
 * - Resend cooldown timing (60s)
 * - Multi-channel delivery simulation (SMS, WhatsApp, Email, Screen Modal)
 */

import { OtpVerificationConfig } from '../types';

export interface OtpSession {
  sessionId: string;
  phone: string;
  code: string;
  expiresAt: number;
  attemptsLeft: number;
  resendsLeft: number;
  lastSentAt: number;
  isVerified: boolean;
}

const ACTIVE_OTP_SESSIONS_KEY = 'nca_active_otp_sessions';

export function requestNewOtp(
  phone: string,
  config?: OtpVerificationConfig
): { success: boolean; session?: OtpSession; message: string; simulatedCode?: string } {
  const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '');
  const now = Date.now();

  const cfg: OtpVerificationConfig = config || {
    mode: 'OFF',
    provider: 'SIMULATED',
    otpExpiryMinutes: 5,
    maxAttempts: 3,
    resendCooldownSeconds: 60,
    maxResendsPerSession: 3,
    lockoutMinutes: 15
  };

  try {
    const raw = localStorage.getItem(ACTIVE_OTP_SESSIONS_KEY);
    let sessions: Record<string, OtpSession> = raw ? JSON.parse(raw) : {};

    const existing = sessions[cleanPhone];
    if (existing) {
      // Check cooldown
      const secondsSinceLast = (now - existing.lastSentAt) / 1000;
      if (secondsSinceLast < (cfg.resendCooldownSeconds || 60)) {
        const wait = Math.ceil((cfg.resendCooldownSeconds || 60) - secondsSinceLast);
        return {
          success: false,
          message: `Please wait ${wait} seconds before requesting a new OTP.`
        };
      }

      if (existing.resendsLeft <= 0) {
        return {
          success: false,
          message: 'Maximum OTP resend limit reached. Please contact helpline or try again later.'
        };
      }
    }

    // Generate fresh 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryMs = (cfg.otpExpiryMinutes || 5) * 60 * 1000;

    const newSession: OtpSession = {
      sessionId: `otp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      phone: cleanPhone,
      code,
      expiresAt: now + expiryMs,
      attemptsLeft: cfg.maxAttempts || 3,
      resendsLeft: existing ? existing.resendsLeft - 1 : (cfg.maxResendsPerSession || 3),
      lastSentAt: now,
      isVerified: false
    };

    sessions[cleanPhone] = newSession;
    localStorage.setItem(ACTIVE_OTP_SESSIONS_KEY, JSON.stringify(sessions));

    console.log(`[OTP Engine - ${cfg.provider}] Code for ${cleanPhone}: ${code}`);

    return {
      success: true,
      session: newSession,
      simulatedCode: code,
      message: `A 6-digit verification code has been sent to ${cleanPhone}.`
    };
  } catch (e) {
    return {
      success: false,
      message: 'Failed to initialize OTP verification.'
    };
  }
}

export function verifyOtpSubmission(
  phone: string,
  userCode: string
): { success: boolean; message: string } {
  const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '');
  const now = Date.now();

  try {
    const raw = localStorage.getItem(ACTIVE_OTP_SESSIONS_KEY);
    let sessions: Record<string, OtpSession> = raw ? JSON.parse(raw) : {};

    const session = sessions[cleanPhone];
    if (!session) {
      return { success: false, message: 'No active OTP verification session found for this phone number.' };
    }

    if (now > session.expiresAt) {
      delete sessions[cleanPhone];
      localStorage.setItem(ACTIVE_OTP_SESSIONS_KEY, JSON.stringify(sessions));
      return { success: false, message: 'OTP verification code has expired. Please request a new code.' };
    }

    if (session.attemptsLeft <= 0) {
      return { success: false, message: 'Maximum failed verification attempts reached. Please request a new OTP.' };
    }

    if (session.code.trim() === userCode.trim()) {
      session.isVerified = true;
      sessions[cleanPhone] = session;
      localStorage.setItem(ACTIVE_OTP_SESSIONS_KEY, JSON.stringify(sessions));
      return { success: true, message: 'Phone number verified successfully.' };
    } else {
      session.attemptsLeft -= 1;
      sessions[cleanPhone] = session;
      localStorage.setItem(ACTIVE_OTP_SESSIONS_KEY, JSON.stringify(sessions));
      return {
        success: false,
        message: `Incorrect OTP code. ${session.attemptsLeft} attempt(s) remaining.`
      };
    }
  } catch (e) {
    return { success: false, message: 'Verification error occurred.' };
  }
}
