/**
 * Linear 디자인 시스템 - 키보드 네비게이션 훅
 * 리스트, 메뉴, 그리드 등에서 키보드 네비게이션 기능 제공
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseKeyboardNavigationOptions {
  /** 네비게이션 방향 */
  orientation?: 'horizontal' | 'vertical' | 'both';
  /** 순환 네비게이션 허용 여부 */
  loop?: boolean;
  /** 활성화 여부 */
  enabled?: boolean;
  /** 초기 포커스 인덱스 */
  initialFocusIndex?: number;
  /** 포커스 변경 시 콜백 */
  onFocusChange?: (index: number, element: HTMLElement) => void;
  /** Enter/Space 키 활성화 시 콜백 */
  onActivate?: (index: number, element: HTMLElement) => void;
  /** 그리드 모드에서 열 개수 */
  gridColumns?: number;
}

interface UseKeyboardNavigationResult {
  /** 컨테이너 ref */
  containerRef: React.RefObject<HTMLElement>;
  /** 현재 포커스된 인덱스 */
  focusedIndex: number;
  /** 특정 인덱스로 포커스 이동 */
  setFocusedIndex: (index: number) => void;
  /** 다음 요소로 포커스 이동 */
  focusNext: () => void;
  /** 이전 요소로 포커스 이동 */
  focusPrevious: () => void;
  /** 첫 번째 요소로 포커스 이동 */
  focusFirst: () => void;
  /** 마지막 요소로 포커스 이동 */
  focusLast: () => void;
}

/**
 * 키보드 네비게이션 가능한 요소들의 셀렉터
 */
