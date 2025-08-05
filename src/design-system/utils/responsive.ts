/**
 * Linear 디자인 시스템 - 반응형 유틸리티
 * 화면 크기별 레이아웃 자동 조정 및 터치 최적화 로직
 */

import { breakpoints, spacing, containerMaxWidth } from '../tokens/spacing';
import type { BreakpointKey } from '../hooks/useBreakpoint';

export interface ResponsiveValue<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

export interface ResponsiveLayoutConfig {
  columns: ResponsiveValue<number>;
  gap: ResponsiveValue<keyof typeof spacing>;
  padding: ResponsiveValue<keyof typeof spacing>;
  maxWidth?: keyof typeof containerMaxWidth | 'none';
}

/**
 * 현재 브레이크포인트에 따른 반응형 값 계산
 */
export function getResponsiveValue<T>(
  value: T | ResponsiveValue<T>,
  currentBreakpoint: BreakpointKey,
  fallback?: T
): T {
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }

  const responsiveValue = value as ResponsiveValue<T>;

  // 현재 브레이크포인트에 맞는 값 찾기 (폴백 체인 적용)
  switch (currentBreakpoint) {
    case 'wide':
      return responsiveValue.wide ?? 
             responsiveValue.desktop ?? 
             responsiveValue.tablet ?? 
             responsiveValue.mobile ?? 
             fallback as T;
    
    case 'desktop':
      return responsiveValue.desktop ?? 
             responsiveValue.tablet ?? 
             responsiveValue.mobile ?? 
             fallback as T;
    
    case 'tablet':
      return responsiveValue.tablet ?? 
             responsiveValue.mobile ?? 
             fallback as T;
    
    case 'mobile':
    default:
      return responsiveValue.mobile ?? fallback as T;
  }
}

/**
 * 반응형 그리드 컬럼 수 계산
 */
export function getResponsiveColumns(
  columns: number | ResponsiveValue<number>,
  currentBreakpoint: BreakpointKey
): number {
  if (typeof columns === 'number') {
    return columns;
  }

  return getResponsiveValue(columns, currentBreakpoint, 1);
}

/**
 * 반응형 간격 계산
 */
export function getResponsiveSpacing(
  gap: keyof typeof spacing | ResponsiveValue<keyof typeof spacing>,
  currentBreakpoint: BreakpointKey
): string {
  if (typeof gap === 'string') {
    return spacing[gap];
  }

  const spacingKey = getResponsiveValue(gap, currentBreakpoint, 4 as keyof typeof spacing);
  return spacing[spacingKey];
}

/**
 * 터치 디바이스 최적화 스타일 생성
 */
export interface TouchOptimizedStyles {
  minHeight: string;
  minWidth: string;
  padding: string;
  fontSize: string;
  lineHeight: string;
  cursor: string;
  userSelect: string;
  touchAction: string;
  WebkitTapHighlightColor: string;
}

export function getTouchOptimizedStyles(
  isTouchDevice: boolean,
  baseSize: 'sm' | 'md' | 'lg' = 'md'
): Partial<TouchOptimizedStyles> {
  if (!isTouchDevice) {
    return {
      cursor: 'pointer',
      userSelect: 'none',
    };
  }

  // 터치 디바이스용 최적화된 스타일
  const touchSizes = {
    sm: {
      minHeight: '40px',
      minWidth: '40px',
      padding: `${spacing[2]} ${spacing[3]}`,
      fontSize: '14px',
      lineHeight: '20px',
    },
    md: {
      minHeight: '44px',
      minWidth: '44px',
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: '16px',
      lineHeight: '24px',
    },
    lg: {
      minHeight: '48px',
      minWidth: '48px',
      padding: `${spacing[4]} ${spacing[6]}`,
      fontSize: '18px',
      lineHeight: '28px',
    },
  };

  return {
    ...touchSizes[baseSize],
    cursor: 'default',
    userSelect: 'none',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  };
}

/**
 * 반응형 레이아웃 CSS 생성
 */
export function generateResponsiveCSS(
  config: ResponsiveLayoutConfig,
  currentBreakpoint: BreakpointKey
): React.CSSProperties {
  const columns = getResponsiveColumns(config.columns, currentBreakpoint);
  const gap = getResponsiveSpacing(config.gap, currentBreakpoint);
  const padding = getResponsiveSpacing(config.padding, currentBreakpoint);
  
  let maxWidth = 'none';
  if (config.maxWidth && config.maxWidth !== 'none') {
    maxWidth = containerMaxWidth[config.maxWidth];
  }

  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
    padding,
    maxWidth,
    margin: '0 auto',
    width: '100%',
  };
}

/**
 * 화면 크기 전환 애니메이션 스타일
 */
export interface TransitionConfig {
  duration?: number;
  easing?: string;
  properties?: string[];
}

export function getTransitionStyles(
  config: TransitionConfig = {},
  prefersReducedMotion: boolean = false
): React.CSSProperties {
  if (prefersReducedMotion) {
    return {};
  }

  const {
    duration = 250,
    easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    properties = ['all']
  } = config;

  return {
    transition: properties.map(prop => `${prop} ${duration}ms ${easing}`).join(', '),
  };
}

/**
 * 반응형 타이포그래피 스케일 계산
 */
export interface TypographyScale {
  fontSize: string;
  lineHeight: string;
  letterSpacing?: string;
}

