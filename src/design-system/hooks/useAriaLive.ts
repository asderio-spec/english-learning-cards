/**
 * Linear 디자인 시스템 - ARIA Live Region 관리 훅
 * 스크린 리더 사용자에게 동적 콘텐츠 변경사항을 알리는 기능
 */

import { useCallback, useEffect, useRef } from 'react';

type AriaLivePoliteness = 'polite' | 'assertive' | 'off';

interface UseAriaLiveOptions {
  /** Live region의 politeness 레벨 */
  politeness?: AriaLivePoliteness;
  /** Live region이 항상 DOM에 존재할지 여부 */
  persistent?: boolean;
  /** 메시지 지속 시간 (ms) */
  duration?: number;
  /** 중복 메시지 필터링 여부 */
  filterDuplicates?: boolean;
}

interface UseAriaLiveResult {
  /** 메시지 발표 함수 */
  announce: (message: string, politeness?: AriaLivePoliteness) => void;
  /** 현재 메시지 지우기 */
  clear: () => void;
  /** Live region 요소 ref */
  liveRegionRef: React.RefObject<HTMLDivElement>;
}

/**
 * ARIA Live Region 관리 훅
 * 
 * @example
 * ```tsx
 * function StatusComponent() {
 *   const { announce, liveRegionRef } = useAriaLive({
 *     politeness: 'polite',
 *     duration: 3000
 *   });
 * 
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       announce('데이터가 성공적으로 저장되었습니다.');
 *     } catch (error) {
 *       announce('저장 중 오류가 발생했습니다.', 'assertive');
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={handleSave}>저장</button>
 *       <div ref={liveRegionRef} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useAriaLive(options: UseAriaLiveOptions = {}): UseAriaLiveResult {
  const {
    politeness = 'polite',
    persistent = true,
    duration = 0,
    filterDuplicates = true
  } = options;

  const liveRegionRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Live region 요소 생성 또는 가져오기
   */
  const getLiveRegion = useCallback((targetPoliteness: AriaLivePoliteness = politeness) => {
    // 기존 ref가 있으면 사용
    if (liveRegionRef.current) {
      return liveRegionRef.current;
    }

    // 전역 live region 찾기 또는 생성
    const existingRegion = document.querySelector(`[data-live-region="${targetPoliteness}"]`);
    if (existingRegion) {
      return existingRegion as HTMLDivElement;
    }

    // 새 live region 생성
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', targetPoliteness);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('data-live-region', targetPoliteness);
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';

    document.body.appendChild(liveRegion);
    return liveRegion;
  }, [politeness]);

  /**
   * 메시지 발표 함수
   */
  const announce = useCallback((
    message: string,
    targetPoliteness: AriaLivePoliteness = politeness
  ) => {
    if (!message.trim()) return;

    // 중복 메시지 필터링
    if (filterDuplicates && message === lastMessageRef.current) {
      return;
    }

    const liveRegion = getLiveRegion(targetPoliteness);
    if (!liveRegion) return;

    // 이전 타이머 정리
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 메시지 설정
    liveRegion.textContent = message;
    lastMessageRef.current = message;

    // 지속 시간이 설정된 경우 자동으로 메시지 지우기
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        if (liveRegion.textContent === message) {
          liveRegion.textContent = '';
        }
      }, duration);
    }
  }, [politeness, filterDuplicates, getLiveRegion, duration]);

  /**
   * 현재 메시지 지우기
   */
  const clear = useCallback(() => {
    const liveRegion = getLiveRegion();
    if (liveRegion) {
      liveRegion.textContent = '';
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    lastMessageRef.current = '';
  }, [getLiveRegion]);

  // 컴포넌트 마운트 시 live region 초기화
  useEffect(() => {
    if (persistent) {
      getLiveRegion();
    }
  }, [persistent, getLiveRegion]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // persistent가 false인 경우 live region 제거
      if (!persistent && liveRegionRef.current) {
        liveRegionRef.current.remove();
      }
    };
  }, [persistent]);

  return {
    announce,
    clear,
    liveRegionRef
  };
}

/**
 * 전역 ARIA Live Region 관리자
 */
class AriaLiveManager {
  private static instance: AriaLiveManager;
  private regions: Map<AriaLivePoliteness, HTMLDivElement> = new Map();

  static getInstance(): AriaLiveManager {
    if (!AriaLiveManager.instance) {
      AriaLiveManager.instance = new AriaLiveManager();
    }
    return AriaLiveManager.instance;
  }

  /**
   * 전역 메시지 발표
   */
  announce(message: string, politeness: AriaLivePoliteness = 'polite'): void {
    if (!message.trim()) return;

    let region = this.regions.get(politeness);
    
    if (!region) {
      region = this.createLiveRegion(politeness);
      this.regions.set(politeness, region);
    }

    region.textContent = message;
  }

  /**
   * Live region 생성
   */
  private createLiveRegion(politeness: AriaLivePoliteness): HTMLDivElement {
    const region = document.createElement('div');
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('data-global-live-region', politeness);
    region.style.position = 'absolute';
    region.style.left = '-10000px';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.overflow = 'hidden';

    document.body.appendChild(region);
    return region;
  }

  /**
   * 모든 live region 정리
   */
  cleanup(): void {
    this.regions.forEach((region) => {
      region.remove();
    });
    this.regions.clear();
  }
}

/**
 * 전역 ARIA Live 발표 함수
 */
export const announceGlobally = (
  message: string,
  politeness: AriaLivePoliteness = 'polite'
): void => {
  AriaLiveManager.getInstance().announce(message, politeness);
};

/**
 * 전역 ARIA Live 정리 함수
 */
export const cleanupGlobalAriaLive = (): void => {
  AriaLiveManager.getInstance().cleanup();
};

export type { AriaLivePoliteness, UseAriaLiveOptions, UseAriaLiveResult };