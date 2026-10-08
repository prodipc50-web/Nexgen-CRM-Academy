import React, { useState } from 'react';
import { Play, Sparkles, X } from 'lucide-react';
import { StudentSuccessStory } from '../../../types';

interface UniqueItSuccessStoriesProps {
  stories?: StudentSuccessStory[];
  onViewAllStories?: () => void;
}

export const NexgenSuccessStories: React.FC<UniqueItSuccessStoriesProps> = ({
  stories,
  onViewAllStories
}) => {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const defaultStories = [
    {
      id: '1',
      title: 'Office Professional Student Story',
      role: 'Computer Operator',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '2',
      title: 'Success Story of Web Designer',
      role: 'Software Dev',
      thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '3',
      title: 'Top-Rated Freelancer Story',
      role: 'UI/UX & Brand Identity Designer',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '4',
      title: 'Digital Marketing Specialist Story',
      role: 'Agency SEO & Media Buyer',
      thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  const items = stories && stories.length > 0
    ? stories.slice(0, 4).map((s, idx) => ({
        id: s.id || `story-${idx}`,
        title: s.studentName ? `${s.studentName}'s Journey` : defaultStories[idx % defaultStories.length].title,
        role: s.companyOrPlatform || s.courseName || defaultStories[idx % defaultStories.length].role,
        thumbnail: s.videoThumbnailUrl || s.avatarUrl || defaultStories[idx % defaultStories.length].thumbnail,
        videoUrl: s.videoEmbedUrl || defaultStories[idx % defaultStories.length].videoUrl
      }))
    : defaultStories;

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#dc143c]">
            Real Results
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Success Stories
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Hear directly from students who transformed their careers with us.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveVideoUrl(item.videoUrl)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-xl hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  width={400}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Play Button */}
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/95 group-hover:bg-[#dc2626] text-[#dc2626] group-hover:text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Title & Role */}
              <div className="p-4 bg-white text-left space-y-0.5">
                <h4 className="font-black text-slate-900 text-xs sm:text-sm group-hover:text-[#dc143c] transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-bold truncate">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden max-w-3xl w-full relative shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors z-10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={`${activeVideoUrl}?autoplay=1`}
                title="Student Success Story"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export { NexgenSuccessStories as UniqueItSuccessStories };
