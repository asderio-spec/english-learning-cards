import React, { forwardRef } from 'react';
import { containerMaxWidth, spacing } from '../../tokens/spacing';
import { useResponsiveContainer } from '../../hooks/useResponsiveLayout';
import { ResponsiveValue } from '../../utils/responsive';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 컨테이너 최대 너비 */
  maxWidth?: keyof typeof containerMaxWidth | 'none';
  /** 중앙 정렬 여부 */
  centered?: boolean;
  /** 패딩 적용 여부 */
  padding?: boolean;
  /** 반응형 패딩 사용 여부 */
  responsivePadding?: boolean;
  /** 커스텀 반응형 패딩 */
  customPadding?: ResponsiveValue<keyof typeof spacing>;
  /** 전체 높이 사용 */
  fullHeight?: boolean;
  /** 부드러운 전환 애니메이션 활성화 */
  enableTransitions?: boolean;
  children: React.ReactNode;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({
  maxWidth = 'lg',
  centered = true,
  padding = true,
  responsivePadding = true,
  customPadding,
  fullHeight = false,
  enableTransitions = true,
  className = '',
  style,
  children,
  ...props
}, ref) => {
  // 반응형 컨테이너 훅 사용
  const responsiveContainer = useResponsiveContainer(
    maxWidth === 'none' ? 'none' : maxWidth,
    responsivePadding ? customPadding : undefined
  );

  const getMaxWidth = () => {
    if (maxWidth === 'none') return 'none';
    return containerMaxWidth[maxWidth];
  };

  const getPadding = () => {
    if (!padding) return '0';
    
    if (responsivePadding) {
      // 반응형 훅에서 계산된 패딩 사용
      return responsiveContainer.styles.padding;
    }
    
    return `0 ${spacing[6]}`;
  };

  const baseStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: responsivePadding ? responsiveContainer.styles.maxWidth : getMaxWidth(),
    margin: centered ? '0 auto' : '0',
    padding: responsivePadding ? responsiveContainer.styles.padding : getPadding(),
    height: fullHeight ? '100%' : 'auto',
    minHeight: fullHeight ? '100vh' : 'auto',
    // 부드러운 전환 애니메이션 적용
    ...(enableTransitions && responsivePadding ? {
      transition: 'padding 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), max-width 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    } : {}),
    ...style,
  };

  return (
    <div
      ref={ref}
      className={`container ${className}`}
      style={baseStyles}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export default Container;