import React from 'react';
import { Users, Code, Compass, Video, ShieldCheck, Sparkles } from 'lucide-react';
import { ExclusiveSolutionsCmsConfig } from '../../../types';

interface UniqueItExclusiveSolutionsProps {
  config?: ExclusiveSolutionsCmsConfig;
}

export const UniqueItExclusiveSolutions: React.FC<UniqueItExclusiveSolutionsProps> = ({ config }) => {
  const defaultCards = [
    {
      id: '1',
      title: 'Community Support',
      desc: 'Join an active learner community where you can collaborate, ask questions, and grow together, guided by shared goals and mutual support.',
      icon: Users,
      color: 'text-amber-500 bg-amber-50'
    },
    {
      id: '2',
      title: 'Real Projects',
      desc: 'Work on real-world projects that build your confidence and strengthen your portfolio, preparing you for real industry challenges.',
      icon: Code,
      color: 'text-rose-500 bg-rose-50'
    },
    {
      id: '3',
      title: 'Career Guidance',
      desc: 'Get professional career guidance, roadmap planning, and industry insights from experts, so you always know your next best move.',
      icon: Compass,
      color: 'text-orange-500 bg-orange-50'
    },
    {
      id: '4',
      title: 'Class Videos',
      desc: 'Missed a class? No worries. All sessions are recorded so you can learn anytime, anywhere, at your own pace without falling behind.',
      icon: Video,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: '5',
      title: 'Lifetime Support',
      desc: 'We provide lifelong support even after course completion so you never feel stuck in your career journey, long after the classroom ends.',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-50'
    }
  ];

  const heading = config?.heading || 'Exclusive Solutions that Set Us Apart';
  const description =
    config?.description ||
    'Our aim is to make your learning experience the best possible by providing you with additional facilities that will help you to grow without bounds.';

  const colorStyles = [
    'text-amber-500 bg-amber-50',
    'text-rose-500 bg-rose-50',
    'text-orange-500 bg-orange-50',
    'text-purple-600 bg-purple-50',
    'text-emerald-500 bg-emerald-50'
  ];

  const cards =
    config?.items && config.items.length > 0
      ? config.items.map((it, idx) => ({
          id: it.id || `ex-${idx}`,
          title: it.title,
          desc: it.desc,
          icon: [Users, Code, Compass, Video, ShieldCheck][idx % 5] || Sparkles,
          color: colorStyles[idx % colorStyles.length]
        }))
      : defaultCards;

  return (
    <section className="py-16 sm:py-20 bg-[#0c0d1e] text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            {heading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            {description}
          </p>
        </div>

        {/* Cards Row */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(cards.length, 5)} gap-4`}>
          {cards.map((c) => {
            const IconComp = c.icon;
            return (
              <div
                key={c.id}
                className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-lg hover:-translate-y-1 transition-transform"
              >
                <div className="space-y-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                    {c.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
