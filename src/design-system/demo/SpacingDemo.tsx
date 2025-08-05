/**
 * Linear 디자인 시스템 - 간격 시스템 데모
 * 간격 토큰, 그리드 시스템, 반응형 레이아웃 데모
 */

import React from 'react';
import { 
  spacing, 
  semanticSpacing, 
  componentSpacing, 
  breakpoints, 
  containerMaxWidth,
  grid,
  layout
} from '../tokens/spacing';
// Import utilities for demonstration purposes
// These are available for use in the design system

const SpacingDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-12 min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-display-responsive font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
          Linear 디자인 시스템 - 간격 시스템
        </h1>

        {/* 기본 간격 토큰 */}
        <section className="mb-12">
          <h2 className="text-h2-responsive font-semibold text-neutral-700 mb-6">
            기본 간격 토큰 (4px 기준)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(spacing).slice(0, 12).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                <div 
                  className="bg-primary-500 rounded"
                  style={{ width: value, height: '16px' }}
                />
                <div className="mt-2 text-caption-md text-neutral-600">
                  <div className="font-medium">{key}</div>
                  <div>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 의미적 간격 별칭 */}
        <section className="mb-12">
          <h2 className="text-h2-responsive font-semibold text-neutral-700 mb-6">
            의미적 간격 별칭
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(semanticSpacing).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                <div 
                  className="bg-secondary-500 rounded"
                  style={{ width: value, height: '16px' }}
                />
                <div className="mt-2 text-caption-md text-neutral-600">
                  <div className="font-medium">{key}</div>
                  <div>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 컴포넌트별 간격 */}
        <section className="mb-12">
          <h2 className="text-h2-responsive font-semibold text-neutral-700 mb-6">
            컴포넌트별 간격
          </h2>
          
          {/* 버튼 간격 */}
          <div className="mb-8">
            <h3 className="text-h3 font-medium text-neutral-600 mb-4">버튼 패딩</h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(componentSpacing.button).map(([size, padding]) => (
                <div key={size} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                  <button
                    className="bg-primary-500 text-white rounded-md font-medium transition-colors hover:bg-primary-600"
                    style={{
                      paddingLeft: padding.x,
                      paddingRight: padding.x,
                      paddingTop: padding.y,
                      paddingBottom: padding.y
                    }}
                  >
                    Button {size}
                  </button>
                  <div className="mt-2 text-caption-sm text-neutral-500">
                    <div>x: {padding.x}</div>
                    <div>y: {padding.y}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 카드 간격 */}
          <div className="mb-8">
            <h3 className="text-h3 font-medium text-neutral-600 mb-4">카드 패딩</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(componentSpacing.card).map(([size, padding]) => (
                <div key={size} className="bg-white rounded-lg shadow-sm border border-neutral-200">
                  <div style={{ padding }}>
                    <h4 className="font-medium text-neutral-800">Card {size}</h4>
                    <p className="text-body-sm text-neutral-600 mt-1">
                      패딩: {padding}
                    </p>
                    <p className="text-caption-md text-neutral-500 mt-2">
                      이것은 {size} 크기의 카드 패딩 예시입니다.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 브레이크포인트 */}
        <section className="mb-12">
          <h2 className="text-h2-responsive font-semibold text-neutral-700 mb-6">
            반응형 브레이크포인트
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(breakpoints).map(([name, value]) => (
              <div key={name} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                <div className="text-h4 font-medium text-neutral-800 capitalize">
                  {name}
                </div>
                <div className="text-body-lg text-primary-600 font-medium">
                  {value}
                </div>
                <div className="text-caption-md text-neutral-500 mt-1">
                  {name === 'mobile' && '모바일 기기'}
                  {name === 'tablet' && '태블릿 기기'}
                  {name === 'desktop' && '데스크톱'}
                  {name === 'wide' && '와이드 스크린'}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 컨테이너 최대 너비 */}
        <section className="mb-12">
          <h2 className="text-h2-responsive font-semibold text-neutral-700 mb-6">
            컨테이너 최대 너비
          </h2>
          <div className="space-y-4">
            {Object.entries(containerMaxWidth).map(([size, width]) => (
              <div key={size} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-neutral-800">{size}</span>
                  <span className="text-primary-600 font-medium">{width}</span>
                </div>
                <div 
                  className="bg-gradient-to-r from-primary-100 to-primary-200 rounded h-8 relative"
                  style={{ maxWidth: width }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-caption-md text-primary-700 font-medium">
                    최대 너비: {width}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 그리드 시스템 */}
        <section className="mb-12">
          <h2 className="text-h2-responsive font-semibold text-neutral-700 mb-6">
            12컬럼 그리드 시스템
          </h2>
          
          <div className="mb-6">
            <h3 className="text-h3 font-medium text-neutral-600 mb-4">기본 그리드</h3>
            <div className="grid grid-cols-12 gap-4">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="bg-primary-100 rounded p-2 text-center text-caption-sm text-primary-700 font-medium">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-h3 font-medium text-neutral-600 mb-4">다양한 컬럼 스팬</h3>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 bg-secondary-100 rounded p-4 text-center text-secondary-700 font-medium">
                12 컬럼 (전체 너비)
              </div>
              <div className="col-span-6 bg-success-100 rounded p-4 text-center text-success-700 font-medium">
                6 컬럼 (절반)
              </div>
              <div className="col-span-6 bg-success-100 rounded p-4 text-center text-success-700 font-medium">
                6 컬럼 (절반)
              </div>
              <div className="col-span-4 bg-warning-100 rounded p-4 text-center text-warning-700 font-medium">
                4 컬럼
              </div>
              <div className="col-span-4 bg-warning-100 rounded p-4 text-center text-warning-700 font-medium">
                4 컬럼
              </div>
              <div className="col-span-4 bg-warning-100 rounded p-4 text-center text-warning-700 font-medium">
                4 컬럼
              </div>
              <div className="col-span-3 bg-error-100 rounded p-4 text-center text-error-700 font-medium">
                3 컬럼
              </div>
              <div className="col-span-3 bg-error-100 rounded p-4 text-center text-error-700 font-medium">
                3 컬럼
              </div>
              <div className="col-span-3 bg-error-100 rounded p-4 text-center text-error-700 font-medium">
                3 컬럼
              </div>
              <div className="col-span-3 bg-error-100 rounded p-4 text-center text-error-700 font-medium">
                3 컬럼
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-h3 font-medium text-neutral-600 mb-4">반응형 거터</h3>
            <div className="space-y-4">
              <div className="text-caption-md text-neutral-500">
                모바일: {grid.gutter.mobile} | 태블릿: {grid.gutter.tablet} | 데스크톱: {grid.gutter.desktop}
              </div>
            </div>
          </div>
        </section>

        {/* 레이아웃 유틸리티 */}
        <section className="mb-12">
          <h2 className="text-h2-responsive font-semibold text-neutral-700 mb-6">
            레이아웃 유틸리티
          </h2>

          {/* Z-index 레이어 */}
          <div className="mb-8">
            <h3 className="text-h3 font-medium text-neutral-600 mb-4">Z-index 레이어</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(layout.zIndex).slice(0, 8).map(([name, value]) => (
                <div key={name} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                  <div className="font-medium text-neutral-800">{name}</div>
                  <div className="text-primary-600 font-mono text-body-sm">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 둥근 모서리 */}
          <div className="mb-8">
            <h3 className="text-h3 font-medium text-neutral-600 mb-4">둥근 모서리</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(layout.borderRadius).slice(0, 8).map(([name, value]) => (
                <div key={name} className="bg-white p-4 shadow-sm border border-neutral-200">
                  <div 
                    className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 mb-2"
                    style={{ borderRadius: value }}
                  />
                  <div className="font-medium text-neutral-800">{name}</div>
                  <div className="text-primary-600 font-mono text-caption-md">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 최소 크기 */}
          <div className="mb-8">
            <h3 className="text-h3 font-medium text-neutral-600 mb-4">최소 크기 제약</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(layout.minSize).map(([name, value]) => (
                <div key={name} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                  <div 
                    className="bg-success-500 rounded flex items-center justify-center text-white text-caption-sm font-medium"
                    style={{ minWidth: value, minHeight: value }}
                  >
                    {name}
                  </div>
                  <div className="mt-2 text-caption-md text-neutral-600">
                    <div className="font-medium">{name}</div>
                    <div>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 반응형 간격 예시 */}
        <section className="mb-12">
          <h2 className="text-h2-responsive font-semibold text-neutral-700 mb-6">
            반응형 간격 예시
          </h2>
          
          <div className="container-responsive">
            <div className="section-spacing bg-white rounded-lg shadow-sm border border-neutral-200">
              <h3 className="text-h3 font-medium text-neutral-800 mb-4">
                반응형 컨테이너 & 섹션 간격
              </h3>
              <p className="text-body-md text-neutral-600 mb-4">
                이 컨테이너는 화면 크기에 따라 패딩이 자동으로 조정됩니다.
              </p>
              <div className="stack-spacing">
                <div className="card-spacing bg-primary-50 rounded-lg">
                  <h4 className="font-medium text-primary-800">카드 1</h4>
                  <p className="text-caption-md text-primary-600">반응형 카드 패딩</p>
                </div>
                <div className="card-spacing bg-secondary-50 rounded-lg">
                  <h4 className="font-medium text-secondary-800">카드 2</h4>
                  <p className="text-caption-md text-secondary-600">반응형 카드 패딩</p>
                </div>
                <div className="card-spacing bg-success-50 rounded-lg">
                  <h4 className="font-medium text-success-800">카드 3</h4>
                  <p className="text-caption-md text-success-600">반응형 카드 패딩</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 사용법 가이드 */}
        <section className="mb-12">
          <h2 className="text-h2-responsive font-semibold text-neutral-700 mb-6">
            사용법 가이드
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
              <h3 className="text-h3 font-medium text-neutral-800 mb-4">Tailwind CSS 클래스</h3>
              <div className="space-y-2 text-caption-md font-mono bg-neutral-50 p-4 rounded">
                <div>p-4 → padding: 16px</div>
                <div>m-lg → margin: 24px</div>
                <div>gap-xl → gap: 32px</div>
                <div>space-y-2xl → margin-top: 48px</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
              <h3 className="text-h3 font-medium text-neutral-800 mb-4">CSS 변수</h3>
              <div className="space-y-2 text-caption-md font-mono bg-neutral-50 p-4 rounded">
                <div>var(--spacing-md) → 16px</div>
                <div>var(--spacing-lg) → 24px</div>
                <div>var(--spacing-xl) → 32px</div>
                <div>var(--spacing-2xl) → 48px</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
              <h3 className="text-h3 font-medium text-neutral-800 mb-4">반응형 클래스</h3>
              <div className="space-y-2 text-caption-md font-mono bg-neutral-50 p-4 rounded">
                <div>.container-responsive</div>
                <div>.section-spacing</div>
                <div>.stack-spacing</div>
                <div>.card-spacing</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
              <h3 className="text-h3 font-medium text-neutral-800 mb-4">접근성 고려사항</h3>
              <div className="space-y-2 text-caption-md text-neutral-600">
                <div>• 최소 터치 타겟: 44px</div>
                <div>• 최소 간격: 8px</div>
                <div>• 4px 기준 일관성</div>
                <div>• 반응형 적응</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SpacingDemo;