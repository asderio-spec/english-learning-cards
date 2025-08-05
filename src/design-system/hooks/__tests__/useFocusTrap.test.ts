/**
 * useFocusTrap 훅 테스트
 */

import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useFocusTrap } from '../useFocusTrap';

// DOM 환경 설정
const createTestContainer = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <button id="outside-before">Outside Before</button>
    <div id="trap-container">
      <button id="first-button">First Button</button>
      <input id="text-input" type="text" />
      <button id="last-button">Last Button</button>
    </div>
    <button id="outside-after">Outside After</button>
  `;
  document.body.appendChild(container);
  return container;
};

describe('useFocusTrap', () => {
  let container: HTMLElement;
  let trapContainer: HTMLElement;

  beforeEach(() => {
    container = createTestContainer();
    trapContainer = container.querySelector('#trap-container') as HTMLElement;
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('기본 기능', () => {
    it('trapRef를 올바르게 반환한다', () => {
      const { result } = renderHook(() => useFocusTrap());
      
      expect(result.current.trapRef).toBeDefined();
      expect(result.current.trapRef.current).toBeNull();
    });

    it('activate와 deactivate 함수를 제공한다', () => {
      const { result } = renderHook(() => useFocusTrap());
      
      expect(typeof result.current.activate).toBe('function');
      expect(typeof result.current.deactivate).toBe('function');
      expect(result.current.isActive).toBe(false);
    });
  });

  describe('포커스 트랩 활성화', () => {
    it('activate 호출 시 첫 번째 포커스 가능한 요소에 포커스한다', async () => {
      const { result } = renderHook(() => useFocusTrap());
      
      // trapRef에 컨테이너 연결
      act(() => {
        if (result.current.trapRef.current !== trapContainer) {
          (result.current.trapRef as any).current = trapContainer;
        }
      });

      const firstButton = trapContainer.querySelector('#first-button') as HTMLButtonElement;
      const focusSpy = vi.spyOn(firstButton, 'focus');

      act(() => {
        result.current.activate();
      });

      // setTimeout으로 인한 비동기 처리 대기
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(focusSpy).toHaveBeenCalled();
    });

    it('initialFocus 옵션이 있을 때 해당 요소에 포커스한다', async () => {
      const { result } = renderHook(() => 
        useFocusTrap({ initialFocus: '#text-input' })
      );
      
      act(() => {
        (result.current.trapRef as any).current = trapContainer;
      });

      const textInput = trapContainer.querySelector('#text-input') as HTMLInputElement;
      const focusSpy = vi.spyOn(textInput, 'focus');

      act(() => {
        result.current.activate();
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('키보드 네비게이션', () => {
    it('Tab 키로 다음 요소로 이동한다', () => {
      const { result } = renderHook(() => useFocusTrap());
      
      act(() => {
        (result.current.trapRef as any).current = trapContainer;
        result.current.activate();
      });

      const firstButton = trapContainer.querySelector('#first-button') as HTMLButtonElement;
      const textInput = trapContainer.querySelector('#text-input') as HTMLInputElement;
      
      // 첫 번째 버튼에 포커스
      firstButton.focus();
      
      // Tab 키 이벤트 시뮬레이션
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(tabEvent);
      });

      // 실제 포커스 이동은 브라우저에서 처리되므로 이벤트가 발생했는지만 확인
      expect(tabEvent.defaultPrevented).toBe(false);
    });

    it('마지막 요소에서 Tab 키 누르면 첫 번째 요소로 순환한다', () => {
      const { result } = renderHook(() => useFocusTrap());
      
      act(() => {
        (result.current.trapRef as any).current = trapContainer;
        result.current.activate();
      });

      const lastButton = trapContainer.querySelector('#last-button') as HTMLButtonElement;
      const firstButton = trapContainer.querySelector('#first-button') as HTMLButtonElement;
      
      // 마지막 버튼에 포커스
      lastButton.focus();
      
      const focusSpy = vi.spyOn(firstButton, 'focus');
      
      // Tab 키 이벤트 시뮬레이션
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(tabEvent);
      });

      expect(focusSpy).toHaveBeenCalled();
      expect(tabEvent.defaultPrevented).toBe(true);
    });

    it('Shift+Tab으로 이전 요소로 이동한다', () => {
      const { result } = renderHook(() => useFocusTrap());
      
      act(() => {
        (result.current.trapRef as any).current = trapContainer;
        result.current.activate();
      });

      const firstButton = trapContainer.querySelector('#first-button') as HTMLButtonElement;
      const lastButton = trapContainer.querySelector('#last-button') as HTMLButtonElement;
      
      // 첫 번째 버튼에 포커스
      firstButton.focus();
      
      const focusSpy = vi.spyOn(lastButton, 'focus');
      
      // Shift+Tab 키 이벤트 시뮬레이션
      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(shiftTabEvent);
      });

      expect(focusSpy).toHaveBeenCalled();
      expect(shiftTabEvent.defaultPrevented).toBe(true);
    });
  });

  describe('ESC 키 처리', () => {
    it('ESC 키로 트랩을 비활성화한다', () => {
      const onDeactivate = vi.fn();
      const { result } = renderHook(() => 
        useFocusTrap({ 
          escapeDeactivates: true,
          onDeactivate 
        })
      );
      
      act(() => {
        (result.current.trapRef as any).current = trapContainer;
        result.current.activate();
      });

      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(escEvent);
      });

      expect(onDeactivate).toHaveBeenCalled();
      expect(escEvent.defaultPrevented).toBe(true);
    });

    it('escapeDeactivates가 false일 때 ESC 키를 무시한다', () => {
      const onDeactivate = vi.fn();
      const { result } = renderHook(() => 
        useFocusTrap({ 
          escapeDeactivates: false,
          onDeactivate 
        })
      );
      
      act(() => {
        (result.current.trapRef as any).current = trapContainer;
        result.current.activate();
      });

      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true
      });

      act(() => {
        document.dispatchEvent(escEvent);
      });

      expect(onDeactivate).not.toHaveBeenCalled();
      expect(escEvent.defaultPrevented).toBe(false);
    });
  });

  describe('포커스 복원', () => {
    it('deactivate 시 이전 포커스를 복원한다', () => {
      const outsideButton = container.querySelector('#outside-before') as HTMLButtonElement;
      const focusSpy = vi.spyOn(outsideButton, 'focus');
      
      // 외부 버튼에 포커스
      outsideButton.focus();
      
      const { result } = renderHook(() => useFocusTrap());
      
      act(() => {
        (result.current.trapRef as any).current = trapContainer;
        result.current.activate();
      });

      act(() => {
        result.current.deactivate();
      });

      expect(focusSpy).toHaveBeenCalledTimes(2); // 초기 포커스 + 복원
    });

    it('restoreFocus 옵션으로 특정 요소에 포커스를 복원한다', () => {
      const restoreTarget = container.querySelector('#outside-after') as HTMLButtonElement;
      const focusSpy = vi.spyOn(restoreTarget, 'focus');
      
      const { result } = renderHook(() => 
        useFocusTrap({ restoreFocus: restoreTarget })
      );
      
      act(() => {
        (result.current.trapRef as any).current = trapContainer;
        result.current.activate();
      });

      act(() => {
        result.current.deactivate();
      });

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('비활성화 상태', () => {
    it('enabled가 false일 때 트랩이 작동하지 않는다', () => {
      const { result } = renderHook(() => 
        useFocusTrap({ enabled: false })
      );
      
      act(() => {
        (result.current.trapRef as any).current = trapContainer;
        result.current.activate();
      });

      expect(result.current.isActive).toBe(false);
    });
  });
});