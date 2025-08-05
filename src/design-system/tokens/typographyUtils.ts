/**
 * Linear 디자인 시스템 - 타이포그래피 유틸리티 함수
 * 타이포그래피 관련 유틸리티 및 반응형 함수들
 */

import { typography, responsiveTypography } from './typography';
import type { TypographyVariant, HeadingLevel, BodySize, CaptionSize } from './typography';

/**
 * 타이포그래피 스타일을 CSS 객체로 반환하는 함수
 */
export function getTypographyStyle(variant: TypographyVariant, subVariant?: string) {
  const styles = typography[variant];
  
  if (typeof styles === 'object' && 'fontSize' in styles) {
    return {
      fontSize: styles.fontSize,
      lineHeight: styles.lineHeight,
      fontWeight: styles.fontWeight,
      letterSpacing: styles.letterSpacing,
      fontFamily: typography.fontFamily.sans.join(', ')
    };
  }
  
  if (typeof styles === 'object' && subVariant && subVariant in styles) {
    const subStyles = (styles as any)[subVariant];
    return {
      fontSize: subStyles.fontSize,
      lineHeight: subStyles.lineHeight,
      fontWeight: subStyles.fontWeight,
      letterSpacing: subStyles.letterSpacing,
      fontFamily: typography.fontFamily.sans.join(', ')
    };
  }
  
  return {};
}

/**
 * 헤딩 스타일을 가져오는 함수
 */
export function getHeadingStyle(level: HeadingLevel) {
  return getTypographyStyle('heading', level);
}

/**
 * 본문 스타일을 가져오는 함수
 */
export function getBodyStyle(size: BodySize) {
  return getTypographyStyle('body', size);
}

/**
 * 캡션 스타일을 가져오는 함수
 */
export function getCaptionStyle(size: CaptionSize) {
  return getTypographyStyle('caption', size);
}

/**
 * 디스플레이 스타일을 가져오는 함수
 */
export function getDisplayStyle() {
  return getTypographyStyle('display');
}

/**
 * 반응형 타이포그래피 스타일을 생성하는 함수
 */
export function getResponsiveTypographyStyle(variant: keyof typeof responsiveTypography, subVariant?: string) {
  const responsiveStyles = responsiveTypography[variant];
  
  if (typeof responsiveStyles === 'object' && 'mobile' in responsiveStyles && 'desktop' in responsiveStyles) {
    const mobileStyles = responsiveStyles.mobile;
    const desktopStyles = responsiveStyles.desktop;
    
    return {
      // 모바일 스타일 (기본)
      fontSize: mobileStyles.fontSize,
      lineHeight: mobileStyles.lineHeight,
      fontWeight: (mobileStyles as any).fontWeight || (desktopStyles as any).fontWeight,
      letterSpacing: (mobileStyles as any).letterSpacing || (desktopStyles as any).letterSpacing,
      fontFamily: typography.fontFamily.sans.join(', '),
      
      // 데스크톱 미디어 쿼리
      '@media (min-width: 768px)': {
        fontSize: (desktopStyles as any).fontSize,
        lineHeight: (desktopStyles as any).lineHeight,
        fontWeight: (desktopStyles as any).fontWeight,
        letterSpacing: (desktopStyles as any).letterSpacing
      }
    };
  }
  
  if (subVariant && typeof responsiveStyles === 'object' && subVariant in responsiveStyles) {
    const subStyles = (responsiveStyles as any)[subVariant];
    if (subStyles && 'mobile' in subStyles && 'desktop' in subStyles) {
      return {
        fontSize: subStyles.mobile.fontSize,
        lineHeight: subStyles.mobile.lineHeight,
        fontWeight: subStyles.mobile.fontWeight || subStyles.desktop.fontWeight,
        letterSpacing: subStyles.mobile.letterSpacing || subStyles.desktop.letterSpacing,
        fontFamily: typography.fontFamily.sans.join(', '),
        
        '@media (min-width: 768px)': {
          fontSize: subStyles.desktop.fontSize,
          lineHeight: subStyles.desktop.lineHeight,
          fontWeight: subStyles.desktop.fontWeight,
          letterSpacing: subStyles.desktop.letterSpacing
        }
      };
    }
  }
  
  return {};
}

