import React from 'react';
import { Home, ChevronRight, ArrowLeft } from 'lucide-react';

interface SubPageBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs: Array<{ label: string; active?: boolean; onClick?: () => void }>;
  onBackToHome: () => void;
  actionButton?: React.ReactNode;
}

export const SubPageBanner: React.FC<SubPageBannerProps> = ({
  title,
  subtitle,
  badge,
  breadcrumbs,
  onBackToHome,
  actionButton
}) => {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white py-10 sm:py-14 border-b border-slate-800 overflow-hidden">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Top breadcrumb & quick back */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <nav className="flex items-center space-x-1.5 text-xs text-slate-300 font-medium overflow-x-auto py-1">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer text-slate-400 hover:text-indigo-300"
              title="Return to Home"
            >
              <Home className="w-3.5 h-3.5" />
              <span>হোম (Home)</span>
            </button>

            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {crumb.onClick && !crumb.active ? (
                  <button
                    type="button"
                    onClick={crumb.onClick}
                    className="hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className={`${crumb.active ? 'text-indigo-400 font-bold' : 'text-slate-300'}`}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>

          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-xs border border-white/10 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>হোমে ফিরুন (Back to Home)</span>
          </button>
        </div>

        {/* Title and subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
          <div className="space-y-2 max-w-3xl">
            {badge && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                {badge}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-normal pt-1">
                {subtitle}
              </p>
            )}
          </div>

          {actionButton && (
            <div className="shrink-0">
              {actionButton}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
