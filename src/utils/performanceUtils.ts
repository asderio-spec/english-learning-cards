/**
 * Performance optimization utilities
 * 성능 최적화 유틸리티
 */

import { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Memoization utilities for expensive calculations
 * 비싼 계산을 위한 메모이제이션 유틸리티
 */
export const memoUtils = {
  /**
   * Memoize color calculations
   * 색상 계산 메모이제이션
   */
  memoizeColorCalculations: <T extends Record<string, any>>(colors: T): T => {
    return useMemo(() => {
      // Expensive color calculations (e.g., contrast ratios, color mixing)
      const processedColors = { ...colors };
      
      // Add computed properties like contrast ratios
      Object.keys(processedColors).forEach(key => {
        if (typeof processedColors[key] === 'string' && processedColors[key].startsWith('#')) {
          // Calculate luminance for accessibility
          processedColors[`${key}Luminance`] = calculateLuminance(processedColors[key]);
        }
      });
      
      return processedColors;
    }, [colors]);
  },

  /**
   * Memoize typography calculations
   * 타이포그래피 계산 메모이제이션
   */
  memoizeTypographyCalculations: (typography: any) => {
    return useMemo(() => {
      // Calculate line heights, spacing, etc.
      return {
        ...typography,
        computedLineHeight: parseFloat(typography.lineHeight) * parseFloat(typography.fontSize),
        computedSpacing: parseFloat(typography.fontSize) * 0.5,
      };
    }, [typography]);
  },

  /**
   * Memoize responsive breakpoint calculations
   * 반응형 브레이크포인트 계산 메모이제이션
   */
  memoizeBreakpointCalculations: (breakpoints: Record<string, number>) => {
    return useMemo(() => {
      const sortedBreakpoints = Object.entries(breakpoints)
        .sort(([, a], [, b]) => a - b)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, number>);
      
      return {
        ...sortedBreakpoints,
        breakpointArray: Object.values(sortedBreakpoints),
        breakpointKeys: Object.keys(sortedBreakpoints),
      };
    }, [breakpoints]);
  },
};

/**
 * Callback optimization utilities
 * 콜백 최적화 유틸리티
 */
export const callbackUtils = {
  /**
   * Optimized event handlers
   * 최적화된 이벤트 핸들러
   */
  useOptimizedEventHandlers: (handlers: Record<string, (...args: any[]) => void>) => {
    return useMemo(() => {
      const optimizedHandlers: Record<string, (...args: any[]) => void> = {};
      
      Object.keys(handlers).forEach(key => {
        optimizedHandlers[key] = useCallback(handlers[key], [handlers[key]]);
      });
      
      return optimizedHandlers;
    }, [handlers]);
  },

  /**
   * Debounced callback
   * 디바운스된 콜백
   */
  useDebouncedCallback: <T extends (...args: any[]) => void>(
    callback: T,
    delay: number,
    deps: React.DependencyList
  ): T => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    
    return useCallback(
      ((...args: Parameters<T>) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          callback(...args);
        }, delay);
      }) as T,
      [callback, delay, ...deps]
    );
  },

  /**
   * Throttled callback
   * 스로틀된 콜백
   */
  useThrottledCallback: <T extends (...args: any[]) => void>(
    callback: T,
    delay: number,
    deps: React.DependencyList
  ): T => {
    const lastCallRef = useRef<number>(0);
    
    return useCallback(
      ((...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCallRef.current >= delay) {
          lastCallRef.current = now;
          callback(...args);
        }
      }) as T,
      [callback, delay, ...deps]
    );
  },
};

/**
 * Component optimization utilities
 * 컴포넌트 최적화 유틸리티
 */
export const componentUtils = {
  /**
   * Create memoized component with custom comparison
   * 커스텀 비교 함수를 가진 메모이제이션된 컴포넌트 생성
   */
  createMemoizedComponent: <P extends Record<string, any>>(
    Component: React.ComponentType<P>,
    propsAreEqual?: (prevProps: P, nextProps: P) => boolean
  ) => {
    return React.memo(Component, propsAreEqual);
  },

  /**
   * Shallow comparison for props
   * props의 얕은 비교
   */
  shallowEqual: <T extends Record<string, any>>(obj1: T, obj2: T): boolean => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) {
      return false;
    }
    
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    
    return true;
  },

  /**
   * Deep comparison for complex props
   * 복잡한 props의 깊은 비교
   */
  deepEqual: (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    
    if (obj1 == null || obj2 == null) return false;
    
    if (typeof obj1 !== typeof obj2) return false;
    
    if (typeof obj1 !== 'object') return obj1 === obj2;
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!componentUtils.deepEqual(obj1[key], obj2[key])) return false;
    }
    
    return true;
  },
};

/**
 * Virtualization utilities for long lists
 * 긴 목록을 위한 가상화 유틸리티
 */
export const virtualizationUtils = {
  /**
   * Calculate visible items for virtual scrolling
   * 가상 스크롤링을 위한 보이는 아이템 계산
   */
  useVirtualization: (
    itemCount: number,
    itemHeight: number,
    containerHeight: number,
    scrollTop: number,
    overscan: number = 5
  ) => {
    return useMemo(() => {
      const visibleStart = Math.floor(scrollTop / itemHeight);
      const visibleEnd = Math.min(
        itemCount - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight)
      );
      
      const startIndex = Math.max(0, visibleStart - overscan);
      const endIndex = Math.min(itemCount - 1, visibleEnd + overscan);
      
      return {
        startIndex,
        endIndex,
        visibleItems: endIndex - startIndex + 1,
        totalHeight: itemCount * itemHeight,
        offsetY: startIndex * itemHeight,
      };
    }, [itemCount, itemHeight, containerHeight, scrollTop, overscan]);
  },

  /**
   * Virtual list hook
   * 가상 리스트 훅
   */
  useVirtualList: <T>(
    items: T[],
    itemHeight: number,
    containerHeight: number
  ) => {
    const scrollElementRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, []);
    
    const virtualization = virtualizationUtils.useVirtualization(
      items.length,
      itemHeight,
      containerHeight,
      scrollTop
    );
    
    const visibleItems = useMemo(() => {
      return items.slice(virtualization.startIndex, virtualization.endIndex + 1);
    }, [items, virtualization.startIndex, virtualization.endIndex]);
    
    return {
      scrollElementRef,
      handleScroll,
      visibleItems,
      virtualization,
    };
  },
};

/**
 * Performance monitoring utilities
 * 성능 모니터링 유틸리티
 */
export const performanceMonitor = {
  /**
   * Measure component render time
   * 컴포넌트 렌더링 시간 측정
   */
  useRenderTime: (componentName: string) => {
    const renderStartRef = useRef<number>();
    
    useEffect(() => {
      renderStartRef.current = performance.now();
    });
    
    useEffect(() => {
      if (renderStartRef.current) {
        const renderTime = performance.now() - renderStartRef.current;
        if (process.env.NODE_ENV === 'development') {
          console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
        }
      }
    });
  },

  /**
   * Track re-renders
   * 리렌더링 추적
   */
  useRenderCount: (componentName: string) => {
    const renderCountRef = useRef(0);
    
    useEffect(() => {
      renderCountRef.current += 1;
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} rendered ${renderCountRef.current} times`);
      }
    });
    
    return renderCountRef.current;
  },
};

// Helper functions
function calculateLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Import React and useState
import React, { useState } from 'react';