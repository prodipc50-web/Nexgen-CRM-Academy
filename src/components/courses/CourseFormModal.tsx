import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Course, CourseModule, CourseStatus, DurationUnit } from '../../types';
import { DEFAULT_LEARNING_FEATURES, DEFAULT_TARGET_AUDIENCES } from '../../data/seedData';
import { generateSlug } from '../../utils/seoHelper';
import { compressLogoOrAvatar } from '../../utils/imageCompressor';
import {
  X,
  BookOpen,
  Layers,
  Clock,
  DollarSign,
  Users,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Tag,
  Info,
  Upload,
  FileText,
  Eye,
  RefreshCw,
  Download,
  Star,
  Globe,
  Smartphone,
  Monitor,
  Search,
  ExternalLink
} from 'lucide-react';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: Course | null;
  onOpenCategoryManager?: () => void;
}

type TabType = 'basic' | 'duration_fee' | 'curriculum' | 'trainers_audience' | 'prerequisites' | 'seo';

const PRESET_THUMBNAILS = [
  { label: 'Computer Office', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80' },
  { label: 'Graphic Design', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80' },
  { label: 'Video Editing', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80' },
  { label: 'Digital Marketing', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80' },
  { label: 'UI/UX Design', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Web Development', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80' },
  { label: 'AI & Automation', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80' }
];

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  initialCourse,
  onOpenCategoryManager
}) => {
  const { categories, courses, staffList, addCourse, updateCourse, syncToCloudNow, addStaff, deleteStaff } = useAcademy();
  const isEditing = !!initialCourse;

  const [activeTab, setActiveTab] = useState<TabType>('basic');

  // Manual Custom Trainer Creation State
  const [newTrainerName, setNewTrainerName] = useState('');
  const [newTrainerDesignation, setNewTrainerDesignation] = useState('Senior Faculty & Industry Specialist');
  const [showAddTrainerBox, setShowAddTrainerBox] = useState(false);

  // Basic Information
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Computer & Office');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [status, setStatus] = useState<CourseStatus>('Active');

  // Website Performance Metrics & Badges
  const [badgeText, setBadgeText] = useState('');
  const [rating, setRating] = useState<number>(4.9);
  const [reviewsCount, setReviewsCount] = useState<number>(431);
  const [projectsCount, setProjectsCount] = useState<number>(10);
  const [studentsJoined, setStudentsJoined] = useState<number>(450);

  // Duration & Schedule
  const [durationValue, setDurationValue] = useState<number>(3);
  const [durationUnit, setDurationUnit] = useState<DurationUnit>('Months');
  const [totalClasses, setTotalClasses] = useState<number>(36);
  const [classDuration, setClassDuration] = useState('2 Hours');
  const [totalHours, setTotalHours] = useState<number>(72);

  // Fees
  const [regularFee, setRegularFee] = useState<number>(15000);
  const [offerFee, setOfferFee] = useState<number>(12000);
  const [scholarshipAvailable, setScholarshipAvailable] = useState<boolean>(true);
  const [maxScholarship, setMaxScholarship] = useState<number>(3000);
  const [minInstallmentAmount, setMinInstallmentAmount] = useState<number>(4000);

  // Curriculum & Modules
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [curriculumHighlights, setCurriculumHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState('');

  // Module Builder Helper State
  const [newTopicInput, setNewTopicInput] = useState<{ [moduleId: string]: string }>({});
  const [newOutcomeInput, setNewOutcomeInput] = useState<{ [moduleId: string]: string }>({});

  // Trainers & Target Audience
  const [trainerIds, setTrainerIds] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [customAudienceInput, setCustomAudienceInput] = useState('');

  // Prerequisites & Features
  const [requiredSkillLevel, setRequiredSkillLevel] = useState('No Prior Knowledge');
  const [minimumEducation, setMinimumEducation] = useState('SSC / Equivalent');
  const [recommendedAge, setRecommendedAge] = useState('16+ Years');
  const [requiredSoftwareHardware, setRequiredSoftwareHardware] = useState('');
  const [previousCourse, setPreviousCourse] = useState('');
  const [learningFeatures, setLearningFeatures] = useState<string[]>(['Live Class', 'Offline Class', 'Certificate']);

  // Manual Curriculum Upload File State (PDF, JPG, PNG, WEBP)
  const [curriculumFileUrl, setCurriculumFileUrl] = useState('');
  const [curriculumFileName, setCurriculumFileName] = useState('');
  const [curriculumFileType, setCurriculumFileType] = useState<'pdf' | 'image' | 'doc' | string>('pdf');
  const [curriculumFileSize, setCurriculumFileSize] = useState('');
  const [curriculumUploadedAt, setCurriculumUploadedAt] = useState('');
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);

  // Course SEO & Google Search Meta State
  const [seoSlug, setSeoSlug] = useState('');
  const [seoFocusKeyword, setSeoFocusKeyword] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoMetaDescription, setSeoMetaDescription] = useState('');
  const [secondaryKeywordsInput, setSecondaryKeywordsInput] = useState('');
  const [seoNoIndex, setSeoNoIndex] = useState(false);
  const [serpPreviewMode, setSerpPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleAutoGenerateSeo = () => {
    const cleanSlug = generateSlug(name || 'new-course');
    setSeoSlug(cleanSlug);
    setSeoFocusKeyword(`${name || "IT"} Course in Dhaka`);
    setSeoTitle(`${name || "Professional IT"} Course in Farmgate & Online BD | Nexgen Academy`);
    setSeoMetaDescription(
      description
        ? `${name}: ${description.slice(0, 110)}... 100% practical lab, live online & verifiable certificate.`
        : `Learn ${name || "practical IT skills"} with hands-on lab training at Farmgate, Dhaka & Live Online across Bangladesh. Verifiable certificate & job placement.`
    );
    const defaults = [
      `${name} course Farmgate`,
      `${name} course fee in Dhaka`,
      `online ${name} course Bangladesh`,
      `best ${category} training center`
    ];
    setSecondaryKeywordsInput(defaults.join(', '));
    setSeoNoIndex(false);
  };

  const handleCurriculumFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploadError(null);
    if (file.size > 25 * 1024 * 1024) {
      setFileUploadError('ফাইলের সাইজ সর্বোচ্চ ২৫ মেগাবাইটের (25MB) মধ্যে হতে হবে।');
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name);
    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const uploadedTime = new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCurriculumFileUrl(dataUrl);
      setCurriculumFileName(file.name);
      setCurriculumFileType(isPdf ? 'pdf' : isImage ? 'image' : 'doc');
      setCurriculumFileSize(sizeFormatted);
      setCurriculumUploadedAt(uploadedTime);
    };
    reader.onerror = () => {
      setFileUploadError('ফাইল পড়তে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    };
    reader.readAsDataURL(file);
  };

  // Reset or initialize form values
  useEffect(() => {
    if (initialCourse) {
      setCode(initialCourse.code);
      setName(initialCourse.name);
      setShortName(initialCourse.shortName || '');
      setCategory(initialCourse.category || categories[0] || 'Computer & Office');
      setDescription(initialCourse.description || '');
      setThumbnailUrl(initialCourse.thumbnailUrl || '');
      setStatus(initialCourse.status || 'Active');
      setBadgeText(initialCourse.badgeText || '');
      setRating(initialCourse.rating ?? 4.9);
      setReviewsCount(initialCourse.reviewsCount ?? 431);
      setProjectsCount(initialCourse.projectsCount ?? 10);
      setStudentsJoined(initialCourse.studentsJoined ?? 450);
      setDurationValue(initialCourse.durationValue || 3);
      setDurationUnit(initialCourse.durationUnit || 'Months');
      setTotalClasses(initialCourse.totalClasses || 36);
      setClassDuration(initialCourse.classDuration || '2 Hours');
      setTotalHours(initialCourse.totalHours || (initialCourse.totalClasses ? initialCourse.totalClasses * 2 : 72));
      setRegularFee(initialCourse.regularFee || 0);
      setOfferFee(initialCourse.offerFee || 0);
      setScholarshipAvailable(initialCourse.scholarshipAvailable ?? false);
      setMaxScholarship(initialCourse.maxScholarship || 0);
      setMinInstallmentAmount(initialCourse.minInstallmentAmount || 3000);
      setModules(initialCourse.modules ? JSON.parse(JSON.stringify(initialCourse.modules)) : []);
      setCurriculumHighlights(initialCourse.curriculumHighlights || initialCourse.syllabusHighlights || []);
      setTrainerIds(initialCourse.trainerIds || (initialCourse.trainerId ? [initialCourse.trainerId] : []));
      setTargetAudience(initialCourse.targetAudience || []);
      setRequiredSkillLevel(initialCourse.requiredSkillLevel || 'No Prior Knowledge');
      setMinimumEducation(initialCourse.minimumEducation || 'SSC / Equivalent');
      setRecommendedAge(initialCourse.recommendedAge || '16+ Years');
      setRequiredSoftwareHardware(initialCourse.requiredSoftwareHardware || '');
      setPreviousCourse(initialCourse.previousCourse || '');
      setLearningFeatures(initialCourse.learningFeatures || ['Live Class', 'Offline Class', 'Certificate']);
      setCurriculumFileUrl(initialCourse.curriculumFileUrl || initialCourse.syllabusPdfUrl || initialCourse.landingConfig?.syllabusDownload?.fileUrl || '');
      setCurriculumFileName(initialCourse.curriculumFileName || initialCourse.landingConfig?.syllabusDownload?.fileName || '');
      setCurriculumFileType(initialCourse.curriculumFileType || initialCourse.landingConfig?.syllabusDownload?.fileType || 'pdf');
      setCurriculumFileSize(initialCourse.curriculumFileSize || initialCourse.landingConfig?.syllabusDownload?.fileSize || '');
      setCurriculumUploadedAt(initialCourse.curriculumUploadedAt || initialCourse.landingConfig?.syllabusDownload?.uploadedAt || '');
      setSeoSlug(initialCourse.seo?.slug || initialCourse.slug || generateSlug(initialCourse.name));
      setSeoFocusKeyword(initialCourse.seo?.focusKeyword || `${initialCourse.name} Course in Dhaka`);
      setSeoTitle(initialCourse.seo?.seoTitle || `${initialCourse.name} Course in Farmgate & Online BD | Nexgen Academy`);
      setSeoMetaDescription(initialCourse.seo?.metaDescription || initialCourse.description || `Join our practical hands-on ${initialCourse.name} course at Farmgate, Dhaka & Live Online across Bangladesh. 100% lab practice, verifiable certificate & career support.`);
      setSecondaryKeywordsInput((initialCourse.seo?.secondaryKeywords || [`${initialCourse.name} training Farmgate`, `${initialCourse.name} fee in Dhaka`, `best ${initialCourse.category} course`]).join(', '));
      setSeoNoIndex(initialCourse.seo?.noIndex ?? false);
    } else {
      // Auto generate placeholder code for new course
      const nextCode = `NCA-CRS-${String(courses.length + 1).padStart(2, '0')}`;
      setCode(nextCode);
      setName('');
      setShortName('');
      setCategory(categories[0] || 'Computer & Office');
      setDescription('');
      setThumbnailUrl(PRESET_THUMBNAILS[0].url);
      setStatus('Active');
      setCurriculumFileUrl('');
      setCurriculumFileName('');
      setCurriculumFileType('pdf');
      setCurriculumFileSize('');
      setCurriculumUploadedAt('');
      setDurationValue(3);
      setDurationUnit('Months');
      setTotalClasses(36);
      setClassDuration('2 Hours');
      setTotalHours(72);
      setRegularFee(15000);
      setOfferFee(12000);
      setScholarshipAvailable(true);
      setMaxScholarship(3000);
      setSeoSlug('');
      setSeoFocusKeyword('');
      setSeoTitle('');
      setSeoMetaDescription('');
      setSecondaryKeywordsInput('');
      setSeoNoIndex(false);
      setMinInstallmentAmount(4000);
      setModules([
        {
          id: `mod-${Date.now()}-1`,
          moduleNumber: 1,
          moduleName: 'Fundamentals & Setup',
          moduleDescription: 'Introduction, core environment setup, and basic tools.',
          topics: ['Introduction & Overview', 'Tooling & Environment Setup', 'Basic Concepts & Workflow'],
          estimatedClasses: 6,
          learningOutcomes: ['Understand core terminology', 'Setup working environment']
        },
        {
          id: `mod-${Date.now()}-2`,
          moduleNumber: 2,
          moduleName: 'Advanced Techniques & Application',
          moduleDescription: 'Deep dive into advanced topics, workflows, and hands-on exercises.',
          topics: ['Intermediate Tools', 'Professional Workflow Techniques', 'Troubleshooting & Optimization'],
          estimatedClasses: 12,
          learningOutcomes: ['Apply advanced methods in practical scenarios']
        },
        {
          id: `mod-${Date.now()}-3`,
          moduleNumber: 3,
          moduleName: 'Real-world Capstone Project & Portfolio',
          moduleDescription: 'Complete real client project, portfolio preparation, and marketplace strategy.',
          topics: ['Capstone Project Building', 'Portfolio Presentation', 'Freelance & Career Guidelines'],
          estimatedClasses: 8,
          learningOutcomes: ['Build a job-ready portfolio project']
        }
      ]);
      setCurriculumHighlights(['Core Fundamentals & Setup', 'Advanced Industry Workflows', 'Hands-on Real-world Project', 'Marketplace & Career Readiness']);
      const defaultTrainer = staffList.find(s => s.role === 'TRAINER')?.id || staffList[0]?.id;
      setTrainerIds(defaultTrainer ? [defaultTrainer] : []);
      setTargetAudience(['University Student', 'Job Seeker', 'Freelancer', 'Beginner']);
      setRequiredSkillLevel('No Prior Knowledge');
      setMinimumEducation('SSC / Equivalent');
      setRecommendedAge('16+ Years');
      setRequiredSoftwareHardware('Computer with broadband internet');
      setPreviousCourse('');
      setLearningFeatures(['Live Class', 'Offline Class', 'Recorded Class', 'PDF Materials', 'Assignment', 'Project', 'Certificate']);
    }
    setActiveTab('basic');
  }, [initialCourse, isOpen]);

  // Auto calculate total hours whenever classes or duration changes
  const handleClassesChange = (num: number) => {
    setTotalClasses(num);
    const durationHours = parseFloat(classDuration) || 2;
    setTotalHours(Math.round(num * durationHours));
  };

  // Module Management Functions
  const handleAddModule = () => {
    const newNum = modules.length + 1;
    const newMod: CourseModule = {
      id: `mod-${Date.now()}-${newNum}`,
      moduleNumber: newNum,
      moduleName: `Module ${newNum}: New Learning Topic`,
      moduleDescription: '',
      topics: ['Topic 1'],
      estimatedClasses: 6,
      learningOutcomes: []
    };
    setModules([...modules, newMod]);
  };

  const handleUpdateModule = (modId: string, updates: Partial<CourseModule>) => {
    setModules(modules.map(m => (m.id === modId ? { ...m, ...updates } : m)));
  };

  const handleDeleteModule = (modId: string) => {
    const filtered = modules.filter(m => m.id !== modId);
    // Renumber remaining modules
    const renumbered = filtered.map((m, idx) => ({ ...m, moduleNumber: idx + 1 }));
    setModules(renumbered);
  };

  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;
    const newModules = [...modules];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newModules[index];
    newModules[index] = newModules[targetIdx];
    newModules[targetIdx] = temp;
    // Renumber
    setModules(newModules.map((m, idx) => ({ ...m, moduleNumber: idx + 1 })));
  };

  const handleAddTopicToModule = (modId: string) => {
    const topicText = (newTopicInput[modId] || '').trim();
    if (!topicText) return;
    setModules(
      modules.map(m => {
        if (m.id === modId) {
          return { ...m, topics: [...m.topics, topicText] };
        }
        return m;
      })
    );
    setNewTopicInput({ ...newTopicInput, [modId]: '' });
  };

  const handleRemoveTopic = (modId: string, topicIdx: number) => {
    setModules(
      modules.map(m => {
        if (m.id === modId) {
          return { ...m, topics: m.topics.filter((_, i) => i !== topicIdx) };
        }
        return m;
      })
    );
  };

  const handleAddOutcomeToModule = (modId: string) => {
    const outcomeText = (newOutcomeInput[modId] || '').trim();
    if (!outcomeText) return;
    setModules(
      modules.map(m => {
        if (m.id === modId) {
          return { ...m, learningOutcomes: [...(m.learningOutcomes || []), outcomeText] };
        }
        return m;
      })
    );
    setNewOutcomeInput({ ...newOutcomeInput, [modId]: '' });
  };

  const handleRemoveOutcome = (modId: string, outcomeIdx: number) => {
    setModules(
      modules.map(m => {
        if (m.id === modId) {
          return { ...m, learningOutcomes: (m.learningOutcomes || []).filter((_, i) => i !== outcomeIdx) };
        }
        return m;
      })
    );
  };

  // Highlights Adder
  const handleAddHighlight = () => {
    const text = highlightInput.trim();
    if (!text || curriculumHighlights.includes(text)) return;
    setCurriculumHighlights([...curriculumHighlights, text]);
    setHighlightInput('');
  };

  const handleRemoveHighlight = (index: number) => {
    setCurriculumHighlights(curriculumHighlights.filter((_, i) => i !== index));
  };

  // Audience Adder
  const handleToggleAudience = (aud: string) => {
    if (targetAudience.includes(aud)) {
      setTargetAudience(targetAudience.filter(a => a !== aud));
    } else {
      setTargetAudience([...targetAudience, aud]);
    }
  };

  const handleAddCustomAudience = () => {
    const text = customAudienceInput.trim();
    if (!text || targetAudience.includes(text)) return;
    setTargetAudience([...targetAudience, text]);
    setCustomAudienceInput('');
  };

  // Learning Features Toggle
  const handleToggleFeature = (feat: string) => {
    if (learningFeatures.includes(feat)) {
      setLearningFeatures(learningFeatures.filter(f => f !== feat));
    } else {
      setLearningFeatures([...learningFeatures, feat]);
    }
  };

  // Trainer Toggle & Management
  const handleToggleTrainer = (staffId: string) => {
    if (trainerIds.includes(staffId)) {
      setTrainerIds(trainerIds.filter(id => id !== staffId));
    } else {
      setTrainerIds([...trainerIds, staffId]);
    }
  };

  const handleCreateAndAssignTrainer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTrainerName.trim()) return;

    const newStaffId = `staff-${Date.now()}`;
    const cleanName = newTrainerName.trim();
    const cleanDesignation = newTrainerDesignation.trim() || 'Senior Faculty';

    // Add to global staff directory
    addStaff({
      name: cleanName,
      role: 'TRAINER',
      designation: cleanDesignation,
      email: `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}@nexgenacademy.edu.bd`,
      phone: '01798444444',
      salary: 30000,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    });

    // Also auto-select for this course
    setTrainerIds(prev => [...prev, newStaffId]);
    setNewTrainerName('');
    setShowAddTrainerBox(false);
  };

  const handleDeleteTrainerForever = (staffId: string, staffName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove "${staffName}" from academy faculty roster?`)) {
      deleteStaff(staffId);
      setTrainerIds(prev => prev.filter(id => id !== staffId));
    }
  };

  if (!isOpen) return null;

  const calculatedDiscount = Math.max(0, regularFee - offerFee);
  const discountPercent = regularFee > 0 ? Math.round((calculatedDiscount / regularFee) * 100) : 0;
  const formattedDuration = `${durationValue} ${durationUnit}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a course title.');
      setActiveTab('basic');
      return;
    }
    if (!category.trim()) {
      alert('Please select or enter a category.');
      setActiveTab('basic');
      return;
    }

    const durationWeeksComputed =
      durationUnit === 'Weeks' ? durationValue : durationUnit === 'Months' ? durationValue * 4 : Math.ceil(durationValue / 7);

    const durationMonthsComputed =
      durationUnit === 'Months' ? durationValue : durationUnit === 'Weeks' ? Math.round((durationValue / 4) * 10) / 10 : Math.round((durationValue / 30) * 10) / 10;

    const coursePayload: Partial<Course> & { name: string; category: string } = {
      code: code.trim() || `NCA-CRS-${String(courses.length + 1).padStart(2, '0')}`,
      name: name.trim(),
      shortName: shortName.trim() || undefined,
      category: category.trim(),
      description: description.trim(),
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      status,
      badgeText: badgeText.trim() || undefined,
      rating: Number(rating) || 4.9,
      reviewsCount: Number(reviewsCount) || 0,
      projectsCount: Number(projectsCount) || 0,
      studentsJoined: Number(studentsJoined) || 0,
      durationValue,
      durationUnit,
      duration: formattedDuration,
      durationWeeks: durationWeeksComputed,
      durationMonths: durationMonthsComputed,
      totalClasses,
      classDuration,
      totalHours,
      regularFee: Number(regularFee) || 0,
      offerFee: Number(offerFee) || 0,
      discount: calculatedDiscount,
      scholarshipAvailable,
      maxScholarship: scholarshipAvailable ? Number(maxScholarship) : 0,
      minInstallmentAmount: Number(minInstallmentAmount) || 0,
      modules,
      curriculumHighlights,
      syllabusHighlights: curriculumHighlights,
      learningFeatures,
      trainerId: trainerIds[0] || staffList[0]?.id || 'st-05',
      trainerIds,
      requiredSkillLevel,
      minimumEducation,
      recommendedAge,
      requiredSoftwareHardware,
      previousCourse: previousCourse || undefined,
      targetAudience,
      slug: seoSlug.trim() || generateSlug(name),
      seo: {
        slug: seoSlug.trim() || generateSlug(name),
        focusKeyword: seoFocusKeyword.trim() || `${name} Course in Dhaka`,
        seoTitle: seoTitle.trim() || `${name} Course in Farmgate & Online BD | Nexgen Academy`,
        metaDescription: seoMetaDescription.trim() || description || `Learn ${name} with 100% practical lab & live online training in Dhaka.`,
        secondaryKeywords: secondaryKeywordsInput.split(',').map(s => s.trim()).filter(Boolean),
        noIndex: seoNoIndex,
        canonicalUrl: `https://nexgenacademy.edu.bd/courses/${seoSlug.trim() || generateSlug(name)}`
      },
      curriculumFileUrl: curriculumFileUrl || undefined,
      curriculumFileName: curriculumFileName || undefined,
      curriculumFileType: curriculumFileType || undefined,
      curriculumFileSize: curriculumFileSize || undefined,
      curriculumUploadedAt: curriculumUploadedAt || undefined,
      syllabusPdfUrl: curriculumFileUrl || undefined,
      landingConfig: {
        ...(initialCourse?.landingConfig || {}),
        syllabusDownload: {
          ...(initialCourse?.landingConfig?.syllabusDownload || {}),
          enabled: true,
          fileUrl: curriculumFileUrl || initialCourse?.landingConfig?.syllabusDownload?.fileUrl,
          fileName: curriculumFileName || initialCourse?.landingConfig?.syllabusDownload?.fileName,
          fileType: (curriculumFileType as any) || initialCourse?.landingConfig?.syllabusDownload?.fileType,
          fileSize: curriculumFileSize || initialCourse?.landingConfig?.syllabusDownload?.fileSize,
          uploadedAt: curriculumUploadedAt || initialCourse?.landingConfig?.syllabusDownload?.uploadedAt
        },
        syllabusDownloadConfig: {
          ...(initialCourse?.landingConfig?.syllabusDownloadConfig || {}),
          enabled: true,
          fileUrl: curriculumFileUrl || initialCourse?.landingConfig?.syllabusDownloadConfig?.fileUrl,
          fileName: curriculumFileName || initialCourse?.landingConfig?.syllabusDownloadConfig?.fileName,
          fileType: (curriculumFileType as any) || initialCourse?.landingConfig?.syllabusDownloadConfig?.fileType,
          fileSize: curriculumFileSize || initialCourse?.landingConfig?.syllabusDownloadConfig?.fileSize,
          uploadedAt: curriculumUploadedAt || initialCourse?.landingConfig?.syllabusDownloadConfig?.uploadedAt
        }
      }
    };

    if (isEditing && initialCourse) {
      updateCourse(initialCourse.id, coursePayload);
    } else {
      addCourse(coursePayload);
    }

    syncToCloudNow(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black tracking-tight">
                  {isEditing ? `Edit Course: ${initialCourse?.name}` : 'Create New Academy Course'}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : status === 'Draft'
                      ? 'bg-amber-500/20 text-amber-300'
                      : status === 'Archived'
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configure curriculum, modules, fee defaults, prerequisites, and learning features
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 overflow-x-auto scrollbar-none text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'basic'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Basic Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('duration_fee')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'duration_fee'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>2. Duration & Fee Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Curriculum & Modules ({modules.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trainers_audience')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'trainers_audience'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>4. Trainers & Audience</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prerequisites')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'prerequisites'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>5. Prerequisites & Features</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'seo'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>6. SEO & Google Search</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase">
              Rank
            </span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NCA-WD-01"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:border-indigo-600 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Unique system identifier</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Course Full Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Web Development with React & Node.js"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-sm focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Short / Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Full-Stack Web"
                    value={shortName}
                    onChange={e => setShortName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold">Category *</label>
                    {onOpenCategoryManager && (
                      <button
                        type="button"
                        onClick={onOpenCategoryManager}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                      >
                        + Manage
                      </button>
                    )}
                  </div>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-indigo-600 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Course Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as CourseStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-indigo-600 outline-none"
                  >
                    <option value="Active">Active (Open for Admissions)</option>
                    <option value="Draft">Draft (Under Review)</option>
                    <option value="Inactive">Inactive (Paused)</option>
                    <option value="Archived">Archived (Retired)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Course Description & Overview</label>
                <textarea
                  rows={3}
                  placeholder="Provide an overview of the course objectives, tools taught, industry prospects, and practical focus..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium leading-relaxed focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              {/* Cover Image & Presets */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-800">Cover Thumbnail URL</span>
                  </div>
                  <span className="text-[10px] text-slate-400">High-res Web Image Link</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex space-x-2">
                    {thumbnailUrl && (
                      <img
                        src={thumbnailUrl}
                        alt="Preview"
                        className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                    )}
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={thumbnailUrl}
                      onChange={e => setThumbnailUrl(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:border-indigo-600 outline-none"
                    />
                  </div>
                  <label className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 cursor-pointer flex items-center justify-center space-x-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressed = await compressLogoOrAvatar(file, 800);
                            setThumbnailUrl(compressed);
                          } catch (err) {
                            console.error('Error compressing image:', err);
                          }
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Quick Preset Thumbnails:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_THUMBNAILS.map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setThumbnailUrl(preset.url)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${
                          thumbnailUrl === preset.url
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Website Card Display & Performance Metrics */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      Website Card Badges & Performance Metrics (পাবলিক ওয়েবসাইট কার্ড ডিসপ্লে)
                    </span>
                  </div>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100 px-2 py-0.5 rounded-full">
                    CMS Controlled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">
                      Card Badge Tag (ট্যাগ / ব্যাজ)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UITB-VE-01, Bestseller, Trending"
                      value={badgeText}
                      onChange={e => setBadgeText(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:border-indigo-600 outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Displayed as the top pill on public cards</p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">
                      Rating Score (রেটিং)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      placeholder="4.9"
                      value={rating}
                      onChange={e => setRating(parseFloat(e.target.value) || 4.9)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-indigo-600 outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">e.g. 4.9 out of 5.0</p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">
                      Total Reviews Count (রিভিউ সংখ্যা)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="431"
                      value={reviewsCount}
                      onChange={e => setReviewsCount(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-indigo-600 outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Shown alongside the rating score</p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">
                      Real Projects Count (প্রজেক্ট সংখ্যা)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="10"
                      value={projectsCount}
                      onChange={e => setProjectsCount(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-indigo-600 outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">e.g. 10 Real Projects</p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">
                      Students Enrolled / Joined (শিক্ষার্থী সংখ্যা)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="450"
                      value={studentsJoined}
                      onChange={e => setStudentsJoined(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-indigo-600 outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">e.g. 450+ Enrolled</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SEO & GOOGLE SEARCH LIVE SIMULATOR */}
          {activeTab === 'seo' && (
            <div className="space-y-6 animate-in fade-in duration-100">
              {/* Header Ribbon & Auto-Generate Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 rounded-2xl">
                <div>
                  <h4 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>কোর্স সার্চ ইঞ্জিন অপ্টিমাইজেশন (Course SEO & Ranking Hub)</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    গুগলে এই কোর্সটি লিখে সার্চ দিলে কীভাবে প্রদর্শিত হবে এবং কোন কি-ওয়ার্ডে র‍্যাংক করবে তা এখান থেকে নিয়ন্ত্রণ করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoGenerateSeo}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>১-ক্লিকে অটো এসইও তৈরি করুন (Auto-Generate)</span>
                </button>
              </div>

              {/* LIVE GOOGLE SERP SIMULATOR */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                    <Search className="w-4 h-4 text-indigo-600" />
                    <span>গুগল সার্চ লাইভ প্রিভিউ (Google Search Preview)</span>
                  </div>
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setSerpPreviewMode('desktop')}
                      className={`px-2.5 py-1 rounded-md flex items-center space-x-1 transition-all ${
                        serpPreviewMode === 'desktop' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      <Monitor className="w-3 h-3" />
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSerpPreviewMode('mobile')}
                      className={`px-2.5 py-1 rounded-md flex items-center space-x-1 transition-all ${
                        serpPreviewMode === 'mobile' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Google Snippet Card */}
                <div className={`p-4 rounded-xl border border-slate-200 bg-white font-sans transition-all ${
                  serpPreviewMode === 'mobile' ? 'max-w-sm mx-auto shadow-sm' : 'w-full'
                }`}>
                  <div className="flex items-center space-x-2 text-[12px] text-slate-700 truncate">
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                      N
                    </div>
                    <span className="font-semibold text-slate-800">Nexgen Computer Academy</span>
                    <span className="text-slate-400">› courses › {seoSlug || generateSlug(name) || 'course-name'}</span>
                  </div>
                  <h4 className="text-[#1a0dab] hover:underline font-medium text-base sm:text-lg leading-snug cursor-pointer pt-1 line-clamp-2">
                    {seoTitle || `${name || "Course Name"} Course in Farmgate & Online BD | Nexgen Academy`}
                  </h4>
                  <p className="text-[13px] text-[#4d5156] leading-relaxed pt-1 line-clamp-3">
                    {seoMetaDescription || description || `Join our practical hands-on ${name || "IT"} course at Farmgate, Dhaka & Live Online across Bangladesh. 100% lab practice, verifiable certificate & career support.`}
                  </p>
                </div>
              </div>

              {/* INPUT FIELDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. URL Slug */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Course URL Slug (ইউআরএল লিংক)</label>
                    <span className="text-[10px] text-slate-400 font-mono">/courses/[slug]</span>
                  </div>
                  <input
                    type="text"
                    value={seoSlug}
                    onChange={e => setSeoSlug(generateSlug(e.target.value))}
                    placeholder="e.g. autocad-2d-3d or video-editing"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-indigo-700 font-bold text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    ওয়েবসাইটে এই কোর্সের সরাসরি পেজ লিংক হবে: <strong className="font-mono text-slate-800">https://nexgenacademy.edu.bd/courses/{seoSlug || generateSlug(name) || 'url-slug'}</strong>
                  </span>
                </div>

                {/* 2. Focus Keyword */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Primary Focus Keyword (প্রধান টার্গেট কি-ওয়ার্ড)</label>
                    <span className="text-[10px] text-emerald-600 font-semibold">Rank #1 Target</span>
                  </div>
                  <input
                    type="text"
                    value={seoFocusKeyword}
                    onChange={e => setSeoFocusKeyword(e.target.value)}
                    placeholder="e.g. AutoCAD 2D 3D Course in Dhaka"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    শিক্ষার্থীরা গুগলে যে নির্দিষ্ট কি-ওয়ার্ড দিয়ে খুঁজলে এই কোর্সটি আগে আসবে।
                  </span>
                </div>

                {/* 3. SEO Meta Title */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">SEO Meta Title (গুগল সার্চের বড় নীল শিরোনাম)</label>
                    <span className={`text-[11px] font-bold ${
                      seoTitle.length >= 40 && seoTitle.length <= 65 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {seoTitle.length} / 60 Chars (Optimal: 40-60)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={e => setSeoTitle(e.target.value)}
                    placeholder="e.g. AutoCAD 2D 3D Course in Farmgate & Online BD | Nexgen Academy"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* 4. SEO Meta Description */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">SEO Meta Description (গুগলের ২ লাইনের সারসংক্ষেপ)</label>
                    <span className={`text-[11px] font-bold ${
                      seoMetaDescription.length >= 120 && seoMetaDescription.length <= 165 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {seoMetaDescription.length} / 160 Chars (Optimal: 120-160)
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={seoMetaDescription}
                    onChange={e => setSeoMetaDescription(e.target.value)}
                    placeholder="e.g. Learn AutoCAD 2D & 3D drafting with 100% practical lab practice in Farmgate, Dhaka or Live Online across Bangladesh. Verifiable certificate & job assistance included."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* 5. Secondary Keywords */}
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Secondary Search Keywords (কমা দিয়ে অন্যান্য কি-ওয়ার্ড লিখুন)
                  </label>
                  <input
                    type="text"
                    value={secondaryKeywordsInput}
                    onChange={e => setSecondaryKeywordsInput(e.target.value)}
                    placeholder="e.g. AutoCAD course fee in Dhaka, Civil CAD drafting, online AutoCAD course BD"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    কমা (,) দিয়ে অতিরিক্ত কি-ওয়ার্ড আলাদা করে দিন যাতে সম্পর্কিত সার্চেও এই কোর্সটি গুগল খুঁজে পায়।
                  </span>
                </div>

                {/* 6. Indexing Toggle */}
                <div className="md:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">গুগল ইন্ডেক্সিং স্ট্যাটাস (Google Search Visibility)</span>
                    <span className="text-[11px] text-slate-500 block">
                      কোর্সটি গুগলে সক্রিয় থাকবে কি না তা নির্বাচন করুন।
                    </span>
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <span className={`text-xs font-bold ${seoNoIndex ? 'text-amber-600' : 'text-emerald-700'}`}>
                      {seoNoIndex ? 'Noindex (গুগলে দেখাবে না)' : 'Indexed (গুগলে দেখাবে - Active)'}
                    </span>
                    <input
                      type="checkbox"
                      checked={!seoNoIndex}
                      onChange={e => setSeoNoIndex(!e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DURATION & FEES */}
          {activeTab === 'duration_fee' && (
            <div className="space-y-5 animate-in fade-in duration-100">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-2.5 text-blue-900 text-xs">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Template Fee Settings</span>
                  <span>
                    Fee settings configured here serve as defaults when enrolling new students. Individual student
                    admissions maintain their own agreed fee, custom discounts, and scholarship records to guarantee
                    historical financial integrity.
                  </span>
                </div>
              </div>

              {/* Duration Settings */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Duration & Class Schedule</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Duration Value</label>
                    <input
                      type="number"
                      min={1}
                      value={durationValue}
                      onChange={e => setDurationValue(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Duration Unit</label>
                    <select
                      value={durationUnit}
                      onChange={e => setDurationUnit(e.target.value as DurationUnit)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                    >
                      <option value="Days">Days</option>
                      <option value="Weeks">Weeks</option>
                      <option value="Months">Months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Formatted Duration Display</label>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 text-indigo-950 font-black">
                      {formattedDuration}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Total Classes (Sessions)</label>
                    <input
                      type="number"
                      min={1}
                      value={totalClasses}
                      onChange={e => handleClassesChange(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Session Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Hours"
                      value={classDuration}
                      onChange={e => {
                        setClassDuration(e.target.value);
                        const dur = parseFloat(e.target.value) || 2;
                        setTotalHours(Math.round(totalClasses * dur));
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Total Learning Hours</label>
                    <input
                      type="number"
                      value={totalHours}
                      onChange={e => setTotalHours(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Fee Settings */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                <h4 className="font-bold text-slate-800 flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Fee Structure & Payment Templates</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Standard Regular Fee (৳) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={regularFee}
                      onChange={e => setRegularFee(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-black text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Default Offer / Payable Fee (৳) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={offerFee}
                      onChange={e => setOfferFee(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-indigo-700 font-black text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Computed Discount Summary */}
                <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Standard Discount (৳)</span>
                    <span className="text-sm font-bold text-slate-800">৳{calculatedDiscount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Discount Percentage</span>
                    <span className="text-sm font-bold text-emerald-600">{discountPercent}% Off</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Scholarship Eligible?</label>
                    <button
                      type="button"
                      onClick={() => setScholarshipAvailable(!scholarshipAvailable)}
                      className={`w-full py-2 px-3 rounded-xl border font-bold text-xs transition-colors flex items-center justify-center space-x-2 ${
                        scholarshipAvailable
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${scholarshipAvailable ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>{scholarshipAvailable ? 'Scholarship Available' : 'No Scholarship'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Max Scholarship Limit (৳)</label>
                    <input
                      type="number"
                      disabled={!scholarshipAvailable}
                      value={maxScholarship}
                      onChange={e => setMaxScholarship(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none disabled:opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Min Installment Amount (৳)</label>
                    <input
                      type="number"
                      min={0}
                      value={minInstallmentAmount}
                      onChange={e => setMinInstallmentAmount(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CURRICULUM & MODULES BUILDER */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Course Syllabus & Curriculum Modules</h4>
                  <p className="text-slate-500 text-[11px]">
                    Build detailed learning modules, lecture topics, and expected practical outcomes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Module</span>
                </button>
              </div>

              {/* MANUAL CURRICULUM FILE UPLOAD BOX (PDF / JPG / PNG / WEBP) */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border border-indigo-200 rounded-2xl space-y-3.5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center space-x-1.5">
                        <span>কারিকুলাম ও সিলেবাস ফাইল আপলোড (PDF / JPG / PNG)</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wide">
                          ম্যানুয়াল আপডেট
                        </span>
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        কারিকুলাম পরিবর্তন হলে যেকোনো সময় নতুন ফাইল আপলোড করে হালনাগাদ করতে পারবেন।
                      </p>
                    </div>
                  </div>
                  {curriculumFileUrl && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 inline-flex items-center space-x-1 self-start sm:self-auto">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ফাইল সংরক্ষিত আছে</span>
                    </span>
                  )}
                </div>

                {fileUploadError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{fileUploadError}</span>
                  </div>
                )}

                {curriculumFileUrl ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-indigo-200 rounded-xl gap-3 shadow-2xs">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0 uppercase border border-indigo-200">
                        {curriculumFileType || 'FILE'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md" title={curriculumFileName}>
                          {curriculumFileName || `${name || 'course'}_curriculum_syllabus`}
                        </p>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium mt-0.5">
                          {curriculumFileSize && <span>সাইজ: {curriculumFileSize}</span>}
                          {curriculumUploadedAt && <span>• আপলোড: {curriculumUploadedAt}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowFilePreview(true)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>প্রিভিউ</span>
                      </button>

                      <label className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 flex items-center space-x-1 cursor-pointer transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>ফাইল বদলান / আপডেট</span>
                        <input
                          type="file"
                          accept=".pdf,image/png,image/jpeg,image/webp"
                          onChange={handleCurriculumFileUpload}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setCurriculumFileUrl('');
                          setCurriculumFileName('');
                          setCurriculumFileSize('');
                          setCurriculumUploadedAt('');
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="ফাইল মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl p-5 text-center bg-white/80 transition-colors">
                    <label className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-800">
                          কারিকুলাম ফাইল আপলোড করতে এখানে ক্লিক করুন
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          সাপোর্টেড ফরম্যাট: PDF, JPG, JPEG, PNG, WEBP (সর্বোচ্চ ২৫MB)
                        </p>
                      </div>
                      <span className="mt-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors">
                        ফাইল বাছুন
                      </span>
                      <input
                        type="file"
                        accept=".pdf,image/png,image/jpeg,image/webp"
                        onChange={handleCurriculumFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Modules List */}
              <div className="space-y-3.5">
                {modules.map((mod, index) => (
                  <div
                    key={mod.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                          {mod.moduleNumber}
                        </span>
                        <input
                          type="text"
                          value={mod.moduleName}
                          onChange={e => handleUpdateModule(mod.id, { moduleName: e.target.value })}
                          placeholder="Module Name (e.g. Advanced Vector Art & Generative AI)"
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-900 outline-none focus:border-indigo-600 text-xs"
                        />
                      </div>

                      {/* Reorder & Actions */}
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveModule(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveModule(index, 'down')}
                          disabled={index === modules.length - 1}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteModule(mod.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={mod.moduleDescription || ''}
                          onChange={e => handleUpdateModule(mod.id, { moduleDescription: e.target.value })}
                          placeholder="Module summary or learning focus..."
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 outline-none text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          min={1}
                          value={mod.estimatedClasses || 6}
                          onChange={e => handleUpdateModule(mod.id, { estimatedClasses: Number(e.target.value) })}
                          placeholder="Classes"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-900 font-bold outline-none text-xs text-center"
                          title="Estimated Classes"
                        />
                      </div>
                    </div>

                    {/* Topics Sub-section */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Topics Covered ({mod.topics.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {mod.topics.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center space-x-1 bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            <span>{t}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTopic(mod.id, tIdx)}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add Topic Input */}
                      <div className="flex space-x-1.5 pt-1">
                        <input
                          type="text"
                          placeholder="Add topic (e.g. Master Pen Tool, Flexbox, API Keys) and click Add"
                          value={newTopicInput[mod.id] || ''}
                          onChange={e => setNewTopicInput({ ...newTopicInput, [mod.id]: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTopicToModule(mod.id);
                            }
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-indigo-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTopicToModule(mod.id)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs"
                        >
                          + Add Topic
                        </button>
                      </div>
                    </div>

                    {/* Learning Outcomes */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Learning Outcomes / Practical Deliverables
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(mod.learningOutcomes || []).map((out, oIdx) => (
                          <span
                            key={oIdx}
                            className="inline-flex items-center space-x-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            <span>{out}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveOutcome(mod.id, oIdx)}
                              className="text-emerald-500 hover:text-rose-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-1.5 pt-0.5">
                        <input
                          type="text"
                          placeholder="Add practical deliverable or outcome..."
                          value={newOutcomeInput[mod.id] || ''}
                          onChange={e => setNewOutcomeInput({ ...newOutcomeInput, [mod.id]: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddOutcomeToModule(mod.id);
                            }
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddOutcomeToModule(mod.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs"
                        >
                          + Add Outcome
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Course Highlights / Quick Badges */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 mt-4">
                <span className="text-xs font-bold text-slate-800 block">
                  Curriculum Highlights (Short Badges for Course Cards)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {curriculumHighlights.map((hl, hIdx) => (
                    <span
                      key={hIdx}
                      className="inline-flex items-center space-x-1 bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold px-2.5 py-1 rounded-lg text-xs"
                    >
                      <span>{hl}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(hIdx)}
                        className="text-indigo-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2 pt-1">
                  <input
                    type="text"
                    placeholder="e.g. Advanced Excel, Generative AI Art, REST APIs..."
                    value={highlightInput}
                    onChange={e => setHighlightInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                  >
                    Add Highlight
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRAINERS & AUDIENCE */}
          {activeTab === 'trainers_audience' && (
            <div className="space-y-5 animate-in fade-in duration-100">
              {/* Assigned Trainers */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-900">Assigned Faculty / Trainers (অনুষদ / ট্রেইনারবৃন্দ)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddTrainerBox(!showAddTrainerBox)}
                    className="self-start sm:self-auto px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddTrainerBox ? 'Close Form' : 'নতুন ট্রেইনার নাম লিখুন'}</span>
                  </button>
                </div>

                {/* Manual Trainer Name Input Box */}
                {showAddTrainerBox && (
                  <div className="p-3 bg-white border border-indigo-200 rounded-xl space-y-2 shadow-xs animate-in fade-in duration-100">
                    <div className="text-[11px] font-bold text-indigo-900">
                      সরাসরি ট্রেইনারের নাম ও পদবী লিখে এই কোর্সে অ্যাসাইন করুন:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newTrainerName}
                        onChange={e => setNewTrainerName(e.target.value)}
                        placeholder="ট্রেইনারের পূর্ণ নাম (যেমন: Md. Asif Rahman)"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                      />
                      <input
                        type="text"
                        value={newTrainerDesignation}
                        onChange={e => setNewTrainerDesignation(e.target.value)}
                        placeholder="পদবী (যেমন: Lead Python & AI Trainer)"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddTrainerBox(false)}
                        className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                      >
                        বাতিল
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateAndAssignTrainer}
                        disabled={!newTrainerName.trim()}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ট্রেইনার যুক্ত ও অ্যাসাইন করুন</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {staffList.map(staff => {
                    const isSelected = trainerIds.includes(staff.id);
                    return (
                      <div
                        key={staff.id}
                        onClick={() => handleToggleTrainer(staff.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all group ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <img
                            src={staff.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={staff.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate">{staff.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal block truncate">{staff.designation}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => handleDeleteTrainerForever(staff.id, staff.name, e)}
                            title="Delete faculty from roster"
                            className="p-1 text-slate-300 hover:text-rose-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Target Audience */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">Target Student Audience</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Who is this course best suited for?</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {DEFAULT_TARGET_AUDIENCES.map(aud => {
                    const isSelected = targetAudience.includes(aud);
                    return (
                      <button
                        key={aud}
                        type="button"
                        onClick={() => handleToggleAudience(aud)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {aud}
                      </button>
                    );
                  })}
                  {targetAudience
                    .filter(a => !DEFAULT_TARGET_AUDIENCES.includes(a))
                    .map(aud => (
                      <button
                        key={aud}
                        type="button"
                        onClick={() => handleToggleAudience(aud)}
                        className="text-xs px-3 py-1.5 rounded-xl border font-bold bg-indigo-600 text-white border-indigo-600 shadow-2xs flex items-center space-x-1"
                      >
                        <span>{aud}</span>
                        <X className="w-3 h-3 ml-1" />
                      </button>
                    ))}
                </div>

                <div className="flex space-x-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add custom target audience..."
                    value={customAudienceInput}
                    onChange={e => setCustomAudienceInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomAudience();
                      }
                    }}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAudience}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PREREQUISITES & FEATURES */}
          {activeTab === 'prerequisites' && (
            <div className="space-y-5 animate-in fade-in duration-100">
              {/* Prerequisites Grid */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Academic & Technical Prerequisites</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Required Skill Level</label>
                    <select
                      value={requiredSkillLevel}
                      onChange={e => setRequiredSkillLevel(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    >
                      <option value="No Prior Knowledge">No Prior Knowledge</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Minimum Education</label>
                    <select
                      value={minimumEducation}
                      onChange={e => setMinimumEducation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    >
                      <option value="Any">Any</option>
                      <option value="SSC / Equivalent">SSC / Equivalent</option>
                      <option value="HSC / Equivalent">HSC / Equivalent</option>
                      <option value="Diploma / Graduate">Diploma / Graduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Recommended Age</label>
                    <input
                      type="text"
                      placeholder="e.g. 16+ Years"
                      value={recommendedAge}
                      onChange={e => setRecommendedAge(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Required Hardware & Software Specs</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Laptop with 8GB RAM, Dedicated GPU for 3D/Video, Windows 10/11"
                      value={requiredSoftwareHardware}
                      onChange={e => setRequiredSoftwareHardware(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Previous Course Prerequisite (Optional)</label>
                    <select
                      value={previousCourse}
                      onChange={e => setPreviousCourse(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                    >
                      <option value="">None (Entry Level Course)</option>
                      {courses
                        .filter(c => !initialCourse || c.id !== initialCourse.id)
                        .map(c => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.code})
                          </option>
                        ))}
                    </select>
                    <span className="text-[10px] text-slate-400 mt-1 block">Students must complete this course before enrolling</span>
                  </div>
                </div>
              </div>

              {/* Learning Features Checklist */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900">Included Learning Features & Assets</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Features provided to enrolled students</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DEFAULT_LEARNING_FEATURES.map(feat => {
                    const isChecked = learningFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => handleToggleFeature(feat)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 font-bold'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <span className="text-xs">{feat}</span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center ${
                            isChecked ? 'bg-amber-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400">
                {isEditing ? `Editing ID: ${initialCourse?.id}` : 'Auto-generating new unique ID'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors"
              >
                {isEditing ? 'Save Changes' : 'Create Course'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* FILE PREVIEW MODAL */}
      {showFilePreview && curriculumFileUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold truncate max-w-lg">{curriculumFileName || 'Curriculum Syllabus Preview'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={curriculumFileUrl}
                  download={curriculumFileName || 'curriculum'}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                  title="ডাউনলোড"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setShowFilePreview(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-slate-100 flex items-center justify-center min-h-[400px]">
              {curriculumFileType === 'pdf' || curriculumFileName.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={curriculumFileUrl}
                  title="PDF Preview"
                  className="w-full h-[70vh] rounded-xl border border-slate-300 bg-white"
                />
              ) : (
                <img
                  src={curriculumFileUrl}
                  alt="Curriculum Preview"
                  className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
