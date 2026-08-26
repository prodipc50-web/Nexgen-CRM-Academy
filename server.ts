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
