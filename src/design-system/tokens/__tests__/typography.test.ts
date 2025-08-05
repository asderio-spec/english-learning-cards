/**
 * Linear 디자인 시스템 - 타이포그래피 토큰 테스트
 */

import { describe, it, expect } from 'vitest';
import { 
  typography, 
  responsiveTypography,
  getTypographyClasses,
  type TypographyVariant,
  type HeadingLevel,
  type BodySize,
  type CaptionSize,
  type FontWeight,
  type FontFamily
} from '../typography';

describe('Typography Tokens', () => {
  describe('Font Family', () => {
    it('should have correct sans font stack', () => {
      expect(typography.fontFamily.sans).toEqual([
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif'
      ]);
    });

    it('should have correct mono font stack', () => {
      expect(typography.fontFamily.mono).toEqual([
        'SF Mono',
        'Monaco',
        'Inconsolata',
        'Roboto Mono',
        'source-code-pro',
        'Menlo',
        'Consolas',
        'monospace'
      ]);
    });
  });

  describe('Display Typography', () => {
    it('should have correct display styles', () => {
      expect(typography.display).toEqual({
        fontSize: '32px',
        lineHeight: '40px',
        fontWeight: 700,
        letterSpacing: '-0.02em'
      });
    });

    it('should have proper line height ratio', () => {
      const fontSize = parseFloat(typography.display.fontSize);
      const lineHeight = parseFloat(typography.display.lineHeight);
      const ratio = lineHeight / fontSize;
      
      expect(ratio).toBe(1.25); // 40/32 = 1.25
    });
  });

  describe('Heading Typography', () => {
    it('should have all heading levels', () => {
      const headingLevels: HeadingLevel[] = ['h1', 'h2', 'h3', 'h4'];
      
      headingLevels.forEach(level => {
        expect(typography.heading[level]).toBeDefined();
        expect(typography.heading[level]).toHaveProperty('fontSize');
        expect(typography.heading[level]).toHaveProperty('lineHeight');
        expect(typography.heading[level]).toHaveProperty('fontWeight');
        expect(typography.heading[level]).toHaveProperty('letterSpacing');
      });
    });

    it('should have decreasing font sizes', () => {
      const h1Size = parseFloat(typography.heading.h1.fontSize);
      const h2Size = parseFloat(typography.heading.h2.fontSize);
      const h3Size = parseFloat(typography.heading.h3.fontSize);
      const h4Size = parseFloat(typography.heading.h4.fontSize);
      
      expect(h1Size).toBeGreaterThan(h2Size);
      expect(h2Size).toBeGreaterThan(h3Size);
      expect(h3Size).toBeGreaterThan(h4Size);
    });

    it('should have appropriate font weights', () => {
      expect(typography.heading.h1.fontWeight).toBe(700);
      expect(typography.heading.h2.fontWeight).toBe(600);
      expect(typography.heading.h3.fontWeight).toBe(600);
      expect(typography.heading.h4.fontWeight).toBe(600);
    });

    it('should have negative letter spacing for larger headings', () => {
      expect(typography.heading.h1.letterSpacing).toBe('-0.02em');
      expect(typography.heading.h2.letterSpacing).toBe('-0.01em');
      expect(typography.heading.h3.letterSpacing).toBe('-0.01em');
      expect(typography.heading.h4.letterSpacing).toBe('0em');
    });
  });

  describe('Body Typography', () => {
    it('should have all body sizes', () => {
      const bodySizes: BodySize[] = ['large', 'medium', 'small'];
      
      bodySizes.forEach(size => {
        expect(typography.body[size]).toBeDefined();
        expect(typography.body[size]).toHaveProperty('fontSize');
        expect(typography.body[size]).toHaveProperty('lineHeight');
        expect(typography.body[size]).toHaveProperty('fontWeight');
        expect(typography.body[size]).toHaveProperty('letterSpacing');
      });
    });

    it('should have decreasing font sizes', () => {
      const largeSize = parseFloat(typography.body.large.fontSize);
      const mediumSize = parseFloat(typography.body.medium.fontSize);
      const smallSize = parseFloat(typography.body.small.fontSize);
      
      expect(largeSize).toBeGreaterThan(mediumSize);
      expect(mediumSize).toBeGreaterThan(smallSize);
    });

    it('should have consistent font weight', () => {
      expect(typography.body.large.fontWeight).toBe(400);
      expect(typography.body.medium.fontWeight).toBe(400);
      expect(typography.body.small.fontWeight).toBe(400);
    });

    it('should have optimal line height ratios', () => {
      // Body text should have comfortable reading line heights
      const mediumRatio = parseFloat(typography.body.medium.lineHeight) / parseFloat(typography.body.medium.fontSize);
      expect(mediumRatio).toBe(1.5); // 24/16 = 1.5
      
      const largeRatio = parseFloat(typography.body.large.lineHeight) / parseFloat(typography.body.large.fontSize);
      expect(largeRatio).toBeCloseTo(1.56, 1); // 28/18 ≈ 1.56
    });
  });

  describe('Caption Typography', () => {
    it('should have all caption sizes', () => {
      const captionSizes: CaptionSize[] = ['large', 'medium', 'small'];
      
      captionSizes.forEach(size => {
        expect(typography.caption[size]).toBeDefined();
        expect(typography.caption[size]).toHaveProperty('fontSize');
        expect(typography.caption[size]).toHaveProperty('lineHeight');
        expect(typography.caption[size]).toHaveProperty('fontWeight');
        expect(typography.caption[size]).toHaveProperty('letterSpacing');
      });
    });

    it('should have decreasing font sizes', () => {
      const largeSize = parseFloat(typography.caption.large.fontSize);
      const mediumSize = parseFloat(typography.caption.medium.fontSize);
      const smallSize = parseFloat(typography.caption.small.fontSize);
      
      expect(largeSize).toBeGreaterThan(mediumSize);
      expect(mediumSize).toBeGreaterThan(smallSize);
    });

    it('should have medium font weight', () => {
      expect(typography.caption.large.fontWeight).toBe(500);
      expect(typography.caption.medium.fontWeight).toBe(500);
      expect(typography.caption.small.fontWeight).toBe(500);
    });

    it('should have positive letter spacing', () => {
      expect(typography.caption.large.letterSpacing).toBe('0.01em');
      expect(typography.caption.medium.letterSpacing).toBe('0.01em');
      expect(typography.caption.small.letterSpacing).toBe('0.02em');
    });
  });

  describe('Font Weights', () => {
    it('should have all font weight variants', () => {
      const weights: FontWeight[] = ['light', 'normal', 'medium', 'semibold', 'bold', 'extrabold'];
      
      weights.forEach(weight => {
        expect(typography.fontWeight[weight]).toBeDefined();
        expect(typeof typography.fontWeight[weight]).toBe('number');
      });
    });

    it('should have increasing weight values', () => {
      expect(typography.fontWeight.light).toBe(300);
      expect(typography.fontWeight.normal).toBe(400);
      expect(typography.fontWeight.medium).toBe(500);
      expect(typography.fontWeight.semibold).toBe(600);
      expect(typography.fontWeight.bold).toBe(700);
      expect(typography.fontWeight.extrabold).toBe(800);
    });
  });

  describe('Responsive Typography', () => {
    it('should have responsive display styles', () => {
      expect(responsiveTypography.display).toBeDefined();
      expect(responsiveTypography.display.mobile).toHaveProperty('fontSize', '28px');
      expect(responsiveTypography.display.mobile).toHaveProperty('lineHeight', '36px');
      expect(responsiveTypography.display.desktop).toEqual(typography.display);
    });

    it('should have responsive heading styles', () => {
      expect(responsiveTypography.heading.h1).toBeDefined();
      expect(responsiveTypography.heading.h1.mobile).toHaveProperty('fontSize', '24px');
      expect(responsiveTypography.heading.h1.desktop).toEqual(typography.heading.h1);
      
      expect(responsiveTypography.heading.h2).toBeDefined();
      expect(responsiveTypography.heading.h2.mobile).toHaveProperty('fontSize', '20px');
      expect(responsiveTypography.heading.h2.desktop).toEqual(typography.heading.h2);
    });

    it('should have smaller mobile sizes', () => {
      const displayMobile = parseFloat(responsiveTypography.display.mobile.fontSize!);
      const displayDesktop = parseFloat(responsiveTypography.display.desktop.fontSize);
      expect(displayMobile).toBeLessThan(displayDesktop);
      
      const h1Mobile = parseFloat(responsiveTypography.heading.h1.mobile.fontSize!);
      const h1Desktop = parseFloat(responsiveTypography.heading.h1.desktop.fontSize);
      expect(h1Mobile).toBeLessThan(h1Desktop);
    });
  });

  describe('Typography Classes Utility', () => {
    it('should return correct styles for display variant', () => {
      const styles = getTypographyClasses('display');
      expect(styles).toEqual({
        fontSize: '32px',
        lineHeight: '40px',
        fontWeight: 700,
        letterSpacing: '-0.02em'
      });
    });

    it('should return empty object for invalid variant', () => {
      const styles = getTypographyClasses('invalid' as TypographyVariant);
      expect(styles).toEqual({});
    });

    it('should handle nested variants correctly', () => {
      // This test verifies the function handles complex nested structures
      const fontFamilyResult = getTypographyClasses('fontFamily');
      expect(fontFamilyResult).toEqual({});
    });
  });

  describe('Accessibility Compliance', () => {
    it('should meet minimum font size requirements', () => {
      // All font sizes should be at least 11px for accessibility
      const allSizes = [
        typography.display.fontSize,
        ...Object.values(typography.heading).map(h => h.fontSize),
        ...Object.values(typography.body).map(b => b.fontSize),
        ...Object.values(typography.caption).map(c => c.fontSize)
      ];
      
      allSizes.forEach(size => {
        const sizeInPx = parseFloat(size);
        expect(sizeInPx).toBeGreaterThanOrEqual(11);
      });
    });

    it('should have readable line height ratios', () => {
      // Line height should be at least 1.2 for readability
      const testLineHeight = (fontSize: string, lineHeight: string) => {
        const ratio = parseFloat(lineHeight) / parseFloat(fontSize);
        expect(ratio).toBeGreaterThanOrEqual(1.2);
      };
      
      testLineHeight(typography.display.fontSize, typography.display.lineHeight);
      Object.values(typography.heading).forEach(h => {
        testLineHeight(h.fontSize, h.lineHeight);
      });
      Object.values(typography.body).forEach(b => {
        testLineHeight(b.fontSize, b.lineHeight);
      });
      Object.values(typography.caption).forEach(c => {
        testLineHeight(c.fontSize, c.lineHeight);
      });
    });
  });

  describe('Type Safety', () => {
    it('should have correct TypeScript types', () => {
      // This test ensures our types are working correctly
      const variant: TypographyVariant = 'display';
      const headingLevel: HeadingLevel = 'h1';
      const bodySize: BodySize = 'medium';
      const captionSize: CaptionSize = 'large';
      const fontWeight: FontWeight = 'bold';
      const fontFamily: FontFamily = 'sans';
      
      expect(typeof variant).toBe('string');
      expect(typeof headingLevel).toBe('string');
      expect(typeof bodySize).toBe('string');
      expect(typeof captionSize).toBe('string');
      expect(typeof fontWeight).toBe('string');
      expect(typeof fontFamily).toBe('string');
    });
  });
});