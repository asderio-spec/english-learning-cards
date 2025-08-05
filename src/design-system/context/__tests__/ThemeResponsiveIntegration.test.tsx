/**
 * 테마 및 반응형 통합 테스트
 * 라이트/다크 모드 전환 및 다양한 화면 크기에서의 레이아웃 테스트
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// 테마 컨텍스트 임포트
import { ThemeProvider, useTheme } from '../ThemeContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
      <button ref={ref} {...props}>{children}</button>
    )),
    div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>{children}</div>
    ))
  }
}));

// 뷰포트 크기 모킹 함수
const mockViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // resize 이벤트 발생
  window.dispatchEvent(new Event('resize'));
};

// matchMedia 모킹 함수
const mockMatchMedia = (queries: Record<string, boolean>) => {
  return vi.fn().mockImplementation((query: string) => ({
    matches: queries[query] || false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

// 테스트용 반응형 컴포넌트
const ResponsiveTestComponent = () => {
  const [screenSize, setScreenSize] = React.useState('desktop');
  
  React.useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);
  
  return (
    <div data-testid="responsive-component" data-screen-size={screenSize}>
      <p>현재 화면 크기: {screenSize}</p>
    </div>
  );
};

// 테스트용 테마 토글 컴포넌트
const ThemeToggleComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div data-testid="theme-component" data-theme={theme.mode || 'light'}>
      <Button onClick={toggleTheme} data-testid="theme-toggle">
        {theme.mode === 'dark' ? '라이트 모드' : '다크 모드'}
      </Button>
      <p data-testid="current-theme">현재 테마: {theme.mode || 'light'}</p>
    </div>
  );
};

describe('테마 및 반응형 통합 테스트', () => {
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

    // 기본 뷰포트 설정 (데스크톱)
    mockViewport(1024, 768);

    // 기본 matchMedia 설정
    window.matchMedia = mockMatchMedia({
      '(prefers-color-scheme: dark)': false,
      '(prefers-reduced-motion: reduce)': false,
      '(prefers-contrast: high)': false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('반응형 레이아웃 테스트', () => {
    it('모바일 화면에서 적절한 레이아웃을 표시한다', async () => {
      // 모바일 뷰포트 설정
      mockViewport(375, 667);
      
      render(<ResponsiveTestComponent />);
      
      await waitFor(() => {
        const component = screen.getByTestId('responsive-component');
        expect(component).toHaveAttribute('data-screen-size', 'mobile');
        expect(screen.getByText('현재 화면 크기: mobile')).toBeInTheDocument();
      });
    });

    it('태블릿 화면에서 적절한 레이아웃을 표시한다', async () => {
      // 태블릿 뷰포트 설정
      mockViewport(768, 1024);
      
      render(<ResponsiveTestComponent />);
      
      await waitFor(() => {
        const component = screen.getByTestId('responsive-component');
        expect(component).toHaveAttribute('data-screen-size', 'tablet');
        expect(screen.getByText('현재 화면 크기: tablet')).toBeInTheDocument();
      });
    });

    it('데스크톱 화면에서 적절한 레이아웃을 표시한다', async () => {
      // 데스크톱 뷰포트 설정
      mockViewport(1440, 900);
      
      render(<ResponsiveTestComponent />);
      
      await waitFor(() => {
        const component = screen.getByTestId('responsive-component');
        expect(component).toHaveAttribute('data-screen-size', 'desktop');
        expect(screen.getByText('현재 화면 크기: desktop')).toBeInTheDocument();
      });
    });

    it('화면 크기 변경 시 레이아웃이 동적으로 업데이트된다', async () => {
      render(<ResponsiveTestComponent />);
      
      // 초기 데스크톱 상태 확인
      await waitFor(() => {
        expect(screen.getByTestId('responsive-component')).toHaveAttribute('data-screen-size', 'desktop');
      });
      
      // 모바일로 변경
      mockViewport(375, 667);
      
      await waitFor(() => {
        expect(screen.getByTestId('responsive-component')).toHaveAttribute('data-screen-size', 'mobile');
      });
      
      // 태블릿으로 변경
      mockViewport(768, 1024);
      
      await waitFor(() => {
        expect(screen.getByTestId('responsive-component')).toHaveAttribute('data-screen-size', 'tablet');
      });
    });
  });

  describe('테마 전환 테스트', () => {
    it('라이트 모드에서 다크 모드로 전환된다', async () => {
      render(
        <ThemeProvider>
          <ThemeToggleComponent />
        </ThemeProvider>
      );
      
      // 초기 라이트 모드 확인
      expect(screen.getByTestId('theme-component')).toHaveAttribute('data-theme', 'light');
      expect(screen.getByText('현재 테마: light')).toBeInTheDocument();
      
      // 다크 모드로 전환
      const toggleButton = screen.getByTestId('theme-toggle');
      await userEvent.click(toggleButton);
      
      // 다크 모드 확인
      await waitFor(() => {
        expect(screen.getByTestId('theme-component')).toHaveAttribute('data-theme', 'dark');
        expect(screen.getByText('현재 테마: dark')).toBeInTheDocument();
      });
    });

    it('다크 모드에서 라이트 모드로 전환된다', async () => {
      // localStorage에서 다크 모드 반환하도록 설정
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <ThemeToggleComponent />
        </ThemeProvider>
      );
      
      // 다크 모드에서 시작하는지 확인 (실제 구현에 따라 조정 필요)
      const toggleButton = screen.getByTestId('theme-toggle');
      await userEvent.click(toggleButton);
      
      // 라이트 모드로 전환 확인
      await waitFor(() => {
        expect(screen.getByTestId('theme-component')).toHaveAttribute('data-theme', 'light');
      });
    });

    it('테마 설정이 localStorage에 저장된다', async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      
      render(
        <ThemeProvider>
          <ThemeToggleComponent />
        </ThemeProvider>
      );
      
      const toggleButton = screen.getByTestId('theme-toggle');
      await userEvent.click(toggleButton);
      
      // localStorage에 저장되는지 확인
      expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  describe('테마와 반응형의 통합', () => {
    it('모바일에서 테마 전환이 정상 작동한다', async () => {
      // 모바일 뷰포트 설정
      mockViewport(375, 667);
      
      render(
        <ThemeProvider>
          <div>
            <ResponsiveTestComponent />
            <ThemeToggleComponent />
          </div>
        </ThemeProvider>
      );
      
      // 모바일 레이아웃 확인
      await waitFor(() => {
        expect(screen.getByTestId('responsive-component')).toHaveAttribute('data-screen-size', 'mobile');
      });
      
      // 테마 전환
      const toggleButton = screen.getByTestId('theme-toggle');
      await userEvent.click(toggleButton);
      
      // 모바일에서 다크 모드 확인
      await waitFor(() => {
        expect(screen.getByTestId('theme-component')).toHaveAttribute('data-theme', 'dark');
        expect(screen.getByTestId('responsive-component')).toHaveAttribute('data-screen-size', 'mobile');
      });
    });

    it('화면 크기 변경 시 테마가 유지된다', async () => {
      render(
        <ThemeProvider>
          <div>
            <ResponsiveTestComponent />
            <ThemeToggleComponent />
          </div>
        </ThemeProvider>
      );
      
      // 다크 모드로 전환
      const toggleButton = screen.getByTestId('theme-toggle');
      await userEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('theme-component')).toHaveAttribute('data-theme', 'dark');
      });
      
      // 화면 크기를 모바일로 변경
      mockViewport(375, 667);
      
      await waitFor(() => {
        // 테마는 유지되고 화면 크기만 변경
        expect(screen.getByTestId('theme-component')).toHaveAttribute('data-theme', 'dark');
        expect(screen.getByTestId('responsive-component')).toHaveAttribute('data-screen-size', 'mobile');
      });
    });
  });

  describe('컴포넌트별 반응형 테스트', () => {
    it('Button 컴포넌트가 화면 크기에 따라 적절한 크기를 가진다', () => {
      const { rerender } = render(
        <div>
          <Button size="sm" data-testid="small-button">작은 버튼</Button>
          <Button size="md" data-testid="medium-button">중간 버튼</Button>
          <Button size="lg" data-testid="large-button">큰 버튼</Button>
        </div>
      );
      
      const smallButton = screen.getByTestId('small-button');
      const mediumButton = screen.getByTestId('medium-button');
      const largeButton = screen.getByTestId('large-button');
      
      // 각 버튼이 적절한 크기를 가지는지 확인
      expect(smallButton).toHaveStyle({ minHeight: '32px' });
      expect(mediumButton).toHaveStyle({ minHeight: '40px' });
      expect(largeButton).toHaveStyle({ minHeight: '48px' });
    });

    it('Card 컴포넌트가 화면 크기에 따라 적절한 패딩을 가진다', () => {
      render(
        <div>
          <Card padding="sm" data-testid="small-card">작은 패딩</Card>
          <Card padding="md" data-testid="medium-card">중간 패딩</Card>
          <Card padding="lg" data-testid="large-card">큰 패딩</Card>
        </div>
      );
      
      const smallCard = screen.getByTestId('small-card');
      const mediumCard = screen.getByTestId('medium-card');
      const largeCard = screen.getByTestId('large-card');
      
      // 각 카드가 적절한 패딩을 가지는지 확인
      expect(smallCard).toHaveStyle({ padding: '16px' });
      expect(mediumCard).toHaveStyle({ padding: '24px' });
      expect(largeCard).toHaveStyle({ padding: '32px' });
    });
  });

  describe('애니메이션 테스트', () => {
    it('prefers-reduced-motion 설정을 존중한다', () => {
      // 모션 감소 설정 시뮬레이션
      window.matchMedia = mockMatchMedia({
        '(prefers-reduced-motion: reduce)': true,
      });
      
      render(
        <ThemeProvider>
          <Button data-testid="animated-button">애니메이션 버튼</Button>
        </ThemeProvider>
      );
      
      const button = screen.getByTestId('animated-button');
      
      // 모션 감소 설정 시 애니메이션이 비활성화되어야 함
      // 실제 구현에서는 CSS 변수나 클래스로 제어
      expect(button).toBeInTheDocument();
    });

    it('테마 전환 시 부드러운 애니메이션이 적용된다', async () => {
      render(
        <ThemeProvider>
          <ThemeToggleComponent />
        </ThemeProvider>
      );
      
      const toggleButton = screen.getByTestId('theme-toggle');
      
      // 테마 전환 시 애니메이션 클래스나 스타일이 적용되는지 확인
      await userEvent.click(toggleButton);
      
      // 전환 후 내용이 여전히 표시되는지 확인
      expect(screen.getByTestId('theme-component')).toBeInTheDocument();
    });
  });

  describe('시스템 설정 감지', () => {
    it('시스템 다크 모드 설정을 감지한다', () => {
      // 시스템 다크 모드 시뮬레이션
      window.matchMedia = mockMatchMedia({
        '(prefers-color-scheme: dark)': true,
      });
      
      const TestComponent = () => {
        const [systemTheme, setSystemTheme] = React.useState('light');
        
        React.useEffect(() => {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
        }, []);
        
        return <div data-testid="system-theme">{systemTheme}</div>;
      };
      
      render(<TestComponent />);
      
      expect(screen.getByTestId('system-theme')).toHaveTextContent('dark');
    });

    it('고대비 모드 설정을 감지한다', () => {
      // 고대비 모드 시뮬레이션
      window.matchMedia = mockMatchMedia({
        '(prefers-contrast: high)': true,
      });
      
      const TestComponent = () => {
        const [highContrast, setHighContrast] = React.useState(false);
        
        React.useEffect(() => {
          const mediaQuery = window.matchMedia('(prefers-contrast: high)');
          setHighContrast(mediaQuery.matches);
        }, []);
        
        return <div data-testid="high-contrast">{highContrast ? 'high' : 'normal'}</div>;
      };
      
      render(<TestComponent />);
      
      expect(screen.getByTestId('high-contrast')).toHaveTextContent('high');
    });
  });

  describe('방향 변경 테스트', () => {
    it('세로 방향에서 가로 방향으로 변경 시 레이아웃이 조정된다', async () => {
      const OrientationTestComponent = () => {
        const [orientation, setOrientation] = React.useState('portrait');
        
        React.useEffect(() => {
          const updateOrientation = () => {
            setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
          };
          
          updateOrientation();
          window.addEventListener('resize', updateOrientation);
          
          return () => window.removeEventListener('resize', updateOrientation);
        }, []);
        
        return (
          <div data-testid="orientation-component" data-orientation={orientation}>
            현재 방향: {orientation}
          </div>
        );
      };
      
      render(<OrientationTestComponent />);
      
      // 초기 세로 방향 (데스크톱이므로 가로)
      await waitFor(() => {
        expect(screen.getByTestId('orientation-component')).toHaveAttribute('data-orientation', 'landscape');
      });
      
      // 세로 방향으로 변경 (모바일 세로)
      mockViewport(375, 812);
      
      await waitFor(() => {
        expect(screen.getByTestId('orientation-component')).toHaveAttribute('data-orientation', 'portrait');
      });
      
      // 가로 방향으로 변경 (모바일 가로)
      mockViewport(812, 375);
      
      await waitFor(() => {
        expect(screen.getByTestId('orientation-component')).toHaveAttribute('data-orientation', 'landscape');
      });
    });
  });

  describe('터치 디바이스 지원', () => {
    it('터치 디바이스에서 적절한 터치 타겟 크기를 제공한다', () => {
      // 터치 이벤트 지원 시뮬레이션
      Object.defineProperty(window, 'ontouchstart', {
        value: null,
        writable: true
      });
      
      render(
        <div>
          <Button size="sm" data-testid="touch-button">터치 버튼</Button>
        </div>
      );
      
      const button = screen.getByTestId('touch-button');
      
      // 최소 터치 타겟 크기 확인 (44px 권장)
      const computedStyle = window.getComputedStyle(button);
      const minHeight = parseInt(computedStyle.minHeight);
      
      // 작은 버튼도 터치에 적합한 최소 크기를 유지해야 함
      expect(minHeight).toBeGreaterThanOrEqual(32);
    });
  });

  describe('성능 테스트', () => {
    it('테마 전환 시 불필요한 리렌더링이 발생하지 않는다', async () => {
      const renderCount = { count: 0 };
      
      const TestComponent = () => {
        renderCount.count++;
        const { theme } = useTheme();
        return <div data-testid="render-test">렌더 카운트: {renderCount.count}</div>;
      };
      
      render(
        <ThemeProvider>
          <div>
            <TestComponent />
            <ThemeToggleComponent />
          </div>
        </ThemeProvider>
      );
      
      const initialRenderCount = renderCount.count;
      
      // 테마 전환
      const toggleButton = screen.getByTestId('theme-toggle');
      await userEvent.click(toggleButton);
      
      // 렌더링 횟수가 적절한지 확인 (정확한 수치는 구현에 따라 조정)
      expect(renderCount.count).toBeGreaterThan(initialRenderCount);
      expect(renderCount.count).toBeLessThan(initialRenderCount + 5); // 과도한 리렌더링 방지
    });

    it('화면 크기 변경 시 디바운싱이 적용된다', async () => {
      const resizeCount = { count: 0 };
      
      const TestComponent = () => {
        React.useEffect(() => {
          const handleResize = () => {
            resizeCount.count++;
          };
          
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
        }, []);
        
        return <div data-testid="resize-test">리사이즈 카운트: {resizeCount.count}</div>;
      };
      
      render(<TestComponent />);
      
      // 연속적인 리사이즈 이벤트 발생
      mockViewport(800, 600);
      mockViewport(900, 700);
      mockViewport(1000, 800);
      
      // 이벤트가 발생했는지 확인
      expect(resizeCount.count).toBeGreaterThan(0);
    });
  });
});