/**
 * 테마 및 반응형 간단 테스트
 * 라이트/다크 모드 전환 및 다양한 화면 크기에서의 레이아웃 테스트
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
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

// 테스트용 테마 컴포넌트
const ThemeTestComponent = () => {
  const [theme, setTheme] = React.useState('light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  return (
    <div data-testid="theme-component" data-theme={theme}>
      <button onClick={toggleTheme} data-testid="theme-toggle">
        {theme === 'dark' ? '라이트 모드' : '다크 모드'}
      </button>
      <p data-testid="current-theme">현재 테마: {theme}</p>
    </div>
  );
};

describe('테마 및 반응형 간단 테스트', () => {
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
      render(<ThemeTestComponent />);
      
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
      render(<ThemeTestComponent />);
      
      // 먼저 다크 모드로 전환
      const toggleButton = screen.getByTestId('theme-toggle');
      await userEvent.click(toggleButton);
      
      // 다크 모드 확인
      await waitFor(() => {
        expect(screen.getByTestId('theme-component')).toHaveAttribute('data-theme', 'dark');
      });
      
      // 다시 라이트 모드로 전환
      await userEvent.click(toggleButton);
      
      // 라이트 모드로 전환 확인
      await waitFor(() => {
        expect(screen.getByTestId('theme-component')).toHaveAttribute('data-theme', 'light');
      });
    });

    it('테마 전환이 정상적으로 작동한다', async () => {
      render(<ThemeTestComponent />);
      
      const toggleButton = screen.getByTestId('theme-toggle');
      
      // 초기 라이트 모드 확인
      expect(screen.getByTestId('theme-component')).toHaveAttribute('data-theme', 'light');
      
      // 다크 모드로 전환
      await userEvent.click(toggleButton);
      
      // 다크 모드 확인
      await waitFor(() => {
        expect(screen.getByTestId('theme-component')).toHaveAttribute('data-theme', 'dark');
      });
      
      // 다시 라이트 모드로 전환
      await userEvent.click(toggleButton);
      
      // 라이트 모드 확인
      await waitFor(() => {
        expect(screen.getByTestId('theme-component')).toHaveAttribute('data-theme', 'light');
      });
    });
  });

  describe('테마와 반응형의 통합', () => {
    it('모바일에서 테마 전환이 정상 작동한다', async () => {
      // 모바일 뷰포트 설정
      mockViewport(375, 667);
      
      render(
        <div>
          <ResponsiveTestComponent />
          <ThemeTestComponent />
        </div>
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
        <div>
          <ResponsiveTestComponent />
          <ThemeTestComponent />
        </div>
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

    it('모션 감소 설정을 감지한다', () => {
      // 모션 감소 설정 시뮬레이션
      window.matchMedia = mockMatchMedia({
        '(prefers-reduced-motion: reduce)': true,
      });
      
      const TestComponent = () => {
        const [reducedMotion, setReducedMotion] = React.useState(false);
        
        React.useEffect(() => {
          const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
          setReducedMotion(mediaQuery.matches);
        }, []);
        
        return <div data-testid="reduced-motion">{reducedMotion ? 'reduced' : 'normal'}</div>;
      };
      
      render(<TestComponent />);
      
      expect(screen.getByTestId('reduced-motion')).toHaveTextContent('reduced');
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
      
      // 초기 가로 방향 (데스크톱)
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

  describe('애니메이션 상태 테스트', () => {
    it('애니메이션 시작과 완료 상태를 추적한다', async () => {
      const AnimationTestComponent = () => {
        const [animationState, setAnimationState] = React.useState('idle');
        
        const startAnimation = () => {
          setAnimationState('running');
          setTimeout(() => {
            setAnimationState('completed');
          }, 300);
        };
        
        return (
          <div data-testid="animation-component" data-animation-state={animationState}>
            <button onClick={startAnimation} data-testid="start-animation">
              애니메이션 시작
            </button>
            <p>애니메이션 상태: {animationState}</p>
          </div>
        );
      };
      
      render(<AnimationTestComponent />);
      
      // 초기 상태 확인
      expect(screen.getByTestId('animation-component')).toHaveAttribute('data-animation-state', 'idle');
      
      // 애니메이션 시작
      const startButton = screen.getByTestId('start-animation');
      await userEvent.click(startButton);
      
      // 실행 상태 확인
      expect(screen.getByTestId('animation-component')).toHaveAttribute('data-animation-state', 'running');
      
      // 완료 상태 확인 (300ms 후)
      await waitFor(() => {
        expect(screen.getByTestId('animation-component')).toHaveAttribute('data-animation-state', 'completed');
      }, { timeout: 500 });
    });
  });

  describe('성능 테스트', () => {
    it('화면 크기 변경 시 리사이즈 이벤트가 발생한다', async () => {
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

    it('테마 전환 시 상태 변경이 추적된다', async () => {
      const stateChanges = { count: 0 };
      
      const TestComponent = () => {
        const [theme, setTheme] = React.useState('light');
        
        React.useEffect(() => {
          stateChanges.count++;
        }, [theme]);
        
        const toggleTheme = () => {
          setTheme(prev => prev === 'light' ? 'dark' : 'light');
        };
        
        return (
          <div data-testid="state-test">
            <button onClick={toggleTheme} data-testid="toggle">전환</button>
            <p>상태 변경 횟수: {stateChanges.count}</p>
          </div>
        );
      };
      
      render(<TestComponent />);
      
      const initialCount = stateChanges.count;
      
      // 테마 전환
      const toggleButton = screen.getByTestId('toggle');
      await userEvent.click(toggleButton);
      
      // 상태 변경이 발생했는지 확인
      expect(stateChanges.count).toBeGreaterThan(initialCount);
    });
  });

  describe('브레이크포인트 경계값 테스트', () => {
    it('정확한 브레이크포인트 경계에서 올바르게 전환된다', async () => {
      render(<ResponsiveTestComponent />);
      
      // 767px (모바일 최대)
      mockViewport(767, 600);
      await waitFor(() => {
        expect(screen.getByTestId('responsive-component')).toHaveAttribute('data-screen-size', 'mobile');
      });
      
      // 768px (태블릿 시작)
      mockViewport(768, 600);
      await waitFor(() => {
        expect(screen.getByTestId('responsive-component')).toHaveAttribute('data-screen-size', 'tablet');
      });
      
      // 1023px (태블릿 최대)
      mockViewport(1023, 600);
      await waitFor(() => {
        expect(screen.getByTestId('responsive-component')).toHaveAttribute('data-screen-size', 'tablet');
      });
      
      // 1024px (데스크톱 시작)
      mockViewport(1024, 600);
      await waitFor(() => {
        expect(screen.getByTestId('responsive-component')).toHaveAttribute('data-screen-size', 'desktop');
      });
    });
  });
});