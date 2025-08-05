/**
 * Linear 디자인 시스템 - 간격 유틸리티 함수
 * 간격, 레이아웃, 반응형 관련 유틸리티 함수들
 */

import { spacing, semanticSpacing, componentSpacing, breakpoints, containerMaxWidth, grid, responsiveSpacing } from './spacing';
import type { SpacingSize, SemanticSpacingSize, BreakpointSize, ContainerSize } from './spacing';

/**
 * 간격 값을 가져오는 함수
 */
export function getSpacingValue(size: SpacingSize | SemanticSpacingSize): string {
  if (size in spacing) {
    return spacing[size as SpacingSize];
  }
  if (size in semanticSpacing) {
    return semanticSpacing[size as SemanticSpacingSize];
  }
  return '0px';
}

/**
 * CSS 간격 변수명을 생성하는 함수
 */
export function getSpacingCSSVariable(size: SpacingSize | SemanticSpacingSize): string {
  return `var(--spacing-${size})`;
}

/**
 * 컴포넌트별 간격을 가져오는 함수
 */
export function getComponentSpacing(component: keyof typeof componentSpacing, variant?: string, axis?: 'x' | 'y') {
  const componentStyles = componentSpacing[component];
  
  if (typeof componentStyles === 'object' && variant && variant in componentStyles) {
    const variantStyles = (componentStyles as any)[variant];
    
    if (axis && typeof variantStyles === 'object' && axis in variantStyles) {
      return variantStyles[axis];
    }
    
    return variantStyles;
  }
  
  return componentStyles;
}

/**
 * 반응형 간격을 생성하는 함수
 */
export function createResponsiveSpacing(mobileSize: string, tabletSize?: string, desktopSize?: string) {
  return {
    mobile: mobileSize,
    tablet: tabletSize || mobileSize,
    desktop: desktopSize || tabletSize || mobileSize
  };
}

/**
 * 미디어 쿼리를 생성하는 함수
 */
export function createMediaQuery(breakpoint: BreakpointSize, type: 'min' | 'max' = 'min'): string {
  const size = breakpoints[breakpoint];
  return `@media (${type}-width: ${size})`;
}

/**
 * 브레이크포인트 범위 미디어 쿼리를 생성하는 함수
 */
export function createRangeMediaQuery(minBreakpoint: BreakpointSize, maxBreakpoint: BreakpointSize): string {
  const minSize = breakpoints[minBreakpoint];
  const maxSize = breakpoints[maxBreakpoint];
  return `@media (min-width: ${minSize}) and (max-width: ${maxSize})`;
}

/**
 * 컨테이너 스타일을 생성하는 함수
 */
export function createContainerStyle(size: ContainerSize = 'lg', centered: boolean = true) {
  const maxWidth = containerMaxWidth[size];
  
  return {
    width: '100%',
    maxWidth,
    ...(centered && {
      marginLeft: 'auto',
      marginRight: 'auto'
    }),
    paddingLeft: responsiveSpacing.container.mobile,
    paddingRight: responsiveSpacing.container.mobile,
    
    [createMediaQuery('tablet')]: {
      paddingLeft: responsiveSpacing.container.tablet,
      paddingRight: responsiveSpacing.container.tablet
    },
    
    [createMediaQuery('desktop')]: {
      paddingLeft: responsiveSpacing.container.desktop,
      paddingRight: responsiveSpacing.container.desktop
    }
  };
}

/**
 * 그리드 컨테이너 스타일을 생성하는 함수
 */
export function createGridContainerStyle() {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
    gap: grid.gutter.mobile,
    
    [createMediaQuery('tablet')]: {
      gap: grid.gutter.tablet
    },
    
    [createMediaQuery('desktop')]: {
      gap: grid.gutter.desktop
    }
  };
}

/**
 * 그리드 아이템 스타일을 생성하는 함수
 */
export function createGridItemStyle(span: number = 1, start?: number) {
  return {
    gridColumn: start ? `${start} / span ${span}` : `span ${span}`
  };
}

/**
 * 플렉스 컨테이너 스타일을 생성하는 함수
 */
export function createFlexStyle(
  direction: 'row' | 'column' = 'row',
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' = 'start',
  align: 'start' | 'center' | 'end' | 'stretch' = 'start',
  gap?: SemanticSpacingSize
) {
  const justifyContentMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  };
  
  const alignItemsMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch'
  };
  
  return {
    display: 'flex',
    flexDirection: direction,
    justifyContent: justifyContentMap[justify],
    alignItems: alignItemsMap[align],
    ...(gap && { gap: getSpacingValue(gap) })
  };
}

/**
 * 스택 레이아웃 스타일을 생성하는 함수
 */
export function createStackStyle(gap: keyof typeof componentSpacing.stack = 'md', direction: 'vertical' | 'horizontal' = 'vertical') {
  const gapValue = componentSpacing.stack[gap];
  
  if (direction === 'vertical') {
    return {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: gapValue
    };
  }
  
  return {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: gapValue
  };
}

/**
 * 반응형 스택 스타일을 생성하는 함수
 */
