import React, { forwardRef } from 'react';
import { spacing } from '../../tokens/spacing';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { ResponsiveValue, getResponsiveValue } from '../../utils/responsive';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flex 방향 */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse' | ResponsiveValue<'row' | 'column' | 'row-reverse' | 'column-reverse'>;
  /** 아이템 정렬 */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** 콘텐츠 정렬 */
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  /** 줄바꿈 여부 */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /** 아이템 간격 */
  gap?: keyof typeof spacing | ResponsiveValue<keyof typeof spacing>;
  /** 인라인 flex 사용 */
  inline?: boolean;
  /** flex-grow 값 */
  grow?: number;
  /** flex-shrink 값 */
  shrink?: number;
  /** flex-basis 값 */
  basis?: string | number;
  /** 부드러운 전환 애니메이션 활성화 */
  enableTransitions?: boolean;
  children: React.ReactNode;
}

const Flex = forwardRef<HTMLDivElement, FlexProps>(({
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  wrap = 'nowrap',
  gap,
  inline = false,
  grow,
  shrink,
  basis,
  enableTransitions = true,
  className = '',
  style,
  children,
  ...props
}, ref) => {
  const breakpoint = useBreakpoint();
  const prefersReducedMotion = usePrefersReducedMotion();

  const getAlignItems = () => {
    switch (align) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'center': return 'center';
      case 'stretch': return 'stretch';
      case 'baseline': return 'baseline';
      default: return 'stretch';
    }
  };

  const getJustifyContent = () => {
    switch (justify) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'center': return 'center';
      case 'space-between': return 'space-between';
      case 'space-around': return 'space-around';
      case 'space-evenly': return 'space-evenly';
      default: return 'flex-start';
    }
  };

  // 반응형 값 계산
  const currentDirection = getResponsiveValue(direction, breakpoint.current, 'row');
  const currentGap = gap ? (
    typeof gap === 'object' 
      ? spacing[getResponsiveValue(gap, breakpoint.current, 4 as keyof typeof spacing)]
      : spacing[gap]
  ) : undefined;

  const isResponsive = typeof direction === 'object' || typeof gap === 'object';

  const baseStyles: React.CSSProperties = {
    display: inline ? 'inline-flex' : 'flex',
    flexDirection: currentDirection,
    alignItems: getAlignItems(),
    justifyContent: getJustifyContent(),
    flexWrap: wrap,
    gap: currentGap,
    flexGrow: grow,
    flexShrink: shrink,
    flexBasis: basis,
    // 부드러운 전환 애니메이션 적용
    ...(enableTransitions && isResponsive && !prefersReducedMotion ? {
      transition: 'flex-direction 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), gap 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    } : {}),
    ...style,
  };

  return (
    <div
      ref={ref}
      className={`flex ${className}`}
      style={baseStyles}
      {...props}
    >
      {children}
    </div>
  );
});

Flex.displayName = 'Flex';

export default Flex;