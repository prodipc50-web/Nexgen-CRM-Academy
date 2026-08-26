import React from 'react';
import { WebsiteBlogPost } from '../../types';
import { X, Clock, Calendar, User, Tag, Share2, ArrowLeft } from 'lucide-react';

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: WebsiteBlogPost | null;
}

export const BlogPostModal: React.FC<BlogPostModalProps> = ({ isOpen, onClose, blog }) => {
  if (!isOpen || !blog) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Cover Image Header */}
        <div className="relative h-64 sm:h-80 bg-slate-900 overflow-hidden">
          <img
            src={blog.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'}
            alt={blog.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Pill */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-lg uppercase tracking-wider">
              {blog.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-3 border-b border-slate-100">
            <span className="flex items-center space-x-1.5 font-bold text-slate-700">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>{blog.authorName || 'Editorial Team'}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{blog.publishedDate}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{blog.readTime || '5 min read'}</span>
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {blog.title}
          </h2>

          {/* Excerpt / Summary */}
          {blog.summary && (
            <div className="p-4 bg-indigo-50/60 border-l-4 border-indigo-600 rounded-r-2xl">
              <p className="text-xs sm:text-sm font-semibold text-indigo-950 leading-relaxed italic">
                "{blog.summary}"
              </p>
            </div>
          )}

          {/* Full Article Content */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line font-normal">
            {blog.content}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tags:</span>
              </span>
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: blog.title, text: blog.summary, url: window.location.href });
              } else {
                navigator.clipboard?.writeText(window.location.href);
                alert('Article link copied to clipboard!');
              }
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Article</span>
          </button>
        </div>
      </div>
    </div>
  );
};
