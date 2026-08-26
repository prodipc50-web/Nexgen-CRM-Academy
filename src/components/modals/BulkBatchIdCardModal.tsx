import React, { useState, useMemo } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Batch, Student } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  X,
  Printer,
  CreditCard,
  FileCheck,
  CheckCircle2,
  Users,
  BookOpen,
  Filter,
  Layers,
  Sparkles,
  QrCode
} from 'lucide-react';

interface BulkBatchIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkBatchIdCardModal: React.FC<BulkBatchIdCardModalProps> = ({
  isOpen,
  onClose
}) => {
  const { batches, students, admissions, courses, academySettings } = useAcademy();

  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [docType, setDocType] = useState<'id_card' | 'admit_card'>('id_card');
  const [examTitle, setExamTitle] = useState('Final Semester Practical Evaluation 2026');
  const [examDate, setExamDate] = useState('2026-09-15');
  const [examTime, setExamTime] = useState('10:00 AM – 01:00 PM');

  // Filter students belonging to selected batch
  const batchAdmissions = useMemo(() => {
    return admissions.filter(a => a.batchId === selectedBatchId);
  }, [admissions, selectedBatchId]);

  const batchStudents = useMemo(() => {
    const studentIds = batchAdmissions.map(a => a.studentId);
    return students.filter(s => studentIds.includes(s.id));
  }, [batchAdmissions, students]);

  const selectedBatch = batches.find(b => b.id === selectedBatchId);
  const selectedCourse = courses.find(c => c.id === selectedBatch?.courseId);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <span>Batch-wise Bulk PVC ID Card & Admit Card Generator</span>
              </h3>
              <p className="text-xs text-slate-400">
                Generate and print multiple Student ID cards / Admit cards per A4 page in 1-click.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Select Batch</label>
              <select
                value={selectedBatchId}
                onChange={e => setSelectedBatchId(e.target.value)}
                className="p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {batches.map(b => {
                  const course = courses.find(c => c.id === b.courseId);
                  const enrolledCount = admissions.filter(a => a.batchId === b.id).length;
                  return (
                    <option key={b.id} value={b.id}>
                      {b.batchNumber} - {course?.name || 'Course'} ({enrolledCount} Students)
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Card Document Type</label>
              <div className="flex items-center space-x-1 bg-slate-200 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDocType('id_card')}
                  className={`px-3 py-1.5 rounded-lg font-black transition-all ${
                    docType === 'id_card' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700'
                  }`}
                >
                  PVC ID Cards
                </button>
                <button
                  type="button"
                  onClick={() => setDocType('admit_card')}
                  className={`px-3 py-1.5 rounded-lg font-black transition-all ${
                    docType === 'admit_card' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700'
                  }`}
                >
                  Exam Admit Cards
                </button>
              </div>
            </div>

            {docType === 'admit_card' && (
              <>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Exam Title</label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={e => setExamTitle(e.target.value)}
                    className="p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Exam Date & Time</label>
                  <input
                    type="text"
                    value={`${examDate} (${examTime})`}
                    onChange={e => setExamDate(e.target.value)}
                    className="p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Print All {batchStudents.length} Cards (A4 Grid)</span>
          </button>
        </div>

        {/* Printable Cards Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-100">
          {batchStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold text-sm bg-white rounded-3xl border border-slate-200">
              No students enrolled in this batch yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batchStudents.map(student => (
                <div
                  key={student.id}
                  className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 shadow-xl border border-indigo-400/40 relative overflow-hidden flex flex-col justify-between"
                  style={{ minHeight: docType === 'id_card' ? '230px' : '270px' }}
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-400/30">
                    <div className="flex items-center space-x-2">
                      <NexgenLogo variant="crest" size={28} />
                      <div>
                        <h4 className="font-black text-[10px] text-white uppercase tracking-tight">
                          {academySettings.instituteName || 'Nexgen Academy'}
                        </h4>
                        <p className="text-[7px] text-indigo-300 font-bold uppercase">Govt. Recognized</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[8px] rounded-sm uppercase">
                      {docType === 'id_card' ? 'STUDENT ID' : 'ADMIT CARD'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="flex items-center space-x-3 py-3">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-800 border-2 border-indigo-300/50 shadow-md shrink-0">
                      {student.photoUrl ? (
                        <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-800 text-white font-black text-xl">
                          {student.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5 min-w-0 text-[10px]">
                      <h4 className="font-black text-white truncate text-xs">{student.name}</h4>
                      <p className="text-indigo-300 font-mono font-bold">{student.studentCode}</p>
                      <p className="text-slate-300 font-bold truncate">
                        {selectedCourse?.name || 'Professional Course'}
                      </p>
                      <p className="text-slate-400 text-[9px]">
                        Batch: <b className="text-white">{selectedBatch?.batchNumber || 'Batch-01'}</b>
                      </p>
                      {docType === 'id_card' ? (
                        <p className="text-slate-400 text-[8px]">
                          Blood: <b className="text-white">{student.bloodGroup || 'O+'}</b> • {student.phone}
                        </p>
                      ) : (
                        <p className="text-amber-300 font-bold text-[9px]">
                          Room: {selectedBatch?.room || 'Lab Room 402'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer with QR */}
                  <div className="pt-2 border-t border-indigo-400/30 flex items-center justify-between text-[7px] text-slate-300">
                    <div>
                      {docType === 'id_card' ? (
                        <p className="font-bold text-white">Valid Thru: 2026-2027</p>
                      ) : (
                        <p className="font-bold text-amber-300">{examDate}</p>
                      )}
                      <p className="text-indigo-300">{academySettings.campusName || 'Farmgate, Dhaka'}</p>
                    </div>

                    <div className="p-0.5 bg-white rounded-xs flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                          `${academySettings.certificateVerificationBaseUrl || 'https://nexgenacademy.edu.bd/verify/'}?student=${student.studentCode}`
                        )}`}
                        alt="QR Code"
                        className="w-7 h-7 object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
