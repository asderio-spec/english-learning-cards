/**
 * Linear 디자인 시스템 - 반응형 레이아웃 훅
 * 화면 크기별 레이아웃 자동 조정 로직
 */

import { useMemo } from 'react';
import { useBreakpoint } from './useBreakpoint';
import { useDeviceDetection } from './useDeviceDetection';
import { usePrefersReducedMotion } from './useMediaQuery';
import {
  ResponsiveValue,
  ResponsiveLayoutConfig,
  getResponsiveValue,
  getResponsiveColumns,
  getResponsiveSpacing,
  getTouchOptimizedStyles,
  generateResponsiveCSS,
  getTransitionStyles,
  getResponsiveTypography,
  getResponsiveContainerPadding,
  getResponsiveGridGap,
  getDeviceOptimization,
  createResponsiveStyles,
} from '../utils/responsive';
import { spacing } from '../tokens/spacing';

export interface UseResponsiveLayoutOptions {
  /** 반응형 컬럼 설정 */
  columns?: number | ResponsiveValue<number>;
  /** 반응형 간격 설정 */
  gap?: keyof typeof spacing | ResponsiveValue<keyof typeof spacing>;
  /** 반응형 패딩 설정 */
  padding?: keyof typeof spacing | ResponsiveValue<keyof typeof spacing>;
  /** 컨테이너 최대 너비 */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';
  /** 터치 최적화 활성화 */
  touchOptimized?: boolean;
  /** 전환 애니메이션 활성화 */
  enableTransitions?: boolean;
  /** 커스텀 전환 설정 */
  transitionConfig?: {
    duration?: number;
    easing?: string;
    properties?: string[];
  };
}

export interface ResponsiveLayoutResult {
  /** 현재 브레이크포인트 정보 */
  breakpoint: ReturnType<typeof useBreakpoint>;
  /** 디바이스 정보 */
  device: ReturnType<typeof useDeviceDetection>;
  /** 반응형 레이아웃 스타일 */
  layoutStyles: React.CSSProperties;
  /** 터치 최적화 스타일 */
  touchStyles: Partial<React.CSSProperties>;
  /** 전환 애니메이션 스타일 */
  transitionStyles: React.CSSProperties;
  /** 디바이스 최적화 설정 */
  optimization: ReturnType<typeof getDeviceOptimization>;
  /** 유틸리티 함수들 */
  utils: {
    getResponsiveValue: <T>(value: T | ResponsiveValue<T>, fallback?: T) => T;
    getColumns: () => number;
    getGap: () => string;
    getPadding: () => string;
    getTypography: (size: string) => ReturnType<typeof getResponsiveTypography>;
    createStyles: (styles: ResponsiveValue<React.CSSProperties>) => React.CSSProperties;
  };
}

/**
 * 반응형 레이아웃을 위한 종합 훅
 */
export const useResponsiveLayout = (
  options: UseResponsiveLayoutOptions = {}
): ResponsiveLayoutResult => {
  const {
    columns = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
    gap = { mobile: 2, tablet: 4, desktop: 6 },
    padding = { mobile: 4, tablet: 6, desktop: 8 },
    maxWidth = 'lg',
    touchOptimized = true,
    enableTransitions = true,
    transitionConfig = {},
  } = options;

  // 반응형 상태 훅들
  const breakpoint = useBreakpoint();
  const device = useDeviceDetection();
  const prefersReducedMotion = usePrefersReducedMotion();

  // 반응형 값들 계산
  const responsiveValues = useMemo(() => {
    const currentColumns = getResponsiveColumns(columns, breakpoint.current);
    const currentGap = getResponsiveSpacing(gap, breakpoint.current);
    const currentPadding = getResponsiveSpacing(padding, breakpoint.current);

    return {
      columns: currentColumns,
      gap: currentGap,
      padding: currentPadding,
    };
  }, [columns, gap, padding, breakpoint.current]);

  // 레이아웃 스타일 생성
  const layoutStyles = useMemo(() => {
    const config: ResponsiveLayoutConfig = {
      columns,
      gap,
      padding,
      maxWidth,
    };

    return generateResponsiveCSS(config, breakpoint.current);
  }, [columns, gap, padding, maxWidth, breakpoint.current]);

  // 터치 최적화 스타일
  const touchStyles = useMemo(() => {
    if (!touchOptimized || !device.isTouchDevice) {
      return {};
    }

    return getTouchOptimizedStyles(device.isTouchDevice, 'md');
  }, [touchOptimized, device.isTouchDevice]);

  // 전환 애니메이션 스타일
  const transitionStyles = useMemo(() => {
    if (!enableTransitions) {
      return {};
    }

    return getTransitionStyles(transitionConfig, prefersReducedMotion);
  }, [enableTransitions, transitionConfig, prefersReducedMotion]);

  // 디바이스 최적화 설정
  const optimization = useMemo(() => {
    return getDeviceOptimization(
      device.isTouchDevice,
      device.isMobile,
      prefersReducedMotion
    );
  }, [device.isTouchDevice, device.isMobile, prefersReducedMotion]);

  // 유틸리티 함수들
  const utils = useMemo(() => ({
    getResponsiveValue: <T>(value: T | ResponsiveValue<T>, fallback?: T) =>
      getResponsiveValue(value, breakpoint.current, fallback),
    
    getColumns: () => responsiveValues.columns,
    
    getGap: () => responsiveValues.gap,
    
    getPadding: () => responsiveValues.padding,
    
    getTypography: (size: string) =>
      getResponsiveTypography(size as any, breakpoint.current),
    
    createStyles: (styles: ResponsiveValue<React.CSSProperties>) =>
      createResponsiveStyles(styles, breakpoint.current),
  }), [breakpoint.current, responsiveValues]);

  return {
    breakpoint,
    device,
    layoutStyles,
    touchStyles,
    transitionStyles,
    optimization,
    utils,
  };
};

