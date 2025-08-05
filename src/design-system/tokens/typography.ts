/**
 * Linear 디자인 시스템 - 타이포그래피 토큰
 * 읽기 쉽고 계층적인 타이포그래피 시스템
 */

export const typography = {
  // 폰트 패밀리
  fontFamily: {
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif'
    ],
    mono: [
      'SF Mono',
      'Monaco',
      'Inconsolata',
      'Roboto Mono',
      'source-code-pro',
      'Menlo',
      'Consolas',
      'monospace'
    ]
  },

  // 폰트 크기 및 행간
  display: {
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: 700,
    letterSpacing: '-0.02em'
  },
  
  heading: {
    h1: {
      fontSize: '28px',
      lineHeight: '36px',
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h4: {
      fontSize: '18px',
      lineHeight: '26px',
      fontWeight: 600,
      letterSpacing: '0em'
    }
  },
  
  body: {
    large: {
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: 400,
      letterSpacing: '0em'
    },
    medium: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400,
      letterSpacing: '0em'
    },
    small: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
      letterSpacing: '0em'
    }
  },
  
  caption: {
    large: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 500,
      letterSpacing: '0.01em'
    },
    medium: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 500,
      letterSpacing: '0.01em'
    },
    small: {
      fontSize: '11px',
      lineHeight: '14px',
      fontWeight: 500,
      letterSpacing: '0.02em'
    }
  },

  // 폰트 가중치
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  }
} as const;

// 반응형 타이포그래피 유틸리티
export const responsiveTypography = {
  // 모바일에서 더 작은 크기 사용
  display: {
    mobile: {
      fontSize: '28px',
      lineHeight: '36px'
    },
    desktop: typography.display
  },
  
  heading: {
    h1: {
      mobile: {
        fontSize: '24px',
        lineHeight: '32px'
      },
      desktop: typography.heading.h1
    },
    h2: {
      mobile: {
        fontSize: '20px',
        lineHeight: '28px'
      },
      desktop: typography.heading.h2
    }
  }
} as const;

// CSS 클래스 생성 유틸리티
export const getTypographyClasses = (variant: keyof typeof typography) => {
  const styles = typography[variant];
  
  if (typeof styles === 'object' && 'fontSize' in styles) {
    return {
      fontSize: styles.fontSize,
      lineHeight: styles.lineHeight,
      fontWeight: styles.fontWeight,
      letterSpacing: styles.letterSpacing
    };
  }
  
  return {};
};

// 타입 정의
export type TypographyVariant = keyof typeof typography;
export type HeadingLevel = keyof typeof typography.heading;
export type BodySize = keyof typeof typography.body;
export type CaptionSize = keyof typeof typography.caption;
export type FontWeight = keyof typeof typography.fontWeight;
export type FontFamily = keyof typeof typography.fontFamily;

// 타이포그래피 스타일 인터페이스
export interface TypographyStyle {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing: string;
}

// 반응형 타이포그래피 인터페이스
export interface ResponsiveTypographyStyle {
  mobile: Partial<TypographyStyle>;
  desktop: Partial<TypographyStyle>;
}

// 타이포그래피 토큰 타입
export type TypographyToken = 
  | 'display'
  | `heading-${HeadingLevel}`
  | `body-${BodySize}`
  | `caption-${CaptionSize}`;

// CSS 속성 타입
export type TypographyProperty = 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing';