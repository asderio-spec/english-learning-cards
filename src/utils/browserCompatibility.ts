/**
 * 브라우저 호환성 유틸리티
 * 다양한 브라우저에서의 호환성을 보장합니다.
 */

/**
 * 브라우저 감지 유틸리티
 */
export const BrowserDetector = {
  /**
   * 현재 브라우저 정보 감지
   */
  detect(): {
    name: string;
    version: string;
    engine: string;
    platform: string;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  } {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // 브라우저 감지
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    let engine = 'Unknown';
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browserName = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
      engine = 'Blink';
    } else if (userAgent.includes('Firefox')) {
      browserName = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
      engine = 'Gecko';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browserName = 'Safari';
      const match = userAgent.match(/Version\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
      engine = 'WebKit';
    } else if (userAgent.includes('Edg')) {
      browserName = 'Edge';
      const match = userAgent.match(/Edg\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
      engine = 'Blink';
    }
    
    // 디바이스 타입 감지
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*Tablet)|Tablet/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    
    return {
      name: browserName,
      version: browserVersion,
      engine,
      platform,
      isMobile,
      isTablet,
      isDesktop
    };
  },

  /**
   * 특정 브라우저인지 확인
   */
  is(browserName: string): boolean {
    return this.detect().name.toLowerCase() === browserName.toLowerCase();
  },

  /**
   * 브라우저 버전 비교
   */
  isVersionAtLeast(minVersion: number): boolean {
    const currentVersion = parseInt(this.detect().version);
    return currentVersion >= minVersion;
  }
};

/**
 * 기능 지원 여부 감지
 */
export const FeatureDetector = {
  /**
   * CSS 기능 지원 여부 확인
   */
  supportsCSS(property: string, value?: string): boolean {
    if (typeof CSS !== 'undefined' && CSS.supports) {
      return value ? CSS.supports(property, value) : CSS.supports(property);
    }
    
    // Fallback for older browsers
    const element = document.createElement('div');
    const camelCase = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    
    if (value) {
      try {
        (element.style as any)[camelCase] = value;
        return (element.style as any)[camelCase] === value;
      } catch {
        return false;
      }
    }
    
    return camelCase in element.style;
  },

  /**
   * JavaScript API 지원 여부 확인
   */
  supportsAPI(apiName: string): boolean {
    const apis: Record<string, () => boolean> = {
      'IntersectionObserver': () => 'IntersectionObserver' in window,
      'ResizeObserver': () => 'ResizeObserver' in window,
      'MutationObserver': () => 'MutationObserver' in window,
      'requestAnimationFrame': () => 'requestAnimationFrame' in window,
      'localStorage': () => {
        try {
          const test = '__test__';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch {
          return false;
        }
      },
      'sessionStorage': () => {
        try {
          const test = '__test__';
          sessionStorage.setItem(test, test);
          sessionStorage.removeItem(test);
          return true;
        } catch {
          return false;
        }
      },
      'fetch': () => 'fetch' in window,
      'Promise': () => 'Promise' in window,
      'WebGL': () => {
        try {
          const canvas = document.createElement('canvas');
          return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch {
          return false;
        }
      },
      'ServiceWorker': () => 'serviceWorker' in navigator,
      'PushManager': () => 'PushManager' in window,
      'Notification': () => 'Notification' in window,
      'geolocation': () => 'geolocation' in navigator,
      'vibrate': () => 'vibrate' in navigator,
      'share': () => 'share' in navigator,
      'clipboard': () => 'clipboard' in navigator,
      'mediaDevices': () => 'mediaDevices' in navigator,
      'speechSynthesis': () => 'speechSynthesis' in window,
      'speechRecognition': () => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    };

    return apis[apiName] ? apis[apiName]() : false;
  },

  /**
   * 터치 지원 여부 확인
   */
  supportsTouch(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  /**
   * 호버 지원 여부 확인
   */
  supportsHover(): boolean {
    return window.matchMedia('(hover: hover)').matches;
  },

  /**
   * 다크 모드 선호 여부 확인
   */
  prefersDarkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  /**
   * 애니메이션 감소 선호 여부 확인
   */
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * 고대비 모드 선호 여부 확인
   */
  prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }
};

/**
 * Polyfill 관리자
 */
export const PolyfillManager = {
  /**
   * 필요한 polyfill들을 로드
   */
  async loadPolyfills(): Promise<void> {
    const polyfills: Array<() => Promise<void>> = [];

    // IntersectionObserver polyfill
    if (!FeatureDetector.supportsAPI('IntersectionObserver')) {
      polyfills.push(async () => {
        try {
          await import('intersection-observer');
        } catch (error) {
          console.warn('IntersectionObserver polyfill not available:', error);
        }
      });
    }

    // ResizeObserver polyfill
    if (!FeatureDetector.supportsAPI('ResizeObserver')) {
      polyfills.push(async () => {
        try {
          await import('@juggle/resize-observer');
        } catch (error) {
          console.warn('ResizeObserver polyfill not available:', error);
        }
      });
    }

    // Fetch polyfill
    if (!FeatureDetector.supportsAPI('fetch')) {
      polyfills.push(async () => {
        try {
          await import('whatwg-fetch');
        } catch (error) {
          console.warn('Fetch polyfill not available:', error);
        }
      });
    }

    // Promise polyfill
    if (!FeatureDetector.supportsAPI('Promise')) {
      polyfills.push(async () => {
        try {
          await import('es6-promise/auto');
        } catch (error) {
          console.warn('Promise polyfill not available:', error);
        }
      });
    }

    // 모든 polyfill 로드
    await Promise.all(polyfills.map(load => load()));
  },

  /**
   * CSS 변수 polyfill (IE 지원용)
   */
  initCSSVariablesPolyfill(): void {
    if (!FeatureDetector.supportsCSS('--custom-property')) {
      // CSS 변수를 지원하지 않는 브라우저용 fallback
      const root = document.documentElement;
      const fallbackStyles = {
        '--color-primary': '#6366f1',
        '--color-secondary': '#8b5cf6',
        '--color-success': '#10b981',
        '--color-warning': '#f59e0b',
        '--color-error': '#ef4444',
        '--color-background': '#ffffff',
        '--color-surface': '#f8fafc',
        '--color-text': '#1f2937',
        '--color-text-secondary': '#6b7280'
      };

      Object.entries(fallbackStyles).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
    }
  }
};

/**
 * 브라우저별 스타일 조정
 */
export const BrowserStyleFixer = {
  /**
   * 브라우저별 CSS 클래스 추가
   */
  addBrowserClasses(): void {
    const browser = BrowserDetector.detect();
    const classes = [
      `browser-${browser.name.toLowerCase()}`,
      `engine-${browser.engine.toLowerCase()}`,
      `platform-${browser.platform.toLowerCase()}`,
      browser.isMobile ? 'is-mobile' : 'is-desktop',
      FeatureDetector.supportsTouch() ? 'has-touch' : 'no-touch',
      FeatureDetector.supportsHover() ? 'has-hover' : 'no-hover'
    ];

    document.documentElement.classList.add(...classes);
  },

  /**
   * Safari 관련 스타일 수정
   */
  fixSafariStyles(): void {
    if (BrowserDetector.is('Safari')) {
      // Safari의 100vh 문제 해결
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };

      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);

      // Safari의 스크롤 바운스 비활성화
      document.body.style.overscrollBehavior = 'none';
    }
  },

  /**
   * Firefox 관련 스타일 수정
   */
  fixFirefoxStyles(): void {
    if (BrowserDetector.is('Firefox')) {
      // Firefox의 스크롤바 스타일링
      const style = document.createElement('style');
      style.textContent = `
        * {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `;
      document.head.appendChild(style);
    }
  },

  /**
   * 모든 브라우저 스타일 수정 적용
   */
  applyAllFixes(): void {
    this.addBrowserClasses();
    this.fixSafariStyles();
    this.fixFirefoxStyles();
  }
};

