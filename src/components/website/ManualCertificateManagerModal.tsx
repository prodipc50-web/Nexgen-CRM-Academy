import React, { useState, useRef, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Certificate } from '../../types';
import { compressImageBase64 } from '../../utils/imageCompressor';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  X,
  Upload,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  Search,
  Award,
  ShieldCheck,
  Calendar,
  User,
  BookOpen,
  Trash2,
  Edit3,
  Eye,
  Printer,
  Download,
  Sparkles,
  RefreshCw,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Sliders,
  Move,
  Layers,
  FileCheck
} from 'lucide-react';

interface ManualCertificateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForVerification?: (certificateNumber: string) => void;
  initialEditCertId?: string | null;
}

type AspectRatio = '1.414' | '16:9' | '4:3' | '3:2' | '1:1' | 'free';

const PRESET_CERTIFICATES = [
  {
    name: 'Govt. Standard IT Certificate',
    course: 'Web Development & AI Engineering',
    category: 'Information Technology',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Advanced Graphic Design Diploma',
    course: 'Graphic Design & UI/UX Mastery',
    category: 'Creative Multimedia',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Cyber Security Professional Award',
    course: 'Cyber Security & Ethical Hacking',
    category: 'Network & Security',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80'
  }
];

export const ManualCertificateManagerModal: React.FC<ManualCertificateManagerModalProps> = ({
  isOpen,
  onClose,
  onSelectForVerification,
  initialEditCertId
}) => {
  const {
    certificates,
    students,
    courses,
    batches,
    issueCertificate,
    updateCertificate,
    deleteCertificate
  } = useAcademy();

  const [activeTab, setActiveTab] = useState<'editor' | 'registry'>('editor');
  const [editingCertId, setEditingCertId] = useState<string | null>(initialEditCertId || null);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [courseName, setCourseName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [batchName, setBatchName] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0]);
  const [grade, setGrade] = useState('A+ (Distinction)');
  const [instructorSignatureName, setInstructorSignatureName] = useState('Engr. Md. Shariful Islam (Academic Director)');
  const [status, setStatus] = useState<'Issued' | 'Draft' | 'Revoked'>('Issued');
  const [remarks, setRemarks] = useState('Authenticated by Nexgen Computer Academy Academic Board.');

  // Image Upload, Crop & Resize State
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropRotation, setCropRotation] = useState<number>(0);
  const [cropPan, setCropPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cropAspect, setCropAspect] = useState<AspectRatio>('1.414'); // Standard Certificate Landscape ~A4
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imagePadding, setImagePadding] = useState<number>(0);

  // Registry & Preview State
  const [searchFilter, setSearchFilter] = useState('');
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  // Auto Generate Serial
  const generateSerial = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `NCA-CERT-${year}-${randomNum}`;
  };

  // Reset or Populate Form
  const resetForm = () => {
    setEditingCertId(null);
    setStudentName('');
    setStudentId(`STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    setCertificateNumber(generateSerial());
    setSelectedCourseId(courses[0]?.id || '');
    setCourseName(courses[0]?.name || 'Professional Web Development & AI');
    setBatchName('Batch-2026-A1');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setCompletionDate(new Date().toISOString().split('T')[0]);
    setGrade('A+ (Distinction)');
    setInstructorSignatureName('Engr. Md. Shariful Islam (Academic Director)');
    setStatus('Issued');
    setRemarks('Authenticated by Nexgen Computer Academy Academic Board.');
    setUploadedImageSrc(null);
    setIsCropping(false);
    setCropZoom(1);
    setCropRotation(0);
    setCropPan({ x: 0, y: 0 });
  };

  // Populate when editing
  const loadCertificateForEdit = (cert: Certificate) => {
    setEditingCertId(cert.id);
    const stu = students.find(s => s.id === cert.studentId);
    const crs = courses.find(c => c.id === cert.courseId);
    const btc = batches.find(b => b.id === cert.batchId);

    setStudentName(cert.studentName || stu?.name || '');
    setStudentId(cert.studentId || stu?.studentCode || '');
    setCertificateNumber(cert.certificateNumber || cert.certificateCode);
    setSelectedCourseId(cert.courseId || '');
    setCourseName(cert.courseName || crs?.name || '');
    setBatchName(cert.batchName || btc?.batchNumber || '');
    setIssueDate(cert.issueDate || new Date().toISOString().split('T')[0]);
    setCompletionDate(cert.completionDate || new Date().toISOString().split('T')[0]);
    setGrade(cert.grade || 'A+ (Distinction)');
    setInstructorSignatureName(cert.instructorSignatureName || 'Academic Director');
    setStatus(cert.status || 'Issued');
    setRemarks(cert.remarks || '');
    setUploadedImageSrc(cert.certificateImageUrl || null);
    setIsCropping(false);
    setActiveTab('editor');
  };

  useEffect(() => {
    if (isOpen) {
      if (initialEditCertId) {
        const found = certificates.find(c => c.id === initialEditCertId);
        if (found) {
          loadCertificateForEdit(found);
          return;
        }
      }
      if (!editingCertId) {
        resetForm();
      }
    }
  }, [isOpen, initialEditCertId]);

  // Handle File Input Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setUploadedImageSrc(src);
      setIsCropping(true);
      setCropZoom(1);
      setCropRotation(0);
      setCropPan({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Dropped File
  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setUploadedImageSrc(src);
        setIsCropping(true);
        setCropZoom(1);
        setCropRotation(0);
        setCropPan({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Pre-load image object when uploadedImageSrc changes
  useEffect(() => {
    if (!uploadedImageSrc) {
      loadedImageRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedImageRef.current = img;
      renderCroppedPreview();
    };
    img.src = uploadedImageSrc;
  }, [uploadedImageSrc]);

  // Re-render crop canvas preview
  const renderCroppedPreview = () => {
    const canvas = cropCanvasRef.current;
    const img = loadedImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetWidth = 1414;
    let targetHeight = 1000;

    if (cropAspect === '16:9') {
      targetWidth = 1600;
      targetHeight = 900;
    } else if (cropAspect === '4:3') {
      targetWidth = 1200;
      targetHeight = 900;
    } else if (cropAspect === '3:2') {
      targetWidth = 1500;
      targetHeight = 1000;
    } else if (cropAspect === '1:1') {
      targetWidth = 1000;
      targetHeight = 1000;
    } else if (cropAspect === 'free') {
      targetWidth = img.width;
      targetHeight = img.height;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Fill clean white paper background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.save();
    // Center point
    ctx.translate(targetWidth / 2 + cropPan.x, targetHeight / 2 + cropPan.y);
    // Apply rotation
    ctx.rotate((cropRotation * Math.PI) / 180);
    // Apply zoom
    ctx.scale(cropZoom, cropZoom);

    // Calculate base draw dimensions
    const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
    const drawW = (img.width * scale) - (imagePadding * 2);
    const drawH = (img.height * scale) - (imagePadding * 2);

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  };

  useEffect(() => {
    if (isCropping) {
      renderCroppedPreview();
    }
  }, [cropZoom, cropRotation, cropPan, cropAspect, imagePadding, isCropping]);

  // Apply Crop and Save as High-Res Compressed Data
  const handleApplyCrop = async () => {
    const canvas = cropCanvasRef.current;
    if (!canvas) {
      setIsCropping(false);
      return;
    }

    try {
      const rawDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const compressed = await compressImageBase64(rawDataUrl, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.88,
        format: 'image/jpeg'
      });
      setUploadedImageSrc(compressed);
      setIsCropping(false);
      showToast('সার্টিফিকেট ইমেজ সফলভাবে ক্রপ ও রিসাইজ করা হয়েছে!');
    } catch (e) {
      console.error('Error applying crop:', e);
      setIsCropping(false);
    }
  };

  // Drag and Pan Canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropPan.x, y: e.clientY - cropPan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCropPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  // Submit Save
  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('অনুগ্রহ করে শিক্ষার্থীর নাম লিখুন।');
      return;
    }
    if (!certificateNumber.trim()) {
      alert('অনুগ্রহ করে সার্টিফিকেট নম্বর লিখুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = uploadedImageSrc || undefined;
      if (finalImageUrl && finalImageUrl.startsWith('data:')) {
        // Double check compression to keep local storage lightweight
        finalImageUrl = await compressImageBase64(finalImageUrl, {
          maxWidth: 1440,
          maxHeight: 1024,
          quality: 0.85
        });
      }

      if (editingCertId) {
        // Update existing certificate
        updateCertificate(editingCertId, {
          certificateNumber,
          certificateCode: certificateNumber,
          studentName,
          studentId,
          courseName,
          courseId: selectedCourseId,
          batchName,
          issueDate,
          completionDate,
          grade,
          instructorSignatureName,
          status,
          remarks,
          certificateImageUrl: finalImageUrl,
          isManualUpload: true
        });
        showToast('সার্টিফিকেট সফলভাবে আপডেট করা হয়েছে!');
      } else {
        // Issue new certificate
        issueCertificate({
          certificateNumber,
          studentName,
          studentId,
          courseName,
          courseId: selectedCourseId,
          batchName,
          issueDate,
          completionDate,
          grade,
          instructorSignatureName,
          status,
          remarks,
          certificateImageUrl: finalImageUrl,
          isManualUpload: true
        });
        showToast('নতুন ম্যানুয়াল সার্টিফিকেট সফলভাবে আপলোড ও যোগ করা হয়েছে!');
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setActiveTab('registry');
      }, 500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('সংরক্ষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  // Filter Registry Certificates
  const filteredCertificates = certificates.filter(c => {
    const q = searchFilter.toLowerCase();
    const stu = students.find(s => s.id === c.studentId);
    const name = (c.studentName || stu?.name || '').toLowerCase();
    const certNum = (c.certificateNumber || c.certificateCode || '').toLowerCase();
    const roll = (c.studentId || stu?.studentCode || '').toLowerCase();
    const course = (c.courseName || '').toLowerCase();
    return name.includes(q) || certNum.includes(q) || roll.includes(q) || course.includes(q);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  ম্যানুয়াল সার্টিফিকেট আপলোড, ক্রপ ও এডিটর
                </h3>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-black uppercase">
                  Admin Tool
                </span>
              </div>
              <p className="text-xs text-slate-300">
                সার্টিফিকেট স্ক্যান কপি আপলোড করুন, রিসাইজ ও ক্রপ করুন এবং ভেরিফিকেশন পোর্টালে যুক্ত করুন।
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-850 border-b border-slate-800 text-xs font-bold">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('editor');
                if (!editingCertId) resetForm();
              }}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
                activeTab === 'editor'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>{editingCertId ? 'সার্টিফিকেট এডিট করুন' : '+ নতুন সার্টিফিকেট আপলোড'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('registry')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
                activeTab === 'registry'
                  ? 'bg-indigo-600 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>সকল সার্টিফিকেট রেজিস্ট্রি ({certificates.length})</span>
            </button>
          </div>

          {editingCertId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              + নতুন এন্ট্রি শুরু করুন
            </button>
          )}
        </div>

        {/* Toast Notification */}
        {isSavedToast && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
            <button type="button" onClick={() => setIsSavedToast(false)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'editor' ? (
            <form onSubmit={handleSaveCertificate} className="space-y-6">
              
              {/* Image Upload & Interactive Cropper Section */}
              <div className="bg-slate-850 p-5 rounded-2xl border border-slate-700/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>সার্টিফিকেট ইমেজ স্ক্যান কপি (Upload & Crop)</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      সার্টিফিকেটের ফটো বা স্ক্যান কপি আপলোড করুন। ক্রপ টুলের সাহায্যে সঠিক সাইজ ও ফ্রেমিং সেট করতে পারবেন।
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>ফাইল ব্রাউজ করুন</span>
                    </button>

                    {uploadedImageSrc && !isCropping && (
                      <button
                        type="button"
                        onClick={() => setIsCropping(true)}
                        className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>রিসাইজ ও ক্রপ করুন</span>
                      </button>
                    )}

                    {uploadedImageSrc && (
                      <button
                        type="button"
                        onClick={() => setUploadedImageSrc(null)}
                        className="p-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-xl transition-colors"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Cropping Mode Interface */}
                {isCropping && uploadedImageSrc ? (
                  <div className="bg-slate-900 p-4 rounded-2xl border-2 border-amber-500/50 space-y-4 animate-in fade-in duration-150">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800 pb-3">
                      {/* Aspect ratio presets */}
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400 font-bold mr-1">অনুপাত:</span>
                        {[
                          { id: '1.414', label: 'A4 ল্যান্ডস্কেপ' },
                          { id: '16:9', label: '16:9 HD' },
                          { id: '4:3', label: '4:3 ক্লাসিক' },
                          { id: 'free', label: 'ফ্রি ক্রপ' }
                        ].map(aspect => (
                          <button
                            key={aspect.id}
                            type="button"
                            onClick={() => setCropAspect(aspect.id as AspectRatio)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                              cropAspect === aspect.id
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {aspect.label}
                          </button>
                        ))}
                      </div>

                      {/* Transform Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setCropRotation(r => (r - 90 + 360) % 360)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                          title="Rotate -90°"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCropRotation(r => (r + 90) % 360)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                          title="Rotate +90°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>

                        <div className="h-4 w-px bg-slate-700 mx-1" />

                        <div className="flex items-center space-x-1.5 bg-slate-800 px-2 py-1 rounded-lg">
                          <ZoomOut className="w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.05"
                            value={cropZoom}
                            onChange={e => setCropZoom(parseFloat(e.target.value))}
                            className="w-20 accent-amber-500 cursor-pointer"
                          />
                          <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-[10px] text-amber-400 font-bold ml-1">
                            {Math.round(cropZoom * 100)}%
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setCropZoom(1);
                            setCropRotation(0);
                            setCropPan({ x: 0, y: 0 });
                          }}
                          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-[10px] font-bold"
                          title="রিসেট পজিশন"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Canvas Stage */}
                    <div
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      className="relative w-full max-h-[360px] bg-slate-950 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                    >
                      <canvas
                        ref={cropCanvasRef}
                        className="max-h-[340px] max-w-full object-contain shadow-2xl rounded"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-md text-[10px] text-slate-400 flex items-center space-x-1 pointer-events-none">
                        <Move className="w-3 h-3 text-amber-400" />
                        <span>ড্র্যাগ করে সঠিক পজিশনে আনুন</span>
                      </div>
                    </div>

                    {/* Crop Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCropping(false)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                      >
                        বাতিল
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyCrop}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg flex items-center space-x-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>ক্রপ ও সেভ করুন (Apply Crop)</span>
                      </button>
                    </div>
                  </div>
                ) : uploadedImageSrc ? (
                  /* Uploaded Image Preview Box */
                  <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 p-2 group flex flex-col items-center">
                    <div className="relative max-h-64 w-full flex items-center justify-center overflow-hidden rounded-xl bg-slate-900">
                      <img
                        src={uploadedImageSrc}
                        alt="Uploaded Certificate Scanned Copy"
                        className="max-h-60 object-contain rounded-lg shadow-lg"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setLightboxImageUrl(uploadedImageSrc)}
                          className="p-2.5 bg-slate-900/90 text-white rounded-xl hover:bg-indigo-600 transition-colors shadow-lg"
                          title="ফুল ভিউ"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCropping(true)}
                          className="p-2.5 bg-slate-900/90 text-white rounded-xl hover:bg-amber-600 transition-colors shadow-lg"
                          title="রি-ক্রপ করুন"
                        >
                          <Crop className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                      <span className="text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>সার্টিফিকেট ইমেজ রেডি</span>
                      </span>
                      <span className="font-mono">High Quality Scaled</span>
                    </div>
                  </div>
                ) : (
                  /* Drag & Drop Upload Zone */
                  <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDropFile}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-amber-500/70 bg-slate-900/50 hover:bg-slate-900 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
                  >
                    <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-2xl mx-auto flex items-center justify-center">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        সার্টিফিকেট ছবি বা স্ক্যান কপি এখানে ড্রপ করুন অথবা <span className="text-amber-400 underline">ব্রাউজ করুন</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PNG, JPG, JPEG বা WebP সাপোর্ট করে (A4 Landscape অনুপাত রিকমেন্ডেড)
                      </p>
                    </div>

                    {/* Presets Gallery */}
                    <div className="pt-2">
                      <p className="text-[11px] text-slate-400 mb-2 font-medium">অথবা ডেমো টেমপ্লেট থেকে সিলেক্ট করুন:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {PRESET_CERTIFICATES.map(preset => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedImageSrc(preset.url);
                              setCourseName(preset.course);
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-500 text-[11px] rounded-lg text-slate-300 font-medium transition-colors"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Certificate Information Fields */}
              <div className="bg-slate-850 p-5 rounded-2xl border border-slate-700/80 space-y-4">
                <h4 className="text-sm font-black text-white flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>সার্টিফিকেট ও শিক্ষার্থীর তথ্য (Certificate Registry Data)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {/* Student Name */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      শিক্ষার্থীর নাম <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={e => setStudentName(e.target.value)}
                        placeholder="e.g. মোঃ তানভীর আহমেদ"
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Student ID */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      স্টুডেন্ট রোল / আইডি <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                      placeholder="e.g. STU-2026-089"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500 font-mono font-medium"
                    />
                  </div>

                  {/* Certificate Serial Number */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold">
                        সার্টিফিকেট নম্বর <span className="text-rose-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setCertificateNumber(generateSerial())}
                        className="text-[10px] text-amber-400 hover:underline flex items-center space-x-0.5"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>জেনারেট</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={certificateNumber}
                      onChange={e => setCertificateNumber(e.target.value)}
                      placeholder="e.g. NCA-CERT-2026-8941"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-mono font-bold outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Course Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      কোর্সের নাম (Course Title) <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={courseName}
                        onChange={e => setCourseName(e.target.value)}
                        placeholder="e.g. Professional Full-Stack Web Development with AI"
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500 font-medium"
                      />
                      <select
                        onChange={e => {
                          const crs = courses.find(c => c.id === e.target.value);
                          if (crs) {
                            setSelectedCourseId(crs.id);
                            setCourseName(crs.name);
                          }
                        }}
                        className="bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-2.5 text-xs outline-none cursor-pointer max-w-[140px]"
                      >
                        <option value="">কোর্স লিস্ট ▾</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Batch Number */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      ব্যাচ নম্বর / সেশন
                    </label>
                    <input
                      type="text"
                      value={batchName}
                      onChange={e => setBatchName(e.target.value)}
                      placeholder="e.g. Batch-2026-B1"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  {/* Performance / Grade */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      গ্রেড / ফলাফল (Grade)
                    </label>
                    <select
                      value={grade}
                      onChange={e => setGrade(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500 font-medium cursor-pointer"
                    >
                      <option value="A+ (Distinction)">A+ (Distinction)</option>
                      <option value="A+">A+</option>
                      <option value="A (Excellent)">A (Excellent)</option>
                      <option value="A-">A-</option>
                      <option value="B+ (Very Good)">B+ (Very Good)</option>
                      <option value="Passed">Passed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Issue Date */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      ইস্যুর তারিখ (Issue Date)
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={e => setIssueDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Completion Date */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      কোর্স সমাপ্তির তারিখ
                    </label>
                    <input
                      type="date"
                      value={completionDate}
                      onChange={e => setCompletionDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Signatory / Authority */}
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      অনুমোদনকারী স্বাক্ষরকারী (Signatory Name & Title)
                    </label>
                    <input
                      type="text"
                      value={instructorSignatureName}
                      onChange={e => setInstructorSignatureName(e.target.value)}
                      placeholder="e.g. Engr. Md. Shariful Islam (Academic Director)"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      ভেরিফিকেশন স্ট্যাটাস
                    </label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500 font-medium cursor-pointer"
                    >
                      <option value="Issued">Issued (সক্রিয় ও ভেরিফাইড)</option>
                      <option value="Draft">Draft (খসড়া)</option>
                      <option value="Revoked">Revoked (বাতিলকৃত)</option>
                    </select>
                  </div>

                  {/* Special Remarks */}
                  <div className="sm:col-span-3">
                    <label className="block text-slate-300 font-bold mb-1">
                      বিশেষ নোট / মন্তব্য (Special Remarks)
                    </label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                      placeholder="e.g. Authenticated by Nexgen Computer Academy Academic Board & Managing Director."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  ফরম রিসেট
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    বন্ধ করুন
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : editingCertId ? 'পরিবর্তন সংরক্ষণ করুন' : 'সার্টিফিকেট পাবলিশ করুন'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Registry & Management Tab */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-850 p-4 rounded-2xl border border-slate-800">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={e => setSearchFilter(e.target.value)}
                    placeholder="নাম, রোল, বা সার্টিফিকেট নং দিয়ে খুঁজুন..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('editor');
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow transition-colors flex items-center space-x-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>+ নতুন সার্টিফিকেট যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Table / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCertificates.map(cert => {
                  const stu = students.find(s => s.id === cert.studentId);
                  const crs = courses.find(c => c.id === cert.courseId);
                  const dispName = cert.studentName || stu?.name || 'Verified Student';
                  const dispRoll = cert.studentId || stu?.studentCode || 'N/A';
                  const dispCourse = cert.courseName || crs?.name || 'Professional Course';
                  const dispNum = cert.certificateNumber || cert.certificateCode;

                  return (
                    <div
                      key={cert.id}
                      className="bg-slate-850 border border-slate-750 hover:border-indigo-500/50 rounded-2xl p-4 transition-all shadow-md flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          {cert.certificateImageUrl ? (
                            <div
                              onClick={() => setLightboxImageUrl(cert.certificateImageUrl!)}
                              className="w-16 h-12 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0 cursor-pointer group relative"
                            >
                              <img
                                src={cert.certificateImageUrl}
                                alt={dispName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                              <Award className="w-6 h-6" />
                            </div>
                          )}

                          <div>
                            <h5 className="text-sm font-black text-white">{dispName}</h5>
                            <p className="text-[11px] text-slate-400">
                              ID: <span className="font-mono text-slate-300 font-bold">{dispRoll}</span>
                            </p>
                            <p className="text-xs text-amber-300 font-bold mt-0.5 line-clamp-1">
                              {dispCourse}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                            cert.status === 'Issued'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {cert.status || 'Issued'}
                        </span>
                      </div>

                      <div className="bg-slate-900/80 p-2 rounded-xl text-[11px] flex items-center justify-between text-slate-300 font-mono">
                        <span>Cert #{dispNum}</span>
                        <span className="text-amber-400 font-bold">{cert.grade}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                        <div className="flex items-center space-x-1.5">
                          {cert.certificateImageUrl && (
                            <button
                              type="button"
                              onClick={() => setLightboxImageUrl(cert.certificateImageUrl!)}
                              className="p-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                              title="সার্টিফিকেট দেখুন"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(dispNum);
                              showToast(`সার্টিফিকেট নং কপি হয়েছে: ${dispNum}`);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                            title="সার্টিফিকেট নম্বর কপি করুন"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {onSelectForVerification && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectForVerification(dispNum);
                                onClose();
                              }}
                              className="px-2 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-700/40 rounded-lg text-[11px] font-bold"
                              title="ওয়েবসাইটে ভেরিফাই রেজাল্ট ওপেন করুন"
                            >
                              Verify View
                            </button>
                          )}
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => loadCertificateForEdit(cert)}
                            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>এডিট / ক্রপ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`আপনি কি সত্যিই ${dispName}-এর সার্টিফিকেট মুছে ফেলতে চান?`)) {
                                deleteCertificate(cert.id);
                                showToast('সার্টিফিকেট মুছে ফেলা হয়েছে।');
                              }
                            }}
                            className="p-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-lg transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredCertificates.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 space-y-2">
                    <Award className="w-10 h-10 mx-auto text-slate-600" />
                    <p className="text-sm font-bold text-slate-300">কোনো সার্টিফিকেট পাওয়া যায়নি</p>
                    <p className="text-xs">নতুন সার্টিফিকেট আপলোড করতে উপরের বাটনে ক্লিক করুন।</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / High-Res Image Viewer */}
      {lightboxImageUrl && (
        <div
          onClick={() => setLightboxImageUrl(null)}
          className="fixed inset-0 z-60 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl p-3 shadow-2xl flex flex-col items-center"
          >
            <button
              type="button"
              onClick={() => setLightboxImageUrl(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={lightboxImageUrl}
              alt="High Definition Certificate"
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-xl"
            />

            <div className="w-full flex items-center justify-between pt-3 px-3">
              <span className="text-xs text-slate-400 font-bold flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Nexgen Verified Certificate Registry Image</span>
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
                  onClick={() => {
                    const printWin = window.open('');
                    if (printWin) {
                      printWin.document.write(`
                        <html>
                          <head><title>Certificate Print</title></head>
                          <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#fff;">
                            <img src="${lightboxImageUrl}" style="max-width:100%;max-height:100%;object-fit:contain;" />
                          </body>
                        </html>
                      `);
                      printWin.document.close();
                      printWin.focus();
                      setTimeout(() => printWin.print(), 250);
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
