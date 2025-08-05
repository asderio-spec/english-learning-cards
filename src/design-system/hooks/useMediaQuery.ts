/**
 * Linear 디자인 시스템 - useMediaQuery 훅
 * CSS 미디어 쿼리를 React에서 사용하기 위한 훅
 */

import { useState, useEffect } from 'react';

/**
 * CSS 미디어 쿼리 상태를 감지하는 훅
 * @param query - CSS 미디어 쿼리 문자열
 * @returns 미디어 쿼리 매치 여부
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    // SSR 환경에서 기본값 설정
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 초기 상태 설정
    setMatches(mediaQueryList.matches);

    // 이벤트 리스너 등록
    mediaQueryList.addEventListener('change', handleChange);

    // 정리 함수
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

/**
 * 다크 모드 선호도를 감지하는 훅
 */
export const usePrefersDarkMode = (): boolean => {
  return useMediaQuery('(prefers-color-scheme: dark)');
};

/**
 * 애니메이션 감소 선호도를 감지하는 훅
 */
export const usePrefersReducedMotion = (): boolean => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

/**
 * 고대비 모드 선호도를 감지하는 훅
 */
export const usePrefersHighContrast = (): boolean => {
  return useMediaQuery('(prefers-contrast: high)');
};

/**
 * 터치 디바이스 감지 훅
 */
export const useIsTouchDevice = (): boolean => {
  return useMediaQuery('(hover: none) and (pointer: coarse)');
};

/**
 * 세로 방향 감지 훅
 */
export const useIsPortrait = (): boolean => {
  return useMediaQuery('(orientation: portrait)');
};

/**
 * 가로 방향 감지 훅
 */
export const useIsLandscape = (): boolean => {
  return useMediaQuery('(orientation: landscape)');
};

/**
 * 프린트 모드 감지 훅
 */
export const useIsPrintMode = (): boolean => {
  return useMediaQuery('print');
};

/**
 * 특정 해상도 이상 감지 훅
 */
export const useIsHighDPI = (): boolean => {
  return useMediaQuery('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)');
};

/**
 * 미디어 쿼리 유틸리티 객체
 */
export const mediaQueries = {
  // 브레이크포인트
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px) and (max-width: 1439px)',
  wide: '(min-width: 1440px)',
  
  // 브레이크포인트 이상
  tabletUp: '(min-width: 768px)',
  desktopUp: '(min-width: 1024px)',
  wideUp: '(min-width: 1440px)',
  
  // 브레이크포인트 이하
  mobileDown: '(max-width: 767px)',
  tabletDown: '(max-width: 1023px)',
  desktopDown: '(max-width: 1439px)',
  
  // 방향
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  
  // 디바이스 특성
  touch: '(hover: none) and (pointer: coarse)',
  mouse: '(hover: hover) and (pointer: fine)',
  
  // 사용자 선호도
  darkMode: '(prefers-color-scheme: dark)',
  lightMode: '(prefers-color-scheme: light)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  highContrast: '(prefers-contrast: high)',
  
  // 해상도
  highDPI: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // 프린트
  print: 'print',
  screen: 'screen',
} as const;

/**
 * 여러 미디어 쿼리를 동시에 감지하는 훅
 */
export const useMediaQueries = (queries: Record<string, string>) => {
  const [matches, setMatches] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') {
      return Object.keys(queries).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>);
    }

    return Object.entries(queries).reduce((acc, [key, query]) => {
      acc[key] = window.matchMedia(query).matches;
      return acc;
    }, {} as Record<string, boolean>);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryLists = Object.entries(queries).map(([key, query]) => ({
      key,
      mql: window.matchMedia(query),
    }));

    const handleChange = () => {
      const newMatches = mediaQueryLists.reduce((acc, { key, mql }) => {
        acc[key] = mql.matches;
        return acc;
      }, {} as Record<string, boolean>);
      
      setMatches(newMatches);
    };

    // 초기 상태 설정
    handleChange();

    // 이벤트 리스너 등록
    mediaQueryLists.forEach(({ mql }) => {
      mql.addEventListener('change', handleChange);
    });

    // 정리 함수
    return () => {
      mediaQueryLists.forEach(({ mql }) => {
        mql.removeEventListener('change', handleChange);
      });
    };
  }, [queries]);

  return matches;
};