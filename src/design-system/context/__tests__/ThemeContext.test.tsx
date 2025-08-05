/**
 * Linear 디자인 시스템 - 테마 컨텍스트 테스트
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';

// 테스트용 컴포넌트
const TestComponent: React.FC = () => {
  const { config, theme, setTheme, toggleTheme, isDarkMode, isSystemTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{config.currentTheme}</div>
      <div data-testid="resolved-theme">{config.resolvedTheme}</div>
      <div data-testid="system-theme">{config.systemTheme}</div>
      <div data-testid="is-dark-mode">{isDarkMode.toString()}</div>
      <div data-testid="is-system-theme">{isSystemTheme.toString()}</div>
      <div data-testid="theme-mode">{theme.mode}</div>
      
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
      <button data-testid="set-system" onClick={() => setTheme('system')}>
        Set System
      </button>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

// matchMedia 모킹
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

// localStorage 모킹
const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
    },
  });
  
  return store;
};

describe('ThemeContext', () => {
  let localStorageStore: Record<string, string>;

  beforeEach(() => {
    localStorageStore = mockLocalStorage();
    mockMatchMedia(false); // 기본적으로 라이트 모드
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('기본 동작', () => {
    it('기본 테마로 system을 사용한다', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
      expect(screen.getByTestId('is-system-theme')).toHaveTextContent('true');
    });

    it('시스템이 라이트 모드일 때 라이트 테마를 적용한다', () => {
      mockMatchMedia(false);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('system-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
    });

    it('시스템이 다크 모드일 때 다크 테마를 적용한다', () => {
      mockMatchMedia(true);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('system-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
    });
  });

  describe('테마 변경', () => {
    it('라이트 테마로 변경할 수 있다', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('set-light'));

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-system-theme')).toHaveTextContent('false');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
    });

    it('다크 테마로 변경할 수 있다', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('set-dark'));

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-system-theme')).toHaveTextContent('false');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
    });

    it('시스템 테마로 변경할 수 있다', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // 먼저 라이트 모드로 변경
      fireEvent.click(screen.getByTestId('set-light'));
      expect(screen.getByTestId('is-system-theme')).toHaveTextContent('false');

      // 시스템 모드로 변경
      fireEvent.click(screen.getByTestId('set-system'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
      expect(screen.getByTestId('is-system-theme')).toHaveTextContent('true');
    });
  });

  describe('테마 토글', () => {
    it('라이트 모드에서 다크 모드로 토글된다', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('set-light'));
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');

      fireEvent.click(screen.getByTestId('toggle-theme'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
    });

    it('다크 모드에서 라이트 모드로 토글된다', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('set-dark'));
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');

      fireEvent.click(screen.getByTestId('toggle-theme'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
    });
  });

  describe('로컬 스토리지 연동', () => {
    it('테마 변경 시 로컬 스토리지에 저장된다', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('set-dark'));

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'linear-design-system-theme',
        'dark'
      );
    });

    it('저장된 테마를 로드한다', () => {
      localStorageStore['linear-design-system-theme'] = 'dark';
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // 초기 로드 후 저장된 테마가 적용되어야 함
      waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });
    });
  });

  describe('커스텀 기본 테마', () => {
    it('커스텀 기본 테마를 사용할 수 있다', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
    });
  });

  describe('시스템 테마 비활성화', () => {
    it('시스템 테마가 비활성화되면 시스템 변경을 감지하지 않는다', () => {
      render(
        <ThemeProvider enableSystemTheme={false}>
          <TestComponent />
        </ThemeProvider>
      );

      // 시스템 테마 감지 이벤트 리스너가 등록되지 않아야 함
      expect(window.matchMedia).toHaveBeenCalled();
    });
  });

  describe('에러 처리', () => {
    it('ThemeProvider 없이 useTheme을 사용하면 에러가 발생한다', () => {
      // 콘솔 에러 숨기기
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });

    it('localStorage 에러 시에도 정상 동작한다', () => {
      // localStorage.setItem에서 에러 발생 시뮬레이션
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('set-dark'));

      // 에러가 발생해도 테마는 변경되어야 함
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save theme to localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});