export function getResponsiveTypography(
  baseSize: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body-lg' | 'body-md' | 'body-sm' | 'caption-lg' | 'caption-md' | 'caption-sm',
  currentBreakpoint: BreakpointKey
): TypographyScale {
  // 모바일에서는 폰트 크기를 약간 줄임
  const mobileScale = currentBreakpoint === 'mobile' ? 0.9 : 1;
  
  const typographyMap: Record<string, TypographyScale> = {
    display: {
      fontSize: `${32 * mobileScale}px`,
      lineHeight: `${40 * mobileScale}px`,
      letterSpacing: '-0.02em',
    },
    h1: {
      fontSize: `${28 * mobileScale}px`,
      lineHeight: `${36 * mobileScale}px`,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: `${24 * mobileScale}px`,
      lineHeight: `${32 * mobileScale}px`,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: `${20 * mobileScale}px`,
      lineHeight: `${28 * mobileScale}px`,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: `${18 * mobileScale}px`,
      lineHeight: `${26 * mobileScale}px`,
      letterSpacing: '0em',
    },
    'body-lg': {
      fontSize: `${18 * mobileScale}px`,
      lineHeight: `${28 * mobileScale}px`,
      letterSpacing: '0em',
    },
    'body-md': {
      fontSize: `${16 * mobileScale}px`,
      lineHeight: `${24 * mobileScale}px`,
      letterSpacing: '0em',
    },
    'body-sm': {
      fontSize: `${14 * mobileScale}px`,
      lineHeight: `${20 * mobileScale}px`,
      letterSpacing: '0em',
    },
    'caption-lg': {
      fontSize: `${14 * mobileScale}px`,
      lineHeight: `${20 * mobileScale}px`,
      letterSpacing: '0.01em',
    },
    'caption-md': {
      fontSize: `${12 * mobileScale}px`,
      lineHeight: `${16 * mobileScale}px`,
      letterSpacing: '0.01em',
    },
    'caption-sm': {
      fontSize: `${11 * mobileScale}px`,
      lineHeight: `${14 * mobileScale}px`,
      letterSpacing: '0.02em',
    },
  };

  return typographyMap[baseSize] || typographyMap['body-md'];
}

/**
 * 반응형 컨테이너 패딩 계산
 */
export function getResponsiveContainerPadding(
  currentBreakpoint: BreakpointKey,
  customPadding?: ResponsiveValue<keyof typeof spacing>
): string {
  if (customPadding) {
    return getResponsiveSpacing(customPadding, currentBreakpoint);
  }

  // 기본 반응형 패딩
  const defaultPadding: ResponsiveValue<keyof typeof spacing> = {
    mobile: 4,   // 16px
    tablet: 6,   // 24px
    desktop: 8,  // 32px
    wide: 8,     // 32px
  };

  return getResponsiveSpacing(defaultPadding, currentBreakpoint);
}

/**
 * 반응형 그리드 갭 계산
 */
export function getResponsiveGridGap(
  currentBreakpoint: BreakpointKey,
  customGap?: ResponsiveValue<keyof typeof spacing>
): string {
  if (customGap) {
    return getResponsiveSpacing(customGap, currentBreakpoint);
  }

  // 기본 반응형 갭
  const defaultGap: ResponsiveValue<keyof typeof spacing> = {
    mobile: 2,   // 8px
    tablet: 4,   // 16px
    desktop: 6,  // 24px
    wide: 6,     // 24px
  };

  return getResponsiveSpacing(defaultGap, currentBreakpoint);
}

/**
 * 미디어 쿼리 문자열 생성
 */
export function createMediaQuery(
  minWidth?: keyof typeof breakpoints,
  maxWidth?: keyof typeof breakpoints
): string {
  const queries: string[] = [];

  if (minWidth) {
    queries.push(`(min-width: ${breakpoints[minWidth]})`);
  }

  if (maxWidth) {
    // maxWidth는 해당 브레이크포인트 직전까지
    const maxWidthValue = parseInt(breakpoints[maxWidth]) - 1;
    queries.push(`(max-width: ${maxWidthValue}px)`);
  }

  return queries.join(' and ');
}

/**
 * 반응형 클래스명 생성 유틸리티
 */
export function getResponsiveClassName(
  baseClass: string,
  currentBreakpoint: BreakpointKey,
  responsiveClasses?: ResponsiveValue<string>
): string {
  if (!responsiveClasses) {
    return baseClass;
  }

  const responsiveClass = getResponsiveValue(responsiveClasses, currentBreakpoint, '');
  return `${baseClass} ${responsiveClass}`.trim();
}

/**
 * 반응형 스타일 객체 생성
 */
export function createResponsiveStyles(
  styles: ResponsiveValue<React.CSSProperties>,
  currentBreakpoint: BreakpointKey
): React.CSSProperties {
  return getResponsiveValue(styles, currentBreakpoint, {});
}

/**
 * 디바이스별 최적화 설정
 */
export interface DeviceOptimization {
  enableHover: boolean;
  enableFocus: boolean;
  scrollBehavior: 'auto' | 'smooth';
  willChange: string;
  backfaceVisibility: 'visible' | 'hidden';
  perspective: string;
  transformStyle: 'flat' | 'preserve-3d';
}

export function getDeviceOptimization(
  isTouchDevice: boolean,
  isMobile: boolean,
  prefersReducedMotion: boolean
): DeviceOptimization {
  return {
    enableHover: !isTouchDevice,
    enableFocus: true,
    scrollBehavior: prefersReducedMotion ? 'auto' : 'smooth',
    willChange: isMobile ? 'transform' : 'auto',
    backfaceVisibility: isMobile ? 'hidden' : 'visible',
    perspective: isMobile ? '1000px' : 'none',
    transformStyle: isMobile ? 'preserve-3d' : 'flat',
  };
}