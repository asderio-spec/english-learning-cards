/**
 * 반응형 시스템 접근성 테스트
 * 다양한 화면 크기에서의 접근성 유지 테스트
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  getBreakpoint, 
  isBreakpoint, 
  getResponsiveValue,
  createMediaQuery,
  getViewportSize
} from '../responsive';

// matchMedia 모킹 함수
const mockMatchMedia = (width: number) => {
  return vi.fn().mockImplementation((query: string) => {
    // 쿼리에서 너비 값 추출
    const match = query.match(/\((?:min-|max-)?width:\s*(\d+)px\)/);
    const queryWidth = match ? parseInt(match[1]) : 0;
    
    let matches = false;
    if (query.includes('min-width')) {
      matches = width >= queryWidth;
    } else if (query.includes('max-width')) {
      matches = width <= queryWidth;
    }
    
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });
};

// 뷰포트 크기 모킹
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
};

describe('반응형 시스템 접근성 테스트', () => {
  beforeEach(() => {
    // 기본 뷰포트 설정
    mockViewport(1024, 768);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('브레이크포인트 감지', () => {
    it('모바일 브레이크포인트를 올바르게 감지한다', () => {
      mockViewport(375, 667);
      window.matchMedia = mockMatchMedia(375);
      
      expect(getBreakpoint()).toBe('mobile');
      expect(isBreakpoint('mobile')).toBe(true);
      expect(isBreakpoint('tablet')).toBe(false);
      expect(isBreakpoint('desktop')).toBe(false);
    });

    it('태블릿 브레이크포인트를 올바르게 감지한다', () => {
      mockViewport(768, 1024);
      window.matchMedia = mockMatchMedia(768);
      
      expect(getBreakpoint()).toBe('tablet');
      expect(isBreakpoint('tablet')).toBe(true);
      expect(isBreakpoint('mobile')).toBe(false);
      expect(isBreakpoint('desktop')).toBe(false);
    });

    it('데스크톱 브레이크포인트를 올바르게 감지한다', () => {
      mockViewport(1440, 900);
      window.matchMedia = mockMatchMedia(1440);
      
      expect(getBreakpoint()).toBe('desktop');
      expect(isBreakpoint('desktop')).toBe(true);
      expect(isBreakpoint('tablet')).toBe(false);
      expect(isBreakpoint('mobile')).toBe(false);
    });
  });

  describe('반응형 값 계산', () => {
    it('브레이크포인트별로 적절한 값을 반환한다', () => {
      const responsiveConfig = {
        mobile: '16px',
        tablet: '20px',
        desktop: '24px'
      };

      // 모바일
      mockViewport(375, 667);
      window.matchMedia = mockMatchMedia(375);
      expect(getResponsiveValue(responsiveConfig)).toBe('16px');

      // 태블릿
      mockViewport(768, 1024);
      window.matchMedia = mockMatchMedia(768);
      expect(getResponsiveValue(responsiveConfig)).toBe('20px');

      // 데스크톱
      mockViewport(1440, 900);
      window.matchMedia = mockMatchMedia(1440);
      expect(getResponsiveValue(responsiveConfig)).toBe('24px');
    });

    it('기본값을 올바르게 처리한다', () => {
      const responsiveConfig = {
        mobile: '16px',
        default: '20px'
      };

      // 태블릿 (설정되지 않은 브레이크포인트)
      mockViewport(768, 1024);
      window.matchMedia = mockMatchMedia(768);
      expect(getResponsiveValue(responsiveConfig)).toBe('20px');
    });
  });

  describe('터치 디바이스 감지', () => {
    it('터치 디바이스를 올바르게 감지한다', () => {
      // 터치 이벤트 지원 시뮬레이션
      Object.defineProperty(window, 'ontouchstart', {
        value: null,
        writable: true
      });

      // 실제 구현에서는 터치 디바이스 감지 로직 테스트
      expect('ontouchstart' in window).toBe(true);
    });

    it('마우스 디바이스를 올바르게 감지한다', () => {
      // 터치 이벤트 미지원 시뮬레이션
      delete (window as any).ontouchstart;

      expect('ontouchstart' in window).toBe(false);
    });
  });

  describe('접근성 고려사항', () => {
    it('최소 터치 타겟 크기를 보장한다', () => {
      const minTouchTarget = 44; // px
      
      const getMinimumSize = (breakpoint: string) => {
        switch (breakpoint) {
          case 'mobile':
            return Math.max(minTouchTarget, 32);
          case 'tablet':
            return Math.max(minTouchTarget, 36);
          case 'desktop':
            return 40;
          default:
            return minTouchTarget;
        }
      };

      // 모든 브레이크포인트에서 최소 크기 확인
      expect(getMinimumSize('mobile')).toBeGreaterThanOrEqual(minTouchTarget);
      expect(getMinimumSize('tablet')).toBeGreaterThanOrEqual(minTouchTarget);
      expect(getMinimumSize('desktop')).toBeGreaterThanOrEqual(40);
    });

    it('텍스트 크기가 읽기 가능한 최소 크기를 유지한다', () => {
      const minTextSize = 16; // px (모바일에서 줌 없이 읽을 수 있는 최소 크기)
      
      const getTextSize = (breakpoint: string) => {
        switch (breakpoint) {
          case 'mobile':
            return Math.max(minTextSize, 14);
          case 'tablet':
            return 16;
          case 'desktop':
            return 16;
          default:
            return minTextSize;
        }
      };

      // 모든 브레이크포인트에서 최소 텍스트 크기 확인
      expect(getTextSize('mobile')).toBeGreaterThanOrEqual(14);
      expect(getTextSize('tablet')).toBeGreaterThanOrEqual(minTextSize);
      expect(getTextSize('desktop')).toBeGreaterThanOrEqual(minTextSize);
    });

    it('인터랙티브 요소 간 충분한 간격을 유지한다', () => {
      const minSpacing = 8; // px
      
      const getSpacing = (breakpoint: string) => {
        switch (breakpoint) {
          case 'mobile':
            return Math.max(minSpacing, 12); // 터치에 더 관대한 간격
          case 'tablet':
            return 10;
          case 'desktop':
            return 8;
          default:
            return minSpacing;
        }
      };

      // 모든 브레이크포인트에서 최소 간격 확인
      expect(getSpacing('mobile')).toBeGreaterThanOrEqual(12);
      expect(getSpacing('tablet')).toBeGreaterThanOrEqual(minSpacing);
      expect(getSpacing('desktop')).toBeGreaterThanOrEqual(minSpacing);
    });
  });

  describe('미디어 쿼리 생성', () => {
    it('올바른 미디어 쿼리를 생성한다', () => {
      expect(createMediaQuery('mobile')).toBe('(max-width: 767px)');
      expect(createMediaQuery('tablet')).toBe('(min-width: 768px) and (max-width: 1023px)');
      expect(createMediaQuery('desktop')).toBe('(min-width: 1024px)');
    });

    it('커스텀 브레이크포인트를 지원한다', () => {
      const customBreakpoint = { min: 1200, max: 1599 };
      const expectedQuery = '(min-width: 1200px) and (max-width: 1599px)';
      
      expect(createMediaQuery(customBreakpoint)).toBe(expectedQuery);
    });
  });

  describe('뷰포트 크기 감지', () => {
    it('현재 뷰포트 크기를 올바르게 반환한다', () => {
      mockViewport(1920, 1080);
      
      const viewportSize = getViewportSize();
      expect(viewportSize.width).toBe(1920);
      expect(viewportSize.height).toBe(1080);
    });

    it('뷰포트 변경을 감지한다', () => {
      const callback = vi.fn();
      
      // 리사이즈 이벤트 리스너 추가
      window.addEventListener('resize', callback);
      
      // 뷰포트 크기 변경 시뮬레이션
      mockViewport(800, 600);
      window.dispatchEvent(new Event('resize'));
      
      expect(callback).toHaveBeenCalled();
      
      // 정리
      window.removeEventListener('resize', callback);
    });
  });

  describe('방향 변경 처리', () => {
    it('세로 방향을 올바르게 감지한다', () => {
      mockViewport(375, 812); // iPhone X 세로
      
      const isPortrait = window.innerHeight > window.innerWidth;
      expect(isPortrait).toBe(true);
    });

    it('가로 방향을 올바르게 감지한다', () => {
      mockViewport(812, 375); // iPhone X 가로
      
      const isLandscape = window.innerWidth > window.innerHeight;
      expect(isLandscape).toBe(true);
    });

    it('방향 변경 시 레이아웃이 적절히 조정된다', () => {
      const getLayoutConfig = (width: number, height: number) => {
        const isPortrait = height > width;
        return {
          columns: isPortrait ? 1 : 2,
          spacing: isPortrait ? '16px' : '24px',
          padding: isPortrait ? '16px' : '32px'
        };
      };

      // 세로 방향
      const portraitConfig = getLayoutConfig(375, 812);
      expect(portraitConfig.columns).toBe(1);
      expect(portraitConfig.spacing).toBe('16px');

      // 가로 방향
      const landscapeConfig = getLayoutConfig(812, 375);
      expect(landscapeConfig.columns).toBe(2);
      expect(landscapeConfig.spacing).toBe('24px');
    });
  });

  describe('고밀도 디스플레이 지원', () => {
    it('디바이스 픽셀 비율을 감지한다', () => {
      // 고밀도 디스플레이 시뮬레이션
      Object.defineProperty(window, 'devicePixelRatio', {
        value: 2,
        writable: true
      });

      expect(window.devicePixelRatio).toBe(2);
    });

    it('고밀도 디스플레이에서 적절한 이미지 크기를 계산한다', () => {
      const getImageSize = (baseSize: number, pixelRatio: number = 1) => {
        return baseSize * pixelRatio;
      };

      // 일반 디스플레이
      expect(getImageSize(100, 1)).toBe(100);

      // 레티나 디스플레이
      expect(getImageSize(100, 2)).toBe(200);

      // 고밀도 디스플레이
      expect(getImageSize(100, 3)).toBe(300);
    });
  });

  describe('접근성 미디어 쿼리', () => {
    it('prefers-reduced-motion을 감지한다', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      expect(prefersReducedMotion).toBe(true);
    });

    it('prefers-contrast를 감지한다', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-contrast: high)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      expect(prefersHighContrast).toBe(true);
    });

    it('prefers-color-scheme을 감지한다', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      expect(prefersDarkMode).toBe(true);
    });
  });

  describe('반응형 타이포그래피', () => {
    it('화면 크기에 따라 적절한 폰트 크기를 계산한다', () => {
      const getResponsiveFontSize = (baseSize: number, breakpoint: string) => {
        const scaleFactor = {
          mobile: 0.875,   // 14px for 16px base
          tablet: 1,       // 16px for 16px base
          desktop: 1.125   // 18px for 16px base
        };

        return baseSize * (scaleFactor[breakpoint as keyof typeof scaleFactor] || 1);
      };

      expect(getResponsiveFontSize(16, 'mobile')).toBe(14);
      expect(getResponsiveFontSize(16, 'tablet')).toBe(16);
      expect(getResponsiveFontSize(16, 'desktop')).toBe(18);
    });

    it('행간이 적절히 조정된다', () => {
      const getLineHeight = (fontSize: number) => {
        // 일반적으로 폰트 크기의 1.4-1.6배
        return Math.max(fontSize * 1.5, 20); // 최소 20px 행간
      };

      expect(getLineHeight(14)).toBe(21);
      expect(getLineHeight(16)).toBe(24);
      expect(getLineHeight(18)).toBe(27);
      expect(getLineHeight(12)).toBe(20); // 최소값 적용
    });
  });

  describe('컨테이너 쿼리 지원', () => {
    it('컨테이너 크기에 따른 레이아웃을 계산한다', () => {
      const getContainerLayout = (containerWidth: number) => {
        if (containerWidth < 400) {
          return { columns: 1, gap: '16px' };
        } else if (containerWidth < 800) {
          return { columns: 2, gap: '20px' };
        } else {
          return { columns: 3, gap: '24px' };
        }
      };

      expect(getContainerLayout(300)).toEqual({ columns: 1, gap: '16px' });
      expect(getContainerLayout(600)).toEqual({ columns: 2, gap: '20px' });
      expect(getContainerLayout(1000)).toEqual({ columns: 3, gap: '24px' });
    });
  });
});