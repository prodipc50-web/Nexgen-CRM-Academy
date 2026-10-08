import React, { useState, useEffect, useRef } from 'react';

export interface OptimizedLazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string; // e.g. "16/9", "16/10", "4/3", "1/1"
  containerClassName?: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean; // If true, loads immediately (for above-the-fold / LCP elements)
  rootMargin?: string; // Intersection observer trigger margin (default: "200px 0px")
  threshold?: number;
  showSkeleton?: boolean;
  skeletonClassName?: string;
  onImageLoad?: () => void;
}

/**
 * Production-ready Intersection Observer based Lazy Image component.
 * - Drastically improves LCP by preventing below-the-fold images from saturating the network pipeline.
 * - Completely eliminates Cumulative Layout Shift (CLS) by preserving pre-defined aspect-ratio and dimensions.
 * - Displays a subtle shimmer skeleton placeholder until image bytes arrive.
 * - Smoothly fades in once loaded without any visual jank.
 */
export const OptimizedLazyImage: React.FC<OptimizedLazyImageProps> = ({
  src,
  alt,
  width,
  height,
  aspectRatio,
  containerClassName = '',
  className = '',
  fallbackSrc,
  priority = false,
  rootMargin = '200px 0px',
  threshold = 0.01,
  showSkeleton = true,
  skeletonClassName = '',
  onError,
  onImageLoad,
  ...restProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState<boolean>(() => priority || typeof window === 'undefined');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  // Update src if prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Setup Intersection Observer
  useEffect(() => {
    if (priority || isInView) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      setIsInView(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [priority, isInView, rootMargin, threshold]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onImageLoad) {
      onImageLoad();
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    } else {
      setHasError(true);
      if (onError) {
        onError(e);
      }
    }
  };

  // Compute container style for aspect ratio if provided
  const containerStyle: React.CSSProperties = {
    ...(aspectRatio ? { aspectRatio } : {})
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={`relative overflow-hidden select-none ${containerClassName}`}
    >
      {/* Shimmer Skeleton Placeholder while loading */}
      {showSkeleton && !isLoaded && (
        <div
          className={`absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center pointer-events-none z-0 ${skeletonClassName}`}
          aria-hidden="true"
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      )}

      {/* Actual Image rendered only once intersected or priority */}
      {isInView && (
        <img
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...restProps}
        />
      )}
    </div>
  );
};
