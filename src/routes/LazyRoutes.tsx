/**
 * Route-based code splitting implementation
 * 라우트 기반 코드 분할 구현
 */

import React, { Suspense } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy load route components
const GradeSelectionRoute = React.lazy(() => import('../components/GradeSelector'));
const CardLearningRoute = React.lazy(() => import('../components/CardView'));
const ProgressDashboardRoute = React.lazy(() => import('../components/ProgressDashboard'));
const DesignSystemRoute = React.lazy(() => import('../design-system/demo/index'));

// Route loading fallback
const RouteLoadingFallback: React.FC<{ routeName: string }> = ({ routeName }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <LoadingSpinner loading={{ isLoading: true, message: `${routeName} 페이지를 불러오는 중...` }} />
    </div>
  </div>
);

// Lazy route components with Suspense
export const LazyGradeSelectionRoute: React.FC = () => (
  <Suspense fallback={<RouteLoadingFallback routeName="학년 선택" />}>
    <GradeSelectionRoute />
  </Suspense>
);

export const LazyCardLearningRoute: React.FC<any> = (props) => (
  <Suspense fallback={<RouteLoadingFallback routeName="카드 학습" />}>
    <CardLearningRoute {...props} />
  </Suspense>
);

export const LazyProgressDashboardRoute: React.FC<any> = (props) => (
  <Suspense fallback={
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8">
        <LoadingSpinner loading={{ isLoading: true, message: '진도 대시보드를 불러오는 중...' }} />
      </div>
    </div>
  }>
    <ProgressDashboardRoute {...props} />
  </Suspense>
);

export const LazyDesignSystemRoute: React.FC = () => (
  <Suspense fallback={<RouteLoadingFallback routeName="디자인 시스템" />}>
    <DesignSystemRoute />
  </Suspense>
);

// Route preloading utilities
export const preloadRoutes = {
  gradeSelection: () => import('../components/GradeSelector'),
  cardLearning: () => import('../components/CardView'),
  progressDashboard: () => import('../components/ProgressDashboard'),
  designSystem: () => import('../design-system/demo/index'),
};

// Smart preloading based on user behavior
export const smartPreload = {
  // Preload progress dashboard when user starts learning
  onLearningStart: () => {
    setTimeout(() => {
      preloadRoutes.progressDashboard().catch(() => {});
    }, 2000);
  },
  
  // Preload card learning when grade is selected
  onGradeSelected: () => {
    preloadRoutes.cardLearning().catch(() => {});
  },
  
  // Preload design system for developers
  onDeveloperMode: () => {
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        preloadRoutes.designSystem().catch(() => {});
      }, 5000);
    }
  },
};