/**
 * CSS 변수명을 생성하는 함수
 */
export function getTypographyCSSVariable(variant: string, property: string, subVariant?: string): string {
  if (subVariant) {
    return `var(--font-${property}-${variant}-${subVariant})`;
  }
  return `var(--font-${property}-${variant})`;
}

/**
 * 폰트 크기를 rem 단위로 변환하는 함수
 */
export function pxToRem(px: string | number, baseFontSize: number = 16): string {
  const pxValue = typeof px === 'string' ? parseFloat(px.replace('px', '')) : px;
  return `${pxValue / baseFontSize}rem`;
}

/**
 * 행간을 상대값으로 변환하는 함수
 */
export function getRelativeLineHeight(fontSize: string, lineHeight: string): number {
  const fontSizeValue = parseFloat(fontSize.replace('px', ''));
  const lineHeightValue = parseFloat(lineHeight.replace('px', ''));
  return Math.round((lineHeightValue / fontSizeValue) * 100) / 100;
}

/**
 * 타이포그래피 스케일을 계산하는 함수
 */
export function calculateTypographyScale(baseSize: number = 16, ratio: number = 1.25) {
  return {
    xs: Math.round(baseSize / Math.pow(ratio, 2)),
    sm: Math.round(baseSize / ratio),
    base: baseSize,
    lg: Math.round(baseSize * ratio),
    xl: Math.round(baseSize * Math.pow(ratio, 2)),
    '2xl': Math.round(baseSize * Math.pow(ratio, 3)),
    '3xl': Math.round(baseSize * Math.pow(ratio, 4)),
    '4xl': Math.round(baseSize * Math.pow(ratio, 5))
  };
}

/**
 * 읽기 최적화된 행간을 계산하는 함수
 */
export function getOptimalLineHeight(fontSize: number): number {
  // 작은 텍스트는 더 큰 행간, 큰 텍스트는 더 작은 행간
  if (fontSize <= 12) return 1.6;
  if (fontSize <= 14) return 1.5;
  if (fontSize <= 16) return 1.5;
  if (fontSize <= 18) return 1.4;
  if (fontSize <= 24) return 1.3;
  return 1.2;
}

/**
 * 텍스트 잘림 스타일을 생성하는 함수
 */
export function getTextTruncationStyle(lines: number = 1) {
  if (lines === 1) {
    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const
    };
  }
  
  return {
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };
}

/**
 * 타이포그래피 CSS 변수를 생성하는 함수
 */
