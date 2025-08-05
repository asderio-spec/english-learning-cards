/**
 * Linear 디자인 시스템 - 간격 토큰
 * 일관된 간격과 레이아웃을 위한 간격 시스템
 */

export const spacing = {
  // 기본 간격 (4px 기준)
  0: '0px',
  1: '4px',    // xs
  2: '8px',    // sm
  3: '12px',
  4: '16px',   // md
  5: '20px',
  6: '24px',   // lg
  8: '32px',   // xl
  10: '40px',
  12: '48px',  // 2xl
  16: '64px',  // 3xl
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
  48: '192px',
  56: '224px',
  64: '256px'
} as const;

// 의미적 간격 별칭
export const semanticSpacing = {
  xs: spacing[1],    // 4px
  sm: spacing[2],    // 8px
  md: spacing[4],    // 16px
  lg: spacing[6],    // 24px
  xl: spacing[8],    // 32px
  '2xl': spacing[12], // 48px
  '3xl': spacing[16], // 64px
  '4xl': spacing[20], // 80px
  '5xl': spacing[24]  // 96px
} as const;

// 컴포넌트별 간격
export const componentSpacing = {
  // 버튼 내부 패딩
  button: {
    sm: {
      x: spacing[3],  // 12px
      y: spacing[2]   // 8px
    },
    md: {
      x: spacing[4],  // 16px
      y: spacing[3]   // 12px
    },
    lg: {
      x: spacing[6],  // 24px
      y: spacing[4]   // 16px
    }
  },
  
  // 카드 패딩
  card: {
    sm: spacing[4],   // 16px
    md: spacing[6],   // 24px
    lg: spacing[8]    // 32px
  },
  
  // 섹션 간격
  section: {
    sm: spacing[8],   // 32px
    md: spacing[12],  // 48px
    lg: spacing[16]   // 64px
  },
  
  // 요소 간 간격
  stack: {
    xs: spacing[1],   // 4px
    sm: spacing[2],   // 8px
    md: spacing[4],   // 16px
    lg: spacing[6],   // 24px
    xl: spacing[8]    // 32px
  },
  
  // 모달 패딩
  modal: {
    header: {
      x: spacing[6],  // 24px
      y: spacing[4]   // 16px
    },
    content: spacing[6] // 24px
  }
} as const;

// 브레이크포인트
export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
} as const;

// 컨테이너 최대 너비
export const containerMaxWidth = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// 그리드 시스템
export const grid = {
  columns: 12,
  gutter: {
    mobile: spacing[4],   // 16px
    tablet: spacing[6],   // 24px
    desktop: spacing[8]   // 32px
  },
  margin: {
    mobile: spacing[4],   // 16px
    tablet: spacing[6],   // 24px
    desktop: spacing[8]   // 32px
  }
} as const;

// 반응형 간격 유틸리티
export const responsiveSpacing = {
  // 모바일에서는 더 작은 간격 사용
  section: {
    mobile: spacing[6],   // 24px
    tablet: spacing[8],   // 32px
    desktop: spacing[12]  // 48px
  },
  
  container: {
    mobile: spacing[4],   // 16px
    tablet: spacing[6],   // 24px
    desktop: spacing[8]   // 32px
  }
} as const;

// 간격 유틸리티 함수
export const getSpacing = (size: keyof typeof spacing) => spacing[size];
export const getSemanticSpacing = (size: keyof typeof semanticSpacing) => semanticSpacing[size];

// 레이아웃 유틸리티
export const layout = {
  // Z-index 레이어
  zIndex: {
    hide: -1,
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  },
  
  // 둥근 모서리
  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px'
  },
  
  // 최소/최대 크기
  minSize: {
    touchTarget: '44px',  // 터치 타겟 최소 크기
    button: '32px',       // 버튼 최소 높이
    input: '40px',        // 입력 필드 최소 높이
    card: '120px'         // 카드 최소 높이
  },
  
  // 애스펙트 비율
  aspectRatio: {
    square: '1 / 1',
    video: '16 / 9',
    photo: '4 / 3',
    portrait: '3 / 4',
    golden: '1.618 / 1'
  }
} as const;

// 타입 정의
export type SpacingSize = keyof typeof spacing;
export type SemanticSpacingSize = keyof typeof semanticSpacing;
export type BreakpointSize = keyof typeof breakpoints;
export type ContainerSize = keyof typeof containerMaxWidth;
export type ComponentSpacingType = keyof typeof componentSpacing;
export type ZIndexLevel = keyof typeof layout.zIndex;
export type BorderRadiusSize = keyof typeof layout.borderRadius;
export type MinSizeType = keyof typeof layout.minSize;
export type AspectRatioType = keyof typeof layout.aspectRatio;

// 레이아웃 인터페이스
export interface LayoutConstraints {
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  aspectRatio?: string;
}

// 반응형 값 인터페이스
export interface ResponsiveValue<T> {
  mobile: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

// 간격 토큰 타입
export type SpacingToken = 
  | SpacingSize
  | SemanticSpacingSize
  | `${ComponentSpacingType}-${string}`;

// 레이아웃 토큰 타입
export type LayoutToken = 
  | `zIndex-${ZIndexLevel}`
  | `radius-${BorderRadiusSize}`
  | `minSize-${MinSizeType}`
  | `aspectRatio-${AspectRatioType}`;