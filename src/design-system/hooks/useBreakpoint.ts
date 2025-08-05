/**
 * Linear 디자인 시스템 - useBreakpoint 훅
 * 현재 화면 크기에 따른 브레이크포인트 감지
 */

import { useState, useEffect } from 'react';
import { breakpoints } from '../tokens/spacing';

export type BreakpointKey = keyof typeof breakpoints;
export type BreakpointValue = typeof breakpoints[BreakpointKey];

export interface BreakpointState {
  current: BreakpointKey;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  width: number;
  height: number;
}

/**
 * 현재 브레이크포인트를 감지하는 훅
 */
export const useBreakpoint = (): BreakpointState => {
  const [breakpointState, setBreakpointState] = useState<BreakpointState>(() => {
    // SSR 환경에서 기본값 설정
    if (typeof window === 'undefined') {
      return {
        current: 'mobile',
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        isWide: false,
        width: 320,
        height: 568,
      };
    }

    return getBreakpointState(window.innerWidth, window.innerHeight);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const newState = getBreakpointState(window.innerWidth, window.innerHeight);
      setBreakpointState(newState);
    };

    // 초기 상태 설정
    handleResize();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    // 정리 함수
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return breakpointState;
};

/**
 * 화면 크기에 따른 브레이크포인트 상태 계산
 */
function getBreakpointState(width: number, height: number): BreakpointState {
  let current: BreakpointKey = 'mobile';

  // 브레이크포인트 판단 (모바일 우선)
  if (width >= parseInt(breakpoints.wide)) {
    current = 'wide';
  } else if (width >= parseInt(breakpoints.desktop)) {
    current = 'desktop';
  } else if (width >= parseInt(breakpoints.tablet)) {
    current = 'tablet';
  } else {
    current = 'mobile';
  }

  return {
    current,
    isMobile: current === 'mobile',
    isTablet: current === 'tablet',
    isDesktop: current === 'desktop',
    isWide: current === 'wide',
    width,
    height,
  };
}

/**
 * 특정 브레이크포인트 이상인지 확인하는 유틸리티 훅
 */
export const useBreakpointUp = (breakpoint: BreakpointKey): boolean => {
  const { width } = useBreakpoint();
  const breakpointValue = parseInt(breakpoints[breakpoint]);
  
  return width >= breakpointValue;
};

/**
 * 특정 브레이크포인트 이하인지 확인하는 유틸리티 훅
 */
export const useBreakpointDown = (breakpoint: BreakpointKey): boolean => {
  const { width } = useBreakpoint();
  const breakpointValue = parseInt(breakpoints[breakpoint]);
  
  return width < breakpointValue;
};

/**
 * 특정 브레이크포인트 범위 내인지 확인하는 유틸리티 훅
 */
export const useBreakpointBetween = (
  minBreakpoint: BreakpointKey,
  maxBreakpoint: BreakpointKey
): boolean => {
  const { width } = useBreakpoint();
  const minValue = parseInt(breakpoints[minBreakpoint]);
  const maxValue = parseInt(breakpoints[maxBreakpoint]);
  
  return width >= minValue && width < maxValue;
};

/**
 * 현재 브레이크포인트가 특정 값과 일치하는지 확인하는 유틸리티 훅
 */
export const useBreakpointOnly = (breakpoint: BreakpointKey): boolean => {
  const { current } = useBreakpoint();
  return current === breakpoint;
};