import React, { useState, useEffect } from 'react';

interface NexgenLogoProps {
  variant?: 'full' | 'crest' | 'icon' | 'horizontal';
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  desktopSize?: number;
  showTagline?: boolean;
  customLogoUrl?: string;
  titleFontSize?: number;
  taglineFontSize?: number;
  instituteName?: string;
  tagline?: string;
  isDarkTheme?: boolean;
  titleClassName?: string;
  taglineClassName?: string;
  shape?: 'contain' | 'square' | 'wide';
}

export const NexgenLogo: React.FC<NexgenLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
  desktopSize,
  showTagline = true,
  customLogoUrl,
  titleFontSize,
  taglineFontSize,
  instituteName,
  tagline,
  isDarkTheme = false,
  titleClassName,
  taglineClassName,
  shape = 'contain'
}) => {
  const getInitialLogo = (): string => {
    const defaultFullLogo = isDarkTheme ? '/brand-logo-dark.png' : '/brand-logo.png';
    const defaultIconLogo = isDarkTheme ? '/brand-icon-dark.png' : '/brand-icon.png';
    const defaultAsset = (variant === 'crest' || variant === 'icon') ? defaultIconLogo : defaultFullLogo;

    if (customLogoUrl && customLogoUrl !== '/logo.svg' && customLogoUrl !== '/brand-logo.png' && customLogoUrl !== '/brand-logo-dark.png') {
      return customLogoUrl;
    }
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO');
        if (stored && stored !== '/brand-logo.png' && stored !== '/logo.svg' && stored !== '/brand-logo-dark.png') {
          return stored;
        }
        const storedSettings = localStorage.getItem('NEXGEN_OFFICE_ACADEMY_DB_V1_academy_settings');
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          if (parsed.customLogoUrl && parsed.customLogoUrl !== '/logo.svg' && parsed.customLogoUrl !== '/brand-logo.png' && parsed.customLogoUrl !== '/brand-logo-dark.png') {
            return parsed.customLogoUrl;
          }
        }
        const storedCms = localStorage.getItem('NEXGEN_OFFICE_ACADEMY_DB_V1_website_cms_config');
        if (storedCms) {
          const parsedCms = JSON.parse(storedCms);
          const cand = parsedCms.customLogoUrl || parsedCms.headerLogoUrl;
          if (cand && cand !== '/logo.svg' && cand !== '/brand-logo.png' && cand !== '/brand-logo-dark.png') {
            return cand;
          }
        }
      } catch (e) {
        // ignore
      }
    }
    return defaultAsset;
  };

  const [logoSrc, setLogoSrc] = useState<string>(getInitialLogo);
  const [imageError, setImageError] = useState(false);
  const [settings, setSettings] = useState<{
    instituteName: string;
    tagline: string;
    logoFontSize: number;
    taglineFontSize: number;
  }>({
    instituteName: 'Nexgen Computer Academy',
    tagline: 'Institute of Information Technology & Professional Skills',
    logoFontSize: 16,
    taglineFontSize: 11
  });

  const resolveCustomLogo = () => {
    // Determine default asset according to dark theme and variant
    const defaultFullLogo = isDarkTheme ? '/brand-logo-dark.png' : '/brand-logo.png';
    const defaultIconLogo = isDarkTheme ? '/brand-icon-dark.png' : '/brand-icon.png';
    const defaultAsset = (variant === 'crest' || variant === 'icon') ? defaultIconLogo : defaultFullLogo;

    if (customLogoUrl && customLogoUrl !== '/logo.svg' && customLogoUrl !== '/brand-logo.png' && customLogoUrl !== '/brand-logo-dark.png') {
      setLogoSrc(customLogoUrl);
      setImageError(false);
      return;
    }
    const stored = typeof window !== 'undefined' ? localStorage.getItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO') : null;
    if (stored && stored !== '/brand-logo.png' && stored !== '/logo.svg' && stored !== '/brand-logo-dark.png') {
      setLogoSrc(stored);
      setImageError(false);
      return;
    }
    try {
      const storedSettings = typeof window !== 'undefined' ? localStorage.getItem('NEXGEN_OFFICE_ACADEMY_DB_V1_academy_settings') : null;
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        if (parsed.customLogoUrl && parsed.customLogoUrl !== '/logo.svg' && parsed.customLogoUrl !== '/brand-logo.png' && parsed.customLogoUrl !== '/brand-logo-dark.png') {
          setLogoSrc(parsed.customLogoUrl);
          setImageError(false);
          return;
        }
      }
      const storedCms = typeof window !== 'undefined' ? localStorage.getItem('NEXGEN_OFFICE_ACADEMY_DB_V1_website_cms_config') : null;
      if (storedCms) {
        const parsedCms = JSON.parse(storedCms);
        const cand = parsedCms.customLogoUrl || parsedCms.headerLogoUrl;
        if (cand && cand !== '/logo.svg' && cand !== '/brand-logo.png' && cand !== '/brand-logo-dark.png') {
          setLogoSrc(cand);
          setImageError(false);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Reliable authentic brand logo with tight crop & transparent background
    setLogoSrc(defaultAsset);
    setImageError(false);
  };

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('NEXGEN_OFFICE_ACADEMY_DB_V1_academy_settings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSettings({
          instituteName: parsed.instituteName || 'Nexgen Computer Academy',
          tagline: parsed.tagline || 'Institute of Information Technology & Professional Skills',
          logoFontSize: parsed.logoFontSize || 16,
          taglineFontSize: parsed.taglineFontSize || 11
        });
      }
    } catch (e) {
      console.error(e);
    }
    resolveCustomLogo();
  }, [customLogoUrl, isDarkTheme, variant]);

  useEffect(() => {
    const handleUpdate = () => {
      resolveCustomLogo();
    };

    window.addEventListener('nexgen-logo-updated', handleUpdate);
    return () => window.removeEventListener('nexgen-logo-updated', handleUpdate);
  }, [customLogoUrl]);
  // Size mapper
  let dimension = 48;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'xs':
        dimension = 24;
        break;
      case 'sm':
        dimension = 32;
        break;
      case 'md':
        dimension = 44;
        break;
      case 'lg':
        dimension = 64;
        break;
      case 'xl':
        dimension = 96;
        break;
    }
  }

  // 1. Official Icon Mark of the Nexgen Computer Academy
  const NexgenIconMark = ({
    width = dimension,
    height = dimension,
    isDark = isDarkTheme
  }: {
    width?: number;
    height?: number;
    isDark?: boolean;
  }) => {
    const src = isDark ? '/brand-icon-dark.png' : '/brand-icon.png';
    return (
      <img
        src={src}
        alt={instituteName || 'NexGen'}
        width={width}
        height={height}
        loading="eager"
        fetchPriority="high"
        className="shrink-0 select-none drop-shadow-xs object-contain"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    );
  };

  // 2. Official Stacked / Primary Logo
  const NexgenStackedVector = ({
    width = dimension,
    isDark = isDarkTheme
  }: {
    width?: number;
    isDark?: boolean;
  }) => {
    const src = isDark ? '/brand-logo-dark.png' : '/brand-logo.png';
    return (
      <img
        src={src}
        alt={instituteName || 'NexGen Computer Academy'}
        width={width}
        loading="eager"
        fetchPriority="high"
        className="shrink-0 select-none drop-shadow-xs object-contain"
        style={{ width: `${width}px`, height: 'auto', maxHeight: `${Math.round(width * 0.4)}px` }}
      />
    );
  };

  // 3. Official Horizontal Full Logo
  const NexgenHorizontalVector = ({
    height = dimension,
    isDark = isDarkTheme
  }: {
    height?: number;
    isDark?: boolean;
  }) => {
    const src = isDark ? '/brand-logo-dark.png' : '/brand-logo.png';
    return (
      <img
        src={src}
        alt={instituteName || 'NexGen Computer Academy'}
        height={height}
        loading="eager"
        fetchPriority="high"
        className="shrink-0 select-none drop-shadow-xs object-contain"
        style={{ height: `${height}px`, width: 'auto', maxWidth: `${Math.round(height * 4.6)}px` }}
      />
    );
  };

  const effectiveMobileDim = dimension;
  const effectiveDesktopDim = desktopSize || (typeof size === 'number' ? Math.round(size * 1.15) : dimension);

  // If custom logo image is provided and valid
  const CustomImageLogo = ({
    mobileDim = effectiveMobileDim,
    desktopDim = effectiveDesktopDim,
    width,
    height
  }: {
    mobileDim?: number;
    desktopDim?: number;
    width?: number;
    height?: number;
  }) => {
    const isSquare = shape === 'square' || variant === 'crest' || variant === 'icon';
    const isWide = shape === 'wide' || variant === 'horizontal' || variant === 'full';
    const effectiveMob = width || mobileDim;
    const effectiveDesk = width || desktopDim;
    const mobMaxWidth = isSquare ? effectiveMob : isWide ? Math.round(effectiveMob * 4.6) : Math.round(effectiveMob * 4.2);
    const deskMaxWidth = isSquare ? effectiveDesk : isWide ? Math.round(effectiveDesk * 5.0) : Math.round(effectiveDesk * 4.5);
    const mobHeight = height ? Number(height) : effectiveMob;
    const deskHeight = height ? Number(height) : effectiveDesk;

    const handleImgError = () => {
      const fallback = isDarkTheme ? '/brand-logo-dark.png' : '/brand-logo.png';
      if (logoSrc !== fallback && logoSrc !== '/brand-icon.png' && logoSrc !== '/brand-icon-dark.png') {
        setLogoSrc(fallback);
      } else {
        setImageError(true);
      }
    };

    return (
      <div className="inline-flex items-center justify-center shrink-0 select-none">
        {/* Mobile View */}
        <div
          className="sm:hidden inline-flex items-center justify-center"
          style={{
            height: `${mobHeight}px`,
            maxWidth: `${mobMaxWidth}px`
          }}
        >
          <img
            src={logoSrc!}
            alt={instituteName || 'NexGen Computer Academy Logo'}
            width={mobMaxWidth}
            height={mobHeight}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={handleImgError}
            style={{
              maxHeight: `${mobHeight}px`,
              maxWidth: `${mobMaxWidth}px`
            }}
            className="w-auto h-auto max-h-full max-w-full object-contain shrink-0 filter drop-shadow-xs"
          />
        </div>

        {/* Desktop View (sm+) */}
        <div
          className="hidden sm:inline-flex items-center justify-center"
          style={{
            height: `${deskHeight}px`,
            maxWidth: `${deskMaxWidth}px`
          }}
        >
          <img
            src={logoSrc!}
            alt={instituteName || 'NexGen Computer Academy Logo'}
            width={deskMaxWidth}
            height={deskHeight}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={handleImgError}
            style={{
              maxHeight: `${deskHeight}px`,
              maxWidth: `${deskMaxWidth}px`
            }}
            className="w-auto h-auto max-h-full max-w-full object-contain shrink-0 filter drop-shadow-xs"
          />
        </div>
      </div>
    );
  };

  const hasCustomImg = !!logoSrc && !imageError;

  // Variant routing
  if (variant === 'crest' || variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        {hasCustomImg ? (
          <CustomImageLogo mobileDim={effectiveMobileDim} desktopDim={effectiveDesktopDim} />
        ) : (
          <>
            <span className="sm:hidden inline-flex items-center justify-center">
              <NexgenIconMark width={effectiveMobileDim} height={effectiveMobileDim} isDark={isDarkTheme} />
            </span>
            <span className="hidden sm:inline-flex items-center justify-center">
              <NexgenIconMark width={effectiveDesktopDim} height={effectiveDesktopDim} isDark={isDarkTheme} />
            </span>
          </>
        )}
      </div>
    );
  }

  if (variant === 'horizontal') {
    const isDark = isDarkTheme || className.includes('text-white') || className.includes('dark');

    return (
      <div className={`inline-flex items-center max-w-full ${className}`}>
        {hasCustomImg ? (
          <CustomImageLogo mobileDim={effectiveMobileDim} desktopDim={effectiveDesktopDim} />
        ) : (
          <>
            <span className="sm:hidden inline-flex items-center">
              <NexgenHorizontalVector height={effectiveMobileDim} isDark={isDark} />
            </span>
            <span className="hidden sm:inline-flex items-center">
              <NexgenHorizontalVector height={effectiveDesktopDim} isDark={isDark} />
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      {hasCustomImg ? (
        <CustomImageLogo width={dimension} height={Math.round(dimension * 0.85)} />
      ) : (
        <NexgenStackedVector width={dimension} isDark={isDarkTheme} />
      )}
    </div>
  );
};

export { NexgenLogo as default };