export function createResponsiveStackStyle(
  mobileGap: keyof typeof componentSpacing.stack = 'sm',
  desktopGap: keyof typeof componentSpacing.stack = 'md',
  direction: 'vertical' | 'horizontal' = 'vertical'
) {
  const baseStyle = createStackStyle(mobileGap, direction);
  
  return {
    ...baseStyle,
    [createMediaQuery('desktop')]: {
      gap: componentSpacing.stack[desktopGap]
    }
  };
}

/**
 * 패딩 유틸리티 함수
 */
export function createPaddingStyle(
  top?: SemanticSpacingSize,
  right?: SemanticSpacingSize,
  bottom?: SemanticSpacingSize,
  left?: SemanticSpacingSize
) {
  const style: Record<string, string> = {};
  
  if (top) style.paddingTop = getSpacingValue(top);
  if (right) style.paddingRight = getSpacingValue(right);
  if (bottom) style.paddingBottom = getSpacingValue(bottom);
  if (left) style.paddingLeft = getSpacingValue(left);
  
  return style;
}

/**
 * 마진 유틸리티 함수
 */
export function createMarginStyle(
  top?: SemanticSpacingSize,
  right?: SemanticSpacingSize,
  bottom?: SemanticSpacingSize,
  left?: SemanticSpacingSize
) {
  const style: Record<string, string> = {};
  
  if (top) style.marginTop = getSpacingValue(top);
  if (right) style.marginRight = getSpacingValue(right);
  if (bottom) style.marginBottom = getSpacingValue(bottom);
  if (left) style.marginLeft = getSpacingValue(left);
  
  return style;
}

/**
 * 균등한 패딩을 생성하는 함수
 */
export function createUniformPadding(size: SemanticSpacingSize) {
  return {
    padding: getSpacingValue(size)
  };
}

/**
 * 균등한 마진을 생성하는 함수
 */
export function createUniformMargin(size: SemanticSpacingSize) {
  return {
    margin: getSpacingValue(size)
  };
}

/**
 * 수직 리듬을 생성하는 함수
 */
export function createVerticalRhythm(baseLineHeight: number = 24) {
  return {
    xs: `${baseLineHeight * 0.5}px`,
    sm: `${baseLineHeight * 0.75}px`,
    md: `${baseLineHeight}px`,
    lg: `${baseLineHeight * 1.5}px`,
    xl: `${baseLineHeight * 2}px`,
    '2xl': `${baseLineHeight * 3}px`
  };
}

/**
 * 간격 CSS 변수를 생성하는 함수
 */
export function generateSpacingCSSVariables(): string {
  let cssVariables = '';
  
  // 기본 간격 변수
  Object.entries(spacing).forEach(([key, value]) => {
    cssVariables += `  --spacing-${key}: ${value};\n`;
  });
  
  // 의미적 간격 변수
  Object.entries(semanticSpacing).forEach(([key, value]) => {
    cssVariables += `  --spacing-${key}: ${value};\n`;
  });
  
  // 브레이크포인트 변수
  Object.entries(breakpoints).forEach(([key, value]) => {
    cssVariables += `  --breakpoint-${key}: ${value};\n`;
  });
  
  // 컨테이너 최대 너비 변수
  Object.entries(containerMaxWidth).forEach(([key, value]) => {
    cssVariables += `  --container-${key}: ${value};\n`;
  });
  
  return cssVariables;
}

/**
 * 반응형 간격 클래스를 생성하는 함수
 */
export function createResponsiveSpacingClasses() {
  const classes: Record<string, any> = {};
  
  // 반응형 패딩 클래스
  Object.entries(semanticSpacing).forEach(([size, value]) => {
    classes[`p-${size}-responsive`] = {
      padding: value,
      [createMediaQuery('tablet')]: {
        padding: getSpacingValue(size === 'xs' ? 'sm' : size === 'sm' ? 'md' : 'lg' as SemanticSpacingSize)
      }
    };
  });
  
  // 반응형 마진 클래스
  Object.entries(semanticSpacing).forEach(([size, value]) => {
    classes[`m-${size}-responsive`] = {
      margin: value,
      [createMediaQuery('tablet')]: {
        margin: getSpacingValue(size === 'xs' ? 'sm' : size === 'sm' ? 'md' : 'lg' as SemanticSpacingSize)
      }
    };
  });
  
  return classes;
}

/**
 * 레이아웃 제약 조건을 검증하는 함수
 */
export function validateLayoutConstraints(width: number, height: number) {
  return {
    isValidAspectRatio: width / height >= 0.5 && width / height <= 3,
    isValidMinSize: width >= 320 && height >= 240,
    isAccessibleTouchTarget: width >= 44 && height >= 44, // iOS 권장사항
    recommendations: {
      width: width < 320 ? 'Increase width to at least 320px' : null,
      height: height < 240 ? 'Increase height to at least 240px' : null,
      touchTarget: (width < 44 || height < 44) ? 'Increase size to at least 44x44px for touch accessibility' : null
    }
  };
}

/**
 * 최적의 컨테이너 크기를 계산하는 함수
 */
export function calculateOptimalContainerSize(contentWidth: number, viewportWidth: number): ContainerSize {
  const ratio = contentWidth / viewportWidth;
  
  if (ratio <= 0.5) return 'sm';
  if (ratio <= 0.65) return 'md';
  if (ratio <= 0.8) return 'lg';
  if (ratio <= 0.9) return 'xl';
  return '2xl';
}