/**
 * Linear 디자인 시스템 - 테마 유틸리티 함수
 * 테마 검증, 디버깅, 색상 접근성 검사 등을 위한 유틸리티
 */

import type { Theme, ThemeMode } from './types';
import { lightTheme, darkTheme } from './index';

/**
 * 테마 유효성 검증
 */
export const validateTheme = (theme: Theme): boolean => {
  try {
    // 필수 속성 검증
    const requiredProps = [
      'mode',
      'colors.background.primary',
      'colors.background.secondary', 
      'colors.background.elevated',
      'colors.surface.primary',
      'colors.surface.secondary',
      'colors.surface.tertiary',
      'colors.text.primary',
      'colors.text.secondary',
      'colors.text.tertiary',
      'colors.text.disabled',
      'colors.text.inverse',
      'colors.border.primary',
      'colors.border.secondary',
      'colors.border.focus',
      'colors.shadow.sm',
      'colors.shadow.md',
      'colors.shadow.lg',
      'colors.shadow.xl'
    ];

    for (const prop of requiredProps) {
      const value = getNestedProperty(theme, prop);
      if (!value || typeof value !== 'string') {
        console.warn(`Theme validation failed: Missing or invalid property ${prop}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Theme validation error:', error);
    return false;
  }
};

/**
 * 중첩된 객체 속성 가져오기
 */
const getNestedProperty = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * 색상 대비 계산 (WCAG 기준)
 */
export const calculateColorContrast = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    // 간단한 RGB 추출 (실제로는 더 복잡한 파싱이 필요)
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return 0;
    
    const [r, g, b] = rgb.map(Number);
    const [rNorm, gNorm, bNorm] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * 테마 접근성 검증
 */
export const validateThemeAccessibility = (theme: Theme): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  
  // 텍스트와 배경 대비 검증 (WCAG AA 기준: 4.5:1)
  const textBackgroundContrast = calculateColorContrast(
    theme.colors.text.primary,
    theme.colors.background.primary
  );
  
  if (textBackgroundContrast < 4.5) {
    issues.push(`Primary text contrast ratio (${textBackgroundContrast.toFixed(2)}) is below WCAG AA standard (4.5:1)`);
  }
  
  const secondaryTextContrast = calculateColorContrast(
    theme.colors.text.secondary,
    theme.colors.background.primary
  );
  
  if (secondaryTextContrast < 3) {
    issues.push(`Secondary text contrast ratio (${secondaryTextContrast.toFixed(2)}) is below minimum readable standard (3:1)`);
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};

/**
 * 테마 디버깅 정보 출력
 */
export const debugTheme = (theme: Theme): void => {
  console.group(`🎨 Theme Debug: ${theme.mode.toUpperCase()}`);
  
  console.log('📋 Theme Structure:', {
    mode: theme.mode,
    backgroundColors: Object.keys(theme.colors.background).length,
    surfaceColors: Object.keys(theme.colors.surface).length,
    textColors: Object.keys(theme.colors.text).length,
    borderColors: Object.keys(theme.colors.border).length,
    shadowVariants: Object.keys(theme.colors.shadow).length,
    semanticColors: Object.keys(theme.colors.semantic).length,
    interactiveColors: Object.keys(theme.colors.interactive).length
  });
  
  console.log('🎯 Key Colors:', {
    primaryBackground: theme.colors.background.primary,
    primaryText: theme.colors.text.primary,
    focusBorder: theme.colors.border.focus
  });
  
  const accessibility = validateThemeAccessibility(theme);
  console.log('♿ Accessibility:', accessibility);
  
  const isValid = validateTheme(theme);
  console.log('✅ Validation:', isValid ? 'PASSED' : 'FAILED');
  
  console.groupEnd();
};

/**
 * 현재 적용된 테마 감지
 */
export const getCurrentTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  
  const dataTheme = document.documentElement.getAttribute('data-theme');
  if (dataTheme === 'light' || dataTheme === 'dark') {
    return dataTheme;
  }
  
  // data-theme이 없으면 시스템 테마 확인
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * 테마 전환 애니메이션 제어
 */
export const withThemeTransition = (callback: () => void): void => {
  // 애니메이션 감소 설정 확인
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // 애니메이션 없이 즉시 실행
    callback();
    return;
  }
  
  // 테마 전환 클래스 추가
  document.documentElement.classList.add('theme-transitioning');
  
  // 테마 변경 실행
  callback();
  
  // 전환 완료 후 클래스 제거
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
  }, 250); // CSS transition duration과 일치
};

/**
 * 테마별 색상 팔레트 생성
 */
export const generateColorPalette = (theme: Theme) => {
  return {
    backgrounds: [
      { name: 'Primary', value: theme.colors.background.primary },
      { name: 'Secondary', value: theme.colors.background.secondary },
      { name: 'Elevated', value: theme.colors.background.elevated }
    ],
    surfaces: [
      { name: 'Primary', value: theme.colors.surface.primary },
      { name: 'Secondary', value: theme.colors.surface.secondary },
      { name: 'Tertiary', value: theme.colors.surface.tertiary }
    ],
    texts: [
      { name: 'Primary', value: theme.colors.text.primary },
      { name: 'Secondary', value: theme.colors.text.secondary },
      { name: 'Tertiary', value: theme.colors.text.tertiary },
      { name: 'Disabled', value: theme.colors.text.disabled },
      { name: 'Inverse', value: theme.colors.text.inverse }
    ],
    borders: [
      { name: 'Primary', value: theme.colors.border.primary },
      { name: 'Secondary', value: theme.colors.border.secondary },
      { name: 'Focus', value: theme.colors.border.focus }
    ],
    semantic: {
      primary: theme.colors.semantic.primary,
      secondary: theme.colors.semantic.secondary,
      success: theme.colors.semantic.success,
      warning: theme.colors.semantic.warning,
      error: theme.colors.semantic.error
    },
    interactive: theme.colors.interactive
  };
};

/**
 * 테마 비교 유틸리티
 */
export const compareThemes = () => {
  console.group('🔄 Theme Comparison');
  
  console.log('Light Theme:');
  debugTheme(lightTheme);
  
  console.log('Dark Theme:');
  debugTheme(darkTheme);
  
  console.groupEnd();
};