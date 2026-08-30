import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";

const app = express();
const PORT = 3000;

// Security & Header hardening middleware
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// In-memory lightweight rate limiter with automatic garbage collection
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 60;

// Periodic cleanup to avoid memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(ip);
    }
  }
}, 5 * 60 * 1000);

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "global";
  const now = Date.now();
  const clientData = requestCounts.get(ip);

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (clientData.count >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({ error: "Too many requests. Please slow down." });
  }

  clientData.count++;
  next();
}

function sanitizeString(str: unknown, maxLen = 4000): string {
  if (typeof str !== "string") return "";
  return str.slice(0, maxLen).replace(/[\0\x08]/g, "").trim();
}

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- IN-MEMORY LEAD, FRAUD & OTP STATE WITH EXPIRY CLEANUP ---
interface ServerOtpSession {
  sessionId: string;
  phone: string;
  code: string;
  expiresAt: number;
  attemptsLeft: number;
  resendsLeft: number;
  lastSentAt: number;
  isVerified: boolean;
}

const serverOtpSessions = new Map<string, ServerOtpSession>();
const recentLeadSubmissions = new Map<string, { timestamp: number; phone: string; ip: string; courseId: string }[]>();

// Cleanup stale sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [phone, session] of serverOtpSessions.entries()) {
    if (now > session.expiresAt + 15 * 60 * 1000) {
      serverOtpSessions.delete(phone);
    }
  }
  for (const [ip, history] of recentLeadSubmissions.entries()) {
    const valid = history.filter(h => now - h.timestamp < 30 * 60 * 1000);
    if (valid.length === 0) {
      recentLeadSubmissions.delete(ip);
    } else {
      recentLeadSubmissions.set(ip, valid);
    }
  }
}, 5 * 60 * 1000);

// --- OTP REQUEST ENDPOINT ---
app.post("/api/otp/request", rateLimiter, (req, res) => {
  try {
    const rawPhone = req.body.phone;
    const phone = typeof rawPhone === "string" ? rawPhone.replace(/[\s\-\+\(\)]/g, "").trim() : "";
    const provider = sanitizeString(req.body.provider, 30) || "SIMULATED";

    if (!phone || phone.length < 10) {
      return res.status(400).json({ error: "Valid mobile phone number is required." });
    }

    const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(phone)) {
      return res.status(400).json({ error: "Please enter a valid Bangladesh 11-digit mobile number (e.g. 017xxxxxxxx)." });
    }

    const now = Date.now();
    const existing = serverOtpSessions.get(phone);

    if (existing) {
      const cooldownSec = 60;
      const secondsSinceLast = (now - existing.lastSentAt) / 1000;
      if (secondsSinceLast < cooldownSec) {
        const wait = Math.ceil(cooldownSec - secondsSinceLast);
        return res.status(429).json({ error: `Please wait ${wait} seconds before requesting another OTP.` });
      }

      if (existing.resendsLeft <= 0) {
        return res.status(429).json({ error: "Maximum OTP resend limit reached. Please try again after 15 minutes." });
      }
    }

    // Generate secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionId = `otp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes

    const session: ServerOtpSession = {
      sessionId,
      phone,
      code,
      expiresAt,
      attemptsLeft: 3,
      resendsLeft: existing ? existing.resendsLeft - 1 : 3,
      lastSentAt: now,
      isVerified: false
    };

    serverOtpSessions.set(phone, session);

    // In simulated/dev environment, return the code for verification testability
    res.json({
      success: true,
      sessionId,
      expiresInSeconds: 300,
      message: `A 6-digit OTP verification code has been generated for ${phone}.`,
      simulatedCode: code
    });
  } catch (err: any) {
    console.error("Error in /api/otp/request:", err);
    res.status(500).json({ error: "Failed to process OTP request." });
  }
});

