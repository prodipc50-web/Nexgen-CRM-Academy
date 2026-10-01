import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Filter,
  Eye,
  X,
  Maximize2
} from 'lucide-react';
import { WebsiteGalleryItem } from '../../../types';
import { SubPageBanner } from './SubPageBanner';

interface GallerySubPageProps {
  galleryItems: WebsiteGalleryItem[];
  instituteName?: string;
  onBackToHome: () => void;
}

export const GallerySubPage: React.FC<GallerySubPageProps> = ({
  galleryItems = [],
  instituteName = 'Unique IT Institute',
  onBackToHome
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<WebsiteGalleryItem | null>(null);

  const categories = ['All', 'Classroom & Labs', 'Certification Ceremony', 'Workshops & Events', 'Success Stories'];

  const filteredItems = galleryItems.filter(item => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SubPageBanner
        title={`Life at ${instituteName} - Photo Gallery`}
        subtitle="আমাদের আধুনিক এসি কম্পিউটার ল্যাব, ক্লাস সেশন, প্রজেক্ট শোকেস ও সার্টিফিকেট বিতরণী অনুষ্ঠানের স্মরণীয় মুহূর্তসমূহ।"
        badge="ক্যাম্পাস ফটো গ্যালারি"
        breadcrumbs={[{ label: 'গ্যালারি (Photo Gallery)', active: true }]}
        onBackToHome={onBackToHome}
        actionButton={
          <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-400/30">
            {galleryItems.length}টি ফটো
          </span>
        }
      />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 space-y-8">
        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">এই ক্যাটাগরিতে কোনো ছবি পাওয়া যায়নি।</h3>
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              সব ছবি দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
              >
                <div className="h-64 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-bold rounded-full border border-slate-200 shadow-xs">
                    {item.category}
                  </span>

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-xs text-slate-500 line-clamp-2">{item.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[75vh] bg-slate-950 flex items-center justify-center p-2">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-lg"
              />
            </div>

            <div className="p-5 flex items-center justify-between text-slate-900 bg-white border-t border-slate-200">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedImage.category}
                </span>
                <h4 className="font-bold text-base text-slate-900 mt-1">{selectedImage.title}</h4>
                {selectedImage.caption && (
                  <p className="text-xs text-slate-500 mt-0.5">{selectedImage.caption}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
