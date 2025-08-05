/**
 * Linear 디자인 시스템 - 색상 유틸리티 함수
 * 색상 조작 및 접근성 관련 유틸리티 함수들
 */

import { colors, lightTheme, darkTheme } from './colors';
import type { ColorToken, ColorShade, ThemeColors } from './colors';

/**
 * 색상 토큰에서 특정 색상 값을 가져오는 함수
 */
export function getColor(token: ColorToken, shade: ColorShade = 500): string {
  return colors[token][shade];
}

/**
 * CSS 변수명을 생성하는 함수
 */
export function getCSSVariable(token: ColorToken, shade: ColorShade): string {
  return `var(--color-${token}-${shade})`;
}

/**
 * 테마별 색상을 가져오는 함수
 */
export function getThemeColor(theme: 'light' | 'dark', category: keyof ThemeColors, variant: string): string {
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  return (themeColors[category] as any)[variant];
}

/**
 * 16진수 색상을 RGB로 변환하는 함수
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * RGB 색상을 16진수로 변환하는 함수
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * 색상의 밝기를 계산하는 함수 (0-255)
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  // sRGB 색공간에서 상대적 밝기 계산
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 두 색상 간의 대비율을 계산하는 함수 (WCAG 기준)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * WCAG AA 기준 (4.5:1)을 만족하는지 확인하는 함수
 */
export function isAccessibleContrast(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 4.5;
}

/**
 * WCAG AAA 기준 (7:1)을 만족하는지 확인하는 함수
 */
export function isHighContrastAccessible(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 7;
}

/**
 * 색상에 투명도를 적용하는 함수
 */
export function withOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0').toUpperCase();
  return `${hex}${alpha}`;
}

/**
 * 색상을 밝게 만드는 함수
 */
export function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const newR = Math.min(255, Math.round(r + (255 - r) * amount));
  const newG = Math.min(255, Math.round(g + (255 - g) * amount));
  const newB = Math.min(255, Math.round(b + (255 - b) * amount));
  
  return rgbToHex(newR, newG, newB);
}

/**
 * 색상을 어둡게 만드는 함수
 */
export function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const newR = Math.max(0, Math.round(r * (1 - amount)));
  const newG = Math.max(0, Math.round(g * (1 - amount)));
  const newB = Math.max(0, Math.round(b * (1 - amount)));
  
  return rgbToHex(newR, newG, newB);
}

/**
 * 색상이 밝은 색인지 어두운 색인지 판단하는 함수
 */
export function isLightColor(hex: string): boolean {
  return getLuminance(hex) > 0.5;
}

/**
 * 배경색에 따라 적절한 텍스트 색상을 반환하는 함수
 */
export function getContrastingTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? colors.neutral[800] : colors.neutral[50];
}

/**
 * 색상 팔레트에서 가장 가까운 색상을 찾는 함수
 */
