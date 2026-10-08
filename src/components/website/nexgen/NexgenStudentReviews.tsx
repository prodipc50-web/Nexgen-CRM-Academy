import React from 'react';
import { Star, Quote } from 'lucide-react';
import { WebsiteReview } from '../../../types';

interface UniqueItStudentReviewsProps {
  reviews?: WebsiteReview[];
}

export const NexgenStudentReviews: React.FC<UniqueItStudentReviewsProps> = ({ reviews }) => {
  const defaultReviews = [
    {
      id: '1',
      rating: 5,
      text: 'NexGen Computer Academy taught me everything from practical lab exercises to real marketplace client projects. The mentors give lifetime support.',
      author: 'Shakil Ahmed',
      role: 'Web & UI/UX Designer - Freelancer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      rating: 5,
      text: 'NexGen Computer Academy is the best freelancing training center. Their training method is very modern and helpful. Thank you NexGen Computer Academy authorities.',
      author: 'Mahmudul Hasan',
      role: 'Graphic Designer - Fiverr, Upwork',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: '3',
      rating: 5,
      text: 'NexGen Computer Academy is one of the best computer training centers I have ever visited. I have completed computer office course from this institute. The teachers here were very friendly. Thanks NexGen Computer Academy. ❤️',
      author: 'MD Tonmoy',
      role: 'Computer Office Application - Real Estate Company',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    }
  ];

  const items =
    reviews && reviews.length > 0
      ? reviews.slice(0, 6).map((r) => ({
          id: r.id,
          rating: r.rating || 5,
          text: r.reviewText || (r as any).comment || '',
          author: r.studentName,
          role: r.workplaceOrRole || r.earningsOrSuccess || r.courseName || 'NexGen Graduate',
          avatar:
            r.studentPhoto ||
            (r as any).avatarUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        }))
      : defaultReviews;

  return (
    <section className="py-16 sm:py-20 bg-[#faf8ff] border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#dc143c]">
            What Students Say
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Student Reviews
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Genuine feedback from our learning community.
          </p>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* Quote Icon */}
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Quote className="w-4 h-4 fill-purple-600" />
                  </div>

                  {/* 5 Stars */}
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic">
                  "{rev.text}"
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="w-10 h-10 aspect-square shrink-0 rounded-full object-cover border border-purple-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                  }}
                />
                <div>
                  <h5 className="font-black text-slate-900 text-xs sm:text-sm">{rev.author}</h5>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { NexgenStudentReviews as UniqueItStudentReviews };
