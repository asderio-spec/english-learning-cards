/**
 * useKeyboardNavigation 훅 테스트
 */

import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useKeyboardNavigation } from '../useKeyboardNavigation';

// DOM 환경 설정
const createTestContainer = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div id="nav-container" role="menu">
      <button id="item-0" role="menuitem">Item 0</button>
      <button id="item-1" role="menuitem">Item 1</button>
      <button id="item-2" role="menuitem">Item 2</button>
      <button id="item-3" role="menuitem">Item 3</button>
    </div>
  `;
  document.body.appendChild(container);
  return container;
};

const createGridContainer = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div id="grid-container" role="grid">
      <div id="cell-0" role="gridcell" tabindex="0">Cell 0</div>
      <div id="cell-1" role="gridcell" tabindex="-1">Cell 1</div>
      <div id="cell-2" role="gridcell" tabindex="-1">Cell 2</div>
      <div id="cell-3" role="gridcell" tabindex="-1">Cell 3</div>
      <div id="cell-4" role="gridcell" tabindex="-1">Cell 4</div>
      <div id="cell-5" role="gridcell" tabindex="-1">Cell 5</div>
    </div>
  `;
  document.body.appendChild(container);
  return container;
};

describe('useKeyboardNavigation', () => {
  let container: HTMLElement;
  let navContainer: HTMLElement;

  beforeEach(() => {
    container = createTestContainer();
    navContainer = container.querySelector('#nav-container') as HTMLElement;
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('기본 기능', () => {
    it('containerRef와 네비게이션 함수들을 반환한다', () => {
      const { result } = renderHook(() => useKeyboardNavigation());
      
      expect(result.current.containerRef).toBeDefined();
      expect(typeof result.current.setFocusedIndex).toBe('function');
      expect(typeof result.current.focusNext).toBe('function');
      expect(typeof result.current.focusPrevious).toBe('function');
      expect(typeof result.current.focusFirst).toBe('function');
      expect(typeof result.current.focusLast).toBe('function');
      expect(result.current.focusedIndex).toBe(-1);
    });

    it('초기 포커스 인덱스를 설정할 수 있다', () => {
      const { result } = renderHook(() => 
        useKeyboardNavigation({ initialFocusIndex: 2 })
      );
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
      });

      expect(result.current.focusedIndex).toBe(2);
    });
  });

  describe('포커스 이동', () => {
    it('setFocusedIndex로 특정 인덱스에 포커스한다', () => {
      const onFocusChange = vi.fn();
      const { result } = renderHook(() => 
        useKeyboardNavigation({ onFocusChange })
      );
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
      });

      const targetElement = navContainer.querySelector('#item-2') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      act(() => {
        result.current.setFocusedIndex(2);
      });

      expect(result.current.focusedIndex).toBe(2);
      expect(focusSpy).toHaveBeenCalled();
      expect(onFocusChange).toHaveBeenCalledWith(2, targetElement);
    });

    it('focusNext로 다음 요소로 이동한다', () => {
      const { result } = renderHook(() => useKeyboardNavigation());
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(1);
      });

      const targetElement = navContainer.querySelector('#item-2') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      act(() => {
        result.current.focusNext();
      });

      expect(result.current.focusedIndex).toBe(2);
      expect(focusSpy).toHaveBeenCalled();
    });

    it('focusPrevious로 이전 요소로 이동한다', () => {
      const { result } = renderHook(() => useKeyboardNavigation());
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(2);
      });

      const targetElement = navContainer.querySelector('#item-1') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      act(() => {
        result.current.focusPrevious();
      });

      expect(result.current.focusedIndex).toBe(1);
      expect(focusSpy).toHaveBeenCalled();
    });

    it('focusFirst로 첫 번째 요소로 이동한다', () => {
      const { result } = renderHook(() => useKeyboardNavigation());
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(2);
      });

      const targetElement = navContainer.querySelector('#item-0') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      act(() => {
        result.current.focusFirst();
      });

      expect(result.current.focusedIndex).toBe(0);
      expect(focusSpy).toHaveBeenCalled();
    });

    it('focusLast로 마지막 요소로 이동한다', () => {
      const { result } = renderHook(() => useKeyboardNavigation());
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(1);
      });

      const targetElement = navContainer.querySelector('#item-3') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      act(() => {
        result.current.focusLast();
      });

      expect(result.current.focusedIndex).toBe(3);
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('순환 네비게이션', () => {
    it('loop가 true일 때 마지막에서 다음으로 가면 첫 번째로 이동한다', () => {
      const { result } = renderHook(() => 
        useKeyboardNavigation({ loop: true })
      );
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(3); // 마지막 요소
      });

      const targetElement = navContainer.querySelector('#item-0') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      act(() => {
        result.current.focusNext();
      });

      expect(result.current.focusedIndex).toBe(0);
      expect(focusSpy).toHaveBeenCalled();
    });

    it('loop가 true일 때 첫 번째에서 이전으로 가면 마지막으로 이동한다', () => {
      const { result } = renderHook(() => 
        useKeyboardNavigation({ loop: true })
      );
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(0); // 첫 번째 요소
      });

      const targetElement = navContainer.querySelector('#item-3') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      act(() => {
        result.current.focusPrevious();
      });

      expect(result.current.focusedIndex).toBe(3);
      expect(focusSpy).toHaveBeenCalled();
    });

    it('loop가 false일 때 경계에서 멈춘다', () => {
      const { result } = renderHook(() => 
        useKeyboardNavigation({ loop: false })
      );
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(3); // 마지막 요소
      });

      act(() => {
        result.current.focusNext();
      });

      expect(result.current.focusedIndex).toBe(3); // 변경되지 않음
    });
  });

  describe('키보드 이벤트 처리', () => {
    it('ArrowDown 키로 다음 요소로 이동한다 (vertical)', () => {
      const { result } = renderHook(() => 
        useKeyboardNavigation({ orientation: 'vertical' })
      );
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(1);
      });

      const targetElement = navContainer.querySelector('#item-2') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(arrowDownEvent);
      });

      expect(result.current.focusedIndex).toBe(2);
      expect(focusSpy).toHaveBeenCalled();
      expect(arrowDownEvent.defaultPrevented).toBe(true);
    });

    it('ArrowUp 키로 이전 요소로 이동한다 (vertical)', () => {
      const { result } = renderHook(() => 
        useKeyboardNavigation({ orientation: 'vertical' })
      );
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(2);
      });

      const targetElement = navContainer.querySelector('#item-1') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      const arrowUpEvent = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(arrowUpEvent);
      });

      expect(result.current.focusedIndex).toBe(1);
      expect(focusSpy).toHaveBeenCalled();
      expect(arrowUpEvent.defaultPrevented).toBe(true);
    });

    it('ArrowRight 키로 다음 요소로 이동한다 (horizontal)', () => {
      const { result } = renderHook(() => 
        useKeyboardNavigation({ orientation: 'horizontal' })
      );
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(1);
      });

      const targetElement = navContainer.querySelector('#item-2') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      const arrowRightEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(arrowRightEvent);
      });

      expect(result.current.focusedIndex).toBe(2);
      expect(focusSpy).toHaveBeenCalled();
      expect(arrowRightEvent.defaultPrevented).toBe(true);
    });

    it('Home 키로 첫 번째 요소로 이동한다', () => {
      const { result } = renderHook(() => useKeyboardNavigation());
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(2);
      });

      const targetElement = navContainer.querySelector('#item-0') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      const homeEvent = new KeyboardEvent('keydown', {
        key: 'Home',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(homeEvent);
      });

      expect(result.current.focusedIndex).toBe(0);
      expect(focusSpy).toHaveBeenCalled();
      expect(homeEvent.defaultPrevented).toBe(true);
    });

    it('End 키로 마지막 요소로 이동한다', () => {
      const { result } = renderHook(() => useKeyboardNavigation());
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(1);
      });

      const targetElement = navContainer.querySelector('#item-3') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      const endEvent = new KeyboardEvent('keydown', {
        key: 'End',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(endEvent);
      });

      expect(result.current.focusedIndex).toBe(3);
      expect(focusSpy).toHaveBeenCalled();
      expect(endEvent.defaultPrevented).toBe(true);
    });

    it('Enter 키로 요소를 활성화한다', () => {
      const onActivate = vi.fn();
      const { result } = renderHook(() => 
        useKeyboardNavigation({ onActivate })
      );
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(1);
      });

      const targetElement = navContainer.querySelector('#item-1') as HTMLElement;
      const clickSpy = vi.spyOn(targetElement, 'click');

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(enterEvent);
      });

      expect(onActivate).toHaveBeenCalledWith(1, targetElement);
      expect(clickSpy).toHaveBeenCalled();
      expect(enterEvent.defaultPrevented).toBe(true);
    });
  });

  describe('그리드 네비게이션', () => {
    let gridContainer: HTMLElement;

    beforeEach(() => {
      if (container) {
        document.body.removeChild(container);
      }
      container = createGridContainer();
      gridContainer = container.querySelector('#grid-container') as HTMLElement;
    });

    it('그리드에서 ArrowDown으로 아래 행으로 이동한다', () => {
      const { result } = renderHook(() => 
        useKeyboardNavigation({ 
          orientation: 'both',
          gridColumns: 3 
        })
      );
      
      act(() => {
        (result.current.containerRef as any).current = gridContainer;
        result.current.setFocusedIndex(1); // 첫 번째 행, 두 번째 열
      });

      const targetElement = gridContainer.querySelector('#cell-4') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(arrowDownEvent);
      });

      expect(result.current.focusedIndex).toBe(4); // 두 번째 행, 두 번째 열
      expect(focusSpy).toHaveBeenCalled();
    });

    it('그리드에서 ArrowUp으로 위 행으로 이동한다', () => {
      const { result } = renderHook(() => 
        useKeyboardNavigation({ 
          orientation: 'both',
          gridColumns: 3 
        })
      );
      
      act(() => {
        (result.current.containerRef as any).current = gridContainer;
        result.current.setFocusedIndex(4); // 두 번째 행, 두 번째 열
      });

      const targetElement = gridContainer.querySelector('#cell-1') as HTMLElement;
      const focusSpy = vi.spyOn(targetElement, 'focus');

      const arrowUpEvent = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(arrowUpEvent);
      });

      expect(result.current.focusedIndex).toBe(1); // 첫 번째 행, 두 번째 열
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('비활성화 상태', () => {
    it('enabled가 false일 때 키보드 이벤트를 처리하지 않는다', () => {
      const { result } = renderHook(() => 
        useKeyboardNavigation({ enabled: false })
      );
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        result.current.setFocusedIndex(1);
      });

      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(arrowDownEvent);
      });

      expect(result.current.focusedIndex).toBe(1); // 변경되지 않음
      expect(arrowDownEvent.defaultPrevented).toBe(false);
    });

    it('focusedIndex가 -1일 때 키보드 이벤트를 처리하지 않는다', () => {
      const { result } = renderHook(() => useKeyboardNavigation());
      
      act(() => {
        (result.current.containerRef as any).current = navContainer;
        // focusedIndex를 -1로 유지
      });

      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(arrowDownEvent);
      });

      expect(result.current.focusedIndex).toBe(-1); // 변경되지 않음
      expect(arrowDownEvent.defaultPrevented).toBe(false);
    });
  });
});