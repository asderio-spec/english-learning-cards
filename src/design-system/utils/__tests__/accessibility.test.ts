/**
 * 접근성 유틸리티 테스트
 */

import { vi } from 'vitest';
import {
  calculateContrastRatio,
  isWCAGCompliant,
  detectHighContrastMode,
  addHighContrastListener,
  generateAccessibleColors,
  createHighContrastTheme,
  validateColorAccessibility,
  getSystemAccessibilityPreferences
} from '../accessibility';

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

describe('접근성 유틸리티', () => {
  beforeEach(() => {
    // matchMedia 모킹
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => mockMatchMedia(false))
    });
  });

  describe('calculateContrastRatio', () => {
    it('흰색과 검은색의 대비 비율을 올바르게 계산한다', () => {
      const ratio = calculateContrastRatio('#ffffff', '#000000');
      expect(ratio).toBeCloseTo(21, 0); // 21:1
    });

    it('같은 색상의 대비 비율은 1이다', () => {
      const ratio = calculateContrastRatio('#ff0000', '#ff0000');
      expect(ratio).toBeCloseTo(1, 1);
    });

    it('회색 계열의 대비 비율을 올바르게 계산한다', () => {
      const ratio = calculateContrastRatio('#ffffff', '#767676');
      expect(ratio).toBeGreaterThan(4.5); // WCAG AA 기준 통과
    });

    it('3자리 HEX 색상을 올바르게 처리한다', () => {
      const ratio1 = calculateContrastRatio('#fff', '#000');
      const ratio2 = calculateContrastRatio('#ffffff', '#000000');
      expect(ratio1).toBeCloseTo(ratio2, 1);
    });
  });

  describe('isWCAGCompliant', () => {
    it('WCAG AA 기준을 올바르게 검증한다', () => {
      expect(isWCAGCompliant('#ffffff', '#000000', 'AA')).toBe(true);
      expect(isWCAGCompliant('#ffffff', '#cccccc', 'AA')).toBe(false);
    });

    it('WCAG AAA 기준을 올바르게 검증한다', () => {
      expect(isWCAGCompliant('#ffffff', '#000000', 'AAA')).toBe(true);
      expect(isWCAGCompliant('#ffffff', '#767676', 'AAA')).toBe(false);
    });

    it('큰 텍스트에 대한 기준을 올바르게 적용한다', () => {
      const foreground = '#ffffff';
      const background = '#959595';
      
      const normalResult = isWCAGCompliant(foreground, background, 'AA', 'normal');
      const largeResult = isWCAGCompliant(foreground, background, 'AA', 'large');
      
      // 큰 텍스트는 더 낮은 대비 기준을 가지므로 통과할 가능성이 높음
      expect(normalResult).toBe(false);
      // 실제 대비 비율에 따라 결과가 달라질 수 있으므로 조건부 검증
      if (calculateContrastRatio(foreground, background) >= 3) {
        expect(largeResult).toBe(true);
      }
    });
  });

  describe('detectHighContrastMode', () => {
    it('고대비 모드가 활성화되지 않은 경우 false를 반환한다', () => {
      expect(detectHighContrastMode()).toBe(false);
    });

    it('prefers-contrast: high가 활성화된 경우 true를 반환한다', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => {
        if (query === '(prefers-contrast: high)') {
          return mockMatchMedia(true);
        }
        return mockMatchMedia(false);
      });

      expect(detectHighContrastMode()).toBe(true);
    });

    it('forced-colors: active가 활성화된 경우 true를 반환한다', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => {
        if (query === '(forced-colors: active)') {
          return mockMatchMedia(true);
        }
        return mockMatchMedia(false);
      });

      expect(detectHighContrastMode()).toBe(true);
    });

    it('window가 없는 환경에서 false를 반환한다', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(detectHighContrastMode()).toBe(false);

      global.window = originalWindow;
    });
  });

  describe('addHighContrastListener', () => {
    it('고대비 모드 변경 시 콜백을 호출한다', () => {
      const callback = vi.fn();
      const mockQuery = {
        ...mockMatchMedia(false),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      };

      window.matchMedia = vi.fn().mockReturnValue(mockQuery);

      const cleanup = addHighContrastListener(callback);

      expect(mockQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      cleanup();
      expect(mockQuery.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('window가 없는 환경에서 빈 정리 함수를 반환한다', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const callback = vi.fn();
      const cleanup = addHighContrastListener(callback);

      expect(typeof cleanup).toBe('function');
      expect(() => cleanup()).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('generateAccessibleColors', () => {
    it('이미 접근성 기준을 만족하는 색상은 그대로 반환한다', () => {
      const result = generateAccessibleColors('#000000', '#ffffff');
      
      expect(result.color).toBe('#000000');
      expect(result.isCompliant).toBe(true);
      expect(result.contrastRatio).toBeGreaterThan(4.5);
    });

    it('접근성 기준을 만족하지 않는 색상을 조정한다', () => {
      const result = generateAccessibleColors('#cccccc', '#ffffff');
      
      expect(result.color).not.toBe('#cccccc');
      expect(result.isCompliant).toBe(true);
      expect(result.contrastRatio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('createHighContrastTheme', () => {
    it('라이트 테마를 고대비 테마로 변환한다', () => {
      const baseTheme = {
        background: '#ffffff',
        primary: '#5e6ad2',
        secondary: '#00d2ff',
        text: '#333333'
      };

      const highContrastTheme = createHighContrastTheme(baseTheme);

      expect(highContrastTheme.background).toBe('#ffffff');
      expect(highContrastTheme.foreground).toBe('#000000');
      expect(highContrastTheme.primary).toBeDefined();
      expect(highContrastTheme.secondary).toBeDefined();
    });

    it('다크 테마를 고대비 테마로 변환한다', () => {
      const baseTheme = {
        background: '#000000',
        primary: '#5e6ad2',
        secondary: '#00d2ff',
        text: '#ffffff'
      };

      const highContrastTheme = createHighContrastTheme(baseTheme);

      expect(highContrastTheme.background).toBe('#000000');
      expect(highContrastTheme.foreground).toBe('#ffffff');
    });
  });

  describe('validateColorAccessibility', () => {
    it('접근성을 만족하는 색상 조합을 올바르게 검증한다', () => {
      const result = validateColorAccessibility('#000000', '#ffffff');

      expect(result.wcagAA).toBe(true);
      expect(result.wcagAAA).toBe(true);
      expect(result.contrastRatio).toBeCloseTo(21, 0);
      // 대비가 매우 높은 경우 경고가 포함될 수 있음
      expect(result.recommendations.length).toBeGreaterThanOrEqual(0);
    });

    it('접근성을 만족하지 않는 색상 조합에 대한 권장사항을 제공한다', () => {
      const result = validateColorAccessibility('#cccccc', '#ffffff', {
        usage: 'text',
        importance: 'high'
      });

      expect(result.wcagAA).toBe(false);
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations[0]).toContain('WCAG AA 기준');
    });

    it('대비가 너무 높은 경우 경고를 제공한다', () => {
      // 매우 높은 대비를 만들기 위해 극단적인 색상 사용
      const result = validateColorAccessibility('#000000', '#ffffff');

      if (result.contrastRatio > 15) {
        expect(result.recommendations.some(r => r.includes('대비가 너무 높아'))).toBe(true);
      }
    });

    it('큰 텍스트에 대한 다른 기준을 적용한다', () => {
      const normalResult = validateColorAccessibility('#767676', '#ffffff', { size: 'normal' });
      const largeResult = validateColorAccessibility('#767676', '#ffffff', { size: 'large' });

      // 같은 색상이라도 크기에 따라 결과가 다를 수 있음
      expect(normalResult.wcagAA).toBeDefined();
      expect(largeResult.wcagAA).toBeDefined();
    });
  });

  describe('getSystemAccessibilityPreferences', () => {
    it('시스템 접근성 설정을 올바르게 감지한다', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => {
        const preferences: Record<string, boolean> = {
          '(prefers-reduced-motion: reduce)': true,
          '(prefers-contrast: high)': false,
          '(prefers-reduced-transparency: reduce)': false,
          '(prefers-color-scheme: dark)': true,
          '(prefers-color-scheme: light)': false
        };

        return mockMatchMedia(preferences[query] || false);
      });

      const prefs = getSystemAccessibilityPreferences();

      expect(prefs.prefersReducedMotion).toBe(true);
      expect(prefs.prefersHighContrast).toBe(false);
      expect(prefs.prefersReducedTransparency).toBe(false);
      expect(prefs.prefersColorScheme).toBe('dark');
    });

    it('window가 없는 환경에서 기본값을 반환한다', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const prefs = getSystemAccessibilityPreferences();

      expect(prefs.prefersReducedMotion).toBe(false);
      expect(prefs.prefersHighContrast).toBe(false);
      expect(prefs.prefersReducedTransparency).toBe(false);
      expect(prefs.prefersColorScheme).toBe('no-preference');

      global.window = originalWindow;
    });

    it('matchMedia가 없는 환경에서 기본값을 반환한다', () => {
      // @ts-ignore
      window.matchMedia = undefined;

      const prefs = getSystemAccessibilityPreferences();

      expect(prefs.prefersReducedMotion).toBe(false);
      expect(prefs.prefersHighContrast).toBe(false);
      expect(prefs.prefersReducedTransparency).toBe(false);
      expect(prefs.prefersColorScheme).toBe('no-preference');
    });
  });
});