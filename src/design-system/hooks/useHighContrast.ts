/**
 * Linear 디자인 시스템 - 고대비 모드 훅
 * 고대비 모드 감지 및 관리 기능
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  detectHighContrastMode, 
  addHighContrastListener,
  createHighContrastTheme,
  getSystemAccessibilityPreferences
} from '../utils/accessibility';

interface UseHighContrastOptions {
  /** 자동으로 시스템 설정을 따를지 여부 */
  followSystem?: boolean;
  /** 초기 고대비 모드 상태 */
  initialHighContrast?: boolean;
  /** 고대비 모드 변경 시 콜백 */
  onHighContrastChange?: (isHighContrast: boolean) => void;
}

interface UseHighContrastResult {
  /** 현재 고대비 모드 상태 */
  isHighContrast: boolean;
  /** 고대비 모드 토글 */
  toggleHighContrast: () => void;
  /** 고대비 모드 설정 */
  setHighContrast: (enabled: boolean) => void;
  /** 시스템 고대비 모드 상태 */
  systemHighContrast: boolean;
  /** 시스템 접근성 설정 */
  systemPreferences: ReturnType<typeof getSystemAccessibilityPreferences>;
  /** 고대비 테마 생성 함수 */
  createHighContrastTheme: typeof createHighContrastTheme;
}

/**
 * 고대비 모드 관리 훅
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { 
 *     isHighContrast, 
 *     toggleHighContrast, 
 *     systemPreferences 
 *   } = useHighContrast({
 *     followSystem: true,
 *     onHighContrastChange: (enabled) => {
 *       console.log('High contrast mode:', enabled);
 *     }
 *   });
 * 
 *   return (
 *     <div className={isHighContrast ? 'high-contrast' : ''}>
 *       <button onClick={toggleHighContrast}>
 *         고대비 모드 {isHighContrast ? '끄기' : '켜기'}
 *       </button>
 *       {systemPreferences.prefersReducedMotion && (
 *         <p>사용자가 애니메이션 감소를 선호합니다.</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useHighContrast(options: UseHighContrastOptions = {}): UseHighContrastResult {
  const {
    followSystem = true,
    initialHighContrast = false,
    onHighContrastChange
  } = options;

  const [systemHighContrast, setSystemHighContrast] = useState(() => 
    detectHighContrastMode()
  );
  
  const [manualHighContrast, setManualHighContrast] = useState(initialHighContrast);
  
  const [systemPreferences, setSystemPreferences] = useState(() => 
    getSystemAccessibilityPreferences()
  );

  // 실제 고대비 모드 상태 계산
  const isHighContrast = followSystem ? systemHighContrast : manualHighContrast;

  /**
   * 시스템 접근성 설정 업데이트
   */
  const updateSystemPreferences = useCallback(() => {
    const newPreferences = getSystemAccessibilityPreferences();
    setSystemPreferences(newPreferences);
    setSystemHighContrast(newPreferences.prefersHighContrast);
  }, []);

  /**
   * 고대비 모드 토글
   */
  const toggleHighContrast = useCallback(() => {
    const newValue = !manualHighContrast;
    setManualHighContrast(newValue);
    onHighContrastChange?.(followSystem ? systemHighContrast : newValue);
  }, [manualHighContrast, followSystem, systemHighContrast, onHighContrastChange]);

  /**
   * 고대비 모드 직접 설정
   */
  const setHighContrast = useCallback((enabled: boolean) => {
    setManualHighContrast(enabled);
    onHighContrastChange?.(followSystem ? systemHighContrast : enabled);
  }, [followSystem, systemHighContrast, onHighContrastChange]);

  // 시스템 고대비 모드 변경 감지
  useEffect(() => {
    const cleanup = addHighContrastListener((isHighContrast) => {
      setSystemHighContrast(isHighContrast);
      if (followSystem) {
        onHighContrastChange?.(isHighContrast);
      }
    });

    return cleanup;
  }, [followSystem, onHighContrastChange]);

  // 시스템 접근성 설정 변경 감지
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueries = [
      '(prefers-reduced-motion: reduce)',
      '(prefers-contrast: high)',
      '(prefers-reduced-transparency: reduce)',
      '(prefers-color-scheme: dark)',
      '(prefers-color-scheme: light)'
    ];

    const listeners: (() => void)[] = [];

    mediaQueries.forEach(query => {
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia(query);
        const handleChange = () => updateSystemPreferences();
        
        mediaQuery.addEventListener('change', handleChange);
        listeners.push(() => mediaQuery.removeEventListener('change', handleChange));
      }
    });

    return () => {
      listeners.forEach(cleanup => cleanup());
    };
  }, [updateSystemPreferences]);

  // 고대비 모드 변경 시 콜백 호출
  useEffect(() => {
    onHighContrastChange?.(isHighContrast);
  }, [isHighContrast, onHighContrastChange]);

  return {
    isHighContrast,
    toggleHighContrast,
    setHighContrast,
    systemHighContrast,
    systemPreferences,
    createHighContrastTheme
  };
}

/**
 * 고대비 CSS 클래스 관리 훅
 */
export function useHighContrastClass(
  className: string = 'high-contrast',
  target: HTMLElement | null = null
): boolean {
  const { isHighContrast } = useHighContrast();

  useEffect(() => {
    const element = target || document.documentElement;
    
    if (isHighContrast) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }

    return () => {
      element.classList.remove(className);
    };
  }, [isHighContrast, className, target]);

  return isHighContrast;
}

export type { UseHighContrastOptions, UseHighContrastResult };