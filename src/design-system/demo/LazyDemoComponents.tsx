/**
 * Lazy-loaded demo components for better performance
 * 성능 향상을 위한 지연 로딩 데모 컴포넌트들
 */

import React, { Suspense } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';

// Lazy load all demo components
const ColorDemo = React.lazy(() => import('./ColorDemo'));
const TypographyDemo = React.lazy(() => import('./TypographyDemo'));
const ButtonDemo = React.lazy(() => import('./ButtonDemo'));
const CardDemo = React.lazy(() => import('./CardDemo'));
const InputDemo = React.lazy(() => import('./InputDemo'));
const LayoutDemo = React.lazy(() => import('./LayoutDemo'));
const ThemeDemo = React.lazy(() => import('./ThemeDemo'));
const SpacingDemo = React.lazy(() => import('./SpacingDemo'));
const ResponsiveDemo = React.lazy(() => import('./ResponsiveDemo'));

// Loading fallback component
const DemoLoadingFallback: React.FC<{ demoName: string }> = ({ demoName }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <LoadingSpinner loading={{ isLoading: true, message: `${demoName} 데모를 불러오는 중...` }} />
    </div>
  </div>
);

// Wrapper components with Suspense
export const LazyColorDemo: React.FC = () => (
  <Suspense fallback={<DemoLoadingFallback demoName="색상 시스템" />}>
    <ColorDemo />
  </Suspense>
);

export const LazyTypographyDemo: React.FC = () => (
  <Suspense fallback={<DemoLoadingFallback demoName="타이포그래피" />}>
    <TypographyDemo />
  </Suspense>
);

export const LazyButtonDemo: React.FC = () => (
  <Suspense fallback={<DemoLoadingFallback demoName="버튼" />}>
    <ButtonDemo />
  </Suspense>
);

export const LazyCardDemo: React.FC = () => (
  <Suspense fallback={<DemoLoadingFallback demoName="카드" />}>
    <CardDemo />
  </Suspense>
);

export const LazyInputDemo: React.FC = () => (
  <Suspense fallback={<DemoLoadingFallback demoName="입력 필드" />}>
    <InputDemo />
  </Suspense>
);

export const LazyLayoutDemo: React.FC = () => (
  <Suspense fallback={<DemoLoadingFallback demoName="레이아웃" />}>
    <LayoutDemo />
  </Suspense>
);

export const LazyThemeDemo: React.FC = () => (
  <Suspense fallback={<DemoLoadingFallback demoName="테마 시스템" />}>
    <ThemeDemo />
  </Suspense>
);

export const LazySpacingDemo: React.FC = () => (
  <Suspense fallback={<DemoLoadingFallback demoName="간격 시스템" />}>
    <SpacingDemo />
  </Suspense>
);

export const LazyResponsiveDemo: React.FC = () => (
  <Suspense fallback={<DemoLoadingFallback demoName="반응형 시스템" />}>
    <ResponsiveDemo />
  </Suspense>
);

// Export all lazy components
export const lazyDemoComponents = {
  colors: LazyColorDemo,
  typography: LazyTypographyDemo,
  buttons: LazyButtonDemo,
  cards: LazyCardDemo,
  inputs: LazyInputDemo,
  layout: LazyLayoutDemo,
  theme: LazyThemeDemo,
  spacing: LazySpacingDemo,
  responsive: LazyResponsiveDemo,
} as const;