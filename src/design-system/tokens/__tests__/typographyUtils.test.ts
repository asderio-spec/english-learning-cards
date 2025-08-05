/**
 * Linear 디자인 시스템 - 타이포그래피 유틸리티 함수 테스트
 */

import { describe, it, expect } from 'vitest';
import {
  getTypographyStyle,
  getHeadingStyle,
  getBodyStyle,
  getCaptionStyle,
  getDisplayStyle,
  getResponsiveTypographyStyle,
  getTypographyCSSVariable,
  pxToRem,
  getRelativeLineHeight,
  calculateTypographyScale,
  getOptimalLineHeight,
  getTextTruncationStyle,
  generateTypographyCSSVariables,
  createResponsiveTypographyClasses,
  validateMinimumFontSize,
  getOptimalCharactersPerLine
} from '../typographyUtils';

describe('Typography Utilities', () => {
  describe('getTypographyStyle', () => {
    it('should return display styles', () => {
      const styles = getTypographyStyle('display');
      expect(styles).toEqual({
        fontSize: '32px',
        lineHeight: '40px',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif'
      });
    });

    it('should return heading styles with subvariant', () => {
      const styles = getTypographyStyle('heading', 'h1');
      expect(styles).toEqual({
        fontSize: '28px',
        lineHeight: '36px',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif'
      });
    });

    it('should return empty object for invalid variant', () => {
      const styles = getTypographyStyle('invalid' as any);
      expect(styles).toEqual({});
    });

    it('should return empty object for invalid subvariant', () => {
      const styles = getTypographyStyle('heading', 'invalid');
      expect(styles).toEqual({});
    });
  });

  describe('Specific Style Getters', () => {
    it('should get heading styles', () => {
      const h1Styles = getHeadingStyle('h1');
      expect(h1Styles.fontSize).toBe('28px');
      expect(h1Styles.fontWeight).toBe(700);
    });

    it('should get body styles', () => {
      const bodyStyles = getBodyStyle('medium');
      expect(bodyStyles.fontSize).toBe('16px');
      expect(bodyStyles.fontWeight).toBe(400);
    });

    it('should get caption styles', () => {
      const captionStyles = getCaptionStyle('large');
      expect(captionStyles.fontSize).toBe('14px');
      expect(captionStyles.fontWeight).toBe(500);
    });

    it('should get display styles', () => {
      const displayStyles = getDisplayStyle();
      expect(displayStyles.fontSize).toBe('32px');
      expect(displayStyles.fontWeight).toBe(700);
    });
  });

  describe('getResponsiveTypographyStyle', () => {
    it('should return responsive display styles', () => {
      const styles = getResponsiveTypographyStyle('display');
      expect(styles.fontSize).toBe('28px'); // mobile first
      expect(styles['@media (min-width: 768px)'].fontSize).toBe('32px'); // desktop
    });

    it('should return responsive heading styles', () => {
      const styles = getResponsiveTypographyStyle('heading', 'h1');
      expect(styles.fontSize).toBe('24px'); // mobile first
      expect(styles['@media (min-width: 768px)'].fontSize).toBe('28px'); // desktop
    });

    it('should return empty object for invalid variant', () => {
      const styles = getResponsiveTypographyStyle('invalid' as any);
      expect(styles).toEqual({});
    });
  });

  describe('getTypographyCSSVariable', () => {
    it('should generate CSS variable names', () => {
      const variable = getTypographyCSSVariable('display', 'fontSize');
      expect(variable).toBe('var(--font-fontSize-display)');
    });

    it('should generate CSS variable names with subvariant', () => {
      const variable = getTypographyCSSVariable('heading', 'fontSize', 'h1');
      expect(variable).toBe('var(--font-fontSize-heading-h1)');
    });
  });

  describe('pxToRem', () => {
    it('should convert px string to rem', () => {
      expect(pxToRem('16px')).toBe('1rem');
      expect(pxToRem('32px')).toBe('2rem');
      expect(pxToRem('8px')).toBe('0.5rem');
    });

    it('should convert px number to rem', () => {
      expect(pxToRem(16)).toBe('1rem');
      expect(pxToRem(32)).toBe('2rem');
      expect(pxToRem(8)).toBe('0.5rem');
    });

    it('should use custom base font size', () => {
      expect(pxToRem('20px', 20)).toBe('1rem');
      expect(pxToRem(40, 20)).toBe('2rem');
    });
  });

  describe('getRelativeLineHeight', () => {
    it('should calculate relative line height', () => {
      expect(getRelativeLineHeight('16px', '24px')).toBe(1.5);
      expect(getRelativeLineHeight('32px', '40px')).toBe(1.25);
      expect(getRelativeLineHeight('14px', '20px')).toBeCloseTo(1.43, 2);
    });
  });

  describe('calculateTypographyScale', () => {
    it('should calculate typography scale with default values', () => {
      const scale = calculateTypographyScale();
      expect(scale.base).toBe(16);
      expect(scale.lg).toBe(20); // 16 * 1.25
      expect(scale.xl).toBe(25); // 16 * 1.25^2
      expect(scale.sm).toBe(13); // 16 / 1.25
    });

    it('should calculate typography scale with custom values', () => {
      const scale = calculateTypographyScale(18, 1.2);
      expect(scale.base).toBe(18);
      expect(scale.lg).toBe(22); // 18 * 1.2
      expect(scale.sm).toBe(15); // 18 / 1.2
    });
  });

  describe('getOptimalLineHeight', () => {
    it('should return appropriate line heights for different font sizes', () => {
      expect(getOptimalLineHeight(12)).toBe(1.6);
      expect(getOptimalLineHeight(14)).toBe(1.5);
      expect(getOptimalLineHeight(16)).toBe(1.5);
      expect(getOptimalLineHeight(18)).toBe(1.4);
      expect(getOptimalLineHeight(24)).toBe(1.3);
      expect(getOptimalLineHeight(32)).toBe(1.2);
    });
  });

  describe('getTextTruncationStyle', () => {
    it('should return single line truncation by default', () => {
      const styles = getTextTruncationStyle();
      expect(styles).toEqual({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      });
    });

    it('should return single line truncation explicitly', () => {
      const styles = getTextTruncationStyle(1);
      expect(styles).toEqual({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      });
    });

    it('should return multi-line truncation', () => {
      const styles = getTextTruncationStyle(3);
      expect(styles).toEqual({
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      });
    });
  });

  describe('generateTypographyCSSVariables', () => {
    it('should generate CSS variables string', () => {
      const cssVariables = generateTypographyCSSVariables();
      
      expect(cssVariables).toContain('--font-family-sans:');
      expect(cssVariables).toContain('--font-family-mono:');
      expect(cssVariables).toContain('--font-size-display:');
      expect(cssVariables).toContain('--font-size-h1:');
      expect(cssVariables).toContain('--font-size-body-medium:');
      expect(cssVariables).toContain('--font-size-caption-large:');
      expect(cssVariables).toContain('--font-weight-bold:');
    });

    it('should include all typography tokens', () => {
      const cssVariables = generateTypographyCSSVariables();
      
      // Check for display
      expect(cssVariables).toContain('--font-size-display: 32px');
      expect(cssVariables).toContain('--line-height-display: 40px');
      
      // Check for headings
      expect(cssVariables).toContain('--font-size-h1: 28px');
      expect(cssVariables).toContain('--font-size-h2: 24px');
      
      // Check for body
      expect(cssVariables).toContain('--font-size-body-medium: 16px');
      
      // Check for captions
      expect(cssVariables).toContain('--font-size-caption-large: 14px');
      
      // Check for font weights
      expect(cssVariables).toContain('--font-weight-bold: 700');
    });
  });

  describe('createResponsiveTypographyClasses', () => {
    it('should create responsive typography classes', () => {
      const classes = createResponsiveTypographyClasses();
      
      expect(classes['text-display-responsive']).toBeDefined();
      expect(classes['text-h1-responsive']).toBeDefined();
      expect(classes['text-h2-responsive']).toBeDefined();
      
      // Check mobile-first approach
      expect(classes['text-display-responsive'].fontSize).toBe('28px');
      expect(classes['text-display-responsive']['@media (min-width: 768px)'].fontSize).toBe('32px');
    });

    it('should include all necessary properties', () => {
      const classes = createResponsiveTypographyClasses();
      const displayClass = classes['text-display-responsive'];
      
      expect(displayClass).toHaveProperty('fontSize');
      expect(displayClass).toHaveProperty('lineHeight');
      expect(displayClass).toHaveProperty('fontWeight');
      expect(displayClass).toHaveProperty('letterSpacing');
      expect(displayClass).toHaveProperty('@media (min-width: 768px)');
    });
  });

  describe('validateMinimumFontSize', () => {
    it('should validate minimum font sizes', () => {
      expect(validateMinimumFontSize('16px')).toBe(true);
      expect(validateMinimumFontSize('12px')).toBe(true);
      expect(validateMinimumFontSize('11px')).toBe(false);
      expect(validateMinimumFontSize(16)).toBe(true);
      expect(validateMinimumFontSize(10)).toBe(false);
    });
  });

  describe('getOptimalCharactersPerLine', () => {
    it('should calculate optimal characters per line', () => {
      const result = getOptimalCharactersPerLine(16);
      expect(result.optimal).toBe(66); // Base optimal for 16px
      expect(result.min).toBe(Math.round(66 * 0.7));
      expect(result.max).toBe(Math.round(66 * 1.3));
    });

    it('should adjust for different font sizes', () => {
      const small = getOptimalCharactersPerLine(12);
      const large = getOptimalCharactersPerLine(24);
      
      expect(small.optimal).toBeGreaterThan(large.optimal);
    });

    it('should provide reasonable ranges', () => {
      const result = getOptimalCharactersPerLine(16);
      expect(result.min).toBeLessThan(result.optimal);
      expect(result.optimal).toBeLessThan(result.max);
      expect(result.min).toBeGreaterThan(0);
    });
  });

  describe('Integration Tests', () => {
    it('should work together for complete typography system', () => {
      // Get a heading style
      const h1Style = getHeadingStyle('h1');
      
      // Convert to rem
      const fontSizeRem = pxToRem(h1Style.fontSize);
      
      // Get relative line height
      const relativeLineHeight = getRelativeLineHeight(h1Style.fontSize, h1Style.lineHeight);
      
      // Validate minimum size
      const isValidSize = validateMinimumFontSize(h1Style.fontSize);
      
      expect(fontSizeRem).toBe('1.75rem'); // 28px / 16px
      expect(relativeLineHeight).toBeCloseTo(1.29, 2); // 36/28
      expect(isValidSize).toBe(true);
    });

    it('should generate consistent CSS variables and utilities', () => {
      const cssVars = generateTypographyCSSVariables();
      const responsiveClasses = createResponsiveTypographyClasses();
      
      // CSS variables should contain values used in responsive classes
      expect(cssVars).toContain('32px'); // Display desktop size
      expect(responsiveClasses['text-display-responsive']['@media (min-width: 768px)'].fontSize).toBe('32px');
    });
  });
});