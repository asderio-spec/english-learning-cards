/**
 * Linear 디자인 시스템 - 포커스 트랩 훅
 * 모달, 드롭다운 등에서 포커스를 특정 영역 내에 가두는 기능
 */

import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  /** 포커스 트랩 활성화 여부 */
  enabled?: boolean;
  /** 초기 포커스를 받을 요소의 셀렉터 */
  initialFocus?: string;
  /** 포커스 트랩이 해제될 때 포커스를 받을 요소 */
  restoreFocus?: HTMLElement | null;
  /** ESC 키로 트랩 해제 허용 여부 */
  escapeDeactivates?: boolean;
  /** 트랩 해제 시 콜백 */
  onDeactivate?: () => void;
}

interface UseFocusTrapResult {
  /** 포커스 트랩 컨테이너 ref */
  trapRef: React.RefObject<HTMLElement>;
  /** 포커스 트랩 활성화 */
  activate: () => void;
  /** 포커스 트랩 비활성화 */
  deactivate: () => void;
  /** 현재 활성화 상태 */
  isActive: boolean;
}

/**
 * 포커스 가능한 요소들의 셀렉터
 */
const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'audio[controls]',
  'video[controls]',
  'iframe',
  'embed',
  'object',
  'summary',
  'dialog'
].join(', ');

/**
 * 포커스 트랩 훅
 * 
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const { trapRef, activate, deactivate } = useFocusTrap({
 *     enabled: isOpen,
 *     onDeactivate: onClose,
 *     escapeDeactivates: true
 *   });
 * 
 *   useEffect(() => {
 *     if (isOpen) {
 *       activate();
 *     } else {
 *       deactivate();
 *     }
 *   }, [isOpen, activate, deactivate]);
 * 
 *   return (
 *     <div ref={trapRef} role="dialog">
 *       <button>First focusable</button>
 *       <button onClick={onClose}>Close</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFocusTrap(options: UseFocusTrapOptions = {}): UseFocusTrapResult {
  const {
    enabled = true,
    initialFocus,
    restoreFocus,
    escapeDeactivates = true,
    onDeactivate
  } = options;

  const trapRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const isActiveRef = useRef(false);

  /**
   * 포커스 가능한 요소들을 찾는 함수
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!trapRef.current) return [];
    
    const elements = trapRef.current.querySelectorAll(FOCUSABLE_ELEMENTS);
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
   * 첫 번째 포커스 가능한 요소에 포커스
   */
  const focusFirstElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    
    if (initialFocus) {
      const initialElement = trapRef.current?.querySelector(initialFocus) as HTMLElement;
      if (initialElement) {
        initialElement.focus();
        return;
      }
    }
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [initialFocus, getFocusableElements]);

  /**
   * 마지막 포커스 가능한 요소에 포커스
   */
  const focusLastElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [getFocusableElements]);

  /**
   * Tab 키 핸들러
   */
  const handleTabKey = useCallback((event: KeyboardEvent) => {
    if (!isActiveRef.current || !trapRef.current) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab: 역방향 이동
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: 정방향 이동
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [getFocusableElements]);

  /**
   * 키보드 이벤트 핸들러
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActiveRef.current) return;

    switch (event.key) {
      case 'Tab':
        handleTabKey(event);
        break;
      case 'Escape':
        if (escapeDeactivates) {
          event.preventDefault();
          deactivate();
          onDeactivate?.();
        }
        break;
    }
  }, [handleTabKey, escapeDeactivates, onDeactivate]);

  /**
   * 포커스 트랩 활성화
   */
  const activate = useCallback(() => {
    if (!enabled || isActiveRef.current) return;

    // 현재 활성 요소 저장
    previousActiveElement.current = document.activeElement as HTMLElement;
    
    // 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown);
    
    // 첫 번째 요소에 포커스
    setTimeout(() => {
      focusFirstElement();
    }, 0);
    
    isActiveRef.current = true;
  }, [enabled, handleKeyDown, focusFirstElement]);

  /**
   * 포커스 트랩 비활성화
   */
  const deactivate = useCallback(() => {
    if (!isActiveRef.current) return;

    // 이벤트 리스너 제거
    document.removeEventListener('keydown', handleKeyDown);
    
    // 이전 포커스 복원
    const elementToFocus = restoreFocus || previousActiveElement.current;
    if (elementToFocus && elementToFocus.focus) {
      elementToFocus.focus();
    }
    
    isActiveRef.current = false;
  }, [handleKeyDown, restoreFocus]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (isActiveRef.current) {
        deactivate();
      }
    };
  }, [deactivate]);

  return {
    trapRef,
    activate,
    deactivate,
    isActive: isActiveRef.current
  };
}

export type { UseFocusTrapOptions, UseFocusTrapResult };