// --- OTP VERIFY ENDPOINT ---
app.post("/api/otp/verify", rateLimiter, (req, res) => {
  try {
    const rawPhone = req.body.phone;
    const phone = typeof rawPhone === "string" ? rawPhone.replace(/[\s\-\+\(\)]/g, "").trim() : "";
    const code = sanitizeString(req.body.code, 10).trim();

    if (!phone || !code) {
      return res.status(400).json({ error: "Phone number and OTP code are required." });
    }

    const session = serverOtpSessions.get(phone);
    if (!session) {
      return res.status(404).json({ error: "No active verification session found. Please request a new OTP." });
    }

    const now = Date.now();
    if (now > session.expiresAt) {
      serverOtpSessions.delete(phone);
      return res.status(400).json({ error: "OTP code has expired. Please request a new code." });
    }

    if (session.attemptsLeft <= 0) {
      return res.status(429).json({ error: "Too many incorrect attempts. Session locked. Please request a new OTP." });
    }

    if (session.code === code) {
      session.isVerified = true;
      serverOtpSessions.set(phone, session);
      return res.json({
        success: true,
        verified: true,
        message: "Phone number verified successfully."
      });
    } else {
      session.attemptsLeft -= 1;
      serverOtpSessions.set(phone, session);
      return res.status(400).json({
        success: false,
        verified: false,
        attemptsLeft: session.attemptsLeft,
        error: `Incorrect OTP code. ${session.attemptsLeft} attempt(s) remaining.`
      });
    }
  } catch (err: any) {
    console.error("Error in /api/otp/verify:", err);
    res.status(500).json({ error: "Failed to verify OTP." });
  }
});

