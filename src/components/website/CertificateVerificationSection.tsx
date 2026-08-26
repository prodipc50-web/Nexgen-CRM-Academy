import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { ShieldCheck, Search, Award, CheckCircle, AlertCircle, Calendar, User, BookOpen, Printer, ExternalLink } from 'lucide-react';
import { NexgenLogo } from '../common/NexgenLogo';

export const CertificateVerificationSection: React.FC = () => {
  const { certificates, students, courses, batches } = useAcademy();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedCert, setMatchedCert] = useState<any | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    setHasSearched(true);
    const cert = certificates.find(c =>
      c.certificateNumber?.toLowerCase() === query ||
      c.certificateCode?.toLowerCase() === query ||
      c.studentId?.toLowerCase() === query
    );

    if (cert) {
      const student = students.find(s => s.id === cert.studentId);
      const course = courses.find(c => c.id === cert.courseId);
      const batch = batches.find(b => b.id === cert.batchId);
      setMatchedCert({ cert, student, course, batch });
    } else {
      setMatchedCert(null);
    }
  };

  return (
    <section id="verify-certificate" className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-950/80 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Govt. Standard Online Verification Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verify Student Certificate & Credentials
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Enter the Certificate Number or Student ID to verify authenticity directly from our official academic registry.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
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
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center space-x-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Now (যাচাই করুন)</span>
            </button>
          </form>

          {/* Quick Example Clickers */}
          <div className="flex items-center justify-center space-x-2 mt-3 text-[11px] text-slate-400">
            <span>Try sample certificate:</span>
            <button
              type="button"
              onClick={() => {
                const sample = certificates[0]?.certificateNumber || 'NCA-CERT-2026-8941';
                setSearchQuery(sample);
              }}
              className="font-mono text-amber-400 hover:underline font-bold"
            >
              {certificates[0]?.certificateNumber || 'NCA-CERT-2026-8941'}
            </button>
          </div>
        </div>

        {/* Verification Result Card */}
        {hasSearched && matchedCert && (
          <div className="max-w-3xl mx-auto bg-gradient-to-b from-slate-800 to-slate-850 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-slate-700/80 pb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                    <span>✓ Officially Verified Credential</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {matchedCert.student?.name || 'Verified Graduate'}
                  </h3>
                  <p className="text-xs text-slate-300 font-mono">
                    ID: {matchedCert.student?.studentIdCode || matchedCert.cert.studentId} • Cert #{matchedCert.cert.certificateNumber}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <NexgenLogo variant="crest" size={44} />
              </div>
            </div>

            {/* Credential Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6 text-xs">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                <span className="text-slate-400 block mb-1 flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Course Title</span>
                </span>
                <span className="font-bold text-white text-sm">
                  {matchedCert.course?.title || 'Professional IT Course'}
                </span>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                <span className="text-slate-400 block mb-1 flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Performance Grade</span>
                </span>
                <span className="font-black text-emerald-400 text-sm">
                  Grade {matchedCert.cert.grade || 'A+'} (Distinction)
                </span>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                <span className="text-slate-400 block mb-1 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  <span>Issue Date</span>
                </span>
                <span className="font-bold text-white text-sm">
                  {matchedCert.cert.issueDate}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Authenticated by Nexgen Computer Academy Academic Board & Managing Director.
                </span>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded-lg shrink-0">
                Status: Active Valid
              </span>
            </div>
          </div>
        )}

        {hasSearched && !matchedCert && (
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
      </div>
    </section>
  );
};
