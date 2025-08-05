import React, { forwardRef } from 'react';
import { spacing } from '../../tokens/spacing';
import { useResponsiveGrid } from '../../hooks/useResponsiveLayout';
import { ResponsiveValue } from '../../utils/responsive';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 그리드 컬럼 수 */
  columns?: number | ResponsiveValue<number>;
  /** 그리드 간격 */
  gap?: keyof typeof spacing | ResponsiveValue<keyof typeof spacing>;
  /** 행 간격 (다를 경우) */
  rowGap?: keyof typeof spacing;
  /** 컬럼 간격 (다를 경우) */
  columnGap?: keyof typeof spacing;
  /** 자동 맞춤 여부 */
  autoFit?: boolean;
  /** 최소 컬럼 너비 (autoFit 사용 시) */
  minColumnWidth?: string;
  /** 정렬 방식 */
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  /** 콘텐츠 정렬 */
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  /** 부드러운 전환 애니메이션 활성화 */
  enableTransitions?: boolean;
  children: React.ReactNode;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(({
  columns = 12,
  gap = 4,
  rowGap,
  columnGap,
  autoFit = false,
  minColumnWidth = '250px',
  alignItems = 'stretch',
  justifyContent = 'start',
  enableTransitions = true,
  className = '',
  style,
  children,
  ...props
}, ref) => {
  // 반응형 그리드 훅 사용 (반응형 값이 있을 때만)
  const isResponsive = typeof columns === 'object' || typeof gap === 'object';
  const responsiveGrid = useResponsiveGrid(
    isResponsive ? columns : undefined,
    isResponsive ? gap : undefined
  );

  const getGridTemplateColumns = () => {
    if (autoFit) {
      return `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`;
    }
    
    if (isResponsive) {
      return `repeat(${responsiveGrid.columns}, 1fr)`;
    }
    
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }
    
    return `repeat(${columns}, 1fr)`;
  };

  const getGap = () => {
    if (isResponsive) {
      return responsiveGrid.gap;
    }
    
    if (typeof gap === 'string') {
      return spacing[gap];
    }
    
    return spacing[gap as keyof typeof spacing];
  };

  const baseStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: getGridTemplateColumns(),
    gap: rowGap || columnGap ? undefined : getGap(),
    rowGap: rowGap ? spacing[rowGap] : undefined,
    columnGap: columnGap ? spacing[columnGap] : undefined,
    alignItems,
    justifyContent,
    // 부드러운 전환 애니메이션 적용
    ...(enableTransitions && isResponsive ? {
      transition: 'grid-template-columns 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), gap 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    } : {}),
    ...style,
  };

  return (
    <div
      ref={ref}
      className={`grid ${className}`}
      style={baseStyles}
      {...props}
    >
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

export default Grid;