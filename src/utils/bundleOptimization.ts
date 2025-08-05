/**
 * Bundle size optimization utilities
 * 번들 크기 최적화 유틸리티
 */

/**
 * Tree shaking optimization helpers
 * 트리 셰이킹 최적화 헬퍼
 */
export const treeShakingUtils = {
  /**
   * Import only specific functions from utility libraries
   * 유틸리티 라이브러리에서 특정 함수만 import
   */
  importSpecific: {
    // Example: Instead of importing entire lodash, import specific functions
    // import { debounce } from 'lodash/debounce';
    // import { throttle } from 'lodash/throttle';
    
    // For our design system, import only what's needed
    designSystem: {
      // Import specific tokens
      colors: () => import('../design-system/tokens/colors').then(m => m.colors),
      typography: () => import('../design-system/tokens/typography').then(m => m.typography),
      spacing: () => import('../design-system/tokens/spacing').then(m => m.spacing),
      
      // Import specific components
      Button: () => import('../design-system/components/Button').then(m => m.Button),
      Card: () => import('../design-system/components/Card').then(m => m.Card),
      Input: () => import('../design-system/components/Input').then(m => m.Input),
    },
  },

  /**
   * Mark side-effect free modules
   * 사이드 이펙트가 없는 모듈 표시
   */
  sideEffectFree: [
    'src/design-system/tokens/**',
    'src/design-system/utils/**',
    'src/utils/**',
  ],
};

/**
 * Code splitting strategies
 * 코드 분할 전략
 */
export const codeSplittingStrategies = {
  /**
   * Route-based splitting
   * 라우트 기반 분할
   */
  routes: {
    main: () => import('../App'),
    gradeSelection: () => import('../components/GradeSelector'),
    cardLearning: () => import('../components/CardView'),
    progressDashboard: () => import('../components/ProgressDashboard'),
    designSystem: () => import('../design-system/demo/index'),
  },

  /**
   * Feature-based splitting
   * 기능 기반 분할
   */
  features: {
    tts: () => import('../services/ttsService'),
    storage: () => import('../services/storageService'),
    progress: () => import('../services/progressService'),
    accessibility: () => import('../design-system/utils/accessibility'),
  },

  /**
   * Vendor splitting
   * 벤더 분할
   */
  vendors: {
    react: ['react', 'react-dom'],
    animation: ['framer-motion'],
    utils: ['date-fns', 'lodash-es'], // If we add these later
  },
};

/**
 * Asset optimization utilities
 * 에셋 최적화 유틸리티
 */
export const assetOptimization = {
  /**
   * Image optimization settings
   * 이미지 최적화 설정
   */
  images: {
    // WebP conversion for better compression
    webpConversion: {
      quality: 80,
      effort: 6,
    },
    
    // Responsive image sizes
    responsiveSizes: [320, 640, 768, 1024, 1280, 1920],
    
    // Lazy loading threshold
    lazyLoadingThreshold: '10px',
  },

  /**
   * Font optimization
   * 폰트 최적화
   */
  fonts: {
    // Preload critical fonts
    preload: [
      'Inter-Regular.woff2',
      'Inter-Medium.woff2',
      'Inter-SemiBold.woff2',
    ],
    
    // Font display strategy
    display: 'swap',
    
    // Subset fonts to reduce size
    subset: 'latin',
  },

  /**
   * CSS optimization
   * CSS 최적화
   */
  css: {
    // PurgeCSS configuration for Tailwind
    purge: {
      content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './public/index.html',
      ],
      safelist: [
        // Keep dynamic classes
        /^bg-/,
        /^text-/,
        /^border-/,
        /^hover:/,
        /^focus:/,
        /^active:/,
        /^disabled:/,
      ],
    },
    
    // Critical CSS extraction
    critical: {
      inline: true,
      minify: true,
      extract: true,
      dimensions: [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 }, // Desktop
      ],
    },
  },
};

/**
 * Bundle analysis utilities
 * 번들 분석 유틸리티
 */
export const bundleAnalysis = {
  /**
   * Check bundle size limits
   * 번들 크기 제한 확인
   */
  sizeLimits: {
    // Target sizes in KB
    main: 250, // Main bundle
    vendor: 200, // Vendor bundle
    chunk: 100, // Individual chunks
    css: 50, // CSS files
    total: 500, // Total bundle size
  },

  /**
   * Performance budget warnings
   * 성능 예산 경고
   */
  performanceBudget: {
    // First Contentful Paint target
    fcp: 1500, // ms
    
    // Largest Contentful Paint target
    lcp: 2500, // ms
    
    // Time to Interactive target
    tti: 3000, // ms
    
    // Bundle size targets
    javascript: 250, // KB
    css: 50, // KB
    images: 100, // KB
    fonts: 30, // KB
  },

  /**
   * Generate bundle report
   * 번들 리포트 생성
   */
  generateReport: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Bundle analysis is only available in build mode');
      console.log('Run: npm run build:analyze');
      return;
    }

    // This would be called during build process
    return {
      timestamp: new Date().toISOString(),
      sizes: bundleAnalysis.sizeLimits,
      budget: bundleAnalysis.performanceBudget,
      recommendations: [
        'Consider lazy loading non-critical components',
        'Optimize images with WebP format',
        'Remove unused CSS with PurgeCSS',
        'Split vendor bundles for better caching',
      ],
    };
  },
};

/**
 * Runtime optimization utilities
 * 런타임 최적화 유틸리티
 */
export const runtimeOptimization = {
  /**
   * Preload critical resources
   * 중요한 리소스 사전 로딩
   */
  preloadCritical: () => {
    if (typeof window === 'undefined') return;

    // Preload critical fonts
    assetOptimization.fonts.preload.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = `/fonts/${font}`;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preload critical images
    const criticalImages = [
      '/images/logo.webp',
      '/images/hero-bg.webp',
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    });
  },

  /**
   * Prefetch non-critical resources
   * 중요하지 않은 리소스 사전 가져오기
   */
  prefetchNonCritical: () => {
    if (typeof window === 'undefined') return;

    // Prefetch routes that user might visit
    const routesToPrefetch = [
      '/progress-dashboard',
      '/design-system',
    ];

    routesToPrefetch.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  },

  /**
   * Service Worker for caching
   * 캐싱을 위한 서비스 워커
   */
  serviceWorker: {
    // Cache strategies
    strategies: {
      // Cache first for static assets
      cacheFirst: [
        '/static/',
        '/assets/',
        '/fonts/',
        '/images/',
      ],
      
      // Network first for API calls
      networkFirst: [
        '/api/',
      ],
      
      // Stale while revalidate for HTML
      staleWhileRevalidate: [
        '/',
        '/index.html',
      ],
    },
    
    // Cache duration
    cacheDuration: {
      static: 365 * 24 * 60 * 60, // 1 year
      api: 5 * 60, // 5 minutes
      html: 24 * 60 * 60, // 1 day
    },
  },
};

/**
 * Initialize bundle optimizations
 * 번들 최적화 초기화
 */
export const initializeBundleOptimizations = () => {
  // Preload critical resources
  runtimeOptimization.preloadCritical();
  
  // Prefetch non-critical resources after page load
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        runtimeOptimization.prefetchNonCritical();
      }, 2000);
    });
  }
  
  // Log bundle analysis in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle optimization initialized');
    console.log('Size limits:', bundleAnalysis.sizeLimits);
    console.log('Performance budget:', bundleAnalysis.performanceBudget);
  }
};