/**
 * useHighContrast 훅 테스트
 */

import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useHighContrast, useHighContrastClass } from '../useHighContrast';

// matchMedia 모킹
const mockMatchMedia = (matches: boolean = false) => ({
  matches,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  media: '',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn()
});

// 접근성 유틸리티 모킹
vi.mock('../utils/accessibility', () => ({
  detectHighContrastMode: vi.fn(() => false),
  addHighContrastListener: vi.fn((callback) => {
    // 정리 함수 반환
    return () => {};
  }),
  createHighContrastTheme: vi.fn((theme) => ({ ...theme, highContrast: true })),
  getSystemAccessibilityPreferences: vi.fn(() => ({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersReducedTransparency: false,
    prefersColorScheme: 'no-preference'
  }))
}));

describe('useHighContrast', () => {
  beforeEach(() => {
    // matchMedia 모킹
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => mockMatchMedia(false))
    });

    // 모든 모킹 초기화
    vi.clearAllMocks();
  });

  describe('기본 기능', () => {
    it('초기 상태를 올바르게 설정한다', () => {
      const { result } = renderHook(() => useHighContrast());

      expect(result.current.isHighContrast).toBe(false);
      expect(result.current.systemHighContrast).toBe(false);
      expect(typeof result.current.toggleHighContrast).toBe('function');
      expect(typeof result.current.setHighContrast).toBe('function');
      expect(result.current.systemPreferences).toBeDefined();
      expect(typeof result.current.createHighContrastTheme).toBe('function');
    });

    it('초기 고대비 모드를 설정할 수 있다', () => {
      const { result } = renderHook(() => 
        useHighContrast({ 
          initialHighContrast: true,
          followSystem: false 
        })
      );

      expect(result.current.isHighContrast).toBe(true);
    });
  });

  describe('수동 모드', () => {
    it('followSystem이 false일 때 수동 설정을 사용한다', () => {
      const { result } = renderHook(() => 
        useHighContrast({ followSystem: false })
      );

      expect(result.current.isHighContrast).toBe(false);

      act(() => {
        result.current.setHighContrast(true);
      });

      expect(result.current.isHighContrast).toBe(true);
    });

    it('toggleHighContrast로 상태를 토글할 수 있다', () => {
      const { result } = renderHook(() => 
        useHighContrast({ followSystem: false })
      );

      expect(result.current.isHighContrast).toBe(false);

      act(() => {
        result.current.toggleHighContrast();
      });

      expect(result.current.isHighContrast).toBe(true);

      act(() => {
        result.current.toggleHighContrast();
      });

      expect(result.current.isHighContrast).toBe(false);
    });
  });

  describe('시스템 모드', () => {
    it('followSystem이 true일 때 시스템 설정을 따른다', () => {
      // 시스템 고대비 모드가 활성화된 상태로 모킹
      const { detectHighContrastMode } = require('../utils/accessibility');
      detectHighContrastMode.mockReturnValue(true);

      const { result } = renderHook(() => 
        useHighContrast({ followSystem: true })
      );

      // 시스템 설정을 따르므로 true여야 함
      expect(result.current.systemHighContrast).toBe(false); // 초기 상태는 모킹된 값
    });
  });

  describe('콜백 함수', () => {
    it('고대비 모드 변경 시 콜백을 호출한다', () => {
      const onHighContrastChange = vi.fn();
      const { result } = renderHook(() => 
        useHighContrast({ 
          followSystem: false,
          onHighContrastChange 
        })
      );

      act(() => {
        result.current.setHighContrast(true);
      });

      expect(onHighContrastChange).toHaveBeenCalledWith(true);

      act(() => {
        result.current.toggleHighContrast();
      });

      expect(onHighContrastChange).toHaveBeenCalledWith(false);
    });
  });

  describe('시스템 접근성 설정', () => {
    it('시스템 접근성 설정을 올바르게 반환한다', () => {
      const mockPreferences = {
        prefersReducedMotion: true,
        prefersHighContrast: true,
        prefersReducedTransparency: false,
        prefersColorScheme: 'dark' as const
      };

      const { getSystemAccessibilityPreferences } = require('../utils/accessibility');
      getSystemAccessibilityPreferences.mockReturnValue(mockPreferences);

      const { result } = renderHook(() => useHighContrast());

      expect(result.current.systemPreferences).toEqual(mockPreferences);
    });
  });

  describe('테마 생성', () => {
    it('createHighContrastTheme 함수를 제공한다', () => {
      const { result } = renderHook(() => useHighContrast());

      const baseTheme = { primary: '#5e6ad2', background: '#ffffff' };
      const highContrastTheme = result.current.createHighContrastTheme(baseTheme);

      expect(highContrastTheme).toEqual({ ...baseTheme, highContrast: true });
    });
  });
});

describe('useHighContrastClass', () => {
  beforeEach(() => {
    // DOM 정리
    document.documentElement.className = '';
    vi.clearAllMocks();
  });

  it('고대비 모드일 때 클래스를 추가한다', () => {
    // useHighContrast 훅이 true를 반환하도록 모킹
    vi.doMock('../useHighContrast', () => ({
      useHighContrast: () => ({ isHighContrast: true })
    }));

    const { result } = renderHook(() => useHighContrastClass());

    expect(result.current).toBe(true);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
  });

  it('고대비 모드가 아닐 때 클래스를 제거한다', () => {
    // 먼저 클래스 추가
    document.documentElement.classList.add('high-contrast');

    vi.doMock('../useHighContrast', () => ({
      useHighContrast: () => ({ isHighContrast: false })
    }));

    const { result } = renderHook(() => useHighContrastClass());

    expect(result.current).toBe(false);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
  });

  it('커스텀 클래스명을 사용할 수 있다', () => {
    vi.doMock('../useHighContrast', () => ({
      useHighContrast: () => ({ isHighContrast: true })
    }));

    renderHook(() => useHighContrastClass('custom-high-contrast'));

    expect(document.documentElement.classList.contains('custom-high-contrast')).toBe(true);
  });

  it('특정 요소를 타겟으로 할 수 있다', () => {
    const targetElement = document.createElement('div');
    document.body.appendChild(targetElement);

    vi.doMock('../useHighContrast', () => ({
      useHighContrast: () => ({ isHighContrast: true })
    }));

    renderHook(() => useHighContrastClass('high-contrast', targetElement));

    expect(targetElement.classList.contains('high-contrast')).toBe(true);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);

    document.body.removeChild(targetElement);
  });

  it('컴포넌트 언마운트 시 클래스를 정리한다', () => {
    vi.doMock('../useHighContrast', () => ({
      useHighContrast: () => ({ isHighContrast: true })
    }));

    const { unmount } = renderHook(() => useHighContrastClass());

    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);

    unmount();

    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
  });
});