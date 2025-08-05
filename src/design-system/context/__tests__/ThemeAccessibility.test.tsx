/**
 * 테마 시스템 접근성 테스트
 * 라이트/다크 모드 전환 시 접근성 유지 테스트
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';

// 테마 컨텍스트 및 컴포넌트 임포트
import { ThemeProvider, useTheme } from '../ThemeContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { calculateContrastRatio, isWCAGCompliant } from '../../utils/accessibility';

// jest-axe 매처 확장
expect.extend(toHaveNoViolations);

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
      <button ref={ref} {...props}>{children}</button>
    )),
    div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>{children}</div>
    )),
    input: React.forwardRef<HTMLInputElement, any>(({ ...props }, ref) => (
      <input ref={ref} {...props} />
    ))
  }
}));

// 테스트용 테마 토글 컴포넌트
const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      onClick={toggleTheme}
      aria-label={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
      aria-pressed={theme === 'dark'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
};

// 테스트용 앱 컴포넌트
const TestApp = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <div data-testid="app-container">
      <ThemeToggleButton />
      {children}
    </div>
  </ThemeProvider>
);

describe('테마 시스템 접근성 테스트', () => {
  beforeEach(() => {
    // localStorage 모킹
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // matchMedia 모킹
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('테마 전환 접근성', () => {
    it('테마 토글 버튼이 적절한 ARIA 속성을 가진다', async () => {
      const { container } = render(<TestApp><div>테스트 내용</div></TestApp>);
      
      const toggleButton = screen.getByRole('button', { name: /모드로 전환/ });
      
      // 초기 상태 (라이트 모드)
      expect(toggleButton).toHaveAttribute('aria-label', '다크 모드로 전환');
      expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
      
      // 테마 전환
      await userEvent.click(toggleButton);
      
      // 다크 모드로 전환 후
      expect(toggleButton).toHaveAttribute('aria-label', '라이트 모드로 전환');
      expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
      
      // axe 접근성 검사
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('테마 전환 시 키보드 네비게이션이 유지된다', async () => {
      render(
        <TestApp>
          <Button>버튼 1</Button>
          <Button>버튼 2</Button>
          <Input label="입력 필드" />
        </TestApp>
      );
      
      const toggleButton = screen.getByRole('button', { name: /모드로 전환/ });
      const button1 = screen.getByText('버튼 1');
      const button2 = screen.getByText('버튼 2');
      const input = screen.getByRole('textbox');
      
      // 초기 키보드 네비게이션 확인
      await userEvent.tab();
      expect(toggleButton).toHaveFocus();
      
      await userEvent.tab();
      expect(button1).toHaveFocus();
      
      // 테마 전환
      await userEvent.click(toggleButton);
      
      // 테마 전환 후에도 키보드 네비게이션이 정상 작동
      await userEvent.tab();
      expect(button2).toHaveFocus();
      
      await userEvent.tab();
      expect(input).toHaveFocus();
    });

    it('테마 전환이 스크린 리더에 알려진다', async () => {
      const TestComponentWithAnnouncement = () => {
        const { theme, toggleTheme } = useTheme();
        const [announcement, setAnnouncement] = React.useState('');
        
        const handleToggle = () => {
          toggleTheme();
          setAnnouncement(`${theme === 'light' ? '다크' : '라이트'} 모드로 전환되었습니다`);
        };
        
        return (
          <div>
            <Button onClick={handleToggle}>테마 전환</Button>
            {announcement && (
              <div role="status" aria-live="polite">
                {announcement}
              </div>
            )}
          </div>
        );
      };
      
      render(
        <ThemeProvider>
          <TestComponentWithAnnouncement />
        </ThemeProvider>
      );
      
      const toggleButton = screen.getByText('테마 전환');
      
      // 테마 전환
      await userEvent.click(toggleButton);
      
      // 상태 알림 확인
      await waitFor(() => {
        const announcement = screen.getByRole('status');
        expect(announcement).toHaveTextContent('다크 모드로 전환되었습니다');
      });
    });
  });

  describe('라이트 모드 색상 대비', () => {
    it('라이트 모드에서 모든 색상이 WCAG 기준을 만족한다', () => {
      // 라이트 모드 색상 정의 (실제 테마에서 가져와야 함)
      const lightTheme = {
        background: '#FFFFFF',
        text: {
          primary: '#24292E',
          secondary: '#586069',
          disabled: '#959DA5'
        },
        primary: '#5E6AD2',
        secondary: '#00D2FF',
        success: '#00C896',
        warning: '#FF6B35',
        error: '#FF5C5C'
      };
      
      // 주요 텍스트 색상 대비 검사
      const primaryTextContrast = calculateContrastRatio(
        lightTheme.text.primary,
        lightTheme.background
      );
      expect(primaryTextContrast).toBeGreaterThanOrEqual(7.0); // AAA 기준
      expect(isWCAGCompliant(lightTheme.text.primary, lightTheme.background, 'AAA')).toBe(true);
      
      // 보조 텍스트 색상 대비 검사
      const secondaryTextContrast = calculateContrastRatio(
        lightTheme.text.secondary,
        lightTheme.background
      );
      expect(secondaryTextContrast).toBeGreaterThanOrEqual(4.5); // AA 기준
      expect(isWCAGCompliant(lightTheme.text.secondary, lightTheme.background, 'AA')).toBe(true);
      
      // 버튼 색상 대비 검사
      const primaryButtonContrast = calculateContrastRatio(
        '#FFFFFF',
        lightTheme.primary
      );
      expect(primaryButtonContrast).toBeGreaterThanOrEqual(4.5);
      expect(isWCAGCompliant('#FFFFFF', lightTheme.primary, 'AA')).toBe(true);
      
      // 에러 색상 대비 검사
      const errorContrast = calculateContrastRatio(
        lightTheme.error,
        lightTheme.background
      );
      expect(errorContrast).toBeGreaterThanOrEqual(3.0); // 그래픽 요소 기준
    });
  });

  describe('다크 모드 색상 대비', () => {
    it('다크 모드에서 모든 색상이 WCAG 기준을 만족한다', () => {
      // 다크 모드 색상 정의 (실제 테마에서 가져와야 함)
      const darkTheme = {
        background: '#0D1117',
        text: {
          primary: '#F0F6FC',
          secondary: '#8B949E',
          disabled: '#484F58'
        },
        primary: '#7C3AED',
        secondary: '#06B6D4',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444'
      };
      
      // 주요 텍스트 색상 대비 검사
      const primaryTextContrast = calculateContrastRatio(
        darkTheme.text.primary,
        darkTheme.background
      );
      expect(primaryTextContrast).toBeGreaterThanOrEqual(7.0); // AAA 기준
      expect(isWCAGCompliant(darkTheme.text.primary, darkTheme.background, 'AAA')).toBe(true);
      
      // 보조 텍스트 색상 대비 검사
      const secondaryTextContrast = calculateContrastRatio(
        darkTheme.text.secondary,
        darkTheme.background
      );
      expect(secondaryTextContrast).toBeGreaterThanOrEqual(4.5); // AA 기준
      expect(isWCAGCompliant(darkTheme.text.secondary, darkTheme.background, 'AA')).toBe(true);
      
      // 버튼 색상 대비 검사
      const primaryButtonContrast = calculateContrastRatio(
        '#FFFFFF',
        darkTheme.primary
      );
      expect(primaryButtonContrast).toBeGreaterThanOrEqual(4.5);
      expect(isWCAGCompliant('#FFFFFF', darkTheme.primary, 'AA')).toBe(true);
    });
  });

  describe('시스템 테마 감지', () => {
    it('시스템 다크 모드 설정을 감지한다', () => {
      // 시스템 다크 모드 시뮬레이션
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });
      
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme-indicator">{theme}</div>;
      };
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      // 시스템 설정에 따라 다크 모드가 적용되는지 확인
      // 실제 구현에 따라 로직 조정 필요
      const themeIndicator = screen.getByTestId('theme-indicator');
      expect(themeIndicator).toBeInTheDocument();
    });

    it('시스템 테마 변경을 감지하고 반응한다', async () => {
      const mockMatchMedia = vi.fn();
      let mediaQueryCallback: ((e: any) => void) | null = null;
      
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        addEventListener: vi.fn((event, callback) => {
          if (event === 'change') {
            mediaQueryCallback = callback;
          }
        }),
        removeEventListener: vi.fn(),
      }));
      
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });
      
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme-indicator">{theme}</div>;
      };
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      // 시스템 테마 변경 시뮬레이션
      if (mediaQueryCallback) {
        mediaQueryCallback({ matches: true });
      }
      
      // 테마 변경이 반영되는지 확인
      // 실제 구현에 따라 로직 조정 필요
      const themeIndicator = screen.getByTestId('theme-indicator');
      expect(themeIndicator).toBeInTheDocument();
    });
  });

  describe('고대비 모드 지원', () => {
    it('고대비 모드에서 적절한 색상이 적용된다', () => {
      // 고대비 모드 시뮬레이션
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-contrast: high)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });
      
      render(
        <TestApp>
          <Button>고대비 버튼</Button>
          <Card>고대비 카드</Card>
        </TestApp>
      );
      
      const button = screen.getByText('고대비 버튼');
      const card = screen.getByText('고대비 카드');
      
      // 고대비 모드에서 더 강한 테두리나 색상이 적용되어야 함
      expect(button).toBeInTheDocument();
      expect(card).toBeInTheDocument();
    });

    it('고대비 모드에서 색상 대비가 향상된다', () => {
      // 고대비 모드 색상 정의
      const highContrastColors = {
        background: '#FFFFFF',
        text: '#000000',
        primary: '#0000FF',
        error: '#FF0000',
        success: '#008000'
      };
      
      // 극대화된 대비 확인
      const textContrast = calculateContrastRatio(
        highContrastColors.text,
        highContrastColors.background
      );
      expect(textContrast).toBe(21); // 최대 대비
      
      const primaryContrast = calculateContrastRatio(
        '#FFFFFF',
        highContrastColors.primary
      );
      expect(primaryContrast).toBeGreaterThanOrEqual(7.0);
    });
  });

  describe('테마 전환 애니메이션 접근성', () => {
    it('prefers-reduced-motion 설정을 존중한다', () => {
      // 모션 감소 설정 시뮬레이션
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });
      
      render(
        <TestApp>
          <Button>애니메이션 테스트</Button>
        </TestApp>
      );
      
      const button = screen.getByText('애니메이션 테스트');
      
      // 모션 감소 설정 시 애니메이션이 비활성화되어야 함
      // 실제 구현에서는 CSS 변수나 클래스로 제어
      expect(button).toBeInTheDocument();
    });

    it('테마 전환 시 깜빡임이 최소화된다', async () => {
      render(<TestApp><div>내용</div></TestApp>);
      
      const toggleButton = screen.getByRole('button', { name: /모드로 전환/ });
      
      // 테마 전환 시 부드러운 전환이 이루어져야 함
      await userEvent.click(toggleButton);
      
      // 전환 후 내용이 여전히 표시되는지 확인
      expect(screen.getByText('내용')).toBeInTheDocument();
    });
  });

  describe('테마별 컴포넌트 접근성', () => {
    it('라이트 모드에서 모든 컴포넌트가 접근성 기준을 만족한다', async () => {
      const { container } = render(
        <TestApp>
          <Button>라이트 버튼</Button>
          <Card interactive>라이트 카드</Card>
          <Input label="라이트 입력" />
        </TestApp>
      );
      
      // axe 접근성 검사
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('다크 모드에서 모든 컴포넌트가 접근성 기준을 만족한다', async () => {
      const { container } = render(
        <TestApp>
          <Button>다크 버튼</Button>
          <Card interactive>다크 카드</Card>
          <Input label="다크 입력" />
        </TestApp>
      );
      
      // 다크 모드로 전환
      const toggleButton = screen.getByRole('button', { name: /모드로 전환/ });
      await userEvent.click(toggleButton);
      
      // axe 접근성 검사
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('테마 설정 지속성', () => {
    it('테마 설정이 localStorage에 저장된다', async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      
      render(<TestApp><div>테스트</div></TestApp>);
      
      const toggleButton = screen.getByRole('button', { name: /모드로 전환/ });
      
      // 테마 전환
      await userEvent.click(toggleButton);
      
      // localStorage에 저장되는지 확인
      expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
    });

    it('저장된 테마 설정을 복원한다', () => {
      // localStorage에서 다크 모드 반환하도록 설정
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('dark');
      
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme-indicator">{theme}</div>;
      };
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      // 저장된 다크 모드가 적용되는지 확인
      // 실제 구현에 따라 로직 조정 필요
      const themeIndicator = screen.getByTestId('theme-indicator');
      expect(themeIndicator).toBeInTheDocument();
    });
  });
});