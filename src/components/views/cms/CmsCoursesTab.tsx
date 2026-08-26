import React, { useState, useRef } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { Course, CourseModule, CourseStatus } from '../../../types';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  DollarSign,
  Tag,
  Search,
  ExternalLink,
  ChevronRight,
  ListPlus,
  HelpCircle,
  Shield,
  Award,
  Upload,
  Image as ImageIcon,
  FileImage,
  X,
  Eye,
  RefreshCw,
  Star,
  Zap,
  Building,
  Video,
  PlaySquare,
  ArrowRight,
  Check,
  Crop
} from 'lucide-react';
import { ImageUploadCropModal } from '../../common/ImageUploadCropModal';

interface CmsCoursesTabProps {
  onSuccessToast: (msg: string) => void;
}

// Curated high-resolution image presets for rapid course mapping
const PRESET_COURSE_IMAGES = [
  { label: 'Video Editing & VFX', category: 'Media & Animation', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Motion Graphics 3D', category: 'Media & Animation', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cinematography & Audio', category: 'Media & Animation', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80' },
  { label: 'Graphic Design Masterclass', category: 'Design & Creative', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80' },
  { label: 'UI/UX Design & Figma', category: 'Design & Creative', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80' },
  { label: '3D Modeling & Animation', category: 'Design & Creative', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
  { label: 'Full Stack Web Dev', category: 'Web & Software', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80' },
  { label: 'Python & Django Backend', category: 'Web & Software', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80' },
  { label: 'Mobile App Flutter', category: 'Web & Software', url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80' },
  { label: 'Ethical Hacking & Cyber', category: 'Web & Software', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80' },
  { label: 'Digital Marketing & SEO', category: 'Marketing & Business', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Freelancing Pro Career', category: 'Marketing & Business', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Social Media Strategy', category: 'Marketing & Business', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80' },
  { label: 'AutoCAD 2D/3D Architecture', category: 'Engineering & Office', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Office & Advanced Excel', category: 'Engineering & Office', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80' },
  { label: 'AI & Data Science Pro', category: 'AI & Data', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80' }
];

export const CmsCoursesTab: React.FC<CmsCoursesTabProps> = ({ onSuccessToast }) => {
  const { courses, addCourse, updateCourse, deleteCourse } = useAcademy();

  const defaultCategories = ['Web & Software', 'Cyber Security', 'Creative Media & Animation', 'Data & AI', 'Office & Digital Skills'];
  const dynamicCategories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));
  const categories = Array.from(new Set([...defaultCategories, ...dynamicCategories]));

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Quick Image Mapping Modal State for individual course cards
  const [quickMappingCourse, setQuickMappingCourse] = useState<Course | null>(null);
  const [quickImageValue, setQuickImageValue] = useState<string>('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [presetFilterCategory, setPresetFilterCategory] = useState<string>('All');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [activeCropTarget, setActiveCropTarget] = useState<'form' | 'quick' | { id: string }>('form');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    badgeText: string;
    category: string;
    courseType: 'Offline' | 'Online' | 'Pre Recorded';
    duration: string;
    totalClasses: number;
    projectsCount: number;
    studentsJoined: number;
    rating: number;
    reviewsCount: number;
    regularFee: number;
    offerFee: number;
    description: string;
    thumbnailUrl: string;
    status: CourseStatus;
    curriculumHighlights: string[];
    learningFeatures: string[];
    modules: CourseModule[];
  }>({
    name: '',
    code: '',
    badgeText: '',
    category: categories[0] || 'Web & Software',
    courseType: 'Offline',
    duration: '4 Months (48 Classes)',
    totalClasses: 48,
    projectsCount: 10,
    studentsJoined: 350,
    rating: 4.9,
    reviewsCount: 220,
    regularFee: 20000,
    offerFee: 15000,
    description: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    status: 'Active',
    curriculumHighlights: ['Live Project-based Training', '100% Job & Internship Assistance', 'Free Lifetime Lab Access'],
    learningFeatures: ['Basic Computer Literacy', 'Passion for Technology'],
    modules: [
      {
        id: `mod-1`,
        moduleNumber: 1,
        moduleName: 'Module 1: Foundations & Core Concepts',
        topics: ['Introduction to Industry Tools', 'Core Fundamentals', 'Practical Exercises']
      }
    ]
  });

  const [highlightInput, setHighlightInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.courseType && c.courseType.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Handle local image file upload & convert to Data URL
  const processImageFile = (file: File, callback: (dataUrl: string) => void) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
        onSuccessToast(`Image "${file.name}" uploaded and mapped successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, (url) => {
        setFormData(prev => ({ ...prev, thumbnailUrl: url }));
      });
    }
  };

  const handleDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file, (url) => {
        setFormData(prev => ({ ...prev, thumbnailUrl: url }));
      });
    }
  };

  const handleQuickFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, (url) => {
        setQuickImageValue(url);
      });
    }
  };

  const handleSelectCourseToEdit = (course: Course) => {
    setEditingCourse(course);
    setIsCreatingNew(false);
    setFormData({
      name: course.name,
      code: course.code,
      badgeText: course.badgeText || course.code,
      category: course.category,
      courseType: (course.courseType as 'Offline' | 'Online' | 'Pre Recorded') || 'Offline',
      duration: course.duration,
      totalClasses: course.totalClasses || 40,
      projectsCount: course.projectsCount || 8,
      studentsJoined: course.studentsJoined || 250,
      rating: course.rating || 4.9,
      reviewsCount: course.reviewsCount || 180,
      regularFee: course.regularFee || 0,
      offerFee: course.offerFee || course.regularFee || 0,
      description: course.description || '',
      thumbnailUrl: course.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
      status: course.status || 'Active',
      curriculumHighlights: course.curriculumHighlights?.length ? course.curriculumHighlights : ['Live Project-based Training', '100% Job & Internship Assistance'],
      learningFeatures: course.learningFeatures?.length ? course.learningFeatures : ['Basic Computer Operating Skills'],
      modules: course.modules?.length ? course.modules : [
        {
          id: `mod-1`,
          moduleNumber: 1,
          moduleName: 'Module 1: Professional Foundations',
          topics: ['Core Concepts', 'Hands-on Practice', 'Mini Project']
        }
      ]
    });
  };

  const handleStartCreateNew = () => {
    setEditingCourse(null);
    setIsCreatingNew(true);
    const newCode = `NCA-CRS-${String(courses.length + 1).padStart(2, '0')}`;
    setFormData({
      name: '',
      code: newCode,
      badgeText: newCode,
      category: categories[0] || 'Web & Software',
      courseType: 'Offline',
      duration: '4 Months (48 Classes)',
      totalClasses: 48,
      projectsCount: 10,
      studentsJoined: 150,
      rating: 4.9,
      reviewsCount: 95,
      regularFee: 25000,
      offerFee: 18000,
      description: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      status: 'Active',
      curriculumHighlights: ['Practical Lab Work', 'Industry Expert Mentorship', 'Certificate of Completion'],
      learningFeatures: ['Basic Computer Operating Knowledge'],
      modules: [
        {
          id: `mod-1`,
          moduleNumber: 1,
          moduleName: 'Module 1: Introduction & Fundamentals',
          topics: ['Orientation & Setup', 'Core Tools', 'Foundational Practical Tasks']
        }
      ]
    });
  };

  const handleOpenQuickMapModal = (course: Course) => {
    setQuickMappingCourse(course);
    setQuickImageValue(course.thumbnailUrl || '');
  };

  const handleSaveQuickImageMapping = () => {
    if (!quickMappingCourse || !quickImageValue.trim()) return;
    updateCourse(quickMappingCourse.id, {
      thumbnailUrl: quickImageValue.trim()
    });
    onSuccessToast(`Updated image thumbnail for "${quickMappingCourse.name}"!`);
    setQuickMappingCourse(null);
  };

  const handleAddHighlight = () => {
    if (!highlightInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      curriculumHighlights: [...prev.curriculumHighlights, highlightInput.trim()]
    }));
    setHighlightInput('');
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      curriculumHighlights: prev.curriculumHighlights.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      learningFeatures: [...prev.learningFeatures, featureInput.trim()]
    }));
    setFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learningFeatures: prev.learningFeatures.filter((_, i) => i !== index)
    }));
  };

  // Module management
  const handleAddModule = () => {
    const modNum = formData.modules.length + 1;
    const newMod: CourseModule = {
      id: `mod-${Date.now()}`,
      moduleNumber: modNum,
      moduleName: `Module ${modNum}: Advanced Topics`,
      topics: ['Topic 1: Overview & Implementation', 'Topic 2: Real-world Hands-on Project']
    };
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, newMod]
    }));
  };

  const handleRemoveModule = (modId: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== modId)
    }));
  };

  const handleUpdateModuleField = (modIndex: number, field: keyof CourseModule, value: any) => {
    setFormData(prev => {
      const updated = [...prev.modules];
      updated[modIndex] = { ...updated[modIndex], [field]: value };
      return { ...prev, modules: updated };
    });
  };

  const handleAddTopicToModule = (modIndex: number, topicText: string) => {
    if (!topicText.trim()) return;
    setFormData(prev => {
      const updated = [...prev.modules];
      const currentTopics = updated[modIndex].topics || [];
      updated[modIndex] = { ...updated[modIndex], topics: [...currentTopics, topicText.trim()] };
      return { ...prev, modules: updated };
    });
  };

  const handleRemoveTopicFromModule = (modIndex: number, topicIndex: number) => {
    setFormData(prev => {
      const updated = [...prev.modules];
      const currentTopics = (updated[modIndex].topics || []).filter((_, i) => i !== topicIndex);
      updated[modIndex] = { ...updated[modIndex], topics: currentTopics };
      return { ...prev, modules: updated };
    });
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        name: formData.name,
        code: formData.code,
        badgeText: formData.badgeText || formData.code,
        category: formData.category,
        courseType: formData.courseType,
        duration: formData.duration,
        totalClasses: formData.totalClasses,
        projectsCount: formData.projectsCount,
        studentsJoined: formData.studentsJoined,
        rating: formData.rating,
        reviewsCount: formData.reviewsCount,
        regularFee: formData.regularFee,
        offerFee: formData.offerFee,
        description: formData.description,
        thumbnailUrl: formData.thumbnailUrl,
        status: formData.status,
        curriculumHighlights: formData.curriculumHighlights,
        learningFeatures: formData.learningFeatures,
        modules: formData.modules
      });
      onSuccessToast(`Course "${formData.name}" details updated across website & ERP!`);
    } else if (isCreatingNew) {
      addCourse({
        name: formData.name,
        code: formData.code,
        badgeText: formData.badgeText || formData.code,
        category: formData.category,
        courseType: formData.courseType,
        duration: formData.duration,
        totalClasses: formData.totalClasses,
        projectsCount: formData.projectsCount,
        studentsJoined: formData.studentsJoined,
        rating: formData.rating,
        reviewsCount: formData.reviewsCount,
        regularFee: formData.regularFee,
        offerFee: formData.offerFee,
        description: formData.description,
        thumbnailUrl: formData.thumbnailUrl,
        status: formData.status,
        curriculumHighlights: formData.curriculumHighlights,
        learningFeatures: formData.learningFeatures,
        modules: formData.modules
      });
      onSuccessToast(`New course "${formData.name}" added to public website!`);
    }

    setEditingCourse(null);
    setIsCreatingNew(false);
  };

  const filteredPresets = PRESET_COURSE_IMAGES.filter(p => {
    if (presetFilterCategory === 'All') return true;
    return p.category === presetFilterCategory;
  });

  const presetCategories = ['All', 'Media & Animation', 'Design & Creative', 'Web & Software', 'Marketing & Business', 'Engineering & Office', 'AI & Data'];

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
              Website Course Details, Dynamic Media & Syllabus Manager
            </h4>
            <p className="text-[11px] text-indigo-700">
              Upload course cover images, map media to public course cards, configure live discount fees, syllabus modules, and delivery modes.
            </p>
          </div>
        </div>

        {!editingCourse && !isCreatingNew && (
          <button
            type="button"
            onClick={handleStartCreateNew}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        )}
      </div>

      {/* Course Edit/Create Form */}
      {(editingCourse || isCreatingNew) && (
        <form onSubmit={handleSaveCourse} className="bg-white p-6 rounded-3xl border border-indigo-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  {editingCourse ? `Edit Course: ${editingCourse.name}` : 'Create New Academy Course'}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  {formData.code || 'Auto-generated ID'} • Changes publish to website in real-time
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setEditingCourse(null); setIsCreatingNew(false); }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
            {/* Basic Info */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Course Full Title *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Professional Video Editing & Motion Graphics"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Course Code / Display Badge</label>
              <input
                type="text"
                value={formData.badgeText || formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value, badgeText: e.target.value })}
                placeholder="e.g. UITB-VE-109 or NCA-CRS-01"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-indigo-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Course Delivery Mode (কোর্স মাধ্যম) *</label>
              <select
                value={formData.courseType}
                onChange={e => setFormData({ ...formData, courseType: e.target.value as 'Offline' | 'Online' | 'Pre Recorded' })}
                className="w-full p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl font-bold text-indigo-900"
              >
                <option value="Offline">🏢 Offline (ইন-পার্সন ল্যাব ব্যাচ)</option>
                <option value="Online">🌐 Online (লাইভ ইন্টারেক্টিভ ক্লাস)</option>
                <option value="Pre Recorded">🎬 Pre Recorded (সেলফ-পেসড ভিডিও কোর্স)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Duration *</label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 3.5 Months"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Total Classes Count *</label>
              <input
                type="number"
                required
                value={formData.totalClasses}
                onChange={e => setFormData({ ...formData, totalClasses: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Portfolio Projects Count</label>
              <input
                type="number"
                value={formData.projectsCount}
                onChange={e => setFormData({ ...formData, projectsCount: parseInt(e.target.value) || 0 })}
                placeholder="e.g. 10"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Students Joined Count</label>
              <input
                type="number"
                value={formData.studentsJoined}
                onChange={e => setFormData({ ...formData, studentsJoined: parseInt(e.target.value) || 0 })}
                placeholder="e.g. 450"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Star Rating (1.0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.9 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-amber-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Reviews Count</label>
              <input
                type="number"
                value={formData.reviewsCount}
                onChange={e => setFormData({ ...formData, reviewsCount: parseInt(e.target.value) || 0 })}
                placeholder="e.g. 431"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Regular Fee (৳) *</label>
              <input
                type="number"
                required
                value={formData.regularFee}
                onChange={e => setFormData({ ...formData, regularFee: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Offer / Discounted Fee (৳) *</label>
              <input
                type="number"
                required
                value={formData.offerFee}
                onChange={e => setFormData({ ...formData, offerFee: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 bg-emerald-50/50 border border-emerald-300 rounded-xl font-mono font-black text-emerald-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Course Visibility Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as CourseStatus })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="Active">Active (Visible on Website)</option>
                <option value="Draft">Draft (Hidden)</option>
                <option value="Inactive">Inactive</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            {/* DYNAMIC IMAGE UPLOAD, PRESETS & LIVE CARD PREVIEW SECTION */}
            <div className="md:col-span-3 lg:col-span-4 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Upload className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <label className="font-black text-slate-900 text-sm block">
                      Dynamic Course Card Media & Image Mapping (ইমেজ আপলোড ও ম্যাপিং)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Upload from computer, paste an external URL, or choose from our high-res presets.
                    </p>
                  </div>
                </div>

                {formData.thumbnailUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, thumbnailUrl: '' })}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Image</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Side: Upload & Input Controls (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Drag and Drop File Upload Area */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={handleDropFile}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 ${
                      isDraggingFile
                        ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01]'
                        : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/80'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">
                        Drag & Drop Course Image Here or <span className="text-indigo-600 underline">Browse File</span>
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Supports PNG, JPG, WEBP, SVG • Recommended 16:9 ratio (800x450px)
                      </span>
                    </div>
                  </div>

                  {/* Manual URL Input & Crop Trigger */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 text-[11px] block">Or Enter Direct Image URL / CDN Link</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={formData.thumbnailUrl}
                        onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/... or https://your-cdn.com/banner.jpg"
                        className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCropTarget('form');
                          setIsCropModalOpen(true);
                        }}
                        className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl flex items-center space-x-1 shrink-0"
                      >
                        <Crop className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Crop & Resize</span>
                      </button>
                    </div>
                  </div>

                  {/* Curated Preset Library */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Curated High-Res Category Presets:</span>
                      </span>
                      {/* Category Filter Chips for presets */}
                      <div className="flex items-center space-x-1 overflow-x-auto pb-1 max-w-[280px] scrollbar-none">
                        {presetCategories.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setPresetFilterCategory(cat)}
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold whitespace-nowrap transition-colors ${
                              presetFilterCategory === cat
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-white rounded-2xl border border-slate-200">
                      {filteredPresets.map((preset, pIdx) => {
                        const isSelected = formData.thumbnailUrl === preset.url;
                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setFormData({ ...formData, thumbnailUrl: preset.url })}
                            className={`relative group rounded-xl overflow-hidden border text-left transition-all ${
                              isSelected
                                ? 'border-indigo-600 ring-2 ring-indigo-500 shadow-md'
                                : 'border-slate-200 hover:border-indigo-300'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-14 object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="p-1.5 bg-slate-900/90 text-white">
                              <span className="block text-[9px] font-bold truncate">{preset.label}</span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xs">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Side: Live Public Website Card Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Live Public Card Preview</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      ✓ Real-time Sync
                    </span>
                  </div>

                  {/* Public Card Mockup */}
                  <div className="bg-white rounded-3xl border border-indigo-200 shadow-md overflow-hidden flex flex-col">
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      {formData.thumbnailUrl ? (
                        <img
                          src={formData.thumbnailUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4">
                          <ImageIcon className="w-8 h-8 mb-1" />
                          <span className="text-[10px] font-bold">No Image Selected</span>
                        </div>
                      )}
                      <div className="absolute top-2.5 right-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-xs ${
                          formData.courseType === 'Offline'
                            ? 'bg-emerald-600'
                            : formData.courseType === 'Online'
                            ? 'bg-rose-600'
                            : 'bg-purple-600'
                        }`}>
                          {formData.courseType}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-pink-50 border border-pink-200 text-pink-700 font-mono font-bold text-[10px]">
                          {formData.badgeText || formData.code || 'UITB-VE-109'}
                        </span>
                        <span className="text-[10px] font-bold text-amber-500 flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{formData.rating || 4.9} ({formData.reviewsCount || 431} reviews)</span>
                        </span>
                      </div>

                      <h4 className="font-black text-slate-900 text-xs leading-snug line-clamp-2">
                        {formData.name || 'Course Full Title'}
                      </h4>

                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-base font-black text-indigo-700">
                          ৳{(formData.offerFee || formData.regularFee || 0).toLocaleString()}
                        </span>
                        {formData.regularFee > (formData.offerFee || 0) && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ৳{formData.regularFee.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* 4 Metrics Preview */}
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-1 text-[10px]">
                        <div>
                          <span className="text-slate-400 block text-[9px]">Class</span>
                          <span className="font-bold text-slate-700">{formData.totalClasses || 40} Classes</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">Duration</span>
                          <span className="font-bold text-slate-700">{formData.duration || '3.5 Months'}</span>
                        </div>
                        <div className="pt-1 border-t border-slate-200">
                          <span className="text-slate-400 block text-[9px]">Projects</span>
                          <span className="font-bold text-indigo-700">{formData.projectsCount || 10} Real Projects</span>
                        </div>
                        <div className="pt-1 border-t border-slate-200">
                          <span className="text-slate-400 block text-[9px]">Joined</span>
                          <span className="font-bold text-emerald-700">{formData.studentsJoined || 450}+ Students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 lg:col-span-4">
              <label className="font-bold text-slate-700 block mb-1">Course Overview & Learning Objectives *</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive career development course tailored for the current IT and freelancing market..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Highlights & Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Curriculum Highlights */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <label className="font-bold text-slate-800 text-xs block">Key Program Highlights</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={e => setHighlightInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddHighlight(); } }}
                  placeholder="e.g. 100% Practical Lab Training"
                  className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-3 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.curriculumHighlights.map((hl, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1"
                  >
                    <span>✓ {hl}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="text-slate-400 hover:text-rose-600 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Learning Features */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <label className="font-bold text-slate-800 text-xs block">Learning Features & Prerequisites</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={e => setFeatureInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                  placeholder="e.g. Basic Computer Knowledge"
                  className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.learningFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1"
                  >
                    <span>• {feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-rose-600 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Syllabus Modules Manager */}
          <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h4 className="font-black text-indigo-950 text-xs uppercase tracking-wider">
                  Detailed Syllabus & Module Breakdown ({formData.modules.length} Modules)
                </h4>
              </div>
              <button
                type="button"
                onClick={handleAddModule}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Module</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.modules.map((mod, modIdx) => (
                <ModuleEditorItem
                  key={mod.id || `mod-${modIdx}`}
                  module={mod}
                  index={modIdx}
                  onUpdateField={(field, val) => handleUpdateModuleField(modIdx, field, val)}
                  onAddTopic={(t) => handleAddTopicToModule(modIdx, t)}
                  onRemoveTopic={(tIdx) => handleRemoveTopicFromModule(modIdx, tIdx)}
                  onDeleteModule={() => handleRemoveModule(mod.id)}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { setEditingCourse(null); setIsCreatingNew(false); }}
              className="px-5 py-2.5 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all hover:scale-[1.02]"
            >
              <Save className="w-4 h-4" />
              <span>{editingCourse ? 'Save All Course & Syllabus Changes' : 'Publish Course to Website'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Quick Image Mapping Modal */}
      {quickMappingCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Quick Image Mapping</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">{quickMappingCourse.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickMappingCourse(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Upload Drag & Drop Box */}
            <div
              onClick={() => quickFileInputRef.current?.click()}
              className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 cursor-pointer flex flex-col items-center justify-center text-center space-y-1.5 transition-colors"
            >
              <input
                ref={quickFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleQuickFileUpload}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">
                Click to Upload New Image or Drag & Drop
              </span>
              <span className="text-[10px] text-slate-400">PNG, JPG, WEBP</span>
            </div>

            {/* Image Preview & URL input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 block">Current / Chosen Image Preview</label>
              <div className="flex items-center space-x-3">
                {quickImageValue ? (
                  <img
                    src={quickImageValue}
                    alt="Preview"
                    className="w-20 h-14 object-cover rounded-xl border border-slate-200 shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-20 h-14 bg-slate-100 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-[10px]">
                    No Image
                  </div>
                )}
                <input
                  type="text"
                  value={quickImageValue}
                  onChange={e => setQuickImageValue(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    setActiveCropTarget('quick');
                    setIsCropModalOpen(true);
                  }}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl flex items-center space-x-1 shrink-0"
                  title="Crop Image"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Crop</span>
                </button>
              </div>
            </div>

            {/* Quick Presets Grid in Modal */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 block">Or Select from Instant Presets:</span>
              <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                {PRESET_COURSE_IMAGES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuickImageValue(p.url)}
                    className={`group rounded-lg overflow-hidden border text-left relative ${
                      quickImageValue === p.url ? 'border-indigo-600 ring-2 ring-indigo-500' : 'border-slate-200'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-10 object-cover" />
                    <div className="p-1 bg-slate-900/90 text-white text-[8px] font-bold truncate">
                      {p.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickMappingCourse(null)}
                className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickImageMapping}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Image Mapping</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
              All Academy Courses & Public Media Mappings ({filteredCourses.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Click "Change Photo / Map Image" or "Edit Details" to configure photos, syllabus, or pricing.
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-all"
            >
              <div className="flex items-start space-x-3.5">
                <div className="relative group shrink-0">
                  <img
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80'}
                    alt={course.name}
                    className="w-20 h-16 object-cover rounded-2xl border border-slate-200 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenQuickMapModal(course)}
                    className="absolute inset-0 bg-slate-950/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-[9px] font-bold p-1 text-center"
                    title="Quick Map Image"
                  >
                    <Upload className="w-3.5 h-3.5 mb-0.5" />
                    <span>Map Image</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-pink-50 border border-pink-200 text-pink-700 font-mono font-bold text-[10px] rounded-md">
                      {course.badgeText || course.code}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded-md">
                      {course.category}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      course.courseType === 'Offline'
                        ? 'bg-emerald-50 text-emerald-700'
                        : course.courseType === 'Online'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}>
                      {course.courseType || 'Offline'}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      course.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {course.status || 'Active'}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">
                    {course.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {course.description}
                  </p>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-600 pt-0.5 flex-wrap gap-y-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1 font-bold text-indigo-700">
                      <span>Fee: ৳{(course.offerFee || course.regularFee || 0).toLocaleString()}</span>
                      {course.regularFee && course.regularFee > (course.offerFee || 0) && (
                        <span className="line-through text-slate-400 font-normal ml-1">
                          ৳{course.regularFee.toLocaleString()}
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{course.projectsCount || 10} Projects</span>
                    <span className="text-slate-400">•</span>
                    <span>{course.studentsJoined || 450}+ Students</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenQuickMapModal(course)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1 transition-all"
                  title="Upload or change image for this course"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Map Image</span>
                </button>
                <button
                  onClick={() => handleSelectCourseToEdit(course)}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center space-x-1 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details & Syllabus</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete course "${course.name}"?`)) {
                      deleteCourse(course.id);
                      onSuccessToast(`Course "${course.name}" removed.`);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Universal Image Upload & Crop Modal for Courses */}
      <ImageUploadCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        currentImageUrl={
          activeCropTarget === 'form'
            ? formData.thumbnailUrl
            : activeCropTarget === 'quick'
            ? quickImageValue
            : ''
        }
        onSaveImage={(croppedUrl) => {
          if (activeCropTarget === 'form') {
            setFormData(prev => ({ ...prev, thumbnailUrl: croppedUrl }));
            onSuccessToast('Course thumbnail cropped & applied!');
          } else if (activeCropTarget === 'quick') {
            setQuickImageValue(croppedUrl);
            onSuccessToast('Quick image cropped!');
          }
        }}
        title="Crop & Resize Course Thumbnail"
        subtitle="Crop to 16:9 banner for high-definition course card displays on website."
        aspectRatio="16:9"
        recommendedSize="Recommended: 1280 × 720px (16:9 High Definition)"
        presetImages={PRESET_COURSE_IMAGES}
      />
    </div>
  );
};

// Module Editor Subcomponent
interface ModuleEditorItemProps {
  module: CourseModule;
  index: number;
  onUpdateField: (field: keyof CourseModule, value: any) => void;
  onAddTopic: (text: string) => void;
  onRemoveTopic: (tIdx: number) => void;
  onDeleteModule: () => void;
}

const ModuleEditorItem: React.FC<ModuleEditorItemProps> = ({
  module,
  index,
  onUpdateField,
  onAddTopic,
  onRemoveTopic,
  onDeleteModule
}) => {
  const [topicInput, setTopicInput] = useState('');

  const handleAddTopic = () => {
    if (!topicInput.trim()) return;
    onAddTopic(topicInput.trim());
    setTopicInput('');
  };

  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
            Module {index + 1} Name / Title
          </label>
          <input
            type="text"
            value={module.moduleName}
            onChange={e => onUpdateField('moduleName', e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
          />
        </div>

        <button
          type="button"
          onClick={onDeleteModule}
          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-all self-end"
          title="Delete Module"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Module Topics */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase block">
          Topics Covered ({module.topics?.length || 0})
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={topicInput}
            onChange={e => setTopicInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTopic(); } }}
            placeholder="Add topic (e.g. Redux Toolkit state slices, API async thunks)..."
            className="flex-1 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
          <button
            type="button"
            onClick={handleAddTopic}
            className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg flex items-center space-x-1"
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span>Add Topic</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {module.topics?.map((topic, tIdx) => (
            <span
              key={tIdx}
              className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium rounded-md flex items-center space-x-1"
            >
              <span>• {topic}</span>
              <button
                type="button"
                onClick={() => onRemoveTopic(tIdx)}
                className="text-slate-400 hover:text-rose-600 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