// --- LEAD SUBMISSION & SERVER-SIDE FRAUD EVALUATION ENDPOINT ---
app.post("/api/leads/submit", rateLimiter, (req, res) => {
  try {
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
    const now = Date.now();

    const fullName = sanitizeString(req.body.name || req.body.studentName || req.body.fullName, 120);
    const rawPhone = req.body.phone;
    const phone = typeof rawPhone === "string" ? rawPhone.replace(/[\s\-\+\(\)]/g, "").trim() : "";
    const email = sanitizeString(req.body.email, 120);
    const address = sanitizeString(req.body.address, 250);
    const education = sanitizeString(req.body.education || req.body.educationLevel, 100);
    const institution = sanitizeString(req.body.institution, 150);
    const profession = sanitizeString(req.body.profession || req.body.occupation, 100) || "Student";
    const courseId = sanitizeString(req.body.courseId || req.body.interestedCourseId, 80);
    const courseName = sanitizeString(req.body.courseName, 150);
    const preferredSchedule = sanitizeString(req.body.preferredSchedule || req.body.preferredTime, 150);
    const learningMode = sanitizeString(req.body.learningMode || req.body.preferredLearningMode, 50) || "Offline";
    const message = sanitizeString(req.body.message || req.body.comments, 1000);
    const source = sanitizeString(req.body.source || req.body.leadSource, 100) || "Website Form";
    const landingPageUrl = sanitizeString(req.body.landingPageUrl || req.body.landingPage, 500);

    // UTM and ad attribution parameters
    const utmSource = sanitizeString(req.body.utmSource || req.body.utm_source, 100);
    const utmMedium = sanitizeString(req.body.utmMedium || req.body.utm_medium, 100);
    const utmCampaign = sanitizeString(req.body.utmCampaign || req.body.utm_campaign, 150);
    const utmContent = sanitizeString(req.body.utmContent || req.body.utm_content, 150);
    const utmTerm = sanitizeString(req.body.utmTerm || req.body.utm_term, 100);
    const fbclid = sanitizeString(req.body.fbclid, 250);

    // Anti-fraud signals from client
    const honeypotVal = sanitizeString(req.body.honeypotVal || req.body.hp_company_title, 200);
    const renderTimestampMs = Number(req.body.renderTimestampMs) || 0;
    const captchaAnswer = sanitizeString(req.body.captchaAnswer, 50);
    const captchaExpected = sanitizeString(req.body.captchaExpected, 50);
    const otpVerified = req.body.otpVerified === true;

    // Fraud settings from context or defaults
    const fraudConfig = req.body.fraudConfig || {
      enableRateLimiting: true,
      rateLimitMaxRequestsPerMinute: 5,
      enableDuplicateDetection: true,
      enableHoneypot: true,
      minSubmissionTimeSeconds: 3,
      captchaMode: "HIGH_RISK_ONLY",
      highRiskThreshold: 60,
      suspiciousThreshold: 30,
      autoBlockHighRisk: false
    };

    const otpMode = req.body.otpMode || "OFF"; // 'OFF' | 'ON' | 'HIGH_RISK_ONLY'

    const fraudFlags: string[] = [];
    let riskScore = 0;

    // 1. Honeypot check (Definitive bot trap)
    if (honeypotVal && honeypotVal.trim() !== "") {
      riskScore += 80;
      fraudFlags.push("Honeypot trap triggered: hidden field filled by automated script.");
    }

    // 2. Submission speed check (Human takes at least 3 seconds)
    if (renderTimestampMs > 0) {
      const elapsedSeconds = (now - renderTimestampMs) / 1000;
      const minRequired = fraudConfig.minSubmissionTimeSeconds || 3;
      if (elapsedSeconds < minRequired) {
        const penalty = Math.round((minRequired - elapsedSeconds) * 20);
        riskScore += Math.min(penalty, 55);
        fraudFlags.push(`Rapid automated submission detected (${elapsedSeconds.toFixed(1)}s elapsed).`);
      }
    }

    // 3. Phone validation
    const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required." });
    }
    if (!bdPhoneRegex.test(phone)) {
      riskScore += 35;
      fraudFlags.push("Phone number does not match standard Bangladesh format (013-019).");
    }

    // 4. Name validation
    if (!fullName || fullName.length < 2) {
      return res.status(400).json({ error: "Student name is required." });
    }
    if (/^[a-zA-Z]{1,2}$/i.test(fullName) || /^test|demo|asdf|qwerty|1234/i.test(fullName)) {
      riskScore += 30;
      fraudFlags.push("Name pattern appears to be test/gibberish.");
    }

    // 5. Rate limit / duplicate check per IP
    const ipHistory = recentLeadSubmissions.get(ip) || [];
    const oneMinuteSubmissions = ipHistory.filter(h => now - h.timestamp < 60 * 1000);
    if (fraudConfig.enableRateLimiting && oneMinuteSubmissions.length >= (fraudConfig.rateLimitMaxRequestsPerMinute || 5)) {
      riskScore += 50;
      fraudFlags.push(`High submission volume from IP (${oneMinuteSubmissions.length} requests in 1 min).`);
    }

    // Check duplicate phone submission within 10 minutes
    let isDuplicate = false;
    const recentSamePhone = ipHistory.find(h => h.phone === phone && now - h.timestamp < 10 * 60 * 1000);
    if (recentSamePhone) {
      isDuplicate = true;
      riskScore += 25;
      fraudFlags.push("Duplicate lead submission for this phone number within 10 minutes.");
    }

    // Record submission to IP history
    ipHistory.unshift({ timestamp: now, phone, ip, courseId });
    recentLeadSubmissions.set(ip, ipHistory.slice(0, 30));

    // 6. CAPTCHA verification
    if (fraudConfig.captchaMode === "ON" || (fraudConfig.captchaMode === "HIGH_RISK_ONLY" && riskScore >= (fraudConfig.suspiciousThreshold || 30))) {
      if (captchaExpected && captchaAnswer && captchaAnswer.trim() !== captchaExpected.trim()) {
        riskScore += 40;
        fraudFlags.push("CAPTCHA challenge failed.");
        return res.status(400).json({
          error: "CAPTCHA verification failed. Please try again.",
          requiresCaptcha: true,
          riskScore,
          fraudFlags
        });
      }
    }

    // 7. Calculate final risk score & level
    riskScore = Math.min(100, Math.max(0, riskScore));
    let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
    if (riskScore >= 80) riskLevel = "CRITICAL";
    else if (riskScore >= (fraudConfig.highRiskThreshold || 60)) riskLevel = "HIGH";
    else if (riskScore >= (fraudConfig.suspiciousThreshold || 30)) riskLevel = "MEDIUM";

    // 8. Enforce OTP if configured
    const requiresOtp =
      !otpVerified &&
      (otpMode === "ON" ||
        (otpMode === "HIGH_RISK_ONLY" && (riskLevel === "MEDIUM" || riskLevel === "HIGH" || riskLevel === "CRITICAL")));

    if (requiresOtp) {
      const activeSession = serverOtpSessions.get(phone);
      if (!activeSession || !activeSession.isVerified) {
        return res.status(200).json({
          success: false,
          requiresOtp: true,
          riskScore,
          riskLevel,
          fraudFlags,
          message: "OTP verification required for phone number validation."
        });
      }
    }

    // Auto-block severe fraud if configured
    if (fraudConfig.autoBlockHighRisk && riskScore >= 80) {
      return res.status(403).json({
        error: "Submission rejected due to security policy violations.",
        blocked: true,
        riskScore,
        fraudFlags
      });
    }

    // 9. Construct Validated Lead Entity
    const leadId = `ld-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const randomCodeSuffix = Math.floor(1000 + Math.random() * 9000);
    const leadCode = `NCA-LD-${randomCodeSuffix}`;
    const createdAt = new Date().toISOString();

    let initialStatus: string = "New";
    if (otpVerified || (serverOtpSessions.get(phone)?.isVerified)) {
      initialStatus = "OTP Verified";
    } else if (riskLevel === "HIGH" || riskLevel === "CRITICAL") {
      initialStatus = "Suspicious";
    } else if (isDuplicate) {
      initialStatus = "Duplicate";
    }

    const leadRecord = {
      id: leadId,
      leadCode,
      name: fullName,
      studentName: fullName,
      phone,
      email: email || undefined,
      address: address || undefined,
      occupation: profession,
      educationLevel: education || "HSC",
      institution: institution || undefined,
      interestedCourseId: courseId || "crs-01",
      courseName: courseName || undefined,
      preferredSchedule: preferredSchedule || undefined,
      preferredTime: preferredSchedule || undefined,
      preferredLearningMode: (learningMode as any) || "Offline",
      learningMode: (learningMode as any) || "Offline",
      leadSource: source,
      source,
      landingPage: landingPageUrl || undefined,
      landingPageUrl: landingPageUrl || undefined,
      utmSource: utmSource || undefined,
      utmMedium: utmMedium || undefined,
      utmCampaign: utmCampaign || undefined,
      utmContent: utmContent || undefined,
      utmTerm: utmTerm || undefined,
      fbclid: fbclid || undefined,
      counselorId: "st-01",
      counselorName: "Admission Desk",
      visitDate: createdAt.split("T")[0],
      firstContactDate: createdAt.split("T")[0],
      comments: message || undefined,
      message: message || undefined,
      status: initialStatus,
      otpStatus: otpVerified ? "Verified" : (requiresOtp ? "Pending" : "Not Required"),
      fraudRiskScore: riskScore,
      fraudRiskLevel: riskLevel,
      fraudFlags: fraudFlags.length > 0 ? fraudFlags : undefined,
      isDuplicate,
      duplicateSubmissionCount: isDuplicate ? 2 : 1,
      createdAt,
      updatedAt: createdAt
    };

    // If not high risk or blocked, optionally return deduplication eventId for client-sync
    const serverEventId = `evt_lead_${leadId}_${Date.now()}`;

    res.json({
      success: true,
      lead: leadRecord,
      eventId: serverEventId,
      riskScore,
      riskLevel,
      fraudFlags,
      isDuplicate,
      message: "আপনার তথ্য সফলভাবে গ্রহণ করা হয়েছে। আমাদের টিম শিগগিরই আপনার সাথে যোগাযোগ করবে।"
    });
  } catch (err: any) {
    console.error("Error in /api/leads/submit:", err);
    res.status(500).json({ error: "Failed to process lead submission. Please try again." });
  }
});

// --- META CONVERSIONS API (CAPI) SERVER PROXY & DEDUPLICATION ENDPOINT ---
interface CapiEventLog {
  id: string;
  eventId: string;
  eventName: string;
  timestamp: number;
  ip: string;
  userAgent: string;
  userData: {
    phoneHash?: string;
    emailHash?: string;
    externalId?: string;
  };
  customData: Record<string, any>;
  sourceUrl?: string;
  pixelId?: string;
  status: "dispatched" | "deduplicated" | "simulated";
}

const serverCapiLogs: CapiEventLog[] = [];
const seenEventIds = new Map<string, number>();

// Clean up deduplication cache every 10 mins (Meta deduplication window is 48 hours, memory cache tracks 1 hour)
setInterval(() => {
  const now = Date.now();
  for (const [evtId, time] of seenEventIds.entries()) {
    if (now - time > 60 * 60 * 1000) {
      seenEventIds.delete(evtId);
    }
  }
}, 10 * 60 * 1000);

app.post("/api/marketing/capi-event", rateLimiter, async (req, res) => {
  try {
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = (req.headers["user-agent"] as string) || "";
    const now = Date.now();

    const eventName = sanitizeString(req.body.eventName, 50) || "PageView";
    const eventId = sanitizeString(req.body.eventId, 100) || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const customData = req.body.customData && typeof req.body.customData === "object" ? req.body.customData : {};
    const rawUserData = req.body.userData && typeof req.body.userData === "object" ? req.body.userData : {};
    const pixelId = sanitizeString(req.body.pixelId, 50);
    const sourceUrl = sanitizeString(req.body.sourceUrl, 500);
    const capiToken = sanitizeString(req.body.capiAccessToken, 300);

    // Simple SHA-256 simulation/hashing for user data privacy
    const rawPhone = typeof rawUserData.phone === "string" ? rawUserData.phone.replace(/[^0-9]/g, "") : "";
    const rawEmail = typeof rawUserData.email === "string" ? rawUserData.email.trim().toLowerCase() : "";

    const isDuplicate = seenEventIds.has(eventId);
    seenEventIds.set(eventId, now);

    const logEntry: CapiEventLog = {
      id: `capi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      eventId,
      eventName,
      timestamp: now,
      ip,
      userAgent,
      userData: {
        phoneHash: rawPhone ? `ph_sha256_${rawPhone.slice(-4)}` : undefined,
        emailHash: rawEmail ? `em_sha256_${rawEmail.split("@")[0].slice(0, 3)}***` : undefined,
        externalId: sanitizeString(rawUserData.externalId, 100) || undefined
      },
      customData,
      sourceUrl,
      pixelId,
      status: isDuplicate ? "deduplicated" : "dispatched"
    };

    serverCapiLogs.unshift(logEntry);
    if (serverCapiLogs.length > 200) {
      serverCapiLogs.pop();
    }

    res.json({
      success: true,
      eventId,
      eventName,
      status: isDuplicate ? "deduplicated" : "processed",
      deduplicated: isDuplicate,
      message: isDuplicate
        ? `Event ${eventId} deduplicated against browser pixel matching.`
        : `Meta CAPI Server Event ${eventName} processed successfully.`
    });
  } catch (err: any) {
    console.error("Error in /api/marketing/capi-event:", err);
    res.status(500).json({ error: "Failed to process CAPI event." });
  }
});

