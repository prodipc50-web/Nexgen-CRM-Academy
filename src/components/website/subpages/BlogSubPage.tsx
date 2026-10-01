import React, { useState } from 'react';
import {
  FileText,
  Clock,
  ArrowRight,
  Search,
  X
} from 'lucide-react';
import { WebsiteBlogPost } from '../../../types';
import { SubPageBanner } from './SubPageBanner';

interface BlogSubPageProps {
  blogs: WebsiteBlogPost[];
  onSelectBlog: (blog: WebsiteBlogPost) => void;
  onBackToHome: () => void;
}

export const BlogSubPage: React.FC<BlogSubPageProps> = ({
  blogs = [],
  onSelectBlog,
  onBackToHome
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const blogCategories = ['All', 'Career & Tech', 'Web & Software', 'AI & Machine Learning', 'Cyber Security', 'Student Spotlight'];

  const filteredBlogs = blogs.filter(b => {
    if (b.isPublished === false) return false;
    if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchSummary = (b.summary || '').toLowerCase().includes(q);
      const matchCat = (b.category || '').toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SubPageBanner
        title="Tech Blog & Career Roadmap Articles (ব্লগ)"
        subtitle="এক্সপার্ট টিউটোরিয়াল, ফ্রিল্যান্সিং ইন্টারভিউ টেকনিক এবং সফল ক্যারিয়ার গড়ার প্রয়োজনীয় গাইডলাইন পড়ুন।"
        badge="টেক আর্টিকেল ও গাইডলাইন"
        breadcrumbs={[{ label: 'ব্লগ ও ক্যারিয়ার আর্টিকেল (Blog)', active: true }]}
        onBackToHome={onBackToHome}
        actionButton={
          <span className="px-3 py-1 rounded-xl bg-white/10 text-white font-mono text-xs font-bold border border-white/10">
            Total Articles: {blogs.length}
          </span>
        }
      />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 space-y-8">
        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {blogCategories.map((bCat) => (
              <button
                key={bCat}
                type="button"
                onClick={() => setSelectedCategory(bCat)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === bCat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {bCat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-auto sm:min-w-[260px]">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 text-xs px-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">কোনো ব্লগ আর্টিকেল পাওয়া যায়নি।</h3>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              সব আর্টিকেল দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => onSelectBlog(blog)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col cursor-pointer group"
              >
                <div className="h-52 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={blog.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-indigo-600/90 backdrop-blur-xs text-white text-[10px] font-black rounded-lg uppercase shadow-xs">
                    {blog.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                      <span>{blog.publishedDate}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{blog.readTime || '5 min read'}</span>
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {blog.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">By {blog.authorName}</span>
                    <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
