import React, { useState, useEffect, useCallback } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  ShieldCheck,
  Search,
  Award,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  BookOpen,
  Printer,
  ExternalLink,
  Upload,
  Crop,
  Edit3,
  Eye,
  Download,
  Copy,
  Maximize2,
  Sparkles,
  Layers,
  Check,
  X
} from 'lucide-react';
import { NexgenLogo } from '../common/NexgenLogo';
import { ManualCertificateManagerModal } from './ManualCertificateManagerModal';

interface CertificateVerificationSectionProps {
  onOpenStaffLogin?: () => void;
}

export const CertificateVerificationSection: React.FC<CertificateVerificationSectionProps> = ({
  onOpenStaffLogin
}) => {
  const {
    certificates,
    publicCertificates,
    students,
    courses,
    batches,
    isAuthenticated,
    currentUser
  } = useAcademy();

  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [matchedCert, setMatchedCert] = useState<any | null>(null);

  // Modal & Lightbox State
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [editCertId, setEditCertId] = useState<string | null>(null);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const isAdmin = Boolean(
    isAuthenticated ||
    currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'MANAGER'
  );

  const performVerification = useCallback(async (rawQuery: string) => {
    const query = rawQuery.trim().toLowerCase();
    if (!query) return;

    setHasSearched(true);
    setIsVerifying(true);

    // 1. Check local private certificates first (if in admin session)
    const localCert = certificates.find(c =>
      c.certificateNumber?.toLowerCase() === query ||
      c.certificateCode?.toLowerCase() === query ||
      c.studentId?.toLowerCase() === query
    );

    if (localCert) {
      const student = students.find(s => s.id === localCert.studentId);
      const course = courses.find(c => c.id === localCert.courseId);
      const batch = batches.find(b => b.id === localCert.batchId);
      setMatchedCert({
        id: localCert.id,
        studentName: localCert.studentName || student?.name || 'Verified Student',
        studentId: student?.studentCode || student?.id || localCert.studentId,
        certificateNumber: localCert.certificateNumber || localCert.certificateCode,
        courseName: localCert.courseName || course?.name || 'Professional IT Course',
        batchName: localCert.batchName || batch?.batchNumber,
        grade: localCert.grade || 'A+',
        issueDate: localCert.issueDate,
        completionDate: localCert.completionDate,
        status: localCert.status || 'Issued',
        instructorSignatureName: localCert.instructorSignatureName,
        certificateImageUrl: localCert.certificateImageUrl,
        isManualUpload: localCert.isManualUpload,
        remarks: localCert.remarks,
        rawCert: localCert
      });
      setIsVerifying(false);
      return;
    }

    // 2. Check publicCertificates from catalog
    const pubCert = (publicCertificates || []).find((c: any) =>
      c.certificateNumber?.toLowerCase() === query ||
      c.certificateCode?.toLowerCase() === query ||
      c.studentId?.toLowerCase() === query
    );

    if (pubCert) {
      setMatchedCert({
        id: pubCert.id,
        studentName: pubCert.studentName,
        studentId: pubCert.studentId,
        certificateNumber: pubCert.certificateNumber || pubCert.certificateCode,
        courseName: pubCert.courseName,
        batchName: pubCert.batchName,
        grade: pubCert.grade || 'A+',
        issueDate: pubCert.issueDate,
        completionDate: pubCert.completionDate,
        status: pubCert.status || 'Issued',
        instructorSignatureName: pubCert.instructorSignatureName,
        certificateImageUrl: pubCert.certificateImageUrl,
        isManualUpload: pubCert.isManualUpload,
        remarks: pubCert.remarks
      });
      setIsVerifying(false);
      return;
    }

    // 3. Fallback: Query server verification endpoint directly
    try {
      const res = await fetch(`/api/certificates/verify?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.verified && json.data) {
          setMatchedCert(json.data);
          setIsVerifying(false);
          return;
        }
      }
    } catch (e) {
      // quiet fallback
    }

    setMatchedCert(null);
    setIsVerifying(false);
  }, [certificates, publicCertificates, students, courses, batches]);

  // Auto-verify if URL contains cert, verify, or q query parameter
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      let certParam = params.get('cert') || params.get('verify') || params.get('certificate') || params.get('q');
      
      // Also check hash like #verify-certificate?cert=NCA-123
      if (!certParam && window.location.hash.includes('cert=')) {
        const hashQuery = window.location.hash.split('?')[1];
        if (hashQuery) {
          const hashParams = new URLSearchParams(hashQuery);
          certParam = hashParams.get('cert') || hashParams.get('verify');
        }
      }

      if (certParam) {
        setSearchQuery(certParam);
        performVerification(certParam);
        const sectionElem = document.getElementById('verify-certificate');
        if (sectionElem) {
          sectionElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (e) {
      // ignore
    }
  }, [performVerification]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(searchQuery);
  };

  const handleCopyVerifyUrl = (certNum: string) => {
    const fullUrl = `${window.location.origin}${window.location.pathname}?cert=${encodeURIComponent(certNum)}#verify-certificate`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Printable action
  const handlePrintCertificate = (imageUrl?: string) => {
    if (imageUrl) {
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Student Certificate - Nexgen Academy</title>
              <style>
                @page { size: landscape; margin: 0; }
                body { margin: 0; padding: 20px; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fff; box-sizing: border-box; }
                img { max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border-radius: 8px; }
              </style>
            </head>
            <body>
              <img src="${imageUrl}" />
            </body>
          </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => printWin.print(), 350);
      }
    } else {
      window.print();
    }
  };

  return (
    <section id="verify-certificate" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Top Header & Admin Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-indigo-950/80 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Govt. Standard Online Verification Portal & Academic Registry</span>
          </div>

          {/* Admin Manual Certificate Upload & Editor Trigger */}
          {isAdmin ? (
            <button
              type="button"
              onClick={() => {
                setEditCertId(null);
                setIsManagerModalOpen(true);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>ম্যানুয়াল সার্টিফিকেট আপলোড / ক্রপ ও এডিটর</span>
            </button>
          ) : (
            onOpenStaffLogin && (
              <button
                type="button"
                onClick={onOpenStaffLogin}
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-amber-300 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                title="Staff login to upload and edit certificates"
              >
                <span>অ্যাডমিন অপশন: সার্টিফিকেট আপলোড</span>
              </button>
            )
          )}
        </div>

        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verify Student Certificate & Credentials
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Enter the Certificate Number or Student ID to verify authenticity directly from our official academic registry.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 bg-slate-800/90 p-2 rounded-2xl border border-slate-700 shadow-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. NCA-CERT-2026-8941 or STU-2026-001"
                className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-slate-400 text-sm font-medium outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isVerifying ? 'যাচাই হচ্ছে...' : 'Verify Now (যাচাই করুন)'}</span>
            </button>
          </form>

          {/* Quick Example Clickers */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-slate-400">
            <span>Try sample certificate:</span>
            {certificates.slice(0, 3).map((cert, idx) => {
              const num = cert.certificateNumber || cert.certificateCode;
              return (
                <button
                  key={cert.id || idx}
                  type="button"
                  onClick={() => {
                    setSearchQuery(num);
                    performVerification(num);
                  }}
                  className="font-mono text-amber-400 hover:underline font-bold bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700 hover:border-amber-400 transition-colors"
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Verification Result Card */}
        {hasSearched && matchedCert && (
          <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-800 to-slate-850 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300 relative space-y-6">
            
            {/* Top Bar with Status and Logos */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-slate-700/80 pb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                    <span>✓ Officially Verified Academic Credential</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {matchedCert.studentName || 'Verified Graduate'}
                  </h3>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    ID: <span className="text-white font-bold">{matchedCert.studentId}</span> • Cert #{' '}
                    <span className="text-amber-400 font-bold">{matchedCert.certificateNumber}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditCertId(matchedCert.id);
                      setIsManagerModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
                    title="Edit certificate details or re-crop image"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>এডিট ও ক্রপ</span>
                  </button>
                )}
                <NexgenLogo variant="crest" size={48} />
              </div>
            </div>

            {/* SCANNED / UPLOADED CERTIFICATE IMAGE PREVIEW (If Available) */}
            {matchedCert.certificateImageUrl ? (
              <div className="space-y-3 bg-slate-900 p-4 rounded-2xl border border-slate-700/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>অফিসিয়াল সার্টিফিকেট স্ক্যান কপি (Original Verified Document)</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setLightboxImageUrl(matchedCert.certificateImageUrl)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>ফুল ভিউ (Zoom)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrintCertificate(matchedCert.certificateImageUrl)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>প্রিন্ট</span>
                    </button>
                  </div>
                </div>

                {/* Framed Image Display */}
                <div
                  onClick={() => setLightboxImageUrl(matchedCert.certificateImageUrl)}
                  className="relative group rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-950 max-h-[380px] flex items-center justify-center cursor-pointer shadow-inner"
                >
                  <img
                    src={matchedCert.certificateImageUrl}
                    alt={`${matchedCert.studentName} Certificate`}
                    className="max-h-[360px] w-auto object-contain rounded shadow-2xl group-hover:scale-[1.01] transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 pointer-events-none">
                    <span className="px-3 py-1.5 bg-slate-900/90 text-white rounded-xl text-xs font-bold shadow-lg flex items-center space-x-1.5">
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>ক্লিক করে বড় করে দেখুন</span>
                    </span>
                  </div>
                </div>
              </div>
            ) : isAdmin ? (
              /* Admin quick upload prompt if no image is attached */
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-dashed border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Upload className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>এই সার্টিফিকেটের কোনো স্ক্যান কপি আপলোড করা নেই। আপনি স্ক্যান কপি আপলোড ও ক্রপ করে যুক্ত করতে পারেন।</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditCertId(matchedCert.id);
                    setIsManagerModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shrink-0 transition-colors"
                >
                  + স্ক্যান কপি আপলোড করুন
                </button>
              </div>
            ) : null}

            {/* Credential Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700/60">
                <span className="text-slate-400 block mb-1 flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Course Title</span>
                </span>
                <span className="font-bold text-white text-sm">
                  {matchedCert.courseName || 'Professional IT Course'}
                </span>
                {matchedCert.batchName && (
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    Batch: {matchedCert.batchName}
                  </span>
                )}
              </div>

              <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700/60">
                <span className="text-slate-400 block mb-1 flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Performance Grade</span>
                </span>
                <span className="font-black text-emerald-400 text-sm">
                  {matchedCert.grade || 'A+ (Distinction)'}
                </span>
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  Academic Performance
                </span>
              </div>

              <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700/60">
                <span className="text-slate-400 block mb-1 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  <span>Issue Date</span>
                </span>
                <span className="font-bold text-white text-sm">
                  {matchedCert.issueDate}
                </span>
                {matchedCert.completionDate && (
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    Completed: {matchedCert.completionDate}
                  </span>
                )}
              </div>
            </div>

            {/* Verification Footer & Sharing */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {matchedCert.remarks || 'Authenticated by Nexgen Computer Academy Academic Board & Managing Director.'}
                </span>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyVerifyUrl(matchedCert.certificateNumber)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl font-medium flex items-center space-x-1.5 transition-colors"
                  title="Copy verification link"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'লিংক কপি হয়েছে' : 'লিংক কপি'}</span>
                </button>

                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded-lg border border-emerald-500/30">
                  Status: {matchedCert.status || 'Active Valid'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Not Found State */}
        {hasSearched && !matchedCert && !isVerifying && (
          <div className="max-w-xl mx-auto bg-slate-800/90 rounded-3xl p-6 border border-rose-500/40 text-center space-y-3 shadow-xl animate-in fade-in">
            <div className="p-3 bg-rose-500/20 text-rose-400 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">No Matching Certificate Found</h4>
            <p className="text-xs text-slate-300">
              We could not find any active certificate matching "<span className="text-rose-400 font-mono">{searchQuery}</span>". Please check the spelling or contact our helpline at 01798444444.
            </p>
          </div>
        )}

        {/* Recently Verified & Sample Registry Showcase */}
        {certificates.length > 0 && (
          <div className="mt-14 pt-8 border-t border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-sm sm:text-base font-black text-white flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>রেজিস্টার্ড ও ভেরিফাইড সার্টিফিকেট গ্যালারি (Verified Registry Showcase)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  আমাদের একাডেমির সফল শিক্ষার্থীদের ইস্যুকৃত সার্টিফিকেটসমূহ অনলাইনে যেকোনো সময় যাচাইযোগ্য।
                </p>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setEditCertId(null);
                    setIsManagerModalOpen(true);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1"
                >
                  <span>সবগুলো পরিচালনা করুন</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.slice(0, 6).map(cert => {
                const stu = students.find(s => s.id === cert.studentId);
                const crs = courses.find(c => c.id === cert.courseId);
                const name = cert.studentName || stu?.name || 'Verified Student';
                const certNum = cert.certificateNumber || cert.certificateCode;
                const courseTitle = cert.courseName || crs?.name || 'Professional IT Course';

                return (
                  <div
                    key={cert.id}
                    className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 rounded-2xl p-4 transition-all shadow-md group flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start space-x-3">
                      {cert.certificateImageUrl ? (
                        <div
                          onClick={() => setLightboxImageUrl(cert.certificateImageUrl!)}
                          className="w-16 h-12 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0 cursor-pointer relative"
                        >
                          <img
                            src={cert.certificateImageUrl}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs sm:text-sm font-bold text-white truncate">{name}</h5>
                        <p className="text-[11px] text-amber-300 truncate font-medium">{courseTitle}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          #{certNum}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                      <span className="text-[11px] text-emerald-400 font-bold">
                        {cert.grade || 'A+ (Distinction)'}
                      </span>

                      <div className="flex items-center space-x-2">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditCertId(cert.id);
                              setIsManagerModalOpen(true);
                            }}
                            className="text-[11px] text-slate-400 hover:text-amber-300 font-medium"
                            title="Edit"
                          >
                            এডিট
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery(certNum);
                            performVerification(certNum);
                            const sectionElem = document.getElementById('verify-certificate');
                            if (sectionElem) {
                              sectionElem.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-700/40 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          Verify Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Manual Certificate Upload, Crop & Resize Modal */}
      <ManualCertificateManagerModal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        initialEditCertId={editCertId}
        onSelectForVerification={(num) => {
          setSearchQuery(num);
          performVerification(num);
        }}
      />

      {/* Fullscreen Lightbox Image Viewer */}
      {lightboxImageUrl && (
        <div
          onClick={() => setLightboxImageUrl(null)}
          className="fixed inset-0 z-60 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl p-4 shadow-2xl flex flex-col items-center"
          >
            <button
              type="button"
              onClick={() => setLightboxImageUrl(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={lightboxImageUrl}
              alt="High Definition Certificate"
              className="max-h-[78vh] w-auto object-contain rounded-2xl shadow-xl"
            />

            <div className="w-full flex items-center justify-between pt-3 px-2">
              <span className="text-xs text-slate-300 font-bold flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Nexgen Computer Academy Verified Academic Certificate</span>
              </span>
              <div className="flex items-center space-x-2">
                <a
                  href={lightboxImageUrl}
                  download="nexgen-certificate.jpg"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ডাউনলোড</span>
                </a>
                <button
                  type="button"
                  onClick={() => handlePrintCertificate(lightboxImageUrl)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
