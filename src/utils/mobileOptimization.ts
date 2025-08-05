/**
 * 모바일 웹 최적화 유틸리티
 */

/**
 * 터치 인터랙션 최적화
 */
export class TouchOptimizer {
  private static instance: TouchOptimizer;
  private touchStartTime = 0;
  private touchStartPosition = { x: 0, y: 0 };
  private isScrolling = false;

  static getInstance(): TouchOptimizer {
    if (!TouchOptimizer.instance) {
      TouchOptimizer.instance = new TouchOptimizer();
    }
    return TouchOptimizer.instance;
  }

  /**
   * 터치 이벤트 최적화 초기화
   */
  init(): void {
    // 터치 지연 제거
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });

    // 더블 탭 줌 방지 (필요한 경우)
    this.preventDoubleTabZoom();

    // 터치 액션 최적화
    this.optimizeTouchActions();
  }

  private handleTouchStart(event: TouchEvent): void {
    this.touchStartTime = Date.now();
    this.touchStartPosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
    this.isScrolling = false;
  }

  private handleTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - this.touchStartPosition.x);
    const deltaY = Math.abs(touch.clientY - this.touchStartPosition.y);

    // 스크롤 감지
    if (deltaY > deltaX && deltaY > 10) {
      this.isScrolling = true;
    }

    // 가로 스와이프 감지 (카드 네비게이션용)
    if (deltaX > 50 && deltaY < 30 && !this.isScrolling) {
      const direction = touch.clientX > this.touchStartPosition.x ? 'right' : 'left';
      this.dispatchSwipeEvent(direction, deltaX);
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    const touchDuration = Date.now() - this.touchStartTime;
    
    // 빠른 탭 감지 (300ms 이하)
    if (touchDuration < 300 && !this.isScrolling) {
      this.dispatchFastTapEvent(event);
    }
  }

  private dispatchSwipeEvent(direction: 'left' | 'right', distance: number): void {
    const swipeEvent = new CustomEvent('swipe', {
      detail: { direction, distance }
    });
    document.dispatchEvent(swipeEvent);
  }

  private dispatchFastTapEvent(event: TouchEvent): void {
    const fastTapEvent = new CustomEvent('fasttap', {
      detail: { originalEvent: event }
    });
    event.target?.dispatchEvent(fastTapEvent);
  }

  private preventDoubleTabZoom(): void {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }

  private optimizeTouchActions(): void {
    // 터치 액션 최적화
    const style = document.createElement('style');
    style.textContent = `
      /* 터치 최적화 */
      * {
        touch-action: manipulation;
      }
      
      /* 스크롤 가능한 요소 */
      .scrollable {
        touch-action: pan-y;
        -webkit-overflow-scrolling: touch;
      }
      
      /* 가로 스크롤 */
      .horizontal-scroll {
        touch-action: pan-x;
      }
      
      /* 모든 방향 스크롤 */
      .pan-all {
        touch-action: pan-x pan-y;
      }
      
      /* 터치 비활성화 */
      .no-touch {
        touch-action: none;
      }
      
      /* 터치 하이라이트 제거 */
      button, a, [role="button"] {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 터치 타겟 크기 검증
   */
  validateTouchTargets(): void {
    const minTouchSize = 44; // 44px 최소 권장 크기
    const interactiveElements = document.querySelectorAll('button, a, input, [role="button"], [tabindex]');

    interactiveElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width < minTouchSize || rect.height < minTouchSize) {
        console.warn('Touch target too small:', element, `${rect.width}x${rect.height}`);
        
        // 자동으로 패딩 추가
        (element as HTMLElement).style.minWidth = `${minTouchSize}px`;
        (element as HTMLElement).style.minHeight = `${minTouchSize}px`;
      }
    });
  }
}

/**
 * 뷰포트 최적화
 */
export class ViewportOptimizer {
  /**
   * 뷰포트 메타 태그 최적화
   */
  static optimizeViewport(): void {
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }

    // 모바일 최적화된 뷰포트 설정
    viewportMeta.content = [
      'width=device-width',
      'initial-scale=1.0',
      'maximum-scale=5.0',
      'minimum-scale=1.0',
      'user-scalable=yes',
      'viewport-fit=cover'
    ].join(', ');
  }

  /**
   * 안전 영역 처리 (iPhone X 등의 노치 대응)
   */
  static handleSafeArea(): void {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --safe-area-inset-top: env(safe-area-inset-top);
        --safe-area-inset-right: env(safe-area-inset-right);
        --safe-area-inset-bottom: env(safe-area-inset-bottom);
        --safe-area-inset-left: env(safe-area-inset-left);
      }
      
      .safe-area-top {
        padding-top: var(--safe-area-inset-top);
      }
      
      .safe-area-bottom {
        padding-bottom: var(--safe-area-inset-bottom);
      }
      
      .safe-area-left {
        padding-left: var(--safe-area-inset-left);
      }
      
      .safe-area-right {
        padding-right: var(--safe-area-inset-right);
      }
      
      .safe-area-all {
        padding-top: var(--safe-area-inset-top);
        padding-right: var(--safe-area-inset-right);
        padding-bottom: var(--safe-area-inset-bottom);
        padding-left: var(--safe-area-inset-left);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 100vh 문제 해결 (모바일 브라우저 주소창 대응)
   */
  static fix100vh(): void {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
      setTimeout(setVH, 100); // 방향 변경 후 약간의 지연
    });

    // CSS 변수 사용을 위한 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
      .full-height {
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100);
      }
      
      .min-full-height {
        min-height: 100vh;
        min-height: calc(var(--vh, 1vh) * 100);
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * 성능 최적화
 */
export class MobilePerformanceOptimizer {
  /**
   * 스크롤 성능 최적화
   */
  static optimizeScrolling(): void {
    const style = document.createElement('style');
    style.textContent = `
      /* 스크롤 성능 최적화 */
      .smooth-scroll {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
      }
      
      /* GPU 가속 활성화 */
      .gpu-accelerated {
        transform: translateZ(0);
        will-change: transform;
      }
      
      /* 스크롤 스냅 */
      .scroll-snap-container {
        scroll-snap-type: y mandatory;
        -webkit-overflow-scrolling: touch;
      }
      
      .scroll-snap-item {
        scroll-snap-align: start;
      }
      
      /* 관성 스크롤 */
      .momentum-scroll {
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 이미지 지연 로딩 최적화
   */
  static optimizeImageLoading(): void {
    // Intersection Observer를 사용한 이미지 지연 로딩
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px', // 50px 전에 미리 로드
        threshold: 0.01
      });

      // 기존 이미지들에 적용
      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });

      // 새로 추가되는 이미지들을 위한 MutationObserver
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const lazyImages = element.querySelectorAll('img[data-src]');
              lazyImages.forEach((img) => imageObserver.observe(img));
            }
          });
        });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * 메모리 사용량 최적화
   */
  static optimizeMemoryUsage(): void {
    // 페이지 가시성 변경 시 메모리 정리
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // 백그라운드로 갈 때 메모리 정리
        this.cleanupMemory();
      }
    });

    // 메모리 압박 상황 감지 (지원하는 브라우저에서만)
    if ('memory' in performance) {
      const checkMemory = () => {
        const memInfo = (performance as any).memory;
        const usedRatio = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
        
        if (usedRatio > 0.8) {
          console.warn('High memory usage detected:', usedRatio);
          this.cleanupMemory();
        }
      };

      setInterval(checkMemory, 30000); // 30초마다 확인
    }
  }

  private static cleanupMemory(): void {
    // 캐시된 이미지 정리
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.getBoundingClientRect().width) {
        // 보이지 않는 이미지의 src 제거
        img.removeAttribute('src');
      }
    });

    // 가비지 컬렉션 힌트 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development' && 'gc' in window) {
      (window as any).gc();
    }
  }
}

