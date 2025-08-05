/**
 * Linear 디자인 시스템 - 접근성 유틸리티
 * 고대비 모드, 색상 대비 검증, 접근성 테마 관련 유틸리티
 */

/**
 * 색상 대비 비율 계산
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const luminance1 = getRelativeLuminance(color1);
  const luminance2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 상대 휘도 계산 (WCAG 2.1 기준)
 */
function getRelativeLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  
  // sRGB 색상 공간에서 선형 RGB로 변환
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  // 상대 휘도 계산
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * HEX 색상을 RGB로 변환
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // #을 제거하고 3자리 hex를 6자리로 확장
  const cleanHex = hex.replace('#', '');
  const expandedHex = cleanHex.length === 3 
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex;
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expandedHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * WCAG 준수 여부 확인
 */
export function isWCAGCompliant(
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = calculateContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  } else {
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
  }
}

/**
 * 고대비 모드 감지
 */
export function detectHighContrastMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  // CSS 미디어 쿼리로 고대비 모드 감지
  if (window.matchMedia) {
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    if (highContrastQuery.matches) return true;
    
    // Windows 고대비 모드 감지 (레거시)
    const forcedColorsQuery = window.matchMedia('(forced-colors: active)');
    if (forcedColorsQuery.matches) return true;
  }
  
  return false;
}

/**
 * 고대비 모드 변경 감지 리스너
 */
