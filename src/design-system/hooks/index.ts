/**
 * Linear 디자인 시스템 - 훅 통합 export
 */

// 반응형 훅
export {
  useBreakpoint,
  useBreakpointUp,
  useBreakpointDown,
  useBreakpointBetween,
  useBreakpointOnly,
  type BreakpointKey,
  type BreakpointValue,
  type BreakpointState,
} from './useBreakpoint';

// 미디어 쿼리 훅
export {
  useMediaQuery,
  usePrefersDarkMode,
  usePrefersReducedMotion,
  usePrefersHighContrast,
  useIsTouchDevice as useIsTouchDeviceQuery,
  useIsPortrait,
  useIsLandscape,
  useIsPrintMode,
  useIsHighDPI,
  useMediaQueries,
  mediaQueries,
} from './useMediaQuery';

// 디바이스 감지 훅
export {
  useDeviceDetection,
  useIsTouchDevice,
  useIsMobile,
  useIsOnline,
  useDeviceOptimizedStyles,
  type DeviceInfo,
} from './useDeviceDetection';

// 반응형 레이아웃 훅
export {
  useResponsiveLayout,
  useResponsiveGrid,
  useResponsiveContainer,
  useResponsiveTypography,
  useTouchOptimization,
  useResponsiveAnimation,
  type UseResponsiveLayoutOptions,
  type ResponsiveLayoutResult,
} from './useResponsiveLayout';

// 접근성 훅
export {
  useFocusTrap,
  type UseFocusTrapOptions,
  type UseFocusTrapResult,
} from './useFocusTrap';

export {
  useKeyboardNavigation,
  type UseKeyboardNavigationOptions,
  type UseKeyboardNavigationResult,
} from './useKeyboardNavigation';

export {
  useAriaLive,
  announceGlobally,
  cleanupGlobalAriaLive,
  type AriaLivePoliteness,
  type UseAriaLiveOptions,
  type UseAriaLiveResult,
} from './useAriaLive';

export {
  useHighContrast,
  useHighContrastClass,
  type UseHighContrastOptions,
  type UseHighContrastResult,
} from './useHighContrast';