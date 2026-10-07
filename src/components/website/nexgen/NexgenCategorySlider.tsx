import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Palette,
  Briefcase,
  Bot,
  Video,
  Layout,
  TrendingUp,
  Film,
  FileSpreadsheet,
  Monitor,
  Compass
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  icon: any;
  colorScheme: 'orange' | 'purple';
}

interface NexgenCategorySliderProps {
  onSelectCategory?: (category: string) => void;
}

export const NexgenCategorySlider: React.FC<NexgenCategorySliderProps> = ({ onSelectCategory }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories: CategoryItem[] = [
    { id: '1', name: 'Best Updated', icon: Flame, colorScheme: 'orange' },
    { id: '2', name: 'Graphic Design', icon: Palette, colorScheme: 'purple' },
    { id: '3', name: 'Freelancing & outsourcing', icon: Briefcase, colorScheme: 'orange' },
    { id: '4', name: 'Artificial intelligence (ai)', icon: Bot, colorScheme: 'purple' },
    { id: '5', name: 'Motion Graphics', icon: Video, colorScheme: 'orange' },
    { id: '6', name: 'UI/UX Design', icon: Layout, colorScheme: 'purple' },
    { id: '7', name: 'Digital Marketing', icon: TrendingUp, colorScheme: 'orange' },
    { id: '8', name: 'Video editing', icon: Film, colorScheme: 'purple' },
    { id: '9', name: 'Excel & Data analysis', icon: FileSpreadsheet, colorScheme: 'orange' },
    { id: '10', name: 'Basic Computer Course', icon: Monitor, colorScheme: 'purple' },
    { id: '11', name: 'AutoCAD (2D)', icon: Compass, colorScheme: 'orange' }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 bg-white border-b border-slate-100 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative">
        <div className="flex items-center justify-between">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-9 h-9 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px] rounded-full border border-orange-400 text-orange-500 hover:bg-orange-50 flex items-center justify-center transition-colors cursor-pointer shrink-0 z-10 mr-2 active:scale-90"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Categories Carousel */}
          <div
            ref={scrollContainerRef}
            className="flex items-center space-x-3 overflow-x-auto no-scrollbar scroll-smooth py-2 flex-1"
          >
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isOrange = cat.colorScheme === 'orange';
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                  className="flex flex-col items-center justify-center p-3 min-w-[130px] sm:min-w-[145px] rounded-2xl bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group shrink-0 active:scale-95"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${
                      isOrange
                        ? 'bg-orange-50 text-orange-500 border border-orange-200/60'
                        : 'bg-purple-50 text-purple-600 border border-purple-200/60'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 text-center leading-tight group-hover:text-purple-700 transition-colors line-clamp-2">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-9 h-9 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px] rounded-full border border-orange-400 text-orange-500 hover:bg-orange-50 flex items-center justify-center transition-colors cursor-pointer shrink-0 z-10 ml-2 active:scale-90"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
