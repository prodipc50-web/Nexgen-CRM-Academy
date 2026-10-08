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
  const [logoSrc, setLogoSrc] = useState<string | null>(customLogoUrl || null);
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
    if (customLogoUrl && customLogoUrl !== '/logo.svg') {
      setLogoSrc(customLogoUrl);
      setImageError(false);
      return;
    }
    const stored = typeof window !== 'undefined' ? localStorage.getItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO') : null;
    if (stored) {
      setLogoSrc(stored);
      setImageError(false);
      return;
    }
    try {
      const storedSettings = typeof window !== 'undefined' ? localStorage.getItem('NEXGEN_OFFICE_ACADEMY_DB_V1_academy_settings') : null;
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        if (parsed.customLogoUrl && parsed.customLogoUrl !== '/logo.svg') {
          setLogoSrc(parsed.customLogoUrl);
          setImageError(false);
          return;
        }
      }
      const storedCms = typeof window !== 'undefined' ? localStorage.getItem('NEXGEN_OFFICE_ACADEMY_DB_V1_website_cms_config') : null;
      if (storedCms) {
        const parsedCms = JSON.parse(storedCms);
        const cand = parsedCms.customLogoUrl || parsedCms.headerLogoUrl;
        if (cand && cand !== '/logo.svg') {
          setLogoSrc(cand);
          setImageError(false);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Reliable default brand logo across all mobile & desktop browsers
    setLogoSrc('/brand-logo.png');
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
  }, [customLogoUrl]);

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

  // 1. Official Vector Icon Mark of the Nexgen Computer Academy (03-icon-only / 11-app-icon)
  const NexgenIconMark = ({
    width = dimension,
    height = dimension,
    isDark = isDarkTheme
  }: {
    width?: number;
    height?: number;
    isDark?: boolean;
  }) => {
    const redColor = '#D81D2A';
    const pebbleFill = isDark ? '#FFFFFF' : '#032B5F';
    const nFill = isDark ? '#032B5F' : '#FFFFFF';

    return (
      <svg
        viewBox="0 0 100 100"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none drop-shadow-xs"
      >
        {/* Red Swoosh Accent (Bottom-Right) */}
        <path
          d="M44 85 C62 85 84 75 89 60 C92 51 87 42 80 34 C82 44 80 54 73 63 C65 74 53 80 41 83 C38 84 39 85 44 85 Z"
          fill={redColor}
        />

        {/* Main Pebble Body */}
        <path
          d="M35 15 C53 15 75 25 82 41 C88 54 82 70 70 80 C58 89 38 88 25 78 C13 67 12 48 19 33 C24 23 29 15 35 15 Z"
          fill={pebbleFill}
        />

        {/* Stylized 'N' Mark Inside */}
        <rect x="31" y="32" width="9" height="32" rx="4.5" fill={nFill} />
        <path
          d="M36 50 C40 42 47 33 57 30 C66 27 74 31 77 39 C80 47 77 56 68 64 C60 71 49 74 39 71 L39 62 C46 64 53 62 59 56 C65 50 67 44 65 40 C63 36 57 35 51 38 C45 41 40 46 36 51 Z"
          fill={nFill}
        />
      </svg>
    );
  };

  // 2. Official Stacked Logo (01-primary-stacked & 05-dark-stacked)
  const NexgenStackedVector = ({
    width = dimension,
    isDark = isDarkTheme
  }: {
    width?: number;
    isDark?: boolean;
  }) => {
    const primaryColor = isDark ? '#FFFFFF' : '#032B5F';
    const redColor = '#D81D2A';
    const pebbleFill = isDark ? '#FFFFFF' : '#032B5F';
    const nFill = isDark ? '#032B5F' : '#FFFFFF';
    const calcHeight = Math.round(width * 0.75);

    return (
      <svg
        viewBox="0 0 280 210"
        width={width}
        height={calcHeight}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none drop-shadow-xs"
      >
        {/* Centered Icon Mark */}
        <g transform="translate(96, 10) scale(0.88)">
          <path d="M44 85 C62 85 84 75 89 60 C92 51 87 42 80 34 C82 44 80 54 73 63 C65 74 53 80 41 83 C38 84 39 85 44 85 Z" fill={redColor} />
          <path d="M35 15 C53 15 75 25 82 41 C88 54 82 70 70 80 C58 89 38 88 25 78 C13 67 12 48 19 33 C24 23 29 15 35 15 Z" fill={pebbleFill} />
          <rect x="31" y="32" width="9" height="32" rx="4.5" fill={nFill} />
          <path d="M36 50 C40 42 47 33 57 30 C66 27 74 31 77 39 C80 47 77 56 68 64 C60 71 49 74 39 71 L39 62 C46 64 53 62 59 56 C65 50 67 44 65 40 C63 36 57 35 51 38 C45 41 40 46 36 51 Z" fill={nFill} />
        </g>

        {/* Typography: NEXGEN (Centered) */}
        <g transform="translate(8, 110)">
          <path d="M0 44 L0 0 L10 0 L25 28 L25 0 L35 0 L35 44 L25 44 L10 16 L10 44 Z" fill={primaryColor} />
          <path d="M45 44 L45 0 L76 0 L76 9 L55 9 L55 17 L72 17 L72 26 L55 26 L55 35 L76 35 L76 44 Z" fill={primaryColor} />
          <path d="M86 44 L96 44 L123 0 L113 0 Z" fill={primaryColor} />
          <path d="M86 0 L96 0 L123 44 L113 44 Z" fill={redColor} />
          <path d="M173 15 L164 19 C161 12 155 8 147 8 C137 8 131 16 131 26 C131 36 137 44 147 44 C156 44 162 39 164 31 L148 31 L148 23 L174 23 L174 32 C171 44 160 52 147 52 C132 52 121 41 121 26 C121 11 132 0 147 0 C159 0 169 6 173 15 Z" fill={primaryColor} transform="translate(6, -4)" />
          <path d="M188 44 L188 0 L219 0 L219 9 L198 9 L198 17 L215 17 L215 26 L198 26 L198 35 L219 35 L219 44 Z" fill={primaryColor} />
          <path d="M229 44 L229 0 L239 0 L254 28 L254 0 L264 0 L264 44 L254 44 L239 16 L239 44 Z" fill={primaryColor} />
        </g>

        {/* Typography: COMPUTER ACADEMY (Centered) */}
        <text x="140" y="182" textAnchor="middle" fill={primaryColor} fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" fontWeight="800" fontSize="12" letterSpacing="4.6">
          COMPUTER ACADEMY
        </text>
      </svg>
    );
  };

  // 3. Official Horizontal Full Logo (02-horizontal & 06-dark-horizontal)
  const NexgenHorizontalVector = ({
    height = dimension,
    isDark = isDarkTheme
  }: {
    height?: number;
    isDark?: boolean;
  }) => {
    const primaryColor = isDark ? '#FFFFFF' : '#032B5F';
    const redColor = '#D81D2A';
    const pebbleFill = isDark ? '#FFFFFF' : '#032B5F';
    const nFill = isDark ? '#032B5F' : '#FFFFFF';
    const calcWidth = Math.round(height * 4.22);

    return (
      <svg
        viewBox="0 0 380 90"
        width={calcWidth}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none drop-shadow-xs"
      >
        {/* NexGen Official Icon Mark */}
        <g transform="translate(8, 6) scale(0.78)">
          <path d="M44 85 C62 85 84 75 89 60 C92 51 87 42 80 34 C82 44 80 54 73 63 C65 74 53 80 41 83 C38 84 39 85 44 85 Z" fill={redColor} />
          <path d="M35 15 C53 15 75 25 82 41 C88 54 82 70 70 80 C58 89 38 88 25 78 C13 67 12 48 19 33 C24 23 29 15 35 15 Z" fill={pebbleFill} />
          <rect x="31" y="32" width="9" height="32" rx="4.5" fill={nFill} />
          <path d="M36 50 C40 42 47 33 57 30 C66 27 74 31 77 39 C80 47 77 56 68 64 C60 71 49 74 39 71 L39 62 C46 64 53 62 59 56 C65 50 67 44 65 40 C63 36 57 35 51 38 C45 41 40 46 36 51 Z" fill={nFill} />
        </g>

        {/* Typography: NEXGEN */}
        <g transform="translate(96, 14)">
          <path d="M0 44 L0 0 L10 0 L25 28 L25 0 L35 0 L35 44 L25 44 L10 16 L10 44 Z" fill={primaryColor} />
          <path d="M45 44 L45 0 L76 0 L76 9 L55 9 L55 17 L72 17 L72 26 L55 26 L55 35 L76 35 L76 44 Z" fill={primaryColor} />
          <path d="M86 44 L96 44 L123 0 L113 0 Z" fill={primaryColor} />
          <path d="M86 0 L96 0 L123 44 L113 44 Z" fill={redColor} />
          <path d="M173 15 L164 19 C161 12 155 8 147 8 C137 8 131 16 131 26 C131 36 137 44 147 44 C156 44 162 39 164 31 L148 31 L148 23 L174 23 L174 32 C171 44 160 52 147 52 C132 52 121 41 121 26 C121 11 132 0 147 0 C159 0 169 6 173 15 Z" fill={primaryColor} transform="translate(6, -4)" />
          <path d="M188 44 L188 0 L219 0 L219 9 L198 9 L198 17 L215 17 L215 26 L198 26 L198 35 L219 35 L219 44 Z" fill={primaryColor} />
          <path d="M229 44 L229 0 L239 0 L254 28 L254 0 L264 0 L264 44 L254 44 L239 16 L239 44 Z" fill={primaryColor} />
        </g>

        {/* Sub-Text: COMPUTER ACADEMY */}
        <text
          x="231"
          y="75"
          textAnchor="middle"
          fill={primaryColor}
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="12"
          letterSpacing="4.6"
        >
          COMPUTER ACADEMY
        </text>
      </svg>
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
    const isSquare = shape === 'square';
    const isWide = shape === 'wide';
    const effectiveMob = width || mobileDim;
    const effectiveDesk = width || desktopDim;

    return (
      <div className="inline-flex items-center justify-center shrink-0 select-none">
        {/* Mobile View */}
        <div
          className="sm:hidden inline-flex items-center justify-center"
          style={{
            height: height ? `${height}px` : `${effectiveMob}px`,
            maxWidth: isSquare ? `${effectiveMob}px` : isWide ? `${Math.round(effectiveMob * 4.2)}px` : `${Math.round(effectiveMob * 3.6)}px`
          }}
        >
          <img
            src={logoSrc!}
            alt={instituteName || 'Institute Logo'}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            style={{
              maxHeight: height ? `${height}px` : `${effectiveMob}px`,
              maxWidth: isSquare ? `${effectiveMob}px` : isWide ? `${Math.round(effectiveMob * 4.2)}px` : `${Math.round(effectiveMob * 3.6)}px`
            }}
            className="w-auto h-auto max-h-full max-w-full object-contain shrink-0 drop-shadow-xs"
          />
        </div>

        {/* Desktop View (sm+) */}
        <div
          className="hidden sm:inline-flex items-center justify-center"
          style={{
            height: height ? `${height}px` : `${effectiveDesk}px`,
            maxWidth: isSquare ? `${effectiveDesk}px` : isWide ? `${Math.round(effectiveDesk * 4.5)}px` : `${Math.round(effectiveDesk * 3.8)}px`
          }}
        >
          <img
            src={logoSrc!}
            alt={instituteName || 'Institute Logo'}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            style={{
              maxHeight: height ? `${height}px` : `${effectiveDesk}px`,
              maxWidth: isSquare ? `${effectiveDesk}px` : isWide ? `${Math.round(effectiveDesk * 4.5)}px` : `${Math.round(effectiveDesk * 3.8)}px`
            }}
            className="w-auto h-auto max-h-full max-w-full object-contain shrink-0 drop-shadow-xs"
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
