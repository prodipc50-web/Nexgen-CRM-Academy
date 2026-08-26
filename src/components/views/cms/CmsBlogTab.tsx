import React, { useState, useRef } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { WebsiteBlogPost } from '../../../types';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Save,
  Clock,
  Calendar,
  User,
  Tag,
  Search,
  Eye,
  CheckCircle2,
  Sparkles,
  Crop,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { ImageUploadCropModal, ImagePresetItem } from '../../common/ImageUploadCropModal';

interface CmsBlogTabProps {
  onSuccessToast: (msg: string) => void;
}

const BLOG_COVER_PRESETS: ImagePresetItem[] = [
  { label: 'Modern Web Development & Code', category: 'Web & Software', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' },
  { label: 'AI & Machine Learning Concepts', category: 'AI & Data', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cyber Security & Network Defense', category: 'Cyber Security', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80' },
  { label: 'UI/UX Design Studio & Prototyping', category: 'Design & Creative', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Freelance Workspace & Laptop Setup', category: 'Career & Tech', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Coding Student Collaboration', category: 'Student Spotlight', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80' }
];

export const CmsBlogTab: React.FC<CmsBlogTabProps> = ({ onSuccessToast }) => {
  const {
    websiteBlogs,
    addWebsiteBlog,
    updateWebsiteBlog,
    deleteWebsiteBlog
  } = useAcademy();

  const [editingBlog, setEditingBlog] = useState<WebsiteBlogPost | null>(null);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Image Upload and Crop State
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [activeCropTarget, setActiveCropTarget] = useState<'form' | { id: string }>('form');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Career & Tech',
    summary: '',
    content: '',
    coverImage: '',
    authorName: 'NexGen Academic Editorial',
    authorRole: 'Tech Mentorship Desk',
    readTime: '4 min read',
    publishedDate: new Date().toISOString().split('T')[0],
    isPublished: true,
    tags: ['Tech Career', 'Software Skills']
  });

  const [tagInput, setTagInput] = useState('');

  const handleStartAdd = () => {
    setEditingBlog(null);
    setIsAddingBlog(true);
    setFormData({
      title: '',
      slug: '',
      category: 'Career & Tech',
      summary: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      authorName: 'NexGen Academic Editorial',
      authorRole: 'Tech Mentorship Desk',
      readTime: '4 min read',
      publishedDate: new Date().toISOString().split('T')[0],
      isPublished: true,
      tags: ['Tech Career', 'Software Skills']
    });
  };

  const handleStartEdit = (blog: WebsiteBlogPost) => {
    setEditingBlog(blog);
    setIsAddingBlog(false);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      summary: blog.summary,
      content: blog.content,
      coverImage: blog.coverImage || '',
      authorName: blog.authorName || 'NexGen Editorial',
      authorRole: blog.authorRole || 'Faculty Mentor',
      readTime: blog.readTime,
      publishedDate: blog.publishedDate,
      isPublished: blog.isPublished ?? true,
      tags: blog.tags || []
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData(prev => ({ ...prev, coverImage: dataUrl }));
      onSuccessToast('Cover image uploaded! You can now adjust or crop.');
    };
    reader.readAsDataURL(file);
  };

  const handleOpenCropForForm = () => {
    setActiveCropTarget('form');
    setIsCropModalOpen(true);
  };

  const handleOpenCropForBlog = (blog: WebsiteBlogPost) => {
    setActiveCropTarget({ id: blog.id });
    setFormData({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      summary: blog.summary,
      content: blog.content,
      coverImage: blog.coverImage || '',
      authorName: blog.authorName || 'NexGen Editorial',
      authorRole: blog.authorRole || 'Faculty Mentor',
      readTime: blog.readTime,
      publishedDate: blog.publishedDate,
      isPublished: blog.isPublished ?? true,
      tags: blog.tags || []
    });
    setIsCropModalOpen(true);
  };

  const handleSaveCroppedImage = (croppedDataUrl: string) => {
    if (activeCropTarget === 'form') {
      setFormData(prev => ({ ...prev, coverImage: croppedDataUrl }));
      onSuccessToast('Blog cover photo cropped & updated in form!');
    } else {
      updateWebsiteBlog(activeCropTarget.id, { coverImage: croppedDataUrl });
      onSuccessToast('Blog cover image updated on live article!');
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    }));
    setTagInput('');
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingBlog) {
      updateWebsiteBlog(editingBlog.id, {
        ...formData,
        slug
      });
      onSuccessToast(`Blog post "${formData.title}" updated successfully!`);
    } else {
      addWebsiteBlog({
        ...formData,
        slug
      });
      onSuccessToast(`New blog post published to website!`);
    }

    setEditingBlog(null);
    setIsAddingBlog(false);
  };

  const filteredBlogs = (websiteBlogs || []).filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.authorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5 rounded-3xl border border-indigo-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              Tech Blog & Industry Articles (ব্লগ ও ক্যারিয়ার গাইড)
            </h4>
            <p className="text-xs text-indigo-200">
              Publish rich IT guides, tech career strategies, and upload custom 16:9 cropped banner imagery.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Editor Modal/Box */}
      {(isAddingBlog || editingBlog) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border-2 border-indigo-200 shadow-xl space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span className="font-black text-sm uppercase text-slate-800">
                {isAddingBlog ? 'Draft & Publish New Blog Article' : `Editing: ${editingBlog?.title}`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAddingBlog(false);
                setEditingBlog(null);
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1 bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Article Headline / Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. How to Transition from Absolute Beginner to Junior Web Developer in 6 Months"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                <option value="Career & Tech">Career & Tech</option>
                <option value="Web & Software">Web & Software</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Student Spotlight">Student Spotlight</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Author Name</label>
              <input
                type="text"
                value={formData.authorName}
                onChange={e => setFormData({ ...formData, authorName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Estimated Read Time</label>
              <input
                type="text"
                value={formData.readTime}
                onChange={e => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="e.g. 5 min read"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Publication Date</label>
              <input
                type="date"
                value={formData.publishedDate}
                onChange={e => setFormData({ ...formData, publishedDate: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            {/* Cover Image Upload & Crop Integration */}
            <div className="md:col-span-3 space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="font-bold text-slate-800 block">Featured Cover Banner (16:9 Widescreen)</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-28 h-18 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 relative shrink-0">
                  {formData.coverImage ? (
                    <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-[11px]"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Upload Local Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenCropForForm}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl flex items-center space-x-1.5"
                    >
                      <Crop className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Crop & Frame (16:9)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenCropForForm}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs rounded-xl flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Browse Tech Presets</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Short Summary / Card Hook *</label>
              <textarea
                rows={2}
                required
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Brief 1-2 sentence hook displayed on blog card previews..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium leading-relaxed"
              />
            </div>

            <div className="md:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Full Article Body Content *</label>
              <textarea
                rows={8}
                required
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write full formatted article content with actionable career steps..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium leading-relaxed font-mono text-xs"
              />
            </div>

            {/* Tags Management */}
            <div className="md:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Article Tags / Keywords</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="e.g. JavaScript, Career, Placement..."
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={`tag-${idx}-${tag}`}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-[11px]"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="hover:text-rose-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsAddingBlog(false);
                setEditingBlog(null);
              }}
              className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 active:scale-95 transition-transform"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingBlog ? 'Update Article' : 'Publish Article to Website'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Search & List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search published articles..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            {filteredBlogs.length} Articles Total
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredBlogs.map(blog => (
            <div
              key={blog.id}
              className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-24 h-16 rounded-xl bg-slate-900 border border-slate-200 overflow-hidden shrink-0 relative group">
                  <img
                    src={blog.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80'}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenCropForBlog(blog)}
                    className="absolute inset-0 bg-slate-950/70 text-white font-bold text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Crop className="w-3 h-3 mr-1" />
                    Crop
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      {blog.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{blog.readTime}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">• {blog.publishedDate}</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-xs">
                    {blog.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {blog.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenCropForBlog(blog)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1"
                  title="Crop Cover Image"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Crop Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStartEdit(blog)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete article "${blog.title}"?`)) {
                      deleteWebsiteBlog(blog.id);
                      onSuccessToast('Article removed from website.');
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Delete Article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Universal Image Upload & Crop Modal */}
      <ImageUploadCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        currentImageUrl={activeCropTarget === 'form' ? formData.coverImage : (websiteBlogs.find(b => b.id === (activeCropTarget as any).id)?.coverImage || formData.coverImage)}
        onSaveImage={handleSaveCroppedImage}
        title="Crop & Resize Blog Article Cover"
        subtitle="Frame the banner image in 16:9 widescreen HD for high impact readability."
        aspectRatio="16:9"
        recommendedSize="Recommended: 1200 × 675px (16:9 Widescreen)"
        presetImages={BLOG_COVER_PRESETS}
      />
    </div>
  );
};
