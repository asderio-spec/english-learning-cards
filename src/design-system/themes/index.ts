/**
 * Linear 디자인 시스템 - 테마 시스템 진입점
 */

export { lightTheme } from './light';
export { darkTheme } from './dark';
export type { Theme, ThemeColors, ThemeMode, ThemeConfig, SemanticColorSet } from './types';
export * from './utils';

import { lightTheme } from './light';
import { darkTheme } from './dark';
import type { Theme, ThemeMode } from './types';

// 테마 맵
export const themes = {
  light: lightTheme,
  dark: darkTheme
} as const;

// 테마 유틸리티 함수
export const getTheme = (mode: 'light' | 'dark'): Theme => {
  return themes[mode];
};

// 시스템 테마 감지
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// 테마 모드 해석 (system 모드를 실제 테마로 변환)
export const resolveThemeMode = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
};

// CSS 변수 적용 함수 - 테마별 CSS 변수 동적 적용 시스템
export const applyThemeToDOM = (theme: Theme): void => {
  const root = document.documentElement;
  
  // data-theme 속성 설정 (CSS 선택자에서 사용)
  root.setAttribute('data-theme', theme.mode);
  
  // CSS 변수 동적 적용
  const { colors } = theme;
  
  // 배경 색상 변수
  root.style.setProperty('--bg-primary', colors.background.primary);
  root.style.setProperty('--bg-secondary', colors.background.secondary);
  root.style.setProperty('--bg-elevated', colors.background.elevated);
  
  // 표면 색상 변수
  root.style.setProperty('--surface-primary', colors.surface.primary);
  root.style.setProperty('--surface-secondary', colors.surface.secondary);
  root.style.setProperty('--surface-tertiary', colors.surface.tertiary);
  
  // 텍스트 색상 변수
  root.style.setProperty('--text-primary', colors.text.primary);
  root.style.setProperty('--text-secondary', colors.text.secondary);
  root.style.setProperty('--text-tertiary', colors.text.tertiary);
  root.style.setProperty('--text-disabled', colors.text.disabled);
  root.style.setProperty('--text-inverse', colors.text.inverse);
  
  // 경계선 색상 변수
  root.style.setProperty('--border-primary', colors.border.primary);
  root.style.setProperty('--border-secondary', colors.border.secondary);
  root.style.setProperty('--border-focus', colors.border.focus);
  
  // 그림자 변수
  root.style.setProperty('--shadow-sm', colors.shadow.sm);
  root.style.setProperty('--shadow-md', colors.shadow.md);
  root.style.setProperty('--shadow-lg', colors.shadow.lg);
  root.style.setProperty('--shadow-xl', colors.shadow.xl);
  
  // 의미적 색상 변수 (Primary)
  root.style.setProperty('--semantic-primary-bg', colors.semantic.primary.background);
  root.style.setProperty('--semantic-primary-border', colors.semantic.primary.border);
  root.style.setProperty('--semantic-primary-text', colors.semantic.primary.text);
  root.style.setProperty('--semantic-primary-text-strong', colors.semantic.primary.textStrong);
  
  // 의미적 색상 변수 (Secondary)
  root.style.setProperty('--semantic-secondary-bg', colors.semantic.secondary.background);
  root.style.setProperty('--semantic-secondary-border', colors.semantic.secondary.border);
  root.style.setProperty('--semantic-secondary-text', colors.semantic.secondary.text);
  root.style.setProperty('--semantic-secondary-text-strong', colors.semantic.secondary.textStrong);
  
  // 의미적 색상 변수 (Success)
  root.style.setProperty('--semantic-success-bg', colors.semantic.success.background);
  root.style.setProperty('--semantic-success-border', colors.semantic.success.border);
  root.style.setProperty('--semantic-success-text', colors.semantic.success.text);
  root.style.setProperty('--semantic-success-text-strong', colors.semantic.success.textStrong);
  
  // 의미적 색상 변수 (Warning)
  root.style.setProperty('--semantic-warning-bg', colors.semantic.warning.background);
  root.style.setProperty('--semantic-warning-border', colors.semantic.warning.border);
  root.style.setProperty('--semantic-warning-text', colors.semantic.warning.text);
  root.style.setProperty('--semantic-warning-text-strong', colors.semantic.warning.textStrong);
  
  // 의미적 색상 변수 (Error)
  root.style.setProperty('--semantic-error-bg', colors.semantic.error.background);
  root.style.setProperty('--semantic-error-border', colors.semantic.error.border);
  root.style.setProperty('--semantic-error-text', colors.semantic.error.text);
  root.style.setProperty('--semantic-error-text-strong', colors.semantic.error.textStrong);
  
  // 인터랙션 상태 색상 변수
  root.style.setProperty('--interactive-hover', colors.interactive.hover);
  root.style.setProperty('--interactive-pressed', colors.interactive.pressed);
  root.style.setProperty('--interactive-selected', colors.interactive.selected);
  root.style.setProperty('--interactive-focus', colors.interactive.focus);
  
  // 색상 스키마 메타 정보 설정 (브라우저 UI 테마 힌트)
  const colorScheme = theme.mode === 'dark' ? 'dark' : 'light';
  root.style.setProperty('color-scheme', colorScheme);
};

// 로컬 스토리지 키
export const THEME_STORAGE_KEY = 'linear-design-system-theme';

// 테마 저장
export const saveThemeToStorage = (mode: ThemeMode): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

// 테마 불러오기
export const loadThemeFromStorage = (): ThemeMode | null => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as ThemeMode;
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  return null;
};