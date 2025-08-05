/**
 * Utility functions for lazy loading and dynamic imports
 * 지연 로딩 및 동적 import를 위한 유틸리티 함수들
 */

import { ComponentType } from 'react';

/**
 * Dynamically import utility functions
 * 유틸리티 함수들을 동적으로 import
 */
export const lazyImportUtils = {
  // Lazy load color utilities
  colorUtils: () => import('../design-system/tokens/colorUtils'),
  
  // Lazy load typography utilities
  typographyUtils: () => import('../design-system/tokens/typographyUtils'),
  
  // Lazy load spacing utilities
  spacingUtils: () => import('../design-system/tokens/spacingUtils'),
  
  // Lazy load animation utilities
  animationUtils: () => import('../design-system/tokens/animationUtils'),
  
  // Lazy load responsive utilities
  responsiveUtils: () => import('../design-system/utils/responsive'),
  
  // Lazy load accessibility utilities
  accessibilityUtils: () => import('../design-system/utils/accessibility'),
  
  // Lazy load theme utilities
  themeUtils: () => import('../design-system/themes/utils'),
};

/**
 * Create a lazy-loaded component with retry logic
 * 재시도 로직이 포함된 지연 로딩 컴포넌트 생성
 */
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retryCount = 3
): React.LazyExoticComponent<T> => {
  return React.lazy(async () => {
    let lastError: Error | null = null;
    
    for (let i = 0; i < retryCount; i++) {
      try {
        return await importFn();
      } catch (error) {
        lastError = error as Error;
        
        // Wait before retry (exponential backoff)
        if (i < retryCount - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }
    
    throw lastError;
  });
};

/**
 * Preload a component for better UX
 * 더 나은 UX를 위한 컴포넌트 사전 로딩
 */
export const preloadComponent = (importFn: () => Promise<any>): void => {
  // Use requestIdleCallback if available, otherwise use setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFn().catch(() => {
        // Silently fail preloading
      });
    });
  } else {
    setTimeout(() => {
      importFn().catch(() => {
        // Silently fail preloading
      });
    }, 100);
  }
};

/**
 * Lazy load utilities based on user interaction
 * 사용자 상호작용에 기반한 유틸리티 지연 로딩
 */
export const lazyLoadOnInteraction = {
  // Load color utilities when user interacts with theme
  loadColorUtils: () => lazyImportUtils.colorUtils(),
  
  // Load typography utilities when user changes text settings
  loadTypographyUtils: () => lazyImportUtils.typographyUtils(),
  
  // Load responsive utilities when viewport changes
  loadResponsiveUtils: () => lazyImportUtils.responsiveUtils(),
  
  // Load accessibility utilities when accessibility features are used
  loadAccessibilityUtils: () => lazyImportUtils.accessibilityUtils(),
};

/**
 * Route-based code splitting helpers
 * 라우트 기반 코드 분할 헬퍼
 */
export const routeBasedLazyLoading = {
  // Main app routes
  GradeSelection: createLazyComponent(() => import('../components/GradeSelector')),
  CardLearning: createLazyComponent(() => import('../components/CardView')),
  ProgressDashboard: createLazyComponent(() => import('../components/ProgressDashboard')),
  
  // Design system routes
  DesignSystemDemo: createLazyComponent(() => import('../design-system/demo/index')),
  
  // Settings component would go here when implemented
};

/**
 * Chunk loading optimization
 * 청크 로딩 최적화
 */
export const optimizeChunkLoading = () => {
  // Preload critical chunks on app start
  if (typeof window !== 'undefined') {
    // Preload progress dashboard after initial render
    preloadComponent(() => import('../components/ProgressDashboard'));
    
    // Preload design system components if user is likely to use them
    const userAgent = navigator.userAgent.toLowerCase();
    const isDeveloper = userAgent.includes('chrome') && window.location.hostname === 'localhost';
    
    if (isDeveloper) {
      preloadComponent(() => import('../design-system/demo/index'));
    }
  }
};

// Import React for createLazyComponent
import React from 'react';