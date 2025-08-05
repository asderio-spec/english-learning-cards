/**
 * Lazy-loaded components for better performance
 * 성능 향상을 위한 지연 로딩 컴포넌트들
 */

import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';
import type { Grade } from '../types';

// Lazy load heavy components
const ProgressDashboard = React.lazy(() => import('./ProgressDashboard'));
const AutoPlay = React.lazy(() => import('./AutoPlay'));
const GradeSelector = React.lazy(() => import('./GradeSelector'));

// Loading fallback components
const ComponentLoadingFallback: React.FC<{ componentName: string }> = ({ componentName }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <LoadingSpinner loading={{ isLoading: true, message: `${componentName}을(를) 불러오는 중...` }} />
  </div>
);

// Lazy ProgressDashboard (already exists but let's make it consistent)
interface LazyProgressDashboardProps {
  onClose: () => void;
  onGradeSelect: (grade: Grade) => void;
}

export const LazyProgressDashboard: React.FC<LazyProgressDashboardProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <LoadingSpinner loading={{ isLoading: true, message: '진도 대시보드를 불러오는 중...' }} />
        </div>
      </div>
    }>
      <ProgressDashboard {...props} />
    </Suspense>
  );
};

// Lazy AutoPlay component
interface LazyAutoPlayProps {
  isActive: boolean;
  speed: 'slow' | 'normal' | 'fast';
  onToggle: () => void;
  onSpeedChange: (speed: 'slow' | 'normal' | 'fast') => void;
}

export const LazyAutoPlay: React.FC<LazyAutoPlayProps> = (props) => {
  return (
    <Suspense fallback={<ComponentLoadingFallback componentName="자동재생" />}>
      <AutoPlay {...props} />
    </Suspense>
  );
};

// Lazy GradeSelector component
export const LazyGradeSelector: React.FC = () => {
  return (
    <Suspense fallback={<ComponentLoadingFallback componentName="학년 선택" />}>
      <GradeSelector />
    </Suspense>
  );
};

// Lazy load design system components
const DesignSystemDemo = React.lazy(() => import('../design-system/demo/index'));

export const LazyDesignSystemDemo: React.FC = () => {
  return (
    <Suspense fallback={<ComponentLoadingFallback componentName="디자인 시스템 데모" />}>
      <DesignSystemDemo />
    </Suspense>
  );
};