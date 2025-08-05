/**
 * Linear 디자인 시스템 - 테마 컨텍스트 간단 테스트
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider, useTheme } from '../ThemeContext';

// 테스트용 컴포넌트
const TestComponent: React.FC = () => {
  const { config, setTheme, isDarkMode } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{config.currentTheme}</div>
      <div data-testid="is-dark-mode">{isDarkMode.toString()}</div>
      
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Set Dark
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

describe('ThemeContext - Simple Tests', () => {
  beforeEach(() => {
    mockLocalStorage();
    mockMatchMedia(false); // 기본적으로 라이트 모드
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('기본 테마로 system을 사용한다', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });

  it('라이트 테마로 변경할 수 있다', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('set-light'));

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
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
    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
  });
});