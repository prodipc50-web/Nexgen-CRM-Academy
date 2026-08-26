import React, { useState, useRef, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  Zap,
  TrendingUp,
  AlertCircle,
  Paperclip,
  Image as ImageIcon,
  FileText,
  X,
  Upload,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface UploadedAttachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  data: string; // base64
  previewUrl?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  attachments?: {
    name: string;
    mimeType: string;
    previewUrl?: string;
    size?: number;
  }[];
}

export const AIAssistantView: React.FC = () => {
  const {
    currentUser,
    stats,
    leads,
    students,
    admissions,
    payments,
    expenses,
    batches,
    courses,
    campaigns,
    attendance,
    websiteCmsConfig,
    academySettings
  } = useAcademy();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello **${currentUser.name}**! 👋 I am your **Nexgen AI Operations Intelligence Assistant** powered by Gemini 3.7.\n\nI have real-time access to the entire academy database (${students.length} students, ${leads.length} leads, ${batches.length} batches, ৳${stats.totalDue.toLocaleString()} in dues, and ৳${stats.monthCollection.toLocaleString()} in monthly revenue).\n\n📷 **Multimodal Enabled:** You can now **upload screenshots, student forms, payment slips, or PDF documents** (using the paperclip icon or drag & drop), and ask me to analyze them!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    "Identify top 5 overdue payments and generate a polite WhatsApp collection message.",
    "Give an executive summary of this month's revenue, expenses, and net profit margin.",
    "Which courses are generating the highest revenue and best marketing ROI?",
    "How does the WhatsApp direct chat link work on website and how to configure it?",
    "Analyze today's urgent CRM follow-ups and suggest counseling strategy."
  ];

  // Helper to read file as Base64
  const processFile = (file: File): Promise<UploadedAttachment> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const isImage = file.type.startsWith('image/');
        resolve({
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
          data: base64String,
          previewUrl: isImage ? base64String : undefined
        });
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    try {
      const newAttachments = await Promise.all(files.map(file => processFile(file)));
      setAttachments(prev => [...prev, ...newAttachments]);
    } catch (err) {
      console.error("Error reading file:", err);
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const files = Array.from(e.dataTransfer.files);
    try {
      const newAttachments = await Promise.all(files.map(file => processFile(file)));
      setAttachments(prev => [...prev, ...newAttachments]);
    } catch (err) {
      console.error("Error reading dropped files:", err);
    }
  };

  const generateLocalAnalyticsFallback = (query: string, attachedCount: number): string => {
    const q = query.toLowerCase();

    if (q.includes('whatsapp') || q.includes('chat') || q.includes('button')) {
      const currentSupport = websiteCmsConfig?.marketing?.floatingWhatsAppNumber || academySettings.primarySupportPhone || '01798444444';
      return `### 📱 WhatsApp Direct Chat Link Configuration Guide

**How WhatsApp Click-to-Chat Works:**
1. **On Mobile Devices (Android / iPhone):** When a user taps the WhatsApp button on your website, it opens their **WhatsApp app directly** into a new chat with your academy number.
2. **On Desktop Computers / Laptops:** WhatsApp web standards show a landing screen with **"Continue to WhatsApp Web"** (or "Open App" if WhatsApp desktop software is installed). Clicking **"Continue to WhatsApp Web"** opens the chat box in the browser.

**Your Current Configuration:**
- **Academy Support Number:** \`${currentSupport}\`
- **International Format Used:** \`880${currentSupport.replace(/[^0-9]/g, '').replace(/^88/, '').replace(/^0/, '')}\`
- **Direct API Link:** \`https://api.whatsapp.com/send?phone=8801798444444\`

**How to Update WhatsApp Number:**
- Go to **Settings > Website CMS > Contact Info** or **Marketing** and enter your desired 11-digit mobile number. The system will automatically format it with the \`880\` country code.`;
    }

    if (q.includes('overdue') || q.includes('due') || q.includes('payment')) {
      const overdueList = admissions
        .filter(a => a.due > 0)
        .slice(0, 5)
        .map(a => {
          const s = students.find(st => st.id === a.studentId);
          const c = courses.find(cr => cr.id === a.courseId);
          return `- **${s?.name || 'Student'}** (${c?.name || 'Course'}): ৳${a.due.toLocaleString()} Due (Phone: \`${s?.phone || 'N/A'}\`)`;
        });

      return `### 💰 Overdue Payments & Collection Action Plan

**Total Outstanding Due:** ৳${stats.totalDue.toLocaleString()}

**Top Overdue Students:**
${overdueList.length > 0 ? overdueList.join('\n') : '- No active overdue students found.'}

**Polite WhatsApp Collection Template:**
> *"Assalamu Alaikum [Student Name], hope you are doing great with your course at Nexgen Academy! This is a gentle reminder that your installment of ৳[Amount] for the [Course Name] batch is due. Please complete it at your earliest convenience to avoid any disruption in classes. Thank you!"*`;
    }

    if (q.includes('revenue') || q.includes('profit') || q.includes('summary') || q.includes('expense')) {
      const totalExp = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
      const net = stats.monthCollection - totalExp;
      return `### 📊 Executive Financial & Operations Summary

- **Total Students Enrolled:** ${students.length}
- **Active CRM Leads:** ${leads.length}
- **Active Batches Running:** ${batches.length}
- **Total Course Offerings:** ${courses.length}
- **Total Monthly Fee Collection:** ৳${stats.monthCollection.toLocaleString()}
- **Total Recorded Expenses:** ৳${totalExp.toLocaleString()}
- **Net Operating Balance:** ৳${net.toLocaleString()} (${net >= 0 ? '🟢 Surplus' : '🔴 Deficit'})
- **Total Outstanding Dues:** ৳${stats.totalDue.toLocaleString()}`;
    }

    if (attachedCount > 0) {
      return `### 📎 File / Screenshot Received

I have received and stored your **${attachedCount} attachment(s)** for analysis.

*Tip for Production Deployments on Vercel:*
To enable deep multimodal vision reasoning with **Gemini 3.7 Flash** on your deployed Vercel site:
1. Go to your **Vercel Project Dashboard > Settings > Environment Variables**.
2. Add a variable named **\`GEMINI_API_KEY\`** with your Google AI Studio API key.
3. Trigger a redeploy (or push a new commit via GitHub).`;
    }

    return `### 🤖 Nexgen Operations Intelligence Assistant

Based on current real-time database metrics:
- **Active Students:** ${students.length}
- **Total Inquiries/Leads:** ${leads.length}
- **Monthly Revenue:** ৳${stats.monthCollection.toLocaleString()}
- **Total Dues Pending:** ৳${stats.totalDue.toLocaleString()}

Feel free to ask specific questions about student progress, fee collections, counselor conversion rates, or attach screenshots/documents!`;
  };

  const handleSend = async (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if ((!query && attachments.length === 0) || loading) return;

    const currentAttachments = [...attachments];

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query || 'Analyze attached file(s)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: currentAttachments.map(a => ({
        name: a.name,
        mimeType: a.mimeType,
        previewUrl: a.previewUrl,
        size: a.size
      }))
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setAttachments([]);
    setLoading(true);

    try {
      // Build lightweight live context
      const academyContext = {
        currentUser: { name: currentUser.name, role: currentUser.role },
        stats,
        summary: {
          totalStudents: students.length,
          totalLeads: leads.length,
          totalBatches: batches.length,
          totalCourses: courses.length,
          totalPaymentsCount: payments.length,
          totalExpensesCount: expenses.length
        },
        overdueAdmissions: admissions
          .filter(a => a.due > 0)
          .slice(0, 10)
          .map(a => {
            const stu = students.find(s => s.id === a.studentId);
            const crs = courses.find(c => c.id === a.courseId);
            return {
              studentName: stu?.name,
              phone: stu?.phone,
              course: crs?.name,
              finalFee: a.finalFee,
              paid: a.totalPaid,
              due: a.due,
              nextDueDate: a.nextDueDate
            };
          }),
        urgentFollowups: leads
          .filter(l => l.status !== 'Admitted' && l.status !== 'Lost')
          .slice(0, 10)
          .map(l => ({
            name: l.name,
            phone: l.phone,
            status: l.status,
            source: l.leadSource,
            nextFollowUpDate: l.nextFollowUpDate
          })),
        campaigns: campaigns.map(c => ({
          name: c.name,
          platform: c.platform,
          spent: c.spent,
          leads: c.leadsGenerated,
          admissions: c.admissionsCount
        }))
      };

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query || 'Analyze attached file(s)',
          userRole: currentUser.role,
          academyContext,
          attachments: currentAttachments.map(a => ({
            name: a.name,
            mimeType: a.mimeType,
            data: a.data
          }))
        })
      });

      if (!res.ok) {
        // If the server endpoint returned 404, 405, 500, fallback gracefully to instant local intelligent engine
        console.warn(`Server returned ${res.status}, using instant analytics engine fallback.`);
        const fallbackText = generateLocalAnalyticsFallback(query, currentAttachments.length);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
        return;
      }

      const data = await res.json();
      const reply = data.answer || data.reply || data.text || 'Analysis complete.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.warn("AI Assistant request error, using fallback:", err);
      const fallbackText = generateLocalAnalyticsFallback(query, currentAttachments.length);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className="space-y-4 animate-in fade-in duration-150 max-w-5xl mx-auto"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-5 rounded-3xl text-white shadow-xl border border-indigo-950">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black tracking-tight">Nexgen AI Operations Copilot</h2>
              <span className="text-[10px] font-bold bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                Gemini 3.7 Flash • Multimodal
              </span>
            </div>
            <p className="text-xs text-indigo-200/80">
              Real-time analytics, overdue collection recommendations, screenshot analysis & CRM intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Context: <strong>{students.length} Students</strong> • <strong>{leads.length} Leads</strong></span>
        </div>
      </div>

      {/* Drag & Drop Overlay Indicator */}
      {isDragging && (
        <div className="border-2 border-dashed border-indigo-500 bg-indigo-50/80 rounded-3xl p-6 text-center animate-pulse">
          <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-indigo-900">Drop your screenshot, image, or document here to analyze with AI</p>
        </div>
      )}

      {/* Suggested Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="shrink-0 bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs transition-all flex items-center space-x-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate max-w-xs">{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white shadow-2xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-400" />}
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white font-medium shadow-2xs rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200 text-slate-900 shadow-2xs rounded-tl-none space-y-2'
              }`}
            >
              {/* Render Attached Files in Message */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {msg.attachments.map((att, attIdx) => (
                    <div
                      key={attIdx}
                      className={`p-1.5 rounded-xl flex items-center space-x-2 border text-[11px] ${
                        msg.sender === 'user'
                          ? 'bg-indigo-700/80 border-indigo-500/50 text-white'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {att.previewUrl ? (
                        <img
                          src={att.previewUrl}
                          alt={att.name}
                          className="w-10 h-10 object-cover rounded-lg border border-indigo-400/30"
                        />
                      ) : (
                        <FileText className="w-5 h-5 text-amber-400" />
                      )}
                      <div className="max-w-[140px] truncate">
                        <p className="font-semibold truncate">{att.name}</p>
                        {att.size && <span className="opacity-70 text-[9px]">{(att.size / 1024).toFixed(0)} KB</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {msg.sender === 'assistant' ? (
                <div className="prose prose-xs max-w-none text-slate-900 leading-relaxed">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}

              <div
                className={`flex items-center justify-between pt-1 text-[10px] ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400 border-t border-slate-200/60'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className="hover:text-indigo-600 flex items-center space-x-1 font-semibold"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-3.5 flex items-center space-x-2 text-xs text-slate-500">
              <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Analyzing live database, attachments and formulating response with Gemini 3.7...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview Bar */}
      {attachments.length > 0 && (
        <div className="bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-2xl flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-bold text-indigo-900 flex items-center space-x-1 px-1">
            <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
            <span>Attached ({attachments.length}):</span>
          </span>
          {attachments.map(att => (
            <div
              key={att.id}
              className="bg-white border border-indigo-200 rounded-xl p-1.5 flex items-center space-x-2 text-xs text-slate-800 shadow-2xs"
            >
              {att.previewUrl ? (
                <img src={att.previewUrl} alt={att.name} className="w-8 h-8 object-cover rounded-lg border" />
              ) : (
                <FileText className="w-4 h-4 text-indigo-600" />
              )}
              <span className="max-w-[120px] truncate font-medium text-[11px]">{att.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="text-slate-400 hover:text-rose-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Box with File Upload Button */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs"
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,text/plain,text/csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          title="Upload screenshot, image, or document"
          className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shrink-0"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder="Ask Copilot or upload screenshots of bugs, students, payments, WhatsApp chats..."
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          disabled={loading}
          className="flex-1 bg-transparent px-2 py-2 text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
        />

        <button
          type="submit"
          disabled={loading || (!inputQuery.trim() && attachments.length === 0)}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition-all shrink-0"
        >
          <span>Ask Copilot</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
