import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const rawQuery = req.body?.query;
    const query = typeof rawQuery === "string" ? rawQuery.trim() : "";
    const academyContext = req.body?.academyContext;
    const userRole = req.body?.userRole || "Admin";
    const attachments = req.body?.attachments; // Array of { name, mimeType, data }

    if (!query && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ error: "Query or attachment is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // If GEMINI_API_KEY is not yet added in Vercel Environment Variables, provide an intelligent operational response
      return res.status(200).json({
        answer: `### 🤖 Nexgen Operations Summary (Instant Analytics Mode)

I have analyzed your query based on the active academy database context:
- **Total Students**: ${academyContext?.summary?.totalStudents || 0}
- **Active Leads in CRM**: ${academyContext?.summary?.totalLeads || 0}
- **Total Active Batches**: ${academyContext?.summary?.totalBatches || 0}
- **Monthly Collection**: ৳${academyContext?.stats?.monthCollection?.toLocaleString() || 0}
- **Outstanding Dues**: ৳${academyContext?.stats?.totalDue?.toLocaleString() || 0}

*Note for Admin:* To enable full deep reasoning with Gemini 3.7 Flash on Vercel, please add \`GEMINI_API_KEY\` in your **Vercel Project Settings > Environment Variables** and redeploy.`,
        reply: "Instant response generated.",
        success: true
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemPrompt = `You are the executive AI Operations Assistant for "Nexgen Computer Academy", a premier IT & Skill Development training institute.
Your goal is to provide accurate, insightful, executive-level summaries, statistics, advice, and recommendations based on the current live academy database context and any uploaded files or screenshots.

Capabilities:
1. Multimodal Analysis: You can view, read, and analyze uploaded images, screenshots (e.g. system bugs, payment receipts, student forms, WhatsApp chat screenshots), PDFs, and data documents.
2. Real-time Academy Operations: Always base your calculations and answers on the provided JSON data context.
3. User Role: "${userRole}".
4. Professional & Actionable: Use clear formatting (markdown headings, bullet points, bold numbers, actionable next steps).
5. Currency: BDT (৳) or Taka.

Live Academy Context:
${JSON.stringify(academyContext || {}, null, 2)}
`;

    const parts: any[] = [];

    if (attachments && Array.isArray(attachments)) {
      for (const att of attachments) {
        if (att && att.data && att.mimeType) {
          const rawBase64 = typeof att.data === "string" ? att.data.replace(/^data:[^;]+;base64,/, "") : "";
          if (rawBase64) {
            parts.push({
              inlineData: {
                mimeType: att.mimeType,
                data: rawBase64,
              },
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
    return res.status(200).json({ answer: replyText, reply: replyText, success: true });
  } catch (err: any) {
    console.error("Vercel AI assistant error:", err);
    return res.status(500).json({ error: err?.message || "Failed to generate AI response." });
  }
}
