/**
 * Linear 디자인 시스템 - 타입 정의
 * 디자인 시스템 전반에서 사용되는 공통 타입들
 */

import type { lightTheme } from '../tokens/colors';
import type { semanticSpacing } from '../tokens/spacing';
import { animations } from '../tokens/animations';

// 기본 컴포넌트 Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

// 크기 변형
export type SizeVariant = 'sm' | 'md' | 'lg';
export type ExtendedSizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 색상 변형
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type NeutralVariant = 'neutral';

// 테마 타입
export type ThemeMode = 'light' | 'dark' | 'system';
export type Theme = typeof lightTheme;

// 컴포넌트 상태
export interface ComponentState {
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  success?: boolean;
}

// 인터랙션 상태
export interface InteractionState {
  hover?: boolean;
  focus?: boolean;
  active?: boolean;
  pressed?: boolean;
}

// 반응형 값 타입
export type ResponsiveValue<T> = T | {
  mobile?: T;
  tablet?: T;
  desktop?: T;
};

// 간격 Props
export interface SpacingProps {
  m?: keyof typeof semanticSpacing;
  mt?: keyof typeof semanticSpacing;
  mr?: keyof typeof semanticSpacing;
  mb?: keyof typeof semanticSpacing;
  ml?: keyof typeof semanticSpacing;
  mx?: keyof typeof semanticSpacing;
  my?: keyof typeof semanticSpacing;
  p?: keyof typeof semanticSpacing;
  pt?: keyof typeof semanticSpacing;
  pr?: keyof typeof semanticSpacing;
  pb?: keyof typeof semanticSpacing;
  pl?: keyof typeof semanticSpacing;
  px?: keyof typeof semanticSpacing;
  py?: keyof typeof semanticSpacing;
}

// 레이아웃 Props
export interface LayoutProps {
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'none';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
}

// 플렉스 Props
export interface FlexProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  gap?: keyof typeof semanticSpacing;
}

// 그리드 Props
export interface GridProps {
  columns?: number | string;
  rows?: number | string;
  gap?: keyof typeof semanticSpacing;
  columnGap?: keyof typeof semanticSpacing;
  rowGap?: keyof typeof semanticSpacing;
}

// 애니메이션 Props
export interface AnimationProps {
  animate?: boolean;
  duration?: keyof typeof animations.duration;
  easing?: keyof typeof animations.easing;
  delay?: number;
}

// 접근성 Props
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-disabled'?: boolean;
  'aria-pressed'?: boolean;
  'aria-selected'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  role?: string;
  tabIndex?: number;
}

// 이벤트 핸들러 타입
export interface EventHandlers {
  onClick?: (event: React.MouseEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

// 폼 관련 타입
export interface FormProps {
  name?: string;
  value?: string | number | boolean;
  defaultValue?: string | number | boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
}

// 버튼 변형 타입
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = SizeVariant;

// 카드 변형 타입
export type CardVariant = 'default' | 'elevated' | 'outlined';
export type CardPadding = SizeVariant;

// 입력 변형 타입
export type InputVariant = 'default' | 'filled' | 'outlined';
export type InputSize = SizeVariant;

// 모달 크기 타입
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// 토스트 타입
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

// 유틸리티 타입
export type Merge<T, U> = Omit<T, keyof U> & U;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// 컴포넌트 ref 타입
export type ComponentRef<T extends keyof React.JSX.IntrinsicElements> = React.ComponentRef<T>;

// 다형성 컴포넌트 타입
export type PolymorphicComponentProps<T extends React.ElementType, P = {}> = P & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof P | 'as'>;

// 포워드 ref 컴포넌트 타입
export type ForwardRefComponent<T, P = {}> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>;