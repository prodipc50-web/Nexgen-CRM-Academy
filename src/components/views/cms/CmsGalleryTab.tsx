import React, { useState } from 'react';
import { useAcademy } from '../../../context/AcademyContext';
import { ClassroomGalleryPhoto } from '../../../types';
import {
  Image,
  PlusCircle,
  Edit2,
  Trash2,
  X,
  Tag,
  Search,
  Filter,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export const CmsGalleryTab: React.FC = () => {
  const {
    classroomGalleryPhotos,
    addClassroomGalleryPhoto,
    updateClassroomGalleryPhoto,
    deleteClassroomGalleryPhoto
  } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<ClassroomGalleryPhoto, 'id'>>({
    title: '',
    caption: '',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    category: 'Classroom & Labs',
    batchNumber: 'Batch 2026',
    date: new Date().toISOString().split('T')[0],
    sortOrder: 1,
    isActive: true
  });

  const categories = [
    'Classroom & Labs',
    'Practical Session',
    'Ceremony & Certification',
    'Workshop',
    'Campus & Facilities',
    'Student Projects'
  ];

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      caption: '',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      category: 'Classroom & Labs',
      batchNumber: 'Batch 2026',
      date: new Date().toISOString().split('T')[0],
      sortOrder: 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: ClassroomGalleryPhoto) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      caption: p.caption || '',
      imageUrl: p.imageUrl,
      category: p.category,
      batchNumber: p.batchNumber || '',
      date: p.date || new Date().toISOString().split('T')[0],
      sortOrder: p.sortOrder || 1,
      isActive: p.isActive
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      alert('Please provide a Photo Title and Image URL.');
      return;
    }

    if (editingId) {
      updateClassroomGalleryPhoto(editingId, formData);
    } else {
      addClassroomGalleryPhoto(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete photo "${title}"?`)) {
      deleteClassroomGalleryPhoto(id);
    }
  };

  const filteredPhotos = classroomGalleryPhotos.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.caption && p.caption.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filterCategory === 'ALL' || p.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 mb-1">
            <Image className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-wider">Campus Life & Labs</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">Classroom & Lab Gallery Management</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Upload high-resolution classroom lab sessions, student workstation setups, graduation ceremonies, and hands-on workshop moments.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Lab Photo</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search gallery photos by title or caption..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 font-semibold"
          >
            <option value="ALL">All Categories Filter</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPhotos.map(photo => (
          <div
            key={photo.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden group">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs">
                    {photo.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${
                      photo.isActive ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                    }`}
                  >
                    {photo.isActive ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{photo.title}</h4>
                {photo.caption && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{photo.caption}</p>
                )}
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
                  {photo.batchNumber && <span>{photo.batchNumber}</span>}
                  {photo.batchNumber && photo.date && <span>•</span>}
                  {photo.date && <span>{photo.date}</span>}
                </div>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-end space-x-1.5">
              <button
                onClick={() => openEditModal(photo)}
                className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(photo.id, photo.title)}
                className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredPhotos.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200">
            <Image className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No classroom photos found</p>
            <p className="text-xs text-slate-400 mt-1">Upload lab and campus environment pictures to build student trust.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Image className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingId ? 'Edit Gallery Photo' : 'Upload Lab / Campus Photo'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Configure image link, title, and display category</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Modern Computer Lab Practical Session"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                    Batch / Occasion
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={e => setFormData({ ...formData, batchNumber: e.target.value })}
                    placeholder="e.g. ব্যাচ ০৪ • ল্যাব ১"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Description / Caption
                </label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={e => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Detailed context about this lab class or facility..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs font-semibold pt-1">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded-sm text-emerald-600 focus:ring-emerald-500"
                />
                <span>Active & Visible in Gallery Section</span>
              </label>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition-all"
                >
                  {editingId ? 'Save Changes' : 'Publish Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