/**
 * 성능 최적화 유틸리티
 */
export const PerformanceOptimizer = {
  /**
   * 브라우저별 성능 최적화 적용
   */
  optimize(): void {
    const browser = BrowserDetector.detect();

    // Chrome/Edge 최적화
    if (browser.name === 'Chrome' || browser.name === 'Edge') {
      // GPU 가속 활성화
      document.documentElement.style.transform = 'translateZ(0)';
    }

    // Safari 최적화
    if (browser.name === 'Safari') {
      // Safari의 백페이스 가시성 숨김
      document.documentElement.style.webkitBackfaceVisibility = 'hidden';
    }

    // Firefox 최적화
    if (browser.name === 'Firefox') {
      // Firefox의 스크롤 성능 개선
      document.documentElement.style.scrollBehavior = 'auto';
    }

    // 모바일 최적화
    if (browser.isMobile) {
      // 터치 지연 제거
      document.documentElement.style.touchAction = 'manipulation';
      
      // 탭 하이라이트 제거
      document.documentElement.style.webkitTapHighlightColor = 'transparent';
    }
  }
};

/**
 * 브라우저 호환성 초기화
 */
export const initBrowserCompatibility = async (): Promise<void> => {
  // Polyfill 로드
  await PolyfillManager.loadPolyfills();
  
  // CSS 변수 polyfill 초기화
  PolyfillManager.initCSSVariablesPolyfill();
  
  // 브라우저별 스타일 수정 적용
  BrowserStyleFixer.applyAllFixes();
  
  // 성능 최적화 적용
  PerformanceOptimizer.optimize();
  
  console.log('Browser compatibility initialized:', BrowserDetector.detect());
};