export function addHighContrastListener(callback: (isHighContrast: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const listeners: (() => void)[] = [];
  
  if (window.matchMedia) {
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const forcedColorsQuery = window.matchMedia('(forced-colors: active)');
    
    const handleChange = () => {
      callback(highContrastQuery.matches || forcedColorsQuery.matches);
    };
    
    highContrastQuery.addEventListener('change', handleChange);
    forcedColorsQuery.addEventListener('change', handleChange);
    
    listeners.push(
      () => highContrastQuery.removeEventListener('change', handleChange),
      () => forcedColorsQuery.removeEventListener('change', handleChange)
    );
  }
  
  // 정리 함수 반환
  return () => {
    listeners.forEach(cleanup => cleanup());
  };
}

/**
 * 접근성 테마 색상 생성
 */
export function generateAccessibleColors(baseColor: string, background: string = '#ffffff'): {
  color: string;
  contrastRatio: number;
  isCompliant: boolean;
} {
  let adjustedColor = baseColor;
  let contrastRatio = calculateContrastRatio(adjustedColor, background);
  
  // WCAG AA 기준을 만족할 때까지 색상 조정
  if (contrastRatio < 4.5) {
    adjustedColor = adjustColorForContrast(baseColor, background, 4.5);
    contrastRatio = calculateContrastRatio(adjustedColor, background);
  }
  
  return {
    color: adjustedColor,
    contrastRatio,
    isCompliant: contrastRatio >= 4.5
  };
}

/**
 * 대비를 위해 색상 조정
 */
function adjustColorForContrast(color: string, background: string, targetRatio: number): string {
  const rgb = hexToRgb(color);
  const bgRgb = hexToRgb(background);
  
  if (!rgb || !bgRgb) return color;
  
  const bgLuminance = getRelativeLuminance(background);
  const colorLuminance = getRelativeLuminance(color);
  
  // 배경이 밝으면 색상을 어둡게, 어두우면 밝게 조정
  const shouldDarken = bgLuminance > 0.5;
  
  let adjustedRgb = { ...rgb };
  let currentRatio = calculateContrastRatio(rgbToHex(adjustedRgb), background);
  
  // 이진 탐색으로 적절한 색상 찾기
  let step = shouldDarken ? -10 : 10;
  let iterations = 0;
  const maxIterations = 25;
  
  while (currentRatio < targetRatio && iterations < maxIterations) {
    if (shouldDarken) {
      adjustedRgb.r = Math.max(0, adjustedRgb.r + step);
      adjustedRgb.g = Math.max(0, adjustedRgb.g + step);
      adjustedRgb.b = Math.max(0, adjustedRgb.b + step);
    } else {
      adjustedRgb.r = Math.min(255, adjustedRgb.r + step);
      adjustedRgb.g = Math.min(255, adjustedRgb.g + step);
      adjustedRgb.b = Math.min(255, adjustedRgb.b + step);
    }
    
    currentRatio = calculateContrastRatio(rgbToHex(adjustedRgb), background);
    iterations++;
  }
  
  return rgbToHex(adjustedRgb);
}

/**
 * RGB를 HEX로 변환
 */
function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * 고대비 테마 색상 팔레트 생성
 */
export function createHighContrastTheme(baseTheme: Record<string, string>): Record<string, string> {
  const highContrastTheme: Record<string, string> = {};
  
  // 기본 배경색 (고대비 모드에서는 순수 흰색 또는 검은색 사용)
  const isLightTheme = getRelativeLuminance(baseTheme.background || '#ffffff') > 0.5;
  const background = isLightTheme ? '#ffffff' : '#000000';
  const foreground = isLightTheme ? '#000000' : '#ffffff';
  
  highContrastTheme.background = background;
  highContrastTheme.foreground = foreground;
  
  // 다른 색상들을 고대비로 조정
  Object.entries(baseTheme).forEach(([key, value]) => {
    if (key === 'background' || key === 'foreground') return;
    
    const adjusted = generateAccessibleColors(value, background);
    highContrastTheme[key] = adjusted.color;
  });
  
  return highContrastTheme;
}

/**
 * 접근성 색상 검증 결과
 */
export interface ColorAccessibilityResult {
  contrastRatio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  recommendations: string[];
}

/**
 * 색상 접근성 종합 검증
 */
export function validateColorAccessibility(
  foreground: string,
  background: string,
  context: {
    size?: 'normal' | 'large';
    importance?: 'low' | 'medium' | 'high';
    usage?: 'text' | 'ui' | 'decoration';
  } = {}
): ColorAccessibilityResult {
  const { size = 'normal', importance = 'medium', usage = 'text' } = context;
  
  const contrastRatio = calculateContrastRatio(foreground, background);
  const wcagAA = isWCAGCompliant(foreground, background, 'AA', size);
  const wcagAAA = isWCAGCompliant(foreground, background, 'AAA', size);
  
  const recommendations: string[] = [];
  
  if (!wcagAA) {
    recommendations.push(`현재 대비 비율 ${contrastRatio.toFixed(2)}:1이 WCAG AA 기준(${size === 'large' ? '3:1' : '4.5:1'})을 만족하지 않습니다.`);
    
    if (usage === 'text') {
      recommendations.push('텍스트의 가독성을 위해 색상을 조정하세요.');
    }
  }
  
  if (wcagAA && !wcagAAA && importance === 'high') {
    recommendations.push(`중요한 콘텐츠의 경우 WCAG AAA 기준(${size === 'large' ? '4.5:1' : '7:1'})을 권장합니다.`);
  }
  
  if (contrastRatio > 15) {
    recommendations.push('대비가 너무 높아 눈의 피로를 유발할 수 있습니다.');
  }
  
  return {
    contrastRatio,
    wcagAA,
    wcagAAA,
    recommendations
  };
}

/**
 * 시스템 접근성 설정 감지
 */
export function getSystemAccessibilityPreferences(): {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersReducedTransparency: boolean;
  prefersColorScheme: 'light' | 'dark' | 'no-preference';
} {
  if (typeof window === 'undefined') {
    return {
      prefersReducedMotion: false,
      prefersHighContrast: false,
      prefersReducedTransparency: false,
      prefersColorScheme: 'no-preference'
    };
  }
  
  const matchMedia = window.matchMedia;
  
  return {
    prefersReducedMotion: matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false,
    prefersHighContrast: matchMedia?.('(prefers-contrast: high)')?.matches ?? false,
    prefersReducedTransparency: matchMedia?.('(prefers-reduced-transparency: reduce)')?.matches ?? false,
    prefersColorScheme: matchMedia?.('(prefers-color-scheme: dark)')?.matches 
      ? 'dark' 
      : matchMedia?.('(prefers-color-scheme: light)')?.matches 
        ? 'light' 
        : 'no-preference'
  };
}