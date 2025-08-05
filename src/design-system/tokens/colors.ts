/**
 * Linear 디자인 시스템 - 색상 토큰
 * Linear의 색상 팔레트를 기반으로 한 색상 시스템
 */

export const colors = {
  // Primary Colors (Linear Purple)
  primary: {
    50: '#F0F2FF',
    100: '#E0E4FF',
    200: '#C7CCFF',
    300: '#A5ACFF',
    400: '#8B93FF',
    500: '#5E6AD2',  // Linear Purple
    600: '#4C5BC7',
    700: '#3D4AB8',
    800: '#2F3A9E',
    900: '#1F2670'
  },
  
  // Secondary Colors (Accent Blue)
  secondary: {
    50: '#E6FAFE',
    100: '#CCF5FD',
    200: '#99EBFB',
    300: '#66E1F9',
    400: '#33D7F7',
    500: '#00D2FF',  // Accent Blue
    600: '#00B8E6',
    700: '#009ECC',
    800: '#0084B3',
    900: '#006A99'
  },
  
  // Semantic Colors
  success: {
    50: '#E6FDF5',
    100: '#CCFBEB',
    200: '#99F7D7',
    300: '#66F3C3',
    400: '#33EFAF',
    500: '#00C896',  // Success Green
    600: '#00B087',
    700: '#009878',
    800: '#008069',
    900: '#00685A'
  },
  
  warning: {
    50: '#FFF4E6',
    100: '#FFE9CC',
    200: '#FFD399',
    300: '#FFBD66',
    400: '#FFA733',
    500: '#FF6B35',  // Warning Orange
    600: '#E6602F',
    700: '#CC5529',
    800: '#B34A23',
    900: '#993F1D'
  },
  
  error: {
    50: '#FFE6E6',
    100: '#FFCCCC',
    200: '#FF9999',
    300: '#FF6666',
    400: '#FF3333',
    500: '#FF5C5C',  // Error Red
    600: '#E65252',
    700: '#CC4848',
    800: '#B33E3E',
    900: '#993434'
  },
  
  // Neutral Colors
  neutral: {
    50: '#F6F8FA',   // 가장 밝은 배경
    100: '#E1E4E8',  // 경계선, 구분선
    200: '#D1D5DA',  // 비활성 요소
    300: '#959DA5',  // 플레이스홀더 텍스트
    400: '#6A737D',  // 보조 텍스트
    500: '#586069',  // 기본 텍스트
    600: '#444D56',  // 강조 텍스트
    700: '#2F363D',  // 제목 텍스트
    800: '#24292E',  // 가장 어두운 텍스트
    900: '#1B1F23'   // 다크 모드 배경
  }
} as const;

// 테마별 색상 매핑
export const lightTheme = {
  background: {
    primary: colors.neutral[50],
    secondary: colors.neutral[100],
    elevated: '#FFFFFF'
  },
  surface: {
    primary: '#FFFFFF',
    secondary: colors.neutral[50],
    tertiary: colors.neutral[100]
  },
  text: {
    primary: colors.neutral[800],
    secondary: colors.neutral[500],
    tertiary: colors.neutral[400],
    disabled: colors.neutral[300],
    inverse: '#FFFFFF'
  },
  border: {
    primary: colors.neutral[200],
    secondary: colors.neutral[100],
    focus: colors.primary[500]
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
} as const;

export const darkTheme = {
  background: {
    primary: colors.neutral[900],
    secondary: colors.neutral[800],
    elevated: colors.neutral[700]
  },
  surface: {
    primary: colors.neutral[800],
    secondary: colors.neutral[700],
    tertiary: colors.neutral[600]
  },
  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[200],
    tertiary: colors.neutral[300],
    disabled: colors.neutral[400],
    inverse: colors.neutral[800]
  },
  border: {
    primary: colors.neutral[600],
    secondary: colors.neutral[700],
    focus: colors.primary[400]
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
  }
} as const;

// 타입 정의
export type ColorScale = typeof colors.primary;
export type ThemeColors = typeof lightTheme;
export type ColorToken = keyof typeof colors;
export type ColorShade = keyof ColorScale;

// 의미적 색상 타입
export type SemanticColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type NeutralShade = keyof typeof colors.neutral;

// 테마 타입
export type Theme = 'light' | 'dark';
export type ThemeCategory = keyof ThemeColors;
export type BackgroundVariant = keyof ThemeColors['background'];
export type SurfaceVariant = keyof ThemeColors['surface'];
export type TextVariant = keyof ThemeColors['text'];
export type BorderVariant = keyof ThemeColors['border'];
export type ShadowVariant = keyof ThemeColors['shadow'];