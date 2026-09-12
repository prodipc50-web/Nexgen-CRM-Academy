import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { StudentStatus, Student } from '../../types';
import { exportAllStudentsSpreadsheet } from '../../utils/spreadsheetExport';
import { useDebounce } from '../../hooks/useDebounce';
import { getWhatsAppDirectUrl } from '../../utils/whatsappHelper';
import {
  GraduationCap,
  PlusCircle,
  Search,
  Filter,
  CreditCard,
  Eye,
  Phone,
  Calendar,
  BookOpen,
  ArrowRightLeft,
  Trash2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  MessageCircle,
  UserCheck,
  UserX,
  Clock,
  Edit2,
  X,
  Save
} from 'lucide-react';

interface StudentsViewProps {
  onOpenNewAdmission: () => void;
  onSelectStudent: (studentId: string) => void;
  onOpenCollectPayment: (admissionId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  onOpenNewAdmission,
  onSelectStudent,
  onOpenCollectPayment
}) => {
  const { students, admissions, courses, batches, deleteStudent, updateStudent, academySettings } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 250);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Status & Dropout modal state
  const [statusModalStudent, setStatusModalStudent] = useState<Student | null>(null);
  const [newStatus, setNewStatus] = useState<StudentStatus>('Active');
  const [dropReason, setDropReason] = useState<string>('Job timing conflict');
  const [dropDate, setDropDate] = useState<string>('');
  const [refundNotes, setRefundNotes] = useState<string>('');

  const handleOpenStatusModal = (student: Student) => {
    setStatusModalStudent(student);
    setNewStatus(student.status || 'Active');
    setDropReason(student.dropReason || 'Job timing conflict');
    setDropDate(student.dropDate || new Date().toISOString().split('T')[0]);
    setRefundNotes(student.notes || '');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalStudent) return;
    updateStudent(statusModalStudent.id, {
      status: newStatus,
      dropReason: newStatus === 'Dropped' ? dropReason : undefined,
      dropDate: newStatus === 'Dropped' ? dropDate : undefined,
      notes: refundNotes.trim() || statusModalStudent.notes
    });
    setStatusModalStudent(null);
  };

  const activeCount = students.filter(s => s.status === 'Active').length;
  const completedCount = students.filter(s => s.status === 'Completed' || s.status === 'Alumni').length;
  const droppedCount = students.filter(s => s.status === 'Dropped').length;
  const onHoldCount = students.filter(s => s.status === 'On Hold').length;

  const filteredStudents = students.filter(student => {
    const adm = admissions.find(a => a.studentId === student.id);
    const matchesSearch =
      student.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      student.phone.includes(debouncedSearchTerm) ||
      student.studentCode.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || adm?.courseId === courseFilter;
    const matchesBatch = batchFilter === 'all' || adm?.batchId === batchFilter;
    return matchesSearch && matchesStatus && matchesCourse && matchesBatch;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Student Directory & Enrollment Hub
            </h2>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
              {students.length} Total Records
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Search student profiles, view financial balances, track attendance, and manage batch assignments
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => exportAllStudentsSpreadsheet(filteredStudents, admissions, courses, batches, academySettings?.instituteName)}
            className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-2xs transition-colors"
            title={`Export ${filteredStudents.length} Students to Excel Spreadsheet`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel / Spreadsheet ({filteredStudents.length})</span>
          </button>

          <button
            onClick={onOpenNewAdmission}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Student Admission</span>
          </button>
        </div>
      </div>

      {/* Student Retention & Lifecycle KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20 shadow-2xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Total Enrolled</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{students.length}</span>
          <span className="text-[10px] text-slate-400">All registered students</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'Active' ? 'all' : 'Active')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'Active'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-2xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-emerald-700 font-bold block text-[11px] uppercase tracking-wider">Active Students</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-xl font-black text-emerald-950 mt-0.5 block">{activeCount}</span>
          <span className="text-[10px] text-emerald-600 font-medium">Currently attending classes</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'Completed' ? 'all' : 'Completed')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'Completed'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20 shadow-2xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-700 font-bold block text-[11px] uppercase tracking-wider">Completed / Alumni</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-xl font-black text-blue-950 mt-0.5 block">{completedCount}</span>
          <span className="text-[10px] text-blue-600 font-medium">Passed & certified</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'Dropped' ? 'all' : 'Dropped')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'Dropped'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20 shadow-2xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-rose-700 font-bold block text-[11px] uppercase tracking-wider">Dropped Out / Refund</span>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-xl font-black text-rose-600 mt-0.5 block">{droppedCount}</span>
          <span className="text-[10px] text-rose-600 font-medium">Recorded with reason & log</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, phone (+880...), student ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold outline-none"
        >
          <option value="all">All Student Statuses</option>
          <option value="Active">Active (Enrolled)</option>
          <option value="Completed">Completed</option>
          <option value="Alumni">Alumni</option>
          <option value="Dropped">Dropped Out</option>
          <option value="On Hold">On Hold</option>
        </select>

        <select
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium outline-none"
        >
          <option value="all">All Courses</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={batchFilter}
          onChange={e => setBatchFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium outline-none"
        >
          <option value="all">All Batches</option>
          {batches.map(b => (
            <option key={b.id} value={b.id}>
              Batch #{b.batchNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Students Directory Container: Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Mobile View: Responsive Cards (md:hidden) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredStudents.map(student => {
            const adm = admissions.find(a => a.studentId === student.id);
            const crs = courses.find(c => c.id === adm?.courseId);
            const batch = batches.find(b => b.id === adm?.batchId);

            return (
              <div
                key={student.id}
                className="p-3.5 space-y-3 hover:bg-slate-50 transition-colors"
                onClick={() => onSelectStudent(student.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={student.name}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                      <div className="font-mono text-[11px] text-indigo-600 font-semibold">{student.studentCode}</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleOpenStatusModal(student)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 border cursor-pointer hover:shadow-2xs transition-all ${
                        student.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : student.status === 'Completed'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                          : student.status === 'Dropped'
                          ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                      title="Update student lifecycle, drop-out reason, or refund details"
                    >
                      <span>{student.status}</span>
                      <Edit2 className="w-2.5 h-2.5 opacity-60" />
                    </button>
                    {student.status === 'Dropped' && student.dropReason && (
                      <span className="text-[9px] text-rose-600 font-medium mt-0.5 max-w-[120px] truncate text-right">
                        {student.dropReason}
                      </span>
                    )}
                  </div>
                </div>

                {/* Course & Batch info */}
                <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                  <div className="font-semibold text-slate-800 truncate">{crs?.name || 'No Course Assigned'}</div>
                  <div className="text-[11px] text-slate-500">
                    {batch ? `Batch #${batch.batchNumber} (${batch.classDays})` : 'No Batch Assigned'}
                  </div>
                </div>

                {/* Financial status & Phone */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                    <a
                      href={`tel:${student.phone}`}
                      className="inline-flex items-center space-x-1 font-mono text-slate-700 hover:text-indigo-600 font-semibold text-xs"
                    >
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{student.phone}</span>
                    </a>
                    <a
                      href={getWhatsAppDirectUrl(student.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      title="Direct WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="text-right">
                    {adm && adm.due > 0 ? (
                      <span className="inline-block bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-black text-xs">
                        Due: ৳{adm.due.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded">
                        ✓ Paid
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 pt-1" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectStudent(student.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs inline-flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Profile</span>
                  </button>

                  {adm && adm.due > 0 && (
                    <button
                      onClick={() => onOpenCollectPayment(adm.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs inline-flex items-center space-x-1 shadow-xs"
                    >
                      <CreditCard className="w-3 h-3" />
                      <span>Collect</span>
                    </button>
                  )}

                  <button
                    onClick={() => setDeletingStudent(student)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                    title="Delete Student"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredStudents.length === 0 && (
            <div className="py-10 text-center text-slate-400 px-4">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-semibold">No students found matching current filters.</p>
            </div>
          )}
        </div>

        {/* Desktop View: Full Data Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student Profile</th>
                <th className="py-3 px-4">Phone & Contacts</th>
                <th className="py-3 px-4">Enrolled Course & Batch</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Fee Paid</th>
                <th className="py-3 px-4">Due Balance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => {
                const adm = admissions.find(a => a.studentId === student.id);
                const crs = courses.find(c => c.id === adm?.courseId);
                const batch = batches.find(b => b.id === adm?.batchId);

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                    onClick={() => onSelectStudent(student.id)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={student.name}
                          loading="lazy"
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {student.name}
                          </div>
                          <div className="font-mono text-[10px] text-indigo-600 font-bold">
                            {student.studentCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{student.phone}</span>
                        <a
                          href={getWhatsAppDirectUrl(student.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Direct WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="text-[10px] text-slate-400">{student.occupation} • {student.education}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-800">
                      <div className="font-bold">{crs?.name || 'No Course'}</div>
                      <div className="text-[11px] text-slate-500">
                        {batch ? `Batch #${batch.batchNumber} (${batch.classDays})` : 'No Batch Assigned'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col items-start" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleOpenStatusModal(student)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 border cursor-pointer hover:shadow-2xs transition-all ${
                            student.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : student.status === 'Completed'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                              : student.status === 'Dropped'
                              ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Click to update status, record drop-out reason or refund"
                        >
                          <span>{student.status}</span>
                          <Edit2 className="w-2.5 h-2.5 opacity-60" />
                        </button>
                        {student.status === 'Dropped' && student.dropReason && (
                          <span className="text-[10px] text-rose-600 font-medium mt-0.5 max-w-[130px] truncate" title={student.dropReason}>
                            {student.dropReason}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-700">
                      ৳{adm?.totalPaid.toLocaleString() || '0'}
                    </td>

                    <td className="py-3 px-4">
                      {adm && adm.due > 0 ? (
                        <span className="font-black text-rose-600">
                          ৳{adm.due.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-[11px]">
                          ✓ Paid
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectStudent(student.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenStatusModal(student)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded text-[11px] inline-flex items-center space-x-1 border border-amber-200 transition-colors"
                        title="Change status, mark dropped or log refund"
                      >
                        <Edit2 className="w-3 h-3 text-amber-600" />
                        <span>Status</span>
                      </button>

                      {adm && adm.due > 0 && (
                        <button
                          onClick={() => onOpenCollectPayment(adm.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] inline-flex items-center space-x-1 shadow-xs"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Collect</span>
                        </button>
                      )}

                      <button
                        onClick={() => setDeletingStudent(student)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                        title="Delete Student & Move to Recycle Bin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-semibold">No students found matching current filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Lifecycle & Dropout / Refund Modal */}
      {statusModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Update Student Status & Lifecycle</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {statusModalStudent.name} • {statusModalStudent.studentCode}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStatusModalStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-5 space-y-4 overflow-y-auto text-xs">
              {/* Status Select */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Academic Status (শিক্ষার্থীর বর্তমান অবস্থা) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Active', 'Completed', 'On Hold', 'Dropped'] as StudentStatus[]).map(st => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setNewStatus(st)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                        newStatus === st
                          ? st === 'Active'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : st === 'Completed'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : st === 'Dropped'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st === 'Dropped' ? 'Dropped Out' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Dropout Details */}
              {newStatus === 'Dropped' && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-3 animate-in fade-in">
                  <div className="flex items-center space-x-2 text-rose-800 font-bold">
                    <UserX className="w-4 h-4 text-rose-600" />
                    <span>Drop-out & Refund Tracking (ড্রপ-আউট ও রিফান্ড তথ্য)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Effective Drop-out Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={dropDate}
                        onChange={e => setDropDate(e.target.value)}
                        className="w-full p-2 bg-white border border-rose-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Drop-out Reason (কারণ) *
                      </label>
                      <select
                        value={dropReason}
                        onChange={e => setDropReason(e.target.value)}
                        className="w-full p-2 bg-white border border-rose-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                      >
                        <option value="Job timing conflict">Job timing conflict (চাকরির সময় পরিবর্তন)</option>
                        <option value="Financial difficulties">Financial difficulties (আর্থিক সমস্যা)</option>
                        <option value="Relocated / Family reasons">Relocated / Family reasons (স্থানান্তর / পরিবার)</option>
                        <option value="Course pacing / Too difficult">Course pacing / Too difficult (কোর্সের কাঠিন্য)</option>
                        <option value="Batch schedule mismatch">Batch schedule mismatch (শিডিউল না মেলা)</option>
                        <option value="Personal / Health reasons">Personal / Health reasons (স্বাস্থ্য বা ব্যক্তিগত)</option>
                        <option value="Other">Other / অন্যান্য</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Refund Amount or Settlement Note (রিফান্ড টাকা বা লেনদেন নোট)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Refunded ৳1,500 via bKash TrxID #8X92... or Fees adjusted for next batch"
                      value={refundNotes}
                      onChange={e => setRefundNotes(e.target.value)}
                      className="w-full p-2 bg-white border border-rose-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* General Staff Note */}
              {newStatus !== 'Dropped' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Staff Notes / Status Update Remarks
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter any relevant student updates, leave requests, or batch notes..."
                    value={refundNotes}
                    onChange={e => setRefundNotes(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStatusModalStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-xs shadow-xs inline-flex items-center space-x-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Status</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Student Confirmation Modal */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Student</h3>
                <p className="text-[11px] text-slate-500">Move to Recycle Bin</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete student <strong className="text-slate-900">{deletingStudent.name}</strong> ({deletingStudent.studentCode})? All student profile, admissions, and due records will be safely archived to the Recycle Bin.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStudent(deletingStudent.id);
                  setDeletingStudent(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