export function generateTypographyCSSVariables(): string {
  let cssVariables = '';
  
  // 폰트 패밀리
  cssVariables += `  --font-family-sans: ${typography.fontFamily.sans.join(', ')};\n`;
  cssVariables += `  --font-family-mono: ${typography.fontFamily.mono.join(', ')};\n\n`;
  
  // 디스플레이 스타일
  cssVariables += `  --font-size-display: ${typography.display.fontSize};\n`;
  cssVariables += `  --line-height-display: ${typography.display.lineHeight};\n`;
  cssVariables += `  --font-weight-display: ${typography.display.fontWeight};\n`;
  cssVariables += `  --letter-spacing-display: ${typography.display.letterSpacing};\n\n`;
  
  // 헤딩 스타일
  Object.entries(typography.heading).forEach(([level, styles]) => {
    cssVariables += `  --font-size-${level}: ${styles.fontSize};\n`;
    cssVariables += `  --line-height-${level}: ${styles.lineHeight};\n`;
    cssVariables += `  --font-weight-${level}: ${styles.fontWeight};\n`;
    cssVariables += `  --letter-spacing-${level}: ${styles.letterSpacing};\n\n`;
  });
  
  // 본문 스타일
  Object.entries(typography.body).forEach(([size, styles]) => {
    cssVariables += `  --font-size-body-${size}: ${styles.fontSize};\n`;
    cssVariables += `  --line-height-body-${size}: ${styles.lineHeight};\n`;
    cssVariables += `  --font-weight-body-${size}: ${styles.fontWeight};\n`;
    cssVariables += `  --letter-spacing-body-${size}: ${styles.letterSpacing};\n\n`;
  });
  
  // 캡션 스타일
  Object.entries(typography.caption).forEach(([size, styles]) => {
    cssVariables += `  --font-size-caption-${size}: ${styles.fontSize};\n`;
    cssVariables += `  --line-height-caption-${size}: ${styles.lineHeight};\n`;
    cssVariables += `  --font-weight-caption-${size}: ${styles.fontWeight};\n`;
    cssVariables += `  --letter-spacing-caption-${size}: ${styles.letterSpacing};\n\n`;
  });
  
  // 폰트 가중치
  Object.entries(typography.fontWeight).forEach(([name, weight]) => {
    cssVariables += `  --font-weight-${name}: ${weight};\n`;
  });
  
  return cssVariables;
}

/**
 * 반응형 타이포그래피 클래스를 생성하는 함수
 */
export function createResponsiveTypographyClasses() {
  return {
    // 디스플레이 반응형
    'text-display-responsive': {
      fontSize: responsiveTypography.display.mobile.fontSize,
      lineHeight: responsiveTypography.display.mobile.lineHeight,
      fontWeight: typography.display.fontWeight,
      letterSpacing: typography.display.letterSpacing,
      
      '@media (min-width: 768px)': {
        fontSize: responsiveTypography.display.desktop.fontSize,
        lineHeight: responsiveTypography.display.desktop.lineHeight
      }
    },
    
    // H1 반응형
    'text-h1-responsive': {
      fontSize: responsiveTypography.heading.h1.mobile.fontSize,
      lineHeight: responsiveTypography.heading.h1.mobile.lineHeight,
      fontWeight: typography.heading.h1.fontWeight,
      letterSpacing: typography.heading.h1.letterSpacing,
      
      '@media (min-width: 768px)': {
        fontSize: responsiveTypography.heading.h1.desktop.fontSize,
        lineHeight: responsiveTypography.heading.h1.desktop.lineHeight
      }
    },
    
    // H2 반응형
    'text-h2-responsive': {
      fontSize: responsiveTypography.heading.h2.mobile.fontSize,
      lineHeight: responsiveTypography.heading.h2.mobile.lineHeight,
      fontWeight: typography.heading.h2.fontWeight,
      letterSpacing: typography.heading.h2.letterSpacing,
      
      '@media (min-width: 768px)': {
        fontSize: responsiveTypography.heading.h2.desktop.fontSize,
        lineHeight: responsiveTypography.heading.h2.desktop.lineHeight
      }
    }
  };
}

/**
 * 접근성을 고려한 최소 폰트 크기 검증 함수
 */
export function validateMinimumFontSize(fontSize: string | number): boolean {
  const sizeInPx = typeof fontSize === 'string' ? parseFloat(fontSize.replace('px', '')) : fontSize;
  return sizeInPx >= 12; // 최소 12px 권장
}

/**
 * 읽기 속도를 고려한 최적 글자 수 계산 함수
 */
export function getOptimalCharactersPerLine(fontSize: number): { min: number; max: number; optimal: number } {
  // 폰트 크기에 따른 한 줄당 최적 글자 수
  const baseOptimal = 66; // 영문 기준
  const ratio = fontSize / 16; // 16px 기준
  
  const optimal = Math.round(baseOptimal / ratio);
  
  return {
    min: Math.round(optimal * 0.7),
    max: Math.round(optimal * 1.3),
    optimal
  };
}