const NAVIGABLE_ELEMENTS = [
  '[role="button"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="tab"]',
  '[role="gridcell"]',
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

/**
 * 키보드 네비게이션 훅
 * 
 * @example
 * ```tsx
 * function Menu({ items }) {
 *   const { containerRef, focusedIndex, setFocusedIndex } = useKeyboardNavigation({
 *     orientation: 'vertical',
 *     loop: true,
 *     onActivate: (index) => {
 *       console.log('Activated item:', items[index]);
 *     }
 *   });
 * 
 *   return (
 *     <div ref={containerRef} role="menu">
 *       {items.map((item, index) => (
 *         <div
 *           key={index}
 *           role="menuitem"
 *           tabIndex={focusedIndex === index ? 0 : -1}
 *           onClick={() => setFocusedIndex(index)}
 *         >
 *           {item.label}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useKeyboardNavigation(
  options: UseKeyboardNavigationOptions = {}
): UseKeyboardNavigationResult {
  const {
    orientation = 'vertical',
    loop = false,
    enabled = true,
    initialFocusIndex = -1,
    onFocusChange,
    onActivate,
    gridColumns
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const [focusedIndex, setFocusedIndexState] = useState(initialFocusIndex);

  /**
   * 네비게이션 가능한 요소들을 찾는 함수
   */
  const getNavigableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const elements = containerRef.current.querySelectorAll(NAVIGABLE_ELEMENTS);
    return Array.from(elements).filter((element) => {
      const htmlElement = element as HTMLElement;
      return (
        htmlElement.offsetWidth > 0 ||
        htmlElement.offsetHeight > 0 ||
        htmlElement.getClientRects().length > 0
      );
    }) as HTMLElement[];
  }, []);

  /**
   * 포커스 인덱스 설정 및 실제 포커스 이동
   */
  const setFocusedIndex = useCallback((index: number) => {
    const elements = getNavigableElements();
    if (elements.length === 0) return;

    const clampedIndex = Math.max(0, Math.min(index, elements.length - 1));
    const element = elements[clampedIndex];
    
    if (element) {
      setFocusedIndexState(clampedIndex);
      element.focus();
      onFocusChange?.(clampedIndex, element);
    }
  }, [getNavigableElements, onFocusChange]);

  /**
   * 다음 요소로 포커스 이동
   */
  const focusNext = useCallback(() => {
    const elements = getNavigableElements();
    if (elements.length === 0) return;

    let nextIndex = focusedIndex + 1;
    
    if (nextIndex >= elements.length) {
      nextIndex = loop ? 0 : elements.length - 1;
    }
    
    setFocusedIndex(nextIndex);
  }, [focusedIndex, loop, getNavigableElements, setFocusedIndex]);

  /**
   * 이전 요소로 포커스 이동
   */
  const focusPrevious = useCallback(() => {
    const elements = getNavigableElements();
    if (elements.length === 0) return;

    let prevIndex = focusedIndex - 1;
    
    if (prevIndex < 0) {
      prevIndex = loop ? elements.length - 1 : 0;
    }
    
    setFocusedIndex(prevIndex);
  }, [focusedIndex, loop, getNavigableElements, setFocusedIndex]);

  /**
   * 첫 번째 요소로 포커스 이동
   */
  const focusFirst = useCallback(() => {
    setFocusedIndex(0);
  }, [setFocusedIndex]);

  /**
   * 마지막 요소로 포커스 이동
   */
  const focusLast = useCallback(() => {
    const elements = getNavigableElements();
    if (elements.length > 0) {
      setFocusedIndex(elements.length - 1);
    }
  }, [getNavigableElements, setFocusedIndex]);

  /**
   * 그리드 네비게이션 - 위로 이동
   */
  const focusUp = useCallback(() => {
    if (!gridColumns) return;
    
    const newIndex = focusedIndex - gridColumns;
    if (newIndex >= 0) {
      setFocusedIndex(newIndex);
    } else if (loop) {
      const elements = getNavigableElements();
      const lastRowStart = Math.floor((elements.length - 1) / gridColumns) * gridColumns;
      const columnIndex = focusedIndex % gridColumns;
      const targetIndex = Math.min(lastRowStart + columnIndex, elements.length - 1);
      setFocusedIndex(targetIndex);
    }
  }, [focusedIndex, gridColumns, loop, getNavigableElements, setFocusedIndex]);

  /**
   * 그리드 네비게이션 - 아래로 이동
   */
  const focusDown = useCallback(() => {
    if (!gridColumns) return;
    
    const elements = getNavigableElements();
    const newIndex = focusedIndex + gridColumns;
    
    if (newIndex < elements.length) {
      setFocusedIndex(newIndex);
    } else if (loop) {
      const columnIndex = focusedIndex % gridColumns;
      setFocusedIndex(columnIndex);
    }
  }, [focusedIndex, gridColumns, loop, getNavigableElements, setFocusedIndex]);

  /**
   * 키보드 이벤트 핸들러
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || focusedIndex === -1) return;

    const elements = getNavigableElements();
    if (elements.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (orientation === 'vertical' || orientation === 'both') {
          if (gridColumns) {
            focusDown();
          } else {
            focusNext();
          }
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (orientation === 'vertical' || orientation === 'both') {
          if (gridColumns) {
            focusUp();
          } else {
            focusPrevious();
          }
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (orientation === 'horizontal' || orientation === 'both') {
          focusNext();
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (orientation === 'horizontal' || orientation === 'both') {
          focusPrevious();
        }
        break;

      case 'Home':
        event.preventDefault();
        focusFirst();
        break;

      case 'End':
        event.preventDefault();
        focusLast();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        const currentElement = elements[focusedIndex];
        if (currentElement) {
          onActivate?.(focusedIndex, currentElement);
          // 버튼이나 링크인 경우 클릭 이벤트 발생
          if (currentElement.tagName === 'BUTTON' || currentElement.tagName === 'A') {
            currentElement.click();
          }
        }
        break;
    }
  }, [
    enabled,
    focusedIndex,
    orientation,
    gridColumns,
    getNavigableElements,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    focusUp,
    focusDown,
    onActivate
  ]);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  // 초기 포커스 설정
  useEffect(() => {
    if (initialFocusIndex >= 0 && focusedIndex === -1) {
      setFocusedIndex(initialFocusIndex);
    }
  }, [initialFocusIndex, focusedIndex, setFocusedIndex]);

  return {
    containerRef,
    focusedIndex,
    setFocusedIndex,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast
  };
}

export type { UseKeyboardNavigationOptions, UseKeyboardNavigationResult };