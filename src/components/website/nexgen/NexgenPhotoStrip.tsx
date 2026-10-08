import React from 'react';
import { WebsiteGalleryItem } from '../../../types';

interface UniqueItPhotoStripProps {
  galleryItems?: WebsiteGalleryItem[];
}

export const NexgenPhotoStrip: React.FC<UniqueItPhotoStripProps> = ({ galleryItems }) => {
  const defaultPhotos = [
    {
      id: '1',
      title: 'Lab Session',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      title: 'Classroom Coding',
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: '3',
      title: 'Workshop Batch',
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const photos =
    galleryItems && galleryItems.length > 0
      ? galleryItems.slice(0, 3).map((g) => ({
          id: g.id,
          title: g.title,
          url: g.imageUrl
        }))
      : defaultPhotos;

  return (
    <section className="py-6 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {photos.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden shadow-2xs border border-slate-200 aspect-[16/10] bg-slate-100 group"
            >
              <img
                src={item.url}
                alt={item.title}
                width={480}
                height={300}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { NexgenPhotoStrip as UniqueItPhotoStrip };
