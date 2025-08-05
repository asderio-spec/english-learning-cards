/**
 * Linear 디자인 시스템 - 메인 인덱스
 * 디자인 시스템의 모든 요소를 중앙에서 내보내기
 */

// 토큰 내보내기
export * from './tokens';

// 컴포넌트 내보내기
export * from './components';

// 데모 컴포넌트 내보내기
export { default as ColorDemo } from './demo/ColorDemo';
export { default as TypographyDemo } from './demo/TypographyDemo';
export { default as SpacingDemo } from './demo/SpacingDemo';

// 테마 시스템 내보내기
export * from './themes';
export { 
  ThemeProvider, 
  useTheme, 
  useThemeColors,
  useDarkMode
} from './context/ThemeContext';

// 타입 내보내기
export type { 
  ComponentState,
  ResponsiveValue as DesignSystemResponsiveValue,
  ComponentRef
} from './types';

// 스타일 파일들은 CSS로 직접 import 해야 함
// import './styles/variables.css';
// import './styles/globals.css';

// 디자인 시스템 버전
export const DESIGN_SYSTEM_VERSION = '1.0.0';

// 디자인 시스템 설정
export const designSystemConfig = {
  name: 'Linear Design System',
  version: DESIGN_SYSTEM_VERSION,
  description: 'Linear 스타일 디자인 시스템 for 영어 학습 카드 앱',
  author: 'Kiro AI',
  
  // 기본 설정
  defaults: {
    theme: 'system' as const,
    reducedMotion: false,
    highContrast: false
  },
  
  // 지원하는 브레이크포인트
  breakpoints: {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
    wide: 1440
  },
  
  // 지원하는 테마
  themes: ['light', 'dark', 'system'] as const
} as const;

// 유틸리티 함수들
export const utils = {
  // 테마 감지
  getSystemTheme: (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  
  // 애니메이션 감소 설정 감지
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  // 고대비 모드 감지
  prefersHighContrast: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-contrast: high)').matches;
  },
  
  // 터치 디바이스 감지
  isTouchDevice: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  },
  
  // 현재 브레이크포인트 감지
  getCurrentBreakpoint: (): keyof typeof designSystemConfig.breakpoints => {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < designSystemConfig.breakpoints.tablet) return 'mobile';
    if (width < designSystemConfig.breakpoints.desktop) return 'tablet';
    if (width < designSystemConfig.breakpoints.wide) return 'desktop';
    return 'wide';
  }
} as const;

// 타입 정의
export type DesignSystemTheme = typeof designSystemConfig.themes[number];
export type DesignSystemBreakpoint = keyof typeof designSystemConfig.breakpoints;