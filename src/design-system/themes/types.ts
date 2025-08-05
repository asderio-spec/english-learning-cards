/**
 * Linear 디자인 시스템 - 테마 타입 정의
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface SemanticColorSet {
  background: string;
  border: string;
  text: string;
  textStrong: string;
}

export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    elevated: string;
  };
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  semantic: {
    primary: SemanticColorSet;
    secondary: SemanticColorSet;
    success: SemanticColorSet;
    warning: SemanticColorSet;
    error: SemanticColorSet;
  };
  interactive: {
    hover: string;
    pressed: string;
    selected: string;
    focus: string;
  };
}

export interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
}

export interface ThemeConfig {
  currentTheme: ThemeMode;
  systemTheme: 'light' | 'dark';
  resolvedTheme: 'light' | 'dark';
}