/**
 * 간단한 반응형 그리드 훅
 */
export const useResponsiveGrid = (
  columns: number | ResponsiveValue<number> = { mobile: 1, tablet: 2, desktop: 3 },
  gap: keyof typeof spacing | ResponsiveValue<keyof typeof spacing> = { mobile: 2, tablet: 4, desktop: 6 }
) => {
  const breakpoint = useBreakpoint();
  
  return useMemo(() => {
    const currentColumns = getResponsiveColumns(columns, breakpoint.current);
    const currentGap = getResponsiveSpacing(gap, breakpoint.current);

    return {
      columns: currentColumns,
      gap: currentGap,
      styles: {
        display: 'grid',
        gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
        gap: currentGap,
      } as React.CSSProperties,
    };
  }, [columns, gap, breakpoint.current]);
};

/**
 * 반응형 컨테이너 훅
 */
export const useResponsiveContainer = (
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' = 'lg',
  padding?: ResponsiveValue<keyof typeof spacing>
) => {
  const breakpoint = useBreakpoint();
  const prefersReducedMotion = usePrefersReducedMotion();

  return useMemo(() => {
    const currentPadding = getResponsiveContainerPadding(breakpoint.current, padding);
    const transitionStyles = getTransitionStyles({
      properties: ['padding', 'max-width'],
    }, prefersReducedMotion);

    return {
      padding: currentPadding,
      styles: {
        width: '100%',
        maxWidth: maxWidth === 'none' ? 'none' : `var(--container-${maxWidth})`,
        margin: '0 auto',
        padding: `0 ${currentPadding}`,
        ...transitionStyles,
      } as React.CSSProperties,
    };
  }, [maxWidth, padding, breakpoint.current, prefersReducedMotion]);
};

/**
 * 반응형 타이포그래피 훅
 */
export const useResponsiveTypography = (
  size: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body-lg' | 'body-md' | 'body-sm' | 'caption-lg' | 'caption-md' | 'caption-sm'
) => {
  const breakpoint = useBreakpoint();
  const prefersReducedMotion = usePrefersReducedMotion();

  return useMemo(() => {
    const typography = getResponsiveTypography(size, breakpoint.current);
    const transitionStyles = getTransitionStyles({
      properties: ['font-size', 'line-height'],
    }, prefersReducedMotion);

    return {
      ...typography,
      styles: {
        fontSize: typography.fontSize,
        lineHeight: typography.lineHeight,
        letterSpacing: typography.letterSpacing,
        ...transitionStyles,
      } as React.CSSProperties,
    };
  }, [size, breakpoint.current, prefersReducedMotion]);
};

/**
 * 터치 최적화 훅
 */
export const useTouchOptimization = (
  size: 'sm' | 'md' | 'lg' = 'md',
  enabled: boolean = true
) => {
  const device = useDeviceDetection();

  return useMemo(() => {
    if (!enabled || !device.isTouchDevice) {
      return {
        isTouchDevice: device.isTouchDevice,
        styles: {
          cursor: 'pointer',
          userSelect: 'none',
        } as React.CSSProperties,
      };
    }

    const touchStyles = getTouchOptimizedStyles(device.isTouchDevice, size);

    return {
      isTouchDevice: device.isTouchDevice,
      styles: touchStyles as React.CSSProperties,
    };
  }, [device.isTouchDevice, size, enabled]);
};

/**
 * 반응형 애니메이션 훅
 */
export const useResponsiveAnimation = (
  config: {
    duration?: number;
    easing?: string;
    properties?: string[];
  } = {}
) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const device = useDeviceDetection();

  return useMemo(() => {
    // 모바일에서는 애니메이션 성능 최적화
    const optimizedConfig = {
      duration: device.isMobile ? (config.duration || 250) * 0.8 : config.duration,
      easing: config.easing,
      properties: config.properties,
    };

    const styles = getTransitionStyles(optimizedConfig, prefersReducedMotion);

    return {
      prefersReducedMotion,
      isMobile: device.isMobile,
      styles,
      shouldAnimate: !prefersReducedMotion,
    };
  }, [config, prefersReducedMotion, device.isMobile]);
};