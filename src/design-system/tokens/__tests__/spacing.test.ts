/**
 * Linear 디자인 시스템 - 간격 토큰 테스트
 */

import {
  spacing,
  semanticSpacing,
  componentSpacing,
  breakpoints,
  containerMaxWidth,
  grid,
  responsiveSpacing,
  layout,
  getSpacing,
  getSemanticSpacing
} from '../spacing';

describe('Spacing Tokens', () => {
  describe('기본 간격 시스템', () => {
    it('4px 기준의 일관된 간격 값을 제공해야 함', () => {
      expect(spacing[0]).toBe('0px');
      expect(spacing[1]).toBe('4px');   // xs
      expect(spacing[2]).toBe('8px');   // sm
      expect(spacing[4]).toBe('16px');  // md
      expect(spacing[6]).toBe('24px');  // lg
      expect(spacing[8]).toBe('32px');  // xl
      expect(spacing[12]).toBe('48px'); // 2xl
    });

    it('모든 간격 값이 4의 배수여야 함', () => {
      Object.values(spacing).forEach(value => {
        if (value !== '0px') {
          const numericValue = parseInt(value.replace('px', ''));
          expect(numericValue % 4).toBe(0);
        }
      });
    });
  });

  describe('의미적 간격 별칭', () => {
    it('xs부터 2xl까지의 의미적 간격을 제공해야 함', () => {
      expect(semanticSpacing.xs).toBe('4px');
      expect(semanticSpacing.sm).toBe('8px');
      expect(semanticSpacing.md).toBe('16px');
      expect(semanticSpacing.lg).toBe('24px');
      expect(semanticSpacing.xl).toBe('32px');
      expect(semanticSpacing['2xl']).toBe('48px');
    });

    it('의미적 간격이 기본 간격과 일치해야 함', () => {
      expect(semanticSpacing.xs).toBe(spacing[1]);
      expect(semanticSpacing.sm).toBe(spacing[2]);
      expect(semanticSpacing.md).toBe(spacing[4]);
      expect(semanticSpacing.lg).toBe(spacing[6]);
      expect(semanticSpacing.xl).toBe(spacing[8]);
      expect(semanticSpacing['2xl']).toBe(spacing[12]);
    });
  });

  describe('컴포넌트별 간격', () => {
    it('버튼 컴포넌트의 크기별 패딩을 제공해야 함', () => {
      expect(componentSpacing.button.sm.x).toBe('12px');
      expect(componentSpacing.button.sm.y).toBe('8px');
      expect(componentSpacing.button.md.x).toBe('16px');
      expect(componentSpacing.button.md.y).toBe('12px');
      expect(componentSpacing.button.lg.x).toBe('24px');
      expect(componentSpacing.button.lg.y).toBe('16px');
    });

    it('카드 컴포넌트의 크기별 패딩을 제공해야 함', () => {
      expect(componentSpacing.card.sm).toBe('16px');
      expect(componentSpacing.card.md).toBe('24px');
      expect(componentSpacing.card.lg).toBe('32px');
    });

    it('스택 레이아웃의 간격을 제공해야 함', () => {
      expect(componentSpacing.stack.xs).toBe('4px');
      expect(componentSpacing.stack.sm).toBe('8px');
      expect(componentSpacing.stack.md).toBe('16px');
      expect(componentSpacing.stack.lg).toBe('24px');
      expect(componentSpacing.stack.xl).toBe('32px');
    });
  });

  describe('브레이크포인트', () => {
    it('모바일부터 와이드까지의 브레이크포인트를 제공해야 함', () => {
      expect(breakpoints.mobile).toBe('320px');
      expect(breakpoints.tablet).toBe('768px');
      expect(breakpoints.desktop).toBe('1024px');
      expect(breakpoints.wide).toBe('1440px');
    });

    it('브레이크포인트가 오름차순으로 정렬되어야 함', () => {
      const values = Object.values(breakpoints).map(bp => parseInt(bp.replace('px', '')));
      const sortedValues = [...values].sort((a, b) => a - b);
      expect(values).toEqual(sortedValues);
    });
  });

  describe('컨테이너 최대 너비', () => {
    it('sm부터 2xl까지의 컨테이너 크기를 제공해야 함', () => {
      expect(containerMaxWidth.sm).toBe('640px');
      expect(containerMaxWidth.md).toBe('768px');
      expect(containerMaxWidth.lg).toBe('1024px');
      expect(containerMaxWidth.xl).toBe('1280px');
      expect(containerMaxWidth['2xl']).toBe('1536px');
    });

    it('컨테이너 크기가 오름차순으로 정렬되어야 함', () => {
      const values = Object.values(containerMaxWidth).map(size => parseInt(size.replace('px', '')));
      const sortedValues = [...values].sort((a, b) => a - b);
      expect(values).toEqual(sortedValues);
    });
  });

  describe('그리드 시스템', () => {
    it('12컬럼 그리드 시스템을 제공해야 함', () => {
      expect(grid.columns).toBe(12);
    });

    it('반응형 거터 간격을 제공해야 함', () => {
      expect(grid.gutter.mobile).toBe('16px');
      expect(grid.gutter.tablet).toBe('24px');
      expect(grid.gutter.desktop).toBe('32px');
    });

    it('반응형 마진을 제공해야 함', () => {
      expect(grid.margin.mobile).toBe('16px');
      expect(grid.margin.tablet).toBe('24px');
      expect(grid.margin.desktop).toBe('32px');
    });
  });

  describe('레이아웃 유틸리티', () => {
    it('Z-index 레이어를 제공해야 함', () => {
      expect(layout.zIndex.base).toBe(0);
      expect(layout.zIndex.dropdown).toBe(1000);
      expect(layout.zIndex.modal).toBe(1400);
      expect(layout.zIndex.tooltip).toBe(1800);
    });

    it('Z-index 값이 올바른 순서여야 함', () => {
      expect(layout.zIndex.base).toBeLessThan(layout.zIndex.dropdown);
      expect(layout.zIndex.dropdown).toBeLessThan(layout.zIndex.modal);
      expect(layout.zIndex.modal).toBeLessThan(layout.zIndex.tooltip);
    });

    it('둥근 모서리 크기를 제공해야 함', () => {
      expect(layout.borderRadius.none).toBe('0px');
      expect(layout.borderRadius.sm).toBe('4px');
      expect(layout.borderRadius.md).toBe('8px');
      expect(layout.borderRadius.lg).toBe('12px');
      expect(layout.borderRadius.full).toBe('9999px');
    });

    it('최소 크기 제약을 제공해야 함', () => {
      expect(layout.minSize.touchTarget).toBe('44px');
      expect(layout.minSize.button).toBe('32px');
      expect(layout.minSize.input).toBe('40px');
    });

    it('터치 타겟이 접근성 기준을 만족해야 함', () => {
      const touchTargetSize = parseInt(layout.minSize.touchTarget.replace('px', ''));
      expect(touchTargetSize).toBeGreaterThanOrEqual(44); // iOS 권장사항
    });
  });

  describe('유틸리티 함수', () => {
    it('getSpacing 함수가 올바른 간격 값을 반환해야 함', () => {
      expect(getSpacing(4)).toBe('16px');
      expect(getSpacing(8)).toBe('32px');
      expect(getSpacing(12)).toBe('48px');
    });

    it('getSemanticSpacing 함수가 올바른 간격 값을 반환해야 함', () => {
      expect(getSemanticSpacing('md')).toBe('16px');
      expect(getSemanticSpacing('lg')).toBe('24px');
      expect(getSemanticSpacing('xl')).toBe('32px');
    });
  });

  describe('반응형 간격', () => {
    it('섹션별 반응형 간격을 제공해야 함', () => {
      expect(responsiveSpacing.section.mobile).toBe('24px');
      expect(responsiveSpacing.section.tablet).toBe('32px');
      expect(responsiveSpacing.section.desktop).toBe('48px');
    });

    it('컨테이너별 반응형 간격을 제공해야 함', () => {
      expect(responsiveSpacing.container.mobile).toBe('16px');
      expect(responsiveSpacing.container.tablet).toBe('24px');
      expect(responsiveSpacing.container.desktop).toBe('32px');
    });
  });

  describe('타입 안전성', () => {
    it('간격 토큰 타입이 올바르게 정의되어야 함', () => {
      // TypeScript 컴파일 시점에서 타입 체크됨
      const spacingSize: keyof typeof spacing = 4;
      const semanticSize: keyof typeof semanticSpacing = 'md';
      const breakpointSize: keyof typeof breakpoints = 'tablet';
      
      expect(spacing[spacingSize]).toBeDefined();
      expect(semanticSpacing[semanticSize]).toBeDefined();
      expect(breakpoints[breakpointSize]).toBeDefined();
    });
  });
});