/**
 * Linear 디자인 시스템 - 색상 토큰 테스트
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { colors, lightTheme, darkTheme } from '../colors';
import {
  getColor,
  getCSSVariable,
  getThemeColor,
  hexToRgb,
  rgbToHex,
  getLuminance,
  getContrastRatio,
  isAccessibleContrast,
  isHighContrastAccessible,
  withOpacity,
  lighten,
  darken,
  isLightColor,
  getContrastingTextColor,
  generateCSSVariables,
  generateThemeCSSVariables,
  checkColorAccessibility,
  applyThemeColors,
  getCurrentTheme,
  colorToTailwindClass,
  getCSSVariableValue,
  getThemeCSSVariable,
  validateColorPaletteAccessibility
} from '../colorUtils';

// DOM 환경 모킹
const mockElement = {
  style: {
    setProperty: vi.fn(),
    getPropertyValue: vi.fn()
  },
  setAttribute: vi.fn(),
  removeAttribute: vi.fn()
} as any;

const mockMatchMedia = vi.fn();

beforeEach(() => {
  // DOM API 모킹
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia
  });

  Object.defineProperty(document, 'documentElement', {
    writable: true,
    value: mockElement
  });

  Object.defineProperty(window, 'getComputedStyle', {
    writable: true,
    value: () => ({
      getPropertyValue: (prop: string) => {
        if (prop === '--color-primary-500') return '#5E6AD2';
        if (prop === '--bg-primary') return '#F6F8FA';
        return '';
      }
    })
  });

  // 모킹 초기화
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Color Tokens', () => {
  it('should have all required color scales', () => {
    expect(colors).toHaveProperty('primary');
    expect(colors).toHaveProperty('secondary');
    expect(colors).toHaveProperty('success');
    expect(colors).toHaveProperty('warning');
    expect(colors).toHaveProperty('error');
    expect(colors).toHaveProperty('neutral');
  });

  it('should have Linear brand colors', () => {
    expect(colors.primary[500]).toBe('#5E6AD2'); // Linear Purple
    expect(colors.secondary[500]).toBe('#00D2FF'); // Accent Blue
    expect(colors.success[500]).toBe('#00C896'); // Success Green
  });

  it('should have complete color scales (50-900)', () => {
    const expectedShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
    
    Object.values(colors).forEach(colorScale => {
      expectedShades.forEach(shade => {
        expect(colorScale).toHaveProperty(shade);
        expect(typeof colorScale[shade as keyof typeof colorScale]).toBe('string');
        expect(colorScale[shade as keyof typeof colorScale]).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });
});

describe('Theme Colors', () => {
  it('should have light theme configuration', () => {
    expect(lightTheme).toHaveProperty('background');
    expect(lightTheme).toHaveProperty('surface');
    expect(lightTheme).toHaveProperty('text');
    expect(lightTheme).toHaveProperty('border');
    expect(lightTheme).toHaveProperty('shadow');
  });

  it('should have dark theme configuration', () => {
    expect(darkTheme).toHaveProperty('background');
    expect(darkTheme).toHaveProperty('surface');
    expect(darkTheme).toHaveProperty('text');
    expect(darkTheme).toHaveProperty('border');
    expect(darkTheme).toHaveProperty('shadow');
  });

  it('should have different colors for light and dark themes', () => {
    expect(lightTheme.background.primary).not.toBe(darkTheme.background.primary);
    expect(lightTheme.text.primary).not.toBe(darkTheme.text.primary);
  });
});

describe('Color Utility Functions', () => {
  describe('getColor', () => {
    it('should return correct color value', () => {
      expect(getColor('primary', 500)).toBe('#5E6AD2');
      expect(getColor('secondary', 500)).toBe('#00D2FF');
    });

    it('should default to shade 500', () => {
      expect(getColor('primary')).toBe('#5E6AD2');
    });
  });

  describe('getCSSVariable', () => {
    it('should generate correct CSS variable name', () => {
      expect(getCSSVariable('primary', 500)).toBe('var(--color-primary-500)');
      expect(getCSSVariable('neutral', 100)).toBe('var(--color-neutral-100)');
    });
  });

  describe('getThemeColor', () => {
    it('should return correct theme color', () => {
      expect(getThemeColor('light', 'background', 'primary')).toBe(lightTheme.background.primary);
      expect(getThemeColor('dark', 'text', 'primary')).toBe(darkTheme.text.primary);
    });
  });

  describe('hexToRgb', () => {
    it('should convert hex to RGB correctly', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#5E6AD2')).toEqual({ r: 94, g: 106, b: 210 });
    });

    it('should handle hex without # prefix', () => {
      expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#GG0000')).toBeNull();
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB to hex correctly', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(94, 106, 210)).toBe('#5e6ad2');
    });
  });

  describe('getLuminance', () => {
    it('should calculate luminance correctly', () => {
      const whiteLuminance = getLuminance('#FFFFFF');
      const blackLuminance = getLuminance('#000000');
      
      expect(whiteLuminance).toBeGreaterThan(blackLuminance);
      expect(whiteLuminance).toBeCloseTo(1, 1);
      expect(blackLuminance).toBeCloseTo(0, 1);
    });
  });

  describe('getContrastRatio', () => {
    it('should calculate contrast ratio correctly', () => {
      const whiteBlackContrast = getContrastRatio('#FFFFFF', '#000000');
      expect(whiteBlackContrast).toBeCloseTo(21, 0); // Maximum contrast ratio
      
      const sameColorContrast = getContrastRatio('#5E6AD2', '#5E6AD2');
      expect(sameColorContrast).toBe(1); // Same color has 1:1 ratio
    });
  });

  describe('isAccessibleContrast', () => {
    it('should correctly identify accessible contrast', () => {
      expect(isAccessibleContrast('#000000', '#FFFFFF')).toBe(true); // High contrast
      expect(isAccessibleContrast('#5E6AD2', '#FFFFFF')).toBe(true); // Should be accessible
      expect(isAccessibleContrast('#F0F2FF', '#FFFFFF')).toBe(false); // Too low contrast
    });
  });

  describe('isHighContrastAccessible', () => {
    it('should correctly identify AAA level contrast', () => {
      expect(isHighContrastAccessible('#000000', '#FFFFFF')).toBe(true);
      expect(isHighContrastAccessible('#5E6AD2', '#FFFFFF')).toBe(false); // AA but not AAA
    });
  });

  describe('withOpacity', () => {
    it('should add opacity to hex color', () => {
      expect(withOpacity('#FF0000', 0.5)).toBe('#FF000080');
      expect(withOpacity('#5E6AD2', 0.1)).toBe('#5E6AD21A');
    });
  });

  describe('lighten', () => {
    it('should lighten color correctly', () => {
      const original = '#5E6AD2';
      const lightened = lighten(original, 0.2);
      
      expect(lightened).not.toBe(original);
      expect(getLuminance(lightened)).toBeGreaterThan(getLuminance(original));
    });
  });

  describe('darken', () => {
    it('should darken color correctly', () => {
      const original = '#5E6AD2';
      const darkened = darken(original, 0.2);
      
      expect(darkened).not.toBe(original);
      expect(getLuminance(darkened)).toBeLessThan(getLuminance(original));
    });
  });

  describe('isLightColor', () => {
    it('should correctly identify light and dark colors', () => {
      expect(isLightColor('#FFFFFF')).toBe(true);
      expect(isLightColor('#000000')).toBe(false);
      expect(isLightColor('#F6F8FA')).toBe(true); // Light neutral
      expect(isLightColor('#24292E')).toBe(false); // Dark neutral
    });
  });

  describe('getContrastingTextColor', () => {
    it('should return appropriate text color for background', () => {
      expect(getContrastingTextColor('#FFFFFF')).toBe(colors.neutral[800]); // Dark text on light bg
      expect(getContrastingTextColor('#000000')).toBe(colors.neutral[50]); // Light text on dark bg
    });
  });

  describe('generateCSSVariables', () => {
    it('should generate CSS variables for all colors', () => {
      const cssVars = generateCSSVariables();
      
      expect(cssVars).toContain('--color-primary-500: #5E6AD2;');
      expect(cssVars).toContain('--color-secondary-500: #00D2FF;');
      expect(cssVars).toContain('--color-neutral-50: #F6F8FA;');
    });
  });

  describe('generateThemeCSSVariables', () => {
    it('should generate theme-specific CSS variables', () => {
      const lightVars = generateThemeCSSVariables('light');
      const darkVars = generateThemeCSSVariables('dark');
      
      expect(lightVars).toContain('--background-primary:');
      expect(darkVars).toContain('--background-primary:');
      expect(lightVars).not.toBe(darkVars);
    });
  });

  describe('checkColorAccessibility', () => {
    it('should return comprehensive accessibility information', () => {
      const result = checkColorAccessibility('#5E6AD2', '#FFFFFF');
      
      expect(result).toHaveProperty('contrastRatio');
      expect(result).toHaveProperty('wcagAA');
      expect(result).toHaveProperty('wcagAAA');
      expect(result).toHaveProperty('wcagAALarge');
      expect(result).toHaveProperty('recommendation');
      
      expect(typeof result.contrastRatio).toBe('number');
      expect(typeof result.wcagAA).toBe('boolean');
    });
  });

  describe('colorToTailwindClass', () => {
    it('should generate correct Tailwind class names', () => {
      expect(colorToTailwindClass('primary', 500, 'bg')).toBe('bg-primary-500');
      expect(colorToTailwindClass('neutral', 100, 'text')).toBe('text-neutral-100');
      expect(colorToTailwindClass('error', 500, 'border')).toBe('border-error-500');
    });

    it('should default to bg type', () => {
      expect(colorToTailwindClass('primary', 500)).toBe('bg-primary-500');
    });
  });

  describe('getThemeCSSVariable', () => {
    it('should generate theme CSS variable names', () => {
      expect(getThemeCSSVariable('background', 'primary')).toBe('var(--background-primary)');
      expect(getThemeCSSVariable('text', 'secondary')).toBe('var(--text-secondary)');
    });
  });
});

describe('Theme Management Functions', () => {
  describe('applyThemeColors', () => {
    it('should apply theme colors to element', () => {
      applyThemeColors('dark', mockElement);
      
      expect(mockElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      expect(mockElement.removeAttribute).toHaveBeenCalledWith('data-theme');
      expect(mockElement.style.setProperty).toHaveBeenCalled();
    });
  });

  describe('getCurrentTheme', () => {
    it('should return light theme by default', () => {
      mockMatchMedia.mockReturnValue({ matches: false });
      mockElement.getAttribute = vi.fn().mockReturnValue(null);
      
      expect(getCurrentTheme()).toBe('light');
    });

    it('should return dark theme when system prefers dark', () => {
      mockMatchMedia.mockReturnValue({ matches: true });
      mockElement.getAttribute = vi.fn().mockReturnValue(null);
      
      expect(getCurrentTheme()).toBe('dark');
    });

    it('should return data-theme attribute value when set', () => {
      mockElement.getAttribute = vi.fn().mockReturnValue('dark');
      
      expect(getCurrentTheme()).toBe('dark');
    });
  });
});

describe('Color Palette Validation', () => {
  describe('validateColorPaletteAccessibility', () => {
    it('should validate color palette accessibility', () => {
      const issues = validateColorPaletteAccessibility();
      
      expect(Array.isArray(issues)).toBe(true);
      
      // 각 이슈는 올바른 구조를 가져야 함
      issues.forEach(issue => {
        expect(issue).toHaveProperty('token');
        expect(issue).toHaveProperty('shade');
        expect(issue).toHaveProperty('issues');
        expect(Array.isArray(issue.issues)).toBe(true);
      });
    });
  });
});