/**
 * 제스처 인식기
 */
export class GestureRecognizer {
  private startX = 0;
  private startY = 0;
  private endX = 0;
  private endY = 0;
  private minSwipeDistance = 50;
  private maxSwipeTime = 300;
  private startTime = 0;

  constructor(
    private element: HTMLElement,
    private callbacks: {
      onSwipeLeft?: () => void;
      onSwipeRight?: () => void;
      onSwipeUp?: () => void;
      onSwipeDown?: () => void;
      onTap?: () => void;
      onDoubleTap?: () => void;
      onLongPress?: () => void;
    }
  ) {
    this.init();
  }

  private init(): void {
    let tapCount = 0;
    let tapTimer: NodeJS.Timeout;
    let longPressTimer: NodeJS.Timeout;

    this.element.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.startX = touch.clientX;
      this.startY = touch.clientY;
      this.startTime = Date.now();

      // 롱 프레스 타이머 시작
      longPressTimer = setTimeout(() => {
        this.callbacks.onLongPress?.();
      }, 500);
    }, { passive: true });

    this.element.addEventListener('touchmove', () => {
      // 터치 이동 시 롱 프레스 취소
      clearTimeout(longPressTimer);
    }, { passive: true });

    this.element.addEventListener('touchend', (e) => {
      clearTimeout(longPressTimer);

      const touch = e.changedTouches[0];
      this.endX = touch.clientX;
      this.endY = touch.clientY;

      const deltaX = this.endX - this.startX;
      const deltaY = this.endY - this.startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const duration = Date.now() - this.startTime;

      // 스와이프 감지
      if (distance > this.minSwipeDistance && duration < this.maxSwipeTime) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // 가로 스와이프
          if (deltaX > 0) {
            this.callbacks.onSwipeRight?.();
          } else {
            this.callbacks.onSwipeLeft?.();
          }
        } else {
          // 세로 스와이프
          if (deltaY > 0) {
            this.callbacks.onSwipeDown?.();
          } else {
            this.callbacks.onSwipeUp?.();
          }
        }
      }
      // 탭 감지
      else if (distance < 10 && duration < 300) {
        tapCount++;
        
        if (tapCount === 1) {
          tapTimer = setTimeout(() => {
            this.callbacks.onTap?.();
            tapCount = 0;
          }, 300);
        } else if (tapCount === 2) {
          clearTimeout(tapTimer);
          this.callbacks.onDoubleTap?.();
          tapCount = 0;
        }
      }
    }, { passive: true });
  }

  destroy(): void {
    // 이벤트 리스너 정리는 실제 구현에서 필요
  }
}

/**
 * 모바일 최적화 초기화
 */
export const initMobileOptimization = (): void => {
  // 터치 최적화
  TouchOptimizer.getInstance().init();

  // 뷰포트 최적화
  ViewportOptimizer.optimizeViewport();
  ViewportOptimizer.handleSafeArea();
  ViewportOptimizer.fix100vh();

  // 성능 최적화
  MobilePerformanceOptimizer.optimizeScrolling();
  MobilePerformanceOptimizer.optimizeImageLoading();
  MobilePerformanceOptimizer.optimizeMemoryUsage();

  console.log('Mobile optimization initialized');
};