export function findClosestColor(targetHex: string): { token: ColorToken; shade: ColorShade; hex: string } | null {
  let closestColor = null;
  let minDistance = Infinity;
  
  const targetRgb = hexToRgb(targetHex);
  if (!targetRgb) return null;
  
  Object.entries(colors).forEach(([token, shades]) => {
    Object.entries(shades).forEach(([shade, hex]) => {
      const rgb = hexToRgb(hex);
      if (!rgb) return;
      
      // 유클리드 거리 계산
      const distance = Math.sqrt(
        Math.pow(targetRgb.r - rgb.r, 2) +
        Math.pow(targetRgb.g - rgb.g, 2) +
        Math.pow(targetRgb.b - rgb.b, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = {
          token: token as ColorToken,
          shade: shade as unknown as ColorShade,
          hex
        };
      }
    });
  });
  
  return closestColor;
}

/**
 * 색상 팔레트 전체를 CSS 변수로 변환하는 함수
 */
export function generateCSSVariables(): string {
  let cssVariables = '';
  
  Object.entries(colors).forEach(([token, shades]) => {
    Object.entries(shades).forEach(([shade, hex]) => {
      cssVariables += `  --color-${token}-${shade}: ${hex};\n`;
    });
  });
  
  return cssVariables;
}

/**
 * 테마별 의미적 색상을 CSS 변수로 변환하는 함수
 */
export function generateThemeCSSVariables(theme: 'light' | 'dark'): string {
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  let cssVariables = '';
  
  Object.entries(themeColors).forEach(([category, variants]) => {
    Object.entries(variants).forEach(([variant, value]) => {
      const variableName = `--${category}-${variant}`;
      cssVariables += `  ${variableName}: ${value};\n`;
    });
  });
  
  return cssVariables;
}

/**
 * 색상 접근성 검사 결과를 반환하는 함수
 */
export function checkColorAccessibility(foreground: string, background: string) {
  const contrastRatio = getContrastRatio(foreground, background);
  
  return {
    contrastRatio: Math.round(contrastRatio * 100) / 100,
    wcagAA: contrastRatio >= 4.5,
    wcagAAA: contrastRatio >= 7,
    wcagAALarge: contrastRatio >= 3, // 큰 텍스트용 (18pt 이상)
    recommendation: contrastRatio >= 7 ? 'excellent' : 
                   contrastRatio >= 4.5 ? 'good' : 
                   contrastRatio >= 3 ? 'acceptable-for-large-text' : 'poor'
  };
}

/**
 * 테마별 색상 CSS 변수를 동적으로 적용하는 함수
 */
export function applyThemeColors(theme: 'light' | 'dark', element: HTMLElement = document.documentElement): void {
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  
  // 기존 테마 속성 제거
  element.removeAttribute('data-theme');
  
  // 새 테마 속성 설정
  element.setAttribute('data-theme', theme);
  
  // CSS 변수 동적 적용
  Object.entries(themeColors).forEach(([category, variants]) => {
    Object.entries(variants).forEach(([variant, value]) => {
      const variableName = `--${category}-${variant}`;
      element.style.setProperty(variableName, value as string);
    });
  });
}

/**
 * 현재 적용된 테마를 감지하는 함수
 */
export function getCurrentTheme(): 'light' | 'dark' {
  const element = document.documentElement;
  const dataTheme = element.getAttribute('data-theme') as 'light' | 'dark' | null;
  
  if (dataTheme) {
    return dataTheme;
  }
  
  // 시스템 테마 감지
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * 시스템 테마 변경을 감지하는 함수
 */
export function watchSystemTheme(callback: (theme: 'light' | 'dark') => void): () => void {
  if (!window.matchMedia) {
    return () => {}; // 지원하지 않는 환경에서는 빈 함수 반환
  }
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // 정리 함수 반환
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}

/**
 * 색상 토큰을 Tailwind CSS 클래스명으로 변환하는 함수
 */
export function colorToTailwindClass(token: ColorToken, shade: ColorShade, type: 'bg' | 'text' | 'border' = 'bg'): string {
  return `${type}-${token}-${shade}`;
}

/**
 * CSS 변수를 사용한 색상 값을 반환하는 함수
 */
export function getCSSVariableValue(variableName: string, element: HTMLElement = document.documentElement): string {
  return getComputedStyle(element).getPropertyValue(variableName).trim();
}

/**
 * 테마 색상을 CSS 변수로 반환하는 함수
 */
export function getThemeCSSVariable(category: keyof ThemeColors, variant: string): string {
  return `var(--${category}-${variant})`;
}

/**
 * 색상 팔레트 전체의 접근성을 검사하는 함수
 */
export function validateColorPaletteAccessibility(): {
  token: ColorToken;
  shade: ColorShade;
  issues: string[];
}[] {
  const issues: { token: ColorToken; shade: ColorShade; issues: string[] }[] = [];
  
  // 각 색상에 대해 기본 배경색과의 대비 검사
  const lightBackground = lightTheme.background.primary;
  const darkBackground = darkTheme.background.primary;
  
  Object.entries(colors).forEach(([token, shades]) => {
    Object.entries(shades).forEach(([shade, hex]) => {
      const colorIssues: string[] = [];
      
      // 라이트 테마에서의 접근성 검사
      const lightContrast = getContrastRatio(hex, lightBackground);
      if (lightContrast < 4.5) {
        colorIssues.push(`Light theme contrast ratio (${lightContrast.toFixed(2)}) below WCAG AA standard`);
      }
      
      // 다크 테마에서의 접근성 검사
      const darkContrast = getContrastRatio(hex, darkBackground);
      if (darkContrast < 4.5) {
        colorIssues.push(`Dark theme contrast ratio (${darkContrast.toFixed(2)}) below WCAG AA standard`);
      }
      
      if (colorIssues.length > 0) {
        issues.push({
          token: token as ColorToken,
          shade: shade as unknown as ColorShade,
          issues: colorIssues
        });
      }
    });
  });
  
  return issues;
}