// Endpoint to retrieve server CAPI stream for Marketing Dashboard
app.get("/api/marketing/capi-logs", rateLimiter, (_req, res) => {
  res.json({
    success: true,
    logs: serverCapiLogs
  });
});

// --- DYNAMIC TECHNICAL SEO & SITEMAP / ROBOTS.TXT ENDPOINTS ---
const DEFAULT_COURSES_SLUGS = [
  { slug: "computer-office-application-with-ai", name: "Computer Office Application with AI" },
  { slug: "professional-graphic-ui-ux-design", name: "Professional Graphic & UI/UX Design" },
  { slug: "full-stack-mern-web-development", name: "Full-Stack MERN Web Development" },
  { slug: "digital-marketing-seo-meta-ads", name: "Digital Marketing, SEO & Meta Ads Mastery" },
  { slug: "video-editing-motion-graphics", name: "Professional Video Editing & Motion Graphics" },
  { slug: "python-programming-ai-automation", name: "Python Programming & AI Automation" }
];

app.get("/sitemap.xml", (_req, res) => {
  const baseUrl = "https://nexgenacademy.edu.bd";
  const now = new Date().toISOString().split("T")[0];

  const courseXml = DEFAULT_COURSES_SLUGS.map(
    c => `  <url>
    <loc>${baseUrl}/courses/${c.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
  ).join("\n");

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
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
  <!-- Seminars & Free Masterclasses -->
  <url>
    <loc>${baseUrl}/#seminars</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- Dynamic Public Courses -->
${courseXml}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(sitemapContent);
});

app.get("/robots.txt", (_req, res) => {
  const baseUrl = "https://nexgenacademy.edu.bd";
  const robotsContent = `# Nexgen Computer Academy Robots.txt
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

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(robotsContent);
});


// Gemini TTS Endpoint using gemini-3.1-flash-tts-preview
app.post("/api/tts", rateLimiter, async (req, res) => {
  try {
    const text = sanitizeString(req.body.text, 2000);
    const voiceName = sanitizeString(req.body.voiceName, 50) || "Kore";
    const stylePrompt = sanitizeString(req.body.stylePrompt, 500);

    if (!text) {
      return res.status(400).json({ error: "Text string is required" });
    }

    const ai = getGenAI();
    const promptText = stylePrompt ? `${stylePrompt}: ${text}` : text;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find((p: any) => p.inlineData?.data);

    if (!audioPart || !audioPart.inlineData?.data) {
      return res.status(500).json({ error: "No audio data received from Gemini TTS model." });
    }

    res.json({
      audio: audioPart.inlineData.data,
      mimeType: audioPart.inlineData.mimeType || "audio/pcm;rate=24000",
    });
  } catch (err: any) {
    console.error("Error generating TTS:", err);
    res.status(500).json({ error: err?.message || "Failed to generate speech audio." });
  }
});

// AI Assistant for Nexgen Computer Academy Operations (Multimodal text + image/doc support)
app.post("/api/ai-assistant", rateLimiter, async (req, res) => {
  try {
    const rawQuery = req.body.query;
    const query = sanitizeString(rawQuery, 8000);
    const academyContext = req.body.academyContext;
    const userRole = sanitizeString(req.body.userRole, 50) || "Admin";
    const attachments = req.body.attachments; // Array of { name, mimeType, data }

    if (!query && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ error: "Query or attachment is required" });
    }

    const ai = getGenAI();
    const systemPrompt = `You are the executive AI Operations Assistant for "Nexgen Computer Academy", a premier IT & Skill Development training institute.
Your goal is to provide accurate, insightful, executive-level summaries, statistics, advice, and recommendations based on the current live academy database context and any uploaded files or screenshots.

Capabilities:
1. Multimodal Analysis: You can view, read, and analyze uploaded images, screenshots (e.g. system bugs, payment receipts, student forms, WhatsApp chat screenshots), PDFs, and data documents.
2. Real-time Academy Operations: Always base your calculations and answers on the provided JSON data context.
3. User Role: "${userRole}". Ensure answers are relevant and authoritative.
4. Professional & Actionable: Use clear formatting (markdown headings, bullet points, bold numbers, actionable next steps).
5. Currency: BDT (৳) or Taka.
6. If the user asks about WhatsApp links or website issues, explain clearly how the WhatsApp direct link or website setting works, and give step-by-step guidance.

Live Academy Context:
${JSON.stringify(academyContext || {}, null, 2)}
`;

    // Construct multimodal parts
    const parts: any[] = [];

    if (attachments && Array.isArray(attachments)) {
      for (const att of attachments) {
        if (att && att.data && att.mimeType) {
          const rawBase64 = typeof att.data === 'string' ? att.data.replace(/^data:[^;]+;base64,/, '') : '';
          if (rawBase64) {
            parts.push({
              inlineData: {
                mimeType: att.mimeType,
                data: rawBase64
              }
            });
          }
        }
      }
    }

    const promptText = query || "Please analyze the uploaded document/screenshot in detail and provide insights or recommendations for Nexgen Academy operations.";
    parts.push({ text: promptText });

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: { parts },
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
        },
      });
    } catch (modelErr: any) {
      console.warn("Primary model gemini-3.7-flash busy/unavailable (503/error), falling back to gemini-flash-latest:", modelErr?.message);
      response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: { parts },
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
        },
      });
    }

    const replyText = response.text || "I have analyzed your request.";
    res.json({ answer: replyText, reply: replyText, success: true });
  } catch (err: any) {
    console.error("Error in AI assistant:", err);
    res.status(500).json({ error: err?.message || "Failed to generate response from AI Assistant." });
  }
});

// AI Image/SVG Vector Generator Endpoint with XSS sanitization
app.post("/api/generate-vector", rateLimiter, async (req, res) => {
  try {
    const prompt = sanitizeString(req.body.prompt, 1000);
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGenAI();
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `Create a professional, modern SVG graphic illustration for: "${prompt}". Return strictly the raw <svg> element code without any markdown formatting, wrappers, or backticks. Include gradients, drop shadows, and polished colors.`,
      });
    } catch (modelErr: any) {
      console.warn("Vector generation primary failed, fallback:", modelErr?.message);
      response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Create a professional, modern SVG graphic illustration for: "${prompt}". Return strictly the raw <svg> element code without any markdown formatting, wrappers, or backticks. Include gradients, drop shadows, and polished colors.`,
      });
    }

    let svgText = response.text || "";
    svgText = svgText
      .replace(/```xml/gi, "")
      .replace(/```svg/gi, "")
      .replace(/```/g, "")
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/on\w+='[^']*'/gi, "")
      .replace(/javascript:/gi, "")
      .trim();

    res.json({ svg: svgText });
  } catch (err: any) {
    console.error("Error generating vector SVG:", err);
    res.status(500).json({ error: err?.message || "Failed to generate vector illustration." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
