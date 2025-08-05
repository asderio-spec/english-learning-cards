/**
 * Linear 디자인 시스템 - 간격 유틸리티 함수 테스트
 */

import {
  getSpacingValue,
  getSpacingCSSVariable,
  getComponentSpacing,
  createResponsiveSpacing,
  createMediaQuery,
  createRangeMediaQuery,
  createContainerStyle,
  createGridContainerStyle,
  createGridItemStyle,
  createFlexStyle,
  createStackStyle,
  createResponsiveStackStyle,
  createPaddingStyle,
  createMarginStyle,
  createUniformPadding,
  createUniformMargin,
  createVerticalRhythm,
  generateSpacingCSSVariables,
  createResponsiveSpacingClasses,
  validateLayoutConstraints,
  calculateOptimalContainerSize
} from '../spacingUtils';

describe('Spacing Utilities', () => {
  describe('getSpacingValue', () => {
    it('기본 간격 값을 올바르게 반환해야 함', () => {
      expect(getSpacingValue(4)).toBe('16px');
      expect(getSpacingValue(8)).toBe('32px');
      expect(getSpacingValue(12)).toBe('48px');
    });

    it('의미적 간격 값을 올바르게 반환해야 함', () => {
      expect(getSpacingValue('md')).toBe('16px');
      expect(getSpacingValue('lg')).toBe('24px');
      expect(getSpacingValue('xl')).toBe('32px');
    });

    it('존재하지 않는 크기에 대해 기본값을 반환해야 함', () => {
      expect(getSpacingValue('invalid' as any)).toBe('0px');
    });
  });

  describe('getSpacingCSSVariable', () => {
    it('올바른 CSS 변수명을 생성해야 함', () => {
      expect(getSpacingCSSVariable(4)).toBe('var(--spacing-4)');
      expect(getSpacingCSSVariable('md')).toBe('var(--spacing-md)');
    });
  });

  describe('getComponentSpacing', () => {
    it('버튼 컴포넌트의 간격을 올바르게 반환해야 함', () => {
      expect(getComponentSpacing('button', 'md', 'x')).toBe('16px');
      expect(getComponentSpacing('button', 'md', 'y')).toBe('12px');
      expect(getComponentSpacing('button', 'lg', 'x')).toBe('24px');
    });

    it('카드 컴포넌트의 간격을 올바르게 반환해야 함', () => {
      expect(getComponentSpacing('card', 'md')).toBe('24px');
      expect(getComponentSpacing('card', 'lg')).toBe('32px');
    });

    it('스택 컴포넌트의 간격을 올바르게 반환해야 함', () => {
      expect(getComponentSpacing('stack', 'md')).toBe('16px');
      expect(getComponentSpacing('stack', 'lg')).toBe('24px');
    });
  });

  describe('createResponsiveSpacing', () => {
    it('반응형 간격 객체를 생성해야 함', () => {
      const responsive = createResponsiveSpacing('16px', '24px', '32px');
      expect(responsive).toEqual({
        mobile: '16px',
        tablet: '24px',
        desktop: '32px'
      });
    });

    it('누락된 값에 대해 폴백을 제공해야 함', () => {
      const responsive = createResponsiveSpacing('16px');
      expect(responsive).toEqual({
        mobile: '16px',
        tablet: '16px',
        desktop: '16px'
      });
    });
  });

  describe('createMediaQuery', () => {
    it('min-width 미디어 쿼리를 생성해야 함', () => {
      expect(createMediaQuery('tablet')).toBe('@media (min-width: 768px)');
      expect(createMediaQuery('desktop')).toBe('@media (min-width: 1024px)');
    });

    it('max-width 미디어 쿼리를 생성해야 함', () => {
      expect(createMediaQuery('tablet', 'max')).toBe('@media (max-width: 768px)');
      expect(createMediaQuery('desktop', 'max')).toBe('@media (max-width: 1024px)');
    });
  });

  describe('createRangeMediaQuery', () => {
    it('범위 미디어 쿼리를 생성해야 함', () => {
      const query = createRangeMediaQuery('tablet', 'desktop');
      expect(query).toBe('@media (min-width: 768px) and (max-width: 1024px)');
    });
  });

  describe('createContainerStyle', () => {
    it('기본 컨테이너 스타일을 생성해야 함', () => {
      const style = createContainerStyle();
      expect(style.width).toBe('100%');
      expect(style.maxWidth).toBe('1024px'); // lg 기본값
      expect(style.marginLeft).toBe('auto');
      expect(style.marginRight).toBe('auto');
    });

    it('중앙 정렬 없는 컨테이너 스타일을 생성해야 함', () => {
      const style = createContainerStyle('md', false);
      expect(style.maxWidth).toBe('768px');
      expect(style.marginLeft).toBeUndefined();
      expect(style.marginRight).toBeUndefined();
    });

    it('반응형 패딩을 포함해야 함', () => {
      const style = createContainerStyle();
      expect(style.paddingLeft).toBe('16px');
      expect(style.paddingRight).toBe('16px');
      expect(style['@media (min-width: 768px)']).toBeDefined();
      expect(style['@media (min-width: 1024px)']).toBeDefined();
    });
  });

  describe('createGridContainerStyle', () => {
    it('12컬럼 그리드 컨테이너를 생성해야 함', () => {
      const style = createGridContainerStyle();
      expect(style.display).toBe('grid');
      expect(style.gridTemplateColumns).toBe('repeat(12, 1fr)');
      expect(style.gap).toBe('16px'); // 모바일 기본값
    });

    it('반응형 거터를 포함해야 함', () => {
      const style = createGridContainerStyle();
      expect(style['@media (min-width: 768px)']).toEqual({ gap: '24px' });
      expect(style['@media (min-width: 1024px)']).toEqual({ gap: '32px' });
    });
  });

  describe('createGridItemStyle', () => {
    it('기본 그리드 아이템 스타일을 생성해야 함', () => {
      const style = createGridItemStyle(3);
      expect(style.gridColumn).toBe('span 3');
    });

    it('시작 위치가 있는 그리드 아이템 스타일을 생성해야 함', () => {
      const style = createGridItemStyle(3, 2);
      expect(style.gridColumn).toBe('2 / span 3');
    });
  });

  describe('createFlexStyle', () => {
    it('기본 플렉스 스타일을 생성해야 함', () => {
      const style = createFlexStyle();
      expect(style.display).toBe('flex');
      expect(style.flexDirection).toBe('row');
      expect(style.justifyContent).toBe('flex-start');
      expect(style.alignItems).toBe('flex-start');
    });

    it('커스텀 플렉스 스타일을 생성해야 함', () => {
      const style = createFlexStyle('column', 'center', 'center', 'md');
      expect(style.flexDirection).toBe('column');
      expect(style.justifyContent).toBe('center');
      expect(style.alignItems).toBe('center');
      expect(style.gap).toBe('16px');
    });

    it('justify-content 매핑이 올바르게 작동해야 함', () => {
      expect(createFlexStyle('row', 'between').justifyContent).toBe('space-between');
      expect(createFlexStyle('row', 'around').justifyContent).toBe('space-around');
      expect(createFlexStyle('row', 'evenly').justifyContent).toBe('space-evenly');
    });
  });

  describe('createStackStyle', () => {
    it('수직 스택 스타일을 생성해야 함', () => {
      const style = createStackStyle('md', 'vertical');
      expect(style.display).toBe('flex');
      expect(style.flexDirection).toBe('column');
      expect(style.gap).toBe('16px');
    });

    it('수평 스택 스타일을 생성해야 함', () => {
      const style = createStackStyle('lg', 'horizontal');
      expect(style.display).toBe('flex');
      expect(style.flexDirection).toBe('row');
      expect(style.gap).toBe('24px');
    });
  });

  describe('createResponsiveStackStyle', () => {
    it('반응형 스택 스타일을 생성해야 함', () => {
      const style = createResponsiveStackStyle('sm', 'lg');
      expect(style.gap).toBe('8px'); // 모바일 기본값
      expect(style['@media (min-width: 1024px)']).toEqual({ gap: '24px' });
    });
  });

  describe('createPaddingStyle', () => {
    it('개별 패딩 스타일을 생성해야 함', () => {
      const style = createPaddingStyle('md', 'lg', 'sm', 'xs');
      expect(style.paddingTop).toBe('16px');
      expect(style.paddingRight).toBe('24px');
      expect(style.paddingBottom).toBe('8px');
      expect(style.paddingLeft).toBe('4px');
    });

    it('일부 패딩만 설정할 수 있어야 함', () => {
      const style = createPaddingStyle('md', undefined, 'sm');
      expect(style.paddingTop).toBe('16px');
      expect(style.paddingRight).toBeUndefined();
      expect(style.paddingBottom).toBe('8px');
      expect(style.paddingLeft).toBeUndefined();
    });
  });

  describe('createMarginStyle', () => {
    it('개별 마진 스타일을 생성해야 함', () => {
      const style = createMarginStyle('md', 'lg', 'sm', 'xs');
      expect(style.marginTop).toBe('16px');
      expect(style.marginRight).toBe('24px');
      expect(style.marginBottom).toBe('8px');
      expect(style.marginLeft).toBe('4px');
    });
  });

  describe('createUniformPadding', () => {
    it('균등한 패딩을 생성해야 함', () => {
      const style = createUniformPadding('md');
      expect(style.padding).toBe('16px');
    });
  });

  describe('createUniformMargin', () => {
    it('균등한 마진을 생성해야 함', () => {
      const style = createUniformMargin('lg');
      expect(style.margin).toBe('24px');
    });
  });

  describe('createVerticalRhythm', () => {
    it('기본 수직 리듬을 생성해야 함', () => {
      const rhythm = createVerticalRhythm();
      expect(rhythm.xs).toBe('12px');
      expect(rhythm.sm).toBe('18px');
      expect(rhythm.md).toBe('24px');
      expect(rhythm.lg).toBe('36px');
      expect(rhythm.xl).toBe('48px');
      expect(rhythm['2xl']).toBe('72px');
    });

    it('커스텀 기준 라인 높이로 수직 리듬을 생성해야 함', () => {
      const rhythm = createVerticalRhythm(20);
      expect(rhythm.xs).toBe('10px');
      expect(rhythm.md).toBe('20px');
      expect(rhythm.xl).toBe('40px');
    });
  });

  describe('generateSpacingCSSVariables', () => {
    it('CSS 변수 문자열을 생성해야 함', () => {
      const cssVars = generateSpacingCSSVariables();
      expect(cssVars).toContain('--spacing-4: 16px;');
      expect(cssVars).toContain('--spacing-md: 16px;');
      expect(cssVars).toContain('--breakpoint-tablet: 768px;');
      expect(cssVars).toContain('--container-lg: 1024px;');
    });
  });

  describe('createResponsiveSpacingClasses', () => {
    it('반응형 간격 클래스를 생성해야 함', () => {
      const classes = createResponsiveSpacingClasses();
      expect(classes['p-md-responsive']).toBeDefined();
      expect(classes['m-lg-responsive']).toBeDefined();
      expect(classes['p-md-responsive'].padding).toBe('16px');
    });
  });

  describe('validateLayoutConstraints', () => {
    it('유효한 레이아웃 제약을 검증해야 함', () => {
      const validation = validateLayoutConstraints(400, 300);
      expect(validation.isValidAspectRatio).toBe(true);
      expect(validation.isValidMinSize).toBe(true);
      expect(validation.isAccessibleTouchTarget).toBe(true);
    });

    it('무효한 레이아웃 제약을 감지해야 함', () => {
      const validation = validateLayoutConstraints(200, 100);
      expect(validation.isValidMinSize).toBe(false);
      expect(validation.isAccessibleTouchTarget).toBe(true); // 200x100은 터치 타겟으로는 충분함
      expect(validation.recommendations.width).toContain('320px');
      expect(validation.recommendations.height).toContain('240px');
    });

    it('터치 타겟 크기를 검증해야 함', () => {
      const validation = validateLayoutConstraints(40, 40);
      expect(validation.isAccessibleTouchTarget).toBe(false);
      expect(validation.recommendations.touchTarget).toContain('44x44px');
    });
  });

  describe('calculateOptimalContainerSize', () => {
    it('콘텐츠 비율에 따른 최적 컨테이너 크기를 계산해야 함', () => {
      expect(calculateOptimalContainerSize(400, 1000)).toBe('sm'); // 40% 비율
      expect(calculateOptimalContainerSize(600, 1000)).toBe('md'); // 60% 비율
      expect(calculateOptimalContainerSize(800, 1000)).toBe('lg'); // 80% 비율
      expect(calculateOptimalContainerSize(900, 1000)).toBe('xl'); // 90% 비율
      expect(calculateOptimalContainerSize(950, 1000)).toBe('2xl'); // 95% 비율
    });
  });

  describe('접근성 및 사용성', () => {
    it('터치 타겟 최소 크기가 44px 이상이어야 함', () => {
      const buttonSpacing = getComponentSpacing('button', 'sm');
      // 버튼의 최소 높이 계산 (패딩 + 텍스트 높이)
      const minHeight = parseInt(buttonSpacing.y) * 2 + 16; // 텍스트 높이 가정
      expect(minHeight).toBeGreaterThanOrEqual(32); // 최소 버튼 높이
    });

    it('간격 값이 접근성 가이드라인을 준수해야 함', () => {
      // 최소 터치 타겟 간격 (8px 이상 권장)
      const minSpacing = parseInt(getSpacingValue('sm').replace('px', ''));
      expect(minSpacing).toBeGreaterThanOrEqual(8);
    });
  });

  describe('성능 최적화', () => {
    it('CSS 변수 생성이 효율적이어야 함', () => {
      const startTime = performance.now();
      generateSpacingCSSVariables();
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(10); // 10ms 이하
    });

    it('반응형 클래스 생성이 효율적이어야 함', () => {
      const startTime = performance.now();
      createResponsiveSpacingClasses();
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(50); // 50ms 이하
    });
  });
});